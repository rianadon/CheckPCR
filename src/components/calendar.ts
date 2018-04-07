import { today } from '../dates'
import { element } from '../util'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function createWeek(id: string): HTMLElement {
    const wk = element('section', 'week', null, id)
    const dayTable = element('table', 'dayTable') as HTMLTableElement
    const tr = dayTable.insertRow()
    // tslint:disable-next-line no-loops
    for (let day = 0; day < 7; day++) tr.insertCell()
    wk.appendChild(dayTable)

    return wk
}

export function createDay(d: Date): HTMLElement {
    const day = element('div', 'day', null, 'day')
    day.setAttribute('data-date', String(d.getTime()))
    if (Math.floor((d.getTime() - d.getTimezoneOffset()) / 1000 / 3600 / 24) === today()) {
      day.classList.add('today')
    }

    const month = element('span', 'month', MONTHS[d.getMonth()])
    day.appendChild(month)

    const date = element('span', 'date', String(d.getDate()))
    day.appendChild(date)

    return day
}
