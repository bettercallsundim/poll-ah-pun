import { ThemeProvider } from "@/components/ThemeProvider.tsx";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import { Nav } from "./components/Nav.tsx";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/about",
    element: <div>About</div>,
  },
]);
ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <div className="px-8 pb-4 max-w-screen-2xl mx-auto">
      <Nav />
      <RouterProvider router={router} />
    </div>
  </ThemeProvider>
);
