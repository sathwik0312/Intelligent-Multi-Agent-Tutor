import os
import requests
from dotenv import load_dotenv

load_dotenv()

def test_nvidia_api():
    api_key = os.getenv("NVIDIA_API_KEY")
    if not api_key:
        print("❌ Error: NVIDIA_API_KEY not found in .env file.")
        return

    print(f"Testing NVIDIA API Key: {api_key[:10]}...")
    
    invoke_url = "https://integrate.api.nvidia.com/v1/chat/completions"
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Accept": "application/json",
    }
    
    payload = {
        "model": "meta/llama-3.1-405b-instruct",
        "messages": [{"role": "user", "content": "Hello, are you active?"}],
        "max_tokens": 50,
        "stream": False
    }

    try:
        response = requests.post(invoke_url, headers=headers, json=payload)
        if response.status_code == 200:
            print("✅ Success! NVIDIA API is working correctly.")
            print("Response:", response.json()['choices'][0]['message']['content'])
        else:
            print(f"❌ Failed! Status Code: {response.status_code}")
            print("Error Details:", response.text)
    except Exception as e:
        print(f"❌ An error occurred: {str(e)}")

if __name__ == "__main__":
    test_nvidia_api()
