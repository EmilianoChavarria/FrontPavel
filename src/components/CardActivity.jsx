import { Accordion, Badge } from 'flowbite-react'
import React from 'react'

export const CardActivity = ({ activity }) => {
    console.log(activity)
    return (

        <Accordion.Panel >
            <Accordion.Title>{activity.name}</Accordion.Title>
            <Accordion.Content>
                <div className='flex flex-col'>
                    <span className='text-sm text-gray-500 mt-1 font-medium'>{activity.description}</span>
                    <span className='text-sm text-gray-500 mt-1 flex font-medium' >

                        Entregables:
                        <ul>
                            <li>
                                <Badge color="gray" className='ml-1 w-fit'>{activity.deliverables}</Badge>
                            </li>
                        </ul>
                    </span>
                    <span className='text-sm text-gray-500 mt-1 flex font-medium' >
                        Dependencias:
                        <span className='ml-1 font-normal'>
                            {activity.dependencies}
                        </span>
                    </span>
                </div>

            </Accordion.Content>
        </Accordion.Panel>
    )
}
