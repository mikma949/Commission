<?php

require_once("RestRoute-class.inc");

/**
* RestRouteOrder:
*/
class RestRouteReport extends RestRoute
{
	function get($p)
	{
		if ($p[0] == "getActiveReports")
		{
			return $this->getActiveReports($data);
		} elseif ($p[0] == "getAllUsers")
		{
			return $this->getAllUsers();
		}
		return false;
	}

	private function getActiveReports()
	{
		global $db;

		$result = $db->query("
			select 
				* 
			from 
				report 
			where 
				reported = 1;
			");
		return $result->fetchAll(PDO::FETCH_ASSOC);		
	}
	
}

?>