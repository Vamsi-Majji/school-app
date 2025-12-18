const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const certificatesFilePath = path.join(__dirname, '../data/certificates.json');

// Helper function to read certificates data
const readCertificates = () => {
  try {
    const data = fs.readFileSync(certificatesFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading certificates data:', error);
    return [];
  }
};

// Helper function to write certificates data
const writeCertificates = (data) => {
  try {
    fs.writeFileSync(certificatesFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing certificates data:', error);
  }
};

// Blockchain hash generation (simulated)
const generateBlockchainHash = (certificateData) => {
  const dataString = JSON.stringify(certificateData);
  return crypto.createHash('sha256').update(dataString).digest('hex');
};

// Certificate verification function
const verifyCertificate = (certificateId, providedHash = null) => {
  const certificates = readCertificates();
  const certificate = certificates.find(cert => cert.certificateId === certificateId);

  if (!certificate) {
    return { valid: false, reason: 'Certificate not found' };
  }

  if (certificate.status !== 'active') {
    return { valid: false, reason: 'Certificate is not active' };
  }

  // Verify blockchain hash
  const currentHash = generateBlockchainHash({
    certificateId: certificate.certificateId,
    studentId: certificate.studentId,
    studentName: certificate.studentName,
    degree: certificate.degree,
    schoolId: certificate.schoolId,
    graduationDate: certificate.graduationDate,
    gpa: certificate.gpa,
    courses: certificate.courses
  });

  const hashValid = currentHash === certificate.blockchainHash;

  if (providedHash && providedHash !== certificate.blockchainHash) {
    return { valid: false, reason: 'Provided hash does not match certificate hash' };
  }

  if (!hashValid) {
    return { valid: false, reason: 'Certificate data has been tampered with' };
  }

  // Update verification count
  certificate.verificationCount = (certificate.verificationCount || 0) + 1;
  certificate.lastVerified = new Date().toISOString();
  writeCertificates(certificates);

  return {
    valid: true,
    certificate: {
      certificateId: certificate.certificateId,
      studentName: certificate.studentName,
      degree: certificate.degree,
      schoolName: certificate.schoolName,
      graduationDate: certificate.graduationDate,
      gpa: certificate.gpa,
      honors: certificate.honors,
      issuedBy: certificate.issuedBy,
      issuedDate: certificate.issuedDate,
      blockchainHash: certificate.blockchainHash,
      verificationUrl: certificate.verificationUrl
    },
    verificationCount: certificate.verificationCount,
    lastVerified: certificate.lastVerified
  };
};

// GET /api/certificates - Get all certificates (admin only)
router.get('/', (req, res) => {
  try {
    const certificates = readCertificates();
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching certificates' });
  }
});

// GET /api/certificates/:certificateId - Get certificate by ID
router.get('/:certificateId', (req, res) => {
  try {
    const certificates = readCertificates();
    const certificate = certificates.find(cert => cert.certificateId === req.params.certificateId);
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    res.json(certificate);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching certificate' });
  }
});

// POST /api/certificates/verify - Verify certificate authenticity
router.post('/verify', (req, res) => {
  try {
    const { certificateId, blockchainHash } = req.body;

    if (!certificateId) {
      return res.status(400).json({ message: 'Certificate ID is required' });
    }

    const verification = verifyCertificate(certificateId, blockchainHash);

    if (verification.valid) {
      res.json({
        success: true,
        message: 'Certificate verified successfully',
        data: verification
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Certificate verification failed',
        reason: verification.reason
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error verifying certificate' });
  }
});

// GET /api/certificates/verify/:certificateId - Quick verification endpoint
router.get('/verify/:certificateId', (req, res) => {
  try {
    const verification = verifyCertificate(req.params.certificateId);

    if (verification.valid) {
      res.json({
        success: true,
        message: 'Certificate is valid and authentic',
        data: verification
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Certificate verification failed',
        reason: verification.reason
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error verifying certificate' });
  }
});

// POST /api/certificates - Issue new certificate
router.post('/', (req, res) => {
  try {
    const certificates = readCertificates();
    const certificateData = req.body;

    // Generate unique certificate ID
    const certificateId = `CERT-${new Date().getFullYear()}-${String(certificates.length + 1).padStart(3, '0')}`;

    // Generate blockchain hash
    const blockchainHash = generateBlockchainHash({
      certificateId,
      studentId: certificateData.studentId,
      studentName: certificateData.studentName,
      degree: certificateData.degree,
      schoolId: certificateData.schoolId,
      graduationDate: certificateData.graduationDate,
      gpa: certificateData.gpa,
      courses: certificateData.courses
    });

    const newCertificate = {
      id: certificates.length > 0 ? Math.max(...certificates.map(c => c.id)) + 1 : 1,
      certificateId,
      ...certificateData,
      blockchainHash,
      verificationUrl: `https://verify.edu/cert/${certificateId}`,
      issuedBy: certificateData.schoolName || 'Educational Institution',
      issuedDate: new Date().toISOString(),
      status: 'active',
      verificationCount: 0,
      createdAt: new Date().toISOString()
    };

    certificates.push(newCertificate);
    writeCertificates(certificates);

    res.status(201).json({
      success: true,
      message: 'Certificate issued successfully',
      certificate: newCertificate
    });
  } catch (error) {
    res.status(500).json({ message: 'Error issuing certificate' });
  }
});

// PUT /api/certificates/:certificateId/revoke - Revoke certificate
router.put('/:certificateId/revoke', (req, res) => {
  try {
    const certificates = readCertificates();
    const index = certificates.findIndex(cert => cert.certificateId === req.params.certificateId);

    if (index === -1) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    certificates[index].status = 'revoked';
    certificates[index].revokedDate = new Date().toISOString();
    certificates[index].revokedReason = req.body.reason || 'Administrative revocation';

    writeCertificates(certificates);

    res.json({
      success: true,
      message: 'Certificate revoked successfully',
      certificate: certificates[index]
    });
  } catch (error) {
    res.status(500).json({ message: 'Error revoking certificate' });
  }
});

// GET /api/certificates/student/:studentId - Get certificates for a student
router.get('/student/:studentId', (req, res) => {
  try {
    const certificates = readCertificates();
    const studentCertificates = certificates.filter(cert =>
      cert.studentId === parseInt(req.params.studentId)
    );

    res.json(studentCertificates);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student certificates' });
  }
});

// GET /api/certificates/stats - Get certificate statistics
router.get('/stats/overview', (req, res) => {
  try {
    const certificates = readCertificates();

    const stats = {
      totalCertificates: certificates.length,
      activeCertificates: certificates.filter(c => c.status === 'active').length,
      revokedCertificates: certificates.filter(c => c.status === 'revoked').length,
      totalVerifications: certificates.reduce((sum, c) => sum + (c.verificationCount || 0), 0),
      averageGPA: certificates.reduce((sum, c) => sum + c.gpa, 0) / certificates.length,
      topDegrees: [...new Set(certificates.map(c => c.degree))],
      recentIssuances: certificates
        .filter(c => new Date(c.issuedDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
        .length,
      generatedAt: new Date().toISOString()
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error generating certificate statistics' });
  }
});

module.exports = router;
