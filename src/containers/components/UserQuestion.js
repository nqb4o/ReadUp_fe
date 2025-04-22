import React, { useState, useEffect } from "react";
import { Box, Container, Typography, Paper, Button } from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import { getQuizQuestionApi, postQuizSubmit } from "../../services/QuizService"; // Import postQuizSubmit

const UserQuestion = () => {
    // State để theo dõi câu hỏi, đáp án, và các thông tin khác
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [shuffledOptions, setShuffledOptions] = useState([]);

    // Lấy thông tin user từ AuthContext
    const { user, isAuthenticated } = useAuth();

    const currentQuestion = questions[currentIndex];

    // Hàm để xáo trộn đáp án
    const shuffleOptions = (question) => {
        const options = [
            question.correct_meaning,
            question.wrong1,
            question.wrong2,
            question.wrong3,
        ];
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }
        return options;
    };

    // Lấy câu hỏi từ API khi component mount
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await getQuizQuestionApi();
                const data = response.data; // Dữ liệu trả về từ API nằm trong response.data
                setQuestions(data);
                const shuffled = data.map((question) => shuffleOptions(question));
                setShuffledOptions(shuffled);
            } catch (error) {
                console.error("Error fetching questions:", error);
            }
        };
        fetchQuestions();
    }, []);

    // Xử lý chuyển câu hỏi
    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    // Xử lý chọn/bỏ chọn đáp án
    const handleOptionClick = (option) => {
        setSelectedAnswers((prev) => {
            if (prev[currentQuestion.id] === option) {
                const updatedAnswers = { ...prev };
                delete updatedAnswers[currentQuestion.id];
                return updatedAnswers;
            }
            return {
                ...prev,
                [currentQuestion.id]: option,
            };
        });
    };

    // Xử lý gửi bài kiểm tra
    const handleSubmit = async () => {
        // Kiểm tra xem user đã đăng nhập chưa
        if (!isAuthenticated || !user) {
            alert("Vui lòng đăng nhập để gửi bài kiểm tra.");
            return;
        }

        // Lấy userId từ user
        const userId = user.id; // Điều chỉnh nếu trường userId có tên khác (ví dụ: user.userId)

        // Chuyển đổi selectedAnswers thành định dạng API yêu cầu
        const answers = Object.entries(selectedAnswers).map(
            ([questionId, answer]) => ({
                question_id: questionId,
                selected_answer: answer,
            })
        );

        // Tạo payload cho API
        const payload = {
            user_id: userId,
            answers,
        };

        try {
            const response = await postQuizSubmit(payload);
            if (response) {
                alert("Bài kiểm tra đã được gửi thành công!");
            }
        } catch (error) {
            console.error("Error submitting quiz:", error);
            alert("Có lỗi xảy ra khi gửi bài kiểm tra.");
        }
    };

    if (questions.length === 0 || shuffledOptions.length === 0) {
        return <Typography>Loading...</Typography>;
    }

    const options = shuffledOptions[currentIndex];

    return (
        <Container
            maxWidth="md"
            sx={{
                py: { xs: 3, sm: 4, md: 5 },
                backgroundColor: "#f5faff",
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    maxWidth: 700,
                    backgroundColor: "white",
                    borderRadius: 2,
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                    p: { xs: 3, sm: 4 },
                }}
            >
                {/* Tiêu đề và số thứ tự */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 3,
                    }}
                >
                    <Typography
                        variant="h5"
                        sx={{
                            fontSize: { xs: "1.25rem", sm: "1.5rem" },
                            fontWeight: "bold",
                            color: "#333",
                        }}
                    >
                        Thuật ngữ
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            fontSize: { xs: "1rem", sm: "1.25rem" },
                            color: "#666",
                        }}
                    >
                        {currentIndex + 1}/{currentQuestion.total}
                    </Typography>
                </Box>

                {/* Nội dung câu hỏi */}
                <Typography
                    variant="h6"
                    sx={{
                        fontSize: { xs: "1rem", sm: "1.25rem" },
                        color: "#333",
                        mb: 4,
                        lineHeight: 1.5,
                    }}
                >
                    Nghĩa của "{currentQuestion.word}" là:
                </Typography>

                {/* 4 đáp án trắc nghiệm */}
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                        gap: 2,
                        mb: 4,
                    }}
                >
                    {options.map((option, index) => (
                        <Paper
                            key={index}
                            onClick={() => handleOptionClick(option)}
                            sx={{
                                p: 3,
                                border: `1px solid ${selectedAnswers[currentQuestion.id] === option
                                    ? "#4255ff"
                                    : "#ddd"
                                    }`,
                                backgroundColor:
                                    selectedAnswers[currentQuestion.id] === option
                                        ? "#edefff"
                                        : "white",
                                borderRadius: 1,
                                textAlign: "center",
                                cursor: "pointer",
                                "&:hover": {
                                    backgroundColor:
                                        selectedAnswers[currentQuestion.id] === option
                                            ? "#edefff"
                                            : "#f5f5f5",
                                },
                            }}
                        >
                            <Typography
                                variant="body1"
                                sx={{ fontSize: { xs: "1rem", sm: "1.125rem" } }}
                            >
                                {option}
                            </Typography>
                        </Paper>
                    ))}
                </Box>

                {/* Nút điều hướng và nút gửi bài kiểm tra */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 2,
                        mb: 2,
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%",
                        }}
                    >
                        <Button
                            variant="outlined"
                            onClick={handlePrevious}
                            disabled={currentIndex === 0}
                            sx={{
                                fontSize: { xs: "0.875rem", sm: "1rem" },
                                px: { xs: 3, sm: 4 },
                            }}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={handleNext}
                            disabled={currentIndex === questions.length - 1}
                            sx={{
                                fontSize: { xs: "0.875rem", sm: "1rem" },
                                px: { xs: 3, sm: 4 },
                            }}
                        >
                            Next
                        </Button>
                    </Box>

                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        sx={{
                            backgroundColor: "#4255ff",
                            color: "white",
                            fontSize: { xs: "0.875rem", sm: "1rem" },
                            px: { xs: 4, sm: 6 },
                            py: 1.5,
                            borderRadius: "30px",
                            textTransform: "none",
                            "&:hover": {
                                backgroundColor: "#3748d9",
                            },
                        }}
                    >
                        Gửi bài kiểm tra
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default UserQuestion;