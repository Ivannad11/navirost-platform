
// AI Advisor Service
// This mimics an AI analysis of the project's financial health.
// In production, this would call a real LLM API (e.g. Gemini/OpenAI).

const AIAdvisor = {
    
    // Analyze a project and return insights
    analyzeProject: function(project) {
        if (!project) return [];
        
        const insights = [];
        
        // 1. Unit Economics Analysis
        if (project.unitData) {
            const margin = project.unitData.margin;
            const avgCheck = project.unitData.averageCheck;
            const cac = project.unitData.cac;
            
            const marginPercent = avgCheck > 0 ? (margin / avgCheck) * 100 : 0;
            
            if (marginPercent < 20) {
                insights.push({
                    type: 'warning',
                    title: 'Низкая маржинальность',
                    text: `Ваша маржа всего ${marginPercent.toFixed(1)}%. Это рискованно. Попробуйте снизить себестоимость или поднять цену.`
                });
            } else if (marginPercent > 60) {
                insights.push({
                    type: 'success',
                    title: 'Отличная маржа!',
                    text: `Маржинальность ${marginPercent.toFixed(1)}% позволяет масштабироваться. Вкладывайте в маркетинг.`
                });
            }

            // LTV/CAC Ratio check
            // Need to recalc LTV here as it's not always stored directly, but let's assume simple check
            // LTV ~ Margin * APC. 
            const ltv = margin * (project.unitData.apc || 1);
            if (cac > 0) {
                const ratio = ltv / cac;
                if (ratio < 3) {
                     insights.push({
                        type: 'danger',
                        title: 'Проблема с окупаемостью',
                        text: `LTV/CAC = ${ratio.toFixed(1)}. Инвесторы ищут >3. Вы тратите слишком много на привлечение.`
                    });
                }
            }
        } else {
             insights.push({
                type: 'info',
                title: 'Заполните Юнит-экономику',
                text: 'Чтобы получить советы по ценообразованию, воспользуйтесь калькулятором.'
            });
        }

        // 2. P&L Analysis
        if (project.pnlData) {
            const profit = project.pnlData.profit || 0;
            if (profit < 0) {
                 insights.push({
                    type: 'danger',
                    title: 'Проект убыточен',
                    text: 'Судя по P&L, вы теряете деньги. Проверьте постоянные расходы (OPEX).'
                });
            }
        }

        return insights;
    },

    // Get a random "Business Tip of the Day"
    getDailyTip: function() {
        const tips = [
            "Считайте деньги до того, как их потратить.",
            "CAC (стоимость клиента) всегда растет со временем. Закладывайте запас.",
            "Не смешивайте личные деньги и деньги бизнеса.",
            "Скидки убивают маржу. Лучше дарите подарки.",
            "Если LTV меньше 3x CAC, ваша модель не масштабируема."
        ];
        return tips[Math.floor(Math.random() * tips.length)];
    }
};

window.AIAdvisor = AIAdvisor;
