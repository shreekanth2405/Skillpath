const prisma = require('./prismaClient');

const labs = [
    {
        roomNumber: 1,
        title: 'HTML Structure Foundation',
        description: 'Create a basic HTML document structure.',
        domain: 'Web Development',
        difficulty: 'Beginner',
        instructions: '1. Add a DOCTYPE html.\n2. Add html, head, and body tags.\n3. Add a title in the head.',
        xpReward: 100,
        starterCode: '<!-- Build your HTML here -->',
    },
    {
        roomNumber: 2,
        title: 'CSS Box Model',
        description: 'Understand padding, borders, and margins.',
        domain: 'Web Development',
        difficulty: 'Beginner',
        instructions: '1. Create a div with 20px padding.\n2. Add a 5px solid blue border.\n3. Add 10px margin.',
        xpReward: 100,
        starterCode: '<div class="box"></div>\n\n<style>\n.box {\n  /* Add styles here */\n}\n</style>',
    },
    {
        roomNumber: 3,
        title: 'Python Variable Assignment',
        description: 'Initialize variables of different types.',
        domain: 'Algorithms',
        difficulty: 'Beginner',
        instructions: '1. Assign an integer to a.\n2. Assign a string to b.\n3. Assign a list to c.',
        xpReward: 100,
        starterCode: '# Variables here\na = 0\nb = ""\nc = []',
    },
    {
        roomNumber: 4,
        title: 'Linear Regression Setup',
        description: 'Prepare data for a simple linear regression model.',
        domain: 'Machine Learning',
        difficulty: 'Intermediate',
        instructions: '1. Import numpy.\n2. Create arrays X and y.\n3. Calculate means.',
        xpReward: 150,
        starterCode: 'import numpy as np\n\ndef prepare_data():\n    # Your code here\n    pass',
    },
    {
        roomNumber: 5,
        title: 'SQL Select Basics',
        description: 'Fetch specific columns from a users table.',
        domain: 'Databases',
        difficulty: 'Beginner',
        instructions: '1. Select name and email.\n2. Filter by age > 18.',
        xpReward: 100,
        starterCode: '-- SQL Query here\nSELECT * FROM users;',
    }
];

const domains = [
    'Algorithms', 'Data Structures', 'Web Development', 'Machine Learning',
    'Artificial Intelligence', 'Cybersecurity', 'Databases', 'Operating Systems',
    'Computer Networks', 'Mathematics', 'Competitive Programming', 'System Design'
];

async function main() {
    console.log('Seeding 120 labs...');

    for (let i = 1; i <= 120; i++) {
        const domain = domains[(i - 1) % domains.length];
        const difficulty = i <= 40 ? 'Beginner' : i <= 80 ? 'Intermediate' : 'Advanced';

        await prisma.lab.upsert({
            where: { roomNumber: i },
            update: {},
            create: {
                roomNumber: i,
                title: `${domain} Challenge ${Math.ceil(i / domains.length)}`,
                description: `Master the core concepts of ${domain} in Room ${i}.`,
                domain: domain,
                difficulty: difficulty,
                instructions: `Complete the following tasks to unlock the next room in the ${domain} track.\n1. Task Alpha\n2. Task Beta\n3. Task Gamma`,
                xpReward: 100 + (Math.floor(i / 10) * 10),
                starterCode: i % 2 === 0 ? '// Write your code here\n' : '# Write your code here\n',
                tasks: [
                    { id: 1, title: 'Basics Initialization', description: 'Setup variables.' },
                    { id: 2, title: 'Logic Implementation', description: 'Write the core logic.' },
                    { id: 3, title: 'Edge Case Handling', description: 'Handle nulls or empty inputs.' }
                ]
            }
        });
    }

    console.log('120 Labs seeded successfully!');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
