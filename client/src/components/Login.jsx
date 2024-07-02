import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaLock } from 'react-icons/fa';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      localStorage.removeItem("authToken");
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/login', {
        email: username,
        password: password,
      }, { withCredentials: true });

      const { token, role } = response.data;

      if (token) {
        localStorage.setItem("authToken", token);
        console.log(token);
      }

      if (role === 'Admin') {
        navigate('/admin');
      } else if (role === 'Student') {
        navigate('/student');
      } else if (role === 'Faculty') {
        navigate('/faculty');
      } else {
        navigate('/');
      }

    } catch (error) {
      setError('Wrong Password or Username');
      console.error('Login failed:', error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md relative z-10">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-900">Login</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-900 mb-2">Username:</label>
            <div className="flex items-center border border-gray-300 rounded">
              <FaUser className="text-gray-400 m-2" />
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-2 bg-white text-gray-900 border-none rounded-r focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-900 mb-2">Password:</label>
            <div className="flex items-center border border-gray-300 rounded">
              <FaLock className="text-gray-400 m-2" />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 bg-white text-gray-900 border-none rounded-r focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600 shadow-lg"
          >
            Login
          </button>
        </form>
      </div>
      <div className="absolute inset-0 z-0 bg-black opacity-30"></div>
    </div>
  );
}

export default Login;
