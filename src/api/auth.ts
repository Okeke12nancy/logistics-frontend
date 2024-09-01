import { AxiosError } from "axios";
import { api } from "../utils/axios";

export const driverLogin = async (identifier: string, password: string) => {
  try {
    const { data } = await api.post("/auth/local", { identifier, password });
    return data;
  } catch (e) {
    if (e instanceof AxiosError) {
      return e.response?.data;
    }
  }
};

export const driverRegister = async (username: string, email: string, password: string) => {
  try {
    const { data } = await api.post("/auth/local/register", { username, email, password });
    return data;
  } catch (e) {
    if (e instanceof AxiosError) {
      return e.response?.data;
    }
  }
};
