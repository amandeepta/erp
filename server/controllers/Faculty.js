
const Student = require("../models/student");
const Teacher = require("../models/faculty");
const Subject = require("../models/subject");
const Attendance = require("../models/attendance");

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

        // Find or create the subject based on subjectCode
        let subject = await Subject.findOne({ subjectCode });
        if (!subject) {
            // Create a new subject if it doesn't exist
            subject = new Subject({ subjectCode });
            await subject.save();
        }

        // Find or create the attendance record for the subject
        let attendanceRecord = await Attendance.findOne({ subject: subject._id });
        if (!attendanceRecord) {
            // Create attendance record for the new subject
            attendanceRecord = new Attendance({
                subject: subject._id,
                totalLectures: 0,
                students: []
            });

            // Fetch all students for the department, year, and section
            const allStudents = await Student.find({ department, year, section });

            // Initialize attendance records for all students
            allStudents.forEach(student => {
                attendanceRecord.students.push({
                    student: student._id,
                    lecturesAttended: 0
                });
            });

            await attendanceRecord.save();
        }

        // Increment the total lectures for the subject
        attendanceRecord.totalLectures += 1;

        // Update attendance for selected students
        selectedStudents.forEach(studentId => {
            const studentRecord = attendanceRecord.students.find(student => student.student.toString() === studentId);
            if (studentRecord) {
                studentRecord.lecturesAttended += 1;
            }
        });

        // Save the updated attendance record
        await attendanceRecord.save();

        res.status(200).json({ message: "Attendance marked successfully" });
    } catch (error) {
        console.error("Error marking attendance:", error);
        res.status(500).json({ message: "Server error" });
    }
};