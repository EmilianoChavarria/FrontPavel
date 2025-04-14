import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { registerLicense } from '@syncfusion/ej2-base';

registerLicense('Ngo9BigBOggjHTQxAR8/V1NMaF1cXmhNYVJzWmFZfVtgdVdMYFRbQXJPMyBoS35Rc0VgWHlecHRdQ2hcWU1w');

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  //   <App />
  // </StrictMode>
  <App/>
  ,
)
