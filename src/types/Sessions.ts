import { DeviceInfo } from "./enums";
import { LocationData } from "./Location";
import { Referrer } from "./Referrer";

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

    referrer: Referrer;

    location?: LocationData;
    
    expired: {
        expired: boolean;
        reason?: "unmount" | "timeout" | "manual" | null
    };
}
