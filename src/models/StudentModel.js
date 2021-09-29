'use strict';
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let StudentSchema = new Schema({
    studentId:{
        type: String,
        required: 'Kindly provide the student ID',
        unique: true,
        dropDups:true
    },

    name: {
        type: String,
        required: 'Kindly enter the name of the student'
    },

    surname: {
        type: String,
        required: 'Kindly enter the surname of the student'
    },

    idNumber: {
        unique: true,
        dropDups:true,
        type: String,
        required: 'Kindly enter the ID Number of the student'
    },

    emailAddress: {
        type: String,
        required: 'Kindly enter the email address of the student'
    },

    guardianName: {
        type: String,
        // required: 'Kindly enter the Guardian Name'
    },
    classId: {
        type: String,
        required: 'Kindly select class of the student'
    },
    phoneNumber: {
        type: Number,
        required: 'Kindly enter the phonenumber'
    },
    dob: {
        type: Date
    },

    dateJoined: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Students', StudentSchema);