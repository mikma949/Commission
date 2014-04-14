CREATE DATABASE  IF NOT EXISTS `Commission` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `Commission`;
-- MySQL dump 10.13  Distrib 5.6.13, for Win32 (x86)
--
-- Host: 127.0.0.1    Database: Commission
-- ------------------------------------------------------
-- Server version	5.6.16

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `city`
--

DROP TABLE IF EXISTS `city`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `city` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `city`
--

LOCK TABLES `city` WRITE;
/*!40000 ALTER TABLE `city` DISABLE KEYS */;
INSERT INTO `city` VALUES (1,'Harbin'),(2,'Beijing'),(3,'Stockholm');
/*!40000 ALTER TABLE `city` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `commission`
--

DROP TABLE IF EXISTS `commission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `commission` (
  `id` int(11) NOT NULL,
  `boundry` int(11) NOT NULL,
  `percent` decimal(4,3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `commission`
--

LOCK TABLES `commission` WRITE;
/*!40000 ALTER TABLE `commission` DISABLE KEYS */;
INSERT INTO `commission` VALUES (1,0,0.100),(2,1000,0.150),(3,1800,0.200);
/*!40000 ALTER TABLE `commission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `price` int(11) NOT NULL,
  `maxAmount` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (1,'Lock',45,70),(2,'Stock',30,80),(3,'Barrel',25,90);
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `report`
--

DROP TABLE IF EXISTS `report`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `report` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `year` int(11) NOT NULL,
  `month` int(11) NOT NULL,
  `salesPerson` varchar(45) NOT NULL,
  `locksSold` int(11) NOT NULL,
  `stocksSold` int(11) NOT NULL,
  `barrelsSold` int(11) NOT NULL,
  `totalSales` int(11) NOT NULL,
  `commission` float NOT NULL,
  `reported` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `year_month` (`year`,`month`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `report`
--

LOCK TABLES `report` WRITE;
/*!40000 ALTER TABLE `report` DISABLE KEYS */;
INSERT INTO `report` VALUES (1,2000,12,'a',1,1,1,1,1,1),(2,2000,1,'pelle',1,1,1,1,1,1);
/*!40000 ALTER TABLE `report` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `position` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES (1,'new employee'),(2,'sales person'),(3,'manager'),(4,'administrator');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sales`
--

DROP TABLE IF EXISTS `sales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sales` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `saleDate` date NOT NULL,
  `salesPersonId` varchar(45) NOT NULL,
  `cityId` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_salesPerson_idx` (`salesPersonId`)
) ENGINE=InnoDB AUTO_INCREMENT=148 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales`
--

LOCK TABLES `sales` WRITE;
/*!40000 ALTER TABLE `sales` DISABLE KEYS */;
INSERT INTO `sales` VALUES (1,'2000-01-01','Micke',0,1,1),(2,'2000-01-01','Micke',0,2,2),(3,'2000-01-01','Micke',0,3,3),(4,'2000-01-01','Micke',0,1,1),(5,'2000-01-01','Micke',0,2,2),(6,'2000-01-01','Micke',0,3,3),(7,'2000-01-01','Micke',0,1,1),(8,'2000-01-01','Micke',0,2,2),(9,'2000-01-01','Micke',0,3,3),(10,'2000-01-01','Micke',0,1,1),(11,'2000-01-01','Micke',0,2,2),(12,'2000-01-01','Micke',0,3,3),(13,'2000-01-01','Micke',0,1,1),(14,'2000-01-01','Micke',0,2,2),(15,'2000-01-01','Micke',0,3,3),(16,'2000-12-01','Micke',0,1,1),(17,'2000-12-01','Micke',0,2,2),(18,'2000-12-01','Micke',0,3,3),(19,'2000-12-01','Albin',1,1,1),(20,'2000-12-01','Albin',1,2,1),(21,'2000-12-01','Albin',1,3,1),(22,'2000-12-01','Albin',2,1,1),(23,'2000-12-01','Albin',2,2,1),(24,'2000-12-01','Albin',2,3,1),(25,'0000-00-00','pelle',0,1,1),(26,'0000-00-00','pelle',0,2,2),(27,'0000-00-00','pelle',0,3,3),(28,'2000-12-01','pelle',0,1,1),(29,'2000-12-01','pelle',0,2,2),(30,'2000-12-01','pelle',0,3,3),(31,'2000-12-01','pelle',0,1,1),(32,'2000-12-01','pelle',0,2,2),(33,'2000-12-01','pelle',0,3,3),(34,'2000-12-01','Micke',0,1,1),(35,'2000-12-01','Micke',0,2,2),(36,'2000-12-01','Micke',0,3,3),(37,'0000-00-00','a',0,1,1),(38,'0000-00-00','a',0,2,1),(39,'0000-00-00','a',0,3,1),(40,'0000-00-00','a',0,1,1),(41,'0000-00-00','a',0,2,1),(42,'0000-00-00','a',0,3,1),(43,'0000-00-00','a',0,1,1),(44,'0000-00-00','a',0,2,1),(45,'0000-00-00','a',0,3,1),(46,'0000-00-00','a',0,1,1),(47,'0000-00-00','a',0,2,1),(48,'0000-00-00','a',0,3,1),(49,'2000-01-01','a',0,1,1),(50,'2000-01-01','a',0,2,1),(51,'2000-01-01','a',0,3,1),(52,'2000-12-01','Micke',0,1,1),(53,'2000-12-01','Micke',0,2,2),(54,'2000-12-01','Micke',0,3,3),(55,'2000-01-01','a',0,1,1),(56,'2000-01-01','a',0,2,1),(57,'2000-01-01','a',0,3,1),(58,'2000-12-12','a',0,1,1),(59,'2000-12-12','a',0,2,1),(60,'2000-12-12','a',0,3,1),(61,'2000-12-12','a',0,1,1),(62,'2000-12-12','a',0,2,1),(63,'2000-12-12','a',0,3,1),(64,'2000-01-01','a',0,1,1),(65,'2000-01-01','a',0,2,1),(66,'2000-01-01','a',0,3,1),(67,'2000-12-12','a',0,1,10),(68,'2000-12-12','a',0,2,10),(69,'2000-12-12','a',0,3,10),(70,'2000-12-12','a',0,1,10),(71,'2000-12-12','a',0,2,10),(72,'2000-12-12','a',0,3,10),(73,'2000-12-12','a',0,1,10),(74,'2000-12-12','a',0,2,10),(75,'2000-12-12','a',0,3,10),(76,'2000-12-12','a',0,1,10),(77,'2000-12-12','a',0,2,10),(78,'2000-12-12','a',0,3,10),(79,'2000-12-12','a',0,1,10),(80,'2000-12-12','a',0,2,10),(81,'2000-12-12','a',0,3,10),(82,'2000-12-12','a',0,1,10),(83,'2000-12-12','a',0,2,10),(84,'2000-12-12','a',0,3,10),(85,'2000-12-12','a',0,1,10),(86,'2000-12-12','a',0,2,10),(87,'2000-12-12','a',0,3,10),(88,'2000-12-12','a',0,1,10),(89,'2000-12-12','a',0,2,10),(90,'2000-12-12','a',0,3,10),(91,'2000-12-12','a',0,1,10),(92,'2000-12-12','a',0,2,10),(93,'2000-12-12','a',0,3,10),(94,'2000-12-12','a',0,1,10),(95,'2000-12-12','a',0,2,10),(96,'2000-12-12','a',0,3,10),(97,'2000-12-12','a',0,1,10),(98,'2000-12-12','a',0,2,10),(99,'2000-12-12','a',0,3,10),(100,'2000-01-01','a',0,1,1),(101,'2000-01-01','a',0,2,1),(102,'2000-01-01','a',0,3,0),(103,'2000-01-01','a',0,1,1),(104,'2000-01-01','a',0,2,1),(105,'2000-01-01','a',0,3,0),(106,'2000-01-01','a',0,1,1),(107,'2000-01-01','a',0,2,1),(108,'2000-01-01','a',0,3,1),(109,'2000-01-01','a',0,1,1),(110,'2000-01-01','a',0,2,1),(111,'2000-01-01','a',0,3,1),(112,'2000-01-01','a',0,1,1),(113,'2000-01-01','a',0,2,1),(114,'2000-01-01','a',0,3,1),(115,'2000-01-01','a',0,1,1),(116,'2000-01-01','a',0,2,1),(117,'2000-01-01','a',0,3,1),(118,'2000-01-01','a',0,1,1),(119,'2000-01-01','a',0,2,1),(120,'2000-01-01','a',0,3,1),(121,'2000-01-01','a',0,1,1),(122,'2000-01-01','a',0,2,1),(123,'2000-01-01','a',0,3,1),(124,'2000-01-01','a',0,1,1),(125,'2000-01-01','a',0,2,1),(126,'2000-01-01','a',0,3,1),(127,'2000-01-01','a',0,1,1),(128,'2000-01-01','a',0,2,1),(129,'2000-01-01','a',0,3,1),(130,'2000-01-01','a',0,1,1),(131,'2000-01-01','a',0,2,1),(132,'2000-01-01','a',0,3,1),(133,'2000-01-01','a',0,1,1),(134,'2000-01-01','a',0,2,1),(135,'2000-01-01','a',0,3,1),(136,'2000-01-01','a',0,1,1),(137,'2000-01-01','a',0,2,1),(138,'2000-01-01','a',0,3,1),(139,'2000-01-01','a',0,1,1),(140,'2000-01-01','a',0,2,1),(141,'2000-01-01','a',0,3,1),(142,'2000-01-01','a',0,1,1),(143,'2000-01-01','a',0,2,1),(144,'2000-01-01','a',0,3,1),(145,'2000-01-01','a',0,1,1),(146,'2000-01-01','a',0,2,1),(147,'2000-01-01','a',0,3,1);
/*!40000 ALTER TABLE `sales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `name` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  `role` int(11) NOT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('a','97',1),('Albin','f0d7738a4515fb57ae41da4ede014b7a',2),('b','98',2),('Fredrik','875b9fc5c8b60d689717e465f2ef28bb',1),('Micke','7214140f65353ffce02103596fc6d004',4),('pelle','106550480',4);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2014-04-14  9:23:21
