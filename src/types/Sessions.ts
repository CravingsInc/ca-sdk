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

    lastSaveAt: Date;
    
    deviceInfo: {
        type: DeviceInfo.DeviceType,
        os: DeviceInfo.DeviceOS,
        browser: DeviceInfo.DeviceBrowser;
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
    
    expired: {
        expired: boolean;
        reason?: "unmount" | "timeout" | "manual" | null
    };
}
