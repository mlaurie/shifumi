import { Navigate } from "react-router-dom";

function ProtectedRoutes ({ children }) {
  const isAuthenticated = localStorage.getItem('isAuthenticated')

  return isAuthenticated ? children : <Navigate to="/login" />;

}

export default ProtectedRoutes;

