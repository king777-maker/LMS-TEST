-- Broadbeach Academy — Incremental 4 Manual Certificates Import Migration
-- Generated: 2026-11-11
-- Records: 25BB234410, 25BB234411, 25BB234412, 26BB03768

INSERT INTO `manual_certificates` (`certificate_number`, `student_name`, `candidate_email`, `course_name`, `issue_date`, `completion_date`, `issuing_organization`, `signatory`, `training_type`, `status`, `verification_status`) VALUES
('25BB234410', 'SUPRIYA.J', '', 'IECQ HSPM QC 080000', '2025-07-30', '2025-07-30', 'Broadbeach Academy', 'Dr. K. R. Sharma, Academic Director', 'Corporate Training', 'valid', 'Valid'),
('25BB234411', 'ASHOK JONNA', '', 'IECQ HSPM QC 080000', '2025-07-30', '2025-07-30', 'Broadbeach Academy', 'Dr. K. R. Sharma, Academic Director', 'Corporate Training', 'valid', 'Valid'),
('25BB234412', 'NANDHAKUMAR B', '', 'IECQ HSPM QC 080000', '2025-07-30', '2025-07-30', 'Broadbeach Academy', 'Dr. K. R. Sharma, Academic Director', 'Corporate Training', 'valid', 'Valid'),
('26BB03768', 'Eric Siaw nartey', '', 'LEAN SIX SIGMA BLACK BELT', '2026-10-27', '2026-10-27', 'Broadbeach Academy', 'Dr. K. R. Sharma, Academic Director', 'Corporate Training', 'valid', 'Valid')
ON DUPLICATE KEY UPDATE
  `student_name` = VALUES(`student_name`),
  `course_name` = VALUES(`course_name`),
  `issue_date` = VALUES(`issue_date`),
  `completion_date` = VALUES(`completion_date`),
  `status` = VALUES(`status`),
  `verification_status` = VALUES(`verification_status`);
