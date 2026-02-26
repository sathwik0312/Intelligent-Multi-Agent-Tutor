import os
import logging
from dotenv import load_dotenv
from google import genai
from google.genai import types

# Configure logging to see API requests
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("NVIDIA-NIM")

load_dotenv()

# Configure the client to point to NVIDIA NIM
client = genai.Client(
    api_key=os.getenv("NVIDIA_API_KEY"),
    http_options={
        "base_url": "https://integrate.api.nvidia.com/v1"
    }
)

def get_nvidia_model(model_name="meta/llama-3.1-405b-instruct"):
    """Returns a model configuration for NVIDIA NIM and logs the request."""
    logger.info(f"Routing request to NVIDIA NIM Model: {model_name}")
    return model_name
