const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log("🛠️ SkillPath Backend Setup Utility 🛠️");

const backendDir = path.join(__dirname, 'backend');

function runCommand(cmd, cwd = backendDir) {
    try {
        console.log(`\n> Running: ${cmd}`);
        execSync(cmd, { stdio: 'inherit', cwd });
    } catch (e) {
        console.error(`\n❌ Command failed: ${cmd}`);
    }
}

// 1. Install dependencies
console.log("\n📦 Installing backend dependencies...");
runCommand('npm install');

// 2. Check for .env and DATABASE_URL
const envPath = path.join(backendDir, '.env');
if (!fs.existsSync(envPath)) {
    console.log("\n⚠️ .env file missing in backend! Creating one...");
    fs.writeFileSync(envPath, `NODE_ENV=development\nPORT=5000\nDATABASE_URL="postgresql://postgres:password@localhost:5432/skillpath_db?schema=public"\nJWT_SECRET=supersecretkey\nJWT_EXPIRE=30d\nFRONTEND_URL=http://localhost:5173\n`);
}

// 3. Run Prisma migrations
console.log("\n🗄️ Syncing database schema...");
// We use db push for development to avoid migration history overhead
runCommand('npx prisma db push');

// 4. Generate Prisma Client
console.log("\n💎 Generating Prisma Client...");
runCommand('npx prisma generate');

// 5. Seed Admin User
console.log("\n👤 Seeding initial admin user...");
runCommand('node seed_admin.js');

console.log("\n✅ Setup Complete! You can now start the backend with 'npm run dev' inside the backend folder.");
console.log("Frontend can be started with 'npm run dev' inside the frontend folder.");
