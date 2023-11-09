-- MariaDB dump 10.19-11.1.2-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: lportal_ent
-- ------------------------------------------------------
-- Server version	11.1.2-MariaDB-1:11.1.2+maria~ubu2204

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Agenda_Event`
--

DROP TABLE IF EXISTS `Agenda_Event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Agenda_Event` (
  `eventId` int(11) NOT NULL,
  `companyId` int(11) DEFAULT NULL,
  `startDate` datetime DEFAULT NULL,
  `endDate` datetime DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `authorId` int(11) DEFAULT NULL,
  PRIMARY KEY (`eventId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Agenda_Event`
--

LOCK TABLES `Agenda_Event` WRITE;
/*!40000 ALTER TABLE `Agenda_Event` DISABLE KEYS */;
INSERT INTO `Agenda_Event` VALUES
(566301,20097,'2023-11-02 11:00:50','2023-11-05 11:00:00','Évènement pour tous les personnels','<html>\n <head></head>\n<body>\n <p>Contenu de l\'évènement pour tous les personnels</p> \n</body></body>\n</html>','Lieu de l\'événement pour tous les personnels',58811),
(566302,20097,'2023-11-02 11:00:12','2023-11-05 11:00:00','Évènement pour tous les élèves','<html>\n <head></head>\n<body>\n <p>Contenu de l\'évènement pour tous les élèves</p> \n</body></body>\n</html>','Lieu de l\'évènement pour tous les élèves',58811);
/*!40000 ALTER TABLE `Agenda_Event` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Agenda_EventPopulation`
--

DROP TABLE IF EXISTS `Agenda_EventPopulation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Agenda_EventPopulation` (
  `eventId` int(11) NOT NULL,
  `groupId` int(11) NOT NULL,
  `roleId` int(11) DEFAULT NULL,
  PRIMARY KEY (`eventId`,`groupId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Agenda_EventPopulation`
--

LOCK TABLES `Agenda_EventPopulation` WRITE;
/*!40000 ALTER TABLE `Agenda_EventPopulation` DISABLE KEYS */;
INSERT INTO `Agenda_EventPopulation` VALUES
(563201,45407,45302),
(563202,45407,45103),
(566001,45407,45302),
(566301,45407,45302),
(566302,45407,45103);
/*!40000 ALTER TABLE `Agenda_EventPopulation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Agenda_EventRead`
--
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Agenda_EventPopulation` (
  `eventId` int(11) NOT NULL,
  `groupId` int(11) NOT NULL,
  `roleId` int(11) DEFAULT NULL,
  PRIMARY KEY (`eventId`,`groupId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Agenda_EventPopulation`
--

LOCK TABLES `Agenda_EventPopulation` WRITE;
/*!40000 ALTER TABLE `Agenda_EventPopulation` DISABLE KEYS */;
INSERT INTO `Agenda_EventPopulation` VALUES
(563201,45407,45302),
(563202,45407,45103),
(566001,45407,45302),
(566301,45407,45302),
(566302,45407,45103);
/*!40000 ALTER TABLE `Agenda_EventPopulation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Agenda_EventRead`
--

DROP TABLE IF EXISTS `Agenda_EventRead`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Agenda_EventRead` (
  `eventId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `readDate` datetime DEFAULT NULL,
  PRIMARY KEY (`eventId`,`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Agenda_EventRead`
--

LOCK TABLES `Agenda_EventRead` WRITE;
/*!40000 ALTER TABLE `Agenda_EventRead` DISABLE KEYS */;
INSERT INTO `Agenda_EventRead` VALUES
(563201,58811,'2023-10-31 09:10:21'),
(563202,58811,'2023-10-31 09:12:21'),
(566001,58811,'2023-11-02 09:40:28'),
(566301,45567,'2023-11-06 11:12:11'),
(566301,58811,'2023-11-02 10:00:50'),
(566302,58811,'2023-11-02 10:02:12');
/*!40000 ALTER TABLE `Agenda_EventRead` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserNotificationEvent`
--

DROP TABLE IF EXISTS `UserNotificationEvent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `UserNotificationEvent` (
  `mvccVersion` bigint(20) NOT NULL DEFAULT 0,
  `uuid_` varchar(75) DEFAULT NULL,
  `userNotificationEventId` bigint(20) NOT NULL,
  `companyId` bigint(20) DEFAULT NULL,
  `userId` bigint(20) DEFAULT NULL,
  `type_` varchar(200) DEFAULT NULL,
  `timestamp` bigint(20) DEFAULT NULL,
  `deliveryType` int(11) DEFAULT NULL,
  `deliverBy` bigint(20) DEFAULT NULL,
  `delivered` tinyint(4) DEFAULT NULL,
  `payload` longtext DEFAULT NULL,
  `actionRequired` tinyint(4) DEFAULT NULL,
  `archived` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`userNotificationEventId`),
  KEY `IX_BF29100B` (`type_`),
  KEY `IX_5CE95F03` (`userId`,`actionRequired`,`archived`),
  KEY `IX_3DBB361A` (`userId`,`archived`),
  KEY `IX_9D34232F` (`userId`,`delivered`,`actionRequired`,`archived`),
  KEY `IX_BD8BD246` (`userId`,`delivered`,`archived`),
  KEY `IX_C4EFBD45` (`userId`,`deliveryType`,`actionRequired`,`archived`),
  KEY `IX_A87A585C` (`userId`,`deliveryType`,`archived`),
  KEY `IX_4BF3A7AD` (`userId`,`deliveryType`,`delivered`,`actionRequired`,`archived`),
  KEY `IX_93012C4` (`userId`,`deliveryType`,`delivered`,`archived`),
  KEY `IX_7AFE83D7` (`userId`,`type_`,`deliveryType`,`delivered`,`archived`),
  KEY `IX_A6BAFDFE` (`uuid_`,`companyId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserNotificationEvent`
--

LOCK TABLES `UserNotificationEvent` WRITE;
/*!40000 ALTER TABLE `UserNotificationEvent` DISABLE KEYS */;
/*!40000 ALTER TABLE `UserNotificationEvent` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-11-06 11:13:11