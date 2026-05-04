const StudentService = {
    init: (socket, ui) => {
        const chatInput = document.getElementById('chatInput');
        const sendBtns = document.querySelectorAll('[onclick="sendMessage()"]');
        
        // Escuchar mensajes entrantes del socket
        if (socket) {
            socket.on('chat-message', (msg) => {
                const container = document.getElementById('chat-container') || document.getElementById('chatMessages');
                if (!container) return;

                if (msg.role === 'student') {
                    ui.renderMyBubble(msg.text, msg.timestamp, container);
                } else {
                    ui.renderMonitorBubble(msg.text, msg.timestamp, container, msg.sender);
                }
            });
        }

        // Emitir mensaje
        const emitMessage = () => {
            if (!chatInput) return;
            const text = chatInput.value.trim();
            if (!text) return;

            let senderName = 'Carlos Morales';
            const googleUserData = localStorage.getItem('googleUser');
            if (googleUserData) {
                try {
                    const user = JSON.parse(googleUserData);
                    senderName = user.name;
                } catch(e) {}
            }

            const msgData = {
                sender: senderName,
                role: 'student',
                text: text,
                timestamp: new Date().toISOString()
            };

            if (socket) {
                socket.emit('chat-message', msgData);
            } else {
                const container = document.getElementById('chat-container') || document.getElementById('chatMessages');
                ui.renderMyBubble(text, msgData.timestamp, container);
            }
            chatInput.value = '';
        };

        // Bindings
        if (chatInput) {
            window.sendMessage = emitMessage; // Global for HTML onClick
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') emitMessage();
            });
            sendBtns.forEach(btn => {
                btn.removeAttribute('onclick');
                btn.addEventListener('click', emitMessage);
            });
        }
    }
};

window.StudentService = StudentService;
