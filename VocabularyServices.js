import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:5000", 
    timeout: 5000,
});

const getAuthHeader = () => ({
    Authorization: sessionStorage.getItem("authToken"),
});


const handleGetVocabulary = () => {
    return axiosInstance.get("/api/vocabulary");
};


const handleAddVocabulary = (vocabData) => {
    return axiosInstance.post("/api/vocabulary", vocabData, {
        headers: getAuthHeader(),
    });
};


export { handleGetVocabulary, handleAddVocabulary };