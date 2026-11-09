import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { COURSE_ASSESSMENT_CATALOG } from "./src/data/assessmentCatalog.js";
import { FREE_COURSE_DB_MAP } from "./src/constants/courseAvailability.js";
import { adminDevMiddleware } from "./src/server/adminMiddleware.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function courseEnquiryDevPlugin() {
  return {
    name: "course-enquiry-dev-middleware",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const parsedUrl = new URL(req.url, "http://" + (req.headers.host || "localhost"));

        if (req.method === "POST" && (parsedUrl.pathname === "/api/course-enquiry" || parsedUrl.pathname === "/broadbeachlearning.com/broadbeach-backend/api/course-enquiry")) {
          let body = "";
          req.on("data", chunk => {
            body += chunk;
          });

          req.on("end", () => {
            try {
              const data = JSON.parse(body || "{}");
              const {
                full_name,
                email,
                phone,
                company,
                designation,
                experience,
                prior_knowledge,
                participants,
                training_location,
                preferred_timing,
                timeframe,
                message,
                course_id,
                course_title,
                consent,
                website
              } = data;

              // 1. Bot Honeypot
              if (website) {
                res.setHeader("Content-Type", "application/json");
                res.statusCode = 200;
                res.end(JSON.stringify({
                  success: true,
                  message: "Thank you! Your enquiry has been received.",
                  data: { reference_id: "ENQ-BOT-" + Date.now() }
                }));
                return;
              }

              // 2. Server Validation for all required details
              const errors = {};
              if (!full_name || String(full_name).trim().length < 2) {
                errors.full_name = "Full name is required (minimum 2 characters).";
              }
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (!email || !emailRegex.test(String(email).trim())) {
                errors.email = "A valid email address is required.";
              }
              const cleanedPhone = String(phone || "").replace(/[\s\-()]/g, "");
              if (!phone || cleanedPhone.length < 8) {
                errors.phone = "A valid phone number is required (min 8 digits).";
              }
              if (!company || String(company).trim().length < 2) {
                errors.company = "Company / Organization name is required.";
              }
              if (!designation || String(designation).trim().length < 2) {
                errors.designation = "Job role / designation is required.";
              }
              if (!experience || String(experience).trim().length === 0) {
                errors.experience = "Work experience level is required.";
              }
              if (!prior_knowledge || String(prior_knowledge).trim().length === 0) {
                errors.prior_knowledge = "Prior ISO knowledge level is required.";
              }
              if (!participants || String(participants).trim().length === 0) {
                errors.participants = "Number of participants is required.";
              }
              if (!training_location || String(training_location).trim().length === 0) {
                errors.training_location = "Preferred training location is required.";
              }
              if (!preferred_timing || String(preferred_timing).trim().length === 0) {
                errors.preferred_timing = "Preferred batch timing is required.";
              }
              if (!timeframe || String(timeframe).trim().length === 0) {
                errors.timeframe = "Target training timeframe is required.";
              }
              if (!message || String(message).trim().length < 10) {
                errors.message = "Please describe your specific training requirements (min 10 characters).";
              }
              if (!consent) {
                errors.consent = "Consent to be contacted is required.";
              }

              if (Object.keys(errors).length > 0) {
                res.setHeader("Content-Type", "application/json");
                res.statusCode = 422;
                res.end(JSON.stringify({
                  success: false,
                  message: "Validation failed. Please fill in all required enquiry details.",
                  errors: errors
                }));
                return;
              }

              // 3. Persist Enquiry to Data Store
              const storageDir = path.resolve(__dirname, "src/data");
              if (!fs.existsSync(storageDir)) {
                fs.mkdirSync(storageDir, { recursive: true });
              }
              const enquiriesFile = path.join(storageDir, "course_enquiries.json");
              let currentEnquiries = [];
              try {
                if (fs.existsSync(enquiriesFile)) {
                  currentEnquiries = JSON.parse(fs.readFileSync(enquiriesFile, "utf8") || "[]");
                }
              } catch (e) {
                currentEnquiries = [];
              }

              const refId = "ENQ-" + (course_id || "CERT") + "-" + Date.now().toString(36).toUpperCase();
              const record = {
                id: refId,
                ...data,
                created_at: new Date().toISOString()
              };
              currentEnquiries.push(record);
              fs.writeFileSync(enquiriesFile, JSON.stringify(currentEnquiries, null, 2), "utf8");

              res.setHeader("Content-Type", "application/json");
              res.statusCode = 200;
              res.end(JSON.stringify({
                success: true,
                message: "Thank you for your interest in " + (course_title || "this course") + ". Our team will contact you regarding upcoming offline batches.",
                data: {
                  reference_id: refId,
                  course_id: course_id,
                  course_title: course_title,
                  full_name: full_name,
                  email: email,
                  phone: phone,
                  company: company,
                  designation: designation
                }
              }));
            } catch (err) {
              res.setHeader("Content-Type", "application/json");
              res.statusCode = 500;
              res.end(JSON.stringify({
                success: false,
                message: "Internal server error processing enquiry."
              }));
            }
          });
          return;
        }

        next();
      });
    }
  };
}

function assessmentDevPlugin() {
  return {
    name: "assessment-dev-middleware",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const parsedUrl = new URL(req.url, "http://" + (req.headers.host || "localhost"));
        const pathname = parsedUrl.pathname;

        const isAssessmentGet = req.method === "GET" && (
          pathname === "/api/assessment" || 
          pathname === "/broadbeachlearning.com/broadbeach-backend/api/assessment"
        );

        const isAssessmentSubmit = req.method === "POST" && (
          pathname === "/api/submit-assessment" || 
          pathname === "/broadbeachlearning.com/broadbeach-backend/api/submit-assessment"
        );

        if (isAssessmentGet) {
          const rawId = parsedUrl.searchParams.get("id") || parsedUrl.searchParams.get("certification_id") || "";
          const normalizedStr = String(rawId).toLowerCase().trim();
          let certId = FREE_COURSE_DB_MAP[normalizedStr] || Number(rawId) || 0;

          const assessment = COURSE_ASSESSMENT_CATALOG[certId];
          if (!assessment) {
            res.setHeader("Content-Type", "application/json");
            res.statusCode = 404;
            res.end(JSON.stringify({
              success: false,
              message: "Assessment not found for course " + rawId
            }));
            return;
          }

          res.setHeader("Content-Type", "application/json");
          res.statusCode = 200;
          res.end(JSON.stringify({
            success: true,
            message: "Assessment fetched successfully.",
            data: {
              id: assessment.id,
              certification_id: assessment.certification_id,
              course_slug: assessment.course_slug,
              course_title: assessment.course_title,
              title: assessment.title,
              duration_minutes: assessment.duration_minutes,
              passing_percentage: assessment.passing_percentage,
              total_questions: assessment.questions.length,
              questions: assessment.questions.map(q => ({
                id: q.id,
                assessment_id: assessment.id,
                question: q.question,
                options: q.options
              }))
            }
          }));
          return;
        }

        if (isAssessmentSubmit) {
          let body = "";
          req.on("data", chunk => { body += chunk; });
          req.on("end", () => {
            try {
              const payload = JSON.parse(body || "{}");
              const { user_id, student_name, certification_id, answers } = payload;
              const certId = Number(certification_id);

              if (!certId || certId <= 0) {
                res.setHeader("Content-Type", "application/json");
                res.statusCode = 422;
                res.end(JSON.stringify({
                  success: false,
                  message: "Invalid certification ID."
                }));
                return;
              }

              const assessmentConfig = COURSE_ASSESSMENT_CATALOG[certId];
              if (!assessmentConfig) {
                res.setHeader("Content-Type", "application/json");
                res.statusCode = 404;
                res.end(JSON.stringify({
                  success: false,
                  message: "Assessment not found for certification ID " + certId
                }));
                return;
              }

              const answerMap = answers || {};
              let score = 0;
              const totalQuestions = assessmentConfig.questions.length;

              for (const q of assessmentConfig.questions) {
                const userAns = (answerMap[q.id] || answerMap[String(q.id)] || "").trim();
                if (userAns && userAns.toLowerCase() === String(q.correct_answer || "").toLowerCase().trim()) {
                  score++;
                }
              }

              const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
              const passed = percentage >= assessmentConfig.passing_percentage;
              const result = passed ? "pass" : "fail";

              // Generate unique certificate ID if passed
              const certNumber = "BOA" + certId + (user_id || 13) + Math.floor(100 + Math.random() * 900);

              // Persist Submission Safely
              const storageDir = path.resolve(__dirname, "src/data");
              if (!fs.existsSync(storageDir)) {
                fs.mkdirSync(storageDir, { recursive: true });
              }
              const submissionsFile = path.join(storageDir, "assessment_submissions.json");
              let currentSubmissions = [];
              try {
                if (fs.existsSync(submissionsFile)) {
                  currentSubmissions = JSON.parse(fs.readFileSync(submissionsFile, "utf8") || "[]");
                }
              } catch (e) {
                currentSubmissions = [];
              }

              const submissionRecord = {
                id: "SUB-" + certId + "-" + Date.now(),
                user_id: user_id || 13,
                student_name: student_name || "Learner",
                certification_id: certId,
                course_title: assessmentConfig.course_title,
                score: score,
                total: totalQuestions,
                percentage: percentage,
                passing_percentage: assessmentConfig.passing_percentage,
                result: result,
                certificate_number: passed ? certNumber : null,
                submitted_at: new Date().toISOString()
              };
              currentSubmissions.push(submissionRecord);
              fs.writeFileSync(submissionsFile, JSON.stringify(currentSubmissions, null, 2), "utf8");

              // Synchronize with authoritative admin_store.json
              if (passed) {
                const adminStoreFile = path.join(storageDir, "admin_store.json");
                try {
                  if (fs.existsSync(adminStoreFile)) {
                    const storeData = JSON.parse(fs.readFileSync(adminStoreFile, "utf8") || "{}");
                    if (!Array.isArray(storeData.online_certificates)) storeData.online_certificates = [];
                    
                    const existingIdx = storeData.online_certificates.findIndex(
                      c => Number(c.course_id) === certId && Number(c.user_id) === (user_id || 13)
                    );
                    const newOnlineCert = {
                      id: storeData.online_certificates.length > 0 ? Math.max(...storeData.online_certificates.map(c => Number(c.id) || 0)) + 1 : 1,
                      certificate_number: certNumber,
                      user_id: user_id || 13,
                      student_name: student_name || "Learner",
                      candidate_email: payload.email || (student_name ? `${student_name.toLowerCase().replace(/[^a-z0-9]/g, "")}@broadbeach.in` : "learner@broadbeach.in"),
                      course_id: certId,
                      course_name: assessmentConfig.course_title,
                      score: score,
                      total_questions: totalQuestions,
                      percentage: percentage,
                      completion_date: new Date().toISOString(),
                      issued_at: new Date().toISOString(),
                      status: "active",
                      verification_status: "Verified",
                      source: "online",
                      chapters_completed: 5,
                      total_chapters: 5
                    };

                    if (existingIdx >= 0) {
                      storeData.online_certificates[existingIdx] = {
                        ...storeData.online_certificates[existingIdx],
                        ...newOnlineCert,
                        id: storeData.online_certificates[existingIdx].id
                      };
                    } else {
                      storeData.online_certificates.unshift(newOnlineCert);
                    }

                    if (!Array.isArray(storeData.audit_logs)) storeData.audit_logs = [];
                    storeData.audit_logs.unshift({
                      id: storeData.audit_logs.length + 1,
                      user_id: user_id || 13,
                      user_email: payload.email || "learner@broadbeach.in",
                      user_role: "student",
                      action: "CERTIFICATE_ISSUED",
                      entity_type: "online_certificate",
                      entity_id: certNumber,
                      details: `Online certificate ${certNumber} issued to ${student_name || "Learner"} for ${assessmentConfig.course_title} with score ${score}/${totalQuestions} (${percentage}%)`,
                      ip_address: req.socket?.remoteAddress || "127.0.0.1",
                      timestamp: new Date().toISOString()
                    });

                    fs.writeFileSync(adminStoreFile, JSON.stringify(storeData, null, 2), "utf8");
                  }
                } catch (storeErr) {
                  console.error("Error updating admin_store.json:", storeErr);
                }
              }

              res.setHeader("Content-Type", "application/json");
              res.statusCode = 200;
              res.end(JSON.stringify({
                success: true,
                passed: passed,
                message: passed 
                  ? "Congratulations! You passed the assessment and completed the course."
                  : "You scored " + percentage + "%. A minimum of " + assessmentConfig.passing_percentage + "% is required to pass. Please review the course materials and try again.",
                data: {
                  submission_id: submissionRecord.id,
                  assessment_id: certId,
                  certification_id: certId,
                  course_title: assessmentConfig.course_title,
                  score: score,
                  total: totalQuestions,
                  percentage: percentage,
                  passing_percentage: assessmentConfig.passing_percentage,
                  result: result,
                  certificate: passed,
                  certificate_number: passed ? certNumber : null,
                  course_completed: passed,
                  status: passed ? "completed" : "active",
                  progress: passed ? 100 : Math.round((score / totalQuestions) * 100)
                }
              }));
            } catch (err) {
              res.setHeader("Content-Type", "application/json");
              res.statusCode = 500;
              res.end(JSON.stringify({
                success: false,
                message: "Error processing assessment submission: " + (err.message || String(err))
              }));
            }
          });
          return;
        }

        // CREATE CERTIFICATE ENDPOINT
        const isCreateCert = req.method === "POST" && (
          pathname === "/api/create-certificate" ||
          pathname === "/create-certificate" ||
          pathname === "/broadbeachlearning.com/broadbeach-backend/api/create-certificate"
        );

        if (isCreateCert) {
          let body = "";
          req.on("data", chunk => { body += chunk; });
          req.on("end", () => {
            try {
              const payload = JSON.parse(body || "{}");
              const { user_id, student_name, certification_id, course_name, score, total, percentage } = payload;
              const certId = Number(certification_id || 322);
              const uId = Number(user_id || 13);
              const storageDir = path.resolve(__dirname, "src/data");
              const adminStoreFile = path.join(storageDir, "admin_store.json");

              let certNumber = "BOA" + certId + uId + Math.floor(100 + Math.random() * 900);
              let certRecord = null;

              if (fs.existsSync(adminStoreFile)) {
                try {
                  const storeData = JSON.parse(fs.readFileSync(adminStoreFile, "utf8") || "{}");
                  if (!Array.isArray(storeData.online_certificates)) storeData.online_certificates = [];
                  const existing = storeData.online_certificates.find(
                    c => Number(c.course_id) === certId && Number(c.user_id) === uId
                  );
                  if (existing) {
                    certRecord = existing;
                  } else {
                    certRecord = {
                      id: storeData.online_certificates.length > 0 ? Math.max(...storeData.online_certificates.map(c => Number(c.id) || 0)) + 1 : 1,
                      certificate_number: certNumber,
                      user_id: uId,
                      student_name: student_name || "Learner",
                      candidate_email: (student_name ? `${student_name.toLowerCase().replace(/[^a-z0-9]/g, "")}@broadbeach.in` : "learner@broadbeach.in"),
                      course_id: certId,
                      course_name: course_name || "ISO Awareness Course",
                      score: Number(score) || 10,
                      total_questions: Number(total) || 10,
                      percentage: Number(percentage) || 100,
                      completion_date: new Date().toISOString(),
                      issued_at: new Date().toISOString(),
                      status: "active",
                      verification_status: "Verified",
                      source: "online",
                      chapters_completed: 5,
                      total_chapters: 5
                    };
                    storeData.online_certificates.unshift(certRecord);
                    fs.writeFileSync(adminStoreFile, JSON.stringify(storeData, null, 2), "utf8");
                  }
                } catch (e) {}
              }

              if (!certRecord) {
                certRecord = {
                  certificate_number: certNumber,
                  user_id: uId,
                  student_name: student_name || "Learner",
                  course_name: course_name || "ISO Awareness Course",
                  score: Number(score) || 10,
                  total_questions: Number(total) || 10,
                  percentage: Number(percentage) || 100,
                  completion_date: new Date().toISOString(),
                  issued_at: new Date().toISOString(),
                  status: "active",
                  verification_status: "Verified",
                  source: "online",
                  chapters_completed: 5,
                  total_chapters: 5
                };
              }

              res.setHeader("Content-Type", "application/json");
              res.statusCode = 200;
              res.end(JSON.stringify({
                success: true,
                message: "Certificate generated successfully.",
                data: certRecord
              }));
            } catch (err) {
              res.setHeader("Content-Type", "application/json");
              res.statusCode = 500;
              res.end(JSON.stringify({
                success: false,
                message: "Error generating certificate: " + (err.message || String(err))
              }));
            }
          });
          return;
        }

        // MY COURSES ENDPOINT
        if (req.method === "GET" && (pathname === "/api/my-courses" || pathname === "/broadbeachlearning.com/broadbeach-backend/api/my-courses")) {
          res.setHeader("Content-Type", "application/json");
          res.statusCode = 200;
          res.end(JSON.stringify({
            success: true,
            message: "Enrolled courses retrieved successfully.",
            data: []
          }));
          return;
        }

        next();
      });
    }
  };
}

export default defineConfig({
  envPrefix: ["VITE_", "ADMIN_"],
  plugins: [
    react(),
    tailwindcss(),
    adminDevMiddleware(),
    courseEnquiryDevPlugin(),
    assessmentDevPlugin(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("manualCertificatesData")) {
            return "certificates-registry";
          }
        },
      },
    },
  },
  server: {
    port: 3000,
    host: "localhost",
    open: false,
    proxy: {
      "/api": {
        target: "https://cadac.in",
        changeOrigin: true,
        secure: false,
        rewrite: (path) =>
          path.replace(/^\/api/, "/broadbeachlearning.com/broadbeach-backend/api"),
      },
      "/backend": {
        target: "https://cadac.in",
        changeOrigin: true,
        secure: false,
        rewrite: (path) =>
          path.replace(/^\/backend/, "/broadbeachlearning.com/broadbeach-backend"),
      },
    },
  },
});
