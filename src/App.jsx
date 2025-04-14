import { BrowserRouter as Router } from 'react-router-dom'; // Asegúrate de importar BrowserRouter aquí
import { AppRoutes } from "./routes/AppRoutes";
import { Navbar } from "./shared/Navbar";
import { useState } from 'react';

function App() {
  const [refreshProjects, setRefreshProjects] = useState(false);
  const [refreshCategories, setRefreshCategories] = useState(false);

  return (
    <Router className="max-h-screen">
      <div className="bg-blue-100 h-screen flex flex-col">

        <Navbar setRefreshProjects={setRefreshProjects} setRefreshCategories={setRefreshCategories} className="flex-shrink-0" />

        <div className="flex-grow p-4 ">
          <div className="max-w-7xl mx-auto">
            <AppRoutes refreshProjects={refreshProjects} setRefreshProjects={setRefreshProjects} refreshCategories={refreshCategories} setRefreshCategories={setRefreshCategories} />
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
