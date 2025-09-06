<?php
include("server.php");

class Auth{
    public function login($email, $password){
        global $con;
        if($email !='' && $password !=''){
            $pwd = md5($password);
            $q = $con->prepare("SELECT * FROM user WHERE email=:em AND pwd=:pwd");
            $q->bindParam(':em', $email, PDO::PARAM_STR);
            $q->bindParam(':pwd', $pwd, PDO::PARAM_STR);
            $q->execute();
            if($q->rowCount() > 0){
                $rq = $q->fetch(PDO::FETCH_ASSOC);
                $retdata = array(
                    "user_id"=>trim($rq["user_id"]),
                    "email"=>trim($rq["email"]),
                    "name"=>trim($rq["name"]),
                    "walletAddress"=>trim($rq["wallet_address"]),
                    "balance"=>trim($rq["balance"])
                );
                return json_encode(array("status"=>"success", "response"=>$retdata), true);
            }
            else{
                return json_encode(array("status"=>"failed", "response"=>"login failed"), true);
            }
        }
        else{
            return json_encode(array("status"=>"failed", "response"=>"required data missing"), true);
        }
    }



    public function register($email, $name, $password, $walletAddr){
        if($email !='' && $name !='' && $password !='' && $walletAddr !=''){
            global $con;
            $pwd = md5($password);
            $q = $con->prepare("SELECT email FROM user WHERE email=:em");
            $q->bindParam(':em', $email, PDO::PARAM_STR);
            $q->execute();
            if($q->rowCount() < 1){
                $qq = $con->prepare("INSERT INTO user(email, name, pwd, wallet_address) VALUES(:em, :nam, :pwd, :wad)");
                $qq->bindParam(':em', $email, PDO::PARAM_STR);
                $qq->bindParam(':nam', $name, PDO::PARAM_STR);
                $qq->bindParam(':pwd', $pwd, PDO::PARAM_STR);
                $qq->bindParam(':wad', $walletAddr, PDO::PARAM_STR);
                $qq->execute();
                if($qq){
                    $retdat = array(
                        "email"=>$email,
                        "name"=>$name,
                        "walletAddress"=>$walletAddr,
                        "balance"=>'0'
                    );
                    return json_encode(array("status"=>"success", "response"=>$retdat), true);
                }
                else{
                    return json_encode(array("status"=>"failed", "response"=>"registration failed"), true);
                }
            }
            else{
                return json_encode(array("status"=>"failed", "response"=>"email already registered"), true);
            }
        }
        else{
            return json_encode(array("status"=>"failed", "response"=>"required data not provided"), true);
        }
    }



    public function questionaire(){
        global $con;
        $q = $con->prepare("SELECT * FROM questionaire");
        $q->execute();
        if($q->rowCount() > 0){
            $allQuest = [];
            while($rq = $q->fetch(PDO::FETCH_ASSOC)){
                $eacharr = array(
                    "question"=>$rq["question"],
                    "optiona"=>$rq["optiona"],
                    "optionb"=>$rq["optionb"],
                    "answer"=>$rq["answer"]
                );
                $allQuest[] = $eacharr;
            }
            return json_encode(array("status"=>"success", "response"=>$allQuest), true);
        }
        else{
            return json_encode(array("status"=>"failed", "response"=>"no questionaire found"), true);
        }
    }



    public function updateBalance($email, $balance){
        global $con;
        $q = $con->prepare("SELECT * FROM user WHERE email=:em");
        $q->bindParam(':em', $email, PDO::PARAM_STR);
        $q->execute();
        if($q->rowCount() > 0){
            $rq = $q->fetch(PDO::FETCH_ASSOC);
            $bal = (float) trim($rq["balance"]);
            $balance = (float) $balance;
            if($bal != $balance){
                $qq = $con->prepare("UPDATE user SET balance=:bal WHERE email=:em");
                $qq->bindParam(':bal', $balance, PDO::PARAM_STR);
                $qq->bindParam(':em', $email, PDO::PARAM_STR);
                $qq->execute();
            }
        }
    }
}
?>