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



