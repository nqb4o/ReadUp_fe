import React, { useState, useRef, useEffect } from "react";
import {
    Box,
    Typography,
    TextField,
    IconButton,
    Paper,
    Avatar,
    CircularProgress,
    Fade,
    Tooltip
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import axios from "axios";

const ChatBox = ({ chatbotReady = true }) => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([
        {
            sender: "bot",
            text: "Xin chào! 👋 Tôi có thể giúp gì cho bạn?",
        },
        {
            sender: "bot",
            text: "Bạn có thể đặt câu hỏi về bài viết này.",
        },
    ]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Auto scroll to bottom on new messages
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSendMessage = async () => {
        if (message.trim()) {
            setMessages([...messages, { sender: "user", text: message }]);
            setMessage("");
            setLoading(true);

            try {
                const response = await axios.post("http://localhost:5000/api/chatbot/query", {
                    question: message,
                });

                setMessages((prev) => [
                    ...prev,
                    { sender: "bot", text: response.data.answer },
                ]);
            } catch (error) {
                console.error("Error querying chatbot:", error);
                setMessages((prev) => [
                    ...prev,
                    { sender: "bot", text: "Xin lỗi, tôi không thể xử lý yêu cầu của bạn." },
                ]);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <Box sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column"
        }}>
            {/* Chat Messages Area */}
            <Box
                sx={{
                    flex: 1,
                    p: 2,
                    overflowY: "auto",
                    bgcolor: "#f8fafc",
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5
                }}
            >
                {messages.map((msg, index) => (
                    <Fade key={index} in={true} timeout={300}>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                                alignItems: "flex-start",
                                gap: 1,
                            }}
                        >
                            {msg.sender === "bot" && (
                                <Avatar
                                    sx={{
                                        width: 32,
                                        height: 32,
                                        bgcolor: "#6366f1",
                                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                                    }}
                                >
                                    <SmartToyIcon sx={{ fontSize: 18 }} />
                                </Avatar>
                            )}

                            <Paper
                                elevation={0}
                                sx={{
                                    p: 1.5,
                                    px: 2,
                                    bgcolor: msg.sender === "user" ? "#6366f1" : "white",
                                    color: msg.sender === "user" ? "white" : "#334155",
                                    borderRadius: 2.5,
                                    maxWidth: "75%",
                                    boxShadow: msg.sender === "user"
                                        ? "0 3px 10px rgba(99, 102, 241, 0.2)"
                                        : "0 2px 8px rgba(0, 0, 0, 0.05)",
                                    border: msg.sender === "user" ? "none" : "1px solid #e2e8f0"
                                }}
                            >
                                <Typography variant="body2" sx={{
                                    lineHeight: 1.5,
                                    fontWeight: 400,
                                    fontSize: "0.95rem",
                                    whiteSpace: "pre-wrap"
                                }}>
                                    {msg.text}
                                </Typography>
                            </Paper>

                            {msg.sender === "user" && (
                                <Avatar
                                    sx={{
                                        width: 32,
                                        height: 32,
                                        bgcolor: "#cbd5e1",
                                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                                    }}
                                >
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: "0.85rem" }}>
                                        {/* First letter of "User" */}
                                        U
                                    </Typography>
                                </Avatar>
                            )}
                        </Box>
                    </Fade>
                ))}

                {loading && (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-start",
                            alignItems: "flex-start",
                            gap: 1,
                        }}
                    >
                        <Avatar
                            sx={{
                                width: 32,
                                height: 32,
                                bgcolor: "#6366f1",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                            }}
                        >
                            <SmartToyIcon sx={{ fontSize: 18 }} />
                        </Avatar>

                        <Paper
                            elevation={0}
                            sx={{
                                p: 1.5,
                                px: 2,
                                bgcolor: "white",
                                color: "#334155",
                                borderRadius: 2.5,
                                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                                border: "1px solid #e2e8f0",
                                display: "flex",
                                alignItems: "center",
                                gap: 1
                            }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <CircularProgress size={14} thickness={5} sx={{ color: "#6366f1" }} />
                                <Typography variant="body2">Đang trả lời...</Typography>
                            </Box>
                        </Paper>
                    </Box>
                )}
                <div ref={messagesEndRef} />
            </Box>

            {/* Input Area */}
            <Box sx={{
                p: 2,
                bgcolor: "white",
                borderTop: "1px solid #e2e8f0"
            }}>
                <TextField
                    fullWidth
                    size="small"
                    placeholder={
                        chatbotReady ? "Nhập câu hỏi của bạn..." : "Đang khởi tạo trợ lý..."
                    }
                    value={message}
                    disabled={!chatbotReady || loading}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === "Enter") handleSendMessage();
                    }}
                    InputProps={{
                        endAdornment: (
                            <Tooltip title="Gửi">
                                <IconButton
                                    onClick={handleSendMessage}
                                    disabled={!chatbotReady || loading || !message.trim()}
                                    size="small"
                                    sx={{
                                        color: "#6366f1",
                                        "&:hover": {
                                            backgroundColor: "rgba(99, 102, 241, 0.08)",
                                        },
                                        "&.Mui-disabled": {
                                            color: "#cbd5e1"
                                        }
                                    }}
                                >
                                    <SendIcon />
                                </IconButton>
                            </Tooltip>
                        ),
                    }}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                            border: "1px solid #e2e8f0",
                            "&:hover": {
                                borderColor: "#cbd5e1"
                            },
                            "&.Mui-focused": {
                                borderColor: "#6366f1",
                                boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.1)"
                            }
                        }
                    }}
                />

                <Typography
                    variant="caption"
                    sx={{
                        display: "block",
                        textAlign: "center",
                        mt: 1,
                        color: "#64748b",
                        fontSize: "0.7rem"
                    }}
                >
                    Powered by AI • Bạn có thể hỏi về nội dung bài viết
                </Typography>
            </Box>
        </Box>
    );
};

export default ChatBox;