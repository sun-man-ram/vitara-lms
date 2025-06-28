import './App.css';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/LoginPage.jsx';
import SuperAdmin from './pages/dashboards/SuperAdminDash.jsx';
import SchoolAdmin from './pages/dashboards/SchoolAdminDash.jsx';
import Student from './pages/dashboards/StudentDash.jsx';
import Home from './pages/HomePage.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import PrivateRoute from './routes/PrivateRoute.jsx';

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route element={<PrivateRoute allowedRoles={['superAdmin']} />}>
          <Route path="/dashboard/SuperAdminDash" element={<SuperAdmin />} />
        </Route>

        <Route element={<PrivateRoute allowedRoles={['schoolAdmin']} />}>
          <Route path="/dashboard/SchoolAdminDash" element={<SchoolAdmin />} />
        </Route>

        <Route element={<PrivateRoute allowedRoles={['student']} />}>
          <Route path="/dashboard/StudentDash" element={<Student />} />
        </Route>

        <Route path="/unauthorized" element={<h2>Unauthorized Access</h2>} />
      </Routes>
    </>
  );
}

export default App;
