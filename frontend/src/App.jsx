import './App.css';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/LoginPage.jsx';
import SuperAdmin from './pages/dashboards/SuperAdminDash.jsx';
import SchoolAdmin from './pages/dashboards/SchoolAdminDash.jsx';
import Student from './pages/dashboards/StudentDash.jsx';
import SchoolRegistrationPage from './pages/SchoolRegistrationPage.jsx';
import ClassRegistrationPage from './pages/classRegistrationPage.jsx';
import SchoolsListPage from './pages/SchoolsListPage';
import ViewClassesPage from './pages/ViewClassesPage.jsx';
import StudentRegistrationPage from './pages/StudentRegistrationPage';
import ShowStudentsPage from './pages/ShowStudentsPage.jsx';
import ExamsPage from './pages/ExamsPage.jsx';
import ResultsPage from './pages/UploadResultPage.jsx'
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
        <Route element={<PrivateRoute allowedRoles={['superAdmin']} />}>
          <Route path="/show-students" element={<ShowStudentsPage />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={['student']} />}>
          <Route path="/dashboard/StudentDash" element={<Student />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={['superAdmin']} />}>
          <Route path="/school-registration" element={<SchoolRegistrationPage />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={['superAdmin']} />}>
          <Route path="/schools" element={<SchoolsListPage />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={['superAdmin']} />}>
          <Route path="/class-registration" element={<ClassRegistrationPage />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={['superAdmin']} />}>
          <Route path="/view-classes" element={<ViewClassesPage />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={['superAdmin']} />}> 
          <Route path="/student-registration" element={<StudentRegistrationPage />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={['superAdmin']} />}>
          <Route path="/exams" element={<ExamsPage />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={['superAdmin']} />}>
          <Route path="/results" element={<ResultsPage />} />
        </Route>
        <Route path="/unauthorized" element={<h2>Unauthorized Access</h2>} />
      </Routes>
    </>
  );
}

export default App;
