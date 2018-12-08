declare module 'googlemaps';

interface Window {
    io;
    google;
    plugin;
    cordova;
}

interface User {
    _id?: string;
    name: string;
}

interface AppNotification {
    _id?: string;
    room: string;
    userId: string;
    accepted?: boolean;
}