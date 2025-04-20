import React from "react";
import { Paper, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const ArticleSummary = ({ summary }) => {
    return (
        <Paper
            elevation={0}
            sx={{
                bgcolor: "primary.lightest" || "#f0f5ff",
                p: 3,
                mb: 4,
                borderRadius: 2,
                border: 1,
                borderColor: "primary.light",
            }}
        >
            <Typography
                variant="h6"
                component="h2"
                fontWeight="bold"
                gutterBottom
                sx={{ color: "primary.dark" }}
            >
                Summary
            </Typography>
            {summary ? (
                <Typography variant="body1" color="text.primary">
                    {summary}
                </Typography>
            ) : (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 100 }}>
                    <CircularProgress />
                </Box>
            )}
        </Paper>
    );
};

export default ArticleSummary;