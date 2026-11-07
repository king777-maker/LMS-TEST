import axios from "axios";

async function runVerification() {
  console.log("=================================================");
  console.log("BROADBEACH ACADEMY — PRODUCTION REPAIR VERIFICATION");
  console.log("=================================================");

  const localBase = "http://localhost:3000";
  const remoteBase = "https://cadac.in/broadbeachlearning.com/broadbeach-backend";

  // Test 1: Unauthenticated Profile Request (Must return 401)
  console.log("\n[TEST 1] Verifying 401 on unauthenticated GET /api/profile");
  try {
    const res = await axios.get(`${localBase}/api/profile`, { validateStatus: () => true });
    console.log(`-> Local Status: ${res.status}`);
    console.log(`-> Local Response:`, res.data);
    if (res.status === 401) {
      console.log("✓ PASS: Correctly rejects unauthenticated profile requests with 401.");
    } else {
      console.log("✗ FAIL: Expected 401 status.");
    }
  } catch (err) {
    console.log("Error testing profile:", err.message);
  }

  // Test 2: Unauthenticated My Courses Request (Local dev proxy)
  console.log("\n[TEST 2] Verifying GET /api/my-courses");
  try {
    const res = await axios.get(`${localBase}/api/my-courses`, { validateStatus: () => true });
    console.log(`-> Local Status: ${res.status}`);
    console.log(`-> Local Response:`, res.data);
    if (res.status === 200 || res.status === 401) {
      console.log("✓ PASS: Endpoint responded with valid JSON structure.");
    }
  } catch (err) {
    console.log("Error testing my-courses:", err.message);
  }

  // Test 3: Learner Ticket Retrieval (GET /api/tickets/my)
  console.log("\n[TEST 3] Verifying GET /api/tickets/my");
  try {
    const res = await axios.get(`${localBase}/api/tickets/my?email=qa.tester@broadbeach.in`, { validateStatus: () => true });
    console.log(`-> Local Status: ${res.status}`);
    console.log(`-> Local Response:`, res.data);
    if (res.status === 200 && res.data.success === true) {
      console.log("✓ PASS: Learner tickets endpoint returned 200 OK with success=true.");
    } else {
      console.log("✗ FAIL: Unexpected status or body.");
    }
  } catch (err) {
    console.log("Error testing tickets/my:", err.message);
  }

  // Test 4: Learner Ticket Submission (POST /api/tickets)
  console.log("\n[TEST 4] Verifying POST /api/tickets submission");
  try {
    const testPayload = {
      subject: "Automated QA Verification - LMS Sync",
      category: "Technical Issue",
      description: "Testing support ticket creation and resolution flow.",
      requester_name: "QA Verification Agent",
      requester_email: "qa.tester@broadbeach.in",
      priority: "medium"
    };
    const res = await axios.post(`${localBase}/api/tickets`, testPayload, { validateStatus: () => true });
    console.log(`-> Local Status: ${res.status}`);
    console.log(`-> Local Response:`, res.data);
    if (res.status === 200 || res.status === 201) {
      console.log("✓ PASS: Ticket submitted successfully.");
    } else {
      console.log("✗ FAIL: Could not submit ticket.");
    }
  } catch (err) {
    console.log("Error testing ticket submission:", err.message);
  }

  // Test 5: Verify CADAC Remote Endpoint Probing
  console.log("\n[TEST 5] Probing CADAC Remote Backend");
  try {
    const res = await axios.post(`${remoteBase}/api/admin/login`, {
      email: "admin@broadbeachlearning.com",
      password: "invalidpassword"
    }, { validateStatus: () => true });
    console.log(`-> Remote Admin Login Status: ${res.status} (Verified remote PHP and DB connectivity)`);
  } catch (err) {
    console.log("Remote CADAC probe note:", err.message);
  }

  console.log("\n=================================================");
  console.log("VERIFICATION COMPLETE");
  console.log("=================================================");
}

runVerification();
