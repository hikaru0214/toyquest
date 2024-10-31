const express = require('express')
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const path = require("path");


const app = express();
const server = createServer(app);
const io = new Server(server);
// メモリ上にメッセージを保存
let messages = {};

let socketID = null;

app.get('/', (req, res) => {
    res.sendFile(join(__dirname,'top.html'));
});

app.get('/chat', (req, res) => {
    res.sendFile(join(__dirname, 'chat1.html'));
});

app.use(express.static('public'));
// ioはサーバー全体を指す（名前空間やルームなど全体の接続管理をする）
// socketはユーザー一人一人の個々の接続を指す（）
io.on('connection', (socket) => {
    console.log('クライアントが接続しました');
    
    socketID = socket.id;
    
    // ルームへの参加を処理する
    socket.on('joinRoom', (roomId) => {
        // ルームに参加する
        socket.join(roomId);
        // ルーム内のメッセージが存在するか
        if(!messages[roomId]){
            // なければ空の配列を作成
            messages[roomId] = [];
        }
        // 過去のメッセージを送信
        socket.emit("previousMessages", messages[roomId]);
        // ルームのソケットを取得
        const room = io.sockets.adapter.rooms.get(roomId);
        // ルーム内の参加者数を取得
        const numClients = room ? room.size : 0;
        // to()の部分をsocket.idにすると特定の相手に送れる
        io.to(socketID).emit("roomSize", numClients, socketID)
        console.log(`ルーム ${roomId} に参加しました`);
        console.log(`ルームに ${numClients} 人参加しました`);
        // socket.idは各ユーザーの識別子を表す
        console.log(`User with ID ${socket.id} joined room ${room}`);
    });

    // メッセージの受信とブロードキャスト
    socket.on('chatMessage', (roomId, message) => {
        messages[roomId].push(message);
        io.to(roomId).emit('message', message);
    });

    // クライアントが切断したときの処理
    socket.on('disconnect', () => {
        
        console.log('クライアントが切断されました');
    });
});

server.listen(8000, () => console.log("test"))
