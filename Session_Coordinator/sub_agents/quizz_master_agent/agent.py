from google.adk.agents import Agent
from ...config import get_nvidia_model

quiz_master_agent = Agent(
    name="QuizzMaster",
    model=get_nvidia_model("meta/llama-3.1-405b-instruct")
)
quiz_master_agent.prompt = """You are an expert examiner. 
    1. Check the session state for the 'next_difficulty' level set by the FeedbackAgent. If not found, default to 'Medium'.
    2. Generate a 5-question multiple choice quiz based on the study material provided, matching the identified difficulty.
    3. Store the generated quiz questions and correct answers in the tool_context/session state.
    4. Output only the questions for the student."""

