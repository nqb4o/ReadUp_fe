import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000',
    timeout: 5000,
});

const handleLoginApi = (email, password) => {
    return axiosInstance.post('/api/auth/login', { email, password })
}

const handleRegisterApi = (name, email, password) => {
    return axiosInstance.post('/api/auth/register', { name, email, password })
}

const fetchUsersApi = () => {
    return axiosInstance.get('/api/auth/me', {
        headers: {
            'Authorization': sessionStorage.getItem('authToken'),
        }
    })
}

const forgotPasswordApi = (email) => {
    return axiosInstance.post('/api/auth/email-reset-password', { email })
}

const enterNewPasswordApi = (password, token) => {
    return axiosInstance.post('/api/auth/enter-reset-password', { password, token })
}

const googleAuth = (email, name, sub) => {
    return axiosInstance.post('api/auth/google-auth', { email, name, sub })
}

const getGoogleDataApi = (token) => {
    const googleUserInfoUrl = "https://www.googleapis.com/oauth2/v3/userinfo";

    return axios.get(googleUserInfoUrl, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export {
    handleLoginApi,
    handleRegisterApi,
    fetchUsersApi,
    forgotPasswordApi,
    enterNewPasswordApi,
    googleAuth,
    getGoogleDataApi
}