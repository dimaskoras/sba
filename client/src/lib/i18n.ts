import { useState, useEffect } from 'react';

type Language = 'ru' | 'kz';

interface Translations {
  [key: string]: {
    ru: string;
    kz: string;
  };
}

const translations: Translations = {
  // Navigation
  'nav.home': {
    ru: 'Главная',
    kz: 'Басты бет'
  },
  'nav.catalog': {
    ru: 'Каталог',
    kz: 'Каталог'
  },
  'nav.about': {
    ru: 'О нас',
    kz: 'Біз туралы'
  },
  'nav.contacts': {
    ru: 'Контакты',
    kz: 'Байланыс'
  },
  'nav.admin': {
    ru: 'Админ',
    kz: 'Әкімші'
  },

  // Common
  'common.search': {
    ru: 'Поиск',
    kz: 'Іздеу'
  },
  'common.all_categories': {
    ru: 'Все категории',
    kz: 'Барлық санаттар'
  },
  'common.loading': {
    ru: 'Загрузка...',
    kz: 'Жүктелуде...'
  },
  'common.error': {
    ru: 'Ошибка',
    kz: 'Қате'
  },
  'common.success': {
    ru: 'Успешно',
    kz: 'Сәтті'
  },

  // Hero section
  'hero.title': {
    ru: 'Качественная кровля и сайдинг в Астане',
    kz: 'Астанада сапалы шатыр мен сайдинг'
  },
  'hero.subtitle': {
    ru: 'Профессиональные строительные материалы от ведущих производителей. Кровля, сайдинг, водосточные системы и комплектующие.',
    kz: 'Жетекші өндірушілерден кәсіби құрылыс материалдары. Шатыр, сайдинг, су ағызу жүйелері және жинақтаушылар.'
  },
  'hero.cta_request': {
    ru: 'Оставить заявку',
    kz: 'Өтініш қалдыру'
  },
  'hero.cta_catalog': {
    ru: 'Смотреть каталог',
    kz: 'Каталогты қарау'
  },

  // Features
  'features.title': {
    ru: 'Почему выбирают нас',
    kz: 'Неліктен бізді таңдайды'
  },
  'features.quality': {
    ru: 'Гарантия качества',
    kz: 'Сапа кепілдігі'
  },
  'features.delivery': {
    ru: 'Быстрая доставка',
    kz: 'Жылдам жеткізу'
  },
  'features.consultants': {
    ru: 'Опытные консультанты',
    kz: 'Тәжірибелі кеңесшілер'
  },
  'features.prices': {
    ru: 'Выгодные цены',
    kz: 'Тиімді бағалар'
  },

  // Catalog
  'catalog.title': {
    ru: 'Каталог продукции',
    kz: 'Өнім каталогы'
  },
  'catalog.subtitle': {
    ru: 'Широкий ассортимент строительных материалов высокого качества',
    kz: 'Жоғары сапалы құрылыс материалдарының кең ассортименті'
  },
  'catalog.search_placeholder': {
    ru: 'Поиск товаров...',
    kz: 'Тауарларды іздеу...'
  },
  'catalog.find': {
    ru: 'Найти',
    kz: 'Табу'
  },
  'catalog.view_all': {
    ru: 'Смотреть все товары',
    kz: 'Барлық тауарларды қарау'
  },

  // About
  'about.title': {
    ru: 'О компании SmartBuildAstana',
    kz: 'SmartBuildAstana компаниясы туралы'
  },
  'about.description1': {
    ru: 'Компания SmartBuildAstana является ведущим поставщиком качественных строительных материалов в Казахстане.',
    kz: 'SmartBuildAstana компаниясы Қазақстанда сапалы құрылыс материалдарының жетекші жеткізушісі болып табылады.'
  },
  'about.description2': {
    ru: 'Наша миссия - предоставлять строителям и частным заказчикам надежные материалы по доступным ценам.',
    kz: 'Біздің миссиямыз - құрылысшылар мен жеке тапсырыс берушілерге қолжетімді бағамен сенімді материалдар ұсыну.'
  },
  'about.description3': {
    ru: 'За годы работы мы зарекомендовали себя как надежный партнер для множества строительных проектов.',
    kz: 'Жұмыс жылдары біз көптеген құрылыс жобалары үшін сенімді серіктес ретінде өзімізді көрсеттік.'
  },

  // Contacts
  'contacts.title': {
    ru: 'Контакты',
    kz: 'Байланыс'
  },
  'contacts.subtitle': {
    ru: 'Свяжитесь с нами любым удобным способом',
    kz: 'Бізбен ыңғайлы әдіспен хабарласыңыз'
  },
  'contacts.info_title': {
    ru: 'Контактная информация',
    kz: 'Байланыс ақпараты'
  },
  'contacts.address_label': {
    ru: 'Адрес:',
    kz: 'Мекенжай:'
  },
  'contacts.phone_label': {
    ru: 'Телефон:',
    kz: 'Телефон:'
  },
  'contacts.hours_label': {
    ru: 'График работы:',
    kz: 'Жұмыс кестесі:'
  },
  'contacts.social_title': {
    ru: 'Мессенджеры:',
    kz: 'Мессенджерлер:'
  },

  // Form
  'form.title': {
    ru: 'Оставить заявку',
    kz: 'Өтініш қалдыру'
  },
  'form.name_label': {
    ru: 'Ваше имя *',
    kz: 'Сіздің атыңыз *'
  },
  'form.name_placeholder': {
    ru: 'Введите ваше имя',
    kz: 'Атыңызды енгізіңіз'
  },
  'form.phone_label': {
    ru: 'Телефон *',
    kz: 'Телефон *'
  },
  'form.phone_placeholder': {
    ru: '+7 701 234 56 78',
    kz: '+7 701 234 56 78'
  },
  'form.comment_label': {
    ru: 'Комментарий',
    kz: 'Түсініктеме'
  },
  'form.comment_placeholder': {
    ru: 'Опишите ваш запрос или вопрос...',
    kz: 'Сұранысыңызды немесе сұрағыңызды сипаттаңыз...'
  },
  'form.submit': {
    ru: 'Отправить заявку',
    kz: 'Өтінішті жіберу'
  },
  'form.privacy': {
    ru: 'Нажимая кнопку, вы соглашаетесь на обработку персональных данных',
    kz: 'Батырманы басу арқылы сіз жеке деректерді өңдеуге келісім бересіз'
  },

  // Working hours
  'working_hours': {
    ru: 'Пн–Пт 09:00–18:00, Сб 09:00–14:00',
    kz: 'Дс–Жм 09:00–18:00, Сб 09:00–14:00'
  },

  // Company tagline
  'tagline': {
    ru: 'Качественные строительные материалы',
    kz: 'Сапалы құрылыс материалдары'
  },

  // Admin
  'admin.login': {
    ru: 'Вход в админ панель',
    kz: 'Әкімші панеліне кіру'
  },
  'admin.username': {
    ru: 'Логин',
    kz: 'Логин'
  },
  'admin.password': {
    ru: 'Пароль',
    kz: 'Құпия сөз'
  },
  'admin.login_button': {
    ru: 'Войти',
    kz: 'Кіру'
  },
  'admin.dashboard': {
    ru: 'Панель управления',
    kz: 'Басқару панелі'
  },
  'admin.products': {
    ru: 'Товары',
    kz: 'Тауарлар'
  },
  'admin.categories': {
    ru: 'Категории',
    kz: 'Санаттар'
  },
  'admin.requests': {
    ru: 'Заявки',
    kz: 'Өтініштер'
  },
  'admin.logout': {
    ru: 'Выйти',
    kz: 'Шығу'
  }
};

export function useTranslation() {
  const [language, setLanguage] = useState<Language>('ru');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'ru' || savedLanguage === 'kz')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translation[language] || translation.ru || key;
  };

  return {
    language,
    changeLanguage,
    t
  };
}
