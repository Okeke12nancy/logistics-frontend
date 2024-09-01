import { FormEvent, useState } from "react";
import { Search } from "lucide-react";
import { trackOrder } from "../api/order";
import { Link, useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.currentTarget));
    const orderId = formData.orderId.toString();
    const data = await trackOrder(orderId);
    if (data.error) {
      setError(data.error.message);
      return;
    }
    navigate(`/track?orderId=${orderId}`);
  };
  return (
    <>
      <header className="w-full max-w-screen-lg mx-auto">
        <nav className="w-full p-4 flex flex-row items-center justify-end gap-2">
          <Link
            to="/driver/login"
            className="rounded-2xl border border-black px-4 py-2 bg-white hover:bg-gray-500 hover:text-white"
          >
            Are you a driver?
          </Link>
          <Link
            to="/driver/register"
            className="rounded-2xl border border-black px-4 py-2 bg-white hover:bg-gray-500 hover:text-white"
          >
            Want to be a driver?
          </Link>
        </nav>
      </header>
      <main className="w-full h-[100dvh] max-w-screen-lg mx-auto flex flex-col items-center justify-center">
        <h1 className="text-center uppercase text-6xl">
          <span className="bg-gray-600 text-white">Deliveries</span> done right!
        </h1>
        <form onSubmit={handleSubmit} className="my-4 flex flex-row gap-4">
          <input
            required
            className="border-black border-b pr-4 pt-2 pb-1 outline-none w-[500px]"
            name="orderId"
            placeholder="Want to track your package? Enter the Order ID"
            onChange={() => {
              if (error) setError("");
            }}
          />
          <button
            type="submit"
            className="hover:scale-105 active:scale-95 rounded-[50%] aspect-square border border-black grid place-items-center"
          >
            <Search />
          </button>
        </form>
        {error ? (
          <span className="text-red-500 font-semibold text-sm">{error}</span>
        ) : null}
      </main>
    </>
  );
}
