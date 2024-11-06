const express = require('express')
// 使うサーバーをインポート（デフォルト）
const { createServer } = require('node:http');
const { join } = require('node:path');
// socket.ioをインポート
const { Server } = require('socket.io');
// 使うクラス
const Game = require('../public/javascript/game.js');
const Player = require('../public/javascript/player.js');
const Terrain = require('../public/javascript/terrain.js');
// クラスインスタンス格納配列
let game = null;
// ルームID
let roomID = null;
// インターバル識別子
let intervalId = null;
// サーバーを作成
const app = express();

const server = createServer(app);

const io = new Server(server);

app.use(express.static('../public'));

// ゲーム画面のルーティング
app.get('/', (req, res) => {
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
            game = new Game();
            // 地形の初期設定
            game.initTerrain(Terrain);
        }
        // ルームに参加
        socket.join(roomId);
        // ルーム内の参加者の数を取得
        const numClients = room ? room.size : 0;
        // 特定個人のIDを送信
        io.to(socket.id).emit("sendID", socket.id);
        // プレイヤーの初期設定
        game.initPlayer(socket.id, Player);

        // 参加人数上限
        if(numClients == 4){
            // 超えたらゲーム開始
            game.isStartFlg = true;
            // サーバー側では60Hz間隔で更新
            intervalId = setInterval(() => {onUpdateFrame()}, 1000 / 60);
        }
        // Gameインスタンスを送信
        // 新しく参加者が追加されたGameインスタンスを再度送信
        io.to(roomId).emit("Update-Entity", game);
        
        console.log(socket.id+"が"+roomId+"に入室しました")
    });

    // 1フレームごとに行うゲーム処理
    // サーバー側で変更を行い、クライアントに返す
    function onUpdateFrame(){
        // プレイヤーの移動
        // game.proceedProcess();
        // xOffsetを更新
        game.rect();
        // 毎フレームスクロールごとの足場情報の更新
        game.scrollProcess(Terrain);
        // 自由落下判定
        game.fallProcess();

        // 更新したGameインスタンスをクライアント側に送信
        io.to(roomID).emit("Update-Entity", game);
    }

    // ジャンプ通知を受け取ったら
    socket.on("key", (roomId, keyState) => {
        // ジャンプ処理を行う
        game.jumpProcess(socket.id, keyState);
    });

    socket.on("disconnect", () => {
        socket.leave(roomID);
        clearInterval(intervalId);
        console.log(socket.id+"が退出")
    });

});


// サーバーの起動
server.listen(3000, () => {
    console.log('サーバーを起動しました');
});