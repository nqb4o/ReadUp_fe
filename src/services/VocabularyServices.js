import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000',
    timeout: 5000,
});

const handleAddVocabulary = (user_id, word, article_id) => {
    axiosInstance.post("/api/vocabulary/add", { user_id, word, article_id, })
}

export {
    handleAddVocabulary
}