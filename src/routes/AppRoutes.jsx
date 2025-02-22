import React from 'react'
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom'
import { Projects } from '../views/Projects'
import { ErrorPage } from '../views/ErrorPage'
import { ProjectDetails } from '../views/ProjectDetails'
import { GanttChart } from '../components/GanttChart'

export const AppRoutes = ({ refreshProjects, setRefreshProjects, refreshCategories, setRefreshCategories }) => {
    return (
        <Routes>
            <Route path='/' element={<Projects refreshProjects={refreshProjects} setRefreshProjects={setRefreshProjects} />} />
            <Route path='/project/:projectId' element={<ProjectDetails refreshCategories={refreshCategories} setRefreshCategories={setRefreshCategories} />} />
            <Route path='/gantt/:projectId' element={<GanttChart />} />

            {/* Ruta por si no encuentra las demás */}
            <Route path="*" element={<ErrorPage />} />
        </Routes>
    )
}
