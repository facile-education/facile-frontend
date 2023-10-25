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
INSERT INTO lportal_ent.Messaging_Message (messageId,folderId,threadId,sendMessageId,senderId,sendDate,messageSubject,messageContent,isNew,readDate,isAnswered,isForwarded,senderName,type_,companyId) VALUES
	 (485621,534218,485622,0,58811,'2023-10-23 14:28:32.349','Brouillon existant','Ceci est un brouillon déjà existant',0,NULL,0,0,'Orlan HUE',0,20097),
	 (490701,19662701,490702,0,52216,'2023-10-24 16:06:16.840','Message dans un dossier','Contenu du message dans un dossier',0,NULL,0,0,'Stanislaus ROPKES',0,20097),
	 (490706,19662702,490707,0,52216,'2023-10-24 16:07:20.354','Message dans un sous dossier','Contenu du message dans un sous dossier',0,NULL,0,0,'Stanislaus ROPKES',0,20097),
	 (534210,534207,534211,0,45479,'2023-10-05 08:51:49.401','Mon premier message','Ceci est un message de test',0,NULL,0,0,'Rosana NOLLI',0,20097),
	 (534212,534205,534211,534210,45479,'2023-10-05 08:51:49.495','Mon premier message','Ceci est un message de test',0,'2023-10-05 09:03:03',0,0,'Rosana NOLLI',0,20097),
	 (534213,534207,534214,0,45479,'2023-10-05 08:53:44.337','deuxième message','je vous pose une question',0,NULL,0,0,'Rosana NOLLI',0,20097),
	 (534215,534205,534214,534213,45479,'2023-10-05 08:53:44.419','deuxième message','je vous pose une question',0,'2023-10-05 08:53:52',1,0,'Rosana NOLLI',0,20097),
	 (534219,534216,534214,0,58811,'2023-10-05 08:54:09.390','Re: deuxième message','Je vous réponds!',0,NULL,0,0,'Orlan HUE',0,20097),
	 (534220,534206,534214,534219,58811,'2023-10-05 08:54:09.499','Re: deuxième message','Je vous réponds!',0,'2023-10-05 08:54:17',1,0,'Orlan HUE',0,20097),
	 (534221,534207,534214,0,45479,'2023-10-05 08:54:27.568','Re: deuxième message','Merci',0,NULL,0,0,'Rosana NOLLI',0,20097);
INSERT INTO lportal_ent.Messaging_Message (messageId,folderId,threadId,sendMessageId,senderId,sendDate,messageSubject,messageContent,isNew,readDate,isAnswered,isForwarded,senderName,type_,companyId) VALUES
	 (534222,534205,534214,534221,45479,'2023-10-05 08:54:27.634','Re: deuxième message','Merci',1,NULL,0,0,'Rosana NOLLI',0,20097),
	 (534223,534207,534224,0,45479,'2023-10-05 09:01:19.210','Troisième message','J''ai encore des choses à dire!',0,NULL,0,0,'Rosana NOLLI',0,20097),
	 (534225,534205,534224,534223,45479,'2023-10-05 09:01:19.272','Troisième message','J''ai encore des choses à dire!',1,NULL,0,0,'Rosana NOLLI',0,20097),
	 (824401,534207,824402,0,45479,'2023-10-12 14:03:18.747','Mon quatrième message','Ceci est un message avec plusieurs destinataires',0,NULL,0,0,'Rosana NOLLI',0,20097),
	 (824403,534205,824402,824401,45479,'2023-10-12 14:03:18.841','Mon quatrième message','Ceci est un message avec plusieurs destinataires',1,NULL,0,0,'Rosana NOLLI',0,20097),
	 (824405,824404,824402,824401,45479,'2023-10-12 14:03:18.933','Mon quatrième message','Ceci est un message avec plusieurs destinataires',1,NULL,0,0,'Rosana NOLLI',0,20097);
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
INSERT INTO lportal_ent.Messaging_MessageContent (messageId,messageContent) VALUES
	 (485621,'<html>
 <head></head>
<body>
 <p>Ceci est un brouillon déjà existant &nbsp;</p>
</body></body>
</html>'),
	 (490701,'<html>
 <head></head>
<body>
 <p>Contenu du message dans un dossier</p>
</body></body>
</html>'),
	 (490706,'<html>
 <head></head>
<body>
 <p>Contenu du message dans un sous dossier</p>
</body></body>
</html>'),
	 (534210,'<html>
 <head></head>
<body>
 <p>Ceci est un message de test</p>
</body></body>
</html>'),
	 (534212,'<html>
 <head></head>
<body>
 <p>Ceci est un message de test</p>
</body></body>
</html>'),
	 (534213,'<html>
 <head></head>
<body>
 <p>Je vous pose une question</p>
</body></body>
</html>'),
	 (534215,'<html>
 <head></head>
<body>
 <p>Je vous pose une question</p>
</body></body>
</html>'),
	 (534219,'<html>
 <head></head>
<body>
 <p>Je vous réponds!</p>
</body></body>
</html>'),
	 (534220,'<html>
 <head></head>
<body>
 <p>Je vous réponds!</p>
</body></body>
</html>'),
	 (534221,'<html>
 <head></head>
<body>
 <p>Merci</p>
</body></body>
</html>');
INSERT INTO lportal_ent.Messaging_MessageContent (messageId,messageContent) VALUES
	 (534222,'<html>
 <head></head>
<body>
 <p>Merci</p>
</body></body>
</html>'),
	 (534223,'<html>
 <head></head>
<body>
 <p>J''ai encore des choses à dire!</p>
</body></body>
</html>'),
	 (534225,'<html>
 <head></head>
<body>
 <p>J''ai encore des choses à dire!</p>
</body></body>
</html>'),
	 (824401,'<html>
 <head></head>
<body>
 <p>Ceci est un message avec plusieurs destinataires</p>
</body></body>
</html>'),
	 (824403,'<html>
 <head></head>
<body>
 <p>Ceci est un message avec plusieurs destinataires</p>
</body></body>
</html>'),
	 (824405,'<html>
 <head></head>
<body>
 <p>Ceci est un message avec plusieurs destinataires</p>
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
INSERT INTO lportal_ent.Messaging_MessageFolder (folderId,userId,folderName,type_,parentFolderId) VALUES
	 (534201,47362,'Boîte de réception',1,0),
	 (534202,47362,'Envoyés',3,0),
	 (534203,47362,'Corbeille',4,0),
	 (534204,47362,'Brouillons',2,0),
	 (534205,58811,'Boîte de réception',1,0),
	 (534206,45479,'Boîte de réception',1,0),
	 (534207,45479,'Envoyés',3,0),
	 (534208,45479,'Corbeille',4,0),
	 (534209,45479,'Brouillons',2,0),
	 (534216,58811,'Envoyés',3,0);
INSERT INTO lportal_ent.Messaging_MessageFolder (folderId,userId,folderName,type_,parentFolderId) VALUES
	 (534217,58811,'Corbeille',4,0),
	 (534218,58811,'Brouillons',2,0),
	 (538201,58811,'sous-dossier',5,0),
	 (824404,47461,'Boîte de réception',1,0),
	 (19654701,52216,'Boîte de réception',1,0),
	 (19654702,52216,'Envoyés',3,0),
	 (19654703,52216,'Corbeille',4,0),
	 (19654704,52216,'Brouillons',2,0),
	 (19662701,52216,'dossier personnel',5,0),
	 (19662702,52216,'sous-dossier',5,19662701);
INSERT INTO lportal_ent.Messaging_MessageFolder (folderId,userId,folderName,type_,parentFolderId) VALUES
	 (19662703,52216,'Mon autre dossier',5,0);
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
INSERT INTO lportal_ent.Messaging_MessageRecipients (messageId,recipients) VALUES
	 (485621,'47461,'),
	 (490701,'52216,'),
	 (490706,'52216,'),
	 (534210,'58811,'),
	 (534212,'58811,'),
	 (534213,'58811,'),
	 (534215,'58811,'),
	 (534219,'45479,'),
	 (534220,'45479,'),
	 (534221,'58811,');
INSERT INTO lportal_ent.Messaging_MessageRecipients (messageId,recipients) VALUES
	 (534222,'58811,'),
	 (534223,'58811,'),
	 (534225,'58811,'),
	 (824401,'58811,47461,'),
	 (824403,'58811,47461,'),
	 (824405,'58811,47461,');
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
INSERT INTO `Messaging_MessagingConfig` (`userId`, `isForwardActive`, `forwardMail`, `isSignatureActive`, `signature`, `isAutoReplyActive`, `autoReplyContent`) VALUES (47461,1,'penelope.rbr@eduge.loc',0,NULL,0,NULL),(58811,1,'orlan.hue@etat.ge.loc',0,NULL,0,NULL),(332442,1,'darko.jovanovic@test.ge.ch',1,'<p>My signature</p>',1,'<p>My auto reply text</p>'),(19279640,1,'fiheri@weprode.com',0,NULL,0,NULL),(19280555,1,'ciorsa@weprode.com',0,NULL,0,NULL);
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