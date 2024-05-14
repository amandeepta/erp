const express = require("express");
const router = express.Router();
const {auth,isStudent} = require("../middlewear/auth");

const {
    login,
    getAttendance
} = require("../controllers/Student");

router.post("/login",login);
router.get("/getAttendance", auth, isStudent,getAttendance);

module.exports = router;