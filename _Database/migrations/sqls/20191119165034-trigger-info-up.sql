/* Replace with your SQL commands */
CREATE TRIGGER AfterRegisterInfo
after
INSERT ON
users
FOR
EACH
ROW
BEGIN
    INSERT INTO user_info
    SET id
    =
    (new.id);
    INSERT INTO user_fame_rate
    SET id
    =
    (new.id);
END;
