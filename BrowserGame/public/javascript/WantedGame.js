class Game {
    constructor(room_id){
        this.room_id = room_id;
        this.player_limit = 4;
        this.minimum_players = 2;
        this.timelimit = 60;
        this.player_data = {};
        this.player_ids = [];
        this.access = "public";
        this.timer = 0;
    }
    setTimer(){
        this.timer = Date.now();
    }

    getTimerMilliseconds(){
        var elapsed = Date.now()-this.timer;
        return elapsed;
    }

    getTimerSeconds(){
        return parseInt(this.getTimerMilliseconds()/1000);
    }

    addPlayer(id,name){
        this.player_data[id] = {username: name};
        this.player_ids.push(id);
    }

    removePlayer(id){
        for(var i = 0;i < this.player_ids.length;i++){
            if(this.player_ids[i]==id){
                this.player_ids.splice(i,1);
            }
        }
    }

    isFull(){
        return this.player_ids.length>=this.player_limit;
    }

    getPlayerCount(){
        return this.player_ids.length;
    }

    getPlayerLimit(){
        return this.player_limit
    }
}

module.exports = Game;