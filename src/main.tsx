import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { ToastContainer } from 'react-toastify';
import App from './App';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';

const root = createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
      <ToastContainer position="top-right" />
    </Provider>
  </React.StrictMode>
);