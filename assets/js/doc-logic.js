const templates = {
    nda: {
        title: "Соглашение о неразглашении (NDA)",
        fields: [
            { id: "company", label: "Ваша компания / ФИО", type: "text", placeholder: "ИП Иванов И.И." },
            { id: "contractor", label: "Исполнитель / Партнер", type: "text", placeholder: "ООО 'Ромашка'" },
            { id: "date", label: "Дата", type: "date" },
            { id: "city", label: "Город", type: "text", placeholder: "Москва" },
            { id: "penalty", label: "Штраф за нарушение", type: "number", placeholder: "500000" }
        ],
        content: `
            <h1>СОГЛАШЕНИЕ О НЕРАЗГЛАШЕНИИ</h1>
            <p style="text-align: right;">г. <span class="placeholder" data-field="city">Москва</span>, <span class="placeholder" data-field="date">01.01.2026</span></p>
            <p><strong><span class="placeholder" data-field="company">ИП Иванов И.И.</span></strong>, именуемое в дальнейшем «Раскрывающая сторона», с одной стороны, и <strong><span class="placeholder" data-field="contractor">ООО 'Ромашка'</span></strong>, именуемое в дальнейшем «Получающая сторона», с другой стороны, заключили настоящее Соглашение о нижеследующем:</p>
            <p>1. ПРЕДМЕТ СОГЛАШЕНИЯ</p>
            <p>1.1. Раскрывающая сторона передает Получающей стороне информацию, составляющую коммерческую тайну, а Получающая сторона обязуется сохранять ее конфиденциальность.</p>
            <p>2. ОБЯЗАТЕЛЬСТВА СТОРОН</p>
            <p>2.1. Получающая сторона обязуется не разглашать третьим лицам любую информацию, полученную от Раскрывающей стороны.</p>
            <p>2.2. В случае нарушения условий данного соглашения, Получающая сторона обязуется выплатить штраф в размере <strong><span class="placeholder" data-field="penalty">500000</span> рублей</strong>.</p>
            <p>3. СРОК ДЕЙСТВИЯ</p>
            <p>3.1. Настоящее Соглашение вступает в силу с момента подписания и действует бессрочно.</p>
            <br><br>
            <p>ПОДПИСИ СТОРОН:</p>
            <table style="width: 100%; margin-top: 20px;">
                <tr>
                    <td style="width: 50%; vertical-align: top;">
                        <strong>Раскрывающая сторона:</strong><br>
                        <span class="placeholder" data-field="company">ИП Иванов И.И.</span><br>
                        _________________ /Подпись/
                    </td>
                    <td style="width: 50%; vertical-align: top;">
                        <strong>Получающая сторона:</strong><br>
                        <span class="placeholder" data-field="contractor">ООО 'Ромашка'</span><br>
                        _________________ /Подпись/
                    </td>
                </tr>
            </table>
        `
    },
    service: {
        title: "Договор оказания услуг",
        fields: [
            { id: "customer", label: "Заказчик", type: "text", placeholder: "ООО 'Стартап'" },
            { id: "performer", label: "Исполнитель", type: "text", placeholder: "ИП Петров П.П." },
            { id: "service", label: "Услуга", type: "text", placeholder: "Разработка веб-сайта" },
            { id: "price", label: "Стоимость (руб)", type: "number", placeholder: "100000" },
            { id: "deadline", label: "Срок выполнения", type: "date" }
        ],
        content: `
            <h1>ДОГОВОР ОКАЗАНИЯ УСЛУГ</h1>
            <p><strong><span class="placeholder" data-field="customer">ООО 'Стартап'</span></strong>, именуемое в дальнейшем «Заказчик», и <strong><span class="placeholder" data-field="performer">ИП Петров П.П.</span></strong>, именуемое в дальнейшем «Исполнитель», заключили настоящий Договор:</p>
            <p>1. ПРЕДМЕТ ДОГОВОРА</p>
            <p>1.1. Исполнитель обязуется оказать услуги: <strong><span class="placeholder" data-field="service">Разработка веб-сайта</span></strong>, а Заказчик обязуется оплатить эти услуги.</p>
            <p>2. СТОИМОСТЬ И ПОРЯДОК РАСЧЕТОВ</p>
            <p>2.1. Стоимость услуг составляет <strong><span class="placeholder" data-field="price">100000</span> рублей</strong>.</p>
            <p>2.2. Оплата производится в течение 3 дней после подписания Акта.</p>
            <p>3. СРОКИ ВЫПОЛНЕНИЯ</p>
            <p>3.1. Услуги должны быть оказаны в срок до <strong><span class="placeholder" data-field="deadline">01.02.2026</span></strong>.</p>
            <br><br>
            <p>РЕКВИЗИТЫ И ПОДПИСИ:</p>
            <table style="width: 100%; margin-top: 20px;">
                <tr>
                    <td style="width: 50%; vertical-align: top;">
                        <strong>Заказчик:</strong><br>
                        <span class="placeholder" data-field="customer">ООО 'Стартап'</span><br>
                        _________________
                    </td>
                    <td style="width: 50%; vertical-align: top;">
                        <strong>Исполнитель:</strong><br>
                        <span class="placeholder" data-field="performer">ИП Петров П.П.</span><br>
                        _________________
                    </td>
                </tr>
            </table>
        `
    },
    invoice: {
        title: "Счет на оплату",
        fields: [
            { id: "number", label: "Номер счета", type: "text", placeholder: "123" },
            { id: "date", label: "Дата", type: "date" },
            { id: "supplier", label: "Поставщик", type: "text", placeholder: "ИП Сидоров С.С." },
            { id: "customer", label: "Покупатель", type: "text", placeholder: "ООО 'Клиент'" },
            { id: "item", label: "Наименование товара/услуги", type: "text", placeholder: "Консультация" },
            { id: "amount", label: "Сумма", type: "number", placeholder: "15000" }
        ],
        content: `
            <h1>СЧЕТ № <span class="placeholder" data-field="number">123</span> от <span class="placeholder" data-field="date">01.01.2026</span></h1>
            <p><strong>Поставщик:</strong> <span class="placeholder" data-field="supplier">ИП Сидоров С.С.</span></p>
            <p><strong>Покупатель:</strong> <span class="placeholder" data-field="customer">ООО 'Клиент'</span></p>
            
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px; border: 1px solid #000;">
                <tr style="background: #eee;">
                    <th style="border: 1px solid #000; padding: 8px;">№</th>
                    <th style="border: 1px solid #000; padding: 8px;">Наименование</th>
                    <th style="border: 1px solid #000; padding: 8px;">Кол-во</th>
                    <th style="border: 1px solid #000; padding: 8px;">Ед.</th>
                    <th style="border: 1px solid #000; padding: 8px;">Цена</th>
                    <th style="border: 1px solid #000; padding: 8px;">Сумма</th>
                </tr>
                <tr>
                    <td style="border: 1px solid #000; padding: 8px; text-align: center;">1</td>
                    <td style="border: 1px solid #000; padding: 8px;"><span class="placeholder" data-field="item">Консультация</span></td>
                    <td style="border: 1px solid #000; padding: 8px; text-align: center;">1</td>
                    <td style="border: 1px solid #000; padding: 8px; text-align: center;">шт</td>
                    <td style="border: 1px solid #000; padding: 8px; text-align: right;"><span class="placeholder" data-field="amount">15000</span></td>
                    <td style="border: 1px solid #000; padding: 8px; text-align: right;"><span class="placeholder" data-field="amount">15000</span></td>
                </tr>
            </table>
            
            <p style="margin-top: 20px;"><strong>Итого к оплате: <span class="placeholder" data-field="amount">15000</span> руб.</strong></p>
            <p>Без налога (НДС).</p>
            <br>
            <p>Руководитель _________________ (Подпись)</p>
        `
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type');
    const template = templates[type];

    if (!template) {
        document.getElementById('docTitle').innerText = "Шаблон не найден";
        return;
    }

    document.getElementById('docTitle').innerText = template.title;
    document.getElementById('paperContent').innerHTML = template.content;

    const formContainer = document.getElementById('formContainer');

    // Generate Inputs
    template.fields.forEach(field => {
        const div = document.createElement('div');
        div.className = 'form-group';
        
        const label = document.createElement('label');
        label.innerText = field.label;
        
        const input = document.createElement('input');
        input.type = field.type;
        input.className = 'form-input';
        input.placeholder = field.placeholder || '';
        input.dataset.field = field.id;
        
        // Auto-fill logic from Settings
        const user = DataManager.getUser();
        if (user) {
            if (field.id === 'company' || field.id === 'performer' || field.id === 'supplier') {
                if (user.company) input.value = user.company;
            }
            if (field.id === 'city' && user.city) {
                input.value = user.city;
            }
            // For now assume user is performer/supplier usually, or company owner
        }
        
        // Default date to today if date field
        if (field.type === 'date') {
            input.valueAsDate = new Date();
        }

        input.addEventListener('input', updateDoc);
        
        div.appendChild(label);
        div.appendChild(input);
        formContainer.appendChild(div);
    });

    // Initial update to sync default values
    updateDoc();
});

function updateDoc() {
    const inputs = document.querySelectorAll('.form-input');
    inputs.forEach(input => {
        const fieldId = input.dataset.field;
        const val = input.value || input.placeholder;
        
        // Find placeholders in document
        const placeholders = document.querySelectorAll(`.paper .placeholder[data-field="${fieldId}"]`);
        placeholders.forEach(ph => {
            ph.innerText = val;
            // Highlight change slightly
            ph.style.backgroundColor = input.value ? 'transparent' : '#FEF3C7';
        });
    });
}
