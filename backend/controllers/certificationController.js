let courseData = [
    // AI & MACHINE LEARNING
    { id: '1', title: 'AWS Certified AI Practitioner', provider: 'Amazon Web Services', category: 'AI & Machine Learning', level: 'Beginner', link: 'https://aws.amazon.com/certification/' },
    { id: '2', title: 'Google Professional Machine Learning Engineer', provider: 'Google Cloud', category: 'AI & Machine Learning', level: 'Expert', link: 'https://cloud.google.com/certification' },
    { id: '3', title: 'Deep Learning Specialization', provider: 'DeepLearning.AI', category: 'AI & Machine Learning', level: 'Intermediate', link: 'https://www.deeplearning.ai/' },
    // CYBER SECURITY
    { id: '4', title: 'CompTIA Security+', provider: 'CompTIA', category: 'Cyber Security', level: 'Beginner', link: 'https://www.comptia.org/' },
    { id: '5', title: 'Certified Ethical Hacker (CEH)', provider: 'EC-Council', category: 'Cyber Security', level: 'Intermediate', link: 'https://www.eccouncil.org/' },
    // CLOUD & DEVOPS
    { id: '6', title: 'AWS Solutions Architect Associate', provider: 'Amazon', category: 'Cloud & DevOps', level: 'Intermediate', link: 'https://aws.amazon.com/certification/' },
    { id: '7', title: 'Azure Fundamentals (AZ-900)', provider: 'Microsoft', category: 'Cloud & DevOps', level: 'Beginner', link: 'https://learn.microsoft.com/' },
    // DEVELOPMENT
    { id: '8', title: 'Oracle Certified Professional: Java SE 17 Developer', provider: 'Oracle', category: 'Development', level: 'Expert', link: 'https://education.oracle.com/' },
    // DATA SCIENCE
    { id: '9', title: 'IBM Data Science Professional Certificate', provider: 'IBM', category: 'Data Science', level: 'Intermediate', link: 'https://www.coursera.org/' },
];

// @desc    Get all certifications
// @route   GET /api/v1/certifications
// @access  Public or Private
exports.getCertifications = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            data: courseData
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Seed mock static certifications on backend
// @route   POST /api/v1/certifications/seed
// @access  Private 
exports.seedCertifications = async (req, res) => {
    try {
        res.status(201).json({
            success: true,
            message: 'Certifications seeded successfully (In-Memory)',
            count: courseData.length
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
