/*************************************/
/*            TABLE ROLE             */
/*************************************/
INSERT INTO role(id, role_name, access_level)
VALUES(1, 'ADMIN', 1);
INSERT INTO role(id, role_name, access_level)
VALUES(2, 'GESTIONNAIRE', 2);
INSERT INTO role(id, role_name, access_level)
VALUES(3, 'MEMBRE', 3);
/*************************************/
/*              TABLE USER           */
/*************************************/
/* email : a   password : a */
INSERT INTO user
VALUES(
    1,
    'ADMIN',
    'ADMIN',
    'A',
    '$2b$12$zDK.aT8zu/Hnm/GXa/UaMe1X50zel/7Brpiug0Wfi060Ofvmccu4O',
    '$6$15Bir2NlAsYMfC.7',
    1,
    1
  );
/* email : p   password : p */
INSERT INTO user
VALUES(
    2,
    'PM',
    'PM',
    'P',
    '$2b$12$4dmDuplWCug.VsBE.ZrDseZwVwa4g1GeGuEW077.20fAo2gEW5UrO',
    '$6$/oiErowJym5ILxGi',
    1,
    2
  );
/* email : m   password : m */
INSERT INTO user
VALUES(
    3,
    'MEMBER',
    'MEMBER',
    'M',
    '$2b$12$YGVT18G7YzzeJ/4KjE4YWuibEqhor3j1LkXApztI3EWTXonacTiKW',
    '$6$BN8mbkhkG3WY9hSw',
    1,
    3
  );
/* Password est leur nom avec la première lettre en majuscule et le reste en minuscule */
INSERT INTO user
VALUES (
    4,
    'Taylor',
    'Rosales',
    'Taylor@Rosales.com',
    '$2b$12$58MeXSgcJTQkXsUVJz8aO.Mee5I0zdHN6JwtiGzJ.wmIFCwCgfOHO',
    'T3BSTP+THT5MNvQCfJXPeg==',
    1,
    3
  );
INSERT INTO user
VALUES (
    5,
    'Annabel',
    'Fischer',
    'Annabel@Fischer',
    '$2b$12$g9Tzj23DWVUvmLB3J1GncOfiJruWSeQFFdBSeWY/5gRu1hkx3zIfe',
    'NgB6a89Xy/JpJCnIB8L1lQ==',
    1,
    3
  );
INSERT INTO user
VALUES (
    6,
    'Anya',
    'Hammond',
    'Anya@Hammond.com',
    '$2b$12$R9rmMhYrvJM7VQSn9zQGpuowgcl7BDhvRpZWgSvnmUNmsMdpL.srG',
    'z84jEIqckQY/8sH3TVoVjg==',
    1,
    3
  );
INSERT INTO user
VALUES (
    7,
    'Nellie',
    'Thornton',
    'Nellie@Thornton.com',
    '$2b$12$VxRqhq73UnJeaT4l7QZM6uyRPlYRIada1/OHj3VGOENs.jZrAhu4q',
    'UphvPdPnsHf5kLwCeDbpfg==',
    1,
    3
  );
INSERT INTO user
VALUES (
    8,
    'Kimberley',
    'Keller',
    'Kimberley@Keller.com',
    '$2b$12$2LMj0HY99iGLeroqgF2MUORMuimy7D1eOsaG18zHIJ41VAt6UiDmS',
    'kf5u66J1DClmm+MmefD3Pg==',
    1,
    3
  );
INSERT INTO user
VALUES (
    9,
    'Kane',
    'Nod',
    'Kane@Nod.com',
    '$2b$12$nxhwQiZDuhBE4XCqtSP9f.KLvyxVlxHRwCxvm4q1VNVzsoNYs4H6a',
    '2TY/1ZoZZW5AFZCwjdLbWA==',
    1,
    1
  );
INSERT INTO user
VALUES (
    10,
    'Redmond',
    'Boyle',
    'Redmond@Boyle.com',
    '$2b$12$VDIXiBjA6YkHF9jZnqHCs.hvi.2GWUUI0wF5o/uHZzZBDYB8FxRYy',
    'S2uWMTuldT//ExzN3YB6EA==',
    1,
    1
  );
INSERT INTO user
VALUES (
    11,
    'Kirce',
    'James',
    'Kirce@James.ca',
    '$2b$12$IcbhTrWNPNma14VStfG3.u1AVktV5AmyHltgctWOMpPAX9EIR4wAm',
    'Pj+nXVlsvMNEK6HRR4pzpA==',
    1,
    2
  );
INSERT INTO user
VALUES (
    12,
    'Kilian',
    'Qatar',
    'Kilian@Qatar.ca',
    '$2b$12$2YOm7FMXv8bllvTr6YkN6e5ADD2Rk0la9dJBO1rn9BH2s9e8WBKqy',
    '1sgsQLukadIXOMAyYcaDTA==',
    1,
    2
  );
INSERT INTO user
VALUES (
    13,
    'Salma',
    'Pennington',
    'Salma@Pennington.eu',
    '$2b$12$aaCLrtF1P4nOjPrCK3PjnuqvJ0W1dedyg5LvPsX26jWWD.AiRFYPq',
    '6boKISwr7gddhC34NTRyew==',
    1,
    3
  );
INSERT INTO user
VALUES (
    14,
    'Louise',
    'Strickland',
    'Louise',
    '$2b$12$T5GRqwQrsisx7MAxjV.QYeOlTBRU/LZtwHPVurRY3KqkoSxCpCaGa',
    'x7qWhRwUjmDh/FjO4bzKyw==',
    1,
    3
  );
INSERT INTO user
VALUES (
    15,
    'Sebastian',
    'Merrill',
    'Sebastian@Merrill.qc',
    '$2b$12$sQpLeYePaCWD2kyOHN0bAOZArU/XThNADzBfck1vNG9uNt8wipSiq',
    '+OGVoF6M6YvvlmYnCAmSoA==',
    1,
    3
  );
INSERT INTO user
VALUES (
    16,
    'Edwin',
    'Phillips',
    'Edwin@Phillips.ai',
    '$2b$12$HpN5OhxY.VHTlxW9reJsDOQzsB4h3rwpE2wrMOpRXGwz6bXceNgwq',
    '9yxSf8eWQe33xTqhQqWtrQ==',
    1,
    2
  );
INSERT INTO user
VALUES (
    17,
    'Darren',
    'Vargas',
    'Darren@Vargas.li',
    '$2b$12$.NQ3OjNQhIzlxT7836meF.ccfX77zeehuNj7y7HrGGGqwrh.LqFo2',
    'iicfBWFrjVOYGZDiw1aZrA==',
    1,
    3
  );
INSERT INTO user
VALUES (
    18,
    'James',
    'Mccormick',
    'James@Mccormick.com',
    '$2b$12$TFs7WzjUYkwejj1BVVsalOKszOB8rfBG8SHp59iZj2jYuoSxD8h8y',
    'wvHHHyw8LCVhuaBHGz7nfQ==',
    1,
    3
  );
INSERT INTO user
VALUES (
    19,
    'Georgie',
    'Nelson',
    'Georgie@Nelson.qc',
    '$2b$12$iEkP1KpznE0tV1D/P6nibuqJJYZv4x8XYG9LhBhoa0dXZFJ9eJgZ.',
    'Hf5NthtRD5DC6WRy37Ig3Q==',
    1,
    3
  );
INSERT INTO user
VALUES (
    20,
    'Roosevelt',
    'Bradford',
    'Roosevelt@Bradford.eu',
    '$2b$12$aS488ctRvGJWpWsp7sm7xeVRZGmKRg5AYMXL9P9oUG03NuTUfMe/i',
    'qBVr0foma3TfV+TVyMMpBQ==',
    1,
    3
  );
INSERT INTO user
VALUES (
    21,
    'Marcel',
    'Wilcox',
    'Marcel@Wilcox.ku',
    '$2b$12$rOKlBrpddcKSKQ0DO2VpJu6Ksm0DbmJUVa/tNL06kk/Ov1nxTpX7e',
    'Ok4lz/UpY1JsTK7lGzlGfg==',
    1,
    3
  );
/*************************************/
/*          TABLE PROJECT            */
/*************************************/
INSERT INTO project
VALUES(1, "VÉLO JEUNESSE 2018", 1);
INSERT INTO project
VALUES(2, "MARKETING - VÉLO JEUNESSE 2018", 1);
INSERT INTO project
VALUES(3, "ADMINISTRATION - VÉLO JEUNESSE 2018", 1);
INSERT INTO project
VALUES(4, "VENTES - VÉLO JEUNESSE 2018", 1);
/*************************************/
/*          TABLE ACTIVITY           */
/*************************************/
INSERT INTO activity
VALUES(1, "DISTRIBUTION PROSPECTUS");
INSERT INTO activity
VALUES(2, "APPEL MARKETING");
INSERT INTO activity
VALUES(3, "PRÉPARATION NOURRITURE");
INSERT INTO activity
VALUES(4, "COMMIS À LA VENTE");
INSERT INTO activity
VALUES(5, "ORGANISATION ÉVÉNEMENTIELLE");
/*************************************/
/*      TABLE EXPENSE ACCOUNT        */
/*************************************/
INSERT INTO expense_account
VALUES(1, "ADMINISTRATION", 1);
INSERT INTO expense_account
VALUES(2, "ADMINISTRATION - 2018", 1);
INSERT INTO expense_account
VALUES(3, "MARKETING", 3);
INSERT INTO expense_account
VALUES(4, "MARKETING - 2018", 3);
INSERT INTO expense_account
VALUES(5, "VENTES", 5);
INSERT INTO expense_account
VALUES(6, "VENTES - 2018", 5);
/*************************************/
/*           TABLE TIMELINE          */
/*************************************/
INSERT INTO timeline (
    day_of_week,
    punch_in,
    punch_out,
    project_id,
    expense_account_id,
    activity_id,
    user_id
  )
VALUES ('2020-07-01', '08:00', '12:00', 3, 4, 2, 4),
  ('2020-07-01', '13:00', '17:00', 3, 4, 2, 4),
  ('2020-07-02', '08:00', '12:00', 3, 4, 2, 4),
  ('2020-07-03', '06:00', '12:00', 3, 4, 2, 4),
  ('2020-07-03', '16:00', '18:00', 3, 4, 2, 4),
  ('2020-07-05', '08:00', '12:00', 3, 4, 2, 4),
  ('2020-07-01', '08:00', '12:00', 3, 4, 2, 5),
  ('2020-07-01', '13:00', '17:00', 3, 4, 2, 5),
  ('2020-07-02', '08:00', '12:00', 3, 4, 2, 5),
  ('2020-07-03', '06:00', '12:00', 3, 4, 2, 5),
  ('2020-07-03', '16:00', '18:00', 3, 4, 2, 5),
  ('2020-07-05', '08:00', '12:00', 3, 4, 2, 5),
  ('2020-07-01', '08:00', '12:00', 3, 4, 2, 17),
  ('2020-07-01', '13:00', '17:00', 3, 4, 2, 17),
  ('2020-07-02', '08:00', '12:00', 3, 4, 2, 17),
  ('2020-07-03', '06:00', '12:00', 3, 4, 2, 17),
  ('2020-07-03', '16:00', '18:00', 3, 4, 2, 17),
  ('2020-07-05', '08:00', '12:00', 3, 4, 2, 17),
  ('2020-07-01', '08:00', '12:00', 2, 4, 1, 7),
  ('2020-07-01', '13:00', '17:00', 2, 4, 1, 7),
  ('2020-07-02', '08:00', '12:00', 2, 4, 1, 7),
  ('2020-07-03', '06:00', '12:00', 2, 4, 1, 7),
  ('2020-07-03', '16:00', '18:00', 2, 4, 1, 7),
  ('2020-07-05', '08:00', '12:00', 2, 4, 1, 7),
  ('2020-07-12', '08:00', '12:00', 4, 5, 4, 16),
  ('2020-07-12', '13:00', '16:00', 4, 5, 4, 16),
  ('2020-07-13', '08:00', '12:00', 4, 5, 4, 16),
  ('2020-07-22', '01:00', '06:00', 4, 5, 4, 16),
  ('2020-07-22', '08:00', '12:00', 4, 5, 4, 16),
  ('2020-07-21', '11:00', '12:00', 4, 5, 4, 16),
  ('2020-07-12', '08:00', '12:00', 4, 5, 4, 8),
  ('2020-07-12', '13:00', '16:00', 4, 5, 4, 8),
  ('2020-07-13', '08:00', '12:00', 4, 5, 4, 8),
  ('2020-07-22', '01:00', '06:00', 4, 5, 4, 8),
  ('2020-07-22', '08:00', '12:00', 4, 5, 4, 8),
  ('2020-07-21', '11:00', '12:00', 4, 5, 4, 8);
/*************************************/
/*             CORRECTIONS           */
/*************************************/
UPDATE user
SET first_name = UPPER(first_name),
  last_name = UPPER(last_name),
  email = UPPER(email)
where id = id;