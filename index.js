const http = require('http');
const express = require('express');
const cors = require('cors');
const socketIO = require('socket.io');

const app = express();
const port = process.env.PORT; // if 4500 is not available then whoever online port which will be took

const user = [{}];
app.use(cors()); //cors is use to inter communication between url
app.get('/',(req,res) => {
    res.send("<h2>hello it is working now!</h2>")
})
const server = http.createServer(app);

const io = socketIO(server);

io.on('connection',(socket) => {
    console.log('new connection');
    socket.on('joined',({userName}) => {
        user[socket.id] = userName; // socket.id is generate every time when new user log in and it is unique
        console.log(`user is joined ${userName}`);
        socket.broadcast.emit("newUser",{user:'Admin',message:`${user[socket.id]} has joined`}) // broadcast sent message to other instead of the user
        socket.emit("welcome",{user:"Admin",message:`welcome to the chat, ${user[socket.id]}`}) //emit limits to that user only not to other
    })

        socket.on("disconnected",() => {
            socket.broadcast.emit('userLeft',{user:'Admin',message:`${user[socket.id]} has left`});
            console.log('user left');
        })

        socket.on('chat-data',({chatData,id}) => {
            console.log(user[socket.id]);
            io.emit('send-message',{user:user[socket.id],message:chatData,id});
        })

})


server.listen(port, () => {
    console.log(`server working on the http://localhost:${port}`);
})