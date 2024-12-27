import axios from "axios";

const axiosInstance = axios.create({
	baseURL: "http://localhost:8000/api",
	withCredentials: true, // send cookies to the server
});
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token"); // Retrieve the token
    if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Set the token
    }
    return config;
});

export default axiosInstance;
