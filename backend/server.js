import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { askGemini } from "./gemini.js";

dotenv.config();
console.log("GEMINI KEY VALUE:", process.env.GEMINI_API_KEY);


const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  const reply = await askGemini(req.body.prompt);
  res.json({ reply });
});

app.listen(3000, () => console.log("Server running on 3000"));
