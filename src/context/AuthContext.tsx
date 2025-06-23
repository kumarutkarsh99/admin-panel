import React, { createContext, useContext, useState } from "react";
import axios from "axios";
const API_BASE_URL ='http://51.20.181.155:3000';
console.log(API_BASE_URL)

interface AuthContextType {
  user: any;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(() => {
  const savedUser = localStorage.getItem("user");
  return savedUser ? JSON.parse(savedUser) : null;
});

  const login = async (email: string, password: string) => {
    console.log("login() called with:", email, password); 
    console.log("Form values:", { email, password });
    try {
      const response = await axios.post(`${API_BASE_URL}/user/login`, { email, password });
      const userData = response.data.message.result.user;
      console.log(userData, "trace the login credentials");
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData)); // ✅ persist user
    } catch (error) {
      console.error("Login failed", error);
      alert("Invalid credentials");
    }
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
