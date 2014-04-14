app.controller("createUserCtrl", function($scope, $http, $location) 
{
	$scope.recievedData;
	// Loads templates into id to be called on in the view 

	$scope.templates =
    { createUserForm: 'modules/createUser/templates/createUserForm.html'};

    $scope.onLoad = function (){
		$scope.loadUserNames();
	};

	$scope.loadUserNames = function () {
		
		$http({method: 'GET', url: 'json/user/getAllUsers', data: ""}).
		success(function (data, status, headers, config) {
			$scope.usersInDB=data;
		}).
		error(function (data, status, headers, config) {
		    alert("Failed to retrieve users from the db");
		});
	};

	/*
	This method will add a new userName and 
	passwordHash to the users table on the server 
	detabase and redirec user to login on sucess.
	*/
	$scope.addUser=function(userForm)
	{	
		//hashing password
		userForm.password=$scope.hashSting(userForm.password);
		userForm.passwordConfirm=$scope.hashSting(userForm.passwordConfirm);

		//Role assigned to user
		userForm.role = 0;

		$http({method: 'POST', url: 'json/user/addUser', data: userForm}).
		success(function (data, status, headers, config) {
		//	alert("the user account was created");
			$scope.redirect();
		}).
		error(function (data, status, headers, config) {

		    alert("Failed to add to db");
		});	
	}

	/*
	This method will check if the new userName is unique in the 
	on the server detabase
	*/
	$scope.checkNewUsernameValidity=function(userForm)
	{	
		var validNewUserName=true;
		
		angular.forEach($scope.usersInDB,function(value){
			if(userForm.user==value.name){
				validNewUserName=false;
			}
		});
		return validNewUserName;
	}

	/*
	Returns true if the passwords match else false.
	*/
	$scope.confirmPasswords=function(userForm)
	{
		var passwordMatch = false;
		if(userForm.password==userForm.passwordConfirm){
			passwordMatch = true;
		}
		return passwordMatch;
	}
	/*
	Checks if there are any empty fields.
	Returns true if there are no empty fields.
	Returns false if any one field is empty.
	*/
	$scope.noEmptyFields=function(userForm)
	{	
		var isNotNull=true;
		
		if(userForm.user==null){
				isNotNull=false;
		}
		if(userForm.password==null){
				isNotNull=false;
		}
		if(userForm.passwordConfirm==null){
				isNotNull=false;
		}

		return isNotNull;
	}

	/*
	This method returns a hash of the input string
	*/
	$scope.hashSting = function(str){
	    var hash = 0;
	    if (str.length == 0){
	    	return hash;	
	    } 
	    for (i = 0; i < str.length; i++) {
	        char = str.charCodeAt(i);
	        hash = ((hash<<5)-hash)+char;
	        hash = hash & hash; // Convert to 32bit integer
	    }
	    return hash;
	}

	/*
	This method will retrieve cookies stored by the application 
	and check if the session information is still valid.
	*/
	$scope.retrieveAndCheckCookie=function()
	{
		var user=$scope.getCookie('user');
		if(user==""){
			$scope.redirect();
		}else{
			return user;
		}
	}

	/*
	Returns the value of the cookie given. If no cookie
	present getCookie returns "".
	*/
	$scope.getCookie=function(cookieName)
	{
		var name = cookieName + "=";
		var ca = document.cookie.split(';');
		for(var i=0; i<ca.length; i++) 
		{
			var c = ca[i].trim();
			if (c.indexOf(name)==0){
				return c.substring(name.length,c.length);
			}
		}
		return "";
	}

	// Checks if the given cookie is set return true if cookie is set 
	// and false if not. 
	$scope.isCookieSet = function(cookieIdentifier){
		var identifier = $scope.getCookie(cookieIdentifier);
		if (identifier!="" && identifier!=null)
		  {
			return true;
		  } else {
			return false;
		  }
	}
});