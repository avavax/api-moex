import { TIME_FRAMES } from "./modules/init.js"
import DateHelper from "./modules/datehelper.js"
import LSHelper from "./modules/lshelper.js"
import { addNewData, fetchAndRenderHistoryData, initialGrahpLoad, getFormData } from "./modules/model.js"
import { drawStockList, deletePref, addItemtoArr } from "./modules/preferences.js"

export let $container, $currentData, $tickerDate, $tickerInput, $tickerForm, $tickerSubmit, $dataTimeframes, $stocksList, $canvas

window.grafParams = {
    ticker: appTickets[0],
    timeframe: TIME_FRAMES.day,
    lastDay: DateHelper.getToday(false)
}

window.addEventListener('DOMContentLoaded', () => {

    let isDragging = false;
    let reload = false

    $container = document.querySelector('.container');
    $currentData = document.querySelector('#current-data');
    $tickerDate = document.querySelector('#tickerDate')
    $tickerInput = document.querySelector('#tickerInput')
    $tickerForm = document.querySelector('#tickerForm')
    $tickerSubmit = document.querySelector('#tickerForm [type="submit"]')
    $dataTimeframes = document.querySelector('.data-timeframes')
    $stocksList = document.querySelector('.stocks-list')
    $canvas = document.querySelector('canvas')

    $tickerSubmit.addEventListener('click', event => {

        const formData = getFormData(event)
        const newTicker = formData.ticker.trim().toUpperCase()

        if (appTickets.includes(newTicker)) return 

        const params = {
            ticker: newTicker,
            lastDay: DateHelper.getToday(false),
            timeframe: grafParams.timeframe
        }

        fetchAndRenderHistoryData(params)
            .then(() => {
                addItemtoArr(params.ticker)
                grafParams.lastDay = params.lastDay
                grafParams.ticker = params.ticker
                drawStockList()
                LSHelper.savePref()

            })
            .catch(e => {
                //alert(`Ошибка получения данных или некорректный ticker`)
                console.error(e.name, e.message)

            })
    })

    $stocksList.addEventListener('click', e => {
        if (e.target.classList.contains('pref-remove')) {
            deletePref(e)
            LSHelper.savePref()
            return
        }

        if (e.target.classList.contains('pref-switch')) {
            const newTicker = e.target.dataset.ticker

            if (newTicker) {
                const params = {
                    ticker: newTicker,
                    lastDay: DateHelper.getToday(false),
                    timeframe: grafParams.timeframe
                }
                fetchAndRenderHistoryData(params)
                    .then(() => {
                        grafParams.lastDay = params.lastDay
                        grafParams.ticker = params.ticker 
                        console.log(grafParams.lastDay, grafParams.ticker)               
                        drawStockList()
                    })
                    .catch(e => {
                        alert(`Ошибка получения данных или некорректный ticker`)
                        console.error(e.name, e.message)
                    })
            }
        }
    })

    $canvas.addEventListener("mousedown", (event) => {
        if (event.button === 0) { // Левая кнопка мыши
            isDragging = true;
        }
    });

    $canvas.addEventListener("mousemove", (event) => {
        if (isDragging) {
            const { min, max } = chartInstance.scales.x;

            // Проверяем, достиг ли график границы
            if (min <= 0) {
                if (!reload) {
                    addNewData()
                    reload = true

                    setTimeout(function() {
                        reload = false
                    }, 3000)
                }

            }
        }
    });

    $canvas.addEventListener("mouseup", () => {
        isDragging = false;   
    });

    $currentData.innerHTML = DateHelper.getToday();

    $dataTimeframes.addEventListener('click', e => {
        if (e.target.classList.contains('btn') && !e.target.classList.contains('active')) {

            DateHelper.changeGrafParamsFormTF(parseInt(e.target.dataset.timeframe))
            
            for (let $elem of $dataTimeframes.children) {
                    $elem.classList.remove('active')
            }
            e.target.classList.add('active')
            fetchAndRenderHistoryData(grafParams)
        }
    })

    initialGrahpLoad()
})
