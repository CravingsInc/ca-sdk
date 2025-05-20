import React from 'react';
import ReactDOM from 'react-dom/client';
import CASDK from '../../src';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
    <React.StrictMode>
        <CASDK>
            <App />
        </CASDK>
    </React.StrictMode>
);
