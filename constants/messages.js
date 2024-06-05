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
        lang_has_been_set: 'Your language preference has been set to',
        changeLang: 'Change Language',
        points: 'Serving points - RSK'
    },
    ky: {
        welcomeBack: 'Кош келиңиз!',
        fillForm: 'Форманы толтуруңуз',
        aboutUs: 'Биз жөнүндө',
        help: 'Жардам',
        contacts: 'Байланыштар',
        complain: 'Айрым',
        visitWebsite: 'Вебсайтка кириңиз',
        selectLang: 'Тилди тандоо',
        lang_has_been_set: 'Сиздин тил тандооңуз орнотулду',
        changeLang: 'Тилди алмаштыруу',
        points: 'ДАРЕКТЕРИ БӨЛҮМДӨРДҮН'
    },
    ru: {
        welcomeBack: 'Добро пожаловать обратно!',
        fillForm: 'Заполните форму',
        aboutUs: 'О нас',
        help: 'Помощь',
        contacts: 'Контакты',
        complain: 'Жалоба',
        visitWebsite: 'Посетить сайт',
        selectLang: 'Выберите язык',
        lang_has_been_set: 'Ваш язык установлен на',
        changeLang: 'Изменить язык',
        points: 'Точки обслуживания - РСК Банк'
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
