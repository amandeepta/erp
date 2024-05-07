const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema( {
    name : {
        type : String,
        required : true,
        trim : true,
    },
    email : {
        type : String, 
        required : true,
        trim : true,
    },
    password :{
        type : String,
        required : true,
    },
    role : {
        type : String,
    },
    subject : {
        type : String, 
        required : true,
    },
    section : {
        type : String,
        required : true,
    }
    
})

module.exports = mongoose.model("teacher",teacherSchema);