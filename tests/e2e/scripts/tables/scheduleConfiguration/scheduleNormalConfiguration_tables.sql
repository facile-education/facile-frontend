-- MariaDB dump 10.19  Distrib 10.6.12-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: 127.0.0.1    Database: ent_gve
-- ------------------------------------------------------
-- Server version	10.6.12-MariaDB-0ubuntu0.22.04.1

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
-- Table structure for table `Schedule_ScheduleConfiguration`
--

DROP TABLE IF EXISTS `Schedule_ScheduleConfiguration`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Schedule_ScheduleConfiguration` (
  `configId` bigint(20) NOT NULL,
  `projectStartDate` datetime(6) DEFAULT NULL,
  `schoolYearStartDate` datetime(6) DEFAULT NULL,
  `schoolYearSemesterDate` datetime(6) DEFAULT NULL,
  `schoolYearEndDate` datetime(6) DEFAULT NULL,
  `h1Weeks` varchar(75) DEFAULT NULL,
  `h2Weeks` varchar(75) DEFAULT NULL,
  PRIMARY KEY (`configId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Schedule_ScheduleConfiguration`
--

LOCK TABLES `Schedule_ScheduleConfiguration` WRITE;
/*!40000 ALTER TABLE `Schedule_ScheduleConfiguration` DISABLE KEYS */;
INSERT INTO `Schedule_ScheduleConfiguration` VALUES (0,'2020-09-01 00:00:00.000000','2023-08-21 00:00:00.000000','2024-01-19 00:00:00.000000','2024-06-29 23:59:59.000000','34,36,38,40,42,45,47,49,51,3,5,7,10,12,16,18,20,22,24,26','35,37,39,41,44,46,48,50,2,4,6,9,11,13,17,19,21,23,25');
/*!40000 ALTER TABLE `Schedule_ScheduleConfiguration` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Schedule_SlotConfiguration`
--

DROP TABLE IF EXISTS `Schedule_SlotConfiguration`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Schedule_SlotConfiguration` (
  `schoolId` bigint(20) NOT NULL,
  `slotNumber` int(11) NOT NULL,
  `sessionStartHour` varchar(75) DEFAULT NULL,
  `sessionEndHour` varchar(75) DEFAULT NULL,
  PRIMARY KEY (`schoolId`,`slotNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Schedule_SlotConfiguration`
--

LOCK TABLES `Schedule_SlotConfiguration` WRITE;
/*!40000 ALTER TABLE `Schedule_SlotConfiguration` DISABLE KEYS */;
INSERT INTO `Schedule_SlotConfiguration` VALUES (45405,1,'07:55','08:40'),(45405,2,'08:45','09:30'),(45405,3,'09:35','10:20'),(45405,4,'10:35','11:20'),(45405,5,'11:25','12:10'),(45405,6,'12:50','13:35'),(45405,7,'13:45','14:30'),(45405,8,'14:35','15:15'),(45405,9,'15:30','16:15'),(45405,10,'16:20','17:05'),(45405,11,'17:10','17:55'),(75262,1,'07:40','08:25'),(75262,2,'08:30','09:15'),(75262,3,'09:20','10:05'),(75262,4,'10:20','11:05'),(75262,5,'11:10','11:55'),(75262,6,'12:00','12:45'),(75262,7,'12:50','13:35'),(75262,8,'13:40','14:25'),(75262,9,'14:30','15:15'),(75262,10,'15:20','16:05'),(75262,11,'16:10','16:55');
/*!40000 ALTER TABLE `Schedule_SlotConfiguration` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Schedule_Holiday`
--

DROP TABLE IF EXISTS `Schedule_Holiday`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Schedule_Holiday` (
  `holidayId` bigint(20) NOT NULL,
  `name` varchar(75) DEFAULT NULL,
  `startDate` datetime(6) DEFAULT NULL,
  `endDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`holidayId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Schedule_Holiday`
--

LOCK TABLES `Schedule_Holiday` WRITE;
/*!40000 ALTER TABLE `Schedule_Holiday` DISABLE KEYS */;
INSERT INTO `Schedule_Holiday` VALUES (422749,'Jeûne genevois','2023-09-07 00:00:00.000000','2023-09-08 00:00:00.000000'),(422750,'Automne','2023-10-23 00:00:00.000000','2023-10-30 00:00:00.000000'),(422751,'Noël','2023-12-25 00:00:00.000000','2024-01-08 00:00:00.000000'),(422752,'Février','2024-02-19 00:00:00.000000','2024-02-26 00:00:00.000000'),(422753,'Pâques','2024-03-29 00:00:00.000000','2024-04-15 00:00:00.000000'),(422754,'Fête du travail','2024-05-01 00:00:00.000000','2024-05-02 00:00:00.000000'),(422755,'Ascension','2024-05-09 00:00:00.000000','2024-05-13 00:00:00.000000'),(422756,'Pentecôte','2024-05-20 00:00:00.000000','2024-05-21 00:00:00.000000');
/*!40000 ALTER TABLE `Schedule_Holiday` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-12-12 10:24:25
