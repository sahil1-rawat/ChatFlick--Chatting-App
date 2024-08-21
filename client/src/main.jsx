import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
// import { Toaster } from './components/ui/sonner.jsx'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SocketProvider } from './context/SocketContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <SocketProvider>
    <App />
    <ToastContainer
      position='top-right'
      autoClose='1500'
      pauseOnHover='false'
      style={{
        width: '300px',
      }}
    />
  </SocketProvider>
  // </React.StrictMode>,
);
