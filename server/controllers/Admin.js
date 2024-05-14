const bcrypt = require("bcrypt");
const User = require("../models/admin");
const jwt = require("jsonwebtoken");
const Student = require("../models/student");
const Teacher = require("../models/faculty");
const Notice = require("../models/notice");
const Subject = require("../models/subject");
const Department = require("../models/department");

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
        const { email, password, name, department, section, year } = req.body;
        if (!email || !password || !name || !department || !section) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        const existingUser = await Student.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newStudent = new Student({ email, password: hashedPassword, name, role : "Student",department, section, year});
        await newStudent.save();
        return res.status(201).json({ success: true, message: "User registered successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.addTeachers = async (req, res) => {
    try {
        const { name, email, password, subject, department } = req.body;
        if (!email || !password || !name || !subject || !department) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        const existingUser = await Teacher.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newTeacher = new Teacher({ name, email, password: hashedPassword, role : "Faculty", subject, department });
        await newTeacher.save();
        return res.status(201).json({ success: true, message: "User registered successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error"});
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
        const { name, subjectCode, department, year } = req.body;
        
        // Check if the subject already exists
        const existingSubject = await Subject.findOne({ subjectCode });
        if (existingSubject) {
            return res.status(400).json({ success: false, message: 'Given subject is already added' });
        }

        // Create a new subject
        const newSubject = new Subject({
            name,
            subjectCode,
            department,
            year
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

exports.getSubject = async (req, res) => {
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

exports.addDepartment = async (req, res) => {
    try {
        const { department, code } = req.body;

        // Check if the department already exists
        const existingDepartment = await Department.findOne({ department });
        if (existingDepartment) {
            return res.status(400).json({ departmentError: "Department already exists" });
        }

        // Check if the code already exists
        const existingCode = await Department.findOne({ code });
        if (existingCode) {
            return res.status(400).json({ codeError: "Department code already exists" });
        }

        // Create new department
        const newDepartment = await Department.create({ department, code });

        // Return success response
        return res.status(201).json({
            success: true,
            message: "Department added successfully",
            department: newDepartment,
        });
    } catch (error) {
        // Handle errors
        console.error("Error adding department:", error);
        return res.status(500).json({ backendError: "An error occurred while adding the department" });
    }
};

exports.deleteAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        return res.status(200).json({ success: true, message: "Admin user deleted successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;
        await Student.findByIdAndDelete(id);
        return res.status(200).json({ success: true, message: "Student deleted successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.deleteTeacher = async (req, res) => {
    try {
        const { id } = req.params;
        await Teacher.findByIdAndDelete(id);
        return res.status(200).json({ success: true, message: "Teacher deleted successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.deleteNotice = async (req, res) => {
    try {
        const { id } = req.params;
        await Notice.findByIdAndDelete(id);
        return res.status(200).json({ success: true, message: "Notice deleted successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.deleteSubject = async (req, res) => {
    try {
        const { id } = req.params;
        await Subject.findByIdAndDelete(id);
        return res.status(200).json({ success: true, message: "Subject deleted successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.deleteDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        await Department.findByIdAndDelete(id);
        return res.status(200).json({ success: true, message: "Department deleted successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.getAllSubject = async (req, res) => {
    try {
      const subjects = await Subject.find();
      res.status(200).json(subjects);
    } catch (error) {
      console.log("Backend Error", error);
    }
  };

exports.getAllStudent = async (req, res) => {
    try {
      const students = await Student.find();
      res.status(200).json(students);
    } catch (error) {
      console.log("Backend Error", error);
    }
  };
