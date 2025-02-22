import React, { useEffect, useState } from 'react';
import { ColumnDirective, ColumnsDirective, GanttComponent, Inject } from '@syncfusion/ej2-react-gantt';
import { Selection, DayMarkers } from '@syncfusion/ej2-react-gantt';
import { useParams } from 'react-router-dom';
import { URL } from '../../environments/global';
import moment from 'moment'; // Importa moment

export const GanttChart = () => {
    const [data, setData] = useState([]);
    const [projectData, setProjectData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { projectId } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${URL}/projects/${projectId}/details`);
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
                const result = await response.json();
                console.log(result)
                const projectNewData = result.categories.flatMap(category =>
                    category.activities.map(activity => ({
                        TaskID: activity.id,
                        TaskName: activity.name,
                        StartDate: moment(activity.start_date).format('MM/DD/YYYY'),
                        EndDate: moment(activity.end_date).format('MM/DD/YYYY'),
                        Progress: activity.completion_percentage,
                    }))
                );

                setData(projectNewData);
                setProjectData(result);
                setLoading(false);
            } catch (error) {
                console.error('Fetch error:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [projectId]);

    const taskFields = {
        id: 'TaskID',
        name: 'TaskName',
        startDate: 'StartDate',
        endDate: 'EndDate',
        duration: 'Duration',
        progress: 'Progress',
        dependency: 'Predecessor',
        child: 'subtasks',
    };

    

    const splitterSettings = {
        position: '35%',
    };

    // Asegúrate de que projectData esté disponible antes de acceder a las fechas
    const projectStartDate = projectData ? moment(projectData.start_date).format('MM/DD/YYYY') : null;
    const projectEndDate = projectData ? moment(projectData.end_date).format('MM/DD/YYYY') : null;

    console.log(projectStartDate)
    console.log(projectEndDate)

    return (
        <div style={{ height: '600px', width: '100%' }}>
            <GanttComponent
                id="GanttChart"
                dataSource={data}
                highlightWeekends={true}
                allowSelection={true}
                treeColumnIndex={1}
                taskFields={taskFields}
                height="100%"
                splitterSettings={splitterSettings}
                projectStartDate={projectStartDate}
                projectEndDate={projectEndDate}
            >
                <ColumnsDirective>
                    <ColumnDirective field="TaskID" headerText="ID" width="60" />
                    <ColumnDirective field="TaskName" headerText="Tarea" width="250" />
                    <ColumnDirective field="StartDate" headerText="Inicio" format="MM/dd/yyyy" />
                    <ColumnDirective field="EndDate" headerText="Fin" format="MM/dd/yyyy" />
                    <ColumnDirective field="Progress" headerText="% de avance" width="200" />
                </ColumnsDirective>
                <Inject services={[Selection, DayMarkers]} />
            </GanttComponent>
        </div>
    );
};
