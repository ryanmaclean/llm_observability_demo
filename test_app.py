# test_app.py
import os
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables from .env.local
load_dotenv('.env.local')

def test_openai_connection():
    """
    Test the OpenAI connection and make a simple API call
    """
    try:
        # Initialize the OpenAI client
        api_key = os.getenv('OPENAI_KEY') or os.getenv('OPENAI_API_KEY')
        oai_client = OpenAI(api_key=api_key)
        
        print("✅ OpenAI client initialized successfully")
        
        # Make a simple test API call
        completion = oai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": "Say 'Hello, The Furnish Hub!' and nothing else."}
            ],
            temperature=0.7,
        )
        
        response = completion.choices[0].message.content
        print(f"✅ API call successful!")
        print(f"📝 Response: {response}")
        print(f"💰 Tokens used: {completion.usage.total_tokens}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    print("🧪 Testing LLM Observability Demo Application...")
    print("=" * 50)
    
    success = test_openai_connection()
    
    if success:
        print("\n🎉 Application test completed successfully!")
        print("The app is ready to run with: python main.py")
    else:
        print("\n💥 Application test failed!")
        print("Please check your API keys and configuration.")
