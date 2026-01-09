// import OpenAI from "openai";
// import dotenv from "dotenv";

// if (process.env.NODE_ENV !== 'production') {
//     // Load environment variables from .env.local file
//     dotenv.config({ path: '.env.local' });
// }


// const client = new OpenAI({
//     baseURL: "https://router.huggingface.co/v1",
//     apiKey: process.env.HF_TOKEN,
// });
// console.log("HF_TOKEN:", process.env.HF_TOKEN);
// console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY);

// export async function main() {
//     const response = await client.chat.completions.create({
//         model: "moonshotai/Kimi-K2-Instruct-0905",
//         messages: [{ role: "user", content: "What is the Top 10 of the Most sold manga's of 2025?" }],
//     });
//     console.log(response.choices[0].message.content);
// }

// main();
import express from 'express';
import sellingLeaderBoards from '../../handlers/sellingLeaderboards.js';

const router = express.Router();

router.use('/sellingLeaderBoards', sellingLeaderBoards)

export default router;
