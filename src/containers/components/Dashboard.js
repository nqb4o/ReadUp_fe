import { Box, Button, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import {
    Assignment as ArticleIcon,
    KeyboardArrowRight,
    KeyboardArrowDown,
    SupervisedUserCircle,
    Quiz as QuizIcon,
} from "@mui/icons-material";
import { getAllUsers } from "../../services/UserService";
import { fetchArticleApi } from "../../services/ArticleService";
import { getAllQuizQuestions } from "../../services/QuizService";

const Dashboard = () => {
    const [stats, setStats] = useState([
        {
            title: "User",
            value: "0",
            icon: <SupervisedUserCircle sx={{ fontSize: 40, color: "#888" }} />,
            bgColor:
                "linear-gradient(135deg, rgba(234, 215, 251, 1), rgba(255, 255, 255, 0.6))",
        },
        {
            title: "Article",
            value: "0",
            icon: <ArticleIcon sx={{ fontSize: 40, color: "#888" }} />,
            bgColor:
                "linear-gradient(135deg, rgba(251, 239, 206, 1), rgba(255, 255, 255, 0.6))",
        },
        {
            title: "Quiz",
            value: "0",
            icon: <QuizIcon sx={{ fontSize: 40, color: "#888" }} />,
            bgColor:
                "linear-gradient(135deg, rgba(206, 251, 239, 1), rgba(255, 255, 255, 0.6))",
        }
    ]);

    const [showAllNews, setShowAllNews] = useState(false);
    const initialNewsLimit = 5;
    const [articles, setArticles] = useState([]);
    const [users, setUsers] = useState([]);
    const [quizs, setQuizs] = useState([]);

    const handleToggleNews = () => {
        setShowAllNews((prev) => !prev);
    };

    const user = sessionStorage.getItem("user");
    const userName = user ? JSON.parse(user).name : "User";

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await fetchArticleApi();
                setArticles(response.data);
            } catch (error) {
                console.error("Error fetching articles:", error);
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await getAllUsers();
                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        const fetchQuizs = async () => {
            try {
                const response = await getAllQuizQuestions();
                setQuizs(response.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchArticles();
        fetchUsers();
        fetchQuizs();
    }, []);

    // Update stats when articles or users change
    useEffect(() => {
        setStats(prevStats => {
            const newStats = [...prevStats];
            // Update User count
            newStats[0] = {
                ...newStats[0],
                value: users.length.toString()
            };
            // Update Article count
            newStats[1] = {
                ...newStats[1],
                value: articles.length.toString()
            };
            newStats[2] = {
                ...newStats[2],
                value: quizs.length.toString()
            };
            return newStats;
        });
    }, [articles, users, quizs]);

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Hi, Welcome back <b>{userName}</b>
            </Typography>
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(3, 1fr)",
                    },
                    gap: 2,
                    width: "100%",
                }}
            >
                {stats.map((stat, index) => (
                    <Box
                        key={index}
                        sx={{
                            background: stat.bgColor,
                            borderRadius: 2,
                            p: 2,
                            display: "flex",
                            justifyContent: "center",
                            flexDirection: "column",
                            gap: 1,
                            position: "relative",
                            minHeight: { xs: 100, sm: 120 },
                        }}
                    >
                        <Box sx={{ position: "absolute", top: 16, left: 16 }}>
                            {stat.icon}
                        </Box>
                        <Box sx={{ mt: 6, color: "#042174" }}>
                            <Typography
                                variant="body2"
                                sx={{ fontSize: { xs: 14, sm: 16 }, fontWeight: 600 }}
                            >
                                {stat.title}
                            </Typography>
                            <Typography
                                variant="h5"
                                fontWeight="bold"
                                sx={{ fontSize: { xs: 20, sm: 24 } }}
                            >
                                {stat.value}
                            </Typography>
                        </Box>
                    </Box>
                ))}
            </Box>
            {/* Phần News và Traffic by site */}
            <Box
                sx={{
                    mt: 4,
                    display: "flex",
                    gap: 2,
                    flexDirection: { xs: "column", md: "row" },
                    alignItems: "flex-start",
                }}
            >
                {/* Phần News */}
                <Box
                    sx={{
                        flex: 8,
                        borderRadius: 2,
                        bgcolor: "#fff",
                        p: 2,
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                >
                    <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ fontWeight: 600, color: "#042174" }}
                    >
                        News
                    </Typography>
                    {articles.length > 0 ? (
                        articles
                            .slice(0, showAllNews ? articles.length : initialNewsLimit)
                            .map((article, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 2,
                                        p: 1,
                                        bgcolor: "#fff",
                                        mb: 1,
                                        borderBottom: "1px dashed rgba(145 158 171 / 0.2)",
                                    }}
                                >
                                    <Box>
                                        <img
                                            src={article.image_url || "https://free.minimals.cc/assets/images/cover/cover-1.webp"}
                                            alt={article.title}
                                            style={{
                                                width: 48,
                                                height: 48,
                                                borderRadius: 8,
                                                objectFit: "cover",
                                            }}
                                            onError={(e) => {
                                                e.target.src = "https://free.minimals.cc/assets/images/cover/cover-1.webp";
                                            }}
                                        />
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                            {article.title}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                fontSize: 14,
                                                display: "-webkit-box",
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: "vertical",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                lineHeight: 1.4,
                                                maxHeight: "2.8em",
                                            }}
                                        >
                                            {article.content?.substring(0, 140)}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">
                                            {new Date(article.created_at).toLocaleDateString()}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))
                    ) : (
                        <Typography variant="body2" sx={{ textAlign: "center", py: 2 }}>
                            No articles available
                        </Typography>
                    )}
                    {articles.length > initialNewsLimit && (
                        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                            <Button
                                sx={{ display: "flex", alignItems: "center" }}
                                onClick={handleToggleNews}
                            >
                                {showAllNews ? "Show less" : "View all"}{" "}
                                {showAllNews ? <KeyboardArrowDown /> : <KeyboardArrowRight />}
                            </Button>
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default Dashboard;