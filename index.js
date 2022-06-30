const express = require('express');
require('dotenv').config();

var app = express(), port = process.env.PORT;

global.__basedir = __dirname;

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(allowCrossDomain);

//register the route
var routes = require('./src/routes/funderjetRoutes');
routes(app); 

app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
});

app.listen(port);
console.log('Funderjet api server started on: ' + port);