import React, { useEffect, useState } from 'react';
import { URL } from '../../environments/global';
import { useParams } from 'react-router-dom';
import { CategoryCard } from '../components/CategoryCard';
import arrow from '../assets/img/arrow.png'

export const ProjectDetails = ({ refreshCategories, setRefreshCategories }) => {
    const [data, setData] = useState([]);

    const [loading, setLoading] = useState(true);
    const { projectId } = useParams();

    const fetchData = async () => {
        try {
            const response = await fetch(`${URL}/projects/${projectId}/details`);
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            const result = await response.json();
            console.log(result);
            setData(result.categories);
        } catch (error) {
            console.error("Error fetching project details:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCategorytUpdate = () => {
        setRefreshCategories(prev => !prev); 
    };

    useEffect(() => {


        fetchData();
    }, [projectId, refreshCategories]);

    if (loading) {
        return <div className="text-center mt-4">Cargando datos del proyecto...</div>;
    }

    return (
        <div className="h-full w-full">
            <div className="overflow-x-auto h-full">
                {
                    data.length === 0 ? (
                        <div className='w-full flex justify-center items-start'>
                            <span className="text-xl text-gray-500 mt-1">No hay categorías registradas, por favor agrega una.</span>
                            
                        </div>
                    ) : (
                        <div className="grid grid-flow-col auto-cols-[calc(100%/3)] gap-6">
                            {data.map((category, index) => (
                                <CategoryCard
                                    key={index}
                                    category={category}
                                    onCategoryUpdate={handleCategorytUpdate}

                                    className="bg-white border border-gray-200 rounded-lg p-4"
                                />
                            ))}
                        </div>
                    )
                }
            </div>
        </div>
    );
};
