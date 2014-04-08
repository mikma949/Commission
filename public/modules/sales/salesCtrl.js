app.controller("salesCtrl", function($scope, $http, $location) 
{ 
	
	
	// Loads templates into id to be called on in the view 
	$scope.templates=
	{
		createOrderForm:'./modules/order/templates/orderForm1.html',
		buyerOrders:'./modules/order/templates/buyerOrders.html',
		sellerOrders:'./modules/order/templates/sellerOrders.html'
	};

	
	

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