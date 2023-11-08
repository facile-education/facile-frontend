-- MariaDB dump 10.19-11.1.2-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: lportal_ent
-- ------------------------------------------------------
-- Server version	11.1.2-MariaDB-1:11.1.2+maria~ubu2204

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
-- Table structure for table `News_News`
--

DROP TABLE IF EXISTS `News_News`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `News_News` (
  `newsId` bigint(20) NOT NULL,
  `companyId` bigint(20) DEFAULT NULL,
  `title` varchar(75) DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `authorId` bigint(20) DEFAULT NULL,
  `isSchoolNews` tinyint(4) DEFAULT NULL,
  `isImportant` tinyint(4) DEFAULT NULL,
  `expirationDate` datetime(6) DEFAULT NULL,
  `publicationDate` datetime(6) DEFAULT NULL,
  `modificationDate` datetime(6) DEFAULT NULL,
  `imageId` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`newsId`),
  KEY `IX_419F9BFF` (`authorId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `News_News`
--

LOCK TABLES `News_News` WRITE;
/*!40000 ALTER TABLE `News_News` DISABLE KEYS */;
INSERT INTO `News_News` VALUES
(545275,20097,'Information à tous les élèves','<html>\n <head></head>\n<body>\n <p>contenu de cette information</p> \n</body></body>\n</html>',45479,0,0,'2024-06-29 23:59:59.000000','2023-11-03 15:15:00.000000','2023-11-03 14:24:46.396000',0),
(553401,20097,'Information avec une date de parution ultérieure','<html>\n <head></head>\n<body>\n <p>Contenu de l\'information avec une date de parution ultérieure</p> \n</body></body>\n</html>',45479,0,0,'2024-06-29 23:59:59.000000','2023-11-30 11:15:00.000000','2023-11-08 10:22:04.316000',0);
/*!40000 ALTER TABLE `News_News` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `News_NewsAttachedFile`
--

DROP TABLE IF EXISTS `News_NewsAttachedFile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `News_NewsAttachedFile` (
  `newsFileId` bigint(20) NOT NULL,
  `newsId` bigint(20) DEFAULT NULL,
  `groupId` bigint(20) DEFAULT NULL,
  `fileId` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`newsFileId`),
  KEY `IX_8B3796A3` (`newsId`,`groupId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `News_NewsAttachedFile`
--

LOCK TABLES `News_NewsAttachedFile` WRITE;
/*!40000 ALTER TABLE `News_NewsAttachedFile` DISABLE KEYS */;
/*!40000 ALTER TABLE `News_NewsAttachedFile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `News_NewsPopulation`
--

DROP TABLE IF EXISTS `News_NewsPopulation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `News_NewsPopulation` (
  `newsId` bigint(20) NOT NULL,
  `groupId` bigint(20) NOT NULL,
  `roleId` bigint(20) NOT NULL,
  PRIMARY KEY (`newsId`,`groupId`,`roleId`),
  KEY `IX_637D161D` (`groupId`,`roleId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `News_NewsPopulation`
--

LOCK TABLES `News_NewsPopulation` WRITE;
/*!40000 ALTER TABLE `News_NewsPopulation` DISABLE KEYS */;
INSERT INTO `News_NewsPopulation` VALUES
(545275,55984,45103),
(553401,55984,45103);
/*!40000 ALTER TABLE `News_NewsPopulation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `News_NewsRead`
--

DROP TABLE IF EXISTS `News_NewsRead`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `News_NewsRead` (
  `newsId` bigint(20) NOT NULL,
  `userId` bigint(20) NOT NULL,
  `readDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`newsId`,`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `News_NewsRead`
--

LOCK TABLES `News_NewsRead` WRITE;
/*!40000 ALTER TABLE `News_NewsRead` DISABLE KEYS */;
INSERT INTO `News_NewsRead` VALUES
(545275,45479,'2023-11-03 14:08:31.828000'),
(553401,45479,'2023-11-08 10:22:04.317000');
/*!40000 ALTER TABLE `News_NewsRead` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Group_CommunityInfos`
--

DROP TABLE IF EXISTS `Group_CommunityInfos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Group_CommunityInfos` (
  `communityInfosId` bigint(20) NOT NULL,
  `groupId` bigint(20) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `creatorId` bigint(20) DEFAULT NULL,
  `creationDate` datetime(6) DEFAULT NULL,
  `expirationDate` datetime(6) DEFAULT NULL,
  `isPedagogical` tinyint(4) DEFAULT NULL,
  `isContactList` tinyint(4) DEFAULT NULL,
  `color` varchar(75) DEFAULT NULL,
  PRIMARY KEY (`communityInfosId`),
  KEY `IX_AB46DF1B` (`creatorId`,`status`),
  KEY `IX_F7C4C313` (`expirationDate`),
  KEY `IX_A457E108` (`groupId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Group_CommunityInfos`
--

LOCK TABLES `Group_CommunityInfos` WRITE;
/*!40000 ALTER TABLE `Group_CommunityInfos` DISABLE KEYS */;
INSERT INTO `Group_CommunityInfos` VALUES
(545137,545134,0,45479,'2023-11-03 16:11:01.416000','2024-06-29 23:59:59.000000',0,1,'#99B9E9');
/*!40000 ALTER TABLE `Group_CommunityInfos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Course_Homework`
--

DROP TABLE IF EXISTS `Course_Homework`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Course_Homework` (
  `homeworkId` bigint(20) NOT NULL,
  `homeworkType` int(11) DEFAULT NULL,
  `courseId` bigint(20) DEFAULT NULL,
  `teacherId` bigint(20) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `modificationDate` datetime(6) DEFAULT NULL,
  `sourceSessionId` bigint(20) DEFAULT NULL,
  `targetSessionId` bigint(20) DEFAULT NULL,
  `targetDate` datetime(6) DEFAULT NULL,
  `isCustomStudentList` tinyint(4) DEFAULT NULL,
  `estimatedTime` int(11) DEFAULT NULL,
  `publicationDate` datetime(6) DEFAULT NULL,
  `isDraft` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`homeworkId`),
  KEY `IX_4066B264` (`courseId`),
  KEY `IX_B8BB608C` (`sourceSessionId`),
  KEY `IX_41BFF156` (`targetSessionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Course_Homework`
--

LOCK TABLES `Course_Homework` WRITE;
/*!40000 ALTER TABLE `Course_Homework` DISABLE KEYS */;
INSERT INTO `Course_Homework` VALUES
(545428,1,56504,45479,'Travail à faire','2023-11-03 14:59:58.692000',111831,111909,'2023-11-07 10:35:00.812000',1,90,'2023-11-03 15:59:00.000000',0);
/*!40000 ALTER TABLE `Course_Homework` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Course_StudentHomework`
--

DROP TABLE IF EXISTS `Course_StudentHomework`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Course_StudentHomework` (
  `studentHomeworkId` bigint(20) NOT NULL,
  `homeworkId` bigint(20) DEFAULT NULL,
  `studentId` bigint(20) DEFAULT NULL,
  `isDone` tinyint(4) DEFAULT NULL,
  `isSent` tinyint(4) DEFAULT NULL,
  `sentDate` datetime(6) DEFAULT NULL,
  `sentFileId` bigint(20) DEFAULT NULL,
  `isCorrected` tinyint(4) DEFAULT NULL,
  `comment_` longtext DEFAULT NULL,
  `correctionDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`studentHomeworkId`),
  KEY `IX_4783238C` (`homeworkId`),
  KEY `IX_5366EAF8` (`studentId`,`homeworkId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Course_StudentHomework`
--

LOCK TABLES `Course_StudentHomework` WRITE;
/*!40000 ALTER TABLE `Course_StudentHomework` DISABLE KEYS */;
INSERT INTO `Course_StudentHomework` VALUES
(545429,545428,47461,0,0,NULL,0,0,NULL,NULL);
/*!40000 ALTER TABLE `Course_StudentHomework` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AccountGroup`
--

DROP TABLE IF EXISTS `AccountGroup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `AccountGroup` (
  `mvccVersion` bigint(20) NOT NULL DEFAULT 0,
  `uuid_` varchar(75) DEFAULT NULL,
  `externalReferenceCode` varchar(75) DEFAULT NULL,
  `accountGroupId` bigint(20) NOT NULL,
  `companyId` bigint(20) DEFAULT NULL,
  `userId` bigint(20) DEFAULT NULL,
  `userName` varchar(75) DEFAULT NULL,
  `createDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `defaultAccountGroup` tinyint(4) DEFAULT NULL,
  `description` varchar(75) DEFAULT NULL,
  `name` varchar(75) DEFAULT NULL,
  `type_` varchar(75) DEFAULT NULL,
  PRIMARY KEY (`accountGroupId`),
  UNIQUE KEY `IX_F7BFA1CD` (`companyId`,`externalReferenceCode`),
  KEY `IX_38BDB33` (`companyId`,`defaultAccountGroup`),
  KEY `IX_B4733E65` (`companyId`,`type_`),
  KEY `IX_7A90D7AC` (`uuid_`,`companyId`),
  KEY `IX_8EE6A92F` (`companyId`,`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AccountGroup`
--

LOCK TABLES `AccountGroup` WRITE;
/*!40000 ALTER TABLE `AccountGroup` DISABLE KEYS */;
INSERT INTO `AccountGroup` VALUES
(0,'6ca138ab-2456-deea-4f46-902de3fde081','6ca138ab-2456-deea-4f46-902de3fde081',32108,20097,20101,NULL,'2023-10-02 11:53:08.317000','2023-10-02 11:53:08.317000',1,'This account group is used for guest users.','Guest',NULL);
/*!40000 ALTER TABLE `AccountGroup` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Group_MembershipActivity`
--

DROP TABLE IF EXISTS `Group_MembershipActivity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Group_MembershipActivity` (
  `membershipActivityId` bigint(20) NOT NULL,
  `groupId` bigint(20) DEFAULT NULL,
  `actionUserId` bigint(20) DEFAULT NULL,
  `targetUserIds` varchar(300) DEFAULT NULL,
  `incoming` tinyint(4) DEFAULT NULL,
  `movementDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`membershipActivityId`),
  KEY `IX_DE72377F` (`groupId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Group_MembershipActivity`
--

LOCK TABLES `Group_MembershipActivity` WRITE;
/*!40000 ALTER TABLE `Group_MembershipActivity` DISABLE KEYS */;
INSERT INTO `Group_MembershipActivity` VALUES
(545138,545134,45479,'47461',1,'2023-11-03 16:11:01.576000');
/*!40000 ALTER TABLE `Group_MembershipActivity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users_Groups`
--

DROP TABLE IF EXISTS `Users_Groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Users_Groups` (
  `companyId` bigint(20) NOT NULL,
  `groupId` bigint(20) NOT NULL,
  `userId` bigint(20) NOT NULL,
  `ctCollectionId` bigint(20) NOT NULL DEFAULT 0,
  `ctChangeType` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`groupId`,`userId`,`ctCollectionId`),
  KEY `IX_3499B657` (`companyId`),
  KEY `IX_F10B6C6B` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users_Groups`
--

LOCK TABLES `Users_Groups` WRITE;
/*!40000 ALTER TABLE `Users_Groups` DISABLE KEYS */;
INSERT INTO `Users_Groups` VALUES
(20097,20121,20125,0,NULL),
(20097,545134,45479,0,NULL),
(20097,545134,47461,0,NULL);
/*!40000 ALTER TABLE `Users_Groups` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-11-08 10:23:23