import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

console.log("===============================================================================");
console.log("   BROADBEACH ACADEMY — ACTIVE TAB VISIBILITY & CONTRAST VERIFICATION SUITE   ");
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

// 1. TabButton Component Verification
console.log("\n--- 1. VERIFYING STANDARDIZED TABBUTTON COMPONENT ---");
const tabButtonPath = path.join(rootDir, "src/components/common/TabButton.jsx");
assert(fs.existsSync(tabButtonPath), "TabButton.jsx exists");
if (fs.existsSync(tabButtonPath)) {
  const content = fs.readFileSync(tabButtonPath, "utf-8");
  assert(content.includes("#10365D"), "TabButton active background is Dark navy (#10365D)");
  assert(content.includes("!text-white"), "TabButton active text is pure white with explicit priority");
  assert(content.includes("#FFD43B"), "TabButton active icon is Brand yellow (#FFD43B)");
  assert(content.includes("#1E293B"), "TabButton inactive text/icon is Dark navy (#1E293B)");
  assert(content.includes("#E2E8F0"), "TabButton inactive border is subtle light grey (#E2E8F0)");
  assert(content.includes('role="tab"'), "TabButton has accessible role='tab' attribute");
  assert(content.includes("aria-selected"), "TabButton has dynamic aria-selected attribute");
  assert(content.includes("h-[44px]") || content.includes("min-h-[44px]"), "TabButton enforces consistent button height (44px)");
  assert(content.includes("shrink-0"), "TabButton prevents icon shrinking");
}

// 2. Global CSS Contrast Rules in index.css
console.log("\n--- 2. VERIFYING GLOBAL CSS CONTRAST GUARANTEE IN INDEX.CSS ---");
const indexCssPath = path.join(rootDir, "src/index.css");
assert(fs.existsSync(indexCssPath), "src/index.css exists");
if (fs.existsSync(indexCssPath)) {
  const css = fs.readFileSync(indexCssPath, "utf-8");
  assert(css.includes(".lms-tab-active"), "index.css defines .lms-tab-active rule");
  assert(css.includes("#10365D !important"), "index.css enforces #10365D active background with !important");
  assert(css.includes("#FFFFFF !important"), "index.css enforces pure white text with !important");
  assert(css.includes("#FFD43B !important"), "index.css enforces Brand yellow icon with !important");
  assert(css.includes(".lms-tab-inactive"), "index.css defines .lms-tab-inactive rule");
  assert(css.includes("#1E293B !important"), "index.css enforces #1E293B inactive text with !important");
  assert(css.includes("#E2E8F0 !important"), "index.css enforces #E2E8F0 inactive border with !important");
}

// 3. CourseDetails.jsx Navigation Layout Verification
console.log("\n--- 3. VERIFYING COURSEDETAILS.JSX LAYOUT & CONTRAST ---");
const courseDetailsPath = path.join(rootDir, "src/pages/courses/CourseDetails.jsx");
assert(fs.existsSync(courseDetailsPath), "CourseDetails.jsx exists");
if (fs.existsSync(courseDetailsPath)) {
  const cd = fs.readFileSync(courseDetailsPath, "utf-8");
  assert(cd.includes("TabButton"), "CourseDetails.jsx imports and utilizes TabButton");
  assert(cd.includes("md:grid-cols-4"), "CourseDetails.jsx enforces 4 horizontal columns on desktop to prevent FAQ wrapping");
  assert(cd.includes("grid-cols-2"), "CourseDetails.jsx enforces clean 2x2 grid on mobile viewports");
  assert(cd.includes("Frequently Asked Questions"), "FAQ tab is present");
  assert(cd.includes("Certification & Verification"), "Certification & Verification tab is present");
  assert(cd.includes("Course Overview"), "Course Overview tab is present");
  assert(cd.includes("Syllabus"), "Syllabus tab is present");
}

// 4. Student Dashboard Verification (MyProfile.jsx)
console.log("\n--- 4. VERIFYING STUDENT DASHBOARD TABS (MYPROFILE.JSX) ---");
const myProfilePath = path.join(rootDir, "src/pages/MyProfile.jsx");
assert(fs.existsSync(myProfilePath), "MyProfile.jsx exists");
if (fs.existsSync(myProfilePath)) {
  const mp = fs.readFileSync(myProfilePath, "utf-8");
  assert(mp.includes("TabButton"), "MyProfile.jsx uses standardized TabButton component");
  assert(mp.includes('role="tablist"'), "MyProfile.jsx wraps tabs in accessible role='tablist'");
}

// 5. Admin Dashboard Verification (AdminAccess.jsx)
console.log("\n--- 5. VERIFYING ADMIN ACCESS TABS (ADMINACCESS.JSX) ---");
const adminAccessPath = path.join(rootDir, "src/pages/admin/AdminAccess.jsx");
assert(fs.existsSync(adminAccessPath), "AdminAccess.jsx exists");
if (fs.existsSync(adminAccessPath)) {
  const aa = fs.readFileSync(adminAccessPath, "utf-8");
  assert(aa.includes("TabButton"), "AdminAccess.jsx uses standardized TabButton component");
  assert(aa.includes('role="tablist"'), "AdminAccess.jsx wraps tabs in accessible role='tablist'");
}

// 6. Course & FreeCoursesPage Verification
console.log("\n--- 6. VERIFYING FILTER / QUICK-SWITCH TABS ---");
const freeCoursesPath = path.join(rootDir, "src/pages/FreeCoursesPage.jsx");
if (fs.existsSync(freeCoursesPath)) {
  const fcp = fs.readFileSync(freeCoursesPath, "utf-8");
  assert(fcp.includes("lms-tab-active"), "FreeCoursesPage uses .lms-tab-active for active category pills");
  assert(fcp.includes("lms-tab-inactive"), "FreeCoursesPage uses .lms-tab-inactive for inactive category pills");
}

const coursesPath = path.join(rootDir, "src/pages/Course.jsx");
if (fs.existsSync(coursesPath)) {
  const cp = fs.readFileSync(coursesPath, "utf-8");
  assert(cp.includes("lms-tab-active"), "Course.jsx uses .lms-tab-active for active type filter");
  assert(cp.includes("lms-tab-inactive"), "Course.jsx uses .lms-tab-inactive for inactive type filter");
}

console.log("\n===============================================================================");
console.log(`   TOTAL ACTIVE TAB & LAYOUT CHECKS PASSED: ${passedChecks} / ${totalChecks} (${Math.round((passedChecks / totalChecks) * 100)}%)`);
console.log("===============================================================================");

if (passedChecks === totalChecks) {
  process.exit(0);
} else {
  process.exit(1);
}
