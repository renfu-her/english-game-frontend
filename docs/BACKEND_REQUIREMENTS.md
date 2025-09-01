# Backend Requirements for Multiplayer Game

## Current Laravel API Analysis

The existing Laravel API at `https://english-game-backend.test/api` provides excellent single-player functionality AND already has comprehensive multiplayer support! 🎉

## ✅ Available Backend Components

Your Laravel API already includes most of the required multiplayer functionality! Here's what's already implemented:

### ✅ Available API Endpoints

#### Game Rooms ✅
- `GET /api/game-rooms` - List available rooms
- `POST /api/game-rooms` - Create new room
- `GET /api/game-rooms/find-by-code` - Find room by code
- `GET /api/game-rooms/{id}` - Get room details
- `POST /api/game-rooms/{id}/join` - Join room
- `POST /api/game-rooms/{id}/leave` - Leave room
- `POST /api/game-rooms/{id}/toggle-ready` - Toggle ready status
- `POST /api/game-rooms/{id}/start` - Start game (owner only)
- `POST /api/game-rooms/{id}/end` - End game (owner only)
- `POST /api/game-rooms/{id}/submit-answer` - Submit answer
- `GET /api/game-rooms/{id}/leaderboard` - Get room leaderboard

#### Game Sessions ✅
- `GET /api/game-sessions/{roomId}/state` - Get game state
- `POST /api/game-sessions/{roomId}/next-question` - Next question
- `POST /api/game-sessions/{roomId}/pause` - Pause game
- `POST /api/game-sessions/{roomId}/resume` - Resume game
- `POST /api/game-sessions/{roomId}/skip-question` - Skip question
- `GET /api/game-sessions/{roomId}/question-results` - Get question results
- `GET /api/game-sessions/{roomId}/summary` - Get game summary

## 🚨 Still Missing Components

### 1. Database Tables

#### Game Rooms Table
```sql
CREATE TABLE game_rooms (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    category_id BIGINT UNSIGNED NULL,
    owner_id BIGINT UNSIGNED NOT NULL,
    max_players INT DEFAULT 6,
    current_players INT DEFAULT 0,
    question_count INT DEFAULT 15,
    status ENUM('waiting', 'playing', 'finished') DEFAULT 'waiting',
    is_private BOOLEAN DEFAULT FALSE,
    password VARCHAR(255) NULL,
    settings JSON NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (owner_id) REFERENCES members(id)
);
```

#### Room Players Table
```sql
CREATE TABLE room_players (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    room_id BIGINT UNSIGNED NOT NULL,
    member_id BIGINT UNSIGNED NOT NULL,
    is_ready BOOLEAN DEFAULT FALSE,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    left_at TIMESTAMP NULL,
    FOREIGN KEY (room_id) REFERENCES game_rooms(id),
    FOREIGN KEY (member_id) REFERENCES members(id),
    UNIQUE KEY unique_room_player (room_id, member_id)
);
```

#### Game Sessions Table
```sql
CREATE TABLE game_sessions (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    room_id BIGINT UNSIGNED NOT NULL,
    status ENUM('active', 'paused', 'finished') DEFAULT 'active',
    current_question INT DEFAULT 1,
    total_questions INT NOT NULL,
    started_at TIMESTAMP NULL,
    ended_at TIMESTAMP NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (room_id) REFERENCES game_rooms(id)
);
```

#### Session Answers Table
```sql
CREATE TABLE session_answers (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    session_id BIGINT UNSIGNED NOT NULL,
    member_id BIGINT UNSIGNED NOT NULL,
    question_id BIGINT UNSIGNED NOT NULL,
    user_answer TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    time_taken INT NOT NULL,
    score_earned INT NOT NULL,
    answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES game_sessions(id),
    FOREIGN KEY (member_id) REFERENCES members(id),
    FOREIGN KEY (question_id) REFERENCES questions(id)
);
```

### 2. New API Endpoints

#### Room Management
```php
// Create new room
POST /api/rooms
{
    "name": "Room Name",
    "description": "Room description",
    "category_id": 1,
    "max_players": 6,
    "question_count": 15,
    "is_private": false,
    "password": null
}

// List available rooms
GET /api/rooms?status=waiting&category_id=1&limit=20

// Get room details
GET /api/rooms/{id}

// Update room settings (owner only)
PUT /api/rooms/{id}
{
    "name": "Updated Name",
    "max_players": 4
}

// Delete room (owner only)
DELETE /api/rooms/{id}

// Join room
POST /api/rooms/{id}/join
{
    "password": "room_password" // if private
}

// Leave room
POST /api/rooms/{id}/leave

// Kick player (owner only)
POST /api/rooms/{id}/kick
{
    "member_id": 123
}
```

#### Game Session Management
```php
// Start game (owner only)
POST /api/rooms/{id}/start

// Pause game (owner only)
POST /api/rooms/{id}/pause

// Resume game (owner only)
POST /api/rooms/{id}/resume

// End game (owner only)
POST /api/rooms/{id}/end

// Get current game session
GET /api/game-sessions/{id}

// Submit answer during game
POST /api/game-sessions/{id}/submit-answer
{
    "question_id": 123,
    "user_answer": "answer",
    "time_taken": 15
}

// Get game results
GET /api/game-sessions/{id}/results
```

### 3. WebSocket Implementation

#### Required WebSocket Events

```php
// Room Events
'room:playerJoined' => [
    'room_id' => 1,
    'player' => [
        'id' => 123,
        'name' => 'John Doe',
        'is_ready' => false
    ]
]

'room:playerLeft' => [
    'room_id' => 1,
    'player_id' => 123
]

'room:playerReady' => [
    'room_id' => 1,
    'player_id' => 123,
    'is_ready' => true
]

'room:gameStarted' => [
    'room_id' => 1,
    'session_id' => 456,
    'first_question' => [...]
]

'room:gameEnded' => [
    'room_id' => 1,
    'session_id' => 456,
    'results' => [...]
]

// Game Events
'game:questionUpdate' => [
    'session_id' => 456,
    'question_number' => 5,
    'question' => [...],
    'time_limit' => 30
]

'game:answerSubmitted' => [
    'session_id' => 456,
    'player_id' => 123,
    'question_id' => 789,
    'is_correct' => true,
    'score_earned' => 15
]

'game:scoreUpdate' => [
    'session_id' => 456,
    'scores' => [
        ['player_id' => 123, 'score' => 150],
        ['player_id' => 124, 'score' => 120]
    ]
]

'game:timeUpdate' => [
    'session_id' => 456,
    'time_remaining' => 15
]
```

### 4. New Controllers Needed

#### RoomController
```php
class RoomController extends Controller
{
    public function index(Request $request)
    public function store(Request $request)
    public function show($id)
    public function update(Request $request, $id)
    public function destroy($id)
    public function join(Request $request, $id)
    public function leave($id)
    public function kick(Request $request, $id)
    public function start($id)
    public function pause($id)
    public function resume($id)
    public function end($id)
}
```

#### GameSessionController
```php
class GameSessionController extends Controller
{
    public function show($id)
    public function submitAnswer(Request $request, $id)
    public function getResults($id)
    public function getCurrentQuestion($id)
}
```

#### WebSocketController
```php
class WebSocketController extends Controller
{
    public function onConnect($connection)
    public function onJoinRoom($connection, $data)
    public function onLeaveRoom($connection, $data)
    public function onReady($connection, $data)
    public function onSubmitAnswer($connection, $data)
    public function onDisconnect($connection)
}
```

### 5. Middleware Requirements

#### Room Access Middleware
```php
class RoomAccessMiddleware
{
    public function handle($request, Closure $next)
    {
        // Check if user is in the room
        // Check room permissions
        // Validate room status
    }
}
```

#### RoomOwnerMiddleware
```php
class RoomOwnerMiddleware
{
    public function handle($request, Closure $next)
    {
        // Check if user is room owner
        // Allow only owner actions
    }
}
```

### 6. Broadcasting Configuration

#### Laravel Broadcasting Setup
```php
// config/broadcasting.php
'pusher' => [
    'driver' => 'pusher',
    'key' => env('PUSHER_APP_KEY'),
    'secret' => env('PUSHER_APP_SECRET'),
    'app_id' => env('PUSHER_APP_ID'),
    'options' => [
        'cluster' => env('PUSHER_APP_CLUSTER'),
        'encrypted' => true,
    ],
],
```

#### Event Classes
```php
class PlayerJoinedRoom implements ShouldBroadcast
{
    public $room_id;
    public $player;
    
    public function broadcastOn()
    {
        return new PrivateChannel('room.' . $this->room_id);
    }
}
```

### 7. Queue Jobs for Game Logic

#### ProcessGameSession Job
```php
class ProcessGameSession implements ShouldQueue
{
    public function handle()
    {
        // Handle game timer
        // Process unanswered questions
        // Update game state
        // Broadcast updates
    }
}
```

### 8. Additional Features

#### Real-time Chat
```php
// Chat messages table
CREATE TABLE room_messages (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    room_id BIGINT UNSIGNED NOT NULL,
    member_id BIGINT UNSIGNED NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES game_rooms(id),
    FOREIGN KEY (member_id) REFERENCES members(id)
);
```

#### Room Invitations
```php
// Room invitations table
CREATE TABLE room_invitations (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    room_id BIGINT UNSIGNED NOT NULL,
    inviter_id BIGINT UNSIGNED NOT NULL,
    invitee_id BIGINT UNSIGNED NOT NULL,
    status ENUM('pending', 'accepted', 'declined') DEFAULT 'pending',
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES game_rooms(id),
    FOREIGN KEY (inviter_id) REFERENCES members(id),
    FOREIGN KEY (invitee_id) REFERENCES members(id)
);
```

## 🚀 Implementation Priority

### Phase 1 (Core Multiplayer)
1. Database migrations for rooms and sessions
2. Basic room CRUD operations
3. Join/leave room functionality
4. Simple WebSocket connection

### Phase 2 (Game Logic)
1. Game session management
2. Real-time question distribution
3. Answer submission and scoring
4. Game state synchronization

### Phase 3 (Advanced Features)
1. Room chat system
2. Player invitations
3. Advanced room settings
4. Performance optimizations

## 📋 Testing Requirements

### API Testing
- Room creation and management
- Player join/leave scenarios
- Game session flow
- Error handling

### WebSocket Testing
- Connection management
- Event broadcasting
- Real-time synchronization
- Disconnection handling

### Load Testing
- Multiple concurrent rooms
- High player counts
- WebSocket connection limits
- Database performance

## 🔧 Configuration Updates

### Environment Variables
```env
# WebSocket
PUSHER_APP_KEY=your_key
PUSHER_APP_SECRET=your_secret
PUSHER_APP_ID=your_id
PUSHER_APP_CLUSTER=your_cluster

# Game Settings
GAME_MAX_ROOMS=100
GAME_MAX_PLAYERS_PER_ROOM=6
GAME_QUESTION_TIME_LIMIT=30
GAME_SESSION_TIMEOUT=300
```

### CORS Configuration
```php
// config/cors.php
return [
    'paths' => ['api/*', 'broadcasting/auth'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:3000', 'https://your-frontend.com'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
```

This comprehensive backend enhancement will transform your single-player API into a full-featured multiplayer gaming platform!
