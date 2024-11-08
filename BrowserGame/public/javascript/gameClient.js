const socket = io();
const canvas = document.getElementById('gameCanvas');
// 描画を管理するクラス
const render = new Render(canvas);
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
// 待ち時間の間に描画をしておく
socket.on("Init-Entity", (entity) => {
    // 更新されたGameクラスを上書き
    game = entity;
    // 足場の描画
    render.drawTerrain(game);
    // プレイヤーの描画
    render.drawPlayer(game);
});

// マイフレームごとに最新のGameインスタンスを受け取る
socket.on("Update-Entity", (entity) => {
    // 更新されたGameクラスを上書き
    game = entity;
});