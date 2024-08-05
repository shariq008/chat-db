import express from "express";
import mongoose from "mongoose";
import authRouter from "./routers/authRouter.js";
import messageRouter from "./routers/messageRouter.js";

import { createServer } from "node:http";
import { Server } from 'socket.io';
import cors from 'cors';
import Message from "./models/Message.js";
import { secret } from "./config.js";
import jwt from "jsonwebtoken";
import msgController from "./controllers/msgController.js";


const PORT = process.env.PORT || 5000;
const DB_URL = `mongodb://localhost:27017/chatdb`;

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
      origin: '*',
    }
});
const corsHeaders = {
    'Access-Control-Allow-Origin': "*",
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
    'Access-Control-Allow-Headers': 'Content-Type'
};
 
app.use(express.json());
app.use('/auth', authRouter);
app.use('/msgs', messageRouter);
app.use(cors());
app.use(allowAnyCORS);

function allowAnyCORS (req, res, next) {
    for(let header in corsHeaders){
        req.header(header, corsHeaders[header]);
        res.header(header, corsHeaders[header]);
    }
    next();
}

mongoose.connect(DB_URL, {useUnifiedTopology: true, useNewUrlParser: true}).then(() => {
    console.log('connected')
}).catch(err => console.log(err))

async function startApp(){
    try{
        await mongoose.connect(DB_URL)
        httpServer.listen(PORT, () => console.log('SERVER WORKS ON PORT ' + PORT));
    } catch (e){
        console.log(e)
    }
}

io.use(function(socket, next){
    if (socket.handshake.query && socket.handshake.query.token){
      jwt.verify(socket.handshake.query.token, secret, function(err, decoded) {
        if (err) return next(new Error('Authentication error'));
        socket.decoded = decoded;
        next();
      });
    }
    else {
      next(new Error('Authentication error'));
    }    
})
.on('connection', function(socket) {  
    socket.broadcast.emit('user-connected', socket.decoded.username);
    socket.emit('user-connected', socket.decoded.username)


    socket.on('send-chat-message', (message) => {
        const msg =  new Message({ userId: socket.decoded.id, username: socket.decoded.username, message: message });
        msg.save() 
        .then((result) => {
            socket.broadcast.emit('chat-message', { username: socket.decoded.username, message: message });
            socket.emit('chat-message', { username: socket.decoded.username, message: message });
        })
        .catch((err) => {
            console.log('err', err)
        })
    });

    socket.on('disconnect', function() {  
        socket.broadcast.emit('user-disconnected', socket.decoded.username);
    });

})

startApp();