const quotes = [
  "O sucesso é a soma de pequenos esforços repetidos dia após dia.",
  "A criatividade é a inteligência se divertindo.",
  "Não espere por uma oportunidade, crie-a.",
];

module.exports = {
  name: "quote",
  description: "Manda uma frase motivacional aleatória.",
  async execute({ reply }) {
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    await reply(quote);
  }
};
