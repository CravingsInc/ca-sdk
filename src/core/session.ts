import { v4 as uuidv4 } from 'uuid';
import { DeviceInfo, Sessions } from '../types';
import { useEffect, useState } from 'react';
import { Utility } from './Utility';

type SessionContextType = {
    session: Sessions | null;
    refreshActivity: () => void;
    isExpired: () => boolean;
    restartSession: (userId?: string) => void;
}

export class SessionManager {

    // Static
    private static _sessionManager: SessionManager | null = null;

    // Instance
    private SESSION_KEY = "__cravings_ca_sdk_session";

    private _session: Sessions | null = null;

    private constructor(userId?: string) {
        const stored = localStorage.getItem(this.SESSION_KEY);

        const now = new Date();

        if (stored) {
            try {
                const parsed: Sessions = JSON.parse(stored);

                parsed.lastActiveAt = now;

                parsed.user.id = userId ?? parsed.user.id;

                this._session = parsed;

                this._session.expired = {
                    expired: this._session.expired.reason === "unmount" ? false : true,
                    reason: parsed.expired?.reason ?? null,
                }

                this.save();
            } catch {
                localStorage.removeItem(this.SESSION_KEY)
            }
        } else {
            this._session = {
                id: uuidv4(),

                user: {
                    id: userId ?? null,
                    wasLoggedIn: userId ? true : false,
                    timeUntilLoggedIn: 0
                },

                referrer: Utility.Referrer.parseReferrer(window.document.referrer || window.location.href, window.location.href),

                createdAt: now,
                lastActiveAt: now,
                lastSaveAt: now,

                expired: {
                    expired: false
                },

                deviceInfo: this.detectDeviceInfo()
            }

            Utility.Location.fetchLocation().then((loc) => {
                if (loc && this._session) {
                    this._session.location = loc;
                    this.save();
                }
            });

            this.save();
        }
    }

    public restartSession(userId?: string): Sessions {
        let now = new Date()

        this._session = {
            id: uuidv4(),

            user: {
                id: userId ?? null,
                wasLoggedIn: userId ? true : false,
                timeUntilLoggedIn: 0
            },

            createdAt: now,
            lastActiveAt: now,
            lastSaveAt: now,

            referrer: Utility.Referrer.parseReferrer(window.document.referrer || window.location.href, window.location.href),

            expired: {
                expired: false,
                reason: null
            },

            deviceInfo: this.detectDeviceInfo()
        }

        Utility.Location.fetchLocation().then((loc) => {
            if (loc && this._session) {
                this._session.location = loc;
                this.save();
            }
        });

        this.save();

        return this._session;
    }

    public expire(reason?: Sessions['expired']['reason']): void {
        if (!this._session) return;

        this._session.expired.expired = true;

        this._session.expired.reason = reason;
    }

    public refreshActivity(): void {
        if (!this._session) return;

        this._session.lastActiveAt = new Date();
    }

    private save(): void {
        if (!this._session) return;

        this._session.lastSaveAt = new Date();

        localStorage.setItem(this.SESSION_KEY, JSON.stringify(this._session));

        //TODO: Update to server as well

        //
    }

    public useAutomicSessionSave() {
        useEffect(() => {
            // Save and SYNC to server periodically, to save on server over load
            const interval = setInterval(() => {
                if (!this._session) return;

                if (this._session.lastActiveAt > this._session.lastSaveAt) {
                    this.save();
                }
            }, 3000);

            return () => clearInterval(interval);

        }, []);
    }

    private detectDeviceInfo(): Sessions['deviceInfo'] {
        const userAgent = navigator.userAgent;
        const platform = navigator.platform;

        let type = DeviceInfo.DeviceType.DESKTOP;

        if (/Mobi|Android/i.test(userAgent)) type = DeviceInfo.DeviceType.MOBILE;
        else if (/Tablet|iPad/i.test(userAgent)) type = DeviceInfo.DeviceType.MOBILE;

        let os = DeviceInfo.DeviceOS.WINDOWS;

        if (/Mac/i.test(platform)) os = DeviceInfo.DeviceOS.MACOS;
        else if (/Linux/i.test(platform)) os = DeviceInfo.DeviceOS.LINUX;
        else if (/iPhone/i.test(platform)) os = DeviceInfo.DeviceOS.IOS;
        else if (/Android/i.test(platform)) os = DeviceInfo.DeviceOS.ANDROID;

        let browser = DeviceInfo.DeviceBrowser.UNKNOWN;

        if (/Chrome/i.test(userAgent)) browser = DeviceInfo.DeviceBrowser.CHROME;
        else if (/Firefox/i.test(userAgent)) browser = DeviceInfo.DeviceBrowser.FIREFOX;
        else if (/Safari/i.test(userAgent)) browser = DeviceInfo.DeviceBrowser.SAFARI;
        else if (/Edge/i.test(userAgent)) browser = DeviceInfo.DeviceBrowser.EDGE;

        return {
            type,
            os,
            browser
        }
    }

    public getSession() {
        return this._session;
    }

    public static getManager(userId?: string) {
        if (!this._sessionManager) this._sessionManager = new SessionManager(userId);

        return this._sessionManager
    }

    public static useSessionsManager(userId?: string): SessionContextType {
        const [session, setSession] = useState<Sessions | null>(null);
        this.getManager().useAutomicSessionSave();

        const restartSession = (userId?: string) => {
            const sessionManager = this.getManager();
            setSession(sessionManager.restartSession(userId));
        }

        useEffect(() => {
            const sessionManager = this.getManager(userId)
            let session = sessionManager.getSession();

            if (!session || session.expired?.expired) {
                session = sessionManager.restartSession(userId);
            }

            setSession(session);

            //TODO: Connect to socket server

            //

            const handleActivity = () => {
                sessionManager.refreshActivity();

                const updated = sessionManager.getSession();

                setSession(updated);
            }

            const handleBeforeUnload = () => {
                sessionManager.expire("unmount");

                //TODO: One last save to server and local

                //
            }

            window.addEventListener('beforeunload', handleBeforeUnload);

            // Listen for basic activity triggers
            window.addEventListener('click', handleActivity);
            window.addEventListener('keydown', handleActivity);
            window.addEventListener('scroll', handleActivity);

            return () => {
                window.removeEventListener('click', handleActivity);
                window.removeEventListener('keydown', handleActivity);
                window.removeEventListener('scroll', handleActivity);

                window.removeEventListener('beforeunload', handleBeforeUnload);

                // Socket emit end of session
            }
        }, [userId])


        return {
            session,
            refreshActivity: this.getManager().refreshActivity,
            isExpired: () => session?.expired.expired ?? false,
            restartSession
        }
    }
}
