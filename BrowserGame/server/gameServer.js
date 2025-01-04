const express = require('express')
// 使うサーバーをインポート（デフォルト）
const { createServer } = require('node:http');
const { join } = require('node:path');
// socket.ioをインポート
const { Server } = require('socket.io');
// 使うクラス
const GameRoom = require('../public/javascript/gameRoom.js');
const Game = require('../public/javascript/bicycleGame.js');
const Player = require('../public/javascript/player.js');
const Terrain = require('../public/javascript/terrain.js');
// GameRoomインスタンス格納
let gameRoom = new GameRoom();
// 指定された参加人数
let entry_member = null;
// サーバーを作成
const app = express();

const server = createServer(app);

const io = new Server(server);

app.use(express.static('../public'));

// favicon.icoリクエストを無視
app.get('/favicon.ico', (req, res) => res.status(204).end());

// シングル用画面
app.get('/single', (req, res) => {
    // 参加人数を取得
    entry_member = 1;
    res.sendFile(join(__dirname, '../public/html/SinglebicycleRunning.html'));
});
// マルチ用画面
app.get('/:entry_member', (req, res) => {
    // 参加人数を取得
    entry_member = req.params.entry_member;
    res.sendFile(join(__dirname, '../public/html/MultibicycleRunning.html'));
});

io.on('connection', (socket) => {
    // ルームに参加
    socket.on("joinRoom", (roomId) => {
        // ルームを取得
        const room = io.sockets.adapter.rooms.get(roomId);
        // ルームがあるか
        if (!room) {
            // まだルームがなかった場合
            // 参加者に渡す予定のインスタンス
            gameRoom.addGameRoom(Game, roomId, Terrain);
        }
        // GameRoomクラスのRooms配列からGameインスタンスを取得
        let gameInstance = gameRoom.getGameInstance(roomId);
        // ルームに参加
        socket.join(roomId);
        // 誰がどのルームに参加しているか分かるようにする
        socket.roomId = roomId;
        // ルーム内の参加者の数を取得
        const numClients = room ? room.size : 1;
        // 特定個人のIDを送信
        io.to(socket.id).emit("sendID", socket.id);
        // プレイヤーの初期設定
        gameInstance.initPlayer(socket.id, Player);
        // 参加人数上限
        if(numClients == entry_member){
            // 超えたらゲーム開始
            gameInstance.isStartFlg = true;
            // Gameインスタンスで60Hz間隔で更新
            gameInstance.startInterval(Terrain, io);
        }
        // 初期設定が終わったGameインスタンスをrooms配列に登録
        // Gameインスタンスを送信
        // 新しく参加者が追加されたGameインスタンスを再度送信
        io.to(roomId).emit("Init-Entity", gameInstance);
        console.log(socket.id+"が"+roomId+"に入室しました")
    });    

    // ジャンプ通知を受け取ったら
    socket.on("key", (roomId, keyState) => {
        // どのルームでジャンプ処理が行われたか
        let gameInstance = gameRoom.getGameInstance(roomId);
        // ジャンプ処理を行う
        gameInstance.jumpProcess(socket.id, keyState);
    });

    socket.on("disconnect", async () => {
        let disconnectId = socket.roomId;
        // ルームインスタンスを取得
        let GameInstance = gameRoom.rooms.find(room => room.roomID === disconnectId);
        // ルームを取得
        const room = io.sockets.adapter.rooms.get(disconnectId);
        const numClients = room === undefined ? 1 : room.size;
        // ルーム内の参加者の数
        if(numClients === 1){
            // 最後の一人だったら部屋を削除
            gameRoom.removeGameRoom(disconnectId);
        }
        // 退出プレイヤーインスタンス削除
        GameInstance.removePlayer(socket.id);
        // ルーム退出処理
        socket.leave(disconnectId);
    });

});

// サーバーの起動
server.listen(3000, () => {
    console.log('サーバーを起動しました');
});