import { localStorageRead, localStorageWrite } from '../util';
const DONE_STORAGE_NAME = 'done';
const done = localStorageRead(DONE_STORAGE_NAME) || [];
export function removeFromDone(id) {
    const index = done.indexOf(id);
    if (index >= 0)
        done.splice(index, 1);
}
export function addToDone(id) {
    done.push(id);
}
export function saveDone() {
    localStorageWrite(DONE_STORAGE_NAME, done);
}
export function assignmentInDone(id) {
    return done.includes(id);
}
