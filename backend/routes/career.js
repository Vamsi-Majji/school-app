const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const careerAssessmentsFilePath = path.join(__dirname, '../data/career_assessments.json');
const careerPathsFilePath = path.join(__dirname, '../data/career_paths.json');
const jobMarketFilePath = path.join(__dirname, '../data/job_market.json');

// Helper functions
const readCareerAssessments = () => {
  try {
    const data = fs.readFileSync(careerAssessmentsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading career assessments data:', error);
    return [];
  }
};

const writeCareerAssessments = (data) => {
  try {
    fs.writeFileSync(careerAssessmentsFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing career assessments data:', error);
  }
};

const readCareerPaths = () => {
  try {
    const data = fs.readFileSync(careerPathsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading career paths data:', error);
    return [];
  }
};

const readJobMarket = () => {
  try {
    const data = fs.readFileSync(jobMarketFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading job market data:', error);
    return [];
  }
};

// AI-powered career recommendation algorithm
const generateCareerRecommendations = (studentProfile, assessments) => {
  const { skills, interests, grades, personality, careerGoals } = studentProfile;

  // Career field mapping based on interests and skills
  const careerMappings = {
    technology: {
      interests: ['programming', 'computers', 'math', 'problem-solving'],
      skills: ['coding', 'logic', 'analytical thinking'],
      careers: ['Software Engineer', 'Data Scientist', 'AI Engineer', 'Cybersecurity Analyst']
    },
    healthcare: {
      interests: ['helping others', 'biology', 'chemistry', 'psychology'],
      skills: ['empathy', 'scientific knowledge', 'communication'],
      careers: ['Doctor', 'Nurse', 'Pharmacist', 'Physical Therapist']
    },
    business: {
      interests: ['leadership', 'finance', 'marketing', 'management'],
      skills: ['communication', 'strategic thinking', 'organization'],
      careers: ['Business Analyst', 'Marketing Manager', 'Entrepreneur', 'Financial Advisor']
    },
    creative: {
      interests: ['art', 'design', 'writing', 'music'],
      skills: ['creativity', 'visual thinking', 'expression'],
      careers: ['Graphic Designer', 'Content Creator', 'UX Designer', 'Journalist']
    },
    science: {
      interests: ['research', 'environment', 'physics', 'chemistry'],
      skills: ['research', 'analytical thinking', 'experimentation'],
      careers: ['Research Scientist', 'Environmental Engineer', 'Chemist', 'Professor']
    }
  };

  let recommendations = [];
  let matchScores = {};

  // Calculate match scores for each career field
  Object.entries(careerMappings).forEach(([field, mapping]) => {
    let score = 0;

    // Interest matching
    const interestMatches = mapping.interests.filter(interest =>
      interests.some(studentInterest =>
        studentInterest.toLowerCase().includes(interest.toLowerCase())
      )
    );
    score += interestMatches.length * 20;

    // Skills matching
    const skillMatches = mapping.skills.filter(skill =>
      skills.some(studentSkill =>
        studentSkill.toLowerCase().includes(skill.toLowerCase())
      )
    );
    score += skillMatches.length * 25;

    // Grade-based adjustment
    const avgGrade = grades.reduce((sum, grade) => sum + grade.score, 0) / grades.length;
    if (avgGrade >= 85) score += 15;
    else if (avgGrade >= 70) score += 10;

    // Personality alignment
    if (personality && mapping.personalityTraits) {
      const personalityMatches = mapping.personalityTraits.filter(trait =>
        personality.some(pTrait => pTrait.toLowerCase().includes(trait.toLowerCase()))
      );
      score += personalityMatches.length * 10;
    }

    matchScores[field] = Math.min(100, score);
  });

  // Generate top recommendations
  const sortedFields = Object.entries(matchScores)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  sortedFields.forEach(([field, score]) => {
    const mapping = careerMappings[field];
    recommendations.push({
      field,
      score,
      recommendedCareers: mapping.careers.slice(0, 2),
      reasoning: `Based on your ${mapping.interests.join(', ')} interests and ${mapping.skills.join(', ')} skills`,
      nextSteps: [
        `Take courses in ${field}`,
        `Join ${field} clubs or organizations`,
        `Seek internships in ${field} companies`,
        `Network with ${field} professionals`
      ]
    });
  });

  return {
    recommendations,
    assessmentDate: new Date().toISOString(),
    confidence: Math.round((recommendations[0]?.score || 0) * 0.8) / 100
  };
};

// Career Assessment Routes

// POST /api/career/assess - Create new career assessment
router.post('/assess', (req, res) => {
  try {
    const { studentId, responses, skills, interests, personality, careerGoals } = req.body;
    const assessments = readCareerAssessments();

    // Calculate assessment scores
    const scores = {
      technical: responses.filter(r => r.category === 'technical').reduce((sum, r) => sum + r.score, 0),
      creative: responses.filter(r => r.category === 'creative').reduce((sum, r) => sum + r.score, 0),
      social: responses.filter(r => r.category === 'social').reduce((sum, r) => sum + r.score, 0),
      analytical: responses.filter(r => r.category === 'analytical').reduce((sum, r) => sum + r.score, 0),
      leadership: responses.filter(r => r.category === 'leadership').reduce((sum, r) => sum + r.score, 0)
    };

    const newAssessment = {
      id: assessments.length > 0 ? Math.max(...assessments.map(a => a.id)) + 1 : 1,
      studentId: parseInt(studentId),
      responses,
      scores,
      skills: skills || [],
      interests: interests || [],
      personality: personality || [],
      careerGoals: careerGoals || '',
      completedAt: new Date().toISOString(),
      status: 'completed'
    };

    assessments.push(newAssessment);
    writeCareerAssessments(assessments);

    res.status(201).json({
      success: true,
      message: 'Career assessment completed',
      assessment: newAssessment
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating career assessment' });
  }
});

// GET /api/career/assess/:studentId - Get student's career assessment
router.get('/assess/:studentId', (req, res) => {
  try {
    const assessments = readCareerAssessments();
    const studentAssessments = assessments.filter(a => a.studentId === parseInt(req.params.studentId));

    if (studentAssessments.length === 0) {
      return res.status(404).json({ message: 'No career assessments found for this student' });
    }

    const latestAssessment = studentAssessments.sort((a, b) =>
      new Date(b.completedAt) - new Date(a.completedAt)
    )[0];

    res.json(latestAssessment);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching career assessment' });
  }
});

// POST /api/career/recommend/:studentId - Generate AI career recommendations
router.post('/recommend/:studentId', (req, res) => {
  try {
    const studentId = parseInt(req.params.studentId);
    const assessments = readCareerAssessments();
    const grades = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/grades.json'), 'utf8'));

    const latestAssessment = assessments
      .filter(a => a.studentId === studentId)
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))[0];

    if (!latestAssessment) {
      return res.status(404).json({ message: 'No career assessment found. Please complete assessment first.' });
    }

    const studentGrades = grades.filter(g => g.studentId === studentId);

    const studentProfile = {
      skills: latestAssessment.skills,
      interests: latestAssessment.interests,
      grades: studentGrades,
      personality: latestAssessment.personality,
      careerGoals: latestAssessment.careerGoals
    };

    const recommendations = generateCareerRecommendations(studentProfile, latestAssessment);

    res.json({
      success: true,
      studentId,
      recommendations,
      assessmentId: latestAssessment.id
    });
  } catch (error) {
    res.status(500).json({ message: 'Error generating career recommendations' });
  }
});

// Career Paths Routes

// GET /api/career/paths - Get all career paths
router.get('/paths', (req, res) => {
  try {
    const careerPaths = readCareerPaths();
    res.json(careerPaths);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching career paths' });
  }
});

// GET /api/career/paths/:careerName - Get specific career path details
router.get('/paths/:careerName', (req, res) => {
  try {
    const careerPaths = readCareerPaths();
    const careerPath = careerPaths.find(cp =>
      cp.name.toLowerCase().replace(/\s+/g, '-') === req.params.careerName.toLowerCase()
    );

    if (!careerPath) {
      return res.status(404).json({ message: 'Career path not found' });
    }

    res.json(careerPath);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching career path' });
  }
});

// Job Market Routes

// GET /api/career/jobs - Get job market data
router.get('/jobs', (req, res) => {
  try {
    const jobMarket = readJobMarket();
    const { field, location, experience } = req.query;

    let filteredJobs = jobMarket;

    if (field) {
      filteredJobs = filteredJobs.filter(job =>
        job.field.toLowerCase().includes(field.toLowerCase())
      );
    }

    if (location) {
      filteredJobs = filteredJobs.filter(job =>
        job.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (experience) {
      filteredJobs = filteredJobs.filter(job =>
        job.experienceLevel.toLowerCase() === experience.toLowerCase()
      );
    }

    res.json({
      jobs: filteredJobs,
      total: filteredJobs.length,
      filters: { field, location, experience }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching job market data' });
  }
});

// GET /api/career/jobs/trending - Get trending job skills
router.get('/jobs/trending', (req, res) => {
  try {
    const jobMarket = readJobMarket();

    // Analyze trending skills
    const skillCounts = {};
    jobMarket.forEach(job => {
      job.requiredSkills.forEach(skill => {
        skillCounts[skill] = (skillCounts[skill] || 0) + 1;
      });
    });

    const trendingSkills = Object.entries(skillCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([skill, count]) => ({ skill, demand: count }));

    res.json({
      trendingSkills,
      totalJobsAnalyzed: jobMarket.length,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ message: 'Error analyzing trending skills' });
  }
});

// POST /api/career/mentorship/request - Request career mentorship
router.post('/mentorship/request', (req, res) => {
  try {
    const { studentId, mentorId, careerField, goals, availability } = req.body;

    // In a real app, this would create a mentorship request record
    // For now, we'll simulate the response
    const request = {
      id: Date.now(),
      studentId: parseInt(studentId),
      mentorId: parseInt(mentorId),
      careerField,
      goals,
      availability,
      status: 'pending',
      requestedAt: new Date().toISOString()
    };

    res.status(201).json({
      success: true,
      message: 'Mentorship request submitted successfully',
      request
    });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting mentorship request' });
  }
});

// GET /api/career/dashboard/:studentId - Career counseling dashboard
router.get('/dashboard/:studentId', (req, res) => {
  try {
    const studentId = parseInt(req.params.studentId);
    const assessments = readCareerAssessments();
    const jobMarket = readJobMarket();

    const latestAssessment = assessments
      .filter(a => a.studentId === studentId)
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))[0];

    const dashboard = {
      studentId,
      assessmentCompleted: !!latestAssessment,
      lastAssessmentDate: latestAssessment?.completedAt,
      topSkills: latestAssessment?.skills?.slice(0, 5) || [],
      careerInterests: latestAssessment?.interests || [],
      recommendedJobs: jobMarket
        .filter(job => latestAssessment?.interests?.some(interest =>
          job.field.toLowerCase().includes(interest.toLowerCase())
        ))
        .slice(0, 5),
      nextSteps: [
        'Complete career assessment if not done',
        'Review personalized career recommendations',
        'Explore internship opportunities',
        'Connect with alumni mentors',
        'Update resume and LinkedIn profile'
      ],
      upcomingDeadlines: [
        {
          type: 'internship_application',
          title: 'Summer Internship Applications',
          deadline: '2024-03-15',
          priority: 'high'
        },
        {
          type: 'career_fair',
          title: 'Tech Career Fair',
          deadline: '2024-04-20',
          priority: 'medium'
        }
      ],
      generatedAt: new Date().toISOString()
    };

    res.json(dashboard);
  } catch (error) {
    res.status(500).json({ message: 'Error generating career dashboard' });
  }
});

module.exports = router;
