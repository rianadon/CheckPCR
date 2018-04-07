"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dates_1 = require("../dates");
const util_1 = require("../util");
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function createWeek(id) {
    const wk = util_1.element('section', 'week', null, id);
    const dayTable = util_1.element('table', 'dayTable');
    const tr = dayTable.insertRow();
    // tslint:disable-next-line no-loops
    for (let day = 0; day < 7; day++)
        tr.insertCell();
    wk.appendChild(dayTable);
    return wk;
}
exports.createWeek = createWeek;
function createDay(d) {
    const day = util_1.element('div', 'day', null, 'day');
    day.setAttribute('data-date', String(d.getTime()));
    if (Math.floor((d.getTime() - d.getTimezoneOffset()) / 1000 / 3600 / 24) === dates_1.today()) {
        day.classList.add('today');
    }
    const month = util_1.element('span', 'month', MONTHS[d.getMonth()]);
    day.appendChild(month);
    const date = util_1.element('span', 'date', String(d.getDate()));
    day.appendChild(date);
    return day;
}
exports.createDay = createDay;
