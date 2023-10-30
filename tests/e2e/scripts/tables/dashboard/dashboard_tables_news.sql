DROP TABLE IF EXISTS `News_News`;

CREATE TABLE `News_News` (
  `newsId` bigint(20) NOT NULL,
  `companyId` bigint(20) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` longtext NOT NULL,
  `authorId` bigint(20) NOT NULL,
  `isSchoolNews` tinyint(1) NOT NULL,
  `isImportant` tinyint(1) NOT NULL,
  `expirationDate` datetime(6) NOT NULL,
  `publicationDate` datetime(6) NOT NULL,
  `modificationDate` datetime(6) NOT NULL,
  `imageId` bigint(20) NOT NULL,
  PRIMARY KEY (`newsId`)
);

INSERT INTO News_News (newsId,companyId,title,content,authorId,isSchoolNews,isImportant,expirationDate,publicationDate,modificationDate,imageId) VALUES
	 (561001,20097,'Annonce déjà existante','<html> <head></head><body><p>Contenu d''un annonce déjà existante destinée aux élèves</p></body></html>',58811,1,0,'2024-06-29 23:59:59.000000','2023-10-30 14:15:00.000000','2023-10-30 13:22:00.127000',0),
	 (561302,20097,'Deuxième annonce','<html>
 <head></head>
<body>
 <p>Ceci est une deuxième annonce</p> 
</body></body>
</html>',58811,1,0,'2024-06-29 23:59:59.000000','2023-10-30 14:45:00.000000','2023-10-30 13:45:26.511000',0);

DROP TABLE IF EXISTS `User_NewsAdmin`;

CREATE TABLE `User_NewsAdmin` (
  `newsAdminId` bigint(20) NOT NULL,
  `userId` bigint(20) NOT NULL,
  `schoolId` bigint(20) NOT NULL,
  PRIMARY KEY (`newsAdminId`)
);

INSERT INTO User_NewsAdmin (newsAdminId, userId, schoolId) VALUES
  (466184, 52216, 45405),
  (560501, 45479, 45405);
