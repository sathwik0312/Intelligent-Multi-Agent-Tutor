from google.adk.agents import Agent
from ...config import get_nvidia_model

feedback_agent = Agent(
    name="FeedbackAgent",
    model=get_nvidia_model("meta/llama-3.1-405b-instruct")
)
feedback_agent.instructions = """You are a supportive personal tutor.
    1. Read the evaluation results (score and weak topics) from the session state.
    2. Provide encouraging feedback and explain the core concepts missed.
    3. Determine the 'next_difficulty' level:
       - If score > 80: 'Hard'
       - If score < 50: 'Easy'
       - Otherwise: 'Medium'
    4. Save this 'next_difficulty' into the session state so the QuizzMaster can use it for the next round."""

