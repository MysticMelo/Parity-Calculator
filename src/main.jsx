import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

import './index.css';
import Maize from './Maize.jsx';
import Soybeans from './Soybeans.jsx';
import Header from './Header.jsx';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <HashRouter>
            <Header />

            <main>
                <Routes>
                    {/* Redirect base route to maize */}
                    <Route path="/" element={<Navigate to="/Parity-Calculator/" />} />

                    <Route path="/Parity-Calculator/" element={<Maize />} />
                    <Route path="/Parity-Calculator/soybeans" element={<Soybeans />} />

                    {/* Catch-all fallback */}
                    <Route path="*" element={<Navigate to="/Parity-Calculator/" />} />
                </Routes>
            </main>
        </HashRouter>
    </StrictMode>
);
