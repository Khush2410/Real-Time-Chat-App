const express = require('express');
const http = require("http");
const { Server } = require("socket.io");
const path = require('path');
const app = express();

const server = http.createServer(app);
const dotenv = require('dotenv');
dotenv.config({ path: './../environment.env' });
const port = process.env.PORT || 8000; 
const io = new Server(server);

app.use(express.static(path.join(__dirname, '..')));

server.listen(port, () => {
  console.log(`Socket.io server running on port ${port}`);
});


let users = {};

io.on("connection", (socket)=>{
    socket.on("new-user-joined", (name)=>{
        users[socket.id] = name;
        socket.broadcast.emit('user-joined',name);
    });

    socket.on("send", (message)=>{
        socket.broadcast.emit('receive', {message : message, name : users[socket.id]});
    })

    socket.on("disconnect", ()=>{
        socket.broadcast.emit("user-leave", users[socket.id]);
        delete users[socket.id];
    })
})