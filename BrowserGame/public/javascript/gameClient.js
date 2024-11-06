const socket = io();
let OwnID = null;
let game = null;
let roomId = "testRoom";
// ルームに参加する
socket.emit('joinRoom', roomId);

// 自分のIDを受け取る
socket.on("sendID", (id) => {
    OwnID = id;
})

// 自分用のGameクラスを受け取る
// マイフレームごとに最新のGameインスタンスを受け取る
socket.on("Update-Entity", (entity) => {
    // 更新されたGameクラスを上書き
    game = entity;
});
