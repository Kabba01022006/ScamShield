import React, { createContext, useContext, useState, useEffect } from 'react';

// This is a SIMULATED auth system — there is no real backend or password
// checking here. We just remember "who is logged in" using localStorage so
// it survives a page refresh.

const AuthContext = createContext();
const STORAGE_KEY = 'scamshield_user';

export const AuthProvider = ({ children }) => {
  // On first load, try to restore a previously "logged in" user from
  // localStorage. If nothing is saved, currentUser starts as null.
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null; // corrupted/blocked storage must never white-screen the app
    }
  });

  // A short-lived message shown after login/signup/logout 
  const [authNotification, setAuthNotification] = useState(null);

  // Whenever currentUser changes, keep localStorage in sync.
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [currentUser]);

  // Shared by login/signup: builds the fake user object and shows a message.
  const setUserAndNotify = (user, message, duration = 5000) => {
    setCurrentUser(user);
    setAuthNotification(message);
    setTimeout(() => setAuthNotification(null), duration);
  };

  const login = ({ name, email }) => {
    const user = {
      name: name || email.split('@')[0], // fallback: use part before @ as name
      email,
      joinedDate: new Date().toISOString().split('T')[0],
      role: 'Community Defender',
    };
    setUserAndNotify(user, `Welcome back, ${user.name}!`);
    return user;
  };

  const signup = ({ name, email }) => {
    const user = {
      name,
      email,
      joinedDate: new Date().toISOString().split('T')[0],
      role: 'Community Defender',
    };
    setUserAndNotify(user, `Account created! Welcome to ScamShieldAI, ${user.name}.`);
    return user;
  };

  const logout = () => {
    setCurrentUser(null);
    setAuthNotification('You have logged out successfully.');
    setTimeout(() => setAuthNotification(null), 4000);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        signup,
        logout,
        authNotification,
        clearNotification: () => setAuthNotification(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Shortcut hook: components call useAuth() instead of useContext(AuthContext)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
