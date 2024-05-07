const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema( {
    student: {
        type: Schema.Types.ObjectId,
        ref: "student",
      },
      subject: {
        type: Schema.Types.ObjectId,
        ref: "subject",
      },
    
})

module.exports = mongoose.model("attendance",attendanceSchema);