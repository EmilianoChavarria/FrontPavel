import { Button } from 'flowbite-react'
import React from 'react'

export const Navbar = ({ title = "Mis Proyectos" }) => {
    return (
        <header className='bg-white shadow-sm p-4'>
            <div className='max-w-7xl mx-auto'>
                <div className='flex justify-between items-center'>
                    <p className='text-black text-2xl font-semibold'>
                        {title}
                    </p>
                    <Button>Agregar Nuevo Proyecto</Button>
                </div>
            </div>
        </header>
    )
}
