import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Student() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("No token found");
        const response = await axios.get("http://localhost:4000/student/info", {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          withCredentials: true,
        });
        setUser(response.data);
      } catch (error) {
        setError("You are not authorized here");
      }
    };

    fetchUserInfo();
  }, []);

  const handleNavigate = () => {
    navigate('/getAttendance');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : user && user.success && user.role === "Student" ? (
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-4">Welcome to the student Dashboard</h1>
          <div className="mb-4">
            <p className="text-gray-700"><strong>User ID:</strong> {user.id}</p>
            <p className="text-gray-700"><strong>User Name:</strong> {user.name}</p>
            <p className="text-gray-700"><strong>Department:</strong> {user.department}</p>
            <p className="text-gray-700"><strong>Section:</strong> {user.section}</p>
            <p className="text-gray-700"><strong>Year:</strong> {user.year}</p>
          </div>
          <button
            onClick={handleNavigate}
            className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            Get Attendance
          </button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Student;
