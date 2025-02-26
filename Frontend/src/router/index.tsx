import { createBrowserRouter } from "react-router-dom";
import About from "../pages/About";
import Dashboard from "../pages/Dashboard";
import Plateau from "../pages/Plateau";
import Plateau2 from "../pages/Plateau2";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import NotFound from "../pages/error/NotFound";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      { path: "about", element: <About /> },
      { path: "map", element: <Plateau /> },
      { path: "map2", element: <Plateau2 /> },
    ],
  },
  {
    path: "/",
    element: <PublicRoute />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
