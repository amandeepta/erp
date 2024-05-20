const express = require("express");
const router = express.Router();
const {auth,isAdmin} = require("../middlewear/auth");
const {
    login,
    addStudents,
    addTeachers,
    addAdmin,
    addNotice,
    dummyAdmin,
    addSubject,
    getSubject,
    getNotice,
    deleteAdmin,
    deleteStudent,
    deleteTeacher,
    deleteNotice,
    deleteSubject,
    deleteDepartment,
    getinfo
} = require("../controllers/Admin");

router.get("/info",auth, isAdmin, getinfo);
router.post("/dummy", dummyAdmin);
router.post("/login", login);
router.post("/addStudents", auth, isAdmin, addStudents);
router.post("/addTeachers", auth, isAdmin, addTeachers);
router.post("/addAdmin", auth, isAdmin, addAdmin);
router.post("/addNotice", auth, isAdmin, addNotice);
router.post("/addSubject", auth, isAdmin, addSubject);
router.get("/getSubject", auth, isAdmin, getSubject);
router.get("/getNotice", auth, isAdmin, getNotice);

// Delete routes
router.delete("/deleteAdmin/:id", auth, isAdmin, deleteAdmin);
router.delete("/deleteStudent/:id", auth, isAdmin, deleteStudent);
router.delete("/deleteTeacher/:id", auth, isAdmin, deleteTeacher);
router.delete("/deleteNotice/:id", auth, isAdmin, deleteNotice);
router.delete("/deleteSubject/:id", auth, isAdmin, deleteSubject);
router.delete("/deleteDepartment/:id", auth, isAdmin, deleteDepartment);

module.exports = router;