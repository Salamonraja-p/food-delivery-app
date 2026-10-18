import React from "react";
import ReactDOM from "react-dom/client";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import { ToastContainer } from "react-toastify";
import AppRouter from "./routes/AppRouter";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext"; 

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider> 
        <AppRouter />
        <ToastContainer
          position="top-right"
          autoClose={2500}
          theme="light"
        />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);