CREATE TABLE user_likes
(
    id int PRIMARY Key AUTO_INCREMENT,
	id_user_one int,
	id_user_two int,
	user1_liked_user2 boolean DEFAULT FALSE,
	user2_liked_user1 boolean DEFAULT FALSE,
	matched boolean DEFAULT FALSE
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;