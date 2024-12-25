import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import App from './App';
import "./index.css";
import { useTheme, defaultTheme } from "./lib/theme";

// Theme provider component
function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { currentPalette } = useTheme();

  // Update CSS variables whenever theme changes
  if (typeof window !== 'undefined' && currentPalette?.colors) {
    const root = document.documentElement;
    Object.entries(currentPalette.colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
  }

  return children;
}

// Initialize default theme before rendering
if (typeof window !== 'undefined') {
  const root = document.documentElement;
  Object.entries(defaultTheme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <App />
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
);