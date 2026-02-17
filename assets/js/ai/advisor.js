
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
            const margin = project.unitData.margin || 0;
            const avgCheck = project.unitData.averageCheck || 0;
            const cac = project.unitData.cac || 0;
            const apc = project.unitData.apc || 1;
            
            const marginPercent = avgCheck > 0 ? (margin / avgCheck) * 100 : 0;
            const ltv = margin * apc;
            const ltvCacRatio = cac > 0 ? ltv / cac : 0;
            
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

            if (ltvCacRatio > 0 && ltvCacRatio < 3) {
                 insights.push({
                    type: 'danger',
                    title: 'Проблема с окупаемостью',
                    text: `LTV/CAC = ${ltvCacRatio.toFixed(1)}. Инвесторы ищут >3. Вы тратите слишком много на привлечение.`
                });
            }
        } else {
             insights.push({
                type: 'info',
                title: 'Заполните Юнит-экономику',
                text: 'Чтобы получить советы по ценообразованию, воспользуйтесь калькулятором.'
            });
        }

        // 2. Break-Even Analysis
        if (project.breakEvenData) {
            const bep = project.breakEvenData;
            if (bep.fixedCosts > 0 && bep.price > bep.variableCost) {
                const breakEvenUnits = Math.ceil(bep.fixedCosts / (bep.price - bep.variableCost));
                if (breakEvenUnits > 1000) { // Arbitrary threshold for "hard to reach"
                    insights.push({
                        type: 'warning',
                        title: 'Высокая точка безубыточности',
                        text: `Вам нужно продать ${breakEvenUnits} единиц, чтобы выйти в ноль. Проверьте постоянные расходы.`
                    });
                }
            }
        }

        // 3. ROI Analysis
        if (project.roiCalculatorData) {
            const roi = project.roiCalculatorData.roi || 0;
            if (roi > 100) {
                insights.push({
                    type: 'success',
                    title: 'Высокий ROI',
                    text: `Возврат инвестиций ${roi.toFixed(0)}%. Это отличный результат для вложений.`
                });
            } else if (roi < 0) {
                insights.push({
                    type: 'danger',
                    title: 'Отрицательный ROI',
                    text: `Инвестиции не окупаются. Пересмотрите стратегию.`
                });
            }
        }

        // 4. P&L Analysis
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
