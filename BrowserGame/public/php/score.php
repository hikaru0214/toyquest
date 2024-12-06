
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ランキング</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            
            background-image: url(../img/rankingu.png); /* 背景に画像を指定 */
            background-size: cover;
            color: black;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }

        .container {
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
            background-color: rgba(255, 255, 255, 0.9);
            border-radius: 10px;
            padding: 150px;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
            color: black;
            

        }

        h1 {
            text-align: center;
            margin-bottom: 100px;
            
        }

        .back-button {
            position: absolute;
            top: 10px;
            left: 10px;
            color: rgb(232, 248, 4);
            text-decoration: none;
        }

        .tabs {
            display: flex;
            justify-content: space-around;
            margin-bottom: 30px;
            width: 100%;
        }

        .tabs button {
            background-color: #1192ee;
            color: white;
            border: 1px solid #ccc;
            padding: 10px 20px;
            cursor: pointer;
            flex-grow: 1;
            margin-right: 5px;
            margin-left: 10px;
            border-radius: 5px;
            width: 120%;
            margin: 0 auto;
        }

        .tabs button:last-child {
            margin-right: 0;
        }

        .tabs button:hover {
            background-color: #ddd;
        }

        .table-container {
            background-color: white;
            border: 1px solid #ccc;
            padding: 20px;
            border-radius: 5px;
            width: 95%;
            margin: 0 auto;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        table, th, td {
            border: 1px solid #ccc;
        }

        th, td {
            padding: 10px;
            text-align: center;
        }
        .selectbox-1 {
            position: relative;
        }

        .selectbox-1::before,
        .selectbox-1::after {
            position: absolute;
            content: '';
            pointer-events: none;
        }

        .selectbox-1::before {
            display: inline-block;
            right: 0;
            width: 2.8em;
            height: 2.8em;
            border-radius: 0 3px 3px 0;
            background-color: #1192ee;
        }

        .selectbox-1::after {
            position: absolute;
            top: 50%;
            right: 1.4em;
            transform: translate(50%, -50%) rotate(45deg);
            width: 6px;
            height: 6px;
            border-bottom: 3px solid #fff;
            border-right: 3px solid #fff;
        }

        .selectbox-1 select {
            appearance: none;
            min-width: 230px;
            height: 2.8em;
            padding: .4em 3.6em .4em .8em;
            border: none;
            border-radius: 3px;
            background-color: #efebeb;
            color: #333;
            font-size: 1em;
            cursor: pointer;
        }

        .selectbox-1 select:focus {
            outline: 2px solid #1192ee;
        }
        .error-message {
            color: red;
            font-size: 16px;
            font-weight: bold;
            margin: 20px 0;
        }
    </style>
</head>
<body>

    <a href="top.php" class="back-button">戻る</a>

    <div class="container">
        <h1>ランキング</h1>
        <form method="POST" action="">
            <div class="tabs">
                <label class="selectbox-1">
                    <select name="rankingu" onchange="this.form.submit()">
                        <option <?= $selectedGame === '総合スコア' ? 'selected' : '' ?>>総合スコア</option>
                        <option <?= $selectedGame === 'Burush Dengon' ? 'selected' : '' ?>>Burush Dengon</option>
                        <option <?= $selectedGame === 'チャリ走' ? 'selected' : '' ?>>チャリ走</option>
                        <option <?= $selectedGame === 'WANTED' ? 'selected' : '' ?>>WANTED</option>
                    </select>
                </label>
                <button type="submit" name="show_my_score">マイスコア</button>
                <button type="submit" name="show_friend_score">フレンドスコア</button>
            </div>
        </form>

        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>順位</th>
                        <th>ユーザー名</th>
                        <th>スコア</th>
                        <th>日付</th>
                    </tr>
                </thead>
                <tbody>
                    
                </tbody>
            </table>
        </div>
    </div>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</body>
</html>
<script>
$(document).ready(function () {
    function fetchScores(action) {
        const rankingu = $('select[name="rankingu"]').val();

        $.ajax({
            url: 'fetch_scores.php',  // PHPファイルのURLを指定
            type: 'POST',
            data: { action: action, rankingu: rankingu },
            dataType: 'json',
            success: function (response) {
                const tableBody = $('table tbody');
                tableBody.empty();

                if (response.error) {
                    tableBody.append('<tr><td colspan="4">' + response.error + '</td></tr>');
                    return;
                }

                if (response.length > 0) {
                    let rank = 1;
                    response.forEach(score => {
                        const date = score.registration_date || '-';
                        const scoreValue = score.total_score || score.score || '-';
                        tableBody.append(`
                            <tr>
                                <td>${rank++}</td>
                                <td>${score.user_name}</td>
                                <td>${scoreValue}</td>
                                <td>${date}</td>
                            </tr>
                        `);
                    });
                } else {
                    tableBody.append('<tr><td colspan="4">データがありません</td></tr>');
                }
            },
            error: function () {
                alert('データの取得に失敗しました。');
            }
        });
    }

    $('button[name="show_my_score"]').on('click', function (e) {
        e.preventDefault();
        fetchScores('myScore');
    });

    $('button[name="show_friend_score"]').on('click', function (e) {
        e.preventDefault();
        fetchScores('friendScore');
    });

    $('select[name="rankingu"]').on('change', function () {
        fetchScores('default');
    });
});
</script>