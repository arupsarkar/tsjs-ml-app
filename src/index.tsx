import { createRoot } from 'react-dom/client';
import App from "./app";
// import * as serviceWorker from './serviceWorker';
import registerServiceWorker from './service-worker'

const container = document.getElementById('root')!
const root = createRoot(container)
root.render(<App />)
console.log('Registering service worker', 'Starting...')

// serviceWorker.register()
registerServiceWorker()