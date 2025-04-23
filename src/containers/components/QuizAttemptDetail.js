import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    Paper,
    CircularProgress,
    Button,
    List,
    ListItem,
    ListItemText,
    Chip,
    Container,
    Card,
    CardContent,
    Grid,
    Divider,
    Avatar,
    Stack,
    Tooltip,
    Alert,
    LinearProgress
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { getAttemptDetail } from "../../services/QuizService";

const QuizAttemptDetail = () => {
    const { attempt_id } = useParams();
    const navigate = useNavigate();
    const [attempt, setAttempt] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAttemptDetail = async () => {
            setLoading(true);
            try {
                const response = await getAttemptDetail(attempt_id);
                setAttempt(response.data.attempt);
                setQuestions(response.data.questions);
            } catch (err) {
                setError("Không thể tải chi tiết bài quiz.");
            } finally {
                setLoading(false);
            }
        };
        fetchAttemptDetail();
    }, [attempt_id]);

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ mt: 8, textAlign: "center" }}>
                <Card elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                    <CircularProgress color="primary" />
                    <Typography sx={{ mt: 2 }}>Đang tải kết quả bài quiz...</Typography>
                </Card>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md" sx={{ mt: 8 }}>
                <Card elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Button
                            variant="contained"
                            startIcon={<ArrowBackIcon />}
                            onClick={() => navigate(-1)}
                        >
                            Quay lại
                        </Button>
                    </Box>
                </Card>
            </Container>
        );
    }

    // Calculate score percentage
    const scorePercentage = attempt
        ? (attempt.correct_answers / attempt.total_questions) * 100
        : 0;

    // Get proper color based on score
    const getScoreColor = (percentage) => {
        if (percentage >= 80) return "success";
        if (percentage >= 60) return "primary";
        if (percentage >= 40) return "warning";
        return "error";
    };

    // Format date to be more readable
    const formatDate = (dateString) => {
        const options = {
            day: "numeric",
            month: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        };
        return new Date(dateString).toLocaleDateString("vi-VN", options);
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Paper
                elevation={3}
                sx={{
                    borderRadius: 2,
                    overflow: "hidden",
                    mb: 4
                }}
            >
                {/* Score progress bar */}
                <LinearProgress
                    variant="determinate"
                    value={scorePercentage}
                    color={getScoreColor(scorePercentage)}
                    sx={{ height: 8 }}
                />

                <Box sx={{ p: { xs: 2, sm: 4 }, pt: 3 }}>
                    {/* Header */}
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        alignItems={{ xs: "center", sm: "flex-start" }}
                        spacing={2}
                        sx={{ mb: 3 }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <EmojiEventsIcon
                                color={getScoreColor(scorePercentage)}
                                sx={{ fontSize: 40, mr: 2 }}
                            />
                            <Typography variant="h4" fontWeight="bold">
                                Kết quả bài Quiz
                            </Typography>
                        </Box>

                        <Button
                            variant="outlined"
                            startIcon={<ArrowBackIcon />}
                            onClick={() => navigate(-1)}
                            sx={{ alignSelf: { xs: "center", sm: "flex-start" } }}
                        >
                            Quay lại
                        </Button>
                    </Stack>

                    {/* Score summary */}
                    <Card
                        sx={{
                            mb: 4,
                            backgroundColor: (theme) =>
                                `${theme.palette[getScoreColor(scorePercentage)].light}20`,
                            borderLeft: (theme) =>
                                `6px solid ${theme.palette[getScoreColor(scorePercentage)].main}`
                        }}
                    >
                        <CardContent>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ textAlign: "center" }}>
                                        <Typography variant="h6" color="text.secondary" gutterBottom>
                                            Số câu đúng
                                        </Typography>
                                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <Avatar
                                                sx={{
                                                    width: 60,
                                                    height: 60,
                                                    bgcolor: (theme) => theme.palette[getScoreColor(scorePercentage)].main,
                                                    fontSize: 24,
                                                    fontWeight: "bold"
                                                }}
                                            >
                                                {attempt?.correct_answers}
                                            </Avatar>
                                            <Typography variant="h4" sx={{ mx: 1 }}>/</Typography>
                                            <Typography variant="h4">
                                                {attempt?.total_questions}
                                            </Typography>
                                        </Box>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                mt: 1,
                                                color: (theme) => theme.palette[getScoreColor(scorePercentage)].main,
                                                fontWeight: "bold"
                                            }}
                                        >
                                            {scorePercentage.toFixed(0)}% đúng
                                        </Typography>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Stack spacing={2}>
                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                            <AccessTimeIcon color="action" sx={{ mr: 1 }} />
                                            <Typography variant="body2" color="text.secondary">
                                                Bắt đầu:
                                            </Typography>
                                            <Typography variant="body1" sx={{ ml: 1, fontWeight: "medium" }}>
                                                {formatDate(attempt?.started_at)}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                            <AccessTimeIcon color="action" sx={{ mr: 1 }} />
                                            <Typography variant="body2" color="text.secondary">
                                                Kết thúc:
                                            </Typography>
                                            <Typography variant="body1" sx={{ ml: 1, fontWeight: "medium" }}>
                                                {formatDate(attempt?.ended_at)}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* Questions detail */}
                    <Typography
                        variant="h5"
                        sx={{
                            mb: 2,
                            pb: 1,
                            display: "flex",
                            alignItems: "center",
                            borderBottom: "1px solid",
                            borderColor: "divider"
                        }}
                    >
                        <AssignmentTurnedInIcon sx={{ mr: 1 }} />
                        Chi tiết câu trả lời
                    </Typography>

                    <List>
                        {questions.map((q, idx) => (
                            <Card
                                key={q.question_id}
                                sx={{
                                    mb: 3,
                                    borderLeft: "4px solid",
                                    borderColor: q.is_correct ? "success.main" : "error.main",
                                }}
                                elevation={2}
                            >
                                <CardContent>
                                    <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                                        <Avatar
                                            sx={{
                                                bgcolor: q.is_correct ? "success.main" : "error.main",
                                                color: "white",
                                                width: 32,
                                                height: 32,
                                                fontSize: 14,
                                                mr: 2
                                            }}
                                        >
                                            {idx + 1}
                                        </Avatar>
                                        <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                                            {q.question}
                                        </Typography>
                                    </Box>

                                    <Divider sx={{ my: 2, borderStyle: "dashed" }} />

                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="body2" color="text.secondary">
                                                Đáp án của bạn:
                                            </Typography>
                                            <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                                                {q.is_correct ? (
                                                    <Tooltip title="Chính xác">
                                                        <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                                                    </Tooltip>
                                                ) : (
                                                    <Tooltip title="Chưa chính xác">
                                                        <CancelIcon color="error" sx={{ mr: 1 }} />
                                                    </Tooltip>
                                                )}
                                                <Typography
                                                    variant="body1"
                                                    sx={{
                                                        fontWeight: "medium",
                                                        color: q.is_correct ? "success.dark" : "error.dark"
                                                    }}
                                                >
                                                    {q.selected_answer}
                                                </Typography>
                                            </Box>
                                        </Grid>

                                        {!q.is_correct && (
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Đáp án đúng:
                                                </Typography>
                                                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                                                    <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                                                    <Typography
                                                        variant="body1"
                                                        sx={{ fontWeight: "medium", color: "success.dark" }}
                                                    >
                                                        {q.correct_answer}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        )}
                                    </Grid>
                                </CardContent>
                            </Card>
                        ))}
                    </List>
                </Box>
            </Paper>

            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Button
                    variant="contained"
                    startIcon={<ArrowBackIcon />}
                    size="large"
                    onClick={() => navigate(-1)}
                    sx={{ px: 4 }}
                >
                    Quay lại
                </Button>
            </Box>
        </Container>
    );
};

export default QuizAttemptDetail;