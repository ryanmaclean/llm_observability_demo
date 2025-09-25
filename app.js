// app.js
class LLMObservabilityDemo {
    constructor() {
        this.apiKey = '';
        this.model = 'gpt-4o-mini';
        this.datadogConfig = {
            applicationId: '',
            clientToken: '',
            site: 'datadoghq.com',
            service: 'llm-observability-demo',
            env: 'production',
            version: '1.0.0',
            sessionSampleRate: 100,
            replaySampleRate: 20,
            trackUserInteractions: true,
            trackResources: true,
            trackLongTasks: true
        };
        this.sessionMetrics = {
            tokenCount: 0,
            requestCount: 0,
            totalCost: 0,
            responseTimes: []
        };
        
        this.initializeApp();
        this.loadConfiguration();
    }

    initializeApp() {
        // Mode switching
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchMode(e.target.dataset.mode);
            });
        });

        // Chat functionality
        document.getElementById('sendBtn').addEventListener('click', () => {
            this.sendChatMessage();
        });

        document.getElementById('chatInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendChatMessage();
            }
        });

        // Summarize functionality
        document.getElementById('summarizeBtn').addEventListener('click', () => {
            this.summarizeText();
        });

        // Code generation functionality
        document.getElementById('codegenBtn').addEventListener('click', () => {
            this.generateCode();
        });

        // Configuration
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

        // Initialize Datadog RUM logging
        this.initializeDatadogLogging();
    }

    switchMode(mode) {
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
        if (window.DD_RUM) {
            DD_RUM.addAction('mode_switch', {
                mode: mode,
                timestamp: Date.now()
            });
        }
    }

    async sendChatMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (!message) return;
        if (!this.apiKey) {
            this.showError('Please configure your OpenAI API key first.');
            return;
        }

        // Add user message to chat
        this.addMessage(message, 'user');
        input.value = '';
        
        // Disable send button
        const sendBtn = document.getElementById('sendBtn');
        sendBtn.disabled = true;
        sendBtn.innerHTML = '<span class="loading"></span>';

        try {
            const startTime = Date.now();
            const response = await this.callOpenAI([
                { role: 'user', content: message }
            ]);
            const responseTime = Date.now() - startTime;

            this.addMessage(response.content, 'assistant');
            this.updateMetrics(response.usage, responseTime);

            // Log to Datadog
            this.logToDatadog('chat_interaction', {
                mode: 'chat',
                prompt_tokens: response.usage.prompt_tokens,
                completion_tokens: response.usage.completion_tokens,
                total_tokens: response.usage.total_tokens,
                response_time: responseTime,
                model: this.model
            });

        } catch (error) {
            this.showError(`Error: ${error.message}`);
            console.error('Chat error:', error);
        } finally {
            sendBtn.disabled = false;
            sendBtn.innerHTML = 'Send';
        }
    }

    async summarizeText() {
        const input = document.getElementById('summarizeInput');
        const text = input.value.trim();
        
        if (!text) {
            this.showError('Please enter text to summarize.');
            return;
        }
        if (!this.apiKey) {
            this.showError('Please configure your OpenAI API key first.');
            return;
        }

        const btn = document.getElementById('summarizeBtn');
        btn.disabled = true;
        btn.innerHTML = '<span class="loading"></span> Summarizing...';

        try {
            const startTime = Date.now();
            const response = await this.callOpenAI([
                { 
                    role: 'system', 
                    content: 'You are a helpful assistant that creates concise, accurate summaries of text. Focus on the main points and key information.' 
                },
                { role: 'user', content: `Please summarize the following text:\n\n${text}` }
            ]);
            const responseTime = Date.now() - startTime;

            document.getElementById('summarizeOutput').textContent = response.content;
            this.updateMetrics(response.usage, responseTime);

            // Log to Datadog
            this.logToDatadog('summarize_interaction', {
                mode: 'summarize',
                input_length: text.length,
                prompt_tokens: response.usage.prompt_tokens,
                completion_tokens: response.usage.completion_tokens,
                total_tokens: response.usage.total_tokens,
                response_time: responseTime,
                model: this.model
            });

        } catch (error) {
            this.showError(`Error: ${error.message}`);
            console.error('Summarize error:', error);
        } finally {
            btn.disabled = false;
            btn.innerHTML = 'Summarize';
        }
    }

    async generateCode() {
        const input = document.getElementById('codegenInput');
        const prompt = input.value.trim();
        
        if (!prompt) {
            this.showError('Please describe what code you want me to generate.');
            return;
        }
        if (!this.apiKey) {
            this.showError('Please configure your OpenAI API key first.');
            return;
        }

        const btn = document.getElementById('codegenBtn');
        btn.disabled = true;
        btn.innerHTML = '<span class="loading"></span> Generating...';

        try {
            const startTime = Date.now();
            const response = await this.callOpenAI([
                { 
                    role: 'system', 
                    content: 'You are a helpful coding assistant. Generate clean, well-commented code based on user requests. Include explanations when helpful.' 
                },
                { role: 'user', content: prompt }
            ]);
            const responseTime = Date.now() - startTime;

            document.getElementById('codegenOutput').textContent = response.content;
            this.updateMetrics(response.usage, responseTime);

            // Log to Datadog
            this.logToDatadog('codegen_interaction', {
                mode: 'codegen',
                prompt_length: prompt.length,
                prompt_tokens: response.usage.prompt_tokens,
                completion_tokens: response.usage.completion_tokens,
                total_tokens: response.usage.total_tokens,
                response_time: responseTime,
                model: this.model
            });

        } catch (error) {
            this.showError(`Error: ${error.message}`);
            console.error('Code generation error:', error);
        } finally {
            btn.disabled = false;
            btn.innerHTML = 'Generate Code';
        }
    }

    async callOpenAI(messages) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: this.model,
                messages: messages,
                temperature: 0.7,
                max_tokens: 2000
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'API request failed');
        }

        const data = await response.json();
        return {
            content: data.choices[0].message.content,
            usage: data.usage
        };
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
        const costPerToken = this.model.includes('gpt-4o') ? 0.00003 : 0.000002;
        this.sessionMetrics.totalCost += usage.total_tokens * costPerToken;

        // Update UI
        document.getElementById('tokenCount').textContent = this.sessionMetrics.tokenCount.toLocaleString();
        document.getElementById('costEstimate').textContent = `$${this.sessionMetrics.totalCost.toFixed(4)}`;
        document.getElementById('requestCount').textContent = this.sessionMetrics.requestCount;
        
        const avgResponseTime = this.sessionMetrics.responseTimes.reduce((a, b) => a + b, 0) / this.sessionMetrics.responseTimes.length;
        document.getElementById('avgResponseTime').textContent = `${Math.round(avgResponseTime)}ms`;
    }

    saveConfiguration() {
        // OpenAI configuration
        this.apiKey = document.getElementById('apiKey').value.trim();
        this.model = document.getElementById('model').value;

        // Datadog configuration
        this.datadogConfig.applicationId = document.getElementById('ddApplicationId').value.trim();
        this.datadogConfig.clientToken = document.getElementById('ddClientToken').value.trim();
        
        const siteSelect = document.getElementById('ddSite').value;
        this.datadogConfig.site = siteSelect === 'custom' 
            ? document.getElementById('ddCustomSite').value.trim() 
            : siteSelect;
            
        this.datadogConfig.service = document.getElementById('ddService').value.trim() || 'llm-observability-demo';
        this.datadogConfig.env = document.getElementById('ddEnv').value;
        this.datadogConfig.version = document.getElementById('ddVersion').value.trim() || '1.0.0';
        this.datadogConfig.sessionSampleRate = parseInt(document.getElementById('ddSessionSampleRate').value) || 100;
        this.datadogConfig.replaySampleRate = parseInt(document.getElementById('ddReplaySampleRate').value) || 20;
        this.datadogConfig.trackUserInteractions = document.getElementById('ddTrackUserInteractions').checked;
        this.datadogConfig.trackResources = document.getElementById('ddTrackResources').checked;
        this.datadogConfig.trackLongTasks = document.getElementById('ddTrackLongTasks').checked;

        if (!this.apiKey) {
            this.showError('Please enter your OpenAI API key.');
            return;
        }

        // Save to localStorage
        localStorage.setItem('llm_demo_config', JSON.stringify({
            apiKey: this.apiKey,
            model: this.model,
            datadogConfig: this.datadogConfig
        }));

        this.showSuccess('Configuration saved successfully!');
        
        // Reinitialize Datadog with new configuration
        this.initializeDatadogLogging();
        
        // Log configuration update to Datadog
        this.logToDatadog('configuration_update', {
            model: this.model,
            has_api_key: !!this.apiKey,
            has_datadog_config: !!(this.datadogConfig.applicationId && this.datadogConfig.clientToken),
            site: this.datadogConfig.site,
            service: this.datadogConfig.service,
            env: this.datadogConfig.env
        });
    }

    loadConfiguration() {
        const saved = localStorage.getItem('llm_demo_config');
        if (saved) {
            const config = JSON.parse(saved);
            this.apiKey = config.apiKey || '';
            this.model = config.model || 'gpt-4o-mini';
            
            // Load Datadog configuration
            if (config.datadogConfig) {
                this.datadogConfig = { ...this.datadogConfig, ...config.datadogConfig };
            }
            
            // Populate form fields
            document.getElementById('apiKey').value = this.apiKey;
            document.getElementById('model').value = this.model;
            document.getElementById('ddApplicationId').value = this.datadogConfig.applicationId;
            document.getElementById('ddClientToken').value = this.datadogConfig.clientToken;
            document.getElementById('ddService').value = this.datadogConfig.service;
            document.getElementById('ddEnv').value = this.datadogConfig.env;
            document.getElementById('ddVersion').value = this.datadogConfig.version;
            document.getElementById('ddSessionSampleRate').value = this.datadogConfig.sessionSampleRate;
            document.getElementById('ddReplaySampleRate').value = this.datadogConfig.replaySampleRate;
            document.getElementById('ddTrackUserInteractions').checked = this.datadogConfig.trackUserInteractions;
            document.getElementById('ddTrackResources').checked = this.datadogConfig.trackResources;
            document.getElementById('ddTrackLongTasks').checked = this.datadogConfig.trackLongTasks;
            
            // Handle site selection
            const siteSelect = document.getElementById('ddSite');
            const customContainer = document.getElementById('customSiteContainer');
            const customSiteInput = document.getElementById('ddCustomSite');
            
            if (this.datadogConfig.site && !['datadoghq.com', 'datadoghq.eu', 'us3.datadoghq.com', 'us5.datadoghq.com', 'ap1.datadoghq.com'].includes(this.datadogConfig.site)) {
                siteSelect.value = 'custom';
                customContainer.style.display = 'block';
                customSiteInput.value = this.datadogConfig.site;
            } else {
                siteSelect.value = this.datadogConfig.site || 'datadoghq.com';
                customContainer.style.display = 'none';
            }
        }
    }

    resetConfiguration() {
        // Reset to defaults
        this.apiKey = '';
        this.model = 'gpt-4o-mini';
        this.datadogConfig = {
            applicationId: '',
            clientToken: '',
            site: 'datadoghq.com',
            service: 'llm-observability-demo',
            env: 'production',
            version: '1.0.0',
            sessionSampleRate: 100,
            replaySampleRate: 20,
            trackUserInteractions: true,
            trackResources: true,
            trackLongTasks: true
        };
        
        // Clear localStorage
        localStorage.removeItem('llm_demo_config');
        
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
        
        this.showSuccess('Configuration reset to defaults!');
    }

    initializeDatadogLogging() {
        // Only initialize if we have valid Datadog configuration
        if (!this.datadogConfig.applicationId || !this.datadogConfig.clientToken) {
            console.log('Datadog RUM not initialized: Missing Application ID or Client Token');
            return;
        }

        // Set up custom logging for LLM interactions
        if (window.DD_RUM) {
            // Reinitialize with current configuration
            try {
                DD_RUM.init({
                    applicationId: this.datadogConfig.applicationId,
                    clientToken: this.datadogConfig.clientToken,
                    site: this.datadogConfig.site,
                    service: this.datadogConfig.service,
                    env: this.datadogConfig.env,
                    version: this.datadogConfig.version,
                    sessionSampleRate: this.datadogConfig.sessionSampleRate,
                    sessionReplaySampleRate: this.datadogConfig.replaySampleRate,
                    trackUserInteractions: this.datadogConfig.trackUserInteractions,
                    trackResources: this.datadogConfig.trackResources,
                    trackLongTasks: this.datadogConfig.trackLongTasks,
                    defaultPrivacyLevel: 'mask-user-input'
                });
                
                DD_RUM.addAction('app_initialized', {
                    timestamp: Date.now(),
                    version: this.datadogConfig.version,
                    site: this.datadogConfig.site,
                    service: this.datadogConfig.service,
                    env: this.datadogConfig.env
                });
                
                console.log('Datadog RUM initialized successfully');
            } catch (error) {
                console.error('Failed to initialize Datadog RUM:', error);
            }
        }
    }

    logToDatadog(action, data) {
        if (window.DD_RUM) {
            DD_RUM.addAction(action, {
                ...data,
                timestamp: Date.now(),
                session_id: this.getSessionId()
            });
        }

        // Also log to console for debugging
        console.log(`[Datadog Log] ${action}:`, data);
    }

    getSessionId() {
        let sessionId = sessionStorage.getItem('llm_demo_session_id');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('llm_demo_session_id', sessionId);
        }
        return sessionId;
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

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LLMObservabilityDemo();
});
