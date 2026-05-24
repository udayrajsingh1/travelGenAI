import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import App from "./App";
import "./index.css";
 
createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* BrowserRouter: enables client-side URL routing */}
    <BrowserRouter>
      {/* AuthProvider: makes auth state available to the entire tree */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
 
