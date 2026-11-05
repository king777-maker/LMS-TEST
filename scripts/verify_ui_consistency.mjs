import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

console.log("===============================================================================");
console.log("   BROADBEACH ACADEMY — UI CONSISTENCY & BUTTON STANDARDIZATION AUDIT          ");
console.log("===============================================================================");

let total = 0;
let passed = 0;

function check(condition, desc) {
  total++;
  if (condition) {
    passed++;
    console.log(`[PASS] ${desc}`);
  } else {
    console.error(`[FAIL] ${desc}`);
  }
}

// 1. Common Button Component
console.log("\n--- 1. REUSABLE BUTTON COMPONENT (Button.jsx) ---");
const buttonPath = path.join(rootDir, "src/components/common/Button.jsx");
check(fs.existsSync(buttonPath), "Button.jsx component exists in src/components/common/");
if (fs.existsSync(buttonPath)) {
  const content = fs.readFileSync(buttonPath, "utf-8");
  check(content.includes("h-[36px]") && content.includes("px-3"), "Button supports Small (sm) token: 36px height, 12px padding");
  check(content.includes("h-[42px]") && content.includes("px-4"), "Button supports Medium (md) token: 42px height, 16px padding");
  check(content.includes("h-[48px]") && content.includes("px-5.5"), "Button supports Large (lg) token: 48px height, 22px padding");
  check(content.includes("#10365D"), "Active button enforces background #10365D");
  check(content.includes("text-white"), "Active button enforces pure white text (#FFFFFF)");
  check(content.includes("#FFD43B"), "Active button enforces golden yellow icon (#FFD43B)");
  check(content.includes("#1E293B") && content.includes("#E2E8F0"), "Inactive button enforces #1E293B text & #E2E8F0 border");
}

// 2. Global CSS Design System
console.log("\n--- 2. GLOBAL CSS TOKENS (index.css) ---");
const cssPath = path.join(rootDir, "src/index.css");
if (fs.existsSync(cssPath)) {
  const css = fs.readFileSync(cssPath, "utf-8");
  check(css.includes(".btn-sm") && css.includes("height: 36px"), "CSS defines .btn-sm: 36px height, 12px padding, 8px radius");
  check(css.includes(".btn-md") && css.includes("height: 42px"), "CSS defines .btn-md: 42px height, 16px padding, 10px radius");
  check(css.includes(".btn-lg") && css.includes("height: 48px"), "CSS defines .btn-lg: 48px height, 22px padding, 12px radius");
  check(css.includes("#10365D"), "CSS defines centralized active button background #10365D");
  check(css.includes("#FFD43B"), "CSS defines centralized active icon color #FFD43B");
  check(css.includes("color: #FFFFFF !important"), "CSS strictly guards against dark text on dark active buttons");
}

// 3. Free Courses Filter Bar
console.log("\n--- 3. FREE COURSE FILTER BAR (FreeCoursesPage.jsx) ---");
const freeCoursesPath = path.join(rootDir, "src/pages/FreeCoursesPage.jsx");
if (fs.existsSync(freeCoursesPath)) {
  const fc = fs.readFileSync(freeCoursesPath, "utf-8");
  check(fc.includes("h-[42px]"), "Filter category buttons use standardized 42px height");
  check(fc.includes("rounded-[10px]"), "Filter category buttons use standardized 10px border radius");
  check(fc.includes("bg-[#10365D]") && fc.includes("!text-white"), "Active 'All' button uses #10365D with guaranteed white text");
  check(fc.includes("border-[#E2E8F0]") && fc.includes("text-[#1E293B]"), "Inactive filter buttons use white background, #1E293B text, #E2E8F0 border");
  check(fc.includes("placeholder=\"Search Free Courses...\""), "Search input uses exact placeholder 'Search Free Courses...'");
  check(fc.includes("h-[42px] pl-10 pr-8"), "Search input matches 42px height");
  check(fc.includes("h-[42px] pl-3.5 pr-8"), "Sorting dropdown matches 42px height");
}

// 4. Course Details Tabs & CTAs
console.log("\n--- 4. COURSE DETAILS TABS & CTAs (CourseDetails.jsx) ---");
const cdPath = path.join(rootDir, "src/pages/courses/CourseDetails.jsx");
if (fs.existsSync(cdPath)) {
  const cd = fs.readFileSync(cdPath, "utf-8");
  check(cd.includes("Course Overview"), "Contains Tab 1: Course Overview");
  check(cd.includes("Syllabus"), "Contains Tab 2: Syllabus");
  check(cd.includes("Certification & Verification"), "Contains Tab 3: Certification & Verification");
  check(cd.includes("Frequently Asked Questions"), "Contains Tab 4: Frequently Asked Questions");
  check(cd.includes("grid-cols-2 lg:grid-cols-4"), "Hero navigation tabs use 4-column responsive grid on desktop");
  check(cd.includes("grid-cols-2 sm:grid-cols-4"), "Sticky in-page navigation tabs use 4-column responsive grid");
  check(cd.includes("h-[42px] px-3.5 rounded-[10px]"), "Course detail tabs enforce uniform 42px height and 10px radius");
  check(cd.includes("whitespace-nowrap"), "Course detail tabs enforce whitespace-nowrap to prevent text wrapping");
  check(cd.includes("h-[48px] px-7 rounded-[12px]"), "Start Course CTA uses Large size token: 48px height, 12px radius");
}

// 5. Courses Catalog Filter Controls
console.log("\n--- 5. COURSE CATALOG FILTERS (Course.jsx) ---");
const coursePath = path.join(rootDir, "src/pages/Course.jsx");
if (fs.existsSync(coursePath)) {
  const c = fs.readFileSync(coursePath, "utf-8");
  check(c.includes("h-[42px] px-4 rounded-[10px]"), "Catalog quick filters use standardized 42px height and 10px radius");
  check(c.includes("bg-[#10365D] text-white"), "Catalog quick filters use #10365D active state");
  check(c.includes("h-[46px] rounded-[10px]"), "Search input and category select use standardized 46px height and 10px radius");
}

// 6. Student Dashboard Controls
console.log("\n--- 6. STUDENT DASHBOARD CONTROLS (MyCourses & MyProfile) ---");
const mcPath = path.join(rootDir, "src/pages/MyCourses.jsx");
if (fs.existsSync(mcPath)) {
  const mc = fs.readFileSync(mcPath, "utf-8");
  check(mc.includes("h-[42px]") && mc.includes("rounded-[10px]"), "MyCourses course action buttons use 42px height and 10px radius");
}
const mpPath = path.join(rootDir, "src/pages/MyProfile.jsx");
if (fs.existsSync(mpPath)) {
  const mp = fs.readFileSync(mpPath, "utf-8");
  check(mp.includes("h-[42px]") && mp.includes("rounded-[10px]"), "MyProfile quick action buttons use 42px height and 10px radius");
}

// 7. Auth Forms & Submission Buttons
console.log("\n--- 7. AUTH FORM SUBMISSION BUTTONS ---");
const lpPath = path.join(rootDir, "src/pages/LoginPage.jsx");
if (fs.existsSync(lpPath)) {
  const lp = fs.readFileSync(lpPath, "utf-8");
  check(lp.includes("h-[48px] px-6 rounded-[12px]"), "Login submission button uses 48px height and 12px radius");
}
const rpPath = path.join(rootDir, "src/pages/RegisterPage.jsx");
if (fs.existsSync(rpPath)) {
  const rp = fs.readFileSync(rpPath, "utf-8");
  check(rp.includes("h-[48px] px-6 rounded-[12px]"), "Register submission button uses 48px height and 12px radius");
}

console.log("\n===============================================================================");
console.log(`   TOTAL UI CONSISTENCY CHECKS PASSED: ${passed} / ${total} (${Math.round((passed / total) * 100)}%)`);
console.log("===============================================================================");

if (passed === total) {
  process.exit(0);
} else {
  process.exit(1);
}

