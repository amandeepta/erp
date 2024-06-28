import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPlus, FaUser, FaUserGraduate, FaUserTie } from 'react-icons/fa';

function Admin() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const token = localStorage.getItem("authToken");
                if (!token) throw new Error("No token found");
                const response = await axios.get("http://localhost:4000/admin/info", {
                    withCredentials: true
                });
                setUser(response.data);
            } catch (error) {
                setError("You are not authorized here");
            }
        };

        fetchUserInfo();
    }, []);

    const handleCreateNotice = () => {
        navigate('/createnotice');
    };

    const handleAddStudents = () => {
        navigate('/infoStudent');
    };

    const handleAddFaculty = () => {
        navigate('/infoFaculty');
    };

    const handleAddAdmin = () => {
        navigate('/addadmin');
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/');
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            {user && user.role === "Admin" ? (
                <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
                    <h1 className="text-2xl font-bold text-center mb-4">Welcome to the Admin Dashboard</h1>
                    <div className="mb-4">
                        <p className="text-gray-700"><strong>User ID:</strong> {user.id}</p>
                        <p className="text-gray-700"><strong>User Name:</strong> {user.name}</p>
                        {/* Render more user data fields as needed */}
                    </div>
                    <div className="grid grid-cols-1 gap-4 mb-4">
                        <button
                            className="flex items-center justify-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                            onClick={handleCreateNotice}
                        >
                            <FaPlus className="mr-2" /> Create Notice
                        </button>
                        <button
                            className="flex items-center justify-center bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                            onClick={handleAddStudents}
                        >
                            <FaUserGraduate className="mr-2" /> Add Students
                        </button>
                        <button
                            className="flex items-center justify-center bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600"
                            onClick={handleAddFaculty}
                        >
                            <FaUserTie className="mr-2" /> Add Faculty
                        </button>
                        <button
                            className="flex items-center justify-center bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600"
                            onClick={handleAddAdmin}
                        >
                            <FaUser className="mr-2" /> Add Admin
                        </button>
                    </div>
                    <button
                        className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                        onClick={handleLogout}
                    >
                        Log Out
                    </button>
                </div>
            ) : (
                <div className="text-red-500 text-center">
                    <p>{error || "Loading..."}</p>
                </div>
            )}
        </div>
    );
}

export default Admin;
