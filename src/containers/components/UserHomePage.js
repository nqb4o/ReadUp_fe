import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Divider,
    CircularProgress,
    CardMedia,
    IconButton,
} from "@mui/material";
import { styled } from "@mui/system";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { fetchArticleApi } from "../../services/ArticleService";
import { handleGetVocabularyByUserId } from "../../services/VocabularyServices";
import { getQuizQuestionApi } from "../../services/QuizService"; // Adjust path as needed
import { useNavigate } from 'react-router-dom'; // Correctly import useNavigate

// Styled FlashcardSetCard with flip animation and hover after effect
const FlashcardSetCard = styled(Card)(({ theme, isQuestionCard }) => ({
    borderRadius: theme.spacing(1),
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    padding: theme.spacing(3),
    backgroundColor: "#f9fafb",
    minHeight: 120,
    height: isQuestionCard ? 260 : "auto",
    position: "relative",
    perspective: isQuestionCard ? "none" : "1000px",
    cursor: isQuestionCard ? "default" : "pointer",
    display: "flex",
    flexDirection: "column",
    "&:hover": {
        transform: isQuestionCard ? "none" : "translateY(-5px)",
        boxShadow: isQuestionCard
            ? "0 2px 8px rgba(0, 0, 0, 0.1)"
            : "0 4px 12px rgba(0, 0, 0, 0.15)",
    },
    "&:after": {
        content: '""',
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "4px",
        backgroundColor: "#a8b1ff",
        opacity: isQuestionCard ? 0 : 1,
        transition: "opacity 0.3s ease",
    },
    "&:hover:after": {
        opacity: isQuestionCard ? 0 : 1,
    },
    [theme.breakpoints.down("sm")]: {
        padding: theme.spacing(2),
        minHeight: isQuestionCard ? 240 : 100,
        height: isQuestionCard ? 240 : "auto",
    },
}));

// Styled CardContent for flip effect
const FlipCardInner = styled(Box)(({ flipped }) => ({
    position: "relative",
    width: "100%",
    height: "100%",
    textAlign: "center",
    transition: "transform 0.6s",
    transformStyle: "preserve-3d",
    transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
}));

// Styled Front and Back faces
const CardFace = styled(Box)(({ theme }) => ({
    position: "absolute",
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
    borderRadius: theme.spacing(1),
    backgroundColor: "#f9fafb",
}));

const CardBack = styled(CardFace)({
    transform: "rotateY(180deg)",
});

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

// Styled Containers for hover effect
const ArticlesContainer = styled(Box)(({ theme }) => ({
    position: "relative",
    "&:hover .nav-buttons": {
        opacity: 1,
    },
}));

const FlashcardsContainer = styled(Box)(({ theme }) => ({
    position: "relative",
    "&:hover .nav-buttons": {
        opacity: 1,
    },
}));

const QuestionsContainer = styled(Box)(({ theme }) => ({
    position: "relative",
    "&:hover .nav-buttons": {
        opacity: 1,
    },
}));

// Styled Navigation Buttons
const NavButton = styled(IconButton)(({ theme }) => ({
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    backgroundColor: "#fff",
    color: "#333",
    border: "1px solid #d9dde8",
    borderRadius: "50%",
    opacity: 0,
    transition: "opacity 0.3s ease",
    "&:hover": {
        backgroundColor: "#f5f5f5",
        borderColor: "#b0b7c3",
    },
    "&:disabled": {
        backgroundColor: "#f0f0f0",
        color: "#999",
        borderColor: "#e0e0e0",
    },
    [theme.breakpoints.down("md")]: {
        opacity: 1,
    },
}));

const PrevButton = styled(NavButton)({
    left: "-25px",
});

const NextButton = styled(NavButton)({
    right: "-25px",
});

// Function to shuffle array (for randomizing answer options)
const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

const UserHomePage = () => {
    const [flashcardData, setFlashcardData] = useState([]);
    const [flashcardFetchError, setFlashcardFetchError] = useState(null);
    const [isFetchingFlashcards, setIsFetchingFlashcards] = useState(false);
    const [articleData, setArticleData] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState(null);
    const [quizData, setQuizData] = useState([]);
    const [isFetchingQuizzes, setIsFetchingQuizzes] = useState(false);
    const [quizFetchError, setQuizFetchError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [currentFlashcardPage, setCurrentFlashcardPage] = useState(0);
    const [currentQuestionPage, setCurrentQuestionPage] = useState(0);
    const [flashcardsPerPage, setFlashcardsPerPage] = useState(6);
    const [questionsPerPage, setQuestionsPerPage] = useState(3);
    const [translations, setTranslations] = useState({});
    const [loadingTranslations, setLoadingTranslations] = useState({});
    const [translationErrors, setTranslationErrors] = useState({});
    const [flippedCards, setFlippedCards] = useState({});
    const navigate = useNavigate(); // Directly assign the navigation function

    // Update flashcardsPerPage based on screen size
    const updateFlashcardsPerPage = () => {
        const width = window.innerWidth;
        if (width < 600) {
            setFlashcardsPerPage(2); // Mobile
        } else if (width < 900) {
            setFlashcardsPerPage(4); // Tablet
        } else {
            setFlashcardsPerPage(6); // PC
        }
        setCurrentFlashcardPage(0);
        setFlippedCards({});
    };

    // Update questionsPerPage based on screen size
    const updateQuestionsPerPage = () => {
        const width = window.innerWidth;
        if (width < 600) {
            setQuestionsPerPage(1); // Mobile
        } else if (width < 900) {
            setQuestionsPerPage(2); // Tablet
        } else {
            setQuestionsPerPage(3); // PC
        }
        setCurrentQuestionPage(0);
    };

    // Set initial per-page values and listen for resize
    useEffect(() => {
        updateFlashcardsPerPage();
        updateQuestionsPerPage();
        window.addEventListener("resize", updateFlashcardsPerPage);
        window.addEventListener("resize", updateQuestionsPerPage);
        return () => {
            window.removeEventListener("resize", updateFlashcardsPerPage);
            window.removeEventListener("resize", updateQuestionsPerPage);
        };
    }, []);

    // Fetch flashcards on component mount
    useEffect(() => {
        const fetchFlashcards = async () => {
            setIsFetchingFlashcards(true);
            const userData = JSON.parse(sessionStorage.getItem("user") || "{}");
            const user_id = userData.id;
            try {
                const response = await handleGetVocabularyByUserId(user_id);
                setFlashcardData(
                    response.data.data.map((item) => ({
                        id: item.id,
                        word: item.word,
                    }))
                );
                setFlashcardFetchError(null);
            } catch (err) {
                setFlashcardFetchError(
                    "Không thể tải thẻ ghi nhớ. Vui lòng thử lại sau."
                );
                setFlashcardData([]);
            } finally {
                setIsFetchingFlashcards(false);
            }
        };

        fetchFlashcards();
    }, []);

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

    // Fetch quizzes on component mount
    useEffect(() => {
        const fetchQuizzes = async () => {
            setIsFetchingQuizzes(true);
            try {
                const response = await getQuizQuestionApi();
                console.log("Quizzes response:", response.data); // Debugging line
                if (response.data.questions) {
                    setQuizData(response.data.questions);
                } else {
                    console.error("Unexpected response format for quizzes:", response.data);
                    setQuizData([]);
                }
                setQuizFetchError(null);
            } catch (err) {
                console.error("Error fetching quizzes:", err);
                setQuizFetchError("Không thể tải câu hỏi. Vui lòng thử lại sau.");
                setQuizData([]);
            } finally {
                setIsFetchingQuizzes(false);
            }
        };

        fetchQuizzes();
    }, []);

    // Function to fetch translation
    const translateText = async (text, id) => {
        setLoadingTranslations((prev) => ({ ...prev, [id]: true }));
        setTranslationErrors((prev) => ({ ...prev, [id]: null }));
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

            setTranslations((prev) => ({
                ...prev,
                [id]: data.responseData.translatedText,
            }));
            setFlippedCards((prev) => ({ ...prev, [id]: true }));
        } catch (err) {
            setTranslationErrors((prev) => ({
                ...prev,
                [id]: "Không thể dịch. Vui lòng thử lại sau.",
            }));
            setTranslations((prev) => ({ ...prev, [id]: "" }));
            setFlippedCards((prev) => ({ ...prev, [id]: true }));
        } finally {
            setLoadingTranslations((prev) => ({ ...prev, [id]: false }));
        }
    };

    // Handle card click
    const handleCardClick = (word, id) => {
        if (loadingTranslations[id]) return;
        if (!flippedCards[id] && !translations[id] && !translationErrors[id]) {
            translateText(word, id);
        } else {
            setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
        }
    };

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

    // Logic for article pagination
    const isMobileOrTablet = window.innerWidth < 900;
    const articlesPerPage = isMobileOrTablet ? 1 : 2;
    const totalPages = Math.ceil(articleData.length / articlesPerPage);
    const startIndex = currentPage * articlesPerPage;
    const currentArticles = articleData.slice(
        startIndex,
        startIndex + articlesPerPage
    );

    const handleNext = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrev = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Logic for flashcard pagination
    const totalFlashcardPages = Math.ceil(
        flashcardData.length / flashcardsPerPage
    );
    const flashcardStartIndex = currentFlashcardPage * flashcardsPerPage;
    const currentFlashcards = flashcardData.slice(
        flashcardStartIndex,
        flashcardStartIndex + flashcardsPerPage
    );

    const handleFlashcardNext = () => {
        if (currentFlashcardPage < totalFlashcardPages - 1) {
            setCurrentFlashcardPage(currentFlashcardPage + 1);
            setFlippedCards({});
        }
    };

    const handleFlashcardPrev = () => {
        if (currentFlashcardPage > 0) {
            setCurrentFlashcardPage(currentFlashcardPage - 1);
            setFlippedCards({});
        }
    };

    // Logic for question pagination
    const totalQuestionPages = Math.ceil(quizData.length / questionsPerPage);
    const questionStartIndex = currentQuestionPage * questionsPerPage;
    const currentQuestions = quizData.slice(
        questionStartIndex,
        questionStartIndex + questionsPerPage
    );

    const handleQuestionNext = () => {
        if (currentQuestionPage < totalQuestionPages - 1) {
            setCurrentQuestionPage(currentQuestionPage + 1);
        }
    };

    const handleQuestionPrev = () => {
        if (currentQuestionPage > 0) {
            setCurrentQuestionPage(currentQuestionPage - 1);
        }
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
                Bài báo gần đây
            </Typography>
            {isFetching ? (
                <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Typography color="error" textAlign="center" sx={{ my: 4 }}>
                    {error}
                </Typography>
            ) : articleData.length === 0 ? (
                <Typography textAlign="center" sx={{ my: 4, color: "#666" }}>
                    Không có bài báo nào được tìm thấy.
                </Typography>
            ) : (
                <ArticlesContainer>
                    <Grid container spacing={{ xs: 2, sm: 3 }}>
                        {currentArticles.map((article) => (
                            <Grid
                                item
                                xs={12}
                                sm={isMobileOrTablet ? 12 : 6}
                                key={article.id}
                            >
                                <ArticleCard onClick={() => navigate(`/articles/${article.id}`)} sx={{ cursor: 'pointer' }}>
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
                    {articleData.length > articlesPerPage && (
                        <>
                            <PrevButton
                                className="nav-buttons"
                                onClick={handlePrev}
                                disabled={currentPage === 0}
                            >
                                <ArrowBackIosIcon />
                            </PrevButton>
                            <NextButton
                                className="nav-buttons"
                                onClick={handleNext}
                                disabled={currentPage === totalPages - 1}
                            >
                                <ArrowForwardIosIcon />
                            </NextButton>
                        </>
                    )}
                </ArticlesContainer>
            )}

            <Divider sx={{ my: { xs: 3, sm: 4 } }} />

            {/* Popular Flashcard Sets Section */}
            <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ mb: 2, color: "#333", fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
            >
                Thẻ ghi nhớ của bạn
            </Typography>
            {isFetchingFlashcards ? (
                <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
                    <CircularProgress />
                </Box>
            ) : flashcardFetchError ? (
                <Typography color="error" textAlign="center" sx={{ my: 4 }}>
                    {flashcardFetchError}
                </Typography>
            ) : flashcardData.length === 0 ? (
                <Typography textAlign="center" sx={{ my: 4, color: "#666" }}>
                    Không có thẻ ghi nhớ nào được tìm thấy.
                </Typography>
            ) : (
                <FlashcardsContainer>
                    <Grid container spacing={{ xs: 2, sm: 3 }}>
                        {currentFlashcards.map((set) => (
                            <Grid item xs={6} sm={6} md={4} key={set.id}>
                                <FlashcardSetCard
                                    onClick={() => handleCardClick(set.word, set.id)}
                                >
                                    <FlipCardInner flipped={flippedCards[set.id] || false}>
                                        <CardFace>
                                            {loadingTranslations[set.id] ? (
                                                <CircularProgress size={24} sx={{ color: "#1976d2" }} />
                                            ) : (
                                                <Typography
                                                    variant="h6"
                                                    fontWeight="bold"
                                                    sx={{
                                                        color: "#333",
                                                        fontSize: { xs: "1rem", sm: "1.25rem" },
                                                    }}
                                                >
                                                    {set.word}
                                                </Typography>
                                            )}
                                        </CardFace>
                                        <CardBack>
                                            {translationErrors[set.id] ? (
                                                <Typography
                                                    variant="body2"
                                                    color="error"
                                                    sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
                                                >
                                                    {translationErrors[set.id]}
                                                </Typography>
                                            ) : (
                                                <Typography
                                                    variant="body2"
                                                    color="text.primary"
                                                    sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
                                                >
                                                    {translations[set.id] || "Đang dịch..."}
                                                </Typography>
                                            )}
                                        </CardBack>
                                    </FlipCardInner>
                                </FlashcardSetCard>
                            </Grid>
                        ))}
                    </Grid>
                    {flashcardData.length > flashcardsPerPage && (
                        <>
                            <PrevButton
                                className="nav-buttons"
                                onClick={handleFlashcardPrev}
                                disabled={currentFlashcardPage === 0}
                            >
                                <ArrowBackIosIcon />
                            </PrevButton>
                            <NextButton
                                className="nav-buttons"
                                onClick={handleFlashcardNext}
                                disabled={currentFlashcardPage === totalFlashcardPages - 1}
                            >
                                <ArrowForwardIosIcon />
                            </NextButton>
                        </>
                    )}
                </FlashcardsContainer>
            )}

            <Divider sx={{ my: { xs: 3, sm: 4 } }} />

            {/* Popular Questions Section */}
            <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ mb: 2, color: "#333", fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
            >
                Câu hỏi phổ biến
            </Typography>
            {isFetchingQuizzes ? (
                <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
                    <CircularProgress />
                </Box>
            ) : quizFetchError ? (
                <Typography color="error" textAlign="center" sx={{ my: 4 }}>
                    {quizFetchError}
                </Typography>
            ) : quizData.length === 0 ? (
                <Typography textAlign="center" sx={{ my: 4, color: "#666" }}>
                    Không có câu hỏi nào được tìm thấy.
                </Typography>
            ) : (
                <QuestionsContainer>
                    <Grid container spacing={{ xs: 2, sm: 3 }}>
                        {currentQuestions.map((question) => {
                            // Tạo mảng đáp án và trộn ngẫu nhiên
                            const options = shuffleArray([
                                { label: "A.", value: question.correct_answer },
                                { label: "B.", value: question.wrong1 },
                                { label: "C.", value: question.wrong2 },
                                { label: "D.", value: question.wrong3 },
                            ]);

                            return (
                                <Grid
                                    item
                                    xs={12}
                                    sm={questionsPerPage === 2 ? 6 : 12}
                                    md={4}
                                    key={question.id}
                                >
                                    <FlashcardSetCard isQuestionCard>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                mb: 1,
                                                color: "#333",
                                                lineHeight: 1.5,
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {question.question}
                                        </Typography>
                                        <Box sx={{ flexGrow: 1, mt: 2 }}>
                                            <Box sx={{ display: "flex", mb: 1 }}>
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography variant="body2" sx={{ color: "#333" }}>
                                                        {options[0].label} {options[0].value}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography variant="body2" sx={{ color: "#333" }}>
                                                        {options[1].label} {options[1].value}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Box sx={{ display: "flex" }}>
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography variant="body2" sx={{ color: "#333" }}>
                                                        {options[2].label} {options[2].value}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography variant="body2" sx={{ color: "#333" }}>
                                                        {options[3].label} {options[3].value}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </FlashcardSetCard>
                                </Grid>
                            );
                        })}
                    </Grid>
                    {quizData.length > questionsPerPage && (
                        <>
                            <PrevButton
                                className="nav-buttons"
                                onClick={handleQuestionPrev}
                                disabled={currentQuestionPage === 0}
                            >
                                <ArrowBackIosIcon />
                            </PrevButton>
                            <NextButton
                                className="nav-buttons"
                                onClick={handleQuestionNext}
                                disabled={currentQuestionPage === totalQuestionPages - 1}
                            >
                                <ArrowForwardIosIcon />
                            </NextButton>
                        </>
                    )}
                </QuestionsContainer>
            )}
        </Box >
    );
};

export default UserHomePage;