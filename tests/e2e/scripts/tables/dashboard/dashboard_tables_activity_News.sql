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
-- Table structure for table `News_News`
--

DROP TABLE IF EXISTS `News_News`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `News_News` (
  `newsId` bigint(20) NOT NULL,
  `companyId` bigint(20) DEFAULT NULL,
  `title` varchar(75) DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `authorId` bigint(20) DEFAULT NULL,
  `isSchoolNews` tinyint(4) DEFAULT NULL,
  `isImportant` tinyint(4) DEFAULT NULL,
  `expirationDate` datetime(6) DEFAULT NULL,
  `publicationDate` datetime(6) DEFAULT NULL,
  `modificationDate` datetime(6) DEFAULT NULL,
  `imageId` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`newsId`),
  KEY `IX_419F9BFF` (`authorId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `News_News`
--

LOCK TABLES `News_News` WRITE;
/*!40000 ALTER TABLE `News_News` DISABLE KEYS */;
INSERT INTO `News_News` VALUES
(545275,20097,'Information à tous les élèves','<html>\n <head></head>\n<body>\n <p>contenu de cette information</p> \n</body></body>\n</html>',45479,0,0,'2024-06-29 23:59:59.000000','2023-11-03 15:15:00.000000','2023-11-03 14:24:46.396000',0),
(553401,20097,'Information avec une date de parution ultérieure','<html>\n <head></head>\n<body>\n <p>Contenu de l\'information avec une date de parution ultérieure</p> \n</body></body>\n</html>',45479,0,0,'2024-06-29 23:59:59.000000','2023-11-30 11:15:00.000000','2023-11-08 10:22:04.316000',0);
/*!40000 ALTER TABLE `News_News` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `News_NewsAttachedFile`
--

DROP TABLE IF EXISTS `News_NewsAttachedFile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `News_NewsAttachedFile` (
  `newsFileId` bigint(20) NOT NULL,
  `newsId` bigint(20) DEFAULT NULL,
  `groupId` bigint(20) DEFAULT NULL,
  `fileId` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`newsFileId`),
  KEY `IX_8B3796A3` (`newsId`,`groupId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `News_NewsAttachedFile`
--

LOCK TABLES `News_NewsAttachedFile` WRITE;
/*!40000 ALTER TABLE `News_NewsAttachedFile` DISABLE KEYS */;
/*!40000 ALTER TABLE `News_NewsAttachedFile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `News_NewsPopulation`
--

DROP TABLE IF EXISTS `News_NewsPopulation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `News_NewsPopulation` (
  `newsId` bigint(20) NOT NULL,
  `groupId` bigint(20) NOT NULL,
  `roleId` bigint(20) NOT NULL,
  `schoolId` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`newsId`,`groupId`,`roleId`),
  KEY `IX_637D161D` (`groupId`,`roleId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `News_NewsPopulation`
--

LOCK TABLES `News_NewsPopulation` WRITE;
/*!40000 ALTER TABLE `News_NewsPopulation` DISABLE KEYS */;
INSERT INTO `News_NewsPopulation` VALUES
(545275,55984,45103,NULL),
(553401,55984,45103,NULL);
/*!40000 ALTER TABLE `News_NewsPopulation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `News_NewsRead`
--

DROP TABLE IF EXISTS `News_NewsRead`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `News_NewsRead` (
  `newsId` bigint(20) NOT NULL,
  `userId` bigint(20) NOT NULL,
  `readDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`newsId`,`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `News_NewsRead`
--

LOCK TABLES `News_NewsRead` WRITE;
/*!40000 ALTER TABLE `News_NewsRead` DISABLE KEYS */;
INSERT INTO `News_NewsRead` VALUES
(545275,45479,'2023-11-03 14:08:31.828000'),
(553401,45479,'2023-11-08 10:22:04.317000');
/*!40000 ALTER TABLE `News_NewsRead` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User_NewsAdmin`
--

DROP TABLE IF EXISTS `User_NewsAdmin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `User_NewsAdmin` (
  `newsAdminId` bigint(20) NOT NULL,
  `userId` bigint(20) DEFAULT NULL,
  `schoolId` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`newsAdminId`),
  KEY `IX_B15DFFF1` (`schoolId`),
  KEY `IX_EEC00C8` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User_NewsAdmin`
--

LOCK TABLES `User_NewsAdmin` WRITE;
/*!40000 ALTER TABLE `User_NewsAdmin` DISABLE KEYS */;
INSERT INTO `User_NewsAdmin` VALUES
(466184,52216,45405),
(546511,45479,45405);
/*!40000 ALTER TABLE `User_NewsAdmin` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-11-22  7:52:51