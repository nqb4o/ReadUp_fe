import React from "react";
import {
    Drawer,
    Box,
    Typography,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Divider,
    Stack,
} from "@mui/material";
import { Close, Delete, Favorite, VolumeUp as VolumeUpIcon } from "@mui/icons-material";
import { useCart } from "../../contexts/CartContext";
import { styled } from "@mui/system";

// Styled components
const StyledListItem = styled(ListItem)(({ theme }) => ({
    borderRadius: theme.spacing(1),
    background: "linear-gradient(145deg, #f5f7fa 0%, #e8ecef 100%)",
    marginBottom: theme.spacing(1),
    padding: theme.spacing(1, 2),
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
    transition: "transform 0.3s ease, color 0.3s ease",
    "&:hover": {
        transform: "scale(1.1)",
        color: theme.palette.primary.main,
    },
}));

const StyledDeleteButton = styled(IconButton)(({ theme }) => ({
    transition: "transform 0.3s ease, color 0.3s ease",
    "&:hover": {
        transform: "scale(1.1)",
        color: theme.palette.error.main,
    },
}));

export default function FavoritesDrawer({ open, onClose }) {
    const { favorites, removeFromFavorites } = useCart();

    // Hàm phát âm
    const handlePlayAudio = (word, pronunciation) => {
        if ("speechSynthesis" in window) {
            const utterance = new SpeechSynthesisUtterance(word);
            utterance.lang = pronunciation === "uk" ? "en-GB" : "en-US";
            window.speechSynthesis.speak(utterance);
        } else {
            alert("Sorry, your browser does not support speech synthesis.");
        }
    };

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: { xs: "100%", sm: 400 },
                },
            }}
        >
            <Box sx={{ p: 2 }}>
                {/* Tiêu đề */}
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                    <Typography variant="h6" component="div" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Favorite color="error" /> Wishlist
                    </Typography>
                    <IconButton onClick={onClose}>
                        <Close />
                    </IconButton>
                </Box>

        <Divider sx={{ mb: 2 }} />

                {/* Danh sách từ yêu thích */}
                {favorites.length === 0 ? (
                    <Typography color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
                        No favorite words yet
                    </Typography>
                ) : (
                    <List>
                        {favorites.map((item, index) => (
                            <StyledListItem key={index}>
                                <ListItemText
                                    primary={
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            {/* Từ vựng */}
                                            <Typography
                                                variant="body1"
                                                fontWeight="medium"
                                                sx={{ color: "primary.dark", minWidth: "100px" }}
                                            >
                                                {item.word}
                                            </Typography>
                                            {/* Cách đọc UK và US */}
                                            <Stack direction="column" spacing={0.5}>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Typography variant="body2" color="text.secondary" sx={{ minWidth: "80px" }}>
                                                        UK: {item.pronunciation.uk}
                                                    </Typography>
                                                    <StyledIconButton
                                                        onClick={() => handlePlayAudio(item.word, "uk")}
                                                        size="small"
                                                    >
                                                        <VolumeUpIcon fontSize="small" />
                                                    </StyledIconButton>
                                                </Stack>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Typography variant="body2" color="text.secondary" sx={{ minWidth: "80px" }}>
                                                        US: {item.pronunciation.us}
                                                    </Typography>
                                                    <StyledIconButton
                                                        onClick={() => handlePlayAudio(item.word, "us")}
                                                        size="small"
                                                    >
                                                        <VolumeUpIcon fontSize="small" />
                                                    </StyledIconButton>
                                                </Stack>
                                            </Stack>
                                        </Stack>
                                    }
                                />
                                <ListItemSecondaryAction>
                                    <StyledDeleteButton
                                        edge="end"
                                        onClick={() => removeFromFavorites(item.word)}
                                    >
                                        <Delete />
                                    </StyledDeleteButton>
                                </ListItemSecondaryAction>
                            </StyledListItem>
                        ))}
                    </List>
                )}
            </Box>
        </Drawer>
    );
}