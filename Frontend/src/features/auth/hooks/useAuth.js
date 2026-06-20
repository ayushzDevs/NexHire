import { useContext } from "react";
import { AuthContext } from "../auth.context";
import authApi from "../../../api/authApi";

export const useAuth = () => {
  const context = useContext(AuthContext);
  const { user, setUser, loading, setLoading } = context;

  const handleLoginHook = async ({ email, password }) => {
    setLoading(true);
    try {
      const data = await authApi.login(email, password);
      setUser(data.user);
    } catch (e) {
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterHook = async ({ username, email, password }) => {
    setLoading(true);
    try {
      const data = await authApi.register(username, email, password);
      setUser(data.user);
    } catch (e) {
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      const data = await authApi.logout();
      setUser(null);
    } catch (e) {

    } finally {
      setLoading(false);
    }
};

  return { user, loading, handleRegisterHook, handleLoginHook, handleLogout };
};