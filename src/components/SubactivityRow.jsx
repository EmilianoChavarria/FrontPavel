import { Button, Checkbox, FloatingLabel, Label } from 'flowbite-react';
import React, { useState } from 'react'
import { URL } from '../../environments/global';

export const SubactivityRow = ({ subactivity, index, handleSubactivityStatusChange, handleSubactivityNameChange }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(subactivity.name);


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

    return (
        <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
            <td className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {isEditing ? (
                    <input className='w-40 border border-gray-300 rounded-md p-1 focus:ring-0'
                        type="text"
                        value={editedName}
                        onChange={handleNameChange}
                        onBlur={handleNameBlur}
                        onKeyPress={handleKeyPress}
                        autoFocus
                    />
                ) : (
                    <span onClick={handleNameClick}>{subactivity.name}</span>
                )}
            </td>
            <td className=" py-4 gap-2 flex items-center">
                <Checkbox
                    id={`promotion-${subactivity.id}`}
                    checked={subactivity.status === 'completada'}
                    onChange={(e) => handleSubactivityStatusChange(subactivity.id, e.target.checked)}
                />

                <Label htmlFor={`promotion-${subactivity.id}`}>
                    {subactivity.status}
                </Label>
            </td>
            <td>
                <div className="flex items-center justify-center">
                    <FloatingLabel variant="outlined" label="Comentarios" name="name" />
                </div>
            </td>
            <td>
                <div className="flex items-center justify-center">
                    <Button size="xs" color='failure'>Eliminar</Button>
                </div>
            </td>
        </tr>
    );
};
