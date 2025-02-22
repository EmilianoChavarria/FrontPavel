import React, { useEffect, useState } from 'react';
import { URL } from '../../environments/global';
import { useParams } from 'react-router-dom';
import { CategoryCard } from '../components/CategoryCard';
import { Tabs } from 'flowbite-react';
import { FaChartGantt } from "react-icons/fa6";
import { RxActivityLog } from "react-icons/rx";
import { GanttChart } from '../components/GanttChart';

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

    useEffect(() => {


        fetchData();
    }, [projectId, refreshCategories]);

    if (loading) {
        return <div className="text-center mt-4">Cargando datos del proyecto...</div>;
    }

    return (
        <div className="h-full w-full">
            <div className="overflow-x-auto h-full">
                <div className="grid grid-flow-col auto-cols-[calc(100%/3)] gap-6">
                    {data.map((category, index) => (
                        <CategoryCard
                            key={index}
                            category={category}
                            className="bg-white border border-gray-200 rounded-lg p-4"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
