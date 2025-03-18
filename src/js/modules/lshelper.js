import { APP_INIT } from "./init.js"
import DateHelper from "./datehelper.js"

export default class LSHelper {

    static storageInit() {
        const lastDate = localStorage.getItem(APP_INIT)
        const today = DateHelper.getToday(false)

        if (lastDate !== today) {
            this.loadPref()
            localStorage.clear()
            localStorage.setItem(APP_INIT, today)
        }
    }

    static savePref() {
        localStorage.setItem(`${APP_INIT}-pref`, JSON.stringify(appTickets))
    }

    static loadPref() {
        const tickets = localStorage.getItem(`${APP_INIT}-pref`)
        if (tickets) {
            appTickets = JSON.parse(tickets)
        }
    }

    static saveData(arr) {
        const key = this.getKey()
        localStorage.setItem(key, JSON.stringify(arr))
    }

    static loadData(params) {
        const key = this.getKey(params)
        const result  = localStorage.getItem(key)
        if (result) {
            return JSON.parse(result)
        }
        return null
    }

    static getKey(params = false) {
        if (params) {
           return `${params.lastDay}-${params.ticker}-${params.timeframe.param}`  
        }
        return `${grafParams.lastDay}-${grafParams.ticker}-${grafParams.timeframe.param}` 
    }

}
