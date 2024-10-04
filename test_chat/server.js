const express = require('express')
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express()
const server = createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'chat1.html'));
});

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('クライアントが接続しました');

    // ルームへの参加を処理する
    socket.on('joinRoom', (roomId) => {
        //ルームに参加する
        socket.join(roomId);
        console.log(`ルーム ${roomId} に参加しました`);
    });

    // メッセージの受信とブロードキャスト
    socket.on('chatMessage', (roomId, message) => {
        io.to(roomId).emit('message', message);
        
    });

    // クライアントが切断したときの処理
    socket.on('disconnect', () => {
        
        console.log('クライアントが切断されました');
    });
});

server.listen(8000, () => console.log("test"))
