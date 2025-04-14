import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000',
    timeout: 5000,
});

const getAuthHeader = () => ({
    'Authorization': sessionStorage.getItem('authToken')
});

const handleAddVocabulary = (vocabData) => {
    return axiosInstance.post("/api/vocabulary/add", vocabData, {
        headers: getAuthHeader()
    })
}

export {
    handleAddVocabulary
}