import * as React from 'react';
import {
    Avatar, Button, CssBaseline, TextField, Paper,
    Box, Grid, Typography, Snackbar, createTheme,
    ThemeProvider
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { AuthContext } from '../contexts/AuthContext';
import Navbar from '../Components/Navbar';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: "#121212",
            paper: "#1e1e1e"
        },
        primary: {
            main: '#90caf9'
        },
        secondary: {
            main: '#f48fb1'
        }
    },
    typography: {
        fontFamily: 'Inter, Roboto, sans-serif',
    },
});

export default function Authentication() {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [name, setName] = React.useState('');
    const [error, setError] = React.useState('');
    const [message, setMessage] = React.useState('');
    const [formState, setFormState] = React.useState(0);
    const [open, setOpen] = React.useState(false);

    const { handleRegister, handleLogin } = React.useContext(AuthContext);

    const handleAuth = async () => {
        try {
            if (formState === 0) {
                let result = await handleLogin(username, password);
                console.log(result);
            } else {
                let result = await handleRegister(name, username, password);
                console.log(result);
                setUsername('');
                setPassword('');
                setName('');
                setMessage(result);
                setError('');
                setOpen(true);
                setFormState(0);
            }
        } catch (err) {
            const message = err?.response?.data?.message || "An error occurred.";
            setError(message);
        }
    };

    return (
        <div>
        <Navbar/>
        <ThemeProvider theme={darkTheme}>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid
                    item
                    xs={12}
                    component={Paper}
                    elevation={6}
                    square
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundImage: `url('https://cdn.pixabay.com/photo/2023/01/20/10/16/abstract-7731331_1280.png')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        padding: 4,
                        color: 'white',
                    }}
                >
                    <Box
                        sx={{
                            width: '100%',
                            maxWidth: 420,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            backdropFilter: 'blur(15px)',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            borderRadius: 6,
                            padding: 5,
                            boxShadow: '0 0 20px rgba(0,0,0,0.6)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            color: 'white',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
                            {formState === 0 ? "Sign In" : "Sign Up"}
                        </Typography>

                        <Box component="form" noValidate sx={{ width: '100%' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
                                <Button
                                    variant={formState === 0 ? "contained" : "outlined"}
                                    onClick={() => setFormState(0)}
                                    sx={{
                                        width: '50%',
                                        color: formState === 0 ? 'white' : 'primary.main',
                                        borderColor: 'primary.main',
                                        '&:hover': {
                                            backgroundColor: 'primary.dark',
                                            borderColor: 'primary.light',
                                        }
                                    }}
                                >
                                    Sign In
                                </Button>
                                <Button
                                    variant={formState === 1 ? "contained" : "outlined"}
                                    onClick={() => setFormState(1)}
                                    sx={{
                                        width: '50%',
                                        color: formState === 1 ? 'white' : 'secondary.main',
                                        borderColor: 'secondary.main',
                                        '&:hover': {
                                            backgroundColor: 'secondary.dark',
                                            borderColor: 'secondary.light',
                                        }
                                    }}
                                >
                                    Sign Up
                                </Button>
                            </Box>

                            {formState === 1 && (
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Full Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    InputLabelProps={{ style: { color: 'white' } }}
                                    InputProps={{ style: { color: 'white' } }}
                                />
                            )}

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                InputLabelProps={{ style: { color: 'white' } }}
                                InputProps={{ style: { color: 'white' } }}
                                autoFocus={formState === 0}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                InputLabelProps={{ style: { color: 'white' } }}
                                InputProps={{ style: { color: 'white' } }}
                            />

                            {error && (
                                <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                                    {error}
                                </Typography>
                            )}

                            <Button
                                type="button"
                                fullWidth
                                variant="contained"
                                color="primary"
                                sx={{
                                    mt: 3,
                                    mb: 2,
                                    fontWeight: 'bold',
                                    fontSize: '1rem',
                                    borderRadius: 3,
                                }}
                                onClick={handleAuth}
                            >
                                {formState === 0 ? "Login" : "Register"}
                            </Button>
                        </Box>
                    </Box>
                </Grid>

                <Snackbar
                    open={open}
                    autoHideDuration={4000}
                    onClose={() => setOpen(false)}
                    message={message}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                />
            </Grid>
        </ThemeProvider>
        </div>
    );
}
