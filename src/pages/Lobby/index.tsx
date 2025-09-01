import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  Group as GroupIcon,
  School as SchoolIcon,
  PlayArrow as PlayIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { RootState, AppDispatch } from '../../store';
import { 
  fetchGameRooms, 
  fetchCategories, 
  createGameRoom,
  joinGameRoom 
} from '../../store/slices/gameSlice';
import { CreateRoomForm } from '../../types';

const Lobby: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { 
    rooms, 
    categories, 
    roomsLoading, 
    categoriesLoading,
    roomsError 
  } = useSelector((state: RootState) => state.game);

  // Ensure rooms is always an array
  const safeRooms = Array.isArray(rooms) ? rooms : [];

  // Debug logging
  console.log('Lobby component - categories state:', categories);
  console.log('Lobby component - categories length:', Array.isArray(categories) ? categories.length : 'not an array');
  console.log('Lobby component - categoriesLoading:', categoriesLoading);
  console.log('Lobby component - categoriesError:', useSelector((state: RootState) => state.game.categoriesError));
  console.log('Lobby component - rooms state:', rooms);
  console.log('Lobby component - rooms length:', Array.isArray(rooms) ? rooms.length : 'not an array');

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateRoomForm>();

  useEffect(() => {
    // Only fetch data if user is authenticated
    if (user) {
      console.log('Lobby useEffect - user authenticated, fetching data');
      dispatch(fetchGameRooms({}));
      dispatch(fetchCategories());
    }
  }, [dispatch, user]);

  const handleCreateRoom = async (data: CreateRoomForm) => {
    const result = await dispatch(createGameRoom(data));
    if (createGameRoom.fulfilled.match(result)) {
      setCreateDialogOpen(false);
      reset();
      navigate(`/room/${result.payload.id}`);
    }
  };

  const handleJoinRoom = async (roomId: number) => {
    const result = await dispatch(joinGameRoom({ roomId }));
    if (joinGameRoom.fulfilled.match(result)) {
      navigate(`/room/${roomId}`);
    }
  };

  const handleRefresh = () => {
    dispatch(fetchGameRooms({}));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'primary';
      case 'playing':
        return 'warning';
      case 'finished':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'Waiting';
      case 'playing':
        return 'Playing';
      case 'finished':
        return 'Finished';
      default:
        return status;
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          🎮 Game Lobby
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Tooltip title="Refresh rooms">
            <IconButton onClick={handleRefresh} disabled={roomsLoading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
          >
            Create Room
          </Button>
        </Box>
      </Box>

      {/* Error Alert */}
      {roomsError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {roomsError}
        </Alert>
      )}

      {/* Loading */}
      {roomsLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        /* Room Grid */
        <Grid container spacing={3}>
          {safeRooms.length === 0 ? (
            <Grid item xs={12}>
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No game rooms available
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Be the first to create a room and start playing!
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
           ) : (
             safeRooms.map((room) => (
                             <Grid item xs={12} sm={6} md={4} key={room.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                        {room.name}
                      </Typography>
                      {room.is_private && (
                        <Tooltip title="Private Room">
                          <LockIcon color="action" fontSize="small" />
                        </Tooltip>
                      )}
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {room.description || 'No description'}
                    </Typography>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      <Chip
                        label={getStatusText(room.status)}
                        color={getStatusColor(room.status) as any}
                        size="small"
                      />
                      <Chip
                        icon={<GroupIcon />}
                        label={`${room.current_players}/${room.max_players}`}
                        size="small"
                        variant="outlined"
                      />
                      {room.category && (
                        <Chip
                          icon={<SchoolIcon />}
                          label={room.category.name}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>

                    <Typography variant="body2" color="text.secondary">
                      Owner: {room.owner?.name || 'Unknown'}
                    </Typography>
                  </CardContent>

                  <CardActions>
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<PlayIcon />}
                      onClick={() => handleJoinRoom(room.id)}
                      disabled={room.status !== 'waiting' || room.current_players >= room.max_players}
                      fullWidth
                    >
                      {room.status === 'waiting' ? 'Join Room' : 'In Progress'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}

      {/* Create Room Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Game Room</DialogTitle>
        <form onSubmit={handleSubmit(handleCreateRoom)}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Room Name"
              fullWidth
              variant="outlined"
              {...register('name', { required: 'Room name is required' })}
              error={!!errors.name}
              helperText={errors.name?.message}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Description (Optional)"
              fullWidth
              variant="outlined"
              multiline
              rows={2}
              {...register('description')}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Category</InputLabel>
              <Select
                label="Category"
                {...register('category_id')}
                defaultValue=""
              >
                                 <MenuItem value="">Random Category</MenuItem>
                 {Array.isArray(categories) && categories.map((category) => {
                   console.log('Rendering category:', category);
                   return (
                     <MenuItem key={category.id} value={category.id}>
                       {category.name} (Level {category.difficulty_level})
                     </MenuItem>
                   );
                 })}
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              label="Max Players"
              type="number"
              fullWidth
              variant="outlined"
              {...register('max_players', {
                required: 'Max players is required',
                min: { value: 2, message: 'Minimum 2 players' },
                max: { value: 6, message: 'Maximum 6 players' },
              })}
              error={!!errors.max_players}
              helperText={errors.max_players?.message}
              defaultValue={6}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Question Count"
              type="number"
              fullWidth
              variant="outlined"
              {...register('question_count', {
                required: 'Question count is required',
                min: { value: 10, message: 'Minimum 10 questions' },
                max: { value: 20, message: 'Maximum 20 questions' },
              })}
              error={!!errors.question_count}
              helperText={errors.question_count?.message}
              defaultValue={15}
              sx={{ mb: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Create Room</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Lobby;
