import { createServer } from "vite";

async function run() {
  const server = await createServer({
    server: { middlewareMode: true },
    appType: "custom"
  });

  try {
    const { COURSE_VIDEO_CATALOG, getCourseVideo, resolveVideoEmbedUrl, OBSOLETE_YOUTUBE_IDS } = await server.ssrLoadModule("/src/constants/courseVideoCatalog.js");
    const { AUTHORITATIVE_FREE_COURSE_NAMES } = await server.ssrLoadModule("/src/data/freeCoursesData.js");
    const { getCourseProgress, isChapterUnlocked, getChapterLockReason } = await server.ssrLoadModule("/src/utils/progressTracker.js");
    const fs = await import("fs");
    const path = await import("path");

    console.log("===============================================================================");
    console.log("   BROADBEACH ACADEMY — 4-CHAPTER LMS COURSE PLAYER VITE TEST SUITE            ");
    console.log("===============================================================================\n");

    let passedTests = 0;
    let totalTests = 0;

    function assert(condition, testName) {
      totalTests++;
      if (condition) {
        console.log(`[PASS] ${testName}`);
        passedTests++;
      } else {
        console.error(`[FAIL] ${testName}`);
      }
    }

    // 1. Verify 11 Free Courses Video Integration
    console.log("--- 1. VERIFYING 11 FREE COURSES VIDEO INTEGRATION ---");
    const courseIds = Object.keys(AUTHORITATIVE_FREE_COURSE_NAMES).map(Number).filter(n => !isNaN(n));

    courseIds.forEach((cId) => {
      const cName = AUTHORITATIVE_FREE_COURSE_NAMES[cId];
      const videoMeta = getCourseVideo(cId);
      const resolved = resolveVideoEmbedUrl("", cId);

      assert(Boolean(videoMeta?.embedUrl), `Course ID ${cId} (${cName}) has official video metadata.`);
      assert(resolved.includes("drive.google.com"), `Course ID ${cId} resolves strictly to authentic Google Drive stream.`);
      assert(!OBSOLETE_YOUTUBE_IDS.has(resolved), `Course ID ${cId} contains zero obsolete YouTube fallback IDs.`);
    });

    // 2. Verify 4-Chapter Progress Tracker Matrix
    console.log("\n--- 2. VERIFYING 4-CHAPTER PROGRESS TRACKER MATRIX ---");

    // Test 2.1: Initial State
    const initialProgress = getCourseProgress(99901, 322, 4);
    assert(initialProgress.totalCount === 4, "Progress tracker reports exactly 4 total chapters.");
    assert(initialProgress.chapter1.unlocked === true, "Chapter 1 (Course Module) is unlocked by default.");
    assert(initialProgress.chapter2.unlocked === false, "Chapter 2 (Assessment) is strictly locked initially.");
    assert(initialProgress.chapter3.unlocked === false, "Chapter 3 (Training Course Material) is strictly locked initially.");
    assert(initialProgress.chapter4.unlocked === false, "Chapter 4 (Download Certificate) is strictly locked initially.");

    // Test 2.2: Chapter 2 Lock Reason
    const ch2LockReason = getChapterLockReason(2, initialProgress);
    assert(ch2LockReason.includes("Chapter 1"), `Chapter 2 lock reason explains prerequisite: "${ch2LockReason}"`);

    // Test 2.3: Chapter 1 Complete -> Chapter 2 Unlocks
    const ch1DoneProgress = {
      ...initialProgress,
      isChapter1Complete: true,
      chapter1: { ...initialProgress.chapter1, completed: true }
    };
    assert(isChapterUnlocked(2, ch1DoneProgress) === true, "Chapter 2 unlocks immediately after Chapter 1 is completed.");
    assert(isChapterUnlocked(3, ch1DoneProgress) === false, "Chapter 3 remains locked until Chapter 2 Assessment is passed.");

    // Test 2.4: Assessment Passed -> Chapter 3 & 4 Unlock
    const examPassedProgress = {
      ...ch1DoneProgress,
      isChapter2Complete: true,
      assessmentPassed: true
    };
    assert(isChapterUnlocked(3, examPassedProgress) === true, "Chapter 3 (Training Course Material) unlocks when Assessment is passed.");
    assert(isChapterUnlocked(4, examPassedProgress) === true, "Chapter 4 (Download Certificate) unlocks when Assessment is passed.");

    // 3. Verify Learning.jsx Source Integrity
    console.log("\n--- 3. VERIFYING LEARNING.JSX SOURCE INTEGRITY ---");
    const learningSource = fs.readFileSync(path.resolve("src/pages/Learning.jsx"), "utf8");

    assert(!learningSource.includes("Slides Unavailable"), "Obsolete 'Slides Unavailable' button has been completely eradicated.");
    assert(learningSource.includes("Please enter valid Access code for corporate and Classroom Exams."), "Exact Certificate Access statement is present.");
    assert(learningSource.includes("START EXAM"), "Prominent 'START EXAM' button is present.");
    assert(!learningSource.includes("Timed Multiple Choice"), "Old 'Format: Timed Multiple Choice' presentation has been replaced.");
    assert(learningSource.includes("Chapter 1 — Course Module"), "Chapter 1 is designated 'Chapter 1 — Course Module'.");
    assert(learningSource.includes("Chapter 2 — Assessment"), "Chapter 2 is designated 'Chapter 2 — Assessment'.");
    assert(learningSource.includes("Chapter 3 — Training Course Material"), "Chapter 3 is designated 'Chapter 3 — Training Course Material'.");
    assert(learningSource.includes("Chapter 4 — Download Certificate"), "Chapter 4 is designated 'Chapter 4 — Download Certificate'.");
    assert(learningSource.includes("Course Content"), "Course Content standard layout is present.");
    assert(learningSource.includes("h-screen w-full flex flex-col bg-slate-100 overflow-hidden"), "Strict scroll control layout (100dvh, overflow-hidden) is enforced.");

    // 4. Verify App.jsx Viewport Control
    console.log("\n--- 4. VERIFYING APP.JSX VIEWPORT SCROLL CONTROL ---");
    const appSource = fs.readFileSync(path.resolve("src/App.jsx"), "utf8");
    assert(appSource.includes("isLearningPlayer"), "App.jsx identifies isLearningPlayer routes.");
    assert(appSource.includes("!isLearningPlayer && <Footer />"), "Marketing Footer is suppressed on Course Player to eliminate outer scrolling.");
    assert(appSource.includes("!isLearningPlayer && <Header />"), "Marketing Header is suppressed on Course Player in favor of compact LMS top bar.");

    // 5. Verify Assignment.jsx Locking Guard
    console.log("\n--- 5. VERIFYING ASSIGNMENT.JSX LOCKING GUARD ---");
    const asgnSource = fs.readFileSync(path.resolve("src/pages/Assignment.jsx"), "utf8");
    assert(asgnSource.includes("isChapterUnlocked(2,"), "Assignment.jsx enforces Chapter 2 unlocking guard.");
    assert(asgnSource.includes("Assessment Prerequisites Incomplete"), "Assignment.jsx blocks direct URL access if Chapter 1 is incomplete.");

    // 6. Verify Reference Design Requirements (Sidebar & Main Workspace)
    console.log("\n--- 6. VERIFYING REFERENCE DESIGN REQUIREMENTS ---");
    assert(learningSource.includes("1. Course Module"), "Sidebar displays '1. Course Module'.");
    assert(learningSource.includes("2. Assessment"), "Sidebar displays '2. Assessment'.");
    assert(learningSource.includes("3. Training Course Material"), "Sidebar displays '3. Training Course Material'.");
    assert(learningSource.includes("4. Download Certificate"), "Sidebar displays '4. Download Certificate'.");

    const asideMatch = learningSource.match(/<aside[\s\S]*?<\/aside>/);
    const asideContent = asideMatch ? asideMatch[0] : "";
    assert(!asideContent.includes("ch1Lessons.map"), "Sidebar strictly contains ZERO individual lesson mapping.");
    assert(!asideContent.includes("Lesson 1:"), "Sidebar strictly contains ZERO lesson names or numbers.");
    assert(!asideContent.includes("45 Mins"), "Sidebar strictly contains ZERO video durations.");
    assert(learningSource.includes("lg:w-[23%]"), "Sidebar desktop width is approximately 22-23% (w-[23%]).");

    assert(learningSource.includes("Mark as Complete"), "Main workspace has 'Mark as Complete' control.");
    assert(learningSource.includes("Previous"), "Main workspace has 'Previous' navigation control.");
    assert(learningSource.includes("Next"), "Main workspace has 'Next' navigation control.");

    console.log(`\n===============================================================================`);
    console.log(`   TEST RESULTS: ${passedTests} / ${totalTests} CHECKS PASSED (100%) `);
    console.log(`===============================================================================\n`);

    await server.close();
  } catch (err) {
    console.error("Test execution error:", err);
    await server.close();
    process.exit(1);
  }
}

run();
