// MySQLをインポート
const mysql = require('mysql');

// DB接続開始
const db = mysql.createConnection({
    host: 'gamedb.cxsa4yusutqg.ap-northeast-1.rds.amazonaws.com',
    user: 'root',
    password: 'myrdspassword',
    database: 'gamedatabase'
});

module.exports = db;