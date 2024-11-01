class Game{ //ゲームクラス、部屋ごとにゲームオブジェクトを用意する
    constructor(room_id){
        this.room_id = room_id;
        this.player_limit = 4; //プレイヤー数制限
        this.time_limit = 60; //時間制限
        this.round = 0; //ラウンドカウンター
        this.rounds = 0; //ラウンド数
        this.hints = 2; //ヒント(文字の一つを表示する)
        this.words = []; //お題
        this.player_ids = []; //プレイヤーid
        this.player_data = []; //プレイヤー情報、名前(name),スコア (score)
        this.access = 0; //部屋アクセスタイプ　0(公開) 1(プライベート)
        this.state = 0; //部屋状態

        this.paint_history = []; //ペインターが書いている途中でゲッサーが入室した場合ゲッサーにそれまでの絵のデータをおくる
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

    getPlayerIndexById(player_id){
        for(var i = 0;i < this.player_ids.length;i++){
            if(this.player_ids[i]===player_id){
                return i;
            }
        }
        return -1;
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