-- ============================================================================
-- BROADBEACH ACADEMY — CHAPTER LOCKING & THREE-CHAPTER ARCHITECTURE SCHEMA
-- Database: broad_beach_online
-- Generated: 2026-11-04
-- Target: Creates learner_lesson_progress table & configures three-chapter structure
-- ============================================================================

-- 1. Create learner_lesson_progress table
CREATE TABLE IF NOT EXISTS `learner_lesson_progress` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `certification_id` INT NOT NULL,
  `lesson_id` VARCHAR(64) NOT NULL,
  `completed` TINYINT(1) NOT NULL DEFAULT 1,
  `completed_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uniq_user_cert_lesson` (`user_id`, `certification_id`, `lesson_id`),
  INDEX `idx_user_cert` (`user_id`, `certification_id`),
  INDEX `idx_completed` (`completed`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Update course_lessons video_url to Google Drive HD streams for all 11 courses
UPDATE `course_lessons` SET `video_url` = 'https://drive.google.com/file/d/1pUO72EJ_DekcT4rEnCZ0239G7s8cQ9g0/preview' WHERE `certification_id` = 322 AND `type` = 'lesson';
UPDATE `course_lessons` SET `video_url` = 'https://drive.google.com/file/d/1QELRjEfntnKZ2bFVfXx94QrcIMttSLzF/preview' WHERE `certification_id` = 332 AND `type` = 'lesson';
UPDATE `course_lessons` SET `video_url` = 'https://drive.google.com/file/d/1d8fXlmI7RynuPhO_sgCtsQM1Bd7WQ0Qn/preview' WHERE `certification_id` = 323 AND `type` = 'lesson';
UPDATE `course_lessons` SET `video_url` = 'https://drive.google.com/file/d/1ata4Mu3Fq-US5W1LR3Sz0nbw1RbecBMv/preview' WHERE `certification_id` = 324 AND `type` = 'lesson';
UPDATE `course_lessons` SET `video_url` = 'https://drive.google.com/file/d/1B0lAdFBcJjpCpYRFjGzpQF_rUPv5KMen/preview' WHERE `certification_id` = 325 AND `type` = 'lesson';
UPDATE `course_lessons` SET `video_url` = 'https://drive.google.com/file/d/1nBU1umbTslqdgl7Lt1JfUhV1MhnwhCu1/preview' WHERE `certification_id` = 333 AND `type` = 'lesson';
UPDATE `course_lessons` SET `video_url` = 'https://drive.google.com/file/d/1f3IPJVBmxft4RFWT_1tNP0fcLVmqFgEH/preview' WHERE `certification_id` = 326 AND `type` = 'lesson';
UPDATE `course_lessons` SET `video_url` = 'https://drive.google.com/file/d/1N6W0gecj1oY2keSxzWDX_ZMLB0ctH-eZ/preview' WHERE `certification_id` = 327 AND `type` = 'lesson';
UPDATE `course_lessons` SET `video_url` = 'https://drive.google.com/file/d/16rIvkCdLNu9t0prtwdwbeWVRibRdwhXZ/preview' WHERE `certification_id` = 328 AND `type` = 'lesson';
UPDATE `course_lessons` SET `video_url` = 'https://drive.google.com/file/d/1fxp0MwEy6hEvw5jKbnEeoX-7eadJUZR_/preview' WHERE `certification_id` = 329 AND `type` = 'lesson';
UPDATE `course_lessons` SET `video_url` = 'https://drive.google.com/file/d/10H6QOlqWd_IJdASNAJyyZ5Q3z9the8xu/preview' WHERE `certification_id` = 330 AND `type` = 'lesson';

