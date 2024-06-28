const express = require("express");
const router = express.Router();
const {auth,isFaculty} = require("../middlewear/auth");

const {
    getStudent,
    markAttendance,
    getinfo
} = require("../controllers/Faculty");

router.get("/info", auth, isFaculty, getinfo);
router.post("/getStudent",auth, isFaculty,getStudent);
router.post("/markAttendance", auth, isFaculty, markAttendance);
module.exports = router;