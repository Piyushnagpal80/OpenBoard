const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static("public"));  //visible to client

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('message', function(data){
        console.log(data);
        socket.broadcast.emit("broadcast",data);
      });

      socket.on("mousedown", function(point) {
        socket.broadcast.emit("onmousedown", point);
      });
      socket.on("mousemove", function(point) {
        socket.broadcast.emit("onmousemove", point);
      });
      socket.on("undo", function() {
        socket.broadcast.emit("onundo");
      });
      socket.on("redo", function() {
        socket.broadcast.emit("onredo");
      });
      
  });
  
  let port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log('listening on *:3000');
  });