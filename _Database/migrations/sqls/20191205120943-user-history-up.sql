CREATE TABLE user_history
(
    id int PRIMARY Key AUTO_INCREMENT,
	id_user int,
	id_profile int,
	visit_date DATE DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;