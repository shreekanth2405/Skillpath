require('dotenv').config();
const prisma = require('./prismaClient');
const bcrypt = require('bcryptjs');

const seedAdmin = async () => {
    try {
        console.log('Seeding admin user to PostgreSQL via Prisma...');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        // Check if admin exists
        const admin = await prisma.user.findUnique({
            where: { email: 'admin@admin.com' }
        });

        if (admin) {
            console.log('Admin user already exists. Updating...');
            await prisma.user.update({
                where: { email: 'admin@admin.com' },
                data: {
                    password: hashedPassword,
                    role: 'admin'
                }
            });
        } else {
            console.log('Creating admin user...');
            await prisma.user.create({
                data: {
                    name: 'Admin User',
                    email: 'admin@admin.com',
                    password: hashedPassword,
                    role: 'admin'
                }
            });
        }

        console.log('Admin seeded successfully! Login with Email: admin@admin.com and Password: admin123');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedAdmin();

