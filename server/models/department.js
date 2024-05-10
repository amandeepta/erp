const mongoose = require("mongoose");

const departmentSchema = mongoose.Schema({
  department : {
    type : String,
    required : true
  },
  code : {
    type : String,
    required : true,
    unique : true
  }
  
});

module.exports = mongoose.model("department", department);