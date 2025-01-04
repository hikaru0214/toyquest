// このクラスはサーバー側でしか使わない（クライアントにはemitしない）
class GameRoom{
    constructor(){
        // Gameクラスのインスタンスを格納
        this.rooms = [];
    }

    // room配列にGameクラスのインスタンスを追加（地形とGameインスタンスは一つのルームで共有する）
    addGameRoom(Game, roomId){
        let instance = new Game(roomId);
        this.rooms.push(instance);
    }

    // 地形の設定
    setTerrain(TargetInstance, Terrain){
        // 地形の初期設定
        TargetInstance.initTerrain(Terrain);
    }

    getGameInstance(roomId){
        return this.rooms.find(room => room.roomID === roomId);
    }

    getGameInstanceIndex(roomId){
        return this.rooms.findIndex(room => room.roomID === roomId);
    }

    // 特定のroom配列の要素を削除
    removeGameRoom(roomId){
        this.rooms.splice(this.getGameInstanceIndex(roomId),1);
    }

}

module.exports = GameRoom;