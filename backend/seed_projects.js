const prisma = require('./prismaClient');

const seedProjects = async () => {
    console.log("Seeding Project-Based Learning Engine...");

    try {
        await prisma.userProject.deleteMany();
        await prisma.project.deleteMany();

        const mockProjects = [
            {
                title: "AI Personal Portfolio with Gemini Integration",
                description: "Build a high-end personal portfolio that uses AI to analyze visitor queries and suggest your projects based on their needs.",
                domain: "AI & Web Development",
                difficulty: "Intermediate",
                tools: ["React", "Node.js", "Gemini API", "Framer Motion"],
                outcomes: ["Full Stack Development", "AI Integration", "Modern CSS"],
                steps: [
                    { step: "Project Setup", instructions: "Initialize a Vite React project and setup an Express backend." },
                    { step: "UI Design", instructions: "Design a dark-themed portfolio using Vanilla CSS and Framer Motion for premium animations." },
                    { step: "AI Integration", instructions: "Connect the Gemini API to the backend to create a chat interface." },
                    { step: "Deployment", instructions: "Deploy the app on Vercel or Netlify." }
                ],
                expectedOutput: "A live URL of a portfolio with a working AI chatbot.",
                xpReward: 800
            },
            {
                title: "Secure IoT Smart Home Dashboard",
                description: "Create a secure dashboard for controlling IoT devices with real-time data visualization and intrusion detection alerts.",
                domain: "IoT & Cybersecurity",
                difficulty: "Advanced",
                tools: ["Python", "MQTT", "React", "Socket.io", "Shield.js"],
                outcomes: ["IoT Protocols", "Real-time Data", "Security Protocols"],
                steps: [
                    { step: "MQTT Broker Setup", instructions: "Set up an MQTT broker (like Mosquitto) for device communication." },
                    { step: "Backend API", instructions: "Build a Node.js API to process device data and check for security threats." },
                    { step: "Frontend Visualization", instructions: "Create a React dashboard with Recharts for real-time sensor data." }
                ],
                expectedOutput: "A functional dashboard showing simulated device data and alerts.",
                xpReward: 1200
            },
            {
                title: "Automated Threat Detection System",
                description: "Develop a system that parses server logs and uses machine learning to identify potential SQL injection or DDoS attacks.",
                domain: "Cybersecurity",
                difficulty: "Expert",
                tools: ["Python", "Scikit-Learn", "FastAPI", "PostgreSQL"],
                outcomes: ["Machine Learning", "Network Security", "Anomaly Detection"],
                steps: [
                    { step: "Data Collection", instructions: "Collect and preprocess standard web server logs." },
                    { step: "Model Training", instructions: "Train a Random Forest classifier on labeled threat data." },
                    { step: "Real-time Analyzer", instructions: "Build a FastAPI endpoint to receive logs and return threat probability." }
                ],
                expectedOutput: "A Python service that classifies log entry threats.",
                xpReward: 1500
            }
        ];

        for (const p of mockProjects) {
            await prisma.project.create({
                data: p
            });
        }

        console.log("Successfully seeded 3 complex projects.");

    } catch (err) {
        console.error("Project Seeding Error:", err);
    } finally {
        await prisma.$disconnect();
    }
};

seedProjects();
