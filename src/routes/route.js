import React, { useState } from "react";
import { createBrowserRouter } from "react-router-dom";
import { path } from "../utils/constant.js";
import Login from "../containers/auth/Login.js";
import Register from "../containers/auth/Register.js";
import PrivateRoute from "./PrivateRoute.js";
import HomePage from "../containers/system/HomePage.js";
import EnterNewPassword from "../containers/auth/EnterNewPassword.js";
import ProtectedRoute from "./ProtectedRoute.js";
import AdminPage from "../containers/system/AdminPage.js";
import ReadingPage from "../containers/system/ReadingPage.js";
import UserManagement from "../containers/components/UserManagement.js";
import ArticleManagement from "../containers/components/ArticleManagement.js";
import Dashboard from "../containers/components/Dashboard.js";
import MainContent from "../containers/components/MainContent.js";
import Latest from "../containers/components/Latest.js";
import Vocabulary from "../containers/components/Vocabulary.js";
import FlashCard from "../containers/components/FlashCard.js";
import Blog from "../containers/components/Blog.js";
import BlogDetail from "../containers/components/BlogDetail.js";
import Home from "../containers/components/Home.js";

function Article() {
  const [selectedTag, setSelectedTag] = useState("All categories");
  const [searchTerm, setSearchTerm] = useState("");

  const handleTagSelect = (tag) => {
    setSelectedTag(tag);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <>
      <MainContent onTagSelect={handleTagSelect} onSearch={handleSearch} />
      <Latest selectedTag={selectedTag} searchTerm={searchTerm} />
    </>
  );
}

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
        element: <Article />,
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
        path: path.BLOG,
        element: <Blog />,
      },
      {
        path: `${path.BLOG}/:id`,
        element: <BlogDetail />,
        loader: ({ params }) => {
          console.log(params.id);
          return { postId: params.id };
        },
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
      // <PrivateRoute requireAdmin={true}>
      <AdminPage />
      // </PrivateRoute>
    ),
    children: [
      {
        path: "",
        element: <Dashboard />,
      },
      {
        path: "user",
        element: <UserManagement />,
      },
      {
        path: "article",
        element: <ArticleManagement />,
      },
    ],
  },
  {
    path: path.ARTICLEDETAIL,
    element: <ReadingPage />,
  },
]);

export default router;
