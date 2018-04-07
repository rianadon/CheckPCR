"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
const MODIFIED_STORAGE_NAME = 'modified';
const modified = util_1.localStorageRead(MODIFIED_STORAGE_NAME) || {};
function removeFromModified(id) {
    delete modified[id];
}
exports.removeFromModified = removeFromModified;
function saveModified() {
    util_1.localStorageWrite(MODIFIED_STORAGE_NAME, modified);
}
exports.saveModified = saveModified;
function assignmentInModified(id) {
    return modified.hasOwnProperty(id);
}
exports.assignmentInModified = assignmentInModified;
function modifiedBody(id) {
    return modified[id];
}
exports.modifiedBody = modifiedBody;
function setModified(id, body) {
    modified[id] = body;
}
exports.setModified = setModified;
