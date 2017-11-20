<?php


function AurionQuery($query) {
    try {
      $db = new PDO("pgsql:host=postgres; dbname=db", "user", "password");
      //echo 'Connexion OK';
    }   
    catch(PDOException $e) {
      $db = null;
      echo 'ERREUR DB: ' . $e->getMessage();
    }   
    //echo $query;  
    $qry = $db->prepare($query);
    $i=$db->exec($query);
    $qry->execute();
    return $qry;
}



function ListProfs() {
	$qry = '
with q1 as (
    select Nom Prenom Coordonnee from user
';
	$result=AurionQuery($qry);
	return $result; 
}

?>
