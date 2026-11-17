-- Broadbeach Academy — Incremental Certificate Import Migration
-- Generated: 2026-11-17
-- Record: 26BB03769 (jagdeep singh)

INSERT INTO `manual_certificates` (`certificate_number`, `student_name`, `candidate_email`, `course_name`, `issue_date`, `completion_date`, `issuing_organization`, `signatory`, `training_type`, `status`, `verification_status`) VALUES
('26BB03769', 'jagdeep singh', 'jsmuman@gmail.com', 'IATF 16949:2016 INTERNAL AUDITOR', '2026-09-17', '2026-09-17', 'Broadbeach Academy', 'Dr. K. R. Sharma, Academic Director', 'Corporate Training', 'valid', 'Valid')
ON DUPLICATE KEY UPDATE
  `student_name` = VALUES(`student_name`),
  `candidate_email` = VALUES(`candidate_email`),
  `course_name` = VALUES(`course_name`),
  `issue_date` = VALUES(`issue_date`),
  `completion_date` = VALUES(`completion_date`),
  `status` = VALUES(`status`),
  `verification_status` = VALUES(`verification_status`);
