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
-- Table structure for table `Agenda_EventPopulation`
--

DROP TABLE IF EXISTS `Agenda_EventPopulation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Agenda_EventPopulation` (
  `eventId` bigint(20) NOT NULL,
  `groupId` bigint(20) NOT NULL,
  `roleId` bigint(20) NOT NULL,
  `schoolId` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`eventId`,`groupId`,`roleId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Agenda_EventPopulation`
--

LOCK TABLES `Agenda_EventPopulation` WRITE;
/*!40000 ALTER TABLE `Agenda_EventPopulation` DISABLE KEYS */;
INSERT INTO `Agenda_EventPopulation` VALUES
(553802,45407,45302,45405),
(553803,45407,45302,45405),
(553903,45407,45302,45405),
(553906,45407,45302,45405),
(554001,45407,45302,45405),
(554101,45407,45302,45405),
(554104,45407,45302,45405),
(554204,45407,45302,45405),
(554301,45407,45302,45405),
(554302,45407,45302,45405),
(554303,45407,45302,45405),
(554304,45407,45302,45405),
(554305,45407,45302,45405),
(554306,45407,45302,45405),
(554307,45407,45302,45405);
/*!40000 ALTER TABLE `Agenda_EventPopulation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Agenda_EventRead`
--

DROP TABLE IF EXISTS `Agenda_EventRead`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Agenda_EventRead` (
  `eventId` bigint(20) NOT NULL,
  `userId` bigint(20) NOT NULL,
  `readDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`eventId`,`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Agenda_EventRead`
--

LOCK TABLES `Agenda_EventRead` WRITE;
/*!40000 ALTER TABLE `Agenda_EventRead` DISABLE KEYS */;
INSERT INTO `Agenda_EventRead` VALUES
(553802,58811,'2023-11-22 09:47:10.141000'),
(553803,58811,'2023-11-22 09:47:17.090000'),
(553903,58811,'2023-11-22 09:47:29.296000'),
(553906,58811,'2023-11-22 09:47:35.188000'),
(554001,58811,'2023-11-22 09:47:40.639000'),
(554101,58811,'2023-11-22 09:47:53.428000'),
(554104,58811,'2023-11-22 09:48:01.087000'),
(554204,58811,'2023-11-22 09:48:23.287000'),
(554301,58811,'2023-11-22 09:49:12.224000'),
(554302,58811,'2023-11-22 09:49:21.872000'),
(554303,58811,'2023-11-22 09:49:29.650000'),
(554304,58811,'2023-11-22 09:49:36.508000'),
(554305,58811,'2023-11-22 09:49:43.198000'),
(554306,58811,'2023-11-22 09:49:50.948000'),
(554307,58811,'2023-11-22 09:50:01.163000');
/*!40000 ALTER TABLE `Agenda_EventRead` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Agenda_Event`
--

DROP TABLE IF EXISTS `Agenda_Event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Agenda_Event` (
  `eventId` bigint(20) NOT NULL,
  `companyId` bigint(20) DEFAULT NULL,
  `startDate` datetime(6) DEFAULT NULL,
  `endDate` datetime(6) DEFAULT NULL,
  `title` varchar(75) DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  `location` varchar(75) DEFAULT NULL,
  `authorId` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`eventId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Agenda_Event`
--

LOCK TABLES `Agenda_Event` WRITE;
/*!40000 ALTER TABLE `Agenda_Event` DISABLE KEYS */;
INSERT INTO `Agenda_Event` VALUES
(553802,20097,'2023-11-22 10:45:10.140000','2023-11-22 11:00:00.000000','1','<html>\n <head></head>\n<body>\n <p>1</p> \n</body></body>\n</html>','1',58811),
(553803,20097,'2023-11-22 10:45:17.089000','2023-11-22 11:00:00.000000','2','<html>\n <head></head>\n<body>\n <p>2</p> \n</body></body>\n</html>','2',58811),
(553903,20097,'2023-11-22 10:45:29.295000','2023-11-22 11:00:00.000000','3','<html>\n <head></head>\n<body>\n <p>3</p> \n</body></body>\n</html>','3',58811),
(553906,20097,'2023-11-22 10:45:35.187000','2023-11-22 11:00:00.000000','4','<html>\n <head></head>\n<body>\n <p>4</p> \n</body></body>\n</html>','4',58811),
(554001,20097,'2023-11-22 10:45:40.637000','2023-11-22 11:00:00.000000','5','<html>\n <head></head>\n<body>\n <p>5</p> \n</body></body>\n</html>','5',58811),
(554101,20097,'2023-11-22 10:45:53.424000','2023-11-22 11:00:00.000000','6','<html>\n <head></head>\n<body>\n <p>6</p> \n</body></body>\n</html>','6',58811),
(554104,20097,'2023-11-22 10:45:01.086000','2023-11-22 11:00:00.000000','7','<html>\n <head></head>\n<body>\n <p>7</p> \n</body></body>\n</html>','7',58811),
(554204,20097,'2023-11-22 10:45:23.285000','2023-11-22 11:00:00.000000','8','<html>\n <head></head>\n<body>\n <p>8</p> \n</body></body>\n</html>','8',58811),
(554301,20097,'2023-11-22 10:45:12.223000','2023-11-22 11:00:00.000000','9','<html>\n <head></head>\n<body>\n <p>9</p> \n</body></body>\n</html>','9',58811),
(554302,20097,'2023-11-22 10:45:21.871000','2023-11-22 11:00:00.000000','10','<html>\n <head></head>\n<body>\n <p>10</p> \n</body></body>\n</html>','10',58811),
(554303,20097,'2023-11-22 10:45:29.649000','2023-11-22 11:00:00.000000','11','<html>\n <head></head>\n<body>\n <p>11</p> \n</body></body>\n</html>','11',58811),
(554304,20097,'2023-11-22 10:45:36.506000','2023-11-22 11:00:00.000000','12','<html>\n <head></head>\n<body>\n <p>12</p> \n</body></body>\n</html>','12',58811),
(554305,20097,'2023-11-22 10:45:43.194000','2023-11-22 11:00:00.000000','13','<html>\n <head></head>\n<body>\n <p>13</p> \n</body></body>\n</html>','13',58811),
(554306,20097,'2023-11-22 10:45:50.947000','2023-11-22 11:00:00.000000','14','<html>\n <head></head>\n<body>\n <p>14</p> \n</body></body>\n</html>','14',58811),
(554307,20097,'2023-11-22 10:45:01.161000','2023-11-22 11:00:00.000000','15','<html>\n <head></head>\n<body>\n <p>15</p> \n</body></body>\n</html>','15',58811);
/*!40000 ALTER TABLE `Agenda_Event` ENABLE KEYS */;
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

-- Dump completed on 2023-11-22  9:51:20