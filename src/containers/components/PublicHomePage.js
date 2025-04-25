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
  Paper,
  Chip,
  Pagination,
  Alert,
  AlertTitle,
  CircularProgress,
} from "@mui/material";
import { styled, keyframes } from "@mui/system";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { fetchArticleApi } from "../../services/ArticleService";
import {
  ArrowForward,
  HourglassEmpty,
  LibraryBooks,
  School,
} from "@mui/icons-material";

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
        paddingTop: 16,
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
          <Typography
            variant="h4"
            color="text.secondary"
            fontWeight="normal"
            sx={{ mb: 3 }}
          >
            Nắm vững những kiến ​​thức bạn đang học với các thẻ ghi nhớ tương
            tác, bài kiểm tra thực hành và hoạt động học tập của ReadUp.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ borderRadius: "50px", textTransform: "none", px: 4 }}
            onClick={() => navigate("/register")}
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
            Được hàng triệu người tin tưởng
          </Typography>
          <Typography
            variant="h4"
            color="text.secondary"
            fontWeight="normal"
            sx={{ mb: 3 }}
          >
            Mọi người đều tin tưởng vào ReadUp và chúng tôi không bao giờ làm họ
            thất vọng.
          </Typography>
        </Box>

        <Grid
          container
          spacing={3}
          sx={{ pb: 2, maxHeight: "50rem", overflow: "hidden" }}
        >
          {/* Statistic 1: 3M+ Users */}
          <Grid item xs={12} sm={4}>
            <FeatureSection sx={{ p: 3, textAlign: "center", height: "100%" }}>
              <Typography variant="h3" fontWeight="bold">
                3M +
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Người dùng là học sinh và giáo viên
              </Typography>
            </FeatureSection>
          </Grid>

          {/* Statistic 2: 5M+ Notes */}
          <Grid item xs={12} sm={4}>
            <FeatureSection sx={{ p: 3, textAlign: "center", height: "100%" }}>
              <Typography variant="h3" fontWeight="bold">
                5M +
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Bài báo hay đã được tạo
              </Typography>
            </FeatureSection>
          </Grid>

          {/* Statistic 3: 10M+ Sets */}
          <Grid item xs={12} sm={4}>
            <FeatureSection sx={{ p: 3, textAlign: "center", height: "100%" }}>
              <Typography variant="h3" fontWeight="bold">
                10M +
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Từ vựng đã được thêm
              </Typography>
            </FeatureSection>
          </Grid>

          {/* Testimonial 1 */}
          <Grid
            item
            xs={12}
            sm={4}
            sx={{ display: { xs: "none", sm: "none", md: "flex" } }}
          >
            <FeatureSection sx={{ p: 3, textAlign: "center" }}>
              <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
                {[...Array(5)].map((_, i) => (
                  <span key={i}>⭐</span>
                ))}
              </Box>
              <Typography variant="h6" fontWeight="bold">
                Một cứu cánh trong học tập
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ngay cả khi Quizlet không còn là dịch vụ miễn phí nữa, tôi vẫn
                phải nói rằng tôi sẽ chọn ReadUp. Nhìn chung, đây là một nguồn
                tài nguyên tuyệt vời cho học sinh.
              </Typography>
            </FeatureSection>
          </Grid>

          {/* Testimonial 2 */}
          <Grid
            item
            xs={12}
            sm={4}
            sx={{ display: { xs: "none", sm: "none", md: "flex" } }}
          >
            <FeatureSection sx={{ p: 3, textAlign: "center" }}>
              <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
                {[...Array(5)].map((_, i) => (
                  <span key={i}>⭐</span>
                ))}
              </Box>
              <Typography variant="h6" fontWeight="bold">
                ReadUp là phiên bản rẻ hơn, trẻ hơn, hấp dẫn hơn và tuyệt vời
                hơn!!!
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tôi thích ReadUp, phiên bản miễn phí tốt hơn nhiều so với
                Quizlet. Đây là một ứng dụng tuyệt vời và tôi thực sự khuyên
                dùng
              </Typography>
            </FeatureSection>
          </Grid>

          {/* Testimonial 3 */}
          <Grid
            item
            xs={12}
            sm={4}
            sx={{ display: { xs: "none", sm: "none", md: "flex" } }}
          >
            <FeatureSection sx={{ p: 3, textAlign: "center" }}>
              <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
                {[...Array(5)].map((_, i) => (
                  <span key={i}>⭐</span>
                ))}
              </Box>
              <Typography variant="h6" fontWeight="bold">
                Ứng dụng tuyệt vời!
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Có rất nhiều tài nguyên tuyệt vời được tạo sẵn như ghi chú và
                thẻ ghi nhớ và tất cả đều miễn phí sử dụng, không giống như một
                số ứng dụng thẻ ghi nhớ khác (tôi đang nói đến Quizlet). Tôi rất
                biết ơn những nhà phát triển ReadUp, cảm ơn các bạn!
              </Typography>
            </FeatureSection>
          </Grid>

          {/* Testimonial 4 */}
          <Grid
            item
            xs={12}
            sm={4}
            sx={{ display: { xs: "none", sm: "none", md: "flex" } }}
          >
            <FeatureSection sx={{ p: 3, textAlign: "center" }}>
              <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
                {[...Array(5)].map((_, i) => (
                  <span key={i}>⭐</span>
                ))}
              </Box>
              <Typography variant="h6" fontWeight="bold">
                Cứu tôi khỏi rắc rối
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ứng dụng này thực sự đã cứu tôi. Tôi không phải là một học sinh
                giỏi và đây là lý do duy nhất khiến tôi vượt qua các lớp học của
                mình
              </Typography>
            </FeatureSection>
          </Grid>

          {/* Testimonial 5 */}
          <Grid
            item
            xs={12}
            sm={4}
            sx={{ display: { xs: "none", sm: "none", md: "flex" } }}
          >
            <FeatureSection sx={{ p: 3, textAlign: "center" }}>
              <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
                {[...Array(5)].map((_, i) => (
                  <span key={i}>⭐</span>
                ))}
              </Box>
              <Typography variant="h6" fontWeight="bold">
                Thử ứng dụng này đi, tuyệt vời lắm!
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tôi chưa bao giờ trong đời viết bài đánh giá cho bất kỳ ứng dụng
                nào nhưng tôi thực sự rất thích ReadUp. Tôi đã giới thiệu nó cho
                tất cả bạn bè của tôi và họ đều đồng ý rằng nó là một cứu cánh.
              </Typography>
            </FeatureSection>
          </Grid>

          {/* Testimonial 6 */}
          <Grid
            item
            xs={12}
            sm={4}
            sx={{ display: { xs: "none", sm: "none", md: "flex" } }}
          >
            <FeatureSection sx={{ p: 3, textAlign: "center" }}>
              <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
                {[...Array(5)].map((_, i) => (
                  <span key={i}>⭐</span>
                ))}
              </Box>
              <Typography variant="h6" fontWeight="bold">
                Cái này rất cần thiết phải có trong 'bộ dụng cụ sống sót ở
                trường học' của bạn" 😄
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tôi hy vọng bất kỳ ai đọc bài viết này có thể cùng tôi và nhiều
                người dùng khác chuyển từ Quizlet hoặc các đối thủ cạnh tranh
                khác sang ReadUp! Cảm ơn bạn rất nhiều vì mọi thứ, ReadUp! thực
                sự là một trong những ứng dụng tuyệt vời nhất từ ​​trước đến
                nay.
              </Typography>
            </FeatureSection>
          </Grid>
        </Grid>

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
                onClick={() => navigate("/register")}
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
                và các buổi học trong Learn. 98% học sinh cho biết ReadUp đã cải
                thiện khả năng hiểu của họ.
              </Typography>
              <Button
                variant="text"
                onClick={() => navigate("/register")}
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

        <Box
          sx={{
            textAlign: "center",
            py: 4,
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
            Tại sao nên sử dụng ReadUp?
          </Typography>
          <Typography
            variant="h4"
            color="text.secondary"
            fontWeight="normal"
            sx={{ mb: 3 }}
          >
            Chúng tôi hiểu rằng việc lựa chọn công cụ AI phù hợp khó khăn như
            thế nào nên chúng tôi muốn đưa ra quyết định dễ dàng.
          </Typography>
          {/* New Feature Cards Section */}
          <Grid container spacing={3} sx={{ mb: 6 }}>
            {/* Feature Card 1: Free Study Mode */}
            <Grid item xs={12} sm={4}>
              <FeatureSection sx={{ p: 3, textAlign: "left", height: "100%" }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "left",
                    gap: "1.4rem",
                  }}
                >
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: "8px",
                      backgroundColor: "#f6e2e2",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 2,
                    }}
                  >
                    <HourglassEmpty sx={{ fontSize: "28px" }} />
                  </Box>
                  <Typography variant="h6" fontWeight="bold">
                    Chế độ học miễn phí
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Khi bạn tham gia chương trình thử điểm, bạn sẽ nhận được
                    giấy phép không giới hạn MIỄN PHÍ cho chương trình của mình
                    trong 6 tháng. Hãy để họ dùng thử để đảm bảo rằng họ thực sự
                    yêu thích Knowt trước khi quyết định.
                  </Typography>
                </Box>
              </FeatureSection>
            </Grid>

            {/* Feature Card 2: Free Quizlet Alternative */}
            <Grid item xs={12} sm={4}>
              <FeatureSection sx={{ p: 3, textAlign: "left", height: "100%" }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "left",
                    gap: "1.4rem",
                  }}
                >
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: "8px",
                      backgroundColor: "#e2edf6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 2,
                    }}
                  >
                    <LibraryBooks sx={{ fontSize: "28px" }} />
                  </Box>
                  <Typography variant="h6" fontWeight="bold">
                    Quizlet thay thế miễn phí duy nhất bạn cần
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Sau khi chương trình thử nghiệm kết thúc, nếu bạn chọn tiếp
                    tục sử dụng Knowt, bạn sẽ tự động được hướng dẫn những gì rẻ
                    hơn 50% so với các công cụ AI khác trong ngành tối.
                  </Typography>
                </Box>
              </FeatureSection>
            </Grid>

            {/* Feature Card 3: Web Page for Notes */}
            <Grid item xs={12} sm={4}>
              <FeatureSection sx={{ p: 3, textAlign: "left", height: "100%" }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "left",
                    gap: "1.4rem",
                  }}
                >
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: "8px",
                      backgroundColor: "#ede2f6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 2,
                    }}
                  >
                    <School sx={{ fontSize: "28px" }} />
                  </Box>
                  <Typography variant="h6" fontWeight="bold">
                    Một trang web để ghi chú, thẻ ghi nhớ và nhiều hơn nữa
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Nhánh chức năng của Magic School, Nhánh chức năng của
                    Quizlet, Quizizz, Brisk AI và SchoolAI trong một cộng cụ. Ít
                    công cụ hơn để quản lý – một PO và một bảng điều khiển để
                    quản lý mọi thứ
                  </Typography>
                </Box>
              </FeatureSection>
            </Grid>
          </Grid>
        </Box>

        <Box
          sx={{
            textAlign: "center",
            maxWidth: "md",
            px: 4,
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
            Ồ, bạn là một nhà thám hiểm à?
          </Typography>
          <Typography
            variant="h4"
            color="text.secondary"
            fontWeight="normal"
            sx={{ mb: 3 }}
          >
            Chúng tôi có hơn 2 triệu tài nguyên cho nhiều bài báo và câu hỏi khác
            nhau để bạn tham khảo bất cứ lúc nào.
          </Typography>
        </Box>

        <Box sx={{ textAlign: "center", mb: 8, px: { xs: 2, md: 4 } }}>
          <Typography
            variant="h4"
            fontWeight="700"
            sx={{
              mb: 4,
              position: "relative",
              display: "inline-block",
              "&:after": {
                content: '""',
                position: "absolute",
                bottom: -10,
                left: "50%",
                transform: "translateX(-50%)",
                width: "60px",
                height: "4px",
                backgroundColor: "primary.main",
                borderRadius: "2px",
              },
            }}
          >
            Các bài báo phổ biến
          </Typography>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress size={40} />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
              <AlertTitle>Lỗi</AlertTitle>
              {error}
            </Alert>
          ) : articles.length === 0 ? (
            <Alert severity="info" sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
              <AlertTitle>Thông báo</AlertTitle>
              Không có bài báo nào để hiển thị.
            </Alert>
          ) : (
            <>
              <Grid
                container
                spacing={3}
                justifyContent="center"
                sx={{ px: { xs: 2, md: 6 }, mt: 2 }}
              >
                {visibleArticles.map((article) => (
                  <Grid item xs={12} sm={6} md={4} key={article.id}>
                    <Paper
                      elevation={0}
                      sx={{
                        borderRadius: 3,
                        overflow: "hidden",
                        height: "100%",
                        transition: "all 0.3s ease",
                        border: "1px solid",
                        borderColor: "divider",
                        "&:hover": {
                          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                          transform: "translateY(-6px)",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          height: 180,
                          backgroundImage: `url(${article.image_url})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          position: "relative",
                        }}
                      >
                        {/* Thêm gradient overlay để nổi bật văn bản */}
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            p: 2,
                            background:
                              "linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0))",
                          }}
                        >
                          {article.tags && article.tags.length > 0 && (
                            <Chip
                              label={article.tags[0]}
                              size="small"
                              sx={{
                                backgroundColor: "primary.main",
                                color: "white",
                                fontWeight: 500,
                                mb: 1,
                              }}
                            />
                          )}
                        </Box>
                      </Box>

                      <Box sx={{ p: 3 }}>
                        <Typography
                          variant="h6"
                          fontWeight="600"
                          sx={{
                            mb: 2,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            lineHeight: 1.4,
                            height: "2.8em",
                          }}
                        >
                          {article.title}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            mb: 2,
                            height: "4.5em",
                          }}
                        >
                          {article.content}
                        </Typography>

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mt: 2,
                          }}
                        >
                          <Button
                            variant="text"
                            endIcon={<ArrowForwardIosIcon fontSize="small" />}
                            sx={{ fontWeight: 500, p: 0 }}
                            onClick={() => navigate(`/articles/${article.id}`)}
                          >
                            Đọc thêm
                          </Button>

                          {article.date && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {new Date(article.date).toLocaleDateString(
                                "vi-VN"
                              )}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mt: 5,
                  mb: 2,
                }}
              >
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(e, page) => {
                    if (page < currentPage) {
                      handlePrevPage();
                    } else if (page > currentPage) {
                      handleNextPage();
                    }
                  }}
                  variant="outlined"
                  shape="rounded"
                  size="large"
                  sx={{
                    "& .MuiPaginationItem-root": {
                      mx: 0.5,
                    },
                  }}
                />
              </Box>
            </>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default PublicHomePage;
