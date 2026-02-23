import { genAI } from './gemini';

/**
 * ChallengeGenerator Service
 * Dynamically generates coding challenges (React, Flutter, JS, etc.) using Gemini.
 */
export const generateChallengeTask = async (roomTopic, difficulty, taskIndex) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `You are a Senior Technical Content Creator for a gamified coding platform.
        Create a coding challenge task for a room focused on: ${roomTopic}.
        Difficulty: ${difficulty}.
        Task Number in Sequence: ${taskIndex + 1}.

        Requirements:
        1. Context: The task must be a "debugging" or "broken implementation" scenario.
        2. Framework/Language: If the topic is React or Flutter, use those. Otherwise, default to JavaScript.
        3. Title: A short, thematic title.
        4. Description: A clear explanation of what is broken and what needs to be fixed.
        5. Initial Code: Provide the BROKEN code that the user needs to fix.
        6. Validation Tests: Provide an array of strings representing JavaScript boolean expressions that must evaluate to true after the user fixes the code (e.g., "result === 42").
        7. Hints: Provide 3-5 cryptic but helpful hints.

        Return strictly ONLY a JSON object in this format:
        {
          "title": "...",
          "description": "...",
          "initialCode": "...",
          "tests": ["...", "..."],
          "hints": ["...", "..."]
        }`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text().replace(/```json|```/g, "").trim();
        return JSON.parse(responseText);
    } catch (error) {
        console.error("Error generating challenge task:", error);
        return null;
    }
};
