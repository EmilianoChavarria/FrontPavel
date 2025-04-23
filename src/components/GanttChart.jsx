import React, { useState, useRef, useEffect } from 'react';
import { format, differenceInDays, addDays, parse, getMonth, getYear, startOfMonth, endOfMonth, isSameMonth } from 'date-fns';

export const GanttChart = () => {
    // Estado para el ancho de las columnas
    const [columnWidth, setColumnWidth] = useState(320);
    const [isDragging, setIsDragging] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const sidebarRef = useRef(null);
    const startXRef = useRef(0);
    const startWidthRef = useRef(0);

    // Ancho fijo para cada día (en píxeles)
    const ANCHO_DIA = 24;

    // Fechas del proyecto configuradas manualmente
    const [fechaInicioProyecto, setFechaInicioProyecto] = useState(parse('20/04/2025', 'dd/MM/yyyy', new Date()));
    const [fechaFinProyecto, setFechaFinProyecto] = useState(parse('30/06/2025', 'dd/MM/yyyy', new Date()));

    // Columnas configurables
    const [columnas, setColumnas] = useState([
        { id: 'nombre', nombre: 'Tarea', width: 'w-48' },
        { id: 'fechaInicio', nombre: 'Inicio', width: 'w-24' },
        { id: 'fechaFin', nombre: 'Fin', width: 'w-24' },
        { id: 'porcentaje', nombre: '%', width: 'w-16' },
        { id: 'estado', nombre: 'Estado', width: 'w-32' }
    ]);

    // Datos de ejemplo con fechas y porcentajes
    const [actividades, setActividades] = useState([
        {
            id: 1,
            nombre: 'Análisis de requerimientos',
            fechaInicio: '22/04/2025',
            fechaFin: '25/04/2025',
            porcentaje: 80,
            estado: 'En progreso',
            color: 'bg-blue-500'
        },
        {
            id: 2,
            nombre: 'Diseño de interfaz',
            fechaInicio: '25/04/2025',
            fechaFin: '28/04/2025',
            porcentaje: 30,
            estado: 'Pendiente',
            color: 'bg-green-500'
        },
        {
            id: 3,
            nombre: 'Implementación',
            fechaInicio: '28/04/2025',
            fechaFin: '30/04/2025',
            porcentaje: 20,
            estado: 'Pendiente',
            color: 'bg-purple-500'
        }
    ]);

    // Convertir fechas string a objetos Date
    const parseDate = (dateString) => {
        return parse(dateString, 'dd/MM/yyyy', new Date());
    };

    // Calcular duración en días
    const calcularDuracion = (inicio, fin) => {
        return differenceInDays(parseDate(fin), parseDate(inicio)) + 1;
    };

    // Calcular el total de días del proyecto
    const totalDias = differenceInDays(fechaFinProyecto, fechaInicioProyecto) + 1;

    // Generar array de fechas para el timeline
    const fechas = Array.from({ length: totalDias }, (_, i) =>
        addDays(fechaInicioProyecto, i)
    );

    // Función para agrupar los días por meses
    const getMesesEnRango = () => {
        const meses = [];
        let currentMonth = getMonth(fechaInicioProyecto);
        let currentYear = getYear(fechaInicioProyecto);

        let startDate = fechaInicioProyecto;
        let endDate = fechaFinProyecto;

        while (startDate <= endDate) {
            const monthStart = startOfMonth(startDate);
            const monthEnd = endOfMonth(startDate);

            const diasEnMes = fechas.filter(date =>
                isSameMonth(date, monthStart)
            ).length;

            meses.push({
                nombre: format(monthStart, 'MMMM yyyy'),
                inicio: differenceInDays(monthStart, fechaInicioProyecto),
                dias: diasEnMes,
                ancho: diasEnMes * ANCHO_DIA
            });

            startDate = addDays(monthEnd, 1);
        }

        return meses;
    };

    const mesesEnRango = getMesesEnRango();

    // Calcular posición izquierda y ancho para cada barra (en píxeles)
    const calcularPosicionBarra = (fechaInicio) => {
        const diasDesdeInicio = differenceInDays(parseDate(fechaInicio), fechaInicioProyecto);
        return diasDesdeInicio * ANCHO_DIA;
    };

    const calcularAnchoBarra = (fechaInicio, fechaFin) => {
        const duracion = calcularDuracion(fechaInicio, fechaFin);
        return duracion * ANCHO_DIA;
    };

    // Handlers para drag and drop de columnas
    const handleColumnDragStart = (e, index) => {
        e.dataTransfer.setData('columnIndex', index);
        e.currentTarget.classList.add('opacity-50');
    };

    const handleDragOver = (e) => e.preventDefault();

    const handleDrop = (e, targetIndex) => {
        e.preventDefault();
        const sourceIndex = e.dataTransfer.getData('columnIndex');
        const newColumns = [...columnas];
        const [movedColumn] = newColumns.splice(sourceIndex, 1);
        newColumns.splice(targetIndex, 0, movedColumn);
        setColumnas(newColumns);
    };

    const handleDragEnd = (e) => e.currentTarget.classList.remove('opacity-50');

    // Handlers para redimensionamiento de columnas
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isDragging) return;

            const deltaX = e.clientX - startXRef.current;
            const newWidth = startWidthRef.current + deltaX;

            // Establecer límites mínimos y máximos
            const minWidth = 200;
            const maxWidth = 600;

            setColumnWidth(Math.min(Math.max(newWidth, minWidth), maxWidth));
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            document.body.style.cursor = '';
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'col-resize';
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    const handleResizeStart = (e) => {
        setIsDragging(true);
        startXRef.current = e.clientX;
        startWidthRef.current = columnWidth;
        e.preventDefault();
    };

    // Handler para cambiar las fechas del proyecto
    const handleFechaProyectoChange = (tipo, e) => {
        const value = e.target.value;
        const date = parse(value, 'dd/MM/yyyy', new Date());

        if (tipo === 'inicio') {
            setFechaInicioProyecto(date);
        } else {
            setFechaFinProyecto(date);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-white">
            {/* Barra de herramientas */}
            <div className="flex items-center p-2 border-b">
                <div className="flex space-x-2">
                    <button className="px-3 py-1 text-sm border rounded flex items-center">
                        <span className="mr-1">+</span> Añadir tarea
                    </button>

                    {/* Controles para fechas del proyecto */}
                    <div className="flex items-center ml-4 space-x-2">
                        <label className="text-sm">Inicio Proyecto:</label>
                        <input
                            type="text"
                            value={format(fechaInicioProyecto, 'dd/MM/yyyy')}
                            onChange={(e) => handleFechaProyectoChange('inicio', e)}
                            className="w-24 px-2 py-1 text-sm border rounded"
                            placeholder="dd/mm/yyyy"
                        />

                        <label className="text-sm ml-2">Fin Proyecto:</label>
                        <input
                            type="text"
                            value={format(fechaFinProyecto, 'dd/MM/yyyy')}
                            onChange={(e) => handleFechaProyectoChange('fin', e)}
                            className="w-24 px-2 py-1 text-sm border rounded"
                            placeholder="dd/mm/yyyy"
                        />
                    </div>
                </div>
            </div>

            {/* Contenedor principal */}
            <div className="flex flex-1 overflow-hidden">
                {/* Columnas laterales */}
                <div
                    ref={sidebarRef}
                    className={`${isVisible ? 'flex' : 'hidden'} flex flex-col border-r overflow-hidden`}
                    style={{ width: `${columnWidth}px`, minWidth: '200px' }}
                >
                    {/* Encabezados de columnas */}
                    <div className="flex items-center justify-center border-b h-16">
                        {columnas.map((col, index) => (
                            <div
                                key={col.id}
                                draggable
                                onDragStart={(e) => handleColumnDragStart(e, index)}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, index)}
                                onDragEnd={handleDragEnd}
                                className={`${col.width} p-2 font-medium text-sm cursor-move hover:bg-gray-100 flex`}

                            >
                                <svg className='h-4 w-4' fill="#d6d6d6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" enableBackground="new 0 0 52 52" xmlSpace="preserve" stroke="#8f8f8f"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M20,4c2.2,0,4,1.8,4,4s-1.8,4-4,4s-4-1.8-4-4S17.8,4,20,4z M32,4c2.2,0,4,1.8,4,4 s-1.8,4-4,4s-4-1.8-4-4S29.8,4,32,4z M20,16c2.2,0,4,1.8,4,4s-1.8,4-4,4s-4-1.8-4-4S17.8,16,20,16z M32,16c2.2,0,4,1.8,4,4 s-1.8,4-4,4s-4-1.8-4-4S29.8,16,32,16z M20,28c2.2,0,4,1.8,4,4s-1.8,4-4,4s-4-1.8-4-4S17.8,28,20,28z M32,28c2.2,0,4,1.8,4,4 s-1.8,4-4,4s-4-1.8-4-4S29.8,28,32,28z M20,40c2.2,0,4,1.8,4,4s-1.8,4-4,4s-4-1.8-4-4S17.8,40,20,40z M32,40c2.2,0,4,1.8,4,4 s-1.8,4-4,4s-4-1.8-4-4S29.8,40,32,40z"></path> </g> </g></svg>
                                {col.nombre}
                            </div>
                        ))}
                    </div>

                    {/* Contenido de las columnas */}
                    <div className="overflow-y-auto">
                        {actividades.map((act) => (
                            <div key={act.id} className="flex border-b">
                                {columnas.map(col => (
                                    <div
                                        key={`${act.id}-${col.id}`}
                                        className={`${col.width} p-2 text-sm truncate ${col.id === 'porcentaje' ? 'text-right' : ''
                                            }`}
                                    >
                                        {col.id === 'porcentaje' ? `${act.porcentaje}%` : act[col.id]}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Divisor redimensionable */}
                <div
                    className={`${isVisible ? 'w-1' : 'w-0'} bg-gray-200 hover:bg-blue-500 cursor-col-resize flex items-center justify-center`}
                    onMouseDown={handleResizeStart}
                    style={{ cursor: isDragging ? 'col-resize' : '' }}
                >
                    <button onClick={() => {
                        setIsVisible(!isVisible);
                    }} className={`${isVisible ? 'ml-1' : 'ml-6'} whitespace-nowrap bg-gray-500 text-white z-10 hover:bg-gray-400`}>
                        {!isVisible &&
                            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H5m14 0-4 4m4-4-4-4" />
                            </svg>
                        }

                        {isVisible &&
                            <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12l4-4m-4 4 4 4" />
                            </svg>

                        }
                    </button>
                </div>

                {/* Área del Gantt */}
                <div className="flex-1 overflow-x-auto overflow-y-hidden relative">
                    {/* Encabezado de fechas */}
                    <div className="sticky top-0 z-10 bg-white border-b">
                        {/* Fila de meses */}
                        <div className="flex h-8 border-b">
                            {mesesEnRango.map((mes, i) => (
                                <div
                                    key={i}
                                    className="border-l text-xs text-center flex items-center justify-center font-semibold"
                                    style={{
                                        width: `${mes.ancho}px`,
                                        minWidth: `${mes.ancho}px`
                                    }}
                                >
                                    {mes.nombre}
                                </div>
                            ))}
                        </div>

                        {/* Fila de días */}
                        <div className="flex h-8">
                            {fechas.map((fecha, i) => (
                                <div
                                    key={i}
                                    className={`border-l text-xs text-center flex items-center justify-center ${i === differenceInDays(new Date(), fechaInicioProyecto) ? 'bg-blue-100 font-bold' : ''
                                        }`}
                                    style={{
                                        width: `${ANCHO_DIA}px`,
                                        minWidth: `${ANCHO_DIA}px`
                                    }}
                                >
                                    {format(fecha, 'dd')}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Líneas de tiempo */}
                    <div className="relative h-full" style={{ width: `${totalDias * ANCHO_DIA}px` }}>
                        {/* Líneas verticales */}
                        <div className="absolute top-0 left-0 h-full flex">
                            {fechas.map((_, i) => (
                                <div
                                    key={`line-${i}`}
                                    className="border-l border-gray-200 h-full"
                                    style={{
                                        width: `${ANCHO_DIA}px`,
                                        minWidth: `${ANCHO_DIA}px`
                                    }}
                                ></div>
                            ))}
                        </div>

                        {/* Barras del Gantt con progreso */}
                        {actividades.map((act, i) => {
                            const left = calcularPosicionBarra(act.fechaInicio);
                            const width = calcularAnchoBarra(act.fechaInicio, act.fechaFin);
                            const progressWidth = (act.porcentaje / 100) * width;

                            return (
                                <div
                                    key={`gantt-${act.id}`}
                                    className="absolute h-8 flex items-center"
                                    style={{ top: `${i * 40}px`, left: 0, width: '100%' }}
                                >
                                    {/* Barra completa (fondo) */}
                                    <div
                                        className={`absolute h-4 rounded ${act.color} opacity-20`}
                                        style={{
                                            left: `${left}px`,
                                            width: `${width}px`,
                                        }}
                                    ></div>

                                    {/* Progreso (porcentaje completado) */}
                                    <div
                                        className={`absolute h-4 rounded-l ${act.color}`}
                                        style={{
                                            left: `${left}px`,
                                            width: `${progressWidth}px`,
                                        }}
                                    ></div>

                                    
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};