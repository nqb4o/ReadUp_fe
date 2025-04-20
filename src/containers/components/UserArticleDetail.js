import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from "@mui/material";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import SchoolIcon from "@mui/icons-material/School";
import { getArticleByIdApi } from "../../services/ArticleService";

const UserArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchArticle = async () => {
//       try {
//         setLoading(true);
//         const response = await getArticleByIdApi(id);
//         setArticle(response.data);
//         setError(null);
//       } catch (err) {
//         setError("Failed to fetch article. Please try again.");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchArticle();
//   }, [id]);

//   if (loading) {
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           minHeight: "100vh",
//         }}
//       >
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Box
//         sx={{
//           padding: { xs: 2, sm: 3, md: 4 },
//           maxWidth: { xs: "100%", sm: 600, md: 900, lg: 1200 },
//           margin: "auto",
//         }}
//       >
//         <Alert severity="error">{error}</Alert>
//       </Box>
//     );
//   }

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
        {"Article Title"}
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
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              color: "#2d2d2d",
              fontWeight: 600,
              lineHeight: 1.4,
              fontSize: { xs: "1rem", sm: "1.25rem" },
            }}
          >
            {"No content available"}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserArticleDetail;
