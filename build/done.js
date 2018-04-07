"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
const DONE_STORAGE_NAME = 'done';
const done = util_1.localStorageRead(DONE_STORAGE_NAME) || [];
function removeFromDone(id) {
    const index = done.indexOf(id);
    if (index >= 0)
        done.splice(index, 1);
}
exports.removeFromDone = removeFromDone;
function addToDone(id) {
    done.push(id);
}
exports.addToDone = addToDone;
function saveDone() {
    util_1.localStorageWrite(DONE_STORAGE_NAME, done);
}
exports.saveDone = saveDone;
function assignmentInDone(id) {
    return done.includes(id);
}
exports.assignmentInDone = assignmentInDone;
