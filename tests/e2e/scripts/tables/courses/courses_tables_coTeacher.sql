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
INSERT INTO `Course_ContentBlock` VALUES
(546709,546707,'2023-11-06 12:47:39.614000',NULL,'<p>Consigne du second travail à faire</p>',0,1,0),
(546718,546716,'2023-11-06 13:11:58.901000',NULL,'<p>Consigne du travail à faire pour parent multi enfants</p>',0,1,0),
(546816,546814,'2023-11-06 13:43:32.541000',NULL,'<p>Consigne du second travail à faire parent multi enfants</p>',0,1,0),
(547713,547711,'2023-11-06 15:31:57.159000',NULL,'<p>Consigne du second travail à faire</p>',0,1,0),
(555712,547708,'2023-11-06 12:24:04.922000',NULL,'<p>Consigne du travail à faire</p>',0,1,0),
(555713,547708,'2023-11-06 12:24:04.923000','note.html',NULL,555714,5,0),
(555719,547708,'2023-11-06 12:24:05.045000',NULL,'<p>Texte supplémentaire</p>',0,1,0),
(555720,547708,'2023-11-06 12:24:05.045000','Audio pour ce devoir.wav',NULL,555721,2,0),
(555726,547708,'2023-11-06 12:24:05.116000','Lien pour ce devoir','https://www.monlien.com',0,3,0),
(555727,547708,'2023-11-06 12:24:05.117000','Vidéo pour ce devoir','https://www.youtube.com/embed/BQCSn5YMc6s?si=A-9O0fNjGgShqhMN',0,4,0),
(555728,547708,'2023-11-06 12:24:05.117000','H5P pour ce devoir','https://h5p.org/h5p/embed/612',0,6,0),
(569719,111833,'2023-12-04 13:12:00.465000',NULL,'<p>Contenu du support de cours pour la séance du 13/11</p>',0,1,0),
(569720,111833,'2023-12-04 13:12:00.465000','note.html',NULL,569723,5,0),
(569728,111833,'2023-12-04 13:12:00.613000','Audio du support de cours.wav',NULL,569729,2,0),
(569734,111833,'2023-12-04 13:12:00.670000',NULL,'<p>Texte supplémentaire pour le support de cours</p>',0,1,0),
(569735,111833,'2023-12-04 13:12:00.670000','Lien pour le support de cours','https://www.monlien.com',0,3,0),
(569736,111833,'2023-12-04 13:12:00.670000','Vidéo pour le support de cours','https://www.youtube.com/embed/BQCSn5YMc6s?si=hsTugKczcfhNJEMS',0,4,0),
(569737,111833,'2023-12-04 13:12:00.671000','H5P pour le support de cours','https://h5p.org/h5p/embed/612',0,6,0),
(759745,759706,'2023-12-15 11:48:18.485000',NULL,'<p>Contenu de ce travail</p>',0,1,0),
(789703,178587,'2023-12-15 14:43:52.487000',NULL,'<p>Contenu de ce cours avec des co enseignants</p>',0,1,0);
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
INSERT INTO `Course_Homework` VALUES
(546716,1,56480,45479,'Travail à faire parent multi enfants','2023-11-06 13:11:58.897000',119357,119435,'2023-11-10 15:30:00.495000',1,30,'2023-11-06 14:11:00.000000',0,0),
(546814,1,55840,45923,'Second travail à faire parent multi enfants','2023-11-06 13:43:32.538000',220188,220191,'2023-11-28 09:35:00.974000',1,30,'2023-11-06 14:43:00.000000',0,0),
(547708,1,56504,45479,'Travail à faire','2023-11-06 12:24:04.896000',111909,111833,'2023-11-13 11:25:00.750000',1,15,'2023-11-06 13:24:00.000000',0,0),
(547711,1,56504,45479,'Second travail à faire','2023-11-06 15:31:57.158000',111833,111911,'2023-11-14 10:35:00.812000',1,30,'2023-11-06 16:31:00.000000',0,0),
(759706,1,57796,47362,'Travail pour un cours avec des co enseignants','2023-12-15 11:48:18.411000',178587,178497,'2023-12-14 08:45:00.011000',0,0,'2023-12-11 11:48:00.000000',0,0);
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
INSERT INTO `Course_StudentHomework` VALUES
(546708,546707,47461,0,0,NULL,0,0,NULL,NULL),
(546717,546716,45787,0,0,NULL,0,0,NULL,NULL),
(546741,546740,53119,0,0,NULL,0,0,NULL,NULL),
(546796,546795,48166,0,0,NULL,0,0,NULL,NULL),
(546815,546814,48166,0,0,NULL,0,0,NULL,NULL),
(547712,547711,47461,0,0,NULL,0,0,NULL,NULL),
(555711,547708,47461,0,0,NULL,0,0,NULL,NULL),
(759707,759706,52462,0,0,NULL,0,0,NULL,NULL),
(759708,759706,52473,0,0,NULL,0,0,NULL,NULL),
(759709,759706,52484,0,0,NULL,0,0,NULL,NULL),
(759710,759706,52495,0,0,NULL,0,0,NULL,NULL),
(759711,759706,52506,0,0,NULL,0,0,NULL,NULL),
(759712,759706,52517,0,0,NULL,0,0,NULL,NULL),
(759713,759706,52528,0,0,NULL,0,0,NULL,NULL),
(759714,759706,52539,0,0,NULL,0,0,NULL,NULL),
(759715,759706,52550,0,0,NULL,0,0,NULL,NULL),
(759716,759706,52561,0,0,NULL,0,0,NULL,NULL),
(759717,759706,52572,0,0,NULL,0,0,NULL,NULL),
(759718,759706,52583,0,0,NULL,0,0,NULL,NULL),
(759719,759706,52594,0,0,NULL,0,0,NULL,NULL),
(759720,759706,52605,0,0,NULL,0,0,NULL,NULL),
(759721,759706,52616,0,0,NULL,0,0,NULL,NULL),
(759722,759706,52627,0,0,NULL,0,0,NULL,NULL),
(759723,759706,52638,0,0,NULL,0,0,NULL,NULL),
(759724,759706,52649,0,0,NULL,0,0,NULL,NULL),
(759725,759706,52660,0,0,NULL,0,0,NULL,NULL),
(759726,759706,55264,0,0,NULL,0,0,NULL,NULL),
(759727,759706,55275,0,0,NULL,0,0,NULL,NULL),
(759728,759706,55286,0,0,NULL,0,0,NULL,NULL),
(759729,759706,55297,0,0,NULL,0,0,NULL,NULL),
(759730,759706,55308,0,0,NULL,0,0,NULL,NULL),
(759731,759706,55319,0,0,NULL,0,0,NULL,NULL),
(759732,759706,55330,0,0,NULL,0,0,NULL,NULL),
(759733,759706,55341,0,0,NULL,0,0,NULL,NULL),
(759734,759706,55352,0,0,NULL,0,0,NULL,NULL),
(759735,759706,55363,0,0,NULL,0,0,NULL,NULL),
(759736,759706,55374,0,0,NULL,0,0,NULL,NULL),
(759737,759706,55385,0,0,NULL,0,0,NULL,NULL),
(759738,759706,55396,0,0,NULL,0,0,NULL,NULL),
(759739,759706,55407,0,0,NULL,0,0,NULL,NULL),
(759740,759706,55418,0,0,NULL,0,0,NULL,NULL),
(759741,759706,55429,0,0,NULL,0,0,NULL,NULL),
(759742,759706,55440,0,0,NULL,0,0,NULL,NULL),
(759743,759706,55451,0,0,NULL,0,0,NULL,NULL),
(759744,759706,55462,0,0,NULL,0,0,NULL,NULL);
/*!40000 ALTER TABLE `Course_StudentHomework` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Course_SessionContent`
--

DROP TABLE IF EXISTS `Course_SessionContent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Course_SessionContent` (
  `sessionId` bigint(20) NOT NULL,
  `companyId` bigint(20) DEFAULT NULL,
  `teacherId` bigint(20) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `modificationDate` datetime(6) DEFAULT NULL,
  `publicationDate` datetime(6) DEFAULT NULL,
  `isDraft` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`sessionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Course_SessionContent`
--

LOCK TABLES `Course_SessionContent` WRITE;
/*!40000 ALTER TABLE `Course_SessionContent` DISABLE KEYS */;
INSERT INTO `Course_SessionContent` VALUES
(111833,20097,45479,'Support de cours 13/11','2023-12-04 13:12:00.460000','2023-11-06 00:00:00.000000',0),
(178587,20097,47362,'Support pour un cours avec des co enseignants','2023-12-15 14:43:52.484000','2023-12-12 00:00:00.000000',0);
/*!40000 ALTER TABLE `Course_SessionContent` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-12-15 13:44:08
