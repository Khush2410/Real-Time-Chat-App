const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer();
const dotenv = require('dotenv');
dotenv.config({ path: './../environment.env' });
const port = process.env.PORT || 8000; 


const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST"]
  }
});

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