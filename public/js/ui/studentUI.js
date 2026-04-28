const StudentUI = {

  
    // INSERTAR MENSAJE DEL (ESTUDIANTE)

    renderMyBubble: (text, timestamp, container) => {

        // Calcula la hora del mensaje:
        // Si viene un timestamp lo usa, si no usa la hora actual
        const time = timestamp
            ? new Date(timestamp).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
            : new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });

        // Inserta el mensaje al final del contenedor del chat
        container.insertAdjacentHTML('beforeend', `
            <div class="flex flex-col items-end ml-auto max-w-[80%]">
                
                <!-- Encabezado del mensaje (hora + etiqueta "Tú") -->
                <div class="flex items-center gap-2 mb-2 mr-1">
                    <span class="text-[9px] text-gray-400">${time}</span>
                    <span class="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Tú</span>
                </div>

                <!-- Burbuja del mensaje -->
                <div class="bg-[#eef1f4] text-[#0a1628] p-4 rounded-2xl rounded-tr-none shadow-sm text-sm leading-relaxed border border-[#e5e7eb]">
                    ${text}
                </div>
            </div>
        `);

        // Hace scroll automático hacia el último mensaje
        container.scrollTop = container.scrollHeight;
    },

 
    // INSERTAR MENSAJE DE OTRO USUARIO (MONITOR)

    renderMonitorBubble: (text, timestamp, container, senderName = 'Monitor Academico') => {

        // Calcula la hora del mensaje igual que en el anterior
        const time = timestamp
            ? new Date(timestamp).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
            : new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });

        // Inserta el mensaje en el contenedor
        container.insertAdjacentHTML('beforeend', `
            <div class="flex flex-col items-start max-w-[80%]">

                <!-- Encabezado del mensaje (nombre del remitente + hora) -->
                <div class="flex items-center gap-2 mb-2 ml-1">
                    <span class="text-[10px] font-bold text-[#0a1628] uppercase tracking-widest">${senderName}</span>
                    <span class="text-[9px] text-gray-400">${time}</span>
                </div>

                <!-- Burbuja del mensaje -->
                <div class="bg-[#0a1628] text-white p-4 rounded-2xl rounded-tl-none shadow-md text-sm leading-relaxed">
                    ${text}
                </div>
            </div>
        `);

        // Mantiene el scroll siempre abajo para ver el último mensaje
        container.scrollTop = container.scrollHeight;
    }
};

window.StudentUI = StudentUI;