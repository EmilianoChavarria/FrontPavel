import { Badge, Button, Modal, Progress } from 'flowbite-react';
import moment from 'moment';
import React, { useState } from 'react';
import { SubactivityRow } from '../SubactivityRow';
import { URL } from '../../../environments/global';
import Swal from 'sweetalert2';



export const ModalActivity = ({ isOpen, onClose, activity }) => {

  const [openModal, setOpenModal] = useState(false);
  const [subactivities, setSubactivities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Función para obtener las subactividades
  const fetchSubactivities = async (activityId) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${URL}/getSubactivitiesByActivity/${activityId}`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      setSubactivities(data.subactivities);
      // console.log(data.subactivities)
    } catch (error) {
      console.error('Error fetching subactivities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubactivityStatusChange = async (subactivityId, isChecked) => {
    const newStatus = isChecked ? 'completada' : 'no completada';
  
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas marcar esta subactividad como ${newStatus}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: `Sí, ${isChecked ? 'completar' : 'desmarcar'}`,
      cancelButtonText: 'Cancelar',
    });
  
    if (result.isConfirmed) {
      try {
        const response = await fetch(`${URL}/completeSubactivity/${subactivityId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: newStatus }),
        });
  
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
  
        setSubactivities((prev) =>
          prev.map((subactivity) =>
            subactivity.id === subactivityId
              ? { ...subactivity, status: newStatus }
              : subactivity
          )
        );
  
        Swal.fire({
          title: 'Actualizado',
          text: `La subactividad ha sido marcada como ${newStatus}.`,
          icon: 'success',
        });
      } catch (error) {
        console.error('Error al actualizar la subactividad:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo actualizar la subactividad.',
          icon: 'error',
        });
      }
    } else {
      Swal.fire({
        title: 'Cancelado',
        text: 'La subactividad no ha sido modificada.',
        icon: 'info',
      });
    }
  };
  

  const handleSubactivityNameChange = (id, newName) => {
    const updatedSubactivities = subactivities.map(subactivity =>
      subactivity.id === id ? { ...subactivity, name: newName } : subactivity
    );
    setSubactivities(updatedSubactivities);
  };

  const determineBadge = (status) => {
    if (status === 'no empezado') {
      return { color: 'failure', text: 'no empezado' };
    } else if (status === 'en proceso') {
      return { color: 'warning', text: 'En proceso' };
    } else if (status === 'finalizado') {
      return { color: 'success', text: 'Finalizado' };
    }
  };



  const badgeInfo = determineBadge(activity ? activity.status : 'no empezado');


  return (
    <>
      <Modal
        dismissible // Permite cerrar el modal haciendo clic fuera de él
        show={isOpen} // Controla si el modal está abierto o cerrado
        onClose={onClose} // Función que se ejecuta al cerrar el modal
      >
        {/* Usar activity.name en el Modal.Header */}
        <Modal.Header>
          {activity ? activity.name : "Actividad"}
        </Modal.Header>
        <Modal.Body>
          <>
            {activity ? (
              <div>
                <div className='flex flex-col'>
                  {/* Descripción */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Description
                    </h3>
                    <p className='mt-1'>
                      {activity.description}
                    </p>
                  </div>

                  {/* Fechas de inicio y fin */}
                  <div className="flex gap-6  mt-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Fecha de inicio
                      </h3>
                      <p className="mt-1">{moment(activity.start_date).format('ll')}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Fecha de finalización
                      </h3>
                      <p className="mt-1">{moment(activity.end_date).format('ll')}</p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className='mt-4'>
                    <h3 className="text-sm font-medium text-gray-500">
                      Estatus
                    </h3>
                    <Badge color={badgeInfo.color} size="sm" className='w-fit mt-1'>
                      {activity.status}
                    </Badge>
                  </div>

                  {/* Porcentaje de avance */}
                  <div className='mt-4'>
                    <h3 className="text-sm font-medium text-gray-500">
                      % de avance
                    </h3>
                    <Progress progress={activity.completion_percentage} />
                    <span className='text-sm text-gray-600 mt-1'>
                      {activity.completion_percentage}%
                    </span>
                  </div>

                  {/* Responsable */}
                  <div className='mt-4'>
                    <h3 className="text-sm font-medium text-gray-500">
                      Responsable
                    </h3>
                    <p className='mt-1'>
                      {activity.responsible_id}
                    </p>
                  </div>

                  {/* Dependencias */}
                  <div className='mt-4'>
                    <h3 className="text-sm font-medium text-gray-500">
                      Dependencias
                    </h3>
                    <p className='mt-1'>
                      {activity.dependencies}
                    </p>
                  </div>

                  {/* Entregables*/}
                  <div className='mt-4'>
                    <h3 className="text-sm font-medium text-gray-500">
                      Entregables
                    </h3>
                    <p className='mt-1'>
                      {activity.deliverables}
                    </p>
                  </div>

                  {/* Subactividades */}
                  <div className='mt-4'>
                    <h3 className="text-sm font-medium text-gray-500">
                      Subactividades
                    </h3>
                    <Button size="xs" onClick={() => {
                      setOpenModal(true);
                      fetchSubactivities(activity.id);
                    }}>
                      Ver Subactividades
                    </Button>
                  </div>

                </div>
              </div>
            ) : (
              <p>No hay información de la actividad.</p>
            )}
          </>
        </Modal.Body>
      </Modal>

      <Modal
        dismissible
        show={openModal}
        onClose={() => setOpenModal(false)}
      >
        <Modal.Header>Subactividades</Modal.Header>
        <Modal.Body>
          {isLoading ? (
            <p>Cargando subactividades...</p>
          ) : (
            <>
              <Button size="xs" onClick={() => {
                subactivities.push({ id: subactivities.length + 1, name: 'Prueba', status: 'no completada', comment: null });
                setSubactivities([...subactivities]);
                console.log(subactivities);
              }}>
                Agregar Subactividad
              </Button>
              <table className="w-full mt-5 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">Subactividad</th>
                    <th scope="col" className="px-6 py-3">Status</th>
                    <th scope="col" className="px-6 py-3">Comentarios</th>
                    <th scope="col" className="px-6 py-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {subactivities.map((subactivity, index) => (
                    <SubactivityRow
                    key={subactivity.id}
                    subactivity={subactivity}
                    index={index}
                    handleSubactivityStatusChange={handleSubactivityStatusChange} // Pasar la función aquí
                    handleSubactivityNameChange={handleSubactivityNameChange}
                  />
                  ))}
                </tbody>
              </table>
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};