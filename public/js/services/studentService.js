const StudentService = {
    // Función principal que inicializa el chat
    init: (socket, ui) => {

        // Obtiene el input donde el usuario escribe mensajes
        const chatInput = document.getElementById('chatInput');

        // Obtiene todos los botones que antes usaban onclick="sendMessage()"
        const sendBtns = document.querySelectorAll('[onclick="sendMessage()"]');
        

        // ESCUCHAR MENSAJES DEL SERVIDOR

        if (socket) {
            // Se ejecuta cada vez que llega un mensaje por el socket
            socket.on('chat-message', (msg) => {

                // Busca el contenedor donde se mostrarán los mensajes
                const container = document.getElementById('chat-container') || document.getElementById('chatMessages');
                if (!container) return; // Si no existe, no hace nada

                // Si el mensaje es del estudiante 
                if (msg.role === 'student') {
                    // Lo dibuja como mensaje propio (lado derecho)
                    ui.renderMyBubble(msg.text, msg.timestamp, container);
                } else {
                    // Si es de otra persona (monitor u otro rol)
                    // Lo dibuja como mensaje externo (lado izquierdo)
                    ui.renderMonitorBubble(msg.text, msg.timestamp, container, msg.sender);
                }
            });
        }

   
        // FUNCIÓN PARA ENVIAR MENSAJES
  
        const emitMessage = () => {

            // Verifica que exista el input
            if (!chatInput) return;

            // Obtiene el texto escrito y elimina espacios innecesarios
            const text = chatInput.value.trim();

            // Si está vacío, no envía nada
            if (!text) return;

            // Crea el objeto del mensaje con toda la información necesaria
            const msgData = {
                sender: 'Carlos Morales', 
                role: 'student',          
                text: text,              
                timestamp: new Date().toISOString() 
            };

            // Si hay conexión con el servidor
            if (socket) {
                // Envía el mensaje al backend mediante socket
                socket.emit('chat-message', msgData);
            } else {
                // Si no hay socket (modo local), solo lo muestra en pantalla
                const container = document.getElementById('chat-container') || document.getElementById('chatMessages');
                ui.renderMyBubble(text, msgData.timestamp, container);
            }

            // Limpia el input después de enviar el mensaje
            chatInput.value = '';
        };

     
        // EVENTOS Y CONEXIONES (BINDINGS)
      
        if (chatInput) {

            // Hace disponible la función globalmente (para HTML antiguo con onclick)
            window.sendMessage = emitMessage;

            // Permite enviar el mensaje al presionar la tecla Enter
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') emitMessage();
            });

            // Reemplaza los onclick del HTML por eventos modernos en JS
            sendBtns.forEach(btn => {
                btn.removeAttribute('onclick'); 
                btn.addEventListener('click', emitMessage); 
            });
        }
    }
};


window.StudentService = StudentService;