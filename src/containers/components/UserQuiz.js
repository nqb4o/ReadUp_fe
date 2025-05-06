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
    Chip,
    Tooltip,
    Fade,
    Zoom
} from "@mui/material";
import {
    ArrowBackIos,
    ArrowForwardIos,
    Check,
    Timer,
    Help,
    CheckCircle,
    RadioButtonUnchecked,
    QuestionAnswer,
    Warning
} from "@mui/icons-material";
import SubmissionSuccess from "./SubmissionSuccess.js";
import { styled } from "@mui/material/styles";

// Styled components for better UI
const QuestionCard = styled(Card)(({ theme }) => ({
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    borderRadius: '12px',
    transition: 'transform 0.3s',
    '&:hover': {
        transform: 'translateY(-5px)'
    }
}));

const AnswerOption = styled(FormControlLabel)(({ theme, isselected }) => ({
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    marginBottom: '12px',
    padding: '10px 15px',
    width: '100%',
    transition: 'all 0.2s ease',
    '&:hover': {
        backgroundColor: '#f5f5f5',
        borderColor: theme.palette.primary.light,
    },
    ...(isselected === 'true' && {
        backgroundColor: theme.palette.primary.light + '30',
        borderColor: theme.palette.primary.main,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
    })
}));

const QuestionButton = styled(Button)(({ theme, answered, current }) => ({
    minWidth: '40px',
    height: '40px',
    borderRadius: '50%',
    padding: 0,
    fontWeight: 'bold',
    transition: 'all 0.2s',
    ...(answered === 'true' && {
        backgroundColor: theme.palette.success.main,
        color: '#fff',
        '&:hover': {
            backgroundColor: theme.palette.success.dark,
        }
    }),
    ...(current === 'true' && {
        transform: 'scale(1.15)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
    })
}));

const NavigationButton = styled(Button)(({ theme }) => ({
    borderRadius: '30px',
    padding: '8px 20px',
    transition: 'all 0.2s',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
    }
}));

const ProgressBarContainer = styled(Box)(({ theme }) => ({
    width: '100%',
    marginRight: theme.spacing(1),
    position: 'relative'
}));

const TimerChip = styled(Chip)(({ theme, timeleft }) => ({
    fontWeight: 'bold',
    transition: 'all 0.3s',
    ...(parseInt(timeleft) < 60 && {
        animation: 'pulse 1s infinite',
        '@keyframes pulse': {
            '0%': { transform: 'scale(1)' },
            '50%': { transform: 'scale(1.05)' },
            '100%': { transform: 'scale(1)' }
        }
    })
}));

const LegendItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1)
}));

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
    const [animateQuestion, setAnimateQuestion] = useState(false);
    const [lowTimeWarning, setLowTimeWarning] = useState(false);

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
                            answered: false,
                            visited: false
                        };
                    });

                    setQuestions(processedQuestions);

                    // Mark first question as visited
                    markQuestionAsVisited(0, processedQuestions);
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

    // Mark question as visited
    const markQuestionAsVisited = (index, questionArray = questions) => {
        const updatedQuestions = [...questionArray];
        if (updatedQuestions[index]) {
            updatedQuestions[index].visited = true;
            setQuestions(updatedQuestions);
        }
    };

    // Timer effect
    useEffect(() => {
        if (loading || quizSubmitted) return;

        const timer = setInterval(() => {
            setTimeLeft(prevTime => {
                // Set low time warning when 2 minutes left
                if (prevTime === 120) {
                    setLowTimeWarning(true);
                    // Hide warning after 5 seconds
                    setTimeout(() => setLowTimeWarning(false), 5000);
                }

                // Set low time warning again at 30 seconds
                if (prevTime === 30) {
                    setLowTimeWarning(true);
                }

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

    // Animation effect when changing questions
    useEffect(() => {
        setAnimateQuestion(true);
        const timer = setTimeout(() => setAnimateQuestion(false), 300);
        return () => clearTimeout(timer);
    }, [currentQuestionIndex]);

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
            const nextIndex = currentQuestionIndex + 1;
            setCurrentQuestionIndex(nextIndex);
            markQuestionAsVisited(nextIndex);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prevIndex => prevIndex - 1);
        }
    };

    const handleJumpToQuestion = (index) => {
        setCurrentQuestionIndex(index);
        markQuestionAsVisited(index);
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

    // Get color for timer based on time left
    const getTimerColor = () => {
        if (timeLeft < 60) return "error";
        if (timeLeft < 180) return "warning";
        return "primary";
    };

    // Get status text for question summary
    const getQuestionStatusText = () => {
        const answered = Object.keys(selectedAnswers).length;
        const unanswered = questions.length - answered;

        if (unanswered === 0) return "Tuyệt vời! Bạn đã trả lời tất cả các câu hỏi.";
        if (unanswered === 1) return "Còn 1 câu hỏi chưa trả lời.";
        return `Còn ${unanswered} câu hỏi chưa trả lời.`;
    };

    if (loading && questions.length === 0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', flexDirection: 'column' }}>
                <CircularProgress size={60} thickness={4} />
                <Typography variant="h6" sx={{ mt: 3 }}>
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
                <Button variant="contained" onClick={() => window.location.reload()} sx={{ mt: 2 }}>
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
                onViewReport={() => navigate(`/quiz-attempt/${quizResult.attempt_id}`)}
                onGoHome={() => navigate("/")}
            />
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    const isCurrentQuestionAnswered = selectedAnswers[currentQuestion?.id] !== undefined;

    return (
        <Box sx={{ maxWidth: "1200px", margin: "0 auto", padding: { xs: 2, md: 3 } }}>
            {/* Header with timer and progress */}
            <Paper
                elevation={3}
                sx={{
                    padding: { xs: 2, md: 3 },
                    mb: 3,
                    borderRadius: '12px',
                    background: 'linear-gradient(to right, #f5f7fa, #e8edf5)'
                }}
            >
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                            <QuestionAnswer sx={{ mr: 1, verticalAlign: 'middle' }} />
                            Bài Quiz 3000 từ thông dụng
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4} sx={{ textAlign: 'center' }}>
                        <Zoom in={lowTimeWarning}>
                            <Box sx={{ position: 'absolute', top: -30, left: '50%', transform: 'translateX(-50%)', zIndex: 5 }}>
                                <Chip
                                    icon={<Warning />}
                                    color="error"
                                    label="Thời gian sắp hết!"
                                    sx={{ fontWeight: 'bold' }}
                                />
                            </Box>
                        </Zoom>
                        <TimerChip
                            icon={<Timer />}
                            label={`Thời gian còn lại: ${formatTime(timeLeft)}`}
                            color={getTimerColor()}
                            timeleft={timeLeft.toString()}
                            variant={timeLeft < 180 ? "filled" : "outlined"}
                            sx={{ px: 2, py: 2.5, fontSize: '1rem' }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4} sx={{ textAlign: { xs: 'center', sm: 'right' } }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleOpenConfirmDialog}
                            disabled={Object.keys(selectedAnswers).length < questions.length}
                            sx={{
                                borderRadius: '30px',
                                py: 1.2,
                                px: 3,
                                fontWeight: 'bold',
                                boxShadow: '0 4px 10px rgba(25, 118, 210, 0.3)'
                            }}
                        >
                            Nộp bài
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" sx={{ mb: 0.5 }}>
                                {getQuestionStatusText()}
                            </Typography>
                            <ProgressBarContainer>
                                <LinearProgress
                                    variant="determinate"
                                    value={calculateProgress()}
                                    sx={{
                                        height: 10,
                                        borderRadius: 5,
                                        backgroundColor: 'rgba(0,0,0,0.05)'
                                    }}
                                />
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-end',
                                    position: 'absolute',
                                    right: 0,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    pr: 1
                                }}>
                                    <Typography variant="body2" color="text.secondary" fontWeight="bold">
                                        {`${Object.keys(selectedAnswers).length}/${questions.length}`}
                                    </Typography>
                                </Box>
                            </ProgressBarContainer>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            {/* Main content - Question and answers */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Fade in={true} timeout={300}>
                        <QuestionCard>
                            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                                        Câu hỏi {currentQuestionIndex + 1} / {questions.length}
                                    </Typography>
                                    <Chip
                                        label={isCurrentQuestionAnswered ? "Đã trả lời" : "Chưa trả lời"}
                                        color={isCurrentQuestionAnswered ? "success" : "default"}
                                        size="small"
                                        icon={isCurrentQuestionAnswered ? <CheckCircle /> : <Help />}
                                    />
                                </Box>

                                <Typography
                                    variant="body1"
                                    sx={{
                                        mb: 3,
                                        p: 2,
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '8px',
                                        borderLeft: '4px solid #3f51b5',
                                        fontWeight: '500'
                                    }}
                                >
                                    {currentQuestion?.question}
                                </Typography>

                                <FormControl component="fieldset" sx={{ width: '100%' }}>
                                    <RadioGroup
                                        value={selectedAnswers[currentQuestion?.id] || ''}
                                        onChange={(e) => handleAnswerSelect(currentQuestion?.id, e.target.value)}
                                    >
                                        {currentQuestion?.answers?.map((answer) => (
                                            <AnswerOption
                                                key={answer.id}
                                                value={answer.id}
                                                control={<Radio color="primary" />}
                                                label={answer.text}
                                                isselected={(selectedAnswers[currentQuestion?.id] === answer.id).toString()}
                                            />
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                            </CardContent>
                        </QuestionCard>
                    </Fade>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                        <NavigationButton
                            variant="outlined"
                            startIcon={<ArrowBackIos />}
                            onClick={handlePreviousQuestion}
                            disabled={currentQuestionIndex === 0}
                        >
                            Câu trước
                        </NavigationButton>
                        <NavigationButton
                            variant="contained"
                            endIcon={<ArrowForwardIos />}
                            onClick={handleNextQuestion}
                            disabled={currentQuestionIndex === questions.length - 1}
                        >
                            Câu sau
                        </NavigationButton>
                    </Box>
                </Grid>

                {/* Question navigation */}
                <Grid item xs={12} md={4}>
                    <Paper
                        elevation={2}
                        sx={{
                            p: 3,
                            borderRadius: '12px',
                            height: '100%'
                        }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                            Danh sách câu hỏi
                        </Typography>
                        <Grid container spacing={1}>
                            {questions.map((question, index) => {
                                const isAnswered = selectedAnswers[question.id] !== undefined;
                                const isCurrent = currentQuestionIndex === index;
                                const isVisited = question.visited;

                                return (
                                    <Grid item key={question.id} xs={3} sm={3} md={4} lg={3}>
                                        <Tooltip
                                            title={
                                                isAnswered ? "Đã trả lời" :
                                                    isVisited ? "Đã xem nhưng chưa trả lời" :
                                                        "Chưa xem"
                                            }
                                            arrow
                                        >
                                            <Box>
                                                <QuestionButton
                                                    variant={isCurrent ? "contained" : isAnswered ? "contained" : "outlined"}
                                                    color={isAnswered ? "success" : isVisited ? "primary" : "inherit"}
                                                    onClick={() => handleJumpToQuestion(index)}
                                                    answered={isAnswered.toString()}
                                                    current={isCurrent.toString()}
                                                >
                                                    {index + 1}
                                                </QuestionButton>
                                            </Box>
                                        </Tooltip>
                                    </Grid>
                                );
                            })}
                        </Grid>
                        <Box sx={{ mt: 4, bgcolor: '#f8f9fa', p: 2, borderRadius: '8px' }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 2 }}>
                                Chú thích:
                            </Typography>
                            <LegendItem>
                                <QuestionButton
                                    variant="contained"
                                    color="success"
                                    size="small"
                                    sx={{ minWidth: '30px', height: '30px', mr: 1.5, cursor: 'default' }}
                                    disabled
                                >
                                    {Object.keys(selectedAnswers).length}
                                </QuestionButton>
                                <Typography variant="body2">Đã trả lời</Typography>
                            </LegendItem>
                            <LegendItem>
                                <QuestionButton
                                    variant="outlined"
                                    color="inherit"
                                    size="small"
                                    sx={{ minWidth: '30px', height: '30px', mr: 1.5, cursor: 'default' }}
                                    disabled
                                >
                                    {questions.length - Object.keys(selectedAnswers).length}
                                </QuestionButton>
                                <Typography variant="body2">Chưa trả lời</Typography>
                            </LegendItem>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* Confirm submission dialog */}
            <Dialog
                open={openConfirmDialog}
                onClose={handleCloseConfirmDialog}
                PaperProps={{
                    sx: { borderRadius: '12px', p: 1 }
                }}
            >
                <DialogTitle sx={{ fontWeight: 'bold' }}>Xác nhận nộp bài</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bạn đã trả lời <strong>{Object.keys(selectedAnswers).length}/{questions.length}</strong> câu hỏi.
                        {Object.keys(selectedAnswers).length < questions.length && (
                            <Box sx={{ mt: 2, color: 'warning.main' }}>
                                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Warning sx={{ mr: 1 }} />
                                    Bạn có chắc chắn muốn nộp bài mà không trả lời hết các câu hỏi?
                                </Typography>
                            </Box>
                        )}

                        {Object.keys(selectedAnswers).length === questions.length && (
                            <Box sx={{ mt: 2, color: 'success.main' }}>
                                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                                    <CheckCircle sx={{ mr: 1 }} />
                                    Bạn đã hoàn thành tất cả các câu hỏi. Sẵn sàng nộp bài!
                                </Typography>
                            </Box>
                        )}
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button
                        onClick={handleCloseConfirmDialog}
                        variant="outlined"
                        sx={{ borderRadius: '20px' }}
                    >
                        Quay lại làm bài
                    </Button>
                    <Button
                        onClick={handleSubmitQuiz}
                        color="primary"
                        variant="contained"
                        sx={{
                            borderRadius: '20px',
                            px: 3
                        }}
                    >
                        Nộp bài
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default UserQuiz;