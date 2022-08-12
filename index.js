// const express = require("express");

// const server = express();

// server.use(express.static("public")); //client ko bs ye folder visible hoga
// // now koi hmare server pr req marega obv browser ke through marega toh browser kya krega iss folder mai dekhege ki index.html hai bs usko parse krke dikha dega

// //obv client/browser ko public folder ke bhaar ka kuch nahi pta hoga kya kya hai server pr not even this file

// server.listen(3000,function(){
//     console.log("server is running at port 3000")
// })

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static("public"));

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