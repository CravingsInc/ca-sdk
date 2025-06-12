export type LocationData = {
    country: string;
    city: string;
    state: string;
    postal: number;
    coordinates?: {
        lat: number;
        lng: number;
    };
};
