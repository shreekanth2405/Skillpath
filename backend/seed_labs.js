const prisma = require('./prismaClient');

const ACADEMIC_DOMAINS = [
    "Artificial Intelligence", "Quantum Computing", "Cybersecurity", "Cloud Architecture",
    "Full Stack Development", "Data Science", "Blockchain & Web3", "Machine Learning",
    "Embedded Systems", "Internet of Things", "Augmented Reality", "Virtual Reality",
    "Bioinformatics", "Robotics Engineering", "Edge Computing", "5G & 6G Networks",
    "Digital Forensics", "Ethics in AI", "Natural Language Processing", "Computer Vision",
    "Game Development", "Mobile App Dev (iOS)", "Mobile App Dev (Android)", "DevOps & SRE",
    "Distributed Systems", "Microservices", "Database Engineering", "GraphQL & Modern APIs",
    "Rust Programming", "Go Programming", "TypeScript Specialist", "React Ecosystem",
    "Next.js & SSR", "Vue.js & Pinia", "Angular & RXJS", "Python for Data",
    "R Statistics", "Hadoop & Big Data", "Spark & Streaming", "Kafka Architecture",
    "Elasticsearch Specialist", "Kubernetes Ops", "Docker Containerization", "Terraform & IaC",
    "Ansible Automation", "Jenkins & CI/CD", "GitHub Actions", "Serverless (AWS Lambda)",
    "Azure Cloud Services", "GCP Cloud Run", "Prometheus Monitoring", "Grafana Visualization",
    "Splunk Observability", "Penetration Testing", "Malware Analysis", "SOC Analyst",
    "Cloud Security (CCSP)", "Zero Trust Architecture", "Identity Management", "Cryptography",
    "Network Engineering", "SD-WAN Systems", "Wireless Tech", "Satellite Internet (Starlink)",
    "Drone Communications", "Firmware Development", "VLSI Design", "Hardware Security",
    "Smart Grids", "Renewable Energy AI", "FinTech Regulations", "InsurTech AI",
    "HealthTech Interoperability", "Telemedicine Tech", "Precision Agriculture", "Supply Chain Traceability",
    "Logistics Automation", "EdTech Engineering", "Self-Driving Algorithms", "Electric Vehicle Tech",
    "SpaceTech Data", "Computational Chemistry", "Synthetic Biology", "Crispr Sequencing",
    "Neurotechnology", "Brain-Computer Interface", "Deep Tech Entrepreneurship", "Venture Capital Tech",
    "SaaS Multi-tenancy", "Customer Data Platforms", "AdTech Real-time Bidding", "HRTech People Analytics",
    "UAV Flight Control", "Deep Sea Exploration AI", "Civil Engineering Digital Twin", "Smart Cities Architecture",
    "PropTech Engineering", "GovTech Open Data", "LegalTech AI Contracts", "E-commerce Headless tech",
    "Digital Twins (Industrial)", "3D Printing Tech", "Sustainable Manufacturing", "Lean Startup Tech",
    "Growth Hacking Tools", "Product Management (Tech)", "System Design for Scale", "Algorithm Trading",
    "High-Frequency Tech", "DeFi Protocols", "Metabolism AI", "Microbiome Data",
    "Drug Discovery AI", "Clinical Trial Tech", "Wearable Tech (Health)", "Gamified Learning Tech",
    "Online Safety Platforms", "Content Moderation AI", "Web Accessibility (A11y)", "Design Systems (Figma/Code)",
    "Animation Libraries", "Vector Databases (Pinecone)", "LangChain & LLM Apps", "AI Agents Architecture",
    "Autonomous Workflows", "No-Code Platform Engineering", "Low-Code Enterprise Integration", "Open Source Sustainability",
    "Data Privacy (GDPR/CCPA Tech)", "Personal Data Vaults", "Cloud Native Databases", "Post-Quantum Cryptography",
    "Secure Multi-party Computation", "Homomorphic Encryption", "AI Observability", "LLM Fine-tuning",
    "Prompt Engineering Specialist", "Synthetic Data Generation", "Automated Data Labeling", "MLOps Lifecycle",
    "Feature Stores", "Data Mesh & Fabric", "Graph Neural Networks", "Diffusion Models",
    "Transformer Architectures", "Small Language Models (SLM)", "On-device AI", "AI Hardware Acceleration",
    "Carbon Tracking Software", "Circular Economy Tech", "Water Tech (HydroTech)", "Climate Modeling Data",
    "Biodiversity Monitoring AI"
];

async function main() {
    console.log(`Seeding labs for 150+ domains...`);

    // Delete existing to avoid duplicates if roomNumber changes
    await prisma.lab.deleteMany();

    for (let i = 1; i <= ACADEMIC_DOMAINS.length * 2; i++) {
        const domain = ACADEMIC_DOMAINS[(i - 1) % ACADEMIC_DOMAINS.length];
        const difficulty = i % 3 === 0 ? 'Advanced' : i % 2 === 0 ? 'Intermediate' : 'Beginner';

        await prisma.lab.create({
            data: {
                roomNumber: i,
                title: `${domain} Mastery Lab #${Math.ceil(i / ACADEMIC_DOMAINS.length)}`,
                description: `Deep dive into ${domain} with hands-on simulations in Room ${i}.`,
                domain: domain,
                difficulty: difficulty,
                instructions: `1. Study the ${domain} fundamentals.\n2. Implement the core module.\n3. Validate output against high-trend benchmarks.`,
                xpReward: 200 + (i % 10) * 50,
                starterCode: i % 2 === 0 ? '// Initialize Department Logic\n' : '# Initialize Department Logic\n',
                tasks: [
                    { id: 1, title: 'Concept Extraction', description: 'Extract core principles.' },
                    { id: 2, title: 'Dynamic Solving', description: 'Solve the laboratory challenge.' }
                ]
            }
        });
    }

    console.log(`Successfully seeded ${ACADEMIC_DOMAINS.length * 2} labs across 150+ departments.`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
