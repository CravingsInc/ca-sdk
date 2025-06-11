import { useContext, useEffect } from 'react';
import { EventsType } from '../types/enums/EventInteraction';

import { PageTrackerContext } from '../context/PageTrackerProvider';
import { useSession } from './useSession';

export const useComponentEvent = (componentId: string, label: string, baseMetaData?: any) => {
    const sessionHandler = useSession();

    const { 
        pageView, location, scrollDepth, interactionCount, interactionEvents,
        triggerEvent, endView, startNewView
    } = useContext(PageTrackerContext) || {};

    if (!sessionHandler.session?.id) return;

    useEffect(() => {

        triggerEvent && triggerEvent({
            id: componentId,
            type: EventsType.COMPONENT_MOUNT,
            target: `${( pageView ? pageView.url : '/')}#${label}`,
            data: baseMetaData,
        });

        return () => {
            triggerEvent && triggerEvent({
                id: componentId,
                type: EventsType.COMPONENT_UNMOUNT,
                target: `${( pageView ? pageView.url : '/')}#${label}`,
                data: baseMetaData,
            });
        }
    }, [componentId, label, baseMetaData]);

    return {
        triggerEvent: (event: { target: string, type: EventsType, data?: any }) => {
            triggerEvent && triggerEvent({
                ...event,
                target: `${( pageView ? pageView.url : '/')}#${label}#${event.target}`,
                data: {
                    ...baseMetaData,
                    ...event.data
                }
            })
        },

        pageView
    }
}
