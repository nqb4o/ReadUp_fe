import React from "react";
import router from "./routes/route";
import {
  RouterProvider,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from './contexts/CartContext';

function App() {
  return (
    <React.StrictMode>
      <AuthProvider>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </AuthProvider>
    </React.StrictMode>
  );
}

export default App;
