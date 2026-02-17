const AppConfig = {
    modules: [
        { 
            id: 'home', 
            title: 'Главная', 
            icon: '🏠', 
            url: '/platform/home.html', 
            category: 'main',
            showInSidebar: true
        },
        { 
            id: 'unit', 
            title: 'Юнит-экономика', 
            icon: '🔢', 
            url: '/platform/tools/unit-economics.html', 
            desc: 'Расчет стоимости клиента и маржинальности',
            category: 'tools',
            showInSidebar: true,
            showInHome: true,
            showInProject: true
        },
        { 
            id: 'pnl', 
            title: 'P&L Отчет', 
            icon: '💰', 
            url: '/platform/tools/pnl-report.html', 
            desc: 'Прогноз прибылей и убытков на 6 месяцев',
            category: 'tools',
            showInSidebar: true,
            showInHome: true,
            showInProject: true
        },
        { 
            id: 'hourly-rate', 
            title: 'Калькулятор ставки', 
            icon: '⏰', 
            url: '/platform/tools/hourly-rate.html', 
            desc: 'Расчет почасовой ставки для фрилансеров',
            category: 'tools',
            showInSidebar: true,
            showInHome: true,
            showInProject: false
        },
        { 
            id: 'roi-calculator', 
            title: 'ROI Калькулятор', 
            icon: '📈', 
            url: '/platform/tools/roi-calculator.html', 
            desc: 'Расчет возврата инвестиций',
            category: 'tools',
            showInSidebar: true,
            showInHome: true,
            showInProject: false
        },
        { 
            id: 'break-even', 
            title: 'Точка безубыточности', 
            icon: '⚖️', 
            url: '/platform/tools/break-even.html', 
            desc: 'Расчет минимального объема продаж',
            category: 'tools',
            showInSidebar: true,
            showInHome: true,
            showInProject: false
        },
        { 
            id: 'docs', 
            title: 'Документы', 
            icon: '📄', 
            url: '/platform/resources/documents.html', 
            desc: 'Шаблоны договоров, счетов и актов',
            category: 'resources',
            showInSidebar: true,
            showInHome: true,
            showInProject: false
        },
        { 
            id: 'edu', 
            title: 'Обучение', 
            icon: '🎓', 
            url: '/platform/resources/education.html', 
            desc: 'База знаний и курсы для старта',
            category: 'resources',
            showInSidebar: true,
            showInHome: false,
            showInProject: false
        },
        { 
            id: 'pricing', 
            title: 'Тарифы', 
            icon: '💎', 
            url: '/platform/pricing.html', 
            desc: 'Выберите подходящий тариф',
            category: 'resources',
            showInSidebar: true,
            showInHome: false,
            showInProject: false
        },
        { 
            id: 'settings', 
            title: 'Настройки', 
            icon: '⚙️', 
            url: '/platform/settings.html', 
            category: 'system',
            showInSidebar: true
        }
    ]
};

window.AppConfig = AppConfig;
