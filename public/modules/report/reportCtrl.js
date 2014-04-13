app.controller("reportCtrl", function($scope, $http, $location) 
{
	$scope.activeReportsInDb=null;

	// Loads templates into id to be called on in the view 
	$scope.templates=
    {	
    	finalizeDeal:'./modules/bid/templates/finalizeDeal.html',
    	placeBid:'./modules/bid/templates/placeBid.html',
		reserveOrder:'./modules/bid/templates/reserveOrder.html'
	};

	$scope.onLoad = function(){
		console.log("onload");
		$scope.activeReportsInDb = $scope.retrieveActiveReports();		
	}

	$scope.retrieveActiveReports = function () {
		
		$http({method: 'GET', url: 'json/report/getActiveReports', data: ""}).
		success(function (data, status, headers, config) {
			$scope.activeReportsInDb=data;
		}).
		error(function (data, status, headers, config) {
		    alert("Failed to retrieve users from the db");
		});
		return $scope.activeReportsInDb;
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
			alert("Please log in!");
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

});