import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:5000",
    timeout: 5000,
});

const getAuthHeader = () => ({
    Authorization: sessionStorage.getItem("authToken"),
});

const getQuizQuestionApi = () => {
    return axiosInstance.get("/api/quiz/questions", {
        headers: getAuthHeader(),
    });
}

const getQuizQuestionAndAnswerApi = (id) => {
    return axiosInstance.get(`/api/quiz/questions/answers/${id}`, {
        headers: getAuthHeader(),
    });
}

const postQuizSubmit = (payload) => {
    return axiosInstance.post("/api/quiz/submit", payload, {
        headers: getAuthHeader(),
    });
};

const getAttemptDetail = (attempt_id) => {
    return axiosInstance.get(`/api/quiz/attempt/${attempt_id}`, {
        headers: getAuthHeader(),
    });
}

// Lấy tất cả câu hỏi quiz (admin)
const getAllQuizQuestions = () => {
    return axiosInstance.get("/api/quiz", {
        headers: getAuthHeader(),
    });
};

// Thêm câu hỏi quiz (admin)
const createQuizQuestion = (payload) => {
    return axiosInstance.post("/api/quiz", payload, {
        headers: getAuthHeader(),
    });
};

// Sửa câu hỏi quiz (admin)
const updateQuizQuestion = (id, payload) => {
    return axiosInstance.put(`/api/quiz/${id}`, payload, {
        headers: getAuthHeader(),
    });
};

// Xóa câu hỏi quiz (admin)
const deleteQuizQuestion = (id) => {
    return axiosInstance.delete(`/api/quiz/${id}`, {
        headers: getAuthHeader(),
    });
};

export {
    getQuizQuestionApi,
    postQuizSubmit,
    getAllQuizQuestions,
    createQuizQuestion,
    updateQuizQuestion,
    deleteQuizQuestion,
    getQuizQuestionAndAnswerApi,
    getAttemptDetail
};
