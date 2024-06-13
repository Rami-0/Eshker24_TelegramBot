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
const ourCommands = ['/start', '/changelang']

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
            await handleNonCommand(chatId, text);
        } catch (e) {
            console.error(`Error from non-command message: ${e}`);
        }
    }
});

async function handleCommand(chatId, text) {
    // Check if the command is in our known commands list
    if (!ourCommands.includes(text)) {
        try {
            const user = await UserServices.findByChatID(chatId);
            console.log(user);
            await bot.sendMessage(chatId, messages[user?.lang || mainLanguage].unknownCommand);
        } catch (e) {
            console.error(`Error finding user for unknown command: ${e}`);
            await bot.sendMessage(chatId, messages[mainLanguage].error);
        }
        return; // Return early since the command is not recognized
    }

    try {
        // Fetch user details once
        const user = await UserServices.findByChatID(chatId);
        if (user) {
            await handleUserCommand(chatId, text, user);
        } else {
            await handleNonUserCommand(chatId, text);
        }
    } catch (e) {
        console.error(`Error handling command: ${e}`);
        await bot.sendMessage(chatId, messages[mainLanguage].error);    
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
            await bot.sendMessage(chatId, messages[user?.lang || mainLanguage].unknownCommand);
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
            await bot.sendMessage(chatId, messages[mainLanguage].unknownCommand);
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
        await bot.sendMessage(chatId, messages[mainLanguage].error);
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
    console.log(lang);
    let webAppUrlWithLang = `${webAppUrl}set_auth/?lang=${lang}`; // append lang as a query parameter
    await bot.sendMessage(chatId, messages[lang].fillForm, {
        reply_markup: {
            inline_keyboard: [
                [{ text: messages[lang].loginWithIshker, web_app: { url: webAppUrlWithLang }}]
            ],
            one_time_keyboard: true,
            resize_keyboard: true,
        },
    });
}

async function handleNonCommand(chatId, text) {
    await bot.sendMessage(chatId, messages[mainLanguage].onlyCommands);
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
        await bot.sendMessage(chatId, `${messages[data].lang_has_been_set}.`);
        if (user) {
            await sendRegisteredUserMenu(chatId, user?.lang || mainLanguage);
        }
        else {
            sendFillFormMessage(chatId, tempUser?.lang || data || mainLanguage)
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