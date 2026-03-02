require('dotenv').config();
const app = require('./app');
const prisma = require('./prismaClient');

const PORT = process.env.PORT || 5000;


// Connect to Database
const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log(`PostgreSQL Connected via Prisma`);
    } catch (error) {
        console.error(`Error connecting to db: ${error.message}`);
        process.exit(1);
    }
};

app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    // server.close(() => process.exit(1));
});
