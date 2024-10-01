import { AxiosError } from "axios";
import { api } from "../utils/axios";

export const trackOrder = async (orderdocumentId: string) => {
  try {
    const { data } = await api.get(`/orders/${orderdocumentId}`, {
      params: {
        populate: {
          shipment: "*",
        },
      },
    });
    return data;
  } catch (e) {
    if (e instanceof AxiosError) {
      return e.response?.data;
    }
  }
};
