const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 400;

let xOffset = 0;
let yOffset = 0;
let playerX = 0;
let playerY = 0;
const playerSpeed = 5;
// 移動した時の動き
function drawPlayer(x, y) {
    ctx.fillStyle = 'blue';
    ctx.fillRect(x - xOffset, y - yOffset, 20, 20);
}
// 背景の動き
function drawBackground() {
    ctx.fillStyle = 'green';
    // X,Y座標が100間隔
    for (let x = 0; x < 2000; x += 100) {
        for (let y = 0; y < 1000; y += 100) {
            if ((x + y) % 200 === 0) {
                ctx.fillRect(x - xOffset, y - yOffset, 50, 50);
            }
        }
    }
}

function updateOffsets() {
    // Offsetはキャラクターを固定する考え方
    // 初期地点からの差分を計算
    // 毎回の描画する時にキャラクター以外のオブジェクトをその差分分動かす
    // 結果、キャラクター以外（背景）動き、キャラクターが動いて見える
    xOffset = playerX - canvas.width / 2;
    yOffset = playerY - canvas.height / 2;
}

// プレイヤーの移動
function handleInput() {
    if (keys.ArrowLeft) playerX -= playerSpeed;
    if (keys.ArrowRight) playerX += playerSpeed;
    if (keys.ArrowUp) playerY -= playerSpeed;
    if (keys.ArrowDown) playerY += playerSpeed;
}

const keys = {};
window.addEventListener('keydown', (e) => keys[e.code] = true);
window.addEventListener('keyup', (e) => keys[e.code] = false);

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // プレイヤー移動イベント呼び出し
    handleInput();
    updateOffsets();
    drawBackground();
    drawPlayer(playerX, playerY);
    
    requestAnimationFrame(gameLoop);
}

gameLoop();