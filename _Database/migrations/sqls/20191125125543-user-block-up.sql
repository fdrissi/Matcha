CREATE TABLE user_block
(
    id int PRIMARY Key AUTO_INCREMENT,
	id_user int,
	id_profile int,
	blocked boolean
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;