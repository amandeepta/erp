import { useState } from "react";
import axios from "axios";

function AddStudents() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [department, setDepartment] = useState("");
    const [section, setSection] = useState("");
    const [year, setYear] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const onSubmit = async (event) => {
        event.preventDefault();
        
        // Simple client-side validation
        if (!name || !email || !password || !department || !section || !year) {
            setError("All fields are required");
            setSuccess("");
            return;
        }

        try {
            const response = await axios.post('http://localhost:4000/admin/addStudents', {
                email,
                password,
                name,
                department,
                section,
                year
            }, { withCredentials: true });

            if (response.status === 201) {
                setSuccess("Student added successfully");
                setName("");
                setEmail("");
                setPassword("");
                setDepartment("");
                setSection("");
                setYear("");
                setError("");
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setError(`Failed to add student: ${error.response.data.message}`);
            } else {
                setError("Failed to add student. Please try again.");
            }
            setSuccess("");
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">Add Student</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                {success && <p className="text-green-500 text-center mb-4">{success}</p>}
                <form onSubmit={onSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 mb-2">Name:</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 mb-2">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700 mb-2">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="department" className="block text-gray-700 mb-2">Department:</label>
                        <input
                            type="text"
                            id="department"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="section" className="block text-gray-700 mb-2">Section:</label>
                        <input
                            type="text"
                            id="section"
                            value={section}
                            onChange={(e) => setSection(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="year" className="block text-gray-700 mb-2">Year:</label>
                        <input
                            type="text"
                            id="year"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                    >
                        Add Student
                    </button>
                </form>
            </div>
        </div>
    )
}

export default AddStudents;
