import fs from 'fs';
import path from 'path';

const p = 'C:/Users/ADMIN/Desktop/BB_course/broadbeach-backend/app/routes/api.php';
let code = fs.readFileSync(p, 'utf8');

// 1. Add TicketController require
const reqTarget = '/../Controllers/EnrollmentEnquiryController.php";';
if (!code.includes('TicketController.php')) {
  code = code.replace(
    reqTarget,
    reqTarget + '\nrequire_once __DIR__ . "/../Controllers/TicketController.php";'
  );
}

// 2. Add TicketController instantiation
const instTarget = '$enrollmentEnquiryController =';
if (!code.includes('$ticketController = new TicketController')) {
  const insertPos = code.indexOf(instTarget);
  if (insertPos !== -1) {
    code = code.slice(0, insertPos) + '$ticketController = new TicketController($db);\n\n' + code.slice(insertPos);
  }
}

// 3. Add Ticket Routes right after course-enquiry route
const routeTarget = '$enrollmentEnquiryController->submit();\n    exit;\n}';
const routeTargetCRLF = '$enrollmentEnquiryController->submit();\r\n    exit;\r\n}';

const ticketRoutes = `

// =====================================================
// LEARNER SUPPORT TICKETS
// =====================================================
// POST /api/tickets -> Submit ticket
// GET  /api/tickets/my -> Retrieve learner tickets
// GET  /api/tickets/{id} -> Single ticket details
// POST /api/tickets/{id}/reply -> Reply to ticket
// =====================================================

if ($method === "POST" && $path === "/api/tickets") {
    $ticketController->submit();
    exit;
}

if ($method === "GET" && $path === "/api/tickets/my") {
    $ticketController->getMyTickets();
    exit;
}

if ($method === "GET" && preg_match("#^/api/tickets/([^/]+)$#", $path, $matches)) {
    $ticketController->getTicket($matches[1]);
    exit;
}

if ($method === "POST" && preg_match("#^/api/tickets/([^/]+)/reply$#", $path, $matches)) {
    $ticketController->reply($matches[1]);
    exit;
}
`;

if (!code.includes('if ($method === "POST" && $path === "/api/tickets")')) {
  if (code.includes(routeTargetCRLF)) {
    code = code.replace(routeTargetCRLF, routeTargetCRLF + ticketRoutes.replace(/\n/g, '\r\n'));
  } else if (code.includes(routeTarget)) {
    code = code.replace(routeTarget, routeTarget + ticketRoutes);
  }
}

fs.writeFileSync(p, code, 'utf8');
console.log('Successfully updated C:/Users/ADMIN/Desktop/BB_course/broadbeach-backend/app/routes/api.php');

// Also update backend_inspection
const inspectionPath = 'c:/Users/ADMIN/Desktop/bb_exp-2.0/backend_inspection/app/routes/api.php';
if (fs.existsSync(inspectionPath)) {
  fs.copyFileSync(p, inspectionPath);
  console.log('Copied to backend_inspection/app/routes/api.php');
}

const inspectionControllerPath = 'c:/Users/ADMIN/Desktop/bb_exp-2.0/backend_inspection/app/Controllers/TicketController.php';
fs.copyFileSync('C:/Users/ADMIN/Desktop/BB_course/broadbeach-backend/app/Controllers/TicketController.php', inspectionControllerPath);
console.log('Copied TicketController.php to backend_inspection/app/Controllers/');
