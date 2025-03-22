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

// Styled components
const FeatureSection = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(5),
  borderRadius: theme.spacing(3),
  background: "linear-gradient(145deg, #ffffff 0%, #f0f4f8 100%)",
  border: "2px solid transparent",
  boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 15px 50px rgba(0, 0, 0, 0.12)",
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
  boxShadow: "0 5px 20px rgba(0, 0, 0, 0.1)",
}));

const HomePage = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#fff",
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
          background:
            "radial-gradient(circle at 20% 30%, rgba(66, 165, 245, 0.1) 0%, transparent 70%)",
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        {/* Tiêu đề chính */}
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography
            variant="h2"
            component="h1"
            fontWeight="bold"
            sx={{
              background: "linear-gradient(90deg, #1976d2, #42a5f5)",
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
                sx={{ width: "100%", objectFit: "cover" }}
              />
            </Grid>
            <Grid item xs={12} md={7}>
              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{ mb: 3, color: "primary.dark" }}
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
                      <CheckCircleIcon sx={{ color: "success.main" }} />
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
                sx={{ width: "100%", objectFit: "cover" }}
              />
            </Grid>
            <Grid item xs={12} md={7}>
              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{ mb: 3, color: "primary.dark" }}
              >
                Enhancing Reading Skills by extending your Vocabulary
              </Typography>
              <List>
                {["Definition", "IPA", "Using in different scenarios"].map(
                  (text, index) => (
                    <ListItem key={index} sx={{ py: 1.5 }}>
                      <ListItemIcon>
                        <CheckCircleIcon sx={{ color: "success.main" }} />
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
                sx={{ width: "100%", objectFit: "cover" }}
              />
            </Grid>
            <Grid item xs={12} md={7}>
              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{ mb: 3, color: "primary.dark" }}
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
                      <CheckCircleIcon sx={{ color: "success.main" }} />
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
                sx={{ width: "100%", objectFit: "cover" }}
              />
            </Grid>
            <Grid item xs={12} md={7}>
              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{ mb: 3, color: "primary.dark" }}
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
                      <CheckCircleIcon sx={{ color: "success.main" }} />
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
                sx={{ width: "100%", objectFit: "cover" }}
              />
            </Grid>
            <Grid item xs={12} md={7}>
              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{ mb: 3, color: "primary.dark" }}
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
                      <CheckCircleIcon sx={{ color: "success.main" }} />
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