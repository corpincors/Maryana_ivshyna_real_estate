import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Импортируем BrowserRouter
import App from './App';
import './index.css'; // Убедитесь, что этот импорт присутствует, если у вас есть глобальные стили

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <BrowserRouter> {/* Оборачиваем App в BrowserRouter */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);