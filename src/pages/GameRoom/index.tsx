import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Paper
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  ExitToApp as LeaveIcon,
  CheckCircle as ReadyIcon,
  RadioButtonUnchecked as NotReadyIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { 
  toggleReady, 
  startGame, 
  leaveGameRoom,
  getGameState 
} from '../../store/slices/gameSlice';

const GameRoom: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { currentRoom, session, gameLoading, gameError } = useSelector((state: RootState) => state.game);

  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (roomId && currentRoom) {
      setIsOwner(currentRoom.owner_id === user?.id);
    }
  }, [roomId, currentRoom, user]);

  useEffect(() => {
    if (session?.status === 'active') {
      // Game has started, could redirect to game interface
      console.log('Game started!');
    }
  }, [session]);

  const handleToggleReady = async () => {
    if (roomId) {
      await dispatch(toggleReady(parseInt(roomId)));
    }
  };

  const handleStartGame = async () => {
    if (roomId) {
      await dispatch(startGame(parseInt(roomId)));
    }
  };

  const handleLeaveRoom = async () => {
    if (roomId) {
      await dispatch(leaveGameRoom(parseInt(roomId)));
      navigate('/lobby');
    }
  };

  const getPlayerReadyStatus = (player: any) => {
    return player.is_ready ? (
      <ReadyIcon color="success" />
    ) : (
      <NotReadyIcon color="disabled" />
    );
  };

  const canStartGame = () => {
    if (!currentRoom || !isOwner) return false;
    
    const readyPlayers = currentRoom.players?.filter((p: any) => p.is_ready).length || 0;
    const totalPlayers = currentRoom.players?.length || 0;
    
    return readyPlayers >= 2 && readyPlayers === totalPlayers;
  };

  if (!currentRoom) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            🎮 {currentRoom.name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {currentRoom.description || 'No description'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<LeaveIcon />}
            onClick={handleLeaveRoom}
            color="error"
          >
            Leave Room
          </Button>
        </Box>
      </Box>

      {/* Error Alert */}
      {gameError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {gameError}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Players List */}
                 <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Players ({currentRoom.players?.length || 0}/{currentRoom.max_players})
              </Typography>
              
              <List>
                {currentRoom.players?.map((player: any, index: number) => (
                  <React.Fragment key={player.id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: player.member?.id === user?.id ? 'primary.main' : 'grey.500' }}>
                          {player.member?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {player.member?.name}
                            {player.member?.id === currentRoom.owner_id && (
                              <Chip label="Owner" size="small" color="primary" />
                            )}
                            {player.member?.id === user?.id && (
                              <Chip label="You" size="small" color="secondary" />
                            )}
                          </Box>
                        }
                        secondary={`Joined ${new Date(player.joined_at).toLocaleTimeString()}`}
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getPlayerReadyStatus(player)}
                        <Typography variant="body2" color="text.secondary">
                          {player.is_ready ? 'Ready' : 'Not Ready'}
                        </Typography>
                      </Box>
                    </ListItem>
                    {index < (currentRoom.players?.length || 0) - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>

              {(!currentRoom.players || currentRoom.players.length === 0) && (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  No players in room
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Room Info & Controls */}
                 <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Room Information
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Status
                </Typography>
                <Chip
                  label={currentRoom.status.charAt(0).toUpperCase() + currentRoom.status.slice(1)}
                  color={currentRoom.status === 'waiting' ? 'primary' : 'warning'}
                  sx={{ mb: 2 }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Category
                </Typography>
                <Typography variant="body1">
                  {currentRoom.category?.name || 'Random Category'}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Questions
                </Typography>
                <Typography variant="body1">
                  {currentRoom.question_count} questions
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Max Players
                </Typography>
                <Typography variant="body1">
                  {currentRoom.max_players} players
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Player Controls */}
              <Typography variant="h6" gutterBottom>
                Controls
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={handleToggleReady}
                  disabled={gameLoading}
                  startIcon={currentRoom.players?.find((p: any) => p.member?.id === user?.id)?.is_ready ? <ReadyIcon /> : <NotReadyIcon />}
                >
                  {currentRoom.players?.find((p: any) => p.member?.id === user?.id)?.is_ready ? 'Ready' : 'Set Ready'}
                </Button>

                {isOwner && (
                  <Button
                    variant="contained"
                    onClick={handleStartGame}
                    disabled={!canStartGame() || gameLoading}
                    startIcon={<PlayIcon />}
                  >
                    {gameLoading ? <CircularProgress size={20} /> : 'Start Game'}
                  </Button>
                )}
              </Box>

              {isOwner && !canStartGame() && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  All players must be ready to start the game
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Game Session Info */}
      {session && (
        <Paper sx={{ mt: 3, p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Game Session
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Status: {session.status} | 
            Question: {session.current_question}/{session.total_questions} |
            Started: {session.started_at ? new Date(session.started_at).toLocaleString() : 'Not started'}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default GameRoom;
