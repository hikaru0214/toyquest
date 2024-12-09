function delproperties(obj){
    for(var key in obj){
        if(obj.hasOwnProperty(key)){
            delete obj[key];
        }
    }
}

function getObjSize(obj){
    var size = 0;
    for(var i in obj){
        size++;
    }
    return size;
}

class Game{ //ゲームクラス、部屋ごとにゲームオブジェクトを用意する
    constructor(room_id){
        this.room_id = room_id;
        this.player_limit = 4; //プレイヤー数制限
        this.minimum_players = 2; //最小プレイヤー数
        this.time_limit = 60; //時間制限
        this.draw_start_time = 0;
        this.round = -1; //ラウンドカウンター
        this.rounds = 3; //ラウンド数
        this.hints = 2; //ヒント(文字の一つを表示する)
        this.drawer_queue = {}; //描き手キュー,IDを保存,(ラウンド開始時に居たプレイヤーのみ)
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
        this.players = {};
        this.access = "public"; //部屋アクセスタイプ　0(公開) 1(プライベート)
        this.state = "standby"; //部屋状態 //standby待機中 , roundstart,ラウンド中,
        this.timer = 0;

        this.paint_history = []; //ペインターが書いている途中でゲッサーが入室した場合ゲッサーにそれまでの絵のデータをおくる

        this.scores_at_start = {};
        this.score_on_guess = 400;
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
            this.setDrawerQueue();
            io.to(room_name).emit("show_client_overlay_timed",{id:"round",time:3,roundcount:this.round,totalrounds:this.rounds});
            this.setTimer();
            this.state="round";
        }

        if(this.state=="round"&&this.getTimer(3)<=0){
            io.to(room_name).emit("clear canvas");
            var painterName = this.getPlayerById(this.getDrawerId()).name;
            console.log("next painter is : "+painterName);
            io.to(room_name).emit("show_client_overlay_timed",{id:"painternotice",time:3,painterName:painterName})
            this.setTimer();
            this.state = "painternotice";
        }

        if(this.state=="painternotice"&&this.getTimer(3)<=0){
            io.to(room_name).emit("clear canvas");
            this.state = "drawing";
            var word = this.nextTurn(io);
            return {instruction:"setword",word:word};
        }

        if(this.state=="drawing"&&this.getRemainingTime()<=0){

            this.markDrewInQueue(this.getDrawerId());
            console.log(this.drawer_queue);

            this.state = "drawend";

        }

        if(this.state=="drawend"){
            this.state = "word reveal and result"
            this.setTimer();

            var results = {};
            for(var id in this.players){
                var p = this.players[id];
                var earned_score = p.score;
                if(this.scores_at_start.hasOwnProperty(id)){
                    earned_score-=this.scores_at_start[id].score;
                }
                results[id] = {name:p.name,score:earned_score};
            }

            return {instruction:"reveal_and_result",data:results};
        }

        if(this.state == "word reveal and result"&&this.getTimer(5)<=0){
            if(this.getDrawerId()=="drawer queue completed"){
                //ラウンド終了処理
                this.state="roundend";
            }else{ //次のターン
                var painterName = this.getPlayerById(this.getDrawerId()).name;
                console.log("next painter is : "+painterName);
                io.to(room_name).emit("show_client_overlay_timed",{id:"painternotice",time:3,painterName:painterName})
                this.setTimer();
                this.state = "painternotice";
            }
        }

        if(this.state=="roundend"){
            if(this.round+1 >= this.rounds){
                this.state = "game end notice";
                io.to(room_name).emit("show_client_overlay_timed",{id:"end_notice",time:3});
                this.setTimer();
            }else{
            this.state="roundstart";
            }
        }

        if(this.state=="game end notice"&&this.getTimer(3)<=0){
            this.state = "game result";
            var results = [];
            for(var id in this.players){
                var p = this.players[id];
                var name = p.name;
                var score = p.score;
                results.push({name:name,score:score});
            }
            io.to(room_name).emit("show_client_overlay_timed",{id:"finalscore",time:5,result:results});
            this.setTimer();
        }

        if(this.state=="game result"&&this.getTimer(5)<=0){
            this.resetGame(io);
        }

        return "nil";
    }

    resetGame(socket){
        this.state = "standby";
        this.draw_start_time = 0;
        this.round=-1;
        delproperties(this.drawer_queue);
        this.timer = 0;
    }

    nextTurn(io){
        this.score_on_guess = 400;
        delproperties(this.scores_at_start);
        for(var id in this.players){
            this.players[id].guessed = false;
            var current_score = this.players[id].score;
            this.scores_at_start[id] = {id:id,score:current_score};
        }

        var room_name = "room_"+this.room_id;
        var secretword = "";
        secretword = this.words[parseInt((Math.random()*this.words.length),10)];
        console.log("next word for room "+this.room_id+" is : "+secretword);
        var painter = this.getPlayerById(this.getDrawerId());
        
        painter.guessed = true;

        io.to(room_name).emit("notify in chat",{message:painter.name+"が筆を手にした！",color:"#00FF00"});
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
        if(this.draw_start_time==0)return -1;
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
        return this.getPlayerCount() >= this.player_limit;
    }

    isDrawing(id){
        return this.getDrawerId()==id;
    }

    setDrawerQueue(){
        delproperties(this.drawer_queue);
        for(var pkey in this.players){
            this.drawer_queue[pkey] = {id:pkey,drew:false};
        }
    }

    getDrawerId(){
        var drawer = "";
        for(var id in this.drawer_queue){
            if(this.drawer_queue[id].drew==false){
                drawer = this.drawer_queue[id].id;
                return drawer;
            }
        }
        return "drawer queue completed";
    }

    deleteFromDrawQueue(id){
        if(Object.hasOwn(this.drawer_queue,id)){
        delproperties(this.drawer_queue[id]);
        delete this.drawer_queue[id];
        }
    }

    markDrewInQueue(id){
        this.drawer_queue[id].drew = true;
    }

    getPlayerById(id){
        return this.players[id];
    }

    addScore(id){
        if(this.players[id].guessed)return;
        this.players[id].score+=this.score_on_guess;
        this.players[id].guessed=true;
        if(this.score_on_guess>=100)this.score_on_guess-=75;
    }
    
    Guessed(id){
        return this.players[id].guessed;
    }

    AllIdOfGuessed(){
        var ids = [];
        for(var id in this.players){
            var p = this.players[id];
            if(p.guessed)ids.push(id);
        }
        return ids;
    }

    getPlayerCount(){ //プレイヤーカウント
        return getObjSize(this.players);
    }

    addPlayer(player_id,player_obj){ //プレイヤー追加
        if(Object.hasOwn(this.players,player_id))return false;
        this.players[player_id] = {id:player_id,name:player_obj.name,score:0,guessed:false};
        return true;
    }

    get getPlayers(){
        return this.players;
    }

    removePlayer(player_id){
        if(Object.hasOwn(this.players,player_id)){
            delproperties(this.players[player_id]);
            delete this.players[player_id];
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