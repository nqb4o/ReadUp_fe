import React from "react";
import {
    Container,
    Grid,
    Typography,
    Box,
    CardMedia,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    useTheme,
    alpha,
} from "@mui/material";
import { styled, keyframes } from "@mui/system";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// Animation keyframes
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Styled components with theme awareness
const FeatureSection = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(5),
    borderRadius: theme.spacing(3),
    background: theme.palette.mode === 'light'
        ? `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.light, 0.1)} 100%)`
        : `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.dark, 0.15)} 100%)`,
    border: `2px solid ${alpha(theme.palette.divider, 0.1)}`,
    boxShadow: theme.palette.mode === 'light'
        ? '0 10px 40px rgba(0, 0, 0, 0.08)'
        : `0 10px 40px ${alpha(theme.palette.common.black, 0.2)}`,
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    "&:hover": {
        transform: "translateY(-8px)",
        boxShadow: theme.palette.mode === 'light'
            ? '0 15px 50px rgba(0, 0, 0, 0.12)'
            : `0 15px 50px ${alpha(theme.palette.common.black, 0.25)}`,
    },
    marginBottom: theme.spacing(5),
    animation: `${fadeIn} 0.8s ease-out`,
    animationFillMode: "forwards",
    opacity: 0,
    "&:nth-of-type(1)": { animationDelay: "0.2s" },
    "&:nth-of-type(2)": { animationDelay: "0.4s" },
    "&:nth-of-type(3)": { animationDelay: "0.6s" },
    "&:nth-of-type(4)": { animationDelay: "0.8s" },
    "&:nth-of-type(5)": { animationDelay: "1s" },
}));

const FeatureImage = styled(CardMedia)(({ theme }) => ({
    borderRadius: theme.spacing(2),
    transition: "transform 0.3s ease",
    "&:hover": {
        transform: "scale(1.08)",
    },
    boxShadow: theme.palette.mode === 'light'
        ? '0 5px 20px rgba(0, 0, 0, 0.1)'
        : `0 5px 20px ${alpha(theme.palette.common.black, 0.2)}`,
}));

const HomePage = () => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: theme.palette.background.default,
                position: "relative",
                overflow: "hidden",
                py: 10,
                "&:before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: theme.palette.mode === 'light'
                        ? `radial-gradient(circle at 20% 30%, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 70%)`
                        : `radial-gradient(circle at 20% 30%, ${alpha(theme.palette.primary.dark, 0.15)} 0%, transparent 70%)`,
                    zIndex: 0,
                },
            }}
        >
            <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
                {/* Main title */}
                <Box sx={{ textAlign: "center", mb: 8 }}>
                    <Typography
                        variant="h2"
                        component="h1"
                        fontWeight="bold"
                        sx={{
                            background: theme.palette.mode === 'light'
                                ? `linear-gradient(90deg, ${theme.palette.primary.dark}, ${theme.palette.primary.light})`
                                : `linear-gradient(90deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            mb: 2,
                            fontSize: { xs: "2.5rem", md: "4rem" },
                            letterSpacing: "-0.02em",
                        }}
                    >
                        Top Features
                    </Typography>
                    <Typography
                        variant="h5"
                        color="text.secondary"
                        sx={{ fontStyle: "italic", fontWeight: 300 }}
                    >
                        A system to support and improve English reading skills
                    </Typography>
                </Box>

                {/* Section 1: Improving Reading Skills by using Flash Cards */}
                <FeatureSection>
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={5}>
                            <FeatureImage
                                component="img"
                                height="300"
                                image="https://img.freepik.com/free-vector/flashcards-concept-illustration_114360-7623.jpg"
                                alt="Flash Cards"
                                sx={{
                                    width: "100%",
                                    objectFit: "cover",
                                    filter: theme.palette.mode === 'dark' ? 'brightness(0.9)' : 'none'
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={7}>
                            <Typography
                                variant="h4"
                                fontWeight="bold"
                                sx={{ mb: 3, color: theme.palette.primary.main }}
                            >
                                Improving Reading Skills by using Flash Cards
                            </Typography>
                            <List>
                                {[
                                    "Customizable and interactive way",
                                    "Better Understanding",
                                    "Progress Tracking",
                                ].map((text, index) => (
                                    <ListItem key={index} sx={{ py: 1.5 }}>
                                        <ListItemIcon>
                                            <CheckCircleIcon color="success" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Typography variant="body1" fontWeight="medium">
                                                    {text}
                                                </Typography>
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Grid>
                    </Grid>
                </FeatureSection>

                {/* Section 2: Enhancing Reading Skills by extending your Vocabulary */}
                <FeatureSection>
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={5}>
                            <FeatureImage
                                component="img"
                                height="300"
                                image="https://img.freepik.com/free-vector/vocabulary-concept-illustration_114360-7624.jpg"
                                alt="Vocabulary"
                                sx={{
                                    width: "100%",
                                    objectFit: "cover",
                                    filter: theme.palette.mode === 'dark' ? 'brightness(0.9)' : 'none'
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={7}>
                            <Typography
                                variant="h4"
                                fontWeight="bold"
                                sx={{ mb: 3, color: theme.palette.primary.main }}
                            >
                                Enhancing Reading Skills by extending your Vocabulary
                            </Typography>
                            <List>
                                {["Definition", "IPA", "Using in different scenarios"].map(
                                    (text, index) => (
                                        <ListItem key={index} sx={{ py: 1.5 }}>
                                            <ListItemIcon>
                                                <CheckCircleIcon color="success" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={
                                                    <Typography variant="body1" fontWeight="medium">
                                                        {text}
                                                    </Typography>
                                                }
                                            />
                                        </ListItem>
                                    )
                                )}
                            </List>
                        </Grid>
                    </Grid>
                </FeatureSection>

                {/* Section 3: Practice Reading with Real-World Articles */}
                <FeatureSection>
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={5}>
                            <FeatureImage
                                component="img"
                                height="300"
                                image="https://img.freepik.com/free-vector/online-news-concept-illustration_114360-7625.jpg"
                                alt="Real-World Articles"
                                sx={{
                                    width: "100%",
                                    objectFit: "cover",
                                    filter: theme.palette.mode === 'dark' ? 'brightness(0.9)' : 'none'
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={7}>
                            <Typography
                                variant="h4"
                                fontWeight="bold"
                                sx={{ mb: 3, color: theme.palette.primary.main }}
                            >
                                Practice Reading with Real-World Articles
                            </Typography>
                            <List>
                                {[
                                    "Access to authentic English articles",
                                    "Instant translation and grammar tips",
                                    "Highlight and save new words",
                                ].map((text, index) => (
                                    <ListItem key={index} sx={{ py: 1.5 }}>
                                        <ListItemIcon>
                                            <CheckCircleIcon color="success" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Typography variant="body1" fontWeight="medium">
                                                    {text}
                                                </Typography>
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Grid>
                    </Grid>
                </FeatureSection>

                {/* Section 4: Improve Listening Skills with Audio Integration */}
                <FeatureSection>
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={5}>
                            <FeatureImage
                                component="img"
                                height="300"
                                image="https://img.freepik.com/free-vector/podcast-concept-illustration_114360-7626.jpg"
                                alt="Audio Integration"
                                sx={{
                                    width: "100%",
                                    objectFit: "cover",
                                    filter: theme.palette.mode === 'dark' ? 'brightness(0.9)' : 'none'
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={7}>
                            <Typography
                                variant="h4"
                                fontWeight="bold"
                                sx={{ mb: 3, color: theme.palette.primary.main }}
                            >
                                Improve Listening Skills with Audio Integration
                            </Typography>
                            <List>
                                {[
                                    "Listen to native speaker audio",
                                    "Adjustable playback speed",
                                    "Follow along with highlighted text",
                                ].map((text, index) => (
                                    <ListItem key={index} sx={{ py: 1.5 }}>
                                        <ListItemIcon>
                                            <CheckCircleIcon color="success" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Typography variant="body1" fontWeight="medium">
                                                    {text}
                                                </Typography>
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Grid>
                    </Grid>
                </FeatureSection>

                {/* Section 5: Personalized Learning with AI Recommendations */}
                <FeatureSection>
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={5}>
                            <FeatureImage
                                component="img"
                                height="300"
                                image="https://img.freepik.com/free-vector/ai-technology-concept-illustration_114360-7627.jpg"
                                alt="AI Recommendations"
                                sx={{
                                    width: "100%",
                                    objectFit: "cover",
                                    filter: theme.palette.mode === 'dark' ? 'brightness(0.9)' : 'none'
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={7}>
                            <Typography
                                variant="h4"
                                fontWeight="bold"
                                sx={{ mb: 3, color: theme.palette.primary.main }}
                            >
                                Personalized Learning with AI Recommendations
                            </Typography>
                            <List>
                                {[
                                    "AI-driven content suggestions",
                                    "Tailored exercises for your level",
                                    "Track your improvement over time",
                                ].map((text, index) => (
                                    <ListItem key={index} sx={{ py: 1.5 }}>
                                        <ListItemIcon>
                                            <CheckCircleIcon color="success" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Typography variant="body1" fontWeight="medium">
                                                    {text}
                                                </Typography>
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Grid>
                    </Grid>
                </FeatureSection>
            </Container>
        </Box>
    );
};

export default HomePage;