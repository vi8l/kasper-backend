CREATE DATABASE kasper_assignment;

CREATE TABLE `kasper_assignment`.`people` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `sequence` INT UNIQUE NOT NULL,
  PRIMARY KEY (`id`));