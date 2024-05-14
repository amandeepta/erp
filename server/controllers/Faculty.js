const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Student = require("../models/student");
const Teacher = require("../models/faculty");
const Subject = require("../models/subject");
const Attendance = require("../models/attendance");


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }
        const user = await Teacher.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: "Incorrect email or password" });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (isPasswordMatch) {
            const payload = { email: user.email, id: user._id, role: user.role, subject : user.subject };
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" });
            res.cookie('authToken', token, { httpOnly: true, 
            secure: false, 
            maxAge: 60 * 60 * 1000,
            sameSite: 'lax'});
            return res.status(200).json({ success: true, message: "Login successful", token });
        }
        return res.status(403).json({ success: false, message: "Password incorrect" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
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
      res.status(200).json({ result: students });
    } catch (error) {
      // Handle server errors
      console.error("Error:", error);
      res.status(500).json({ backendError: "Server error" });
    }
  };

exports.markAttendance = async (req, res) => {
try {
    const { selectedStudents, subjectCode, department, year, section } = req.body;

    const subject = await Subject.findOne({ subjectCode});
    const allStudents = await Student.find({ department, year, section });


    for (let i = 0; i < allStudents.length; i++) {
    const attendance = await Attendance.findOne({
        student: allStudents[i]._id,
        subject: subject._id,
        
    });

    // If attendance record doesn't exist, create a new one
    if (!attendance) {
        const newAttendance = new Attendance({
        student: allStudents[i]._id,
        subject: subject._id,
        totalLectures: 1,
        });
        await newAttendance.save();
    } else {
        // If attendance record exists, increment total lectures by faculty
        attendance.totalLectures += 1;
        await attendance.save();
    }
    }

    // Loop through selected students to mark their attendance
    for (let i = 0; i < selectedStudents.length; i++) {
    const attendance = await Attendance.findOne({
        student: selectedStudents[i],
        subject: subject._id,
    });

    // If attendance record doesn't exist, create a new one
    if (!attendance) {
        const newAttendance = new Attendance({
        student: selectedStudents[i],
        subject: subject._id,
        lecturesAttended: 1,
        });
        await newAttendance.save();
    } else {
        // If attendance record exists, increment lectures attended
        attendance.lecturesAttended += 1;
        await attendance.save();
    }
    }
    res.status(200).json({ message: "Attendance marked successfully" });
} catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
}
};
  