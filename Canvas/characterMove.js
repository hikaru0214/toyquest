const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// X座標固定地点
let xOffset = 0;
// 重力の加速度
const gravity = 0.8;
// 足場の高さ
const ground = 350;
// 足場のブロックの幅
const groundBlockWidth = 200;
// 足場の情報を格納するオブジェクト配列
let terrainObjects = [];
// プレイヤー移動速度
let scrollWeight = 4;
// ゲーム終了のフラグ
let gameOverFlg = true;
// アニメーションの判別ID
let animationId = null;
// const terrainData = [];
// プレイヤーの情報
const player = {
    x: 0,
    y: 325,
    width: 15,
    height: 15,
    // 加速度の状態
    velocityY: 0,
    // ジャンプの高さ
    jumpStrength: -15,
    isJumping: false
};
    
    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // プレイヤーを動かす
        movePlayer();
        // 固定位置からの差分取得
        rect();
        // 足場の描画
        drawGround();
        // ジャンプの処理・判定
        update();
        // プレイヤーの描画
        drawPlayer(player.x, player.y);
        if(gameOverFlg){
            // ディスプレイのリフレッシュレイトに合わせて
            animationId = requestAnimationFrame(gameLoop);
        }else if(!gameOverFlg){
            // アニメーションの停止
            cancelAnimationFrame(animationId);
        }
    }

    function movePlayer(){
        player.x += scrollWeight;
    }
    
    // 基準点からの差分を計算
    function rect(){   
        // 毎回の描画する時にキャラクター以外のオブジェクトをその差分分動かす
        // 結果、キャラクター以外（背景）動き、キャラクターが動いて見える
        xOffset = player.x -50;
    }

    // ジャンプした時の処理
    function update() {
        // 重力の適用
        // ジャンプした時の位置からgravityによって0.8ずつ下がる
        // フレームごとに落ちる速度が0.8ずつ増える（0.8,1.6,2.4,3.2）
        // どんどん落下速度が速くなっていく
        player.velocityY += gravity;
        // 落下速度に基づいてプレイヤーの位置を1フレームごとに下げる
        player.y += player.velocityY;
        
        let onGround = false;

        // 足場の判定を足場一つごとに行う
        // for(let terrainObject of terrainObjects){
        // 全ての足場を判定する必要性は？
        // キャラクターは50から動かない
        // そのため判定を行うのはその周辺に位置する足場だけでいいのでは？
        // キャラクターの位置から足場2つ分の判定だけを行う
        for(var i = 0;i<2;i++){
            // 足場との衝突判定
            // console.log(terrainObjects[i])
            // console.log(checkCollision(player, terrainObjects[i]))
            if (checkCollision(player, terrainObjects[i])) {
                if(player.velocityY > 0){
                    // プレイヤーを足場に(ここに問題があり)
                    player.y = ground - player.height;
                    // 落下速度を0に
                    player.velocityY = 0;
                    // 着地状態に変更
                    player.isJumping = false;
                    onGround = true;
                }
                break;
            }else {
                // ゲームオーバー判定(プレイヤーのY座標がcanvasの縦幅を超えたら)
                // もしかしたら、canvasの縦幅を超えるステージ構造にする可能性があるため残しておく
                if(/*player.x - xOffset < terrainObjects[i].x && player.y > terrainObjects[i].y && */player.y > canvas.height){
                    // ゲーム終了フラグ
                    gameOverFlg = false;
                }
            }
            // console.log(terrainObjects[i]);

        }
        // 落下判定
        if (!onGround) {
            player.isJumping = true;
        }
    }

    // プレイヤーの描画
    function drawPlayer(x,y) {
        ctx.fillStyle = 'blue';
        ctx.fillRect(x-xOffset, y, player.width, player.height);
    }

    // 足場の描画
    function drawGround(){
        // startXはなぜ膨らむのか？
        // Q.画面左にフェードアウトしていった足場の枚数を数えているため
        // ただそのあと足場描画でxOffsetで相殺して0にする
        // ではstartX生成時にxOffsetで相殺すれば、endXが膨れずに済むのでは？
        // 結果、行けた
        // xOffset(移動量)が足場一枚分(200)かどうか割ることで検証
        // 200分の移動があった場合
        // xOffsetも同じく200なため相殺してstartXが0になる
        // 300分の移動があった場合
        // xOffsetは300でstartXは-100になる
        // 足場の幅(200)を定数として移動量がどの程度かを計る
        // 足場区間（200）何個分進んだか確認
        const moveTerrainNum = Math.trunc(Math.abs(xOffset / groundBlockWidth));
        console.log("moveTerrainNum: " + moveTerrainNum);
        // 進んだ足場の幅分を算出、足場のスタート位置は0から
        const proceedNum = moveTerrainNum * groundBlockWidth;
        // そこから実際に進んだ分を引き、差分から足場区間のどの位置にいるのかを割り出す
        // 問題点：xOffsetがマイナスになった時にstartXがマイナスに
        // startXは足場の描画地点を表す
        const startX = proceedNum - xOffset;
        console.log("xOffset: " + xOffset);
        console.log(Math.trunc(Math.abs(xOffset / groundBlockWidth)));
        // 足場が左にフェードアウトするタイミング
        if((xOffset-2)%(groundBlockWidth)===0){
            // Xは毎フレームごとに変わるため足場フェードアウトするタイミングでは入れない
            // widthは足場が右から出てきたタイミングで決まるためこのタイミングで値を入れる
            terrainObjects.splice(0,1);
            terrainObjects.push({x: 1500, y: ground/*+getRandomBlockHeight()*/, width: getRandomBlockWidth(), height: canvas.height});
            console.log("throw");
            // terrainData.push(getRandomBlockWidth());            
        }
        // 本来、足場描画地点のx座標と足場の幅に差があった時に穴ができる
        // 例えば、描画地点0(40ずつ増加)、幅20だと
        // 地点0から幅20の足場を生成し、その後地点40に新たに足場を生成する
        // この時足場1と足場2の間には幅20の穴ができる
        // 描画地点(200ずつ増加)は足場の幅(200)で描画地点と幅が同じなため、
        // 結果、足場が幅一杯に敷き詰められた状態に
        for (let x = startX; x < canvas.width; x += groundBlockWidth) {
            // それぞれの足場情報を保存しているterrainObjectの配列番号
            let index = Math.floor((x)/groundBlockWidth)+1;
            // 検証用
            // 1つ目の足場の位置を確認
            if (index === 0) {
                ctx.fillStyle = "red";
                console.log(terrainObjects[index]);
                // console.log("playerMove:"+(xOffset))
                // console.log("terrainX:"+x)
                // console.log("terrainX+width:"+(x+terrainObjects[index].width))
            }else {
                ctx.fillStyle = 'black';
            }
            console.log("x:"+x+" index:"+index);
            // terrainObjectの一つオブジェクト(足場)ごとのプロパティを足場一つずつに適応していく
            // xだけはプレイヤーの移動量でひたすら変化し続けるのでstartXのものを使う
            ctx.fillRect(x, terrainObjects[index].y, terrainObjects[index].width, terrainObjects[index].height);
            // xはここで入れる以外思いつかない...
            terrainObjects[index].x = x;
        }
        
    }
    // 足場の幅をランダムな幅にする
    function getRandomBlockWidth(){
        // Math.random() * ( 最大値 - 最小値 ) + 最小値;
        return Math.floor(Math.random() * ( 150 - 50 ) + 50);

    }
    // 足場の幅をランダムな幅にする
    function getRandomBlockHeight(){
        // Math.random() * ( 最大値 - 最小値 ) + 最小値;
        return Math.floor(Math.random() * ( 50 - 10 ) + 10);
    }

    function checkCollision(player, ground) {
        // console.log("playerX:"+(player.x - xOffset)+" playerY:"+player.y+" playerwidth:"+player.width);
        // console.log("groundX:"+ground.x+" groundY:"+ground.y+" groundwidth:"+ground.width);
        // プレイヤーと足場の位置が重なっている場合、trueを返す
        return player.x - xOffset < ground.x + ground.width &&
               player.x - xOffset + player.width > ground.x &&
               player.y < ground.y &&
               player.y + player.height > ground.y;
    }

    // ジャンプ機能
    document.addEventListener('keydown', function(event) {
        // Spaceが押された＆プレイヤーが着地状態
        if (event.code === 'Space' && !player.isJumping) {
            // ジャンプした時のY座標が-15になる
            player.velocityY = player.jumpStrength;
            // ジャンプ状態へ変更
            player.isJumping = true;
        }
    });

    // 足場初期設定
    function createTerrainData(){
        for(var i = 0;i<9;i++){
            // 足場の情報を設定する
            terrainObjects[i] = {x: (i*200)+50, y: ground/*+getRandomBlockHeight()*/, width: getRandomBlockWidth(), height: canvas.height};
        }
    }

createTerrainData();
animationId = requestAnimationFrame(gameLoop);