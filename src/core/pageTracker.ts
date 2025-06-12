import { v4 as uuidv4 } from 'uuid';

import { PageViews, EventsInteraction } from '../types';

import { EventsType } from '../types/enums/EventInteraction';

type PageTrackerListener = () => void;

export type PageTrackerHandler = {
    pageView: PageViews | null;
    location: any;
    scrollDepth: number;
    interactionEvents: EventsInteraction[];
    interactionCount: number;
    endView: () => void;
    startNewView: ( url: string, referrer: string | null ) => void;
    triggerEvent: ( event: { target: string; type: EventsType; data?: any; id?: string; }) => void;
}

class PageTracker {
    private static _instance: PageTracker;

    private listeners: Set<PageTrackerListener> = new Set();

    private currentView: PageViews | null = null;
    private scrollDepth: number = 0;
    private interactionEvents: EventsInteraction[] = [];
    private interactionCount = 0;

    private constructor() {}

    public static getInstance(): PageTracker {
        if (!PageTracker._instance) PageTracker._instance = new PageTracker();

        return PageTracker._instance;
    }

    private notifyListeners() {
        this.listeners.forEach((cb) => cb());
    }

    public subscribe(cb: PageTrackerListener) {
        this.listeners.add(cb);
        return () => this.listeners.delete(cb); // return unsubscribe fn
    }

    public startNewView( sessionId: string, url: string, referrer: string | null = null) {

        // End Previous View
        this.endView();

        const now = new Date();

        this.currentView = {
            id: uuidv4(),
            sessionId,
            url: `${url.substring(url.indexOf('/'))}`, // Makes sure it isn't domain based tracking, but just route
            referrer: referrer ?? document.referrer,
            timeStarted: now,
            timeEnded: now, // will be updated on end
            timeSpent: 0,
            scrollDepth: 0,
            interactions: {
                count: 0,
                events: []
            }
        }

        this.scrollDepth = 0;
        this.interactionEvents = [];
        this.interactionCount = 0;

        this.notifyListeners()

        console.log( this )
    }

    public listenToScroll = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const depth = Math.min(100, Math.round((scrollTop / docHeight) * 100));

        if (depth > this.scrollDepth) {
            this.scrollDepth = depth;
            this.notifyListeners();
        }

    }

    public listenToInteractions = ( sessionId: string | undefined, e: MouseEvent | KeyboardEvent) => {

        if ( !sessionId ) return;

        const target = e.target as HTMLElement;

        const id = target.getAttribute('data-id') || uuidv4();
        const label = target.getAttribute('data-label');
        const dataAttr = target.getAttribute("data-data");

        // Don't Wanna track data that doesn't want to be tracked
        if (label) {
            const event: EventsInteraction = {
                id,
                sessionId,
                type: this.getEventType(e),
                target: `${(this.currentView ? this.currentView.url : '/')}#${label}`,
                time: new Date(),
                data: JSON.parse(dataAttr || "{}")
            }

            this.interactionEvents.push(event);
            this.interactionCount++;
            this.notifyListeners();

            console.log( this )
        }
    }

    private getEventType(e: MouseEvent | KeyboardEvent) {
        if (e.type === 'click') return EventsType.CLICK;
        else if (e.type === 'keydown') return EventsType.INPUT;
        else return EventsType.MANUAL;
    }

    public endView() {
        if (!this.currentView) return;

        const now = new Date();

        this.currentView.timeEnded = now;
        this.currentView.timeSpent = now.getTime() - this.currentView.timeStarted.getTime();
        this.currentView.scrollDepth = this.scrollDepth;

        this.currentView.interactions = {
            count: this.interactionCount,
            events: this.interactionEvents
        }

        // Send to server or log it

        //TODO: Send to server here

        //

        this.currentView = null;
    }

    public getCurrentView(): PageViews | null {
        return this.currentView;
    }

    public getScrollDepth(): number {
        return this.scrollDepth;
    }

    public getInteractionEvents(): EventsInteraction[] {
        return this.interactionEvents
    }

    public getInteractionCount(): number {
        return this.interactionCount;
    }

    public triggerEvent( sessionId: string, event: { target: string, type: EventsType, data?: any, id?: string } ) {

        if (!sessionId) return;

        this.interactionEvents.push({
            id: event.id || uuidv4(),
            sessionId,
            type: event.type,
            target: event.target,
            time: new Date(),
            data: event.data
        });

        this.interactionCount++;
        this.notifyListeners();

        console.log( this )
    }
}

export default PageTracker.getInstance();
