<?php
if($_SERVER["REQUEST_METHOD"] ==="POST"){
    include("Auth.php");
    $newLogin = new Auth();
    echo $newLogin->questionaire();
    exit;
}
else{
    return json_encode(array("status"=>"failed", "response"=>"only POST request is allowed"), true);
}
?>