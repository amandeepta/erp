import React, { useState, useEffect } from "react";
import axios from "axios";

function Attendance() {
    const [department, setDepartment] = useState("");
    const [year, setYear] = useState("");
    const [section, setSection] = useState("");
    const [students, setStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get("http://localhost:4000/Faculty/getStudents", {
                    params: {
                        department,
                        year,
                        section,
                    },
                });
                setStudents(response.data);
            } catch (error) {
                console.error("Error fetching students data", error);
            }
        };

        if (department && year && section) {
            fetchStudents();
        }
    }, [department, year, section]);

    const handleCheckboxChange = (studentId) => {
        setSelectedStudents((prevSelected) => {
            if (prevSelected.includes(studentId)) {
                return prevSelected.filter((id) => id !== studentId);
            } else {
                return [...prevSelected, studentId];
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:4000/Faculty/submitAttendance", {
                department,
                year,
                section,
                selectedStudents,
            });
            alert("Attendance submitted successfully!");
        } catch (error) {
            console.error("Error submitting attendance", error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 font-bold mb-2">
                        Department:
                        <input
                            type="text"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                    </label>
                </div>
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
                <div>
                    <ul className="space-y-2">
                        {students.map((student) => (
                            <li key={student.id} className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={selectedStudents.includes(student.id)}
                                    onChange={() => handleCheckboxChange(student.id)}
                                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                />
                                <label className="ml-2 text-gray-700">{student.name}</label>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                    >
                        Submit Attendance
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Attendance;
