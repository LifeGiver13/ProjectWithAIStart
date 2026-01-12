// import fetch from 'node-fetch';

// export async function sellingLeaderBoards(req, res) {
//     const { question } = req.body;

//     if (!question) {
//         return res.status(400).json({
//             error: 'Bad Request',
//             message: 'Question field is required'
//         });
//     }

//     try {
//         const response = await fetch(
//             'https://router.huggingface.co/v1/chat/completions',
//             {
//                 method: 'POST',
//                 headers: {
//                     Authorization: `Bearer ${process.env.HF_TOKEN}`,
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     model: 'deepseek-ai/DeepSeek‑V3.2',
//                     messages: [
//                         {
//                             role: 'user',
//                             content: `Respond ONLY in JSON. Rank, Manga, Author, Episodes, Estimated Sales. Question: ${question}`
//                         }
//                     ]
//                 })

//             }
//         );

//         const text = await response.text();

//         let data;
//         try {
//             data = JSON.parse(text);
//         } catch {
//             console.error('RAW HF RESPONSE:', text);
//             return res.status(502).json({ error: 'Invalid JSON from HuggingFace', raw: text });
//         }

//         const aiText = data.choices?.[0]?.message?.content;
//         if (!aiText) {
//             return res.status(502).json({ error: 'No AI response', raw: data });
//         }

//         let finalJson;
//         try {
//             finalJson = JSON.parse(aiText);
//         } catch {
//             finalJson = { raw: aiText };
//         }

//         res.json(finalJson);
//     } catch (err) {
//         console.error('FETCH ERROR:', err);
//         res.status(500).json({ error: err.message });
//     }
// }

import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";

export async function sellingLeaderBoards(req, res) {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Question field is required.",
      });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const expectedStructure= z.object({
          rank: z.number(),
          manga: z.string(),
          author: z.string(),
          chapters: z.number().nullable(),
          releasedDate: z.string().nullable(),
          estimatedSales: z.string().nullable(),
          imgUrl: z.string().nullable()
        })

    const AnimeLeaderboardSchema = z.object({
      rankings: z.array(expectedStructure),
    });

    const response = await openai.responses.parse({
      model: "gpt-4o-mini",
      input: [
        {
          role: "system",
          content:
            "You are a data extraction assistant. Return only factual data when possible. If unknown, use null. Do not add explanations and look for image url's from accurate sources",
        },
        {
          role: "user",
          content: question,
        },
      ],
      text: {
        format: zodTextFormat(AnimeLeaderboardSchema, "leaderboard"),
      },
    });

      
    if (response.refusal){
      return res.status(403).json({
        refused: true,
        reason: response.refusal,
      })
    }

    const leaderboard = response.output_parsed;


    return res.json({
      refused:false,
      data:leaderboard
    });

  } catch (error) {
    console.error("OpenAI Error:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
}
