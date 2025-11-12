import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import Maize from './Maize.jsx'
import Soybeans from "./Soybeans.jsx";
import Header from "./Header.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <BrowserRouter>
          <Header />
          <main>
              <Routes>
                  <Route path="/maize" element={<Maize />} />
                  <Route path="/soybeans" element={<Soybeans />} />
              </Routes>
          </main>
      </BrowserRouter>
  </StrictMode>,
)
