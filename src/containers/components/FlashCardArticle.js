import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  CircularProgress,
  Button,
  IconButton,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { handleGetVocabularyByArticleId } from "../../services/VocabularyServices"; 

const FlashCardArticle = () => {
  const [vocabularies, setVocabularies] = useState([]);
  const [totalFlashcards, setTotalFlashcards] = useState(0);
  const [currentFlashcard, setCurrentFlashcard] = useState(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [flashcardOrder, setFlashcardOrder] = useState([]);
  const [isLoadingVocab, setIsLoadingVocab] = useState(true);
  const [errorVocab, setErrorVocab] = useState(null);

  const progress = totalFlashcards > 0 ? (currentFlashcard / totalFlashcards) * 100 : 0;

  const [isTranslated, setIsTranslated] = useState(false);
  const [translatedText, setTranslatedText] = useState("");
  const [isLoadingTranslation, setIsLoadingTranslation] = useState(false);
  const [errorTranslation, setErrorTranslation] = useState(null);

  const navigate = useNavigate();
  const { id: articleId } = useParams();

  useEffect(() => {
    const fetchVocabularies = async () => {
      setIsLoadingVocab(true);
      setErrorVocab(null);
      try {
        const response = await handleGetVocabularyByArticleId(articleId);
        const vocabData = response.data;
        setVocabularies(vocabData);
        setTotalFlashcards(vocabData.length);
        setFlashcardOrder(Array.from({ length: vocabData.length }, (_, i) => i + 1));
      } catch (err) {
        setErrorVocab("Không thể tải từ vựng. Vui lòng thử lại sau.");
        setVocabularies([]);
        setTotalFlashcards(0);
      } finally {
        setIsLoadingVocab(false);
      }
    };

    fetchVocabularies();
  }, [articleId]);

  const word = vocabularies[currentFlashcard - 1]?.word || "";

  useEffect(() => {
    let timerEnglish;
    let timerTranslated;
    if (isAutoPlaying && currentFlashcard < totalFlashcards) {
      const autoPlayCycle = async () => {
        setIsTranslated(false);
        setTranslatedText("");
        setErrorTranslation(null);

        timerEnglish = setTimeout(async () => {
          await translateText(word);

          timerTranslated = setTimeout(() => {
            setCurrentFlashcard((prev) => {
              if (prev < totalFlashcards) {
                return prev + 1;
              } else {
                setIsAutoPlaying(false);
                return prev;
              }
            });
            setTranslatedText("");
            setIsTranslated(false);
            setErrorTranslation(null);
          }, 3000);
        }, 3000);
      };

      autoPlayCycle();
    }

    return () => {
      clearTimeout(timerEnglish);
      clearTimeout(timerTranslated);
    };
  }, [isAutoPlaying, currentFlashcard, totalFlashcards, word]);

  const translateText = async (text) => {
    if (!text) return; 
    setIsLoadingTranslation(true);
    setErrorTranslation(null);
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
      setErrorTranslation("Không thể dịch. Vui lòng thử lại sau.");
      setTranslatedText("");
      setIsTranslated(false);
    } finally {
      setIsLoadingTranslation(false);
    }
  };

  const handleCardClick = () => {
    if (!isTranslated) {
      translateText(word);
    } else {
      setIsTranslated(false);
      setTranslatedText("");
    }
  };

  const handleNext = () => {
    if (currentFlashcard < totalFlashcards) {
      setCurrentFlashcard(currentFlashcard + 1);
      setTranslatedText("");
      setIsTranslated(false);
      setErrorTranslation(null);
    }
  };

  const handlePrevious = () => {
    if (currentFlashcard > 1) {
      setCurrentFlashcard(currentFlashcard - 1);
      setTranslatedText("");
      setIsTranslated(false);
      setErrorTranslation(null);
    }
  };

  const handleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  const handleShuffle = () => {
    const shuffled = [...flashcardOrder].sort(() => Math.random() - 0.5);
    setFlashcardOrder(shuffled);
    setCurrentFlashcard(shuffled[0]);
    setTranslatedText("");
    setIsTranslated(false);
    setErrorTranslation(null);
  };

  const handleBack = () => {
    navigate(`/articles/${articleId}`);
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: { xs: 2, sm: 3, md: 4 },
      }}
    >
      {/* Progress Bar with Back Button */}
      <Box
        sx={{
          mb: { xs: 2, sm: 3, md: 4 },
          display: "flex",
          alignItems: "center",
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 2, sm: 0 },
        }}
      >
        <Box sx={{ flex: 1, width: "100%" }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: { xs: 8, sm: 10 },
              borderRadius: 5,
              backgroundColor: "grey.300",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "primary.main",
              },
            }}
          />
        </Box>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          variant="outlined"
          size="small"
          sx={{
            ml: { xs: 0, sm: 2 },
            borderRadius: "20px",
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
            px: { xs: 1.5, sm: 2 },
          }}
        >
          Trở về
        </Button>
      </Box>

      {/* Flashcard Box */}
      <Box
        sx={{
          minHeight: { xs: "300px", sm: "400px", md: "450px" },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        {isLoadingVocab ? (
          <CircularProgress size={40} />
        ) : errorVocab ? (
          <Typography
            variant="body1"
            color="error"
            textAlign="center"
            sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
          >
            {errorVocab}
          </Typography>
        ) : vocabularies.length === 0 ? (
          <Typography
            variant="body1"
            textAlign="center"
            sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
          >
            Không có từ vựng nào cho bài viết này.
          </Typography>
        ) : (
          <>
            <Card
              onClick={handleCardClick}
              sx={{
                width: "100%",
                maxWidth: { xs: "90%", sm: 400, md: 600 },
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                backgroundColor: "background.paper",
                cursor: "pointer",
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: { xs: "250px", sm: "350px", md: "400px" },
                  p: { xs: 2, sm: 3 },
                }}
              >
                {isLoadingTranslation ? (
                  <CircularProgress size={30} />
                ) : errorTranslation ? (
                  <Typography
                    variant="body1"
                    color="error"
                    textAlign="center"
                    sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
                  >
                    {errorTranslation}
                  </Typography>
                ) : (
                  <Typography
                    variant={{ xs: "h6", sm: "h5", md: "h4" }}
                    component="h1"
                    fontWeight="bold"
                    textAlign="center"
                    sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem", md: "2rem" } }}
                  >
                    {isTranslated ? translatedText : word}
                  </Typography>
                )}
              </CardContent>
            </Card>
            {/* Navigation Buttons */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: { xs: 2, sm: 3 },
                width: "100%",
                maxWidth: { xs: "90%", sm: 400, md: 600 },
                flexDirection: { xs: "column", sm: "row" },
                gap: { xs: 2, sm: 0 },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flex: { xs: "none", sm: 1 },
                }}
              >
                <Button
                  startIcon={<ArrowBackIosIcon />}
                  onClick={handlePrevious}
                  disabled={currentFlashcard === 1}
                  variant="outlined"
                  size="small"
                  sx={{
                    borderRadius: "20px",
                    mr: { xs: 1, sm: 2 },
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    px: { xs: 1, sm: 1.5 },
                  }}
                >
                  Previous
                </Button>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mx: { xs: 1, sm: 2 }, fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                >
                  {currentFlashcard} / {totalFlashcards}
                </Typography>
                <Button
                  endIcon={<ArrowForwardIosIcon />}
                  onClick={handleNext}
                  disabled={currentFlashcard === totalFlashcards}
                  variant="outlined"
                  size="small"
                  sx={{
                    borderRadius: "20px",
                    ml: { xs: 1, sm: 2 },
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    px: { xs: 1, sm: 1.5 },
                  }}
                >
                  Next
                </Button>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <IconButton
                  onClick={handleAutoPlay}
                  sx={{
                    mr: 1,
                    color: isAutoPlaying ? "primary.main" : "text.secondary",
                    fontSize: { xs: "1.25rem", sm: "1.5rem" },
                  }}
                >
                  {isAutoPlaying ? <PauseIcon fontSize="inherit" /> : <PlayArrowIcon fontSize="inherit" />}
                </IconButton>
                <IconButton
                  onClick={handleShuffle}
                  sx={{
                    color: "text.secondary",
                    fontSize: { xs: "1.25rem", sm: "1.5rem" },
                  }}
                >
                  <ShuffleIcon fontSize="inherit" />
                </IconButton>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
};

export default FlashCardArticle;