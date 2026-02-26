# IntelliLearn Studio 🤖📚

IntelliLearn Studio is an adaptive, multimodal learning platform powered by **Google ADK** and **Gemini 2.5 Flash**. It utilizes a hierarchical multi-agent architecture to analyze study materials, generate personalized quizzes, and provide targeted feedback to students.

## 🚀 Features

- **Multi-Agent Orchestration:** Managed by a `SessionCoordinator` that delegates tasks to specialized sub-agents.
- **Adaptive Difficulty:** Automatically scales quiz complexity (Easy, Medium, Hard) based on real-time performance.
- **Intelligent Feedback:** Identifies knowledge gaps and provides direct links to educational resources (e.g., YouTube).
- **State Persistence:** Maintains student progress and history across learning sessions.
- **Modern UI:** A sleek, high-performance frontend built with React, Tailwind CSS, and shadcn/ui.

## 🏗️ Architecture

- **QuizzMaster:** Generates custom MCQ quizzes from provided study material.
- **Evaluator:** Grades student responses and identifies weak topics.
- **FeedbackAgent:** Provides personalized encouragement and sets the difficulty for the next round.
- **ResourceFinder:** Sources external educational content to help fill knowledge gaps.

## 🛠️ Tech Stack

- **Frontend:** React, Vite, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion
- **Backend:** FastAPI, Python, Google ADK
- **Model:** Google Gemini 2.5 Flash
- **Orchestration:** Google ADK (Agent Development Kit)

## 🏁 Getting Started

### Prerequisites
- Node.js & npm (for frontend)
- Python 3.10+ (for backend)
- Google API Key (Gemini 2.5 Flash access)

### Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sathwik0312/intellilearn-studio.git
   cd intellilearn-studio
   ```

2. **Backend Setup:**
   ```bash
   # Create a .env file
   echo "GOOGLE_API_KEY=your_key_here" > .env
   
   # Install dependencies and run
   pip install -r requirements.txt
   python main.py
   ```

3. **Frontend Setup:**
   ```bash
   npm install
   npm run dev
   ```

---
*Built by Sathwik Marupaka*
