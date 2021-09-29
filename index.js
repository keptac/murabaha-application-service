const express = require('express');
require('dotenv').config();

var app = express(), port = process.env.PORT, mongoose = require('mongoose');

//Register Models
const announcement = require('./src/models/AnnouncementsModel');
const classes = require('./src/models/classesModel');
const reportSubmissions = require('./src/models/ReportSubmissionsModel'); 
const student = require('./src/models/StudentModel');
const staff = require('./src/models/StaffModel');
const studentMarks = require('./src/models/StudentMarksModel'); 
const subjects = require('./src/models/SubjectsModel');
const teacherClasses = require('./src/models/TeacherClassModel');
const multer = require('multer');
global.__basedir = __dirname;

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASE_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}); 

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('./public'));
app.use('/uploads', express.static('uploads'));

//register the route
var routes = require('./src/routes/esmRoutes');
routes(app); 

app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
});

app.listen(port);
console.log('Westminster api server started on: ' + port);