import React, { useEffect, useState } from 'react'
import { URL } from '../../environments/global'
import { useParams } from 'react-router-dom';

export const ProjectDetails = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    console.log(id);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await fetch(`${URL}/${id}/details`);
                console.log(result);
                setData(result);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false)
            }

        }

        fetchData();
    }, []);

    return (
        <div>{id}</div>
    )
}
