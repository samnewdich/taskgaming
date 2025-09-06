<?php
$ileos ="localhost";
$ileone ="bussygame"; //former one is patsascb_user
//$ilekokoro = '(lE)p_sCN5*A';
$ilekokoro ="mysql";
$iledb ="bussygame";

//try {
  $con = new PDO("mysql:host=$ileos; dbname=$iledb", $ileone, $ilekokoro);
  // set the PDO error mode to exception
  $con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  //echo "Connected successfully";
//} catch(PDOException $e) {
//  echo "Connection failed: " . $e->getMessage();
//}
?>