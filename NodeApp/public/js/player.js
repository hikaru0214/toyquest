const DBservice = require('./DBservice');
class Player{
    constructor(socketID,x,y,width,height,velocityY,jumpStrength){
        this.socketID = socketID;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        // 落下モーション表現のための変数
        this.velocityY = velocityY;
        // 1フレームごとのジャンプの移動量
        this.jumpStrength = jumpStrength;
        // ジャンプしていない状態
        this.isJumping = false;
        // ランダムに色を付ける
        this.styleColor = '#' + Math.floor(Math.random()*16777215).toString(16);
        // ゲームオーバーフラグ
        this.isOverFlg = false;
        // ゲームスコア
        this.score = 0;

    }
    update(){
        this.x += 4;
    }
    jump(SpaceKeyState) {
        // Spaceが押されたかつ、着地状態
        if(SpaceKeyState === true && !this.isJumping) {
            // 1フレームごとのジャンプの移動量を格納
            this.velocityY = this.jumpStrength;
            // 最初のフレームのジャンプ移動量をセット
            this.y += this.velocityY;
            // ジャンプした状態へ変更
            this.isJumping = true;
        }
    }

    // プレイヤーの落下処理
    fallPlayer(terrainArray,gravity){
        // ゲームオーバーなら返す
        if(this.isOverFlg === true) return;
        // ジャンプor落下状態の場合
        // 落下速度を0.8ずつ（重力分）加算
        // 1フレームごとに重力が加算され、
        // 勢いがなくなっていく
        this.velocityY += gravity;
        this.velocityY = Math.trunc(this.velocityY * 10) / 10;
        // 1フレームごとに落下速度が0.8ずつ増える
        this.y += this.velocityY;
        // 足場に乗っているか？
        for(let i = 0; i < 2; i++){
            // 要素の0、1番目の足場に乗っていれば
            if(terrainArray[i].intersect(this,this.velocityY)){
                // ジャンプしていなければ
                if(this.velocityY > 0){
                    // 着地状態に
                    this.isJumping = false;
                    // 足場の高さにプレイヤーを移動
                    this.y = terrainArray[i].y - this.height;
                    // 落下速度を0に
                    this.velocityY = 0;
                }else{
                    // ジャンプ状態のまま
                    this.isJumping = true;
                }
            }
        }
    }

    scoreUpdate(){
        this.score += 1;
    }

    // ゲームオーバー判定
    gameOverCheck(){
        // プレイヤーが落下して画面外に落ちた時
        if(this.y > 800 && this.isOverFlg === false){
            // DBservice.dbConnect(this.score);
            this.y = 350;
            // ゲームオーバーにする
            this.isOverFlg = true;
        }
    }
}

// if (typeof module !== 'undefined' && module.exports) {
//     // Node.js環境（require使用時）
    module.exports = Player;
//   } else if (typeof window !== 'undefined') {
//     // ブラウザ環境（script tag使用時）
//     window.Player = Player;
//   }