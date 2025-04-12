import { Box, Button, Typography } from "@mui/material";
import React, { useState } from "react";
import {
    Assignment as ArticleIcon,
    KeyboardArrowRight,
    KeyboardArrowDown,
    Email as MessageIcon,
    SupervisedUserCircle,
} from "@mui/icons-material";

const Dashboard = () => {
    const stats = [
        {
            title: "User",
            value: "1.35m",
            icon: <SupervisedUserCircle sx={{ fontSize: 40, color: "#888" }} />,
            bgColor:
                "linear-gradient(135deg, rgba(234, 215, 251, 1), rgba(255, 255, 255, 0.6))",
        },
        {
            title: "Article",
            value: "1.72m",
            icon: <ArticleIcon sx={{ fontSize: 40, color: "#888" }} />,
            bgColor:
                "linear-gradient(135deg, rgba(251, 239, 206, 1), rgba(255, 255, 255, 0.6))",
        },
        {
            title: "Messages",
            value: "234",
            icon: <MessageIcon sx={{ fontSize: 40, color: "#888" }} />,
            bgColor:
                "linear-gradient(135deg, rgba(251, 226, 214, 1), rgba(255, 255, 255, 0.6))",
        },
    ];

    const newsItems = [
        {
            title: "Whiteboard Templates By Industry Leaders",
            description:
                "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
            time: "a year",
            image: "https://free.minimals.cc/assets/images/cover/cover-1.webp",
        },
        {
            title:
                "Tesla Cybertruck-inspired camper trailer for Tesla fans who can't just wait for the",
            description:
                "New range of formal shirts are designed keeping you in mind. With fits and styling that",
            time: "a year",
            image: "https://free.minimals.cc/assets/images/cover/cover-1.webp",
        },
        {
            title: "Designify Agency Landing Page Design",
            description:
                "Andy shoes are designed to keeping in mind durability as well as trends, the most stylish",
            time: "2 years",
            image: "https://free.minimals.cc/assets/images/cover/cover-1.webp",
        },
        {
            title: "What is Done is Done 🌟",
            description:
                "The Football is Good For Training And Recreational Purposes",
            time: "a year",
            image: "https://free.minimals.cc/assets/images/cover/cover-1.webp",
        },
        {
            title: "Fresh Prince",
            description:
                "New ABC 13 9370, 13.3, 5th Gen CoreA5-8250U, 8GB RAM, 256GB SSD, power UHD Graphics",
            time: "a year",
            image: "https://free.minimals.cc/assets/images/cover/cover-1.webp",
        },
    ];

    const trafficData = [
        {
            site: "Facebook",
            value: "323.223k",
            image: "https://cdn.creazilla.com/icons/7911211/facebook-icon-lg.png",
        },
        {
            site: "Google",
            value: "341.221k",
            image:
                "https://cdn.pixabay.com/photo/2021/05/24/09/15/google-logo-6278331_960_720.png",
        },
        {
            site: "LinkedIn",
            value: "411.211k",
            image:
                "https://www.iconpacks.net/icons/1/free-linkedin-icon-130-thumb.png",
        },
        {
            site: "Twitter",
            value: "443.223k",
            image: "https://img.icons8.com/ios7/512/4D4D4D/twitterx--v2.png",
        },
    ];

    const [showAllNews, setShowAllNews] = useState(false);
    const initialNewsLimit = 5;

    const handleToggleNews = () => {
        setShowAllNews((prev) => !prev);
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Hi, Welcome back 👋
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
                    {newsItems
                        .slice(0, showAllNews ? newsItems.length : initialNewsLimit)
                        .map((item, index) => (
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
                                        src={item.image}
                                        alt={item.title}
                                        style={{
                                            width: 48,
                                            height: 48,
                                            borderRadius: 8,
                                            objectFit: "cover",
                                        }}
                                    />
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        {item.title}
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
                                        {item.description}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        {item.time}
                                    </Typography>
                                </Box>
                            </Box>
                        ))}
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                        <Button
                            sx={{ display: "flex", alignItems: "center" }}
                            onClick={handleToggleNews}
                        >
                            {showAllNews ? "Show less" : "View all"}{" "}
                            {showAllNews ? <KeyboardArrowDown /> : <KeyboardArrowRight />}
                        </Button>
                    </Box>
                </Box>
                {/* Phần Traffic by site */}
                <Box
                    sx={{
                        flex: 2,
                        borderRadius: 2,
                        bgcolor: "#fff",
                        p: 2,
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        height: "fit-content",
                    }}
                >
                    <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ fontWeight: 600, color: "#042174" }}
                    >
                        Traffic by site
                    </Typography>
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(2, 1fr)",
                            gap: 2,
                        }}
                    >
                        {trafficData.map((traffic, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    p: 2,
                                    bgcolor: "rgba(0,0,0,0.02)",
                                    borderRadius: 2,
                                }}
                            >
                                <img
                                    src={traffic.image}
                                    alt={traffic.site}
                                    style={{
                                        width: 32,
                                        height: 32,
                                        objectFit: "contain",
                                        marginBottom: 8,
                                    }}
                                />
                                <Typography variant="h6" fontWeight="bold">
                                    {traffic.value}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {traffic.site}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default Dashboard;