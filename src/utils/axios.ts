import axios from "axios";

export const api = axios.create({
  //baseURL: new URL("/api", import.meta.env.VITE_STRAPI_URL).toString(),
  baseURL: "/api",
});

api.interceptors.request.use((req) => {
  const token = localStorage.getItem("logistics_token");
  if (token) {
    req.headers["Authorization"] = `bearer ${token}`;
  }
  return req;
});
