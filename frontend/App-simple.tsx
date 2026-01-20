import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from './src/context/AuthContext';
import LoginPage from './src/pages/LoginPage';
import './index.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const App: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-600">Загрузка...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" replace />} 
      />
      <Route 
        path="/" 
        element={isAuthenticated ? (
          <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="bg-white p-10 rounded-[3.5rem] shadow-xl border border-slate-100 w-full max-w-md text-center">
              <h1 className="text-2xl font-black text-slate-900 mb-4">Добро пожаловать!</h1>
              <p className="text-slate-600 mb-6">CRM система успешно работает</p>
              <div className="text-sm text-slate-400">
                API URL: {API_URL}
              </div>
            </div>
          </div>
        ) : <Navigate to="/login" replace />} 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
