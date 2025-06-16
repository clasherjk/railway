require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// Helper function to fetch data from RoyaleAPI
const fetchData = async (url) => {
  return await axios.get(url, {
    headers: {
      Authorization: `Bearer ${process.env.API_TOKEN}`,
    },
  });
};

// /start
bot.onText(/\/start/, (msg) => {
  const message = `
🤖 *Clash of Clans Bot*
Commands:
/player <tag> – Get player info
/clan <tag> – Get clan info

Example:
/player #P0LYQY0V
/clan #88RRQ2UL
  `;
  bot.sendMessage(msg.chat.id, message, { parse_mode: 'Markdown' });
});

// /player <tag>
bot.onText(/\/player (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const tag = match[1].replace('#', '%23');

  try {
    const res = await fetchData(`https://cocproxy.royaleapi.dev/v1/players/${tag}`);
    const p = res.data;

    const troops = p.troops
      .filter(t => t.level > 0)
      .map(t => `${t.name}: ${t.level}`)
      .join(', ');

    const heroes = p.heroes
      .map(h => `${h.name}: ${h.level}`)
      .join(', ');

    const text = `
👤 *${p.name}* (${p.tag})
🏆 Trophies: ${p.trophies}
🏰 Town Hall: ${p.townHallLevel}
🛡️ Clan: ${p.clan ? p.clan.name : 'No Clan'}
🗡️ Troops: ${troops || 'None'}
🦸 Heroes: ${heroes || 'None'}
    `;

    bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
  } catch (error) {
    console.error(error.response?.data || error.message);
    bot.sendMessage(chatId, '⚠️ Failed to fetch player data. Check tag and try again.');
  }
});

// /clan <tag>
bot.onText(/\/clan (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const tag = match[1].replace('#', '%23');

  try {
    const res = await fetchData(`https://proxy.royaleapi.dev/v1/clans/${tag}`);
    const c = res.data;

    const members = c.memberList
      .map(m => `👤 ${m.name} | 🏆 ${m.trophies} | 🏰 TH${m.townHallLevel} | 🎖️ ${m.role}`)
      .join('\n');

    const text = `
🏰 *${c.name}* (${c.tag})
⭐ Level: ${c.clanLevel}
👥 Members: ${c.members}/50

${members}
    `;

    bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
  } catch (error) {
    console.error(error.response?.data || error.message);
    bot.sendMessage(chatId, '⚠️ Failed to fetch clan data. Check tag and try again.');
  }
});