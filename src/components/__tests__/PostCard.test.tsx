import { screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";

import { mockPosts } from "../../__mocks__/api";
import { render } from "../../test-utils";
import PostCard from "../PostCard";

describe("PostCard Component", () => {
  const mockOnVote = jest.fn();
  const post = mockPosts[0];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders post title and content", () => {
    render(<PostCard post={post} onVote={mockOnVote} />);

    expect(screen.getByText(post.title)).toBeInTheDocument();
    expect(screen.getByText(post.content)).toBeInTheDocument();
  });

  test("displays author and subreddit information", () => {
    render(<PostCard post={post} onVote={mockOnVote} />);

    expect(screen.getByText(`u/${post.author.username}`)).toBeInTheDocument();
    expect(screen.getByText(`r/${post.subreddit}`)).toBeInTheDocument();
  });

  test("upvote button calls onVote with correct parameters", async () => {
    render(<PostCard post={post} onVote={mockOnVote} />);

    // Get the upvote button by its accessible role
    const upvoteButton = screen.getByLabelText(/upvote/i);
    fireEvent.click(upvoteButton);

    await waitFor(() => {
      expect(mockOnVote).toHaveBeenCalledWith(post.id, 1);
    });
  });

  test("downvote button calls onVote with correct parameters", async () => {
    render(<PostCard post={post} onVote={mockOnVote} />);

    // Get the downvote button by its accessible role
    const downvoteButton = screen.getByLabelText(/downvote/i);
    fireEvent.click(downvoteButton);

    await waitFor(() => {
      expect(mockOnVote).toHaveBeenCalledWith(post.id, -1);
    });
  });

  test("displays vote count correctly", () => {
    render(<PostCard post={post} onVote={mockOnVote} />);

    const voteCount = post.upvotes - post.downvotes;
    expect(screen.getByText(voteCount.toString())).toBeInTheDocument();
  });

  test("image post displays thumbnail if available", () => {
    const imagePost = mockPosts[1]; // Post with image
    render(<PostCard post={imagePost} onVote={mockOnVote} />);

    // Check if the image is in the document - use getAllByRole and find the one with the right src
    const images = screen.getAllByRole("img");
    const thumbnailImage = images.find(
      (img) => img.getAttribute("src") === imagePost.thumbnail
    );

    expect(thumbnailImage).toBeInTheDocument();
    expect(thumbnailImage).toHaveAttribute("src", imagePost.thumbnail);
  });

  test("clicking on post title navigates to post details", () => {
    render(<PostCard post={post} onVote={mockOnVote} />);

    const postTitle = screen.getByText(post.title);
    expect(postTitle.closest("a")).toHaveAttribute(
      "href",
      `/r/${post.subreddit}/comments/${post.id}/${post.title
        .toLowerCase()
        .replace(/\s+/g, "-")}`
    );
  });
});
