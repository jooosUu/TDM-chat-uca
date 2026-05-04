const UI = {
    showToast: (message, isSuccess = false) => {
        const toastEl = document.getElementById('toastNotification');
        if (!toastEl) return;
        toastEl.textContent = message;
        
        toastEl.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-[-20px]');
        toastEl.classList.add('opacity-100', 'translate-y-0');
        
        if (isSuccess) {
            toastEl.classList.add('bg-[#064e3b]', 'text-[#ecfdf5]');
            toastEl.classList.remove('bg-[#1f2937]', 'text-white');
        } else {
            toastEl.classList.add('bg-[#1f2937]', 'text-white');
            toastEl.classList.remove('bg-[#064e3b]', 'text-[#ecfdf5]');
        }
        
        setTimeout(() => {
            toastEl.classList.remove('opacity-100', 'translate-y-0');
            toastEl.classList.add('opacity-0', 'pointer-events-none', 'translate-y-[-20px]');
        }, 3000);
    },

    toggleVisibility: (elementId, show) => {
        const el = document.getElementById(elementId);
        if (el) {
            if (show) el.classList.remove('hidden');
            else el.classList.add('hidden');
        }
    },

    toggleSidebar: () => {
        const sidebar = document.getElementById('mobile-sidebar');
        const overlay = document.getElementById('mobile-overlay');
        if (sidebar && overlay) {
            if (sidebar.classList.contains('-translate-x-full')) {
                sidebar.classList.remove('-translate-x-full');
                overlay.classList.remove('hidden');
            } else {
                sidebar.classList.add('-translate-x-full');
                overlay.classList.add('hidden');
            }
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
