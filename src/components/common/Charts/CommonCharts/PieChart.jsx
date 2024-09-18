import { useRef } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie, getElementAtEvent } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend);

function PieChart({ options, data, width = 300, height = 300, chartClick }) {

    const chartRef = useRef();

    const onClick = (event) => {
        const { current: chart } = chartRef;
        const clickArr =  getElementAtEvent(chart, event);
        chartClick(clickArr[0]);
    }

    return <Pie ref={chartRef} plugins={[ChartDataLabels]} width={width} height={height} options={options} data={data} onClick={onClick} />;
}

export default PieChart;