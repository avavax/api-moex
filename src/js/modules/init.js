export const APP_INIT = 'moex-api-app'
export const SERVER_URL = 'https://iss.moex.com/iss/engines/stock/markets/shares/boards/TQBR/securities/'
export const DAYS_ON_GRAPH = 100;
export const DAYS_ON_VISIBLE = 50;
export const COLORS = { red: '#ef5350', green: '#26a69a' };
export const TIME_FRAMES = {
    hour: {
        param: 60,
        name:'1 час'
    },
    day: {
        param: 24,
        name:'1 день'
    },
    week: {
        param: 7,
        name:'1 неделя'
    },
    month: {
        param: 31,
        name:'1 месяц'
    },
    quarter: {
        param: 4,
        name:'1 квартал'
    }
}

export let $container, $currentData, $tickerDate, $tickerInput, $tickerForm, $tickerSubmit, $dataTimeframes, $stocksList, $canvas

window.appTickets = ['SBER','GAZP', 'NVTK', 'MTLR', 'VTBR', 'YDEX', 'LKOH', 'ROSN', 'GMKN', 'TKC']
window.currentTimeFrame = TIME_FRAMES.day;
window.chartInstance = null;


/*
Запросы к API Мосбиржи
https://iss.moex.com/iss/history/engines/stock/markets/shares/boards/TQBR/securities?from=2022-09-30&start=100

https://iss.moex.com/iss/engines/stock/markets/shares/boards/TQBR/securities/SBER/candles.json?interval=60&from=2025-02-27

interval – Размер свечки - целое число 1 (1 минута), 10 (10 минут), 60 (1 час), 24 (1 день), 7 (1 неделя), 31 (1 месяц) или 4 (1 квартал). По умолчанию дневные данные.

https://iss.moex.com/iss/history/engines/stock/markets/shares/boards/TQBR/securities/SBER.json?start=3000&interval=10

https://iss.moex.com/iss/securities/imoex

https://iss.moex.com/iss/engines/stock/markets/shares/securities/GAZP.json?iss.meta=off
*/