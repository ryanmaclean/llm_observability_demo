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
            
            // Mark Datadog as ready
            window.DatadogLLM.markInitialized();
            
            this.isInitialized = true;
            console.log('✅ LLM Observability Demo initialized successfully');
            
            // Log app initialization
            if (window.DatadogLLM) {
                window.DatadogLLM.logLLMInteraction('app_initialized', {
                    version: '1.0.0',
                    deployment_method: 'static_hosting',
                    framework: 'vanilla_js',
                    has_openai_config: window.OpenAIService.isConfigured(),
                    datadog_ready: true
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
        // Initialize OpenAI service (will be configured by user in UI)
        window.OpenAIService.initialize({
            apiKey: '',
            model: 'gpt-4o-mini'
        });

        console.log('📊 Services initialized:', {
            openai_configured: window.OpenAIService.isConfigured(),
            datadog_ready: true
        });
    }

    // Test LLM observability functionality
    async testObservability() {
        if (!window.OpenAIService.isConfigured()) {
            console.warn('⚠️ OpenAI not configured - skipping observability test');
            console.log('📝 To test observability:');
            console.log('   1. Enter your OpenAI API key in the configuration panel');
            console.log('   2. Try a chat interaction');
            console.log('   3. Check browser console for Datadog logs');
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

            console.log('📊 Check your Datadog dashboard for LLM observability data');
            console.log('📝 If Datadog is not configured, data is logged to console');

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
    if (window.OpenAIService.isConfigured()) {
        setTimeout(() => app.testObservability(), 1000);
    }
});
