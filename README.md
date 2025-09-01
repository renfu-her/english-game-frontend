# English Learning Game Frontend

A modern React-based multiplayer English learning game with real-time gameplay, competitive features, and an intuitive user interface.

## 🎮 Features

### Core Gameplay
- **Multiplayer Rooms**: Create or join game rooms with up to 6 players
- **Real-time Gameplay**: Live synchronized gameplay with WebSocket support
- **Multiple Question Types**: Multiple choice and fill-in-the-blank questions
- **Category Selection**: Choose specific categories or random selection
- **Flexible Game Length**: 10-20 questions per game session
- **Competitive Scoring**: Real-time leaderboards and performance tracking

### User Experience
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Intuitive Interface**: Clean, modern UI with smooth animations
- **Real-time Updates**: Live score updates and player status
- **Game Controls**: Room owner can start, pause, and end games
- **Player Management**: Kick players, ready system, and room settings

### Authentication & Security
- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: Role-based access control
- **User Profiles**: Personal statistics and achievement tracking
- **Session Management**: Automatic token refresh and logout

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Access to the Laravel backend API

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd english-game-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_API_URL=https://english-game-backend.test/api
   REACT_APP_WS_URL=wss://english-game-backend.test
   REACT_APP_APP_NAME="English Learning Game"
   ```

4. **Start development server**
   ```bash
   npm start
   # or
   yarn start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Shared components (Button, Modal, etc.)
│   ├── auth/           # Authentication components
│   ├── game/           # Game-related components
│   └── layout/         # Layout components (Header, Sidebar, etc.)
├── pages/              # Page components
│   ├── Home/           # Landing page
│   ├── Auth/           # Login/Register pages
│   ├── Lobby/          # Game lobby
│   ├── GameRoom/       # Game room interface
│   └── Profile/        # User profile
├── hooks/              # Custom React hooks
├── services/           # API and WebSocket services
├── store/              # State management
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── styles/             # Global styles and themes
```

## 🛠 Technology Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **React Router v6** - Client-side routing
- **Redux Toolkit** - State management
- **Socket.io-client** - Real-time communication
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **Material-UI** - UI component library

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Jest** - Testing framework
- **React Testing Library** - Component testing
- **Storybook** - Component documentation

## 🎯 Game Flow

### 1. Authentication
- User registers or logs in
- JWT token is stored securely
- Protected routes are accessible

### 2. Game Lobby
- Browse available game rooms
- Create new room with settings:
  - Category selection (specific or random)
  - Question count (10-20)
  - Room name and description
- Join existing rooms

### 3. Game Room
- **Waiting Phase**:
  - Players join and set ready status
  - Room owner can configure settings
  - Chat system for communication
- **Game Phase**:
  - Real-time question display
  - Timer countdown
  - Answer submission
  - Live score updates
- **Results Phase**:
  - Final rankings
  - Performance statistics
  - Achievement notifications

## 🔧 Development

### Available Scripts

```bash
# Development
npm start          # Start development server
npm run build      # Build for production
npm run test       # Run tests
npm run test:watch # Run tests in watch mode
npm run lint       # Run ESLint
npm run format     # Format code with Prettier

# Storybook
npm run storybook  # Start Storybook
npm run build-storybook # Build Storybook

# Type checking
npm run type-check # Run TypeScript compiler
```

### Code Style

This project uses:
- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety

### Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- --testPathPattern=ComponentName
```

### State Management

The app uses Redux Toolkit for state management with the following slices:
- `auth` - User authentication state
- `game` - Game room and gameplay state
- `ui` - UI state and notifications

## 🌐 API Integration

### Authentication Endpoints
```typescript
// Login
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password"
}

// Register
POST /api/auth/register
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password",
  "password_confirmation": "password"
}
```

### Game Room Endpoints
```typescript
// Create room
POST /api/game-rooms
{
    "name": "Room Name",
    "category_id": 1,
    "question_count": 15,
    "max_players": 6
}

// List rooms
GET /api/game-rooms

// Find room by code
GET /api/game-rooms/find-by-code?code=ABC123

// Get room details
GET /api/game-rooms/{id}

// Join room
POST /api/game-rooms/{id}/join

// Leave room
POST /api/game-rooms/{id}/leave

// Toggle ready status
POST /api/game-rooms/{id}/toggle-ready

// Start game (owner only)
POST /api/game-rooms/{id}/start

// End game (owner only)
POST /api/game-rooms/{id}/end

// Submit answer
POST /api/game-rooms/{id}/submit-answer
{
    "question_id": 123,
    "user_answer": "answer",
    "time_taken": 15
}

// Get room leaderboard
GET /api/game-rooms/{id}/leaderboard
```

### WebSocket Events
```typescript
// Room events
socket.on('room:playerJoined', (player) => {})
socket.on('room:playerLeft', (playerId) => {})
socket.on('room:gameStarted', (gameData) => {})

// Game events
socket.on('game:questionUpdate', (question) => {})
socket.on('game:scoreUpdate', (scores) => {})
socket.on('game:gameEnded', (results) => {})
```

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)
- **Mobile** (320px - 767px)

### Breakpoints
```scss
$breakpoints: (
  mobile: 320px,
  tablet: 768px,
  desktop: 1200px
);
```

## 🔒 Security

### Frontend Security Measures
- **Input Validation**: All user inputs are validated
- **XSS Prevention**: Content is properly sanitized
- **CSRF Protection**: Tokens are included in requests
- **Secure Storage**: JWT tokens stored in httpOnly cookies
- **HTTPS Enforcement**: All API calls use HTTPS

### Environment Variables
```env
# Required
REACT_APP_API_URL=https://english-game-backend.test/api
REACT_APP_WS_URL=wss://english-game-backend.test

# Optional
REACT_APP_APP_NAME="English Learning Game"
REACT_APP_VERSION=1.0.0
REACT_APP_ENVIRONMENT=development
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Environment Setup
1. Set production environment variables
2. Configure API endpoints
3. Set up WebSocket endpoints
4. Configure CDN for static assets

### Deployment Options
- **Vercel**: Zero-config deployment
- **Netlify**: Static site hosting
- **AWS S3 + CloudFront**: Scalable hosting
- **Docker**: Containerized deployment

## 🧪 Testing

### Test Structure
```
src/
├── __tests__/          # Test files
│   ├── components/     # Component tests
│   ├── hooks/          # Hook tests
│   ├── services/       # Service tests
│   └── utils/          # Utility tests
└── __mocks__/          # Mock files
```

### Running Tests
```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

## 📊 Performance

### Optimization Techniques
- **Code Splitting**: Lazy loading of routes and components
- **Bundle Analysis**: Regular bundle size monitoring
- **Image Optimization**: WebP format and lazy loading
- **Caching**: Service worker for offline support
- **Compression**: Gzip compression for static assets

### Performance Monitoring
- **Lighthouse**: Regular performance audits
- **Bundle Analyzer**: Monitor bundle size
- **Real User Monitoring**: Track actual user performance

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

### Code Standards
- Follow TypeScript best practices
- Write meaningful commit messages
- Add JSDoc comments for complex functions
- Maintain test coverage above 80%

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help
- **Documentation**: Check the docs folder
- **Issues**: Create an issue on GitHub
- **Discussions**: Use GitHub Discussions for questions

### Common Issues
- **CORS Errors**: Ensure backend CORS is configured
- **WebSocket Connection**: Check WebSocket endpoint configuration
- **Build Errors**: Clear node_modules and reinstall dependencies

## 🔄 Backend Requirements

The Laravel backend already has excellent multiplayer support! Here's what's available:

### ✅ Available Features
- **Complete API Coverage**: All necessary endpoints for multiplayer gameplay
- **Game Room Management**: Create, join, leave, and manage rooms
- **Game Session Control**: Start, pause, resume, and end games
- **Player Management**: Ready system, leaderboards, and answer submission
- **Real-time Game State**: Question progression and session management

### 🔄 Still Needed
- **WebSocket Implementation**: For real-time updates and live gameplay
- **Database Tables**: Ensure `game_rooms`, `game_sessions`, and related tables exist
- **Real-time Broadcasting**: For live score updates and player actions

### API Endpoints Available
- ✅ Room CRUD operations (`/api/game-rooms`)
- ✅ Player management (join, leave, ready)
- ✅ Game session control (`/api/game-sessions`)
- ✅ Real-time game state management
- ⏳ WebSocket event handling (needs implementation)

For detailed backend requirements, see the [TODO.md](TODO.md) file.
