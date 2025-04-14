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

    // Call API để dịch văn bản
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

    // Hàm xử lý khi bấm nút "Thêm từ vào từ điển"
    const handleAddToDictionary = async () => {
        try {
            // Gọi API để thêm từ vào từ điển
            const response = await handleAddVocabulary(1, originalText, 0); // Replace with the actual user_id and article_id if available
            if (response.status === 201) {
                setSnackbarMessage(`Đã thêm "${originalText}" vào từ điển`);
            } else {
                setSnackbarMessage("Không thể thêm từ vào từ điển. Vui lòng thử lại.");
            }
            // Hiển thị thông báo thành công
            setSnackbarOpen(true);
        } catch (error) {
            console.error("Error adding word to dictionary:", error);
            setSnackbarMessage("Không thể thêm từ vào từ điển. Vui lòng thử lại.");
            setSnackbarOpen(true);
        }
    };

    // Xử lý khi bôi đen văn bản
    const handleMouseUp = (event) => {
        const selection = window.getSelection();
        const selected = selection.toString().trim();

        if (selected) {
            // Lưu lại văn bản gốc
            setOriginalText(selected);

            // Lấy tọa độ của vùng bôi đen
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();

            // Cập nhật vị trí popper, tính toán với scroll
            setPopperPosition({
                top: rect.top + window.scrollY - 40,
                left: rect.right + window.scrollX + 10,
            });

            setOpenPopper(true);

            // Gọi API để dịch
            translateText(selected);
        } else {
            setOpenPopper(false);
            setTranslatedText("");
            setOriginalText("");
            setError(null);
        }
    };

    // Đóng Snackbar
    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
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
                                    <Typography variant="body1" fontWeight="medium" color="white" mb={1}>
                                        {translatedText}
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={handleAddToDictionary}
                                        sx={{
                                            color: "white",
                                            borderColor: "white",
                                            "&:hover": {
                                                borderColor: "#ffffff",
                                                backgroundColor: "rgba(255, 255, 255, 0.1)",
                                            },
                                        }}
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
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default TranslationPopper;