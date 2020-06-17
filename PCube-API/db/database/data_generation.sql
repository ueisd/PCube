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
INSERT INTO user VALUES(1, 'Sébastien', 'Stébenne', 'a', '$2b$12$zDK.aT8zu/Hnm/GXa/UaMe1X50zel/7Brpiug0Wfi060Ofvmccu4O', '$6$15Bir2NlAsYMfC.7', 1, 1);
/* email : p   password : p */
INSERT INTO user VALUES(2, 'Sébastien', 'Stébenne', 'p', '$2b$12$4dmDuplWCug.VsBE.ZrDseZwVwa4g1GeGuEW077.20fAo2gEW5UrO', '$6$/oiErowJym5ILxGi', 1, 2);
/* email : m   password : m */
INSERT INTO user VALUES(3, 'Sébastien', 'Stébenne', 'm', '$2b$12$YGVT18G7YzzeJ/4KjE4YWuibEqhor3j1LkXApztI3EWTXonacTiKW', '$6$BN8mbkhkG3WY9hSw', 1, 3);

/*************************************/
/*          TABLE PROJECT            */
/*************************************/
INSERT INTO project VALUES(1,"Souper Noel 2020", 1);
INSERT INTO project VALUES(2,"Souper Noel 2019", 2);
INSERT INTO project VALUES(3,"Souper Noel 2018", 3);
INSERT INTO project VALUES(4,"Réception - SN - 2020", 1);
INSERT INTO project VALUES(5,"Cuisine - SN - 2020", 1);
INSERT INTO project VALUES(6,"Marketing - SN - 2020", 1);

/*************************************/
/*          TABLE ACTIVITY           */
/*************************************/
INSERT INTO activity VALUES(1,"Course de patate");
INSERT INTO activity VALUES(2,"Course de banane");
INSERT INTO activity VALUES(3,"Course de raviolie");
INSERT INTO activity VALUES(4,"Course de pomme");
INSERT INTO activity VALUES(5,"Course de chat");