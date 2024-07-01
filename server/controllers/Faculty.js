
const Student = require("../models/student");
const Teacher = require("../models/faculty");
const Subject = require("../models/subject");
const Attendance = require("../models/attendance");
const student = require("../models/student");

exports.getinfo = async (req, res) => {
    try {
        const username = req.email;
        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }
        const user = await Teacher.findOne({ email: username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({
            success: true,
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                department : user.department,
                subject : user.subject
        });
    } catch (error) {
        console.error('Error fetching user information:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    
};

exports.getStudent = async (req, res) => {
    try {
      const { department, year, section } = req.body;
      const errors = {};
  
      // Check if required parameters are provided
      if (!department || !year || !section) {
        errors.missingParameters = "Department, year, and section are required";
        return res.status(400).json(errors);
      }
  
      // Find students based on department, year, and section
      const students = await Student.find({ department, year, section });
  
      // If no students are found, return a 404 error
      if (students.length === 0) {
        errors.noStudentError = "No students found";
        return res.status(404).json(errors);
      }
  
      // Return found students
      res.status(200).json({
        success : true,
        students : students
      } );
    } catch (error) {
      // Handle server errors
      console.error("Error:", error);
      res.status(500).json({ backendError: "Server error" });
    }
  };

  exports.markAttendance = async (req, res) => {
    try {
        const { selectedStudents, subjectCode, department, year, section } = req.body;

        let subject = await Subject.findOne({ subjectCode });
        if (!subject) {
            subject = new Subject({ subjectCode });
            await subject.save();
        }

        let attendanceRecord = await Attendance.findOne({ subject: subject._id });
        if (!attendanceRecord) {
            attendanceRecord = new Attendance({
                subject: subject._id,
                totalLectures: 0,
                students: []
            });

            const allStudents = await Student.find({ department, year, section });

            allStudents.forEach(student => {
                attendanceRecord.students.push({
                    student: student._id,
                    lecturesAttended: 0
                });
            });

            await attendanceRecord.save();
        }

        attendanceRecord.totalLectures += 1;

        selectedStudents.forEach(studentId => {
            const studentRecord = attendanceRecord.students.find(student => student.student.toString() === studentId);
            if (studentRecord) {
                studentRecord.lecturesAttended += 1;
            } else {
                attendanceRecord.students.push({
                    student: studentId,
                    lecturesAttended: 1
                });
            }
        });

        await attendanceRecord.save();

        res.status(200).json({ message: "Attendance marked successfully" });
    } catch (error) {
        console.error("Error marking attendance:", error);
        res.status(500).json({ message: "Server error" });
    }
};
