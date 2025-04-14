import React, { useEffect, useState } from "react";
import {
    Container,
    Typography,
    Box,
    CardMedia,
    Divider,
    Chip,
    Paper,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { getArticleByIdApi } from "../../services/ArticleService";
import ChatBox from "./ChatBox";
import TranslationPopper from './TranslationPopper';
import axios from "axios";

const BlogDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

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
            <Paper
                elevation={0}
                sx={{
                    bgcolor: "primary.lightest" || "#f0f5ff",
                    p: 3,
                    mb: 4,
                    borderRadius: 2,
                    border: 1,
                    borderColor: "primary.light",
                }}
            >
                <Typography
                    variant="h6"
                    component="h2"
                    fontWeight="bold"
                    gutterBottom
                    sx={{ color: "primary.dark" }}
                >
                    Summary
                </Typography>
                <Typography variant="body1" color="text.primary">
                    {post.summary}
                </Typography>
            </Paper>
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