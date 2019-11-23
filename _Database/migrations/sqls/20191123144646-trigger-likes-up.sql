CREATE TRIGGER AfterLikes
after
INSERT ON
users
FOR
EACH
ROW
INSERT INTO user_likes
	(id)
VALUES
	(new.id)