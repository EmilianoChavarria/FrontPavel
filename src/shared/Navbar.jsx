import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom';
import { Button, Modal, FloatingLabel, Textarea } from 'flowbite-react';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { URL } from '../../environments/global';
import { div } from 'framer-motion/client';
import { FaUserCog } from "react-icons/fa";


export const Navbar = ({ setRefreshProjects, setRefreshCategories }) => {
    const [title, setTitle] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [openModalAct, setOpenModalAct] = useState(false);
    const location = useLocation();
    const isProjectPage = location.pathname.startsWith('/project/');
    const isResponsiblePage = location.pathname.startsWith('/responsibles');
    //obtener el id de la url
    const id = location.pathname.split('/')[2];


    // Efecto para actualizar el título según la página
    useEffect(() => {
        if (isProjectPage) {
            setTitle("Categorías del proyecto");
        } else if (isResponsiblePage) {
            setTitle("Gestión de responsables");
        } else {
            setTitle("Proyectos");
        }
    }, [isProjectPage, isResponsiblePage]);

    // Estructura básica de un formulario
    const [formProjectData, setFormProjectData] = useState({
        name: '',
        description: '',
        start_date: '',
        end_date: ''
    });

    const [formCategoryData, setFormCategoryData] = useState({
        name: '',
        description: '',
        project_id: id
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormProjectData({
            ...formProjectData,
            [name]: value
        });
    };

    const handleCategoryChange = (e) => {
        const { name, value } = e.target;
        setFormCategoryData({
            ...formCategoryData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Datos enviados: ", formProjectData);
        await sendData(formProjectData);
        // Notificar a Projects que debe actualizarse
        setRefreshProjects((prev) => !prev);

        setFormProjectData({
            name: '',
            description: '',
            start_date: '',
            end_date: ''
        });

        // Cerrar el modal después de enviar el formulario
        setOpenModal(false);
    };

    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        console.log("Datos enviados: ", formCategoryData);
        await sendCategoryData(formCategoryData);
        // Notificar a Projects que debe actualizarse
        setRefreshCategories((prev) => !prev);

        setFormCategoryData({
            name: '',
            description: '',
            projectId: id
        });

        // Cerrar el modal después de enviar el formulario
        setOpenModalAct(false);
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

    const sendCategoryData = async (data) => {
        try {
            const response = await fetch(`${URL}/saveCategory`, {
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
                        {isProjectPage || location.pathname === '/responsibles' ? (
                            <Link to={'/'} className="text-black rounded flex px-2">
                                <IoIosArrowRoundBack className="h-7 w-7 my-auto" />
                                <span className="my-auto">
                                    Volver
                                </span>
                            </Link>
                        ) : null}
                        <p className='text-black text-2xl font-semibold'>
                            {title}
                        </p>

                    </div>
                    {isProjectPage && (
                        <Button onClick={() => setOpenModalAct(true)}>Agregar nueva categoría</Button>

                    )}
                    {location.pathname === '/' && (
                        <div className='flex gap-x-2'>
                            <Button onClick={() => setOpenModal(true)}>Agregar nuevo proyecto</Button>
                            <Link to={'/responsibles'} className='bg-green-600 rounded-lg flex h-10 items-center justify-center px-4 text-white transition delay-75 duration-75 ease-in-out hover:bg-green-700' color='success'>
                                <FaUserCog className="mr-2 h-5 w-5" />
                                Personal
                            </Link>
                        </div>
                    )}

                    

                    <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>

                        <Modal.Header>Proyecto Nuevo</Modal.Header>
                        <Modal.Body>
                            <form onSubmit={handleSubmit}>
                                <FloatingLabel variant="outlined" label="Name" name="name" value={formProjectData.name} onChange={handleChange} />
                                <Textarea variant="outlined" placeholder="Descripción delproyecto" label="Description" name="description" value={formProjectData.description} onChange={handleChange} />
                                <div className='flex items-center justify-between'>
                                    <div className='flex flex-col max-w-[48%] w-full'>
                                        <label htmlFor="" className='text-gray-600'>Fecha de inicio</label>
                                        <input
                                            type='date'
                                            name="start_date"
                                            onChange={handleChange}
                                            value={formProjectData.start_date}
                                            className='rounded-md border border-gray-300 text-sm'
                                        />
                                    </div>
                                    <div className='flex flex-col max-w-[48%] w-full'>
                                        <label htmlFor="" className='text-gray-600'>Fecha final</label>
                                        <input
                                            type='date'
                                            name="end_date"
                                            onChange={handleChange}
                                            value={formProjectData.end_date}
                                            className='rounded-md border border-gray-300 text-sm'
                                        />
                                    </div>
                                </div>

                                <Button type='submit' className='mt-5'>Registrar proyecto</Button>

                            </form>
                        </Modal.Body>
                    </Modal>

                    <Modal dismissible show={openModalAct} onClose={() => setOpenModalAct(false)}>

                        <Modal.Header>Nueva categoría</Modal.Header>
                        <Modal.Body>
                            <form onSubmit={handleCategorySubmit}>
                                <FloatingLabel variant="outlined" label="Name" name="name" value={formCategoryData.name} onChange={handleCategoryChange} />
                                <FloatingLabel variant="outlined" label="Description" name="description" value={formCategoryData.description} onChange={handleCategoryChange} />


                                <Button type='submit' className='mt-5'>Registrar categoría</Button>

                            </form>
                        </Modal.Body>
                    </Modal>
                </div>
            </div>
        </header>
    )
};
