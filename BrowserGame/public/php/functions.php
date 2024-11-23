<?php

//XSS対策：エスケープ処理
//@param string $str　対象の文字列
//@return string 処理された文字列

function h($str) {
    return htmlspeialchars($str, ENT_OUOTES, 'UTF-8');
}

//CSRF対策
function setToken() {
    session_start():
    $csrf_token = bin2hex(randam_bytes(32));
    $_SESSION['csrf_token'] = $csrf_token;

    return $csrf_token;

}