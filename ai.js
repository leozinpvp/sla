const axios = require("axios");

const GPT_API_URL = "https://api.openai.com/v1/chat/completions"; // endpoint oficial OpenAI chat completions
const GPT_API_KEY = process.env.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; // sua chave na variável de ambiente

async function execute(client, data, args) {
  const prompt = args.join(" ").trim();
  if (!prompt) {
    await client.sendMessage(data.from, {
      text: "Por favor, me envie uma pergunta ou texto para responder.",
    });
    return;
  }

  try {
    const response = await axios.post(
      GPT_API_URL,
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GPT_API_KEY}`,
        },
      }
    );

    const aiMessage = response.data.choices[0].message.content.trim();

    await client.sendMessage(data.from, { text: aiMessage });
  } catch (error) {
    console.error("Erro ao chamar API GPT:", error.response?.data || error.message);
    await client.sendMessage(data.from, {
      text: "Putz, tive um problema ao acessar a IA. Tente de novo mais tarde.",
    });
  }
}

module.exports = { execute };
