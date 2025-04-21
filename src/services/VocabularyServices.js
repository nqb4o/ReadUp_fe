import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:5000",
    timeout: 5000,
});

const getAuthHeader = () => ({
    Authorization: sessionStorage.getItem("authToken"),
});

const handleAddVocabulary = (vocabData) => {
    return axiosInstance.post("/api/vocabulary/add", vocabData, {
        headers: getAuthHeader(),
    });
};

const handleGetVocabularyByUserId = (user_id) => {
    return axiosInstance.get(`/api/vocabulary/${user_id}`, {
        headers: getAuthHeader(),
    });
};

const handleDeleteVocabulary = (id) => {
    return axiosInstance.get(`/api/vocabulary/${id}`, {
        headers: getAuthHeader(),
    });
};

const handleGetVocabularyByArticleId = (articleId) => {
    return axiosInstance.get(`/api/vocabulary/${articleId}`, {
        headers: getAuthHeader(),
    });
};

export {
    handleAddVocabulary,
    handleGetVocabularyByUserId,
    handleGetVocabularyByArticleId,
    handleDeleteVocabulary
};