// js/app.js - Main application initialization and coordination
class LLMObservabilityDemo {
    constructor() {
        this.isInitialized = false;
    }

    async initialize() {
        console.log('🚀 Initializing LLM Observability Demo...');

        try {
            // Wait for Datadog to be ready
            await this.waitForDatadog();
            
            // Initialize services
            this.initializeServices();
            
            // Initialize UI
            window.UIManager.initialize();
            
            // Mark Datadog as initialized if configured
            if (window.CONFIG.isDatadogConfigured()) {
                window.DatadogLLM.markInitialized();
            }
            
            this.isInitialized = true;
            console.log('✅ LLM Observability Demo initialized successfully');
            
            // Log app initialization
            if (window.DatadogLLM) {
                window.DatadogLLM.logLLMInteraction('app_initialized', {
                    version: window.CONFIG.DATADOG_VERSION,
                    site: window.CONFIG.DATADOG_SITE,
                    service: window.CONFIG.DATADOG_SERVICE,
                    env: window.CONFIG.DATADOG_ENV,
                    has_openai_config: window.CONFIG.isOpenAIConfigured(),
                    has_datadog_config: window.CONFIG.isDatadogConfigured()
                });
            }

        } catch (error) {
            console.error('❌ Failed to initialize LLM Observability Demo:', error);
        }
    }

    async waitForDatadog() {
        return new Promise((resolve) => {
            const checkDatadog = () => {
                if (window.DD_RUM && window.DD_LOGS) {
                    resolve();
                } else {
                    setTimeout(checkDatadog, 100);
                }
            };
            checkDatadog();
        });
    }

    initializeServices() {
        // Initialize OpenAI service with current config
        window.OpenAIService.initialize({
            apiKey: window.CONFIG.OPENAI_API_KEY,
            model: window.CONFIG.OPENAI_MODEL
        });

        console.log('📊 Services initialized:', {
            openai_configured: window.OpenAIService.isConfigured(),
            datadog_configured: window.CONFIG.isDatadogConfigured()
        });
    }

    // Test LLM observability functionality
    async testObservability() {
        if (!window.CONFIG.isOpenAIConfigured()) {
            console.warn('⚠️ OpenAI not configured - skipping observability test');
            return;
        }

        console.log('🧪 Testing LLM Observability...');

        try {
            // Test a simple chat interaction
            const response = await window.OpenAIService.chat([
                { role: 'user', content: 'Say "LLM Observability Test" and nothing else.' }
            ]);

            console.log('✅ LLM Observability test successful:', {
                response: response.content,
                tokens: response.usage.total_tokens,
                responseTime: response.responseTime
            });

            // Check if Datadog logging worked
            if (window.CONFIG.isDatadogConfigured()) {
                console.log('📊 Check your Datadog dashboard for LLM observability data');
            } else {
                console.log('⚠️ Datadog not configured - observability data logged to console only');
            }

        } catch (error) {
            console.error('❌ LLM Observability test failed:', error);
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    const app = new LLMObservabilityDemo();
    await app.initialize();
    
    // Make app available globally for testing
    window.LLMDemo = app;
    
    // Auto-test observability if OpenAI is configured
    if (window.CONFIG.isOpenAIConfigured()) {
        setTimeout(() => app.testObservability(), 1000);
    }
});
