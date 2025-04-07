import { screen, fireEvent, waitFor } from "@testing-library/react";

import { mockComments } from "../../__mocks__/api";
import { render } from "../../test-utils";
import CommentSection from "../CommentSection";

// Need to mock react-hook-form
jest.mock("react-hook-form", () => ({
  ...jest.requireActual("react-hook-form"),
  useForm: () => ({
    register: jest.fn(),
    handleSubmit: (cb: (data: any) => void) => (data: any) => cb(data),
    formState: { errors: {} },
    reset: jest.fn(),
  }),
}));

describe("CommentSection Component", () => {
  const mockOnAddComment = jest.fn().mockResolvedValue(undefined);
  const mockOnVoteComment = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders comments correctly", () => {
    render(
      <CommentSection
        comments={mockComments}
        onAddComment={mockOnAddComment}
        onVoteComment={mockOnVoteComment}
      />
    );

    // Check if comment content is displayed
    mockComments.forEach((comment) => {
      expect(screen.getByText(comment.content)).toBeInTheDocument();
      expect(
        screen.getByText(`u/${comment.author.username}`)
      ).toBeInTheDocument();
    });
  });

  test("displays comment form", () => {
    render(
      <CommentSection
        comments={mockComments}
        onAddComment={mockOnAddComment}
        onVoteComment={mockOnVoteComment}
      />
    );

    // Check if the form is displayed
    expect(screen.getByPlaceholderText(/add a comment/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /comment/i })
    ).toBeInTheDocument();
  });

  test("submits a new comment", async () => {
    render(
      <CommentSection
        comments={mockComments}
        onAddComment={mockOnAddComment}
        onVoteComment={mockOnVoteComment}
      />
    );

    // Type in the comment text
    const commentInput = screen.getByPlaceholderText(/add a comment/i);
    fireEvent.change(commentInput, {
      target: { value: "This is a new comment" },
    });

    // Submit the form
    const submitButton = screen.getByRole("button", { name: /comment/i });
    fireEvent.click(submitButton);

    // Check if onAddComment was called with the correct content
    await waitFor(() => {
      expect(mockOnAddComment).toHaveBeenCalledWith(
        "This is a new comment",
        undefined
      );
    });
  });

  test("votes on a comment", async () => {
    render(
      <CommentSection
        comments={mockComments}
        onAddComment={mockOnAddComment}
        onVoteComment={mockOnVoteComment}
      />
    );

    // Find the upvote button for the first comment and click it
    const upvoteButtons = screen.getAllByLabelText(/upvote/i);
    fireEvent.click(upvoteButtons[0]);

    // Check if onVoteComment was called with the correct parameters
    await waitFor(() => {
      expect(mockOnVoteComment).toHaveBeenCalledWith(mockComments[0].id, 1);
    });
  });

  test("toggles comment reply form", async () => {
    render(
      <CommentSection
        comments={mockComments}
        onAddComment={mockOnAddComment}
        onVoteComment={mockOnVoteComment}
      />
    );

    // Find and click the reply button for the first comment
    const replyButtons = screen.getAllByText(/reply/i);
    fireEvent.click(replyButtons[0]);

    // Check if the reply form is displayed
    await waitFor(() => {
      expect(
        screen.getAllByPlaceholderText(/add a reply/i)[0]
      ).toBeInTheDocument();
    });
  });

  test("handles empty comments array", () => {
    render(
      <CommentSection
        comments={[]}
        onAddComment={mockOnAddComment}
        onVoteComment={mockOnVoteComment}
      />
    );

    // Check if the "no comments yet" message is displayed
    expect(screen.getByText(/no comments yet/i)).toBeInTheDocument();
  });
});
