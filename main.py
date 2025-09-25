# main.py
import os
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables from .env.local
load_dotenv('.env.local')

def run_support_assistant():
    """
    Initializes the OpenAI client and runs a simple conversational loop
    for the customer support assistant.
    """
    try:
        # Initialize the OpenAI client. It automatically reads the
        # OPENAI_API_KEY from the environment variables.
        # Note: The .env.local file uses OPENAI_KEY, so we need to set it explicitly
        api_key = os.getenv('OPENAI_KEY') or os.getenv('OPENAI_API_KEY')
        oai_client = OpenAI(api_key=api_key)
    except Exception as e:
        print(f"Error initializing OpenAI client: {e}")
        print("Please ensure your OPENAI_API_KEY environment variable is set correctly.")
        return

    # The system prompt defines the persona and context for the AI assistant.
    # This is a crucial part of prompt engineering.
    system_prompt = """You are a helpful customer assistant for The Furnish Hub, a furniture store. 
    You can help customers with:
    - Product information and recommendations
    - Pricing and availability
    - Store policies (returns, shipping, etc.)
    - General questions about furniture
    
    Be friendly, helpful, and professional. If you don't know something specific about our products, 
    let the customer know you'll connect them with a human specialist."""
    
    # Store the conversation history.
    messages = [{"role": "system", "content": system_prompt}]

    print("Welcome to The Furnish Hub! How can I help you today? (Type 'exit' to quit)")

    while True:
        user_input = input("\nYou: ")
        if user_input.lower() == 'exit':
            print("Thank you for visiting The Furnish Hub. Goodbye!")
            break

        # Add the user's message to the conversation history.
        messages.append({"role": "user", "content": user_input})

        try:
            # Make the API call to OpenAI's Chat Completions endpoint.
            # The ddtrace-run command will automatically instrument this call.
            completion = oai_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages,
                temperature=0.7,
            )

            # Extract the assistant's response from the API result.
            assistant_response = completion.choices[0].message.content
            print(f"Assistant: {assistant_response}")

            # Add the assistant's response to the history for context in the next turn.
            messages.append({"role": "assistant", "content": assistant_response})

        except Exception as e:
            print(f"An error occurred while communicating with OpenAI: {e}")
            # Remove the last user message on error to allow for a retry.
            messages.pop()

if __name__ == "__main__":
    run_support_assistant()
