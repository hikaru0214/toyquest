class Game{
    constructor(roomId){
        // ゲームルームのID
        this.roomID = roomId;
        // プレイヤークラスを配列に格納
        this.player = [];
        // 足場クラスを配列に格納
        this.terrainArray = [];
        // ゲームの重力
        this.gravity = 0.8;
        // ゲーム開始フラグ
        this.isStartFlg = false;
        // ゲームスコア
        this.score = 0;
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

    // 1フレームごとに行う処理
    startInterval(Terrain, io){
        setInterval(() => this.onUpdateFrame(Terrain, io), 1000 / 60);
    }

    // 1フレームごとに行うゲーム処理
    // サーバー側で変更を行い、クライアントに返す
    onUpdateFrame(Terrain, io){
        // プレイヤーの移動
        this.proceedProcess();
        // 毎フレームスクロールごとの足場情報の更新
        this.scrollProcess(Terrain);
        // 自由落下判定
        this.fallProcess();
        // ゲームオーバー判定
        this.gameOverProcess();
        // スコアの更新
        this.scoreProcess();
        // 更新したGameインスタンスをクライアント側に送信
        io.to(this.roomID).emit("Update-Entity", this);
    }

    // プレイヤーの移動
    proceedProcess(){
        for(var i = 0;i<this.player.length;i++){
            // 各プレイヤーの位置を更新
            this.player[i].update();
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

    // 自由落下の処理
    fallProcess(){
        // 各プレイヤーのY座標を更新
        for(var i = 0; i<this.player.length;i++){
            // 自由落下させるかを判定
            this.player[i].fallPlayer(this.terrainArray, this.gravity);
        }
    }

    gameOverProcess(){
        for(var i = 0;i<this.player.length;i++){
            // 各プレイヤーの位置を更新
            this.player[i].gameOverCheck();
        }
    }

    scoreProcess(){
        this.score += 1;
    }

    // ジャンプ処理
    jumpProcess(operate_PlayerID, keyState){
        // ジャンプしたプレイヤーを探す
        const playerIndex = this.player.findIndex(player => player.socketID == operate_PlayerID);
        // 見つけた要素番号でジャンプ処理
        this.player[playerIndex].jump(keyState)
    }

    // 移動量から足場の描画開始地点を算出
    getInitRectPoint(){
        return ((this.player[0].x-40) % 200)*(-1);
    }

    // 足場の表示・非表示を管理
    terrainManage(Terrain,startX){
        // 画面左にフェードアウトするタイミング
        // 足場の描画地点が-200以下になる＆移動量が200以上の場合
        if(startX === 0 && (this.player[0].x-40) >= 200){
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

}

// if (typeof module !== 'undefined' && module.exports) {
    // Node.js環境（require使用時）
    module.exports = Game;
//   } else if (typeof window !== 'undefined') {
//     // ブラウザ環境（script tag使用時）
//     window.Player = Game;
//   }