import { ThemeProvider } from "@mui/material/styles";
import { screen } from "@testing-library/react";
import { render as originalRender } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";

import { mockPosts, mockSubreddits } from "../__mocks__/api";
import App from "../App";
import { createTestStore } from "../test-utils";
import { lightTheme } from "../theme";

// Mock all page components
jest.mock("../pages/HomePage", () => () => (
  <div data-testid="home-page">Home Page</div>
));
jest.mock("../pages/SubredditPage", () => () => (
  <div data-testid="subreddit-page">Subreddit Page</div>
));
jest.mock("../pages/PostDetailPage", () => () => (
  <div data-testid="post-detail-page">Post Detail Page</div>
));
jest.mock("../pages/SearchResultsPage", () => () => (
  <div data-testid="search-results-page">Search Results Page</div>
));
jest.mock("../pages/UserProfilePage", () => () => (
  <div data-testid="user-profile-page">User Profile Page</div>
));
jest.mock("../pages/NotFoundPage", () => () => (
  <div data-testid="not-found-page">Not Found Page</div>
));

// Mock the api services
jest.mock("../services/api", () => ({
  api: {
    getPosts: jest.fn().mockResolvedValue(mockPosts),
    getSubreddits: jest.fn().mockResolvedValue(mockSubreddits),
  },
}));

// Mock the header component to make tests simpler
jest.mock("../components/Header", () => () => <header>Header</header>);

// Create a custom render function that provides the store and theme but uses MemoryRouter with initialEntries
const renderWithRouter = (ui: React.ReactElement, { route = "/" } = {}) => {
  const store = createTestStore();
  return originalRender(
    <Provider store={store}>
      <ThemeProvider theme={lightTheme}>
        <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
      </ThemeProvider>
    </Provider>
  );
};

describe("App Routing Tests", () => {
  test("renders homepage on root path", () => {
    renderWithRouter(<App />);
    expect(screen.getByTestId("home-page")).toBeInTheDocument();
  });

  test("renders subreddit page on /r/:subreddit path", () => {
    renderWithRouter(<App />, { route: "/r/testsubreddit" });
    expect(screen.getByTestId("subreddit-page")).toBeInTheDocument();
  });

  test("renders post detail page on /r/:subreddit/comments/:postId/:postSlug path", () => {
    renderWithRouter(<App />, {
      route: "/r/testsubreddit/comments/123/test-post",
    });
    expect(screen.getByTestId("post-detail-page")).toBeInTheDocument();
  });

  test("renders search results page on /search path", () => {
    renderWithRouter(<App />, { route: "/search?q=test" });
    expect(screen.getByTestId("search-results-page")).toBeInTheDocument();
  });

  test("renders user profile page on /user/:username path", () => {
    renderWithRouter(<App />, { route: "/user/testuser" });
    expect(screen.getByTestId("user-profile-page")).toBeInTheDocument();
  });

  test("renders not found page for invalid routes", () => {
    renderWithRouter(<App />, { route: "/invalid-route" });
    expect(screen.getByTestId("not-found-page")).toBeInTheDocument();
  });

  test("renders header on all pages", () => {
    renderWithRouter(<App />);
    expect(screen.getByText("Header")).toBeInTheDocument();
  });
});
