import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Debugging the environment variables
console.log('App Key:', import.meta.env.VITE_REVERB_APP_KEY);
console.log('WS Host:', import.meta.env.VITE_REVERB_HOST);
console.log('WS Port:', import.meta.env.VITE_REVERB_PORT);
console.log('WSS Port:', import.meta.env.VITE_REVERB_PORT ?? 443);
console.log('Force TLS:', (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https');

// Ensure Pusher is correctly initialized
window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'reverb',  // Ensure you're using the correct broadcaster
    key: import.meta.env.VITE_REVERB_APP_KEY,  // This must be set in your .env file
    wsHost: import.meta.env.VITE_REVERB_HOST,  // Your WebSocket host
    wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,  // WebSocket port
    wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,  // Secure WebSocket port
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',  // TLS/SSL support
    enabledTransports: ['ws', 'wss'],  // Enable WebSockets
});
