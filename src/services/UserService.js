import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:5000",
    timeout: 5000,
});

const getAuthHeader = () => ({
    Authorization: sessionStorage.getItem("authToken"),
});

const getAllUsers = () => {
    return axiosInstance.get("/api/users", {
        headers: getAuthHeader(),
    });
};

const createUser = (userData) => {
    return axiosInstance.post("/api/users", userData, {
        headers: getAuthHeader(),
    });
};

const updateUser = (id, userData) => {
    return axiosInstance.put(`/api/users/${id}`, userData, {
        headers: getAuthHeader(),
    });
};

const deleteUser = (id) => {
    return axiosInstance.delete(`/api/users/${id}`, {
        headers: getAuthHeader(),
    });
};

export { getAllUsers, createUser, updateUser, deleteUser };