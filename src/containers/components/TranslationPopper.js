import React, { useState, useEffect, useRef } from "react";
import {
  Popper,
  Paper,
  Fade,
  CircularProgress,
  Typography,
} from "@mui/material";

const TranslationPopper = () => {
  const [translatedText, setTranslatedText] = useState("");
  const [popperPosition, setPopperPosition] = useState({ top: 0, left: 0 });
  const [openPopper, setOpenPopper] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
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

  // Xử lý khi bôi đen văn bản
  const handleMouseUp = (event) => {
    const selection = window.getSelection();
    const selected = selection.toString().trim();

    if (selected) {
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
      setError(null);
    }
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
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              {isLoading ? (
                <CircularProgress size={20} sx={{ color: "white" }} />
              ) : error ? (
                <Typography variant="body1" fontWeight="medium" color="white">
                  {error}
                </Typography>
              ) : (
                <Typography variant="body1" fontWeight="medium" color="white">
                  {translatedText}
                </Typography>
              )}
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  );
};

export default TranslationPopper;