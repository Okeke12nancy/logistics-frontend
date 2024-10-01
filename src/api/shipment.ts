import { AxiosError } from "axios";
import { api } from "../utils/axios";

export const findAssignedShipment = async () => {
  const userData = localStorage.getItem("userData");
  try {
    if (!userData) {
      throw new Error("Not logged in");
    }

    const user = JSON.parse(userData);
    const { data } = await api.get("/shipments", {
      params: {
        populate: "*",
        filters: {
          $or: [
            {
              Status: {
                $eq: "Pending",
              },
            },
            {
              Status: {
                $eq: "In Transit",
              },
            },
          ],
          Driver: {
            id: {
              $eq: user.id,
            },
          },
        },
      },
    });

    return data;
  } catch (e) {
    if (e instanceof AxiosError) {
      return e.response?.data;
    }
    return { error: e };
  }
};

export const startShipment = async (id: string) => {
  try {
    console.log("starting shipment");
    let lat, lon;
    if ("geolocation" in navigator) {
      const coords = await new Promise<GeolocationCoordinates>((res, rej) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => res(pos.coords),
          (err) => {
            rej(err);
          }
        );
      });
      lat = coords.latitude;
      lon = coords.longitude;
    }

    const { data } = await api.put(`/shipments/${id}`, {
      data: { Status: "In Transit", lat, lon },
    });
    return data;
  } catch (e) {
    if (e instanceof AxiosError) {
      return e.response?.data;
    }
    return { error: e };
  }
};

export const updateShipmentLocation = async (
  id: string,
  lat: number,
  lon: number
) => {
  try {
    const { data } = await api.put(`/shipments/${id}`, {
      data: { lat, lon },
    });
    return data;
  } catch (e) {
    if (e instanceof AxiosError) {
      return e.response?.data;
    }
    return { error: e };
  }
};

export const completeShipment = async (id: string) => {
  try {
    const { data } = await api.put(`/shipments/${id}`, {
      data: { Status: "Delivered" },
    });
    return data;
  } catch (e) {
    if (e instanceof AxiosError) {
      return e.response?.data;
    }
    return { error: e };
  }
};
