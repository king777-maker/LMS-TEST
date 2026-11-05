/**
 * courseTitleFormatter.js
 * Centralized formatting utility for course titles in LMS navigation dropdowns and menus.
 *
 * Rules:
 * - Combines course names and certification labels into ONE continuous text element.
 * - Removes all vertical separator symbols (|), decorative separators, and separate metadata columns.
 * - Does not modify original course objects in the database or store.
 * - Enforces standardized naming:
 *     - ISO 9001:2026 (QMS) Certified Professional
 *     - ISO 14001:2026 (EMS) Certified Professional
 *     - ISO 45001:2018 (OHSMS) Certified Professional
 *     - ISO 22000:2018 (FSMS) Certified Professional
 *     - ISO 19011:2026 Certified Professional
 *     - ISO 27001:2022 (ISMS) Certified Professional
 *     - 5S Workplace Management Certified Professional
 *     - Other courses retain their authentic names with appropriate existing certification labels.
 */

export const formatDropdownCourseTitle = (course) => {
  if (!course) return "";
  const rawTitle = typeof course === "string" ? course : course.title || course.name || "";

  // Strip any vertical pipes (|) or decorative bar separators
  let title = rawTitle
    .replace(/\s*\|\s*/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();

  // 1. ISO 9001:2026 QMS
  if (/ISO\s*9001:?2026.*QMS/i.test(title)) {
    return "ISO 9001:2026 (QMS) Certified Professional";
  }

  // 2. ISO 14001:2026 EMS (handles ISO14001: 2026 EMS spacing variants)
  if (/ISO\s*14001:?\s*2026.*EMS/i.test(title)) {
    return "ISO 14001:2026 (EMS) Certified Professional";
  }

  // 3. ISO 45001:2018 OHSMS
  if (/ISO\s*45001:?2018.*OHSMS/i.test(title)) {
    return "ISO 45001:2018 (OHSMS) Certified Professional";
  }

  // 4. ISO 22000:2018 FSMS
  if (/ISO\s*22000:?2018.*FSMS/i.test(title)) {
    return "ISO 22000:2018 (FSMS) Certified Professional";
  }

  // 5. ISO 19011:2026
  if (/ISO\s*19011:?2026/i.test(title) && !/Lead|Internal/i.test(title)) {
    return "ISO 19011:2026 Certified Professional";
  }

  // 6. ISO 27001:2022 ISMS
  if (/ISO\s*(?:IEC\s*)?27001:?2022.*ISMS/i.test(title) && !/Lead|Internal/i.test(title)) {
    return "ISO 27001:2022 (ISMS) Certified Professional";
  }

  // 7. 5S Workplace Management (Free course)
  if (/^5S\s+Workplace\s+Management$/i.test(title)) {
    return "5S Workplace Management Certified Professional";
  }

  // If any other course has pipe or duplicate spaces, clean it up
  return title.replace(/\s*\|\s*/g, " ").replace(/\s{2,}/g, " ").trim();
};

export default formatDropdownCourseTitle;
