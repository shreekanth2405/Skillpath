require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

// Create a connection pool for Postgres
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Create the Prisma driver adapter
const adapter = new PrismaPg(pool);

// Initialize PrismaClient with the adapter
const prisma = new PrismaClient({ adapter });

module.exports = prisma;
