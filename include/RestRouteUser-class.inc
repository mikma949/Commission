<?php

require_once("RestRoute-class.inc");

/**
* RestRouteCommission:
*/
class RestRouteUser extends RestRoute
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
		if ($p[0] == "addUser")
		{
			return $this->addUser($data);
		}
		elseif ($p[0] == "getUser")
		{
			return $this->getUser($data);
		}
		return false;
	}

	private function getUser($data)
	{
		global $db;

		$result = $db->prepare("
			SELECT
				*
			FROM
				user
			WHERE
				name = :userName
			");

		$result->bindParam(':userName', $data->user, PDO::PARAM_STR);
		$result->execute();
		return $result->fetchAll(PDO::FETCH_ASSOC);		
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

	private function addUser($data)
	{
		global $db;

		$result = $db->prepare("
			INSERT INTO 
			user (name,password,role) 
			values (:userName,:passwordHash,:role);
			");
		$result->bindParam(':userName', $data->user, PDO::PARAM_STR);
		$result->bindParam(':passwordHash', $data->password, PDO::PARAM_STR);
		$result->bindParam(':role', $data->role, PDO::PARAM_STR);
		$result->execute();
		return $result;
	}
}

?>