import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import AuthModal from './AuthModal';

export default function TopBar({ onChat, onSave }) {
  const { user, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <div className="h-14 border-b flex items-center justify-between px-6">
      <h2 className="font-semibold text-lg">GenAI Stack</h2>

      <div className="flex gap-3 items-center">
        <button
          onClick={onSave}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Stack
        </button>

        <button
          onClick={onChat}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Chat with Stack
        </button>

        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Welcome, {user.username}</span>
            <button
              onClick={logout}
              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAuthModal(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Login
          </button>
        )}
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}
