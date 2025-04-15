import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { useSearchParams } from 'react-router-dom';
import { enterNewPasswordApi } from '../../services/AuthService';
import { useNavigate } from 'react-router-dom'; // Correctly import useNavigate
import { path } from "../../utils/constant.js";

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

const EContainer = styled(Stack)(({ theme }) => ({
    height: 'calc((1 - var(--template-frame-height, 0)) * 90dvh)',
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

function EnterNewPassword() {
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [loading, setLoading] = useState(false); // State để hiển thị loading
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate(); // Directly assign the navigation function

    const validateInputs = (password) => {
        let isValid = true;

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
        const password = data.get('password');
        const token = searchParams.get('token');

        if (!validateInputs(password)) {
            return;
        }
        try {
            setLoading(true); // Hiển thị loading khi bắt đầu gửi request
            setSubmitError(''); // Xóa lỗi cũ nếu có
            setSubmitSuccess(false); // Reset trạng thái thành công

            const response = await enterNewPasswordApi(password, token);
            if (response.status === 200) {
                setSubmitSuccess(true)

                setTimeout(() => {
                    navigate(path.LOGIN);
                }, 3000);
            }
        } catch (error) {
            console.error('Submit failed:', error);
            setSubmitError(
                error.response?.data?.message || 'An error occurred. Please try again later.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <EContainer direction="column" justifyContent="space-between">
            <Card variant="outlined">
                <Typography
                    component="h1"
                    variant="h4"
                    sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
                >
                    Enter your password
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
                    {submitError && <Typography color="error" sx={{ mb: 2 }}>{submitError}</Typography>}
                    {submitSuccess && (
                        <Typography color="success" sx={{ mb: 2 }}>
                            Change password successful! Redirecting...
                        </Typography>
                    )}
                    <Button
                        type="submit"
                        disabled={loading}
                        fullWidth
                        variant="contained"
                        onClick={validateInputs}
                    >
                        {loading ? 'Submitting...' : 'Submit'}
                    </Button>
                </Box>
            </Card>
        </EContainer>
    );
}
export default EnterNewPassword;