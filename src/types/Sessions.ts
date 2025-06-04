import { DeviceInfo } from "./enums";

export type Sessions = {
    id: string;
    
    user: {
        id: string | null; // userId
        wasLoggedIn: boolean; // If user was logged in
        timeUntilLoggedIn: number; // time until user logged in, in milliseconds.
    };

    createdAt: Date;

    lastActiveAt: Date;
    
    deviceInfo: {
        type: DeviceInfo.DeviceType,
        os: DeviceInfo.DeviceOS,
        browser: DeviceInfo.DeviceBroswer;
    };

    location?: {
        country: string;
        city: string;
        region: string;
        coordinates?: {
            lat: number;
            lng: number;
        }
    };
    
    expired: boolean;
}


