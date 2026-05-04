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
    },

    applyGoogleUserData: () => {
        const googleUserData = localStorage.getItem('googleUser');
        if (!googleUserData) return;

        try {
            const user = JSON.parse(googleUserData);
            const givenName = user.name.split(' ')[0] || user.name;
            
            // Actualizar el saludo principal
            document.querySelectorAll('h1').forEach(h1 => {
                if (h1.textContent.includes('Buenos días')) {
                    h1.innerHTML = `Buenos días, ${givenName}`;
                }
            });

            // Actualizar el input con el nombre completo en configuración
            const inputs = document.querySelectorAll('input[disabled]');
            inputs.forEach(input => {
                if (input.value.includes('Carlos Morales') || input.value.includes('Monitor Académico') || input.type === 'text') {
                    if (input.closest('.bg-white') && input.disabled) {
                        input.value = user.name;
                    }
                }
            });

            // Actualizar avatares
            const settingsAvatar = document.getElementById('settings-avatar');
            if (settingsAvatar && user.picture) {
                settingsAvatar.src = user.picture;
            }

            document.querySelectorAll('.user-avatar').forEach(img => {
                if (user.picture) {
                    img.src = user.picture;
                }
            });
            
        } catch (e) {
            console.error('Error applying Google user data', e);
        }
    }
};

window.UI = UI;

document.addEventListener('DOMContentLoaded', () => {
    UI.applyGoogleUserData();
});
