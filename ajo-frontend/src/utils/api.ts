import axios from "axios";

// Buat instance axios dengan konfigurasi default
const api = axios.create({
  baseURL: "https://oomilezato.vercel.app/api", // Ganti sesuai URL backend Anda
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor untuk menambahkan token ke setiap request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
