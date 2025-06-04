import React from 'react';
import ReactDOM from 'react-dom/client';
import CASDK from '@cravingsinc/ca-sdk';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
    <React.StrictMode>
        <CASDK>
            <App />
        </CASDK>
    </React.StrictMode>
);
