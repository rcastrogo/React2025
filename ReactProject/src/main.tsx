
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { appConfig } from './services/configService.ts';


const redirect = appConfig.read('redirect');
if (redirect) {
  appConfig.write('redirect', '');
  window.history.replaceState(null, '', redirect);
}


createRoot(
    document.getElementById('root')!
    ).render(<App />)
