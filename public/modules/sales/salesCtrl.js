app.controller("salesCtrl", function($scope, $http, $location) 
{ 
	$scope.sales ={};
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

		$scope.retrieveCities();
		$scope.getReportedDatesForUser();
		$scope.retrieveProductInfo();
		$scope.retrieveCommissionData();
		
	}


	/* 	Returns true if the input date has aleady been
		reported, else false.
	*/
	$scope.checkIfDateIsReported = function(saleDate){

		var isDateReported = false;

		angular.forEach($scope.reportedDates,function(value){
			
			if(saleDate == (value.year + "-" + value.month)){
				isDateReported=true;
			}
			
		});
		return isDateReported;
	}



	$scope.getReportedDatesForUser=function()
	{
		userName=$scope.getCookie('user');
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
		if(userForm.saleDate.length!=10){
			$scope.sales.itemsSold=null;
			return;
		}
		userForm.userName = $scope.getCookie('user');

		var dateHolder = userForm.saleDate;
		var dateSplited = dateHolder.split("-");

		userForm.year = dateSplited[0];
		userForm.month = dateSplited[1];

		$http({method: 'POST', url: 'json/sales/getSalesForUserAndDate', data: userForm}).
		success(function (data, status, headers, config) {
			console.log("getSalesForUserAndDate: success")

			console.log("getSalesForUserAndDate answer: " 
				+ data)

			$scope.sales.itemsSold = data;
			$scope.setSales();
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
			$scope.getSalesForUserAndDate(salesForm);
		
		}).
		error(function (data, status, headers, config) {

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

	/*
	Retrieves info about the products.
	*/
	$scope.retrieveProductInfo= function () {
		
		$http({method: 'GET', url: 'json/sales/getProductInfo', data: ""}).
		success(function (data, status, headers, config) {
			$scope.sales.productInfo=data;
			console.log("Product info retrieved: "+data);
		}).
		error(function (data, status, headers, config) {
		    alert("Failed to retrieve product info from the db");
		});
	};

		/*
	Retrieves commission boundries and percentages.
	*/
	$scope.retrieveCommissionData= function () {
		
		$http({method: 'GET', url: 'json/sales/getCommissionData', data: ""}).
		success(function (data, status, headers, config) {
			$scope.sales.commissionData=data;
			console.log("Commission data retrieved: "+data);
		}).
		error(function (data, status, headers, config) {
		    alert("Failed to retrieve commission data from the db");
		});
	};


// -----<<<< Calculate sales and commission >>>---- 
	$scope.setSales = function(){
		$scope.sales.totalSales =0;
		$scope.sales.productInfo.forEach(function(item){
			if(item.name == 'Lock'){
				$scope.sales.totalSales += parseInt(item.price)*parseInt($scope.sales.itemsSold[0].locks);
			}
			if(item.name == 'Stock'){
				$scope.sales.totalSales += parseInt(item.price)*parseInt($scope.sales.itemsSold[0].stocks);
			}
			if(item.name == 'Barrel'){
				$scope.sales.totalSales += parseInt(item.price)*parseInt($scope.sales.itemsSold[0].barrels);
			}
			console.log("Set sales: "  +item.name + " "+item.price + " Total: "+$scope.sales.totalSales);
		});
		$scope.setCommission();
	}

	$scope.setCommission = function(){
		$scope.sales.commission = 0;
		var percent = 0;
		var boundry = 0;
		var restCommission =0;
		
		$scope.sales.commissionData.forEach(function(item){
			if($scope.sales.totalSales>parseInt(item.boundry)){
				$scope.sales.commission += percent*(parseInt(item.boundry)-boundry);
				percent = item.percent;
				boundry = parseInt(item.boundry);
				restCommission= ($scope.sales.totalSales-boundry)*percent;

				console.log("Set commission: "  +item.percent + " "+item.boundry 
					+ " Total: "+$scope.sales.commission +" Rest: " +restCommission);
			}
		});	
		$scope.sales.commission += restCommission;
		console.log("Set commission: Total: "+$scope.sales.commission);
	}


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