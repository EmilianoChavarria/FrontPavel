import React from 'react'
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom'
import { Projects } from '../views/Projects'
import { ErrorPage } from '../views/ErrorPage'

export const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Projects />} />

                {/* Ruta por si no encuentra las demás */}
                <Route path="*" element={<ErrorPage />} />
            </Routes>
        </Router>
    )
}
