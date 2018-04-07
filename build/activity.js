"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pcr_1 = require("../pcr");
const done_1 = require("../plugins/done");
const util_1 = require("../util");
const assignment_1 = require("./assignment");
const insertTo = util_1.elemById('infoActivity');
function addActivityElement(el) {
    insertTo.insertBefore(el, insertTo.querySelector('.activity'));
}
exports.addActivityElement = addActivityElement;
function createActivity(type, assignment, date, className) {
    const cname = className || pcr_1.classById(assignment.class);
    const te = util_1.element('div', ['activity', 'assignmentItem', assignment.baseType, type], `
        <i class='material-icons'>${type}</i>
        <span class='title'>${assignment.title}</span>
        <small>${assignment_1.separate(cname)[2]}</small>
        <div class='range'>${util_1.dateString(date)}</div>`, `activity${assignment.id}`);
    te.setAttribute('data-class', cname);
    const { id } = assignment;
    if (type !== 'delete') {
        te.addEventListener('click', () => {
            const doScrolling = async () => {
                const el = util_1._$(document.querySelector(`.assignment[id*=\"${id}\"]`));
                await util_1.smoothScroll((el.getBoundingClientRect().top + document.body.scrollTop) - 116);
                el.click();
            };
            if (document.body.getAttribute('data-view') === '0') {
                return doScrolling();
            }
            else {
                util_1._$(document.querySelector('#navTabs>li:first-child')).click();
                return setTimeout(doScrolling, 500);
            }
        });
    }
    if (done_1.assignmentInDone(assignment.id)) {
        te.classList.add('done');
    }
    return te;
}
exports.createActivity = createActivity;
