const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Student = require("../models/student");
const Attendance = require("../models/attendance");

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }
        const user = await Student.findOne({ email });
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


exports.getAttendance = async (req, res) => {
  try {
    // Assuming the user ID is stored in a cookie named 'userId'
    const accessToken = req.cookies.authToken;

// Decode the JWT token to extract the payload
    const decodedToken = jwt.decode(accessToken);

    // Extract the user ID from the decoded token
    const userId = decodedToken ? decodedToken.id : null;


    console.log(userId);
    // Find the student based on the user ID
    const student = await Student.findById(userId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Find attendance records for the student and populate subject details
    const attendance = await Attendance.find({ student: student._id }).populate("subject");

    if (!attendance || attendance.length === 0) {
      return res.status(404).json({ message: "Attendance not found" });
    }

    // Calculate attendance percentage and format the response
    const result = attendance.map((att) => ({
      percentage: ((att.lecturesAttended / att.totalLectures) * 100).toFixed(2),
      subjectCode: att.subject.subjectCode,
      subjectName: att.subject.subjectName,
      attended: att.lecturesAttended,
      total: att.totalLectures,
    }));

    res.status(200).json({ result });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};