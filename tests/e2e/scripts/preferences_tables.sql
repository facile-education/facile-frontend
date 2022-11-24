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

DROP TABLE IF EXISTS `userproperties_userproperties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userproperties_userproperties` (
  `userId` bigint(20) NOT NULL,
  `hideMenu` tinyint(4) DEFAULT NULL,
  `etabId` bigint(20) DEFAULT NULL,
  `preferedSchoolId` bigint(20) DEFAULT NULL,
  `studentLevel` varchar(75) DEFAULT NULL,
  `studentStatus` varchar(75) DEFAULT NULL,
  `grantHolder` tinyint(4) DEFAULT NULL,
  `transported` tinyint(4) DEFAULT NULL,
  `status` varchar(75) DEFAULT NULL,
  `themeColor` varchar(75) DEFAULT NULL,
  `webdavActivated` tinyint(4) DEFAULT NULL,
  `termsOfUseAgreedDate` datetime DEFAULT NULL,
  `manualAccount` tinyint(4) DEFAULT NULL,
  `lastSynchroDate` datetime DEFAULT NULL,
  PRIMARY KEY (`userId`),
  KEY `IX_12A0B5BF` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userproperties_userproperties`
--

LOCK TABLES `userproperties_userproperties` WRITE;
/*!40000 ALTER TABLE `userproperties_userproperties` DISABLE KEYS */;
INSERT INTO `userproperties_userproperties` VALUES (4696749,0,15180702,0,'','',0,0,'','e74c3c',1,'2020-09-09 06:02:42',0,NULL);
/*!40000 ALTER TABLE `userproperties_userproperties` ENABLE KEYS */;
UNLOCK TABLES;

DROP TABLE IF EXISTS `userproperties_notifyconfig`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userproperties_notifyconfig` (
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

--
-- Dumping data for table `userproperties_notifyconfig`
--

LOCK TABLES `userproperties_notifyconfig` WRITE;
/*!40000 ALTER TABLE `userproperties_notifyconfig` DISABLE KEYS */;
INSERT INTO `userproperties_notifyconfig` VALUES (4696755,4696749,1,1,1,1,1,1,1);
/*!40000 ALTER TABLE `userproperties_notifyconfig` ENABLE KEYS */;
UNLOCK TABLES;


DROP TABLE IF EXISTS `userproperties_messagingconfig`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userproperties_messagingconfig` (
  `userId` bigint(20) NOT NULL,
  `forwardMail` varchar(150) DEFAULT NULL,
  `forwardByMail` tinyint(4) DEFAULT NULL,
  `imSignature` varchar(75) DEFAULT NULL,
  `imUseSignature` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`userId`),
  KEY `IX_A643F425` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userproperties_messagingconfig`
--

LOCK TABLES `userproperties_messagingconfig` WRITE;
/*!40000 ALTER TABLE `userproperties_messagingconfig` DISABLE KEYS */;
INSERT INTO `userproperties_messagingconfig` VALUES (4696749,'salvatore.didio@etat.ge.ch',0,'',0);
/*!40000 ALTER TABLE `userproperties_messagingconfig` ENABLE KEYS */;
UNLOCK TABLES;


