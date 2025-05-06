import React, { useState, useEffect } from "react";
import { Box, Container, Typography, Paper, Button } from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";

const UserQuestion = ({ questions, onClose }) => {
    // State để theo dõi câu hỏi, đáp án, và các thông tin khác
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [results, setResults] = useState(null);
    const [showResults, setShowResults] = useState(false);

    // Lấy thông tin user từ AuthContext
    const { user, isAuthenticated } = useAuth();

    const currentQuestion = questions[currentIndex];

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
    const handleOptionClick = (optionLabel) => {
        setSelectedAnswers((prev) => {
            // Sử dụng currentIndex làm key vì không có id cụ thể
            if (prev[currentIndex] === optionLabel) {
                const updatedAnswers = { ...prev };
                delete updatedAnswers[currentIndex];
                return updatedAnswers;
            }
            return {
                ...prev,
                [currentIndex]: optionLabel,
            };
        });
    };

    // Xử lý gửi bài kiểm tra
    const handleSubmit = () => {
        // Tính điểm dựa trên câu trả lời được chọn và đáp án đúng
        let correctCount = 0;
        questions.forEach((question, index) => {
            if (selectedAnswers[index] === question.correctAnswer) {
                correctCount++;
            }
        });

        const score = Math.round((correctCount / questions.length) * 100);

        setResults({
            totalQuestions: questions.length,
            correctAnswers: correctCount,
            score: score,
        });

        setShowResults(true);
    };

    if (questions.length === 0) {
        return <Typography>Không có câu hỏi nào.</Typography>;
    }

    // Hiển thị kết quả sau khi hoàn thành
    if (showResults) {
        return (
            <Box
                sx={{
                    width: "100%",
                    backgroundColor: "white",
                    borderRadius: 2,
                    p: { xs: 3, sm: 4 },
                    textAlign: "center",
                }}
            >
                <Typography variant="h5" sx={{ mb: 3, color: "#4255ff", fontWeight: "bold" }}>
                    Kết quả bài kiểm tra
                </Typography>
                <Typography variant="h3" sx={{ mb: 2, fontWeight: "bold" }}>
                    {results.score}%
                </Typography>
                <Typography variant="body1" sx={{ mb: 4 }}>
                    Bạn đã trả lời đúng {results.correctAnswers}/{results.totalQuestions} câu hỏi
                </Typography>
                <Button
                    variant="contained"
                    onClick={onClose}
                    sx={{
                        backgroundColor: "#4255ff",
                        color: "white",
                        px: 4,
                        py: 1.5,
                        borderRadius: "30px",
                        textTransform: "none",
                        "&:hover": {
                            backgroundColor: "#3748d9",
                        },
                    }}
                >
                    Đóng
                </Button>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                width: "100%",
                backgroundColor: "white",
                borderRadius: 2,
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
                    Câu hỏi
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        fontSize: { xs: "1rem", sm: "1.25rem" },
                        color: "#666",
                    }}
                >
                    {currentIndex + 1}/{questions.length}
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
                {currentQuestion.question}
            </Typography>

            {/* Các đáp án */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    gap: 2,
                    mb: 4,
                }}
            >
                {currentQuestion.options.map((option) => (
                    <Paper
                        key={option.label}
                        onClick={() => handleOptionClick(option.label)}
                        sx={{
                            p: 3,
                            border: `1px solid ${selectedAnswers[currentIndex] === option.label ? "#4255ff" : "#ddd"
                                }`,
                            backgroundColor:
                                selectedAnswers[currentIndex] === option.label ? "#edefff" : "white",
                            borderRadius: 1,
                            cursor: "pointer",
                            "&:hover": {
                                backgroundColor:
                                    selectedAnswers[currentIndex] === option.label
                                        ? "#edefff"
                                        : "#f5f5f5",
                            },
                        }}
                    >
                        <Typography
                            variant="body1"
                            sx={{
                                fontSize: { xs: "0.9rem", sm: "1rem" },
                                display: "flex",
                                alignItems: "flex-start"
                            }}
                        >
                            <Box
                                component="span"
                                sx={{
                                    mr: 1,
                                    fontWeight: "bold",
                                    minWidth: "20px"
                                }}
                            >
                                {option.label}.
                            </Box>
                            {option.text}
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
                            px: { xs: 2, sm: 3 },
                        }}
                    >
                        Câu trước
                    </Button>
                    {currentIndex < questions.length - 1 ? (
                        <Button
                            variant="outlined"
                            onClick={handleNext}
                            sx={{
                                fontSize: { xs: "0.875rem", sm: "1rem" },
                                px: { xs: 2, sm: 3 },
                            }}
                        >
                            Câu tiếp
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            sx={{
                                backgroundColor: "#4255ff",
                                color: "white",
                                fontSize: { xs: "0.875rem", sm: "1rem" },
                                px: { xs: 3, sm: 4 },
                                py: 1.2,
                                borderRadius: "8px",
                                textTransform: "none",
                                "&:hover": {
                                    backgroundColor: "#3748d9",
                                },
                            }}
                        >
                            Hoàn thành
                        </Button>
                    )}
                </Box>

                {currentIndex < questions.length - 1 && (
                    <Box sx={{ width: "100%", display: "flex", justifyContent: "center", mt: 2 }}>
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
                            Hoàn thành
                        </Button>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default UserQuestion;