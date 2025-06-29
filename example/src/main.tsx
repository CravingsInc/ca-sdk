import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import CASDK from '@cravingsinc/ca-sdk';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <CASDK platform="CravingsInc" locationApi={{ type: "radar", authorization: process.env.RADAR_IO_API || "" }} >
                <App />
            </CASDK>
        </BrowserRouter>
    </React.StrictMode>
);
