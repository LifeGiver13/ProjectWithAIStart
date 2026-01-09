import fetch from 'node-fetch';

export async function sellingLeaderBoards(req, res) {
    const { question } = req.body;

    if (!question) {
        return res.status(400).json({
            error: 'Bad Request',
            message: 'Question field is required'
        });
    }

    try {
        const response = await fetch(
            'https://router.huggingface.co/v1/chat/completions',
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${process.env.HF_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'deepseek-ai/DeepSeek‑V3.2',
                    messages: [
                        {
                            role: 'user',
                            content: `Respond ONLY in JSON. Rank, Manga, Author, Episodes, Estimated Sales. Question: ${question}`
                        }
                    ]
                })

            }
        );

        const text = await response.text();

        let data;
        try {
            data = JSON.parse(text);
        } catch {
            console.error('RAW HF RESPONSE:', text);
            return res.status(502).json({ error: 'Invalid JSON from HuggingFace', raw: text });
        }

        const aiText = data.choices?.[0]?.message?.content;
        if (!aiText) {
            return res.status(502).json({ error: 'No AI response', raw: data });
        }

        let finalJson;
        try {
            finalJson = JSON.parse(aiText);
        } catch {
            finalJson = { raw: aiText };
        }

        res.json(finalJson);
    } catch (err) {
        console.error('FETCH ERROR:', err);
        res.status(500).json({ error: err.message });
    }
}
