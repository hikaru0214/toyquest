const db = require('../server/dbSetting/dbConnect');
// DB接続
db.connect();

// DBからデータを取得,挿入,削除,更新
const selectsql = "SELECT * FROM User";
// const insertsql = "INSERT INTO foods (food_id, food_name, category) VALUES (null,?,?)";
// const deletesql = "DELETE FROM foods WHERE food_id = ?";
// const updatesql = "UPDATE foods SET food_name = ?, category = ? WHERE food_id = ?";

// プレイスホルダーはオブジェクトではなく配列に渡す
// 挿入、削除、更新用の配列
// const insertData = ["焼き鳥","和食"]; 
// const deleteNum = [10];
// const updateData = ["焼き鳥","和食", 9];

db.query(selectsql,/*insertData,*/ (err, result) => {
    if (err) {
        console.log(err);
        // res.send('DB接続に失敗しました');
    }
    console.log(result);
    // res.render('dbconnect', { items: result });
});