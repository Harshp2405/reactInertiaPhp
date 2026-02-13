import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
);

export default function StatChart({ labels, data, label, borderColor }) {
    const chartData = {
        labels,
        datasets: [
            {
                label,
                data,
                borderColor: borderColor || 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.4,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { display: true },
            title: { display: false },
        },
    };

    return <Line data={chartData} options={options} />;
}
