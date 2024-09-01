import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import TrackOrderPage from "./pages/TrackOrder";
import DriverLoginPage from "./pages/DriverLogin";
import DriverDashboardPage from "./pages/DriverDashboard";
import DriverRegisterPage from "./pages/DriverRegister";

const router = createBrowserRouter([
  {
    index: true,
    element: <LandingPage />,
  },
  {
    path: "/track",
    element: <TrackOrderPage />,
  },
  {
    path: "/driver",
    children: [
      {
        path: "login",
        element: <DriverLoginPage />,
      },
      {
        path: "register",
        element: <DriverRegisterPage />,
      },
      { path: "dashboard", element: <DriverDashboardPage /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
