import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import ForgotPassword from './ForgotPasswordModal';
import { GoogleIcon } from './GoogleIcon.js';
import AppTheme from '../shared-theme/AppTheme';
import ColorModeSelect from '../shared-theme/ColorModeSelect';
import { handleLoginApi, googleAuth, getGoogleDataApi } from '../../services/AuthService';
import { useNavigate } from 'react-router-dom';
import { path } from "../../utils/constant.js";
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../contexts/AuthContext';

const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    [theme.breakpoints.up('sm')]: {
        maxWidth: '450px',
    },
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    ...theme.applyStyles('dark', {
        boxShadow:
            'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
}));

const LoginContainer = styled(Stack)(({ theme }) => ({
    height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
    minHeight: '100%',
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(4),
    },
    '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        zIndex: -1,
        inset: 0,
        backgroundImage:
            'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
        backgroundRepeat: 'no-repeat',
        ...theme.applyStyles('dark', {
            backgroundImage:
                'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
        }),
    },
}));

export default function Login(props) {
    const { login } = useAuth();
    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [loginSuccess, setLoginSuccess] = useState(false);
    const navigate = useNavigate();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const validateInputs = (email, password) => {
        let isValid = true;

        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setEmailError(true);
            setEmailErrorMessage('Please enter a valid email address.');
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }

        if (!password || password.length < 6) {
            setPasswordError(true);
            setPasswordErrorMessage('Password must be at least 6 characters long.');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        return isValid;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email = data.get('email');
        const password = data.get('password');

        if (!validateInputs(email, password)) {
            return;
        }

        try {
            setLoading(true);
            setLoginError('');
            setEmailErrorMessage('');
            setPasswordErrorMessage('');
            setLoginSuccess(false);

            const response = await handleLoginApi(email, password);

            if (response.status === 200) {
                const role = await login(response.data.token); // Lấy vai trò từ hàm login
                setLoginSuccess(true);
                setTimeout(() => {
                    // Chuyển hướng dựa trên vai trò
                    if (role === 'admin') {
                        navigate(path.ADMIN);
                    } else {
                        navigate(path.HOME);
                    }
                }, 1500);
            }
        } catch (error) {
            console.error('Login failed:', error);
            setLoginError(
                error.response?.data?.message || 'An error occurred. Please try again later.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setLoading(true);
            setLoginError('');
            setEmailErrorMessage('');
            setPasswordErrorMessage('');
            setLoginSuccess(false);

            try {
                const getGoogleData = await getGoogleDataApi(tokenResponse.access_token);

                if (getGoogleData.status === 200) {
                    const response = await googleAuth(
                        getGoogleData.data.email,
                        getGoogleData.data.name,
                        getGoogleData.data.sub
                    );

                    const role = await login(response.data.accessToken); // Lấy vai trò từ hàm login
                    setLoginSuccess(true);

                    setTimeout(() => {
                        // Chuyển hướng dựa trên vai trò
                        if (role === 'admin') {
                            navigate(path.ADMIN);
                        } else {
                            navigate(path.HOME);
                        }
                    }, 1500);
                } else {
                    throw new Error('Unexpected response from server.');
                }
            } catch (error) {
                console.error('Login failed:', error);
                setLoginError(
                    error.response?.data?.message || 'An error occurred. Please try again later.'
                );
            } finally {
                setLoading(false);
            }
        },
        onError: () => {
            setLoginError("Google login was unsuccessful. Please try again.");
        },
    });

    return (
        <AppTheme {...props}>
            <CssBaseline enableColorScheme />
            <LoginContainer direction="column" justifyContent="space-between">
                <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
                <Card variant="outlined">
                    <Typography
                        component="h1"
                        variant="h4"
                        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
                    >
                        Login
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            gap: 2,
                        }}
                    >
                        <FormControl>
                            <FormLabel htmlFor="email">Email</FormLabel>
                            <TextField
                                error={emailError}
                                helperText={emailErrorMessage}
                                id="email"
                                type="email"
                                name="email"
                                placeholder="your@email.com"
                                autoComplete="email"
                                autoFocus
                                required
                                fullWidth
                                variant="outlined"
                                color={emailError ? 'error' : 'primary'}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="password">Password</FormLabel>
                            <TextField
                                error={passwordError}
                                helperText={passwordErrorMessage}
                                name="password"
                                placeholder="••••••"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                autoFocus
                                required
                                fullWidth
                                variant="outlined"
                                color={passwordError ? 'error' : 'primary'}
                            />
                        </FormControl>
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Remember me"
                        />
                        <ForgotPassword open={open} handleClose={handleClose} />
                        {loginError && <Typography color="error" sx={{ mb: 2 }}>{loginError}</Typography>}
                        {loginSuccess && (
                            <Typography color="success.main" sx={{ mb: 2 }}>
                                Login successful! Redirecting...
                            </Typography>
                        )}
                        <Button
                            type="submit"
                            disabled={loading}
                            fullWidth
                            variant="contained"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>
                        <Link
                            component="button"
                            type="button"
                            onClick={handleClickOpen}
                            variant="body2"
                            sx={{ alignSelf: 'center' }}
                        >
                            Forgot your password?
                        </Link>
                    </Box>
                    <Divider>or</Divider>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={handleGoogleLogin}
                            startIcon={<GoogleIcon />}
                        >
                            Login with Google
                        </Button>
                        <Typography sx={{ textAlign: 'center' }}>
                            Don't have an account?{' '}
                            <Link
                                href="/register"
                                variant="body2"
                                sx={{ alignSelf: 'center' }}
                            >
                                Register
                            </Link>
                        </Typography>
                    </Box>
                </Card>
            </LoginContainer>
        </AppTheme>
    );
}