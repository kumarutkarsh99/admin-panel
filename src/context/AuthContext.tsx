import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
const API_BASE_URL = "http://13.51.235.31:3000";

interface AuthContextType {
  user: any;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  getUserRoles: () => string[]; 
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => { },
  logout: () => { },
  loading: true,
  getUserRoles: () => [],
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {

    try {
      type DecodedToken = {
        "cognito:groups"?: string[];
        email: string;
        name: string;
      };
      const response = await axios.post(`${API_BASE_URL}/auth/signin`, {
        email,
        password,
      });
      const { accessToken, idToken, refreshToken } = response.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("idToken", idToken);
      localStorage.setItem("refreshToken", refreshToken);
      const token = localStorage.getItem("idToken");
      if (token) {
        const decoded: DecodedToken = jwtDecode(token);
        const userRoles = decoded["cognito:groups"] || [];
        console.log("User Roles:", userRoles);
      }
      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
    } catch (error) {
      console.error("Login failed", error);
      alert("Invalid credentials");
    }
  };

  const getUserRoles = () => {
  const token = localStorage.getItem("idToken");
  if (!token) return [];
  try {
    const decoded: any = jwtDecode(token);
    return decoded["cognito:groups"] || [];
  } catch (err) {
    console.error("Token decode error", err);
    return [];
  }
};

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    // Clear tokens and session
    localStorage.removeItem("accessToken");
    localStorage.removeItem("idToken");
    localStorage.removeItem("refreshToken");
  };


  return (
    <AuthContext.Provider value={{ user, login, logout, loading, getUserRoles }}>
      {children}
    </AuthContext.Provider>
  );
};



export const useAuth = () => useContext(AuthContext);
