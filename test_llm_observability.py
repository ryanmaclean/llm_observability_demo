# test_llm_observability.py
import os
import time
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.local')

def test_web_application():
    """Test if the web application is running and accessible"""
    try:
        response = requests.get('http://localhost:8000', timeout=5)
        if response.status_code == 200:
            print("✅ Web application is running on http://localhost:8000")
            return True
        else:
            print(f"❌ Web application returned status code: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Web application not accessible: {e}")
        return False

def test_openai_connection():
    """Test OpenAI API connection"""
    api_key = os.getenv('OPENAI_KEY') or os.getenv('OPENAI_API_KEY')
    
    if not api_key:
        print("❌ OpenAI API key not found in environment")
        return False
    
    try:
        from openai import OpenAI
        client = OpenAI(api_key=api_key)
        
        # Make a simple test call
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": "Say 'LLM Observability Test' and nothing else."}],
            temperature=0.7,
        )
        
        print("✅ OpenAI API connection successful")
        print(f"   Response: {response.choices[0].message.content}")
        print(f"   Tokens used: {response.usage.total_tokens}")
        return True
        
    except Exception as e:
        print(f"❌ OpenAI API test failed: {e}")
        return False

def test_datadog_configuration():
    """Test Datadog configuration"""
    dd_api_key = os.getenv('DD_API_KEY')
    dd_site = os.getenv('DD_SITE', 'datadoghq.com')
    
    if not dd_api_key:
        print("⚠️  Datadog API key not found - observability will be limited")
        return False
    
    print(f"✅ Datadog configuration found")
    print(f"   Site: {dd_site}")
    print(f"   API Key: {'*' * (len(dd_api_key) - 4) + dd_api_key[-4:] if dd_api_key else 'Not set'}")
    return True

def main():
    print("🧪 Testing LLM Observability Demo Setup")
    print("=" * 50)
    
    # Test web application
    web_running = test_web_application()
    
    # Test OpenAI connection
    openai_working = test_openai_connection()
    
    # Test Datadog configuration
    datadog_configured = test_datadog_configuration()
    
    print("\n📊 Test Results Summary:")
    print(f"   Web Application: {'✅ Running' if web_running else '❌ Not Running'}")
    print(f"   OpenAI API: {'✅ Working' if openai_working else '❌ Not Working'}")
    print(f"   Datadog Config: {'✅ Configured' if datadog_configured else '⚠️  Not Configured'}")
    
    if web_running and openai_working:
        print("\n🎉 LLM Observability Demo is ready!")
        print("   Open http://localhost:8000 in your browser")
        print("   Configure your API keys in the web interface")
        if datadog_configured:
            print("   Check your Datadog dashboard for observability data")
        else:
            print("   Add Datadog credentials for full observability")
    else:
        print("\n💥 Setup incomplete - please check the issues above")

if __name__ == "__main__":
    main()
