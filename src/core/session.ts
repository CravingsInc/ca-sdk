import { v4 as uuidv4 } from 'uuid';
import { DeviceInfo, Sessions } from '../types';
import { useEffect } from 'react';

export class SessionManager {

    // Static
    private static _sessionManager: SessionManager | null = null;

    // Instance
    private SESSION_KEY = "__cravings_ca_sdk_session";
    private _session: Sessions | null = null;

    private constructor( userId?: string ) {
        const stored = localStorage.getItem( this.SESSION_KEY );

        const now = new Date();

        if ( stored ) {
            try {
                const parsed: Sessions = JSON.parse(stored);

                parsed.lastActiveAt = now;
                
                parsed.user.id = userId ?? parsed.user.id;

                this._session = parsed;

                this.save();
            } catch {
                localStorage.removeItem( this.SESSION_KEY )
            }
        }else {
            this._session = {
                id: uuidv4(),
                
                user: {
                    id: null,
                    wasLoggedIn: false,
                    timeUntilLoggedIn: 0
                },
                
                createdAt: now,
                lastActiveAt: now,

                expired: false,
                deviceInfo: this.detectDeviceInfo()
            }

            this.save();
        }
    }

    public expire(): void {
        if ( !this._session ) return;

        this._session.expired = true;
        this.save();
    }

    public refreshActivity(): void {
        if ( !this._session ) return;

        this._session.lastActiveAt = new Date();
        this.save();
    }

    private save(): void {
        if ( !this._session ) return;

        localStorage.setItem( this.SESSION_KEY, JSON.stringify(this._session) );
    }

    private detectDeviceInfo(): Sessions['deviceInfo'] {
        const userAgent = navigator.userAgent;
        const platform = navigator.platform;

        let type = DeviceInfo.DeviceType.DESKTOP;

        if ( /Mobi|Android/i.test(userAgent) ) type = DeviceInfo.DeviceType.MOBILE;
        else if ( /Tablet|iPad/i.test(userAgent) ) type = DeviceInfo.DeviceType.MOBILE;

        let os = DeviceInfo.DeviceOS.WINDOWS;

        if ( /Mac/i.test( platform ) ) os = DeviceInfo.DeviceOS.MACOS;
        else if ( /Linux/i.test( platform ) ) os = DeviceInfo.DeviceOS.LINUX;
        else if ( /iPhone/i.test( platform ) ) os = DeviceInfo.DeviceOS.IOS;
        else if ( /Android/i.test( platform ) ) os = DeviceInfo.DeviceOS.ANDROID;
        
        let browser = DeviceInfo.DeviceBroswer.UNKNOWN;

        if ( /Chrome/i.test( userAgent ) ) browser = DeviceInfo.DeviceBroswer.CHROME;
        else if ( /Firefox/i.test( userAgent ) ) browser = DeviceInfo.DeviceBroswer.FIREFOX;
        else if ( /Safari/i.test( userAgent ) ) browser = DeviceInfo.DeviceBroswer.SAFARI;
        else if ( /Edge/i.test( userAgent ) ) browser = DeviceInfo.DeviceBroswer.EDGE;

        return {
            type,
            os,
            browser
        }
    }

    public getSession() {
        return this._session;
    }

    private static getManager( userId?: string ) {
        if ( !this._sessionManager ) this._sessionManager = new SessionManager(userId);

        return this._sessionManager
    }

    public static useSessions( userId?: string ) {
        const sessionManager = this.getManager( userId );

        return {
           sessions: sessionManager.getSession() 
        }
    }


}