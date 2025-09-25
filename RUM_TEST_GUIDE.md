# 🧪 **RUM Functionality Test**

## **Quick Test Steps:**

### **Step 1: Open the Live Site**
Go to: https://ryanmaclean.github.io/llm_observability_demo/

### **Step 2: Open Browser Console**
- **Chrome/Edge**: F12 → Console tab
- **Firefox**: F12 → Console tab
- **Safari**: Cmd+Option+I → Console tab

### **Step 3: Run Debug Function**
Type this in the console and press Enter:
```javascript
debugDatadogRUM()
```

### **Step 4: Check Output**
You should see something like:
```
🔍 Datadog RUM Debug Information:
================================
DD_RUM Available: true
DD_LOGS Available: true
Current Configuration: {
  clientToken: "pub941f8b1...",
  applicationId: "fde3bfb4-...",
  site: "datadoghq.com",
  service: "llm-observability-demo",
  env: "production",
  sessionSampleRate: "100%",
  replaySampleRate: "20%"
}
✅ Test action sent to Datadog RUM
```

### **Step 5: Check Network Tab**
1. **Open DevTools** → Network tab
2. **Filter by**: `datadoghq`
3. **Look for**: POST requests to `/v1/input/` endpoints
4. **Status**: Should be 200 OK

### **Step 6: Check Datadog Dashboard**
1. **Go to**: Datadog → RUM → Applications
2. **Look for**: `llm-observability-demo` service
3. **Time range**: "Last 15 minutes"
4. **Check for**: Live sessions, actions, errors

## **Expected Results:**

### ✅ **If Working Correctly:**
- Console shows `DD_RUM Available: true`
- Network tab shows requests to Datadog
- Datadog RUM shows live sessions
- Actions appear in Datadog dashboard

### ❌ **If Not Working:**
- Console shows `DD_RUM Available: false`
- No network requests to Datadog
- No data in Datadog RUM dashboard
- Error messages in console

## **Common Issues & Solutions:**

### **Issue 1: Wrong Datadog Account**
**Problem**: Using demo values, but you need your own RUM application
**Solution**: Use your own tokens:
```
https://ryanmaclean.github.io/llm_observability_demo/?dd_client_token=pub_YOUR_TOKEN&dd_app_id=YOUR_APP_ID
```

### **Issue 2: Wrong Datadog Site**
**Problem**: You're in EU but using US site
**Solution**: Use EU site:
```
https://ryanmaclean.github.io/llm_observability_demo/?dd_site=datadoghq.eu
```

### **Issue 3: Ad Blocker**
**Problem**: Ad blocker blocking Datadog requests
**Solution**: Disable ad blocker temporarily

### **Issue 4: Data Delay**
**Problem**: RUM data takes 1-3 minutes to appear
**Solution**: Wait a few minutes and refresh Datadog dashboard

## **Manual Test Actions:**

### **Test 1: Send Test Action**
```javascript
window.DD_RUM.addAction('manual_test', {
    test_type: 'console_test',
    timestamp: new Date().toISOString()
});
```

### **Test 2: Check RUM Status**
```javascript
console.log('RUM Ready:', !!window.DD_RUM);
console.log('Logs Ready:', !!window.DD_LOGS);
```

### **Test 3: Check Configuration**
```javascript
console.log('Config:', window.DATADOG_CONFIG);
```

## **What You Should See in Datadog:**

### **RUM Dashboard:**
- **Live Sessions**: Real-time user sessions
- **Actions**: `page_loaded`, `debug_test`, `manual_test`
- **Errors**: Any JavaScript errors
- **Performance**: Page load times

### **Logs Dashboard:**
- **Structured Logs**: LLM interaction details
- **Correlation IDs**: Link logs to RUM sessions
- **Token Usage**: Cost and usage metrics

## **If Still Not Working:**

1. **Check Datadog Status**: https://status.datadoghq.com/
2. **Try Different Browser**: Chrome, Firefox, Safari
3. **Check Network**: Try different network connection
4. **Contact Support**: If persistent issues

The most common issue is that the hardcoded values are demo values, and you need your own Datadog RUM application to see data in your account.
