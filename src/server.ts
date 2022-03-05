import TelegramBot from "node-telegram-bot-api";
import { admins, token } from "./common";
import { banuser, banip } from "./actions/admin/ban";
import { rmcomment, rmthread } from "./actions/admin/remove";
import { addcat, rmcat } from "./actions/admin/cat";
import { getcat } from "./actions/info/cat";
import { getcomment } from "./actions/info/comment";
// replace the value below with the Telegram token you receive from @BotFather

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});
// Listen for any kind of message. There are different kinds of
// messages.
const admincommands = [
  "/banuser",
  "/banip",
  "/addcat",
  "/rmcat",
  "/rmcomment",
  "/rmthread",
];
bot.on("message", async (msg) => {
  try {
  if (!msg.text?.startsWith("/")) return;
  const chatId = msg.chat.id;
  const command = msg.text.split(" ");
  if (admincommands.includes(command[0]) && !admins.includes(chatId)) {
    bot.sendMessage(chatId, "permission denied");
    return;
  }
  let exe: any;
  console.log(command[0]);
  try {
    switch (command[0]) {
      case "/banuser":
        exe = await banuser(Number(command[1])); break;
      case "/banip":
        exe = await banip(command[1]); break;
      case "/addcat":
        exe = await addcat(command[1], Number(command[2]), Boolean(command[3])); break;
      case "/rmcat":
        exe = await rmcat(Number(command[1]), Boolean(command[2])); break;
      case "/rmcomment":
        exe = await rmcomment(Number(command[1]), Number(command[2])); break;
      case "/rmthread":
        exe = await rmthread(Number(command[1])); break;
      case "/getcat":
        exe = await getcat(Number(command[1])); break;
      case "/getcomment":
        exe = await getcomment(Number(command[1]), Number(command[2])); break;
      default:
        exe = "command not found";
    }
  } catch (e) {
    console.log(e);
    exe = "an error occurred";
  }
  console.log("done");
  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, String(exe));}catch{() => {}}
});
bot.on("polling_error", console.log);
