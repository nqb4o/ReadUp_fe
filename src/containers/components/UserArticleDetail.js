import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Container,
    CardMedia
} from "@mui/material";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import SchoolIcon from "@mui/icons-material/School";
import { getArticleByIdApi } from "../../services/ArticleService";
import ArticleSummary from "./ArticleSummary";
import axios from "axios";
import TranslationPopper from './TranslationPopper';
import ChatBox from "./ChatBox";

const UserArticleDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState("");
    const [chatbotReady, setChatbotReady] = useState(false);

    const generateSummary = async (content, setSummary) => {
        try {
            const response = await axios.post("http://localhost:5000/api/chatbot/query", {
                question: "What is this article's content?",
            });
            setSummary(response.data.answer);
        } catch (error) {
            console.error("Error generating summary:", error);
            setSummary("Unable to generate summary.");
        }
    };

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                setLoading(true);
                const response = await getArticleByIdApi(id);
                setArticle(response.data);

                // Automatically initialize chatbot with article details
                await initializeChatbotWithArticle(response.data.title, response.data.content);
            } catch (error) {
                console.error("Error fetching article:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [id]);

    useEffect(() => {
        if (article) {
            generateSummary(article.content, setSummary);
        }
    }, [article]);

    const initializeChatbotWithArticle = async (title, content) => {
        try {
            await axios.post("http://localhost:5000/api/chatbot/initialize-with-article", {
                articleTitle: title,
                articleContent: content,
            });
            setChatbotReady(true);
        } catch (error) {
            setChatbotReady(false);
        }
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography variant="h6" color="text.secondary" textAlign="center">
                    Loading...
                </Typography>
            </Container>
        );
    }

    if (!article) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography variant="h6" color="text.secondary" textAlign="center">
                    Article not found.
                </Typography>
            </Container>
        );
    }

    return (
        <Box
            sx={{
                padding: { xs: 2, sm: 3, md: 4 },
                maxWidth: { xs: "100%", sm: 600, md: 900, lg: 1200 },
                margin: "auto",
                backgroundColor: "#f9fafc",
                minHeight: "100vh",
            }}
        >
            {/* Header Section */}
            <Typography
                variant="h3"
                sx={{
                    fontWeight: "bold",
                    mb: { xs: 2, sm: 3 },
                    color: "#1a1a1a",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.2,
                    fontSize: { xs: "1.8rem", sm: "2.2rem", md: "3rem" },
                }}
            >
                {article.title}
            </Typography>

            {/* Navigation Buttons */}
            <Box
                sx={{
                    display: "flex",
                    gap: { xs: 1, sm: 2 },
                    mb: { xs: 2, sm: 3, md: 4 },
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "stretch", sm: "center" },
                }}
            >
                <Button
                    variant="text"
                    startIcon={<FlashOnIcon />}
                    onClick={() => navigate(`/flashcards/${id}`)}
                    sx={{
                        backgroundColor: "#ffffff",
                        color: "#333",
                        textTransform: "none",
                        fontWeight: 500,
                        padding: { xs: "6px 12px", sm: "8px 16px" },
                        borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                        transition: "all 0.3s ease",
                        position: "relative",
                        "&:hover": {
                            backgroundColor: "#f0f0f5",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                            transform: "translateY(-2px)",
                        },
                        "&::after": {
                            content: '""',
                            position: "absolute",
                            bottom: 0,
                            left: "10%",
                            width: "80%",
                            height: "4px",
                            borderRadius: "2px",
                            backgroundColor: "#a8b1ff",
                            transform: "scaleX(0)",
                            transformOrigin: "bottom center",
                            transition: "transform 0.3s ease-out",
                        },
                        "&:hover::after": {
                            transform: "scaleX(1)",
                        },
                    }}
                >
                    Thẻ ghi nhớ
                </Button>
                <Button
                    variant="text"
                    startIcon={<SchoolIcon />}
                    onClick={() => navigate(`/questions/${id}`)}
                    sx={{
                        backgroundColor: "#ffffff",
                        color: "#333",
                        textTransform: "none",
                        fontWeight: 500,
                        padding: { xs: "6px 12px", sm: "8px 16px" },
                        borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                        transition: "all 0.3s ease",
                        position: "relative",
                        "&:hover": {
                            backgroundColor: "#f0f0f5",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                            transform: "translateY(-2px)",
                        },
                        "&::after": {
                            content: '""',
                            position: "absolute",
                            bottom: 0,
                            left: "10%",
                            width: "80%",
                            height: "4px",
                            borderRadius: "2px",
                            backgroundColor: "#a8b1ff",
                            transform: "scaleX(0)",
                            transformOrigin: "bottom center",
                            transition: "transform 0.3s ease-out",
                        },
                        "&:hover::after": {
                            transform: "scaleX(1)",
                        },
                    }}
                >
                    Câu hỏi
                </Button>
            </Box>

            {/* Question Card */}
            <CardMedia
                component="img"
                height="400"
                image={article.image_url || "https://via.placeholder.com/400"}
                alt={article.title || "Default Image"}
                sx={{
                    borderRadius: 3,
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                    mb: 4,
                    objectFit: "cover",
                }}
            />
            <Card
                sx={{
                    boxShadow: {
                        xs: "0 2px 10px rgba(0, 0, 0, 0.06)",
                        sm: "0 4px 20px rgba(0, 0, 0, 0.08)",
                    },
                    borderRadius: "16px",
                    backgroundColor: "#ffffff",
                    transition: "transform 0.3s ease",
                    "&:hover": {
                        transform: { xs: "none", sm: "translateY(-4px)" },
                    },
                }}
            >
                <CardContent sx={{ padding: { xs: 2, sm: 3 } }}>
                    <ArticleSummary summary={summary} />
                    <Typography
                        variant="body1"
                        color="text.primary"
                        sx={{
                            lineHeight: 1.8,
                            "& p": {
                                mb: 2,
                            },
                        }}
                        dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, "<p></p>") }}
                    />
                </CardContent>
            </Card>
            <ChatBox chatbotReady={chatbotReady} />
            <TranslationPopper />
        </Box>
    );
};

export default UserArticleDetail;
