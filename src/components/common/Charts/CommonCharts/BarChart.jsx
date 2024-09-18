import { useRef } from 'react';
import { Bar, getElementAtEvent } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function BarChart({options, data, barClick}) {

    const chartRef = useRef();
    const onClick = (event) => {
        const { current: chart } = chartRef;
        const clickArr =  getElementAtEvent(chart, event);
        barClick(clickArr[0]);
    }

    return <Bar ref={chartRef} options={options} plugins={[ChartDataLabels]} data={data} onClick={onClick}/>
}

export default BarChart;