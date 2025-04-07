import themeReducer, {
  toggleTheme,
  setTheme,
} from "../../store/slices/themeSlice";

// Create a more robust localStorage mock
const createLocalStorageMock = () => {
  const store: Record<string, string> = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach((key) => {
        delete store[key];
      });
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    length: 0,
    key: jest.fn(),
  };
};

// Create a mockMatchMedia function
const createMatchMediaMock = (matches = false) => {
  return jest.fn().mockImplementation((query) => ({
    matches,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
};

describe("Theme Slice", () => {
  // Create a new mock for each test
  let localStorageMock: ReturnType<typeof createLocalStorageMock>;

  beforeEach(() => {
    localStorageMock = createLocalStorageMock();

    // Set up the localStorage mock
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
      writable: true,
    });

    // Clear mocks between tests
    jest.clearAllMocks();
  });

  test("should return the initial state", () => {
    // Mock the localStorage.getItem to return null (no preference set)
    localStorageMock.getItem.mockReturnValueOnce(null);

    // Mock the window.matchMedia to simulate system preference
    window.matchMedia = createMatchMediaMock(false);

    const initialState = { darkMode: false };
    const action = { type: undefined };
    expect(themeReducer(undefined, action)).toEqual(initialState);
  });

  test("should handle toggleTheme", () => {
    const initialState = { darkMode: false };
    const newState = themeReducer(initialState, toggleTheme());

    expect(newState.darkMode).toBe(true);
    expect(localStorageMock.setItem).toHaveBeenCalledWith("darkMode", "true");

    // Toggle again should switch back to false
    const finalState = themeReducer(newState, toggleTheme());
    expect(finalState.darkMode).toBe(false);
    expect(localStorageMock.setItem).toHaveBeenCalledWith("darkMode", "false");
  });

  test("should handle setTheme", () => {
    const initialState = { darkMode: false };

    // Set to dark mode
    const darkState = themeReducer(initialState, setTheme(true));
    expect(darkState.darkMode).toBe(true);
    expect(localStorageMock.setItem).toHaveBeenCalledWith("darkMode", "true");

    // Set to light mode
    const lightState = themeReducer(darkState, setTheme(false));
    expect(lightState.darkMode).toBe(false);
    expect(localStorageMock.setItem).toHaveBeenCalledWith("darkMode", "false");
  });

  test("should use localStorage value if available", () => {
    // Mock localStorage to return a preference
    localStorageMock.getItem.mockReturnValueOnce("true");

    // Initialize reducer with undefined state to trigger initial state creation
    const action = { type: undefined };
    const state = themeReducer(undefined, action);

    // Should use the value from localStorage
    expect(state.darkMode).toBe(true);
  });

  test("should use system preference if localStorage is not available", () => {
    // Mock localStorage to return null (no preference)
    localStorageMock.getItem.mockReturnValueOnce(null);

    // Mock system preference to dark mode
    window.matchMedia = createMatchMediaMock(true); // System prefers dark mode

    // Initialize reducer
    const action = { type: undefined };
    const state = themeReducer(undefined, action);

    // Should use system preference
    expect(state.darkMode).toBe(true);
  });
});
