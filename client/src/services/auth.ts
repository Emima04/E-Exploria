import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Register User
export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  // We match Go's expectations here by changing the key name to explorer_name
  return API.post("/register", {
    explorer_name: data.name, 
    email: data.email,
    password: data.password,
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