const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// プレイヤーの設定
const player = {
    x: 50,
    y: 50,
    width: 30,
    height: 30,
    vy: 0
};

// 足場の設定
let platforms = [];
const platformWidth = 100;
const platformHeight = 10;
const platformSpeed = 8;

// ゲームの設定
const gravity = 0.5;
const ground = canvas.height - 20;

// 新しい足場を生成する関数
function generatePlatform() {
    const y = Math.random() * (canvas.height - 100) + 50; // 高さをランダムに設定
    platforms.push({
        x: canvas.width,
        y: y,
        width: platformWidth,
        height: platformHeight
    });
}

// 衝突判定関数
//  checkCollision(プレイヤー,地面)
function checkCollision(obj1, obj2) {
        // プレイヤーが足場を飛び越えていない
    return obj1.x < obj2.x + obj2.width &&
        // プレイヤーが足場の始点を超えている
           obj1.x + obj1.width > obj2.x &&
        // プレイヤーが足場より上にいる
           obj1.y < obj2.y + obj2.height 
        // プレイヤーが
        //    obj1.y + obj1.height > obj2.y;
}

// ゲームループ
function gameLoop() {
    // キャンバスのクリア
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // プレイヤーに重力を適用
    player.vy += gravity;
    player.y += player.vy;

    // 地面との衝突判定
    if (player.y + player.height > ground) {
        player.y = ground - player.height;
        player.vy = 0;
    }

    // 足場の更新と描画
    ctx.fillStyle = 'green';
    for (let i = platforms.length - 1; i >= 0; i--) {
        let platform = platforms[i];
        
        // 足場を左に移動
        platform.x -= platformSpeed;

        // 画面外に出た足場を削除
        if (platform.x + platform.width < 0) {
            platforms.splice(i, 1);
            continue;
        }

        // 足場の描画
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);

        // プレイヤーとの衝突判定
        if (checkCollision(player, platform) && player.vy > 0) {
            player.y = platform.y - player.height;
            player.vy = 0;
        }
    }

    // 新しい足場の生成
    if (Math.random() < 0.1 || platforms.length === 0) { // 2%の確率で生成
        generatePlatform();
    }

    // プレイヤーの描画
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // 地面の描画
    ctx.fillStyle = 'brown';
    ctx.fillRect(0, ground, canvas.width, canvas.height - ground);

    // 次のフレームを要求
    requestAnimationFrame(gameLoop);
}

// ゲームループの開始
gameLoop();

// キー入力の処理（オプション）
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && player.y + player.height >= ground) {
        player.vy = -10; // ジャンプ
    }
});