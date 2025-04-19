import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  CardMedia,
  Button,
  IconButton,
  useTheme,
  alpha,
} from "@mui/material";
import { styled, keyframes } from "@mui/system";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { fetchArticleApi } from "../../services/ArticleService";

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

const slide = keyframes`
  from {
    opacity: 0.5;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

// Styled components with theme awareness
const FeatureSection = styled(Box)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  padding: theme.spacing(2),
  boxShadow:
    theme.palette.mode === "light"
      ? "0 5px 20px rgba(0, 0, 0, 0.08)"
      : `0 5px 20px ${alpha(theme.palette.common.black, 0.2)}`,
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    scale: "1.05",
  },
  animation: `${fadeIn} 0.8s ease-out`,
  animationFillMode: "forwards",
  opacity: 0,
}));

const FeatureImage = styled(CardMedia)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  transition: "transform 0.3s ease",
}));

const CarouselContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  overflow: "hidden",
  padding: theme.spacing(2, 0),
}));

const CarouselTrack = styled(Box)(({ theme }) => ({
  display: "flex",
  transition: "transform 0.5s ease-in-out",
  animation: `${slide} 0.5s ease-in-out`,
}));

const ArrowButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  zIndex: 10,
  borderRadius: "50%",
  transform: "translateY(-50%)",
  backgroundColor: theme.palette.background.paper,
  boxShadow:
    theme.palette.mode === "light"
      ? "0 2px 10px rgba(0, 0, 0, 0.1)"
      : `0 2px 10px ${alpha(theme.palette.common.black, 0.2)}`,
  "&:hover": {
    backgroundColor: "#edeff4",
  },
}));

const PublicHomePage = () => {
  const theme = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Fetch articles from API
  useEffect(() => {
    const loadArticles = async () => {
      try {
        setLoading(true);
        const response = await fetchArticleApi();
        setArticles(response.data);
        setLoading(false);
      } catch (err) {
        setError("Không tải được bài viết. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };
    loadArticles();
  }, []);

  // Define the feature items
  const features = [
    {
      title: "Giải pháp chuyên gia",
      bgColor: "#98F1D1",
      image:
        "https://images.prismic.io/quizlet-web/ZpWg2x5LeNNTxK_n_5Expertsolutions%402x.png?auto=format,compress",
    },
    {
      title: "Học hỏi",
      bgColor: "#98E3FF",
      image:
        "https://images.prismic.io/quizlet-web/ZpFubx5LeNNTxHxg_4Learn%402x.png?auto=format,compress",
    },
    {
      title: "Hướng dẫn học tập",
      bgColor: "#EEAAFF",
      image:
        "https://images.prismic.io/quizlet-web/ZpFuOB5LeNNTxHxU_1SG%402x.png?auto=format,compress",
    },
    {
      title: "Thẻ ghi nhớ",
      bgColor: "#423ED8",
      image:
        "https://images.prismic.io/quizlet-web/ZpFuUR5LeNNTxHxc_2Flashcards%402x.png?auto=format,compress",
    },
    {
      title: "Bài kiểm tra thực hành",
      bgColor: "#FFC38C",
      image:
        "https://images.prismic.io/quizlet-web/ZpFuYB5LeNNTxHxd_3PracticeTests%402x.png?auto=format,compress",
    },
  ];

  const itemsPerView = {
    xs: 1,
    sm: 2,
    md: 4,
  };

  const getItemsPerView = () => {
    if (window.innerWidth >= theme.breakpoints.values.md)
      return itemsPerView.md;
    if (window.innerWidth >= theme.breakpoints.values.sm)
      return itemsPerView.sm;
    return itemsPerView.xs;
  };

  const [visibleItems, setVisibleItems] = useState(getItemsPerView());

  useEffect(() => {
    const handleResize = () => {
      setVisibleItems(getItemsPerView());
      setCurrentIndex(0);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => {
      const newIndex = prev - 1;
      return newIndex < 0 ? features.length - 1 : newIndex;
    });
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % features.length);
  };

  const getVisibleFeatures = () => {
    const result = [];
    for (let i = 0; i < visibleItems; i++) {
      const index = (currentIndex + i) % features.length;
      result.push(features[index]);
    }
    return result;
  };

  const visibleFeatures = getVisibleFeatures();

  const itemsPerPage = 6;
  const totalPages = Math.ceil(articles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleArticles = articles.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : totalPages));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : 1));
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: theme.palette.background.default,
        position: "relative",
        overflow: "hidden",
        paddingTop: 16
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        {/* Main title */}
        <Box
          sx={{
            textAlign: "center",
            maxWidth: "md",
            p: 4,
            pt: 0,
            margin: "auto",
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            fontWeight="bold"
            sx={{
              color: theme.palette.text.primary,
              mb: 2,
              fontSize: { xs: "2rem", md: "3rem" },
            }}
          >
            Bạn muốn học theo hình thức nào?
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            Nắm vững những kiến ​​thức bạn đang học với các thẻ ghi nhớ tương
            tác, bài kiểm tra thực hành và hoạt động học tập của ReadUp.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ borderRadius: "50px", textTransform: "none", px: 4 }}
            onClick={() => handleLogout("/login")}
          >
            Đăng ký miễn phí
          </Button>
        </Box>

        {/* Feature Sections with Carousel */}
        <CarouselContainer sx={{ mb: 6 }}>
          <ArrowButton onClick={handlePrev} sx={{ left: 5 }}>
            <ArrowBackIosIcon />
          </ArrowButton>
          <CarouselTrack
            sx={{
              width: "100%",
              height: "350px",
              display: "flex",
            }}
          >
            {visibleFeatures.map((feature, index) => (
              <Box
                key={`${feature.title}-${index}`}
                sx={{
                  width: `${100 / visibleItems}%`,
                  px: 1,
                  height: "100%",
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.)",
                    zIndex: 1,
                  },
                }}
              >
                <FeatureSection
                  sx={{
                    backgroundColor: feature.bgColor,
                    padding: 0,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    sx={{ mt: 1, textAlign: "center", p: 2 }}
                  >
                    {feature.title}
                  </Typography>
                  <FeatureImage
                    component="img"
                    image={feature.image}
                    alt={feature.title}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </FeatureSection>
              </Box>
            ))}
          </CarouselTrack>
          <ArrowButton onClick={handleNext} sx={{ right: 5 }}>
            <ArrowForwardIosIcon />
          </ArrowButton>
        </CarouselContainer>

        {/* App Promotion Section */}
        <FeatureSection
          sx={{
            py: 6,
            px: 0,
            backgroundColor: "transparent",
            boxShadow: "none",
            "&:hover": {
              scale: 1,
            },
          }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" fontWeight="bold" sx={{ pr: 8 }}>
                Mỗi lớp học, mỗi bài kiểm tra, một ứng dụng học tập tối ưu
              </Typography>
              <Typography
                variant="h5"
                color="text.secondary"
                fontWeight="normal"
                sx={{ py: 6 }}
              >
                Tạo thẻ ghi nhớ của riêng bạn hoặc tìm bộ do giáo viên, học sinh
                và chuyên gia tạo ra. Học mọi lúc, mọi nơi với ứng dụng miễn phí
                của chúng tôi.
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  sx={{
                    width: 130,
                    height: 40,
                    backgroundImage: `url("https://assets.quizlet.com/_next/static/media/apple.4170bb1a.png")`,
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    borderRadius: 1,
                    padding: 0,
                    minWidth: 0,
                  }}
                />
                <Button
                  sx={{
                    width: 130,
                    height: 40,
                    backgroundImage: `url("https://assets.quizlet.com/_next/static/media/google_play.fca45251.png")`,
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    borderRadius: 1,
                    padding: 0,
                    minWidth: 0,
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <FeatureImage
                component="img"
                image="https://images.prismic.io/quizlet-web/ZpWfER5LeNNTxK_S_flashcards-image.png?auto=format,compress"
                alt="App Preview"
                sx={{ width: "100%" }}
              />
            </Grid>
          </Grid>
        </FeatureSection>

        {/* Instant Study Material Section */}
        <FeatureSection
          sx={{
            py: 6,
            px: 0,
            backgroundColor: "transparent",
            boxShadow: "none",
            "&:hover": {
              scale: 1,
            },
          }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <FeatureImage
                component="img"
                image="https://images.prismic.io/quizlet-web/ZpWfEh5LeNNTxK_T_study-guides-image.png?auto=format,compress"
                alt="Study Material"
                sx={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h2" fontWeight="bold" sx={{ pr: 8 }}>
                Làm cho tài liệu lớp học có thể học ngay lập tức
              </Typography>
              <Typography
                variant="h5"
                color="text.secondary"
                fontWeight="normal"
                sx={{ py: 6 }}
              >
                Biến các slide, video và ghi chú của bạn thành bộ thẻ ghi nhớ,
                bài kiểm tra thực hành và hướng dẫn học tập.
              </Typography>
              <Button
                variant="text"
                sx={{
                  color: "#fff",
                  fontWeight: "bold",
                  borderRadius: "50px",
                  textTransform: "none",
                  px: 4,
                  py: 4,
                  fontSize: "1rem",
                  backgroundColor: "#4255ff",
                  border: "none",
                  "&:hover": {
                    backgroundColor: "#423ed8",
                  },
                }}
              >
                Hãy thử xem
              </Button>
            </Grid>
          </Grid>
        </FeatureSection>

        <FeatureSection
          sx={{
            py: 6,
            px: 0,
            backgroundColor: "transparent",
            boxShadow: "none",
            "&:hover": {
              scale: 1,
            },
          }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" fontWeight="bold" sx={{ pr: 8 }}>
                Chuẩn bị kiểm tra cho bất kỳ môn học nào
              </Typography>
              <Typography
                variant="h5"
                color="text.secondary"
                fontWeight="normal"
                sx={{ py: 6 }}
              >
                Ghi nhớ mọi thứ với các bài kiểm tra thực hành được cá nhân hóa
                và các buổi học trong Learn. 98% học sinh cho biết Quizlet đã
                cải thiện khả năng hiểu của họ.
              </Typography>
              <Button
                variant="text"
                sx={{
                  color: "#fff",
                  fontWeight: "bold",
                  borderRadius: "50px",
                  textTransform: "none",
                  px: 4,
                  py: 4,
                  fontSize: "1rem",
                  backgroundColor: "#4255ff",
                  border: "none",
                  "&:hover": {
                    backgroundColor: "#423ed8",
                  },
                }}
              >
                Bắt đầu
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <FeatureImage
                component="img"
                image="https://images.prismic.io/quizlet-web/ZpWfEx5LeNNTxK_U_learn-image.png?auto=format,compress"
                alt="Study Material"
                sx={{ width: "100%" }}
              />
            </Grid>
          </Grid>
        </FeatureSection>

        {/* Popular Articles */}
        <Box sx={{ textAlign: "center", mb: 6, px: 2 }}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
            Các bài báo phổ biến
          </Typography>
          {loading ? (
            <Typography variant="body1" color="text.secondary">
              Đang tải bài báo...
            </Typography>
          ) : error ? (
            <Typography variant="body1" color="error">
              {error}
            </Typography>
          ) : articles.length === 0 ? (
            <Typography variant="body1" color="text.secondary">
              Không có bài báo nào để hiển thị.
            </Typography>
          ) : (
            <>
              <Grid
                container
                spacing={2}
                justifyContent="center"
                sx={{ px: 6 }}
              >
                {visibleArticles.map((article, index) => (
                  <Grid item xs={12} sm={6} md={4} key={article.id}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: "background.paper",
                        boxShadow: 1,
                        transition: "box-shadow 0.3s ease, transform 0.3s ease",
                        "&:hover": {
                          boxShadow: 3,
                          transform: "translateY(-5px)",
                        },
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: "column",
                        gap: 6,
                        minHeight: "200px",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 2,
                          maxWidth: "300px",
                        }}
                      >
                        <Box sx={{ textAlign: "left", maxHeight: "4.75rem" }}>
                          <Typography
                            component="div"
                            fontWeight="bold"
                            sx={{ mb: 2 }}
                          >
                            {article.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              border: "1px #ccc",
                              borderRadius: 4,
                              py: 0.2,
                              px: 0.5,
                              fontSize: ".75rem",
                              width: "fit-content",
                              backgroundColor: "#edefff",
                            }}
                          >
                            {article.tags.join(", ")}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            height: "64px",
                            width: "64px",
                            backgroundImage: `url(${article.image})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            borderRadius: 1,
                          }}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {article.content}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mt: 3,
                }}
              >
                <IconButton
                  onClick={handlePrevPage}
                  sx={{ mx: 20, borderRadius: 20 }}
                >
                  <ArrowBackIosIcon />
                </IconButton>
                <Typography variant="body1">
                  {currentPage}/{totalPages}
                </Typography>
                <IconButton
                  onClick={handleNextPage}
                  sx={{ mx: 20, borderRadius: 20 }}
                >
                  <ArrowForwardIosIcon />
                </IconButton>
              </Box>
            </>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default PublicHomePage;
