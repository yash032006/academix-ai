import dotenv from "dotenv";
import { askGemini } from "./gemini.js";

dotenv.config();

async function testGemini() {
  const res = await askGemini("what is the capital of india?");
  console.log("GEMINI RESPONSE:", res);
}

testGemini();
