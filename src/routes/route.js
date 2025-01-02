import React from "react";
import {
    createBrowserRouter,
} from "react-router-dom";
import Login from "../containers/auth/Login.js";
import Register from "../containers/auth/Register.js"
import PrivateRoute from "./PrivateRoute.js";
import HomePage from "../containers/system/HomePage.js"
import EnterNewPassword from "../containers/auth/EnterNewPassword.js"
import { path } from "../utils/constant.js";
import ProtectedRoute from "./ProtectedRoute.js";

const router = createBrowserRouter([
    {
        path: path.LOGIN,
        element:
            <ProtectedRoute>
                <Login />
            </ProtectedRoute>
    },
    {
        path: path.REGISTER,
        element: <Register />
    },
    {
        path: path.HOME,
        element:
            <PrivateRoute>
                <HomePage />
            </PrivateRoute>
    },
    {
        path: path.RESETPASSWORD,
        element:
            <EnterNewPassword />
    }
]);

export default router;