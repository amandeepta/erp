const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const attendanceSchema = new mongoose.Schema( {
    student: {
        type: ObjectId,
        ref: "student",
      },
      subject: {
        type: ObjectId,
        ref: "subject",
      },
      totalLectures : {
        type : Number,
        default : 0
      },
      lecturesAttended : {
        type : Number, 
        default : 0,
      }
    
})

module.exports = mongoose.model("attendance",attendanceSchema);