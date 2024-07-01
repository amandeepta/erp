import React, { useEffect, useState } from "react";
import axios from "axios";

function GetAttendance() {
  const [attendance, setAttendance] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error("Invalid access");
        const response = await axios.get("http://localhost:4000/student/getAttendance", {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setAttendance(response.data.result);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchAttendance();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Attendance</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded my-6">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="w-1/4 py-3 px-4 uppercase font-semibold text-sm border-b-2 border-gray-300 text-center">Subject Code</th>
              <th className="w-1/4 py-3 px-4 uppercase font-semibold text-sm border-b-2 border-gray-300 text-center">Subject Name</th>
              <th className="w-1/4 py-3 px-4 uppercase font-semibold text-sm border-b-2 border-gray-300 text-center">Lectures Attended</th>
              <th className="w-1/4 py-3 px-4 uppercase font-semibold text-sm border-b-2 border-gray-300 text-center">Total Lectures</th>
              <th className="w-1/4 py-3 px-4 uppercase font-semibold text-sm border-b-2 border-gray-300 text-center">Percentage</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {attendance.map((att, index) => (
              <tr key={index} className="bg-gray-100 border-b border-gray-200 hover:bg-gray-200">
                <td className="py-3 px-4 border-b border-gray-300 text-center">{att.subjectCode}</td>
                <td className="py-3 px-4 border-b border-gray-300 text-center">{att.subjectName}</td>
                <td className="py-3 px-4 border-b border-gray-300 text-center">{att.attended}</td>
                <td className="py-3 px-4 border-b border-gray-300 text-center">{att.total}</td>
                <td className="py-3 px-4 border-b border-gray-300 text-center">{att.percentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default GetAttendance;
