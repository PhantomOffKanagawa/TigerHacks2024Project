import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "app/app";
import { AuthProvider } from "./contexts/AuthContext";
import { ParticleBg } from "components/custom/ParticleBg";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <ParticleBg />
      <App />
    </AuthProvider>
  </React.StrictMode>,
);
