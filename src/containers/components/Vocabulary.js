import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Divider,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  Stack,
  Button,
} from "@mui/material";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useCart } from "../../contexts/CartContext";

const vocabularyData = [
  {
    word: "brilliance",
    type: "noun",
    pronunciation: {
      uk: "/ˈbrɪl.jəns/",
      us: "/ˈbrɪl.jəns/",
    },
    definitions: [
      {
        meaning: "great skill or intelligence",
        example: "Her first novel showed signs of brilliance.",
      },
      {
        meaning: "great brightness of light or colour",
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
        meaning: "expressing ideas or feelings in a clear and effective way",
        example: "She gave an eloquent speech at the ceremony.",
      },
    ],
  },
];

const Vocabulary = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const { addToFavorites, removeFromFavorites, isFavorite } = useCart(); // Sử dụng CartContext

  const filteredData = vocabularyData.filter((item) =>
    item.word.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentWord = filteredData[currentIndex] || null;

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentIndex(0);
  };

  const handlePlayAudio = (pronunciation) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(currentWord.word);
      utterance.lang = pronunciation === "uk" ? "en-GB" : "en-US";
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Sorry, your browser does not support speech synthesis.");
    }
  };

  const toggleFavorite = (word, pronunciation) => {
    if (isFavorite(word)) {
      removeFromFavorites(word);
    } else {
      addToFavorites({ word, pronunciation });
    }
  };

  const handleNext = () => {
    if (currentIndex < filteredData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <Container maxWidth="lg">
      {/* Thanh tìm kiếm */}
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search vocabulary..."
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

      {/* Hiển thị từ vựng */}
      {currentWord ? (
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            transition: "transform 0.3s ease",
            "&:hover": {
              transform: "translateY(-5px)",
            },
            backgroundColor: "background.paper",
          }}
        >
          <CardContent>
            {/* Từ và loại từ */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Box>
                <Typography variant="h4" component="h1" fontWeight="bold">
                  {currentWord.word}
                </Typography>
                <Chip
                  label={currentWord.type}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ mt: 1 }}
                />
              </Box>
              <IconButton onClick={() => toggleFavorite(currentWord.word, currentWord.pronunciation)}>
                {isFavorite(currentWord.word) ? (
                  <FavoriteIcon color="error" />
                ) : (
                  <FavoriteBorderIcon />
                )}
              </IconButton>
            </Box>

            {/* Phiên âm */}
            <Box sx={{ mb: 2, display: "flex", flexDirection: "row", gap: 1 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="body1" color="text.secondary">
                  UK: {currentWord.pronunciation.uk}
                </Typography>
                <IconButton
                  onClick={() => handlePlayAudio("uk")}
                  size="small"
                  color="primary"
                >
                  <VolumeUpIcon />
                </IconButton>
              </Stack>
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="body1" color="text.secondary">
                  US: {currentWord.pronunciation.us}
                </Typography>
                <IconButton
                  onClick={() => handlePlayAudio("us")}
                  size="small"
                  color="primary"
                >
                  <VolumeUpIcon />
                </IconButton>
              </Stack>
            </Box>

            {/* Định nghĩa và ví dụ */}
            {currentWord.definitions.map((def, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="h6" fontWeight="medium">
                  {index + 1}. {def.meaning}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  <i>Example:</i> {def.example}
                </Typography>
                {index < currentWord.definitions.length - 1 && (
                  <Divider sx={{ my: 2 }} />
                )}
              </Box>
            ))}
          </CardContent>
        </Card>
      ) : (
        <Typography variant="h6" color="text.secondary" textAlign="center">
          No vocabulary found.
        </Typography>
      )}

      {/* Điều hướng giữa các từ */}
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

export default Vocabulary;