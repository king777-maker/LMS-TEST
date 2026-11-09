import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import certificateTemplateImg from "../assets/certificate/certificate-template.png";

/**
 * Renders the official Broadbeach Academy Certificate onto a high-res canvas
 * and returns the canvas element.
 */
export async function renderCertificateCanvas({
  candidateName = "STUDENT",
  courseName = "PROFESSIONAL CERTIFICATION",
  certificateNumber = "BOA10110",
  issueDate = "",
  authorizedSignatory = "Dr. K. R. Sharma, Academic Director",
  issuingOrg = "Broadbeach Academy",
}) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // Load template image
  const img = new Image();
  img.crossOrigin = "anonymous";

  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = certificateTemplateImg;
  });

  const width = img.naturalWidth || 1938;
  const height = img.naturalHeight || 1364;
  canvas.width = width;
  canvas.height = height;

  // 1. Draw base certificate template
  ctx.drawImage(img, 0, 0, width, height);

  // 2. Clean cover of the replaceable regions (pure white)
  ctx.fillStyle = "#ffffff";
  // Candidate Name region
  ctx.fillRect(width * 0.065, height * 0.38, width * 0.55, height * 0.08);
  // Course Name region
  ctx.fillRect(width * 0.065, height * 0.52, width * 0.60, height * 0.12);
  // Certificate ID region
  ctx.fillRect(width * 0.84, height * 0.64, width * 0.15, height * 0.045);
  // Date of Issue region
  ctx.fillRect(width * 0.84, height * 0.68, width * 0.15, height * 0.045);

  // Helper for text fitting
  const drawFittedText = (text, startX, startY, maxWidth, initialSize, fontName, color, weight) => {
    let size = initialSize;
    ctx.fillStyle = color;
    ctx.textBaseline = "top";

    while (size > 14) {
      ctx.font = `${weight} ${size}px ${fontName}`;
      const measured = ctx.measureText(text).width;
      if (measured <= maxWidth) break;
      size -= 2;
    }
    ctx.fillText(text, startX, startY);
  };

  // 1. Candidate Name (uppercase, bold #0d1084)
  const finalCandidateName = (candidateName || "STUDENT").toUpperCase().trim();
  drawFittedText(
    finalCandidateName,
    width * 0.0702,
    height * 0.395,
    width * 0.54,
    52,
    "Arial, sans-serif",
    "#0d1084",
    "bold"
  );

  // 2. Course Name (uppercase, Impact/Arial bold #000000)
  const finalCourseName = (courseName || "PROFESSIONAL CERTIFICATION").toUpperCase().trim();
  drawFittedText(
    finalCourseName,
    width * 0.0702,
    height * 0.536,
    width * 0.58,
    64,
    "Impact, 'Arial Black', Arial, sans-serif",
    "#000000",
    "900"
  );

  // 3. Certificate ID (uppercase bold #000000)
  const finalCertId = (certificateNumber || "BOA10110").toUpperCase().trim();
  drawFittedText(
    finalCertId,
    width * 0.8462,
    height * 0.652,
    width * 0.14,
    30,
    "Arial, sans-serif",
    "#000000",
    "bold"
  );

  // 4. Date of Issue (uppercase bold #000000)
  const finalIssueDate = (issueDate || "09 OCT 2026").toUpperCase().trim();
  drawFittedText(
    finalIssueDate,
    width * 0.8462,
    height * 0.690,
    width * 0.14,
    30,
    "Arial, sans-serif",
    "#000000",
    "bold"
  );

  // 4. Dynamic Verification QR Code
  try {
    const origin = (typeof import.meta !== "undefined" && (import.meta.env?.VITE_APP_URL || import.meta.env?.VITE_SITE_URL))
      ? (import.meta.env.VITE_APP_URL || import.meta.env.VITE_SITE_URL).replace(/\/+$/, "")
      : (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");
    const nameParam = finalCandidateName && finalCandidateName !== "STUDENT" ? `&name=${encodeURIComponent(finalCandidateName)}` : "";
    const verifyUrl = `${origin}/verify-certificate?certificate_number=${encodeURIComponent(finalCertId)}${nameParam}`;
    const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
      width: 280,
      margin: 1,
      color: {
        dark: "#131E4A",
        light: "#ffffff",
      },
    });

    const qrImg = new Image();
    await new Promise((resolve) => {
      qrImg.onload = resolve;
      qrImg.src = qrDataUrl;
    });

    // Draw QR code in designated right QR placeholder
    ctx.drawImage(qrImg, width * 0.835, height * 0.695, width * 0.12, width * 0.12);
  } catch (err) {
    console.warn("QR generation warning:", err.message);
  }

  return canvas;
}

/**
 * Downloads high-resolution PDF for the certificate.
 */
export async function downloadCertificatePDF(certDetails) {
  const canvas = await renderCertificateCanvas(certDetails);
  const imgData = canvas.toDataURL("image/png", 1.0);

  // Landscape A4 PDF
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");

  const cleanCourse = (certDetails.courseName || "")
    .replace(/[^a-zA-Z0-9]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
  const cleanNumber = (certDetails.certificateNumber || "Credential")
    .replace(/[^a-zA-Z0-9-_]/g, "_");
  const fileName = cleanCourse 
    ? `Broadbeach_${cleanCourse}_Certificate_${cleanNumber}.pdf`
    : `Broadbeach_Certificate_${cleanNumber}.pdf`;
  pdf.save(fileName);
  return fileName;
}
