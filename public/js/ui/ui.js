const UI = {
    showToast: (message, isSuccess = false) => {
        const toastEl = document.getElementById('toastNotification');
        if (!toastEl) return;
        toastEl.textContent = message;
        toastEl.className = `fixed top-5 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 toast-notification show ${isSuccess ? 'success' : ''}`;
        
        setTimeout(() => {
            toastEl.classList.remove('show');
        }, 3000);
    },

    toggleVisibility: (elementId, show) => {
        const el = document.getElementById(elementId);
        if (el) {
            if (show) el.classList.remove('hidden');
            else el.classList.add('hidden');
        }
    },

    setActiveNavItem: (pageId) => {
        document.querySelectorAll('.sidebar-nav-item').forEach(item => {
            if (item.getAttribute('data-page') === pageId) {
                item.classList.add('text-[#0a1628]', 'font-bold');
                item.classList.remove('text-gray-500', 'font-medium');
            } else {
                item.classList.remove('text-[#0a1628]', 'font-bold');
                item.classList.add('text-gray-500', 'font-medium');
            }
        });
    }
};

window.UI = UI;
