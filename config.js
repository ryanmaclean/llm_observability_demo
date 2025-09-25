// config.js - Configuration management for the LLM Observability Demo
window.CONFIG = {
    // Default configuration values
    OPENAI_API_KEY: '',
    OPENAI_MODEL: 'gpt-4o-mini',
    
    // Datadog Configuration (hardcoded - these are public values)
    DATADOG_CLIENT_TOKEN: 'pub941f8b1659ac0af8597b9c41a0cfe121',
    DATADOG_APPLICATION_ID: 'fde3bfb4-cc7c-49ad-82c2-9fed18ce298c',
    DATADOG_SITE: 'datadoghq.com',
    DATADOG_SERVICE: 'llm-observability-demo',
    DATADOG_ENV: 'production',
    DATADOG_VERSION: '1.0.0',
    
    // Load configuration from localStorage or environment
    load: function() {
        try {
            const saved = localStorage.getItem('llm_demo_config');
            if (saved) {
                const config = JSON.parse(saved);
                
                // Load OpenAI config
                this.OPENAI_API_KEY = config.apiKey || '';
                this.OPENAI_MODEL = config.model || 'gpt-4o-mini';
                
                // Load Datadog config
                if (config.datadogConfig) {
                    this.DATADOG_CLIENT_TOKEN = config.datadogConfig.clientToken || '';
                    this.DATADOG_APPLICATION_ID = config.datadogConfig.applicationId || '';
                    this.DATADOG_SITE = config.datadogConfig.site || 'datadoghq.com';
                    this.DATADOG_SERVICE = config.datadogConfig.service || 'llm-observability-demo';
                    this.DATADOG_ENV = config.datadogConfig.env || 'production';
                    this.DATADOG_VERSION = config.datadogConfig.version || '1.0.0';
                }
            }
        } catch (error) {
            console.error('Failed to load configuration:', error);
        }
    },
    
    // Save configuration to localStorage
    save: function() {
        try {
            const config = {
                apiKey: this.OPENAI_API_KEY,
                model: this.OPENAI_MODEL,
                datadogConfig: {
                    clientToken: this.DATADOG_CLIENT_TOKEN,
                    applicationId: this.DATADOG_APPLICATION_ID,
                    site: this.DATADOG_SITE,
                    service: this.DATADOG_SERVICE,
                    env: this.DATADOG_ENV,
                    version: this.DATADOG_VERSION
                }
            };
            localStorage.setItem('llm_demo_config', JSON.stringify(config));
        } catch (error) {
            console.error('Failed to save configuration:', error);
        }
    },
    
    // Check if Datadog is properly configured
    isDatadogConfigured: function() {
        return this.DATADOG_CLIENT_TOKEN && 
               this.DATADOG_APPLICATION_ID &&
               this.DATADOG_CLIENT_TOKEN !== 'YOUR_DATADOG_CLIENT_TOKEN' &&
               this.DATADOG_APPLICATION_ID !== 'YOUR_DATADOG_APPLICATION_ID';
    },
    
    // Check if OpenAI is configured
    isOpenAIConfigured: function() {
        return this.OPENAI_API_KEY && this.OPENAI_API_KEY.startsWith('sk-');
    }
};

// Load configuration on page load
window.CONFIG.load();
