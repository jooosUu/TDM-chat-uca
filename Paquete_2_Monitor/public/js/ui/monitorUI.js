const MonitorUI = {
    renderMyBubble: (text, timestamp, container) => {
        const time = timestamp
            ? new Date(timestamp).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
            : new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });

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
        container.scrollTop = container.scrollHeight;
    },

    renderStudentBubble: (text, timestamp, container) => {
        const time = timestamp
            ? new Date(timestamp).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
            : new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });

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
        container.scrollTop = container.scrollHeight;
    }
};

window.MonitorUI = MonitorUI;
