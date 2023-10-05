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
INSERT INTO `Messaging_Message` (`messageId`, `folderId`, `threadId`, `sendMessageId`, `senderId`, `sendDate`, `messageSubject`, `messageContent`, `isNew`, `readDate`, `isAnswered`, `isForwarded`, `senderName`, `type_`, `companyId`) VALUES (502206,502205,502207,0,45479,'2023-10-04 15:17:29.605','Menus végés','Les menus végétariens de la cantine ne sont pas assez diversifiés!',0,NULL,0,0,'Rosana NOLLI',0,20097),(502208,502201,502207,502206,45479,'2023-10-04 15:17:29.703','Menus végés','Les menus végétariens de la cantine ne sont pas assez diversifiés!',1,NULL,0,0,'Rosana NOLLI',0,20097);
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
INSERT INTO `Messaging_MessageContent` (`messageId`, `messageContent`) VALUES (502206,'<html>\n <head></head>\n<body>\n <p>Les menus végétariens de la cantine ne sont pas assez diversifiés!</p>\n</body></body>\n</html>'),(502208,'<html>\n <head></head>\n<body>\n <p>Les menus végétariens de la cantine ne sont pas assez diversifiés!</p>\n</body></body>\n</html>');
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
INSERT INTO `Messaging_MessageFolder` (`folderId`, `userId`, `folderName`, `type_`, `parentFolderId`) VALUES (19654701,52216,'Boîte de réception',1,0),(19654702,52216,'Envoyés',3,0),(19654703,52216,'Corbeille',4,0),(19654704,52216,'Brouillons',2,0),(19662701,52216,'dossier personnel',5,0),(19662702,52216,'sous-dossier',5,19662701),(19662703,52216,'Mon autre dossier',5,0);/*!40000 ALTER TABLE `Messaging_MessageFolder` ENABLE KEYS */;
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
INSERT INTO `Messaging_MessageRecipients` (`messageId`, `recipients`) VALUES (502206,'58811,'),(502208,'58811,');
/*!40000 ALTER TABLE `Messaging_MessageRecipients` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-10-04 17:20:36
