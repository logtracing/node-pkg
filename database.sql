-- -------------------------------------------------------------
-- TablePlus 5.3.8(500)
--
-- https://tableplus.com/
--
-- Database: dev_logtracing
-- Generation Time: 2023-07-08 23:59:22.6060
-- -------------------------------------------------------------


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


CREATE TABLE `codeLines` (
  `id` int NOT NULL AUTO_INCREMENT,
  `line` int DEFAULT NULL,
  `content` varchar(255) DEFAULT NULL,
  `isErrorLine` tinyint(1) DEFAULT NULL,
  `stackId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `stackId` (`stackId`),
  CONSTRAINT `codeLines_ibfk_1` FOREIGN KEY (`stackId`) REFERENCES `stack` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `environmentDetails` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `value` text,
  `errorExceptionId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `errorExceptionId` (`errorExceptionId`),
  CONSTRAINT `environmentDetails_ibfk_1` FOREIGN KEY (`errorExceptionId`) REFERENCES `errorExceptions` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `errorExceptions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `package` varchar(255) DEFAULT NULL,
  `flow` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `message` varchar(255) DEFAULT NULL,
  `stackStr` text,
  `logGroupId` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `logGroupId` (`logGroupId`),
  CONSTRAINT `errorExceptions_ibfk_1` FOREIGN KEY (`logGroupId`) REFERENCES `logGroups` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `executionArguments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `argument` varchar(255) DEFAULT NULL,
  `executionDetailsId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `executionDetailsId` (`executionDetailsId`),
  CONSTRAINT `executionArguments_ibfk_1` FOREIGN KEY (`executionDetailsId`) REFERENCES `executionDetails` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `executionDetails` (
  `id` int NOT NULL AUTO_INCREMENT,
  `language` varchar(255) DEFAULT NULL,
  `version` varchar(255) DEFAULT NULL,
  `executionFinishTime` datetime DEFAULT NULL,
  `errorExceptionId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `errorExceptionId` (`errorExceptionId`),
  CONSTRAINT `executionDetails_ibfk_1` FOREIGN KEY (`errorExceptionId`) REFERENCES `errorExceptions` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `extraDetails` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `value` varchar(255) DEFAULT NULL,
  `isJson` tinyint(1) DEFAULT NULL,
  `errorExceptionId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `errorExceptionId` (`errorExceptionId`),
  CONSTRAINT `extraDetails_ibfk_1` FOREIGN KEY (`errorExceptionId`) REFERENCES `errorExceptions` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `logGroups` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `level` enum('TRACE','DEBUG','INFO','WARN','ERROR','FATAL') DEFAULT 'INFO',
  `flow` varchar(255) DEFAULT NULL,
  `content` text,
  `logGroupId` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `logGroupId` (`logGroupId`),
  CONSTRAINT `logs_ibfk_1` FOREIGN KEY (`logGroupId`) REFERENCES `logGroups` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `stack` (
  `id` int NOT NULL AUTO_INCREMENT,
  `file` varchar(255) DEFAULT NULL,
  `function` varchar(255) DEFAULT NULL,
  `line` int DEFAULT NULL,
  `column` int DEFAULT NULL,
  `errorExceptionId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `errorExceptionId` (`errorExceptionId`),
  CONSTRAINT `stack_ibfk_1` FOREIGN KEY (`errorExceptionId`) REFERENCES `errorExceptions` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `systemDetails` (
  `id` int NOT NULL AUTO_INCREMENT,
  `arch` varchar(255) DEFAULT NULL,
  `processor` varchar(255) DEFAULT NULL,
  `hostname` varchar(255) DEFAULT NULL,
  `platform` varchar(255) DEFAULT NULL,
  `platformRelease` varchar(255) DEFAULT NULL,
  `platformVersion` varchar(255) DEFAULT NULL,
  `user` varchar(255) DEFAULT NULL,
  `errorExceptionId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `errorExceptionId` (`errorExceptionId`),
  CONSTRAINT `systemDetails_ibfk_1` FOREIGN KEY (`errorExceptionId`) REFERENCES `errorExceptions` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;