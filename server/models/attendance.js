const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const studentAttendanceSchema = new mongoose.Schema({
    student: {
        type: ObjectId,
        ref: "student",
        required: true
    },
    lecturesAttended: {
        type: Number,
        default: 0
    }
});

const subjectAttendanceSchema = new mongoose.Schema({
    subject: {
        type: ObjectId,
        ref: "subject",
        required: true
    },
    totalLectures: {
        type: Number,
        default: 0
    },
    students: [studentAttendanceSchema]
});

module.exports = mongoose.model("attendance", subjectAttendanceSchema);
