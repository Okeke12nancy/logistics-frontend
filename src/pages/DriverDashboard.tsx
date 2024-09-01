import { useEffect, useState } from "react";
import {
  completeShipment,
  findAssignedShipment,
  startShipment,
  updateShipmentLocation,
} from "../api/shipment";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface Shipment {
  id: number;
  attributes: {
    ETA?: string;
    Status: string;
    createdAt: string;
    lat?: number;
    lon?: number;
    publishedAt: string;
    trackingHistory?: string;
    updatedAt: string;
  };
}

export default function DriverDashboardPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Shipment | null>(null);

  const handleStartShipment = async () => {
    if (!data) {
      setError("no shipment selected");
      return;
    }
    setIsLoading(true);
    const d = await startShipment(data.id).finally(() => setIsLoading(false));
    if (d.error) {
      setError(d.error.message);
      return;
    }
    setError("");
    console.log(d);
    setData(d.data);
  };

  const handleCompleteShipment = async () => {
    if (!data) {
      setError("no shipment selected");
      return;
    }
    setIsLoading(true);
    const d = await completeShipment(data.id).finally(() =>
      setIsLoading(false),
    );
    if (d.error) {
      setError(d.error.message);
      return;
    }
    setError("");
    console.log(d);
    setData(d.data);
  };

  const handleLogout = () => {
    localStorage.removeItem("logistics_token");
    localStorage.removeItem("userData");
    navigate("/");
  };

  useEffect(() => {
    findAssignedShipment().then((data) => {
      if (data.error) {
        setError(data.error.message);
        return;
      }
      setError("");
      setData(data.data[0]);
    });
  }, []);

  useEffect(() => {
    if (
      data?.attributes.Status.toLowerCase() === "in transit" &&
      "geolocation" in navigator
    ) {
      const id = navigator.geolocation.watchPosition(
        async ({ coords }) => {
          console.log("updating shipment location");
          const d = await updateShipmentLocation(
            data.id,
            coords.latitude,
            coords.longitude,
          );
          if (d.error) {
            setError(d.error.message);
            return;
          }
          setError("");
          setData(d.data);
        },
        (err) => {
          setError(err.message);
        },
      );

      return () => {
        navigator.geolocation.clearWatch(id);
      };
    }
  }, [data]);

  return (
    <>
      <header className="w-full max-w-screen-lg mx-auto">
        <nav className="w-full text-right p-4">
          <button
            onClick={handleLogout}
            className="rounded-2xl border border-black px-4 py-2 bg-white hover:bg-gray-500 hover:text-white"
          >
            Logout
          </button>
        </nav>
      </header>
      <main className="w-full h-[100dvh] max-w-screen-lg mx-auto flex flex-col items-center justify-center">
        <h1 className="text-center uppercase text-6xl font-semibold my-4">
          DRIVER DASHBOARD
        </h1>
        {error ? (
          <span className="text-danger text-base font-semibold capitalize">
            {error}
          </span>
        ) : null}
        {data ? (
          <>
            <p className="my-4">
              Shipment Status:{" "}
              <span className="text-warning text-lg uppercase font-bold bg-white w-fit p-2 rounded-2xl border border-[#0004] hover:shadow cursor-pointer">
                {data.attributes.Status}
              </span>
            </p>
            {data.attributes.Status.toLowerCase() === "pending" ? (
              <button
                disabled={isLoading}
                onClick={handleStartShipment}
                className="w-fit border border-black bg-white hover:bg-gray-500 hover:text-white p-4 rounded-2xl"
              >
                {isLoading ? <Loader className="w-6 h-6" /> : "START SHIPMENT"}
              </button>
            ) : null}
            {data.attributes.Status.toLowerCase() === "in transit" ? (
              <button
                disabled={isLoading}
                onClick={handleCompleteShipment}
                className="w-fit border border-black bg-white hover:bg-gray-500 hover:text-white p-4 rounded-2xl"
              >
                {isLoading ? (
                  <Loader className="w-6 h-6" />
                ) : (
                  "COMPLETE SHIPMENT"
                )}
              </button>
            ) : null}
          </>
        ) : null}
      </main>
    </>
  );
}
