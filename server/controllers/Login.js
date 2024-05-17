const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");
const Student = require("../models/student");
const Teacher = require("../models/faculty");

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body || req.headers;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        let id;

        // Check if the id is an admin
        id = await Admin.findOne({ email });
        if (!id) {
            // If not an admin, check if the id is a student
            id = await Student.findOne({ email });
            if (!id) {
                // If not a student, check if the id is a teacher
                id = await Teacher.findOne({ email });
            }
        }
        const user = id;

        if (!user) {
            return res.status(401).json({ success: false, message: "Incorrect email or password" });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (isPasswordMatch) {
            const payload = { email: user.email, id: user._id, role: user.role };
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" });
            res.cookie('authToken', token, { httpOnly: true, secure: false, maxAge: 60 * 60 * 1000, sameSite: 'lax' });
            return res.status(200).json({ success: true, message: "Login successful", token, role : user.role });
        }

        return res.status(403).json({ success: false, message: "Password incorrect" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
};
