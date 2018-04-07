import { localStorageRead, localStorageWrite } from '../util';
const MODIFIED_STORAGE_NAME = 'modified';
const modified = localStorageRead(MODIFIED_STORAGE_NAME) || {};
export function removeFromModified(id) {
    delete modified[id];
}
export function saveModified() {
    localStorageWrite(MODIFIED_STORAGE_NAME, modified);
}
export function assignmentInModified(id) {
    return modified.hasOwnProperty(id);
}
export function modifiedBody(id) {
    return modified[id];
}
export function setModified(id, body) {
    modified[id] = body;
}
