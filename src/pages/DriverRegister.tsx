import { FormEvent, useState } from "react";
import { driverRegister } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function DriverRegisterPage() {
	const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.currentTarget));
    const data = await driverRegister(
      formData.name.toString(),
      formData.email.toString(),
      formData.password.toString(),
    );
    if (data.error) {
      setError(data.error.message);
      return;
    }
		localStorage.setItem("logistics_token", data.jwt);
		localStorage.setItem("userData", JSON.stringify(data.user));
		navigate("/driver/dashboard");
  };

  return (
    <main className="w-full h-[100dvh] max-w-screen-lg mx-auto flex flex-col items-center justify-center">
      <h1 className="text-center uppercase text-3xl font-semibold my-4">
        Want to be a driver?
      </h1>
      <form onSubmit={handleSubmit} className="w-[500px] flex flex-col gap-4">
        <label>
          <span className="text-base font-semibold">Name:</span>
          <input
            name="name"
            type="text"
            className="text-lg border-b border-b-black w-full outline-none p-2 rounded-t-lg"
          />
        </label>
        <label>
          <span className="text-base font-semibold">Email:</span>
          <input
            name="email"
            type="email"
            className="text-lg border-b border-b-black w-full outline-none p-2 rounded-t-lg"
          />
        </label>
        <label>
          <span className="text-base font-semibold">Password:</span>
          <input
            name="password"
            type="password"
            className="text-lg border-b border-b-black w-full outline-none p-2 rounded-t-lg"
          />
        </label>
        <button className="w-full bg-gray-500 text-white p-4 rounded-2xl">
          Register
        </button>
      </form>
      {error ? <span className="text-danger text-base font-semibold capitalize">{error}</span> : null}
    </main>
  );
}
