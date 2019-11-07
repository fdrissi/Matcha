/* Replace with your SQL commands */
CREATE TRIGGER AfterRegister
after
INSERT ON
users
FOR
EACH
ROW
INSERT INTO photos
    (id)
VALUES
    (new.id)

