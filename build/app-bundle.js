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
/******/ 	return __webpack_require__(__webpack_require__.s = 17);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return forceLayout; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return capitalizeString; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "o", function() { return send; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return elemById; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return element; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return _$; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return _$h; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return localStorageRead; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return localStorageWrite; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "m", function() { return requestIdleCallback; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return dateString; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "l", function() { return monthString; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "p", function() { return smoothScroll; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "n", function() { return ripple; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return cssNumber; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return animateEl; });
/* harmony import */ var _dates__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

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
    if (!localStorage.hasOwnProperty(name)) {
        return typeof defaultVal === 'function' ? defaultVal() : defaultVal;
    }
    try {
        return JSON.parse(localStorage.getItem(name));
    }
    catch (e) {
        return typeof defaultVal === 'function' ? defaultVal() : defaultVal;
    }
}
function localStorageWrite(name, item) {
    localStorage.setItem(name, JSON.stringify(item));
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
    return Object(_dates__WEBPACK_IMPORTED_MODULE_0__[/* toDateNum */ "c"])(a) === Object(_dates__WEBPACK_IMPORTED_MODULE_0__[/* toDateNum */ "c"])(b);
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
        return dateString(Object(_dates__WEBPACK_IMPORTED_MODULE_0__[/* fromDateNum */ "a"])(date), addThis);
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
        return monthString(Object(_dates__WEBPACK_IMPORTED_MODULE_0__[/* fromDateNum */ "a"])(date));
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
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export tzoff */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return toDateNum; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return fromDateNum; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return today; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return iterDays; });
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
/* 2 */,
/* 3 */,
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return state; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return getStateItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return incrementState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return decrementState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return zeroDateOffsets; });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);

class CachedState {
    constructor(value) {
        this.value = value;
    }
    set(value) { this.value = value; }
    get() { return this.value; }
}
/**
 * Back a given state to localStorage
 */
function storedState(name, statevar) {
    console.log(name, statevar.get());
    statevar.set(Object(_util__WEBPACK_IMPORTED_MODULE_0__[/* localStorageRead */ "j"])(name, () => statevar.get()));
    return {
        get() { return statevar.get(); },
        set(value) {
            Object(_util__WEBPACK_IMPORTED_MODULE_0__[/* localStorageWrite */ "k"])(name, value);
            return statevar.set(value);
        },
        localSet(value) {
            return statevar.set(value);
        },
        revert() {
            statevar.set(Object(_util__WEBPACK_IMPORTED_MODULE_0__[/* localStorageRead */ "j"])(name, () => statevar.get()));
        },
        forceUpdate() {
            Object(_util__WEBPACK_IMPORTED_MODULE_0__[/* localStorageWrite */ "k"])(name, statevar.get());
        }
    };
}
const state = window.state = {
    /** Offset from today of the date displayed in list view */
    listDateOffset: new CachedState(0),
    /** Offset from today of the month displayed in calendar view */
    calDateOffset: new CachedState(0),
    /** Data fetched from PCR */
    data: storedState('data', new CachedState(undefined)),
    /** The last time an update was attempted from PCR (irregardless of success) */
    lastTriedUpdate: new CachedState(0),
    /** The last time data was succesfully fetched from PCR */
    lastUpdate: storedState('lastUpdate', new CachedState(0)),
    /** Recorded changes to assignments */
    activity: storedState('activity', new CachedState([])),
    /** Data on classes */
    athenaData: storedState('athenaData', new CachedState(null)),
    /** Assignments marked as done */
    done: storedState('done', new CachedState([])),
    /** Modifications made to assignments */
    modified: storedState('modified', new CachedState({})),
    /** The last fetched commit to the news gist */
    lastNewsCommit: storedState('newsCommit', new CachedState(null)),
    /** The detected url to the news gist */
    newsUrl: new CachedState(null),
    //////////////////////////////////
    //           Settings           //
    //////////////////////////////////
    /**
     * Minutes between each automatic refresh of the page. Negative numbers indicate no automatic
     * refreshing.
     */
    refreshRate: storedState('refreshRate', new CachedState(-1)),
    /**
     * Whether the window should refresh assignment data when focussed
     */
    refreshOnFocus: storedState('refreshOnFocus', new CachedState(true)),
    /**
     * Whether switching between views should be animated
     */
    viewTrans: storedState('viewTrans', new CachedState(true)),
    /**
     * Number of days early to show tests in list view
     */
    earlyTest: storedState('earlyTest', new CachedState(1)),
    /**
     * Whether to take tasks off the calendar view and show them in the info pane
     */
    sepTasks: storedState('sepTasks', new CachedState(false)),
    /**
     * Whether tasks should have their own color
     */
    sepTaskClass: storedState('sepTaskClass', new CachedState(false)),
    /**
     * Whether projects show up in the test page
     */
    projectsInTestPane: storedState('projectsInTestPane', new CachedState(false)),
    /**
     * When assignments should be shown on calendar view
     */
    assignmentSpan: storedState('assignmentSpan', new CachedState('multiple')),
    /**
     * When assignments should disappear from list view
     */
    hideAssignments: storedState('hideAssignments', new CachedState('day')),
    /**
     * Whether to use holiday theming
     */
    holidayThemes: storedState('holidayThemes', new CachedState(false)),
    /**
     * Whether to color assignments based on their type or class
     */
    colorType: storedState('colorType', new CachedState('assignment')),
    /**
     * Which types of activity are shown in the activity pane
     */
    shownActivity: storedState('shownActivity', new CachedState({
        add: true,
        edit: true,
        delete: true
    })),
    /**
     * Whether to display tasks in the task pane that are completed
     */
    showDoneTasks: storedState('showDoneTasks', new CachedState(false))
};
function getStateItem(name) {
    if (!state.hasOwnProperty(name))
        throw new Error(`Invalid state property ${name}`);
    // @ts-ignore
    return state[name];
}
/////////////////////////////////////////
//           Generic helpers           //
/////////////////////////////////////////
function incrementState(statevar) {
    statevar.set(statevar.get() + 1);
}
function decrementState(statevar) {
    statevar.set(statevar.get() - 1);
}
//////////////////////////////////////////
//           Specific helpers           //
//////////////////////////////////////////
function zeroDateOffsets() {
    state.listDateOffset.set(0);
    state.calDateOffset.set(0);
}


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXTERNAL MODULE: ./src/components/assignment.ts
var components_assignment = __webpack_require__(11);

// EXTERNAL MODULE: ./src/dates.ts
var dates = __webpack_require__(1);

// EXTERNAL MODULE: ./src/util.ts
var util = __webpack_require__(0);

// CONCATENATED MODULE: ./src/components/calendar.ts


const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function createWeek(id) {
    const wk = Object(util["h" /* element */])('section', 'week', null, id);
    const dayTable = Object(util["h" /* element */])('table', 'dayTable');
    const tr = dayTable.insertRow();
    // tslint:disable-next-line no-loops
    for (let day = 0; day < 7; day++)
        tr.insertCell();
    wk.appendChild(dayTable);
    return wk;
}
function createDay(d) {
    const day = Object(util["h" /* element */])('div', 'day', null, 'day');
    day.setAttribute('data-date', String(d.getTime()));
    if (Math.floor((d.getTime() - d.getTimezoneOffset()) / 1000 / 3600 / 24) === Object(dates["d" /* today */])()) {
        day.classList.add('today');
    }
    const month = Object(util["h" /* element */])('span', 'month', MONTHS[d.getMonth()]);
    day.appendChild(month);
    const date = Object(util["h" /* element */])('span', 'date', String(d.getDate()));
    day.appendChild(date);
    return day;
}

// EXTERNAL MODULE: ./src/components/errorDisplay.ts
var errorDisplay = __webpack_require__(14);

// EXTERNAL MODULE: ./src/components/resizer.ts
var resizer = __webpack_require__(8);

// EXTERNAL MODULE: ./src/pcr.ts + 2 modules
var pcr = __webpack_require__(6);

// EXTERNAL MODULE: ./src/plugins/activity.ts + 1 modules
var activity = __webpack_require__(12);

// EXTERNAL MODULE: ./src/plugins/customAssignments.ts
var customAssignments = __webpack_require__(10);

// EXTERNAL MODULE: ./src/plugins/done.ts
var done = __webpack_require__(7);

// EXTERNAL MODULE: ./src/plugins/modifiedAssignments.ts
var modifiedAssignments = __webpack_require__(9);

// EXTERNAL MODULE: ./src/state.ts
var state = __webpack_require__(4);

// CONCATENATED MODULE: ./src/display.ts
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return getScroll; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return getTimeAfter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return display; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return formatUpdate; });












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
let display_scroll = 0; // The location to scroll to in order to reach today in calendar view
function getScroll() {
    return display_scroll;
}
function getTimeAfter(date) {
    const hideAssignments = state["d" /* state */].hideAssignments.get();
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
        const month = (new Date()).getMonth() + state["d" /* state */].calDateOffset.get();
        // Make sure the start and end dates lie within the month
        const start = new Date(Math.max(Object(dates["a" /* fromDateNum */])(startN).getTime(), (new Date(year, month)).getTime()));
        // If the day argument for Date is 0, then the resulting date will be of the previous month
        const end = new Date(Math.min(Object(dates["a" /* fromDateNum */])(endN).getTime(), (new Date(year, month + 1, 0)).getTime()));
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
    if (state["d" /* state */].assignmentSpan.get() === 'multiple') {
        const s = Math.max(start.getTime(), Object(dates["a" /* fromDateNum */])(assignment.start).getTime());
        const e = assignment.end === 'Forever' ? s : Math.min(end.getTime(), Object(dates["a" /* fromDateNum */])(assignment.end).getTime());
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
    else if (state["d" /* state */].assignmentSpan.get() === 'start') {
        const s = Object(dates["a" /* fromDateNum */])(assignment.start);
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
    else if (state["d" /* state */].assignmentSpan.get() === 'end') {
        const e = assignment.end === 'Forever' ? assignment.end : Object(dates["a" /* fromDateNum */])(assignment.end);
        const de = e === 'Forever' ? Object(dates["a" /* fromDateNum */])(assignment.start) : e;
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
        const data = state["d" /* state */].data.get();
        if (!data) {
            throw new Error('Data should have been fetched before display() was called');
        }
        document.body.setAttribute('data-pcrview', data.monthView ? 'month' : 'other');
        const main = Object(util["a" /* _$ */])(document.querySelector('main'));
        const taken = {};
        const timeafter = getTimeAfter(new Date());
        const { start, end } = getStartEndDates(data);
        // Set the start date to be a Sunday and the end date to be a Saturday
        start.setDate(start.getDate() - start.getDay());
        end.setDate(end.getDate() + (6 - end.getDay()));
        // First populate the calendar with boxes for each day
        // Only consider the previous set of assignments for activity purposes if the month is the same
        const lastData = data.monthOffset === 0 ? Object(util["j" /* localStorageRead */])('data') : null;
        let wk = null;
        Object(dates["b" /* iterDays */])(start, end, (d) => {
            if (d.getDay() === 0) {
                const id = `wk${d.getMonth()}-${d.getDate()}`; // Don't create a new week element if one already exists
                wk = document.getElementById(id);
                if (wk == null) {
                    wk = createWeek(id);
                    main.appendChild(wk);
                }
            }
            if (!wk)
                throw new Error(`Expected week element on day ${d} to not be null`);
            if (wk.getElementsByClassName('day').length <= d.getDay()) {
                wk.appendChild(createDay(d));
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
                        Object(activity["a" /* addActivity */])('edit', oldAssignment, new Date(), true, oldAssignment.class != null ? lastData.classes[oldAssignment.class] : undefined);
                        Object(modifiedAssignments["c" /* removeFromModified */])(assignment.id); // If the assignment is modified, reset it
                    }
                    lastData.assignments.splice(lastData.assignments.indexOf(oldAssignment), 1);
                }
                else {
                    Object(activity["a" /* addActivity */])('add', assignment, new Date(), true);
                }
            }
        });
        if (lastData != null) {
            // Check if any of the last assignments weren't deleted (so they have been deleted in PCR)
            lastData.assignments.forEach((assignment) => {
                Object(activity["a" /* addActivity */])('delete', assignment, new Date(), true, assignment.class != null ? lastData.classes[assignment.class] : undefined);
                Object(done["c" /* removeFromDone */])(assignment.id);
                Object(modifiedAssignments["c" /* removeFromModified */])(assignment.id);
            });
            // Then save a maximum of 128 activity items
            Object(activity["c" /* saveActivity */])();
            // And completed assignments + modifications
            Object(done["d" /* saveDone */])();
            Object(modifiedAssignments["d" /* saveModified */])();
        }
        // Add custom assignments to the split array
        Object(customAssignments["c" /* getExtra */])().forEach((custom) => {
            split.push(...getAssignmentSplits(Object(customAssignments["b" /* extraToTask */])(custom, data), start, end, custom));
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
            const weekId = Object(components_assignment["b" /* computeWeekId */])(s);
            wk = document.getElementById(weekId);
            if (wk == null)
                return;
            const e = Object(components_assignment["c" /* createAssignment */])(s, data);
            // Calculate how many assignments are placed before the current one
            if (!s.custom || !state["d" /* state */].sepTasks.get()) {
                let pos = 0;
                // tslint:disable-next-line no-loops
                while (true) {
                    let found = true;
                    Object(dates["b" /* iterDays */])(s.start, s.end === 'Forever' ? s.start : s.end, (d) => {
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
                Object(dates["b" /* iterDays */])(s.start, s.end === 'Forever' ? s.start : s.end, (d) => {
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
            if (s.assignment.end >= Object(dates["d" /* today */])() && (s.assignment.baseType === 'test' ||
                (state["d" /* state */].projectsInTestPane.get() && s.assignment.baseType === 'longterm'))) {
                const te = Object(util["h" /* element */])('div', ['upcomingTest', 'assignmentItem', s.assignment.baseType], `<i class='material-icons'>
                                        ${s.assignment.baseType === 'longterm' ? 'assignment' : 'assessment'}
                                    </i>
                                    <span class='title'>${s.assignment.title}</span>
                                    <small>${Object(components_assignment["f" /* separatedClass */])(s.assignment, data)[2]}</small>
                                    <div class='range'>${Object(util["f" /* dateString */])(s.assignment.end, true)}</div>`, `test${s.assignment.id}`);
                if (s.assignment.class)
                    te.setAttribute('data-class', data.classes[s.assignment.class]);
                te.addEventListener('click', () => {
                    const doScrolling = async () => {
                        await Object(util["p" /* smoothScroll */])((e.getBoundingClientRect().top + document.body.scrollTop) - 116);
                        e.click();
                    };
                    if (document.body.getAttribute('data-view') === '0') {
                        doScrolling();
                    }
                    else {
                        Object(util["a" /* _$ */])(document.querySelector('#navTabs>li:first-child')).click();
                        setTimeout(doScrolling, 500);
                    }
                });
                if (Object(done["b" /* assignmentInDone */])(s.assignment.id)) {
                    te.classList.add('done');
                }
                const testElem = document.getElementById(`test${s.assignment.id}`);
                if (testElem) {
                    testElem.innerHTML = te.innerHTML;
                }
                else {
                    Object(util["g" /* elemById */])('infoTests').appendChild(te);
                }
            }
            const already = document.getElementById(s.assignment.id + weekId);
            if (already != null) { // Assignment already exists
                already.style.marginTop = e.style.marginTop;
                already.setAttribute('data-class', s.custom && state["d" /* state */].sepTaskClass.get() ? 'Task' : Object(pcr["a" /* classById */])(s.assignment.class));
                if (!Object(modifiedAssignments["a" /* assignmentInModified */])(s.assignment.id)) {
                    already.getElementsByClassName('body')[0].innerHTML = e.getElementsByClassName('body')[0].innerHTML;
                }
                Object(util["a" /* _$ */])(already.querySelector('.edits')).className = Object(util["a" /* _$ */])(e.querySelector('.edits')).className;
                if (already.classList.toggle) {
                    already.classList.toggle('listDisp', e.classList.contains('listDisp'));
                }
                Object(components_assignment["d" /* getES */])(already).forEach((cl) => already.classList.remove(cl));
                Object(components_assignment["d" /* getES */])(e).forEach((cl) => already.classList.add(cl));
                WEEKEND_CLASSNAMES.forEach((cl) => {
                    already.classList.remove(cl);
                    if (e.classList.contains(cl))
                        already.classList.add(cl);
                });
            }
            else {
                if (s.custom && state["d" /* state */].sepTasks.get()) {
                    const st = Math.floor(s.start.getTime() / 1000 / 3600 / 24);
                    if ((s.assignment.start === st) &&
                        (s.assignment.end === 'Forever' || s.assignment.end >= Object(dates["d" /* today */])())) {
                        e.classList.remove('assignment');
                        e.classList.add('taskPaneItem');
                        e.style.order = String(s.assignment.end === 'Forever' ? Number.MAX_VALUE : s.assignment.end);
                        const link = e.querySelector('.linked');
                        if (link) {
                            e.insertBefore(Object(util["h" /* element */])('small', [], link.innerHTML), link);
                            link.remove();
                        }
                        Object(util["g" /* elemById */])('infoTasksInner').appendChild(e);
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
                Object(util["g" /* elemById */])('background').classList.remove('active');
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
            display_scroll = (h * 30) + 112 + 14;
            // Also show the day headers if today's date is displayed in the first row of the calendar
            if (display_scroll < 50)
                display_scroll = 0;
            if (doScroll && (document.body.getAttribute('data-view') === '0') &&
                !document.body.querySelector('.full')) {
                // in calendar view
                window.scrollTo(0, display_scroll);
            }
        }
        document.body.classList.toggle('noList', document.querySelectorAll('.assignment.listDisp:not(.done)').length === 0);
        if (document.body.getAttribute('data-view') === '1') { // in list view
            Object(resizer["b" /* resize */])();
        }
    }
    catch (err) {
        Object(errorDisplay["a" /* displayError */])(err);
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
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXTERNAL MODULE: ./src/components/avatar.ts
var avatar = __webpack_require__(16);

// EXTERNAL MODULE: ./src/components/errorDisplay.ts
var errorDisplay = __webpack_require__(14);

// EXTERNAL MODULE: ./src/util.ts
var util = __webpack_require__(0);

// CONCATENATED MODULE: ./src/components/snackbar.ts
/**
 * All this is responsible for is creating snackbars.
 */

function snackbar(message, action, f) {
    const snack = Object(util["h" /* element */])('div', 'snackbar');
    const snackInner = Object(util["h" /* element */])('div', 'snackInner', message);
    snack.appendChild(snackInner);
    if ((action != null) && (f != null)) {
        const actionE = Object(util["h" /* element */])('a', [], action);
        actionE.addEventListener('click', () => {
            snack.classList.remove('active');
            f();
        });
        snackInner.appendChild(actionE);
    }
    const add = () => {
        document.body.appendChild(snack);
        Object(util["i" /* forceLayout */])(snack);
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

// CONCATENATED MODULE: ./src/cookies.ts
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

// EXTERNAL MODULE: ./src/dates.ts
var dates = __webpack_require__(1);

// EXTERNAL MODULE: ./src/display.ts + 1 modules
var display = __webpack_require__(5);

// EXTERNAL MODULE: ./src/state.ts
var state = __webpack_require__(4);

// CONCATENATED MODULE: ./src/pcr.ts
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return fetch; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return dologin; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return getClasses; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return urlForAttachment; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return getAttachmentMimeType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return classById; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return switchViews; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return logout; });
/**
 * This module contains code to both fetch and parse assignments from PCR.
 */








const PCR_URL = 'https://webappsca.pcrsoft.com';
const ASSIGNMENTS_URL = `${PCR_URL}/Clue/SC-Assignments-Start-and-End-Date-(No-Range)/18594`;
const LOGIN_URL = `${PCR_URL}/Clue/SC-Student-Portal-Login-LDAP/8464?returnUrl=${encodeURIComponent(ASSIGNMENTS_URL)}`;
const ATTACHMENTS_URL = `${PCR_URL}/Clue/Common/AttachmentRender.aspx`;
const FORM_HEADER_ONLY = { 'Content-type': 'application/x-www-form-urlencoded' };
const ONE_MINUTE_MS = 60000;
const progressElement = Object(util["g" /* elemById */])('progress');
const loginDialog = Object(util["g" /* elemById */])('login');
const loginBackground = document.getElementById('loginBackground');
const lastUpdateEl = document.getElementById('lastUpdate');
const usernameEl = Object(util["g" /* elemById */])('username');
const passwordEl = Object(util["g" /* elemById */])('password');
const rememberCheck = Object(util["g" /* elemById */])('remember');
const incorrectLoginEl = Object(util["g" /* elemById */])('loginIncorrect');
// TODO keeping these as a global vars is bad
const loginHeaders = {};
const viewData = {};
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
async function fetch(override = false, data, onsuccess = display["a" /* display */], onlogin) {
    if (!override && Date.now() - state["d" /* state */].lastTriedUpdate.get() < ONE_MINUTE_MS)
        return;
    state["d" /* state */].lastTriedUpdate.set(Date.now());
    // Request a new month if needed
    const monthOffset = state["d" /* state */].calDateOffset.get();
    if (monthOffset !== 0) {
        const today = new Date();
        today.setMonth(today.getMonth() + state["d" /* state */].calDateOffset.get());
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
        const resp = await Object(util["o" /* send */])(ASSIGNMENTS_URL, 'document', headers, data, progressElement);
        console.timeEnd('Fetching assignments');
        if (resp.responseURL.indexOf('Login') !== -1) {
            // We have to log in now
            resp.response.getElementsByTagName('input').forEach((e) => {
                loginHeaders[e.name] = e.value || '';
            });
            console.log('Need to log in');
            const up = getCookie('userPass'); // Attempts to get the cookie *userPass*, which is set if the
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
            state["d" /* state */].lastUpdate.set(Date.now());
            if (lastUpdateEl)
                lastUpdateEl.innerHTML = Object(display["b" /* formatUpdate */])(state["d" /* state */].lastUpdate.get());
            try {
                parse(resp.response, monthOffset);
                onsuccess();
                if (monthOffset === 0) {
                    state["d" /* state */].data.forceUpdate();
                }
            }
            catch (error) {
                console.log(error);
                Object(errorDisplay["a" /* displayError */])(error);
            }
        }
    }
    catch (error) {
        console.log('Could not fetch assignments; You are probably offline. Here\'s the error:', error);
        snackbar('Could not fetch your assignments', 'Retry', () => fetch(true));
    }
}
/**
 * Logs the user into PCR
 * @param val   An optional length-2 array of the form [username, password] to use the user in with.
 *              If this array is not given the login dialog inputs will be used.
 * @param submitEvt Whether to override the username and password suppleid in val with the values of the input elements
 */
async function dologin(val, submitEvt = false, onsuccess = display["a" /* display */]) {
    loginDialog.classList.remove('active');
    setTimeout(() => {
        if (loginBackground)
            loginBackground.style.display = 'none';
    }, 350);
    const postArray = []; // Array of data to post
    Object(util["k" /* localStorageWrite */])('username', val && !submitEvt ? val[0] : usernameEl.value);
    Object(avatar["a" /* updateAvatar */])();
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
        const resp = await Object(util["o" /* send */])(LOGIN_URL, 'document', FORM_HEADER_ONLY, postArray.join('&'), progressElement);
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
                setCookie('userPass', window.btoa(usernameEl.value + ':' + passwordEl.value), 14);
            }
            // loadingBar.style.display = "none"
            state["d" /* state */].lastUpdate.set(Date.now());
            if (lastUpdateEl)
                lastUpdateEl.innerHTML = Object(display["b" /* formatUpdate */])(state["d" /* state */].lastUpdate.get());
            try {
                parse(resp.response, 0); // Parse the data PCR has replied with
                onsuccess();
                state["d" /* state */].data.forceUpdate(); // Store for offline use
            }
            catch (e) {
                console.log(e);
                Object(errorDisplay["a" /* displayError */])(e);
            }
        }
    }
    catch (error) {
        console.log('Could not log in to PCR. Either your network connection was lost during your visit ' +
            'or PCR is just not working. Here\'s the error:', error);
    }
}
function getClasses() {
    const data = state["d" /* state */].data.get();
    if (!data)
        return [];
    return data.classes;
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
    const data = state["d" /* state */].data.get();
    if (!data)
        throw new Error('Data dictionary not set up');
    // The starting date and ending date of the assignment are parsed first
    const range = findId(ca, 'span', 'StartingOn').innerHTML.split(' - ');
    const assignmentStart = Object(dates["c" /* toDateNum */])(Date.parse(range[0]));
    const assignmentEnd = (range[1] != null) ? Object(dates["c" /* toDateNum */])(Date.parse(range[1])) : assignmentStart;
    // Then, the name of the assignment is parsed
    const t = findId(ca, 'span', 'lblTitle');
    let title = t.innerHTML;
    // The actual body of the assignment and its attachments are parsed next
    const b = Object(util["a" /* _$ */])(Object(util["a" /* _$ */])(t.parentNode).parentNode);
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
        monthView: Object(util["a" /* _$ */])(doc.querySelector('.rsHeaderMonth')).parentNode.classList.contains('rsSelected'),
        monthOffset
    }; // Reset the array in which all of your assignments are stored in.
    state["d" /* state */].data.localSet(data);
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
        Object(util["g" /* elemById */])('sideBackground').click();
        const newViewData = Object.assign({}, viewData, { __EVENTTARGET: 'ctl00$ctl00$baseContent$baseContent$flashTop$ctl00$RadScheduler1', __EVENTARGUMENT: JSON.stringify({
                Command: `SwitchTo${document.body.getAttribute('data-pcrview') === 'month' ? 'Week' : 'Month'}View`
            }), ctl00_ctl00_baseContent_baseContent_flashTop_ctl00_RadScheduler1_ClientState: JSON.stringify({ scrollTop: 0, scrollLeft: 0, isDirty: false }), ctl00_ctl00_RadScriptManager1_TSM: ';;System.Web.Extensions, Version=4.0.0.0, Culture=neutral, ' +
                'PublicKeyToken=31bf3856ad364e35:en-US:d28568d3-e53e-4706-928f-3765912b66ca:ea597d4b:b25378d2' });
        const postArray = []; // Array of data to post
        Object.entries(newViewData).forEach(([h, v]) => {
            postArray.push(encodeURIComponent(h) + '=' + encodeURIComponent(v));
        });
        Object(state["e" /* zeroDateOffsets */])();
        fetch(true, postArray.join('&'));
    }
}
function logout() {
    if (Object.keys(viewData).length > 0) {
        deleteCookie('userPass');
        Object(util["g" /* elemById */])('sideBackground').click();
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
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return removeFromDone; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return addToDone; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return saveDone; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return assignmentInDone; });
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);

const DONE_STORAGE_NAME = 'done';
function removeFromDone(id) {
    const index = _state__WEBPACK_IMPORTED_MODULE_0__[/* state */ "d"].done.get().indexOf(id);
    if (index >= 0)
        _state__WEBPACK_IMPORTED_MODULE_0__[/* state */ "d"].done.get().splice(index, 1);
}
function addToDone(id) {
    _state__WEBPACK_IMPORTED_MODULE_0__[/* state */ "d"].done.get().push(id);
}
function saveDone() {
    _state__WEBPACK_IMPORTED_MODULE_0__[/* state */ "d"].done.forceUpdate();
}
function assignmentInDone(id) {
    return _state__WEBPACK_IMPORTED_MODULE_0__[/* state */ "d"].done.get().includes(id);
}


/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return getResizeAssignments; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return resizeCaller; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return resize; });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);

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
                Object(_util__WEBPACK_IMPORTED_MODULE_0__[/* animateEl */ "c"])(assignment, [
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
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return removeFromModified; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return saveModified; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return assignmentInModified; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return modifiedBody; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return setModified; });
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);

function removeFromModified(id) {
    delete _state__WEBPACK_IMPORTED_MODULE_0__[/* state */ "d"].modified.get()[id];
}
function saveModified() {
    _state__WEBPACK_IMPORTED_MODULE_0__[/* state */ "d"].modified.forceUpdate();
}
function assignmentInModified(id) {
    return _state__WEBPACK_IMPORTED_MODULE_0__[/* state */ "d"].modified.get().hasOwnProperty(id);
}
function modifiedBody(id) {
    return _state__WEBPACK_IMPORTED_MODULE_0__[/* state */ "d"].modified.get()[id];
}
function setModified(id, body) {
    _state__WEBPACK_IMPORTED_MODULE_0__[/* state */ "d"].modified.get()[id] = body;
}


/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return getExtra; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return saveExtra; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return addToExtra; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return removeFromExtra; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return extraToTask; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return parseCustomTask; });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);

const CUSTOM_STORAGE_NAME = 'extra';
const extra = Object(_util__WEBPACK_IMPORTED_MODULE_0__[/* localStorageRead */ "j"])(CUSTOM_STORAGE_NAME, []);
function getExtra() {
    return extra;
}
function saveExtra() {
    Object(_util__WEBPACK_IMPORTED_MODULE_0__[/* localStorageWrite */ "k"])(CUSTOM_STORAGE_NAME, extra);
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
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return computeWeekId; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return separate; });
/* unused harmony export assignmentClass */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return separatedClass; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return createAssignment; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return getES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return closeOpened; });
/* harmony import */ var _dates__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _display__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5);
/* harmony import */ var _pcr__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6);
/* harmony import */ var _plugins_activity__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(12);
/* harmony import */ var _plugins_customAssignments__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(10);
/* harmony import */ var _plugins_done__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(7);
/* harmony import */ var _plugins_modifiedAssignments__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(9);
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(4);
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(0);
/* harmony import */ var _resizer__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(8);










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
    Object(_util__WEBPACK_IMPORTED_MODULE_8__[/* _$ */ "a"])(edits.querySelector('.additions')).innerHTML = added !== 0 ? `+${added}` : '';
    Object(_util__WEBPACK_IMPORTED_MODULE_8__[/* _$ */ "a"])(edits.querySelector('.deletions')).innerHTML = deleted !== 0 ? `-${deleted}` : '';
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
    const athenaData = _state__WEBPACK_IMPORTED_MODULE_7__[/* state */ "d"].athenaData.get();
    if (athenaData && assignment.class != null && (athenaData[data.classes[assignment.class]] != null)) {
        link = athenaData[data.classes[assignment.class]].link;
        smallTag = 'a';
    }
    const e = Object(_util__WEBPACK_IMPORTED_MODULE_8__[/* element */ "h"])('div', ['assignment', assignment.baseType, 'anim'], `<${smallTag}${link ? ` href='${link}' class='linked' target='_blank'` : ''}>
                           <span class='extra'>${separated[1]}</span>
                           ${separated[2]}
                       </${smallTag}><span class='title'>${assignment.title}</span>
                       <input type='hidden' class='due'
                              value='${assignment.end === 'Forever' ? 0 : assignment.end}' />`, assignment.id + weekId);
    if ((reference && reference.done) || Object(_plugins_done__WEBPACK_IMPORTED_MODULE_5__[/* assignmentInDone */ "b"])(assignment.id)) {
        e.classList.add('done');
    }
    e.setAttribute('data-class', assignmentClass(assignment, data));
    const close = Object(_util__WEBPACK_IMPORTED_MODULE_8__[/* element */ "h"])('a', ['close', 'material-icons'], 'close');
    close.addEventListener('click', closeOpened);
    e.appendChild(close);
    // Prevent clicking the class name when an item is displayed on the calendar from doing anything
    if (link != null) {
        Object(_util__WEBPACK_IMPORTED_MODULE_8__[/* _$ */ "a"])(e.querySelector('a')).addEventListener('click', (evt) => {
            if ((document.body.getAttribute('data-view') === '0') && !e.classList.contains('full')) {
                evt.preventDefault();
            }
        });
    }
    const complete = Object(_util__WEBPACK_IMPORTED_MODULE_8__[/* element */ "h"])('a', ['complete', 'material-icons', 'waves'], 'done');
    Object(_util__WEBPACK_IMPORTED_MODULE_8__[/* ripple */ "n"])(complete);
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
                Object(_plugins_customAssignments__WEBPACK_IMPORTED_MODULE_4__[/* saveExtra */ "f"])();
            }
            else {
                if (e.classList.contains('done')) {
                    Object(_plugins_done__WEBPACK_IMPORTED_MODULE_5__[/* removeFromDone */ "c"])(assignment.id);
                }
                else {
                    added = false;
                    Object(_plugins_done__WEBPACK_IMPORTED_MODULE_5__[/* addToDone */ "a"])(assignment.id);
                }
                Object(_plugins_done__WEBPACK_IMPORTED_MODULE_5__[/* saveDone */ "d"])();
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
                    Object(_resizer__WEBPACK_IMPORTED_MODULE_9__[/* resize */ "b"])();
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
        const deleteA = Object(_util__WEBPACK_IMPORTED_MODULE_8__[/* element */ "h"])('a', ['material-icons', 'deleteAssignment', 'waves'], 'delete');
        Object(_util__WEBPACK_IMPORTED_MODULE_8__[/* ripple */ "n"])(deleteA);
        deleteA.addEventListener('mouseup', (evt) => {
            if (evt.which !== 1 || !reference)
                return;
            Object(_plugins_customAssignments__WEBPACK_IMPORTED_MODULE_4__[/* removeFromExtra */ "e"])(reference);
            Object(_plugins_customAssignments__WEBPACK_IMPORTED_MODULE_4__[/* saveExtra */ "f"])();
            if (document.querySelector('.full') != null) {
                document.body.style.overflow = 'auto';
                const back = Object(_util__WEBPACK_IMPORTED_MODULE_8__[/* elemById */ "g"])('background');
                back.classList.remove('active');
                setTimeout(() => {
                    back.style.display = 'none';
                }, 350);
            }
            e.remove();
            Object(_display__WEBPACK_IMPORTED_MODULE_1__[/* display */ "a"])(false);
        });
        e.appendChild(deleteA);
    }
    // Modification button
    const edit = Object(_util__WEBPACK_IMPORTED_MODULE_8__[/* element */ "h"])('a', ['editAssignment', 'material-icons', 'waves'], 'edit');
    edit.addEventListener('mouseup', (evt) => {
        if (evt.which === 1) {
            const remove = edit.classList.contains('active');
            edit.classList.toggle('active');
            Object(_util__WEBPACK_IMPORTED_MODULE_8__[/* _$ */ "a"])(e.querySelector('.body')).setAttribute('contentEditable', remove ? 'false' : 'true');
            if (!remove) {
                e.querySelector('.body').focus();
            }
            const dn = e.querySelector('.complete');
            dn.style.display = remove ? 'block' : 'none';
        }
    });
    Object(_util__WEBPACK_IMPORTED_MODULE_8__[/* ripple */ "n"])(edit);
    e.appendChild(edit);
    const start = new Date(Object(_dates__WEBPACK_IMPORTED_MODULE_0__[/* fromDateNum */ "a"])(assignment.start));
    const end = assignment.end === 'Forever' ? assignment.end : new Date(Object(_dates__WEBPACK_IMPORTED_MODULE_0__[/* fromDateNum */ "a"])(assignment.end));
    const times = Object(_util__WEBPACK_IMPORTED_MODULE_8__[/* element */ "h"])('div', 'range', assignment.start === assignment.end ? Object(_util__WEBPACK_IMPORTED_MODULE_8__[/* dateString */ "f"])(start) : `${Object(_util__WEBPACK_IMPORTED_MODULE_8__[/* dateString */ "f"])(start)} &ndash; ${Object(_util__WEBPACK_IMPORTED_MODULE_8__[/* dateString */ "f"])(end)}`);
    e.appendChild(times);
    if (assignment.attachments.length > 0) {
        const attachments = Object(_util__WEBPACK_IMPORTED_MODULE_8__[/* element */ "h"])('div', 'attachments');
        assignment.attachments.forEach((attachment) => {
            const a = Object(_util__WEBPACK_IMPORTED_MODULE_8__[/* element */ "h"])('a', [], attachment[0]);
            a.href = Object(_pcr__WEBPACK_IMPORTED_MODULE_2__[/* urlForAttachment */ "h"])(attachment[1]);
            Object(_pcr__WEBPACK_IMPORTED_MODULE_2__[/* getAttachmentMimeType */ "d"])(attachment[1]).then((type) => {
                let span;
                if (mimeTypes[type] != null) {
                    a.classList.add(mimeTypes[type][1]);
                    span = Object(_util__WEBPACK_IMPORTED_MODULE_8__[/* element */ "h"])('span', [], mimeTypes[type][0]);
                }
                else {
                    span = Object(_util__WEBPACK_IMPORTED_MODULE_8__[/* element */ "h"])('span', [], 'Unknown file type');
                }
                a.appendChild(span);
            });
            attachments.appendChild(a);
        });
        e.appendChild(attachments);
    }
    const body = Object(_util__WEBPACK_IMPORTED_MODULE_8__[/* element */ "h"])('div', 'body', assignment.body.replace(/font-family:[^;]*?(?:Times New Roman|serif)[^;]*/g, ''));
    const edits = Object(_util__WEBPACK_IMPORTED_MODULE_8__[/* element */ "h"])('div', 'edits', '<span class=\'additions\'></span><span class=\'deletions\'></span>');
    const m = Object(_plugins_modifiedAssignments__WEBPACK_IMPORTED_MODULE_6__[/* modifiedBody */ "b"])(assignment.id);
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
            Object(_plugins_customAssignments__WEBPACK_IMPORTED_MODULE_4__[/* saveExtra */ "f"])();
        }
        else {
            Object(_plugins_modifiedAssignments__WEBPACK_IMPORTED_MODULE_6__[/* setModified */ "e"])(assignment.id, body.innerHTML);
            Object(_plugins_modifiedAssignments__WEBPACK_IMPORTED_MODULE_6__[/* saveModified */ "d"])();
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
            Object(_resizer__WEBPACK_IMPORTED_MODULE_9__[/* resize */ "b"])();
    });
    e.appendChild(body);
    const restore = Object(_util__WEBPACK_IMPORTED_MODULE_8__[/* element */ "h"])('a', ['material-icons', 'restore'], 'settings_backup_restore');
    restore.addEventListener('click', () => {
        Object(_plugins_modifiedAssignments__WEBPACK_IMPORTED_MODULE_6__[/* removeFromModified */ "c"])(assignment.id);
        Object(_plugins_modifiedAssignments__WEBPACK_IMPORTED_MODULE_6__[/* saveModified */ "d"])();
        body.innerHTML = assignment.body;
        edits.classList.remove('notEmpty');
        if (document.body.getAttribute('data-view') === '1')
            Object(_resizer__WEBPACK_IMPORTED_MODULE_9__[/* resize */ "b"])();
    });
    edits.appendChild(restore);
    e.appendChild(edits);
    const mods = Object(_util__WEBPACK_IMPORTED_MODULE_8__[/* element */ "h"])('div', ['mods']);
    Object(_plugins_activity__WEBPACK_IMPORTED_MODULE_3__[/* recentActivity */ "b"])().forEach((a) => {
        if ((a[0] === 'edit') && (a[1].id === assignment.id)) {
            const te = Object(_util__WEBPACK_IMPORTED_MODULE_8__[/* element */ "h"])('div', ['innerActivity', 'assignmentItem', assignment.baseType], `<i class='material-icons'>edit</i>
                            <span class='title'>${Object(_util__WEBPACK_IMPORTED_MODULE_8__[/* dateString */ "f"])(new Date(a[2]))}</span>
                            <span class='additions'></span><span class='deletions'></span>`, `ia${assignment.id}`);
            const d = dmp.diff_main(a[1].body, assignment.body);
            dmp.diff_cleanupSemantic(d);
            populateAddedDeleted(d, te);
            if (assignment.class)
                te.setAttribute('data-class', data.classes[assignment.class]);
            te.appendChild(Object(_util__WEBPACK_IMPORTED_MODULE_8__[/* element */ "h"])('div', 'iaDiff', dmp.diff_prettyHtml(d)));
            te.addEventListener('click', () => {
                te.classList.toggle('active');
                if (document.body.getAttribute('data-view') === '1')
                    Object(_resizer__WEBPACK_IMPORTED_MODULE_9__[/* resize */ "b"])();
            });
            mods.appendChild(te);
        }
    });
    e.appendChild(mods);
    if (_state__WEBPACK_IMPORTED_MODULE_7__[/* state */ "d"].assignmentSpan.get() === 'multiple' && (start < split.start)) {
        e.classList.add('fromWeekend');
    }
    if (_state__WEBPACK_IMPORTED_MODULE_7__[/* state */ "d"].assignmentSpan.get() === 'multiple' && (end > split.end)) {
        e.classList.add('overWeekend');
    }
    e.classList.add(`s${split.start.getDay()}`);
    if (split.end !== 'Forever')
        e.classList.add(`e${6 - split.end.getDay()}`);
    const st = Math.floor(split.start.getTime() / 1000 / 3600 / 24);
    if (split.assignment.end === 'Forever') {
        if (st <= (Object(_dates__WEBPACK_IMPORTED_MODULE_0__[/* today */ "d"])() + _state__WEBPACK_IMPORTED_MODULE_7__[/* state */ "d"].listDateOffset.get())) {
            e.classList.add('listDisp');
        }
    }
    else {
        const midDate = new Date();
        midDate.setDate(midDate.getDate() + _state__WEBPACK_IMPORTED_MODULE_7__[/* state */ "d"].listDateOffset.get());
        const push = (assignment.baseType === 'test' && assignment.start === st) ? _state__WEBPACK_IMPORTED_MODULE_7__[/* state */ "d"].earlyTest.get() : 0;
        const endExtra = _state__WEBPACK_IMPORTED_MODULE_7__[/* state */ "d"].listDateOffset.get() === 0 ? Object(_display__WEBPACK_IMPORTED_MODULE_1__[/* getTimeAfter */ "d"])(midDate) : 24 * 3600 * 1000;
        if (Object(_dates__WEBPACK_IMPORTED_MODULE_0__[/* fromDateNum */ "a"])(st - push) <= midDate &&
            (split.end === 'Forever' || midDate.getTime() <= split.end.getTime() + endExtra)) {
            e.classList.add('listDisp');
        }
    }
    // Add click interactivity
    if (!split.custom || !_state__WEBPACK_IMPORTED_MODULE_7__[/* state */ "d"].sepTasks.get()) {
        e.addEventListener('click', (evt) => {
            if ((document.getElementsByClassName('full').length === 0) &&
                (document.body.getAttribute('data-view') === '0')) {
                e.classList.remove('anim');
                e.classList.add('modify');
                const top = (e.getBoundingClientRect().top - document.body.scrollTop
                    - Object(_util__WEBPACK_IMPORTED_MODULE_8__[/* cssNumber */ "e"])(e.style.marginTop)) + 44;
                e.style.top = top - window.pageYOffset + 'px';
                e.setAttribute('data-top', String(top));
                document.body.style.overflow = 'hidden';
                const back = Object(_util__WEBPACK_IMPORTED_MODULE_8__[/* elemById */ "g"])('background');
                back.classList.add('active');
                back.style.display = 'block';
                e.classList.add('anim');
                Object(_util__WEBPACK_IMPORTED_MODULE_8__[/* forceLayout */ "i"])(e);
                e.classList.add('full');
                e.style.top = (75 - Object(_util__WEBPACK_IMPORTED_MODULE_8__[/* cssNumber */ "e"])(e.style.marginTop)) + 'px';
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
    const back = Object(_util__WEBPACK_IMPORTED_MODULE_8__[/* elemById */ "g"])('background');
    back.classList.remove('active');
    const transitionListener = () => {
        back.style.display = 'none';
        el.classList.remove('anim');
        el.classList.remove('modify');
        el.style.top = 'auto';
        Object(_util__WEBPACK_IMPORTED_MODULE_8__[/* forceLayout */ "i"])(el);
        el.classList.add('anim');
        el.removeEventListener('transitionend', transitionListener);
    };
    el.addEventListener('transitionend', transitionListener);
}


/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXTERNAL MODULE: ./src/pcr.ts + 2 modules
var pcr = __webpack_require__(6);

// EXTERNAL MODULE: ./src/plugins/done.ts
var done = __webpack_require__(7);

// EXTERNAL MODULE: ./src/util.ts
var util = __webpack_require__(0);

// EXTERNAL MODULE: ./src/components/assignment.ts
var components_assignment = __webpack_require__(11);

// CONCATENATED MODULE: ./src/components/activity.ts




function addActivityElement(el) {
    const insertTo = Object(util["g" /* elemById */])('infoActivity');
    insertTo.insertBefore(el, insertTo.querySelector('.activity'));
}
function createActivity(type, assignment, date, className) {
    const cname = className || Object(pcr["a" /* classById */])(assignment.class);
    const te = Object(util["h" /* element */])('div', ['activity', 'assignmentItem', assignment.baseType, type], `
        <i class='material-icons'>${type}</i>
        <span class='title'>${assignment.title}</span>
        <small>${Object(components_assignment["e" /* separate */])(cname)[2]}</small>
        <div class='range'>${Object(util["f" /* dateString */])(date)}</div>`, `activity${assignment.id}`);
    te.setAttribute('data-class', cname);
    const { id } = assignment;
    if (type !== 'delete') {
        te.addEventListener('click', () => {
            const doScrolling = async () => {
                const el = Object(util["a" /* _$ */])(document.querySelector(`.assignment[id*=\"${id}\"]`));
                await Object(util["p" /* smoothScroll */])((el.getBoundingClientRect().top + document.body.scrollTop) - 116);
                el.click();
            };
            if (document.body.getAttribute('data-view') === '0') {
                return doScrolling();
            }
            else {
                Object(util["a" /* _$ */])(document.querySelector('#navTabs>li:first-child')).click();
                return setTimeout(doScrolling, 500);
            }
        });
    }
    if (Object(done["b" /* assignmentInDone */])(assignment.id)) {
        te.classList.add('done');
    }
    return te;
}

// EXTERNAL MODULE: ./src/state.ts
var state = __webpack_require__(4);

// CONCATENATED MODULE: ./src/plugins/activity.ts
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return addActivity; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return saveActivity; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return recentActivity; });


function addActivity(type, assignment, date, newActivity, className) {
    if (state["d" /* state */].calDateOffset.get() !== 0)
        return; // Ignore activity when on another month
    if (newActivity)
        state["d" /* state */].activity.get().push([type, assignment, Date.now(), className]);
    const el = createActivity(type, assignment, date, className);
    addActivityElement(el);
}
function saveActivity() {
    const activity = state["d" /* state */].activity.get();
    state["d" /* state */].activity.set(activity.slice(activity.length - 128, activity.length));
}
function recentActivity() {
    const activity = state["d" /* state */].activity.get();
    return activity.slice(activity.length - 32, activity.length);
}


/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return VERSION; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return checkCommit; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return fetchNews; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return getNews; });
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(0);


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
        const resp = await Object(_util__WEBPACK_IMPORTED_MODULE_1__[/* send */ "o"])(VERSION_URL, 'text');
        const c = resp.responseText.trim();
        console.log(`Current version: ${c} ${VERSION === c ? '(no update available)' : '(update available)'}`);
        Object(_util__WEBPACK_IMPORTED_MODULE_1__[/* elemById */ "g"])('newversion').innerHTML = c;
        if (VERSION !== c) {
            Object(_util__WEBPACK_IMPORTED_MODULE_1__[/* elemById */ "g"])('updateIgnore').addEventListener('click', () => {
                if (location.protocol === 'chrome-extension:') {
                    Object(_util__WEBPACK_IMPORTED_MODULE_1__[/* elemById */ "g"])('update').classList.remove('active');
                    setTimeout(() => {
                        Object(_util__WEBPACK_IMPORTED_MODULE_1__[/* elemById */ "g"])('updateBackground').style.display = 'none';
                    }, 350);
                }
                else {
                    window.location.reload();
                }
            });
            const resp2 = await Object(_util__WEBPACK_IMPORTED_MODULE_1__[/* send */ "o"])(COMMIT_URL, 'json');
            const { sha, url } = resp2.response.object;
            const resp3 = await Object(_util__WEBPACK_IMPORTED_MODULE_1__[/* send */ "o"])((location.protocol === 'chrome-extension:' ? url : `/api/commit/${sha}`), 'json');
            Object(_util__WEBPACK_IMPORTED_MODULE_1__[/* elemById */ "g"])('pastUpdateVersion').innerHTML = VERSION;
            Object(_util__WEBPACK_IMPORTED_MODULE_1__[/* elemById */ "g"])('newUpdateVersion').innerHTML = c;
            Object(_util__WEBPACK_IMPORTED_MODULE_1__[/* elemById */ "g"])('updateFeatures').innerHTML = formatCommitMessage(resp3.response.message);
            Object(_util__WEBPACK_IMPORTED_MODULE_1__[/* elemById */ "g"])('updateBackground').style.display = 'block';
            Object(_util__WEBPACK_IMPORTED_MODULE_1__[/* elemById */ "g"])('update').classList.add('active');
        }
    }
    catch (err) {
        console.log('Could not access Github. Here\'s the error:', err);
    }
}
async function fetchNews() {
    try {
        const resp = await Object(_util__WEBPACK_IMPORTED_MODULE_1__[/* send */ "o"])(NEWS_URL, 'json');
        const newsCommit = resp.response.history[0].version;
        if (_state__WEBPACK_IMPORTED_MODULE_0__[/* state */ "d"].lastNewsCommit.get() == null) {
            _state__WEBPACK_IMPORTED_MODULE_0__[/* state */ "d"].lastNewsCommit.set(newsCommit);
        }
        _state__WEBPACK_IMPORTED_MODULE_0__[/* state */ "d"].newsUrl.set(resp.response.files['updates.htm'].raw_url);
        if (_state__WEBPACK_IMPORTED_MODULE_0__[/* state */ "d"].lastNewsCommit.get() !== newsCommit) {
            getNews().then(() => _state__WEBPACK_IMPORTED_MODULE_0__[/* state */ "d"].lastNewsCommit.set(newsCommit));
        }
    }
    catch (err) {
        console.log('Could not access Github. Here\'s the error:', err);
    }
}
async function getNews() {
    const url = _state__WEBPACK_IMPORTED_MODULE_0__[/* state */ "d"].newsUrl.get();
    if (!url) {
        throw new Error('News url not yet found');
    }
    try {
        const resp = await Object(_util__WEBPACK_IMPORTED_MODULE_1__[/* send */ "o"])(url);
        resp.responseText.split('<hr>').forEach((news) => {
            Object(_util__WEBPACK_IMPORTED_MODULE_1__[/* elemById */ "g"])('newsContent').appendChild(Object(_util__WEBPACK_IMPORTED_MODULE_1__[/* element */ "h"])('div', 'newsItem', news));
        });
        Object(_util__WEBPACK_IMPORTED_MODULE_1__[/* elemById */ "g"])('newsBackground').style.display = 'block';
        Object(_util__WEBPACK_IMPORTED_MODULE_1__[/* elemById */ "g"])('news').classList.add('active');
    }
    catch (err) {
        console.log('Could not access Github. Here\'s the error:', err);
        throw err;
    }
}


/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return displayError; });
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(13);
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(0);


const ERROR_FORM_URL = 'https://docs.google.com/a/students.harker.org/forms/d/'
    + '1sa2gUtYFPdKT5YENXIEYauyRPucqsQCVaQAPeF3bZ4Q/viewform';
const ERROR_FORM_ENTRY = '?entry.120036223=';
const ERROR_GITHUB_URL = 'https://github.com/19RyanA/CheckPCR/issues/new';
const linkById = (id) => Object(_util__WEBPACK_IMPORTED_MODULE_1__[/* elemById */ "g"])(id);
// *displayError* displays a dialog containing information about an error.
function displayError(e) {
    console.log('Displaying error', e);
    const errorHTML = `Message: ${e.message}\nStack: ${e.stack || e.lineNumber}\n`
        + `Browser: ${navigator.userAgent}\nVersion: ${_app__WEBPACK_IMPORTED_MODULE_0__[/* VERSION */ "a"]}`;
    Object(_util__WEBPACK_IMPORTED_MODULE_1__[/* elemById */ "g"])('errorContent').innerHTML = errorHTML.replace('\n', '<br>');
    linkById('errorGoogle').href = ERROR_FORM_URL + ERROR_FORM_ENTRY + encodeURIComponent(errorHTML);
    linkById('errorGitHub').href =
        ERROR_GITHUB_URL + '?body=' + encodeURIComponent(`I've encountered a bug.\n\n\`\`\`\n${errorHTML}\n\`\`\``);
    Object(_util__WEBPACK_IMPORTED_MODULE_1__[/* elemById */ "g"])('errorBackground').style.display = 'block';
    return Object(_util__WEBPACK_IMPORTED_MODULE_1__[/* elemById */ "g"])('error').classList.add('active');
}
window.addEventListener('error', (evt) => {
    evt.preventDefault();
    displayError(evt.error);
});


/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return updateAthenaData; });
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(0);


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
        _state__WEBPACK_IMPORTED_MODULE_0__[/* state */ "d"].athenaData.set(parseAthenaData(data));
        Object(_util__WEBPACK_IMPORTED_MODULE_1__[/* elemById */ "g"])('athenaDataError').style.display = 'none';
        if (refreshEl)
            refreshEl.style.display = 'block';
    }
    catch (e) {
        Object(_util__WEBPACK_IMPORTED_MODULE_1__[/* elemById */ "g"])('athenaDataError').style.display = 'block';
        if (refreshEl)
            refreshEl.style.display = 'none';
        Object(_util__WEBPACK_IMPORTED_MODULE_1__[/* elemById */ "g"])('athenaDataError').innerHTML = e.message;
    }
}


/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return updateAvatar; });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);

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
    if (!Object(_util__WEBPACK_IMPORTED_MODULE_0__[/* localStorageRead */ "j"])('username'))
        return;
    const userEl = document.getElementById('user');
    const initialsEl = document.getElementById('initials');
    if (!userEl || !initialsEl)
        return;
    userEl.innerHTML = Object(_util__WEBPACK_IMPORTED_MODULE_0__[/* localStorageRead */ "j"])('username');
    const initials = Object(_util__WEBPACK_IMPORTED_MODULE_0__[/* localStorageRead */ "j"])('username').match(/\d*(.).*?(.$)/); // Separate year from first name and initial
    if (initials != null) {
        const bg = labrgb(50, letterToColorVal(initials[1]), letterToColorVal(initials[2])); // Compute the color
        initialsEl.style.backgroundColor = bg;
        initialsEl.innerHTML = initials[1] + initials[2];
    }
}


/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./src/app.ts
var app = __webpack_require__(13);

// EXTERNAL MODULE: ./src/components/assignment.ts
var components_assignment = __webpack_require__(11);

// EXTERNAL MODULE: ./src/components/avatar.ts
var avatar = __webpack_require__(16);

// EXTERNAL MODULE: ./src/pcr.ts + 2 modules
var pcr = __webpack_require__(6);

// EXTERNAL MODULE: ./src/util.ts
var util = __webpack_require__(0);

// CONCATENATED MODULE: ./src/components/customAdder.ts


// When anything is typed, the search suggestions need to be updated.
const TIP_NAMES = {
    for: ['for'],
    by: ['by', 'due', 'ending'],
    starting: ['starting', 'beginning', 'assigned']
};
const newText = Object(util["g" /* elemById */])('newText');
function updateNewTips(val, scroll = true) {
    if (scroll) {
        Object(util["g" /* elemById */])('newTips').scrollTop = 0;
    }
    const spaceIndex = val.lastIndexOf(' ');
    if (spaceIndex !== -1) {
        const beforeSpace = val.lastIndexOf(' ', spaceIndex - 1);
        const before = val.substring((beforeSpace === -1 ? 0 : beforeSpace + 1), spaceIndex);
        Object.entries(TIP_NAMES).forEach(([name, possible]) => {
            if (possible.indexOf(before) !== -1) {
                if (name === 'for') {
                    Object.keys(TIP_NAMES).forEach((tipName) => {
                        Object(util["g" /* elemById */])(`tip${tipName}`).classList.remove('active');
                    });
                    Object(pcr["e" /* getClasses */])().forEach((cls) => {
                        const id = `tipclass${cls.replace(/\W/, '')}`;
                        if (spaceIndex === (val.length - 1)) {
                            const e = document.getElementById(id);
                            if (e) {
                                e.classList.add('active');
                            }
                            else {
                                const container = Object(util["h" /* element */])('div', ['classTip', 'active', 'tip'], `<i class='material-icons'>class</i><span class='typed'>${cls}</span>`, id);
                                container.addEventListener('click', tipComplete(cls));
                                Object(util["g" /* elemById */])('newTips').appendChild(container);
                            }
                        }
                        else {
                            Object(util["g" /* elemById */])(id).classList.toggle('active', cls.toLowerCase().includes(val.toLowerCase().substr(spaceIndex + 1)));
                        }
                    });
                }
            }
        });
    }
    document.querySelectorAll('.classTip').forEach((el) => {
        el.classList.remove('active');
    });
    if ((val === '') || (val.charAt(val.length - 1) === ' ')) {
        updateTip('for', 'for', false);
        updateTip('by', 'by', false);
        updateTip('starting', 'starting', false);
    }
    else {
        const lastSpace = val.lastIndexOf(' ');
        let lastWord = lastSpace === -1 ? val : val.substr(lastSpace + 1);
        const uppercase = lastWord.charAt(0) === lastWord.charAt(0).toUpperCase();
        lastWord = lastWord.toLowerCase();
        Object.entries(TIP_NAMES).forEach(([name, possible]) => {
            let found = null;
            possible.forEach((p) => {
                if (p.slice(0, lastWord.length) === lastWord) {
                    found = p;
                }
            });
            if (found) {
                updateTip(name, found, uppercase);
            }
            else {
                Object(util["g" /* elemById */])(`tip${name}`).classList.remove('active');
            }
        });
    }
}
function updateTip(name, typed, capitalize) {
    if (name !== 'for' && name !== 'by' && name !== 'starting') {
        throw new Error('Invalid tip name');
    }
    const el = Object(util["g" /* elemById */])(`tip${name}`);
    el.classList.add('active');
    Object(util["a" /* _$ */])(el.querySelector('.typed')).innerHTML = (capitalize ? Object(util["d" /* capitalizeString */])(typed) : typed) + '...';
    const newNames = [];
    TIP_NAMES[name].forEach((n) => {
        if (n !== typed) {
            newNames.push(`<b>${n}</b>`);
        }
    });
    Object(util["a" /* _$ */])(el.querySelector('.others')).innerHTML = newNames.length > 0 ? `You can also use ${newNames.join(' or ')}` : '';
}
function tipComplete(autocomplete) {
    return (evt) => {
        const val = newText.value;
        const lastSpace = val.lastIndexOf(' ');
        const lastWord = lastSpace === -1 ? 0 : lastSpace + 1;
        updateNewTips(newText.value = val.substring(0, lastWord) + autocomplete + ' ');
        return newText.focus();
    };
}
// The event listener is then added to the preexisting tips.
document.querySelectorAll('.tip').forEach((tip) => {
    tip.addEventListener('click', tipComplete(Object(util["a" /* _$ */])(tip.querySelector('.typed')).innerHTML));
});

// EXTERNAL MODULE: ./src/components/resizer.ts
var resizer = __webpack_require__(8);

// EXTERNAL MODULE: ./src/dates.ts
var dates = __webpack_require__(1);

// EXTERNAL MODULE: ./src/display.ts + 1 modules
var display = __webpack_require__(5);

// EXTERNAL MODULE: ./src/plugins/activity.ts + 1 modules
var activity = __webpack_require__(12);

// EXTERNAL MODULE: ./src/plugins/athena.ts
var athena = __webpack_require__(15);

// EXTERNAL MODULE: ./src/plugins/customAssignments.ts
var customAssignments = __webpack_require__(10);

// EXTERNAL MODULE: ./src/state.ts
var state = __webpack_require__(4);

// CONCATENATED MODULE: ./src/client.ts













// Additionally, if it's the user's first time, the page is set to the welcome page.
if (!Object(util["j" /* localStorageRead */])('noWelcome')) {
    Object(util["k" /* localStorageWrite */])('noWelcome', true);
    window.location.href = 'welcome.html';
}
const NAV_ELEMENT = Object(util["a" /* _$ */])(document.querySelector('nav'));
const INPUT_ELEMENTS = document.querySelectorAll('input[type=text]:not(#newText):not([readonly]), input[type=password], input[type=email], ' +
    'input[type=url], input[type=tel], input[type=number]:not(.control), input[type=search]');
// #### Send function
//
// This function displays a snackbar to tell the user something
// <a name="ret"/>
// Retrieving data
// ---------------
//
Object(util["g" /* elemById */])('login').addEventListener('submit', (evt) => {
    evt.preventDefault();
    Object(pcr["b" /* dologin */])(null, true);
});
// The view switching button needs an event handler.
Object(util["g" /* elemById */])('switchViews').addEventListener('click', pcr["g" /* switchViews */]);
// The same goes for the log out button.
Object(util["g" /* elemById */])('logout').addEventListener('click', pcr["f" /* logout */]);
// Now we assign it to clicking the background.
Object(util["g" /* elemById */])('background').addEventListener('click', components_assignment["a" /* closeOpened */]);
// Then, the tabs are made interactive.
document.querySelectorAll('#navTabs>li').forEach((tab, tabIndex) => {
    tab.addEventListener('click', (evt) => {
        if (!state["d" /* state */].viewTrans.get()) {
            document.body.classList.add('noTrans');
            Object(util["i" /* forceLayout */])(document.body);
        }
        Object(util["k" /* localStorageWrite */])('view', tabIndex);
        document.body.setAttribute('data-view', String(tabIndex));
        if (tabIndex === 1) {
            window.addEventListener('resize', resizer["c" /* resizeCaller */]);
            if (state["d" /* state */].viewTrans.get()) {
                let start = null;
                // The code below is the same code used in the resize() function. It basically just
                // positions the assignments correctly as they animate
                const widths = document.body.classList.contains('showInfo') ?
                    [650, 1100, 1800, 2700, 3800, 5100] : [350, 800, 1500, 2400, 3500, 4800];
                let columns = 1;
                widths.forEach((w, index) => {
                    if (window.innerWidth > w) {
                        columns = index + 1;
                    }
                });
                const assignments = Object(resizer["a" /* getResizeAssignments */])();
                const columnHeights = Array.from(new Array(columns), () => 0);
                const step = (timestamp) => {
                    if (!columns)
                        throw new Error('Columns number not found');
                    assignments.forEach((assignment, n) => {
                        const col = n % columns;
                        if (n < columns) {
                            columnHeights[col] = 0;
                        }
                        assignment.style.top = columnHeights[col] + 'px';
                        if (start == null) {
                            const [eName, sName] = Object(components_assignment["d" /* getES */])(assignment);
                            const oldLeft = Number(sName.substring(1)) * 100 / 7 + '%';
                            const oldRight = Number(eName.substring(1)) * 100 / 7 + '%';
                            const left = ((100 / columns) * col) + '%';
                            const right = ((100 / columns) * (columns - col - 1)) + '%';
                            Object(util["c" /* animateEl */])(assignment, [
                                { left: oldLeft, right: oldRight },
                                { left, right }
                            ], { duration: 300 }).then(() => {
                                assignment.style.left = left;
                                assignment.style.right = right;
                            });
                        }
                        columnHeights[col] += assignment.offsetHeight + 24;
                    });
                    if (start == null)
                        start = timestamp;
                    if ((timestamp - start) < 350) {
                        return window.requestAnimationFrame(step);
                    }
                };
                window.requestAnimationFrame(step);
                setTimeout(() => {
                    if (!columns)
                        throw new Error('Columns number not found');
                    assignments.forEach((assignment, n) => {
                        const col = n % columns;
                        if (n < columns) {
                            columnHeights[col] = 0;
                        }
                        assignment.style.top = columnHeights[col] + 'px';
                        columnHeights[col] += assignment.offsetHeight + 24;
                    });
                }, 350);
            }
            else {
                Object(resizer["b" /* resize */])();
            }
            const prevOffset = state["d" /* state */].calDateOffset.get();
            Object(state["e" /* zeroDateOffsets */])();
            if (prevOffset !== 0)
                lazyFetch();
            updateDateNavs();
        }
        else {
            window.scrollTo(0, Object(display["c" /* getScroll */])());
            NAV_ELEMENT.classList.add('headroom--locked');
            setTimeout(() => {
                NAV_ELEMENT.classList.remove('headroom--unpinned');
                NAV_ELEMENT.classList.remove('headroom--locked');
                NAV_ELEMENT.classList.add('headroom--pinned');
            }, 350);
            Object(util["m" /* requestIdleCallback */])(() => {
                Object(state["e" /* zeroDateOffsets */])();
                lazyFetch();
                updateDateNavs();
                Object(display["a" /* display */])();
            }, { timeout: 2000 });
            window.removeEventListener('resize', resizer["c" /* resizeCaller */]);
            document.querySelectorAll('.assignment').forEach((assignment) => {
                assignment.style.top = 'auto';
            });
        }
        if (!state["d" /* state */].viewTrans.get()) {
            Object(util["i" /* forceLayout */])(document.body);
            setTimeout(() => {
                document.body.classList.remove('noTrans');
            }, 350);
        }
    });
});
// And the info tabs (just a little less code)
document.querySelectorAll('#infoTabs>li').forEach((tab, tabIndex) => {
    tab.addEventListener('click', (evt) => {
        Object(util["g" /* elemById */])('info').setAttribute('data-view', String(tabIndex));
    });
});
// The view is set to what it was last.
if (Object(util["j" /* localStorageRead */])('view') != null) {
    document.body.setAttribute('data-view', Object(util["j" /* localStorageRead */])('view'));
    if (Object(util["j" /* localStorageRead */])('view') === 1) {
        window.addEventListener('resize', resizer["c" /* resizeCaller */]);
    }
}
// Additionally, the active class needs to be added when inputs are selected (for the login box).
INPUT_ELEMENTS.forEach((input) => {
    input.addEventListener('change', (evt) => {
        Object(util["b" /* _$h */])(Object(util["b" /* _$h */])(input.parentNode).querySelector('label')).classList.add('active');
    });
    input.addEventListener('focus', (evt) => {
        Object(util["b" /* _$h */])(Object(util["b" /* _$h */])(input.parentNode).querySelector('label')).classList.add('active');
    });
    input.addEventListener('blur', (evt) => {
        if (input.value.length === 0) {
            Object(util["b" /* _$h */])(Object(util["b" /* _$h */])(input.parentNode).querySelector('label')).classList.remove('active');
        }
    });
});
// When the escape key is pressed, the current assignment should be closed.
window.addEventListener('keydown', (evt) => {
    if (evt.which === 27) { // Escape key pressed
        if (document.getElementsByClassName('full').length !== 0) {
            return Object(components_assignment["a" /* closeOpened */])(new Event('Generated Event'));
        }
    }
});
// If it's winter time, a class is added to the body element.
(() => {
    const todayDate = new Date();
    if (new Date(todayDate.getFullYear(), 10, 27) <= todayDate &&
        todayDate <= new Date(todayDate.getFullYear(), 11, 32)) {
        return document.body.classList.add('winter');
    }
})();
// For the navbar toggle buttons, a function to toggle the action is defined to eliminate code.
function navToggle(elem, ls, f) {
    Object(util["n" /* ripple */])(Object(util["g" /* elemById */])(elem));
    Object(util["g" /* elemById */])(elem).addEventListener('mouseup', () => {
        document.body.classList.toggle(ls);
        Object(resizer["b" /* resize */])();
        Object(util["k" /* localStorageWrite */])(ls, document.body.classList.contains(ls));
        if (f != null)
            f();
    });
    if (Object(util["j" /* localStorageRead */])(ls))
        document.body.classList.add(ls);
}
// The button to show/hide completed assignments in list view also needs event listeners.
navToggle('cvButton', 'showDone', () => setTimeout(resizer["b" /* resize */], 1000));
// The same goes for the button that shows upcoming tests.
navToggle('infoButton', 'showInfo');
// This also gets repeated for the theme toggling.
navToggle('lightButton', 'dark');
function setupDateListener(opts) {
    const { elem, from, current, to, hooks, forward, newsupplier } = opts;
    elem.addEventListener('click', () => {
        const transfrom = forward ? 'translateX(0%)' : 'translateX(-100%)';
        const transto = forward ? 'translateX(-100%)' : 'translateX(0%)';
        hooks.forEach((hook) => hook());
        to.style.display = 'inline-block';
        Promise.race([
            Object(util["c" /* animateEl */])(current, [
                { transform: transfrom, opacity: 1 },
                { opacity: 0 },
                { transform: transto, opacity: 0 }
            ], { duration: 300, easing: 'ease-out' }),
            Object(util["c" /* animateEl */])(to, [
                { transform: transfrom, opacity: 0 },
                { opacity: 0 },
                { transform: transto, opacity: 1 }
            ], { duration: 300, easing: 'ease-out' })
        ]).then(() => {
            from.innerHTML = current.innerHTML;
            current.innerHTML = to.innerHTML;
            to.innerHTML = newsupplier();
            to.style.display = 'none';
        });
    });
}
setupDateListener({
    elem: Object(util["g" /* elemById */])('listnext'),
    from: Object(util["g" /* elemById */])('listprevdate'),
    current: Object(util["g" /* elemById */])('listnowdate'),
    to: Object(util["g" /* elemById */])('listnextdate'),
    hooks: [() => Object(state["c" /* incrementState */])(state["d" /* state */].listDateOffset), display["a" /* display */]],
    forward: true,
    newsupplier: () => {
        const listDate2 = new Date();
        listDate2.setDate(listDate2.getDate() + 1 + state["d" /* state */].listDateOffset.get());
        return Object(util["f" /* dateString */])(listDate2).replace('Today', 'Now');
    }
});
setupDateListener({
    elem: Object(util["g" /* elemById */])('listbefore'),
    from: Object(util["g" /* elemById */])('listnextdate'),
    current: Object(util["g" /* elemById */])('listnowdate'),
    to: Object(util["g" /* elemById */])('listprevdate'),
    hooks: [() => Object(state["a" /* decrementState */])(state["d" /* state */].listDateOffset), display["a" /* display */]],
    forward: false,
    newsupplier: () => {
        const listDate2 = new Date();
        listDate2.setDate(listDate2.getDate() - 1 + state["d" /* state */].listDateOffset.get());
        return Object(util["f" /* dateString */])(listDate2).replace('Today', 'Now');
    }
});
function lazyFetch() {
    Array.from(document.querySelectorAll('.week, .upcomingTest'))
        .forEach((s) => s.remove());
    document.body.removeAttribute('data-pcrview');
    if (state["d" /* state */].calDateOffset.get() === 0) {
        state["d" /* state */].data.revert();
        Object(display["a" /* display */])();
    }
    else {
        Object(pcr["c" /* fetch */])(true);
    }
}
setupDateListener({
    elem: Object(util["g" /* elemById */])('calnext'),
    from: Object(util["g" /* elemById */])('calprevdate'),
    current: Object(util["g" /* elemById */])('calnowdate'),
    to: Object(util["g" /* elemById */])('calnextdate'),
    hooks: [() => Object(state["c" /* incrementState */])(state["d" /* state */].calDateOffset), lazyFetch],
    forward: true,
    newsupplier: () => {
        const listDate2 = new Date();
        listDate2.setMonth(listDate2.getMonth() + 1 + state["d" /* state */].calDateOffset.get());
        return Object(util["l" /* monthString */])(listDate2).replace('Today', 'Now');
    }
});
setupDateListener({
    elem: Object(util["g" /* elemById */])('calbefore'),
    from: Object(util["g" /* elemById */])('calnextdate'),
    current: Object(util["g" /* elemById */])('calnowdate'),
    to: Object(util["g" /* elemById */])('calprevdate'),
    hooks: [() => Object(state["a" /* decrementState */])(state["d" /* state */].calDateOffset), lazyFetch],
    forward: false,
    newsupplier: () => {
        const listDate2 = new Date();
        listDate2.setMonth(listDate2.getMonth() - 1 + state["d" /* state */].calDateOffset.get());
        return Object(util["l" /* monthString */])(listDate2);
    }
});
function updateListNav() {
    const d = new Date();
    d.setDate((d.getDate() + state["d" /* state */].listDateOffset.get()) - 1);
    const up = (id) => {
        Object(util["g" /* elemById */])(id).innerHTML = Object(util["f" /* dateString */])(d).replace('Today', 'Now');
        return d.setDate(d.getDate() + 1);
    };
    up('listprevdate');
    up('listnowdate');
    up('listnextdate');
}
function updateCalNav() {
    const d = new Date();
    d.setMonth((d.getMonth() + state["d" /* state */].calDateOffset.get()) - 1);
    const up = (id) => {
        Object(util["g" /* elemById */])(id).innerHTML = Object(util["l" /* monthString */])(d);
        return d.setMonth(d.getMonth() + 1);
    };
    up('calprevdate');
    up('calnowdate');
    up('calnextdate');
}
// Whenever a date is double clicked, long tapped, or force touched, list view for that day is displayed.
function updateDateNavs() {
    updateListNav();
    updateCalNav();
}
function switchToList(evt) {
    if (Object(util["b" /* _$h */])(evt.target).classList.contains('month') || Object(util["b" /* _$h */])(evt.target).classList.contains('date')) {
        state["d" /* state */].listDateOffset.set(Object(dates["c" /* toDateNum */])(Number(Object(util["b" /* _$h */])(Object(util["b" /* _$h */])(evt.target).parentNode).getAttribute('data-date'))) - Object(dates["d" /* today */])());
        updateDateNavs();
        document.body.setAttribute('data-view', '1');
        return Object(display["a" /* display */])();
    }
}
document.body.addEventListener('dblclick', switchToList);
document.body.addEventListener('webkitmouseforceup', switchToList);
(() => {
    let taptimer = null;
    document.body.addEventListener('touchstart', (evt) => taptimer = setTimeout((() => switchToList(evt)), 1000));
    document.body.addEventListener('touchend', (evt) => {
        if (taptimer)
            clearTimeout(taptimer);
        taptimer = null;
    });
})();
// <a name="side"/>
// Side menu and Navbar
// --------------------
//
// The [Headroom library](https://github.com/WickyNilliams/headroom.js) is used to show the navbar when scrolling up
const headroom = new Headroom(Object(util["a" /* _$ */])(document.querySelector('nav')), {
    tolerance: 10,
    offset: 66
});
headroom.init();
// Also, the side menu needs event listeners.
Object(util["g" /* elemById */])('collapseButton').addEventListener('click', () => {
    document.body.style.overflow = 'hidden';
    Object(util["g" /* elemById */])('sideNav').classList.add('active');
    return Object(util["g" /* elemById */])('sideBackground').style.display = 'block';
});
Object(util["g" /* elemById */])('sideBackground').addEventListener('click', () => {
    Object(util["g" /* elemById */])('sideBackground').style.opacity = '0';
    Object(util["g" /* elemById */])('sideNav').classList.remove('active');
    Object(util["g" /* elemById */])('dragTarget').style.width = '';
    return setTimeout(() => {
        document.body.style.overflow = 'auto';
        Object(util["g" /* elemById */])('sideBackground').style.display = 'none';
    }, 350);
});
Object(avatar["a" /* updateAvatar */])();
// <a name="athena"/> Athena (Schoology)
// ------------------
//
// <a name="settings"/> Settings
// --------
//
// The code below updates the current version text in the settings. I should've put this under the
// Updates section, but it should go before the display() function forces a reflow.
Object(util["g" /* elemById */])('version').innerHTML = app["a" /* VERSION */];
// To bring up the settings window, an event listener needs to be added to the button.
Object(util["g" /* elemById */])('settingsB').addEventListener('click', () => {
    Object(util["g" /* elemById */])('sideBackground').click();
    document.body.classList.add('settingsShown');
    Object(util["g" /* elemById */])('brand').innerHTML = 'Settings';
    return setTimeout(() => {
        Object(util["b" /* _$h */])(document.querySelector('main')).style.display = 'none';
    });
});
// The back button also needs to close the settings window.
Object(util["g" /* elemById */])('backButton').addEventListener('click', () => {
    Object(util["b" /* _$h */])(document.querySelector('main')).style.display = 'block';
    document.body.classList.remove('settingsShown');
    return Object(util["g" /* elemById */])('brand').innerHTML = 'Check PCR';
});
// The code below is what the settings control.
if (state["d" /* state */].sepTasks.get()) {
    Object(util["g" /* elemById */])('info').classList.add('isTasks');
    Object(util["g" /* elemById */])('new').style.display = 'none';
}
if (state["d" /* state */].holidayThemes.get()) {
    document.body.classList.add('holidayThemes');
}
if (state["d" /* state */].sepTaskClass.get()) {
    document.body.classList.add('sepTaskClass');
}
let assignmentColors = Object(util["j" /* localStorageRead */])('assignmentColors', {
    classwork: '#689f38', homework: '#2196f3', longterm: '#f57c00', test: '#f44336'
});
let classColors = Object(util["j" /* localStorageRead */])('classColors', () => {
    const cc = {};
    const data = state["d" /* state */].data.get();
    if (!data)
        return cc;
    data.classes.forEach((c) => {
        cc[c] = '#616161';
    });
    return cc;
});
Object(util["g" /* elemById */])(`${state["d" /* state */].colorType.get()}Colors`).style.display = 'block';
window.addEventListener('focus', () => {
    if (state["d" /* state */].refreshOnFocus.get())
        Object(pcr["c" /* fetch */])();
});
function intervalRefresh() {
    const r = state["d" /* state */].refreshRate.get();
    if (r > 0) {
        setTimeout(() => {
            console.debug('Refreshing because of timer');
            Object(pcr["c" /* fetch */])();
            intervalRefresh();
        }, r * 60 * 1000);
    }
}
intervalRefresh();
// For choosing colors, the color choosing boxes need to be initialized.
const palette = {
    '#f44336': '#B71C1C',
    '#e91e63': '#880E4F',
    '#9c27b0': '#4A148C',
    '#673ab7': '#311B92',
    '#3f51b5': '#1A237E',
    '#2196f3': '#0D47A1',
    '#03a9f4': '#01579B',
    '#00bcd4': '#006064',
    '#009688': '#004D40',
    '#4caf50': '#1B5E20',
    '#689f38': '#33691E',
    '#afb42b': '#827717',
    '#fbc02d': '#F57F17',
    '#ffa000': '#FF6F00',
    '#f57c00': '#E65100',
    '#ff5722': '#BF360C',
    '#795548': '#3E2723',
    '#616161': '#212121'
};
Object(pcr["e" /* getClasses */])().forEach((c) => {
    const d = Object(util["h" /* element */])('div', [], c);
    d.setAttribute('data-control', c);
    d.appendChild(Object(util["h" /* element */])('span', []));
    Object(util["g" /* elemById */])('classColors').appendChild(d);
});
document.querySelectorAll('.colors').forEach((e) => {
    e.querySelectorAll('div').forEach((color) => {
        const controlledColor = color.getAttribute('data-control');
        if (!controlledColor)
            throw new Error('Element has no controlled color');
        const sp = Object(util["b" /* _$h */])(color.querySelector('span'));
        const listName = e.getAttribute('id') === 'classColors' ? 'classColors' : 'assignmentColors';
        const listSetter = (v) => {
            e.getAttribute('id') === 'classColors' ? classColors = v : assignmentColors = v;
        };
        const list = e.getAttribute('id') === 'classColors' ? classColors : assignmentColors;
        sp.style.backgroundColor = list[controlledColor];
        Object.keys(palette).forEach((p) => {
            const pe = Object(util["h" /* element */])('span', []);
            pe.style.backgroundColor = p;
            if (p === list[controlledColor]) {
                pe.classList.add('selected');
            }
            sp.appendChild(pe);
        });
        const custom = Object(util["h" /* element */])('span', ['customColor'], `<a>Custom</a> \
    <input type='text' placeholder='Was ${list[controlledColor]}' /> \
    <span class='customInfo'>Use any CSS valid color name, such as \
    <code>#F44336</code> or <code>rgb(64, 43, 2)</code> or <code>cyan</code></span> \
    <a class='customOk'>Set</a>`);
        custom.addEventListener('click', (evt) => evt.stopPropagation());
        Object(util["a" /* _$ */])(custom.querySelector('a')).addEventListener('click', (evt) => {
            sp.classList.toggle('onCustom');
            evt.stopPropagation();
        });
        sp.addEventListener('click', (evt) => {
            if (sp.classList.contains('choose')) {
                const target = Object(util["b" /* _$h */])(evt.target);
                const bg = tinycolor(target.style.backgroundColor || '#000').toHexString();
                list[controlledColor] = bg;
                sp.style.backgroundColor = bg;
                const selected = target.querySelector('.selected');
                if (selected) {
                    selected.classList.remove('selected');
                }
                target.classList.add('selected');
                Object(util["k" /* localStorageWrite */])(listName, JSON.stringify(list));
                listSetter(list);
                updateColors();
            }
            sp.classList.toggle('choose');
        });
        Object(util["a" /* _$ */])(custom.querySelector('.customOk')).addEventListener('click', (evt) => {
            sp.classList.remove('onCustom');
            sp.classList.toggle('choose');
            const selectedEl = sp.querySelector('.selected');
            if (selectedEl != null) {
                selectedEl.classList.remove('selected');
            }
            sp.style.backgroundColor = (list[controlledColor] = Object(util["a" /* _$ */])(custom.querySelector('input')).value);
            Object(util["k" /* localStorageWrite */])(listName, list);
            updateColors();
            return evt.stopPropagation();
        });
    });
});
// Then, a function that updates the color preferences is defined.
function updateColors() {
    const style = document.createElement('style');
    style.appendChild(document.createTextNode(''));
    document.head.appendChild(style);
    const sheet = Object(util["a" /* _$ */])(style.sheet);
    const addColorRule = (selector, light, dark, extra = '') => {
        const mixed = tinycolor.mix(light, '#1B5E20', 70).toHexString();
        sheet.insertRule(`${extra}.assignment${selector} { background-color: ${light}; }`, 0);
        sheet.insertRule(`${extra}.assignment${selector}.done { background-color: ${dark}; }`, 0);
        sheet.insertRule(`${extra}.assignment${selector}::before { background-color: ${mixed}; }`, 0);
        sheet.insertRule(`${extra}.assignmentItem${selector}>i { background-color: ${light}; }`, 0);
        sheet.insertRule(`${extra}.assignmentItem${selector}.done>i { background-color: ${dark}; }`, 0);
    };
    const createPalette = (color) => tinycolor(color).darken(24).toHexString();
    if (state["d" /* state */].colorType.get() === 'assignment') {
        Object.entries(assignmentColors).forEach(([name, color]) => {
            addColorRule(`.${name}`, color, palette[color] || createPalette(color));
        });
    }
    else {
        Object.entries(classColors).forEach(([name, color]) => {
            addColorRule(`[data-class=\"${name}\"]`, color, palette[color] || createPalette(color));
        });
    }
    addColorRule('.task', '#F5F5F5', '#E0E0E0');
    addColorRule('.task', '#424242', '#212121', '.dark ');
}
// The function then needs to be called.
updateColors();
// The elements that control the settings also need event listeners
document.querySelectorAll('.settingsControl').forEach((e) => {
    const setting = Object(state["b" /* getStateItem */])(e.name);
    if (e.type === 'checkbox') {
        e.checked = setting.get();
    }
    else {
        e.value = setting.get();
    }
    e.addEventListener('change', (evt) => {
        if (e.type === 'checkbox') {
            setting.set(e.checked);
        }
        else {
            setting.set(e.value);
        }
        switch (e.name) {
            case 'refreshRate': return intervalRefresh();
            case 'earlyTest': return Object(display["a" /* display */])();
            case 'assignmentSpan': return Object(display["a" /* display */])();
            case 'projectsInTestPane': return Object(display["a" /* display */])();
            case 'hideAssignments': return Object(display["a" /* display */])();
            case 'holidayThemes': return document.body.classList.toggle('holidayThemes', e.checked);
            case 'sepTaskClass':
                document.body.classList.toggle('sepTaskClass', e.checked);
                return Object(display["a" /* display */])();
            case 'sepTasks': return Object(util["g" /* elemById */])('sepTasksRefresh').style.display = 'block';
        }
    });
});
// This also needs to be done for radio buttons
const colorType = Object(util["a" /* _$ */])(document.querySelector(`input[name=\"colorType\"][value=\"${state["d" /* state */].colorType.get()}\"]`));
colorType.checked = true;
Array.from(document.getElementsByName('colorType')).forEach((c) => {
    c.addEventListener('change', (evt) => {
        const v = Object(util["a" /* _$ */])(document.querySelector('input[name="colorType"]:checked')).value;
        if (v !== 'assignment' && v !== 'class')
            return;
        state["d" /* state */].colorType.set(v);
        if (v === 'class') {
            Object(util["g" /* elemById */])('assignmentColors').style.display = 'none';
            Object(util["g" /* elemById */])('classColors').style.display = 'block';
        }
        else {
            Object(util["g" /* elemById */])('assignmentColors').style.display = 'block';
            Object(util["g" /* elemById */])('classColors').style.display = 'none';
        }
        return updateColors();
    });
});
// The same goes for textareas.
document.querySelectorAll('textarea').forEach((e) => {
    if ((e.name !== 'athenaDataRaw') && (Object(util["j" /* localStorageRead */])(e.name, null) != null)) {
        e.value = Object(util["j" /* localStorageRead */])(e.name);
    }
    e.addEventListener('input', (evt) => {
        Object(util["k" /* localStorageWrite */])(e.name, e.value);
        if (e.name === 'athenaDataRaw') {
            Object(athena["a" /* updateAthenaData */])(e.value);
        }
    });
});
// <a name="starting"/>
// Starting everything
// -------------------
//
// Finally! We are (almost) done!
//
// Before getting to anything, let's print out a welcoming message to the console!
console.log('%cCheck PCR', 'color: #004000; font-size: 3em');
console.log(`%cVersion ${app["a" /* VERSION */]} (Check below for current version)`, 'font-size: 1.1em');
console.log(`Welcome to the developer console for your browser! Besides looking at the source code, \
you can also play around with Check PCR by executing the lines below:
%c\tfetch(true)               %c// Reloads all of your assignments (the true is for forcing a reload if one \
has already been triggered in the last minute)
%c\tdata                      %c// Displays the object that contains the data parsed from PCR's interface
%c\tactivity                  %c// The data for the assignments that show up in the activity pane
%c\textra                     %c// All of the tasks you've created by clicking the + button
%c\tathenaData                %c// The data fetched from Athena (if you've pasted the raw data into settings)
%c\tsnackbar("Hello World!")  %c// Creates a snackbar showing the message "Hello World!"
%c\tdisplayError(new Error()) %c// Displays the stack trace for a random error (Just don't submit it!)
%c\tcloseError()              %c// Closes that dialog`, ...([].concat(...Array.from(new Array(8), () => ['color: initial', 'color: grey']))));
console.log('');
// The "last updated" text is set to the correct date.
const triedLastUpdate = state["d" /* state */].lastUpdate.get();
Object(util["g" /* elemById */])('lastUpdate').innerHTML = triedLastUpdate !== 0 ? Object(display["b" /* formatUpdate */])(triedLastUpdate) : 'Never';
if (Object(util["j" /* localStorageRead */])('data') != null) {
    // Now check if there's activity
    Object(activity["b" /* recentActivity */])().forEach((item) => {
        Object(activity["a" /* addActivity */])(item[0], item[1], new Date(item[2]), false, item[3]);
    });
    Object(display["a" /* display */])();
}
Object(pcr["c" /* fetch */])();
// <a name="events"/>
// Events
// ------
//
// The document body needs to be enabled for hammer.js events.
delete Hammer.defaults.cssProps.userSelect;
const hammertime = new Hammer.Manager(document.body, {
    recognizers: [
        [Hammer.Pan, { direction: Hammer.DIRECTION_HORIZONTAL }]
    ]
});
// For touch displays, hammer.js is used to make the side menu appear/disappear. The code below is
// adapted from Materialize's implementation.
let menuOut = false;
const dragTarget = new Hammer(Object(util["g" /* elemById */])('dragTarget'));
dragTarget.on('pan', (e) => {
    if (e.pointerType === 'touch') {
        e.preventDefault();
        let { x } = e.center;
        const { y } = e.center;
        const sBkg = Object(util["g" /* elemById */])('sideBackground');
        sBkg.style.display = 'block';
        sBkg.style.opacity = '0';
        Object(util["g" /* elemById */])('sideNav').classList.add('manual');
        // Keep within boundaries
        if (x > 240) {
            x = 240;
        }
        else if (x < 0) {
            x = 0;
            // Left Direction
            if (x < 120) {
                menuOut = false;
                // Right Direction
            }
            else if (x >= 120) {
                menuOut = true;
            }
        }
        Object(util["g" /* elemById */])('sideNav').style.transform = `translateX(${x - 240}px)`;
        const overlayPercent = Math.min(x / 480, 0.5);
        return sBkg.style.opacity = String(overlayPercent);
    }
});
dragTarget.on('panend', (e) => {
    if (e.pointerType === 'touch') {
        let sideNav;
        const { velocityX } = e;
        // If velocityX <= 0.3 then the user is flinging the menu closed so ignore menuOut
        if ((menuOut && (velocityX <= 0.3)) || (velocityX < -0.5)) {
            sideNav = Object(util["g" /* elemById */])('sideNav');
            sideNav.classList.remove('manual');
            sideNav.classList.add('active');
            sideNav.style.transform = '';
            Object(util["g" /* elemById */])('dragTarget').style.width = '100%';
        }
        else if (!menuOut || (velocityX > 0.3)) {
            document.body.style.overflow = 'auto';
            sideNav = Object(util["g" /* elemById */])('sideNav');
            sideNav.classList.remove('manual');
            sideNav.classList.remove('active');
            sideNav.style.transform = '';
            Object(util["g" /* elemById */])('sideBackground').style.opacity = '';
            Object(util["g" /* elemById */])('dragTarget').style.width = '10px';
            setTimeout(() => Object(util["g" /* elemById */])('sideBackground').style.display = 'none', 350);
        }
    }
});
dragTarget.on('tap', (e) => {
    Object(util["g" /* elemById */])('sideBackground').click();
    e.preventDefault();
});
const dt = document.getElementById('dragTarget');
// The activity filter button also needs an event listener.
Object(util["n" /* ripple */])(Object(util["g" /* elemById */])('filterActivity'));
Object(util["g" /* elemById */])('filterActivity').addEventListener('click', () => {
    Object(util["g" /* elemById */])('infoActivity').classList.toggle('filter');
});
// At the start, it needs to be correctly populated
const activityTypes = state["d" /* state */].shownActivity.get();
function updateSelectNum() {
    const c = (bool) => bool ? 1 : 0;
    const count = String(c(activityTypes.add) + c(activityTypes.edit) + c(activityTypes.delete));
    return Object(util["g" /* elemById */])('selectNum').innerHTML = count;
}
updateSelectNum();
Object.entries(activityTypes).forEach(([type, enabled]) => {
    if (type !== 'add' && type !== 'edit' && type !== 'delete') {
        throw new Error(`Invalid activity type ${type}`);
    }
    const selectEl = Object(util["g" /* elemById */])(type + 'Select');
    selectEl.checked = enabled;
    if (enabled) {
        Object(util["g" /* elemById */])('infoActivity').classList.add(type);
    }
    selectEl.addEventListener('change', (evt) => {
        activityTypes[type] = selectEl.checked;
        Object(util["g" /* elemById */])('infoActivity').setAttribute('data-filtered', updateSelectNum());
        Object(util["g" /* elemById */])('infoActivity').classList.toggle(type);
        state["d" /* state */].shownActivity.set(activityTypes);
    });
});
// The show completed tasks checkbox is set correctly and is assigned an event listener.
const showDoneTasksEl = Object(util["g" /* elemById */])('showDoneTasks');
if (state["d" /* state */].showDoneTasks.get()) {
    showDoneTasksEl.checked = true;
    Object(util["g" /* elemById */])('infoTasksInner').classList.add('showDoneTasks');
}
showDoneTasksEl.addEventListener('change', () => {
    state["d" /* state */].showDoneTasks.set(showDoneTasksEl.checked);
    Object(util["g" /* elemById */])('infoTasksInner').classList.toggle('showDoneTasks', state["d" /* state */].showDoneTasks.get());
});
// <a name="updates"/>
// Updates and News
// ----------------
//
if (location.protocol === 'chrome-extension:') {
    Object(app["b" /* checkCommit */])();
}
// This update dialog also needs to be closed when the buttons are clicked.
Object(util["g" /* elemById */])('updateDelay').addEventListener('click', () => {
    Object(util["g" /* elemById */])('update').classList.remove('active');
    setTimeout(() => {
        Object(util["g" /* elemById */])('updateBackground').style.display = 'none';
    }, 350);
});
// For news, the latest news is fetched from a GitHub gist.
Object(app["c" /* fetchNews */])();
// The news dialog then needs to be closed when OK or the background is clicked.
function closeNews() {
    Object(util["g" /* elemById */])('news').classList.remove('active');
    setTimeout(() => {
        Object(util["g" /* elemById */])('newsBackground').style.display = 'none';
    }, 350);
}
Object(util["g" /* elemById */])('newsOk').addEventListener('click', closeNews);
Object(util["g" /* elemById */])('newsBackground').addEventListener('click', closeNews);
// It also needs to be opened when the news button is clicked.
Object(util["g" /* elemById */])('newsB').addEventListener('click', () => {
    Object(util["g" /* elemById */])('sideBackground').click();
    const displayNews = () => {
        Object(util["g" /* elemById */])('newsBackground').style.display = 'block';
        return Object(util["g" /* elemById */])('news').classList.add('active');
    };
    if (Object(util["g" /* elemById */])('newsContent').childNodes.length === 0) {
        Object(app["d" /* getNews */])().catch(displayNews);
    }
    else {
        displayNews();
    }
});
// The same goes for the error dialog.
function closeError() {
    Object(util["g" /* elemById */])('error').classList.remove('active');
    setTimeout(() => {
        Object(util["g" /* elemById */])('errorBackground').style.display = 'none';
    }, 350);
}
Object(util["g" /* elemById */])('errorNo').addEventListener('click', closeError);
Object(util["g" /* elemById */])('errorBackground').addEventListener('click', closeError);
// <a name="new"/>
// Adding new assignments
// ----------------------
//
// The event listeners for the new buttons are added.
Object(util["n" /* ripple */])(Object(util["g" /* elemById */])('new'));
Object(util["n" /* ripple */])(Object(util["g" /* elemById */])('newTask'));
const onNewTask = () => {
    updateNewTips(Object(util["g" /* elemById */])('newText').value = '');
    document.body.style.overflow = 'hidden';
    Object(util["g" /* elemById */])('newBackground').style.display = 'block';
    Object(util["g" /* elemById */])('newDialog').classList.add('active');
    Object(util["g" /* elemById */])('newText').focus();
};
Object(util["g" /* elemById */])('new').addEventListener('mouseup', onNewTask);
Object(util["g" /* elemById */])('newTask').addEventListener('mouseup', onNewTask);
// A function to close the dialog is then defined.
function closeNew() {
    document.body.style.overflow = 'auto';
    Object(util["g" /* elemById */])('newDialog').classList.remove('active');
    setTimeout(() => {
        Object(util["g" /* elemById */])('newBackground').style.display = 'none';
    }, 350);
}
// This function is set to be called called when the ESC key is called inside of the dialog.
Object(util["g" /* elemById */])('newText').addEventListener('keydown', (evt) => {
    if (evt.which === 27) { // Escape key pressed
        closeNew();
    }
});
// An event listener to call the function is also added to the X button
Object(util["g" /* elemById */])('newCancel').addEventListener('click', closeNew);
// When the enter key is pressed or the submit button is clicked, the new assignment is added.
Object(util["g" /* elemById */])('newDialog').addEventListener('submit', (evt) => {
    evt.preventDefault();
    const itext = Object(util["g" /* elemById */])('newText').value;
    const { text, cls, due, st } = Object(customAssignments["d" /* parseCustomTask */])(itext);
    let end = 'Forever';
    const start = (st != null) ? Object(dates["c" /* toDateNum */])(chrono.parseDate(st)) : Object(dates["d" /* today */])();
    if (due != null) {
        end = Object(dates["c" /* toDateNum */])(chrono.parseDate(due));
        if (end < start) { // Assignment ends before it is assigned
            end += Math.ceil((start - end) / 7) * 7;
        }
    }
    Object(customAssignments["a" /* addToExtra */])({
        body: text.charAt(0).toUpperCase() + text.substr(1),
        done: false,
        start,
        class: (cls != null) ? cls.toLowerCase().trim() : null,
        end
    });
    Object(customAssignments["f" /* saveExtra */])();
    closeNew();
    Object(display["a" /* display */])(false);
});
updateNewTips('', false);
Object(util["g" /* elemById */])('newText').addEventListener('input', () => {
    return updateNewTips(Object(util["g" /* elemById */])('newText').value);
});
// The code below registers a service worker that caches the page so it can be viewed offline.
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then((registration) => 
    // Registration was successful
    console.log('ServiceWorker registration successful with scope', registration.scope)).catch((err) => 
    // registration failed :(
    console.log('ServiceWorker registration failed: ', err));
}
// If the service worker detects that the web app has been updated, the commit is fetched from GitHub.
navigator.serviceWorker.addEventListener('message', (event) => {
    console.log('Getting commit because of serviceworker');
    if (event.data.getCommit) {
        return Object(app["b" /* checkCommit */])();
    }
});


/***/ })
/******/ ]);
//# sourceMappingURL=app-bundle.js.map