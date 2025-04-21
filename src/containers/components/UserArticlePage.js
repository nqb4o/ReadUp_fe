import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    CardMedia,
} from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { fetchArticleApi } from "../../services/ArticleService";

// Styled ArticleCard
const ArticleCard = styled(Card)(({ theme }) => ({
    borderRadius: theme.spacing(1),
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
    padding: theme.spacing(2),
    backgroundColor: "#fff",
    border: "1px solid #e0e0e0",
    transition: "box-shadow 0.3s ease, transform 0.3s ease",
    height: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    cursor: "pointer", // Add cursor pointer to indicate clickability
    "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: "0 6px 16px rgba(0, 0, 0, 0.12)",
    },
    [theme.breakpoints.down("md")]: {
        flexDirection: "column",
        alignItems: "flex-start",
        padding: theme.spacing(1.5),
    },
}));

// Styled CardMedia for image
const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
    width: 80,
    height: 80,
    objectFit: "cover",
    borderRadius: theme.spacing(1),
    transition: "transform 0.3s ease",
    marginRight: theme.spacing(2),
    alignSelf: "center",
    [theme.breakpoints.down("md")]: {
        width: "100%",
        height: 240,
        marginRight: 0,
        marginBottom: theme.spacing(2),
    },
}));

// Styled ArticlesContainer
const ArticlesContainer = styled(Box)(({ theme }) => ({
    position: "relative",
}));

const UserArticlePage = () => {
    const navigate = useNavigate(); // Initialize useNavigate
    const [isFetching, setIsFetching] = useState(false);
    const [articleData, setArticleData] = useState([]);
    const [error, setError] = useState(null);

    // Fetch articles on component mount
    useEffect(() => {
        const fetchArticles = async () => {
            setIsFetching(true);
            try {
                const response = await fetchArticleApi();
                setArticleData(response.data);
                setError(null);
            } catch (err) {
                setError("Không thể tải bài báo. Vui lòng thử lại sau.");
                setArticleData([]);
            } finally {
                setIsFetching(false);
            }
        };

        fetchArticles();
    }, []);

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    // Truncate content
    const truncateContent = (text, maxLength) => {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + "...";
    };

    // Handle article click
    const handleArticleClick = (id) => {
        navigate(`/articles/${id}`);
    };

    return (
        <Box
            sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, sm: 3, md: 4 }, py: 4 }}
        >
            {/* Recents Section */}
            <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ mb: 2, color: "#333", fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
            >
                Bài báo
            </Typography>
            {articleData.length === 0 ? (
                <Typography textAlign="center" sx={{ my: 4, color: "#666" }}>
                    Không có bài báo nào được tìm thấy.
                </Typography>
            ) : (
                <ArticlesContainer>
                    <Grid container spacing={{ xs: 2, sm: 3 }}>
                        {articleData.map((article) => (
                            <Grid item xs={12} sm={6} key={article.id}>
                                <ArticleCard onClick={() => handleArticleClick(article.id)}>
                                    <StyledCardMedia
                                        component="img"
                                        image={article.image_url || "https://via.placeholder.com/400"}
                                        alt={article.title || "Default Image"}
                                        sx={{
                                            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                                            objectFit: "cover",
                                        }}
                                    />
                                    <CardContent sx={{ flex: 1, py: 2, px: { xs: 1, sm: 2 } }}>
                                        <Typography
                                            variant="h6"
                                            fontWeight="medium"
                                            sx={{
                                                mb: 1,
                                                color: "#333",
                                                fontSize: { xs: "1rem", sm: "1.25rem" },
                                            }}
                                        >
                                            {article.title}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ mb: 2, lineHeight: 1.6 }}
                                        >
                                            {truncateContent(article.content, 100)}
                                        </Typography>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 2,
                                                flexWrap: "wrap",
                                            }}
                                        >
                                            <Box
                                                sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                                            >
                                                <AccessTimeIcon sx={{ fontSize: 16, color: "#666" }} />
                                                <Typography variant="caption" color="text.secondary">
                                                    Tạo: {formatDate(article.created_at)}
                                                </Typography>
                                            </Box>
                                            <Box
                                                sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                                            >
                                                <AccessTimeIcon sx={{ fontSize: 16, color: "#666" }} />
                                                <Typography variant="caption" color="text.secondary">
                                                    Cập nhật: {formatDate(article.updated_at)}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </ArticleCard>
                            </Grid>
                        ))}
                    </Grid>
                </ArticlesContainer>
            )}
        </Box>
    );
};

export default UserArticlePage;