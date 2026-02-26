from google.adk.agents import Agent
from ...config import get_gemini_model

resource_finder_agent = Agent(
    name="Resource_Finder",
    description="Finds relevant educational resources.",
    instruction="""
    You are a Resource Finder. Based on the student's performance, find 3 useful links.
    """,
    model=get_gemini_model()
)
