import { Button, Checkbox, FloatingLabel, Label, TextInput } from 'flowbite-react';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { URL } from '../../environments/global';

export const SubactivityRow = ({
    subactivity,
    index,
    handleSubactivityStatusChange,
    handleSubactivityDeleted,
    handleSubactivityNameChange,
    handleSubactivityCommentChange,
    isNew = false
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(subactivity.name);
    const [editedComment, setEditedComment] = useState(subactivity.comment || '');

    const handleNameClick = () => {
        setIsEditing(true);
    };

    const handleNameChange = (e) => {
        setEditedName(e.target.value);
    };

    const handleNameBlur = () => {
        setIsEditing(false);
        handleSubactivityNameChange(subactivity.id, editedName);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            setIsEditing(false);
            handleSubactivityNameChange(subactivity.id, editedName);
        }
    };

    const handleCommentChange = (e) => {
        const newComment = e.target.value;
        setEditedComment(newComment);
        handleSubactivityCommentChange(subactivity.id, newComment);
    };

    const handleDeleteSubactivity = async () => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        });

        if (result.isConfirmed) {
            // Si es una subactividad nueva, solo la eliminamos del estado local
            if (isNew) {
                handleSubactivityDeleted(subactivity.id);
                Swal.fire({
                    title: 'Eliminada',
                    text: 'La subactividad ha sido eliminada.',
                    icon: 'success',
                });
            } else {
                // Si es una subactividad existente, hacemos la llamada a la API
                try {
                    const response = await fetch(`${URL}/deleteSubactivity/${subactivity.id}`, {
                        method: 'DELETE',
                    });

                    if (!response.ok) {
                        throw new Error(`Error ${response.status}: ${response.statusText}`);
                    }

                    Swal.fire({
                        title: 'Eliminada',
                        text: 'La subactividad ha sido eliminada correctamente.',
                        icon: 'success',
                    });

                    handleSubactivityDeleted(subactivity.id);
                } catch (error) {
                    console.error('Error al eliminar la subactividad:', error);
                    Swal.fire({
                        title: 'Error',
                        text: 'No se pudo eliminar la subactividad.',
                        icon: 'error',
                    });
                }
            }
        }
    };

    return (
        <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
            <td className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {isEditing ? (
                    <TextInput
                        className='w-full'
                        value={editedName}
                        onChange={handleNameChange}
                        onBlur={handleNameBlur}
                        onKeyPress={handleKeyPress}
                        autoFocus
                    />
                ) : (
                    <span
                        onClick={handleNameClick}
                        className="cursor-pointer hover:text-blue-600"
                    >
                        {subactivity.name}
                    </span>
                )}
            </td>
            <td className="py-4 gap-2 flex items-center">
                <Checkbox
                    id={`status-${subactivity.id}`}
                    checked={subactivity.status === 'completada'}
                    onChange={(e) => handleSubactivityStatusChange(subactivity.id, e.target.checked)}
                />
                <Label htmlFor={`status-${subactivity.id}`}>
                    {subactivity.status === 'completada' ? 'Completada' : 'No completada'}
                </Label>
            </td>
            <td className="px-4 py-4">
                <TextInput
                    value={editedComment}
                    onChange={handleCommentChange}
                    placeholder="Agregar comentario"
                />
            </td>
            <td className="px-4 py-4">
                <Button
                    size="xs"
                    color='failure'
                    onClick={handleDeleteSubactivity}
                >
                    Eliminar
                </Button>
            </td>
        </tr>
    );
};