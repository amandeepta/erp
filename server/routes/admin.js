const express = require("express");
const router = express.Router();
const {auth,isAdmin} = require("../middlewear/auth");
const {login, addStudents, addTeachers, addAdmin, addNotice,dummyAdmin} = require("../controllers/Admin");
router.post("/dummy", dummyAdmin);
router.post("/login", login);
router.post("/addStudendts",auth,isAdmin,addStudents);
router.post("addTeachers",auth,isAdmin,addTeachers);
router.post("/addAdmin", auth,isAdmin,addAdmin);
router.post("/addNotice", auth,isAdmin,addNotice);

module.exports = router;