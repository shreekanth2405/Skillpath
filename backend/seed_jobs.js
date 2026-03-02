require('dotenv').config();
const prisma = require('./prismaClient');

const seedJobs = async () => {
    try {
        console.log('Seeding jobs to PostgreSQL via Prisma...');

        // 1. Get the admin user to attach matches to
        const admin = await prisma.user.findUnique({
            where: { email: 'admin@admin.com' }
        });

        if (!admin) {
            console.error('Admin user not found. Please run seed_admin.js first.');
            process.exit(1);
        }

        // 2. Clear existing jobs and matches
        // Order matters due to foreign keys: clear matches first
        await prisma.jobMatch.deleteMany({});
        await prisma.job.deleteMany({});
        console.log('Cleared existing Jobs and JobMatches.');

        // 3. Create mock jobs
        const mockJobs = [
            {
                sourceUrl: 'https://careers.google.com/jobs/results/1',
                sourceDomain: 'google.com',
                companyName: 'Google',
                jobTitle: 'Software Engineer, Early Career',
                location: ['Bangalore', 'Remote'],
                experienceRequired: '0-2 years',
                skillsRequired: ['Python', 'Java', 'Data Structures', 'Algorithms'],
                rawDescription: 'Join our team to build next generation search features...',
                postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
                discoveredAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
            },
            {
                sourceUrl: 'https://careers.microsoft.com/jobs/results/2',
                sourceDomain: 'microsoft.com',
                companyName: 'Microsoft',
                jobTitle: 'Full Stack React Developer',
                location: ['Hyderabad', 'Remote'],
                experienceRequired: '2-5 years',
                skillsRequired: ['React', 'Node.js', 'Azure', 'TypeScript'],
                rawDescription: 'Looking for a passionate React developer for the Teams...',
                postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
                discoveredAt: new Date(),
            },
            {
                sourceUrl: 'https://amazon.jobs/en/jobs/3',
                sourceDomain: 'amazon.jobs',
                companyName: 'Amazon',
                jobTitle: 'Backend Engineer - AWS',
                location: ['Seattle', 'WA'],
                experienceRequired: '3+ years',
                skillsRequired: ['Go', 'Java', 'DynamoDB', 'Distributed Systems'],
                rawDescription: 'Scale AWS infrastructure...',
                postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                discoveredAt: new Date(),
            },
            {
                sourceUrl: 'https://netflix.com/jobs/4',
                sourceDomain: 'netflix.com',
                companyName: 'Netflix',
                jobTitle: 'Senior Data Engineer',
                location: ['Los Gatos', 'CA'],
                experienceRequired: '5+ years',
                skillsRequired: ['Python', 'Spark', 'Kafka', 'SQL'],
                rawDescription: 'Build petabyte scale data pipelines...',
                postedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
                discoveredAt: new Date(),
            }
        ];

        const createdJobs = [];
        for (const jobData of mockJobs) {
            const job = await prisma.job.create({
                data: jobData
            });
            createdJobs.push(job);
        }
        console.log(`Created ${createdJobs.length} Mock Jobs.`);

        // 4. Create Job matches for the admin user
        const mockMatches = [
            {
                userId: admin.id,
                jobId: createdJobs[0].id, // Google
                relevanceScore: 92,
                matchStatus: 'New',
                skillGap: ['Java'],
            },
            {
                userId: admin.id,
                jobId: createdJobs[1].id, // Microsoft
                relevanceScore: 88,
                matchStatus: 'Viewed',
                skillGap: ['Azure', 'TypeScript'],
            },
            {
                userId: admin.id,
                jobId: createdJobs[2].id, // Amazon
                relevanceScore: 75,
                matchStatus: 'Applied',
                skillGap: ['Go', 'DynamoDB'],
            },
            {
                userId: admin.id,
                jobId: createdJobs[3].id, // Netflix
                relevanceScore: 95,
                matchStatus: 'Saved',
                skillGap: ['Spark'],
            }
        ];

        for (const matchData of mockMatches) {
            await prisma.jobMatch.create({
                data: matchData
            });
        }
        console.log(`Created ${mockMatches.length} Job Matches for Admin.`);

        console.log('Job seeding completed successfully!');
        process.exit();

    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedJobs();

