# Intelligent Multi-Agent Tutor 🤖📚

An adaptive, multimodal learning system powered by **Google ADK** and **Gemini 2.5 Flash**. This tutor leverages a hierarchical multi-agent architecture to provide a personalized educational experience by analyzing study materials, generating quizzes, and providing targeted feedback.

## 🚀 Features

- **Multi-Agent Orchestration:** Uses a specialized `SessionCoordinator` to manage hand-offs between specialized agents.
- **Adaptive Learning:** Automatically adjusts the difficulty level (Easy, Medium, Hard) of subsequent quizzes based on student performance.
- **Multimodal Content Processing:** Processes PDF study materials to extract core curriculum concepts.
- **Targeted Resource Discovery:** Identifies knowledge gaps and provides direct YouTube links for specific topics where the student is weak.
- **State Management:** Maintains long-context student progress across sessions using Google ADK's session state.

## 🏗️ Architecture (Session Coordinator)

The system is divided into specialized sub-agents:
- **QuizzMaster:** Generates custom quizzes based on difficulty and curriculum.
- **Evaluator:** Grades answers and identifies specific weak topics.
- **FeedbackAgent:** Provides encouraging feedback and sets the next difficulty level.
- **ResourceFinder:** Discovers educational videos to fill identified knowledge gaps.

## 🛠️ Tech Stack

- **Framework:** [Google ADK](https://github.com/google/adk) (Agent Development Kit)
- **Model:** Google Gemini 2.5 Flash
- **Backend:** FastAPI, Python
- **Environment Management:** `uv`

## 🏁 Getting Started

### Prerequisites
- Python 3.10+
- A Google API Key (with access to Gemini 2.5 Flash)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/sathwik0312/Intelligent-Multi-Agent-Tutor.git
   cd Intelligent-Multi-Agent-Tutor
   ```
2. Install dependencies using `uv`:
   ```bash
   uv sync
   ```
3. Create a `.env` file in the root directory:
   ```env
   GOOGLE_API_KEY=your_gemini_api_key_here
   ```

### Running the System
- **Test the Backend (CLI):**
  ```bash
  uv run test_cli.py
  ```
- **Run the API Server:**
  ```bash
  uv run main.py
  ```
  The API will be available at `http://localhost:8000`.

## 📂 Project Structure

```text
.
├── Session_Coordinator/    # Agent logic and orchestration
│   ├── sub_agents/         # Individual specialized agents
│   ├── tools/              # Helper tools for state management
│   └── config.py           # Gemini/ADK configuration
├── api.py                  # FastAPI endpoints
├── main.py                 # Application entry point
├── test_cli.py             # Full loop testing script
└── requirements.txt        # Python dependencies
```

## 🤝 Contributing
Feel free to open issues or submit pull requests to improve the agents or add new capabilities!
