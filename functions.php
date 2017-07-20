<?php

include "db.php";

    function start_time() {
        //memorise l'heure au debut du chargement de la page
        $m_time = explode(" ",microtime()); 
        $m_time = $m_time[0] + $m_time[1]; 
        $starttime = $m_time; 
        return $starttime;
    }   

    function stop_time($starttime) {
        //affiche la difference de temps avec startTime(); 
        $round = 3;// The number of decimal places to round the micro time to. 
        $m_time = explode(" ",microtime()); 
        $m_time = $m_time[0] + $m_time[1]; 
        $endtime = $m_time; 
        $totaltime = ($endtime - $starttime); 
        echo "<p align='right'><font size='-2'> Page chargée en :". round($totaltime,$round) ." secondes</font></p>";
    
    }   



?>
