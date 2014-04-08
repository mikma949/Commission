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
		elseif ($p[0] == "reserve")
		{
			return $this->reserve($data);
		}
		elseif ($p[0] == "finalizeDeal")
		{
			return $this->finalizeDeal($data);
		}
		elseif ($p[0] == "getLowest")
		{
			return $this->getLowest($data);
		}
		return false;
	}

	private function place($data)
	{
		global $db;

		$result = $db->prepare("
			INSERT INTO 
				bid (orderId,sellerId,amount)
			VALUES
				(:orderId,:sellerId,:bid)
			");

		$result->bindParam(':bid', $data->bid, PDO::PARAM_STR);
		$result->bindParam(':orderId', $data->orderId, PDO::PARAM_STR);
		$result->bindParam(':sellerId', $data->sellerId, PDO::PARAM_STR);
		$result->execute();
		return $result;
	}

	private function reserve($data)
	{
		global $db;

		$result = $db->prepare("
			UPDATE 
				bid 
			SET
				isReserved='1'
			WHERE
				id=:bidId
			");

		$result->bindParam(':bidId', $data->bidId, PDO::PARAM_INT);
		$result->execute();
		return $result;
	}

	private function finalizeDeal($data)
	{
		global $db;

		$result = $db->prepare("
			UPDATE 
				bid 
			SET
				isReserved='1',hasFinalized='1'
			WHERE
				id=:bidId
			");

		$result->bindParam(':bidId', $data->bidId, PDO::PARAM_STR);
		$result->execute();

		//Deleting all other bids for the specific order
		$result = $db->prepare("
			DELETE FROM
				bid
			WHERE 
				orderId=:orderId
			AND
				NOT id=:bidId
			");

		$result->bindParam(':bidId', $data->bidId, PDO::PARAM_STR);
		$result->bindParam(':orderId', $data->orderId, PDO::PARAM_STR);
		$result->execute();

		return $result;
	}

	private function getLowest($data)
	{
		global $db;

		$result = $db->prepare("
			SELECT 
				min(amount) AS bid 
			FROM 
				bid
			WHERE 
				orderId=:orderId
			");
		$result->bindParam(':orderId', $data->orderId, PDO::PARAM_INT);
		$result->execute();
		return $result->fetchAll(PDO::FETCH_ASSOC);
	}
}
?>