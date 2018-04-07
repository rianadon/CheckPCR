import { localStorageRead, localStorageWrite } from '../util';
const CUSTOM_STORAGE_NAME = 'extra';
const extra = localStorageRead(CUSTOM_STORAGE_NAME) || {};
export function getExtra() {
    return extra;
}
export function saveExtra() {
    localStorageWrite(CUSTOM_STORAGE_NAME, extra);
}
export function addToExtra(custom) {
    extra.push(custom);
}
export function removeFromExtra(custom) {
    if (!extra.includes(custom))
        throw new Error('Cannot remove custom assignment that does not exist');
    extra.splice(extra.indexOf(custom), 1);
}
export function extraToTask(custom, data) {
    let cls = null;
    if (custom.class != null) {
        cls = data.classes.map((c) => c.toLowerCase()).indexOf(custom.class);
    }
    return {
        title: 'Task',
        baseType: 'task',
        type: 'task',
        attachments: [],
        start: custom.start,
        end: custom.end || 'Forever',
        body: custom.body,
        id: `task${custom.body.replace(/[^\w]*/g, '')}${custom.start}${custom.end}${custom.class}`,
        class: cls
    };
}
export function parseCustomTask(text, result = {}) {
    const parsed = text.match(/(.*) (for|by|due|assigned|starting|ending|beginning) (.*)/);
    if (parsed == null)
        return result;
    switch (parsed[2]) {
        case 'for':
            result.cls = parsed[3];
            break;
        case 'by':
        case 'due':
        case 'ending':
            result.due = parsed[3];
            break;
        case 'assigned':
        case 'starting':
        case 'beginning':
            result.st = parsed[3];
            break;
    }
    return parseCustomTask(parsed[1], result);
}
