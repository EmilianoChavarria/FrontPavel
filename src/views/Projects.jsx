import React, { useState, useEffect } from 'react';
import { Navbar } from '../shared/Navbar';
import { CardProject } from '../components/CardProject';
import { Spinner } from 'flowbite-react';
import { URL } from '../../environments/global';

export const Projects = ({ refreshProjects, setRefreshProjects }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Función para cargar los proyectos
    const fetchData = async () => {
        try {
            const response = await fetch(`${URL}/getAll`);
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            const result = await response.json();
            console.log(result);
            return result.projects; // Devuelve los proyectos
        } catch (error) {
            console.error('Error fetching projects:', error);
            setError(error);
            return []; // Devuelve un array vacío en caso de error
        }
    };

    // Efecto para cargar los proyectos al montar el componente y cuando cambie refreshProjects
    useEffect(() => {
        const loadProjects = async () => {
            setLoading(true); // Activar el estado de carga
            try {
                const projects = await fetchData(); // Obtener los proyectos desde la API
                setData(projects); // Asignar los proyectos al estado
            } catch (error) {
                console.error("Error al cargar los proyectos: ", error);
                setError(error); // Asignar el error al estado
            } finally {
                setLoading(false); // Desactivar el estado de carga
            }
        };

        loadProjects();
    }, [refreshProjects]); // Dependencia: refreshProjects

    if (loading) {
        return <Spinner aria-label="Extra large spinner example" size="xl" />;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!Array.isArray(data)) {
        return <div>Error: Data is not an array or could not be fetched.</div>;
    }

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {data.map((project, index) => (
                <CardProject key={index} project={project} />
            ))}
        </div>
    );
};