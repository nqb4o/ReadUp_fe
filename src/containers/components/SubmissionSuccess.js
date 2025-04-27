import React from 'react';
import {
    Box,
    Container,
    Alert,
    Card,
    CardContent,
    Typography,
    Button,
    LinearProgress,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useNavigate } from 'react-router-dom';
import { path } from '../../utils/constant.js';

const SubmissionSuccess = ({
    quizResult,
    onRetry = () => { },
    onViewReport,
    onGoHome = () => { },
}) => {
    const { correct_answers = 0, total_questions = 20, attempt_id } = quizResult || {};
    const percentage = Math.round((correct_answers / total_questions) * 100);
    const navigate = useNavigate();
    const handleViewReport = onViewReport || (() => {
        if (attempt_id) {
            navigate(`/quiz-attempt/${attempt_id}`);
        }
    });

    return (
        <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
            <Alert
                icon={<CheckCircleOutlineIcon fontSize="inherit" />}
                severity="success"
                sx={{ mb: 4, fontSize: '1.1rem' }}
            >
                Bài làm của bạn đã được nộp thành công!
            </Alert>

            <Card elevation={3}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Kết quả Quiz
                    </Typography>

                    <Box sx={{ my: 2 }}>
                        <Typography variant="subtitle1">
                            Tỉ lệ đúng: <strong>{percentage}%</strong>
                        </Typography>
                        <LinearProgress
                            variant="determinate"
                            value={percentage}
                            sx={{ height: 10, borderRadius: 5, mt: 1 }}
                        />
                    </Box>

                    <Typography variant="body1">
                        Số câu đúng: <strong>{correct_answers}</strong> / 20
                    </Typography>
                </CardContent>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        p: 2,
                        pt: 0,
                    }}
                >
                    <Button variant="outlined" onClick={onRetry}>
                        Làm lại
                    </Button>
                    <Button variant="contained" onClick={handleViewReport}>
                        Xem chi tiết
                    </Button>
                    <Button color="secondary" onClick={onGoHome}>
                        Về trang chủ
                    </Button>
                </Box>
            </Card>
        </Container>
    );
};

export default SubmissionSuccess;
