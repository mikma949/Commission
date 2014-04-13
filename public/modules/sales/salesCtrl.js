app.controller("salesCtrl", function($scope, $http, $location) 
{ 
	$scope.sales ={};
	$scope.userName = null;
	$scope.reportedDates = {};

	
	// Loads templates into id to be called on in the view 
	$scope.templates=
	{
		salesForm:'./modules/sales/templates/salesForm.html',
		buyerOrders:'./modules/sales/templates/buyerOrders.html',
		sellerOrders:'./modules/sales/templates/sellerOrders.html'
	};

	/* -------- TODO -------
	kolla att datumet är korrekt
	Fixa så att submit inte funkar ifall 
	checkIfDateIsReported == true
	Lös så att ifall select city inte är
	valt så disable submit.

	*/



	$scope.onLoad = function(){

		$scope.retrieveUserNames();
		$scope.userName = $scope.getCookie('user');
		
		$scope.getReportedDatesForUser(
			$scope.userName);
		


		// Mickes init
		$scope.initSales();

	}

	$scope.hej = function(){

		$scope.checkIfDateIsReported();
		
	}

	/* 	Returns true if the input date has aleady been
		reported, else false.
	*/
	$scope.checkIfDateIsReported = function(userForm){

		var isDateReported = false;

		angular.forEach($scope.reportedDates,function(value){
			
			if(userForm.date == (value.year + value.month)){
				isDateReported=true;
			}
			
		});
		return isDateReported;
	}



	$scope.getReportedDatesForUser=function(userName)
	{
		
		console.log("getReportedDatesForUser: " + userName)
		$http({method: 'POST', url: 'json/sales/getReportedDatesForUser', data: userName}).
		success(function (data, status, headers, config) {
			console.log("getReportedDatesForUser: " 
				+ userName + " success");
			console.log("getReportedDatesForUser answer: " 
				+ data);
			$scope.reportedDates = data;
		}).
		error(function (data, status, headers, config) {
			console.log("getReportedDatesForUser: " 
				+ userName + " FAILED");
		});	
	}

	// NOT IN USE
	$scope.retrieveUserNames = function () {
		
		$http({method: 'GET', url: 'json/sales/getAllUsers', data: ""}).
		success(function (data, status, headers, config) {
			$scope.usersInDB=data;
		}).
		error(function (data, status, headers, config) {
		    alert("Failed to retrieve users from the db");
		});
	};

	// NOT IN USE
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


//  -----<<<< Micke kod >>>>-----

	$scope.initSales=function(){
		$scope.retrieveCities();
		$scope.checkIfReported({saleDate:20000101});
	}

	/*
	This method will place a new sale
	*/
	$scope.place=function(salesForm)
	{
		salesForm.saleDate =20001201;
		
		salesForm.salesPersonId="Micke";
		salesForm.locksSold =1;
		salesForm.stocksSold=2;
		salesForm.barrelsSold=3;
		//Set the itemId's
		salesForm.lock =1;
		salesForm.stock=2;
		salesForm.barrel=3;
		
		$http({method: 'POST', url: 'json/sales/place', data: salesForm}).
		success(function (data, status, headers, config) {
			alert("Sale made on "+salesForm.saleDate +" by "+salesForm.salesPersonId);
			console.log("Sale placed");
		
		}).
		error(function (data, status, headers, config) {

		    alert("Failed to add to db");
		});	
	}	

	/*
	Checks if monthly report has been submitted
	*/
	$scope.checkIfReported=function(saleDate)
	{
		
		console.log("checkIfReported: " +saleDate['saleDate'])
		$http({method: 'POST', url: 'json/sales/checkIfReported', data: saleDate}).
		success(function (data, status, headers, config) {
			$scope.sales.reported=data;
			console.log("Date checked: "+$scope.sales.reported[0].reported);
		
		}).
		error(function (data, status, headers, config) {
			console.log("Date not checked: "+data);
		    alert("Failed to add to db");
		});	
	}	

	/*
	Retrieves all cities sales can be made in
	*/
	$scope.retrieveCities = function () {
		
		$http({method: 'GET', url: 'json/sales/getCities', data: ""}).
		success(function (data, status, headers, config) {
			$scope.sales.cities=data;
			console.log("Cities retrieved: "+data);
		}).
		error(function (data, status, headers, config) {
		    alert("Failed to retrieve cities from the db");
		});
	};



// -----<<<<Gammal kod>>>----
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