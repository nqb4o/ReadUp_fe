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
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import StarIcon from "@mui/icons-material/Star";
import { handleGetVocabularyById } from "../../services/VocabularyServices";

const UserFlashCard = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [translatedText, setTranslatedText] = useState("");
  const [isTranslated, setIsTranslated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isApiLoading, setIsApiLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [flashcardData, setFlashcardData] = useState([]);
  const [starStates, setStarStates] = useState([]);
  const cardRef = useRef(null);

  useEffect(() => {
    const fetchVocabulary = async () => {
      setIsApiLoading(true);
      setApiError(null);
      try {
        const response = await handleGetVocabularyById("1");
        const data = response.data;
        const formattedData = Array.isArray(data) ? data : [data];
        setFlashcardData(formattedData);
        setStarStates(formattedData.map(() => true));
      } catch (err) {
        setApiError("Không thể tải dữ liệu từ API. Vui lòng thử lại sau.");
        setFlashcardData([]);
        setStarStates([]);
      } finally {
        setIsApiLoading(false);
      }
    };

    fetchVocabulary();
  }, []);

  const currentCard = flashcardData[currentIndex] || null;

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
    if (event.target.closest(".star-button")) {
      return;
    }
    if (!isTranslated && currentCard) {
      translateText(currentCard.word);
    } else {
      setIsTranslated(false);
      setTranslatedText("");
    }
  };

  const handleStarClick = () => {
    setStarStates((prev) =>
      prev.map((state, index) => (index === currentIndex ? !state : state))
    );
  };

  const handleNext = () => {
    if (currentIndex < flashcardData.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setTranslatedText("");
      setIsTranslated(false);
      setError(null);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setTranslatedText("");
      setIsTranslated(false);
      setError(null);
    }
  };

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
        <Typography variant="h6" color="error">
          {apiError}
        </Typography>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: 4,
      }}
    >
      {currentCard ? (
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
            }}
          >
            <Typography
              variant="h6"
              sx={{
                position: "absolute",
                top: 16,
                left: 16,
                fontWeight: "bold",
                color: "text.primary",
              }}
            >
              {currentCard.title}
            </Typography>

            <IconButton
              className="star-button"
              onClick={handleStarClick}
              sx={{
                position: "absolute",
                top: 12,
                right: 12,
                backgroundColor: "#000",
                color: starStates[currentIndex] ? "#FFD700" : "#fff",
                border: "none",
                borderRadius: "50%",
                "&:hover": {
                  backgroundColor: "#000",
                },
              }}
            >
              <StarIcon />
            </IconButton>
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "450px",
              }}
            >
              {isLoading ? (
                <CircularProgress size={30} />
              ) : error ? (
                <Typography variant="body1" color="error" textAlign="center">
                  {error}
                </Typography>
              ) : (
                <Typography
                  variant="h4"
                  component="h1"
                  fontWeight="bold"
                  textAlign="center"
                >
                  {isTranslated ? translatedText : currentCard.word}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>
      ) : (
        <Typography variant="h6" color="text.secondary" textAlign="center">
          No flashcard found.
        </Typography>
      )}

      {flashcardData.length > 1 && (
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button
            startIcon={<ArrowBackIosIcon />}
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            variant="outlined"
            sx={{ borderRadius: "20px" }}
          >
            Previous
          </Button>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ alignSelf: "center" }}
          >
            {currentIndex + 1} / {flashcardData.length}
          </Typography>
          <Button
            endIcon={<ArrowForwardIosIcon />}
            onClick={handleNext}
            disabled={currentIndex === flashcardData.length - 1}
            variant="outlined"
            sx={{ borderRadius: "20px" }}
          >
            Next
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default UserFlashCard;
