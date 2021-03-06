<?php

require_once("RestRoute-class.inc");

/**
* RestRouteAdmin:
*/
class RestRouteAdmin extends RestRoute
{

	//This method has to change the call function
	function get($p)
	{
		if ($p[0] == "getAllUsers")
		{
			return $this->getAllUsers();
		}
		return false;
	}

	function put($p, $data)
	{
		if ($p[0] == "updateUser")
		{
			return $this->updateUser($data);
		}
		return false;
	}

	private function updateUser($data)
	{
		global $db;

		$result = $db->prepare("
			UPDATE 
				user 
			SET 
				role=:role 
			WHERE 
				name=:user
			");

		$result->bindParam(':user', $data->user, PDO::PARAM_STR);
		$result->bindParam(':role', $data->role, PDO::PARAM_STR);
		$result->execute();
		return $result;
		
	}
	private function getAllUsers()
	{
		global $db;

		$result = $db->query("
			SELECT
				*
			FROM
				user
			");

		return $result->fetchAll(PDO::FETCH_ASSOC);
	}
}
?>