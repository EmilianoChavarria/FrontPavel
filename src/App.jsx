import { AppRoutes } from "./routes/AppRoutes"
import { Navbar } from "./shared/Navbar"



function App() {

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className='p-4'>
        <div className='max-w-7xl mx-auto'>
          <AppRoutes />
        </div>
      </div>
    </div>
  )
}

export default App
