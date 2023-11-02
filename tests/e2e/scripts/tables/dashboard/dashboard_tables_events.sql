DROP TABLE IF EXISTS `Agenda_Event`;
-- Création de la table Agenda_Event
CREATE TABLE Agenda_Event (
    eventId INT,
    companyId INT,
    startDate DATETIME,
    endDate DATETIME,
    title VARCHAR(255),
    description TEXT,
    location VARCHAR(255),
    authorId INT,
    PRIMARY KEY (eventId)
);

-- Insertion des données dans la table Agenda_Event
INSERT INTO Agenda_Event (eventId,companyId,startDate,endDate,title,description,location,authorId) VALUES
	 (566301,20097,'2023-11-02 11:00:50','2023-11-03 11:00:00','Évènement pour tous les personnels','<html>
 <head></head>
<body>
 <p>Contenu de l''évènement pour tous les personnels</p> 
</body></body>
</html>','Lieu de l''événement pour tous les personnels',58811),
	 (566302,20097,'2023-11-02 11:00:12','2023-11-03 11:00:00','Évènement pour tous les élèves','<html>
 <head></head>
<body>
 <p>Contenu de l''évènement pour tous les élèves</p> 
</body></body>
</html>','Lieu de l''évènement pour tous les élèves',58811);

DROP TABLE IF EXISTS `Agenda_EventPopulation`;
-- Création de la table Agenda_EventPopulation
CREATE TABLE Agenda_EventPopulation (
    eventId INT,
    groupId INT,
    roleId INT,
    PRIMARY KEY (eventId, groupId)
);

-- Insertion des données dans la table Agenda_EventPopulation
INSERT INTO Agenda_EventPopulation (eventId,groupId,roleId) VALUES
	 (563201,45407,45302),
	 (563202,45407,45103),
	 (566001,45407,45302),
	 (566301,45407,45302),
	 (566302,45407,45103);

DROP TABLE IF EXISTS `Agenda_EventRead`;
-- Création de la table Agenda_EventRead
CREATE TABLE Agenda_EventRead (
    eventId INT,
    userId INT,
    readDate DATETIME,
    PRIMARY KEY (eventId, userId)
);

-- Insertion des données dans la table Agenda_EventRead
INSERT INTO Agenda_EventRead (eventId,userId,readDate) VALUES
	 (563201,58811,'2023-10-31 09:10:21'),
	 (563202,58811,'2023-10-31 09:12:21'),
	 (566001,58811,'2023-11-02 09:40:28'),
	 (566301,58811,'2023-11-02 10:00:50'),
	 (566302,58811,'2023-11-02 10:02:12');
