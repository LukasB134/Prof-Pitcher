require("dotenv").config();
const express = require("express");
const { OpenAI} = require("openai");

const app = express();
const PORT = 3001;

const openai = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY,
});

app.use(express.json());

app.post("/api/translate", async (req, res) => {
    const { text, type } = req.body;

    const prompt = 
    type === "genz"
    ? "Übersetze den folgenden Text in ironische Gen-Z Sprache mit Slang und Emojis."
    : "Erkläre den folgenden Text möglichst einfach und verständlich.";

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: prompt }, 
                { role: "user", content: text},
            ],
        });

        res.json({result: response.choices[0].message.content});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Fehler bei GPT: " + error.message});
    }
});

app.listen(PORT, () => {
    console.log(`Backend läuft unter http://localhost:${PORT}`);

});