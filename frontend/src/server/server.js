import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSyCke7DigmjSaDWTtM6R9-4so1GlqUJxGHs");

// Simple Session Memory (In-memory for demo)
const sessions = new Map();

app.post('/emilia/chat', async (req, res) => {
    const { sessionId, text, mode } = req.body;

    if (!text) {
        return res.status(400).json({ error: "Missing transcript" });
    }

    try {
        // System Prompt for Emilia
        const systemPrompt = `You are Emilia, a friendly and professional English Voice Tutor.
        Mode: ${mode || 'Daily Conversation'}
        
        Rules:
        1. Maintain a natural, helpful, and encouraging tone.
        2. If the user makes a grammar mistake, correct it politely in a parenthetical after your natural response.
        3. Keep responses concise (1-3 sentences) to maintain voice-to-voice flow.
        4. Ask engaging follow-up questions.
        5. For "Interview Practice" mode, act as a professional recruiter.
        
        Current user session: ${sessionId}`;

        // Get or create session history
        if (!sessions.has(sessionId)) {
            sessions.set(sessionId, []);
        }
        const history = sessions.get(sessionId);

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: systemPrompt
        });

        // Start chat with history
        const chat = model.startChat({
            history: history,
        });

        const result = await chat.sendMessage(text);
        const responseText = result.response.text();

        // Update local history (last 10 messages)
        history.push({ role: "user", parts: [{ text }] });
        history.push({ role: "model", parts: [{ text: responseText }] });
        if (history.length > 20) history.splice(0, 2);

        // Feedback Logic (Simulated for this endpoint)
        // In a real production app, we would use another AI pass for scores
        const feedback = {
            grammarScore: Math.floor(Math.random() * 20) + 80,
            vocabularyScore: Math.floor(Math.random() * 15) + 85,
            fluencyScore: Math.floor(Math.random() * 10) + 90,
            feedback: "Great job! Your sentence structure is improving."
        };

        res.json({
            responseText,
            feedback,
            sessionId
        });

    } catch (error) {
        console.error("Emilia Backend Error:", error);
        res.status(500).json({ error: "Failed to process Emilia response" });
    }
});

app.listen(port, () => {
    console.log(`Emilia AI Backend listening at http://localhost:${port}`);
});
