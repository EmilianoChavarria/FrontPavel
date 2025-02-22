import { div, tr } from 'framer-motion/client';
import React, { useRef, useState } from 'react';
import { CardActivity } from './CardActivity';
import { Accordion, Badge, Button, Checkbox, FloatingLabel, Label, Modal, Select } from 'flowbite-react';
import moment from 'moment';
import { FaRegEye } from 'react-icons/fa';
import { URL } from '../../environments/global';
import { HiCheck, HiClock } from 'react-icons/hi';
import Swal from 'sweetalert2';
import { comment } from 'postcss';
import { SubactivityRow } from './SubactivityRow';
import { ModalActivity } from './Activities/ModalActivity';
import { act } from 'react-dom/test-utils';

export const CategoryCard = ({ category }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [openModal, setOpenModal] = useState(false);
    const [openActivityModal, setOpenActivityModal] = useState(false);
    const [openActivityOneModal, setOpenActivityOneModal] = useState(false);
    const [activityObject, setActivityObject] = useState(null);
    
    const [responsibles, setResponsibles] = useState([]);
    const [categoryId, setCategoryId] = useState(null);
    const [deliverables, setDeliverables] = useState([]); // Estado para los deliverables
    const [currentDeliverable, setCurrentDeliverable] = useState(''); // Estado temporal para el input
    // const [responsibleId, setResponsibleId] = useState('');
    const [formActivityData, setFormActivityData] = useState({
        category_id: '',
        name: '',
        description: '',
        start_date: '',
        end_date: '',
        responsible_id: '',
        dependencies: '',
        deliverables: '',
    });

    const [isLoading, setIsLoading] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen((prevState) => !prevState);
    };

    const fetchResponsibles = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${URL}/getAllUsers`);
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            const data = await response.json();
            console.log(data)
            setResponsibles(data.users);
        } catch (error) {
            console.error('Error fetching subactivities:', error);
        } finally {
            setIsLoading(false);
        }
    };

    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormActivityData({
            ...formActivityData,
            [name]: value,
        });
    };

    const handleDeliverableChange = (e) => {
        setCurrentDeliverable(e.target.value); // Actualiza el valor temporal del input
    };

    const handleAddDeliverable = () => {
        if (currentDeliverable.trim() !== '') {
            setDeliverables([...deliverables, currentDeliverable]); // Agrega el deliverable al arreglo
            setCurrentDeliverable(''); // Limpia el input
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Incluir los deliverables en formActivityData
        const activityData = {
            ...formActivityData,
            category_id: categoryId,
            deliverables: deliverables.join(', '), // Convierte el arreglo en una cadena separada por comas
        };

        console.log('Datos enviados: ', activityData);

        // Aquí puedes enviar los datos al backend
        await sendData(activityData);

        // Limpiar el formulario y los deliverables
        setFormActivityData({
            category_id: '',
            name: '',
            description: '',
            start_date: '',
            end_date: '',
            responsible_id: '',
            dependencies: '',
            deliverables: '',
        });
        setDeliverables([]); // Limpiar la lista de deliverables
        setCurrentDeliverable(''); // Limpiar el input

        // Cerrar el modal después de enviar el formulario
        // setOpenActivityModal(false);
    };

    const sendData = async (data) => {
        try {
            const response = await fetch(`${URL}/saveActivity`, {
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
            Swal.fire({
                title: '¡Actividad registrada!',
                text: `${result.message}`,
                icon: 'success',
                confirmButtonText: 'Aceptar',
            });

            const { category_id, ...activityDataWithoutCategory } = data;
            console.log(activityDataWithoutCategory);
            category.activities.push({
                ...activityDataWithoutCategory, completion_percentage: "0.00",
                status: "no empezado"
            });

            setOpenActivityModal(false);
            console.log(category.activities);
            console.log("Response: ", result);
        } catch (error) {
            console.error("Error: ", error.message);
        }
    };

    const handleRemoveDeliverable = (index) => {
        const newDeliverables = deliverables.filter((_, i) => i !== index); // Filtra el arreglo para excluir el elemento con el índice dado
        setDeliverables(newDeliverables); // Actualiza el estado
    };



    // TODO: Borrar por si no jala
    

    // TODO: Controlar el estado del modal
    const handleOpenModal = () => {
        setOpenActivityOneModal(true);
    };

    const handleCloseModal = () => {
        setOpenActivityOneModal(false); // Cierra el modal
        setActivityObject(null); // Resetea el objeto de la actividad

    };

    return (
        <div className="bg-[#ffffff] border border-gray-200 rounded-lg hover:shadow-xl px-4 py-4 h-fit">
            <div className="px-2 flex flex-col">
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-gray-700 text-lg">{category.name}</h2>
                    {/* Menu desplegable - Acciones de categoria y actividd */}
                    <div ref={dropdownRef} className="aboslute">
                        <button
                            id="dropdownMenuIconButton"
                            onClick={toggleDropdown}
                            className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-600 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                            type="button"
                        >
                            <svg
                                className="w-4 h-4"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 4 15"
                            >
                                <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                            </svg>
                        </button>

                        {/* Menú desplegable */}
                        {isDropdownOpen && (
                            <div
                                id="dropdownDots"
                                className="z-10 absolute bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
                            >
                                <ul
                                    className="py-2 text-sm text-gray-700 dark:text-gray-200"
                                    aria-labelledby="dropdownMenuIconButton"
                                >
                                    <li>
                                        <a
                                            onClick={() => {
                                                toggleDropdown();
                                                setOpenActivityModal(true);
                                                setCategoryId(category.id);
                                                fetchResponsibles();
                                            }}
                                            href="#"
                                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                        >
                                            Agregar actividad
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            onClick={toggleDropdown}
                                            href="#"
                                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                        >
                                            Editar categoría
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            onClick={toggleDropdown}
                                            href="#"
                                            className="text-red-600 block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                        >
                                            Eliminar categoría
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
                <span className="text-sm text-gray-500 mt-1 min-h-[40px]">{category.description}</span>
                <span className="mt-4 font-semibold text-gray-700">Actividades: </span>
                {category.activities.length === 0 ? (
                    <span className="text-sm text-gray-500 mt-1">No hay actividades registradas</span>
                ) : (

                    <div className='flex flex-col mt-2'>
                        {category.activities.map((activity, index) => (
                            <div
                                key={index}
                                className="mt-2 border-b border-gray-300 rounded-lg p-2 flex justify-between items-center cursor-pointer text-gray-700 hover:shadow-sm hover:shadow-gray-400"
                                onClick={() => {
                                    handleOpenModal();
                                    setActivityObject(activity);
                                }}
                            >
                                <span className='text-sm'>{activity.name}</span>
                                <span className='text-sm'>%{activity.completion_percentage}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>


            




            {/* Modal para agregar actividad */}
            <Modal dismissible show={openActivityModal} onClose={() => setOpenActivityModal(false)}>
                <Modal.Header>Agregar actividad</Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit}>
                        <FloatingLabel
                            variant="outlined"
                            label="Nombre"
                            name="name"
                            value={formActivityData.name}
                            onChange={handleChange}
                        />
                        <FloatingLabel
                            variant="outlined"
                            label="Descripcion"
                            name="description"
                            value={formActivityData.description}
                            onChange={handleChange}
                        />
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col max-w-[48%] w-full">
                                <label htmlFor="" className="text-gray-600">
                                    Fecha de inicio
                                </label>
                                <input
                                    type="date"
                                    name="start_date"
                                    onChange={handleChange}
                                    value={formActivityData.start_date}
                                    className="rounded-md border border-gray-300 text-sm"
                                />
                            </div>
                            <div className="flex flex-col max-w-[48%] w-full">
                                <label htmlFor="" className="text-gray-600">
                                    Fecha final
                                </label>
                                <input
                                    type="date"
                                    name="end_date"
                                    onChange={handleChange}
                                    value={formActivityData.end_date}
                                    className="rounded-md border border-gray-300 text-sm"
                                />
                            </div>
                        </div>
                        <div className="mt-2">
                            <div className="mb-2 block">
                                <Label htmlFor="countries" value="Responsable de la actividad" />
                            </div>
                            <Select
                                id="responsibles"
                                name="responsible_id"
                                value={formActivityData.responsible_id || ''}
                                onChange={(e) => {
                                    handleChange(e);
                                }}
                            >
                                <option value="" disabled>Seleccione un responsable</option>
                                {responsibles.map((responsible) => (
                                    <option key={responsible.id} value={responsible.id}>{responsible.name}</option>
                                ))}
                            </Select>


                        </div>
                        <div className="mt-2">
                            <FloatingLabel
                                variant="outlined"
                                label="Dependencias"
                                name="dependencies"
                                value={formActivityData.dependencies}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mt-2 flex flex-col">
                            <div className='flex items-center justify-between'>

                                <div className='w-[85%]'>
                                    <FloatingLabel
                                        variant="outlined"
                                        label="Entregables"
                                        name="deliverables"
                                        value={currentDeliverable}
                                        onChange={handleDeliverableChange}
                                    />

                                </div>

                                <Button
                                    type="button"
                                    onClick={handleAddDeliverable}
                                    className="mt-2 h-fit my-auto"
                                    size="xs"
                                >
                                    Agregar
                                </Button>
                            </div>
                            {/* Mostrar la lista de deliverables */}
                            <ul className="px-2">
                                <span className='text-base text-gray-600'>Listado de entregables:</span>
                                {deliverables.map((deliverable, index) => (
                                    <li key={index} className="text-sm text-gray-600 flex items-center justify-between">
                                        <div className='flex items-center justify-start'>
                                            <span >
                                                {deliverable}
                                            </span>
                                            <button
                                                type="button"
                                                size="xs"
                                                onClick={() => handleRemoveDeliverable(index)}
                                                className="text-red-500 hover:text-red-700 ml-2 text-2xl"
                                            >
                                                ×
                                            </button>

                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <Button type="submit" className="mt-5">
                            Registrar proyecto
                        </Button>
                    </form>
                </Modal.Body>
            </Modal>

            {/* Modal para info de una actividad */}
            <ModalActivity isOpen={openActivityOneModal} onClose={handleCloseModal} activity={activityObject} />

        </div>
    );
};