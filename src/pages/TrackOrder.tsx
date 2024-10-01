import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { trackOrder } from "../api/order";
import { Loader } from "lucide-react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { Shipment } from "./DriverDashboard";

interface Order {
  id: number;
  senderName: string;
  receiverName: string;
  itemDetails: string;
  deliveryInstructions: string;
  orderStatus: string;
  publishedAt: string;
  updatedAt: string;
  shipment: { data: Shipment };
}

export default function TrackOrderPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const orderId = useMemo(() => {
    const orderId = params.get("orderId");
    if (!orderId) {
      navigate("/");
    }
    return orderId;
  }, [navigate, params]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Order | null>(null);

  useEffect(() => {
    if (orderId) {
      setIsLoading(true);
      const id = setInterval(
        () =>
          trackOrder(orderId)
            .then(({ data, error }) => {
              if (error) {
                setError(data.error.message);
                return;
              }
              setData(data);
            })
            .finally(() => {
              setIsLoading(false);
            }),
        2000
      );

      return () => clearTimeout(id);
    }
  }, [orderId]);

  if (isLoading) {
    return (
      <main className="w-full h-[100dvh] max-w-screen-lg mx-auto flex flex-col items-center justify-center">
        <Loader size={24} className="w-6 h-6" />
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="w-full h-[100dvh] max-w-screen-lg mx-auto flex flex-col items-center justify-center">
        <h1 className="text-center uppercase text-6xl">
          Something went wrong!
        </h1>
        <span className="text-red-500 font-semibold text-2xl">{error}</span>
        <ul className="list-disc">
          <li>Reload the page</li>
          <li className="underline cursor-pointer">
            <Link to="/">Go back home</Link>
          </li>
        </ul>
      </main>
    );
  }

  return (
    <main className="w-full h-[100dvh] max-w-screen-lg mx-auto flex flex-col items-center justify-center">
      <h1 className="text-center uppercase text-6xl my-3">
        Track your order with us!
      </h1>
      <div className="w-[500px] my-4">
        <div className="flex items-center justify-between w-full">
          <h2 className="text-base">
            Sender: <span className="font-semibold">{data.senderName}</span>
          </h2>
          <h2 className="text-base">
            Receiver: <span className="font-semibold">{data.receiverName}</span>
          </h2>
        </div>
        <div className="flex flex-col gap-4 my-4">
          <label className="flex flex-col items-start gap-1">
            <span className="text-2xl font-medium">Item Details:</span>
            <input
              readOnly
              value={data.itemDetails}
              className="px-2 pt-2 outline-none border-b border-b-black border-t-[#000000aa] text-lg rounded-t-lg"
            />
          </label>
          <label className="flex flex-col items-start gap-1">
            <span className="text-2xl font-medium">Delivery Instructions:</span>
            <p className="px-2 pt-2 w-fit outline-none border-b border-b-black border-t-[#000000aa] text-lg rounded-t-lg">
              {data.deliveryInstructions}
            </p>
          </label>
        </div>
        <p className="text-warning text-lg uppercase font-bold bg-white w-fit p-2 rounded-2xl border border-[#0004] hover:shadow cursor-pointer">
          {data.shipment.data?.orderStatus ?? data.orderStatus}
        </p>
      </div>
      {data.shipment.data ? (
        <APIProvider apiKey={import.meta.env.VITE_MAP_API_KEY}>
          <Map
            style={{ width: "800px", height: "500px" }}
            defaultCenter={{
              lat: data.shipment.data.lat!,
              lng: data.shipment.data.lon!,
            }}
            defaultZoom={18}
            gestureHandling="greedy"
          >
            <Marker
              position={{
                lat: data.shipment.data.lat!,
                lng: data.shipment.data.lon!,
              }}
            />
          </Map>
        </APIProvider>
      ) : null}
    </main>
  );
}
