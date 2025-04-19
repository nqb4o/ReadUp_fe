import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000', // Replace with your backend URL
    timeout: 5000,
});

const getAuthHeader = () => ({
    'Authorization': sessionStorage.getItem('authToken'),
});

// Fetch a single article by ID
const getArticleByIdApi = async (id) => {
    return axiosInstance.get(`/api/article/${id}`, {
        headers: {
            ...getAuthHeader(),
        },
    });
};

// Fetch all articles
const fetchArticleApi = async () => {
    return axiosInstance.get('/api/articles', {
        headers: {
            ...getAuthHeader(),
        },
    });
};

// Delete an article by ID
const deleteArticleApi = async (id) => {
    return axiosInstance.delete(`/api/article/${id}`, {
        headers: {
            ...getAuthHeader(),
        },
    });
};

// Create a new article with an image
const createArticleWithImageApi = async (articleData, imageFile) => {
    const formData = new FormData();
    formData.append('title', articleData.title);
    formData.append('content', articleData.content);
    formData.append('publicationDate', articleData.publicationDate);
    formData.append('image', imageFile);

    return axiosInstance.post('/api/article', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            ...getAuthHeader(),
        },
    });
};

// Update an existing article with an image
const updateArticleWithImageApi = async (id, articleData, imageFile) => {
    const formData = new FormData();
    formData.append('title', articleData.title);
    formData.append('content', articleData.content);
    formData.append('publicationDate', articleData.publicationDate);
    if (imageFile) {
        formData.append('image', imageFile);
    }

    return axiosInstance.put(`/api/article/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            ...getAuthHeader(),
        },
    });
};

export {
    getArticleByIdApi,
    fetchArticleApi,
    deleteArticleApi,
    createArticleWithImageApi,
    updateArticleWithImageApi,
};