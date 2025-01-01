import React from "react";
import router from "./routes/route";
import {
  RouterProvider,
} from "react-router-dom";

function App() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

export default App;
