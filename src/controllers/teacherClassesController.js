'use strict';

let mongoose = require('mongoose'), TeacherClass = mongoose.model('TeacherClass');

exports.listTeacherClasses = function(req, res) {
    TeacherClass.find({}, function(err, teacherClass) {
        if (err)
            res.send(err);
        res.json(teacherClass);
    });
};

exports.listTeacherClassPerTeacher = function(req, res) {
    TeacherClass.find({teacherId:req.body.teacherId}, function(err, teacherClass) {
        if (err)
            res.send(err);
        res.json(teacherClass);
    });
};

exports.createTeacherClass = function(req, res) {
    let new_teacherClass = new TeacherClass(req.body);
    new_teacherClass.save(function(err, teacherClass) {
        if (err)
            res.send(err);
        res.json(teacherClass);
    });
};

exports.readTeacherClass = function(req, res) {
    TeacherClass.findById(req.params.classId, function(err, teacherClass) {
        if (err)
            res.send(err);
        res.json(teacherClass);
    });
};

exports.deleteTeacherClass = function(req, res) {
    TeacherClass.remove({
        _id: req.params.classId
    }, function(err, teacherClass) {
        if (err)
            res.send(err);
        res.json({ message: 'TeacherClass successfully deleted' });
    });
};