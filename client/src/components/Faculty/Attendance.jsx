import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

function Attendance() {
    const location = useLocation();
    const { department: initialDepartment, subject: initialSubject } = location.state || {};
    
    const [department, setDepartment] = useState(initialDepartment || "");
    const [year, setYear] = useState("");
    const [section, setSection] = useState("");
    const [subjectCode, setSubjectCode] = useState(initialSubject || "");
    const [students, setStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [studentsFetched, setStudentsFetched] = useState(false);

    useEffect(() => {
        setDepartment(initialDepartment);
        setSubjectCode(initialSubject);
    }, [initialDepartment, initialSubject]);

    const fetchStudents = async () => {
        try {
            const token = localStorage.getItem("authToken");
            if (!token) throw new Error("No token found");

            const response = await axios.post('http://localhost:4000/faculty/getStudent', {
                department,
                year,
                section,
            }, { withCredentials: true });

            if (response.status === 200) {
                setStudents(response.data.students);
                setStudentsFetched(true);
            } else {
                throw new Error("Failed to fetch students");
            }
        } catch (error) {
            console.error("Error fetching students data", error);
            setStudents([]);
            setStudentsFetched(false);
        }
    };

    const handleFetchStudents = () => {
        if (!year || !section) {
            alert("Please fill all fields");
            return;
        }
        fetchStudents();
    };

    const handleCheckboxChange = (studentId) => {
        setSelectedStudents(prevSelected => {
            if (prevSelected.includes(studentId)) {
                return prevSelected.filter(id => id !== studentId);
            } else {
                return [...prevSelected, studentId];
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const token = localStorage.getItem("authToken");
            if (!token) throw new Error("No token found");

            const response = await axios.post("http://localhost:4000/faculty/markAttendance", {
                selectedStudents,
                subjectCode,
                department,
                year,
                section,
            }, {
                withCredentials: true
            });

            if (response.status === 200) {
                alert("Attendance submitted successfully!");
                setSelectedStudents([]); // Clear selected students after successful submission
                fetchStudents(); // Refresh the student list after submitting attendance
            } else {
                throw new Error(response.data.message || "Failed to submit attendance");
            }
        } catch (error) {
            console.error("Error submitting attendance", error);
            alert("Failed to submit attendance due to server error.");
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <div>
                <label className="block text-gray-700 font-bold mb-2">
                    Year:
                    <input
                        type="text"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                </label>
            </div>
            <div>
                <label className="block text-gray-700 font-bold mb-2">
                    Section:
                    <input
                        type="text"
                        value={section}
                        onChange={(e) => setSection(e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                </label>
            </div>
            <button
                onClick={handleFetchStudents}
                className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 mb-4"
            >
                Fetch Students
            </button>
            <form onSubmit={handleSubmit} className="space-y-4">
                <ul className="space-y-2">
                    {students.map((student) => (
                        <li key={student._id} className="flex items-center">
                            <input
                                type="checkbox"
                                checked={selectedStudents.includes(student._id.toString())}
                                onChange={() => handleCheckboxChange(student._id.toString())}
                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                            <label className="ml-2 text-gray-700">{student.name}</label>
                        </li>
                    ))}
                </ul>
                <button
                    type="submit"
                    disabled={!studentsFetched || selectedStudents.length === 0}
                    className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                >
                    Submit Attendance
                </button>
            </form>
        </div>
    );
}

export default Attendance;
