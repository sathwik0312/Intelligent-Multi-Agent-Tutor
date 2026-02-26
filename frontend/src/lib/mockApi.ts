// Mock API endpoints for the AI Tutor platform
// These can be easily swapped for real FastAPI endpoints

export interface UploadResponse {
  status: string;
  documentId: string;
  topics: string[];
  totalPages: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuizResult {
  questionId: string;
  correct: boolean;
  topic: string;
}

export interface SkillProfile {
  topic: string;
  score: number;
  maxScore: number;
}

export interface ReviewCard {
  id: string;
  topic: string;
  reason: string;
  videoTitle: string;
  videoChannel: string;
  thumbnailUrl: string;
}

const MOCK_TOPICS = ['Neural Networks', 'Backpropagation', 'Transformers', 'Attention Mechanisms', 'Loss Functions', 'Optimization'];

const MOCK_QUESTIONS: QuizQuestion[] = [
  { id: '1', question: 'What is the primary purpose of the attention mechanism in transformers?', options: ['Speed up training', 'Allow the model to focus on relevant parts of the input', 'Reduce model size', 'Prevent overfitting'], correctIndex: 1, topic: 'Attention Mechanisms', difficulty: 'medium' },
  { id: '2', question: 'Which activation function is most commonly used in hidden layers of deep networks?', options: ['Sigmoid', 'Tanh', 'ReLU', 'Softmax'], correctIndex: 2, topic: 'Neural Networks', difficulty: 'easy' },
  { id: '3', question: 'What does the chain rule enable in neural network training?', options: ['Forward propagation', 'Backpropagation', 'Regularization', 'Normalization'], correctIndex: 1, topic: 'Backpropagation', difficulty: 'easy' },
  { id: '4', question: 'In a transformer, what are Q, K, and V?', options: ['Query, Key, Value matrices', 'Quantization, Kernel, Variance', 'Queue, Keep, Validate operations', 'Quality, Knowledge, Verification scores'], correctIndex: 0, topic: 'Transformers', difficulty: 'hard' },
  { id: '5', question: 'Which loss function is standard for multi-class classification?', options: ['MSE', 'Binary Cross-Entropy', 'Categorical Cross-Entropy', 'Hinge Loss'], correctIndex: 2, topic: 'Loss Functions', difficulty: 'medium' },
];

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

export const mockUpload = async (file: File, onLog: (msg: string) => void): Promise<UploadResponse> => {
  onLog(`📄 Received: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
  await delay(800);
  onLog('🤖 Document Agent initialized... parsing structure');
  await delay(1200);
  onLog('🔍 Gemini 2.5 Flash analyzing curriculum structure...');
  await delay(1000);
  onLog('📊 Curriculum Analyst extracting key topics...');
  await delay(900);
  onLog(`✅ Found ${MOCK_TOPICS.length} topics across 24 pages`);
  await delay(500);
  onLog('🧠 Building knowledge graph... handoff to QuizMaster');

  return {
    status: 'success',
    documentId: 'doc_' + Math.random().toString(36).substr(2, 9),
    topics: MOCK_TOPICS,
    totalPages: 24,
  };
};

export const mockGenerateQuiz = async (): Promise<QuizQuestion[]> => {
  await delay(600);
  return MOCK_QUESTIONS;
};

export const mockSubmitQuiz = async (answers: Record<string, number>): Promise<{ results: QuizResult[]; skillProfile: SkillProfile[]; reviewCards: ReviewCard[] }> => {
  await delay(800);

  const results: QuizResult[] = MOCK_QUESTIONS.map(q => ({
    questionId: q.id,
    correct: answers[q.id] === q.correctIndex,
    topic: q.topic,
  }));

  const topicScores: Record<string, { correct: number; total: number }> = {};
  results.forEach(r => {
    if (!topicScores[r.topic]) topicScores[r.topic] = { correct: 0, total: 0 };
    topicScores[r.topic].total++;
    if (r.correct) topicScores[r.topic].correct++;
  });

  const skillProfile: SkillProfile[] = MOCK_TOPICS.map(topic => ({
    topic,
    score: topicScores[topic] ? topicScores[topic].correct : Math.random() > 0.5 ? 1 : 0,
    maxScore: topicScores[topic] ? topicScores[topic].total : 1,
  }));

  const weakTopics = skillProfile.filter(s => s.score / s.maxScore < 0.6);

  const reviewCards: ReviewCard[] = weakTopics.map((s, i) => ({
    id: `rc_${i}`,
    topic: s.topic,
    reason: `Your score on "${s.topic}" was ${Math.round((s.score / s.maxScore) * 100)}%. This concept is foundational for advanced topics.`,
    videoTitle: `${s.topic} Explained Simply`,
    videoChannel: 'AI Academy',
    thumbnailUrl: '',
  }));

  return { results, skillProfile, reviewCards };
};
