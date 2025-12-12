import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  // 1. Token Missing → Login Page
  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const now = Date.now();

    // 2. Token Expired → Clear and Redirect
    if (decoded.exp * 1000 <= now) {
      localStorage.clear();
      return <Navigate to="/auth/login" replace />;
    }

    // 3. Role Check → Prevent access to wrong module
    if (!allowedRoles.includes(decoded.Role)) {
      if (decoded.Role === "Admin") return <Navigate to="/admin/index" replace />;
      if (decoded.Role === "Operator") return <Navigate to="/operator/index" replace />;
      if (decoded.Role === "Moderator") return <Navigate to="/moderator/index" replace />;
    }

    // All OK
    return children;

  } catch (err) {
    console.error("Invalid token", err);
    localStorage.clear();
    return <Navigate to="/auth/login" replace />;
  }
};

export default ProtectedRoute;
