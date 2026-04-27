const API = {
    socket: null,

    init: (role) => {
        API.socket = io();
        
        API.socket.on('connect', () => {
            console.log(`Connected to server as ${role}`);
        });

        API.socket.on('receive-message', (data) => {
            if (window.onNewMessage) {
                window.onNewMessage(data);
            }
        });
    },

    joinRoom: (roomId) => {
        if (API.socket) {
            API.socket.emit('join-room', roomId);
        }
    },

    sendMessage: (roomId, sender, text) => {
        if (API.socket) {
            const messageData = {
                roomId,
                sender,
                text,
                timestamp: new Date().toISOString()
            };
            API.socket.emit('send-message', messageData);
            return messageData;
        }
        return null;
    },

    getHistory: async (roomId) => {
        try {
            const response = await fetch(`/api/chat/history/${roomId}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching chat history:', error);
            return [];
        }
    }
};

window.API = API;
