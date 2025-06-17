import { LocationData, LocationOptions } from "../types/Location";
import { Referrer as RFType } from "../types/Referrer";

export namespace Utility {
    export let PLATFORM = "";

    type LoggerListener = ( param: LoggerResponse ) => void;

    export enum LoggerLevelType {
        DEBUG = "DEBUG",
        INFO = "INFO",
        WARN = "WARN",
        ERROR = "ERROR"
    }

    export type LoggerResponse = {
        level: LoggerLevelType,
        message: string;
        args: any[];
    }

    export class Logger {
        private static _allowConsole: boolean;
        private static _listeners: Set<LoggerListener> = new Set();

        public static subscribe( cb: LoggerListener ) {
            this._listeners.add( cb );

            return () => this._listeners.delete( cb );
        }

        private static notifyListeners( param: LoggerResponse ) {
            this._listeners.forEach((cb) => cb( param ));
        }

        public static setAllowConsole( allow: boolean ) {
            this._allowConsole = allow;
        }

        private static log( param: LoggerResponse ) {
            if ( this._allowConsole ) {
                console.log(`[${new Date().toISOString()}] CA-SDK-[${param.level}]: ${param.message}`, param.args);
            }

            this.notifyListeners( param );
        }

        public static debug( message: string, ...args: any ) {
            this.log( { level: LoggerLevelType.DEBUG, message, args } );
        }

        public static info( message: string, ...args: any ) {
            this.log( { level: LoggerLevelType.INFO, message, args } );
        }

        public static warn( message: string, ...args: any ) {
            this.log( { level: LoggerLevelType.WARN, message, args } );
        }

        public static error( message: string, ...args: any ) {
            this.log( { level: LoggerLevelType.ERROR, message, args } );
        }
    }

    export class Referrer {
        public static inferPlatformFromClickId(parse: URLSearchParams) {
            if (parse.get("fbclid")) return "Facebook";
            else if (parse.get("gclid")) return "Google";
            else if (parse.get("dclid")) return "Google Display";
            else if (parse.get("ttclid")) return "TikTok";
            else if (parse.get("twclid")) return "Twitter";
            else if (parse.get("li_fat_id")) return "LinkedIn";
            else if (parse.get("scid")) return "Snapchat";
            else if (parse.get("epik")) return "Pinterest";
            else if (parse.get("msclkid")) return "Microsoft/Bing";
            else if (parse.get("yclid")) return "Yahoo";
            else if (parse.get("obcid")) return "Outbrain";
            else if (parse.get("rdt_cid")) return "Reddit";
            else return "UNKNOWN";
        }

        public static parseReferrer(url: string, currentPath: string): RFType {
            const params = new URLSearchParams(new URL( url ).search);

            return {
                utm_source: params.get('utm_source') || this.inferPlatformFromClickId(params),
                utm_medium: params.get("utm_medium") || currentPath,
                utm_campaign: params.get("utm_campaign"),
                utm_term: params.get("utm_term"),
                utm_content: params.get("utm_content"),
                raw_url: url
            }
        }
    }

    export class Location {

        private static _locationOptions: LocationOptions | null = null; 

        public static setLocationApi( api: LocationOptions ) {
            this._locationOptions = api
        }

        public static isLocationApi( lApi: LocationOptions ) { return this._locationOptions === lApi }

        public static async fetchLocation(): Promise<LocationData | null> {
            try {
                if ( !this._locationOptions ) {
                    
                    Logger.warn("Could not fetch location:", null);

                    return null;
                };

                return this._locationOptions.type === "custom" ? 
                    await this.fetchCustomLocation() : await this.fetchRadarIoLocation()
            } catch (err) {
                Logger.warn("Could not fetch location:", err);
                return null;
            }
        }

        private static async fetchCustomLocation(): Promise<LocationData | null> {
            try {
                if ( this._locationOptions?.type !== 'custom' ) {
                    
                    Logger.warn("Could not fetch location:", null);

                    return null;
                };

                const res = await fetch( this._locationOptions.api, {
                    headers: this._locationOptions.authorization ? {
                        Authorization: this._locationOptions.authorization
                    } : undefined
                });

                const data = await res.json();

                return {
                    country: data.country_code,
                    city: data.city,
                    state: data.Minnesota,
                    postal: data.postal,
                    coordinates: {
                        lat: parseFloat(data.latitude),
                        lng: parseFloat(data.longitude),
                    },
                    ip: data.ip
                };


            }catch(err) {
                Logger.warn("Could not fetch location", err)
                return null;
            }
        }
    
        private static async fetchRadarIoLocation(): Promise<LocationData | null> {
            try {
                if ( this._locationOptions?.type !== 'radar' ) {
                    
                    Logger.warn("Could not fetch location:", null);

                    return null;
                };

                const res = await fetch( "https://api.radar.io/v1/geocode/ip", {
                    headers: {
                        Authorization: this._locationOptions.authorization
                    }
                } );

                const data = await res.json();

                return {
                    country: data.address.countryCode,
                    city: data.address.city,
                    state: data.address.stateCode,
                    postal: data.address.postalCode,
                    coordinates: {
                        lat: data.address.geometry.coordinates[0],
                        lng: data.address.geometry.coordinates[1]
                    },
                    ip: data.ip
                }
            }catch( err ) {
                Logger.warn("Could not fetch location", err)
                return null;
            }
        }
    }
}
