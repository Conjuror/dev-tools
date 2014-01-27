#!/usr/bin/env node

var exec = require('child_process').exec,
  child;

var dataSet, dataResult;

// A very basic web server in node.js
// Stolen from: Node.js for Front-End Developers by Garann Means (p. 9-10)

var port = 8000;
var serverUrl = "127.0.0.1";

var http = require("http");
var path = require("path");
var fs = require("fs");

// console.log("Starting web server at " + serverUrl + ":" + port);

server = http.createServer(function(req, res) {

  var now = new Date();

  var filename = req.url || "index.html";
  var ext = path.extname(filename);
  var localPath = __dirname;
  var validExtensions = {
    ".html": "text/html",
    ".js": "application/javascript",
    ".css": "text/css",
    ".txt": "text/plain",
    ".jpg": "image/jpeg",
    ".gif": "image/gif",
    ".png": "image/png"
  };
  var isValidExt = validExtensions[ext];

  if (isValidExt) {
    localPath += filename;
    path.exists(localPath, function(exists) {
      if (exists) {
        console.log("Serving file: " + localPath);
        getFile(localPath, res, isValidExt);
      } else {
        console.log("File not found: " + localPath);
        res.writeHead(404);
        res.end();
      }
    });

  } else {
    console.log("Invalid file extension detected: " + ext);
  }

}).listen(port, serverUrl);

function getFile(localPath, res, mimeType) {
  fs.readFile(localPath, function(err, contents) {
    if (!err) {
      res.setHeader("Content-Length", contents.length);
      res.setHeader("Content-Type", mimeType);
      res.statusCode = 200;
      res.end(contents);
    } else {
      res.writeHead(500);
      res.end();
    }
  });
}
// attach socket.io to the server
var io = require('socket.io').listen(server);

function updateData(data) {
  dataResult = [];
  if (data.substring(0, 11) != "APPLICATION") {
    return;
  }
  dataSet = data.split('\n');
  for (var i = 1 ; i < dataSet.length-3 ; i++) {
    obj = {};
    obj['app'] = dataSet[i].substring(0, 15).trim().replace(/[^A-Za-z0-9]/g, "");
    obj['pid'] = dataSet[i].substring(15, 22).trim();
    obj['vss'] = dataSet[i].substring(22, 31).trim();
    obj['rss'] = dataSet[i].substring(31, 40).trim();
    obj['pss'] = dataSet[i].substring(40, 49).trim();
    obj['uss'] = dataSet[i].substring(49, 58).trim();
    obj['cmdline'] = dataSet[i].substring(58);
    dataResult.push(obj);
  }

  io.sockets.emit('updateProcRank', dataResult);
}

function runShell() {
  child = exec('adb shell b2g-procrank',
    function(error, stdout, stderr) {
      updateData(stdout);
      console.log('stdout: ' + stdout);
      // console.log('stderr: ' + stderr);
      if (error !== null) {
        console.log('exec error: ' + error);
      }
    });
}

io.sockets.on('connection', function (socket) {
  timer = setInterval(runShell, 1000);

  socket.on('disconnect', function() {
    clearInterval(timer);
  });
});


