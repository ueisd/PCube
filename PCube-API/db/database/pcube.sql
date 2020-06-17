CREATE TABLE role (
    id INTEGER PRIMARY KEY,
    role_name VARCHAR(50),
    access_level INTEGER
);

CREATE TABLE project (
    id INTEGER PRIMARY KEY,
    name VARCHAR(120),
    parent_id INTEGER,
    FOREIGN KEY(parent_id) REFERENCES project(id)
);

CREATE TABLE activity (
    id INTEGER PRIMARY KEY,
    name VARCHAR(120)
);

CREATE TABLE user (
    id INTEGER PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    hashed_password VARCHAR(255),
    salt VARCHAR(255),
    isActive BOOLEAN,
    role_id INTEGER,
    FOREIGN KEY(role_id) REFERENCES role(id)
);

CREATE TABLE accounting_time_category (
    id INTEGER PRIMARY KEY,
    name VARCHAR(120),
    parent_id INTEGER,
    FOREIGN KEY(parent_id) REFERENCES accounting_time_category(id)
);

CREATE TABLE timeline (
    id INTEGER PRIMARY KEY,
    begin_date DATE,
    end_date DATE,
    project_id INTEGER,
    accounting_time_category_id INTEGER,
    activity_id INTEGER,
    user_id INTEGER,
    FOREIGN KEY(project_id) REFERENCES project(id),
    FOREIGN KEY(accounting_time_category_id) REFERENCES accounting_time_category(id),
    FOREIGN KEY(activity_id) REFERENCES activity(id),
    FOREIGN KEY(user_id) REFERENCES user(id)
);
