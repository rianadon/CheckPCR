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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/client.ts");
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

/***/ "./src/client.ts":
/*!***********************!*\
  !*** ./src/client.ts ***!
  \***********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app */ "./src/app.ts");
/* harmony import */ var _components_assignment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/assignment */ "./src/components/assignment.ts");
/* harmony import */ var _components_avatar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/avatar */ "./src/components/avatar.ts");
/* harmony import */ var _components_customAdder__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/customAdder */ "./src/components/customAdder.ts");
/* harmony import */ var _components_resizer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/resizer */ "./src/components/resizer.ts");
/* harmony import */ var _dates__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./dates */ "./src/dates.ts");
/* harmony import */ var _display__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./display */ "./src/display.ts");
/* harmony import */ var _navigation__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./navigation */ "./src/navigation.ts");
/* harmony import */ var _pcr__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./pcr */ "./src/pcr.ts");
/* harmony import */ var _plugins_activity__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./plugins/activity */ "./src/plugins/activity.ts");
/* harmony import */ var _plugins_athena__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./plugins/athena */ "./src/plugins/athena.ts");
/* harmony import */ var _plugins_customAssignments__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./plugins/customAssignments */ "./src/plugins/customAssignments.ts");
/* harmony import */ var _settings__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./settings */ "./src/settings.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./util */ "./src/util.ts");














if (Object(_util__WEBPACK_IMPORTED_MODULE_13__["localStorageRead"])('data') != null) {
    Object(_pcr__WEBPACK_IMPORTED_MODULE_8__["setData"])(Object(_util__WEBPACK_IMPORTED_MODULE_13__["localStorageRead"])('data'));
}
// Additionally, if it's the user's first time, the page is set to the welcome page.
if (!Object(_util__WEBPACK_IMPORTED_MODULE_13__["localStorageRead"])('noWelcome')) {
    Object(_util__WEBPACK_IMPORTED_MODULE_13__["localStorageWrite"])('noWelcome', true);
    window.location.href = 'welcome.html';
}
const NAV_ELEMENT = Object(_util__WEBPACK_IMPORTED_MODULE_13__["_$"])(document.querySelector('nav'));
const INPUT_ELEMENTS = document.querySelectorAll('input[type=text]:not(#newText):not([readonly]), input[type=password], input[type=email], ' +
    'input[type=url], input[type=tel], input[type=number]:not(.control), input[type=search]');
// #### Send function
//
// This function displays a snackbar to tell the user something
// <a name="ret"/>
// Retrieving data
// ---------------
//
Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('login').addEventListener('submit', (evt) => {
    evt.preventDefault();
    Object(_pcr__WEBPACK_IMPORTED_MODULE_8__["dologin"])(null, true);
});
// The view switching button needs an event handler.
Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('switchViews').addEventListener('click', _pcr__WEBPACK_IMPORTED_MODULE_8__["switchViews"]);
// The same goes for the log out button.
Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('logout').addEventListener('click', _pcr__WEBPACK_IMPORTED_MODULE_8__["logout"]);
// Now we assign it to clicking the background.
Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('background').addEventListener('click', _components_assignment__WEBPACK_IMPORTED_MODULE_1__["closeOpened"]);
// Then, the tabs are made interactive.
document.querySelectorAll('#navTabs>li').forEach((tab, tabIndex) => {
    tab.addEventListener('click', (evt) => {
        if (!_settings__WEBPACK_IMPORTED_MODULE_12__["settings"].viewTrans) {
            document.body.classList.add('noTrans');
            Object(_util__WEBPACK_IMPORTED_MODULE_13__["forceLayout"])(document.body);
        }
        Object(_util__WEBPACK_IMPORTED_MODULE_13__["localStorageWrite"])('view', tabIndex);
        document.body.setAttribute('data-view', String(tabIndex));
        if (tabIndex === 1) {
            window.addEventListener('resize', _components_resizer__WEBPACK_IMPORTED_MODULE_4__["resizeCaller"]);
            if (_settings__WEBPACK_IMPORTED_MODULE_12__["settings"].viewTrans) {
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
                const assignments = Object(_components_resizer__WEBPACK_IMPORTED_MODULE_4__["getResizeAssignments"])();
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
                            const [eName, sName] = Object(_components_assignment__WEBPACK_IMPORTED_MODULE_1__["getES"])(assignment);
                            const oldLeft = Number(sName.substring(1)) * 100 / 7 + '%';
                            const oldRight = Number(eName.substring(1)) * 100 / 7 + '%';
                            const left = ((100 / columns) * col) + '%';
                            const right = ((100 / columns) * (columns - col - 1)) + '%';
                            Object(_util__WEBPACK_IMPORTED_MODULE_13__["animateEl"])(assignment, [
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
                Object(_components_resizer__WEBPACK_IMPORTED_MODULE_4__["resize"])();
            }
            Object(_navigation__WEBPACK_IMPORTED_MODULE_7__["zeroDateOffsets"])();
            updateDateNavs();
        }
        else {
            window.scrollTo(0, Object(_display__WEBPACK_IMPORTED_MODULE_6__["getScroll"])());
            NAV_ELEMENT.classList.add('headroom--locked');
            setTimeout(() => {
                NAV_ELEMENT.classList.remove('headroom--unpinned');
                NAV_ELEMENT.classList.remove('headroom--locked');
                NAV_ELEMENT.classList.add('headroom--pinned');
            }, 350);
            Object(_util__WEBPACK_IMPORTED_MODULE_13__["requestIdleCallback"])(() => {
                Object(_navigation__WEBPACK_IMPORTED_MODULE_7__["zeroDateOffsets"])();
                lazyFetch();
                updateDateNavs();
                Object(_display__WEBPACK_IMPORTED_MODULE_6__["display"])();
            }, { timeout: 2000 });
            window.removeEventListener('resize', _components_resizer__WEBPACK_IMPORTED_MODULE_4__["resizeCaller"]);
            document.querySelectorAll('.assignment').forEach((assignment) => {
                assignment.style.top = 'auto';
            });
        }
        if (!_settings__WEBPACK_IMPORTED_MODULE_12__["settings"].viewTrans) {
            Object(_util__WEBPACK_IMPORTED_MODULE_13__["forceLayout"])(document.body);
            setTimeout(() => {
                document.body.classList.remove('noTrans');
            }, 350);
        }
    });
});
// And the info tabs (just a little less code)
document.querySelectorAll('#infoTabs>li').forEach((tab, tabIndex) => {
    tab.addEventListener('click', (evt) => {
        Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('info').setAttribute('data-view', String(tabIndex));
    });
});
// The view is set to what it was last.
if (Object(_util__WEBPACK_IMPORTED_MODULE_13__["localStorageRead"])('view') != null) {
    document.body.setAttribute('data-view', Object(_util__WEBPACK_IMPORTED_MODULE_13__["localStorageRead"])('view'));
    if (Object(_util__WEBPACK_IMPORTED_MODULE_13__["localStorageRead"])('view') === 1) {
        window.addEventListener('resize', _components_resizer__WEBPACK_IMPORTED_MODULE_4__["resizeCaller"]);
    }
}
// Additionally, the active class needs to be added when inputs are selected (for the login box).
INPUT_ELEMENTS.forEach((input) => {
    input.addEventListener('change', (evt) => {
        Object(_util__WEBPACK_IMPORTED_MODULE_13__["_$h"])(Object(_util__WEBPACK_IMPORTED_MODULE_13__["_$h"])(input.parentNode).querySelector('label')).classList.add('active');
    });
    input.addEventListener('focus', (evt) => {
        Object(_util__WEBPACK_IMPORTED_MODULE_13__["_$h"])(Object(_util__WEBPACK_IMPORTED_MODULE_13__["_$h"])(input.parentNode).querySelector('label')).classList.add('active');
    });
    input.addEventListener('blur', (evt) => {
        if (input.value.length === 0) {
            Object(_util__WEBPACK_IMPORTED_MODULE_13__["_$h"])(Object(_util__WEBPACK_IMPORTED_MODULE_13__["_$h"])(input.parentNode).querySelector('label')).classList.remove('active');
        }
    });
});
// When the escape key is pressed, the current assignment should be closed.
window.addEventListener('keydown', (evt) => {
    if (evt.which === 27) { // Escape key pressed
        if (document.getElementsByClassName('full').length !== 0) {
            return Object(_components_assignment__WEBPACK_IMPORTED_MODULE_1__["closeOpened"])(new Event('Generated Event'));
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
    Object(_util__WEBPACK_IMPORTED_MODULE_13__["ripple"])(Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])(elem));
    Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])(elem).addEventListener('mouseup', () => {
        document.body.classList.toggle(ls);
        Object(_components_resizer__WEBPACK_IMPORTED_MODULE_4__["resize"])();
        Object(_util__WEBPACK_IMPORTED_MODULE_13__["localStorageWrite"])(ls, document.body.classList.contains(ls));
        if (f != null)
            f();
    });
    if (Object(_util__WEBPACK_IMPORTED_MODULE_13__["localStorageRead"])(ls))
        document.body.classList.add(ls);
}
// The button to show/hide completed assignments in list view also needs event listeners.
navToggle('cvButton', 'showDone', () => setTimeout(_components_resizer__WEBPACK_IMPORTED_MODULE_4__["resize"], 1000));
// The same goes for the button that shows upcoming tests.
if (localStorage.showInfo == null) {
    localStorage.showInfo = JSON.stringify(true);
}
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
            Object(_util__WEBPACK_IMPORTED_MODULE_13__["animateEl"])(current, [
                { transform: transfrom, opacity: 1 },
                { opacity: 0 },
                { transform: transto, opacity: 0 }
            ], { duration: 300, easing: 'ease-out' }),
            Object(_util__WEBPACK_IMPORTED_MODULE_13__["animateEl"])(to, [
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
    elem: Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('listnext'),
    from: Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('listprevdate'),
    current: Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('listnowdate'),
    to: Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('listnextdate'),
    hooks: [_navigation__WEBPACK_IMPORTED_MODULE_7__["incrementListDateOffset"], _display__WEBPACK_IMPORTED_MODULE_6__["display"]],
    forward: true,
    newsupplier: () => {
        const listDate2 = new Date();
        listDate2.setDate(listDate2.getDate() + 1 + Object(_navigation__WEBPACK_IMPORTED_MODULE_7__["getListDateOffset"])());
        return Object(_util__WEBPACK_IMPORTED_MODULE_13__["dateString"])(listDate2).replace('Today', 'Now');
    }
});
setupDateListener({
    elem: Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('listbefore'),
    from: Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('listnextdate'),
    current: Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('listnowdate'),
    to: Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('listprevdate'),
    hooks: [_navigation__WEBPACK_IMPORTED_MODULE_7__["decrementListDateOffset"], _display__WEBPACK_IMPORTED_MODULE_6__["display"]],
    forward: false,
    newsupplier: () => {
        const listDate2 = new Date();
        listDate2.setDate(listDate2.getDate() - 1 + Object(_navigation__WEBPACK_IMPORTED_MODULE_7__["getListDateOffset"])());
        return Object(_util__WEBPACK_IMPORTED_MODULE_13__["dateString"])(listDate2).replace('Today', 'Now');
    }
});
function lazyFetch() {
    Array.from(document.querySelectorAll('.week, .upcomingTest'))
        .forEach((s) => s.remove());
    document.body.removeAttribute('data-pcrview');
    if (Object(_navigation__WEBPACK_IMPORTED_MODULE_7__["getCalDateOffset"])() === 0) {
        Object(_pcr__WEBPACK_IMPORTED_MODULE_8__["setData"])(Object(_util__WEBPACK_IMPORTED_MODULE_13__["localStorageRead"])('data'));
        Object(_display__WEBPACK_IMPORTED_MODULE_6__["display"])();
    }
    else {
        Object(_pcr__WEBPACK_IMPORTED_MODULE_8__["fetch"])(true);
    }
}
setupDateListener({
    elem: Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('calnext'),
    from: Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('calprevdate'),
    current: Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('calnowdate'),
    to: Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('calnextdate'),
    hooks: [_navigation__WEBPACK_IMPORTED_MODULE_7__["incrementCalDateOffset"], lazyFetch],
    forward: true,
    newsupplier: () => {
        const listDate2 = new Date();
        listDate2.setMonth(listDate2.getMonth() + 1 + Object(_navigation__WEBPACK_IMPORTED_MODULE_7__["getCalDateOffset"])());
        return Object(_util__WEBPACK_IMPORTED_MODULE_13__["monthString"])(listDate2).replace('Today', 'Now');
    }
});
setupDateListener({
    elem: Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('calbefore'),
    from: Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('calnextdate'),
    current: Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('calnowdate'),
    to: Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('calprevdate'),
    hooks: [_navigation__WEBPACK_IMPORTED_MODULE_7__["decrementCalDateOffset"], lazyFetch],
    forward: false,
    newsupplier: () => {
        const listDate2 = new Date();
        listDate2.setMonth(listDate2.getMonth() - 1 + Object(_navigation__WEBPACK_IMPORTED_MODULE_7__["getCalDateOffset"])());
        return Object(_util__WEBPACK_IMPORTED_MODULE_13__["monthString"])(listDate2);
    }
});
function updateListNav() {
    const d = new Date();
    d.setDate((d.getDate() + Object(_navigation__WEBPACK_IMPORTED_MODULE_7__["getListDateOffset"])()) - 1);
    const up = (id) => {
        Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])(id).innerHTML = Object(_util__WEBPACK_IMPORTED_MODULE_13__["dateString"])(d).replace('Today', 'Now');
        return d.setDate(d.getDate() + 1);
    };
    up('listprevdate');
    up('listnowdate');
    up('listnextdate');
}
function updateCalNav() {
    const d = new Date();
    d.setMonth((d.getMonth() + Object(_navigation__WEBPACK_IMPORTED_MODULE_7__["getCalDateOffset"])()) - 1);
    const up = (id) => {
        Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])(id).innerHTML = Object(_util__WEBPACK_IMPORTED_MODULE_13__["monthString"])(d);
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
    if (Object(_util__WEBPACK_IMPORTED_MODULE_13__["_$h"])(evt.target).classList.contains('month') || Object(_util__WEBPACK_IMPORTED_MODULE_13__["_$h"])(evt.target).classList.contains('date')) {
        Object(_navigation__WEBPACK_IMPORTED_MODULE_7__["setListDateOffset"])(Object(_dates__WEBPACK_IMPORTED_MODULE_5__["toDateNum"])(Number(Object(_util__WEBPACK_IMPORTED_MODULE_13__["_$h"])(Object(_util__WEBPACK_IMPORTED_MODULE_13__["_$h"])(evt.target).parentNode).getAttribute('data-date'))) - Object(_dates__WEBPACK_IMPORTED_MODULE_5__["today"])());
        updateDateNavs();
        document.body.setAttribute('data-view', '1');
        return Object(_display__WEBPACK_IMPORTED_MODULE_6__["display"])();
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
const headroom = new Headroom(Object(_util__WEBPACK_IMPORTED_MODULE_13__["_$"])(document.querySelector('nav')), {
    tolerance: 10,
    offset: 66
});
headroom.init();
// Also, the side menu needs event listeners.
Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('collapseButton').addEventListener('click', () => {
    document.body.style.overflow = 'hidden';
    Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('sideNav').classList.add('active');
    return Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('sideBackground').style.display = 'block';
});
Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('sideBackground').addEventListener('click', () => {
    Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('sideBackground').style.opacity = '0';
    Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('sideNav').classList.remove('active');
    Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('dragTarget').style.width = '';
    return setTimeout(() => {
        document.body.style.overflow = 'auto';
        Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('sideBackground').style.display = 'none';
    }, 350);
});
Object(_components_avatar__WEBPACK_IMPORTED_MODULE_2__["updateAvatar"])();
// <a name="athena"/> Athena (Schoology)
// ------------------
//
// <a name="settings"/> Settings
// --------
//
// The code below updates the current version text in the settings. I should've put this under the
// Updates section, but it should go before the display() function forces a reflow.
Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('version').innerHTML = _app__WEBPACK_IMPORTED_MODULE_0__["VERSION"];
// To bring up the settings windows, an event listener needs to be added to the button.
Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('settingsB').addEventListener('click', () => {
    Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('sideBackground').click();
    document.body.classList.add('settingsShown');
    Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('brand').innerHTML = 'Settings';
    return setTimeout(() => {
        Object(_util__WEBPACK_IMPORTED_MODULE_13__["_$h"])(document.querySelector('main')).style.display = 'none';
    });
});
// The back button also needs to close the settings window.
Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('backButton').addEventListener('click', () => {
    Object(_util__WEBPACK_IMPORTED_MODULE_13__["_$h"])(document.querySelector('main')).style.display = 'block';
    document.body.classList.remove('settingsShown');
    return Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('brand').innerHTML = 'Check PCR';
});
// The code below is what the settings control.
if (_settings__WEBPACK_IMPORTED_MODULE_12__["settings"].sepTasks) {
    Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('info').classList.add('isTasks');
    Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('new').style.display = 'none';
}
if (_settings__WEBPACK_IMPORTED_MODULE_12__["settings"].holidayThemes) {
    document.body.classList.add('holidayThemes');
}
if (_settings__WEBPACK_IMPORTED_MODULE_12__["settings"].sepTaskClass) {
    document.body.classList.add('sepTaskClass');
}
let assignmentColors = Object(_util__WEBPACK_IMPORTED_MODULE_13__["localStorageRead"])('assignmentColors', {
    classwork: '#689f38', homework: '#2196f3', longterm: '#f57c00', test: '#f44336'
});
let classColors = Object(_util__WEBPACK_IMPORTED_MODULE_13__["localStorageRead"])('classColors', () => {
    const cc = {};
    const data = Object(_pcr__WEBPACK_IMPORTED_MODULE_8__["getData"])();
    if (!data)
        return cc;
    data.classes.forEach((c) => {
        cc[c] = '#616161';
    });
    return cc;
});
Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])(`${_settings__WEBPACK_IMPORTED_MODULE_12__["settings"].colorType}Colors`).style.display = 'block';
window.addEventListener('focus', () => {
    if (_settings__WEBPACK_IMPORTED_MODULE_12__["settings"].refreshOnFocus)
        Object(_pcr__WEBPACK_IMPORTED_MODULE_8__["fetch"])();
});
function intervalRefresh() {
    const r = _settings__WEBPACK_IMPORTED_MODULE_12__["settings"].refreshRate;
    if (r > 0) {
        setTimeout(() => {
            console.debug('Refreshing because of timer');
            Object(_pcr__WEBPACK_IMPORTED_MODULE_8__["fetch"])();
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
Object(_pcr__WEBPACK_IMPORTED_MODULE_8__["getClasses"])().forEach((c) => {
    const d = Object(_util__WEBPACK_IMPORTED_MODULE_13__["element"])('div', [], c);
    d.setAttribute('data-control', c);
    d.appendChild(Object(_util__WEBPACK_IMPORTED_MODULE_13__["element"])('span', []));
    Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('classColors').appendChild(d);
});
document.querySelectorAll('.colors').forEach((e) => {
    e.querySelectorAll('div').forEach((color) => {
        const controlledColor = color.getAttribute('data-control');
        if (!controlledColor)
            throw new Error('Element has no controlled color');
        const sp = Object(_util__WEBPACK_IMPORTED_MODULE_13__["_$h"])(color.querySelector('span'));
        const listName = e.getAttribute('id') === 'classColors' ? 'classColors' : 'assignmentColors';
        const listSetter = (v) => {
            e.getAttribute('id') === 'classColors' ? classColors = v : assignmentColors = v;
        };
        const list = e.getAttribute('id') === 'classColors' ? classColors : assignmentColors;
        sp.style.backgroundColor = list[controlledColor];
        Object.keys(palette).forEach((p) => {
            const pe = Object(_util__WEBPACK_IMPORTED_MODULE_13__["element"])('span', []);
            pe.style.backgroundColor = p;
            if (p === list[controlledColor]) {
                pe.classList.add('selected');
            }
            sp.appendChild(pe);
        });
        const custom = Object(_util__WEBPACK_IMPORTED_MODULE_13__["element"])('span', ['customColor'], `<a>Custom</a> \
    <input type='text' placeholder='Was ${list[controlledColor]}' /> \
    <span class='customInfo'>Use any CSS valid color name, such as \
    <code>#F44336</code> or <code>rgb(64, 43, 2)</code> or <code>cyan</code></span> \
    <a class='customOk'>Set</a>`);
        custom.addEventListener('click', (evt) => evt.stopPropagation());
        Object(_util__WEBPACK_IMPORTED_MODULE_13__["_$"])(custom.querySelector('a')).addEventListener('click', (evt) => {
            sp.classList.toggle('onCustom');
            evt.stopPropagation();
        });
        sp.addEventListener('click', (evt) => {
            if (sp.classList.contains('choose')) {
                const target = Object(_util__WEBPACK_IMPORTED_MODULE_13__["_$h"])(evt.target);
                const bg = tinycolor(target.style.backgroundColor || '#000').toHexString();
                list[controlledColor] = bg;
                sp.style.backgroundColor = bg;
                const selected = target.querySelector('.selected');
                if (selected) {
                    selected.classList.remove('selected');
                }
                target.classList.add('selected');
                localStorage[listName] = JSON.stringify(list);
                listSetter(list);
                updateColors();
            }
            sp.classList.toggle('choose');
        });
        Object(_util__WEBPACK_IMPORTED_MODULE_13__["_$"])(custom.querySelector('.customOk')).addEventListener('click', (evt) => {
            sp.classList.remove('onCustom');
            sp.classList.toggle('choose');
            const selectedEl = sp.querySelector('.selected');
            if (selectedEl != null) {
                selectedEl.classList.remove('selected');
            }
            sp.style.backgroundColor = (list[controlledColor] = Object(_util__WEBPACK_IMPORTED_MODULE_13__["_$"])(custom.querySelector('input')).value);
            localStorage[listName] = JSON.stringify(list);
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
    const sheet = Object(_util__WEBPACK_IMPORTED_MODULE_13__["_$"])(style.sheet);
    const addColorRule = (selector, light, dark, extra = '') => {
        const mixed = tinycolor.mix(light, '#1B5E20', 70).toHexString();
        sheet.insertRule(`${extra}.assignment${selector} { background-color: ${light}; }`, 0);
        sheet.insertRule(`${extra}.assignment${selector}.done { background-color: ${dark}; }`, 0);
        sheet.insertRule(`${extra}.assignment${selector}::before { background-color: ${mixed}; }`, 0);
        sheet.insertRule(`${extra}.assignmentItem${selector}>i { background-color: ${light}; }`, 0);
        sheet.insertRule(`${extra}.assignmentItem${selector}.done>i { background-color: ${dark}; }`, 0);
    };
    const createPalette = (color) => tinycolor(color).darken(24).toHexString();
    if (_settings__WEBPACK_IMPORTED_MODULE_12__["settings"].colorType === 'assignment') {
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
    if (e.type === 'checkbox') {
        e.checked = Object(_settings__WEBPACK_IMPORTED_MODULE_12__["getSetting"])(e.name);
    }
    else {
        e.value = Object(_settings__WEBPACK_IMPORTED_MODULE_12__["getSetting"])(e.name);
    }
    e.addEventListener('change', (evt) => {
        if (e.type === 'checkbox') {
            Object(_settings__WEBPACK_IMPORTED_MODULE_12__["setSetting"])(e.name, e.checked);
        }
        else {
            Object(_settings__WEBPACK_IMPORTED_MODULE_12__["setSetting"])(e.name, e.value);
        }
        switch (e.name) {
            case 'refreshRate': return intervalRefresh();
            case 'earlyTest': return Object(_display__WEBPACK_IMPORTED_MODULE_6__["display"])();
            case 'assignmentSpan': return Object(_display__WEBPACK_IMPORTED_MODULE_6__["display"])();
            case 'projectsInTestPane': return Object(_display__WEBPACK_IMPORTED_MODULE_6__["display"])();
            case 'hideAssignments': return Object(_display__WEBPACK_IMPORTED_MODULE_6__["display"])();
            case 'holidayThemes': return document.body.classList.toggle('holidayThemes', e.checked);
            case 'sepTaskClass':
                document.body.classList.toggle('sepTaskClass', e.checked);
                return Object(_display__WEBPACK_IMPORTED_MODULE_6__["display"])();
            case 'sepTasks': return Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('sepTasksRefresh').style.display = 'block';
        }
    });
});
// This also needs to be done for radio buttons
const colorType = Object(_util__WEBPACK_IMPORTED_MODULE_13__["_$"])(document.querySelector(`input[name=\"colorType\"][value=\"${_settings__WEBPACK_IMPORTED_MODULE_12__["settings"].colorType}\"]`));
colorType.checked = true;
Array.from(document.getElementsByName('colorType')).forEach((c) => {
    c.addEventListener('change', (evt) => {
        const v = Object(_util__WEBPACK_IMPORTED_MODULE_13__["_$"])(document.querySelector('input[name="colorType"]:checked')).value;
        if (v !== 'assignment' && v !== 'class')
            return;
        _settings__WEBPACK_IMPORTED_MODULE_12__["settings"].colorType = v;
        if (v === 'class') {
            Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('assignmentColors').style.display = 'none';
            Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('classColors').style.display = 'block';
        }
        else {
            Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('assignmentColors').style.display = 'block';
            Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('classColors').style.display = 'none';
        }
        return updateColors();
    });
});
// The same goes for textareas.
document.querySelectorAll('textarea').forEach((e) => {
    if ((e.name !== 'athenaDataRaw') && (localStorage[e.name] != null)) {
        e.value = localStorage[e.name];
    }
    e.addEventListener('input', (evt) => {
        localStorage[e.name] = e.value;
        if (e.name === 'athenaDataRaw') {
            Object(_plugins_athena__WEBPACK_IMPORTED_MODULE_10__["updateAthenaData"])(e.value);
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
console.log(`%cVersion ${_app__WEBPACK_IMPORTED_MODULE_0__["VERSION"]} (Check below for current version)`, 'font-size: 1.1em');
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
const triedLastUpdate = Object(_util__WEBPACK_IMPORTED_MODULE_13__["localStorageRead"])('lastUpdate');
Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('lastUpdate').innerHTML = triedLastUpdate ? Object(_display__WEBPACK_IMPORTED_MODULE_6__["formatUpdate"])(triedLastUpdate) : 'Never';
if (Object(_util__WEBPACK_IMPORTED_MODULE_13__["localStorageRead"])('data') != null) {
    // Now check if there's activity
    Object(_plugins_activity__WEBPACK_IMPORTED_MODULE_9__["recentActivity"])().forEach((item) => {
        Object(_plugins_activity__WEBPACK_IMPORTED_MODULE_9__["addActivity"])(item[0], item[1], new Date(item[2]), false, item[3]);
    });
    Object(_display__WEBPACK_IMPORTED_MODULE_6__["display"])();
}
Object(_pcr__WEBPACK_IMPORTED_MODULE_8__["fetch"])();
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
const dragTarget = new Hammer(Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('dragTarget'));
dragTarget.on('pan', (e) => {
    if (e.pointerType === 'touch') {
        e.preventDefault();
        let { x } = e.center;
        const { y } = e.center;
        const sBkg = Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('sideBackground');
        sBkg.style.display = 'block';
        sBkg.style.opacity = '0';
        Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('sideNav').classList.add('manual');
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
        Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('sideNav').style.transform = `translateX(${x - 240}px)`;
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
            sideNav = Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('sideNav');
            sideNav.classList.remove('manual');
            sideNav.classList.add('active');
            sideNav.style.transform = '';
            Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('dragTarget').style.width = '100%';
        }
        else if (!menuOut || (velocityX > 0.3)) {
            document.body.style.overflow = 'auto';
            sideNav = Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('sideNav');
            sideNav.classList.remove('manual');
            sideNav.classList.remove('active');
            sideNav.style.transform = '';
            Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('sideBackground').style.opacity = '';
            Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('dragTarget').style.width = '10px';
            setTimeout(() => Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('sideBackground').style.display = 'none', 350);
        }
    }
});
dragTarget.on('tap', (e) => {
    Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('sideBackground').click();
    e.preventDefault();
});
const dt = document.getElementById('dragTarget');
// The activity filter button also needs an event listener.
Object(_util__WEBPACK_IMPORTED_MODULE_13__["ripple"])(Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('filterActivity'));
Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('filterActivity').addEventListener('click', () => {
    Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('infoActivity').classList.toggle('filter');
});
// At the start, it needs to be correctly populated
const activityTypes = _settings__WEBPACK_IMPORTED_MODULE_12__["settings"].shownActivity;
function updateSelectNum() {
    const c = (bool) => bool ? 1 : 0;
    const count = String(c(activityTypes.add) + c(activityTypes.edit) + c(activityTypes.delete));
    return Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('selectNum').innerHTML = count;
}
updateSelectNum();
Object.entries(activityTypes).forEach(([type, enabled]) => {
    if (type !== 'add' && type !== 'edit' && type !== 'delete') {
        throw new Error(`Invalid activity type ${type}`);
    }
    const selectEl = Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])(type + 'Select');
    selectEl.checked = enabled;
    if (enabled) {
        Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('infoActivity').classList.add(type);
    }
    selectEl.addEventListener('change', (evt) => {
        activityTypes[type] = selectEl.checked;
        Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('infoActivity').setAttribute('data-filtered', updateSelectNum());
        Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('infoActivity').classList.toggle(type);
        _settings__WEBPACK_IMPORTED_MODULE_12__["settings"].shownActivity = activityTypes;
    });
});
// The show completed tasks checkbox is set correctly and is assigned an event listener.
const showDoneTasksEl = Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('showDoneTasks');
if (_settings__WEBPACK_IMPORTED_MODULE_12__["settings"].showDoneTasks) {
    showDoneTasksEl.checked = true;
    Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('infoTasksInner').classList.add('showDoneTasks');
}
showDoneTasksEl.addEventListener('change', () => {
    _settings__WEBPACK_IMPORTED_MODULE_12__["settings"].showDoneTasks = showDoneTasksEl.checked;
    Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('infoTasksInner').classList.toggle('showDoneTasks', _settings__WEBPACK_IMPORTED_MODULE_12__["settings"].showDoneTasks);
});
// <a name="updates"/>
// Updates and News
// ----------------
//
if (location.protocol === 'chrome-extension:') {
    Object(_app__WEBPACK_IMPORTED_MODULE_0__["checkCommit"])();
}
// This update dialog also needs to be closed when the buttons are clicked.
Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('updateDelay').addEventListener('click', () => {
    Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('update').classList.remove('active');
    setTimeout(() => {
        Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('updateBackground').style.display = 'none';
    }, 350);
});
// For news, the latest news is fetched from a GitHub gist.
Object(_app__WEBPACK_IMPORTED_MODULE_0__["fetchNews"])();
// The news dialog then needs to be closed when OK or the background is clicked.
function closeNews() {
    Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('news').classList.remove('active');
    setTimeout(() => {
        Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('newsBackground').style.display = 'none';
    }, 350);
}
Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('newsOk').addEventListener('click', closeNews);
Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('newsBackground').addEventListener('click', closeNews);
// It also needs to be opened when the news button is clicked.
Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('newsB').addEventListener('click', () => {
    Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('sideBackground').click();
    const displayNews = () => {
        Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('newsBackground').style.display = 'block';
        return Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('news').classList.add('active');
    };
    if (Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('newsContent').childNodes.length === 0) {
        Object(_app__WEBPACK_IMPORTED_MODULE_0__["getNews"])(displayNews);
    }
    else {
        displayNews();
    }
});
// The same goes for the error dialog.
function closeError() {
    Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('error').classList.remove('active');
    setTimeout(() => {
        Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('errorBackground').style.display = 'none';
    }, 350);
}
Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('errorNo').addEventListener('click', closeError);
Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('errorBackground').addEventListener('click', closeError);
// <a name="new"/>
// Adding new assignments
// ----------------------
//
// The event listeners for the new buttons are added.
Object(_util__WEBPACK_IMPORTED_MODULE_13__["ripple"])(Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('new'));
Object(_util__WEBPACK_IMPORTED_MODULE_13__["ripple"])(Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('newTask'));
const onNewTask = () => {
    Object(_components_customAdder__WEBPACK_IMPORTED_MODULE_3__["updateNewTips"])(Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('newText').value = '');
    document.body.style.overflow = 'hidden';
    Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('newBackground').style.display = 'block';
    Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('newDialog').classList.add('active');
    Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('newText').focus();
};
Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('new').addEventListener('mouseup', onNewTask);
Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('newTask').addEventListener('mouseup', onNewTask);
// A function to close the dialog is then defined.
function closeNew() {
    document.body.style.overflow = 'auto';
    Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('newDialog').classList.remove('active');
    setTimeout(() => {
        Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('newBackground').style.display = 'none';
    }, 350);
}
// This function is set to be called called when the ESC key is called inside of the dialog.
Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('newText').addEventListener('keydown', (evt) => {
    if (evt.which === 27) { // Escape key pressed
        closeNew();
    }
});
// An event listener to call the function is also added to the X button
Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('newCancel').addEventListener('click', closeNew);
// When the enter key is pressed or the submit button is clicked, the new assignment is added.
Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('newDialog').addEventListener('submit', (evt) => {
    evt.preventDefault();
    const itext = Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('newText').value;
    const { text, cls, due, st } = Object(_plugins_customAssignments__WEBPACK_IMPORTED_MODULE_11__["parseCustomTask"])(itext);
    let end = 'Forever';
    const start = (st != null) ? Object(_dates__WEBPACK_IMPORTED_MODULE_5__["toDateNum"])(chrono.parseDate(st)) : Object(_dates__WEBPACK_IMPORTED_MODULE_5__["today"])();
    if (due != null) {
        end = Object(_dates__WEBPACK_IMPORTED_MODULE_5__["toDateNum"])(chrono.parseDate(due));
        if (end < start) { // Assignment ends before it is assigned
            end += Math.ceil((start - end) / 7) * 7;
        }
    }
    Object(_plugins_customAssignments__WEBPACK_IMPORTED_MODULE_11__["addToExtra"])({
        body: text.charAt(0).toUpperCase() + text.substr(1),
        done: false,
        start,
        class: (cls != null) ? cls.toLowerCase().trim() : null,
        end
    });
    Object(_plugins_customAssignments__WEBPACK_IMPORTED_MODULE_11__["saveExtra"])();
    closeNew();
    Object(_display__WEBPACK_IMPORTED_MODULE_6__["display"])(false);
});
Object(_components_customAdder__WEBPACK_IMPORTED_MODULE_3__["updateNewTips"])('', false);
Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('newText').addEventListener('input', () => {
    return Object(_components_customAdder__WEBPACK_IMPORTED_MODULE_3__["updateNewTips"])(Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('newText').value);
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
        return Object(_app__WEBPACK_IMPORTED_MODULE_0__["checkCommit"])();
    }
});


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

/***/ "./src/components/customAdder.ts":
/*!***************************************!*\
  !*** ./src/components/customAdder.ts ***!
  \***************************************/
/*! exports provided: updateNewTips */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "updateNewTips", function() { return updateNewTips; });
/* harmony import */ var _pcr__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../pcr */ "./src/pcr.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util */ "./src/util.ts");


// When anything is typed, the search suggestions need to be updated.
const TIP_NAMES = {
    for: ['for'],
    by: ['by', 'due', 'ending'],
    starting: ['starting', 'beginning', 'assigned']
};
const newText = Object(_util__WEBPACK_IMPORTED_MODULE_1__["elemById"])('newText');
function updateNewTips(val, scroll = true) {
    if (scroll) {
        Object(_util__WEBPACK_IMPORTED_MODULE_1__["elemById"])('newTips').scrollTop = 0;
    }
    const spaceIndex = val.lastIndexOf(' ');
    if (spaceIndex !== -1) {
        const beforeSpace = val.lastIndexOf(' ', spaceIndex - 1);
        const before = val.substring((beforeSpace === -1 ? 0 : beforeSpace + 1), spaceIndex);
        Object.entries(TIP_NAMES).forEach(([name, possible]) => {
            if (possible.indexOf(before) !== -1) {
                if (name === 'for') {
                    Object.keys(TIP_NAMES).forEach((tipName) => {
                        Object(_util__WEBPACK_IMPORTED_MODULE_1__["elemById"])(`tip${tipName}`).classList.remove('active');
                    });
                    Object(_pcr__WEBPACK_IMPORTED_MODULE_0__["getClasses"])().forEach((cls) => {
                        const id = `tipclass${cls.replace(/\W/, '')}`;
                        if (spaceIndex === (val.length - 1)) {
                            const e = document.getElementById(id);
                            if (e) {
                                e.classList.add('active');
                            }
                            else {
                                const container = Object(_util__WEBPACK_IMPORTED_MODULE_1__["element"])('div', ['classTip', 'active', 'tip'], `<i class='material-icons'>class</i><span class='typed'>${cls}</span>`, id);
                                container.addEventListener('click', tipComplete(cls));
                                Object(_util__WEBPACK_IMPORTED_MODULE_1__["elemById"])('newTips').appendChild(container);
                            }
                        }
                        else {
                            Object(_util__WEBPACK_IMPORTED_MODULE_1__["elemById"])(id).classList.toggle('active', cls.toLowerCase().includes(val.toLowerCase().substr(spaceIndex + 1)));
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
                Object(_util__WEBPACK_IMPORTED_MODULE_1__["elemById"])(`tip${name}`).classList.remove('active');
            }
        });
    }
}
function updateTip(name, typed, capitalize) {
    if (name !== 'for' && name !== 'by' && name !== 'starting') {
        throw new Error('Invalid tip name');
    }
    const el = Object(_util__WEBPACK_IMPORTED_MODULE_1__["elemById"])(`tip${name}`);
    el.classList.add('active');
    Object(_util__WEBPACK_IMPORTED_MODULE_1__["_$"])(el.querySelector('.typed')).innerHTML = (capitalize ? Object(_util__WEBPACK_IMPORTED_MODULE_1__["capitalizeString"])(typed) : typed) + '...';
    const newNames = [];
    TIP_NAMES[name].forEach((n) => {
        if (n !== typed) {
            newNames.push(`<b>${n}</b>`);
        }
    });
    Object(_util__WEBPACK_IMPORTED_MODULE_1__["_$"])(el.querySelector('.others')).innerHTML = newNames.length > 0 ? `You can also use ${newNames.join(' or ')}` : '';
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
    tip.addEventListener('click', tipComplete(Object(_util__WEBPACK_IMPORTED_MODULE_1__["_$"])(tip.querySelector('.typed')).innerHTML));
});


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


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50LnRzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2FjdGl2aXR5LnRzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2Fzc2lnbm1lbnQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvYXZhdGFyLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2NhbGVuZGFyLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2N1c3RvbUFkZGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2Vycm9yRGlzcGxheS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9yZXNpemVyLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL3NuYWNrYmFyLnRzIiwid2VicGFjazovLy8uL3NyYy9jb29raWVzLnRzIiwid2VicGFjazovLy8uL3NyYy9kYXRlcy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZGlzcGxheS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbmF2aWdhdGlvbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGNyLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW5zL2FjdGl2aXR5LnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW5zL2F0aGVuYS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2lucy9jdXN0b21Bc3NpZ25tZW50cy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2lucy9kb25lLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW5zL21vZGlmaWVkQXNzaWdubWVudHMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NldHRpbmdzLnRzIiwid2VicGFjazovLy8uL3NyYy91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNB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S0FDbkI7U0FBTTtRQUNILE9BQU8sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsS0FBSztLQUNoRDtBQUNMLENBQUM7QUFFRCxnQkFBZ0IsQ0FBUyxFQUFFLENBQVMsRUFBRSxDQUFTO0lBQzNDLE1BQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEdBQUc7SUFDM0IsTUFBTSxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztJQUM3QixNQUFNLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxJQUFJO0lBQzdCLE1BQU0sRUFBRSxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQzdCLE1BQU0sRUFBRSxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQzdCLE1BQU0sRUFBRSxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBRTdCLE1BQU0sS0FBSyxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7SUFFMUIsTUFBTSxFQUFFLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDOUMsTUFBTSxFQUFFLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDOUMsTUFBTSxFQUFFLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFFOUMscUJBQXFCO0lBQ3JCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBUyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdB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LCJmaWxlIjoiYXBwLWJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9jbGllbnQudHNcIik7XG4iLCJpbXBvcnQgeyBlbGVtQnlJZCwgZWxlbWVudCwgbG9jYWxTdG9yYWdlUmVhZCwgbG9jYWxTdG9yYWdlV3JpdGUsIHNlbmQgfSBmcm9tICcuL3V0aWwnXG5cbmV4cG9ydCBjb25zdCBWRVJTSU9OID0gJzIuMjQuMydcblxuY29uc3QgVkVSU0lPTl9VUkwgPSAnaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tLzE5UnlhbkEvQ2hlY2tQQ1IvbWFzdGVyL3ZlcnNpb24udHh0J1xuY29uc3QgQ09NTUlUX1VSTCA9IChsb2NhdGlvbi5wcm90b2NvbCA9PT0gJ2Nocm9tZS1leHRlbnNpb246JyA/XG4gICAgJ2h0dHBzOi8vYXBpLmdpdGh1Yi5jb20vcmVwb3MvMTlSeWFuQS9DaGVja1BDUi9naXQvcmVmcy9oZWFkcy9tYXN0ZXInIDogJy9hcGkvY29tbWl0JylcbmNvbnN0IE5FV1NfVVJMID0gJ2h0dHBzOi8vYXBpLmdpdGh1Yi5jb20vZ2lzdHMvMjFiZjExYTQyOWRhMjU3NTM5YTY4NTIwZjUxM2EzOGInXG5cbmZ1bmN0aW9uIGZvcm1hdENvbW1pdE1lc3NhZ2UobWVzc2FnZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gbWVzc2FnZS5zdWJzdHIobWVzc2FnZS5pbmRleE9mKCdcXG5cXG4nKSArIDIpXG4gICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFwqICguKj8pKD89JHxcXG4pL2csIChhLCBiKSA9PiBgPGxpPiR7Yn08L2xpPmApXG4gICAgICAgICAgICAgICAgICAucmVwbGFjZSgvPlxcbjwvZywgJz48JylcbiAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXG4vZywgJzxicj4nKVxufVxuXG4vLyBGb3IgdXBkYXRpbmcsIGEgcmVxdWVzdCB3aWxsIGJlIHNlbmQgdG8gR2l0aHViIHRvIGdldCB0aGUgY3VycmVudCBjb21taXQgaWQgYW5kIGNoZWNrIHRoYXQgYWdhaW5zdCB3aGF0J3Mgc3RvcmVkXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY2hlY2tDb21taXQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmVzcCA9IGF3YWl0IHNlbmQoVkVSU0lPTl9VUkwsICd0ZXh0JylcbiAgICAgICAgY29uc3QgYyA9IHJlc3AucmVzcG9uc2VUZXh0LnRyaW0oKVxuICAgICAgICBjb25zb2xlLmxvZyhgQ3VycmVudCB2ZXJzaW9uOiAke2N9ICR7VkVSU0lPTiA9PT0gYyA/ICcobm8gdXBkYXRlIGF2YWlsYWJsZSknIDogJyh1cGRhdGUgYXZhaWxhYmxlKSd9YClcbiAgICAgICAgZWxlbUJ5SWQoJ25ld3ZlcnNpb24nKS5pbm5lckhUTUwgPSBjXG4gICAgICAgIGlmIChWRVJTSU9OICE9PSBjKSB7XG4gICAgICAgICAgICBlbGVtQnlJZCgndXBkYXRlSWdub3JlJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGxvY2F0aW9uLnByb3RvY29sID09PSAnY2hyb21lLWV4dGVuc2lvbjonKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1CeUlkKCd1cGRhdGUnKS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1CeUlkKCd1cGRhdGVCYWNrZ3JvdW5kJykuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuICAgICAgICAgICAgICAgICAgICB9LCAzNTApXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGNvbnN0IHJlc3AyID0gYXdhaXQgc2VuZChDT01NSVRfVVJMLCAnanNvbicpXG4gICAgICAgICAgICBjb25zdCB7IHNoYSwgdXJsIH0gPSByZXNwMi5yZXNwb25zZS5vYmplY3RcbiAgICAgICAgICAgIGNvbnN0IHJlc3AzID0gYXdhaXQgc2VuZCgobG9jYXRpb24ucHJvdG9jb2wgPT09ICdjaHJvbWUtZXh0ZW5zaW9uOicgPyB1cmwgOiBgL2FwaS9jb21taXQvJHtzaGF9YCksICdqc29uJylcbiAgICAgICAgICAgIGVsZW1CeUlkKCdwYXN0VXBkYXRlVmVyc2lvbicpLmlubmVySFRNTCA9IFZFUlNJT05cbiAgICAgICAgICAgIGVsZW1CeUlkKCduZXdVcGRhdGVWZXJzaW9uJykuaW5uZXJIVE1MID0gY1xuICAgICAgICAgICAgZWxlbUJ5SWQoJ3VwZGF0ZUZlYXR1cmVzJykuaW5uZXJIVE1MID0gZm9ybWF0Q29tbWl0TWVzc2FnZShyZXNwMy5yZXNwb25zZS5tZXNzYWdlKVxuICAgICAgICAgICAgZWxlbUJ5SWQoJ3VwZGF0ZUJhY2tncm91bmQnKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xuICAgICAgICAgICAgZWxlbUJ5SWQoJ3VwZGF0ZScpLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ0NvdWxkIG5vdCBhY2Nlc3MgR2l0aHViLiBIZXJlXFwncyB0aGUgZXJyb3I6JywgZXJyKVxuICAgIH1cbn1cblxubGV0IG5ld3NVcmw6IHN0cmluZ3xudWxsID0gbnVsbFxubGV0IG5ld3NDb21taXQ6IHN0cmluZ3xudWxsID0gbnVsbFxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmV0Y2hOZXdzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJlc3AgPSBhd2FpdCBzZW5kKE5FV1NfVVJMLCAnanNvbicpXG4gICAgICAgIGxldCBsYXN0ID0gbG9jYWxTdG9yYWdlUmVhZCgnbmV3c0NvbW1pdCcpXG4gICAgICAgIG5ld3NDb21taXQgPSByZXNwLnJlc3BvbnNlLmhpc3RvcnlbMF0udmVyc2lvblxuXG4gICAgICAgIGlmIChsYXN0ID09IG51bGwpIHtcbiAgICAgICAgICAgIGxhc3QgPSBuZXdzQ29tbWl0XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2VXcml0ZSgnbmV3c0NvbW1pdCcsIG5ld3NDb21taXQpXG4gICAgICAgIH1cblxuICAgICAgICBuZXdzVXJsID0gcmVzcC5yZXNwb25zZS5maWxlc1sndXBkYXRlcy5odG0nXS5yYXdfdXJsXG5cbiAgICAgICAgaWYgKGxhc3QgIT09IG5ld3NDb21taXQpIHtcbiAgICAgICAgICAgIGdldE5ld3MoKVxuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdDb3VsZCBub3QgYWNjZXNzIEdpdGh1Yi4gSGVyZVxcJ3MgdGhlIGVycm9yOicsIGVycilcbiAgICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXROZXdzKG9uZmFpbD86ICgpID0+IHZvaWQpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoIW5ld3NVcmwpIHtcbiAgICAgICAgaWYgKG9uZmFpbCkgb25mYWlsKClcbiAgICAgICAgcmV0dXJuXG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJlc3AgPSBhd2FpdCBzZW5kKG5ld3NVcmwpXG4gICAgICAgIGxvY2FsU3RvcmFnZS5uZXdzQ29tbWl0ID0gbmV3c0NvbW1pdFxuICAgICAgICByZXNwLnJlc3BvbnNlVGV4dC5zcGxpdCgnPGhyPicpLmZvckVhY2goKG5ld3MpID0+IHtcbiAgICAgICAgICAgIGVsZW1CeUlkKCduZXdzQ29udGVudCcpLmFwcGVuZENoaWxkKGVsZW1lbnQoJ2RpdicsICduZXdzSXRlbScsIG5ld3MpKVxuICAgICAgICB9KVxuICAgICAgICBlbGVtQnlJZCgnbmV3c0JhY2tncm91bmQnKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xuICAgICAgICBlbGVtQnlJZCgnbmV3cycpLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdDb3VsZCBub3QgYWNjZXNzIEdpdGh1Yi4gSGVyZVxcJ3MgdGhlIGVycm9yOicsIGVycilcbiAgICAgICAgaWYgKG9uZmFpbCkgb25mYWlsKClcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBjaGVja0NvbW1pdCwgZmV0Y2hOZXdzLCBnZXROZXdzLCBWRVJTSU9OIH0gZnJvbSAnLi9hcHAnXG5pbXBvcnQgeyBjbG9zZU9wZW5lZCwgZ2V0RVMgfSBmcm9tICcuL2NvbXBvbmVudHMvYXNzaWdubWVudCdcbmltcG9ydCB7IHVwZGF0ZUF2YXRhciB9IGZyb20gJy4vY29tcG9uZW50cy9hdmF0YXInXG5pbXBvcnQgeyB1cGRhdGVOZXdUaXBzIH0gZnJvbSAnLi9jb21wb25lbnRzL2N1c3RvbUFkZGVyJ1xuaW1wb3J0IHsgZ2V0UmVzaXplQXNzaWdubWVudHMsIHJlc2l6ZSwgcmVzaXplQ2FsbGVyIH0gZnJvbSAnLi9jb21wb25lbnRzL3Jlc2l6ZXInXG5pbXBvcnQgeyB0b0RhdGVOdW0sIHRvZGF5IH0gZnJvbSAnLi9kYXRlcydcbmltcG9ydCB7IGRpc3BsYXksIGZvcm1hdFVwZGF0ZSwgZ2V0U2Nyb2xsIH0gZnJvbSAnLi9kaXNwbGF5J1xuaW1wb3J0IHtcbiAgICBkZWNyZW1lbnRDYWxEYXRlT2Zmc2V0LFxuICAgIGRlY3JlbWVudExpc3REYXRlT2Zmc2V0LFxuICAgIGdldENhbERhdGVPZmZzZXQsXG4gICAgZ2V0TGlzdERhdGVPZmZzZXQsXG4gICAgaW5jcmVtZW50Q2FsRGF0ZU9mZnNldCxcbiAgICBpbmNyZW1lbnRMaXN0RGF0ZU9mZnNldCxcbiAgICBzZXRMaXN0RGF0ZU9mZnNldCxcbiAgICB6ZXJvRGF0ZU9mZnNldHNcbn0gZnJvbSAnLi9uYXZpZ2F0aW9uJ1xuaW1wb3J0IHsgZG9sb2dpbiwgZmV0Y2gsIGdldENsYXNzZXMsIGdldERhdGEsIGxvZ291dCwgc2V0RGF0YSwgc3dpdGNoVmlld3MgfSBmcm9tICcuL3BjcidcbmltcG9ydCB7IGFkZEFjdGl2aXR5LCByZWNlbnRBY3Rpdml0eSB9IGZyb20gJy4vcGx1Z2lucy9hY3Rpdml0eSdcbmltcG9ydCB7IHVwZGF0ZUF0aGVuYURhdGEgfSBmcm9tICcuL3BsdWdpbnMvYXRoZW5hJ1xuaW1wb3J0IHsgYWRkVG9FeHRyYSwgcGFyc2VDdXN0b21UYXNrLCBzYXZlRXh0cmEgfSBmcm9tICcuL3BsdWdpbnMvY3VzdG9tQXNzaWdubWVudHMnXG5pbXBvcnQgeyBnZXRTZXR0aW5nLCBzZXRTZXR0aW5nLCBzZXR0aW5ncyB9IGZyb20gJy4vc2V0dGluZ3MnXG5pbXBvcnQge1xuICAgIF8kLFxuICAgIF8kaCxcbiAgICBhbmltYXRlRWwsXG4gICAgZGF0ZVN0cmluZyxcbiAgICBlbGVtQnlJZCxcbiAgICBlbGVtZW50LFxuICAgIGZvcmNlTGF5b3V0LFxuICAgIGxvY2FsU3RvcmFnZVJlYWQsXG4gICAgbG9jYWxTdG9yYWdlV3JpdGUsXG4gICAgbW9udGhTdHJpbmcsXG4gICAgcmVxdWVzdElkbGVDYWxsYmFjayxcbiAgICByaXBwbGVcbn0gZnJvbSAnLi91dGlsJ1xuXG5pZiAobG9jYWxTdG9yYWdlUmVhZCgnZGF0YScpICE9IG51bGwpIHtcbiAgICBzZXREYXRhKGxvY2FsU3RvcmFnZVJlYWQoJ2RhdGEnKSlcbn1cblxuLy8gQWRkaXRpb25hbGx5LCBpZiBpdCdzIHRoZSB1c2VyJ3MgZmlyc3QgdGltZSwgdGhlIHBhZ2UgaXMgc2V0IHRvIHRoZSB3ZWxjb21lIHBhZ2UuXG5pZiAoIWxvY2FsU3RvcmFnZVJlYWQoJ25vV2VsY29tZScpKSB7XG4gICAgbG9jYWxTdG9yYWdlV3JpdGUoJ25vV2VsY29tZScsIHRydWUpXG4gICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnd2VsY29tZS5odG1sJ1xufVxuXG5jb25zdCBOQVZfRUxFTUVOVCA9IF8kKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ25hdicpKVxuY29uc3QgSU5QVVRfRUxFTUVOVFMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICdpbnB1dFt0eXBlPXRleHRdOm5vdCgjbmV3VGV4dCk6bm90KFtyZWFkb25seV0pLCBpbnB1dFt0eXBlPXBhc3N3b3JkXSwgaW5wdXRbdHlwZT1lbWFpbF0sICcgK1xuICAgICdpbnB1dFt0eXBlPXVybF0sIGlucHV0W3R5cGU9dGVsXSwgaW5wdXRbdHlwZT1udW1iZXJdOm5vdCguY29udHJvbCksIGlucHV0W3R5cGU9c2VhcmNoXSdcbikgYXMgTm9kZUxpc3RPZjxIVE1MSW5wdXRFbGVtZW50PlxuXG4vLyAjIyMjIFNlbmQgZnVuY3Rpb25cbi8vXG5cbi8vIFRoaXMgZnVuY3Rpb24gZGlzcGxheXMgYSBzbmFja2JhciB0byB0ZWxsIHRoZSB1c2VyIHNvbWV0aGluZ1xuXG4vLyA8YSBuYW1lPVwicmV0XCIvPlxuLy8gUmV0cmlldmluZyBkYXRhXG4vLyAtLS0tLS0tLS0tLS0tLS1cbi8vXG5lbGVtQnlJZCgnbG9naW4nKS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCAoZXZ0KSA9PiB7XG4gICAgZXZ0LnByZXZlbnREZWZhdWx0KClcbiAgICBkb2xvZ2luKG51bGwsIHRydWUpXG59KVxuXG4vLyBUaGUgdmlldyBzd2l0Y2hpbmcgYnV0dG9uIG5lZWRzIGFuIGV2ZW50IGhhbmRsZXIuXG5lbGVtQnlJZCgnc3dpdGNoVmlld3MnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHN3aXRjaFZpZXdzKVxuXG4vLyBUaGUgc2FtZSBnb2VzIGZvciB0aGUgbG9nIG91dCBidXR0b24uXG5lbGVtQnlJZCgnbG9nb3V0JykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBsb2dvdXQpXG5cbi8vIE5vdyB3ZSBhc3NpZ24gaXQgdG8gY2xpY2tpbmcgdGhlIGJhY2tncm91bmQuXG5lbGVtQnlJZCgnYmFja2dyb3VuZCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xvc2VPcGVuZWQpXG5cbi8vIFRoZW4sIHRoZSB0YWJzIGFyZSBtYWRlIGludGVyYWN0aXZlLlxuZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnI25hdlRhYnM+bGknKS5mb3JFYWNoKCh0YWIsIHRhYkluZGV4KSA9PiB7XG4gIHRhYi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldnQpID0+IHtcbiAgICBpZiAoIXNldHRpbmdzLnZpZXdUcmFucykge1xuICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdub1RyYW5zJylcbiAgICAgIGZvcmNlTGF5b3V0KGRvY3VtZW50LmJvZHkpXG4gICAgfVxuICAgIGxvY2FsU3RvcmFnZVdyaXRlKCd2aWV3JywgdGFiSW5kZXgpXG4gICAgZG9jdW1lbnQuYm9keS5zZXRBdHRyaWJ1dGUoJ2RhdGEtdmlldycsIFN0cmluZyh0YWJJbmRleCkpXG4gICAgaWYgKHRhYkluZGV4ID09PSAxKSB7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCByZXNpemVDYWxsZXIpXG4gICAgICAgIGlmIChzZXR0aW5ncy52aWV3VHJhbnMpIHtcbiAgICAgICAgICAgIGxldCBzdGFydDogbnVtYmVyfG51bGwgPSBudWxsXG4gICAgICAgICAgICAvLyBUaGUgY29kZSBiZWxvdyBpcyB0aGUgc2FtZSBjb2RlIHVzZWQgaW4gdGhlIHJlc2l6ZSgpIGZ1bmN0aW9uLiBJdCBiYXNpY2FsbHkganVzdFxuICAgICAgICAgICAgLy8gcG9zaXRpb25zIHRoZSBhc3NpZ25tZW50cyBjb3JyZWN0bHkgYXMgdGhleSBhbmltYXRlXG4gICAgICAgICAgICBjb25zdCB3aWR0aHMgPSBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5jb250YWlucygnc2hvd0luZm8nKSA/XG4gICAgICAgICAgICAgICAgWzY1MCwgMTEwMCwgMTgwMCwgMjcwMCwgMzgwMCwgNTEwMF0gOiBbMzUwLCA4MDAsIDE1MDAsIDI0MDAsIDM1MDAsIDQ4MDBdXG4gICAgICAgICAgICBsZXQgY29sdW1ucyA9IDFcbiAgICAgICAgICAgIHdpZHRocy5mb3JFYWNoKCh3LCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA+IHcpIHsgY29sdW1ucyA9IGluZGV4ICsgMSB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgY29uc3QgYXNzaWdubWVudHMgPSBnZXRSZXNpemVBc3NpZ25tZW50cygpXG4gICAgICAgICAgICBjb25zdCBjb2x1bW5IZWlnaHRzID0gQXJyYXkuZnJvbShuZXcgQXJyYXkoY29sdW1ucyksICgpID0+IDApXG4gICAgICAgICAgICBjb25zdCBzdGVwID0gKHRpbWVzdGFtcDogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCFjb2x1bW5zKSB0aHJvdyBuZXcgRXJyb3IoJ0NvbHVtbnMgbnVtYmVyIG5vdCBmb3VuZCcpXG4gICAgICAgICAgICAgICAgYXNzaWdubWVudHMuZm9yRWFjaCgoYXNzaWdubWVudCwgbikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjb2wgPSBuICUgY29sdW1uc1xuICAgICAgICAgICAgICAgICAgICBpZiAobiA8IGNvbHVtbnMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbkhlaWdodHNbY29sXSA9IDBcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBhc3NpZ25tZW50LnN0eWxlLnRvcCA9IGNvbHVtbkhlaWdodHNbY29sXSArICdweCdcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXJ0ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IFtlTmFtZSwgc05hbWVdID0gZ2V0RVMoYXNzaWdubWVudClcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9sZExlZnQgPSBOdW1iZXIoc05hbWUuc3Vic3RyaW5nKDEpKSAqIDEwMCAvIDcgKyAnJSdcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9sZFJpZ2h0ID0gTnVtYmVyKGVOYW1lLnN1YnN0cmluZygxKSkgKiAxMDAgLyA3ICsgJyUnXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGxlZnQgPSAoKDEwMCAvIGNvbHVtbnMpICogY29sKSArICclJ1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmlnaHQgPSAoKDEwMCAvIGNvbHVtbnMpICogKGNvbHVtbnMgLSBjb2wgLSAxKSkgKyAnJSdcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdGVFbChhc3NpZ25tZW50LCBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBsZWZ0OiBvbGRMZWZ0LCByaWdodDogb2xkUmlnaHQgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGxlZnQsIHJpZ2h0IH1cbiAgICAgICAgICAgICAgICAgICAgICAgIF0sIHsgZHVyYXRpb246IDMwMCB9KS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhc3NpZ25tZW50LnN0eWxlLmxlZnQgPSBsZWZ0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXNzaWdubWVudC5zdHlsZS5yaWdodCA9IHJpZ2h0XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbHVtbkhlaWdodHNbY29sXSArPSBhc3NpZ25tZW50Lm9mZnNldEhlaWdodCArIDI0XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICBpZiAoc3RhcnQgPT0gbnVsbCkgc3RhcnQgPSB0aW1lc3RhbXBcbiAgICAgICAgICAgICAgICBpZiAoKHRpbWVzdGFtcCAtIHN0YXJ0KSA8IDM1MCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShzdGVwKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RlcClcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghY29sdW1ucykgdGhyb3cgbmV3IEVycm9yKCdDb2x1bW5zIG51bWJlciBub3QgZm91bmQnKVxuICAgICAgICAgICAgICAgIGFzc2lnbm1lbnRzLmZvckVhY2goKGFzc2lnbm1lbnQsIG4pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY29sID0gbiAlIGNvbHVtbnNcbiAgICAgICAgICAgICAgICAgICAgaWYgKG4gPCBjb2x1bW5zKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbHVtbkhlaWdodHNbY29sXSA9IDBcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBhc3NpZ25tZW50LnN0eWxlLnRvcCA9IGNvbHVtbkhlaWdodHNbY29sXSArICdweCdcbiAgICAgICAgICAgICAgICAgICAgY29sdW1uSGVpZ2h0c1tjb2xdICs9IGFzc2lnbm1lbnQub2Zmc2V0SGVpZ2h0ICsgMjRcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSwgMzUwKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzaXplKClcbiAgICAgICAgfVxuICAgICAgICB6ZXJvRGF0ZU9mZnNldHMoKVxuICAgICAgICB1cGRhdGVEYXRlTmF2cygpXG4gICAgfSBlbHNlIHtcbiAgICAgICAgd2luZG93LnNjcm9sbFRvKDAsIGdldFNjcm9sbCgpKVxuICAgICAgICBOQVZfRUxFTUVOVC5jbGFzc0xpc3QuYWRkKCdoZWFkcm9vbS0tbG9ja2VkJylcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICBOQVZfRUxFTUVOVC5jbGFzc0xpc3QucmVtb3ZlKCdoZWFkcm9vbS0tdW5waW5uZWQnKVxuICAgICAgICAgICAgTkFWX0VMRU1FTlQuY2xhc3NMaXN0LnJlbW92ZSgnaGVhZHJvb20tLWxvY2tlZCcpXG4gICAgICAgICAgICBOQVZfRUxFTUVOVC5jbGFzc0xpc3QuYWRkKCdoZWFkcm9vbS0tcGlubmVkJylcbiAgICAgICAgfSwgMzUwKVxuICAgICAgICByZXF1ZXN0SWRsZUNhbGxiYWNrKCgpID0+IHtcbiAgICAgICAgICAgIHplcm9EYXRlT2Zmc2V0cygpXG4gICAgICAgICAgICBsYXp5RmV0Y2goKVxuICAgICAgICAgICAgdXBkYXRlRGF0ZU5hdnMoKVxuICAgICAgICAgICAgZGlzcGxheSgpXG4gICAgICAgIH0sIHt0aW1lb3V0OiAyMDAwfSlcbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJlc2l6ZUNhbGxlcilcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmFzc2lnbm1lbnQnKS5mb3JFYWNoKChhc3NpZ25tZW50KSA9PiB7XG4gICAgICAgICAgICAoYXNzaWdubWVudCBhcyBIVE1MRWxlbWVudCkuc3R5bGUudG9wID0gJ2F1dG8nXG4gICAgICAgIH0pXG4gICAgfVxuICAgIGlmICghc2V0dGluZ3Mudmlld1RyYW5zKSB7XG4gICAgICBmb3JjZUxheW91dChkb2N1bWVudC5ib2R5KVxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdub1RyYW5zJylcbiAgICAgIH0sIDM1MClcbiAgICB9XG4gIH0pXG59KVxuXG4vLyBBbmQgdGhlIGluZm8gdGFicyAoanVzdCBhIGxpdHRsZSBsZXNzIGNvZGUpXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcjaW5mb1RhYnM+bGknKS5mb3JFYWNoKCh0YWIsIHRhYkluZGV4KSA9PiB7XG4gICAgdGFiLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2dCkgPT4ge1xuICAgICAgICBlbGVtQnlJZCgnaW5mbycpLnNldEF0dHJpYnV0ZSgnZGF0YS12aWV3JywgU3RyaW5nKHRhYkluZGV4KSlcbiAgICB9KVxufSlcblxuLy8gVGhlIHZpZXcgaXMgc2V0IHRvIHdoYXQgaXQgd2FzIGxhc3QuXG5pZiAobG9jYWxTdG9yYWdlUmVhZCgndmlldycpICE9IG51bGwpIHtcbiAgZG9jdW1lbnQuYm9keS5zZXRBdHRyaWJ1dGUoJ2RhdGEtdmlldycsIGxvY2FsU3RvcmFnZVJlYWQoJ3ZpZXcnKSlcbiAgaWYgKGxvY2FsU3RvcmFnZVJlYWQoJ3ZpZXcnKSA9PT0gMSkge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCByZXNpemVDYWxsZXIpXG4gIH1cbn1cblxuLy8gQWRkaXRpb25hbGx5LCB0aGUgYWN0aXZlIGNsYXNzIG5lZWRzIHRvIGJlIGFkZGVkIHdoZW4gaW5wdXRzIGFyZSBzZWxlY3RlZCAoZm9yIHRoZSBsb2dpbiBib3gpLlxuSU5QVVRfRUxFTUVOVFMuZm9yRWFjaCgoaW5wdXQpID0+IHtcbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZXZ0KSA9PiB7XG4gICAgICAgIF8kaChfJGgoaW5wdXQucGFyZW50Tm9kZSkucXVlcnlTZWxlY3RvcignbGFiZWwnKSkuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcbiAgICB9KVxuICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgKGV2dCkgPT4ge1xuICAgICAgICBfJGgoXyRoKGlucHV0LnBhcmVudE5vZGUpLnF1ZXJ5U2VsZWN0b3IoJ2xhYmVsJykpLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG4gICAgfSlcbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgKGV2dCkgPT4ge1xuICAgICAgICBpZiAoaW5wdXQudmFsdWUubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBfJGgoXyRoKGlucHV0LnBhcmVudE5vZGUpLnF1ZXJ5U2VsZWN0b3IoJ2xhYmVsJykpLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gICAgICAgIH1cbiAgICB9KVxufSlcblxuLy8gV2hlbiB0aGUgZXNjYXBlIGtleSBpcyBwcmVzc2VkLCB0aGUgY3VycmVudCBhc3NpZ25tZW50IHNob3VsZCBiZSBjbG9zZWQuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldnQpID0+IHtcbiAgaWYgKGV2dC53aGljaCA9PT0gMjcpIHsgLy8gRXNjYXBlIGtleSBwcmVzc2VkXG4gICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2Z1bGwnKS5sZW5ndGggIT09IDApIHsgcmV0dXJuIGNsb3NlT3BlbmVkKG5ldyBFdmVudCgnR2VuZXJhdGVkIEV2ZW50JykpIH1cbiAgfVxufSk7XG5cbi8vIElmIGl0J3Mgd2ludGVyIHRpbWUsIGEgY2xhc3MgaXMgYWRkZWQgdG8gdGhlIGJvZHkgZWxlbWVudC5cbigoKSA9PiB7XG4gICAgY29uc3QgdG9kYXlEYXRlID0gbmV3IERhdGUoKVxuICAgIGlmIChuZXcgRGF0ZSh0b2RheURhdGUuZ2V0RnVsbFllYXIoKSwgMTAsIDI3KSA8PSB0b2RheURhdGUgJiZcbiAgICAgICAgdG9kYXlEYXRlIDw9IG5ldyBEYXRlKHRvZGF5RGF0ZS5nZXRGdWxsWWVhcigpLCAxMSwgMzIpKSB7XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ3dpbnRlcicpXG4gICAgfVxufSkoKVxuXG4vLyBGb3IgdGhlIG5hdmJhciB0b2dnbGUgYnV0dG9ucywgYSBmdW5jdGlvbiB0byB0b2dnbGUgdGhlIGFjdGlvbiBpcyBkZWZpbmVkIHRvIGVsaW1pbmF0ZSBjb2RlLlxuZnVuY3Rpb24gbmF2VG9nZ2xlKGVsZW06IHN0cmluZywgbHM6IHN0cmluZywgZj86ICgpID0+IHZvaWQpOiB2b2lkIHtcbiAgICByaXBwbGUoZWxlbUJ5SWQoZWxlbSkpXG4gICAgZWxlbUJ5SWQoZWxlbSkuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsICgpID0+IHtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QudG9nZ2xlKGxzKVxuICAgICAgICByZXNpemUoKVxuICAgICAgICBsb2NhbFN0b3JhZ2VXcml0ZShscywgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuY29udGFpbnMobHMpKVxuICAgICAgICBpZiAoZiAhPSBudWxsKSBmKClcbiAgICB9KVxuICAgIGlmIChsb2NhbFN0b3JhZ2VSZWFkKGxzKSkgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKGxzKVxufVxuXG4vLyBUaGUgYnV0dG9uIHRvIHNob3cvaGlkZSBjb21wbGV0ZWQgYXNzaWdubWVudHMgaW4gbGlzdCB2aWV3IGFsc28gbmVlZHMgZXZlbnQgbGlzdGVuZXJzLlxubmF2VG9nZ2xlKCdjdkJ1dHRvbicsICdzaG93RG9uZScsICgpID0+IHNldFRpbWVvdXQocmVzaXplLCAxMDAwKSlcblxuLy8gVGhlIHNhbWUgZ29lcyBmb3IgdGhlIGJ1dHRvbiB0aGF0IHNob3dzIHVwY29taW5nIHRlc3RzLlxuaWYgKGxvY2FsU3RvcmFnZS5zaG93SW5mbyA9PSBudWxsKSB7IGxvY2FsU3RvcmFnZS5zaG93SW5mbyA9IEpTT04uc3RyaW5naWZ5KHRydWUpIH1cbm5hdlRvZ2dsZSgnaW5mb0J1dHRvbicsICdzaG93SW5mbycpXG5cbi8vIFRoaXMgYWxzbyBnZXRzIHJlcGVhdGVkIGZvciB0aGUgdGhlbWUgdG9nZ2xpbmcuXG5uYXZUb2dnbGUoJ2xpZ2h0QnV0dG9uJywgJ2RhcmsnKVxuXG5mdW5jdGlvbiBzZXR1cERhdGVMaXN0ZW5lcihvcHRzOiB7IGVsZW06IEhUTUxFbGVtZW50LCBmcm9tOiBIVE1MRWxlbWVudCwgY3VycmVudDogSFRNTEVsZW1lbnQsIHRvOiBIVE1MRWxlbWVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaG9va3M6IEFycmF5PCgpID0+IHZvaWQ+LCBmb3J3YXJkOiBib29sZWFuLCBuZXdzdXBwbGllcjogKCkgPT4gc3RyaW5nIH0pOiB2b2lkIHtcbiAgICBjb25zdCB7IGVsZW0sIGZyb20sIGN1cnJlbnQsIHRvLCBob29rcywgZm9yd2FyZCwgbmV3c3VwcGxpZXIgfSA9IG9wdHNcbiAgICBlbGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICBjb25zdCB0cmFuc2Zyb20gPSBmb3J3YXJkID8gJ3RyYW5zbGF0ZVgoMCUpJyA6ICd0cmFuc2xhdGVYKC0xMDAlKSdcbiAgICAgICAgY29uc3QgdHJhbnN0byA9IGZvcndhcmQgPyAndHJhbnNsYXRlWCgtMTAwJSknIDogJ3RyYW5zbGF0ZVgoMCUpJ1xuICAgICAgICBob29rcy5mb3JFYWNoKChob29rKSA9PiBob29rKCkpXG4gICAgICAgIHRvLnN0eWxlLmRpc3BsYXkgPSAnaW5saW5lLWJsb2NrJ1xuICAgICAgICBQcm9taXNlLnJhY2UoW1xuICAgICAgICAgICAgYW5pbWF0ZUVsKGN1cnJlbnQsIFtcbiAgICAgICAgICAgICAgICB7dHJhbnNmb3JtOiB0cmFuc2Zyb20sIG9wYWNpdHk6IDF9LFxuICAgICAgICAgICAgICAgIHtvcGFjaXR5OiAwfSxcbiAgICAgICAgICAgICAgICB7dHJhbnNmb3JtOiB0cmFuc3RvLCBvcGFjaXR5OiAwfVxuICAgICAgICAgICAgXSwge2R1cmF0aW9uOiAzMDAsIGVhc2luZzogJ2Vhc2Utb3V0J30pLFxuICAgICAgICAgICAgYW5pbWF0ZUVsKHRvLCBbXG4gICAgICAgICAgICAgICAge3RyYW5zZm9ybTogdHJhbnNmcm9tLCBvcGFjaXR5OiAwfSxcbiAgICAgICAgICAgICAgICB7b3BhY2l0eTogMH0sXG4gICAgICAgICAgICAgICAge3RyYW5zZm9ybTogdHJhbnN0bywgb3BhY2l0eTogMX1cbiAgICAgICAgICAgIF0sIHtkdXJhdGlvbjogMzAwLCBlYXNpbmc6ICdlYXNlLW91dCd9KVxuICAgICAgICBdKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICBmcm9tLmlubmVySFRNTCA9IGN1cnJlbnQuaW5uZXJIVE1MXG4gICAgICAgICAgICAgICAgY3VycmVudC5pbm5lckhUTUwgPSB0by5pbm5lckhUTUxcbiAgICAgICAgICAgICAgICB0by5pbm5lckhUTUwgPSBuZXdzdXBwbGllcigpXG4gICAgICAgICAgICAgICAgdG8uc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuICAgICAgICB9KVxuICAgIH0pXG59XG5cbnNldHVwRGF0ZUxpc3RlbmVyKHtcbiAgICBlbGVtOiBlbGVtQnlJZCgnbGlzdG5leHQnKSxcbiAgICBmcm9tOiBlbGVtQnlJZCgnbGlzdHByZXZkYXRlJyksXG4gICAgY3VycmVudDogZWxlbUJ5SWQoJ2xpc3Rub3dkYXRlJyksXG4gICAgdG86IGVsZW1CeUlkKCdsaXN0bmV4dGRhdGUnKSxcbiAgICBob29rczogW2luY3JlbWVudExpc3REYXRlT2Zmc2V0LCBkaXNwbGF5XSxcbiAgICBmb3J3YXJkOiB0cnVlLFxuICAgIG5ld3N1cHBsaWVyOiAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGxpc3REYXRlMiA9IG5ldyBEYXRlKClcbiAgICAgICAgbGlzdERhdGUyLnNldERhdGUobGlzdERhdGUyLmdldERhdGUoKSArIDEgKyBnZXRMaXN0RGF0ZU9mZnNldCgpKVxuICAgICAgICByZXR1cm4gZGF0ZVN0cmluZyhsaXN0RGF0ZTIpLnJlcGxhY2UoJ1RvZGF5JywgJ05vdycpXG4gICAgfVxufSlcblxuc2V0dXBEYXRlTGlzdGVuZXIoe1xuICAgIGVsZW06IGVsZW1CeUlkKCdsaXN0YmVmb3JlJyksXG4gICAgZnJvbTogZWxlbUJ5SWQoJ2xpc3RuZXh0ZGF0ZScpLFxuICAgIGN1cnJlbnQ6IGVsZW1CeUlkKCdsaXN0bm93ZGF0ZScpLFxuICAgIHRvOiBlbGVtQnlJZCgnbGlzdHByZXZkYXRlJyksXG4gICAgaG9va3M6IFtkZWNyZW1lbnRMaXN0RGF0ZU9mZnNldCwgZGlzcGxheV0sXG4gICAgZm9yd2FyZDogZmFsc2UsXG4gICAgbmV3c3VwcGxpZXI6ICgpID0+IHtcbiAgICAgICAgY29uc3QgbGlzdERhdGUyID0gbmV3IERhdGUoKVxuICAgICAgICBsaXN0RGF0ZTIuc2V0RGF0ZShsaXN0RGF0ZTIuZ2V0RGF0ZSgpIC0gMSArIGdldExpc3REYXRlT2Zmc2V0KCkpXG4gICAgICAgIHJldHVybiBkYXRlU3RyaW5nKGxpc3REYXRlMikucmVwbGFjZSgnVG9kYXknLCAnTm93JylcbiAgICB9XG59KVxuXG5mdW5jdGlvbiBsYXp5RmV0Y2goKTogdm9pZCB7XG4gICAgQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2VlaywgLnVwY29taW5nVGVzdCcpKVxuICAgICAgICAuZm9yRWFjaCgocykgPT4gcy5yZW1vdmUoKSlcbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1wY3J2aWV3JylcbiAgICBpZiAoZ2V0Q2FsRGF0ZU9mZnNldCgpID09PSAwKSB7XG4gICAgICAgIHNldERhdGEobG9jYWxTdG9yYWdlUmVhZCgnZGF0YScpKVxuICAgICAgICBkaXNwbGF5KClcbiAgICB9IGVsc2Uge1xuICAgICAgICBmZXRjaCh0cnVlKVxuICAgIH1cbn1cblxuc2V0dXBEYXRlTGlzdGVuZXIoe1xuICAgIGVsZW06IGVsZW1CeUlkKCdjYWxuZXh0JyksXG4gICAgZnJvbTogZWxlbUJ5SWQoJ2NhbHByZXZkYXRlJyksXG4gICAgY3VycmVudDogZWxlbUJ5SWQoJ2NhbG5vd2RhdGUnKSxcbiAgICB0bzogZWxlbUJ5SWQoJ2NhbG5leHRkYXRlJyksXG4gICAgaG9va3M6IFtpbmNyZW1lbnRDYWxEYXRlT2Zmc2V0LCBsYXp5RmV0Y2hdLFxuICAgIGZvcndhcmQ6IHRydWUsXG4gICAgbmV3c3VwcGxpZXI6ICgpID0+IHtcbiAgICAgICAgY29uc3QgbGlzdERhdGUyID0gbmV3IERhdGUoKVxuICAgICAgICBsaXN0RGF0ZTIuc2V0TW9udGgobGlzdERhdGUyLmdldE1vbnRoKCkgKyAxICsgZ2V0Q2FsRGF0ZU9mZnNldCgpKVxuICAgICAgICByZXR1cm4gbW9udGhTdHJpbmcobGlzdERhdGUyKS5yZXBsYWNlKCdUb2RheScsICdOb3cnKVxuICAgIH1cbn0pXG5cbnNldHVwRGF0ZUxpc3RlbmVyKHtcbiAgICBlbGVtOiBlbGVtQnlJZCgnY2FsYmVmb3JlJyksXG4gICAgZnJvbTogZWxlbUJ5SWQoJ2NhbG5leHRkYXRlJyksXG4gICAgY3VycmVudDogZWxlbUJ5SWQoJ2NhbG5vd2RhdGUnKSxcbiAgICB0bzogZWxlbUJ5SWQoJ2NhbHByZXZkYXRlJyksXG4gICAgaG9va3M6IFtkZWNyZW1lbnRDYWxEYXRlT2Zmc2V0LCBsYXp5RmV0Y2hdLFxuICAgIGZvcndhcmQ6IGZhbHNlLFxuICAgIG5ld3N1cHBsaWVyOiAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGxpc3REYXRlMiA9IG5ldyBEYXRlKClcbiAgICAgICAgbGlzdERhdGUyLnNldE1vbnRoKGxpc3REYXRlMi5nZXRNb250aCgpIC0gMSArIGdldENhbERhdGVPZmZzZXQoKSlcbiAgICAgICAgcmV0dXJuIG1vbnRoU3RyaW5nKGxpc3REYXRlMilcbiAgICB9XG59KVxuXG5mdW5jdGlvbiB1cGRhdGVMaXN0TmF2KCk6IHZvaWQge1xuICAgIGNvbnN0IGQgPSBuZXcgRGF0ZSgpXG4gICAgZC5zZXREYXRlKChkLmdldERhdGUoKSArIGdldExpc3REYXRlT2Zmc2V0KCkpIC0gMSlcbiAgICBjb25zdCB1cCA9IChpZDogc3RyaW5nKSA9PiB7XG4gICAgICAgIGVsZW1CeUlkKGlkKS5pbm5lckhUTUwgPSBkYXRlU3RyaW5nKGQpLnJlcGxhY2UoJ1RvZGF5JywgJ05vdycpXG4gICAgICAgIHJldHVybiBkLnNldERhdGUoZC5nZXREYXRlKCkgKyAxKVxuICAgIH1cbiAgICB1cCgnbGlzdHByZXZkYXRlJylcbiAgICB1cCgnbGlzdG5vd2RhdGUnKVxuICAgIHVwKCdsaXN0bmV4dGRhdGUnKVxufVxuXG5mdW5jdGlvbiB1cGRhdGVDYWxOYXYoKTogdm9pZCB7XG4gICAgY29uc3QgZCA9IG5ldyBEYXRlKClcbiAgICBkLnNldE1vbnRoKChkLmdldE1vbnRoKCkgKyBnZXRDYWxEYXRlT2Zmc2V0KCkpIC0gMSlcbiAgICBjb25zdCB1cCA9IChpZDogc3RyaW5nKSA9PiB7XG4gICAgICAgIGVsZW1CeUlkKGlkKS5pbm5lckhUTUwgPSBtb250aFN0cmluZyhkKVxuICAgICAgICByZXR1cm4gZC5zZXRNb250aChkLmdldE1vbnRoKCkgKyAxKVxuICAgIH1cbiAgICB1cCgnY2FscHJldmRhdGUnKVxuICAgIHVwKCdjYWxub3dkYXRlJylcbiAgICB1cCgnY2FsbmV4dGRhdGUnKVxufVxuXG4vLyBXaGVuZXZlciBhIGRhdGUgaXMgZG91YmxlIGNsaWNrZWQsIGxvbmcgdGFwcGVkLCBvciBmb3JjZSB0b3VjaGVkLCBsaXN0IHZpZXcgZm9yIHRoYXQgZGF5IGlzIGRpc3BsYXllZC5cbmZ1bmN0aW9uIHVwZGF0ZURhdGVOYXZzKCk6IHZvaWQge1xuICAgIHVwZGF0ZUxpc3ROYXYoKVxuICAgIHVwZGF0ZUNhbE5hdigpXG59XG5cbmZ1bmN0aW9uIHN3aXRjaFRvTGlzdChldnQ6IEV2ZW50KTogdm9pZCB7XG4gICAgaWYgKF8kaChldnQudGFyZ2V0KS5jbGFzc0xpc3QuY29udGFpbnMoJ21vbnRoJykgfHwgXyRoKGV2dC50YXJnZXQpLmNsYXNzTGlzdC5jb250YWlucygnZGF0ZScpKSB7XG4gICAgICAgIHNldExpc3REYXRlT2Zmc2V0KHRvRGF0ZU51bShOdW1iZXIoXyRoKF8kaChldnQudGFyZ2V0KS5wYXJlbnROb2RlKS5nZXRBdHRyaWJ1dGUoJ2RhdGEtZGF0ZScpKSkgLSB0b2RheSgpKVxuICAgICAgICB1cGRhdGVEYXRlTmF2cygpXG4gICAgICAgIGRvY3VtZW50LmJvZHkuc2V0QXR0cmlidXRlKCdkYXRhLXZpZXcnLCAnMScpXG4gICAgICAgIHJldHVybiBkaXNwbGF5KClcbiAgICB9XG59XG5cbmRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcignZGJsY2xpY2snLCBzd2l0Y2hUb0xpc3QpXG5kb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ3dlYmtpdG1vdXNlZm9yY2V1cCcsIHN3aXRjaFRvTGlzdCk7XG4oKCkgPT4ge1xuICAgIGxldCB0YXB0aW1lcjogbnVtYmVyfG51bGwgPSBudWxsXG4gICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgKGV2dCkgPT4gdGFwdGltZXIgPSBzZXRUaW1lb3V0KCgoKSA9PiBzd2l0Y2hUb0xpc3QoZXZ0KSksIDEwMDApKVxuICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCAoZXZ0KSA9PiB7XG4gICAgICAgIGlmICh0YXB0aW1lcikgY2xlYXJUaW1lb3V0KHRhcHRpbWVyKVxuICAgICAgICB0YXB0aW1lciA9IG51bGxcbiAgICB9KVxufSkoKVxuXG4vLyA8YSBuYW1lPVwic2lkZVwiLz5cbi8vIFNpZGUgbWVudSBhbmQgTmF2YmFyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy9cbi8vIFRoZSBbSGVhZHJvb20gbGlicmFyeV0oaHR0cHM6Ly9naXRodWIuY29tL1dpY2t5TmlsbGlhbXMvaGVhZHJvb20uanMpIGlzIHVzZWQgdG8gc2hvdyB0aGUgbmF2YmFyIHdoZW4gc2Nyb2xsaW5nIHVwXG5jb25zdCBoZWFkcm9vbSA9IG5ldyBIZWFkcm9vbShfJChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCduYXYnKSksIHtcbiAgdG9sZXJhbmNlOiAxMCxcbiAgb2Zmc2V0OiA2NlxufSlcbmhlYWRyb29tLmluaXQoKVxuXG4vLyBBbHNvLCB0aGUgc2lkZSBtZW51IG5lZWRzIGV2ZW50IGxpc3RlbmVycy5cbmVsZW1CeUlkKCdjb2xsYXBzZUJ1dHRvbicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbidcbiAgZWxlbUJ5SWQoJ3NpZGVOYXYnKS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxuICByZXR1cm4gZWxlbUJ5SWQoJ3NpZGVCYWNrZ3JvdW5kJykuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcbn0pXG5cbmVsZW1CeUlkKCdzaWRlQmFja2dyb3VuZCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICBlbGVtQnlJZCgnc2lkZUJhY2tncm91bmQnKS5zdHlsZS5vcGFjaXR5ID0gJzAnXG4gIGVsZW1CeUlkKCdzaWRlTmF2JykuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcbiAgZWxlbUJ5SWQoJ2RyYWdUYXJnZXQnKS5zdHlsZS53aWR0aCA9ICcnXG4gIHJldHVybiBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2F1dG8nXG4gICAgZWxlbUJ5SWQoJ3NpZGVCYWNrZ3JvdW5kJykuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuICB9XG4gICwgMzUwKVxufSlcblxudXBkYXRlQXZhdGFyKClcblxuLy8gPGEgbmFtZT1cImF0aGVuYVwiLz4gQXRoZW5hIChTY2hvb2xvZ3kpXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS1cbi8vXG5cbi8vIDxhIG5hbWU9XCJzZXR0aW5nc1wiLz4gU2V0dGluZ3Ncbi8vIC0tLS0tLS0tXG4vL1xuLy8gVGhlIGNvZGUgYmVsb3cgdXBkYXRlcyB0aGUgY3VycmVudCB2ZXJzaW9uIHRleHQgaW4gdGhlIHNldHRpbmdzLiBJIHNob3VsZCd2ZSBwdXQgdGhpcyB1bmRlciB0aGVcbi8vIFVwZGF0ZXMgc2VjdGlvbiwgYnV0IGl0IHNob3VsZCBnbyBiZWZvcmUgdGhlIGRpc3BsYXkoKSBmdW5jdGlvbiBmb3JjZXMgYSByZWZsb3cuXG5lbGVtQnlJZCgndmVyc2lvbicpLmlubmVySFRNTCA9IFZFUlNJT05cblxuLy8gVG8gYnJpbmcgdXAgdGhlIHNldHRpbmdzIHdpbmRvd3MsIGFuIGV2ZW50IGxpc3RlbmVyIG5lZWRzIHRvIGJlIGFkZGVkIHRvIHRoZSBidXR0b24uXG5lbGVtQnlJZCgnc2V0dGluZ3NCJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgZWxlbUJ5SWQoJ3NpZGVCYWNrZ3JvdW5kJykuY2xpY2soKVxuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnc2V0dGluZ3NTaG93bicpXG4gICAgZWxlbUJ5SWQoJ2JyYW5kJykuaW5uZXJIVE1MID0gJ1NldHRpbmdzJ1xuICAgIHJldHVybiBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgXyRoKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ21haW4nKSkuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuICAgIH0pXG59KVxuXG4vLyBUaGUgYmFjayBidXR0b24gYWxzbyBuZWVkcyB0byBjbG9zZSB0aGUgc2V0dGluZ3Mgd2luZG93LlxuZWxlbUJ5SWQoJ2JhY2tCdXR0b24nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICBfJGgoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbWFpbicpKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnc2V0dGluZ3NTaG93bicpXG4gICAgcmV0dXJuIGVsZW1CeUlkKCdicmFuZCcpLmlubmVySFRNTCA9ICdDaGVjayBQQ1InXG59KVxuXG4vLyBUaGUgY29kZSBiZWxvdyBpcyB3aGF0IHRoZSBzZXR0aW5ncyBjb250cm9sLlxuaWYgKHNldHRpbmdzLnNlcFRhc2tzKSB7XG4gICAgZWxlbUJ5SWQoJ2luZm8nKS5jbGFzc0xpc3QuYWRkKCdpc1Rhc2tzJylcbiAgICBlbGVtQnlJZCgnbmV3Jykuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xufVxuaWYgKHNldHRpbmdzLmhvbGlkYXlUaGVtZXMpIHsgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdob2xpZGF5VGhlbWVzJykgfVxuaWYgKHNldHRpbmdzLnNlcFRhc2tDbGFzcykgeyBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ3NlcFRhc2tDbGFzcycpIH1cbmludGVyZmFjZSBJQ29sb3JNYXAgeyBbY2xzOiBzdHJpbmddOiBzdHJpbmcgfVxubGV0IGFzc2lnbm1lbnRDb2xvcnM6IElDb2xvck1hcCA9IGxvY2FsU3RvcmFnZVJlYWQoJ2Fzc2lnbm1lbnRDb2xvcnMnLCB7XG4gICAgY2xhc3N3b3JrOiAnIzY4OWYzOCcsIGhvbWV3b3JrOiAnIzIxOTZmMycsIGxvbmd0ZXJtOiAnI2Y1N2MwMCcsIHRlc3Q6ICcjZjQ0MzM2J1xufSlcbmxldCBjbGFzc0NvbG9ycyA9IGxvY2FsU3RvcmFnZVJlYWQoJ2NsYXNzQ29sb3JzJywgKCkgPT4ge1xuICAgIGNvbnN0IGNjOiBJQ29sb3JNYXAgPSB7fVxuICAgIGNvbnN0IGRhdGEgPSBnZXREYXRhKClcbiAgICBpZiAoIWRhdGEpIHJldHVybiBjY1xuICAgIGRhdGEuY2xhc3Nlcy5mb3JFYWNoKChjOiBzdHJpbmcpID0+IHtcbiAgICAgICAgY2NbY10gPSAnIzYxNjE2MSdcbiAgICB9KVxuICAgIHJldHVybiBjY1xufSlcbmVsZW1CeUlkKGAke3NldHRpbmdzLmNvbG9yVHlwZX1Db2xvcnNgKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgKCkgPT4ge1xuICBpZiAoc2V0dGluZ3MucmVmcmVzaE9uRm9jdXMpIGZldGNoKClcbn0pXG5mdW5jdGlvbiBpbnRlcnZhbFJlZnJlc2goKTogdm9pZCB7XG4gICAgY29uc3QgciA9IHNldHRpbmdzLnJlZnJlc2hSYXRlXG4gICAgaWYgKHIgPiAwKSB7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5kZWJ1ZygnUmVmcmVzaGluZyBiZWNhdXNlIG9mIHRpbWVyJylcbiAgICAgICAgICAgIGZldGNoKClcbiAgICAgICAgICAgIGludGVydmFsUmVmcmVzaCgpXG4gICAgICAgIH0sIHIgKiA2MCAqIDEwMDApXG4gICAgfVxufVxuaW50ZXJ2YWxSZWZyZXNoKClcblxuLy8gRm9yIGNob29zaW5nIGNvbG9ycywgdGhlIGNvbG9yIGNob29zaW5nIGJveGVzIG5lZWQgdG8gYmUgaW5pdGlhbGl6ZWQuXG5jb25zdCBwYWxldHRlOiBJQ29sb3JNYXAgPSB7XG4gICcjZjQ0MzM2JzogJyNCNzFDMUMnLFxuICAnI2U5MWU2Myc6ICcjODgwRTRGJyxcbiAgJyM5YzI3YjAnOiAnIzRBMTQ4QycsXG4gICcjNjczYWI3JzogJyMzMTFCOTInLFxuICAnIzNmNTFiNSc6ICcjMUEyMzdFJyxcbiAgJyMyMTk2ZjMnOiAnIzBENDdBMScsXG4gICcjMDNhOWY0JzogJyMwMTU3OUInLFxuICAnIzAwYmNkNCc6ICcjMDA2MDY0JyxcbiAgJyMwMDk2ODgnOiAnIzAwNEQ0MCcsXG4gICcjNGNhZjUwJzogJyMxQjVFMjAnLFxuICAnIzY4OWYzOCc6ICcjMzM2OTFFJyxcbiAgJyNhZmI0MmInOiAnIzgyNzcxNycsXG4gICcjZmJjMDJkJzogJyNGNTdGMTcnLFxuICAnI2ZmYTAwMCc6ICcjRkY2RjAwJyxcbiAgJyNmNTdjMDAnOiAnI0U2NTEwMCcsXG4gICcjZmY1NzIyJzogJyNCRjM2MEMnLFxuICAnIzc5NTU0OCc6ICcjM0UyNzIzJyxcbiAgJyM2MTYxNjEnOiAnIzIxMjEyMSdcbn1cblxuZ2V0Q2xhc3NlcygpLmZvckVhY2goKGM6IHN0cmluZykgPT4ge1xuICAgIGNvbnN0IGQgPSBlbGVtZW50KCdkaXYnLCBbXSwgYylcbiAgICBkLnNldEF0dHJpYnV0ZSgnZGF0YS1jb250cm9sJywgYylcbiAgICBkLmFwcGVuZENoaWxkKGVsZW1lbnQoJ3NwYW4nLCBbXSkpXG4gICAgZWxlbUJ5SWQoJ2NsYXNzQ29sb3JzJykuYXBwZW5kQ2hpbGQoZClcbn0pXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY29sb3JzJykuZm9yRWFjaCgoZSkgPT4ge1xuICAgIGUucXVlcnlTZWxlY3RvckFsbCgnZGl2JykuZm9yRWFjaCgoY29sb3IpID0+IHtcbiAgICAgICAgY29uc3QgY29udHJvbGxlZENvbG9yID0gY29sb3IuZ2V0QXR0cmlidXRlKCdkYXRhLWNvbnRyb2wnKVxuICAgICAgICBpZiAoIWNvbnRyb2xsZWRDb2xvcikgdGhyb3cgbmV3IEVycm9yKCdFbGVtZW50IGhhcyBubyBjb250cm9sbGVkIGNvbG9yJylcblxuICAgICAgICBjb25zdCBzcCA9IF8kaChjb2xvci5xdWVyeVNlbGVjdG9yKCdzcGFuJykpXG4gICAgICAgIGNvbnN0IGxpc3ROYW1lID0gZS5nZXRBdHRyaWJ1dGUoJ2lkJykgPT09ICdjbGFzc0NvbG9ycycgPyAnY2xhc3NDb2xvcnMnIDogJ2Fzc2lnbm1lbnRDb2xvcnMnXG4gICAgICAgIGNvbnN0IGxpc3RTZXR0ZXIgPSAodjogSUNvbG9yTWFwKSA9PiB7XG4gICAgICAgICAgICBlLmdldEF0dHJpYnV0ZSgnaWQnKSA9PT0gJ2NsYXNzQ29sb3JzJyA/IGNsYXNzQ29sb3JzID0gdiA6IGFzc2lnbm1lbnRDb2xvcnMgPSB2XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbGlzdCA9IGUuZ2V0QXR0cmlidXRlKCdpZCcpID09PSAnY2xhc3NDb2xvcnMnID8gY2xhc3NDb2xvcnMgOiBhc3NpZ25tZW50Q29sb3JzXG4gICAgICAgIHNwLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGxpc3RbY29udHJvbGxlZENvbG9yXVxuICAgICAgICBPYmplY3Qua2V5cyhwYWxldHRlKS5mb3JFYWNoKChwKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwZSA9IGVsZW1lbnQoJ3NwYW4nLCBbXSlcbiAgICAgICAgICAgIHBlLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHBcbiAgICAgICAgICAgIGlmIChwID09PSBsaXN0W2NvbnRyb2xsZWRDb2xvcl0pIHtcbiAgICAgICAgICAgICAgICBwZS5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzcC5hcHBlbmRDaGlsZChwZSlcbiAgICAgICAgfSlcbiAgICAgICAgY29uc3QgY3VzdG9tID0gZWxlbWVudCgnc3BhbicsIFsnY3VzdG9tQ29sb3InXSwgYDxhPkN1c3RvbTwvYT4gXFxcbiAgICA8aW5wdXQgdHlwZT0ndGV4dCcgcGxhY2Vob2xkZXI9J1dhcyAke2xpc3RbY29udHJvbGxlZENvbG9yXX0nIC8+IFxcXG4gICAgPHNwYW4gY2xhc3M9J2N1c3RvbUluZm8nPlVzZSBhbnkgQ1NTIHZhbGlkIGNvbG9yIG5hbWUsIHN1Y2ggYXMgXFxcbiAgICA8Y29kZT4jRjQ0MzM2PC9jb2RlPiBvciA8Y29kZT5yZ2IoNjQsIDQzLCAyKTwvY29kZT4gb3IgPGNvZGU+Y3lhbjwvY29kZT48L3NwYW4+IFxcXG4gICAgPGEgY2xhc3M9J2N1c3RvbU9rJz5TZXQ8L2E+YClcbiAgICAgICAgY3VzdG9tLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2dCkgPT4gZXZ0LnN0b3BQcm9wYWdhdGlvbigpKVxuICAgICAgICBfJChjdXN0b20ucXVlcnlTZWxlY3RvcignYScpKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldnQpID0+IHtcbiAgICAgICAgICAgIHNwLmNsYXNzTGlzdC50b2dnbGUoJ29uQ3VzdG9tJylcbiAgICAgICAgICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICB9KVxuICAgICAgICBzcC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldnQpID0+IHtcbiAgICAgICAgICAgIGlmIChzcC5jbGFzc0xpc3QuY29udGFpbnMoJ2Nob29zZScpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gXyRoKGV2dC50YXJnZXQpXG4gICAgICAgICAgICAgICAgY29uc3QgYmcgPSB0aW55Y29sb3IodGFyZ2V0LnN0eWxlLmJhY2tncm91bmRDb2xvciB8fCAnIzAwMCcpLnRvSGV4U3RyaW5nKClcbiAgICAgICAgICAgICAgICBsaXN0W2NvbnRyb2xsZWRDb2xvcl0gPSBiZ1xuICAgICAgICAgICAgICAgIHNwLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGJnXG4gICAgICAgICAgICAgICAgY29uc3Qgc2VsZWN0ZWQgPSB0YXJnZXQucXVlcnlTZWxlY3RvcignLnNlbGVjdGVkJylcbiAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWQuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0YXJnZXQuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKVxuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZVtsaXN0TmFtZV0gPSBKU09OLnN0cmluZ2lmeShsaXN0KVxuICAgICAgICAgICAgICAgIGxpc3RTZXR0ZXIobGlzdClcbiAgICAgICAgICAgICAgICB1cGRhdGVDb2xvcnMoKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3AuY2xhc3NMaXN0LnRvZ2dsZSgnY2hvb3NlJylcbiAgICAgICAgfSlcbiAgICAgICAgXyQoY3VzdG9tLnF1ZXJ5U2VsZWN0b3IoJy5jdXN0b21PaycpKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldnQpID0+IHtcbiAgICAgICAgICAgIHNwLmNsYXNzTGlzdC5yZW1vdmUoJ29uQ3VzdG9tJylcbiAgICAgICAgICAgIHNwLmNsYXNzTGlzdC50b2dnbGUoJ2Nob29zZScpXG4gICAgICAgICAgICBjb25zdCBzZWxlY3RlZEVsID0gc3AucXVlcnlTZWxlY3RvcignLnNlbGVjdGVkJylcbiAgICAgICAgICAgIGlmIChzZWxlY3RlZEVsICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBzZWxlY3RlZEVsLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNwLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IChsaXN0W2NvbnRyb2xsZWRDb2xvcl0gPSBfJChjdXN0b20ucXVlcnlTZWxlY3RvcignaW5wdXQnKSkudmFsdWUpXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2VbbGlzdE5hbWVdID0gSlNPTi5zdHJpbmdpZnkobGlzdClcbiAgICAgICAgICAgIHVwZGF0ZUNvbG9ycygpXG4gICAgICAgICAgICByZXR1cm4gZXZ0LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgIH0pXG4gICAgfSlcbn0pXG5cbi8vIFRoZW4sIGEgZnVuY3Rpb24gdGhhdCB1cGRhdGVzIHRoZSBjb2xvciBwcmVmZXJlbmNlcyBpcyBkZWZpbmVkLlxuZnVuY3Rpb24gdXBkYXRlQ29sb3JzKCk6IHZvaWQge1xuICAgIGNvbnN0IHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKVxuICAgIHN0eWxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKSlcbiAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHN0eWxlKVxuICAgIGNvbnN0IHNoZWV0ID0gXyQoc3R5bGUuc2hlZXQpIGFzIENTU1N0eWxlU2hlZXRcblxuICAgIGNvbnN0IGFkZENvbG9yUnVsZSA9IChzZWxlY3Rvcjogc3RyaW5nLCBsaWdodDogc3RyaW5nLCBkYXJrOiBzdHJpbmcsIGV4dHJhID0gJycpID0+IHtcbiAgICAgICAgY29uc3QgbWl4ZWQgPSB0aW55Y29sb3IubWl4KGxpZ2h0LCAnIzFCNUUyMCcsIDcwKS50b0hleFN0cmluZygpXG4gICAgICAgIHNoZWV0Lmluc2VydFJ1bGUoYCR7ZXh0cmF9LmFzc2lnbm1lbnQke3NlbGVjdG9yfSB7IGJhY2tncm91bmQtY29sb3I6ICR7bGlnaHR9OyB9YCwgMClcbiAgICAgICAgc2hlZXQuaW5zZXJ0UnVsZShgJHtleHRyYX0uYXNzaWdubWVudCR7c2VsZWN0b3J9LmRvbmUgeyBiYWNrZ3JvdW5kLWNvbG9yOiAke2Rhcmt9OyB9YCwgMClcbiAgICAgICAgc2hlZXQuaW5zZXJ0UnVsZShgJHtleHRyYX0uYXNzaWdubWVudCR7c2VsZWN0b3J9OjpiZWZvcmUgeyBiYWNrZ3JvdW5kLWNvbG9yOiAke21peGVkfTsgfWAsIDApXG4gICAgICAgIHNoZWV0Lmluc2VydFJ1bGUoYCR7ZXh0cmF9LmFzc2lnbm1lbnRJdGVtJHtzZWxlY3Rvcn0+aSB7IGJhY2tncm91bmQtY29sb3I6ICR7bGlnaHR9OyB9YCwgMClcbiAgICAgICAgc2hlZXQuaW5zZXJ0UnVsZShgJHtleHRyYX0uYXNzaWdubWVudEl0ZW0ke3NlbGVjdG9yfS5kb25lPmkgeyBiYWNrZ3JvdW5kLWNvbG9yOiAke2Rhcmt9OyB9YCwgMClcbiAgICB9XG5cbiAgICBjb25zdCBjcmVhdGVQYWxldHRlID0gKGNvbG9yOiBzdHJpbmcpID0+IHRpbnljb2xvcihjb2xvcikuZGFya2VuKDI0KS50b0hleFN0cmluZygpXG5cbiAgICBpZiAoc2V0dGluZ3MuY29sb3JUeXBlID09PSAnYXNzaWdubWVudCcpIHtcbiAgICAgICAgT2JqZWN0LmVudHJpZXMoYXNzaWdubWVudENvbG9ycykuZm9yRWFjaCgoW25hbWUsIGNvbG9yXSkgPT4ge1xuICAgICAgICAgICAgYWRkQ29sb3JSdWxlKGAuJHtuYW1lfWAsIGNvbG9yLCBwYWxldHRlW2NvbG9yXSB8fCBjcmVhdGVQYWxldHRlKGNvbG9yKSlcbiAgICAgICAgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgICBPYmplY3QuZW50cmllcyhjbGFzc0NvbG9ycykuZm9yRWFjaCgoW25hbWUsIGNvbG9yXSkgPT4ge1xuICAgICAgICAgICAgYWRkQ29sb3JSdWxlKGBbZGF0YS1jbGFzcz1cXFwiJHtuYW1lfVxcXCJdYCwgY29sb3IsIHBhbGV0dGVbY29sb3JdIHx8IGNyZWF0ZVBhbGV0dGUoY29sb3IpKVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGFkZENvbG9yUnVsZSgnLnRhc2snLCAnI0Y1RjVGNScsICcjRTBFMEUwJylcbiAgICBhZGRDb2xvclJ1bGUoJy50YXNrJywgJyM0MjQyNDInLCAnIzIxMjEyMScsICcuZGFyayAnKVxufVxuXG4vLyBUaGUgZnVuY3Rpb24gdGhlbiBuZWVkcyB0byBiZSBjYWxsZWQuXG51cGRhdGVDb2xvcnMoKVxuXG4vLyBUaGUgZWxlbWVudHMgdGhhdCBjb250cm9sIHRoZSBzZXR0aW5ncyBhbHNvIG5lZWQgZXZlbnQgbGlzdGVuZXJzXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc2V0dGluZ3NDb250cm9sJykuZm9yRWFjaCgoZTogSFRNTElucHV0RWxlbWVudCkgPT4ge1xuICAgIGlmIChlLnR5cGUgPT09ICdjaGVja2JveCcpIHtcbiAgICAgICAgZS5jaGVja2VkID0gZ2V0U2V0dGluZyhlLm5hbWUpXG4gICAgfSBlbHNlIHtcbiAgICAgICAgZS52YWx1ZSA9IGdldFNldHRpbmcoZS5uYW1lKVxuICAgIH1cbiAgICBlLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChldnQpID0+IHtcbiAgICAgICAgaWYgKGUudHlwZSA9PT0gJ2NoZWNrYm94Jykge1xuICAgICAgICAgICAgc2V0U2V0dGluZyhlLm5hbWUsIGUuY2hlY2tlZClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNldFNldHRpbmcoZS5uYW1lLCBlLnZhbHVlKVxuICAgICAgICB9XG4gICAgICAgIHN3aXRjaCAoZS5uYW1lKSB7XG4gICAgICAgICAgICBjYXNlICdyZWZyZXNoUmF0ZSc6IHJldHVybiBpbnRlcnZhbFJlZnJlc2goKVxuICAgICAgICAgICAgY2FzZSAnZWFybHlUZXN0JzogcmV0dXJuIGRpc3BsYXkoKVxuICAgICAgICAgICAgY2FzZSAnYXNzaWdubWVudFNwYW4nOiByZXR1cm4gZGlzcGxheSgpXG4gICAgICAgICAgICBjYXNlICdwcm9qZWN0c0luVGVzdFBhbmUnOiByZXR1cm4gZGlzcGxheSgpXG4gICAgICAgICAgICBjYXNlICdoaWRlQXNzaWdubWVudHMnOiByZXR1cm4gZGlzcGxheSgpXG4gICAgICAgICAgICBjYXNlICdob2xpZGF5VGhlbWVzJzogcmV0dXJuIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnRvZ2dsZSgnaG9saWRheVRoZW1lcycsIGUuY2hlY2tlZClcbiAgICAgICAgICAgIGNhc2UgJ3NlcFRhc2tDbGFzcyc6IGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnRvZ2dsZSgnc2VwVGFza0NsYXNzJywgZS5jaGVja2VkKTsgcmV0dXJuIGRpc3BsYXkoKVxuICAgICAgICAgICAgY2FzZSAnc2VwVGFza3MnOiByZXR1cm4gZWxlbUJ5SWQoJ3NlcFRhc2tzUmVmcmVzaCcpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXG4gICAgICAgIH1cbiAgICB9KVxufSlcblxuLy8gVGhpcyBhbHNvIG5lZWRzIHRvIGJlIGRvbmUgZm9yIHJhZGlvIGJ1dHRvbnNcbmNvbnN0IGNvbG9yVHlwZSA9XG4gICAgXyQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgaW5wdXRbbmFtZT1cXFwiY29sb3JUeXBlXFxcIl1bdmFsdWU9XFxcIiR7c2V0dGluZ3MuY29sb3JUeXBlfVxcXCJdYCkpIGFzIEhUTUxJbnB1dEVsZW1lbnRcbmNvbG9yVHlwZS5jaGVja2VkID0gdHJ1ZVxuQXJyYXkuZnJvbShkb2N1bWVudC5nZXRFbGVtZW50c0J5TmFtZSgnY29sb3JUeXBlJykpLmZvckVhY2goKGMpID0+IHtcbiAgYy5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZXZ0KSA9PiB7XG4gICAgY29uc3QgdiA9IChfJChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdpbnB1dFtuYW1lPVwiY29sb3JUeXBlXCJdOmNoZWNrZWQnKSkgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWVcbiAgICBpZiAodiAhPT0gJ2Fzc2lnbm1lbnQnICYmIHYgIT09ICdjbGFzcycpIHJldHVyblxuICAgIHNldHRpbmdzLmNvbG9yVHlwZSA9IHZcbiAgICBpZiAodiA9PT0gJ2NsYXNzJykge1xuICAgICAgZWxlbUJ5SWQoJ2Fzc2lnbm1lbnRDb2xvcnMnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXG4gICAgICBlbGVtQnlJZCgnY2xhc3NDb2xvcnMnKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xuICAgIH0gZWxzZSB7XG4gICAgICBlbGVtQnlJZCgnYXNzaWdubWVudENvbG9ycycpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXG4gICAgICBlbGVtQnlJZCgnY2xhc3NDb2xvcnMnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXG4gICAgfVxuICAgIHJldHVybiB1cGRhdGVDb2xvcnMoKVxuICB9KVxufSlcblxuLy8gVGhlIHNhbWUgZ29lcyBmb3IgdGV4dGFyZWFzLlxuZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgndGV4dGFyZWEnKS5mb3JFYWNoKChlKSA9PiB7XG4gIGlmICgoZS5uYW1lICE9PSAnYXRoZW5hRGF0YVJhdycpICYmIChsb2NhbFN0b3JhZ2VbZS5uYW1lXSAhPSBudWxsKSkge1xuICAgIGUudmFsdWUgPSBsb2NhbFN0b3JhZ2VbZS5uYW1lXVxuICB9XG4gIGUuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoZXZ0KSA9PiB7XG4gICAgbG9jYWxTdG9yYWdlW2UubmFtZV0gPSBlLnZhbHVlXG4gICAgaWYgKGUubmFtZSA9PT0gJ2F0aGVuYURhdGFSYXcnKSB7XG4gICAgICB1cGRhdGVBdGhlbmFEYXRhKGUudmFsdWUpXG4gICAgfVxuICB9KVxufSlcblxuLy8gPGEgbmFtZT1cInN0YXJ0aW5nXCIvPlxuLy8gU3RhcnRpbmcgZXZlcnl0aGluZ1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy9cbi8vIEZpbmFsbHkhIFdlIGFyZSAoYWxtb3N0KSBkb25lIVxuLy9cbi8vIEJlZm9yZSBnZXR0aW5nIHRvIGFueXRoaW5nLCBsZXQncyBwcmludCBvdXQgYSB3ZWxjb21pbmcgbWVzc2FnZSB0byB0aGUgY29uc29sZSFcbmNvbnNvbGUubG9nKCclY0NoZWNrIFBDUicsICdjb2xvcjogIzAwNDAwMDsgZm9udC1zaXplOiAzZW0nKVxuY29uc29sZS5sb2coYCVjVmVyc2lvbiAke1ZFUlNJT059IChDaGVjayBiZWxvdyBmb3IgY3VycmVudCB2ZXJzaW9uKWAsICdmb250LXNpemU6IDEuMWVtJylcbmNvbnNvbGUubG9nKGBXZWxjb21lIHRvIHRoZSBkZXZlbG9wZXIgY29uc29sZSBmb3IgeW91ciBicm93c2VyISBCZXNpZGVzIGxvb2tpbmcgYXQgdGhlIHNvdXJjZSBjb2RlLCBcXFxueW91IGNhbiBhbHNvIHBsYXkgYXJvdW5kIHdpdGggQ2hlY2sgUENSIGJ5IGV4ZWN1dGluZyB0aGUgbGluZXMgYmVsb3c6XG4lY1xcdGZldGNoKHRydWUpICAgICAgICAgICAgICAgJWMvLyBSZWxvYWRzIGFsbCBvZiB5b3VyIGFzc2lnbm1lbnRzICh0aGUgdHJ1ZSBpcyBmb3IgZm9yY2luZyBhIHJlbG9hZCBpZiBvbmUgXFxcbmhhcyBhbHJlYWR5IGJlZW4gdHJpZ2dlcmVkIGluIHRoZSBsYXN0IG1pbnV0ZSlcbiVjXFx0ZGF0YSAgICAgICAgICAgICAgICAgICAgICAlYy8vIERpc3BsYXlzIHRoZSBvYmplY3QgdGhhdCBjb250YWlucyB0aGUgZGF0YSBwYXJzZWQgZnJvbSBQQ1IncyBpbnRlcmZhY2VcbiVjXFx0YWN0aXZpdHkgICAgICAgICAgICAgICAgICAlYy8vIFRoZSBkYXRhIGZvciB0aGUgYXNzaWdubWVudHMgdGhhdCBzaG93IHVwIGluIHRoZSBhY3Rpdml0eSBwYW5lXG4lY1xcdGV4dHJhICAgICAgICAgICAgICAgICAgICAgJWMvLyBBbGwgb2YgdGhlIHRhc2tzIHlvdSd2ZSBjcmVhdGVkIGJ5IGNsaWNraW5nIHRoZSArIGJ1dHRvblxuJWNcXHRhdGhlbmFEYXRhICAgICAgICAgICAgICAgICVjLy8gVGhlIGRhdGEgZmV0Y2hlZCBmcm9tIEF0aGVuYSAoaWYgeW91J3ZlIHBhc3RlZCB0aGUgcmF3IGRhdGEgaW50byBzZXR0aW5ncylcbiVjXFx0c25hY2tiYXIoXCJIZWxsbyBXb3JsZCFcIikgICVjLy8gQ3JlYXRlcyBhIHNuYWNrYmFyIHNob3dpbmcgdGhlIG1lc3NhZ2UgXCJIZWxsbyBXb3JsZCFcIlxuJWNcXHRkaXNwbGF5RXJyb3IobmV3IEVycm9yKCkpICVjLy8gRGlzcGxheXMgdGhlIHN0YWNrIHRyYWNlIGZvciBhIHJhbmRvbSBlcnJvciAoSnVzdCBkb24ndCBzdWJtaXQgaXQhKVxuJWNcXHRjbG9zZUVycm9yKCkgICAgICAgICAgICAgICVjLy8gQ2xvc2VzIHRoYXQgZGlhbG9nYCxcbiAgICAgICAgICAgICAgIC4uLigoW10gYXMgc3RyaW5nW10pLmNvbmNhdCguLi5BcnJheS5mcm9tKG5ldyBBcnJheSg4KSwgKCkgPT4gWydjb2xvcjogaW5pdGlhbCcsICdjb2xvcjogZ3JleSddKSkpKVxuY29uc29sZS5sb2coJycpXG5cbi8vIFRoZSBcImxhc3QgdXBkYXRlZFwiIHRleHQgaXMgc2V0IHRvIHRoZSBjb3JyZWN0IGRhdGUuXG5jb25zdCB0cmllZExhc3RVcGRhdGUgPSBsb2NhbFN0b3JhZ2VSZWFkKCdsYXN0VXBkYXRlJylcbmVsZW1CeUlkKCdsYXN0VXBkYXRlJykuaW5uZXJIVE1MID0gdHJpZWRMYXN0VXBkYXRlID8gZm9ybWF0VXBkYXRlKHRyaWVkTGFzdFVwZGF0ZSkgOiAnTmV2ZXInXG5cbmlmIChsb2NhbFN0b3JhZ2VSZWFkKCdkYXRhJykgIT0gbnVsbCkge1xuICAgIC8vIE5vdyBjaGVjayBpZiB0aGVyZSdzIGFjdGl2aXR5XG4gICAgcmVjZW50QWN0aXZpdHkoKS5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgIGFkZEFjdGl2aXR5KGl0ZW1bMF0sIGl0ZW1bMV0sIG5ldyBEYXRlKGl0ZW1bMl0pLCBmYWxzZSwgaXRlbVszXSlcbiAgICB9KVxuXG4gICAgZGlzcGxheSgpXG59XG5cbmZldGNoKClcblxuLy8gPGEgbmFtZT1cImV2ZW50c1wiLz5cbi8vIEV2ZW50c1xuLy8gLS0tLS0tXG4vL1xuLy8gVGhlIGRvY3VtZW50IGJvZHkgbmVlZHMgdG8gYmUgZW5hYmxlZCBmb3IgaGFtbWVyLmpzIGV2ZW50cy5cbmRlbGV0ZSBIYW1tZXIuZGVmYXVsdHMuY3NzUHJvcHMudXNlclNlbGVjdFxuY29uc3QgaGFtbWVydGltZSA9IG5ldyBIYW1tZXIuTWFuYWdlcihkb2N1bWVudC5ib2R5LCB7XG4gIHJlY29nbml6ZXJzOiBbXG4gICAgW0hhbW1lci5QYW4sIHtkaXJlY3Rpb246IEhhbW1lci5ESVJFQ1RJT05fSE9SSVpPTlRBTH1dXG4gIF1cbn0pXG5cbi8vIEZvciB0b3VjaCBkaXNwbGF5cywgaGFtbWVyLmpzIGlzIHVzZWQgdG8gbWFrZSB0aGUgc2lkZSBtZW51IGFwcGVhci9kaXNhcHBlYXIuIFRoZSBjb2RlIGJlbG93IGlzXG4vLyBhZGFwdGVkIGZyb20gTWF0ZXJpYWxpemUncyBpbXBsZW1lbnRhdGlvbi5cbmxldCBtZW51T3V0ID0gZmFsc2VcbmNvbnN0IGRyYWdUYXJnZXQgPSBuZXcgSGFtbWVyKGVsZW1CeUlkKCdkcmFnVGFyZ2V0JykpXG5kcmFnVGFyZ2V0Lm9uKCdwYW4nLCAoZSkgPT4ge1xuICBpZiAoZS5wb2ludGVyVHlwZSA9PT0gJ3RvdWNoJykge1xuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIGxldCB7IHggfSA9IGUuY2VudGVyXG4gICAgY29uc3QgeyB5IH0gPSBlLmNlbnRlclxuXG4gICAgY29uc3Qgc0JrZyA9IGVsZW1CeUlkKCdzaWRlQmFja2dyb3VuZCcpXG4gICAgc0JrZy5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xuICAgIHNCa2cuc3R5bGUub3BhY2l0eSA9ICcwJ1xuICAgIGVsZW1CeUlkKCdzaWRlTmF2JykuY2xhc3NMaXN0LmFkZCgnbWFudWFsJylcblxuICAgIC8vIEtlZXAgd2l0aGluIGJvdW5kYXJpZXNcbiAgICBpZiAoeCA+IDI0MCkge1xuICAgICAgeCA9IDI0MFxuICAgIH0gZWxzZSBpZiAoeCA8IDApIHtcbiAgICAgIHggPSAwXG5cbiAgICAgIC8vIExlZnQgRGlyZWN0aW9uXG4gICAgICBpZiAoeCA8IDEyMCkge1xuICAgICAgICBtZW51T3V0ID0gZmFsc2VcbiAgICAgIC8vIFJpZ2h0IERpcmVjdGlvblxuICAgICAgfSBlbHNlIGlmICh4ID49IDEyMCkge1xuICAgICAgICBtZW51T3V0ID0gdHJ1ZVxuICAgICAgfVxuICAgIH1cblxuICAgIGVsZW1CeUlkKCdzaWRlTmF2Jykuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVgoJHt4IC0gMjQwfXB4KWBcbiAgICBjb25zdCBvdmVybGF5UGVyY2VudCA9IE1hdGgubWluKHggLyA0ODAsIDAuNSlcbiAgICByZXR1cm4gc0JrZy5zdHlsZS5vcGFjaXR5ID0gU3RyaW5nKG92ZXJsYXlQZXJjZW50KVxuICB9XG59KVxuXG5kcmFnVGFyZ2V0Lm9uKCdwYW5lbmQnLCAoZSkgPT4ge1xuICBpZiAoZS5wb2ludGVyVHlwZSA9PT0gJ3RvdWNoJykge1xuICAgIGxldCBzaWRlTmF2XG4gICAgY29uc3QgeyB2ZWxvY2l0eVggfSA9IGVcbiAgICAvLyBJZiB2ZWxvY2l0eVggPD0gMC4zIHRoZW4gdGhlIHVzZXIgaXMgZmxpbmdpbmcgdGhlIG1lbnUgY2xvc2VkIHNvIGlnbm9yZSBtZW51T3V0XG4gICAgaWYgKChtZW51T3V0ICYmICh2ZWxvY2l0eVggPD0gMC4zKSkgfHwgKHZlbG9jaXR5WCA8IC0wLjUpKSB7XG4gICAgICBzaWRlTmF2ID0gZWxlbUJ5SWQoJ3NpZGVOYXYnKVxuICAgICAgc2lkZU5hdi5jbGFzc0xpc3QucmVtb3ZlKCdtYW51YWwnKVxuICAgICAgc2lkZU5hdi5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxuICAgICAgc2lkZU5hdi5zdHlsZS50cmFuc2Zvcm0gPSAnJ1xuICAgICAgZWxlbUJ5SWQoJ2RyYWdUYXJnZXQnKS5zdHlsZS53aWR0aCA9ICcxMDAlJ1xuXG4gICAgfSBlbHNlIGlmICghbWVudU91dCB8fCAodmVsb2NpdHlYID4gMC4zKSkge1xuICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICdhdXRvJ1xuICAgICAgc2lkZU5hdiA9IGVsZW1CeUlkKCdzaWRlTmF2JylcbiAgICAgIHNpZGVOYXYuY2xhc3NMaXN0LnJlbW92ZSgnbWFudWFsJylcbiAgICAgIHNpZGVOYXYuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcbiAgICAgIHNpZGVOYXYuc3R5bGUudHJhbnNmb3JtID0gJydcbiAgICAgIGVsZW1CeUlkKCdzaWRlQmFja2dyb3VuZCcpLnN0eWxlLm9wYWNpdHkgPSAnJ1xuICAgICAgZWxlbUJ5SWQoJ2RyYWdUYXJnZXQnKS5zdHlsZS53aWR0aCA9ICcxMHB4J1xuICAgICAgc2V0VGltZW91dCgoKSA9PiBlbGVtQnlJZCgnc2lkZUJhY2tncm91bmQnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXG4gICAgICAsIDM1MClcbiAgICB9XG4gIH1cbn0pXG5cbmRyYWdUYXJnZXQub24oJ3RhcCcsIChlKSA9PiB7XG4gICAgZWxlbUJ5SWQoJ3NpZGVCYWNrZ3JvdW5kJykuY2xpY2soKVxuICAgIGUucHJldmVudERlZmF1bHQoKVxufSlcblxuY29uc3QgZHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZHJhZ1RhcmdldCcpXG5cbi8vIFRoZSBhY3Rpdml0eSBmaWx0ZXIgYnV0dG9uIGFsc28gbmVlZHMgYW4gZXZlbnQgbGlzdGVuZXIuXG5yaXBwbGUoZWxlbUJ5SWQoJ2ZpbHRlckFjdGl2aXR5JykpXG5lbGVtQnlJZCgnZmlsdGVyQWN0aXZpdHknKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgZWxlbUJ5SWQoJ2luZm9BY3Rpdml0eScpLmNsYXNzTGlzdC50b2dnbGUoJ2ZpbHRlcicpXG59KVxuXG4vLyBBdCB0aGUgc3RhcnQsIGl0IG5lZWRzIHRvIGJlIGNvcnJlY3RseSBwb3B1bGF0ZWRcbmNvbnN0IGFjdGl2aXR5VHlwZXMgPSBzZXR0aW5ncy5zaG93bkFjdGl2aXR5XG5cbmZ1bmN0aW9uIHVwZGF0ZVNlbGVjdE51bSgpOiBzdHJpbmcge1xuICAgIGNvbnN0IGMgPSAoYm9vbDogYm9vbGVhbikgID0+IGJvb2wgPyAxIDogMFxuICAgIGNvbnN0IGNvdW50ID0gU3RyaW5nKGMoYWN0aXZpdHlUeXBlcy5hZGQpICsgYyhhY3Rpdml0eVR5cGVzLmVkaXQpICsgYyhhY3Rpdml0eVR5cGVzLmRlbGV0ZSkpXG4gICAgcmV0dXJuIGVsZW1CeUlkKCdzZWxlY3ROdW0nKS5pbm5lckhUTUwgPSBjb3VudFxufVxudXBkYXRlU2VsZWN0TnVtKClcbk9iamVjdC5lbnRyaWVzKGFjdGl2aXR5VHlwZXMpLmZvckVhY2goKFt0eXBlLCBlbmFibGVkXSkgPT4ge1xuICBpZiAodHlwZSAhPT0gJ2FkZCcgJiYgdHlwZSAhPT0gJ2VkaXQnICYmIHR5cGUgIT09ICdkZWxldGUnKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGFjdGl2aXR5IHR5cGUgJHt0eXBlfWApXG4gIH1cblxuICBjb25zdCBzZWxlY3RFbCA9IGVsZW1CeUlkKHR5cGUgKyAnU2VsZWN0JykgYXMgSFRNTElucHV0RWxlbWVudFxuICBzZWxlY3RFbC5jaGVja2VkID0gZW5hYmxlZFxuICBpZiAoZW5hYmxlZCkgeyBlbGVtQnlJZCgnaW5mb0FjdGl2aXR5JykuY2xhc3NMaXN0LmFkZCh0eXBlKSB9XG4gIHNlbGVjdEVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChldnQpID0+IHtcbiAgICBhY3Rpdml0eVR5cGVzW3R5cGVdID0gc2VsZWN0RWwuY2hlY2tlZFxuICAgIGVsZW1CeUlkKCdpbmZvQWN0aXZpdHknKS5zZXRBdHRyaWJ1dGUoJ2RhdGEtZmlsdGVyZWQnLCB1cGRhdGVTZWxlY3ROdW0oKSlcbiAgICBlbGVtQnlJZCgnaW5mb0FjdGl2aXR5JykuY2xhc3NMaXN0LnRvZ2dsZSh0eXBlKVxuICAgIHNldHRpbmdzLnNob3duQWN0aXZpdHkgPSBhY3Rpdml0eVR5cGVzXG4gIH0pXG59KVxuXG4vLyBUaGUgc2hvdyBjb21wbGV0ZWQgdGFza3MgY2hlY2tib3ggaXMgc2V0IGNvcnJlY3RseSBhbmQgaXMgYXNzaWduZWQgYW4gZXZlbnQgbGlzdGVuZXIuXG5jb25zdCBzaG93RG9uZVRhc2tzRWwgPSBlbGVtQnlJZCgnc2hvd0RvbmVUYXNrcycpIGFzIEhUTUxJbnB1dEVsZW1lbnRcbmlmIChzZXR0aW5ncy5zaG93RG9uZVRhc2tzKSB7XG4gIHNob3dEb25lVGFza3NFbC5jaGVja2VkID0gdHJ1ZVxuICBlbGVtQnlJZCgnaW5mb1Rhc2tzSW5uZXInKS5jbGFzc0xpc3QuYWRkKCdzaG93RG9uZVRhc2tzJylcbn1cbnNob3dEb25lVGFza3NFbC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoKSA9PiB7XG4gIHNldHRpbmdzLnNob3dEb25lVGFza3MgPSBzaG93RG9uZVRhc2tzRWwuY2hlY2tlZFxuICBlbGVtQnlJZCgnaW5mb1Rhc2tzSW5uZXInKS5jbGFzc0xpc3QudG9nZ2xlKCdzaG93RG9uZVRhc2tzJywgc2V0dGluZ3Muc2hvd0RvbmVUYXNrcylcbn0pXG5cbi8vIDxhIG5hbWU9XCJ1cGRhdGVzXCIvPlxuLy8gVXBkYXRlcyBhbmQgTmV3c1xuLy8gLS0tLS0tLS0tLS0tLS0tLVxuLy9cblxuaWYgKGxvY2F0aW9uLnByb3RvY29sID09PSAnY2hyb21lLWV4dGVuc2lvbjonKSB7IGNoZWNrQ29tbWl0KCkgfVxuXG4vLyBUaGlzIHVwZGF0ZSBkaWFsb2cgYWxzbyBuZWVkcyB0byBiZSBjbG9zZWQgd2hlbiB0aGUgYnV0dG9ucyBhcmUgY2xpY2tlZC5cbmVsZW1CeUlkKCd1cGRhdGVEZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICBlbGVtQnlJZCgndXBkYXRlJykuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcbiAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgZWxlbUJ5SWQoJ3VwZGF0ZUJhY2tncm91bmQnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXG4gIH0sIDM1MClcbn0pXG5cbi8vIEZvciBuZXdzLCB0aGUgbGF0ZXN0IG5ld3MgaXMgZmV0Y2hlZCBmcm9tIGEgR2l0SHViIGdpc3QuXG5mZXRjaE5ld3MoKVxuXG4vLyBUaGUgbmV3cyBkaWFsb2cgdGhlbiBuZWVkcyB0byBiZSBjbG9zZWQgd2hlbiBPSyBvciB0aGUgYmFja2dyb3VuZCBpcyBjbGlja2VkLlxuZnVuY3Rpb24gY2xvc2VOZXdzKCk6IHZvaWQge1xuICBlbGVtQnlJZCgnbmV3cycpLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgIGVsZW1CeUlkKCduZXdzQmFja2dyb3VuZCcpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcbiAgfSwgMzUwKVxufVxuXG5lbGVtQnlJZCgnbmV3c09rJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbG9zZU5ld3MpXG5lbGVtQnlJZCgnbmV3c0JhY2tncm91bmQnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsb3NlTmV3cylcblxuLy8gSXQgYWxzbyBuZWVkcyB0byBiZSBvcGVuZWQgd2hlbiB0aGUgbmV3cyBidXR0b24gaXMgY2xpY2tlZC5cbmVsZW1CeUlkKCduZXdzQicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICBlbGVtQnlJZCgnc2lkZUJhY2tncm91bmQnKS5jbGljaygpXG4gIGNvbnN0IGRpc3BsYXlOZXdzID0gKCkgPT4ge1xuICAgIGVsZW1CeUlkKCduZXdzQmFja2dyb3VuZCcpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXG4gICAgcmV0dXJuIGVsZW1CeUlkKCduZXdzJykuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcbiAgfVxuXG4gIGlmIChlbGVtQnlJZCgnbmV3c0NvbnRlbnQnKS5jaGlsZE5vZGVzLmxlbmd0aCA9PT0gMCkge1xuICAgIGdldE5ld3MoZGlzcGxheU5ld3MpXG4gIH0gZWxzZSB7XG4gICAgZGlzcGxheU5ld3MoKVxuICB9XG59KVxuXG4vLyBUaGUgc2FtZSBnb2VzIGZvciB0aGUgZXJyb3IgZGlhbG9nLlxuZnVuY3Rpb24gY2xvc2VFcnJvcigpOiB2b2lkIHtcbiAgZWxlbUJ5SWQoJ2Vycm9yJykuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcbiAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgZWxlbUJ5SWQoJ2Vycm9yQmFja2dyb3VuZCcpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcbiAgfSwgMzUwKVxufVxuXG5lbGVtQnlJZCgnZXJyb3JObycpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xvc2VFcnJvcilcbmVsZW1CeUlkKCdlcnJvckJhY2tncm91bmQnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsb3NlRXJyb3IpXG5cbi8vIDxhIG5hbWU9XCJuZXdcIi8+XG4vLyBBZGRpbmcgbmV3IGFzc2lnbm1lbnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vL1xuLy8gVGhlIGV2ZW50IGxpc3RlbmVycyBmb3IgdGhlIG5ldyBidXR0b25zIGFyZSBhZGRlZC5cbnJpcHBsZShlbGVtQnlJZCgnbmV3JykpXG5yaXBwbGUoZWxlbUJ5SWQoJ25ld1Rhc2snKSlcbmNvbnN0IG9uTmV3VGFzayA9ICgpID0+IHtcbiAgdXBkYXRlTmV3VGlwcygoZWxlbUJ5SWQoJ25ld1RleHQnKSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSA9ICcnKVxuICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbidcbiAgZWxlbUJ5SWQoJ25ld0JhY2tncm91bmQnKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xuICBlbGVtQnlJZCgnbmV3RGlhbG9nJykuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcbiAgZWxlbUJ5SWQoJ25ld1RleHQnKS5mb2N1cygpXG59XG5lbGVtQnlJZCgnbmV3JykuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG9uTmV3VGFzaylcbmVsZW1CeUlkKCduZXdUYXNrJykuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG9uTmV3VGFzaylcblxuLy8gQSBmdW5jdGlvbiB0byBjbG9zZSB0aGUgZGlhbG9nIGlzIHRoZW4gZGVmaW5lZC5cbmZ1bmN0aW9uIGNsb3NlTmV3KCk6IHZvaWQge1xuICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2F1dG8nXG4gIGVsZW1CeUlkKCduZXdEaWFsb2cnKS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICBlbGVtQnlJZCgnbmV3QmFja2dyb3VuZCcpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcbiAgfSwgMzUwKVxufVxuXG4vLyBUaGlzIGZ1bmN0aW9uIGlzIHNldCB0byBiZSBjYWxsZWQgY2FsbGVkIHdoZW4gdGhlIEVTQyBrZXkgaXMgY2FsbGVkIGluc2lkZSBvZiB0aGUgZGlhbG9nLlxuZWxlbUJ5SWQoJ25ld1RleHQnKS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGV2dCkgPT4ge1xuICBpZiAoZXZ0LndoaWNoID09PSAyNykgeyAvLyBFc2NhcGUga2V5IHByZXNzZWRcbiAgICBjbG9zZU5ldygpXG4gIH1cbn0pXG5cbi8vIEFuIGV2ZW50IGxpc3RlbmVyIHRvIGNhbGwgdGhlIGZ1bmN0aW9uIGlzIGFsc28gYWRkZWQgdG8gdGhlIFggYnV0dG9uXG5lbGVtQnlJZCgnbmV3Q2FuY2VsJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbG9zZU5ldylcblxuLy8gV2hlbiB0aGUgZW50ZXIga2V5IGlzIHByZXNzZWQgb3IgdGhlIHN1Ym1pdCBidXR0b24gaXMgY2xpY2tlZCwgdGhlIG5ldyBhc3NpZ25tZW50IGlzIGFkZGVkLlxuZWxlbUJ5SWQoJ25ld0RpYWxvZycpLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIChldnQpID0+IHtcbiAgZXZ0LnByZXZlbnREZWZhdWx0KClcbiAgY29uc3QgaXRleHQgPSAoZWxlbUJ5SWQoJ25ld1RleHQnKSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZVxuICBjb25zdCB7IHRleHQsIGNscywgZHVlLCBzdCB9ID0gcGFyc2VDdXN0b21UYXNrKGl0ZXh0KVxuICBsZXQgZW5kOiAnRm9yZXZlcid8bnVtYmVyID0gJ0ZvcmV2ZXInXG5cbiAgY29uc3Qgc3RhcnQgPSAoc3QgIT0gbnVsbCkgPyB0b0RhdGVOdW0oY2hyb25vLnBhcnNlRGF0ZShzdCkpIDogdG9kYXkoKVxuICBpZiAoZHVlICE9IG51bGwpIHtcbiAgICBlbmQgPSB0b0RhdGVOdW0oY2hyb25vLnBhcnNlRGF0ZShkdWUpKVxuICAgIGlmIChlbmQgPCBzdGFydCkgeyAvLyBBc3NpZ25tZW50IGVuZHMgYmVmb3JlIGl0IGlzIGFzc2lnbmVkXG4gICAgICBlbmQgKz0gTWF0aC5jZWlsKChzdGFydCAtIGVuZCkgLyA3KSAqIDdcbiAgICB9XG4gIH1cbiAgYWRkVG9FeHRyYSh7XG4gICAgYm9keTogdGV4dC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHRleHQuc3Vic3RyKDEpLFxuICAgIGRvbmU6IGZhbHNlLFxuICAgIHN0YXJ0LFxuICAgIGNsYXNzOiAoY2xzICE9IG51bGwpID8gY2xzLnRvTG93ZXJDYXNlKCkudHJpbSgpIDogbnVsbCxcbiAgICBlbmRcbiAgfSlcbiAgc2F2ZUV4dHJhKClcbiAgY2xvc2VOZXcoKVxuICBkaXNwbGF5KGZhbHNlKVxufSlcblxudXBkYXRlTmV3VGlwcygnJywgZmFsc2UpXG5lbGVtQnlJZCgnbmV3VGV4dCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKCkgPT4ge1xuICByZXR1cm4gdXBkYXRlTmV3VGlwcygoZWxlbUJ5SWQoJ25ld1RleHQnKSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSlcbn0pXG5cbi8vIFRoZSBjb2RlIGJlbG93IHJlZ2lzdGVycyBhIHNlcnZpY2Ugd29ya2VyIHRoYXQgY2FjaGVzIHRoZSBwYWdlIHNvIGl0IGNhbiBiZSB2aWV3ZWQgb2ZmbGluZS5cbmlmICgnc2VydmljZVdvcmtlcicgaW4gbmF2aWdhdG9yKSB7XG4gIG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLnJlZ2lzdGVyKCcvc2VydmljZS13b3JrZXIuanMnKVxuICAgIC50aGVuKChyZWdpc3RyYXRpb24pID0+XG4gICAgICAvLyBSZWdpc3RyYXRpb24gd2FzIHN1Y2Nlc3NmdWxcbiAgICAgIGNvbnNvbGUubG9nKCdTZXJ2aWNlV29ya2VyIHJlZ2lzdHJhdGlvbiBzdWNjZXNzZnVsIHdpdGggc2NvcGUnLCByZWdpc3RyYXRpb24uc2NvcGUpKS5jYXRjaCgoZXJyKSA9PlxuICAgICAgLy8gcmVnaXN0cmF0aW9uIGZhaWxlZCA6KFxuICAgICAgY29uc29sZS5sb2coJ1NlcnZpY2VXb3JrZXIgcmVnaXN0cmF0aW9uIGZhaWxlZDogJywgZXJyKVxuICApXG59XG5cbi8vIElmIHRoZSBzZXJ2aWNlIHdvcmtlciBkZXRlY3RzIHRoYXQgdGhlIHdlYiBhcHAgaGFzIGJlZW4gdXBkYXRlZCwgdGhlIGNvbW1pdCBpcyBmZXRjaGVkIGZyb20gR2l0SHViLlxubmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIChldmVudCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKCdHZXR0aW5nIGNvbW1pdCBiZWNhdXNlIG9mIHNlcnZpY2V3b3JrZXInKVxuICAgIGlmIChldmVudC5kYXRhLmdldENvbW1pdCkgeyByZXR1cm4gY2hlY2tDb21taXQoKSB9XG59KVxuIiwiaW1wb3J0IHsgY2xhc3NCeUlkLCBnZXREYXRhLCBJQXNzaWdubWVudCB9IGZyb20gJy4uL3BjcidcbmltcG9ydCB7IEFjdGl2aXR5VHlwZSB9IGZyb20gJy4uL3BsdWdpbnMvYWN0aXZpdHknXG5pbXBvcnQgeyBhc3NpZ25tZW50SW5Eb25lIH0gZnJvbSAnLi4vcGx1Z2lucy9kb25lJ1xuaW1wb3J0IHsgXyQsIGRhdGVTdHJpbmcsIGVsZW1CeUlkLCBlbGVtZW50LCBzbW9vdGhTY3JvbGwgfSBmcm9tICcuLi91dGlsJ1xuaW1wb3J0IHsgc2VwYXJhdGUgfSBmcm9tICcuL2Fzc2lnbm1lbnQnXG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRBY3Rpdml0eUVsZW1lbnQoZWw6IEhUTUxFbGVtZW50KTogdm9pZCB7XG4gICAgY29uc3QgaW5zZXJ0VG8gPSBlbGVtQnlJZCgnaW5mb0FjdGl2aXR5JylcbiAgICBpbnNlcnRUby5pbnNlcnRCZWZvcmUoZWwsIGluc2VydFRvLnF1ZXJ5U2VsZWN0b3IoJy5hY3Rpdml0eScpKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQWN0aXZpdHkodHlwZTogQWN0aXZpdHlUeXBlLCBhc3NpZ25tZW50OiBJQXNzaWdubWVudCwgZGF0ZTogRGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU/OiBzdHJpbmcgKTogSFRNTEVsZW1lbnQge1xuICAgIGNvbnN0IGNuYW1lID0gY2xhc3NOYW1lIHx8IGNsYXNzQnlJZChhc3NpZ25tZW50LmNsYXNzKVxuXG4gICAgY29uc3QgdGUgPSBlbGVtZW50KCdkaXYnLCBbJ2FjdGl2aXR5JywgJ2Fzc2lnbm1lbnRJdGVtJywgYXNzaWdubWVudC5iYXNlVHlwZSwgdHlwZV0sIGBcbiAgICAgICAgPGkgY2xhc3M9J21hdGVyaWFsLWljb25zJz4ke3R5cGV9PC9pPlxuICAgICAgICA8c3BhbiBjbGFzcz0ndGl0bGUnPiR7YXNzaWdubWVudC50aXRsZX08L3NwYW4+XG4gICAgICAgIDxzbWFsbD4ke3NlcGFyYXRlKGNuYW1lKVsyXX08L3NtYWxsPlxuICAgICAgICA8ZGl2IGNsYXNzPSdyYW5nZSc+JHtkYXRlU3RyaW5nKGRhdGUpfTwvZGl2PmAsIGBhY3Rpdml0eSR7YXNzaWdubWVudC5pZH1gKVxuICAgIHRlLnNldEF0dHJpYnV0ZSgnZGF0YS1jbGFzcycsIGNuYW1lKVxuICAgIGNvbnN0IHsgaWQgfSA9IGFzc2lnbm1lbnRcbiAgICBpZiAodHlwZSAhPT0gJ2RlbGV0ZScpIHtcbiAgICAgICAgdGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBkb1Njcm9sbGluZyA9IGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBlbCA9IF8kKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYC5hc3NpZ25tZW50W2lkKj1cXFwiJHtpZH1cXFwiXWApKSBhcyBIVE1MRWxlbWVudFxuICAgICAgICAgICAgICAgIGF3YWl0IHNtb290aFNjcm9sbCgoZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wICsgZG9jdW1lbnQuYm9keS5zY3JvbGxUb3ApIC0gMTE2KVxuICAgICAgICAgICAgICAgIGVsLmNsaWNrKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5ib2R5LmdldEF0dHJpYnV0ZSgnZGF0YS12aWV3JykgPT09ICcwJykge1xuICAgICAgICAgICAgcmV0dXJuIGRvU2Nyb2xsaW5nKClcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgKF8kKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNuYXZUYWJzPmxpOmZpcnN0LWNoaWxkJykpIGFzIEhUTUxFbGVtZW50KS5jbGljaygpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZG9TY3JvbGxpbmcsIDUwMClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBpZiAoYXNzaWdubWVudEluRG9uZShhc3NpZ25tZW50LmlkKSkge1xuICAgICAgdGUuY2xhc3NMaXN0LmFkZCgnZG9uZScpXG4gICAgfVxuICAgIHJldHVybiB0ZVxufVxuIiwiaW1wb3J0IHsgZnJvbURhdGVOdW0sIHRvZGF5IH0gZnJvbSAnLi4vZGF0ZXMnXG5pbXBvcnQgeyBkaXNwbGF5LCBnZXRUaW1lQWZ0ZXIsIElTcGxpdEFzc2lnbm1lbnQgfSBmcm9tICcuLi9kaXNwbGF5J1xuaW1wb3J0IHsgZ2V0TGlzdERhdGVPZmZzZXQgfSBmcm9tICcuLi9uYXZpZ2F0aW9uJ1xuaW1wb3J0IHsgZ2V0QXR0YWNobWVudE1pbWVUeXBlLCBJQXBwbGljYXRpb25EYXRhLCBJQXNzaWdubWVudCwgdXJsRm9yQXR0YWNobWVudCB9IGZyb20gJy4uL3BjcidcbmltcG9ydCB7IHJlY2VudEFjdGl2aXR5IH0gZnJvbSAnLi4vcGx1Z2lucy9hY3Rpdml0eSdcbmltcG9ydCB7IGdldEF0aGVuYURhdGEgfSBmcm9tICcuLi9wbHVnaW5zL2F0aGVuYSdcbmltcG9ydCB7IHJlbW92ZUZyb21FeHRyYSwgc2F2ZUV4dHJhIH0gZnJvbSAnLi4vcGx1Z2lucy9jdXN0b21Bc3NpZ25tZW50cydcbmltcG9ydCB7IGFkZFRvRG9uZSwgYXNzaWdubWVudEluRG9uZSwgcmVtb3ZlRnJvbURvbmUsIHNhdmVEb25lIH0gZnJvbSAnLi4vcGx1Z2lucy9kb25lJ1xuaW1wb3J0IHsgbW9kaWZpZWRCb2R5LCByZW1vdmVGcm9tTW9kaWZpZWQsIHNhdmVNb2RpZmllZCwgc2V0TW9kaWZpZWQgfSBmcm9tICcuLi9wbHVnaW5zL21vZGlmaWVkQXNzaWdubWVudHMnXG5pbXBvcnQgeyBzZXR0aW5ncyB9IGZyb20gJy4uL3NldHRpbmdzJ1xuaW1wb3J0IHsgXyQsIGNzc051bWJlciwgZGF0ZVN0cmluZywgZWxlbUJ5SWQsIGVsZW1lbnQsIGZvcmNlTGF5b3V0LCByaXBwbGUgfSBmcm9tICcuLi91dGlsJ1xuaW1wb3J0IHsgcmVzaXplIH0gZnJvbSAnLi9yZXNpemVyJ1xuXG5jb25zdCBtaW1lVHlwZXM6IHsgW21pbWU6IHN0cmluZ106IFtzdHJpbmcsIHN0cmluZ10gfSA9IHtcbiAgICAnYXBwbGljYXRpb24vbXN3b3JkJzogWydXb3JkIERvYycsICdkb2N1bWVudCddLFxuICAgICdhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQud29yZHByb2Nlc3NpbmdtbC5kb2N1bWVudCc6IFsnV29yZCBEb2MnLCAnZG9jdW1lbnQnXSxcbiAgICAnYXBwbGljYXRpb24vdm5kLm1zLXBvd2VycG9pbnQnOiBbJ1BQVCBQcmVzZW50YXRpb24nLCAnc2xpZGVzJ10sXG4gICAgJ2FwcGxpY2F0aW9uL3BkZic6IFsnUERGIEZpbGUnLCAncGRmJ10sXG4gICAgJ3RleHQvcGxhaW4nOiBbJ1RleHQgRG9jJywgJ3BsYWluJ11cbn1cblxuY29uc3QgZG1wID0gbmV3IGRpZmZfbWF0Y2hfcGF0Y2goKSAvLyBGb3IgZGlmZmluZ1xuXG5mdW5jdGlvbiBwb3B1bGF0ZUFkZGVkRGVsZXRlZChkaWZmczogYW55W10sIGVkaXRzOiBIVE1MRWxlbWVudCk6IGJvb2xlYW4ge1xuICAgIGxldCBhZGRlZCA9IDBcbiAgICBsZXQgZGVsZXRlZCA9IDBcbiAgICBkaWZmcy5mb3JFYWNoKChkaWZmKSA9PiB7XG4gICAgICAgIGlmIChkaWZmWzBdID09PSAxKSB7IGFkZGVkKysgfVxuICAgICAgICBpZiAoZGlmZlswXSA9PT0gLTEpIHsgZGVsZXRlZCsrIH1cbiAgICB9KVxuICAgIF8kKGVkaXRzLnF1ZXJ5U2VsZWN0b3IoJy5hZGRpdGlvbnMnKSkuaW5uZXJIVE1MID0gYWRkZWQgIT09IDAgPyBgKyR7YWRkZWR9YCA6ICcnXG4gICAgXyQoZWRpdHMucXVlcnlTZWxlY3RvcignLmRlbGV0aW9ucycpKS5pbm5lckhUTUwgPSBkZWxldGVkICE9PSAwID8gYC0ke2RlbGV0ZWR9YCA6ICcnXG4gICAgZWRpdHMuY2xhc3NMaXN0LmFkZCgnbm90RW1wdHknKVxuICAgIHJldHVybiBhZGRlZCA+IDAgfHwgZGVsZXRlZCA+IDBcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbXB1dGVXZWVrSWQoc3BsaXQ6IElTcGxpdEFzc2lnbm1lbnQpOiBzdHJpbmcge1xuICAgIGNvbnN0IHN0YXJ0U3VuID0gbmV3IERhdGUoc3BsaXQuc3RhcnQuZ2V0VGltZSgpKVxuICAgIHN0YXJ0U3VuLnNldERhdGUoc3RhcnRTdW4uZ2V0RGF0ZSgpIC0gc3RhcnRTdW4uZ2V0RGF5KCkpXG4gICAgcmV0dXJuIGB3ayR7c3RhcnRTdW4uZ2V0TW9udGgoKX0tJHtzdGFydFN1bi5nZXREYXRlKCl9YFxufVxuXG4vLyBUaGlzIGZ1bmN0aW9uIHNlcGFyYXRlcyB0aGUgcGFydHMgb2YgYSBjbGFzcyBuYW1lLlxuZXhwb3J0IGZ1bmN0aW9uIHNlcGFyYXRlKGNsOiBzdHJpbmcpOiBSZWdFeHBNYXRjaEFycmF5IHtcbiAgICBjb25zdCBtID0gY2wubWF0Y2goLygoPzpcXGQqXFxzKyk/KD86KD86aG9uXFx3KnwoPzphZHZcXHcqXFxzKik/Y29yZSlcXHMrKT8pKC4qKS9pKVxuICAgIGlmIChtID09IG51bGwpIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IHNlcGFyYXRlIGNsYXNzIHN0cmluZyAke2NsfWApXG4gICAgcmV0dXJuIG1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2lnbm1lbnRDbGFzcyhhc3NpZ25tZW50OiBJQXNzaWdubWVudCwgZGF0YTogSUFwcGxpY2F0aW9uRGF0YSk6IHN0cmluZyB7XG4gICAgY29uc3QgY2xzID0gKGFzc2lnbm1lbnQuY2xhc3MgIT0gbnVsbCkgPyBkYXRhLmNsYXNzZXNbYXNzaWdubWVudC5jbGFzc10gOiAnVGFzaydcbiAgICBpZiAoY2xzID09IG51bGwpIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGZpbmQgY2xhc3MgJHthc3NpZ25tZW50LmNsYXNzfSBpbiAke2RhdGEuY2xhc3Nlc31gKVxuICAgIHJldHVybiBjbHNcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNlcGFyYXRlZENsYXNzKGFzc2lnbm1lbnQ6IElBc3NpZ25tZW50LCBkYXRhOiBJQXBwbGljYXRpb25EYXRhKTogUmVnRXhwTWF0Y2hBcnJheSB7XG4gICAgcmV0dXJuIHNlcGFyYXRlKGFzc2lnbm1lbnRDbGFzcyhhc3NpZ25tZW50LCBkYXRhKSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUFzc2lnbm1lbnQoc3BsaXQ6IElTcGxpdEFzc2lnbm1lbnQsIGRhdGE6IElBcHBsaWNhdGlvbkRhdGEpOiBIVE1MRWxlbWVudCB7XG4gICAgY29uc3QgeyBhc3NpZ25tZW50LCByZWZlcmVuY2UgfSA9IHNwbGl0XG5cbiAgICAvLyBTZXBhcmF0ZSB0aGUgY2xhc3MgZGVzY3JpcHRpb24gZnJvbSB0aGUgYWN0dWFsIGNsYXNzXG4gICAgY29uc3Qgc2VwYXJhdGVkID0gc2VwYXJhdGVkQ2xhc3MoYXNzaWdubWVudCwgZGF0YSlcblxuICAgIGNvbnN0IHdlZWtJZCA9IGNvbXB1dGVXZWVrSWQoc3BsaXQpXG5cbiAgICBsZXQgc21hbGxUYWcgPSAnc21hbGwnXG4gICAgbGV0IGxpbmsgPSBudWxsXG4gICAgY29uc3QgYXRoZW5hRGF0YSA9IGdldEF0aGVuYURhdGEoKVxuICAgIGlmIChhdGhlbmFEYXRhICYmIGFzc2lnbm1lbnQuY2xhc3MgIT0gbnVsbCAmJiAoYXRoZW5hRGF0YVtkYXRhLmNsYXNzZXNbYXNzaWdubWVudC5jbGFzc11dICE9IG51bGwpKSB7XG4gICAgICAgIGxpbmsgPSBhdGhlbmFEYXRhW2RhdGEuY2xhc3Nlc1thc3NpZ25tZW50LmNsYXNzXV0ubGlua1xuICAgICAgICBzbWFsbFRhZyA9ICdhJ1xuICAgIH1cblxuICAgIGNvbnN0IGUgPSBlbGVtZW50KCdkaXYnLCBbJ2Fzc2lnbm1lbnQnLCBhc3NpZ25tZW50LmJhc2VUeXBlLCAnYW5pbSddLFxuICAgICAgICAgICAgICAgICAgICAgIGA8JHtzbWFsbFRhZ30ke2xpbmsgPyBgIGhyZWY9JyR7bGlua30nIGNsYXNzPSdsaW5rZWQnIHRhcmdldD0nX2JsYW5rJ2AgOiAnJ30+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz0nZXh0cmEnPiR7c2VwYXJhdGVkWzFdfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICR7c2VwYXJhdGVkWzJdfVxuICAgICAgICAgICAgICAgICAgICAgICA8LyR7c21hbGxUYWd9PjxzcGFuIGNsYXNzPSd0aXRsZSc+JHthc3NpZ25tZW50LnRpdGxlfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9J2hpZGRlbicgY2xhc3M9J2R1ZSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPScke2Fzc2lnbm1lbnQuZW5kID09PSAnRm9yZXZlcicgPyAwIDogYXNzaWdubWVudC5lbmR9JyAvPmAsXG4gICAgICAgICAgICAgICAgICAgICAgYXNzaWdubWVudC5pZCArIHdlZWtJZClcblxuICAgIGlmICgoIHJlZmVyZW5jZSAmJiByZWZlcmVuY2UuZG9uZSkgfHwgYXNzaWdubWVudEluRG9uZShhc3NpZ25tZW50LmlkKSkge1xuICAgICAgICBlLmNsYXNzTGlzdC5hZGQoJ2RvbmUnKVxuICAgIH1cbiAgICBlLnNldEF0dHJpYnV0ZSgnZGF0YS1jbGFzcycsIGFzc2lnbm1lbnRDbGFzcyhhc3NpZ25tZW50LCBkYXRhKSlcbiAgICBjb25zdCBjbG9zZSA9IGVsZW1lbnQoJ2EnLCBbJ2Nsb3NlJywgJ21hdGVyaWFsLWljb25zJ10sICdjbG9zZScpXG4gICAgY2xvc2UuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbG9zZU9wZW5lZClcbiAgICBlLmFwcGVuZENoaWxkKGNsb3NlKVxuXG4gICAgLy8gUHJldmVudCBjbGlja2luZyB0aGUgY2xhc3MgbmFtZSB3aGVuIGFuIGl0ZW0gaXMgZGlzcGxheWVkIG9uIHRoZSBjYWxlbmRhciBmcm9tIGRvaW5nIGFueXRoaW5nXG4gICAgaWYgKGxpbmsgIT0gbnVsbCkge1xuICAgICAgICBfJChlLnF1ZXJ5U2VsZWN0b3IoJ2EnKSkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZ0KSA9PiB7XG4gICAgICAgICAgICBpZiAoKGRvY3VtZW50LmJvZHkuZ2V0QXR0cmlidXRlKCdkYXRhLXZpZXcnKSA9PT0gJzAnKSAmJiAhZS5jbGFzc0xpc3QuY29udGFpbnMoJ2Z1bGwnKSkge1xuICAgICAgICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgY29uc3QgY29tcGxldGUgPSBlbGVtZW50KCdhJywgWydjb21wbGV0ZScsICdtYXRlcmlhbC1pY29ucycsICd3YXZlcyddLCAnZG9uZScpXG4gICAgcmlwcGxlKGNvbXBsZXRlKVxuICAgIGNvbnN0IGlkID0gc3BsaXQuYXNzaWdubWVudC5pZFxuICAgIGNvbXBsZXRlLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCAoZXZ0KSA9PiB7XG4gICAgICAgIGlmIChldnQud2hpY2ggPT09IDEpIHsgLy8gTGVmdCBidXR0b25cbiAgICAgICAgICAgIGxldCBhZGRlZCA9IHRydWVcbiAgICAgICAgICAgIGlmIChyZWZlcmVuY2UgIT0gbnVsbCkgeyAvLyBUYXNrIGl0ZW1cbiAgICAgICAgICAgICAgICBpZiAoZS5jbGFzc0xpc3QuY29udGFpbnMoJ2RvbmUnKSkge1xuICAgICAgICAgICAgICAgICAgICByZWZlcmVuY2UuZG9uZSA9IGZhbHNlXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYWRkZWQgPSBmYWxzZVxuICAgICAgICAgICAgICAgICAgICByZWZlcmVuY2UuZG9uZSA9IHRydWVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2F2ZUV4dHJhKClcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdkb25lJykpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVtb3ZlRnJvbURvbmUoYXNzaWdubWVudC5pZClcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBhZGRlZCA9IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgIGFkZFRvRG9uZShhc3NpZ25tZW50LmlkKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzYXZlRG9uZSgpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuYm9keS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmlldycpID09PSAnMScpIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXG4gICAgICAgICAgICAgICAgICAgIGAuYXNzaWdubWVudFtpZF49XFxcIiR7aWR9XFxcIl0sICN0ZXN0JHtpZH0sICNhY3Rpdml0eSR7aWR9LCAjaWEke2lkfWBcbiAgICAgICAgICAgICAgICApLmZvckVhY2goKGVsZW0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbS5jbGFzc0xpc3QudG9nZ2xlKCdkb25lJylcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIGlmIChhZGRlZCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmFzc2lnbm1lbnQubGlzdERpc3A6bm90KC5kb25lKScpLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdub0xpc3QnKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5hc3NpZ25tZW50Lmxpc3REaXNwOm5vdCguZG9uZSknKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnbm9MaXN0JylcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXNpemUoKVxuICAgICAgICAgICAgfSwgMTAwKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcbiAgICAgICAgICAgICAgICBgLmFzc2lnbm1lbnRbaWRePVxcXCIke2lkfVxcXCJdLCAjdGVzdCR7aWR9LCAjYWN0aXZpdHkke2lkfSwgI2lhJHtpZH1gXG4gICAgICAgICAgICApLmZvckVhY2goKGVsZW0pID0+IHtcbiAgICAgICAgICAgICAgICBlbGVtLmNsYXNzTGlzdC50b2dnbGUoJ2RvbmUnKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGlmIChhZGRlZCkge1xuICAgICAgICAgICAgICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYXNzaWdubWVudC5saXN0RGlzcDpub3QoLmRvbmUpJykubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnbm9MaXN0JylcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYXNzaWdubWVudC5saXN0RGlzcDpub3QoLmRvbmUpJykubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnbm9MaXN0JylcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KVxuICAgIGUuYXBwZW5kQ2hpbGQoY29tcGxldGUpXG5cbiAgICAvLyBJZiB0aGUgYXNzaWdubWVudCBpcyBhIGN1c3RvbSBvbmUsIGFkZCBhIGJ1dHRvbiB0byBkZWxldGUgaXRcbiAgICBpZiAoc3BsaXQuY3VzdG9tKSB7XG4gICAgICAgIGNvbnN0IGRlbGV0ZUEgPSBlbGVtZW50KCdhJywgWydtYXRlcmlhbC1pY29ucycsICdkZWxldGVBc3NpZ25tZW50JywgJ3dhdmVzJ10sICdkZWxldGUnKVxuICAgICAgICByaXBwbGUoZGVsZXRlQSlcbiAgICAgICAgZGVsZXRlQS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgKGV2dCkgPT4ge1xuICAgICAgICAgICAgaWYgKGV2dC53aGljaCAhPT0gMSB8fCAhcmVmZXJlbmNlKSByZXR1cm5cbiAgICAgICAgICAgIHJlbW92ZUZyb21FeHRyYShyZWZlcmVuY2UpXG4gICAgICAgICAgICBzYXZlRXh0cmEoKVxuICAgICAgICAgICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mdWxsJykgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnYXV0bydcbiAgICAgICAgICAgICAgICBjb25zdCBiYWNrID0gZWxlbUJ5SWQoJ2JhY2tncm91bmQnKVxuICAgICAgICAgICAgICAgIGJhY2suY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgYmFjay5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXG4gICAgICAgICAgICAgICAgfSwgMzUwKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZS5yZW1vdmUoKVxuICAgICAgICAgICAgZGlzcGxheShmYWxzZSlcbiAgICAgICAgfSlcbiAgICAgICAgZS5hcHBlbmRDaGlsZChkZWxldGVBKVxuICAgIH1cblxuICAgIC8vIE1vZGlmaWNhdGlvbiBidXR0b25cbiAgICBjb25zdCBlZGl0ID0gZWxlbWVudCgnYScsIFsnZWRpdEFzc2lnbm1lbnQnLCAnbWF0ZXJpYWwtaWNvbnMnLCAnd2F2ZXMnXSwgJ2VkaXQnKVxuICAgIGVkaXQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIChldnQpID0+IHtcbiAgICAgICAgaWYgKGV2dC53aGljaCA9PT0gMSkge1xuICAgICAgICAgICAgY29uc3QgcmVtb3ZlID0gZWRpdC5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpXG4gICAgICAgICAgICBlZGl0LmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScpXG4gICAgICAgICAgICBfJChlLnF1ZXJ5U2VsZWN0b3IoJy5ib2R5JykpLnNldEF0dHJpYnV0ZSgnY29udGVudEVkaXRhYmxlJywgcmVtb3ZlID8gJ2ZhbHNlJyA6ICd0cnVlJylcbiAgICAgICAgICAgIGlmICghcmVtb3ZlKSB7XG4gICAgICAgICAgICAgICAgKGUucXVlcnlTZWxlY3RvcignLmJvZHknKSBhcyBIVE1MRWxlbWVudCkuZm9jdXMoKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgZG4gPSBlLnF1ZXJ5U2VsZWN0b3IoJy5jb21wbGV0ZScpIGFzIEhUTUxFbGVtZW50XG4gICAgICAgICAgICBkbi5zdHlsZS5kaXNwbGF5ID0gcmVtb3ZlID8gJ2Jsb2NrJyA6ICdub25lJ1xuICAgICAgICB9XG4gICAgfSlcbiAgICByaXBwbGUoZWRpdClcblxuICAgIGUuYXBwZW5kQ2hpbGQoZWRpdClcblxuICAgIGNvbnN0IHN0YXJ0ID0gbmV3IERhdGUoZnJvbURhdGVOdW0oYXNzaWdubWVudC5zdGFydCkpXG4gICAgY29uc3QgZW5kID0gYXNzaWdubWVudC5lbmQgPT09ICdGb3JldmVyJyA/IGFzc2lnbm1lbnQuZW5kIDogbmV3IERhdGUoZnJvbURhdGVOdW0oYXNzaWdubWVudC5lbmQpKVxuICAgIGNvbnN0IHRpbWVzID0gZWxlbWVudCgnZGl2JywgJ3JhbmdlJyxcbiAgICAgICAgYXNzaWdubWVudC5zdGFydCA9PT0gYXNzaWdubWVudC5lbmQgPyBkYXRlU3RyaW5nKHN0YXJ0KSA6IGAke2RhdGVTdHJpbmcoc3RhcnQpfSAmbmRhc2g7ICR7ZGF0ZVN0cmluZyhlbmQpfWApXG4gICAgZS5hcHBlbmRDaGlsZCh0aW1lcylcbiAgICBpZiAoYXNzaWdubWVudC5hdHRhY2htZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IGF0dGFjaG1lbnRzID0gZWxlbWVudCgnZGl2JywgJ2F0dGFjaG1lbnRzJylcbiAgICAgICAgYXNzaWdubWVudC5hdHRhY2htZW50cy5mb3JFYWNoKChhdHRhY2htZW50KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBhID0gZWxlbWVudCgnYScsIFtdLCBhdHRhY2htZW50WzBdKSBhcyBIVE1MQW5jaG9yRWxlbWVudFxuICAgICAgICAgICAgYS5ocmVmID0gdXJsRm9yQXR0YWNobWVudChhdHRhY2htZW50WzFdKVxuICAgICAgICAgICAgZ2V0QXR0YWNobWVudE1pbWVUeXBlKGF0dGFjaG1lbnRbMV0pLnRoZW4oKHR5cGUpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgc3BhblxuICAgICAgICAgICAgICAgIGlmIChtaW1lVHlwZXNbdHlwZV0gIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBhLmNsYXNzTGlzdC5hZGQobWltZVR5cGVzW3R5cGVdWzFdKVxuICAgICAgICAgICAgICAgICAgICBzcGFuID0gZWxlbWVudCgnc3BhbicsIFtdLCBtaW1lVHlwZXNbdHlwZV1bMF0pXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc3BhbiA9IGVsZW1lbnQoJ3NwYW4nLCBbXSwgJ1Vua25vd24gZmlsZSB0eXBlJylcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYS5hcHBlbmRDaGlsZChzcGFuKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGF0dGFjaG1lbnRzLmFwcGVuZENoaWxkKGEpXG4gICAgICAgIH0pXG4gICAgICAgIGUuYXBwZW5kQ2hpbGQoYXR0YWNobWVudHMpXG4gICAgfVxuXG4gICAgY29uc3QgYm9keSA9IGVsZW1lbnQoJ2RpdicsICdib2R5JyxcbiAgICAgICAgYXNzaWdubWVudC5ib2R5LnJlcGxhY2UoL2ZvbnQtZmFtaWx5OlteO10qPyg/OlRpbWVzIE5ldyBSb21hbnxzZXJpZilbXjtdKi9nLCAnJykpXG4gICAgY29uc3QgZWRpdHMgPSBlbGVtZW50KCdkaXYnLCAnZWRpdHMnLCAnPHNwYW4gY2xhc3M9XFwnYWRkaXRpb25zXFwnPjwvc3Bhbj48c3BhbiBjbGFzcz1cXCdkZWxldGlvbnNcXCc+PC9zcGFuPicpXG4gICAgY29uc3QgbSA9IG1vZGlmaWVkQm9keShhc3NpZ25tZW50LmlkKVxuICAgIGlmIChtICE9IG51bGwpIHtcbiAgICAgICAgY29uc3QgZCA9IGRtcC5kaWZmX21haW4oYXNzaWdubWVudC5ib2R5LCBtKVxuICAgICAgICBkbXAuZGlmZl9jbGVhbnVwU2VtYW50aWMoZClcbiAgICAgICAgaWYgKGQubGVuZ3RoICE9PSAwKSB7IC8vIEhhcyBiZWVuIGVkaXRlZFxuICAgICAgICAgICAgcG9wdWxhdGVBZGRlZERlbGV0ZWQoZCwgZWRpdHMpXG4gICAgICAgICAgICBib2R5LmlubmVySFRNTCA9IG1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGJvZHkuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoZXZ0KSA9PiB7XG4gICAgICAgIGlmIChyZWZlcmVuY2UgIT0gbnVsbCkge1xuICAgICAgICAgICAgcmVmZXJlbmNlLmJvZHkgPSBib2R5LmlubmVySFRNTFxuICAgICAgICAgICAgc2F2ZUV4dHJhKClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNldE1vZGlmaWVkKGFzc2lnbm1lbnQuaWQsICBib2R5LmlubmVySFRNTClcbiAgICAgICAgICAgIHNhdmVNb2RpZmllZCgpXG4gICAgICAgICAgICBjb25zdCBkID0gZG1wLmRpZmZfbWFpbihhc3NpZ25tZW50LmJvZHksIGJvZHkuaW5uZXJIVE1MKVxuICAgICAgICAgICAgZG1wLmRpZmZfY2xlYW51cFNlbWFudGljKGQpXG4gICAgICAgICAgICBpZiAocG9wdWxhdGVBZGRlZERlbGV0ZWQoZCwgZWRpdHMpKSB7XG4gICAgICAgICAgICAgICAgZWRpdHMuY2xhc3NMaXN0LmFkZCgnbm90RW1wdHknKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlZGl0cy5jbGFzc0xpc3QucmVtb3ZlKCdub3RFbXB0eScpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRvY3VtZW50LmJvZHkuZ2V0QXR0cmlidXRlKCdkYXRhLXZpZXcnKSA9PT0gJzEnKSByZXNpemUoKVxuICAgIH0pXG5cbiAgICBlLmFwcGVuZENoaWxkKGJvZHkpXG5cbiAgICBjb25zdCByZXN0b3JlID0gZWxlbWVudCgnYScsIFsnbWF0ZXJpYWwtaWNvbnMnLCAncmVzdG9yZSddLCAnc2V0dGluZ3NfYmFja3VwX3Jlc3RvcmUnKVxuICAgIHJlc3RvcmUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIHJlbW92ZUZyb21Nb2RpZmllZChhc3NpZ25tZW50LmlkKVxuICAgICAgICBzYXZlTW9kaWZpZWQoKVxuICAgICAgICBib2R5LmlubmVySFRNTCA9IGFzc2lnbm1lbnQuYm9keVxuICAgICAgICBlZGl0cy5jbGFzc0xpc3QucmVtb3ZlKCdub3RFbXB0eScpXG4gICAgICAgIGlmIChkb2N1bWVudC5ib2R5LmdldEF0dHJpYnV0ZSgnZGF0YS12aWV3JykgPT09ICcxJykgIHJlc2l6ZSgpXG4gICAgfSlcbiAgICBlZGl0cy5hcHBlbmRDaGlsZChyZXN0b3JlKVxuICAgIGUuYXBwZW5kQ2hpbGQoZWRpdHMpXG5cbiAgICBjb25zdCBtb2RzID0gZWxlbWVudCgnZGl2JywgWydtb2RzJ10pXG4gICAgcmVjZW50QWN0aXZpdHkoKS5mb3JFYWNoKChhKSA9PiB7XG4gICAgICAgIGlmICgoYVswXSA9PT0gJ2VkaXQnKSAmJiAoYVsxXS5pZCA9PT0gYXNzaWdubWVudC5pZCkpIHtcbiAgICAgICAgY29uc3QgdGUgPSBlbGVtZW50KCdkaXYnLCBbJ2lubmVyQWN0aXZpdHknLCAnYXNzaWdubWVudEl0ZW0nLCBhc3NpZ25tZW50LmJhc2VUeXBlXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGA8aSBjbGFzcz0nbWF0ZXJpYWwtaWNvbnMnPmVkaXQ8L2k+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9J3RpdGxlJz4ke2RhdGVTdHJpbmcobmV3IERhdGUoYVsyXSkpfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz0nYWRkaXRpb25zJz48L3NwYW4+PHNwYW4gY2xhc3M9J2RlbGV0aW9ucyc+PC9zcGFuPmAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBgaWEke2Fzc2lnbm1lbnQuaWR9YClcbiAgICAgICAgY29uc3QgZCA9IGRtcC5kaWZmX21haW4oYVsxXS5ib2R5LCBhc3NpZ25tZW50LmJvZHkpXG4gICAgICAgIGRtcC5kaWZmX2NsZWFudXBTZW1hbnRpYyhkKVxuICAgICAgICBwb3B1bGF0ZUFkZGVkRGVsZXRlZChkLCB0ZSlcblxuICAgICAgICBpZiAoYXNzaWdubWVudC5jbGFzcykgdGUuc2V0QXR0cmlidXRlKCdkYXRhLWNsYXNzJywgZGF0YS5jbGFzc2VzW2Fzc2lnbm1lbnQuY2xhc3NdKVxuICAgICAgICB0ZS5hcHBlbmRDaGlsZChlbGVtZW50KCdkaXYnLCAnaWFEaWZmJywgZG1wLmRpZmZfcHJldHR5SHRtbChkKSkpXG4gICAgICAgIHRlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgICAgdGUuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJylcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5ib2R5LmdldEF0dHJpYnV0ZSgnZGF0YS12aWV3JykgPT09ICcxJykgcmVzaXplKClcbiAgICAgICAgfSlcbiAgICAgICAgbW9kcy5hcHBlbmRDaGlsZCh0ZSlcbiAgICAgICAgfVxuICAgIH0pXG4gICAgZS5hcHBlbmRDaGlsZChtb2RzKVxuXG4gICAgaWYgKHNldHRpbmdzLmFzc2lnbm1lbnRTcGFuID09PSAnbXVsdGlwbGUnICYmIChzdGFydCA8IHNwbGl0LnN0YXJ0KSkge1xuICAgICAgICBlLmNsYXNzTGlzdC5hZGQoJ2Zyb21XZWVrZW5kJylcbiAgICB9XG4gICAgaWYgKHNldHRpbmdzLmFzc2lnbm1lbnRTcGFuID09PSAnbXVsdGlwbGUnICYmIChlbmQgPiBzcGxpdC5lbmQpKSB7XG4gICAgICAgIGUuY2xhc3NMaXN0LmFkZCgnb3ZlcldlZWtlbmQnKVxuICAgIH1cbiAgICBlLmNsYXNzTGlzdC5hZGQoYHMke3NwbGl0LnN0YXJ0LmdldERheSgpfWApXG4gICAgaWYgKHNwbGl0LmVuZCAhPT0gJ0ZvcmV2ZXInKSBlLmNsYXNzTGlzdC5hZGQoYGUkezYgLSBzcGxpdC5lbmQuZ2V0RGF5KCl9YClcblxuICAgIGNvbnN0IHN0ID0gTWF0aC5mbG9vcihzcGxpdC5zdGFydC5nZXRUaW1lKCkgLyAxMDAwIC8gMzYwMCAvIDI0KVxuICAgIGlmIChzcGxpdC5hc3NpZ25tZW50LmVuZCA9PT0gJ0ZvcmV2ZXInKSB7XG4gICAgICAgIGlmIChzdCA8PSAodG9kYXkoKSArIGdldExpc3REYXRlT2Zmc2V0KCkpKSB7XG4gICAgICAgICAgICBlLmNsYXNzTGlzdC5hZGQoJ2xpc3REaXNwJylcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IG1pZERhdGUgPSBuZXcgRGF0ZSgpXG4gICAgICAgIG1pZERhdGUuc2V0RGF0ZShtaWREYXRlLmdldERhdGUoKSArIGdldExpc3REYXRlT2Zmc2V0KCkpXG4gICAgICAgIGNvbnN0IHB1c2ggPSAoYXNzaWdubWVudC5iYXNlVHlwZSA9PT0gJ3Rlc3QnICYmIGFzc2lnbm1lbnQuc3RhcnQgPT09IHN0KSA/IHNldHRpbmdzLmVhcmx5VGVzdCA6IDBcbiAgICAgICAgY29uc3QgZW5kRXh0cmEgPSBnZXRMaXN0RGF0ZU9mZnNldCgpID09PSAwID8gZ2V0VGltZUFmdGVyKG1pZERhdGUpIDogMjQgKiAzNjAwICogMTAwMFxuICAgICAgICBpZiAoZnJvbURhdGVOdW0oc3QgLSBwdXNoKSA8PSBtaWREYXRlICYmXG4gICAgICAgICAgICAoc3BsaXQuZW5kID09PSAnRm9yZXZlcicgfHwgbWlkRGF0ZS5nZXRUaW1lKCkgPD0gc3BsaXQuZW5kLmdldFRpbWUoKSArIGVuZEV4dHJhKSkge1xuICAgICAgICAgICAgZS5jbGFzc0xpc3QuYWRkKCdsaXN0RGlzcCcpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBBZGQgY2xpY2sgaW50ZXJhY3Rpdml0eVxuICAgIGlmICghc3BsaXQuY3VzdG9tIHx8ICFzZXR0aW5ncy5zZXBUYXNrcykge1xuICAgICAgICBlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2dCkgPT4ge1xuICAgICAgICAgICAgaWYgKChkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdmdWxsJykubGVuZ3RoID09PSAwKSAmJlxuICAgICAgICAgICAgICAgIChkb2N1bWVudC5ib2R5LmdldEF0dHJpYnV0ZSgnZGF0YS12aWV3JykgPT09ICcwJykpIHtcbiAgICAgICAgICAgICAgICBlLmNsYXNzTGlzdC5yZW1vdmUoJ2FuaW0nKVxuICAgICAgICAgICAgICAgIGUuY2xhc3NMaXN0LmFkZCgnbW9kaWZ5JylcbiAgICAgICAgICAgICAgICBjb25zdCB0b3AgPSAoZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgLSBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gY3NzTnVtYmVyKGUuc3R5bGUubWFyZ2luVG9wKSkgKyA0NFxuICAgICAgICAgICAgICAgIGUuc3R5bGUudG9wID0gdG9wIC0gd2luZG93LnBhZ2VZT2Zmc2V0ICsgJ3B4J1xuICAgICAgICAgICAgICAgIGUuc2V0QXR0cmlidXRlKCdkYXRhLXRvcCcsIFN0cmluZyh0b3ApKVxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJ1xuICAgICAgICAgICAgICAgIGNvbnN0IGJhY2sgPSBlbGVtQnlJZCgnYmFja2dyb3VuZCcpXG4gICAgICAgICAgICAgICAgYmFjay5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxuICAgICAgICAgICAgICAgIGJhY2suc3R5bGUuZGlzcGxheSA9ICdibG9jaydcbiAgICAgICAgICAgICAgICBlLmNsYXNzTGlzdC5hZGQoJ2FuaW0nKVxuICAgICAgICAgICAgICAgIGZvcmNlTGF5b3V0KGUpXG4gICAgICAgICAgICAgICAgZS5jbGFzc0xpc3QuYWRkKCdmdWxsJylcbiAgICAgICAgICAgICAgICBlLnN0eWxlLnRvcCA9ICg3NSAtIGNzc051bWJlcihlLnN0eWxlLm1hcmdpblRvcCkpICsgJ3B4J1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gZS5jbGFzc0xpc3QucmVtb3ZlKCdhbmltJyksIDM1MClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICByZXR1cm4gZVxufVxuXG4vLyBJbiBvcmRlciB0byBkaXNwbGF5IGFuIGFzc2lnbm1lbnQgaW4gdGhlIGNvcnJlY3QgWCBwb3NpdGlvbiwgY2xhc3NlcyB3aXRoIG5hbWVzIGVYIGFuZCBlWCBhcmVcbi8vIHVzZWQsIHdoZXJlIFggaXMgdGhlIG51bWJlciBvZiBzcXVhcmVzIHRvIGZyb20gdGhlIGFzc2lnbm1lbnQgdG8gdGhlIGxlZnQvcmlnaHQgc2lkZSBvZiB0aGVcbi8vIHNjcmVlbi4gVGhlIGZ1bmN0aW9uIGJlbG93IGRldGVybWluZXMgd2hpY2ggZVggYW5kIHNYIGNsYXNzIHRoZSBnaXZlbiBlbGVtZW50IGhhcy5cbmV4cG9ydCBmdW5jdGlvbiBnZXRFUyhlbDogSFRNTEVsZW1lbnQpOiBbc3RyaW5nLCBzdHJpbmddIHtcbiAgICBsZXQgZSA9IDBcbiAgICBsZXQgcyA9IDBcblxuICAgIEFycmF5LmZyb20obmV3IEFycmF5KDcpLCAoXywgeCkgPT4geCkuZm9yRWFjaCgoeCkgPT4ge1xuICAgICAgICBpZiAoZWwuY2xhc3NMaXN0LmNvbnRhaW5zKGBlJHt4fWApKSB7XG4gICAgICAgICAgICBlID0geFxuICAgICAgICB9XG4gICAgICAgIGlmIChlbC5jbGFzc0xpc3QuY29udGFpbnMoYHMke3h9YCkpIHtcbiAgICAgICAgICAgIHMgPSB4XG4gICAgICAgIH1cbiAgICB9KVxuICAgIHJldHVybiBbYGUke2V9YCwgYHMke3N9YF1cbn1cblxuLy8gQmVsb3cgaXMgYSBmdW5jdGlvbiB0byBjbG9zZSB0aGUgY3VycmVudCBhc3NpZ25tZW50IHRoYXQgaXMgb3BlbmVkLlxuZXhwb3J0IGZ1bmN0aW9uIGNsb3NlT3BlbmVkKGV2dDogRXZlbnQpOiB2b2lkIHtcbiAgICBldnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICBjb25zdCBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mdWxsJykgYXMgSFRNTEVsZW1lbnR8bnVsbFxuICAgIGlmIChlbCA9PSBudWxsKSByZXR1cm5cblxuICAgIGVsLnN0eWxlLnRvcCA9IE51bWJlcihlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdG9wJykgfHwgJzAnKSAtIHdpbmRvdy5wYWdlWU9mZnNldCArICdweCdcbiAgICBlbC5jbGFzc0xpc3QuYWRkKCdhbmltJylcbiAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKCdmdWxsJylcbiAgICBlbC5zY3JvbGxUb3AgPSAwXG4gICAgZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICdhdXRvJ1xuICAgIGNvbnN0IGJhY2sgPSBlbGVtQnlJZCgnYmFja2dyb3VuZCcpXG4gICAgYmFjay5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuXG4gICAgY29uc3QgdHJhbnNpdGlvbkxpc3RlbmVyID0gKCkgPT4ge1xuICAgICAgICBiYWNrLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcbiAgICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZSgnYW5pbScpXG4gICAgICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoJ21vZGlmeScpXG4gICAgICAgIGVsLnN0eWxlLnRvcCA9ICdhdXRvJ1xuICAgICAgICBmb3JjZUxheW91dChlbClcbiAgICAgICAgZWwuY2xhc3NMaXN0LmFkZCgnYW5pbScpXG4gICAgICAgIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCB0cmFuc2l0aW9uTGlzdGVuZXIpXG4gICAgfVxuXG4gICAgZWwuYWRkRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIHRyYW5zaXRpb25MaXN0ZW5lcilcbn1cbiIsImltcG9ydCB7IGVsZW1CeUlkLCBsb2NhbFN0b3JhZ2VSZWFkIH0gZnJvbSAnLi4vdXRpbCdcblxuLy8gVGhlbiwgdGhlIHVzZXJuYW1lIGluIHRoZSBzaWRlYmFyIG5lZWRzIHRvIGJlIHNldCBhbmQgd2UgbmVlZCB0byBnZW5lcmF0ZSBhbiBcImF2YXRhclwiIGJhc2VkIG9uXG4vLyBpbml0aWFscy4gVG8gZG8gdGhhdCwgc29tZSBjb2RlIHRvIGNvbnZlcnQgZnJvbSBMQUIgdG8gUkdCIGNvbG9ycyBpcyBib3Jyb3dlZCBmcm9tXG4vLyBodHRwczovL2dpdGh1Yi5jb20vYm9yb25pbmUvY29sb3JzcGFjZXMuanNcbi8vXG4vLyBMQUIgaXMgYSBjb2xvciBuYW1pbmcgc2NoZW1lIHRoYXQgdXNlcyB0d28gdmFsdWVzIChBIGFuZCBCKSBhbG9uZyB3aXRoIGEgbGlnaHRuZXNzIHZhbHVlIGluIG9yZGVyXG4vLyB0byBwcm9kdWNlIGNvbG9ycyB0aGF0IGFyZSBlcXVhbGx5IHNwYWNlZCBiZXR3ZWVuIGFsbCBvZiB0aGUgY29sb3JzIHRoYXQgY2FuIGJlIHNlZW4gYnkgdGhlIGh1bWFuXG4vLyBleWUuIFRoaXMgd29ya3MgZ3JlYXQgYmVjYXVzZSBldmVyeW9uZSBoYXMgbGV0dGVycyBpbiBoaXMvaGVyIGluaXRpYWxzLlxuXG4vLyBUaGUgRDY1IHN0YW5kYXJkIGlsbHVtaW5hbnRcbmNvbnN0IFJFRl9YID0gMC45NTA0N1xuY29uc3QgUkVGX1kgPSAxLjAwMDAwXG5jb25zdCBSRUZfWiA9IDEuMDg4ODNcblxuLy8gQ0lFIEwqYSpiKiBjb25zdGFudHNcbmNvbnN0IExBQl9FID0gMC4wMDg4NTZcbmNvbnN0IExBQl9LID0gOTAzLjNcblxuY29uc3QgTSA9IFtcbiAgICBbMy4yNDA2LCAtMS41MzcyLCAtMC40OTg2XSxcbiAgICBbLTAuOTY4OSwgMS44NzU4LCAgMC4wNDE1XSxcbiAgICBbMC4wNTU3LCAtMC4yMDQwLCAgMS4wNTcwXVxuXVxuXG5jb25zdCBmSW52ID0gKHQ6IG51bWJlcikgPT4ge1xuICAgIGlmIChNYXRoLnBvdyh0LCAzKSA+IExBQl9FKSB7XG4gICAgcmV0dXJuIE1hdGgucG93KHQsIDMpXG4gICAgfSBlbHNlIHtcbiAgICByZXR1cm4gKCgxMTYgKiB0KSAtIDE2KSAvIExBQl9LXG4gICAgfVxufVxuY29uc3QgZG90UHJvZHVjdCA9IChhOiBudW1iZXJbXSwgYjogbnVtYmVyW10pID0+IHtcbiAgICBsZXQgcmV0ID0gMFxuICAgIGEuZm9yRWFjaCgoXywgaSkgPT4ge1xuICAgICAgICByZXQgKz0gYVtpXSAqIGJbaV1cbiAgICB9KVxuICAgIHJldHVybiByZXRcbn1cbmNvbnN0IGZyb21MaW5lYXIgPSAoYzogbnVtYmVyKSA9PiB7XG4gICAgY29uc3QgYSA9IDAuMDU1XG4gICAgaWYgKGMgPD0gMC4wMDMxMzA4KSB7XG4gICAgICAgIHJldHVybiAxMi45MiAqIGNcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gKDEuMDU1ICogTWF0aC5wb3coYywgMSAvIDIuNCkpIC0gMC4wNTVcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGxhYnJnYihsOiBudW1iZXIsIGE6IG51bWJlciwgYjogbnVtYmVyKTogc3RyaW5nIHtcbiAgICBjb25zdCB2YXJZID0gKGwgKyAxNikgLyAxMTZcbiAgICBjb25zdCB2YXJaID0gdmFyWSAtIChiIC8gMjAwKVxuICAgIGNvbnN0IHZhclggPSAoYSAvIDUwMCkgKyB2YXJZXG4gICAgY29uc3QgX1ggPSBSRUZfWCAqIGZJbnYodmFyWClcbiAgICBjb25zdCBfWSA9IFJFRl9ZICogZkludih2YXJZKVxuICAgIGNvbnN0IF9aID0gUkVGX1ogKiBmSW52KHZhclopXG5cbiAgICBjb25zdCB0dXBsZSA9IFtfWCwgX1ksIF9aXVxuXG4gICAgY29uc3QgX1IgPSBmcm9tTGluZWFyKGRvdFByb2R1Y3QoTVswXSwgdHVwbGUpKVxuICAgIGNvbnN0IF9HID0gZnJvbUxpbmVhcihkb3RQcm9kdWN0KE1bMV0sIHR1cGxlKSlcbiAgICBjb25zdCBfQiA9IGZyb21MaW5lYXIoZG90UHJvZHVjdChNWzJdLCB0dXBsZSkpXG5cbiAgICAvLyBPcmlnaW5hbCBmcm9tIGhlcmVcbiAgICBjb25zdCBuID0gKHY6IG51bWJlcikgPT4gTWF0aC5yb3VuZChNYXRoLm1heChNYXRoLm1pbih2ICogMjU2LCAyNTUpLCAwKSlcbiAgICByZXR1cm4gYHJnYigke24oX1IpfSwgJHtuKF9HKX0sICR7bihfQil9KWBcbn1cblxuLyoqXG4gKiBDb252ZXJ0IGEgbGV0dGVyIHRvIGEgZmxvYXQgdmFsdWVkIGZyb20gMCB0byAyNTVcbiAqL1xuZnVuY3Rpb24gbGV0dGVyVG9Db2xvclZhbChsZXR0ZXI6IHN0cmluZyk6IG51bWJlciB7XG4gICAgcmV0dXJuICgoKGxldHRlci5jaGFyQ29kZUF0KDApIC0gNjUpIC8gMjYpICogMjU2KSAtIDEyOFxufVxuXG4vLyBUaGUgZnVuY3Rpb24gYmVsb3cgdXNlcyB0aGlzIGFsZ29yaXRobSB0byBnZW5lcmF0ZSBhIGJhY2tncm91bmQgY29sb3IgZm9yIHRoZSBpbml0aWFscyBkaXNwbGF5ZWQgaW4gdGhlIHNpZGViYXIuXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlQXZhdGFyKCk6IHZvaWQge1xuICAgIGlmICghbG9jYWxTdG9yYWdlUmVhZCgndXNlcm5hbWUnKSkgcmV0dXJuXG4gICAgY29uc3QgdXNlckVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3VzZXInKVxuICAgIGNvbnN0IGluaXRpYWxzRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW5pdGlhbHMnKVxuICAgIGlmICghdXNlckVsIHx8ICFpbml0aWFsc0VsKSByZXR1cm5cblxuICAgIHVzZXJFbC5pbm5lckhUTUwgPSBsb2NhbFN0b3JhZ2VSZWFkKCd1c2VybmFtZScpXG4gICAgY29uc3QgaW5pdGlhbHMgPSBsb2NhbFN0b3JhZ2VSZWFkKCd1c2VybmFtZScpLm1hdGNoKC9cXGQqKC4pLio/KC4kKS8pIC8vIFNlcGFyYXRlIHllYXIgZnJvbSBmaXJzdCBuYW1lIGFuZCBpbml0aWFsXG4gICAgaWYgKGluaXRpYWxzICE9IG51bGwpIHtcbiAgICAgICAgY29uc3QgYmcgPSBsYWJyZ2IoNTAsIGxldHRlclRvQ29sb3JWYWwoaW5pdGlhbHNbMV0pLCBsZXR0ZXJUb0NvbG9yVmFsKGluaXRpYWxzWzJdKSkgLy8gQ29tcHV0ZSB0aGUgY29sb3JcbiAgICAgICAgaW5pdGlhbHNFbC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBiZ1xuICAgICAgICBpbml0aWFsc0VsLmlubmVySFRNTCA9IGluaXRpYWxzWzFdICsgaW5pdGlhbHNbMl1cbiAgICB9XG59XG4iLCJpbXBvcnQgeyB0b2RheSB9IGZyb20gJy4uL2RhdGVzJ1xuaW1wb3J0IHsgZWxlbWVudCB9IGZyb20gJy4uL3V0aWwnXG5cbmNvbnN0IE1PTlRIUyA9IFsnSmFuJywgJ0ZlYicsICdNYXInLCAnQXByJywgJ01heScsICdKdW4nLCAnSnVsJywgJ0F1ZycsICdTZXAnLCAnT2N0JywgJ05vdicsICdEZWMnXVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlV2VlayhpZDogc3RyaW5nKTogSFRNTEVsZW1lbnQge1xuICAgIGNvbnN0IHdrID0gZWxlbWVudCgnc2VjdGlvbicsICd3ZWVrJywgbnVsbCwgaWQpXG4gICAgY29uc3QgZGF5VGFibGUgPSBlbGVtZW50KCd0YWJsZScsICdkYXlUYWJsZScpIGFzIEhUTUxUYWJsZUVsZW1lbnRcbiAgICBjb25zdCB0ciA9IGRheVRhYmxlLmluc2VydFJvdygpXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lIG5vLWxvb3BzXG4gICAgZm9yIChsZXQgZGF5ID0gMDsgZGF5IDwgNzsgZGF5KyspIHRyLmluc2VydENlbGwoKVxuICAgIHdrLmFwcGVuZENoaWxkKGRheVRhYmxlKVxuXG4gICAgcmV0dXJuIHdrXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVEYXkoZDogRGF0ZSk6IEhUTUxFbGVtZW50IHtcbiAgICBjb25zdCBkYXkgPSBlbGVtZW50KCdkaXYnLCAnZGF5JywgbnVsbCwgJ2RheScpXG4gICAgZGF5LnNldEF0dHJpYnV0ZSgnZGF0YS1kYXRlJywgU3RyaW5nKGQuZ2V0VGltZSgpKSlcbiAgICBpZiAoTWF0aC5mbG9vcigoZC5nZXRUaW1lKCkgLSBkLmdldFRpbWV6b25lT2Zmc2V0KCkpIC8gMTAwMCAvIDM2MDAgLyAyNCkgPT09IHRvZGF5KCkpIHtcbiAgICAgIGRheS5jbGFzc0xpc3QuYWRkKCd0b2RheScpXG4gICAgfVxuXG4gICAgY29uc3QgbW9udGggPSBlbGVtZW50KCdzcGFuJywgJ21vbnRoJywgTU9OVEhTW2QuZ2V0TW9udGgoKV0pXG4gICAgZGF5LmFwcGVuZENoaWxkKG1vbnRoKVxuXG4gICAgY29uc3QgZGF0ZSA9IGVsZW1lbnQoJ3NwYW4nLCAnZGF0ZScsIFN0cmluZyhkLmdldERhdGUoKSkpXG4gICAgZGF5LmFwcGVuZENoaWxkKGRhdGUpXG5cbiAgICByZXR1cm4gZGF5XG59XG4iLCJpbXBvcnQgeyBnZXRDbGFzc2VzLCBnZXREYXRhIH0gZnJvbSAnLi4vcGNyJ1xuaW1wb3J0IHsgXyQsIGNhcGl0YWxpemVTdHJpbmcsIGVsZW1CeUlkLCBlbGVtZW50IH0gZnJvbSAnLi4vdXRpbCdcblxuLy8gV2hlbiBhbnl0aGluZyBpcyB0eXBlZCwgdGhlIHNlYXJjaCBzdWdnZXN0aW9ucyBuZWVkIHRvIGJlIHVwZGF0ZWQuXG5jb25zdCBUSVBfTkFNRVMgPSB7XG4gICAgZm9yOiBbJ2ZvciddLFxuICAgIGJ5OiBbJ2J5JywgJ2R1ZScsICdlbmRpbmcnXSxcbiAgICBzdGFydGluZzogWydzdGFydGluZycsICdiZWdpbm5pbmcnLCAnYXNzaWduZWQnXVxufVxuXG5jb25zdCBuZXdUZXh0ID0gZWxlbUJ5SWQoJ25ld1RleHQnKSBhcyBIVE1MSW5wdXRFbGVtZW50XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVOZXdUaXBzKHZhbDogc3RyaW5nLCBzY3JvbGw6IGJvb2xlYW4gPSB0cnVlKTogdm9pZCB7XG4gICAgaWYgKHNjcm9sbCkge1xuICAgICAgICBlbGVtQnlJZCgnbmV3VGlwcycpLnNjcm9sbFRvcCA9IDBcbiAgICB9XG5cbiAgICBjb25zdCBzcGFjZUluZGV4ID0gdmFsLmxhc3RJbmRleE9mKCcgJylcbiAgICBpZiAoc3BhY2VJbmRleCAhPT0gLTEpIHtcbiAgICAgICAgY29uc3QgYmVmb3JlU3BhY2UgPSB2YWwubGFzdEluZGV4T2YoJyAnLCBzcGFjZUluZGV4IC0gMSlcbiAgICAgICAgY29uc3QgYmVmb3JlID0gdmFsLnN1YnN0cmluZygoYmVmb3JlU3BhY2UgPT09IC0xID8gMCA6IGJlZm9yZVNwYWNlICsgMSksIHNwYWNlSW5kZXgpXG4gICAgICAgIE9iamVjdC5lbnRyaWVzKFRJUF9OQU1FUykuZm9yRWFjaCgoW25hbWUsIHBvc3NpYmxlXSkgPT4ge1xuICAgICAgICAgICAgaWYgKHBvc3NpYmxlLmluZGV4T2YoYmVmb3JlKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBpZiAobmFtZSA9PT0gJ2ZvcicpIHtcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmtleXMoVElQX05BTUVTKS5mb3JFYWNoKCh0aXBOYW1lKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtQnlJZChgdGlwJHt0aXBOYW1lfWApLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIGdldENsYXNzZXMoKS5mb3JFYWNoKChjbHMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGlkID0gYHRpcGNsYXNzJHtjbHMucmVwbGFjZSgvXFxXLywgJycpfWBcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzcGFjZUluZGV4ID09PSAodmFsLmxlbmd0aCAtIDEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjb250YWluZXIgPSBlbGVtZW50KCdkaXYnLCBbJ2NsYXNzVGlwJywgJ2FjdGl2ZScsICd0aXAnXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGA8aSBjbGFzcz0nbWF0ZXJpYWwtaWNvbnMnPmNsYXNzPC9pPjxzcGFuIGNsYXNzPSd0eXBlZCc+JHtjbHN9PC9zcGFuPmAsIGlkKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aXBDb21wbGV0ZShjbHMpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtQnlJZCgnbmV3VGlwcycpLmFwcGVuZENoaWxkKGNvbnRhaW5lcilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1CeUlkKGlkKS5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbHMudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyh2YWwudG9Mb3dlckNhc2UoKS5zdWJzdHIoc3BhY2VJbmRleCArIDEpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNsYXNzVGlwJykuZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcbiAgICB9KVxuICAgIGlmICgodmFsID09PSAnJykgfHwgKHZhbC5jaGFyQXQodmFsLmxlbmd0aCAtIDEpID09PSAnICcpKSB7XG4gICAgICAgIHVwZGF0ZVRpcCgnZm9yJywgJ2ZvcicsIGZhbHNlKVxuICAgICAgICB1cGRhdGVUaXAoJ2J5JywgJ2J5JywgZmFsc2UpXG4gICAgICAgIHVwZGF0ZVRpcCgnc3RhcnRpbmcnLCAnc3RhcnRpbmcnLCBmYWxzZSlcbiAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBsYXN0U3BhY2UgPSB2YWwubGFzdEluZGV4T2YoJyAnKVxuICAgICAgICBsZXQgbGFzdFdvcmQgPSBsYXN0U3BhY2UgPT09IC0xID8gdmFsIDogdmFsLnN1YnN0cihsYXN0U3BhY2UgKyAxKVxuICAgICAgICBjb25zdCB1cHBlcmNhc2UgPSBsYXN0V29yZC5jaGFyQXQoMCkgPT09IGxhc3RXb3JkLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpXG4gICAgICAgIGxhc3RXb3JkID0gbGFzdFdvcmQudG9Mb3dlckNhc2UoKVxuICAgICAgICBPYmplY3QuZW50cmllcyhUSVBfTkFNRVMpLmZvckVhY2goKFtuYW1lLCBwb3NzaWJsZV0pID0+IHtcbiAgICAgICAgICAgIGxldCBmb3VuZDogc3RyaW5nfG51bGwgPSBudWxsXG4gICAgICAgICAgICBwb3NzaWJsZS5mb3JFYWNoKChwKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHAuc2xpY2UoMCwgbGFzdFdvcmQubGVuZ3RoKSA9PT0gbGFzdFdvcmQpIHtcbiAgICAgICAgICAgICAgICAgICAgZm91bmQgPSBwXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGlmIChmb3VuZCkge1xuICAgICAgICAgICAgICAgIHVwZGF0ZVRpcChuYW1lLCBmb3VuZCwgdXBwZXJjYXNlKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlbGVtQnlJZChgdGlwJHtuYW1lfWApLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxufVxuXG5mdW5jdGlvbiB1cGRhdGVUaXAobmFtZTogc3RyaW5nLCB0eXBlZDogc3RyaW5nLCBjYXBpdGFsaXplOiBib29sZWFuKTogdm9pZCB7XG4gICAgaWYgKG5hbWUgIT09ICdmb3InICYmIG5hbWUgIT09ICdieScgJiYgbmFtZSAhPT0gJ3N0YXJ0aW5nJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgdGlwIG5hbWUnKVxuICAgIH1cblxuICAgIGNvbnN0IGVsID0gZWxlbUJ5SWQoYHRpcCR7bmFtZX1gKVxuICAgIGVsLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG4gICAgXyQoZWwucXVlcnlTZWxlY3RvcignLnR5cGVkJykpLmlubmVySFRNTCA9IChjYXBpdGFsaXplID8gY2FwaXRhbGl6ZVN0cmluZyh0eXBlZCkgOiB0eXBlZCkgKyAnLi4uJ1xuICAgIGNvbnN0IG5ld05hbWVzOiBzdHJpbmdbXSA9IFtdXG4gICAgVElQX05BTUVTW25hbWVdLmZvckVhY2goKG4pID0+IHtcbiAgICAgICAgaWYgKG4gIT09IHR5cGVkKSB7IG5ld05hbWVzLnB1c2goYDxiPiR7bn08L2I+YCkgfVxuICAgIH0pXG4gICAgXyQoZWwucXVlcnlTZWxlY3RvcignLm90aGVycycpKS5pbm5lckhUTUwgPSBuZXdOYW1lcy5sZW5ndGggPiAwID8gYFlvdSBjYW4gYWxzbyB1c2UgJHtuZXdOYW1lcy5qb2luKCcgb3IgJyl9YCA6ICcnXG59XG5cbmZ1bmN0aW9uIHRpcENvbXBsZXRlKGF1dG9jb21wbGV0ZTogc3RyaW5nKTogKGV2dDogRXZlbnQpID0+IHZvaWQge1xuICAgIHJldHVybiAoZXZ0OiBFdmVudCkgPT4ge1xuICAgICAgICBjb25zdCB2YWwgPSBuZXdUZXh0LnZhbHVlXG4gICAgICAgIGNvbnN0IGxhc3RTcGFjZSA9IHZhbC5sYXN0SW5kZXhPZignICcpXG4gICAgICAgIGNvbnN0IGxhc3RXb3JkID0gbGFzdFNwYWNlID09PSAtMSA/IDAgOiBsYXN0U3BhY2UgKyAxXG4gICAgICAgIHVwZGF0ZU5ld1RpcHMobmV3VGV4dC52YWx1ZSA9IHZhbC5zdWJzdHJpbmcoMCwgbGFzdFdvcmQpICsgYXV0b2NvbXBsZXRlICsgJyAnKVxuICAgICAgICByZXR1cm4gbmV3VGV4dC5mb2N1cygpXG4gICAgfVxufVxuXG4vLyBUaGUgZXZlbnQgbGlzdGVuZXIgaXMgdGhlbiBhZGRlZCB0byB0aGUgcHJlZXhpc3RpbmcgdGlwcy5cbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50aXAnKS5mb3JFYWNoKCh0aXApID0+IHtcbiAgICB0aXAuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aXBDb21wbGV0ZShfJCh0aXAucXVlcnlTZWxlY3RvcignLnR5cGVkJykpLmlubmVySFRNTCkpXG59KVxuIiwiaW1wb3J0IHsgVkVSU0lPTiB9IGZyb20gJy4uL2FwcCdcbmltcG9ydCB7IGVsZW1CeUlkIH0gZnJvbSAnLi4vdXRpbCdcblxuY29uc3QgRVJST1JfRk9STV9VUkwgPSAnaHR0cHM6Ly9kb2NzLmdvb2dsZS5jb20vYS9zdHVkZW50cy5oYXJrZXIub3JnL2Zvcm1zL2QvJ1xuICAgICAgICAgICAgICAgICAgICAgKyAnMXNhMmdVdFlGUGRLVDVZRU5YSUVZYXV5UlB1Y3FzUUNWYVFBUGVGM2JaNFEvdmlld2Zvcm0nXG5jb25zdCBFUlJPUl9GT1JNX0VOVFJZID0gJz9lbnRyeS4xMjAwMzYyMjM9J1xuY29uc3QgRVJST1JfR0lUSFVCX1VSTCA9ICdodHRwczovL2dpdGh1Yi5jb20vMTlSeWFuQS9DaGVja1BDUi9pc3N1ZXMvbmV3J1xuXG5jb25zdCBsaW5rQnlJZCA9IChpZDogc3RyaW5nKSA9PiBlbGVtQnlJZChpZCkgYXMgSFRNTExpbmtFbGVtZW50XG5cbi8vICpkaXNwbGF5RXJyb3IqIGRpc3BsYXlzIGEgZGlhbG9nIGNvbnRhaW5pbmcgaW5mb3JtYXRpb24gYWJvdXQgYW4gZXJyb3IuXG5leHBvcnQgZnVuY3Rpb24gZGlzcGxheUVycm9yKGU6IEVycm9yKTogdm9pZCB7XG4gICAgY29uc29sZS5sb2coJ0Rpc3BsYXlpbmcgZXJyb3InLCBlKVxuICAgIGNvbnN0IGVycm9ySFRNTCA9IGBNZXNzYWdlOiAke2UubWVzc2FnZX1cXG5TdGFjazogJHtlLnN0YWNrIHx8IChlIGFzIGFueSkubGluZU51bWJlcn1cXG5gXG4gICAgICAgICAgICAgICAgICAgICsgYEJyb3dzZXI6ICR7bmF2aWdhdG9yLnVzZXJBZ2VudH1cXG5WZXJzaW9uOiAke1ZFUlNJT059YFxuICAgIGVsZW1CeUlkKCdlcnJvckNvbnRlbnQnKS5pbm5lckhUTUwgPSBlcnJvckhUTUwucmVwbGFjZSgnXFxuJywgJzxicj4nKVxuICAgIGxpbmtCeUlkKCdlcnJvckdvb2dsZScpLmhyZWYgPSBFUlJPUl9GT1JNX1VSTCArIEVSUk9SX0ZPUk1fRU5UUlkgKyBlbmNvZGVVUklDb21wb25lbnQoZXJyb3JIVE1MKVxuICAgIGxpbmtCeUlkKCdlcnJvckdpdEh1YicpLmhyZWYgPVxuICAgICAgICBFUlJPUl9HSVRIVUJfVVJMICsgJz9ib2R5PScgKyBlbmNvZGVVUklDb21wb25lbnQoYEkndmUgZW5jb3VudGVyZWQgYW4gYnVnLlxcblxcblxcYFxcYFxcYFxcbiR7ZXJyb3JIVE1MfVxcblxcYFxcYFxcYGApXG4gICAgZWxlbUJ5SWQoJ2Vycm9yQmFja2dyb3VuZCcpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXG4gICAgcmV0dXJuIGVsZW1CeUlkKCdlcnJvcicpLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG59XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIChldnQpID0+IHtcbiAgICBldnQucHJldmVudERlZmF1bHQoKVxuICAgIGRpc3BsYXlFcnJvcihldnQuZXJyb3IpXG59KVxuIiwiaW1wb3J0IHsgXyQsIGFuaW1hdGVFbCB9IGZyb20gJy4uL3V0aWwnXG5cbi8vIEZvciBsaXN0IHZpZXcsIHRoZSBhc3NpZ25tZW50cyBjYW4ndCBiZSBvbiB0b3Agb2YgZWFjaCBvdGhlci5cbi8vIFRoZXJlZm9yZSwgYSBsaXN0ZW5lciBpcyBhdHRhY2hlZCB0byB0aGUgcmVzaXppbmcgb2YgdGhlIGJyb3dzZXIgd2luZG93LlxubGV0IHRpY2tpbmcgPSBmYWxzZVxubGV0IHRpbWVvdXRJZDogbnVtYmVyfG51bGwgPSBudWxsXG5leHBvcnQgZnVuY3Rpb24gZ2V0UmVzaXplQXNzaWdubWVudHMoKTogSFRNTEVsZW1lbnRbXSB7XG4gICAgY29uc3QgYXNzaWdubWVudHMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuY29udGFpbnMoJ3Nob3dEb25lJykgP1xuICAgICAgICAnLmFzc2lnbm1lbnQubGlzdERpc3AnIDogJy5hc3NpZ25tZW50Lmxpc3REaXNwOm5vdCguZG9uZSknKSlcbiAgICBhc3NpZ25tZW50cy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgIGNvbnN0IGFkID0gYS5jbGFzc0xpc3QuY29udGFpbnMoJ2RvbmUnKVxuICAgICAgICBjb25zdCBiZCA9IGIuY2xhc3NMaXN0LmNvbnRhaW5zKCdkb25lJylcbiAgICAgICAgaWYgKGFkICYmICFiZCkgeyByZXR1cm4gMSB9XG4gICAgICAgIGlmIChiZCAmJiAhYWQpIHsgcmV0dXJuIC0xIH1cbiAgICAgICAgcmV0dXJuIE51bWJlcigoYS5xdWVyeVNlbGVjdG9yKCcuZHVlJykgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWUpXG4gICAgICAgICAgICAgLSBOdW1iZXIoKGIucXVlcnlTZWxlY3RvcignLmR1ZScpIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlKVxuICAgIH0pXG4gICAgcmV0dXJuIGFzc2lnbm1lbnRzIGFzIEhUTUxFbGVtZW50W11cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlc2l6ZUNhbGxlcigpOiB2b2lkIHtcbiAgICBpZiAoIXRpY2tpbmcpIHtcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlc2l6ZSlcbiAgICAgICAgdGlja2luZyA9IHRydWVcbiAgICB9XG59XG5cbmxldCBsYXN0Q29sdW1uczogbnVtYmVyfG51bGwgPSBudWxsXG5sZXQgbGFzdEFzc2lnbm1lbnRzOiBudW1iZXJ8bnVsbCA9IG51bGxcbmxldCBsYXN0RG9uZUNvdW50OiBudW1iZXJ8bnVsbCA9IG51bGxcblxuZXhwb3J0IGZ1bmN0aW9uIHJlc2l6ZSgpOiB2b2lkIHtcbiAgICB0aWNraW5nID0gdHJ1ZVxuICAgIC8vIFRvIGNhbGN1bGF0ZSB0aGUgbnVtYmVyIG9mIGNvbHVtbnMsIHRoZSBiZWxvdyBhbGdvcml0aG0gaXMgdXNlZCBiZWNhc2UgYXMgdGhlIHNjcmVlbiBzaXplXG4gICAgLy8gaW5jcmVhc2VzLCB0aGUgY29sdW1uIHdpZHRoIGluY3JlYXNlc1xuICAgIGNvbnN0IHdpZHRocyA9IGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKCdzaG93SW5mbycpID9cbiAgICAgICAgWzY1MCwgMTEwMCwgMTgwMCwgMjcwMCwgMzgwMCwgNTEwMF0gOiBbMzUwLCA4MDAsIDE1MDAsIDI0MDAsIDM1MDAsIDQ4MDBdXG4gICAgbGV0IGNvbHVtbnMgPSAxXG4gICAgd2lkdGhzLmZvckVhY2goKHcsIGluZGV4KSA9PiB7XG4gICAgICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA+IHcpIHsgY29sdW1ucyA9IGluZGV4ICsgMSB9XG4gICAgfSlcblxuICAgIGNvbnN0IGNvbHVtbkhlaWdodHMgPSBBcnJheS5mcm9tKG5ldyBBcnJheShjb2x1bW5zKSwgKCkgPT4gMClcbiAgICBjb25zdCBjY2g6IG51bWJlcltdID0gW11cbiAgICBjb25zdCBhc3NpZ25tZW50cyA9IGdldFJlc2l6ZUFzc2lnbm1lbnRzKClcbiAgICBjb25zdCBkb25lQ291bnQgPSBhc3NpZ25tZW50cy5maWx0ZXIoKGEpID0+IGEuY2xhc3NMaXN0LmNvbnRhaW5zKCdkb25lJykpLmxlbmd0aFxuICAgIGFzc2lnbm1lbnRzLmZvckVhY2goKGFzc2lnbm1lbnQsIG4pID0+IHtcbiAgICAgICAgY29uc3QgY29sID0gbiAlIGNvbHVtbnNcbiAgICAgICAgY2NoLnB1c2goY29sdW1uSGVpZ2h0c1tjb2xdKVxuICAgICAgICBjb2x1bW5IZWlnaHRzW2NvbF0gKz0gYXNzaWdubWVudC5vZmZzZXRIZWlnaHQgKyAyNFxuICAgIH0pXG4gICAgYXNzaWdubWVudHMuZm9yRWFjaCgoYXNzaWdubWVudCwgbikgPT4ge1xuICAgICAgICBjb25zdCBjb2wgPSBuICUgY29sdW1uc1xuICAgICAgICBhc3NpZ25tZW50LnN0eWxlLnRvcCA9IGNjaFtuXSArICdweCdcbiAgICAgICAgaWYgKGNvbHVtbnMgIT09IGxhc3RDb2x1bW5zIHx8IGFzc2lnbm1lbnRzLmxlbmd0aCAhPT0gbGFzdEFzc2lnbm1lbnRzIHx8IGRvbmVDb3VudCAhPT0gbGFzdERvbmVDb3VudCkge1xuICAgICAgICAgICAgY29uc3QgbGVmdCA9ICgoMTAwIC8gY29sdW1ucykgKiBjb2wpICsgJyUnXG4gICAgICAgICAgICBjb25zdCByaWdodCA9ICgoMTAwIC8gY29sdW1ucykgKiAoY29sdW1ucyAtIGNvbCAtIDEpKSArICclJ1xuICAgICAgICAgICAgaWYgKGxhc3RDb2x1bW5zID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgYXNzaWdubWVudC5zdHlsZS5sZWZ0ID0gbGVmdFxuICAgICAgICAgICAgICAgIGFzc2lnbm1lbnQuc3R5bGUucmlnaHQgPSByaWdodFxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhbmltYXRlRWwoYXNzaWdubWVudCwgW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiBhc3NpZ25tZW50LnN0eWxlLmxlZnQgfHwgbGVmdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJpZ2h0OiBhc3NpZ25tZW50LnN0eWxlLnJpZ2h0IHx8IHJpZ2h0XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgbGVmdCwgcmlnaHQgfVxuICAgICAgICAgICAgICAgIF0sIHsgZHVyYXRpb246IDMwMCB9KS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgYXNzaWdubWVudC5zdHlsZS5sZWZ0ID0gbGVmdFxuICAgICAgICAgICAgICAgICAgICBhc3NpZ25tZW50LnN0eWxlLnJpZ2h0ID0gcmlnaHRcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSlcbiAgICBpZiAodGltZW91dElkKSBjbGVhclRpbWVvdXQodGltZW91dElkKVxuICAgIHRpbWVvdXRJZCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBjY2gubGVuZ3RoID0gMFxuICAgICAgICBhc3NpZ25tZW50cy5mb3JFYWNoKChhc3NpZ25tZW50LCBuKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjb2wgPSBuICUgY29sdW1uc1xuICAgICAgICAgICAgaWYgKG4gPCBjb2x1bW5zKSB7XG4gICAgICAgICAgICAgICAgY29sdW1uSGVpZ2h0c1tjb2xdID0gMFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2NoLnB1c2goY29sdW1uSGVpZ2h0c1tjb2xdKVxuICAgICAgICAgICAgY29sdW1uSGVpZ2h0c1tjb2xdICs9IGFzc2lnbm1lbnQub2Zmc2V0SGVpZ2h0ICsgMjRcbiAgICAgICAgfSlcbiAgICAgICAgYXNzaWdubWVudHMuZm9yRWFjaCgoYXNzaWdubWVudCwgbikgPT4ge1xuICAgICAgICAgICAgYXNzaWdubWVudC5zdHlsZS50b3AgPSBjY2hbbl0gKyAncHgnXG4gICAgICAgIH0pXG4gICAgfSwgNTAwKVxuICAgIGxhc3RDb2x1bW5zID0gY29sdW1uc1xuICAgIGxhc3RBc3NpZ25tZW50cyA9IGFzc2lnbm1lbnRzLmxlbmd0aFxuICAgIGxhc3REb25lQ291bnQgPSBkb25lQ291bnRcbiAgICB0aWNraW5nID0gZmFsc2Vcbn1cbiIsIi8qKlxuICogQWxsIHRoaXMgaXMgcmVzcG9uc2libGUgZm9yIGlzIGNyZWF0aW5nIHNuYWNrYmFycy5cbiAqL1xuXG5pbXBvcnQgeyBlbGVtZW50LCBmb3JjZUxheW91dCB9IGZyb20gJy4uL3V0aWwnXG5cbi8qKlxuICogQ3JlYXRlcyBhIHNuYWNrYmFyIHdpdGhvdXQgYW4gYWN0aW9uXG4gKiBAcGFyYW0gbWVzc2FnZSBUaGUgc25hY2tiYXIncyBtZXNzYWdlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzbmFja2JhcihtZXNzYWdlOiBzdHJpbmcpOiB2b2lkXG4vKipcbiAqIENyZWF0ZXMgYSBzbmFja2JhciB3aXRoIGFuIGFjdGlvblxuICogQHBhcmFtIG1lc3NhZ2UgVGhlIHNuYWNrYmFyJ3MgbWVzc2FnZVxuICogQHBhcmFtIGFjdGlvbiBPcHRpb25hbCB0ZXh0IHRvIHNob3cgYXMgYSBtZXNzYWdlIGFjdGlvblxuICogQHBhcmFtIGYgICAgICBBIGZ1bmN0aW9uIHRvIGV4ZWN1dGUgd2hlbiB0aGUgYWN0aW9uIGlzIGNsaWNrZWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNuYWNrYmFyKG1lc3NhZ2U6IHN0cmluZywgYWN0aW9uOiBzdHJpbmcsIGY6ICgpID0+IHZvaWQpOiB2b2lkXG5leHBvcnQgZnVuY3Rpb24gc25hY2tiYXIobWVzc2FnZTogc3RyaW5nLCBhY3Rpb24/OiBzdHJpbmcsIGY/OiAoKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgY29uc3Qgc25hY2sgPSBlbGVtZW50KCdkaXYnLCAnc25hY2tiYXInKVxuICAgIGNvbnN0IHNuYWNrSW5uZXIgPSBlbGVtZW50KCdkaXYnLCAnc25hY2tJbm5lcicsIG1lc3NhZ2UpXG4gICAgc25hY2suYXBwZW5kQ2hpbGQoc25hY2tJbm5lcilcblxuICAgIGlmICgoYWN0aW9uICE9IG51bGwpICYmIChmICE9IG51bGwpKSB7XG4gICAgICAgIGNvbnN0IGFjdGlvbkUgPSBlbGVtZW50KCdhJywgW10sIGFjdGlvbilcbiAgICAgICAgYWN0aW9uRS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgIHNuYWNrLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gICAgICAgICAgICBmKClcbiAgICAgICAgfSlcbiAgICAgICAgc25hY2tJbm5lci5hcHBlbmRDaGlsZChhY3Rpb25FKVxuICAgIH1cblxuICAgIGNvbnN0IGFkZCA9ICgpID0+IHtcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc25hY2spXG4gICAgICBmb3JjZUxheW91dChzbmFjaylcbiAgICAgIHNuYWNrLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBzbmFjay5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gc25hY2sucmVtb3ZlKCksIDkwMClcbiAgICAgIH0sIDUwMDApXG4gICAgfVxuXG4gICAgY29uc3QgZXhpc3RpbmcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc25hY2tiYXInKVxuICAgIGlmIChleGlzdGluZyAhPSBudWxsKSB7XG4gICAgICAgIGV4aXN0aW5nLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gICAgICAgIHNldFRpbWVvdXQoYWRkLCAzMDApXG4gICAgfSBlbHNlIHtcbiAgICAgICAgYWRkKClcbiAgICB9XG59XG4iLCJcbi8qKlxuICogQ29va2llIGZ1bmN0aW9ucyAoYSBjb29raWUgaXMgYSBzbWFsbCB0ZXh0IGRvY3VtZW50IHRoYXQgdGhlIGJyb3dzZXIgY2FuIHJlbWVtYmVyKVxuICovXG5cbi8qKlxuICogUmV0cmlldmVzIGEgY29va2llXG4gKiBAcGFyYW0gY25hbWUgdGhlIG5hbWUgb2YgdGhlIGNvb2tpZSB0byByZXRyaWV2ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29va2llKGNuYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IG5hbWUgPSBjbmFtZSArICc9J1xuICAgIGNvbnN0IGNvb2tpZVBhcnQgPSBkb2N1bWVudC5jb29raWUuc3BsaXQoJzsnKS5maW5kKChjKSA9PiBjLmluY2x1ZGVzKG5hbWUpKVxuICAgIGlmIChjb29raWVQYXJ0KSByZXR1cm4gY29va2llUGFydC5zdWJzdHJpbmcobmFtZS5sZW5ndGgpXG4gICAgcmV0dXJuICcnIC8vIEJsYW5rIGlmIGNvb2tpZSBub3QgZm91bmRcbiAgfVxuXG4vKiogU2V0cyB0aGUgdmFsdWUgb2YgYSBjb29raWVcbiAqIEBwYXJhbSBjbmFtZSB0aGUgbmFtZSBvZiB0aGUgY29va2llIHRvIHNldFxuICogQHBhcmFtIGN2YWx1ZSB0aGUgdmFsdWUgdG8gc2V0IHRoZSBjb29raWUgdG9cbiAqIEBwYXJhbSBleGRheXMgdGhlIG51bWJlciBvZiBkYXlzIHRoYXQgdGhlIGNvb2tpZSB3aWxsIGV4cGlyZSBpbiAoYW5kIG5vdCBiZSBleGlzdGVudCBhbnltb3JlKVxuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0Q29va2llKGNuYW1lOiBzdHJpbmcsIGN2YWx1ZTogc3RyaW5nLCBleGRheXM6IG51bWJlcik6IHZvaWQge1xuICAgIGNvbnN0IGQgPSBuZXcgRGF0ZSgpXG4gICAgZC5zZXRUaW1lKGQuZ2V0VGltZSgpICsgKGV4ZGF5cyAqIDI0ICogNjAgKiA2MCAqIDEwMDApKVxuICAgIGNvbnN0IGV4cGlyZXMgPSBgZXhwaXJlcz0ke2QudG9VVENTdHJpbmcoKX1gXG4gICAgZG9jdW1lbnQuY29va2llID0gY25hbWUgKyAnPScgKyBjdmFsdWUgKyAnOyAnICsgZXhwaXJlc1xuICB9XG5cbi8qKlxuICogRGVsZXRzIGEgY29va2llXG4gKiBAcGFyYW0gY25hbWUgdGhlIG5hbWUgb2YgdGhlIGNvb2tpZSB0byBkZWxldGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlbGV0ZUNvb2tpZShjbmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICAgLy8gVGhpcyBpcyBsaWtlICpzZXRDb29raWUqLCBidXQgc2V0cyB0aGUgZXhwaXJ5IGRhdGUgdG8gc29tZXRoaW5nIGluIHRoZSBwYXN0IHNvIHRoZSBjb29raWUgaXMgZGVsZXRlZC5cbiAgICBkb2N1bWVudC5jb29raWUgPSBjbmFtZSArICc9OyBleHBpcmVzPVRodSwgMDEgSmFuIDE5NzAgMDA6MDA6MDEgR01UOydcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiB0em9mZigpOiBudW1iZXIge1xuICAgIHJldHVybiAobmV3IERhdGUoKSkuZ2V0VGltZXpvbmVPZmZzZXQoKSAqIDEwMDAgKiA2MCAvLyBGb3IgZnV0dXJlIGNhbGN1bGF0aW9uc1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9EYXRlTnVtKGRhdGU6IERhdGV8bnVtYmVyKTogbnVtYmVyIHtcbiAgICBjb25zdCBudW0gPSBkYXRlIGluc3RhbmNlb2YgRGF0ZSA/IGRhdGUuZ2V0VGltZSgpIDogZGF0ZVxuICAgIHJldHVybiBNYXRoLmZsb29yKChudW0gLSB0em9mZigpKSAvIDEwMDAgLyAzNjAwIC8gMjQpXG59XG5cbi8vICpGcm9tRGF0ZU51bSogY29udmVydHMgYSBudW1iZXIgb2YgZGF5cyB0byBhIG51bWJlciBvZiBzZWNvbmRzXG5leHBvcnQgZnVuY3Rpb24gZnJvbURhdGVOdW0oZGF5czogbnVtYmVyKTogRGF0ZSB7XG4gICAgY29uc3QgZCA9IG5ldyBEYXRlKChkYXlzICogMTAwMCAqIDM2MDAgKiAyNCkgKyB0em9mZigpKVxuICAgIC8vIFRoZSBjaGVja3MgYmVsb3cgYXJlIHRvIGhhbmRsZSBkYXlsaWdodCBzYXZpbmdzIHRpbWVcbiAgICBpZiAoZC5nZXRIb3VycygpID09PSAxKSB7IGQuc2V0SG91cnMoMCkgfVxuICAgIGlmICgoZC5nZXRIb3VycygpID09PSAyMikgfHwgKGQuZ2V0SG91cnMoKSA9PT0gMjMpKSB7XG4gICAgICBkLnNldEhvdXJzKDI0KVxuICAgICAgZC5zZXRNaW51dGVzKDApXG4gICAgICBkLnNldFNlY29uZHMoMClcbiAgICB9XG4gICAgcmV0dXJuIGRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvZGF5KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRvRGF0ZU51bShuZXcgRGF0ZSgpKVxufVxuXG4vKipcbiAqIEl0ZXJhdGVzIGZyb20gdGhlIHN0YXJ0aW5nIGRhdGUgdG8gZW5kaW5nIGRhdGUgaW5jbHVzaXZlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpdGVyRGF5cyhzdGFydDogRGF0ZSwgZW5kOiBEYXRlLCBjYjogKGRhdGU6IERhdGUpID0+IHZvaWQpOiB2b2lkIHtcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmUgbm8tbG9vcHNcbiAgICBmb3IgKGNvbnN0IGQgPSBuZXcgRGF0ZShzdGFydCk7IGQgPD0gZW5kOyBkLnNldERhdGUoZC5nZXREYXRlKCkgKyAxKSkge1xuICAgICAgICBjYihkKVxuICAgIH1cbn1cbiIsImltcG9ydCB7IGNvbXB1dGVXZWVrSWQsIGNyZWF0ZUFzc2lnbm1lbnQsIGdldEVTLCBzZXBhcmF0ZWRDbGFzcyB9IGZyb20gJy4vY29tcG9uZW50cy9hc3NpZ25tZW50J1xuaW1wb3J0IHsgY3JlYXRlRGF5LCBjcmVhdGVXZWVrIH0gZnJvbSAnLi9jb21wb25lbnRzL2NhbGVuZGFyJ1xuaW1wb3J0IHsgZGlzcGxheUVycm9yIH0gZnJvbSAnLi9jb21wb25lbnRzL2Vycm9yRGlzcGxheSdcbmltcG9ydCB7IHJlc2l6ZSB9IGZyb20gJy4vY29tcG9uZW50cy9yZXNpemVyJ1xuaW1wb3J0IHsgZnJvbURhdGVOdW0sIGl0ZXJEYXlzLCB0b2RheSB9IGZyb20gJy4vZGF0ZXMnXG5pbXBvcnQgeyBjbGFzc0J5SWQsIGdldERhdGEsIElBcHBsaWNhdGlvbkRhdGEsIElBc3NpZ25tZW50IH0gZnJvbSAnLi9wY3InXG5pbXBvcnQgeyBhZGRBY3Rpdml0eSwgc2F2ZUFjdGl2aXR5IH0gZnJvbSAnLi9wbHVnaW5zL2FjdGl2aXR5J1xuaW1wb3J0IHsgZXh0cmFUb1Rhc2ssIGdldEV4dHJhLCBJQ3VzdG9tQXNzaWdubWVudCB9IGZyb20gJy4vcGx1Z2lucy9jdXN0b21Bc3NpZ25tZW50cydcbmltcG9ydCB7IGFzc2lnbm1lbnRJbkRvbmUsIHJlbW92ZUZyb21Eb25lLCBzYXZlRG9uZSB9IGZyb20gJy4vcGx1Z2lucy9kb25lJ1xuaW1wb3J0IHsgYXNzaWdubWVudEluTW9kaWZpZWQsIHJlbW92ZUZyb21Nb2RpZmllZCwgc2F2ZU1vZGlmaWVkIH0gZnJvbSAnLi9wbHVnaW5zL21vZGlmaWVkQXNzaWdubWVudHMnXG5pbXBvcnQgeyBzZXR0aW5ncyB9IGZyb20gJy4vc2V0dGluZ3MnXG5pbXBvcnQgeyBfJCwgZGF0ZVN0cmluZywgZWxlbUJ5SWQsIGVsZW1lbnQsIGxvY2FsU3RvcmFnZVJlYWQsIHNtb290aFNjcm9sbCB9IGZyb20gJy4vdXRpbCdcbmltcG9ydCB7IGdldENhbERhdGVPZmZzZXQgfSBmcm9tICcuL25hdmlnYXRpb24nO1xuXG5leHBvcnQgaW50ZXJmYWNlIElTcGxpdEFzc2lnbm1lbnQge1xuICAgIGFzc2lnbm1lbnQ6IElBc3NpZ25tZW50XG4gICAgc3RhcnQ6IERhdGVcbiAgICBlbmQ6IERhdGV8J0ZvcmV2ZXInXG4gICAgY3VzdG9tOiBib29sZWFuXG4gICAgcmVmZXJlbmNlPzogSUN1c3RvbUFzc2lnbm1lbnRcbn1cblxuY29uc3QgU0NIRURVTEVfRU5EUyA9IHtcbiAgICBkYXk6IChkYXRlOiBEYXRlKSA9PiAyNCAqIDM2MDAgKiAxMDAwLFxuICAgIG1zOiAoZGF0ZTogRGF0ZSkgPT4gWzI0LCAgICAgICAgICAgICAgLy8gU3VuZGF5XG4gICAgICAgICAgICAgICAgICAgICAgICAgMTUgKyAoMzUgLyA2MCksICAvLyBNb25kYXlcbiAgICAgICAgICAgICAgICAgICAgICAgICAxNSArICgzNSAvIDYwKSwgIC8vIFR1ZXNkYXlcbiAgICAgICAgICAgICAgICAgICAgICAgICAxNSArICgxNSAvIDYwKSwgIC8vIFdlZG5lc2RheVxuICAgICAgICAgICAgICAgICAgICAgICAgIDE1ICsgKDE1IC8gNjApLCAgLy8gVGh1cnNkYXlcbiAgICAgICAgICAgICAgICAgICAgICAgICAxNSArICgxNSAvIDYwKSwgIC8vIEZyaWRheVxuICAgICAgICAgICAgICAgICAgICAgICAgIDI0ICAgICAgICAgICAgICAgLy8gU2F0dXJkYXlcbiAgICAgICAgICAgICAgICAgICAgICAgIF1bZGF0ZS5nZXREYXkoKV0sXG4gICAgdXM6IChkYXRlOiBEYXRlKSA9PiAxNSAqIDM2MDAgKiAxMDAwXG59XG5jb25zdCBXRUVLRU5EX0NMQVNTTkFNRVMgPSBbJ2Zyb21XZWVrZW5kJywgJ292ZXJXZWVrZW5kJ11cblxubGV0IHNjcm9sbCA9IDAgLy8gVGhlIGxvY2F0aW9uIHRvIHNjcm9sbCB0byBpbiBvcmRlciB0byByZWFjaCB0b2RheSBpbiBjYWxlbmRhciB2aWV3XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTY3JvbGwoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gc2Nyb2xsXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRUaW1lQWZ0ZXIoZGF0ZTogRGF0ZSk6IG51bWJlciB7XG4gICAgY29uc3QgaGlkZUFzc2lnbm1lbnRzID0gc2V0dGluZ3MuaGlkZUFzc2lnbm1lbnRzXG4gICAgaWYgKGhpZGVBc3NpZ25tZW50cyA9PT0gJ2RheScgfHwgaGlkZUFzc2lnbm1lbnRzID09PSAnbXMnIHx8IGhpZGVBc3NpZ25tZW50cyA9PT0gJ3VzJykge1xuICAgICAgICByZXR1cm4gU0NIRURVTEVfRU5EU1toaWRlQXNzaWdubWVudHNdKGRhdGUpXG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFNDSEVEVUxFX0VORFMuZGF5KGRhdGUpXG4gICAgfVxufVxuXG5mdW5jdGlvbiBnZXRTdGFydEVuZERhdGVzKGRhdGE6IElBcHBsaWNhdGlvbkRhdGEpOiB7c3RhcnQ6IERhdGUsIGVuZDogRGF0ZSB9IHtcbiAgICBpZiAoZGF0YS5tb250aFZpZXcpIHtcbiAgICAgICAgY29uc3Qgc3RhcnROID0gTWF0aC5taW4oLi4uZGF0YS5hc3NpZ25tZW50cy5tYXAoKGEpID0+IGEuc3RhcnQpKSAvLyBTbWFsbGVzdCBkYXRlXG4gICAgICAgIGNvbnN0IGVuZE4gPSBNYXRoLm1heCguLi5kYXRhLmFzc2lnbm1lbnRzLm1hcCgoYSkgPT4gYS5zdGFydCkpIC8vIExhcmdlc3QgZGF0ZVxuXG4gICAgICAgIGNvbnN0IHllYXIgPSAobmV3IERhdGUoKSkuZ2V0RnVsbFllYXIoKSAvLyBGb3IgZnV0dXJlIGNhbGN1bGF0aW9uc1xuXG4gICAgICAgIC8vIENhbGN1bGF0ZSB3aGF0IG1vbnRoIHdlIHdpbGwgYmUgZGlzcGxheWluZyBieSBmaW5kaW5nIHRoZSBtb250aCBvZiB0b2RheVxuICAgICAgICBjb25zdCBtb250aCA9IChuZXcgRGF0ZSgpKS5nZXRNb250aCgpICsgZ2V0Q2FsRGF0ZU9mZnNldCgpXG5cbiAgICAgICAgLy8gTWFrZSBzdXJlIHRoZSBzdGFydCBhbmQgZW5kIGRhdGVzIGxpZSB3aXRoaW4gdGhlIG1vbnRoXG4gICAgICAgIGNvbnN0IHN0YXJ0ID0gbmV3IERhdGUoTWF0aC5tYXgoZnJvbURhdGVOdW0oc3RhcnROKS5nZXRUaW1lKCksIChuZXcgRGF0ZSh5ZWFyLCBtb250aCkpLmdldFRpbWUoKSkpXG4gICAgICAgIC8vIElmIHRoZSBkYXkgYXJndW1lbnQgZm9yIERhdGUgaXMgMCwgdGhlbiB0aGUgcmVzdWx0aW5nIGRhdGUgd2lsbCBiZSBvZiB0aGUgcHJldmlvdXMgbW9udGhcbiAgICAgICAgY29uc3QgZW5kID0gbmV3IERhdGUoTWF0aC5taW4oZnJvbURhdGVOdW0oZW5kTikuZ2V0VGltZSgpLCAobmV3IERhdGUoeWVhciwgbW9udGggKyAxLCAwKSkuZ2V0VGltZSgpKSlcbiAgICAgICAgcmV0dXJuIHsgc3RhcnQsIGVuZCB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCB0b2RheVNFID0gbmV3IERhdGUoKVxuICAgICAgICBjb25zdCBzdGFydCA9IG5ldyBEYXRlKHRvZGF5U0UuZ2V0RnVsbFllYXIoKSwgdG9kYXlTRS5nZXRNb250aCgpLCB0b2RheVNFLmdldERhdGUoKSlcbiAgICAgICAgY29uc3QgZW5kID0gbmV3IERhdGUodG9kYXlTRS5nZXRGdWxsWWVhcigpLCB0b2RheVNFLmdldE1vbnRoKCksIHRvZGF5U0UuZ2V0RGF0ZSgpKVxuICAgICAgICByZXR1cm4geyBzdGFydCwgZW5kIH1cbiAgICAgIH1cbn1cblxuZnVuY3Rpb24gZ2V0QXNzaWdubWVudFNwbGl0cyhhc3NpZ25tZW50OiBJQXNzaWdubWVudCwgc3RhcnQ6IERhdGUsIGVuZDogRGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVmZXJlbmNlPzogSUN1c3RvbUFzc2lnbm1lbnQpOiBJU3BsaXRBc3NpZ25tZW50W10ge1xuICAgIGNvbnN0IHNwbGl0OiBJU3BsaXRBc3NpZ25tZW50W10gPSBbXVxuICAgIGlmIChzZXR0aW5ncy5hc3NpZ25tZW50U3BhbiA9PT0gJ211bHRpcGxlJykge1xuICAgICAgICBjb25zdCBzID0gTWF0aC5tYXgoc3RhcnQuZ2V0VGltZSgpLCBmcm9tRGF0ZU51bShhc3NpZ25tZW50LnN0YXJ0KS5nZXRUaW1lKCkpXG4gICAgICAgIGNvbnN0IGUgPSBhc3NpZ25tZW50LmVuZCA9PT0gJ0ZvcmV2ZXInID8gcyA6IE1hdGgubWluKGVuZC5nZXRUaW1lKCksIGZyb21EYXRlTnVtKGFzc2lnbm1lbnQuZW5kKS5nZXRUaW1lKCkpXG4gICAgICAgIGNvbnN0IHNwYW4gPSAoKGUgLSBzKSAvIDEwMDAgLyAzNjAwIC8gMjQpICsgMSAvLyBOdW1iZXIgb2YgZGF5cyBhc3NpZ25tZW50IHRha2VzIHVwXG4gICAgICAgIGNvbnN0IHNwYW5SZWxhdGl2ZSA9IDYgLSAobmV3IERhdGUocykpLmdldERheSgpIC8vIE51bWJlciBvZiBkYXlzIHVudGlsIHRoZSBuZXh0IFNhdHVyZGF5XG5cbiAgICAgICAgY29uc3QgbnMgPSBuZXcgRGF0ZShzKVxuICAgICAgICBucy5zZXREYXRlKG5zLmdldERhdGUoKSArIHNwYW5SZWxhdGl2ZSkgLy8gIFRoZSBkYXRlIG9mIHRoZSBuZXh0IFNhdHVyZGF5XG5cbiAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lIG5vLWxvb3BzXG4gICAgICAgIGZvciAobGV0IG4gPSAtNjsgbiA8IHNwYW4gLSBzcGFuUmVsYXRpdmU7IG4gKz0gNykge1xuICAgICAgICAgICAgY29uc3QgbGFzdFN1biA9IG5ldyBEYXRlKG5zKVxuICAgICAgICAgICAgbGFzdFN1bi5zZXREYXRlKGxhc3RTdW4uZ2V0RGF0ZSgpICsgbilcblxuICAgICAgICAgICAgY29uc3QgbmV4dFNhdCA9IG5ldyBEYXRlKGxhc3RTdW4pXG4gICAgICAgICAgICBuZXh0U2F0LnNldERhdGUobmV4dFNhdC5nZXREYXRlKCkgKyA2KVxuICAgICAgICAgICAgc3BsaXQucHVzaCh7XG4gICAgICAgICAgICAgICAgYXNzaWdubWVudCxcbiAgICAgICAgICAgICAgICBzdGFydDogbmV3IERhdGUoTWF0aC5tYXgocywgbGFzdFN1bi5nZXRUaW1lKCkpKSxcbiAgICAgICAgICAgICAgICBlbmQ6IG5ldyBEYXRlKE1hdGgubWluKGUsIG5leHRTYXQuZ2V0VGltZSgpKSksXG4gICAgICAgICAgICAgICAgY3VzdG9tOiBCb29sZWFuKHJlZmVyZW5jZSksXG4gICAgICAgICAgICAgICAgcmVmZXJlbmNlXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfSBlbHNlIGlmIChzZXR0aW5ncy5hc3NpZ25tZW50U3BhbiA9PT0gJ3N0YXJ0Jykge1xuICAgICAgICBjb25zdCBzID0gZnJvbURhdGVOdW0oYXNzaWdubWVudC5zdGFydClcbiAgICAgICAgaWYgKHMuZ2V0VGltZSgpID49IHN0YXJ0LmdldFRpbWUoKSkge1xuICAgICAgICAgICAgc3BsaXQucHVzaCh7XG4gICAgICAgICAgICAgICAgYXNzaWdubWVudCxcbiAgICAgICAgICAgICAgICBzdGFydDogcyxcbiAgICAgICAgICAgICAgICBlbmQ6IHMsXG4gICAgICAgICAgICAgICAgY3VzdG9tOiBCb29sZWFuKHJlZmVyZW5jZSksXG4gICAgICAgICAgICAgICAgcmVmZXJlbmNlXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfSBlbHNlIGlmIChzZXR0aW5ncy5hc3NpZ25tZW50U3BhbiA9PT0gJ2VuZCcpIHtcbiAgICAgICAgY29uc3QgZSA9IGFzc2lnbm1lbnQuZW5kID09PSAnRm9yZXZlcicgPyBhc3NpZ25tZW50LmVuZCA6IGZyb21EYXRlTnVtKGFzc2lnbm1lbnQuZW5kKVxuICAgICAgICBjb25zdCBkZSA9IGUgPT09ICdGb3JldmVyJyA/IGZyb21EYXRlTnVtKGFzc2lnbm1lbnQuc3RhcnQpIDogZVxuICAgICAgICBpZiAoZGUuZ2V0VGltZSgpIDw9IGVuZC5nZXRUaW1lKCkpIHtcbiAgICAgICAgICAgIHNwbGl0LnB1c2goe1xuICAgICAgICAgICAgICAgIGFzc2lnbm1lbnQsXG4gICAgICAgICAgICAgICAgc3RhcnQ6IGRlLFxuICAgICAgICAgICAgICAgIGVuZDogZSxcbiAgICAgICAgICAgICAgICBjdXN0b206IEJvb2xlYW4ocmVmZXJlbmNlKSxcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gc3BsaXRcbn1cblxuLy8gVGhpcyBmdW5jdGlvbiB3aWxsIGNvbnZlcnQgdGhlIGFycmF5IG9mIGFzc2lnbm1lbnRzIGdlbmVyYXRlZCBieSAqcGFyc2UqIGludG8gcmVhZGFibGUgSFRNTC5cbmV4cG9ydCBmdW5jdGlvbiBkaXNwbGF5KGRvU2Nyb2xsOiBib29sZWFuID0gdHJ1ZSk6IHZvaWQge1xuICAgIGNvbnNvbGUudGltZSgnRGlzcGxheWluZyBkYXRhJylcbiAgICB0cnkge1xuICAgICAgICBjb25zdCBkYXRhID0gZ2V0RGF0YSgpXG4gICAgICAgIGlmICghZGF0YSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdEYXRhIHNob3VsZCBoYXZlIGJlZW4gZmV0Y2hlZCBiZWZvcmUgZGlzcGxheSgpIHdhcyBjYWxsZWQnKVxuICAgICAgICB9XG5cbiAgICAgICAgZG9jdW1lbnQuYm9keS5zZXRBdHRyaWJ1dGUoJ2RhdGEtcGNydmlldycsIGRhdGEubW9udGhWaWV3ID8gJ21vbnRoJyA6ICdvdGhlcicpXG4gICAgICAgIGNvbnN0IG1haW4gPSBfJChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdtYWluJykpXG4gICAgICAgIGNvbnN0IHRha2VuOiB7IFtkYXRlOiBudW1iZXJdOiBudW1iZXJbXSB9ID0ge31cblxuICAgICAgICBjb25zdCB0aW1lYWZ0ZXIgPSBnZXRUaW1lQWZ0ZXIobmV3IERhdGUoKSlcblxuICAgICAgICBjb25zdCB7c3RhcnQsIGVuZH0gPSBnZXRTdGFydEVuZERhdGVzKGRhdGEpXG5cbiAgICAgICAgLy8gU2V0IHRoZSBzdGFydCBkYXRlIHRvIGJlIGEgU3VuZGF5IGFuZCB0aGUgZW5kIGRhdGUgdG8gYmUgYSBTYXR1cmRheVxuICAgICAgICBzdGFydC5zZXREYXRlKHN0YXJ0LmdldERhdGUoKSAtIHN0YXJ0LmdldERheSgpKVxuICAgICAgICBlbmQuc2V0RGF0ZShlbmQuZ2V0RGF0ZSgpICsgKDYgLSBlbmQuZ2V0RGF5KCkpKVxuXG4gICAgICAgIC8vIEZpcnN0IHBvcHVsYXRlIHRoZSBjYWxlbmRhciB3aXRoIGJveGVzIGZvciBlYWNoIGRheVxuICAgICAgICAvLyBPbmx5IGNvbnNpZGVyIHRoZSBwcmV2aW91cyBzZXQgb2YgYXNzaWdubWVudHMgZm9yIGFjdGl2aXR5IHB1cnBvc2VzIGlmIHRoZSBtb250aCBpcyB0aGUgc2FtZVxuICAgICAgICBjb25zdCBsYXN0RGF0YSA9IGRhdGEubW9udGhPZmZzZXQgPT0gMCA/IChsb2NhbFN0b3JhZ2VSZWFkKCdkYXRhJykgYXMgSUFwcGxpY2F0aW9uRGF0YSkgOiBudWxsXG4gICAgICAgIGxldCB3azogSFRNTEVsZW1lbnR8bnVsbCA9IG51bGxcbiAgICAgICAgaXRlckRheXMoc3RhcnQsIGVuZCwgKGQpID0+IHtcbiAgICAgICAgICAgIGlmIChkLmdldERheSgpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaWQgPSBgd2ske2QuZ2V0TW9udGgoKX0tJHtkLmdldERhdGUoKX1gIC8vIERvbid0IGNyZWF0ZSBhIG5ldyB3ZWVrIGVsZW1lbnQgaWYgb25lIGFscmVhZHkgZXhpc3RzXG4gICAgICAgICAgICAgICAgd2sgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZClcbiAgICAgICAgICAgICAgICBpZiAod2sgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB3ayA9IGNyZWF0ZVdlZWsoaWQpXG4gICAgICAgICAgICAgICAgICAgIG1haW4uYXBwZW5kQ2hpbGQod2spXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXdrKSB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkIHdlZWsgZWxlbWVudCBvbiBkYXkgJHtkfSB0byBub3QgYmUgbnVsbGApXG4gICAgICAgICAgICBpZiAod2suZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnZGF5JykubGVuZ3RoIDw9IGQuZ2V0RGF5KCkpIHtcbiAgICAgICAgICAgICAgICB3ay5hcHBlbmRDaGlsZChjcmVhdGVEYXkoZCkpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRha2VuW2QuZ2V0VGltZSgpXSA9IFtdXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gU3BsaXQgYXNzaWdubWVudHMgdGFraW5nIG1vcmUgdGhhbiAxIHdlZWtcbiAgICAgICAgY29uc3Qgc3BsaXQ6IElTcGxpdEFzc2lnbm1lbnRbXSA9IFtdXG4gICAgICAgIGRhdGEuYXNzaWdubWVudHMuZm9yRWFjaCgoYXNzaWdubWVudCwgbnVtKSA9PiB7XG4gICAgICAgICAgICBzcGxpdC5wdXNoKC4uLmdldEFzc2lnbm1lbnRTcGxpdHMoYXNzaWdubWVudCwgc3RhcnQsIGVuZCkpXG5cbiAgICAgICAgICAgIC8vIEFjdGl2aXR5IHN0dWZmXG4gICAgICAgICAgICBpZiAobGFzdERhdGEgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG9sZEFzc2lnbm1lbnQgPSBsYXN0RGF0YS5hc3NpZ25tZW50cy5maW5kKChhKSA9PiBhLmlkID09PSBhc3NpZ25tZW50LmlkKVxuICAgICAgICAgICAgICAgIGlmIChvbGRBc3NpZ25tZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvbGRBc3NpZ25tZW50LmJvZHkgIT09IGFzc2lnbm1lbnQuYm9keSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWRkQWN0aXZpdHkoJ2VkaXQnLCBvbGRBc3NpZ25tZW50LCBuZXcgRGF0ZSgpLCB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2xkQXNzaWdubWVudC5jbGFzcyAhPSBudWxsID8gbGFzdERhdGEuY2xhc3Nlc1tvbGRBc3NpZ25tZW50LmNsYXNzXSA6IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbW92ZUZyb21Nb2RpZmllZChhc3NpZ25tZW50LmlkKSAvLyBJZiB0aGUgYXNzaWdubWVudCBpcyBtb2RpZmllZCwgcmVzZXQgaXRcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBsYXN0RGF0YS5hc3NpZ25tZW50cy5zcGxpY2UobGFzdERhdGEuYXNzaWdubWVudHMuaW5kZXhPZihvbGRBc3NpZ25tZW50KSwgMSlcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBhZGRBY3Rpdml0eSgnYWRkJywgYXNzaWdubWVudCwgbmV3IERhdGUoKSwgdHJ1ZSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgaWYgKGxhc3REYXRhICE9IG51bGwpIHtcbiAgICAgICAgICAgIC8vIENoZWNrIGlmIGFueSBvZiB0aGUgbGFzdCBhc3NpZ25tZW50cyB3ZXJlbid0IGRlbGV0ZWQgKHNvIHRoZXkgaGF2ZSBiZWVuIGRlbGV0ZWQgaW4gUENSKVxuICAgICAgICAgICAgbGFzdERhdGEuYXNzaWdubWVudHMuZm9yRWFjaCgoYXNzaWdubWVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGFkZEFjdGl2aXR5KCdkZWxldGUnLCBhc3NpZ25tZW50LCBuZXcgRGF0ZSgpLCB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzc2lnbm1lbnQuY2xhc3MgIT0gbnVsbCA/IGxhc3REYXRhLmNsYXNzZXNbYXNzaWdubWVudC5jbGFzc10gOiB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgcmVtb3ZlRnJvbURvbmUoYXNzaWdubWVudC5pZClcbiAgICAgICAgICAgICAgICByZW1vdmVGcm9tTW9kaWZpZWQoYXNzaWdubWVudC5pZClcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIC8vIFRoZW4gc2F2ZSBhIG1heGltdW0gb2YgMTI4IGFjdGl2aXR5IGl0ZW1zXG4gICAgICAgICAgICBzYXZlQWN0aXZpdHkoKVxuXG4gICAgICAgICAgICAvLyBBbmQgY29tcGxldGVkIGFzc2lnbm1lbnRzICsgbW9kaWZpY2F0aW9uc1xuICAgICAgICAgICAgc2F2ZURvbmUoKVxuICAgICAgICAgICAgc2F2ZU1vZGlmaWVkKClcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFkZCBjdXN0b20gYXNzaWdubWVudHMgdG8gdGhlIHNwbGl0IGFycmF5XG4gICAgICAgIGdldEV4dHJhKCkuZm9yRWFjaCgoY3VzdG9tKSA9PiB7XG4gICAgICAgICAgICBzcGxpdC5wdXNoKC4uLmdldEFzc2lnbm1lbnRTcGxpdHMoZXh0cmFUb1Rhc2soY3VzdG9tLCBkYXRhKSwgc3RhcnQsIGVuZCwgY3VzdG9tKSlcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBDYWxjdWxhdGUgdGhlIHRvZGF5J3Mgd2VlayBpZFxuICAgICAgICBjb25zdCB0ZHN0ID0gbmV3IERhdGUoKVxuICAgICAgICB0ZHN0LnNldERhdGUodGRzdC5nZXREYXRlKCkgLSB0ZHN0LmdldERheSgpKVxuICAgICAgICBjb25zdCB0b2RheVdrSWQgPSBgd2ske3Rkc3QuZ2V0TW9udGgoKX0tJHt0ZHN0LmdldERhdGUoKX1gXG5cbiAgICAgICAgLy8gVGhlbiBhZGQgYXNzaWdubWVudHNcbiAgICAgICAgY29uc3Qgd2Vla0hlaWdodHM6IHsgW3dlZWtJZDogc3RyaW5nXTogbnVtYmVyIH0gPSB7fVxuICAgICAgICBjb25zdCBwcmV2aW91c0Fzc2lnbm1lbnRzOiB7IFtpZDogc3RyaW5nXTogSFRNTEVsZW1lbnQgfSA9IHt9XG4gICAgICAgIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYXNzaWdubWVudCcpLCAoYXNzaWdubWVudDogSFRNTEVsZW1lbnQpID0+IHtcbiAgICAgICAgICAgIHByZXZpb3VzQXNzaWdubWVudHNbYXNzaWdubWVudC5pZF0gPSBhc3NpZ25tZW50XG4gICAgICAgIH0pXG5cbiAgICAgICAgc3BsaXQuZm9yRWFjaCgocykgPT4ge1xuICAgICAgICAgICAgY29uc3Qgd2Vla0lkID0gY29tcHV0ZVdlZWtJZChzKVxuICAgICAgICAgICAgd2sgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh3ZWVrSWQpXG4gICAgICAgICAgICBpZiAod2sgPT0gbnVsbCkgcmV0dXJuXG5cbiAgICAgICAgICAgIGNvbnN0IGUgPSBjcmVhdGVBc3NpZ25tZW50KHMsIGRhdGEpXG5cbiAgICAgICAgICAgIC8vIENhbGN1bGF0ZSBob3cgbWFueSBhc3NpZ25tZW50cyBhcmUgcGxhY2VkIGJlZm9yZSB0aGUgY3VycmVudCBvbmVcbiAgICAgICAgICAgIGlmICghcy5jdXN0b20gfHwgIXNldHRpbmdzLnNlcFRhc2tzKSB7XG4gICAgICAgICAgICAgICAgbGV0IHBvcyA9IDBcbiAgICAgICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmUgbm8tbG9vcHNcbiAgICAgICAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZm91bmQgPSB0cnVlXG4gICAgICAgICAgICAgICAgICAgIGl0ZXJEYXlzKHMuc3RhcnQsIHMuZW5kID09PSAnRm9yZXZlcicgPyBzLnN0YXJ0IDogcy5lbmQsIChkKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGFrZW5bZC5nZXRUaW1lKCldLmluZGV4T2YocG9zKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIGlmIChmb3VuZCkgeyBicmVhayB9XG4gICAgICAgICAgICAgICAgICAgIHBvcysrXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gQXBwZW5kIHRoZSBwb3NpdGlvbiB0aGUgYXNzaWdubWVudCBpcyBhdCB0byB0aGUgdGFrZW4gYXJyYXlcbiAgICAgICAgICAgICAgICBpdGVyRGF5cyhzLnN0YXJ0LCBzLmVuZCA9PT0gJ0ZvcmV2ZXInID8gcy5zdGFydCA6IHMuZW5kLCAoZCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0YWtlbltkLmdldFRpbWUoKV0ucHVzaChwb3MpXG4gICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgIC8vIENhbGN1bGF0ZSBob3cgZmFyIGRvd24gdGhlIGFzc2lnbm1lbnQgbXVzdCBiZSBwbGFjZWQgYXMgdG8gbm90IGJsb2NrIHRoZSBvbmVzIGFib3ZlIGl0XG4gICAgICAgICAgICAgICAgZS5zdHlsZS5tYXJnaW5Ub3AgPSAocG9zICogMzApICsgJ3B4J1xuXG4gICAgICAgICAgICAgICAgaWYgKCh3ZWVrSGVpZ2h0c1t3ZWVrSWRdID09IG51bGwpIHx8IChwb3MgPiB3ZWVrSGVpZ2h0c1t3ZWVrSWRdKSkge1xuICAgICAgICAgICAgICAgICAgICB3ZWVrSGVpZ2h0c1t3ZWVrSWRdID0gcG9zXG4gICAgICAgICAgICAgICAgICAgIHdrLnN0eWxlLmhlaWdodCA9IDQ3ICsgKChwb3MgKyAxKSAqIDMwKSArICdweCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIElmIHRoZSBhc3NpZ25tZW50IGlzIGEgdGVzdCBhbmQgaXMgdXBjb21pbmcsIGFkZCBpdCB0byB0aGUgdXBjb21pbmcgdGVzdHMgcGFuZWwuXG4gICAgICAgICAgICBpZiAocy5hc3NpZ25tZW50LmVuZCA+PSB0b2RheSgpICYmIChzLmFzc2lnbm1lbnQuYmFzZVR5cGUgPT09ICd0ZXN0JyB8fFxuICAgICAgICAgICAgICAgIChzZXR0aW5ncy5wcm9qZWN0c0luVGVzdFBhbmUgJiYgcy5hc3NpZ25tZW50LmJhc2VUeXBlID09PSAnbG9uZ3Rlcm0nKSkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB0ZSA9IGVsZW1lbnQoJ2RpdicsIFsndXBjb21pbmdUZXN0JywgJ2Fzc2lnbm1lbnRJdGVtJywgcy5hc3NpZ25tZW50LmJhc2VUeXBlXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYDxpIGNsYXNzPSdtYXRlcmlhbC1pY29ucyc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtzLmFzc2lnbm1lbnQuYmFzZVR5cGUgPT09ICdsb25ndGVybScgPyAnYXNzaWdubWVudCcgOiAnYXNzZXNzbWVudCd9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2k+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz0ndGl0bGUnPiR7cy5hc3NpZ25tZW50LnRpdGxlfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzbWFsbD4ke3NlcGFyYXRlZENsYXNzKHMuYXNzaWdubWVudCwgZGF0YSlbMl19PC9zbWFsbD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9J3JhbmdlJz4ke2RhdGVTdHJpbmcocy5hc3NpZ25tZW50LmVuZCwgdHJ1ZSl9PC9kaXY+YCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYHRlc3Qke3MuYXNzaWdubWVudC5pZH1gKVxuICAgICAgICAgICAgICAgIGlmIChzLmFzc2lnbm1lbnQuY2xhc3MpIHRlLnNldEF0dHJpYnV0ZSgnZGF0YS1jbGFzcycsIGRhdGEuY2xhc3Nlc1tzLmFzc2lnbm1lbnQuY2xhc3NdKVxuICAgICAgICAgICAgICAgIHRlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBkb1Njcm9sbGluZyA9IGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHNtb290aFNjcm9sbCgoZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgKyBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCkgLSAxMTYpXG4gICAgICAgICAgICAgICAgICAgICAgICBlLmNsaWNrKClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoZG9jdW1lbnQuYm9keS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmlldycpID09PSAnMCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvU2Nyb2xsaW5nKClcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF8kKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNuYXZUYWJzPmxpOmZpcnN0LWNoaWxkJykgYXMgSFRNTEVsZW1lbnQpLmNsaWNrKClcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZG9TY3JvbGxpbmcsIDUwMClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICBpZiAoYXNzaWdubWVudEluRG9uZShzLmFzc2lnbm1lbnQuaWQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRlLmNsYXNzTGlzdC5hZGQoJ2RvbmUnKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCB0ZXN0RWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGB0ZXN0JHtzLmFzc2lnbm1lbnQuaWR9YClcbiAgICAgICAgICAgICAgICBpZiAodGVzdEVsZW0pIHtcbiAgICAgICAgICAgICAgICB0ZXN0RWxlbS5pbm5lckhUTUwgPSB0ZS5pbm5lckhUTUxcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBlbGVtQnlJZCgnaW5mb1Rlc3RzJykuYXBwZW5kQ2hpbGQodGUpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBhbHJlYWR5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocy5hc3NpZ25tZW50LmlkICsgd2Vla0lkKVxuICAgICAgICAgICAgaWYgKGFscmVhZHkgIT0gbnVsbCkgeyAvLyBBc3NpZ25tZW50IGFscmVhZHkgZXhpc3RzXG4gICAgICAgICAgICAgICAgYWxyZWFkeS5zdHlsZS5tYXJnaW5Ub3AgPSBlLnN0eWxlLm1hcmdpblRvcFxuICAgICAgICAgICAgICAgIGFscmVhZHkuc2V0QXR0cmlidXRlKCdkYXRhLWNsYXNzJyxcbiAgICAgICAgICAgICAgICAgICAgcy5jdXN0b20gJiYgc2V0dGluZ3Muc2VwVGFza0NsYXNzID8gJ1Rhc2snIDogY2xhc3NCeUlkKHMuYXNzaWdubWVudC5jbGFzcykpXG4gICAgICAgICAgICAgICAgaWYgKCFhc3NpZ25tZW50SW5Nb2RpZmllZChzLmFzc2lnbm1lbnQuaWQpKSB7XG4gICAgICAgICAgICAgICAgICAgIGFscmVhZHkuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYm9keScpWzBdLmlubmVySFRNTCA9IGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYm9keScpWzBdLmlubmVySFRNTFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBfJChhbHJlYWR5LnF1ZXJ5U2VsZWN0b3IoJy5lZGl0cycpKS5jbGFzc05hbWUgPSBfJChlLnF1ZXJ5U2VsZWN0b3IoJy5lZGl0cycpKS5jbGFzc05hbWVcbiAgICAgICAgICAgICAgICBpZiAoYWxyZWFkeS5jbGFzc0xpc3QudG9nZ2xlKSB7XG4gICAgICAgICAgICAgICAgICAgIGFscmVhZHkuY2xhc3NMaXN0LnRvZ2dsZSgnbGlzdERpc3AnLCBlLmNsYXNzTGlzdC5jb250YWlucygnbGlzdERpc3AnKSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZ2V0RVMoYWxyZWFkeSkuZm9yRWFjaCgoY2wpID0+IGFscmVhZHkuY2xhc3NMaXN0LnJlbW92ZShjbCkpXG4gICAgICAgICAgICAgICAgZ2V0RVMoZSkuZm9yRWFjaCgoY2wpID0+IGFscmVhZHkuY2xhc3NMaXN0LmFkZChjbCkpXG4gICAgICAgICAgICAgICAgV0VFS0VORF9DTEFTU05BTUVTLmZvckVhY2goKGNsKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGFscmVhZHkuY2xhc3NMaXN0LnJlbW92ZShjbClcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUuY2xhc3NMaXN0LmNvbnRhaW5zKGNsKSkgYWxyZWFkeS5jbGFzc0xpc3QuYWRkKGNsKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChzLmN1c3RvbSAmJiBzZXR0aW5ncy5zZXBUYXNrcykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzdCA9IE1hdGguZmxvb3Iocy5zdGFydC5nZXRUaW1lKCkgLyAxMDAwIC8gMzYwMCAvIDI0KVxuICAgICAgICAgICAgICAgICAgICBpZiAoKHMuYXNzaWdubWVudC5zdGFydCA9PT0gc3QpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAocy5hc3NpZ25tZW50LmVuZCA9PT0gJ0ZvcmV2ZXInIHx8IHMuYXNzaWdubWVudC5lbmQgPj0gdG9kYXkoKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUuY2xhc3NMaXN0LnJlbW92ZSgnYXNzaWdubWVudCcpXG4gICAgICAgICAgICAgICAgICAgICAgICBlLmNsYXNzTGlzdC5hZGQoJ3Rhc2tQYW5lSXRlbScpXG4gICAgICAgICAgICAgICAgICAgICAgICBlLnN0eWxlLm9yZGVyID0gU3RyaW5nKHMuYXNzaWdubWVudC5lbmQgPT09ICdGb3JldmVyJyA/IE51bWJlci5NQVhfVkFMVUUgOiBzLmFzc2lnbm1lbnQuZW5kKVxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbGluayA9IGUucXVlcnlTZWxlY3RvcignLmxpbmtlZCcpXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobGluaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUuaW5zZXJ0QmVmb3JlKGVsZW1lbnQoJ3NtYWxsJywgW10sIGxpbmsuaW5uZXJIVE1MKSwgbGluaylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5rLnJlbW92ZSgpXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtQnlJZCgnaW5mb1Rhc2tzSW5uZXInKS5hcHBlbmRDaGlsZChlKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHsgd2suYXBwZW5kQ2hpbGQoZSkgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGVsZXRlIHByZXZpb3VzQXNzaWdubWVudHNbcy5hc3NpZ25tZW50LmlkICsgd2Vla0lkXVxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIERlbGV0ZSBhbnkgYXNzaWdubWVudHMgdGhhdCBoYXZlIGJlZW4gZGVsZXRlZCBzaW5jZSB1cGRhdGluZ1xuICAgICAgICBPYmplY3QuZW50cmllcyhwcmV2aW91c0Fzc2lnbm1lbnRzKS5mb3JFYWNoKChbbmFtZSwgYXNzaWdubWVudF0pID0+IHtcbiAgICAgICAgICAgIGlmIChhc3NpZ25tZW50LmNsYXNzTGlzdC5jb250YWlucygnZnVsbCcpKSB7XG4gICAgICAgICAgICAgICAgZWxlbUJ5SWQoJ2JhY2tncm91bmQnKS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYXNzaWdubWVudC5yZW1vdmUoKVxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIFNjcm9sbCB0byB0aGUgY29ycmVjdCBwb3NpdGlvbiBpbiBjYWxlbmRhciB2aWV3XG4gICAgICAgIGlmICh3ZWVrSGVpZ2h0c1t0b2RheVdrSWRdICE9IG51bGwpIHtcbiAgICAgICAgICAgIGxldCBoID0gMFxuICAgICAgICAgICAgY29uc3Qgc3cgPSAod2tpZDogc3RyaW5nKSA9PiB3a2lkLnN1YnN0cmluZygyKS5zcGxpdCgnLScpLm1hcCgoeCkgPT4gTnVtYmVyKHgpKVxuICAgICAgICAgICAgY29uc3QgdG9kYXlXayA9IHN3KHRvZGF5V2tJZClcbiAgICAgICAgICAgIE9iamVjdC5lbnRyaWVzKHdlZWtIZWlnaHRzKS5mb3JFYWNoKChbd2tJZCwgdmFsXSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHdrU3BsaXQgPSBzdyh3a0lkKVxuICAgICAgICAgICAgICAgIGlmICgod2tTcGxpdFswXSA8IHRvZGF5V2tbMF0pIHx8ICgod2tTcGxpdFswXSA9PT0gdG9kYXlXa1swXSkgJiYgKHdrU3BsaXRbMV0gPCB0b2RheVdrWzFdKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaCArPSB2YWxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgc2Nyb2xsID0gKGggKiAzMCkgKyAxMTIgKyAxNFxuICAgICAgICAgICAgLy8gQWxzbyBzaG93IHRoZSBkYXkgaGVhZGVycyBpZiB0b2RheSdzIGRhdGUgaXMgZGlzcGxheWVkIGluIHRoZSBmaXJzdCByb3cgb2YgdGhlIGNhbGVuZGFyXG4gICAgICAgICAgICBpZiAoc2Nyb2xsIDwgNTApIHNjcm9sbCA9IDBcbiAgICAgICAgICAgIGlmIChkb1Njcm9sbCAmJiAoZG9jdW1lbnQuYm9keS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmlldycpID09PSAnMCcpICYmXG4gICAgICAgICAgICAgICAgIWRvY3VtZW50LmJvZHkucXVlcnlTZWxlY3RvcignLmZ1bGwnKSkge1xuICAgICAgICAgICAgICAgIC8vIGluIGNhbGVuZGFyIHZpZXdcbiAgICAgICAgICAgICAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgc2Nyb2xsKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QudG9nZ2xlKCdub0xpc3QnLFxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmFzc2lnbm1lbnQubGlzdERpc3A6bm90KC5kb25lKScpLmxlbmd0aCA9PT0gMClcbiAgICAgICAgaWYgKGRvY3VtZW50LmJvZHkuZ2V0QXR0cmlidXRlKCdkYXRhLXZpZXcnKSA9PT0gJzEnKSB7IC8vIGluIGxpc3Qgdmlld1xuICAgICAgICAgICAgcmVzaXplKClcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBkaXNwbGF5RXJyb3IoZXJyKVxuICAgIH1cbiAgICBjb25zb2xlLnRpbWVFbmQoJ0Rpc3BsYXlpbmcgZGF0YScpXG59XG5cbi8vIFRoZSBmdW5jdGlvbiBiZWxvdyBjb252ZXJ0cyBhbiB1cGRhdGUgdGltZSB0byBhIGh1bWFuLXJlYWRhYmxlIGRhdGUuXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0VXBkYXRlKGRhdGU6IG51bWJlcik6IHN0cmluZyB7XG4gIGNvbnN0IG5vdyA9IG5ldyBEYXRlKClcbiAgY29uc3QgdXBkYXRlID0gbmV3IERhdGUoK2RhdGUpXG4gIGlmIChub3cuZ2V0RGF0ZSgpID09PSB1cGRhdGUuZ2V0RGF0ZSgpKSB7XG4gICAgbGV0IGFtcG0gPSAnQU0nXG4gICAgbGV0IGhyID0gdXBkYXRlLmdldEhvdXJzKClcbiAgICBpZiAoaHIgPiAxMikge1xuICAgICAgYW1wbSA9ICdQTSdcbiAgICAgIGhyIC09IDEyXG4gICAgfVxuICAgIGNvbnN0IG1pbiA9IHVwZGF0ZS5nZXRNaW51dGVzKClcbiAgICByZXR1cm4gYFRvZGF5IGF0ICR7aHJ9OiR7bWluIDwgMTAgPyBgMCR7bWlufWAgOiBtaW59ICR7YW1wbX1gXG4gIH0gZWxzZSB7XG4gICAgY29uc3QgZGF5c1Bhc3QgPSBNYXRoLmNlaWwoKG5vdy5nZXRUaW1lKCkgLSB1cGRhdGUuZ2V0VGltZSgpKSAvIDEwMDAgLyAzNjAwIC8gMjQpXG4gICAgaWYgKGRheXNQYXN0ID09PSAxKSB7IHJldHVybiAnWWVzdGVyZGF5JyB9IGVsc2UgeyByZXR1cm4gZGF5c1Bhc3QgKyAnIGRheXMgYWdvJyB9XG4gIH1cbn1cbiIsImxldCBsaXN0RGF0ZU9mZnNldCA9IDBcbmxldCBjYWxEYXRlT2Zmc2V0ID0gMFxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TGlzdERhdGVPZmZzZXQoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gbGlzdERhdGVPZmZzZXRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGluY3JlbWVudExpc3REYXRlT2Zmc2V0KCk6IHZvaWQge1xuICAgIGxpc3REYXRlT2Zmc2V0ICs9IDFcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlY3JlbWVudExpc3REYXRlT2Zmc2V0KCk6IHZvaWQge1xuICAgIGxpc3REYXRlT2Zmc2V0IC09IDFcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldExpc3REYXRlT2Zmc2V0KG9mZnNldDogbnVtYmVyKTogdm9pZCB7XG4gICAgbGlzdERhdGVPZmZzZXQgPSBvZmZzZXRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENhbERhdGVPZmZzZXQoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gY2FsRGF0ZU9mZnNldFxufVxuXG5leHBvcnQgZnVuY3Rpb24gaW5jcmVtZW50Q2FsRGF0ZU9mZnNldCgpOiB2b2lkIHtcbiAgICBjYWxEYXRlT2Zmc2V0ICs9IDFcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlY3JlbWVudENhbERhdGVPZmZzZXQoKTogdm9pZCB7XG4gICAgY2FsRGF0ZU9mZnNldCAtPSAxXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRDYWxEYXRlT2Zmc2V0KG9mZnNldDogbnVtYmVyKTogdm9pZCB7XG4gICAgY2FsRGF0ZU9mZnNldCA9IG9mZnNldFxufVxuXG5leHBvcnQgZnVuY3Rpb24gemVyb0RhdGVPZmZzZXRzKCk6IHZvaWQge1xuICAgIGxpc3REYXRlT2Zmc2V0ID0gMFxuICAgIGNhbERhdGVPZmZzZXQgPSAwXG59XG4iLCIvKipcbiAqIFRoaXMgbW9kdWxlIGNvbnRhaW5zIGNvZGUgdG8gYm90aCBmZXRjaCBhbmQgcGFyc2UgYXNzaWdubWVudHMgZnJvbSBQQ1IuXG4gKi9cbmltcG9ydCB7IHVwZGF0ZUF2YXRhciB9IGZyb20gJy4vY29tcG9uZW50cy9hdmF0YXInXG5pbXBvcnQgeyBkaXNwbGF5RXJyb3IgfSBmcm9tICcuL2NvbXBvbmVudHMvZXJyb3JEaXNwbGF5J1xuaW1wb3J0IHsgc25hY2tiYXIgfSBmcm9tICcuL2NvbXBvbmVudHMvc25hY2tiYXInXG5pbXBvcnQgeyBkZWxldGVDb29raWUsIGdldENvb2tpZSwgc2V0Q29va2llIH0gZnJvbSAnLi9jb29raWVzJ1xuaW1wb3J0IHsgdG9EYXRlTnVtIH0gZnJvbSAnLi9kYXRlcydcbmltcG9ydCB7IGRpc3BsYXksIGZvcm1hdFVwZGF0ZSB9IGZyb20gJy4vZGlzcGxheSdcbmltcG9ydCB7IHplcm9EYXRlT2Zmc2V0cywgZ2V0Q2FsRGF0ZU9mZnNldCwgZ2V0TGlzdERhdGVPZmZzZXQgfSBmcm9tICcuL25hdmlnYXRpb24nXG5pbXBvcnQgeyBfJCwgZWxlbUJ5SWQsIGxvY2FsU3RvcmFnZVdyaXRlLCBzZW5kIH0gZnJvbSAnLi91dGlsJ1xuXG5jb25zdCBQQ1JfVVJMID0gJ2h0dHBzOi8vd2ViYXBwc2NhLnBjcnNvZnQuY29tJ1xuY29uc3QgQVNTSUdOTUVOVFNfVVJMID0gYCR7UENSX1VSTH0vQ2x1ZS9TQy1Bc3NpZ25tZW50cy1TdGFydC1hbmQtRW5kLURhdGUtKE5vLVJhbmdlKS8xODU5NGBcbmNvbnN0IExPR0lOX1VSTCA9IGAke1BDUl9VUkx9L0NsdWUvU0MtU3R1ZGVudC1Qb3J0YWwtTG9naW4tTERBUC84NDY0P3JldHVyblVybD0ke2VuY29kZVVSSUNvbXBvbmVudChBU1NJR05NRU5UU19VUkwpfWBcbmNvbnN0IEFUVEFDSE1FTlRTX1VSTCA9IGAke1BDUl9VUkx9L0NsdWUvQ29tbW9uL0F0dGFjaG1lbnRSZW5kZXIuYXNweGBcbmNvbnN0IEZPUk1fSEVBREVSX09OTFkgPSB7ICdDb250ZW50LXR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyB9XG5jb25zdCBPTkVfTUlOVVRFX01TID0gNjAwMDBcblxuY29uc3QgcHJvZ3Jlc3NFbGVtZW50ID0gZWxlbUJ5SWQoJ3Byb2dyZXNzJylcbmNvbnN0IGxvZ2luRGlhbG9nID0gZWxlbUJ5SWQoJ2xvZ2luJylcbmNvbnN0IGxvZ2luQmFja2dyb3VuZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2dpbkJhY2tncm91bmQnKVxuY29uc3QgbGFzdFVwZGF0ZUVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xhc3RVcGRhdGUnKVxuY29uc3QgdXNlcm5hbWVFbCA9IGVsZW1CeUlkKCd1c2VybmFtZScpIGFzIEhUTUxJbnB1dEVsZW1lbnRcbmNvbnN0IHBhc3N3b3JkRWwgPSBlbGVtQnlJZCgncGFzc3dvcmQnKSBhcyBIVE1MSW5wdXRFbGVtZW50XG5jb25zdCByZW1lbWJlckNoZWNrID0gZWxlbUJ5SWQoJ3JlbWVtYmVyJykgYXMgSFRNTElucHV0RWxlbWVudFxuY29uc3QgaW5jb3JyZWN0TG9naW5FbCA9IGVsZW1CeUlkKCdsb2dpbkluY29ycmVjdCcpXG5cbi8vIFRPRE8ga2VlcGluZyB0aGVzZSBhcyBhIGdsb2JhbCB2YXJzIGlzIGJhZFxuY29uc3QgbG9naW5IZWFkZXJzOiB7W2hlYWRlcjogc3RyaW5nXTogc3RyaW5nfSA9IHt9XG5jb25zdCB2aWV3RGF0YToge1toYWRlcjogc3RyaW5nXTogc3RyaW5nfSA9IHt9XG5sZXQgbGFzdFVwZGF0ZSA9IDAgLy8gVGhlIGxhc3QgdGltZSBldmVyeXRoaW5nIHdhcyB1cGRhdGVkXG5cbmV4cG9ydCBpbnRlcmZhY2UgSUFwcGxpY2F0aW9uRGF0YSB7XG4gICAgY2xhc3Nlczogc3RyaW5nW11cbiAgICBhc3NpZ25tZW50czogSUFzc2lnbm1lbnRbXVxuICAgIG1vbnRoVmlldzogYm9vbGVhblxuICAgIG1vbnRoT2Zmc2V0OiBudW1iZXJcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJQXNzaWdubWVudCB7XG4gICAgc3RhcnQ6IG51bWJlclxuICAgIGVuZDogbnVtYmVyfCdGb3JldmVyJ1xuICAgIGF0dGFjaG1lbnRzOiBBdHRhY2htZW50QXJyYXlbXVxuICAgIGJvZHk6IHN0cmluZ1xuICAgIHR5cGU6IHN0cmluZ1xuICAgIGJhc2VUeXBlOiBzdHJpbmdcbiAgICBjbGFzczogbnVtYmVyfG51bGwsXG4gICAgdGl0bGU6IHN0cmluZ1xuICAgIGlkOiBzdHJpbmdcbn1cblxuZXhwb3J0IHR5cGUgQXR0YWNobWVudEFycmF5ID0gW3N0cmluZywgc3RyaW5nXVxuXG4vLyBUaGlzIGlzIHRoZSBmdW5jdGlvbiB0aGF0IHJldHJpZXZlcyB5b3VyIGFzc2lnbm1lbnRzIGZyb20gUENSLlxuLy9cbi8vIEZpcnN0LCBhIHJlcXVlc3QgaXMgc2VudCB0byBQQ1IgdG8gbG9hZCB0aGUgcGFnZSB5b3Ugd291bGQgbm9ybWFsbHkgc2VlIHdoZW4gYWNjZXNzaW5nIFBDUi5cbi8vXG4vLyBCZWNhdXNlIHRoaXMgaXMgcnVuIGFzIGEgY2hyb21lIGV4dGVuc2lvbiwgdGhpcyBwYWdlIGNhbiBiZSBhY2Nlc3NlZC4gT3RoZXJ3aXNlLCB0aGUgYnJvd3NlclxuLy8gd291bGQgdGhyb3cgYW4gZXJyb3IgZm9yIHNlY3VyaXR5IHJlYXNvbnMgKHlvdSBkb24ndCB3YW50IGEgcmFuZG9tIHdlYnNpdGUgYmVpbmcgYWJsZSB0byBhY2Nlc3Ncbi8vIGNvbmZpZGVudGlhbCBkYXRhIGZyb20gYSB3ZWJzaXRlIHlvdSBoYXZlIGxvZ2dlZCBpbnRvKS5cblxuLyoqXG4gKiBGZXRjaGVzIGRhdGEgZnJvbSBQQ1IgYW5kIGlmIHRoZSB1c2VyIGlzIGxvZ2dlZCBpbiBwYXJzZXMgYW5kIGRpc3BsYXlzIGl0XG4gKiBAcGFyYW0gb3ZlcnJpZGUgV2hldGhlciB0byBmb3JjZSBhbiB1cGRhdGUgZXZlbiB0aGVyZSB3YXMgb25lIHJlY2VudGx5XG4gKiBAcGFyYW0gZGF0YSAgT3B0aW9uYWwgZGF0YSB0byBiZSBwb3N0ZWQgdG8gUENSXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmZXRjaChvdmVycmlkZTogYm9vbGVhbiA9IGZhbHNlLCBkYXRhPzogc3RyaW5nLCBvbnN1Y2Nlc3M6ICgpID0+IHZvaWQgPSBkaXNwbGF5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ubG9naW4/OiAoKSA9PiB2b2lkKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKCFvdmVycmlkZSAmJiBEYXRlLm5vdygpIC0gbGFzdFVwZGF0ZSA8IE9ORV9NSU5VVEVfTVMpIHJldHVyblxuICAgIGxhc3RVcGRhdGUgPSBEYXRlLm5vdygpXG5cbiAgICAvLyBSZXF1ZXN0IGEgbmV3IG1vbnRoIGlmIG5lZWRlZFxuICAgIGNvbnN0IG1vbnRoT2Zmc2V0ID0gZ2V0Q2FsRGF0ZU9mZnNldCgpXG4gICAgaWYgKG1vbnRoT2Zmc2V0ICE9PSAwKSB7XG4gICAgICAgIGNvbnN0IHRvZGF5ID0gbmV3IERhdGUoKVxuICAgICAgICB0b2RheS5zZXRNb250aCh0b2RheS5nZXRNb250aCgpICsgZ2V0Q2FsRGF0ZU9mZnNldCgpKVxuICAgICAgICAvLyBSZW1lbWJlciBtb250aHMgYXJlIHplcm8taW5kZXhlZFxuICAgICAgICBjb25zdCBkYXRlQXJyYXkgPSBbdG9kYXkuZ2V0RnVsbFllYXIoKSwgdG9kYXkuZ2V0TW9udGgoKSArIDEsIDFdXG4gICAgICAgIGNvbnN0IG5ld1ZpZXdEYXRhID0ge1xuICAgICAgICAgICAgLi4udmlld0RhdGEsXG4gICAgICAgICAgICBfX0VWRU5UVEFSR0VUOiAnY3RsMDAkY3RsMDAkYmFzZUNvbnRlbnQkYmFzZUNvbnRlbnQkZmxhc2hUb3AkY3RsMDAkUmFkU2NoZWR1bGVyMSRTZWxlY3RlZERhdGVDYWxlbmRhcicsXG4gICAgICAgICAgICBfX0VWRU5UQVJHVU1FTlQ6ICdkJyxcbiAgICAgICAgICAgIGN0bDAwX2N0bDAwX2Jhc2VDb250ZW50X2Jhc2VDb250ZW50X2ZsYXNoVG9wX2N0bDAwX1JhZFNjaGVkdWxlcjFfU2VsZWN0ZWREYXRlQ2FsZW5kYXJfU0Q6XG4gICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoW2RhdGVBcnJheV0pLFxuICAgICAgICAgICAgY3RsMDBfY3RsMDBfYmFzZUNvbnRlbnRfYmFzZUNvbnRlbnRfZmxhc2hUb3BfY3RsMDBfUmFkU2NoZWR1bGVyMV9TZWxlY3RlZERhdGVDYWxlbmRhcl9BRDpcbiAgICAgICAgICAgICAgICBKU09OLnN0cmluZ2lmeShbWzE5MDAsIDEsIDFdLCBbMjA5OSwgMTIsIDMwXSwgZGF0ZUFycmF5XSksXG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcG9zdEFycmF5OiBzdHJpbmdbXSA9IFtdIC8vIEFycmF5IG9mIGRhdGEgdG8gcG9zdFxuICAgICAgICBPYmplY3QuZW50cmllcyhuZXdWaWV3RGF0YSkuZm9yRWFjaCgoW2gsIHZdKSA9PiB7XG4gICAgICAgICAgICBwb3N0QXJyYXkucHVzaChlbmNvZGVVUklDb21wb25lbnQoaCkgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQodikpXG4gICAgICAgIH0pXG4gICAgICAgIGRhdGEgPSAoZGF0YSA/IGRhdGEgKyAnJicgOiAnJykgKyBwb3N0QXJyYXkuam9pbignJicpXG4gICAgfVxuXG4gICAgY29uc3QgaGVhZGVycyA9IGRhdGEgPyBGT1JNX0hFQURFUl9PTkxZIDogdW5kZWZpbmVkXG4gICAgY29uc29sZS50aW1lKCdGZXRjaGluZyBhc3NpZ25tZW50cycpXG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmVzcCA9IGF3YWl0IHNlbmQoQVNTSUdOTUVOVFNfVVJMLCAnZG9jdW1lbnQnLCBoZWFkZXJzLCBkYXRhLCBwcm9ncmVzc0VsZW1lbnQpXG4gICAgICAgIGNvbnNvbGUudGltZUVuZCgnRmV0Y2hpbmcgYXNzaWdubWVudHMnKVxuICAgICAgICBpZiAocmVzcC5yZXNwb25zZVVSTC5pbmRleE9mKCdMb2dpbicpICE9PSAtMSkge1xuICAgICAgICAgICAgLy8gV2UgaGF2ZSB0byBsb2cgaW4gbm93XG4gICAgICAgICAgICAocmVzcC5yZXNwb25zZSBhcyBIVE1MRG9jdW1lbnQpLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdpbnB1dCcpLmZvckVhY2goKGUpID0+IHtcbiAgICAgICAgICAgICAgICBsb2dpbkhlYWRlcnNbZS5uYW1lXSA9IGUudmFsdWUgfHwgJydcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnTmVlZCB0byBsb2cgaW4nKVxuICAgICAgICAgICAgY29uc3QgdXAgPSBnZXRDb29raWUoJ3VzZXJQYXNzJykgLy8gQXR0ZW1wdHMgdG8gZ2V0IHRoZSBjb29raWUgKnVzZXJQYXNzKiwgd2hpY2ggaXMgc2V0IGlmIHRoZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gXCJSZW1lbWJlciBtZVwiIGNoZWNrYm94IGlzIGNoZWNrZWQgd2hlbiBsb2dnaW5nIGluIHRocm91Z2ggQ2hlY2tQQ1JcbiAgICAgICAgICAgIGlmICh1cCA9PT0gJycpIHtcbiAgICAgICAgICAgICAgICBpZiAobG9naW5CYWNrZ3JvdW5kKSBsb2dpbkJhY2tncm91bmQuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcbiAgICAgICAgICAgICAgICBsb2dpbkRpYWxvZy5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxuICAgICAgICAgICAgICAgIGlmIChvbmxvZ2luKSBvbmxvZ2luKClcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gQmVjYXVzZSB3ZSB3ZXJlIHJlbWVtYmVyZWQsIHdlIGNhbiBsb2cgaW4gaW1tZWRpYXRlbHkgd2l0aG91dCB3YWl0aW5nIGZvciB0aGVcbiAgICAgICAgICAgICAgICAvLyB1c2VyIHRvIGxvZyBpbiB0aHJvdWdoIHRoZSBsb2dpbiBmb3JtXG4gICAgICAgICAgICAgICAgZG9sb2dpbih3aW5kb3cuYXRvYih1cCkuc3BsaXQoJzonKSBhcyBbc3RyaW5nLCBzdHJpbmddLCBmYWxzZSwgb25zdWNjZXNzKVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gTG9nZ2VkIGluIG5vd1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0ZldGNoaW5nIGFzc2lnbm1lbnRzIHN1Y2Nlc3NmdWwnKVxuICAgICAgICAgICAgY29uc3QgdCA9IERhdGUubm93KClcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5sYXN0VXBkYXRlID0gdFxuICAgICAgICAgICAgaWYgKGxhc3RVcGRhdGVFbCkgbGFzdFVwZGF0ZUVsLmlubmVySFRNTCA9IGZvcm1hdFVwZGF0ZSh0KVxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBwYXJzZShyZXNwLnJlc3BvbnNlLCBtb250aE9mZnNldClcbiAgICAgICAgICAgICAgICBvbnN1Y2Nlc3MoKVxuICAgICAgICAgICAgICAgIGlmIChtb250aE9mZnNldCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2VXcml0ZSgnZGF0YScsIGdldERhdGEoKSkgLy8gU3RvcmUgZm9yIG9mZmxpbmUgdXNlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcilcbiAgICAgICAgICAgICAgICBkaXNwbGF5RXJyb3IoZXJyb3IpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmxvZygnQ291bGQgbm90IGZldGNoIGFzc2lnbm1lbnRzOyBZb3UgYXJlIHByb2JhYmx5IG9mZmxpbmUuIEhlcmVcXCdzIHRoZSBlcnJvcjonLCBlcnJvcilcbiAgICAgICAgc25hY2tiYXIoJ0NvdWxkIG5vdCBmZXRjaCB5b3VyIGFzc2lnbm1lbnRzJywgJ1JldHJ5JywgKCkgPT4gZmV0Y2godHJ1ZSkpXG4gICAgfVxufVxuXG4vKipcbiAqIExvZ3MgdGhlIHVzZXIgaW50byBQQ1JcbiAqIEBwYXJhbSB2YWwgICBBbiBvcHRpb25hbCBsZW5ndGgtMiBhcnJheSBvZiB0aGUgZm9ybSBbdXNlcm5hbWUsIHBhc3N3b3JkXSB0byB1c2UgdGhlIHVzZXIgaW4gd2l0aC5cbiAqICAgICAgICAgICAgICBJZiB0aGlzIGFycmF5IGlzIG5vdCBnaXZlbiB0aGUgbG9naW4gZGlhbG9nIGlucHV0cyB3aWxsIGJlIHVzZWQuXG4gKiBAcGFyYW0gc3VibWl0RXZ0IFdoZXRoZXIgdG8gb3ZlcnJpZGUgdGhlIHVzZXJuYW1lIGFuZCBwYXNzd29yZCBzdXBwbGVpZCBpbiB2YWwgd2l0aCB0aGUgdmFsdWVzIG9mIHRoZSBpbnB1dCBlbGVtZW50c1xuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZG9sb2dpbih2YWw/OiBbc3RyaW5nLCBzdHJpbmddfG51bGwsIHN1Ym1pdEV2dDogYm9vbGVhbiA9IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25zdWNjZXNzOiAoKSA9PiB2b2lkID0gZGlzcGxheSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGxvZ2luRGlhbG9nLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGlmIChsb2dpbkJhY2tncm91bmQpIGxvZ2luQmFja2dyb3VuZC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXG4gICAgfSwgMzUwKVxuXG4gICAgY29uc3QgcG9zdEFycmF5OiBzdHJpbmdbXSA9IFtdIC8vIEFycmF5IG9mIGRhdGEgdG8gcG9zdFxuICAgIGxvY2FsU3RvcmFnZVdyaXRlKCd1c2VybmFtZScsIHZhbCAmJiAhc3VibWl0RXZ0ID8gdmFsWzBdIDogdXNlcm5hbWVFbC52YWx1ZSlcbiAgICB1cGRhdGVBdmF0YXIoKVxuICAgIE9iamVjdC5rZXlzKGxvZ2luSGVhZGVycykuZm9yRWFjaCgoaCkgPT4gIHtcbiAgICAgICAgLy8gTG9vcCB0aHJvdWdoIHRoZSBpbnB1dCBlbGVtZW50cyBjb250YWluZWQgaW4gdGhlIGxvZ2luIHBhZ2UuIEFzIG1lbnRpb25lZCBiZWZvcmUsIHRoZXlcbiAgICAgICAgLy8gd2lsbCBiZSBzZW50IHRvIFBDUiB0byBsb2cgaW4uXG4gICAgICAgIGlmIChoLnRvTG93ZXJDYXNlKCkuaW5kZXhPZigndXNlcicpICE9PSAtMSkge1xuICAgICAgICAgICAgbG9naW5IZWFkZXJzW2hdID0gdmFsICYmICFzdWJtaXRFdnQgPyB2YWxbMF0gOiB1c2VybmFtZUVsLnZhbHVlXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGgudG9Mb3dlckNhc2UoKS5pbmRleE9mKCdwYXNzJykgIT09IC0xKSB7XG4gICAgICAgICAgICBsb2dpbkhlYWRlcnNbaF0gPSB2YWwgJiYgIXN1Ym1pdEV2dCA/IHZhbFsxXSA6IHBhc3N3b3JkRWwudmFsdWVcbiAgICAgICAgfVxuICAgICAgICBwb3N0QXJyYXkucHVzaChlbmNvZGVVUklDb21wb25lbnQoaCkgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQobG9naW5IZWFkZXJzW2hdKSlcbiAgICB9KVxuXG4gICAgLy8gTm93IHNlbmQgdGhlIGxvZ2luIHJlcXVlc3QgdG8gUENSXG4gICAgY29uc29sZS50aW1lKCdMb2dnaW5nIGluJylcbiAgICB0cnkge1xuICAgICAgICBjb25zdCByZXNwID0gYXdhaXQgc2VuZChMT0dJTl9VUkwsICdkb2N1bWVudCcsIEZPUk1fSEVBREVSX09OTFksIHBvc3RBcnJheS5qb2luKCcmJyksIHByb2dyZXNzRWxlbWVudClcbiAgICAgICAgY29uc29sZS50aW1lRW5kKCdMb2dnaW5nIGluJylcbiAgICAgICAgaWYgKHJlc3AucmVzcG9uc2VVUkwuaW5kZXhPZignTG9naW4nKSAhPT0gLTEpIHtcbiAgICAgICAgLy8gSWYgUENSIHN0aWxsIHdhbnRzIHVzIHRvIGxvZyBpbiwgdGhlbiB0aGUgdXNlcm5hbWUgb3IgcGFzc3dvcmQgZW50ZXJlZCB3ZXJlIGluY29ycmVjdC5cbiAgICAgICAgICAgIGluY29ycmVjdExvZ2luRWwuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcbiAgICAgICAgICAgIHBhc3N3b3JkRWwudmFsdWUgPSAnJ1xuXG4gICAgICAgICAgICBsb2dpbkRpYWxvZy5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxuICAgICAgICAgICAgaWYgKGxvZ2luQmFja2dyb3VuZCkgbG9naW5CYWNrZ3JvdW5kLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBPdGhlcndpc2UsIHdlIGFyZSBsb2dnZWQgaW5cbiAgICAgICAgICAgIGlmIChyZW1lbWJlckNoZWNrLmNoZWNrZWQpIHsgLy8gSXMgdGhlIFwicmVtZW1iZXIgbWVcIiBjaGVja2JveCBjaGVja2VkP1xuICAgICAgICAgICAgICAgIC8vIFNldCBhIGNvb2tpZSB3aXRoIHRoZSB1c2VybmFtZSBhbmQgcGFzc3dvcmQgc28gd2UgY2FuIGxvZyBpbiBhdXRvbWF0aWNhbGx5IGluIHRoZVxuICAgICAgICAgICAgICAgIC8vIGZ1dHVyZSB3aXRob3V0IGhhdmluZyB0byBwcm9tcHQgZm9yIGEgdXNlcm5hbWUgYW5kIHBhc3N3b3JkIGFnYWluXG4gICAgICAgICAgICAgICAgc2V0Q29va2llKCd1c2VyUGFzcycsIHdpbmRvdy5idG9hKHVzZXJuYW1lRWwudmFsdWUgKyAnOicgKyBwYXNzd29yZEVsLnZhbHVlKSwgMTQpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBsb2FkaW5nQmFyLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIlxuICAgICAgICAgICAgY29uc3QgdCA9IERhdGUubm93KClcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5sYXN0VXBkYXRlID0gdFxuICAgICAgICAgICAgaWYgKGxhc3RVcGRhdGVFbCkgbGFzdFVwZGF0ZUVsLmlubmVySFRNTCA9IGZvcm1hdFVwZGF0ZSh0KVxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBwYXJzZShyZXNwLnJlc3BvbnNlLCAwKSAvLyBQYXJzZSB0aGUgZGF0YSBQQ1IgaGFzIHJlcGxpZWQgd2l0aFxuICAgICAgICAgICAgICAgIG9uc3VjY2VzcygpXG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlV3JpdGUoJ2RhdGEnLCBnZXREYXRhKCkpIC8vIFN0b3JlIGZvciBvZmZsaW5lIHVzZVxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpXG4gICAgICAgICAgICAgICAgZGlzcGxheUVycm9yKGUpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgY29uc29sZS5sb2coJ0NvdWxkIG5vdCBsb2cgaW4gdG8gUENSLiBFaXRoZXIgeW91ciBuZXR3b3JrIGNvbm5lY3Rpb24gd2FzIGxvc3QgZHVyaW5nIHlvdXIgdmlzaXQgJyArXG4gICAgICAgICAgICAgICAgICAgICAnb3IgUENSIGlzIGp1c3Qgbm90IHdvcmtpbmcuIEhlcmVcXCdzIHRoZSBlcnJvcjonLCBlcnJvcilcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXREYXRhKCk6IElBcHBsaWNhdGlvbkRhdGF8dW5kZWZpbmVkIHtcbiAgICByZXR1cm4gKHdpbmRvdyBhcyBhbnkpLmRhdGFcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENsYXNzZXMoKTogc3RyaW5nW10ge1xuICAgIGNvbnN0IGRhdGEgPSBnZXREYXRhKClcbiAgICBpZiAoIWRhdGEpIHJldHVybiBbXVxuICAgIHJldHVybiBkYXRhLmNsYXNzZXNcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldERhdGEoZGF0YTogSUFwcGxpY2F0aW9uRGF0YSk6IHZvaWQge1xuICAgICh3aW5kb3cgYXMgYW55KS5kYXRhID0gZGF0YVxufVxuXG4vLyBJbiBQQ1IncyBpbnRlcmZhY2UsIHlvdSBjYW4gY2xpY2sgYSBkYXRlIGluIG1vbnRoIG9yIHdlZWsgdmlldyB0byBzZWUgaXQgaW4gZGF5IHZpZXcuXG4vLyBUaGVyZWZvcmUsIHRoZSBIVE1MIGVsZW1lbnQgdGhhdCBzaG93cyB0aGUgZGF0ZSB0aGF0IHlvdSBjYW4gY2xpY2sgb24gaGFzIGEgaHlwZXJsaW5rIHRoYXQgbG9va3MgbGlrZSBgIzIwMTUtMDQtMjZgLlxuLy8gVGhlIGZ1bmN0aW9uIGJlbG93IHdpbGwgcGFyc2UgdGhhdCBTdHJpbmcgYW5kIHJldHVybiBhIERhdGUgdGltZXN0YW1wXG5mdW5jdGlvbiBwYXJzZURhdGVIYXNoKGVsZW1lbnQ6IEhUTUxBbmNob3JFbGVtZW50KTogbnVtYmVyIHtcbiAgICBjb25zdCBbeWVhciwgbW9udGgsIGRheV0gPSBlbGVtZW50Lmhhc2guc3Vic3RyaW5nKDEpLnNwbGl0KCctJykubWFwKE51bWJlcilcbiAgICByZXR1cm4gKG5ldyBEYXRlKHllYXIsIG1vbnRoIC0gMSwgZGF5KSkuZ2V0VGltZSgpXG59XG5cbi8vIFRoZSAqYXR0YWNobWVudGlmeSogZnVuY3Rpb24gcGFyc2VzIHRoZSBib2R5IG9mIGFuIGFzc2lnbm1lbnQgKCp0ZXh0KikgYW5kIHJldHVybnMgdGhlIGFzc2lnbm1lbnQncyBhdHRhY2htZW50cy5cbi8vIFNpZGUgZWZmZWN0OiB0aGVzZSBhdHRhY2htZW50cyBhcmUgcmVtb3ZlZFxuZnVuY3Rpb24gYXR0YWNobWVudGlmeShlbGVtZW50OiBIVE1MRWxlbWVudCk6IEF0dGFjaG1lbnRBcnJheVtdIHtcbiAgICBjb25zdCBhdHRhY2htZW50czogQXR0YWNobWVudEFycmF5W10gPSBbXVxuXG4gICAgLy8gR2V0IGFsbCBsaW5rc1xuICAgIGNvbnN0IGFzID0gQXJyYXkuZnJvbShlbGVtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdhJykpXG4gICAgYXMuZm9yRWFjaCgoYSkgPT4ge1xuICAgICAgICBpZiAoYS5pZC5pbmNsdWRlcygnQXR0YWNobWVudCcpKSB7XG4gICAgICAgICAgICBhdHRhY2htZW50cy5wdXNoKFtcbiAgICAgICAgICAgICAgICBhLmlubmVySFRNTCxcbiAgICAgICAgICAgICAgICBhLnNlYXJjaCArIGEuaGFzaFxuICAgICAgICAgICAgXSlcbiAgICAgICAgICAgIGEucmVtb3ZlKClcbiAgICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIGF0dGFjaG1lbnRzXG59XG5cbmNvbnN0IFVSTF9SRUdFWCA9IG5ldyBSZWdFeHAoYChcXFxuaHR0cHM/OlxcXFwvXFxcXC9cXFxuWy1BLVowLTkrJkAjXFxcXC8lPz1+X3whOiwuO10qXFxcblstQS1aMC05KyZAI1xcXFwvJT1+X3xdK1xcXG4pYCwgJ2lnJ1xuKVxuXG4vLyBUaGlzIGZ1bmN0aW9uIHJlcGxhY2VzIHRleHQgdGhhdCByZXByZXNlbnRzIGEgaHlwZXJsaW5rIHdpdGggYSBmdW5jdGlvbmFsIGh5cGVybGluayBieSB1c2luZ1xuLy8gamF2YXNjcmlwdCdzIHJlcGxhY2UgZnVuY3Rpb24gd2l0aCBhIHJlZ3VsYXIgZXhwcmVzc2lvbiBpZiB0aGUgdGV4dCBhbHJlYWR5IGlzbid0IHBhcnQgb2YgYVxuLy8gaHlwZXJsaW5rLlxuZnVuY3Rpb24gdXJsaWZ5KHRleHQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRleHQucmVwbGFjZShVUkxfUkVHRVgsIChzdHIsIHN0cjIsIG9mZnNldCkgPT4geyAvLyBGdW5jdGlvbiB0byByZXBsYWNlIG1hdGNoZXNcbiAgICAgICAgaWYgKC9ocmVmXFxzKj1cXHMqLi8udGVzdCh0ZXh0LnN1YnN0cmluZyhvZmZzZXQgLSAxMCwgb2Zmc2V0KSkgfHxcbiAgICAgICAgICAgIC9vcmlnaW5hbHBhdGhcXHMqPVxccyouLy50ZXN0KHRleHQuc3Vic3RyaW5nKG9mZnNldCAtIDIwLCBvZmZzZXQpKVxuICAgICAgICApIHtcbiAgICAgICAgICAgIHJldHVybiBzdHJcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBgPGEgaHJlZj1cIiR7c3RyfVwiPiR7c3RyfTwvYT5gXG4gICAgICAgIH1cbiAgICB9KVxufVxuXG4vLyBBbHNvLCBQQ1JcInMgaW50ZXJmYWNlIHVzZXMgYSBzeXN0ZW0gb2YgSURzIHRvIGlkZW50aWZ5IGRpZmZlcmVudCBlbGVtZW50cy4gRm9yIGV4YW1wbGUsIHRoZSBJRCBvZlxuLy8gb25lIG9mIHRoZSBib3hlcyBzaG93aW5nIHRoZSBuYW1lIG9mIGFuIGFzc2lnbm1lbnQgY291bGQgYmVcbi8vIGBjdGwwMF9jdGwwMF9iYXNlQ29udGVudF9iYXNlQ29udGVudF9mbGFzaFRvcF9jdGwwMF9SYWRTY2hlZHVsZXIxXzk1XzBgLiBUaGUgZnVuY3Rpb24gYmVsb3cgd2lsbFxuLy8gcmV0dXJuIHRoZSBmaXJzdCBIVE1MIGVsZW1lbnQgd2hvc2UgSUQgY29udGFpbnMgYSBzcGVjaWZpZWQgU3RyaW5nICgqaWQqKSBhbmQgY29udGFpbmluZyBhXG4vLyBzcGVjaWZpZWQgdGFnICgqdGFnKikuXG5mdW5jdGlvbiBmaW5kSWQoZWxlbWVudDogSFRNTEVsZW1lbnR8SFRNTERvY3VtZW50LCB0YWc6IHN0cmluZywgaWQ6IHN0cmluZyk6IEhUTUxFbGVtZW50IHtcbiAgICBjb25zdCBlbCA9IFsuLi5lbGVtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKHRhZyldLmZpbmQoKGUpID0+IGUuaWQuaW5jbHVkZXMoaWQpKVxuICAgIGlmICghZWwpIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGZpbmQgZWxlbWVudCB3aXRoIHRhZyAke3RhZ30gYW5kIGlkICR7aWR9IGluICR7ZWxlbWVudH1gKVxuICAgIHJldHVybiBlbCBhcyBIVE1MRWxlbWVudFxufVxuXG5mdW5jdGlvbiBwYXJzZUFzc2lnbm1lbnRUeXBlKHR5cGU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHR5cGUudG9Mb3dlckNhc2UoKS5yZXBsYWNlKCcmIHF1aXp6ZXMnLCAnJykucmVwbGFjZSgndGVzdHMnLCAndGVzdCcpXG59XG5cbmZ1bmN0aW9uIHBhcnNlQXNzaWdubWVudEJhc2VUeXBlKHR5cGU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHR5cGUudG9Mb3dlckNhc2UoKS5yZXBsYWNlKCcmIHF1aXp6ZXMnLCAnJykucmVwbGFjZSgvXFxzL2csICcnKS5yZXBsYWNlKCdxdWl6emVzJywgJ3Rlc3QnKVxufVxuXG5mdW5jdGlvbiBwYXJzZUFzc2lnbm1lbnQoY2E6IEhUTUxFbGVtZW50KTogSUFzc2lnbm1lbnQge1xuICAgIGNvbnN0IGRhdGEgPSBnZXREYXRhKClcbiAgICBpZiAoIWRhdGEpIHRocm93IG5ldyBFcnJvcignRGF0YSBkaWN0aW9uYXJ5IG5vdCBzZXQgdXAnKVxuXG4gICAgLy8gVGhlIHN0YXJ0aW5nIGRhdGUgYW5kIGVuZGluZyBkYXRlIG9mIHRoZSBhc3NpZ25tZW50IGFyZSBwYXJzZWQgZmlyc3RcbiAgICBjb25zdCByYW5nZSA9IGZpbmRJZChjYSwgJ3NwYW4nLCAnU3RhcnRpbmdPbicpLmlubmVySFRNTC5zcGxpdCgnIC0gJylcbiAgICBjb25zdCBhc3NpZ25tZW50U3RhcnQgPSB0b0RhdGVOdW0oRGF0ZS5wYXJzZShyYW5nZVswXSkpXG4gICAgY29uc3QgYXNzaWdubWVudEVuZCA9IChyYW5nZVsxXSAhPSBudWxsKSA/IHRvRGF0ZU51bShEYXRlLnBhcnNlKHJhbmdlWzFdKSkgOiBhc3NpZ25tZW50U3RhcnRcblxuICAgIC8vIFRoZW4sIHRoZSBuYW1lIG9mIHRoZSBhc3NpZ25tZW50IGlzIHBhcnNlZFxuICAgIGNvbnN0IHQgPSBmaW5kSWQoY2EsICdzcGFuJywgJ2xibFRpdGxlJylcbiAgICBsZXQgdGl0bGUgPSB0LmlubmVySFRNTFxuXG4gICAgLy8gVGhlIGFjdHVhbCBib2R5IG9mIHRoZSBhc3NpZ25tZW50IGFuZCBpdHMgYXR0YWNobWVudHMgYXJlIHBhcnNlZCBuZXh0XG4gICAgY29uc3QgYiA9IF8kKF8kKHQucGFyZW50Tm9kZSkucGFyZW50Tm9kZSkgYXMgSFRNTEVsZW1lbnRcbiAgICBbLi4uYi5nZXRFbGVtZW50c0J5VGFnTmFtZSgnZGl2JyldLnNsaWNlKDAsIDIpLmZvckVhY2goKGRpdikgPT4gZGl2LnJlbW92ZSgpKVxuXG4gICAgY29uc3QgYXAgPSBhdHRhY2htZW50aWZ5KGIpIC8vIFNlcGFyYXRlcyBhdHRhY2htZW50cyBmcm9tIHRoZSBib2R5XG5cbiAgICAvLyBUaGUgbGFzdCBSZXBsYWNlIHJlbW92ZXMgbGVhZGluZyBhbmQgdHJhaWxpbmcgbmV3bGluZXNcbiAgICBjb25zdCBhc3NpZ25tZW50Qm9keSA9IHVybGlmeShiLmlubmVySFRNTClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXig/Olxccyo8YnJcXHMqXFwvPz4pKi8sICcnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8oPzpcXHMqPGJyXFxzKlxcLz8+KSpcXHMqJC8sICcnKS50cmltKClcblxuICAgIC8vIEZpbmFsbHksIHdlIHNlcGFyYXRlIHRoZSBjbGFzcyBuYW1lIGFuZCB0eXBlIChob21ld29yaywgY2xhc3N3b3JrLCBvciBwcm9qZWN0cykgZnJvbSB0aGUgdGl0bGUgb2YgdGhlIGFzc2lnbm1lbnRcbiAgICBjb25zdCBtYXRjaGVkVGl0bGUgPSB0aXRsZS5tYXRjaCgvXFwoKFteKV0qXFwpKilcXCkkLylcbiAgICBpZiAoKG1hdGNoZWRUaXRsZSA9PSBudWxsKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBwYXJzZSBhc3NpZ25tZW50IHRpdGxlIFxcXCIke3RpdGxlfVxcXCJgKVxuICAgIH1cbiAgICBjb25zdCBhc3NpZ25tZW50VHlwZSA9IG1hdGNoZWRUaXRsZVsxXVxuICAgIGNvbnN0IGFzc2lnbm1lbnRCYXNlVHlwZSA9IHBhcnNlQXNzaWdubWVudEJhc2VUeXBlKGNhLnRpdGxlLnN1YnN0cmluZygwLCBjYS50aXRsZS5pbmRleE9mKCdcXG4nKSkpXG4gICAgbGV0IGFzc2lnbm1lbnRDbGFzc0luZGV4ID0gbnVsbFxuICAgIGRhdGEuY2xhc3Nlcy5zb21lKChjLCBwb3MpID0+IHtcbiAgICAgICAgaWYgKHRpdGxlLmluZGV4T2YoYykgIT09IC0xKSB7XG4gICAgICAgICAgICBhc3NpZ25tZW50Q2xhc3NJbmRleCA9IHBvc1xuICAgICAgICAgICAgdGl0bGUgPSB0aXRsZS5yZXBsYWNlKGMsICcnKVxuICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICB9KVxuXG4gICAgaWYgKGFzc2lnbm1lbnRDbGFzc0luZGV4ID09PSBudWxsIHx8IGFzc2lnbm1lbnRDbGFzc0luZGV4ID09PSAtMSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBmaW5kIGNsYXNzIGluIHRpdGxlICR7dGl0bGV9IChjbGFzc2VzIGFyZSAke2RhdGEuY2xhc3Nlc31gKVxuICAgIH1cblxuICAgIGNvbnN0IGFzc2lnbm1lbnRUaXRsZSA9IHRpdGxlLnN1YnN0cmluZyh0aXRsZS5pbmRleE9mKCc6ICcpICsgMikucmVwbGFjZSgvXFwoW15cXChcXCldKlxcKSQvLCAnJykudHJpbSgpXG5cbiAgICAvLyBUbyBtYWtlIHN1cmUgdGhlcmUgYXJlIG5vIHJlcGVhdHMsIHRoZSB0aXRsZSBvZiB0aGUgYXNzaWdubWVudCAob25seSBsZXR0ZXJzKSBhbmQgaXRzIHN0YXJ0ICZcbiAgICAvLyBlbmQgZGF0ZSBhcmUgY29tYmluZWQgdG8gZ2l2ZSBpdCBhIHVuaXF1ZSBpZGVudGlmaWVyLlxuICAgIGNvbnN0IGFzc2lnbm1lbnRJZCA9IGFzc2lnbm1lbnRUaXRsZS5yZXBsYWNlKC9bXlxcd10qL2csICcnKSArIChhc3NpZ25tZW50U3RhcnQgKyBhc3NpZ25tZW50RW5kKVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgc3RhcnQ6IGFzc2lnbm1lbnRTdGFydCxcbiAgICAgICAgZW5kOiBhc3NpZ25tZW50RW5kLFxuICAgICAgICBhdHRhY2htZW50czogYXAsXG4gICAgICAgIGJvZHk6IGFzc2lnbm1lbnRCb2R5LFxuICAgICAgICB0eXBlOiBhc3NpZ25tZW50VHlwZSxcbiAgICAgICAgYmFzZVR5cGU6IGFzc2lnbm1lbnRCYXNlVHlwZSxcbiAgICAgICAgY2xhc3M6IGFzc2lnbm1lbnRDbGFzc0luZGV4LFxuICAgICAgICB0aXRsZTogYXNzaWdubWVudFRpdGxlLFxuICAgICAgICBpZDogYXNzaWdubWVudElkXG4gICAgfVxufVxuXG4vLyBUaGUgZnVuY3Rpb24gYmVsb3cgd2lsbCBwYXJzZSB0aGUgZGF0YSBnaXZlbiBieSBQQ1IgYW5kIGNvbnZlcnQgaXQgaW50byBhbiBvYmplY3QuIElmIHlvdSBvcGVuIHVwXG4vLyB0aGUgZGV2ZWxvcGVyIGNvbnNvbGUgb24gQ2hlY2tQQ1IgYW5kIHR5cGUgaW4gYGRhdGFgLCB5b3UgY2FuIHNlZSB0aGUgYXJyYXkgY29udGFpbmluZyBhbGwgb2Zcbi8vIHlvdXIgYXNzaWdubWVudHMuXG5mdW5jdGlvbiBwYXJzZShkb2M6IEhUTUxEb2N1bWVudCwgbW9udGhPZmZzZXQ6IG51bWJlcik6IHZvaWQge1xuICAgIGNvbnNvbGUudGltZSgnSGFuZGxpbmcgZGF0YScpIC8vIFRvIHRpbWUgaG93IGxvbmcgaXQgdGFrZXMgdG8gcGFyc2UgdGhlIGFzc2lnbm1lbnRzXG4gICAgY29uc3QgaGFuZGxlZERhdGFTaG9ydDogc3RyaW5nW10gPSBbXSAvLyBBcnJheSB1c2VkIHRvIG1ha2Ugc3VyZSB3ZSBkb25cInQgcGFyc2UgdGhlIHNhbWUgYXNzaWdubWVudCB0d2ljZS5cbiAgICBjb25zdCBkYXRhOiBJQXBwbGljYXRpb25EYXRhID0ge1xuICAgICAgICBjbGFzc2VzOiBbXSxcbiAgICAgICAgYXNzaWdubWVudHM6IFtdLFxuICAgICAgICBtb250aFZpZXc6IChfJChkb2MucXVlcnlTZWxlY3RvcignLnJzSGVhZGVyTW9udGgnKSkucGFyZW50Tm9kZSBhcyBIVE1MRWxlbWVudCkuY2xhc3NMaXN0LmNvbnRhaW5zKCdyc1NlbGVjdGVkJyksXG4gICAgICAgIG1vbnRoT2Zmc2V0OiBtb250aE9mZnNldFxuICAgIH0gLy8gUmVzZXQgdGhlIGFycmF5IGluIHdoaWNoIGFsbCBvZiB5b3VyIGFzc2lnbm1lbnRzIGFyZSBzdG9yZWQgaW4uXG4gICAgc2V0RGF0YShkYXRhKVxuXG4gICAgZG9jLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0Om5vdChbdHlwZT1cInN1Ym1pdFwiXSknKS5mb3JFYWNoKChlKSA9PiB7XG4gICAgICAgIHZpZXdEYXRhWyhlIGFzIEhUTUxJbnB1dEVsZW1lbnQpLm5hbWVdID0gKGUgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWUgfHwgJydcbiAgICB9KVxuXG4gICAgLy8gTm93LCB0aGUgY2xhc3NlcyB5b3UgdGFrZSBhcmUgcGFyc2VkICh0aGVzZSBhcmUgdGhlIGNoZWNrYm94ZXMgeW91IHNlZSB1cCB0b3Agd2hlbiBsb29raW5nIGF0IFBDUikuXG4gICAgY29uc3QgY2xhc3NlcyA9IGZpbmRJZChkb2MsICd0YWJsZScsICdjYkNsYXNzZXMnKS5nZXRFbGVtZW50c0J5VGFnTmFtZSgnbGFiZWwnKVxuICAgIGNsYXNzZXMuZm9yRWFjaCgoYykgPT4ge1xuICAgICAgICBkYXRhLmNsYXNzZXMucHVzaChjLmlubmVySFRNTClcbiAgICB9KVxuXG4gICAgY29uc3QgYXNzaWdubWVudHMgPSBkb2MuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgncnNBcHQgcnNBcHRTaW1wbGUnKVxuICAgIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwoYXNzaWdubWVudHMsIChhc3NpZ25tZW50RWw6IEhUTUxFbGVtZW50KSA9PiB7XG4gICAgICAgIGNvbnN0IGFzc2lnbm1lbnQgPSBwYXJzZUFzc2lnbm1lbnQoYXNzaWdubWVudEVsKVxuICAgICAgICBpZiAoaGFuZGxlZERhdGFTaG9ydC5pbmRleE9mKGFzc2lnbm1lbnQuaWQpID09PSAtMSkgeyAvLyBNYWtlIHN1cmUgd2UgaGF2ZW4ndCBhbHJlYWR5IHBhcnNlZCB0aGUgYXNzaWdubWVudFxuICAgICAgICAgICAgaGFuZGxlZERhdGFTaG9ydC5wdXNoKGFzc2lnbm1lbnQuaWQpXG4gICAgICAgICAgICBkYXRhLmFzc2lnbm1lbnRzLnB1c2goYXNzaWdubWVudClcbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICBjb25zb2xlLnRpbWVFbmQoJ0hhbmRsaW5nIGRhdGEnKVxuXG4gICAgLy8gTm93IGFsbG93IHRoZSB2aWV3IHRvIGJlIHN3aXRjaGVkXG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdsb2FkZWQnKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdXJsRm9yQXR0YWNobWVudChzZWFyY2g6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIEFUVEFDSE1FTlRTX1VSTCArIHNlYXJjaFxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QXR0YWNobWVudE1pbWVUeXBlKHNlYXJjaDogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBjb25zdCByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuICAgICAgICByZXEub3BlbignSEVBRCcsIHVybEZvckF0dGFjaG1lbnQoc2VhcmNoKSlcbiAgICAgICAgcmVxLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgICAgIGlmIChyZXEuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICAgICAgICBjb25zdCB0eXBlID0gcmVxLmdldFJlc3BvbnNlSGVhZGVyKCdDb250ZW50LVR5cGUnKVxuICAgICAgICAgICAgICAgIGlmICh0eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUodHlwZSlcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKCdDb250ZW50IHR5cGUgaXMgbnVsbCcpKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXEuc2VuZCgpXG4gICAgfSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsYXNzQnlJZChpZDogbnVtYmVyfG51bGx8dW5kZWZpbmVkKTogc3RyaW5nIHtcbiAgICByZXR1cm4gKGlkID8gZ2V0Q2xhc3NlcygpW2lkXSA6IG51bGwpIHx8ICdVbmtub3duIGNsYXNzJ1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3dpdGNoVmlld3MoKTogdm9pZCB7XG4gICAgaWYgKE9iamVjdC5rZXlzKHZpZXdEYXRhKS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGVsZW1CeUlkKCdzaWRlQmFja2dyb3VuZCcpLmNsaWNrKClcbiAgICAgICAgY29uc3QgbmV3Vmlld0RhdGEgPSB7XG4gICAgICAgICAgICAuLi52aWV3RGF0YSxcbiAgICAgICAgICAgIF9fRVZFTlRUQVJHRVQ6ICdjdGwwMCRjdGwwMCRiYXNlQ29udGVudCRiYXNlQ29udGVudCRmbGFzaFRvcCRjdGwwMCRSYWRTY2hlZHVsZXIxJyxcbiAgICAgICAgICAgIF9fRVZFTlRBUkdVTUVOVDogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgIENvbW1hbmQ6IGBTd2l0Y2hUbyR7ZG9jdW1lbnQuYm9keS5nZXRBdHRyaWJ1dGUoJ2RhdGEtcGNydmlldycpID09PSAnbW9udGgnID8gJ1dlZWsnIDogJ01vbnRoJ31WaWV3YFxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBjdGwwMF9jdGwwMF9iYXNlQ29udGVudF9iYXNlQ29udGVudF9mbGFzaFRvcF9jdGwwMF9SYWRTY2hlZHVsZXIxX0NsaWVudFN0YXRlOlxuICAgICAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHtzY3JvbGxUb3A6IDAsIHNjcm9sbExlZnQ6IDAsIGlzRGlydHk6IGZhbHNlfSksXG4gICAgICAgICAgICBjdGwwMF9jdGwwMF9SYWRTY3JpcHRNYW5hZ2VyMV9UU006ICc7O1N5c3RlbS5XZWIuRXh0ZW5zaW9ucywgVmVyc2lvbj00LjAuMC4wLCBDdWx0dXJlPW5ldXRyYWwsICcgK1xuICAgICAgICAgICAgICAgICdQdWJsaWNLZXlUb2tlbj0zMWJmMzg1NmFkMzY0ZTM1OmVuLVVTOmQyODU2OGQzLWU1M2UtNDcwNi05MjhmLTM3NjU5MTJiNjZjYTplYTU5N2Q0YjpiMjUzNzhkMidcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwb3N0QXJyYXk6IHN0cmluZ1tdID0gW10gLy8gQXJyYXkgb2YgZGF0YSB0byBwb3N0XG4gICAgICAgIE9iamVjdC5lbnRyaWVzKG5ld1ZpZXdEYXRhKS5mb3JFYWNoKChbaCwgdl0pID0+IHtcbiAgICAgICAgICAgIHBvc3RBcnJheS5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChoKSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudCh2KSlcbiAgICAgICAgfSlcbiAgICAgICAgemVyb0RhdGVPZmZzZXRzKClcbiAgICAgICAgZmV0Y2godHJ1ZSwgcG9zdEFycmF5LmpvaW4oJyYnKSlcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsb2dvdXQoKTogdm9pZCB7XG4gICAgaWYgKE9iamVjdC5rZXlzKHZpZXdEYXRhKS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGRlbGV0ZUNvb2tpZSgndXNlclBhc3MnKVxuICAgICAgICBlbGVtQnlJZCgnc2lkZUJhY2tncm91bmQnKS5jbGljaygpXG4gICAgICAgIHZpZXdEYXRhLl9fRVZFTlRUQVJHRVQgPSAnY3RsMDAkY3RsMDAkYmFzZUNvbnRlbnQkTG9nb3V0Q29udHJvbDEkTG9naW5TdGF0dXMxJGN0bDAwJ1xuICAgICAgICB2aWV3RGF0YS5fX0VWRU5UQVJHVU1FTlQgPSAnJ1xuICAgICAgICB2aWV3RGF0YS5jdGwwMF9jdGwwMF9iYXNlQ29udGVudF9iYXNlQ29udGVudF9mbGFzaFRvcF9jdGwwMF9SYWRTY2hlZHVsZXIxX0NsaWVudFN0YXRlID1cbiAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHtzY3JvbGxUb3A6IDAsIHNjcm9sbExlZnQ6IDAsIGlzRGlydHk6IGZhbHNlfSlcbiAgICAgICAgY29uc3QgcG9zdEFycmF5OiBzdHJpbmdbXSA9IFtdIC8vIEFycmF5IG9mIGRhdGEgdG8gcG9zdFxuICAgICAgICBPYmplY3QuZW50cmllcyh2aWV3RGF0YSkuZm9yRWFjaCgoW2gsIHZdKSA9PiB7XG4gICAgICAgICAgICBwb3N0QXJyYXkucHVzaChlbmNvZGVVUklDb21wb25lbnQoaCkgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQodikpXG4gICAgICAgIH0pXG4gICAgICAgIGZldGNoKHRydWUsIHBvc3RBcnJheS5qb2luKCcmJykpXG4gICAgICB9XG59XG4iLCJpbXBvcnQgeyBhZGRBY3Rpdml0eUVsZW1lbnQsIGNyZWF0ZUFjdGl2aXR5IH0gZnJvbSAnLi4vY29tcG9uZW50cy9hY3Rpdml0eSdcbmltcG9ydCB7IGdldENhbERhdGVPZmZzZXQgfSBmcm9tICcuLi9uYXZpZ2F0aW9uJ1xuaW1wb3J0IHsgSUFzc2lnbm1lbnQgfSBmcm9tICcuLi9wY3InXG5pbXBvcnQgeyBsb2NhbFN0b3JhZ2VSZWFkLCBsb2NhbFN0b3JhZ2VXcml0ZSB9IGZyb20gJy4uL3V0aWwnXG5cbmV4cG9ydCB0eXBlIEFjdGl2aXR5VHlwZSA9ICdkZWxldGUnIHwgJ2VkaXQnIHwgJ2FkZCdcbmV4cG9ydCB0eXBlIEFjdGl2aXR5SXRlbSA9IFtBY3Rpdml0eVR5cGUsIElBc3NpZ25tZW50LCBudW1iZXIsIHN0cmluZyB8IHVuZGVmaW5lZF1cblxuY29uc3QgQUNUSVZJVFlfU1RPUkFHRV9OQU1FID0gJ2FjdGl2aXR5J1xuXG5sZXQgYWN0aXZpdHk6IEFjdGl2aXR5SXRlbVtdID0gbG9jYWxTdG9yYWdlUmVhZChBQ1RJVklUWV9TVE9SQUdFX05BTUUpIHx8IFtdXG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRBY3Rpdml0eSh0eXBlOiBBY3Rpdml0eVR5cGUsIGFzc2lnbm1lbnQ6IElBc3NpZ25tZW50LCBkYXRlOiBEYXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0FjdGl2aXR5OiBib29sZWFuLCBjbGFzc05hbWU/OiBzdHJpbmcgKTogdm9pZCB7XG4gICAgaWYgKGdldENhbERhdGVPZmZzZXQoKSAhPT0gMCkgcmV0dXJuIC8vIElnbm9yZSBhY3Rpdml0eSB3aGVuIG9uIGFub3RoZXIgbW9udGhcbiAgICBpZiAobmV3QWN0aXZpdHkpIGFjdGl2aXR5LnB1c2goW3R5cGUsIGFzc2lnbm1lbnQsIERhdGUubm93KCksIGNsYXNzTmFtZV0pXG4gICAgY29uc3QgZWwgPSBjcmVhdGVBY3Rpdml0eSh0eXBlLCBhc3NpZ25tZW50LCBkYXRlLCBjbGFzc05hbWUpXG4gICAgYWRkQWN0aXZpdHlFbGVtZW50KGVsKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc2F2ZUFjdGl2aXR5KCk6IHZvaWQge1xuICAgIGFjdGl2aXR5ID0gYWN0aXZpdHkuc2xpY2UoYWN0aXZpdHkubGVuZ3RoIC0gMTI4LCBhY3Rpdml0eS5sZW5ndGgpXG4gICAgbG9jYWxTdG9yYWdlV3JpdGUoQUNUSVZJVFlfU1RPUkFHRV9OQU1FLCBhY3Rpdml0eSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlY2VudEFjdGl2aXR5KCk6IEFjdGl2aXR5SXRlbVtdIHtcbiAgICByZXR1cm4gYWN0aXZpdHkuc2xpY2UoYWN0aXZpdHkubGVuZ3RoIC0gMzIsIGFjdGl2aXR5Lmxlbmd0aClcbn1cbiIsImltcG9ydCB7IGVsZW1CeUlkLCBsb2NhbFN0b3JhZ2VSZWFkLCBsb2NhbFN0b3JhZ2VXcml0ZSB9IGZyb20gJy4uL3V0aWwnXG5cbmNvbnN0IEFUSEVOQV9TVE9SQUdFX05BTUUgPSAnYXRoZW5hRGF0YSdcblxuaW50ZXJmYWNlIElSYXdBdGhlbmFEYXRhIHtcbiAgICByZXNwb25zZV9jb2RlOiAyMDBcbiAgICBib2R5OiB7XG4gICAgICAgIGNvdXJzZXM6IHtcbiAgICAgICAgICAgIGNvdXJzZXM6IElSYXdDb3Vyc2VbXVxuICAgICAgICAgICAgc2VjdGlvbnM6IElSYXdTZWN0aW9uW11cbiAgICAgICAgfVxuICAgIH1cbiAgICBwZXJtaXNzaW9uczogYW55XG59XG5cbmludGVyZmFjZSBJUmF3Q291cnNlIHtcbiAgICBuaWQ6IG51bWJlclxuICAgIGNvdXJzZV90aXRsZTogc3RyaW5nXG4gICAgLy8gVGhlcmUncyBhIGJ1bmNoIG1vcmUgdGhhdCBJJ3ZlIG9taXR0ZWRcbn1cblxuaW50ZXJmYWNlIElSYXdTZWN0aW9uIHtcbiAgICBjb3Vyc2VfbmlkOiBudW1iZXJcbiAgICBsaW5rOiBzdHJpbmdcbiAgICBsb2dvOiBzdHJpbmdcbiAgICBzZWN0aW9uX3RpdGxlOiBzdHJpbmdcbiAgICAvLyBUaGVyZSdzIGEgYnVuY2ggbW9yZSB0aGF0IEkndmUgb21pdHRlZFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIElBdGhlbmFEYXRhSXRlbSB7XG4gICAgbGluazogc3RyaW5nXG4gICAgbG9nbzogc3RyaW5nXG4gICAgcGVyaW9kOiBzdHJpbmdcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJQXRoZW5hRGF0YSB7XG4gICAgW2Nsczogc3RyaW5nXTogSUF0aGVuYURhdGFJdGVtXG59XG5cbmxldCBhdGhlbmFEYXRhOiBJQXRoZW5hRGF0YXxudWxsID0gbG9jYWxTdG9yYWdlUmVhZChBVEhFTkFfU1RPUkFHRV9OQU1FKVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QXRoZW5hRGF0YSgpOiBJQXRoZW5hRGF0YXxudWxsIHtcbiAgICByZXR1cm4gYXRoZW5hRGF0YVxufVxuXG5mdW5jdGlvbiBmb3JtYXRMb2dvKGxvZ286IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGxvZ28uc3Vic3RyKDAsIGxvZ28uaW5kZXhPZignXCIgYWx0PVwiJykpXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoJzxkaXYgY2xhc3M9XCJwcm9maWxlLXBpY3R1cmVcIj48aW1nIHNyYz1cIicsICcnKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKCd0aW55JywgJ3JlZycpXG59XG5cbi8vIE5vdywgdGhlcmUncyB0aGUgc2Nob29sb2d5L2F0aGVuYSBpbnRlZ3JhdGlvbiBzdHVmZi4gRmlyc3QsIHdlIG5lZWQgdG8gY2hlY2sgaWYgaXQncyBiZWVuIG1vcmVcbi8vIHRoYW4gYSBkYXkuIFRoZXJlJ3Mgbm8gcG9pbnQgY29uc3RhbnRseSByZXRyaWV2aW5nIGNsYXNzZXMgZnJvbSBBdGhlbmE7IHRoZXkgZG9udCd0IGNoYW5nZSB0aGF0XG4vLyBtdWNoLlxuXG4vLyBUaGVuLCBvbmNlIHRoZSB2YXJpYWJsZSBmb3IgdGhlIGxhc3QgZGF0ZSBpcyBpbml0aWFsaXplZCwgaXQncyB0aW1lIHRvIGdldCB0aGUgY2xhc3NlcyBmcm9tXG4vLyBhdGhlbmEuIEx1Y2tpbHksIHRoZXJlJ3MgdGhpcyBmaWxlIGF0IC9pYXBpL2NvdXJzZS9hY3RpdmUgLSBhbmQgaXQncyBpbiBKU09OISBMaWZlIGNhbid0IGJlIGFueVxuLy8gYmV0dGVyISBTZXJpb3VzbHkhIEl0J3MganVzdCB0b28gYmFkIHRoZSBsb2dpbiBwYWdlIGlzbid0IGluIEpTT04uXG5mdW5jdGlvbiBwYXJzZUF0aGVuYURhdGEoZGF0OiBzdHJpbmcpOiBJQXRoZW5hRGF0YXxudWxsIHtcbiAgICBpZiAoZGF0ID09PSAnJykgcmV0dXJuIG51bGxcbiAgICBjb25zdCBkID0gSlNPTi5wYXJzZShkYXQpIGFzIElSYXdBdGhlbmFEYXRhXG4gICAgY29uc3QgYXRoZW5hRGF0YTI6IElBdGhlbmFEYXRhID0ge31cbiAgICBjb25zdCBhbGxDb3Vyc2VEZXRhaWxzOiB7IFtuaWQ6IG51bWJlcl06IElSYXdTZWN0aW9uIH0gPSB7fVxuICAgIGQuYm9keS5jb3Vyc2VzLnNlY3Rpb25zLmZvckVhY2goKHNlY3Rpb24pID0+IHtcbiAgICAgICAgYWxsQ291cnNlRGV0YWlsc1tzZWN0aW9uLmNvdXJzZV9uaWRdID0gc2VjdGlvblxuICAgIH0pXG4gICAgZC5ib2R5LmNvdXJzZXMuY291cnNlcy5yZXZlcnNlKCkuZm9yRWFjaCgoY291cnNlKSA9PiB7XG4gICAgICAgIGNvbnN0IGNvdXJzZURldGFpbHMgPSBhbGxDb3Vyc2VEZXRhaWxzW2NvdXJzZS5uaWRdXG4gICAgICAgIGF0aGVuYURhdGEyW2NvdXJzZS5jb3Vyc2VfdGl0bGVdID0ge1xuICAgICAgICAgICAgbGluazogYGh0dHBzOi8vYXRoZW5hLmhhcmtlci5vcmcke2NvdXJzZURldGFpbHMubGlua31gLFxuICAgICAgICAgICAgbG9nbzogZm9ybWF0TG9nbyhjb3Vyc2VEZXRhaWxzLmxvZ28pLFxuICAgICAgICAgICAgcGVyaW9kOiBjb3Vyc2VEZXRhaWxzLnNlY3Rpb25fdGl0bGVcbiAgICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIGF0aGVuYURhdGEyXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVBdGhlbmFEYXRhKGRhdGE6IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnN0IHJlZnJlc2hFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhdGhlbmFEYXRhUmVmcmVzaCcpXG4gICAgdHJ5IHtcbiAgICAgICAgYXRoZW5hRGF0YSA9IHBhcnNlQXRoZW5hRGF0YShkYXRhKVxuICAgICAgICBsb2NhbFN0b3JhZ2VXcml0ZShBVEhFTkFfU1RPUkFHRV9OQU1FLCBhdGhlbmFEYXRhKVxuICAgICAgICBlbGVtQnlJZCgnYXRoZW5hRGF0YUVycm9yJykuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuICAgICAgICBpZiAocmVmcmVzaEVsKSByZWZyZXNoRWwuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGVsZW1CeUlkKCdhdGhlbmFEYXRhRXJyb3InKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xuICAgICAgICBpZiAocmVmcmVzaEVsKSByZWZyZXNoRWwuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuICAgICAgICBlbGVtQnlJZCgnYXRoZW5hRGF0YUVycm9yJykuaW5uZXJIVE1MID0gZS5tZXNzYWdlXG4gICAgfVxufVxuIiwiaW1wb3J0IHsgZ2V0RGF0YSwgSUFwcGxpY2F0aW9uRGF0YSwgSUFzc2lnbm1lbnQgfSBmcm9tICcuLi9wY3InXG5pbXBvcnQgeyBsb2NhbFN0b3JhZ2VSZWFkLCBsb2NhbFN0b3JhZ2VXcml0ZSB9IGZyb20gJy4uL3V0aWwnXG5cbmNvbnN0IENVU1RPTV9TVE9SQUdFX05BTUUgPSAnZXh0cmEnXG5cbmV4cG9ydCBpbnRlcmZhY2UgSUN1c3RvbUFzc2lnbm1lbnQge1xuICAgIGJvZHk6IHN0cmluZ1xuICAgIGRvbmU6IGJvb2xlYW5cbiAgICBzdGFydDogbnVtYmVyXG4gICAgY2xhc3M6IHN0cmluZ3xudWxsXG4gICAgZW5kOiBudW1iZXJ8J0ZvcmV2ZXInXG59XG5cbmNvbnN0IGV4dHJhOiBJQ3VzdG9tQXNzaWdubWVudFtdID0gbG9jYWxTdG9yYWdlUmVhZChDVVNUT01fU1RPUkFHRV9OQU1FLCBbXSlcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEV4dHJhKCk6IElDdXN0b21Bc3NpZ25tZW50W10ge1xuICAgIHJldHVybiBleHRyYVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc2F2ZUV4dHJhKCk6IHZvaWQge1xuICAgIGxvY2FsU3RvcmFnZVdyaXRlKENVU1RPTV9TVE9SQUdFX05BTUUsIGV4dHJhKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYWRkVG9FeHRyYShjdXN0b206IElDdXN0b21Bc3NpZ25tZW50KTogdm9pZCB7XG4gICAgZXh0cmEucHVzaChjdXN0b20pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVGcm9tRXh0cmEoY3VzdG9tOiBJQ3VzdG9tQXNzaWdubWVudCk6IHZvaWQge1xuICAgIGlmICghZXh0cmEuaW5jbHVkZXMoY3VzdG9tKSkgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgcmVtb3ZlIGN1c3RvbSBhc3NpZ25tZW50IHRoYXQgZG9lcyBub3QgZXhpc3QnKVxuICAgIGV4dHJhLnNwbGljZShleHRyYS5pbmRleE9mKGN1c3RvbSksIDEpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBleHRyYVRvVGFzayhjdXN0b206IElDdXN0b21Bc3NpZ25tZW50LCBkYXRhOiBJQXBwbGljYXRpb25EYXRhKTogSUFzc2lnbm1lbnQge1xuICAgIGxldCBjbHM6IG51bWJlcnxudWxsID0gbnVsbFxuICAgIGNvbnN0IGNsYXNzTmFtZSA9IGN1c3RvbS5jbGFzc1xuICAgIGlmIChjbGFzc05hbWUgIT0gbnVsbCkge1xuICAgICAgICBjbHMgPSBkYXRhLmNsYXNzZXMuZmluZEluZGV4KChjKSA9PiBjLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoY2xhc3NOYW1lKSlcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICB0aXRsZTogJ1Rhc2snLFxuICAgICAgICBiYXNlVHlwZTogJ3Rhc2snLFxuICAgICAgICB0eXBlOiAndGFzaycsXG4gICAgICAgIGF0dGFjaG1lbnRzOiBbXSxcbiAgICAgICAgc3RhcnQ6IGN1c3RvbS5zdGFydCxcbiAgICAgICAgZW5kOiBjdXN0b20uZW5kIHx8ICdGb3JldmVyJyxcbiAgICAgICAgYm9keTogY3VzdG9tLmJvZHksXG4gICAgICAgIGlkOiBgdGFzayR7Y3VzdG9tLmJvZHkucmVwbGFjZSgvW15cXHddKi9nLCAnJyl9JHtjdXN0b20uc3RhcnR9JHtjdXN0b20uZW5kfSR7Y3VzdG9tLmNsYXNzfWAsXG4gICAgICAgIGNsYXNzOiBjbHMgPT09IC0xID8gbnVsbCA6IGNsc1xuICAgIH1cbn1cblxuaW50ZXJmYWNlIElQYXJzZVJlc3VsdCB7XG4gICAgdGV4dDogc3RyaW5nXG4gICAgY2xzPzogc3RyaW5nXG4gICAgZHVlPzogc3RyaW5nXG4gICAgc3Q/OiBzdHJpbmdcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlQ3VzdG9tVGFzayh0ZXh0OiBzdHJpbmcsIHJlc3VsdDogSVBhcnNlUmVzdWx0ID0geyB0ZXh0OiAnJyB9KTogSVBhcnNlUmVzdWx0IHtcbiAgICBjb25zdCBwYXJzZWQgPSB0ZXh0Lm1hdGNoKC8oLiopIChmb3J8Ynl8ZHVlfGFzc2lnbmVkfHN0YXJ0aW5nfGVuZGluZ3xiZWdpbm5pbmcpICguKikvKVxuICAgIGlmIChwYXJzZWQgPT0gbnVsbCkge1xuICAgICAgICByZXN1bHQudGV4dCA9IHRleHRcbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgIH1cblxuICAgIHN3aXRjaCAocGFyc2VkWzJdKSB7XG4gICAgICAgIGNhc2UgJ2Zvcic6IHJlc3VsdC5jbHMgPSBwYXJzZWRbM107IGJyZWFrXG4gICAgICAgIGNhc2UgJ2J5JzogY2FzZSAnZHVlJzogY2FzZSAnZW5kaW5nJzogcmVzdWx0LmR1ZSA9IHBhcnNlZFszXTsgYnJlYWtcbiAgICAgICAgY2FzZSAnYXNzaWduZWQnOiBjYXNlICdzdGFydGluZyc6IGNhc2UgJ2JlZ2lubmluZyc6IHJlc3VsdC5zdCA9IHBhcnNlZFszXTsgYnJlYWtcbiAgICB9XG5cbiAgICByZXR1cm4gcGFyc2VDdXN0b21UYXNrKHBhcnNlZFsxXSwgcmVzdWx0KVxufVxuIiwiaW1wb3J0IHsgbG9jYWxTdG9yYWdlUmVhZCwgbG9jYWxTdG9yYWdlV3JpdGUgfSBmcm9tICcuLi91dGlsJ1xuXG5jb25zdCBET05FX1NUT1JBR0VfTkFNRSA9ICdkb25lJ1xuXG5jb25zdCBkb25lOiBzdHJpbmdbXSA9IGxvY2FsU3RvcmFnZVJlYWQoRE9ORV9TVE9SQUdFX05BTUUsIFtdKVxuXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlRnJvbURvbmUoaWQ6IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnN0IGluZGV4ID0gZG9uZS5pbmRleE9mKGlkKVxuICAgIGlmIChpbmRleCA+PSAwKSBkb25lLnNwbGljZShpbmRleCwgMSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZFRvRG9uZShpZDogc3RyaW5nKTogdm9pZCB7XG4gICAgZG9uZS5wdXNoKGlkKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc2F2ZURvbmUoKTogdm9pZCB7XG4gICAgbG9jYWxTdG9yYWdlV3JpdGUoRE9ORV9TVE9SQUdFX05BTUUsIGRvbmUpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3NpZ25tZW50SW5Eb25lKGlkOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gZG9uZS5pbmNsdWRlcyhpZClcbn1cbiIsImltcG9ydCB7IGxvY2FsU3RvcmFnZVJlYWQsIGxvY2FsU3RvcmFnZVdyaXRlIH0gZnJvbSAnLi4vdXRpbCdcblxuY29uc3QgTU9ESUZJRURfU1RPUkFHRV9OQU1FID0gJ21vZGlmaWVkJ1xuXG5pbnRlcmZhY2UgSU1vZGlmaWVkQm9kaWVzIHtcbiAgICBbaWQ6IHN0cmluZ106IHN0cmluZ1xufVxuXG5jb25zdCBtb2RpZmllZDogSU1vZGlmaWVkQm9kaWVzID0gbG9jYWxTdG9yYWdlUmVhZChNT0RJRklFRF9TVE9SQUdFX05BTUUsIHt9KVxuXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlRnJvbU1vZGlmaWVkKGlkOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBkZWxldGUgbW9kaWZpZWRbaWRdXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzYXZlTW9kaWZpZWQoKTogdm9pZCB7XG4gICAgbG9jYWxTdG9yYWdlV3JpdGUoTU9ESUZJRURfU1RPUkFHRV9OQU1FLCBtb2RpZmllZClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2lnbm1lbnRJbk1vZGlmaWVkKGlkOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gbW9kaWZpZWQuaGFzT3duUHJvcGVydHkoaWQpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtb2RpZmllZEJvZHkoaWQ6IHN0cmluZyk6IHN0cmluZ3x1bmRlZmluZWQge1xuICAgIHJldHVybiBtb2RpZmllZFtpZF1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldE1vZGlmaWVkKGlkOiBzdHJpbmcsIGJvZHk6IHN0cmluZyk6IHZvaWQge1xuICAgIG1vZGlmaWVkW2lkXSA9IGJvZHlcbn1cbiIsImltcG9ydCB7IGxvY2FsU3RvcmFnZVJlYWQsIGxvY2FsU3RvcmFnZVdyaXRlIH0gZnJvbSAnLi91dGlsJ1xuXG50eXBlIEFzc2lnbm1lbnRTcGFuID0gJ211bHRpcGxlJyB8ICdzdGFydCcgfCAnZW5kJ1xudHlwZSBIaWRlQXNzaWdubWVudHMgPSAnZGF5JyB8ICdtcycgfCAndXMnXG50eXBlIENvbG9yVHlwZSA9ICdhc3NpZ25tZW50JyB8ICdjbGFzcydcbmludGVyZmFjZSBJU2hvd25BY3Rpdml0eSB7XG4gICAgYWRkOiBib29sZWFuXG4gICAgZWRpdDogYm9vbGVhblxuICAgIGRlbGV0ZTogYm9vbGVhblxufVxuXG5leHBvcnQgY29uc3Qgc2V0dGluZ3MgPSB7XG4gICAgLyoqXG4gICAgICogTWludXRlcyBiZXR3ZWVuIGVhY2ggYXV0b21hdGljIHJlZnJlc2ggb2YgdGhlIHBhZ2UuIE5lZ2F0aXZlIG51bWJlcnMgaW5kaWNhdGUgbm8gYXV0b21hdGljXG4gICAgICogcmVmcmVzaGluZy5cbiAgICAgKi9cbiAgICBnZXQgcmVmcmVzaFJhdGUoKTogbnVtYmVyIHsgcmV0dXJuIGxvY2FsU3RvcmFnZVJlYWQoJ3JlZnJlc2hSYXRlJywgLTEpIH0sXG4gICAgc2V0IHJlZnJlc2hSYXRlKHY6IG51bWJlcikgeyBsb2NhbFN0b3JhZ2VXcml0ZSgncmVmcmVzaFJhdGUnLCB2KSB9LFxuXG4gICAgLyoqXG4gICAgICogV2hldGhlciB0aGUgd2luZG93IHNob3VsZCByZWZyZXNoIGFzc2lnbm1lbnQgZGF0YSB3aGVuIGZvY3Vzc2VkXG4gICAgICovXG4gICAgZ2V0IHJlZnJlc2hPbkZvY3VzKCk6IGJvb2xlYW4geyByZXR1cm4gbG9jYWxTdG9yYWdlUmVhZCgncmVmcmVzaE9uRm9jdXMnLCB0cnVlKSB9LFxuICAgIHNldCByZWZyZXNoT25Gb2N1cyh2OiBib29sZWFuKSB7IGxvY2FsU3RvcmFnZVdyaXRlKCdyZWZyZXNoT25Gb2N1cycsIHYpIH0sXG5cbiAgICAvKipcbiAgICAgKiBXaGV0aGVyIHN3aXRjaGluZyBiZXR3ZWVuIHZpZXdzIHNob3VsZCBiZSBhbmltYXRlZFxuICAgICAqL1xuICAgIGdldCB2aWV3VHJhbnMoKTogYm9vbGVhbiB7IHJldHVybiBsb2NhbFN0b3JhZ2VSZWFkKCd2aWV3VHJhbnMnLCB0cnVlKSB9LFxuICAgIHNldCB2aWV3VHJhbnModjogYm9vbGVhbikgeyBsb2NhbFN0b3JhZ2VXcml0ZSgndmlld1RyYW5zJywgdikgfSxcblxuICAgIC8qKlxuICAgICAqIE51bWJlciBvZiBkYXlzIGVhcmx5IHRvIHNob3cgdGVzdHMgaW4gbGlzdCB2aWV3XG4gICAgICovXG4gICAgZ2V0IGVhcmx5VGVzdCgpOiBudW1iZXIgeyByZXR1cm4gbG9jYWxTdG9yYWdlUmVhZCgnZWFybHlUZXN0JywgMSkgfSxcbiAgICBzZXQgZWFybHlUZXN0KHY6IG51bWJlcikgeyBsb2NhbFN0b3JhZ2VXcml0ZSgnZWFybHlUZXN0JywgdikgfSxcblxuICAgIC8qKlxuICAgICAqIFdoZXRoZXIgdG8gdGFrZSB0YXNrcyBvZmYgdGhlIGNhbGVuZGFyIHZpZXcgYW5kIHNob3cgdGhlbSBpbiB0aGUgaW5mbyBwYW5lXG4gICAgICovXG4gICAgZ2V0IHNlcFRhc2tzKCk6IGJvb2xlYW4geyByZXR1cm4gbG9jYWxTdG9yYWdlUmVhZCgnc2VwVGFza3MnLCBmYWxzZSkgfSxcbiAgICBzZXQgc2VwVGFza3ModjogYm9vbGVhbikgeyBsb2NhbFN0b3JhZ2VXcml0ZSgnc2VwVGFza3MnLCB2KSB9LFxuXG4gICAgLyoqXG4gICAgICogV2hldGhlciB0YXNrcyBzaG91bGQgaGF2ZSB0aGVpciBvd24gY29sb3JcbiAgICAgKi9cbiAgICBnZXQgc2VwVGFza0NsYXNzKCk6IGJvb2xlYW4geyByZXR1cm4gbG9jYWxTdG9yYWdlUmVhZCgnc2VwVGFza0NsYXNzJywgZmFsc2UpIH0sXG4gICAgc2V0IHNlcFRhc2tDbGFzcyh2OiBib29sZWFuKSB7IGxvY2FsU3RvcmFnZVdyaXRlKCdzZXBUYXNrQ2xhc3MnLCB2KSB9LFxuXG4gICAgLyoqXG4gICAgICogV2hldGhlciBwcm9qZWN0cyBzaG93IHVwIGluIHRoZSB0ZXN0IHBhZ2VcbiAgICAgKi9cbiAgICBnZXQgcHJvamVjdHNJblRlc3RQYW5lKCk6IGJvb2xlYW4geyByZXR1cm4gbG9jYWxTdG9yYWdlUmVhZCgncHJvamVjdHNJblRlc3RQYW5lJywgZmFsc2UpIH0sXG4gICAgc2V0IHByb2plY3RzSW5UZXN0UGFuZSh2OiBib29sZWFuKSB7IGxvY2FsU3RvcmFnZVdyaXRlKCdwcm9qZWN0c0luVGVzdFBhbmUnLCB2KSB9LFxuXG4gICAgLyoqXG4gICAgICogV2hlbiBhc3NpZ25tZW50cyBzaG91bGQgYmUgc2hvd24gb24gY2FsZW5kYXIgdmlld1xuICAgICAqL1xuICAgIGdldCBhc3NpZ25tZW50U3BhbigpOiBBc3NpZ25tZW50U3BhbiB7IHJldHVybiBsb2NhbFN0b3JhZ2VSZWFkKCdhc3NpZ25tZW50U3BhbicsICdtdWx0aXBsZScpIH0sXG4gICAgc2V0IGFzc2lnbm1lbnRTcGFuKHY6IEFzc2lnbm1lbnRTcGFuKSB7IGxvY2FsU3RvcmFnZVdyaXRlKCdhc3NpZ25tZW50U3BhbicsIHYpIH0sXG5cbiAgICAvKipcbiAgICAgKiBXaGVuIGFzc2lnbm1lbnRzIHNob3VsZCBkaXNhcHBlYXIgZnJvbSBsaXN0IHZpZXdcbiAgICAgKi9cbiAgICBnZXQgaGlkZUFzc2lnbm1lbnRzKCk6IEhpZGVBc3NpZ25tZW50cyB7IHJldHVybiBsb2NhbFN0b3JhZ2VSZWFkKCdoaWRlQXNzaWdubWVudHMnLCAnZGF5JykgfSxcbiAgICBzZXQgaGlkZUFzc2lnbm1lbnRzKHY6IEhpZGVBc3NpZ25tZW50cykgeyBsb2NhbFN0b3JhZ2VXcml0ZSgnaGlkZUFzc2lnbm1lbnRzJywgdikgfSxcblxuICAgIC8qKlxuICAgICAqIFdoZXRoZXIgdG8gdXNlIGhvbGlkYXkgdGhlbWluZ1xuICAgICAqL1xuICAgIGdldCBob2xpZGF5VGhlbWVzKCk6IGJvb2xlYW4geyByZXR1cm4gbG9jYWxTdG9yYWdlUmVhZCgnaG9saWRheVRoZW1lcycsIGZhbHNlKSB9LFxuICAgIHNldCBob2xpZGF5VGhlbWVzKHY6IGJvb2xlYW4pIHsgbG9jYWxTdG9yYWdlV3JpdGUoJ2hvbGlkYXlUaGVtZXMnLCB2KSB9LFxuXG4gICAgLyoqXG4gICAgICogV2hldGhlciB0byBjb2xvciBhc3NpZ25tZW50cyBiYXNlZCBvbiB0aGVpciB0eXBlIG9yIGNsYXNzXG4gICAgICovXG4gICAgZ2V0IGNvbG9yVHlwZSgpOiBDb2xvclR5cGUgeyByZXR1cm4gbG9jYWxTdG9yYWdlUmVhZCgnY29sb3JUeXBlJywgJ2Fzc2lnbm1lbnQnKSB9LFxuICAgIHNldCBjb2xvclR5cGUodjogQ29sb3JUeXBlKSB7IGxvY2FsU3RvcmFnZVdyaXRlKCdjb2xvclR5cGUnLCB2KSB9LFxuXG4gICAgLyoqXG4gICAgICogV2hpY2ggdHlwZXMgb2YgYWN0aXZpdHkgYXJlIHNob3duIGluIHRoZSBhY3Rpdml0eSBwYW5lXG4gICAgICovXG4gICAgZ2V0IHNob3duQWN0aXZpdHkoKTogSVNob3duQWN0aXZpdHkgeyByZXR1cm4gbG9jYWxTdG9yYWdlUmVhZCgnc2hvd25BY3Rpdml0eScsIHtcbiAgICAgICAgYWRkOiB0cnVlLFxuICAgICAgICBlZGl0OiB0cnVlLFxuICAgICAgICBkZWxldGU6IHRydWVcbiAgICB9KSB9LFxuICAgIHNldCBzaG93bkFjdGl2aXR5KHY6IElTaG93bkFjdGl2aXR5KSB7IGxvY2FsU3RvcmFnZVdyaXRlKCdzaG93bkFjdGl2aXR5JywgdikgfSxcblxuICAgIC8qKlxuICAgICAqIFdoZXRoZXIgdG8gZGlzcGxheSB0YXNrcyBpbiB0aGUgdGFzayBwYW5lIHRoYXQgYXJlIGNvbXBsZXRlZFxuICAgICAqL1xuICAgIGdldCBzaG93RG9uZVRhc2tzKCk6IGJvb2xlYW4geyByZXR1cm4gbG9jYWxTdG9yYWdlUmVhZCgnc2hvd0RvbmVUYXNrcycsIGZhbHNlKSB9LFxuICAgIHNldCBzaG93RG9uZVRhc2tzKHY6IGJvb2xlYW4pIHsgbG9jYWxTdG9yYWdlV3JpdGUoJ3Nob3dEb25lVGFza3MnLCB2KSB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTZXR0aW5nKG5hbWU6IHN0cmluZyk6IGFueSB7XG4gICAgaWYgKCFzZXR0aW5ncy5oYXNPd25Qcm9wZXJ0eShuYW1lKSkgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHNldHRpbmcgbmFtZSAke25hbWV9YClcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgcmV0dXJuIHNldHRpbmdzW25hbWVdXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRTZXR0aW5nKG5hbWU6IHN0cmluZywgdmFsdWU6IGFueSk6IHZvaWQge1xuICAgIGlmICghc2V0dGluZ3MuaGFzT3duUHJvcGVydHkobmFtZSkpIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBzZXR0aW5nIG5hbWUgJHtuYW1lfWApXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIHNldHRpbmdzW25hbWVdID0gdmFsdWVcbn1cbiIsImltcG9ydCB7IGZyb21EYXRlTnVtLCB0b0RhdGVOdW0gfSBmcm9tICcuL2RhdGVzJ1xuXG4vLyBAdHMtaWdub3JlIFRPRE86IE1ha2UgdGhpcyBsZXNzIGhhY2t5XG5Ob2RlTGlzdC5wcm90b3R5cGUuZm9yRWFjaCA9IEhUTUxDb2xsZWN0aW9uLnByb3RvdHlwZS5mb3JFYWNoID0gQXJyYXkucHJvdG90eXBlLmZvckVhY2hcblxuLyoqXG4gKiBGb3JjZXMgYSBsYXlvdXQgb24gYW4gZWxlbWVudFxuICovXG5leHBvcnQgZnVuY3Rpb24gZm9yY2VMYXlvdXQoZWw6IEhUTUxFbGVtZW50KTogdm9pZCB7XG4gICAgLy8gVGhpcyBpbnZvbHZlcyBhIGxpdHRsZSB0cmlja2VyeSBpbiB0aGF0IGJ5IHJlcXVlc3RpbmcgdGhlIGNvbXB1dGVkIGhlaWdodCBvZiB0aGUgZWxlbWVudCB0aGVcbiAgICAvLyBicm93c2VyIGlzIGZvcmNlZCB0byBkbyBhIGZ1bGwgbGF5b3V0XG5cbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLWV4cHJlc3Npb25cbiAgICBlbC5vZmZzZXRIZWlnaHRcbn1cblxuLyoqXG4gKiBSZXR1cm4gYSBzdHJpbmcgd2l0aCB0aGUgZmlyc3QgbGV0dGVyIGNhcGl0YWxpemVkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjYXBpdGFsaXplU3RyaW5nKHN0cjogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gc3RyLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc3RyLnN1YnN0cigxKVxufVxuXG4vKipcbiAqIFJldHVybnMgYW4gWE1MSHR0cFJlcXVlc3Qgd2l0aCB0aGUgc3BlY2lmaWVkIHVybCwgcmVzcG9uc2UgdHlwZSwgaGVhZGVycywgYW5kIGRhdGFcbiAqL1xuZnVuY3Rpb24gY29uc3RydWN0WE1MSHR0cFJlcXVlc3QodXJsOiBzdHJpbmcsIHJlc3BUeXBlPzogWE1MSHR0cFJlcXVlc3RSZXNwb25zZVR5cGV8bnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRlcnM/OiB7W25hbWU6IHN0cmluZ106IHN0cmluZ318bnVsbCwgZGF0YT86IHN0cmluZ3xudWxsKTogWE1MSHR0cFJlcXVlc3Qge1xuICAgIGNvbnN0IHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG5cbiAgICAvLyBJZiBQT1NUIGRhdGEgaXMgcHJvdmlkZWQgc2VuZCBhIFBPU1QgcmVxdWVzdCwgb3RoZXJ3aXNlIHNlbmQgYSBHRVQgcmVxdWVzdFxuICAgIHJlcS5vcGVuKChkYXRhID8gJ1BPU1QnIDogJ0dFVCcpLCB1cmwsIHRydWUpXG5cbiAgICBpZiAocmVzcFR5cGUpIHJlcS5yZXNwb25zZVR5cGUgPSByZXNwVHlwZVxuXG4gICAgaWYgKGhlYWRlcnMpIHtcbiAgICAgICAgT2JqZWN0LmtleXMoaGVhZGVycykuZm9yRWFjaCgoaGVhZGVyKSA9PiB7XG4gICAgICAgICAgICByZXEuc2V0UmVxdWVzdEhlYWRlcihoZWFkZXIsIGhlYWRlcnNbaGVhZGVyXSlcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICAvLyBJZiBkYXRhIGlzIHVuZGVmaW5lZCBkZWZhdWx0IHRvIHRoZSBub3JtYWwgcmVxLnNlbmQoKSwgb3RoZXJ3aXNlIHBhc3MgdGhlIGRhdGEgaW5cbiAgICByZXEuc2VuZChkYXRhKVxuICAgIHJldHVybiByZXFcbn1cblxuLyoqIFNlbmRzIGEgcmVxdWVzdCB0byBhIHNlcnZlciBhbmQgcmV0dXJucyBhIFByb21pc2UuXG4gKiBAcGFyYW0gdXJsIHRoZSB1cmwgdG8gcmV0cmlldmVcbiAqIEBwYXJhbSByZXNwVHlwZSB0aGUgdHlwZSBvZiByZXNwb25zZSB0aGF0IHNob3VsZCBiZSByZWNlaXZlZFxuICogQHBhcmFtIGhlYWRlcnMgdGhlIGhlYWRlcnMgdGhhdCB3aWxsIGJlIHNlbnQgdG8gdGhlIHNlcnZlclxuICogQHBhcmFtIGRhdGEgdGhlIGRhdGEgdGhhdCB3aWxsIGJlIHNlbnQgdG8gdGhlIHNlcnZlciAob25seSBmb3IgUE9TVCByZXF1ZXN0cylcbiAqIEBwYXJhbSBwcm9ncmVzc0VsZW1lbnQgYW4gb3B0aW9uYWwgZWxlbWVudCBmb3IgdGhlIHByb2dyZXNzIGJhciB1c2VkIHRvIGRpc3BsYXkgdGhlIHN0YXR1cyBvZiB0aGUgcmVxdWVzdFxuICovXG5leHBvcnQgZnVuY3Rpb24gc2VuZCh1cmw6IHN0cmluZywgcmVzcFR5cGU/OiBYTUxIdHRwUmVxdWVzdFJlc3BvbnNlVHlwZXxudWxsLCBoZWFkZXJzPzoge1tuYW1lOiBzdHJpbmddOiBzdHJpbmd9fG51bGwsXG4gICAgICAgICAgICAgICAgICAgICBkYXRhPzogc3RyaW5nfG51bGwsIHByb2dyZXNzPzogSFRNTEVsZW1lbnR8bnVsbCk6IFByb21pc2U8WE1MSHR0cFJlcXVlc3Q+IHtcblxuICAgIGNvbnN0IHJlcSA9IGNvbnN0cnVjdFhNTEh0dHBSZXF1ZXN0KHVybCwgcmVzcFR5cGUsIGhlYWRlcnMsIGRhdGEpXG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgICAgIGNvbnN0IHByb2dyZXNzSW5uZXIgPSBwcm9ncmVzcyA/IHByb2dyZXNzLnF1ZXJ5U2VsZWN0b3IoJ2RpdicpIDogbnVsbFxuICAgICAgICBpZiAocHJvZ3Jlc3MgJiYgcHJvZ3Jlc3NJbm5lcikge1xuICAgICAgICAgICAgZm9yY2VMYXlvdXQocHJvZ3Jlc3NJbm5lcikgLy8gV2FpdCBmb3IgaXQgdG8gcmVuZGVyXG4gICAgICAgICAgICBwcm9ncmVzcy5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKSAvLyBEaXNwbGF5IHRoZSBwcm9ncmVzcyBiYXJcbiAgICAgICAgICAgIGlmIChwcm9ncmVzc0lubmVyLmNsYXNzTGlzdC5jb250YWlucygnZGV0ZXJtaW5hdGUnKSkge1xuICAgICAgICAgICAgICAgIHByb2dyZXNzSW5uZXIuY2xhc3NMaXN0LnJlbW92ZSgnZGV0ZXJtaW5hdGUnKVxuICAgICAgICAgICAgICAgIHByb2dyZXNzSW5uZXIuY2xhc3NMaXN0LmFkZCgnaW5kZXRlcm1pbmF0ZScpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTb21ldGltZXMgdGhlIGJyb3dzZXIgd29uJ3QgZ2l2ZSB0aGUgdG90YWwgYnl0ZXMgaW4gdGhlIHJlc3BvbnNlLCBzbyB1c2UgcGFzdCByZXN1bHRzIG9yXG4gICAgICAgIC8vIGEgZGVmYXVsdCBvZiAxNzAsMDAwIGJ5dGVzIGlmIHRoZSBicm93c2VyIGRvZXNuJ3QgcHJvdmlkZSB0aGUgbnVtYmVyXG4gICAgICAgIGNvbnN0IGxvYWQgPSBsb2NhbFN0b3JhZ2VSZWFkKCdsb2FkJywgMTcwMDAwKVxuICAgICAgICBsZXQgY29tcHV0ZWRMb2FkID0gMFxuXG4gICAgICAgIHJlcS5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKGV2dCkgPT4ge1xuICAgICAgICAgICAgLy8gQ2FjaGUgdGhlIG51bWJlciBvZiBieXRlcyBsb2FkZWQgc28gaXQgY2FuIGJlIHVzZWQgZm9yIGJldHRlciBlc3RpbWF0ZXMgbGF0ZXIgb25cbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZVdyaXRlKCdsb2FkJywgY29tcHV0ZWRMb2FkKVxuICAgICAgICAgICAgaWYgKHByb2dyZXNzKSBwcm9ncmVzcy5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuICAgICAgICAgICAgLy8gUmVzb2x2ZSB3aXRoIHRoZSByZXF1ZXN0XG4gICAgICAgICAgICBpZiAocmVxLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShyZXEpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlamVjdChFcnJvcihyZXEuc3RhdHVzVGV4dCkpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgcmVxLmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHByb2dyZXNzKSBwcm9ncmVzcy5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuICAgICAgICAgICAgcmVqZWN0KEVycm9yKCdOZXR3b3JrIEVycm9yJykpXG4gICAgICAgIH0pXG5cbiAgICAgICAgaWYgKHByb2dyZXNzICYmIHByb2dyZXNzSW5uZXIpIHtcbiAgICAgICAgICAgIHJlcS5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIChldnQpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBVcGRhdGUgdGhlIHByb2dyZXNzIGJhclxuICAgICAgICAgICAgICAgIGlmIChwcm9ncmVzc0lubmVyLmNsYXNzTGlzdC5jb250YWlucygnaW5kZXRlcm1pbmF0ZScpKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb2dyZXNzSW5uZXIuY2xhc3NMaXN0LnJlbW92ZSgnaW5kZXRlcm1pbmF0ZScpXG4gICAgICAgICAgICAgICAgICAgIHByb2dyZXNzSW5uZXIuY2xhc3NMaXN0LmFkZCgnZGV0ZXJtaW5hdGUnKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb21wdXRlZExvYWQgPSBldnQubG9hZGVkXG4gICAgICAgICAgICAgICAgcHJvZ3Jlc3NJbm5lci5zdHlsZS53aWR0aCA9ICgoMTAwICogZXZ0LmxvYWRlZCkgLyAoZXZ0Lmxlbmd0aENvbXB1dGFibGUgPyBldnQudG90YWwgOiBsb2FkKSkgKyAnJSdcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9KVxufVxuXG4vKipcbiAqIFRoZSBlcXVpdmFsZW50IG9mIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkIGJ1dCB0aHJvd3MgYW4gZXJyb3IgaWYgdGhlIGVsZW1lbnQgaXMgbm90IGRlZmluZWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGVsZW1CeUlkKGlkOiBzdHJpbmcpOiBIVE1MRWxlbWVudCB7XG4gICAgY29uc3QgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZClcbiAgICBpZiAoZWwgPT0gbnVsbCkgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCBlbGVtZW50IHdpdGggaWQgJHtpZH1gKVxuICAgIHJldHVybiBlbFxufVxuXG4vKipcbiAqIEEgbGl0dGxlIGhlbHBlciBmdW5jdGlvbiB0byBzaW1wbGlmeSB0aGUgY3JlYXRpb24gb2YgSFRNTCBlbGVtZW50c1xuICovXG5leHBvcnQgZnVuY3Rpb24gZWxlbWVudCh0YWc6IHN0cmluZywgY2xzOiBzdHJpbmd8c3RyaW5nW10sIGh0bWw/OiBzdHJpbmd8bnVsbCwgaWQ/OiBzdHJpbmd8bnVsbCk6IEhUTUxFbGVtZW50IHtcbiAgICBjb25zdCBlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWcpXG5cbiAgICBpZiAodHlwZW9mIGNscyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgZS5jbGFzc0xpc3QuYWRkKGNscylcbiAgICB9IGVsc2Uge1xuICAgICAgICBjbHMuZm9yRWFjaCgoYykgPT4gZS5jbGFzc0xpc3QuYWRkKGMpKVxuICAgIH1cblxuICAgIGlmIChodG1sKSBlLmlubmVySFRNTCA9IGh0bWxcbiAgICBpZiAoaWQpIGUuc2V0QXR0cmlidXRlKCdpZCcsIGlkKVxuXG4gICAgcmV0dXJuIGVcbn1cblxuLyoqXG4gKiBUaHJvd3MgYW4gZXJyb3IgaWYgdGhlIHN1cHBsaWVkIGFyZ3VtZW50IGlzIG51bGwsIG90aGVyd2lzZSByZXR1cm5zIHRoZSBhcmd1bWVudFxuICovXG5leHBvcnQgZnVuY3Rpb24gXyQ8VD4oYXJnOiBUfG51bGwpOiBUIHtcbiAgICBpZiAoYXJnID09IG51bGwpIHRocm93IG5ldyBFcnJvcignRXhwZWN0ZWQgYXJndW1lbnQgdG8gYmUgbm9uLW51bGwnKVxuICAgIHJldHVybiBhcmdcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF8kaChhcmc6IE5vZGV8RXZlbnRUYXJnZXR8bnVsbCk6IEhUTUxFbGVtZW50IHtcbiAgICBpZiAoYXJnID09IG51bGwpIHRocm93IG5ldyBFcnJvcignRXhwZWN0ZWQgbm9kZSB0byBiZSBub24tbnVsbCcpXG4gICAgaWYgKCEoYXJnIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpKSB0aHJvdyBuZXcgRXJyb3IoJ05vZGUgaXMgbm90IGFuIEhUTUwgZWxlbWVudCcpXG4gICAgcmV0dXJuIGFyZ1xufVxuXG4vLyBCZWNhdXNlIHNvbWUgbG9jYWxTdG9yYWdlIGVudHJpZXMgY2FuIGJlY29tZSBjb3JydXB0ZWQgZHVlIHRvIGVycm9yIHNpZGUgZWZmZWN0cywgdGhlIGJlbG93XG4vLyBtZXRob2QgdHJpZXMgdG8gcmVhZCBhIHZhbHVlIGZyb20gbG9jYWxTdG9yYWdlIGFuZCBoYW5kbGVzIGVycm9ycy5cbmV4cG9ydCBmdW5jdGlvbiBsb2NhbFN0b3JhZ2VSZWFkKG5hbWU6IHN0cmluZyk6IGFueVxuZXhwb3J0IGZ1bmN0aW9uIGxvY2FsU3RvcmFnZVJlYWQ8Uj4obmFtZTogc3RyaW5nLCBkZWZhdWx0VmFsOiAoKSA9PiBSKTogUlxuZXhwb3J0IGZ1bmN0aW9uIGxvY2FsU3RvcmFnZVJlYWQ8VD4obmFtZTogc3RyaW5nLCBkZWZhdWx0VmFsOiBUKTogVFxuZXhwb3J0IGZ1bmN0aW9uIGxvY2FsU3RvcmFnZVJlYWQobmFtZTogc3RyaW5nLCBkZWZhdWx0VmFsPzogYW55KTogYW55IHtcbiAgICB0cnkge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2VbbmFtZV0pXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZXR1cm4gdHlwZW9mIGRlZmF1bHRWYWwgPT09ICdmdW5jdGlvbicgPyBkZWZhdWx0VmFsKCkgOiBkZWZhdWx0VmFsXG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbG9jYWxTdG9yYWdlV3JpdGUobmFtZTogc3RyaW5nLCBpdGVtOiBhbnkpOiB2b2lkIHtcbiAgICBsb2NhbFN0b3JhZ2VbbmFtZV0gPSBKU09OLnN0cmluZ2lmeShpdGVtKVxufVxuXG5pbnRlcmZhY2UgSWRsZURlYWRsaW5lIHtcbiAgICBkaWRUaW1lb3V0OiBib29sZWFuXG4gICAgdGltZVJlbWFpbmluZzogKCkgPT4gbnVtYmVyXG59XG5cbi8vIEJlY2F1c2UgdGhlIHJlcXVlc3RJZGxlQ2FsbGJhY2sgZnVuY3Rpb24gaXMgdmVyeSBuZXcgKGFzIG9mIHdyaXRpbmcgb25seSB3b3JrcyB3aXRoIENocm9tZVxuLy8gdmVyc2lvbiA0NyksIHRoZSBiZWxvdyBmdW5jdGlvbiBwb2x5ZmlsbHMgdGhhdCBtZXRob2QuXG5leHBvcnQgZnVuY3Rpb24gcmVxdWVzdElkbGVDYWxsYmFjayhjYjogKGRlYWRsaW5lOiBJZGxlRGVhZGxpbmUpID0+IHZvaWQsIG9wdHM6IHsgdGltZW91dDogbnVtYmVyfSk6IG51bWJlciB7XG4gICAgaWYgKCdyZXF1ZXN0SWRsZUNhbGxiYWNrJyBpbiB3aW5kb3cpIHtcbiAgICAgICAgcmV0dXJuICh3aW5kb3cgYXMgYW55KS5yZXF1ZXN0SWRsZUNhbGxiYWNrKGNiLCBvcHRzKVxuICAgIH1cbiAgICBjb25zdCBzdGFydCA9IERhdGUubm93KClcblxuICAgIHJldHVybiBzZXRUaW1lb3V0KCgpID0+IGNiKHtcbiAgICAgICAgZGlkVGltZW91dDogZmFsc2UsXG4gICAgICAgIHRpbWVSZW1haW5pbmcoKTogbnVtYmVyIHtcbiAgICAgICAgICAgIHJldHVybiBNYXRoLm1heCgwLCA1MCAtIChEYXRlLm5vdygpIC0gc3RhcnQpKVxuICAgICAgICB9XG4gICAgfSksIDEpXG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIHRoZSB0d28gZGF0ZXMgaGF2ZSB0aGUgc2FtZSB5ZWFyLCBtb250aCwgYW5kIGRheVxuICovXG5mdW5jdGlvbiBkYXRlc0VxdWFsKGE6IERhdGUsIGI6IERhdGUpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdG9EYXRlTnVtKGEpID09PSB0b0RhdGVOdW0oYilcbn1cblxuY29uc3QgREFURV9SRUxBVElWRU5BTUVTOiB7W25hbWU6IHN0cmluZ106IG51bWJlcn0gPSB7XG4gICAgJ1RvbW9ycm93JzogMSxcbiAgICAnVG9kYXknOiAwLFxuICAgICdZZXN0ZXJkYXknOiAtMSxcbiAgICAnMiBkYXlzIGFnbyc6IC0yXG59XG5jb25zdCBXRUVLREFZUyA9IFsnU3VuZGF5JywgJ01vbmRheScsICdUdWVzZGF5JywgJ1dlZG5lc2RheScsICdUaHVyc2RheScsICdGcmlkYXknLCAnU2F0dXJkYXknXVxuY29uc3QgRlVMTE1PTlRIUyA9IFsnSmFudWFyeScsICdGZWJydWFyeScsICdNYXJjaCcsICdBcHJpbCcsICdNYXknLCAnSnVuZScsICdKdWx5JywgJ0F1Z3VzdCcsICdTZXB0ZW1iZXInLCAnT2N0b2JlcicsXG4gICAgICAgICAgICAgICAgICAgICdOb3ZlbWJlcicsICdEZWNlbWJlciddXG5cbmV4cG9ydCBmdW5jdGlvbiBkYXRlU3RyaW5nKGRhdGU6IERhdGV8bnVtYmVyfCdGb3JldmVyJywgYWRkVGhpczogYm9vbGVhbiA9IGZhbHNlKTogc3RyaW5nIHtcbiAgICBpZiAoZGF0ZSA9PT0gJ0ZvcmV2ZXInKSByZXR1cm4gZGF0ZVxuICAgIGlmICh0eXBlb2YgZGF0ZSA9PT0gJ251bWJlcicpIHJldHVybiBkYXRlU3RyaW5nKGZyb21EYXRlTnVtKGRhdGUpLCBhZGRUaGlzKVxuXG4gICAgY29uc3QgcmVsYXRpdmVNYXRjaCA9IE9iamVjdC5rZXlzKERBVEVfUkVMQVRJVkVOQU1FUykuZmluZCgobmFtZSkgPT4ge1xuICAgICAgICBjb25zdCBkYXlBdCA9IG5ldyBEYXRlKClcbiAgICAgICAgZGF5QXQuc2V0RGF0ZShkYXlBdC5nZXREYXRlKCkgKyBEQVRFX1JFTEFUSVZFTkFNRVNbbmFtZV0pXG4gICAgICAgIHJldHVybiBkYXRlc0VxdWFsKGRheUF0LCBkYXRlKVxuICAgIH0pXG4gICAgaWYgKHJlbGF0aXZlTWF0Y2gpIHJldHVybiByZWxhdGl2ZU1hdGNoXG5cbiAgICBjb25zdCBkYXlzQWhlYWQgPSAoZGF0ZS5nZXRUaW1lKCkgLSBEYXRlLm5vdygpKSAvIDEwMDAgLyAzNjAwIC8gMjRcblxuICAgIC8vIElmIHRoZSBkYXRlIGlzIHdpdGhpbiA2IGRheXMgb2YgdG9kYXksIG9ubHkgZGlzcGxheSB0aGUgZGF5IG9mIHRoZSB3ZWVrXG4gICAgaWYgKDAgPCBkYXlzQWhlYWQgJiYgZGF5c0FoZWFkIDw9IDYpIHtcbiAgICAgICAgcmV0dXJuIChhZGRUaGlzID8gJ1RoaXMgJyA6ICcnKSArIFdFRUtEQVlTW2RhdGUuZ2V0RGF5KCldXG4gICAgfVxuICAgIHJldHVybiBgJHtXRUVLREFZU1tkYXRlLmdldERheSgpXX0sICR7RlVMTE1PTlRIU1tkYXRlLmdldE1vbnRoKCldfSAke2RhdGUuZ2V0RGF0ZSgpfWBcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1vbnRoU3RyaW5nKGRhdGU6IERhdGV8bnVtYmVyKTogc3RyaW5nIHtcbiAgICBpZiAodHlwZW9mIGRhdGUgPT09ICdudW1iZXInKSByZXR1cm4gbW9udGhTdHJpbmcoZnJvbURhdGVOdW0oZGF0ZSkpXG5cbiAgICBjb25zdCB0b2RheSA9IG5ldyBEYXRlKClcbiAgICBpZiAodG9kYXkuZ2V0RnVsbFllYXIoKSA9PT0gZGF0ZS5nZXRGdWxsWWVhcigpKSB7XG4gICAgICAgIGlmICh0b2RheS5nZXRNb250aCgpID09PSBkYXRlLmdldE1vbnRoKCkpIHJldHVybiAnVGhpcyBNb250aCdcbiAgICAgICAgaWYgKHRvZGF5LmdldE1vbnRoKCkgKyAxID09PSBkYXRlLmdldE1vbnRoKCkpIHJldHVybiAnTmV4dCBNb250aCdcbiAgICAgICAgaWYgKHRvZGF5LmdldE1vbnRoKCkgLSAxID09PSBkYXRlLmdldE1vbnRoKCkpIHJldHVybiAnTGFzdCBNb250aCdcbiAgICAgICAgcmV0dXJuIEZVTExNT05USFNbZGF0ZS5nZXRNb250aCgpXVxuICAgIH1cbiAgICByZXR1cm4gRlVMTE1PTlRIU1tkYXRlLmdldE1vbnRoKCldICsgJyAnICsgZGF0ZS5nZXRGdWxsWWVhcigpXG59XG5cbi8vIFRoZSBvbmUgYmVsb3cgc2Nyb2xscyBzbW9vdGhseSB0byBhIHkgcG9zaXRpb24uXG5leHBvcnQgZnVuY3Rpb24gc21vb3RoU2Nyb2xsKHRvOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBsZXQgc3RhcnQ6IG51bWJlcnxudWxsID0gbnVsbFxuICAgICAgICBjb25zdCBmcm9tID0gZG9jdW1lbnQuYm9keS5zY3JvbGxUb3BcbiAgICAgICAgY29uc3QgYW1vdW50ID0gdG8gLSBmcm9tXG4gICAgICAgIGNvbnN0IHN0ZXAgPSAodGltZXN0YW1wOiBudW1iZXIpID0+IHtcbiAgICAgICAgICAgIGlmIChzdGFydCA9PSBudWxsKSB7IHN0YXJ0ID0gdGltZXN0YW1wIH1cbiAgICAgICAgICAgIGNvbnN0IHByb2dyZXNzID0gdGltZXN0YW1wIC0gc3RhcnRcbiAgICAgICAgICAgIHdpbmRvdy5zY3JvbGxUbygwLCBmcm9tICsgKGFtb3VudCAqIChwcm9ncmVzcyAvIDM1MCkpKVxuICAgICAgICAgICAgaWYgKHByb2dyZXNzIDwgMzUwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3RBbmltYXRpb25GcmFtZShzdGVwKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBfJChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCduYXYnKSkuY2xhc3NMaXN0LnJlbW92ZSgnaGVhZHJvb20tLXVucGlubmVkJylcbiAgICAgICAgICAgICAgICByZXNvbHZlKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RlcClcbiAgICB9KVxufVxuXG4vLyBBbmQgYSBmdW5jdGlvbiB0byBhcHBseSBhbiBpbmsgZWZmZWN0XG5leHBvcnQgZnVuY3Rpb24gcmlwcGxlKGVsOiBIVE1MRWxlbWVudCk6IHZvaWQge1xuICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIChldnQpID0+IHtcbiAgICAgICAgaWYgKGV2dC53aGljaCAhPT0gMSkgcmV0dXJuIC8vIE5vdCBsZWZ0IGJ1dHRvblxuICAgICAgICBjb25zdCB3YXZlID0gZWxlbWVudCgnc3BhbicsICd3YXZlJylcbiAgICAgICAgY29uc3Qgc2l6ZSA9IE1hdGgubWF4KE51bWJlcihlbC5vZmZzZXRXaWR0aCksIE51bWJlcihlbC5vZmZzZXRIZWlnaHQpKVxuICAgICAgICB3YXZlLnN0eWxlLndpZHRoID0gKHdhdmUuc3R5bGUuaGVpZ2h0ID0gc2l6ZSArICdweCcpXG5cbiAgICAgICAgbGV0IHggPSBldnQuY2xpZW50WFxuICAgICAgICBsZXQgeSA9IGV2dC5jbGllbnRZXG4gICAgICAgIGNvbnN0IHJlY3QgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgICAgICB4IC09IHJlY3QubGVmdFxuICAgICAgICB5IC09IHJlY3QudG9wXG5cbiAgICAgICAgd2F2ZS5zdHlsZS50b3AgPSAoeSAtIChzaXplIC8gMikpICsgJ3B4J1xuICAgICAgICB3YXZlLnN0eWxlLmxlZnQgPSAoeCAtIChzaXplIC8gMikpICsgJ3B4J1xuICAgICAgICBlbC5hcHBlbmRDaGlsZCh3YXZlKVxuICAgICAgICB3YXZlLnNldEF0dHJpYnV0ZSgnZGF0YS1ob2xkJywgU3RyaW5nKERhdGUubm93KCkpKVxuICAgICAgICBmb3JjZUxheW91dCh3YXZlKVxuICAgICAgICB3YXZlLnN0eWxlLnRyYW5zZm9ybSA9ICdzY2FsZSgyLjUpJ1xuICAgIH0pXG4gICAgZWwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIChldnQpID0+IHtcbiAgICAgICAgaWYgKGV2dC53aGljaCAhPT0gMSkgcmV0dXJuIC8vIE9ubHkgZm9yIGxlZnQgYnV0dG9uXG4gICAgICAgIGNvbnN0IHdhdmVzID0gZWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnd2F2ZScpXG4gICAgICAgIHdhdmVzLmZvckVhY2goKHdhdmUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGRpZmYgPSBEYXRlLm5vdygpIC0gTnVtYmVyKHdhdmUuZ2V0QXR0cmlidXRlKCdkYXRhLWhvbGQnKSlcbiAgICAgICAgICAgIGNvbnN0IGRlbGF5ID0gTWF0aC5tYXgoMzUwIC0gZGlmZiwgMClcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICh3YXZlIGFzIEhUTUxFbGVtZW50KS5zdHlsZS5vcGFjaXR5ID0gJzAnXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHdhdmUucmVtb3ZlKClcbiAgICAgICAgICAgICAgICB9LCA1NTApXG4gICAgICAgICAgICB9LCBkZWxheSlcbiAgICAgICAgfSlcbiAgICB9KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY3NzTnVtYmVyKGNzczogc3RyaW5nfG51bGwpOiBudW1iZXIge1xuICAgIGlmICghY3NzKSByZXR1cm4gMFxuICAgIHJldHVybiBwYXJzZUludChjc3MsIDEwKVxufVxuXG4vLyBGb3IgZWFzZSBvZiBhbmltYXRpb25zLCBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIHByb21pc2UgaXMgZGVmaW5lZC5cbmV4cG9ydCBmdW5jdGlvbiBhbmltYXRlRWwoZWw6IEhUTUxFbGVtZW50LCBrZXlmcmFtZXM6IEFuaW1hdGlvbktleUZyYW1lW10sIG9wdGlvbnM6IEFuaW1hdGlvbk9wdGlvbnMpOlxuICAgIFByb21pc2U8QW5pbWF0aW9uUGxheWJhY2tFdmVudD4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGNvbnN0IHBsYXllciA9IGVsLmFuaW1hdGUoa2V5ZnJhbWVzLCBvcHRpb25zKVxuICAgICAgICBwbGF5ZXIub25maW5pc2ggPSAoZSkgPT4gcmVzb2x2ZShlKVxuICAgIH0pXG59XG4iXSwic291cmNlUm9vdCI6IiJ9