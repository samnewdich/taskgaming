<?php
if($_SERVER["REQUEST_METHOD"] ==="POST"){
    include("Auth.php");
    $dataIn = json_decode(file_get_contents("php://input"), true);
    $email = trim($dataIn["email"]) ? trim($dataIn['email']) : '';
    $pwd = $dataIn['password'] ? $dataIn['password'] : '';
    $name = trim($dataIn["name"]) ? trim($dataIn["name"]) : '';
    $walletAddress = trim($dataIn["wallet_address"]) ? trim($dataIn["wallet_address"]) : '';
    $newReg = new Auth();
    echo $newReg->register($email, $name, $pwd, $walletAddress);
    exit;
}
else{
    return json_encode(array("status"=>"failed", "response"=>"only POST request is allowed"), true);
}
?>