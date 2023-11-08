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
-- Table structure for table `Messaging_Message`
--

DROP TABLE IF EXISTS `Messaging_Message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Messaging_Message` (
  `messageId` bigint(20) NOT NULL,
  `folderId` bigint(20) DEFAULT NULL,
  `threadId` bigint(20) DEFAULT NULL,
  `sendMessageId` bigint(20) DEFAULT NULL,
  `senderId` bigint(20) DEFAULT NULL,
  `sendDate` datetime(3) DEFAULT NULL,
  `messageSubject` longtext DEFAULT NULL,
  `messageContent` longtext DEFAULT NULL,
  `isNew` tinyint(4) DEFAULT NULL,
  `readDate` datetime DEFAULT NULL,
  `isAnswered` tinyint(4) DEFAULT NULL,
  `isForwarded` tinyint(4) DEFAULT NULL,
  `senderName` varchar(300) DEFAULT NULL,
  `type_` int(11) DEFAULT NULL,
  `companyId` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`messageId`),
  KEY `IX_CC578397` (`folderId`,`isNew`),
  KEY `IX_15B84E88` (`folderId`,`threadId`),
  KEY `IX_7C5EA58` (`sendMessageId`),
  KEY `IX_DEDA4E6B` (`threadId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Messaging_Message`
--

LOCK TABLES `Messaging_Message` WRITE;
/*!40000 ALTER TABLE `Messaging_Message` DISABLE KEYS */;
INSERT INTO Messaging_Message (messageId,folderId,threadId,sendMessageId,senderId,sendDate,messageSubject,messageContent,isNew,readDate,isAnswered,isForwarded,senderName,type_,companyId) VALUES
	 (492505,492502,492506,0,58811,'2023-10-25 10:39:10.458','Message 0','Contenu du message 0',0,NULL,0,0,'Orlan HUE',0,20097),
	 (492508,492507,492506,492505,58811,'2023-10-25 10:39:10.517','Message 0','Contenu du message 0',1,NULL,0,0,'Orlan HUE',0,20097),
	 (492509,492502,492510,0,58811,'2023-10-25 10:39:11.945','Message 1','Contenu du message 1',0,NULL,0,0,'Orlan HUE',0,20097),
	 (492511,492507,492510,492509,58811,'2023-10-25 10:39:11.981','Message 1','Contenu du message 1',1,NULL,0,0,'Orlan HUE',0,20097),
	 (492512,492502,492513,0,58811,'2023-10-25 10:39:13.309','Message 2','Contenu du message 2',0,NULL,0,0,'Orlan HUE',0,20097),
	 (492514,492507,492513,492512,58811,'2023-10-25 10:39:13.341','Message 2','Contenu du message 2',1,NULL,0,0,'Orlan HUE',0,20097),
	 (492515,492502,492516,0,58811,'2023-10-25 10:39:14.770','Message 3','Contenu du message 3',0,NULL,0,0,'Orlan HUE',0,20097),
	 (492517,492507,492516,492515,58811,'2023-10-25 10:39:14.810','Message 3','Contenu du message 3',1,NULL,0,0,'Orlan HUE',0,20097),
	 (492518,492502,492519,0,58811,'2023-10-25 10:39:16.239','Message 4','Contenu du message 4',0,NULL,0,0,'Orlan HUE',0,20097),
	 (492520,492507,492519,492518,58811,'2023-10-25 10:39:16.286','Message 4','Contenu du message 4',1,NULL,0,0,'Orlan HUE',0,20097);
INSERT INTO Messaging_Message (messageId,folderId,threadId,sendMessageId,senderId,sendDate,messageSubject,messageContent,isNew,readDate,isAnswered,isForwarded,senderName,type_,companyId) VALUES
	 (492521,492502,492522,0,58811,'2023-10-25 10:39:17.848','Message 5','Contenu du message 5',0,NULL,0,0,'Orlan HUE',0,20097),
	 (492523,492507,492522,492521,58811,'2023-10-25 10:39:17.892','Message 5','Contenu du message 5',1,NULL,0,0,'Orlan HUE',0,20097),
	 (492524,492502,492525,0,58811,'2023-10-25 10:39:19.405','Message 6','Contenu du message 6',0,NULL,0,0,'Orlan HUE',0,20097),
	 (492526,492507,492525,492524,58811,'2023-10-25 10:39:19.444','Message 6','Contenu du message 6',1,NULL,0,0,'Orlan HUE',0,20097),
	 (492527,492502,492528,0,58811,'2023-10-25 10:39:20.982','Message 7','Contenu du message 7',0,NULL,0,0,'Orlan HUE',0,20097),
	 (492529,492507,492528,492527,58811,'2023-10-25 10:39:21.009','Message 7','Contenu du message 7',1,NULL,0,0,'Orlan HUE',0,20097),
	 (492530,492502,492531,0,58811,'2023-10-25 10:39:22.624','Message 8','Contenu du message 8',0,NULL,0,0,'Orlan HUE',0,20097),
	 (492532,492507,492531,492530,58811,'2023-10-25 10:39:22.653','Message 8','Contenu du message 8',1,NULL,0,0,'Orlan HUE',0,20097),
	 (492533,492502,492534,0,58811,'2023-10-25 10:39:24.385','Message 9','Contenu du message 9',0,NULL,0,0,'Orlan HUE',0,20097),
	 (492535,492507,492534,492533,58811,'2023-10-25 10:39:24.417','Message 9','Contenu du message 9',1,NULL,0,0,'Orlan HUE',0,20097);
INSERT INTO Messaging_Message (messageId,folderId,threadId,sendMessageId,senderId,sendDate,messageSubject,messageContent,isNew,readDate,isAnswered,isForwarded,senderName,type_,companyId) VALUES
	 (492536,492502,492537,0,58811,'2023-10-25 10:39:26.196','Message 10','Contenu du message 10',0,NULL,0,0,'Orlan HUE',0,20097),
	 (492538,492507,492537,492536,58811,'2023-10-25 10:39:26.232','Message 10','Contenu du message 10',1,NULL,0,0,'Orlan HUE',0,20097),
	 (492539,492502,492540,0,58811,'2023-10-25 10:39:28.025','Message 11','Contenu du message 11',0,NULL,0,0,'Orlan HUE',0,20097),
	 (492541,492507,492540,492539,58811,'2023-10-25 10:39:28.060','Message 11','Contenu du message 11',1,NULL,0,0,'Orlan HUE',0,20097),
	 (492542,492502,492543,0,58811,'2023-10-25 10:39:29.905','Message 12','Contenu du message 12',0,NULL,0,0,'Orlan HUE',0,20097),
	 (492544,492507,492543,492542,58811,'2023-10-25 10:39:29.935','Message 12','Contenu du message 12',1,NULL,0,0,'Orlan HUE',0,20097),
	 (492545,492502,492546,0,58811,'2023-10-25 10:39:31.978','Message 13','Contenu du message 13',0,NULL,0,0,'Orlan HUE',0,20097),
	 (492547,492507,492546,492545,58811,'2023-10-25 10:39:32.006','Message 13','Contenu du message 13',1,NULL,0,0,'Orlan HUE',0,20097),
	 (492548,492502,492549,0,58811,'2023-10-25 10:39:33.976','Message 14','Contenu du message 14',0,NULL,0,0,'Orlan HUE',0,20097),
	 (492550,492507,492549,492548,58811,'2023-10-25 10:39:34.008','Message 14','Contenu du message 14',1,NULL,0,0,'Orlan HUE',0,20097);
INSERT INTO Messaging_Message (messageId,folderId,threadId,sendMessageId,senderId,sendDate,messageSubject,messageContent,isNew,readDate,isAnswered,isForwarded,senderName,type_,companyId) VALUES
	 (492551,492502,492552,0,58811,'2023-10-25 10:39:35.846','Message 15','Contenu du message 15',0,NULL,0,0,'Orlan HUE',0,20097),
	 (492553,492507,492552,492551,58811,'2023-10-25 10:39:35.876','Message 15','Contenu du message 15',1,NULL,0,0,'Orlan HUE',0,20097),
	 (492554,492502,492555,0,58811,'2023-10-25 10:39:37.911','Message 16','Contenu du message 16',0,NULL,0,0,'Orlan HUE',0,20097),
	 (492556,492507,492555,492554,58811,'2023-10-25 10:39:37.940','Message 16','Contenu du message 16',1,NULL,0,0,'Orlan HUE',0,20097),
	 (492557,492502,492558,0,58811,'2023-10-25 10:39:40.022','Message 17','Contenu du message 17',0,NULL,0,0,'Orlan HUE',0,20097),
	 (492559,492507,492558,492557,58811,'2023-10-25 10:39:40.053','Message 17','Contenu du message 17',1,NULL,0,0,'Orlan HUE',0,20097),
	 (492560,492502,492561,0,58811,'2023-10-25 10:39:42.146','Message 18','Contenu du message 18',0,NULL,0,0,'Orlan HUE',0,20097),
	 (492562,492507,492561,492560,58811,'2023-10-25 10:39:42.177','Message 18','Contenu du message 18',1,NULL,0,0,'Orlan HUE',0,20097),
	 (492563,492502,492564,0,58811,'2023-10-25 10:39:44.351','Message 19','Contenu du message 19',0,NULL,0,0,'Orlan HUE',0,20097),
	 (492565,492507,492564,492563,58811,'2023-10-25 10:39:44.385','Message 19','Contenu du message 19',1,NULL,0,0,'Orlan HUE',0,20097);
INSERT INTO Messaging_Message (messageId,folderId,threadId,sendMessageId,senderId,sendDate,messageSubject,messageContent,isNew,readDate,isAnswered,isForwarded,senderName,type_,companyId) VALUES
	 (492566,492502,492567,0,58811,'2023-10-25 10:39:46.671','Message 20','Contenu du message 20',0,NULL,0,0,'Orlan HUE',0,20097),
	 (492568,492507,492567,492566,58811,'2023-10-25 10:39:46.708','Message 20','Contenu du message 20',1,NULL,0,0,'Orlan HUE',0,20097),
	 (492569,492502,492570,0,58811,'2023-10-25 10:39:48.789','Message 21','Contenu du message 21',0,NULL,0,0,'Orlan HUE',0,20097),
	 (492571,492507,492570,492569,58811,'2023-10-25 10:39:48.822','Message 21','Contenu du message 21',1,NULL,0,0,'Orlan HUE',0,20097),
	 (492572,492502,492573,0,58811,'2023-10-25 10:39:51.097','Message 22','Contenu du message 22',0,NULL,0,0,'Orlan HUE',0,20097),
	 (492574,492507,492573,492572,58811,'2023-10-25 10:39:51.128','Message 22','Contenu du message 22',1,NULL,0,0,'Orlan HUE',0,20097),
	 (492575,492502,492576,0,58811,'2023-10-25 10:39:53.461','Message 23','Contenu du message 23',0,NULL,0,0,'Orlan HUE',0,20097),
	 (492577,492507,492576,492575,58811,'2023-10-25 10:39:53.516','Message 23','Contenu du message 23',1,NULL,0,0,'Orlan HUE',0,20097),
	 (492578,492502,492579,0,58811,'2023-10-25 10:39:55.913','Message 24','Contenu du message 24',0,NULL,0,0,'Orlan HUE',0,20097),
	 (492580,492507,492579,492578,58811,'2023-10-25 10:39:55.942','Message 24','Contenu du message 24',1,NULL,0,0,'Orlan HUE',0,20097);
/*!40000 ALTER TABLE `Messaging_Message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Messaging_MessageAttachFile`
--

DROP TABLE IF EXISTS `Messaging_MessageAttachFile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Messaging_MessageAttachFile` (
  `messageId` bigint(20) NOT NULL,
  `fileId` bigint(20) NOT NULL,
  PRIMARY KEY (`messageId`,`fileId`),
  KEY `IX_DFE0541F` (`messageId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Messaging_MessageAttachFile`
--

LOCK TABLES `Messaging_MessageAttachFile` WRITE;
/*!40000 ALTER TABLE `Messaging_MessageAttachFile` DISABLE KEYS */;
/*!40000 ALTER TABLE `Messaging_MessageAttachFile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Messaging_MessageContent`
--

DROP TABLE IF EXISTS `Messaging_MessageContent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Messaging_MessageContent` (
  `messageId` bigint(20) NOT NULL,
  `messageContent` longtext DEFAULT NULL,
  PRIMARY KEY (`messageId`),
  KEY `IX_8F55671F` (`messageId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Messaging_MessageContent`
--

LOCK TABLES `Messaging_MessageContent` WRITE;
/*!40000 ALTER TABLE `Messaging_MessageContent` DISABLE KEYS */;
INSERT INTO Messaging_MessageContent (messageId,messageContent) VALUES
	 (492505,'<html>
 <head></head>
<body>
  Contenu du message 0
</body></body>
</html>'),
	 (492508,'<html>
 <head></head>
<body>
  Contenu du message 0
</body></body>
</html>'),
	 (492509,'<html>
 <head></head>
<body>
  Contenu du message 1
</body></body>
</html>'),
	 (492511,'<html>
 <head></head>
<body>
  Contenu du message 1
</body></body>
</html>'),
	 (492512,'<html>
 <head></head>
<body>
  Contenu du message 2
</body></body>
</html>'),
	 (492514,'<html>
 <head></head>
<body>
  Contenu du message 2
</body></body>
</html>'),
	 (492515,'<html>
 <head></head>
<body>
  Contenu du message 3
</body></body>
</html>'),
	 (492517,'<html>
 <head></head>
<body>
  Contenu du message 3
</body></body>
</html>'),
	 (492518,'<html>
 <head></head>
<body>
  Contenu du message 4
</body></body>
</html>'),
	 (492520,'<html>
 <head></head>
<body>
  Contenu du message 4
</body></body>
</html>');
INSERT INTO Messaging_MessageContent (messageId,messageContent) VALUES
	 (492521,'<html>
 <head></head>
<body>
  Contenu du message 5
</body></body>
</html>'),
	 (492523,'<html>
 <head></head>
<body>
  Contenu du message 5
</body></body>
</html>'),
	 (492524,'<html>
 <head></head>
<body>
  Contenu du message 6
</body></body>
</html>'),
	 (492526,'<html>
 <head></head>
<body>
  Contenu du message 6
</body></body>
</html>'),
	 (492527,'<html>
 <head></head>
<body>
  Contenu du message 7
</body></body>
</html>'),
	 (492529,'<html>
 <head></head>
<body>
  Contenu du message 7
</body></body>
</html>'),
	 (492530,'<html>
 <head></head>
<body>
  Contenu du message 8
</body></body>
</html>'),
	 (492532,'<html>
 <head></head>
<body>
  Contenu du message 8
</body></body>
</html>'),
	 (492533,'<html>
 <head></head>
<body>
  Contenu du message 9
</body></body>
</html>'),
	 (492535,'<html>
 <head></head>
<body>
  Contenu du message 9
</body></body>
</html>');
INSERT INTO Messaging_MessageContent (messageId,messageContent) VALUES
	 (492536,'<html>
 <head></head>
<body>
  Contenu du message 10
</body></body>
</html>'),
	 (492538,'<html>
 <head></head>
<body>
  Contenu du message 10
</body></body>
</html>'),
	 (492539,'<html>
 <head></head>
<body>
  Contenu du message 11
</body></body>
</html>'),
	 (492541,'<html>
 <head></head>
<body>
  Contenu du message 11
</body></body>
</html>'),
	 (492542,'<html>
 <head></head>
<body>
  Contenu du message 12
</body></body>
</html>'),
	 (492544,'<html>
 <head></head>
<body>
  Contenu du message 12
</body></body>
</html>'),
	 (492545,'<html>
 <head></head>
<body>
  Contenu du message 13
</body></body>
</html>'),
	 (492547,'<html>
 <head></head>
<body>
  Contenu du message 13
</body></body>
</html>'),
	 (492548,'<html>
 <head></head>
<body>
  Contenu du message 14
</body></body>
</html>'),
	 (492550,'<html>
 <head></head>
<body>
  Contenu du message 14
</body></body>
</html>');
INSERT INTO Messaging_MessageContent (messageId,messageContent) VALUES
	 (492551,'<html>
 <head></head>
<body>
  Contenu du message 15
</body></body>
</html>'),
	 (492553,'<html>
 <head></head>
<body>
  Contenu du message 15
</body></body>
</html>'),
	 (492554,'<html>
 <head></head>
<body>
  Contenu du message 16
</body></body>
</html>'),
	 (492556,'<html>
 <head></head>
<body>
  Contenu du message 16
</body></body>
</html>'),
	 (492557,'<html>
 <head></head>
<body>
  Contenu du message 17
</body></body>
</html>'),
	 (492559,'<html>
 <head></head>
<body>
  Contenu du message 17
</body></body>
</html>'),
	 (492560,'<html>
 <head></head>
<body>
  Contenu du message 18
</body></body>
</html>'),
	 (492562,'<html>
 <head></head>
<body>
  Contenu du message 18
</body></body>
</html>'),
	 (492563,'<html>
 <head></head>
<body>
  Contenu du message 19
</body></body>
</html>'),
	 (492565,'<html>
 <head></head>
<body>
  Contenu du message 19
</body></body>
</html>');
INSERT INTO Messaging_MessageContent (messageId,messageContent) VALUES
	 (492566,'<html>
 <head></head>
<body>
  Contenu du message 20
</body></body>
</html>'),
	 (492568,'<html>
 <head></head>
<body>
  Contenu du message 20
</body></body>
</html>'),
	 (492569,'<html>
 <head></head>
<body>
  Contenu du message 21
</body></body>
</html>'),
	 (492571,'<html>
 <head></head>
<body>
  Contenu du message 21
</body></body>
</html>'),
	 (492572,'<html>
 <head></head>
<body>
  Contenu du message 22
</body></body>
</html>'),
	 (492574,'<html>
 <head></head>
<body>
  Contenu du message 22
</body></body>
</html>'),
	 (492575,'<html>
 <head></head>
<body>
  Contenu du message 23
</body></body>
</html>'),
	 (492577,'<html>
 <head></head>
<body>
  Contenu du message 23
</body></body>
</html>'),
	 (492578,'<html>
 <head></head>
<body>
  Contenu du message 24
</body></body>
</html>'),
	 (492580,'<html>
 <head></head>
<body>
  Contenu du message 24
</body></body>
</html>');
/*!40000 ALTER TABLE `Messaging_MessageContent` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Messaging_MessageFolder`
--

DROP TABLE IF EXISTS `Messaging_MessageFolder`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Messaging_MessageFolder` (
  `folderId` bigint(20) NOT NULL,
  `userId` bigint(20) DEFAULT NULL,
  `folderName` varchar(75) DEFAULT NULL,
  `type_` int(11) DEFAULT NULL,
  `parentFolderId` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`folderId`),
  KEY `IX_9413BEBA` (`userId`),
  KEY `IX_FDDFC061` (`userId`,`parentFolderId`),
  KEY `IX_6EA985DB` (`userId`,`type_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Messaging_MessageFolder`
--

LOCK TABLES `Messaging_MessageFolder` WRITE;
/*!40000 ALTER TABLE `Messaging_MessageFolder` DISABLE KEYS */;
INSERT INTO Messaging_MessageFolder (folderId,userId,folderName,type_,parentFolderId) VALUES
	 (492501,58811,'Boîte de réception',1,0),
	 (492502,58811,'Envoyés',3,0),
	 (492503,58811,'Corbeille',4,0),
	 (492504,58811,'Brouillons',2,0),
	 (492507,47461,'Boîte de réception',1,0);
/*!40000 ALTER TABLE `Messaging_MessageFolder` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Messaging_MessageRecipients`
--

DROP TABLE IF EXISTS `Messaging_MessageRecipients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Messaging_MessageRecipients` (
  `messageId` bigint(20) NOT NULL,
  `recipients` text DEFAULT NULL,
  PRIMARY KEY (`messageId`),
  KEY `IX_DDDC60A6` (`messageId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Messaging_MessageRecipients`
--

LOCK TABLES `Messaging_MessageRecipients` WRITE;
/*!40000 ALTER TABLE `Messaging_MessageRecipients` DISABLE KEYS */;
INSERT INTO Messaging_MessageRecipients (messageId,recipients) VALUES
	 (492505,'47461,'),
	 (492508,'47461,'),
	 (492509,'47461,'),
	 (492511,'47461,'),
	 (492512,'47461,'),
	 (492514,'47461,'),
	 (492515,'47461,'),
	 (492517,'47461,'),
	 (492518,'47461,'),
	 (492520,'47461,');
INSERT INTO Messaging_MessageRecipients (messageId,recipients) VALUES
	 (492521,'47461,'),
	 (492523,'47461,'),
	 (492524,'47461,'),
	 (492526,'47461,'),
	 (492527,'47461,'),
	 (492529,'47461,'),
	 (492530,'47461,'),
	 (492532,'47461,'),
	 (492533,'47461,'),
	 (492535,'47461,');
INSERT INTO Messaging_MessageRecipients (messageId,recipients) VALUES
	 (492536,'47461,'),
	 (492538,'47461,'),
	 (492539,'47461,'),
	 (492541,'47461,'),
	 (492542,'47461,'),
	 (492544,'47461,'),
	 (492545,'47461,'),
	 (492547,'47461,'),
	 (492548,'47461,'),
	 (492550,'47461,');
INSERT INTO Messaging_MessageRecipients (messageId,recipients) VALUES
	 (492551,'47461,'),
	 (492553,'47461,'),
	 (492554,'47461,'),
	 (492556,'47461,'),
	 (492557,'47461,'),
	 (492559,'47461,'),
	 (492560,'47461,'),
	 (492562,'47461,'),
	 (492563,'47461,'),
	 (492565,'47461,');
INSERT INTO Messaging_MessageRecipients (messageId,recipients) VALUES
	 (492566,'47461,'),
	 (492568,'47461,'),
	 (492569,'47461,'),
	 (492571,'47461,'),
	 (492572,'47461,'),
	 (492574,'47461,'),
	 (492575,'47461,'),
	 (492577,'47461,'),
	 (492578,'47461,'),
	 (492580,'47461,');
/*!40000 ALTER TABLE `Messaging_MessageRecipients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Messaging_MessagingConfig`
--

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
-- Dumping data for table `Messaging_MessagingConfig`
--

LOCK TABLES `Messaging_MessagingConfig` WRITE;
/*!40000 ALTER TABLE `Messaging_MessagingConfig` DISABLE KEYS */;
INSERT INTO Messaging_MessagingConfig (userId,isForwardActive,forwardMail,isSignatureActive,signature,isAutoReplyActive,autoReplyContent) VALUES
	 (47461,1,'penelope.rbr@eduge.loc',0,NULL,0,NULL),
	 (332442,1,'darko.jovanovic@test.ge.ch',1,'<p>My signature</p>',1,'<p>My auto reply text</p>'),
	 (19279640,1,'fiheri@weprode.com',0,NULL,0,NULL),
	 (19280555,1,'ciorsa@weprode.com',0,NULL,0,NULL);
/*!40000 ALTER TABLE `Messaging_MessagingConfig` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-10-12 16:05:34
