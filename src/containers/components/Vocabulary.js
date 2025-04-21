import React, { useState } from "react";
import { Container } from "@mui/material";
import VocabularyTable from "./VocabularyTable";
import VocabularyLanding from "./VocabalaryLanding";
import { useAuth } from "../../contexts/AuthContext";

const Vocabulary = () => {
    const { isAuthenticated } = useAuth();
    return (
        <Container maxWidth="lg" sx={{ pt: 6 }}>
            {
                isAuthenticated ? (
                    <VocabularyTable />
                ) : (
                    <VocabularyLanding />
                )
            }
        </Container>
    );
};

export default Vocabulary;