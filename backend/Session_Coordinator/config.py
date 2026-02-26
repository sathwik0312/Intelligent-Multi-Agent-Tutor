import os
import logging
from dotenv import load_dotenv
from google import genai
from google.adk.models.google_llm import Gemini

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("Tutor-ADK")

load_dotenv()

# Configure the client for Google Gemini
client = genai.Client(
    api_key=os.getenv("GOOGLE_API_KEY")
)

def get_gemini_model(model_name="gemini-2.5-flash"):
    """Returns a model configuration for Google Gemini."""
    logger.info(f"Using Gemini Model: {model_name}")
    return Gemini(model=model_name, api_client=client)
