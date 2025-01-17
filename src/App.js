import React from "react";
import router from "./routes/route";
import {
  RouterProvider,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <React.StrictMode>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </React.StrictMode>
  );
}

export default App;
