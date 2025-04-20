import React, { useState, useEffect, useRef } from "react";
import {
    Popper,
    Paper,
    Fade,
    CircularProgress,
    Typography,
    Button,
    Snackbar,
    Alert,
} from "@mui/material";
import { handleAddVocabulary } from "../../services/VocabularyServices"; // Import your vocabulary service

const TranslationPopper = () => {
    const [translatedText, setTranslatedText] = useState("");
    const [originalText, setOriginalText] = useState("");
    const [popperPosition, setPopperPosition] = useState({ top: 0, left: 0 });
    const [openPopper, setOpenPopper] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const anchorRef = useRef(null);

    // Update the translateText function to fetch the meaning of the word
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

    // Update the handleAddToDictionary function to send the selected word to the backend
    const handleAddToDictionary = async () => {
        const userData = JSON.parse(sessionStorage.getItem("user") || "{}");
        const user_id = userData.id;

        if (!user_id) {
            setSnackbarMessage("Vui lòng đăng nhập để thêm từ vào thư viện");
            setSnackbarOpen(true);
            return;
        }

        const pathname = window.location.pathname;
        const pathSegments = pathname.split("/");
        const article_id = pathSegments[pathSegments.length - 1];

        // Kiểm tra article_id có tồn tại hay không
        if (!article_id) {
            console.error("Invalid article ID from URL:", article_id);
            setSnackbarMessage(
                "Không thể xác định bài viết hiện tại. Vui lòng thử lại."
            );
            setSnackbarOpen(true);
            return;
        }

        try {
            const vocabData = {
                user_id: user_id,
                word: originalText,
                article_id: article_id,
            };

            const response = await handleAddVocabulary(vocabData);

            if (response.status === 201) {
                setSnackbarMessage(`Đã thêm "${originalText}" vào thư viện`);
            } else {
                setSnackbarMessage("Không thể thêm từ vào thư viện. Vui lòng thử lại.");
            }

            setSnackbarOpen(true);
        } catch (error) {
            console.error("Error adding word to library:", error);
            setSnackbarMessage("Không thể thêm từ vào thư viện. Vui lòng thử lại.");
            setSnackbarOpen(true);
        }
    };

    // Update the handleMouseUp function to trigger the translation API
    const handleMouseUp = () => {
        const selection = window.getSelection();
        const selected = selection.toString().trim();

        if (selected) {
            setOriginalText(selected);

            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();

            setPopperPosition({
                top: rect.top + window.scrollY - 40,
                left: rect.right + window.scrollX + 10,
            });

            setOpenPopper(true);

            // translateText(selected);
        } else {
            setOpenPopper(false);
            setTranslatedText("");
            setOriginalText("");
            setError(null);
        }
    };

    // Đóng Snackbar
    const handleCloseSnackbar = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setSnackbarOpen(false);
    };

    // Thêm sự kiện bôi đen cho toàn bộ document
    useEffect(() => {
        document.addEventListener("mouseup", handleMouseUp);
        return () => {
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, []);

    // Cập nhật vị trí popper khi scroll
    useEffect(() => {
        const handleScroll = () => {
            if (openPopper) {
                const selection = window.getSelection();
                if (selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0);
                    const rect = range.getBoundingClientRect();
                    setPopperPosition({
                        top: rect.top + window.scrollY - 40,
                        left: rect.right + window.scrollX + 10,
                    });
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [openPopper]);

    return (
        <>
            {/* Tạo một div ẩn làm anchor cho Popper */}
            <div
                ref={anchorRef}
                style={{
                    position: "absolute",
                    top: popperPosition.top,
                    left: popperPosition.left,
                    width: 1,
                    height: 1,
                    pointerEvents: "none",
                }}
            />

            <Popper
                open={openPopper}
                anchorEl={anchorRef.current}
                placement="top-end"
                transition
                sx={{ zIndex: 1500 }}
                modifiers={[
                    {
                        name: "offset",
                        options: {
                            offset: [0, 10],
                        },
                    },
                    {
                        name: "preventOverflow",
                        options: {
                            boundariesElement: "viewport",
                        },
                    },
                ]}
            >
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={350}>
                        <Paper
                            sx={{
                                p: 2,
                                bgcolor: "rgba(0, 0, 0, 0.8)",
                                borderRadius: 2,
                                maxWidth: "300px",
                            }}
                        >
                            {isLoading ? (
                                <CircularProgress size={20} sx={{ color: "white" }} />
                            ) : error ? (
                                <Typography variant="body1" fontWeight="medium" color="white">
                                    {error}
                                </Typography>
                            ) : (
                                <div>
                                    <Typography variant="body2" color="white" mb={0.5}>
                                        <strong>{originalText}</strong>
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        fontWeight="medium"
                                        color="white"
                                        mb={1}
                                    >
                                        {translatedText}
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={handleAddToDictionary}
                                    // sx={{
                                    //     color: "white",
                                    //     borderColor: "white",
                                    //     "&:hover": {
                                    //         borderColor: "#ffffff",
                                    //         backgroundColor: "rgba(255, 255, 255, 0.1)",
                                    //     },
                                    // }}
                                    >
                                        Thêm từ vào từ điển
                                    </Button>
                                </div>
                            )}
                        </Paper>
                    </Fade>
                )}
            </Popper>

            {/* Snackbar thông báo */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity="success"
                    sx={{ width: "100%" }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default TranslationPopper;