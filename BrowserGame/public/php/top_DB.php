<?php require 'dbconnect.php';?>
<?php
$sql=$pdo->prepare('SELECT user_id,SUM(score) AS total_score FROM Score GROUP BY user_id ORDER BY total_score ASC');
$sql->execute();
foreach($sql as $row) {
        echo "</td><td>"+$row['user_name'];
        echo "</td><td>"+$row['total_score'];
        echo "</td></tr>";
}
echo "<tr><td>終了<td></tr>";
?>
