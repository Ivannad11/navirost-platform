const Modal = {
    init() {
        if (!document.getElementById('navirost-modal')) {
            const el = document.createElement('div');
            el.id = 'navirost-modal';
            el.className = 'modal-overlay';
            el.innerHTML = `
                <div class="modal-card">
                    <h3 class="modal-title"></h3>
                    <div class="modal-body"></div>
                    <input type="text" class="modal-input" style="display:none;">
                    <div class="modal-actions">
                        <button class="modal-btn modal-btn-secondary" id="modal-cancel">Отмена</button>
                        <button class="modal-btn modal-btn-primary" id="modal-confirm">ОК</button>
                    </div>
                </div>
            `;
            document.body.appendChild(el);
            
            // Close on overlay click
            el.addEventListener('click', (e) => {
                if (e.target === el) Modal.close();
            });
        }
    },

    show({ title, body, input = false, confirmText = 'ОК', cancelText = 'Отмена', onConfirm }) {
        this.init();
        const el = document.getElementById('navirost-modal');
        const titleEl = el.querySelector('.modal-title');
        const bodyEl = el.querySelector('.modal-body');
        const inputEl = el.querySelector('.modal-input');
        const confirmBtn = el.querySelector('#modal-confirm');
        const cancelBtn = el.querySelector('#modal-cancel');

        titleEl.innerText = title || 'Сообщение';
        bodyEl.innerHTML = body || '';
        confirmBtn.innerText = confirmText;
        cancelBtn.innerText = cancelText;

        if (input) {
            inputEl.style.display = 'block';
            inputEl.value = '';
            inputEl.placeholder = typeof input === 'string' ? input : '';
            inputEl.focus();
        } else {
            inputEl.style.display = 'none';
        }

        // Handlers
        const handleConfirm = () => {
            if (input && !inputEl.value.trim()) {
                inputEl.style.borderColor = '#EF4444';
                return;
            }
            if (onConfirm) onConfirm(input ? inputEl.value : true);
            Modal.close();
            cleanup();
        };

        const handleCancel = () => {
            Modal.close();
            cleanup();
        };

        const handleKey = (e) => {
            if (e.key === 'Enter') handleConfirm();
            if (e.key === 'Escape') handleCancel();
        };

        function cleanup() {
            confirmBtn.removeEventListener('click', handleConfirm);
            cancelBtn.removeEventListener('click', handleCancel);
            inputEl.removeEventListener('keydown', handleKey);
        }

        confirmBtn.addEventListener('click', handleConfirm);
        cancelBtn.addEventListener('click', handleCancel);
        inputEl.addEventListener('keydown', handleKey);

        el.style.display = 'flex';
        // Force reflow
        el.offsetHeight; 
        el.classList.add('active');
        
        if (input) setTimeout(() => inputEl.focus(), 50);
    },

    close() {
        const el = document.getElementById('navirost-modal');
        if (el) {
            el.classList.remove('active');
            setTimeout(() => {
                el.style.display = 'none';
            }, 200);
        }
    },

    // Shortcuts
    alert(title, body) {
        this.show({ title, body, cancelText: 'Закрыть', confirmText: 'ОК' });
    },

    confirm(title, body, onConfirm) {
        this.show({ title, body, onConfirm });
    },

    prompt(title, body, onConfirm) {
        this.show({ title, body, input: 'Введите значение...', onConfirm });
    }
    // --- Toast Notifications ---
    
    toastContainer: null,

    showToast(message, type = 'success') { // success, error, info
        if (!this.toastContainer) {
            this.toastContainer = document.createElement('div');
            this.toastContainer.className = 'toast-container';
            document.body.appendChild(this.toastContainer);
        }

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let icon = '✅';
        if (type === 'error') icon = '❌';
        if (type === 'info') icon = 'ℹ️';

        toast.innerHTML = `<span class="toast-icon">${icon}</span> ${message}`;
        
        this.toastContainer.appendChild(toast);

        // Auto remove
        setTimeout(() => {
            toast.style.animation = 'toastFadeOut 0.3s forwards';
            setTimeout(() => {
                if (toast.parentNode) toast.parentNode.removeChild(toast);
            }, 300);
        }, 3000);
    },

    // --- Loading States ---
    
    setLoading(btnElement, isLoading, originalText = '') {
        if (isLoading) {
            btnElement.classList.add('btn-loading');
            btnElement.dataset.originalText = btnElement.innerText;
            // Preserve width to avoid jump
            btnElement.style.minWidth = btnElement.offsetWidth + 'px';
            btnElement.innerHTML = '<span class="spinner"></span> Загрузка...';
            btnElement.disabled = true;
        } else {
            btnElement.classList.remove('btn-loading');
            btnElement.innerHTML = originalText || btnElement.dataset.originalText || 'OK';
            btnElement.style.minWidth = '';
            btnElement.disabled = false;
        }
    }
};

window.Modal = Modal;
