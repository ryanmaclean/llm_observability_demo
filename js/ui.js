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
        document.getElementById('saveConfig').addEventListener('click', () => {
            this.saveConfiguration();
        });

        document.getElementById('resetConfig').addEventListener('click', () => {
            this.resetConfiguration();
        });

        // Custom site handling
        document.getElementById('ddSite').addEventListener('change', (e) => {
            const customContainer = document.getElementById('customSiteContainer');
            if (e.target.value === 'custom') {
                customContainer.style.display = 'block';
            } else {
                customContainer.style.display = 'none';
            }
        });

        this.loadConfiguration();
    }

    saveConfiguration() {
        // OpenAI configuration
        const apiKey = document.getElementById('apiKey').value.trim();
        const model = document.getElementById('model').value;

        // Datadog configuration
        const datadogConfig = {
            applicationId: document.getElementById('ddApplicationId').value.trim(),
            clientToken: document.getElementById('ddClientToken').value.trim(),
            site: document.getElementById('ddSite').value === 'custom' 
                ? document.getElementById('ddCustomSite').value.trim() 
                : document.getElementById('ddSite').value,
            service: document.getElementById('ddService').value.trim() || 'llm-observability-demo',
            env: document.getElementById('ddEnv').value,
            version: document.getElementById('ddVersion').value.trim() || '1.0.0',
            sessionSampleRate: parseInt(document.getElementById('ddSessionSampleRate').value) || 100,
            replaySampleRate: parseInt(document.getElementById('ddReplaySampleRate').value) || 20,
            trackUserInteractions: document.getElementById('ddTrackUserInteractions').checked,
            trackResources: document.getElementById('ddTrackResources').checked,
            trackLongTasks: document.getElementById('ddTrackLongTasks').checked
        };

        if (!apiKey) {
            this.showError('Please enter your OpenAI API key.');
            return;
        }

        // Update global config
        window.CONFIG.OPENAI_API_KEY = apiKey;
        window.CONFIG.OPENAI_MODEL = model;
        window.CONFIG.DATADOG_CLIENT_TOKEN = datadogConfig.clientToken;
        window.CONFIG.DATADOG_APPLICATION_ID = datadogConfig.applicationId;
        window.CONFIG.DATADOG_SITE = datadogConfig.site;
        window.CONFIG.DATADOG_SERVICE = datadogConfig.service;
        window.CONFIG.DATADOG_ENV = datadogConfig.env;
        window.CONFIG.DATADOG_VERSION = datadogConfig.version;

        // Save to localStorage
        window.CONFIG.save();

        // Update services
        window.OpenAIService.initialize({ apiKey, model });

        this.showSuccess('Configuration saved successfully!');
        
        // Log configuration update to Datadog
        if (window.DatadogLLM) {
            window.DatadogLLM.logConfigurationUpdate({ apiKey, model, datadogConfig });
        }
    }

    resetConfiguration() {
        // Reset form fields
        document.getElementById('apiKey').value = '';
        document.getElementById('model').value = 'gpt-4o-mini';
        document.getElementById('ddApplicationId').value = '';
        document.getElementById('ddClientToken').value = '';
        document.getElementById('ddSite').value = 'datadoghq.com';
        document.getElementById('ddCustomSite').value = '';
        document.getElementById('ddService').value = 'llm-observability-demo';
        document.getElementById('ddEnv').value = 'production';
        document.getElementById('ddVersion').value = '1.0.0';
        document.getElementById('ddSessionSampleRate').value = '100';
        document.getElementById('ddReplaySampleRate').value = '20';
        document.getElementById('ddTrackUserInteractions').checked = true;
        document.getElementById('ddTrackResources').checked = true;
        document.getElementById('ddTrackLongTasks').checked = true;
        
        // Hide custom site container
        document.getElementById('customSiteContainer').style.display = 'none';
        
        // Clear localStorage
        localStorage.removeItem('llm_demo_config');
        
        this.showSuccess('Configuration reset to defaults!');
    }

    loadConfiguration() {
        // Populate form fields from global config
        document.getElementById('apiKey').value = window.CONFIG.OPENAI_API_KEY;
        document.getElementById('model').value = window.CONFIG.OPENAI_MODEL;
        document.getElementById('ddApplicationId').value = window.CONFIG.DATADOG_APPLICATION_ID;
        document.getElementById('ddClientToken').value = window.CONFIG.DATADOG_CLIENT_TOKEN;
        document.getElementById('ddService').value = window.CONFIG.DATADOG_SERVICE;
        document.getElementById('ddEnv').value = window.CONFIG.DATADOG_ENV;
        document.getElementById('ddVersion').value = window.CONFIG.DATADOG_VERSION;
        
        // Handle site selection
        const siteSelect = document.getElementById('ddSite');
        const customContainer = document.getElementById('customSiteContainer');
        const customSiteInput = document.getElementById('ddCustomSite');
        
        if (window.CONFIG.DATADOG_SITE && !['datadoghq.com', 'datadoghq.eu', 'us3.datadoghq.com', 'us5.datadoghq.com', 'ap1.datadoghq.com'].includes(window.CONFIG.DATADOG_SITE)) {
            siteSelect.value = 'custom';
            customContainer.style.display = 'block';
            customSiteInput.value = window.CONFIG.DATADOG_SITE;
        } else {
            siteSelect.value = window.CONFIG.DATADOG_SITE || 'datadoghq.com';
            customContainer.style.display = 'none';
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
        const costPerToken = window.CONFIG.OPENAI_MODEL.includes('gpt-4o') ? 0.00003 : 0.000002;
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
