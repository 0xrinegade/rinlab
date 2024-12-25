import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import App from './App';
import "./index.css";
import { useTheme, defaultTheme } from "./lib/theme";

// Initialize theme before rendering
if (typeof window !== 'undefined') {
  const root = document.documentElement;
  Object.entries(defaultTheme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
  });
}

// Theme provider component
function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { currentPalette } = useTheme();

  // Ensure theme is loaded
  if (!currentPalette?.colors) {
    return null;
  }

  return <>{children}</>;
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