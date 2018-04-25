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
                e.style.top = (e.getBoundingClientRect().top - document.body.scrollTop
                    - Object(_util__WEBPACK_IMPORTED_MODULE_10__["cssNumber"])(e.style.marginTop)) + 44 + 'px';
                e.setAttribute('data-top', e.style.top);
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
    el.style.top = el.getAttribute('data-top');
    el.classList.add('anim');
    el.classList.remove('full');
    el.scrollTop = 0;
    document.body.style.overflow = 'auto';
    const back = Object(_util__WEBPACK_IMPORTED_MODULE_10__["elemById"])('background');
    back.classList.remove('active');
    setTimeout(() => {
        back.style.display = 'none';
        el.classList.remove('anim');
        el.classList.remove('modify');
        el.style.top = 'auto';
        Object(_util__WEBPACK_IMPORTED_MODULE_10__["forceLayout"])(el);
        el.classList.add('anim');
    }, 1000);
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
    assignments.forEach((assignment, n) => {
        const col = n % columns;
        cch.push(columnHeights[col]);
        columnHeights[col] += assignment.offsetHeight + 24;
    });
    assignments.forEach((assignment, n) => {
        const col = n % columns;
        assignment.style.top = cch[n] + 'px';
        assignment.style.left = ((100 / columns) * col) + '%';
        assignment.style.right = ((100 / columns) * (columns - col - 1)) + '%';
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
        return cookiePart.substring(name.length);
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
        const month = (new Date()).getMonth();
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
        const lastData = Object(_util__WEBPACK_IMPORTED_MODULE_11__["localStorageRead"])('data');
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
/*! exports provided: getListDateOffset, zeroListDateOffset, incrementListDateOffset, decrementListDateOffset, setListDateOffset */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getListDateOffset", function() { return getListDateOffset; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "zeroListDateOffset", function() { return zeroListDateOffset; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "incrementListDateOffset", function() { return incrementListDateOffset; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "decrementListDateOffset", function() { return decrementListDateOffset; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setListDateOffset", function() { return setListDateOffset; });
let listDateOffset = 0;
function getListDateOffset() {
    return listDateOffset;
}
function zeroListDateOffset() {
    listDateOffset = 0;
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
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./util */ "./src/util.ts");
/**
 * This module contains code to both fetch and parse assignments from PCR.
 */







const PCR_URL = 'https://webappsca.pcrsoft.com';
const ASSIGNMENTS_URL = `${PCR_URL}/Clue/SC-Assignments-End-Date-Range/7536`;
const LOGIN_URL = `${PCR_URL}/Clue/SC-Student-Portal-Login-LDAP/8464?returnUrl=${encodeURIComponent(ASSIGNMENTS_URL)}`;
const ATTACHMENTS_URL = `${PCR_URL}/Clue/Common/AttachmentRender.aspx`;
const FORM_HEADER_ONLY = { 'Content-type': 'application/x-www-form-urlencoded' };
const ONE_MINUTE_MS = 60000;
const progressElement = Object(_util__WEBPACK_IMPORTED_MODULE_6__["elemById"])('progress');
const loginDialog = Object(_util__WEBPACK_IMPORTED_MODULE_6__["elemById"])('login');
const loginBackground = document.getElementById('loginBackground');
const lastUpdateEl = document.getElementById('lastUpdate');
const usernameEl = Object(_util__WEBPACK_IMPORTED_MODULE_6__["elemById"])('username');
const passwordEl = Object(_util__WEBPACK_IMPORTED_MODULE_6__["elemById"])('password');
const rememberCheck = Object(_util__WEBPACK_IMPORTED_MODULE_6__["elemById"])('remember');
const incorrectLoginEl = Object(_util__WEBPACK_IMPORTED_MODULE_6__["elemById"])('loginIncorrect');
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
    const headers = data ? FORM_HEADER_ONLY : undefined;
    console.time('Fetching assignments');
    try {
        const resp = await Object(_util__WEBPACK_IMPORTED_MODULE_6__["send"])(ASSIGNMENTS_URL, 'document', headers, data, progressElement);
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
            }
            else {
                // Because we were remembered, we can log in immediately without waiting for the
                // user to log in through the login form
                dologin(window.atob(up).split(':'));
                if (onlogin)
                    onlogin();
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
                parse(resp.response);
                onsuccess();
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
    Object(_util__WEBPACK_IMPORTED_MODULE_6__["localStorageWrite"])('username', val && !submitEvt ? val[0] : usernameEl.value);
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
        const resp = await Object(_util__WEBPACK_IMPORTED_MODULE_6__["send"])(LOGIN_URL, 'document', FORM_HEADER_ONLY, postArray.join('&'), progressElement);
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
                parse(resp.response); // Parse the data PCR has replied with
                onsuccess();
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
        }
    });
    return attachments;
}
// This function replaces text that represents a hyperlink with a functional hyperlink by using
// javascript's replace function with a regular expression if the text already isn't part of a
// hyperlink.
function urlify(text) {
    return text.replace(new RegExp(`(\
        https?:\\/\\/\
        [-A-Z0-9+&@#\\/%?=~_|!:,.;]*\
        [-A-Z0-9+&@#\\/%=~_|]+\
        )`, 'ig'), (str, str2, offset) => {
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
    return type.toLowerCase().replace('& quizzes', '').replace(/\s/g, '');
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
    const b = Object(_util__WEBPACK_IMPORTED_MODULE_6__["_$"])(Object(_util__WEBPACK_IMPORTED_MODULE_6__["_$"])(t.parentNode).parentNode);
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
function parse(doc) {
    console.time('Handling data'); // To time how long it takes to parse the assignments
    const handledDataShort = []; // Array used to make sure we don"t parse the same assignment twice.
    const data = {
        classes: [],
        assignments: [],
        monthView: Object(_util__WEBPACK_IMPORTED_MODULE_6__["_$"])(doc.querySelector('.rsHeaderMonth')).parentNode.classList.contains('rsSelected')
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
    localStorage.setItem('data', JSON.stringify(getData())); // Store for offline use
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
        Object(_util__WEBPACK_IMPORTED_MODULE_6__["elemById"])('sideBackground').click();
        viewData.__EVENTTARGET = 'ctl00$ctl00$baseContent$baseContent$flashTop$ctl00$RadScheduler1';
        viewData.__EVENTARGUMENT = JSON.stringify({
            Command: `SwitchTo${document.body.getAttribute('data-pcrview') === 'month' ? 'Week' : 'Month'}View`
        });
        viewData.ctl00_ctl00_baseContent_baseContent_flashTop_ctl00_RadScheduler1_ClientState =
            JSON.stringify({ scrollTop: 0, scrollLeft: 0, isDirty: false });
        viewData.ctl00_ctl00_RadScriptManager1_TSM = ';;System.Web.Extensions, Version=4.0.0.0, Culture=neutral, ' +
            'PublicKeyToken=31bf3856ad364e35:en-US:d28568d3-e53e-4706-928f-3765912b66ca:ea597d4b:b25378d2';
        const postArray = []; // Array of data to post
        Object.entries(viewData).forEach(([h, v]) => {
            postArray.push(encodeURIComponent(h) + '=' + encodeURIComponent(v));
        });
        fetch(true, postArray.join('&'));
    }
}
function logout() {
    if (Object.keys(viewData).length > 0) {
        Object(_cookies__WEBPACK_IMPORTED_MODULE_3__["deleteCookie"])('userPass');
        Object(_util__WEBPACK_IMPORTED_MODULE_6__["elemById"])('sideBackground').click();
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
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util */ "./src/util.ts");


const ACTIVITY_STORAGE_NAME = 'activity';
let activity = Object(_util__WEBPACK_IMPORTED_MODULE_1__["localStorageRead"])(ACTIVITY_STORAGE_NAME) || [];
function addActivity(type, assignment, date, newActivity, className) {
    if (newActivity)
        activity.push([type, assignment, Date.now(), className]);
    const el = Object(_components_activity__WEBPACK_IMPORTED_MODULE_0__["createActivity"])(type, assignment, date, className);
    Object(_components_activity__WEBPACK_IMPORTED_MODULE_0__["addActivityElement"])(el);
}
function saveActivity() {
    activity = activity.slice(activity.length - 128, activity.length);
    Object(_util__WEBPACK_IMPORTED_MODULE_1__["localStorageWrite"])(ACTIVITY_STORAGE_NAME, activity);
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
        Object(_util__WEBPACK_IMPORTED_MODULE_0__["localStorageWrite"])(ATHENA_STORAGE_NAME, data);
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
function parseCustomTask(text, result = {}) {
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
/*! exports provided: settings */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "settings", function() { return settings; });
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


/***/ }),

/***/ "./src/util.ts":
/*!*********************!*\
  !*** ./src/util.ts ***!
  \*********************/
/*! exports provided: forceLayout, capitalizeString, send, elemById, element, _$, _$h, localStorageRead, localStorageWrite, requestIdleCallback, dateString, smoothScroll, ripple, cssNumber */
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
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "smoothScroll", function() { return smoothScroll; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ripple", function() { return ripple; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "cssNumber", function() { return cssNumber; });
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
        const load = Number(localStorage.getItem('load')) || 170000;
        let computedLoad = 0;
        req.addEventListener('load', (evt) => {
            // Cache the number of bytes loaded so it can be used for better estimates later on
            localStorage.setItem('load', String(computedLoad));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9hY3Rpdml0eS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9hc3NpZ25tZW50LnRzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2F2YXRhci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9jYWxlbmRhci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9lcnJvckRpc3BsYXkudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvcmVzaXplci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9zbmFja2Jhci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29va2llcy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZGF0ZXMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Rpc3BsYXkudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL25hdmlnYXRpb24udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Bjci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2lucy9hY3Rpdml0eS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2lucy9hdGhlbmEudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BsdWdpbnMvY3VzdG9tQXNzaWdubWVudHMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BsdWdpbnMvZG9uZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2lucy9tb2RpZmllZEFzc2lnbm1lbnRzLnRzIiwid2VicGFjazovLy8uL3NyYy9zZXR0aW5ncy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvd2VsY29tZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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LEdBQUcsRUFBRSxFQUFFO1FBQ2pELEdBQUcsQ0FBQyxjQUFjLEVBQUU7UUFDcEIsb0RBQU8sQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQztJQUNoQyxDQUFDLENBQUM7QUFDTixDQUFDLENBQUM7QUFFRjtJQUNJLHNEQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7SUFDNUMsVUFBVSxDQUFDLEdBQUcsRUFBRTtRQUNaLHNEQUFRLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU07SUFDdEQsQ0FBQyxFQUFFLEdBQUcsQ0FBQztBQUNYLENBQUM7QUFFRCxzREFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUM7QUFDekQsc0RBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMiLCJmaWxlIjoid2VsY29tZS1idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvd2VsY29tZS50c1wiKTtcbiIsImltcG9ydCB7IGVsZW1CeUlkLCBlbGVtZW50LCBsb2NhbFN0b3JhZ2VSZWFkLCBsb2NhbFN0b3JhZ2VXcml0ZSwgc2VuZCB9IGZyb20gJy4vdXRpbCdcclxuXHJcbmV4cG9ydCBjb25zdCBWRVJTSU9OID0gJzIuMjQuMydcclxuXHJcbmNvbnN0IFZFUlNJT05fVVJMID0gJ2h0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS8xOVJ5YW5BL0NoZWNrUENSL21hc3Rlci92ZXJzaW9uLnR4dCdcclxuY29uc3QgQ09NTUlUX1VSTCA9IChsb2NhdGlvbi5wcm90b2NvbCA9PT0gJ2Nocm9tZS1leHRlbnNpb246JyA/XHJcbiAgICAnaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbS9yZXBvcy8xOVJ5YW5BL0NoZWNrUENSL2dpdC9yZWZzL2hlYWRzL21hc3RlcicgOiAnL2FwaS9jb21taXQnKVxyXG5jb25zdCBORVdTX1VSTCA9ICdodHRwczovL2FwaS5naXRodWIuY29tL2dpc3RzLzIxYmYxMWE0MjlkYTI1NzUzOWE2ODUyMGY1MTNhMzhiJ1xyXG5cclxuZnVuY3Rpb24gZm9ybWF0Q29tbWl0TWVzc2FnZShtZXNzYWdlOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIG1lc3NhZ2Uuc3Vic3RyKG1lc3NhZ2UuaW5kZXhPZignXFxuXFxuJykgKyAyKVxyXG4gICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFwqICguKj8pKD89JHxcXG4pL2csIChhLCBiKSA9PiBgPGxpPiR7Yn08L2xpPmApXHJcbiAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8+XFxuPC9nLCAnPjwnKVxyXG4gICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxuL2csICc8YnI+JylcclxufVxyXG5cclxuLy8gRm9yIHVwZGF0aW5nLCBhIHJlcXVlc3Qgd2lsbCBiZSBzZW5kIHRvIEdpdGh1YiB0byBnZXQgdGhlIGN1cnJlbnQgY29tbWl0IGlkIGFuZCBjaGVjayB0aGF0IGFnYWluc3Qgd2hhdCdzIHN0b3JlZFxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY2hlY2tDb21taXQoKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHJlc3AgPSBhd2FpdCBzZW5kKFZFUlNJT05fVVJMLCAndGV4dCcpXHJcbiAgICAgICAgY29uc3QgYyA9IHJlc3AucmVzcG9uc2VUZXh0LnRyaW0oKVxyXG4gICAgICAgIGNvbnNvbGUubG9nKGBDdXJyZW50IHZlcnNpb246ICR7Y30gJHtWRVJTSU9OID09PSBjID8gJyhubyB1cGRhdGUgYXZhaWxhYmxlKScgOiAnKHVwZGF0ZSBhdmFpbGFibGUpJ31gKVxyXG4gICAgICAgIGVsZW1CeUlkKCduZXd2ZXJzaW9uJykuaW5uZXJIVE1MID0gY1xyXG4gICAgICAgIGlmIChWRVJTSU9OICE9PSBjKSB7XHJcbiAgICAgICAgICAgIGVsZW1CeUlkKCd1cGRhdGVJZ25vcmUnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChsb2NhdGlvbi5wcm90b2NvbCA9PT0gJ2Nocm9tZS1leHRlbnNpb246Jykge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1CeUlkKCd1cGRhdGUnKS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtQnlJZCgndXBkYXRlQmFja2dyb3VuZCcpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcclxuICAgICAgICAgICAgICAgICAgICB9LCAzNTApXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICBjb25zdCByZXNwMiA9IGF3YWl0IHNlbmQoQ09NTUlUX1VSTCwgJ2pzb24nKVxyXG4gICAgICAgICAgICBjb25zdCB7IHNoYSwgdXJsIH0gPSByZXNwMi5yZXNwb25zZS5vYmplY3RcclxuICAgICAgICAgICAgY29uc3QgcmVzcDMgPSBhd2FpdCBzZW5kKChsb2NhdGlvbi5wcm90b2NvbCA9PT0gJ2Nocm9tZS1leHRlbnNpb246JyA/IHVybCA6IGAvYXBpL2NvbW1pdC8ke3NoYX1gKSwgJ2pzb24nKVxyXG4gICAgICAgICAgICBlbGVtQnlJZCgncGFzdFVwZGF0ZVZlcnNpb24nKS5pbm5lckhUTUwgPSBWRVJTSU9OXHJcbiAgICAgICAgICAgIGVsZW1CeUlkKCduZXdVcGRhdGVWZXJzaW9uJykuaW5uZXJIVE1MID0gY1xyXG4gICAgICAgICAgICBlbGVtQnlJZCgndXBkYXRlRmVhdHVyZXMnKS5pbm5lckhUTUwgPSBmb3JtYXRDb21taXRNZXNzYWdlKHJlc3AzLnJlc3BvbnNlLm1lc3NhZ2UpXHJcbiAgICAgICAgICAgIGVsZW1CeUlkKCd1cGRhdGVCYWNrZ3JvdW5kJykuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcclxuICAgICAgICAgICAgZWxlbUJ5SWQoJ3VwZGF0ZScpLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcbiAgICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ0NvdWxkIG5vdCBhY2Nlc3MgR2l0aHViLiBIZXJlXFwncyB0aGUgZXJyb3I6JywgZXJyKVxyXG4gICAgfVxyXG59XHJcblxyXG5sZXQgbmV3c1VybDogc3RyaW5nfG51bGwgPSBudWxsXHJcbmxldCBuZXdzQ29tbWl0OiBzdHJpbmd8bnVsbCA9IG51bGxcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmZXRjaE5ld3MoKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHJlc3AgPSBhd2FpdCBzZW5kKE5FV1NfVVJMLCAnanNvbicpXHJcbiAgICAgICAgbGV0IGxhc3QgPSBsb2NhbFN0b3JhZ2VSZWFkKCduZXdzQ29tbWl0JylcclxuICAgICAgICBuZXdzQ29tbWl0ID0gcmVzcC5yZXNwb25zZS5oaXN0b3J5WzBdLnZlcnNpb25cclxuXHJcbiAgICAgICAgaWYgKGxhc3QgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBsYXN0ID0gbmV3c0NvbW1pdFxyXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2VXcml0ZSgnbmV3c0NvbW1pdCcsIG5ld3NDb21taXQpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBuZXdzVXJsID0gcmVzcC5yZXNwb25zZS5maWxlc1sndXBkYXRlcy5odG0nXS5yYXdfdXJsXHJcblxyXG4gICAgICAgIGlmIChsYXN0ICE9PSBuZXdzQ29tbWl0KSB7XHJcbiAgICAgICAgICAgIGdldE5ld3MoKVxyXG4gICAgICAgIH1cclxuICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdDb3VsZCBub3QgYWNjZXNzIEdpdGh1Yi4gSGVyZVxcJ3MgdGhlIGVycm9yOicsIGVycilcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldE5ld3Mob25mYWlsPzogKCkgPT4gdm9pZCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgaWYgKCFuZXdzVXJsKSB7XHJcbiAgICAgICAgaWYgKG9uZmFpbCkgb25mYWlsKClcclxuICAgICAgICByZXR1cm5cclxuICAgIH1cclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcmVzcCA9IGF3YWl0IHNlbmQobmV3c1VybClcclxuICAgICAgICBsb2NhbFN0b3JhZ2UubmV3c0NvbW1pdCA9IG5ld3NDb21taXRcclxuICAgICAgICByZXNwLnJlc3BvbnNlVGV4dC5zcGxpdCgnPGhyPicpLmZvckVhY2goKG5ld3MpID0+IHtcclxuICAgICAgICAgICAgZWxlbUJ5SWQoJ25ld3NDb250ZW50JykuYXBwZW5kQ2hpbGQoZWxlbWVudCgnZGl2JywgJ25ld3NJdGVtJywgbmV3cykpXHJcbiAgICAgICAgfSlcclxuICAgICAgICBlbGVtQnlJZCgnbmV3c0JhY2tncm91bmQnKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xyXG4gICAgICAgIGVsZW1CeUlkKCduZXdzJykuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdDb3VsZCBub3QgYWNjZXNzIEdpdGh1Yi4gSGVyZVxcJ3MgdGhlIGVycm9yOicsIGVycilcclxuICAgICAgICBpZiAob25mYWlsKSBvbmZhaWwoKVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IGNsYXNzQnlJZCwgZ2V0RGF0YSwgSUFzc2lnbm1lbnQgfSBmcm9tICcuLi9wY3InXHJcbmltcG9ydCB7IEFjdGl2aXR5VHlwZSB9IGZyb20gJy4uL3BsdWdpbnMvYWN0aXZpdHknXHJcbmltcG9ydCB7IGFzc2lnbm1lbnRJbkRvbmUgfSBmcm9tICcuLi9wbHVnaW5zL2RvbmUnXHJcbmltcG9ydCB7IF8kLCBkYXRlU3RyaW5nLCBlbGVtQnlJZCwgZWxlbWVudCwgc21vb3RoU2Nyb2xsIH0gZnJvbSAnLi4vdXRpbCdcclxuaW1wb3J0IHsgc2VwYXJhdGUgfSBmcm9tICcuL2Fzc2lnbm1lbnQnXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYWRkQWN0aXZpdHlFbGVtZW50KGVsOiBIVE1MRWxlbWVudCk6IHZvaWQge1xyXG4gICAgY29uc3QgaW5zZXJ0VG8gPSBlbGVtQnlJZCgnaW5mb0FjdGl2aXR5JylcclxuICAgIGluc2VydFRvLmluc2VydEJlZm9yZShlbCwgaW5zZXJ0VG8ucXVlcnlTZWxlY3RvcignLmFjdGl2aXR5JykpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVBY3Rpdml0eSh0eXBlOiBBY3Rpdml0eVR5cGUsIGFzc2lnbm1lbnQ6IElBc3NpZ25tZW50LCBkYXRlOiBEYXRlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPzogc3RyaW5nICk6IEhUTUxFbGVtZW50IHtcclxuICAgIGNvbnN0IGNuYW1lID0gY2xhc3NOYW1lIHx8IGNsYXNzQnlJZChhc3NpZ25tZW50LmNsYXNzKVxyXG5cclxuICAgIGNvbnN0IHRlID0gZWxlbWVudCgnZGl2JywgWydhY3Rpdml0eScsICdhc3NpZ25tZW50SXRlbScsIGFzc2lnbm1lbnQuYmFzZVR5cGUsIHR5cGVdLCBgXHJcbiAgICAgICAgPGkgY2xhc3M9J21hdGVyaWFsLWljb25zJz4ke3R5cGV9PC9pPlxyXG4gICAgICAgIDxzcGFuIGNsYXNzPSd0aXRsZSc+JHthc3NpZ25tZW50LnRpdGxlfTwvc3Bhbj5cclxuICAgICAgICA8c21hbGw+JHtzZXBhcmF0ZShjbmFtZSlbMl19PC9zbWFsbD5cclxuICAgICAgICA8ZGl2IGNsYXNzPSdyYW5nZSc+JHtkYXRlU3RyaW5nKGRhdGUpfTwvZGl2PmAsIGBhY3Rpdml0eSR7YXNzaWdubWVudC5pZH1gKVxyXG4gICAgdGUuc2V0QXR0cmlidXRlKCdkYXRhLWNsYXNzJywgY25hbWUpXHJcbiAgICBjb25zdCB7IGlkIH0gPSBhc3NpZ25tZW50XHJcbiAgICBpZiAodHlwZSAhPT0gJ2RlbGV0ZScpIHtcclxuICAgICAgICB0ZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgZG9TY3JvbGxpbmcgPSBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBlbCA9IF8kKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYC5hc3NpZ25tZW50W2lkKj1cXFwiJHtpZH1cXFwiXWApKSBhcyBIVE1MRWxlbWVudFxyXG4gICAgICAgICAgICAgICAgYXdhaXQgc21vb3RoU2Nyb2xsKChlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgKyBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCkgLSAxMTYpXHJcbiAgICAgICAgICAgICAgICBlbC5jbGljaygpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGRvY3VtZW50LmJvZHkuZ2V0QXR0cmlidXRlKCdkYXRhLXZpZXcnKSA9PT0gJzAnKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBkb1Njcm9sbGluZygpXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAoXyQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI25hdlRhYnM+bGk6Zmlyc3QtY2hpbGQnKSkgYXMgSFRNTEVsZW1lbnQpLmNsaWNrKClcclxuICAgICAgICAgICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGRvU2Nyb2xsaW5nLCA1MDApXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChhc3NpZ25tZW50SW5Eb25lKGFzc2lnbm1lbnQuaWQpKSB7XHJcbiAgICAgIHRlLmNsYXNzTGlzdC5hZGQoJ2RvbmUnKVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRlXHJcbn1cclxuIiwiaW1wb3J0IHsgZnJvbURhdGVOdW0sIHRvZGF5IH0gZnJvbSAnLi4vZGF0ZXMnXHJcbmltcG9ydCB7IGRpc3BsYXksIGdldFRpbWVBZnRlciwgSVNwbGl0QXNzaWdubWVudCB9IGZyb20gJy4uL2Rpc3BsYXknXHJcbmltcG9ydCB7IGdldExpc3REYXRlT2Zmc2V0IH0gZnJvbSAnLi4vbmF2aWdhdGlvbidcclxuaW1wb3J0IHsgZ2V0QXR0YWNobWVudE1pbWVUeXBlLCBJQXBwbGljYXRpb25EYXRhLCBJQXNzaWdubWVudCwgdXJsRm9yQXR0YWNobWVudCB9IGZyb20gJy4uL3BjcidcclxuaW1wb3J0IHsgcmVjZW50QWN0aXZpdHkgfSBmcm9tICcuLi9wbHVnaW5zL2FjdGl2aXR5J1xyXG5pbXBvcnQgeyBnZXRBdGhlbmFEYXRhIH0gZnJvbSAnLi4vcGx1Z2lucy9hdGhlbmEnXHJcbmltcG9ydCB7IHJlbW92ZUZyb21FeHRyYSwgc2F2ZUV4dHJhIH0gZnJvbSAnLi4vcGx1Z2lucy9jdXN0b21Bc3NpZ25tZW50cydcclxuaW1wb3J0IHsgYWRkVG9Eb25lLCBhc3NpZ25tZW50SW5Eb25lLCByZW1vdmVGcm9tRG9uZSwgc2F2ZURvbmUgfSBmcm9tICcuLi9wbHVnaW5zL2RvbmUnXHJcbmltcG9ydCB7IG1vZGlmaWVkQm9keSwgcmVtb3ZlRnJvbU1vZGlmaWVkLCBzYXZlTW9kaWZpZWQsIHNldE1vZGlmaWVkIH0gZnJvbSAnLi4vcGx1Z2lucy9tb2RpZmllZEFzc2lnbm1lbnRzJ1xyXG5pbXBvcnQgeyBzZXR0aW5ncyB9IGZyb20gJy4uL3NldHRpbmdzJ1xyXG5pbXBvcnQgeyBfJCwgY3NzTnVtYmVyLCBkYXRlU3RyaW5nLCBlbGVtQnlJZCwgZWxlbWVudCwgZm9yY2VMYXlvdXQsIHJpcHBsZSB9IGZyb20gJy4uL3V0aWwnXHJcbmltcG9ydCB7IHJlc2l6ZSB9IGZyb20gJy4vcmVzaXplcidcclxuXHJcbmNvbnN0IG1pbWVUeXBlczogeyBbbWltZTogc3RyaW5nXTogW3N0cmluZywgc3RyaW5nXSB9ID0ge1xyXG4gICAgJ2FwcGxpY2F0aW9uL21zd29yZCc6IFsnV29yZCBEb2MnLCAnZG9jdW1lbnQnXSxcclxuICAgICdhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQud29yZHByb2Nlc3NpbmdtbC5kb2N1bWVudCc6IFsnV29yZCBEb2MnLCAnZG9jdW1lbnQnXSxcclxuICAgICdhcHBsaWNhdGlvbi92bmQubXMtcG93ZXJwb2ludCc6IFsnUFBUIFByZXNlbnRhdGlvbicsICdzbGlkZXMnXSxcclxuICAgICdhcHBsaWNhdGlvbi9wZGYnOiBbJ1BERiBGaWxlJywgJ3BkZiddLFxyXG4gICAgJ3RleHQvcGxhaW4nOiBbJ1RleHQgRG9jJywgJ3BsYWluJ11cclxufVxyXG5cclxuY29uc3QgZG1wID0gbmV3IGRpZmZfbWF0Y2hfcGF0Y2goKSAvLyBGb3IgZGlmZmluZ1xyXG5cclxuZnVuY3Rpb24gcG9wdWxhdGVBZGRlZERlbGV0ZWQoZGlmZnM6IGFueVtdLCBlZGl0czogSFRNTEVsZW1lbnQpOiBib29sZWFuIHtcclxuICAgIGxldCBhZGRlZCA9IDBcclxuICAgIGxldCBkZWxldGVkID0gMFxyXG4gICAgZGlmZnMuZm9yRWFjaCgoZGlmZikgPT4ge1xyXG4gICAgICAgIGlmIChkaWZmWzBdID09PSAxKSB7IGFkZGVkKysgfVxyXG4gICAgICAgIGlmIChkaWZmWzBdID09PSAtMSkgeyBkZWxldGVkKysgfVxyXG4gICAgfSlcclxuICAgIF8kKGVkaXRzLnF1ZXJ5U2VsZWN0b3IoJy5hZGRpdGlvbnMnKSkuaW5uZXJIVE1MID0gYWRkZWQgIT09IDAgPyBgKyR7YWRkZWR9YCA6ICcnXHJcbiAgICBfJChlZGl0cy5xdWVyeVNlbGVjdG9yKCcuZGVsZXRpb25zJykpLmlubmVySFRNTCA9IGRlbGV0ZWQgIT09IDAgPyBgLSR7ZGVsZXRlZH1gIDogJydcclxuICAgIGVkaXRzLmNsYXNzTGlzdC5hZGQoJ25vdEVtcHR5JylcclxuICAgIHJldHVybiBhZGRlZCA+IDAgfHwgZGVsZXRlZCA+IDBcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNvbXB1dGVXZWVrSWQoc3BsaXQ6IElTcGxpdEFzc2lnbm1lbnQpOiBzdHJpbmcge1xyXG4gICAgY29uc3Qgc3RhcnRTdW4gPSBuZXcgRGF0ZShzcGxpdC5zdGFydC5nZXRUaW1lKCkpXHJcbiAgICBzdGFydFN1bi5zZXREYXRlKHN0YXJ0U3VuLmdldERhdGUoKSAtIHN0YXJ0U3VuLmdldERheSgpKVxyXG4gICAgcmV0dXJuIGB3ayR7c3RhcnRTdW4uZ2V0TW9udGgoKX0tJHtzdGFydFN1bi5nZXREYXRlKCl9YFxyXG59XHJcblxyXG4vLyBUaGlzIGZ1bmN0aW9uIHNlcGFyYXRlcyB0aGUgcGFydHMgb2YgYSBjbGFzcyBuYW1lLlxyXG5leHBvcnQgZnVuY3Rpb24gc2VwYXJhdGUoY2w6IHN0cmluZyk6IFJlZ0V4cE1hdGNoQXJyYXkge1xyXG4gICAgY29uc3QgbSA9IGNsLm1hdGNoKC8oKD86XFxkKlxccyspPyg/Oig/Omhvblxcdyp8KD86YWR2XFx3KlxccyopP2NvcmUpXFxzKyk/KSguKikvaSlcclxuICAgIGlmIChtID09IG51bGwpIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IHNlcGFyYXRlIGNsYXNzIHN0cmluZyAke2NsfWApXHJcbiAgICByZXR1cm4gbVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYXNzaWdubWVudENsYXNzKGFzc2lnbm1lbnQ6IElBc3NpZ25tZW50LCBkYXRhOiBJQXBwbGljYXRpb25EYXRhKTogc3RyaW5nIHtcclxuICAgIGNvbnN0IGNscyA9IChhc3NpZ25tZW50LmNsYXNzICE9IG51bGwpID8gZGF0YS5jbGFzc2VzW2Fzc2lnbm1lbnQuY2xhc3NdIDogJ1Rhc2snXHJcbiAgICBpZiAoY2xzID09IG51bGwpIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGZpbmQgY2xhc3MgJHthc3NpZ25tZW50LmNsYXNzfSBpbiAke2RhdGEuY2xhc3Nlc31gKVxyXG4gICAgcmV0dXJuIGNsc1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2VwYXJhdGVkQ2xhc3MoYXNzaWdubWVudDogSUFzc2lnbm1lbnQsIGRhdGE6IElBcHBsaWNhdGlvbkRhdGEpOiBSZWdFeHBNYXRjaEFycmF5IHtcclxuICAgIHJldHVybiBzZXBhcmF0ZShhc3NpZ25tZW50Q2xhc3MoYXNzaWdubWVudCwgZGF0YSkpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVBc3NpZ25tZW50KHNwbGl0OiBJU3BsaXRBc3NpZ25tZW50LCBkYXRhOiBJQXBwbGljYXRpb25EYXRhKTogSFRNTEVsZW1lbnQge1xyXG4gICAgY29uc3QgeyBhc3NpZ25tZW50LCByZWZlcmVuY2UgfSA9IHNwbGl0XHJcblxyXG4gICAgLy8gU2VwYXJhdGUgdGhlIGNsYXNzIGRlc2NyaXB0aW9uIGZyb20gdGhlIGFjdHVhbCBjbGFzc1xyXG4gICAgY29uc3Qgc2VwYXJhdGVkID0gc2VwYXJhdGVkQ2xhc3MoYXNzaWdubWVudCwgZGF0YSlcclxuXHJcbiAgICBjb25zdCB3ZWVrSWQgPSBjb21wdXRlV2Vla0lkKHNwbGl0KVxyXG5cclxuICAgIGxldCBzbWFsbFRhZyA9ICdzbWFsbCdcclxuICAgIGxldCBsaW5rID0gbnVsbFxyXG4gICAgY29uc3QgYXRoZW5hRGF0YSA9IGdldEF0aGVuYURhdGEoKVxyXG4gICAgaWYgKGF0aGVuYURhdGEgJiYgYXNzaWdubWVudC5jbGFzcyAhPSBudWxsICYmIChhdGhlbmFEYXRhW2RhdGEuY2xhc3Nlc1thc3NpZ25tZW50LmNsYXNzXV0gIT0gbnVsbCkpIHtcclxuICAgICAgICBsaW5rID0gYXRoZW5hRGF0YVtkYXRhLmNsYXNzZXNbYXNzaWdubWVudC5jbGFzc11dLmxpbmtcclxuICAgICAgICBzbWFsbFRhZyA9ICdhJ1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGUgPSBlbGVtZW50KCdkaXYnLCBbJ2Fzc2lnbm1lbnQnLCBhc3NpZ25tZW50LmJhc2VUeXBlLCAnYW5pbSddLFxyXG4gICAgICAgICAgICAgICAgICAgICAgYDwke3NtYWxsVGFnfSR7bGluayA/IGAgaHJlZj0nJHtsaW5rfScgY2xhc3M9J2xpbmtlZCcgdGFyZ2V0PSdfYmxhbmsnYCA6ICcnfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9J2V4dHJhJz4ke3NlcGFyYXRlZFsxXX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICR7c2VwYXJhdGVkWzJdfVxyXG4gICAgICAgICAgICAgICAgICAgICAgIDwvJHtzbWFsbFRhZ30+PHNwYW4gY2xhc3M9J3RpdGxlJz4ke2Fzc2lnbm1lbnQudGl0bGV9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPSdoaWRkZW4nIGNsYXNzPSdkdWUnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPScke2Fzc2lnbm1lbnQuZW5kID09PSAnRm9yZXZlcicgPyAwIDogYXNzaWdubWVudC5lbmR9JyAvPmAsXHJcbiAgICAgICAgICAgICAgICAgICAgICBhc3NpZ25tZW50LmlkICsgd2Vla0lkKVxyXG5cclxuICAgIGlmICgoIHJlZmVyZW5jZSAmJiByZWZlcmVuY2UuZG9uZSkgfHwgYXNzaWdubWVudEluRG9uZShhc3NpZ25tZW50LmlkKSkge1xyXG4gICAgICAgIGUuY2xhc3NMaXN0LmFkZCgnZG9uZScpXHJcbiAgICB9XHJcbiAgICBlLnNldEF0dHJpYnV0ZSgnZGF0YS1jbGFzcycsIGFzc2lnbm1lbnRDbGFzcyhhc3NpZ25tZW50LCBkYXRhKSlcclxuICAgIGNvbnN0IGNsb3NlID0gZWxlbWVudCgnYScsIFsnY2xvc2UnLCAnbWF0ZXJpYWwtaWNvbnMnXSwgJ2Nsb3NlJylcclxuICAgIGNsb3NlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xvc2VPcGVuZWQpXHJcbiAgICBlLmFwcGVuZENoaWxkKGNsb3NlKVxyXG5cclxuICAgIC8vIFByZXZlbnQgY2xpY2tpbmcgdGhlIGNsYXNzIG5hbWUgd2hlbiBhbiBpdGVtIGlzIGRpc3BsYXllZCBvbiB0aGUgY2FsZW5kYXIgZnJvbSBkb2luZyBhbnl0aGluZ1xyXG4gICAgaWYgKGxpbmsgIT0gbnVsbCkge1xyXG4gICAgICAgIF8kKGUucXVlcnlTZWxlY3RvcignYScpKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldnQpID0+IHtcclxuICAgICAgICAgICAgaWYgKChkb2N1bWVudC5ib2R5LmdldEF0dHJpYnV0ZSgnZGF0YS12aWV3JykgPT09ICcwJykgJiYgIWUuY2xhc3NMaXN0LmNvbnRhaW5zKCdmdWxsJykpIHtcclxuICAgICAgICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGNvbXBsZXRlID0gZWxlbWVudCgnYScsIFsnY29tcGxldGUnLCAnbWF0ZXJpYWwtaWNvbnMnLCAnd2F2ZXMnXSwgJ2RvbmUnKVxyXG4gICAgcmlwcGxlKGNvbXBsZXRlKVxyXG4gICAgY29uc3QgaWQgPSBzcGxpdC5hc3NpZ25tZW50LmlkXHJcbiAgICBjb21wbGV0ZS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgKGV2dCkgPT4ge1xyXG4gICAgICAgIGlmIChldnQud2hpY2ggPT09IDEpIHsgLy8gTGVmdCBidXR0b25cclxuICAgICAgICAgICAgbGV0IGFkZGVkID0gdHJ1ZVxyXG4gICAgICAgICAgICBpZiAocmVmZXJlbmNlICE9IG51bGwpIHsgLy8gVGFzayBpdGVtXHJcbiAgICAgICAgICAgICAgICBpZiAoZS5jbGFzc0xpc3QuY29udGFpbnMoJ2RvbmUnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlZmVyZW5jZS5kb25lID0gZmFsc2VcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWRkZWQgPSBmYWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHJlZmVyZW5jZS5kb25lID0gdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgc2F2ZUV4dHJhKClcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChlLmNsYXNzTGlzdC5jb250YWlucygnZG9uZScpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVtb3ZlRnJvbURvbmUoYXNzaWdubWVudC5pZClcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWRkZWQgPSBmYWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIGFkZFRvRG9uZShhc3NpZ25tZW50LmlkKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgc2F2ZURvbmUoKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5ib2R5LmdldEF0dHJpYnV0ZSgnZGF0YS12aWV3JykgPT09ICcxJykge1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXHJcbiAgICAgICAgICAgICAgICAgICAgYC5hc3NpZ25tZW50W2lkXj1cXFwiJHtpZH1cXFwiXSwgI3Rlc3Qke2lkfSwgI2FjdGl2aXR5JHtpZH0sICNpYSR7aWR9YFxyXG4gICAgICAgICAgICAgICAgKS5mb3JFYWNoKChlbGVtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbS5jbGFzc0xpc3QudG9nZ2xlKCdkb25lJylcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICBpZiAoYWRkZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmFzc2lnbm1lbnQubGlzdERpc3A6bm90KC5kb25lKScpLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ25vTGlzdCcpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmFzc2lnbm1lbnQubGlzdERpc3A6bm90KC5kb25lKScpLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ25vTGlzdCcpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmVzaXplKClcclxuICAgICAgICAgICAgfSwgMTAwKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXHJcbiAgICAgICAgICAgICAgICBgLmFzc2lnbm1lbnRbaWRePVxcXCIke2lkfVxcXCJdLCAjdGVzdCR7aWR9LCAjYWN0aXZpdHkke2lkfSwgI2lhJHtpZH1gXHJcbiAgICAgICAgICAgICkuZm9yRWFjaCgoZWxlbSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZWxlbS5jbGFzc0xpc3QudG9nZ2xlKCdkb25lJylcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgaWYgKGFkZGVkKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmFzc2lnbm1lbnQubGlzdERpc3A6bm90KC5kb25lKScpLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnbm9MaXN0JylcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYXNzaWdubWVudC5saXN0RGlzcDpub3QoLmRvbmUpJykubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdub0xpc3QnKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICAgZS5hcHBlbmRDaGlsZChjb21wbGV0ZSlcclxuXHJcbiAgICAvLyBJZiB0aGUgYXNzaWdubWVudCBpcyBhIGN1c3RvbSBvbmUsIGFkZCBhIGJ1dHRvbiB0byBkZWxldGUgaXRcclxuICAgIGlmIChzcGxpdC5jdXN0b20pIHtcclxuICAgICAgICBjb25zdCBkZWxldGVBID0gZWxlbWVudCgnYScsIFsnbWF0ZXJpYWwtaWNvbnMnLCAnZGVsZXRlQXNzaWdubWVudCcsICd3YXZlcyddLCAnZGVsZXRlJylcclxuICAgICAgICByaXBwbGUoZGVsZXRlQSlcclxuICAgICAgICBkZWxldGVBLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCAoZXZ0KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChldnQud2hpY2ggIT09IDEgfHwgIXJlZmVyZW5jZSkgcmV0dXJuXHJcbiAgICAgICAgICAgIHJlbW92ZUZyb21FeHRyYShyZWZlcmVuY2UpXHJcbiAgICAgICAgICAgIHNhdmVFeHRyYSgpXHJcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZnVsbCcpICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnYXV0bydcclxuICAgICAgICAgICAgICAgIGNvbnN0IGJhY2sgPSBlbGVtQnlJZCgnYmFja2dyb3VuZCcpXHJcbiAgICAgICAgICAgICAgICBiYWNrLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBiYWNrLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcclxuICAgICAgICAgICAgICAgIH0sIDM1MClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlLnJlbW92ZSgpXHJcbiAgICAgICAgICAgIGRpc3BsYXkoZmFsc2UpXHJcbiAgICAgICAgfSlcclxuICAgICAgICBlLmFwcGVuZENoaWxkKGRlbGV0ZUEpXHJcbiAgICB9XHJcblxyXG4gICAgLy8gTW9kaWZpY2F0aW9uIGJ1dHRvblxyXG4gICAgY29uc3QgZWRpdCA9IGVsZW1lbnQoJ2EnLCBbJ2VkaXRBc3NpZ25tZW50JywgJ21hdGVyaWFsLWljb25zJywgJ3dhdmVzJ10sICdlZGl0JylcclxuICAgIGVkaXQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIChldnQpID0+IHtcclxuICAgICAgICBpZiAoZXZ0LndoaWNoID09PSAxKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlbW92ZSA9IGVkaXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKVxyXG4gICAgICAgICAgICBlZGl0LmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScpXHJcbiAgICAgICAgICAgIF8kKGUucXVlcnlTZWxlY3RvcignLmJvZHknKSkuc2V0QXR0cmlidXRlKCdjb250ZW50RWRpdGFibGUnLCByZW1vdmUgPyAnZmFsc2UnIDogJ3RydWUnKVxyXG4gICAgICAgICAgICBpZiAoIXJlbW92ZSkge1xyXG4gICAgICAgICAgICAgICAgKGUucXVlcnlTZWxlY3RvcignLmJvZHknKSBhcyBIVE1MRWxlbWVudCkuZm9jdXMoKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGRuID0gZS5xdWVyeVNlbGVjdG9yKCcuY29tcGxldGUnKSBhcyBIVE1MRWxlbWVudFxyXG4gICAgICAgICAgICBkbi5zdHlsZS5kaXNwbGF5ID0gcmVtb3ZlID8gJ2Jsb2NrJyA6ICdub25lJ1xyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbiAgICByaXBwbGUoZWRpdClcclxuXHJcbiAgICBlLmFwcGVuZENoaWxkKGVkaXQpXHJcblxyXG4gICAgY29uc3Qgc3RhcnQgPSBuZXcgRGF0ZShmcm9tRGF0ZU51bShhc3NpZ25tZW50LnN0YXJ0KSlcclxuICAgIGNvbnN0IGVuZCA9IGFzc2lnbm1lbnQuZW5kID09PSAnRm9yZXZlcicgPyBhc3NpZ25tZW50LmVuZCA6IG5ldyBEYXRlKGZyb21EYXRlTnVtKGFzc2lnbm1lbnQuZW5kKSlcclxuICAgIGNvbnN0IHRpbWVzID0gZWxlbWVudCgnZGl2JywgJ3JhbmdlJyxcclxuICAgICAgICBhc3NpZ25tZW50LnN0YXJ0ID09PSBhc3NpZ25tZW50LmVuZCA/IGRhdGVTdHJpbmcoc3RhcnQpIDogYCR7ZGF0ZVN0cmluZyhzdGFydCl9ICZuZGFzaDsgJHtkYXRlU3RyaW5nKGVuZCl9YClcclxuICAgIGUuYXBwZW5kQ2hpbGQodGltZXMpXHJcbiAgICBpZiAoYXNzaWdubWVudC5hdHRhY2htZW50cy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgY29uc3QgYXR0YWNobWVudHMgPSBlbGVtZW50KCdkaXYnLCAnYXR0YWNobWVudHMnKVxyXG4gICAgICAgIGFzc2lnbm1lbnQuYXR0YWNobWVudHMuZm9yRWFjaCgoYXR0YWNobWVudCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBhID0gZWxlbWVudCgnYScsIFtdLCBhdHRhY2htZW50WzBdKSBhcyBIVE1MQW5jaG9yRWxlbWVudFxyXG4gICAgICAgICAgICBhLmhyZWYgPSB1cmxGb3JBdHRhY2htZW50KGF0dGFjaG1lbnRbMV0pXHJcbiAgICAgICAgICAgIGdldEF0dGFjaG1lbnRNaW1lVHlwZShhdHRhY2htZW50WzFdKS50aGVuKCh0eXBlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc3BhblxyXG4gICAgICAgICAgICAgICAgaWYgKG1pbWVUeXBlc1t0eXBlXSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYS5jbGFzc0xpc3QuYWRkKG1pbWVUeXBlc1t0eXBlXVsxXSlcclxuICAgICAgICAgICAgICAgICAgICBzcGFuID0gZWxlbWVudCgnc3BhbicsIFtdLCBtaW1lVHlwZXNbdHlwZV1bMF0pXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHNwYW4gPSBlbGVtZW50KCdzcGFuJywgW10sICdVbmtub3duIGZpbGUgdHlwZScpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBhLmFwcGVuZENoaWxkKHNwYW4pXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIGF0dGFjaG1lbnRzLmFwcGVuZENoaWxkKGEpXHJcbiAgICAgICAgfSlcclxuICAgICAgICBlLmFwcGVuZENoaWxkKGF0dGFjaG1lbnRzKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGJvZHkgPSBlbGVtZW50KCdkaXYnLCAnYm9keScsXHJcbiAgICAgICAgYXNzaWdubWVudC5ib2R5LnJlcGxhY2UoL2ZvbnQtZmFtaWx5OlteO10qPyg/OlRpbWVzIE5ldyBSb21hbnxzZXJpZilbXjtdKi9nLCAnJykpXHJcbiAgICBjb25zdCBlZGl0cyA9IGVsZW1lbnQoJ2RpdicsICdlZGl0cycsICc8c3BhbiBjbGFzcz1cXCdhZGRpdGlvbnNcXCc+PC9zcGFuPjxzcGFuIGNsYXNzPVxcJ2RlbGV0aW9uc1xcJz48L3NwYW4+JylcclxuICAgIGNvbnN0IG0gPSBtb2RpZmllZEJvZHkoYXNzaWdubWVudC5pZClcclxuICAgIGlmIChtICE9IG51bGwpIHtcclxuICAgICAgICBjb25zdCBkID0gZG1wLmRpZmZfbWFpbihhc3NpZ25tZW50LmJvZHksIG0pXHJcbiAgICAgICAgZG1wLmRpZmZfY2xlYW51cFNlbWFudGljKGQpXHJcbiAgICAgICAgaWYgKGQubGVuZ3RoICE9PSAwKSB7IC8vIEhhcyBiZWVuIGVkaXRlZFxyXG4gICAgICAgICAgICBwb3B1bGF0ZUFkZGVkRGVsZXRlZChkLCBlZGl0cylcclxuICAgICAgICAgICAgYm9keS5pbm5lckhUTUwgPSBtXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGJvZHkuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoZXZ0KSA9PiB7XHJcbiAgICAgICAgaWYgKHJlZmVyZW5jZSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHJlZmVyZW5jZS5ib2R5ID0gYm9keS5pbm5lckhUTUxcclxuICAgICAgICAgICAgc2F2ZUV4dHJhKClcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBzZXRNb2RpZmllZChhc3NpZ25tZW50LmlkLCAgYm9keS5pbm5lckhUTUwpXHJcbiAgICAgICAgICAgIHNhdmVNb2RpZmllZCgpXHJcbiAgICAgICAgICAgIGNvbnN0IGQgPSBkbXAuZGlmZl9tYWluKGFzc2lnbm1lbnQuYm9keSwgYm9keS5pbm5lckhUTUwpXHJcbiAgICAgICAgICAgIGRtcC5kaWZmX2NsZWFudXBTZW1hbnRpYyhkKVxyXG4gICAgICAgICAgICBpZiAocG9wdWxhdGVBZGRlZERlbGV0ZWQoZCwgZWRpdHMpKSB7XHJcbiAgICAgICAgICAgICAgICBlZGl0cy5jbGFzc0xpc3QuYWRkKCdub3RFbXB0eScpXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBlZGl0cy5jbGFzc0xpc3QucmVtb3ZlKCdub3RFbXB0eScpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGRvY3VtZW50LmJvZHkuZ2V0QXR0cmlidXRlKCdkYXRhLXZpZXcnKSA9PT0gJzEnKSByZXNpemUoKVxyXG4gICAgfSlcclxuXHJcbiAgICBlLmFwcGVuZENoaWxkKGJvZHkpXHJcblxyXG4gICAgY29uc3QgcmVzdG9yZSA9IGVsZW1lbnQoJ2EnLCBbJ21hdGVyaWFsLWljb25zJywgJ3Jlc3RvcmUnXSwgJ3NldHRpbmdzX2JhY2t1cF9yZXN0b3JlJylcclxuICAgIHJlc3RvcmUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgcmVtb3ZlRnJvbU1vZGlmaWVkKGFzc2lnbm1lbnQuaWQpXHJcbiAgICAgICAgc2F2ZU1vZGlmaWVkKClcclxuICAgICAgICBib2R5LmlubmVySFRNTCA9IGFzc2lnbm1lbnQuYm9keVxyXG4gICAgICAgIGVkaXRzLmNsYXNzTGlzdC5yZW1vdmUoJ25vdEVtcHR5JylcclxuICAgICAgICBpZiAoZG9jdW1lbnQuYm9keS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmlldycpID09PSAnMScpICByZXNpemUoKVxyXG4gICAgfSlcclxuICAgIGVkaXRzLmFwcGVuZENoaWxkKHJlc3RvcmUpXHJcbiAgICBlLmFwcGVuZENoaWxkKGVkaXRzKVxyXG5cclxuICAgIGNvbnN0IG1vZHMgPSBlbGVtZW50KCdkaXYnLCBbJ21vZHMnXSlcclxuICAgIHJlY2VudEFjdGl2aXR5KCkuZm9yRWFjaCgoYSkgPT4ge1xyXG4gICAgICAgIGlmICgoYVswXSA9PT0gJ2VkaXQnKSAmJiAoYVsxXS5pZCA9PT0gYXNzaWdubWVudC5pZCkpIHtcclxuICAgICAgICBjb25zdCB0ZSA9IGVsZW1lbnQoJ2RpdicsIFsnaW5uZXJBY3Rpdml0eScsICdhc3NpZ25tZW50SXRlbScsIGFzc2lnbm1lbnQuYmFzZVR5cGVdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBgPGkgY2xhc3M9J21hdGVyaWFsLWljb25zJz5lZGl0PC9pPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9J3RpdGxlJz4ke2RhdGVTdHJpbmcobmV3IERhdGUoYVsyXSkpfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPSdhZGRpdGlvbnMnPjwvc3Bhbj48c3BhbiBjbGFzcz0nZGVsZXRpb25zJz48L3NwYW4+YCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgYGlhJHthc3NpZ25tZW50LmlkfWApXHJcbiAgICAgICAgY29uc3QgZCA9IGRtcC5kaWZmX21haW4oYVsxXS5ib2R5LCBhc3NpZ25tZW50LmJvZHkpXHJcbiAgICAgICAgZG1wLmRpZmZfY2xlYW51cFNlbWFudGljKGQpXHJcbiAgICAgICAgcG9wdWxhdGVBZGRlZERlbGV0ZWQoZCwgdGUpXHJcblxyXG4gICAgICAgIGlmIChhc3NpZ25tZW50LmNsYXNzKSB0ZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtY2xhc3MnLCBkYXRhLmNsYXNzZXNbYXNzaWdubWVudC5jbGFzc10pXHJcbiAgICAgICAgdGUuYXBwZW5kQ2hpbGQoZWxlbWVudCgnZGl2JywgJ2lhRGlmZicsIGRtcC5kaWZmX3ByZXR0eUh0bWwoZCkpKVxyXG4gICAgICAgIHRlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICB0ZS5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnKVxyXG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuYm9keS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmlldycpID09PSAnMScpIHJlc2l6ZSgpXHJcbiAgICAgICAgfSlcclxuICAgICAgICBtb2RzLmFwcGVuZENoaWxkKHRlKVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbiAgICBlLmFwcGVuZENoaWxkKG1vZHMpXHJcblxyXG4gICAgaWYgKHNldHRpbmdzLmFzc2lnbm1lbnRTcGFuID09PSAnbXVsdGlwbGUnICYmIChzdGFydCA8IHNwbGl0LnN0YXJ0KSkge1xyXG4gICAgICAgIGUuY2xhc3NMaXN0LmFkZCgnZnJvbVdlZWtlbmQnKVxyXG4gICAgfVxyXG4gICAgaWYgKHNldHRpbmdzLmFzc2lnbm1lbnRTcGFuID09PSAnbXVsdGlwbGUnICYmIChlbmQgPiBzcGxpdC5lbmQpKSB7XHJcbiAgICAgICAgZS5jbGFzc0xpc3QuYWRkKCdvdmVyV2Vla2VuZCcpXHJcbiAgICB9XHJcbiAgICBlLmNsYXNzTGlzdC5hZGQoYHMke3NwbGl0LnN0YXJ0LmdldERheSgpfWApXHJcbiAgICBpZiAoc3BsaXQuZW5kICE9PSAnRm9yZXZlcicpIGUuY2xhc3NMaXN0LmFkZChgZSR7NiAtIHNwbGl0LmVuZC5nZXREYXkoKX1gKVxyXG5cclxuICAgIGNvbnN0IHN0ID0gTWF0aC5mbG9vcihzcGxpdC5zdGFydC5nZXRUaW1lKCkgLyAxMDAwIC8gMzYwMCAvIDI0KVxyXG4gICAgaWYgKHNwbGl0LmFzc2lnbm1lbnQuZW5kID09PSAnRm9yZXZlcicpIHtcclxuICAgICAgICBpZiAoc3QgPD0gKHRvZGF5KCkgKyBnZXRMaXN0RGF0ZU9mZnNldCgpKSkge1xyXG4gICAgICAgICAgICBlLmNsYXNzTGlzdC5hZGQoJ2xpc3REaXNwJylcclxuICAgICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IG1pZERhdGUgPSBuZXcgRGF0ZSgpXHJcbiAgICAgICAgbWlkRGF0ZS5zZXREYXRlKG1pZERhdGUuZ2V0RGF0ZSgpICsgZ2V0TGlzdERhdGVPZmZzZXQoKSlcclxuICAgICAgICBjb25zdCBwdXNoID0gKGFzc2lnbm1lbnQuYmFzZVR5cGUgPT09ICd0ZXN0JyAmJiBhc3NpZ25tZW50LnN0YXJ0ID09PSBzdCkgPyBzZXR0aW5ncy5lYXJseVRlc3QgOiAwXHJcbiAgICAgICAgY29uc3QgZW5kRXh0cmEgPSBnZXRMaXN0RGF0ZU9mZnNldCgpID09PSAwID8gZ2V0VGltZUFmdGVyKG1pZERhdGUpIDogMjQgKiAzNjAwICogMTAwMFxyXG4gICAgICAgIGlmIChmcm9tRGF0ZU51bShzdCAtIHB1c2gpIDw9IG1pZERhdGUgJiZcclxuICAgICAgICAgICAgKHNwbGl0LmVuZCA9PT0gJ0ZvcmV2ZXInIHx8IG1pZERhdGUuZ2V0VGltZSgpIDw9IHNwbGl0LmVuZC5nZXRUaW1lKCkgKyBlbmRFeHRyYSkpIHtcclxuICAgICAgICAgICAgZS5jbGFzc0xpc3QuYWRkKCdsaXN0RGlzcCcpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIEFkZCBjbGljayBpbnRlcmFjdGl2aXR5XHJcbiAgICBpZiAoIXNwbGl0LmN1c3RvbSB8fCAhc2V0dGluZ3Muc2VwVGFza3MpIHtcclxuICAgICAgICBlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2dCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoKGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2Z1bGwnKS5sZW5ndGggPT09IDApICYmXHJcbiAgICAgICAgICAgICAgICAoZG9jdW1lbnQuYm9keS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmlldycpID09PSAnMCcpKSB7XHJcbiAgICAgICAgICAgICAgICBlLmNsYXNzTGlzdC5yZW1vdmUoJ2FuaW0nKVxyXG4gICAgICAgICAgICAgICAgZS5jbGFzc0xpc3QuYWRkKCdtb2RpZnknKVxyXG4gICAgICAgICAgICAgICAgZS5zdHlsZS50b3AgPSAoZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgLSBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLSBjc3NOdW1iZXIoZS5zdHlsZS5tYXJnaW5Ub3ApKSArIDQ0ICsgJ3B4J1xyXG4gICAgICAgICAgICAgICAgZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtdG9wJywgZS5zdHlsZS50b3ApXHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbidcclxuICAgICAgICAgICAgICAgIGNvbnN0IGJhY2sgPSBlbGVtQnlJZCgnYmFja2dyb3VuZCcpXHJcbiAgICAgICAgICAgICAgICBiYWNrLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcbiAgICAgICAgICAgICAgICBiYWNrLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXHJcbiAgICAgICAgICAgICAgICBlLmNsYXNzTGlzdC5hZGQoJ2FuaW0nKVxyXG4gICAgICAgICAgICAgICAgZm9yY2VMYXlvdXQoZSlcclxuICAgICAgICAgICAgICAgIGUuY2xhc3NMaXN0LmFkZCgnZnVsbCcpXHJcbiAgICAgICAgICAgICAgICBlLnN0eWxlLnRvcCA9ICg3NSAtIGNzc051bWJlcihlLnN0eWxlLm1hcmdpblRvcCkpICsgJ3B4J1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiBlLmNsYXNzTGlzdC5yZW1vdmUoJ2FuaW0nKSwgMzUwKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZVxyXG59XHJcblxyXG4vLyBJbiBvcmRlciB0byBkaXNwbGF5IGFuIGFzc2lnbm1lbnQgaW4gdGhlIGNvcnJlY3QgWCBwb3NpdGlvbiwgY2xhc3NlcyB3aXRoIG5hbWVzIGVYIGFuZCBlWCBhcmVcclxuLy8gdXNlZCwgd2hlcmUgWCBpcyB0aGUgbnVtYmVyIG9mIHNxdWFyZXMgdG8gZnJvbSB0aGUgYXNzaWdubWVudCB0byB0aGUgbGVmdC9yaWdodCBzaWRlIG9mIHRoZVxyXG4vLyBzY3JlZW4uIFRoZSBmdW5jdGlvbiBiZWxvdyBkZXRlcm1pbmVzIHdoaWNoIGVYIGFuZCBzWCBjbGFzcyB0aGUgZ2l2ZW4gZWxlbWVudCBoYXMuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRFUyhlbDogSFRNTEVsZW1lbnQpOiBbc3RyaW5nLCBzdHJpbmddIHtcclxuICAgIGxldCBlID0gMFxyXG4gICAgbGV0IHMgPSAwXHJcblxyXG4gICAgQXJyYXkuZnJvbShuZXcgQXJyYXkoNyksIChfLCB4KSA9PiB4KS5mb3JFYWNoKCh4KSA9PiB7XHJcbiAgICAgICAgaWYgKGVsLmNsYXNzTGlzdC5jb250YWlucyhgZSR7eH1gKSkge1xyXG4gICAgICAgICAgICBlID0geFxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZWwuY2xhc3NMaXN0LmNvbnRhaW5zKGBzJHt4fWApKSB7XHJcbiAgICAgICAgICAgIHMgPSB4XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICAgIHJldHVybiBbYGUke2V9YCwgYHMke3N9YF1cclxufVxyXG5cclxuLy8gQmVsb3cgaXMgYSBmdW5jdGlvbiB0byBjbG9zZSB0aGUgY3VycmVudCBhc3NpZ25tZW50IHRoYXQgaXMgb3BlbmVkLlxyXG5leHBvcnQgZnVuY3Rpb24gY2xvc2VPcGVuZWQoZXZ0OiBFdmVudCk6IHZvaWQge1xyXG4gICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICBjb25zdCBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mdWxsJykgYXMgSFRNTEVsZW1lbnR8bnVsbFxyXG4gICAgaWYgKGVsID09IG51bGwpIHJldHVyblxyXG5cclxuICAgIGVsLnN0eWxlLnRvcCA9IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS10b3AnKVxyXG4gICAgZWwuY2xhc3NMaXN0LmFkZCgnYW5pbScpXHJcbiAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKCdmdWxsJylcclxuICAgIGVsLnNjcm9sbFRvcCA9IDBcclxuICAgIGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnYXV0bydcclxuICAgIGNvbnN0IGJhY2sgPSBlbGVtQnlJZCgnYmFja2dyb3VuZCcpXHJcbiAgICBiYWNrLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBiYWNrLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcclxuICAgICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKCdhbmltJylcclxuICAgICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKCdtb2RpZnknKVxyXG4gICAgICAgIGVsLnN0eWxlLnRvcCA9ICdhdXRvJ1xyXG4gICAgICAgIGZvcmNlTGF5b3V0KGVsKVxyXG4gICAgICAgIGVsLmNsYXNzTGlzdC5hZGQoJ2FuaW0nKVxyXG4gICAgfSwgMTAwMClcclxufVxyXG4iLCJpbXBvcnQgeyBlbGVtQnlJZCwgbG9jYWxTdG9yYWdlUmVhZCB9IGZyb20gJy4uL3V0aWwnXHJcblxyXG4vLyBUaGVuLCB0aGUgdXNlcm5hbWUgaW4gdGhlIHNpZGViYXIgbmVlZHMgdG8gYmUgc2V0IGFuZCB3ZSBuZWVkIHRvIGdlbmVyYXRlIGFuIFwiYXZhdGFyXCIgYmFzZWQgb25cclxuLy8gaW5pdGlhbHMuIFRvIGRvIHRoYXQsIHNvbWUgY29kZSB0byBjb252ZXJ0IGZyb20gTEFCIHRvIFJHQiBjb2xvcnMgaXMgYm9ycm93ZWQgZnJvbVxyXG4vLyBodHRwczovL2dpdGh1Yi5jb20vYm9yb25pbmUvY29sb3JzcGFjZXMuanNcclxuLy9cclxuLy8gTEFCIGlzIGEgY29sb3IgbmFtaW5nIHNjaGVtZSB0aGF0IHVzZXMgdHdvIHZhbHVlcyAoQSBhbmQgQikgYWxvbmcgd2l0aCBhIGxpZ2h0bmVzcyB2YWx1ZSBpbiBvcmRlclxyXG4vLyB0byBwcm9kdWNlIGNvbG9ycyB0aGF0IGFyZSBlcXVhbGx5IHNwYWNlZCBiZXR3ZWVuIGFsbCBvZiB0aGUgY29sb3JzIHRoYXQgY2FuIGJlIHNlZW4gYnkgdGhlIGh1bWFuXHJcbi8vIGV5ZS4gVGhpcyB3b3JrcyBncmVhdCBiZWNhdXNlIGV2ZXJ5b25lIGhhcyBsZXR0ZXJzIGluIGhpcy9oZXIgaW5pdGlhbHMuXHJcblxyXG4vLyBUaGUgRDY1IHN0YW5kYXJkIGlsbHVtaW5hbnRcclxuY29uc3QgUkVGX1ggPSAwLjk1MDQ3XHJcbmNvbnN0IFJFRl9ZID0gMS4wMDAwMFxyXG5jb25zdCBSRUZfWiA9IDEuMDg4ODNcclxuXHJcbi8vIENJRSBMKmEqYiogY29uc3RhbnRzXHJcbmNvbnN0IExBQl9FID0gMC4wMDg4NTZcclxuY29uc3QgTEFCX0sgPSA5MDMuM1xyXG5cclxuY29uc3QgTSA9IFtcclxuICAgIFszLjI0MDYsIC0xLjUzNzIsIC0wLjQ5ODZdLFxyXG4gICAgWy0wLjk2ODksIDEuODc1OCwgIDAuMDQxNV0sXHJcbiAgICBbMC4wNTU3LCAtMC4yMDQwLCAgMS4wNTcwXVxyXG5dXHJcblxyXG5jb25zdCBmSW52ID0gKHQ6IG51bWJlcikgPT4ge1xyXG4gICAgaWYgKE1hdGgucG93KHQsIDMpID4gTEFCX0UpIHtcclxuICAgIHJldHVybiBNYXRoLnBvdyh0LCAzKVxyXG4gICAgfSBlbHNlIHtcclxuICAgIHJldHVybiAoKDExNiAqIHQpIC0gMTYpIC8gTEFCX0tcclxuICAgIH1cclxufVxyXG5jb25zdCBkb3RQcm9kdWN0ID0gKGE6IG51bWJlcltdLCBiOiBudW1iZXJbXSkgPT4ge1xyXG4gICAgbGV0IHJldCA9IDBcclxuICAgIGEuZm9yRWFjaCgoXywgaSkgPT4ge1xyXG4gICAgICAgIHJldCArPSBhW2ldICogYltpXVxyXG4gICAgfSlcclxuICAgIHJldHVybiByZXRcclxufVxyXG5jb25zdCBmcm9tTGluZWFyID0gKGM6IG51bWJlcikgPT4ge1xyXG4gICAgY29uc3QgYSA9IDAuMDU1XHJcbiAgICBpZiAoYyA8PSAwLjAwMzEzMDgpIHtcclxuICAgICAgICByZXR1cm4gMTIuOTIgKiBjXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiAoMS4wNTUgKiBNYXRoLnBvdyhjLCAxIC8gMi40KSkgLSAwLjA1NVxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBsYWJyZ2IobDogbnVtYmVyLCBhOiBudW1iZXIsIGI6IG51bWJlcik6IHN0cmluZyB7XHJcbiAgICBjb25zdCB2YXJZID0gKGwgKyAxNikgLyAxMTZcclxuICAgIGNvbnN0IHZhclogPSB2YXJZIC0gKGIgLyAyMDApXHJcbiAgICBjb25zdCB2YXJYID0gKGEgLyA1MDApICsgdmFyWVxyXG4gICAgY29uc3QgX1ggPSBSRUZfWCAqIGZJbnYodmFyWClcclxuICAgIGNvbnN0IF9ZID0gUkVGX1kgKiBmSW52KHZhclkpXHJcbiAgICBjb25zdCBfWiA9IFJFRl9aICogZkludih2YXJaKVxyXG5cclxuICAgIGNvbnN0IHR1cGxlID0gW19YLCBfWSwgX1pdXHJcblxyXG4gICAgY29uc3QgX1IgPSBmcm9tTGluZWFyKGRvdFByb2R1Y3QoTVswXSwgdHVwbGUpKVxyXG4gICAgY29uc3QgX0cgPSBmcm9tTGluZWFyKGRvdFByb2R1Y3QoTVsxXSwgdHVwbGUpKVxyXG4gICAgY29uc3QgX0IgPSBmcm9tTGluZWFyKGRvdFByb2R1Y3QoTVsyXSwgdHVwbGUpKVxyXG5cclxuICAgIC8vIE9yaWdpbmFsIGZyb20gaGVyZVxyXG4gICAgY29uc3QgbiA9ICh2OiBudW1iZXIpID0+IE1hdGgucm91bmQoTWF0aC5tYXgoTWF0aC5taW4odiAqIDI1NiwgMjU1KSwgMCkpXHJcbiAgICByZXR1cm4gYHJnYigke24oX1IpfSwgJHtuKF9HKX0sICR7bihfQil9KWBcclxufVxyXG5cclxuLyoqXHJcbiAqIENvbnZlcnQgYSBsZXR0ZXIgdG8gYSBmbG9hdCB2YWx1ZWQgZnJvbSAwIHRvIDI1NVxyXG4gKi9cclxuZnVuY3Rpb24gbGV0dGVyVG9Db2xvclZhbChsZXR0ZXI6IHN0cmluZyk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gKCgobGV0dGVyLmNoYXJDb2RlQXQoMCkgLSA2NSkgLyAyNikgKiAyNTYpIC0gMTI4XHJcbn1cclxuXHJcbi8vIFRoZSBmdW5jdGlvbiBiZWxvdyB1c2VzIHRoaXMgYWxnb3JpdGhtIHRvIGdlbmVyYXRlIGEgYmFja2dyb3VuZCBjb2xvciBmb3IgdGhlIGluaXRpYWxzIGRpc3BsYXllZCBpbiB0aGUgc2lkZWJhci5cclxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZUF2YXRhcigpOiB2b2lkIHtcclxuICAgIGlmICghbG9jYWxTdG9yYWdlUmVhZCgndXNlcm5hbWUnKSkgcmV0dXJuXHJcbiAgICBjb25zdCB1c2VyRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndXNlcicpXHJcbiAgICBjb25zdCBpbml0aWFsc0VsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2luaXRpYWxzJylcclxuICAgIGlmICghdXNlckVsIHx8ICFpbml0aWFsc0VsKSByZXR1cm5cclxuXHJcbiAgICB1c2VyRWwuaW5uZXJIVE1MID0gbG9jYWxTdG9yYWdlUmVhZCgndXNlcm5hbWUnKVxyXG4gICAgY29uc3QgaW5pdGlhbHMgPSBsb2NhbFN0b3JhZ2VSZWFkKCd1c2VybmFtZScpLm1hdGNoKC9cXGQqKC4pLio/KC4kKS8pIC8vIFNlcGFyYXRlIHllYXIgZnJvbSBmaXJzdCBuYW1lIGFuZCBpbml0aWFsXHJcbiAgICBpZiAoaW5pdGlhbHMgIT0gbnVsbCkge1xyXG4gICAgICAgIGNvbnN0IGJnID0gbGFicmdiKDUwLCBsZXR0ZXJUb0NvbG9yVmFsKGluaXRpYWxzWzFdKSwgbGV0dGVyVG9Db2xvclZhbChpbml0aWFsc1syXSkpIC8vIENvbXB1dGUgdGhlIGNvbG9yXHJcbiAgICAgICAgaW5pdGlhbHNFbC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBiZ1xyXG4gICAgICAgIGluaXRpYWxzRWwuaW5uZXJIVE1MID0gaW5pdGlhbHNbMV0gKyBpbml0aWFsc1syXVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IHRvZGF5IH0gZnJvbSAnLi4vZGF0ZXMnXHJcbmltcG9ydCB7IGVsZW1lbnQgfSBmcm9tICcuLi91dGlsJ1xyXG5cclxuY29uc3QgTU9OVEhTID0gWydKYW4nLCAnRmViJywgJ01hcicsICdBcHInLCAnTWF5JywgJ0p1bicsICdKdWwnLCAnQXVnJywgJ1NlcCcsICdPY3QnLCAnTm92JywgJ0RlYyddXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlV2VlayhpZDogc3RyaW5nKTogSFRNTEVsZW1lbnQge1xyXG4gICAgY29uc3Qgd2sgPSBlbGVtZW50KCdzZWN0aW9uJywgJ3dlZWsnLCBudWxsLCBpZClcclxuICAgIGNvbnN0IGRheVRhYmxlID0gZWxlbWVudCgndGFibGUnLCAnZGF5VGFibGUnKSBhcyBIVE1MVGFibGVFbGVtZW50XHJcbiAgICBjb25zdCB0ciA9IGRheVRhYmxlLmluc2VydFJvdygpXHJcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmUgbm8tbG9vcHNcclxuICAgIGZvciAobGV0IGRheSA9IDA7IGRheSA8IDc7IGRheSsrKSB0ci5pbnNlcnRDZWxsKClcclxuICAgIHdrLmFwcGVuZENoaWxkKGRheVRhYmxlKVxyXG5cclxuICAgIHJldHVybiB3a1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRGF5KGQ6IERhdGUpOiBIVE1MRWxlbWVudCB7XHJcbiAgICBjb25zdCBkYXkgPSBlbGVtZW50KCdkaXYnLCAnZGF5JywgbnVsbCwgJ2RheScpXHJcbiAgICBkYXkuc2V0QXR0cmlidXRlKCdkYXRhLWRhdGUnLCBTdHJpbmcoZC5nZXRUaW1lKCkpKVxyXG4gICAgaWYgKE1hdGguZmxvb3IoKGQuZ2V0VGltZSgpIC0gZC5nZXRUaW1lem9uZU9mZnNldCgpKSAvIDEwMDAgLyAzNjAwIC8gMjQpID09PSB0b2RheSgpKSB7XHJcbiAgICAgIGRheS5jbGFzc0xpc3QuYWRkKCd0b2RheScpXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbW9udGggPSBlbGVtZW50KCdzcGFuJywgJ21vbnRoJywgTU9OVEhTW2QuZ2V0TW9udGgoKV0pXHJcbiAgICBkYXkuYXBwZW5kQ2hpbGQobW9udGgpXHJcblxyXG4gICAgY29uc3QgZGF0ZSA9IGVsZW1lbnQoJ3NwYW4nLCAnZGF0ZScsIFN0cmluZyhkLmdldERhdGUoKSkpXHJcbiAgICBkYXkuYXBwZW5kQ2hpbGQoZGF0ZSlcclxuXHJcbiAgICByZXR1cm4gZGF5XHJcbn1cclxuIiwiaW1wb3J0IHsgVkVSU0lPTiB9IGZyb20gJy4uL2FwcCdcclxuaW1wb3J0IHsgZWxlbUJ5SWQgfSBmcm9tICcuLi91dGlsJ1xyXG5cclxuY29uc3QgRVJST1JfRk9STV9VUkwgPSAnaHR0cHM6Ly9kb2NzLmdvb2dsZS5jb20vYS9zdHVkZW50cy5oYXJrZXIub3JnL2Zvcm1zL2QvJ1xyXG4gICAgICAgICAgICAgICAgICAgICArICcxc2EyZ1V0WUZQZEtUNVlFTlhJRVlhdXlSUHVjcXNRQ1ZhUUFQZUYzYlo0US92aWV3Zm9ybSdcclxuY29uc3QgRVJST1JfRk9STV9FTlRSWSA9ICc/ZW50cnkuMTIwMDM2MjIzPSdcclxuY29uc3QgRVJST1JfR0lUSFVCX1VSTCA9ICdodHRwczovL2dpdGh1Yi5jb20vMTlSeWFuQS9DaGVja1BDUi9pc3N1ZXMvbmV3J1xyXG5cclxuY29uc3QgbGlua0J5SWQgPSAoaWQ6IHN0cmluZykgPT4gZWxlbUJ5SWQoaWQpIGFzIEhUTUxMaW5rRWxlbWVudFxyXG5cclxuLy8gKmRpc3BsYXlFcnJvciogZGlzcGxheXMgYSBkaWFsb2cgY29udGFpbmluZyBpbmZvcm1hdGlvbiBhYm91dCBhbiBlcnJvci5cclxuZXhwb3J0IGZ1bmN0aW9uIGRpc3BsYXlFcnJvcihlOiBFcnJvcik6IHZvaWQge1xyXG4gICAgY29uc29sZS5sb2coJ0Rpc3BsYXlpbmcgZXJyb3InLCBlKVxyXG4gICAgY29uc3QgZXJyb3JIVE1MID0gYE1lc3NhZ2U6ICR7ZS5tZXNzYWdlfVxcblN0YWNrOiAke2Uuc3RhY2sgfHwgKGUgYXMgYW55KS5saW5lTnVtYmVyfVxcbmBcclxuICAgICAgICAgICAgICAgICAgICArIGBCcm93c2VyOiAke25hdmlnYXRvci51c2VyQWdlbnR9XFxuVmVyc2lvbjogJHtWRVJTSU9OfWBcclxuICAgIGVsZW1CeUlkKCdlcnJvckNvbnRlbnQnKS5pbm5lckhUTUwgPSBlcnJvckhUTUwucmVwbGFjZSgnXFxuJywgJzxicj4nKVxyXG4gICAgbGlua0J5SWQoJ2Vycm9yR29vZ2xlJykuaHJlZiA9IEVSUk9SX0ZPUk1fVVJMICsgRVJST1JfRk9STV9FTlRSWSArIGVuY29kZVVSSUNvbXBvbmVudChlcnJvckhUTUwpXHJcbiAgICBsaW5rQnlJZCgnZXJyb3JHaXRIdWInKS5ocmVmID1cclxuICAgICAgICBFUlJPUl9HSVRIVUJfVVJMICsgJz9ib2R5PScgKyBlbmNvZGVVUklDb21wb25lbnQoYEkndmUgZW5jb3VudGVyZWQgYW4gYnVnLlxcblxcblxcYFxcYFxcYFxcbiR7ZXJyb3JIVE1MfVxcblxcYFxcYFxcYGApXHJcbiAgICBlbGVtQnlJZCgnZXJyb3JCYWNrZ3JvdW5kJykuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcclxuICAgIHJldHVybiBlbGVtQnlJZCgnZXJyb3InKS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG59XHJcbiIsImltcG9ydCB7IF8kIH0gZnJvbSAnLi4vdXRpbCdcclxuXHJcbi8vIEZvciBsaXN0IHZpZXcsIHRoZSBhc3NpZ25tZW50cyBjYW4ndCBiZSBvbiB0b3Agb2YgZWFjaCBvdGhlci5cclxuLy8gVGhlcmVmb3JlLCBhIGxpc3RlbmVyIGlzIGF0dGFjaGVkIHRvIHRoZSByZXNpemluZyBvZiB0aGUgYnJvd3NlciB3aW5kb3cuXHJcbmxldCB0aWNraW5nID0gZmFsc2VcclxubGV0IHRpbWVvdXRJZDogbnVtYmVyfG51bGwgPSBudWxsXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRSZXNpemVBc3NpZ25tZW50cygpOiBIVE1MRWxlbWVudFtdIHtcclxuICAgIGNvbnN0IGFzc2lnbm1lbnRzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKCdzaG93RG9uZScpID9cclxuICAgICAgICAnLmFzc2lnbm1lbnQubGlzdERpc3AnIDogJy5hc3NpZ25tZW50Lmxpc3REaXNwOm5vdCguZG9uZSknKSlcclxuICAgIGFzc2lnbm1lbnRzLnNvcnQoKGEsIGIpID0+IHtcclxuICAgICAgICBjb25zdCBhZCA9IGEuY2xhc3NMaXN0LmNvbnRhaW5zKCdkb25lJylcclxuICAgICAgICBjb25zdCBiZCA9IGIuY2xhc3NMaXN0LmNvbnRhaW5zKCdkb25lJylcclxuICAgICAgICBpZiAoYWQgJiYgIWJkKSB7IHJldHVybiAxIH1cclxuICAgICAgICBpZiAoYmQgJiYgIWFkKSB7IHJldHVybiAtMSB9XHJcbiAgICAgICAgcmV0dXJuIE51bWJlcigoYS5xdWVyeVNlbGVjdG9yKCcuZHVlJykgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWUpXHJcbiAgICAgICAgICAgICAtIE51bWJlcigoYi5xdWVyeVNlbGVjdG9yKCcuZHVlJykgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWUpXHJcbiAgICB9KVxyXG4gICAgcmV0dXJuIGFzc2lnbm1lbnRzIGFzIEhUTUxFbGVtZW50W11cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlc2l6ZUNhbGxlcigpOiB2b2lkIHtcclxuICAgIGlmICghdGlja2luZykge1xyXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShyZXNpemUpXHJcbiAgICAgICAgdGlja2luZyA9IHRydWVcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlc2l6ZSgpOiB2b2lkIHtcclxuICAgIHRpY2tpbmcgPSB0cnVlXHJcbiAgICAvLyBUbyBjYWxjdWxhdGUgdGhlIG51bWJlciBvZiBjb2x1bW5zLCB0aGUgYmVsb3cgYWxnb3JpdGhtIGlzIHVzZWQgYmVjYXNlIGFzIHRoZSBzY3JlZW4gc2l6ZVxyXG4gICAgLy8gaW5jcmVhc2VzLCB0aGUgY29sdW1uIHdpZHRoIGluY3JlYXNlc1xyXG4gICAgY29uc3Qgd2lkdGhzID0gZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuY29udGFpbnMoJ3Nob3dJbmZvJykgP1xyXG4gICAgICAgIFs2NTAsIDExMDAsIDE4MDAsIDI3MDAsIDM4MDAsIDUxMDBdIDogWzM1MCwgODAwLCAxNTAwLCAyNDAwLCAzNTAwLCA0ODAwXVxyXG4gICAgbGV0IGNvbHVtbnMgPSAxXHJcbiAgICB3aWR0aHMuZm9yRWFjaCgodywgaW5kZXgpID0+IHtcclxuICAgICAgICBpZiAod2luZG93LmlubmVyV2lkdGggPiB3KSB7IGNvbHVtbnMgPSBpbmRleCArIDEgfVxyXG4gICAgfSlcclxuICAgIGNvbnN0IGNvbHVtbkhlaWdodHMgPSBBcnJheS5mcm9tKG5ldyBBcnJheShjb2x1bW5zKSwgKCkgPT4gMClcclxuICAgIGNvbnN0IGNjaDogbnVtYmVyW10gPSBbXVxyXG4gICAgY29uc3QgYXNzaWdubWVudHMgPSBnZXRSZXNpemVBc3NpZ25tZW50cygpXHJcbiAgICBhc3NpZ25tZW50cy5mb3JFYWNoKChhc3NpZ25tZW50LCBuKSA9PiB7XHJcbiAgICAgICAgY29uc3QgY29sID0gbiAlIGNvbHVtbnNcclxuICAgICAgICBjY2gucHVzaChjb2x1bW5IZWlnaHRzW2NvbF0pXHJcbiAgICAgICAgY29sdW1uSGVpZ2h0c1tjb2xdICs9IGFzc2lnbm1lbnQub2Zmc2V0SGVpZ2h0ICsgMjRcclxuICAgIH0pXHJcbiAgICBhc3NpZ25tZW50cy5mb3JFYWNoKChhc3NpZ25tZW50LCBuKSA9PiB7XHJcbiAgICAgICAgY29uc3QgY29sID0gbiAlIGNvbHVtbnNcclxuICAgICAgICBhc3NpZ25tZW50LnN0eWxlLnRvcCA9IGNjaFtuXSArICdweCdcclxuICAgICAgICBhc3NpZ25tZW50LnN0eWxlLmxlZnQgPSAoKDEwMCAvIGNvbHVtbnMpICogY29sKSArICclJ1xyXG4gICAgICAgIGFzc2lnbm1lbnQuc3R5bGUucmlnaHQgPSAoKDEwMCAvIGNvbHVtbnMpICogKGNvbHVtbnMgLSBjb2wgLSAxKSkgKyAnJSdcclxuICAgIH0pXHJcbiAgICBpZiAodGltZW91dElkKSBjbGVhclRpbWVvdXQodGltZW91dElkKVxyXG4gICAgdGltZW91dElkID0gc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgY2NoLmxlbmd0aCA9IDBcclxuICAgICAgICBhc3NpZ25tZW50cy5mb3JFYWNoKChhc3NpZ25tZW50LCBuKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbCA9IG4gJSBjb2x1bW5zXHJcbiAgICAgICAgICAgIGlmIChuIDwgY29sdW1ucykge1xyXG4gICAgICAgICAgICAgICAgY29sdW1uSGVpZ2h0c1tjb2xdID0gMFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNjaC5wdXNoKGNvbHVtbkhlaWdodHNbY29sXSlcclxuICAgICAgICAgICAgY29sdW1uSGVpZ2h0c1tjb2xdICs9IGFzc2lnbm1lbnQub2Zmc2V0SGVpZ2h0ICsgMjRcclxuICAgICAgICB9KVxyXG4gICAgICAgIGFzc2lnbm1lbnRzLmZvckVhY2goKGFzc2lnbm1lbnQsIG4pID0+IHtcclxuICAgICAgICAgICAgYXNzaWdubWVudC5zdHlsZS50b3AgPSBjY2hbbl0gKyAncHgnXHJcbiAgICAgICAgfSlcclxuICAgIH0sIDUwMClcclxuICAgIHRpY2tpbmcgPSBmYWxzZVxyXG59XHJcbiIsIi8qKlxyXG4gKiBBbGwgdGhpcyBpcyByZXNwb25zaWJsZSBmb3IgaXMgY3JlYXRpbmcgc25hY2tiYXJzLlxyXG4gKi9cclxuXHJcbmltcG9ydCB7IGVsZW1lbnQsIGZvcmNlTGF5b3V0IH0gZnJvbSAnLi4vdXRpbCdcclxuXHJcbi8qKlxyXG4gKiBDcmVhdGVzIGEgc25hY2tiYXIgd2l0aG91dCBhbiBhY3Rpb25cclxuICogQHBhcmFtIG1lc3NhZ2UgVGhlIHNuYWNrYmFyJ3MgbWVzc2FnZVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHNuYWNrYmFyKG1lc3NhZ2U6IHN0cmluZyk6IHZvaWRcclxuLyoqXHJcbiAqIENyZWF0ZXMgYSBzbmFja2JhciB3aXRoIGFuIGFjdGlvblxyXG4gKiBAcGFyYW0gbWVzc2FnZSBUaGUgc25hY2tiYXIncyBtZXNzYWdlXHJcbiAqIEBwYXJhbSBhY3Rpb24gT3B0aW9uYWwgdGV4dCB0byBzaG93IGFzIGEgbWVzc2FnZSBhY3Rpb25cclxuICogQHBhcmFtIGYgICAgICBBIGZ1bmN0aW9uIHRvIGV4ZWN1dGUgd2hlbiB0aGUgYWN0aW9uIGlzIGNsaWNrZWRcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBzbmFja2JhcihtZXNzYWdlOiBzdHJpbmcsIGFjdGlvbjogc3RyaW5nLCBmOiAoKSA9PiB2b2lkKTogdm9pZFxyXG5leHBvcnQgZnVuY3Rpb24gc25hY2tiYXIobWVzc2FnZTogc3RyaW5nLCBhY3Rpb24/OiBzdHJpbmcsIGY/OiAoKSA9PiB2b2lkKTogdm9pZCB7XHJcbiAgICBjb25zdCBzbmFjayA9IGVsZW1lbnQoJ2RpdicsICdzbmFja2JhcicpXHJcbiAgICBjb25zdCBzbmFja0lubmVyID0gZWxlbWVudCgnZGl2JywgJ3NuYWNrSW5uZXInLCBtZXNzYWdlKVxyXG4gICAgc25hY2suYXBwZW5kQ2hpbGQoc25hY2tJbm5lcilcclxuXHJcbiAgICBpZiAoKGFjdGlvbiAhPSBudWxsKSAmJiAoZiAhPSBudWxsKSkge1xyXG4gICAgICAgIGNvbnN0IGFjdGlvbkUgPSBlbGVtZW50KCdhJywgW10sIGFjdGlvbilcclxuICAgICAgICBhY3Rpb25FLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBzbmFjay5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gICAgICAgICAgICBmKClcclxuICAgICAgICB9KVxyXG4gICAgICAgIHNuYWNrSW5uZXIuYXBwZW5kQ2hpbGQoYWN0aW9uRSlcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBhZGQgPSAoKSA9PiB7XHJcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc25hY2spXHJcbiAgICAgIGZvcmNlTGF5b3V0KHNuYWNrKVxyXG4gICAgICBzbmFjay5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgIHNuYWNrLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHNuYWNrLnJlbW92ZSgpLCA5MDApXHJcbiAgICAgIH0sIDUwMDApXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZXhpc3RpbmcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc25hY2tiYXInKVxyXG4gICAgaWYgKGV4aXN0aW5nICE9IG51bGwpIHtcclxuICAgICAgICBleGlzdGluZy5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gICAgICAgIHNldFRpbWVvdXQoYWRkLCAzMDApXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGFkZCgpXHJcbiAgICB9XHJcbn1cclxuIiwiXHJcbi8qKlxyXG4gKiBDb29raWUgZnVuY3Rpb25zIChhIGNvb2tpZSBpcyBhIHNtYWxsIHRleHQgZG9jdW1lbnQgdGhhdCB0aGUgYnJvd3NlciBjYW4gcmVtZW1iZXIpXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIFJldHJpZXZlcyBhIGNvb2tpZVxyXG4gKiBAcGFyYW0gY25hbWUgdGhlIG5hbWUgb2YgdGhlIGNvb2tpZSB0byByZXRyaWV2ZVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGdldENvb2tpZShjbmFtZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIGNvbnN0IG5hbWUgPSBjbmFtZSArICc9J1xyXG4gICAgY29uc3QgY29va2llUGFydCA9IGRvY3VtZW50LmNvb2tpZS5zcGxpdCgnOycpLmZpbmQoKGMpID0+IGMuaW5jbHVkZXMobmFtZSkpXHJcbiAgICBpZiAoY29va2llUGFydCkgcmV0dXJuIGNvb2tpZVBhcnQuc3Vic3RyaW5nKG5hbWUubGVuZ3RoKVxyXG4gICAgcmV0dXJuICcnIC8vIEJsYW5rIGlmIGNvb2tpZSBub3QgZm91bmRcclxuICB9XHJcblxyXG4vKiogU2V0cyB0aGUgdmFsdWUgb2YgYSBjb29raWVcclxuICogQHBhcmFtIGNuYW1lIHRoZSBuYW1lIG9mIHRoZSBjb29raWUgdG8gc2V0XHJcbiAqIEBwYXJhbSBjdmFsdWUgdGhlIHZhbHVlIHRvIHNldCB0aGUgY29va2llIHRvXHJcbiAqIEBwYXJhbSBleGRheXMgdGhlIG51bWJlciBvZiBkYXlzIHRoYXQgdGhlIGNvb2tpZSB3aWxsIGV4cGlyZSBpbiAoYW5kIG5vdCBiZSBleGlzdGVudCBhbnltb3JlKVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHNldENvb2tpZShjbmFtZTogc3RyaW5nLCBjdmFsdWU6IHN0cmluZywgZXhkYXlzOiBudW1iZXIpOiB2b2lkIHtcclxuICAgIGNvbnN0IGQgPSBuZXcgRGF0ZSgpXHJcbiAgICBkLnNldFRpbWUoZC5nZXRUaW1lKCkgKyAoZXhkYXlzICogMjQgKiA2MCAqIDYwICogMTAwMCkpXHJcbiAgICBjb25zdCBleHBpcmVzID0gYGV4cGlyZXM9JHtkLnRvVVRDU3RyaW5nKCl9YFxyXG4gICAgZG9jdW1lbnQuY29va2llID0gY25hbWUgKyAnPScgKyBjdmFsdWUgKyAnOyAnICsgZXhwaXJlc1xyXG4gIH1cclxuXHJcbi8qKlxyXG4gKiBEZWxldHMgYSBjb29raWVcclxuICogQHBhcmFtIGNuYW1lIHRoZSBuYW1lIG9mIHRoZSBjb29raWUgdG8gZGVsZXRlXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZGVsZXRlQ29va2llKGNuYW1lOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgIC8vIFRoaXMgaXMgbGlrZSAqc2V0Q29va2llKiwgYnV0IHNldHMgdGhlIGV4cGlyeSBkYXRlIHRvIHNvbWV0aGluZyBpbiB0aGUgcGFzdCBzbyB0aGUgY29va2llIGlzIGRlbGV0ZWQuXHJcbiAgICBkb2N1bWVudC5jb29raWUgPSBjbmFtZSArICc9OyBleHBpcmVzPVRodSwgMDEgSmFuIDE5NzAgMDA6MDA6MDEgR01UOydcclxufVxyXG4iLCJleHBvcnQgZnVuY3Rpb24gdHpvZmYoKTogbnVtYmVyIHtcclxuICAgIHJldHVybiAobmV3IERhdGUoKSkuZ2V0VGltZXpvbmVPZmZzZXQoKSAqIDEwMDAgKiA2MCAvLyBGb3IgZnV0dXJlIGNhbGN1bGF0aW9uc1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdG9EYXRlTnVtKGRhdGU6IERhdGV8bnVtYmVyKTogbnVtYmVyIHtcclxuICAgIGNvbnN0IG51bSA9IGRhdGUgaW5zdGFuY2VvZiBEYXRlID8gZGF0ZS5nZXRUaW1lKCkgOiBkYXRlXHJcbiAgICByZXR1cm4gTWF0aC5mbG9vcigobnVtIC0gdHpvZmYoKSkgLyAxMDAwIC8gMzYwMCAvIDI0KVxyXG59XHJcblxyXG4vLyAqRnJvbURhdGVOdW0qIGNvbnZlcnRzIGEgbnVtYmVyIG9mIGRheXMgdG8gYSBudW1iZXIgb2Ygc2Vjb25kc1xyXG5leHBvcnQgZnVuY3Rpb24gZnJvbURhdGVOdW0oZGF5czogbnVtYmVyKTogRGF0ZSB7XHJcbiAgICBjb25zdCBkID0gbmV3IERhdGUoKGRheXMgKiAxMDAwICogMzYwMCAqIDI0KSArIHR6b2ZmKCkpXHJcbiAgICAvLyBUaGUgY2hlY2tzIGJlbG93IGFyZSB0byBoYW5kbGUgZGF5bGlnaHQgc2F2aW5ncyB0aW1lXHJcbiAgICBpZiAoZC5nZXRIb3VycygpID09PSAxKSB7IGQuc2V0SG91cnMoMCkgfVxyXG4gICAgaWYgKChkLmdldEhvdXJzKCkgPT09IDIyKSB8fCAoZC5nZXRIb3VycygpID09PSAyMykpIHtcclxuICAgICAgZC5zZXRIb3VycygyNClcclxuICAgICAgZC5zZXRNaW51dGVzKDApXHJcbiAgICAgIGQuc2V0U2Vjb25kcygwKVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGRcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHRvZGF5KCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gdG9EYXRlTnVtKG5ldyBEYXRlKCkpXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBJdGVyYXRlcyBmcm9tIHRoZSBzdGFydGluZyBkYXRlIHRvIGVuZGluZyBkYXRlIGluY2x1c2l2ZVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGl0ZXJEYXlzKHN0YXJ0OiBEYXRlLCBlbmQ6IERhdGUsIGNiOiAoZGF0ZTogRGF0ZSkgPT4gdm9pZCk6IHZvaWQge1xyXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lIG5vLWxvb3BzXHJcbiAgICBmb3IgKGNvbnN0IGQgPSBuZXcgRGF0ZShzdGFydCk7IGQgPD0gZW5kOyBkLnNldERhdGUoZC5nZXREYXRlKCkgKyAxKSkge1xyXG4gICAgICAgIGNiKGQpXHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgY29tcHV0ZVdlZWtJZCwgY3JlYXRlQXNzaWdubWVudCwgZ2V0RVMsIHNlcGFyYXRlZENsYXNzIH0gZnJvbSAnLi9jb21wb25lbnRzL2Fzc2lnbm1lbnQnXHJcbmltcG9ydCB7IGNyZWF0ZURheSwgY3JlYXRlV2VlayB9IGZyb20gJy4vY29tcG9uZW50cy9jYWxlbmRhcidcclxuaW1wb3J0IHsgZGlzcGxheUVycm9yIH0gZnJvbSAnLi9jb21wb25lbnRzL2Vycm9yRGlzcGxheSdcclxuaW1wb3J0IHsgcmVzaXplIH0gZnJvbSAnLi9jb21wb25lbnRzL3Jlc2l6ZXInXHJcbmltcG9ydCB7IGZyb21EYXRlTnVtLCBpdGVyRGF5cywgdG9kYXkgfSBmcm9tICcuL2RhdGVzJ1xyXG5pbXBvcnQgeyBjbGFzc0J5SWQsIGdldERhdGEsIElBcHBsaWNhdGlvbkRhdGEsIElBc3NpZ25tZW50IH0gZnJvbSAnLi9wY3InXHJcbmltcG9ydCB7IGFkZEFjdGl2aXR5LCBzYXZlQWN0aXZpdHkgfSBmcm9tICcuL3BsdWdpbnMvYWN0aXZpdHknXHJcbmltcG9ydCB7IGV4dHJhVG9UYXNrLCBnZXRFeHRyYSwgSUN1c3RvbUFzc2lnbm1lbnQgfSBmcm9tICcuL3BsdWdpbnMvY3VzdG9tQXNzaWdubWVudHMnXHJcbmltcG9ydCB7IGFzc2lnbm1lbnRJbkRvbmUsIHJlbW92ZUZyb21Eb25lLCBzYXZlRG9uZSB9IGZyb20gJy4vcGx1Z2lucy9kb25lJ1xyXG5pbXBvcnQgeyBhc3NpZ25tZW50SW5Nb2RpZmllZCwgcmVtb3ZlRnJvbU1vZGlmaWVkLCBzYXZlTW9kaWZpZWQgfSBmcm9tICcuL3BsdWdpbnMvbW9kaWZpZWRBc3NpZ25tZW50cydcclxuaW1wb3J0IHsgc2V0dGluZ3MgfSBmcm9tICcuL3NldHRpbmdzJ1xyXG5pbXBvcnQgeyBfJCwgZGF0ZVN0cmluZywgZWxlbUJ5SWQsIGVsZW1lbnQsIGxvY2FsU3RvcmFnZVJlYWQsIHNtb290aFNjcm9sbCB9IGZyb20gJy4vdXRpbCdcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVNwbGl0QXNzaWdubWVudCB7XHJcbiAgICBhc3NpZ25tZW50OiBJQXNzaWdubWVudFxyXG4gICAgc3RhcnQ6IERhdGVcclxuICAgIGVuZDogRGF0ZXwnRm9yZXZlcidcclxuICAgIGN1c3RvbTogYm9vbGVhblxyXG4gICAgcmVmZXJlbmNlPzogSUN1c3RvbUFzc2lnbm1lbnRcclxufVxyXG5cclxuY29uc3QgU0NIRURVTEVfRU5EUyA9IHtcclxuICAgIGRheTogKGRhdGU6IERhdGUpID0+IDI0ICogMzYwMCAqIDEwMDAsXHJcbiAgICBtczogKGRhdGU6IERhdGUpID0+IFsyNCwgICAgICAgICAgICAgIC8vIFN1bmRheVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgMTUgKyAoMzUgLyA2MCksICAvLyBNb25kYXlcclxuICAgICAgICAgICAgICAgICAgICAgICAgIDE1ICsgKDM1IC8gNjApLCAgLy8gVHVlc2RheVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgMTUgKyAoMTUgLyA2MCksICAvLyBXZWRuZXNkYXlcclxuICAgICAgICAgICAgICAgICAgICAgICAgIDE1ICsgKDE1IC8gNjApLCAgLy8gVGh1cnNkYXlcclxuICAgICAgICAgICAgICAgICAgICAgICAgIDE1ICsgKDE1IC8gNjApLCAgLy8gRnJpZGF5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAyNCAgICAgICAgICAgICAgIC8vIFNhdHVyZGF5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF1bZGF0ZS5nZXREYXkoKV0sXHJcbiAgICB1czogKGRhdGU6IERhdGUpID0+IDE1ICogMzYwMCAqIDEwMDBcclxufVxyXG5jb25zdCBXRUVLRU5EX0NMQVNTTkFNRVMgPSBbJ2Zyb21XZWVrZW5kJywgJ292ZXJXZWVrZW5kJ11cclxuXHJcbmxldCBzY3JvbGwgPSAwIC8vIFRoZSBsb2NhdGlvbiB0byBzY3JvbGwgdG8gaW4gb3JkZXIgdG8gcmVhY2ggdG9kYXkgaW4gY2FsZW5kYXIgdmlld1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFNjcm9sbCgpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIHNjcm9sbFxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0VGltZUFmdGVyKGRhdGU6IERhdGUpOiBudW1iZXIge1xyXG4gICAgY29uc3QgaGlkZUFzc2lnbm1lbnRzID0gc2V0dGluZ3MuaGlkZUFzc2lnbm1lbnRzXHJcbiAgICBpZiAoaGlkZUFzc2lnbm1lbnRzID09PSAnZGF5JyB8fCBoaWRlQXNzaWdubWVudHMgPT09ICdtcycgfHwgaGlkZUFzc2lnbm1lbnRzID09PSAndXMnKSB7XHJcbiAgICAgICAgcmV0dXJuIFNDSEVEVUxFX0VORFNbaGlkZUFzc2lnbm1lbnRzXShkYXRlKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gU0NIRURVTEVfRU5EUy5kYXkoZGF0ZSlcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0U3RhcnRFbmREYXRlcyhkYXRhOiBJQXBwbGljYXRpb25EYXRhKToge3N0YXJ0OiBEYXRlLCBlbmQ6IERhdGUgfSB7XHJcbiAgICBpZiAoZGF0YS5tb250aFZpZXcpIHtcclxuICAgICAgICBjb25zdCBzdGFydE4gPSBNYXRoLm1pbiguLi5kYXRhLmFzc2lnbm1lbnRzLm1hcCgoYSkgPT4gYS5zdGFydCkpIC8vIFNtYWxsZXN0IGRhdGVcclxuICAgICAgICBjb25zdCBlbmROID0gTWF0aC5tYXgoLi4uZGF0YS5hc3NpZ25tZW50cy5tYXAoKGEpID0+IGEuc3RhcnQpKSAvLyBMYXJnZXN0IGRhdGVcclxuXHJcbiAgICAgICAgY29uc3QgeWVhciA9IChuZXcgRGF0ZSgpKS5nZXRGdWxsWWVhcigpIC8vIEZvciBmdXR1cmUgY2FsY3VsYXRpb25zXHJcblxyXG4gICAgICAgIC8vIENhbGN1bGF0ZSB3aGF0IG1vbnRoIHdlIHdpbGwgYmUgZGlzcGxheWluZyBieSBmaW5kaW5nIHRoZSBtb250aCBvZiB0b2RheVxyXG4gICAgICAgIGNvbnN0IG1vbnRoID0gKG5ldyBEYXRlKCkpLmdldE1vbnRoKClcclxuXHJcbiAgICAgICAgLy8gTWFrZSBzdXJlIHRoZSBzdGFydCBhbmQgZW5kIGRhdGVzIGxpZSB3aXRoaW4gdGhlIG1vbnRoXHJcbiAgICAgICAgY29uc3Qgc3RhcnQgPSBuZXcgRGF0ZShNYXRoLm1heChmcm9tRGF0ZU51bShzdGFydE4pLmdldFRpbWUoKSwgKG5ldyBEYXRlKHllYXIsIG1vbnRoKSkuZ2V0VGltZSgpKSlcclxuICAgICAgICAvLyBJZiB0aGUgZGF5IGFyZ3VtZW50IGZvciBEYXRlIGlzIDAsIHRoZW4gdGhlIHJlc3VsdGluZyBkYXRlIHdpbGwgYmUgb2YgdGhlIHByZXZpb3VzIG1vbnRoXHJcbiAgICAgICAgY29uc3QgZW5kID0gbmV3IERhdGUoTWF0aC5taW4oZnJvbURhdGVOdW0oZW5kTikuZ2V0VGltZSgpLCAobmV3IERhdGUoeWVhciwgbW9udGggKyAxLCAwKSkuZ2V0VGltZSgpKSlcclxuICAgICAgICByZXR1cm4geyBzdGFydCwgZW5kIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zdCB0b2RheVNFID0gbmV3IERhdGUoKVxyXG4gICAgICAgIGNvbnN0IHN0YXJ0ID0gbmV3IERhdGUodG9kYXlTRS5nZXRGdWxsWWVhcigpLCB0b2RheVNFLmdldE1vbnRoKCksIHRvZGF5U0UuZ2V0RGF0ZSgpKVxyXG4gICAgICAgIGNvbnN0IGVuZCA9IG5ldyBEYXRlKHRvZGF5U0UuZ2V0RnVsbFllYXIoKSwgdG9kYXlTRS5nZXRNb250aCgpLCB0b2RheVNFLmdldERhdGUoKSlcclxuICAgICAgICByZXR1cm4geyBzdGFydCwgZW5kIH1cclxuICAgICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRBc3NpZ25tZW50U3BsaXRzKGFzc2lnbm1lbnQ6IElBc3NpZ25tZW50LCBzdGFydDogRGF0ZSwgZW5kOiBEYXRlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlZmVyZW5jZT86IElDdXN0b21Bc3NpZ25tZW50KTogSVNwbGl0QXNzaWdubWVudFtdIHtcclxuICAgIGNvbnN0IHNwbGl0OiBJU3BsaXRBc3NpZ25tZW50W10gPSBbXVxyXG4gICAgaWYgKHNldHRpbmdzLmFzc2lnbm1lbnRTcGFuID09PSAnbXVsdGlwbGUnKSB7XHJcbiAgICAgICAgY29uc3QgcyA9IE1hdGgubWF4KHN0YXJ0LmdldFRpbWUoKSwgZnJvbURhdGVOdW0oYXNzaWdubWVudC5zdGFydCkuZ2V0VGltZSgpKVxyXG4gICAgICAgIGNvbnN0IGUgPSBhc3NpZ25tZW50LmVuZCA9PT0gJ0ZvcmV2ZXInID8gcyA6IE1hdGgubWluKGVuZC5nZXRUaW1lKCksIGZyb21EYXRlTnVtKGFzc2lnbm1lbnQuZW5kKS5nZXRUaW1lKCkpXHJcbiAgICAgICAgY29uc3Qgc3BhbiA9ICgoZSAtIHMpIC8gMTAwMCAvIDM2MDAgLyAyNCkgKyAxIC8vIE51bWJlciBvZiBkYXlzIGFzc2lnbm1lbnQgdGFrZXMgdXBcclxuICAgICAgICBjb25zdCBzcGFuUmVsYXRpdmUgPSA2IC0gKG5ldyBEYXRlKHMpKS5nZXREYXkoKSAvLyBOdW1iZXIgb2YgZGF5cyB1bnRpbCB0aGUgbmV4dCBTYXR1cmRheVxyXG5cclxuICAgICAgICBjb25zdCBucyA9IG5ldyBEYXRlKHMpXHJcbiAgICAgICAgbnMuc2V0RGF0ZShucy5nZXREYXRlKCkgKyBzcGFuUmVsYXRpdmUpIC8vICBUaGUgZGF0ZSBvZiB0aGUgbmV4dCBTYXR1cmRheVxyXG5cclxuICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmUgbm8tbG9vcHNcclxuICAgICAgICBmb3IgKGxldCBuID0gLTY7IG4gPCBzcGFuIC0gc3BhblJlbGF0aXZlOyBuICs9IDcpIHtcclxuICAgICAgICAgICAgY29uc3QgbGFzdFN1biA9IG5ldyBEYXRlKG5zKVxyXG4gICAgICAgICAgICBsYXN0U3VuLnNldERhdGUobGFzdFN1bi5nZXREYXRlKCkgKyBuKVxyXG5cclxuICAgICAgICAgICAgY29uc3QgbmV4dFNhdCA9IG5ldyBEYXRlKGxhc3RTdW4pXHJcbiAgICAgICAgICAgIG5leHRTYXQuc2V0RGF0ZShuZXh0U2F0LmdldERhdGUoKSArIDYpXHJcbiAgICAgICAgICAgIHNwbGl0LnB1c2goe1xyXG4gICAgICAgICAgICAgICAgYXNzaWdubWVudCxcclxuICAgICAgICAgICAgICAgIHN0YXJ0OiBuZXcgRGF0ZShNYXRoLm1heChzLCBsYXN0U3VuLmdldFRpbWUoKSkpLFxyXG4gICAgICAgICAgICAgICAgZW5kOiBuZXcgRGF0ZShNYXRoLm1pbihlLCBuZXh0U2F0LmdldFRpbWUoKSkpLFxyXG4gICAgICAgICAgICAgICAgY3VzdG9tOiBCb29sZWFuKHJlZmVyZW5jZSksXHJcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKHNldHRpbmdzLmFzc2lnbm1lbnRTcGFuID09PSAnc3RhcnQnKSB7XHJcbiAgICAgICAgY29uc3QgcyA9IGZyb21EYXRlTnVtKGFzc2lnbm1lbnQuc3RhcnQpXHJcbiAgICAgICAgaWYgKHMuZ2V0VGltZSgpID49IHN0YXJ0LmdldFRpbWUoKSkge1xyXG4gICAgICAgICAgICBzcGxpdC5wdXNoKHtcclxuICAgICAgICAgICAgICAgIGFzc2lnbm1lbnQsXHJcbiAgICAgICAgICAgICAgICBzdGFydDogcyxcclxuICAgICAgICAgICAgICAgIGVuZDogcyxcclxuICAgICAgICAgICAgICAgIGN1c3RvbTogQm9vbGVhbihyZWZlcmVuY2UpLFxyXG4gICAgICAgICAgICAgICAgcmVmZXJlbmNlXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChzZXR0aW5ncy5hc3NpZ25tZW50U3BhbiA9PT0gJ2VuZCcpIHtcclxuICAgICAgICBjb25zdCBlID0gYXNzaWdubWVudC5lbmQgPT09ICdGb3JldmVyJyA/IGFzc2lnbm1lbnQuZW5kIDogZnJvbURhdGVOdW0oYXNzaWdubWVudC5lbmQpXHJcbiAgICAgICAgY29uc3QgZGUgPSBlID09PSAnRm9yZXZlcicgPyBmcm9tRGF0ZU51bShhc3NpZ25tZW50LnN0YXJ0KSA6IGVcclxuICAgICAgICBpZiAoZGUuZ2V0VGltZSgpIDw9IGVuZC5nZXRUaW1lKCkpIHtcclxuICAgICAgICAgICAgc3BsaXQucHVzaCh7XHJcbiAgICAgICAgICAgICAgICBhc3NpZ25tZW50LFxyXG4gICAgICAgICAgICAgICAgc3RhcnQ6IGRlLFxyXG4gICAgICAgICAgICAgICAgZW5kOiBlLFxyXG4gICAgICAgICAgICAgICAgY3VzdG9tOiBCb29sZWFuKHJlZmVyZW5jZSksXHJcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHNwbGl0XHJcbn1cclxuXHJcbi8vIFRoaXMgZnVuY3Rpb24gd2lsbCBjb252ZXJ0IHRoZSBhcnJheSBvZiBhc3NpZ25tZW50cyBnZW5lcmF0ZWQgYnkgKnBhcnNlKiBpbnRvIHJlYWRhYmxlIEhUTUwuXHJcbmV4cG9ydCBmdW5jdGlvbiBkaXNwbGF5KGRvU2Nyb2xsOiBib29sZWFuID0gdHJ1ZSk6IHZvaWQge1xyXG4gICAgY29uc29sZS50aW1lKCdEaXNwbGF5aW5nIGRhdGEnKVxyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBkYXRhID0gZ2V0RGF0YSgpXHJcbiAgICAgICAgaWYgKCFkYXRhKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRGF0YSBzaG91bGQgaGF2ZSBiZWVuIGZldGNoZWQgYmVmb3JlIGRpc3BsYXkoKSB3YXMgY2FsbGVkJylcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuc2V0QXR0cmlidXRlKCdkYXRhLXBjcnZpZXcnLCBkYXRhLm1vbnRoVmlldyA/ICdtb250aCcgOiAnb3RoZXInKVxyXG4gICAgICAgIGNvbnN0IG1haW4gPSBfJChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdtYWluJykpXHJcbiAgICAgICAgY29uc3QgdGFrZW46IHsgW2RhdGU6IG51bWJlcl06IG51bWJlcltdIH0gPSB7fVxyXG5cclxuICAgICAgICBjb25zdCB0aW1lYWZ0ZXIgPSBnZXRUaW1lQWZ0ZXIobmV3IERhdGUoKSlcclxuXHJcbiAgICAgICAgY29uc3Qge3N0YXJ0LCBlbmR9ID0gZ2V0U3RhcnRFbmREYXRlcyhkYXRhKVxyXG5cclxuICAgICAgICAvLyBTZXQgdGhlIHN0YXJ0IGRhdGUgdG8gYmUgYSBTdW5kYXkgYW5kIHRoZSBlbmQgZGF0ZSB0byBiZSBhIFNhdHVyZGF5XHJcbiAgICAgICAgc3RhcnQuc2V0RGF0ZShzdGFydC5nZXREYXRlKCkgLSBzdGFydC5nZXREYXkoKSlcclxuICAgICAgICBlbmQuc2V0RGF0ZShlbmQuZ2V0RGF0ZSgpICsgKDYgLSBlbmQuZ2V0RGF5KCkpKVxyXG5cclxuICAgICAgICAvLyBGaXJzdCBwb3B1bGF0ZSB0aGUgY2FsZW5kYXIgd2l0aCBib3hlcyBmb3IgZWFjaCBkYXlcclxuICAgICAgICBjb25zdCBsYXN0RGF0YSA9IGxvY2FsU3RvcmFnZVJlYWQoJ2RhdGEnKSBhcyBJQXBwbGljYXRpb25EYXRhXHJcbiAgICAgICAgbGV0IHdrOiBIVE1MRWxlbWVudHxudWxsID0gbnVsbFxyXG4gICAgICAgIGl0ZXJEYXlzKHN0YXJ0LCBlbmQsIChkKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChkLmdldERheSgpID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpZCA9IGB3ayR7ZC5nZXRNb250aCgpfS0ke2QuZ2V0RGF0ZSgpfWAgLy8gRG9uJ3QgY3JlYXRlIGEgbmV3IHdlZWsgZWxlbWVudCBpZiBvbmUgYWxyZWFkeSBleGlzdHNcclxuICAgICAgICAgICAgICAgIHdrID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpXHJcbiAgICAgICAgICAgICAgICBpZiAod2sgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHdrID0gY3JlYXRlV2VlayhpZClcclxuICAgICAgICAgICAgICAgICAgICBtYWluLmFwcGVuZENoaWxkKHdrKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIXdrKSB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkIHdlZWsgZWxlbWVudCBvbiBkYXkgJHtkfSB0byBub3QgYmUgbnVsbGApXHJcbiAgICAgICAgICAgIGlmICh3ay5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdkYXknKS5sZW5ndGggPD0gZC5nZXREYXkoKSkge1xyXG4gICAgICAgICAgICAgICAgd2suYXBwZW5kQ2hpbGQoY3JlYXRlRGF5KGQpKVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0YWtlbltkLmdldFRpbWUoKV0gPSBbXVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIC8vIFNwbGl0IGFzc2lnbm1lbnRzIHRha2luZyBtb3JlIHRoYW4gMSB3ZWVrXHJcbiAgICAgICAgY29uc3Qgc3BsaXQ6IElTcGxpdEFzc2lnbm1lbnRbXSA9IFtdXHJcbiAgICAgICAgZGF0YS5hc3NpZ25tZW50cy5mb3JFYWNoKChhc3NpZ25tZW50LCBudW0pID0+IHtcclxuICAgICAgICAgICAgc3BsaXQucHVzaCguLi5nZXRBc3NpZ25tZW50U3BsaXRzKGFzc2lnbm1lbnQsIHN0YXJ0LCBlbmQpKVxyXG5cclxuICAgICAgICAgICAgLy8gQWN0aXZpdHkgc3R1ZmZcclxuICAgICAgICAgICAgaWYgKGxhc3REYXRhICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG9sZEFzc2lnbm1lbnQgPSBsYXN0RGF0YS5hc3NpZ25tZW50cy5maW5kKChhKSA9PiBhLmlkID09PSBhc3NpZ25tZW50LmlkKVxyXG4gICAgICAgICAgICAgICAgaWYgKG9sZEFzc2lnbm1lbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAob2xkQXNzaWdubWVudC5ib2R5ICE9PSBhc3NpZ25tZW50LmJvZHkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWRkQWN0aXZpdHkoJ2VkaXQnLCBvbGRBc3NpZ25tZW50LCBuZXcgRGF0ZSgpLCB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbGRBc3NpZ25tZW50LmNsYXNzICE9IG51bGwgPyBsYXN0RGF0YS5jbGFzc2VzW29sZEFzc2lnbm1lbnQuY2xhc3NdIDogdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZW1vdmVGcm9tTW9kaWZpZWQoYXNzaWdubWVudC5pZCkgLy8gSWYgdGhlIGFzc2lnbm1lbnQgaXMgbW9kaWZpZWQsIHJlc2V0IGl0XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGxhc3REYXRhLmFzc2lnbm1lbnRzLnNwbGljZShsYXN0RGF0YS5hc3NpZ25tZW50cy5pbmRleE9mKG9sZEFzc2lnbm1lbnQpLCAxKVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBhZGRBY3Rpdml0eSgnYWRkJywgYXNzaWdubWVudCwgbmV3IERhdGUoKSwgdHJ1ZSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIGlmIChsYXN0RGF0YSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIC8vIENoZWNrIGlmIGFueSBvZiB0aGUgbGFzdCBhc3NpZ25tZW50cyB3ZXJlbid0IGRlbGV0ZWQgKHNvIHRoZXkgaGF2ZSBiZWVuIGRlbGV0ZWQgaW4gUENSKVxyXG4gICAgICAgICAgICBsYXN0RGF0YS5hc3NpZ25tZW50cy5mb3JFYWNoKChhc3NpZ25tZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBhZGRBY3Rpdml0eSgnZGVsZXRlJywgYXNzaWdubWVudCwgbmV3IERhdGUoKSwgdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzc2lnbm1lbnQuY2xhc3MgIT0gbnVsbCA/IGxhc3REYXRhLmNsYXNzZXNbYXNzaWdubWVudC5jbGFzc10gOiB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICByZW1vdmVGcm9tRG9uZShhc3NpZ25tZW50LmlkKVxyXG4gICAgICAgICAgICAgICAgcmVtb3ZlRnJvbU1vZGlmaWVkKGFzc2lnbm1lbnQuaWQpXHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICAvLyBUaGVuIHNhdmUgYSBtYXhpbXVtIG9mIDEyOCBhY3Rpdml0eSBpdGVtc1xyXG4gICAgICAgICAgICBzYXZlQWN0aXZpdHkoKVxyXG5cclxuICAgICAgICAgICAgLy8gQW5kIGNvbXBsZXRlZCBhc3NpZ25tZW50cyArIG1vZGlmaWNhdGlvbnNcclxuICAgICAgICAgICAgc2F2ZURvbmUoKVxyXG4gICAgICAgICAgICBzYXZlTW9kaWZpZWQoKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gQWRkIGN1c3RvbSBhc3NpZ25tZW50cyB0byB0aGUgc3BsaXQgYXJyYXlcclxuICAgICAgICBnZXRFeHRyYSgpLmZvckVhY2goKGN1c3RvbSkgPT4ge1xyXG4gICAgICAgICAgICBzcGxpdC5wdXNoKC4uLmdldEFzc2lnbm1lbnRTcGxpdHMoZXh0cmFUb1Rhc2soY3VzdG9tLCBkYXRhKSwgc3RhcnQsIGVuZCwgY3VzdG9tKSlcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICAvLyBDYWxjdWxhdGUgdGhlIHRvZGF5J3Mgd2VlayBpZFxyXG4gICAgICAgIGNvbnN0IHRkc3QgPSBuZXcgRGF0ZSgpXHJcbiAgICAgICAgdGRzdC5zZXREYXRlKHRkc3QuZ2V0RGF0ZSgpIC0gdGRzdC5nZXREYXkoKSlcclxuICAgICAgICBjb25zdCB0b2RheVdrSWQgPSBgd2ske3Rkc3QuZ2V0TW9udGgoKX0tJHt0ZHN0LmdldERhdGUoKX1gXHJcblxyXG4gICAgICAgIC8vIFRoZW4gYWRkIGFzc2lnbm1lbnRzXHJcbiAgICAgICAgY29uc3Qgd2Vla0hlaWdodHM6IHsgW3dlZWtJZDogc3RyaW5nXTogbnVtYmVyIH0gPSB7fVxyXG4gICAgICAgIGNvbnN0IHByZXZpb3VzQXNzaWdubWVudHM6IHsgW2lkOiBzdHJpbmddOiBIVE1MRWxlbWVudCB9ID0ge31cclxuICAgICAgICBBcnJheS5wcm90b3R5cGUuZm9yRWFjaC5jYWxsKGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2Fzc2lnbm1lbnQnKSwgKGFzc2lnbm1lbnQ6IEhUTUxFbGVtZW50KSA9PiB7XHJcbiAgICAgICAgICAgIHByZXZpb3VzQXNzaWdubWVudHNbYXNzaWdubWVudC5pZF0gPSBhc3NpZ25tZW50XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgc3BsaXQuZm9yRWFjaCgocykgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB3ZWVrSWQgPSBjb21wdXRlV2Vla0lkKHMpXHJcbiAgICAgICAgICAgIHdrID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQod2Vla0lkKVxyXG4gICAgICAgICAgICBpZiAod2sgPT0gbnVsbCkgcmV0dXJuXHJcblxyXG4gICAgICAgICAgICBjb25zdCBlID0gY3JlYXRlQXNzaWdubWVudChzLCBkYXRhKVxyXG5cclxuICAgICAgICAgICAgLy8gQ2FsY3VsYXRlIGhvdyBtYW55IGFzc2lnbm1lbnRzIGFyZSBwbGFjZWQgYmVmb3JlIHRoZSBjdXJyZW50IG9uZVxyXG4gICAgICAgICAgICBpZiAoIXMuY3VzdG9tIHx8ICFzZXR0aW5ncy5zZXBUYXNrcykge1xyXG4gICAgICAgICAgICAgICAgbGV0IHBvcyA9IDBcclxuICAgICAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZSBuby1sb29wc1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZm91bmQgPSB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgaXRlckRheXMocy5zdGFydCwgcy5lbmQgPT09ICdGb3JldmVyJyA/IHMuc3RhcnQgOiBzLmVuZCwgKGQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRha2VuW2QuZ2V0VGltZSgpXS5pbmRleE9mKHBvcykgIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IGZhbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChmb3VuZCkgeyBicmVhayB9XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zKytcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBBcHBlbmQgdGhlIHBvc2l0aW9uIHRoZSBhc3NpZ25tZW50IGlzIGF0IHRvIHRoZSB0YWtlbiBhcnJheVxyXG4gICAgICAgICAgICAgICAgaXRlckRheXMocy5zdGFydCwgcy5lbmQgPT09ICdGb3JldmVyJyA/IHMuc3RhcnQgOiBzLmVuZCwgKGQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0YWtlbltkLmdldFRpbWUoKV0ucHVzaChwb3MpXHJcbiAgICAgICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIENhbGN1bGF0ZSBob3cgZmFyIGRvd24gdGhlIGFzc2lnbm1lbnQgbXVzdCBiZSBwbGFjZWQgYXMgdG8gbm90IGJsb2NrIHRoZSBvbmVzIGFib3ZlIGl0XHJcbiAgICAgICAgICAgICAgICBlLnN0eWxlLm1hcmdpblRvcCA9IChwb3MgKiAzMCkgKyAncHgnXHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCh3ZWVrSGVpZ2h0c1t3ZWVrSWRdID09IG51bGwpIHx8IChwb3MgPiB3ZWVrSGVpZ2h0c1t3ZWVrSWRdKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHdlZWtIZWlnaHRzW3dlZWtJZF0gPSBwb3NcclxuICAgICAgICAgICAgICAgICAgICB3ay5zdHlsZS5oZWlnaHQgPSA0NyArICgocG9zICsgMSkgKiAzMCkgKyAncHgnXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIElmIHRoZSBhc3NpZ25tZW50IGlzIGEgdGVzdCBhbmQgaXMgdXBjb21pbmcsIGFkZCBpdCB0byB0aGUgdXBjb21pbmcgdGVzdHMgcGFuZWwuXHJcbiAgICAgICAgICAgIGlmIChzLmFzc2lnbm1lbnQuZW5kID49IHRvZGF5KCkgJiYgKHMuYXNzaWdubWVudC5iYXNlVHlwZSA9PT0gJ3Rlc3QnIHx8XHJcbiAgICAgICAgICAgICAgICAoc2V0dGluZ3MucHJvamVjdHNJblRlc3RQYW5lICYmIHMuYXNzaWdubWVudC5iYXNlVHlwZSA9PT0gJ2xvbmd0ZXJtJykpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0ZSA9IGVsZW1lbnQoJ2RpdicsIFsndXBjb21pbmdUZXN0JywgJ2Fzc2lnbm1lbnRJdGVtJywgcy5hc3NpZ25tZW50LmJhc2VUeXBlXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgPGkgY2xhc3M9J21hdGVyaWFsLWljb25zJz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7cy5hc3NpZ25tZW50LmJhc2VUeXBlID09PSAnbG9uZ3Rlcm0nID8gJ2Fzc2lnbm1lbnQnIDogJ2Fzc2Vzc21lbnQnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2k+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPSd0aXRsZSc+JHtzLmFzc2lnbm1lbnQudGl0bGV9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c21hbGw+JHtzZXBhcmF0ZWRDbGFzcyhzLmFzc2lnbm1lbnQsIGRhdGEpWzJdfTwvc21hbGw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9J3JhbmdlJz4ke2RhdGVTdHJpbmcocy5hc3NpZ25tZW50LmVuZCwgdHJ1ZSl9PC9kaXY+YCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgdGVzdCR7cy5hc3NpZ25tZW50LmlkfWApXHJcbiAgICAgICAgICAgICAgICBpZiAocy5hc3NpZ25tZW50LmNsYXNzKSB0ZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtY2xhc3MnLCBkYXRhLmNsYXNzZXNbcy5hc3NpZ25tZW50LmNsYXNzXSlcclxuICAgICAgICAgICAgICAgIHRlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRvU2Nyb2xsaW5nID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBzbW9vdGhTY3JvbGwoKGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wICsgZG9jdW1lbnQuYm9keS5zY3JvbGxUb3ApIC0gMTE2KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlLmNsaWNrKClcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRvY3VtZW50LmJvZHkuZ2V0QXR0cmlidXRlKCdkYXRhLXZpZXcnKSA9PT0gJzAnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvU2Nyb2xsaW5nKClcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfJChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbmF2VGFicz5saTpmaXJzdC1jaGlsZCcpIGFzIEhUTUxFbGVtZW50KS5jbGljaygpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZG9TY3JvbGxpbmcsIDUwMClcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChhc3NpZ25tZW50SW5Eb25lKHMuYXNzaWdubWVudC5pZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0ZS5jbGFzc0xpc3QuYWRkKCdkb25lJylcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvbnN0IHRlc3RFbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYHRlc3Qke3MuYXNzaWdubWVudC5pZH1gKVxyXG4gICAgICAgICAgICAgICAgaWYgKHRlc3RFbGVtKSB7XHJcbiAgICAgICAgICAgICAgICB0ZXN0RWxlbS5pbm5lckhUTUwgPSB0ZS5pbm5lckhUTUxcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbUJ5SWQoJ2luZm9UZXN0cycpLmFwcGVuZENoaWxkKHRlKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBhbHJlYWR5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocy5hc3NpZ25tZW50LmlkICsgd2Vla0lkKVxyXG4gICAgICAgICAgICBpZiAoYWxyZWFkeSAhPSBudWxsKSB7IC8vIEFzc2lnbm1lbnQgYWxyZWFkeSBleGlzdHNcclxuICAgICAgICAgICAgICAgIGFscmVhZHkuc3R5bGUubWFyZ2luVG9wID0gZS5zdHlsZS5tYXJnaW5Ub3BcclxuICAgICAgICAgICAgICAgIGFscmVhZHkuc2V0QXR0cmlidXRlKCdkYXRhLWNsYXNzJyxcclxuICAgICAgICAgICAgICAgICAgICBzLmN1c3RvbSAmJiBzZXR0aW5ncy5zZXBUYXNrQ2xhc3MgPyAnVGFzaycgOiBjbGFzc0J5SWQocy5hc3NpZ25tZW50LmNsYXNzKSlcclxuICAgICAgICAgICAgICAgIGlmICghYXNzaWdubWVudEluTW9kaWZpZWQocy5hc3NpZ25tZW50LmlkKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFscmVhZHkuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYm9keScpWzBdLmlubmVySFRNTCA9IGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYm9keScpWzBdLmlubmVySFRNTFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXyQoYWxyZWFkeS5xdWVyeVNlbGVjdG9yKCcuZWRpdHMnKSkuY2xhc3NOYW1lID0gXyQoZS5xdWVyeVNlbGVjdG9yKCcuZWRpdHMnKSkuY2xhc3NOYW1lXHJcbiAgICAgICAgICAgICAgICBpZiAoYWxyZWFkeS5jbGFzc0xpc3QudG9nZ2xlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxyZWFkeS5jbGFzc0xpc3QudG9nZ2xlKCdsaXN0RGlzcCcsIGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdsaXN0RGlzcCcpKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZ2V0RVMoYWxyZWFkeSkuZm9yRWFjaCgoY2wpID0+IGFscmVhZHkuY2xhc3NMaXN0LnJlbW92ZShjbCkpXHJcbiAgICAgICAgICAgICAgICBnZXRFUyhlKS5mb3JFYWNoKChjbCkgPT4gYWxyZWFkeS5jbGFzc0xpc3QuYWRkKGNsKSlcclxuICAgICAgICAgICAgICAgIFdFRUtFTkRfQ0xBU1NOQU1FUy5mb3JFYWNoKChjbCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGFscmVhZHkuY2xhc3NMaXN0LnJlbW92ZShjbClcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZS5jbGFzc0xpc3QuY29udGFpbnMoY2wpKSBhbHJlYWR5LmNsYXNzTGlzdC5hZGQoY2wpXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKHMuY3VzdG9tICYmIHNldHRpbmdzLnNlcFRhc2tzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3QgPSBNYXRoLmZsb29yKHMuc3RhcnQuZ2V0VGltZSgpIC8gMTAwMCAvIDM2MDAgLyAyNClcclxuICAgICAgICAgICAgICAgICAgICBpZiAoKHMuYXNzaWdubWVudC5zdGFydCA9PT0gc3QpICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIChzLmFzc2lnbm1lbnQuZW5kID09PSAnRm9yZXZlcicgfHwgcy5hc3NpZ25tZW50LmVuZCA+PSB0b2RheSgpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlLmNsYXNzTGlzdC5yZW1vdmUoJ2Fzc2lnbm1lbnQnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlLmNsYXNzTGlzdC5hZGQoJ3Rhc2tQYW5lSXRlbScpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGUuc3R5bGUub3JkZXIgPSBTdHJpbmcocy5hc3NpZ25tZW50LmVuZCA9PT0gJ0ZvcmV2ZXInID8gTnVtYmVyLk1BWF9WQUxVRSA6IHMuYXNzaWdubWVudC5lbmQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGxpbmsgPSBlLnF1ZXJ5U2VsZWN0b3IoJy5saW5rZWQnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobGluaykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5pbnNlcnRCZWZvcmUoZWxlbWVudCgnc21hbGwnLCBbXSwgbGluay5pbm5lckhUTUwpLCBsaW5rKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluay5yZW1vdmUoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1CeUlkKCdpbmZvVGFza3NJbm5lcicpLmFwcGVuZENoaWxkKGUpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHsgd2suYXBwZW5kQ2hpbGQoZSkgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGRlbGV0ZSBwcmV2aW91c0Fzc2lnbm1lbnRzW3MuYXNzaWdubWVudC5pZCArIHdlZWtJZF1cclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICAvLyBEZWxldGUgYW55IGFzc2lnbm1lbnRzIHRoYXQgaGF2ZSBiZWVuIGRlbGV0ZWQgc2luY2UgdXBkYXRpbmdcclxuICAgICAgICBPYmplY3QuZW50cmllcyhwcmV2aW91c0Fzc2lnbm1lbnRzKS5mb3JFYWNoKChbbmFtZSwgYXNzaWdubWVudF0pID0+IHtcclxuICAgICAgICAgICAgaWYgKGFzc2lnbm1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdmdWxsJykpIHtcclxuICAgICAgICAgICAgICAgIGVsZW1CeUlkKCdiYWNrZ3JvdW5kJykuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBhc3NpZ25tZW50LnJlbW92ZSgpXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgLy8gU2Nyb2xsIHRvIHRoZSBjb3JyZWN0IHBvc2l0aW9uIGluIGNhbGVuZGFyIHZpZXdcclxuICAgICAgICBpZiAod2Vla0hlaWdodHNbdG9kYXlXa0lkXSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIGxldCBoID0gMFxyXG4gICAgICAgICAgICBjb25zdCBzdyA9ICh3a2lkOiBzdHJpbmcpID0+IHdraWQuc3Vic3RyaW5nKDIpLnNwbGl0KCctJykubWFwKCh4KSA9PiBOdW1iZXIoeCkpXHJcbiAgICAgICAgICAgIGNvbnN0IHRvZGF5V2sgPSBzdyh0b2RheVdrSWQpXHJcbiAgICAgICAgICAgIE9iamVjdC5lbnRyaWVzKHdlZWtIZWlnaHRzKS5mb3JFYWNoKChbd2tJZCwgdmFsXSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgd2tTcGxpdCA9IHN3KHdrSWQpXHJcbiAgICAgICAgICAgICAgICBpZiAoKHdrU3BsaXRbMF0gPCB0b2RheVdrWzBdKSB8fCAoKHdrU3BsaXRbMF0gPT09IHRvZGF5V2tbMF0pICYmICh3a1NwbGl0WzFdIDwgdG9kYXlXa1sxXSkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaCArPSB2YWxcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgc2Nyb2xsID0gKGggKiAzMCkgKyAxMTIgKyAxNFxyXG4gICAgICAgICAgICAvLyBBbHNvIHNob3cgdGhlIGRheSBoZWFkZXJzIGlmIHRvZGF5J3MgZGF0ZSBpcyBkaXNwbGF5ZWQgaW4gdGhlIGZpcnN0IHJvdyBvZiB0aGUgY2FsZW5kYXJcclxuICAgICAgICAgICAgaWYgKHNjcm9sbCA8IDUwKSBzY3JvbGwgPSAwXHJcbiAgICAgICAgICAgIGlmIChkb1Njcm9sbCAmJiAoZG9jdW1lbnQuYm9keS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmlldycpID09PSAnMCcpICYmXHJcbiAgICAgICAgICAgICAgICAhZG9jdW1lbnQuYm9keS5xdWVyeVNlbGVjdG9yKCcuZnVsbCcpKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBpbiBjYWxlbmRhciB2aWV3XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgc2Nyb2xsKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC50b2dnbGUoJ25vTGlzdCcsXHJcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5hc3NpZ25tZW50Lmxpc3REaXNwOm5vdCguZG9uZSknKS5sZW5ndGggPT09IDApXHJcbiAgICAgICAgaWYgKGRvY3VtZW50LmJvZHkuZ2V0QXR0cmlidXRlKCdkYXRhLXZpZXcnKSA9PT0gJzEnKSB7IC8vIGluIGxpc3Qgdmlld1xyXG4gICAgICAgICAgICByZXNpemUoKVxyXG4gICAgICAgIH1cclxuICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgIGRpc3BsYXlFcnJvcihlcnIpXHJcbiAgICB9XHJcbiAgICBjb25zb2xlLnRpbWVFbmQoJ0Rpc3BsYXlpbmcgZGF0YScpXHJcbn1cclxuXHJcbi8vIFRoZSBmdW5jdGlvbiBiZWxvdyBjb252ZXJ0cyBhbiB1cGRhdGUgdGltZSB0byBhIGh1bWFuLXJlYWRhYmxlIGRhdGUuXHJcbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRVcGRhdGUoZGF0ZTogbnVtYmVyKTogc3RyaW5nIHtcclxuICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpXHJcbiAgY29uc3QgdXBkYXRlID0gbmV3IERhdGUoK2RhdGUpXHJcbiAgaWYgKG5vdy5nZXREYXRlKCkgPT09IHVwZGF0ZS5nZXREYXRlKCkpIHtcclxuICAgIGxldCBhbXBtID0gJ0FNJ1xyXG4gICAgbGV0IGhyID0gdXBkYXRlLmdldEhvdXJzKClcclxuICAgIGlmIChociA+IDEyKSB7XHJcbiAgICAgIGFtcG0gPSAnUE0nXHJcbiAgICAgIGhyIC09IDEyXHJcbiAgICB9XHJcbiAgICBjb25zdCBtaW4gPSB1cGRhdGUuZ2V0TWludXRlcygpXHJcbiAgICByZXR1cm4gYFRvZGF5IGF0ICR7aHJ9OiR7bWluIDwgMTAgPyBgMCR7bWlufWAgOiBtaW59ICR7YW1wbX1gXHJcbiAgfSBlbHNlIHtcclxuICAgIGNvbnN0IGRheXNQYXN0ID0gTWF0aC5jZWlsKChub3cuZ2V0VGltZSgpIC0gdXBkYXRlLmdldFRpbWUoKSkgLyAxMDAwIC8gMzYwMCAvIDI0KVxyXG4gICAgaWYgKGRheXNQYXN0ID09PSAxKSB7IHJldHVybiAnWWVzdGVyZGF5JyB9IGVsc2UgeyByZXR1cm4gZGF5c1Bhc3QgKyAnIGRheXMgYWdvJyB9XHJcbiAgfVxyXG59XHJcbiIsImxldCBsaXN0RGF0ZU9mZnNldCA9IDBcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRMaXN0RGF0ZU9mZnNldCgpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIGxpc3REYXRlT2Zmc2V0XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB6ZXJvTGlzdERhdGVPZmZzZXQoKTogdm9pZCB7XHJcbiAgICBsaXN0RGF0ZU9mZnNldCA9IDBcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGluY3JlbWVudExpc3REYXRlT2Zmc2V0KCk6IHZvaWQge1xyXG4gICAgbGlzdERhdGVPZmZzZXQgKz0gMVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZGVjcmVtZW50TGlzdERhdGVPZmZzZXQoKTogdm9pZCB7XHJcbiAgICBsaXN0RGF0ZU9mZnNldCAtPSAxXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRMaXN0RGF0ZU9mZnNldChvZmZzZXQ6IG51bWJlcik6IHZvaWQge1xyXG4gICAgbGlzdERhdGVPZmZzZXQgPSBvZmZzZXRcclxufVxyXG4iLCIvKipcclxuICogVGhpcyBtb2R1bGUgY29udGFpbnMgY29kZSB0byBib3RoIGZldGNoIGFuZCBwYXJzZSBhc3NpZ25tZW50cyBmcm9tIFBDUi5cclxuICovXHJcbmltcG9ydCB7IHVwZGF0ZUF2YXRhciB9IGZyb20gJy4vY29tcG9uZW50cy9hdmF0YXInXHJcbmltcG9ydCB7IGRpc3BsYXlFcnJvciB9IGZyb20gJy4vY29tcG9uZW50cy9lcnJvckRpc3BsYXknXHJcbmltcG9ydCB7IHNuYWNrYmFyIH0gZnJvbSAnLi9jb21wb25lbnRzL3NuYWNrYmFyJ1xyXG5pbXBvcnQgeyBkZWxldGVDb29raWUsIGdldENvb2tpZSwgc2V0Q29va2llIH0gZnJvbSAnLi9jb29raWVzJ1xyXG5pbXBvcnQgeyB0b0RhdGVOdW0gfSBmcm9tICcuL2RhdGVzJ1xyXG5pbXBvcnQgeyBmb3JtYXRVcGRhdGUsIGRpc3BsYXkgfSBmcm9tICcuL2Rpc3BsYXknXHJcbmltcG9ydCB7IF8kLCBlbGVtQnlJZCwgbG9jYWxTdG9yYWdlV3JpdGUsIHNlbmQgfSBmcm9tICcuL3V0aWwnXHJcblxyXG5jb25zdCBQQ1JfVVJMID0gJ2h0dHBzOi8vd2ViYXBwc2NhLnBjcnNvZnQuY29tJ1xyXG5jb25zdCBBU1NJR05NRU5UU19VUkwgPSBgJHtQQ1JfVVJMfS9DbHVlL1NDLUFzc2lnbm1lbnRzLUVuZC1EYXRlLVJhbmdlLzc1MzZgXHJcbmNvbnN0IExPR0lOX1VSTCA9IGAke1BDUl9VUkx9L0NsdWUvU0MtU3R1ZGVudC1Qb3J0YWwtTG9naW4tTERBUC84NDY0P3JldHVyblVybD0ke2VuY29kZVVSSUNvbXBvbmVudChBU1NJR05NRU5UU19VUkwpfWBcclxuY29uc3QgQVRUQUNITUVOVFNfVVJMID0gYCR7UENSX1VSTH0vQ2x1ZS9Db21tb24vQXR0YWNobWVudFJlbmRlci5hc3B4YFxyXG5jb25zdCBGT1JNX0hFQURFUl9PTkxZID0geyAnQ29udGVudC10eXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcgfVxyXG5jb25zdCBPTkVfTUlOVVRFX01TID0gNjAwMDBcclxuXHJcbmNvbnN0IHByb2dyZXNzRWxlbWVudCA9IGVsZW1CeUlkKCdwcm9ncmVzcycpXHJcbmNvbnN0IGxvZ2luRGlhbG9nID0gZWxlbUJ5SWQoJ2xvZ2luJylcclxuY29uc3QgbG9naW5CYWNrZ3JvdW5kID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xvZ2luQmFja2dyb3VuZCcpXHJcbmNvbnN0IGxhc3RVcGRhdGVFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsYXN0VXBkYXRlJylcclxuY29uc3QgdXNlcm5hbWVFbCA9IGVsZW1CeUlkKCd1c2VybmFtZScpIGFzIEhUTUxJbnB1dEVsZW1lbnRcclxuY29uc3QgcGFzc3dvcmRFbCA9IGVsZW1CeUlkKCdwYXNzd29yZCcpIGFzIEhUTUxJbnB1dEVsZW1lbnRcclxuY29uc3QgcmVtZW1iZXJDaGVjayA9IGVsZW1CeUlkKCdyZW1lbWJlcicpIGFzIEhUTUxJbnB1dEVsZW1lbnRcclxuY29uc3QgaW5jb3JyZWN0TG9naW5FbCA9IGVsZW1CeUlkKCdsb2dpbkluY29ycmVjdCcpXHJcblxyXG4vLyBUT0RPIGtlZXBpbmcgdGhlc2UgYXMgYSBnbG9iYWwgdmFycyBpcyBiYWRcclxuY29uc3QgbG9naW5IZWFkZXJzOiB7W2hlYWRlcjogc3RyaW5nXTogc3RyaW5nfSA9IHt9XHJcbmNvbnN0IHZpZXdEYXRhOiB7W2hhZGVyOiBzdHJpbmddOiBzdHJpbmd9ID0ge31cclxubGV0IGxhc3RVcGRhdGUgPSAwIC8vIFRoZSBsYXN0IHRpbWUgZXZlcnl0aGluZyB3YXMgdXBkYXRlZFxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJQXBwbGljYXRpb25EYXRhIHtcclxuICAgIGNsYXNzZXM6IHN0cmluZ1tdXHJcbiAgICBhc3NpZ25tZW50czogSUFzc2lnbm1lbnRbXVxyXG4gICAgbW9udGhWaWV3OiBib29sZWFuXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUFzc2lnbm1lbnQge1xyXG4gICAgc3RhcnQ6IG51bWJlclxyXG4gICAgZW5kOiBudW1iZXJ8J0ZvcmV2ZXInXHJcbiAgICBhdHRhY2htZW50czogQXR0YWNobWVudEFycmF5W11cclxuICAgIGJvZHk6IHN0cmluZ1xyXG4gICAgdHlwZTogc3RyaW5nXHJcbiAgICBiYXNlVHlwZTogc3RyaW5nXHJcbiAgICBjbGFzczogbnVtYmVyfG51bGwsXHJcbiAgICB0aXRsZTogc3RyaW5nXHJcbiAgICBpZDogc3RyaW5nXHJcbn1cclxuXHJcbmV4cG9ydCB0eXBlIEF0dGFjaG1lbnRBcnJheSA9IFtzdHJpbmcsIHN0cmluZ11cclxuXHJcbi8vIFRoaXMgaXMgdGhlIGZ1bmN0aW9uIHRoYXQgcmV0cmlldmVzIHlvdXIgYXNzaWdubWVudHMgZnJvbSBQQ1IuXHJcbi8vXHJcbi8vIEZpcnN0LCBhIHJlcXVlc3QgaXMgc2VudCB0byBQQ1IgdG8gbG9hZCB0aGUgcGFnZSB5b3Ugd291bGQgbm9ybWFsbHkgc2VlIHdoZW4gYWNjZXNzaW5nIFBDUi5cclxuLy9cclxuLy8gQmVjYXVzZSB0aGlzIGlzIHJ1biBhcyBhIGNocm9tZSBleHRlbnNpb24sIHRoaXMgcGFnZSBjYW4gYmUgYWNjZXNzZWQuIE90aGVyd2lzZSwgdGhlIGJyb3dzZXJcclxuLy8gd291bGQgdGhyb3cgYW4gZXJyb3IgZm9yIHNlY3VyaXR5IHJlYXNvbnMgKHlvdSBkb24ndCB3YW50IGEgcmFuZG9tIHdlYnNpdGUgYmVpbmcgYWJsZSB0byBhY2Nlc3NcclxuLy8gY29uZmlkZW50aWFsIGRhdGEgZnJvbSBhIHdlYnNpdGUgeW91IGhhdmUgbG9nZ2VkIGludG8pLlxyXG5cclxuLyoqXHJcbiAqIEZldGNoZXMgZGF0YSBmcm9tIFBDUiBhbmQgaWYgdGhlIHVzZXIgaXMgbG9nZ2VkIGluIHBhcnNlcyBhbmQgZGlzcGxheXMgaXRcclxuICogQHBhcmFtIG92ZXJyaWRlIFdoZXRoZXIgdG8gZm9yY2UgYW4gdXBkYXRlIGV2ZW4gdGhlcmUgd2FzIG9uZSByZWNlbnRseVxyXG4gKiBAcGFyYW0gZGF0YSAgT3B0aW9uYWwgZGF0YSB0byBiZSBwb3N0ZWQgdG8gUENSXHJcbiAqL1xyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmV0Y2gob3ZlcnJpZGU6IGJvb2xlYW4gPSBmYWxzZSwgZGF0YT86IHN0cmluZywgb25zdWNjZXNzOiAoKSA9PiB2b2lkID0gZGlzcGxheSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ubG9naW4/OiAoKSA9PiB2b2lkKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICBpZiAoIW92ZXJyaWRlICYmIERhdGUubm93KCkgLSBsYXN0VXBkYXRlIDwgT05FX01JTlVURV9NUykgcmV0dXJuXHJcbiAgICBsYXN0VXBkYXRlID0gRGF0ZS5ub3coKVxyXG5cclxuICAgIGNvbnN0IGhlYWRlcnMgPSBkYXRhID8gRk9STV9IRUFERVJfT05MWSA6IHVuZGVmaW5lZFxyXG4gICAgY29uc29sZS50aW1lKCdGZXRjaGluZyBhc3NpZ25tZW50cycpXHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHJlc3AgPSBhd2FpdCBzZW5kKEFTU0lHTk1FTlRTX1VSTCwgJ2RvY3VtZW50JywgaGVhZGVycywgZGF0YSwgcHJvZ3Jlc3NFbGVtZW50KVxyXG4gICAgICAgIGNvbnNvbGUudGltZUVuZCgnRmV0Y2hpbmcgYXNzaWdubWVudHMnKVxyXG4gICAgICAgIGlmIChyZXNwLnJlc3BvbnNlVVJMLmluZGV4T2YoJ0xvZ2luJykgIT09IC0xKSB7XHJcbiAgICAgICAgICAgIC8vIFdlIGhhdmUgdG8gbG9nIGluIG5vd1xyXG4gICAgICAgICAgICAocmVzcC5yZXNwb25zZSBhcyBIVE1MRG9jdW1lbnQpLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdpbnB1dCcpLmZvckVhY2goKGUpID0+IHtcclxuICAgICAgICAgICAgICAgIGxvZ2luSGVhZGVyc1tlLm5hbWVdID0gZS52YWx1ZSB8fCAnJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnTmVlZCB0byBsb2cgaW4nKVxyXG4gICAgICAgICAgICBjb25zdCB1cCA9IGdldENvb2tpZSgndXNlclBhc3MnKSAvLyBBdHRlbXB0cyB0byBnZXQgdGhlIGNvb2tpZSAqdXNlclBhc3MqLCB3aGljaCBpcyBzZXQgaWYgdGhlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFwiUmVtZW1iZXIgbWVcIiBjaGVja2JveCBpcyBjaGVja2VkIHdoZW4gbG9nZ2luZyBpbiB0aHJvdWdoIENoZWNrUENSXHJcbiAgICAgICAgICAgIGlmICh1cCA9PT0gJycpIHtcclxuICAgICAgICAgICAgICAgIGlmIChsb2dpbkJhY2tncm91bmQpIGxvZ2luQmFja2dyb3VuZC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xyXG4gICAgICAgICAgICAgICAgbG9naW5EaWFsb2cuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIEJlY2F1c2Ugd2Ugd2VyZSByZW1lbWJlcmVkLCB3ZSBjYW4gbG9nIGluIGltbWVkaWF0ZWx5IHdpdGhvdXQgd2FpdGluZyBmb3IgdGhlXHJcbiAgICAgICAgICAgICAgICAvLyB1c2VyIHRvIGxvZyBpbiB0aHJvdWdoIHRoZSBsb2dpbiBmb3JtXHJcbiAgICAgICAgICAgICAgICBkb2xvZ2luKHdpbmRvdy5hdG9iKHVwKS5zcGxpdCgnOicpIGFzIFtzdHJpbmcsIHN0cmluZ10pXHJcbiAgICAgICAgICAgICAgICBpZiAob25sb2dpbikgb25sb2dpbigpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBMb2dnZWQgaW4gbm93XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdGZXRjaGluZyBhc3NpZ25tZW50cyBzdWNjZXNzZnVsJylcclxuICAgICAgICAgICAgY29uc3QgdCA9IERhdGUubm93KClcclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLmxhc3RVcGRhdGUgPSB0XHJcbiAgICAgICAgICAgIGlmIChsYXN0VXBkYXRlRWwpIGxhc3RVcGRhdGVFbC5pbm5lckhUTUwgPSBmb3JtYXRVcGRhdGUodClcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIHBhcnNlKHJlc3AucmVzcG9uc2UpXHJcbiAgICAgICAgICAgICAgICBvbnN1Y2Nlc3MoKVxyXG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpXHJcbiAgICAgICAgICAgICAgICBkaXNwbGF5RXJyb3IoZXJyb3IpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdDb3VsZCBub3QgZmV0Y2ggYXNzaWdubWVudHM7IFlvdSBhcmUgcHJvYmFibHkgb2ZmbGluZS4gSGVyZVxcJ3MgdGhlIGVycm9yOicsIGVycm9yKVxyXG4gICAgICAgIHNuYWNrYmFyKCdDb3VsZCBub3QgZmV0Y2ggeW91ciBhc3NpZ25tZW50cycsICdSZXRyeScsICgpID0+IGZldGNoKHRydWUpKVxyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogTG9ncyB0aGUgdXNlciBpbnRvIFBDUlxyXG4gKiBAcGFyYW0gdmFsICAgQW4gb3B0aW9uYWwgbGVuZ3RoLTIgYXJyYXkgb2YgdGhlIGZvcm0gW3VzZXJuYW1lLCBwYXNzd29yZF0gdG8gdXNlIHRoZSB1c2VyIGluIHdpdGguXHJcbiAqICAgICAgICAgICAgICBJZiB0aGlzIGFycmF5IGlzIG5vdCBnaXZlbiB0aGUgbG9naW4gZGlhbG9nIGlucHV0cyB3aWxsIGJlIHVzZWQuXHJcbiAqIEBwYXJhbSBzdWJtaXRFdnQgV2hldGhlciB0byBvdmVycmlkZSB0aGUgdXNlcm5hbWUgYW5kIHBhc3N3b3JkIHN1cHBsZWlkIGluIHZhbCB3aXRoIHRoZSB2YWx1ZXMgb2YgdGhlIGlucHV0IGVsZW1lbnRzXHJcbiAqL1xyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZG9sb2dpbih2YWw/OiBbc3RyaW5nLCBzdHJpbmddfG51bGwsIHN1Ym1pdEV2dDogYm9vbGVhbiA9IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbnN1Y2Nlc3M6ICgpID0+IHZvaWQgPSBkaXNwbGF5KTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICBsb2dpbkRpYWxvZy5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgaWYgKGxvZ2luQmFja2dyb3VuZCkgbG9naW5CYWNrZ3JvdW5kLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcclxuICAgIH0sIDM1MClcclxuXHJcbiAgICBjb25zdCBwb3N0QXJyYXk6IHN0cmluZ1tdID0gW10gLy8gQXJyYXkgb2YgZGF0YSB0byBwb3N0XHJcbiAgICBsb2NhbFN0b3JhZ2VXcml0ZSgndXNlcm5hbWUnLCB2YWwgJiYgIXN1Ym1pdEV2dCA/IHZhbFswXSA6IHVzZXJuYW1lRWwudmFsdWUpXHJcbiAgICB1cGRhdGVBdmF0YXIoKVxyXG4gICAgT2JqZWN0LmtleXMobG9naW5IZWFkZXJzKS5mb3JFYWNoKChoKSA9PiAge1xyXG4gICAgICAgIC8vIExvb3AgdGhyb3VnaCB0aGUgaW5wdXQgZWxlbWVudHMgY29udGFpbmVkIGluIHRoZSBsb2dpbiBwYWdlLiBBcyBtZW50aW9uZWQgYmVmb3JlLCB0aGV5XHJcbiAgICAgICAgLy8gd2lsbCBiZSBzZW50IHRvIFBDUiB0byBsb2cgaW4uXHJcbiAgICAgICAgaWYgKGgudG9Mb3dlckNhc2UoKS5pbmRleE9mKCd1c2VyJykgIT09IC0xKSB7XHJcbiAgICAgICAgICAgIGxvZ2luSGVhZGVyc1toXSA9IHZhbCAmJiAhc3VibWl0RXZ0ID8gdmFsWzBdIDogdXNlcm5hbWVFbC52YWx1ZVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaC50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ3Bhc3MnKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgbG9naW5IZWFkZXJzW2hdID0gdmFsICYmICFzdWJtaXRFdnQgPyB2YWxbMV0gOiBwYXNzd29yZEVsLnZhbHVlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBvc3RBcnJheS5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChoKSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudChsb2dpbkhlYWRlcnNbaF0pKVxyXG4gICAgfSlcclxuXHJcbiAgICAvLyBOb3cgc2VuZCB0aGUgbG9naW4gcmVxdWVzdCB0byBQQ1JcclxuICAgIGNvbnNvbGUudGltZSgnTG9nZ2luZyBpbicpXHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHJlc3AgPSBhd2FpdCBzZW5kKExPR0lOX1VSTCwgJ2RvY3VtZW50JywgRk9STV9IRUFERVJfT05MWSwgcG9zdEFycmF5LmpvaW4oJyYnKSwgcHJvZ3Jlc3NFbGVtZW50KVxyXG4gICAgICAgIGNvbnNvbGUudGltZUVuZCgnTG9nZ2luZyBpbicpXHJcbiAgICAgICAgaWYgKHJlc3AucmVzcG9uc2VVUkwuaW5kZXhPZignTG9naW4nKSAhPT0gLTEpIHtcclxuICAgICAgICAvLyBJZiBQQ1Igc3RpbGwgd2FudHMgdXMgdG8gbG9nIGluLCB0aGVuIHRoZSB1c2VybmFtZSBvciBwYXNzd29yZCBlbnRlcmVkIHdlcmUgaW5jb3JyZWN0LlxyXG4gICAgICAgICAgICBpbmNvcnJlY3RMb2dpbkVsLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXHJcbiAgICAgICAgICAgIHBhc3N3b3JkRWwudmFsdWUgPSAnJ1xyXG5cclxuICAgICAgICAgICAgbG9naW5EaWFsb2cuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuICAgICAgICAgICAgaWYgKGxvZ2luQmFja2dyb3VuZCkgbG9naW5CYWNrZ3JvdW5kLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gT3RoZXJ3aXNlLCB3ZSBhcmUgbG9nZ2VkIGluXHJcbiAgICAgICAgICAgIGlmIChyZW1lbWJlckNoZWNrLmNoZWNrZWQpIHsgLy8gSXMgdGhlIFwicmVtZW1iZXIgbWVcIiBjaGVja2JveCBjaGVja2VkP1xyXG4gICAgICAgICAgICAgICAgLy8gU2V0IGEgY29va2llIHdpdGggdGhlIHVzZXJuYW1lIGFuZCBwYXNzd29yZCBzbyB3ZSBjYW4gbG9nIGluIGF1dG9tYXRpY2FsbHkgaW4gdGhlXHJcbiAgICAgICAgICAgICAgICAvLyBmdXR1cmUgd2l0aG91dCBoYXZpbmcgdG8gcHJvbXB0IGZvciBhIHVzZXJuYW1lIGFuZCBwYXNzd29yZCBhZ2FpblxyXG4gICAgICAgICAgICAgICAgc2V0Q29va2llKCd1c2VyUGFzcycsIHdpbmRvdy5idG9hKHVzZXJuYW1lRWwudmFsdWUgKyAnOicgKyBwYXNzd29yZEVsLnZhbHVlKSwgMTQpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gbG9hZGluZ0Jhci5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCJcclxuICAgICAgICAgICAgY29uc3QgdCA9IERhdGUubm93KClcclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLmxhc3RVcGRhdGUgPSB0XHJcbiAgICAgICAgICAgIGlmIChsYXN0VXBkYXRlRWwpIGxhc3RVcGRhdGVFbC5pbm5lckhUTUwgPSBmb3JtYXRVcGRhdGUodClcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIHBhcnNlKHJlc3AucmVzcG9uc2UpIC8vIFBhcnNlIHRoZSBkYXRhIFBDUiBoYXMgcmVwbGllZCB3aXRoXHJcbiAgICAgICAgICAgICAgICBvbnN1Y2Nlc3MoKVxyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlKVxyXG4gICAgICAgICAgICAgICAgZGlzcGxheUVycm9yKGUpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICBjb25zb2xlLmxvZygnQ291bGQgbm90IGxvZyBpbiB0byBQQ1IuIEVpdGhlciB5b3VyIG5ldHdvcmsgY29ubmVjdGlvbiB3YXMgbG9zdCBkdXJpbmcgeW91ciB2aXNpdCAnICtcclxuICAgICAgICAgICAgICAgICAgICAgJ29yIFBDUiBpcyBqdXN0IG5vdCB3b3JraW5nLiBIZXJlXFwncyB0aGUgZXJyb3I6JywgZXJyb3IpXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXREYXRhKCk6IElBcHBsaWNhdGlvbkRhdGF8dW5kZWZpbmVkIHtcclxuICAgIHJldHVybiAod2luZG93IGFzIGFueSkuZGF0YVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2xhc3NlcygpOiBzdHJpbmdbXSB7XHJcbiAgICBjb25zdCBkYXRhID0gZ2V0RGF0YSgpXHJcbiAgICBpZiAoIWRhdGEpIHJldHVybiBbXVxyXG4gICAgcmV0dXJuIGRhdGEuY2xhc3Nlc1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2V0RGF0YShkYXRhOiBJQXBwbGljYXRpb25EYXRhKTogdm9pZCB7XHJcbiAgICAod2luZG93IGFzIGFueSkuZGF0YSA9IGRhdGFcclxufVxyXG5cclxuLy8gSW4gUENSJ3MgaW50ZXJmYWNlLCB5b3UgY2FuIGNsaWNrIGEgZGF0ZSBpbiBtb250aCBvciB3ZWVrIHZpZXcgdG8gc2VlIGl0IGluIGRheSB2aWV3LlxyXG4vLyBUaGVyZWZvcmUsIHRoZSBIVE1MIGVsZW1lbnQgdGhhdCBzaG93cyB0aGUgZGF0ZSB0aGF0IHlvdSBjYW4gY2xpY2sgb24gaGFzIGEgaHlwZXJsaW5rIHRoYXQgbG9va3MgbGlrZSBgIzIwMTUtMDQtMjZgLlxyXG4vLyBUaGUgZnVuY3Rpb24gYmVsb3cgd2lsbCBwYXJzZSB0aGF0IFN0cmluZyBhbmQgcmV0dXJuIGEgRGF0ZSB0aW1lc3RhbXBcclxuZnVuY3Rpb24gcGFyc2VEYXRlSGFzaChlbGVtZW50OiBIVE1MQW5jaG9yRWxlbWVudCk6IG51bWJlciB7XHJcbiAgICBjb25zdCBbeWVhciwgbW9udGgsIGRheV0gPSBlbGVtZW50Lmhhc2guc3Vic3RyaW5nKDEpLnNwbGl0KCctJykubWFwKE51bWJlcilcclxuICAgIHJldHVybiAobmV3IERhdGUoeWVhciwgbW9udGggLSAxLCBkYXkpKS5nZXRUaW1lKClcclxufVxyXG5cclxuLy8gVGhlICphdHRhY2htZW50aWZ5KiBmdW5jdGlvbiBwYXJzZXMgdGhlIGJvZHkgb2YgYW4gYXNzaWdubWVudCAoKnRleHQqKSBhbmQgcmV0dXJucyB0aGUgYXNzaWdubWVudCdzIGF0dGFjaG1lbnRzLlxyXG5mdW5jdGlvbiBhdHRhY2htZW50aWZ5KGVsZW1lbnQ6IEhUTUxFbGVtZW50KTogQXR0YWNobWVudEFycmF5W10ge1xyXG4gICAgY29uc3QgYXR0YWNobWVudHM6IEF0dGFjaG1lbnRBcnJheVtdID0gW11cclxuXHJcbiAgICAvLyBHZXQgYWxsIGxpbmtzXHJcbiAgICBjb25zdCBhcyA9IEFycmF5LmZyb20oZWxlbWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYScpKVxyXG4gICAgYXMuZm9yRWFjaCgoYSkgPT4ge1xyXG4gICAgICAgIGlmIChhLmlkLmluY2x1ZGVzKCdBdHRhY2htZW50JykpIHtcclxuICAgICAgICAgICAgYXR0YWNobWVudHMucHVzaChbXHJcbiAgICAgICAgICAgICAgICBhLmlubmVySFRNTCxcclxuICAgICAgICAgICAgICAgIGEuc2VhcmNoICsgYS5oYXNoXHJcbiAgICAgICAgICAgIF0pXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICAgIHJldHVybiBhdHRhY2htZW50c1xyXG59XHJcblxyXG4vLyBUaGlzIGZ1bmN0aW9uIHJlcGxhY2VzIHRleHQgdGhhdCByZXByZXNlbnRzIGEgaHlwZXJsaW5rIHdpdGggYSBmdW5jdGlvbmFsIGh5cGVybGluayBieSB1c2luZ1xyXG4vLyBqYXZhc2NyaXB0J3MgcmVwbGFjZSBmdW5jdGlvbiB3aXRoIGEgcmVndWxhciBleHByZXNzaW9uIGlmIHRoZSB0ZXh0IGFscmVhZHkgaXNuJ3QgcGFydCBvZiBhXHJcbi8vIGh5cGVybGluay5cclxuZnVuY3Rpb24gdXJsaWZ5KHRleHQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGV4dC5yZXBsYWNlKG5ldyBSZWdFeHAoYChcXFxyXG4gICAgICAgIGh0dHBzPzpcXFxcL1xcXFwvXFxcclxuICAgICAgICBbLUEtWjAtOSsmQCNcXFxcLyU/PX5ffCE6LC47XSpcXFxyXG4gICAgICAgIFstQS1aMC05KyZAI1xcXFwvJT1+X3xdK1xcXHJcbiAgICAgICAgKWAsICdpZydcclxuICAgICksIChzdHIsIHN0cjIsIG9mZnNldCkgPT4geyAvLyBGdW5jdGlvbiB0byByZXBsYWNlIG1hdGNoZXNcclxuICAgICAgICBpZiAoL2hyZWZcXHMqPVxccyouLy50ZXN0KHRleHQuc3Vic3RyaW5nKG9mZnNldCAtIDEwLCBvZmZzZXQpKSB8fFxyXG4gICAgICAgICAgICAvb3JpZ2luYWxwYXRoXFxzKj1cXHMqLi8udGVzdCh0ZXh0LnN1YnN0cmluZyhvZmZzZXQgLSAyMCwgb2Zmc2V0KSlcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHN0clxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBgPGEgaHJlZj1cIiR7c3RyfVwiPiR7c3RyfTwvYT5gXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxufVxyXG5cclxuLy8gQWxzbywgUENSXCJzIGludGVyZmFjZSB1c2VzIGEgc3lzdGVtIG9mIElEcyB0byBpZGVudGlmeSBkaWZmZXJlbnQgZWxlbWVudHMuIEZvciBleGFtcGxlLCB0aGUgSUQgb2ZcclxuLy8gb25lIG9mIHRoZSBib3hlcyBzaG93aW5nIHRoZSBuYW1lIG9mIGFuIGFzc2lnbm1lbnQgY291bGQgYmVcclxuLy8gYGN0bDAwX2N0bDAwX2Jhc2VDb250ZW50X2Jhc2VDb250ZW50X2ZsYXNoVG9wX2N0bDAwX1JhZFNjaGVkdWxlcjFfOTVfMGAuIFRoZSBmdW5jdGlvbiBiZWxvdyB3aWxsXHJcbi8vIHJldHVybiB0aGUgZmlyc3QgSFRNTCBlbGVtZW50IHdob3NlIElEIGNvbnRhaW5zIGEgc3BlY2lmaWVkIFN0cmluZyAoKmlkKikgYW5kIGNvbnRhaW5pbmcgYVxyXG4vLyBzcGVjaWZpZWQgdGFnICgqdGFnKikuXHJcbmZ1bmN0aW9uIGZpbmRJZChlbGVtZW50OiBIVE1MRWxlbWVudHxIVE1MRG9jdW1lbnQsIHRhZzogc3RyaW5nLCBpZDogc3RyaW5nKTogSFRNTEVsZW1lbnQge1xyXG4gICAgY29uc3QgZWwgPSBbLi4uZWxlbWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSh0YWcpXS5maW5kKChlKSA9PiBlLmlkLmluY2x1ZGVzKGlkKSlcclxuICAgIGlmICghZWwpIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGZpbmQgZWxlbWVudCB3aXRoIHRhZyAke3RhZ30gYW5kIGlkICR7aWR9IGluICR7ZWxlbWVudH1gKVxyXG4gICAgcmV0dXJuIGVsIGFzIEhUTUxFbGVtZW50XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBhcnNlQXNzaWdubWVudFR5cGUodHlwZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0eXBlLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgnJiBxdWl6emVzJywgJycpLnJlcGxhY2UoJ3Rlc3RzJywgJ3Rlc3QnKVxyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJzZUFzc2lnbm1lbnRCYXNlVHlwZSh0eXBlOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHR5cGUudG9Mb3dlckNhc2UoKS5yZXBsYWNlKCcmIHF1aXp6ZXMnLCAnJykucmVwbGFjZSgvXFxzL2csICcnKVxyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJzZUFzc2lnbm1lbnQoY2E6IEhUTUxFbGVtZW50KTogSUFzc2lnbm1lbnQge1xyXG4gICAgY29uc3QgZGF0YSA9IGdldERhdGEoKVxyXG4gICAgaWYgKCFkYXRhKSB0aHJvdyBuZXcgRXJyb3IoJ0RhdGEgZGljdGlvbmFyeSBub3Qgc2V0IHVwJylcclxuXHJcbiAgICAvLyBUaGUgc3RhcnRpbmcgZGF0ZSBhbmQgZW5kaW5nIGRhdGUgb2YgdGhlIGFzc2lnbm1lbnQgYXJlIHBhcnNlZCBmaXJzdFxyXG4gICAgY29uc3QgcmFuZ2UgPSBmaW5kSWQoY2EsICdzcGFuJywgJ1N0YXJ0aW5nT24nKS5pbm5lckhUTUwuc3BsaXQoJyAtICcpXHJcbiAgICBjb25zdCBhc3NpZ25tZW50U3RhcnQgPSB0b0RhdGVOdW0oRGF0ZS5wYXJzZShyYW5nZVswXSkpXHJcbiAgICBjb25zdCBhc3NpZ25tZW50RW5kID0gKHJhbmdlWzFdICE9IG51bGwpID8gdG9EYXRlTnVtKERhdGUucGFyc2UocmFuZ2VbMV0pKSA6IGFzc2lnbm1lbnRTdGFydFxyXG5cclxuICAgIC8vIFRoZW4sIHRoZSBuYW1lIG9mIHRoZSBhc3NpZ25tZW50IGlzIHBhcnNlZFxyXG4gICAgY29uc3QgdCA9IGZpbmRJZChjYSwgJ3NwYW4nLCAnbGJsVGl0bGUnKVxyXG4gICAgbGV0IHRpdGxlID0gdC5pbm5lckhUTUxcclxuXHJcbiAgICAvLyBUaGUgYWN0dWFsIGJvZHkgb2YgdGhlIGFzc2lnbm1lbnQgYW5kIGl0cyBhdHRhY2htZW50cyBhcmUgcGFyc2VkIG5leHRcclxuICAgIGNvbnN0IGIgPSBfJChfJCh0LnBhcmVudE5vZGUpLnBhcmVudE5vZGUpIGFzIEhUTUxFbGVtZW50XHJcbiAgICBbLi4uYi5nZXRFbGVtZW50c0J5VGFnTmFtZSgnZGl2JyldLnNsaWNlKDAsIDIpLmZvckVhY2goKGRpdikgPT4gZGl2LnJlbW92ZSgpKVxyXG5cclxuICAgIGNvbnN0IGFwID0gYXR0YWNobWVudGlmeShiKSAvLyBTZXBhcmF0ZXMgYXR0YWNobWVudHMgZnJvbSB0aGUgYm9keVxyXG5cclxuICAgIC8vIFRoZSBsYXN0IFJlcGxhY2UgcmVtb3ZlcyBsZWFkaW5nIGFuZCB0cmFpbGluZyBuZXdsaW5lc1xyXG4gICAgY29uc3QgYXNzaWdubWVudEJvZHkgPSB1cmxpZnkoYi5pbm5lckhUTUwpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXig/Olxccyo8YnJcXHMqXFwvPz4pKi8sICcnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLyg/Olxccyo8YnJcXHMqXFwvPz4pKlxccyokLywgJycpLnRyaW0oKVxyXG5cclxuICAgIC8vIEZpbmFsbHksIHdlIHNlcGFyYXRlIHRoZSBjbGFzcyBuYW1lIGFuZCB0eXBlIChob21ld29yaywgY2xhc3N3b3JrLCBvciBwcm9qZWN0cykgZnJvbSB0aGUgdGl0bGUgb2YgdGhlIGFzc2lnbm1lbnRcclxuICAgIGNvbnN0IG1hdGNoZWRUaXRsZSA9IHRpdGxlLm1hdGNoKC9cXCgoW14pXSpcXCkqKVxcKSQvKVxyXG4gICAgaWYgKChtYXRjaGVkVGl0bGUgPT0gbnVsbCkpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBwYXJzZSBhc3NpZ25tZW50IHRpdGxlIFxcXCIke3RpdGxlfVxcXCJgKVxyXG4gICAgfVxyXG4gICAgY29uc3QgYXNzaWdubWVudFR5cGUgPSBtYXRjaGVkVGl0bGVbMV1cclxuICAgIGNvbnN0IGFzc2lnbm1lbnRCYXNlVHlwZSA9IHBhcnNlQXNzaWdubWVudEJhc2VUeXBlKGNhLnRpdGxlLnN1YnN0cmluZygwLCBjYS50aXRsZS5pbmRleE9mKCdcXG4nKSkpXHJcbiAgICBsZXQgYXNzaWdubWVudENsYXNzSW5kZXggPSBudWxsXHJcbiAgICBkYXRhLmNsYXNzZXMuc29tZSgoYywgcG9zKSA9PiB7XHJcbiAgICAgICAgaWYgKHRpdGxlLmluZGV4T2YoYykgIT09IC0xKSB7XHJcbiAgICAgICAgICAgIGFzc2lnbm1lbnRDbGFzc0luZGV4ID0gcG9zXHJcbiAgICAgICAgICAgIHRpdGxlID0gdGl0bGUucmVwbGFjZShjLCAnJylcclxuICAgICAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICB9KVxyXG5cclxuICAgIGlmIChhc3NpZ25tZW50Q2xhc3NJbmRleCA9PT0gbnVsbCB8fCBhc3NpZ25tZW50Q2xhc3NJbmRleCA9PT0gLTEpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBmaW5kIGNsYXNzIGluIHRpdGxlICR7dGl0bGV9IChjbGFzc2VzIGFyZSAke2RhdGEuY2xhc3Nlc31gKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGFzc2lnbm1lbnRUaXRsZSA9IHRpdGxlLnN1YnN0cmluZyh0aXRsZS5pbmRleE9mKCc6ICcpICsgMikucmVwbGFjZSgvXFwoW15cXChcXCldKlxcKSQvLCAnJykudHJpbSgpXHJcblxyXG4gICAgLy8gVG8gbWFrZSBzdXJlIHRoZXJlIGFyZSBubyByZXBlYXRzLCB0aGUgdGl0bGUgb2YgdGhlIGFzc2lnbm1lbnQgKG9ubHkgbGV0dGVycykgYW5kIGl0cyBzdGFydCAmXHJcbiAgICAvLyBlbmQgZGF0ZSBhcmUgY29tYmluZWQgdG8gZ2l2ZSBpdCBhIHVuaXF1ZSBpZGVudGlmaWVyLlxyXG4gICAgY29uc3QgYXNzaWdubWVudElkID0gYXNzaWdubWVudFRpdGxlLnJlcGxhY2UoL1teXFx3XSovZywgJycpICsgKGFzc2lnbm1lbnRTdGFydCArIGFzc2lnbm1lbnRFbmQpXHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBzdGFydDogYXNzaWdubWVudFN0YXJ0LFxyXG4gICAgICAgIGVuZDogYXNzaWdubWVudEVuZCxcclxuICAgICAgICBhdHRhY2htZW50czogYXAsXHJcbiAgICAgICAgYm9keTogYXNzaWdubWVudEJvZHksXHJcbiAgICAgICAgdHlwZTogYXNzaWdubWVudFR5cGUsXHJcbiAgICAgICAgYmFzZVR5cGU6IGFzc2lnbm1lbnRCYXNlVHlwZSxcclxuICAgICAgICBjbGFzczogYXNzaWdubWVudENsYXNzSW5kZXgsXHJcbiAgICAgICAgdGl0bGU6IGFzc2lnbm1lbnRUaXRsZSxcclxuICAgICAgICBpZDogYXNzaWdubWVudElkXHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIFRoZSBmdW5jdGlvbiBiZWxvdyB3aWxsIHBhcnNlIHRoZSBkYXRhIGdpdmVuIGJ5IFBDUiBhbmQgY29udmVydCBpdCBpbnRvIGFuIG9iamVjdC4gSWYgeW91IG9wZW4gdXBcclxuLy8gdGhlIGRldmVsb3BlciBjb25zb2xlIG9uIENoZWNrUENSIGFuZCB0eXBlIGluIGBkYXRhYCwgeW91IGNhbiBzZWUgdGhlIGFycmF5IGNvbnRhaW5pbmcgYWxsIG9mXHJcbi8vIHlvdXIgYXNzaWdubWVudHMuXHJcbmZ1bmN0aW9uIHBhcnNlKGRvYzogSFRNTERvY3VtZW50KTogdm9pZCB7XHJcbiAgICBjb25zb2xlLnRpbWUoJ0hhbmRsaW5nIGRhdGEnKSAvLyBUbyB0aW1lIGhvdyBsb25nIGl0IHRha2VzIHRvIHBhcnNlIHRoZSBhc3NpZ25tZW50c1xyXG4gICAgY29uc3QgaGFuZGxlZERhdGFTaG9ydDogc3RyaW5nW10gPSBbXSAvLyBBcnJheSB1c2VkIHRvIG1ha2Ugc3VyZSB3ZSBkb25cInQgcGFyc2UgdGhlIHNhbWUgYXNzaWdubWVudCB0d2ljZS5cclxuICAgIGNvbnN0IGRhdGE6IElBcHBsaWNhdGlvbkRhdGEgPSB7XHJcbiAgICAgICAgY2xhc3NlczogW10sXHJcbiAgICAgICAgYXNzaWdubWVudHM6IFtdLFxyXG4gICAgICAgIG1vbnRoVmlldzogKF8kKGRvYy5xdWVyeVNlbGVjdG9yKCcucnNIZWFkZXJNb250aCcpKS5wYXJlbnROb2RlIGFzIEhUTUxFbGVtZW50KS5jbGFzc0xpc3QuY29udGFpbnMoJ3JzU2VsZWN0ZWQnKVxyXG4gICAgfSAvLyBSZXNldCB0aGUgYXJyYXkgaW4gd2hpY2ggYWxsIG9mIHlvdXIgYXNzaWdubWVudHMgYXJlIHN0b3JlZCBpbi5cclxuICAgIHNldERhdGEoZGF0YSlcclxuXHJcbiAgICBkb2MucXVlcnlTZWxlY3RvckFsbCgnaW5wdXQ6bm90KFt0eXBlPVwic3VibWl0XCJdKScpLmZvckVhY2goKGUpID0+IHtcclxuICAgICAgICB2aWV3RGF0YVsoZSBhcyBIVE1MSW5wdXRFbGVtZW50KS5uYW1lXSA9IChlIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlIHx8ICcnXHJcbiAgICB9KVxyXG5cclxuICAgIC8vIE5vdywgdGhlIGNsYXNzZXMgeW91IHRha2UgYXJlIHBhcnNlZCAodGhlc2UgYXJlIHRoZSBjaGVja2JveGVzIHlvdSBzZWUgdXAgdG9wIHdoZW4gbG9va2luZyBhdCBQQ1IpLlxyXG4gICAgY29uc3QgY2xhc3NlcyA9IGZpbmRJZChkb2MsICd0YWJsZScsICdjYkNsYXNzZXMnKS5nZXRFbGVtZW50c0J5VGFnTmFtZSgnbGFiZWwnKVxyXG4gICAgY2xhc3Nlcy5mb3JFYWNoKChjKSA9PiB7XHJcbiAgICAgICAgZGF0YS5jbGFzc2VzLnB1c2goYy5pbm5lckhUTUwpXHJcbiAgICB9KVxyXG5cclxuICAgIGNvbnN0IGFzc2lnbm1lbnRzID0gZG9jLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3JzQXB0IHJzQXB0U2ltcGxlJylcclxuICAgIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwoYXNzaWdubWVudHMsIChhc3NpZ25tZW50RWw6IEhUTUxFbGVtZW50KSA9PiB7XHJcbiAgICAgICAgY29uc3QgYXNzaWdubWVudCA9IHBhcnNlQXNzaWdubWVudChhc3NpZ25tZW50RWwpXHJcbiAgICAgICAgaWYgKGhhbmRsZWREYXRhU2hvcnQuaW5kZXhPZihhc3NpZ25tZW50LmlkKSA9PT0gLTEpIHsgLy8gTWFrZSBzdXJlIHdlIGhhdmVuJ3QgYWxyZWFkeSBwYXJzZWQgdGhlIGFzc2lnbm1lbnRcclxuICAgICAgICAgICAgaGFuZGxlZERhdGFTaG9ydC5wdXNoKGFzc2lnbm1lbnQuaWQpXHJcbiAgICAgICAgICAgIGRhdGEuYXNzaWdubWVudHMucHVzaChhc3NpZ25tZW50KVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcblxyXG4gICAgY29uc29sZS50aW1lRW5kKCdIYW5kbGluZyBkYXRhJylcclxuXHJcbiAgICAvLyBOb3cgYWxsb3cgdGhlIHZpZXcgdG8gYmUgc3dpdGNoZWRcclxuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnbG9hZGVkJylcclxuXHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnZGF0YScsIEpTT04uc3RyaW5naWZ5KGdldERhdGEoKSkpIC8vIFN0b3JlIGZvciBvZmZsaW5lIHVzZVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXJsRm9yQXR0YWNobWVudChzZWFyY2g6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gQVRUQUNITUVOVFNfVVJMICsgc2VhcmNoXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRBdHRhY2htZW50TWltZVR5cGUoc2VhcmNoOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZz4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICBjb25zdCByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKVxyXG4gICAgICAgIHJlcS5vcGVuKCdIRUFEJywgdXJsRm9yQXR0YWNobWVudChzZWFyY2gpKVxyXG4gICAgICAgIHJlcS5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChyZXEuc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHR5cGUgPSByZXEuZ2V0UmVzcG9uc2VIZWFkZXIoJ0NvbnRlbnQtVHlwZScpXHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUodHlwZSlcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcignQ29udGVudCB0eXBlIGlzIG51bGwnKSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXEuc2VuZCgpXHJcbiAgICB9KVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY2xhc3NCeUlkKGlkOiBudW1iZXJ8bnVsbHx1bmRlZmluZWQpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIChpZCA/IGdldENsYXNzZXMoKVtpZF0gOiBudWxsKSB8fCAnVW5rbm93biBjbGFzcydcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHN3aXRjaFZpZXdzKCk6IHZvaWQge1xyXG4gICAgaWYgKE9iamVjdC5rZXlzKHZpZXdEYXRhKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgZWxlbUJ5SWQoJ3NpZGVCYWNrZ3JvdW5kJykuY2xpY2soKVxyXG4gICAgICAgIHZpZXdEYXRhLl9fRVZFTlRUQVJHRVQgPSAnY3RsMDAkY3RsMDAkYmFzZUNvbnRlbnQkYmFzZUNvbnRlbnQkZmxhc2hUb3AkY3RsMDAkUmFkU2NoZWR1bGVyMSdcclxuICAgICAgICB2aWV3RGF0YS5fX0VWRU5UQVJHVU1FTlQgPSBKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgICAgIENvbW1hbmQ6IGBTd2l0Y2hUbyR7ZG9jdW1lbnQuYm9keS5nZXRBdHRyaWJ1dGUoJ2RhdGEtcGNydmlldycpID09PSAnbW9udGgnID8gJ1dlZWsnIDogJ01vbnRoJ31WaWV3YFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgdmlld0RhdGEuY3RsMDBfY3RsMDBfYmFzZUNvbnRlbnRfYmFzZUNvbnRlbnRfZmxhc2hUb3BfY3RsMDBfUmFkU2NoZWR1bGVyMV9DbGllbnRTdGF0ZSA9XHJcbiAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHtzY3JvbGxUb3A6IDAsIHNjcm9sbExlZnQ6IDAsIGlzRGlydHk6IGZhbHNlfSlcclxuICAgICAgICB2aWV3RGF0YS5jdGwwMF9jdGwwMF9SYWRTY3JpcHRNYW5hZ2VyMV9UU00gPSAnOztTeXN0ZW0uV2ViLkV4dGVuc2lvbnMsIFZlcnNpb249NC4wLjAuMCwgQ3VsdHVyZT1uZXV0cmFsLCAnICtcclxuICAgICAgICAgICAgJ1B1YmxpY0tleVRva2VuPTMxYmYzODU2YWQzNjRlMzU6ZW4tVVM6ZDI4NTY4ZDMtZTUzZS00NzA2LTkyOGYtMzc2NTkxMmI2NmNhOmVhNTk3ZDRiOmIyNTM3OGQyJ1xyXG4gICAgICAgIGNvbnN0IHBvc3RBcnJheTogc3RyaW5nW10gPSBbXSAvLyBBcnJheSBvZiBkYXRhIHRvIHBvc3RcclxuICAgICAgICBPYmplY3QuZW50cmllcyh2aWV3RGF0YSkuZm9yRWFjaCgoW2gsIHZdKSA9PiB7XHJcbiAgICAgICAgICAgIHBvc3RBcnJheS5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChoKSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudCh2KSlcclxuICAgICAgICB9KVxyXG4gICAgICAgIGZldGNoKHRydWUsIHBvc3RBcnJheS5qb2luKCcmJykpXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBsb2dvdXQoKTogdm9pZCB7XHJcbiAgICBpZiAoT2JqZWN0LmtleXModmlld0RhdGEpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBkZWxldGVDb29raWUoJ3VzZXJQYXNzJylcclxuICAgICAgICBlbGVtQnlJZCgnc2lkZUJhY2tncm91bmQnKS5jbGljaygpXHJcbiAgICAgICAgdmlld0RhdGEuX19FVkVOVFRBUkdFVCA9ICdjdGwwMCRjdGwwMCRiYXNlQ29udGVudCRMb2dvdXRDb250cm9sMSRMb2dpblN0YXR1czEkY3RsMDAnXHJcbiAgICAgICAgdmlld0RhdGEuX19FVkVOVEFSR1VNRU5UID0gJydcclxuICAgICAgICB2aWV3RGF0YS5jdGwwMF9jdGwwMF9iYXNlQ29udGVudF9iYXNlQ29udGVudF9mbGFzaFRvcF9jdGwwMF9SYWRTY2hlZHVsZXIxX0NsaWVudFN0YXRlID1cclxuICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoe3Njcm9sbFRvcDogMCwgc2Nyb2xsTGVmdDogMCwgaXNEaXJ0eTogZmFsc2V9KVxyXG4gICAgICAgIGNvbnN0IHBvc3RBcnJheTogc3RyaW5nW10gPSBbXSAvLyBBcnJheSBvZiBkYXRhIHRvIHBvc3RcclxuICAgICAgICBPYmplY3QuZW50cmllcyh2aWV3RGF0YSkuZm9yRWFjaCgoW2gsIHZdKSA9PiB7XHJcbiAgICAgICAgICAgIHBvc3RBcnJheS5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChoKSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudCh2KSlcclxuICAgICAgICB9KVxyXG4gICAgICAgIGZldGNoKHRydWUsIHBvc3RBcnJheS5qb2luKCcmJykpXHJcbiAgICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBhZGRBY3Rpdml0eUVsZW1lbnQsIGNyZWF0ZUFjdGl2aXR5IH0gZnJvbSAnLi4vY29tcG9uZW50cy9hY3Rpdml0eSdcclxuaW1wb3J0IHsgSUFzc2lnbm1lbnQgfSBmcm9tICcuLi9wY3InXHJcbmltcG9ydCB7IGxvY2FsU3RvcmFnZVJlYWQsIGxvY2FsU3RvcmFnZVdyaXRlIH0gZnJvbSAnLi4vdXRpbCdcclxuXHJcbmV4cG9ydCB0eXBlIEFjdGl2aXR5VHlwZSA9ICdkZWxldGUnIHwgJ2VkaXQnIHwgJ2FkZCdcclxuZXhwb3J0IHR5cGUgQWN0aXZpdHlJdGVtID0gW0FjdGl2aXR5VHlwZSwgSUFzc2lnbm1lbnQsIG51bWJlciwgc3RyaW5nIHwgdW5kZWZpbmVkXVxyXG5cclxuY29uc3QgQUNUSVZJVFlfU1RPUkFHRV9OQU1FID0gJ2FjdGl2aXR5J1xyXG5cclxubGV0IGFjdGl2aXR5OiBBY3Rpdml0eUl0ZW1bXSA9IGxvY2FsU3RvcmFnZVJlYWQoQUNUSVZJVFlfU1RPUkFHRV9OQU1FKSB8fCBbXVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFkZEFjdGl2aXR5KHR5cGU6IEFjdGl2aXR5VHlwZSwgYXNzaWdubWVudDogSUFzc2lnbm1lbnQsIGRhdGU6IERhdGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdBY3Rpdml0eTogYm9vbGVhbiwgY2xhc3NOYW1lPzogc3RyaW5nICk6IHZvaWQge1xyXG4gICAgaWYgKG5ld0FjdGl2aXR5KSBhY3Rpdml0eS5wdXNoKFt0eXBlLCBhc3NpZ25tZW50LCBEYXRlLm5vdygpLCBjbGFzc05hbWVdKVxyXG4gICAgY29uc3QgZWwgPSBjcmVhdGVBY3Rpdml0eSh0eXBlLCBhc3NpZ25tZW50LCBkYXRlLCBjbGFzc05hbWUpXHJcbiAgICBhZGRBY3Rpdml0eUVsZW1lbnQoZWwpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlQWN0aXZpdHkoKTogdm9pZCB7XHJcbiAgICBhY3Rpdml0eSA9IGFjdGl2aXR5LnNsaWNlKGFjdGl2aXR5Lmxlbmd0aCAtIDEyOCwgYWN0aXZpdHkubGVuZ3RoKVxyXG4gICAgbG9jYWxTdG9yYWdlV3JpdGUoQUNUSVZJVFlfU1RPUkFHRV9OQU1FLCBhY3Rpdml0eSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlY2VudEFjdGl2aXR5KCk6IEFjdGl2aXR5SXRlbVtdIHtcclxuICAgIHJldHVybiBhY3Rpdml0eS5zbGljZShhY3Rpdml0eS5sZW5ndGggLSAzMiwgYWN0aXZpdHkubGVuZ3RoKVxyXG59XHJcbiIsImltcG9ydCB7IGVsZW1CeUlkLCBsb2NhbFN0b3JhZ2VSZWFkLCBsb2NhbFN0b3JhZ2VXcml0ZSB9IGZyb20gJy4uL3V0aWwnXHJcblxyXG5jb25zdCBBVEhFTkFfU1RPUkFHRV9OQU1FID0gJ2F0aGVuYURhdGEnXHJcblxyXG5pbnRlcmZhY2UgSVJhd0F0aGVuYURhdGEge1xyXG4gICAgcmVzcG9uc2VfY29kZTogMjAwXHJcbiAgICBib2R5OiB7XHJcbiAgICAgICAgY291cnNlczoge1xyXG4gICAgICAgICAgICBjb3Vyc2VzOiBJUmF3Q291cnNlW11cclxuICAgICAgICAgICAgc2VjdGlvbnM6IElSYXdTZWN0aW9uW11cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwZXJtaXNzaW9uczogYW55XHJcbn1cclxuXHJcbmludGVyZmFjZSBJUmF3Q291cnNlIHtcclxuICAgIG5pZDogbnVtYmVyXHJcbiAgICBjb3Vyc2VfdGl0bGU6IHN0cmluZ1xyXG4gICAgLy8gVGhlcmUncyBhIGJ1bmNoIG1vcmUgdGhhdCBJJ3ZlIG9taXR0ZWRcclxufVxyXG5cclxuaW50ZXJmYWNlIElSYXdTZWN0aW9uIHtcclxuICAgIGNvdXJzZV9uaWQ6IG51bWJlclxyXG4gICAgbGluazogc3RyaW5nXHJcbiAgICBsb2dvOiBzdHJpbmdcclxuICAgIHNlY3Rpb25fdGl0bGU6IHN0cmluZ1xyXG4gICAgLy8gVGhlcmUncyBhIGJ1bmNoIG1vcmUgdGhhdCBJJ3ZlIG9taXR0ZWRcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJQXRoZW5hRGF0YUl0ZW0ge1xyXG4gICAgbGluazogc3RyaW5nXHJcbiAgICBsb2dvOiBzdHJpbmdcclxuICAgIHBlcmlvZDogc3RyaW5nXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUF0aGVuYURhdGEge1xyXG4gICAgW2Nsczogc3RyaW5nXTogSUF0aGVuYURhdGFJdGVtXHJcbn1cclxuXHJcbmxldCBhdGhlbmFEYXRhOiBJQXRoZW5hRGF0YXxudWxsID0gbG9jYWxTdG9yYWdlUmVhZChBVEhFTkFfU1RPUkFHRV9OQU1FKVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldEF0aGVuYURhdGEoKTogSUF0aGVuYURhdGF8bnVsbCB7XHJcbiAgICByZXR1cm4gYXRoZW5hRGF0YVxyXG59XHJcblxyXG5mdW5jdGlvbiBmb3JtYXRMb2dvKGxvZ286IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gbG9nby5zdWJzdHIoMCwgbG9nby5pbmRleE9mKCdcIiBhbHQ9XCInKSlcclxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKCc8ZGl2IGNsYXNzPVwicHJvZmlsZS1waWN0dXJlXCI+PGltZyBzcmM9XCInLCAnJylcclxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKCd0aW55JywgJ3JlZycpXHJcbn1cclxuXHJcbi8vIE5vdywgdGhlcmUncyB0aGUgc2Nob29sb2d5L2F0aGVuYSBpbnRlZ3JhdGlvbiBzdHVmZi4gRmlyc3QsIHdlIG5lZWQgdG8gY2hlY2sgaWYgaXQncyBiZWVuIG1vcmVcclxuLy8gdGhhbiBhIGRheS4gVGhlcmUncyBubyBwb2ludCBjb25zdGFudGx5IHJldHJpZXZpbmcgY2xhc3NlcyBmcm9tIEF0aGVuYTsgdGhleSBkb250J3QgY2hhbmdlIHRoYXRcclxuLy8gbXVjaC5cclxuXHJcbi8vIFRoZW4sIG9uY2UgdGhlIHZhcmlhYmxlIGZvciB0aGUgbGFzdCBkYXRlIGlzIGluaXRpYWxpemVkLCBpdCdzIHRpbWUgdG8gZ2V0IHRoZSBjbGFzc2VzIGZyb21cclxuLy8gYXRoZW5hLiBMdWNraWx5LCB0aGVyZSdzIHRoaXMgZmlsZSBhdCAvaWFwaS9jb3Vyc2UvYWN0aXZlIC0gYW5kIGl0J3MgaW4gSlNPTiEgTGlmZSBjYW4ndCBiZSBhbnlcclxuLy8gYmV0dGVyISBTZXJpb3VzbHkhIEl0J3MganVzdCB0b28gYmFkIHRoZSBsb2dpbiBwYWdlIGlzbid0IGluIEpTT04uXHJcbmZ1bmN0aW9uIHBhcnNlQXRoZW5hRGF0YShkYXQ6IHN0cmluZyk6IElBdGhlbmFEYXRhfG51bGwge1xyXG4gICAgaWYgKGRhdCA9PT0gJycpIHJldHVybiBudWxsXHJcbiAgICBjb25zdCBkID0gSlNPTi5wYXJzZShkYXQpIGFzIElSYXdBdGhlbmFEYXRhXHJcbiAgICBjb25zdCBhdGhlbmFEYXRhMjogSUF0aGVuYURhdGEgPSB7fVxyXG4gICAgY29uc3QgYWxsQ291cnNlRGV0YWlsczogeyBbbmlkOiBudW1iZXJdOiBJUmF3U2VjdGlvbiB9ID0ge31cclxuICAgIGQuYm9keS5jb3Vyc2VzLnNlY3Rpb25zLmZvckVhY2goKHNlY3Rpb24pID0+IHtcclxuICAgICAgICBhbGxDb3Vyc2VEZXRhaWxzW3NlY3Rpb24uY291cnNlX25pZF0gPSBzZWN0aW9uXHJcbiAgICB9KVxyXG4gICAgZC5ib2R5LmNvdXJzZXMuY291cnNlcy5yZXZlcnNlKCkuZm9yRWFjaCgoY291cnNlKSA9PiB7XHJcbiAgICAgICAgY29uc3QgY291cnNlRGV0YWlscyA9IGFsbENvdXJzZURldGFpbHNbY291cnNlLm5pZF1cclxuICAgICAgICBhdGhlbmFEYXRhMltjb3Vyc2UuY291cnNlX3RpdGxlXSA9IHtcclxuICAgICAgICAgICAgbGluazogYGh0dHBzOi8vYXRoZW5hLmhhcmtlci5vcmcke2NvdXJzZURldGFpbHMubGlua31gLFxyXG4gICAgICAgICAgICBsb2dvOiBmb3JtYXRMb2dvKGNvdXJzZURldGFpbHMubG9nbyksXHJcbiAgICAgICAgICAgIHBlcmlvZDogY291cnNlRGV0YWlscy5zZWN0aW9uX3RpdGxlXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICAgIHJldHVybiBhdGhlbmFEYXRhMlxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlQXRoZW5hRGF0YShkYXRhOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgIGNvbnN0IHJlZnJlc2hFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhdGhlbmFEYXRhUmVmcmVzaCcpXHJcbiAgICB0cnkge1xyXG4gICAgICAgIGF0aGVuYURhdGEgPSBwYXJzZUF0aGVuYURhdGEoZGF0YSlcclxuICAgICAgICBsb2NhbFN0b3JhZ2VXcml0ZShBVEhFTkFfU1RPUkFHRV9OQU1FLCBkYXRhKVxyXG4gICAgICAgIGVsZW1CeUlkKCdhdGhlbmFEYXRhRXJyb3InKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXHJcbiAgICAgICAgaWYgKHJlZnJlc2hFbCkgcmVmcmVzaEVsLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgZWxlbUJ5SWQoJ2F0aGVuYURhdGFFcnJvcicpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXHJcbiAgICAgICAgaWYgKHJlZnJlc2hFbCkgcmVmcmVzaEVsLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcclxuICAgICAgICBlbGVtQnlJZCgnYXRoZW5hRGF0YUVycm9yJykuaW5uZXJIVE1MID0gZS5tZXNzYWdlXHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgZ2V0RGF0YSwgSUFwcGxpY2F0aW9uRGF0YSwgSUFzc2lnbm1lbnQgfSBmcm9tICcuLi9wY3InXHJcbmltcG9ydCB7IGxvY2FsU3RvcmFnZVJlYWQsIGxvY2FsU3RvcmFnZVdyaXRlIH0gZnJvbSAnLi4vdXRpbCdcclxuXHJcbmNvbnN0IENVU1RPTV9TVE9SQUdFX05BTUUgPSAnZXh0cmEnXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElDdXN0b21Bc3NpZ25tZW50IHtcclxuICAgIGJvZHk6IHN0cmluZ1xyXG4gICAgZG9uZTogYm9vbGVhblxyXG4gICAgc3RhcnQ6IG51bWJlclxyXG4gICAgY2xhc3M6IHN0cmluZ3xudWxsXHJcbiAgICBlbmQ6IG51bWJlcnwnRm9yZXZlcidcclxufVxyXG5cclxuY29uc3QgZXh0cmE6IElDdXN0b21Bc3NpZ25tZW50W10gPSBsb2NhbFN0b3JhZ2VSZWFkKENVU1RPTV9TVE9SQUdFX05BTUUsIFtdKVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldEV4dHJhKCk6IElDdXN0b21Bc3NpZ25tZW50W10ge1xyXG4gICAgcmV0dXJuIGV4dHJhXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlRXh0cmEoKTogdm9pZCB7XHJcbiAgICBsb2NhbFN0b3JhZ2VXcml0ZShDVVNUT01fU1RPUkFHRV9OQU1FLCBleHRyYSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFkZFRvRXh0cmEoY3VzdG9tOiBJQ3VzdG9tQXNzaWdubWVudCk6IHZvaWQge1xyXG4gICAgZXh0cmEucHVzaChjdXN0b20pXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVGcm9tRXh0cmEoY3VzdG9tOiBJQ3VzdG9tQXNzaWdubWVudCk6IHZvaWQge1xyXG4gICAgaWYgKCFleHRyYS5pbmNsdWRlcyhjdXN0b20pKSB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCByZW1vdmUgY3VzdG9tIGFzc2lnbm1lbnQgdGhhdCBkb2VzIG5vdCBleGlzdCcpXHJcbiAgICBleHRyYS5zcGxpY2UoZXh0cmEuaW5kZXhPZihjdXN0b20pLCAxKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZXh0cmFUb1Rhc2soY3VzdG9tOiBJQ3VzdG9tQXNzaWdubWVudCwgZGF0YTogSUFwcGxpY2F0aW9uRGF0YSk6IElBc3NpZ25tZW50IHtcclxuICAgIGxldCBjbHM6IG51bWJlcnxudWxsID0gbnVsbFxyXG4gICAgY29uc3QgY2xhc3NOYW1lID0gY3VzdG9tLmNsYXNzXHJcbiAgICBpZiAoY2xhc3NOYW1lICE9IG51bGwpIHtcclxuICAgICAgICBjbHMgPSBkYXRhLmNsYXNzZXMuZmluZEluZGV4KChjKSA9PiBjLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoY2xhc3NOYW1lKSlcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHRpdGxlOiAnVGFzaycsXHJcbiAgICAgICAgYmFzZVR5cGU6ICd0YXNrJyxcclxuICAgICAgICB0eXBlOiAndGFzaycsXHJcbiAgICAgICAgYXR0YWNobWVudHM6IFtdLFxyXG4gICAgICAgIHN0YXJ0OiBjdXN0b20uc3RhcnQsXHJcbiAgICAgICAgZW5kOiBjdXN0b20uZW5kIHx8ICdGb3JldmVyJyxcclxuICAgICAgICBib2R5OiBjdXN0b20uYm9keSxcclxuICAgICAgICBpZDogYHRhc2ske2N1c3RvbS5ib2R5LnJlcGxhY2UoL1teXFx3XSovZywgJycpfSR7Y3VzdG9tLnN0YXJ0fSR7Y3VzdG9tLmVuZH0ke2N1c3RvbS5jbGFzc31gLFxyXG4gICAgICAgIGNsYXNzOiBjbHMgPT09IC0xID8gbnVsbCA6IGNsc1xyXG4gICAgfVxyXG59XHJcblxyXG5pbnRlcmZhY2UgSVBhcnNlUmVzdWx0IHtcclxuICAgIGNscz86IHN0cmluZ1xyXG4gICAgZHVlPzogc3RyaW5nXHJcbiAgICBzdD86IHN0cmluZ1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VDdXN0b21UYXNrKHRleHQ6IHN0cmluZywgcmVzdWx0OiBJUGFyc2VSZXN1bHQgPSB7fSk6IElQYXJzZVJlc3VsdCB7XHJcbiAgICBjb25zdCBwYXJzZWQgPSB0ZXh0Lm1hdGNoKC8oLiopIChmb3J8Ynl8ZHVlfGFzc2lnbmVkfHN0YXJ0aW5nfGVuZGluZ3xiZWdpbm5pbmcpICguKikvKVxyXG4gICAgaWYgKHBhcnNlZCA9PSBudWxsKSByZXR1cm4gcmVzdWx0XHJcblxyXG4gICAgc3dpdGNoIChwYXJzZWRbMl0pIHtcclxuICAgICAgICBjYXNlICdmb3InOiByZXN1bHQuY2xzID0gcGFyc2VkWzNdOyBicmVha1xyXG4gICAgICAgIGNhc2UgJ2J5JzogY2FzZSAnZHVlJzogY2FzZSAnZW5kaW5nJzogcmVzdWx0LmR1ZSA9IHBhcnNlZFszXTsgYnJlYWtcclxuICAgICAgICBjYXNlICdhc3NpZ25lZCc6IGNhc2UgJ3N0YXJ0aW5nJzogY2FzZSAnYmVnaW5uaW5nJzogcmVzdWx0LnN0ID0gcGFyc2VkWzNdOyBicmVha1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBwYXJzZUN1c3RvbVRhc2socGFyc2VkWzFdLCByZXN1bHQpXHJcbn1cclxuIiwiaW1wb3J0IHsgbG9jYWxTdG9yYWdlUmVhZCwgbG9jYWxTdG9yYWdlV3JpdGUgfSBmcm9tICcuLi91dGlsJ1xyXG5cclxuY29uc3QgRE9ORV9TVE9SQUdFX05BTUUgPSAnZG9uZSdcclxuXHJcbmNvbnN0IGRvbmU6IHN0cmluZ1tdID0gbG9jYWxTdG9yYWdlUmVhZChET05FX1NUT1JBR0VfTkFNRSwgW10pXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlRnJvbURvbmUoaWQ6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgY29uc3QgaW5kZXggPSBkb25lLmluZGV4T2YoaWQpXHJcbiAgICBpZiAoaW5kZXggPj0gMCkgZG9uZS5zcGxpY2UoaW5kZXgsIDEpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBhZGRUb0RvbmUoaWQ6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgZG9uZS5wdXNoKGlkKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2F2ZURvbmUoKTogdm9pZCB7XHJcbiAgICBsb2NhbFN0b3JhZ2VXcml0ZShET05FX1NUT1JBR0VfTkFNRSwgZG9uZSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFzc2lnbm1lbnRJbkRvbmUoaWQ6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIGRvbmUuaW5jbHVkZXMoaWQpXHJcbn1cclxuIiwiaW1wb3J0IHsgbG9jYWxTdG9yYWdlUmVhZCwgbG9jYWxTdG9yYWdlV3JpdGUgfSBmcm9tICcuLi91dGlsJ1xyXG5cclxuY29uc3QgTU9ESUZJRURfU1RPUkFHRV9OQU1FID0gJ21vZGlmaWVkJ1xyXG5cclxuaW50ZXJmYWNlIElNb2RpZmllZEJvZGllcyB7XHJcbiAgICBbaWQ6IHN0cmluZ106IHN0cmluZ1xyXG59XHJcblxyXG5jb25zdCBtb2RpZmllZDogSU1vZGlmaWVkQm9kaWVzID0gbG9jYWxTdG9yYWdlUmVhZChNT0RJRklFRF9TVE9SQUdFX05BTUUsIHt9KVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUZyb21Nb2RpZmllZChpZDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICBkZWxldGUgbW9kaWZpZWRbaWRdXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlTW9kaWZpZWQoKTogdm9pZCB7XHJcbiAgICBsb2NhbFN0b3JhZ2VXcml0ZShNT0RJRklFRF9TVE9SQUdFX05BTUUsIG1vZGlmaWVkKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYXNzaWdubWVudEluTW9kaWZpZWQoaWQ6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIG1vZGlmaWVkLmhhc093blByb3BlcnR5KGlkKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbW9kaWZpZWRCb2R5KGlkOiBzdHJpbmcpOiBzdHJpbmd8dW5kZWZpbmVkIHtcclxuICAgIHJldHVybiBtb2RpZmllZFtpZF1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNldE1vZGlmaWVkKGlkOiBzdHJpbmcsIGJvZHk6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgbW9kaWZpZWRbaWRdID0gYm9keVxyXG59XHJcbiIsImltcG9ydCB7IGxvY2FsU3RvcmFnZVJlYWQsIGxvY2FsU3RvcmFnZVdyaXRlIH0gZnJvbSAnLi91dGlsJ1xyXG5cclxudHlwZSBBc3NpZ25tZW50U3BhbiA9ICdtdWx0aXBsZScgfCAnc3RhcnQnIHwgJ2VuZCdcclxudHlwZSBIaWRlQXNzaWdubWVudHMgPSAnZGF5JyB8ICdtcycgfCAndXMnXHJcbnR5cGUgQ29sb3JUeXBlID0gJ2Fzc2lnbm1lbnQnIHwgJ2NsYXNzJ1xyXG5pbnRlcmZhY2UgSVNob3duQWN0aXZpdHkge1xyXG4gICAgYWRkOiBib29sZWFuXHJcbiAgICBlZGl0OiBib29sZWFuXHJcbiAgICBkZWxldGU6IGJvb2xlYW5cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHNldHRpbmdzID0ge1xyXG4gICAgLyoqXHJcbiAgICAgKiBNaW51dGVzIGJldHdlZW4gZWFjaCBhdXRvbWF0aWMgcmVmcmVzaCBvZiB0aGUgcGFnZS4gTmVnYXRpdmUgbnVtYmVycyBpbmRpY2F0ZSBubyBhdXRvbWF0aWNcclxuICAgICAqIHJlZnJlc2hpbmcuXHJcbiAgICAgKi9cclxuICAgIGdldCByZWZyZXNoUmF0ZSgpOiBudW1iZXIgeyByZXR1cm4gbG9jYWxTdG9yYWdlUmVhZCgncmVmcmVzaFJhdGUnLCAtMSkgfSxcclxuICAgIHNldCByZWZyZXNoUmF0ZSh2OiBudW1iZXIpIHsgbG9jYWxTdG9yYWdlV3JpdGUoJ3JlZnJlc2hSYXRlJywgdikgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIFdoZXRoZXIgdGhlIHdpbmRvdyBzaG91bGQgcmVmcmVzaCBhc3NpZ25tZW50IGRhdGEgd2hlbiBmb2N1c3NlZFxyXG4gICAgICovXHJcbiAgICBnZXQgcmVmcmVzaE9uRm9jdXMoKTogYm9vbGVhbiB7IHJldHVybiBsb2NhbFN0b3JhZ2VSZWFkKCdyZWZyZXNoT25Gb2N1cycsIHRydWUpIH0sXHJcbiAgICBzZXQgcmVmcmVzaE9uRm9jdXModjogYm9vbGVhbikgeyBsb2NhbFN0b3JhZ2VXcml0ZSgncmVmcmVzaE9uRm9jdXMnLCB2KSB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogV2hldGhlciBzd2l0Y2hpbmcgYmV0d2VlbiB2aWV3cyBzaG91bGQgYmUgYW5pbWF0ZWRcclxuICAgICAqL1xyXG4gICAgZ2V0IHZpZXdUcmFucygpOiBib29sZWFuIHsgcmV0dXJuIGxvY2FsU3RvcmFnZVJlYWQoJ3ZpZXdUcmFucycsIHRydWUpIH0sXHJcbiAgICBzZXQgdmlld1RyYW5zKHY6IGJvb2xlYW4pIHsgbG9jYWxTdG9yYWdlV3JpdGUoJ3ZpZXdUcmFucycsIHYpIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBOdW1iZXIgb2YgZGF5cyBlYXJseSB0byBzaG93IHRlc3RzIGluIGxpc3Qgdmlld1xyXG4gICAgICovXHJcbiAgICBnZXQgZWFybHlUZXN0KCk6IG51bWJlciB7IHJldHVybiBsb2NhbFN0b3JhZ2VSZWFkKCdlYXJseVRlc3QnLCAxKSB9LFxyXG4gICAgc2V0IGVhcmx5VGVzdCh2OiBudW1iZXIpIHsgbG9jYWxTdG9yYWdlV3JpdGUoJ2Vhcmx5VGVzdCcsIHYpIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBXaGV0aGVyIHRvIHRha2UgdGFza3Mgb2ZmIHRoZSBjYWxlbmRhciB2aWV3IGFuZCBzaG93IHRoZW0gaW4gdGhlIGluZm8gcGFuZVxyXG4gICAgICovXHJcbiAgICBnZXQgc2VwVGFza3MoKTogYm9vbGVhbiB7IHJldHVybiBsb2NhbFN0b3JhZ2VSZWFkKCdzZXBUYXNrcycsIGZhbHNlKSB9LFxyXG4gICAgc2V0IHNlcFRhc2tzKHY6IGJvb2xlYW4pIHsgbG9jYWxTdG9yYWdlV3JpdGUoJ3NlcFRhc2tzJywgdikgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIFdoZXRoZXIgdGFza3Mgc2hvdWxkIGhhdmUgdGhlaXIgb3duIGNvbG9yXHJcbiAgICAgKi9cclxuICAgIGdldCBzZXBUYXNrQ2xhc3MoKTogYm9vbGVhbiB7IHJldHVybiBsb2NhbFN0b3JhZ2VSZWFkKCdzZXBUYXNrQ2xhc3MnLCBmYWxzZSkgfSxcclxuICAgIHNldCBzZXBUYXNrQ2xhc3ModjogYm9vbGVhbikgeyBsb2NhbFN0b3JhZ2VXcml0ZSgnc2VwVGFza0NsYXNzJywgdikgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIFdoZXRoZXIgcHJvamVjdHMgc2hvdyB1cCBpbiB0aGUgdGVzdCBwYWdlXHJcbiAgICAgKi9cclxuICAgIGdldCBwcm9qZWN0c0luVGVzdFBhbmUoKTogYm9vbGVhbiB7IHJldHVybiBsb2NhbFN0b3JhZ2VSZWFkKCdwcm9qZWN0c0luVGVzdFBhbmUnLCBmYWxzZSkgfSxcclxuICAgIHNldCBwcm9qZWN0c0luVGVzdFBhbmUodjogYm9vbGVhbikgeyBsb2NhbFN0b3JhZ2VXcml0ZSgncHJvamVjdHNJblRlc3RQYW5lJywgdikgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIFdoZW4gYXNzaWdubWVudHMgc2hvdWxkIGJlIHNob3duIG9uIGNhbGVuZGFyIHZpZXdcclxuICAgICAqL1xyXG4gICAgZ2V0IGFzc2lnbm1lbnRTcGFuKCk6IEFzc2lnbm1lbnRTcGFuIHsgcmV0dXJuIGxvY2FsU3RvcmFnZVJlYWQoJ2Fzc2lnbm1lbnRTcGFuJywgJ211bHRpcGxlJykgfSxcclxuICAgIHNldCBhc3NpZ25tZW50U3Bhbih2OiBBc3NpZ25tZW50U3BhbikgeyBsb2NhbFN0b3JhZ2VXcml0ZSgnYXNzaWdubWVudFNwYW4nLCB2KSB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogV2hlbiBhc3NpZ25tZW50cyBzaG91bGQgZGlzYXBwZWFyIGZyb20gbGlzdCB2aWV3XHJcbiAgICAgKi9cclxuICAgIGdldCBoaWRlQXNzaWdubWVudHMoKTogSGlkZUFzc2lnbm1lbnRzIHsgcmV0dXJuIGxvY2FsU3RvcmFnZVJlYWQoJ2hpZGVBc3NpZ25tZW50cycsICdkYXknKSB9LFxyXG4gICAgc2V0IGhpZGVBc3NpZ25tZW50cyh2OiBIaWRlQXNzaWdubWVudHMpIHsgbG9jYWxTdG9yYWdlV3JpdGUoJ2hpZGVBc3NpZ25tZW50cycsIHYpIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBXaGV0aGVyIHRvIHVzZSBob2xpZGF5IHRoZW1pbmdcclxuICAgICAqL1xyXG4gICAgZ2V0IGhvbGlkYXlUaGVtZXMoKTogYm9vbGVhbiB7IHJldHVybiBsb2NhbFN0b3JhZ2VSZWFkKCdob2xpZGF5VGhlbWVzJywgZmFsc2UpIH0sXHJcbiAgICBzZXQgaG9saWRheVRoZW1lcyh2OiBib29sZWFuKSB7IGxvY2FsU3RvcmFnZVdyaXRlKCdob2xpZGF5VGhlbWVzJywgdikgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIFdoZXRoZXIgdG8gY29sb3IgYXNzaWdubWVudHMgYmFzZWQgb24gdGhlaXIgdHlwZSBvciBjbGFzc1xyXG4gICAgICovXHJcbiAgICBnZXQgY29sb3JUeXBlKCk6IENvbG9yVHlwZSB7IHJldHVybiBsb2NhbFN0b3JhZ2VSZWFkKCdjb2xvclR5cGUnLCAnYXNzaWdubWVudCcpIH0sXHJcbiAgICBzZXQgY29sb3JUeXBlKHY6IENvbG9yVHlwZSkgeyBsb2NhbFN0b3JhZ2VXcml0ZSgnY29sb3JUeXBlJywgdikgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIFdoaWNoIHR5cGVzIG9mIGFjdGl2aXR5IGFyZSBzaG93biBpbiB0aGUgYWN0aXZpdHkgcGFuZVxyXG4gICAgICovXHJcbiAgICBnZXQgc2hvd25BY3Rpdml0eSgpOiBJU2hvd25BY3Rpdml0eSB7IHJldHVybiBsb2NhbFN0b3JhZ2VSZWFkKCdzaG93bkFjdGl2aXR5Jywge1xyXG4gICAgICAgIGFkZDogdHJ1ZSxcclxuICAgICAgICBlZGl0OiB0cnVlLFxyXG4gICAgICAgIGRlbGV0ZTogdHJ1ZVxyXG4gICAgfSkgfSxcclxuICAgIHNldCBzaG93bkFjdGl2aXR5KHY6IElTaG93bkFjdGl2aXR5KSB7IGxvY2FsU3RvcmFnZVdyaXRlKCdzaG93bkFjdGl2aXR5JywgdikgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIFdoZXRoZXIgdG8gZGlzcGxheSB0YXNrcyBpbiB0aGUgdGFzayBwYW5lIHRoYXQgYXJlIGNvbXBsZXRlZFxyXG4gICAgICovXHJcbiAgICBnZXQgc2hvd0RvbmVUYXNrcygpOiBib29sZWFuIHsgcmV0dXJuIGxvY2FsU3RvcmFnZVJlYWQoJ3Nob3dEb25lVGFza3MnLCBmYWxzZSkgfSxcclxuICAgIHNldCBzaG93RG9uZVRhc2tzKHY6IGJvb2xlYW4pIHsgbG9jYWxTdG9yYWdlV3JpdGUoJ3Nob3dEb25lVGFza3MnLCB2KSB9XHJcbn1cclxuIiwiaW1wb3J0IHsgZnJvbURhdGVOdW0sIHRvRGF0ZU51bSB9IGZyb20gJy4vZGF0ZXMnXHJcblxyXG4vLyBAdHMtaWdub3JlIFRPRE86IE1ha2UgdGhpcyBsZXNzIGhhY2t5XHJcbk5vZGVMaXN0LnByb3RvdHlwZS5mb3JFYWNoID0gSFRNTENvbGxlY3Rpb24ucHJvdG90eXBlLmZvckVhY2ggPSBBcnJheS5wcm90b3R5cGUuZm9yRWFjaFxyXG5cclxuLyoqXHJcbiAqIEZvcmNlcyBhIGxheW91dCBvbiBhbiBlbGVtZW50XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZm9yY2VMYXlvdXQoZWw6IEhUTUxFbGVtZW50KTogdm9pZCB7XHJcbiAgICAvLyBUaGlzIGludm9sdmVzIGEgbGl0dGxlIHRyaWNrZXJ5IGluIHRoYXQgYnkgcmVxdWVzdGluZyB0aGUgY29tcHV0ZWQgaGVpZ2h0IG9mIHRoZSBlbGVtZW50IHRoZVxyXG4gICAgLy8gYnJvd3NlciBpcyBmb3JjZWQgdG8gZG8gYSBmdWxsIGxheW91dFxyXG5cclxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtZXhwcmVzc2lvblxyXG4gICAgZWwub2Zmc2V0SGVpZ2h0XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZXR1cm4gYSBzdHJpbmcgd2l0aCB0aGUgZmlyc3QgbGV0dGVyIGNhcGl0YWxpemVkXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gY2FwaXRhbGl6ZVN0cmluZyhzdHI6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gc3RyLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc3RyLnN1YnN0cigxKVxyXG59XHJcblxyXG4vKipcclxuICogUmV0dXJucyBhbiBYTUxIdHRwUmVxdWVzdCB3aXRoIHRoZSBzcGVjaWZpZWQgdXJsLCByZXNwb25zZSB0eXBlLCBoZWFkZXJzLCBhbmQgZGF0YVxyXG4gKi9cclxuZnVuY3Rpb24gY29uc3RydWN0WE1MSHR0cFJlcXVlc3QodXJsOiBzdHJpbmcsIHJlc3BUeXBlPzogWE1MSHR0cFJlcXVlc3RSZXNwb25zZVR5cGV8bnVsbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVycz86IHtbbmFtZTogc3RyaW5nXTogc3RyaW5nfXxudWxsLCBkYXRhPzogc3RyaW5nfG51bGwpOiBYTUxIdHRwUmVxdWVzdCB7XHJcbiAgICBjb25zdCByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKVxyXG5cclxuICAgIC8vIElmIFBPU1QgZGF0YSBpcyBwcm92aWRlZCBzZW5kIGEgUE9TVCByZXF1ZXN0LCBvdGhlcndpc2Ugc2VuZCBhIEdFVCByZXF1ZXN0XHJcbiAgICByZXEub3BlbigoZGF0YSA/ICdQT1NUJyA6ICdHRVQnKSwgdXJsLCB0cnVlKVxyXG5cclxuICAgIGlmIChyZXNwVHlwZSkgcmVxLnJlc3BvbnNlVHlwZSA9IHJlc3BUeXBlXHJcblxyXG4gICAgaWYgKGhlYWRlcnMpIHtcclxuICAgICAgICBPYmplY3Qua2V5cyhoZWFkZXJzKS5mb3JFYWNoKChoZWFkZXIpID0+IHtcclxuICAgICAgICAgICAgcmVxLnNldFJlcXVlc3RIZWFkZXIoaGVhZGVyLCBoZWFkZXJzW2hlYWRlcl0pXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICAvLyBJZiBkYXRhIGlzIHVuZGVmaW5lZCBkZWZhdWx0IHRvIHRoZSBub3JtYWwgcmVxLnNlbmQoKSwgb3RoZXJ3aXNlIHBhc3MgdGhlIGRhdGEgaW5cclxuICAgIHJlcS5zZW5kKGRhdGEpXHJcbiAgICByZXR1cm4gcmVxXHJcbn1cclxuXHJcbi8qKiBTZW5kcyBhIHJlcXVlc3QgdG8gYSBzZXJ2ZXIgYW5kIHJldHVybnMgYSBQcm9taXNlLlxyXG4gKiBAcGFyYW0gdXJsIHRoZSB1cmwgdG8gcmV0cmlldmVcclxuICogQHBhcmFtIHJlc3BUeXBlIHRoZSB0eXBlIG9mIHJlc3BvbnNlIHRoYXQgc2hvdWxkIGJlIHJlY2VpdmVkXHJcbiAqIEBwYXJhbSBoZWFkZXJzIHRoZSBoZWFkZXJzIHRoYXQgd2lsbCBiZSBzZW50IHRvIHRoZSBzZXJ2ZXJcclxuICogQHBhcmFtIGRhdGEgdGhlIGRhdGEgdGhhdCB3aWxsIGJlIHNlbnQgdG8gdGhlIHNlcnZlciAob25seSBmb3IgUE9TVCByZXF1ZXN0cylcclxuICogQHBhcmFtIHByb2dyZXNzRWxlbWVudCBhbiBvcHRpb25hbCBlbGVtZW50IGZvciB0aGUgcHJvZ3Jlc3MgYmFyIHVzZWQgdG8gZGlzcGxheSB0aGUgc3RhdHVzIG9mIHRoZSByZXF1ZXN0XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gc2VuZCh1cmw6IHN0cmluZywgcmVzcFR5cGU/OiBYTUxIdHRwUmVxdWVzdFJlc3BvbnNlVHlwZXxudWxsLCBoZWFkZXJzPzoge1tuYW1lOiBzdHJpbmddOiBzdHJpbmd9fG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgIGRhdGE/OiBzdHJpbmd8bnVsbCwgcHJvZ3Jlc3M/OiBIVE1MRWxlbWVudHxudWxsKTogUHJvbWlzZTxYTUxIdHRwUmVxdWVzdD4ge1xyXG5cclxuICAgIGNvbnN0IHJlcSA9IGNvbnN0cnVjdFhNTEh0dHBSZXF1ZXN0KHVybCwgcmVzcFR5cGUsIGhlYWRlcnMsIGRhdGEpXHJcblxyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHJcbiAgICAgICAgY29uc3QgcHJvZ3Jlc3NJbm5lciA9IHByb2dyZXNzID8gcHJvZ3Jlc3MucXVlcnlTZWxlY3RvcignZGl2JykgOiBudWxsXHJcbiAgICAgICAgaWYgKHByb2dyZXNzICYmIHByb2dyZXNzSW5uZXIpIHtcclxuICAgICAgICAgICAgZm9yY2VMYXlvdXQocHJvZ3Jlc3NJbm5lcikgLy8gV2FpdCBmb3IgaXQgdG8gcmVuZGVyXHJcbiAgICAgICAgICAgIHByb2dyZXNzLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpIC8vIERpc3BsYXkgdGhlIHByb2dyZXNzIGJhclxyXG4gICAgICAgICAgICBpZiAocHJvZ3Jlc3NJbm5lci5jbGFzc0xpc3QuY29udGFpbnMoJ2RldGVybWluYXRlJykpIHtcclxuICAgICAgICAgICAgICAgIHByb2dyZXNzSW5uZXIuY2xhc3NMaXN0LnJlbW92ZSgnZGV0ZXJtaW5hdGUnKVxyXG4gICAgICAgICAgICAgICAgcHJvZ3Jlc3NJbm5lci5jbGFzc0xpc3QuYWRkKCdpbmRldGVybWluYXRlJylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gU29tZXRpbWVzIHRoZSBicm93c2VyIHdvbid0IGdpdmUgdGhlIHRvdGFsIGJ5dGVzIGluIHRoZSByZXNwb25zZSwgc28gdXNlIHBhc3QgcmVzdWx0cyBvclxyXG4gICAgICAgIC8vIGEgZGVmYXVsdCBvZiAxNzAsMDAwIGJ5dGVzIGlmIHRoZSBicm93c2VyIGRvZXNuJ3QgcHJvdmlkZSB0aGUgbnVtYmVyXHJcbiAgICAgICAgY29uc3QgbG9hZCA9IE51bWJlcihsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnbG9hZCcpKSB8fCAxNzAwMDBcclxuICAgICAgICBsZXQgY29tcHV0ZWRMb2FkID0gMFxyXG5cclxuICAgICAgICByZXEuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIChldnQpID0+IHtcclxuICAgICAgICAgICAgLy8gQ2FjaGUgdGhlIG51bWJlciBvZiBieXRlcyBsb2FkZWQgc28gaXQgY2FuIGJlIHVzZWQgZm9yIGJldHRlciBlc3RpbWF0ZXMgbGF0ZXIgb25cclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2xvYWQnLCBTdHJpbmcoY29tcHV0ZWRMb2FkKSlcclxuICAgICAgICAgICAgaWYgKHByb2dyZXNzKSBwcm9ncmVzcy5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gICAgICAgICAgICAvLyBSZXNvbHZlIHdpdGggdGhlIHJlcXVlc3RcclxuICAgICAgICAgICAgaWYgKHJlcS5zdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShyZXEpXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoRXJyb3IocmVxLnN0YXR1c1RleHQpKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgcmVxLmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAocHJvZ3Jlc3MpIHByb2dyZXNzLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgICAgICAgICAgIHJlamVjdChFcnJvcignTmV0d29yayBFcnJvcicpKVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIGlmIChwcm9ncmVzcyAmJiBwcm9ncmVzc0lubmVyKSB7XHJcbiAgICAgICAgICAgIHJlcS5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIChldnQpID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIFVwZGF0ZSB0aGUgcHJvZ3Jlc3MgYmFyXHJcbiAgICAgICAgICAgICAgICBpZiAocHJvZ3Jlc3NJbm5lci5jbGFzc0xpc3QuY29udGFpbnMoJ2luZGV0ZXJtaW5hdGUnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb2dyZXNzSW5uZXIuY2xhc3NMaXN0LnJlbW92ZSgnaW5kZXRlcm1pbmF0ZScpXHJcbiAgICAgICAgICAgICAgICAgICAgcHJvZ3Jlc3NJbm5lci5jbGFzc0xpc3QuYWRkKCdkZXRlcm1pbmF0ZScpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb21wdXRlZExvYWQgPSBldnQubG9hZGVkXHJcbiAgICAgICAgICAgICAgICBwcm9ncmVzc0lubmVyLnN0eWxlLndpZHRoID0gKCgxMDAgKiBldnQubG9hZGVkKSAvIChldnQubGVuZ3RoQ29tcHV0YWJsZSA/IGV2dC50b3RhbCA6IGxvYWQpKSArICclJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBUaGUgZXF1aXZhbGVudCBvZiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCBidXQgdGhyb3dzIGFuIGVycm9yIGlmIHRoZSBlbGVtZW50IGlzIG5vdCBkZWZpbmVkXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZWxlbUJ5SWQoaWQ6IHN0cmluZyk6IEhUTUxFbGVtZW50IHtcclxuICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpXHJcbiAgICBpZiAoZWwgPT0gbnVsbCkgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCBlbGVtZW50IHdpdGggaWQgJHtpZH1gKVxyXG4gICAgcmV0dXJuIGVsXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBIGxpdHRsZSBoZWxwZXIgZnVuY3Rpb24gdG8gc2ltcGxpZnkgdGhlIGNyZWF0aW9uIG9mIEhUTUwgZWxlbWVudHNcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBlbGVtZW50KHRhZzogc3RyaW5nLCBjbHM6IHN0cmluZ3xzdHJpbmdbXSwgaHRtbD86IHN0cmluZ3xudWxsLCBpZD86IHN0cmluZ3xudWxsKTogSFRNTEVsZW1lbnQge1xyXG4gICAgY29uc3QgZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnKVxyXG5cclxuICAgIGlmICh0eXBlb2YgY2xzID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgIGUuY2xhc3NMaXN0LmFkZChjbHMpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNscy5mb3JFYWNoKChjKSA9PiBlLmNsYXNzTGlzdC5hZGQoYykpXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGh0bWwpIGUuaW5uZXJIVE1MID0gaHRtbFxyXG4gICAgaWYgKGlkKSBlLnNldEF0dHJpYnV0ZSgnaWQnLCBpZClcclxuXHJcbiAgICByZXR1cm4gZVxyXG59XHJcblxyXG4vKipcclxuICogVGhyb3dzIGFuIGVycm9yIGlmIHRoZSBzdXBwbGllZCBhcmd1bWVudCBpcyBudWxsLCBvdGhlcndpc2UgcmV0dXJucyB0aGUgYXJndW1lbnRcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBfJDxUPihhcmc6IFR8bnVsbCk6IFQge1xyXG4gICAgaWYgKGFyZyA9PSBudWxsKSB0aHJvdyBuZXcgRXJyb3IoJ0V4cGVjdGVkIGFyZ3VtZW50IHRvIGJlIG5vbi1udWxsJylcclxuICAgIHJldHVybiBhcmdcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF8kaChhcmc6IE5vZGV8RXZlbnRUYXJnZXR8bnVsbCk6IEhUTUxFbGVtZW50IHtcclxuICAgIGlmIChhcmcgPT0gbnVsbCkgdGhyb3cgbmV3IEVycm9yKCdFeHBlY3RlZCBub2RlIHRvIGJlIG5vbi1udWxsJylcclxuICAgIHJldHVybiBhcmcgYXMgSFRNTEVsZW1lbnRcclxufVxyXG5cclxuLy8gQmVjYXVzZSBzb21lIGxvY2FsU3RvcmFnZSBlbnRyaWVzIGNhbiBiZWNvbWUgY29ycnVwdGVkIGR1ZSB0byBlcnJvciBzaWRlIGVmZmVjdHMsIHRoZSBiZWxvd1xyXG4vLyBtZXRob2QgdHJpZXMgdG8gcmVhZCBhIHZhbHVlIGZyb20gbG9jYWxTdG9yYWdlIGFuZCBoYW5kbGVzIGVycm9ycy5cclxuZXhwb3J0IGZ1bmN0aW9uIGxvY2FsU3RvcmFnZVJlYWQobmFtZTogc3RyaW5nKTogYW55XHJcbmV4cG9ydCBmdW5jdGlvbiBsb2NhbFN0b3JhZ2VSZWFkPFI+KG5hbWU6IHN0cmluZywgZGVmYXVsdFZhbDogKCkgPT4gUik6IFJcclxuZXhwb3J0IGZ1bmN0aW9uIGxvY2FsU3RvcmFnZVJlYWQ8VD4obmFtZTogc3RyaW5nLCBkZWZhdWx0VmFsOiBUKTogVFxyXG5leHBvcnQgZnVuY3Rpb24gbG9jYWxTdG9yYWdlUmVhZChuYW1lOiBzdHJpbmcsIGRlZmF1bHRWYWw/OiBhbnkpOiBhbnkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2VbbmFtZV0pXHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBkZWZhdWx0VmFsID09PSAnZnVuY3Rpb24nID8gZGVmYXVsdFZhbCgpIDogZGVmYXVsdFZhbFxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbG9jYWxTdG9yYWdlV3JpdGUobmFtZTogc3RyaW5nLCBpdGVtOiBhbnkpOiB2b2lkIHtcclxuICAgIGxvY2FsU3RvcmFnZVtuYW1lXSA9IEpTT04uc3RyaW5naWZ5KGl0ZW0pXHJcbn1cclxuXHJcbmludGVyZmFjZSBJZGxlRGVhZGxpbmUge1xyXG4gICAgZGlkVGltZW91dDogYm9vbGVhblxyXG4gICAgdGltZVJlbWFpbmluZzogKCkgPT4gbnVtYmVyXHJcbn1cclxuXHJcbi8vIEJlY2F1c2UgdGhlIHJlcXVlc3RJZGxlQ2FsbGJhY2sgZnVuY3Rpb24gaXMgdmVyeSBuZXcgKGFzIG9mIHdyaXRpbmcgb25seSB3b3JrcyB3aXRoIENocm9tZVxyXG4vLyB2ZXJzaW9uIDQ3KSwgdGhlIGJlbG93IGZ1bmN0aW9uIHBvbHlmaWxscyB0aGF0IG1ldGhvZC5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlcXVlc3RJZGxlQ2FsbGJhY2soY2I6IChkZWFkbGluZTogSWRsZURlYWRsaW5lKSA9PiB2b2lkLCBvcHRzOiB7IHRpbWVvdXQ6IG51bWJlcn0pOiBudW1iZXIge1xyXG4gICAgaWYgKCdyZXF1ZXN0SWRsZUNhbGxiYWNrJyBpbiB3aW5kb3cpIHtcclxuICAgICAgICByZXR1cm4gKHdpbmRvdyBhcyBhbnkpLnJlcXVlc3RJZGxlQ2FsbGJhY2soY2IsIG9wdHMpXHJcbiAgICB9XHJcbiAgICBjb25zdCBzdGFydCA9IERhdGUubm93KClcclxuXHJcbiAgICByZXR1cm4gc2V0VGltZW91dCgoKSA9PiBjYih7XHJcbiAgICAgICAgZGlkVGltZW91dDogZmFsc2UsXHJcbiAgICAgICAgdGltZVJlbWFpbmluZygpOiBudW1iZXIge1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5tYXgoMCwgNTAgLSAoRGF0ZS5ub3coKSAtIHN0YXJ0KSlcclxuICAgICAgICB9XHJcbiAgICB9KSwgMSlcclxufVxyXG5cclxuLyoqXHJcbiAqIERldGVybWluZSBpZiB0aGUgdHdvIGRhdGVzIGhhdmUgdGhlIHNhbWUgeWVhciwgbW9udGgsIGFuZCBkYXlcclxuICovXHJcbmZ1bmN0aW9uIGRhdGVzRXF1YWwoYTogRGF0ZSwgYjogRGF0ZSk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRvRGF0ZU51bShhKSA9PT0gdG9EYXRlTnVtKGIpXHJcbn1cclxuXHJcbmNvbnN0IERBVEVfUkVMQVRJVkVOQU1FUzoge1tuYW1lOiBzdHJpbmddOiBudW1iZXJ9ID0ge1xyXG4gICAgJ1RvbW9ycm93JzogMSxcclxuICAgICdUb2RheSc6IDAsXHJcbiAgICAnWWVzdGVyZGF5JzogLTEsXHJcbiAgICAnMiBkYXlzIGFnbyc6IC0yXHJcbn1cclxuY29uc3QgV0VFS0RBWVMgPSBbJ1N1bmRheScsICdNb25kYXknLCAnVHVlc2RheScsICdXZWRuZXNkYXknLCAnVGh1cnNkYXknLCAnRnJpZGF5JywgJ1NhdHVyZGF5J11cclxuY29uc3QgRlVMTE1PTlRIUyA9IFsnSmFudWFyeScsICdGZWJydWFyeScsICdNYXJjaCcsICdBcHJpbCcsICdNYXknLCAnSnVuZScsICdKdWx5JywgJ0F1Z3VzdCcsICdTZXB0ZW1iZXInLCAnT2N0b2JlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgJ05vdmVtYmVyJywgJ0RlY2VtYmVyJ11cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkYXRlU3RyaW5nKGRhdGU6IERhdGV8bnVtYmVyfCdGb3JldmVyJywgYWRkVGhpczogYm9vbGVhbiA9IGZhbHNlKTogc3RyaW5nIHtcclxuICAgIGlmIChkYXRlID09PSAnRm9yZXZlcicpIHJldHVybiBkYXRlXHJcbiAgICBpZiAodHlwZW9mIGRhdGUgPT09ICdudW1iZXInKSByZXR1cm4gZGF0ZVN0cmluZyhmcm9tRGF0ZU51bShkYXRlKSwgYWRkVGhpcylcclxuXHJcbiAgICBjb25zdCByZWxhdGl2ZU1hdGNoID0gT2JqZWN0LmtleXMoREFURV9SRUxBVElWRU5BTUVTKS5maW5kKChuYW1lKSA9PiB7XHJcbiAgICAgICAgY29uc3QgZGF5QXQgPSBuZXcgRGF0ZSgpXHJcbiAgICAgICAgZGF5QXQuc2V0RGF0ZShkYXlBdC5nZXREYXRlKCkgKyBEQVRFX1JFTEFUSVZFTkFNRVNbbmFtZV0pXHJcbiAgICAgICAgcmV0dXJuIGRhdGVzRXF1YWwoZGF5QXQsIGRhdGUpXHJcbiAgICB9KVxyXG4gICAgaWYgKHJlbGF0aXZlTWF0Y2gpIHJldHVybiByZWxhdGl2ZU1hdGNoXHJcblxyXG4gICAgY29uc3QgZGF5c0FoZWFkID0gKGRhdGUuZ2V0VGltZSgpIC0gRGF0ZS5ub3coKSkgLyAxMDAwIC8gMzYwMCAvIDI0XHJcblxyXG4gICAgLy8gSWYgdGhlIGRhdGUgaXMgd2l0aGluIDYgZGF5cyBvZiB0b2RheSwgb25seSBkaXNwbGF5IHRoZSBkYXkgb2YgdGhlIHdlZWtcclxuICAgIGlmICgwIDwgZGF5c0FoZWFkICYmIGRheXNBaGVhZCA8PSA2KSB7XHJcbiAgICAgICAgcmV0dXJuIChhZGRUaGlzID8gJ1RoaXMgJyA6ICcnKSArIFdFRUtEQVlTW2RhdGUuZ2V0RGF5KCldXHJcbiAgICB9XHJcbiAgICByZXR1cm4gYCR7V0VFS0RBWVNbZGF0ZS5nZXREYXkoKV19LCAke0ZVTExNT05USFNbZGF0ZS5nZXRNb250aCgpXX0gJHtkYXRlLmdldERhdGUoKX1gXHJcbn1cclxuXHJcbi8vIFRoZSBvbmUgYmVsb3cgc2Nyb2xscyBzbW9vdGhseSB0byBhIHkgcG9zaXRpb24uXHJcbmV4cG9ydCBmdW5jdGlvbiBzbW9vdGhTY3JvbGwodG86IG51bWJlcik6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICBsZXQgc3RhcnQ6IG51bWJlcnxudWxsID0gbnVsbFxyXG4gICAgICAgIGNvbnN0IGZyb20gPSBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcFxyXG4gICAgICAgIGNvbnN0IGFtb3VudCA9IHRvIC0gZnJvbVxyXG4gICAgICAgIGNvbnN0IHN0ZXAgPSAodGltZXN0YW1wOiBudW1iZXIpID0+IHtcclxuICAgICAgICAgICAgaWYgKHN0YXJ0ID09IG51bGwpIHsgc3RhcnQgPSB0aW1lc3RhbXAgfVxyXG4gICAgICAgICAgICBjb25zdCBwcm9ncmVzcyA9IHRpbWVzdGFtcCAtIHN0YXJ0XHJcbiAgICAgICAgICAgIHdpbmRvdy5zY3JvbGxUbygwLCBmcm9tICsgKGFtb3VudCAqIChwcm9ncmVzcyAvIDM1MCkpKVxyXG4gICAgICAgICAgICBpZiAocHJvZ3Jlc3MgPCAzNTApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RlcClcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIF8kKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ25hdicpKS5jbGFzc0xpc3QucmVtb3ZlKCdoZWFkcm9vbS0tdW5waW5uZWQnKVxyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0ZXApXHJcbiAgICB9KVxyXG59XHJcblxyXG4vLyBBbmQgYSBmdW5jdGlvbiB0byBhcHBseSBhbiBpbmsgZWZmZWN0XHJcbmV4cG9ydCBmdW5jdGlvbiByaXBwbGUoZWw6IEhUTUxFbGVtZW50KTogdm9pZCB7XHJcbiAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCAoZXZ0KSA9PiB7XHJcbiAgICAgICAgaWYgKGV2dC53aGljaCAhPT0gMSkgcmV0dXJuIC8vIE5vdCBsZWZ0IGJ1dHRvblxyXG4gICAgICAgIGNvbnN0IHdhdmUgPSBlbGVtZW50KCdzcGFuJywgJ3dhdmUnKVxyXG4gICAgICAgIGNvbnN0IHNpemUgPSBNYXRoLm1heChOdW1iZXIoZWwub2Zmc2V0V2lkdGgpLCBOdW1iZXIoZWwub2Zmc2V0SGVpZ2h0KSlcclxuICAgICAgICB3YXZlLnN0eWxlLndpZHRoID0gKHdhdmUuc3R5bGUuaGVpZ2h0ID0gc2l6ZSArICdweCcpXHJcblxyXG4gICAgICAgIGxldCB4ID0gZXZ0LmNsaWVudFhcclxuICAgICAgICBsZXQgeSA9IGV2dC5jbGllbnRZXHJcbiAgICAgICAgY29uc3QgcmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXHJcbiAgICAgICAgeCAtPSByZWN0LmxlZnRcclxuICAgICAgICB5IC09IHJlY3QudG9wXHJcblxyXG4gICAgICAgIHdhdmUuc3R5bGUudG9wID0gKHkgLSAoc2l6ZSAvIDIpKSArICdweCdcclxuICAgICAgICB3YXZlLnN0eWxlLmxlZnQgPSAoeCAtIChzaXplIC8gMikpICsgJ3B4J1xyXG4gICAgICAgIGVsLmFwcGVuZENoaWxkKHdhdmUpXHJcbiAgICAgICAgd2F2ZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtaG9sZCcsIFN0cmluZyhEYXRlLm5vdygpKSlcclxuICAgICAgICBmb3JjZUxheW91dCh3YXZlKVxyXG4gICAgICAgIHdhdmUuc3R5bGUudHJhbnNmb3JtID0gJ3NjYWxlKDIuNSknXHJcbiAgICB9KVxyXG4gICAgZWwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIChldnQpID0+IHtcclxuICAgICAgICBpZiAoZXZ0LndoaWNoICE9PSAxKSByZXR1cm4gLy8gT25seSBmb3IgbGVmdCBidXR0b25cclxuICAgICAgICBjb25zdCB3YXZlcyA9IGVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3dhdmUnKVxyXG4gICAgICAgIHdhdmVzLmZvckVhY2goKHdhdmUpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgZGlmZiA9IERhdGUubm93KCkgLSBOdW1iZXIod2F2ZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtaG9sZCcpKVxyXG4gICAgICAgICAgICBjb25zdCBkZWxheSA9IE1hdGgubWF4KDM1MCAtIGRpZmYsIDApXHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgKHdhdmUgYXMgSFRNTEVsZW1lbnQpLnN0eWxlLm9wYWNpdHkgPSAnMCdcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHdhdmUucmVtb3ZlKClcclxuICAgICAgICAgICAgICAgIH0sIDU1MClcclxuICAgICAgICAgICAgfSwgZGVsYXkpXHJcbiAgICAgICAgfSlcclxuICAgIH0pXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjc3NOdW1iZXIoY3NzOiBzdHJpbmd8bnVsbCk6IG51bWJlciB7XHJcbiAgICBpZiAoIWNzcykgcmV0dXJuIDBcclxuICAgIHJldHVybiBwYXJzZUludChjc3MsIDEwKVxyXG59XHJcbiIsImltcG9ydCB7IGRvbG9naW4sIGZldGNoIH0gZnJvbSAnLi9wY3InXHJcbmltcG9ydCB7IHVwZGF0ZUF0aGVuYURhdGEgfSBmcm9tICcuL3BsdWdpbnMvYXRoZW5hJ1xyXG5pbXBvcnQgeyBfJGgsIGVsZW1CeUlkIH0gZnJvbSAnLi91dGlsJ1xyXG5cclxuLy8gV2VsY29tZSB0byB0aGUgd2VsY29tZSBmaWxlLlxyXG4vL1xyXG4vLyBUaGlzIHNjcmlwdCBydW5zIG9uIHRoZSB3ZWxjb21lIHBhZ2UsIHdoaWNoIHdlbGNvbWVzIG5ldyB1c2VycywgdG8gbWFrZSBpdCBtb3JlIHdlbGNvbWluZy4gSWYgeW91XHJcbi8vIGhhdmVuJ3QgYWxyZWFkeSwgSSB3ZWxjb21lIHlvdSB0byB2aWV3IHRoZSBtb3JlIGltcG9ydGFudCBbbWFpbiBzY3JpcHRdKGNsaWVudC5saXRjb2ZmZWUpLlxyXG4vL1xyXG4vLyBBbHNvLCBpZiB5b3UgaGF2ZW4ndCBub3RpY2VkIHlldCwgSSdtIHRyeWluZyBteSBiZXN0IHRvIHVzZSB0aGUgd29yZCB3ZWxjb21lIGFzIG1hbnkgdGltZXMgYXMgSVxyXG4vLyBjYW4ganVzdCB0byB3ZWxjb21lIHlvdS5cclxuLy9cclxuLy8gRmlyc3Qgb2ZmLCB0aGUgYnV0dG9ucyBiaWcsIGdyZWVuLCB3ZWxjb21pbmcgYnV0dG9ucyBvbiB0aGUgYm90dG9tIG9mIHRoZSB3ZWxjb21lIHBhZ2UgYXJlXHJcbi8vIGFzc2lnbmVkIGV2ZW50IGxpc3RlbmVycyBzbyB0aGF0IHRoZXkgY2FuIG1ha2UgdGhlIHBhZ2Ugc2hvdyBtb3JlIHdlbGNvbWluZyBpbmZvcm1hdGlvbi5cclxuZnVuY3Rpb24gYWR2YW5jZSgpOiB2b2lkIHtcclxuICAgIC8vIFRoZSBib3ggaG9sZGluZyB0aGUgaW5kaXZpZHVhbCBwYWdlcyB0aGF0IGdlIHNjcm9sbGVkXHJcbiAgICAvLyB3aGVuIHByZXNzaW5nIHRoZSAnbmV4dCcgYnV0dG9uIGlzIGFzc2lnbmVkIHRvIGEgdmFyaWFsYmUuXHJcbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5ib2R5XHJcbiAgICAvLyBzaG93IHRoZSBuZXh0IHBhZ2VcclxuICAgIGNvbnN0IHZpZXcgPSBOdW1iZXIoY29udGFpbmVyLmdldEF0dHJpYnV0ZSgnZGF0YS12aWV3JykpXHJcbiAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgMCkgLy8gU2NvbGwgdG8gdG9wIG9mIHRoZSBwYWdlXHJcbiAgICBoaXN0b3J5LnB1c2hTdGF0ZSh7cGFnZTogdmlldyArIDF9LCAnJywgYD9wYWdlPSR7dmlld31gKSAvLyBNYWtlIHRoZSBicm9zd2VyIHJlZ2lzdGVyIGEgcGFnZSBzaGlmdFxyXG5cclxuICAgIGNvbnN0IG5wYWdlID0gXyRoKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYHNlY3Rpb246bnRoLWNoaWxkKCR7dmlldyArIDJ9KWApKVxyXG4gICAgbnBhZ2Uuc3R5bGUuZGlzcGxheSA9ICdpbmxpbmUtYmxvY2snXHJcbiAgICBucGFnZS5zdHlsZS50cmFuc2Zvcm0gPSBucGFnZS5zdHlsZS53ZWJraXRUcmFuc2Zvcm0gPSBgdHJhbnNsYXRlWCgke3ZpZXcgKiAxMDB9JSlgXHJcbiAgICAvLyBpbmNyZWFzZSB0aGUgZGF0YS12aWV3IGF0dHJpYnV0ZSBieSAxLiBUaGUgcmVzdCBpcyBoYW5kbGVkIGJ5IHRoZSBjc3MuXHJcbiAgICBjb250YWluZXIuc2V0QXR0cmlidXRlKCdkYXRhLXZpZXcnLCBTdHJpbmcodmlldyArIDEpKVxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgLy8gQWZ0ZXIgYW5pbWF0aW5nIGlzIGRvbmUsIGRvbid0IGRpc3BsYXkgdGhlIGZpcnN0IHBhZ2VcclxuICAgICAgICBucGFnZS5zdHlsZS50cmFuc2Zvcm0gPSBucGFnZS5zdHlsZS53ZWJraXRUcmFuc2Zvcm0gPSBgdHJhbnNsYXRlWCgke3ZpZXcgKyAxfTAwJSlgXHJcbiAgICAgICAgXyRoKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYHNlY3Rpb246bnRoLWNoaWxkKCR7dmlldyArIDF9KWApKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXHJcbiAgICB9LCA1MClcclxufVxyXG5cclxuZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm5leHQnKS5mb3JFYWNoKChuZXh0QnV0dG9uKSA9PiB7XHJcbiAgICBuZXh0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYWR2YW5jZSlcclxufSlcclxuXHJcbi8vIEFkZGl0aW9uYWxseSwgdGhlIGFjdGl2ZSBjbGFzcyBuZWVkcyB0byBiZSBhZGRlZCB3aGVuIHRleHQgZmllbGRzIGFyZSBzZWxlY3RlZCAoZm9yIHRoZSBsb2dpblxyXG4vLyBib3gpIFtjb3BpZWQgZnJvbSBtYWluIHNjcmlwdF0uXHJcbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W3R5cGU9dGV4dF0sIGlucHV0W3R5cGU9cGFzc3dvcmRdLCBpbnB1dFt0eXBlPWVtYWlsXSwgaW5wdXRbdHlwZT11cmxdLCAnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICsgJ2lucHV0W3R5cGU9dGVsXSwgaW5wdXRbdHlwZT1udW1iZXJdLCBpbnB1dFt0eXBlPXNlYXJjaF0nKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuZm9yRWFjaCgoaW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQpID0+IHtcclxuICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChldnQpID0+IF8kaChfJGgoaW5wdXQucGFyZW50Tm9kZSkucXVlcnlTZWxlY3RvcignbGFiZWwnKSkuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJykpXHJcbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsIChldnQpID0+IF8kaChfJGgoaW5wdXQucGFyZW50Tm9kZSkucXVlcnlTZWxlY3RvcignbGFiZWwnKSkuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJykpXHJcbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgKGV2dCkgPT4ge1xyXG4gICAgICAgIGlmIChpbnB1dC52YWx1ZS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgXyRoKF8kaChpbnB1dC5wYXJlbnROb2RlKS5xdWVyeVNlbGVjdG9yKCdsYWJlbCcpKS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbn0pXHJcblxyXG4vLyBBbiBldmVudCBsaXN0ZW5lciBpcyBhdHRhY2hlZCB0byB0aGUgd2luZG93IHNvIHRoYXQgd2hlbiB0aGUgYmFjayBidXR0b24gaXMgcHJlc3NlZCwgYSBtb3JlXHJcbi8vIHdlbGNvbWluZyBwYWdlIGlzIGRpc3BsYXllZC4gTW9zdCBvZiB0aGUgY29kZSBpcyB0aGUgc2FtZSBmcm9tIG5leHQgYnV0dG9uIGV2ZW50IGxpc3RlbmVyLCBleGNlcHRcclxuLy8gdGhhdCB0aGUgcGFnZSBpcyBzd2l0Y2hlZCB0aGUgcHJldmlvdXMgb25lLCBub3QgdGhlIG5leHQgb25lLlxyXG53aW5kb3cub25wb3BzdGF0ZSA9IChldmVudCkgPT4ge1xyXG4gICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuYm9keVxyXG4gICAgY29uc3QgdmlldyA9IChldmVudC5zdGF0ZSAhPSBudWxsKSA/IGV2ZW50LnN0YXRlLnBhZ2UgOiAwXHJcbiAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgMCkgLy8gU2NvbGwgdG8gdG9wIG9mIHRoZSBwYWdlXHJcblxyXG4gICAgY29uc3QgbnBhZ2UgPSBfJGgoZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihgc2VjdGlvbjpudGgtY2hpbGQoJHt2aWV3ICsgMX0pYCkpXHJcbiAgICBucGFnZS5zdHlsZS5kaXNwbGF5ID0gJ2lubGluZS1ibG9jaydcclxuICAgIG5wYWdlLnN0eWxlLnRyYW5zZm9ybSA9IG5wYWdlLnN0eWxlLndlYmtpdFRyYW5zZm9ybSA9IGB0cmFuc2xhdGVYKCR7dmlldyAqIDEwMH0lKWBcclxuICAgIC8vIGluY3JlYXNlIHRoZSBkYXRhLXZpZXcgYXR0cmlidXRlIGJ5IDEuIFRoZSByZXN0IGlzIGhhbmRsZWQgYnkgdGhlIGNzcy5cclxuICAgIGNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoJ2RhdGEtdmlldycsIHZpZXcpXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAvLyBBZnRlciBhbmltYXRpbmcgaXMgZG9uZSwgZG9uJ3QgZGlzcGxheSB0aGUgZmlyc3QgcGFnZVxyXG4gICAgICAgIG5wYWdlLnN0eWxlLnRyYW5zZm9ybSA9IG5wYWdlLnN0eWxlLndlYmtpdFRyYW5zZm9ybSA9IGB0cmFuc2xhdGVYKCR7dmlld30wMCUpYFxyXG4gICAgICAgIF8kaChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBzZWN0aW9uOm50aC1jaGlsZCgke3ZpZXcgKyAyfSlgKSkuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xyXG4gICAgfSwgNTApXHJcbn1cclxuXHJcbi8vIFRoZSB0ZXh0IGJveCBhbHNvIG5lZWRzIHRvIGV4ZWN1dGUgdGhpcyBmdW5jdGlvbiB3aGVuIGFueXRoaW5nIGlzIHR5cGVkIC8gcGFzdGVkLlxyXG5jb25zdCBhdGhlbmFEYXRhRWwgPSBlbGVtQnlJZCgnYXRoZW5hRGF0YScpIGFzIEhUTUxJbnB1dEVsZW1lbnRcclxuYXRoZW5hRGF0YUVsLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKCkgPT4gdXBkYXRlQXRoZW5hRGF0YShhdGhlbmFEYXRhRWwudmFsdWUpKVxyXG5cclxuZmV0Y2godHJ1ZSwgdW5kZWZpbmVkLCAoKSA9PiB7XHJcbiAgICBlbGVtQnlJZCgnbG9naW5OZXh0Jykuc3R5bGUuZGlzcGxheSA9ICcnXHJcbiAgICBlbGVtQnlJZCgnbG9naW4nKS5jbGFzc0xpc3QuYWRkKCdkb25lJylcclxufSwgKCkgPT4ge1xyXG4gICAgZWxlbUJ5SWQoJ2xvZ2luJykuY2xhc3NMaXN0LmFkZCgncmVhZHknKVxyXG4gICAgZWxlbUJ5SWQoJ2xvZ2luJykuYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgKGV2dCkgPT4ge1xyXG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgZG9sb2dpbihudWxsLCB0cnVlLCBhZHZhbmNlKVxyXG4gICAgfSlcclxufSlcclxuXHJcbmZ1bmN0aW9uIGNsb3NlRXJyb3IoKTogdm9pZCB7XHJcbiAgICBlbGVtQnlJZCgnZXJyb3InKS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgZWxlbUJ5SWQoJ2Vycm9yQmFja2dyb3VuZCcpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcclxuICAgIH0sIDM1MClcclxufVxyXG5cclxuZWxlbUJ5SWQoJ2Vycm9yTm8nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsb3NlRXJyb3IpXHJcbmVsZW1CeUlkKCdlcnJvckJhY2tncm91bmQnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsb3NlRXJyb3IpXHJcbiJdLCJzb3VyY2VSb290IjoiIn0=