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
-- Table `codingloungedb`.`comment`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `codingloungedb`.`comment` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `comment` LONGTEXT NULL DEFAULT NULL,
  `created_at` DATETIME NULL DEFAULT NULL,
  `commenter` VARCHAR(45) CHARACTER SET 'utf8' NOT NULL,
  `posts_id` VARCHAR(45) CHARACTER SET 'utf8' NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_comment_users1_idx` (`commenter` ASC) VISIBLE,
  INDEX `fk_comment_posts1_idx` (`posts_id` ASC) VISIBLE,
  CONSTRAINT `fk_comment_posts1`
    FOREIGN KEY (`posts_id`)
    REFERENCES `codingloungedb`.`posts` (`id`),
  CONSTRAINT `fk_comment_users1`
    FOREIGN KEY (`commenter`)
    REFERENCES `codingloungedb`.`users` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 23
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
-- Table `codingloungedb`.`posthashtag`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `codingloungedb`.`posthashtag` (
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NULL DEFAULT NULL,
  `HashtagId` VARCHAR(45) NOT NULL,
  `PostId` VARCHAR(45) CHARACTER SET 'utf8' NOT NULL,
  PRIMARY KEY (`HashtagId`, `PostId`),
  INDEX `fk_posthashtag_hashtags1_idx` (`HashtagId` ASC) VISIBLE,
  INDEX `fk_posthashtag_posts1_idx` (`PostId` ASC) VISIBLE,
  CONSTRAINT `fk_posthashtag_hashtags1`
    FOREIGN KEY (`HashtagId`)
    REFERENCES `codingloungedb`.`hashtags` (`id`),
  CONSTRAINT `fk_posthashtag_posts1`
    FOREIGN KEY (`PostId`)
    REFERENCES `codingloungedb`.`posts` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
