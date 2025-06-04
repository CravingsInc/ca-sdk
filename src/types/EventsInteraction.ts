import { EventInteraction } from "./enums";

export type EventsInteraction = {
    id: string; // unique event id
    sessionId: string; // session id
    type: EventInteraction.EventsType; // Event type
    target: string; // target element
    time: Date; // timestamp when the event occured
    data?: any; // additional data (e.g. { value: 'test' })
}
