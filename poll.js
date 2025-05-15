module.exports = {
  name: "poll",
  description: "Cria uma enquete simples.",
  async execute({ reply, args }) {
    if (args.length < 2) {
      await reply("Uso: !poll pergunta | opção1 | opção2 | ...");
      return;
    }
    const input = args.join(' ').split('|').map(s => s.trim());
    const question = input[0];
    const options = input.slice(1);

    if (options.length < 2) {
      await reply("Você precisa de pelo menos 2 opções.");
      return;
    }

    let response = `📊 *Enquete:* ${question}\n\n`;
    options.forEach((opt, i) => {
      response += `${i + 1}. ${opt}\n`;
    });
    response += "\nResponda com o número da opção para votar!";
    await reply(response);
  }
};
