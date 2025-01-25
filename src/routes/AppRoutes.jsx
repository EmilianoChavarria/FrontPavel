import React from 'react'
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom'
import { Projects } from '../views/Projects'
import { ErrorPage } from '../views/ErrorPage'
import { ProjectDetails } from '../views/ProjectDetails'

export const AppRoutes = () => {
    return (
            <Routes>
                <Route path='/' element={<Projects />} />
                <Route path='/project/:projectId' element={<ProjectDetails />} />

                {/* Ruta por si no encuentra las demás */}
                <Route path="*" element={<ErrorPage />} />
            </Routes>
    )
}
