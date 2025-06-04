# ca-sdk
CravingsInc Analysis SDK

### Purpose: Collect and store frontend analytics via Socket.io in real time

## Tech Stack

- **Backend**: Node.js + Express + Typescript + Socket.io
- **Database**: PostgreSQL
- **Socket**: Socket.io for real-time data
- **Client SDK**: Typescript-based npm package

## Data Schema

**Sessions**:

```ts
{
    id: string; // unique session id
    user: {
        id: string; // userId
        wasLoggedIn: boolean; // If user was logged in
        timeUntilLoggedIn: number; // time until user logged in, in milliseconds.
    };
    createdAt: Date; // timestamp
    lastActiveAt: Date; // last active timestamp
    deviceInfo: {
        type: string; // 'Mobile' | 'Tablet' | 'Desktop' | etc
        os: string; // 'iOS' | 'Android' | 'Windows' | etc
        browser: string; // 'Chrome' | 'Firefox' | etc
    },
    location?: {
        country: string; // 'US' | 'CA' | etc
        city: string; // 'New York' | 'Toronto' | etc
        region: string; // 'NY' | 'ON' | etc
        coordinates?: {
            lat: number; // latitude
            lng: number; // longitude
        }
    }
    expired: boolean; // true if session is expired
}
```

**PageViews**

```ts
{
    id: string; // unique page session id
    sessionId: string; // session id
    url: string; // page url
    referrer?: string; // referrer url
    timeStarted: Date; // timestamp when the page was loaded
    timeEnded: Date; // timestamp when the page was unloaded
    timeSpent: number; // time spent on the page in milliseconds
    scrollDepth: number; // scroll depth in percentage
    interactionCount: number; // number of interactions on the page
    interactions: EventsInteraction[]; // array of interactions
}
```

**EventsInteraction**

```ts
{
    id: string; // unique event id
    sessionId: string; // session id
    type: string; // event type (e.g. 'click', 'scroll', 'input', etc)
    target: string; // target element (e.g. 'button#submit', 'input#email', etc)
    time: Date; // timestamp when the event occurred
    data?: any; // additional data (e.g. { value: 'test' })
}
```

