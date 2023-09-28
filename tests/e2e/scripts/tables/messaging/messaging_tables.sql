DROP TABLE IF EXISTS `messaging_message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messaging_message` (
  `messageId` bigint(20) NOT NULL,
  `folderId` bigint(20) DEFAULT NULL,
  `threadId` bigint(20) DEFAULT NULL,
  `sendMessageId` bigint(20) DEFAULT NULL,
  `senderId` bigint(20) DEFAULT NULL,
  `senderName` varchar(75) DEFAULT NULL,
  `sendDate` datetime(3) DEFAULT NULL,
  `messageSubject` longtext DEFAULT NULL,
  `messageContent` longtext DEFAULT NULL,
  `isNew` tinyint(4) DEFAULT NULL,
  `readDate` datetime DEFAULT NULL,
  `isAnswered` tinyint(4) DEFAULT NULL,
  `isForwarded` tinyint(4) DEFAULT NULL,
  `type_` int(11) DEFAULT NULL,
  PRIMARY KEY (`messageId`),
  KEY `IX_F4208ACF` (`folderId`),
  KEY `IX_CC578397` (`folderId`,`isNew`),
  KEY `IX_15B84E88` (`folderId`,`threadId`),
  KEY `IX_7C5EA58` (`sendMessageId`),
  KEY `IX_DEDA4E6B` (`threadId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messaging_message`
--

LOCK TABLES `messaging_message` WRITE;
/*!40000 ALTER TABLE `messaging_message` DISABLE KEYS */;
INSERT INTO `messaging_message` VALUES (15426901,15426869,15426902,0,328939,'ANYA ALOSTA','2022-10-06 07:47:09','First message subject','First message content',0,NULL,0,0,0),(15426903,15426867,15426902,15426901,328939,'ANYA ALOSTA','2022-10-06 07:47:09','First message subject','First message content',1,NULL,0,0,0),(15426904,15426111,15426902,15426901,328939,'ANYA ALOSTA','2022-10-06 07:47:09','First message subject','First message content',1,NULL,0,0,0),(15426905,15426875,15426902,15426901,328939,'ANYA ALOSTA','2022-10-06 07:47:09','First message subject','First message content',0,'2022-10-06 07:48:57',0,0,0),(15426906,15426878,15426907,0,332724,'Serge De Miras','2022-10-06 07:48:17','Second message subject','Second message content',0,NULL,0,0,0),(15426908,15426867,15426907,15426906,332724,'Serge De Miras','2022-10-06 07:48:17','Second message subject','Second message content',1,NULL,0,0,0),(15426909,15426875,15426907,15426906,332724,'Serge De Miras','2022-10-06 07:48:17','Second message subject','Second message content',1,NULL,0,0,0),(15426910,15426111,15426907,15426906,332724,'Serge De Miras','2022-10-06 07:48:17','Second message subject','Second message content',1,NULL,0,0,0),(15426911,15426878,15426912,0,332724,'Serge De Miras','2022-10-06 07:48:51','Third message subject','Third message content',0,NULL,0,0,0),(15426913,15426111,15426912,15426911,332724,'Serge De Miras','2022-10-06 07:48:52','Third message subject','Third message content',1,NULL,0,0,0),(15426914,15426875,15426912,15426911,332724,'Serge De Miras','2022-10-06 07:48:52','Third message subject','Third message content',1,NULL,0,0,0),(15426915,15426867,15426912,15426911,332724,'Serge De Miras','2022-10-06 07:48:52','Third message subject','Third message content',1,NULL,0,0,0),(15426916,15426112,15426917,0,4696749,'Salvatore Di Dio','2022-10-06 07:49:52','Fourth message subject','Fourth message content',0,NULL,0,0,0),(15426918,15426875,15426917,15426916,4696749,'Salvatore Di Dio','2022-10-06 07:49:52','Fourth message subject','Fourth message content',1,NULL,0,0,0),(15426919,15426111,15426917,15426916,4696749,'Salvatore Di Dio','2022-10-06 07:49:52','Fourth message subject','Fourth message content',0,'2022-10-06 07:49:57',0,0,0),(15426920,15426867,15426917,15426916,4696749,'Salvatore Di Dio','2022-10-06 07:49:52','Fourth message subject','Fourth message content',1,NULL,0,0,0),(15426921,15426112,15426917,0,4696749,'Salvatore Di Dio','2022-10-06 07:50:21','Rep: Fourth message subject','A response content (1)',0,NULL,0,0,0),(15426922,15426111,15426917,15426921,4696749,'Salvatore Di Dio','2022-10-06 07:50:21','Rep: Fourth message subject','A response content (1)',1,NULL,0,0,0),(15426923,15426875,15426917,15426921,4696749,'Salvatore Di Dio','2022-10-06 07:50:21','Rep: Fourth message subject','A response content (1)',1,NULL,0,0,0),(15426924,15426867,15426917,15426921,4696749,'Salvatore Di Dio','2022-10-06 07:50:21','Rep: Fourth message subject','A response content (1)',1,NULL,0,0,0),(15426925,15426112,15426917,0,4696749,'Salvatore Di Dio','2022-10-06 07:50:34','Rep: Fourth message subject','A response content (2)',0,NULL,0,0,0),(15426926,15426111,15426917,15426925,4696749,'Salvatore Di Dio','2022-10-06 07:50:34','Rep: Fourth message subject','A response content (2)',1,NULL,0,0,0),(15426927,15426875,15426917,15426925,4696749,'Salvatore Di Dio','2022-10-06 07:50:34','Rep: Fourth message subject','A response content (2)',1,NULL,0,0,0),(15426928,15426867,15426917,15426925,4696749,'Salvatore Di Dio','2022-10-06 07:50:34','Rep: Fourth message subject','A response content (2)',1,NULL,0,0,0);
/*!40000 ALTER TABLE `messaging_message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messaging_messagecontent`
--

DROP TABLE IF EXISTS `messaging_messagecontent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messaging_messagecontent` (
  `messageId` bigint(20) NOT NULL,
  `messageContent` varchar(75) DEFAULT NULL,
  PRIMARY KEY (`messageId`),
  KEY `IX_8F55671F` (`messageId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messaging_messagecontent`
--

LOCK TABLES `messaging_messagecontent` WRITE;
/*!40000 ALTER TABLE `messaging_messagecontent` DISABLE KEYS */;
INSERT INTO `messaging_messagecontent` VALUES (15426901,'<p>First message content</p>'),(15426906,'<p>Second message content</p>'),(15426911,'<p>Third message content</p>'),(15426916,'<p>Fourth message content</p>'),(15426921,'<p>A response content (1)</p>'),(15426925,'<p>A response content (2)</p>');
/*!40000 ALTER TABLE `messaging_messagecontent` ENABLE KEYS */;
UNLOCK TABLES;


--
-- Table structure for table `messaging_messagerecipients`
--

DROP TABLE IF EXISTS `messaging_messagerecipients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messaging_messagerecipients` (
  `messageId` bigint(20) NOT NULL,
  `recipients` varchar(75) DEFAULT NULL,
  PRIMARY KEY (`messageId`),
  KEY `IX_DDDC60A6` (`messageId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messaging_messagerecipients`
--

LOCK TABLES `messaging_messagerecipients` WRITE;
/*!40000 ALTER TABLE `messaging_messagerecipients` DISABLE KEYS */;
INSERT INTO `messaging_messagerecipients` VALUES (15426901,'328939,4696749,332724,'),(15426906,'328939,332724,4696749,'),(15426911,'4696749,332724,328939,'),(15426916,'332724,4696749,328939,'),(15426921,'4696749,332724,328939,'),(15426925,'4696749,332724,328939,');
/*!40000 ALTER TABLE `messaging_messagerecipients` ENABLE KEYS */;
UNLOCK TABLES;

DROP TABLE IF EXISTS `messaging_messagingconfig`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messaging_messagingconfig` (
  `userId` bigint(20) NOT NULL,
  `isForwardActive` tinyint(4) DEFAULT NULL,
  `forwardMail` varchar(75) DEFAULT NULL,
  `isSignatureActive` tinyint(4) DEFAULT NULL,
  `signature` varchar(75) DEFAULT NULL,
  `isAutoReplyActive` tinyint(4) DEFAULT NULL,
  `autoReplyContent` varchar(75) DEFAULT NULL,
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messaging_messagingconfig`
--

LOCK TABLES `messaging_messagingconfig` WRITE;
/*!40000 ALTER TABLE `messaging_messagingconfig` DISABLE KEYS */;
INSERT INTO `messaging_messagingconfig` VALUES (328939,1,'anya.alst@eduge.ch',0,'',0,''),(332724,1,'serge.demiras@edu.ge.ch',0,'',0,''),(4696749,1,'Salvatore.DiDio@etat.ge.ch',0,'',0,'');
/*!40000 ALTER TABLE `messaging_messagingconfig` ENABLE KEYS */;
UNLOCK TABLES;


DROP TABLE IF EXISTS `messaging_messageattachfile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messaging_messageattachfile` (
  `messageId` bigint(20) NOT NULL,
  `fileId` bigint(20) NOT NULL,
  PRIMARY KEY (`messageId`,`fileId`),
  KEY `IX_DFE0541F` (`messageId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messaging_messageattachfile`
--

LOCK TABLES `messaging_messageattachfile` WRITE;
/*!40000 ALTER TABLE `messaging_messageattachfile` DISABLE KEYS */;
/*!40000 ALTER TABLE `messaging_messageattachfile` ENABLE KEYS */;
UNLOCK TABLES;


DROP TABLE IF EXISTS `messaging_messagefolder`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messaging_messagefolder` (
  `folderId` bigint(20) NOT NULL,
  `userId` bigint(20) DEFAULT NULL,
  `folderName` varchar(75) DEFAULT NULL,
  `type_` int(11) DEFAULT NULL,
  `parentFolderId` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`folderId`),
  KEY `IX_9413BEBA` (`userId`),
  KEY `IX_FDDFC061` (`userId`,`parentFolderId`),
  KEY `IX_6EA985DB` (`userId`,`type_`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messaging_messagefolder`
--

LOCK TABLES `messaging_messagefolder` WRITE;
/*!40000 ALTER TABLE `messaging_messagefolder` DISABLE KEYS */;
INSERT INTO `messaging_messagefolder` VALUES (15426111,4696749,'Boîte de réception',1,0),(15426112,4696749,'Envoyés',3,0),(15426113,4696749,'Corbeille',4,0),(15426114,4696749,'Brouillons',2,0),(15426116,4696749,'test',5,0),(15426405,12042456,'Boîte de réception',1,0),(15426407,12043041,'Boîte de réception',1,0),(15426409,12048513,'Boîte de réception',1,0),(15426501,4696749,'sous-dossier',5,0),(15426801,11105,'Boîte de réception',1,0),(15426802,11105,'Envoyés',3,0),(15426803,11105,'Corbeille',4,0),(15426804,11105,'Brouillons',2,0),(15426808,332442,'Boîte de réception',1,0),(15426809,332442,'Envoyés',3,0),(15426810,332442,'Corbeille',4,0),(15426811,332442,'Brouillons',2,0),(15426864,328995,'Boîte de réception',1,0),(15426867,328939,'Boîte de réception',1,0),(15426869,328939,'Envoyés',3,0),(15426870,328939,'Corbeille',4,0),(15426871,328939,'Brouillons',2,0),(15426875,332724,'Boîte de réception',1,0),(15426878,332724,'Envoyés',3,0),(15426879,332724,'Corbeille',4,0),(15426880,332724,'Brouillons',2,0);
/*!40000 ALTER TABLE `messaging_messagefolder` ENABLE KEYS */;
UNLOCK TABLES;



