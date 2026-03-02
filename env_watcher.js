const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log("👀 Env Watcher Activated! 👀");
console.log("I am watching your .env files. Once you paste your real keys, I will automatically sync the database.");

const backendEnv = path.join(__dirname, 'backend', '.env');
const frontendEnv = path.join(__dirname, 'frontend', '.env');

let isSyncing = false;

function isConfigured() {
    if (!fs.existsSync(backendEnv) || !fs.existsSync(frontendEnv)) return false;

    const bContent = fs.readFileSync(backendEnv, 'utf8');
    const fContent = fs.readFileSync(frontendEnv, 'utf8');

    const bPlaceholders = ['[password]', '[project-ref]'];
    const fPlaceholders = ['your-project-id', 'your-anon-key-here'];

    const bOk = !bPlaceholders.some(p => bContent.includes(p));
    const fOk = !fPlaceholders.some(p => fContent.includes(p));

    return bOk && fOk;
}

function sync() {
    if (isSyncing) return;
    isSyncing = true;
    console.log("\n🚀 REAL KEYS DETECTED! Syncing database...");
    try {
        execSync('cd backend && npx prisma db push', { stdio: 'inherit' });
        console.log("\n✅ Database Synced! Refresh your browser to see the GREEN status.");
        process.exit(0);
    } catch (e) {
        console.error("\n❌ Database Sync Failed. Check if your DATABASE_URL password is correct.");
        isSyncing = false;
    }
}

// Initial check
if (isConfigured()) sync();

// Watch for changes
fs.watchFile(backendEnv, (curr, prev) => {
    console.log("📝 Backend .env changed...");
    if (isConfigured()) sync();
});

fs.watchFile(frontendEnv, (curr, prev) => {
    console.log("📝 Frontend .env changed...");
    if (isConfigured()) sync();
});
