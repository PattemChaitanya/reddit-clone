import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Box } from "@mui/material";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import SubredditPage from "./pages/SubredditPage";
import PostDetailPage from "./pages/PostDetailPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import UserProfilePage from "./pages/UserProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import { RootState } from "./store";

const App: React.FC = () => {
  const location = useLocation();
  const { darkMode } = useSelector((state: RootState) => state.theme);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Update body class when dark mode changes
  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <Box className="min-h-screen">
      <Header />
      <Box component="main" className="container mx-auto px-4 py-4 md:px-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/r/:subreddit" element={<SubredditPage />} />
          <Route
            path="/r/:subreddit/comments/:postId/:postSlug"
            element={<PostDetailPage />}
          />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/user/:username" element={<UserProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default App;
