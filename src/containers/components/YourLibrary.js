import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Select,
  MenuItem,
  InputBase,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Chip,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { useNavigate } from "react-router-dom";
import {
  handleGetVocabularyAndArticleByUserId,
  handleGetAllVocabularyAndArticleByUserId,
} from "../../services/ArticleService";
import { getQuizQuestionAndAnswerApi } from "../../services/QuizService"; // Adjust the import path as needed

const YourLibrary = () => {
  const [tabValue, setTabValue] = useState(0);
  const [filter, setFilter] = useState("Sắp xếp");
  const [searchQuery, setSearchQuery] = useState("");
  const [translations, setTranslations] = useState({});
  const [isLoading, setIsLoading] = useState({});
  const [error, setError] = useState({});
  const [vocabulary, setVocabulary] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [questions, setQuestions] = useState([]); // State for questions data
  const navigate = useNavigate();

  // Get user_id from sessionStorage
  const userData = JSON.parse(sessionStorage.getItem("user") || "{}");
  const user_id = userData.id;

  // Fetch vocabulary data
  useEffect(() => {
    const fetchVocabulary = async () => {
      if (!user_id) {
        setError((prev) => ({
          ...prev,
          vocabulary: "User ID not found. Please log in.",
        }));
        return;
      }

      setIsLoading((prev) => ({ ...prev, vocabulary: true }));
      try {
        const response = await handleGetVocabularyAndArticleByUserId(user_id);
        setVocabulary(response.data);
        setError((prev) => ({ ...prev, vocabulary: null }));
      } catch (err) {
        setError((prev) => ({
          ...prev,
          vocabulary: "Failed to fetch vocabulary. Please try again later.",
        }));
        setVocabulary([]);
      } finally {
        setIsLoading((prev) => ({ ...prev, vocabulary: false }));
      }
    };

    fetchVocabulary();
  }, [user_id]);

  // Fetch flashcards data
  useEffect(() => {
    const fetchFlashcards = async () => {
      if (!user_id) {
        setError((prev) => ({
          ...prev,
          flashcards: "User ID not found. Please log in.",
        }));
        return;
      }

      setIsLoading((prev) => ({ ...prev, flashcards: true }));
      try {
        const response = await handleGetAllVocabularyAndArticleByUserId(user_id);
        setFlashcards(response.data);
        setError((prev) => ({ ...prev, flashcards: null }));
      } catch (err) {
        setError((prev) => ({
          ...prev,
          flashcards: "Failed to fetch flashcards. Please try again later.",
        }));
        setFlashcards([]);
      } finally {
        setIsLoading((prev) => ({ ...prev, flashcards: false }));
      }
    };

    fetchFlashcards();
  }, [user_id]);

  // Fetch questions data
  useEffect(() => {
    const fetchQuestions = async () => {
      if (!user_id) {
        setError((prev) => ({
          ...prev,
          questions: "User ID not found. Please log in.",
        }));
        return;
      }

      setIsLoading((prev) => ({ ...prev, questions: true }));
      try {
        const response = await getQuizQuestionAndAnswerApi(user_id);
        setQuestions(response.data); // Assuming response.data contains the questions array
        setError((prev) => ({ ...prev, questions: null }));
      } catch (err) {
        setError((prev) => ({
          ...prev,
          questions: "Failed to fetch questions. Please try again later.",
        }));
        setQuestions([]);
      } finally {
        setIsLoading((prev) => ({ ...prev, questions: false }));
      }
    };

    fetchQuestions();
  }, [user_id]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleNavigateToQuiz = () => {
    navigate("/quiz");
  };

  const handleNavigateToArticleById = (articleId) => {
    navigate(`/articles/${articleId}`);
  };

  const handleNavigateToFlashcardById = (articleId) => {
    navigate(`/flashcards/${articleId}`);
  };

  const handleNavigateToVocabularyById = (articleId) => {
    navigate(`/articles/${articleId}`);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Function to fetch translation for a word
  const translateText = async (word) => {
    setIsLoading((prev) => ({ ...prev, [word]: true }));
    setError((prev) => ({ ...prev, [word]: null }));
    try {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
          word
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
        [word]: data.responseData.translatedText,
      }));
    } catch (err) {
      setError((prev) => ({
        ...prev,
        [word]: "Không thể dịch. Vui lòng thử lại sau.",
      }));
      setTranslations((prev) => ({ ...prev, [word]: "" }));
    } finally {
      setIsLoading((prev) => ({ ...prev, [word]: false }));
    }
  };

  // Fetch translations for vocabulary words
  useEffect(() => {
    vocabulary.forEach((item) => {
      if (!translations[item.word] && !isLoading[item.word]) {
        translateText(item.word);
      }
    });
  }, [vocabulary, translations, isLoading]);

  // Filter and sort vocabulary (for tabValue === 0)
  const filteredVocabulary = vocabulary
    .filter((item) => {
      const meaning = translations[item.word] || "";
      return (
        searchQuery.trim() === "" ||
        item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
        meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.tags &&
          item.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          ))
      );
    })
    .sort((a, b) => {
      if (filter === "Tăng dần A-Z") {
        return a.word.localeCompare(b.word);
      } else if (filter === "Giảm dần Z-A") {
        return b.word.localeCompare(a.word);
      }
      return 0;
    });

  // Filter and sort questions (for tabValue === 2)
  const filteredQuestions = questions
    .filter((question) =>
      searchQuery.trim() === ""
        ? true
        : question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (question.tags &&
            question.tags.some((tag) =>
              tag.toLowerCase().includes(searchQuery.toLowerCase())
            ))
    )
    .sort((a, b) => {
      if (filter === "Tăng dần A-Z") {
        return a.title.localeCompare(b.title);
      } else if (filter === "Giảm dần Z-A") {
        return b.title.localeCompare(a.title);
      }
      return 0;
    });

  // Filter and sort flashcards (for tabValue === 1)
  const filteredFlashcards = flashcards
    .filter((flashcard) =>
      searchQuery.trim() === ""
        ? true
        : flashcard.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (flashcard.word &&
            flashcard.word.some((w) =>
              w.toLowerCase().includes(searchQuery.toLowerCase())
            ))
    )
    .sort((a, b) => {
      if (filter === "Tăng dần A-Z") {
        return a.title.localeCompare(b.title);
      } else if (filter === "Giảm dần Z-A") {
        return b.title.localeCompare(a.title);
      }
      return 0;
    });

  return (
    <Box sx={{ py: 3, maxWidth: "1200px", mx: "auto" }}>
      {/* Header */}
      <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
        Thư viện của bạn
      </Typography>

      {/* Navigation Tabs */}
      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Từ vựng" />
        <Tab label="Thẻ ghi nhớ" />
        <Tab label="Bài kiểm tra thử" />
      </Tabs>

      {tabValue === 0 && (
        <>
          {/* Filter and Search Bar */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
            <Select
              value={filter}
              onChange={handleFilterChange}
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="Sắp xếp">Sắp xếp</MenuItem>
              <MenuItem value="Tăng dần A-Z">Tăng dần A-Z</MenuItem>
              <MenuItem value="Giảm dần Z-A">Giảm dần Z-A</MenuItem>
            </Select>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                border: "1px solid #ccc",
                borderRadius: "20px",
                pl: 2,
              }}
            >
              <InputBase
                placeholder="Tìm kiếm từ vựng"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <IconButton sx={{ border: "none" }}>
                <SearchIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Conditional Rendering for Vocabulary */}
          {isLoading.vocabulary ? (
            <Box sx={{ textAlign: "center", mt: 8, mb: 4 }}>
              <CircularProgress />
              <Typography variant="h6" sx={{ mt: 2 }}>
                Đang tải từ vựng...
              </Typography>
            </Box>
          ) : error.vocabulary ? (
            <Box sx={{ textAlign: "center", mt: 8, mb: 4 }}>
              <AssignmentIcon sx={{ fontSize: 80, color: "#f5a623", mb: 3 }} />
              <Typography
                variant="h6"
                sx={{ mb: 2, color: "#d32f2f", fontWeight: 500 }}
              >
                {error.vocabulary}
              </Typography>
              <Button
                variant="text"
                sx={{
                  borderRadius: "20px",
                  textTransform: "none",
                  bgcolor: "#000",
                  color: "#fff",
                  py: 1.5,
                  px: 4,
                  fontSize: "1rem",
                  "&:hover": { bgcolor: "#333" },
                }}
                onClick={() => navigate("/vocabulary")}
              >
                Tìm kiếm từ vựng
              </Button>
            </Box>
          ) : filteredVocabulary.length === 0 ? (
            <Box sx={{ textAlign: "center", mt: 8, mb: 4 }}>
              <AssignmentIcon sx={{ fontSize: 80, color: "#f5a623", mb: 3 }} />
              <Typography
                variant="h6"
                sx={{ mb: 2, color: "#333", fontWeight: 500 }}
              >
                {searchQuery
                  ? "Không tìm thấy từ vựng phù hợp"
                  : "Thêm hoặc tìm từ vựng để bắt đầu học"}
              </Typography>
              <Button
                variant="text"
                sx={{
                  borderRadius: "20px",
                  textTransform: "none",
                  bgcolor: "#000",
                  color: "#fff",
                  py: 1.5,
                  px: 4,
                  fontSize: "1rem",
                  "&:hover": { bgcolor: "#333" },
                }}
                onClick={() => navigate("/vocabulary")}
              >
                Tìm kiếm từ vựng
              </Button>
            </Box>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 2,
              }}
            >
              {filteredVocabulary.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    px: 2,
                    py: 2,
                    borderRadius: "12px",
                    bgcolor: "#f6f7fb",
                    "&:hover": {
                      bgcolor: "#f0f0f0",
                      borderBottom: ".25rem solid #a8b1ff",
                    },
                    transition: "background-color 0.2s",
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    handleNavigateToVocabularyById(item.article_id)
                  }
                >
                  <Box
                    component="img"
                    src={item.image}
                    alt={item.word}
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: "8px",
                      mr: 2,
                      objectFit: "cover",
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                        color: "#333",
                      }}
                    >
                      {item.word}
                    </Typography>
                    {isLoading[item.word] ? (
                      <CircularProgress size={16} sx={{ mt: 1 }} />
                    ) : error[item.word] ? (
                      <Typography
                        variant="body2"
                        sx={{ color: "#d32f2f", mt: 0.5 }}
                      >
                        {error[item.word]}
                      </Typography>
                    ) : (
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#666",
                          mt: 0.5,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        Nghĩa: {translations[item.word] || "Đang tải..."}
                      </Typography>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </>
      )}

      {tabValue === 1 && (
        <>
          {/* Filter and Search Bar */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
            <Select
              value={filter}
              onChange={handleFilterChange}
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="Sắp xếp">Sắp xếp</MenuItem>
              <MenuItem value="Tăng dần A-Z">Tăng dần A-Z</MenuItem>
              <MenuItem value="Giảm dần Z-A">Giảm dần Z-A</MenuItem>
            </Select>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                border: "1px solid #ccc",
                borderRadius: "20px",
                pl: 2,
              }}
            >
              <InputBase
                placeholder="Tìm kiếm thẻ ghi nhớ"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <IconButton sx={{ border: "none" }}>
                <SearchIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Conditional Rendering for Flashcards */}
          {isLoading.flashcards ? (
            <Box sx={{ textAlign: "center", mt: 8, mb: 4 }}>
              <CircularProgress />
              <Typography variant="h6" sx={{ mt: 2 }}>
                Đang tải thẻ ghi nhớ...
              </Typography>
            </Box>
          ) : error.flashcards ? (
            <Box sx={{ textAlign: "center", mt: 8, mb: 4 }}>
              <AssignmentIcon sx={{ fontSize: 80, color: "#f5a623", mb: 3 }} />
              <Typography
                variant="h6"
                sx={{ mb: 2, color: "#d32f2f", fontWeight: 500 }}
              >
                {error.flashcards}
              </Typography>
              <Button
                variant="contained"
                sx={{
                  borderRadius: "20px",
                  textTransform: "none",
                  bgcolor: "#000",
                  color: "#fff",
                  py: 1.5,
                  px: 4,
                  fontSize: "1rem",
                  "&:hover": { bgcolor: "#333" },
                }}
                onClick={() => navigate("/flashcards")}
              >
                Tìm kiếm thẻ ghi nhớ
              </Button>
            </Box>
          ) : filteredFlashcards.length === 0 ? (
            <Box sx={{ textAlign: "center", mt: 8, mb: 4 }}>
              <AssignmentIcon sx={{ fontSize: 80, color: "#f5a623", mb: 3 }} />
              <Typography
                variant="h6"
                sx={{ mb: 2, color: "#333", fontWeight: 500 }}
              >
                {searchQuery
                  ? "Không tìm thấy thẻ ghi nhớ phù hợp"
                  : "Tạo hoặc tìm các bộ thẻ ghi nhớ để học tập hiệu quả hơn"}
              </Typography>
              <Button
                variant="contained"
                sx={{
                  borderRadius: "20px",
                  textTransform: "none",
                  bgcolor: "#000",
                  color: "#fff",
                  py: 1.5,
                  px: 4,
                  fontSize: "1rem",
                  "&:hover": { bgcolor: "#333" },
                }}
                onClick={() => navigate("/flashcards")}
              >
                Tìm kiếm thẻ ghi nhớ
              </Button>
            </Box>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 2,
              }}
            >
              {filteredFlashcards.map((flashcard) => (
                <Box
                  key={flashcard.id}
                  sx={{
                    px: 2,
                    py: 2,
                    borderRadius: "12px",
                    bgcolor: "#f6f7fb",
                    "&:hover": {
                      bgcolor: "#f0f0f0",
                      borderBottom: ".25rem solid #a8b1ff",
                    },
                    transition: "background-color 0.2s",
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    handleNavigateToFlashcardById(flashcard.article_id)
                  }
                >
                  <Box
                    component="img"
                    src={flashcard.image}
                    alt={flashcard.title}
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: "8px",
                      mr: 2,
                      objectFit: "cover",
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                        color: "#333",
                      }}
                    >
                      {flashcard.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#666",
                        mt: 0.5,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      Words: {flashcard.word.join(", ") || "N/A"}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </>
      )}

      {tabValue === 2 && (
        <>
          {/* Filter and Search Bar */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
            <Select
              value={filter}
              onChange={handleFilterChange}
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="Sắp xếp">Sắp xếp</MenuItem>
              <MenuItem value="Tăng dần A-Z">Tăng dần A-Z</MenuItem>
              <MenuItem value="Giảm dần Z-A">Giảm dần Z-A</MenuItem>
            </Select>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                border: "1px solid #ccc",
                borderRadius: "20px",
                pl: 2,
              }}
            >
              <InputBase
                placeholder="Tìm kiếm bài kiểm tra thử"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <IconButton sx={{ border: "none" }}>
                <SearchIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Conditional Rendering for Questions */}
          {isLoading.questions ? (
            <Box sx={{ textAlign: "center", mt: 8, mb: 4 }}>
              <CircularProgress />
              <Typography variant="h6" sx={{ mt: 2 }}>
                Đang tải bài kiểm tra...
              </Typography>
            </Box>
          ) : error.questions ? (
            <Box sx={{ textAlign: "center", mt: 8, mb: 4 }}>
              <AssignmentIcon sx={{ fontSize: 80, color: "#f5a623", mb: 3 }} />
              <Typography
                variant="h6"
                sx={{ mb: 2, color: "#d32f2f", fontWeight: 500 }}
              >
                {error.questions}
              </Typography>
              <Button
                variant="contained"
                sx={{
                  borderRadius: "20px",
                  textTransform: "none",
                  bgcolor: "#000",
                  color: "#fff",
                  py: 1.5,
                  px: 4,
                  fontSize: "1rem",
                  "&:hover": { bgcolor: "#333" },
                }}
                onClick={handleNavigateToQuiz}
              >
                Tìm kiếm bài kiểm tra thử
              </Button>
            </Box>
          ) : filteredQuestions.length === 0 ? (
            <Box sx={{ textAlign: "center", mt: 8, mb: 4 }}>
              <AssignmentIcon sx={{ fontSize: 80, color: "#f5a623", mb: 3 }} />
              <Typography
                variant="h6"
                sx={{ mb: 2, color: "#333", fontWeight: 500 }}
              >
                {searchQuery
                  ? "Không tìm thấy bài kiểm tra phù hợp"
                  : "Tìm và làm các bài kiểm tra thử dựa trên những gì bạn đang học"}
              </Typography>
              <Button
                variant="contained"
                sx={{
                  borderRadius: "20px",
                  textTransform: "none",
                  bgcolor: "#000",
                  color: "#fff",
                  py: 1.5,
                  px: 4,
                  fontSize: "1rem",
                  "&:hover": { bgcolor: "#333" },
                }}
                onClick={handleNavigateToQuiz}
              >
                Tìm kiếm bài kiểm tra thử
              </Button>
            </Box>
          ) : (
            <List sx={{ px: 0 }}>
              {filteredQuestions.map((attempt) => (
                <React.Fragment key={attempt.id}>
                  <ListItem
                    sx={{
                      px: 2,
                      py: 2,
                      borderRadius: "12px",
                      bgcolor: "#f6f7fb",
                      "&:hover": {
                        bgcolor: "#f0f0f0",
                        borderBottom: ".25rem solid #a8b1ff",
                      },
                      transition: "background-color 0.2s",
                    }}
                    onClick={() =>
                      handleNavigateToArticleById(attempt.article_id)
                    }
                  >
                    <Box
                      component="img"
                      src={attempt.image}
                      alt={attempt.title}
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: "8px",
                        mr: 2,
                        objectFit: "cover",
                      }}
                    />
                    <ListItemText
                      primary={
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            flexWrap: "wrap",
                          }}
                        >
                          <Typography
                            sx={{
                              fontWeight: "bold",
                              fontSize: "1.1rem",
                              color: "#333",
                            }}
                          >
                            {attempt.title}
                          </Typography>
                          <Chip
                            label={`${attempt.correct_answers}/${attempt.total_questions}`}
                            sx={{
                              bgcolor:
                                attempt.correct_answers /
                                  attempt.total_questions >=
                                0.7
                                  ? "#e0f7fa"
                                  : "#ffebee",
                              color:
                                attempt.correct_answers /
                                  attempt.total_questions >=
                                0.7
                                  ? "#006064"
                                  : "#c62828",
                              fontWeight: 500,
                            }}
                          />
                          <Box
                            sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}
                          >
                            {attempt.tags &&
                              attempt.tags.map((tag, index) => (
                                <Chip
                                  key={index}
                                  label={tag}
                                  size="small"
                                  sx={{
                                    bgcolor: "#e8f0fe",
                                    color: "#1967d2",
                                    fontWeight: 400,
                                  }}
                                />
                              ))}
                          </Box>
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 0.5 }}>
                          <Typography variant="body2" sx={{ color: "#666" }}>
                            Bắt đầu:{" "}
                            {new Date(attempt.started_at).toLocaleString()}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#666" }}>
                            Kết thúc:{" "}
                            {new Date(attempt.ended_at).toLocaleString()}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              mt: 0.5,
                              color:
                                attempt.correct_answers /
                                  attempt.total_questions >=
                                0.7
                                  ? "#2e7d32"
                                  : "#d32f2f",
                              fontWeight: 500,
                            }}
                          >
                            Kết quả:{" "}
                            {(
                              (attempt.correct_answers /
                                attempt.total_questions) *
                              100
                            ).toFixed(1)}
                            %
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  <Divider sx={{ my: 1 }} />
                </React.Fragment>
              ))}
            </List>
          )}
        </>
      )}
    </Box>
  );
};

export default YourLibrary;