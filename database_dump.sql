-- MySQL dump 10.13  Distrib 9.5.0, for macos14.8 (x86_64)
--
-- Host: localhost    Database: serialized_novels
-- ------------------------------------------------------
-- Server version	9.5.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '4d5f7b3e-e62a-11f0-8c16-754c1eb2259e:1-135';

--
-- Table structure for table `authors`
--

DROP TABLE IF EXISTS `authors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `authors` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `bio` text,
  `profile_image_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `handle` varchar(100) DEFAULT NULL,
  `about` text,
  `socials` json DEFAULT NULL,
  `genre` varchar(100) DEFAULT NULL,
  `recommended_author_ids` json DEFAULT NULL,
  `amazon_url` text,
  `goodreads_url` text,
  `spotify_url` text,
  `profile_images` json DEFAULT NULL,
  `video_introductions` json DEFAULT NULL,
  `auto_responder_contributor` text,
  `auto_responder_fan` text,
  `target_gender` json DEFAULT NULL,
  `target_age` json DEFAULT NULL,
  `target_income` json DEFAULT NULL,
  `target_education` json DEFAULT NULL,
  `meta_pixel_id` varchar(50) DEFAULT NULL,
  `ga_measurement_id` varchar(50) DEFAULT NULL,
  `balance` decimal(10,2) DEFAULT '0.00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `authors`
--

LOCK TABLES `authors` WRITE;
/*!40000 ALTER TABLE `authors` DISABLE KEYS */;
INSERT INTO `authors` VALUES ('a2','Captain J. Sparrow',NULL,NULL,'https://images.unsplash.com/photo-1542596768-5d1d21f1cfb6?auto=format&fit=crop&q=80&w=800&h=1200','2025-12-31 09:30:28',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0.00),('a3','Kenji Sato',NULL,NULL,'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&q=80&w=800&h=1200','2025-12-31 09:30:28',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0.00),('d3993ab0-2a72-4f1d-b676-cd15051fae50','Michael James','user_giypuxcey','Michael James is a novelist who explores the rich intersections of memory, identity, and cultural displacement. His narratives span across continents and delve into the complexities of human relationships against the backdrop of historical and political upheavals. ','/assets/michael_james_profile.jpg','2026-01-02 08:44:23','@islaladrones','With a distinctive ability to capture atmospheric settings, James’s stories transport readers from the mist-laden mountains of the fictional Las Ladrones archipelago to the bustling streets of Hong Kong. His characters navigate both internal and external landscapes, uncovering hidden truths in places where the past and present coalesce. When not writing, James can be found walking the mountain trails of Nepal. With a distinctive ability to capture atmospheric settings, James’s stories transport readers from the mist-laden mountains of the fictional Las Ladrones archipelago to the bustling streets of Hong Kong. His characters navigate both internal and external landscapes, uncovering hidden truths in places where the past and present coalesce. When not writing, James can be found walking the mountain trails of Nepal. With a distinctive ability to capture atmospheric settings, James’s stories transport readers from the mist-laden mountains of the fictional Las Ladrones archipelago to the bustling streets of Hong Kong. His characters navigate both internal and external landscapes, uncovering hidden truths in places where the past and present coalesce. When not writing, James can be found walking the mountain trails of Nepal. ','{\"tiktok\": \"\", \"bluesky\": \"\", \"threads\": \"\", \"twitter\": \"\", \"website\": \"\", \"dispatch\": \"\", \"facebook\": \"\", \"linkedin\": \"\", \"instagram\": \"\"}','Historical Fiction','[]','','','','[{\"id\": 1, \"url\": \"/assets/michael_james_profile.jpg\", \"caption\": \"\"}, {\"id\": 2, \"url\": \"\", \"caption\": \"\"}, {\"id\": 3, \"url\": \"\", \"caption\": \"\"}]','[{\"id\": 1, \"url\": \"https://www.youtube.com/shorts/Ij74ITjm5EI\", \"title\": \"\"}, {\"id\": 2, \"url\": \"\", \"title\": \"\"}, {\"id\": 3, \"url\": \"\", \"title\": \"\"}, {\"id\": 4, \"url\": \"\", \"title\": \"\"}]','','','[\"Men\"]','[\"45-54\"]','[\"Top 25%\"]','[\"Bachelor\'s degree\"]',NULL,NULL,0.00);
/*!40000 ALTER TABLE `authors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chapters`
--

DROP TABLE IF EXISTS `chapters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chapters` (
  `id` int NOT NULL AUTO_INCREMENT,
  `novel_id` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `chapter_number` int DEFAULT NULL,
  `content_html` text,
  `status` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `novel_id` (`novel_id`),
  CONSTRAINT `chapters_ibfk_1` FOREIGN KEY (`novel_id`) REFERENCES `novels` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=129 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chapters`
--

LOCK TABLES `chapters` WRITE;
/*!40000 ALTER TABLE `chapters` DISABLE KEYS */;
INSERT INTO `chapters` VALUES (97,'b1','Prologue',1,'','published','2026-01-01 14:12:08'),(98,'b1','Chapter 1: The First Execution of Eng Kang',2,'','published','2026-01-01 14:12:08'),(99,'b1','Chapter 2: The Penitent',3,'','published','2026-01-01 14:12:08'),(100,'b1','Chapter 3: The Second Execution of Eng Kang',4,'','published','2026-01-01 14:12:08'),(101,'b1','Chapter 4: The Birth of Juan de Vera',5,'','published','2026-01-01 14:12:08'),(102,'b1','Chapter 5: Judgement Arrives',6,'','published','2026-01-01 14:12:08'),(103,'b1','Chapter 6: Stone & Labor',7,'','published','2026-01-01 14:12:08'),(104,'b1','Chapter 7: The Roma',8,'','published','2026-01-01 14:12:08'),(105,'b1','Chapter 8: Gaspar',9,'','published','2026-01-01 14:12:08'),(106,'b1','Chapter 9: The Passion',10,'','published','2026-01-01 14:12:08'),(107,'b1','Chapter 10: The Witness',11,'','published','2026-01-01 14:12:08'),(108,'b1','Chapter 11: God Does Not Whisper',12,'','published','2026-01-01 14:12:08'),(109,'b1','Chapter 12: The Fever',13,'','published','2026-01-01 14:12:08'),(110,'b1','Chapter 13: The Holy War',14,'','published','2026-01-01 14:12:08'),(111,'b1','Chapter 14: For God & Glory',15,'','published','2026-01-01 14:12:08'),(112,'b1','Chapter 15: They Shall Know That I Am the Lord',16,'','published','2026-01-01 14:12:08'),(113,'b1','Chapter 16: The Veil Is Torn',17,'','published','2026-01-01 14:12:08'),(114,'b1','Chapter 17: The Sins of Jeroboam',18,'','published','2026-01-01 14:12:08'),(115,'b1','Chapter 18: No One Ever Asked',19,'','published','2026-01-01 14:12:08'),(116,'b1','Chapter 19: Dominion',20,'','published','2026-01-01 14:12:08'),(117,'b1','Chapter 20: Sayang',21,'','published','2026-01-01 14:12:08'),(118,'b1','Chapter 21: Daughter, Arise',22,'','published','2026-01-01 14:12:08'),(119,'b1','Chapter 22: Lim Ah Hong Returns',23,'','published','2026-01-01 14:12:08'),(120,'b1','Chapter 23: The Compañía General',24,'','published','2026-01-01 14:12:08'),(121,'b1','Chapter 24: The Bells Never Ring',25,'','published','2026-01-01 14:12:08'),(122,'b1','Chapter 25: A Cup of Wrath',26,'','published','2026-01-01 14:12:08'),(123,'b1','Chapter 26: 30 Pieces of Silver',27,'','published','2026-01-01 14:12:08'),(124,'b1','Chapter 27: Gethsemane',28,'','published','2026-01-01 14:12:08'),(125,'b1','Chapter 28: Gabbatha',29,'','published','2026-01-01 14:12:08'),(126,'b1','Chapter 29: The Third Execution of Eng Kang',30,'','published','2026-01-01 14:12:08'),(127,'b1','Epigraph',31,'','published','2026-01-01 14:12:08'),(128,'b1','Note From the Translator',32,'','published','2026-01-01 14:12:08');
/*!40000 ALTER TABLE `chapters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contributions`
--

DROP TABLE IF EXISTS `contributions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contributions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(255) NOT NULL,
  `work_id` varchar(255) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(10) DEFAULT 'USD',
  `type` varchar(50) DEFAULT 'subscription',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_work` (`work_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contributions`
--

LOCK TABLES `contributions` WRITE;
/*!40000 ALTER TABLE `contributions` DISABLE KEYS */;
INSERT INTO `contributions` VALUES (1,'612336','b1',5.00,'USD','subscription','2025-12-01 10:00:00'),(2,'612336','b1',5.00,'USD','subscription','2026-01-01 10:00:00'),(3,'612336','b1',10.00,'USD','tip','2026-01-02 12:00:00'),(4,'222604','b1',5.00,'USD','subscription','2025-12-20 14:00:00'),(5,'704057','b2',3.00,'USD','subscription','2025-12-30 09:00:00');
/*!40000 ALTER TABLE `contributions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `novels`
--

DROP TABLE IF EXISTS `novels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `novels` (
  `id` varchar(255) NOT NULL,
  `author_id` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text,
  `cover_image_url` varchar(255) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `price_monthly` decimal(10,2) DEFAULT NULL,
  `published_at` datetime DEFAULT NULL,
  `subscribers_count` int DEFAULT '0',
  `lifetime_earnings` decimal(10,2) DEFAULT '0.00',
  `genre` varchar(100) DEFAULT NULL,
  `frequency` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `author_id` (`author_id`),
  CONSTRAINT `novels_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `authors` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `novels`
--

LOCK TABLES `novels` WRITE;
/*!40000 ALTER TABLE `novels` DISABLE KEYS */;
INSERT INTO `novels` VALUES ('b1','d3993ab0-2a72-4f1d-b676-cd15051fae50','Island Of The Thieves','In a world where history is currency, a young orphan discovers a map to the lost Island of the Thieves. But he is not the only one looking for it.','/assets/island_thieves_new.jpg','published',14.99,'2025-05-15 00:00:00',0,0.00,'Adventure','Every 3 Days'),('b2','d3993ab0-2a72-4f1d-b676-cd15051fae50','Water Washes Earth','Two lovers separated by a war that spans continents find their way back to each other through the letters they leave in the sea.','/assets/cover_water_washes.jpg','published',12.99,'2024-11-01 00:00:00',0,0.00,'Literary Fiction','Daily'),('b3','d3993ab0-2a72-4f1d-b676-cd15051fae50','Season of Light','A coming-of-age story set in the endless days of a nordic summer, where shadows are short but secrets are long.','/assets/cover_season_of_light.jpg','published',13.99,'2025-08-10 00:00:00',0,0.00,'Literary Fiction','Daily'),('b4','a2','Echoes of the Deep','A deep-sea salvage crew finds a wreck that shouldn\'t exist.','/assets/cover_deep.png','published',9.99,'2024-10-01 00:00:00',0,0.00,'Literary Fiction','Daily'),('b5','d3993ab0-2a72-4f1d-b676-cd15051fae50','Tyger','Deep in the jungle...','/assets/cover_tyger.jpg','published',10.00,'2025-01-01 00:00:00',0,0.00,'Fantasy','Daily');
/*!40000 ALTER TABLE `novels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subscriptions`
--

DROP TABLE IF EXISTS `subscriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subscriptions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(255) NOT NULL,
  `work_id` varchar(255) NOT NULL,
  `status` varchar(50) DEFAULT 'active',
  `current_period_end` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_work` (`work_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscriptions`
--

LOCK TABLES `subscriptions` WRITE;
/*!40000 ALTER TABLE `subscriptions` DISABLE KEYS */;
INSERT INTO `subscriptions` VALUES (1,'612336','b1','active','2026-02-02 17:57:46','2026-01-02 17:57:46'),(2,'222604','b1','active','2026-02-02 17:57:46','2026-01-02 17:57:46'),(3,'704057','b2','active','2026-02-02 17:57:46','2026-01-02 17:57:46');
/*!40000 ALTER TABLE `subscriptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `handle` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bio` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `cover_image_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('reader','creator','admin') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'reader',
  `wallet_balance` decimal(10,2) DEFAULT '0.00',
  `oauth_provider` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `oauth_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `handle` (`handle`),
  KEY `idx_email` (`email`),
  KEY `idx_handle` (`handle`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('1','michael@syndicate.com','Michael James',NULL,NULL,NULL,'creator',0.00,NULL,NULL,'2026-01-01 07:27:01','2026-01-02 01:20:19'),('222604','bob@example.com','Bob Smith',NULL,NULL,NULL,'reader',0.00,'google','mock_google_1767347866527_0.9318854958706747','2026-01-02 09:57:46','2026-01-02 09:57:46'),('612336','alice@example.com','Alice Walker',NULL,NULL,NULL,'reader',0.00,'google','mock_google_1767347866502_0.961360073751543','2026-01-02 09:57:46','2026-01-02 09:57:46'),('704057','charlie@example.com','Charlie Day',NULL,NULL,NULL,'reader',0.00,'google','mock_google_1767347866537_0.4627253017943521','2026-01-02 09:57:46','2026-01-02 09:57:46'),('user_giypuxcey','michael@creator.com','Michael James',NULL,NULL,NULL,'creator',0.00,NULL,NULL,'2026-01-02 01:56:36','2026-01-02 01:56:36');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-02 22:58:12
