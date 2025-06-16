require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// Replace with your bot token
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// Listen for any /player command
bot.onText(/\/player (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const playerTag = match[1].replace('#', '%23'); // URL-encode hash

  try {
    const response = await axios.get(`https://proxy.royaleapi.dev/v1/players/${playerTag}`, {
      headers: {
        Authorization: `Bearer ${process.env.API_TOKEN}`
      }
    });

    const playerName = response.data.name;
    bot.sendMessage(chatId, `Player Name: ${playerName}`);
  } catch (error) {
    console.error(error.response?.data || error.message);
    bot.sendMessage(chatId, 'Failed to fetch player data. Make sure the tag is correct.');
  }
});
