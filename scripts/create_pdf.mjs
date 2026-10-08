import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetDir = path.resolve(__dirname, '../public/documents');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const textContent = `BT
/F1 18 Tf
50 750 Td
(AMARNATH SECURITIES LIMITED) Tj
/F1 10 Tf
0 -25 Td
(CIN: L67120GJ1994PLC023254  |  BSE Scrip Code: 538465  |  ISIN: INE745P01010) Tj
0 -20 Td
(Regd. Office: 1/104, Sarthik Complex, Nr. Fun Republic, Satellite Road, Ahmedabad - 380015) Tj
0 -30 Td
/F1 13 Tf
(OFFICIAL STATUTORY DISCLOSURE SPECIMEN & CMS VERIFICATION DOCUMENT) Tj
0 -25 Td
/F1 10 Tf
(Compliance Mandate: SEBI Listing Obligations and Disclosure Requirements Regulations 2015) Tj
0 -20 Td
(This document confirms proper document resolution, PDF viewing and direct download execution.) Tj
0 -30 Td
(------------------------------------------------------------------------------------------------------------------------) Tj
0 -25 Td
(Document Classification: Statutory Compliance Filing) Tj
0 -18 Td
(Dissemination Target: BSE Limited Listing Centre Portal) Tj
0 -18 Td
(Corporate Website: https://amarnathsecuritiesltd.com) Tj
0 -18 Td
(E-mail Contact: contact.amarnathsecurities@gmail.com) Tj
0 -35 Td
(For Amarnath Securities Limited) Tj
0 -20 Td
(Company Secretary & Compliance Officer / Authorized Signatory) Tj
ET`;

const streamBuf = Buffer.from(textContent, 'utf-8');

const objects = [
  '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
  '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
  '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n',
  '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
  '5 0 obj\n<< /Length ' + streamBuf.length + ' >>\nstream\n' + textContent + '\nendstream\nendobj\n'
];

let header = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n';
let offsets = [];
let currentOffset = Buffer.byteLength(header, 'binary');

let body = '';
for (let i = 0; i < objects.length; i++) {
  offsets.push(currentOffset);
  body += objects[i];
  currentOffset += Buffer.byteLength(objects[i], 'utf-8');
}

const startXref = currentOffset;
let xref = 'xref\n0 6\n0000000000 65535 f \n';
for (let i = 0; i < offsets.length; i++) {
  xref += String(offsets[i]).padStart(10, '0') + ' 00000 n \n';
}

let trailer = 'trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n' + startXref + '\n%%EOF\n';
const fullPdf = header + body + xref + trailer;

const outPath = path.join(targetDir, 'amarnath-statutory-disclosure-sample.pdf');
fs.writeFileSync(outPath, fullPdf, 'binary');
console.log('PDF written successfully. Bytes:', fs.statSync(outPath).size);
