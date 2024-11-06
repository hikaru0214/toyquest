class Game{
    constructor(){
        // 基準値からの差分を格納
        this.xOffset = 0;
        // プレイヤークラスを配列に格納
        this.player = [];
        // 足場クラスを配列に格納
        this.terrainArray = [];
        // ゲームの重力
        this.gravity = 0.8;
        // ゲーム開始フラグ
        this.isStartFlg = false;
    }

    // 描画する時にキャラクター以外のオブジェクトをその差分分動かす
    rect(){
        // 補正量を算出
        this.xOffset = this.player[0].x - 40;
        // console.log(this.xOffset)
    }

    // プレイヤーの初期設定
    initPlayer(socketID, Player){
        this.player.push(new Player(socketID, 0, 350, 15, 15, 0, -15));
    }

    // 足場の初期設定
    initTerrain(Terrain){
        for(let i = 0;i<9;i++){
            this.terrainArray[i] = new Terrain(i*200, 400);
        }
    }

    // スクロールのための描画位置設定
    scrollProcess(Terrain){
        // 足場描画開始地点
        let startX = this.getInitRectPoint();
        // 毎フレームごとに足場管理
        this.terrainManage(Terrain, startX);
        // 足場情報の更新
        this.onUpdateTerrain(startX);
    } 

    // プレイヤーの移動
    proceedProcess(){
        for(var i = 0;i<this.player.length;i++){
            // 各プレイヤーの位置を更新
            this.player[i].update();
        }
    }

    // ジャンプ処理
    jumpProcess(opePlayer, keyState){
        // ジャンプしたプレイヤーを探す
        const playerIndex = this.player.findIndex(player => player.socketID == opePlayer);
        // 見つけた要素番号でジャンプ処理
        this.player[playerIndex].jump(keyState)
    }

    // 自由落下の処理
    fallProcess(){
        // 各プレイヤーのY座標を更新
        for(var i = 0; i<this.player.length;i++){
            // 自由落下させるかを判定
            this.player[i].fallPlayer(this.terrainArray, this.gravity);
        }
    }

    // 移動量から描画開始地点を算出
    getInitRectPoint(){
        // 足場の描画開始地点を算出
        return (this.xOffset % 200)*(-1);
    }

    // 足場の表示・非表示を管理
    terrainManage(Terrain,startX){
        // 画面左にフェードアウトするタイミング
        // 足場の描画地点が-200以下になる＆移動量が200以上の場合
        if(startX === 0 && this.xOffset >= 200){
            // 左の足場を削除
            this.terrainArray.splice(0,1);
            // 右からフェードインする足場を追加
            this.terrainArray.push(new Terrain(1500, 400));
        }
    }

    // スクロールのための足場位置変更
    onUpdateTerrain(startX){
        // 最初の足場の要素番号
        let index = Math.trunc(startX/200);
        for(let renderPoint = startX; renderPoint<1500; renderPoint+=200){
            // 描画開始地点の更新
            this.terrainArray[index].onUpdateTerrainX(renderPoint);
            // 次の足場へ
            index++;
        }
    }

    gameOver(){
        for(var i = 0;i<this.player.length;i++){
            // 各プレイヤーの位置を更新
            this.player[i].gameOverCheck();
        }
    }

}

// if (typeof module !== 'undefined' && module.exports) {
    // Node.js環境（require使用時）
    module.exports = Game;
//   } else if (typeof window !== 'undefined') {
//     // ブラウザ環境（script tag使用時）
//     window.Player = Game;
//   }