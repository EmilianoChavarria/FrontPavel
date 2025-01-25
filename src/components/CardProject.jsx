import { Badge, Progress } from "flowbite-react";
import React, { useState, useEffect, useRef } from "react";
import { HiCheck, HiClock } from "react-icons/hi";
import moment from 'moment';
import { Link } from "react-router-dom";


export const CardProject = ({ project, prop }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);



    const toggleDropdown = () => {
        setIsDropdownOpen((prevState) => !prevState);
    };

    const determineBadge = (endDate, percentage) => {
        const currentDate = moment();
        const finalDate = moment(endDate);

        if (finalDate.isBefore(currentDate, 'day') && percentage < 100) {
            return { color: "failure", text: "Atrasado", icon: HiClock };
        } else if (finalDate.isSameOrAfter(currentDate, 'day')) {
            return { color: "warning", text: "En proceso", icon: HiClock };
        }
    };


    useEffect(() => {


        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };



    }, []);

    const badgeInfo = determineBadge(project.end_date, project.completion_percentage);


    return (
        <Link to={`/project/${project.id}`} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow p-5 cursor-pointer">
            <div className="flex flex-col">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600 cursor-pointer">{project.name}</h3>
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
                                        <a onClick={toggleDropdown}
                                            href="#"
                                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                        >
                                            Editar información
                                        </a>
                                    </li>
                                    <li>
                                        <a onClick={toggleDropdown}
                                            href="#"
                                            className="text-red-600 block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                        >
                                            Eliminar proyecto
                                        </a>
                                    </li>

                                </ul>

                            </div>
                        )}
                    </div>
                </div>
                <p className="text-sm text-gray-500 mt-1 min-h-[40px]">{project.description}</p>
                <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Progreso</span>
                        <span className="text-sm text-gray-600">{project.completion_percentage}%</span>
                    </div>
                    <Progress progress={project.completion_percentage} />
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <svg className="w-[18px] h-[18px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.9" d="M4 10h16m-8-3V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Zm3-7h.01v.01H8V13Zm4 0h.01v.01H12V13Zm4 0h.01v.01H16V13Zm-8 4h.01v.01H8V17Zm4 0h.01v.01H12V17Zm4 0h.01v.01H16V17Z" />
                        </svg>
                        <span className="text-sm text-gray-600">    {moment(project.start_date).format('ll')} - {moment(project.end_date).format('ll')}
                        </span>
                    </div>
                    <Badge color={badgeInfo.color} size="sm" icon={badgeInfo.icon}>
                        {badgeInfo.text}
                    </Badge>
                </div>


            </div>
        </Link>
    );
};
