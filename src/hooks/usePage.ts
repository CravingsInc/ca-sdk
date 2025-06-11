import React, { useEffect, useState } from "react";

import { useLocation } from "react-router-dom";

import { useSession } from "./useSession";

import PageTracker, { PageTrackerHandler } from "../core/pageTracker";
import { EventsInteraction, PageViews } from "../types";
import { EventsType } from "../types/enums/EventInteraction";

export const usePageTracker = (): PageTrackerHandler => {
    const sessionHandler = useSession();

    const location = useLocation();

    const [currentView, setCurrentView] = useState<PageViews | null>( PageTracker.getCurrentView() );
    const [scrollDepth, setScrollDepth] = useState<number>(0);

    const [interactionEvents, setInteractionEvents] = useState<EventsInteraction[]>([]);
    const [interactionCount, setInteractionCount] = useState<number>(0);

    const listenInteration = ( e : any ) => PageTracker.listenToInteractions( sessionHandler.session?.id, e )

    useEffect(() => {

        if (!sessionHandler.session?.id || sessionHandler.isExpired()) return sessionHandler.restartSession();

        PageTracker.startNewView(sessionHandler.session.id, location.pathname);

        const unsubscribe = PageTracker.subscribe(() => {
            setCurrentView(PageTracker.getCurrentView());
            setScrollDepth(PageTracker.getScrollDepth());
            setInteractionEvents(prev => ([...PageTracker.getInteractionEvents()]))
            setInteractionCount(PageTracker.getInteractionCount());
        });

        
        window.addEventListener('scroll', PageTracker.listenToScroll);

        window.addEventListener('click', listenInteration);
        window.addEventListener('keydown', listenInteration);


        return () => {
            unsubscribe();

            
            window.removeEventListener('scroll', PageTracker.listenToScroll);
            window.removeEventListener('click', listenInteration);
            window.removeEventListener('keydown', listenInteration);
        }
    }, [PageTracker, sessionHandler.session?.id, sessionHandler.isExpired(), location.pathname ]);


    return {
        pageView: currentView,
        location,
        scrollDepth,
        interactionEvents,
        interactionCount,
        triggerEvent: (event: { target: string, type: EventsType, data?: any, id?: string }) => (!sessionHandler.session?.id || sessionHandler.isExpired()) ? {} : PageTracker.triggerEvent(sessionHandler.session.id, event),
        startNewView: (url: string, referrer?: string | null) => (!sessionHandler.session?.id || sessionHandler.isExpired()) ? {} : PageTracker.startNewView(sessionHandler.session?.id, url, referrer),
        endView: PageTracker.endView
    }
}
