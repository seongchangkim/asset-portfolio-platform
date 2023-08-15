import { useEffect } from "react";
import { Chart } from "chart.js";

const LineChart = ({labels, datasets}) => {
    console.log(labels);
    console.log(datasets);
    useEffect(() => {
        const ref = document.getElementById("lineChart").getContext("2d");
        const lineChart = new Chart(ref, {
            type: 'line',
            data: {
                labels,
                datasets
            },
        });
    }, []);

    return (
        <>
            <h1 className="w-[150px] mx-auto mt-10 text-xl font-semibold capitalize">Line Chart</h1>
            <div className="w-1/2 h-screen flex mx-auto my-auto">
                <div className="border border-gray-400 pt-0 rounded-xl w-full h-fit my-auto shadow-xl">
                    <canvas id="lineChart"></canvas>
                </div>
            </div>
        </>
    );
}

export default LineChart;