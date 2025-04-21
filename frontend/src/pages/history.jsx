import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Grid,
  Box,
  Tooltip,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import Navbar from '../Components/Navbar';

export default function History() {
  const { getHistoryOfUser, userData } = useContext(AuthContext);
  const [meetings, setMeetings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userData) {
      navigate('/landing');
      return;
    }

    const fetchHistory = async () => {
      try {
        const history = await getHistoryOfUser();
        setMeetings(history);
      } catch {
        // TODO: Add Snackbar/Error Alert
      }
    };

    fetchHistory();
  }, [userData, navigate]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div>
    <Navbar/>
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)',
        color: '#ffffff',
        p: 4,
      }}
    >
      {/* Header Navigation */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <Tooltip title="Go to Home">
          <IconButton onClick={() => navigate('/home')} sx={{ color: '#fff' }}>
            <HomeIcon fontSize="large" />
          </IconButton>
        </Tooltip>
        <Typography variant="h4" sx={{ ml: 2, fontWeight: 600 }}>
          Meeting History
        </Typography>
      </Box>

      {/* History Grid */}
      <Grid container spacing={3}>
        {meetings.length !== 0 ? (
          meetings.map((e, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Card
                sx={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  boxShadow: '0 8px 32px 0 rgba( 31, 38, 135, 0.37 )',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  p: 2,
                  color: 'white',
                  transition: '0.3s',
                  '&:hover': {
                    transform: 'scale(1.03)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.4)',
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Meeting Code: {e.meetingCode}
                  </Typography>
                  <Typography variant="body1" color="gray">
                    Date: {formatDate(e.date)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Box sx={{ mt: 5, textAlign: 'center', width: '100%' }}>
            <Typography variant="h6" sx={{ color: 'gray' }}>
              No meeting history found.
            </Typography>
          </Box>
        )}
      </Grid>
    </Box>
    </div>
  );
}
