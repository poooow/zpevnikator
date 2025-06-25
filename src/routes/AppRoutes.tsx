import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SearchPage from '../pages/SearchPage';
import SongPage from '../pages/SongPage';
import Liked from '../pages/Liked';

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/song/:id" element={<SongPage />} />
        <Route path="/liked" element={<Liked />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;