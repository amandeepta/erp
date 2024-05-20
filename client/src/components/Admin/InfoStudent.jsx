import { useNavigate } from 'react-router-dom';
import { FaPlus, FaTrash, FaList, FaEdit } from 'react-icons/fa';

function Student() {
    const navigate = useNavigate();

    const handleAdd = () => {
        navigate("/addStudents");
    };

    const handleRemove = () => {
        navigate("/removeStudent");
    };

    const handleGetAll = () => {
        navigate("/getAllStudents");
    };

    const handleUpdate = () => {
        navigate("/updateStudent");
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <button
                className="flex items-center px-4 py-2 m-2 text-white bg-green-500 rounded hover:bg-green-600"
                onClick={handleAdd}
            >
                <FaPlus className="mr-2" />
                Add Student
            </button>
            <button
                className="flex items-center px-4 py-2 m-2 text-white bg-red-500 rounded hover:bg-red-600"
                onClick={handleRemove}
            >
                <FaTrash className="mr-2" />
                Remove Student
            </button>
            <button
                className="flex items-center px-4 py-2 m-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                onClick={handleGetAll}
            >
                <FaList className="mr-2" />
                Get All Students
            </button>
            <button
                className="flex items-center px-4 py-2 m-2 text-white bg-yellow-500 rounded hover:bg-yellow-600"
                onClick={handleUpdate}
            >
                <FaEdit className="mr-2" />
                Update Student
            </button>
        </div>
    );
}

export default Student;
