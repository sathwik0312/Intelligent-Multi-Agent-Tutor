from google.adk import agents,tools
import os

async def save_to_state(key: str, value: any,tool_context: tools.ToolContext):
    """Saves a specific information to the session state."""
    tool_context.state[key] = value
    return f"Successfully saved {key} to state."

save_tool = tools.FunctionTool(save_to_state)