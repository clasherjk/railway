require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// Initialize the bot
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// /player command
bot.onText(/\/player (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const playerTag = match[1].replace('#', '%23'); // URL-encode '#'

  try {
    const response = await axios.get(`https://cocproxy.royaleapi.dev/v1/players/${playerTag}`, {
      headers: {
        Authorization: `Bearer ${process.env.API_TOKEN}`,
      }
    });

    const playerName = response.data.name;
    bot.sendMessage(chatId, `👤 Player Name: ${playerName}`);
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    bot.sendMessage(chatId, `⚠️ Failed to fetch player data. Please check the tag and try again.`);
  }
});

// Start confirmation
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, `👋 Welcome! Send /player <tag> to get player name.\nExample:\n/player #P0LYQY0V`);
});