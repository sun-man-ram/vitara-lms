import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const PrivateRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('token');

  if (!token) return <Navigate to="/login" />;

  try {
    const decoded = jwtDecode(token);
    const userType = decoded.userType;

    if (allowedRoles.includes(userType)) {
      return <Outlet />;
    } else {
      return <Navigate to="/unauthorized" />;
    }
  } catch (err) {
    console.error("Invalid token:", err);
    return <Navigate to="/login" />;
  }
};

export default PrivateRoute;
