import React, { useState } from "react";
import {
    Box,
    Typography,
    TextField,
    IconButton,
    Paper,
    Avatar,
} from "@mui/material";
import CommentIcon from "@mui/icons-material/Comment";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";

const ChatBox = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([
        {
            sender: "bot",
            text: "Hello there! 👋 Nice to meet you!",
        },
        {
            sender: "bot",
            text: "How can I help you today?",
        },
    ]);

    const handleToggleChat = () => {
        setIsOpen(!isOpen);
    };

    const handleSendMessage = () => {
        if (message.trim()) {
            setMessages([...messages, { sender: "user", text: message }]);
            setMessage("");
            // Hardcoded response
            setTimeout(() => {
                setMessages((prev) => [
                    ...prev,
                    { sender: "bot", text: "I'm here to help! What do you need?" },
                ]);
            }, 1000);
        }
    };

    return (
        <Box
            sx={{
                position: "fixed",
                bottom: 20,
                left: 20,
                zIndex: 1500,
            }}
        >
            {/* Icon để mở/đóng chatbox */}
            <IconButton
                onClick={handleToggleChat}
                sx={{
                    backgroundColor: "#000",
                    color: "white",
                    "&:hover": {
                        backgroundColor: "#fff",
                        color: "#000",
                    },
                }}
            >
                {isOpen ? <CloseIcon /> : <CommentIcon />}
            </IconButton>

            {/* Chatbox */}
            {isOpen && (
                <Paper
                    elevation={3}
                    sx={{
                        position: "absolute",
                        bottom: 60,
                        left: 0,
                        width: 300,
                        height: 400,
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: 2,
                        overflow: "hidden",
                    }}
                >
                    {/* Header của chatbox */}
                    <Box
                        sx={{
                            bgcolor: "#000",
                            p: 2,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                        }}
                    >
                        <Avatar
                            src="https://www.pngall.com/wp-content/uploads/13/React-Logo-PNG-Image-HD.png"
                            sx={{ width: 30, height: 30 }}
                        />
                        <Typography variant="h6" color="white">
                            AI ChatBot
                        </Typography>
                    </Box>

                    {/* Khu vực hiển thị tin nhắn */}
                    <Box
                        sx={{
                            flex: 1,
                            p: 2,
                            overflowY: "auto",
                            bgcolor: "#f5f5f5",
                        }}
                    >
                        {messages.map((msg, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: "flex",
                                    justifyContent:
                                        msg.sender === "user" ? "flex-end" : "flex-start",
                                    mb: 1,
                                }}
                            >
                                <Paper
                                    sx={{
                                        p: 1,
                                        bgcolor: msg.sender === "user" ? "primary.main" : "white",
                                        color: msg.sender === "user" ? "white" : "text.primary",
                                        borderRadius: 2,
                                        maxWidth: "70%",
                                    }}
                                >
                                    <Typography variant="body2">{msg.text}</Typography>
                                </Paper>
                            </Box>
                        ))}
                    </Box>

                    {/* Ô nhập tin nhắn */}
                    <Box sx={{ p: 2, bgcolor: "white" }}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Write a message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === "Enter") handleSendMessage();
                            }}
                            InputProps={{
                                endAdornment: (
                                    <IconButton
                                        onClick={handleSendMessage}
                                        size="small"
                                        sx={{
                                            border: "unset",
                                            backgroundColor: "transparent",
                                            "&:hover": {
                                                backgroundColor: "transparent",
                                            },
                                        }}
                                    >
                                        <SendIcon />
                                    </IconButton>
                                ),
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 2,
                                },
                            }}
                        />
                    </Box>
                </Paper>
            )}
        </Box>
    );
};

export default ChatBox;