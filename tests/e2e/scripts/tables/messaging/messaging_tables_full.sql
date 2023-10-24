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
	 (489705,489702,489706,0,58811,'2023-10-24 11:27:31.097','Message n°0','Contenu du message n°0',0,NULL,0,0,'Orlan HUE',0,20097),
	 (489708,489707,489706,489705,58811,'2023-10-24 11:27:31.144','Message n°0','Contenu du message n°0',1,NULL,0,0,'Orlan HUE',0,20097),
	 (489709,489702,489710,0,58811,'2023-10-24 11:27:32.592','Message n°1','Contenu du message n°1',0,NULL,0,0,'Orlan HUE',0,20097),
	 (489711,489707,489710,489709,58811,'2023-10-24 11:27:32.622','Message n°1','Contenu du message n°1',1,NULL,0,0,'Orlan HUE',0,20097),
	 (489712,489702,489713,0,58811,'2023-10-24 11:27:34.033','Message n°2','Contenu du message n°2',0,NULL,0,0,'Orlan HUE',0,20097),
	 (489714,489707,489713,489712,58811,'2023-10-24 11:27:34.066','Message n°2','Contenu du message n°2',1,NULL,0,0,'Orlan HUE',0,20097),
	 (489715,489702,489716,0,58811,'2023-10-24 11:27:35.695','Message n°3','Contenu du message n°3',0,NULL,0,0,'Orlan HUE',0,20097),
	 (489717,489707,489716,489715,58811,'2023-10-24 11:27:35.732','Message n°3','Contenu du message n°3',1,NULL,0,0,'Orlan HUE',0,20097),
	 (489718,489702,489719,0,58811,'2023-10-24 11:27:37.220','Message n°4','Contenu du message n°4',0,NULL,0,0,'Orlan HUE',0,20097),
	 (489720,489707,489719,489718,58811,'2023-10-24 11:27:37.246','Message n°4','Contenu du message n°4',1,NULL,0,0,'Orlan HUE',0,20097);
INSERT INTO lportal_ent.Messaging_Message (messageId,folderId,threadId,sendMessageId,senderId,sendDate,messageSubject,messageContent,isNew,readDate,isAnswered,isForwarded,senderName,type_,companyId) VALUES
	 (489721,489702,489722,0,58811,'2023-10-24 11:27:38.764','Message n°5','Contenu du message n°5',0,NULL,0,0,'Orlan HUE',0,20097),
	 (489723,489707,489722,489721,58811,'2023-10-24 11:27:38.793','Message n°5','Contenu du message n°5',1,NULL,0,0,'Orlan HUE',0,20097),
	 (489724,489702,489725,0,58811,'2023-10-24 11:27:40.310','Message n°6','Contenu du message n°6',0,NULL,0,0,'Orlan HUE',0,20097),
	 (489726,489707,489725,489724,58811,'2023-10-24 11:27:40.340','Message n°6','Contenu du message n°6',1,NULL,0,0,'Orlan HUE',0,20097),
	 (489727,489702,489728,0,58811,'2023-10-24 11:27:42.009','Message n°7','Contenu du message n°7',0,NULL,0,0,'Orlan HUE',0,20097),
	 (489729,489707,489728,489727,58811,'2023-10-24 11:27:42.039','Message n°7','Contenu du message n°7',1,NULL,0,0,'Orlan HUE',0,20097),
	 (489730,489702,489731,0,58811,'2023-10-24 11:27:43.651','Message n°8','Contenu du message n°8',0,NULL,0,0,'Orlan HUE',0,20097),
	 (489732,489707,489731,489730,58811,'2023-10-24 11:27:43.682','Message n°8','Contenu du message n°8',1,NULL,0,0,'Orlan HUE',0,20097),
	 (489733,489702,489734,0,58811,'2023-10-24 11:27:45.352','Message n°9','Contenu du message n°9',0,NULL,0,0,'Orlan HUE',0,20097),
	 (489735,489707,489734,489733,58811,'2023-10-24 11:27:45.382','Message n°9','Contenu du message n°9',1,NULL,0,0,'Orlan HUE',0,20097);
INSERT INTO lportal_ent.Messaging_Message (messageId,folderId,threadId,sendMessageId,senderId,sendDate,messageSubject,messageContent,isNew,readDate,isAnswered,isForwarded,senderName,type_,companyId) VALUES
	 (489736,489702,489737,0,58811,'2023-10-24 11:27:47.072','Message n°10','Contenu du message n°10',0,NULL,0,0,'Orlan HUE',0,20097),
	 (489738,489707,489737,489736,58811,'2023-10-24 11:27:47.104','Message n°10','Contenu du message n°10',1,NULL,0,0,'Orlan HUE',0,20097),
	 (489739,489702,489740,0,58811,'2023-10-24 11:27:48.808','Message n°11','Contenu du message n°11',0,NULL,0,0,'Orlan HUE',0,20097),
	 (489741,489707,489740,489739,58811,'2023-10-24 11:27:48.838','Message n°11','Contenu du message n°11',1,NULL,0,0,'Orlan HUE',0,20097),
	 (489742,489702,489743,0,58811,'2023-10-24 11:27:50.750','Message n°12','Contenu du message n°12',0,NULL,0,0,'Orlan HUE',0,20097),
	 (489744,489707,489743,489742,58811,'2023-10-24 11:27:50.785','Message n°12','Contenu du message n°12',1,NULL,0,0,'Orlan HUE',0,20097),
	 (489745,489702,489746,0,58811,'2023-10-24 11:27:52.604','Message n°13','Contenu du message n°13',0,NULL,0,0,'Orlan HUE',0,20097),
	 (489747,489707,489746,489745,58811,'2023-10-24 11:27:52.632','Message n°13','Contenu du message n°13',1,NULL,0,0,'Orlan HUE',0,20097),
	 (489748,489702,489749,0,58811,'2023-10-24 11:27:54.433','Message n°14','Contenu du message n°14',0,NULL,0,0,'Orlan HUE',0,20097),
	 (489750,489707,489749,489748,58811,'2023-10-24 11:27:54.461','Message n°14','Contenu du message n°14',1,NULL,0,0,'Orlan HUE',0,20097);
INSERT INTO lportal_ent.Messaging_Message (messageId,folderId,threadId,sendMessageId,senderId,sendDate,messageSubject,messageContent,isNew,readDate,isAnswered,isForwarded,senderName,type_,companyId) VALUES
	 (489751,489702,489752,0,58811,'2023-10-24 11:27:56.391','Message n°15','Contenu du message n°15',0,NULL,0,0,'Orlan HUE',0,20097),
	 (489753,489707,489752,489751,58811,'2023-10-24 11:27:56.420','Message n°15','Contenu du message n°15',1,NULL,0,0,'Orlan HUE',0,20097),
	 (489754,489702,489755,0,58811,'2023-10-24 11:27:58.215','Message n°16','Contenu du message n°16',0,NULL,0,0,'Orlan HUE',0,20097),
	 (489756,489707,489755,489754,58811,'2023-10-24 11:27:58.244','Message n°16','Contenu du message n°16',1,NULL,0,0,'Orlan HUE',0,20097),
	 (489757,489702,489758,0,58811,'2023-10-24 11:28:00.287','Message n°17','Contenu du message n°17',0,NULL,0,0,'Orlan HUE',0,20097),
	 (489759,489707,489758,489757,58811,'2023-10-24 11:28:00.318','Message n°17','Contenu du message n°17',1,NULL,0,0,'Orlan HUE',0,20097),
	 (489760,489702,489761,0,58811,'2023-10-24 11:28:02.303','Message n°18','Contenu du message n°18',0,NULL,0,0,'Orlan HUE',0,20097),
	 (489762,489707,489761,489760,58811,'2023-10-24 11:28:02.329','Message n°18','Contenu du message n°18',1,NULL,0,0,'Orlan HUE',0,20097),
	 (489763,489702,489764,0,58811,'2023-10-24 11:28:04.363','Message n°19','Contenu du message n°19',0,NULL,0,0,'Orlan HUE',0,20097),
	 (489765,489707,489764,489763,58811,'2023-10-24 11:28:04.389','Message n°19','Contenu du message n°19',1,NULL,0,0,'Orlan HUE',0,20097);
INSERT INTO lportal_ent.Messaging_Message (messageId,folderId,threadId,sendMessageId,senderId,sendDate,messageSubject,messageContent,isNew,readDate,isAnswered,isForwarded,senderName,type_,companyId) VALUES
	 (489766,489702,489767,0,58811,'2023-10-24 11:28:06.456','Message n°20','Contenu du message n°20',0,NULL,0,0,'Orlan HUE',0,20097),
	 (489768,489707,489767,489766,58811,'2023-10-24 11:28:06.485','Message n°20','Contenu du message n°20',1,NULL,0,0,'Orlan HUE',0,20097),
	 (489769,489702,489770,0,58811,'2023-10-24 11:28:08.520','Message n°21','Contenu du message n°21',0,NULL,0,0,'Orlan HUE',0,20097),
	 (489771,489707,489770,489769,58811,'2023-10-24 11:28:08.547','Message n°21','Contenu du message n°21',1,NULL,0,0,'Orlan HUE',0,20097),
	 (489772,489702,489773,0,58811,'2023-10-24 11:28:10.739','Message n°22','Contenu du message n°22',0,NULL,0,0,'Orlan HUE',0,20097),
	 (489774,489707,489773,489772,58811,'2023-10-24 11:28:10.766','Message n°22','Contenu du message n°22',1,NULL,0,0,'Orlan HUE',0,20097),
	 (489775,489702,489776,0,58811,'2023-10-24 11:28:12.863','Message n°23','Contenu du message n°23',0,NULL,0,0,'Orlan HUE',0,20097),
	 (489777,489707,489776,489775,58811,'2023-10-24 11:28:12.892','Message n°23','Contenu du message n°23',1,NULL,0,0,'Orlan HUE',0,20097),
	 (489778,489702,489779,0,58811,'2023-10-24 11:28:15.150','Message n°24','Contenu du message n°24',0,NULL,0,0,'Orlan HUE',0,20097),
	 (489780,489707,489779,489778,58811,'2023-10-24 11:28:15.178','Message n°24','Contenu du message n°24',1,NULL,0,0,'Orlan HUE',0,20097);
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
	 (489705,'<html>
 <head></head>
<body>
  Contenu du message n°0 
</body></body>
</html>'),
	 (489708,'<html>
 <head></head>
<body>
  Contenu du message n°0 
</body></body>
</html>'),
	 (489709,'<html>
 <head></head>
<body>
  Contenu du message n°1 
</body></body>
</html>'),
	 (489711,'<html>
 <head></head>
<body>
  Contenu du message n°1 
</body></body>
</html>'),
	 (489712,'<html>
 <head></head>
<body>
  Contenu du message n°2 
</body></body>
</html>'),
	 (489714,'<html>
 <head></head>
<body>
  Contenu du message n°2 
</body></body>
</html>'),
	 (489715,'<html>
 <head></head>
<body>
  Contenu du message n°3 
</body></body>
</html>'),
	 (489717,'<html>
 <head></head>
<body>
  Contenu du message n°3 
</body></body>
</html>'),
	 (489718,'<html>
 <head></head>
<body>
  Contenu du message n°4 
</body></body>
</html>'),
	 (489720,'<html>
 <head></head>
<body>
  Contenu du message n°4 
</body></body>
</html>');
INSERT INTO lportal_ent.Messaging_MessageContent (messageId,messageContent) VALUES
	 (489721,'<html>
 <head></head>
<body>
  Contenu du message n°5 
</body></body>
</html>'),
	 (489723,'<html>
 <head></head>
<body>
  Contenu du message n°5 
</body></body>
</html>'),
	 (489724,'<html>
 <head></head>
<body>
  Contenu du message n°6 
</body></body>
</html>'),
	 (489726,'<html>
 <head></head>
<body>
  Contenu du message n°6 
</body></body>
</html>'),
	 (489727,'<html>
 <head></head>
<body>
  Contenu du message n°7 
</body></body>
</html>'),
	 (489729,'<html>
 <head></head>
<body>
  Contenu du message n°7 
</body></body>
</html>'),
	 (489730,'<html>
 <head></head>
<body>
  Contenu du message n°8 
</body></body>
</html>'),
	 (489732,'<html>
 <head></head>
<body>
  Contenu du message n°8 
</body></body>
</html>'),
	 (489733,'<html>
 <head></head>
<body>
  Contenu du message n°9 
</body></body>
</html>'),
	 (489735,'<html>
 <head></head>
<body>
  Contenu du message n°9 
</body></body>
</html>');
INSERT INTO lportal_ent.Messaging_MessageContent (messageId,messageContent) VALUES
	 (489736,'<html>
 <head></head>
<body>
  Contenu du message n°10 
</body></body>
</html>'),
	 (489738,'<html>
 <head></head>
<body>
  Contenu du message n°10 
</body></body>
</html>'),
	 (489739,'<html>
 <head></head>
<body>
  Contenu du message n°11 
</body></body>
</html>'),
	 (489741,'<html>
 <head></head>
<body>
  Contenu du message n°11 
</body></body>
</html>'),
	 (489742,'<html>
 <head></head>
<body>
  Contenu du message n°12 
</body></body>
</html>'),
	 (489744,'<html>
 <head></head>
<body>
  Contenu du message n°12 
</body></body>
</html>'),
	 (489745,'<html>
 <head></head>
<body>
  Contenu du message n°13 
</body></body>
</html>'),
	 (489747,'<html>
 <head></head>
<body>
  Contenu du message n°13 
</body></body>
</html>'),
	 (489748,'<html>
 <head></head>
<body>
  Contenu du message n°14 
</body></body>
</html>'),
	 (489750,'<html>
 <head></head>
<body>
  Contenu du message n°14 
</body></body>
</html>');
INSERT INTO lportal_ent.Messaging_MessageContent (messageId,messageContent) VALUES
	 (489751,'<html>
 <head></head>
<body>
  Contenu du message n°15 
</body></body>
</html>'),
	 (489753,'<html>
 <head></head>
<body>
  Contenu du message n°15 
</body></body>
</html>'),
	 (489754,'<html>
 <head></head>
<body>
  Contenu du message n°16 
</body></body>
</html>'),
	 (489756,'<html>
 <head></head>
<body>
  Contenu du message n°16 
</body></body>
</html>'),
	 (489757,'<html>
 <head></head>
<body>
  Contenu du message n°17 
</body></body>
</html>'),
	 (489759,'<html>
 <head></head>
<body>
  Contenu du message n°17 
</body></body>
</html>'),
	 (489760,'<html>
 <head></head>
<body>
  Contenu du message n°18 
</body></body>
</html>'),
	 (489762,'<html>
 <head></head>
<body>
  Contenu du message n°18 
</body></body>
</html>'),
	 (489763,'<html>
 <head></head>
<body>
  Contenu du message n°19 
</body></body>
</html>'),
	 (489765,'<html>
 <head></head>
<body>
  Contenu du message n°19 
</body></body>
</html>');
INSERT INTO lportal_ent.Messaging_MessageContent (messageId,messageContent) VALUES
	 (489766,'<html>
 <head></head>
<body>
  Contenu du message n°20 
</body></body>
</html>'),
	 (489768,'<html>
 <head></head>
<body>
  Contenu du message n°20 
</body></body>
</html>'),
	 (489769,'<html>
 <head></head>
<body>
  Contenu du message n°21 
</body></body>
</html>'),
	 (489771,'<html>
 <head></head>
<body>
  Contenu du message n°21 
</body></body>
</html>'),
	 (489772,'<html>
 <head></head>
<body>
  Contenu du message n°22 
</body></body>
</html>'),
	 (489774,'<html>
 <head></head>
<body>
  Contenu du message n°22 
</body></body>
</html>'),
	 (489775,'<html>
 <head></head>
<body>
  Contenu du message n°23 
</body></body>
</html>'),
	 (489777,'<html>
 <head></head>
<body>
  Contenu du message n°23 
</body></body>
</html>'),
	 (489778,'<html>
 <head></head>
<body>
  Contenu du message n°24 
</body></body>
</html>'),
	 (489780,'<html>
 <head></head>
<body>
  Contenu du message n°24 
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
INSERT INTO `Messaging_MessageFolder` (`folderId`, `userId`, `folderName`, `type_`, `parentFolderId`) VALUES (534201,47362,'Boîte de réception',1,0),(534202,47362,'Envoyés',3,0),(534203,47362,'Corbeille',4,0),(534204,47362,'Brouillons',2,0),(534205,58811,'Boîte de réception',1,0),(534206,45479,'Boîte de réception',1,0),(534207,45479,'Envoyés',3,0),(534208,45479,'Corbeille',4,0),(534209,45479,'Brouillons',2,0),(534216,58811,'Envoyés',3,0),(534217,58811,'Corbeille',4,0),(534218,58811,'Brouillons',2,0),(538201,58811,'sous-dossier',5,0),(824404,47461,'Boîte de réception',1,0),(19654701,52216,'Boîte de réception',1,0),(19654702,52216,'Envoyés',3,0),(19654703,52216,'Corbeille',4,0),(19654704,52216,'Brouillons',2,0),(19662701,52216,'dossier personnel',5,0),(19662702,52216,'sous-dossier',5,19662701),(19662703,52216,'Mon autre dossier',5,0);
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
	 (489705,'47461,'),
	 (489708,'47461,'),
	 (489709,'47461,'),
	 (489711,'47461,'),
	 (489712,'47461,'),
	 (489714,'47461,'),
	 (489715,'47461,'),
	 (489717,'47461,'),
	 (489718,'47461,'),
	 (489720,'47461,');
INSERT INTO lportal_ent.Messaging_MessageRecipients (messageId,recipients) VALUES
	 (489721,'47461,'),
	 (489723,'47461,'),
	 (489724,'47461,'),
	 (489726,'47461,'),
	 (489727,'47461,'),
	 (489729,'47461,'),
	 (489730,'47461,'),
	 (489732,'47461,'),
	 (489733,'47461,'),
	 (489735,'47461,');
INSERT INTO lportal_ent.Messaging_MessageRecipients (messageId,recipients) VALUES
	 (489736,'47461,'),
	 (489738,'47461,'),
	 (489739,'47461,'),
	 (489741,'47461,'),
	 (489742,'47461,'),
	 (489744,'47461,'),
	 (489745,'47461,'),
	 (489747,'47461,'),
	 (489748,'47461,'),
	 (489750,'47461,');
INSERT INTO lportal_ent.Messaging_MessageRecipients (messageId,recipients) VALUES
	 (489751,'47461,'),
	 (489753,'47461,'),
	 (489754,'47461,'),
	 (489756,'47461,'),
	 (489757,'47461,'),
	 (489759,'47461,'),
	 (489760,'47461,'),
	 (489762,'47461,'),
	 (489763,'47461,'),
	 (489765,'47461,');
INSERT INTO lportal_ent.Messaging_MessageRecipients (messageId,recipients) VALUES
	 (489766,'47461,'),
	 (489768,'47461,'),
	 (489769,'47461,'),
	 (489771,'47461,'),
	 (489772,'47461,'),
	 (489774,'47461,'),
	 (489775,'47461,'),
	 (489777,'47461,'),
	 (489778,'47461,'),
	 (489780,'47461,');
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
INSERT INTO lportal_ent.Messaging_MessagingConfig (userId,isForwardActive,forwardMail,isSignatureActive,signature,isAutoReplyActive,autoReplyContent) VALUES
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