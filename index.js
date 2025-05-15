/**
 * Este script é responsável
 * pelas funções que
 * serão executadas
 * no Lite Bot.
 *
 * Aqui é onde você
 * vai definir
 * o que o seu bot
 * vai fazer.
 *
 * @author Dev Gui
 */
const path = require("node:path");
const { menu } = require("./utils/menu");
const { ASSETS_DIR, BOT_NUMBER, SPIDER_API_TOKEN } = require("./config");
const { errorLog } = require("./utils/terminal");
const {
  attp,
  ttp,
  gpt4,
  playAudio,
  playVideo,
} = require("./services/spider-x-api");
const { consultarCep } = require("correios-brasil/dist");
const { image } = require("./services/hercai");

const ai = require("./ai"); // **import do módulo ai**

const {
  InvalidParameterError,
  WarningError,
  DangerError,
} = require("./errors");

const {
  checkPrefix,
  deleteTempFile,
  download,
  formatCommand,
  getBuffer,
  getContent,
  getJSON,
  getProfileImageData,
  getRandomName,
  getRandomNumber,
  isLink,
  loadLiteFunctions,
  onlyLettersAndNumbers,
  onlyNumbers,
  removeAccentsAndSpecialCharacters,
  splitByCharacters,
  toUserJid,
} = require("./utils/functions");

const {
  activateAntiLinkGroup,
  deactivateAntiLinkGroup,
  isActiveAntiLinkGroup,
  activateWelcomeGroup,
  isActiveGroup,
  deactivateWelcomeGroup,
  activateGroup,
  deactivateGroup,
} = require("./database/db");

async function runLite({ socket, data }) {
  const functions = loadLiteFunctions({ socket, data });

  if (!functions) {
    return;
  }

  const {
    args,
    body,
    command,
    from,
    fullArgs,
    info,
    isImage,
    isReply,
    isSticker,
    isVideo,
    lite,
    prefix,
    replyJid,
    userJid,
    audioFromURL,
    ban,
    downloadImage,
    downloadSticker,
    downloadVideo,
    errorReact,
    errorReply,
    imageFromFile,
    imageFromURL,
    isAdmin,
    isOwner,
    react,
    recordState,
    reply,
    sendText,
    stickerFromFile,
    stickerFromInfo,
    stickerFromURL,
    successReact,
    successReply,
    typingState,
    videoFromURL,
    waitReact,
    waitReply,
    warningReact,
    warningReply,
  } = functions;

  if (!isActiveGroup(from) && !(await isOwner(userJid))) {
    return;
  }

  if (!checkPrefix(prefix)) {
    if (body.toLowerCase().includes("gado")) {
      await reply("Você é o gadão guerreiro!");
      return;
    }

    if (body === "salve") {
      await reply("Salve, salve!");
      return;
    }
  }

  if (
    !checkPrefix(prefix) &&
    isActiveAntiLinkGroup(from) &&
    isLink(body) &&
    !(await isAdmin(userJid))
  ) {
    await ban(from, userJid);
    await reply("Anti-link ativado! Você foi removido por enviar um link!");
    return;
  }

  if (!checkPrefix(prefix)) {
    return;
  }

  try {
    switch (removeAccentsAndSpecialCharacters(command?.toLowerCase())) {
      case "antilink":
        // seu código antilink
        if (!args.length) {
          throw new InvalidParameterError(
            "Você precisa digitar 1 ou 0 (ligar ou desligar)!"
          );
        }
        const antiLinkOn = args[0] === "1";
        const antiLinkOff = args[0] === "0";

        if (!antiLinkOn && !antiLinkOff) {
          throw new InvalidParameterError(
            "Você precisa digitar 1 ou 0 (ligar ou desligar)!"
          );
        }
        if (antiLinkOn) {
          activateAntiLinkGroup(from);
        } else {
          deactivateAntiLinkGroup(from);
        }
        await successReact();
        await reply(`Recurso de anti-link ${antiLinkOn ? "ativado" : "desativado"} com sucesso!`);
        break;

      // ... demais cases (attp, ban, cep, gpt4, etc) ...

      case "gpt4":
      case "gpt":
      case "ia":
      case "lite":
        {
          const text = args.join(" ");
          if (!text) {
            throw new InvalidParameterError("Você precisa me dizer o que eu devo responder!");
          }
          await waitReact();
          const responseText = await gpt4(text);
          await successReply(responseText);
        }
        break;

      case "ai": // novo comando AI
        {
          const argsAI = args;
          await waitReact();
          await ai.execute(client, data, argsAI); // ajusta conforme sua implementação do ai.execute
          await successReact();
        }
        break;

      // ... os demais comandos ...

      default:
        // comandos não reconhecidos podem ser ignorados ou responder aqui
        break;
    }
  } catch (error) {
    if (error instanceof InvalidParameterError) {
      await warningReply(`Parâmetros inválidos! ${error.message}`);
    } else if (error instanceof WarningError) {
      await warningReply(error.message);
    } else if (error instanceof DangerError) {
      await errorReply(error.message);
    } else {
      errorLog(`Erro ao executar comando!\n\nDetalhes: ${error.message}`);
      await errorReply(`Ocorreu um erro ao executar o comando ${command.name}!\n\n📄 *Detalhes*: ${error.message}`);
    }
  }
}

module.exports = { runLite };
