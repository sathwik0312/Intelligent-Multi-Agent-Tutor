from google.adk.agents import Agent
from google.adk.tools.tool_context import ToolContext
from tools import save_tool


quiz_master= Agent(
    name="quizz_master_agent",
    model="gemini-2.0-flash",
    description="you a"
)