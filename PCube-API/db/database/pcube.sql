CREATE TABLE role (
    id INTEGER(5) PRIMARY KEY,
    role_name VARCHAR(50),
    access_level INTEGER(10)
);

CREATE TABLE person (
    id INTEGER(10) PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255)
);

CREATE TABLE project (
    id INTEGER(5) PRIMARY KEY,
    name VARCHAR(120),
    parent_id INTEGER(5),
    FOREIGN KEY(parent_id) REFERENCES project(id)
);

CREATE TABLE activity (
    id INTEGER(5) PRIMARY KEY,
    name VARCHAR(120)
);

CREATE TABLE user (
    id INTEGER(10) PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    hashed_password VARCHAR(255),
    salt VARCHAR(255),
    isActive BOOLEAN,
    person_id INTEGER(10),
    role_id INTEGER(10),
    FOREIGN KEY(role_id) REFERENCES role(id),
    FOREIGN KEY(person_id) REFERENCES person(id)
);

CREATE TABLE accounting_time_category (
    id INTEGER(5) PRIMARY KEY,
    name VARCHAR(120),
    parent_id INTEGER(5),
    FOREIGN KEY(parent_id) REFERENCES accounting_time_category(id)
);

CREATE TABLE timeline (
    id INTEGER(5) PRIMARY KEY,
    begin_date DATE,
    end_date DATE,
    project_id INTEGER(5),
    accounting_time_category_id INTEGER(5),
    activity_id INTEGER(5),
    person_id INTEGER(10),
    FOREIGN KEY(project_id) REFERENCES project(id),
    FOREIGN KEY(accounting_time_category_id) REFERENCES accounting_time_category(id),
    FOREIGN KEY(activity_id) REFERENCES activity(id),
    FOREIGN KEY(person_id) REFERENCES person(id)
);

INSERT INTO role(id, role_name, access_level) VALUES(1, 'admin', 1);
INSERT INTO role(id, role_name, access_level) VALUES(2, 'project_manager', 2);
INSERT INTO role(id, role_name, access_level) VALUES(3, 'member', 3);


-- INSERT INTO table person VALUES(1, 'Alexandre-Thibault', 'Arcole');
-- INSERT INTO table person VALUES(2, 'Oussema', 'Boutaous');
-- INSERT INTO table person VALUES(3, 'Mouad', 'Limane');
-- INSERT INTO table person VALUES(4, 'Pierre-Luc', 'Maître');
-- INSERT INTO table person VALUES(5, 'Miteshbai', 'Patel');
-- INSERT INTO table person VALUES(6, 'Sébastien', 'Richer Stébenne ');







