import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  GameRoom, 
  GameSession, 
  Question, 
  Category, 
  PlayerScore, 
  SessionAnswer,
  CreateRoomForm,
  JoinRoomForm
} from '../../types';
import apiService from '../../services/api';

interface GameState {
  // Rooms
  rooms: GameRoom[];
  currentRoom: GameRoom | null;
  roomsLoading: boolean;
  roomsError: string | null;
  
  // Categories
  categories: Category[];
  categoriesLoading: boolean;
  categoriesError: string | null;
  
  // Game Session
  session: GameSession | null;
  currentQuestion: Question | null;
  questionNumber: number;
  timeRemaining: number;
  
  // Scores and Results
  scores: PlayerScore[];
  answers: SessionAnswer[];
  
  // Game State
  gameLoading: boolean;
  gameError: string | null;
}

const initialState: GameState = {
  // Rooms
  rooms: [],
  currentRoom: null,
  roomsLoading: false,
  roomsError: null,
  
  // Categories
  categories: [],
  categoriesLoading: false,
  categoriesError: null,
  
  // Game Session
  session: null,
  currentQuestion: null,
  questionNumber: 1,
  timeRemaining: 30,
  
  // Scores and Results
  scores: [],
  answers: [],
  
  // Game State
  gameLoading: false,
  gameError: null,
};

// Async thunks
export const fetchCategories = createAsyncThunk(
  'game/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      return await apiService.getCategories();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
    }
  }
);

export const fetchGameRooms = createAsyncThunk(
  'game/fetchGameRooms',
  async (params?: { status?: string; category_id?: number; limit?: number }, { rejectWithValue }) => {
    try {
      return await apiService.getGameRooms(params);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch game rooms');
    }
  }
);

export const createGameRoom = createAsyncThunk(
  'game/createGameRoom',
  async (roomData: CreateRoomForm, { rejectWithValue }) => {
    try {
      return await apiService.createGameRoom(roomData);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create game room');
    }
  }
);

export const joinGameRoom = createAsyncThunk(
  'game/joinGameRoom',
  async ({ roomId, data }: { roomId: number; data?: JoinRoomForm }, { rejectWithValue }) => {
    try {
      await apiService.joinGameRoom(roomId, data);
      return await apiService.getGameRoom(roomId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to join game room');
    }
  }
);

export const leaveGameRoom = createAsyncThunk(
  'game/leaveGameRoom',
  async (roomId: number, { rejectWithValue }) => {
    try {
      await apiService.leaveGameRoom(roomId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to leave game room');
    }
  }
);

export const toggleReady = createAsyncThunk(
  'game/toggleReady',
  async (roomId: number, { rejectWithValue }) => {
    try {
      await apiService.toggleReady(roomId);
      return await apiService.getGameRoom(roomId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle ready status');
    }
  }
);

export const startGame = createAsyncThunk(
  'game/startGame',
  async (roomId: number, { rejectWithValue }) => {
    try {
      await apiService.startGame(roomId);
      return await apiService.getGameState(roomId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to start game');
    }
  }
);

export const submitAnswer = createAsyncThunk(
  'game/submitAnswer',
  async ({ roomId, data }: { roomId: number; data: { question_id: number; user_answer: string; time_taken: number } }, { rejectWithValue }) => {
    try {
      await apiService.submitAnswer(roomId, data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit answer');
    }
  }
);

export const getGameState = createAsyncThunk(
  'game/getGameState',
  async (roomId: number, { rejectWithValue }) => {
    try {
      return await apiService.getGameState(roomId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get game state');
    }
  }
);

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    clearGameError: (state) => {
      state.gameError = null;
    },
    setCurrentRoom: (state, action: PayloadAction<GameRoom>) => {
      state.currentRoom = action.payload;
    },
    clearCurrentRoom: (state) => {
      state.currentRoom = null;
    },
    setCurrentQuestion: (state, action: PayloadAction<Question>) => {
      state.currentQuestion = action.payload;
    },
    setQuestionNumber: (state, action: PayloadAction<number>) => {
      state.questionNumber = action.payload;
    },
    setTimeRemaining: (state, action: PayloadAction<number>) => {
      state.timeRemaining = action.payload;
    },
    updateScores: (state, action: PayloadAction<PlayerScore[]>) => {
      state.scores = action.payload;
    },
    addAnswer: (state, action: PayloadAction<SessionAnswer>) => {
      state.answers.push(action.payload);
    },
    resetGameState: (state) => {
      state.session = null;
      state.currentQuestion = null;
      state.questionNumber = 1;
      state.timeRemaining = 30;
      state.scores = [];
      state.answers = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesLoading = true;
        state.categoriesError = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.categoriesError = action.payload as string;
      })
      // Fetch Game Rooms
      .addCase(fetchGameRooms.pending, (state) => {
        state.roomsLoading = true;
        state.roomsError = null;
      })
      .addCase(fetchGameRooms.fulfilled, (state, action) => {
        state.roomsLoading = false;
        state.rooms = action.payload;
      })
      .addCase(fetchGameRooms.rejected, (state, action) => {
        state.roomsLoading = false;
        state.roomsError = action.payload as string;
      })
      // Create Game Room
      .addCase(createGameRoom.pending, (state) => {
        state.gameLoading = true;
        state.gameError = null;
      })
      .addCase(createGameRoom.fulfilled, (state, action) => {
        state.gameLoading = false;
        state.currentRoom = action.payload;
      })
      .addCase(createGameRoom.rejected, (state, action) => {
        state.gameLoading = false;
        state.gameError = action.payload as string;
      })
      // Join Game Room
      .addCase(joinGameRoom.pending, (state) => {
        state.gameLoading = true;
        state.gameError = null;
      })
      .addCase(joinGameRoom.fulfilled, (state, action) => {
        state.gameLoading = false;
        state.currentRoom = action.payload;
      })
      .addCase(joinGameRoom.rejected, (state, action) => {
        state.gameLoading = false;
        state.gameError = action.payload as string;
      })
      // Leave Game Room
      .addCase(leaveGameRoom.fulfilled, (state) => {
        state.currentRoom = null;
        state.session = null;
        state.currentQuestion = null;
        state.questionNumber = 1;
        state.timeRemaining = 30;
        state.scores = [];
        state.answers = [];
      })
      // Toggle Ready
      .addCase(toggleReady.pending, (state) => {
        state.gameLoading = true;
      })
      .addCase(toggleReady.fulfilled, (state, action) => {
        state.gameLoading = false;
        state.currentRoom = action.payload;
      })
      .addCase(toggleReady.rejected, (state, action) => {
        state.gameLoading = false;
        state.gameError = action.payload as string;
      })
      // Start Game
      .addCase(startGame.pending, (state) => {
        state.gameLoading = true;
        state.gameError = null;
      })
      .addCase(startGame.fulfilled, (state, action) => {
        state.gameLoading = false;
        state.session = action.payload;
      })
      .addCase(startGame.rejected, (state, action) => {
        state.gameLoading = false;
        state.gameError = action.payload as string;
      })
      // Get Game State
      .addCase(getGameState.pending, (state) => {
        state.gameLoading = true;
      })
      .addCase(getGameState.fulfilled, (state, action) => {
        state.gameLoading = false;
        state.session = action.payload;
      })
      .addCase(getGameState.rejected, (state, action) => {
        state.gameLoading = false;
        state.gameError = action.payload as string;
      });
  },
});

export const {
  clearGameError,
  setCurrentRoom,
  clearCurrentRoom,
  setCurrentQuestion,
  setQuestionNumber,
  setTimeRemaining,
  updateScores,
  addAnswer,
  resetGameState,
} = gameSlice.actions;

export default gameSlice.reducer;
