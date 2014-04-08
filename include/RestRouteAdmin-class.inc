<?php

require_once("RestRoute-class.inc");

/**
* RestRouteEndMonth:
*/
class RestRouteLogin extends RestRoute
{

	function put($p, $data)
	{
		if ($p[0] == "checkUser")
		{
			return $this->checkUser($data);
		}
		return false;
	}

	private function checkUser($data)
	{
		global $db;

		$result = $db->prepare("
			SELECT
				name
			FROM
				user
			WHERE
				name=:user
				AND
				password=:password
			");

		$result->bindParam(':user', $data->user, PDO::PARAM_STR);
		$result->bindParam(':password', $data->password, PDO::PARAM_STR);
		$result->execute();
		return $result->fetchAll(PDO::FETCH_ASSOC);
	}
}
?>