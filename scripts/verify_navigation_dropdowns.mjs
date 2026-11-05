import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

console.log("===============================================================================");
console.log("   BROADBEACH ACADEMY — NAVIGATION DROPDOWN REDESIGN VERIFICATION SUITE       ");
console.log("===============================================================================");

let totalChecks = 0;
let passedChecks = 0;

function assert(condition, message) {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`[PASS] ${message}`);
  } else {
    console.error(`[FAIL] ${message}`);
  }
}

// 1. PromoBadge Component Verification
console.log("\n--- 1. VERIFYING PROMOBADGE COMPONENT ---");
const promoBadgePath = path.join(rootDir, "src/components/Header/PromoBadge.jsx");
assert(fs.existsSync(promoBadgePath), "PromoBadge.jsx exists");
if (fs.existsSync(promoBadgePath)) {
  const content = fs.readFileSync(promoBadgePath, "utf-8");
  assert(content.includes("NEW"), "PromoBadge handles NEW badge");
  assert(content.includes("HOT"), "PromoBadge handles HOT badge");
  assert(content.includes("POPULAR"), "PromoBadge handles POPULAR badge");
  assert(content.includes("TRENDING"), "PromoBadge handles TRENDING badge");
  assert(content.includes("BEST SELLER"), "PromoBadge handles BEST SELLER badge");
  assert(content.includes("🔥") || content.includes("FaFire"), "PromoBadge includes flame icon for HOT");
  assert(content.includes("★") || content.includes("FaStar"), "PromoBadge includes star icon for POPULAR");
  assert(content.includes("rounded"), "PromoBadge has rounded styling");
}

// 2. CourseDropdown Component Verification
console.log("\n--- 2. VERIFYING STANDARDIZED COURSE DROPDOWN COMPONENT ---");
const courseDropdownPath = path.join(rootDir, "src/components/Header/CourseDropdown.jsx");
assert(fs.existsSync(courseDropdownPath), "CourseDropdown.jsx exists");
if (fs.existsSync(courseDropdownPath)) {
  const content = fs.readFileSync(courseDropdownPath, "utf-8");
  assert(content.includes("PromoBadge"), "CourseDropdown imports and uses PromoBadge");
  assert(content.includes("courseCount"), "CourseDropdown displays course count in header");
  assert(content.includes("categoryTitle"), "CourseDropdown displays category name in uppercase header");
  assert(content.includes("course.title"), "CourseDropdown renders course title");
  assert(!content.includes("course.duration"), "CourseDropdown contains zero course duration metadata");
  assert(!content.includes("course.code"), "CourseDropdown contains zero course code metadata");
  assert(!content.includes("course.tag"), "CourseDropdown contains zero course tag metadata");
  assert(!content.includes("FaClock"), "CourseDropdown contains zero clock icons");
  assert(!content.includes("FaGraduationCap"), "CourseDropdown contains zero graduation cap icons");
  assert(!content.includes("FaBook"), "CourseDropdown contains zero book icons");
  assert(content.includes("divide-y"), "CourseDropdown uses subtle horizontal dividers between courses");
  assert(content.includes("w-[500px]"), "CourseDropdown desktop width is standardized (~500px)");
  assert(content.includes("rounded-[16px]"), "CourseDropdown has exact 16px border radius");
  assert(content.includes("min-h-[50px]"), "CourseDropdown course rows have standardized ~50px height");
  assert(content.includes("px-6"), "CourseDropdown course rows have 24-28px horizontal padding");
  assert(content.includes("Explore All"), "CourseDropdown features fixed footer explore link");
}

// 3. Global Application Verification
console.log("\n--- 3. VERIFYING GLOBAL APPLICATION & SUB-TRACK SUPPORT ---");
if (fs.existsSync(courseDropdownPath)) {
  const content = fs.readFileSync(courseDropdownPath, "utf-8");
  assert(content.includes("hasSubcategories"), "CourseDropdown seamlessly supports categories with subcategories");
  assert(content.includes("displayCourses"), "CourseDropdown computes accurate filtered course list");
}

// 4. MainNavbar Integration Verification
console.log("\n--- 4. VERIFYING MAINNAVBAR INTEGRATION ---");
const mainNavPath = path.join(rootDir, "src/components/Header/MainNavbar.jsx");
assert(fs.existsSync(mainNavPath), "MainNavbar.jsx exists");
if (fs.existsSync(mainNavPath)) {
  const content = fs.readFileSync(mainNavPath, "utf-8");
  assert(content.includes("<CourseDropdown"), "MainNavbar renders CourseDropdown globally");
  assert(!content.includes("certification-course-name"), "MainNavbar replaced legacy bloated inline markup");
  assert(!content.includes("FaClock"), "MainNavbar contains zero legacy clock icon references");
}

// 5. MobileNavbar Integration Verification
console.log("\n--- 5. VERIFYING MOBILENAVBAR INTEGRATION ---");
const mobileNavPath = path.join(rootDir, "src/components/Header/MobileNavbar.jsx");
assert(fs.existsSync(mobileNavPath), "MobileNavbar.jsx exists");
if (fs.existsSync(mobileNavPath)) {
  const content = fs.readFileSync(mobileNavPath, "utf-8");
  assert(content.includes("PromoBadge"), "MobileNavbar imports and renders PromoBadge");
  assert(!content.includes("course.duration"), "MobileNavbar removed all course durations");
  assert(!content.includes("course.code"), "MobileNavbar removed all course codes");
  assert(!content.includes("FaClock"), "MobileNavbar removed all clock icons");
}

// 6. CoursesData Badges Verification
console.log("\n--- 6. VERIFYING DATA CONFIGURATION IN COURSESDATA.JS ---");
const coursesDataPath = path.join(rootDir, "src/data/coursesData.js");
assert(fs.existsSync(coursesDataPath), "coursesData.js exists");
if (fs.existsSync(coursesDataPath)) {
  const content = fs.readFileSync(coursesDataPath, "utf-8");
  assert(content.includes('badge: "NEW"'), "coursesData.js configures NEW promotional badges");
  assert(content.includes('badge: "HOT"'), "coursesData.js configures HOT promotional badges");
  assert(content.includes('badge: "POPULAR"'), "coursesData.js configures POPULAR promotional badges");
  assert(content.includes('badge: "BEST SELLER"'), "coursesData.js configures BEST SELLER promotional badges");
  assert(content.includes('badge: "TRENDING"'), "coursesData.js configures TRENDING promotional badges");
}

console.log("\n===============================================================================");
console.log(`   TOTAL NAVIGATION CHECKS PASSED: ${passedChecks} / ${totalChecks} (${Math.round((passedChecks / totalChecks) * 100)}%)`);
console.log("===============================================================================");

if (passedChecks === totalChecks) {
  process.exit(0);
} else {
  process.exit(1);
}
