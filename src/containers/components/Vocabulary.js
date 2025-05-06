import React from "react";
import VocabularyTable from "./VocabularyTable";
import VocabularyLanding from "./VocabalaryLanding";
import { useAuth } from "../../contexts/AuthContext";

const Vocabulary = () => {
    const { isAuthenticated } = useAuth();
    return (
        <>
            {
                isAuthenticated ? (
                    <VocabularyTable />
                ) : (
                    <VocabularyLanding />
                )
            }

        </>
    );
};

export default Vocabulary;