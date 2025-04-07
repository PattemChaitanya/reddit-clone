import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { configureStore } from "@reduxjs/toolkit";
import { lightTheme } from "./theme";
import themeReducer from "./store/slices/themeSlice";
import { api } from "./store/api";

// Create a test store with the necessary reducers
export const createTestStore = () =>
  configureStore({
    reducer: {
      theme: themeReducer,
      [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
  });

const testStore = createTestStore();

// Custom renderer that includes all providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={testStore}>
      <ThemeProvider theme={lightTheme}>
        <BrowserRouter>{children}</BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from "@testing-library/react";

// Override render method
export { customRender as render };
