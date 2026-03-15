require('dotenv').config();
const prisma = require('./prismaClient');
const bcrypt = require('bcryptjs');

const seedDemos = async () => {
    try {
        const salt = await bcrypt.genSalt(10);
        
        // Seed Developer
        const devPass = await bcrypt.hash('dev123456', salt);
        await prisma.user.upsert({
            where: { email: 'dev@skillpath.ai' },
            update: { password: devPass, role: 'developer' },
            create: {
                name: 'Developer User',
                email: 'dev@skillpath.ai',
                password: devPass,
                role: 'developer'
            }
        });

        // Seed Student
        const studentPass = await bcrypt.hash('student123', salt);
        await prisma.user.upsert({
            where: { email: 'student@skillpath.ai' },
            update: { password: studentPass, role: 'student' },
            create: {
                name: 'Student User',
                email: 'student@skillpath.ai',
                password: studentPass,
                role: 'student'
            }
        });

        console.log('Demo users seeded successfully!');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDemos();
