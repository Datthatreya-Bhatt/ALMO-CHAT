const express = require("express");
const multer = require("multer");
const cors = require("cors");
const Tesseract = require("tesseract.js");
const { OpenAI } = require("openai");
require("dotenv").config();

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/upload", upload.single("document"), async (req, res) => {
  try {
    const result = await Tesseract.recognize(req.file.path, "eng");
    res.json({ text: result.data.text });
  } catch (err) {
    res.status(500).json({ error: "OCR failed", details: err });
  }
});

app.post("/generate-prompt", async (req, res) => {
  const { text } = req.body;
  const basePrompt = `
You are an intelligent document parser. Extract key-value pairs from this OCR text:

"${text}"

Return in JSON format with clear keys and values.
`;

  try {
    const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: basePrompt }],
        temperature: 0.2,
      });
      
      const content = completion.choices[0].message.content;
      
    let results;
    try {
      results = JSON.parse(content);
    } catch (err) {
      results = { error: "Invalid JSON returned by AI", raw: content };
    }

    res.json({
      prompt: basePrompt,
      results,
    });
  } catch (err) {
    res.status(500).json({ error: "AI generation failed", details: err });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
