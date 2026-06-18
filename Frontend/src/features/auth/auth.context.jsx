import { createContext, useState, useEffect } from "react";
import authApi from "../../api/authApi"

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ start true — checking on mount

  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await authApi.getMe(); // ✅ use authApi, not undefined getMe
        setUser(data.user);
      } catch (e) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};