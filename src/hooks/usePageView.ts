import React, { useContext, useEffect } from "react";

import { useComponentEvent } from "./useComponent";
import { PageTrackerContext } from "../context/PageTrackerProvider";

export const usePageView = (customUrl?: string, referrer: string | null = null) => {
    const { 
        pageView, location, scrollDepth, interactionCount, interactionEvents,
        triggerEvent, endView, startNewView
    } = useContext(PageTrackerContext) || {};

    useEffect(() => {
        const url = customUrl ?? ( location.pathname );

        startNewView && startNewView(url, referrer);

        return () => {
            endView && endView();
        }

    }, [location, customUrl, referrer]);

    return {
        useComponentEvent: useComponentEvent,

        triggerEvent: triggerEvent,

        pageView
    }
}
