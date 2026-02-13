import axios from "axios";

/*
|--------------------------------------------------------------------------
| Base Configuration
|--------------------------------------------------------------------------
*/

const BASE_URL = "https://localhost:44383/api/v1";

/*
|--------------------------------------------------------------------------
| Public Axios Instance
|--------------------------------------------------------------------------
| Use for login, register, public APIs
*/

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

/*
|--------------------------------------------------------------------------
| Private Axios Instance
|--------------------------------------------------------------------------
| Automatically attaches JWT token
*/

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

/*
|--------------------------------------------------------------------------
| Request Interceptor (Attach Token)
|--------------------------------------------------------------------------
*/

axiosPrivate.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/*
|--------------------------------------------------------------------------
| Response Interceptor (Handle 401)
|--------------------------------------------------------------------------
*/

axiosPrivate.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized - Redirecting to login...");
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);
