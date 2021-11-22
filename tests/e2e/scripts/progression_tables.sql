-- MySQL dump 10.13  Distrib 8.0.27, for Linux (x86_64)
--
-- Host: 192.168.56.103    Database: lportal_ent
-- ------------------------------------------------------
-- Server version	5.7.34

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `progression_progressionfolder`
--

DROP TABLE IF EXISTS `progression_progression`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `progression_progression` (
  `progressionId` bigint(20) NOT NULL,
  `teacherId` bigint(20) DEFAULT NULL,
  `createDate` datetime DEFAULT NULL,
  `modifiedDate` datetime DEFAULT NULL,
  `name` varchar(75) DEFAULT NULL,
  `description` varchar(75) DEFAULT NULL,
  `volee` varchar(75) DEFAULT NULL,
  `subjectId` bigint(20) DEFAULT NULL,
  `color` varchar(75) DEFAULT NULL,
  PRIMARY KEY (`progressionId`),
  KEY `IX_BF2D21A9` (`progressionId`),
  KEY `IX_F9427FD0` (`teacherId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `progression_progression`
--

LOCK TABLES `progression_progression` WRITE;
/*!40000 ALTER TABLE `progression_progression` DISABLE KEYS */;
INSERT INTO `progression_progression` (`progressionId`, `teacherId`, `createDate`, `modifiedDate`, `name`, `description`, `volee`, `subjectId`, `color`) VALUES (15401321,4696749,'2021-11-17 11:37:26','2021-11-17 11:59:26','Ma progression d\'allemand','Ma descrition','09',15382702,'#99B9E9');
/*!40000 ALTER TABLE `progression_progression` ENABLE KEYS */;
UNLOCK TABLES;



DROP TABLE IF EXISTS `progression_progressionfolder`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `progression_progressionfolder` (
  `progressionFolderId` bigint(20) NOT NULL,
  `progressionId` bigint(20) DEFAULT NULL,
  `parentFolderId` bigint(20) DEFAULT NULL,
  `folderName` varchar(75) DEFAULT NULL,
  `order_` int(11) DEFAULT NULL,
  PRIMARY KEY (`progressionFolderId`),
  KEY `IX_7FD17492` (`parentFolderId`),
  KEY `IX_7B2EA994` (`parentFolderId`,`progressionId`),
  KEY `IX_EFCD329` (`progressionFolderId`),
  KEY `IX_3D784C1B` (`progressionId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `progression_progressionfolder`
--

LOCK TABLES `progression_progressionfolder` WRITE;
/*!40000 ALTER TABLE `progression_progressionfolder` DISABLE KEYS */;
INSERT INTO `progression_progressionfolder` (`progressionFolderId`, `progressionId`, `parentFolderId`, `folderName`, `order_`) VALUES (15401322,15401321,0,'Le Pouvoir',1),(15401323,15401321,15401322,'Grammaire',1),(15401324,15401321,15401322,'Projets',2),(15401325,15401321,15401322,'Travaux pratiques',3),(15401326,15401321,0,'La notion de Héros',2);
/*!40000 ALTER TABLE `progression_progressionfolder` ENABLE KEYS */;
UNLOCK TABLES;


DROP TABLE IF EXISTS `progression_progressionitem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `progression_progressionitem` (
  `progressionItemId` bigint(20) NOT NULL,
  `progressionId` bigint(20) DEFAULT NULL,
  `progressionFolderId` bigint(20) DEFAULT NULL,
  `modifiedDate` datetime DEFAULT NULL,
  `itemName` varchar(75) DEFAULT NULL,
  `duration` varchar(75) DEFAULT NULL,
  `isHomework` tinyint(4) DEFAULT NULL,
  `type_` int(11) DEFAULT NULL,
  `order_` int(11) DEFAULT NULL,
  `homeworkId` bigint(20) DEFAULT NULL,
  `sessionId` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`progressionItemId`),
  KEY `IX_15BBC124` (`progressionFolderId`),
  KEY `IX_71366C2` (`progressionFolderId`,`progressionId`),
  KEY `IX_C1941256` (`progressionId`),
  KEY `IX_91A0B389` (`progressionItemId`),
  KEY `progression_progressionitem_homeworkId_index` (`homeworkId`),
  KEY `progression_progressionitem_sessionId_index` (`sessionId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `progression_progressionitem`
--

LOCK TABLES `progression_progressionitem` WRITE;
/*!40000 ALTER TABLE `progression_progressionitem` DISABLE KEYS */;
INSERT INTO `progression_progressionitem` (`progressionItemId`, `progressionId`, `progressionFolderId`, `modifiedDate`, `itemName`, `duration`, `isHomework`, `type_`, `order_`, `homeworkId`, `sessionId`) VALUES (15401401,15401321,15401323,'2021-11-17 11:58:59','Introduction','undefined',0,0,1,NULL,NULL),(15401403,15401321,15401323,'2021-11-17 11:59:15','Les verbes irréguliers','undefined',0,0,2,NULL,NULL),(15401404,15401321,15401323,'2021-11-17 11:59:26','Devoir 1','',1,1,3,NULL,NULL);
/*!40000 ALTER TABLE `progression_progressionitem` ENABLE KEYS */;
UNLOCK TABLES;


DROP TABLE IF EXISTS `progression_progressionitemassignment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `progression_progressionitemassignment` (
  `progressionItemId` bigint(20) NOT NULL,
  `sessionId` bigint(20) NOT NULL,
  `groupId` bigint(20) DEFAULT NULL,
  `homeworkId` bigint(20) DEFAULT NULL,
  `assignedDate` datetime DEFAULT NULL,
  `isContentOverriden` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`progressionItemId`,`sessionId`),
  KEY `IX_1126FB3C` (`progressionItemId`),
  KEY `IX_D0517D05` (`progressionItemId`,`sessionId`),
  KEY `IX_29A1B664` (`sessionId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `progression_progressionitemassignment`
--

LOCK TABLES `progression_progressionitemassignment` WRITE;
/*!40000 ALTER TABLE `progression_progressionitemassignment` DISABLE KEYS */;
/*!40000 ALTER TABLE `progression_progressionitemassignment` ENABLE KEYS */;
UNLOCK TABLES;


DROP TABLE IF EXISTS `progression_progressionitemattachedfile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `progression_progressionitemattachedfile` (
  `progressionItemAttachedFileId` bigint(20) NOT NULL,
  `progressionItemId` bigint(20) DEFAULT NULL,
  `fileEntryId` bigint(20) DEFAULT NULL,
  `isAudioRecording` tinyint(4) DEFAULT NULL,
  `isToBeCompleted` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`progressionItemAttachedFileId`),
  KEY `IX_C038C489` (`progressionItemAttachedFileId`),
  KEY `IX_8CB90529` (`progressionItemId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `progression_progressionitemattachedfile`
--

LOCK TABLES `progression_progressionitemattachedfile` WRITE;
/*!40000 ALTER TABLE `progression_progressionitemattachedfile` DISABLE KEYS */;
/*!40000 ALTER TABLE `progression_progressionitemattachedfile` ENABLE KEYS */;
UNLOCK TABLES;


DROP TABLE IF EXISTS `progression_progressionitemcontent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `progression_progressionitemcontent` (
  `contentId` bigint(20) NOT NULL,
  `progressionItemId` bigint(20) DEFAULT NULL,
  `modifiedDate` datetime DEFAULT NULL,
  `contentName` varchar(75) DEFAULT NULL,
  `contentValue` varchar(75) DEFAULT NULL,
  `fileEntryId` bigint(20) DEFAULT NULL,
  `contentType` int(11) DEFAULT NULL,
  `order_` int(11) DEFAULT NULL,
  `isToBeCompleted` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`contentId`),
  KEY `IX_579F6124` (`progressionItemId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `progression_progressionitemcontent`
--

LOCK TABLES `progression_progressionitemcontent` WRITE;
/*!40000 ALTER TABLE `progression_progressionitemcontent` DISABLE KEYS */;
INSERT INTO `progression_progressionitemcontent` (`contentId`, `progressionItemId`, `modifiedDate`, `contentName`, `contentValue`, `fileEntryId`, `contentType`, `order_`, `isToBeCompleted`) VALUES (15401402,15401401,'2021-11-17 11:58:19','undefined','<p>L\'ortographe s\'est important</p>',0,1,1,0),(15401405,15401404,'2021-11-17 12:00:12','undefined','<p>Apprendre</p>',0,1,1,0),(15401539,15401179,'2021-11-08 16:31:45','undefined','<p>Texterfrf</p><p>Ténérife</p>',0,1,1,0),(15401540,15401179,'2021-11-09 12:23:27','gg','forum.curvefever.com/play2.php',0,3,2,0),(15401701,15401179,'2021-11-09 13:25:29','Le nombre d\'or','https://www.youtube.com/watch?v=DxmFbdp7v9Q',0,4,3,0),(15402123,15401179,'2021-11-08 16:43:17','TP lena.md','Fichier',15402130,5,4,0),(15402616,15401179,'2021-11-10 11:05:49','dsc','https://h5p.eduge.ch/h5p/524/embed',0,6,5,0),(15403302,15401186,'2021-11-10 14:05:11','exo1','https://h5p.eduge.ch/h5p/524/embed',0,6,1,0),(15403401,15401186,'2021-11-10 14:24:33','fff','https://h5p.eduge.ch/h5p/524/embed',0,6,2,0),(15403402,15401186,'2021-11-10 14:30:33','<iframe src=\"https://h5p.eduge.ch/h5p/524/embed\" />','https://h5p.eduge.ch/h5p/524/embed',0,6,3,0),(15403403,15401186,'2021-11-10 14:30:36','<iframe src=\"https://h5p.eduge.ch/h5p/524/embed\" />','https://h5p.eduge.ch/h5p/524/embed',0,6,4,0),(15403404,15401186,'2021-11-10 14:30:39','<iframe src=\"https://h5p.eduge.ch/h5p/524/embed\" />','https://h5p.eduge.ch/h5p/524/embed',0,6,5,0),(15403405,15401186,'2021-11-10 14:30:42','<iframe src=\"https://h5p.eduge.ch/h5p/524/embed\" />','https://h5p.eduge.ch/h5p/524/embed',0,6,6,0),(15403503,15401176,'2021-11-10 15:50:58','https://translate.google.com/?sl=fr&tl=en&text=balise&op=translate','https://h5p.eduge.ch/h5p/524/embed',0,3,1,0),(15403504,15401176,'2021-11-10 15:51:02','https://translate.google.com/?sl=fr&tl=en&text=balise&op=translate','https://h5p.eduge.ch/h5p/524/embed',0,3,2,0),(15403702,15401179,'2021-11-15 09:47:08','undefined','Texte',0,1,6,0),(15403703,15401179,'2021-11-15 09:47:20','undefined','Texte',0,1,7,0),(15403801,15403704,'2021-11-15 10:38:40',' <iframe src=\"http://dev-ent-gve.com\" />','http://dev-ent-gve.com',0,6,1,0),(15403802,15403704,'2021-11-15 10:43:41','<iframe src=\"http://dev-ent-gve.com\" />','http://dev-ent-gve.com',0,6,2,0),(15403803,15403704,'2021-11-15 10:43:45','<iframe src=\"http://dev-ent-gve.com\" />','http://dev-ent-gve.com',0,6,3,0),(15403804,15403704,'2021-11-15 10:43:49','<iframe src=\"http://dev-ent-gve.com\" />','http://dev-ent-gve.com',0,6,4,0),(15403805,15403704,'2021-11-15 10:54:01','e','https://www.youtube.com',0,3,5,0),(15403806,15403704,'2021-11-15 10:54:02','e','https://www.youtube.com',0,3,6,0),(15403807,15401186,'2021-11-15 10:55:04','dede','https://www.youtube.com',0,4,7,0),(15403808,15401186,'2021-11-16 12:14:27','dede','https://www.youtube.com',0,4,9,0),(15403809,15401712,'2021-11-15 10:59:31','undefined','Texte',0,1,1,0),(15403810,15401712,'2021-11-15 10:59:34','undefined','Texte',0,1,2,0),(15403811,15401712,'2021-11-15 10:59:35','undefined','Texte',0,1,3,0),(15403812,15401712,'2021-11-15 10:59:37','undefined','Texte',0,1,4,0),(15403813,15401712,'2021-11-15 10:59:38','undefined','Texte',0,1,5,0),(15403814,15401712,'2021-11-15 10:59:39','undefined','Texte',0,1,6,0),(15403815,15401712,'2021-11-15 10:59:40','undefined','Texte',0,1,7,0),(15403816,15401712,'2021-11-15 10:59:41','undefined','Texte',0,1,8,0),(15403817,15401712,'2021-11-15 10:59:45','undefined','Texte',0,1,9,0),(15403818,15401712,'2021-11-15 10:59:47','undefined','Texte',0,1,10,0),(15403819,15401712,'2021-11-15 10:59:49','undefined','Texte',0,1,11,0),(15403820,15401712,'2021-11-15 10:59:52','undefined','Texte',0,1,12,0),(15403821,15401712,'2021-11-15 10:59:54','undefined','Texte',0,1,13,0),(15403822,15401712,'2021-11-15 10:59:56','undefined','Texte',0,1,14,0),(15403823,15401712,'2021-11-15 11:00:56','undefined','Texte',0,1,15,0),(15403824,15401712,'2021-11-15 11:00:57','undefined','Texte',0,1,16,0),(15403825,15401712,'2021-11-15 11:00:59','undefined','Texte',0,1,17,0),(15403826,15401712,'2021-11-15 11:01:00','undefined','Texte',0,1,18,0),(15403827,15401712,'2021-11-15 11:01:01','undefined','Texte',0,1,19,0),(15403828,15401712,'2021-11-15 11:01:03','undefined','Texte',0,1,20,0),(15403829,15401712,'2021-11-15 11:01:05','undefined','Texte',0,1,21,0),(15403830,15401712,'2021-11-15 11:01:06','undefined','Texte',0,1,22,0),(15403831,15401712,'2021-11-15 11:01:08','undefined','Texte',0,1,23,0),(15403832,15401712,'2021-11-15 11:01:09','undefined','Texte',0,1,24,0),(15403836,15403835,'2021-11-15 11:21:36','a','a',0,3,1,0),(15403837,15403835,'2021-11-15 11:21:42','a','a',0,3,2,0),(15403838,15403835,'2021-11-15 11:21:46','a','a',0,3,3,0),(15403839,15403835,'2021-11-15 11:21:49','a','a',0,3,4,0),(15403840,15403835,'2021-11-15 11:21:52','a','a',0,3,5,0),(15403841,15403835,'2021-11-15 11:21:55','a','a',0,3,6,0),(15403842,15403835,'2021-11-15 11:21:58','a','a',0,3,7,0),(15403843,15403835,'2021-11-15 11:22:04','a','a',0,3,8,0),(15403844,15403835,'2021-11-15 11:22:08','a','a',0,3,9,0),(15403845,15403835,'2021-11-15 11:22:12','a','a',0,3,10,0),(15403846,15403835,'2021-11-15 11:22:17','a','a',0,3,11,0),(15403847,15403835,'2021-11-15 11:22:26','a','a',0,3,12,0),(15403848,15403835,'2021-11-15 11:22:30','a','a',0,3,13,0),(15403849,15403835,'2021-11-15 14:25:57','a','a',0,3,14,0),(15403850,15403835,'2021-11-15 14:26:06','a','a',0,3,15,0),(15403851,15403835,'2021-11-15 14:26:06','a','a',0,3,16,0),(15403852,15403835,'2021-11-15 14:26:14','a','a',0,3,17,0),(15403853,15403835,'2021-11-15 14:26:14','a','a',0,3,18,0),(15403854,15403835,'2021-11-15 14:26:17','a','a',0,3,19,0),(15403855,15403835,'2021-11-15 14:26:17','a','a',0,3,20,0),(15403856,15403835,'2021-11-15 14:26:21','a','a',0,3,21,0),(15403857,15403835,'2021-11-15 14:26:21','a','a',0,3,22,0),(15403858,15403835,'2021-11-15 14:26:23','a','a',0,3,23,0),(15403859,15403835,'2021-11-15 14:26:24','a','a',0,3,24,0),(15403860,15401176,'2021-11-15 15:20:12','a','a',0,3,3,0),(15403861,15401176,'2021-11-15 15:20:12','a','a',0,3,4,0),(15403862,15401176,'2021-11-15 15:22:43','aaaa','aa',0,3,5,0),(15403863,15401176,'2021-11-15 15:22:50','&&&&','&',0,3,6,0),(15403864,15401176,'2021-11-15 15:22:50','&&&&','&',0,3,7,0),(15403865,15401186,'2021-11-16 12:14:30','a','a',0,3,8,0),(15403867,15401186,'2021-11-15 16:01:40','sz','azsz',0,3,10,0),(15403869,15401186,'2021-11-15 16:03:04','https://www.youtube.com/watch?v=C_uNmmgQliM','https://www.youtube.com',0,6,11,0),(15403878,15403877,'2021-11-15 16:43:36','undefined','<p>Bla bla bla…</p>',0,1,1,0),(15403889,15403887,'2021-11-15 16:45:40','video','https://www.youtube.com',0,4,1,0),(15403892,15403891,'2021-11-15 16:54:27','undefined','<p>Textefcfcfcf</p>',0,1,1,0),(15403899,15403898,'2021-11-16 16:44:45','deded','https://www.youtube.com',0,6,1,0);
/*!40000 ALTER TABLE `progression_progressionitemcontent` ENABLE KEYS */;
UNLOCK TABLES;



