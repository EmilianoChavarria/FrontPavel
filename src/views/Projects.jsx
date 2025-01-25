import React, { useState, useEffect } from 'react';
import { Navbar } from '../shared/Navbar';
import { CardProject } from '../components/CardProject';
import { Spinner } from 'flowbite-react';

export const Projects = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const URL = 'http://127.0.0.1:8000/getAll';
        const fetchData = async () => {
            try {
                const response = await fetch(URL);
                const result = await response.json();
                console.log(result);
                setData(result.projects);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setError(error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <Spinner aria-label="Extra large spinner example" size="xl" />;
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
