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
import QuizManagement from "../containers/components/QuizManagement.js";
import Dashboard from "../containers/components/Dashboard.js";
import Vocabulary from "../containers/components/Vocabulary.js";
import FlashCardLanding from "../containers/components/FlashCardLanding.js";
import PublicHomePage from "../containers/components/PublicHomePage.js";
import UserHomePage from "../containers/components/UserHomePage.js";
import { useAuth } from "../contexts/AuthContext.js";
import UserFlashCard from "../containers/components/UserFlashCard.js";
import UserArticlePage from "../containers/components/UserArticlePage.js";
import UserArticleDetail from "../containers/components/UserArticleDetail.js";
import UserQuestion from "../containers/components/UserQuestion.js";
import FlashCardArticle from "../containers/components/FlashCardArticle.js";
import UserQuiz from "../containers/components/UserQuiz.js";
import YourLibrary from "../containers/components/YourLibrary.js";
import QuizAttemptDetail from "../containers/components/QuizAttemptDetail.js";

const RootRoute = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? <UserHomePage /> : <PublicHomePage />;
};

const router = createBrowserRouter([
    {
        path: path.HOME,
        element: <HomePage />,
        children: [
            {
                path: "",
                element: <RootRoute />,
            },
            {
                path: path.VOCABULARY,
                element: <Vocabulary />,
            },
            {
                path: path.FLASHCARD,
                element: <FlashCardLanding />,
            },
            {
                path: path.USER_FLASHCARD,
                element: <UserFlashCard />,
            },
            {
                path: path.USER_ARTICLE,
                element: <UserArticlePage />,
            },
            {
                path: `${path.USER_ARTICLE}/:id`,
                element: <UserArticleDetail />,
            },
            {
                path: `${path.USER_FLASHCARD}/:id`,
                element: <FlashCardArticle />,
            },
            {
                path: path.YOUR_LIBRARY,
                element: <YourLibrary />,
            },
            {
                path: `${path.QUESTION}?/:id`,
                element: <UserQuestion />,
            },
            {
                path: path.QUIZ,
                element: <UserQuiz />,
            },
            {
                path: `${path.QUIZ_ATTEMPT}?/:attempt_id`,
                element: <QuizAttemptDetail />,
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
            {
                path: path.ADMIN_QUIZ,
                element: <QuizManagement />,
            },
        ],
    },
]);

export default router;
