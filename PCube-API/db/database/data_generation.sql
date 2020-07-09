/*************************************/
/*            TABLE ROLE             */
/*************************************/
INSERT INTO role(id, role_name, access_level) VALUES(1, 'admin', 1);
INSERT INTO role(id, role_name, access_level) VALUES(2, 'project_manager', 2);
INSERT INTO role(id, role_name, access_level) VALUES(3, 'member', 3);

/*************************************/
/*              TABLE USER           */
/*************************************/

/* email : a   password : a */
INSERT INTO user VALUES(1, 'SÉBASTIEN', 'STÉBENNE', 'A', '$2b$12$zDK.aT8zu/Hnm/GXa/UaMe1X50zel/7Brpiug0Wfi060Ofvmccu4O', '$6$15Bir2NlAsYMfC.7', 1, 1);
/* email : p   password : p */
INSERT INTO user VALUES(2, 'OUSSEMA', 'BOUTAOUS', 'P', '$2b$12$4dmDuplWCug.VsBE.ZrDseZwVwa4g1GeGuEW077.20fAo2gEW5UrO', '$6$/oiErowJym5ILxGi', 1, 2);
/* email : m   password : m */
INSERT INTO user VALUES(3, 'ALEXANDRE-THIBAULT', 'ARCOLE', 'M', '$2b$12$YGVT18G7YzzeJ/4KjE4YWuibEqhor3j1LkXApztI3EWTXonacTiKW', '$6$BN8mbkhkG3WY9hSw', 1, 3);

/*************************************/
/*          TABLE PROJECT            */
/*************************************/
INSERT INTO project VALUES(1,"SOUPER NOEL 2020", 1);
INSERT INTO project VALUES(2,"SOUPER NOEL 2019", 2);
INSERT INTO project VALUES(3,"SOUPER NOEL 2018", 3);
INSERT INTO project VALUES(4,"RÉCEPTION - SN - 2020", 1);
INSERT INTO project VALUES(5,"CUISINE - SN - 2020", 1);
INSERT INTO project VALUES(6,"MARKETING - SN - 2020", 1);
INSERT INTO project VALUES(7,"SOUS-PROJET 1", 5);
INSERT INTO project VALUES(8,"SOUS-PROJET 1.1", 7);
INSERT INTO project VALUES(9,"SOUS-PROJET 1.1.1", 8);

/*************************************/
/*          TABLE ACTIVITY           */
/*************************************/
INSERT INTO activity VALUES(1,"COURSE DE PATATE");
INSERT INTO activity VALUES(2,"COURSE DE BANANE");
INSERT INTO activity VALUES(3,"COURSE DE RAVIOLIE");
INSERT INTO activity VALUES(4,"COURSE DE POMME");
INSERT INTO activity VALUES(5,"COURSE DE CHAT");

/*************************************/
/*      TABLE EXPENSE ACCOUNT        */
/*************************************/
INSERT INTO accounting_time_category VALUES(1,"COMPTE ABC", 1);
INSERT INTO accounting_time_category VALUES(2,"COMPTE XYZ", 2);
INSERT INTO accounting_time_category VALUES(3,"COMPTE DEF", 3);
INSERT INTO accounting_time_category VALUES(4,"SOUS COMPTE 1", 1);
INSERT INTO accounting_time_category VALUES(5,"SOUS COMPTE 2", 1);
INSERT INTO accounting_time_category VALUES(6,"SOUS COMPTE 3", 1);


/*************************************/
/*           TABLE TIMELINE          */
/*************************************/
INSERT INTO timeline VALUES (1,'2020-07-01','8:00','11:00',6,1,1,1);
INSERT INTO timeline VALUES (2,'2020-07-01','12:00','17:00',6,1,1,1);
INSERT INTO timeline VALUES (3,'2020-07-02','8:00','11:00',6,1,1,1);
INSERT INTO timeline VALUES (4,'2020-07-02','12:00','17:00',6,1,1,1);
INSERT INTO timeline VALUES (5,'2020-07-02','18:00','21:00',6,1,1,1);
INSERT INTO timeline VALUES (6,'2020-07-03','23:00','01:00',6,1,1,1);
INSERT INTO timeline VALUES (7,'2020-07-01','8:00','11:00',6,1,1,3);
INSERT INTO timeline VALUES (8,'2020-07-01','12:00','17:00',6,1,1,3);
INSERT INTO timeline VALUES (9,'2020-07-02','8:00','11:00',6,1,1,3);
INSERT INTO timeline VALUES (10,'2020-07-02','12:00','17:00',6,1,1,3);
INSERT INTO timeline VALUES (11,'2020-07-02','18:00','21:00',6,1,1,3);
INSERT INTO timeline VALUES (12,'2020-07-03','23:00','01:00',6,1,1,3);
INSERT INTO timeline VALUES (13,'2020-07-01','8:00','11:00',1,1,3,2);
INSERT INTO timeline VALUES (14,'2020-07-01','12:00','17:00',1,1,3,2);
INSERT INTO timeline VALUES (15,'2020-07-02','8:00','11:00',1,1,3,2);
INSERT INTO timeline VALUES (16,'2020-07-02','12:00','17:00',1,1,3,2);
INSERT INTO timeline VALUES (17,'2020-07-02','18:00','21:00',1,1,3,2);
INSERT INTO timeline VALUES (18,'2020-07-03','23:00','01:00',1,1,3,2);