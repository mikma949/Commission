<?php

require_once("RestRoute-class.inc");

/**
* RestRouteOrder:
*/
class RestRouteOrder extends RestRoute
{
	function put($p, $data)
	{
		if ($p[0] == "createOrder")
		{
			return $this->createOrder($data);
		}
		elseif ($p[0] == "createItem")
		{
			return $this->createItem($data);
		}
		elseif ($p[0] == "getUserOrders")
		{
			return $this->getUserOrders($data);
		}
		elseif ($p[0] == "getItem")
		{
			return $this->getItem($data);
		}
		elseif ($p[0] == "getAllOrders")
		{
			return $this->getAllOrders($data);
		}	
		return false;
	}

	private function createOrder($data)
	{
		global $db;

		$result = $db->prepare("
			INSERT INTO 
			ordertable (buyerId,itemId,maxPrice) 
			values (:userName,:itemId,:maxPrice);
			");

		$result->bindParam(':userName', $data->userName, PDO::PARAM_STR);
		$result->bindParam(':itemId', $data->itemId, PDO::PARAM_INT);
		$result->bindParam(':maxPrice', $data->maxPrice, PDO::PARAM_INT);
		$result->execute();
		return $result;
	}

	private function createItem($data)
	{
		global $db;

		$result = $db->prepare("
			INSERT INTO 
			items (brand,model,year,milage,color) 
			VALUES (:brand,:model,:year,:milage,:color);
			");

		$result->bindParam(':brand', $data->brand, PDO::PARAM_STR);
		$result->bindParam(':model', $data->model, PDO::PARAM_STR);
		$result->bindParam(':year', $data->year, PDO::PARAM_STR);
		$result->bindParam(':milage', $data->milage, PDO::PARAM_STR);
		$result->bindParam(':color', $data->color, PDO::PARAM_STR);
		$result->execute();

		$result = $db->query("
			SELECT id 
			FROM items
			ORDER BY id DESC
			LIMIT 1");
		return $result->fetchAll(PDO::FETCH_ASSOC);
	}

	private function getUserOrders($data)
	{
		global $db;

		$result = $db->prepare("
			SELECT
			hasFinalized,isReserved,bidId,IFNULL(bid,'NO BID') bid, IFNULL(seller,'NO SELLER') seller, buyer, id, color , brand , model, milage, year
			FROM 
				(SELECT 
					bid.hasFinalized hasFinalized,bid.isReserved isReserved ,bid.id bidId, bid.amount bid,bid.sellerId seller, ordertable.buyerId buyer, items.id id, items.color color, items.brand brand, items.model model, items.milage milage, items.year year 
				
				FROM items
				LEFT JOIN ordertable 
					ON ordertable.itemId=items.id
				LEFT JOIN bid 
					ON bid.orderId=ordertable.id

				ORDER BY
					bid.amount) as x
			WHERE 
					x.buyer=:userId
					AND 
					x.bid>0 
				OR 
					x.buyer=:userId
					AND  
					x.bid IS NULL
			GROUP BY x.id;
			");

		$result->bindParam(':userId', $data->userId, PDO::PARAM_INT);
		$result->execute();
		return $result->fetchAll(PDO::FETCH_ASSOC);
	}
	
	private function getAllOrders($data)
	{
	global $db;

		$result = $db->prepare("
			SELECT 
				ordertable.id orderId,ordertable.buyerId buyer,items.brand brand,items.model model,items.year year,items.milage milage,items.color color,ordertable.maxPrice maxPrice, IFNULL(min(bid.amount),'NO BID') bid 
			FROM items
			LEFT JOIN ordertable 
				ON ordertable.itemId=items.id
			LEFT JOIN bid 
				ON bid.orderId=ordertable.id
			WHERE 
					(bid.amount>0 
				OR   
					bid.amount IS NULL)
				AND
					ordertable.buyerId<>:userId
				AND
					(bid.hasFinalized=0
					OR
					bid.hasFinalized IS NULL)
			GROUP BY items.id;
			");

		$result->bindParam(':userId', $data->userId, PDO::PARAM_STR);
		$result->execute();
		return $result->fetchAll(PDO::FETCH_ASSOC);
		
	}
}

?>