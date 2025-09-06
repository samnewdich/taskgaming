<?php
if($_SERVER["REQUEST_METHOD"] ==="POST"){
    include("Auth.php");
    $dataIn = json_decode(file_get_contents("php://input"), true);
    $email = trim($dataIn["email"]) ? trim($dataIn['email']) : '';
    $pwd = $dataIn['password'] ? $dataIn['password'] : '';
    $newLogin = new Auth();
    echo $newLogin->login($email, $pwd);
    exit;
}
else{
    return json_encode(array("status"=>"failed", "response"=>"only POST request is allowed"), true);
}
?>