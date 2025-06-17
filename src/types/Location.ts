export type LocationData = {
    country: string;
    city: string;
    state: string;
    postal: number;
    coordinates?: {
        lat: number;
        lng: number;
    };
    ip: string;
};

export type LocationRadar = {
    type: "radar";
    authorization: string;
}

export type LocationCustom = {
    type: "custom";
    api: string;
    authorization?: string;
}

export type LocationOptions = LocationCustom | LocationRadar;
