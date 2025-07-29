import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { CustomThemeProvider } from './context/ThemeContext';
import 'react-toastify/dist/ReactToastify.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter> 
    <CustomThemeProvider><CssBaseline/><App /></CustomThemeProvider>
    
    
    </BrowserRouter>
   
  </React.StrictMode>
);

