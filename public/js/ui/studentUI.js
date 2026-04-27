const StudentUI = {
    renderMyBubble: (text, timestamp, container) => {
        const time = timestamp
            ? new Date(timestamp).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
            : new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });

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
        container.scrollTop = container.scrollHeight;
    },

    renderMonitorBubble: (text, timestamp, container, senderName = 'Monitor Académico') => {
        const time = timestamp
            ? new Date(timestamp).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
            : new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });

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
        container.scrollTop = container.scrollHeight;
    }
};

window.StudentUI = StudentUI;
