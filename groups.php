<?php

   $path = $_SERVER['DOCUMENT_ROOT'];
   $path .= "/ggroupe/functions.php";
   include_once($path);

    $starttime = start_time();

	$isAdmin = false;
	if($_POST["type"] != "admin") {
		$isAdmin = true;
	}
?>

<html>
  <head>
    <title>Gestion du groupe enseignants@</title>
    <meta charset='utf-8' />
	<link type="text/css" rel="stylesheet" href="style.css" />
  </head>
  <body>

    <h1>Gestion du groupe enseignants@</h1>

	<table id="global"><tr><td class=control>

		<p>		
		    <!--Add buttons to initiate auth sequence and sign out-->
		    <button id="authorize-button" style="display: none;">Authorize</button>
		    <button id="signout-button" style="display: none;">Sign Out</button>
		</p>
		<h3> L'api <?php if(!$isAdmin) { echo("<font color='red'>admin</font>"); }?>  est: <div id="status">pas prete</div></h3>

		<br/>
	
	<?php
	//if(!$isAdmin) {
		echo('<h2> indiv </h2>');
		echo('<input type="text" id="email" name="email" value="">');
		echo('<button id="add">add</button>');
		echo('<button id="delete">delete</button>');
		echo('<button id="check">check</button>'); 
	//}
	?>

		<h2> groupe </h2>
		<button id="checkgr">check</button>
		<button id="members">members</button>
		<button id="update">update + (ajout)</button>
		<button id="deleteGR">update - (supprime)</button>
	<?php
	//if(!$isAdmin) {

		echo('<h2> random </h2>');
		echo('<button id="list">list</button>');
	//}
	?>

		<h2> resultats </h2>
		<button onclick="document.getElementById('debug').innerHTML = ''; document.getElementById('content').innerHTML = ''; ">clear</button>
		<h3> content/pre </h3>
	    <pre id="content"></pre>
		<h3> debug </h3>
		<pre id="debug">debug</pre>

		<br/>

		<!-- ne pas changer l'ordre des scripts 
				Gapi.js doit être chargé avant apis.google.com 
		<script type="text/javascript" src="Gapi.js"
			onreadystatechange="if (this.readyState === 'complete') this.onload();"></script>

	    <script async type="text/javascript" src="https://apis.google.com/js/api.js"
			onload="this.onload=function(){}; handleClientLoad()">
	    </script>
	-->

		<script type="text/javascript" src="https://apis.google.com/js/api.js" ></script> 
		<script type="text/javascript" src="Gapi.js"> </script>
		<script type="text/javascript">handleClientLoad();</script>

		</td> <!-- control -->

		<td class="list">
<?php

	echo("<table id='userlist' class='userlist'>");
	echo("<tr><th>Nom</th><th>Prenom</th><th>Mail</th><th>status</th></tr>");

    $result=ListProfs();
    while($row = $result->fetchObject()){
		echo("<tr>");
        $nom=$row->Nom;
		$prenom=$row->Prenom; 
		$mail=$row->Coordonnee;
		echo("<td>" . $nom . "</td><td>" . $prenom . "</td><td>" . $mail . "<td id=".$mail.">N/A</td>"); 
		echo("</tr>");
    }   

	echo("</table>"); 

?>

	</td></tr> <!-- tr list -->
	</table><!-- table global -->
    <p align='right'><?php stop_time($starttime);?></span></p>
  </body>
</html>
