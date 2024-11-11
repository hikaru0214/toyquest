class Game {
    constructor(room){
        this.room_id = room;
        this.player_ids = [];
        this.players = [];
        this.state = "game";
        this.player_limit = 4;
    }

    getPlayerLimit(){return this.player_limit;}
    getPlayerCount(){return this.players.length;}
    isFull(){return this.players.length >= this.player_limit;}
}
module.exports = Game;