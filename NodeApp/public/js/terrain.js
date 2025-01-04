// 足場のクラス
class Terrain{
    constructor(x,y){
        this.x = x;
        this.y = y+Math.floor(Math.random() * ( 50 - 10 ) + 10);
        this.width = Math.floor(Math.random() * ( 150 - 50 ) + 50);
        this.height = 350;
    }

    // 衝突の判定
    intersect(player, velocityY){
        // プレイヤーが足場に乗っている
        return (
            this.x < 40 + player.width &&
            this.x + this.width > 40 &&
            this.y > player.y &&
            // 足場に少しめり込んでしまうため落下速度も考慮
            this.y < player.y + player.height + velocityY
        );
    }

    // 描画開始地点の更新
    onUpdateTerrainX(renderPoint){
        this.x = renderPoint;
    }
}

module.exports = Terrain;