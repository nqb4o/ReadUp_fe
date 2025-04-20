import React from "react";
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

// Hardcoded article data
const articleData = [
  {
    id: 1,
    title: "Khám phá vẻ đẹp thiên nhiên Việt Nam",
    content:
      "Việt Nam nổi tiếng với những danh lam thắng cảnh tuyệt đẹp, từ vịnh Hạ Long hùng vĩ đến những cánh đồng lúa chín vàng ở Tây Bắc. Hãy cùng khám phá những điểm đến không thể bỏ qua trong hành trình du lịch của bạn!",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    created_at: "2025-03-15T10:00:00Z",
    updated_at: "2025-03-16T12:00:00Z",
  },
  {
    id: 2,
    title: "Công nghệ AI thay đổi cuộc sống",
    content:
      "Trí tuệ nhân tạo (AI) đang cách mạng hóa nhiều lĩnh vực, từ y tế đến giáo dục. Tìm hiểu cách AI đang tạo ra những thay đổi tích cực trong cuộc sống hàng ngày của chúng ta.",
    image: "https://images.unsplash.com/photo-1516321310768-61f59f03bd1e",
    created_at: "2025-03-10T09:00:00Z",
    updated_at: "2025-03-11T11:00:00Z",
  },
  {
    id: 3,
    title: "Ẩm thực đường phố Việt Nam",
    content:
      "Từ phở bò thơm lừng đến bánh mì giòn tan, ẩm thực đường phố Việt Nam là một trải nghiệm không thể bỏ qua. Khám phá những món ăn nổi tiếng và câu chuyện đằng sau chúng.",
    image: "https://images.unsplash.com/photo-1512568400610-62da28bc8a13",
    created_at: "2025-03-05T08:00:00Z",
    updated_at: "2025-03-06T10:00:00Z",
  },
];

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
                    image={article.image}
                    alt={article.title}
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
