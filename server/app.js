var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var path = require("path");
var cors = require("cors");
var _ = require("lodash");
var autoIncrement = require('mongoose-auto-increment');

var app = express();

serverPort = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
databasePort = 27017;
databseName = "wallet";

app.use(express.static(path.join(__dirname, "./dist")));

//connect to mongoDB
mongoose.connect('mongodb://127.0.0.1:'+ databasePort + '/' + databseName);

var connection = mongoose.connection
.on('error', console.error.bind(console, 'Database connection error:'))
.once('open', function() {  console.log("Database is connected!");  });

autoIncrement.initialize(connection);

var routes = require('./routes');

_.each(routes, function(controller, route){
    app.use(route, controller);
 });
 
 
var server = app.listen(serverPort, function(){
	console.log("Server started at port "+serverPort);
});
