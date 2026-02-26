import os
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

# Configure the client to point to NVIDIA NIM
# NVIDIA NIM is OpenAI-compatible, and the Google GenAI SDK can be 
# configured to use a custom base_url and API key.
client = genai.Client(
    api_key=os.getenv("NVIDIA_API_KEY"),
    http_options={
        "base_url": "https://integrate.api.nvidia.com/v1"
    }
)

def get_nvidia_model(model_name="meta/llama-3.1-405b-instruct"):
    """Returns a model configuration for NVIDIA NIM."""
    return model_name
