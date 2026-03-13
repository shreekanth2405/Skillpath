const prisma = require('../prismaClient');
const bcrypt = require('bcryptjs');

async function main() {
  const accounts = [
    { name: 'Admin User', email: 'admin@admin.com', password: 'admin123', role: 'admin' },
    { name: 'Developer User', email: 'dev@skillpath.ai', password: 'dev123456', role: 'developer' },
    { name: 'Student User', email: 'student@skillpath.ai', password: 'student123', role: 'student' },
  ];

  console.log('Seeding demo accounts...');

  for (const acc of accounts) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(acc.password, salt);

    await prisma.user.upsert({
      where: { email: acc.email },
      update: {
        password: hashedPassword,
        role: acc.role,
      },
      create: {
        name: acc.name,
        email: acc.email,
        password: hashedPassword,
        role: acc.role,
        xp: 1500,
        level: 5,
        coins: 500,
      },
    });
  }

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
