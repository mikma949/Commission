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
		elseif ($p[0] == "getReportedDatesForUser")
		{
			return $this->getReportedDatesForUser($data);
		}
		elseif ($p[0] == "getSalesForUserAndDate")
		{
			return $this->getSalesForUserAndDate($data);
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
			elseif ($p[0] == "getAllUsers")
			{
				return $this->getAllUsers();
			}
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


	private function getReportedDatesForUser($data)
	{
		global $db;

		$result = $db->prepare("
			select 
				year,month 
			from 
				report 
			where 

				salesPerson = :userName 
			and 
				reported=1;
			");

		$result->bindParam(':userName', $data->userName, PDO::PARAM_STR);
		
		$result->execute();
		return $result->fetchAll(PDO::FETCH_ASSOC);	
	}

	private function getSalesForUserAndDate($data)
	{
		global $db;

		$result = $db->prepare("
			Select user.name name, 
				IFNULL((SELECT sum(quantity) total FROM Commission.sales
				where productId =1
				and salesPersonId = user.name
				and YEAR(saleDate)=:year
				and MONTH(saleDate)=:month
					group by  salesPersonId,productId),0)
			 as locks,
				IFNULL((SELECT sum(quantity) total FROM Commission.sales
				where productId =2
				and salesPersonId = user.name
				and YEAR(saleDate)=:year
				and MONTH(saleDate)=:month
				group by  salesPersonId,productId),0)
			 as stocks,
				IFNULL((SELECT sum(quantity) total FROM Commission.sales
				where productId =3
				and salesPersonId = user.name
				and YEAR(saleDate)=:year
				and MONTH(saleDate)=:month
				group by  salesPersonId,productId),0)
			 as barrels
				FROM user
			where name =:userName;
			");

		$result->bindParam(':userName', $data->userName, PDO::PARAM_STR);
		$result->bindParam(':year', $data->year, PDO::PARAM_INT);
		$result->bindParam(':month', $data->month, PDO::PARAM_INT);
		
		$result->execute();
		return $result->fetchAll(PDO::FETCH_ASSOC);	
	}


/*
======= GET =======
*/
	private function getCities()
	{
		global $db;

		$result = $db->prepare("
			SELECT
				*
			FROM
				city
			");

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








	
}
?>