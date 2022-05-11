-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema codingloungedb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema codingloungedb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `codingloungedb` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `codingloungedb` ;

-- -----------------------------------------------------
-- Table `codingloungedb`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `codingloungedb`.`users` (
  `id` VARCHAR(45) CHARACTER SET 'utf8' NOT NULL,
  `nick` VARCHAR(15) CHARACTER SET 'utf8' NOT NULL,
  `password` VARCHAR(100) CHARACTER SET 'utf8' NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  `deletedAt` DATETIME NULL DEFAULT NULL,
  `user_image` MEDIUMTEXT CHARACTER SET 'utf8' NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email` (`id` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `codingloungedb`.`follow`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `codingloungedb`.`follow` (
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  `followingId` VARCHAR(45) CHARACTER SET 'utf8' NOT NULL,
  `followerId` VARCHAR(45) CHARACTER SET 'utf8' NOT NULL,
  PRIMARY KEY (`followingId`, `followerId`),
  INDEX `fk_follow_users1_idx` (`followingId` ASC) VISIBLE,
  INDEX `fk_follow_users2_idx` (`followerId` ASC) VISIBLE,
  CONSTRAINT `fk_follow_users1`
    FOREIGN KEY (`followingId`)
    REFERENCES `codingloungedb`.`users` (`id`),
  CONSTRAINT `fk_follow_users2`
    FOREIGN KEY (`followerId`)
    REFERENCES `codingloungedb`.`users` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `codingloungedb`.`hashtags`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `codingloungedb`.`hashtags` (
  `id` VARCHAR(45) NOT NULL,
  `title` VARCHAR(15) NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `title` (`title` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `codingloungedb`.`posts`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `codingloungedb`.`posts` (
  `id` VARCHAR(45) CHARACTER SET 'utf8' NOT NULL,
  `post_title` VARCHAR(255) CHARACTER SET 'utf8' NOT NULL,
  `code_content` LONGTEXT CHARACTER SET 'utf8' NOT NULL,
  `question_content` LONGTEXT CHARACTER SET 'utf8' NOT NULL,
  `post_img` MEDIUMTEXT CHARACTER SET 'utf8' NULL DEFAULT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  `UserId` VARCHAR(45) CHARACTER SET 'utf8' NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_posts_users1_idx` (`UserId` ASC) VISIBLE,
  CONSTRAINT `fk_posts_users1`
    FOREIGN KEY (`UserId`)
    REFERENCES `codingloungedb`.`users` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `codingloungedb`.`posthashtag`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `codingloungedb`.`posthashtag` (
  `createAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NULL DEFAULT NULL,
  `tag_id` VARCHAR(45) NOT NULL,
  `post_id` VARCHAR(45) CHARACTER SET 'utf8' NOT NULL,
  PRIMARY KEY (`tag_id`, `post_id`),
  INDEX `fk_posthashtag_hashtags1_idx` (`tag_id` ASC) VISIBLE,
  INDEX `fk_posthashtag_posts1_idx` (`post_id` ASC) VISIBLE,
  CONSTRAINT `fk_posthashtag_hashtags1`
    FOREIGN KEY (`tag_id`)
    REFERENCES `codingloungedb`.`hashtags` (`id`),
  CONSTRAINT `fk_posthashtag_posts1`
    FOREIGN KEY (`post_id`)
    REFERENCES `codingloungedb`.`posts` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `codingloungedb`.`sequelizemeta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `codingloungedb`.`sequelizemeta` (
  `name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE INDEX `name` (`name` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
