// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
   console.log("👮‍♂️ user in ProtectedRoute:", user);
console.log(user,'protectes')
  if (!user) {
    return <Navigate to="/login" replace />;
  }
 

  return children;
};

export default ProtectedRoute;
