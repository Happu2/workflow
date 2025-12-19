import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Stacks from "./pages/Stacks";
import StackBuilder from "./pages/StackBuilder";
import AuthModal from "./components/AuthModal";
import { useState } from "react";

/**
 * App.jsx
 * ----------------
 * Root component of the application.
 * Handles top-level routing and authentication.
 */

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Welcome to GenAI Stack Builder</h1>
          <p className="text-gray-600 mb-6">Please login to access your workflows</p>
          <button
            onClick={() => setShowAuth(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Login / Sign Up
          </button>
          <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
        </div>
      </div>
    );
  }

  return children;
}

function AppContent() {
  return (
    <Routes>
      {/* Dashboard */}
      <Route path="/" element={
        <ProtectedRoute>
          <Stacks />
        </ProtectedRoute>
      } />

      {/* Stack Builder */}
      <Route path="/stack/:id" element={
        <ProtectedRoute>
          <StackBuilder />
        </ProtectedRoute>
      } />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
