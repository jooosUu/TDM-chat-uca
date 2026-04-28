let selectedRole = '';

// Define el rol y muestra la pantalla de acceso
function enterAsStudent() {
    selectedRole = 'student';
    UI.toggleVisibility('page-profile', false);
    UI.toggleVisibility('page-login', true);
}

// Define el rol y muestra la pantalla de acceso
function enterAsMonitor() {
    selectedRole = 'monitor';
    UI.toggleVisibility('page-profile', false);
    UI.toggleVisibility('page-login', true);
}

// Redirige al panel correspondiente según el rol
function finishLogin() {
    if (selectedRole === 'student') {
        window.location.href = 'estudiante.html';
    } else {
        window.location.href = 'monitor.html';
    }
}

// ===== SOCKET & ROLE DETECTION =====

const socket = typeof io !== 'undefined' ? io() : null;

// Intenta deducir el rol a partir de la URL actual
function detectRole() {
    const page = window.location.pathname;
    if (page.includes('estudiante')) return 'student';
    if (page.includes('monitor')) return 'monitor';
    return '';
}

const currentRole = detectRole();

// ===== BUBBLE RENDERERS =====

// Genera la burbuja de mensajes propios según el rol
function renderMyBubble(text, timestamp, container, role) {
    const time = timestamp
        ? new Date(timestamp).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
        : new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });

    if (role === 'monitor') {
        // Vista del monitor: mensaje alineado a la derecha con estilo oscuro
        container.insertAdjacentHTML('beforeend', `
            <div class="flex flex-row items-end justify-end gap-3 ml-auto max-w-3xl">
                <div class="bg-[#0a1628] text-white p-4 rounded-2xl rounded-br-none shadow-sm text-sm leading-relaxed">
                    ${text}
                </div>
                <div class="w-8 h-8 rounded-full bg-[#0a1628] flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4 stroke-white fill-none stroke-2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
            </div>
        `);
    } else {
        // Vista del estudiante: mensaje propio con estilo más ligero
        container.insertAdjacentHTML('beforeend', `
            <div class="flex flex-col items-end ml-auto max-w-[80%]">
                <div class="flex items-center gap-2 mb-2 mr-1">
                    <span class="text-[9px] text-gray-400">${time}</span>
                    <span class="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Tú</span>
                </div>
                <div class="bg-[#eef1f4] text-[#0a1628] p-4 rounded-2xl rounded-tr-none shadow-sm text-sm leading-relaxed border border-[#e5e7eb]">
                    ${text}
                </div>
            </div>
        `);
    }
}

// Genera la burbuja de mensajes del otro usuario
function renderOtherBubble(text, timestamp, container, senderRole) {
    const time = timestamp
        ? new Date(timestamp).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
        : new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });

    const senderName = senderRole === 'monitor' ? 'Monitor Académico' : 'Carlos Morales';

    if (currentRole === 'monitor') {
        // El monitor ve al estudiante en la izquierda con avatar
        container.insertAdjacentHTML('beforeend', `
            <div class="flex flex-row items-end gap-3 max-w-3xl">
                <div class="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                    <img src="https://image.qwenlm.ai/public_source/86c0ed85-d19e-4e1b-a8f5-72cdb594ef24/18c71744a-8a6b-4666-9933-adb749520eb0.png" class="w-full h-full object-cover">
                </div>
                <div class="bg-white text-[#0a1628] p-4 rounded-2xl rounded-bl-none shadow-sm text-sm leading-relaxed border border-gray-100">
                    ${text}
                </div>
            </div>
        `);
    } else {
        // El estudiante ve al monitor con estilo destacado
        container.insertAdjacentHTML('beforeend', `
            <div class="flex flex-col items-start max-w-[80%]">
                <div class="flex items-center gap-2 mb-2 ml-1">
                    <span class="text-[10px] font-bold text-[#0a1628] uppercase tracking-widest">${senderName}</span>
                    <span class="text-[9px] text-gray-400">${time}</span>
                </div>
                <div class="bg-[#0a1628] text-white p-4 rounded-2xl rounded-tl-none shadow-md text-sm leading-relaxed">
                    ${text}
                </div>
            </div>
        `);
    }
}

// ===== CHAT CONTAINER =====

// Devuelve el contenedor principal del chat según la vista
function getChatContainer() {
    return document.getElementById('chat-container') || document.getElementById('chatMessages');
}

// ===== LOAD PERSISTED DATA =====

// Recupera perfil y mensajes guardados desde el servidor
async function loadPersistedData() {
    if (!currentRole) return;

    try {
        const res = await fetch('/api/data');
        const db = await res.json();

        // Aplica configuración del perfil (avatar y estado)
        const profile = db.profiles?.[currentRole];
        if (profile) {
            if (profile.avatar) {
                const settingsAvatar = document.getElementById('settings-avatar');
                if (settingsAvatar) settingsAvatar.src = profile.avatar;
                document.querySelectorAll('.user-avatar').forEach(img => { img.src = profile.avatar; });
            }

            const statusSelect = document.getElementById('user-status-select');
            if (statusSelect && profile.status) {
                statusSelect.value = profile.status;
            }
        }

        // Reconstruye el historial de mensajes en pantalla
        const container = getChatContainer();
        if (container && db.messages && db.messages.length > 0) {
            container.innerHTML = '';

            container.insertAdjacentHTML('beforeend', `
                <div class="flex justify-center">
                    <div class="bg-gray-100 text-gray-400 text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em]">
                        Historial restaurado
                    </div>
                </div>
            `);

            db.messages.forEach(msg => {
                if (msg.role === currentRole) {
                    renderMyBubble(msg.text, msg.timestamp, container, currentRole);
                } else {
                    renderOtherBubble(msg.text, msg.timestamp, container, msg.role);
                }
            });

            container.scrollTop = container.scrollHeight;
        }
    } catch (err) {
        console.warn('Could not load persisted data:', err);
    }
}

// ===== MAIN INITIALIZATION =====

document.addEventListener('DOMContentLoaded', () => {
    console.log('UCA Academic Sanctuary - Main Initialized');

    // Controla el comportamiento visual de los switches
    document.querySelectorAll('.toggle-switch').forEach(toggle => {
        toggle.addEventListener('click', () => {
            const isActive = toggle.dataset.active === 'true';
            const knob = toggle.querySelector('.toggle-knob');

            if (isActive) {
                toggle.classList.remove('bg-[#0a1628]');
                toggle.classList.add('bg-gray-200');
                knob.classList.remove('right-1');
                knob.classList.add('left-1');
                toggle.dataset.active = 'false';
            } else {
                toggle.classList.remove('bg-gray-200');
                toggle.classList.add('bg-[#0a1628]');
                knob.classList.remove('left-1');
                knob.classList.add('right-1');
                toggle.dataset.active = 'true';
            }
        });
    });

    // Maneja la actualización de la foto de perfil
    const avatarUpload = document.getElementById('avatar-upload');
    if (avatarUpload) {
        avatarUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file || !file.type.startsWith('image/')) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                const newSrc = event.target.result;

                const settingsAvatar = document.getElementById('settings-avatar');
                if (settingsAvatar) settingsAvatar.src = newSrc;
                document.querySelectorAll('.user-avatar').forEach(img => { img.src = newSrc; });

                if (socket && currentRole) {
                    socket.emit('profile-change', { role: currentRole, field: 'avatar', value: newSrc });
                }

                if (typeof UI !== 'undefined' && UI.showToast) {
                    UI.showToast('Foto de perfil actualizada', true);
                }
            };
            reader.readAsDataURL(file);
        });
    }

    // Guarda cambios en el estado del usuario
    const statusSelect = document.getElementById('user-status-select');
    if (statusSelect && currentRole) {
        statusSelect.addEventListener('change', () => {
            if (socket) {
                socket.emit('profile-change', { role: currentRole, field: 'status', value: statusSelect.value });
            }
        });
    }

    // ===== CHAT SEND LOGIC =====

    const chatInputMonitor = document.getElementById('chat-input');
    const btnEnviar = document.getElementById('btn-enviar');
    const chatInputStudent = document.getElementById('chatInput');
    const container = getChatContainer();

    // Centraliza el envío de mensajes para ambos roles
    function emitMessage(inputEl) {
        const text = inputEl.value.trim();
        if (!text) return;

        const msgData = {
            sender: currentRole === 'monitor' ? 'Monitor Académico' : 'Carlos Morales',
            role: currentRole,
            text: text,
            timestamp: new Date().toISOString()
        };

        if (socket) {
            socket.emit('chat-message', msgData);
        } else {
            renderMyBubble(text, msgData.timestamp, container, currentRole);
        }

        inputEl.value = '';
    }

    // Eventos del chat para monitor
    if (chatInputMonitor && btnEnviar) {
        btnEnviar.addEventListener('click', () => emitMessage(chatInputMonitor));
        chatInputMonitor.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') emitMessage(chatInputMonitor);
        });
    }

    // Eventos del chat para estudiante
    if (chatInputStudent) {
        window.sendMessage = () => emitMessage(chatInputStudent);
        chatInputStudent.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') emitMessage(chatInputStudent);
        });

        const studentSendBtns = document.querySelectorAll('[onclick="sendMessage()"]');
        studentSendBtns.forEach(btn => {
            btn.removeAttribute('onclick');
            btn.addEventListener('click', () => emitMessage(chatInputStudent));
        });
    }

    // ===== FILE UPLOAD =====

    const fileUpload = document.getElementById('file-upload');
    if (fileUpload && container) {
        fileUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const sizeKB = (file.size / 1024).toFixed(1);

            // Renderiza archivo enviado según el rol

            container.scrollTop = container.scrollHeight;
            e.target.value = '';
        });
    }

    // ===== SOCKET EVENTS =====

    if (socket) {
        // Recibe mensajes en tiempo real
        socket.on('chat-message', (msg) => {
            const chatArea = getChatContainer();
            if (!chatArea) return;

            if (msg.role === currentRole) {
                renderMyBubble(msg.text, msg.timestamp, chatArea, currentRole);
            } else {
                renderOtherBubble(msg.text, msg.timestamp, chatArea, msg.role);
            }

            chatArea.scrollTop = chatArea.scrollHeight;
        });

        // Sincroniza cambios de perfil entre sesiones
        socket.on('profile-updated', (data) => {
            if (data.role === currentRole && data.profile) {
                if (data.profile.avatar) {
                    document.querySelectorAll('.user-avatar').forEach(img => { img.src = data.profile.avatar; });
                    const settingsAvatar = document.getElementById('settings-avatar');
                    if (settingsAvatar) settingsAvatar.src = data.profile.avatar;
                }

                const statusSelect = document.getElementById('user-status-select');
                if (statusSelect && data.profile.status) {
                    statusSelect.value = data.profile.status;
                }
            }
        });
    }

    // Carga estado inicial al abrir la aplicación
    loadPersistedData();
});