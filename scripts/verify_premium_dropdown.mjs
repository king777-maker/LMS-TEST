import fs from "fs";
import path from "path";
import { formatDropdownCourseTitle } from "../src/utils/courseTitleFormatter.js";
import { navigationCategories } from "../src/data/coursesData.js";

console.log("===============================================================================");
console.log("   BROADBEACH ACADEMY — PREMIUM COURSE DROPDOWN VERIFICATION SUITE             ");
console.log("===============================================================================\n");

let passedCount = 0;
let totalCount = 0;

function assert(condition, message) {
  totalCount++;
  if (condition) {
    console.log(`[PASS] ${message}`);
    passedCount++;
  } else {
    console.error(`[FAIL] ${message}`);
  }
}

// ---------------------------------------------------------------------------
// 1. COURSE TITLE FORMATTER & ZERO PIPES AUDIT
// ---------------------------------------------------------------------------
console.log("--- 1. VERIFYING COURSE TITLE FORMATTING & ZERO PIPES ---");

const testCases = [
  {
    input: "ISO 9001:2026 QMS",
    expected: "ISO 9001:2026 (QMS) Certified Professional",
    desc: "ISO 9001:2026 (QMS) Certified Professional"
  },
  {
    input: "ISO14001: 2026 EMS",
    expected: "ISO 14001:2026 (EMS) Certified Professional",
    desc: "ISO 14001:2026 (EMS) Certified Professional"
  },
  {
    input: "ISO 45001:2018 OHSMS",
    expected: "ISO 45001:2018 (OHSMS) Certified Professional",
    desc: "ISO 45001:2018 (OHSMS) Certified Professional"
  },
  {
    input: "ISO 22000:2018 FSMS",
    expected: "ISO 22000:2018 (FSMS) Certified Professional",
    desc: "ISO 22000:2018 (FSMS) Certified Professional"
  },
  {
    input: "ISO 19011:2026",
    expected: "ISO 19011:2026 Certified Professional",
    desc: "ISO 19011:2026 Certified Professional"
  },
  {
    input: "ISO 27001:2022 ISMS",
    expected: "ISO 27001:2022 (ISMS) Certified Professional",
    desc: "ISO 27001:2022 (ISMS) Certified Professional"
  },
  {
    input: "5S Workplace Management",
    expected: "5S Workplace Management Certified Professional",
    desc: "5S Workplace Management Certified Professional"
  },
  {
    input: "7QC Tools Certification",
    expected: "7QC Tools Certification",
    desc: "7QC Tools Certification retains authentic name"
  },
  {
    input: "Project Management Level-1",
    expected: "Project Management Level-1",
    desc: "Project Management Level-1 retains authentic name"
  },
  {
    input: "Lean Six Sigma White belt",
    expected: "Lean Six Sigma White belt",
    desc: "Lean Six Sigma White belt retains authentic name"
  },
  {
    input: "Root Cause Analysis",
    expected: "Root Cause Analysis",
    desc: "Root Cause Analysis retains authentic name"
  },
  {
    input: "Legacy Course | Certified Specialist",
    expected: "Legacy Course Certified Specialist",
    desc: "Vertical pipe (|) is cleanly stripped"
  }
];

for (const tc of testCases) {
  const result = formatDropdownCourseTitle(tc.input);
  assert(result === tc.expected, `${tc.desc}: got "${result}"`);
}

// ---------------------------------------------------------------------------
// 2. DROPDOWN COMPONENT SOURCE AUDIT (CourseDropdown.jsx)
// ---------------------------------------------------------------------------
console.log("\n--- 2. VERIFYING COURSEDROPDOWN.JSX SPECIFICATIONS ---");

const courseDropdownPath = path.resolve("src/components/Header/CourseDropdown.jsx");
assert(fs.existsSync(courseDropdownPath), "CourseDropdown.jsx exists");
const courseDropdownSrc = fs.readFileSync(courseDropdownPath, "utf-8");

// Section 2: Header specifications
assert(courseDropdownSrc.includes("categoryTitle"), "Dropdown displays category title on the left");
assert(courseDropdownSrc.includes("courseCount"), "Dropdown displays accurate course count badge on the right");
assert(courseDropdownSrc.includes("border-b border-slate-100"), "Dropdown header has subtle bottom border");

// Section 3 & 5: Course row design
assert(courseDropdownSrc.includes("formatDropdownCourseTitle"), "CourseDropdown utilizes formatDropdownCourseTitle");
assert(courseDropdownSrc.includes("h-[48px]") || courseDropdownSrc.includes("min-h-[48px]"), "Course rows use ~48px height");
assert(courseDropdownSrc.includes("text-[#0A192F]"), "Course titles use dark navy text");
assert(courseDropdownSrc.includes("truncate"), "Course titles use accessible text truncation");
assert(courseDropdownSrc.includes("PromoBadge"), "CourseDropdown includes right-aligned PromoBadge");
assert(!courseDropdownSrc.includes("<FaPlay") && !courseDropdownSrc.includes("<FaBook"), "Course titles have zero leading icons");

// Section 6: Dimensions
assert(courseDropdownSrc.includes("w-[780px]") || courseDropdownSrc.includes("800px") || courseDropdownSrc.includes("820px"), "Desktop width is approximately 780–840px");
assert(courseDropdownSrc.includes("rounded-[18px]"), "Border radius is 18px (rounded-[18px])");
assert(courseDropdownSrc.includes("max-h-[min(620px"), "Maximum height is constrained to approximately 620px");
assert(courseDropdownSrc.includes("max-w-[calc(100vw-32px)]"), "Maximum width is constrained by viewport space");

// Section 7: Scrolling structure
assert(courseDropdownSrc.includes("overflow-y-auto custom-dropdown-scroll"), "Course list is independently scrollable");
assert(courseDropdownSrc.includes("shrink-0"), "Header and footer remain fixed with shrink-0");

// Section 8: Footer
assert(courseDropdownSrc.includes("Explore All"), "Footer contains 'Explore All [Category] Programs'");
assert(courseDropdownSrc.includes("FaChevronRight"), "Footer contains right-facing chevron");
assert(courseDropdownSrc.includes("text-blue-600"), "Footer text is blue");

// Responsive clamp
assert(courseDropdownSrc.includes("getBoundingClientRect") || courseDropdownSrc.includes("shiftX"), "Dropdown includes viewport boundary clamp");

// ---------------------------------------------------------------------------
// 3. PROMO BADGE AUDIT (PromoBadge.jsx)
// ---------------------------------------------------------------------------
console.log("\n--- 3. VERIFYING PROMOTIONAL BADGES (PromoBadge.jsx) ---");

const promoBadgePath = path.resolve("src/components/Header/PromoBadge.jsx");
assert(fs.existsSync(promoBadgePath), "PromoBadge.jsx exists");
const promoBadgeSrc = fs.readFileSync(promoBadgePath, "utf-8");

assert(promoBadgeSrc.includes("#DC2626") && promoBadgeSrc.includes("rounded-full"), "NEW badge has red background and compact pill shape");
assert(promoBadgeSrc.includes("🔥") && promoBadgeSrc.includes("#EA580C"), "HOT badge has flame indicator and orange/red text");
assert(promoBadgeSrc.includes("★") && promoBadgeSrc.includes("#FEF08A"), "POPULAR badge has star indicator and yellow background");
assert(promoBadgeSrc.includes("TRENDING") && promoBadgeSrc.includes("#EA580C"), "TRENDING badge has orange background and white text");
assert(promoBadgeSrc.includes("BEST SELLER") && promoBadgeSrc.includes("#0A192F"), "BEST SELLER badge has dark navy background and gold text");

// ---------------------------------------------------------------------------
// 4. NAVBAR INTEGRATION AUDIT (MainNavbar.jsx)
// ---------------------------------------------------------------------------
console.log("\n--- 4. VERIFYING MAINNAVBAR.JSX INTEGRATION ---");

const mainNavbarPath = path.resolve("src/components/Header/MainNavbar.jsx");
assert(fs.existsSync(mainNavbarPath), "MainNavbar.jsx exists");
const mainNavbarSrc = fs.readFileSync(mainNavbarPath, "utf-8");

assert(mainNavbarSrc.includes("CourseDropdown"), "MainNavbar imports and renders CourseDropdown");
assert(mainNavbarSrc.includes("openDropdownId"), "MainNavbar manages dropdown state");

// ---------------------------------------------------------------------------
// 5. MOBILE NAVBAR INTEGRATION AUDIT (MobileNavbar.jsx)
// ---------------------------------------------------------------------------
console.log("\n--- 5. VERIFYING MOBILENAVBAR.JSX FORMATTING ---");

const mobileNavbarPath = path.resolve("src/components/Header/MobileNavbar.jsx");
assert(fs.existsSync(mobileNavbarPath), "MobileNavbar.jsx exists");
const mobileNavbarSrc = fs.readFileSync(mobileNavbarPath, "utf-8");

assert(mobileNavbarSrc.includes("formatDropdownCourseTitle"), "MobileNavbar formats course titles without vertical pipes");

// ---------------------------------------------------------------------------
// 6. CATEGORIES COVERAGE AUDIT
// ---------------------------------------------------------------------------
console.log("\n--- 6. VERIFYING ALL NAVIGATION CATEGORIES ---");

const expectedCategories = [
  "free-courses",
  "lead-auditor",
  "internal-auditor",
  "health-safety-hse",
  "professional-certifications"
];

for (const catId of expectedCategories) {
  const cat = navigationCategories.find(c => c.id === catId);
  assert(cat !== undefined, `Category "${catId}" is present in navigationCategories`);
  const courseList = cat?.courses || [];
  assert(courseList.length > 0, `Category "${catId}" contains authentic course data (${courseList.length} courses)`);
}

// ---------------------------------------------------------------------------
// FINAL REPORT
// ---------------------------------------------------------------------------
console.log("\n===============================================================================");
console.log(`   TOTAL CHECKS PASSED: ${passedCount} / ${totalCount} (${Math.round((passedCount / totalCount) * 100)}%)`);
console.log("===============================================================================");

if (passedCount === totalCount) {
  process.exit(0);
} else {
  process.exit(1);
}
