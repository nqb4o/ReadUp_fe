import React, { useState, useEffect, useRef } from "react";
import {
    Box,
    Typography,
    Container,
    Card,
    CardContent,
    Button,
    CircularProgress,
    IconButton,
    Chip,
    Snackbar,
    Alert,
    Divider
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import StarIcon from "@mui/icons-material/Star";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import RefreshIcon from "@mui/icons-material/Refresh";
import { handleGetVocabularyByUserId } from "../../services/VocabularyServices";

const UserFlashCard = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [translatedText, setTranslatedText] = useState("");
    const [isTranslated, setIsTranslated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isApiLoading, setIsApiLoading] = useState(true);
    const [error, setError] = useState(null);
    const [apiError, setApiError] = useState(null);
    const [flashcardData, setFlashcardData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [starStates, setStarStates] = useState([]);
    const [showStarredOnly, setShowStarredOnly] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const cardRef = useRef(null);

    // Fetch vocabulary data
    useEffect(() => {
        fetchVocabulary();
    }, []);

    // Update filtered data when flashcardData or starred filter changes
    useEffect(() => {
        if (showStarredOnly) {
            setFilteredData(flashcardData.filter((_, index) => starStates[index]));
        } else {
            setFilteredData(flashcardData);
        }
    }, [flashcardData, starStates, showStarredOnly]);

    // Reset current index when filtered data changes
    useEffect(() => {
        setCurrentIndex(0);
        setIsTranslated(false);
        setTranslatedText("");
    }, [filteredData]);

    const fetchVocabulary = async () => {
        setIsApiLoading(true);
        setApiError(null);

        try {
            const userData = JSON.parse(sessionStorage.getItem("user") || "{}");
            const user_id = userData.id;

            if (!user_id) {
                throw new Error("User ID not found");
            }

            const response = await handleGetVocabularyByUserId(user_id);
            const data = response.data.data;

            if (!data || (Array.isArray(data) && data.length === 0)) {
                setApiError("Không có từ vựng nào được tìm thấy. Hãy thêm từ vựng mới.");
                setFlashcardData([]);
                setStarStates([]);
                return;
            }

            const formattedData = Array.isArray(data) ? data : [data];
            setFlashcardData(formattedData);

            // Initialize star states from localStorage or default to all starred
            const savedStarStates = localStorage.getItem("flashcardStarStates");
            if (savedStarStates && JSON.parse(savedStarStates).length === formattedData.length) {
                setStarStates(JSON.parse(savedStarStates));
            } else {
                setStarStates(formattedData.map(() => true));
            }

            showSnackbar("Đã tải dữ liệu từ vựng thành công", "success");
        } catch (err) {
            console.error("Error fetching vocabulary:", err);
            setApiError("Không thể tải dữ liệu từ API. Vui lòng thử lại sau.");
            setFlashcardData([]);
            setStarStates([]);
        } finally {
            setIsApiLoading(false);
        }
    };

    const translateText = async (text) => {
        if (!text) return;

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
            setIsTranslated(true);
        } catch (err) {
            setError("Không thể dịch. Vui lòng thử lại sau.");
            setTranslatedText("");
            setIsTranslated(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCardClick = (event) => {
        if (!currentCard || event.target.closest(".control-button")) {
            return;
        }

        if (!isTranslated) {
            translateText(currentCard.word);
        } else {
            setIsTranslated(false);
            setTranslatedText("");
        }
    };

    const handleStarClick = () => {
        if (!currentCard) return;

        const currentCardIndex = flashcardData.indexOf(currentCard);
        if (currentCardIndex === -1) return;

        const newStarStates = [...starStates];
        newStarStates[currentCardIndex] = !newStarStates[currentCardIndex];

        setStarStates(newStarStates);
        localStorage.setItem("flashcardStarStates", JSON.stringify(newStarStates));

        const action = newStarStates[currentCardIndex] ? "đánh dấu" : "bỏ đánh dấu";
        showSnackbar(`Đã ${action} từ "${currentCard.word}"`, "info");
    };

    const handleNext = () => {
        if (currentIndex < filteredData.length - 1) {
            setCurrentIndex(currentIndex + 1);
            resetCardState();
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            resetCardState();
        }
    };

    const resetCardState = () => {
        setTranslatedText("");
        setIsTranslated(false);
        setError(null);
    };

    const handleSpeech = () => {
        if (!currentCard) return;

        const utterance = new SpeechSynthesisUtterance(currentCard.word);
        utterance.lang = "en-US";
        speechSynthesis.speak(utterance);
    };

    const toggleStarredFilter = () => {
        setShowStarredOnly(!showStarredOnly);
        showSnackbar(
            !showStarredOnly
                ? "Đang hiển thị từ vựng đã đánh dấu"
                : "Đang hiển thị tất cả từ vựng",
            "info"
        );
    };

    const showSnackbar = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const handleRefresh = () => {
        fetchVocabulary();
    };

    const currentCard = filteredData[currentIndex] || null;

    if (isApiLoading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4, textAlign: "center" }}>
                <CircularProgress size={40} />
                <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
                    Đang tải flashcards...
                </Typography>
            </Container>
        );
    }

    if (apiError) {
        return (
            <Container maxWidth="lg" sx={{ py: 4, textAlign: "center" }}>
                <Typography variant="h6" color="error" sx={{ mb: 2 }}>
                    {apiError}
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<RefreshIcon />}
                    onClick={handleRefresh}
                >
                    Thử lại
                </Button>
            </Container>
        );
    }

    if (filteredData.length === 0) {
        return (
            <Container maxWidth="lg" sx={{ py: 4, textAlign: "center" }}>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                    {showStarredOnly
                        ? "Không có từ vựng nào được đánh dấu."
                        : "Không có từ vựng nào."
                    }
                </Typography>
                {showStarredOnly && (
                    <Button
                        variant="contained"
                        onClick={toggleStarredFilter}
                        sx={{ mr: 2 }}
                    >
                        Hiển thị tất cả
                    </Button>
                )}
                <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={handleRefresh}
                >
                    Tải lại dữ liệu
                </Button>
            </Container>
        );
    }

    // Ensure we have a valid currentCard before rendering the main component
    if (!currentCard) {
        return (
            <Container maxWidth="lg" sx={{ py: 4, textAlign: "center" }}>
                <Typography variant="h6" color="text.secondary">
                    Không thể hiển thị thẻ từ vựng. Vui lòng thử lại.
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<RefreshIcon />}
                    onClick={handleRefresh}
                    sx={{ mt: 2 }}
                >
                    Tải lại dữ liệu
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h5" component="h1" fontWeight="bold">
                    Flashcards Từ Vựng
                </Typography>
                <Box>
                    <Button
                        variant={showStarredOnly ? "contained" : "outlined"}
                        startIcon={<StarIcon />}
                        onClick={toggleStarredFilter}
                        sx={{ mr: 1 }}
                    >
                        {showStarredOnly ? "Đã đánh dấu" : "Tất cả từ"}
                    </Button>
                    <IconButton
                        onClick={handleRefresh}
                        className="control-button"
                        color="primary"
                    >
                        <RefreshIcon />
                    </IconButton>
                </Box>
            </Box>

            <Box
                sx={{
                    minHeight: "450px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Card
                    ref={cardRef}
                    onClick={handleCardClick}
                    sx={{
                        width: "100%",
                        maxWidth: "600px",
                        borderRadius: 3,
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                        backgroundColor: "background.paper",
                        cursor: "pointer",
                        position: "relative",
                        transition: "transform 0.3s ease",
                        "&:hover": {
                            transform: "translateY(-5px)",
                            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
                        },
                    }}
                >
                    <Box sx={{ display: "flex", justifyContent: "space-between", p: 2 }}>
                        <Chip
                            label={currentCard.title || "Từ vựng"}
                            color="primary"
                            variant="outlined"
                            size="small"
                        />
                        <Box>
                            <IconButton
                                className="control-button"
                                onClick={handleSpeech}
                                sx={{ mr: 1 }}
                                size="small"
                            >
                                <VolumeUpIcon />
                            </IconButton>
                            <IconButton
                                className="control-button star-button"
                                onClick={handleStarClick}
                                sx={{
                                    color: starStates[flashcardData.indexOf(currentCard)] ? "#FFD700" : "#ccc",
                                }}
                                size="small"
                            >
                                <StarIcon />
                            </IconButton>
                        </Box>
                    </Box>

                    <Divider />

                    <CardContent
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            minHeight: "350px",
                            p: 4,
                        }}
                    >
                        {isLoading ? (
                            <CircularProgress size={30} />
                        ) : error ? (
                            <Typography variant="body1" color="error" textAlign="center">
                                {error}
                            </Typography>
                        ) : (
                            <>
                                <Typography
                                    variant="h3"
                                    component="h2"
                                    fontWeight="bold"
                                    textAlign="center"
                                    sx={{ mb: 2 }}
                                >
                                    {isTranslated ? translatedText : currentCard.word}
                                </Typography>

                                {!isTranslated && (
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        textAlign="center"
                                    >
                                        Nhấp vào thẻ để xem nghĩa
                                    </Typography>
                                )}

                                {isTranslated && currentCard.example && (
                                    <Box sx={{ mt: 4, width: "100%" }}>
                                        <Typography
                                            variant="body2"
                                            fontWeight="bold"
                                            textAlign="left"
                                            color="text.secondary"
                                        >
                                            Ví dụ:
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            textAlign="left"
                                            sx={{ mt: 1, fontStyle: "italic" }}
                                        >
                                            {currentCard.example}
                                        </Typography>
                                    </Box>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3, alignItems: "center" }}>
                <Button
                    startIcon={<ArrowBackIosIcon />}
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                    variant="outlined"
                    sx={{ borderRadius: "20px" }}
                >
                    Trước
                </Button>

                <Typography
                    variant="body1"
                    fontWeight="medium"
                    sx={{
                        alignSelf: "center",
                        bgcolor: "background.paper",
                        px: 3,
                        py: 1,
                        borderRadius: 2,
                        boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
                    }}
                >
                    {currentIndex + 1} / {filteredData.length}
                </Typography>

                <Button
                    endIcon={<ArrowForwardIosIcon />}
                    onClick={handleNext}
                    disabled={currentIndex === filteredData.length - 1}
                    variant="outlined"
                    sx={{ borderRadius: "20px" }}
                >
                    Tiếp
                </Button>
            </Box>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbarSeverity}
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default UserFlashCard;
