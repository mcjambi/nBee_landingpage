import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { HelmetProvider } from "react-helmet-async";

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import {
  BrowserRouter,
  Link,
  Route,
  Router,
  RouterProvider,
  Routes,
  createBrowserRouter,
} from "react-router-dom";
import Homepage from "./entities/homepage";
import { AuthProvider } from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";
export * from "./config/axios.config";

const queryClient = new QueryClient();
const baseHref = document
  .querySelector("base")
  ?.getAttribute("href")
  ?.replace(/\/$/, "");

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <React.StrictMode>
        <AuthProvider>
          <BrowserRouter basename={baseHref}>
            <Routes>
              <Route key={"index"} path={"/"} element={<App />} />
              <Route
                key={"home"}
                path={"/home"}
                element={
                  <ProtectedRoute>
                    <Homepage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </React.StrictMode>
    </HelmetProvider>
  </QueryClientProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
