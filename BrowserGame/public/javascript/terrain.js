// 足場のクラス
class Terrain{
    constructor(x,y){
        this.x = x;
        this.y = y+Math.floor(Math.random() * ( 50 - 10 ) + 10);
        this.width = Math.floor(Math.random() * ( 150 - 50 ) + 50);
        this.height = 350;
    }

    // 衝突の判定
    intersect(player){
        // プレイヤーが足場に乗っている
        return (
            this.x < 40 + player.width &&
            this.x + this.width > 40 &&
            this.y > player.y &&
            this.y < player.y + player.height
        );
    }

    // 描画開始地点の更新
    onUpdateTerrainX(renderPoint){
        this.x = renderPoint;
    }
}

// if (typeof module !== 'undefined' && module.exports) {
//     // Node.js環境（require使用時）
    module.exports = Terrain;
//   } else if (typeof window !== 'undefined') {
//     // ブラウザ環境（script tag使用時）
//     window.Player = Terrain;
//   }