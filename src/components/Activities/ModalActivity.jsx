import { Badge, Button, FloatingLabel, Modal, Progress, Spinner, Textarea } from 'flowbite-react';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { SubactivityRow } from '../SubactivityRow';
import { URL } from '../../../environments/global';
import Swal from 'sweetalert2';
import { Editor } from "primereact/editor";


export const ModalActivity = ({ isOpen, onClose, activity }) => {
  const [openModal, setOpenModal] = useState(false);
  const [subactivities, setSubactivities] = useState([]);
  const [newSubactivities, setNewSubactivities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activityId, setActivityId] = useState(null);
  const [activityDetails, setActivityDetails] = useState(null);
  const [showEditor, setShowEditor] = useState(false);

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
    } catch (error) {
      console.error('Error fetching subactivities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchActivityDetails = async (id) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${URL}/findOneActivity/${id}`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      setActivityDetails(data.activity[0]);
    } catch (error) {
      console.error('Error fetching activity details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubactivityStatusChange = (subactivityId, isChecked) => {
    const newStatus = isChecked ? 'completada' : 'no completada';

    if (typeof subactivityId === 'string' && subactivityId.startsWith('new-')) {
      setNewSubactivities(prev =>
        prev.map(subactivity =>
          subactivity.tempId === subactivityId
            ? { ...subactivity, status: newStatus }
            : subactivity
        )
      );
    } else {
      setSubactivities(prev =>
        prev.map(subactivity =>
          subactivity.id === subactivityId
            ? { ...subactivity, status: newStatus }
            : subactivity
        )
      );
    }
  };

  const handleSubactivityDeleted = (subactivityId) => {
    if (typeof subactivityId === 'string' && subactivityId.startsWith('new-')) {
      setNewSubactivities(prev => prev.filter(s => s.tempId !== subactivityId));
    } else {
      setSubactivities(prev => prev.filter(s => s.id !== subactivityId));
    }
  };

  const handleAddSubactivity = () => {
    const tempId = `new-${Date.now()}`;
    const newSubactivity = {
      tempId,
      name: 'Nueva subactividad',
      status: 'no completada',
      comment: '',
      activity_id: activityId,
    };

    setNewSubactivities(prev => [...prev, newSubactivity]);
  };

  const handleSubactivityNameChange = (id, newName) => {
    if (typeof id === 'string' && id.startsWith('new-')) {
      setNewSubactivities(prev =>
        prev.map(subactivity =>
          subactivity.tempId === id
            ? { ...subactivity, name: newName }
            : subactivity
        )
      );
    } else {
      setSubactivities(prev =>
        prev.map(subactivity =>
          subactivity.id === id
            ? { ...subactivity, name: newName }
            : subactivity
        )
      );
    }
  };

  const handleSubactivityCommentChange = (id, newComment) => {
    if (typeof id === 'string' && id.startsWith('new-')) {
      setNewSubactivities(prev =>
        prev.map(subactivity =>
          subactivity.tempId === id
            ? { ...subactivity, comment: newComment }
            : subactivity
        )
      );
    } else {
      setSubactivities(prev =>
        prev.map(subactivity =>
          subactivity.id === id
            ? { ...subactivity, comment: newComment }
            : subactivity
        )
      );
    }
  };

  const handleSaveSubactivities = async () => {
    if (newSubactivities.length === 0) {
      Swal.fire({
        title: 'No hay cambios',
        text: 'No hay nuevas subactividades para guardar.',
        icon: 'info',
      });
      return;
    }

    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas guardar ${newSubactivities.length} subactividad(es)?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, guardar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      setIsLoading(true);
      try {
        // Guardar cada subactividad
        const savePromises = newSubactivities.map(async (subactivity) => {
          const response = await fetch(`${URL}/saveSubactivity`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: subactivity.name,
              status: subactivity.status,
              comment: subactivity.comment,
              activity_id: subactivity.activity_id,
            }),
          });

          if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
          }
          return response.json();
        });

        await Promise.all(savePromises);

        // Actualizar la lista de subactividades
        await fetchSubactivities(activityId);

        // Limpiar las nuevas subactividades
        setNewSubactivities([]);

        Swal.fire({
          title: 'Guardado',
          text: 'Las subactividades se han guardado correctamente.',
          icon: 'success',
        });
      } catch (error) {
        console.error('Error al guardar subactividades:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron guardar algunas subactividades.',
          icon: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSaveExistingSubactivities = async () => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas guardar todos los cambios en las subactividades existentes?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, guardar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      setIsLoading(true);
      try {
        // Guardar cambios en subactividades existentes
        const updatePromises = subactivities.map(async (subactivity) => {
          console.log(subactivity);
          const response = await fetch(`${URL}/updateSubactivity/${subactivity.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: subactivity.name,
              status: subactivity.status,
              comment: subactivity.comment,
            }),
          });

          const responseData = await response.json();  // Leer una sola vez
          console.log(responseData);

          if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
          }
          return responseData;  // Retornar los datos ya leídos
        });

        await Promise.all(updatePromises);

        Swal.fire({
          title: 'Actualizado',
          text: 'Los cambios en las subactividades se han guardado correctamente.',
          icon: 'success',
        });
      } catch (error) {
        console.error('Error al actualizar subactividades:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron guardar algunos cambios.',
          icon: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const determineBadge = (status) => {
    if (status === 'no empezado') {
      return { color: 'failure', text: 'no empezado' };
    } else if (status === 'en proceso') {
      return { color: 'warning', text: 'En proceso' };
    } else if (status === 'finalizado') {
      return { color: 'success', text: 'Finalizado' };
    }
    return { color: 'gray', text: status };
  };

  useEffect(() => {
    if (isOpen) {
      fetchActivityDetails(activity);
    }
  }, [isOpen, activity]);

  const badgeInfo = determineBadge(activityDetails ? activityDetails.status : 'no empezado');

  return (
    <>
      <Modal dismissible show={isOpen} onClose={onClose} size='4xl'>
        <Modal.Header>
          {isLoading ? "Cargando..." : activityDetails ? activityDetails.name : "Actividad"}
        </Modal.Header>
        <Modal.Body>
          {isLoading ? (
            <div className="text-center">
              <Spinner aria-label="Cargando actividad" size="xl" />
              <p className="mt-2">Cargando detalles de la actividad...</p>
            </div>
          ) : activityDetails ? (
            <div className='flex'>
              <div className="space-y-4 w-[60%]">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Descripción</h3>
                  <p className="mt-1 text-gray-900">{activityDetails.description || 'Sin descripción'}</p>
                </div>

                <div className="flex gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Fecha de inicio</h3>
                    <p className="mt-1">{moment(activityDetails.start_date).format('LL')}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Fecha de finalización</h3>
                    <p className="mt-1">{moment(activityDetails.end_date).format('LL')}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Estatus</h3>
                  <Badge color={badgeInfo.color} size="sm" className="w-fit mt-1">
                    {badgeInfo.text}
                  </Badge>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">% de avance</h3>
                  <Progress progress={activityDetails.completion_percentage} className="mt-1" />
                  <span className="text-sm text-gray-600 mt-1">
                    {activityDetails.completion_percentage}%
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Responsable</h3>
                  <p className="mt-1">{activityDetails.responsible_name || 'No asignado'}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Dependencias</h3>
                  <p className="mt-1">{activityDetails.dependencies || 'Ninguna'}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Entregables</h3>
                  <p className="mt-1">{activityDetails.deliverables || 'Ninguno'}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Subactividades</h3>
                  <Button
                    size="xs"
                    onClick={() => {
                      setOpenModal(true);
                      fetchSubactivities(activityDetails.id);
                      setActivityId(activityDetails.id);
                    }}
                    className="mt-1"
                  >
                    Ver Subactividades
                  </Button>
                </div>
              </div>
              <div className=' w-[50%] flex flex-col'>
                <h3 className="text-sm font-medium text-gray-500 mb-5">Comentarios</h3>
                {/* Fila por comentario */}
                <div className='flex justify-between'>
                  {/* Icono */}
                  <div className='h-10 w-10 rounded-full bg-gray-500 flex items-center justify-center'>
                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                      <path fill-rule="evenodd" d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  {/* Campo de comentario */}
                  <div className='w-[85%]'>
                    <div onClick={() => {
                      setShowEditor(!showEditor);
                      console.log(showEditor);
                    }} className={`${!showEditor ? 'block' : 'hidden'} border border-gray-300 rounded-lg min-h-10 flex items-center justify-start p-2 text-gray-500 cursor-pointer`}>Escribe un comentario...</div>
                    {/* <Textarea id="comment" placeholder="Deja un comentario" required rows={1} className={`${showEditor ? 'block' : 'hidden'}`}/> */}

                    <Editor value={text} onTextChange={(e) => setText(e.htmlValue)} className={`${showEditor ? 'block' : 'hidden'}`} style={{ height: '320px' }} />


                  </div>
                </div>
              </div>
            </div>

          ) : (
            <p>No se encontró información para esta actividad.</p>
          )}
        </Modal.Body>
      </Modal>

      <Modal
        size="4xl"
        show={openModal}
        onClose={() => {
          setOpenModal(false);
          setNewSubactivities([]);
        }}
      >
        <Modal.Header>Subactividades</Modal.Header>
        <Modal.Body>
          {isLoading ? (
            <div className="text-center">
              <Spinner aria-label="Cargando subactividades" size="xl" />
              <p className="mt-2">Cargando subactividades...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between">
                <Button size="sm" onClick={handleAddSubactivity}>
                  Agregar Subactividad
                </Button>
                <div className="flex gap-2">
                  {newSubactivities.length > 0 && (
                    <Button
                      color="success"
                      size="sm"
                      onClick={handleSaveSubactivities}
                    >
                      Guardar nuevas ({newSubactivities.length})
                    </Button>
                  )}
                  <Button
                    color="blue"
                    size="sm"
                    onClick={handleSaveExistingSubactivities}
                    disabled={subactivities.length === 0}
                  >
                    Guardar cambios existentes
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3">Subactividad</th>
                      <th scope="col" className="px-6 py-3">Estado</th>
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
                        handleSubactivityStatusChange={handleSubactivityStatusChange}
                        handleSubactivityNameChange={handleSubactivityNameChange}
                        handleSubactivityCommentChange={handleSubactivityCommentChange}
                        handleSubactivityDeleted={handleSubactivityDeleted}
                      />
                    ))}
                    {newSubactivities.map((subactivity, index) => (
                      <SubactivityRow
                        key={subactivity.tempId}
                        subactivity={{
                          ...subactivity,
                          id: subactivity.tempId,
                        }}
                        index={subactivities.length + index}
                        handleSubactivityStatusChange={handleSubactivityStatusChange}
                        handleSubactivityNameChange={handleSubactivityNameChange}
                        handleSubactivityCommentChange={handleSubactivityCommentChange}
                        handleSubactivityDeleted={handleSubactivityDeleted}
                        isNew={true}
                      />
                    ))}
                    {subactivities.length === 0 && newSubactivities.length === 0 && (
                      <tr>
                        <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                          No hay subactividades registradas
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};