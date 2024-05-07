const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;
const subjectSchema = new mongoose.Schema( {
    name : {
        type : String,
        required : true,
        trim : true,
    },
    subjectCode: {
        type: String,
        required: true,
      },
      department: {
        type: String,
        required: true,
      },
      attendance : {
            type : ObjectId,
            ref : "attendance"
      }
    
})

module.exports = mongoose.model("subject",subjectSchema);