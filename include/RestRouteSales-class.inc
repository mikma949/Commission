<?php

require_once("RestRoute-class.inc");

/**
* RestRouteEndMonth:
*/
class RestRouteSales extends RestRoute
{

	function put($p, $data)
	{
		if ($p[0] == "place")
		{
			return $this->place($data);
		}
		elseif ($p[0] == "checkIfReported")
		{
			return $this->checkIfReported($data);
		}
	/*	elseif ($p[0] == "finalizeDeal")
		{
			return $this->finalizeDeal($data);
		}
		elseif ($p[0] == "getLowest")
		{
			return $this->getLowest($data);
		}*/
		return false;
	}
	function get($p)
		{
			if ($p[0] == "getCities")
			{
				return $this->getCities();
			}/*
			elseif ($p[0] == "getUser")
			{
				return $this->getUser($data);
			}*/
			return false;
	}


/*
======= POST =======
*/

	// Adds a sale to the database
	private function place($data)
	{
		global $db;

		$result = $db->prepare("
			INSERT INTO 
				sales (saleDate ,salesPersonId, productId, quantity)
			VALUES
				(:saleDate,:salesPersonId,:lock,:locksSold),
				(:saleDate,:salesPersonId,:stock,:stocksSold),
				(:saleDate,:salesPersonId,:barrel,:barrelsSold)
			");

		$result->bindParam(':saleDate', $data->saleDate, PDO::PARAM_STR);
		$result->bindParam(':salesPersonId', $data->salesPersonId, PDO::PARAM_STR);
		$result->bindParam(':lock', $data->lock, PDO::PARAM_INT);
		$result->bindParam(':stock', $data->stock, PDO::PARAM_INT);
		$result->bindParam(':barrel', $data->barrel, PDO::PARAM_INT);
		$result->bindParam(':locksSold', $data->locksSold, PDO::PARAM_INT);
		$result->bindParam(':stocksSold', $data->stocksSold, PDO::PARAM_INT);
		$result->bindParam(':barrelsSold', $data->barrelsSold, PDO::PARAM_INT);
		$result->execute();
		return $result->fetchAll(PDO::FETCH_ASSOC);	
	}


	private function checkIfReported($data)
	{
		global $db;

		$result = $db->prepare("
			SELECT 
				reported
			FROM 
				report
			WHERE 
				year=YEAR(:saleDate)
				AND 
				month=MONTH(:saleDate);
			");

		$result->bindParam(':saleDate', $data->saleDate, PDO::PARAM_STR);
		
		$result->execute();
		return $result->fetchAll(PDO::FETCH_ASSOC);	
	}


/*
======= GET =======
*/
	private function getCities()
	{
		global $db;

		$result = $db->query("
			SELECT
				*
			FROM
				city
			");

		
		return $result->fetchAll(PDO::FETCH_ASSOC);		
	}








	
}
?>