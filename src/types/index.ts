// User Types
export interface User {
  id: number;
  name: string;
  email: string;
  score: number;
  level: number;
  created_at: string;
  updated_at: string;
}

// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Category Types
export interface Category {
  id: number;
  name: string;
  description: string;
  difficulty_level: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Question Types
export interface Question {
  id: number;
  category_id: number;
  question_text: string;
  question_type: 'multiple_choice' | 'fill_blank';
  correct_answer: string;
  options?: string[];
  explanation: string;
  difficulty_level: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Game Room Types
export interface GameRoom {
  id: number;
  name: string;
  description?: string;
  category_id?: number;
  owner_id: number;
  max_players: number;
  current_players: number;
  question_count: number;
  status: 'waiting' | 'playing' | 'finished';
  is_private: boolean;
  password?: string;
  settings?: any;
  created_at: string;
  updated_at: string;
  owner?: User;
  players?: RoomPlayer[];
  category?: Category;
}

export interface RoomPlayer {
  id: number;
  room_id: number;
  member_id: number;
  is_ready: boolean;
  joined_at: string;
  left_at?: string;
  member?: User;
}

// Game Session Types
export interface GameSession {
  id: number;
  room_id: number;
  status: 'active' | 'paused' | 'finished';
  current_question: number;
  total_questions: number;
  started_at?: string;
  ended_at?: string;
  created_at: string;
  updated_at: string;
  room?: GameRoom;
}

export interface SessionAnswer {
  id: number;
  session_id: number;
  member_id: number;
  question_id: number;
  user_answer: string;
  is_correct: boolean;
  time_taken: number;
  score_earned: number;
  answered_at: string;
  member?: User;
  question?: Question;
}

// Game State Types
export interface GameState {
  session: GameSession | null;
  currentQuestion: Question | null;
  questionNumber: number;
  timeRemaining: number;
  scores: PlayerScore[];
  answers: SessionAnswer[];
}

export interface PlayerScore {
  player_id: number;
  player_name: string;
  score: number;
  correct_answers: number;
  total_answers: number;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// WebSocket Event Types
export interface WebSocketEvents {
  'room:playerJoined': { room_id: number; player: RoomPlayer };
  'room:playerLeft': { room_id: number; player_id: number };
  'room:playerReady': { room_id: number; player_id: number; is_ready: boolean };
  'room:gameStarted': { room_id: number; session_id: number; first_question: Question };
  'room:gameEnded': { room_id: number; session_id: number; results: PlayerScore[] };
  'game:questionUpdate': { session_id: number; question_number: number; question: Question; time_limit: number };
  'game:answerSubmitted': { session_id: number; player_id: number; question_id: number; is_correct: boolean; score_earned: number };
  'game:scoreUpdate': { session_id: number; scores: PlayerScore[] };
  'game:timeUpdate': { session_id: number; time_remaining: number };
}

// UI State Types
export interface UIState {
  loading: boolean;
  error: string | null;
  success: string | null;
  modal: {
    isOpen: boolean;
    type: string;
    data: any;
  };
}

// Form Types
export interface CreateRoomForm {
  name: string;
  description?: string;
  category_id?: number;
  max_players: number;
  question_count: number;
  is_private: boolean;
  password?: string;
}

export interface JoinRoomForm {
  room_id: number;
  password?: string;
}
