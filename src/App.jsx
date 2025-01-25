import { BrowserRouter as Router } from 'react-router-dom'; // Asegúrate de importar BrowserRouter aquí
import { AppRoutes } from "./routes/AppRoutes";
import { Navbar } from "./shared/Navbar";

function App() {
  return (
    <Router>
      <div className="bg-gray-100 min-h-screen">
        <Navbar />
        <div className='p-4'>
          <div className='max-w-7xl mx-auto'>
            <AppRoutes />
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
