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
-- Table structure for table `About_UserReadVersionNote`
--

DROP TABLE IF EXISTS `About_UserReadVersionNote`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `About_UserReadVersionNote` (
  `userId` bigint(20) NOT NULL,
  `hasReadLastVersionNote` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`userId`),
  KEY `IX_CB506AB5` (`hasReadLastVersionNote`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `About_UserReadVersionNote`
--

LOCK TABLES `About_UserReadVersionNote` WRITE;
/*!40000 ALTER TABLE `About_UserReadVersionNote` DISABLE KEYS */;
INSERT INTO `About_UserReadVersionNote` (`userId`, `hasReadLastVersionNote`) VALUES (11105,1),(332442,1);
/*!40000 ALTER TABLE `About_UserReadVersionNote` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `About_VersionNote`
--

DROP TABLE IF EXISTS `About_VersionNote`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `About_VersionNote` (
  `versionNoteId` bigint(20) NOT NULL,
  `title` varchar(75) DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `versionNoteDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`versionNoteId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `About_VersionNote`
--

LOCK TABLES `About_VersionNote` WRITE;
/*!40000 ALTER TABLE `About_VersionNote` DISABLE KEYS */;
INSERT INTO `About_VersionNote` (`versionNoteId`, `title`, `content`, `versionNoteDate`) VALUES (19538707,'1.0.2','<html>\n <head></head>\n<body>\n <h3>Enseignants: Un nouvel onglet est disponible dans Cours et devoirs!&nbsp;</h3>\n <p>Bla bla bla bla, en gros, voila quoi.</p>\n <p>Vous pouvez a présent…</p>\n <p>[Image]</p>\n</body></body>\n</html>','2023-09-12 13:35:17.994000'),(19542708,'1.0.3','<html>\n <head></head>\n<body>\n <h3>Attention les yeux, notre toute dernière version arrive!</h3>\n <h4>Nouveautés:&nbsp;</h4>\n <ul>\n  <li>Une nouvelle interface de fou furieux!</li>\n  <li>Les messages sont maintenant personnalisables</li>\n  <li>Nous vous avons compris, le temps de session est (enfin) ramené à 45 minutes pour éviter les déconnexions intempestives durant les cours</li>\n </ul>\n <h4>Correctifs:</h4>\n <ul>\n  <li>Nous avons travaillé dur pour résoudre un bug qui faisait que lorsque vous téléversiez un fichier de grande taille, celui ci parfois échouait</li>\n  <li>En tache de fond nos équipes ont travaillé à améliorer l\'accessibilité du site au plus grand nombre, répondant ainsi à la norme <a href=\"http://www.ech.ch/vechweb/page?p=dossier&amp;documentNumber=eCH-0059\">http://www.ech.ch/vechweb/page?p=dossier&amp;documentNumber=eCH-0059</a></li>\n </ul>\n</body></body>\n</html>','2023-09-13 08:07:27.158000'),(19590704,'1.0.4','<html>\n <head></head>\n<body>\n <p>Encore et encore des nouvautées en tout genre…</p>\n</body></body>\n</html>','2023-09-28 13:39:43.906000');
/*!40000 ALTER TABLE `About_VersionNote` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
