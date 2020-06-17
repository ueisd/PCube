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
