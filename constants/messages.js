const messages = {
    en: {
        welcomeBack: 'Welcome back!',
        fillForm: 'Fill out the form',
        aboutUs: 'About us',
        help: 'Help',
        contacts: 'Contacts',
        complain: 'Complaint',
        visitWebsite: 'Visit Website',
        selectLang: 'Select Language',
        lang_has_been_set: 'Your language preference has been set to English.',
        changeLang: 'Change Language',
        points: 'Serving points - RSK',
        unknownCommand: 'Sorry, I do not recognize this command.',
        error: 'An error occurred while processing your request. Please try again later.',
        onlyCommands: 'Sorry, I only understand commands.',
        loginWithIshker: 'Login with Ishker24'
    },
    ky: {
        welcomeBack: 'Кош келиңиз!',
        fillForm: 'Форманы толтуруңуз',
        aboutUs: 'Биз жөнүндө',
        help: 'Жардам',
        contacts: 'Байланышуу',
        complain: 'Айрым даттануу калтыруу',
        visitWebsite: 'Веб-сайтка кириңиз',
        selectLang: 'Тилди тандоо',
        lang_has_been_set: 'Сиздин тил тандооңуз орнотулду',
        changeLang: 'Тилди алмаштыруу',
        points: 'ДАРЕКТЕРИ БӨЛҮМДӨРДҮН',
        unknownCommand: 'Кечиресиз, мен бул буйрукту тааныбайм.',
        error: 'Суранычты иштетүүдө ката кетти. Кийинчерээк кайра аракет кылыңыз.',
        onlyCommands: 'Кечиресиз, мен буйруктарды гана түшүнөм.',
        loginWithIshker: 'Ишкер24 аркылуу катталуу   '
    },
    ru: {
        welcomeBack: 'Добро пожаловать !',
        fillForm: 'Заполните форму',
        aboutUs: 'О нас',
        help: 'Помощь',
        contacts: 'Контакты',
        complain: 'Оставить жалобу',
        visitWebsite: 'Посетить сайт',
        selectLang: 'Выберите язык',
        lang_has_been_set: 'Был установлен Русский язык',
        changeLang: 'Изменить язык',
        points: 'Точки обслуживания - РСК Банк',
        unknownCommand: 'Извините, я не узнаю эту команду.',
        error: 'Во время обработки Вашего запроса произошла ошибка. Пожалуйста, повторите попытку позже.',
        onlyCommands: 'Извините, я понимаю только команды.',
        loginWithIshker: 'Регистрация с помощью Ишкер24'
    },
    // Add more languages as needed
};
const Links = {
	en: {
		contacts: "https://www.rsk.kg/en/info?type=contacts_page&for_who=individual",
		about: "https://www.rsk.kg/en/info?type=about_page&for_who=individual",
		points: "https://www.rsk.kg/en/points?for_who=individual"
	}, 
	ky: {
		contacts: "https://www.rsk.kg/info?type=contacts_page&for_who=individual",
		about: "https://www.rsk.kg/info?type=about_page&for_who=individual",
		points: "https://www.rsk.kg/en/points?for_who=individual"
	},
	ru: {
		contacts: "https://www.rsk.kg/ru/info?type=contacts_page&for_who=individual",
		about: "https://www.rsk.kg/ru/info?type=about_page&for_who=individual",
		points: "https://www.rsk.kg/en/points?for_who=individual"
	}
}
module.exports = {
	messages,
	Links
};
