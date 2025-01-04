const db = require('../../server/dbSetting/dbConnect');

class dbService{
    static dbConnect(score){
        // DB接続
        db.connect();

        const insertsql = "INSERT INTO Score(game_id, user_id, registration_date, score)  VALUES (?,?,?,?)";
        const insertData = [2, 1, new Date(), score]; 

        db.query(insertsql, insertData, (err, result) => {
            if (err) {
                console.log(err);
            }
            console.log(result);
        });
    }
}

module.exports = dbService;