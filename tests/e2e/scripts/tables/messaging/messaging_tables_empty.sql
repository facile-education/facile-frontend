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
INSERT INTO `Messaging_MessagingConfig` (`userId`, `isForwardActive`, `forwardMail`, `isSignatureActive`, `signature`, `isAutoReplyActive`, `autoReplyContent`) VALUES (332442,1,'darko.jovanovic@test.ge.ch',1,'<p>My signature</p>',1,'<p>My auto reply text</p>'),(19279640,1,'fiheri@weprode.com',0,NULL,0,NULL),(19280555,1,'ciorsa@weprode.com',0,NULL,0,NULL);
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

-- Dump completed on 2023-10-03 11:48:23
