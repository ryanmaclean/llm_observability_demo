# 🔍 Datadog RUM Debugging Guide

## 🚨 **Common Issues & Solutions**

### **Issue 1: No RUM Data Appearing**

#### **Check 1: Browser Console**
1. **Open DevTools** → Console tab
2. **Look for these messages**:
   - ✅ `✅ Datadog RUM and Logs initialized successfully`
   - ✅ `🏠 Using default hardcoded configuration`
   - ❌ `⚠️ Datadog tokens not configured - RUM not initialized`

#### **Check 2: RUM Application ID**
- **Current ID**: `fde3bfb4-cc7c-49ad-82c2-9fed18ce298c`
- **Verify in Datadog**: Go to RUM → Applications → Check if this ID exists
- **If not found**: You need to create a new RUM application or use your own ID

#### **Check 3: Datadog Site**
- **Current Site**: `datadoghq.com` (US1)
- **If you're in EU**: Try `?dd_site=datadoghq.eu` in URL
- **If you're in US3**: Try `?dd_site=us3.datadoghq.com` in URL

### **Issue 2: Wrong Datadog Account**

#### **Solution**: Use Your Own RUM Application
1. **Go to Datadog** → RUM → Applications
2. **Create new application** or use existing one
3. **Get your Client Token**:
   - Organization Settings → API Keys → Client Tokens
4. **Get your Application ID**:
   - RUM → Applications → Your App → Settings
5. **Override in URL**:
   ```
   https://ryanmaclean.github.io/llm_observability_demo/?dd_client_token=pub_YOUR_TOKEN&dd_app_id=YOUR_APP_ID
   ```

### **Issue 3: Data Delay**

#### **Expected Delays**:
- **RUM Data**: 1-2 minutes
- **Logs**: 2-5 minutes
- **Custom Actions**: 1-3 minutes

#### **Check Data Flow**:
1. **Browser Console**: Look for `✅ Datadog RUM and Logs initialized successfully`
2. **Network Tab**: Check for requests to `datadoghq.com` or your site
3. **Datadog RUM**: Check for live sessions

### **Issue 4: Session Sampling**

#### **Current Settings**:
- **Session Sample Rate**: 100% (all sessions)
- **Replay Sample Rate**: 20% (some sessions recorded)

#### **If you want 100% replay**:
```
?dd_replay_sample_rate=100
```

## 🧪 **Step-by-Step Debugging**

### **Step 1: Verify RUM Initialization**
```javascript
// In browser console, check:
console.log('DD_RUM:', window.DD_RUM);
console.log('DD_LOGS:', window.DD_LOGS);
```

### **Step 2: Test Manual Action**
```javascript
// In browser console, send test action:
window.DD_RUM.addAction('debug_test', {
    test_type: 'manual_debug',
    timestamp: new Date().toISOString(),
    user_agent: navigator.userAgent
});
```

### **Step 3: Check Network Requests**
1. **Open DevTools** → Network tab
2. **Filter by**: `datadoghq` or your Datadog site
3. **Look for**: POST requests to `/v1/input/` endpoints
4. **Check status**: Should be 200 OK

### **Step 4: Verify Datadog Dashboard**
1. **Go to**: Datadog → RUM → Applications
2. **Look for**: `llm-observability-demo` service
3. **Check**: Live sessions, actions, errors
4. **Time range**: Set to "Last 15 minutes"

## 🔧 **Quick Fixes**

### **Fix 1: Use Your Own Datadog Account**
```
https://ryanmaclean.github.io/llm_observability_demo/?dd_client_token=pub_YOUR_TOKEN&dd_app_id=YOUR_APP_ID&dd_site=datadoghq.com
```

### **Fix 2: Force EU Site**
```
https://ryanmaclean.github.io/llm_observability_demo/?dd_site=datadoghq.eu
```

### **Fix 3: Enable 100% Replay**
```
https://ryanmaclean.github.io/llm_observability_demo/?dd_replay_sample_rate=100
```

### **Fix 4: Clear Browser Cache**
1. **Hard refresh**: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
2. **Clear localStorage**: Use the "Clear Saved Configuration" button
3. **Incognito mode**: Test in private browsing

## 📊 **What You Should See in Datadog**

### **RUM Dashboard**:
- **Live Sessions**: Real-time user sessions
- **Actions**: `page_loaded`, `llm_request_start`, `llm_response_success`
- **Errors**: Any JavaScript errors or API failures
- **Performance**: Page load times, API response times

### **Logs Dashboard**:
- **Structured Logs**: LLM interaction details
- **Correlation IDs**: Link logs to RUM sessions
- **Token Usage**: Cost and usage metrics
- **Error Details**: Full error context

### **Custom Actions**:
- `page_loaded` - Initial page load
- `llm_request_start` - When LLM request begins
- `llm_response_success` - When LLM responds successfully
- `llm_request_error` - If any errors occur
- `test_connection` - Manual test actions

## 🚨 **Emergency Debugging**

### **If Nothing Works**:
1. **Check Datadog Status**: https://status.datadoghq.com/
2. **Try Different Browser**: Chrome, Firefox, Safari
3. **Check Ad Blockers**: Disable temporarily
4. **Network Issues**: Try different network
5. **Datadog Support**: Contact if persistent issues

### **Console Commands for Debugging**:
```javascript
// Check RUM status
window.DD_RUM ? 'RUM Ready' : 'RUM Not Ready'

// Check logs status  
window.DD_LOGS ? 'Logs Ready' : 'Logs Not Ready'

// Send test action
window.DD_RUM.addAction('debug_test', {test: true})

// Check configuration
console.log('RUM Config:', window.DATADOG_CONFIG)
```

## 📞 **Need Help?**

If you're still not seeing data:
1. **Check browser console** for error messages
2. **Verify your Datadog account** has RUM enabled
3. **Try the URL parameter method** with your own tokens
4. **Check the time range** in Datadog (data might be delayed)

The most common issue is using the wrong Datadog account or site. The hardcoded values are safe demo values, but you'll need your own RUM application to see data in your Datadog account.
