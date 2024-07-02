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
        <div className="min-h-screen bg-gradient-to-r from-purple-300 to-blue-200 flex flex-col items-center justify-center p-4">
            {user && user.role === "Admin" ? (
                <div className="bg-white shadow-lg rounded-3xl p-8 w-full max-w-md">
                    <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Admin Dashboard</h1>
                    <div className="mb-6 text-center">
                        <p className="text-gray-600"><strong>User ID:</strong> {user.id}</p>
                        <p className="text-gray-600"><strong>User Name:</strong> {user.name}</p>
                    </div>
                    <div className="grid grid-cols-1 gap-6 mb-6">
                        <button
                            className="flex items-center justify-center bg-indigo-500 text-white py-3 px-5 rounded-full hover:bg-indigo-600 transition duration-300"
                            onClick={handleCreateNotice}
                        >
                            <FaPlus className="mr-2" /> Create Notice
                        </button>
                        <button
                            className="flex items-center justify-center bg-teal-500 text-white py-3 px-5 rounded-full hover:bg-teal-600 transition duration-300"
                            onClick={handleAddStudents}
                        >
                            <FaUserGraduate className="mr-2" /> Students
                        </button>
                        <button
                            className="flex items-center justify-center bg-orange-500 text-white py-3 px-5 rounded-full hover:bg-orange-600 transition duration-300"
                            onClick={handleAddFaculty}
                        >
                            <FaUserTie className="mr-2" /> Faculty
                        </button>
                        <button
                            className="flex items-center justify-center bg-pink-500 text-white py-3 px-5 rounded-full hover:bg-pink-600 transition duration-300"
                            onClick={handleAddAdmin}
                        >
                            <FaUser className="mr-2" /> Admin
                        </button>
                    </div>
                    <button
                        className="w-full bg-red-500 text-white py-3 px-5 rounded-full hover:bg-red-600 transition duration-300"
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
