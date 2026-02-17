const AppConfig = {
    modules: [
        { 
            id: 'home', 
            title: 'Главная', 
            icon: '🏠', 
            url: 'home.html', 
            category: 'main',
            showInSidebar: true
        },
        { 
            id: 'unit', 
            title: 'Юнит-экономика', 
            icon: '🔢', 
            url: 'tools/unit-economics.html', 
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
            url: 'tools/pnl-report.html', 
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
            url: 'tools/hourly-rate.html', 
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
            url: 'tools/roi-calculator.html', 
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
            url: 'tools/break-even.html', 
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
            url: 'resources/documents.html', 
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
            url: 'resources/education.html', 
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
            url: 'pricing.html', 
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
            url: 'settings.html', 
            category: 'system',
            showInSidebar: true
        }
    ]
};

window.AppConfig = AppConfig;

// Load Supabase Client if not present
(function() {
    if (!document.getElementById('supabase-js')) {
        // 1. Supabase
        const script = document.createElement('script');
        script.id = 'supabase-js';
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
        script.onload = () => {
            console.log('Supabase SDK loaded');
            // Load Service Wrapper
            const serviceScript = document.createElement('script');
            serviceScript.src = window.location.pathname.includes('/platform/') 
                ? '../assets/js/services/supabase-service.js' 
                : 'assets/js/services/supabase-service.js';
            // Handle deeper nesting
            if (window.location.pathname.includes('/tools/') || window.location.pathname.includes('/resources/')) {
                 serviceScript.src = '../../assets/js/services/supabase-service.js';
            }

            serviceScript.onload = () => {
                 if (window.SupabaseService) window.SupabaseService.init();
            };
            document.head.appendChild(serviceScript);
        };
        document.head.appendChild(script);

        // 2. html2pdf
        const pdfScript = document.createElement('script');
        pdfScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        document.head.appendChild(pdfScript);

        // 3. Chart.js
        const chartScript = document.createElement('script');
        chartScript.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        document.head.appendChild(chartScript);

        // 4. AI Advisor
        const aiScript = document.createElement('script');
        aiScript.src = window.location.pathname.includes('/platform/') 
                ? '../assets/js/ai/advisor.js' 
                : 'assets/js/ai/advisor.js';
        if (window.location.pathname.includes('/tools/') || window.location.pathname.includes('/resources/')) {
                 aiScript.src = '../../assets/js/ai/advisor.js';
        }
        document.head.appendChild(aiScript);
    }
})();
