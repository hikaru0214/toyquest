// キーの状態を格納
let keyState = [];
// アニメーションの判別ID
let animationId = null;
function gameLoop(){
    
    // 描画のリセット（毎回しないと前のフレームの描画が残る）
    render.resetRender();
    // 足場の描画
    render.drawTerrain(game);
    // プレイヤーの描画
    render.drawPlayer(game);
    // 次のフレームへ
    animationId = requestAnimationFrame(gameLoop);
}

// キーが押された
document.addEventListener('keydown', function(e) {
    // 押されたキーがスペースだったら
    if (e.code === 'Space') {
        // スペースキーの状態を変化
        keyState[e.key] = true;
        // サーバーにキーの状態を送信
        socket.emit('key', roomId, keyState[e.key]);
    }
});

function emitData(){
    // 毎フレームごとにGameインスタンスを更新
    socket.emit('Update-Players', "testRoom");
}

// gameを受け取るまで待つ必要が...
function waitTime(){
    // gameを受け取った＆人数がそろった
    if(game !== null && game.isStartFlg){
        // ゲーム開始
        animationId = requestAnimationFrame(gameLoop);
    }else {
        // 待つ
        setTimeout(waitTime, 10);
    }
}

waitTime();