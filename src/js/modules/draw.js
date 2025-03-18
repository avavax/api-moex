import Chart from 'chart.js/auto'
import zoomPlugin from 'chartjs-plugin-zoom'
import { COLORS, DAYS_ON_VISIBLE } from "./init.js"
import { $canvas } from "../main.js"

Chart.register(zoomPlugin)

export function drawGraph (priceResult, ticker) {
    const minPrice = Math.min(...priceResult.map(item => item[3]));
    const maxPrice = Math.max(...priceResult.map(item => item[2]));
 
    const xData = priceResult.map(item => item[6].slice(0, 11))
    const yData = priceResult.map(item => [item[0], item[1]])

    // Отбираем последние DAYS_ON_VISIBLE значений
    const lastIndex = xData.length;
    const firstIndex = Math.max(lastIndex - DAYS_ON_VISIBLE, 0);

    createPriceChart(xData, yData, ticker, minPrice, maxPrice, firstIndex, lastIndex);
}

export function createPriceChart(xData, yData, cName, minPrice, maxPrice, firstIndex, lastIndex) {
    if (chartInstance) {
        chartInstance.destroy();
    }

    const bgColor = yData.map(item => item[0] > item[1] ? COLORS.red : COLORS.green);

    const data = {
        labels: xData,
        datasets: [{
            label: `Курс акций ${cName}`,
            data: yData,
            backgroundColor: bgColor
        }]
    };

    const config = {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            scales: {
                x: {
                    min: firstIndex, // Начинаем с последних 20 значений
                    max: lastIndex - 1, // Последняя точка - крайняя правая
                    ticks: {
                        autoSkip: true
                    }
                },
                y: {
                    min: minPrice,
                    max: maxPrice
                }
            },
            plugins: {
                legend: {
                    position: 'top'
                },
                zoom: {
                    pan: { enabled: true, mode: 'xy' },
                    zoom: {
                        mode: 'x',
                        pinch: { enabled: true },
                        wheel: { enabled: true }
                    }
                }
            }
        }
    };

    const context = $canvas.getContext('2d');
    chartInstance = new Chart(context, config);
}
