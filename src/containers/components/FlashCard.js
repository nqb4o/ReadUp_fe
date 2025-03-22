import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  IconButton,
  TextField,
  InputAdornment,
  Stack,
  Button,
} from "@mui/material";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const flashcardData = [
  {
    word: "brilliance",
    type: "noun",
    pronunciation: {
      uk: "/ˈbrɪl.jəns/",
      us: "/ˈbrɪl.jəns/",
    },
    definitions: [
      {
        meaning: "Great skill or intelligence:",
        example: "Her first novel showed signs of brilliance.",
      },
      {
        meaning: "Great brightness of light or color:",
        example: "I had never seen diamonds shine with such brilliance before.",
      },
    ],
  },
  {
    word: "eloquent",
    type: "adjective",
    pronunciation: {
      uk: "/ˈel.ə.kwənt/",
      us: "/ˈel.ə.kwənt/",
    },
    definitions: [
      {
        meaning: "Expressing ideas or feelings in a clear and effective way:",
        example: "She gave an eloquent speech at the ceremony.",
      },
    ],
  },
];

const FlashCard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const cardRef = useRef(null);

  const filteredData = flashcardData.filter((item) =>
    item.word.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentCard = filteredData[currentIndex] || null;

  // Xử lý click để chuyển đổi nội dung
  const handleToggleDetails = (event) => {
    const selection = window.getSelection();
    const selected = selection.toString().trim();

    // Chỉ chạy toggle nếu không có văn bản nào được bôi đen
    if (!selected) {
      setShowDetails(!showDetails);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentIndex(0);
    setShowDetails(false);
  };

  const handlePlayAudio = (pronunciation) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(currentCard.word);
      utterance.lang = pronunciation === "uk" ? "en-GB" : "en-US";
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Sorry, your browser does not support speech synthesis.");
    }
  };

  const handleNext = () => {
    if (currentIndex < filteredData.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowDetails(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowDetails(false);
    }
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: 4,
      }}
    >
      {/* Thanh tìm kiếm */}
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search flashcard..."
        value={searchTerm}
        onChange={handleSearchChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{
          mb: 4,
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            backgroundColor: "background.paper",
          },
        }}
      />

      {/* Flashcard */}
      {currentCard ? (
        <Box
          sx={{
            minHeight: "300px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Card
            ref={cardRef}
            sx={{
              width: "100%",
              maxWidth: "600px",
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              backgroundColor: "background.paper",
              cursor: "pointer",
            }}
            onClick={handleToggleDetails}
          >
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                p: 4,
              }}
            >
              {showDetails ? (
                <Box>
                  {currentCard.definitions.map((def, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Typography variant="body1" fontWeight="medium">
                        {def.meaning}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                      >
                        - {def.example}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <>
                  <Typography
                    variant="h4"
                    component="h1"
                    fontWeight="bold"
                    textAlign="center"
                  >
                    {currentCard.word}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mt: 1, textAlign: "center" }}
                  >
                    ({currentCard.type})
                  </Typography>
                  <Box
                    sx={{
                      mt: 2,
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={2}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Typography variant="body1" color="text.secondary">
                        UK: {currentCard.pronunciation.uk}
                      </Typography>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayAudio("uk");
                        }}
                        size="small"
                        color="primary"
                      >
                        <VolumeUpIcon />
                      </IconButton>
                    </Stack>
                    <Stack
                      direction="row"
                      spacing={2}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Typography variant="body1" color="text.secondary">
                        US: {currentCard.pronunciation.us}
                      </Typography>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayAudio("us");
                        }}
                        size="small"
                        color="primary"
                      >
                        <VolumeUpIcon />
                      </IconButton>
                    </Stack>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Box>
      ) : (
        <Typography variant="h6" color="text.secondary" textAlign="center">
          No flashcard found.
        </Typography>
      )}

      {/* Điều hướng giữa các flashcard */}
      {filteredData.length > 1 && (
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
            {currentIndex + 1} / {filteredData.length}
          </Typography>
          <Button
            endIcon={<ArrowForwardIosIcon />}
            onClick={handleNext}
            disabled={currentIndex === filteredData.length - 1}
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

export default FlashCard;