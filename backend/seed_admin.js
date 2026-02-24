require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected to seed admin...');

        // Check if admin exists
        let admin = await User.findOne({ email: 'admin@admin.com' });

        if (admin) {
            console.log('Admin user already exists. Updating password...');
            // Need to change password and trigger pre-save hook
            admin.password = 'admin123';
            await admin.save();
        } else {
            console.log('Creating admin user...');
            await User.create({
                name: 'Admin User',
                email: 'admin@admin.com',
                password: 'admin123',
                role: 'admin'
            });
        }

        console.log('Admin seeded successfully! Login with Email: admin (or admin@admin.com) and Password: admin123');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedAdmin();
