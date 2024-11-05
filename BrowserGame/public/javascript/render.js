class Render{
    constructor(canvas){
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
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
            this.ctx.fillRect(terrain.x, terrain.y, terrain.width, terrain.height);
        }
    }

    // プレイヤーの描画
    drawPlayer(game){
        // マルチのためプレイヤーの数だけ判定と描画
        for(let player of game.player){
            // プレイヤーの色
            this.ctx.fillStyle = player.styleColor;
            // Gameクラスのplayerを使う
            this.ctx.fillRect(player.x-game.xOffset, player.y, player.width, player.height);
        }
    }
}