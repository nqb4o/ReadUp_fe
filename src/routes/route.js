import React from "react";
import {
    createBrowserRouter,
} from "react-router-dom";
import { path } from "../utils/constant.js";
import Login from "../containers/auth/Login.js";
import Register from "../containers/auth/Register.js"
import PrivateRoute from "./PrivateRoute.js";
import HomePage from "../containers/system/HomePage.js"
import EnterNewPassword from "../containers/auth/EnterNewPassword.js"
import ProtectedRoute from "./ProtectedRoute.js";
import AdminPage from "../containers/system/AdminPage.js"
import BookPage from "../containers/system/BookPage.js"

const router = createBrowserRouter([
    {
        path: path.HOME,
        element:
            <HomePage />
    },
    {
        path: path.LOGIN,
        element:
            <ProtectedRoute>
                <Login />
            </ProtectedRoute>
    },
    {
        path: path.REGISTER,
        element:
            <ProtectedRoute>
                <Register />
            </ProtectedRoute>
    },
    {
        path: path.RESETPASSWORD,
        element:
            <ProtectedRoute>
                <EnterNewPassword />
            </ProtectedRoute>
    },
    {
        path: path.ADMIN,
        element: (
            <PrivateRoute requireAdmin={true}>
                <AdminPage />
            </PrivateRoute>
        )
    },
    {
        path: path.BOOKDETAIL,
        element: (
            <BookPage />
        )
    }
]);

export default router;