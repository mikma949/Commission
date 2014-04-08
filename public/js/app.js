var app = angular.module('Commission', ['ngRoute']);

// configure our routes
app.config(function($routeProvider) {
	$routeProvider

		// route for the default page
		.when('/', {
			templateUrl : 'views/login.html',
		})

		// route for the create user page
		.when('/createUser', {
			templateUrl : 'views/createUser.html',
		})

		// route for the biding page
		.when('/sales', {
			templateUrl : 'views/sales.html',
		})

		// route for the order page
		.when('/report', {
			templateUrl : 'views/report.html',
		})

		// route for the login page
		.when('/admin', {
			templateUrl : 'views/admin.html',
		});
});

app.run(function($rootScope, $templateCache){
	$rootScope.$on('$viewContentLoaded',function(){
		$templateCache.removeAll();
	});
});
