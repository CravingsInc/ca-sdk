import React, { useEffect, useState } from "react";

import { useLocation } from "react-router-dom";

import { useSession } from "./useSession";

import PageTracker, { PageTrackerHandler } from "../core/pageTracker";
import { EventsInteraction, PageViews } from "../types";
import { EventsType } from "../types/enums/EventInteraction";

export const usePageTracker = ( platform: string ): PageTrackerHandler => {
    const sessionHandler = useSession();

    const pageTracker = PageTracker.getInstance( platform );

    const location = useLocation();

    const [currentView, setCurrentView] = useState<PageViews | null>( pageTracker.getCurrentView() );
    const [scrollDepth, setScrollDepth] = useState<number>(0);

    const [interactionEvents, setInteractionEvents] = useState<EventsInteraction[]>([]);
    const [interactionCount, setInteractionCount] = useState<number>(0);

    const listenInteration = ( e : any ) => pageTracker.listenToInteractions( sessionHandler.session?.id, e );

    useEffect(() => {

        if (!sessionHandler.session?.id || sessionHandler.isExpired()) return sessionHandler.restartSession();

        pageTracker.startNewView(sessionHandler.session.id, location.pathname);

        const unsubscribe = pageTracker.subscribe(() => {
            setCurrentView(pageTracker.getCurrentView());
            setScrollDepth(pageTracker.getScrollDepth());
            setInteractionEvents(prev => ([...pageTracker.getInteractionEvents()]))
            setInteractionCount(pageTracker.getInteractionCount());
        });

        
        window.addEventListener('scroll', pageTracker.listenToScroll);

        window.addEventListener('click', listenInteration);
        window.addEventListener('keydown', listenInteration);


        return () => {
            unsubscribe();

            
            window.removeEventListener('scroll', pageTracker.listenToScroll);
            window.removeEventListener('click', listenInteration);
            window.removeEventListener('keydown', listenInteration);
        }
    }, [pageTracker, sessionHandler.session?.id, sessionHandler.isExpired(), location.pathname ]);


    return {
        pageView: currentView,
        location,
        scrollDepth,
        interactionEvents,
        interactionCount,
        triggerEvent: (event: { target: string, type: EventsType, data?: any, id?: string }) => (!sessionHandler.session?.id || sessionHandler.isExpired()) ? {} : pageTracker.triggerEvent(sessionHandler.session.id, event),
        startNewView: (url: string, referrer?: string | null) => (!sessionHandler.session?.id || sessionHandler.isExpired()) ? {} : pageTracker.startNewView(sessionHandler.session?.id, url, referrer),
        endView: pageTracker.endView,
        platform
    }
}
