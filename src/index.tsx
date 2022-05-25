import { createRoot } from 'react-dom/client';
import App from "./app";
import { register } from './serviceworker';

const container = document.getElementById('root')!
const root = createRoot(container)
root.render(<App />)

register()
