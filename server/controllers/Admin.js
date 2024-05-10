const bcrypt = require("bcrypt");
const User = require("../models/admin");
const jwt = require("jsonwebtoken");
const Student = require("../models/student");
const Teacher = require("../models/teachers");
const Notice = require("../models/notice");
const Subject = require("../models/subject");
exports.dummyAdmin = async (req, res) => {
    try {
        const { email, password, name, username, role} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ name, email, password: hashedPassword, username,role });
        return res.status(201).json({ success: true, message: "Admin user created successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.addAdmin = async (req, res) => {
    try {
        const { email, password, name, username, role} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ name, email, password: hashedPassword, username,role });
        return res.status(201).json({ success: true, message: "Admin user created successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: "Incorrect email or password" });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (isPasswordMatch) {
            const payload = { email: user.email, id: user._id, role: user.role };
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

exports.addStudents = async (req, res) => {
    try {
        const { email, password, name, department, section } = req.body;
        if (!email || !password || !name || !department || !section) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        const existingUser = await Student.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newStudent = new Student({ email, password: hashedPassword, name, role : "student",department, section,  });
        await newStudent.save();
        return res.status(201).json({ success: true, message: "User registered successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.addTeachers = async (req, res) => {
    try {
        const { email, password, name, subject, section } = req.body;
        if (!email || !password || !name || !subject || !section) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        const existingUser = await Teacher.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newTeacher = new Teacher({ email, password: hashedPassword, name, role : "teacher", subject, section });
        await newTeacher.save();
        return res.status(201).json({ success: true, message: "User registered successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.addNotice = async (req, res) => {
    try {
        // Extracting the data from the request body
        const { title, date, content } = req.body;

        // Validate input: check that all required fields are provided
        if (!title || !date || !content) {
            return res.status(400).json({
                success: false,
                message: "All fields (title, date, content) are required"
            });
        }

        // Create a new notice instance
        const newNotice = new Notice({ title, date, content });

        // Save the new notice to the database
        await newNotice.save();

        // Return a success response
        return res.status(201).json({
            success: true,
            message: "Notice added successfully",
            notice: newNotice // Optionally, include the created notice in the response
        });
    } catch (error) {
        // Handle server errors
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message // Optionally, include the error message in the response
        });
    }
};

exports.getNotice = async (req, res) => {
    try {
        const notices = await Notice.find({});
        res.status(200).json({ success: true, notices });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch notices', error: error.message });
    }
};

exports.addSubject = async (req, res) => {
    try {
        const { subName, subCode, year, department, totalLectures } = req.body;
        
        // Check if the subject already exists
        const existingSubject = await Subject.findOne({ subjectCode: subCode });
        if (existingSubject) {
            return res.status(400).json({ success: false, message: 'Given subject is already added' });
        }

        // Create a new subject
        const newSubject = new Subject({
            totalLectures,
            department,
            subjectCode: subCode,
            subjectName: subName,
            year,
        });

        // Save the new subject to the database
        await newSubject.save();

        // Find students in the specified department and year
        const students = await Student.find({ department, year });
        if (students.length > 0) {
            // Add the new subject to each student's list of subjects
            for (let student of students) {
                student.subjects.push(newSubject._id);
                await student.save();
            }
        }

        // Respond with success
        return res.status(200).json({
            success: true,
            message: 'Subject added successfully',
            response: newSubject,
        });
    } catch (error) {
        // Handle any errors and respond with error message
        return res.status(500).json({
            success: false,
            message: 'Failed to add subject',
            error: error.message,
        });
    }
};

export const getSubject = async (req, res) => {
    try {
        const { department, year } = req.body;

        // Query subjects based on department and year
        const subjects = await Subject.find({ department, year });

        // Handle case where no subjects are found
        if (subjects.length === 0) {
            return res.status(404).json({ success: false, message: 'No subject found' });
        }

        // Respond with the found subjects
        return res.status(200).json({ success: true, result: subjects });
    } catch (error) {
        // Handle any errors and respond with an error message
        return res.status(500).json({ success: false, message: 'Failed to fetch subjects', error: error.message });
    }
};
  
  
