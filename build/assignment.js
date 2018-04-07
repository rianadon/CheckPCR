"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dates_1 = require("../dates");
const display_1 = require("../display");
const navigation_1 = require("../navigation");
const pcr_1 = require("../pcr");
const activity_1 = require("../plugins/activity");
const athena_1 = require("../plugins/athena");
const customAssignments_1 = require("../plugins/customAssignments");
const done_1 = require("../plugins/done");
const modifiedAssignments_1 = require("../plugins/modifiedAssignments");
const util_1 = require("../util");
const resizer_1 = require("./resizer");
const mimeTypes = {
    'application/msword': ['Word Doc', 'document'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['Word Doc', 'document'],
    'application/vnd.ms-powerpoint': ['PPT Presentation', 'slides'],
    'application/pdf': ['PDF File', 'pdf'],
    'text/plain': ['Text Doc', 'plain']
};
const dmp = new diff_match_patch(); // For diffing
function populateAddedDeleted(diffs, edits) {
    let added = 0;
    let deleted = 0;
    diffs.forEach((diff) => {
        if (diff[0] === 1) {
            added++;
        }
        if (diff[0] === -1) {
            deleted++;
        }
    });
    util_1._$(edits.querySelector('.additions')).innerHTML = added !== 0 ? `+${added}` : '';
    util_1._$(edits.querySelector('.deletions')).innerHTML = deleted !== 0 ? `-${deleted}` : '';
    edits.classList.add('notEmpty');
    return added > 0 || deleted > 0;
}
function computeWeekId(split) {
    const startSun = new Date(split.start.getTime());
    startSun.setDate(startSun.getDate() - startSun.getDay());
    return `wk${startSun.getMonth()}-${startSun.getDate()}`;
}
exports.computeWeekId = computeWeekId;
// This function separates the parts of a class name.
function separate(cl) {
    const m = cl.match(/((?:\d*\s+)?(?:(?:hon\w*|(?:adv\w*\s*)?core)\s+)?)(.*)/i);
    if (m == null)
        throw new Error(`Could not separate class string ${cl}`);
    return m;
}
exports.separate = separate;
function assignmentClass(assignment, data) {
    return (assignment.class != null) ? data.classes[assignment.class] : 'Task';
}
exports.assignmentClass = assignmentClass;
function separatedClass(assignment, data) {
    return separate(assignmentClass(assignment, data));
}
exports.separatedClass = separatedClass;
function createAssignment(split, data) {
    const { assignment, reference } = split;
    // Separate the class description from the actual class
    const separated = separatedClass(assignment, data);
    const weekId = computeWeekId(split);
    let smallTag = 'small';
    let link = null;
    const athenaData = athena_1.getAthenaData();
    if (athenaData && assignment.class != null && (athenaData[data.classes[assignment.class]] != null)) {
        link = athenaData[data.classes[assignment.class]].link;
        smallTag = 'a';
    }
    const e = util_1.element('div', ['assignment', assignment.baseType, 'anim'], `<${smallTag}${link ? ` href='${link}' class='linked' target='_blank'` : ''}>
                           <span class='extra'>${separated[1]}</span>
                           ${separated[2]}
                       </${smallTag}>
                       <span class='title'>${assignment.title}</span>
                       <input type='hidden' class='due'
                              value='${assignment.end === 'Forever' ? 0 : assignment.end}' />`, assignment.id + weekId);
    if ((reference && reference.done) || done_1.assignmentInDone(assignment.id)) {
        e.classList.add('done');
    }
    e.setAttribute('data-class', assignmentClass(assignment, data));
    const close = util_1.element('a', ['close', 'material-icons'], 'close');
    close.addEventListener('click', closeOpened);
    e.appendChild(close);
    // Prevent clicking the class name when an item is displayed on the calendar from doing anything
    if (link != null) {
        util_1._$(e.querySelector('a')).addEventListener('click', (evt) => {
            if ((document.body.getAttribute('data-view') === '0') && !e.classList.contains('full')) {
                evt.preventDefault();
            }
        });
    }
    const complete = util_1.element('a', ['complete', 'material-icons', 'waves'], 'done');
    util_1.ripple(complete);
    const id = split.assignment.id;
    complete.addEventListener('mouseup', (evt) => {
        if (evt.which === 1) {
            let added = true;
            if (reference != null) {
                if (e.classList.contains('done')) {
                    reference.done = false;
                }
                else {
                    added = false;
                    reference.done = true;
                }
                customAssignments_1.saveExtra();
            }
            else {
                if (e.classList.contains('done')) {
                    done_1.removeFromDone(assignment.id);
                }
                else {
                    added = false;
                    done_1.addToDone(assignment.id);
                }
                done_1.saveDone();
            }
            if (document.body.getAttribute('data-view') === '1') {
                setTimeout(() => {
                    document.querySelectorAll(`.assignment[id^=\"${id}\"], #test${id}, #activity${id}, #ia${id}`).forEach((elem) => {
                        elem.classList.toggle('done');
                    });
                    if (added) {
                        if (document.querySelectorAll('.assignment.listDisp:not(.done)').length !== 0) {
                            document.body.classList.remove('noList');
                        }
                    }
                    else {
                        if (document.querySelectorAll('.assignment.listDisp:not(.done)').length === 0) {
                            document.body.classList.add('noList');
                        }
                    }
                    resizer_1.resize();
                }, 100);
            }
            else {
                document.querySelectorAll(`.assignment[id^=\"${id}\"], #test${id}, #activity${id}, #ia${id}`).forEach((elem) => {
                    elem.classList.toggle('done');
                });
                if (added) {
                    if (document.querySelectorAll('.assignment.listDisp:not(.done)').length !== 0) {
                        document.body.classList.remove('noList');
                    }
                }
                else {
                    if (document.querySelectorAll('.assignment.listDisp:not(.done)').length === 0) {
                        document.body.classList.add('noList');
                    }
                }
            }
        }
    });
    e.appendChild(complete);
    // If the assignment is a custom one, add a button to delete it
    if (split.custom) {
        const deleteA = util_1.element('a', ['material-icons', 'deleteAssignment', 'waves'], 'delete');
        util_1.ripple(deleteA);
        deleteA.addEventListener('mouseup', (evt) => {
            if (evt.which !== 1 || !reference)
                return;
            customAssignments_1.removeFromExtra(reference);
            customAssignments_1.saveExtra();
            if (document.querySelector('.full') != null) {
                document.body.style.overflow = 'auto';
                const back = util_1.elemById('background');
                back.classList.remove('active');
                setTimeout(() => {
                    back.style.display = 'none';
                }, 350);
            }
            e.remove();
            display_1.display(false);
        });
        e.appendChild(deleteA);
    }
    // Modification button
    const edit = util_1.element('a', ['editAssignment', 'material-icons', 'waves'], 'edit');
    edit.addEventListener('mouseup', (evt) => {
        if (evt.which === 1) {
            const remove = edit.classList.contains('active');
            edit.classList.toggle('active');
            util_1._$(e.querySelector('.body')).setAttribute('contentEditable', remove ? 'false' : 'true');
            if (!remove) {
                e.querySelector('.body').focus();
            }
            const dn = e.querySelector('.complete');
            dn.style.display = remove ? 'block' : 'none';
        }
    });
    util_1.ripple(edit);
    e.appendChild(edit);
    const start = new Date(dates_1.fromDateNum(assignment.start));
    const end = assignment.end === 'Forever' ? assignment.end : new Date(dates_1.fromDateNum(assignment.end));
    const times = util_1.element('div', 'range', assignment.start === assignment.end ? util_1.dateString(start) : `${util_1.dateString(start)} &ndash; ${util_1.dateString(end)}`);
    e.appendChild(times);
    if (assignment.attachments.length > 0) {
        const attachments = util_1.element('div', 'attachments');
        assignment.attachments.forEach((attachment) => {
            const a = util_1.element('a', [], attachment[0]);
            a.href = pcr_1.urlForAttachment(attachment[1]);
            pcr_1.getAttachmentMimeType(attachment[1]).then((type) => {
                let span;
                if (mimeTypes[type] != null) {
                    a.classList.add(mimeTypes[type][1]);
                    span = util_1.element('span', [], mimeTypes[type][0]);
                }
                else {
                    span = util_1.element('span', [], 'Unknown file type');
                }
                a.appendChild(span);
            });
            attachments.appendChild(a);
        });
        e.appendChild(attachments);
    }
    const body = util_1.element('div', 'body', assignment.body.replace(/font-family:[^;]*?(?:Times New Roman|serif)[^;]*/g, ''));
    const edits = util_1.element('div', 'edits', '<span class=\'additions\'></span><span class=\'deletions\'></span>');
    const m = modifiedAssignments_1.modifiedBody(assignment.id);
    if (m != null) {
        const d = dmp.diff_main(assignment.body, m);
        dmp.diff_cleanupSemantic(d);
        if (d.length !== 0) {
            populateAddedDeleted(d, edits);
            body.innerHTML = m;
        }
    }
    body.addEventListener('input', (evt) => {
        if (reference != null) {
            reference.body = body.innerHTML;
            customAssignments_1.saveExtra();
        }
        else {
            modifiedAssignments_1.setModified(assignment.id, body.innerHTML);
            modifiedAssignments_1.saveModified();
            const d = dmp.diff_main(assignment.body, body.innerHTML);
            dmp.diff_cleanupSemantic(d);
            if (populateAddedDeleted(d, edits)) {
                edits.classList.add('notEmpty');
            }
            else {
                edits.classList.remove('notEmpty');
            }
        }
        if (document.body.getAttribute('data-view') === '1')
            resizer_1.resize();
    });
    e.appendChild(body);
    const restore = util_1.element('a', ['material-icons', 'restore'], 'settings_backup_restore');
    restore.addEventListener('click', () => {
        modifiedAssignments_1.removeFromModified(assignment.id);
        modifiedAssignments_1.saveModified();
        body.innerHTML = assignment.body;
        edits.classList.remove('notEmpty');
        if (document.body.getAttribute('data-view') === '1')
            resizer_1.resize();
    });
    edits.appendChild(restore);
    e.appendChild(edits);
    const mods = util_1.element('div', ['mods']);
    activity_1.recentActivity().forEach((a) => {
        if ((a[0] === 'edit') && (a[1].id === assignment.id)) {
            const te = util_1.element('div', ['innerActivity', 'assignmentItem', assignment.baseType], `<i class='material-icons'>edit</i>
                            <span class='title'>${util_1.dateString(new Date(a[2]))}</span>
                            <span class='additions'></span><span class='deletions'></span>`, `ia${assignment.id}`);
            const d = dmp.diff_main(a[1].body, assignment.body);
            dmp.diff_cleanupSemantic(d);
            populateAddedDeleted(d, te);
            if (assignment.class)
                te.setAttribute('data-class', data.classes[assignment.class]);
            te.appendChild(util_1.element('div', 'iaDiff', dmp.diff_prettyHtml(d)));
            te.addEventListener('click', () => {
                te.classList.toggle('active');
                if (document.body.getAttribute('data-view') === '1')
                    resizer_1.resize();
            });
            mods.appendChild(te);
        }
    });
    e.appendChild(mods);
    if ((util_1.localStorageRead('assignmentSpan') === 'multiple') && (start < split.start)) {
        e.classList.add('fromWeekend');
    }
    if ((util_1.localStorageRead('assignmentSpan') === 'multiple') && (end > split.end)) {
        e.classList.add('overWeekend');
    }
    e.classList.add(`s${split.start.getDay()}`);
    if (split.end !== 'Forever')
        e.classList.add(`e${6 - split.end.getDay()}`);
    const st = Math.floor(split.start.getDate() / 1000 / 3600 / 24);
    if (split.assignment.end === 'Forever') {
        if (st <= (dates_1.today() + navigation_1.getListDateOffset())) {
            e.classList.add('listDisp');
        }
    }
    else {
        const midDate = new Date();
        midDate.setDate(midDate.getDate() + navigation_1.getListDateOffset());
        const push = (assignment.baseType === 'test' && assignment.start === st) ? util_1.localStorageRead('earlyTest') : 0;
        const endExtra = navigation_1.getListDateOffset() === 0 ? display_1.getTimeAfter(midDate) : 24 * 3600 * 1000;
        if (dates_1.fromDateNum(st - push) <= midDate &&
            (split.end === 'Forever' || midDate.getTime() <= split.end.getTime() + endExtra)) {
            e.classList.add('listDisp');
        }
    }
    // Add click interactivity
    if (!split.custom || !JSON.parse(localStorage.sepTasks)) {
        e.addEventListener('click', (evt) => {
            if ((document.getElementsByClassName('full').length === 0) &&
                (document.body.getAttribute('data-view') === '0')) {
                e.classList.remove('anim');
                e.classList.add('modify');
                e.style.top = (e.getBoundingClientRect().top - document.body.scrollTop
                    - Number(e.style.marginTop)) + 44 + 'px';
                e.setAttribute('data-top', e.style.top);
                document.body.style.overflow = 'hidden';
                const back = util_1.elemById('background');
                back.classList.add('active');
                back.style.display = 'block';
                e.classList.add('anim');
                util_1.forceLayout(e);
                e.classList.add('full');
                e.style.top = (75 - Number(e.style.marginTop)) + 'px';
                setTimeout(() => e.classList.remove('anim'), 350);
            }
        });
    }
    return e;
}
exports.createAssignment = createAssignment;
// In order to display an assignment in the correct X position, classes with names eX and eX are
// used, where X is the number of squares to from the assignment to the left/right side of the
// screen. The function below determines which eX and sX class the given element has.
function getES(el) {
    let e = 0;
    let s = 0;
    new Array(7).forEach((_, x) => {
        if (el.classList.contains(`e${x}`)) {
            e = x;
        }
        if (el.classList.contains(`s${x}`)) {
            s = x;
        }
    });
    return [`e${e}`, `s${s}`];
}
exports.getES = getES;
// Below is a function to close the current assignment that is opened.
function closeOpened(evt) {
    evt.stopPropagation();
    const el = document.querySelector('.full');
    if (el == null)
        return;
    el.style.top = el.getAttribute('data-top');
    el.classList.add('anim');
    el.classList.remove('full');
    el.scrollTop = 0;
    document.body.style.overflow = 'auto';
    const back = util_1.elemById('background');
    back.classList.remove('active');
    setTimeout(() => {
        back.style.display = 'none';
        el.classList.remove('anim');
        el.classList.remove('modify');
        el.style.top = 'auto';
        util_1.forceLayout(el);
        el.classList.add('anim');
    }, 1000);
}
exports.closeOpened = closeOpened;
