import dotenv from 'dotenv'

if (process.env.NODE_ENV !== 'production') {
    // Load environment variables from .env.local file
    dotenv.config({ path: '.env.local' });
}
console.log("OPENAI_API_KEY =", process.env.OPENAI_API_KEY);


import OpenAI from "openai";

export const openai = new OpenAI(
    {
        apiKey: process.env.OPENAI_API_KEY
    }
);