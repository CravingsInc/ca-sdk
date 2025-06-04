import { EventsInteraction } from "./EventsInteraction";

export type PageViews = {
    id: string;

    sessionId: string;

    url: string;

    referrer?: string; // referrer url

    timeStarted: Date; // Timestamp when the page was loaded

    timeEnded: Date; // Timestamp when the page was unloaded

    timeSpent: number; // Time spent on the page in milliseconds

    scrollDepth: number; // Scroll depth in percentage

    interactions: {
        count: number; // number of interactions on the page
        events: EventsInteraction[]; // array of interactions
    }
}
