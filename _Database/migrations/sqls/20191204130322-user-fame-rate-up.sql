CREATE TABLE user_fame_rate
(
    id int PRIMARY Key AUTO_INCREMENT,
	liked int DEFAULT 0,
	unliked int DEFAULT 0,
	fame_rate int DEFAULT 0
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;