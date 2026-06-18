import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./features/auth/hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex",
        alignItems: "center", justifyContent: "center",
        background: "#080810"
      }}>
        <span style={{
          width: 28, height: 28,
          border: "2.5px solid #2a2a3e",
          borderTopColor: "#5DCAA5",
          borderRadius: "50%",
          animation: "spin 0.7s linear infinite"
        }} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}