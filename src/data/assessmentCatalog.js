/**
 * Broadbeach Academy — Official Authoritative Course Assessment Catalog
 * 
 * Source: Official Google Drive PDF Question Repository
 * Folder: https://drive.google.com/drive/folders/1Y7qARKx-I6mOvOPDIUjT822jHGNVjR-T
 * 
 * Strict Exam Specifications:
 * - Total Questions: Exactly 10 per course
 * - Exam Duration: 30 Minutes (1800 seconds)
 * - Passing Percentage: 70% (7 out of 10 correct)
 * - Question Format: Multiple Choice Questions with 4 Options (A, B, C, D)
 * - Integrity: Correct answers secured on server and omitted from student API payloads
 */

import { getAuthoritativeCourseName } from "./freeCoursesData.js";

export const COURSE_ASSESSMENT_CATALOG = {
  // =========================================================================
  // COURSE 322: ISO 9001:2026 QMS
  // Source PDF: ISO_9001_2026_MCQs_Answers_n_Question.pdf
  // =========================================================================
  322: {
    id: 322,
    certification_id: 322,
    course_slug: "iso-9001-2026-qms-awareness",
    course_title: "ISO 9001:2026 QMS",
    title: "ISO 9001:2026 QMS Final Assessment",
    pdf_source: "ISO_9001_2026_MCQs_Answers_n_Question.pdf",
    duration_minutes: 30,
    passing_percentage: 70,
    total_questions: 10,
    questions: [
      {
        id: 1,
        question: "What is the primary purpose of ISO 9001:2026?",
        options: [
          "To establish environmental management requirements",
          "To establish requirements for a Quality Management System",
          "To establish occupational health and safety requirements",
          "To establish financial management requirements"
        ],
        correct_answer: "To establish requirements for a Quality Management System"
      },
      {
        id: 2,
        question: "Which organization publishes the ISO 9001 standard?",
        options: [
          "International Labour Organization (ILO)",
          "World Trade Organization (WTO)",
          "International Organization for Standardization (ISO)",
          "World Health Organization (WHO)"
        ],
        correct_answer: "International Organization for Standardization (ISO)"
      },
      {
        id: 3,
        question: "Which of the following is emphasized more strongly in ISO 9001:2026?",
        options: [
          "Financial auditing",
          "Quality culture and ethical behaviour",
          "Employee salary management",
          "Marketing strategies"
        ],
        correct_answer: "Quality culture and ethical behaviour"
      },
      {
        id: 4,
        question: "What is the main responsibility of top management in a Quality Management System?",
        options: [
          "Delegate all quality responsibilities to the quality department",
          "Demonstrate leadership and commitment to the QMS",
          "Perform all internal audits personally",
          "Approve every purchase order"
        ],
        correct_answer: "Demonstrate leadership and commitment to the QMS"
      },
      {
        id: 5,
        question: "What is the main objective of customer focus in ISO 9001:2026?",
        options: [
          "Increasing employee working hours",
          "Reducing product variety",
          "Enhancing customer satisfaction and meeting customer requirements",
          "Reducing communication with customers"
        ],
        correct_answer: "Enhancing customer satisfaction and meeting customer requirements"
      },
      {
        id: 6,
        question: "How does ISO 9001:2026 address risks and opportunities?",
        options: [
          "By ignoring potential risks",
          "By addressing only financial risks",
          "By providing a clearer distinction between actions to address risks and opportunities",
          "By eliminating the need for risk assessment"
        ],
        correct_answer: "By providing a clearer distinction between actions to address risks and opportunities"
      },
      {
        id: 7,
        question: "Which of the following is important for employee awareness?",
        options: [
          "Understanding the quality policy and their contribution to QMS effectiveness",
          "Knowing only their salary details",
          "Avoiding participation in quality activities",
          "Performing duties without following procedures"
        ],
        correct_answer: "Understanding the quality policy and their contribution to QMS effectiveness"
      },
      {
        id: 8,
        question: "What is the purpose of an internal audit?",
        options: [
          "To identify employees for termination",
          "To evaluate whether the QMS conforms to requirements and is effectively implemented",
          "To increase production costs",
          "To replace management reviews"
        ],
        correct_answer: "To evaluate whether the QMS conforms to requirements and is effectively implemented"
      },
      {
        id: 9,
        question: "What is the purpose of continual improvement in a QMS?",
        options: [
          "To maintain existing processes without changes",
          "To reduce customer interaction",
          "To improve the suitability, adequacy and effectiveness of the QMS",
          "To eliminate the need for performance evaluation"
        ],
        correct_answer: "To improve the suitability, adequacy and effectiveness of the QMS"
      },
      {
        id: 10,
        question: "What is the purpose of Annex A in ISO 9001:2026?",
        options: [
          "To provide financial reporting formats",
          "To clarify key concepts, terminology and the intent of requirements",
          "To establish employee attendance rules",
          "To provide product pricing guidelines"
        ],
        correct_answer: "To clarify key concepts, terminology and the intent of requirements"
      }
    ]
  },

  // =========================================================================
  // COURSE 332: ISO14001: 2026 EMS
  // Source PDF: ISO 14001_2026 FREE COURCE MCQ QUESTION.pdf
  // =========================================================================
  332: {
    id: 332,
    certification_id: 332,
    course_slug: "iso-14001-2026-ems-awareness",
    course_title: "ISO14001: 2026 EMS",
    title: "ISO14001: 2026 EMS Final Assessment",
    pdf_source: "ISO 14001_2026 FREE COURCE MCQ QUESTION.pdf",
    duration_minutes: 30,
    passing_percentage: 70,
    total_questions: 10,
    questions: [
      {
        id: 1,
        question: "What is the main objective of ISO 14001?",
        options: [
          "Improve financial performance",
          "Environmental management system implementation",
          "Employee satisfaction",
          "Product design"
        ],
        correct_answer: "Environmental management system implementation"
      },
      {
        id: 2,
        question: "ISO 14001 is based on which cycle?",
        options: [
          "SWOT",
          "PDCA (Plan-Do-Check-Act)",
          "Six Sigma",
          "Kaizen"
        ],
        correct_answer: "PDCA (Plan-Do-Check-Act)"
      },
      {
        id: 3,
        question: "What does EMS stand for?",
        options: [
          "Environmental Monitoring System",
          "Environmental Management System",
          "Energy Management System",
          "Engineering Management System"
        ],
        correct_answer: "Environmental Management System"
      },
      {
        id: 4,
        question: "Which clause deals with Leadership?",
        options: [
          "Clause 4",
          "Clause 5",
          "Clause 6",
          "Clause 7"
        ],
        correct_answer: "Clause 5"
      },
      {
        id: 5,
        question: "What is an environmental aspect?",
        options: [
          "Legal requirement",
          "Element of activities that interacts with environment",
          "Audit finding",
          "Policy statement"
        ],
        correct_answer: "Element of activities that interacts with environment"
      },
      {
        id: 6,
        question: "What is an environmental impact?",
        options: [
          "Change to the environment",
          "Company profit",
          "Employee training",
          "Internal audit"
        ],
        correct_answer: "Change to the environment"
      },
      {
        id: 7,
        question: "Which clause covers planning?",
        options: [
          "Clause 6",
          "Clause 7",
          "Clause 8",
          "Clause 9"
        ],
        correct_answer: "Clause 6"
      },
      {
        id: 8,
        question: "Compliance obligations refer to:",
        options: [
          "Internal rules only",
          "Legal and other requirements",
          "Financial obligations",
          "Customer complaints"
        ],
        correct_answer: "Legal and other requirements"
      },
      {
        id: 9,
        question: "What is the purpose of Environmental Policy?",
        options: [
          "Marketing tool",
          "Commitment to environmental protection",
          "Financial planning",
          "HR guideline"
        ],
        correct_answer: "Commitment to environmental protection"
      },
      {
        id: 10,
        question: "Which clause relates to Support?",
        options: [
          "Clause 6",
          "Clause 7",
          "Clause 8",
          "Clause 10"
        ],
        correct_answer: "Clause 7"
      }
    ]
  },

  // =========================================================================
  // COURSE 323: ISO 45001:2018 OHSMS
  // Source PDF: ISO 45001 MCQ Assessment.pdf
  // =========================================================================
  323: {
    id: 323,
    certification_id: 323,
    course_slug: "iso-45001-2018-ohsms-awareness",
    course_title: "ISO 45001:2018 OHSMS",
    title: "ISO 45001:2018 OHSMS Final Assessment",
    pdf_source: "ISO 45001 MCQ Assessment.pdf",
    duration_minutes: 30,
    passing_percentage: 70,
    total_questions: 10,
    questions: [
      {
        id: 1,
        question: "What is the primary focus of the ISO 45001:2018 standard?",
        options: [
          "Quality management systems",
          "Occupational health and safety (OH&S)",
          "Environmental management systems",
          "Energy management systems"
        ],
        correct_answer: "Occupational health and safety (OH&S)"
      },
      {
        id: 2,
        question: "Which standard did ISO 45001:2018 replace?",
        options: [
          "OHSAS 18001",
          "ISO 9001",
          "ISO 14001",
          "ISO 31000"
        ],
        correct_answer: "OHSAS 18001"
      },
      {
        id: 3,
        question: "Which clause of ISO 45001:2018 specifically addresses consultation and participation of workers?",
        options: [
          "Clause 4.1",
          "Clause 5.4",
          "Clause 7.2",
          "Clause 9.1"
        ],
        correct_answer: "Clause 5.4"
      },
      {
        id: 4,
        question: "What is the top level in the Hierarchy of Controls according to ISO 45001?",
        options: [
          "Substitution",
          "Personal Protective Equipment (PPE)",
          "Elimination",
          "Engineering controls"
        ],
        correct_answer: "Elimination"
      },
      {
        id: 5,
        question: "In ISO 45001 terminology, what is defined as a source with a potential to cause injury and ill health?",
        options: [
          "Risk",
          "Incident",
          "Hazard",
          "Nonconformity"
        ],
        correct_answer: "Hazard"
      },
      {
        id: 6,
        question: "Which high-level structure (HLS) structure is ISO 45001:2018 based on?",
        options: [
          "Annex SL",
          "Annex A",
          "ISO Guide 73",
          "PAS 99"
        ],
        correct_answer: "Annex SL"
      },
      {
        id: 7,
        question: "What is an occurrence arising out of, or in the course of, work that could or does result in injury and ill health called?",
        options: [
          "Audit finding",
          "Incident",
          "Correction",
          "Emergency situation"
        ],
        correct_answer: "Incident"
      },
      {
        id: 8,
        question: "Which clause requires the organization to plan, establish, implement, and maintain an internal audit program?",
        options: [
          "Clause 6.1",
          "Clause 8.2",
          "Clause 9.2",
          "Clause 10.1"
        ],
        correct_answer: "Clause 9.2"
      },
      {
        id: 9,
        question: "According to ISO 45001, who holds the ultimate responsibility for the OH&S management system?",
        options: [
          "External Auditors",
          "Top Management",
          "Safety Officers",
          "Frontline Workers"
        ],
        correct_answer: "Top Management"
      },
      {
        id: 10,
        question: "What action must be taken first when a nonconformity or incident occurs under Clause 10.2?",
        options: [
          "React to the incident and take action to control/correct it",
          "Change the OH&S policy",
          "Conduct a management review",
          "Terminate involved personnel"
        ],
        correct_answer: "React to the incident and take action to control/correct it"
      }
    ]
  },

  // =========================================================================
  // COURSE 324: ISO 22000:2018 FSMS
  // Source PDF: ISO_22000_2018_10_MCQs_with_Answers.pdf
  // =========================================================================
  324: {
    id: 324,
    certification_id: 324,
    course_slug: "iso-22000-2018-fsms-awareness",
    course_title: "ISO 22000:2018 FSMS",
    title: "ISO 22000:2018 FSMS Final Assessment",
    pdf_source: "ISO_22000_2018_10_MCQs_with_Answers.pdf",
    duration_minutes: 30,
    passing_percentage: 70,
    total_questions: 10,
    questions: [
      {
        id: 1,
        question: "What is the main purpose of ISO 22000:2018?",
        options: [
          "To establish requirements for an environmental management system",
          "To provide requirements for a Food Safety Management System (FSMS)",
          "To establish requirements for occupational health and safety",
          "To define financial management procedures"
        ],
        correct_answer: "To provide requirements for a Food Safety Management System (FSMS)"
      },
      {
        id: 2,
        question: "Which organizations can use ISO 22000:2018?",
        options: [
          "Only food manufacturing companies",
          "Only restaurants and hotels",
          "Any organization directly or indirectly involved in the food chain",
          "Only government food inspection agencies"
        ],
        correct_answer: "Any organization directly or indirectly involved in the food chain"
      },
      {
        id: 3,
        question: "What does HACCP stand for?",
        options: [
          "Hazard Analysis and Critical Control Points",
          "Health Assessment and Control Compliance Programme",
          "Hazard Audit and Certification Control Process",
          "Hygiene Analysis and Critical Cleaning Procedures"
        ],
        correct_answer: "Hazard Analysis and Critical Control Points"
      },
      {
        id: 4,
        question: "What is the purpose of prerequisite programmes (PRPs)?",
        options: [
          "To establish basic conditions and activities needed to maintain a hygienic environment",
          "To replace the HACCP plan",
          "To determine product selling prices",
          "To conduct employee performance reviews"
        ],
        correct_answer: "To establish basic conditions and activities needed to maintain a hygienic environment"
      },
      {
        id: 5,
        question: "Which of the following is an example of a biological food safety hazard?",
        options: [
          "Glass fragments",
          "Cleaning chemical residue",
          "Salmonella bacteria",
          "Metal particles"
        ],
        correct_answer: "Salmonella bacteria"
      },
      {
        id: 6,
        question: "What is a Critical Control Point (CCP)?",
        options: [
          "A step where control can be applied and is essential to prevent, eliminate or reduce a significant food safety hazard to an acceptable level",
          "Any routine office activity",
          "A point used only for product packaging design",
          "A stage where food safety monitoring is unnecessary"
        ],
        correct_answer: "A step where control can be applied and is essential to prevent, eliminate or reduce a significant food safety hazard to an acceptable level"
      },
      {
        id: 7,
        question: "What is the purpose of establishing critical limits at a CCP?",
        options: [
          "To define measurable or observable criteria that separate acceptable from unacceptable control",
          "To set employee working hours",
          "To determine the product's market price",
          "To eliminate the need for monitoring"
        ],
        correct_answer: "To define measurable or observable criteria that separate acceptable from unacceptable control"
      },
      {
        id: 8,
        question: "What should an organization do when monitoring shows that a CCP is not under control?",
        options: [
          "Ignore the result if the product looks acceptable",
          "Take appropriate corrections and corrective actions according to the established procedures",
          "Continue production without recording the issue",
          "Delete the monitoring records"
        ],
        correct_answer: "Take appropriate corrections and corrective actions according to the established procedures"
      },
      {
        id: 9,
        question: "Why is traceability important in a Food Safety Management System?",
        options: [
          "It helps identify and trace food, ingredients and relevant information through the food chain",
          "It replaces supplier evaluation",
          "It removes the need for product identification",
          "It is used only for financial reporting"
        ],
        correct_answer: "It helps identify and trace food, ingredients and relevant information through the food chain"
      },
      {
        id: 10,
        question: "What is the purpose of verification in ISO 22000:2018?",
        options: [
          "To confirm that planned arrangements are implemented and effective",
          "To advertise food products",
          "To replace validation of control measures",
          "To avoid reviewing FSMS performance"
        ],
        correct_answer: "To confirm that planned arrangements are implemented and effective"
      }
    ]
  },

  // =========================================================================
  // COURSE 325: ISO 19011:2026
  // Source PDF: ISO_19011_2026_10_MCQs_with_Answers.pdf
  // =========================================================================
  325: {
    id: 325,
    certification_id: 325,
    course_slug: "iso-19011-2026-awareness",
    course_title: "ISO 19011:2026",
    title: "ISO 19011:2026 Final Assessment",
    pdf_source: "ISO_19011_2026_10_MCQs_with_Answers.pdf",
    duration_minutes: 30,
    passing_percentage: 70,
    total_questions: 10,
    questions: [
      {
        id: 1,
        question: "What is the main purpose of ISO 19011:2026?",
        options: [
          "To specify product quality requirements",
          "To provide guidelines for auditing management systems",
          "To establish environmental performance limits",
          "To certify individual auditors"
        ],
        correct_answer: "To provide guidelines for auditing management systems"
      },
      {
        id: 2,
        question: "Which of the following is an auditing principle in ISO 19011:2026?",
        options: [
          "Profitability",
          "Confidentiality",
          "Production efficiency",
          "Product design"
        ],
        correct_answer: "Confidentiality"
      },
      {
        id: 3,
        question: "What does the principle of integrity require from an auditor?",
        options: [
          "To report findings honestly and ethically",
          "To change evidence to support the audit conclusion",
          "To avoid documenting nonconformities",
          "To guarantee that no problems will be found"
        ],
        correct_answer: "To report findings honestly and ethically"
      },
      {
        id: 4,
        question: "What is the purpose of an audit programme?",
        options: [
          "To manage one employee's daily tasks",
          "To organize one or more audits over a defined period and toward specific objectives",
          "To replace management review",
          "To approve all operational purchases"
        ],
        correct_answer: "To organize one or more audits over a defined period and toward specific objectives"
      },
      {
        id: 5,
        question: "Which factor should be considered when determining audit programme risks and opportunities?",
        options: [
          "The auditor's personal preferences",
          "The context of the organization and factors that may affect the audit programme",
          "The colour of audit documents",
          "The number of office visitors"
        ],
        correct_answer: "The context of the organization and factors that may affect the audit programme"
      },
      {
        id: 6,
        question: "What should be defined before conducting an individual audit?",
        options: [
          "Audit objectives, scope and criteria",
          "Employee salary levels",
          "Product selling prices",
          "The organization's advertising plan"
        ],
        correct_answer: "Audit objectives, scope and criteria"
      },
      {
        id: 7,
        question: "What is the purpose of evaluating auditor competence?",
        options: [
          "To ensure auditors have the necessary knowledge and skills for their assigned audit activities",
          "To determine an auditor's sales target",
          "To eliminate the need for audit evidence",
          "To guarantee identical audit findings"
        ],
        correct_answer: "To ensure auditors have the necessary knowledge and skills for their assigned audit activities"
      },
      {
        id: 8,
        question: "Which approach requires audit conclusions to be based on verifiable information?",
        options: [
          "Personal-opinion approach",
          "Evidence-based approach",
          "Informal approach",
          "Promotional approach"
        ],
        correct_answer: "Evidence-based approach"
      },
      {
        id: 9,
        question: "What is an important consideration when conducting a remote audit?",
        options: [
          "Ignore information security",
          "Confirm that technology, access, communication and evidence arrangements are suitable",
          "Avoid planning the audit",
          "Accept all information without verification"
        ],
        correct_answer: "Confirm that technology, access, communication and evidence arrangements are suitable"
      },
      {
        id: 10,
        question: "What is a notable focus expanded in ISO 19011:2026 compared with the 2018 edition?",
        options: [
          "Guidance on remote auditing methods and virtual locations",
          "Requirements for product certification",
          "Financial accounting procedures",
          "Mandatory certification of auditors"
        ],
        correct_answer: "Guidance on remote auditing methods and virtual locations"
      }
    ]
  },

  // =========================================================================
  // COURSE 333: ISO 27001:2022 ISMS
  // Source PDF: ISO 27001 MCQ Assessment.pdf
  // =========================================================================
  333: {
    id: 333,
    certification_id: 333,
    course_slug: "iso-27001-2022-isms-awareness",
    course_title: "ISO 27001:2022 ISMS",
    title: "ISO 27001:2022 ISMS Final Assessment",
    pdf_source: "ISO 27001 MCQ Assessment.pdf",
    duration_minutes: 30,
    passing_percentage: 70,
    total_questions: 10,
    questions: [
      {
        id: 1,
        question: "What does ISO/IEC 27001:2022 primarily specify?",
        options: [
          "Software development guidelines",
          "Requirements for an ISMS",
          "Personal data protection rights",
          "Network cable standards"
        ],
        correct_answer: "Requirements for an ISMS"
      },
      {
        id: 2,
        question: "How many controls are listed in Annex A of ISO/IEC 27001:2022?",
        options: [
          "114 controls",
          "93 controls",
          "150 controls",
          "82 controls"
        ],
        correct_answer: "93 controls"
      },
      {
        id: 3,
        question: "Annex A controls in ISO/IEC 27001:2022 are categorized into how many themes?",
        options: [
          "4 themes",
          "14 themes",
          "10 themes",
          "6 themes"
        ],
        correct_answer: "4 themes"
      },
      {
        id: 4,
        question: "Which of the following is NOT one of the four main themes in Annex A (2022 edition)?",
        options: [
          "Organizational controls",
          "Financial controls",
          "Physical controls",
          "Technological controls"
        ],
        correct_answer: "Financial controls"
      },
      {
        id: 5,
        question: "What does \"ISMS\" stand for in the context of ISO 27001?",
        options: [
          "Information Security Management System",
          "Integrated System Management System",
          "Internet Security and Monitoring System",
          "Information Storage Model standard"
        ],
        correct_answer: "Information Security Management System"
      },
      {
        id: 6,
        question: "Which clause of ISO/IEC 27001 focuses on \"Operation\" and risk treatment execution?",
        options: [
          "Clause 4",
          "Clause 6",
          "Clause 8",
          "Clause 10"
        ],
        correct_answer: "Clause 8"
      },
      {
        id: 7,
        question: "What document must an organization produce to declare which Annex A controls apply to their ISMS?",
        options: [
          "Statement of Applicability (SoA)",
          "Service Level Agreement (SLA)",
          "Non-Disclosure Agreement (NDA)",
          "Business Impact Analysis (BIA)"
        ],
        correct_answer: "Statement of Applicability (SoA)"
      },
      {
        id: 8,
        question: "Which methodology is typically referenced for continuous improvement in ISO standards?",
        options: [
          "Agile / Scrum",
          "Plan-Do-Check-Act (PDCA)",
          "Waterfall",
          "Six Sigma DMAIC"
        ],
        correct_answer: "Plan-Do-Check-Act (PDCA)"
      },
      {
        id: 9,
        question: "Under ISO/IEC 27001:2022, which title refers to the theme containing human resources security controls?",
        options: [
          "Organizational controls",
          "People controls",
          "Physical controls",
          "Technological controls"
        ],
        correct_answer: "People controls"
      },
      {
        id: 10,
        question: "What is the primary purpose of an internal ISMS audit (Clause 9.2)?",
        options: [
          "To penalize non-compliant employees",
          "To verify conformance with standard requirements",
          "To replace external certification audits",
          "To design network architecture"
        ],
        correct_answer: "To verify conformance with standard requirements"
      }
    ]
  },

  // =========================================================================
  // COURSE 326: 5S Workplace Management
  // Source PDF: 5S_Workplace_Management_LMS_Assessment_MCQs_Answers.pdf
  // =========================================================================
  326: {
    id: 326,
    certification_id: 326,
    course_slug: "5s-workplace-management",
    course_title: "5S Workplace Management",
    title: "5S Workplace Management Final Assessment",
    pdf_source: "5S_Workplace_Management_LMS_Assessment_MCQs_Answers.pdf",
    duration_minutes: 30,
    passing_percentage: 70,
    total_questions: 10,
    questions: [
      {
        id: 1,
        question: "What is the primary purpose of the 5S methodology?",
        options: [
          "To increase employee working hours",
          "To create a clean, organized, safe and efficient workplace",
          "To reduce employee responsibilities",
          "To increase paperwork"
        ],
        correct_answer: "To create a clean, organized, safe and efficient workplace"
      },
      {
        id: 2,
        question: "What does the first S – Seiri – mean?",
        options: [
          "Sort",
          "Set in Order",
          "Shine",
          "Sustain"
        ],
        correct_answer: "Sort"
      },
      {
        id: 3,
        question: "What is the main objective of Seiton (Set in Order)?",
        options: [
          "Remove unnecessary items",
          "Clean the workplace",
          "Arrange necessary items so they are easy to find and use",
          "Conduct employee training"
        ],
        correct_answer: "Arrange necessary items so they are easy to find and use"
      },
      {
        id: 4,
        question: "What does Seiso (Shine) focus on?",
        options: [
          "Cleaning and inspecting the workplace regularly",
          "Increasing production targets",
          "Removing all workplace documents",
          "Changing employee responsibilities"
        ],
        correct_answer: "Cleaning and inspecting the workplace regularly"
      },
      {
        id: 5,
        question: "What is the purpose of Seiketsu (Standardize)?",
        options: [
          "To introduce new machines",
          "To establish standards to maintain the first three S activities",
          "To reduce employee participation",
          "To eliminate workplace inspections"
        ],
        correct_answer: "To establish standards to maintain the first three S activities"
      },
      {
        id: 6,
        question: "What does Shitsuke (Sustain) mean?",
        options: [
          "Organizing tools",
          "Removing unwanted materials",
          "Developing discipline and maintaining 5S practices continuously",
          "Cleaning machines once a year"
        ],
        correct_answer: "Developing discipline and maintaining 5S practices continuously"
      },
      {
        id: 7,
        question: "Which of the following is an example of Sort (Seiri)?",
        options: [
          "Keeping unnecessary materials at the workstation",
          "Removing unused tools and materials from the workplace",
          "Cleaning the production floor",
          "Labelling storage locations"
        ],
        correct_answer: "Removing unused tools and materials from the workplace"
      },
      {
        id: 8,
        question: "What is the purpose of visual management in 5S?",
        options: [
          "To decorate the workplace",
          "To make workplace conditions, locations and abnormalities easy to identify",
          "To increase the number of reports",
          "To replace employee training"
        ],
        correct_answer: "To make workplace conditions, locations and abnormalities easy to identify"
      },
      {
        id: 9,
        question: "Which of the following is a major benefit of implementing 5S?",
        options: [
          "Increased workplace waste",
          "Reduced workplace efficiency",
          "Improved productivity, safety and quality",
          "Increased searching time"
        ],
        correct_answer: "Improved productivity, safety and quality"
      },
      {
        id: 10,
        question: "Who is responsible for maintaining 5S in an organization?",
        options: [
          "Only the housekeeping department",
          "Only the quality manager",
          "Only top management",
          "All employees, with management support"
        ],
        correct_answer: "All employees, with management support"
      }
    ]
  },

  // =========================================================================
  // COURSE 327: 7QC Tools Certification
  // Source PDF: 7QC_Tools_10_MCQs_with_Answers.pdf
  // =========================================================================
  327: {
    id: 327,
    certification_id: 327,
    course_slug: "7qc-tools-certification",
    course_title: "7QC Tools Certification",
    title: "7QC Tools Certification Final Assessment",
    pdf_source: "7QC_Tools_10_MCQs_with_Answers.pdf",
    duration_minutes: 30,
    passing_percentage: 70,
    total_questions: 10,
    questions: [
      {
        id: 1,
        question: "What is the primary purpose of the 7 QC Tools?",
        options: [
          "To increase production costs",
          "To identify, analyze and solve quality problems",
          "To replace quality inspections",
          "To reduce employee training"
        ],
        correct_answer: "To identify, analyze and solve quality problems"
      },
      {
        id: 2,
        question: "Which 7 QC Tool is used to identify and prioritize the most significant problems?",
        options: [
          "Histogram",
          "Scatter Diagram",
          "Pareto Chart",
          "Control Chart"
        ],
        correct_answer: "Pareto Chart"
      },
      {
        id: 3,
        question: "Which tool is commonly used to identify possible causes of a problem?",
        options: [
          "Cause-and-Effect Diagram",
          "Check Sheet",
          "Histogram",
          "Control Chart"
        ],
        correct_answer: "Cause-and-Effect Diagram"
      },
      {
        id: 4,
        question: "What is the main purpose of a Check Sheet?",
        options: [
          "To display process stability",
          "To collect and record data systematically",
          "To show relationships between two variables",
          "To rank suppliers"
        ],
        correct_answer: "To collect and record data systematically"
      },
      {
        id: 5,
        question: "Which tool displays the frequency distribution of numerical data?",
        options: [
          "Histogram",
          "Flowchart",
          "Pareto Chart",
          "Scatter Diagram"
        ],
        correct_answer: "Histogram"
      },
      {
        id: 6,
        question: "What does a Scatter Diagram help determine?",
        options: [
          "The sequence of process steps",
          "The relationship between two variables",
          "The frequency of defects only",
          "The root cause with certainty"
        ],
        correct_answer: "The relationship between two variables"
      },
      {
        id: 7,
        question: "Which tool is used to monitor process performance over time and identify variation?",
        options: [
          "Check Sheet",
          "Histogram",
          "Control Chart",
          "Cause-and-Effect Diagram"
        ],
        correct_answer: "Control Chart"
      },
      {
        id: 8,
        question: "What is the main purpose of a Flowchart?",
        options: [
          "To show the steps and sequence of a process",
          "To calculate process capability",
          "To rank defects by frequency",
          "To measure customer satisfaction"
        ],
        correct_answer: "To show the steps and sequence of a process"
      },
      {
        id: 9,
        question: "In a Pareto Chart, what does the 80/20 principle generally suggest?",
        options: [
          "All causes contribute equally",
          "A small number of causes often account for a large proportion of problems",
          "80% of data must be rejected",
          "Every problem has exactly two causes"
        ],
        correct_answer: "A small number of causes often account for a large proportion of problems"
      },
      {
        id: 10,
        question: "Which of the following is the correct set of seven basic QC tools?",
        options: [
          "5S, Kaizen, FMEA, SPC, TPM, TQM and 8D",
          "Check Sheet, Histogram, Pareto Chart, Cause-and-Effect Diagram, Scatter Diagram, Control Chart and Stratification/Graph",
          "SWOT, PESTLE, SIPOC, DMAIC, 5 Whys, FMEA and Gantt Chart",
          "Audit, Inspection, Calibration, Sampling, Benchmarking, Training and Reporting"
        ],
        correct_answer: "Check Sheet, Histogram, Pareto Chart, Cause-and-Effect Diagram, Scatter Diagram, Control Chart and Stratification/Graph"
      }
    ]
  },

  // =========================================================================
  // COURSE 328: Project Management Level-1
  // Source PDF: Project Management MCQ Assessment.pdf
  // =========================================================================
  328: {
    id: 328,
    certification_id: 328,
    course_slug: "project-management-level-1",
    course_title: "Project Management Level-1",
    title: "Project Management Level-1 Final Assessment",
    pdf_source: "Project Management MCQ Assessment.pdf",
    duration_minutes: 30,
    passing_percentage: 70,
    total_questions: 10,
    questions: [
      {
        id: 1,
        question: "What are the three elements of the traditional Triple Constraint in project management?",
        options: [
          "Scope, Time, Cost",
          "Quality, Risk, People",
          "Planning, Execution, Monitoring",
          "Resources, Tech, Budget"
        ],
        correct_answer: "Scope, Time, Cost"
      },
      {
        id: 2,
        question: "Which document formally authorizes the existence of a project and grants the project manager authority?",
        options: [
          "Project Management Plan",
          "Project Charter",
          "Business Case",
          "Scope Statement"
        ],
        correct_answer: "Project Charter"
      },
      {
        id: 3,
        question: "What does WBS stand for in project management?",
        options: [
          "Work Breakdown Structure",
          "Weekly Business Schedule",
          "Workflow System",
          "Work Budget System"
        ],
        correct_answer: "Work Breakdown Structure"
      },
      {
        id: 4,
        question: "In CPM (Critical Path Method), what characterizes the critical path?",
        options: [
          "Path with the highest risk",
          "Longest path with zero total float",
          "Shortest path to completion",
          "Path with the most activities"
        ],
        correct_answer: "Longest path with zero total float"
      },
      {
        id: 5,
        question: "What is uncontrolled expansion to product or project scope without adjustments to time, cost, and resources called?",
        options: [
          "Scope Creep",
          "Gold Plating",
          "Fast Tracking",
          "Crashing"
        ],
        correct_answer: "Scope Creep"
      },
      {
        id: 6,
        question: "Which chart visually represents a project schedule with activities along a timeline?",
        options: [
          "Pareto Chart",
          "Gantt Chart",
          "Control Chart",
          "Fishbone Chart"
        ],
        correct_answer: "Gantt Chart"
      },
      {
        id: 7,
        question: "What technique involves overlapping project phases or tasks that are normally done in sequence to compress schedule?",
        options: [
          "Crashing",
          "Resource Leveling",
          "Fast Tracking",
          "Scope Reduction"
        ],
        correct_answer: "Fast Tracking"
      },
      {
        id: 8,
        question: "In Earned Value Management (EVM), what does a Cost Performance Index (CPI) greater than 1.0 indicate?",
        options: [
          "Over budget",
          "Under budget",
          "Behind schedule",
          "Ahead of schedule"
        ],
        correct_answer: "Under budget"
      },
      {
        id: 9,
        question: "Who is an individual, group, or organization that may affect, be affected by, or perceive itself to be affected by a decision or outcome of a project?",
        options: [
          "Stakeholder",
          "Sponsor",
          "Project Manager",
          "Client"
        ],
        correct_answer: "Stakeholder"
      },
      {
        id: 10,
        question: "What is the primary purpose of the Project Closing Phase?",
        options: [
          "To define project scope",
          "To execute remaining deliverables",
          "Formally transfer deliverables & document lessons learned",
          "To allocate initial budget"
        ],
        correct_answer: "Formally transfer deliverables & document lessons learned"
      }
    ]
  },

  // =========================================================================
  // COURSE 329: Lean Six Sigma White belt
  // Source PDF: Lean Six Sigma MCQ Assessment.pdf
  // =========================================================================
  329: {
    id: 329,
    certification_id: 329,
    course_slug: "lean-six-sigma-white-belt",
    course_title: "Lean Six Sigma White belt",
    title: "Lean Six Sigma White belt Final Assessment",
    pdf_source: "Lean Six Sigma MCQ Assessment.pdf",
    duration_minutes: 30,
    passing_percentage: 70,
    total_questions: 10,
    questions: [
      {
        id: 1,
        question: "What is the primary focus of the Lean methodology?",
        options: [
          "Reducing variation",
          "Eliminating waste and improving flow",
          "Increasing inspection frequency",
          "Implementing software tools"
        ],
        correct_answer: "Eliminating waste and improving flow"
      },
      {
        id: 2,
        question: "What does DMAIC stand for in Six Sigma?",
        options: [
          "Define, Measure, Analyze, Improve, Control",
          "Design, Model, Assess, Implement, Check",
          "Develop, Manage, Analyze, Inspect, Control",
          "Define, Monitor, Adjust, Integrate, Calculate"
        ],
        correct_answer: "Define, Measure, Analyze, Improve, Control"
      },
      {
        id: 3,
        question: "How many Defects Per Million Opportunities (DPMO) corresponds to a 6 Sigma performance level?",
        options: [
          "66,807",
          "6,210",
          "233",
          "3.4"
        ],
        correct_answer: "3.4"
      },
      {
        id: 4,
        question: "Which of the following is NOT one of the traditional 8 Wastes (TIMWOODS) in Lean?",
        options: [
          "Transportation",
          "Overproduction",
          "Profitability",
          "Defects"
        ],
        correct_answer: "Profitability"
      },
      {
        id: 5,
        question: "What tool is used to map high-level processes showing Suppliers, Inputs, Process, Outputs, and Customers?",
        options: [
          "SIPOC Diagram",
          "Pareto Chart",
          "Fishbone Diagram",
          "Control Chart"
        ],
        correct_answer: "SIPOC Diagram"
      },
      {
        id: 6,
        question: "What is the main purpose of a Fishbone (Ishikawa) Diagram?",
        options: [
          "Tracking project schedules",
          "Identifying potential root causes of a problem",
          "Calculating statistical standard deviation",
          "Setting product pricing"
        ],
        correct_answer: "Identifying potential root causes of a problem"
      },
      {
        id: 7,
        question: "The 80/20 rule is associated with which Quality tool?",
        options: [
          "Scatter Plot",
          "Histogram",
          "Pareto Chart",
          "Value Stream Map"
        ],
        correct_answer: "Pareto Chart"
      },
      {
        id: 8,
        question: "What does the Japanese term \"Poka-Yoke\" mean in Lean manufacturing?",
        options: [
          "Continuous improvement",
          "Mistake-proofing / Error-proofing",
          "Visual workplace",
          "Just-in-Time scheduling"
        ],
        correct_answer: "Mistake-proofing / Error-proofing"
      },
      {
        id: 9,
        question: "In 5S methodology, what are the 5 steps in order?",
        options: [
          "Sort, Set in order, Shine, Standardize, Sustain",
          "Select, Systematize, Sweep, Sanitize, Supervise",
          "Start, Shape, Scrub, Simplify, Support",
          "Sort, Secure, Shine, Solve, Sustain"
        ],
        correct_answer: "Sort, Set in order, Shine, Standardize, Sustain"
      },
      {
        id: 10,
        question: "During which phase of DMAIC are solutions implemented to address root causes?",
        options: [
          "Measure",
          "Analyze",
          "Improve",
          "Control"
        ],
        correct_answer: "Improve"
      }
    ]
  },

  // =========================================================================
  // COURSE 330: Root Cause Analysis
  // Source PDF: Root Cause Analysis MCQ Assessment.pdf
  // =========================================================================
  330: {
    id: 330,
    certification_id: 330,
    course_slug: "root-cause-analysis",
    course_title: "Root Cause Analysis",
    title: "Root Cause Analysis Final Assessment",
    pdf_source: "Root Cause Analysis MCQ Assessment.pdf",
    duration_minutes: 30,
    passing_percentage: 70,
    total_questions: 10,
    questions: [
      {
        id: 1,
        question: "What is the main objective of conducting a Root Cause Analysis (RCA)?",
        options: [
          "Assigning blame to individuals",
          "Identifying underlying causes to prevent recurrence",
          "Fixing symptoms as quickly as possible",
          "Documenting financial losses"
        ],
        correct_answer: "Identifying underlying causes to prevent recurrence"
      },
      {
        id: 2,
        question: "Which problem-solving technique repeatedly asks a core question to drill down to the fundamental cause?",
        options: [
          "5 Whys",
          "5S Framework",
          "Brainstorming 360",
          "Gantt Analysis"
        ],
        correct_answer: "5 Whys"
      },
      {
        id: 3,
        question: "What is another common name for the Fishbone Diagram used in Root Cause Analysis?",
        options: [
          "Pareto Chart",
          "Ishikawa Diagram",
          "Control Chart",
          "Scatter Diagram"
        ],
        correct_answer: "Ishikawa Diagram"
      },
      {
        id: 4,
        question: "In a Fishbone Diagram, what is represented at the \"head\" of the fish?",
        options: [
          "Root cause",
          "Proposed solution",
          "Problem statement (effect)",
          "Team leader's name"
        ],
        correct_answer: "Problem statement (effect)"
      },
      {
        id: 5,
        question: "What is a symptom in contrast to a root cause?",
        options: [
          "The fundamental systemic failure",
          "An observable sign or outcome of a problem",
          "The final corrective action plan",
          "An unintended positive result"
        ],
        correct_answer: "An observable sign or outcome of a problem"
      },
      {
        id: 6,
        question: "What does FTA stand for in advanced root cause investigation methodologies?",
        options: [
          "Fast Task Assignment",
          "Fault Tree Analysis",
          "Final Failure Tracking",
          "First Time Audit"
        ],
        correct_answer: "Fault Tree Analysis"
      },
      {
        id: 7,
        question: "Which category is typically included in the 6Ms framework for manufacturing RCA?",
        options: [
          "Manpower / Mindset",
          "Money",
          "Marketing",
          "Milestones"
        ],
        correct_answer: "Manpower / Mindset"
      },
      {
        id: 8,
        question: "What is the difference between a Corrective Action and a Preventive Action?",
        options: [
          "Corrective eliminates identified causes; Preventive eliminates potential causes",
          "Preventive is done after an incident; Corrective is done before",
          "Corrective applies only to machines; Preventive applies to people",
          "There is no functional difference between them"
        ],
        correct_answer: "Corrective eliminates identified causes; Preventive eliminates potential causes"
      },
      {
        id: 9,
        question: "What visual quality tool helps prioritize causes based on the 80/20 rule?",
        options: [
          "Histogram",
          "Flowchart",
          "Pareto Chart",
          "Check Sheet"
        ],
        correct_answer: "Pareto Chart"
      },
      {
        id: 10,
        question: "What step should follow immediately after identifying the root cause of an issue?",
        options: [
          "Close the project file",
          "Develop and implement corrective action plans",
          "Conduct employee performance reviews",
          "Restart the 5 Whys process"
        ],
        correct_answer: "Develop and implement corrective action plans"
      }
    ]
  }
};

/**
 * Resolves assessment metadata by course ID or slug
 */
export const getAssessmentForCourse = (courseIdOrSlug) => {
  const str = String(courseIdOrSlug || "").trim().toLowerCase();
  const num = Number(courseIdOrSlug);
  
  let result = null;
  if (!isNaN(num) && COURSE_ASSESSMENT_CATALOG[num]) {
    result = COURSE_ASSESSMENT_CATALOG[num];
  } else {
    // Slug search
    result = Object.values(COURSE_ASSESSMENT_CATALOG).find(
      item => item.course_slug === str || item.course_title.toLowerCase().includes(str)
    ) || null;
  }

  if (result) {
    return {
      ...result,
      course_title: getAuthoritativeCourseName(result.id, result.course_title)
    };
  }
  return null;
};
