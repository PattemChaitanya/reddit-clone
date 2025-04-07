import { waitFor, render, screen } from "@testing-library/react";
import React from "react";
import { act } from "react-dom/test-utils";

import { api } from "../../services/api";
import HomePage from "../HomePage";

// Mock the API
jest.mock("../../services/api");

// Mock the PostCard component
jest.mock("../../components/PostCard", () => {
  return function MockPostCard({ post }: any) {
    return (
      <div data-testid={`post-${post.id}`}>
        <h2>{post.title}</h2>
        <div>{post.content}</div>
        <div>
          Posted by <span>u/{post.author.username}</span>
        </div>
      </div>
    );
  };
});

// Mock the PopularCommunitiesSidebar component
jest.mock("../../components/sidebars/PopularCommunitiesSidebar", () => {
  return function MockPopularCommunitiesSidebar() {
    return <div data-testid="popular-communities-sidebar-mock"></div>;
  };
});

// Define mock test data
const posts = [
  {
    id: 1,
    title: "Test Post 1",
    content: "Test Content 1",
    author: {
      id: 1,
      username: "testuser1",
    },
    subreddit: {
      id: 1,
      name: "testsubreddit1",
    },
    upvotes: 5,
    downvotes: 2,
    createdAt: "2023-07-01T12:00:00Z",
    updatedAt: "2023-07-01T12:00:00Z",
  },
  {
    id: 2,
    title: "Test Post 2",
    content: "Test Content 2",
    author: {
      id: 2,
      username: "testuser2",
    },
    subreddit: {
      id: 2,
      name: "testsubreddit2",
    },
    upvotes: 10,
    downvotes: 1,
    createdAt: "2023-07-02T12:00:00Z",
    updatedAt: "2023-07-02T12:00:00Z",
  },
];

// Mock the entire services/api module
jest.mock("../../services/api", () => ({
  api: {
    getPosts: jest.fn(),
    getSubreddits: jest.fn(),
    votePost: jest.fn(),
  },
}));

// Import the mocked module

// Cast the mocked functions to the correct types
const mockGetPosts = api.getPosts as jest.Mock;
const mockGetSubreddits = api.getSubreddits as jest.Mock;
const mockVotePost = api.votePost as jest.Mock;

describe("HomePage Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mock implementations for each test
    mockGetPosts.mockResolvedValue(posts);
    mockGetSubreddits.mockResolvedValue(posts);
    mockVotePost.mockResolvedValue(undefined);
  });

  test("renders homepage with posts and sidebar", async () => {
    await act(async () => {
      render(<HomePage />);
    });

    // Initial state should show loading
    expect(screen.getByText(/Sort by/i)).toBeInTheDocument();

    // Wait for posts to load
    await waitFor(() => {
      expect(screen.getByText("Test Post 1")).toBeInTheDocument();
    });

    // Check that post content is displayed
    expect(screen.getByText("Test Content 1")).toBeInTheDocument();
    expect(screen.getByText("Test Post 2")).toBeInTheDocument();

    // Check that author information is displayed
    expect(screen.getByText("u/testuser1")).toBeInTheDocument();

    // Check that sidebar sections are displayed
    expect(
      screen.getByTestId("popular-communities-sidebar-mock")
    ).toBeInTheDocument();
    expect(screen.getByText(/About Reddit Clone/i)).toBeInTheDocument();
    expect(
      screen.getByText(/This is a Reddit clone created with React/i)
    ).toBeInTheDocument();
  });

  test("changes sort option", async () => {
    await act(async () => {
      render(<HomePage />);
    });

    // Wait for posts to load
    await waitFor(() => {
      expect(screen.getByText("Test Post 1")).toBeInTheDocument();
    });

    // Initially, getPosts should be called with 'hot' sort option
    expect(mockGetPosts).toHaveBeenCalledWith("hot");

    // Click on 'new' sort button
    const newButton = screen.getByText("New");
    await act(async () => {
      newButton.click();
    });

    // getPosts should be called again with 'new' sort option
    await waitFor(() => {
      expect(mockGetPosts).toHaveBeenCalledWith("new");
    });
  });

  test("handles empty posts array", async () => {
    // Mock empty posts array for this test
    mockGetPosts.mockResolvedValueOnce([]);

    await act(async () => {
      render(<HomePage />);
    });

    // Wait for posts to "load"
    await waitFor(() => {
      expect(screen.getByText(/No posts found/i)).toBeInTheDocument();
    });
  });

  test("handles API error", async () => {
    // Mock API error for this test
    mockGetPosts.mockRejectedValueOnce(new Error("Failed to fetch posts"));

    await act(async () => {
      render(<HomePage />);
    });

    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText(/Failed to load posts/i)).toBeInTheDocument();
    });
  });
});
