import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom';
import { Button, Modal, FloatingLabel } from 'flowbite-react';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { URL } from '../../environments/global';

export const Navbar = () => {
    const [title, setTitle] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const location = useLocation();
    const isProjectPage = location.pathname.startsWith('/project/');

    // Efecto para actualizar el título según la página
    useEffect(() => {
        if (isProjectPage) {
            setTitle("Status del proyecto");
        } else {
            setTitle("Mis Proyectos");
        }
    }, [isProjectPage]);

    // Estructura básica de un formulario
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        start_date: '',
        end_date: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Datos enviados: ", formData);
        await sendData(formData);
    };

    const sendData = async (data) => {
        try {
            const response = await fetch(`${URL}/saveProject`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Error ${response.status}: ${errorMessage}`);
            }

            const result = await response.json();
            console.log("Response: ", result);
        } catch (error) {
            console.error("Error: ", error.message);
        }
    };

    return (
        <header className='bg-white shadow-sm p-4'>
            <div className='max-w-7xl mx-auto'>
                <div className='flex justify-between items-center'>
                    <div className='flex my-auto'>
                        {isProjectPage && (
                            <Link to={'/'} className=" text-black rounded flex px-2">
                                <IoIosArrowRoundBack className="h-7 w-7 my-auto" />
                                <span className="my-auto" >
                                    Volver
                                </span>
                            </Link>
                        )}
                        <p className='text-black text-2xl font-semibold'>
                            {title}
                        </p>
                    </div>
                    {!isProjectPage && (
                    <Button onClick={() => setOpenModal(true)}>Agregar Nuevo Proyecto</Button>)}
                    <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
                        
                        <Modal.Header>Proyecto Nuevo</Modal.Header>
                        <Modal.Body>
                            <form onSubmit={handleSubmit}>
                                <FloatingLabel variant="outlined" label="Name" name="name" value={formData.name} onChange={handleChange} />
                                <FloatingLabel variant="outlined" label="Description" name="description" value={formData.description} onChange={handleChange} />
                                <div className='flex items-center justify-between'>
                                    <div className='flex flex-col max-w-[48%] w-full'>
                                        <label htmlFor="" className='text-gray-600'>Fecha de inicio</label>
                                        <input
                                            type='date'
                                            name="start_date"
                                            onChange={handleChange}
                                            value={formData.start_date}
                                            className='rounded-md border border-gray-300 text-sm'
                                        />
                                    </div>
                                    <div className='flex flex-col max-w-[48%] w-full'>
                                        <label htmlFor="" className='text-gray-600'>Fecha final</label>
                                        <input
                                            type='date'
                                            name="end_date"
                                            onChange={handleChange}
                                            value={formData.end_date}
                                            className='rounded-md border border-gray-300 text-sm'
                                        />
                                    </div>
                                </div>

                                <Button type='submit' className='mt-5'>Registrar proyecto</Button>

                            </form>
                        </Modal.Body>
                    </Modal>
                </div>
            </div>
        </header>
    )
};
