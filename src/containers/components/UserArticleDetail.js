import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Container,
    CardMedia,
    CircularProgress,
    Chip,
    Paper,
    Fade,
    Tooltip
} from "@mui/material";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import SchoolIcon from "@mui/icons-material/School";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ShareIcon from "@mui/icons-material/Share";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ChatIcon from "@mui/icons-material/Chat";
import { getArticleByIdApi } from "../../services/ArticleService";
import ArticleSummary from "./ArticleSummary";
import axios from "axios";
import TranslationPopper from './TranslationPopper';
import ChatBox from "./ChatBox";
import UserQuestion from "./UserQuestion";

const UserArticleDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState("");
    const [chatbotReady, setChatbotReady] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [loadingQuestions, setLoadingQuestions] = useState(false);
    const [showQuiz, setShowQuiz] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);

    // Step 1: Initialize chatbot with article content
    const initializeChatbotWithArticle = async (title, content) => {
        try {
            await axios.post("http://localhost:5000/api/chatbot/initialize-with-article", {
                articleTitle: title,
                articleContent: content,
            });
            setChatbotReady(true);
        } catch (error) {
            console.error("Error initializing chatbot:", error);
            setChatbotReady(false);
        }
    };

    // Step 2: Generate summary when chatbot is ready
    const generateSummary = async () => {
        try {
            const response = await axios.post("http://localhost:5000/api/chatbot/query", {
                question: "Summary this article in 100 words?",
            });
            setSummary(response.data.answer);
        } catch (error) {
            console.error("Error generating summary:", error);
            setSummary("Unable to generate summary.");
        }
    };

    // Step 3: Generate questions when chatbot is ready
    const generateQuestions = async () => {
        setLoadingQuestions(true);
        try {
            const response = await axios.post("http://localhost:5000/api/chatbot/query", {
                question: `Based on this article, create 3 multiple choice questions, each with 4 answers so that the correct answer is always A. The structure of your answer is "Question 1: ... A. ... B. ... C. ... D. .... Note: Only give the questions and answers, do not provide any explanations or additional text."`,
            });
            const parsedQuestions = parseQuestions(response.data.answer);
            setQuestions(parsedQuestions);
        } catch (error) {
            console.error("Error generating questions:", error);
            setQuestions([]);
        } finally {
            setLoadingQuestions(false);
        }
    };

    const parseQuestions = (text) => {
        const questions = [];

        // Find all question blocks using "Question" keyword followed by number
        const questionRegex = /Question\s*(\d+)\s*:\s*(.*?)(?=Question\s*\d+|$)/gs;
        const questionMatches = [...text.matchAll(questionRegex)];

        questionMatches.forEach((qMatch) => {
            try {
                const questionNumber = qMatch[1];
                const fullText = qMatch[2].trim();

                // Split by options (A., B., C., D.)
                const parts = fullText.split(/([A-D]\.)/);

                if (parts.length < 3) return; // Need at least question text and one option

                // The first part is the question text
                const questionText = parts[0].trim();

                const options = [];
                for (let i = 1; i < parts.length; i += 2) {
                    if (i + 1 < parts.length) {
                        const label = parts[i].charAt(0); // Get A, B, C, or D
                        const optionText = parts[i + 1].trim();
                        options.push({
                            label: label,
                            text: optionText
                        });
                    }
                }

                if (options.length < 2) return; // Need at least 2 options

                // For now, assume the first option is correct (since the sample doesn't include answers)
                // This should be replaced with actual answer detection logic if available
                const correctAnswer = "A";

                questions.push({
                    question: questionText,
                    options: options,
                    correctAnswer: correctAnswer
                });
            } catch (error) {
                console.error(`Error parsing question ${qMatch[1]}:`, error);
            }
        });

        return questions;
    };

    // Fetch article and initialize chatbot
    useEffect(() => {
        const fetchArticle = async () => {
            try {
                setLoading(true);
                const response = await getArticleByIdApi(id);
                setArticle(response.data);

                // Initialize chatbot with article details
                await initializeChatbotWithArticle(response.data.title, response.data.content);
            } catch (error) {
                console.error("Error fetching article:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [id]);

    // Generate summary and questions when chatbot is ready
    useEffect(() => {
        if (chatbotReady && article) {
            const generateData = async () => {
                await generateSummary();
                await generateQuestions();
            };

            generateData();
        }
    }, [chatbotReady, article]);

    const handleShowQuiz = () => {
        if (questions.length > 0) {
            setShowQuiz(true);
        }
    };

    const toggleBookmark = () => {
        setBookmarked(!bookmarked);
        // Add API call to save bookmark status if needed
    };

    const toggleChat = () => {
        setShowChat(!showChat);
    };

    if (loading) {
        return (
            <Container
                maxWidth="lg"
                sx={{
                    py: 8,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '70vh'
                }}
            >
                <Box sx={{ textAlign: 'center' }}>
                    <CircularProgress size={60} thickness={4} sx={{ color: '#6366f1' }} />
                    <Typography variant="h6" sx={{ mt: 2, color: '#64748b', fontWeight: 500 }}>
                        Đang tải bài viết...
                    </Typography>
                </Box>
            </Container>
        );
    }

    if (!article) {
        return (
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        borderRadius: 3,
                        textAlign: "center",
                        backgroundColor: "#f8fafc",
                        border: "1px dashed #cbd5e1"
                    }}
                >
                    <Typography variant="h5" color="text.secondary" gutterBottom>
                        Không tìm thấy bài viết
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => navigate("/")}
                        sx={{
                            mt: 2,
                            backgroundColor: "#6366f1",
                            "&:hover": { backgroundColor: "#4f46e5" }
                        }}
                    >
                        Quay lại trang chủ
                    </Button>
                </Paper>
            </Container>
        );
    }

    // Extract estimated reading time (mock data)
    const readingTime = Math.max(5, Math.ceil(article.content.length / 1000));

    const ActionButton = ({ icon, label, onClick, disabled = false, color = "#333" }) => (
        <Button
            variant="text"
            startIcon={icon}
            onClick={onClick}
            disabled={disabled}
            sx={{
                backgroundColor: "#ffffff",
                color: color,
                textTransform: "none",
                fontWeight: 500,
                padding: { xs: "8px 14px", sm: "10px 18px" },
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                transition: "all 0.25s ease",
                position: "relative",
                "&:hover": {
                    backgroundColor: "#f8fafc",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    transform: "translateY(-2px)",
                },
                "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: 0,
                    left: "15%",
                    width: "70%",
                    height: "3px",
                    borderRadius: "4px",
                    backgroundColor: "#6366f1",
                    transform: "scaleX(0)",
                    transformOrigin: "bottom center",
                    transition: "transform 0.3s ease-out",
                },
                "&:hover::after": {
                    transform: "scaleX(1)",
                },
                "&:disabled": {
                    color: "#94a3b8",
                    backgroundColor: "#f1f5f9"
                }
            }}
        >
            {label}
        </Button>
    );

    return (
        <Container
            maxWidth="lg"
            sx={{
                padding: { xs: 2, sm: 3, md: 4 },
                backgroundColor: "#f9fafc",
                minHeight: "100vh",
            }}
        >
            {/* Header Section */}
            <Box sx={{ mb: 3 }}>
                <Fade in={true} timeout={800}>
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 700,
                            mb: { xs: 2, sm: 2 },
                            color: "#1e293b",
                            letterSpacing: "-0.02em",
                            lineHeight: 1.2,
                            fontSize: { xs: "1.8rem", sm: "2.4rem", md: "3rem" },
                            borderLeft: "4px solid #6366f1",
                            paddingLeft: 2
                        }}
                    >
                        {article.title}
                    </Typography>
                </Fade>

                <Box sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 3
                }}>
                    <Chip
                        icon={<AccessTimeIcon fontSize="small" />}
                        label={`${readingTime} phút đọc`}
                        size="small"
                        sx={{
                            backgroundColor: '#e0e7ff',
                            color: '#4338ca',
                            "& .MuiChip-icon": { color: '#4338ca' }
                        }}
                    />
                </Box>
            </Box>

            {/* Featured Image */}
            <Fade in={true} timeout={1000}>
                <CardMedia
                    component="img"
                    height="450"
                    image={article.image_url || "https://via.placeholder.com/1200x450"}
                    alt={article.title || "Featured Image"}
                    sx={{
                        borderRadius: 4,
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                        mb: 4,
                        objectFit: "cover",
                        width: "100%"
                    }}
                />
            </Fade>

            {/* Action Buttons */}
            <Paper
                elevation={0}
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    gap: 2,
                    mb: 4,
                    p: 2,
                    borderRadius: 3,
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid #e2e8f0"
                }}
            >
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                    {/* <ActionButton
                        icon={<FlashOnIcon />}
                        label="Thẻ ghi nhớ"
                        onClick={() => navigate(`/flashcards/${id}`)}
                    /> */}
                    <ActionButton
                        icon={<SchoolIcon />}
                        label={loadingQuestions ? "Đang tạo câu hỏi..." : "Câu hỏi"}
                        onClick={handleShowQuiz}
                        disabled={loadingQuestions || questions.length === 0}
                    />
                    <ActionButton
                        icon={<ChatIcon />}
                        label="Hỏi về bài viết"
                        onClick={toggleChat}
                        disabled={!chatbotReady}
                    />
                </Box>
                <Box sx={{ display: "flex", gap: 2 }}>
                    <Tooltip title={bookmarked ? "Đã lưu" : "Lưu bài viết"}>
                        <Button
                            variant="text"
                            onClick={toggleBookmark}
                            sx={{
                                minWidth: "unset",
                                width: 44,
                                height: 44,
                                borderRadius: "50%",
                                color: bookmarked ? "#6366f1" : "#64748b",
                                backgroundColor: bookmarked ? "rgba(99, 102, 241, 0.1)" : "transparent",
                                "&:hover": {
                                    backgroundColor: bookmarked ? "rgba(99, 102, 241, 0.15)" : "rgba(100, 116, 139, 0.1)"
                                }
                            }}
                        >
                            <BookmarkIcon />
                        </Button>
                    </Tooltip>
                    <Tooltip title="Chia sẻ">
                        <Button
                            variant="text"
                            sx={{
                                minWidth: "unset",
                                width: 44,
                                height: 44,
                                borderRadius: "50%",
                                color: "#64748b",
                                "&:hover": {
                                    backgroundColor: "rgba(100, 116, 139, 0.1)"
                                }
                            }}
                        >
                            <ShareIcon />
                        </Button>
                    </Tooltip>
                </Box>
            </Paper>

            {/* Quiz Questions */}
            {showQuiz && questions.length > 0 && (
                <Fade in={true} timeout={500}>
                    <Card sx={{
                        mt: 2,
                        mb: 4,
                        borderRadius: "16px",
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
                    }}>
                        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                            <UserQuestion
                                questions={questions}
                                onClose={() => setShowQuiz(false)}
                            />
                        </CardContent>
                    </Card>
                </Fade>
            )}

            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4 }}>
                {/* Main Content Column */}
                <Box sx={{ flex: 1 }}>
                    {/* Article Summary */}
                    <Card
                        sx={{
                            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                            borderRadius: "16px",
                            backgroundColor: "#ffffff",
                            overflow: "hidden",
                            mb: 4
                        }}
                    >
                        <Box
                            sx={{
                                backgroundColor: "#eff6ff",
                                py: 1.5,
                                px: 3,
                                borderBottom: "1px solid #e2e8f0"
                            }}
                        >
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    fontWeight: 600,
                                    color: "#334155",
                                    display: "flex",
                                    alignItems: "center"
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "8px" }}>
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                    <line x1="16" y1="13" x2="8" y2="13"></line>
                                    <line x1="16" y1="17" x2="8" y2="17"></line>
                                    <polyline points="10 9 9 9 8 9"></polyline>
                                </svg>
                                Tóm tắt bài viết
                            </Typography>
                        </Box>
                        <CardContent sx={{ padding: { xs: 2, sm: 3 } }}>
                            <ArticleSummary summary={summary} />
                        </CardContent>
                    </Card>

                    {/* Article Content */}
                    <Card
                        sx={{
                            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                            borderRadius: "16px",
                            backgroundColor: "#ffffff",
                            transition: "transform 0.3s ease",
                            overflow: "hidden"
                        }}
                    >
                        <Box
                            sx={{
                                backgroundColor: "#f8fafc",
                                py: 1.5,
                                px: 3,
                                borderBottom: "1px solid #e2e8f0"
                            }}
                        >
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    fontWeight: 600,
                                    color: "#334155"
                                }}
                            >
                                Nội dung bài viết
                            </Typography>
                        </Box>
                        <CardContent sx={{
                            padding: { xs: 2, sm: 4 },
                        }}>
                            <Typography
                                variant="body1"
                                color="text.primary"
                                sx={{
                                    lineHeight: 1.8,
                                    fontSize: "1.05rem",
                                    "& p": {
                                        mb: 2.5,
                                    },
                                }}
                                dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, "<p></p>") }}
                            />
                        </CardContent>
                    </Card>
                </Box>

                {/* Side Chat Column */}
                {showChat && (
                    <Fade in={showChat} timeout={500}>
                        <Box sx={{
                            width: { xs: "100%", md: "350px" },
                            position: { xs: "static", lg: "sticky" },
                            top: "20px",
                            alignSelf: "flex-start"
                        }}>
                            <Card
                                sx={{
                                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                                    borderRadius: "16px",
                                    height: { xs: "auto", md: "600px" },
                                    display: "flex",
                                    flexDirection: "column",
                                    overflow: "hidden"
                                }}
                            >
                                <Box
                                    sx={{
                                        backgroundColor: "#6366f1",
                                        py: 1.5,
                                        px: 2.5,
                                        color: "white",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center"
                                    }}
                                >
                                    <Typography sx={{ fontWeight: 600, display: "flex", alignItems: "center" }}>
                                        <ChatIcon sx={{ mr: 1, fontSize: 20 }} />
                                        Hỏi về bài viết
                                    </Typography>
                                    <Button
                                        size="small"
                                        onClick={toggleChat}
                                        sx={{
                                            minWidth: "unset",
                                            color: "white",
                                            p: 0.5
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                    </Button>
                                </Box>
                                <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
                                    <ChatBox chatbotReady={chatbotReady} />
                                </Box>
                            </Card>
                        </Box>
                    </Fade>
                )}
            </Box>

            <TranslationPopper />
        </Container>
    );
};

export default UserArticleDetail;