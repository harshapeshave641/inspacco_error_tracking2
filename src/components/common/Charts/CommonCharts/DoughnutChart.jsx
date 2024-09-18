import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function DoughnutChart({ options, data, width=300, height=300 }) {

    return <Doughnut width={width} height={height} options={options} data={data} />;
}

export default DoughnutChart;