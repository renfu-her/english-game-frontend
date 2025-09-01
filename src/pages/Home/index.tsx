import React from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Container,
  Paper,
  Chip,
  Stack
} from '@mui/material';
import {
  School,
  Group,
  EmojiEvents,
  Speed,
  Psychology,
  TrendingUp
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const features = [
    {
      icon: <Group sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Multiplayer Rooms',
      description: 'Create or join game rooms with up to 6 players for competitive learning.'
    },
    {
      icon: <School sx={{ fontSize: 40, color: 'secondary.main' }} />,
      title: 'Multiple Categories',
      description: 'Choose from various difficulty levels and topics to match your skills.'
    },
    {
      icon: <Speed sx={{ fontSize: 40, color: 'success.main' }} />,
      title: 'Real-time Gameplay',
      description: 'Experience live synchronized gameplay with instant feedback and scoring.'
    },
    {
      icon: <EmojiEvents sx={{ fontSize: 40, color: 'warning.main' }} />,
      title: 'Competitive Scoring',
      description: 'Track your progress with detailed statistics and leaderboards.'
    },
    {
      icon: <Psychology sx={{ fontSize: 40, color: 'info.main' }} />,
      title: 'Smart Questions',
      description: 'Multiple choice and fill-in-the-blank questions with explanations.'
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40, color: 'error.main' }} />,
      title: 'Progress Tracking',
      description: 'Monitor your learning progress with detailed analytics and achievements.'
    }
  ];

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/lobby');
    } else {
      navigate('/register');
    }
  };

  return (
    <Box>
      {/* Hero Section */}
      <Paper
        sx={{
          position: 'relative',
          backgroundColor: 'grey.800',
          color: 'white',
          mb: 4,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)',
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography
              component="h1"
              variant="h2"
              color="inherit"
              gutterBottom
              sx={{ fontWeight: 'bold', mb: 3 }}
            >
              🎮 English Learning Game
            </Typography>
            <Typography variant="h5" color="inherit" paragraph sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
              Master English through interactive multiplayer games. 
              Challenge friends, compete globally, and improve your language skills in real-time.
            </Typography>
            
            {isAuthenticated && user && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Welcome back, {user.name}! 🎉
                </Typography>
                <Stack direction="row" spacing={2} justifyContent="center">
                  <Chip 
                    label={`Level ${user.level}`} 
                    color="primary" 
                    variant="outlined"
                    sx={{ color: 'white', borderColor: 'white' }}
                  />
                  <Chip 
                    label={`${user.score} points`} 
                    color="secondary" 
                    variant="outlined"
                    sx={{ color: 'white', borderColor: 'white' }}
                  />
                </Stack>
              </Box>
            )}
            
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="contained"
                size="large"
                onClick={handleGetStarted}
                sx={{ 
                  px: 4, 
                  py: 1.5, 
                  fontSize: '1.1rem',
                  backgroundColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  }
                }}
              >
                {isAuthenticated ? 'Join Game Lobby' : 'Get Started'}
              </Button>
              {!isAuthenticated && (
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{ 
                    px: 4, 
                    py: 1.5, 
                    fontSize: '1.1rem',
                    color: 'white',
                    borderColor: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    }
                  }}
                >
                  Login
                </Button>
              )}
            </Stack>
          </Box>
        </Container>
      </Paper>

      {/* Features Section */}
      <Container maxWidth="lg">
        <Typography
          component="h2"
          variant="h3"
          align="center"
          color="text.primary"
          gutterBottom
          sx={{ mb: 6 }}
        >
          Why Choose Our Game?
        </Typography>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
                         <Grid item xs={12} sm={6} md={4} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', py: 4 }}>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography gutterBottom variant="h5" component="h3" sx={{ fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* How to Play Section */}
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Typography
            component="h2"
            variant="h3"
            color="text.primary"
            gutterBottom
            sx={{ mb: 4 }}
          >
            How to Play
          </Typography>
          
                     <Grid container spacing={4} justifyContent="center">
             <Grid item xs={12} md={3}>
               <Card sx={{ textAlign: 'center', p: 3 }}>
                 <Typography variant="h4" sx={{ mb: 2 }}>1</Typography>
                 <Typography variant="h6" gutterBottom>Create or Join</Typography>
                 <Typography variant="body2" color="text.secondary">
                   Create a new game room or join an existing one with friends
                 </Typography>
               </Card>
             </Grid>
            <Grid xs={12} md={3}>
              <Card sx={{ textAlign: 'center', p: 3 }}>
                <Typography variant="h4" sx={{ mb: 2 }}>2</Typography>
                <Typography variant="h6" gutterBottom>Get Ready</Typography>
                <Typography variant="body2" color="text.secondary">
                  Set your ready status and wait for the game to start
                </Typography>
              </Card>
            </Grid>
            <Grid xs={12} md={3}>
              <Card sx={{ textAlign: 'center', p: 3 }}>
                <Typography variant="h4" sx={{ mb: 2 }}>3</Typography>
                <Typography variant="h6" gutterBottom>Answer Questions</Typography>
                <Typography variant="body2" color="text.secondary">
                  Answer questions quickly and accurately to earn points
                </Typography>
              </Card>
            </Grid>
            <Grid xs={12} md={3}>
              <Card sx={{ textAlign: 'center', p: 3 }}>
                <Typography variant="h4" sx={{ mb: 2 }}>4</Typography>
                <Typography variant="h6" gutterBottom>Win & Learn</Typography>
                <Typography variant="body2" color="text.secondary">
                  See your ranking and learn from detailed explanations
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* CTA Section */}
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Paper sx={{ p: 6, backgroundColor: 'primary.main', color: 'white' }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              Ready to Start Learning?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Join thousands of players improving their English skills through fun, competitive gameplay.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={handleGetStarted}
              sx={{ 
                px: 6, 
                py: 2, 
                fontSize: '1.2rem',
                backgroundColor: 'white',
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'grey.100',
                }
              }}
            >
              {isAuthenticated ? 'Go to Game Lobby' : 'Start Playing Now'}
            </Button>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
