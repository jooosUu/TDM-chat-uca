const MonitorService = {
    init: (socket, ui) => {
        const chatInput = document.getElementById('chat-input');
        const btnEnviar = document.getElementById('btn-enviar');
        
        // Escuchar mensajes entrantes del socket
        if (socket) {
            socket.on('chat-message', (msg) => {
                const container = document.getElementById('chat-container') || document.getElementById('chatMessages');
                if (!container) return;

                if (msg.role === 'monitor') {
                    ui.renderMyBubble(msg.text, msg.timestamp, container);
                } else {
                    ui.renderStudentBubble(msg.text, msg.timestamp, container);
                }
            });
        }

        // Emitir mensaje
        const emitMessage = () => {
            if (!chatInput) return;
            const text = chatInput.value.trim();
            if (!text) return;

            const msgData = {
                sender: 'Monitor Académico',
                role: 'monitor',
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
        if (chatInput && btnEnviar) {
            btnEnviar.addEventListener('click', emitMessage);
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') emitMessage();
            });
        }
    }
};

window.MonitorService = MonitorService;
