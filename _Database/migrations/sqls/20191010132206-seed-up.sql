/* Replace with your SQL commands */

/* Tables */

CREATE TABLE users (
    id int PRIMARY KEY AUTO_INCREMENT,
    username varchar(255) NOT NULL,
    first_name varchar(255) NOT NULL,
    last_name varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    verification_key varchar(255) NOT NULL,
    recovery_key varchar(255),
    verified boolean DEFAULT FALSE
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;

