# Datadog RUM Instrumentation Guide

## Overview

This application is fully instrumented with Datadog RUM (Real User Monitoring) and Logs SDK to provide comprehensive observability for LLM interactions.

## How RUM is Integrated

### 1. Configuration Management

**Local Development (`.env.local`)**:
```env
DATADOG_CLIENT_TOKEN=your-client-token-here
DATADOG_APPLICATION_ID=your-application-id-here
DATADOG_SITE=datadoghq.com
DATADOG_ENV=development
```

**GitHub Pages Deployment**:
- Uses GitHub repository secrets
- GitHub Actions injects values at build time
- Secrets: `DATADOG_CLIENT_TOKEN`, `DATADOG_APPLICATION_ID`, `DATADOG_SITE`

### 2. RUM Initialization (index.html)

The application loads Datadog RUM SDK and initializes it based on configuration:

```javascript
// Loads config.js first
// Then loads RUM and Logs SDKs from CDN
// Initializes with environment-specific settings
// Provides fallback placeholders if tokens missing
```

**Key Features Enabled**:
- ✅ Session tracking and replay (20% sample rate)
- ✅ User interaction tracking
- ✅ Resource and performance monitoring
- ✅ Long task detection
- ✅ Privacy-safe data collection (`mask-user-input`)

### 3. Custom LLM Tracking (js/datadog.js)

**Structured Logging for LLM Interactions**:
- Request start events with metadata
- Response success events with token usage
- Error events with failure details
- Correlation IDs linking requests/responses

**Custom RUM Actions**:
- LLM requests tracked as user actions
- Performance timing for API calls
- Error tracking with context
- Session metrics aggregation

**Tracked Metrics**:
- Token usage (prompt, completion, total)
- API response times
- Cost calculations
- Success/error rates
- Model and temperature settings

### 4. Environment-Specific Behavior

**Local Development**:
- Server injects environment variables at request time
- Development environment tags
- Full logging for debugging

**GitHub Pages**:
- Build-time variable injection
- Production environment tags
- Optimized for static hosting

## What Gets Tracked

### User Experience Metrics
- Page load performance
- User interactions (clicks, form submissions)
- JavaScript errors and exceptions
- Navigation patterns and session flows

### LLM-Specific Metrics
- Request/response correlation
- Token usage and costs by model
- API latency and throughput
- Error rates and failure modes
- Feature usage (Chat, Summarize, Code Gen)

### Business Metrics
- Session duration and engagement
- Feature adoption rates
- User conversion funnel
- Cost per session/user

## Datadog Dashboard Views

The instrumentation provides data for:

1. **Performance Dashboard**:
   - API response times
   - Token usage trends
   - Error rate monitoring
   - Cost analysis

2. **User Experience Dashboard**:
   - Session replays
   - User journey analysis
   - Feature usage patterns
   - Geographic distribution

3. **Business Intelligence**:
   - Conversion metrics
   - Usage patterns
   - Cost optimization opportunities
   - Quality metrics

## Security and Privacy

- **PII Protection**: `mask-user-input` privacy level
- **Token Security**: API keys never logged or transmitted
- **Data Retention**: Follows Datadog retention policies
- **Compliance**: GDPR and SOC2 compliant data handling

## Monitoring and Alerts

**Pre-configured Monitors** (monitors.json):
- High error rate alerts
- Performance degradation warnings
- Cost spike notifications
- Success rate drop alerts

## Testing RUM Integration

### Local Testing
1. Start server: `npm start`
2. Check console for: `✅ Datadog RUM and Logs initialized successfully`
3. Open browser dev tools > Network tab
4. Look for requests to `datadoghq-browser-agent.com`
5. Check browser console for initialization logs

### Datadog Verification
1. Go to your Datadog RUM application
2. Check for live sessions
3. Verify custom actions appear for LLM requests
4. Confirm logs are flowing with structured metadata

### Production Testing
1. Deploy to GitHub Pages with secrets configured
2. Access the live URL
3. Perform test interactions
4. Verify data appears in Datadog dashboards

## Troubleshooting

**RUM Not Initializing**:
- Check that `DATADOG_CLIENT_TOKEN` and `DATADOG_APPLICATION_ID` are set
- Verify tokens are from a valid RUM application
- Confirm correct Datadog site (US/EU)

**No Data in Datadog**:
- Check browser console for SDK errors
- Verify network requests to Datadog are succeeding
- Confirm RUM application is active

**Local Development Issues**:
- Ensure `.env.local` has correct format (no quotes)
- Check server startup logs for configuration status
- Verify `config.js` is loading properly

## Architecture Benefits

This RUM instrumentation provides:

- **Unified Observability**: LLM metrics integrated with traditional web metrics
- **Real-time Insights**: Live monitoring of AI application performance
- **Cost Visibility**: Granular tracking of LLM usage costs
- **Quality Assurance**: Systematic monitoring of AI interaction quality
- **Security Compliance**: Privacy-safe collection of sensitive AI data

The result is complete visibility into both the technical performance and business impact of your LLM-powered application.