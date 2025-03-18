import { TIME_FRAMES } from "./init.js"

export default class DateHelper {

    static getDate(date = null) {
        return date ? new Date(date) : new Date();
    }

    static getFormattedDate(date, longFormat = true) {
        if (longFormat) {
            return date.toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            });
        }
 
        return date.toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).replace(/(\d+).(\d+).(\d+)/, '$3-$2-$1');
    }

    static getToday(longFormat = true) {
        return this.getFormattedDate(new Date(), longFormat);
    }

    static getPrevDate(startDate, shift = 1, longFormat = true) {
        const date = this.getDate(startDate); // создаем новый объект, чтобы избежать мутации
        date.setDate(date.getDate() - shift);
        return this.getFormattedDate(date, longFormat);
    }

    static getPrevDates(startDate, quantity = 1, longFormat = true) {
        const arr = [];
        for (let i = 1; i <= quantity; i++) { // Начинаем с 1, чтобы не дублировать startDate
            arr.push(this.getPrevDate(startDate, i, longFormat));
        }
        return arr;
    }

    // getShiftedDateTime() - от текущей даты сдвиг на 100 единиц в днях
    static getShiftedDateTime(startDate = false, shift = 100, timeFrame = TIME_FRAMES.day) {
        startDate = !startDate ? new Date() : startDate;
        
        let realShift = null;
        switch(timeFrame) {
            case TIME_FRAMES.week:  
                realShift = shift * 7 ;
                break;
            case TIME_FRAMES.month:  
                realShift = shift * 30;
                break;
            case TIME_FRAMES.quarter:  
                realShift = shift * 30 * 3;
                break; 
            default: {
                realShift = parseInt(shift * 7 / 5)
            }               
        }

        const date = this.getDate(startDate); // создаем новый объект, чтобы избежать мутации
        date.setDate(date.getDate() - realShift);
        return this.getFormattedDate(date, false)
    }

    static changeGrafParamsFormTF(num) {
        switch (num) {
                case TIME_FRAMES.week.param: {
                    grafParams.timeframe = TIME_FRAMES.week;
                    break
                }
                case TIME_FRAMES.month.param: {
                    grafParams.timeframe = TIME_FRAMES.month;
                    break
                }    
                case TIME_FRAMES.quarter.param: {
                    grafParams.timeframe = TIME_FRAMES.quarter;
                    break
                }
                default: {
                    grafParams.timeframe = TIME_FRAMES.day; 
                }
                grafParams.lastDay = DateHelper.getToday(false)  // Запрос истории. Надо будет сверить, есть ли в локалстор
            }
    }

}
