from google.adk.agents import Agent
from ...config import get_nvidia_model

resource_finder_agent = Agent(
    name="ResourceFinder",
    prompt="""You are a digital librarian.
    Look at the weak topics identified in the session state.
    Generate specific YouTube search links for each weak topic to help the student review.
    Format your response as a helpful list of resources.""",
    model=get_nvidia_model("meta/llama-3.1-405b-instruct")
)
