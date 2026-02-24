/**
 * CAREER AI - MASTER COURSE DATABASE
 * 1000+ Courses | 20+ Departments | 4 Difficulty Levels
 */

const generateCourses = () => {
    const departments = [
        { name: "Computer Science", domain: "Programming & Core", count: 120 },
        { name: "Information Technology", domain: "Infrastructure", count: 80 },
        { name: "AI & Machine Learning", domain: "Intelligence", count: 70 },
        { name: "Data Science", domain: "Analytics", count: 60 },
        { name: "Cybersecurity", domain: "Security", count: 50 },
        { name: "Cloud Computing", domain: "Cloud", count: 50 },
        { name: "Web Development", domain: "Software", count: 60 },
        { name: "Mobile Development", domain: "Software", count: 40 },
        { name: "DevOps", domain: "Automation", count: 40 },
        { name: "Big Data", domain: "Data", count: 30 },
        { name: "IoT", domain: "Hardware/Software", count: 30 },
        { name: "Robotics", domain: "Automation", count: 30 },
        { name: "Blockchain", domain: "Distributed Systems", count: 30 },
        { name: "Quantum Computing", domain: "Advanced Physics", count: 20 },
        { name: "Electronics", domain: "Hardware", count: 40 },
        { name: "Mechanical", domain: "Engineering", count: 40 },
        { name: "Civil", domain: "Construction", count: 40 },
        { name: "Electrical", domain: "Power", count: 40 },
        { name: "Business", domain: "Management", count: 50 },
        { name: "Finance", domain: "Money", count: 30 },
        { name: "Marketing", domain: "Growth", count: 30 },
        { name: "Healthcare", domain: "Medical", count: 30 },
        { name: "Design", domain: "Creative", count: 40 },
        { name: "Humanities", domain: "Social Science", count: 20 }
    ];

    const levels = ["Beginner", "Intermediate", "Advanced", "Expert"];
    const courses = [];

    departments.forEach(dept => {
        for (let i = 1; i <= dept.count; i++) {
            const level = levels[Math.floor(Math.random() * levels.length)];
            courses.push({
                id: `${dept.name.substring(0, 3).toUpperCase()}-${i.toString().padStart(3, '0')}`,
                title: `${dept.name} Module ${i}: ${getModuleTopic(dept.name, i)}`,
                department: dept.name,
                domain: dept.domain,
                level: level,
                xp: level === "Beginner" ? 200 : level === "Intermediate" ? 500 : level === "Advanced" ? 1000 : 2000,
                badges: [`${dept.name} Tier ${Math.ceil(i / 10)}`],
                duration: `${Math.floor(Math.random() * 20) + 5} hours`,
                project: `Real-world ${dept.domain} Implementation #${i}`
            });
        }
    });

    return courses;
};

const getModuleTopic = (dept, index) => {
    const topics = {
        "Computer Science": ["C++ Basics", "DSA", "OpSystems", "Algorithms", "Compiler Design", "Microprocessors"],
        "Web Development": ["HTML/CSS", "React Hooks", "Next.js", "Node.js", "PostgreSQL", "Tailwind"],
        "AI & Machine Learning": ["Linear Algebra", "Neural Networks", "NLP", "GANs", "PyTorch", "TensorFlow"],
        "Cybersecurity": ["Ethical Hacking", "Cryptography", "Network Security", "Pentesting", "Zero Trust"],
        "Business": ["Accounting", "Strategy", "Operations", "HR Management", "Supply Chain"],
        "Design": ["UI/UX Fundamentals", "Typography", "Color Theory", "3D Modeling", "Motion Design"]
    };
    const defaultTopics = ["Foundations", "Advanced Theory", "Professional Practice", "Case Studies", "Optimization"];
    const list = topics[dept] || defaultTopics;
    return list[index % list.length];
};

export const MASTER_COURSES = generateCourses();

export const DEPARTMENTS = [
    "High Technology (CSE, IT, AI, Cloud)",
    "Core Engineering (Mech, Civil, Elec)",
    "Business & Management (Global MBA)",
    "Medical & Healthcare",
    "Design & Arts",
    "Humanities & Law",
    "Finance & Economics"
];

export const XP_RULES = {
    LESSON: 10,
    QUIZ: 20,
    MINI_PROJECT: 50,
    MAJOR_PROJECT: 150,
    COURSE_COMPLETE: 200
};

export const LEVEL_SYSTEM = [
    { level: 1, xp: 0, title: "Trainee" },
    { level: 2, xp: 500, title: "Initiate" },
    { level: 3, xp: 1500, title: "Specialist" },
    { level: 4, xp: 3000, title: "Master" },
    { level: 5, xp: 6000, title: "Elite" }
];
