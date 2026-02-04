import express from "express";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
import OpenAI from "openai";

// Load .env using dotenv
dotenv.config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
const upload = multer({ storage: multer.memoryStorage() });

// OpenAI client using env variable. Currently not in use. Dotenv is used instead.
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// OpenAI params
const MODEL = "gpt-4.1-mini";
const TEXT_PROMPT = "Describe this image clearly.";

// /describe route
app.post("/describe", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Bad Request. No image uploaded" });

    const imageBuffer = req.file.buffer;
    const mimeType = req.file.mimetype;
    const base64Image = imageBuffer.toString("base64");

    const response = await openai.responses.create({
      model: MODEL,
      input: [
        {
          role: "user",
          content: [
            { type: "input_text", text: TEXT_PROMPT },
            {
              type: "input_image",
              image_url: `data:${mimeType};base64,${base64Image}`
            }
          ]
        }
      ]
    }); 

    
    const description =
      response.output_text ||
      response.output?.[0]?.content?.[0]?.text ||
      "No description returned";
  
    //const description = "This is a placeholder description for the uploaded image.This is a placeholder description for the uploaded image.This is a placeholder description for the uploaded image.This is a placeholder description for the uploaded image.This is a placeholder description for the uploaded image.This is a placeholder description for the uploaded image.This is a placeholder description for the uploaded image.This is a placeholder description for the uploaded image.This is a placeholder description for the uploaded image.This is a placeholder description for the uploaded image.This is a placeholder description for the uploaded image.This is a placeholder description for the uploaded image.This is a placeholder description for the uploaded image.This is a placeholder description for the uploaded image.This is a placeholder description for the uploaded image.This is a placeholder description for the uploaded image.This is a placeholder description for the uploaded image.This is a placeholder description for the uploaded image.This is a placeholder description for the uploaded image.This is a placeholder description for the uploaded image.This is a placeholder description for the uploaded image.This is a placeholder description for the uploaded image.This is a placeholder description for the uploaded image.This is a placeholder description for the uploaded image.This is a placeholder description for the uploaded image.This is a placeholder description for the uploaded image.This is a placeholder description for the uploaded image.This is a placeholder description for the uploaded image.This is a placeholder description for the uploaded image.This is a placeholder description for the uploaded image.This is a placeholder description for the uploaded image.This is a placeholder description for the uploaded image.This is a placeholder description for the uploaded image.This is a placeholder description for the uploaded image.";

    res.json({ description });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error. Failed to analyze image" });
  }
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
