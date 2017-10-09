var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var morgan = require('morgan');
var mongoose = require('mongoose');
var config = require('./config');
var router = express.Router();
var appRoutes = require('./server/routes/api.js')(router);
var bodyParser = require('body-parser');
var path = require('path');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/client'));
app.use('/api', appRoutes);

mongoose.connect(config.db.uri);


app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname + '/client/views/index.html'));
});

app.listen(port, function() {
  console.log("Server is running on port " + port);
});
