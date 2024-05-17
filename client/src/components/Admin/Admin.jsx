import { useAuth } from '../AuthProvider';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaUser, FaUserGraduate, FaUserTie } from 'react-icons/fa';

function Admin() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleCreateNotice = () => {
        // Navigate to the route for creating a notice
        navigate('/create-notice');
    };

    const handleAddStudents = () => {
        // Navigate to the route for adding students
        navigate('/add-students');
    };

    const handleAddFaculty = () => {
        // Navigate to the route for adding faculty
        navigate('/add-faculty');
    };

    const handleAddAdmin = () => {
        // Navigate to the route for adding admin
        navigate('/add-admin');
    };

    return (
        <div>
            {user && user.role === "Admin" && (
                <div>
                    <h1>Welcome to the admin dashboard</h1>
                    <div>
                        <p>User ID: {user?.data?.id}</p>
                        <p>User Name: {user?.data?.name}</p>
                        {/* Render more user data fields as needed */}
                    </div>
                    <div className="action-buttons">
                        <button onClick={handleCreateNotice}>
                            <FaPlus /> Create Notice
                        </button>
                        <button onClick={handleAddStudents}>
                            <FaUserGraduate /> Add Students
                        </button>
                        <button onClick={handleAddFaculty}>
                            <FaUserTie /> Add Faculty
                        </button>
                        <button onClick={handleAddAdmin}>
                            <FaUser /> Add Admin
                        </button>
                    </div>
                </div>
            )}

            {user && user.role !== 'Admin' && (
                <div>
                    <p>Access denied. You are not authorized to view this page.</p>
                </div>
            )}
        </div>
    );
}

export default Admin;
