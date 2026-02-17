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
            id: 'projects', 
            title: 'Мои Проекты', 
            icon: '🚀', 
            category: 'main', 
            showInSidebar: true,
            children: [
                { id: 'all_projects', title: 'Все проекты', url: 'projects.html' },
                { id: 'new_project', title: '+ Новый проект', action: 'createNewProject' }
            ]
        },
        { 
            id: 'tools', 
            title: 'Калькуляторы', 
            icon: '🔢', 
            category: 'main', 
            showInSidebar: true,
            children: [
                { id: 'unit', title: 'Юнит-экономика', url: 'tools/unit-economics.html', icon: '📊' },
                { id: 'pnl', title: 'P&L Отчет', url: 'tools/pnl-report.html', icon: '💰' },
                { id: 'hourly', title: 'Калькулятор ставки', url: 'tools/hourly-rate.html', icon: '⏱️' },
                { id: 'roi', title: 'ROI Калькулятор', url: 'tools/roi-calculator.html', icon: '📈' },
                { id: 'breakeven', title: 'Точка безубыточности', url: 'tools/break-even.html', icon: '⚖️' }
            ]
        },
        { 
            id: 'docs', 
            title: 'Документы', 
            icon: '📄', 
            url: 'documents.html', 
            desc: 'Шаблоны договоров, счетов и актов',
            category: 'main',
            showInSidebar: true
        },
        { 
            id: 'learning', 
            title: 'Обучение', 
            icon: '🎓', 
            url: 'learning.html', 
            desc: 'База знаний и курсы для старта',
            category: 'main',
            showInSidebar: true
        },
        { 
            id: 'pricing', 
            title: 'Тарифы', 
            icon: '💎', 
            url: 'pricing.html', 
            desc: 'Выберите подходящий тариф',
            category: 'main',
            showInSidebar: true
        },
        { 
            id: 'settings', 
            title: 'Настройки', 
            icon: '⚙️', 
            url: 'settings.html', 
            category: 'footer',
            showInSidebar: true
        }
    ]
};

window.AppConfig = AppConfig;

// Load Supabase Client if not present
(function() {
    if (!document.getElementById('supabase-js')) {
        // Determine base path for assets
        let assetsPath = 'assets/js/';
        const path = window.location.pathname;
        
        if (path.includes('/platform/tools/') || path.includes('/platform/resources/')) {
            assetsPath = '../../assets/js/';
        } else if (path.includes('/platform/')) {
            assetsPath = '../assets/js/';
        } else if (path.includes('/tools/') || path.includes('/auth/')) {
            assetsPath = '../assets/js/';
        }

        // 1. Supabase
        const script = document.createElement('script');
        script.id = 'supabase-js';
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
        script.onload = () => {
            console.log('Supabase SDK loaded');
            // Load Service Wrapper
            const serviceScript = document.createElement('script');
            serviceScript.src = assetsPath + 'services/supabase-service.js';
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
        aiScript.src = assetsPath + 'ai/advisor.js';
        document.head.appendChild(aiScript);
    }
})();
