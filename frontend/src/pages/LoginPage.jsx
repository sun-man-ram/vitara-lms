import { useState } from 'react';
import axios from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import Header from '../components/HeaderTemplate.jsx';
import Footer from '../components/Footer.jsx';
import '../styles/login.css'; // Make sure your styles.css includes styles for .top-bar, .login-page, etc.

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('/auth/login', form);
      const { token, userType } = res.data;

      localStorage.setItem('token', token);

      switch (userType) {
        case 'superAdmin':
          navigate('/dashboard/SuperAdminDash');
          break;
        case 'schoolAdmin':
          navigate('/dashboard/SchoolAdminDash');
          break;
        case 'student':
          navigate('/dashboard/StudentDash');
          break;
        default:
          alert('Unknown user type');
      }
    } catch (err) {
      alert(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <>
      <Header />
      <section className="login-page">
        <form className="login-form" onSubmit={handleSubmit}>
          <h1>Welcome</h1>

          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button type="submit">Log In</button>
        </form>
      </section>
    </>
  );
};

export default Login;
