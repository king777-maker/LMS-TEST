import os
import sys
import zipfile
import xml.etree.ElementTree as ET
import datetime
import json
import re

EXCEL_PATH = r"C:\Users\ADMIN\.gemini\antigravity\brain\a79ad851-939c-45f5-b470-c4cee63582ee\.user_uploaded\media_1794207454360_7ed2de7b.xlsx"
BASE_DIR = r"C:\Users\ADMIN\Desktop\LMS-test"
JS_OUTPUT_PATH = os.path.join(BASE_DIR, "src", "data", "manualCertificatesData.js")
ADMIN_STORE_PATH = os.path.join(BASE_DIR, "src", "data", "admin_store.json")
SQL_OUTPUT_PATH = os.path.join(BASE_DIR, "database", "2026_11_09_import_manual_certificates.sql")

def parse_excel_date(val):
    if not val:
        return "2024-01-01"
    val_str = str(val).strip()
    if val_str.isdigit():
        try:
            d = datetime.date(1899, 12, 30) + datetime.timedelta(days=int(val_str))
            return d.strftime("%Y-%m-%d")
        except Exception:
            return "2024-01-01"
    match = re.search(r"(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})", val_str)
    if match:
        y, m, d = match.groups()
        return f"{int(y):04d}-{int(m):02d}-{int(d):02d}"
    return "2024-01-01"

def clean_text(text):
    if not text:
        return ""
    cleaned = re.sub(r"\s+", " ", str(text)).strip()
    return cleaned

def clean_name(name):
    n = clean_text(name)
    if n.endswith(".") and len(n) > 3 and not n[-3] == " ":
        n = n[:-1].strip()
    return n

def run_import():
    print(f"Reading excel from: {EXCEL_PATH}")
    if not os.path.exists(EXCEL_PATH):
        print(f"Error: Excel file does not exist at {EXCEL_PATH}")
        sys.exit(1)

    with zipfile.ZipFile(EXCEL_PATH, "r") as z:
        content = z.read("xl/worksheets/sheet1.xml")
        root = ET.fromstring(content)
        ns = {"ns": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
        rows = root.findall(".//ns:row", ns)
        print(f"Total raw rows in XML: {len(rows)}")

        course_keywords = [
            "ISO", "LEAN", "SIX SIGMA", "AUDITOR", "TQM", "5S", "AS9100",
            "OHSAS", "HACCP", "GMP", "FOOD SAFETY", "HEALTH & SAFETY",
            "QUALITY", "MANAGEMENT", "AUDITING", "LEAD IMPLEMENTER",
            "INTERNAL AUDITOR", "BELT", "AWARENESS"
        ]

        records = []
        seen_certs = {}
        anomalies_handled = 0

        for idx, r in enumerate(rows[2:]):
            cells = []
            for c in r.findall("ns:c", ns):
                val = ""
                t = c.find("ns:is/ns:t", ns)
                if t is not None:
                    val = t.text
                else:
                    v = c.find("ns:v", ns)
                    if v is not None:
                        val = v.text
                cells.append(clean_text(val or ""))

            while len(cells) < 7:
                cells.append("")

            cert_num = clean_text(cells[0])
            col1 = clean_text(cells[1])
            col2 = clean_text(cells[2])
            col3 = clean_text(cells[3])
            col4 = clean_text(cells[4])
            col5 = clean_text(cells[5])

            if not cert_num or "sort($" in cert_num or "sort($" in col1 or cert_num.lower() == "certificate number":
                anomalies_handled += 1
                continue

            status_raw = col3
            date_raw = col4
            validity_raw = col5

            # CASE A: Shifted row where standard is missing and status in col2
            if col2 in ("Active", "Inactive", "Suspended", "ACTIVE", "active"):
                status_raw = col2
                date_raw = col3
                validity_raw = col4
                student_name = clean_name(col1)
                course_name = "Professional Certification"
                anomalies_handled += 1

            # CASE B: Status omitted and numeric date is in col3
            elif col3.isdigit() and not col4.isdigit():
                date_raw = col3
                status_raw = "Active"
                validity_raw = col4
                student_name = clean_name(col1)
                course_name = clean_text(col2) or "Professional Certification"
                anomalies_handled += 1

            # CASE C: Inverted row where col1 is Course Name and col2 is Student Name
            elif any(k in col1.upper() for k in course_keywords) and not any(k in col2.upper() for k in course_keywords):
                student_name = clean_name(col2)
                course_name = clean_text(col1)
                anomalies_handled += 1

            # CASE D: Standard row
            else:
                student_name = clean_name(col1)
                course_name = clean_text(col2) or "Professional Certification"

            issue_date = parse_excel_date(date_raw)
            completion_date = issue_date

            status_norm = "valid"
            verification_status = "Valid"
            if str(status_raw).strip().lower() in ("suspended", "inactive", "revoked"):
                status_norm = "revoked"
                verification_status = "Revoked"

            validity = "Lifetime"
            if validity_raw and any(k in validity_raw.lower() for k in ("year", "/", "-", "202", "203")):
                validity = validity_raw

            record = {
                "id": len(records) + 1,
                "certificate_number": cert_num,
                "student_name": student_name,
                "candidate_email": "",
                "course_name": course_name,
                "training_type": "Corporate Training",
                "issuing_organization": "Broadbeach Academy",
                "authorized_signatory": "Dr. K. R. Sharma, Academic Director",
                "issue_date": issue_date,
                "completion_date": completion_date,
                "status": status_norm,
                "verification_status": verification_status,
                "validity": validity,
                "notes": "Imported from corporate certificate master registry",
                "history": [
                    {
                        "action": "imported",
                        "timestamp": f"{issue_date}T00:00:00Z",
                        "performed_by": "System Administrator",
                        "details": "Batch imported into Master Certificate Registry."
                    }
                ]
            }

            if cert_num in seen_certs:
                prev_idx = seen_certs[cert_num]
                prev_rec = records[prev_idx]
                if len(course_name) > len(prev_rec["course_name"]):
                    record["id"] = prev_rec["id"]
                    records[prev_idx] = record
                continue

            seen_certs[cert_num] = len(records)
            records.append(record)

    for idx, rec in enumerate(records):
        rec["id"] = idx + 1

    print(f"Successfully processed {len(records)} unique certificate records.")
    print(f"Anomalies & layout variations handled: {anomalies_handled}")

    # 1. Compact list for JavaScript bundle
    compact_records = []
    for r in records:
        compact_records.append({
            "id": r["id"],
            "certificate_number": r["certificate_number"],
            "student_name": r["student_name"],
            "course_name": r["course_name"],
            "issue_date": r["issue_date"],
            "status": r["status"],
            "validity": r["validity"]
        })

    print(f"Writing JavaScript registry to: {JS_OUTPUT_PATH}")
    os.makedirs(os.path.dirname(JS_OUTPUT_PATH), exist_ok=True)
    with open(JS_OUTPUT_PATH, "w", encoding="utf-8") as f:
        f.write("/**\n")
        f.write(" * Broadbeach Academy — Authoritative Manual Certificate Registry\n")
        f.write(f" * Total Records: {len(records)}\n")
        f.write(f" * Synchronized: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write(" */\n\n")
        f.write("export function normalizeCertRecord(raw) {\n")
        f.write("  if (!raw) return null;\n")
        f.write("  return {\n")
        f.write("    id: raw.id || 0,\n")
        f.write("    certificate_number: raw.certificate_number || '',\n")
        f.write("    student_name: raw.student_name || 'Broadbeach Learner',\n")
        f.write("    candidate_email: raw.candidate_email || '',\n")
        f.write("    course_name: raw.course_name || 'Professional Certification',\n")
        f.write("    training_type: raw.training_type || 'Corporate Training',\n")
        f.write("    issuing_organization: raw.issuing_organization || 'Broadbeach Academy',\n")
        f.write("    authorized_signatory: raw.authorized_signatory || 'Dr. K. R. Sharma, Academic Director',\n")
        f.write("    issue_date: raw.issue_date || '2024-01-01',\n")
        f.write("    completion_date: raw.completion_date || raw.issue_date || '2024-01-01',\n")
        f.write("    status: raw.status || 'valid',\n")
        f.write("    verification_status: raw.status === 'revoked' ? 'Revoked' : 'Valid',\n")
        f.write("    validity: raw.validity || 'Lifetime',\n")
        f.write("    notes: raw.notes || 'Imported from corporate certificate master registry',\n")
        f.write("    history: raw.history || [\n")
        f.write("      {\n")
        f.write("        action: 'imported',\n")
        f.write("        timestamp: `${raw.issue_date || '2024-01-01'}T00:00:00Z`,\n")
        f.write("        performed_by: 'System Administrator',\n")
        f.write("        details: 'Batch imported into Master Certificate Registry.'\n")
        f.write("      }\n")
        f.write("    ]\n")
        f.write("  };\n")
        f.write("}\n\n")
        f.write("const RAW_REGISTRY = ")
        json.dump(compact_records, f, separators=(',', ':'), ensure_ascii=False)
        f.write(";\n\n")
        f.write("export const MANUAL_CERTIFICATES_REGISTRY = RAW_REGISTRY.map(normalizeCertRecord);\n\n")
        f.write("export default MANUAL_CERTIFICATES_REGISTRY;\n")

    # 2. Update admin_store.json
    print(f"Updating admin store at: {ADMIN_STORE_PATH}")
    if os.path.exists(ADMIN_STORE_PATH):
        with open(ADMIN_STORE_PATH, "r", encoding="utf-8") as f:
            admin_store = json.load(f)
    else:
        admin_store = {}

    admin_store["manual_certificates"] = records
    with open(ADMIN_STORE_PATH, "w", encoding="utf-8") as f:
        json.dump(admin_store, f, indent=2, ensure_ascii=False)

    # 3. Write SQL migration script
    print(f"Generating SQL migration at: {SQL_OUTPUT_PATH}")
    os.makedirs(os.path.dirname(SQL_OUTPUT_PATH), exist_ok=True)
    with open(SQL_OUTPUT_PATH, "w", encoding="utf-8") as f:
        f.write("-- Broadbeach Academy — Manual Certificates Import Migration\n")
        f.write(f"-- Generated: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write(f"-- Total Records: {len(records)}\n\n")
        f.write("CREATE TABLE IF NOT EXISTS `manual_certificates` (\n")
        f.write("  `id` INT AUTO_INCREMENT PRIMARY KEY,\n")
        f.write("  `certificate_number` VARCHAR(64) NOT NULL UNIQUE,\n")
        f.write("  `student_name` VARCHAR(255) NOT NULL,\n")
        f.write("  `candidate_email` VARCHAR(255) NULL,\n")
        f.write("  `course_name` VARCHAR(255) NOT NULL,\n")
        f.write("  `issue_date` DATE NOT NULL,\n")
        f.write("  `completion_date` DATE NULL,\n")
        f.write("  `issuing_organization` VARCHAR(255) NOT NULL DEFAULT 'Broadbeach Academy',\n")
        f.write("  `signatory` VARCHAR(255) NOT NULL DEFAULT 'Dr. K. R. Sharma, Academic Director',\n")
        f.write("  `training_type` VARCHAR(100) NOT NULL DEFAULT 'Corporate Training',\n")
        f.write("  `additional_reference` VARCHAR(255) NULL,\n")
        f.write("  `status` ENUM('valid', 'revoked', 'deleted') NOT NULL DEFAULT 'valid',\n")
        f.write("  `verification_status` VARCHAR(50) NOT NULL DEFAULT 'Valid',\n")
        f.write("  `revocation_reason` TEXT NULL,\n")
        f.write("  `revoked_at` DATETIME NULL,\n")
        f.write("  `revoked_by` VARCHAR(191) NULL,\n")
        f.write("  `created_by` VARCHAR(191) NOT NULL DEFAULT 'System Admin',\n")
        f.write("  `correction_history` JSON NULL,\n")
        f.write("  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,\n")
        f.write("  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\n")
        f.write("  INDEX `idx_mcert_num` (`certificate_number`),\n")
        f.write("  INDEX `idx_mcert_student` (`student_name`),\n")
        f.write("  INDEX `idx_mcert_status` (`status`)\n")
        f.write(") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n")

        chunk_size = 200
        for i in range(0, len(records), chunk_size):
            chunk = records[i:i + chunk_size]
            f.write("INSERT INTO `manual_certificates` (`certificate_number`, `student_name`, `candidate_email`, `course_name`, `issue_date`, `completion_date`, `issuing_organization`, `signatory`, `training_type`, `status`, `verification_status`) VALUES\n")
            val_lines = []
            for item in chunk:
                cert_num = item["certificate_number"].replace("'", "''")
                s_name = item["student_name"].replace("'", "''")
                c_name = item["course_name"].replace("'", "''")
                i_date = item["issue_date"]
                comp_date = item["completion_date"]
                org = item["issuing_organization"].replace("'", "''")
                sig = item["authorized_signatory"].replace("'", "''")
                t_type = item["training_type"].replace("'", "''")
                stat = item["status"]
                v_stat = item["verification_status"]
                val_lines.append(f"('{cert_num}', '{s_name}', '', '{c_name}', '{i_date}', '{comp_date}', '{org}', '{sig}', '{t_type}', '{stat}', '{v_stat}')")
            f.write(",\n".join(val_lines))
            f.write("\nON DUPLICATE KEY UPDATE `student_name`=VALUES(`student_name`), `course_name`=VALUES(`course_name`), `issue_date`=VALUES(`issue_date`), `status`=VALUES(`status`);\n\n")

    print("All tasks completed successfully!")

if __name__ == "__main__":
    run_import()
