const express = require("express");
const router = express.Router();
const {auth,isFaculty} = require("../middlewear/auth");

const {
    login,
    getStudent,
    markAttendance
} = require("../controllers/Faculty");

router.post("/login",login);
router.get("/getStudent", auth, isFaculty,getStudent);
router.post("/markAttendance", auth, isFaculty, markAttendance);
module.exports = router;