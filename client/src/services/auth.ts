import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && token !== "authenticated" && token !== "sample-session-token-active") {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error?.response?.data;
    const message =
      typeof data === "string"
        ? data
        : data?.message || data?.error || "Request failed";

    return Promise.reject({
      ...error,
      message,
      response: {
        ...error.response,
        data: data || {},
      },
    });
  }
);
// Register User
export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
  role: string;
}) => {
  // We match Go's expectations here by changing the key name to explorer_name
  return API.post("/register", {
    explorer_name: data.name,
    email: data.email,
    password: data.password,
    role: data.role,
  });
};

// Login User
export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  return API.post("/login", data);
};

// Get Logged User
export const getProfile = async (token: string) => {
  return API.get("/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};