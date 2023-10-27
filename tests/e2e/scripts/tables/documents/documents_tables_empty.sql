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
-- Table structure for table `AMImageEntry`
--

DROP TABLE IF EXISTS `AMImageEntry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `AMImageEntry` (
  `uuid_` varchar(75) DEFAULT NULL,
  `amImageEntryId` bigint(20) NOT NULL,
  `groupId` bigint(20) DEFAULT NULL,
  `companyId` bigint(20) DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `configurationUuid` varchar(75) DEFAULT NULL,
  `fileVersionId` bigint(20) DEFAULT NULL,
  `mimeType` varchar(75) DEFAULT NULL,
  `height` int(11) DEFAULT NULL,
  `width` int(11) DEFAULT NULL,
  `size_` bigint(20) DEFAULT NULL,
  `mvccVersion` bigint(20) NOT NULL DEFAULT 0,
  `ctCollectionId` bigint(20) NOT NULL DEFAULT 0,
  PRIMARY KEY (`amImageEntryId`,`ctCollectionId`),
  UNIQUE KEY `IX_EBBEA9CD` (`configurationUuid`,`fileVersionId`,`ctCollectionId`),
  UNIQUE KEY `IX_681D2FFD` (`uuid_`,`groupId`,`ctCollectionId`),
  KEY `IX_1BA41EE0` (`companyId`,`configurationUuid`,`ctCollectionId`),
  KEY `IX_8EB944BD` (`companyId`,`ctCollectionId`),
  KEY `IX_24B252D6` (`configurationUuid`,`ctCollectionId`),
  KEY `IX_6B796BFC` (`fileVersionId`,`ctCollectionId`),
  KEY `IX_E7EE92FF` (`groupId`,`ctCollectionId`),
  KEY `IX_BDB49A3B` (`uuid_`,`companyId`,`ctCollectionId`),
  KEY `IX_668A85C9` (`uuid_`,`ctCollectionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Only delete concern row of table `AssetEntry`
--

-- TODO: CREATE TABLE if not exist
-- TODO: get classNameId of dlfileEntry and dlFolder dynamically with table className


DELETE FROM AssetEntry
WHERE classNameId = 20010;
DELETE FROM AssetEntry
WHERE classNameId = 20015;

--
-- Table structure for table `FriendlyURLEntry`
--

DROP TABLE IF EXISTS `FriendlyURLEntry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `FriendlyURLEntry` (
  `mvccVersion` bigint(20) NOT NULL DEFAULT 0,
  `ctCollectionId` bigint(20) NOT NULL DEFAULT 0,
  `uuid_` varchar(75) DEFAULT NULL,
  `defaultLanguageId` varchar(75) DEFAULT NULL,
  `friendlyURLEntryId` bigint(20) NOT NULL,
  `groupId` bigint(20) DEFAULT NULL,
  `companyId` bigint(20) DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `classNameId` bigint(20) DEFAULT NULL,
  `classPK` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`friendlyURLEntryId`,`ctCollectionId`),
  UNIQUE KEY `IX_D51F1A48` (`uuid_`,`groupId`,`ctCollectionId`),
  KEY `IX_FE1EF2E9` (`groupId`,`classNameId`,`classPK`,`ctCollectionId`),
  KEY `IX_F1E51DC6` (`uuid_`,`companyId`,`ctCollectionId`),
  KEY `IX_3328CB1E` (`uuid_`,`ctCollectionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `FriendlyURLEntryLocalization`
--

DROP TABLE IF EXISTS `FriendlyURLEntryLocalization`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `FriendlyURLEntryLocalization` (
  `mvccVersion` bigint(20) NOT NULL DEFAULT 0,
  `ctCollectionId` bigint(20) NOT NULL DEFAULT 0,
  `friendlyURLEntryLocalizationId` bigint(20) NOT NULL,
  `companyId` bigint(20) DEFAULT NULL,
  `friendlyURLEntryId` bigint(20) DEFAULT NULL,
  `languageId` varchar(75) DEFAULT NULL,
  `urlTitle` varchar(255) DEFAULT NULL,
  `groupId` bigint(20) DEFAULT NULL,
  `classNameId` bigint(20) DEFAULT NULL,
  `classPK` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`friendlyURLEntryLocalizationId`,`ctCollectionId`),
  UNIQUE KEY `IX_BBF3E90F` (`friendlyURLEntryId`,`languageId`,`ctCollectionId`),
  UNIQUE KEY `IX_29720B13` (`groupId`,`classNameId`,`languageId`,`urlTitle`,`ctCollectionId`),
  KEY `IX_4F41A5C8` (`friendlyURLEntryId`,`ctCollectionId`),
  KEY `IX_40A51197` (`groupId`,`classNameId`,`classPK`,`languageId`,`ctCollectionId`),
  KEY `IX_C753170C` (`groupId`,`classNameId`,`urlTitle`,`ctCollectionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `FriendlyURLEntryMapping`
--

DROP TABLE IF EXISTS `FriendlyURLEntryMapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `FriendlyURLEntryMapping` (
  `mvccVersion` bigint(20) NOT NULL DEFAULT 0,
  `ctCollectionId` bigint(20) NOT NULL DEFAULT 0,
  `friendlyURLEntryMappingId` bigint(20) NOT NULL,
  `companyId` bigint(20) DEFAULT NULL,
  `classNameId` bigint(20) DEFAULT NULL,
  `classPK` bigint(20) DEFAULT NULL,
  `friendlyURLEntryId` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`friendlyURLEntryMappingId`,`ctCollectionId`),
  UNIQUE KEY `IX_5BE324B9` (`classNameId`,`classPK`,`ctCollectionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Table structure for table `Document_Version`
--

DROP TABLE IF EXISTS `Document_Version`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Document_Version` (
  `fileVersionId` bigint(20) NOT NULL,
  `dlFileEntryId` bigint(20) DEFAULT NULL,
  `versionNumber` double DEFAULT NULL,
  `comment_` varchar(250) DEFAULT NULL,
  `downloadCount` bigint(20) DEFAULT NULL,
  `viewCount` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`fileVersionId`),
  KEY `IX_187567B2` (`dlFileEntryId`,`versionNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Document_Version`
--

LOCK TABLES `Document_Version` WRITE;
/*!40000 ALTER TABLE `Document_Version` DISABLE KEYS */;
INSERT INTO `Document_Version` VALUES (549133,549120,549121,NULL,0,1);
/*!40000 ALTER TABLE `Document_Version` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DLFileEntryMetadata`
--

DROP TABLE IF EXISTS `DLFileEntryMetadata`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `DLFileEntryMetadata` (
  `mvccVersion` bigint(20) NOT NULL DEFAULT 0,
  `ctCollectionId` bigint(20) NOT NULL DEFAULT 0,
  `uuid_` varchar(75) DEFAULT NULL,
  `fileEntryMetadataId` bigint(20) NOT NULL,
  `companyId` bigint(20) DEFAULT NULL,
  `DDMStorageId` bigint(20) DEFAULT NULL,
  `DDMStructureId` bigint(20) DEFAULT NULL,
  `fileEntryId` bigint(20) DEFAULT NULL,
  `fileVersionId` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`fileEntryMetadataId`,`ctCollectionId`),
  UNIQUE KEY `IX_B9210CAD` (`DDMStructureId`,`fileVersionId`,`ctCollectionId`),
  KEY `IX_8D4F58BC` (`fileEntryId`,`ctCollectionId`),
  KEY `IX_A158EA62` (`fileVersionId`,`ctCollectionId`),
  KEY `IX_EABA15` (`uuid_`,`companyId`,`ctCollectionId`),
  KEY `IX_EAA9CA2F` (`uuid_`,`ctCollectionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DLFileEntryMetadata`
--

LOCK TABLES `DLFileEntryMetadata` WRITE;
/*!40000 ALTER TABLE `DLFileEntryMetadata` DISABLE KEYS */;
/*!40000 ALTER TABLE `DLFileEntryMetadata` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DLOpenerFileEntryReference`
--

DROP TABLE IF EXISTS `DLOpenerFileEntryReference`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `DLOpenerFileEntryReference` (
  `dlOpenerFileEntryReferenceId` bigint(20) NOT NULL,
  `groupId` bigint(20) DEFAULT NULL,
  `companyId` bigint(20) DEFAULT NULL,
  `userId` bigint(20) DEFAULT NULL,
  `userName` varchar(75) DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `referenceKey` varchar(75) DEFAULT NULL,
  `referenceType` varchar(75) DEFAULT NULL,
  `fileEntryId` bigint(20) DEFAULT NULL,
  `type_` int(11) DEFAULT NULL,
  PRIMARY KEY (`dlOpenerFileEntryReferenceId`),
  UNIQUE KEY `IX_54148667` (`fileEntryId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DLOpenerFileEntryReference`
--

LOCK TABLES `DLOpenerFileEntryReference` WRITE;
/*!40000 ALTER TABLE `DLOpenerFileEntryReference` DISABLE KEYS */;
/*!40000 ALTER TABLE `DLOpenerFileEntryReference` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Document_EditionLock`
--

DROP TABLE IF EXISTS `Document_EditionLock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Document_EditionLock` (
  `fileId` bigint(20) NOT NULL,
  `userId` bigint(20) DEFAULT NULL,
  `editionDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`fileId`),
  KEY `IX_3618E210` (`fileId`,`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Document_EditionLock`
--

LOCK TABLES `Document_EditionLock` WRITE;
/*!40000 ALTER TABLE `Document_EditionLock` DISABLE KEYS */;
/*!40000 ALTER TABLE `Document_EditionLock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DLContent`
--

DROP TABLE IF EXISTS `DLContent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `DLContent` (
  `mvccVersion` bigint(20) NOT NULL DEFAULT 0,
  `ctCollectionId` bigint(20) NOT NULL DEFAULT 0,
  `contentId` bigint(20) NOT NULL,
  `groupId` bigint(20) DEFAULT NULL,
  `companyId` bigint(20) DEFAULT NULL,
  `repositoryId` bigint(20) DEFAULT NULL,
  `path_` varchar(255) DEFAULT NULL,
  `version` varchar(75) DEFAULT NULL,
  `data_` longblob DEFAULT NULL,
  `size_` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`contentId`,`ctCollectionId`),
  UNIQUE KEY `IX_8E223106` (`companyId`,`repositoryId`,`path_`,`version`,`ctCollectionId`),
  KEY `IX_263868C8` (`companyId`,`repositoryId`,`ctCollectionId`),
  KEY `IX_FD632DBE` (`companyId`,`repositoryId`,`path_`,`ctCollectionId`),
  KEY `IX_20C476B5` (`ctCollectionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DLContent`
--

LOCK TABLES `DLContent` WRITE;
/*!40000 ALTER TABLE `DLContent` DISABLE KEYS */;
/*!40000 ALTER TABLE `DLContent` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Document_LoolToken`
--

DROP TABLE IF EXISTS `Document_LoolToken`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Document_LoolToken` (
  `loolTokenId` bigint(20) NOT NULL,
  `userId` bigint(20) DEFAULT NULL,
  `token` varchar(75) DEFAULT NULL,
  PRIMARY KEY (`loolTokenId`),
  KEY `IX_AD44066E` (`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Document_LoolToken`
--

LOCK TABLES `Document_LoolToken` WRITE;
/*!40000 ALTER TABLE `Document_LoolToken` DISABLE KEYS */;
/*!40000 ALTER TABLE `Document_LoolToken` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DLFileEntry`
--

DROP TABLE IF EXISTS `DLFileEntry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `DLFileEntry` (
  `mvccVersion` bigint(20) NOT NULL DEFAULT 0,
  `ctCollectionId` bigint(20) NOT NULL DEFAULT 0,
  `uuid_` varchar(75) DEFAULT NULL,
  `externalReferenceCode` varchar(75) DEFAULT NULL,
  `fileEntryId` bigint(20) NOT NULL,
  `groupId` bigint(20) DEFAULT NULL,
  `companyId` bigint(20) DEFAULT NULL,
  `userId` bigint(20) DEFAULT NULL,
  `userName` varchar(75) DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `classNameId` bigint(20) DEFAULT NULL,
  `classPK` bigint(20) DEFAULT NULL,
  `repositoryId` bigint(20) DEFAULT NULL,
  `folderId` bigint(20) DEFAULT NULL,
  `treePath` longtext DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `fileName` varchar(255) DEFAULT NULL,
  `extension` varchar(75) DEFAULT NULL,
  `mimeType` varchar(75) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  `extraSettings` longtext DEFAULT NULL,
  `fileEntryTypeId` bigint(20) DEFAULT NULL,
  `version` varchar(75) DEFAULT NULL,
  `size_` bigint(20) DEFAULT NULL,
  `smallImageId` bigint(20) DEFAULT NULL,
  `largeImageId` bigint(20) DEFAULT NULL,
  `custom1ImageId` bigint(20) DEFAULT NULL,
  `custom2ImageId` bigint(20) DEFAULT NULL,
  `manualCheckInRequired` tinyint(4) DEFAULT NULL,
  `expirationDate` datetime(6) DEFAULT NULL,
  `reviewDate` datetime(6) DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`fileEntryId`,`ctCollectionId`),
  UNIQUE KEY `IX_273362A5` (`groupId`,`externalReferenceCode`,`ctCollectionId`),
  UNIQUE KEY `IX_A256938C` (`groupId`,`folderId`,`fileName`,`ctCollectionId`),
  UNIQUE KEY `IX_F7878970` (`groupId`,`folderId`,`name`,`ctCollectionId`),
  UNIQUE KEY `IX_EAAB273` (`groupId`,`folderId`,`title`,`ctCollectionId`),
  UNIQUE KEY `IX_373340C8` (`uuid_`,`groupId`,`ctCollectionId`),
  KEY `IX_33E8A112` (`companyId`,`ctCollectionId`),
  KEY `IX_5444C427` (`companyId`,`fileEntryTypeId`),
  KEY `IX_9B56081C` (`custom1ImageId`,`ctCollectionId`),
  KEY `IX_9D2F5B3B` (`custom2ImageId`,`ctCollectionId`),
  KEY `IX_C0A6F645` (`fileEntryTypeId`,`ctCollectionId`),
  KEY `IX_F951AC2E` (`folderId`,`name`,`ctCollectionId`),
  KEY `IX_60830094` (`groupId`,`ctCollectionId`),
  KEY `IX_BAF654E5` (`groupId`,`fileEntryTypeId`),
  KEY `IX_95A2D1F1` (`groupId`,`folderId`,`ctCollectionId`),
  KEY `IX_D8883586` (`groupId`,`folderId`,`fileEntryTypeId`,`ctCollectionId`),
  KEY `IX_3B20ECE` (`groupId`,`userId`,`ctCollectionId`),
  KEY `IX_87A8DFAB` (`groupId`,`userId`,`folderId`,`ctCollectionId`),
  KEY `IX_863591A1` (`largeImageId`,`ctCollectionId`),
  KEY `IX_72175754` (`mimeType`,`ctCollectionId`),
  KEY `IX_6EC7490B` (`repositoryId`,`ctCollectionId`),
  KEY `IX_277C31A8` (`repositoryId`,`folderId`,`ctCollectionId`),
  KEY `IX_A8521555` (`smallImageId`,`ctCollectionId`),
  KEY `IX_854E0F17` (`smallImageId`,`largeImageId`,`custom1ImageId`,`custom2ImageId`,`ctCollectionId`),
  KEY `IX_1F89A446` (`uuid_`,`companyId`,`ctCollectionId`),
  KEY `IX_CF17549E` (`uuid_`,`ctCollectionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DLFileEntry`
--

LOCK TABLES `DLFileEntry` WRITE;
/*!40000 ALTER TABLE `DLFileEntry` DISABLE KEYS */;
/*!40000 ALTER TABLE `DLFileEntry` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Document_Activity`
--

DROP TABLE IF EXISTS `Document_Activity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Document_Activity` (
  `activityId` bigint(20) NOT NULL,
  `fileEntryId` bigint(20) DEFAULT NULL,
  `folderId` bigint(20) DEFAULT NULL,
  `userId` bigint(20) DEFAULT NULL,
  `groupId` bigint(20) DEFAULT NULL,
  `fileName` varchar(255) DEFAULT NULL,
  `folderName` varchar(100) DEFAULT NULL,
  `type_` int(11) DEFAULT NULL,
  `modificationDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`activityId`),
  KEY `IX_2A9C07E8` (`fileEntryId`),
  KEY `IX_105B8C56` (`folderId`),
  KEY `IX_806ACC11` (`groupId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Document_Activity`
--

LOCK TABLES `Document_Activity` WRITE;
/*!40000 ALTER TABLE `Document_Activity` DISABLE KEYS */;
/*!40000 ALTER TABLE `Document_Activity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DLSyncEvent`
--

DROP TABLE IF EXISTS `DLSyncEvent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `DLSyncEvent` (
  `syncEventId` bigint(20) NOT NULL,
  `companyId` bigint(20) DEFAULT NULL,
  `modifiedTime` bigint(20) DEFAULT NULL,
  `event` varchar(75) DEFAULT NULL,
  `type_` varchar(75) DEFAULT NULL,
  `typePK` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`syncEventId`),
  UNIQUE KEY `IX_57D82B06` (`typePK`),
  KEY `IX_3D8E1607` (`modifiedTime`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DLSyncEvent`
--

LOCK TABLES `DLSyncEvent` WRITE;
/*!40000 ALTER TABLE `DLSyncEvent` DISABLE KEYS */;
/*!40000 ALTER TABLE `DLSyncEvent` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DLStorageQuota`
--

DROP TABLE IF EXISTS `DLStorageQuota`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `DLStorageQuota` (
  `mvccVersion` bigint(20) NOT NULL DEFAULT 0,
  `dlStorageQuotaId` bigint(20) NOT NULL,
  `companyId` bigint(20) DEFAULT NULL,
  `storageSize` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`dlStorageQuotaId`),
  UNIQUE KEY `IX_1214035D` (`companyId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DLStorageQuota`
--

LOCK TABLES `DLStorageQuota` WRITE;
/*!40000 ALTER TABLE `DLStorageQuota` DISABLE KEYS */;
/*!40000 ALTER TABLE `DLStorageQuota` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DLFolder`
--

DROP TABLE IF EXISTS `DLFolder`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `DLFolder` (
  `mvccVersion` bigint(20) NOT NULL DEFAULT 0,
  `ctCollectionId` bigint(20) NOT NULL DEFAULT 0,
  `uuid_` varchar(75) DEFAULT NULL,
  `externalReferenceCode` varchar(75) DEFAULT NULL,
  `folderId` bigint(20) NOT NULL,
  `groupId` bigint(20) DEFAULT NULL,
  `companyId` bigint(20) DEFAULT NULL,
  `userId` bigint(20) DEFAULT NULL,
  `userName` varchar(75) DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `repositoryId` bigint(20) DEFAULT NULL,
  `mountPoint` tinyint(4) DEFAULT NULL,
  `parentFolderId` bigint(20) DEFAULT NULL,
  `treePath` longtext DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  `lastPostDate` datetime(6) DEFAULT NULL,
  `defaultFileEntryTypeId` bigint(20) DEFAULT NULL,
  `hidden_` tinyint(4) DEFAULT NULL,
  `restrictionType` int(11) DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `statusByUserId` bigint(20) DEFAULT NULL,
  `statusByUserName` varchar(75) DEFAULT NULL,
  `statusDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`folderId`,`ctCollectionId`),
  UNIQUE KEY `IX_A1EB230D` (`groupId`,`externalReferenceCode`,`ctCollectionId`),
  UNIQUE KEY `IX_C7E346D2` (`groupId`,`parentFolderId`,`name`,`ctCollectionId`),
  UNIQUE KEY `IX_AA08D130` (`uuid_`,`groupId`,`ctCollectionId`),
  KEY `IX_67A46FAA` (`companyId`,`ctCollectionId`),
  KEY `IX_F1EC1690` (`companyId`,`status`,`ctCollectionId`),
  KEY `IX_9D91952C` (`groupId`,`ctCollectionId`),
  KEY `IX_4B18B17E` (`groupId`,`mountPoint`,`parentFolderId`,`ctCollectionId`),
  KEY `IX_45D93323` (`groupId`,`mountPoint`,`parentFolderId`,`hidden_`,`ctCollectionId`),
  KEY `IX_91065109` (`groupId`,`mountPoint`,`parentFolderId`,`hidden_`,`status`,`ctCollectionId`),
  KEY `IX_CF68C0D3` (`groupId`,`parentFolderId`,`ctCollectionId`),
  KEY `IX_7663654` (`groupId`,`parentFolderId`,`hidden_`,`status`,`ctCollectionId`),
  KEY `IX_4642F2E0` (`parentFolderId`,`name`,`ctCollectionId`),
  KEY `IX_BB15D373` (`repositoryId`,`ctCollectionId`),
  KEY `IX_F344479E` (`repositoryId`,`mountPoint`,`ctCollectionId`),
  KEY `IX_E7CD911A` (`repositoryId`,`parentFolderId`,`ctCollectionId`),
  KEY `IX_333CBAAE` (`uuid_`,`companyId`,`ctCollectionId`),
  KEY `IX_B7722F36` (`uuid_`,`ctCollectionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DLFolder`
--

LOCK TABLES `DLFolder` WRITE;
/*!40000 ALTER TABLE `DLFolder` DISABLE KEYS */;
/*!40000 ALTER TABLE `DLFolder` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DLFileVersionPreview`
--

DROP TABLE IF EXISTS `DLFileVersionPreview`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `DLFileVersionPreview` (
  `mvccVersion` bigint(20) NOT NULL DEFAULT 0,
  `ctCollectionId` bigint(20) NOT NULL DEFAULT 0,
  `dlFileVersionPreviewId` bigint(20) NOT NULL,
  `groupId` bigint(20) DEFAULT NULL,
  `companyId` bigint(20) DEFAULT NULL,
  `fileEntryId` bigint(20) DEFAULT NULL,
  `fileVersionId` bigint(20) DEFAULT NULL,
  `previewStatus` int(11) DEFAULT NULL,
  PRIMARY KEY (`dlFileVersionPreviewId`,`ctCollectionId`),
  UNIQUE KEY `IX_DA3FFE` (`fileEntryId`,`fileVersionId`,`ctCollectionId`),
  KEY `IX_D5ED40C5` (`fileEntryId`,`ctCollectionId`),
  KEY `IX_3A1CF42B` (`fileVersionId`,`ctCollectionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DLFileVersionPreview`
--

LOCK TABLES `DLFileVersionPreview` WRITE;
/*!40000 ALTER TABLE `DLFileVersionPreview` DISABLE KEYS */;
/*!40000 ALTER TABLE `DLFileVersionPreview` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DLFileVersion`
--

DROP TABLE IF EXISTS `DLFileVersion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `DLFileVersion` (
  `mvccVersion` bigint(20) NOT NULL DEFAULT 0,
  `ctCollectionId` bigint(20) NOT NULL DEFAULT 0,
  `uuid_` varchar(75) DEFAULT NULL,
  `fileVersionId` bigint(20) NOT NULL,
  `groupId` bigint(20) DEFAULT NULL,
  `companyId` bigint(20) DEFAULT NULL,
  `userId` bigint(20) DEFAULT NULL,
  `userName` varchar(75) DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `repositoryId` bigint(20) DEFAULT NULL,
  `folderId` bigint(20) DEFAULT NULL,
  `fileEntryId` bigint(20) DEFAULT NULL,
  `treePath` longtext DEFAULT NULL,
  `fileName` varchar(255) DEFAULT NULL,
  `extension` varchar(75) DEFAULT NULL,
  `mimeType` varchar(75) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  `changeLog` varchar(75) DEFAULT NULL,
  `extraSettings` longtext DEFAULT NULL,
  `fileEntryTypeId` bigint(20) DEFAULT NULL,
  `version` varchar(75) DEFAULT NULL,
  `size_` bigint(20) DEFAULT NULL,
  `checksum` varchar(75) DEFAULT NULL,
  `expirationDate` datetime(6) DEFAULT NULL,
  `reviewDate` datetime(6) DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `statusByUserId` bigint(20) DEFAULT NULL,
  `statusByUserName` varchar(75) DEFAULT NULL,
  `statusDate` datetime(6) DEFAULT NULL,
  `storeUUID` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`fileVersionId`,`ctCollectionId`),
  UNIQUE KEY `IX_10E504DF` (`fileEntryId`,`version`,`ctCollectionId`),
  UNIQUE KEY `IX_350F5CAE` (`uuid_`,`groupId`,`ctCollectionId`),
  KEY `IX_97782D6C` (`companyId`,`ctCollectionId`),
  KEY `IX_808EF252` (`companyId`,`status`,`ctCollectionId`),
  KEY `IX_759EF1C5` (`fileEntryId`,`ctCollectionId`),
  KEY `IX_C97C4DAB` (`fileEntryId`,`status`,`ctCollectionId`),
  KEY `IX_3A12DA31` (`groupId`,`folderId`,`status`,`ctCollectionId`),
  KEY `IX_DCA2C64B` (`groupId`,`folderId`,`title`,`version`,`ctCollectionId`),
  KEY `IX_9E97D7BA` (`mimeType`,`ctCollectionId`),
  KEY `IX_16CE5EAC` (`uuid_`,`companyId`,`ctCollectionId`),
  KEY `IX_48BF1DF8` (`uuid_`,`ctCollectionId`),
  KEY `IX_9940AF5C` (`companyId`,`storeUUID`,`ctCollectionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DLFileVersion`
--

LOCK TABLES `DLFileVersion` WRITE;
/*!40000 ALTER TABLE `DLFileVersion` DISABLE KEYS */;
/*!40000 ALTER TABLE `DLFileVersion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DLFileEntryType`
--

DROP TABLE IF EXISTS `DLFileEntryType`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `DLFileEntryType` (
  `mvccVersion` bigint(20) NOT NULL DEFAULT 0,
  `ctCollectionId` bigint(20) NOT NULL DEFAULT 0,
  `uuid_` varchar(75) DEFAULT NULL,
  `fileEntryTypeId` bigint(20) NOT NULL,
  `groupId` bigint(20) DEFAULT NULL,
  `companyId` bigint(20) DEFAULT NULL,
  `userId` bigint(20) DEFAULT NULL,
  `userName` varchar(75) DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `dataDefinitionId` bigint(20) DEFAULT NULL,
  `fileEntryTypeKey` varchar(75) DEFAULT NULL,
  `name` longtext DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  `scope` int(11) DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`fileEntryTypeId`,`ctCollectionId`),
  UNIQUE KEY `IX_B6F21286` (`groupId`,`dataDefinitionId`,`ctCollectionId`),
  UNIQUE KEY `IX_402227BD` (`groupId`,`fileEntryTypeKey`,`ctCollectionId`),
  UNIQUE KEY `IX_1773A6A2` (`uuid_`,`groupId`,`ctCollectionId`),
  KEY `IX_C0561BFA` (`groupId`,`ctCollectionId`),
  KEY `IX_F147FBA0` (`uuid_`,`companyId`,`ctCollectionId`),
  KEY `IX_17A61184` (`uuid_`,`ctCollectionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DLFileEntryType`
--

LOCK TABLES `DLFileEntryType` WRITE;
/*!40000 ALTER TABLE `DLFileEntryType` DISABLE KEYS */;
/*!40000 ALTER TABLE `DLFileEntryType` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DLFileShortcut`
--

DROP TABLE IF EXISTS `DLFileShortcut`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `DLFileShortcut` (
  `mvccVersion` bigint(20) NOT NULL DEFAULT 0,
  `ctCollectionId` bigint(20) NOT NULL DEFAULT 0,
  `uuid_` varchar(75) DEFAULT NULL,
  `fileShortcutId` bigint(20) NOT NULL,
  `groupId` bigint(20) DEFAULT NULL,
  `companyId` bigint(20) DEFAULT NULL,
  `userId` bigint(20) DEFAULT NULL,
  `userName` varchar(75) DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `repositoryId` bigint(20) DEFAULT NULL,
  `folderId` bigint(20) DEFAULT NULL,
  `toFileEntryId` bigint(20) DEFAULT NULL,
  `treePath` longtext DEFAULT NULL,
  `active_` tinyint(4) DEFAULT NULL,
  `lastPublishDate` datetime(6) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `statusByUserId` bigint(20) DEFAULT NULL,
  `statusByUserName` varchar(75) DEFAULT NULL,
  `statusDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`fileShortcutId`,`ctCollectionId`),
  UNIQUE KEY `IX_DD2033A4` (`uuid_`,`groupId`,`ctCollectionId`),
  KEY `IX_A46E54B6` (`companyId`,`ctCollectionId`),
  KEY `IX_80362F9C` (`companyId`,`status`,`ctCollectionId`),
  KEY `IX_8A2EF610` (`groupId`,`folderId`,`active_`,`ctCollectionId`),
  KEY `IX_CFD4D6F6` (`groupId`,`folderId`,`active_`,`status`,`ctCollectionId`),
  KEY `IX_869CA195` (`groupId`,`folderId`,`ctCollectionId`),
  KEY `IX_5CAA7254` (`toFileEntryId`,`ctCollectionId`),
  KEY `IX_FE055022` (`uuid_`,`companyId`,`ctCollectionId`),
  KEY `IX_21B07A42` (`uuid_`,`ctCollectionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DLFileShortcut`
--

LOCK TABLES `DLFileShortcut` WRITE;
/*!40000 ALTER TABLE `DLFileShortcut` DISABLE KEYS */;
/*!40000 ALTER TABLE `DLFileShortcut` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SocialActivity`
--

DROP TABLE IF EXISTS `SocialActivity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `SocialActivity` (
  `mvccVersion` bigint(20) NOT NULL DEFAULT 0,
  `ctCollectionId` bigint(20) NOT NULL DEFAULT 0,
  `activityId` bigint(20) NOT NULL,
  `groupId` bigint(20) DEFAULT NULL,
  `companyId` bigint(20) DEFAULT NULL,
  `userId` bigint(20) DEFAULT NULL,
  `createDate` bigint(20) DEFAULT NULL,
  `activitySetId` bigint(20) DEFAULT NULL,
  `mirrorActivityId` bigint(20) DEFAULT NULL,
  `classNameId` bigint(20) DEFAULT NULL,
  `classPK` bigint(20) DEFAULT NULL,
  `parentClassNameId` bigint(20) DEFAULT NULL,
  `parentClassPK` bigint(20) DEFAULT NULL,
  `type_` int(11) DEFAULT NULL,
  `extraData` longtext DEFAULT NULL,
  `receiverUserId` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`activityId`,`ctCollectionId`),
  UNIQUE KEY `IX_24810327` (`groupId`,`userId`,`createDate`,`classNameId`,`classPK`,`type_`,`receiverUserId`,`ctCollectionId`),
  KEY `IX_9E7AC81A` (`activitySetId`,`ctCollectionId`),
  KEY `IX_AD0B0FB5` (`classNameId`,`classPK`,`ctCollectionId`),
  KEY `IX_90E6DCFC` (`classNameId`,`classPK`,`type_`,`ctCollectionId`),
  KEY `IX_5AD306C4` (`companyId`,`ctCollectionId`),
  KEY `IX_A9CF2AC6` (`groupId`,`ctCollectionId`),
  KEY `IX_9C9CB625` (`groupId`,`userId`,`classNameId`,`classPK`,`type_`,`receiverUserId`,`ctCollectionId`),
  KEY `IX_A57E31D2` (`mirrorActivityId`,`classNameId`,`classPK`,`ctCollectionId`),
  KEY `IX_28C22ABD` (`mirrorActivityId`,`ctCollectionId`),
  KEY `IX_E948429` (`receiverUserId`,`ctCollectionId`),
  KEY `IX_96BE971A` (`userId`,`ctCollectionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Only delete concern row of table `ResourcePermission` (and re-add some necessary)
--

-- TODO: CREATE TABLE if not exist

DELETE FROM ResourcePermission
WHERE name = 'com.liferay.document.library.kernel.model.DLFIleEntry';
DELETE FROM ResourcePermission
WHERE name = 'com.liferay.document.library.kernel.model.DLFolder';

LOCK TABLES `ResourcePermission` WRITE;
/*!40000 ALTER TABLE `ResourcePermission` DISABLE KEYS */;
INSERT INTO `ResourcePermission` VALUES (0,0,46201,20097,'com.liferay.document.library.kernel.model.DLFileEntry',4,'com.liferay.document.library.kernel.model.DLFileEntry',0,20105,0,385,1),
(0,0,46202,20097,'com.liferay.document.library.kernel.model.DLFileEntry',4,'com.liferay.document.library.kernel.model.DLFileEntry',0,20106,0,511,1),
(0,0,46203,20097,'com.liferay.document.library.kernel.model.DLFolder',4,'com.liferay.document.library.kernel.model.DLFolder',0,20105,0,1,1),
(0,0,46204,20097,'com.liferay.document.library.kernel.model.DLFolder',4,'com.liferay.document.library.kernel.model.DLFolder',0,20106,0,511,1);
/*!40000 ALTER TABLE `ResourcePermission` ENABLE KEYS */;
UNLOCK TABLES;





--
-- Table structure for table `DDMField`
--

DROP TABLE IF EXISTS `DDMField`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `DDMField` (
  `mvccVersion` bigint(20) NOT NULL DEFAULT 0,
  `ctCollectionId` bigint(20) NOT NULL DEFAULT 0,
  `fieldId` bigint(20) NOT NULL,
  `companyId` bigint(20) DEFAULT NULL,
  `parentFieldId` bigint(20) DEFAULT NULL,
  `storageId` bigint(20) DEFAULT NULL,
  `structureVersionId` bigint(20) DEFAULT NULL,
  `fieldName` varchar(255) DEFAULT NULL,
  `fieldType` varchar(255) DEFAULT NULL,
  `instanceId` varchar(75) DEFAULT NULL,
  `localizable` tinyint(4) DEFAULT NULL,
  `priority` int(11) DEFAULT NULL,
  PRIMARY KEY (`fieldId`,`ctCollectionId`),
  UNIQUE KEY `IX_1BB20E75` (`storageId`,`instanceId`,`ctCollectionId`),
  KEY `IX_5378BAAD` (`companyId`,`fieldType`,`ctCollectionId`),
  KEY `IX_582EBFF1` (`storageId`,`ctCollectionId`),
  KEY `IX_5C0B8AE5` (`structureVersionId`,`ctCollectionId`),
  KEY `IX_600F8E00` (`storageId`,`fieldName`,`ctCollectionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `DDMFieldAttribute`
--

DROP TABLE IF EXISTS `DDMFieldAttribute`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `DDMFieldAttribute` (
  `mvccVersion` bigint(20) NOT NULL DEFAULT 0,
  `ctCollectionId` bigint(20) NOT NULL DEFAULT 0,
  `fieldAttributeId` bigint(20) NOT NULL,
  `companyId` bigint(20) DEFAULT NULL,
  `fieldId` bigint(20) DEFAULT NULL,
  `storageId` bigint(20) DEFAULT NULL,
  `attributeName` varchar(255) DEFAULT NULL,
  `languageId` varchar(75) DEFAULT NULL,
  `largeAttributeValue` longtext DEFAULT NULL,
  `smallAttributeValue` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`fieldAttributeId`,`ctCollectionId`),
  UNIQUE KEY `IX_22EEBF0C` (`fieldId`,`attributeName`,`languageId`,`ctCollectionId`),
  KEY `IX_52703248` (`attributeName`,`smallAttributeValue`,`ctCollectionId`),
  KEY `IX_EC62446F` (`storageId`,`ctCollectionId`),
  KEY `IX_1E90C536` (`storageId`,`languageId`,`ctCollectionId`),
  KEY `IX_36E78464` (`storageId`,`attributeName`,`ctCollectionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `DDMStorageLink`
--

DROP TABLE IF EXISTS `DDMStorageLink`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `DDMStorageLink` (
  `mvccVersion` bigint(20) NOT NULL DEFAULT 0,
  `ctCollectionId` bigint(20) NOT NULL DEFAULT 0,
  `uuid_` varchar(75) DEFAULT NULL,
  `storageLinkId` bigint(20) NOT NULL,
  `companyId` bigint(20) DEFAULT NULL,
  `classNameId` bigint(20) DEFAULT NULL,
  `classPK` bigint(20) DEFAULT NULL,
  `structureId` bigint(20) DEFAULT NULL,
  `structureVersionId` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`storageLinkId`,`ctCollectionId`),
  UNIQUE KEY `IX_6979A733` (`classPK`,`ctCollectionId`),
  KEY `IX_5BAF16EE` (`structureId`,`ctCollectionId`),
  KEY `IX_13E12C80` (`structureVersionId`,`ctCollectionId`),
  KEY `IX_981FDA0` (`uuid_`,`companyId`,`ctCollectionId`),
  KEY `IX_9F994F84` (`uuid_`,`ctCollectionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `DDMStructureLink`
--

DROP TABLE IF EXISTS `DDMStructureLink`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `DDMStructureLink` (
  `mvccVersion` bigint(20) NOT NULL DEFAULT 0,
  `ctCollectionId` bigint(20) NOT NULL DEFAULT 0,
  `structureLinkId` bigint(20) NOT NULL,
  `companyId` bigint(20) DEFAULT NULL,
  `classNameId` bigint(20) DEFAULT NULL,
  `classPK` bigint(20) DEFAULT NULL,
  `structureId` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`structureLinkId`,`ctCollectionId`),
  UNIQUE KEY `IX_C8DE7401` (`classNameId`,`classPK`,`structureId`,`ctCollectionId`),
  KEY `IX_4C181B39` (`classNameId`,`classPK`,`ctCollectionId`),
  KEY `IX_A2D51B64` (`ctCollectionId`),
  KEY `IX_FD8251B6` (`structureId`,`ctCollectionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-10-27 10:48:59


