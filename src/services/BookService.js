import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000',
    timeout: 5000,
});

const getAuthHeader = () => ({
    'Authorization': sessionStorage.getItem('authToken')
});

const fetchBookApi = () => {
    return axiosInstance.get('/api/book');
}

const getBookByIdApi = (id) => {
    return axiosInstance.get(`/api/book/${id}`);
};

const createBookApi = (bookData) => {
    return axiosInstance.post('/api/book', bookData, {
        headers: getAuthHeader()
    });
};

const updateBookApi = (id, bookData) => {
    return axiosInstance.put(`/api/book/${id}`, bookData, {
        headers: getAuthHeader()
    });
};

const deleteBookApi = (id) => {
    return axiosInstance.delete(`/api/book/${id}`, {
        headers: getAuthHeader()
    });
};

export {
    fetchBookApi,
    getBookByIdApi,
    createBookApi,
    updateBookApi,
    deleteBookApi
}