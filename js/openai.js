// js/openai.js - OpenAI API integration with observability
class OpenAIService {
    constructor() {
        this.apiKey = '';
        this.model = 'gpt-4o-mini';
        this.baseURL = 'https://api.openai.com/v1';
    }

    // Initialize with configuration
    initialize(config) {
        this.apiKey = config.apiKey;
        this.model = config.model;
    }

    // Make API call with comprehensive observability
    async makeRequest(messages, mode = 'chat') {
        if (!this.apiKey) {
            throw new Error('OpenAI API key not configured');
        }

        const startTime = Date.now();
        
        try {
            const response = await fetch(`${this.baseURL}/chat/completions`, {
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

            const responseTime = Date.now() - startTime;

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
            }

            const data = await response.json();
            const completion = data.choices[0].message.content;
            const usage = data.usage;

            // Log successful request to Datadog
            if (window.DatadogLLM) {
                const prompt = messages.map(m => m.content).join('\n');
                window.DatadogLLM.logLLMRequest(mode, prompt, completion, usage, responseTime, this.model);
            }

            return {
                content: completion,
                usage: usage,
                responseTime: responseTime
            };

        } catch (error) {
            const responseTime = Date.now() - startTime;
            
            // Log error to Datadog
            if (window.DatadogLLM) {
                const prompt = messages.map(m => m.content).join('\n');
                window.DatadogLLM.logLLMError(mode, error, prompt);
            }

            throw error;
        }
    }

    // Chat completion
    async chat(messages) {
        return this.makeRequest(messages, 'chat');
    }

    // Summarization
    async summarize(text) {
        const messages = [
            { 
                role: 'system', 
                content: 'You are a helpful assistant that creates concise, accurate summaries of text. Focus on the main points and key information.' 
            },
            { role: 'user', content: `Please summarize the following text:\n\n${text}` }
        ];
        return this.makeRequest(messages, 'summarize');
    }

    // Code generation
    async generateCode(prompt) {
        const messages = [
            { 
                role: 'system', 
                content: 'You are a helpful coding assistant. Generate clean, well-commented code based on user requests. Include explanations when helpful.' 
            },
            { role: 'user', content: prompt }
        ];
        return this.makeRequest(messages, 'codegen');
    }

    // Check if API key is valid
    isConfigured() {
        return this.apiKey && this.apiKey.startsWith('sk-');
    }
}

// Create global instance
window.OpenAIService = new OpenAIService();
