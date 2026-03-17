const prisma = require('./prismaClient');

const domains = [
    { name: "Artificial Intelligence", categories: ["Machine Learning", "NLP", "Computer Vision", "Generative AI"] },
    { name: "Cybersecurity", categories: ["Network Security", "Ethical Hacking", "Cryptography", "Identity Management"] },
    { name: "FinTech", categories: ["Banking Apps", "Trading Platforms", "Smart Contracts", "Fraud Detection"] },
    { name: "Web Development", categories: ["Full Stack", "SaaS", "Real-time Apps", "E-commerce"] },
    { name: "Mobile Development", categories: ["iOS", "Android", "Cross-platform", "Fitness Apps"] },
    { name: "Data Science", categories: ["Data Visualization", "Predictive Analytics", "Big Data", "Data Mining"] },
    { name: "Cloud & DevOps", categories: ["AWS/Azure/GCP", "CI/CD", "Kubernetes", "Serverless"] },
    { name: "Internet of Things", categories: ["Smart Home", "Industrial IoT", "Health Monitoring", "Wearables"] },
    { name: "Blockchain & Web3", categories: ["dApps", "DeFi", "NFT Marketplace", "DAO"] },
    { name: "Game Development", categories: ["2D Games", "3D Games", "Multiplayer", "Physics Engines"] },
    { name: "HealthTech", categories: ["Patient Portals", "Medical Imaging", "Telemedicine", "Genomics"] },
    { name: "EdTech", categories: ["LMS", "Gamified Learning", "Virtual Classrooms", "Study Portals"] },
    { name: "E-commerce", categories: ["Marketplaces", "Inventory Management", "Payment Gateways", "Personalization"] },
    { name: "AR/VR", categories: ["Virtual Tours", "Interactive Training", "AR Filters", "Simulations"] },
    { name: "Robotics", categories: ["Control Systems", "Computer Vision for Robots", "Path Planning", "ROS"] }
];

const difficulties = ["Beginner", "Intermediate", "Advanced", "Expert"];
const toolsList = {
    "Artificial Intelligence": ["Python", "TensorFlow", "PyTorch", "Scikit-Learn", "OpenCV", "NLTK", "Gemini API", "OpenAI API"],
    "Cybersecurity": ["Wireshark", "Metasploit", "Kali Linux", "Burp Suite", "Nmap", "OWASP ZAP", "Python", "Snort"],
    "FinTech": ["Node.js", "React", "Python", "SQL", "Solidity", "Stripe API", "Plaid API", "PostgreSQL"],
    "Web Development": ["React", "Vue", "Next.js", "Express", "Node.js", "MongoDB", "PostgreSQL", "Tailwind CSS"],
    "Mobile Development": ["Flutter", "React Native", "Swift", "Kotlin", "Firebase", "SQLite", "Dart"],
    "Data Science": ["Python", "Pandas", "NumPy", "Matplotlib", "Seaborn", "Tableau", "PowerBI", "R"],
    "Cloud & DevOps": ["Docker", "Kubernetes", "Jenkins", "Terraform", "AWS", "Azure", "GitHub Actions", "Ansible"],
    "Internet of Things": ["Arduino", "Raspberry Pi", "Espressif", "MQTT", "Node-RED", "C++", "Python"],
    "Blockchain & Web3": ["Solidity", "Hardhat", "Truffle", "Ethers.js", "Web3.js", "Metamask", "Polkadot"],
    "Game Development": ["Unity", "Unreal Engine", "C#", "C++", "Phaser", "Blender", "Godot"],
    "HealthTech": ["FHIR", "HL7", "React", "Django", "PostgreSQL", "AWS HealthLake", "Python"],
    "EdTech": ["Moodle", "Canvas API", "React", "Firebase", "Node.js", "WebRTC", "Socket.io"],
    "E-commerce": ["Shopify API", "Strapi", "Headless CMS", "Stripe", "Next.js", "Redis", "Elasticsearch"],
    "AR/VR": ["Unity", "ARCore", "ARKit", "Oculus SDK", "A-Frame", "Three.js", "WebXR"],
    "Robotics": ["ROS2", "Gazebo", "Python", "C++", "Arduino", "SLAM", "Navigation Stack"]
};

async function generateProjects() {
    console.log("Generating 150 Project Ideas...");
    const projects = [];

    for (const domain of domains) {
        for (let i = 1; i <= 10; i++) {
            const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
            const category = domain.categories[Math.floor(Math.random() * domain.categories.length)];
            const id = `${domain.name.substring(0, 3)}-${i}`.toUpperCase();
            
            const title = `${domain.name} ${category} Project #${i}: ${id}`;
            const description = `A comprehensive ${difficulty.toLowerCase()} level project focused on ${category} within the ${domain.name} domain. This project aims to challenge your architectural and implementation skills.`;
            
            const tools = [...new Set([
                toolsList[domain.name][Math.floor(Math.random() * toolsList[domain.name].length)],
                toolsList[domain.name][Math.floor(Math.random() * toolsList[domain.name].length)],
                toolsList[domain.name][Math.floor(Math.random() * toolsList[domain.name].length)]
            ])];

            const outcomes = [
                `Mastery of ${category}`,
                `Industry-level experience in ${domain.name}`,
                "Problem-solving in complex architectures"
            ];

            const steps = [
                { step: "Requirement Gathering", instructions: "Understand the core objectives and define the system architecture." },
                { step: "Environment Setup", instructions: `Install ${tools.join(", ")} and configure the development environment.` },
                { step: "Core Implementation", instructions: "Develop the primary logic and database interactions." },
                { step: "Testing & Validation", instructions: "Run unit tests and verify against edge cases." },
                { step: "Deployment", instructions: "Host the application or service on a production-ready platform." }
            ];

            projects.push({
                title: `${domain.name} ${category} Solution - ${i}`,
                description: description,
                domain: domain.name,
                difficulty: difficulty,
                tools: tools,
                outcomes: outcomes,
                steps: steps,
                expectedOutput: `A fully functional ${category} system with documentation.`,
                xpReward: (difficulties.indexOf(difficulty) + 1) * 300
            });
        }
    }

    try {
        console.log(`Starting database seed for ${projects.length} projects...`);
        // await prisma.userProject.deleteMany(); // Optional: Clear previous relations
        // await prisma.project.deleteMany();     // Optional: Clear previous projects

        for (const p of projects) {
            await prisma.project.create({
                data: p
            });
        }
        console.log(`Successfully added ${projects.length} projects across ${domains.length} domains.`);
    } catch (err) {
        console.error("Error seeding projects:", err);
    } finally {
        await prisma.$disconnect();
    }
}

generateProjects();
