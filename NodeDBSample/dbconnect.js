const express = require('express')
const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'kadaidb'
});


const app = express();
// 使うエンジン指定
app.set("view engine", "ejs");

// テンプレートエンジンをviewsフォルダーに指定
// ここがshowsになると、showsフォルダを見に行くようになる
app.set("views", "./views");

app.get('/', (req, res) => {
    // DB接続
    db.connect((err) => {
        if (err) {
            console.log(err);
            res.send('DB接続に失敗しました');
        }
    });

    // DBからデータを取得,挿入,削除,更新
    const selectsql = "SELECT * FROM foods";
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
            res.send('DB接続に失敗しました');
        }
        console.log("success");
        res.render('dbconnect', { items: result });
    });
});

app.listen(8000, () => console.log("run!!"));