import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("ams_user"))
  );

  const [token, setToken] = useState(
    localStorage.getItem("ams_token")
  );

  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    const response = await api.post(
      "/auth/login",
      {
        email,
        password,
      }
    );

    const { token, user } = response.data;

    localStorage.setItem(
      "ams_token",
      token
    );

    localStorage.setItem(
      "ams_user",
      JSON.stringify(user)
    );

    setToken(token);
    setUser(user);

    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("ams_token");
    localStorage.removeItem("ams_user");

    setUser(null);
    setToken(null);
  };

  useEffect(() => {
    const verifyUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/auth/me");

        setUser(response.data.user);
      } catch (error) {
        logout();
      }

      setLoading(false);
    };

    verifyUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () =>
  useContext(AuthContext);