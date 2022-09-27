--
-- Table structure for table `dlfileentry`
--

DROP TABLE IF EXISTS `dlfileentry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dlfileentry` (
  `uuid_` varchar(75) DEFAULT NULL,
  `fileEntryId` bigint(20) NOT NULL,
  `groupId` bigint(20) DEFAULT NULL,
  `companyId` bigint(20) DEFAULT NULL,
  `userId` bigint(20) DEFAULT NULL,
  `userName` varchar(75) DEFAULT NULL,
  `versionUserId` bigint(20) DEFAULT NULL,
  `versionUserName` varchar(75) DEFAULT NULL,
  `createDate` datetime DEFAULT NULL,
  `modifiedDate` datetime DEFAULT NULL,
  `folderId` bigint(20) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` longtext,
  `version` varchar(75) DEFAULT NULL,
  `pendingVersion` varchar(75) DEFAULT NULL,
  `size_` bigint(20) DEFAULT NULL,
  `readCount` int(11) DEFAULT NULL,
  `extraSettings` longtext,
  `extension` varchar(75) DEFAULT NULL,
  `repositoryId` bigint(20) DEFAULT NULL,
  `mimeType` varchar(75) DEFAULT NULL,
  `fileEntryTypeId` bigint(20) DEFAULT NULL,
  `smallImageId` bigint(20) DEFAULT NULL,
  `largeImageId` bigint(20) DEFAULT NULL,
  `custom1ImageId` bigint(20) DEFAULT NULL,
  `custom2ImageId` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`fileEntryId`),
  UNIQUE KEY `IX_5391712` (`groupId`,`folderId`,`name`),
  UNIQUE KEY `IX_BC2E7E6A` (`uuid_`,`groupId`),
  UNIQUE KEY `IX_ED5CA615` (`groupId`,`folderId`,`title`),
  KEY `IX_4CB1B2B4` (`companyId`),
  KEY `IX_F4AF5636` (`groupId`),
  KEY `IX_93CF8193` (`groupId`,`folderId`),
  KEY `IX_43261870` (`groupId`,`userId`),
  KEY `IX_D20C434D` (`groupId`,`userId`,`folderId`),
  KEY `IX_64F0FE40` (`uuid_`),
  KEY `IX_29D0AF28` (`groupId`,`folderId`,`fileEntryTypeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dlfileentry`
--

LOCK TABLES `dlfileentry` WRITE;
/*!40000 ALTER TABLE `dlfileentry` DISABLE KEYS */;
INSERT INTO `dlfileentry` VALUES ('5f6aeb67-f224-45ba-9a57-533d117370ed',15402301,4696751,10202,4696749,'Salvatore Di Dio',4696749,'Salvatore Di Dio','2022-09-27 07:25:06','2022-09-27 07:25:09',15401808,'169201','fichier1_1.html','','2.0',NULL,19,3,'','html',4696751,'text/html',0,0,0,0,0),('78883c8c-722e-44a6-a8c8-dac781ae97a0',15402314,4696751,10202,4696749,'Salvatore Di Dio',4696749,'Salvatore Di Dio','2022-09-27 07:25:14','2022-09-27 07:25:14',15401808,'169202','fichier1_2.html','','1.0',NULL,0,3,'','html',4696751,'text/html',0,0,0,0,0),('a7260531-b4ad-443e-a5db-ba1990dbea0e',15402328,4696751,10202,4696749,'Salvatore Di Dio',4696749,'Salvatore Di Dio','2022-09-27 07:27:49','2022-09-27 07:27:55',8040788,'169203','fichier1.html','','2.0',NULL,13,0,'','html',4696751,'text/html',0,0,0,0,0),('b2560cb4-290c-44d3-8cce-490c4982a0d4',15402341,4696751,10202,4696749,'Salvatore Di Dio',4696749,'Salvatore Di Dio','2022-09-27 07:28:10','2022-09-27 07:28:13',8040788,'169204','fichier2.html','','2.0',NULL,14,0,'','html',4696751,'text/html',0,0,0,0,0),('1e2294c1-2a7b-40ff-80c7-3e5972b6e0e6',15402355,4696751,10202,4696749,'Salvatore Di Dio',4696749,'Salvatore Di Dio','2022-09-27 07:28:34','2022-09-27 07:28:41',15401812,'169205','fichier1_1_1.html','','1.1',NULL,19,1,'','html',4696751,'text/html',0,0,0,0,0),('ef2f072f-8c2e-4ad4-a0a5-e9a1434e7b8c',15402363,4696751,10202,4696749,'Salvatore Di Dio',4696749,'Salvatore Di Dio','2022-09-27 07:28:34','2022-09-27 07:28:46',15401812,'169206','fichier1_2_2.html','','1.1',NULL,0,1,'','html',4696751,'text/html',0,0,0,0,0),('dcfe37e1-0d5d-4d35-8af9-8cfcc92653ab',15402384,4696751,10202,4696749,'Salvatore Di Dio',4696749,'Salvatore Di Dio','2022-09-27 07:28:55','2022-09-27 07:29:08',15401814,'169207','fichier1_2_1.html','','1.1',NULL,19,1,'','html',4696751,'text/html',0,0,0,0,0),('c7fc9df1-2135-4412-9317-daa2240c2ddf',15402391,4696751,10202,4696749,'Salvatore Di Dio',4696749,'Salvatore Di Dio','2022-09-27 07:28:55','2022-09-27 07:29:25',15401814,'169208','fichier1_2_2.html','','1.1',NULL,0,1,'','html',4696751,'text/html',0,0,0,0,0),('1eb15e04-01c8-47bc-b593-e6d462f0ffdc',15402412,4696751,10202,4696749,'Salvatore Di Dio',4696749,'Salvatore Di Dio','2022-09-27 07:29:46','2022-09-27 07:30:02',15401810,'169209','fichier2_2.html','','1.2',NULL,19,2,'','html',4696751,'text/html',0,0,0,0,0),('983b5a3d-0377-445d-a3e7-d93e3c63a48c',15402419,4696751,10202,4696749,'Salvatore Di Dio',4696749,'Salvatore Di Dio','2022-09-27 07:29:46','2022-09-27 07:29:46',15401810,'169210','fichier1_2.html','','1.0',NULL,0,0,'','html',4696751,'text/html',0,0,0,0,0);
/*!40000 ALTER TABLE `dlfileentry` ENABLE KEYS */;
UNLOCK TABLES;



--
-- Table structure for table `dlfolder`
--

DROP TABLE IF EXISTS `dlfolder`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dlfolder` (
  `uuid_` varchar(75) DEFAULT NULL,
  `folderId` bigint(20) NOT NULL,
  `groupId` bigint(20) DEFAULT NULL,
  `companyId` bigint(20) DEFAULT NULL,
  `userId` bigint(20) DEFAULT NULL,
  `userName` varchar(75) DEFAULT NULL,
  `createDate` datetime DEFAULT NULL,
  `modifiedDate` datetime DEFAULT NULL,
  `parentFolderId` bigint(20) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `description` longtext,
  `lastPostDate` datetime DEFAULT NULL,
  `repositoryId` bigint(20) DEFAULT NULL,
  `mountPoint` tinyint(4) DEFAULT NULL,
  `defaultFileEntryTypeId` bigint(20) DEFAULT NULL,
  `overrideFileEntryTypes` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`folderId`),
  UNIQUE KEY `IX_902FD874` (`groupId`,`parentFolderId`,`name`),
  UNIQUE KEY `IX_3CC1DED2` (`uuid_`,`groupId`),
  KEY `IX_A74DB14C` (`companyId`),
  KEY `IX_F2EA1ACE` (`groupId`),
  KEY `IX_49C37475` (`groupId`,`parentFolderId`),
  KEY `IX_51556082` (`parentFolderId`,`name`),
  KEY `IX_CBC408D8` (`uuid_`),
  KEY `IX_2A048EA0` (`groupId`,`parentFolderId`,`mountPoint`),
  KEY `IX_EE29C715` (`repositoryId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dlfolder`
--

LOCK TABLES `dlfolder` WRITE;
/*!40000 ALTER TABLE `dlfolder` DISABLE KEYS */;
INSERT INTO `dlfolder` VALUES ('dc88c5f7-f469-4dc7-9908-7cb9373ba501',8040788,4696751,10202,4696749,'','2020-09-09 08:42:53','2021-05-06 11:05:23',0,'Mon cartable','Cartable personnel.','2022-09-27 06:45:52',4696751,0,0,0),('dfa2658c-b70d-4ad2-a215-0e3c00b49be0',15401801,11107,10202,11105,'','2022-09-27 06:44:46','2022-09-27 06:44:46',0,'._CASIER_','Casier',NULL,11107,0,0,0),('d2650173-e821-4efa-bc74-e2da7a64c0ad',15401803,4696751,10202,4696749,'','2022-09-27 06:44:49','2022-09-27 06:44:49',0,'._CASIER_','Casier',NULL,4696751,0,0,0),('36c78ce7-9ea7-4825-9462-e07fd14b6b2c',15401805,4696751,10202,4696749,'','2022-09-27 06:44:53','2022-09-27 06:44:53',0,'._SENDING_BOX_','Boite d envoi tmp',NULL,4696751,0,0,0),('9f990a05-6109-4a00-8a59-40614aec6805',15401808,4696751,10202,4696749,'','2022-09-27 06:45:44','2022-09-27 06:45:44',8040788,'dossier1','','2022-09-27 06:46:14',4696751,0,0,0),('825d3e24-7d91-4707-aa99-321255b79095',15401810,4696751,10202,4696749,'','2022-09-27 06:45:52','2022-09-27 06:45:52',8040788,'dossier2','','2022-09-27 06:46:43',4696751,0,0,0),('062b7828-0ed2-4990-82c2-b679ff4eab03',15401812,4696751,10202,4696749,'','2022-09-27 06:46:05','2022-09-27 06:46:05',15401808,'dossier1_1','',NULL,4696751,0,0,0),('eea28490-0662-4036-adf4-ca5925a2235a',15401814,4696751,10202,4696749,'','2022-09-27 06:46:14','2022-09-27 06:46:14',15401808,'dossier1_2','',NULL,4696751,0,0,0),('ad51dd1c-5f1d-4eaa-9b33-270708d35ad8',15401816,4696751,10202,4696749,'','2022-09-27 06:46:37','2022-09-27 06:46:37',15401810,'dossier2_1','',NULL,4696751,0,0,0),('49b755d5-1bce-4ce1-8e92-5422ceb8e4e0',15401818,4696751,10202,4696749,'','2022-09-27 06:46:43','2022-09-27 06:46:43',15401810,'dossier2_2','',NULL,4696751,0,0,0);
/*!40000 ALTER TABLE `dlfolder` ENABLE KEYS */;
UNLOCK TABLES;


--
-- Table structure for table `dlfileversion`
--

DROP TABLE IF EXISTS `dlfileversion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dlfileversion` (
  `fileVersionId` bigint(20) NOT NULL,
  `groupId` bigint(20) DEFAULT NULL,
  `companyId` bigint(20) DEFAULT NULL,
  `userId` bigint(20) DEFAULT NULL,
  `userName` varchar(75) DEFAULT NULL,
  `createDate` datetime DEFAULT NULL,
  `folderId` bigint(20) DEFAULT NULL,
  `description` longtext,
  `version` varchar(75) DEFAULT NULL,
  `size_` bigint(20) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `statusByUserId` bigint(20) DEFAULT NULL,
  `statusByUserName` varchar(75) DEFAULT NULL,
  `statusDate` datetime DEFAULT NULL,
  `extension` varchar(75) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `changeLog` longtext,
  `extraSettings` longtext,
  `modifiedDate` datetime DEFAULT NULL,
  `repositoryId` bigint(20) DEFAULT NULL,
  `fileEntryId` bigint(20) DEFAULT NULL,
  `mimeType` varchar(75) DEFAULT NULL,
  `fileEntryTypeId` bigint(20) DEFAULT NULL,
  `uuid_` varchar(75) DEFAULT NULL,
  PRIMARY KEY (`fileVersionId`),
  UNIQUE KEY `IX_E2815081` (`fileEntryId`,`version`),
  UNIQUE KEY `IX_C99B2650` (`uuid_`,`groupId`),
  KEY `IX_C68DC967` (`fileEntryId`),
  KEY `IX_D47BB14D` (`fileEntryId`,`status`),
  KEY `IX_DFD809D3` (`groupId`,`folderId`,`status`),
  KEY `IX_9BE769ED` (`groupId`,`folderId`,`title`,`version`),
  KEY `IX_4BFABB9A` (`uuid_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dlfileversion`
--

LOCK TABLES `dlfileversion` WRITE;
/*!40000 ALTER TABLE `dlfileversion` DISABLE KEYS */;
INSERT INTO `dlfileversion` VALUES (15402302,4696751,10202,4696749,'Salvatore Di Dio','2022-09-27 07:25:06',15401808,'','1.0',0,0,4696749,'Salvatore Di Dio','2022-09-27 07:25:06','html','fichier1_1.html','','','2022-09-27 07:25:06',4696751,15402301,'text/html',0,'8f0ab973-95a7-4da9-a505-8bb9ead33b6b'),(15402309,4696751,10202,4696749,'Salvatore Di Dio','2022-09-27 07:25:09',15401808,'','2.0',19,0,4696749,'Salvatore Di Dio','2022-09-27 07:25:09','html','fichier1_1.html','','','2022-09-27 07:25:09',4696751,15402301,'text/html',0,'41b1c5fc-122a-4a59-a424-2ae24249716d'),(15402315,4696751,10202,4696749,'Salvatore Di Dio','2022-09-27 07:25:14',15401808,'','1.0',0,0,4696749,'Salvatore Di Dio','2022-09-27 07:25:14','html','fichier1_2.html','','','2022-09-27 07:25:14',4696751,15402314,'text/html',0,'eb81e54d-cd3a-4150-b50f-6147d15ef6e2'),(15402329,4696751,10202,4696749,'Salvatore Di Dio','2022-09-27 07:27:49',8040788,'','1.0',0,0,4696749,'Salvatore Di Dio','2022-09-27 07:27:49','html','fichier1.html','','','2022-09-27 07:27:49',4696751,15402328,'text/html',0,'52302711-ed0e-4174-95b2-2b3c52f1247f'),(15402336,4696751,10202,4696749,'Salvatore Di Dio','2022-09-27 07:27:55',8040788,'','2.0',13,0,4696749,'Salvatore Di Dio','2022-09-27 07:27:55','html','fichier1.html','','','2022-09-27 07:27:55',4696751,15402328,'text/html',0,'cd99eb27-7895-456e-8ee7-a5b6ee0b55ff'),(15402342,4696751,10202,4696749,'Salvatore Di Dio','2022-09-27 07:28:10',8040788,'','1.0',0,0,4696749,'Salvatore Di Dio','2022-09-27 07:28:10','html','fichier2.html','','','2022-09-27 07:28:10',4696751,15402341,'text/html',0,'06f27d0b-9570-41bb-af1f-d05135bec7bc'),(15402349,4696751,10202,4696749,'Salvatore Di Dio','2022-09-27 07:28:13',8040788,'','2.0',14,0,4696749,'Salvatore Di Dio','2022-09-27 07:28:13','html','fichier2.html','','','2022-09-27 07:28:13',4696751,15402341,'text/html',0,'875eb292-2ca7-4255-a275-1592c680ff82'),(15402356,4696751,10202,4696749,'Salvatore Di Dio','2022-09-27 07:28:34',15401812,'','1.0',19,0,4696749,'Salvatore Di Dio','2022-09-27 07:28:34','html','fichier1_1.html','','','2022-09-27 07:28:34',4696751,15402355,'text/html',0,'d0366475-33b2-4af9-8e87-3548a1644d0e'),(15402364,4696751,10202,4696749,'Salvatore Di Dio','2022-09-27 07:28:34',15401812,'','1.0',0,0,4696749,'Salvatore Di Dio','2022-09-27 07:28:34','html','fichier1_2.html','','','2022-09-27 07:28:34',4696751,15402363,'text/html',0,'22df75a4-3edc-4eaa-8056-5b4773b88add'),(15402376,4696751,10202,4696749,'Salvatore Di Dio','2022-09-27 07:28:41',15401812,'','1.1',19,0,4696749,'Salvatore Di Dio','2022-09-27 07:28:41','html','fichier1_1_1.html','','','2022-09-27 07:28:41',4696751,15402355,'text/html',0,'57f6eb2a-dbe3-4480-9c0f-383b8edf621b'),(15402383,4696751,10202,4696749,'Salvatore Di Dio','2022-09-27 07:28:46',15401812,'','1.1',0,0,4696749,'Salvatore Di Dio','2022-09-27 07:28:46','html','fichier1_2_2.html','','','2022-09-27 07:28:46',4696751,15402363,'text/html',0,'7d7697b4-f8c9-4660-8b71-e62800fb8586'),(15402385,4696751,10202,4696749,'Salvatore Di Dio','2022-09-27 07:28:55',15401814,'','1.0',19,0,4696749,'Salvatore Di Dio','2022-09-27 07:28:55','html','fichier1_1.html','','','2022-09-27 07:28:55',4696751,15402384,'text/html',0,'139c15ed-dfe7-49b2-be95-21e8a1696361'),(15402392,4696751,10202,4696749,'Salvatore Di Dio','2022-09-27 07:28:55',15401814,'','1.0',0,0,4696749,'Salvatore Di Dio','2022-09-27 07:28:56','html','fichier1_2.html','','','2022-09-27 07:28:55',4696751,15402391,'text/html',0,'84fc6859-4399-4e96-b40b-57c9f2d58fb8'),(15402404,4696751,10202,4696749,'Salvatore Di Dio','2022-09-27 07:29:08',15401814,'','1.1',19,0,4696749,'Salvatore Di Dio','2022-09-27 07:29:09','html','fichier1_2_1.html','','','2022-09-27 07:29:09',4696751,15402384,'text/html',0,'5f060b21-a567-41cd-8370-be54dc6decf6'),(15402411,4696751,10202,4696749,'Salvatore Di Dio','2022-09-27 07:29:25',15401814,'','1.1',0,0,4696749,'Salvatore Di Dio','2022-09-27 07:29:25','html','fichier1_2_2.html','','','2022-09-27 07:29:25',4696751,15402391,'text/html',0,'a4b52b1c-2c46-4b2e-b1e6-4728e1f55c54'),(15402413,4696751,10202,4696749,'Salvatore Di Dio','2022-09-27 07:29:46',15401810,'','1.0',19,0,4696749,'Salvatore Di Dio','2022-09-27 07:29:46','html','fichier1_1.html','','','2022-09-27 07:29:46',4696751,15402412,'text/html',0,'4883b649-a98a-4eef-9047-f44d9c37a064'),(15402420,4696751,10202,4696749,'Salvatore Di Dio','2022-09-27 07:29:46',15401810,'','1.0',0,0,4696749,'Salvatore Di Dio','2022-09-27 07:29:46','html','fichier1_2.html','','','2022-09-27 07:29:46',4696751,15402419,'text/html',0,'97498d48-71fd-4080-bada-72d30581c8a9'),(15402432,4696751,10202,4696749,'Salvatore Di Dio','2022-09-27 07:29:53',15401810,'','1.1',19,0,4696749,'Salvatore Di Dio','2022-09-27 07:29:53','html','fichier2_1.html','','','2022-09-27 07:29:53',4696751,15402412,'text/html',0,'0dce091d-4496-4ed9-a23c-ace9b4a74c68'),(15402438,4696751,10202,4696749,'Salvatore Di Dio','2022-09-27 07:30:02',15401810,'','1.2',19,0,4696749,'Salvatore Di Dio','2022-09-27 07:30:02','html','fichier2_2.html','','','2022-09-27 07:30:02',4696751,15402412,'text/html',0,'3e51e752-c5b5-4e75-a95a-195ad9d71e62');
/*!40000 ALTER TABLE `dlfileversion` ENABLE KEYS */;
UNLOCK TABLES;
