// import express from 'express';
// import {createServer} from "http"
// import {Server} from "socket.io"
// import { fileURLToPath } from 'node:url';
// import { dirname, join } from 'node:path';

// const app = express();
// const server=createServer(app);
// const io=new Server(server);
// const allusers={}

// const __dirname = dirname(fileURLToPath(import.meta.url));
// console.log(__dirname);
// app.use(express.static("public"));

// // handle io connection
// io.on("connection",(socket)=>{
//     console.log("a user connected id=" + socket.id);
//    const socketid=socket.id;
//     socket.on(("create-user"),(username)=>{
//       console.log("user created: " + username);
// allusers[username]={username,id:socketid};
//     io.emit("user-joined", allusers);


//     })
//     socket.on("offer",({from,to,offer})=>{
//       console.log({from,to,offer});
// io.to(allusers[to].id).emit("offer", { from, to, offer }); // ✅ send full object
//     })
//     socket.on("answer",({from,to,answer})=>{
//       console.log({from,to,answer});
//       io.to(allusers[from].id).emit("answer",{from,to,answer});
//     })
// socket.on("New ICE candidate",candidate=>{
//   console.log(candidate);
//   socket.broadcast.emit("New ICE candidate",candidate);

// })
// })

// app.get('/', (req, res) => {
//   res.sendFile(join(__dirname ,"App" , 'index.html'));
// });













// server.listen(3000,()=>{
//     console.log(`port is run in ${3000}`)
// })
//github
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';



const app = express();
const server = createServer(app);
const io = new Server(server);
const allusers = {};

// /your/system/path
const __dirname = dirname(fileURLToPath(import.meta.url));


// exposing public directory to outside world
app.use(express.static("public"));
// app.use(express.static(__dirname));
app.use(express.static(join(__dirname, 'App')));

// handle incoming http request
app.get("/", (req, res) => {
    console.log("GET Request /");
    res.sendFile(join(__dirname + "/app/index.html"));
});

// handle socket connections
io.on("connection", (socket) => {
    console.log(`Someone connected to socket server and socket id is ${socket.id}`);
    socket.on("join-user", username => {
        console.log(`${username} joined socket connection`);
        allusers[username] = { username, id: socket.id };
        // inform everyone that someone joined
        io.emit("joined", allusers);
    });

    socket.on("offer", ({from, to, offer}) => {
        console.log({from , to, offer });
        io.to(allusers[to].id).emit("offer", {from, to, offer});
    });

    socket.on("answer", ({from, to, answer}) => {
       io.to(allusers[from].id).emit("answer", {from, to, answer});
    });

    socket.on("end-call", ({from, to}) => {
        io.to(allusers[to].id).emit("end-call", {from, to});
    });

    socket.on("call-ended", caller => {
        const [from, to] = caller;
        io.to(allusers[from].id).emit("call-ended", caller);
        io.to(allusers[to].id).emit("call-ended", caller);
    })

    socket.on("icecandidate", candidate => {
        console.log({ candidate });
        //broadcast to other peers
        socket.broadcast.emit("icecandidate", candidate);
    }); 
})

server.listen(9000, () => {
    console.log(`Server listening on port 9000`);
});