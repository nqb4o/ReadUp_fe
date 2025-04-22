import React, { useState, useEffect, useRef } from "react";
import {
    Box,
    Typography,
    Container,
    Card,
    CardContent,
    Stack,
    Button,
    Grid,
    styled,
    alpha,
    CardMedia,
    CircularProgress,
} from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { handleGetVocabularyByUserId } from "../../services/VocabularyServices"; // Import API service

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
    animationFillMode: "forwards",
    opacity: 1,
    backgroundColor: "#f7d9ff",
}));

const FeatureImage = styled(CardMedia)(({ theme }) => ({
    borderRadius: theme.spacing(1),
    transition: "transform 0.3s ease",
}));

// Styled component for flashcard with hover effect
const FlashCardItem = styled(Card)(({ theme }) => ({
    position: "relative",
    borderRadius: theme.spacing(1),
    minHeight: "200px", // Larger card
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    boxShadow: theme.shadows[3],
    "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: theme.shadows[8],
        "&:after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "2px",
            backgroundColor: "#a855f7",
        },
    },
}));

const FlashCard = () => {
    const [flashcardData, setFlashcardData] = useState([]);
    const [showDetails, setShowDetails] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [translatedText, setTranslatedText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Fetch vocabulary data from API
    useEffect(() => {
        const fetchVocabulary = async () => {
            const userData = JSON.parse(sessionStorage.getItem("user") || "{}");
            const user_id = userData.id;
            setIsFetching(true);
            try {
                const response = await handleGetVocabularyByUserId(user_id);
                const data = response.data.map((item) => ({
                    word: item.word,
                    id: item.id,
                    user_id: item.user_id,
                    article_id: item.article_id,
                }));
                setFlashcardData(data);
            } catch (err) {
                setError("Không thể tải dữ liệu thẻ ghi nhớ. Vui lòng thử lại sau.");
            } finally {
                setIsFetching(false);
            }
        };

        fetchVocabulary();
    }, []);

    // Translation function using MyMemory API
    const translateText = async (text) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(
                `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
                    text
                )}&langpair=en|vi`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch translation");
            }

            const data = await response.json();
            if (data.responseStatus !== 200) {
                throw new Error("Translation API error: " + data.responseDetails);
            }

            setTranslatedText(data.responseData.translatedText);
        } catch (err) {
            setError("Không thể dịch. Vui lòng thử lại sau.");
            setTranslatedText("");
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleDetails = (card, index) => {
        if (selectedCard && selectedCard.index === index) {
            setSelectedCard(null);
            setTranslatedText("");
            setShowDetails(false);
        } else {
            setSelectedCard({ ...card, index });
            setShowDetails(true);
            translateText(card.word);
        }
    };

    return (
        <>
            {/* First Section */}
            <Box
                sx={{
                    backgroundColor: "#f7d9ff",
                    width: "100vw",
                    position: "relative",
                    left: "50%",
                    right: "50%",
                    marginLeft: "-50vw",
                    marginRight: "-50vw",
                    paddingTop: 16,
                }}
            >
                <Container maxWidth="lg">
                    <FeatureSection
                        sx={{
                            px: 4,
                            backgroundColor: "transparent",
                            boxShadow: "none",
                            "&:hover": {
                                scale: 1,
                            },
                        }}
                    >
                        <Grid container spacing={4} alignItems="center">
                            <Grid item xs={12} md={6} sx={{}}>
                                <Typography variant="h2" fontWeight="bold">
                                    Cách dễ nhất để tạo và học thẻ ghi nhớ
                                </Typography>
                                <Typography
                                    variant="h5"
                                    color="text.secondary"
                                    fontWeight="normal"
                                    sx={{ py: 6 }}
                                >
                                    Một cách học tốt hơn với thẻ ghi nhớ là đây. ReadUp giúp bạn
                                    dễ dàng tạo thẻ ghi nhớ của riêng mình, học thẻ ghi nhớ của
                                    bạn cùng lớp hoặc tìm kiếm kho lưu trữ hàng triệu bộ thẻ ghi
                                    nhớ của những học viên khác.
                                </Typography>
                                <Box
                                    sx={{
                                        borderRadius: 2,
                                        mb: 4,
                                    }}
                                >
                                    <Stack spacing={4}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                            <Box
                                                component="img"
                                                src="https://quizlet-web.cdn.prismic.io/quizlet-web/3c1640b2-5e1f-4df0-bac0-e406938e3bb7_flashcards-creation.svg"
                                                alt="Flashcard Icon"
                                                sx={{ width: 40, height: 40 }}
                                            />
                                            <Box>
                                                <Typography variant="h6" fontWeight="bold">
                                                    Hơn 500 triệu
                                                </Typography>
                                                <Typography variant="body1" color="text.secondary">
                                                    thẻ ghi nhớ được tạo ra
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                            <Box
                                                component="img"
                                                src="https://quizlet-web.cdn.prismic.io/quizlet-web/d4ae460c-90b4-4931-9135-f122f2b01666_flashcards-exam.svg"
                                                alt="Student Icon"
                                                sx={{ width: 40, height: 40 }}
                                            />
                                            <Box>
                                                <Typography variant="h6" fontWeight="bold">
                                                    90% sinh viên
                                                </Typography>
                                                <Typography variant="body1" color="text.secondary">
                                                    những người sử dụng ReadUp báo cáo nhận được điểm cao
                                                    hơn
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                            <Box
                                                component="img"
                                                src="https://quizlet-web.cdn.prismic.io/quizlet-web/7bd74689-c864-49bb-90bd-2dca72adeb67_flashcards-study.svg"
                                                alt="Online Learning Icon"
                                                sx={{ width: 40, height: 40 }}
                                            />
                                            <Box>
                                                <Typography variant="h6" fontWeight="bold">
                                                    Phổ biến nhất
                                                </Typography>
                                                <Typography variant="body1" color="text.secondary">
                                                    công cụ học trực tuyến tại Hoa Kỳ
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Stack>
                                </Box>
                                <Button
                                    variant="text"
                                    onClick={() => navigate("/login")}
                                    sx={{
                                        color: "#fff",
                                        fontWeight: "bold",
                                        borderRadius: "50px",
                                        textTransform: "none",
                                        px: 4,
                                        py: 3,
                                        fontSize: "1rem",
                                        backgroundColor: "#4255ff",
                                        border: "none",
                                        "&:hover": {
                                            backgroundColor: "#423ed8",
                                        },
                                    }}
                                >
                                    Tạo một bộ thẻ ghi nhớ
                                </Button>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FeatureImage
                                    component="img"
                                    image="https://images.prismic.io/quizlet-web/YWZjMDdiMzQtZjNkOS00YTFiLWE1N2QtNzIxMjNhOGM2NjA2_ee031c32-3c69-4b72-9a97-d1ffdc4db9af_04flashcards.gif?auto=compress,format&rect=0,0,800,1079&w=800&h=1079"
                                    alt="Study Material"
                                    sx={{ width: "100%" }}
                                />
                            </Grid>
                        </Grid>
                    </FeatureSection>
                </Container>
            </Box >

            {/* Second Section */}
            < Box
                sx={{
                    backgroundColor: "#fff",
                    width: "100vw",
                    position: "relative",
                    left: "50%",
                    right: "50%",
                    marginLeft: "-50vw",
                    marginRight: "-50vw",
                }
                }
            >
                <Container maxWidth="lg">
                    <FeatureSection
                        sx={{
                            px: 4,
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
                                    image="https://images.prismic.io/quizlet-web/NjY5ODJkY2MtMGNmMi00ZjI2LWIyMjEtMDc0MzE5YWMzNzdh_31c85d7d-9e36-40a4-9fae-5027c355ddee_flashcards-1.gif?auto=compress,format&rect=0,0,1000,680&w=1000&h=680"
                                    alt="Study Material"
                                    sx={{ width: "100%" }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h2" fontWeight="bold" sx={{ pr: 8 }}>
                                    Làm thẻ ghi nhớ
                                </Typography>
                                <Typography
                                    variant="h5"
                                    color="text.secondary"
                                    fontWeight="normal"
                                    sx={{ py: 6 }}
                                >
                                    Tạo bộ thẻ ghi nhớ của riêng bạn thật đơn giản với trình tạo
                                    thẻ ghi nhớ miễn phí của chúng tôi — chỉ cần thêm một thuật
                                    ngữ và định nghĩa. Bạn thậm chí có thể thêm một hình ảnh từ
                                    thư viện của chúng tôi. Sau khi bộ thẻ ghi nhớ của bạn hoàn
                                    tất, bạn có thể học và chia sẻ với bạn bè.
                                </Typography>
                            </Grid>
                        </Grid>
                    </FeatureSection>
                </Container>
            </Box >

            {/* Third Section */}
            < Box
                sx={{
                    backgroundColor: "transparent",
                    width: "100vw",
                    position: "relative",
                    left: "50%",
                    right: "50%",
                    marginLeft: "-50vw",
                    marginRight: "-50vw",
                }}
            >
                <Container maxWidth="lg">
                    <FeatureSection
                        sx={{
                            px: 4,
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
                                    Tìm thẻ ghi nhớ trực tuyến
                                </Typography>
                                <Typography
                                    variant="h5"
                                    color="text.secondary"
                                    fontWeight="normal"
                                    sx={{ py: 6 }}
                                >
                                    Bạn cần thẻ ghi nhớ để ghi nhớ từ vựng, phương trình hoặc giải
                                    phẫu? Với hàng triệu thẻ ghi nhớ đã được các học sinh và giáo
                                    viên khác tạo ra, bạn có thể tìm thấy thẻ ghi nhớ miễn phí cho
                                    bất kỳ môn học nào trên ReadUp.
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FeatureImage
                                    component="img"
                                    image="https://images.prismic.io/quizlet-web/ZGI4ZTI1ZWUtYzI2MC00NWIyLWExNzMtNzlhMDNjYTkxYWQ1_413f92d0-ab2e-48bf-b90c-dc2d53540504_fromuni.png?auto=compress,format&rect=0,0,1001,1000&w=1001&h=1000"
                                    alt="Study Material"
                                    sx={{ width: "100%" }}
                                />
                            </Grid>
                        </Grid>
                    </FeatureSection>
                </Container>
            </Box >

            {/* Explore Flashcards Section */}
            {/* <Container maxWidth="lg">
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{ mb: 4, textAlign: "center" }}
        >
          Khám phá thẻ ghi nhớ
        </Typography>
        {isFetching ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" textAlign="center" sx={{ my: 4 }}>
            {error}
          </Typography>
        ) : flashcardData.length === 0 ? (
          <Typography textAlign="center" sx={{ my: 4 }}>
            Không có thẻ ghi nhớ nào được tìm thấy.
          </Typography>
        ) : (
          <Grid container spacing={3} sx={{ px: 10 }}>
            {flashcardData.map((card, index) => (
              <Grid item xs={12} sm={6} md={4} key={card.id}>
                <FlashCardItem onClick={() => handleToggleDetails(card, index)}>
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      minHeight: "200px",
                      textAlign: "center",
                    }}
                  >
                    {selectedCard &&
                    selectedCard.index === index &&
                    showDetails ? (
                      <Box>
                        {isLoading ? (
                          <CircularProgress size={24} />
                        ) : error ? (
                          <Typography color="error">{error}</Typography>
                        ) : (
                          <Typography
                            variant="h4"
                            component="h1"
                            fontWeight="bold"
                            textAlign="center"
                          >
                            {translatedText}
                          </Typography>
                        )}
                      </Box>
                    ) : (
                      <Typography
                        variant="h4"
                        component="h1"
                        fontWeight="bold"
                        textAlign="center"
                      >
                        {card.word}
                      </Typography>
                    )}
                  </CardContent>
                </FlashCardItem>
              </Grid>
            ))}
          </Grid>
        )}
        <Box
          sx={{ display: "flex", justifyContent: "center", padding: "4rem" }}
        >
          <Button
            variant="text"
            onClick={handleSearchFlashcards}
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
            Tìm kiếm thẻ ghi nhớ
          </Button>
        </Box>
      </Container> */}

            <Box
                sx={{
                    backgroundColor: "#fff",
                    width: "100vw",
                    position: "relative",
                    left: "50%",
                    right: "50%",
                    marginLeft: "-50vw",
                    marginRight: "-50vw",
                }}
            >
                <Container maxWidth="lg">
                    <FeatureSection
                        sx={{
                            px: 4,
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
                                    image="https://images.prismic.io/quizlet-web/NWM1MDNiYzQtY2JjYy00ZjRkLTgyNmEtOGY4ZjBmZTc3MDNi_1d359d1f-be06-481d-af18-30a4d93b3b0f_commute-image.png?auto=compress,format&rect=0,0,1001,1000&w=1001&h=1000"
                                    alt="App Preview"
                                    sx={{ width: "100%" }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h2" fontWeight="bold" sx={{ pr: 8 }}>
                                    Học với ứng dụng thẻ ghi nhớ của chúng tôi
                                </Typography>
                                <Typography
                                    variant="h5"
                                    color="text.secondary"
                                    fontWeight="normal"
                                    sx={{ py: 6 }}
                                >
                                    Mang thẻ ghi nhớ của bạn đi bất cứ đâu với ứng dụng miễn phí
                                    ReadUp. Sử dụng chế độ vuốt để xem lại thẻ ghi nhớ nhanh chóng
                                    và khiến việc học trở nên hấp dẫn hơn. Vuốt sang phải nếu bạn
                                    biết, vuốt sang trái nếu bạn không biết — và học những gì bạn
                                    cần tập trung vào.
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
                        </Grid>
                    </FeatureSection>
                </Container>
            </Box>

            <Box
                sx={{
                    backgroundColor: "transparent",
                    width: "100vw",
                    position: "relative",
                    left: "50%",
                    right: "50%",
                    marginLeft: "-50vw",
                    marginRight: "-50vw",
                }}
            >
                <Container maxWidth="lg">
                    <FeatureSection
                        sx={{
                            px: 4,
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
                                    Làm nhiều hơn với thẻ ghi nhớ của bạn
                                </Typography>
                                <Typography
                                    variant="h5"
                                    color="text.secondary"
                                    fontWeight="normal"
                                    sx={{ py: 6 }}
                                >
                                    Trên ReadUp, bạn có thể làm nhiều hơn là lật thẻ ghi nhớ. Với
                                    4 chế độ học để lựa chọn, có một tùy chọn cho mọi người học.
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
                                    Tìm hiểu thêm về chế độn FlashCards
                                </Button>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FeatureImage
                                    component="img"
                                    image="https://images.prismic.io/quizlet-web/ZGU5NGZkZTAtNzRlOS00MWUxLWI1YmUtOTQ1ZjkzMmE2YjZl_7ae82b39-4edc-4d12-963e-cc864b6d9a05_learnandtest-mobile2.gif?auto=compress,format&rect=0,0,800,593&w=800&h=593"
                                    alt="Study Material"
                                    sx={{ width: "100%" }}
                                />
                            </Grid>
                        </Grid>
                    </FeatureSection>
                </Container>
            </Box>
        </>
    );
};

export default FlashCard;