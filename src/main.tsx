import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { PokemonDetailPage } from './pages/PokemonDetail'; 
import './index.css';
import { ComparePage } from './pages/comparePage';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter> {/* Configuración de rutas para la aplicación */}
      <Routes> {/* Definición de rutas para la aplicación */}
        {/* Ruta para la lista principal */}
        <Route path="/" element={<Home />} />
        
        {/* Ruta para el detalle usando el nombre como parámetro */}
        <Route path="/pokemon/:name" element={<PokemonDetailPage />} />
        <Route path="/compare" element={<ComparePage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode> 
);