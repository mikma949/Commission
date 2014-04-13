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


		$scope.userName = $scope.getCookie('user');
		
		$scope.getReportedDatesForUser($scope.userName);
		
		$scope.retrieveCities();
	//	$scope.checkIfReported({saleDate:20000101});


	}

	/* 	Returns true if the input date has aleady been
		reported, else false.
	*/
	$scope.checkIfDateIsReported = function(saleDate){

		var isDateReported = false;

		if (saleDate!=null) {
			var dateSplited = saleDate.split("-");
			var yearAndMonthInput = dateSplited[0] + "-" +
				dateSplited[1];

			angular.forEach($scope.reportedDates,function(value){
				
				if(yearAndMonthInput == (value.year + "-" + value.month)){
					isDateReported=true;
				}
				
			});
		};
		return isDateReported;
	}

	$scope.controllUserInputFormatForSaleDate = function(saleDate){

		if (saleDate!=null) {
			var res = saleDate.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}/);
			if (res != saleDate) {
				return false;
			};
		};
		return true;
	}

	$scope.controllUserInputFormatForReport = function(saleDate){

		if (saleDate!=null) {
			var res = saleDate.match(/^[0-9]{4}-[0-9]{2}/);
			if (res != saleDate) {
				return false;
			};
		};
		return true;
	}

	$scope.reportMonth = function(reportDate){
		userForm = {};
		var dateSplit = reportDate.split("-");
		userForm.reportYear = dateSplit[0];
		userForm.reportMonth = dateSplit[1];
		userForm.userName = $scope.getCookie('user');

		alert("userName: " + userForm.userName +
			" year: " + userForm.reportYear + 
			" month: " + userForm.reportMonth);

		/*
		$http({method: 'POST', url: 'json/sales/reportMonth', data: userForm}).
		success(function (data, status, headers, config) {
			console.log("reportMonth: success");
			console.log("reportMonth answer: " 
				+ data);

		}).
		error(function (data, status, headers, config) {
			console.log("reportMonth: FAILED");
		});
		*/
	}

	$scope.getReportedDatesForUser=function(userName)
	{
		
		console.log("getReportedDatesForUser: " + userName)
		$http({method: 'POST', url: 'json/sales/getReportedDatesForUser', data: {'userName':userName}}).
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

	$scope.getSalesForUserAndDate=function(userForm)
	{
		
		userForm.userName = $scope.userName;

		var dateHolder = userForm.saleDate;
		var dateSplited = dateHolder.split("-");

		userForm.year = dateSplited[0];
		userForm.month = dateSplited[1];

		$http({method: 'POST', url: 'json/sales/getSalesForUserAndDate', data: userForm}).
		success(function (data, status, headers, config) {
			console.log("getSalesForUserAndDate: success")

			console.log("getSalesForUserAndDate answer: " 
				+ data)

			$scope.dbut = data;

		}).
		error(function (data, status, headers, config) {
			console.log("getSalesForUserAndDate: FAILED");
		});	
	}



//  -----<<<< Micke kod >>>>-----


	/*
	This method will place a new sale
	*/
	$scope.place=function(salesForm)
	{
		salesForm.salesPersonId=$scope.getCookie('user');
		
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