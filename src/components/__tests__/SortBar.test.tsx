import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import { render } from "../../test-utils";
import SortBar from "../SortBar";
import { SortOption } from "../../types";

describe("SortBar Component", () => {
  const mockOnSortChange = jest.fn();
  const currentSort: SortOption = "hot";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders sort options correctly", () => {
    render(
      <SortBar currentSort={currentSort} onSortChange={mockOnSortChange} />
    );

    // Check if all sort options are rendered
    expect(screen.getByText("Hot")).toBeInTheDocument();
    expect(screen.getByText("New")).toBeInTheDocument();
    expect(screen.getByText("Top")).toBeInTheDocument();
    expect(screen.getByText("Controversial")).toBeInTheDocument();
  });

  test("highlights current sort option", () => {
    render(<SortBar currentSort="new" onSortChange={mockOnSortChange} />);

    // Current sort button should have primary color (this depends on how your component applies styles)
    const newButton = screen.getByText("New").closest("button");
    expect(newButton).toHaveClass("MuiButton-colorPrimary");

    // Other buttons should not have primary color
    const hotButton = screen.getByText("Hot").closest("button");
    expect(hotButton).not.toHaveClass("MuiButton-colorPrimary");
  });

  test("calls onSortChange when a sort option is clicked", () => {
    render(
      <SortBar currentSort={currentSort} onSortChange={mockOnSortChange} />
    );

    // Click on 'New' sort option
    fireEvent.click(screen.getByText("New"));

    // Check if onSortChange was called with the correct sort option
    expect(mockOnSortChange).toHaveBeenCalledWith("new");
  });

  test("renders mobile view on small screens", () => {
    // Mock window.matchMedia to simulate a mobile device
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: true, // This will trigger the mobile view
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    render(
      <SortBar currentSort={currentSort} onSortChange={mockOnSortChange} />
    );

    // In mobile view, only the current sort should be visible as a dropdown trigger
    expect(screen.getByText("Sort by:")).toBeInTheDocument();
    expect(screen.getByText("Hot")).toBeInTheDocument();

    // Click on the dropdown button
    fireEvent.click(screen.getByText("Hot"));

    // After clicking, the menu should show all options
    // Note: This part might be tricky as Material UI renders menus in portals
    // You may need to adjust the test based on your actual implementation
  });
});
