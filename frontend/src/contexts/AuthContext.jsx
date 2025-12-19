import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      // Verify token and get user info
      fetch('http://localhost:8003/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.username) {
          setUser(data);
        } else {
          setToken(null);
          localStorage.removeItem('token');
        }
      })
      .catch(() => {
        setToken(null);
        localStorage.removeItem('token');
      });
    }
  }, [token]);

  const login = async (username, password) => {
    const res = await fetch('http://localhost:8003/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (res.ok) {
      const data = await res.json();
      setToken(data.access_token);
      localStorage.setItem('token', data.access_token);

      // Get user info
      const userRes = await fetch('http://localhost:8003/auth/me', {
        headers: {
          'Authorization': `Bearer ${data.access_token}`
        }
      });
      const userData = await userRes.json();
      setUser(userData);
      return { success: true };
    } else {
      const error = await res.json();
      return { success: false, error: error.detail };
    }
  };

  const register = async (username, email, password) => {
    const res = await fetch('http://localhost:8003/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });

    if (res.ok) {
      const data = await res.json();
      setToken(data.access_token);
      localStorage.setItem('token', data.access_token);

      // Get user info
      const userRes = await fetch('http://localhost:8003/auth/me', {
        headers: {
          'Authorization': `Bearer ${data.access_token}`
        }
      });
      const userData = await userRes.json();
      setUser(userData);
      return { success: true };
    } else {
      const error = await res.json();
      return { success: false, error: error.detail };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const getAuthHeaders = () => {
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      register,
      logout,
      getAuthHeaders
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}