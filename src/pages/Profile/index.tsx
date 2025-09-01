import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper
} from '@mui/material';
import {
  EmojiEvents,
  TrendingUp,
  School,
  Speed,
  Psychology
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const Profile: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  // Mock data - in real app, this would come from API
  const stats = {
    totalGames: 45,
    gamesWon: 28,
    totalScore: 1250,
    averageScore: 27.8,
    bestScore: 95,
    questionsAnswered: 675,
    correctAnswers: 589,
    accuracy: 87.3,
    level: user?.level || 1,
    experience: 1250,
    nextLevelExp: 2000
  };

  const achievements = [
    { name: 'First Victory', description: 'Win your first game', earned: true, icon: '🏆' },
    { name: 'Speed Demon', description: 'Answer 10 questions in under 2 minutes', earned: true, icon: '⚡' },
    { name: 'Perfect Score', description: 'Get 100% on a game', earned: false, icon: '💯' },
    { name: 'Social Butterfly', description: 'Play with 10 different players', earned: true, icon: '🦋' },
    { name: 'Grammar Master', description: 'Complete 50 grammar questions', earned: false, icon: '📚' },
    { name: 'Vocabulary Expert', description: 'Learn 100 new words', earned: true, icon: '📖' }
  ];

  const recentGames = [
    { date: '2024-01-15', score: 85, result: 'Won', category: 'Grammar' },
    { date: '2024-01-14', score: 72, result: 'Lost', category: 'Vocabulary' },
    { date: '2024-01-13', score: 91, result: 'Won', category: 'Reading' },
    { date: '2024-01-12', score: 68, result: 'Lost', category: 'Grammar' },
    { date: '2024-01-11', score: 88, result: 'Won', category: 'Vocabulary' }
  ];

  const experienceProgress = ((stats.experience % stats.nextLevelExp) / stats.nextLevelExp) * 100;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          👤 Profile
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track your progress and achievements
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Profile Info */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mx: 'auto',
                  mb: 2,
                  bgcolor: 'primary.main',
                  fontSize: '3rem'
                }}
              >
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </Avatar>
              
              <Typography variant="h5" gutterBottom>
                {user?.name}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {user?.email}
              </Typography>

              <Box sx={{ mt: 2, mb: 3 }}>
                <Chip
                  label={`Level ${stats.level}`}
                  color="primary"
                  variant="outlined"
                  sx={{ mr: 1 }}
                />
                <Chip
                  label={`${stats.totalScore} pts`}
                  color="secondary"
                  variant="outlined"
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Experience Progress
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={experienceProgress}
                  sx={{ height: 8, borderRadius: 4 }}
                />
                <Typography variant="caption" color="text.secondary">
                  {stats.experience} / {stats.nextLevelExp} XP
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Statistics */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📊 Statistics
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary.main">
                      {stats.totalGames}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Games
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="success.main">
                      {stats.gamesWon}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Games Won
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="warning.main">
                      {stats.averageScore}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Avg Score
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="info.main">
                      {stats.accuracy}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Accuracy
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Win Rate
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={(stats.gamesWon / stats.totalGames) * 100}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {((stats.gamesWon / stats.totalGames) * 100).toFixed(1)}%
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Best Score
                    </Typography>
                    <Typography variant="h6" color="success.main">
                      {stats.bestScore} points
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Achievements */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🏆 Achievements
              </Typography>
              
              <Grid container spacing={1}>
                {achievements.map((achievement, index) => (
                  <Grid item xs={12} key={index}>
                    <Paper
                      sx={{
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        opacity: achievement.earned ? 1 : 0.5,
                        backgroundColor: achievement.earned ? 'success.light' : 'grey.100'
                      }}
                    >
                      <Typography variant="h5">
                        {achievement.icon}
                      </Typography>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {achievement.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {achievement.description}
                        </Typography>
                      </Box>
                      <Chip
                        label={achievement.earned ? 'Earned' : 'Locked'}
                        color={achievement.earned ? 'success' : 'default'}
                        size="small"
                      />
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Games */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🎮 Recent Games
              </Typography>
              
              <List>
                {recentGames.map((game, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              {game.category}
                            </Typography>
                            <Chip
                              label={game.result}
                              color={game.result === 'Won' ? 'success' : 'error'}
                              size="small"
                            />
                          </Box>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(game.date).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Score: {game.score}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < recentGames.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
