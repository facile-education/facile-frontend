DROP TABLE IF EXISTS `Messaging_Message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Messaging_Message` (
  `messageId` bigint(20) NOT NULL,
  `folderId` bigint(20) DEFAULT NULL,
  `threadId` bigint(20) DEFAULT NULL,
  `sendMessageId` bigint(20) DEFAULT NULL,
  `senderId` bigint(20) DEFAULT NULL,
  `senderName` varchar(300) DEFAULT NULL,
  `sendDate` datetime(3) DEFAULT NULL,
  `messageSubject` longtext DEFAULT NULL,
  `messageContent` longtext DEFAULT NULL,
  `isNew` tinyint(4) DEFAULT NULL,
  `readDate` datetime DEFAULT NULL,
  `isAnswered` tinyint(4) DEFAULT NULL,
  `isForwarded` tinyint(4) DEFAULT NULL,
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
-- Dumping data for table `messaging_message`
--

LOCK TABLES `Messaging_Message` WRITE;
/*!40000 ALTER TABLE `Messaging_Message` DISABLE KEYS */;
INSERT INTO `Messaging_Message` VALUES (15426901,15426869,15426902,0,328939,'ANYA ALOSTA','2022-10-06 07:47:09','First message subject','First message content',0,NULL,0,0,0,10202),(15426903,15426867,15426902,15426901,328939,'ANYA ALOSTA','2022-10-06 07:47:09','First message subject','First message content',1,NULL,0,0,0,10202),(15426904,15426111,15426902,15426901,328939,'ANYA ALOSTA','2022-10-06 07:47:09','First message subject','First message content',1,NULL,0,0,0,10202),(15426905,15426875,15426902,15426901,328939,'ANYA ALOSTA','2022-10-06 07:47:09','First message subject','First message content',0,'2022-10-06 07:48:57',0,0,0,10202),(15426906,15426878,15426907,0,332724,'Serge De Miras','2022-10-06 07:48:17','Second message subject','Second message content',0,NULL,0,0,0,10202),(15426908,15426867,15426907,15426906,332724,'Serge De Miras','2022-10-06 07:48:17','Second message subject','Second message content',1,NULL,0,0,0,10202),(15426909,15426875,15426907,15426906,332724,'Serge De Miras','2022-10-06 07:48:17','Second message subject','Second message content',1,NULL,0,0,0,10202),(15426910,15426111,15426907,15426906,332724,'Serge De Miras','2022-10-06 07:48:17','Second message subject','Second message content',1,NULL,0,0,0,10202),(15426911,15426878,15426912,0,332724,'Serge De Miras','2022-10-06 07:48:51','Third message subject','Third message content',0,NULL,0,0,0,10202),(15426913,15426111,15426912,15426911,332724,'Serge De Miras','2022-10-06 07:48:52','Third message subject','Third message content',1,NULL,0,0,0,10202),(15426914,15426875,15426912,15426911,332724,'Serge De Miras','2022-10-06 07:48:52','Third message subject','Third message content',1,NULL,0,0,0,10202),(15426915,15426867,15426912,15426911,332724,'Serge De Miras','2022-10-06 07:48:52','Third message subject','Third message content',1,NULL,0,0,0,10202),(15426916,15426112,15426917,0,4696749,'Salvatore Di Dio','2022-10-06 07:49:52','Fourth message subject','Fourth message content',0,NULL,0,0,0,10202),(15426918,15426875,15426917,15426916,4696749,'Salvatore Di Dio','2022-10-06 07:49:52','Fourth message subject','Fourth message content',1,NULL,0,0,0,10202),(15426919,15426111,15426917,15426916,4696749,'Salvatore Di Dio','2022-10-06 07:49:52','Fourth message subject','Fourth message content',0,'2022-10-06 07:49:57',0,0,0,10202),(15426920,15426867,15426917,15426916,4696749,'Salvatore Di Dio','2022-10-06 07:49:52','Fourth message subject','Fourth message content',1,NULL,0,0,0,10202),(15426921,15426112,15426917,0,4696749,'Salvatore Di Dio','2022-10-06 07:50:21','Rep: Fourth message subject','A response content (1)',0,NULL,0,0,0,10202),(15426922,15426111,15426917,15426921,4696749,'Salvatore Di Dio','2022-10-06 07:50:21','Rep: Fourth message subject','A response content (1)',1,NULL,0,0,0,10202),(15426923,15426875,15426917,15426921,4696749,'Salvatore Di Dio','2022-10-06 07:50:21','Rep: Fourth message subject','A response content (1)',1,NULL,0,0,0,10202),(15426924,15426867,15426917,15426921,4696749,'Salvatore Di Dio','2022-10-06 07:50:21','Rep: Fourth message subject','A response content (1)',1,NULL,0,0,0,10202),(15426925,15426112,15426917,0,4696749,'Salvatore Di Dio','2022-10-06 07:50:34','Rep: Fourth message subject','A response content (2)',0,NULL,0,0,0,10202),(15426926,15426111,15426917,15426925,4696749,'Salvatore Di Dio','2022-10-06 07:50:34','Rep: Fourth message subject','A response content (2)',1,NULL,0,0,0,10202),(15426927,15426875,15426917,15426925,4696749,'Salvatore Di Dio','2022-10-06 07:50:34','Rep: Fourth message subject','A response content (2)',1,NULL,0,0,0,10202),(15426928,15426867,15426917,15426925,4696749,'Salvatore Di Dio','2022-10-06 07:50:34','Rep: Fourth message subject','A response content (2)',1,NULL,0,0,0,10202);
/*!40000 ALTER TABLE `Messaging_Message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messaging_messagecontent`
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
INSERT INTO `Messaging_MessageContent` VALUES (15426901,'<p>First message content</p>'),(15426906,'<p>Second message content</p>'),(15426911,'<p>Third message content</p>'),(15426916,'<p>Fourth message content</p>'),(15426921,'<p>A response content (1)</p>'),(15426925,'<p>A response content (2)</p>');
/*!40000 ALTER TABLE `Messaging_MessageContent` ENABLE KEYS */;
UNLOCK TABLES;


--
-- Table structure for table `messaging_messagerecipients`
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
-- Dumping data for table `messaging_messagerecipients`
--

LOCK TABLES `Messaging_MessageRecipients` WRITE;
/*!40000 ALTER TABLE `Messaging_MessageRecipients` DISABLE KEYS */;
INSERT INTO `Messaging_MessageRecipients` VALUES (15426901,'328939,4696749,332724,'),(15426906,'328939,332724,4696749,'),(15426911,'4696749,332724,328939,'),(15426916,'332724,4696749,328939,'),(15426921,'4696749,332724,328939,'),(15426925,'4696749,332724,328939,');
/*!40000 ALTER TABLE `Messaging_MessageRecipients` ENABLE KEYS */;
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
-- Dumping data for table `Messaging_MessagingConfig`
--

LOCK TABLES `Messaging_MessagingConfig` WRITE;
/*!40000 ALTER TABLE `Messaging_MessagingConfig` DISABLE KEYS */;
INSERT INTO `Messaging_MessagingConfig` VALUES (328939,1,'anya.alst@eduge.ch',0,'',0,''),(332724,1,'serge.demiras@edu.ge.ch',0,'',0,''),(4696749,1,'Salvatore.DiDio@etat.ge.ch',0,'',0,'');
/*!40000 ALTER TABLE `Messaging_MessagingConfig` ENABLE KEYS */;
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


LOCK TABLES `Messaging_MessageAttachFile` WRITE;
/*!40000 ALTER TABLE `Messaging_MessageAttachFile` DISABLE KEYS */;
/*!40000 ALTER TABLE `Messaging_MessageAttachFile` ENABLE KEYS */;
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
INSERT INTO `Messaging_MessageFolder` (`folderId`, `userId`, `folderName`, `type_`, `parentFolderId`) VALUES (19654701,332442,'Boîte de réception',1,0),(19654702,332442,'Envoyés',3,0),(19654703,332442,'Corbeille',4,0),(19654704,332442,'Brouillons',2,0),(19662701,332442,'dossier personnel',5,0),(19662702,332442,'sous-dossier',5,19662701),(19662703,332442,'Mon autre dossier',5,0);/*!40000 ALTER TABLE `Messaging_MessageFolder` ENABLE KEYS */;
UNLOCK TABLES;



