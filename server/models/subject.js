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
      year : {
        type : String,
        required : true
      }
    
})

module.exports = mongoose.model("subject",subjectSchema);