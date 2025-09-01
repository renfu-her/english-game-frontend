import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  User, 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse,
  Category,
  Question,
  GameRoom,
  GameSession,
  ApiResponse,
  PaginatedResponse,
  CreateRoomForm,
  JoinRoomForm
} from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_API_URL || 'https://english-game-backend.test/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('API Request:', config.method?.toUpperCase(), config.url, 'Token:', !!token);
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Only redirect if we're not already on the login page and not during login/register
          const currentPath = window.location.pathname;
          if (currentPath !== '/login' && currentPath !== '/register') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response: AxiosResponse<any> = await this.api.post('/auth/login', data);
    console.log('Login response:', response.data);
    // Handle the nested data structure
    if (response.data.data) {
      return {
        user: response.data.data.member,
        token: response.data.data.token
      };
    }
    return response.data;
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response: AxiosResponse<any> = await this.api.post('/auth/register', data);
    console.log('Register response:', response.data);
    // Handle the nested data structure
    if (response.data.data) {
      return {
        user: response.data.data.member,
        token: response.data.data.token
      };
    }
    return response.data;
  }

  async logout(): Promise<void> {
    await this.api.post('/auth/logout');
  }

  async getProfile(): Promise<User> {
    const response: AxiosResponse<User> = await this.api.get('/auth/profile');
    return response.data;
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    console.log('Fetching categories from:', this.api.defaults.baseURL + '/categories');
    const response: AxiosResponse<any> = await this.api.get('/categories');
    console.log('Categories response:', response.data);
    // Handle the nested data structure
    return response.data.data || response.data;
  }

  async getCategory(id: number): Promise<Category> {
    const response: AxiosResponse<Category> = await this.api.get(`/categories/${id}`);
    return response.data;
  }

  async getCategoryQuestions(id: number, limit?: number): Promise<Question[]> {
    const params = limit ? { limit } : {};
    const response: AxiosResponse<Question[]> = await this.api.get(`/categories/${id}/questions`, { params });
    return response.data;
  }

  // Questions
  async getQuestions(params?: { category_id?: number; type?: string; limit?: number }): Promise<Question[]> {
    const response: AxiosResponse<Question[]> = await this.api.get('/questions', { params });
    return response.data;
  }

  async getRandomQuestion(params?: { category_id?: number; type?: string }): Promise<Question> {
    const response: AxiosResponse<Question> = await this.api.get('/questions/random', { params });
    return response.data;
  }

  async getQuestion(id: number): Promise<Question> {
    const response: AxiosResponse<Question> = await this.api.get(`/questions/${id}`);
    return response.data;
  }

  // Game Rooms
  async getGameRooms(params?: { status?: string; category_id?: number; limit?: number }): Promise<GameRoom[]> {
    const response: AxiosResponse<any> = await this.api.get('/game-rooms', { params });
    console.log('Game rooms response:', response.data);
    console.log('Game rooms response type:', typeof response.data);
    console.log('Game rooms response is array:', Array.isArray(response.data));
    
    // Handle the nested data structure
    const rooms = response.data.data || response.data;
    console.log('Processed rooms:', rooms);
    console.log('Processed rooms type:', typeof rooms);
    console.log('Processed rooms is array:', Array.isArray(rooms));
    
    // Ensure we return an array
    return Array.isArray(rooms) ? rooms : [];
  }

  async createGameRoom(data: CreateRoomForm): Promise<GameRoom> {
    const response: AxiosResponse<any> = await this.api.post('/game-rooms', data);
    console.log('Create game room response:', response.data);
    // Handle the nested data structure
    return response.data.data || response.data;
  }

  async getGameRoom(id: number): Promise<GameRoom> {
    const response: AxiosResponse<any> = await this.api.get(`/game-rooms/${id}`);
    console.log('Get game room response:', response.data);
    // Handle the nested data structure
    return response.data.data || response.data;
  }

  async findGameRoomByCode(code: string): Promise<GameRoom> {
    const response: AxiosResponse<GameRoom> = await this.api.get('/game-rooms/find-by-code', { params: { code } });
    return response.data;
  }

  async joinGameRoom(id: number, data?: JoinRoomForm): Promise<void> {
    await this.api.post(`/game-rooms/${id}/join`, data);
  }

  async leaveGameRoom(id: number): Promise<void> {
    await this.api.post(`/game-rooms/${id}/leave`);
  }

  async toggleReady(id: number): Promise<void> {
    await this.api.post(`/game-rooms/${id}/toggle-ready`);
  }

  async startGame(id: number): Promise<void> {
    await this.api.post(`/game-rooms/${id}/start`);
  }

  async endGame(id: number): Promise<void> {
    await this.api.post(`/game-rooms/${id}/end`);
  }

  async submitAnswer(id: number, data: { question_id: number; user_answer: string; time_taken: number }): Promise<void> {
    await this.api.post(`/game-rooms/${id}/submit-answer`, data);
  }

  async getRoomLeaderboard(id: number): Promise<any[]> {
    const response: AxiosResponse<any[]> = await this.api.get(`/game-rooms/${id}/leaderboard`);
    return response.data;
  }

  // Game Sessions
  async getGameState(roomId: number): Promise<GameSession> {
    const response: AxiosResponse<GameSession> = await this.api.get(`/game-sessions/${roomId}/state`);
    return response.data;
  }

  async nextQuestion(roomId: number): Promise<void> {
    await this.api.post(`/game-sessions/${roomId}/next-question`);
  }

  async pauseGame(roomId: number): Promise<void> {
    await this.api.post(`/game-sessions/${roomId}/pause`);
  }

  async resumeGame(roomId: number): Promise<void> {
    await this.api.post(`/game-sessions/${roomId}/resume`);
  }

  async skipQuestion(roomId: number): Promise<void> {
    await this.api.post(`/game-sessions/${roomId}/skip-question`);
  }

  async getQuestionResults(roomId: number): Promise<any[]> {
    const response: AxiosResponse<any[]> = await this.api.get(`/game-sessions/${roomId}/question-results`);
    return response.data;
  }

  async getGameSummary(roomId: number): Promise<any> {
    const response: AxiosResponse<any> = await this.api.get(`/game-sessions/${roomId}/summary`);
    return response.data;
  }

  // Single Player Game
  async submitSinglePlayerAnswer(data: { question_id: number; user_answer: string; time_taken: number }): Promise<void> {
    await this.api.post('/game/submit-answer', data);
  }

  async getProgress(): Promise<any> {
    const response: AxiosResponse<any> = await this.api.get('/game/progress');
    return response.data;
  }

  async getLeaderboard(limit?: number): Promise<any[]> {
    const params = limit ? { limit } : {};
    const response: AxiosResponse<any[]> = await this.api.get('/game/leaderboard', { params });
    return response.data;
  }

  async getStats(): Promise<any> {
    const response: AxiosResponse<any> = await this.api.get('/game/stats');
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;
