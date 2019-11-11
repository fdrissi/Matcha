/* Replace with your SQL commands */
CREATE TABLE photos
(
    id int PRIMARY Key AUTO_INCREMENT,
    `profile_Image` varchar
(255) NOT NULL DEFAULT 'photo_holder.png',
    first_Image varchar
(255) NOT NULL DEFAULT 'photo_holder.png',
    second_Image varchar
(255) NOT NULL DEFAULT 'photo_holder.png',
    third_Image varchar
(255) NOT NULL DEFAULT 'photo_holder.png',
    fourth_Image varchar
(255) NOT NULL DEFAULT 'photo_holder.png',
    `counter` int
(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;
