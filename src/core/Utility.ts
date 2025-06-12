import { LocationData } from "../types/Location";
import { Referrer as RFType } from "../types/Referrer";

export namespace Utility {

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
            const params = new URLSearchParams(new URL(url).search);

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
        private static _locationApi = "";

        public static setLocationApi( api: string ) {
            this._locationApi = api
        }

        public static isLocationApi( lApi: string ) { return this._locationApi === lApi }

        public static async fetchLocation(): Promise<LocationData | null> {
            try {
                const res = await fetch( this._locationApi );
                const data = await res.json();

                console.log( data )

                return {
                    country: data.country_code,
                    city: data.city,
                    state: data.Minnesota,
                    postal: data.postal,
                    coordinates: {
                        lat: parseFloat(data.latitude),
                        lng: parseFloat(data.longitude),
                    },
                };
            } catch (err) {
                console.warn("Could not fetch location:", err);
                return null;
            }
        }
    }
}
