// filepath: server.js
import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import PDFDocument from "pdfkit";
import crypto from "crypto";
import https from 'https';
import http from 'http';
import { URL } from 'url';
// import OpenAI from "openai"; // Uncomment for real OpenAI integration

const app = express();
const upload = multer({ dest: "uploads/" }); // Configure multer for file uploads
// const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY }); // Initialize OpenAI client

app.use(bodyParser.json());
app.use('/uploads', express.static('uploads')); // Serve uploaded images

// Helper function to fetch an image from a URL into a buffer
const fetchImage = (urlString) => new Promise((resolve, reject) => {
  try {
    const url = new URL(urlString);
    const get = url.protocol === 'https:' ? https.get : http.get;

    const options = {
      headers: {
        // Add a user-agent to prevent 403 Forbidden errors from some servers
        'User-Agent': 'Mozilla/5.0 (Node.js) Rail-QR-App/1.0',
      }
    };

    const request = get(url, options, (response) => {
      // Handle redirects
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        const redirectUrl = new URL(response.headers.location, urlString).href;
        return fetchImage(redirectUrl).then(resolve).catch(reject);
      }
      if (response.statusCode < 200 || response.statusCode >= 300) {
        return reject(new Error(`Failed to fetch image from ${urlString}, status code: ${response.statusCode}`));
      }
      const data = [];
      response.on('data', (chunk) => data.push(chunk));
      response.on('end', () => resolve(Buffer.concat(data)));
    });
    request.on('error', (err) => reject(new Error(`Failed to fetch image from ${urlString}: ${err.message}`)));
  } catch (err) {
    reject(new Error(`Invalid URL: ${urlString}`));
    }
});

// In-memory store for reports
let reports = [];
let installations = []; // New in-memory store for installations

// Mock user data for password reset demo. In a real app, this would be a database.
const mockUsers = [
    { username: 'admin', email: 'admin@example.com', password: 'admin123' },
    { username: 'inspector', email: 'inspector@example.com', password: 'inspect123' },
    { username: 'vendor', email: 'vendor@example.com', password: 'vendor123' },
];

// Mock part details for AI summary generation
const partDetails = {
  "RC001": "Part: High-tensile Rail Clip (RC001). Manufacturer: SteelTech Industries. Batch: ST-2024-A123. Status: Installed on 2024-03-15 at Track Section A-12. Condition: Good. Warranty: Valid until 2026-01-15.",
  "PD045": "Part: Standard Rail Pad (PD045). Manufacturer: FlexGuard Corp. Batch: FG-2024-B045. Status: In storage at Warehouse A. Condition: New. Warranty: Valid until 2029-02-10.",
  "QR987": "Part: Track Fastener (QR987). Manufacturer: SecureRail Inc. Batch: SRI-2023-X789. Status: Installed on 2023-11-01 at Track Section B-5. Condition: Minor wear. Warranty: Valid until 2025-11-01.",
};

// This new endpoint replaces /api/save-scan and /api/ai-summary
app.post("/api/scan-report", upload.single("photo"), async (req, res) => {
  try {
    const { qrData } = req.body;
    const photo = req.file ? req.file.path.replace(/\\/g, '/') : null;

    console.log("Received scan report request for:", qrData);
    if (photo) {
      console.log("Photo evidence attached:", photo);
    }

    // --- Mock AI Summary Generation (for demo) ---
    const summary = partDetails[qrData] || `No detailed information available for part ${qrData}. The scan has been logged successfully.`;
    // Simulate network delay for AI response
    await new Promise(resolve => setTimeout(resolve, 1200));
    // --- End of Mock AI Summary ---

    // Save to DB (demo: in memory)
    const record = {
      id: reports.length + 1,
      qrData,
      summary,
      photo,
      timestamp: new Date(),
    };
    reports.push(record);
    console.log("Saved record:", record);

    res.json({ summary, photo, id: record.id });
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ error: "Failed to generate report" });
  }
});

app.post("/api/installations", upload.single("photo"), async (req, res) => {
  try {
    const installationData = req.body;
    const photo = req.file ? req.file.path.replace(/\\/g, '/') : null;

    // Always generate a new UID for the installation record.
    const partName = installationData.partName || 'PART';
    const prefix = partName.split(' ').map(w => w[0]).join('').toUpperCase() || 'P';
    const nextId = (installations.length + 1).toString().padStart(4, '0');
    installationData.uid = `${prefix}-${nextId}`;

    console.log("Received installation data:", installationData);
    if (photo) {
      console.log("Photo evidence attached:", photo);
    }

    const record = {
      id: installations.length + 1,
      ...installationData,
      photo,
      timestamp: new Date(),
    };
    installations.push(record);
    console.log("Saved installation record:", record);

    res.json({ message: "Installation saved successfully", record });
  } catch (error) {
    console.error("Error saving installation:", error);
    res.status(500).json({ error: "Failed to save installation" });
  }
});

app.post("/api/generate-report", async (req, res) => {
  try {
    const { uid } = req.body;
    if (!uid) {
      return res.status(400).json({ error: "UID is required" });
    }

    // Find installation data for the UID
    const installation = installations.find(inst => inst.uid === uid);
    if (!installation) {
      return res.status(404).json({ error: `No installation found for UID: ${uid}` });
    }

    // --- Mock AI Summary Generation (for demo) ---
    const summary = `This is an AI-generated summary for part ${uid}.
Part Name: ${installation.partName} (${installation.partSubType || 'N/A'})
Installed at: ${installation.address} on ${installation.dateOfCommencement}.
Manufacturer No: ${installation.manufacturerNumber}.
Batch No: ${installation.batch}.
Warranty: ${installation.warranty || 'N/A'}.
This part appears to be in good condition based on the installation data.`;
    // --- End of Mock AI Summary ---

    const record = {
      id: reports.length + 1,
      qrData: uid,
      summary,
      photo: installation.photo, // use photo from installation
      timestamp: new Date(),
    };
    reports.push(record);
    console.log("Saved report record:", record);

    res.json({ id: record.id, title: `AI Summary for ${uid}`, content: record.summary, photo: record.photo });
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ error: "Failed to generate report" });
  }
});

app.get('/api/parts/:uid', (req, res) => {
  const { uid } = req.params;
  const installation = installations.find(inst => inst.uid === uid);

  if (!installation) {
    return res.status(404).json({ error: 'Part not found' });
  }

  // Map the installation data to the format expected by the QRScan page
  const partData = {
    uid: installation.uid,
    type: installation.partSubType ? `${installation.partName} (${installation.partSubType})` : installation.partName,
    manufacturer: installation.manufacturerNumber || '(Not specified)',
    batch: installation.batch || '(Not specified)',
    mfgDate: installation.dateOfSupply,
    status: 'Installed', // Assuming everything in 'installations' is installed
    warranty: installation.warranty,
    sleeper: {
      location: installation.address,
      uid: 'N/A', // Not captured in form
      batch: 'N/A', // Not captured in form
    },
    installHistory: [
      {
        date: installation.dateOfCommencement,
        installer: 'N/A', // Not captured in form
        location: installation.address,
        reason: 'New Installation',
      },
    ],
    specifications: {
      'QR Code': installation.qrCode || 'N/A',
      'Manufacturer No.': installation.manufacturerNumber,
      'Vendor No.': installation.vendorNumber,
      'Date of Supply': installation.dateOfSupply,
    },
  };

  res.json(partData);
});

app.get('/api/dashboard-stats', (req, res) => {
  const totalParts = installations.length;
  const activeInstallations = installations.length; // Assuming all are active for now
  const pendingReplacements = 0; // No data for this yet
  const systemEfficiency = '100%'; // No data for this yet

  const stats = [
    {
      title: "Total Parts",
      value: totalParts,
      description: "All tracked components",
      icon: 'Package',
      trend: { value: totalParts, isPositive: true }
    },
    {
      title: "Active Installations",
      value: activeInstallations,
      description: "Currently installed",
      icon: 'Wrench',
      trend: { value: activeInstallations, isPositive: true }
    },
    {
      title: "Pending Replacements",
      value: pendingReplacements,
      description: "Require attention",
      icon: 'AlertTriangle',
      trend: { value: 0, isPositive: false }
    },
    {
      title: "System Efficiency",
      value: systemEfficiency,
      description: "Overall performance",
      icon: 'TrendingUp',
      trend: { value: 0, isPositive: true }
    }
  ];

  res.json(stats);
});

app.get('/api/recent-activity', (req, res) => {
  const recentActivities = installations.slice(-5).reverse().map(inst => ({
    id: inst.id,
    action: "Part Installed",
    details: `${inst.partName || 'Unknown Part'} (${inst.uid}) installed at ${inst.address}`,
    timestamp: new Date(inst.timestamp).toLocaleString(),
    type: 'install'
  }));
  res.json(recentActivities);
});

app.get("/api/installations", (req, res) => {
  // Return installations in reverse chronological order
  res.json([...installations].reverse());
});

app.get("/api/reports", (req, res) => {
  // Return reports in reverse chronological order
  res.json([...reports].reverse());
});

app.get("/api/download-report/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const report = reports.find((r) => r.id === id);

  if (!report) {
    return res.status(404).send("Report not found");
  }

  // Find the corresponding installation data for the report
  const installation = installations.find(inst => inst.uid === report.qrData);

  // Set headers for PDF download
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=material-inspection-report-${report.qrData}.pdf`);

  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(res);

  try {
    // --- PDF Header ---
    const emblemUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/150px-Emblem_of_India.svg.png';
    const socialUrl = 'https://thumbs.dreamstime.com/b/logo-icon-vector-logos-icons-set-social-media-flat-banner-vectors-svg-eps-jpg-jpeg-paper-texture-glossy-emblem-wallpaper-210441921.jpg';

    const [emblemBuffer, socialBuffer] = await Promise.all([
      fetchImage(emblemUrl),
      fetchImage(socialUrl)
    ]);

    const imageWidth = 50;
    const pageTop = doc.page.margins.top;

    // Logos side by side
    doc.image(emblemBuffer, doc.page.margins.left, pageTop, { width: imageWidth });
    doc.image(socialBuffer, doc.page.width - doc.page.margins.right - imageWidth, pageTop, { width: imageWidth });

    // --- Title ---
    doc.fontSize(16).font('Helvetica-Bold').text('GOVERNMENT OF INDIA', { align: 'center' });
    doc.fontSize(16).font('Helvetica-Bold').text('MINISTRY OF RAILWAYS', { align: 'center' });
    doc.moveDown(1);

    doc.moveDown(1.5);

    // --- Report Title ---
    doc.fontSize(18).font('Helvetica-Bold').text('MATERIAL INSPECTION REPORT', { align: 'center' });
    doc.moveDown(1.5);

    // --- Subject ---
    doc.fontSize(12).font('Helvetica-Bold').text(`Subject: ${installation?.partName || 'N/A'}`);
    doc.moveDown(1);

    // --- Inspection Summary ---
    doc.fontSize(12).font('Helvetica-Bold').text('Inspection Summary:');
    doc.moveDown(0.5);

    const summaryData = {
        'Product': installation?.partName,
        'Specification': installation?.partSubType,
        'Vendor Lot Number': installation?.batch,
        'Date of Supply': installation?.dateOfSupply,
        'Warranty Period': installation?.warranty,
        'Inspection Date': new Date(report.timestamp).toLocaleDateString(),
    };

    doc.font('Helvetica');
    for (const [label, value] of Object.entries(summaryData)) {
        doc.text(`- ${label}: ${value || 'N/A'}`);
    }
    doc.moveDown(1);

    doc.moveDown(1);

    // --- Verification Notes ---
    doc.fontSize(12).font('Helvetica-Bold').text('Verification Notes:');
    doc.moveDown(8); // Leave space for remarks

    doc.moveDown(1);

    // --- Authorized By ---
    doc.fontSize(12).font('Helvetica-Bold').text('Authorized By:');
    doc.moveDown(3);
    doc.text('(Inspector’s Name, Designation, and Signature)');

    // Add photo if it exists
    if (report.photo) {
      try {
        doc.addPage().fontSize(14).font('Helvetica-Bold').text("Attached Photo:", { underline: true }).moveDown();
        doc.image(report.photo, { fit: [400, 300], align: 'center' });
      } catch (err) {
        console.warn("Could not attach photo to PDF:", err.message);
        doc.text("Could not load attached photo.", { color: 'red' });
      }
    }
  } catch (err) {
    console.error("Could not generate PDF:", err.message);
    // Fallback to a simple text error in the PDF
    doc.fontSize(12).text('An error occurred while generating the report: ' + err.message);
  }

  doc.end();
});

app.listen(8080, () => {
  console.log("Server running on http://localhost:8080");
});