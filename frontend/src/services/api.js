import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:8000/api" });

// Attach token to requests
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const login = (data) => API.post("/auth/login", data);
export const register = (data) => API.post("/auth/register", data);
export const getBudgets = () => API.get("/budgets");
export const getRecommendations = () => API.get("/budgets/recommendations");
export const getNotifications = () => API.get("/notifications");
