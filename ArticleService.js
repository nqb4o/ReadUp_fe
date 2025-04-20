import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000',
    timeout: 5000,
});

const getAuthHeader = () => ({
    'Authorization': sessionStorage.getItem('authToken')
});

const fetchArticleApi = () => {
    return axiosInstance.get('/api/article');
}

const getArticleByIdApi = (id) => {
    return axiosInstance.get(`/api/article/${id}`);
};

const createArticleApi = (articleData) => {
    // articleData includes an image URL, not a file
    return axiosInstance.post('/api/article', articleData, {
        headers: getAuthHeader()
    });
};

const updateArticleApi = (id, articleData) => {
    // articleData includes an image URL, not a file
    return axiosInstance.put(`/api/article/${id}`, articleData, {
        headers: getAuthHeader()
    });
};

const deleteArticleApi = (id) => {
    return axiosInstance.delete(`/api/article/${id}`, {
        headers: getAuthHeader()
    });
};

export {
    fetchArticleApi,
    getArticleByIdApi,
    createArticleApi,
    updateArticleApi,
    deleteArticleApi
}