// このクラスはサーバー側でしか使わない（クライアントにはemitしない）
class GameRoom{
    constructor(){
        // Gameクラスのインスタンスを格納
        this.rooms = [];
    }

    // room配列にGameクラスのインスタンスを追加
    addGameRoom(Game, roomId){
        this.rooms.push(new Game(roomId));
    }

    updateGameRoom(Game){
        
    }

    // 特定のroom配列の要素を削除
    removeGameRoom(){

    }

}

module.exports = GameRoom;