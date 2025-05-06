import React from "react";
import { Paper, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const ArticleSummary = ({ summary }) => {
    return (
        <>
            {
                summary ? (
                    <Typography variant="body1" color="text.primary">
                        {summary}
                    </Typography>
                ) : (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 100 }}>
                        <CircularProgress />
                    </Box>
                )
            }
        </>
    );
};

export default ArticleSummary;