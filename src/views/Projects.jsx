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

    
    const handleProjectUpdate = () => {
        setRefreshProjects(prev => !prev); 
    };

    useEffect(() => {
        const loadProjects = async () => {
            setLoading(true);
            try {
                const projects = await fetchData();
                setData(projects);
            } catch (error) {
                console.error("Error al cargar los proyectos: ", error);
                setError(error); 
            } finally {
                setLoading(false); 
            }
        };

        loadProjects();
    }, [refreshProjects]);

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
        <>
            {
                data.length === 0 ? (
                    <div className='w-full flex justify-center items-start'>
                        <span className="text-xl text-gray-500 mt-1">No hay proyectos registrados, por favor agrega uno.</span>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {data.map((project, index) => (
                            <CardProject 
                                key={index} 
                                project={project} 
                                onProjectUpdate={handleProjectUpdate}
                            />
                        ))}
                    </div>
                )
            }
        </>
    );
};