import React, { useState, useRef, useEffect } from 'react';
import { format, differenceInDays, addDays, parse, getMonth, getYear, startOfMonth, endOfMonth, isSameMonth } from 'date-fns';

export const GanttChart = ({ data =
    {
        "id": 5,
        "name": "Prueba",
        "description": "asd",
        "start_date": "2025-04-01",
        "end_date": "2025-06-30",
        "completion_percentage": "0.00",
        "categories": [
            {
                "id": 5,
                "project_id": 5,
                "name": "Primera catergoria",
                "description": "asd",
                "activities": [
                    {
                        "id": 19,
                        "category_id": 5,
                        "name": "Actividad1",
                        "description": "asd",
                        "start_date": "2025-04-10",
                        "end_date": "2025-04-30",
                        "status": "en proceso",
                        "responsible_id": 2,
                        "dependencies": "asd",
                        "deliverables": "asd, asd, aqwe",
                        "completion_percentage": "33.33",
                        "responsible_name": "Pavela Chavarr\u00eda"
                    },
                    {
                        "id": 29,
                        "category_id": 5,
                        "name": "prueba",
                        "description": "asd",
                        "start_date": "2025-04-08",
                        "end_date": "2025-05-02",
                        "status": "no empezado",
                        "responsible_id": 2,
                        "dependencies": "asd",
                        "deliverables": "asd",
                        "completion_percentage": "33.33",
                        "responsible_name": "Pavela Chavarr\u00eda"
                    }
                ]
            },
            {
                "id": 6,
                "project_id": 5,
                "name": "segunda",
                "description": "asd",
                "activities": [
                    {
                        "id": 20,
                        "category_id": 6,
                        "name": "act1 cat 2",
                        "description": "asd",
                        "start_date": "2025-04-08",
                        "end_date": "2025-05-01",
                        "status": "en proceso",
                        "responsible_id": 2,
                        "dependencies": "asdasd",
                        "deliverables": "asd, asd",
                        "completion_percentage": "50.00",
                        "responsible_name": "Pavela Chavarr\u00eda"
                    }
                ]
            }
        ]
    } }) => {
    // Estado para el ancho de las columnas
    const [columnWidth, setColumnWidth] = useState(320);
    const [isDragging, setIsDragging] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const sidebarRef = useRef(null);
    const startXRef = useRef(0);
    const startWidthRef = useRef(0);
    const [expandedCategories, setExpandedCategories] = useState({});
    const [hoveredActivityId, setHoveredActivityId] = useState(null);


    // Constantes de dimensiones
    const ANCHO_DIA = 24;
    const ALTURA_FILA = 35;
    const ALTURA_BARRA = 16;
    const ALTURA_CATEGORIA = 40;

    // Procesar los datos del response
    const projectData = data || {
        start_date: "2025-03-05",
        end_date: "2025-06-30",
        categories: []
    };

    // Convertir fechas string a objetos Date
    const parseApiDate = (dateString) => {
        return parse(dateString, 'yyyy-MM-dd', new Date());
    };

    const [fechaInicioProyecto, setFechaInicioProyecto] = useState(parseApiDate(projectData.start_date));
    const [fechaFinProyecto, setFechaFinProyecto] = useState(parseApiDate(projectData.end_date));


    const handleActivityHover = (activityId) => {
        setHoveredActivityId(activityId);
    };

    const handleActivityHoverEnd = () => {
        setHoveredActivityId(null);
    };

    // Preparar los datos de categorías y actividades
    const [categorias, setCategorias] = useState(
        projectData.categories.map(categoria => {
            // Calcular fechas de categoría basadas en sus actividades
            let fechaInicioCategoria = null;
            let fechaFinCategoria = null;

            if (categoria.activities && categoria.activities.length > 0) {
                const fechasInicio = categoria.activities.map(a => parseApiDate(a.start_date));
                const fechasFin = categoria.activities.map(a => parseApiDate(a.end_date));

                fechaInicioCategoria = new Date(Math.min(...fechasInicio.map(date => date.getTime())));
                fechaFinCategoria = new Date(Math.max(...fechasFin.map(date => date.getTime())));
            } else {
                // Si no hay actividades, usar las fechas del proyecto
                fechaInicioCategoria = fechaInicioProyecto;
                fechaFinCategoria = fechaFinProyecto;
            }

            return {
                ...categoria,
                fechaInicio: fechaInicioCategoria,
                fechaFin: fechaFinCategoria,
                color: getRandomColor(),
                actividades: categoria.activities.map(actividad => ({
                    ...actividad,
                    fechaInicio: parseApiDate(actividad.start_date),
                    fechaFin: parseApiDate(actividad.end_date),
                    color: getRandomColor()
                }))
            };
        })
    );

    // Función para generar colores aleatorios
    function getRandomColor() {
        const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-red-500', 'bg-indigo-500'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // Toggle para expandir/colapsar categorías
    const toggleCategory = (categoryId) => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryId]: !prev[categoryId]
        }));
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
    const calcularPosicionBarra = (fecha) => {
        const diasDesdeInicio = differenceInDays(fecha, fechaInicioProyecto);
        return diasDesdeInicio * ANCHO_DIA;
    };

    const calcularAnchoBarra = (fechaInicio, fechaFin) => {
        const duracion = differenceInDays(fechaFin, fechaInicio) + 1;
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
                </div>
            </div>

            {/* Contenedor principal */}
            <div className="flex flex-1 overflow-hidden">
                {/* Columnas laterales */}
                <div
                    ref={sidebarRef}
                    className={`${isVisible ? 'flex' : 'hidden'} flex-col border-r overflow-hidden`}
                    style={{ width: `${columnWidth}px`, minWidth: '200px' }}
                >
                    {/* Encabezados de columnas */}
                    <div className="flex items-center justify-center border-b h-16">
                        <div className="w-48 p-2 font-medium text-sm">Nombre de tarea</div>
                        <div className="w-24 p-2 font-medium text-sm">Inicio</div>
                        <div className="w-24 p-2 font-medium text-sm">Fin</div>
                    </div>

                    {/* Contenido de las columnas */}
                    <div className="overflow-y-auto">
                        {categorias.map((categoria) => (
                            <React.Fragment key={categoria.id}>
                                {/* Fila de categoría */}
                                <div
                                    className="flex border-b items-center cursor-pointer hover:bg-gray-50"
                                    style={{ height: `${ALTURA_CATEGORIA}px` }}
                                    onClick={() => toggleCategory(categoria.id)}
                                >
                                    <div className="w-48 p-2 text-sm font-medium flex items-center">
                                        <svg
                                            className={`w-4 h-4 mr-1 transform transition-transform ${expandedCategories[categoria.id] ? 'rotate-90' : ''}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                        {categoria.name}
                                    </div>
                                    <div className="w-24 p-2 text-sm">
                                        {format(categoria.fechaInicio, 'dd/MM/yyyy')}
                                    </div>
                                    <div className="w-24 p-2 text-sm">
                                        {format(categoria.fechaFin, 'dd/MM/yyyy')}
                                    </div>
                                </div>

                                {/* Actividades (si la categoría está expandida) */}
                                {expandedCategories[categoria.id] && categoria.actividades.map((actividad) => (
                                    <div
                                        key={actividad.id}
                                        className="flex border-b bg-gray-50 relative group"
                                        style={{ height: `${ALTURA_FILA}px` }}
                                        onMouseEnter={() => handleActivityHover(actividad.id)}
                                        onMouseLeave={handleActivityHoverEnd}
                                        onDoubleClick={() => handleActivityDoubleClick(actividad)}
                                    >
                                        <div className="w-48 p-2 text-sm pl-8">{actividad.name}</div>
                                        <div className="w-24 p-2 text-sm">
                                            {format(actividad.fechaInicio, 'dd/MM/yyyy')}
                                        </div>
                                        <div className="w-24 p-2 text-sm">
                                            {format(actividad.fechaFin, 'dd/MM/yyyy')}
                                        </div>

                                        {/* Botón que aparece en hover */}
                                        {hoveredActivityId === actividad.id && (
                                            <button
                                                className="absolute left-1 top-1/2 transform -translate-y-1/2 bg-gray-50 text-white  rounded text-xs hover:bg-gray-200 h-fit w-fit"
                                                onClick={() => alert(`Actividad: ${actividad}`)}
                                            >
                                                <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                    <path stroke="currentColor" stroke-width="1" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z" />
                                                    <path stroke="currentColor" stroke-width="1" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                </svg>


                                            </button>
                                        )}
                                    </div>
                                ))}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Divisor redimensionable */}
                <div
                    className={`${isVisible ? 'w-1' : 'w-0'} bg-gray-200 hover:bg-blue-500 cursor-col-resize flex items-center justify-center`}
                    onMouseDown={handleResizeStart}
                    style={{ cursor: isDragging ? 'col-resize' : '' }}
                >
                    <button
                        onClick={() => setIsVisible(!isVisible)}
                        className={`${isVisible ? 'ml-1' : 'ml-6'}  whitespace-nowrap bg-gray-500 text-white z-10 hover:bg-gray-400`}
                    >
                        {!isVisible ? '▶' : '◀'}
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

                        {/* Línea vertical para "hoy" si está dentro del rango */}
                        {(differenceInDays(new Date(), fechaInicioProyecto) >= 0 &&
                            differenceInDays(new Date(), fechaFinProyecto) <= 0 && (
                                <div
                                    className="absolute top-0 h-full w-px bg-red-500 z-20"
                                    style={{
                                        left: `${differenceInDays(new Date(), fechaInicioProyecto) * ANCHO_DIA}px`
                                    }}
                                >
                                    <div className="absolute top-0 left-[0.95rem] transform -translate-x-1/2 bg-red-500 text-white text-xs px-1 rounded-b whitespace-nowrap">
                                        Hoy
                                    </div>
                                </div>
                            )
                        )}

                        {/* Barras del Gantt */}
                        {categorias.map((categoria, catIndex) => {
                            // Calcular posición vertical acumulada
                            let verticalOffset = 0;
                            for (let i = 0; i < catIndex; i++) {
                                verticalOffset += ALTURA_CATEGORIA;
                                if (expandedCategories[categorias[i].id]) {
                                    verticalOffset += categorias[i].actividades.length * ALTURA_FILA;
                                }
                            }

                            const catLeft = calcularPosicionBarra(categoria.fechaInicio);
                            const catWidth = calcularAnchoBarra(categoria.fechaInicio, categoria.fechaFin);

                            return (
                                <React.Fragment key={`cat-${categoria.id}`}>
                                    {/* Barra de categoría */}
                                    <div
                                        className="absolute flex items-center"
                                        style={{
                                            top: `${verticalOffset + (ALTURA_CATEGORIA / 2) - (ALTURA_BARRA / 2)}px`,
                                            left: 0,
                                            width: '100%',
                                            height: `${ALTURA_BARRA}px`
                                        }}
                                    >
                                        <div
                                            className={`absolute h-full rounded-lg ${categoria.color} opacity-80`}
                                            style={{
                                                left: `${catLeft}px`,
                                                width: `${catWidth}px`,
                                            }}
                                        ></div>
                                    </div>

                                    {/* Barras de actividades (si la categoría está expandida) */}
                                    {expandedCategories[categoria.id] && categoria.actividades.map((actividad, actIndex) => {
                                        const actTop = verticalOffset + ALTURA_CATEGORIA + (actIndex * ALTURA_FILA) + (ALTURA_FILA / 2) - (ALTURA_BARRA / 2);
                                        const actLeft = calcularPosicionBarra(actividad.fechaInicio);
                                        const actWidth = calcularAnchoBarra(actividad.fechaInicio, actividad.fechaFin);
                                        const progressWidth = (actividad.completion_percentage / 100) * actWidth;

                                        return (
                                            <div
                                                key={`act-${actividad.id}`}
                                                className="absolute flex items-center"
                                                style={{
                                                    top: `${actTop}px`,
                                                    left: 0,
                                                    width: '100%',
                                                    height: `${ALTURA_BARRA}px`
                                                }}
                                            >
                                                {/* Barra completa (fondo) */}
                                                <div
                                                    className={`absolute h-full rounded ${actividad.color} opacity-20`}
                                                    style={{
                                                        left: `${actLeft}px`,
                                                        width: `${actWidth}px`,
                                                    }}
                                                    onDoubleClick={() => {
                                                        alert(`Actividad: ${actividad.name}`);
                                                    }}
                                                ></div>

                                                {/* Progreso (porcentaje completado) */}
                                                <div
                                                    className={`absolute h-full rounded-l ${actividad.color}`}
                                                    style={{
                                                        left: `${actLeft}px`,
                                                        width: `${progressWidth}px`,
                                                    }}
                                                ></div>
                                            </div>
                                        );
                                    })}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};