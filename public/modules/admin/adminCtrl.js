app.controller("adminCtrl", function($scope, $http, $location) 
{ 
	
	
	// Loads templates into id to be called on in the view 
	$scope.templates=
	{
		createOrderForm:'./modules/order/templates/orderForm1.html',
		buyerOrders:'./modules/order/templates/buyerOrders.html',
		sellerOrders:'./modules/order/templates/sellerOrders.html'
	};

	$scope.retrieveUserNames = function () {
		
		$http({method: 'GET', url: 'json/user/getAllUsers', data: ""}).
		success(function (data, status, headers, config) {
			$scope.usersInDB=data;
		}).
		error(function (data, status, headers, config) {
		    alert("Failed to retrieve users from the db");
		});
	};

	/*
	This method will check if the userName exists in the 
	server detabase
	*/
	$scope.checkUsernameValidity=function(userForm)
	{	
		var validNewUserName=false;
		
		angular.forEach($scope.usersInDB,function(value){
			if(userForm.user==value.name){
				validNewUserName=true;
			}
		});
		return validNewUserName;
	}

	/*
	Checks that the users role is vaild
	*/
	$scope.validRole=function(userForm)
	{
		var isValid = false;

		if (userForm.role >= 0 && userForm.role <= 3) {
			isValid = true;
		};
		return isValid;
	}
	
	$scope.updateUserRole=function(userForm)
	{
		$http({method: 'POST', url: 'json/admin/updateUser', data: userForm}).
		success(function (data, status, headers, config) {

			alert("Update success");
		}).
		error(function (data, status, headers, config) {

		    alert("Failed to add to db");
		});	
	}

	/*
	This method will retrieve cookies stored by the application 
	and check if the session information is still valid.
	*/
	$scope.retrieveAndCheckCookie=function()
	{
		var user=$scope.getCookie('user');
		if(user==""){
			$scope.redirect('login');
		}else{
			return user;
		}
	}

	/*
	This method will handle redirection to a given module
	*/
	$scope.redirect=function(redirectTo)
	{	
		if(redirectTo=="login"){
			$location.url('/login');
		}
		else if(redirectTo=="logout"){
			$scope.deleteCookies();
			$location.url('/login');
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

		// Deletes all cookies
	$scope.deleteCookies = function(){
		var cookies = document.cookie.split(";");
		for (var i = 0; i < cookies.length; i++){
  			document.cookie = cookies[i].split("=")[0] + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
		}
	}
});