var imported = document.createElement('script');
imported.src = 'credentials.js';
document.head.appendChild(imported);

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/admin/directory_v1/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = 'https://www.googleapis.com/auth/apps.groups.settings https://www.googleapis.com/auth/admin.directory.user.readonly https://www.googleapis.com/auth/admin.directory.group.member https://www.googleapis.com/auth/admin.directory.group https://www.googleapis.com/auth/admin.directory.group.member https://www.googleapis.com/auth/admin.directory.group.member.readonly https://www.googleapis.com/auth/admin.directory.group.readonly';

var authorizeButton = document.getElementById('authorize-button');
var signoutButton = document.getElementById('signout-button');


/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  gapi.client.init({
    discoveryDocs: DISCOVERY_DOCS,
    clientId: CLIENT_ID,
    scope: SCOPES
  }).then(function () {
	console.log("Ready to log");
	document.getElementById("status").innerHTML = "Radis"; 
	document.getElementById("status").style.color = "#33cc33";
	document.getElementById("status").style.fontWeight="bold";

    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;

	document.getElementById('add').onclick = handleAddClick;
	document.getElementById('list').onclick = handleListClieck;
	document.getElementById('members').onclick = handleMembersClick;
	document.getElementById('delete').onclick = handleDeleteClick;
	document.getElementById('deleteGR').onclick = handleDeleteGRClick;
	document.getElementById('check').onclick = handleCheckUser;
	document.getElementById('checkgr').onclick = handleCheckGR;
	document.getElementById('update').onclick = handleUpdate;
  });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
//	printGroupsSettings();
//	listUsers();
		//	document.write('logged in');
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
		//	document.write('not logged');
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

function handleAddClick(event) {
  AddUser(document.getElementById('email').value, 'content');
}

function handleDeleteClick(event) {
	DelUser(document.getElementById('email').value, 'content');
}

function handleDeleteGRClick(event) {
//	DelUser();
	listMembers(listMembersDELETE);
	appendDebug(usersList); 
	usersList = null; 
	appendPre(usersList);
	var foobar = handleListClieck;
}

function handleListClieck(event) {
  listUsers();
}

function handleMembersClick(event) {
	listMembers(listMembersOK);
}


function handleCheckUser(event) {
	testUser(document.getElementById('email').value, 'content');
}

function handleCheckGR(event) {
	parseTable("userlist");
}

function handleUpdate(event) {
	updateTable("userlist");
}
/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
  var pre = document.getElementById('content');
  var textContent = document.createTextNode(message + '\n');
  pre.appendChild(textContent);
}

function appendDebug(message) {
	var pre = document.getElementById('debug');
	var textContent = document.createTextNode(message + '\n');
	pre.appendChild(textContent);
}

/**
 * Print details about Groups Setting.
 */
function AddUser(email, id) {
//boutton add
	//var email = document.getElementById('email').value;
	appendDebug(email);

	var json1 = {
		"groupKey": GROUP,
		resource: {
		    "email": email,
			"role": "MEMBER"
		}
	
	}

	gapi.client.directory.members.insert(json1).then(
		addOK.bind(null, id)
	);



}

function addOK(id, response) {
        console.log(response);
        var user = response.result;

        if (user.email.length > 0) {
                document.getElementById(id).innerHTML = 'Ajouté avec succes: ' + user.email;
        } else {
                document.getElementById(id).innerHTML = 'Ajout éCHOUé pour: ' + email;
        }   
}


function testUser(email, id) {
	var json = {
		"groupKey": GROUP,
		"memberKey": email
	}

    try {
        gapi.client.directory.members.get(json).then(
		checkOK.bind(null, email, id),
		checkERR.bind(null, id)) ;
    } catch (err) {
        document.getElementById("debug").innerHTML = err.message;
        appendDebug("aieaieaie!");
		throw err; 
   	}   
//	console.log("a la fin: "); 
}
function checkOK(email, id, response) {
//	console.log("Réponse OK: "); 
//	console.log(response);
    if(response.result.email == email) {
		document.getElementById(id).innerHTML = "il y est";
		document.getElementById(id).tested = true; 
		document.getElementById(id).present = true; 
	} else {
		document.getElementById(id).innerHTML = "yapa";
		document.getElementById(id).tested = true; 
		document.getElementById(id).present = false; 
    }   
}
function checkERR(id, response){
	if (response.result.error.errors[0].message == "Missing required field: memberKey") {
		document.getElementById(id).innerHTML = "N'existe pas";
		document.getElementById(id).tested = true; 
		document.getElementById(id).present = false;
	} else if (response.result.error.errors[0].message == "Resource Not Found: memberKey") {
		document.getElementById(id).innerHTML = "N'est pas dans le groupe"; 
		document.getElementById(id).tested = true;
		document.getElementById(id).present = false;
	} else {
		document.getElementById(id).innerHTML = "Erreur"; 
		document.getElementById(id).tested = true; 
		appendDebug("Erreur " + response.result.error.errors.message);
	}

}




function DelUser(email, id) {

	appendDebug("del " + email + ": ");
	var json1 = {
		"groupKey": GROUP,
		"memberKey": email
	}

	try {
		gapi.client.directory.members.delete(json1).then(
			DelOK.bind(null, id), 
			DelErr.bind(null, id)
		) ;
	} catch (err) {
		DelErr(id, "erreur à la suppression"); 	
	}
	appendDebug("done");
}
function DelOK(id, response) {
	console.log(response);
	document.getElementById(id).innerHTML = "Deleted"; 
}
function DelErr(id, response) {
	console.log(response);
	document.getElementById(id).innerHTML = "aieaieaie"; 
}






/**
* Print the first 10 users in the domain.
*/
function listUsers() {
  gapi.client.directory.users.list({
    'customer': 'my_customer',
    'maxResults': 10,
    'orderBy': 'email'
  }).then(
	  listUsersOk
	);
}
function listUsersOk(response) {
    var users = response.result.users;
    appendPre('Users:');

    if (users && users.length > 0) {
        for (i = 0; i < users.length; i++) {
          var user = users[i];
          appendPre('-' + user.primaryEmail + ' (' + user.name.fullName + ')');
        }   
    } else {
        appendPre('No users found.');
    }   

}


 
function listMembers(fct) {
	//gapi.client.groupsSettings.groups.get({
  gapi.client.directory.members.list({
      "groupKey": GROUP,
		'orderBy': 'email'
  	}).then(
		fct
	  ); 
}

var usersList; 

function listMembersOK(response) {
        appendDebug("response: " + response);
        var users = response.result.members;
        document.getElementById("content").innerHTML = ""
        appendPre('members: ');
        if (users && users.length > 0) {
			usersList = users; 
            for (i = 0; i < users.length; i++) {
                var user = users[i];
                appendPre('-' + user.email + ' (' + user.role + ')');
            }   
        } else {
            appendPre('no members founds'); 
        }   
}
function listMembersDELETE(response) {
	var table = "userlist";

	var users = response.result.members;
	appendPre('SUPPRESSION DES USERS dans le ggroup');
    if (users && users.length > 0) {
        for (i = 0; i < users.length; i++) {
	          var user = users[i];
		  if (user.role == "MEMBER") {
			  //le user est membre dans le groupe google. 
			  // on fouille le tableau pour verifier si il doit être gardé ou non. 
			  if(document.getElementById(user.email) != null) {
				//une case avec ce user name existe, il doit être conservé
	    	      document.getElementById(user.email).innerHTML = 'Dans le groupe';
			  } else {
				  DelUser(user.email, 'content');
			  }
		  }
        }   
    } else {
        appendPre('No users found.');
    }   



}


function parseTable(table) {
     var table = document.getElementById(table);
     for (var i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        for (var j = 0, col; col = row.cells[j]; j++) {
           //iterate through columns
           //columns would be accessed using the "col" variable assigned in the for loop
           if (col.id != "" && col.id != null) {
              //appendDebug("value: " + col.id);
			  testUser(col.id, col.id);
           }
        }  
     }
}

function updateTable(table) {
	var table = document.getElementById(table);
	for (var i = 0, row; row = table.rows[i]; i++) {
		for (var j = 0, col; col = row.cells[j]; j++) {
			if (col.tested == true && col.present != true) {
				document.getElementById(col.id).innerHTML = "GO " + document.getElementById(col.id).innerHTML
				AddUser(col.id, col.id);
				col.tested = false;
			} else if (col.tested == false) {
				document.getElementById(col.id).innerHTML = "Impossible de traiter. Veuillez mettre à jour le tableau d'abord"; 
			} else if (col.tested == true && col.present == true) {
				document.getElementById(col.id).innerHTML = "Déjà dans le groupe"; 
			}
		}
	}
}



