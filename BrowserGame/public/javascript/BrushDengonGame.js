class Game{ //ゲームクラス、部屋ごとにゲームオブジェクトを用意する
    constructor(room_id){
        this.room_id = room_id;
        this.player_limit = 4; //プレイヤー数制限
        this.time_limit = 60; //時間制限
        this.draw_start_time = 0;
        this.round = 0; //ラウンドカウンター
        this.rounds = 2; //ラウンド数
        this.hints = 2; //ヒント(文字の一つを表示する)
        this.words = [
            "シャワー",
            "きょうしつ",
            "せんせい",
            "だつぜい",
            "シャンプー",
            "マシュマロ",
            "バーベキュー",
            "マクドナルド",
            "パソコン",
            "えんぴつ",
            "スケートボード"
        ]; //お題
        this.player_ids = []; //プレイヤーid
        this.player_data = []; //プレイヤー情報、名前(name),スコア (score)
        this.access = "public"; //部屋アクセスタイプ　0(公開) 1(プライベート)
        this.state = "standby"; //部屋状態 //0待機中 , 1ラウンド中,
        this.turn = 0;

        this.paint_history = []; //ペインターが書いている途中でゲッサーが入室した場合ゲッサーにそれまでの絵のデータをおくる
    }

    setStartTime(){
        this.draw_start_time = Date.now();
    }

    getRemainingTime(){
        return this.time_limit-(Date.now()-this.draw_start_time)/1000;
    }

    isFull(){ //満室か
        return this.player_ids.length >= this.player_limit;
    }

    getPlayerCount(){ //プレイヤーカウント
        return this.player_ids.length;
    }

    addPlayer(player_id,player_obj){ //プレイヤー追加
        if(this.getPlayerIndexById(player_id)==-1){
            this.player_ids.push(player_id);
            this.player_data.push(player_obj);
        }
    }

    isDrawing(id){
        if(this.player_ids[this.turn]===id)return true;
        return false;
    }

    getDrawerId(){
        return this.player_ids[this.turn];
    }

    getPlayerIdByIndex(index){
        return this.player_ids[index];
    }

    getPlayerByIndex(index){
        return this.player_data[index];
    }

    getPlayerById(id){
        return this.player_data[this.getPlayerIndexById(id)];
    }

    getPlayerIndexById(player_id){
        for(var i = 0;i < this.player_ids.length;i++){
            if(this.player_ids[i]===player_id){
                return i;
            }
        }
        return -1;
    }

    getGameState(){
        return this.turn;
    }

    removePlayer(player_id){
        var index = this.getPlayerIndexById(player_id);
        if(index!=-1){
            this.player_ids.splice(index,1);
            this.player_data.splice(index,1);
        }
    }
}

module.exports = Game;