import React, { createContext, useContext, useState, useEffect } from 'react';
import { account } from '../lib/appwriteConfig';
import { ID } from 'appwrite';

// Give context a default empty object with user/session null
const AuthContext = createContext({
  user: null,
  session: null,
  signup: async () => {},
  signin: async () => {},
  signout: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const res = await account.get();
        setUser(res);
        setSession(res);
      } catch (err) {
        console.log("No session", err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const signup = async ({ name, email, password }) => {
    setLoading(true);
    try {
      const userId = ID.unique();
      await account.create(userId, email, password, name);
      const session = await account.createSession(email, password);
      const user = await account.get();
      setSession(session);
      setUser(user);
    } catch (err) {
      console.error("Signup error", err);
    } finally {
      setLoading(false);
    }
  };

  const signin = async ({ email, password }) => {
    setLoading(true);
    try {
      const session = await account.createEmailPasswordSession(email, password);
      const user = await account.get();
      setSession(session);
      setUser(user);
    } catch (err) {
      console.error("Signin error", err);
    } finally {
      setLoading(false);
    }
  };

  const signout = async () => {
    setLoading(true);
    try {
      await account.deleteSession("current");
      setUser(null);
      setSession(null);
    } catch (err) {
      console.error("Signout error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, signup, signin, signout }}>
      {/* ✅ Always render children, even if loading */}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
