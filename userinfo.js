module.exports = {
  name: "userinfo",
  description: "Mostra informações do usuário marcado ou do remetente.",
  async execute({ reply, isReply, replyJid, userJid }) {
    const target = isReply ? replyJid : userJid;
    await reply(`Informações do usuário:\nJID: ${target}\n*Mais info pode ser implementada aqui*`);
  }
};
