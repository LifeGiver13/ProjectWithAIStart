export default async function sellingLeaderBoards(req, res) {
    const { question } = req.body;

    if (!question) return res.status(400).json({ error: 'Bad Request', message: "Question feild is required" })

    try {
        const response = await fetch("https://router.huggingface.co/v1", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.HF_TOKEN}`,
                "Content-Type": 'application/json',
            },
            body: JSON.stringify({
                inputs: `Respond only in JSON format with Rank, Manga, Author, Episodes, Estimated Sales. Question ${question}`
            })
        })
        const data = await response.json()
        const aiText = data[0]?.generatedText || data.error || '';

        try {
            let jsonResponse = JSON.parse(aiText);
        } catch (err) {
            jsonResponse = { raw: aiText };
        }
        res.json(jsonResponse);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message })
    }
}