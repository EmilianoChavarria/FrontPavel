import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { registerLicense } from '@syncfusion/ej2-base';

registerLicense('Ngo9BigBOggjHTQxAR8/V1NMaF5cXmBCfEx0QXxbf1x1ZFNMYl9bRXZPIiBoS35Rc0ViW3pfeHdSR2laVEx1');

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  //   <App />
  // </StrictMode>
  <App/>
  ,
)
