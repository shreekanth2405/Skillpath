const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy_key");

const analyzeJobFit = async (userProfile, jobDescription) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const prompt = `
            Analyze the fit between this user and this job.
            
            USER PROFILE:
            Skills: ${userProfile.skills.join(', ')}
            Preferences: ${userProfile.preferredRole.join(', ')}
            Location: ${userProfile.preferredLocation.join(', ')}
            
            JOB DESCRIPTION:
            ${jobDescription}
            
            Provide a JSON response with:
            {
                "score": number (0-100),
                "matchingSkills": string[],
                "missingSkills": string[],
                "suitabilityReason": string,
                "careerGrowthPrediction": string
            }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Extract JSON from response (handling potential markdown)
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        return null;
    } catch (err) {
        console.error("Gemini Analysis Error:", err);
        return null;
    }
};

module.exports = { analyzeJobFit };
