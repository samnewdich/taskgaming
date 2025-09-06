<?php
if($_SERVER["REQUEST_METHOD"] ==="POST"){
    include("Auth.php");
    $dataIn = json_decode(file_get_contents("php://input"), true);
    $email = trim($dataIn["email"]) ? trim($dataIn['email']) : '';
    $balance = trim($dataIn["balance"]) ? trim($dataIn['balance']) : '';
    $newLogin = new Auth();
    echo $newLogin->updateBalance($email, $balance);
    exit;
}
else{
    return json_encode(array("status"=>"failed", "response"=>"only POST request is allowed"), true);
}
?>