const express = require('express')
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const redis = require('redis');
const cookieParser = require('cookie-parser');
// 使うクラス
const GameRoom = require('./public/js/gameRoom.js');
const Game = require('./public/js/bicycleGame.js');
const Player = require('./public/js/player.js');
const Terrain = require('./public/js/terrain.js');
// GameRoomインスタンス格納
let gameRoom = new GameRoom();
// 指定された参加人数
let entry_member = null;
// サーバーを作成
const app = express();
// redisクライアントを作成
const client = redis.createClient({
    host: '127.0.0.1',
    port: 6379
});

const server = createServer(app);

const io = new Server(server);

app.use(express.static('./public'));
// EJSの設定
app.set('view engine', 'ejs');

// JSONボディを解析するためのミドルウェア
app.use(express.json());
app.use(express.urlencoded({extended: true}));
// favicon.icoリクエストを無視
app.get('/favicon.ico', (req, res) => res.status(204).end());

// シングル用画面
app.post('/single', (req, res) => {
    // POSTしたユーザー名をGameインスタンスに格納
    const name = req.body.userName;
    // 参加人数を取得
    entry_member = 1;
    res.render(join(__dirname, './public/SinglebicycleRunning'),{ userName: name });
});

// ルーム作成画面から
app.post('/createRoom', (req, res) => {
    // POSTしたユーザー名をGameインスタンスに格納
    const InfoId = req.body.userInfo;
    res.sendFile(join(__dirname, './public/chariso_createroom'),{ userInfo: InfoId });
});

// URLからアクセスする人もentryパラメタを設定する
app.get('/rooms', (req, res) => {
    // 参加人数を取得
    entry_member = req.query.entry;
    res.sendFile(join(__dirname, './public/MultibicycleRunning.html'));
});

io.on('connection', (socket) => {
    // ルームに参加
    socket.on("joinRoom", (roomId, userName) => {
        // ルームを取得
        const room = io.sockets.adapter.rooms.get(roomId);
        // ルームがあるか
        if (!room) {
            // まだルームがなかった場合
            // 参加者に渡す予定のインスタンス
            gameRoom.addGameRoom(Game, roomId);
            gameRoom.setTerrain(gameRoom.getGameInstance(roomId), Terrain)
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
        gameInstance.initPlayer(socket.id, Player, userName);
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
        console.log("----入室処理----");
        console.log("参加者:"+numClients);
        console.log("Playerインスタンス"+gameInstance.player.length);
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
        // 退出プレイヤーインスタンス削除
        GameInstance.removePlayer(socket.id);
        console.log("----退出処理----");
        console.log("Playerインスタンス"+GameInstance.player.length);
        console.log(numClients);
        // ルーム内の参加者の数
        if(GameInstance.player.length === 0){
            // 最後の一人だったら部屋を削除
            gameRoom.removeGameRoom(disconnectId);
            console.log("thorw");
            console.log(gameRoom.rooms);
        }
        // ルーム退出処理
        socket.leave(disconnectId);
    });

});

// サーバーの起動
server.listen(3000, () => {
    console.log('サーバーを起動しました');
});