import { $stocksList } from "../main.js"

export const drawStockList = () => {
    $stocksList.innerHTML = ""
    const html = appTickets
        .map(item => getStockDiv(item))
        .join('');
    $stocksList.insertAdjacentHTML('beforeend', html);
}

export const deletePref = e => {
    const index = appTickets.indexOf(e.target.dataset.ticker);
    if (index !== -1) {
        appTickets.splice(index, 1);
    }
    drawStockList()
}

export const addItemtoArr = item => {
    if (!appTickets.includes(item)) {
        appTickets.unshift(item)
    }
}

export const getStockDiv = ticker => {
    const isDisabled = (ticker === grafParams.ticker) ? "disabled" : ""
    const isCurrent = (ticker === grafParams.ticker) ? "text-danger" : ""
    return `
        <div class="row justify-content-center align-items-center pt-1">
            <div class="col-6" >
                <button type="button" class="btn pref-switch ${isCurrent}" data-ticker="${ticker}">${ticker}</button>
            </div>
            <div class="col-6">
                <button type="button" class="btn-close pref-remove" aria-label="удалить" ${isDisabled} data-ticker="${ticker}"></button>
            </div>
        </div>    
    `
}
