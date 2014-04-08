<?php
$user = 'root';
$pass = 'mysql';
$host = '127.0.0.1';
$db_name = 'Commission'; 

require("../include/RestService-class.inc");
require("../include/RestRouteAdmin-class.inc");
require("../include/RestRouteUser-class.inc");
require("../include/RestRouteLogin-class.inc");
require("../include/RestRouteSales-class.inc");
require("../include/RestRouteReport-class.inc");

try
{
	// Create a new PDO to connect to the database.
	$db = new PDO("mysql:host=$host;dbname=$db_name", $user, $pass);
	$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
}
catch(PDOException $e)
{
    die('ERROR: ' . $e->getMessage());
}

$rest = new RestService();
$rest->addRoute("admin", new RestRouteOrder());
$rest->addRoute("user", new RestRouteUser());
$rest->addRoute("login", new RestRouteLogin());
$rest->addRoute("sales", new RestRouteBid());
$rest->addRoute("report", new RestRouteBid());
echo json_encode($rest->output());
exit;
?>