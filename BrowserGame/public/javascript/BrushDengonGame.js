class Game{ //ゲームクラス、部屋ごとにゲームオブジェクトを用意する
    constructor(room_id){
        this.room_id = room_id;
        this.player_limit = 4; //プレイヤー数制限
        this.minimum_players = 2; //最小プレイヤー数
        this.time_limit = 20; //時間制限
        this.draw_start_time = 0;
        this.round = -1; //ラウンドカウンター
        this.rounds = 3; //ラウンド数
        this.hints = 2; //ヒント(文字の一つを表示する)
        this.drawer_queue = []; //描き手キュー,IDを保存,(ラウンド開始時に居たプレイヤーのみ)
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
        this.state = "standby"; //部屋状態 //standby待機中 , roundstart,ラウンド中,
        this.turn = 0;
        this.timer = 0;

        this.paint_history = []; //ペインターが書いている途中でゲッサーが入室した場合ゲッサーにそれまでの絵のデータをおくる
    }

    gameupdate(io){ //ゲームループ
        const room_name = "room_"+this.room_id;
        if(this.state=="standby"){
            if(this.getPlayerCount()>=this.minimum_players){
                this.state = "roundstart";
            }
        }

        if(this.state=="roundstart"){ //最初のラウンドと続くラウンドをスタートする
            this.round++;
            //描き手キュー
            this.drawer_queue = [];
            for(var i = 0;i < this.player_ids.length;i++){
                this.drawer_queue.push({id:this.player_ids[i],drew:false});
            }
            io.to(room_name).emit("show_client_overlay_timed",{id:"round",time:3});
            this.setTimer();
            this.state="round";
        }

        if(this.state=="round"&&this.getTimer(3)<=0){
            io.to(room_name).emit("clear canvas");
            io.to(room_name).emit("show_client_overlay_timed",{id:"painternotice",time:3})
            this.setTimer();
            this.state = "painternotice";
        }

        if(this.state=="painternotice"&&this.getTimer(3)<=0){
            io.to(room_name).emit("clear canvas");
            this.state = "drawing";
            var word = this.nextTurn(io);
            return word;
        }

        if(this.state=="drawing"&&this.getRemainingTime()<=0){

            this.markDrewInQueue(this.getDrawerId());
            console.log(this.drawer_queue);

            if(this.getDrawerId()=="drawer queue completed"){
                //ラウンド終了処理
                this.state="roundend";
                io.to(room_name).emit("show_client_overlay_timed",{id:"roundcore",time:6});
                this.setTimer();
            }else{ //次のターン
                io.to(room_name).emit("show_client_overlay_timed",{id:"painternotice",time:3})
                this.setTimer();
                this.state = "painternotice";
            }
        }

        if(this.state=="roundend"&&this.getTimer(6)<=0){
            this.state="roundstart"
        }

        /*

        if(this.state=="roundstart"&&this.getTimer(3)<=0){
            this.state = "drawing";
            var firstword = this.startRound(io);
            return {instruction:"setword",word:firstword};
        }

        if(this.state=="drawing"&&this.getRemainingTime()<=0){ //タイマーが0になったら
                this.markDrewInQueue(this.getDrawerId());
                console.log(this.drawer_queue);
                if(this.getDrawerId()=="drawer queue completed"){
                    //TODO ラウンド終了処理
                    this.state = "roundend";
                    io.to(room_name).emit("show_client_overlay_timed",{id:"gamescore",time:5});
                    this.setTimer();
                }else{
                    this.state="nextturn";
                    io.to(room_name).emit("show_client_overlay_timed",{id:"painternotice",time:3});
                    this.setTimer();
                }
        }

        if(this.state=="nextturn"&&this.getTimer(3)<=0){
            this.state="drawing"
            var nextword = this.nextTurn(io);
            io.to(room_name).emit("clear canvas");
            return {instruction:"setword",word:nextword};
        }

        if(this.state=="roundend"&&this.getTimer(6)<=0){
            this.state="roundstart"
            var nextround_first_word = this.startRound(io);
            return {instruction:"setword",word:nextround_first_word};
        }
            */

        return "nil";
    }

    startRound(io){
        var secretword = "";
        //ラウンドスタート
            this.round++;
            //描き手キュー
            this.drawer_queue = [];
            for(var i = 0;i < this.player_ids.length;i++){
                this.drawer_queue.push({id:this.player_ids[i],drew:false});
            }
            secretword = this.nextTurn(io);
        return secretword;
    }

    nextTurn(io){
        var room_name = "room_"+this.room_id;
        var secretword = "";
        secretword = this.words[parseInt((Math.random()*this.words.length),10)];
        console.log("next word for room "+this.room_id+" is : "+secretword);
        var painter = this.getPlayerById(this.getDrawerId());

        io.to(room_name).emit("message to everyone in room",painter.name+"が筆を手にした！");
        io.to(room_name).emit("get word",this.hiddenWord(secretword));
        io.to(this.getDrawerId()).emit("get word",secretword);
        this.setStartTime();
        io.to(room_name).emit("game update",JSON.stringify(this));
        return secretword;
    }

    setStartTime(){
        this.draw_start_time = Date.now();
    }

    getRemainingTime(){
        if(this.draw_start_time==0)return 1;
        return this.time_limit-(Date.now()-this.draw_start_time)/1000;
    }

    setTimer(){
        this.timer = Date.now();
    }

    getTimer(time){
        return time-(Date.now()-this.timer)/1000;
    }

    getTimerElapsed(){
        return (Date.now()-this.timer)/1000;
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
        return this.getDrawerId()==id;
    }

    getDrawerId(){
        var drawer = "";
        for(var i = 0;i < this.drawer_queue.length;i++){
            if(this.drawer_queue[i].drew==false){
                drawer = this.drawer_queue[i].id;
                return drawer;
            }
        }
        return "drawer queue completed";
    }

    deleteFromDrawQueue(id){
        for(var i = 0;i < this.drawer_queue.length;i++){
            if(this.drawer_queue[i].id==id){
                this.drawer_queue.splice(i,1);
                break;
            }
        }
    }

    markDrewInQueue(id){
        for(var i = 0;i < this.drawer_queue.length;i++){
            if(this.drawer_queue[i].id==id){
                this.drawer_queue[i].drew = true;
                break;
            }
        }
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

    addScore(id,score){
        var index = this.getPlayerIndexById(id);
        this.player_data[index].score+=score;
    }

    getGameState(){
        return this.turn;
    }

    removePlayer(player_id){
        var index = this.getPlayerIndexById(player_id);
        if(index!=-1){
            this.player_ids.splice(index,1);
            this.player_data.splice(index,1);
            this.deleteFromDrawQueue(player_id);
        }
    }

    hiddenWord(str){
        var x = "";
        var arr = Array.from(str);
        for(var i = 0;i < str.length;i++){
            x+=(arr[i]!=" ")?"_":" ";
        }
        return x;
    }

    revealAndMergeLetter(origin,hinted){
        var index = parseInt(Math.random()*origin.length);
        var x = 0;
        var org_arr = Array.from(origin);
        var hnt_arr = Array.from(hinted);
        for(var i = 0;i < origin.length;i++){
            x+=((i!=index)?hnt_arr[i]:org_arr[index]);
        }
        return x;
    }
}

module.exports = Game;