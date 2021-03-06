app.controller("salesCtrl", function($scope, $http, $location) 
{ 
	$scope.sales ={};
	$scope.reportedDates = {};
	
	/* -------- TODO -------
	kolla att datumet är korrekt
	*/

	$scope.onLoad = function(){
		// sets todays date to be initialized in saleDate
		var td = new Date();
		var dd = td.getDate();
		var mm = td.getMonth()+1; //January is 0!
		var yyyy = td.getFullYear();

		if(dd<10) {
	   	 dd='0'+dd
		} 

		if(mm<10) {
	   	 mm='0'+mm
		} 

	$scope.today = yyyy+'-'+mm+'-'+dd;


		$scope.retrieveCities();
		$scope.getReportedDatesForUser();
		$scope.retrieveProductInfo();
		$scope.retrieveCommissionData();
		
		$scope.checkRole();
		
	}

	$scope.dateChange = function(date){
		$scope.getMaxAmoutOfItemsToSell();
		$scope.getSalesForUserAndDate(date);
	}

	$scope.checkRole = function(){
		if ($scope.getCookie('role') == 1) {
			console.log("role == 1")
		} else {
			$location.url('/')
			console.log("role != 1")
		};
		console.log("check role done")
	}


	/* 	
	Returns true if the input date has aleady been
	reported, else false.
	*/
	$scope.checkIfDateIsReported = function(saleDate){

		var isDateReported = false;

		if (saleDate!=null) {
			var dateSplited = saleDate.split("-");
			var yearAndMonthInput = dateSplited[0] + "-" +
				parseInt(dateSplited[1]);

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

	$scope.controllUserInputFormatForNumberOfItems = function(input){
		if (input!=null) {
			var res = input.match(/^[0-9]*/);
			if (res != input) {
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

	$scope.controllItemsLeft = function(numberOfItemsUserWantToSell, itemId){

		if ($scope.sales.itemsSold == null) {
			return;
		};

		var itemsSold = 0;
		if (itemId == 1) {
			itemsSold = $scope.sales.itemsSold[0].locks;
		} else if (itemId == 2) {
			itemsSold = $scope.sales.itemsSold[0].stocks;
		} else if (itemId == 3) {
			itemsSold = $scope.sales.itemsSold[0].barrels;
		};

		var maxAmountOfItemsToSell = 0;

		angular.forEach($scope.sales.productInfo,function(value){	
			if(value.id == itemId){
				maxAmountOfItemsToSell = value.maxAmount;
			}
		});


		var itemsLeft = maxAmountOfItemsToSell - itemsSold;
		if ((itemsLeft - numberOfItemsUserWantToSell) < 0) {
			if (itemId == 1) {
				$scope.locksToSell = itemsLeft;
			} else if (itemId == 2) {
				$scope.stocksToSell = itemsLeft;
			} else if (itemId == 3) {
				$scope.barrelsToSell = itemsLeft;
			};
			return false;
		} else {
			return true;
		};

	}

	$scope.getMaxAmoutOfItemsToSell=function(){
		angular.forEach($scope.sales.productInfo,function(value){	
			if(value.id == 1){
				$scope.maxLocksToSell = value.maxAmount;
			}
			if(value.id == 2){
				$scope.maxStocksToSell = value.maxAmount;
			}
			if(value.id == 3){
				$scope.maxBarrelsToSell = value.maxAmount;
			}
		});
	}

	$scope.reportMonth = function(reportDate){

		$scope.sales.reportSuccess =null;
		userForm = {};
		var dateSplit = reportDate.split("-");
		userForm.reportYear = dateSplit[0];
		userForm.reportMonth = dateSplit[1];
		userForm.userName = $scope.getCookie('user');

		userForm.locksSold = $scope.sales.itemsSold[0].locks;
		userForm.stocksSold = $scope.sales.itemsSold[0].stocks;
		userForm.barrelsSold = $scope.sales.itemsSold[0].barrels;

		userForm.totalSales = $scope.sales.totalSales;
		userForm.commission = $scope.sales.commission;

		$http({method: 'POST', url: 'json/sales/reportMonth', data: userForm}).
		success(function (data, status, headers, config) {
			console.log("reportMonth: success");
			console.log("reportMonth answer: " 
				+ data);
			//alert("Report success");
			$scope.sales.reportSuccess = "Report for " 
				+userForm.reportYear +"-"+userForm.reportMonth +" is sent";
			$scope.onLoad();
			//location.reload();
		}).
		error(function (data, status, headers, config) {
			console.log("reportMonth: FAILED");
			alert("Report FAILED");
		});
		
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

	$scope.getSalesForUserAndDate=function(saleDate){
		var userForm = {};
		if(saleDate.length<7){
			$scope.sales.itemsSold=null;
			return;
		}

		userForm.userName = $scope.getCookie('user');

		var dateHolder = saleDate;
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
			//alert("Sale made on "+salesForm.saleDate +" by "+salesForm.salesPersonId);
			$scope.sales.salesInfo="Sale made on "+salesForm.saleDate +" by "+salesForm.salesPersonId;
			console.log("Sale placed");
			$scope.getSalesForUserAndDate(salesForm.saleDate);
			$scope.salesUserForm.locksSold=null;
			$scope.salesUserForm.stocksSold=null;
			$scope.salesUserForm.barrelsSold=null;
			$scope.onLoad()
			//location.reload();
		
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

		if ($scope.sales.itemsSold[0].locks*$scope.sales.itemsSold[0].stocks*
				$scope.sales.itemsSold[0].barrels==0) {
			
				$scope.sales.commission = 0;			
		};

		console.log("Set commission: Total: "+$scope.sales.commission);
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

	//check if date is valid
	$scope.isDateValid = function(saleDate){
		date = String(saleDate);
		if(date.length < 10){
			return true;
		}else{
		
		var dateSplited = saleDate.split("-");
		var year = dateSplited[0];
		var month = dateSplited[1];
		var day = dateSplited[2];

			if (year > 1999 && year < 2151) {
				if (month > 0 && month < 13) {

				var daysInMonth = $scope.daysInMonth(month, year);

					if (day > 0 && day <= daysInMonth) {
						return true;
					} else {
						return false;	
					};

				} else {
					return false;
				};
			} else {
				return false;
			};
		};
	}
	//returns number of days in given mounth
	//must check that the month is > 0 and < 13 before
	$scope.daysInMonth = function(inmonth, inyear) {

        var isleap = $scope.isLeapYear(inyear);
        switch (Number(inmonth)) {
        case 2:

            if (isleap){
                return 29;
            } else {
            	return 28;
            };
            break;
        case 4:
        case 6:
        case 9:
        case 11:
        	return 30;
            break;
        default:
        	return 31;
        }
    }

    //check if the year is a leap year
    $scope.isLeapYear = function(inyear) { 
        var leap = false;
        if (inyear % 4 == 0) { 
            leap = true;
            if (inyear > 1582) {
                if ( inyear % 100 == 0 && inyear % 400 != 0) {
                    leap = false;
                };
            };
        };
        return leap;
    }
});