CREATE TABLE user_notifications
(
    id int PRIMARY Key AUTO_INCREMENT,
	id_user int,
	id_profile int,
	notification user_tags varchar
(255),
	seen boolean DEFAULT FALSE,
	date_notification datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;