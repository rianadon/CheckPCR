/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/welcome.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/app.ts":
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
/*! exports provided: VERSION, checkCommit, fetchNews, getNews */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VERSION", function() { return VERSION; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "checkCommit", function() { return checkCommit; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetchNews", function() { return fetchNews; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getNews", function() { return getNews; });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util */ "./src/util.ts");

const VERSION = '2.24.3';
const VERSION_URL = 'https://raw.githubusercontent.com/19RyanA/CheckPCR/master/version.txt';
const COMMIT_URL = (location.protocol === 'chrome-extension:' ?
    'https://api.github.com/repos/19RyanA/CheckPCR/git/refs/heads/master' : '/api/commit');
const NEWS_URL = 'https://api.github.com/gists/21bf11a429da257539a68520f513a38b';
function formatCommitMessage(message) {
    return message.substr(message.indexOf('\n\n') + 2)
        .replace(/\* (.*?)(?=$|\n)/g, (a, b) => `<li>${b}</li>`)
        .replace(/>\n</g, '><')
        .replace(/\n/g, '<br>');
}
// For updating, a request will be send to Github to get the current commit id and check that against what's stored
async function checkCommit() {
    try {
        const resp = await Object(_util__WEBPACK_IMPORTED_MODULE_0__["send"])(VERSION_URL, 'text');
        const c = resp.responseText.trim();
        console.log(`Current version: ${c} ${VERSION === c ? '(no update available)' : '(update available)'}`);
        Object(_util__WEBPACK_IMPORTED_MODULE_0__["elemById"])('newversion').innerHTML = c;
        if (VERSION !== c) {
            Object(_util__WEBPACK_IMPORTED_MODULE_0__["elemById"])('updateIgnore').addEventListener('click', () => {
                if (location.protocol === 'chrome-extension:') {
                    Object(_util__WEBPACK_IMPORTED_MODULE_0__["elemById"])('update').classList.remove('active');
                    setTimeout(() => {
                        Object(_util__WEBPACK_IMPORTED_MODULE_0__["elemById"])('updateBackground').style.display = 'none';
                    }, 350);
                }
                else {
                    window.location.reload();
                }
            });
            const resp2 = await Object(_util__WEBPACK_IMPORTED_MODULE_0__["send"])(COMMIT_URL, 'json');
            const { sha, url } = resp2.response.object;
            const resp3 = await Object(_util__WEBPACK_IMPORTED_MODULE_0__["send"])((location.protocol === 'chrome-extension:' ? url : `/api/commit/${sha}`), 'json');
            Object(_util__WEBPACK_IMPORTED_MODULE_0__["elemById"])('pastUpdateVersion').innerHTML = VERSION;
            Object(_util__WEBPACK_IMPORTED_MODULE_0__["elemById"])('newUpdateVersion').innerHTML = c;
            Object(_util__WEBPACK_IMPORTED_MODULE_0__["elemById"])('updateFeatures').innerHTML = formatCommitMessage(resp3.response.message);
            Object(_util__WEBPACK_IMPORTED_MODULE_0__["elemById"])('updateBackground').style.display = 'block';
            Object(_util__WEBPACK_IMPORTED_MODULE_0__["elemById"])('update').classList.add('active');
        }
    }
    catch (err) {
        console.log('Could not access Github. Here\'s the error:', err);
    }
}
let newsUrl = null;
let newsCommit = null;
async function fetchNews() {
    try {
        const resp = await Object(_util__WEBPACK_IMPORTED_MODULE_0__["send"])(NEWS_URL, 'json');
        let last = Object(_util__WEBPACK_IMPORTED_MODULE_0__["localStorageRead"])('newsCommit');
        newsCommit = resp.response.history[0].version;
        if (last == null) {
            last = newsCommit;
            Object(_util__WEBPACK_IMPORTED_MODULE_0__["localStorageWrite"])('newsCommit', newsCommit);
        }
        newsUrl = resp.response.files['updates.htm'].raw_url;
        if (last !== newsCommit) {
            getNews();
        }
    }
    catch (err) {
        console.log('Could not access Github. Here\'s the error:', err);
    }
}
async function getNews(onfail) {
    if (!newsUrl) {
        if (onfail)
            onfail();
        return;
    }
    try {
        const resp = await Object(_util__WEBPACK_IMPORTED_MODULE_0__["send"])(newsUrl);
        localStorage.newsCommit = newsCommit;
        resp.responseText.split('<hr>').forEach((news) => {
            Object(_util__WEBPACK_IMPORTED_MODULE_0__["elemById"])('newsContent').appendChild(Object(_util__WEBPACK_IMPORTED_MODULE_0__["element"])('div', 'newsItem', news));
        });
        Object(_util__WEBPACK_IMPORTED_MODULE_0__["elemById"])('newsBackground').style.display = 'block';
        Object(_util__WEBPACK_IMPORTED_MODULE_0__["elemById"])('news').classList.add('active');
    }
    catch (err) {
        console.log('Could not access Github. Here\'s the error:', err);
        if (onfail)
            onfail();
    }
}


/***/ }),

/***/ "./src/components/activity.ts":
/*!************************************!*\
  !*** ./src/components/activity.ts ***!
  \************************************/
/*! exports provided: addActivityElement, createActivity */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addActivityElement", function() { return addActivityElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createActivity", function() { return createActivity; });
/* harmony import */ var _pcr__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../pcr */ "./src/pcr.ts");
/* harmony import */ var _plugins_done__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../plugins/done */ "./src/plugins/done.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../util */ "./src/util.ts");
/* harmony import */ var _assignment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./assignment */ "./src/components/assignment.ts");




function addActivityElement(el) {
    const insertTo = Object(_util__WEBPACK_IMPORTED_MODULE_2__["elemById"])('infoActivity');
    insertTo.insertBefore(el, insertTo.querySelector('.activity'));
}
function createActivity(type, assignment, date, className) {
    const cname = className || Object(_pcr__WEBPACK_IMPORTED_MODULE_0__["classById"])(assignment.class);
    const te = Object(_util__WEBPACK_IMPORTED_MODULE_2__["element"])('div', ['activity', 'assignmentItem', assignment.baseType, type], `
        <i class='material-icons'>${type}</i>
        <span class='title'>${assignment.title}</span>
        <small>${Object(_assignment__WEBPACK_IMPORTED_MODULE_3__["separate"])(cname)[2]}</small>
        <div class='range'>${Object(_util__WEBPACK_IMPORTED_MODULE_2__["dateString"])(date)}</div>`, `activity${assignment.id}`);
    te.setAttribute('data-class', cname);
    const { id } = assignment;
    if (type !== 'delete') {
        te.addEventListener('click', () => {
            const doScrolling = async () => {
                const el = Object(_util__WEBPACK_IMPORTED_MODULE_2__["_$"])(document.querySelector(`.assignment[id*=\"${id}\"]`));
                await Object(_util__WEBPACK_IMPORTED_MODULE_2__["smoothScroll"])((el.getBoundingClientRect().top + document.body.scrollTop) - 116);
                el.click();
            };
            if (document.body.getAttribute('data-view') === '0') {
                return doScrolling();
            }
            else {
                Object(_util__WEBPACK_IMPORTED_MODULE_2__["_$"])(document.querySelector('#navTabs>li:first-child')).click();
                return setTimeout(doScrolling, 500);
            }
        });
    }
    if (Object(_plugins_done__WEBPACK_IMPORTED_MODULE_1__["assignmentInDone"])(assignment.id)) {
        te.classList.add('done');
    }
    return te;
}


/***/ }),

/***/ "./src/components/assignment.ts":
/*!**************************************!*\
  !*** ./src/components/assignment.ts ***!
  \**************************************/
/*! exports provided: computeWeekId, separate, assignmentClass, separatedClass, createAssignment, getES, closeOpened */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "computeWeekId", function() { return computeWeekId; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "separate", function() { return separate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "assignmentClass", function() { return assignmentClass; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "separatedClass", function() { return separatedClass; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createAssignment", function() { return createAssignment; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getES", function() { return getES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "closeOpened", function() { return closeOpened; });
/* harmony import */ var _dates__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../dates */ "./src/dates.ts");
/* harmony import */ var _display__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../display */ "./src/display.ts");
/* harmony import */ var _navigation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../navigation */ "./src/navigation.ts");
/* harmony import */ var _pcr__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../pcr */ "./src/pcr.ts");
/* harmony import */ var _plugins_activity__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../plugins/activity */ "./src/plugins/activity.ts");
/* harmony import */ var _plugins_athena__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../plugins/athena */ "./src/plugins/athena.ts");
/* harmony import */ var _plugins_customAssignments__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../plugins/customAssignments */ "./src/plugins/customAssignments.ts");
/* harmony import */ var _plugins_done__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../plugins/done */ "./src/plugins/done.ts");
/* harmony import */ var _plugins_modifiedAssignments__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../plugins/modifiedAssignments */ "./src/plugins/modifiedAssignments.ts");
/* harmony import */ var _settings__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../settings */ "./src/settings.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../util */ "./src/util.ts");
/* harmony import */ var _resizer__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./resizer */ "./src/components/resizer.ts");












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
    Object(_util__WEBPACK_IMPORTED_MODULE_10__["_$"])(edits.querySelector('.additions')).innerHTML = added !== 0 ? `+${added}` : '';
    Object(_util__WEBPACK_IMPORTED_MODULE_10__["_$"])(edits.querySelector('.deletions')).innerHTML = deleted !== 0 ? `-${deleted}` : '';
    edits.classList.add('notEmpty');
    return added > 0 || deleted > 0;
}
function computeWeekId(split) {
    const startSun = new Date(split.start.getTime());
    startSun.setDate(startSun.getDate() - startSun.getDay());
    return `wk${startSun.getMonth()}-${startSun.getDate()}`;
}
// This function separates the parts of a class name.
function separate(cl) {
    const m = cl.match(/((?:\d*\s+)?(?:(?:hon\w*|(?:adv\w*\s*)?core)\s+)?)(.*)/i);
    if (m == null)
        throw new Error(`Could not separate class string ${cl}`);
    return m;
}
function assignmentClass(assignment, data) {
    const cls = (assignment.class != null) ? data.classes[assignment.class] : 'Task';
    if (cls == null)
        throw new Error(`Could not find class ${assignment.class} in ${data.classes}`);
    return cls;
}
function separatedClass(assignment, data) {
    return separate(assignmentClass(assignment, data));
}
function createAssignment(split, data) {
    const { assignment, reference } = split;
    // Separate the class description from the actual class
    const separated = separatedClass(assignment, data);
    const weekId = computeWeekId(split);
    let smallTag = 'small';
    let link = null;
    const athenaData = Object(_plugins_athena__WEBPACK_IMPORTED_MODULE_5__["getAthenaData"])();
    if (athenaData && assignment.class != null && (athenaData[data.classes[assignment.class]] != null)) {
        link = athenaData[data.classes[assignment.class]].link;
        smallTag = 'a';
    }
    const e = Object(_util__WEBPACK_IMPORTED_MODULE_10__["element"])('div', ['assignment', assignment.baseType, 'anim'], `<${smallTag}${link ? ` href='${link}' class='linked' target='_blank'` : ''}>
                           <span class='extra'>${separated[1]}</span>
                           ${separated[2]}
                       </${smallTag}><span class='title'>${assignment.title}</span>
                       <input type='hidden' class='due'
                              value='${assignment.end === 'Forever' ? 0 : assignment.end}' />`, assignment.id + weekId);
    if ((reference && reference.done) || Object(_plugins_done__WEBPACK_IMPORTED_MODULE_7__["assignmentInDone"])(assignment.id)) {
        e.classList.add('done');
    }
    e.setAttribute('data-class', assignmentClass(assignment, data));
    const close = Object(_util__WEBPACK_IMPORTED_MODULE_10__["element"])('a', ['close', 'material-icons'], 'close');
    close.addEventListener('click', closeOpened);
    e.appendChild(close);
    // Prevent clicking the class name when an item is displayed on the calendar from doing anything
    if (link != null) {
        Object(_util__WEBPACK_IMPORTED_MODULE_10__["_$"])(e.querySelector('a')).addEventListener('click', (evt) => {
            if ((document.body.getAttribute('data-view') === '0') && !e.classList.contains('full')) {
                evt.preventDefault();
            }
        });
    }
    const complete = Object(_util__WEBPACK_IMPORTED_MODULE_10__["element"])('a', ['complete', 'material-icons', 'waves'], 'done');
    Object(_util__WEBPACK_IMPORTED_MODULE_10__["ripple"])(complete);
    const id = split.assignment.id;
    complete.addEventListener('mouseup', (evt) => {
        if (evt.which === 1) { // Left button
            let added = true;
            if (reference != null) { // Task item
                if (e.classList.contains('done')) {
                    reference.done = false;
                }
                else {
                    added = false;
                    reference.done = true;
                }
                Object(_plugins_customAssignments__WEBPACK_IMPORTED_MODULE_6__["saveExtra"])();
            }
            else {
                if (e.classList.contains('done')) {
                    Object(_plugins_done__WEBPACK_IMPORTED_MODULE_7__["removeFromDone"])(assignment.id);
                }
                else {
                    added = false;
                    Object(_plugins_done__WEBPACK_IMPORTED_MODULE_7__["addToDone"])(assignment.id);
                }
                Object(_plugins_done__WEBPACK_IMPORTED_MODULE_7__["saveDone"])();
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
                    Object(_resizer__WEBPACK_IMPORTED_MODULE_11__["resize"])();
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
        const deleteA = Object(_util__WEBPACK_IMPORTED_MODULE_10__["element"])('a', ['material-icons', 'deleteAssignment', 'waves'], 'delete');
        Object(_util__WEBPACK_IMPORTED_MODULE_10__["ripple"])(deleteA);
        deleteA.addEventListener('mouseup', (evt) => {
            if (evt.which !== 1 || !reference)
                return;
            Object(_plugins_customAssignments__WEBPACK_IMPORTED_MODULE_6__["removeFromExtra"])(reference);
            Object(_plugins_customAssignments__WEBPACK_IMPORTED_MODULE_6__["saveExtra"])();
            if (document.querySelector('.full') != null) {
                document.body.style.overflow = 'auto';
                const back = Object(_util__WEBPACK_IMPORTED_MODULE_10__["elemById"])('background');
                back.classList.remove('active');
                setTimeout(() => {
                    back.style.display = 'none';
                }, 350);
            }
            e.remove();
            Object(_display__WEBPACK_IMPORTED_MODULE_1__["display"])(false);
        });
        e.appendChild(deleteA);
    }
    // Modification button
    const edit = Object(_util__WEBPACK_IMPORTED_MODULE_10__["element"])('a', ['editAssignment', 'material-icons', 'waves'], 'edit');
    edit.addEventListener('mouseup', (evt) => {
        if (evt.which === 1) {
            const remove = edit.classList.contains('active');
            edit.classList.toggle('active');
            Object(_util__WEBPACK_IMPORTED_MODULE_10__["_$"])(e.querySelector('.body')).setAttribute('contentEditable', remove ? 'false' : 'true');
            if (!remove) {
                e.querySelector('.body').focus();
            }
            const dn = e.querySelector('.complete');
            dn.style.display = remove ? 'block' : 'none';
        }
    });
    Object(_util__WEBPACK_IMPORTED_MODULE_10__["ripple"])(edit);
    e.appendChild(edit);
    const start = new Date(Object(_dates__WEBPACK_IMPORTED_MODULE_0__["fromDateNum"])(assignment.start));
    const end = assignment.end === 'Forever' ? assignment.end : new Date(Object(_dates__WEBPACK_IMPORTED_MODULE_0__["fromDateNum"])(assignment.end));
    const times = Object(_util__WEBPACK_IMPORTED_MODULE_10__["element"])('div', 'range', assignment.start === assignment.end ? Object(_util__WEBPACK_IMPORTED_MODULE_10__["dateString"])(start) : `${Object(_util__WEBPACK_IMPORTED_MODULE_10__["dateString"])(start)} &ndash; ${Object(_util__WEBPACK_IMPORTED_MODULE_10__["dateString"])(end)}`);
    e.appendChild(times);
    if (assignment.attachments.length > 0) {
        const attachments = Object(_util__WEBPACK_IMPORTED_MODULE_10__["element"])('div', 'attachments');
        assignment.attachments.forEach((attachment) => {
            const a = Object(_util__WEBPACK_IMPORTED_MODULE_10__["element"])('a', [], attachment[0]);
            a.href = Object(_pcr__WEBPACK_IMPORTED_MODULE_3__["urlForAttachment"])(attachment[1]);
            Object(_pcr__WEBPACK_IMPORTED_MODULE_3__["getAttachmentMimeType"])(attachment[1]).then((type) => {
                let span;
                if (mimeTypes[type] != null) {
                    a.classList.add(mimeTypes[type][1]);
                    span = Object(_util__WEBPACK_IMPORTED_MODULE_10__["element"])('span', [], mimeTypes[type][0]);
                }
                else {
                    span = Object(_util__WEBPACK_IMPORTED_MODULE_10__["element"])('span', [], 'Unknown file type');
                }
                a.appendChild(span);
            });
            attachments.appendChild(a);
        });
        e.appendChild(attachments);
    }
    const body = Object(_util__WEBPACK_IMPORTED_MODULE_10__["element"])('div', 'body', assignment.body.replace(/font-family:[^;]*?(?:Times New Roman|serif)[^;]*/g, ''));
    const edits = Object(_util__WEBPACK_IMPORTED_MODULE_10__["element"])('div', 'edits', '<span class=\'additions\'></span><span class=\'deletions\'></span>');
    const m = Object(_plugins_modifiedAssignments__WEBPACK_IMPORTED_MODULE_8__["modifiedBody"])(assignment.id);
    if (m != null) {
        const d = dmp.diff_main(assignment.body, m);
        dmp.diff_cleanupSemantic(d);
        if (d.length !== 0) { // Has been edited
            populateAddedDeleted(d, edits);
            body.innerHTML = m;
        }
    }
    body.addEventListener('input', (evt) => {
        if (reference != null) {
            reference.body = body.innerHTML;
            Object(_plugins_customAssignments__WEBPACK_IMPORTED_MODULE_6__["saveExtra"])();
        }
        else {
            Object(_plugins_modifiedAssignments__WEBPACK_IMPORTED_MODULE_8__["setModified"])(assignment.id, body.innerHTML);
            Object(_plugins_modifiedAssignments__WEBPACK_IMPORTED_MODULE_8__["saveModified"])();
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
            Object(_resizer__WEBPACK_IMPORTED_MODULE_11__["resize"])();
    });
    e.appendChild(body);
    const restore = Object(_util__WEBPACK_IMPORTED_MODULE_10__["element"])('a', ['material-icons', 'restore'], 'settings_backup_restore');
    restore.addEventListener('click', () => {
        Object(_plugins_modifiedAssignments__WEBPACK_IMPORTED_MODULE_8__["removeFromModified"])(assignment.id);
        Object(_plugins_modifiedAssignments__WEBPACK_IMPORTED_MODULE_8__["saveModified"])();
        body.innerHTML = assignment.body;
        edits.classList.remove('notEmpty');
        if (document.body.getAttribute('data-view') === '1')
            Object(_resizer__WEBPACK_IMPORTED_MODULE_11__["resize"])();
    });
    edits.appendChild(restore);
    e.appendChild(edits);
    const mods = Object(_util__WEBPACK_IMPORTED_MODULE_10__["element"])('div', ['mods']);
    Object(_plugins_activity__WEBPACK_IMPORTED_MODULE_4__["recentActivity"])().forEach((a) => {
        if ((a[0] === 'edit') && (a[1].id === assignment.id)) {
            const te = Object(_util__WEBPACK_IMPORTED_MODULE_10__["element"])('div', ['innerActivity', 'assignmentItem', assignment.baseType], `<i class='material-icons'>edit</i>
                            <span class='title'>${Object(_util__WEBPACK_IMPORTED_MODULE_10__["dateString"])(new Date(a[2]))}</span>
                            <span class='additions'></span><span class='deletions'></span>`, `ia${assignment.id}`);
            const d = dmp.diff_main(a[1].body, assignment.body);
            dmp.diff_cleanupSemantic(d);
            populateAddedDeleted(d, te);
            if (assignment.class)
                te.setAttribute('data-class', data.classes[assignment.class]);
            te.appendChild(Object(_util__WEBPACK_IMPORTED_MODULE_10__["element"])('div', 'iaDiff', dmp.diff_prettyHtml(d)));
            te.addEventListener('click', () => {
                te.classList.toggle('active');
                if (document.body.getAttribute('data-view') === '1')
                    Object(_resizer__WEBPACK_IMPORTED_MODULE_11__["resize"])();
            });
            mods.appendChild(te);
        }
    });
    e.appendChild(mods);
    if (_settings__WEBPACK_IMPORTED_MODULE_9__["settings"].assignmentSpan === 'multiple' && (start < split.start)) {
        e.classList.add('fromWeekend');
    }
    if (_settings__WEBPACK_IMPORTED_MODULE_9__["settings"].assignmentSpan === 'multiple' && (end > split.end)) {
        e.classList.add('overWeekend');
    }
    e.classList.add(`s${split.start.getDay()}`);
    if (split.end !== 'Forever')
        e.classList.add(`e${6 - split.end.getDay()}`);
    const st = Math.floor(split.start.getTime() / 1000 / 3600 / 24);
    if (split.assignment.end === 'Forever') {
        if (st <= (Object(_dates__WEBPACK_IMPORTED_MODULE_0__["today"])() + Object(_navigation__WEBPACK_IMPORTED_MODULE_2__["getListDateOffset"])())) {
            e.classList.add('listDisp');
        }
    }
    else {
        const midDate = new Date();
        midDate.setDate(midDate.getDate() + Object(_navigation__WEBPACK_IMPORTED_MODULE_2__["getListDateOffset"])());
        const push = (assignment.baseType === 'test' && assignment.start === st) ? _settings__WEBPACK_IMPORTED_MODULE_9__["settings"].earlyTest : 0;
        const endExtra = Object(_navigation__WEBPACK_IMPORTED_MODULE_2__["getListDateOffset"])() === 0 ? Object(_display__WEBPACK_IMPORTED_MODULE_1__["getTimeAfter"])(midDate) : 24 * 3600 * 1000;
        if (Object(_dates__WEBPACK_IMPORTED_MODULE_0__["fromDateNum"])(st - push) <= midDate &&
            (split.end === 'Forever' || midDate.getTime() <= split.end.getTime() + endExtra)) {
            e.classList.add('listDisp');
        }
    }
    // Add click interactivity
    if (!split.custom || !_settings__WEBPACK_IMPORTED_MODULE_9__["settings"].sepTasks) {
        e.addEventListener('click', (evt) => {
            if ((document.getElementsByClassName('full').length === 0) &&
                (document.body.getAttribute('data-view') === '0')) {
                e.classList.remove('anim');
                e.classList.add('modify');
                const top = (e.getBoundingClientRect().top - document.body.scrollTop
                    - Object(_util__WEBPACK_IMPORTED_MODULE_10__["cssNumber"])(e.style.marginTop)) + 44;
                e.style.top = top - window.pageYOffset + 'px';
                e.setAttribute('data-top', String(top));
                document.body.style.overflow = 'hidden';
                const back = Object(_util__WEBPACK_IMPORTED_MODULE_10__["elemById"])('background');
                back.classList.add('active');
                back.style.display = 'block';
                e.classList.add('anim');
                Object(_util__WEBPACK_IMPORTED_MODULE_10__["forceLayout"])(e);
                e.classList.add('full');
                e.style.top = (75 - Object(_util__WEBPACK_IMPORTED_MODULE_10__["cssNumber"])(e.style.marginTop)) + 'px';
                setTimeout(() => e.classList.remove('anim'), 350);
            }
        });
    }
    return e;
}
// In order to display an assignment in the correct X position, classes with names eX and eX are
// used, where X is the number of squares to from the assignment to the left/right side of the
// screen. The function below determines which eX and sX class the given element has.
function getES(el) {
    let e = 0;
    let s = 0;
    Array.from(new Array(7), (_, x) => x).forEach((x) => {
        if (el.classList.contains(`e${x}`)) {
            e = x;
        }
        if (el.classList.contains(`s${x}`)) {
            s = x;
        }
    });
    return [`e${e}`, `s${s}`];
}
// Below is a function to close the current assignment that is opened.
function closeOpened(evt) {
    evt.stopPropagation();
    const el = document.querySelector('.full');
    if (el == null)
        return;
    el.style.top = Number(el.getAttribute('data-top') || '0') - window.pageYOffset + 'px';
    el.classList.add('anim');
    el.classList.remove('full');
    el.scrollTop = 0;
    document.body.style.overflow = 'auto';
    const back = Object(_util__WEBPACK_IMPORTED_MODULE_10__["elemById"])('background');
    back.classList.remove('active');
    const transitionListener = () => {
        back.style.display = 'none';
        el.classList.remove('anim');
        el.classList.remove('modify');
        el.style.top = 'auto';
        Object(_util__WEBPACK_IMPORTED_MODULE_10__["forceLayout"])(el);
        el.classList.add('anim');
        el.removeEventListener('transitionend', transitionListener);
    };
    el.addEventListener('transitionend', transitionListener);
}


/***/ }),

/***/ "./src/components/avatar.ts":
/*!**********************************!*\
  !*** ./src/components/avatar.ts ***!
  \**********************************/
/*! exports provided: updateAvatar */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "updateAvatar", function() { return updateAvatar; });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util */ "./src/util.ts");

// Then, the username in the sidebar needs to be set and we need to generate an "avatar" based on
// initials. To do that, some code to convert from LAB to RGB colors is borrowed from
// https://github.com/boronine/colorspaces.js
//
// LAB is a color naming scheme that uses two values (A and B) along with a lightness value in order
// to produce colors that are equally spaced between all of the colors that can be seen by the human
// eye. This works great because everyone has letters in his/her initials.
// The D65 standard illuminant
const REF_X = 0.95047;
const REF_Y = 1.00000;
const REF_Z = 1.08883;
// CIE L*a*b* constants
const LAB_E = 0.008856;
const LAB_K = 903.3;
const M = [
    [3.2406, -1.5372, -0.4986],
    [-0.9689, 1.8758, 0.0415],
    [0.0557, -0.2040, 1.0570]
];
const fInv = (t) => {
    if (Math.pow(t, 3) > LAB_E) {
        return Math.pow(t, 3);
    }
    else {
        return ((116 * t) - 16) / LAB_K;
    }
};
const dotProduct = (a, b) => {
    let ret = 0;
    a.forEach((_, i) => {
        ret += a[i] * b[i];
    });
    return ret;
};
const fromLinear = (c) => {
    const a = 0.055;
    if (c <= 0.0031308) {
        return 12.92 * c;
    }
    else {
        return (1.055 * Math.pow(c, 1 / 2.4)) - 0.055;
    }
};
function labrgb(l, a, b) {
    const varY = (l + 16) / 116;
    const varZ = varY - (b / 200);
    const varX = (a / 500) + varY;
    const _X = REF_X * fInv(varX);
    const _Y = REF_Y * fInv(varY);
    const _Z = REF_Z * fInv(varZ);
    const tuple = [_X, _Y, _Z];
    const _R = fromLinear(dotProduct(M[0], tuple));
    const _G = fromLinear(dotProduct(M[1], tuple));
    const _B = fromLinear(dotProduct(M[2], tuple));
    // Original from here
    const n = (v) => Math.round(Math.max(Math.min(v * 256, 255), 0));
    return `rgb(${n(_R)}, ${n(_G)}, ${n(_B)})`;
}
/**
 * Convert a letter to a float valued from 0 to 255
 */
function letterToColorVal(letter) {
    return (((letter.charCodeAt(0) - 65) / 26) * 256) - 128;
}
// The function below uses this algorithm to generate a background color for the initials displayed in the sidebar.
function updateAvatar() {
    if (!Object(_util__WEBPACK_IMPORTED_MODULE_0__["localStorageRead"])('username'))
        return;
    const userEl = document.getElementById('user');
    const initialsEl = document.getElementById('initials');
    if (!userEl || !initialsEl)
        return;
    userEl.innerHTML = Object(_util__WEBPACK_IMPORTED_MODULE_0__["localStorageRead"])('username');
    const initials = Object(_util__WEBPACK_IMPORTED_MODULE_0__["localStorageRead"])('username').match(/\d*(.).*?(.$)/); // Separate year from first name and initial
    if (initials != null) {
        const bg = labrgb(50, letterToColorVal(initials[1]), letterToColorVal(initials[2])); // Compute the color
        initialsEl.style.backgroundColor = bg;
        initialsEl.innerHTML = initials[1] + initials[2];
    }
}


/***/ }),

/***/ "./src/components/calendar.ts":
/*!************************************!*\
  !*** ./src/components/calendar.ts ***!
  \************************************/
/*! exports provided: createWeek, createDay */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createWeek", function() { return createWeek; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createDay", function() { return createDay; });
/* harmony import */ var _dates__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../dates */ "./src/dates.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util */ "./src/util.ts");


const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function createWeek(id) {
    const wk = Object(_util__WEBPACK_IMPORTED_MODULE_1__["element"])('section', 'week', null, id);
    const dayTable = Object(_util__WEBPACK_IMPORTED_MODULE_1__["element"])('table', 'dayTable');
    const tr = dayTable.insertRow();
    // tslint:disable-next-line no-loops
    for (let day = 0; day < 7; day++)
        tr.insertCell();
    wk.appendChild(dayTable);
    return wk;
}
function createDay(d) {
    const day = Object(_util__WEBPACK_IMPORTED_MODULE_1__["element"])('div', 'day', null, 'day');
    day.setAttribute('data-date', String(d.getTime()));
    if (Math.floor((d.getTime() - d.getTimezoneOffset()) / 1000 / 3600 / 24) === Object(_dates__WEBPACK_IMPORTED_MODULE_0__["today"])()) {
        day.classList.add('today');
    }
    const month = Object(_util__WEBPACK_IMPORTED_MODULE_1__["element"])('span', 'month', MONTHS[d.getMonth()]);
    day.appendChild(month);
    const date = Object(_util__WEBPACK_IMPORTED_MODULE_1__["element"])('span', 'date', String(d.getDate()));
    day.appendChild(date);
    return day;
}


/***/ }),

/***/ "./src/components/errorDisplay.ts":
/*!****************************************!*\
  !*** ./src/components/errorDisplay.ts ***!
  \****************************************/
/*! exports provided: displayError */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "displayError", function() { return displayError; });
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../app */ "./src/app.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util */ "./src/util.ts");


const ERROR_FORM_URL = 'https://docs.google.com/a/students.harker.org/forms/d/'
    + '1sa2gUtYFPdKT5YENXIEYauyRPucqsQCVaQAPeF3bZ4Q/viewform';
const ERROR_FORM_ENTRY = '?entry.120036223=';
const ERROR_GITHUB_URL = 'https://github.com/19RyanA/CheckPCR/issues/new';
const linkById = (id) => Object(_util__WEBPACK_IMPORTED_MODULE_1__["elemById"])(id);
// *displayError* displays a dialog containing information about an error.
function displayError(e) {
    console.log('Displaying error', e);
    const errorHTML = `Message: ${e.message}\nStack: ${e.stack || e.lineNumber}\n`
        + `Browser: ${navigator.userAgent}\nVersion: ${_app__WEBPACK_IMPORTED_MODULE_0__["VERSION"]}`;
    Object(_util__WEBPACK_IMPORTED_MODULE_1__["elemById"])('errorContent').innerHTML = errorHTML.replace('\n', '<br>');
    linkById('errorGoogle').href = ERROR_FORM_URL + ERROR_FORM_ENTRY + encodeURIComponent(errorHTML);
    linkById('errorGitHub').href =
        ERROR_GITHUB_URL + '?body=' + encodeURIComponent(`I've encountered an bug.\n\n\`\`\`\n${errorHTML}\n\`\`\``);
    Object(_util__WEBPACK_IMPORTED_MODULE_1__["elemById"])('errorBackground').style.display = 'block';
    return Object(_util__WEBPACK_IMPORTED_MODULE_1__["elemById"])('error').classList.add('active');
}
window.addEventListener('error', (evt) => {
    evt.preventDefault();
    displayError(evt.error);
});


/***/ }),

/***/ "./src/components/resizer.ts":
/*!***********************************!*\
  !*** ./src/components/resizer.ts ***!
  \***********************************/
/*! exports provided: getResizeAssignments, resizeCaller, resize */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getResizeAssignments", function() { return getResizeAssignments; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "resizeCaller", function() { return resizeCaller; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "resize", function() { return resize; });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util */ "./src/util.ts");

// For list view, the assignments can't be on top of each other.
// Therefore, a listener is attached to the resizing of the browser window.
let ticking = false;
let timeoutId = null;
function getResizeAssignments() {
    const assignments = Array.from(document.querySelectorAll(document.body.classList.contains('showDone') ?
        '.assignment.listDisp' : '.assignment.listDisp:not(.done)'));
    assignments.sort((a, b) => {
        const ad = a.classList.contains('done');
        const bd = b.classList.contains('done');
        if (ad && !bd) {
            return 1;
        }
        if (bd && !ad) {
            return -1;
        }
        return Number(a.querySelector('.due').value)
            - Number(b.querySelector('.due').value);
    });
    return assignments;
}
function resizeCaller() {
    if (!ticking) {
        requestAnimationFrame(resize);
        ticking = true;
    }
}
let lastColumns = null;
let lastAssignments = null;
let lastDoneCount = null;
function resize() {
    ticking = true;
    // To calculate the number of columns, the below algorithm is used becase as the screen size
    // increases, the column width increases
    const widths = document.body.classList.contains('showInfo') ?
        [650, 1100, 1800, 2700, 3800, 5100] : [350, 800, 1500, 2400, 3500, 4800];
    let columns = 1;
    widths.forEach((w, index) => {
        if (window.innerWidth > w) {
            columns = index + 1;
        }
    });
    const columnHeights = Array.from(new Array(columns), () => 0);
    const cch = [];
    const assignments = getResizeAssignments();
    const doneCount = assignments.filter((a) => a.classList.contains('done')).length;
    assignments.forEach((assignment, n) => {
        const col = n % columns;
        cch.push(columnHeights[col]);
        columnHeights[col] += assignment.offsetHeight + 24;
    });
    assignments.forEach((assignment, n) => {
        const col = n % columns;
        assignment.style.top = cch[n] + 'px';
        if (columns !== lastColumns || assignments.length !== lastAssignments || doneCount !== lastDoneCount) {
            const left = ((100 / columns) * col) + '%';
            const right = ((100 / columns) * (columns - col - 1)) + '%';
            if (lastColumns === null) {
                assignment.style.left = left;
                assignment.style.right = right;
            }
            else {
                Object(_util__WEBPACK_IMPORTED_MODULE_0__["animateEl"])(assignment, [
                    {
                        left: assignment.style.left || left,
                        right: assignment.style.right || right
                    },
                    { left, right }
                ], { duration: 300 }).then(() => {
                    assignment.style.left = left;
                    assignment.style.right = right;
                });
            }
        }
    });
    if (timeoutId)
        clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
        cch.length = 0;
        assignments.forEach((assignment, n) => {
            const col = n % columns;
            if (n < columns) {
                columnHeights[col] = 0;
            }
            cch.push(columnHeights[col]);
            columnHeights[col] += assignment.offsetHeight + 24;
        });
        assignments.forEach((assignment, n) => {
            assignment.style.top = cch[n] + 'px';
        });
    }, 500);
    lastColumns = columns;
    lastAssignments = assignments.length;
    lastDoneCount = doneCount;
    ticking = false;
}


/***/ }),

/***/ "./src/components/snackbar.ts":
/*!************************************!*\
  !*** ./src/components/snackbar.ts ***!
  \************************************/
/*! exports provided: snackbar */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "snackbar", function() { return snackbar; });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util */ "./src/util.ts");
/**
 * All this is responsible for is creating snackbars.
 */

function snackbar(message, action, f) {
    const snack = Object(_util__WEBPACK_IMPORTED_MODULE_0__["element"])('div', 'snackbar');
    const snackInner = Object(_util__WEBPACK_IMPORTED_MODULE_0__["element"])('div', 'snackInner', message);
    snack.appendChild(snackInner);
    if ((action != null) && (f != null)) {
        const actionE = Object(_util__WEBPACK_IMPORTED_MODULE_0__["element"])('a', [], action);
        actionE.addEventListener('click', () => {
            snack.classList.remove('active');
            f();
        });
        snackInner.appendChild(actionE);
    }
    const add = () => {
        document.body.appendChild(snack);
        Object(_util__WEBPACK_IMPORTED_MODULE_0__["forceLayout"])(snack);
        snack.classList.add('active');
        setTimeout(() => {
            snack.classList.remove('active');
            setTimeout(() => snack.remove(), 900);
        }, 5000);
    };
    const existing = document.querySelector('.snackbar');
    if (existing != null) {
        existing.classList.remove('active');
        setTimeout(add, 300);
    }
    else {
        add();
    }
}


/***/ }),

/***/ "./src/cookies.ts":
/*!************************!*\
  !*** ./src/cookies.ts ***!
  \************************/
/*! exports provided: getCookie, setCookie, deleteCookie */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getCookie", function() { return getCookie; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setCookie", function() { return setCookie; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "deleteCookie", function() { return deleteCookie; });
/**
 * Cookie functions (a cookie is a small text document that the browser can remember)
 */
/**
 * Retrieves a cookie
 * @param cname the name of the cookie to retrieve
 */
function getCookie(cname) {
    const name = cname + '=';
    const cookiePart = document.cookie.split(';').find((c) => c.includes(name));
    if (cookiePart)
        return cookiePart.trim().substring(name.length);
    return ''; // Blank if cookie not found
}
/** Sets the value of a cookie
 * @param cname the name of the cookie to set
 * @param cvalue the value to set the cookie to
 * @param exdays the number of days that the cookie will expire in (and not be existent anymore)
 */
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    const expires = `expires=${d.toUTCString()}`;
    document.cookie = cname + '=' + cvalue + '; ' + expires;
}
/**
 * Delets a cookie
 * @param cname the name of the cookie to delete
 */
function deleteCookie(cname) {
    // This is like *setCookie*, but sets the expiry date to something in the past so the cookie is deleted.
    document.cookie = cname + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}


/***/ }),

/***/ "./src/dates.ts":
/*!**********************!*\
  !*** ./src/dates.ts ***!
  \**********************/
/*! exports provided: tzoff, toDateNum, fromDateNum, today, iterDays */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tzoff", function() { return tzoff; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toDateNum", function() { return toDateNum; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fromDateNum", function() { return fromDateNum; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "today", function() { return today; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "iterDays", function() { return iterDays; });
function tzoff() {
    return (new Date()).getTimezoneOffset() * 1000 * 60; // For future calculations
}
function toDateNum(date) {
    const num = date instanceof Date ? date.getTime() : date;
    return Math.floor((num - tzoff()) / 1000 / 3600 / 24);
}
// *FromDateNum* converts a number of days to a number of seconds
function fromDateNum(days) {
    const d = new Date((days * 1000 * 3600 * 24) + tzoff());
    // The checks below are to handle daylight savings time
    if (d.getHours() === 1) {
        d.setHours(0);
    }
    if ((d.getHours() === 22) || (d.getHours() === 23)) {
        d.setHours(24);
        d.setMinutes(0);
        d.setSeconds(0);
    }
    return d;
}
function today() {
    return toDateNum(new Date());
}
/**
 * Iterates from the starting date to ending date inclusive
 */
function iterDays(start, end, cb) {
    // tslint:disable-next-line no-loops
    for (const d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        cb(d);
    }
}


/***/ }),

/***/ "./src/display.ts":
/*!************************!*\
  !*** ./src/display.ts ***!
  \************************/
/*! exports provided: getScroll, getTimeAfter, display, formatUpdate */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getScroll", function() { return getScroll; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getTimeAfter", function() { return getTimeAfter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "display", function() { return display; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "formatUpdate", function() { return formatUpdate; });
/* harmony import */ var _components_assignment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/assignment */ "./src/components/assignment.ts");
/* harmony import */ var _components_calendar__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/calendar */ "./src/components/calendar.ts");
/* harmony import */ var _components_errorDisplay__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/errorDisplay */ "./src/components/errorDisplay.ts");
/* harmony import */ var _components_resizer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/resizer */ "./src/components/resizer.ts");
/* harmony import */ var _dates__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./dates */ "./src/dates.ts");
/* harmony import */ var _pcr__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./pcr */ "./src/pcr.ts");
/* harmony import */ var _plugins_activity__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./plugins/activity */ "./src/plugins/activity.ts");
/* harmony import */ var _plugins_customAssignments__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./plugins/customAssignments */ "./src/plugins/customAssignments.ts");
/* harmony import */ var _plugins_done__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./plugins/done */ "./src/plugins/done.ts");
/* harmony import */ var _plugins_modifiedAssignments__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./plugins/modifiedAssignments */ "./src/plugins/modifiedAssignments.ts");
/* harmony import */ var _settings__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./settings */ "./src/settings.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./util */ "./src/util.ts");
/* harmony import */ var _navigation__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./navigation */ "./src/navigation.ts");













const SCHEDULE_ENDS = {
    day: (date) => 24 * 3600 * 1000,
    ms: (date) => [24,
        15 + (35 / 60),
        15 + (35 / 60),
        15 + (15 / 60),
        15 + (15 / 60),
        15 + (15 / 60),
        24 // Saturday
    ][date.getDay()],
    us: (date) => 15 * 3600 * 1000
};
const WEEKEND_CLASSNAMES = ['fromWeekend', 'overWeekend'];
let scroll = 0; // The location to scroll to in order to reach today in calendar view
function getScroll() {
    return scroll;
}
function getTimeAfter(date) {
    const hideAssignments = _settings__WEBPACK_IMPORTED_MODULE_10__["settings"].hideAssignments;
    if (hideAssignments === 'day' || hideAssignments === 'ms' || hideAssignments === 'us') {
        return SCHEDULE_ENDS[hideAssignments](date);
    }
    else {
        return SCHEDULE_ENDS.day(date);
    }
}
function getStartEndDates(data) {
    if (data.monthView) {
        const startN = Math.min(...data.assignments.map((a) => a.start)); // Smallest date
        const endN = Math.max(...data.assignments.map((a) => a.start)); // Largest date
        const year = (new Date()).getFullYear(); // For future calculations
        // Calculate what month we will be displaying by finding the month of today
        const month = (new Date()).getMonth() + Object(_navigation__WEBPACK_IMPORTED_MODULE_12__["getCalDateOffset"])();
        // Make sure the start and end dates lie within the month
        const start = new Date(Math.max(Object(_dates__WEBPACK_IMPORTED_MODULE_4__["fromDateNum"])(startN).getTime(), (new Date(year, month)).getTime()));
        // If the day argument for Date is 0, then the resulting date will be of the previous month
        const end = new Date(Math.min(Object(_dates__WEBPACK_IMPORTED_MODULE_4__["fromDateNum"])(endN).getTime(), (new Date(year, month + 1, 0)).getTime()));
        return { start, end };
    }
    else {
        const todaySE = new Date();
        const start = new Date(todaySE.getFullYear(), todaySE.getMonth(), todaySE.getDate());
        const end = new Date(todaySE.getFullYear(), todaySE.getMonth(), todaySE.getDate());
        return { start, end };
    }
}
function getAssignmentSplits(assignment, start, end, reference) {
    const split = [];
    if (_settings__WEBPACK_IMPORTED_MODULE_10__["settings"].assignmentSpan === 'multiple') {
        const s = Math.max(start.getTime(), Object(_dates__WEBPACK_IMPORTED_MODULE_4__["fromDateNum"])(assignment.start).getTime());
        const e = assignment.end === 'Forever' ? s : Math.min(end.getTime(), Object(_dates__WEBPACK_IMPORTED_MODULE_4__["fromDateNum"])(assignment.end).getTime());
        const span = ((e - s) / 1000 / 3600 / 24) + 1; // Number of days assignment takes up
        const spanRelative = 6 - (new Date(s)).getDay(); // Number of days until the next Saturday
        const ns = new Date(s);
        ns.setDate(ns.getDate() + spanRelative); //  The date of the next Saturday
        // tslint:disable-next-line no-loops
        for (let n = -6; n < span - spanRelative; n += 7) {
            const lastSun = new Date(ns);
            lastSun.setDate(lastSun.getDate() + n);
            const nextSat = new Date(lastSun);
            nextSat.setDate(nextSat.getDate() + 6);
            split.push({
                assignment,
                start: new Date(Math.max(s, lastSun.getTime())),
                end: new Date(Math.min(e, nextSat.getTime())),
                custom: Boolean(reference),
                reference
            });
        }
    }
    else if (_settings__WEBPACK_IMPORTED_MODULE_10__["settings"].assignmentSpan === 'start') {
        const s = Object(_dates__WEBPACK_IMPORTED_MODULE_4__["fromDateNum"])(assignment.start);
        if (s.getTime() >= start.getTime()) {
            split.push({
                assignment,
                start: s,
                end: s,
                custom: Boolean(reference),
                reference
            });
        }
    }
    else if (_settings__WEBPACK_IMPORTED_MODULE_10__["settings"].assignmentSpan === 'end') {
        const e = assignment.end === 'Forever' ? assignment.end : Object(_dates__WEBPACK_IMPORTED_MODULE_4__["fromDateNum"])(assignment.end);
        const de = e === 'Forever' ? Object(_dates__WEBPACK_IMPORTED_MODULE_4__["fromDateNum"])(assignment.start) : e;
        if (de.getTime() <= end.getTime()) {
            split.push({
                assignment,
                start: de,
                end: e,
                custom: Boolean(reference),
                reference
            });
        }
    }
    return split;
}
// This function will convert the array of assignments generated by *parse* into readable HTML.
function display(doScroll = true) {
    console.time('Displaying data');
    try {
        const data = Object(_pcr__WEBPACK_IMPORTED_MODULE_5__["getData"])();
        if (!data) {
            throw new Error('Data should have been fetched before display() was called');
        }
        document.body.setAttribute('data-pcrview', data.monthView ? 'month' : 'other');
        const main = Object(_util__WEBPACK_IMPORTED_MODULE_11__["_$"])(document.querySelector('main'));
        const taken = {};
        const timeafter = getTimeAfter(new Date());
        const { start, end } = getStartEndDates(data);
        // Set the start date to be a Sunday and the end date to be a Saturday
        start.setDate(start.getDate() - start.getDay());
        end.setDate(end.getDate() + (6 - end.getDay()));
        // First populate the calendar with boxes for each day
        // Only consider the previous set of assignments for activity purposes if the month is the same
        const lastData = data.monthOffset == 0 ? Object(_util__WEBPACK_IMPORTED_MODULE_11__["localStorageRead"])('data') : null;
        let wk = null;
        Object(_dates__WEBPACK_IMPORTED_MODULE_4__["iterDays"])(start, end, (d) => {
            if (d.getDay() === 0) {
                const id = `wk${d.getMonth()}-${d.getDate()}`; // Don't create a new week element if one already exists
                wk = document.getElementById(id);
                if (wk == null) {
                    wk = Object(_components_calendar__WEBPACK_IMPORTED_MODULE_1__["createWeek"])(id);
                    main.appendChild(wk);
                }
            }
            if (!wk)
                throw new Error(`Expected week element on day ${d} to not be null`);
            if (wk.getElementsByClassName('day').length <= d.getDay()) {
                wk.appendChild(Object(_components_calendar__WEBPACK_IMPORTED_MODULE_1__["createDay"])(d));
            }
            taken[d.getTime()] = [];
        });
        // Split assignments taking more than 1 week
        const split = [];
        data.assignments.forEach((assignment, num) => {
            split.push(...getAssignmentSplits(assignment, start, end));
            // Activity stuff
            if (lastData != null) {
                const oldAssignment = lastData.assignments.find((a) => a.id === assignment.id);
                if (oldAssignment) {
                    if (oldAssignment.body !== assignment.body) {
                        Object(_plugins_activity__WEBPACK_IMPORTED_MODULE_6__["addActivity"])('edit', oldAssignment, new Date(), true, oldAssignment.class != null ? lastData.classes[oldAssignment.class] : undefined);
                        Object(_plugins_modifiedAssignments__WEBPACK_IMPORTED_MODULE_9__["removeFromModified"])(assignment.id); // If the assignment is modified, reset it
                    }
                    lastData.assignments.splice(lastData.assignments.indexOf(oldAssignment), 1);
                }
                else {
                    Object(_plugins_activity__WEBPACK_IMPORTED_MODULE_6__["addActivity"])('add', assignment, new Date(), true);
                }
            }
        });
        if (lastData != null) {
            // Check if any of the last assignments weren't deleted (so they have been deleted in PCR)
            lastData.assignments.forEach((assignment) => {
                Object(_plugins_activity__WEBPACK_IMPORTED_MODULE_6__["addActivity"])('delete', assignment, new Date(), true, assignment.class != null ? lastData.classes[assignment.class] : undefined);
                Object(_plugins_done__WEBPACK_IMPORTED_MODULE_8__["removeFromDone"])(assignment.id);
                Object(_plugins_modifiedAssignments__WEBPACK_IMPORTED_MODULE_9__["removeFromModified"])(assignment.id);
            });
            // Then save a maximum of 128 activity items
            Object(_plugins_activity__WEBPACK_IMPORTED_MODULE_6__["saveActivity"])();
            // And completed assignments + modifications
            Object(_plugins_done__WEBPACK_IMPORTED_MODULE_8__["saveDone"])();
            Object(_plugins_modifiedAssignments__WEBPACK_IMPORTED_MODULE_9__["saveModified"])();
        }
        // Add custom assignments to the split array
        Object(_plugins_customAssignments__WEBPACK_IMPORTED_MODULE_7__["getExtra"])().forEach((custom) => {
            split.push(...getAssignmentSplits(Object(_plugins_customAssignments__WEBPACK_IMPORTED_MODULE_7__["extraToTask"])(custom, data), start, end, custom));
        });
        // Calculate the today's week id
        const tdst = new Date();
        tdst.setDate(tdst.getDate() - tdst.getDay());
        const todayWkId = `wk${tdst.getMonth()}-${tdst.getDate()}`;
        // Then add assignments
        const weekHeights = {};
        const previousAssignments = {};
        Array.prototype.forEach.call(document.getElementsByClassName('assignment'), (assignment) => {
            previousAssignments[assignment.id] = assignment;
        });
        split.forEach((s) => {
            const weekId = Object(_components_assignment__WEBPACK_IMPORTED_MODULE_0__["computeWeekId"])(s);
            wk = document.getElementById(weekId);
            if (wk == null)
                return;
            const e = Object(_components_assignment__WEBPACK_IMPORTED_MODULE_0__["createAssignment"])(s, data);
            // Calculate how many assignments are placed before the current one
            if (!s.custom || !_settings__WEBPACK_IMPORTED_MODULE_10__["settings"].sepTasks) {
                let pos = 0;
                // tslint:disable-next-line no-loops
                while (true) {
                    let found = true;
                    Object(_dates__WEBPACK_IMPORTED_MODULE_4__["iterDays"])(s.start, s.end === 'Forever' ? s.start : s.end, (d) => {
                        if (taken[d.getTime()].indexOf(pos) !== -1) {
                            found = false;
                        }
                    });
                    if (found) {
                        break;
                    }
                    pos++;
                }
                // Append the position the assignment is at to the taken array
                Object(_dates__WEBPACK_IMPORTED_MODULE_4__["iterDays"])(s.start, s.end === 'Forever' ? s.start : s.end, (d) => {
                    taken[d.getTime()].push(pos);
                });
                // Calculate how far down the assignment must be placed as to not block the ones above it
                e.style.marginTop = (pos * 30) + 'px';
                if ((weekHeights[weekId] == null) || (pos > weekHeights[weekId])) {
                    weekHeights[weekId] = pos;
                    wk.style.height = 47 + ((pos + 1) * 30) + 'px';
                }
            }
            // If the assignment is a test and is upcoming, add it to the upcoming tests panel.
            if (s.assignment.end >= Object(_dates__WEBPACK_IMPORTED_MODULE_4__["today"])() && (s.assignment.baseType === 'test' ||
                (_settings__WEBPACK_IMPORTED_MODULE_10__["settings"].projectsInTestPane && s.assignment.baseType === 'longterm'))) {
                const te = Object(_util__WEBPACK_IMPORTED_MODULE_11__["element"])('div', ['upcomingTest', 'assignmentItem', s.assignment.baseType], `<i class='material-icons'>
                                        ${s.assignment.baseType === 'longterm' ? 'assignment' : 'assessment'}
                                    </i>
                                    <span class='title'>${s.assignment.title}</span>
                                    <small>${Object(_components_assignment__WEBPACK_IMPORTED_MODULE_0__["separatedClass"])(s.assignment, data)[2]}</small>
                                    <div class='range'>${Object(_util__WEBPACK_IMPORTED_MODULE_11__["dateString"])(s.assignment.end, true)}</div>`, `test${s.assignment.id}`);
                if (s.assignment.class)
                    te.setAttribute('data-class', data.classes[s.assignment.class]);
                te.addEventListener('click', () => {
                    const doScrolling = async () => {
                        await Object(_util__WEBPACK_IMPORTED_MODULE_11__["smoothScroll"])((e.getBoundingClientRect().top + document.body.scrollTop) - 116);
                        e.click();
                    };
                    if (document.body.getAttribute('data-view') === '0') {
                        doScrolling();
                    }
                    else {
                        Object(_util__WEBPACK_IMPORTED_MODULE_11__["_$"])(document.querySelector('#navTabs>li:first-child')).click();
                        setTimeout(doScrolling, 500);
                    }
                });
                if (Object(_plugins_done__WEBPACK_IMPORTED_MODULE_8__["assignmentInDone"])(s.assignment.id)) {
                    te.classList.add('done');
                }
                const testElem = document.getElementById(`test${s.assignment.id}`);
                if (testElem) {
                    testElem.innerHTML = te.innerHTML;
                }
                else {
                    Object(_util__WEBPACK_IMPORTED_MODULE_11__["elemById"])('infoTests').appendChild(te);
                }
            }
            const already = document.getElementById(s.assignment.id + weekId);
            if (already != null) { // Assignment already exists
                already.style.marginTop = e.style.marginTop;
                already.setAttribute('data-class', s.custom && _settings__WEBPACK_IMPORTED_MODULE_10__["settings"].sepTaskClass ? 'Task' : Object(_pcr__WEBPACK_IMPORTED_MODULE_5__["classById"])(s.assignment.class));
                if (!Object(_plugins_modifiedAssignments__WEBPACK_IMPORTED_MODULE_9__["assignmentInModified"])(s.assignment.id)) {
                    already.getElementsByClassName('body')[0].innerHTML = e.getElementsByClassName('body')[0].innerHTML;
                }
                Object(_util__WEBPACK_IMPORTED_MODULE_11__["_$"])(already.querySelector('.edits')).className = Object(_util__WEBPACK_IMPORTED_MODULE_11__["_$"])(e.querySelector('.edits')).className;
                if (already.classList.toggle) {
                    already.classList.toggle('listDisp', e.classList.contains('listDisp'));
                }
                Object(_components_assignment__WEBPACK_IMPORTED_MODULE_0__["getES"])(already).forEach((cl) => already.classList.remove(cl));
                Object(_components_assignment__WEBPACK_IMPORTED_MODULE_0__["getES"])(e).forEach((cl) => already.classList.add(cl));
                WEEKEND_CLASSNAMES.forEach((cl) => {
                    already.classList.remove(cl);
                    if (e.classList.contains(cl))
                        already.classList.add(cl);
                });
            }
            else {
                if (s.custom && _settings__WEBPACK_IMPORTED_MODULE_10__["settings"].sepTasks) {
                    const st = Math.floor(s.start.getTime() / 1000 / 3600 / 24);
                    if ((s.assignment.start === st) &&
                        (s.assignment.end === 'Forever' || s.assignment.end >= Object(_dates__WEBPACK_IMPORTED_MODULE_4__["today"])())) {
                        e.classList.remove('assignment');
                        e.classList.add('taskPaneItem');
                        e.style.order = String(s.assignment.end === 'Forever' ? Number.MAX_VALUE : s.assignment.end);
                        const link = e.querySelector('.linked');
                        if (link) {
                            e.insertBefore(Object(_util__WEBPACK_IMPORTED_MODULE_11__["element"])('small', [], link.innerHTML), link);
                            link.remove();
                        }
                        Object(_util__WEBPACK_IMPORTED_MODULE_11__["elemById"])('infoTasksInner').appendChild(e);
                    }
                }
                else {
                    wk.appendChild(e);
                }
            }
            delete previousAssignments[s.assignment.id + weekId];
        });
        // Delete any assignments that have been deleted since updating
        Object.entries(previousAssignments).forEach(([name, assignment]) => {
            if (assignment.classList.contains('full')) {
                Object(_util__WEBPACK_IMPORTED_MODULE_11__["elemById"])('background').classList.remove('active');
            }
            assignment.remove();
        });
        // Scroll to the correct position in calendar view
        if (weekHeights[todayWkId] != null) {
            let h = 0;
            const sw = (wkid) => wkid.substring(2).split('-').map((x) => Number(x));
            const todayWk = sw(todayWkId);
            Object.entries(weekHeights).forEach(([wkId, val]) => {
                const wkSplit = sw(wkId);
                if ((wkSplit[0] < todayWk[0]) || ((wkSplit[0] === todayWk[0]) && (wkSplit[1] < todayWk[1]))) {
                    h += val;
                }
            });
            scroll = (h * 30) + 112 + 14;
            // Also show the day headers if today's date is displayed in the first row of the calendar
            if (scroll < 50)
                scroll = 0;
            if (doScroll && (document.body.getAttribute('data-view') === '0') &&
                !document.body.querySelector('.full')) {
                // in calendar view
                window.scrollTo(0, scroll);
            }
        }
        document.body.classList.toggle('noList', document.querySelectorAll('.assignment.listDisp:not(.done)').length === 0);
        if (document.body.getAttribute('data-view') === '1') { // in list view
            Object(_components_resizer__WEBPACK_IMPORTED_MODULE_3__["resize"])();
        }
    }
    catch (err) {
        Object(_components_errorDisplay__WEBPACK_IMPORTED_MODULE_2__["displayError"])(err);
    }
    console.timeEnd('Displaying data');
}
// The function below converts an update time to a human-readable date.
function formatUpdate(date) {
    const now = new Date();
    const update = new Date(+date);
    if (now.getDate() === update.getDate()) {
        let ampm = 'AM';
        let hr = update.getHours();
        if (hr > 12) {
            ampm = 'PM';
            hr -= 12;
        }
        const min = update.getMinutes();
        return `Today at ${hr}:${min < 10 ? `0${min}` : min} ${ampm}`;
    }
    else {
        const daysPast = Math.ceil((now.getTime() - update.getTime()) / 1000 / 3600 / 24);
        if (daysPast === 1) {
            return 'Yesterday';
        }
        else {
            return daysPast + ' days ago';
        }
    }
}


/***/ }),

/***/ "./src/navigation.ts":
/*!***************************!*\
  !*** ./src/navigation.ts ***!
  \***************************/
/*! exports provided: getListDateOffset, incrementListDateOffset, decrementListDateOffset, setListDateOffset, getCalDateOffset, incrementCalDateOffset, decrementCalDateOffset, setCalDateOffset, zeroDateOffsets */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getListDateOffset", function() { return getListDateOffset; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "incrementListDateOffset", function() { return incrementListDateOffset; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "decrementListDateOffset", function() { return decrementListDateOffset; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setListDateOffset", function() { return setListDateOffset; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getCalDateOffset", function() { return getCalDateOffset; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "incrementCalDateOffset", function() { return incrementCalDateOffset; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "decrementCalDateOffset", function() { return decrementCalDateOffset; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setCalDateOffset", function() { return setCalDateOffset; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "zeroDateOffsets", function() { return zeroDateOffsets; });
let listDateOffset = 0;
let calDateOffset = 0;
function getListDateOffset() {
    return listDateOffset;
}
function incrementListDateOffset() {
    listDateOffset += 1;
}
function decrementListDateOffset() {
    listDateOffset -= 1;
}
function setListDateOffset(offset) {
    listDateOffset = offset;
}
function getCalDateOffset() {
    return calDateOffset;
}
function incrementCalDateOffset() {
    calDateOffset += 1;
}
function decrementCalDateOffset() {
    calDateOffset -= 1;
}
function setCalDateOffset(offset) {
    calDateOffset = offset;
}
function zeroDateOffsets() {
    listDateOffset = 0;
    calDateOffset = 0;
}


/***/ }),

/***/ "./src/pcr.ts":
/*!********************!*\
  !*** ./src/pcr.ts ***!
  \********************/
/*! exports provided: fetch, dologin, getData, getClasses, setData, urlForAttachment, getAttachmentMimeType, classById, switchViews, logout */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetch", function() { return fetch; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "dologin", function() { return dologin; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getData", function() { return getData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getClasses", function() { return getClasses; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setData", function() { return setData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "urlForAttachment", function() { return urlForAttachment; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getAttachmentMimeType", function() { return getAttachmentMimeType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "classById", function() { return classById; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "switchViews", function() { return switchViews; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "logout", function() { return logout; });
/* harmony import */ var _components_avatar__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/avatar */ "./src/components/avatar.ts");
/* harmony import */ var _components_errorDisplay__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/errorDisplay */ "./src/components/errorDisplay.ts");
/* harmony import */ var _components_snackbar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/snackbar */ "./src/components/snackbar.ts");
/* harmony import */ var _cookies__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./cookies */ "./src/cookies.ts");
/* harmony import */ var _dates__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./dates */ "./src/dates.ts");
/* harmony import */ var _display__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./display */ "./src/display.ts");
/* harmony import */ var _navigation__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./navigation */ "./src/navigation.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./util */ "./src/util.ts");
/**
 * This module contains code to both fetch and parse assignments from PCR.
 */








const PCR_URL = 'https://webappsca.pcrsoft.com';
const ASSIGNMENTS_URL = `${PCR_URL}/Clue/SC-Assignments-Start-and-End-Date-(No-Range)/18594`;
const LOGIN_URL = `${PCR_URL}/Clue/SC-Student-Portal-Login-LDAP/8464?returnUrl=${encodeURIComponent(ASSIGNMENTS_URL)}`;
const ATTACHMENTS_URL = `${PCR_URL}/Clue/Common/AttachmentRender.aspx`;
const FORM_HEADER_ONLY = { 'Content-type': 'application/x-www-form-urlencoded' };
const ONE_MINUTE_MS = 60000;
const progressElement = Object(_util__WEBPACK_IMPORTED_MODULE_7__["elemById"])('progress');
const loginDialog = Object(_util__WEBPACK_IMPORTED_MODULE_7__["elemById"])('login');
const loginBackground = document.getElementById('loginBackground');
const lastUpdateEl = document.getElementById('lastUpdate');
const usernameEl = Object(_util__WEBPACK_IMPORTED_MODULE_7__["elemById"])('username');
const passwordEl = Object(_util__WEBPACK_IMPORTED_MODULE_7__["elemById"])('password');
const rememberCheck = Object(_util__WEBPACK_IMPORTED_MODULE_7__["elemById"])('remember');
const incorrectLoginEl = Object(_util__WEBPACK_IMPORTED_MODULE_7__["elemById"])('loginIncorrect');
// TODO keeping these as a global vars is bad
const loginHeaders = {};
const viewData = {};
let lastUpdate = 0; // The last time everything was updated
// This is the function that retrieves your assignments from PCR.
//
// First, a request is sent to PCR to load the page you would normally see when accessing PCR.
//
// Because this is run as a chrome extension, this page can be accessed. Otherwise, the browser
// would throw an error for security reasons (you don't want a random website being able to access
// confidential data from a website you have logged into).
/**
 * Fetches data from PCR and if the user is logged in parses and displays it
 * @param override Whether to force an update even there was one recently
 * @param data  Optional data to be posted to PCR
 */
async function fetch(override = false, data, onsuccess = _display__WEBPACK_IMPORTED_MODULE_5__["display"], onlogin) {
    if (!override && Date.now() - lastUpdate < ONE_MINUTE_MS)
        return;
    lastUpdate = Date.now();
    // Request a new month if needed
    const monthOffset = Object(_navigation__WEBPACK_IMPORTED_MODULE_6__["getCalDateOffset"])();
    if (monthOffset !== 0) {
        const today = new Date();
        today.setMonth(today.getMonth() + Object(_navigation__WEBPACK_IMPORTED_MODULE_6__["getCalDateOffset"])());
        // Remember months are zero-indexed
        const dateArray = [today.getFullYear(), today.getMonth() + 1, 1];
        const newViewData = Object.assign({}, viewData, { __EVENTTARGET: 'ctl00$ctl00$baseContent$baseContent$flashTop$ctl00$RadScheduler1$SelectedDateCalendar', __EVENTARGUMENT: 'd', ctl00_ctl00_baseContent_baseContent_flashTop_ctl00_RadScheduler1_SelectedDateCalendar_SD: JSON.stringify([dateArray]), ctl00_ctl00_baseContent_baseContent_flashTop_ctl00_RadScheduler1_SelectedDateCalendar_AD: JSON.stringify([[1900, 1, 1], [2099, 12, 30], dateArray]) });
        const postArray = []; // Array of data to post
        Object.entries(newViewData).forEach(([h, v]) => {
            postArray.push(encodeURIComponent(h) + '=' + encodeURIComponent(v));
        });
        data = (data ? data + '&' : '') + postArray.join('&');
    }
    const headers = data ? FORM_HEADER_ONLY : undefined;
    console.time('Fetching assignments');
    try {
        const resp = await Object(_util__WEBPACK_IMPORTED_MODULE_7__["send"])(ASSIGNMENTS_URL, 'document', headers, data, progressElement);
        console.timeEnd('Fetching assignments');
        if (resp.responseURL.indexOf('Login') !== -1) {
            // We have to log in now
            resp.response.getElementsByTagName('input').forEach((e) => {
                loginHeaders[e.name] = e.value || '';
            });
            console.log('Need to log in');
            const up = Object(_cookies__WEBPACK_IMPORTED_MODULE_3__["getCookie"])('userPass'); // Attempts to get the cookie *userPass*, which is set if the
            // "Remember me" checkbox is checked when logging in through CheckPCR
            if (up === '') {
                if (loginBackground)
                    loginBackground.style.display = 'block';
                loginDialog.classList.add('active');
                if (onlogin)
                    onlogin();
            }
            else {
                // Because we were remembered, we can log in immediately without waiting for the
                // user to log in through the login form
                dologin(window.atob(up).split(':'), false, onsuccess);
            }
        }
        else {
            // Logged in now
            console.log('Fetching assignments successful');
            const t = Date.now();
            localStorage.lastUpdate = t;
            if (lastUpdateEl)
                lastUpdateEl.innerHTML = Object(_display__WEBPACK_IMPORTED_MODULE_5__["formatUpdate"])(t);
            try {
                parse(resp.response, monthOffset);
                onsuccess();
                if (monthOffset === 0) {
                    Object(_util__WEBPACK_IMPORTED_MODULE_7__["localStorageWrite"])('data', getData()); // Store for offline use
                }
            }
            catch (error) {
                console.log(error);
                Object(_components_errorDisplay__WEBPACK_IMPORTED_MODULE_1__["displayError"])(error);
            }
        }
    }
    catch (error) {
        console.log('Could not fetch assignments; You are probably offline. Here\'s the error:', error);
        Object(_components_snackbar__WEBPACK_IMPORTED_MODULE_2__["snackbar"])('Could not fetch your assignments', 'Retry', () => fetch(true));
    }
}
/**
 * Logs the user into PCR
 * @param val   An optional length-2 array of the form [username, password] to use the user in with.
 *              If this array is not given the login dialog inputs will be used.
 * @param submitEvt Whether to override the username and password suppleid in val with the values of the input elements
 */
async function dologin(val, submitEvt = false, onsuccess = _display__WEBPACK_IMPORTED_MODULE_5__["display"]) {
    loginDialog.classList.remove('active');
    setTimeout(() => {
        if (loginBackground)
            loginBackground.style.display = 'none';
    }, 350);
    const postArray = []; // Array of data to post
    Object(_util__WEBPACK_IMPORTED_MODULE_7__["localStorageWrite"])('username', val && !submitEvt ? val[0] : usernameEl.value);
    Object(_components_avatar__WEBPACK_IMPORTED_MODULE_0__["updateAvatar"])();
    Object.keys(loginHeaders).forEach((h) => {
        // Loop through the input elements contained in the login page. As mentioned before, they
        // will be sent to PCR to log in.
        if (h.toLowerCase().indexOf('user') !== -1) {
            loginHeaders[h] = val && !submitEvt ? val[0] : usernameEl.value;
        }
        if (h.toLowerCase().indexOf('pass') !== -1) {
            loginHeaders[h] = val && !submitEvt ? val[1] : passwordEl.value;
        }
        postArray.push(encodeURIComponent(h) + '=' + encodeURIComponent(loginHeaders[h]));
    });
    // Now send the login request to PCR
    console.time('Logging in');
    try {
        const resp = await Object(_util__WEBPACK_IMPORTED_MODULE_7__["send"])(LOGIN_URL, 'document', FORM_HEADER_ONLY, postArray.join('&'), progressElement);
        console.timeEnd('Logging in');
        if (resp.responseURL.indexOf('Login') !== -1) {
            // If PCR still wants us to log in, then the username or password entered were incorrect.
            incorrectLoginEl.style.display = 'block';
            passwordEl.value = '';
            loginDialog.classList.add('active');
            if (loginBackground)
                loginBackground.style.display = 'block';
        }
        else {
            // Otherwise, we are logged in
            if (rememberCheck.checked) { // Is the "remember me" checkbox checked?
                // Set a cookie with the username and password so we can log in automatically in the
                // future without having to prompt for a username and password again
                Object(_cookies__WEBPACK_IMPORTED_MODULE_3__["setCookie"])('userPass', window.btoa(usernameEl.value + ':' + passwordEl.value), 14);
            }
            // loadingBar.style.display = "none"
            const t = Date.now();
            localStorage.lastUpdate = t;
            if (lastUpdateEl)
                lastUpdateEl.innerHTML = Object(_display__WEBPACK_IMPORTED_MODULE_5__["formatUpdate"])(t);
            try {
                parse(resp.response, 0); // Parse the data PCR has replied with
                onsuccess();
                Object(_util__WEBPACK_IMPORTED_MODULE_7__["localStorageWrite"])('data', getData()); // Store for offline use
            }
            catch (e) {
                console.log(e);
                Object(_components_errorDisplay__WEBPACK_IMPORTED_MODULE_1__["displayError"])(e);
            }
        }
    }
    catch (error) {
        console.log('Could not log in to PCR. Either your network connection was lost during your visit ' +
            'or PCR is just not working. Here\'s the error:', error);
    }
}
function getData() {
    return window.data;
}
function getClasses() {
    const data = getData();
    if (!data)
        return [];
    return data.classes;
}
function setData(data) {
    window.data = data;
}
// In PCR's interface, you can click a date in month or week view to see it in day view.
// Therefore, the HTML element that shows the date that you can click on has a hyperlink that looks like `#2015-04-26`.
// The function below will parse that String and return a Date timestamp
function parseDateHash(element) {
    const [year, month, day] = element.hash.substring(1).split('-').map(Number);
    return (new Date(year, month - 1, day)).getTime();
}
// The *attachmentify* function parses the body of an assignment (*text*) and returns the assignment's attachments.
// Side effect: these attachments are removed
function attachmentify(element) {
    const attachments = [];
    // Get all links
    const as = Array.from(element.getElementsByTagName('a'));
    as.forEach((a) => {
        if (a.id.includes('Attachment')) {
            attachments.push([
                a.innerHTML,
                a.search + a.hash
            ]);
            a.remove();
        }
    });
    return attachments;
}
const URL_REGEX = new RegExp(`(\
https?:\\/\\/\
[-A-Z0-9+&@#\\/%?=~_|!:,.;]*\
[-A-Z0-9+&@#\\/%=~_|]+\
)`, 'ig');
// This function replaces text that represents a hyperlink with a functional hyperlink by using
// javascript's replace function with a regular expression if the text already isn't part of a
// hyperlink.
function urlify(text) {
    return text.replace(URL_REGEX, (str, str2, offset) => {
        if (/href\s*=\s*./.test(text.substring(offset - 10, offset)) ||
            /originalpath\s*=\s*./.test(text.substring(offset - 20, offset))) {
            return str;
        }
        else {
            return `<a href="${str}">${str}</a>`;
        }
    });
}
// Also, PCR"s interface uses a system of IDs to identify different elements. For example, the ID of
// one of the boxes showing the name of an assignment could be
// `ctl00_ctl00_baseContent_baseContent_flashTop_ctl00_RadScheduler1_95_0`. The function below will
// return the first HTML element whose ID contains a specified String (*id*) and containing a
// specified tag (*tag*).
function findId(element, tag, id) {
    const el = [...element.getElementsByTagName(tag)].find((e) => e.id.includes(id));
    if (!el)
        throw new Error(`Could not find element with tag ${tag} and id ${id} in ${element}`);
    return el;
}
function parseAssignmentType(type) {
    return type.toLowerCase().replace('& quizzes', '').replace('tests', 'test');
}
function parseAssignmentBaseType(type) {
    return type.toLowerCase().replace('& quizzes', '').replace(/\s/g, '').replace('quizzes', 'test');
}
function parseAssignment(ca) {
    const data = getData();
    if (!data)
        throw new Error('Data dictionary not set up');
    // The starting date and ending date of the assignment are parsed first
    const range = findId(ca, 'span', 'StartingOn').innerHTML.split(' - ');
    const assignmentStart = Object(_dates__WEBPACK_IMPORTED_MODULE_4__["toDateNum"])(Date.parse(range[0]));
    const assignmentEnd = (range[1] != null) ? Object(_dates__WEBPACK_IMPORTED_MODULE_4__["toDateNum"])(Date.parse(range[1])) : assignmentStart;
    // Then, the name of the assignment is parsed
    const t = findId(ca, 'span', 'lblTitle');
    let title = t.innerHTML;
    // The actual body of the assignment and its attachments are parsed next
    const b = Object(_util__WEBPACK_IMPORTED_MODULE_7__["_$"])(Object(_util__WEBPACK_IMPORTED_MODULE_7__["_$"])(t.parentNode).parentNode);
    [...b.getElementsByTagName('div')].slice(0, 2).forEach((div) => div.remove());
    const ap = attachmentify(b); // Separates attachments from the body
    // The last Replace removes leading and trailing newlines
    const assignmentBody = urlify(b.innerHTML)
        .replace(/^(?:\s*<br\s*\/?>)*/, '')
        .replace(/(?:\s*<br\s*\/?>)*\s*$/, '').trim();
    // Finally, we separate the class name and type (homework, classwork, or projects) from the title of the assignment
    const matchedTitle = title.match(/\(([^)]*\)*)\)$/);
    if ((matchedTitle == null)) {
        throw new Error(`Could not parse assignment title \"${title}\"`);
    }
    const assignmentType = matchedTitle[1];
    const assignmentBaseType = parseAssignmentBaseType(ca.title.substring(0, ca.title.indexOf('\n')));
    let assignmentClassIndex = null;
    data.classes.some((c, pos) => {
        if (title.indexOf(c) !== -1) {
            assignmentClassIndex = pos;
            title = title.replace(c, '');
            return true;
        }
        return false;
    });
    if (assignmentClassIndex === null || assignmentClassIndex === -1) {
        throw new Error(`Could not find class in title ${title} (classes are ${data.classes}`);
    }
    const assignmentTitle = title.substring(title.indexOf(': ') + 2).replace(/\([^\(\)]*\)$/, '').trim();
    // To make sure there are no repeats, the title of the assignment (only letters) and its start &
    // end date are combined to give it a unique identifier.
    const assignmentId = assignmentTitle.replace(/[^\w]*/g, '') + (assignmentStart + assignmentEnd);
    return {
        start: assignmentStart,
        end: assignmentEnd,
        attachments: ap,
        body: assignmentBody,
        type: assignmentType,
        baseType: assignmentBaseType,
        class: assignmentClassIndex,
        title: assignmentTitle,
        id: assignmentId
    };
}
// The function below will parse the data given by PCR and convert it into an object. If you open up
// the developer console on CheckPCR and type in `data`, you can see the array containing all of
// your assignments.
function parse(doc, monthOffset) {
    console.time('Handling data'); // To time how long it takes to parse the assignments
    const handledDataShort = []; // Array used to make sure we don"t parse the same assignment twice.
    const data = {
        classes: [],
        assignments: [],
        monthView: Object(_util__WEBPACK_IMPORTED_MODULE_7__["_$"])(doc.querySelector('.rsHeaderMonth')).parentNode.classList.contains('rsSelected'),
        monthOffset: monthOffset
    }; // Reset the array in which all of your assignments are stored in.
    setData(data);
    doc.querySelectorAll('input:not([type="submit"])').forEach((e) => {
        viewData[e.name] = e.value || '';
    });
    // Now, the classes you take are parsed (these are the checkboxes you see up top when looking at PCR).
    const classes = findId(doc, 'table', 'cbClasses').getElementsByTagName('label');
    classes.forEach((c) => {
        data.classes.push(c.innerHTML);
    });
    const assignments = doc.getElementsByClassName('rsApt rsAptSimple');
    Array.prototype.forEach.call(assignments, (assignmentEl) => {
        const assignment = parseAssignment(assignmentEl);
        if (handledDataShort.indexOf(assignment.id) === -1) { // Make sure we haven't already parsed the assignment
            handledDataShort.push(assignment.id);
            data.assignments.push(assignment);
        }
    });
    console.timeEnd('Handling data');
    // Now allow the view to be switched
    document.body.classList.add('loaded');
}
function urlForAttachment(search) {
    return ATTACHMENTS_URL + search;
}
function getAttachmentMimeType(search) {
    return new Promise((resolve, reject) => {
        const req = new XMLHttpRequest();
        req.open('HEAD', urlForAttachment(search));
        req.onload = () => {
            if (req.status === 200) {
                const type = req.getResponseHeader('Content-Type');
                if (type) {
                    resolve(type);
                }
                else {
                    reject(new Error('Content type is null'));
                }
            }
        };
        req.send();
    });
}
function classById(id) {
    return (id ? getClasses()[id] : null) || 'Unknown class';
}
function switchViews() {
    if (Object.keys(viewData).length > 0) {
        Object(_util__WEBPACK_IMPORTED_MODULE_7__["elemById"])('sideBackground').click();
        const newViewData = Object.assign({}, viewData, { __EVENTTARGET: 'ctl00$ctl00$baseContent$baseContent$flashTop$ctl00$RadScheduler1', __EVENTARGUMENT: JSON.stringify({
                Command: `SwitchTo${document.body.getAttribute('data-pcrview') === 'month' ? 'Week' : 'Month'}View`
            }), ctl00_ctl00_baseContent_baseContent_flashTop_ctl00_RadScheduler1_ClientState: JSON.stringify({ scrollTop: 0, scrollLeft: 0, isDirty: false }), ctl00_ctl00_RadScriptManager1_TSM: ';;System.Web.Extensions, Version=4.0.0.0, Culture=neutral, ' +
                'PublicKeyToken=31bf3856ad364e35:en-US:d28568d3-e53e-4706-928f-3765912b66ca:ea597d4b:b25378d2' });
        const postArray = []; // Array of data to post
        Object.entries(newViewData).forEach(([h, v]) => {
            postArray.push(encodeURIComponent(h) + '=' + encodeURIComponent(v));
        });
        Object(_navigation__WEBPACK_IMPORTED_MODULE_6__["zeroDateOffsets"])();
        fetch(true, postArray.join('&'));
    }
}
function logout() {
    if (Object.keys(viewData).length > 0) {
        Object(_cookies__WEBPACK_IMPORTED_MODULE_3__["deleteCookie"])('userPass');
        Object(_util__WEBPACK_IMPORTED_MODULE_7__["elemById"])('sideBackground').click();
        viewData.__EVENTTARGET = 'ctl00$ctl00$baseContent$LogoutControl1$LoginStatus1$ctl00';
        viewData.__EVENTARGUMENT = '';
        viewData.ctl00_ctl00_baseContent_baseContent_flashTop_ctl00_RadScheduler1_ClientState =
            JSON.stringify({ scrollTop: 0, scrollLeft: 0, isDirty: false });
        const postArray = []; // Array of data to post
        Object.entries(viewData).forEach(([h, v]) => {
            postArray.push(encodeURIComponent(h) + '=' + encodeURIComponent(v));
        });
        fetch(true, postArray.join('&'));
    }
}


/***/ }),

/***/ "./src/plugins/activity.ts":
/*!*********************************!*\
  !*** ./src/plugins/activity.ts ***!
  \*********************************/
/*! exports provided: addActivity, saveActivity, recentActivity */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addActivity", function() { return addActivity; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "saveActivity", function() { return saveActivity; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "recentActivity", function() { return recentActivity; });
/* harmony import */ var _components_activity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../components/activity */ "./src/components/activity.ts");
/* harmony import */ var _navigation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../navigation */ "./src/navigation.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../util */ "./src/util.ts");



const ACTIVITY_STORAGE_NAME = 'activity';
let activity = Object(_util__WEBPACK_IMPORTED_MODULE_2__["localStorageRead"])(ACTIVITY_STORAGE_NAME) || [];
function addActivity(type, assignment, date, newActivity, className) {
    if (Object(_navigation__WEBPACK_IMPORTED_MODULE_1__["getCalDateOffset"])() !== 0)
        return; // Ignore activity when on another month
    if (newActivity)
        activity.push([type, assignment, Date.now(), className]);
    const el = Object(_components_activity__WEBPACK_IMPORTED_MODULE_0__["createActivity"])(type, assignment, date, className);
    Object(_components_activity__WEBPACK_IMPORTED_MODULE_0__["addActivityElement"])(el);
}
function saveActivity() {
    activity = activity.slice(activity.length - 128, activity.length);
    Object(_util__WEBPACK_IMPORTED_MODULE_2__["localStorageWrite"])(ACTIVITY_STORAGE_NAME, activity);
}
function recentActivity() {
    return activity.slice(activity.length - 32, activity.length);
}


/***/ }),

/***/ "./src/plugins/athena.ts":
/*!*******************************!*\
  !*** ./src/plugins/athena.ts ***!
  \*******************************/
/*! exports provided: getAthenaData, updateAthenaData */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getAthenaData", function() { return getAthenaData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "updateAthenaData", function() { return updateAthenaData; });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util */ "./src/util.ts");

const ATHENA_STORAGE_NAME = 'athenaData';
let athenaData = Object(_util__WEBPACK_IMPORTED_MODULE_0__["localStorageRead"])(ATHENA_STORAGE_NAME);
function getAthenaData() {
    return athenaData;
}
function formatLogo(logo) {
    return logo.substr(0, logo.indexOf('" alt="'))
        .replace('<div class="profile-picture"><img src="', '')
        .replace('tiny', 'reg');
}
// Now, there's the schoology/athena integration stuff. First, we need to check if it's been more
// than a day. There's no point constantly retrieving classes from Athena; they dont't change that
// much.
// Then, once the variable for the last date is initialized, it's time to get the classes from
// athena. Luckily, there's this file at /iapi/course/active - and it's in JSON! Life can't be any
// better! Seriously! It's just too bad the login page isn't in JSON.
function parseAthenaData(dat) {
    if (dat === '')
        return null;
    const d = JSON.parse(dat);
    const athenaData2 = {};
    const allCourseDetails = {};
    d.body.courses.sections.forEach((section) => {
        allCourseDetails[section.course_nid] = section;
    });
    d.body.courses.courses.reverse().forEach((course) => {
        const courseDetails = allCourseDetails[course.nid];
        athenaData2[course.course_title] = {
            link: `https://athena.harker.org${courseDetails.link}`,
            logo: formatLogo(courseDetails.logo),
            period: courseDetails.section_title
        };
    });
    return athenaData2;
}
function updateAthenaData(data) {
    const refreshEl = document.getElementById('athenaDataRefresh');
    try {
        athenaData = parseAthenaData(data);
        Object(_util__WEBPACK_IMPORTED_MODULE_0__["localStorageWrite"])(ATHENA_STORAGE_NAME, athenaData);
        Object(_util__WEBPACK_IMPORTED_MODULE_0__["elemById"])('athenaDataError').style.display = 'none';
        if (refreshEl)
            refreshEl.style.display = 'block';
    }
    catch (e) {
        Object(_util__WEBPACK_IMPORTED_MODULE_0__["elemById"])('athenaDataError').style.display = 'block';
        if (refreshEl)
            refreshEl.style.display = 'none';
        Object(_util__WEBPACK_IMPORTED_MODULE_0__["elemById"])('athenaDataError').innerHTML = e.message;
    }
}


/***/ }),

/***/ "./src/plugins/customAssignments.ts":
/*!******************************************!*\
  !*** ./src/plugins/customAssignments.ts ***!
  \******************************************/
/*! exports provided: getExtra, saveExtra, addToExtra, removeFromExtra, extraToTask, parseCustomTask */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getExtra", function() { return getExtra; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "saveExtra", function() { return saveExtra; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addToExtra", function() { return addToExtra; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "removeFromExtra", function() { return removeFromExtra; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "extraToTask", function() { return extraToTask; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "parseCustomTask", function() { return parseCustomTask; });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util */ "./src/util.ts");

const CUSTOM_STORAGE_NAME = 'extra';
const extra = Object(_util__WEBPACK_IMPORTED_MODULE_0__["localStorageRead"])(CUSTOM_STORAGE_NAME, []);
function getExtra() {
    return extra;
}
function saveExtra() {
    Object(_util__WEBPACK_IMPORTED_MODULE_0__["localStorageWrite"])(CUSTOM_STORAGE_NAME, extra);
}
function addToExtra(custom) {
    extra.push(custom);
}
function removeFromExtra(custom) {
    if (!extra.includes(custom))
        throw new Error('Cannot remove custom assignment that does not exist');
    extra.splice(extra.indexOf(custom), 1);
}
function extraToTask(custom, data) {
    let cls = null;
    const className = custom.class;
    if (className != null) {
        cls = data.classes.findIndex((c) => c.toLowerCase().includes(className));
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
        class: cls === -1 ? null : cls
    };
}
function parseCustomTask(text, result = { text: '' }) {
    const parsed = text.match(/(.*) (for|by|due|assigned|starting|ending|beginning) (.*)/);
    if (parsed == null) {
        result.text = text;
        return result;
    }
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


/***/ }),

/***/ "./src/plugins/done.ts":
/*!*****************************!*\
  !*** ./src/plugins/done.ts ***!
  \*****************************/
/*! exports provided: removeFromDone, addToDone, saveDone, assignmentInDone */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "removeFromDone", function() { return removeFromDone; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addToDone", function() { return addToDone; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "saveDone", function() { return saveDone; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "assignmentInDone", function() { return assignmentInDone; });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util */ "./src/util.ts");

const DONE_STORAGE_NAME = 'done';
const done = Object(_util__WEBPACK_IMPORTED_MODULE_0__["localStorageRead"])(DONE_STORAGE_NAME, []);
function removeFromDone(id) {
    const index = done.indexOf(id);
    if (index >= 0)
        done.splice(index, 1);
}
function addToDone(id) {
    done.push(id);
}
function saveDone() {
    Object(_util__WEBPACK_IMPORTED_MODULE_0__["localStorageWrite"])(DONE_STORAGE_NAME, done);
}
function assignmentInDone(id) {
    return done.includes(id);
}


/***/ }),

/***/ "./src/plugins/modifiedAssignments.ts":
/*!********************************************!*\
  !*** ./src/plugins/modifiedAssignments.ts ***!
  \********************************************/
/*! exports provided: removeFromModified, saveModified, assignmentInModified, modifiedBody, setModified */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "removeFromModified", function() { return removeFromModified; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "saveModified", function() { return saveModified; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "assignmentInModified", function() { return assignmentInModified; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "modifiedBody", function() { return modifiedBody; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setModified", function() { return setModified; });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util */ "./src/util.ts");

const MODIFIED_STORAGE_NAME = 'modified';
const modified = Object(_util__WEBPACK_IMPORTED_MODULE_0__["localStorageRead"])(MODIFIED_STORAGE_NAME, {});
function removeFromModified(id) {
    delete modified[id];
}
function saveModified() {
    Object(_util__WEBPACK_IMPORTED_MODULE_0__["localStorageWrite"])(MODIFIED_STORAGE_NAME, modified);
}
function assignmentInModified(id) {
    return modified.hasOwnProperty(id);
}
function modifiedBody(id) {
    return modified[id];
}
function setModified(id, body) {
    modified[id] = body;
}


/***/ }),

/***/ "./src/settings.ts":
/*!*************************!*\
  !*** ./src/settings.ts ***!
  \*************************/
/*! exports provided: settings, getSetting, setSetting */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "settings", function() { return settings; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getSetting", function() { return getSetting; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setSetting", function() { return setSetting; });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util */ "./src/util.ts");

const settings = {
    /**
     * Minutes between each automatic refresh of the page. Negative numbers indicate no automatic
     * refreshing.
     */
    get refreshRate() { return Object(_util__WEBPACK_IMPORTED_MODULE_0__["localStorageRead"])('refreshRate', -1); },
    set refreshRate(v) { Object(_util__WEBPACK_IMPORTED_MODULE_0__["localStorageWrite"])('refreshRate', v); },
    /**
     * Whether the window should refresh assignment data when focussed
     */
    get refreshOnFocus() { return Object(_util__WEBPACK_IMPORTED_MODULE_0__["localStorageRead"])('refreshOnFocus', true); },
    set refreshOnFocus(v) { Object(_util__WEBPACK_IMPORTED_MODULE_0__["localStorageWrite"])('refreshOnFocus', v); },
    /**
     * Whether switching between views should be animated
     */
    get viewTrans() { return Object(_util__WEBPACK_IMPORTED_MODULE_0__["localStorageRead"])('viewTrans', true); },
    set viewTrans(v) { Object(_util__WEBPACK_IMPORTED_MODULE_0__["localStorageWrite"])('viewTrans', v); },
    /**
     * Number of days early to show tests in list view
     */
    get earlyTest() { return Object(_util__WEBPACK_IMPORTED_MODULE_0__["localStorageRead"])('earlyTest', 1); },
    set earlyTest(v) { Object(_util__WEBPACK_IMPORTED_MODULE_0__["localStorageWrite"])('earlyTest', v); },
    /**
     * Whether to take tasks off the calendar view and show them in the info pane
     */
    get sepTasks() { return Object(_util__WEBPACK_IMPORTED_MODULE_0__["localStorageRead"])('sepTasks', false); },
    set sepTasks(v) { Object(_util__WEBPACK_IMPORTED_MODULE_0__["localStorageWrite"])('sepTasks', v); },
    /**
     * Whether tasks should have their own color
     */
    get sepTaskClass() { return Object(_util__WEBPACK_IMPORTED_MODULE_0__["localStorageRead"])('sepTaskClass', false); },
    set sepTaskClass(v) { Object(_util__WEBPACK_IMPORTED_MODULE_0__["localStorageWrite"])('sepTaskClass', v); },
    /**
     * Whether projects show up in the test page
     */
    get projectsInTestPane() { return Object(_util__WEBPACK_IMPORTED_MODULE_0__["localStorageRead"])('projectsInTestPane', false); },
    set projectsInTestPane(v) { Object(_util__WEBPACK_IMPORTED_MODULE_0__["localStorageWrite"])('projectsInTestPane', v); },
    /**
     * When assignments should be shown on calendar view
     */
    get assignmentSpan() { return Object(_util__WEBPACK_IMPORTED_MODULE_0__["localStorageRead"])('assignmentSpan', 'multiple'); },
    set assignmentSpan(v) { Object(_util__WEBPACK_IMPORTED_MODULE_0__["localStorageWrite"])('assignmentSpan', v); },
    /**
     * When assignments should disappear from list view
     */
    get hideAssignments() { return Object(_util__WEBPACK_IMPORTED_MODULE_0__["localStorageRead"])('hideAssignments', 'day'); },
    set hideAssignments(v) { Object(_util__WEBPACK_IMPORTED_MODULE_0__["localStorageWrite"])('hideAssignments', v); },
    /**
     * Whether to use holiday theming
     */
    get holidayThemes() { return Object(_util__WEBPACK_IMPORTED_MODULE_0__["localStorageRead"])('holidayThemes', false); },
    set holidayThemes(v) { Object(_util__WEBPACK_IMPORTED_MODULE_0__["localStorageWrite"])('holidayThemes', v); },
    /**
     * Whether to color assignments based on their type or class
     */
    get colorType() { return Object(_util__WEBPACK_IMPORTED_MODULE_0__["localStorageRead"])('colorType', 'assignment'); },
    set colorType(v) { Object(_util__WEBPACK_IMPORTED_MODULE_0__["localStorageWrite"])('colorType', v); },
    /**
     * Which types of activity are shown in the activity pane
     */
    get shownActivity() {
        return Object(_util__WEBPACK_IMPORTED_MODULE_0__["localStorageRead"])('shownActivity', {
            add: true,
            edit: true,
            delete: true
        });
    },
    set shownActivity(v) { Object(_util__WEBPACK_IMPORTED_MODULE_0__["localStorageWrite"])('shownActivity', v); },
    /**
     * Whether to display tasks in the task pane that are completed
     */
    get showDoneTasks() { return Object(_util__WEBPACK_IMPORTED_MODULE_0__["localStorageRead"])('showDoneTasks', false); },
    set showDoneTasks(v) { Object(_util__WEBPACK_IMPORTED_MODULE_0__["localStorageWrite"])('showDoneTasks', v); }
};
function getSetting(name) {
    if (!settings.hasOwnProperty(name))
        throw new Error(`Invalid setting name ${name}`);
    // @ts-ignore
    return settings[name];
}
function setSetting(name, value) {
    if (!settings.hasOwnProperty(name))
        throw new Error(`Invalid setting name ${name}`);
    // @ts-ignore
    settings[name] = value;
}


/***/ }),

/***/ "./src/util.ts":
/*!*********************!*\
  !*** ./src/util.ts ***!
  \*********************/
/*! exports provided: forceLayout, capitalizeString, send, elemById, element, _$, _$h, localStorageRead, localStorageWrite, requestIdleCallback, dateString, monthString, smoothScroll, ripple, cssNumber, animateEl */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "forceLayout", function() { return forceLayout; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "capitalizeString", function() { return capitalizeString; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "send", function() { return send; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "elemById", function() { return elemById; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "element", function() { return element; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "_$", function() { return _$; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "_$h", function() { return _$h; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "localStorageRead", function() { return localStorageRead; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "localStorageWrite", function() { return localStorageWrite; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "requestIdleCallback", function() { return requestIdleCallback; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "dateString", function() { return dateString; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "monthString", function() { return monthString; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "smoothScroll", function() { return smoothScroll; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ripple", function() { return ripple; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "cssNumber", function() { return cssNumber; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "animateEl", function() { return animateEl; });
/* harmony import */ var _dates__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dates */ "./src/dates.ts");

// @ts-ignore TODO: Make this less hacky
NodeList.prototype.forEach = HTMLCollection.prototype.forEach = Array.prototype.forEach;
/**
 * Forces a layout on an element
 */
function forceLayout(el) {
    // This involves a little trickery in that by requesting the computed height of the element the
    // browser is forced to do a full layout
    // tslint:disable-next-line no-unused-expression
    el.offsetHeight;
}
/**
 * Return a string with the first letter capitalized
 */
function capitalizeString(str) {
    return str.charAt(0).toUpperCase() + str.substr(1);
}
/**
 * Returns an XMLHttpRequest with the specified url, response type, headers, and data
 */
function constructXMLHttpRequest(url, respType, headers, data) {
    const req = new XMLHttpRequest();
    // If POST data is provided send a POST request, otherwise send a GET request
    req.open((data ? 'POST' : 'GET'), url, true);
    if (respType)
        req.responseType = respType;
    if (headers) {
        Object.keys(headers).forEach((header) => {
            req.setRequestHeader(header, headers[header]);
        });
    }
    // If data is undefined default to the normal req.send(), otherwise pass the data in
    req.send(data);
    return req;
}
/** Sends a request to a server and returns a Promise.
 * @param url the url to retrieve
 * @param respType the type of response that should be received
 * @param headers the headers that will be sent to the server
 * @param data the data that will be sent to the server (only for POST requests)
 * @param progressElement an optional element for the progress bar used to display the status of the request
 */
function send(url, respType, headers, data, progress) {
    const req = constructXMLHttpRequest(url, respType, headers, data);
    return new Promise((resolve, reject) => {
        const progressInner = progress ? progress.querySelector('div') : null;
        if (progress && progressInner) {
            forceLayout(progressInner); // Wait for it to render
            progress.classList.add('active'); // Display the progress bar
            if (progressInner.classList.contains('determinate')) {
                progressInner.classList.remove('determinate');
                progressInner.classList.add('indeterminate');
            }
        }
        // Sometimes the browser won't give the total bytes in the response, so use past results or
        // a default of 170,000 bytes if the browser doesn't provide the number
        const load = localStorageRead('load', 170000);
        let computedLoad = 0;
        req.addEventListener('load', (evt) => {
            // Cache the number of bytes loaded so it can be used for better estimates later on
            localStorageWrite('load', computedLoad);
            if (progress)
                progress.classList.remove('active');
            // Resolve with the request
            if (req.status === 200) {
                resolve(req);
            }
            else {
                reject(Error(req.statusText));
            }
        });
        req.addEventListener('error', () => {
            if (progress)
                progress.classList.remove('active');
            reject(Error('Network Error'));
        });
        if (progress && progressInner) {
            req.addEventListener('progress', (evt) => {
                // Update the progress bar
                if (progressInner.classList.contains('indeterminate')) {
                    progressInner.classList.remove('indeterminate');
                    progressInner.classList.add('determinate');
                }
                computedLoad = evt.loaded;
                progressInner.style.width = ((100 * evt.loaded) / (evt.lengthComputable ? evt.total : load)) + '%';
            });
        }
    });
}
/**
 * The equivalent of document.getElementById but throws an error if the element is not defined
 */
function elemById(id) {
    const el = document.getElementById(id);
    if (el == null)
        throw new Error(`Could not find element with id ${id}`);
    return el;
}
/**
 * A little helper function to simplify the creation of HTML elements
 */
function element(tag, cls, html, id) {
    const e = document.createElement(tag);
    if (typeof cls === 'string') {
        e.classList.add(cls);
    }
    else {
        cls.forEach((c) => e.classList.add(c));
    }
    if (html)
        e.innerHTML = html;
    if (id)
        e.setAttribute('id', id);
    return e;
}
/**
 * Throws an error if the supplied argument is null, otherwise returns the argument
 */
function _$(arg) {
    if (arg == null)
        throw new Error('Expected argument to be non-null');
    return arg;
}
function _$h(arg) {
    if (arg == null)
        throw new Error('Expected node to be non-null');
    if (!(arg instanceof HTMLElement))
        throw new Error('Node is not an HTML element');
    return arg;
}
function localStorageRead(name, defaultVal) {
    try {
        return JSON.parse(localStorage[name]);
    }
    catch (e) {
        return typeof defaultVal === 'function' ? defaultVal() : defaultVal;
    }
}
function localStorageWrite(name, item) {
    localStorage[name] = JSON.stringify(item);
}
// Because the requestIdleCallback function is very new (as of writing only works with Chrome
// version 47), the below function polyfills that method.
function requestIdleCallback(cb, opts) {
    if ('requestIdleCallback' in window) {
        return window.requestIdleCallback(cb, opts);
    }
    const start = Date.now();
    return setTimeout(() => cb({
        didTimeout: false,
        timeRemaining() {
            return Math.max(0, 50 - (Date.now() - start));
        }
    }), 1);
}
/**
 * Determine if the two dates have the same year, month, and day
 */
function datesEqual(a, b) {
    return Object(_dates__WEBPACK_IMPORTED_MODULE_0__["toDateNum"])(a) === Object(_dates__WEBPACK_IMPORTED_MODULE_0__["toDateNum"])(b);
}
const DATE_RELATIVENAMES = {
    'Tomorrow': 1,
    'Today': 0,
    'Yesterday': -1,
    '2 days ago': -2
};
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const FULLMONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October',
    'November', 'December'];
function dateString(date, addThis = false) {
    if (date === 'Forever')
        return date;
    if (typeof date === 'number')
        return dateString(Object(_dates__WEBPACK_IMPORTED_MODULE_0__["fromDateNum"])(date), addThis);
    const relativeMatch = Object.keys(DATE_RELATIVENAMES).find((name) => {
        const dayAt = new Date();
        dayAt.setDate(dayAt.getDate() + DATE_RELATIVENAMES[name]);
        return datesEqual(dayAt, date);
    });
    if (relativeMatch)
        return relativeMatch;
    const daysAhead = (date.getTime() - Date.now()) / 1000 / 3600 / 24;
    // If the date is within 6 days of today, only display the day of the week
    if (0 < daysAhead && daysAhead <= 6) {
        return (addThis ? 'This ' : '') + WEEKDAYS[date.getDay()];
    }
    return `${WEEKDAYS[date.getDay()]}, ${FULLMONTHS[date.getMonth()]} ${date.getDate()}`;
}
function monthString(date) {
    if (typeof date === 'number')
        return monthString(Object(_dates__WEBPACK_IMPORTED_MODULE_0__["fromDateNum"])(date));
    const today = new Date();
    if (today.getFullYear() === date.getFullYear()) {
        if (today.getMonth() === date.getMonth())
            return 'This Month';
        if (today.getMonth() + 1 === date.getMonth())
            return 'Next Month';
        if (today.getMonth() - 1 === date.getMonth())
            return 'Last Month';
        return FULLMONTHS[date.getMonth()];
    }
    return FULLMONTHS[date.getMonth()] + ' ' + date.getFullYear();
}
// The one below scrolls smoothly to a y position.
function smoothScroll(to) {
    return new Promise((resolve, reject) => {
        let start = null;
        const from = document.body.scrollTop;
        const amount = to - from;
        const step = (timestamp) => {
            if (start == null) {
                start = timestamp;
            }
            const progress = timestamp - start;
            window.scrollTo(0, from + (amount * (progress / 350)));
            if (progress < 350) {
                return requestAnimationFrame(step);
            }
            else {
                _$(document.querySelector('nav')).classList.remove('headroom--unpinned');
                resolve();
            }
        };
        requestAnimationFrame(step);
    });
}
// And a function to apply an ink effect
function ripple(el) {
    el.addEventListener('mousedown', (evt) => {
        if (evt.which !== 1)
            return; // Not left button
        const wave = element('span', 'wave');
        const size = Math.max(Number(el.offsetWidth), Number(el.offsetHeight));
        wave.style.width = (wave.style.height = size + 'px');
        let x = evt.clientX;
        let y = evt.clientY;
        const rect = el.getBoundingClientRect();
        x -= rect.left;
        y -= rect.top;
        wave.style.top = (y - (size / 2)) + 'px';
        wave.style.left = (x - (size / 2)) + 'px';
        el.appendChild(wave);
        wave.setAttribute('data-hold', String(Date.now()));
        forceLayout(wave);
        wave.style.transform = 'scale(2.5)';
    });
    el.addEventListener('mouseup', (evt) => {
        if (evt.which !== 1)
            return; // Only for left button
        const waves = el.getElementsByClassName('wave');
        waves.forEach((wave) => {
            const diff = Date.now() - Number(wave.getAttribute('data-hold'));
            const delay = Math.max(350 - diff, 0);
            setTimeout(() => {
                wave.style.opacity = '0';
                setTimeout(() => {
                    wave.remove();
                }, 550);
            }, delay);
        });
    });
}
function cssNumber(css) {
    if (!css)
        return 0;
    return parseInt(css, 10);
}
// For ease of animations, a function that returns a promise is defined.
function animateEl(el, keyframes, options) {
    return new Promise((resolve, reject) => {
        const player = el.animate(keyframes, options);
        player.onfinish = (e) => resolve(e);
    });
}


/***/ }),

/***/ "./src/welcome.ts":
/*!************************!*\
  !*** ./src/welcome.ts ***!
  \************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _pcr__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pcr */ "./src/pcr.ts");
/* harmony import */ var _plugins_athena__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./plugins/athena */ "./src/plugins/athena.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./util */ "./src/util.ts");



// Welcome to the welcome file.
//
// This script runs on the welcome page, which welcomes new users, to make it more welcoming. If you
// haven't already, I welcome you to view the more important [main script](client.litcoffee).
//
// Also, if you haven't noticed yet, I'm trying my best to use the word welcome as many times as I
// can just to welcome you.
//
// First off, the buttons big, green, welcoming buttons on the bottom of the welcome page are
// assigned event listeners so that they can make the page show more welcoming information.
function advance() {
    // The box holding the individual pages that ge scrolled
    // when pressing the 'next' button is assigned to a varialbe.
    const container = document.body;
    // show the next page
    const view = Number(container.getAttribute('data-view'));
    window.scrollTo(0, 0); // Scoll to top of the page
    history.pushState({ page: view + 1 }, '', `?page=${view}`); // Make the broswer register a page shift
    const npage = Object(_util__WEBPACK_IMPORTED_MODULE_2__["_$h"])(document.querySelector(`section:nth-child(${view + 2})`));
    npage.style.display = 'inline-block';
    npage.style.transform = npage.style.webkitTransform = `translateX(${view * 100}%)`;
    // increase the data-view attribute by 1. The rest is handled by the css.
    container.setAttribute('data-view', String(view + 1));
    setTimeout(() => {
        // After animating is done, don't display the first page
        npage.style.transform = npage.style.webkitTransform = `translateX(${view + 1}00%)`;
        Object(_util__WEBPACK_IMPORTED_MODULE_2__["_$h"])(document.querySelector(`section:nth-child(${view + 1})`)).style.display = 'none';
    }, 50);
}
document.querySelectorAll('.next').forEach((nextButton) => {
    if (!(nextButton instanceof HTMLAnchorElement))
        return;
    if (nextButton.href)
        return;
    nextButton.addEventListener('click', advance);
});
// Additionally, the active class needs to be added when text fields are selected (for the login
// box) [copied from main script].
document.querySelectorAll('input[type=text], input[type=password], input[type=email], input[type=url], '
    + 'input[type=tel], input[type=number], input[type=search]')
    .forEach((input) => {
    input.addEventListener('change', (evt) => Object(_util__WEBPACK_IMPORTED_MODULE_2__["_$h"])(Object(_util__WEBPACK_IMPORTED_MODULE_2__["_$h"])(input.parentNode).querySelector('label')).classList.add('active'));
    input.addEventListener('focus', (evt) => Object(_util__WEBPACK_IMPORTED_MODULE_2__["_$h"])(Object(_util__WEBPACK_IMPORTED_MODULE_2__["_$h"])(input.parentNode).querySelector('label')).classList.add('active'));
    input.addEventListener('blur', (evt) => {
        if (input.value.length === 0) {
            Object(_util__WEBPACK_IMPORTED_MODULE_2__["_$h"])(Object(_util__WEBPACK_IMPORTED_MODULE_2__["_$h"])(input.parentNode).querySelector('label')).classList.remove('active');
        }
    });
});
// An event listener is attached to the window so that when the back button is pressed, a more
// welcoming page is displayed. Most of the code is the same from next button event listener, except
// that the page is switched the previous one, not the next one.
window.onpopstate = (event) => {
    const container = document.body;
    const view = (event.state != null) ? event.state.page : 0;
    window.scrollTo(0, 0); // Scoll to top of the page
    const npage = Object(_util__WEBPACK_IMPORTED_MODULE_2__["_$h"])(document.querySelector(`section:nth-child(${view + 1})`));
    npage.style.display = 'inline-block';
    npage.style.transform = npage.style.webkitTransform = `translateX(${view * 100}%)`;
    // increase the data-view attribute by 1. The rest is handled by the css.
    container.setAttribute('data-view', view);
    setTimeout(() => {
        // After animating is done, don't display the first page
        npage.style.transform = npage.style.webkitTransform = `translateX(${view}00%)`;
        Object(_util__WEBPACK_IMPORTED_MODULE_2__["_$h"])(document.querySelector(`section:nth-child(${view + 2})`)).style.display = 'none';
    }, 50);
};
// The text box also needs to execute this function when anything is typed / pasted.
const athenaDataEl = Object(_util__WEBPACK_IMPORTED_MODULE_2__["elemById"])('athenaData');
athenaDataEl.addEventListener('input', () => Object(_plugins_athena__WEBPACK_IMPORTED_MODULE_1__["updateAthenaData"])(athenaDataEl.value));
Object(_pcr__WEBPACK_IMPORTED_MODULE_0__["fetch"])(true, undefined, () => {
    Object(_util__WEBPACK_IMPORTED_MODULE_2__["elemById"])('loginNext').style.display = '';
    Object(_util__WEBPACK_IMPORTED_MODULE_2__["elemById"])('login').classList.add('done');
}, () => {
    Object(_util__WEBPACK_IMPORTED_MODULE_2__["elemById"])('login').classList.add('ready');
    Object(_util__WEBPACK_IMPORTED_MODULE_2__["elemById"])('login').addEventListener('submit', (evt) => {
        evt.preventDefault();
        Object(_pcr__WEBPACK_IMPORTED_MODULE_0__["dologin"])(null, true, advance);
    });
});
function closeError() {
    Object(_util__WEBPACK_IMPORTED_MODULE_2__["elemById"])('error').classList.remove('active');
    setTimeout(() => {
        Object(_util__WEBPACK_IMPORTED_MODULE_2__["elemById"])('errorBackground').style.display = 'none';
    }, 350);
}
Object(_util__WEBPACK_IMPORTED_MODULE_2__["elemById"])('errorNo').addEventListener('click', closeError);
Object(_util__WEBPACK_IMPORTED_MODULE_2__["elemById"])('errorBackground').addEventListener('click', closeError);


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9hY3Rpdml0eS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9hc3NpZ25tZW50LnRzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2F2YXRhci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9jYWxlbmRhci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9lcnJvckRpc3BsYXkudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvcmVzaXplci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9zbmFja2Jhci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29va2llcy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZGF0ZXMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Rpc3BsYXkudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL25hdmlnYXRpb24udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Bjci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2lucy9hY3Rpdml0eS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2lucy9hdGhlbmEudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BsdWdpbnMvY3VzdG9tQXNzaWdubWVudHMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BsdWdpbnMvZG9uZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2lucy9tb2RpZmllZEFzc2lnbm1lbnRzLnRzIiwid2VicGFjazovLy8uL3NyYy9zZXR0aW5ncy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvd2VsY29tZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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c291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL3dlbGNvbWUudHNcIik7XG4iLCJpbXBvcnQgeyBlbGVtQnlJZCwgZWxlbWVudCwgbG9jYWxTdG9yYWdlUmVhZCwgbG9jYWxTdG9yYWdlV3JpdGUsIHNlbmQgfSBmcm9tICcuL3V0aWwnXG5cbmV4cG9ydCBjb25zdCBWRVJTSU9OID0gJzIuMjQuMydcblxuY29uc3QgVkVSU0lPTl9VUkwgPSAnaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tLzE5UnlhbkEvQ2hlY2tQQ1IvbWFzdGVyL3ZlcnNpb24udHh0J1xuY29uc3QgQ09NTUlUX1VSTCA9IChsb2NhdGlvbi5wcm90b2NvbCA9PT0gJ2Nocm9tZS1leHRlbnNpb246JyA/XG4gICAgJ2h0dHBzOi8vYXBpLmdpdGh1Yi5jb20vcmVwb3MvMTlSeWFuQS9DaGVja1BDUi9naXQvcmVmcy9oZWFkcy9tYXN0ZXInIDogJy9hcGkvY29tbWl0JylcbmNvbnN0IE5FV1NfVVJMID0gJ2h0dHBzOi8vYXBpLmdpdGh1Yi5jb20vZ2lzdHMvMjFiZjExYTQyOWRhMjU3NTM5YTY4NTIwZjUxM2EzOGInXG5cbmZ1bmN0aW9uIGZvcm1hdENvbW1pdE1lc3NhZ2UobWVzc2FnZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gbWVzc2FnZS5zdWJzdHIobWVzc2FnZS5pbmRleE9mKCdcXG5cXG4nKSArIDIpXG4gICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFwqICguKj8pKD89JHxcXG4pL2csIChhLCBiKSA9PiBgPGxpPiR7Yn08L2xpPmApXG4gICAgICAgICAgICAgICAgICAucmVwbGFjZSgvPlxcbjwvZywgJz48JylcbiAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXG4vZywgJzxicj4nKVxufVxuXG4vLyBGb3IgdXBkYXRpbmcsIGEgcmVxdWVzdCB3aWxsIGJlIHNlbmQgdG8gR2l0aHViIHRvIGdldCB0aGUgY3VycmVudCBjb21taXQgaWQgYW5kIGNoZWNrIHRoYXQgYWdhaW5zdCB3aGF0J3Mgc3RvcmVkXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY2hlY2tDb21taXQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmVzcCA9IGF3YWl0IHNlbmQoVkVSU0lPTl9VUkwsICd0ZXh0JylcbiAgICAgICAgY29uc3QgYyA9IHJlc3AucmVzcG9uc2VUZXh0LnRyaW0oKVxuICAgICAgICBjb25zb2xlLmxvZyhgQ3VycmVudCB2ZXJzaW9uOiAke2N9ICR7VkVSU0lPTiA9PT0gYyA/ICcobm8gdXBkYXRlIGF2YWlsYWJsZSknIDogJyh1cGRhdGUgYXZhaWxhYmxlKSd9YClcbiAgICAgICAgZWxlbUJ5SWQoJ25ld3ZlcnNpb24nKS5pbm5lckhUTUwgPSBjXG4gICAgICAgIGlmIChWRVJTSU9OICE9PSBjKSB7XG4gICAgICAgICAgICBlbGVtQnlJZCgndXBkYXRlSWdub3JlJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGxvY2F0aW9uLnByb3RvY29sID09PSAnY2hyb21lLWV4dGVuc2lvbjonKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1CeUlkKCd1cGRhdGUnKS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1CeUlkKCd1cGRhdGVCYWNrZ3JvdW5kJykuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuICAgICAgICAgICAgICAgICAgICB9LCAzNTApXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGNvbnN0IHJlc3AyID0gYXdhaXQgc2VuZChDT01NSVRfVVJMLCAnanNvbicpXG4gICAgICAgICAgICBjb25zdCB7IHNoYSwgdXJsIH0gPSByZXNwMi5yZXNwb25zZS5vYmplY3RcbiAgICAgICAgICAgIGNvbnN0IHJlc3AzID0gYXdhaXQgc2VuZCgobG9jYXRpb24ucHJvdG9jb2wgPT09ICdjaHJvbWUtZXh0ZW5zaW9uOicgPyB1cmwgOiBgL2FwaS9jb21taXQvJHtzaGF9YCksICdqc29uJylcbiAgICAgICAgICAgIGVsZW1CeUlkKCdwYXN0VXBkYXRlVmVyc2lvbicpLmlubmVySFRNTCA9IFZFUlNJT05cbiAgICAgICAgICAgIGVsZW1CeUlkKCduZXdVcGRhdGVWZXJzaW9uJykuaW5uZXJIVE1MID0gY1xuICAgICAgICAgICAgZWxlbUJ5SWQoJ3VwZGF0ZUZlYXR1cmVzJykuaW5uZXJIVE1MID0gZm9ybWF0Q29tbWl0TWVzc2FnZShyZXNwMy5yZXNwb25zZS5tZXNzYWdlKVxuICAgICAgICAgICAgZWxlbUJ5SWQoJ3VwZGF0ZUJhY2tncm91bmQnKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xuICAgICAgICAgICAgZWxlbUJ5SWQoJ3VwZGF0ZScpLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ0NvdWxkIG5vdCBhY2Nlc3MgR2l0aHViLiBIZXJlXFwncyB0aGUgZXJyb3I6JywgZXJyKVxuICAgIH1cbn1cblxubGV0IG5ld3NVcmw6IHN0cmluZ3xudWxsID0gbnVsbFxubGV0IG5ld3NDb21taXQ6IHN0cmluZ3xudWxsID0gbnVsbFxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmV0Y2hOZXdzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJlc3AgPSBhd2FpdCBzZW5kKE5FV1NfVVJMLCAnanNvbicpXG4gICAgICAgIGxldCBsYXN0ID0gbG9jYWxTdG9yYWdlUmVhZCgnbmV3c0NvbW1pdCcpXG4gICAgICAgIG5ld3NDb21taXQgPSByZXNwLnJlc3BvbnNlLmhpc3RvcnlbMF0udmVyc2lvblxuXG4gICAgICAgIGlmIChsYXN0ID09IG51bGwpIHtcbiAgICAgICAgICAgIGxhc3QgPSBuZXdzQ29tbWl0XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2VXcml0ZSgnbmV3c0NvbW1pdCcsIG5ld3NDb21taXQpXG4gICAgICAgIH1cblxuICAgICAgICBuZXdzVXJsID0gcmVzcC5yZXNwb25zZS5maWxlc1sndXBkYXRlcy5odG0nXS5yYXdfdXJsXG5cbiAgICAgICAgaWYgKGxhc3QgIT09IG5ld3NDb21taXQpIHtcbiAgICAgICAgICAgIGdldE5ld3MoKVxuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdDb3VsZCBub3QgYWNjZXNzIEdpdGh1Yi4gSGVyZVxcJ3MgdGhlIGVycm9yOicsIGVycilcbiAgICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXROZXdzKG9uZmFpbD86ICgpID0+IHZvaWQpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoIW5ld3NVcmwpIHtcbiAgICAgICAgaWYgKG9uZmFpbCkgb25mYWlsKClcbiAgICAgICAgcmV0dXJuXG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJlc3AgPSBhd2FpdCBzZW5kKG5ld3NVcmwpXG4gICAgICAgIGxvY2FsU3RvcmFnZS5uZXdzQ29tbWl0ID0gbmV3c0NvbW1pdFxuICAgICAgICByZXNwLnJlc3BvbnNlVGV4dC5zcGxpdCgnPGhyPicpLmZvckVhY2goKG5ld3MpID0+IHtcbiAgICAgICAgICAgIGVsZW1CeUlkKCduZXdzQ29udGVudCcpLmFwcGVuZENoaWxkKGVsZW1lbnQoJ2RpdicsICduZXdzSXRlbScsIG5ld3MpKVxuICAgICAgICB9KVxuICAgICAgICBlbGVtQnlJZCgnbmV3c0JhY2tncm91bmQnKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xuICAgICAgICBlbGVtQnlJZCgnbmV3cycpLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdDb3VsZCBub3QgYWNjZXNzIEdpdGh1Yi4gSGVyZVxcJ3MgdGhlIGVycm9yOicsIGVycilcbiAgICAgICAgaWYgKG9uZmFpbCkgb25mYWlsKClcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBjbGFzc0J5SWQsIGdldERhdGEsIElBc3NpZ25tZW50IH0gZnJvbSAnLi4vcGNyJ1xuaW1wb3J0IHsgQWN0aXZpdHlUeXBlIH0gZnJvbSAnLi4vcGx1Z2lucy9hY3Rpdml0eSdcbmltcG9ydCB7IGFzc2lnbm1lbnRJbkRvbmUgfSBmcm9tICcuLi9wbHVnaW5zL2RvbmUnXG5pbXBvcnQgeyBfJCwgZGF0ZVN0cmluZywgZWxlbUJ5SWQsIGVsZW1lbnQsIHNtb290aFNjcm9sbCB9IGZyb20gJy4uL3V0aWwnXG5pbXBvcnQgeyBzZXBhcmF0ZSB9IGZyb20gJy4vYXNzaWdubWVudCdcblxuZXhwb3J0IGZ1bmN0aW9uIGFkZEFjdGl2aXR5RWxlbWVudChlbDogSFRNTEVsZW1lbnQpOiB2b2lkIHtcbiAgICBjb25zdCBpbnNlcnRUbyA9IGVsZW1CeUlkKCdpbmZvQWN0aXZpdHknKVxuICAgIGluc2VydFRvLmluc2VydEJlZm9yZShlbCwgaW5zZXJ0VG8ucXVlcnlTZWxlY3RvcignLmFjdGl2aXR5JykpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVBY3Rpdml0eSh0eXBlOiBBY3Rpdml0eVR5cGUsIGFzc2lnbm1lbnQ6IElBc3NpZ25tZW50LCBkYXRlOiBEYXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT86IHN0cmluZyApOiBIVE1MRWxlbWVudCB7XG4gICAgY29uc3QgY25hbWUgPSBjbGFzc05hbWUgfHwgY2xhc3NCeUlkKGFzc2lnbm1lbnQuY2xhc3MpXG5cbiAgICBjb25zdCB0ZSA9IGVsZW1lbnQoJ2RpdicsIFsnYWN0aXZpdHknLCAnYXNzaWdubWVudEl0ZW0nLCBhc3NpZ25tZW50LmJhc2VUeXBlLCB0eXBlXSwgYFxuICAgICAgICA8aSBjbGFzcz0nbWF0ZXJpYWwtaWNvbnMnPiR7dHlwZX08L2k+XG4gICAgICAgIDxzcGFuIGNsYXNzPSd0aXRsZSc+JHthc3NpZ25tZW50LnRpdGxlfTwvc3Bhbj5cbiAgICAgICAgPHNtYWxsPiR7c2VwYXJhdGUoY25hbWUpWzJdfTwvc21hbGw+XG4gICAgICAgIDxkaXYgY2xhc3M9J3JhbmdlJz4ke2RhdGVTdHJpbmcoZGF0ZSl9PC9kaXY+YCwgYGFjdGl2aXR5JHthc3NpZ25tZW50LmlkfWApXG4gICAgdGUuc2V0QXR0cmlidXRlKCdkYXRhLWNsYXNzJywgY25hbWUpXG4gICAgY29uc3QgeyBpZCB9ID0gYXNzaWdubWVudFxuICAgIGlmICh0eXBlICE9PSAnZGVsZXRlJykge1xuICAgICAgICB0ZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGRvU2Nyb2xsaW5nID0gYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGVsID0gXyQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLmFzc2lnbm1lbnRbaWQqPVxcXCIke2lkfVxcXCJdYCkpIGFzIEhUTUxFbGVtZW50XG4gICAgICAgICAgICAgICAgYXdhaXQgc21vb3RoU2Nyb2xsKChlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgKyBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCkgLSAxMTYpXG4gICAgICAgICAgICAgICAgZWwuY2xpY2soKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGRvY3VtZW50LmJvZHkuZ2V0QXR0cmlidXRlKCdkYXRhLXZpZXcnKSA9PT0gJzAnKSB7XG4gICAgICAgICAgICByZXR1cm4gZG9TY3JvbGxpbmcoKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAoXyQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI25hdlRhYnM+bGk6Zmlyc3QtY2hpbGQnKSkgYXMgSFRNTEVsZW1lbnQpLmNsaWNrKClcbiAgICAgICAgICAgICAgICByZXR1cm4gc2V0VGltZW91dChkb1Njcm9sbGluZywgNTAwKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGlmIChhc3NpZ25tZW50SW5Eb25lKGFzc2lnbm1lbnQuaWQpKSB7XG4gICAgICB0ZS5jbGFzc0xpc3QuYWRkKCdkb25lJylcbiAgICB9XG4gICAgcmV0dXJuIHRlXG59XG4iLCJpbXBvcnQgeyBmcm9tRGF0ZU51bSwgdG9kYXkgfSBmcm9tICcuLi9kYXRlcydcbmltcG9ydCB7IGRpc3BsYXksIGdldFRpbWVBZnRlciwgSVNwbGl0QXNzaWdubWVudCB9IGZyb20gJy4uL2Rpc3BsYXknXG5pbXBvcnQgeyBnZXRMaXN0RGF0ZU9mZnNldCB9IGZyb20gJy4uL25hdmlnYXRpb24nXG5pbXBvcnQgeyBnZXRBdHRhY2htZW50TWltZVR5cGUsIElBcHBsaWNhdGlvbkRhdGEsIElBc3NpZ25tZW50LCB1cmxGb3JBdHRhY2htZW50IH0gZnJvbSAnLi4vcGNyJ1xuaW1wb3J0IHsgcmVjZW50QWN0aXZpdHkgfSBmcm9tICcuLi9wbHVnaW5zL2FjdGl2aXR5J1xuaW1wb3J0IHsgZ2V0QXRoZW5hRGF0YSB9IGZyb20gJy4uL3BsdWdpbnMvYXRoZW5hJ1xuaW1wb3J0IHsgcmVtb3ZlRnJvbUV4dHJhLCBzYXZlRXh0cmEgfSBmcm9tICcuLi9wbHVnaW5zL2N1c3RvbUFzc2lnbm1lbnRzJ1xuaW1wb3J0IHsgYWRkVG9Eb25lLCBhc3NpZ25tZW50SW5Eb25lLCByZW1vdmVGcm9tRG9uZSwgc2F2ZURvbmUgfSBmcm9tICcuLi9wbHVnaW5zL2RvbmUnXG5pbXBvcnQgeyBtb2RpZmllZEJvZHksIHJlbW92ZUZyb21Nb2RpZmllZCwgc2F2ZU1vZGlmaWVkLCBzZXRNb2RpZmllZCB9IGZyb20gJy4uL3BsdWdpbnMvbW9kaWZpZWRBc3NpZ25tZW50cydcbmltcG9ydCB7IHNldHRpbmdzIH0gZnJvbSAnLi4vc2V0dGluZ3MnXG5pbXBvcnQgeyBfJCwgY3NzTnVtYmVyLCBkYXRlU3RyaW5nLCBlbGVtQnlJZCwgZWxlbWVudCwgZm9yY2VMYXlvdXQsIHJpcHBsZSB9IGZyb20gJy4uL3V0aWwnXG5pbXBvcnQgeyByZXNpemUgfSBmcm9tICcuL3Jlc2l6ZXInXG5cbmNvbnN0IG1pbWVUeXBlczogeyBbbWltZTogc3RyaW5nXTogW3N0cmluZywgc3RyaW5nXSB9ID0ge1xuICAgICdhcHBsaWNhdGlvbi9tc3dvcmQnOiBbJ1dvcmQgRG9jJywgJ2RvY3VtZW50J10sXG4gICAgJ2FwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC53b3JkcHJvY2Vzc2luZ21sLmRvY3VtZW50JzogWydXb3JkIERvYycsICdkb2N1bWVudCddLFxuICAgICdhcHBsaWNhdGlvbi92bmQubXMtcG93ZXJwb2ludCc6IFsnUFBUIFByZXNlbnRhdGlvbicsICdzbGlkZXMnXSxcbiAgICAnYXBwbGljYXRpb24vcGRmJzogWydQREYgRmlsZScsICdwZGYnXSxcbiAgICAndGV4dC9wbGFpbic6IFsnVGV4dCBEb2MnLCAncGxhaW4nXVxufVxuXG5jb25zdCBkbXAgPSBuZXcgZGlmZl9tYXRjaF9wYXRjaCgpIC8vIEZvciBkaWZmaW5nXG5cbmZ1bmN0aW9uIHBvcHVsYXRlQWRkZWREZWxldGVkKGRpZmZzOiBhbnlbXSwgZWRpdHM6IEhUTUxFbGVtZW50KTogYm9vbGVhbiB7XG4gICAgbGV0IGFkZGVkID0gMFxuICAgIGxldCBkZWxldGVkID0gMFxuICAgIGRpZmZzLmZvckVhY2goKGRpZmYpID0+IHtcbiAgICAgICAgaWYgKGRpZmZbMF0gPT09IDEpIHsgYWRkZWQrKyB9XG4gICAgICAgIGlmIChkaWZmWzBdID09PSAtMSkgeyBkZWxldGVkKysgfVxuICAgIH0pXG4gICAgXyQoZWRpdHMucXVlcnlTZWxlY3RvcignLmFkZGl0aW9ucycpKS5pbm5lckhUTUwgPSBhZGRlZCAhPT0gMCA/IGArJHthZGRlZH1gIDogJydcbiAgICBfJChlZGl0cy5xdWVyeVNlbGVjdG9yKCcuZGVsZXRpb25zJykpLmlubmVySFRNTCA9IGRlbGV0ZWQgIT09IDAgPyBgLSR7ZGVsZXRlZH1gIDogJydcbiAgICBlZGl0cy5jbGFzc0xpc3QuYWRkKCdub3RFbXB0eScpXG4gICAgcmV0dXJuIGFkZGVkID4gMCB8fCBkZWxldGVkID4gMFxufVxuXG5leHBvcnQgZnVuY3Rpb24gY29tcHV0ZVdlZWtJZChzcGxpdDogSVNwbGl0QXNzaWdubWVudCk6IHN0cmluZyB7XG4gICAgY29uc3Qgc3RhcnRTdW4gPSBuZXcgRGF0ZShzcGxpdC5zdGFydC5nZXRUaW1lKCkpXG4gICAgc3RhcnRTdW4uc2V0RGF0ZShzdGFydFN1bi5nZXREYXRlKCkgLSBzdGFydFN1bi5nZXREYXkoKSlcbiAgICByZXR1cm4gYHdrJHtzdGFydFN1bi5nZXRNb250aCgpfS0ke3N0YXJ0U3VuLmdldERhdGUoKX1gXG59XG5cbi8vIFRoaXMgZnVuY3Rpb24gc2VwYXJhdGVzIHRoZSBwYXJ0cyBvZiBhIGNsYXNzIG5hbWUuXG5leHBvcnQgZnVuY3Rpb24gc2VwYXJhdGUoY2w6IHN0cmluZyk6IFJlZ0V4cE1hdGNoQXJyYXkge1xuICAgIGNvbnN0IG0gPSBjbC5tYXRjaCgvKCg/OlxcZCpcXHMrKT8oPzooPzpob25cXHcqfCg/OmFkdlxcdypcXHMqKT9jb3JlKVxccyspPykoLiopL2kpXG4gICAgaWYgKG0gPT0gbnVsbCkgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3Qgc2VwYXJhdGUgY2xhc3Mgc3RyaW5nICR7Y2x9YClcbiAgICByZXR1cm4gbVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYXNzaWdubWVudENsYXNzKGFzc2lnbm1lbnQ6IElBc3NpZ25tZW50LCBkYXRhOiBJQXBwbGljYXRpb25EYXRhKTogc3RyaW5nIHtcbiAgICBjb25zdCBjbHMgPSAoYXNzaWdubWVudC5jbGFzcyAhPSBudWxsKSA/IGRhdGEuY2xhc3Nlc1thc3NpZ25tZW50LmNsYXNzXSA6ICdUYXNrJ1xuICAgIGlmIChjbHMgPT0gbnVsbCkgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCBjbGFzcyAke2Fzc2lnbm1lbnQuY2xhc3N9IGluICR7ZGF0YS5jbGFzc2VzfWApXG4gICAgcmV0dXJuIGNsc1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2VwYXJhdGVkQ2xhc3MoYXNzaWdubWVudDogSUFzc2lnbm1lbnQsIGRhdGE6IElBcHBsaWNhdGlvbkRhdGEpOiBSZWdFeHBNYXRjaEFycmF5IHtcbiAgICByZXR1cm4gc2VwYXJhdGUoYXNzaWdubWVudENsYXNzKGFzc2lnbm1lbnQsIGRhdGEpKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQXNzaWdubWVudChzcGxpdDogSVNwbGl0QXNzaWdubWVudCwgZGF0YTogSUFwcGxpY2F0aW9uRGF0YSk6IEhUTUxFbGVtZW50IHtcbiAgICBjb25zdCB7IGFzc2lnbm1lbnQsIHJlZmVyZW5jZSB9ID0gc3BsaXRcblxuICAgIC8vIFNlcGFyYXRlIHRoZSBjbGFzcyBkZXNjcmlwdGlvbiBmcm9tIHRoZSBhY3R1YWwgY2xhc3NcbiAgICBjb25zdCBzZXBhcmF0ZWQgPSBzZXBhcmF0ZWRDbGFzcyhhc3NpZ25tZW50LCBkYXRhKVxuXG4gICAgY29uc3Qgd2Vla0lkID0gY29tcHV0ZVdlZWtJZChzcGxpdClcblxuICAgIGxldCBzbWFsbFRhZyA9ICdzbWFsbCdcbiAgICBsZXQgbGluayA9IG51bGxcbiAgICBjb25zdCBhdGhlbmFEYXRhID0gZ2V0QXRoZW5hRGF0YSgpXG4gICAgaWYgKGF0aGVuYURhdGEgJiYgYXNzaWdubWVudC5jbGFzcyAhPSBudWxsICYmIChhdGhlbmFEYXRhW2RhdGEuY2xhc3Nlc1thc3NpZ25tZW50LmNsYXNzXV0gIT0gbnVsbCkpIHtcbiAgICAgICAgbGluayA9IGF0aGVuYURhdGFbZGF0YS5jbGFzc2VzW2Fzc2lnbm1lbnQuY2xhc3NdXS5saW5rXG4gICAgICAgIHNtYWxsVGFnID0gJ2EnXG4gICAgfVxuXG4gICAgY29uc3QgZSA9IGVsZW1lbnQoJ2RpdicsIFsnYXNzaWdubWVudCcsIGFzc2lnbm1lbnQuYmFzZVR5cGUsICdhbmltJ10sXG4gICAgICAgICAgICAgICAgICAgICAgYDwke3NtYWxsVGFnfSR7bGluayA/IGAgaHJlZj0nJHtsaW5rfScgY2xhc3M9J2xpbmtlZCcgdGFyZ2V0PSdfYmxhbmsnYCA6ICcnfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPSdleHRyYSc+JHtzZXBhcmF0ZWRbMV19PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtzZXBhcmF0ZWRbMl19XG4gICAgICAgICAgICAgICAgICAgICAgIDwvJHtzbWFsbFRhZ30+PHNwYW4gY2xhc3M9J3RpdGxlJz4ke2Fzc2lnbm1lbnQudGl0bGV9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT0naGlkZGVuJyBjbGFzcz0nZHVlJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9JyR7YXNzaWdubWVudC5lbmQgPT09ICdGb3JldmVyJyA/IDAgOiBhc3NpZ25tZW50LmVuZH0nIC8+YCxcbiAgICAgICAgICAgICAgICAgICAgICBhc3NpZ25tZW50LmlkICsgd2Vla0lkKVxuXG4gICAgaWYgKCggcmVmZXJlbmNlICYmIHJlZmVyZW5jZS5kb25lKSB8fCBhc3NpZ25tZW50SW5Eb25lKGFzc2lnbm1lbnQuaWQpKSB7XG4gICAgICAgIGUuY2xhc3NMaXN0LmFkZCgnZG9uZScpXG4gICAgfVxuICAgIGUuc2V0QXR0cmlidXRlKCdkYXRhLWNsYXNzJywgYXNzaWdubWVudENsYXNzKGFzc2lnbm1lbnQsIGRhdGEpKVxuICAgIGNvbnN0IGNsb3NlID0gZWxlbWVudCgnYScsIFsnY2xvc2UnLCAnbWF0ZXJpYWwtaWNvbnMnXSwgJ2Nsb3NlJylcbiAgICBjbG9zZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsb3NlT3BlbmVkKVxuICAgIGUuYXBwZW5kQ2hpbGQoY2xvc2UpXG5cbiAgICAvLyBQcmV2ZW50IGNsaWNraW5nIHRoZSBjbGFzcyBuYW1lIHdoZW4gYW4gaXRlbSBpcyBkaXNwbGF5ZWQgb24gdGhlIGNhbGVuZGFyIGZyb20gZG9pbmcgYW55dGhpbmdcbiAgICBpZiAobGluayAhPSBudWxsKSB7XG4gICAgICAgIF8kKGUucXVlcnlTZWxlY3RvcignYScpKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldnQpID0+IHtcbiAgICAgICAgICAgIGlmICgoZG9jdW1lbnQuYm9keS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmlldycpID09PSAnMCcpICYmICFlLmNsYXNzTGlzdC5jb250YWlucygnZnVsbCcpKSB7XG4gICAgICAgICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBjb25zdCBjb21wbGV0ZSA9IGVsZW1lbnQoJ2EnLCBbJ2NvbXBsZXRlJywgJ21hdGVyaWFsLWljb25zJywgJ3dhdmVzJ10sICdkb25lJylcbiAgICByaXBwbGUoY29tcGxldGUpXG4gICAgY29uc3QgaWQgPSBzcGxpdC5hc3NpZ25tZW50LmlkXG4gICAgY29tcGxldGUuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIChldnQpID0+IHtcbiAgICAgICAgaWYgKGV2dC53aGljaCA9PT0gMSkgeyAvLyBMZWZ0IGJ1dHRvblxuICAgICAgICAgICAgbGV0IGFkZGVkID0gdHJ1ZVxuICAgICAgICAgICAgaWYgKHJlZmVyZW5jZSAhPSBudWxsKSB7IC8vIFRhc2sgaXRlbVxuICAgICAgICAgICAgICAgIGlmIChlLmNsYXNzTGlzdC5jb250YWlucygnZG9uZScpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlZmVyZW5jZS5kb25lID0gZmFsc2VcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBhZGRlZCA9IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgIHJlZmVyZW5jZS5kb25lID0gdHJ1ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzYXZlRXh0cmEoKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoZS5jbGFzc0xpc3QuY29udGFpbnMoJ2RvbmUnKSkge1xuICAgICAgICAgICAgICAgICAgICByZW1vdmVGcm9tRG9uZShhc3NpZ25tZW50LmlkKVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGFkZGVkID0gZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgYWRkVG9Eb25lKGFzc2lnbm1lbnQuaWQpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNhdmVEb25lKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5ib2R5LmdldEF0dHJpYnV0ZSgnZGF0YS12aWV3JykgPT09ICcxJykge1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcbiAgICAgICAgICAgICAgICAgICAgYC5hc3NpZ25tZW50W2lkXj1cXFwiJHtpZH1cXFwiXSwgI3Rlc3Qke2lkfSwgI2FjdGl2aXR5JHtpZH0sICNpYSR7aWR9YFxuICAgICAgICAgICAgICAgICkuZm9yRWFjaCgoZWxlbSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBlbGVtLmNsYXNzTGlzdC50b2dnbGUoJ2RvbmUnKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgaWYgKGFkZGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYXNzaWdubWVudC5saXN0RGlzcDpub3QoLmRvbmUpJykubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ25vTGlzdCcpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmFzc2lnbm1lbnQubGlzdERpc3A6bm90KC5kb25lKScpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdub0xpc3QnKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlc2l6ZSgpXG4gICAgICAgICAgICB9LCAxMDApXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICAgICAgICAgICAgIGAuYXNzaWdubWVudFtpZF49XFxcIiR7aWR9XFxcIl0sICN0ZXN0JHtpZH0sICNhY3Rpdml0eSR7aWR9LCAjaWEke2lkfWBcbiAgICAgICAgICAgICkuZm9yRWFjaCgoZWxlbSkgPT4ge1xuICAgICAgICAgICAgICAgIGVsZW0uY2xhc3NMaXN0LnRvZ2dsZSgnZG9uZScpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgaWYgKGFkZGVkKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5hc3NpZ25tZW50Lmxpc3REaXNwOm5vdCguZG9uZSknKS5sZW5ndGggIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdub0xpc3QnKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5hc3NpZ25tZW50Lmxpc3REaXNwOm5vdCguZG9uZSknKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdub0xpc3QnKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pXG4gICAgZS5hcHBlbmRDaGlsZChjb21wbGV0ZSlcblxuICAgIC8vIElmIHRoZSBhc3NpZ25tZW50IGlzIGEgY3VzdG9tIG9uZSwgYWRkIGEgYnV0dG9uIHRvIGRlbGV0ZSBpdFxuICAgIGlmIChzcGxpdC5jdXN0b20pIHtcbiAgICAgICAgY29uc3QgZGVsZXRlQSA9IGVsZW1lbnQoJ2EnLCBbJ21hdGVyaWFsLWljb25zJywgJ2RlbGV0ZUFzc2lnbm1lbnQnLCAnd2F2ZXMnXSwgJ2RlbGV0ZScpXG4gICAgICAgIHJpcHBsZShkZWxldGVBKVxuICAgICAgICBkZWxldGVBLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCAoZXZ0KSA9PiB7XG4gICAgICAgICAgICBpZiAoZXZ0LndoaWNoICE9PSAxIHx8ICFyZWZlcmVuY2UpIHJldHVyblxuICAgICAgICAgICAgcmVtb3ZlRnJvbUV4dHJhKHJlZmVyZW5jZSlcbiAgICAgICAgICAgIHNhdmVFeHRyYSgpXG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZ1bGwnKSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICdhdXRvJ1xuICAgICAgICAgICAgICAgIGNvbnN0IGJhY2sgPSBlbGVtQnlJZCgnYmFja2dyb3VuZCcpXG4gICAgICAgICAgICAgICAgYmFjay5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBiYWNrLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcbiAgICAgICAgICAgICAgICB9LCAzNTApXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlLnJlbW92ZSgpXG4gICAgICAgICAgICBkaXNwbGF5KGZhbHNlKVxuICAgICAgICB9KVxuICAgICAgICBlLmFwcGVuZENoaWxkKGRlbGV0ZUEpXG4gICAgfVxuXG4gICAgLy8gTW9kaWZpY2F0aW9uIGJ1dHRvblxuICAgIGNvbnN0IGVkaXQgPSBlbGVtZW50KCdhJywgWydlZGl0QXNzaWdubWVudCcsICdtYXRlcmlhbC1pY29ucycsICd3YXZlcyddLCAnZWRpdCcpXG4gICAgZWRpdC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgKGV2dCkgPT4ge1xuICAgICAgICBpZiAoZXZ0LndoaWNoID09PSAxKSB7XG4gICAgICAgICAgICBjb25zdCByZW1vdmUgPSBlZGl0LmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJylcbiAgICAgICAgICAgIGVkaXQuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJylcbiAgICAgICAgICAgIF8kKGUucXVlcnlTZWxlY3RvcignLmJvZHknKSkuc2V0QXR0cmlidXRlKCdjb250ZW50RWRpdGFibGUnLCByZW1vdmUgPyAnZmFsc2UnIDogJ3RydWUnKVxuICAgICAgICAgICAgaWYgKCFyZW1vdmUpIHtcbiAgICAgICAgICAgICAgICAoZS5xdWVyeVNlbGVjdG9yKCcuYm9keScpIGFzIEhUTUxFbGVtZW50KS5mb2N1cygpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBkbiA9IGUucXVlcnlTZWxlY3RvcignLmNvbXBsZXRlJykgYXMgSFRNTEVsZW1lbnRcbiAgICAgICAgICAgIGRuLnN0eWxlLmRpc3BsYXkgPSByZW1vdmUgPyAnYmxvY2snIDogJ25vbmUnXG4gICAgICAgIH1cbiAgICB9KVxuICAgIHJpcHBsZShlZGl0KVxuXG4gICAgZS5hcHBlbmRDaGlsZChlZGl0KVxuXG4gICAgY29uc3Qgc3RhcnQgPSBuZXcgRGF0ZShmcm9tRGF0ZU51bShhc3NpZ25tZW50LnN0YXJ0KSlcbiAgICBjb25zdCBlbmQgPSBhc3NpZ25tZW50LmVuZCA9PT0gJ0ZvcmV2ZXInID8gYXNzaWdubWVudC5lbmQgOiBuZXcgRGF0ZShmcm9tRGF0ZU51bShhc3NpZ25tZW50LmVuZCkpXG4gICAgY29uc3QgdGltZXMgPSBlbGVtZW50KCdkaXYnLCAncmFuZ2UnLFxuICAgICAgICBhc3NpZ25tZW50LnN0YXJ0ID09PSBhc3NpZ25tZW50LmVuZCA/IGRhdGVTdHJpbmcoc3RhcnQpIDogYCR7ZGF0ZVN0cmluZyhzdGFydCl9ICZuZGFzaDsgJHtkYXRlU3RyaW5nKGVuZCl9YClcbiAgICBlLmFwcGVuZENoaWxkKHRpbWVzKVxuICAgIGlmIChhc3NpZ25tZW50LmF0dGFjaG1lbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY29uc3QgYXR0YWNobWVudHMgPSBlbGVtZW50KCdkaXYnLCAnYXR0YWNobWVudHMnKVxuICAgICAgICBhc3NpZ25tZW50LmF0dGFjaG1lbnRzLmZvckVhY2goKGF0dGFjaG1lbnQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGEgPSBlbGVtZW50KCdhJywgW10sIGF0dGFjaG1lbnRbMF0pIGFzIEhUTUxBbmNob3JFbGVtZW50XG4gICAgICAgICAgICBhLmhyZWYgPSB1cmxGb3JBdHRhY2htZW50KGF0dGFjaG1lbnRbMV0pXG4gICAgICAgICAgICBnZXRBdHRhY2htZW50TWltZVR5cGUoYXR0YWNobWVudFsxXSkudGhlbigodHlwZSkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBzcGFuXG4gICAgICAgICAgICAgICAgaWYgKG1pbWVUeXBlc1t0eXBlXSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGEuY2xhc3NMaXN0LmFkZChtaW1lVHlwZXNbdHlwZV1bMV0pXG4gICAgICAgICAgICAgICAgICAgIHNwYW4gPSBlbGVtZW50KCdzcGFuJywgW10sIG1pbWVUeXBlc1t0eXBlXVswXSlcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzcGFuID0gZWxlbWVudCgnc3BhbicsIFtdLCAnVW5rbm93biBmaWxlIHR5cGUnKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBhLmFwcGVuZENoaWxkKHNwYW4pXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgYXR0YWNobWVudHMuYXBwZW5kQ2hpbGQoYSlcbiAgICAgICAgfSlcbiAgICAgICAgZS5hcHBlbmRDaGlsZChhdHRhY2htZW50cylcbiAgICB9XG5cbiAgICBjb25zdCBib2R5ID0gZWxlbWVudCgnZGl2JywgJ2JvZHknLFxuICAgICAgICBhc3NpZ25tZW50LmJvZHkucmVwbGFjZSgvZm9udC1mYW1pbHk6W147XSo/KD86VGltZXMgTmV3IFJvbWFufHNlcmlmKVteO10qL2csICcnKSlcbiAgICBjb25zdCBlZGl0cyA9IGVsZW1lbnQoJ2RpdicsICdlZGl0cycsICc8c3BhbiBjbGFzcz1cXCdhZGRpdGlvbnNcXCc+PC9zcGFuPjxzcGFuIGNsYXNzPVxcJ2RlbGV0aW9uc1xcJz48L3NwYW4+JylcbiAgICBjb25zdCBtID0gbW9kaWZpZWRCb2R5KGFzc2lnbm1lbnQuaWQpXG4gICAgaWYgKG0gIT0gbnVsbCkge1xuICAgICAgICBjb25zdCBkID0gZG1wLmRpZmZfbWFpbihhc3NpZ25tZW50LmJvZHksIG0pXG4gICAgICAgIGRtcC5kaWZmX2NsZWFudXBTZW1hbnRpYyhkKVxuICAgICAgICBpZiAoZC5sZW5ndGggIT09IDApIHsgLy8gSGFzIGJlZW4gZWRpdGVkXG4gICAgICAgICAgICBwb3B1bGF0ZUFkZGVkRGVsZXRlZChkLCBlZGl0cylcbiAgICAgICAgICAgIGJvZHkuaW5uZXJIVE1MID0gbVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgYm9keS5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIChldnQpID0+IHtcbiAgICAgICAgaWYgKHJlZmVyZW5jZSAhPSBudWxsKSB7XG4gICAgICAgICAgICByZWZlcmVuY2UuYm9keSA9IGJvZHkuaW5uZXJIVE1MXG4gICAgICAgICAgICBzYXZlRXh0cmEoKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2V0TW9kaWZpZWQoYXNzaWdubWVudC5pZCwgIGJvZHkuaW5uZXJIVE1MKVxuICAgICAgICAgICAgc2F2ZU1vZGlmaWVkKClcbiAgICAgICAgICAgIGNvbnN0IGQgPSBkbXAuZGlmZl9tYWluKGFzc2lnbm1lbnQuYm9keSwgYm9keS5pbm5lckhUTUwpXG4gICAgICAgICAgICBkbXAuZGlmZl9jbGVhbnVwU2VtYW50aWMoZClcbiAgICAgICAgICAgIGlmIChwb3B1bGF0ZUFkZGVkRGVsZXRlZChkLCBlZGl0cykpIHtcbiAgICAgICAgICAgICAgICBlZGl0cy5jbGFzc0xpc3QuYWRkKCdub3RFbXB0eScpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGVkaXRzLmNsYXNzTGlzdC5yZW1vdmUoJ25vdEVtcHR5JylcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoZG9jdW1lbnQuYm9keS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmlldycpID09PSAnMScpIHJlc2l6ZSgpXG4gICAgfSlcblxuICAgIGUuYXBwZW5kQ2hpbGQoYm9keSlcblxuICAgIGNvbnN0IHJlc3RvcmUgPSBlbGVtZW50KCdhJywgWydtYXRlcmlhbC1pY29ucycsICdyZXN0b3JlJ10sICdzZXR0aW5nc19iYWNrdXBfcmVzdG9yZScpXG4gICAgcmVzdG9yZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgcmVtb3ZlRnJvbU1vZGlmaWVkKGFzc2lnbm1lbnQuaWQpXG4gICAgICAgIHNhdmVNb2RpZmllZCgpXG4gICAgICAgIGJvZHkuaW5uZXJIVE1MID0gYXNzaWdubWVudC5ib2R5XG4gICAgICAgIGVkaXRzLmNsYXNzTGlzdC5yZW1vdmUoJ25vdEVtcHR5JylcbiAgICAgICAgaWYgKGRvY3VtZW50LmJvZHkuZ2V0QXR0cmlidXRlKCdkYXRhLXZpZXcnKSA9PT0gJzEnKSAgcmVzaXplKClcbiAgICB9KVxuICAgIGVkaXRzLmFwcGVuZENoaWxkKHJlc3RvcmUpXG4gICAgZS5hcHBlbmRDaGlsZChlZGl0cylcblxuICAgIGNvbnN0IG1vZHMgPSBlbGVtZW50KCdkaXYnLCBbJ21vZHMnXSlcbiAgICByZWNlbnRBY3Rpdml0eSgpLmZvckVhY2goKGEpID0+IHtcbiAgICAgICAgaWYgKChhWzBdID09PSAnZWRpdCcpICYmIChhWzFdLmlkID09PSBhc3NpZ25tZW50LmlkKSkge1xuICAgICAgICBjb25zdCB0ZSA9IGVsZW1lbnQoJ2RpdicsIFsnaW5uZXJBY3Rpdml0eScsICdhc3NpZ25tZW50SXRlbScsIGFzc2lnbm1lbnQuYmFzZVR5cGVdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgYDxpIGNsYXNzPSdtYXRlcmlhbC1pY29ucyc+ZWRpdDwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz0ndGl0bGUnPiR7ZGF0ZVN0cmluZyhuZXcgRGF0ZShhWzJdKSl9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPSdhZGRpdGlvbnMnPjwvc3Bhbj48c3BhbiBjbGFzcz0nZGVsZXRpb25zJz48L3NwYW4+YCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGBpYSR7YXNzaWdubWVudC5pZH1gKVxuICAgICAgICBjb25zdCBkID0gZG1wLmRpZmZfbWFpbihhWzFdLmJvZHksIGFzc2lnbm1lbnQuYm9keSlcbiAgICAgICAgZG1wLmRpZmZfY2xlYW51cFNlbWFudGljKGQpXG4gICAgICAgIHBvcHVsYXRlQWRkZWREZWxldGVkKGQsIHRlKVxuXG4gICAgICAgIGlmIChhc3NpZ25tZW50LmNsYXNzKSB0ZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtY2xhc3MnLCBkYXRhLmNsYXNzZXNbYXNzaWdubWVudC5jbGFzc10pXG4gICAgICAgIHRlLmFwcGVuZENoaWxkKGVsZW1lbnQoJ2RpdicsICdpYURpZmYnLCBkbXAuZGlmZl9wcmV0dHlIdG1sKGQpKSlcbiAgICAgICAgdGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICB0ZS5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnKVxuICAgICAgICAgICAgaWYgKGRvY3VtZW50LmJvZHkuZ2V0QXR0cmlidXRlKCdkYXRhLXZpZXcnKSA9PT0gJzEnKSByZXNpemUoKVxuICAgICAgICB9KVxuICAgICAgICBtb2RzLmFwcGVuZENoaWxkKHRlKVxuICAgICAgICB9XG4gICAgfSlcbiAgICBlLmFwcGVuZENoaWxkKG1vZHMpXG5cbiAgICBpZiAoc2V0dGluZ3MuYXNzaWdubWVudFNwYW4gPT09ICdtdWx0aXBsZScgJiYgKHN0YXJ0IDwgc3BsaXQuc3RhcnQpKSB7XG4gICAgICAgIGUuY2xhc3NMaXN0LmFkZCgnZnJvbVdlZWtlbmQnKVxuICAgIH1cbiAgICBpZiAoc2V0dGluZ3MuYXNzaWdubWVudFNwYW4gPT09ICdtdWx0aXBsZScgJiYgKGVuZCA+IHNwbGl0LmVuZCkpIHtcbiAgICAgICAgZS5jbGFzc0xpc3QuYWRkKCdvdmVyV2Vla2VuZCcpXG4gICAgfVxuICAgIGUuY2xhc3NMaXN0LmFkZChgcyR7c3BsaXQuc3RhcnQuZ2V0RGF5KCl9YClcbiAgICBpZiAoc3BsaXQuZW5kICE9PSAnRm9yZXZlcicpIGUuY2xhc3NMaXN0LmFkZChgZSR7NiAtIHNwbGl0LmVuZC5nZXREYXkoKX1gKVxuXG4gICAgY29uc3Qgc3QgPSBNYXRoLmZsb29yKHNwbGl0LnN0YXJ0LmdldFRpbWUoKSAvIDEwMDAgLyAzNjAwIC8gMjQpXG4gICAgaWYgKHNwbGl0LmFzc2lnbm1lbnQuZW5kID09PSAnRm9yZXZlcicpIHtcbiAgICAgICAgaWYgKHN0IDw9ICh0b2RheSgpICsgZ2V0TGlzdERhdGVPZmZzZXQoKSkpIHtcbiAgICAgICAgICAgIGUuY2xhc3NMaXN0LmFkZCgnbGlzdERpc3AnKVxuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgbWlkRGF0ZSA9IG5ldyBEYXRlKClcbiAgICAgICAgbWlkRGF0ZS5zZXREYXRlKG1pZERhdGUuZ2V0RGF0ZSgpICsgZ2V0TGlzdERhdGVPZmZzZXQoKSlcbiAgICAgICAgY29uc3QgcHVzaCA9IChhc3NpZ25tZW50LmJhc2VUeXBlID09PSAndGVzdCcgJiYgYXNzaWdubWVudC5zdGFydCA9PT0gc3QpID8gc2V0dGluZ3MuZWFybHlUZXN0IDogMFxuICAgICAgICBjb25zdCBlbmRFeHRyYSA9IGdldExpc3REYXRlT2Zmc2V0KCkgPT09IDAgPyBnZXRUaW1lQWZ0ZXIobWlkRGF0ZSkgOiAyNCAqIDM2MDAgKiAxMDAwXG4gICAgICAgIGlmIChmcm9tRGF0ZU51bShzdCAtIHB1c2gpIDw9IG1pZERhdGUgJiZcbiAgICAgICAgICAgIChzcGxpdC5lbmQgPT09ICdGb3JldmVyJyB8fCBtaWREYXRlLmdldFRpbWUoKSA8PSBzcGxpdC5lbmQuZ2V0VGltZSgpICsgZW5kRXh0cmEpKSB7XG4gICAgICAgICAgICBlLmNsYXNzTGlzdC5hZGQoJ2xpc3REaXNwJylcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIEFkZCBjbGljayBpbnRlcmFjdGl2aXR5XG4gICAgaWYgKCFzcGxpdC5jdXN0b20gfHwgIXNldHRpbmdzLnNlcFRhc2tzKSB7XG4gICAgICAgIGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZ0KSA9PiB7XG4gICAgICAgICAgICBpZiAoKGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2Z1bGwnKS5sZW5ndGggPT09IDApICYmXG4gICAgICAgICAgICAgICAgKGRvY3VtZW50LmJvZHkuZ2V0QXR0cmlidXRlKCdkYXRhLXZpZXcnKSA9PT0gJzAnKSkge1xuICAgICAgICAgICAgICAgIGUuY2xhc3NMaXN0LnJlbW92ZSgnYW5pbScpXG4gICAgICAgICAgICAgICAgZS5jbGFzc0xpc3QuYWRkKCdtb2RpZnknKVxuICAgICAgICAgICAgICAgIGNvbnN0IHRvcCA9IChlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCAtIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLSBjc3NOdW1iZXIoZS5zdHlsZS5tYXJnaW5Ub3ApKSArIDQ0XG4gICAgICAgICAgICAgICAgZS5zdHlsZS50b3AgPSB0b3AgLSB3aW5kb3cucGFnZVlPZmZzZXQgKyAncHgnXG4gICAgICAgICAgICAgICAgZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtdG9wJywgU3RyaW5nKHRvcCkpXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nXG4gICAgICAgICAgICAgICAgY29uc3QgYmFjayA9IGVsZW1CeUlkKCdiYWNrZ3JvdW5kJylcbiAgICAgICAgICAgICAgICBiYWNrLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG4gICAgICAgICAgICAgICAgYmFjay5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xuICAgICAgICAgICAgICAgIGUuY2xhc3NMaXN0LmFkZCgnYW5pbScpXG4gICAgICAgICAgICAgICAgZm9yY2VMYXlvdXQoZSlcbiAgICAgICAgICAgICAgICBlLmNsYXNzTGlzdC5hZGQoJ2Z1bGwnKVxuICAgICAgICAgICAgICAgIGUuc3R5bGUudG9wID0gKDc1IC0gY3NzTnVtYmVyKGUuc3R5bGUubWFyZ2luVG9wKSkgKyAncHgnXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiBlLmNsYXNzTGlzdC5yZW1vdmUoJ2FuaW0nKSwgMzUwKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIHJldHVybiBlXG59XG5cbi8vIEluIG9yZGVyIHRvIGRpc3BsYXkgYW4gYXNzaWdubWVudCBpbiB0aGUgY29ycmVjdCBYIHBvc2l0aW9uLCBjbGFzc2VzIHdpdGggbmFtZXMgZVggYW5kIGVYIGFyZVxuLy8gdXNlZCwgd2hlcmUgWCBpcyB0aGUgbnVtYmVyIG9mIHNxdWFyZXMgdG8gZnJvbSB0aGUgYXNzaWdubWVudCB0byB0aGUgbGVmdC9yaWdodCBzaWRlIG9mIHRoZVxuLy8gc2NyZWVuLiBUaGUgZnVuY3Rpb24gYmVsb3cgZGV0ZXJtaW5lcyB3aGljaCBlWCBhbmQgc1ggY2xhc3MgdGhlIGdpdmVuIGVsZW1lbnQgaGFzLlxuZXhwb3J0IGZ1bmN0aW9uIGdldEVTKGVsOiBIVE1MRWxlbWVudCk6IFtzdHJpbmcsIHN0cmluZ10ge1xuICAgIGxldCBlID0gMFxuICAgIGxldCBzID0gMFxuXG4gICAgQXJyYXkuZnJvbShuZXcgQXJyYXkoNyksIChfLCB4KSA9PiB4KS5mb3JFYWNoKCh4KSA9PiB7XG4gICAgICAgIGlmIChlbC5jbGFzc0xpc3QuY29udGFpbnMoYGUke3h9YCkpIHtcbiAgICAgICAgICAgIGUgPSB4XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVsLmNsYXNzTGlzdC5jb250YWlucyhgcyR7eH1gKSkge1xuICAgICAgICAgICAgcyA9IHhcbiAgICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIFtgZSR7ZX1gLCBgcyR7c31gXVxufVxuXG4vLyBCZWxvdyBpcyBhIGZ1bmN0aW9uIHRvIGNsb3NlIHRoZSBjdXJyZW50IGFzc2lnbm1lbnQgdGhhdCBpcyBvcGVuZWQuXG5leHBvcnQgZnVuY3Rpb24gY2xvc2VPcGVuZWQoZXZ0OiBFdmVudCk6IHZvaWQge1xuICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKVxuICAgIGNvbnN0IGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZ1bGwnKSBhcyBIVE1MRWxlbWVudHxudWxsXG4gICAgaWYgKGVsID09IG51bGwpIHJldHVyblxuXG4gICAgZWwuc3R5bGUudG9wID0gTnVtYmVyKGVsLmdldEF0dHJpYnV0ZSgnZGF0YS10b3AnKSB8fCAnMCcpIC0gd2luZG93LnBhZ2VZT2Zmc2V0ICsgJ3B4J1xuICAgIGVsLmNsYXNzTGlzdC5hZGQoJ2FuaW0nKVxuICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2Z1bGwnKVxuICAgIGVsLnNjcm9sbFRvcCA9IDBcbiAgICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2F1dG8nXG4gICAgY29uc3QgYmFjayA9IGVsZW1CeUlkKCdiYWNrZ3JvdW5kJylcbiAgICBiYWNrLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG5cbiAgICBjb25zdCB0cmFuc2l0aW9uTGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgICAgIGJhY2suc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuICAgICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKCdhbmltJylcbiAgICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZSgnbW9kaWZ5JylcbiAgICAgICAgZWwuc3R5bGUudG9wID0gJ2F1dG8nXG4gICAgICAgIGZvcmNlTGF5b3V0KGVsKVxuICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKCdhbmltJylcbiAgICAgICAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIHRyYW5zaXRpb25MaXN0ZW5lcilcbiAgICB9XG5cbiAgICBlbC5hZGRFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgdHJhbnNpdGlvbkxpc3RlbmVyKVxufVxuIiwiaW1wb3J0IHsgZWxlbUJ5SWQsIGxvY2FsU3RvcmFnZVJlYWQgfSBmcm9tICcuLi91dGlsJ1xuXG4vLyBUaGVuLCB0aGUgdXNlcm5hbWUgaW4gdGhlIHNpZGViYXIgbmVlZHMgdG8gYmUgc2V0IGFuZCB3ZSBuZWVkIHRvIGdlbmVyYXRlIGFuIFwiYXZhdGFyXCIgYmFzZWQgb25cbi8vIGluaXRpYWxzLiBUbyBkbyB0aGF0LCBzb21lIGNvZGUgdG8gY29udmVydCBmcm9tIExBQiB0byBSR0IgY29sb3JzIGlzIGJvcnJvd2VkIGZyb21cbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9ib3JvbmluZS9jb2xvcnNwYWNlcy5qc1xuLy9cbi8vIExBQiBpcyBhIGNvbG9yIG5hbWluZyBzY2hlbWUgdGhhdCB1c2VzIHR3byB2YWx1ZXMgKEEgYW5kIEIpIGFsb25nIHdpdGggYSBsaWdodG5lc3MgdmFsdWUgaW4gb3JkZXJcbi8vIHRvIHByb2R1Y2UgY29sb3JzIHRoYXQgYXJlIGVxdWFsbHkgc3BhY2VkIGJldHdlZW4gYWxsIG9mIHRoZSBjb2xvcnMgdGhhdCBjYW4gYmUgc2VlbiBieSB0aGUgaHVtYW5cbi8vIGV5ZS4gVGhpcyB3b3JrcyBncmVhdCBiZWNhdXNlIGV2ZXJ5b25lIGhhcyBsZXR0ZXJzIGluIGhpcy9oZXIgaW5pdGlhbHMuXG5cbi8vIFRoZSBENjUgc3RhbmRhcmQgaWxsdW1pbmFudFxuY29uc3QgUkVGX1ggPSAwLjk1MDQ3XG5jb25zdCBSRUZfWSA9IDEuMDAwMDBcbmNvbnN0IFJFRl9aID0gMS4wODg4M1xuXG4vLyBDSUUgTCphKmIqIGNvbnN0YW50c1xuY29uc3QgTEFCX0UgPSAwLjAwODg1NlxuY29uc3QgTEFCX0sgPSA5MDMuM1xuXG5jb25zdCBNID0gW1xuICAgIFszLjI0MDYsIC0xLjUzNzIsIC0wLjQ5ODZdLFxuICAgIFstMC45Njg5LCAxLjg3NTgsICAwLjA0MTVdLFxuICAgIFswLjA1NTcsIC0wLjIwNDAsICAxLjA1NzBdXG5dXG5cbmNvbnN0IGZJbnYgPSAodDogbnVtYmVyKSA9PiB7XG4gICAgaWYgKE1hdGgucG93KHQsIDMpID4gTEFCX0UpIHtcbiAgICByZXR1cm4gTWF0aC5wb3codCwgMylcbiAgICB9IGVsc2Uge1xuICAgIHJldHVybiAoKDExNiAqIHQpIC0gMTYpIC8gTEFCX0tcbiAgICB9XG59XG5jb25zdCBkb3RQcm9kdWN0ID0gKGE6IG51bWJlcltdLCBiOiBudW1iZXJbXSkgPT4ge1xuICAgIGxldCByZXQgPSAwXG4gICAgYS5mb3JFYWNoKChfLCBpKSA9PiB7XG4gICAgICAgIHJldCArPSBhW2ldICogYltpXVxuICAgIH0pXG4gICAgcmV0dXJuIHJldFxufVxuY29uc3QgZnJvbUxpbmVhciA9IChjOiBudW1iZXIpID0+IHtcbiAgICBjb25zdCBhID0gMC4wNTVcbiAgICBpZiAoYyA8PSAwLjAwMzEzMDgpIHtcbiAgICAgICAgcmV0dXJuIDEyLjkyICogY1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiAoMS4wNTUgKiBNYXRoLnBvdyhjLCAxIC8gMi40KSkgLSAwLjA1NVxuICAgIH1cbn1cblxuZnVuY3Rpb24gbGFicmdiKGw6IG51bWJlciwgYTogbnVtYmVyLCBiOiBudW1iZXIpOiBzdHJpbmcge1xuICAgIGNvbnN0IHZhclkgPSAobCArIDE2KSAvIDExNlxuICAgIGNvbnN0IHZhclogPSB2YXJZIC0gKGIgLyAyMDApXG4gICAgY29uc3QgdmFyWCA9IChhIC8gNTAwKSArIHZhcllcbiAgICBjb25zdCBfWCA9IFJFRl9YICogZkludih2YXJYKVxuICAgIGNvbnN0IF9ZID0gUkVGX1kgKiBmSW52KHZhclkpXG4gICAgY29uc3QgX1ogPSBSRUZfWiAqIGZJbnYodmFyWilcblxuICAgIGNvbnN0IHR1cGxlID0gW19YLCBfWSwgX1pdXG5cbiAgICBjb25zdCBfUiA9IGZyb21MaW5lYXIoZG90UHJvZHVjdChNWzBdLCB0dXBsZSkpXG4gICAgY29uc3QgX0cgPSBmcm9tTGluZWFyKGRvdFByb2R1Y3QoTVsxXSwgdHVwbGUpKVxuICAgIGNvbnN0IF9CID0gZnJvbUxpbmVhcihkb3RQcm9kdWN0KE1bMl0sIHR1cGxlKSlcblxuICAgIC8vIE9yaWdpbmFsIGZyb20gaGVyZVxuICAgIGNvbnN0IG4gPSAodjogbnVtYmVyKSA9PiBNYXRoLnJvdW5kKE1hdGgubWF4KE1hdGgubWluKHYgKiAyNTYsIDI1NSksIDApKVxuICAgIHJldHVybiBgcmdiKCR7bihfUil9LCAke24oX0cpfSwgJHtuKF9CKX0pYFxufVxuXG4vKipcbiAqIENvbnZlcnQgYSBsZXR0ZXIgdG8gYSBmbG9hdCB2YWx1ZWQgZnJvbSAwIHRvIDI1NVxuICovXG5mdW5jdGlvbiBsZXR0ZXJUb0NvbG9yVmFsKGxldHRlcjogc3RyaW5nKTogbnVtYmVyIHtcbiAgICByZXR1cm4gKCgobGV0dGVyLmNoYXJDb2RlQXQoMCkgLSA2NSkgLyAyNikgKiAyNTYpIC0gMTI4XG59XG5cbi8vIFRoZSBmdW5jdGlvbiBiZWxvdyB1c2VzIHRoaXMgYWxnb3JpdGhtIHRvIGdlbmVyYXRlIGEgYmFja2dyb3VuZCBjb2xvciBmb3IgdGhlIGluaXRpYWxzIGRpc3BsYXllZCBpbiB0aGUgc2lkZWJhci5cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVBdmF0YXIoKTogdm9pZCB7XG4gICAgaWYgKCFsb2NhbFN0b3JhZ2VSZWFkKCd1c2VybmFtZScpKSByZXR1cm5cbiAgICBjb25zdCB1c2VyRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndXNlcicpXG4gICAgY29uc3QgaW5pdGlhbHNFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbml0aWFscycpXG4gICAgaWYgKCF1c2VyRWwgfHwgIWluaXRpYWxzRWwpIHJldHVyblxuXG4gICAgdXNlckVsLmlubmVySFRNTCA9IGxvY2FsU3RvcmFnZVJlYWQoJ3VzZXJuYW1lJylcbiAgICBjb25zdCBpbml0aWFscyA9IGxvY2FsU3RvcmFnZVJlYWQoJ3VzZXJuYW1lJykubWF0Y2goL1xcZCooLikuKj8oLiQpLykgLy8gU2VwYXJhdGUgeWVhciBmcm9tIGZpcnN0IG5hbWUgYW5kIGluaXRpYWxcbiAgICBpZiAoaW5pdGlhbHMgIT0gbnVsbCkge1xuICAgICAgICBjb25zdCBiZyA9IGxhYnJnYig1MCwgbGV0dGVyVG9Db2xvclZhbChpbml0aWFsc1sxXSksIGxldHRlclRvQ29sb3JWYWwoaW5pdGlhbHNbMl0pKSAvLyBDb21wdXRlIHRoZSBjb2xvclxuICAgICAgICBpbml0aWFsc0VsLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGJnXG4gICAgICAgIGluaXRpYWxzRWwuaW5uZXJIVE1MID0gaW5pdGlhbHNbMV0gKyBpbml0aWFsc1syXVxuICAgIH1cbn1cbiIsImltcG9ydCB7IHRvZGF5IH0gZnJvbSAnLi4vZGF0ZXMnXG5pbXBvcnQgeyBlbGVtZW50IH0gZnJvbSAnLi4vdXRpbCdcblxuY29uc3QgTU9OVEhTID0gWydKYW4nLCAnRmViJywgJ01hcicsICdBcHInLCAnTWF5JywgJ0p1bicsICdKdWwnLCAnQXVnJywgJ1NlcCcsICdPY3QnLCAnTm92JywgJ0RlYyddXG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVXZWVrKGlkOiBzdHJpbmcpOiBIVE1MRWxlbWVudCB7XG4gICAgY29uc3Qgd2sgPSBlbGVtZW50KCdzZWN0aW9uJywgJ3dlZWsnLCBudWxsLCBpZClcbiAgICBjb25zdCBkYXlUYWJsZSA9IGVsZW1lbnQoJ3RhYmxlJywgJ2RheVRhYmxlJykgYXMgSFRNTFRhYmxlRWxlbWVudFxuICAgIGNvbnN0IHRyID0gZGF5VGFibGUuaW5zZXJ0Um93KClcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmUgbm8tbG9vcHNcbiAgICBmb3IgKGxldCBkYXkgPSAwOyBkYXkgPCA3OyBkYXkrKykgdHIuaW5zZXJ0Q2VsbCgpXG4gICAgd2suYXBwZW5kQ2hpbGQoZGF5VGFibGUpXG5cbiAgICByZXR1cm4gd2tcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZURheShkOiBEYXRlKTogSFRNTEVsZW1lbnQge1xuICAgIGNvbnN0IGRheSA9IGVsZW1lbnQoJ2RpdicsICdkYXknLCBudWxsLCAnZGF5JylcbiAgICBkYXkuc2V0QXR0cmlidXRlKCdkYXRhLWRhdGUnLCBTdHJpbmcoZC5nZXRUaW1lKCkpKVxuICAgIGlmIChNYXRoLmZsb29yKChkLmdldFRpbWUoKSAtIGQuZ2V0VGltZXpvbmVPZmZzZXQoKSkgLyAxMDAwIC8gMzYwMCAvIDI0KSA9PT0gdG9kYXkoKSkge1xuICAgICAgZGF5LmNsYXNzTGlzdC5hZGQoJ3RvZGF5JylcbiAgICB9XG5cbiAgICBjb25zdCBtb250aCA9IGVsZW1lbnQoJ3NwYW4nLCAnbW9udGgnLCBNT05USFNbZC5nZXRNb250aCgpXSlcbiAgICBkYXkuYXBwZW5kQ2hpbGQobW9udGgpXG5cbiAgICBjb25zdCBkYXRlID0gZWxlbWVudCgnc3BhbicsICdkYXRlJywgU3RyaW5nKGQuZ2V0RGF0ZSgpKSlcbiAgICBkYXkuYXBwZW5kQ2hpbGQoZGF0ZSlcblxuICAgIHJldHVybiBkYXlcbn1cbiIsImltcG9ydCB7IFZFUlNJT04gfSBmcm9tICcuLi9hcHAnXG5pbXBvcnQgeyBlbGVtQnlJZCB9IGZyb20gJy4uL3V0aWwnXG5cbmNvbnN0IEVSUk9SX0ZPUk1fVVJMID0gJ2h0dHBzOi8vZG9jcy5nb29nbGUuY29tL2Evc3R1ZGVudHMuaGFya2VyLm9yZy9mb3Jtcy9kLydcbiAgICAgICAgICAgICAgICAgICAgICsgJzFzYTJnVXRZRlBkS1Q1WUVOWElFWWF1eVJQdWNxc1FDVmFRQVBlRjNiWjRRL3ZpZXdmb3JtJ1xuY29uc3QgRVJST1JfRk9STV9FTlRSWSA9ICc/ZW50cnkuMTIwMDM2MjIzPSdcbmNvbnN0IEVSUk9SX0dJVEhVQl9VUkwgPSAnaHR0cHM6Ly9naXRodWIuY29tLzE5UnlhbkEvQ2hlY2tQQ1IvaXNzdWVzL25ldydcblxuY29uc3QgbGlua0J5SWQgPSAoaWQ6IHN0cmluZykgPT4gZWxlbUJ5SWQoaWQpIGFzIEhUTUxMaW5rRWxlbWVudFxuXG4vLyAqZGlzcGxheUVycm9yKiBkaXNwbGF5cyBhIGRpYWxvZyBjb250YWluaW5nIGluZm9ybWF0aW9uIGFib3V0IGFuIGVycm9yLlxuZXhwb3J0IGZ1bmN0aW9uIGRpc3BsYXlFcnJvcihlOiBFcnJvcik6IHZvaWQge1xuICAgIGNvbnNvbGUubG9nKCdEaXNwbGF5aW5nIGVycm9yJywgZSlcbiAgICBjb25zdCBlcnJvckhUTUwgPSBgTWVzc2FnZTogJHtlLm1lc3NhZ2V9XFxuU3RhY2s6ICR7ZS5zdGFjayB8fCAoZSBhcyBhbnkpLmxpbmVOdW1iZXJ9XFxuYFxuICAgICAgICAgICAgICAgICAgICArIGBCcm93c2VyOiAke25hdmlnYXRvci51c2VyQWdlbnR9XFxuVmVyc2lvbjogJHtWRVJTSU9OfWBcbiAgICBlbGVtQnlJZCgnZXJyb3JDb250ZW50JykuaW5uZXJIVE1MID0gZXJyb3JIVE1MLnJlcGxhY2UoJ1xcbicsICc8YnI+JylcbiAgICBsaW5rQnlJZCgnZXJyb3JHb29nbGUnKS5ocmVmID0gRVJST1JfRk9STV9VUkwgKyBFUlJPUl9GT1JNX0VOVFJZICsgZW5jb2RlVVJJQ29tcG9uZW50KGVycm9ySFRNTClcbiAgICBsaW5rQnlJZCgnZXJyb3JHaXRIdWInKS5ocmVmID1cbiAgICAgICAgRVJST1JfR0lUSFVCX1VSTCArICc/Ym9keT0nICsgZW5jb2RlVVJJQ29tcG9uZW50KGBJJ3ZlIGVuY291bnRlcmVkIGFuIGJ1Zy5cXG5cXG5cXGBcXGBcXGBcXG4ke2Vycm9ySFRNTH1cXG5cXGBcXGBcXGBgKVxuICAgIGVsZW1CeUlkKCdlcnJvckJhY2tncm91bmQnKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xuICAgIHJldHVybiBlbGVtQnlJZCgnZXJyb3InKS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxufVxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCAoZXZ0KSA9PiB7XG4gICAgZXZ0LnByZXZlbnREZWZhdWx0KClcbiAgICBkaXNwbGF5RXJyb3IoZXZ0LmVycm9yKVxufSlcbiIsImltcG9ydCB7IF8kLCBhbmltYXRlRWwgfSBmcm9tICcuLi91dGlsJ1xuXG4vLyBGb3IgbGlzdCB2aWV3LCB0aGUgYXNzaWdubWVudHMgY2FuJ3QgYmUgb24gdG9wIG9mIGVhY2ggb3RoZXIuXG4vLyBUaGVyZWZvcmUsIGEgbGlzdGVuZXIgaXMgYXR0YWNoZWQgdG8gdGhlIHJlc2l6aW5nIG9mIHRoZSBicm93c2VyIHdpbmRvdy5cbmxldCB0aWNraW5nID0gZmFsc2VcbmxldCB0aW1lb3V0SWQ6IG51bWJlcnxudWxsID0gbnVsbFxuZXhwb3J0IGZ1bmN0aW9uIGdldFJlc2l6ZUFzc2lnbm1lbnRzKCk6IEhUTUxFbGVtZW50W10ge1xuICAgIGNvbnN0IGFzc2lnbm1lbnRzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKCdzaG93RG9uZScpID9cbiAgICAgICAgJy5hc3NpZ25tZW50Lmxpc3REaXNwJyA6ICcuYXNzaWdubWVudC5saXN0RGlzcDpub3QoLmRvbmUpJykpXG4gICAgYXNzaWdubWVudHMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICBjb25zdCBhZCA9IGEuY2xhc3NMaXN0LmNvbnRhaW5zKCdkb25lJylcbiAgICAgICAgY29uc3QgYmQgPSBiLmNsYXNzTGlzdC5jb250YWlucygnZG9uZScpXG4gICAgICAgIGlmIChhZCAmJiAhYmQpIHsgcmV0dXJuIDEgfVxuICAgICAgICBpZiAoYmQgJiYgIWFkKSB7IHJldHVybiAtMSB9XG4gICAgICAgIHJldHVybiBOdW1iZXIoKGEucXVlcnlTZWxlY3RvcignLmR1ZScpIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlKVxuICAgICAgICAgICAgIC0gTnVtYmVyKChiLnF1ZXJ5U2VsZWN0b3IoJy5kdWUnKSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSlcbiAgICB9KVxuICAgIHJldHVybiBhc3NpZ25tZW50cyBhcyBIVE1MRWxlbWVudFtdXG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXNpemVDYWxsZXIoKTogdm9pZCB7XG4gICAgaWYgKCF0aWNraW5nKSB7XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShyZXNpemUpXG4gICAgICAgIHRpY2tpbmcgPSB0cnVlXG4gICAgfVxufVxuXG5sZXQgbGFzdENvbHVtbnM6IG51bWJlcnxudWxsID0gbnVsbFxubGV0IGxhc3RBc3NpZ25tZW50czogbnVtYmVyfG51bGwgPSBudWxsXG5sZXQgbGFzdERvbmVDb3VudDogbnVtYmVyfG51bGwgPSBudWxsXG5cbmV4cG9ydCBmdW5jdGlvbiByZXNpemUoKTogdm9pZCB7XG4gICAgdGlja2luZyA9IHRydWVcbiAgICAvLyBUbyBjYWxjdWxhdGUgdGhlIG51bWJlciBvZiBjb2x1bW5zLCB0aGUgYmVsb3cgYWxnb3JpdGhtIGlzIHVzZWQgYmVjYXNlIGFzIHRoZSBzY3JlZW4gc2l6ZVxuICAgIC8vIGluY3JlYXNlcywgdGhlIGNvbHVtbiB3aWR0aCBpbmNyZWFzZXNcbiAgICBjb25zdCB3aWR0aHMgPSBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5jb250YWlucygnc2hvd0luZm8nKSA/XG4gICAgICAgIFs2NTAsIDExMDAsIDE4MDAsIDI3MDAsIDM4MDAsIDUxMDBdIDogWzM1MCwgODAwLCAxNTAwLCAyNDAwLCAzNTAwLCA0ODAwXVxuICAgIGxldCBjb2x1bW5zID0gMVxuICAgIHdpZHRocy5mb3JFYWNoKCh3LCBpbmRleCkgPT4ge1xuICAgICAgICBpZiAod2luZG93LmlubmVyV2lkdGggPiB3KSB7IGNvbHVtbnMgPSBpbmRleCArIDEgfVxuICAgIH0pXG5cbiAgICBjb25zdCBjb2x1bW5IZWlnaHRzID0gQXJyYXkuZnJvbShuZXcgQXJyYXkoY29sdW1ucyksICgpID0+IDApXG4gICAgY29uc3QgY2NoOiBudW1iZXJbXSA9IFtdXG4gICAgY29uc3QgYXNzaWdubWVudHMgPSBnZXRSZXNpemVBc3NpZ25tZW50cygpXG4gICAgY29uc3QgZG9uZUNvdW50ID0gYXNzaWdubWVudHMuZmlsdGVyKChhKSA9PiBhLmNsYXNzTGlzdC5jb250YWlucygnZG9uZScpKS5sZW5ndGhcbiAgICBhc3NpZ25tZW50cy5mb3JFYWNoKChhc3NpZ25tZW50LCBuKSA9PiB7XG4gICAgICAgIGNvbnN0IGNvbCA9IG4gJSBjb2x1bW5zXG4gICAgICAgIGNjaC5wdXNoKGNvbHVtbkhlaWdodHNbY29sXSlcbiAgICAgICAgY29sdW1uSGVpZ2h0c1tjb2xdICs9IGFzc2lnbm1lbnQub2Zmc2V0SGVpZ2h0ICsgMjRcbiAgICB9KVxuICAgIGFzc2lnbm1lbnRzLmZvckVhY2goKGFzc2lnbm1lbnQsIG4pID0+IHtcbiAgICAgICAgY29uc3QgY29sID0gbiAlIGNvbHVtbnNcbiAgICAgICAgYXNzaWdubWVudC5zdHlsZS50b3AgPSBjY2hbbl0gKyAncHgnXG4gICAgICAgIGlmIChjb2x1bW5zICE9PSBsYXN0Q29sdW1ucyB8fCBhc3NpZ25tZW50cy5sZW5ndGggIT09IGxhc3RBc3NpZ25tZW50cyB8fCBkb25lQ291bnQgIT09IGxhc3REb25lQ291bnQpIHtcbiAgICAgICAgICAgIGNvbnN0IGxlZnQgPSAoKDEwMCAvIGNvbHVtbnMpICogY29sKSArICclJ1xuICAgICAgICAgICAgY29uc3QgcmlnaHQgPSAoKDEwMCAvIGNvbHVtbnMpICogKGNvbHVtbnMgLSBjb2wgLSAxKSkgKyAnJSdcbiAgICAgICAgICAgIGlmIChsYXN0Q29sdW1ucyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGFzc2lnbm1lbnQuc3R5bGUubGVmdCA9IGxlZnRcbiAgICAgICAgICAgICAgICBhc3NpZ25tZW50LnN0eWxlLnJpZ2h0ID0gcmlnaHRcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYW5pbWF0ZUVsKGFzc2lnbm1lbnQsIFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogYXNzaWdubWVudC5zdHlsZS5sZWZ0IHx8IGxlZnQsXG4gICAgICAgICAgICAgICAgICAgICAgICByaWdodDogYXNzaWdubWVudC5zdHlsZS5yaWdodCB8fCByaWdodFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7IGxlZnQsIHJpZ2h0IH1cbiAgICAgICAgICAgICAgICBdLCB7IGR1cmF0aW9uOiAzMDAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGFzc2lnbm1lbnQuc3R5bGUubGVmdCA9IGxlZnRcbiAgICAgICAgICAgICAgICAgICAgYXNzaWdubWVudC5zdHlsZS5yaWdodCA9IHJpZ2h0XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pXG4gICAgaWYgKHRpbWVvdXRJZCkgY2xlYXJUaW1lb3V0KHRpbWVvdXRJZClcbiAgICB0aW1lb3V0SWQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgY2NoLmxlbmd0aCA9IDBcbiAgICAgICAgYXNzaWdubWVudHMuZm9yRWFjaCgoYXNzaWdubWVudCwgbikgPT4ge1xuICAgICAgICAgICAgY29uc3QgY29sID0gbiAlIGNvbHVtbnNcbiAgICAgICAgICAgIGlmIChuIDwgY29sdW1ucykge1xuICAgICAgICAgICAgICAgIGNvbHVtbkhlaWdodHNbY29sXSA9IDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNjaC5wdXNoKGNvbHVtbkhlaWdodHNbY29sXSlcbiAgICAgICAgICAgIGNvbHVtbkhlaWdodHNbY29sXSArPSBhc3NpZ25tZW50Lm9mZnNldEhlaWdodCArIDI0XG4gICAgICAgIH0pXG4gICAgICAgIGFzc2lnbm1lbnRzLmZvckVhY2goKGFzc2lnbm1lbnQsIG4pID0+IHtcbiAgICAgICAgICAgIGFzc2lnbm1lbnQuc3R5bGUudG9wID0gY2NoW25dICsgJ3B4J1xuICAgICAgICB9KVxuICAgIH0sIDUwMClcbiAgICBsYXN0Q29sdW1ucyA9IGNvbHVtbnNcbiAgICBsYXN0QXNzaWdubWVudHMgPSBhc3NpZ25tZW50cy5sZW5ndGhcbiAgICBsYXN0RG9uZUNvdW50ID0gZG9uZUNvdW50XG4gICAgdGlja2luZyA9IGZhbHNlXG59XG4iLCIvKipcbiAqIEFsbCB0aGlzIGlzIHJlc3BvbnNpYmxlIGZvciBpcyBjcmVhdGluZyBzbmFja2JhcnMuXG4gKi9cblxuaW1wb3J0IHsgZWxlbWVudCwgZm9yY2VMYXlvdXQgfSBmcm9tICcuLi91dGlsJ1xuXG4vKipcbiAqIENyZWF0ZXMgYSBzbmFja2JhciB3aXRob3V0IGFuIGFjdGlvblxuICogQHBhcmFtIG1lc3NhZ2UgVGhlIHNuYWNrYmFyJ3MgbWVzc2FnZVxuICovXG5leHBvcnQgZnVuY3Rpb24gc25hY2tiYXIobWVzc2FnZTogc3RyaW5nKTogdm9pZFxuLyoqXG4gKiBDcmVhdGVzIGEgc25hY2tiYXIgd2l0aCBhbiBhY3Rpb25cbiAqIEBwYXJhbSBtZXNzYWdlIFRoZSBzbmFja2JhcidzIG1lc3NhZ2VcbiAqIEBwYXJhbSBhY3Rpb24gT3B0aW9uYWwgdGV4dCB0byBzaG93IGFzIGEgbWVzc2FnZSBhY3Rpb25cbiAqIEBwYXJhbSBmICAgICAgQSBmdW5jdGlvbiB0byBleGVjdXRlIHdoZW4gdGhlIGFjdGlvbiBpcyBjbGlja2VkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzbmFja2JhcihtZXNzYWdlOiBzdHJpbmcsIGFjdGlvbjogc3RyaW5nLCBmOiAoKSA9PiB2b2lkKTogdm9pZFxuZXhwb3J0IGZ1bmN0aW9uIHNuYWNrYmFyKG1lc3NhZ2U6IHN0cmluZywgYWN0aW9uPzogc3RyaW5nLCBmPzogKCkgPT4gdm9pZCk6IHZvaWQge1xuICAgIGNvbnN0IHNuYWNrID0gZWxlbWVudCgnZGl2JywgJ3NuYWNrYmFyJylcbiAgICBjb25zdCBzbmFja0lubmVyID0gZWxlbWVudCgnZGl2JywgJ3NuYWNrSW5uZXInLCBtZXNzYWdlKVxuICAgIHNuYWNrLmFwcGVuZENoaWxkKHNuYWNrSW5uZXIpXG5cbiAgICBpZiAoKGFjdGlvbiAhPSBudWxsKSAmJiAoZiAhPSBudWxsKSkge1xuICAgICAgICBjb25zdCBhY3Rpb25FID0gZWxlbWVudCgnYScsIFtdLCBhY3Rpb24pXG4gICAgICAgIGFjdGlvbkUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICBzbmFjay5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuICAgICAgICAgICAgZigpXG4gICAgICAgIH0pXG4gICAgICAgIHNuYWNrSW5uZXIuYXBwZW5kQ2hpbGQoYWN0aW9uRSlcbiAgICB9XG5cbiAgICBjb25zdCBhZGQgPSAoKSA9PiB7XG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNuYWNrKVxuICAgICAgZm9yY2VMYXlvdXQoc25hY2spXG4gICAgICBzbmFjay5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgc25hY2suY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcbiAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHNuYWNrLnJlbW92ZSgpLCA5MDApXG4gICAgICB9LCA1MDAwKVxuICAgIH1cblxuICAgIGNvbnN0IGV4aXN0aW5nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNuYWNrYmFyJylcbiAgICBpZiAoZXhpc3RpbmcgIT0gbnVsbCkge1xuICAgICAgICBleGlzdGluZy5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuICAgICAgICBzZXRUaW1lb3V0KGFkZCwgMzAwKVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGFkZCgpXG4gICAgfVxufVxuIiwiXG4vKipcbiAqIENvb2tpZSBmdW5jdGlvbnMgKGEgY29va2llIGlzIGEgc21hbGwgdGV4dCBkb2N1bWVudCB0aGF0IHRoZSBicm93c2VyIGNhbiByZW1lbWJlcilcbiAqL1xuXG4vKipcbiAqIFJldHJpZXZlcyBhIGNvb2tpZVxuICogQHBhcmFtIGNuYW1lIHRoZSBuYW1lIG9mIHRoZSBjb29raWUgdG8gcmV0cmlldmVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldENvb2tpZShjbmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCBuYW1lID0gY25hbWUgKyAnPSdcbiAgICBjb25zdCBjb29raWVQYXJ0ID0gZG9jdW1lbnQuY29va2llLnNwbGl0KCc7JykuZmluZCgoYykgPT4gYy5pbmNsdWRlcyhuYW1lKSlcbiAgICBpZiAoY29va2llUGFydCkgcmV0dXJuIGNvb2tpZVBhcnQudHJpbSgpLnN1YnN0cmluZyhuYW1lLmxlbmd0aClcbiAgICByZXR1cm4gJycgLy8gQmxhbmsgaWYgY29va2llIG5vdCBmb3VuZFxuICB9XG5cbi8qKiBTZXRzIHRoZSB2YWx1ZSBvZiBhIGNvb2tpZVxuICogQHBhcmFtIGNuYW1lIHRoZSBuYW1lIG9mIHRoZSBjb29raWUgdG8gc2V0XG4gKiBAcGFyYW0gY3ZhbHVlIHRoZSB2YWx1ZSB0byBzZXQgdGhlIGNvb2tpZSB0b1xuICogQHBhcmFtIGV4ZGF5cyB0aGUgbnVtYmVyIG9mIGRheXMgdGhhdCB0aGUgY29va2llIHdpbGwgZXhwaXJlIGluIChhbmQgbm90IGJlIGV4aXN0ZW50IGFueW1vcmUpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRDb29raWUoY25hbWU6IHN0cmluZywgY3ZhbHVlOiBzdHJpbmcsIGV4ZGF5czogbnVtYmVyKTogdm9pZCB7XG4gICAgY29uc3QgZCA9IG5ldyBEYXRlKClcbiAgICBkLnNldFRpbWUoZC5nZXRUaW1lKCkgKyAoZXhkYXlzICogMjQgKiA2MCAqIDYwICogMTAwMCkpXG4gICAgY29uc3QgZXhwaXJlcyA9IGBleHBpcmVzPSR7ZC50b1VUQ1N0cmluZygpfWBcbiAgICBkb2N1bWVudC5jb29raWUgPSBjbmFtZSArICc9JyArIGN2YWx1ZSArICc7ICcgKyBleHBpcmVzXG4gIH1cblxuLyoqXG4gKiBEZWxldHMgYSBjb29raWVcbiAqIEBwYXJhbSBjbmFtZSB0aGUgbmFtZSBvZiB0aGUgY29va2llIHRvIGRlbGV0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVsZXRlQ29va2llKGNuYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAvLyBUaGlzIGlzIGxpa2UgKnNldENvb2tpZSosIGJ1dCBzZXRzIHRoZSBleHBpcnkgZGF0ZSB0byBzb21ldGhpbmcgaW4gdGhlIHBhc3Qgc28gdGhlIGNvb2tpZSBpcyBkZWxldGVkLlxuICAgIGRvY3VtZW50LmNvb2tpZSA9IGNuYW1lICsgJz07IGV4cGlyZXM9VGh1LCAwMSBKYW4gMTk3MCAwMDowMDowMSBHTVQ7J1xufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIHR6b2ZmKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIChuZXcgRGF0ZSgpKS5nZXRUaW1lem9uZU9mZnNldCgpICogMTAwMCAqIDYwIC8vIEZvciBmdXR1cmUgY2FsY3VsYXRpb25zXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b0RhdGVOdW0oZGF0ZTogRGF0ZXxudW1iZXIpOiBudW1iZXIge1xuICAgIGNvbnN0IG51bSA9IGRhdGUgaW5zdGFuY2VvZiBEYXRlID8gZGF0ZS5nZXRUaW1lKCkgOiBkYXRlXG4gICAgcmV0dXJuIE1hdGguZmxvb3IoKG51bSAtIHR6b2ZmKCkpIC8gMTAwMCAvIDM2MDAgLyAyNClcbn1cblxuLy8gKkZyb21EYXRlTnVtKiBjb252ZXJ0cyBhIG51bWJlciBvZiBkYXlzIHRvIGEgbnVtYmVyIG9mIHNlY29uZHNcbmV4cG9ydCBmdW5jdGlvbiBmcm9tRGF0ZU51bShkYXlzOiBudW1iZXIpOiBEYXRlIHtcbiAgICBjb25zdCBkID0gbmV3IERhdGUoKGRheXMgKiAxMDAwICogMzYwMCAqIDI0KSArIHR6b2ZmKCkpXG4gICAgLy8gVGhlIGNoZWNrcyBiZWxvdyBhcmUgdG8gaGFuZGxlIGRheWxpZ2h0IHNhdmluZ3MgdGltZVxuICAgIGlmIChkLmdldEhvdXJzKCkgPT09IDEpIHsgZC5zZXRIb3VycygwKSB9XG4gICAgaWYgKChkLmdldEhvdXJzKCkgPT09IDIyKSB8fCAoZC5nZXRIb3VycygpID09PSAyMykpIHtcbiAgICAgIGQuc2V0SG91cnMoMjQpXG4gICAgICBkLnNldE1pbnV0ZXMoMClcbiAgICAgIGQuc2V0U2Vjb25kcygwKVxuICAgIH1cbiAgICByZXR1cm4gZFxufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9kYXkoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdG9EYXRlTnVtKG5ldyBEYXRlKCkpXG59XG5cbi8qKlxuICogSXRlcmF0ZXMgZnJvbSB0aGUgc3RhcnRpbmcgZGF0ZSB0byBlbmRpbmcgZGF0ZSBpbmNsdXNpdmVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGl0ZXJEYXlzKHN0YXJ0OiBEYXRlLCBlbmQ6IERhdGUsIGNiOiAoZGF0ZTogRGF0ZSkgPT4gdm9pZCk6IHZvaWQge1xuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZSBuby1sb29wc1xuICAgIGZvciAoY29uc3QgZCA9IG5ldyBEYXRlKHN0YXJ0KTsgZCA8PSBlbmQ7IGQuc2V0RGF0ZShkLmdldERhdGUoKSArIDEpKSB7XG4gICAgICAgIGNiKGQpXG4gICAgfVxufVxuIiwiaW1wb3J0IHsgY29tcHV0ZVdlZWtJZCwgY3JlYXRlQXNzaWdubWVudCwgZ2V0RVMsIHNlcGFyYXRlZENsYXNzIH0gZnJvbSAnLi9jb21wb25lbnRzL2Fzc2lnbm1lbnQnXG5pbXBvcnQgeyBjcmVhdGVEYXksIGNyZWF0ZVdlZWsgfSBmcm9tICcuL2NvbXBvbmVudHMvY2FsZW5kYXInXG5pbXBvcnQgeyBkaXNwbGF5RXJyb3IgfSBmcm9tICcuL2NvbXBvbmVudHMvZXJyb3JEaXNwbGF5J1xuaW1wb3J0IHsgcmVzaXplIH0gZnJvbSAnLi9jb21wb25lbnRzL3Jlc2l6ZXInXG5pbXBvcnQgeyBmcm9tRGF0ZU51bSwgaXRlckRheXMsIHRvZGF5IH0gZnJvbSAnLi9kYXRlcydcbmltcG9ydCB7IGNsYXNzQnlJZCwgZ2V0RGF0YSwgSUFwcGxpY2F0aW9uRGF0YSwgSUFzc2lnbm1lbnQgfSBmcm9tICcuL3BjcidcbmltcG9ydCB7IGFkZEFjdGl2aXR5LCBzYXZlQWN0aXZpdHkgfSBmcm9tICcuL3BsdWdpbnMvYWN0aXZpdHknXG5pbXBvcnQgeyBleHRyYVRvVGFzaywgZ2V0RXh0cmEsIElDdXN0b21Bc3NpZ25tZW50IH0gZnJvbSAnLi9wbHVnaW5zL2N1c3RvbUFzc2lnbm1lbnRzJ1xuaW1wb3J0IHsgYXNzaWdubWVudEluRG9uZSwgcmVtb3ZlRnJvbURvbmUsIHNhdmVEb25lIH0gZnJvbSAnLi9wbHVnaW5zL2RvbmUnXG5pbXBvcnQgeyBhc3NpZ25tZW50SW5Nb2RpZmllZCwgcmVtb3ZlRnJvbU1vZGlmaWVkLCBzYXZlTW9kaWZpZWQgfSBmcm9tICcuL3BsdWdpbnMvbW9kaWZpZWRBc3NpZ25tZW50cydcbmltcG9ydCB7IHNldHRpbmdzIH0gZnJvbSAnLi9zZXR0aW5ncydcbmltcG9ydCB7IF8kLCBkYXRlU3RyaW5nLCBlbGVtQnlJZCwgZWxlbWVudCwgbG9jYWxTdG9yYWdlUmVhZCwgc21vb3RoU2Nyb2xsIH0gZnJvbSAnLi91dGlsJ1xuaW1wb3J0IHsgZ2V0Q2FsRGF0ZU9mZnNldCB9IGZyb20gJy4vbmF2aWdhdGlvbic7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVNwbGl0QXNzaWdubWVudCB7XG4gICAgYXNzaWdubWVudDogSUFzc2lnbm1lbnRcbiAgICBzdGFydDogRGF0ZVxuICAgIGVuZDogRGF0ZXwnRm9yZXZlcidcbiAgICBjdXN0b206IGJvb2xlYW5cbiAgICByZWZlcmVuY2U/OiBJQ3VzdG9tQXNzaWdubWVudFxufVxuXG5jb25zdCBTQ0hFRFVMRV9FTkRTID0ge1xuICAgIGRheTogKGRhdGU6IERhdGUpID0+IDI0ICogMzYwMCAqIDEwMDAsXG4gICAgbXM6IChkYXRlOiBEYXRlKSA9PiBbMjQsICAgICAgICAgICAgICAvLyBTdW5kYXlcbiAgICAgICAgICAgICAgICAgICAgICAgICAxNSArICgzNSAvIDYwKSwgIC8vIE1vbmRheVxuICAgICAgICAgICAgICAgICAgICAgICAgIDE1ICsgKDM1IC8gNjApLCAgLy8gVHVlc2RheVxuICAgICAgICAgICAgICAgICAgICAgICAgIDE1ICsgKDE1IC8gNjApLCAgLy8gV2VkbmVzZGF5XG4gICAgICAgICAgICAgICAgICAgICAgICAgMTUgKyAoMTUgLyA2MCksICAvLyBUaHVyc2RheVxuICAgICAgICAgICAgICAgICAgICAgICAgIDE1ICsgKDE1IC8gNjApLCAgLy8gRnJpZGF5XG4gICAgICAgICAgICAgICAgICAgICAgICAgMjQgICAgICAgICAgICAgICAvLyBTYXR1cmRheVxuICAgICAgICAgICAgICAgICAgICAgICAgXVtkYXRlLmdldERheSgpXSxcbiAgICB1czogKGRhdGU6IERhdGUpID0+IDE1ICogMzYwMCAqIDEwMDBcbn1cbmNvbnN0IFdFRUtFTkRfQ0xBU1NOQU1FUyA9IFsnZnJvbVdlZWtlbmQnLCAnb3ZlcldlZWtlbmQnXVxuXG5sZXQgc2Nyb2xsID0gMCAvLyBUaGUgbG9jYXRpb24gdG8gc2Nyb2xsIHRvIGluIG9yZGVyIHRvIHJlYWNoIHRvZGF5IGluIGNhbGVuZGFyIHZpZXdcblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNjcm9sbCgpOiBudW1iZXIge1xuICAgIHJldHVybiBzY3JvbGxcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFRpbWVBZnRlcihkYXRlOiBEYXRlKTogbnVtYmVyIHtcbiAgICBjb25zdCBoaWRlQXNzaWdubWVudHMgPSBzZXR0aW5ncy5oaWRlQXNzaWdubWVudHNcbiAgICBpZiAoaGlkZUFzc2lnbm1lbnRzID09PSAnZGF5JyB8fCBoaWRlQXNzaWdubWVudHMgPT09ICdtcycgfHwgaGlkZUFzc2lnbm1lbnRzID09PSAndXMnKSB7XG4gICAgICAgIHJldHVybiBTQ0hFRFVMRV9FTkRTW2hpZGVBc3NpZ25tZW50c10oZGF0ZSlcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gU0NIRURVTEVfRU5EUy5kYXkoZGF0ZSlcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGdldFN0YXJ0RW5kRGF0ZXMoZGF0YTogSUFwcGxpY2F0aW9uRGF0YSk6IHtzdGFydDogRGF0ZSwgZW5kOiBEYXRlIH0ge1xuICAgIGlmIChkYXRhLm1vbnRoVmlldykge1xuICAgICAgICBjb25zdCBzdGFydE4gPSBNYXRoLm1pbiguLi5kYXRhLmFzc2lnbm1lbnRzLm1hcCgoYSkgPT4gYS5zdGFydCkpIC8vIFNtYWxsZXN0IGRhdGVcbiAgICAgICAgY29uc3QgZW5kTiA9IE1hdGgubWF4KC4uLmRhdGEuYXNzaWdubWVudHMubWFwKChhKSA9PiBhLnN0YXJ0KSkgLy8gTGFyZ2VzdCBkYXRlXG5cbiAgICAgICAgY29uc3QgeWVhciA9IChuZXcgRGF0ZSgpKS5nZXRGdWxsWWVhcigpIC8vIEZvciBmdXR1cmUgY2FsY3VsYXRpb25zXG5cbiAgICAgICAgLy8gQ2FsY3VsYXRlIHdoYXQgbW9udGggd2Ugd2lsbCBiZSBkaXNwbGF5aW5nIGJ5IGZpbmRpbmcgdGhlIG1vbnRoIG9mIHRvZGF5XG4gICAgICAgIGNvbnN0IG1vbnRoID0gKG5ldyBEYXRlKCkpLmdldE1vbnRoKCkgKyBnZXRDYWxEYXRlT2Zmc2V0KClcblxuICAgICAgICAvLyBNYWtlIHN1cmUgdGhlIHN0YXJ0IGFuZCBlbmQgZGF0ZXMgbGllIHdpdGhpbiB0aGUgbW9udGhcbiAgICAgICAgY29uc3Qgc3RhcnQgPSBuZXcgRGF0ZShNYXRoLm1heChmcm9tRGF0ZU51bShzdGFydE4pLmdldFRpbWUoKSwgKG5ldyBEYXRlKHllYXIsIG1vbnRoKSkuZ2V0VGltZSgpKSlcbiAgICAgICAgLy8gSWYgdGhlIGRheSBhcmd1bWVudCBmb3IgRGF0ZSBpcyAwLCB0aGVuIHRoZSByZXN1bHRpbmcgZGF0ZSB3aWxsIGJlIG9mIHRoZSBwcmV2aW91cyBtb250aFxuICAgICAgICBjb25zdCBlbmQgPSBuZXcgRGF0ZShNYXRoLm1pbihmcm9tRGF0ZU51bShlbmROKS5nZXRUaW1lKCksIChuZXcgRGF0ZSh5ZWFyLCBtb250aCArIDEsIDApKS5nZXRUaW1lKCkpKVxuICAgICAgICByZXR1cm4geyBzdGFydCwgZW5kIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHRvZGF5U0UgPSBuZXcgRGF0ZSgpXG4gICAgICAgIGNvbnN0IHN0YXJ0ID0gbmV3IERhdGUodG9kYXlTRS5nZXRGdWxsWWVhcigpLCB0b2RheVNFLmdldE1vbnRoKCksIHRvZGF5U0UuZ2V0RGF0ZSgpKVxuICAgICAgICBjb25zdCBlbmQgPSBuZXcgRGF0ZSh0b2RheVNFLmdldEZ1bGxZZWFyKCksIHRvZGF5U0UuZ2V0TW9udGgoKSwgdG9kYXlTRS5nZXREYXRlKCkpXG4gICAgICAgIHJldHVybiB7IHN0YXJ0LCBlbmQgfVxuICAgICAgfVxufVxuXG5mdW5jdGlvbiBnZXRBc3NpZ25tZW50U3BsaXRzKGFzc2lnbm1lbnQ6IElBc3NpZ25tZW50LCBzdGFydDogRGF0ZSwgZW5kOiBEYXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWZlcmVuY2U/OiBJQ3VzdG9tQXNzaWdubWVudCk6IElTcGxpdEFzc2lnbm1lbnRbXSB7XG4gICAgY29uc3Qgc3BsaXQ6IElTcGxpdEFzc2lnbm1lbnRbXSA9IFtdXG4gICAgaWYgKHNldHRpbmdzLmFzc2lnbm1lbnRTcGFuID09PSAnbXVsdGlwbGUnKSB7XG4gICAgICAgIGNvbnN0IHMgPSBNYXRoLm1heChzdGFydC5nZXRUaW1lKCksIGZyb21EYXRlTnVtKGFzc2lnbm1lbnQuc3RhcnQpLmdldFRpbWUoKSlcbiAgICAgICAgY29uc3QgZSA9IGFzc2lnbm1lbnQuZW5kID09PSAnRm9yZXZlcicgPyBzIDogTWF0aC5taW4oZW5kLmdldFRpbWUoKSwgZnJvbURhdGVOdW0oYXNzaWdubWVudC5lbmQpLmdldFRpbWUoKSlcbiAgICAgICAgY29uc3Qgc3BhbiA9ICgoZSAtIHMpIC8gMTAwMCAvIDM2MDAgLyAyNCkgKyAxIC8vIE51bWJlciBvZiBkYXlzIGFzc2lnbm1lbnQgdGFrZXMgdXBcbiAgICAgICAgY29uc3Qgc3BhblJlbGF0aXZlID0gNiAtIChuZXcgRGF0ZShzKSkuZ2V0RGF5KCkgLy8gTnVtYmVyIG9mIGRheXMgdW50aWwgdGhlIG5leHQgU2F0dXJkYXlcblxuICAgICAgICBjb25zdCBucyA9IG5ldyBEYXRlKHMpXG4gICAgICAgIG5zLnNldERhdGUobnMuZ2V0RGF0ZSgpICsgc3BhblJlbGF0aXZlKSAvLyAgVGhlIGRhdGUgb2YgdGhlIG5leHQgU2F0dXJkYXlcblxuICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmUgbm8tbG9vcHNcbiAgICAgICAgZm9yIChsZXQgbiA9IC02OyBuIDwgc3BhbiAtIHNwYW5SZWxhdGl2ZTsgbiArPSA3KSB7XG4gICAgICAgICAgICBjb25zdCBsYXN0U3VuID0gbmV3IERhdGUobnMpXG4gICAgICAgICAgICBsYXN0U3VuLnNldERhdGUobGFzdFN1bi5nZXREYXRlKCkgKyBuKVxuXG4gICAgICAgICAgICBjb25zdCBuZXh0U2F0ID0gbmV3IERhdGUobGFzdFN1bilcbiAgICAgICAgICAgIG5leHRTYXQuc2V0RGF0ZShuZXh0U2F0LmdldERhdGUoKSArIDYpXG4gICAgICAgICAgICBzcGxpdC5wdXNoKHtcbiAgICAgICAgICAgICAgICBhc3NpZ25tZW50LFxuICAgICAgICAgICAgICAgIHN0YXJ0OiBuZXcgRGF0ZShNYXRoLm1heChzLCBsYXN0U3VuLmdldFRpbWUoKSkpLFxuICAgICAgICAgICAgICAgIGVuZDogbmV3IERhdGUoTWF0aC5taW4oZSwgbmV4dFNhdC5nZXRUaW1lKCkpKSxcbiAgICAgICAgICAgICAgICBjdXN0b206IEJvb2xlYW4ocmVmZXJlbmNlKSxcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHNldHRpbmdzLmFzc2lnbm1lbnRTcGFuID09PSAnc3RhcnQnKSB7XG4gICAgICAgIGNvbnN0IHMgPSBmcm9tRGF0ZU51bShhc3NpZ25tZW50LnN0YXJ0KVxuICAgICAgICBpZiAocy5nZXRUaW1lKCkgPj0gc3RhcnQuZ2V0VGltZSgpKSB7XG4gICAgICAgICAgICBzcGxpdC5wdXNoKHtcbiAgICAgICAgICAgICAgICBhc3NpZ25tZW50LFxuICAgICAgICAgICAgICAgIHN0YXJ0OiBzLFxuICAgICAgICAgICAgICAgIGVuZDogcyxcbiAgICAgICAgICAgICAgICBjdXN0b206IEJvb2xlYW4ocmVmZXJlbmNlKSxcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHNldHRpbmdzLmFzc2lnbm1lbnRTcGFuID09PSAnZW5kJykge1xuICAgICAgICBjb25zdCBlID0gYXNzaWdubWVudC5lbmQgPT09ICdGb3JldmVyJyA/IGFzc2lnbm1lbnQuZW5kIDogZnJvbURhdGVOdW0oYXNzaWdubWVudC5lbmQpXG4gICAgICAgIGNvbnN0IGRlID0gZSA9PT0gJ0ZvcmV2ZXInID8gZnJvbURhdGVOdW0oYXNzaWdubWVudC5zdGFydCkgOiBlXG4gICAgICAgIGlmIChkZS5nZXRUaW1lKCkgPD0gZW5kLmdldFRpbWUoKSkge1xuICAgICAgICAgICAgc3BsaXQucHVzaCh7XG4gICAgICAgICAgICAgICAgYXNzaWdubWVudCxcbiAgICAgICAgICAgICAgICBzdGFydDogZGUsXG4gICAgICAgICAgICAgICAgZW5kOiBlLFxuICAgICAgICAgICAgICAgIGN1c3RvbTogQm9vbGVhbihyZWZlcmVuY2UpLFxuICAgICAgICAgICAgICAgIHJlZmVyZW5jZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzcGxpdFxufVxuXG4vLyBUaGlzIGZ1bmN0aW9uIHdpbGwgY29udmVydCB0aGUgYXJyYXkgb2YgYXNzaWdubWVudHMgZ2VuZXJhdGVkIGJ5ICpwYXJzZSogaW50byByZWFkYWJsZSBIVE1MLlxuZXhwb3J0IGZ1bmN0aW9uIGRpc3BsYXkoZG9TY3JvbGw6IGJvb2xlYW4gPSB0cnVlKTogdm9pZCB7XG4gICAgY29uc29sZS50aW1lKCdEaXNwbGF5aW5nIGRhdGEnKVxuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSBnZXREYXRhKClcbiAgICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0RhdGEgc2hvdWxkIGhhdmUgYmVlbiBmZXRjaGVkIGJlZm9yZSBkaXNwbGF5KCkgd2FzIGNhbGxlZCcpXG4gICAgICAgIH1cblxuICAgICAgICBkb2N1bWVudC5ib2R5LnNldEF0dHJpYnV0ZSgnZGF0YS1wY3J2aWV3JywgZGF0YS5tb250aFZpZXcgPyAnbW9udGgnIDogJ290aGVyJylcbiAgICAgICAgY29uc3QgbWFpbiA9IF8kKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ21haW4nKSlcbiAgICAgICAgY29uc3QgdGFrZW46IHsgW2RhdGU6IG51bWJlcl06IG51bWJlcltdIH0gPSB7fVxuXG4gICAgICAgIGNvbnN0IHRpbWVhZnRlciA9IGdldFRpbWVBZnRlcihuZXcgRGF0ZSgpKVxuXG4gICAgICAgIGNvbnN0IHtzdGFydCwgZW5kfSA9IGdldFN0YXJ0RW5kRGF0ZXMoZGF0YSlcblxuICAgICAgICAvLyBTZXQgdGhlIHN0YXJ0IGRhdGUgdG8gYmUgYSBTdW5kYXkgYW5kIHRoZSBlbmQgZGF0ZSB0byBiZSBhIFNhdHVyZGF5XG4gICAgICAgIHN0YXJ0LnNldERhdGUoc3RhcnQuZ2V0RGF0ZSgpIC0gc3RhcnQuZ2V0RGF5KCkpXG4gICAgICAgIGVuZC5zZXREYXRlKGVuZC5nZXREYXRlKCkgKyAoNiAtIGVuZC5nZXREYXkoKSkpXG5cbiAgICAgICAgLy8gRmlyc3QgcG9wdWxhdGUgdGhlIGNhbGVuZGFyIHdpdGggYm94ZXMgZm9yIGVhY2ggZGF5XG4gICAgICAgIC8vIE9ubHkgY29uc2lkZXIgdGhlIHByZXZpb3VzIHNldCBvZiBhc3NpZ25tZW50cyBmb3IgYWN0aXZpdHkgcHVycG9zZXMgaWYgdGhlIG1vbnRoIGlzIHRoZSBzYW1lXG4gICAgICAgIGNvbnN0IGxhc3REYXRhID0gZGF0YS5tb250aE9mZnNldCA9PSAwID8gKGxvY2FsU3RvcmFnZVJlYWQoJ2RhdGEnKSBhcyBJQXBwbGljYXRpb25EYXRhKSA6IG51bGxcbiAgICAgICAgbGV0IHdrOiBIVE1MRWxlbWVudHxudWxsID0gbnVsbFxuICAgICAgICBpdGVyRGF5cyhzdGFydCwgZW5kLCAoZCkgPT4ge1xuICAgICAgICAgICAgaWYgKGQuZ2V0RGF5KCkgPT09IDApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpZCA9IGB3ayR7ZC5nZXRNb250aCgpfS0ke2QuZ2V0RGF0ZSgpfWAgLy8gRG9uJ3QgY3JlYXRlIGEgbmV3IHdlZWsgZWxlbWVudCBpZiBvbmUgYWxyZWFkeSBleGlzdHNcbiAgICAgICAgICAgICAgICB3ayA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKVxuICAgICAgICAgICAgICAgIGlmICh3ayA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHdrID0gY3JlYXRlV2VlayhpZClcbiAgICAgICAgICAgICAgICAgICAgbWFpbi5hcHBlbmRDaGlsZCh3aylcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghd2spIHRocm93IG5ldyBFcnJvcihgRXhwZWN0ZWQgd2VlayBlbGVtZW50IG9uIGRheSAke2R9IHRvIG5vdCBiZSBudWxsYClcbiAgICAgICAgICAgIGlmICh3ay5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdkYXknKS5sZW5ndGggPD0gZC5nZXREYXkoKSkge1xuICAgICAgICAgICAgICAgIHdrLmFwcGVuZENoaWxkKGNyZWF0ZURheShkKSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGFrZW5bZC5nZXRUaW1lKCldID0gW11cbiAgICAgICAgfSlcblxuICAgICAgICAvLyBTcGxpdCBhc3NpZ25tZW50cyB0YWtpbmcgbW9yZSB0aGFuIDEgd2Vla1xuICAgICAgICBjb25zdCBzcGxpdDogSVNwbGl0QXNzaWdubWVudFtdID0gW11cbiAgICAgICAgZGF0YS5hc3NpZ25tZW50cy5mb3JFYWNoKChhc3NpZ25tZW50LCBudW0pID0+IHtcbiAgICAgICAgICAgIHNwbGl0LnB1c2goLi4uZ2V0QXNzaWdubWVudFNwbGl0cyhhc3NpZ25tZW50LCBzdGFydCwgZW5kKSlcblxuICAgICAgICAgICAgLy8gQWN0aXZpdHkgc3R1ZmZcbiAgICAgICAgICAgIGlmIChsYXN0RGF0YSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgb2xkQXNzaWdubWVudCA9IGxhc3REYXRhLmFzc2lnbm1lbnRzLmZpbmQoKGEpID0+IGEuaWQgPT09IGFzc2lnbm1lbnQuaWQpXG4gICAgICAgICAgICAgICAgaWYgKG9sZEFzc2lnbm1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9sZEFzc2lnbm1lbnQuYm9keSAhPT0gYXNzaWdubWVudC5ib2R5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRBY3Rpdml0eSgnZWRpdCcsIG9sZEFzc2lnbm1lbnQsIG5ldyBEYXRlKCksIHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbGRBc3NpZ25tZW50LmNsYXNzICE9IG51bGwgPyBsYXN0RGF0YS5jbGFzc2VzW29sZEFzc2lnbm1lbnQuY2xhc3NdIDogdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlRnJvbU1vZGlmaWVkKGFzc2lnbm1lbnQuaWQpIC8vIElmIHRoZSBhc3NpZ25tZW50IGlzIG1vZGlmaWVkLCByZXNldCBpdFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGxhc3REYXRhLmFzc2lnbm1lbnRzLnNwbGljZShsYXN0RGF0YS5hc3NpZ25tZW50cy5pbmRleE9mKG9sZEFzc2lnbm1lbnQpLCAxKVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGFkZEFjdGl2aXR5KCdhZGQnLCBhc3NpZ25tZW50LCBuZXcgRGF0ZSgpLCB0cnVlKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgICAgICBpZiAobGFzdERhdGEgIT0gbnVsbCkge1xuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgYW55IG9mIHRoZSBsYXN0IGFzc2lnbm1lbnRzIHdlcmVuJ3QgZGVsZXRlZCAoc28gdGhleSBoYXZlIGJlZW4gZGVsZXRlZCBpbiBQQ1IpXG4gICAgICAgICAgICBsYXN0RGF0YS5hc3NpZ25tZW50cy5mb3JFYWNoKChhc3NpZ25tZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgYWRkQWN0aXZpdHkoJ2RlbGV0ZScsIGFzc2lnbm1lbnQsIG5ldyBEYXRlKCksIHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXNzaWdubWVudC5jbGFzcyAhPSBudWxsID8gbGFzdERhdGEuY2xhc3Nlc1thc3NpZ25tZW50LmNsYXNzXSA6IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICByZW1vdmVGcm9tRG9uZShhc3NpZ25tZW50LmlkKVxuICAgICAgICAgICAgICAgIHJlbW92ZUZyb21Nb2RpZmllZChhc3NpZ25tZW50LmlkKVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgLy8gVGhlbiBzYXZlIGEgbWF4aW11bSBvZiAxMjggYWN0aXZpdHkgaXRlbXNcbiAgICAgICAgICAgIHNhdmVBY3Rpdml0eSgpXG5cbiAgICAgICAgICAgIC8vIEFuZCBjb21wbGV0ZWQgYXNzaWdubWVudHMgKyBtb2RpZmljYXRpb25zXG4gICAgICAgICAgICBzYXZlRG9uZSgpXG4gICAgICAgICAgICBzYXZlTW9kaWZpZWQoKVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQWRkIGN1c3RvbSBhc3NpZ25tZW50cyB0byB0aGUgc3BsaXQgYXJyYXlcbiAgICAgICAgZ2V0RXh0cmEoKS5mb3JFYWNoKChjdXN0b20pID0+IHtcbiAgICAgICAgICAgIHNwbGl0LnB1c2goLi4uZ2V0QXNzaWdubWVudFNwbGl0cyhleHRyYVRvVGFzayhjdXN0b20sIGRhdGEpLCBzdGFydCwgZW5kLCBjdXN0b20pKVxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIENhbGN1bGF0ZSB0aGUgdG9kYXkncyB3ZWVrIGlkXG4gICAgICAgIGNvbnN0IHRkc3QgPSBuZXcgRGF0ZSgpXG4gICAgICAgIHRkc3Quc2V0RGF0ZSh0ZHN0LmdldERhdGUoKSAtIHRkc3QuZ2V0RGF5KCkpXG4gICAgICAgIGNvbnN0IHRvZGF5V2tJZCA9IGB3ayR7dGRzdC5nZXRNb250aCgpfS0ke3Rkc3QuZ2V0RGF0ZSgpfWBcblxuICAgICAgICAvLyBUaGVuIGFkZCBhc3NpZ25tZW50c1xuICAgICAgICBjb25zdCB3ZWVrSGVpZ2h0czogeyBbd2Vla0lkOiBzdHJpbmddOiBudW1iZXIgfSA9IHt9XG4gICAgICAgIGNvbnN0IHByZXZpb3VzQXNzaWdubWVudHM6IHsgW2lkOiBzdHJpbmddOiBIVE1MRWxlbWVudCB9ID0ge31cbiAgICAgICAgQXJyYXkucHJvdG90eXBlLmZvckVhY2guY2FsbChkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdhc3NpZ25tZW50JyksIChhc3NpZ25tZW50OiBIVE1MRWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgcHJldmlvdXNBc3NpZ25tZW50c1thc3NpZ25tZW50LmlkXSA9IGFzc2lnbm1lbnRcbiAgICAgICAgfSlcblxuICAgICAgICBzcGxpdC5mb3JFYWNoKChzKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB3ZWVrSWQgPSBjb21wdXRlV2Vla0lkKHMpXG4gICAgICAgICAgICB3ayA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHdlZWtJZClcbiAgICAgICAgICAgIGlmICh3ayA9PSBudWxsKSByZXR1cm5cblxuICAgICAgICAgICAgY29uc3QgZSA9IGNyZWF0ZUFzc2lnbm1lbnQocywgZGF0YSlcblxuICAgICAgICAgICAgLy8gQ2FsY3VsYXRlIGhvdyBtYW55IGFzc2lnbm1lbnRzIGFyZSBwbGFjZWQgYmVmb3JlIHRoZSBjdXJyZW50IG9uZVxuICAgICAgICAgICAgaWYgKCFzLmN1c3RvbSB8fCAhc2V0dGluZ3Muc2VwVGFza3MpIHtcbiAgICAgICAgICAgICAgICBsZXQgcG9zID0gMFxuICAgICAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZSBuby1sb29wc1xuICAgICAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBmb3VuZCA9IHRydWVcbiAgICAgICAgICAgICAgICAgICAgaXRlckRheXMocy5zdGFydCwgcy5lbmQgPT09ICdGb3JldmVyJyA/IHMuc3RhcnQgOiBzLmVuZCwgKGQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0YWtlbltkLmdldFRpbWUoKV0uaW5kZXhPZihwb3MpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kID0gZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZvdW5kKSB7IGJyZWFrIH1cbiAgICAgICAgICAgICAgICAgICAgcG9zKytcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBBcHBlbmQgdGhlIHBvc2l0aW9uIHRoZSBhc3NpZ25tZW50IGlzIGF0IHRvIHRoZSB0YWtlbiBhcnJheVxuICAgICAgICAgICAgICAgIGl0ZXJEYXlzKHMuc3RhcnQsIHMuZW5kID09PSAnRm9yZXZlcicgPyBzLnN0YXJ0IDogcy5lbmQsIChkKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRha2VuW2QuZ2V0VGltZSgpXS5wdXNoKHBvcylcbiAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgLy8gQ2FsY3VsYXRlIGhvdyBmYXIgZG93biB0aGUgYXNzaWdubWVudCBtdXN0IGJlIHBsYWNlZCBhcyB0byBub3QgYmxvY2sgdGhlIG9uZXMgYWJvdmUgaXRcbiAgICAgICAgICAgICAgICBlLnN0eWxlLm1hcmdpblRvcCA9IChwb3MgKiAzMCkgKyAncHgnXG5cbiAgICAgICAgICAgICAgICBpZiAoKHdlZWtIZWlnaHRzW3dlZWtJZF0gPT0gbnVsbCkgfHwgKHBvcyA+IHdlZWtIZWlnaHRzW3dlZWtJZF0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHdlZWtIZWlnaHRzW3dlZWtJZF0gPSBwb3NcbiAgICAgICAgICAgICAgICAgICAgd2suc3R5bGUuaGVpZ2h0ID0gNDcgKyAoKHBvcyArIDEpICogMzApICsgJ3B4J1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gSWYgdGhlIGFzc2lnbm1lbnQgaXMgYSB0ZXN0IGFuZCBpcyB1cGNvbWluZywgYWRkIGl0IHRvIHRoZSB1cGNvbWluZyB0ZXN0cyBwYW5lbC5cbiAgICAgICAgICAgIGlmIChzLmFzc2lnbm1lbnQuZW5kID49IHRvZGF5KCkgJiYgKHMuYXNzaWdubWVudC5iYXNlVHlwZSA9PT0gJ3Rlc3QnIHx8XG4gICAgICAgICAgICAgICAgKHNldHRpbmdzLnByb2plY3RzSW5UZXN0UGFuZSAmJiBzLmFzc2lnbm1lbnQuYmFzZVR5cGUgPT09ICdsb25ndGVybScpKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRlID0gZWxlbWVudCgnZGl2JywgWyd1cGNvbWluZ1Rlc3QnLCAnYXNzaWdubWVudEl0ZW0nLCBzLmFzc2lnbm1lbnQuYmFzZVR5cGVdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgPGkgY2xhc3M9J21hdGVyaWFsLWljb25zJz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke3MuYXNzaWdubWVudC5iYXNlVHlwZSA9PT0gJ2xvbmd0ZXJtJyA/ICdhc3NpZ25tZW50JyA6ICdhc3Nlc3NtZW50J31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPSd0aXRsZSc+JHtzLmFzc2lnbm1lbnQudGl0bGV9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNtYWxsPiR7c2VwYXJhdGVkQ2xhc3Mocy5hc3NpZ25tZW50LCBkYXRhKVsyXX08L3NtYWxsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz0ncmFuZ2UnPiR7ZGF0ZVN0cmluZyhzLmFzc2lnbm1lbnQuZW5kLCB0cnVlKX08L2Rpdj5gLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgdGVzdCR7cy5hc3NpZ25tZW50LmlkfWApXG4gICAgICAgICAgICAgICAgaWYgKHMuYXNzaWdubWVudC5jbGFzcykgdGUuc2V0QXR0cmlidXRlKCdkYXRhLWNsYXNzJywgZGF0YS5jbGFzc2VzW3MuYXNzaWdubWVudC5jbGFzc10pXG4gICAgICAgICAgICAgICAgdGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRvU2Nyb2xsaW5nID0gYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgc21vb3RoU2Nyb2xsKChlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCArIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wKSAtIDExNilcbiAgICAgICAgICAgICAgICAgICAgICAgIGUuY2xpY2soKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChkb2N1bWVudC5ib2R5LmdldEF0dHJpYnV0ZSgnZGF0YS12aWV3JykgPT09ICcwJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZG9TY3JvbGxpbmcoKVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgXyQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI25hdlRhYnM+bGk6Zmlyc3QtY2hpbGQnKSBhcyBIVE1MRWxlbWVudCkuY2xpY2soKVxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChkb1Njcm9sbGluZywgNTAwKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgIGlmIChhc3NpZ25tZW50SW5Eb25lKHMuYXNzaWdubWVudC5pZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGUuY2xhc3NMaXN0LmFkZCgnZG9uZScpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IHRlc3RFbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYHRlc3Qke3MuYXNzaWdubWVudC5pZH1gKVxuICAgICAgICAgICAgICAgIGlmICh0ZXN0RWxlbSkge1xuICAgICAgICAgICAgICAgIHRlc3RFbGVtLmlubmVySFRNTCA9IHRlLmlubmVySFRNTFxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1CeUlkKCdpbmZvVGVzdHMnKS5hcHBlbmRDaGlsZCh0ZSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGFscmVhZHkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChzLmFzc2lnbm1lbnQuaWQgKyB3ZWVrSWQpXG4gICAgICAgICAgICBpZiAoYWxyZWFkeSAhPSBudWxsKSB7IC8vIEFzc2lnbm1lbnQgYWxyZWFkeSBleGlzdHNcbiAgICAgICAgICAgICAgICBhbHJlYWR5LnN0eWxlLm1hcmdpblRvcCA9IGUuc3R5bGUubWFyZ2luVG9wXG4gICAgICAgICAgICAgICAgYWxyZWFkeS5zZXRBdHRyaWJ1dGUoJ2RhdGEtY2xhc3MnLFxuICAgICAgICAgICAgICAgICAgICBzLmN1c3RvbSAmJiBzZXR0aW5ncy5zZXBUYXNrQ2xhc3MgPyAnVGFzaycgOiBjbGFzc0J5SWQocy5hc3NpZ25tZW50LmNsYXNzKSlcbiAgICAgICAgICAgICAgICBpZiAoIWFzc2lnbm1lbnRJbk1vZGlmaWVkKHMuYXNzaWdubWVudC5pZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgYWxyZWFkeS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdib2R5JylbMF0uaW5uZXJIVE1MID0gZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdib2R5JylbMF0uaW5uZXJIVE1MXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF8kKGFscmVhZHkucXVlcnlTZWxlY3RvcignLmVkaXRzJykpLmNsYXNzTmFtZSA9IF8kKGUucXVlcnlTZWxlY3RvcignLmVkaXRzJykpLmNsYXNzTmFtZVxuICAgICAgICAgICAgICAgIGlmIChhbHJlYWR5LmNsYXNzTGlzdC50b2dnbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgYWxyZWFkeS5jbGFzc0xpc3QudG9nZ2xlKCdsaXN0RGlzcCcsIGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdsaXN0RGlzcCcpKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBnZXRFUyhhbHJlYWR5KS5mb3JFYWNoKChjbCkgPT4gYWxyZWFkeS5jbGFzc0xpc3QucmVtb3ZlKGNsKSlcbiAgICAgICAgICAgICAgICBnZXRFUyhlKS5mb3JFYWNoKChjbCkgPT4gYWxyZWFkeS5jbGFzc0xpc3QuYWRkKGNsKSlcbiAgICAgICAgICAgICAgICBXRUVLRU5EX0NMQVNTTkFNRVMuZm9yRWFjaCgoY2wpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgYWxyZWFkeS5jbGFzc0xpc3QucmVtb3ZlKGNsKVxuICAgICAgICAgICAgICAgICAgICBpZiAoZS5jbGFzc0xpc3QuY29udGFpbnMoY2wpKSBhbHJlYWR5LmNsYXNzTGlzdC5hZGQoY2wpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHMuY3VzdG9tICYmIHNldHRpbmdzLnNlcFRhc2tzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHN0ID0gTWF0aC5mbG9vcihzLnN0YXJ0LmdldFRpbWUoKSAvIDEwMDAgLyAzNjAwIC8gMjQpXG4gICAgICAgICAgICAgICAgICAgIGlmICgocy5hc3NpZ25tZW50LnN0YXJ0ID09PSBzdCkgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIChzLmFzc2lnbm1lbnQuZW5kID09PSAnRm9yZXZlcicgfHwgcy5hc3NpZ25tZW50LmVuZCA+PSB0b2RheSgpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZS5jbGFzc0xpc3QucmVtb3ZlKCdhc3NpZ25tZW50JylcbiAgICAgICAgICAgICAgICAgICAgICAgIGUuY2xhc3NMaXN0LmFkZCgndGFza1BhbmVJdGVtJylcbiAgICAgICAgICAgICAgICAgICAgICAgIGUuc3R5bGUub3JkZXIgPSBTdHJpbmcocy5hc3NpZ25tZW50LmVuZCA9PT0gJ0ZvcmV2ZXInID8gTnVtYmVyLk1BWF9WQUxVRSA6IHMuYXNzaWdubWVudC5lbmQpXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBsaW5rID0gZS5xdWVyeVNlbGVjdG9yKCcubGlua2VkJylcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsaW5rKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5pbnNlcnRCZWZvcmUoZWxlbWVudCgnc21hbGwnLCBbXSwgbGluay5pbm5lckhUTUwpLCBsaW5rKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmsucmVtb3ZlKClcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1CeUlkKCdpbmZvVGFza3NJbm5lcicpLmFwcGVuZENoaWxkKGUpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgeyB3ay5hcHBlbmRDaGlsZChlKSB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkZWxldGUgcHJldmlvdXNBc3NpZ25tZW50c1tzLmFzc2lnbm1lbnQuaWQgKyB3ZWVrSWRdXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gRGVsZXRlIGFueSBhc3NpZ25tZW50cyB0aGF0IGhhdmUgYmVlbiBkZWxldGVkIHNpbmNlIHVwZGF0aW5nXG4gICAgICAgIE9iamVjdC5lbnRyaWVzKHByZXZpb3VzQXNzaWdubWVudHMpLmZvckVhY2goKFtuYW1lLCBhc3NpZ25tZW50XSkgPT4ge1xuICAgICAgICAgICAgaWYgKGFzc2lnbm1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdmdWxsJykpIHtcbiAgICAgICAgICAgICAgICBlbGVtQnlJZCgnYmFja2dyb3VuZCcpLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhc3NpZ25tZW50LnJlbW92ZSgpXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gU2Nyb2xsIHRvIHRoZSBjb3JyZWN0IHBvc2l0aW9uIGluIGNhbGVuZGFyIHZpZXdcbiAgICAgICAgaWYgKHdlZWtIZWlnaHRzW3RvZGF5V2tJZF0gIT0gbnVsbCkge1xuICAgICAgICAgICAgbGV0IGggPSAwXG4gICAgICAgICAgICBjb25zdCBzdyA9ICh3a2lkOiBzdHJpbmcpID0+IHdraWQuc3Vic3RyaW5nKDIpLnNwbGl0KCctJykubWFwKCh4KSA9PiBOdW1iZXIoeCkpXG4gICAgICAgICAgICBjb25zdCB0b2RheVdrID0gc3codG9kYXlXa0lkKVxuICAgICAgICAgICAgT2JqZWN0LmVudHJpZXMod2Vla0hlaWdodHMpLmZvckVhY2goKFt3a0lkLCB2YWxdKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3Qgd2tTcGxpdCA9IHN3KHdrSWQpXG4gICAgICAgICAgICAgICAgaWYgKCh3a1NwbGl0WzBdIDwgdG9kYXlXa1swXSkgfHwgKCh3a1NwbGl0WzBdID09PSB0b2RheVdrWzBdKSAmJiAod2tTcGxpdFsxXSA8IHRvZGF5V2tbMV0pKSkge1xuICAgICAgICAgICAgICAgICAgICBoICs9IHZhbFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBzY3JvbGwgPSAoaCAqIDMwKSArIDExMiArIDE0XG4gICAgICAgICAgICAvLyBBbHNvIHNob3cgdGhlIGRheSBoZWFkZXJzIGlmIHRvZGF5J3MgZGF0ZSBpcyBkaXNwbGF5ZWQgaW4gdGhlIGZpcnN0IHJvdyBvZiB0aGUgY2FsZW5kYXJcbiAgICAgICAgICAgIGlmIChzY3JvbGwgPCA1MCkgc2Nyb2xsID0gMFxuICAgICAgICAgICAgaWYgKGRvU2Nyb2xsICYmIChkb2N1bWVudC5ib2R5LmdldEF0dHJpYnV0ZSgnZGF0YS12aWV3JykgPT09ICcwJykgJiZcbiAgICAgICAgICAgICAgICAhZG9jdW1lbnQuYm9keS5xdWVyeVNlbGVjdG9yKCcuZnVsbCcpKSB7XG4gICAgICAgICAgICAgICAgLy8gaW4gY2FsZW5kYXIgdmlld1xuICAgICAgICAgICAgICAgIHdpbmRvdy5zY3JvbGxUbygwLCBzY3JvbGwpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC50b2dnbGUoJ25vTGlzdCcsXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYXNzaWdubWVudC5saXN0RGlzcDpub3QoLmRvbmUpJykubGVuZ3RoID09PSAwKVxuICAgICAgICBpZiAoZG9jdW1lbnQuYm9keS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmlldycpID09PSAnMScpIHsgLy8gaW4gbGlzdCB2aWV3XG4gICAgICAgICAgICByZXNpemUoKVxuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGRpc3BsYXlFcnJvcihlcnIpXG4gICAgfVxuICAgIGNvbnNvbGUudGltZUVuZCgnRGlzcGxheWluZyBkYXRhJylcbn1cblxuLy8gVGhlIGZ1bmN0aW9uIGJlbG93IGNvbnZlcnRzIGFuIHVwZGF0ZSB0aW1lIHRvIGEgaHVtYW4tcmVhZGFibGUgZGF0ZS5cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRVcGRhdGUoZGF0ZTogbnVtYmVyKTogc3RyaW5nIHtcbiAgY29uc3Qgbm93ID0gbmV3IERhdGUoKVxuICBjb25zdCB1cGRhdGUgPSBuZXcgRGF0ZSgrZGF0ZSlcbiAgaWYgKG5vdy5nZXREYXRlKCkgPT09IHVwZGF0ZS5nZXREYXRlKCkpIHtcbiAgICBsZXQgYW1wbSA9ICdBTSdcbiAgICBsZXQgaHIgPSB1cGRhdGUuZ2V0SG91cnMoKVxuICAgIGlmIChociA+IDEyKSB7XG4gICAgICBhbXBtID0gJ1BNJ1xuICAgICAgaHIgLT0gMTJcbiAgICB9XG4gICAgY29uc3QgbWluID0gdXBkYXRlLmdldE1pbnV0ZXMoKVxuICAgIHJldHVybiBgVG9kYXkgYXQgJHtocn06JHttaW4gPCAxMCA/IGAwJHttaW59YCA6IG1pbn0gJHthbXBtfWBcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBkYXlzUGFzdCA9IE1hdGguY2VpbCgobm93LmdldFRpbWUoKSAtIHVwZGF0ZS5nZXRUaW1lKCkpIC8gMTAwMCAvIDM2MDAgLyAyNClcbiAgICBpZiAoZGF5c1Bhc3QgPT09IDEpIHsgcmV0dXJuICdZZXN0ZXJkYXknIH0gZWxzZSB7IHJldHVybiBkYXlzUGFzdCArICcgZGF5cyBhZ28nIH1cbiAgfVxufVxuIiwibGV0IGxpc3REYXRlT2Zmc2V0ID0gMFxubGV0IGNhbERhdGVPZmZzZXQgPSAwXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRMaXN0RGF0ZU9mZnNldCgpOiBudW1iZXIge1xuICAgIHJldHVybiBsaXN0RGF0ZU9mZnNldFxufVxuXG5leHBvcnQgZnVuY3Rpb24gaW5jcmVtZW50TGlzdERhdGVPZmZzZXQoKTogdm9pZCB7XG4gICAgbGlzdERhdGVPZmZzZXQgKz0gMVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVjcmVtZW50TGlzdERhdGVPZmZzZXQoKTogdm9pZCB7XG4gICAgbGlzdERhdGVPZmZzZXQgLT0gMVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0TGlzdERhdGVPZmZzZXQob2Zmc2V0OiBudW1iZXIpOiB2b2lkIHtcbiAgICBsaXN0RGF0ZU9mZnNldCA9IG9mZnNldFxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2FsRGF0ZU9mZnNldCgpOiBudW1iZXIge1xuICAgIHJldHVybiBjYWxEYXRlT2Zmc2V0XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbmNyZW1lbnRDYWxEYXRlT2Zmc2V0KCk6IHZvaWQge1xuICAgIGNhbERhdGVPZmZzZXQgKz0gMVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVjcmVtZW50Q2FsRGF0ZU9mZnNldCgpOiB2b2lkIHtcbiAgICBjYWxEYXRlT2Zmc2V0IC09IDFcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldENhbERhdGVPZmZzZXQob2Zmc2V0OiBudW1iZXIpOiB2b2lkIHtcbiAgICBjYWxEYXRlT2Zmc2V0ID0gb2Zmc2V0XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB6ZXJvRGF0ZU9mZnNldHMoKTogdm9pZCB7XG4gICAgbGlzdERhdGVPZmZzZXQgPSAwXG4gICAgY2FsRGF0ZU9mZnNldCA9IDBcbn1cbiIsIi8qKlxuICogVGhpcyBtb2R1bGUgY29udGFpbnMgY29kZSB0byBib3RoIGZldGNoIGFuZCBwYXJzZSBhc3NpZ25tZW50cyBmcm9tIFBDUi5cbiAqL1xuaW1wb3J0IHsgdXBkYXRlQXZhdGFyIH0gZnJvbSAnLi9jb21wb25lbnRzL2F2YXRhcidcbmltcG9ydCB7IGRpc3BsYXlFcnJvciB9IGZyb20gJy4vY29tcG9uZW50cy9lcnJvckRpc3BsYXknXG5pbXBvcnQgeyBzbmFja2JhciB9IGZyb20gJy4vY29tcG9uZW50cy9zbmFja2JhcidcbmltcG9ydCB7IGRlbGV0ZUNvb2tpZSwgZ2V0Q29va2llLCBzZXRDb29raWUgfSBmcm9tICcuL2Nvb2tpZXMnXG5pbXBvcnQgeyB0b0RhdGVOdW0gfSBmcm9tICcuL2RhdGVzJ1xuaW1wb3J0IHsgZGlzcGxheSwgZm9ybWF0VXBkYXRlIH0gZnJvbSAnLi9kaXNwbGF5J1xuaW1wb3J0IHsgemVyb0RhdGVPZmZzZXRzLCBnZXRDYWxEYXRlT2Zmc2V0LCBnZXRMaXN0RGF0ZU9mZnNldCB9IGZyb20gJy4vbmF2aWdhdGlvbidcbmltcG9ydCB7IF8kLCBlbGVtQnlJZCwgbG9jYWxTdG9yYWdlV3JpdGUsIHNlbmQgfSBmcm9tICcuL3V0aWwnXG5cbmNvbnN0IFBDUl9VUkwgPSAnaHR0cHM6Ly93ZWJhcHBzY2EucGNyc29mdC5jb20nXG5jb25zdCBBU1NJR05NRU5UU19VUkwgPSBgJHtQQ1JfVVJMfS9DbHVlL1NDLUFzc2lnbm1lbnRzLVN0YXJ0LWFuZC1FbmQtRGF0ZS0oTm8tUmFuZ2UpLzE4NTk0YFxuY29uc3QgTE9HSU5fVVJMID0gYCR7UENSX1VSTH0vQ2x1ZS9TQy1TdHVkZW50LVBvcnRhbC1Mb2dpbi1MREFQLzg0NjQ/cmV0dXJuVXJsPSR7ZW5jb2RlVVJJQ29tcG9uZW50KEFTU0lHTk1FTlRTX1VSTCl9YFxuY29uc3QgQVRUQUNITUVOVFNfVVJMID0gYCR7UENSX1VSTH0vQ2x1ZS9Db21tb24vQXR0YWNobWVudFJlbmRlci5hc3B4YFxuY29uc3QgRk9STV9IRUFERVJfT05MWSA9IHsgJ0NvbnRlbnQtdHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnIH1cbmNvbnN0IE9ORV9NSU5VVEVfTVMgPSA2MDAwMFxuXG5jb25zdCBwcm9ncmVzc0VsZW1lbnQgPSBlbGVtQnlJZCgncHJvZ3Jlc3MnKVxuY29uc3QgbG9naW5EaWFsb2cgPSBlbGVtQnlJZCgnbG9naW4nKVxuY29uc3QgbG9naW5CYWNrZ3JvdW5kID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xvZ2luQmFja2dyb3VuZCcpXG5jb25zdCBsYXN0VXBkYXRlRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGFzdFVwZGF0ZScpXG5jb25zdCB1c2VybmFtZUVsID0gZWxlbUJ5SWQoJ3VzZXJuYW1lJykgYXMgSFRNTElucHV0RWxlbWVudFxuY29uc3QgcGFzc3dvcmRFbCA9IGVsZW1CeUlkKCdwYXNzd29yZCcpIGFzIEhUTUxJbnB1dEVsZW1lbnRcbmNvbnN0IHJlbWVtYmVyQ2hlY2sgPSBlbGVtQnlJZCgncmVtZW1iZXInKSBhcyBIVE1MSW5wdXRFbGVtZW50XG5jb25zdCBpbmNvcnJlY3RMb2dpbkVsID0gZWxlbUJ5SWQoJ2xvZ2luSW5jb3JyZWN0JylcblxuLy8gVE9ETyBrZWVwaW5nIHRoZXNlIGFzIGEgZ2xvYmFsIHZhcnMgaXMgYmFkXG5jb25zdCBsb2dpbkhlYWRlcnM6IHtbaGVhZGVyOiBzdHJpbmddOiBzdHJpbmd9ID0ge31cbmNvbnN0IHZpZXdEYXRhOiB7W2hhZGVyOiBzdHJpbmddOiBzdHJpbmd9ID0ge31cbmxldCBsYXN0VXBkYXRlID0gMCAvLyBUaGUgbGFzdCB0aW1lIGV2ZXJ5dGhpbmcgd2FzIHVwZGF0ZWRcblxuZXhwb3J0IGludGVyZmFjZSBJQXBwbGljYXRpb25EYXRhIHtcbiAgICBjbGFzc2VzOiBzdHJpbmdbXVxuICAgIGFzc2lnbm1lbnRzOiBJQXNzaWdubWVudFtdXG4gICAgbW9udGhWaWV3OiBib29sZWFuXG4gICAgbW9udGhPZmZzZXQ6IG51bWJlclxufVxuXG5leHBvcnQgaW50ZXJmYWNlIElBc3NpZ25tZW50IHtcbiAgICBzdGFydDogbnVtYmVyXG4gICAgZW5kOiBudW1iZXJ8J0ZvcmV2ZXInXG4gICAgYXR0YWNobWVudHM6IEF0dGFjaG1lbnRBcnJheVtdXG4gICAgYm9keTogc3RyaW5nXG4gICAgdHlwZTogc3RyaW5nXG4gICAgYmFzZVR5cGU6IHN0cmluZ1xuICAgIGNsYXNzOiBudW1iZXJ8bnVsbCxcbiAgICB0aXRsZTogc3RyaW5nXG4gICAgaWQ6IHN0cmluZ1xufVxuXG5leHBvcnQgdHlwZSBBdHRhY2htZW50QXJyYXkgPSBbc3RyaW5nLCBzdHJpbmddXG5cbi8vIFRoaXMgaXMgdGhlIGZ1bmN0aW9uIHRoYXQgcmV0cmlldmVzIHlvdXIgYXNzaWdubWVudHMgZnJvbSBQQ1IuXG4vL1xuLy8gRmlyc3QsIGEgcmVxdWVzdCBpcyBzZW50IHRvIFBDUiB0byBsb2FkIHRoZSBwYWdlIHlvdSB3b3VsZCBub3JtYWxseSBzZWUgd2hlbiBhY2Nlc3NpbmcgUENSLlxuLy9cbi8vIEJlY2F1c2UgdGhpcyBpcyBydW4gYXMgYSBjaHJvbWUgZXh0ZW5zaW9uLCB0aGlzIHBhZ2UgY2FuIGJlIGFjY2Vzc2VkLiBPdGhlcndpc2UsIHRoZSBicm93c2VyXG4vLyB3b3VsZCB0aHJvdyBhbiBlcnJvciBmb3Igc2VjdXJpdHkgcmVhc29ucyAoeW91IGRvbid0IHdhbnQgYSByYW5kb20gd2Vic2l0ZSBiZWluZyBhYmxlIHRvIGFjY2Vzc1xuLy8gY29uZmlkZW50aWFsIGRhdGEgZnJvbSBhIHdlYnNpdGUgeW91IGhhdmUgbG9nZ2VkIGludG8pLlxuXG4vKipcbiAqIEZldGNoZXMgZGF0YSBmcm9tIFBDUiBhbmQgaWYgdGhlIHVzZXIgaXMgbG9nZ2VkIGluIHBhcnNlcyBhbmQgZGlzcGxheXMgaXRcbiAqIEBwYXJhbSBvdmVycmlkZSBXaGV0aGVyIHRvIGZvcmNlIGFuIHVwZGF0ZSBldmVuIHRoZXJlIHdhcyBvbmUgcmVjZW50bHlcbiAqIEBwYXJhbSBkYXRhICBPcHRpb25hbCBkYXRhIHRvIGJlIHBvc3RlZCB0byBQQ1JcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZldGNoKG92ZXJyaWRlOiBib29sZWFuID0gZmFsc2UsIGRhdGE/OiBzdHJpbmcsIG9uc3VjY2VzczogKCkgPT4gdm9pZCA9IGRpc3BsYXksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25sb2dpbj86ICgpID0+IHZvaWQpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoIW92ZXJyaWRlICYmIERhdGUubm93KCkgLSBsYXN0VXBkYXRlIDwgT05FX01JTlVURV9NUykgcmV0dXJuXG4gICAgbGFzdFVwZGF0ZSA9IERhdGUubm93KClcblxuICAgIC8vIFJlcXVlc3QgYSBuZXcgbW9udGggaWYgbmVlZGVkXG4gICAgY29uc3QgbW9udGhPZmZzZXQgPSBnZXRDYWxEYXRlT2Zmc2V0KClcbiAgICBpZiAobW9udGhPZmZzZXQgIT09IDApIHtcbiAgICAgICAgY29uc3QgdG9kYXkgPSBuZXcgRGF0ZSgpXG4gICAgICAgIHRvZGF5LnNldE1vbnRoKHRvZGF5LmdldE1vbnRoKCkgKyBnZXRDYWxEYXRlT2Zmc2V0KCkpXG4gICAgICAgIC8vIFJlbWVtYmVyIG1vbnRocyBhcmUgemVyby1pbmRleGVkXG4gICAgICAgIGNvbnN0IGRhdGVBcnJheSA9IFt0b2RheS5nZXRGdWxsWWVhcigpLCB0b2RheS5nZXRNb250aCgpICsgMSwgMV1cbiAgICAgICAgY29uc3QgbmV3Vmlld0RhdGEgPSB7XG4gICAgICAgICAgICAuLi52aWV3RGF0YSxcbiAgICAgICAgICAgIF9fRVZFTlRUQVJHRVQ6ICdjdGwwMCRjdGwwMCRiYXNlQ29udGVudCRiYXNlQ29udGVudCRmbGFzaFRvcCRjdGwwMCRSYWRTY2hlZHVsZXIxJFNlbGVjdGVkRGF0ZUNhbGVuZGFyJyxcbiAgICAgICAgICAgIF9fRVZFTlRBUkdVTUVOVDogJ2QnLFxuICAgICAgICAgICAgY3RsMDBfY3RsMDBfYmFzZUNvbnRlbnRfYmFzZUNvbnRlbnRfZmxhc2hUb3BfY3RsMDBfUmFkU2NoZWR1bGVyMV9TZWxlY3RlZERhdGVDYWxlbmRhcl9TRDpcbiAgICAgICAgICAgICAgICBKU09OLnN0cmluZ2lmeShbZGF0ZUFycmF5XSksXG4gICAgICAgICAgICBjdGwwMF9jdGwwMF9iYXNlQ29udGVudF9iYXNlQ29udGVudF9mbGFzaFRvcF9jdGwwMF9SYWRTY2hlZHVsZXIxX1NlbGVjdGVkRGF0ZUNhbGVuZGFyX0FEOlxuICAgICAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KFtbMTkwMCwgMSwgMV0sIFsyMDk5LCAxMiwgMzBdLCBkYXRlQXJyYXldKSxcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwb3N0QXJyYXk6IHN0cmluZ1tdID0gW10gLy8gQXJyYXkgb2YgZGF0YSB0byBwb3N0XG4gICAgICAgIE9iamVjdC5lbnRyaWVzKG5ld1ZpZXdEYXRhKS5mb3JFYWNoKChbaCwgdl0pID0+IHtcbiAgICAgICAgICAgIHBvc3RBcnJheS5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChoKSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudCh2KSlcbiAgICAgICAgfSlcbiAgICAgICAgZGF0YSA9IChkYXRhID8gZGF0YSArICcmJyA6ICcnKSArIHBvc3RBcnJheS5qb2luKCcmJylcbiAgICB9XG5cbiAgICBjb25zdCBoZWFkZXJzID0gZGF0YSA/IEZPUk1fSEVBREVSX09OTFkgOiB1bmRlZmluZWRcbiAgICBjb25zb2xlLnRpbWUoJ0ZldGNoaW5nIGFzc2lnbm1lbnRzJylcbiAgICB0cnkge1xuICAgICAgICBjb25zdCByZXNwID0gYXdhaXQgc2VuZChBU1NJR05NRU5UU19VUkwsICdkb2N1bWVudCcsIGhlYWRlcnMsIGRhdGEsIHByb2dyZXNzRWxlbWVudClcbiAgICAgICAgY29uc29sZS50aW1lRW5kKCdGZXRjaGluZyBhc3NpZ25tZW50cycpXG4gICAgICAgIGlmIChyZXNwLnJlc3BvbnNlVVJMLmluZGV4T2YoJ0xvZ2luJykgIT09IC0xKSB7XG4gICAgICAgICAgICAvLyBXZSBoYXZlIHRvIGxvZyBpbiBub3dcbiAgICAgICAgICAgIChyZXNwLnJlc3BvbnNlIGFzIEhUTUxEb2N1bWVudCkuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2lucHV0JykuZm9yRWFjaCgoZSkgPT4ge1xuICAgICAgICAgICAgICAgIGxvZ2luSGVhZGVyc1tlLm5hbWVdID0gZS52YWx1ZSB8fCAnJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdOZWVkIHRvIGxvZyBpbicpXG4gICAgICAgICAgICBjb25zdCB1cCA9IGdldENvb2tpZSgndXNlclBhc3MnKSAvLyBBdHRlbXB0cyB0byBnZXQgdGhlIGNvb2tpZSAqdXNlclBhc3MqLCB3aGljaCBpcyBzZXQgaWYgdGhlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBcIlJlbWVtYmVyIG1lXCIgY2hlY2tib3ggaXMgY2hlY2tlZCB3aGVuIGxvZ2dpbmcgaW4gdGhyb3VnaCBDaGVja1BDUlxuICAgICAgICAgICAgaWYgKHVwID09PSAnJykge1xuICAgICAgICAgICAgICAgIGlmIChsb2dpbkJhY2tncm91bmQpIGxvZ2luQmFja2dyb3VuZC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xuICAgICAgICAgICAgICAgIGxvZ2luRGlhbG9nLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG4gICAgICAgICAgICAgICAgaWYgKG9ubG9naW4pIG9ubG9naW4oKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBCZWNhdXNlIHdlIHdlcmUgcmVtZW1iZXJlZCwgd2UgY2FuIGxvZyBpbiBpbW1lZGlhdGVseSB3aXRob3V0IHdhaXRpbmcgZm9yIHRoZVxuICAgICAgICAgICAgICAgIC8vIHVzZXIgdG8gbG9nIGluIHRocm91Z2ggdGhlIGxvZ2luIGZvcm1cbiAgICAgICAgICAgICAgICBkb2xvZ2luKHdpbmRvdy5hdG9iKHVwKS5zcGxpdCgnOicpIGFzIFtzdHJpbmcsIHN0cmluZ10sIGZhbHNlLCBvbnN1Y2Nlc3MpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBMb2dnZWQgaW4gbm93XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnRmV0Y2hpbmcgYXNzaWdubWVudHMgc3VjY2Vzc2Z1bCcpXG4gICAgICAgICAgICBjb25zdCB0ID0gRGF0ZS5ub3coKVxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLmxhc3RVcGRhdGUgPSB0XG4gICAgICAgICAgICBpZiAobGFzdFVwZGF0ZUVsKSBsYXN0VXBkYXRlRWwuaW5uZXJIVE1MID0gZm9ybWF0VXBkYXRlKHQpXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHBhcnNlKHJlc3AucmVzcG9uc2UsIG1vbnRoT2Zmc2V0KVxuICAgICAgICAgICAgICAgIG9uc3VjY2VzcygpXG4gICAgICAgICAgICAgICAgaWYgKG1vbnRoT2Zmc2V0ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZVdyaXRlKCdkYXRhJywgZ2V0RGF0YSgpKSAvLyBTdG9yZSBmb3Igb2ZmbGluZSB1c2VcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKVxuICAgICAgICAgICAgICAgIGRpc3BsYXlFcnJvcihlcnJvcilcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdDb3VsZCBub3QgZmV0Y2ggYXNzaWdubWVudHM7IFlvdSBhcmUgcHJvYmFibHkgb2ZmbGluZS4gSGVyZVxcJ3MgdGhlIGVycm9yOicsIGVycm9yKVxuICAgICAgICBzbmFja2JhcignQ291bGQgbm90IGZldGNoIHlvdXIgYXNzaWdubWVudHMnLCAnUmV0cnknLCAoKSA9PiBmZXRjaCh0cnVlKSlcbiAgICB9XG59XG5cbi8qKlxuICogTG9ncyB0aGUgdXNlciBpbnRvIFBDUlxuICogQHBhcmFtIHZhbCAgIEFuIG9wdGlvbmFsIGxlbmd0aC0yIGFycmF5IG9mIHRoZSBmb3JtIFt1c2VybmFtZSwgcGFzc3dvcmRdIHRvIHVzZSB0aGUgdXNlciBpbiB3aXRoLlxuICogICAgICAgICAgICAgIElmIHRoaXMgYXJyYXkgaXMgbm90IGdpdmVuIHRoZSBsb2dpbiBkaWFsb2cgaW5wdXRzIHdpbGwgYmUgdXNlZC5cbiAqIEBwYXJhbSBzdWJtaXRFdnQgV2hldGhlciB0byBvdmVycmlkZSB0aGUgdXNlcm5hbWUgYW5kIHBhc3N3b3JkIHN1cHBsZWlkIGluIHZhbCB3aXRoIHRoZSB2YWx1ZXMgb2YgdGhlIGlucHV0IGVsZW1lbnRzXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkb2xvZ2luKHZhbD86IFtzdHJpbmcsIHN0cmluZ118bnVsbCwgc3VibWl0RXZ0OiBib29sZWFuID0gZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbnN1Y2Nlc3M6ICgpID0+IHZvaWQgPSBkaXNwbGF5KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgbG9naW5EaWFsb2cuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgaWYgKGxvZ2luQmFja2dyb3VuZCkgbG9naW5CYWNrZ3JvdW5kLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcbiAgICB9LCAzNTApXG5cbiAgICBjb25zdCBwb3N0QXJyYXk6IHN0cmluZ1tdID0gW10gLy8gQXJyYXkgb2YgZGF0YSB0byBwb3N0XG4gICAgbG9jYWxTdG9yYWdlV3JpdGUoJ3VzZXJuYW1lJywgdmFsICYmICFzdWJtaXRFdnQgPyB2YWxbMF0gOiB1c2VybmFtZUVsLnZhbHVlKVxuICAgIHVwZGF0ZUF2YXRhcigpXG4gICAgT2JqZWN0LmtleXMobG9naW5IZWFkZXJzKS5mb3JFYWNoKChoKSA9PiAge1xuICAgICAgICAvLyBMb29wIHRocm91Z2ggdGhlIGlucHV0IGVsZW1lbnRzIGNvbnRhaW5lZCBpbiB0aGUgbG9naW4gcGFnZS4gQXMgbWVudGlvbmVkIGJlZm9yZSwgdGhleVxuICAgICAgICAvLyB3aWxsIGJlIHNlbnQgdG8gUENSIHRvIGxvZyBpbi5cbiAgICAgICAgaWYgKGgudG9Mb3dlckNhc2UoKS5pbmRleE9mKCd1c2VyJykgIT09IC0xKSB7XG4gICAgICAgICAgICBsb2dpbkhlYWRlcnNbaF0gPSB2YWwgJiYgIXN1Ym1pdEV2dCA/IHZhbFswXSA6IHVzZXJuYW1lRWwudmFsdWVcbiAgICAgICAgfVxuICAgICAgICBpZiAoaC50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ3Bhc3MnKSAhPT0gLTEpIHtcbiAgICAgICAgICAgIGxvZ2luSGVhZGVyc1toXSA9IHZhbCAmJiAhc3VibWl0RXZ0ID8gdmFsWzFdIDogcGFzc3dvcmRFbC52YWx1ZVxuICAgICAgICB9XG4gICAgICAgIHBvc3RBcnJheS5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChoKSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudChsb2dpbkhlYWRlcnNbaF0pKVxuICAgIH0pXG5cbiAgICAvLyBOb3cgc2VuZCB0aGUgbG9naW4gcmVxdWVzdCB0byBQQ1JcbiAgICBjb25zb2xlLnRpbWUoJ0xvZ2dpbmcgaW4nKVxuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJlc3AgPSBhd2FpdCBzZW5kKExPR0lOX1VSTCwgJ2RvY3VtZW50JywgRk9STV9IRUFERVJfT05MWSwgcG9zdEFycmF5LmpvaW4oJyYnKSwgcHJvZ3Jlc3NFbGVtZW50KVxuICAgICAgICBjb25zb2xlLnRpbWVFbmQoJ0xvZ2dpbmcgaW4nKVxuICAgICAgICBpZiAocmVzcC5yZXNwb25zZVVSTC5pbmRleE9mKCdMb2dpbicpICE9PSAtMSkge1xuICAgICAgICAvLyBJZiBQQ1Igc3RpbGwgd2FudHMgdXMgdG8gbG9nIGluLCB0aGVuIHRoZSB1c2VybmFtZSBvciBwYXNzd29yZCBlbnRlcmVkIHdlcmUgaW5jb3JyZWN0LlxuICAgICAgICAgICAgaW5jb3JyZWN0TG9naW5FbC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xuICAgICAgICAgICAgcGFzc3dvcmRFbC52YWx1ZSA9ICcnXG5cbiAgICAgICAgICAgIGxvZ2luRGlhbG9nLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG4gICAgICAgICAgICBpZiAobG9naW5CYWNrZ3JvdW5kKSBsb2dpbkJhY2tncm91bmQuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIE90aGVyd2lzZSwgd2UgYXJlIGxvZ2dlZCBpblxuICAgICAgICAgICAgaWYgKHJlbWVtYmVyQ2hlY2suY2hlY2tlZCkgeyAvLyBJcyB0aGUgXCJyZW1lbWJlciBtZVwiIGNoZWNrYm94IGNoZWNrZWQ/XG4gICAgICAgICAgICAgICAgLy8gU2V0IGEgY29va2llIHdpdGggdGhlIHVzZXJuYW1lIGFuZCBwYXNzd29yZCBzbyB3ZSBjYW4gbG9nIGluIGF1dG9tYXRpY2FsbHkgaW4gdGhlXG4gICAgICAgICAgICAgICAgLy8gZnV0dXJlIHdpdGhvdXQgaGF2aW5nIHRvIHByb21wdCBmb3IgYSB1c2VybmFtZSBhbmQgcGFzc3dvcmQgYWdhaW5cbiAgICAgICAgICAgICAgICBzZXRDb29raWUoJ3VzZXJQYXNzJywgd2luZG93LmJ0b2EodXNlcm5hbWVFbC52YWx1ZSArICc6JyArIHBhc3N3b3JkRWwudmFsdWUpLCAxNClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGxvYWRpbmdCYXIuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiXG4gICAgICAgICAgICBjb25zdCB0ID0gRGF0ZS5ub3coKVxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLmxhc3RVcGRhdGUgPSB0XG4gICAgICAgICAgICBpZiAobGFzdFVwZGF0ZUVsKSBsYXN0VXBkYXRlRWwuaW5uZXJIVE1MID0gZm9ybWF0VXBkYXRlKHQpXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHBhcnNlKHJlc3AucmVzcG9uc2UsIDApIC8vIFBhcnNlIHRoZSBkYXRhIFBDUiBoYXMgcmVwbGllZCB3aXRoXG4gICAgICAgICAgICAgICAgb25zdWNjZXNzKClcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2VXcml0ZSgnZGF0YScsIGdldERhdGEoKSkgLy8gU3RvcmUgZm9yIG9mZmxpbmUgdXNlXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZSlcbiAgICAgICAgICAgICAgICBkaXNwbGF5RXJyb3IoZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICBjb25zb2xlLmxvZygnQ291bGQgbm90IGxvZyBpbiB0byBQQ1IuIEVpdGhlciB5b3VyIG5ldHdvcmsgY29ubmVjdGlvbiB3YXMgbG9zdCBkdXJpbmcgeW91ciB2aXNpdCAnICtcbiAgICAgICAgICAgICAgICAgICAgICdvciBQQ1IgaXMganVzdCBub3Qgd29ya2luZy4gSGVyZVxcJ3MgdGhlIGVycm9yOicsIGVycm9yKVxuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldERhdGEoKTogSUFwcGxpY2F0aW9uRGF0YXx1bmRlZmluZWQge1xuICAgIHJldHVybiAod2luZG93IGFzIGFueSkuZGF0YVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2xhc3NlcygpOiBzdHJpbmdbXSB7XG4gICAgY29uc3QgZGF0YSA9IGdldERhdGEoKVxuICAgIGlmICghZGF0YSkgcmV0dXJuIFtdXG4gICAgcmV0dXJuIGRhdGEuY2xhc3Nlc1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0RGF0YShkYXRhOiBJQXBwbGljYXRpb25EYXRhKTogdm9pZCB7XG4gICAgKHdpbmRvdyBhcyBhbnkpLmRhdGEgPSBkYXRhXG59XG5cbi8vIEluIFBDUidzIGludGVyZmFjZSwgeW91IGNhbiBjbGljayBhIGRhdGUgaW4gbW9udGggb3Igd2VlayB2aWV3IHRvIHNlZSBpdCBpbiBkYXkgdmlldy5cbi8vIFRoZXJlZm9yZSwgdGhlIEhUTUwgZWxlbWVudCB0aGF0IHNob3dzIHRoZSBkYXRlIHRoYXQgeW91IGNhbiBjbGljayBvbiBoYXMgYSBoeXBlcmxpbmsgdGhhdCBsb29rcyBsaWtlIGAjMjAxNS0wNC0yNmAuXG4vLyBUaGUgZnVuY3Rpb24gYmVsb3cgd2lsbCBwYXJzZSB0aGF0IFN0cmluZyBhbmQgcmV0dXJuIGEgRGF0ZSB0aW1lc3RhbXBcbmZ1bmN0aW9uIHBhcnNlRGF0ZUhhc2goZWxlbWVudDogSFRNTEFuY2hvckVsZW1lbnQpOiBudW1iZXIge1xuICAgIGNvbnN0IFt5ZWFyLCBtb250aCwgZGF5XSA9IGVsZW1lbnQuaGFzaC5zdWJzdHJpbmcoMSkuc3BsaXQoJy0nKS5tYXAoTnVtYmVyKVxuICAgIHJldHVybiAobmV3IERhdGUoeWVhciwgbW9udGggLSAxLCBkYXkpKS5nZXRUaW1lKClcbn1cblxuLy8gVGhlICphdHRhY2htZW50aWZ5KiBmdW5jdGlvbiBwYXJzZXMgdGhlIGJvZHkgb2YgYW4gYXNzaWdubWVudCAoKnRleHQqKSBhbmQgcmV0dXJucyB0aGUgYXNzaWdubWVudCdzIGF0dGFjaG1lbnRzLlxuLy8gU2lkZSBlZmZlY3Q6IHRoZXNlIGF0dGFjaG1lbnRzIGFyZSByZW1vdmVkXG5mdW5jdGlvbiBhdHRhY2htZW50aWZ5KGVsZW1lbnQ6IEhUTUxFbGVtZW50KTogQXR0YWNobWVudEFycmF5W10ge1xuICAgIGNvbnN0IGF0dGFjaG1lbnRzOiBBdHRhY2htZW50QXJyYXlbXSA9IFtdXG5cbiAgICAvLyBHZXQgYWxsIGxpbmtzXG4gICAgY29uc3QgYXMgPSBBcnJheS5mcm9tKGVsZW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2EnKSlcbiAgICBhcy5mb3JFYWNoKChhKSA9PiB7XG4gICAgICAgIGlmIChhLmlkLmluY2x1ZGVzKCdBdHRhY2htZW50JykpIHtcbiAgICAgICAgICAgIGF0dGFjaG1lbnRzLnB1c2goW1xuICAgICAgICAgICAgICAgIGEuaW5uZXJIVE1MLFxuICAgICAgICAgICAgICAgIGEuc2VhcmNoICsgYS5oYXNoXG4gICAgICAgICAgICBdKVxuICAgICAgICAgICAgYS5yZW1vdmUoKVxuICAgICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gYXR0YWNobWVudHNcbn1cblxuY29uc3QgVVJMX1JFR0VYID0gbmV3IFJlZ0V4cChgKFxcXG5odHRwcz86XFxcXC9cXFxcL1xcXG5bLUEtWjAtOSsmQCNcXFxcLyU/PX5ffCE6LC47XSpcXFxuWy1BLVowLTkrJkAjXFxcXC8lPX5ffF0rXFxcbilgLCAnaWcnXG4pXG5cbi8vIFRoaXMgZnVuY3Rpb24gcmVwbGFjZXMgdGV4dCB0aGF0IHJlcHJlc2VudHMgYSBoeXBlcmxpbmsgd2l0aCBhIGZ1bmN0aW9uYWwgaHlwZXJsaW5rIGJ5IHVzaW5nXG4vLyBqYXZhc2NyaXB0J3MgcmVwbGFjZSBmdW5jdGlvbiB3aXRoIGEgcmVndWxhciBleHByZXNzaW9uIGlmIHRoZSB0ZXh0IGFscmVhZHkgaXNuJ3QgcGFydCBvZiBhXG4vLyBoeXBlcmxpbmsuXG5mdW5jdGlvbiB1cmxpZnkodGV4dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGV4dC5yZXBsYWNlKFVSTF9SRUdFWCwgKHN0ciwgc3RyMiwgb2Zmc2V0KSA9PiB7IC8vIEZ1bmN0aW9uIHRvIHJlcGxhY2UgbWF0Y2hlc1xuICAgICAgICBpZiAoL2hyZWZcXHMqPVxccyouLy50ZXN0KHRleHQuc3Vic3RyaW5nKG9mZnNldCAtIDEwLCBvZmZzZXQpKSB8fFxuICAgICAgICAgICAgL29yaWdpbmFscGF0aFxccyo9XFxzKi4vLnRlc3QodGV4dC5zdWJzdHJpbmcob2Zmc2V0IC0gMjAsIG9mZnNldCkpXG4gICAgICAgICkge1xuICAgICAgICAgICAgcmV0dXJuIHN0clxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGA8YSBocmVmPVwiJHtzdHJ9XCI+JHtzdHJ9PC9hPmBcbiAgICAgICAgfVxuICAgIH0pXG59XG5cbi8vIEFsc28sIFBDUlwicyBpbnRlcmZhY2UgdXNlcyBhIHN5c3RlbSBvZiBJRHMgdG8gaWRlbnRpZnkgZGlmZmVyZW50IGVsZW1lbnRzLiBGb3IgZXhhbXBsZSwgdGhlIElEIG9mXG4vLyBvbmUgb2YgdGhlIGJveGVzIHNob3dpbmcgdGhlIG5hbWUgb2YgYW4gYXNzaWdubWVudCBjb3VsZCBiZVxuLy8gYGN0bDAwX2N0bDAwX2Jhc2VDb250ZW50X2Jhc2VDb250ZW50X2ZsYXNoVG9wX2N0bDAwX1JhZFNjaGVkdWxlcjFfOTVfMGAuIFRoZSBmdW5jdGlvbiBiZWxvdyB3aWxsXG4vLyByZXR1cm4gdGhlIGZpcnN0IEhUTUwgZWxlbWVudCB3aG9zZSBJRCBjb250YWlucyBhIHNwZWNpZmllZCBTdHJpbmcgKCppZCopIGFuZCBjb250YWluaW5nIGFcbi8vIHNwZWNpZmllZCB0YWcgKCp0YWcqKS5cbmZ1bmN0aW9uIGZpbmRJZChlbGVtZW50OiBIVE1MRWxlbWVudHxIVE1MRG9jdW1lbnQsIHRhZzogc3RyaW5nLCBpZDogc3RyaW5nKTogSFRNTEVsZW1lbnQge1xuICAgIGNvbnN0IGVsID0gWy4uLmVsZW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUodGFnKV0uZmluZCgoZSkgPT4gZS5pZC5pbmNsdWRlcyhpZCkpXG4gICAgaWYgKCFlbCkgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCBlbGVtZW50IHdpdGggdGFnICR7dGFnfSBhbmQgaWQgJHtpZH0gaW4gJHtlbGVtZW50fWApXG4gICAgcmV0dXJuIGVsIGFzIEhUTUxFbGVtZW50XG59XG5cbmZ1bmN0aW9uIHBhcnNlQXNzaWdubWVudFR5cGUodHlwZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdHlwZS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoJyYgcXVpenplcycsICcnKS5yZXBsYWNlKCd0ZXN0cycsICd0ZXN0Jylcbn1cblxuZnVuY3Rpb24gcGFyc2VBc3NpZ25tZW50QmFzZVR5cGUodHlwZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdHlwZS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoJyYgcXVpenplcycsICcnKS5yZXBsYWNlKC9cXHMvZywgJycpLnJlcGxhY2UoJ3F1aXp6ZXMnLCAndGVzdCcpXG59XG5cbmZ1bmN0aW9uIHBhcnNlQXNzaWdubWVudChjYTogSFRNTEVsZW1lbnQpOiBJQXNzaWdubWVudCB7XG4gICAgY29uc3QgZGF0YSA9IGdldERhdGEoKVxuICAgIGlmICghZGF0YSkgdGhyb3cgbmV3IEVycm9yKCdEYXRhIGRpY3Rpb25hcnkgbm90IHNldCB1cCcpXG5cbiAgICAvLyBUaGUgc3RhcnRpbmcgZGF0ZSBhbmQgZW5kaW5nIGRhdGUgb2YgdGhlIGFzc2lnbm1lbnQgYXJlIHBhcnNlZCBmaXJzdFxuICAgIGNvbnN0IHJhbmdlID0gZmluZElkKGNhLCAnc3BhbicsICdTdGFydGluZ09uJykuaW5uZXJIVE1MLnNwbGl0KCcgLSAnKVxuICAgIGNvbnN0IGFzc2lnbm1lbnRTdGFydCA9IHRvRGF0ZU51bShEYXRlLnBhcnNlKHJhbmdlWzBdKSlcbiAgICBjb25zdCBhc3NpZ25tZW50RW5kID0gKHJhbmdlWzFdICE9IG51bGwpID8gdG9EYXRlTnVtKERhdGUucGFyc2UocmFuZ2VbMV0pKSA6IGFzc2lnbm1lbnRTdGFydFxuXG4gICAgLy8gVGhlbiwgdGhlIG5hbWUgb2YgdGhlIGFzc2lnbm1lbnQgaXMgcGFyc2VkXG4gICAgY29uc3QgdCA9IGZpbmRJZChjYSwgJ3NwYW4nLCAnbGJsVGl0bGUnKVxuICAgIGxldCB0aXRsZSA9IHQuaW5uZXJIVE1MXG5cbiAgICAvLyBUaGUgYWN0dWFsIGJvZHkgb2YgdGhlIGFzc2lnbm1lbnQgYW5kIGl0cyBhdHRhY2htZW50cyBhcmUgcGFyc2VkIG5leHRcbiAgICBjb25zdCBiID0gXyQoXyQodC5wYXJlbnROb2RlKS5wYXJlbnROb2RlKSBhcyBIVE1MRWxlbWVudFxuICAgIFsuLi5iLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdkaXYnKV0uc2xpY2UoMCwgMikuZm9yRWFjaCgoZGl2KSA9PiBkaXYucmVtb3ZlKCkpXG5cbiAgICBjb25zdCBhcCA9IGF0dGFjaG1lbnRpZnkoYikgLy8gU2VwYXJhdGVzIGF0dGFjaG1lbnRzIGZyb20gdGhlIGJvZHlcblxuICAgIC8vIFRoZSBsYXN0IFJlcGxhY2UgcmVtb3ZlcyBsZWFkaW5nIGFuZCB0cmFpbGluZyBuZXdsaW5lc1xuICAgIGNvbnN0IGFzc2lnbm1lbnRCb2R5ID0gdXJsaWZ5KGIuaW5uZXJIVE1MKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9eKD86XFxzKjxiclxccypcXC8/PikqLywgJycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLyg/Olxccyo8YnJcXHMqXFwvPz4pKlxccyokLywgJycpLnRyaW0oKVxuXG4gICAgLy8gRmluYWxseSwgd2Ugc2VwYXJhdGUgdGhlIGNsYXNzIG5hbWUgYW5kIHR5cGUgKGhvbWV3b3JrLCBjbGFzc3dvcmssIG9yIHByb2plY3RzKSBmcm9tIHRoZSB0aXRsZSBvZiB0aGUgYXNzaWdubWVudFxuICAgIGNvbnN0IG1hdGNoZWRUaXRsZSA9IHRpdGxlLm1hdGNoKC9cXCgoW14pXSpcXCkqKVxcKSQvKVxuICAgIGlmICgobWF0Y2hlZFRpdGxlID09IG51bGwpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IHBhcnNlIGFzc2lnbm1lbnQgdGl0bGUgXFxcIiR7dGl0bGV9XFxcImApXG4gICAgfVxuICAgIGNvbnN0IGFzc2lnbm1lbnRUeXBlID0gbWF0Y2hlZFRpdGxlWzFdXG4gICAgY29uc3QgYXNzaWdubWVudEJhc2VUeXBlID0gcGFyc2VBc3NpZ25tZW50QmFzZVR5cGUoY2EudGl0bGUuc3Vic3RyaW5nKDAsIGNhLnRpdGxlLmluZGV4T2YoJ1xcbicpKSlcbiAgICBsZXQgYXNzaWdubWVudENsYXNzSW5kZXggPSBudWxsXG4gICAgZGF0YS5jbGFzc2VzLnNvbWUoKGMsIHBvcykgPT4ge1xuICAgICAgICBpZiAodGl0bGUuaW5kZXhPZihjKSAhPT0gLTEpIHtcbiAgICAgICAgICAgIGFzc2lnbm1lbnRDbGFzc0luZGV4ID0gcG9zXG4gICAgICAgICAgICB0aXRsZSA9IHRpdGxlLnJlcGxhY2UoYywgJycpXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgIH0pXG5cbiAgICBpZiAoYXNzaWdubWVudENsYXNzSW5kZXggPT09IG51bGwgfHwgYXNzaWdubWVudENsYXNzSW5kZXggPT09IC0xKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGZpbmQgY2xhc3MgaW4gdGl0bGUgJHt0aXRsZX0gKGNsYXNzZXMgYXJlICR7ZGF0YS5jbGFzc2VzfWApXG4gICAgfVxuXG4gICAgY29uc3QgYXNzaWdubWVudFRpdGxlID0gdGl0bGUuc3Vic3RyaW5nKHRpdGxlLmluZGV4T2YoJzogJykgKyAyKS5yZXBsYWNlKC9cXChbXlxcKFxcKV0qXFwpJC8sICcnKS50cmltKClcblxuICAgIC8vIFRvIG1ha2Ugc3VyZSB0aGVyZSBhcmUgbm8gcmVwZWF0cywgdGhlIHRpdGxlIG9mIHRoZSBhc3NpZ25tZW50IChvbmx5IGxldHRlcnMpIGFuZCBpdHMgc3RhcnQgJlxuICAgIC8vIGVuZCBkYXRlIGFyZSBjb21iaW5lZCB0byBnaXZlIGl0IGEgdW5pcXVlIGlkZW50aWZpZXIuXG4gICAgY29uc3QgYXNzaWdubWVudElkID0gYXNzaWdubWVudFRpdGxlLnJlcGxhY2UoL1teXFx3XSovZywgJycpICsgKGFzc2lnbm1lbnRTdGFydCArIGFzc2lnbm1lbnRFbmQpXG5cbiAgICByZXR1cm4ge1xuICAgICAgICBzdGFydDogYXNzaWdubWVudFN0YXJ0LFxuICAgICAgICBlbmQ6IGFzc2lnbm1lbnRFbmQsXG4gICAgICAgIGF0dGFjaG1lbnRzOiBhcCxcbiAgICAgICAgYm9keTogYXNzaWdubWVudEJvZHksXG4gICAgICAgIHR5cGU6IGFzc2lnbm1lbnRUeXBlLFxuICAgICAgICBiYXNlVHlwZTogYXNzaWdubWVudEJhc2VUeXBlLFxuICAgICAgICBjbGFzczogYXNzaWdubWVudENsYXNzSW5kZXgsXG4gICAgICAgIHRpdGxlOiBhc3NpZ25tZW50VGl0bGUsXG4gICAgICAgIGlkOiBhc3NpZ25tZW50SWRcbiAgICB9XG59XG5cbi8vIFRoZSBmdW5jdGlvbiBiZWxvdyB3aWxsIHBhcnNlIHRoZSBkYXRhIGdpdmVuIGJ5IFBDUiBhbmQgY29udmVydCBpdCBpbnRvIGFuIG9iamVjdC4gSWYgeW91IG9wZW4gdXBcbi8vIHRoZSBkZXZlbG9wZXIgY29uc29sZSBvbiBDaGVja1BDUiBhbmQgdHlwZSBpbiBgZGF0YWAsIHlvdSBjYW4gc2VlIHRoZSBhcnJheSBjb250YWluaW5nIGFsbCBvZlxuLy8geW91ciBhc3NpZ25tZW50cy5cbmZ1bmN0aW9uIHBhcnNlKGRvYzogSFRNTERvY3VtZW50LCBtb250aE9mZnNldDogbnVtYmVyKTogdm9pZCB7XG4gICAgY29uc29sZS50aW1lKCdIYW5kbGluZyBkYXRhJykgLy8gVG8gdGltZSBob3cgbG9uZyBpdCB0YWtlcyB0byBwYXJzZSB0aGUgYXNzaWdubWVudHNcbiAgICBjb25zdCBoYW5kbGVkRGF0YVNob3J0OiBzdHJpbmdbXSA9IFtdIC8vIEFycmF5IHVzZWQgdG8gbWFrZSBzdXJlIHdlIGRvblwidCBwYXJzZSB0aGUgc2FtZSBhc3NpZ25tZW50IHR3aWNlLlxuICAgIGNvbnN0IGRhdGE6IElBcHBsaWNhdGlvbkRhdGEgPSB7XG4gICAgICAgIGNsYXNzZXM6IFtdLFxuICAgICAgICBhc3NpZ25tZW50czogW10sXG4gICAgICAgIG1vbnRoVmlldzogKF8kKGRvYy5xdWVyeVNlbGVjdG9yKCcucnNIZWFkZXJNb250aCcpKS5wYXJlbnROb2RlIGFzIEhUTUxFbGVtZW50KS5jbGFzc0xpc3QuY29udGFpbnMoJ3JzU2VsZWN0ZWQnKSxcbiAgICAgICAgbW9udGhPZmZzZXQ6IG1vbnRoT2Zmc2V0XG4gICAgfSAvLyBSZXNldCB0aGUgYXJyYXkgaW4gd2hpY2ggYWxsIG9mIHlvdXIgYXNzaWdubWVudHMgYXJlIHN0b3JlZCBpbi5cbiAgICBzZXREYXRhKGRhdGEpXG5cbiAgICBkb2MucXVlcnlTZWxlY3RvckFsbCgnaW5wdXQ6bm90KFt0eXBlPVwic3VibWl0XCJdKScpLmZvckVhY2goKGUpID0+IHtcbiAgICAgICAgdmlld0RhdGFbKGUgYXMgSFRNTElucHV0RWxlbWVudCkubmFtZV0gPSAoZSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSB8fCAnJ1xuICAgIH0pXG5cbiAgICAvLyBOb3csIHRoZSBjbGFzc2VzIHlvdSB0YWtlIGFyZSBwYXJzZWQgKHRoZXNlIGFyZSB0aGUgY2hlY2tib3hlcyB5b3Ugc2VlIHVwIHRvcCB3aGVuIGxvb2tpbmcgYXQgUENSKS5cbiAgICBjb25zdCBjbGFzc2VzID0gZmluZElkKGRvYywgJ3RhYmxlJywgJ2NiQ2xhc3NlcycpLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdsYWJlbCcpXG4gICAgY2xhc3Nlcy5mb3JFYWNoKChjKSA9PiB7XG4gICAgICAgIGRhdGEuY2xhc3Nlcy5wdXNoKGMuaW5uZXJIVE1MKVxuICAgIH0pXG5cbiAgICBjb25zdCBhc3NpZ25tZW50cyA9IGRvYy5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdyc0FwdCByc0FwdFNpbXBsZScpXG4gICAgQXJyYXkucHJvdG90eXBlLmZvckVhY2guY2FsbChhc3NpZ25tZW50cywgKGFzc2lnbm1lbnRFbDogSFRNTEVsZW1lbnQpID0+IHtcbiAgICAgICAgY29uc3QgYXNzaWdubWVudCA9IHBhcnNlQXNzaWdubWVudChhc3NpZ25tZW50RWwpXG4gICAgICAgIGlmIChoYW5kbGVkRGF0YVNob3J0LmluZGV4T2YoYXNzaWdubWVudC5pZCkgPT09IC0xKSB7IC8vIE1ha2Ugc3VyZSB3ZSBoYXZlbid0IGFscmVhZHkgcGFyc2VkIHRoZSBhc3NpZ25tZW50XG4gICAgICAgICAgICBoYW5kbGVkRGF0YVNob3J0LnB1c2goYXNzaWdubWVudC5pZClcbiAgICAgICAgICAgIGRhdGEuYXNzaWdubWVudHMucHVzaChhc3NpZ25tZW50KVxuICAgICAgICB9XG4gICAgfSlcblxuICAgIGNvbnNvbGUudGltZUVuZCgnSGFuZGxpbmcgZGF0YScpXG5cbiAgICAvLyBOb3cgYWxsb3cgdGhlIHZpZXcgdG8gYmUgc3dpdGNoZWRcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ2xvYWRlZCcpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1cmxGb3JBdHRhY2htZW50KHNlYXJjaDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gQVRUQUNITUVOVFNfVVJMICsgc2VhcmNoXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBdHRhY2htZW50TWltZVR5cGUoc2VhcmNoOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGNvbnN0IHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG4gICAgICAgIHJlcS5vcGVuKCdIRUFEJywgdXJsRm9yQXR0YWNobWVudChzZWFyY2gpKVxuICAgICAgICByZXEub25sb2FkID0gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHJlcS5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHR5cGUgPSByZXEuZ2V0UmVzcG9uc2VIZWFkZXIoJ0NvbnRlbnQtVHlwZScpXG4gICAgICAgICAgICAgICAgaWYgKHR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh0eXBlKVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoJ0NvbnRlbnQgdHlwZSBpcyBudWxsJykpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJlcS5zZW5kKClcbiAgICB9KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY2xhc3NCeUlkKGlkOiBudW1iZXJ8bnVsbHx1bmRlZmluZWQpOiBzdHJpbmcge1xuICAgIHJldHVybiAoaWQgPyBnZXRDbGFzc2VzKClbaWRdIDogbnVsbCkgfHwgJ1Vua25vd24gY2xhc3MnXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzd2l0Y2hWaWV3cygpOiB2b2lkIHtcbiAgICBpZiAoT2JqZWN0LmtleXModmlld0RhdGEpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZWxlbUJ5SWQoJ3NpZGVCYWNrZ3JvdW5kJykuY2xpY2soKVxuICAgICAgICBjb25zdCBuZXdWaWV3RGF0YSA9IHtcbiAgICAgICAgICAgIC4uLnZpZXdEYXRhLFxuICAgICAgICAgICAgX19FVkVOVFRBUkdFVDogJ2N0bDAwJGN0bDAwJGJhc2VDb250ZW50JGJhc2VDb250ZW50JGZsYXNoVG9wJGN0bDAwJFJhZFNjaGVkdWxlcjEnLFxuICAgICAgICAgICAgX19FVkVOVEFSR1VNRU5UOiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgQ29tbWFuZDogYFN3aXRjaFRvJHtkb2N1bWVudC5ib2R5LmdldEF0dHJpYnV0ZSgnZGF0YS1wY3J2aWV3JykgPT09ICdtb250aCcgPyAnV2VlaycgOiAnTW9udGgnfVZpZXdgXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIGN0bDAwX2N0bDAwX2Jhc2VDb250ZW50X2Jhc2VDb250ZW50X2ZsYXNoVG9wX2N0bDAwX1JhZFNjaGVkdWxlcjFfQ2xpZW50U3RhdGU6XG4gICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoe3Njcm9sbFRvcDogMCwgc2Nyb2xsTGVmdDogMCwgaXNEaXJ0eTogZmFsc2V9KSxcbiAgICAgICAgICAgIGN0bDAwX2N0bDAwX1JhZFNjcmlwdE1hbmFnZXIxX1RTTTogJzs7U3lzdGVtLldlYi5FeHRlbnNpb25zLCBWZXJzaW9uPTQuMC4wLjAsIEN1bHR1cmU9bmV1dHJhbCwgJyArXG4gICAgICAgICAgICAgICAgJ1B1YmxpY0tleVRva2VuPTMxYmYzODU2YWQzNjRlMzU6ZW4tVVM6ZDI4NTY4ZDMtZTUzZS00NzA2LTkyOGYtMzc2NTkxMmI2NmNhOmVhNTk3ZDRiOmIyNTM3OGQyJ1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHBvc3RBcnJheTogc3RyaW5nW10gPSBbXSAvLyBBcnJheSBvZiBkYXRhIHRvIHBvc3RcbiAgICAgICAgT2JqZWN0LmVudHJpZXMobmV3Vmlld0RhdGEpLmZvckVhY2goKFtoLCB2XSkgPT4ge1xuICAgICAgICAgICAgcG9zdEFycmF5LnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KGgpICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHYpKVxuICAgICAgICB9KVxuICAgICAgICB6ZXJvRGF0ZU9mZnNldHMoKVxuICAgICAgICBmZXRjaCh0cnVlLCBwb3N0QXJyYXkuam9pbignJicpKVxuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxvZ291dCgpOiB2b2lkIHtcbiAgICBpZiAoT2JqZWN0LmtleXModmlld0RhdGEpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZGVsZXRlQ29va2llKCd1c2VyUGFzcycpXG4gICAgICAgIGVsZW1CeUlkKCdzaWRlQmFja2dyb3VuZCcpLmNsaWNrKClcbiAgICAgICAgdmlld0RhdGEuX19FVkVOVFRBUkdFVCA9ICdjdGwwMCRjdGwwMCRiYXNlQ29udGVudCRMb2dvdXRDb250cm9sMSRMb2dpblN0YXR1czEkY3RsMDAnXG4gICAgICAgIHZpZXdEYXRhLl9fRVZFTlRBUkdVTUVOVCA9ICcnXG4gICAgICAgIHZpZXdEYXRhLmN0bDAwX2N0bDAwX2Jhc2VDb250ZW50X2Jhc2VDb250ZW50X2ZsYXNoVG9wX2N0bDAwX1JhZFNjaGVkdWxlcjFfQ2xpZW50U3RhdGUgPVxuICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoe3Njcm9sbFRvcDogMCwgc2Nyb2xsTGVmdDogMCwgaXNEaXJ0eTogZmFsc2V9KVxuICAgICAgICBjb25zdCBwb3N0QXJyYXk6IHN0cmluZ1tdID0gW10gLy8gQXJyYXkgb2YgZGF0YSB0byBwb3N0XG4gICAgICAgIE9iamVjdC5lbnRyaWVzKHZpZXdEYXRhKS5mb3JFYWNoKChbaCwgdl0pID0+IHtcbiAgICAgICAgICAgIHBvc3RBcnJheS5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChoKSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudCh2KSlcbiAgICAgICAgfSlcbiAgICAgICAgZmV0Y2godHJ1ZSwgcG9zdEFycmF5LmpvaW4oJyYnKSlcbiAgICAgIH1cbn1cbiIsImltcG9ydCB7IGFkZEFjdGl2aXR5RWxlbWVudCwgY3JlYXRlQWN0aXZpdHkgfSBmcm9tICcuLi9jb21wb25lbnRzL2FjdGl2aXR5J1xuaW1wb3J0IHsgZ2V0Q2FsRGF0ZU9mZnNldCB9IGZyb20gJy4uL25hdmlnYXRpb24nXG5pbXBvcnQgeyBJQXNzaWdubWVudCB9IGZyb20gJy4uL3BjcidcbmltcG9ydCB7IGxvY2FsU3RvcmFnZVJlYWQsIGxvY2FsU3RvcmFnZVdyaXRlIH0gZnJvbSAnLi4vdXRpbCdcblxuZXhwb3J0IHR5cGUgQWN0aXZpdHlUeXBlID0gJ2RlbGV0ZScgfCAnZWRpdCcgfCAnYWRkJ1xuZXhwb3J0IHR5cGUgQWN0aXZpdHlJdGVtID0gW0FjdGl2aXR5VHlwZSwgSUFzc2lnbm1lbnQsIG51bWJlciwgc3RyaW5nIHwgdW5kZWZpbmVkXVxuXG5jb25zdCBBQ1RJVklUWV9TVE9SQUdFX05BTUUgPSAnYWN0aXZpdHknXG5cbmxldCBhY3Rpdml0eTogQWN0aXZpdHlJdGVtW10gPSBsb2NhbFN0b3JhZ2VSZWFkKEFDVElWSVRZX1NUT1JBR0VfTkFNRSkgfHwgW11cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZEFjdGl2aXR5KHR5cGU6IEFjdGl2aXR5VHlwZSwgYXNzaWdubWVudDogSUFzc2lnbm1lbnQsIGRhdGU6IERhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3QWN0aXZpdHk6IGJvb2xlYW4sIGNsYXNzTmFtZT86IHN0cmluZyApOiB2b2lkIHtcbiAgICBpZiAoZ2V0Q2FsRGF0ZU9mZnNldCgpICE9PSAwKSByZXR1cm4gLy8gSWdub3JlIGFjdGl2aXR5IHdoZW4gb24gYW5vdGhlciBtb250aFxuICAgIGlmIChuZXdBY3Rpdml0eSkgYWN0aXZpdHkucHVzaChbdHlwZSwgYXNzaWdubWVudCwgRGF0ZS5ub3coKSwgY2xhc3NOYW1lXSlcbiAgICBjb25zdCBlbCA9IGNyZWF0ZUFjdGl2aXR5KHR5cGUsIGFzc2lnbm1lbnQsIGRhdGUsIGNsYXNzTmFtZSlcbiAgICBhZGRBY3Rpdml0eUVsZW1lbnQoZWwpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzYXZlQWN0aXZpdHkoKTogdm9pZCB7XG4gICAgYWN0aXZpdHkgPSBhY3Rpdml0eS5zbGljZShhY3Rpdml0eS5sZW5ndGggLSAxMjgsIGFjdGl2aXR5Lmxlbmd0aClcbiAgICBsb2NhbFN0b3JhZ2VXcml0ZShBQ1RJVklUWV9TVE9SQUdFX05BTUUsIGFjdGl2aXR5KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVjZW50QWN0aXZpdHkoKTogQWN0aXZpdHlJdGVtW10ge1xuICAgIHJldHVybiBhY3Rpdml0eS5zbGljZShhY3Rpdml0eS5sZW5ndGggLSAzMiwgYWN0aXZpdHkubGVuZ3RoKVxufVxuIiwiaW1wb3J0IHsgZWxlbUJ5SWQsIGxvY2FsU3RvcmFnZVJlYWQsIGxvY2FsU3RvcmFnZVdyaXRlIH0gZnJvbSAnLi4vdXRpbCdcblxuY29uc3QgQVRIRU5BX1NUT1JBR0VfTkFNRSA9ICdhdGhlbmFEYXRhJ1xuXG5pbnRlcmZhY2UgSVJhd0F0aGVuYURhdGEge1xuICAgIHJlc3BvbnNlX2NvZGU6IDIwMFxuICAgIGJvZHk6IHtcbiAgICAgICAgY291cnNlczoge1xuICAgICAgICAgICAgY291cnNlczogSVJhd0NvdXJzZVtdXG4gICAgICAgICAgICBzZWN0aW9uczogSVJhd1NlY3Rpb25bXVxuICAgICAgICB9XG4gICAgfVxuICAgIHBlcm1pc3Npb25zOiBhbnlcbn1cblxuaW50ZXJmYWNlIElSYXdDb3Vyc2Uge1xuICAgIG5pZDogbnVtYmVyXG4gICAgY291cnNlX3RpdGxlOiBzdHJpbmdcbiAgICAvLyBUaGVyZSdzIGEgYnVuY2ggbW9yZSB0aGF0IEkndmUgb21pdHRlZFxufVxuXG5pbnRlcmZhY2UgSVJhd1NlY3Rpb24ge1xuICAgIGNvdXJzZV9uaWQ6IG51bWJlclxuICAgIGxpbms6IHN0cmluZ1xuICAgIGxvZ286IHN0cmluZ1xuICAgIHNlY3Rpb25fdGl0bGU6IHN0cmluZ1xuICAgIC8vIFRoZXJlJ3MgYSBidW5jaCBtb3JlIHRoYXQgSSd2ZSBvbWl0dGVkXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUF0aGVuYURhdGFJdGVtIHtcbiAgICBsaW5rOiBzdHJpbmdcbiAgICBsb2dvOiBzdHJpbmdcbiAgICBwZXJpb2Q6IHN0cmluZ1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElBdGhlbmFEYXRhIHtcbiAgICBbY2xzOiBzdHJpbmddOiBJQXRoZW5hRGF0YUl0ZW1cbn1cblxubGV0IGF0aGVuYURhdGE6IElBdGhlbmFEYXRhfG51bGwgPSBsb2NhbFN0b3JhZ2VSZWFkKEFUSEVOQV9TVE9SQUdFX05BTUUpXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBdGhlbmFEYXRhKCk6IElBdGhlbmFEYXRhfG51bGwge1xuICAgIHJldHVybiBhdGhlbmFEYXRhXG59XG5cbmZ1bmN0aW9uIGZvcm1hdExvZ28obG9nbzogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gbG9nby5zdWJzdHIoMCwgbG9nby5pbmRleE9mKCdcIiBhbHQ9XCInKSlcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgnPGRpdiBjbGFzcz1cInByb2ZpbGUtcGljdHVyZVwiPjxpbWcgc3JjPVwiJywgJycpXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoJ3RpbnknLCAncmVnJylcbn1cblxuLy8gTm93LCB0aGVyZSdzIHRoZSBzY2hvb2xvZ3kvYXRoZW5hIGludGVncmF0aW9uIHN0dWZmLiBGaXJzdCwgd2UgbmVlZCB0byBjaGVjayBpZiBpdCdzIGJlZW4gbW9yZVxuLy8gdGhhbiBhIGRheS4gVGhlcmUncyBubyBwb2ludCBjb25zdGFudGx5IHJldHJpZXZpbmcgY2xhc3NlcyBmcm9tIEF0aGVuYTsgdGhleSBkb250J3QgY2hhbmdlIHRoYXRcbi8vIG11Y2guXG5cbi8vIFRoZW4sIG9uY2UgdGhlIHZhcmlhYmxlIGZvciB0aGUgbGFzdCBkYXRlIGlzIGluaXRpYWxpemVkLCBpdCdzIHRpbWUgdG8gZ2V0IHRoZSBjbGFzc2VzIGZyb21cbi8vIGF0aGVuYS4gTHVja2lseSwgdGhlcmUncyB0aGlzIGZpbGUgYXQgL2lhcGkvY291cnNlL2FjdGl2ZSAtIGFuZCBpdCdzIGluIEpTT04hIExpZmUgY2FuJ3QgYmUgYW55XG4vLyBiZXR0ZXIhIFNlcmlvdXNseSEgSXQncyBqdXN0IHRvbyBiYWQgdGhlIGxvZ2luIHBhZ2UgaXNuJ3QgaW4gSlNPTi5cbmZ1bmN0aW9uIHBhcnNlQXRoZW5hRGF0YShkYXQ6IHN0cmluZyk6IElBdGhlbmFEYXRhfG51bGwge1xuICAgIGlmIChkYXQgPT09ICcnKSByZXR1cm4gbnVsbFxuICAgIGNvbnN0IGQgPSBKU09OLnBhcnNlKGRhdCkgYXMgSVJhd0F0aGVuYURhdGFcbiAgICBjb25zdCBhdGhlbmFEYXRhMjogSUF0aGVuYURhdGEgPSB7fVxuICAgIGNvbnN0IGFsbENvdXJzZURldGFpbHM6IHsgW25pZDogbnVtYmVyXTogSVJhd1NlY3Rpb24gfSA9IHt9XG4gICAgZC5ib2R5LmNvdXJzZXMuc2VjdGlvbnMuZm9yRWFjaCgoc2VjdGlvbikgPT4ge1xuICAgICAgICBhbGxDb3Vyc2VEZXRhaWxzW3NlY3Rpb24uY291cnNlX25pZF0gPSBzZWN0aW9uXG4gICAgfSlcbiAgICBkLmJvZHkuY291cnNlcy5jb3Vyc2VzLnJldmVyc2UoKS5mb3JFYWNoKChjb3Vyc2UpID0+IHtcbiAgICAgICAgY29uc3QgY291cnNlRGV0YWlscyA9IGFsbENvdXJzZURldGFpbHNbY291cnNlLm5pZF1cbiAgICAgICAgYXRoZW5hRGF0YTJbY291cnNlLmNvdXJzZV90aXRsZV0gPSB7XG4gICAgICAgICAgICBsaW5rOiBgaHR0cHM6Ly9hdGhlbmEuaGFya2VyLm9yZyR7Y291cnNlRGV0YWlscy5saW5rfWAsXG4gICAgICAgICAgICBsb2dvOiBmb3JtYXRMb2dvKGNvdXJzZURldGFpbHMubG9nbyksXG4gICAgICAgICAgICBwZXJpb2Q6IGNvdXJzZURldGFpbHMuc2VjdGlvbl90aXRsZVxuICAgICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gYXRoZW5hRGF0YTJcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZUF0aGVuYURhdGEoZGF0YTogc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc3QgcmVmcmVzaEVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2F0aGVuYURhdGFSZWZyZXNoJylcbiAgICB0cnkge1xuICAgICAgICBhdGhlbmFEYXRhID0gcGFyc2VBdGhlbmFEYXRhKGRhdGEpXG4gICAgICAgIGxvY2FsU3RvcmFnZVdyaXRlKEFUSEVOQV9TVE9SQUdFX05BTUUsIGF0aGVuYURhdGEpXG4gICAgICAgIGVsZW1CeUlkKCdhdGhlbmFEYXRhRXJyb3InKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXG4gICAgICAgIGlmIChyZWZyZXNoRWwpIHJlZnJlc2hFbC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgZWxlbUJ5SWQoJ2F0aGVuYURhdGFFcnJvcicpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXG4gICAgICAgIGlmIChyZWZyZXNoRWwpIHJlZnJlc2hFbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXG4gICAgICAgIGVsZW1CeUlkKCdhdGhlbmFEYXRhRXJyb3InKS5pbm5lckhUTUwgPSBlLm1lc3NhZ2VcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBnZXREYXRhLCBJQXBwbGljYXRpb25EYXRhLCBJQXNzaWdubWVudCB9IGZyb20gJy4uL3BjcidcbmltcG9ydCB7IGxvY2FsU3RvcmFnZVJlYWQsIGxvY2FsU3RvcmFnZVdyaXRlIH0gZnJvbSAnLi4vdXRpbCdcblxuY29uc3QgQ1VTVE9NX1NUT1JBR0VfTkFNRSA9ICdleHRyYSdcblxuZXhwb3J0IGludGVyZmFjZSBJQ3VzdG9tQXNzaWdubWVudCB7XG4gICAgYm9keTogc3RyaW5nXG4gICAgZG9uZTogYm9vbGVhblxuICAgIHN0YXJ0OiBudW1iZXJcbiAgICBjbGFzczogc3RyaW5nfG51bGxcbiAgICBlbmQ6IG51bWJlcnwnRm9yZXZlcidcbn1cblxuY29uc3QgZXh0cmE6IElDdXN0b21Bc3NpZ25tZW50W10gPSBsb2NhbFN0b3JhZ2VSZWFkKENVU1RPTV9TVE9SQUdFX05BTUUsIFtdKVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RXh0cmEoKTogSUN1c3RvbUFzc2lnbm1lbnRbXSB7XG4gICAgcmV0dXJuIGV4dHJhXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzYXZlRXh0cmEoKTogdm9pZCB7XG4gICAgbG9jYWxTdG9yYWdlV3JpdGUoQ1VTVE9NX1NUT1JBR0VfTkFNRSwgZXh0cmEpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRUb0V4dHJhKGN1c3RvbTogSUN1c3RvbUFzc2lnbm1lbnQpOiB2b2lkIHtcbiAgICBleHRyYS5wdXNoKGN1c3RvbSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUZyb21FeHRyYShjdXN0b206IElDdXN0b21Bc3NpZ25tZW50KTogdm9pZCB7XG4gICAgaWYgKCFleHRyYS5pbmNsdWRlcyhjdXN0b20pKSB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCByZW1vdmUgY3VzdG9tIGFzc2lnbm1lbnQgdGhhdCBkb2VzIG5vdCBleGlzdCcpXG4gICAgZXh0cmEuc3BsaWNlKGV4dHJhLmluZGV4T2YoY3VzdG9tKSwgMSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGV4dHJhVG9UYXNrKGN1c3RvbTogSUN1c3RvbUFzc2lnbm1lbnQsIGRhdGE6IElBcHBsaWNhdGlvbkRhdGEpOiBJQXNzaWdubWVudCB7XG4gICAgbGV0IGNsczogbnVtYmVyfG51bGwgPSBudWxsXG4gICAgY29uc3QgY2xhc3NOYW1lID0gY3VzdG9tLmNsYXNzXG4gICAgaWYgKGNsYXNzTmFtZSAhPSBudWxsKSB7XG4gICAgICAgIGNscyA9IGRhdGEuY2xhc3Nlcy5maW5kSW5kZXgoKGMpID0+IGMudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhjbGFzc05hbWUpKVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIHRpdGxlOiAnVGFzaycsXG4gICAgICAgIGJhc2VUeXBlOiAndGFzaycsXG4gICAgICAgIHR5cGU6ICd0YXNrJyxcbiAgICAgICAgYXR0YWNobWVudHM6IFtdLFxuICAgICAgICBzdGFydDogY3VzdG9tLnN0YXJ0LFxuICAgICAgICBlbmQ6IGN1c3RvbS5lbmQgfHwgJ0ZvcmV2ZXInLFxuICAgICAgICBib2R5OiBjdXN0b20uYm9keSxcbiAgICAgICAgaWQ6IGB0YXNrJHtjdXN0b20uYm9keS5yZXBsYWNlKC9bXlxcd10qL2csICcnKX0ke2N1c3RvbS5zdGFydH0ke2N1c3RvbS5lbmR9JHtjdXN0b20uY2xhc3N9YCxcbiAgICAgICAgY2xhc3M6IGNscyA9PT0gLTEgPyBudWxsIDogY2xzXG4gICAgfVxufVxuXG5pbnRlcmZhY2UgSVBhcnNlUmVzdWx0IHtcbiAgICB0ZXh0OiBzdHJpbmdcbiAgICBjbHM/OiBzdHJpbmdcbiAgICBkdWU/OiBzdHJpbmdcbiAgICBzdD86IHN0cmluZ1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VDdXN0b21UYXNrKHRleHQ6IHN0cmluZywgcmVzdWx0OiBJUGFyc2VSZXN1bHQgPSB7IHRleHQ6ICcnIH0pOiBJUGFyc2VSZXN1bHQge1xuICAgIGNvbnN0IHBhcnNlZCA9IHRleHQubWF0Y2goLyguKikgKGZvcnxieXxkdWV8YXNzaWduZWR8c3RhcnRpbmd8ZW5kaW5nfGJlZ2lubmluZykgKC4qKS8pXG4gICAgaWYgKHBhcnNlZCA9PSBudWxsKSB7XG4gICAgICAgIHJlc3VsdC50ZXh0ID0gdGV4dFxuICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgfVxuXG4gICAgc3dpdGNoIChwYXJzZWRbMl0pIHtcbiAgICAgICAgY2FzZSAnZm9yJzogcmVzdWx0LmNscyA9IHBhcnNlZFszXTsgYnJlYWtcbiAgICAgICAgY2FzZSAnYnknOiBjYXNlICdkdWUnOiBjYXNlICdlbmRpbmcnOiByZXN1bHQuZHVlID0gcGFyc2VkWzNdOyBicmVha1xuICAgICAgICBjYXNlICdhc3NpZ25lZCc6IGNhc2UgJ3N0YXJ0aW5nJzogY2FzZSAnYmVnaW5uaW5nJzogcmVzdWx0LnN0ID0gcGFyc2VkWzNdOyBicmVha1xuICAgIH1cblxuICAgIHJldHVybiBwYXJzZUN1c3RvbVRhc2socGFyc2VkWzFdLCByZXN1bHQpXG59XG4iLCJpbXBvcnQgeyBsb2NhbFN0b3JhZ2VSZWFkLCBsb2NhbFN0b3JhZ2VXcml0ZSB9IGZyb20gJy4uL3V0aWwnXG5cbmNvbnN0IERPTkVfU1RPUkFHRV9OQU1FID0gJ2RvbmUnXG5cbmNvbnN0IGRvbmU6IHN0cmluZ1tdID0gbG9jYWxTdG9yYWdlUmVhZChET05FX1NUT1JBR0VfTkFNRSwgW10pXG5cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVGcm9tRG9uZShpZDogc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc3QgaW5kZXggPSBkb25lLmluZGV4T2YoaWQpXG4gICAgaWYgKGluZGV4ID49IDApIGRvbmUuc3BsaWNlKGluZGV4LCAxKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYWRkVG9Eb25lKGlkOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBkb25lLnB1c2goaWQpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzYXZlRG9uZSgpOiB2b2lkIHtcbiAgICBsb2NhbFN0b3JhZ2VXcml0ZShET05FX1NUT1JBR0VfTkFNRSwgZG9uZSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2lnbm1lbnRJbkRvbmUoaWQ6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBkb25lLmluY2x1ZGVzKGlkKVxufVxuIiwiaW1wb3J0IHsgbG9jYWxTdG9yYWdlUmVhZCwgbG9jYWxTdG9yYWdlV3JpdGUgfSBmcm9tICcuLi91dGlsJ1xuXG5jb25zdCBNT0RJRklFRF9TVE9SQUdFX05BTUUgPSAnbW9kaWZpZWQnXG5cbmludGVyZmFjZSBJTW9kaWZpZWRCb2RpZXMge1xuICAgIFtpZDogc3RyaW5nXTogc3RyaW5nXG59XG5cbmNvbnN0IG1vZGlmaWVkOiBJTW9kaWZpZWRCb2RpZXMgPSBsb2NhbFN0b3JhZ2VSZWFkKE1PRElGSUVEX1NUT1JBR0VfTkFNRSwge30pXG5cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVGcm9tTW9kaWZpZWQoaWQ6IHN0cmluZyk6IHZvaWQge1xuICAgIGRlbGV0ZSBtb2RpZmllZFtpZF1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVNb2RpZmllZCgpOiB2b2lkIHtcbiAgICBsb2NhbFN0b3JhZ2VXcml0ZShNT0RJRklFRF9TVE9SQUdFX05BTUUsIG1vZGlmaWVkKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYXNzaWdubWVudEluTW9kaWZpZWQoaWQ6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBtb2RpZmllZC5oYXNPd25Qcm9wZXJ0eShpZClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1vZGlmaWVkQm9keShpZDogc3RyaW5nKTogc3RyaW5nfHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIG1vZGlmaWVkW2lkXVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0TW9kaWZpZWQoaWQ6IHN0cmluZywgYm9keTogc3RyaW5nKTogdm9pZCB7XG4gICAgbW9kaWZpZWRbaWRdID0gYm9keVxufVxuIiwiaW1wb3J0IHsgbG9jYWxTdG9yYWdlUmVhZCwgbG9jYWxTdG9yYWdlV3JpdGUgfSBmcm9tICcuL3V0aWwnXG5cbnR5cGUgQXNzaWdubWVudFNwYW4gPSAnbXVsdGlwbGUnIHwgJ3N0YXJ0JyB8ICdlbmQnXG50eXBlIEhpZGVBc3NpZ25tZW50cyA9ICdkYXknIHwgJ21zJyB8ICd1cydcbnR5cGUgQ29sb3JUeXBlID0gJ2Fzc2lnbm1lbnQnIHwgJ2NsYXNzJ1xuaW50ZXJmYWNlIElTaG93bkFjdGl2aXR5IHtcbiAgICBhZGQ6IGJvb2xlYW5cbiAgICBlZGl0OiBib29sZWFuXG4gICAgZGVsZXRlOiBib29sZWFuXG59XG5cbmV4cG9ydCBjb25zdCBzZXR0aW5ncyA9IHtcbiAgICAvKipcbiAgICAgKiBNaW51dGVzIGJldHdlZW4gZWFjaCBhdXRvbWF0aWMgcmVmcmVzaCBvZiB0aGUgcGFnZS4gTmVnYXRpdmUgbnVtYmVycyBpbmRpY2F0ZSBubyBhdXRvbWF0aWNcbiAgICAgKiByZWZyZXNoaW5nLlxuICAgICAqL1xuICAgIGdldCByZWZyZXNoUmF0ZSgpOiBudW1iZXIgeyByZXR1cm4gbG9jYWxTdG9yYWdlUmVhZCgncmVmcmVzaFJhdGUnLCAtMSkgfSxcbiAgICBzZXQgcmVmcmVzaFJhdGUodjogbnVtYmVyKSB7IGxvY2FsU3RvcmFnZVdyaXRlKCdyZWZyZXNoUmF0ZScsIHYpIH0sXG5cbiAgICAvKipcbiAgICAgKiBXaGV0aGVyIHRoZSB3aW5kb3cgc2hvdWxkIHJlZnJlc2ggYXNzaWdubWVudCBkYXRhIHdoZW4gZm9jdXNzZWRcbiAgICAgKi9cbiAgICBnZXQgcmVmcmVzaE9uRm9jdXMoKTogYm9vbGVhbiB7IHJldHVybiBsb2NhbFN0b3JhZ2VSZWFkKCdyZWZyZXNoT25Gb2N1cycsIHRydWUpIH0sXG4gICAgc2V0IHJlZnJlc2hPbkZvY3VzKHY6IGJvb2xlYW4pIHsgbG9jYWxTdG9yYWdlV3JpdGUoJ3JlZnJlc2hPbkZvY3VzJywgdikgfSxcblxuICAgIC8qKlxuICAgICAqIFdoZXRoZXIgc3dpdGNoaW5nIGJldHdlZW4gdmlld3Mgc2hvdWxkIGJlIGFuaW1hdGVkXG4gICAgICovXG4gICAgZ2V0IHZpZXdUcmFucygpOiBib29sZWFuIHsgcmV0dXJuIGxvY2FsU3RvcmFnZVJlYWQoJ3ZpZXdUcmFucycsIHRydWUpIH0sXG4gICAgc2V0IHZpZXdUcmFucyh2OiBib29sZWFuKSB7IGxvY2FsU3RvcmFnZVdyaXRlKCd2aWV3VHJhbnMnLCB2KSB9LFxuXG4gICAgLyoqXG4gICAgICogTnVtYmVyIG9mIGRheXMgZWFybHkgdG8gc2hvdyB0ZXN0cyBpbiBsaXN0IHZpZXdcbiAgICAgKi9cbiAgICBnZXQgZWFybHlUZXN0KCk6IG51bWJlciB7IHJldHVybiBsb2NhbFN0b3JhZ2VSZWFkKCdlYXJseVRlc3QnLCAxKSB9LFxuICAgIHNldCBlYXJseVRlc3QodjogbnVtYmVyKSB7IGxvY2FsU3RvcmFnZVdyaXRlKCdlYXJseVRlc3QnLCB2KSB9LFxuXG4gICAgLyoqXG4gICAgICogV2hldGhlciB0byB0YWtlIHRhc2tzIG9mZiB0aGUgY2FsZW5kYXIgdmlldyBhbmQgc2hvdyB0aGVtIGluIHRoZSBpbmZvIHBhbmVcbiAgICAgKi9cbiAgICBnZXQgc2VwVGFza3MoKTogYm9vbGVhbiB7IHJldHVybiBsb2NhbFN0b3JhZ2VSZWFkKCdzZXBUYXNrcycsIGZhbHNlKSB9LFxuICAgIHNldCBzZXBUYXNrcyh2OiBib29sZWFuKSB7IGxvY2FsU3RvcmFnZVdyaXRlKCdzZXBUYXNrcycsIHYpIH0sXG5cbiAgICAvKipcbiAgICAgKiBXaGV0aGVyIHRhc2tzIHNob3VsZCBoYXZlIHRoZWlyIG93biBjb2xvclxuICAgICAqL1xuICAgIGdldCBzZXBUYXNrQ2xhc3MoKTogYm9vbGVhbiB7IHJldHVybiBsb2NhbFN0b3JhZ2VSZWFkKCdzZXBUYXNrQ2xhc3MnLCBmYWxzZSkgfSxcbiAgICBzZXQgc2VwVGFza0NsYXNzKHY6IGJvb2xlYW4pIHsgbG9jYWxTdG9yYWdlV3JpdGUoJ3NlcFRhc2tDbGFzcycsIHYpIH0sXG5cbiAgICAvKipcbiAgICAgKiBXaGV0aGVyIHByb2plY3RzIHNob3cgdXAgaW4gdGhlIHRlc3QgcGFnZVxuICAgICAqL1xuICAgIGdldCBwcm9qZWN0c0luVGVzdFBhbmUoKTogYm9vbGVhbiB7IHJldHVybiBsb2NhbFN0b3JhZ2VSZWFkKCdwcm9qZWN0c0luVGVzdFBhbmUnLCBmYWxzZSkgfSxcbiAgICBzZXQgcHJvamVjdHNJblRlc3RQYW5lKHY6IGJvb2xlYW4pIHsgbG9jYWxTdG9yYWdlV3JpdGUoJ3Byb2plY3RzSW5UZXN0UGFuZScsIHYpIH0sXG5cbiAgICAvKipcbiAgICAgKiBXaGVuIGFzc2lnbm1lbnRzIHNob3VsZCBiZSBzaG93biBvbiBjYWxlbmRhciB2aWV3XG4gICAgICovXG4gICAgZ2V0IGFzc2lnbm1lbnRTcGFuKCk6IEFzc2lnbm1lbnRTcGFuIHsgcmV0dXJuIGxvY2FsU3RvcmFnZVJlYWQoJ2Fzc2lnbm1lbnRTcGFuJywgJ211bHRpcGxlJykgfSxcbiAgICBzZXQgYXNzaWdubWVudFNwYW4odjogQXNzaWdubWVudFNwYW4pIHsgbG9jYWxTdG9yYWdlV3JpdGUoJ2Fzc2lnbm1lbnRTcGFuJywgdikgfSxcblxuICAgIC8qKlxuICAgICAqIFdoZW4gYXNzaWdubWVudHMgc2hvdWxkIGRpc2FwcGVhciBmcm9tIGxpc3Qgdmlld1xuICAgICAqL1xuICAgIGdldCBoaWRlQXNzaWdubWVudHMoKTogSGlkZUFzc2lnbm1lbnRzIHsgcmV0dXJuIGxvY2FsU3RvcmFnZVJlYWQoJ2hpZGVBc3NpZ25tZW50cycsICdkYXknKSB9LFxuICAgIHNldCBoaWRlQXNzaWdubWVudHModjogSGlkZUFzc2lnbm1lbnRzKSB7IGxvY2FsU3RvcmFnZVdyaXRlKCdoaWRlQXNzaWdubWVudHMnLCB2KSB9LFxuXG4gICAgLyoqXG4gICAgICogV2hldGhlciB0byB1c2UgaG9saWRheSB0aGVtaW5nXG4gICAgICovXG4gICAgZ2V0IGhvbGlkYXlUaGVtZXMoKTogYm9vbGVhbiB7IHJldHVybiBsb2NhbFN0b3JhZ2VSZWFkKCdob2xpZGF5VGhlbWVzJywgZmFsc2UpIH0sXG4gICAgc2V0IGhvbGlkYXlUaGVtZXModjogYm9vbGVhbikgeyBsb2NhbFN0b3JhZ2VXcml0ZSgnaG9saWRheVRoZW1lcycsIHYpIH0sXG5cbiAgICAvKipcbiAgICAgKiBXaGV0aGVyIHRvIGNvbG9yIGFzc2lnbm1lbnRzIGJhc2VkIG9uIHRoZWlyIHR5cGUgb3IgY2xhc3NcbiAgICAgKi9cbiAgICBnZXQgY29sb3JUeXBlKCk6IENvbG9yVHlwZSB7IHJldHVybiBsb2NhbFN0b3JhZ2VSZWFkKCdjb2xvclR5cGUnLCAnYXNzaWdubWVudCcpIH0sXG4gICAgc2V0IGNvbG9yVHlwZSh2OiBDb2xvclR5cGUpIHsgbG9jYWxTdG9yYWdlV3JpdGUoJ2NvbG9yVHlwZScsIHYpIH0sXG5cbiAgICAvKipcbiAgICAgKiBXaGljaCB0eXBlcyBvZiBhY3Rpdml0eSBhcmUgc2hvd24gaW4gdGhlIGFjdGl2aXR5IHBhbmVcbiAgICAgKi9cbiAgICBnZXQgc2hvd25BY3Rpdml0eSgpOiBJU2hvd25BY3Rpdml0eSB7IHJldHVybiBsb2NhbFN0b3JhZ2VSZWFkKCdzaG93bkFjdGl2aXR5Jywge1xuICAgICAgICBhZGQ6IHRydWUsXG4gICAgICAgIGVkaXQ6IHRydWUsXG4gICAgICAgIGRlbGV0ZTogdHJ1ZVxuICAgIH0pIH0sXG4gICAgc2V0IHNob3duQWN0aXZpdHkodjogSVNob3duQWN0aXZpdHkpIHsgbG9jYWxTdG9yYWdlV3JpdGUoJ3Nob3duQWN0aXZpdHknLCB2KSB9LFxuXG4gICAgLyoqXG4gICAgICogV2hldGhlciB0byBkaXNwbGF5IHRhc2tzIGluIHRoZSB0YXNrIHBhbmUgdGhhdCBhcmUgY29tcGxldGVkXG4gICAgICovXG4gICAgZ2V0IHNob3dEb25lVGFza3MoKTogYm9vbGVhbiB7IHJldHVybiBsb2NhbFN0b3JhZ2VSZWFkKCdzaG93RG9uZVRhc2tzJywgZmFsc2UpIH0sXG4gICAgc2V0IHNob3dEb25lVGFza3ModjogYm9vbGVhbikgeyBsb2NhbFN0b3JhZ2VXcml0ZSgnc2hvd0RvbmVUYXNrcycsIHYpIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNldHRpbmcobmFtZTogc3RyaW5nKTogYW55IHtcbiAgICBpZiAoIXNldHRpbmdzLmhhc093blByb3BlcnR5KG5hbWUpKSB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgc2V0dGluZyBuYW1lICR7bmFtZX1gKVxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICByZXR1cm4gc2V0dGluZ3NbbmFtZV1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldFNldHRpbmcobmFtZTogc3RyaW5nLCB2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgaWYgKCFzZXR0aW5ncy5oYXNPd25Qcm9wZXJ0eShuYW1lKSkgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHNldHRpbmcgbmFtZSAke25hbWV9YClcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgc2V0dGluZ3NbbmFtZV0gPSB2YWx1ZVxufVxuIiwiaW1wb3J0IHsgZnJvbURhdGVOdW0sIHRvRGF0ZU51bSB9IGZyb20gJy4vZGF0ZXMnXG5cbi8vIEB0cy1pZ25vcmUgVE9ETzogTWFrZSB0aGlzIGxlc3MgaGFja3lcbk5vZGVMaXN0LnByb3RvdHlwZS5mb3JFYWNoID0gSFRNTENvbGxlY3Rpb24ucHJvdG90eXBlLmZvckVhY2ggPSBBcnJheS5wcm90b3R5cGUuZm9yRWFjaFxuXG4vKipcbiAqIEZvcmNlcyBhIGxheW91dCBvbiBhbiBlbGVtZW50XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3JjZUxheW91dChlbDogSFRNTEVsZW1lbnQpOiB2b2lkIHtcbiAgICAvLyBUaGlzIGludm9sdmVzIGEgbGl0dGxlIHRyaWNrZXJ5IGluIHRoYXQgYnkgcmVxdWVzdGluZyB0aGUgY29tcHV0ZWQgaGVpZ2h0IG9mIHRoZSBlbGVtZW50IHRoZVxuICAgIC8vIGJyb3dzZXIgaXMgZm9yY2VkIHRvIGRvIGEgZnVsbCBsYXlvdXRcblxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtZXhwcmVzc2lvblxuICAgIGVsLm9mZnNldEhlaWdodFxufVxuXG4vKipcbiAqIFJldHVybiBhIHN0cmluZyB3aXRoIHRoZSBmaXJzdCBsZXR0ZXIgY2FwaXRhbGl6ZWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNhcGl0YWxpemVTdHJpbmcoc3RyOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBzdHIuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHIuc3Vic3RyKDEpXG59XG5cbi8qKlxuICogUmV0dXJucyBhbiBYTUxIdHRwUmVxdWVzdCB3aXRoIHRoZSBzcGVjaWZpZWQgdXJsLCByZXNwb25zZSB0eXBlLCBoZWFkZXJzLCBhbmQgZGF0YVxuICovXG5mdW5jdGlvbiBjb25zdHJ1Y3RYTUxIdHRwUmVxdWVzdCh1cmw6IHN0cmluZywgcmVzcFR5cGU/OiBYTUxIdHRwUmVxdWVzdFJlc3BvbnNlVHlwZXxudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVycz86IHtbbmFtZTogc3RyaW5nXTogc3RyaW5nfXxudWxsLCBkYXRhPzogc3RyaW5nfG51bGwpOiBYTUxIdHRwUmVxdWVzdCB7XG4gICAgY29uc3QgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KClcblxuICAgIC8vIElmIFBPU1QgZGF0YSBpcyBwcm92aWRlZCBzZW5kIGEgUE9TVCByZXF1ZXN0LCBvdGhlcndpc2Ugc2VuZCBhIEdFVCByZXF1ZXN0XG4gICAgcmVxLm9wZW4oKGRhdGEgPyAnUE9TVCcgOiAnR0VUJyksIHVybCwgdHJ1ZSlcblxuICAgIGlmIChyZXNwVHlwZSkgcmVxLnJlc3BvbnNlVHlwZSA9IHJlc3BUeXBlXG5cbiAgICBpZiAoaGVhZGVycykge1xuICAgICAgICBPYmplY3Qua2V5cyhoZWFkZXJzKS5mb3JFYWNoKChoZWFkZXIpID0+IHtcbiAgICAgICAgICAgIHJlcS5zZXRSZXF1ZXN0SGVhZGVyKGhlYWRlciwgaGVhZGVyc1toZWFkZXJdKVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIC8vIElmIGRhdGEgaXMgdW5kZWZpbmVkIGRlZmF1bHQgdG8gdGhlIG5vcm1hbCByZXEuc2VuZCgpLCBvdGhlcndpc2UgcGFzcyB0aGUgZGF0YSBpblxuICAgIHJlcS5zZW5kKGRhdGEpXG4gICAgcmV0dXJuIHJlcVxufVxuXG4vKiogU2VuZHMgYSByZXF1ZXN0IHRvIGEgc2VydmVyIGFuZCByZXR1cm5zIGEgUHJvbWlzZS5cbiAqIEBwYXJhbSB1cmwgdGhlIHVybCB0byByZXRyaWV2ZVxuICogQHBhcmFtIHJlc3BUeXBlIHRoZSB0eXBlIG9mIHJlc3BvbnNlIHRoYXQgc2hvdWxkIGJlIHJlY2VpdmVkXG4gKiBAcGFyYW0gaGVhZGVycyB0aGUgaGVhZGVycyB0aGF0IHdpbGwgYmUgc2VudCB0byB0aGUgc2VydmVyXG4gKiBAcGFyYW0gZGF0YSB0aGUgZGF0YSB0aGF0IHdpbGwgYmUgc2VudCB0byB0aGUgc2VydmVyIChvbmx5IGZvciBQT1NUIHJlcXVlc3RzKVxuICogQHBhcmFtIHByb2dyZXNzRWxlbWVudCBhbiBvcHRpb25hbCBlbGVtZW50IGZvciB0aGUgcHJvZ3Jlc3MgYmFyIHVzZWQgdG8gZGlzcGxheSB0aGUgc3RhdHVzIG9mIHRoZSByZXF1ZXN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZW5kKHVybDogc3RyaW5nLCByZXNwVHlwZT86IFhNTEh0dHBSZXF1ZXN0UmVzcG9uc2VUeXBlfG51bGwsIGhlYWRlcnM/OiB7W25hbWU6IHN0cmluZ106IHN0cmluZ318bnVsbCxcbiAgICAgICAgICAgICAgICAgICAgIGRhdGE/OiBzdHJpbmd8bnVsbCwgcHJvZ3Jlc3M/OiBIVE1MRWxlbWVudHxudWxsKTogUHJvbWlzZTxYTUxIdHRwUmVxdWVzdD4ge1xuXG4gICAgY29uc3QgcmVxID0gY29uc3RydWN0WE1MSHR0cFJlcXVlc3QodXJsLCByZXNwVHlwZSwgaGVhZGVycywgZGF0YSlcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cbiAgICAgICAgY29uc3QgcHJvZ3Jlc3NJbm5lciA9IHByb2dyZXNzID8gcHJvZ3Jlc3MucXVlcnlTZWxlY3RvcignZGl2JykgOiBudWxsXG4gICAgICAgIGlmIChwcm9ncmVzcyAmJiBwcm9ncmVzc0lubmVyKSB7XG4gICAgICAgICAgICBmb3JjZUxheW91dChwcm9ncmVzc0lubmVyKSAvLyBXYWl0IGZvciBpdCB0byByZW5kZXJcbiAgICAgICAgICAgIHByb2dyZXNzLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpIC8vIERpc3BsYXkgdGhlIHByb2dyZXNzIGJhclxuICAgICAgICAgICAgaWYgKHByb2dyZXNzSW5uZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdkZXRlcm1pbmF0ZScpKSB7XG4gICAgICAgICAgICAgICAgcHJvZ3Jlc3NJbm5lci5jbGFzc0xpc3QucmVtb3ZlKCdkZXRlcm1pbmF0ZScpXG4gICAgICAgICAgICAgICAgcHJvZ3Jlc3NJbm5lci5jbGFzc0xpc3QuYWRkKCdpbmRldGVybWluYXRlJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFNvbWV0aW1lcyB0aGUgYnJvd3NlciB3b24ndCBnaXZlIHRoZSB0b3RhbCBieXRlcyBpbiB0aGUgcmVzcG9uc2UsIHNvIHVzZSBwYXN0IHJlc3VsdHMgb3JcbiAgICAgICAgLy8gYSBkZWZhdWx0IG9mIDE3MCwwMDAgYnl0ZXMgaWYgdGhlIGJyb3dzZXIgZG9lc24ndCBwcm92aWRlIHRoZSBudW1iZXJcbiAgICAgICAgY29uc3QgbG9hZCA9IGxvY2FsU3RvcmFnZVJlYWQoJ2xvYWQnLCAxNzAwMDApXG4gICAgICAgIGxldCBjb21wdXRlZExvYWQgPSAwXG5cbiAgICAgICAgcmVxLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoZXZ0KSA9PiB7XG4gICAgICAgICAgICAvLyBDYWNoZSB0aGUgbnVtYmVyIG9mIGJ5dGVzIGxvYWRlZCBzbyBpdCBjYW4gYmUgdXNlZCBmb3IgYmV0dGVyIGVzdGltYXRlcyBsYXRlciBvblxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlV3JpdGUoJ2xvYWQnLCBjb21wdXRlZExvYWQpXG4gICAgICAgICAgICBpZiAocHJvZ3Jlc3MpIHByb2dyZXNzLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gICAgICAgICAgICAvLyBSZXNvbHZlIHdpdGggdGhlIHJlcXVlc3RcbiAgICAgICAgICAgIGlmIChyZXEuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHJlcSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KEVycm9yKHJlcS5zdGF0dXNUZXh0KSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgICAgICByZXEuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCAoKSA9PiB7XG4gICAgICAgICAgICBpZiAocHJvZ3Jlc3MpIHByb2dyZXNzLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gICAgICAgICAgICByZWplY3QoRXJyb3IoJ05ldHdvcmsgRXJyb3InKSlcbiAgICAgICAgfSlcblxuICAgICAgICBpZiAocHJvZ3Jlc3MgJiYgcHJvZ3Jlc3NJbm5lcikge1xuICAgICAgICAgICAgcmVxLmFkZEV2ZW50TGlzdGVuZXIoJ3Byb2dyZXNzJywgKGV2dCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIFVwZGF0ZSB0aGUgcHJvZ3Jlc3MgYmFyXG4gICAgICAgICAgICAgICAgaWYgKHByb2dyZXNzSW5uZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdpbmRldGVybWluYXRlJykpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvZ3Jlc3NJbm5lci5jbGFzc0xpc3QucmVtb3ZlKCdpbmRldGVybWluYXRlJylcbiAgICAgICAgICAgICAgICAgICAgcHJvZ3Jlc3NJbm5lci5jbGFzc0xpc3QuYWRkKCdkZXRlcm1pbmF0ZScpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbXB1dGVkTG9hZCA9IGV2dC5sb2FkZWRcbiAgICAgICAgICAgICAgICBwcm9ncmVzc0lubmVyLnN0eWxlLndpZHRoID0gKCgxMDAgKiBldnQubG9hZGVkKSAvIChldnQubGVuZ3RoQ29tcHV0YWJsZSA/IGV2dC50b3RhbCA6IGxvYWQpKSArICclJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH0pXG59XG5cbi8qKlxuICogVGhlIGVxdWl2YWxlbnQgb2YgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQgYnV0IHRocm93cyBhbiBlcnJvciBpZiB0aGUgZWxlbWVudCBpcyBub3QgZGVmaW5lZFxuICovXG5leHBvcnQgZnVuY3Rpb24gZWxlbUJ5SWQoaWQ6IHN0cmluZyk6IEhUTUxFbGVtZW50IHtcbiAgICBjb25zdCBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKVxuICAgIGlmIChlbCA9PSBudWxsKSB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBmaW5kIGVsZW1lbnQgd2l0aCBpZCAke2lkfWApXG4gICAgcmV0dXJuIGVsXG59XG5cbi8qKlxuICogQSBsaXR0bGUgaGVscGVyIGZ1bmN0aW9uIHRvIHNpbXBsaWZ5IHRoZSBjcmVhdGlvbiBvZiBIVE1MIGVsZW1lbnRzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBlbGVtZW50KHRhZzogc3RyaW5nLCBjbHM6IHN0cmluZ3xzdHJpbmdbXSwgaHRtbD86IHN0cmluZ3xudWxsLCBpZD86IHN0cmluZ3xudWxsKTogSFRNTEVsZW1lbnQge1xuICAgIGNvbnN0IGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZylcblxuICAgIGlmICh0eXBlb2YgY2xzID09PSAnc3RyaW5nJykge1xuICAgICAgICBlLmNsYXNzTGlzdC5hZGQoY2xzKVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGNscy5mb3JFYWNoKChjKSA9PiBlLmNsYXNzTGlzdC5hZGQoYykpXG4gICAgfVxuXG4gICAgaWYgKGh0bWwpIGUuaW5uZXJIVE1MID0gaHRtbFxuICAgIGlmIChpZCkgZS5zZXRBdHRyaWJ1dGUoJ2lkJywgaWQpXG5cbiAgICByZXR1cm4gZVxufVxuXG4vKipcbiAqIFRocm93cyBhbiBlcnJvciBpZiB0aGUgc3VwcGxpZWQgYXJndW1lbnQgaXMgbnVsbCwgb3RoZXJ3aXNlIHJldHVybnMgdGhlIGFyZ3VtZW50XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBfJDxUPihhcmc6IFR8bnVsbCk6IFQge1xuICAgIGlmIChhcmcgPT0gbnVsbCkgdGhyb3cgbmV3IEVycm9yKCdFeHBlY3RlZCBhcmd1bWVudCB0byBiZSBub24tbnVsbCcpXG4gICAgcmV0dXJuIGFyZ1xufVxuXG5leHBvcnQgZnVuY3Rpb24gXyRoKGFyZzogTm9kZXxFdmVudFRhcmdldHxudWxsKTogSFRNTEVsZW1lbnQge1xuICAgIGlmIChhcmcgPT0gbnVsbCkgdGhyb3cgbmV3IEVycm9yKCdFeHBlY3RlZCBub2RlIHRvIGJlIG5vbi1udWxsJylcbiAgICBpZiAoIShhcmcgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkpIHRocm93IG5ldyBFcnJvcignTm9kZSBpcyBub3QgYW4gSFRNTCBlbGVtZW50JylcbiAgICByZXR1cm4gYXJnXG59XG5cbi8vIEJlY2F1c2Ugc29tZSBsb2NhbFN0b3JhZ2UgZW50cmllcyBjYW4gYmVjb21lIGNvcnJ1cHRlZCBkdWUgdG8gZXJyb3Igc2lkZSBlZmZlY3RzLCB0aGUgYmVsb3dcbi8vIG1ldGhvZCB0cmllcyB0byByZWFkIGEgdmFsdWUgZnJvbSBsb2NhbFN0b3JhZ2UgYW5kIGhhbmRsZXMgZXJyb3JzLlxuZXhwb3J0IGZ1bmN0aW9uIGxvY2FsU3RvcmFnZVJlYWQobmFtZTogc3RyaW5nKTogYW55XG5leHBvcnQgZnVuY3Rpb24gbG9jYWxTdG9yYWdlUmVhZDxSPihuYW1lOiBzdHJpbmcsIGRlZmF1bHRWYWw6ICgpID0+IFIpOiBSXG5leHBvcnQgZnVuY3Rpb24gbG9jYWxTdG9yYWdlUmVhZDxUPihuYW1lOiBzdHJpbmcsIGRlZmF1bHRWYWw6IFQpOiBUXG5leHBvcnQgZnVuY3Rpb24gbG9jYWxTdG9yYWdlUmVhZChuYW1lOiBzdHJpbmcsIGRlZmF1bHRWYWw/OiBhbnkpOiBhbnkge1xuICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZVtuYW1lXSlcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiB0eXBlb2YgZGVmYXVsdFZhbCA9PT0gJ2Z1bmN0aW9uJyA/IGRlZmF1bHRWYWwoKSA6IGRlZmF1bHRWYWxcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsb2NhbFN0b3JhZ2VXcml0ZShuYW1lOiBzdHJpbmcsIGl0ZW06IGFueSk6IHZvaWQge1xuICAgIGxvY2FsU3RvcmFnZVtuYW1lXSA9IEpTT04uc3RyaW5naWZ5KGl0ZW0pXG59XG5cbmludGVyZmFjZSBJZGxlRGVhZGxpbmUge1xuICAgIGRpZFRpbWVvdXQ6IGJvb2xlYW5cbiAgICB0aW1lUmVtYWluaW5nOiAoKSA9PiBudW1iZXJcbn1cblxuLy8gQmVjYXVzZSB0aGUgcmVxdWVzdElkbGVDYWxsYmFjayBmdW5jdGlvbiBpcyB2ZXJ5IG5ldyAoYXMgb2Ygd3JpdGluZyBvbmx5IHdvcmtzIHdpdGggQ2hyb21lXG4vLyB2ZXJzaW9uIDQ3KSwgdGhlIGJlbG93IGZ1bmN0aW9uIHBvbHlmaWxscyB0aGF0IG1ldGhvZC5cbmV4cG9ydCBmdW5jdGlvbiByZXF1ZXN0SWRsZUNhbGxiYWNrKGNiOiAoZGVhZGxpbmU6IElkbGVEZWFkbGluZSkgPT4gdm9pZCwgb3B0czogeyB0aW1lb3V0OiBudW1iZXJ9KTogbnVtYmVyIHtcbiAgICBpZiAoJ3JlcXVlc3RJZGxlQ2FsbGJhY2snIGluIHdpbmRvdykge1xuICAgICAgICByZXR1cm4gKHdpbmRvdyBhcyBhbnkpLnJlcXVlc3RJZGxlQ2FsbGJhY2soY2IsIG9wdHMpXG4gICAgfVxuICAgIGNvbnN0IHN0YXJ0ID0gRGF0ZS5ub3coKVxuXG4gICAgcmV0dXJuIHNldFRpbWVvdXQoKCkgPT4gY2Ioe1xuICAgICAgICBkaWRUaW1lb3V0OiBmYWxzZSxcbiAgICAgICAgdGltZVJlbWFpbmluZygpOiBudW1iZXIge1xuICAgICAgICAgICAgcmV0dXJuIE1hdGgubWF4KDAsIDUwIC0gKERhdGUubm93KCkgLSBzdGFydCkpXG4gICAgICAgIH1cbiAgICB9KSwgMSlcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgdGhlIHR3byBkYXRlcyBoYXZlIHRoZSBzYW1lIHllYXIsIG1vbnRoLCBhbmQgZGF5XG4gKi9cbmZ1bmN0aW9uIGRhdGVzRXF1YWwoYTogRGF0ZSwgYjogRGF0ZSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0b0RhdGVOdW0oYSkgPT09IHRvRGF0ZU51bShiKVxufVxuXG5jb25zdCBEQVRFX1JFTEFUSVZFTkFNRVM6IHtbbmFtZTogc3RyaW5nXTogbnVtYmVyfSA9IHtcbiAgICAnVG9tb3Jyb3cnOiAxLFxuICAgICdUb2RheSc6IDAsXG4gICAgJ1llc3RlcmRheSc6IC0xLFxuICAgICcyIGRheXMgYWdvJzogLTJcbn1cbmNvbnN0IFdFRUtEQVlTID0gWydTdW5kYXknLCAnTW9uZGF5JywgJ1R1ZXNkYXknLCAnV2VkbmVzZGF5JywgJ1RodXJzZGF5JywgJ0ZyaWRheScsICdTYXR1cmRheSddXG5jb25zdCBGVUxMTU9OVEhTID0gWydKYW51YXJ5JywgJ0ZlYnJ1YXJ5JywgJ01hcmNoJywgJ0FwcmlsJywgJ01heScsICdKdW5lJywgJ0p1bHknLCAnQXVndXN0JywgJ1NlcHRlbWJlcicsICdPY3RvYmVyJyxcbiAgICAgICAgICAgICAgICAgICAgJ05vdmVtYmVyJywgJ0RlY2VtYmVyJ11cblxuZXhwb3J0IGZ1bmN0aW9uIGRhdGVTdHJpbmcoZGF0ZTogRGF0ZXxudW1iZXJ8J0ZvcmV2ZXInLCBhZGRUaGlzOiBib29sZWFuID0gZmFsc2UpOiBzdHJpbmcge1xuICAgIGlmIChkYXRlID09PSAnRm9yZXZlcicpIHJldHVybiBkYXRlXG4gICAgaWYgKHR5cGVvZiBkYXRlID09PSAnbnVtYmVyJykgcmV0dXJuIGRhdGVTdHJpbmcoZnJvbURhdGVOdW0oZGF0ZSksIGFkZFRoaXMpXG5cbiAgICBjb25zdCByZWxhdGl2ZU1hdGNoID0gT2JqZWN0LmtleXMoREFURV9SRUxBVElWRU5BTUVTKS5maW5kKChuYW1lKSA9PiB7XG4gICAgICAgIGNvbnN0IGRheUF0ID0gbmV3IERhdGUoKVxuICAgICAgICBkYXlBdC5zZXREYXRlKGRheUF0LmdldERhdGUoKSArIERBVEVfUkVMQVRJVkVOQU1FU1tuYW1lXSlcbiAgICAgICAgcmV0dXJuIGRhdGVzRXF1YWwoZGF5QXQsIGRhdGUpXG4gICAgfSlcbiAgICBpZiAocmVsYXRpdmVNYXRjaCkgcmV0dXJuIHJlbGF0aXZlTWF0Y2hcblxuICAgIGNvbnN0IGRheXNBaGVhZCA9IChkYXRlLmdldFRpbWUoKSAtIERhdGUubm93KCkpIC8gMTAwMCAvIDM2MDAgLyAyNFxuXG4gICAgLy8gSWYgdGhlIGRhdGUgaXMgd2l0aGluIDYgZGF5cyBvZiB0b2RheSwgb25seSBkaXNwbGF5IHRoZSBkYXkgb2YgdGhlIHdlZWtcbiAgICBpZiAoMCA8IGRheXNBaGVhZCAmJiBkYXlzQWhlYWQgPD0gNikge1xuICAgICAgICByZXR1cm4gKGFkZFRoaXMgPyAnVGhpcyAnIDogJycpICsgV0VFS0RBWVNbZGF0ZS5nZXREYXkoKV1cbiAgICB9XG4gICAgcmV0dXJuIGAke1dFRUtEQVlTW2RhdGUuZ2V0RGF5KCldfSwgJHtGVUxMTU9OVEhTW2RhdGUuZ2V0TW9udGgoKV19ICR7ZGF0ZS5nZXREYXRlKCl9YFxufVxuXG5leHBvcnQgZnVuY3Rpb24gbW9udGhTdHJpbmcoZGF0ZTogRGF0ZXxudW1iZXIpOiBzdHJpbmcge1xuICAgIGlmICh0eXBlb2YgZGF0ZSA9PT0gJ251bWJlcicpIHJldHVybiBtb250aFN0cmluZyhmcm9tRGF0ZU51bShkYXRlKSlcblxuICAgIGNvbnN0IHRvZGF5ID0gbmV3IERhdGUoKVxuICAgIGlmICh0b2RheS5nZXRGdWxsWWVhcigpID09PSBkYXRlLmdldEZ1bGxZZWFyKCkpIHtcbiAgICAgICAgaWYgKHRvZGF5LmdldE1vbnRoKCkgPT09IGRhdGUuZ2V0TW9udGgoKSkgcmV0dXJuICdUaGlzIE1vbnRoJ1xuICAgICAgICBpZiAodG9kYXkuZ2V0TW9udGgoKSArIDEgPT09IGRhdGUuZ2V0TW9udGgoKSkgcmV0dXJuICdOZXh0IE1vbnRoJ1xuICAgICAgICBpZiAodG9kYXkuZ2V0TW9udGgoKSAtIDEgPT09IGRhdGUuZ2V0TW9udGgoKSkgcmV0dXJuICdMYXN0IE1vbnRoJ1xuICAgICAgICByZXR1cm4gRlVMTE1PTlRIU1tkYXRlLmdldE1vbnRoKCldXG4gICAgfVxuICAgIHJldHVybiBGVUxMTU9OVEhTW2RhdGUuZ2V0TW9udGgoKV0gKyAnICcgKyBkYXRlLmdldEZ1bGxZZWFyKClcbn1cblxuLy8gVGhlIG9uZSBiZWxvdyBzY3JvbGxzIHNtb290aGx5IHRvIGEgeSBwb3NpdGlvbi5cbmV4cG9ydCBmdW5jdGlvbiBzbW9vdGhTY3JvbGwodG86IG51bWJlcik6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGxldCBzdGFydDogbnVtYmVyfG51bGwgPSBudWxsXG4gICAgICAgIGNvbnN0IGZyb20gPSBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcFxuICAgICAgICBjb25zdCBhbW91bnQgPSB0byAtIGZyb21cbiAgICAgICAgY29uc3Qgc3RlcCA9ICh0aW1lc3RhbXA6IG51bWJlcikgPT4ge1xuICAgICAgICAgICAgaWYgKHN0YXJ0ID09IG51bGwpIHsgc3RhcnQgPSB0aW1lc3RhbXAgfVxuICAgICAgICAgICAgY29uc3QgcHJvZ3Jlc3MgPSB0aW1lc3RhbXAgLSBzdGFydFxuICAgICAgICAgICAgd2luZG93LnNjcm9sbFRvKDAsIGZyb20gKyAoYW1vdW50ICogKHByb2dyZXNzIC8gMzUwKSkpXG4gICAgICAgICAgICBpZiAocHJvZ3Jlc3MgPCAzNTApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0ZXApXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIF8kKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ25hdicpKS5jbGFzc0xpc3QucmVtb3ZlKCdoZWFkcm9vbS0tdW5waW5uZWQnKVxuICAgICAgICAgICAgICAgIHJlc29sdmUoKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShzdGVwKVxuICAgIH0pXG59XG5cbi8vIEFuZCBhIGZ1bmN0aW9uIHRvIGFwcGx5IGFuIGluayBlZmZlY3RcbmV4cG9ydCBmdW5jdGlvbiByaXBwbGUoZWw6IEhUTUxFbGVtZW50KTogdm9pZCB7XG4gICAgZWwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgKGV2dCkgPT4ge1xuICAgICAgICBpZiAoZXZ0LndoaWNoICE9PSAxKSByZXR1cm4gLy8gTm90IGxlZnQgYnV0dG9uXG4gICAgICAgIGNvbnN0IHdhdmUgPSBlbGVtZW50KCdzcGFuJywgJ3dhdmUnKVxuICAgICAgICBjb25zdCBzaXplID0gTWF0aC5tYXgoTnVtYmVyKGVsLm9mZnNldFdpZHRoKSwgTnVtYmVyKGVsLm9mZnNldEhlaWdodCkpXG4gICAgICAgIHdhdmUuc3R5bGUud2lkdGggPSAod2F2ZS5zdHlsZS5oZWlnaHQgPSBzaXplICsgJ3B4JylcblxuICAgICAgICBsZXQgeCA9IGV2dC5jbGllbnRYXG4gICAgICAgIGxldCB5ID0gZXZ0LmNsaWVudFlcbiAgICAgICAgY29uc3QgcmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICAgIHggLT0gcmVjdC5sZWZ0XG4gICAgICAgIHkgLT0gcmVjdC50b3BcblxuICAgICAgICB3YXZlLnN0eWxlLnRvcCA9ICh5IC0gKHNpemUgLyAyKSkgKyAncHgnXG4gICAgICAgIHdhdmUuc3R5bGUubGVmdCA9ICh4IC0gKHNpemUgLyAyKSkgKyAncHgnXG4gICAgICAgIGVsLmFwcGVuZENoaWxkKHdhdmUpXG4gICAgICAgIHdhdmUuc2V0QXR0cmlidXRlKCdkYXRhLWhvbGQnLCBTdHJpbmcoRGF0ZS5ub3coKSkpXG4gICAgICAgIGZvcmNlTGF5b3V0KHdhdmUpXG4gICAgICAgIHdhdmUuc3R5bGUudHJhbnNmb3JtID0gJ3NjYWxlKDIuNSknXG4gICAgfSlcbiAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgKGV2dCkgPT4ge1xuICAgICAgICBpZiAoZXZ0LndoaWNoICE9PSAxKSByZXR1cm4gLy8gT25seSBmb3IgbGVmdCBidXR0b25cbiAgICAgICAgY29uc3Qgd2F2ZXMgPSBlbC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd3YXZlJylcbiAgICAgICAgd2F2ZXMuZm9yRWFjaCgod2F2ZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZGlmZiA9IERhdGUubm93KCkgLSBOdW1iZXIod2F2ZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtaG9sZCcpKVxuICAgICAgICAgICAgY29uc3QgZGVsYXkgPSBNYXRoLm1heCgzNTAgLSBkaWZmLCAwKVxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgKHdhdmUgYXMgSFRNTEVsZW1lbnQpLnN0eWxlLm9wYWNpdHkgPSAnMCdcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgd2F2ZS5yZW1vdmUoKVxuICAgICAgICAgICAgICAgIH0sIDU1MClcbiAgICAgICAgICAgIH0sIGRlbGF5KVxuICAgICAgICB9KVxuICAgIH0pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjc3NOdW1iZXIoY3NzOiBzdHJpbmd8bnVsbCk6IG51bWJlciB7XG4gICAgaWYgKCFjc3MpIHJldHVybiAwXG4gICAgcmV0dXJuIHBhcnNlSW50KGNzcywgMTApXG59XG5cbi8vIEZvciBlYXNlIG9mIGFuaW1hdGlvbnMsIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgcHJvbWlzZSBpcyBkZWZpbmVkLlxuZXhwb3J0IGZ1bmN0aW9uIGFuaW1hdGVFbChlbDogSFRNTEVsZW1lbnQsIGtleWZyYW1lczogQW5pbWF0aW9uS2V5RnJhbWVbXSwgb3B0aW9uczogQW5pbWF0aW9uT3B0aW9ucyk6XG4gICAgUHJvbWlzZTxBbmltYXRpb25QbGF5YmFja0V2ZW50PiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgY29uc3QgcGxheWVyID0gZWwuYW5pbWF0ZShrZXlmcmFtZXMsIG9wdGlvbnMpXG4gICAgICAgIHBsYXllci5vbmZpbmlzaCA9IChlKSA9PiByZXNvbHZlKGUpXG4gICAgfSlcbn1cbiIsImltcG9ydCB7IGRvbG9naW4sIGZldGNoIH0gZnJvbSAnLi9wY3InXG5pbXBvcnQgeyB1cGRhdGVBdGhlbmFEYXRhIH0gZnJvbSAnLi9wbHVnaW5zL2F0aGVuYSdcbmltcG9ydCB7IF8kaCwgZWxlbUJ5SWQgfSBmcm9tICcuL3V0aWwnXG5cbi8vIFdlbGNvbWUgdG8gdGhlIHdlbGNvbWUgZmlsZS5cbi8vXG4vLyBUaGlzIHNjcmlwdCBydW5zIG9uIHRoZSB3ZWxjb21lIHBhZ2UsIHdoaWNoIHdlbGNvbWVzIG5ldyB1c2VycywgdG8gbWFrZSBpdCBtb3JlIHdlbGNvbWluZy4gSWYgeW91XG4vLyBoYXZlbid0IGFscmVhZHksIEkgd2VsY29tZSB5b3UgdG8gdmlldyB0aGUgbW9yZSBpbXBvcnRhbnQgW21haW4gc2NyaXB0XShjbGllbnQubGl0Y29mZmVlKS5cbi8vXG4vLyBBbHNvLCBpZiB5b3UgaGF2ZW4ndCBub3RpY2VkIHlldCwgSSdtIHRyeWluZyBteSBiZXN0IHRvIHVzZSB0aGUgd29yZCB3ZWxjb21lIGFzIG1hbnkgdGltZXMgYXMgSVxuLy8gY2FuIGp1c3QgdG8gd2VsY29tZSB5b3UuXG4vL1xuLy8gRmlyc3Qgb2ZmLCB0aGUgYnV0dG9ucyBiaWcsIGdyZWVuLCB3ZWxjb21pbmcgYnV0dG9ucyBvbiB0aGUgYm90dG9tIG9mIHRoZSB3ZWxjb21lIHBhZ2UgYXJlXG4vLyBhc3NpZ25lZCBldmVudCBsaXN0ZW5lcnMgc28gdGhhdCB0aGV5IGNhbiBtYWtlIHRoZSBwYWdlIHNob3cgbW9yZSB3ZWxjb21pbmcgaW5mb3JtYXRpb24uXG5mdW5jdGlvbiBhZHZhbmNlKCk6IHZvaWQge1xuICAgIC8vIFRoZSBib3ggaG9sZGluZyB0aGUgaW5kaXZpZHVhbCBwYWdlcyB0aGF0IGdlIHNjcm9sbGVkXG4gICAgLy8gd2hlbiBwcmVzc2luZyB0aGUgJ25leHQnIGJ1dHRvbiBpcyBhc3NpZ25lZCB0byBhIHZhcmlhbGJlLlxuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmJvZHlcbiAgICAvLyBzaG93IHRoZSBuZXh0IHBhZ2VcbiAgICBjb25zdCB2aWV3ID0gTnVtYmVyKGNvbnRhaW5lci5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmlldycpKVxuICAgIHdpbmRvdy5zY3JvbGxUbygwLCAwKSAvLyBTY29sbCB0byB0b3Agb2YgdGhlIHBhZ2VcbiAgICBoaXN0b3J5LnB1c2hTdGF0ZSh7cGFnZTogdmlldyArIDF9LCAnJywgYD9wYWdlPSR7dmlld31gKSAvLyBNYWtlIHRoZSBicm9zd2VyIHJlZ2lzdGVyIGEgcGFnZSBzaGlmdFxuXG4gICAgY29uc3QgbnBhZ2UgPSBfJGgoZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihgc2VjdGlvbjpudGgtY2hpbGQoJHt2aWV3ICsgMn0pYCkpXG4gICAgbnBhZ2Uuc3R5bGUuZGlzcGxheSA9ICdpbmxpbmUtYmxvY2snXG4gICAgbnBhZ2Uuc3R5bGUudHJhbnNmb3JtID0gbnBhZ2Uuc3R5bGUud2Via2l0VHJhbnNmb3JtID0gYHRyYW5zbGF0ZVgoJHt2aWV3ICogMTAwfSUpYFxuICAgIC8vIGluY3JlYXNlIHRoZSBkYXRhLXZpZXcgYXR0cmlidXRlIGJ5IDEuIFRoZSByZXN0IGlzIGhhbmRsZWQgYnkgdGhlIGNzcy5cbiAgICBjb250YWluZXIuc2V0QXR0cmlidXRlKCdkYXRhLXZpZXcnLCBTdHJpbmcodmlldyArIDEpKVxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAvLyBBZnRlciBhbmltYXRpbmcgaXMgZG9uZSwgZG9uJ3QgZGlzcGxheSB0aGUgZmlyc3QgcGFnZVxuICAgICAgICBucGFnZS5zdHlsZS50cmFuc2Zvcm0gPSBucGFnZS5zdHlsZS53ZWJraXRUcmFuc2Zvcm0gPSBgdHJhbnNsYXRlWCgke3ZpZXcgKyAxfTAwJSlgXG4gICAgICAgIF8kaChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBzZWN0aW9uOm50aC1jaGlsZCgke3ZpZXcgKyAxfSlgKSkuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuICAgIH0sIDUwKVxufVxuXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcubmV4dCcpLmZvckVhY2goKG5leHRCdXR0b24pID0+IHtcbiAgICBpZiAoIShuZXh0QnV0dG9uIGluc3RhbmNlb2YgSFRNTEFuY2hvckVsZW1lbnQpKSByZXR1cm5cbiAgICBpZiAobmV4dEJ1dHRvbi5ocmVmKSByZXR1cm5cbiAgICBuZXh0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYWR2YW5jZSlcbn0pXG5cbi8vIEFkZGl0aW9uYWxseSwgdGhlIGFjdGl2ZSBjbGFzcyBuZWVkcyB0byBiZSBhZGRlZCB3aGVuIHRleHQgZmllbGRzIGFyZSBzZWxlY3RlZCAoZm9yIHRoZSBsb2dpblxuLy8gYm94KSBbY29waWVkIGZyb20gbWFpbiBzY3JpcHRdLlxuZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnaW5wdXRbdHlwZT10ZXh0XSwgaW5wdXRbdHlwZT1wYXNzd29yZF0sIGlucHV0W3R5cGU9ZW1haWxdLCBpbnB1dFt0eXBlPXVybF0sICdcbiAgICAgICAgICAgICAgICAgICAgICAgICsgJ2lucHV0W3R5cGU9dGVsXSwgaW5wdXRbdHlwZT1udW1iZXJdLCBpbnB1dFt0eXBlPXNlYXJjaF0nKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZvckVhY2goKGlucHV0OiBIVE1MSW5wdXRFbGVtZW50KSA9PiB7XG4gICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGV2dCkgPT4gXyRoKF8kaChpbnB1dC5wYXJlbnROb2RlKS5xdWVyeVNlbGVjdG9yKCdsYWJlbCcpKS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKSlcbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsIChldnQpID0+IF8kaChfJGgoaW5wdXQucGFyZW50Tm9kZSkucXVlcnlTZWxlY3RvcignbGFiZWwnKSkuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJykpXG4gICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIChldnQpID0+IHtcbiAgICAgICAgaWYgKGlucHV0LnZhbHVlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgXyRoKF8kaChpbnB1dC5wYXJlbnROb2RlKS5xdWVyeVNlbGVjdG9yKCdsYWJlbCcpKS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuICAgICAgICB9XG4gICAgfSlcbn0pXG5cbi8vIEFuIGV2ZW50IGxpc3RlbmVyIGlzIGF0dGFjaGVkIHRvIHRoZSB3aW5kb3cgc28gdGhhdCB3aGVuIHRoZSBiYWNrIGJ1dHRvbiBpcyBwcmVzc2VkLCBhIG1vcmVcbi8vIHdlbGNvbWluZyBwYWdlIGlzIGRpc3BsYXllZC4gTW9zdCBvZiB0aGUgY29kZSBpcyB0aGUgc2FtZSBmcm9tIG5leHQgYnV0dG9uIGV2ZW50IGxpc3RlbmVyLCBleGNlcHRcbi8vIHRoYXQgdGhlIHBhZ2UgaXMgc3dpdGNoZWQgdGhlIHByZXZpb3VzIG9uZSwgbm90IHRoZSBuZXh0IG9uZS5cbndpbmRvdy5vbnBvcHN0YXRlID0gKGV2ZW50KSA9PiB7XG4gICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuYm9keVxuICAgIGNvbnN0IHZpZXcgPSAoZXZlbnQuc3RhdGUgIT0gbnVsbCkgPyBldmVudC5zdGF0ZS5wYWdlIDogMFxuICAgIHdpbmRvdy5zY3JvbGxUbygwLCAwKSAvLyBTY29sbCB0byB0b3Agb2YgdGhlIHBhZ2VcblxuICAgIGNvbnN0IG5wYWdlID0gXyRoKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYHNlY3Rpb246bnRoLWNoaWxkKCR7dmlldyArIDF9KWApKVxuICAgIG5wYWdlLnN0eWxlLmRpc3BsYXkgPSAnaW5saW5lLWJsb2NrJ1xuICAgIG5wYWdlLnN0eWxlLnRyYW5zZm9ybSA9IG5wYWdlLnN0eWxlLndlYmtpdFRyYW5zZm9ybSA9IGB0cmFuc2xhdGVYKCR7dmlldyAqIDEwMH0lKWBcbiAgICAvLyBpbmNyZWFzZSB0aGUgZGF0YS12aWV3IGF0dHJpYnV0ZSBieSAxLiBUaGUgcmVzdCBpcyBoYW5kbGVkIGJ5IHRoZSBjc3MuXG4gICAgY29udGFpbmVyLnNldEF0dHJpYnV0ZSgnZGF0YS12aWV3JywgdmlldylcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgLy8gQWZ0ZXIgYW5pbWF0aW5nIGlzIGRvbmUsIGRvbid0IGRpc3BsYXkgdGhlIGZpcnN0IHBhZ2VcbiAgICAgICAgbnBhZ2Uuc3R5bGUudHJhbnNmb3JtID0gbnBhZ2Uuc3R5bGUud2Via2l0VHJhbnNmb3JtID0gYHRyYW5zbGF0ZVgoJHt2aWV3fTAwJSlgXG4gICAgICAgIF8kaChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBzZWN0aW9uOm50aC1jaGlsZCgke3ZpZXcgKyAyfSlgKSkuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuICAgIH0sIDUwKVxufVxuXG4vLyBUaGUgdGV4dCBib3ggYWxzbyBuZWVkcyB0byBleGVjdXRlIHRoaXMgZnVuY3Rpb24gd2hlbiBhbnl0aGluZyBpcyB0eXBlZCAvIHBhc3RlZC5cbmNvbnN0IGF0aGVuYURhdGFFbCA9IGVsZW1CeUlkKCdhdGhlbmFEYXRhJykgYXMgSFRNTElucHV0RWxlbWVudFxuYXRoZW5hRGF0YUVsLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKCkgPT4gdXBkYXRlQXRoZW5hRGF0YShhdGhlbmFEYXRhRWwudmFsdWUpKVxuXG5mZXRjaCh0cnVlLCB1bmRlZmluZWQsICgpID0+IHtcbiAgICBlbGVtQnlJZCgnbG9naW5OZXh0Jykuc3R5bGUuZGlzcGxheSA9ICcnXG4gICAgZWxlbUJ5SWQoJ2xvZ2luJykuY2xhc3NMaXN0LmFkZCgnZG9uZScpXG59LCAoKSA9PiB7XG4gICAgZWxlbUJ5SWQoJ2xvZ2luJykuY2xhc3NMaXN0LmFkZCgncmVhZHknKVxuICAgIGVsZW1CeUlkKCdsb2dpbicpLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIChldnQpID0+IHtcbiAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgZG9sb2dpbihudWxsLCB0cnVlLCBhZHZhbmNlKVxuICAgIH0pXG59KVxuXG5mdW5jdGlvbiBjbG9zZUVycm9yKCk6IHZvaWQge1xuICAgIGVsZW1CeUlkKCdlcnJvcicpLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGVsZW1CeUlkKCdlcnJvckJhY2tncm91bmQnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXG4gICAgfSwgMzUwKVxufVxuXG5lbGVtQnlJZCgnZXJyb3JObycpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xvc2VFcnJvcilcbmVsZW1CeUlkKCdlcnJvckJhY2tncm91bmQnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsb3NlRXJyb3IpXG4iXSwic291cmNlUm9vdCI6IiJ9