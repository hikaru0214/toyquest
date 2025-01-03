import express from 'express';
import {createServer} from 'node:http';
import { fileURLToPath } from 'node:url';
import {dirname,join} from 'node:path';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.static(join(__dirname,'/public')));
app.use(express.static(join(__dirname,'/node_modules/three')));
app.use(express.static(join(__dirname,'/node_modules/socket.io')));

app.get('/kt',(req,res) => {
    res.sendFile(join(__dirname,'game.html'));
});

io.on('connection',(socket)=>{
    console.log('a user connected');
});

server.listen(6060,()=>{
    console.log("server is running");
});