const prisma = require('./prismaClient');
const bcrypt = require('bcryptjs');

async function seedAdmin() {
    try {
        const email = 'admin@admin.com';
        const password = 'admin123';

        let user = await prisma.user.findUnique({ where: { email } });

        if (user) {
            console.log("Admin user already exists. Updating password to 'admin123'...");
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            await prisma.user.update({
                where: { email },
                data: { password: hashedPassword }
            });
            console.log("Admin password updated successfully.");
        } else {
            console.log("Admin user not found. Creating...");
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            await prisma.user.create({
                data: {
                    name: 'Admin User',
                    email,
                    password: hashedPassword,
                    role: 'admin'
                }
            });
            console.log("Admin user created successfully.");
        }

    } catch (err) {
        console.error("Error seeding admin:", err);
    } finally {
        // don't disconnect if server is running on same file, but here we run standalone
        process.exit(0);
    }
}

seedAdmin();
