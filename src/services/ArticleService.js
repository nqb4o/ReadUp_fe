import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:5000",
    timeout: 5000,
});

const getAuthHeader = () => ({
    Authorization: sessionStorage.getItem("authToken"),
});

const fetchArticleApi = () => {
    return axiosInstance.get("/api/article");
};

const getArticleByIdApi = (id) => {
    return axiosInstance.get(`/api/article/${id}`, {
        headers: getAuthHeader(),
    });
};

const createArticleApi = (articleData) => {
    return axiosInstance.post("/api/article", articleData, {
        headers: getAuthHeader(),
    });
};

const updateArticleApi = (id, articleData) => {
    return axiosInstance.put(`/api/article/${id}`, articleData, {
        headers: getAuthHeader(),
    });
};

const deleteArticleApi = (id) => {
    return axiosInstance.delete(`/api/article/${id}`, {
        headers: getAuthHeader(),
    });
};

export {
    fetchArticleApi,
    getArticleByIdApi,
    createArticleApi,
    updateArticleApi,
    deleteArticleApi,
};
