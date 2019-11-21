/* Replace with your SQL commands */
CREATE TRIGGER AfterRegisterInfo
after
INSERT ON
users
FOR
EACH
ROW
INSERT INTO user_info
    (id)
VALUES
    (new.id)

