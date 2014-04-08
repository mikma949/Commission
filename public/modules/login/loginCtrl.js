app.controller("loginCtrl", function($scope, $http, $location) 
{
	
	// Loads templates into id to be called on in the view 

	$scope.templates =
    { 	loginForm: './modules/login/templates/loginForm1.html' };

	/*
	This function is called when user submits login form.
	*/
	$scope.processLoginUserForm=function(loginform)
	{
		$scope.validateLoginDetails(loginform);
	}

	/*
	This method will validate the login details agains the 
	valid logins on the server detabase. 
	*/
	$scope.validateLoginDetails=function(loginForm)
	{		
		loginForm.password=$scope.hashSting(loginForm.password);
		$http({method: 'POST', url: 'json/login/checkUser', data: loginForm}).
		success(function (data, status, headers, config) {
			if(data.length=1){
				$scope.setCookie('user',data[0].name);
				$scope.redirect();
			}
			else{
				alert("Invalid login information")
			}
		}).
		error(function (data, status, headers, config) {
		    alert("Failed to check login details");
		});	
		/*
		hash password and check the hash against the hash 
		in the db
		*/
		//return true;
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
	This method will handle redirection to a given module
	*/
	$scope.redirect=function()
	{
		$location.url('/sales');	
	}

	/*
	This method will retrieve cookies stored by the application 
	and check if the session information is still valid.
	*/
	$scope.retrieveAndCheckCookie=function()
	{
		var user=$scope.getCookie('user');
		return user;
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

	// Deletes all cookies
	$scope.deleteCookies = function(){
		var cookies = document.cookie.split(";");
		for (var i = 0; i < cookies.length; i++){
  			document.cookie = cookies[i].split("=")[0] + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
		}

	}

	/*
	Set the cookie with the cookieName to the cookieValue  
	*/
	$scope.setCookie=function(cookieName,cookieValue)
	{
		document.cookie = cookieName+"="+cookieValue + ";";
	}
});