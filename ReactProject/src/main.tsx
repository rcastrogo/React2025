
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'


const redirect = sessionStorage.redirect;
if (redirect) {
  sessionStorage.removeItem('redirect');
  window.history.replaceState(null, '', redirect);
}


createRoot(
    document.getElementById('root')!
    ).render(<App />)
