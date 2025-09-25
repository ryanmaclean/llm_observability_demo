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

**Note**: This is a demonstration repository. For production use, please review and adapt the code according to your specific requirements and security policies.