import { openai } from "./openAiClient.js";

async function main() {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "King of the world" },
                { role: "user", content: "Tell me, who am I" }
            ]
        })
        console.log(response.choices[0].message.content);
    } catch (err) {
        console.error("Error", err)
    }


}
main();