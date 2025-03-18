import DateHelper from "./datehelper.js"
import LSHelper from "./lshelper.js"
import { drawStockList } from "./preferences.js"
import { SERVER_URL, DAYS_ON_GRAPH } from "./init.js"
import { drawGraph } from "./draw.js"
import { $tickerInput } from "../main.js"

export const saveFile = (data, filename, type) => {
    const blob = new Blob([data], { type });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
}

export const getPriceFromServer = async params => {
    if (!params.ticker) {
        console.warn('Введите тикер перед отправкой запроса.');
        return [];
    }

    const fromDate = DateHelper.getShiftedDateTime(params.lastDay, DAYS_ON_GRAPH, params.timeframe)

    // попытка загрузить из localStorage
    let result = LSHelper.loadData(params)
    if (result) {
        return result
    }

    try {
        //https://iss.moex.com/iss/engines/stock/markets/shares/boards/TQBR/securities/SBER/candles.json?interval=60&from=2025-02-27
        const response = await fetch(`${SERVER_URL}${params.ticker}/candles.json?interval=${params.timeframe.param}&from=${fromDate}`);
        //console.log(`${SERVER_URL}${params.ticker}/candles.json?interval=${params.timeframe.param}&from=${fromDate}`)
        result = await response.json();
     
        let historyData = result.candles?.data || [];
        historyData = historyData.slice(0, DAYS_ON_GRAPH); 

        //const jsonData = JSON.stringify(historyData);
        //saveFile(jsonData, "data.json", "application/json");        
        
        if (!historyData.length) {
            throw new Error(`Нет данных для ${params.ticker}`)
        }

        LSHelper.saveData(historyData)
        return historyData;
    } catch (e) {
        throw new Error(`Ошибка при получении данных для ${params.ticker}: ${e}`)
    }
}

export const addNewData = async () => {

    grafParams.lastDay = chartInstance.data.labels[0]

    try {

        let newHistoryData = await getPriceFromServer(grafParams)
        if (!newHistoryData) {
            return
        }
    
        // Удаление данных, которые уже есть в старом массиве
        newHistoryData = newHistoryData.filter(item => !chartInstance.data.labels.includes(item[6].slice(0, 11)))
    
        const newData = newHistoryData.map(item => [item[0], item[1]])
        const newLabels = newHistoryData.map(item => item[6].slice(0, 11))
    
        // Добавляем к текущим данным
        chartInstance.data.datasets[0].data.unshift(...newData);
        chartInstance.data.labels.unshift(...newLabels);
    
        // Обновляем границы оси Y
        chartInstance.options.scales.y.min = Math.min(...chartInstance.data.datasets[0].data.map(item => item[1]));
        chartInstance.options.scales.y.max = Math.max(...chartInstance.data.datasets[0].data.map(item => item[0]));
        console.log(chartInstance.options.scales.y.min , chartInstance.options.scales.y.max )
    
        // Обновляем границы оси X
        const barsOnScreen = chartInstance.options.scales.x.max - chartInstance.options.scales.x.min
        chartInstance.options.scales.x.min = 80
        chartInstance.options.scales.x.max = 80 + barsOnScreen
    
        // Перерисовываем график
        chartInstance.update();

    } catch(e) {
        console.error(e.name, e.message)
    }
}

export const fetchAndRenderHistoryData = async params => {
    const historyData = await getPriceFromServer(params)
    if (!historyData.length) return;
    drawGraph(historyData, params.ticker)
}

export const initialGrahpLoad = () => {
    LSHelper.storageInit()
    LSHelper.loadPref()
    grafParams.ticker = appTickets[0]
    drawStockList()
    fetchAndRenderHistoryData(grafParams)
        .catch(e => {
            alert(`Ошибка получения данных или некорректный ticker`)
            console.error(e.name, e.message)            
        })    
}

export const getFormData = event => {
    event.preventDefault();
    return {
        ticker: $tickerInput.value.trim()
    };
}