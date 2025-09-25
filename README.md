# LLM Observability Demo with Datadog

A comprehensive demonstration of LLM observability using Datadog's RUM, Logs, and custom metrics to monitor AI-powered applications.

## Overview

This application demonstrates how to implement complete observability for Large Language Model applications using Datadog. It features a modern web interface that integrates with OpenAI's GPT models and provides comprehensive monitoring through Datadog's observability platform.

**Live Demo**: [GitHub Pages Deployment](https://your-username.github.io/llm_observability_demo)

## Architecture

- **Frontend**: Vanilla JavaScript SPA with modern UI
- **LLM Integration**: Direct OpenAI API integration
- **Observability**: Datadog RUM, Logs SDK, and custom metrics
- **Deployment**: GitHub Pages compatible (static hosting)

## Features

- 🤖 **Three LLM Interaction Modes**:
  - Chat: General conversation
  - Summarize: Text summarization
  - Code Gen: Code generation assistance

- 📊 **Comprehensive Datadog Integration**:
  - Real User Monitoring (RUM) for user experience tracking
  - Structured logging for all LLM interactions
  - Custom metrics for token usage and costs
  - Performance monitoring and error tracking

- 💰 **Cost Monitoring**:
  - Real-time token usage tracking
  - Cost calculation by model
  - Session-based usage analytics

- 🎯 **Observability Features**:
  - Request/response correlation
  - User session tracking
  - Performance metrics
  - Error monitoring and alerting

## Getting Started

### Prerequisites

- Python 3.8+
- OpenAI API key
- Datadog API key (optional, for observability)

### Quick Start

1. **Clone and setup**:
   ```bash
   git clone https://github.com/ryanmaclean/llm_observability_demo.git
   cd llm_observability_demo
   ```

2. **Configure environment**:
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` and add your API keys:
   ```env
   OPENAI_KEY=your_openai_api_key_here
   DD_API_KEY=your_datadog_api_key_here
   ```

3. **Run the application**:
   ```bash
   ./run.sh
   ```
   
   Or manually:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   python main.py
   ```

### Testing with Environment Variables

**Recommended: Use the test script that properly sources .env.local**
```bash
npm test
# or directly:
./test-local.sh
```

This script will:
- Load all environment variables from `.env.local`
- Validate that required keys are set
- Start the server with proper configuration
- Show clear status of all API keys

**Alternative: Standard npm start**
```bash
npm start
```

**Verification:**
The server startup will show your configuration status:
```
🚀 LLM Observability Demo Server
Configuration:
- OpenAI API Key: ✅ Loaded
- Datadog Client Token: ✅ Loaded (or ❌ Missing)
- Datadog App ID: ✅ Loaded (or ❌ Missing)
```

## Usage

### The Furnish Hub AI Assistant

This demo features a customer support AI assistant for "The Furnish Hub" furniture store. The assistant can help with:

- Product information and recommendations
- Pricing and availability inquiries  
- Store policies (returns, shipping, etc.)
- General furniture questions

### Running with Observability

To run with Datadog LLM Observability enabled:

```bash
# Set up environment variables
export OPENAI_API_KEY="your_key_here"
export DD_API_KEY="your_datadog_key_here"

# Run with automatic instrumentation
DD_LLMOBS_ENABLED=1 \
DD_LLMOBS_ML_APP="furnish-hub-support-ai" \
DD_SITE="datadoghq.com" \
DD_LLMOBS_AGENTLESS_ENABLED=1 \
ddtrace-run python main.py
```

### Example Interaction

```
Welcome to The Furnish Hub! How can I help you today? (Type 'exit' to quit)

You: Do you have any oak coffee tables under $300?
Assistant: Yes! We have several beautiful oak coffee tables under $300. 
Our "Rustic Oak Coffee Table" is currently $249 and features a solid oak 
construction with a natural finish. We also have the "Modern Oak Center Table" 
for $279 with clean lines and a lighter oak stain. Both are in stock and 
available for immediate delivery. Would you like more details about either of these?

You: What's your return policy?
Assistant: We offer a 30-day return policy for all furniture items. Items must 
be in original condition with all packaging and tags intact. We'll provide a 
full refund or exchange. For larger items, we can arrange pickup. Smaller 
items can be returned to any of our store locations. Do you have a specific 
item you're considering returning?
```

## Key Concepts Demonstrated

1. **Distributed Tracing**: Track requests across microservices
2. **Structured Logging**: Consistent log formats for LLM operations
3. **Metrics Collection**: Custom metrics for LLM-specific KPIs
4. **Error Tracking**: Comprehensive error handling and reporting
5. **Performance Profiling**: Identify bottlenecks in LLM pipelines
6. **Security Monitoring**: Track sensitive data and access patterns

## 📚 Comprehensive Knowledge Base: From Black Box to Glass Box

This repository includes extensive research and documentation on LLM observability principles, best practices, and implementation strategies. Below is a summary of the key insights and knowledge areas covered:

### 🎯 The Application Blueprint: Customer Support AI Assistant

Our demo application serves as a practical test case for LLM observability challenges:

**Core Functionality**: The "Furnish Hub" AI assistant handles customer inquiries including:
- Product information and recommendations
- Pricing and availability queries
- Store policies (returns, shipping, etc.)
- General furniture questions

**Technical Stack**:
- **Language**: Python for AI/ML development
- **LLM Provider**: OpenAI (GPT-4o-mini, GPT-4o)
- **Observability Platform**: Datadog LLM Observability

**Key Observability Challenges Demonstrated**:
1. **Performance & Cost Management**: Token consumption tracking and API latency monitoring
2. **Debugging & Quality Analysis**: Full prompt/response capture for debugging
3. **Semantic Failures & Hallucinations**: Detection of "soft failures" where API succeeds but content is incorrect
4. **Data Privacy & Security**: PII detection and redaction capabilities

### 🔍 The New Imperative of AI Application Monitoring

#### Beyond Deterministic Systems: Unique LLM Challenges

**The Non-Deterministic Nature**: Unlike traditional software, LLMs are inherently probabilistic. The same prompt can generate different responses, requiring statistical performance baselines rather than exact-match testing.

**The "Black Box" Problem**: Multi-billion parameter LLMs have opaque internal reasoning, making semantic failures (hallucinations, bias propagation, off-topic responses) more critical than technical exceptions.

**Vast Input Space**: Natural language inputs create an effectively infinite, unstructured space that opens doors to unique vulnerabilities like prompt injection attacks.

#### The Three Pillars of LLM Observability

1. **Execution Tracing (The "How")**:
   - **Traces & Spans**: End-to-end request journey visualization
   - **Generations**: Specialized spans for LLM calls with metadata
   - **Retrievals & Tool Calls**: Extended tracing for RAG and agentic systems

2. **Qualitative Evaluation (The "What")**:
   - **Key Metrics**: Accuracy, relevance, consistency, faithfulness, safety
   - **Evaluation Methods**: Structural validation, LLM-as-judge, human feedback
   - **Quality Assurance**: Systematic monitoring of semantic performance

3. **Quantitative Monitoring (The "How Much")**:
   - **Performance Metrics**: Latency, throughput, error rates
   - **Cost Metrics**: Granular token usage tracking (prompt, completion, total)
   - **Business Metrics**: User experience, satisfaction, task completion

### 🏢 Organizational Impact: Breaking Down Silos

LLM observability forces convergence between Data Science, DevOps, and Security teams:

- **Data Scientists**: Focus on prompt engineering and model accuracy
- **DevOps Engineers**: Concerned with reliability, latency, and infrastructure costs
- **Security Engineers**: Protecting against data leakage and novel attack vectors

An observability platform becomes the common ground, providing shared language and unified data views that enable collaborative, cross-functional AI application management.

### 💼 Business Case for LLM Observability

**Proactive Performance Optimization**: Shift from reactive troubleshooting to proactive optimization through performance baselines and deviation monitoring.

**Strategic Cost Management**: Granular insights for identifying inefficient prompt patterns and balancing model complexity with performance requirements.

**Enhanced User Experience**: Connecting technical metrics to user outcomes (feedback scores, task completion rates) to focus optimization efforts.

**Robust Risk Mitigation**: Comprehensive audit trails, systematic detection of harmful outputs, and protection against security risks like prompt injection.

### 🛠️ Datadog LLM Observability: Unified Platform

#### Core Platform Features

**End-to-End Tracing**: Complete LLM chain visualization with detailed metadata, input-output data, errors, latency, and token usage.

**Out-of-the-Box Dashboards**: Pre-built dashboards for immediate operational metrics across all major LLM providers (OpenAI, Anthropic, Amazon Bedrock, Google Vertex AI).

**Quality & Safety Evaluations**: Automatic quality checks (failure to answer, off-topic responses, negative sentiment) plus custom evaluation capabilities.

**Security & Privacy Scanning**: Built-in PII detection and redaction using Datadog Sensitive Data Scanner, plus prompt injection detection.

**Prompt & Response Clustering**: Semantic clustering to identify systemic issues and performance drifts by grouping similar low-quality interactions.

#### Holistic Observability Ecosystem

**Seamless APM Correlation**: LLM traces integrated with traditional APM traces, enabling complete request flow visibility from browser clicks through backend services to LLM calls.

**Unified Logs, Metrics, and Traces**: Full integration of observability's three pillars, allowing immediate correlation between LLM traces, application logs, and infrastructure metrics.

**Strategic Advantage**: Unlike standalone LLM tools that create observability silos, Datadog treats LLMs as first-class citizens within the broader application architecture.

### 🔧 Implementation Blueprint

#### Environment Configuration

**API Keys Required**:
- OpenAI API Key: For LLM interactions
- Datadog API Key: For observability data transmission

**Python Environment Setup**:
```bash
python -m venv .venv
source .venv/bin/activate
pip install openai ddtrace
```

#### Automatic Instrumentation with ddtrace-run

**The Magic Command**:
```bash
export OPENAI_API_KEY="<YOUR_OPENAI_API_KEY>"
DD_LLMOBS_ENABLED=1 \
DD_API_KEY="<YOUR_DATADOG_API_KEY>" \
DD_LLMOBS_ML_APP="furnish-hub-support-ai" \
DD_SITE="datadoghq.com" \
DD_LLMOBS_AGENTLESS_ENABLED=1 \
ddtrace-run python main.py
```

**Configuration Variables**:
- `DD_LLMOBS_ENABLED`: Enables LLM Observability features
- `DD_API_KEY`: Datadog API key for data authorization
- `DD_LLMOBS_ML_APP`: Human-readable application name
- `DD_SITE`: Datadog site (datadoghq.com, datadoghq.eu, etc.)
- `DD_LLMOBS_AGENTLESS_ENABLED`: Direct API transmission (no local agent)

#### Advanced Techniques for Production

**Custom Tags for Business Context**:
```python
from ddtrace import tracer
span = tracer.current_span()
if span:
    span.set_tag("customer.id", user_id)
    span.set_tag("session.id", session_id)
    span.set_tag("user.subscription_tier", "premium")
```

**Proactive Monitoring Strategy**:
- **Cost Anomaly Detection**: Monitor token usage spikes
- **Latency Spike Alerts**: Track API performance against SLOs
- **Error Rate Monitoring**: Detect API issues and configuration problems
- **PII Leakage Notifications**: Security alerts for sensitive data detection

**Systematic Quality Assurance**:
- Leverage out-of-the-box evaluations (Failure to Answer, Off-Topic Response)
- Monitor evaluation outcomes as time-series metrics
- Enable data-driven A/B testing for prompt engineering improvements

### 🎯 Conclusion: Towards Reliable AI Operations

The journey from experimental AI to enterprise-grade AI requires operational excellence. LLM observability transforms the opaque "black box" of neural networks into a transparent, manageable "glass box" that enables:

- **Reliable Performance**: Proactive monitoring and optimization
- **Cost Control**: Strategic management of token usage and model selection
- **Quality Assurance**: Systematic evaluation and improvement processes
- **Security Compliance**: Protection against novel AI-specific risks
- **Cross-functional Collaboration**: Unified platform for diverse team needs

For organizations deploying AI at scale, comprehensive LLM observability is not just a best practice—it's the foundation upon which the future of AI operations will be built.

### 📖 Additional Resources

- **Complete Research Document**: See `LLM_OBSERVABILITY_RESEARCH.md` for the full comprehensive guide
- **Implementation Examples**: Both web application and Python CLI versions included
- **Test Results**: Detailed testing documentation in `WEB_APP_TEST_RESULTS.md`
- **Configuration Templates**: Environment setup examples in `env.example`

## Documentation

- [Architecture Overview](docs/architecture.md)
- [Monitoring Setup Guide](docs/monitoring.md)
- [Best Practices](docs/best-practices.md)
- [API Reference](docs/api.md)

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- OpenTelemetry community for observability standards
- LangChain for LLM application framework inspiration
- The broader AI/ML observability community

## Support

If you have questions or need help:

- 📧 Create an issue in this repository
- 💬 Join our community discussions
- 📖 Check the documentation

---

## 🔐 Security Model

**Static Deployment Security**:
- **Datadog RUM tokens**: Hardcoded in code (public values, safe to expose)
- **OpenAI API key**: User-supplied via UI (never stored in repository)
- **No GitHub secrets required**: Direct deployment to Pages without credentials

**User Privacy**:
- API keys stored only in browser localStorage
- No server-side storage of sensitive data
- Datadog RUM uses `mask-user-input` privacy level
- All data processing happens client-side

**Note**: This is a demonstration repository. For production use, please review and adapt the code according to your specific requirements and security policies.