const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Student = require("../models/student");
const Attendance = require("../models/attendance");

exports.getinfo = async (req, res) => {
  try {
      const username = req.email;
      if (!username) {
          return res.status(400).json({ error: 'Username is required' });
      }
      const user = await Student.findOne({ email: username });
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json({
          success: true,
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          section: user.section,
          year: user.year,
          department: user.department,
          subjects: user.subjects
      });
  } catch (error) {
      console.error('Error fetching user information:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};


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
    const accessToken = req.cookies.authToken;

    // Decode the JWT token to extract the payload
    const decodedToken = jwt.decode(accessToken);

    // Extract the user ID from the decoded token
    const userId = decodedToken ? decodedToken.id : null;

    if (!userId) {
      return res.status(400).json({ message: "Invalid token" });
    }

    console.log(userId);

    // Find attendance records for the student and populate subject details
    const attendance = await Attendance.find({ "students.student": userId }).populate("subject");

    if (!attendance || attendance.length === 0) {
      return res.status(404).json({ message: "Attendance not found" });
    }

    // Calculate attendance percentage and format the response
    const result = attendance.map(att => {
      const studentRecord = att.students.find(student => student.student.toString() === userId);

      if (studentRecord) {
        return {
          percentage: ((studentRecord.lecturesAttended / att.totalLectures) * 100).toFixed(2),
          subjectCode: att.subject.subjectCode,
          subjectName: att.subject.name, // Use the populated subject name
          attended: studentRecord.lecturesAttended,
          total: att.totalLectures,
        };
      } else {
        return null;
      }
    }).filter(record => record !== null);

    res.status(200).json({ result });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};