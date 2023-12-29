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
-- Table structure for table `Course_ContentBlock`
--

DROP TABLE IF EXISTS `Course_ContentBlock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Course_ContentBlock` (
  `blockId` bigint(20) NOT NULL,
  `courseItemId` bigint(20) DEFAULT NULL,
  `modificationDate` datetime(6) DEFAULT NULL,
  `blockName` varchar(255) DEFAULT NULL,
  `blockValue` longtext DEFAULT NULL,
  `fileEntryId` bigint(20) DEFAULT NULL,
  `blockType` int(11) DEFAULT NULL,
  `order_` int(11) DEFAULT NULL,
  PRIMARY KEY (`blockId`),
  KEY `IX_9EB6B1BB` (`courseItemId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Course_ContentBlock`
--

LOCK TABLES `Course_ContentBlock` WRITE;
/*!40000 ALTER TABLE `Course_ContentBlock` DISABLE KEYS */;
/*!40000 ALTER TABLE `Course_ContentBlock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Course_Homework`
--

DROP TABLE IF EXISTS `Course_Homework`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Course_Homework` (
  `homeworkId` bigint(20) NOT NULL,
  `homeworkType` int(11) DEFAULT NULL,
  `courseId` bigint(20) DEFAULT NULL,
  `teacherId` bigint(20) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `modificationDate` datetime(6) DEFAULT NULL,
  `sourceSessionId` bigint(20) DEFAULT NULL,
  `targetSessionId` bigint(20) DEFAULT NULL,
  `targetDate` datetime(6) DEFAULT NULL,
  `isCustomStudentList` tinyint(4) DEFAULT NULL,
  `estimatedTime` int(11) DEFAULT NULL,
  `publicationDate` datetime(6) DEFAULT NULL,
  `isDraft` tinyint(4) DEFAULT NULL,
  `isCorrectionSent` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`homeworkId`),
  KEY `IX_4066B264` (`courseId`),
  KEY `IX_B8BB608C` (`sourceSessionId`),
  KEY `IX_41BFF156` (`targetSessionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Course_Homework`
--

LOCK TABLES `Course_Homework` WRITE;
/*!40000 ALTER TABLE `Course_Homework` DISABLE KEYS */;
/*!40000 ALTER TABLE `Course_Homework` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Course_StudentHomework`
--

DROP TABLE IF EXISTS `Course_StudentHomework`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Course_StudentHomework` (
  `studentHomeworkId` bigint(20) NOT NULL,
  `homeworkId` bigint(20) DEFAULT NULL,
  `studentId` bigint(20) DEFAULT NULL,
  `isDone` tinyint(4) DEFAULT NULL,
  `isSent` tinyint(4) DEFAULT NULL,
  `sentDate` datetime(6) DEFAULT NULL,
  `sentFileId` bigint(20) DEFAULT NULL,
  `isCorrected` tinyint(4) DEFAULT NULL,
  `comment_` longtext DEFAULT NULL,
  `correctionDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`studentHomeworkId`),
  KEY `IX_4783238C` (`homeworkId`),
  KEY `IX_5366EAF8` (`studentId`,`homeworkId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Course_StudentHomework`
--

LOCK TABLES `Course_StudentHomework` WRITE;
/*!40000 ALTER TABLE `Course_StudentHomework` DISABLE KEYS */;
/*!40000 ALTER TABLE `Course_StudentHomework` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-11-06 15:32:08