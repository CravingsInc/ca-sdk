# CravingsInc Analysis SDK (ca-sdk)

## 🎯 Purpose

The `ca-sdk` is a lightweight frontend analytics library designed to collect user session, page views, and event interaction data **in real time** via **Socket.IO**. Built for CravingsInc platforms, this SDK enables deep insights into user behavior across web applications.

---

## ⚙️ Tech Stack

- **Frontend SDK**: TypeScript + React Context + Custom Hooks
- **Backend**: Node.js + Express + TypeScript
- **Real-time**: Socket.IO
- **Database**: PostgreSQL

---

## 📦 What It Tracks

### ✅ Sessions

Tracks the lifetime of a user's visit to the app.

- Auto-generates a session ID using `uuid`
- Detects:
  - **Device Type**: Mobile, Tablet, Desktop
  - **Operating System**: Windows, macOS, Android, iOS, etc
  - **Browser**: Chrome, Safari, Firefox, Edge, etc
- Captures activity like:
  - Clicks, Scrolls, Keyboard input
  - Idle or expired session due to timeout/unmount
- Calculates:
  - Time until login
  - Last active timestamp
  - Save intervals ( Every 3 seconds )

```ts
{
  id: string;
  user: { id: string | null; wasLoggedIn: boolean; timeUntilLoggedIn: number };
  createdAt: Date;
  lastActiveAt: Date;
  lastSaveAt: Date;
  deviceInfo: { type: string; os: string; browser: string };
  location?: {
    country: string; // 'US' | 'CA' | etc
    city: string; // 'New York' | 'Toronto' | etc
    region: string; // 'NY' | 'ON' | etc
    coordinates?: {
        lat: number; // latitude
        lng: number; // longitude
    }
  }
  expired: { expired: boolean; reason?: 'unmount' | 'timeout' | 'manual' | null };
}
```

### ✅ Page Views

Tracks each time a user navigates to a page route

- URL visited and referring page
- Time started and ended
- Total Time spent
- Scroll depth % reached
- All interactions during that view

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

### ✅ EventsInteraction

Captures specific frontend events:

- Supported Types: `click`, `scroll`, `input`, `hover`, etc.
- Captures timestamp, target element, and optional event data.

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

## 🧠 How It Works

### React SDK Integration

```ts
import { CASDK } from '@CravingsInc/ca-sdk';

<BrowserRouter>
    <CASDK>
        <App />
    </CASDK>
</BrowserRouter>
```

### Context Providers 

- `SessionProvider`: Manages session lifecycle, expiration, and refresh
- `PageTrackerProvider`: Tracks route changes and view lifecycle

### Hooks

- `useSession()`: Access session data and methods ( `restartSession`, `refreshActivity`, etc ).
- `usePage()`: Access current page view state and interactions
- `useComponentEvent()`: Hook into pre-component interactions

## 💻 Example Usage

```tsx
import React from 'react';

function App() {
    return (
        <div style={{ padding: '2rem' }}>
            <h1 data-label="hello-world" data-data={`{ "type": "button", "platform": "EVENTRIX" }`}>Hello from CASDK Example</h1>
        </div>
    );
}

export default App;
```

```ts
const { pageView, scrollDepth, interactionEvents, triggerEvent } = usePage();

useEffect(() => {
  triggerEvent({ type: 'click', target: '#signup-button' });
}, []);
```

## 🔄 Rehydration and Expiration

Sessions are stored in localStorage under the key `__cravings_ca_sdk_session`. When a user closes the browser, the ssion is marked as expired with a reason. If the session expires, it can be restarted on the next visit.

## 🔐 Privacy & Customization

- Anonymized by default: If no user ID is passed, the SDK tracks anonymous session.
- Extendable: You can customize what events are captured using the `triggerEvent()` method.

## 📡 Data Flow

1. SDK initializes in browser
2. `SessionManager` creates or restores session
3. `PageTracker` starts a new view on route change
4. Events and views are sent to server via Socket.IO
5. Server persists into PostgreSQL

## 🛠️ Roadmap / Coming Soon

- Heatmap & scroll visualization
- Offline buffering of events
- Backend dashboard for live session tracking
- More Customization:
    - RefreshSession Handlers
    - SessionServerHandler
    - PageServerHandler

## 🧪 Development

To run the SDK locally:

```bash
pnpm install
pnpm dev
```

To build:

```bash
pnpm build
```

## 🧩 Related Packages

- `@CravingsInc/ca-sdk-server` (WIP): Server-side event ingestion and persistance

## 🧰 Contributing

We welcome improvement and integrations! Please submit PRs or open issues for bugs/requests.

## 👨‍🔬 Maintained By
Chidozie Nnaji & CravingsInc Team

> Build't for internal use, open for external developers

## 📬 License
MIT
