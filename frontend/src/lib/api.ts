// api.ts - Real API endpoints for the AI Tutor platform
// Swaps mock behavior for actual FastAPI backend communication

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface UploadResponse {
  status: string;
  concepts: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  answer: string; // The text of the correct answer
  difficulty: string;
}

export interface QuizResult {
  analysis: {
    score: number;
    weak_topics: string[];
    improvement_plan: string;
    recommended_search_queries: string[];
  };
  next_difficulty: string;
}

export const uploadMaterial = async (file: File, onLog: (msg: string) => void): Promise<UploadResponse> => {
  onLog(`📄 Uploading: ${file.name}`);
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) throw new Error('Upload failed');
  
  const data = await response.json();
  onLog(`✅ Analysis complete. Found ${data.concepts.length} concepts.`);
  return data;
};

export const generateQuiz = async (difficulty: string = 'Medium'): Promise<QuizQuestion[]> => {
  const response = await fetch(`${API_BASE_URL}/quiz/generate?difficulty=${difficulty}`);
  if (!response.ok) throw new Error('Quiz generation failed');
  return await response.json();
};

export const submitQuiz = async (answers: string[]): Promise<QuizResult> => {
  const response = await fetch(`${API_BASE_URL}/quiz/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answers }),
  });

  if (!response.ok) throw new Error('Quiz submission failed');
  return await response.json();
};
