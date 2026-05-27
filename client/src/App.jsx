import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import RoomSelection from './pages/RoomSelection';
import ChatDashboard from './pages/ChatDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/rooms" element={<RoomSelection />} />
        <Route path="/chat/:roomId" element={<ChatDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
