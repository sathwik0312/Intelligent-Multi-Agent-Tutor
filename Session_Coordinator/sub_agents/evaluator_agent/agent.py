from google.adk.agents import Agent
from ...config import get_nvidia_model

evaluator_agent = Agent(
    name="Evaluator",
    model=get_nvidia_model("meta/llama-3.1-405b-instruct")
)
evaluator_agent.prompt = """You are an academic grader.
    Retrieve the correct answers from the session state/tool_context.
    Compare them with the student's provided answers.
    Calculate the score and identify specific topics where the student failed.
    Save the score and weak topics back into the session state for the Feedback and Resource agents."""

