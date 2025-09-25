// js/ui.js - UI management and user interactions
class UIManager {
    constructor() {
        this.currentMode = 'chat';
        this.sessionMetrics = {
            tokenCount: 0,
            requestCount: 0,
            totalCost: 0,
            responseTimes: []
        };
    }

    // Initialize UI event listeners
    initialize() {
        this.setupModeSwitching();
        this.setupChatInterface();
        this.setupSummarizeInterface();
        this.setupCodegenInterface();
        this.setupConfiguration();
        this.updateMetricsDisplay();
    }

    setupModeSwitching() {
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchMode(e.target.dataset.mode);
            });
        });
    }

    switchMode(mode) {
        const previousMode = this.currentMode;
        this.currentMode = mode;

        // Update active button
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-mode="${mode}"]`).classList.add('active');

        // Show/hide containers
        document.querySelectorAll('.main-content > div').forEach(container => {
            container.classList.add('hidden');
        });
        document.getElementById(`${mode}Mode`).classList.remove('hidden');

        // Log mode switch to Datadog
        if (window.DatadogLLM) {
            window.DatadogLLM.logModeSwitch(previousMode, mode);
        }
    }

    setupChatInterface() {
        document.getElementById('sendBtn').addEventListener('click', () => {
            this.handleChatMessage();
        });

        document.getElementById('chatInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleChatMessage();
            }
        });
    }

    async handleChatMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (!message) return;

        // Add user message to chat
        this.addMessage(message, 'user');
        input.value = '';
        
        // Disable send button
        const sendBtn = document.getElementById('sendBtn');
        sendBtn.disabled = true;
        sendBtn.innerHTML = '<span class="loading"></span>';

        try {
            const response = await window.OpenAIService.chat([
                { role: 'user', content: message }
            ]);

            this.addMessage(response.content, 'assistant');
            this.updateMetrics(response.usage, response.responseTime);

        } catch (error) {
            this.showError(`Error: ${error.message}`);
            console.error('Chat error:', error);
        } finally {
            sendBtn.disabled = false;
            sendBtn.innerHTML = 'Send';
        }
    }

    setupSummarizeInterface() {
        document.getElementById('summarizeBtn').addEventListener('click', () => {
            this.handleSummarize();
        });
    }

    async handleSummarize() {
        const input = document.getElementById('summarizeInput');
        const text = input.value.trim();
        
        if (!text) {
            this.showError('Please enter text to summarize.');
            return;
        }

        const btn = document.getElementById('summarizeBtn');
        btn.disabled = true;
        btn.innerHTML = '<span class="loading"></span> Summarizing...';

        try {
            const response = await window.OpenAIService.summarize(text);
            document.getElementById('summarizeOutput').textContent = response.content;
            this.updateMetrics(response.usage, response.responseTime);

        } catch (error) {
            this.showError(`Error: ${error.message}`);
            console.error('Summarize error:', error);
        } finally {
            btn.disabled = false;
            btn.innerHTML = 'Summarize';
        }
    }

    setupCodegenInterface() {
        document.getElementById('codegenBtn').addEventListener('click', () => {
            this.handleCodegen();
        });
    }

    async handleCodegen() {
        const input = document.getElementById('codegenInput');
        const prompt = input.value.trim();
        
        if (!prompt) {
            this.showError('Please describe what code you want me to generate.');
            return;
        }

        const btn = document.getElementById('codegenBtn');
        btn.disabled = true;
        btn.innerHTML = '<span class="loading"></span> Generating...';

        try {
            const response = await window.OpenAIService.generateCode(prompt);
            document.getElementById('codegenOutput').textContent = response.content;
            this.updateMetrics(response.usage, response.responseTime);

        } catch (error) {
            this.showError(`Error: ${error.message}`);
            console.error('Code generation error:', error);
        } finally {
            btn.disabled = false;
            btn.innerHTML = 'Generate Code';
        }
    }

    setupConfiguration() {
        // Add event listener for OpenAI API key input
        const apiKeyInput = document.getElementById('apiKey');
        if (apiKeyInput) {
            apiKeyInput.addEventListener('input', () => {
                this.saveOpenAIKey();
            });
        }

        // Add event listener for model selection
        const modelSelect = document.getElementById('model');
        if (modelSelect) {
            modelSelect.addEventListener('change', () => {
                this.saveOpenAIKey();
            });
        }

        this.loadConfiguration();
    }

    saveOpenAIKey() {
        const apiKey = document.getElementById('apiKey').value.trim();
        const model = document.getElementById('model').value;

        if (apiKey) {
            // Save to localStorage
            localStorage.setItem('openai_api_key', apiKey);
            localStorage.setItem('openai_model', model);

            // Update OpenAI service
            window.OpenAIService.initialize({ apiKey, model });

            console.log('✅ OpenAI configuration saved');
            
            // Log configuration update to Datadog
            if (window.DatadogLLM) {
                window.DatadogLLM.logConfigurationUpdate({ 
                    apiKey: apiKey.substring(0, 10) + '...', 
                    model 
                });
            }
        }
    }

    resetConfiguration() {
        // Reset OpenAI form fields
        document.getElementById('apiKey').value = '';
        document.getElementById('model').value = 'gpt-4o-mini';
        
        // Clear localStorage
        localStorage.removeItem('openai_api_key');
        localStorage.removeItem('openai_model');
        
        // Reinitialize OpenAI service with empty config
        window.OpenAIService.initialize({ apiKey: '', model: 'gpt-4o-mini' });
        
        console.log('✅ OpenAI configuration reset');
    }

    loadConfiguration() {
        // Load OpenAI configuration from localStorage
        const savedApiKey = localStorage.getItem('openai_api_key');
        const savedModel = localStorage.getItem('openai_model');

        if (savedApiKey) {
            document.getElementById('apiKey').value = savedApiKey;
            document.getElementById('model').value = savedModel || 'gpt-4o-mini';
            
            // Initialize OpenAI service with saved config
            window.OpenAIService.initialize({ 
                apiKey: savedApiKey, 
                model: savedModel || 'gpt-4o-mini' 
            });
            
            console.log('✅ OpenAI configuration loaded from localStorage');
        }
    }

    addMessage(content, sender) {
        const messagesContainer = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        messageDiv.textContent = content;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    updateMetrics(usage, responseTime) {
        this.sessionMetrics.tokenCount += usage.total_tokens;
        this.sessionMetrics.requestCount++;
        this.sessionMetrics.responseTimes.push(responseTime);

        // Calculate cost (approximate rates)
        const model = localStorage.getItem('openai_model') || 'gpt-4o-mini';
        const costPerToken = model.includes('gpt-4o') ? 0.00003 : 0.000002;
        this.sessionMetrics.totalCost += usage.total_tokens * costPerToken;

        // Update UI
        document.getElementById('tokenCount').textContent = this.sessionMetrics.tokenCount.toLocaleString();
        document.getElementById('costEstimate').textContent = `$${this.sessionMetrics.totalCost.toFixed(4)}`;
        document.getElementById('requestCount').textContent = this.sessionMetrics.requestCount;
        
        const avgResponseTime = this.sessionMetrics.responseTimes.reduce((a, b) => a + b, 0) / this.sessionMetrics.responseTimes.length;
        document.getElementById('avgResponseTime').textContent = `${Math.round(avgResponseTime)}ms`;

        // Log session metrics to Datadog
        if (window.DatadogLLM) {
            window.DatadogLLM.logSessionMetrics(this.sessionMetrics);
        }
    }

    updateMetricsDisplay() {
        document.getElementById('tokenCount').textContent = this.sessionMetrics.tokenCount.toLocaleString();
        document.getElementById('costEstimate').textContent = `$${this.sessionMetrics.totalCost.toFixed(4)}`;
        document.getElementById('requestCount').textContent = this.sessionMetrics.requestCount;
        
        const avgResponseTime = this.sessionMetrics.responseTimes.length > 0 
            ? this.sessionMetrics.responseTimes.reduce((a, b) => a + b, 0) / this.sessionMetrics.responseTimes.length 
            : 0;
        document.getElementById('avgResponseTime').textContent = `${Math.round(avgResponseTime)}ms`;
    }

    showError(message) {
        // Remove existing alerts
        document.querySelectorAll('.error, .success').forEach(alert => alert.remove());
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error';
        errorDiv.textContent = message;
        document.querySelector('.main-content').insertBefore(errorDiv, document.querySelector('.main-content').firstChild);
        
        setTimeout(() => errorDiv.remove(), 5000);
    }

    showSuccess(message) {
        // Remove existing alerts
        document.querySelectorAll('.error, .success').forEach(alert => alert.remove());
        
        const successDiv = document.createElement('div');
        successDiv.className = 'success';
        successDiv.textContent = message;
        document.querySelector('.main-content').insertBefore(successDiv, document.querySelector('.main-content').firstChild);
        
        setTimeout(() => successDiv.remove(), 3000);
    }
}

// Create global instance
window.UIManager = new UIManager();
