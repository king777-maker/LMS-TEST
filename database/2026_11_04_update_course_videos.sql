-- ============================================================================
-- BROADBEACH ACADEMY — GOOGLE DRIVE VIDEO IMPORT & LESSON VIDEO URL MIGRATION
-- Database: broad_beach_online
-- Generated: 2026-11-04
-- Target: Updates course_lessons with verified Google Drive HD Master Preview Streams
-- ============================================================================

-- Course 1: ISO 9001:2026 QMS (Drive ID: 1pUO72EJ_DekcT4rEnCZ0239G7s8cQ9g0)
UPDATE `course_lessons`
SET `video_url` = 'https://drive.google.com/file/d/1pUO72EJ_DekcT4rEnCZ0239G7s8cQ9g0/preview'
WHERE `certification_id` = 322 AND `type` = 'lesson';

-- Course 2: ISO 14001:2026 EMS (Drive ID: 1QELRjEfntnKZ2bFVfXx94QrcIMttSLzF)
UPDATE `course_lessons`
SET `video_url` = 'https://drive.google.com/file/d/1QELRjEfntnKZ2bFVfXx94QrcIMttSLzF/preview'
WHERE `certification_id` = 332 AND `type` = 'lesson';

-- If Course 332 is missing chapters, insert phases 2-4 and assessment
INSERT IGNORE INTO `course_lessons` (`certification_id`, `chapter`, `title`, `duration`, `type`, `video_url`, `sort_order`, `status`)
SELECT 332, 'Phase 2', 'Understanding ISO 14001:2026 Requirements', '1 Hour', 'lesson', 'https://drive.google.com/file/d/1QELRjEfntnKZ2bFVfXx94QrcIMttSLzF/preview', 2, 'active'
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `course_lessons` WHERE `certification_id` = 332 AND `sort_order` = 2);

INSERT IGNORE INTO `course_lessons` (`certification_id`, `chapter`, `title`, `duration`, `type`, `video_url`, `sort_order`, `status`)
SELECT 332, 'Phase 3', 'Environmental Aspects and Impacts', '50 Mins', 'lesson', 'https://drive.google.com/file/d/1QELRjEfntnKZ2bFVfXx94QrcIMttSLzF/preview', 3, 'active'
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `course_lessons` WHERE `certification_id` = 332 AND `sort_order` = 3);

INSERT IGNORE INTO `course_lessons` (`certification_id`, `chapter`, `title`, `duration`, `type`, `video_url`, `sort_order`, `status`)
SELECT 332, 'Phase 4', 'Operational Control and Emergency Preparedness', '45 Mins', 'lesson', 'https://drive.google.com/file/d/1QELRjEfntnKZ2bFVfXx94QrcIMttSLzF/preview', 4, 'active'
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `course_lessons` WHERE `certification_id` = 332 AND `sort_order` = 4);

INSERT IGNORE INTO `course_lessons` (`certification_id`, `chapter`, `title`, `duration`, `type`, `video_url`, `sort_order`, `status`)
SELECT 332, 'Assessment', 'Final Assessment', '30 Minutes', 'assessment', NULL, 13, 'active'
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `course_lessons` WHERE `certification_id` = 332 AND `type` = 'assessment');

-- Course 3: ISO 45001:2018 OHSMS (Drive ID: 1d8fXlmI7RynuPhO_sgCtsQM1Bd7WQ0Qn)
UPDATE `course_lessons`
SET `video_url` = 'https://drive.google.com/file/d/1d8fXlmI7RynuPhO_sgCtsQM1Bd7WQ0Qn/preview'
WHERE `certification_id` = 323 AND `type` = 'lesson';

-- Course 4: ISO 22000:2018 FSMS (Drive ID: 1ata4Mu3Fq-US5W1LR3Sz0nbw1RbecBMv)
UPDATE `course_lessons`
SET `video_url` = 'https://drive.google.com/file/d/1ata4Mu3Fq-US5W1LR3Sz0nbw1RbecBMv/preview'
WHERE `certification_id` = 324 AND `type` = 'lesson';

-- Course 5: ISO 19011:2026 Auditing (Drive ID: 1B0lAdFBcJjpCpYRFjGzpQF_rUPv5KMen)
UPDATE `course_lessons`
SET `video_url` = 'https://drive.google.com/file/d/1B0lAdFBcJjpCpYRFjGzpQF_rUPv5KMen/preview'
WHERE `certification_id` = 325 AND `type` = 'lesson';

-- Course 6: ISO 27001:2022 ISMS (Drive ID: 1nBU1umbTslqdgl7Lt1JfUhV1MhnwhCu1)
UPDATE `course_lessons`
SET `video_url` = 'https://drive.google.com/file/d/1nBU1umbTslqdgl7Lt1JfUhV1MhnwhCu1/preview'
WHERE `certification_id` = 333 AND `type` = 'lesson';

-- Course 7: 5S Workplace Management (Drive ID: 1f3IPJVBmxft4RFWT_1tNP0fcLVmqFgEH)
UPDATE `course_lessons`
SET `video_url` = 'https://drive.google.com/file/d/1f3IPJVBmxft4RFWT_1tNP0fcLVmqFgEH/preview'
WHERE `certification_id` = 326 AND `type` = 'lesson';

-- Course 8: 7QC Tools Certification (Drive ID: 1N6W0gecj1oY2keSxzWDX_ZMLB0ctH-eZ)
UPDATE `course_lessons`
SET `video_url` = 'https://drive.google.com/file/d/1N6W0gecj1oY2keSxzWDX_ZMLB0ctH-eZ/preview'
WHERE `certification_id` = 327 AND `type` = 'lesson';

-- Course 9: Project Management Level-1 (Drive ID: 16rIvkCdLNu9t0prtwdwbeWVRibRdwhXZ)
INSERT IGNORE INTO `course_lessons` (`certification_id`, `chapter`, `title`, `duration`, `type`, `video_url`, `sort_order`, `status`)
SELECT 328, 'Phase 1', 'Introduction to Project Management', '45 Mins', 'lesson', 'https://drive.google.com/file/d/16rIvkCdLNu9t0prtwdwbeWVRibRdwhXZ/preview', 1, 'active'
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `course_lessons` WHERE `certification_id` = 328 AND `sort_order` = 1);

INSERT IGNORE INTO `course_lessons` (`certification_id`, `chapter`, `title`, `duration`, `type`, `video_url`, `sort_order`, `status`)
SELECT 328, 'Phase 2', 'Project Lifecycle and Methodology', '1 Hour', 'lesson', 'https://drive.google.com/file/d/16rIvkCdLNu9t0prtwdwbeWVRibRdwhXZ/preview', 2, 'active'
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `course_lessons` WHERE `certification_id` = 328 AND `sort_order` = 2);

INSERT IGNORE INTO `course_lessons` (`certification_id`, `chapter`, `title`, `duration`, `type`, `video_url`, `sort_order`, `status`)
SELECT 328, 'Phase 3', 'Quality and Risk Planning', '50 Mins', 'lesson', 'https://drive.google.com/file/d/16rIvkCdLNu9t0prtwdwbeWVRibRdwhXZ/preview', 3, 'active'
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `course_lessons` WHERE `certification_id` = 328 AND `sort_order` = 3);

INSERT IGNORE INTO `course_lessons` (`certification_id`, `chapter`, `title`, `duration`, `type`, `video_url`, `sort_order`, `status`)
SELECT 328, 'Phase 4', 'Project Execution and Monitoring', '45 Mins', 'lesson', 'https://drive.google.com/file/d/16rIvkCdLNu9t0prtwdwbeWVRibRdwhXZ/preview', 4, 'active'
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `course_lessons` WHERE `certification_id` = 328 AND `sort_order` = 4);

INSERT IGNORE INTO `course_lessons` (`certification_id`, `chapter`, `title`, `duration`, `type`, `video_url`, `sort_order`, `status`)
SELECT 328, 'Assessment', 'Final Assessment', '30 Minutes', 'assessment', NULL, 13, 'active'
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `course_lessons` WHERE `certification_id` = 328 AND `type` = 'assessment');

UPDATE `course_lessons`
SET `video_url` = 'https://drive.google.com/file/d/16rIvkCdLNu9t0prtwdwbeWVRibRdwhXZ/preview'
WHERE `certification_id` = 328 AND `type` = 'lesson';

-- Course 10: Lean Six Sigma White Belt (Drive ID: 1fxp0MwEy6hEvw5jKbnEeoX-7eadJUZR_)
UPDATE `course_lessons`
SET `video_url` = 'https://drive.google.com/file/d/1fxp0MwEy6hEvw5jKbnEeoX-7eadJUZR_/preview'
WHERE `certification_id` = 329 AND `type` = 'lesson';

-- Course 11: Root Cause Analysis (Drive ID: 10H6QOlqWd_IJdASNAJyyZ5Q3z9the8xu)
UPDATE `course_lessons`
SET `video_url` = 'https://drive.google.com/file/d/10H6QOlqWd_IJdASNAJyyZ5Q3z9the8xu/preview'
WHERE `certification_id` = 330 AND `type` = 'lesson';

-- Verify update counts
SELECT `certification_id`, COUNT(*) as lesson_count, SUM(CASE WHEN `video_url` IS NOT NULL THEN 1 ELSE 0 END) as video_count
FROM `course_lessons`
WHERE `certification_id` IN (322, 332, 323, 324, 325, 333, 326, 327, 328, 329, 330)
GROUP BY `certification_id`;

