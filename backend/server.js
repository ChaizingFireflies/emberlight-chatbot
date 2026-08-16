const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");

const app = express();
const port = process.env.PORT || 3000;

// Groq client (reads API key from Render)
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("Emberlight Groq backend is running.");
});

// Chat endpoint
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message || "";

    if (!userMessage) {
      return res.status(400).json({ error: "No message provided." });
    }

    const completion = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [
        {
          role: "system",
          content: `
You are Emberlight, the apothecary assistant for Chaizing Fireflies Nature’s Dispensary.

<<< EMBERLIGHT SYSTEM PROMPT GOES HERE >>>
          `
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      temperature: 0.7,
      max_tokens: 1024
    });

    const reply =
      completion.choices?.[0]?.message?.content ||
      "I’m sorry, I couldn’t generate a response.";

    res.json({ reply });
  } catch (error) {
    console.error("Error in /chat:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

app.listen(port, () => {
  console.log(`Emberlight backend listening on port ${port}`);
});
