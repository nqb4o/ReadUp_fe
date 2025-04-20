import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:5000",
    timeout: 5000,
});

const getAuthHeader = () => ({
    Authorization: sessionStorage.getItem("authToken"),
});

const getAllQuiz = () => {
    return axiosInstance.post("/api/article", {
        headers: getAuthHeader(),
    });
};

export { getAllQuiz };