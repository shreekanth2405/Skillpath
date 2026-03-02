const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: 'postgresql://postgres:cDsQypxqNvIIsqPbJPNxalJJPZbaGeUk@shortline.proxy.rlwy.net:20291/railway',
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    try {
        console.log('Attempting to connect...');
        await prisma.$connect();
        console.log('Connected successfully!');

        console.log('Running test query...');
        const result = await prisma.$queryRaw`SELECT 1 as test`;
        console.log('Query result:', result);
    } catch (e) {
        console.error('Connection failed:');
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
