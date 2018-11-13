const TeleBot = require('./telebot');
const bot = new TeleBot('533296527:AAEqhLiXxpxm8T5EIVKAQ__DdLMDvUnYNco');


bot.on(['/start', '/hello'], (msg) => {
    console.log(msg);
    msg.reply.text('Welcome!');
} );

bot.start()
