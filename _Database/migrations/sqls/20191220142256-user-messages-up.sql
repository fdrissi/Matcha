CREATE TABLE `user_messages`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `sender` INT NOT NULL,
    `receiver` INT NOT NULL,
    `message` TEXT NOT NULL,
    `seen` boolean DEFAULT FALSE,
    `date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;