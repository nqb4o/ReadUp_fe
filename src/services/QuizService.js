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

const getQuizRandom = () => {
  return axiosInstance.get("/api/quiz/random", {
    headers: getAuthHeader(),
  });
}

const postQuizSubmit = (payload) => {
  return axiosInstance.post("/api/quiz/submit", payload, {
    headers: getAuthHeader(),
  });
};

export { getAllQuiz, getQuizRandom, postQuizSubmit };
