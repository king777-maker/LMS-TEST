-- ============================================================================
-- BROADBEACH ACADEMY — OFFICIAL GOOGLE DRIVE MCQ QUESTIONS IMPORT MIGRATION
-- Database: broad_beach_online
-- Generated: 2026-11-07
-- Target: All 11 Free Courses Assessments & Questions
-- Source: Google Drive Folder 1Y7qARKx-I6mOvOPDIUjT822jHGNVjR-T
-- ============================================================================

SET FOREIGN_KEY_CHECKS = 0;
START TRANSACTION;

-- ----------------------------------------------------------------------------
-- STEP 1: Ensure course_assessments records exist with standardized settings
-- Duration: 30 minutes, Passing: 70%, Total Questions: 10, Status: 'active'
-- ----------------------------------------------------------------------------

-- Course 322: ISO 9001:2026 QMS
INSERT INTO course_assessments (
    id,
    certification_id,
    title,
    duration_minutes,
    passing_percentage,
    total_questions,
    status,
    created_at,
    updated_at
) VALUES (
    322,
    322,
    'ISO 9001:2026 QMS Final Assessment',
    30,
    70,
    10,
    'active',
    NOW(),
    NOW()
) ON DUPLICATE KEY UPDATE
    title = VALUES(title),
    duration_minutes = 30,
    passing_percentage = 70,
    total_questions = 10,
    status = 'active',
    updated_at = NOW();

-- Course 332: ISO14001: 2026 EMS
INSERT INTO course_assessments (
    id,
    certification_id,
    title,
    duration_minutes,
    passing_percentage,
    total_questions,
    status,
    created_at,
    updated_at
) VALUES (
    332,
    332,
    'ISO14001: 2026 EMS Final Assessment',
    30,
    70,
    10,
    'active',
    NOW(),
    NOW()
) ON DUPLICATE KEY UPDATE
    title = VALUES(title),
    duration_minutes = 30,
    passing_percentage = 70,
    total_questions = 10,
    status = 'active',
    updated_at = NOW();

-- Course 323: ISO 45001:2018 OHSMS
INSERT INTO course_assessments (
    id,
    certification_id,
    title,
    duration_minutes,
    passing_percentage,
    total_questions,
    status,
    created_at,
    updated_at
) VALUES (
    323,
    323,
    'ISO 45001:2018 OHSMS Final Assessment',
    30,
    70,
    10,
    'active',
    NOW(),
    NOW()
) ON DUPLICATE KEY UPDATE
    title = VALUES(title),
    duration_minutes = 30,
    passing_percentage = 70,
    total_questions = 10,
    status = 'active',
    updated_at = NOW();

-- Course 324: ISO 22000:2018 FSMS
INSERT INTO course_assessments (
    id,
    certification_id,
    title,
    duration_minutes,
    passing_percentage,
    total_questions,
    status,
    created_at,
    updated_at
) VALUES (
    324,
    324,
    'ISO 22000:2018 FSMS Final Assessment',
    30,
    70,
    10,
    'active',
    NOW(),
    NOW()
) ON DUPLICATE KEY UPDATE
    title = VALUES(title),
    duration_minutes = 30,
    passing_percentage = 70,
    total_questions = 10,
    status = 'active',
    updated_at = NOW();

-- Course 325: ISO 19011:2026
INSERT INTO course_assessments (
    id,
    certification_id,
    title,
    duration_minutes,
    passing_percentage,
    total_questions,
    status,
    created_at,
    updated_at
) VALUES (
    325,
    325,
    'ISO 19011:2026 Final Assessment',
    30,
    70,
    10,
    'active',
    NOW(),
    NOW()
) ON DUPLICATE KEY UPDATE
    title = VALUES(title),
    duration_minutes = 30,
    passing_percentage = 70,
    total_questions = 10,
    status = 'active',
    updated_at = NOW();

-- Course 333: ISO 27001:2022 ISMS
INSERT INTO course_assessments (
    id,
    certification_id,
    title,
    duration_minutes,
    passing_percentage,
    total_questions,
    status,
    created_at,
    updated_at
) VALUES (
    333,
    333,
    'ISO 27001:2022 ISMS Final Assessment',
    30,
    70,
    10,
    'active',
    NOW(),
    NOW()
) ON DUPLICATE KEY UPDATE
    title = VALUES(title),
    duration_minutes = 30,
    passing_percentage = 70,
    total_questions = 10,
    status = 'active',
    updated_at = NOW();

-- Course 326: 5S Workplace Management
INSERT INTO course_assessments (
    id,
    certification_id,
    title,
    duration_minutes,
    passing_percentage,
    total_questions,
    status,
    created_at,
    updated_at
) VALUES (
    326,
    326,
    '5S Workplace Management Final Assessment',
    30,
    70,
    10,
    'active',
    NOW(),
    NOW()
) ON DUPLICATE KEY UPDATE
    title = VALUES(title),
    duration_minutes = 30,
    passing_percentage = 70,
    total_questions = 10,
    status = 'active',
    updated_at = NOW();

-- Course 327: 7QC Tools Certification
INSERT INTO course_assessments (
    id,
    certification_id,
    title,
    duration_minutes,
    passing_percentage,
    total_questions,
    status,
    created_at,
    updated_at
) VALUES (
    327,
    327,
    '7QC Tools Certification Final Assessment',
    30,
    70,
    10,
    'active',
    NOW(),
    NOW()
) ON DUPLICATE KEY UPDATE
    title = VALUES(title),
    duration_minutes = 30,
    passing_percentage = 70,
    total_questions = 10,
    status = 'active',
    updated_at = NOW();

-- Course 328: Project Management Level-1
INSERT INTO course_assessments (
    id,
    certification_id,
    title,
    duration_minutes,
    passing_percentage,
    total_questions,
    status,
    created_at,
    updated_at
) VALUES (
    328,
    328,
    'Project Management Level-1 Final Assessment',
    30,
    70,
    10,
    'active',
    NOW(),
    NOW()
) ON DUPLICATE KEY UPDATE
    title = VALUES(title),
    duration_minutes = 30,
    passing_percentage = 70,
    total_questions = 10,
    status = 'active',
    updated_at = NOW();

-- Course 329: Lean Six Sigma White belt
INSERT INTO course_assessments (
    id,
    certification_id,
    title,
    duration_minutes,
    passing_percentage,
    total_questions,
    status,
    created_at,
    updated_at
) VALUES (
    329,
    329,
    'Lean Six Sigma White belt Final Assessment',
    30,
    70,
    10,
    'active',
    NOW(),
    NOW()
) ON DUPLICATE KEY UPDATE
    title = VALUES(title),
    duration_minutes = 30,
    passing_percentage = 70,
    total_questions = 10,
    status = 'active',
    updated_at = NOW();

-- Course 330: Root Cause Analysis
INSERT INTO course_assessments (
    id,
    certification_id,
    title,
    duration_minutes,
    passing_percentage,
    total_questions,
    status,
    created_at,
    updated_at
) VALUES (
    330,
    330,
    'Root Cause Analysis Final Assessment',
    30,
    70,
    10,
    'active',
    NOW(),
    NOW()
) ON DUPLICATE KEY UPDATE
    title = VALUES(title),
    duration_minutes = 30,
    passing_percentage = 70,
    total_questions = 10,
    status = 'active',
    updated_at = NOW();

-- ----------------------------------------------------------------------------
-- STEP 2: Clear outdated questions for these 11 courses to prevent duplicates
-- ----------------------------------------------------------------------------
DELETE FROM assessment_questions 
WHERE assessment_id IN (322, 332, 323, 324, 325, 333, 326, 327, 328, 329, 330);

-- ----------------------------------------------------------------------------
-- STEP 3: Insert official 10 questions per course from Google Drive PDFs
-- ----------------------------------------------------------------------------

-- ----------------------------------------------------------------------------
-- Questions for Course 322: ISO 9001:2026 QMS (ISO_9001_2026_MCQs_Answers_n_Question.pdf)
-- ----------------------------------------------------------------------------
INSERT INTO assessment_questions (
    assessment_id,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    sort_order,
    status,
    created_at,
    updated_at
) VALUES
(
    322,
    'What is the primary purpose of ISO 9001:2026?',
    'To establish environmental management requirements',
    'To establish requirements for a Quality Management System',
    'To establish occupational health and safety requirements',
    'To establish financial management requirements',
    'To establish requirements for a Quality Management System',
    1,
    'active',
    NOW(),
    NOW()
),
(
    322,
    'Which organization publishes the ISO 9001 standard?',
    'International Labour Organization (ILO)',
    'World Trade Organization (WTO)',
    'International Organization for Standardization (ISO)',
    'World Health Organization (WHO)',
    'International Organization for Standardization (ISO)',
    2,
    'active',
    NOW(),
    NOW()
),
(
    322,
    'Which of the following is emphasized more strongly in ISO 9001:2026?',
    'Financial auditing',
    'Quality culture and ethical behaviour',
    'Employee salary management',
    'Marketing strategies',
    'Quality culture and ethical behaviour',
    3,
    'active',
    NOW(),
    NOW()
),
(
    322,
    'What is the main responsibility of top management in a Quality Management System?',
    'Delegate all quality responsibilities to the quality department',
    'Demonstrate leadership and commitment to the QMS',
    'Perform all internal audits personally',
    'Approve every purchase order',
    'Demonstrate leadership and commitment to the QMS',
    4,
    'active',
    NOW(),
    NOW()
),
(
    322,
    'What is the main objective of customer focus in ISO 9001:2026?',
    'Increasing employee working hours',
    'Reducing product variety',
    'Enhancing customer satisfaction and meeting customer requirements',
    'Reducing communication with customers',
    'Enhancing customer satisfaction and meeting customer requirements',
    5,
    'active',
    NOW(),
    NOW()
),
(
    322,
    'How does ISO 9001:2026 address risks and opportunities?',
    'By ignoring potential risks',
    'By addressing only financial risks',
    'By providing a clearer distinction between actions to address risks and opportunities',
    'By eliminating the need for risk assessment',
    'By providing a clearer distinction between actions to address risks and opportunities',
    6,
    'active',
    NOW(),
    NOW()
),
(
    322,
    'Which of the following is important for employee awareness?',
    'Understanding the quality policy and their contribution to QMS effectiveness',
    'Knowing only their salary details',
    'Avoiding participation in quality activities',
    'Performing duties without following procedures',
    'Understanding the quality policy and their contribution to QMS effectiveness',
    7,
    'active',
    NOW(),
    NOW()
),
(
    322,
    'What is the purpose of an internal audit?',
    'To identify employees for termination',
    'To evaluate whether the QMS conforms to requirements and is effectively implemented',
    'To increase production costs',
    'To replace management reviews',
    'To evaluate whether the QMS conforms to requirements and is effectively implemented',
    8,
    'active',
    NOW(),
    NOW()
),
(
    322,
    'What is the purpose of continual improvement in a QMS?',
    'To maintain existing processes without changes',
    'To reduce customer interaction',
    'To improve the suitability, adequacy and effectiveness of the QMS',
    'To eliminate the need for performance evaluation',
    'To improve the suitability, adequacy and effectiveness of the QMS',
    9,
    'active',
    NOW(),
    NOW()
),
(
    322,
    'What is the purpose of Annex A in ISO 9001:2026?',
    'To provide financial reporting formats',
    'To clarify key concepts, terminology and the intent of requirements',
    'To establish employee attendance rules',
    'To provide product pricing guidelines',
    'To clarify key concepts, terminology and the intent of requirements',
    10,
    'active',
    NOW(),
    NOW()
);

-- ----------------------------------------------------------------------------
-- Questions for Course 332: ISO14001: 2026 EMS (ISO 14001_2026 FREE COURCE MCQ QUESTION.pdf)
-- ----------------------------------------------------------------------------
INSERT INTO assessment_questions (
    assessment_id,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    sort_order,
    status,
    created_at,
    updated_at
) VALUES
(
    332,
    'What is the main objective of ISO 14001?',
    'Improve financial performance',
    'Environmental management system implementation',
    'Employee satisfaction',
    'Product design',
    'Environmental management system implementation',
    1,
    'active',
    NOW(),
    NOW()
),
(
    332,
    'ISO 14001 is based on which cycle?',
    'SWOT',
    'PDCA (Plan-Do-Check-Act)',
    'Six Sigma',
    'Kaizen',
    'PDCA (Plan-Do-Check-Act)',
    2,
    'active',
    NOW(),
    NOW()
),
(
    332,
    'What does EMS stand for?',
    'Environmental Monitoring System',
    'Environmental Management System',
    'Energy Management System',
    'Engineering Management System',
    'Environmental Management System',
    3,
    'active',
    NOW(),
    NOW()
),
(
    332,
    'Which clause deals with Leadership?',
    'Clause 4',
    'Clause 5',
    'Clause 6',
    'Clause 7',
    'Clause 5',
    4,
    'active',
    NOW(),
    NOW()
),
(
    332,
    'What is an environmental aspect?',
    'Legal requirement',
    'Element of activities that interacts with environment',
    'Audit finding',
    'Policy statement',
    'Element of activities that interacts with environment',
    5,
    'active',
    NOW(),
    NOW()
),
(
    332,
    'What is an environmental impact?',
    'Change to the environment',
    'Company profit',
    'Employee training',
    'Internal audit',
    'Change to the environment',
    6,
    'active',
    NOW(),
    NOW()
),
(
    332,
    'Which clause covers planning?',
    'Clause 6',
    'Clause 7',
    'Clause 8',
    'Clause 9',
    'Clause 6',
    7,
    'active',
    NOW(),
    NOW()
),
(
    332,
    'Compliance obligations refer to:',
    'Internal rules only',
    'Legal and other requirements',
    'Financial obligations',
    'Customer complaints',
    'Legal and other requirements',
    8,
    'active',
    NOW(),
    NOW()
),
(
    332,
    'What is the purpose of Environmental Policy?',
    'Marketing tool',
    'Commitment to environmental protection',
    'Financial planning',
    'HR guideline',
    'Commitment to environmental protection',
    9,
    'active',
    NOW(),
    NOW()
),
(
    332,
    'Which clause relates to Support?',
    'Clause 6',
    'Clause 7',
    'Clause 8',
    'Clause 10',
    'Clause 7',
    10,
    'active',
    NOW(),
    NOW()
);

-- ----------------------------------------------------------------------------
-- Questions for Course 323: ISO 45001:2018 OHSMS (ISO 45001 MCQ Assessment.pdf)
-- ----------------------------------------------------------------------------
INSERT INTO assessment_questions (
    assessment_id,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    sort_order,
    status,
    created_at,
    updated_at
) VALUES
(
    323,
    'What is the primary focus of the ISO 45001:2018 standard?',
    'Quality management systems',
    'Occupational health and safety (OH&S)',
    'Environmental management systems',
    'Energy management systems',
    'Occupational health and safety (OH&S)',
    1,
    'active',
    NOW(),
    NOW()
),
(
    323,
    'Which standard did ISO 45001:2018 replace?',
    'OHSAS 18001',
    'ISO 9001',
    'ISO 14001',
    'ISO 31000',
    'OHSAS 18001',
    2,
    'active',
    NOW(),
    NOW()
),
(
    323,
    'Which clause of ISO 45001:2018 specifically addresses consultation and participation of workers?',
    'Clause 4.1',
    'Clause 5.4',
    'Clause 7.2',
    'Clause 9.1',
    'Clause 5.4',
    3,
    'active',
    NOW(),
    NOW()
),
(
    323,
    'What is the top level in the Hierarchy of Controls according to ISO 45001?',
    'Substitution',
    'Personal Protective Equipment (PPE)',
    'Elimination',
    'Engineering controls',
    'Elimination',
    4,
    'active',
    NOW(),
    NOW()
),
(
    323,
    'In ISO 45001 terminology, what is defined as a source with a potential to cause injury and ill health?',
    'Risk',
    'Incident',
    'Hazard',
    'Nonconformity',
    'Hazard',
    5,
    'active',
    NOW(),
    NOW()
),
(
    323,
    'Which high-level structure (HLS) structure is ISO 45001:2018 based on?',
    'Annex SL',
    'Annex A',
    'ISO Guide 73',
    'PAS 99',
    'Annex SL',
    6,
    'active',
    NOW(),
    NOW()
),
(
    323,
    'What is an occurrence arising out of, or in the course of, work that could or does result in injury and ill health called?',
    'Audit finding',
    'Incident',
    'Correction',
    'Emergency situation',
    'Incident',
    7,
    'active',
    NOW(),
    NOW()
),
(
    323,
    'Which clause requires the organization to plan, establish, implement, and maintain an internal audit program?',
    'Clause 6.1',
    'Clause 8.2',
    'Clause 9.2',
    'Clause 10.1',
    'Clause 9.2',
    8,
    'active',
    NOW(),
    NOW()
),
(
    323,
    'According to ISO 45001, who holds the ultimate responsibility for the OH&S management system?',
    'External Auditors',
    'Top Management',
    'Safety Officers',
    'Frontline Workers',
    'Top Management',
    9,
    'active',
    NOW(),
    NOW()
),
(
    323,
    'What action must be taken first when a nonconformity or incident occurs under Clause 10.2?',
    'React to the incident and take action to control/correct it',
    'Change the OH&S policy',
    'Conduct a management review',
    'Terminate involved personnel',
    'React to the incident and take action to control/correct it',
    10,
    'active',
    NOW(),
    NOW()
);

-- ----------------------------------------------------------------------------
-- Questions for Course 324: ISO 22000:2018 FSMS (ISO_22000_2018_10_MCQs_with_Answers.pdf)
-- ----------------------------------------------------------------------------
INSERT INTO assessment_questions (
    assessment_id,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    sort_order,
    status,
    created_at,
    updated_at
) VALUES
(
    324,
    'What is the main purpose of ISO 22000:2018?',
    'To establish requirements for an environmental management system',
    'To provide requirements for a Food Safety Management System (FSMS)',
    'To establish requirements for occupational health and safety',
    'To define financial management procedures',
    'To provide requirements for a Food Safety Management System (FSMS)',
    1,
    'active',
    NOW(),
    NOW()
),
(
    324,
    'Which organizations can use ISO 22000:2018?',
    'Only food manufacturing companies',
    'Only restaurants and hotels',
    'Any organization directly or indirectly involved in the food chain',
    'Only government food inspection agencies',
    'Any organization directly or indirectly involved in the food chain',
    2,
    'active',
    NOW(),
    NOW()
),
(
    324,
    'What does HACCP stand for?',
    'Hazard Analysis and Critical Control Points',
    'Health Assessment and Control Compliance Programme',
    'Hazard Audit and Certification Control Process',
    'Hygiene Analysis and Critical Cleaning Procedures',
    'Hazard Analysis and Critical Control Points',
    3,
    'active',
    NOW(),
    NOW()
),
(
    324,
    'What is the purpose of prerequisite programmes (PRPs)?',
    'To establish basic conditions and activities needed to maintain a hygienic environment',
    'To replace the HACCP plan',
    'To determine product selling prices',
    'To conduct employee performance reviews',
    'To establish basic conditions and activities needed to maintain a hygienic environment',
    4,
    'active',
    NOW(),
    NOW()
),
(
    324,
    'Which of the following is an example of a biological food safety hazard?',
    'Glass fragments',
    'Cleaning chemical residue',
    'Salmonella bacteria',
    'Metal particles',
    'Salmonella bacteria',
    5,
    'active',
    NOW(),
    NOW()
),
(
    324,
    'What is a Critical Control Point (CCP)?',
    'A step where control can be applied and is essential to prevent, eliminate or reduce a significant food safety hazard to an acceptable level',
    'Any routine office activity',
    'A point used only for product packaging design',
    'A stage where food safety monitoring is unnecessary',
    'A step where control can be applied and is essential to prevent, eliminate or reduce a significant food safety hazard to an acceptable level',
    6,
    'active',
    NOW(),
    NOW()
),
(
    324,
    'What is the purpose of establishing critical limits at a CCP?',
    'To define measurable or observable criteria that separate acceptable from unacceptable control',
    'To set employee working hours',
    'To determine the product''s market price',
    'To eliminate the need for monitoring',
    'To define measurable or observable criteria that separate acceptable from unacceptable control',
    7,
    'active',
    NOW(),
    NOW()
),
(
    324,
    'What should an organization do when monitoring shows that a CCP is not under control?',
    'Ignore the result if the product looks acceptable',
    'Take appropriate corrections and corrective actions according to the established procedures',
    'Continue production without recording the issue',
    'Delete the monitoring records',
    'Take appropriate corrections and corrective actions according to the established procedures',
    8,
    'active',
    NOW(),
    NOW()
),
(
    324,
    'Why is traceability important in a Food Safety Management System?',
    'It helps identify and trace food, ingredients and relevant information through the food chain',
    'It replaces supplier evaluation',
    'It removes the need for product identification',
    'It is used only for financial reporting',
    'It helps identify and trace food, ingredients and relevant information through the food chain',
    9,
    'active',
    NOW(),
    NOW()
),
(
    324,
    'What is the purpose of verification in ISO 22000:2018?',
    'To confirm that planned arrangements are implemented and effective',
    'To advertise food products',
    'To replace validation of control measures',
    'To avoid reviewing FSMS performance',
    'To confirm that planned arrangements are implemented and effective',
    10,
    'active',
    NOW(),
    NOW()
);

-- ----------------------------------------------------------------------------
-- Questions for Course 325: ISO 19011:2026 (ISO_19011_2026_10_MCQs_with_Answers.pdf)
-- ----------------------------------------------------------------------------
INSERT INTO assessment_questions (
    assessment_id,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    sort_order,
    status,
    created_at,
    updated_at
) VALUES
(
    325,
    'What is the main purpose of ISO 19011:2026?',
    'To specify product quality requirements',
    'To provide guidelines for auditing management systems',
    'To establish environmental performance limits',
    'To certify individual auditors',
    'To provide guidelines for auditing management systems',
    1,
    'active',
    NOW(),
    NOW()
),
(
    325,
    'Which of the following is an auditing principle in ISO 19011:2026?',
    'Profitability',
    'Confidentiality',
    'Production efficiency',
    'Product design',
    'Confidentiality',
    2,
    'active',
    NOW(),
    NOW()
),
(
    325,
    'What does the principle of integrity require from an auditor?',
    'To report findings honestly and ethically',
    'To change evidence to support the audit conclusion',
    'To avoid documenting nonconformities',
    'To guarantee that no problems will be found',
    'To report findings honestly and ethically',
    3,
    'active',
    NOW(),
    NOW()
),
(
    325,
    'What is the purpose of an audit programme?',
    'To manage one employee''s daily tasks',
    'To organize one or more audits over a defined period and toward specific objectives',
    'To replace management review',
    'To approve all operational purchases',
    'To organize one or more audits over a defined period and toward specific objectives',
    4,
    'active',
    NOW(),
    NOW()
),
(
    325,
    'Which factor should be considered when determining audit programme risks and opportunities?',
    'The auditor''s personal preferences',
    'The context of the organization and factors that may affect the audit programme',
    'The colour of audit documents',
    'The number of office visitors',
    'The context of the organization and factors that may affect the audit programme',
    5,
    'active',
    NOW(),
    NOW()
),
(
    325,
    'What should be defined before conducting an individual audit?',
    'Audit objectives, scope and criteria',
    'Employee salary levels',
    'Product selling prices',
    'The organization''s advertising plan',
    'Audit objectives, scope and criteria',
    6,
    'active',
    NOW(),
    NOW()
),
(
    325,
    'What is the purpose of evaluating auditor competence?',
    'To ensure auditors have the necessary knowledge and skills for their assigned audit activities',
    'To determine an auditor''s sales target',
    'To eliminate the need for audit evidence',
    'To guarantee identical audit findings',
    'To ensure auditors have the necessary knowledge and skills for their assigned audit activities',
    7,
    'active',
    NOW(),
    NOW()
),
(
    325,
    'Which approach requires audit conclusions to be based on verifiable information?',
    'Personal-opinion approach',
    'Evidence-based approach',
    'Informal approach',
    'Promotional approach',
    'Evidence-based approach',
    8,
    'active',
    NOW(),
    NOW()
),
(
    325,
    'What is an important consideration when conducting a remote audit?',
    'Ignore information security',
    'Confirm that technology, access, communication and evidence arrangements are suitable',
    'Avoid planning the audit',
    'Accept all information without verification',
    'Confirm that technology, access, communication and evidence arrangements are suitable',
    9,
    'active',
    NOW(),
    NOW()
),
(
    325,
    'What is a notable focus expanded in ISO 19011:2026 compared with the 2018 edition?',
    'Guidance on remote auditing methods and virtual locations',
    'Requirements for product certification',
    'Financial accounting procedures',
    'Mandatory certification of auditors',
    'Guidance on remote auditing methods and virtual locations',
    10,
    'active',
    NOW(),
    NOW()
);

-- ----------------------------------------------------------------------------
-- Questions for Course 333: ISO 27001:2022 ISMS (ISO 27001 MCQ Assessment.pdf)
-- ----------------------------------------------------------------------------
INSERT INTO assessment_questions (
    assessment_id,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    sort_order,
    status,
    created_at,
    updated_at
) VALUES
(
    333,
    'What does ISO/IEC 27001:2022 primarily specify?',
    'Software development guidelines',
    'Requirements for an ISMS',
    'Personal data protection rights',
    'Network cable standards',
    'Requirements for an ISMS',
    1,
    'active',
    NOW(),
    NOW()
),
(
    333,
    'How many controls are listed in Annex A of ISO/IEC 27001:2022?',
    '114 controls',
    '93 controls',
    '150 controls',
    '82 controls',
    '93 controls',
    2,
    'active',
    NOW(),
    NOW()
),
(
    333,
    'Annex A controls in ISO/IEC 27001:2022 are categorized into how many themes?',
    '4 themes',
    '14 themes',
    '10 themes',
    '6 themes',
    '4 themes',
    3,
    'active',
    NOW(),
    NOW()
),
(
    333,
    'Which of the following is NOT one of the four main themes in Annex A (2022 edition)?',
    'Organizational controls',
    'Financial controls',
    'Physical controls',
    'Technological controls',
    'Financial controls',
    4,
    'active',
    NOW(),
    NOW()
),
(
    333,
    'What does "ISMS" stand for in the context of ISO 27001?',
    'Information Security Management System',
    'Integrated System Management System',
    'Internet Security and Monitoring System',
    'Information Storage Model standard',
    'Information Security Management System',
    5,
    'active',
    NOW(),
    NOW()
),
(
    333,
    'Which clause of ISO/IEC 27001 focuses on "Operation" and risk treatment execution?',
    'Clause 4',
    'Clause 6',
    'Clause 8',
    'Clause 10',
    'Clause 8',
    6,
    'active',
    NOW(),
    NOW()
),
(
    333,
    'What document must an organization produce to declare which Annex A controls apply to their ISMS?',
    'Statement of Applicability (SoA)',
    'Service Level Agreement (SLA)',
    'Non-Disclosure Agreement (NDA)',
    'Business Impact Analysis (BIA)',
    'Statement of Applicability (SoA)',
    7,
    'active',
    NOW(),
    NOW()
),
(
    333,
    'Which methodology is typically referenced for continuous improvement in ISO standards?',
    'Agile / Scrum',
    'Plan-Do-Check-Act (PDCA)',
    'Waterfall',
    'Six Sigma DMAIC',
    'Plan-Do-Check-Act (PDCA)',
    8,
    'active',
    NOW(),
    NOW()
),
(
    333,
    'Under ISO/IEC 27001:2022, which title refers to the theme containing human resources security controls?',
    'Organizational controls',
    'People controls',
    'Physical controls',
    'Technological controls',
    'People controls',
    9,
    'active',
    NOW(),
    NOW()
),
(
    333,
    'What is the primary purpose of an internal ISMS audit (Clause 9.2)?',
    'To penalize non-compliant employees',
    'To verify conformance with standard requirements',
    'To replace external certification audits',
    'To design network architecture',
    'To verify conformance with standard requirements',
    10,
    'active',
    NOW(),
    NOW()
);

-- ----------------------------------------------------------------------------
-- Questions for Course 326: 5S Workplace Management (5S_Workplace_Management_LMS_Assessment_MCQs_Answers.pdf)
-- ----------------------------------------------------------------------------
INSERT INTO assessment_questions (
    assessment_id,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    sort_order,
    status,
    created_at,
    updated_at
) VALUES
(
    326,
    'What is the primary purpose of the 5S methodology?',
    'To increase employee working hours',
    'To create a clean, organized, safe and efficient workplace',
    'To reduce employee responsibilities',
    'To increase paperwork',
    'To create a clean, organized, safe and efficient workplace',
    1,
    'active',
    NOW(),
    NOW()
),
(
    326,
    'What does the first S – Seiri – mean?',
    'Sort',
    'Set in Order',
    'Shine',
    'Sustain',
    'Sort',
    2,
    'active',
    NOW(),
    NOW()
),
(
    326,
    'What is the main objective of Seiton (Set in Order)?',
    'Remove unnecessary items',
    'Clean the workplace',
    'Arrange necessary items so they are easy to find and use',
    'Conduct employee training',
    'Arrange necessary items so they are easy to find and use',
    3,
    'active',
    NOW(),
    NOW()
),
(
    326,
    'What does Seiso (Shine) focus on?',
    'Cleaning and inspecting the workplace regularly',
    'Increasing production targets',
    'Removing all workplace documents',
    'Changing employee responsibilities',
    'Cleaning and inspecting the workplace regularly',
    4,
    'active',
    NOW(),
    NOW()
),
(
    326,
    'What is the purpose of Seiketsu (Standardize)?',
    'To introduce new machines',
    'To establish standards to maintain the first three S activities',
    'To reduce employee participation',
    'To eliminate workplace inspections',
    'To establish standards to maintain the first three S activities',
    5,
    'active',
    NOW(),
    NOW()
),
(
    326,
    'What does Shitsuke (Sustain) mean?',
    'Organizing tools',
    'Removing unwanted materials',
    'Developing discipline and maintaining 5S practices continuously',
    'Cleaning machines once a year',
    'Developing discipline and maintaining 5S practices continuously',
    6,
    'active',
    NOW(),
    NOW()
),
(
    326,
    'Which of the following is an example of Sort (Seiri)?',
    'Keeping unnecessary materials at the workstation',
    'Removing unused tools and materials from the workplace',
    'Cleaning the production floor',
    'Labelling storage locations',
    'Removing unused tools and materials from the workplace',
    7,
    'active',
    NOW(),
    NOW()
),
(
    326,
    'What is the purpose of visual management in 5S?',
    'To decorate the workplace',
    'To make workplace conditions, locations and abnormalities easy to identify',
    'To increase the number of reports',
    'To replace employee training',
    'To make workplace conditions, locations and abnormalities easy to identify',
    8,
    'active',
    NOW(),
    NOW()
),
(
    326,
    'Which of the following is a major benefit of implementing 5S?',
    'Increased workplace waste',
    'Reduced workplace efficiency',
    'Improved productivity, safety and quality',
    'Increased searching time',
    'Improved productivity, safety and quality',
    9,
    'active',
    NOW(),
    NOW()
),
(
    326,
    'Who is responsible for maintaining 5S in an organization?',
    'Only the housekeeping department',
    'Only the quality manager',
    'Only top management',
    'All employees, with management support',
    'All employees, with management support',
    10,
    'active',
    NOW(),
    NOW()
);

-- ----------------------------------------------------------------------------
-- Questions for Course 327: 7QC Tools Certification (7QC_Tools_10_MCQs_with_Answers.pdf)
-- ----------------------------------------------------------------------------
INSERT INTO assessment_questions (
    assessment_id,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    sort_order,
    status,
    created_at,
    updated_at
) VALUES
(
    327,
    'What is the primary purpose of the 7 QC Tools?',
    'To increase production costs',
    'To identify, analyze and solve quality problems',
    'To replace quality inspections',
    'To reduce employee training',
    'To identify, analyze and solve quality problems',
    1,
    'active',
    NOW(),
    NOW()
),
(
    327,
    'Which 7 QC Tool is used to identify and prioritize the most significant problems?',
    'Histogram',
    'Scatter Diagram',
    'Pareto Chart',
    'Control Chart',
    'Pareto Chart',
    2,
    'active',
    NOW(),
    NOW()
),
(
    327,
    'Which tool is commonly used to identify possible causes of a problem?',
    'Cause-and-Effect Diagram',
    'Check Sheet',
    'Histogram',
    'Control Chart',
    'Cause-and-Effect Diagram',
    3,
    'active',
    NOW(),
    NOW()
),
(
    327,
    'What is the main purpose of a Check Sheet?',
    'To display process stability',
    'To collect and record data systematically',
    'To show relationships between two variables',
    'To rank suppliers',
    'To collect and record data systematically',
    4,
    'active',
    NOW(),
    NOW()
),
(
    327,
    'Which tool displays the frequency distribution of numerical data?',
    'Histogram',
    'Flowchart',
    'Pareto Chart',
    'Scatter Diagram',
    'Histogram',
    5,
    'active',
    NOW(),
    NOW()
),
(
    327,
    'What does a Scatter Diagram help determine?',
    'The sequence of process steps',
    'The relationship between two variables',
    'The frequency of defects only',
    'The root cause with certainty',
    'The relationship between two variables',
    6,
    'active',
    NOW(),
    NOW()
),
(
    327,
    'Which tool is used to monitor process performance over time and identify variation?',
    'Check Sheet',
    'Histogram',
    'Control Chart',
    'Cause-and-Effect Diagram',
    'Control Chart',
    7,
    'active',
    NOW(),
    NOW()
),
(
    327,
    'What is the main purpose of a Flowchart?',
    'To show the steps and sequence of a process',
    'To calculate process capability',
    'To rank defects by frequency',
    'To measure customer satisfaction',
    'To show the steps and sequence of a process',
    8,
    'active',
    NOW(),
    NOW()
),
(
    327,
    'In a Pareto Chart, what does the 80/20 principle generally suggest?',
    'All causes contribute equally',
    'A small number of causes often account for a large proportion of problems',
    '80% of data must be rejected',
    'Every problem has exactly two causes',
    'A small number of causes often account for a large proportion of problems',
    9,
    'active',
    NOW(),
    NOW()
),
(
    327,
    'Which of the following is the correct set of seven basic QC tools?',
    '5S, Kaizen, FMEA, SPC, TPM, TQM and 8D',
    'Check Sheet, Histogram, Pareto Chart, Cause-and-Effect Diagram, Scatter Diagram, Control Chart and Stratification/Graph',
    'SWOT, PESTLE, SIPOC, DMAIC, 5 Whys, FMEA and Gantt Chart',
    'Audit, Inspection, Calibration, Sampling, Benchmarking, Training and Reporting',
    'Check Sheet, Histogram, Pareto Chart, Cause-and-Effect Diagram, Scatter Diagram, Control Chart and Stratification/Graph',
    10,
    'active',
    NOW(),
    NOW()
);

-- ----------------------------------------------------------------------------
-- Questions for Course 328: Project Management Level-1 (Project Management MCQ Assessment.pdf)
-- ----------------------------------------------------------------------------
INSERT INTO assessment_questions (
    assessment_id,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    sort_order,
    status,
    created_at,
    updated_at
) VALUES
(
    328,
    'What are the three elements of the traditional Triple Constraint in project management?',
    'Scope, Time, Cost',
    'Quality, Risk, People',
    'Planning, Execution, Monitoring',
    'Resources, Tech, Budget',
    'Scope, Time, Cost',
    1,
    'active',
    NOW(),
    NOW()
),
(
    328,
    'Which document formally authorizes the existence of a project and grants the project manager authority?',
    'Project Management Plan',
    'Project Charter',
    'Business Case',
    'Scope Statement',
    'Project Charter',
    2,
    'active',
    NOW(),
    NOW()
),
(
    328,
    'What does WBS stand for in project management?',
    'Work Breakdown Structure',
    'Weekly Business Schedule',
    'Workflow System',
    'Work Budget System',
    'Work Breakdown Structure',
    3,
    'active',
    NOW(),
    NOW()
),
(
    328,
    'In CPM (Critical Path Method), what characterizes the critical path?',
    'Path with the highest risk',
    'Longest path with zero total float',
    'Shortest path to completion',
    'Path with the most activities',
    'Longest path with zero total float',
    4,
    'active',
    NOW(),
    NOW()
),
(
    328,
    'What is uncontrolled expansion to product or project scope without adjustments to time, cost, and resources called?',
    'Scope Creep',
    'Gold Plating',
    'Fast Tracking',
    'Crashing',
    'Scope Creep',
    5,
    'active',
    NOW(),
    NOW()
),
(
    328,
    'Which chart visually represents a project schedule with activities along a timeline?',
    'Pareto Chart',
    'Gantt Chart',
    'Control Chart',
    'Fishbone Chart',
    'Gantt Chart',
    6,
    'active',
    NOW(),
    NOW()
),
(
    328,
    'What technique involves overlapping project phases or tasks that are normally done in sequence to compress schedule?',
    'Crashing',
    'Resource Leveling',
    'Fast Tracking',
    'Scope Reduction',
    'Fast Tracking',
    7,
    'active',
    NOW(),
    NOW()
),
(
    328,
    'In Earned Value Management (EVM), what does a Cost Performance Index (CPI) greater than 1.0 indicate?',
    'Over budget',
    'Under budget',
    'Behind schedule',
    'Ahead of schedule',
    'Under budget',
    8,
    'active',
    NOW(),
    NOW()
),
(
    328,
    'Who is an individual, group, or organization that may affect, be affected by, or perceive itself to be affected by a decision or outcome of a project?',
    'Stakeholder',
    'Sponsor',
    'Project Manager',
    'Client',
    'Stakeholder',
    9,
    'active',
    NOW(),
    NOW()
),
(
    328,
    'What is the primary purpose of the Project Closing Phase?',
    'To define project scope',
    'To execute remaining deliverables',
    'Formally transfer deliverables & document lessons learned',
    'To allocate initial budget',
    'Formally transfer deliverables & document lessons learned',
    10,
    'active',
    NOW(),
    NOW()
);

-- ----------------------------------------------------------------------------
-- Questions for Course 329: Lean Six Sigma White belt (Lean Six Sigma MCQ Assessment.pdf)
-- ----------------------------------------------------------------------------
INSERT INTO assessment_questions (
    assessment_id,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    sort_order,
    status,
    created_at,
    updated_at
) VALUES
(
    329,
    'What is the primary focus of the Lean methodology?',
    'Reducing variation',
    'Eliminating waste and improving flow',
    'Increasing inspection frequency',
    'Implementing software tools',
    'Eliminating waste and improving flow',
    1,
    'active',
    NOW(),
    NOW()
),
(
    329,
    'What does DMAIC stand for in Six Sigma?',
    'Define, Measure, Analyze, Improve, Control',
    'Design, Model, Assess, Implement, Check',
    'Develop, Manage, Analyze, Inspect, Control',
    'Define, Monitor, Adjust, Integrate, Calculate',
    'Define, Measure, Analyze, Improve, Control',
    2,
    'active',
    NOW(),
    NOW()
),
(
    329,
    'How many Defects Per Million Opportunities (DPMO) corresponds to a 6 Sigma performance level?',
    '66,807',
    '6,210',
    '233',
    '3.4',
    '3.4',
    3,
    'active',
    NOW(),
    NOW()
),
(
    329,
    'Which of the following is NOT one of the traditional 8 Wastes (TIMWOODS) in Lean?',
    'Transportation',
    'Overproduction',
    'Profitability',
    'Defects',
    'Profitability',
    4,
    'active',
    NOW(),
    NOW()
),
(
    329,
    'What tool is used to map high-level processes showing Suppliers, Inputs, Process, Outputs, and Customers?',
    'SIPOC Diagram',
    'Pareto Chart',
    'Fishbone Diagram',
    'Control Chart',
    'SIPOC Diagram',
    5,
    'active',
    NOW(),
    NOW()
),
(
    329,
    'What is the main purpose of a Fishbone (Ishikawa) Diagram?',
    'Tracking project schedules',
    'Identifying potential root causes of a problem',
    'Calculating statistical standard deviation',
    'Setting product pricing',
    'Identifying potential root causes of a problem',
    6,
    'active',
    NOW(),
    NOW()
),
(
    329,
    'The 80/20 rule is associated with which Quality tool?',
    'Scatter Plot',
    'Histogram',
    'Pareto Chart',
    'Value Stream Map',
    'Pareto Chart',
    7,
    'active',
    NOW(),
    NOW()
),
(
    329,
    'What does the Japanese term "Poka-Yoke" mean in Lean manufacturing?',
    'Continuous improvement',
    'Mistake-proofing / Error-proofing',
    'Visual workplace',
    'Just-in-Time scheduling',
    'Mistake-proofing / Error-proofing',
    8,
    'active',
    NOW(),
    NOW()
),
(
    329,
    'In 5S methodology, what are the 5 steps in order?',
    'Sort, Set in order, Shine, Standardize, Sustain',
    'Select, Systematize, Sweep, Sanitize, Supervise',
    'Start, Shape, Scrub, Simplify, Support',
    'Sort, Secure, Shine, Solve, Sustain',
    'Sort, Set in order, Shine, Standardize, Sustain',
    9,
    'active',
    NOW(),
    NOW()
),
(
    329,
    'During which phase of DMAIC are solutions implemented to address root causes?',
    'Measure',
    'Analyze',
    'Improve',
    'Control',
    'Improve',
    10,
    'active',
    NOW(),
    NOW()
);

-- ----------------------------------------------------------------------------
-- Questions for Course 330: Root Cause Analysis (Root Cause Analysis MCQ Assessment.pdf)
-- ----------------------------------------------------------------------------
INSERT INTO assessment_questions (
    assessment_id,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    sort_order,
    status,
    created_at,
    updated_at
) VALUES
(
    330,
    'What is the main objective of conducting a Root Cause Analysis (RCA)?',
    'Assigning blame to individuals',
    'Identifying underlying causes to prevent recurrence',
    'Fixing symptoms as quickly as possible',
    'Documenting financial losses',
    'Identifying underlying causes to prevent recurrence',
    1,
    'active',
    NOW(),
    NOW()
),
(
    330,
    'Which problem-solving technique repeatedly asks a core question to drill down to the fundamental cause?',
    '5 Whys',
    '5S Framework',
    'Brainstorming 360',
    'Gantt Analysis',
    '5 Whys',
    2,
    'active',
    NOW(),
    NOW()
),
(
    330,
    'What is another common name for the Fishbone Diagram used in Root Cause Analysis?',
    'Pareto Chart',
    'Ishikawa Diagram',
    'Control Chart',
    'Scatter Diagram',
    'Ishikawa Diagram',
    3,
    'active',
    NOW(),
    NOW()
),
(
    330,
    'In a Fishbone Diagram, what is represented at the "head" of the fish?',
    'Root cause',
    'Proposed solution',
    'Problem statement (effect)',
    'Team leader''s name',
    'Problem statement (effect)',
    4,
    'active',
    NOW(),
    NOW()
),
(
    330,
    'What is a symptom in contrast to a root cause?',
    'The fundamental systemic failure',
    'An observable sign or outcome of a problem',
    'The final corrective action plan',
    'An unintended positive result',
    'An observable sign or outcome of a problem',
    5,
    'active',
    NOW(),
    NOW()
),
(
    330,
    'What does FTA stand for in advanced root cause investigation methodologies?',
    'Fast Task Assignment',
    'Fault Tree Analysis',
    'Final Failure Tracking',
    'First Time Audit',
    'Fault Tree Analysis',
    6,
    'active',
    NOW(),
    NOW()
),
(
    330,
    'Which category is typically included in the 6Ms framework for manufacturing RCA?',
    'Manpower / Mindset',
    'Money',
    'Marketing',
    'Milestones',
    'Manpower / Mindset',
    7,
    'active',
    NOW(),
    NOW()
),
(
    330,
    'What is the difference between a Corrective Action and a Preventive Action?',
    'Corrective eliminates identified causes; Preventive eliminates potential causes',
    'Preventive is done after an incident; Corrective is done before',
    'Corrective applies only to machines; Preventive applies to people',
    'There is no functional difference between them',
    'Corrective eliminates identified causes; Preventive eliminates potential causes',
    8,
    'active',
    NOW(),
    NOW()
),
(
    330,
    'What visual quality tool helps prioritize causes based on the 80/20 rule?',
    'Histogram',
    'Flowchart',
    'Pareto Chart',
    'Check Sheet',
    'Pareto Chart',
    9,
    'active',
    NOW(),
    NOW()
),
(
    330,
    'What step should follow immediately after identifying the root cause of an issue?',
    'Close the project file',
    'Develop and implement corrective action plans',
    'Conduct employee performance reviews',
    'Restart the 5 Whys process',
    'Develop and implement corrective action plans',
    10,
    'active',
    NOW(),
    NOW()
);

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- VERIFICATION QUERY:
-- SELECT ca.id, ca.title, COUNT(aq.id) as question_count 
-- FROM course_assessments ca 
-- LEFT JOIN assessment_questions aq ON ca.id = aq.assessment_id 
-- WHERE ca.id IN (322, 332, 323, 324, 325, 333, 326, 327, 328, 329, 330)
-- GROUP BY ca.id, ca.title;
-- ============================================================================
