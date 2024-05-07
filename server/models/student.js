const mongoose = require("mongoose");

// Use mongoose.Schema and mongoose.Types.ObjectId
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const studentSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
    },
    department: {
        type: String,
        required: true,
    },
    section: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    subjects: [
        {
            type: ObjectId, 
            ref: 'subject',
        }
    ]
});

module.exports = mongoose.model("student", studentSchema);
