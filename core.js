const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const UserServices = require('./services/user');
const TempUserServices = require('./services/tempUser');
const { messages, Links } = require('./constants/messages');

if (process.env.TG_TOKEN === undefined) {
    console.error('TG_TOKEN is not defined! Add an environment variable named TG_TOKEN with your bot token as value.');
    process.exit(1);
}

const webAppUrl = 'https://tg-react-webapp.vercel.app/';
const token = process.env.TG_TOKEN;
const bot = new TelegramBot(token, { polling: true });
const mainLanguage = 'ru'

bot.on('polling_error', (msg) => console.log(msg));

bot.getMe().then((me) => {
    console.log(`Bot ${me.username} is up and running...`);
});

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text.startsWith('/')) {
        try {
            await handleCommand(chatId, text);
        } catch (e) {
            console.error(`Error from command: ${e}`);
        }
    } else {
        try {
            await handleNonCommand(chatId);
        } catch (e) {
            console.error(`Error from non-command message: ${e}`);
        }
    }
});

async function handleCommand(chatId, text) {
    try {
        const user = await UserServices.findByChatID(chatId);
        if (user) {
            await handleUserCommand(chatId, text, user);
        } else {
            await handleNonUserCommand(chatId, text);
        }
    } catch (e) {
        console.error(`Error handling command: ${e}`);
        await bot.sendAnimation(chatId,)
        // await bot.sendMessage(chatId, 'An error occurred while processing your request. handleCommand.');

    }
}

async function handleUserCommand(chatId, text, user) {
    switch (text) {
        case '/start':
            await handleStartCommand(chatId, user);
            break;
        case '/changelang':
            await changeLanguage(chatId, user);
            break;
        default:
            await bot.sendMessage(chatId, 'Sorry, I do not recognize that command.');
            break;
    }
}

async function handleNonUserCommand(chatId, text) {
    switch (text) {
        case '/start':
            await handleStartCommand(chatId);
            break;
        case '/changelang':
            await changeLanguage(chatId);
            break;
        default:
            await bot.sendMessage(chatId, 'Sorry, I do not recognize that command.');
            break;
    }
}

async function handleStartCommand(chatId, user = null) {
    try {
        if (user) {
            await sendRegisteredUserMenu(chatId, user?.lang || mainLanguage);
        } else {
            const tempUser = await TempUserServices.findByChatId(chatId);
            if (tempUser) {
                await sendFillFormMessage(chatId, tempUser?.lang || mainLanguage);
            } else {
                await changeLanguage(chatId);
            }
        }
    } catch (e) {
        console.error(`Error handling /start command: ${e}`);
        await bot.sendMessage(chatId, 'An error occurred while processing your request. Please try again later.');
    }
}

async function sendRegisteredUserMenu(chatId, lang) {
    await bot.sendMessage(chatId, messages[lang].welcomeBack, {
        reply_markup: {
            inline_keyboard: [
                [{ text: `${messages[lang].contacts}`, web_app:  {url: Links[lang].contacts} }],
                [{ text: `${messages[lang].aboutUs}`, web_app:  {url: Links[lang].about} }],
                [{ text: `${messages[lang].points}`, web_app:  {url: Links[lang].points} }],
                [{ text: `${messages[lang].changeLang}`, callback_data: 'changeLang' }]
            ],
            one_time_keyboard: true,    
            resize_keyboard: true,
        },
    });
}

async function sendFillFormMessage(chatId, lang) {
    console.log(lang)
    await bot.sendMessage(chatId, messages[lang].fillForm, {
        reply_markup: {
            inline_keyboard: [
                [{ text: messages[lang].visitWebsite, web_app: { url: webAppUrl }}]
            ],
            one_time_keyboard: true,
            resize_keyboard: true,
        },
    });
}

async function handleNonCommand(chatId) {
    await bot.sendMessage(chatId, 'Sorry, I only understand commands.');
}

bot.on('callback_query', async (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const data = callbackQuery.data;
    let user = await UserServices.findByChatID(chatId);
    let tempUser; 
    if (data === 'changeLang') {
        await changeLanguage(chatId, user);
    } else {
        if (user) {
            user = await UserServices.updateUserLang(chatId, data);
        } else {
            tempUser = await TempUserServices.addTempUser(chatId, data);
        }
        await bot.sendMessage(chatId, `${messages[data].lang_has_been_set} ${data}.`);
        if (user) {
            await sendRegisteredUserMenu(chatId, user?.lang || mainLanguage);
        }
        else {
            console.log(tempUser)
            sendFillFormMessage(chatId, tempUser.lang)
        }
    }
});

async function changeLanguage(chatId, user = null) {
    await bot.sendMessage(chatId, messages[user?.lang || mainLanguage].selectLang, { // Default to Russian message for language selection
        reply_markup: {
            inline_keyboard: [
                [{ text: 'En', callback_data: 'en' }],
                [{ text: 'Ru', callback_data: 'ru' }],
                [{ text: 'Ky', callback_data: 'ky' }]
            ]
        }
    });
    return;
}

module.exports = bot;
