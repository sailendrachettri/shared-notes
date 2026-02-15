import axios from "axios";

/*
|--------------------------------------------------------------------------
| Base Configuration
|--------------------------------------------------------------------------
*/

let BASE_URL;
let ENV_TYPE = import.meta.env.VITE_ENV_TYPE;


if (ENV_TYPE == "development") {
  BASE_URL = import.meta.env.VITE_DEV_API_URL;
} else {
  BASE_URL = import.meta.env.VITE_API_URL;
}

export const  BASE_URL_EXPORTED = BASE_URL;


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
  (error) => Promise.reject(error),
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
  },
);
