const socket = io();
let param = new URL(document.location).pathname;
const playerList = document.getElementById("player-list");
const canvas = document.getElementById('gameCanvas');
// 描画を管理するクラス
const render = new Render(canvas);

let OwnID = null;
let game = null;

let roomId = generateRandomString(16);
console.log(roomId);
// ルームに参加する
socket.emit('joinRoom', roomId);

// 自分のIDを受け取る
socket.on("sendID", (id) => {
    OwnID = id;
});

// 自分用のGameクラスを受け取る
// 待ち時間の間に描画をしておく
socket.on("Init-Entity", (entity) => {
    // 更新されたGameクラスを上書き
    game = entity;
    // 足場の描画
    render.drawTerrain(game);
    // プレイヤーの描画
    render.drawPlayer(game);

    let joinMember = "";

    for(let i = 0;i<game.player.length;i++){
        joinMember += `<div class="player-box player-2">
            <span>プレイヤー2</span>
            <span>名前</span>
        </div>`;
    }
    if(param !== "/single"){
        playerList.innerHTML = joinMember;
    }
    
});

// マイフレームごとに最新のGameインスタンスを受け取る
socket.on("Update-Entity", (entity) => {
    // 更新されたGameクラスを上書き
    game = entity;
});

window.addEventListener("beforeunload", function() {
    // セッションストレージにフラグがセットされているか確認
    if (sessionStorage.getItem("reloaded")) {
        console.log("ページが再読み込みされました！");
        // ここに再読み込み時の処理を記述
        socket.disconnect();
    } else {
        // 初回アクセス時にフラグをセット
        sessionStorage.setItem("reloaded", "true");
        console.log("初回読み込みです。");
    }
});

function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}