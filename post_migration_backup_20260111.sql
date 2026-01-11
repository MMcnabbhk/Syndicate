-- MySQL dump 10.13  Distrib 8.0.44, for Linux (x86_64)
--
-- Host: localhost    Database: serialized_novels
-- ------------------------------------------------------
-- Server version	8.0.44-0ubuntu0.24.04.2

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

--
-- Table structure for table `audiobook_chapters`
--

DROP TABLE IF EXISTS `audiobook_chapters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audiobook_chapters` (
  `id` int NOT NULL AUTO_INCREMENT,
  `audiobook_id` int NOT NULL,
  `chapter_number` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `audio_url` varchar(2048) NOT NULL,
  `duration_seconds` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `audiobook_id` (`audiobook_id`),
  CONSTRAINT `audiobook_chapters_ibfk_1` FOREIGN KEY (`audiobook_id`) REFERENCES `audiobooks` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audiobook_chapters`
--

LOCK TABLES `audiobook_chapters` WRITE;
/*!40000 ALTER TABLE `audiobook_chapters` DISABLE KEYS */;
/*!40000 ALTER TABLE `audiobook_chapters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `audiobooks`
--

DROP TABLE IF EXISTS `audiobooks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audiobooks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `author_id` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `cover_image_url` varchar(2048) DEFAULT NULL,
  `narrator` varchar(255) DEFAULT NULL,
  `duration_seconds` int DEFAULT '0',
  `status` varchar(50) DEFAULT 'draft',
  `price_monthly` decimal(10,2) DEFAULT '0.00',
  `subscribers_count` int DEFAULT '0',
  `lifetime_earnings` decimal(10,2) DEFAULT '0.00',
  `genre` varchar(100) DEFAULT NULL,
  `published_at` datetime DEFAULT NULL,
  `display_order` int DEFAULT '0',
  `full_download` tinyint(1) DEFAULT '0',
  `goodreads_url` varchar(2048) DEFAULT NULL,
  `amazon_url` varchar(2048) DEFAULT NULL,
  `spotify_url` varchar(2048) DEFAULT NULL,
  `rating` decimal(3,2) DEFAULT '0.00',
  `length` varchar(100) DEFAULT NULL,
  `short_description` text,
  PRIMARY KEY (`id`),
  KEY `idx_author` (`author_id`),
  CONSTRAINT `audiobooks_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `authors` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audiobooks`
--

LOCK TABLES `audiobooks` WRITE;
/*!40000 ALTER TABLE `audiobooks` DISABLE KEYS */;
INSERT INTO `audiobooks` VALUES (1,'a2','The Midnight Echo','https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=600','Sarah Jenkins',30600,'published',4.99,150,0.00,'Thriller & Suspense','2026-01-04 10:56:49',0,0,NULL,NULL,NULL,0.00,NULL,NULL);
/*!40000 ALTER TABLE `audiobooks` ENABLE KEYS */;
UNLOCK TABLES;

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
  `release_day` int DEFAULT '0' COMMENT 'Day offset for scheduled release to subscribers',
  `external_url` varchar(2048) DEFAULT NULL COMMENT 'External URL for chapter content if hosted elsewhere',
  PRIMARY KEY (`id`),
  KEY `novel_id` (`novel_id`),
  KEY `idx_chapters_release_day` (`release_day`),
  CONSTRAINT `chapters_ibfk_1` FOREIGN KEY (`novel_id`) REFERENCES `novels` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=129 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chapters`
--

LOCK TABLES `chapters` WRITE;
/*!40000 ALTER TABLE `chapters` DISABLE KEYS */;
INSERT INTO `chapters` VALUES (97,'b1','Prologue',1,'','published','2026-01-01 14:12:08',0,NULL),(98,'b1','Chapter 1: The First Execution of Eng Kang',2,'','published','2026-01-01 14:12:08',0,NULL),(99,'b1','Chapter 2: The Penitent',3,'','published','2026-01-01 14:12:08',0,NULL),(100,'b1','Chapter 3: The Second Execution of Eng Kang',4,'','published','2026-01-01 14:12:08',0,NULL),(101,'b1','Chapter 4: The Birth of Juan de Vera',5,'','published','2026-01-01 14:12:08',0,NULL),(102,'b1','Chapter 5: Judgement Arrives',6,'','published','2026-01-01 14:12:08',0,NULL),(103,'b1','Chapter 6: Stone & Labor',7,'','published','2026-01-01 14:12:08',0,NULL),(104,'b1','Chapter 7: The Roma',8,'','published','2026-01-01 14:12:08',0,NULL),(105,'b1','Chapter 8: Gaspar',9,'','published','2026-01-01 14:12:08',0,NULL),(106,'b1','Chapter 9: The Passion',10,'','published','2026-01-01 14:12:08',0,NULL),(107,'b1','Chapter 10: The Witness',11,'','published','2026-01-01 14:12:08',0,NULL),(108,'b1','Chapter 11: God Does Not Whisper',12,'','published','2026-01-01 14:12:08',0,NULL),(109,'b1','Chapter 12: The Fever',13,'','published','2026-01-01 14:12:08',0,NULL),(110,'b1','Chapter 13: The Holy War',14,'','published','2026-01-01 14:12:08',0,NULL),(111,'b1','Chapter 14: For God & Glory',15,'','published','2026-01-01 14:12:08',0,NULL),(112,'b1','Chapter 15: They Shall Know That I Am the Lord',16,'','published','2026-01-01 14:12:08',0,NULL),(113,'b1','Chapter 16: The Veil Is Torn',17,'','published','2026-01-01 14:12:08',0,NULL),(114,'b1','Chapter 17: The Sins of Jeroboam',18,'','published','2026-01-01 14:12:08',0,NULL),(115,'b1','Chapter 18: No One Ever Asked',19,'','published','2026-01-01 14:12:08',0,NULL),(116,'b1','Chapter 19: Dominion',20,'','published','2026-01-01 14:12:08',0,NULL),(117,'b1','Chapter 20: Sayang',21,'','published','2026-01-01 14:12:08',0,NULL),(118,'b1','Chapter 21: Daughter, Arise',22,'','published','2026-01-01 14:12:08',0,NULL),(119,'b1','Chapter 22: Lim Ah Hong Returns',23,'','published','2026-01-01 14:12:08',0,NULL),(120,'b1','Chapter 23: The Compañía General',24,'','published','2026-01-01 14:12:08',0,NULL),(121,'b1','Chapter 24: The Bells Never Ring',25,'','published','2026-01-01 14:12:08',0,NULL),(122,'b1','Chapter 25: A Cup of Wrath',26,'','published','2026-01-01 14:12:08',0,NULL),(123,'b1','Chapter 26: 30 Pieces of Silver',27,'','published','2026-01-01 14:12:08',0,NULL),(124,'b1','Chapter 27: Gethsemane',28,'','published','2026-01-01 14:12:08',0,NULL),(125,'b1','Chapter 28: Gabbatha',29,'','published','2026-01-01 14:12:08',0,NULL),(126,'b1','Chapter 29: The Third Execution of Eng Kang',30,'','published','2026-01-01 14:12:08',0,NULL),(127,'b1','Epigraph',31,'','published','2026-01-01 14:12:08',0,NULL),(128,'b1','Note From the Translator',32,'','published','2026-01-01 14:12:08',0,NULL);
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
-- Table structure for table `creator_contacts`
--

DROP TABLE IF EXISTS `creator_contacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `creator_contacts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `owner_id` varchar(36) NOT NULL,
  `encrypted_email` text NOT NULL,
  `encrypted_name` text,
  `source` varchar(50) DEFAULT NULL,
  `email_hash` varchar(64) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_owner_contact_hash` (`owner_id`,`email_hash`),
  KEY `owner_id` (`owner_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `creator_contacts`
--

LOCK TABLES `creator_contacts` WRITE;
/*!40000 ALTER TABLE `creator_contacts` DISABLE KEYS */;
INSERT INTO `creator_contacts` VALUES (1,'7d9c0f88-76e0-426c-9a77-d850460c787e','fb4e2342d25a2e10b4b20d2a45431bbe:c6eb4c1eb206aa00899cfb124e877eac:dcc30d95ed3e1570d394f7d4d78509d43d04','9eb037435eccd29dfd922a2c53806440:6ee366f3249e24482bbc5a4b53be840b:cee561e034b4144b774317b059a5','CSV','85b5c9aa53b0757610b1d4e6a5127f00c6dadbdd48269a1b0dd79bd6bf039a36','2026-01-03 01:02:29');
/*!40000 ALTER TABLE `creator_contacts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `creator_invite_templates`
--

DROP TABLE IF EXISTS `creator_invite_templates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `creator_invite_templates` (
  `creator_id` varchar(36) NOT NULL,
  `invite_text` text,
  `reminder1_text` text,
  `reminder2_text` text,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`creator_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `creator_invite_templates`
--

LOCK TABLES `creator_invite_templates` WRITE;
/*!40000 ALTER TABLE `creator_invite_templates` DISABLE KEYS */;
/*!40000 ALTER TABLE `creator_invite_templates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `creator_invites`
--

DROP TABLE IF EXISTS `creator_invites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `creator_invites` (
  `id` int NOT NULL AUTO_INCREMENT,
  `creator_id` varchar(36) NOT NULL,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `status` enum('pending','sent','reminder1','reminder2','accepted','failed') DEFAULT 'pending',
  `invite_sent_at` timestamp NULL DEFAULT NULL,
  `reminder1_sent_at` timestamp NULL DEFAULT NULL,
  `reminder2_sent_at` timestamp NULL DEFAULT NULL,
  `accepted_at` timestamp NULL DEFAULT NULL,
  `new_user_id` varchar(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_creator_invite` (`creator_id`,`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `creator_invites`
--

LOCK TABLES `creator_invites` WRITE;
/*!40000 ALTER TABLE `creator_invites` DISABLE KEYS */;
/*!40000 ALTER TABLE `creator_invites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(255) NOT NULL,
  `type` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,'demo-user-id','fan','New Fan Verification','This is a test notification for the new Fan type.',0,'2026-01-04 00:32:17');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
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
  `full_download` tinyint(1) DEFAULT '0',
  `goodreads_url` varchar(2048) DEFAULT NULL,
  `amazon_url` varchar(2048) DEFAULT NULL,
  `spotify_url` varchar(2048) DEFAULT NULL,
  `rating` decimal(3,2) DEFAULT '0.00',
  `length` varchar(100) DEFAULT NULL,
  `short_description` text,
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
INSERT INTO `novels` VALUES ('b1','d3993ab0-2a72-4f1d-b676-cd15051fae50','Island Of The Thieves','In a world where history is currency, a young orphan discovers a map to the lost Island of the Thieves. But he is not the only one looking for it.','/assets/island_thieves_new.jpg','published',14.99,'2025-05-15 00:00:00',0,0.00,'Adventure','Every 3 Days',0,NULL,NULL,NULL,0.00,NULL,NULL),('b2','d3993ab0-2a72-4f1d-b676-cd15051fae50','Water Washes Earth','Two lovers separated by a war that spans continents find their way back to each other through the letters they leave in the sea.','/assets/cover_water_washes.jpg','published',12.99,'2024-11-01 00:00:00',0,0.00,'Literary Fiction','Daily',0,NULL,NULL,NULL,0.00,NULL,NULL),('b3','d3993ab0-2a72-4f1d-b676-cd15051fae50','Season of Light','A coming-of-age story set in the endless days of a nordic summer, where shadows are short but secrets are long.','/assets/cover_season_of_light.jpg','published',13.99,'2025-08-10 00:00:00',0,0.00,'Literary Fiction','Daily',0,NULL,NULL,NULL,0.00,NULL,NULL),('b4','a2','Echoes of the Deep','A deep-sea salvage crew finds a wreck that shouldn\'t exist.','/assets/cover_deep.png','published',9.99,'2024-10-01 00:00:00',0,0.00,'Literary Fiction','Daily',0,NULL,NULL,NULL,0.00,NULL,NULL),('b5','d3993ab0-2a72-4f1d-b676-cd15051fae50','Tyger','Deep in the jungle...','/assets/cover_tyger.jpg','published',10.00,'2025-01-01 00:00:00',0,0.00,'Fantasy','Daily',0,NULL,NULL,NULL,0.00,NULL,NULL);
/*!40000 ALTER TABLE `novels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `poems`
--

DROP TABLE IF EXISTS `poems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `poems` (
  `id` int NOT NULL AUTO_INCREMENT,
  `author_id` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content_html` mediumtext,
  `form` varchar(100) DEFAULT NULL,
  `tags` varchar(255) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'draft',
  `published_at` datetime DEFAULT NULL,
  `cover_image_url` varchar(2048) DEFAULT NULL,
  `price_monthly` decimal(10,2) DEFAULT '0.00',
  `subscribers_count` int DEFAULT '0',
  `lifetime_earnings` decimal(10,2) DEFAULT '0.00',
  `genre` varchar(100) DEFAULT NULL,
  `display_order` int DEFAULT '0',
  `collection_title` varchar(255) DEFAULT NULL,
  `full_download` tinyint(1) DEFAULT '0',
  `goodreads_url` varchar(2048) DEFAULT NULL,
  `amazon_url` varchar(2048) DEFAULT NULL,
  `spotify_url` varchar(2048) DEFAULT NULL,
  `rating` decimal(3,2) DEFAULT '0.00',
  `length` varchar(100) DEFAULT NULL,
  `short_description` text,
  PRIMARY KEY (`id`),
  KEY `idx_author` (`author_id`),
  CONSTRAINT `poems_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `authors` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `poems`
--

LOCK TABLES `poems` WRITE;
/*!40000 ALTER TABLE `poems` DISABLE KEYS */;
/*!40000 ALTER TABLE `poems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `poetry_collection_items`
--

DROP TABLE IF EXISTS `poetry_collection_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `poetry_collection_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `collection_id` int NOT NULL,
  `poem_id` int NOT NULL,
  `display_order` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `collection_id` (`collection_id`),
  KEY `poem_id` (`poem_id`),
  CONSTRAINT `poetry_collection_items_ibfk_1` FOREIGN KEY (`collection_id`) REFERENCES `poetry_collections` (`id`) ON DELETE CASCADE,
  CONSTRAINT `poetry_collection_items_ibfk_2` FOREIGN KEY (`poem_id`) REFERENCES `poems` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `poetry_collection_items`
--

LOCK TABLES `poetry_collection_items` WRITE;
/*!40000 ALTER TABLE `poetry_collection_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `poetry_collection_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `poetry_collections`
--

DROP TABLE IF EXISTS `poetry_collections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `poetry_collections` (
  `id` int NOT NULL AUTO_INCREMENT,
  `author_id` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `cover_image_url` varchar(2048) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'draft',
  `published_at` datetime DEFAULT NULL,
  `price_monthly` decimal(10,2) DEFAULT '0.00',
  `display_order` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_author` (`author_id`),
  CONSTRAINT `poetry_collections_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `authors` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `poetry_collections`
--

LOCK TABLES `poetry_collections` WRITE;
/*!40000 ALTER TABLE `poetry_collections` DISABLE KEYS */;
/*!40000 ALTER TABLE `poetry_collections` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int unsigned NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('-MuLJeaA0ItBBMRY3aeBlOe21YVv-3jl',1768193943,'{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2026-01-12T04:59:02.713Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"}}'),('0W4dRHrMJJ8Xbzqor5C7YUg1MptLeLnI',1768194378,'{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2026-01-12T04:59:56.377Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"passport\":{\"user\":\"user_giypuxcey\"}}'),('31VcnaAHlcIbFIEzthnJ68LVAByy_fR4',1768097638,'{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2026-01-11T00:42:45.679Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"passport\":{\"user\":\"user_giypuxcey\"}}'),('7oP8eBPGb7zP-HK8qpOwSW3jDuAoVRKX',1768092309,'{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2026-01-11T00:33:52.572Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"passport\":{\"user\":\"user_giypuxcey\"}}'),('87Fr74cF03mO-7vfrf4qh9MsB0wSDlgo',1768007760,'{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2026-01-10T01:15:59.894Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"passport\":{\"user\":\"user_giypuxcey\"}}'),('AYL3axYlQlEHbwqd5y0ebQTwugxhT2LT',1768009118,'{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2026-01-10T01:38:38.100Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"passport\":{\"user\":\"user_giypuxcey\"}}'),('CWYMCxHitTI8WE2IUA0No0AG2K5TPq5f',1768006947,'{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2026-01-10T01:02:27.006Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"}}'),('Dcn-_vGoIaib5yH_wKeYEgJ8v6ERXO_O',1768009371,'{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2026-01-10T01:02:47.748Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"passport\":{\"user\":\"user_giypuxcey\"}}'),('FRxf7GTmQJIZhCN6UknGsnJPucPmyfeI',1768011383,'{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2026-01-10T02:07:08.443Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"passport\":{\"user\":\"user_giypuxcey\"}}'),('KQvAcadQUPe3LXQLT8wZ2-MxExgVCihf',1768042053,'{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2026-01-10T07:21:17.592Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"passport\":{\"user\":\"user_giypuxcey\"}}'),('OXvH63es-wragBBVAmZIk6hELd1XxUl8',1768193964,'{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2026-01-12T01:11:04.566Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"passport\":{\"user\":\"ccb27fe8-2b86-4c43-962b-0f0e5d15306f\"}}'),('YiWzXW8Is1CsszXwT3YN07umc5nFjW7x',1768180082,'{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2026-01-12T01:08:01.562Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"}}'),('Zam9xNuA1amO_AfJe8mc8e4AVG5bJ612',1768006911,'{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2026-01-10T01:01:50.711Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"passport\":{\"user\":\"7d9c0f88-76e0-426c-9a77-d850460c787e\"}}'),('k_EL4TGG9mzNvZ9mlA300pbps4QRgUD-',1768009172,'{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2026-01-10T01:39:31.812Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"passport\":{\"user\":\"user_giypuxcey\"}}'),('sK3lUxTqCYYyRdoY04Onzpdvs-9Ce1ke',1768187044,'{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2026-01-12T01:21:28.970Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"passport\":{\"user\":\"ccb27fe8-2b86-4c43-962b-0f0e5d15306f\"}}'),('uTAOBzeqRUapI2_fjbhv0qKLMo4JcbTv',1768034495,'{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2026-01-10T01:36:30.776Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"passport\":{\"user\":\"user_giypuxcey\"}}'),('uYDFDxmfcLXgUzp3WaxwUj5vKmf866Xp',1768007035,'{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2026-01-10T01:02:23.906Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"passport\":{\"user\":\"7d9c0f88-76e0-426c-9a77-d850460c787e\"}}');
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `short_stories`
--

DROP TABLE IF EXISTS `short_stories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `short_stories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `author_id` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content_html` mediumtext,
  `genre` varchar(100) DEFAULT NULL,
  `summary` text,
  `status` varchar(50) DEFAULT 'draft',
  `published_at` datetime DEFAULT NULL,
  `cover_image_url` varchar(2048) DEFAULT NULL,
  `price_monthly` decimal(10,2) DEFAULT '0.00',
  `subscribers_count` int DEFAULT '0',
  `lifetime_earnings` decimal(10,2) DEFAULT '0.00',
  `display_order` int DEFAULT '0',
  `collection_title` varchar(255) DEFAULT NULL,
  `full_download` tinyint(1) DEFAULT '0',
  `goodreads_url` varchar(2048) DEFAULT NULL,
  `amazon_url` varchar(2048) DEFAULT NULL,
  `spotify_url` varchar(2048) DEFAULT NULL,
  `rating` decimal(3,2) DEFAULT '0.00',
  `length` varchar(100) DEFAULT NULL,
  `short_description` text,
  PRIMARY KEY (`id`),
  KEY `idx_author` (`author_id`),
  CONSTRAINT `short_stories_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `authors` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `short_stories`
--

LOCK TABLES `short_stories` WRITE;
/*!40000 ALTER TABLE `short_stories` DISABLE KEYS */;
/*!40000 ALTER TABLE `short_stories` ENABLE KEYS */;
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
  `password_hash` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `magic_token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `magic_expires` timestamp NULL DEFAULT NULL,
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
  `signup_source` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `signup_creator_id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'active' COMMENT 'User account status: active, suspended, deleted',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `handle` (`handle`),
  KEY `idx_email` (`email`),
  KEY `idx_handle` (`handle`),
  KEY `idx_users_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('1','michael@syndicate.com',NULL,NULL,NULL,'Michael James',NULL,NULL,NULL,'admin',0.00,NULL,NULL,'2026-01-01 07:27:01','2026-01-05 04:27:13',NULL,NULL,'active'),('222604','bob@example.com',NULL,NULL,NULL,'Bob Smith',NULL,NULL,NULL,'reader',0.00,'google','mock_google_1767347866527_0.9318854958706747','2026-01-02 09:57:46','2026-01-02 09:57:46',NULL,NULL,'active'),('612336','alice@example.com',NULL,NULL,NULL,'Alice Walker',NULL,NULL,NULL,'reader',0.00,'google','mock_google_1767347866502_0.961360073751543','2026-01-02 09:57:46','2026-01-02 09:57:46',NULL,NULL,'active'),('704057','charlie@example.com',NULL,NULL,NULL,'Charlie Day',NULL,NULL,NULL,'reader',0.00,'google','mock_google_1767347866537_0.4627253017943521','2026-01-02 09:57:46','2026-01-02 09:57:46',NULL,NULL,'active'),('7d9c0f88-76e0-426c-9a77-d850460c787e','testing@example.com','$2b$10$O0MZENkmzIBtSePB5ZSwOeGIcXjEI4.1D4ji0boPnWqDt0TCRzSne','cdfc94c6ca1b843f8b5540ff769f2d302c4265952ba1af79f35a9ff997aaf3b2','2026-01-03 02:01:59','Tester',NULL,NULL,NULL,'reader',0.00,NULL,NULL,'2026-01-03 01:01:50','2026-01-03 01:01:58',NULL,NULL,'active'),('93a839ac-5518-4e66-b850-85e31a98bb3a','michael.mcnabb@gmail.com',NULL,NULL,NULL,'michael.mcnabb',NULL,NULL,NULL,'reader',0.00,NULL,NULL,'2026-01-03 01:02:15','2026-01-03 01:02:15',NULL,NULL,'active'),('ccb27fe8-2b86-4c43-962b-0f0e5d15306f','reader@syndicate.com','$2b$10$b7hE7eZUDEnDWLVI9SwjBe6.1KIK1QnwGI60qjGaZ5MD4zfC/YDiC',NULL,NULL,'Dev Reader',NULL,NULL,NULL,'reader',0.00,NULL,NULL,'2026-01-05 01:10:30','2026-01-05 01:10:30',NULL,NULL,'active'),('user_giypuxcey','michael@creator.com',NULL,NULL,NULL,'Michael James',NULL,NULL,NULL,'admin',0.00,NULL,NULL,'2026-01-02 01:56:36','2026-01-05 04:59:09',NULL,NULL,'active');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-11  9:29:16
