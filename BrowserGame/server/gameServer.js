const express = require('express')
// 使うサーバーをインポート（デフォルト）
const { createServer } = require('node:http');
const { join } = require('node:path');
// socket.ioをインポート
const { Server } = require('socket.io');
// 使うクラス
const GameRoom = require('../public/javascript/gameRoom.js');
const Game = require('../public/javascript/game.js');
const Player = require('../public/javascript/player.js');
const Terrain = require('../public/javascript/terrain.js');
// GameRoomインスタンス格納
let gameRoom = new GameRoom();
// インスタンス格納
let game = null;
// ルームID
let roomID = null;
// インターバル識別子
let intervalId = null;
// 指定された参加人数
let entry_member = null;
// サーバーを作成
const app = express();

const server = createServer(app);

const io = new Server(server);

app.use(express.static('../public'));

// favicon.icoリクエストを無視
app.get('/favicon.ico', (req, res) => res.status(204).end());

// ゲーム画面のルーティング
app.get('/:entry_member', (req, res) => {
    entry_member = req.params.entry_member;
    res.sendFile(join(__dirname, '../public/html/bicycleRunning.html'));
});

io.on('connection', (socket) => {
    
    // ルームに参加
    socket.on("joinRoom", (roomId) => {
        roomID = roomId;
        // ルームを取得
        const room = io.sockets.adapter.rooms.get(roomId);
        // ルームがあるか
        if (!room) {
            // まだルームがなかった場合（地形とGameインスタンスは一つのルームで共有する）
            // 参加者に渡す予定のインスタンス
            game = new Game(roomId);
            gameRoom.addGameRoom(Game, roomId);
            // 地形の初期設定
            game.initTerrain(Terrain);
        }
        // ルームに参加
        socket.join(roomId);
        // ルーム内の参加者の数を取得
        const numClients = room ? room.size : 1;
        // 特定個人のIDを送信
        io.to(socket.id).emit("sendID", socket.id);
        // プレイヤーの初期設定
        game.initPlayer(socket.id, Player);
        // 参加人数上限
        if(numClients == entry_member){
            // 超えたらゲーム開始
            game.isStartFlg = true;
            // Gameインスタンスで60Hz間隔で更新
            game.startInterval(Terrain, io);
            // intervalId = setInterval(() => {onUpdateFrame()}, 1000 / 60);
        }
        // 初期設定が終わったGameインスタンスをrooms配列に登録
        // Gameインスタンスを送信
        // 新しく参加者が追加されたGameインスタンスを再度送信
        io.to(roomId).emit("Init-Entity", game);
        
        console.log(socket.id+"が"+roomId+"に入室しました")
    });


    // ここをどうやってルームで分けてemitするか
    // 1フレームごとに行うゲーム処理
    // サーバー側で変更を行い、クライアントに返す
    function onUpdateFrame(){
        // // プレイヤーの移動
        // game.proceedProcess();
        // // xOffsetを更新
        // game.rect();
        // // 毎フレームスクロールごとの足場情報の更新
        // game.scrollProcess(Terrain);
        // // 自由落下判定
        // game.fallProcess();

        // // 更新したGameインスタンスをクライアント側に送信
        // io.to(roomID).emit("Update-Entity", game);
    }

    // ジャンプ通知を受け取ったら
    socket.on("key", (roomId, keyState) => {
        // ジャンプ処理を行う
        game.jumpProcess(socket.id, keyState);
    });

    socket.on("disconnect", () => {
        // ルーム退出処理
        socket.leave(roomID);
        // 1フレームごとの更新処理を停止
        // game.stopInterval();
        // clearInterval(intervalId);
        console.log(socket.id+"が退出")
    });

});


// サーバーの起動
server.listen(3000, () => {
    console.log('サーバーを起動しました');
});