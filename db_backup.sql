-- MySQL dump 10.13  Distrib 9.5.0, for macos14.8 (x86_64)
--
-- Host: localhost    Database: book_site
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

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '4d5f7b3e-e62a-11f0-8c16-754c1eb2259e:1-57';

--
-- Table structure for table `audiobook_chapters`
--

DROP TABLE IF EXISTS `audiobook_chapters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audiobook_chapters` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `audiobook_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `chapter_number` int NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `audio_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `duration_seconds` int DEFAULT '0',
  `published_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_audiobook_chapter` (`audiobook_id`,`chapter_number`),
  KEY `idx_audiobook` (`audiobook_id`),
  KEY `idx_chapter_number` (`chapter_number`),
  CONSTRAINT `audiobook_chapters_ibfk_1` FOREIGN KEY (`audiobook_id`) REFERENCES `audiobooks` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `author_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cover_image_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `narrator` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `duration_seconds` int DEFAULT '0',
  `status` enum('draft','published','completed') COLLATE utf8mb4_unicode_ci DEFAULT 'draft',
  `price_monthly` decimal(10,2) DEFAULT '0.00',
  `published_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_author` (`author_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `audiobooks_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `authors` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audiobooks`
--

LOCK TABLES `audiobooks` WRITE;
/*!40000 ALTER TABLE `audiobooks` DISABLE KEYS */;
/*!40000 ALTER TABLE `audiobooks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `authors`
--

DROP TABLE IF EXISTS `authors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `authors` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `genre` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `profile_image_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `video_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `balance` decimal(10,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `bio` text COLLATE utf8mb4_unicode_ci,
  `about` text COLLATE utf8mb4_unicode_ci,
  `socials` json DEFAULT NULL,
  `recommended_author_ids` json DEFAULT NULL,
  `meta_pixel_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ga_measurement_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `handle` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `amazon_url` text COLLATE utf8mb4_unicode_ci,
  `goodreads_url` text COLLATE utf8mb4_unicode_ci,
  `spotify_url` text COLLATE utf8mb4_unicode_ci,
  `profile_images` json DEFAULT NULL,
  `video_introductions` json DEFAULT NULL,
  `auto_responder_contributor` text COLLATE utf8mb4_unicode_ci,
  `auto_responder_fan` text COLLATE utf8mb4_unicode_ci,
  `target_gender` json DEFAULT NULL,
  `target_age` json DEFAULT NULL,
  `target_income` json DEFAULT NULL,
  `target_education` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `idx_name` (`name`),
  CONSTRAINT `authors_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `authors`
--

LOCK TABLES `authors` WRITE;
/*!40000 ALTER TABLE `authors` DISABLE KEYS */;
INSERT INTO `authors` VALUES ('1','1','Michael James','Literary Fiction',NULL,'/michael_james.png',NULL,0.00,'2026-01-01 07:27:43','2026-01-01 13:08:04','Award-winning author of \'The Echo of Silence\' and \'Midnight in the Garden\'. Exploring the human condition through prose and poetry. He lives in the Pacific Northwest with his two dogs and an excessive amount of coffee. His work has been featured in The New Yorker, The Paris Review, and Granta.','\n## About Michael\n\nMichael James is a writer based in Seattle, WA. With a background in philosophy and a penchant for the melancholy, his stories often traverse the grey areas of morality and human connection.\n\nHe began his career writing short fiction for literary journals before publishing his debut novel, *The Echo of Silence*, which was a finalist for the National Book Award. \n\nMichael believes in the power of serialized storytelling to build community and deeper engagement with readers. When not writing, he can be found hiking the Cascades or hunting for rare vinyl records.\n\n### Accolades\n*   National Book Award Finalist\n*   Pushcart Prize Nominee (2024)\n*   Best American Short Stories Selection\n            ','{\"tiktok\": \"\", \"bluesky\": \"\", \"threads\": \"\", \"twitter\": \"https://twitter.com\", \"website\": \"https://michaeljames.writer\", \"dispatch\": \"\", \"facebook\": \"https://facebook.com\", \"linkedin\": \"\", \"instagram\": \"https://instagram.com\"}',NULL,'1234567890','G-ABC123XYZ','@michaeljames','https://amazon.com/author/michaeljames','https://goodreads.com','https://open.spotify.com/show/example','[{\"id\": 1, \"url\": \"\", \"caption\": \"Headshot by Annie Leibovitz\"}, {\"id\": 2, \"url\": \"\", \"caption\": \"Speaking at Powell\'s Books\"}, {\"id\": 3, \"url\": \"\", \"caption\": \"Writing retreat in cabin\"}]','[{\"id\": 1, \"url\": \"https://youtube.com/watch?v=example\", \"title\": \"Welcome to my World\"}, {\"id\": 2, \"url\": \"\", \"title\": \"\"}, {\"id\": 3, \"url\": \"\", \"title\": \"\"}, {\"id\": 4, \"url\": \"\", \"title\": \"\"}]','Thank you so much for your support! It means the world to me and helps keep the lights on and the coffee brewing. I hope you enjoy the stories.','Welcome to the inner circle! You\'ll now get early access to my drafts and exclusive Q&A sessions. Thanks for reading.','[\"All\"]','[\"25-34\", \"35-44\", \"45-54\"]','[\"All\"]','[\"Bachelor\'s degree\", \"Master\'s degree\"]'),('a2',NULL,'Captain J. Sparrow','Horror','Deep sea horror.','https://images.unsplash.com/photo-1542596768-5d1d21f1cfb6?auto=format&fit=crop&q=80&w=800&h=1200','https://vimeo.com/13106346',0.00,'2025-12-31 09:30:28','2025-12-31 09:30:28',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('a3',NULL,'Kenji Sato','Cyberpunk','Neon noir.','https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&q=80&w=800&h=1200','https://vimeo.com/76979871',0.00,'2025-12-31 09:30:28','2025-12-31 09:30:28',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `authors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chapters`
--

DROP TABLE IF EXISTS `chapters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chapters` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `novel_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `chapter_number` int NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content_html` longtext COLLATE utf8mb4_unicode_ci,
  `word_count` int DEFAULT '0',
  `published_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_novel_chapter` (`novel_id`,`chapter_number`),
  UNIQUE KEY `unique_chapter_sequence` (`novel_id`,`chapter_number`),
  KEY `idx_novel` (`novel_id`),
  KEY `idx_chapter_number` (`chapter_number`),
  CONSTRAINT `chapters_ibfk_1` FOREIGN KEY (`novel_id`) REFERENCES `novels` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chapters`
--

LOCK TABLES `chapters` WRITE;
/*!40000 ALTER TABLE `chapters` DISABLE KEYS */;
INSERT INTO `chapters` VALUES ('c1-1','b1',1,'Chapter 1: The Map','The parchment was brittle...',4,NULL,'2025-12-31 10:32:16','2025-12-31 10:32:16'),('c2-1','b2',1,'Chapter 1: The Shore','The waves crashed against...',4,NULL,'2025-12-31 10:32:17','2025-12-31 10:32:17'),('c3-1','b3',1,'Chapter 1: Midsummer','The sun never set that year...',6,NULL,'2025-12-31 10:32:17','2025-12-31 10:32:17');
/*!40000 ALTER TABLE `chapters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `external_links`
--

DROP TABLE IF EXISTS `external_links`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `external_links` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content_type` enum('novel','audiobook','short_story','poem','poetry_collection','author') COLLATE utf8mb4_unicode_ci NOT NULL,
  `content_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `platform` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_content` (`content_type`,`content_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `external_links`
--

LOCK TABLES `external_links` WRITE;
/*!40000 ALTER TABLE `external_links` DISABLE KEYS */;
/*!40000 ALTER TABLE `external_links` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Novels`
--

DROP TABLE IF EXISTS `Novels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Novels` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `author_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `cover_image_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('draft','published','completed') COLLATE utf8mb4_unicode_ci DEFAULT 'draft',
  `price_monthly` decimal(10,2) DEFAULT '0.00',
  `published_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `genre` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'Literary Fiction',
  PRIMARY KEY (`id`),
  KEY `idx_author` (`author_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `novels_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `authors` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Novels`
--

LOCK TABLES `Novels` WRITE;
/*!40000 ALTER TABLE `Novels` DISABLE KEYS */;
INSERT INTO `Novels` VALUES ('b1','1','Island Of The Thieves','In a world where history is currency, a young orphan discovers a map to the lost Island of the Thieves. But he is not the only one looking for it.','/assets/island_thieves_new.jpg','published',14.99,'2025-05-14 16:00:00','2025-12-31 09:30:28','2026-01-01 13:15:18','Adventure'),('b2','1','Water Washes Earth','Two lovers separated by a war that spans continents find their way back to each other through the letters they leave in the sea.','/assets/cover_water_washes.jpg','published',12.99,'2024-10-31 16:00:00','2025-12-31 09:30:28','2026-01-01 13:12:48','Literary Fiction'),('b3','1','Season of Light','A coming-of-age story set in the endless days of a nordic summer, where shadows are short but secrets are long.','/assets/cover_season_of_light.jpg','published',13.99,'2025-08-09 16:00:00','2025-12-31 09:30:28','2026-01-01 13:12:48','Literary Fiction'),('b4','a2','Echoes of the Deep','A deep-sea salvage crew finds a wreck that shouldn\'t exist.','/assets/cover_deep.png','published',9.99,'2024-09-30 16:00:00','2025-12-31 09:30:28','2025-12-31 09:30:28','Literary Fiction'),('b5','1','Tyger','Deep in the jungle...','/assets/cover_tyger.jpg','published',10.00,'2024-12-31 16:00:00','2025-12-31 09:30:28','2026-01-01 13:15:18','Fantasy');
/*!40000 ALTER TABLE `Novels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `poems`
--

DROP TABLE IF EXISTS `poems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `poems` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `author_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content_html` text COLLATE utf8mb4_unicode_ci,
  `form` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tags` json DEFAULT NULL,
  `cover_image_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('draft','published') COLLATE utf8mb4_unicode_ci DEFAULT 'draft',
  `price_monthly` decimal(10,2) DEFAULT '0.00',
  `published_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_author` (`author_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `poems_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `authors` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `poems`
--

LOCK TABLES `poems` WRITE;
/*!40000 ALTER TABLE `poems` DISABLE KEYS */;
INSERT INTO `poems` VALUES ('pm1','a3','Neon Haiku Collection','Capturing the soul of the cyberpunk metropolis.','Free Verse','[]','/assets/cover_neon.png','published',4.99,'2025-01-19 16:00:00','2025-12-31 09:30:28','2025-12-31 09:30:28');
/*!40000 ALTER TABLE `poems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `poetry_collection_items`
--

DROP TABLE IF EXISTS `poetry_collection_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `poetry_collection_items` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `collection_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `poem_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sequence_order` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_collection_poem` (`collection_id`,`poem_id`),
  KEY `idx_collection` (`collection_id`),
  KEY `idx_poem` (`poem_id`),
  CONSTRAINT `poetry_collection_items_ibfk_1` FOREIGN KEY (`collection_id`) REFERENCES `poetry_collections` (`id`) ON DELETE CASCADE,
  CONSTRAINT `poetry_collection_items_ibfk_2` FOREIGN KEY (`poem_id`) REFERENCES `poems` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `author_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `cover_image_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('draft','published') COLLATE utf8mb4_unicode_ci DEFAULT 'draft',
  `price_monthly` decimal(10,2) DEFAULT '0.00',
  `published_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_author` (`author_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `poetry_collections_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `authors` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `session_id` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires` int unsigned NOT NULL,
  `data` mediumtext COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`session_id`),
  KEY `idx_expires` (`expires`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `short_stories`
--

DROP TABLE IF EXISTS `short_stories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `short_stories` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `author_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content_html` longtext COLLATE utf8mb4_unicode_ci,
  `cover_image_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `word_count` int DEFAULT '0',
  `status` enum('draft','published') COLLATE utf8mb4_unicode_ci DEFAULT 'draft',
  `price_monthly` decimal(10,2) DEFAULT '0.00',
  `published_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_author` (`author_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `short_stories_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `authors` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content_type` enum('novel','audiobook','short_story','poem','poetry_collection') COLLATE utf8mb4_unicode_ci NOT NULL,
  `content_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `started_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `last_accessed_at` timestamp NULL DEFAULT NULL,
  `status` enum('active','paused','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_content` (`user_id`,`content_type`,`content_id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_content` (`content_type`,`content_id`),
  CONSTRAINT `subscriptions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscriptions`
--

LOCK TABLES `subscriptions` WRITE;
/*!40000 ALTER TABLE `subscriptions` DISABLE KEYS */;
/*!40000 ALTER TABLE `subscriptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `handle` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bio` text COLLATE utf8mb4_unicode_ci,
  `cover_image_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('reader','creator','admin') COLLATE utf8mb4_unicode_ci DEFAULT 'reader',
  `wallet_balance` decimal(10,2) DEFAULT '0.00',
  `oauth_provider` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `oauth_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
INSERT INTO `users` VALUES ('1','sample@example.com','Sample User',NULL,NULL,NULL,'creator',0.00,NULL,NULL,'2026-01-01 07:27:01','2026-01-01 07:27:01');
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

-- Dump completed on 2026-01-01 21:17:30
