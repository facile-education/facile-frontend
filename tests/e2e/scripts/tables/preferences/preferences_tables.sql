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
-- Table structure for table `userproperties_userproperties`
--

DROP TABLE IF EXISTS `Preference_NotifyConfig`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Preference_NotifyConfig` (
  `notifyConfigId` bigint(20) NOT NULL,
  `userId` bigint(20) DEFAULT NULL,
  `activate` tinyint(4) DEFAULT NULL,
  `notifyCasier` tinyint(4) DEFAULT NULL,
  `notifyActu` tinyint(4) DEFAULT NULL,
  `notifyGrpDoc` tinyint(4) DEFAULT NULL,
  `notifyAgenda` tinyint(4) DEFAULT NULL,
  `notifySync` tinyint(4) DEFAULT NULL,
  `digestPeriod` int(11) DEFAULT NULL,
  PRIMARY KEY (`notifyConfigId`),
  KEY `IX_2E3370B9` (`activate`),
  KEY `IX_E05CAA52` (`activate`,`digestPeriod`),
  KEY `IX_7C23864C` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `Preference_NotifyConfig` WRITE;
/*!40000 ALTER TABLE `Preference_NotifyConfig` DISABLE KEYS */;
INSERT INTO `Preference_NotifyConfig` (`notifyConfigId`, `userId`, `activate`, `notifyCasier`, `notifyActu`, `notifyGrpDoc`, `notifyAgenda`, `notifySync`, `digestPeriod`)
VALUES (332448,332442,1,0,1,1,1,0,2);
/*!40000 ALTER TABLE `Preference_NotifyConfig` ENABLE KEYS */;
UNLOCK TABLES;


DROP TABLE IF EXISTS `Messaging_MessagingConfig`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Messaging_MessagingConfig` (
  `userId` bigint(20) NOT NULL,
  `isForwardActive` tinyint(4) DEFAULT NULL,
  `forwardMail` text DEFAULT NULL,
  `isSignatureActive` tinyint(4) DEFAULT NULL,
  `signature` text DEFAULT NULL,
  `isAutoReplyActive` tinyint(4) DEFAULT NULL,
  `autoReplyContent` text DEFAULT NULL,
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messaging_messagingconfig`
--

LOCK TABLES `Messaging_MessagingConfig` WRITE;
/*!40000 ALTER TABLE `Messaging_MessagingConfig` DISABLE KEYS */;
INSERT INTO `Messaging_MessagingConfig` VALUES (332442,1,'darko.jovanovic@test.ge.ch',1,'<p>My signature</p>',1,'<p>My auto reply text</p>');
/*!40000 ALTER TABLE `Messaging_MessagingConfig` ENABLE KEYS */;
UNLOCK TABLES;



