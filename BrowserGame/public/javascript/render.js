class Render{
    constructor(canvas){
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.xOffset = 0;
        this.yOffset = 0;
    }

    // 描画する時にキャラクター以外のオブジェクトをその差分分動かす
    setOffset(){
        let OwnInstance = game.player.find(player => player.socketID == OwnID);
        this.xOffset = OwnInstance.x - 40;
        // Yだけカメラの速度を変える
        let desiredY = OwnInstance.y;
        let dy = this.yOffset - desiredY;
        this.yOffset -= dy/10;
    }

    getYoffset(){
        return this.yOffset-350;
    }

    // 描画のリセット
    resetRender(){
        this.ctx.clearRect(0,0,canvas.width,canvas.height);
    }

    // 足場の描画
    drawTerrain(game){
        for(let terrain of game.terrainArray){
            // 足場の色
            this.ctx.fillStyle = "black";
            // GameクラスのterrainArrayを使う
            this.ctx.fillRect(terrain.x, terrain.y-this.getYoffset(), terrain.width, terrain.height);
        }
    }

    // プレイヤーの描画
    drawPlayer(game){
        // マルチのためプレイヤーの数だけ判定と描画
        for(let player of game.player){
            if(player.isOverFlg == false){
                // プレイヤーの色
                this.ctx.fillStyle = player.styleColor;
                // Gameクラスのplayerを使う
                this.ctx.fillRect(player.x-this.xOffset, player.y-this.getYoffset(), player.width, player.height);
            }
        }
    }
    // スコアを描画する関数
    drawScore(game) {
        this.ctx.font = '24px Arial'; // フォントサイズとフォントファミリーを設定
        this.ctx.fillStyle = 'black'; // テキストの色を設定
        this.ctx.textAlign = 'right'; // テキストの配置を右揃えに
        this.ctx.fillText(`Score: ${game.score}`, canvas.width - 40, 30); // 右端から10px、上から30pxの位置に描画
    }
}