const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const alumniFilePath = path.join(__dirname, '../data/alumni.json');

// Helper function to read alumni data
const readAlumni = () => {
  try {
    const data = fs.readFileSync(alumniFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading alumni data:', error);
    return [];
  }
};

// Helper function to write alumni data
const writeAlumni = (data) => {
  try {
    fs.writeFileSync(alumniFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing alumni data:', error);
  }
};

// AI-powered mentorship matching algorithm
const findMentorshipMatches = (studentSkills, studentInterests, alumniData) => {
  return alumniData
    .filter(alumni => alumni.mentorshipAvailable)
    .map(alumni => {
      let matchScore = 0;
      const matchingSkills = alumni.skills.filter(skill =>
        studentSkills.some(studentSkill =>
          studentSkill.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(studentSkill.toLowerCase())
        )
      );
      matchScore += matchingSkills.length * 20;

      // Career path relevance
      if (alumni.careerPath.some(position =>
        studentInterests.some(interest =>
          position.position.toLowerCase().includes(interest.toLowerCase())
        )
      )) {
        matchScore += 30;
      }

      // Recent graduates get higher priority
      const yearsSinceGraduation = new Date().getFullYear() - alumni.graduationYear;
      if (yearsSinceGraduation <= 5) matchScore += 15;
      else if (yearsSinceGraduation <= 10) matchScore += 10;

      return {
        ...alumni,
        matchScore,
        matchingSkills,
        yearsOfExperience: yearsSinceGraduation
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5); // Return top 5 matches
};

// GET /api/alumni - Get all alumni
router.get('/', (req, res) => {
  try {
    const alumni = readAlumni();
    res.json(alumni);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching alumni data' });
  }
});

// GET /api/alumni/:id - Get alumni by ID
router.get('/:id', (req, res) => {
  try {
    const alumni = readAlumni();
    const alumnus = alumni.find(a => a.id === parseInt(req.params.id));
    if (!alumnus) {
      return res.status(404).json({ message: 'Alumni not found' });
    }
    res.json(alumnus);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching alumni' });
  }
});

// GET /api/alumni/search - Search alumni by various criteria
router.get('/search/:query', (req, res) => {
  try {
    const query = req.params.query.toLowerCase();
    const alumni = readAlumni();

    const results = alumni.filter(alumnus =>
      alumnus.currentPosition.toLowerCase().includes(query) ||
      alumnus.company.toLowerCase().includes(query) ||
      alumnus.degree.toLowerCase().includes(query) ||
      alumnus.location.toLowerCase().includes(query) ||
      alumnus.skills.some(skill => skill.toLowerCase().includes(query))
    );

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error searching alumni' });
  }
});

// POST /api/alumni/match - AI-powered mentorship matching
router.post('/match', (req, res) => {
  try {
    const { studentSkills, studentInterests } = req.body;
    const alumni = readAlumni();

    const matches = findMentorshipMatches(studentSkills, studentInterests, alumni);

    res.json({
      matches,
      totalMatches: matches.length,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ message: 'Error generating mentorship matches' });
  }
});

// POST /api/alumni - Create new alumni profile
router.post('/', (req, res) => {
  try {
    const alumni = readAlumni();
    const newAlumni = {
      id: alumni.length > 0 ? Math.max(...alumni.map(a => a.id)) + 1 : 1,
      ...req.body,
      createdAt: new Date().toISOString()
    };
    alumni.push(newAlumni);
    writeAlumni(alumni);
    res.status(201).json(newAlumni);
  } catch (error) {
    res.status(500).json({ message: 'Error creating alumni profile' });
  }
});

// PUT /api/alumni/:id - Update alumni profile
router.put('/:id', (req, res) => {
  try {
    const alumni = readAlumni();
    const index = alumni.findIndex(a => a.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).json({ message: 'Alumni not found' });
    }
    alumni[index] = { ...alumni[index], ...req.body, updatedAt: new Date().toISOString() };
    writeAlumni(alumni);
    res.json(alumni[index]);
  } catch (error) {
    res.status(500).json({ message: 'Error updating alumni profile' });
  }
});

// POST /api/alumni/:id/donate - Record donation
router.post('/:id/donate', (req, res) => {
  try {
    const { amount, purpose } = req.body;
    const alumni = readAlumni();
    const index = alumni.findIndex(a => a.id === parseInt(req.params.id));

    if (index === -1) {
      return res.status(404).json({ message: 'Alumni not found' });
    }

    const donation = {
      year: new Date().getFullYear(),
      amount: parseFloat(amount),
      purpose,
      date: new Date().toISOString()
    };

    if (!alumni[index].donationHistory) {
      alumni[index].donationHistory = [];
    }

    alumni[index].donationHistory.push(donation);
    writeAlumni(alumni);

    res.json({
      message: 'Donation recorded successfully',
      donation
    });
  } catch (error) {
    res.status(500).json({ message: 'Error recording donation' });
  }
});

// GET /api/alumni/stats/overview - Get alumni statistics
router.get('/stats/overview', (req, res) => {
  try {
    const alumni = readAlumni();

    const stats = {
      totalAlumni: alumni.length,
      averageGraduationYear: Math.round(alumni.reduce((sum, a) => sum + a.graduationYear, 0) / alumni.length),
      topIndustries: [...new Set(alumni.map(a => a.company))].slice(0, 5),
      mentorshipAvailable: alumni.filter(a => a.mentorshipAvailable).length,
      totalDonations: alumni.reduce((sum, a) =>
        sum + (a.donationHistory ? a.donationHistory.reduce((dSum, d) => dSum + d.amount, 0) : 0), 0
      ),
      topSkills: alumni.flatMap(a => a.skills)
        .reduce((acc, skill) => {
          acc[skill] = (acc[skill] || 0) + 1;
          return acc;
        }, {}),
      generatedAt: new Date().toISOString()
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error generating alumni statistics' });
  }
});

module.exports = router;
