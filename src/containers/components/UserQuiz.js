import React, { useState, useEffect } from "react";
import {
    getQuizQuestionApi,
    postQuizSubmit
} from "../../services/QuizService.js";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    CircularProgress,
    LinearProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    Paper,
    Chip
} from "@mui/material";
import {
    ArrowBackIos,
    ArrowForwardIos,
    Check,
    Timer
} from "@mui/icons-material";
import SubmissionSuccess from "./SubmissionSuccess.js";

const UserQuiz = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [error, setError] = useState(null);
    const [quizResult, setQuizResult] = useState(null);


    // Fetch quiz questions when component mounts
    useEffect(() => {
        const fetchQuizQuestions = async () => {
            try {
                setLoading(true);
                const response = await getQuizQuestionApi();

                if (response && response.data.questions && Array.isArray(response.data.questions)) {
                    // Process questions to include all answer options in a single array
                    const processedQuestions = response.data.questions.map(question => {
                        // Create an array of all answer options
                        const answerOptions = [
                            { id: "correct", text: question.correct_answer, isCorrect: true },
                            { id: "wrong1", text: question.wrong1, isCorrect: false },
                            { id: "wrong2", text: question.wrong2, isCorrect: false },
                            { id: "wrong3", text: question.wrong3, isCorrect: false }
                        ];

                        // Shuffle the answers
                        const shuffledAnswers = shuffleArray(answerOptions);

                        return {
                            ...question,
                            answers: shuffledAnswers,
                            answered: false
                        };
                    });

                    setQuestions(processedQuestions);
                } else {
                    throw new Error("Invalid response format");
                }
            } catch (error) {
                console.error("Failed to fetch quiz questions:", error);
                setError("Không thể tải câu hỏi quiz. Vui lòng thử lại sau.");
            } finally {
                setLoading(false);
            }
        };

        fetchQuizQuestions();
    }, []);

    // Fisher-Yates shuffle algorithm for randomizing answer options
    const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    // Timer effect
    useEffect(() => {
        if (loading || quizSubmitted) return;

        const timer = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    handleSubmitQuiz();
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [loading, quizSubmitted]);

    const handleAnswerSelect = (questionId, answerId) => {
        // Update selected answers
        setSelectedAnswers(prev => ({
            ...prev,
            [questionId]: answerId
        }));

        // Mark question as answered
        setQuestions(prevQuestions =>
            prevQuestions.map(q =>
                q.id === questionId ? { ...q, answered: true } : q
            )
        );
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prevIndex => prevIndex - 1);
        }
    };

    const handleJumpToQuestion = (index) => {
        setCurrentQuestionIndex(index);
    };

    const handleOpenConfirmDialog = () => {
        setOpenConfirmDialog(true);
    };

    const handleCloseConfirmDialog = () => {
        setOpenConfirmDialog(false);
    };

    const handleSubmitQuiz = async () => {
        try {
            setLoading(true);
            setOpenConfirmDialog(false);

            // Get user_id from session storage
            const userData = JSON.parse(sessionStorage.getItem("user") || "{}");
            const user_id = userData.id;

            if (!user_id) {
                throw new Error("User not found");
            }

            // Format answers according to backend requirements
            const answers = Object.entries(selectedAnswers).map(([questionId, answerId]) => {
                const question = questions.find(q => q.id === parseInt(questionId));
                const selectedAnswer = question.answers.find(a => a.id === answerId);

                return {
                    question_id: parseInt(questionId),
                    selected_answer: selectedAnswer.text
                };
            });

            // Submit quiz with user_id and answers
            const response = await postQuizSubmit({
                user_id: user_id,
                answers: answers
            });

            setQuizSubmitted(true);

            if (response && response.data.attempt) {
                setQuizResult(response.data.attempt);
            }

        } catch (error) {
            console.error("Failed to submit quiz:", error);
            setError("Không thể nộp bài. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    // Format time from seconds to MM:SS
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    // Calculate progress percentage
    const calculateProgress = () => {
        const answeredCount = Object.keys(selectedAnswers).length;
        return (answeredCount / questions.length) * 100;
    };

    if (loading && questions.length === 0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ ml: 2 }}>
                    Đang tải câu hỏi...
                </Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', flexDirection: 'column' }}>
                <Typography variant="h6" color="error" gutterBottom>
                    {error}
                </Typography>
                <Button variant="contained" onClick={() => window.location.reload()}>
                    Thử lại
                </Button>
            </Box>
        );
    }

    if (quizSubmitted) {
        return (
            <SubmissionSuccess
                quizResult={quizResult}
                onRetry={() => window.location.reload()}
                // onViewReport={() => navigate("/quiz-report")}
                onGoHome={() => navigate("/")}
            />
        );
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <Box sx={{ maxWidth: "1200px", margin: "0 auto", padding: 3 }}>
            {/* Header with timer and progress */}
            <Paper sx={{ padding: 2, mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={4}>
                        <Typography variant="h5">Quiz</Typography>
                    </Grid>
                    <Grid item xs={4} sx={{ textAlign: 'center' }}>
                        <Chip
                            icon={<Timer />}
                            label={`Thời gian còn lại: ${formatTime(timeLeft)}`}
                            color={timeLeft < 60 ? "error" : "primary"}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={4} sx={{ textAlign: 'right' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleOpenConfirmDialog}
                            disabled={Object.keys(selectedAnswers).length === 0}
                        >
                            Nộp bài
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ width: '100%', mr: 1 }}>
                                <LinearProgress variant="determinate" value={calculateProgress()} />
                            </Box>
                            <Box sx={{ minWidth: 35 }}>
                                <Typography variant="body2" color="text.secondary">
                                    {`${Object.keys(selectedAnswers).length}/${questions.length}`}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            {/* Main content - Question and answers */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Câu hỏi {currentQuestionIndex + 1} / {questions.length}
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 3 }}>
                                {currentQuestion?.question}
                            </Typography>

                            <FormControl component="fieldset" sx={{ width: '100%' }}>
                                <RadioGroup
                                    value={selectedAnswers[currentQuestion?.id] || ''}
                                    onChange={(e) => handleAnswerSelect(currentQuestion?.id, e.target.value)}
                                >
                                    {currentQuestion?.answers?.map((answer) => (
                                        <FormControlLabel
                                            key={answer.id}
                                            value={answer.id}
                                            control={<Radio />}
                                            label={answer.text}
                                            sx={{
                                                border: '1px solid #e0e0e0',
                                                borderRadius: 1,
                                                mb: 1,
                                                padding: 1,
                                                width: '100%',
                                                '&:hover': {
                                                    backgroundColor: '#f5f5f5'
                                                }
                                            }}
                                        />
                                    ))}
                                </RadioGroup>
                            </FormControl>
                        </CardContent>
                    </Card>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Button
                            startIcon={<ArrowBackIos />}
                            onClick={handlePreviousQuestion}
                            disabled={currentQuestionIndex === 0}
                        >
                            Câu trước
                        </Button>
                        <Button
                            endIcon={<ArrowForwardIos />}
                            onClick={handleNextQuestion}
                            disabled={currentQuestionIndex === questions.length - 1}
                        >
                            Câu sau
                        </Button>
                    </Box>
                </Grid>

                {/* Question navigation */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Danh sách câu hỏi
                        </Typography>
                        <Grid container spacing={1}>
                            {questions.map((question, index) => (
                                <Grid item key={question.id} xs={2} sm={2} md={3}>
                                    <Button
                                        variant={currentQuestionIndex === index ? "contained" : "outlined"}
                                        color={selectedAnswers[question.id] ? "success" : "primary"}
                                        onClick={() => handleJumpToQuestion(index)}
                                        sx={{ minWidth: '40px', height: '40px', p: 0 }}
                                    >
                                        {index + 1}
                                    </Button>
                                </Grid>
                            ))}
                        </Grid>
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="body2" gutterBottom>
                                Chú thích:
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Button variant="contained" color="success" size="small" sx={{ minWidth: '30px', height: '30px', mr: 1, p: 0 }}>
                                    1
                                </Button>
                                <Typography variant="body2">Đã trả lời</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Button variant="outlined" color="primary" size="small" sx={{ minWidth: '30px', height: '30px', mr: 1, p: 0 }}>
                                    1
                                </Button>
                                <Typography variant="body2">Chưa trả lời</Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* Confirm submission dialog */}
            <Dialog
                open={openConfirmDialog}
                onClose={handleCloseConfirmDialog}
            >
                <DialogTitle>Xác nhận nộp bài</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bạn đã trả lời {Object.keys(selectedAnswers).length}/{questions.length} câu hỏi.
                        {Object.keys(selectedAnswers).length < questions.length && (
                            <span> Bạn có chắc chắn muốn nộp bài mà không trả lời hết các câu hỏi?</span>
                        )}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmDialog}>Quay lại làm bài</Button>
                    <Button onClick={handleSubmitQuiz} color="primary" variant="contained">
                        Nộp bài
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default UserQuiz;