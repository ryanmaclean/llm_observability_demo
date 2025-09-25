// js/datadog.js - Datadog RUM and Logs integration for LLM Observability
class DatadogLLMObservability {
    constructor() {
        this.isInitialized = false;
        this.sessionId = this.generateSessionId();
    }

    generateSessionId() {
        let sessionId = sessionStorage.getItem('llm_demo_session_id');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('llm_demo_session_id', sessionId);
        }
        return sessionId;
    }

    // Log LLM interaction to Datadog
    logLLMInteraction(type, data) {
        if (!this.isInitialized || !window.DD_RUM) {
            console.log(`[Datadog Log] ${type}:`, data);
            return;
        }

        try {
            const actionData = {
                ...data,
                timestamp: Date.now(),
                session_id: this.sessionId,
                interaction_type: type,
                application_type: 'llm_demo'
            };

            window.DD_RUM.addAction(`llm_${type}`, actionData);

            // Also log to DD_LOGS if available
            if (window.DD_LOGS && window.DD_LOGS.logger) {
                window.DD_LOGS.logger.info(`LLM ${type}`, actionData);
            }

        } catch (error) {
            console.error('Failed to log to Datadog:', error);
        }
    }

    // Log LLM request with detailed metrics
    logLLMRequest(mode, prompt, response, usage, responseTime, model) {
        this.logLLMInteraction('request', {
            mode: mode,
            model: model,
            prompt_length: prompt.length,
            response_length: response.length,
            prompt_tokens: usage.prompt_tokens,
            completion_tokens: usage.completion_tokens,
            total_tokens: usage.total_tokens,
            response_time_ms: responseTime,
            cost_estimate: this.calculateCost(usage.total_tokens, model)
        });
    }

    // Log LLM error
    logLLMError(mode, error, prompt) {
        this.logLLMInteraction('error', {
            mode: mode,
            error_message: error.message,
            error_type: error.name,
            prompt_length: prompt ? prompt.length : 0,
            timestamp: Date.now()
        });

        // Also log error to DD_RUM
        if (window.DD_RUM) {
            window.DD_RUM.addError(error, {
                mode: mode,
                prompt_length: prompt ? prompt.length : 0
            });
        }
    }

    // Log configuration changes
    logConfigurationUpdate(config) {
        this.logLLMInteraction('config_update', {
            has_openai_key: !!config.apiKey,
            model: config.model,
            has_datadog_config: !!(config.datadogConfig && config.datadogConfig.clientToken),
            site: config.datadogConfig?.site,
            service: config.datadogConfig?.service,
            env: config.datadogConfig?.env
        });
    }

    // Log mode switches
    logModeSwitch(fromMode, toMode) {
        this.logLLMInteraction('mode_switch', {
            from_mode: fromMode,
            to_mode: toMode,
            timestamp: Date.now()
        });
    }

    // Log session metrics
    logSessionMetrics(metrics) {
        this.logLLMInteraction('session_metrics', {
            token_count: metrics.tokenCount,
            request_count: metrics.requestCount,
            total_cost: metrics.totalCost,
            avg_response_time: metrics.responseTimes.length > 0 
                ? metrics.responseTimes.reduce((a, b) => a + b, 0) / metrics.responseTimes.length 
                : 0
        });
    }

    // Calculate estimated cost based on token usage and model
    calculateCost(tokens, model) {
        const costPerToken = {
            'gpt-4o': 0.00003,
            'gpt-4o-mini': 0.000002,
            'gpt-3.5-turbo': 0.000002
        };
        return tokens * (costPerToken[model] || 0.000002);
    }

    // Set global context for all future logs
    setGlobalContext(key, value) {
        if (window.DD_RUM && window.DD_RUM.setGlobalContextProperty) {
            window.DD_RUM.setGlobalContextProperty(key, value);
        }
    }

    // Mark as initialized
    markInitialized() {
        this.isInitialized = true;
        console.log('✅ Datadog LLM Observability initialized');
    }
}

// Create global instance
window.DatadogLLM = new DatadogLLMObservability();
