import React, { useEffect, useState } from "react";
import {
    Container,
    Typography,
    Box,
    CardMedia,
    Divider,
    Chip,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { getArticleByIdApi } from "../../services/ArticleService";
import ChatBox from "./ChatBox";
import TranslationPopper from './TranslationPopper';
import axios from "axios";
import ArticleSummary from "./ArticleSummary";

const BlogDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState("");

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
                setPost(response.data);

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
        if (post) {
            generateSummary(post.content, setSummary);
        }
    }, [post]);

    const initializeChatbotWithArticle = async (title, content) => {
        try {
            await axios.post("http://localhost:5000/api/chatbot/initialize-with-article", {
                articleTitle: title,
                articleContent: content,
            });
            console.log("Chatbot initialized with article details.");
        } catch (error) {
            console.error("Error initializing chatbot with article:", error);
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

    if (!post) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography variant="h6" color="text.secondary" textAlign="center">
                    Blog post not found.
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 6 }}>
            <CardMedia
                component="img"
                height="400"
                image={post.image}
                alt={post.title}
                sx={{
                    borderRadius: 3,
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                    mb: 4,
                    objectFit: "cover",
                }}
            />
            <Typography
                variant="h3"
                component="h1"
                fontWeight="bold"
                gutterBottom
                sx={{ color: "primary.main" }}
            >
                {post.title}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                    {post.date}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    •
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    By {post.author}
                </Typography>
                <Chip
                    label={post.category}
                    size="small"
                    sx={{ bgcolor: "primary.light", color: "primary.contrastText" }}
                />
            </Box>
            <ArticleSummary summary={summary} />
            <Divider sx={{ mb: 4 }} />
            <Typography
                variant="body1"
                color="text.primary"
                sx={{
                    lineHeight: 1.8,
                    "& p": {
                        mb: 2,
                    },
                }}
                dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, "<p></p>") }}
            />
            <ChatBox />
            <TranslationPopper />
        </Container>
    );
};

export default BlogDetail;