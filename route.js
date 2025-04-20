import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { path } from "../utils/constant.js";
import Login from "../containers/auth/Login.js";
import Register from "../containers/auth/Register.js";
import PrivateRoute from "./PrivateRoute.js";
import HomePage from "../containers/system/HomePage.js";
import EnterNewPassword from "../containers/auth/EnterNewPassword.js";
import ProtectedRoute from "./ProtectedRoute.js";
import AdminPage from "../containers/components/AdminPage.js";
import UserManagement from "../containers/components/UserManagement.js";
import ArticleManagement from "../containers/components/ArticleManagement.js";
import Dashboard from "../containers/components/Dashboard.js";
import Vocabulary from "../containers/components/Vocabulary.js";
import FlashCard from "../containers/components/FlashCard.js";
import ArticlePage from "../containers/system/ArticlePage.js";
import ArticleDetail from "../containers/components/ArticleDetail.js";
import Home from "../containers/components/Home.js";
import VocabularyTable from "../containers/components/VocabularyTable"; // Add this import

const router = createBrowserRouter([
    {
        path: path.HOME,
        element: <HomePage />,
        children: [
            {
                path: "",
                element: <Home />,
            },
            {
                path: path.ARTICLE,
                element: <ArticlePage />,
            },
            {
                path: path.VOCABULARY,
                element: <Vocabulary />,
            },
            {
                path: path.FLASHCARD,
                element: <FlashCard />,
            },
            {
                path: `${path.ARTICLE}/:id`,
                element: <ArticleDetail />,
                loader: ({ params }) => {
                    console.log(params.id);
                    return { postId: params.id };
                },
            },
            {
                path: path.VOCABULARY_TABLE, // Add this route
                element: <VocabularyTable />,
            },
        ],
    },
    {
        path: path.LOGIN,
        element: (
            <ProtectedRoute>
                <Login />
            </ProtectedRoute>
        ),
    },
    {
        path: path.REGISTER,
        element: (
            <ProtectedRoute>
                <Register />
            </ProtectedRoute>
        ),
    },
    {
        path: path.RESETPASSWORD,
        element: (
            <ProtectedRoute>
                <EnterNewPassword />
            </ProtectedRoute>
        ),
    },
    {
        path: path.ADMIN,
        element: (
            <PrivateRoute requireAdmin={true}>
                <AdminPage />
            </PrivateRoute>
        ),
        children: [
            {
                index: true,
                element: <Dashboard />,
            },
            {
                path: path.ADMIN_USER,
                element: <UserManagement />,
            },
            {
                path: path.ADMIN_ARTICLE,
                element: <ArticleManagement />,
            },
        ],
    }
]);

export default router;