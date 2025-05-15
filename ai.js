const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: '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' // substitui por sua chave real
});

module.exports = {
  name: 'ai',
  description: 'Conversa com inteligência artificial',
  async execute(client, m, args) {
    const pergunta = args.join(' ');
    if (!pergunta) return m.reply('Digite algo para eu responder, ex: !ai como está o clima?');

    try {
      const resposta = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Você é um assistente útil e direto.' },
          { role: 'user', content: pergunta }
        ],
        max_tokens: 1000,
        temperature: 0.7
      });

      const reply = resposta.choices[0].message.content;
      await client.sendMessage(m.chat, { text: reply }, { quoted: m });

    } catch (error) {
      console.error('Erro na OpenAI:', error);
      m.reply('Erro ao consultar a IA. Verifique sua chave de API.');
    }
  }
};
