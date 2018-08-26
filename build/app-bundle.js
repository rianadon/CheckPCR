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
                parse(resp.response);
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
                parse(resp.response); // Parse the data PCR has replied with
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
function parse(doc) {
    console.time('Handling data'); // To time how long it takes to parse the assignments
    const handledDataShort = []; // Array used to make sure we don"t parse the same assignment twice.
    const data = {
        classes: [],
        assignments: [],
        monthView: Object(_util__WEBPACK_IMPORTED_MODULE_7__["_$"])(doc.querySelector('.rsHeaderMonth')).parentNode.classList.contains('rsSelected')
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50LnRzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2FjdGl2aXR5LnRzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2Fzc2lnbm1lbnQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvYXZhdGFyLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2NhbGVuZGFyLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2N1c3RvbUFkZGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2Vycm9yRGlzcGxheS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9yZXNpemVyLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL3NuYWNrYmFyLnRzIiwid2VicGFjazovLy8uL3NyYy9jb29raWVzLnRzIiwid2VicGFjazovLy8uL3NyYy9kYXRlcy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZGlzcGxheS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbmF2aWdhdGlvbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGNyLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW5zL2FjdGl2aXR5LnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW5zL2F0aGVuYS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2lucy9jdXN0b21Bc3NpZ25tZW50cy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2lucy9kb25lLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW5zL21vZGlmaWVkQXNzaWdubWVudHMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NldHRpbmdzLnRzIiwid2VicGFjazovLy8uL3NyYy91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNB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S0FDbkI7U0FBTTtRQUNILE9BQU8sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsS0FBSztLQUNoRDtBQUNMLENBQUM7QUFFRCxnQkFBZ0IsQ0FBUyxFQUFFLENBQVMsRUFBRSxDQUFTO0lBQzNDLE1BQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEdBQUc7SUFDM0IsTUFBTSxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztJQUM3QixNQUFNLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxJQUFJO0lBQzdCLE1BQU0sRUFBRSxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQzdCLE1BQU0sRUFBRSxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQzdCLE1BQU0sRUFBRSxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBRTdCLE1BQU0sS0FBSyxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7SUFFMUIsTUFBTSxFQUFFLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDOUMsTUFBTSxFQUFFLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDOUMsTUFBTSxFQUFFLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFFOUMscUJBQXFCO0lBQ3JCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBUyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdB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QU8sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO1lBQ25CLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUNoRSxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBQ3JDLFVBQVUsQ0FBQyxHQUFHLEVBQUU7Z0JBQ1gsSUFBb0IsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLEdBQUc7Z0JBQ3pDLFVBQVUsQ0FBQyxHQUFHLEVBQUU7b0JBQ1osSUFBSSxDQUFDLE1BQU0sRUFBRTtnQkFDakIsQ0FBQyxFQUFFLEdBQUcsQ0FBQztZQUNYLENBQUMsRUFBRSxLQUFLLENBQUM7UUFDYixDQUFDLENBQUM7SUFDTixDQUFDLENBQUM7QUFDTixDQUFDO0FBRUssbUJBQW9CLEdBQWdCO0lBQ3RDLElBQUksQ0FBQyxHQUFHO1FBQUUsT0FBTyxDQUFDO0lBQ2xCLE9BQU8sUUFBUSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUM7QUFDNUIsQ0FBQztBQUVELHdFQUF3RTtBQUNsRSxtQkFBb0IsRUFBZSxFQUFFLFNBQThCLEVBQUUsT0FBeUI7SUFFaEcsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtRQUNuQyxNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUM7UUFDN0MsTUFBTSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUN2QyxDQUFDLENBQUM7QUFDTixDQUFDIiwiZmlsZSI6ImFwcC1idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvY2xpZW50LnRzXCIpO1xuIiwiaW1wb3J0IHsgZWxlbUJ5SWQsIGVsZW1lbnQsIGxvY2FsU3RvcmFnZVJlYWQsIGxvY2FsU3RvcmFnZVdyaXRlLCBzZW5kIH0gZnJvbSAnLi91dGlsJ1xuXG5leHBvcnQgY29uc3QgVkVSU0lPTiA9ICcyLjI0LjMnXG5cbmNvbnN0IFZFUlNJT05fVVJMID0gJ2h0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS8xOVJ5YW5BL0NoZWNrUENSL21hc3Rlci92ZXJzaW9uLnR4dCdcbmNvbnN0IENPTU1JVF9VUkwgPSAobG9jYXRpb24ucHJvdG9jb2wgPT09ICdjaHJvbWUtZXh0ZW5zaW9uOicgP1xuICAgICdodHRwczovL2FwaS5naXRodWIuY29tL3JlcG9zLzE5UnlhbkEvQ2hlY2tQQ1IvZ2l0L3JlZnMvaGVhZHMvbWFzdGVyJyA6ICcvYXBpL2NvbW1pdCcpXG5jb25zdCBORVdTX1VSTCA9ICdodHRwczovL2FwaS5naXRodWIuY29tL2dpc3RzLzIxYmYxMWE0MjlkYTI1NzUzOWE2ODUyMGY1MTNhMzhiJ1xuXG5mdW5jdGlvbiBmb3JtYXRDb21taXRNZXNzYWdlKG1lc3NhZ2U6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIG1lc3NhZ2Uuc3Vic3RyKG1lc3NhZ2UuaW5kZXhPZignXFxuXFxuJykgKyAyKVxuICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcKiAoLio/KSg/PSR8XFxuKS9nLCAoYSwgYikgPT4gYDxsaT4ke2J9PC9saT5gKVxuICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLz5cXG48L2csICc+PCcpXG4gICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxuL2csICc8YnI+Jylcbn1cblxuLy8gRm9yIHVwZGF0aW5nLCBhIHJlcXVlc3Qgd2lsbCBiZSBzZW5kIHRvIEdpdGh1YiB0byBnZXQgdGhlIGN1cnJlbnQgY29tbWl0IGlkIGFuZCBjaGVjayB0aGF0IGFnYWluc3Qgd2hhdCdzIHN0b3JlZFxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNoZWNrQ29tbWl0KCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJlc3AgPSBhd2FpdCBzZW5kKFZFUlNJT05fVVJMLCAndGV4dCcpXG4gICAgICAgIGNvbnN0IGMgPSByZXNwLnJlc3BvbnNlVGV4dC50cmltKClcbiAgICAgICAgY29uc29sZS5sb2coYEN1cnJlbnQgdmVyc2lvbjogJHtjfSAke1ZFUlNJT04gPT09IGMgPyAnKG5vIHVwZGF0ZSBhdmFpbGFibGUpJyA6ICcodXBkYXRlIGF2YWlsYWJsZSknfWApXG4gICAgICAgIGVsZW1CeUlkKCduZXd2ZXJzaW9uJykuaW5uZXJIVE1MID0gY1xuICAgICAgICBpZiAoVkVSU0lPTiAhPT0gYykge1xuICAgICAgICAgICAgZWxlbUJ5SWQoJ3VwZGF0ZUlnbm9yZScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChsb2NhdGlvbi5wcm90b2NvbCA9PT0gJ2Nocm9tZS1leHRlbnNpb246Jykge1xuICAgICAgICAgICAgICAgICAgICBlbGVtQnlJZCgndXBkYXRlJykuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtQnlJZCgndXBkYXRlQmFja2dyb3VuZCcpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcbiAgICAgICAgICAgICAgICAgICAgfSwgMzUwKVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBjb25zdCByZXNwMiA9IGF3YWl0IHNlbmQoQ09NTUlUX1VSTCwgJ2pzb24nKVxuICAgICAgICAgICAgY29uc3QgeyBzaGEsIHVybCB9ID0gcmVzcDIucmVzcG9uc2Uub2JqZWN0XG4gICAgICAgICAgICBjb25zdCByZXNwMyA9IGF3YWl0IHNlbmQoKGxvY2F0aW9uLnByb3RvY29sID09PSAnY2hyb21lLWV4dGVuc2lvbjonID8gdXJsIDogYC9hcGkvY29tbWl0LyR7c2hhfWApLCAnanNvbicpXG4gICAgICAgICAgICBlbGVtQnlJZCgncGFzdFVwZGF0ZVZlcnNpb24nKS5pbm5lckhUTUwgPSBWRVJTSU9OXG4gICAgICAgICAgICBlbGVtQnlJZCgnbmV3VXBkYXRlVmVyc2lvbicpLmlubmVySFRNTCA9IGNcbiAgICAgICAgICAgIGVsZW1CeUlkKCd1cGRhdGVGZWF0dXJlcycpLmlubmVySFRNTCA9IGZvcm1hdENvbW1pdE1lc3NhZ2UocmVzcDMucmVzcG9uc2UubWVzc2FnZSlcbiAgICAgICAgICAgIGVsZW1CeUlkKCd1cGRhdGVCYWNrZ3JvdW5kJykuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcbiAgICAgICAgICAgIGVsZW1CeUlkKCd1cGRhdGUnKS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdDb3VsZCBub3QgYWNjZXNzIEdpdGh1Yi4gSGVyZVxcJ3MgdGhlIGVycm9yOicsIGVycilcbiAgICB9XG59XG5cbmxldCBuZXdzVXJsOiBzdHJpbmd8bnVsbCA9IG51bGxcbmxldCBuZXdzQ29tbWl0OiBzdHJpbmd8bnVsbCA9IG51bGxcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZldGNoTmV3cygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCByZXNwID0gYXdhaXQgc2VuZChORVdTX1VSTCwgJ2pzb24nKVxuICAgICAgICBsZXQgbGFzdCA9IGxvY2FsU3RvcmFnZVJlYWQoJ25ld3NDb21taXQnKVxuICAgICAgICBuZXdzQ29tbWl0ID0gcmVzcC5yZXNwb25zZS5oaXN0b3J5WzBdLnZlcnNpb25cblxuICAgICAgICBpZiAobGFzdCA9PSBudWxsKSB7XG4gICAgICAgICAgICBsYXN0ID0gbmV3c0NvbW1pdFxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlV3JpdGUoJ25ld3NDb21taXQnLCBuZXdzQ29tbWl0KVxuICAgICAgICB9XG5cbiAgICAgICAgbmV3c1VybCA9IHJlc3AucmVzcG9uc2UuZmlsZXNbJ3VwZGF0ZXMuaHRtJ10ucmF3X3VybFxuXG4gICAgICAgIGlmIChsYXN0ICE9PSBuZXdzQ29tbWl0KSB7XG4gICAgICAgICAgICBnZXROZXdzKClcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zb2xlLmxvZygnQ291bGQgbm90IGFjY2VzcyBHaXRodWIuIEhlcmVcXCdzIHRoZSBlcnJvcjonLCBlcnIpXG4gICAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0TmV3cyhvbmZhaWw/OiAoKSA9PiB2b2lkKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKCFuZXdzVXJsKSB7XG4gICAgICAgIGlmIChvbmZhaWwpIG9uZmFpbCgpXG4gICAgICAgIHJldHVyblxuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBjb25zdCByZXNwID0gYXdhaXQgc2VuZChuZXdzVXJsKVxuICAgICAgICBsb2NhbFN0b3JhZ2UubmV3c0NvbW1pdCA9IG5ld3NDb21taXRcbiAgICAgICAgcmVzcC5yZXNwb25zZVRleHQuc3BsaXQoJzxocj4nKS5mb3JFYWNoKChuZXdzKSA9PiB7XG4gICAgICAgICAgICBlbGVtQnlJZCgnbmV3c0NvbnRlbnQnKS5hcHBlbmRDaGlsZChlbGVtZW50KCdkaXYnLCAnbmV3c0l0ZW0nLCBuZXdzKSlcbiAgICAgICAgfSlcbiAgICAgICAgZWxlbUJ5SWQoJ25ld3NCYWNrZ3JvdW5kJykuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcbiAgICAgICAgZWxlbUJ5SWQoJ25ld3MnKS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zb2xlLmxvZygnQ291bGQgbm90IGFjY2VzcyBHaXRodWIuIEhlcmVcXCdzIHRoZSBlcnJvcjonLCBlcnIpXG4gICAgICAgIGlmIChvbmZhaWwpIG9uZmFpbCgpXG4gICAgfVxufVxuIiwiaW1wb3J0IHsgY2hlY2tDb21taXQsIGZldGNoTmV3cywgZ2V0TmV3cywgVkVSU0lPTiB9IGZyb20gJy4vYXBwJ1xuaW1wb3J0IHsgY2xvc2VPcGVuZWQsIGdldEVTIH0gZnJvbSAnLi9jb21wb25lbnRzL2Fzc2lnbm1lbnQnXG5pbXBvcnQgeyB1cGRhdGVBdmF0YXIgfSBmcm9tICcuL2NvbXBvbmVudHMvYXZhdGFyJ1xuaW1wb3J0IHsgdXBkYXRlTmV3VGlwcyB9IGZyb20gJy4vY29tcG9uZW50cy9jdXN0b21BZGRlcidcbmltcG9ydCB7IGdldFJlc2l6ZUFzc2lnbm1lbnRzLCByZXNpemUsIHJlc2l6ZUNhbGxlciB9IGZyb20gJy4vY29tcG9uZW50cy9yZXNpemVyJ1xuaW1wb3J0IHsgdG9EYXRlTnVtLCB0b2RheSB9IGZyb20gJy4vZGF0ZXMnXG5pbXBvcnQgeyBkaXNwbGF5LCBmb3JtYXRVcGRhdGUsIGdldFNjcm9sbCB9IGZyb20gJy4vZGlzcGxheSdcbmltcG9ydCB7XG4gICAgZGVjcmVtZW50Q2FsRGF0ZU9mZnNldCxcbiAgICBkZWNyZW1lbnRMaXN0RGF0ZU9mZnNldCxcbiAgICBnZXRDYWxEYXRlT2Zmc2V0LFxuICAgIGdldExpc3REYXRlT2Zmc2V0LFxuICAgIGluY3JlbWVudENhbERhdGVPZmZzZXQsXG4gICAgaW5jcmVtZW50TGlzdERhdGVPZmZzZXQsXG4gICAgc2V0TGlzdERhdGVPZmZzZXQsXG4gICAgemVyb0RhdGVPZmZzZXRzXG59IGZyb20gJy4vbmF2aWdhdGlvbidcbmltcG9ydCB7IGRvbG9naW4sIGZldGNoLCBnZXRDbGFzc2VzLCBnZXREYXRhLCBsb2dvdXQsIHNldERhdGEsIHN3aXRjaFZpZXdzIH0gZnJvbSAnLi9wY3InXG5pbXBvcnQgeyBhZGRBY3Rpdml0eSwgcmVjZW50QWN0aXZpdHkgfSBmcm9tICcuL3BsdWdpbnMvYWN0aXZpdHknXG5pbXBvcnQgeyB1cGRhdGVBdGhlbmFEYXRhIH0gZnJvbSAnLi9wbHVnaW5zL2F0aGVuYSdcbmltcG9ydCB7IGFkZFRvRXh0cmEsIHBhcnNlQ3VzdG9tVGFzaywgc2F2ZUV4dHJhIH0gZnJvbSAnLi9wbHVnaW5zL2N1c3RvbUFzc2lnbm1lbnRzJ1xuaW1wb3J0IHsgZ2V0U2V0dGluZywgc2V0U2V0dGluZywgc2V0dGluZ3MgfSBmcm9tICcuL3NldHRpbmdzJ1xuaW1wb3J0IHtcbiAgICBfJCxcbiAgICBfJGgsXG4gICAgYW5pbWF0ZUVsLFxuICAgIGRhdGVTdHJpbmcsXG4gICAgZWxlbUJ5SWQsXG4gICAgZWxlbWVudCxcbiAgICBmb3JjZUxheW91dCxcbiAgICBsb2NhbFN0b3JhZ2VSZWFkLFxuICAgIGxvY2FsU3RvcmFnZVdyaXRlLFxuICAgIG1vbnRoU3RyaW5nLFxuICAgIHJlcXVlc3RJZGxlQ2FsbGJhY2ssXG4gICAgcmlwcGxlXG59IGZyb20gJy4vdXRpbCdcblxuaWYgKGxvY2FsU3RvcmFnZVJlYWQoJ2RhdGEnKSAhPSBudWxsKSB7XG4gICAgc2V0RGF0YShsb2NhbFN0b3JhZ2VSZWFkKCdkYXRhJykpXG59XG5cbi8vIEFkZGl0aW9uYWxseSwgaWYgaXQncyB0aGUgdXNlcidzIGZpcnN0IHRpbWUsIHRoZSBwYWdlIGlzIHNldCB0byB0aGUgd2VsY29tZSBwYWdlLlxuaWYgKCFsb2NhbFN0b3JhZ2VSZWFkKCdub1dlbGNvbWUnKSkge1xuICAgIGxvY2FsU3RvcmFnZVdyaXRlKCdub1dlbGNvbWUnLCB0cnVlKVxuICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJ3dlbGNvbWUuaHRtbCdcbn1cblxuY29uc3QgTkFWX0VMRU1FTlQgPSBfJChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCduYXYnKSlcbmNvbnN0IElOUFVUX0VMRU1FTlRTID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcbiAgICAnaW5wdXRbdHlwZT10ZXh0XTpub3QoI25ld1RleHQpOm5vdChbcmVhZG9ubHldKSwgaW5wdXRbdHlwZT1wYXNzd29yZF0sIGlucHV0W3R5cGU9ZW1haWxdLCAnICtcbiAgICAnaW5wdXRbdHlwZT11cmxdLCBpbnB1dFt0eXBlPXRlbF0sIGlucHV0W3R5cGU9bnVtYmVyXTpub3QoLmNvbnRyb2wpLCBpbnB1dFt0eXBlPXNlYXJjaF0nXG4pIGFzIE5vZGVMaXN0T2Y8SFRNTElucHV0RWxlbWVudD5cblxuLy8gIyMjIyBTZW5kIGZ1bmN0aW9uXG4vL1xuXG4vLyBUaGlzIGZ1bmN0aW9uIGRpc3BsYXlzIGEgc25hY2tiYXIgdG8gdGVsbCB0aGUgdXNlciBzb21ldGhpbmdcblxuLy8gPGEgbmFtZT1cInJldFwiLz5cbi8vIFJldHJpZXZpbmcgZGF0YVxuLy8gLS0tLS0tLS0tLS0tLS0tXG4vL1xuZWxlbUJ5SWQoJ2xvZ2luJykuYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgKGV2dCkgPT4ge1xuICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgZG9sb2dpbihudWxsLCB0cnVlKVxufSlcblxuLy8gVGhlIHZpZXcgc3dpdGNoaW5nIGJ1dHRvbiBuZWVkcyBhbiBldmVudCBoYW5kbGVyLlxuZWxlbUJ5SWQoJ3N3aXRjaFZpZXdzJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzd2l0Y2hWaWV3cylcblxuLy8gVGhlIHNhbWUgZ29lcyBmb3IgdGhlIGxvZyBvdXQgYnV0dG9uLlxuZWxlbUJ5SWQoJ2xvZ291dCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgbG9nb3V0KVxuXG4vLyBOb3cgd2UgYXNzaWduIGl0IHRvIGNsaWNraW5nIHRoZSBiYWNrZ3JvdW5kLlxuZWxlbUJ5SWQoJ2JhY2tncm91bmQnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsb3NlT3BlbmVkKVxuXG4vLyBUaGVuLCB0aGUgdGFicyBhcmUgbWFkZSBpbnRlcmFjdGl2ZS5cbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyNuYXZUYWJzPmxpJykuZm9yRWFjaCgodGFiLCB0YWJJbmRleCkgPT4ge1xuICB0YWIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZ0KSA9PiB7XG4gICAgaWYgKCFzZXR0aW5ncy52aWV3VHJhbnMpIHtcbiAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnbm9UcmFucycpXG4gICAgICBmb3JjZUxheW91dChkb2N1bWVudC5ib2R5KVxuICAgIH1cbiAgICBsb2NhbFN0b3JhZ2VXcml0ZSgndmlldycsIHRhYkluZGV4KVxuICAgIGRvY3VtZW50LmJvZHkuc2V0QXR0cmlidXRlKCdkYXRhLXZpZXcnLCBTdHJpbmcodGFiSW5kZXgpKVxuICAgIGlmICh0YWJJbmRleCA9PT0gMSkge1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgcmVzaXplQ2FsbGVyKVxuICAgICAgICBpZiAoc2V0dGluZ3Mudmlld1RyYW5zKSB7XG4gICAgICAgICAgICBsZXQgc3RhcnQ6IG51bWJlcnxudWxsID0gbnVsbFxuICAgICAgICAgICAgLy8gVGhlIGNvZGUgYmVsb3cgaXMgdGhlIHNhbWUgY29kZSB1c2VkIGluIHRoZSByZXNpemUoKSBmdW5jdGlvbi4gSXQgYmFzaWNhbGx5IGp1c3RcbiAgICAgICAgICAgIC8vIHBvc2l0aW9ucyB0aGUgYXNzaWdubWVudHMgY29ycmVjdGx5IGFzIHRoZXkgYW5pbWF0ZVxuICAgICAgICAgICAgY29uc3Qgd2lkdGhzID0gZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuY29udGFpbnMoJ3Nob3dJbmZvJykgP1xuICAgICAgICAgICAgICAgIFs2NTAsIDExMDAsIDE4MDAsIDI3MDAsIDM4MDAsIDUxMDBdIDogWzM1MCwgODAwLCAxNTAwLCAyNDAwLCAzNTAwLCA0ODAwXVxuICAgICAgICAgICAgbGV0IGNvbHVtbnMgPSAxXG4gICAgICAgICAgICB3aWR0aHMuZm9yRWFjaCgodywgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAod2luZG93LmlubmVyV2lkdGggPiB3KSB7IGNvbHVtbnMgPSBpbmRleCArIDEgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGNvbnN0IGFzc2lnbm1lbnRzID0gZ2V0UmVzaXplQXNzaWdubWVudHMoKVxuICAgICAgICAgICAgY29uc3QgY29sdW1uSGVpZ2h0cyA9IEFycmF5LmZyb20obmV3IEFycmF5KGNvbHVtbnMpLCAoKSA9PiAwKVxuICAgICAgICAgICAgY29uc3Qgc3RlcCA9ICh0aW1lc3RhbXA6IG51bWJlcikgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghY29sdW1ucykgdGhyb3cgbmV3IEVycm9yKCdDb2x1bW5zIG51bWJlciBub3QgZm91bmQnKVxuICAgICAgICAgICAgICAgIGFzc2lnbm1lbnRzLmZvckVhY2goKGFzc2lnbm1lbnQsIG4pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY29sID0gbiAlIGNvbHVtbnNcbiAgICAgICAgICAgICAgICAgICAgaWYgKG4gPCBjb2x1bW5zKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW5IZWlnaHRzW2NvbF0gPSAwXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYXNzaWdubWVudC5zdHlsZS50b3AgPSBjb2x1bW5IZWlnaHRzW2NvbF0gKyAncHgnXG4gICAgICAgICAgICAgICAgICAgIGlmIChzdGFydCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBbZU5hbWUsIHNOYW1lXSA9IGdldEVTKGFzc2lnbm1lbnQpXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvbGRMZWZ0ID0gTnVtYmVyKHNOYW1lLnN1YnN0cmluZygxKSkgKiAxMDAgLyA3ICsgJyUnXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvbGRSaWdodCA9IE51bWJlcihlTmFtZS5zdWJzdHJpbmcoMSkpICogMTAwIC8gNyArICclJ1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBsZWZ0ID0gKCgxMDAgLyBjb2x1bW5zKSAqIGNvbCkgKyAnJSdcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJpZ2h0ID0gKCgxMDAgLyBjb2x1bW5zKSAqIChjb2x1bW5zIC0gY29sIC0gMSkpICsgJyUnXG4gICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRlRWwoYXNzaWdubWVudCwgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgbGVmdDogb2xkTGVmdCwgcmlnaHQ6IG9sZFJpZ2h0IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBsZWZ0LCByaWdodCB9XG4gICAgICAgICAgICAgICAgICAgICAgICBdLCB7IGR1cmF0aW9uOiAzMDAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXNzaWdubWVudC5zdHlsZS5sZWZ0ID0gbGVmdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzc2lnbm1lbnQuc3R5bGUucmlnaHQgPSByaWdodFxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjb2x1bW5IZWlnaHRzW2NvbF0gKz0gYXNzaWdubWVudC5vZmZzZXRIZWlnaHQgKyAyNFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgaWYgKHN0YXJ0ID09IG51bGwpIHN0YXJ0ID0gdGltZXN0YW1wXG4gICAgICAgICAgICAgICAgaWYgKCh0aW1lc3RhbXAgLSBzdGFydCkgPCAzNTApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RlcClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0ZXApXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIWNvbHVtbnMpIHRocm93IG5ldyBFcnJvcignQ29sdW1ucyBudW1iZXIgbm90IGZvdW5kJylcbiAgICAgICAgICAgICAgICBhc3NpZ25tZW50cy5mb3JFYWNoKChhc3NpZ25tZW50LCBuKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbCA9IG4gJSBjb2x1bW5zXG4gICAgICAgICAgICAgICAgICAgIGlmIChuIDwgY29sdW1ucykge1xuICAgICAgICAgICAgICAgICAgICBjb2x1bW5IZWlnaHRzW2NvbF0gPSAwXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYXNzaWdubWVudC5zdHlsZS50b3AgPSBjb2x1bW5IZWlnaHRzW2NvbF0gKyAncHgnXG4gICAgICAgICAgICAgICAgICAgIGNvbHVtbkhlaWdodHNbY29sXSArPSBhc3NpZ25tZW50Lm9mZnNldEhlaWdodCArIDI0XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0sIDM1MClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc2l6ZSgpXG4gICAgICAgIH1cbiAgICAgICAgemVyb0RhdGVPZmZzZXRzKClcbiAgICAgICAgdXBkYXRlRGF0ZU5hdnMoKVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHdpbmRvdy5zY3JvbGxUbygwLCBnZXRTY3JvbGwoKSlcbiAgICAgICAgTkFWX0VMRU1FTlQuY2xhc3NMaXN0LmFkZCgnaGVhZHJvb20tLWxvY2tlZCcpXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgTkFWX0VMRU1FTlQuY2xhc3NMaXN0LnJlbW92ZSgnaGVhZHJvb20tLXVucGlubmVkJylcbiAgICAgICAgICAgIE5BVl9FTEVNRU5ULmNsYXNzTGlzdC5yZW1vdmUoJ2hlYWRyb29tLS1sb2NrZWQnKVxuICAgICAgICAgICAgTkFWX0VMRU1FTlQuY2xhc3NMaXN0LmFkZCgnaGVhZHJvb20tLXBpbm5lZCcpXG4gICAgICAgIH0sIDM1MClcbiAgICAgICAgcmVxdWVzdElkbGVDYWxsYmFjaygoKSA9PiB7XG4gICAgICAgICAgICB6ZXJvRGF0ZU9mZnNldHMoKVxuICAgICAgICAgICAgbGF6eUZldGNoKClcbiAgICAgICAgICAgIHVwZGF0ZURhdGVOYXZzKClcbiAgICAgICAgICAgIGRpc3BsYXkoKVxuICAgICAgICB9LCB7dGltZW91dDogMjAwMH0pXG4gICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCByZXNpemVDYWxsZXIpXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5hc3NpZ25tZW50JykuZm9yRWFjaCgoYXNzaWdubWVudCkgPT4ge1xuICAgICAgICAgICAgKGFzc2lnbm1lbnQgYXMgSFRNTEVsZW1lbnQpLnN0eWxlLnRvcCA9ICdhdXRvJ1xuICAgICAgICB9KVxuICAgIH1cbiAgICBpZiAoIXNldHRpbmdzLnZpZXdUcmFucykge1xuICAgICAgZm9yY2VMYXlvdXQoZG9jdW1lbnQuYm9keSlcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnbm9UcmFucycpXG4gICAgICB9LCAzNTApXG4gICAgfVxuICB9KVxufSlcblxuLy8gQW5kIHRoZSBpbmZvIHRhYnMgKGp1c3QgYSBsaXR0bGUgbGVzcyBjb2RlKVxuZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnI2luZm9UYWJzPmxpJykuZm9yRWFjaCgodGFiLCB0YWJJbmRleCkgPT4ge1xuICAgIHRhYi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldnQpID0+IHtcbiAgICAgICAgZWxlbUJ5SWQoJ2luZm8nKS5zZXRBdHRyaWJ1dGUoJ2RhdGEtdmlldycsIFN0cmluZyh0YWJJbmRleCkpXG4gICAgfSlcbn0pXG5cbi8vIFRoZSB2aWV3IGlzIHNldCB0byB3aGF0IGl0IHdhcyBsYXN0LlxuaWYgKGxvY2FsU3RvcmFnZVJlYWQoJ3ZpZXcnKSAhPSBudWxsKSB7XG4gIGRvY3VtZW50LmJvZHkuc2V0QXR0cmlidXRlKCdkYXRhLXZpZXcnLCBsb2NhbFN0b3JhZ2VSZWFkKCd2aWV3JykpXG4gIGlmIChsb2NhbFN0b3JhZ2VSZWFkKCd2aWV3JykgPT09IDEpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgcmVzaXplQ2FsbGVyKVxuICB9XG59XG5cbi8vIEFkZGl0aW9uYWxseSwgdGhlIGFjdGl2ZSBjbGFzcyBuZWVkcyB0byBiZSBhZGRlZCB3aGVuIGlucHV0cyBhcmUgc2VsZWN0ZWQgKGZvciB0aGUgbG9naW4gYm94KS5cbklOUFVUX0VMRU1FTlRTLmZvckVhY2goKGlucHV0KSA9PiB7XG4gICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGV2dCkgPT4ge1xuICAgICAgICBfJGgoXyRoKGlucHV0LnBhcmVudE5vZGUpLnF1ZXJ5U2VsZWN0b3IoJ2xhYmVsJykpLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG4gICAgfSlcbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsIChldnQpID0+IHtcbiAgICAgICAgXyRoKF8kaChpbnB1dC5wYXJlbnROb2RlKS5xdWVyeVNlbGVjdG9yKCdsYWJlbCcpKS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxuICAgIH0pXG4gICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIChldnQpID0+IHtcbiAgICAgICAgaWYgKGlucHV0LnZhbHVlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgXyRoKF8kaChpbnB1dC5wYXJlbnROb2RlKS5xdWVyeVNlbGVjdG9yKCdsYWJlbCcpKS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuICAgICAgICB9XG4gICAgfSlcbn0pXG5cbi8vIFdoZW4gdGhlIGVzY2FwZSBrZXkgaXMgcHJlc3NlZCwgdGhlIGN1cnJlbnQgYXNzaWdubWVudCBzaG91bGQgYmUgY2xvc2VkLlxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZXZ0KSA9PiB7XG4gIGlmIChldnQud2hpY2ggPT09IDI3KSB7IC8vIEVzY2FwZSBrZXkgcHJlc3NlZFxuICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdmdWxsJykubGVuZ3RoICE9PSAwKSB7IHJldHVybiBjbG9zZU9wZW5lZChuZXcgRXZlbnQoJ0dlbmVyYXRlZCBFdmVudCcpKSB9XG4gIH1cbn0pO1xuXG4vLyBJZiBpdCdzIHdpbnRlciB0aW1lLCBhIGNsYXNzIGlzIGFkZGVkIHRvIHRoZSBib2R5IGVsZW1lbnQuXG4oKCkgPT4ge1xuICAgIGNvbnN0IHRvZGF5RGF0ZSA9IG5ldyBEYXRlKClcbiAgICBpZiAobmV3IERhdGUodG9kYXlEYXRlLmdldEZ1bGxZZWFyKCksIDEwLCAyNykgPD0gdG9kYXlEYXRlICYmXG4gICAgICAgIHRvZGF5RGF0ZSA8PSBuZXcgRGF0ZSh0b2RheURhdGUuZ2V0RnVsbFllYXIoKSwgMTEsIDMyKSkge1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCd3aW50ZXInKVxuICAgIH1cbn0pKClcblxuLy8gRm9yIHRoZSBuYXZiYXIgdG9nZ2xlIGJ1dHRvbnMsIGEgZnVuY3Rpb24gdG8gdG9nZ2xlIHRoZSBhY3Rpb24gaXMgZGVmaW5lZCB0byBlbGltaW5hdGUgY29kZS5cbmZ1bmN0aW9uIG5hdlRvZ2dsZShlbGVtOiBzdHJpbmcsIGxzOiBzdHJpbmcsIGY/OiAoKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgcmlwcGxlKGVsZW1CeUlkKGVsZW0pKVxuICAgIGVsZW1CeUlkKGVsZW0pLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCAoKSA9PiB7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnRvZ2dsZShscylcbiAgICAgICAgcmVzaXplKClcbiAgICAgICAgbG9jYWxTdG9yYWdlV3JpdGUobHMsIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKGxzKSlcbiAgICAgICAgaWYgKGYgIT0gbnVsbCkgZigpXG4gICAgfSlcbiAgICBpZiAobG9jYWxTdG9yYWdlUmVhZChscykpIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZChscylcbn1cblxuLy8gVGhlIGJ1dHRvbiB0byBzaG93L2hpZGUgY29tcGxldGVkIGFzc2lnbm1lbnRzIGluIGxpc3QgdmlldyBhbHNvIG5lZWRzIGV2ZW50IGxpc3RlbmVycy5cbm5hdlRvZ2dsZSgnY3ZCdXR0b24nLCAnc2hvd0RvbmUnLCAoKSA9PiBzZXRUaW1lb3V0KHJlc2l6ZSwgMTAwMCkpXG5cbi8vIFRoZSBzYW1lIGdvZXMgZm9yIHRoZSBidXR0b24gdGhhdCBzaG93cyB1cGNvbWluZyB0ZXN0cy5cbmlmIChsb2NhbFN0b3JhZ2Uuc2hvd0luZm8gPT0gbnVsbCkgeyBsb2NhbFN0b3JhZ2Uuc2hvd0luZm8gPSBKU09OLnN0cmluZ2lmeSh0cnVlKSB9XG5uYXZUb2dnbGUoJ2luZm9CdXR0b24nLCAnc2hvd0luZm8nKVxuXG4vLyBUaGlzIGFsc28gZ2V0cyByZXBlYXRlZCBmb3IgdGhlIHRoZW1lIHRvZ2dsaW5nLlxubmF2VG9nZ2xlKCdsaWdodEJ1dHRvbicsICdkYXJrJylcblxuZnVuY3Rpb24gc2V0dXBEYXRlTGlzdGVuZXIob3B0czogeyBlbGVtOiBIVE1MRWxlbWVudCwgZnJvbTogSFRNTEVsZW1lbnQsIGN1cnJlbnQ6IEhUTUxFbGVtZW50LCB0bzogSFRNTEVsZW1lbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhvb2tzOiBBcnJheTwoKSA9PiB2b2lkPiwgZm9yd2FyZDogYm9vbGVhbiwgbmV3c3VwcGxpZXI6ICgpID0+IHN0cmluZyB9KTogdm9pZCB7XG4gICAgY29uc3QgeyBlbGVtLCBmcm9tLCBjdXJyZW50LCB0bywgaG9va3MsIGZvcndhcmQsIG5ld3N1cHBsaWVyIH0gPSBvcHRzXG4gICAgZWxlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgY29uc3QgdHJhbnNmcm9tID0gZm9yd2FyZCA/ICd0cmFuc2xhdGVYKDAlKScgOiAndHJhbnNsYXRlWCgtMTAwJSknXG4gICAgICAgIGNvbnN0IHRyYW5zdG8gPSBmb3J3YXJkID8gJ3RyYW5zbGF0ZVgoLTEwMCUpJyA6ICd0cmFuc2xhdGVYKDAlKSdcbiAgICAgICAgaG9va3MuZm9yRWFjaCgoaG9vaykgPT4gaG9vaygpKVxuICAgICAgICB0by5zdHlsZS5kaXNwbGF5ID0gJ2lubGluZS1ibG9jaydcbiAgICAgICAgUHJvbWlzZS5yYWNlKFtcbiAgICAgICAgICAgIGFuaW1hdGVFbChjdXJyZW50LCBbXG4gICAgICAgICAgICAgICAge3RyYW5zZm9ybTogdHJhbnNmcm9tLCBvcGFjaXR5OiAxfSxcbiAgICAgICAgICAgICAgICB7b3BhY2l0eTogMH0sXG4gICAgICAgICAgICAgICAge3RyYW5zZm9ybTogdHJhbnN0bywgb3BhY2l0eTogMH1cbiAgICAgICAgICAgIF0sIHtkdXJhdGlvbjogMzAwLCBlYXNpbmc6ICdlYXNlLW91dCd9KSxcbiAgICAgICAgICAgIGFuaW1hdGVFbCh0bywgW1xuICAgICAgICAgICAgICAgIHt0cmFuc2Zvcm06IHRyYW5zZnJvbSwgb3BhY2l0eTogMH0sXG4gICAgICAgICAgICAgICAge29wYWNpdHk6IDB9LFxuICAgICAgICAgICAgICAgIHt0cmFuc2Zvcm06IHRyYW5zdG8sIG9wYWNpdHk6IDF9XG4gICAgICAgICAgICBdLCB7ZHVyYXRpb246IDMwMCwgZWFzaW5nOiAnZWFzZS1vdXQnfSlcbiAgICAgICAgXSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgZnJvbS5pbm5lckhUTUwgPSBjdXJyZW50LmlubmVySFRNTFxuICAgICAgICAgICAgICAgIGN1cnJlbnQuaW5uZXJIVE1MID0gdG8uaW5uZXJIVE1MXG4gICAgICAgICAgICAgICAgdG8uaW5uZXJIVE1MID0gbmV3c3VwcGxpZXIoKVxuICAgICAgICAgICAgICAgIHRvLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcbiAgICAgICAgfSlcbiAgICB9KVxufVxuXG5zZXR1cERhdGVMaXN0ZW5lcih7XG4gICAgZWxlbTogZWxlbUJ5SWQoJ2xpc3RuZXh0JyksXG4gICAgZnJvbTogZWxlbUJ5SWQoJ2xpc3RwcmV2ZGF0ZScpLFxuICAgIGN1cnJlbnQ6IGVsZW1CeUlkKCdsaXN0bm93ZGF0ZScpLFxuICAgIHRvOiBlbGVtQnlJZCgnbGlzdG5leHRkYXRlJyksXG4gICAgaG9va3M6IFtpbmNyZW1lbnRMaXN0RGF0ZU9mZnNldCwgZGlzcGxheV0sXG4gICAgZm9yd2FyZDogdHJ1ZSxcbiAgICBuZXdzdXBwbGllcjogKCkgPT4ge1xuICAgICAgICBjb25zdCBsaXN0RGF0ZTIgPSBuZXcgRGF0ZSgpXG4gICAgICAgIGxpc3REYXRlMi5zZXREYXRlKGxpc3REYXRlMi5nZXREYXRlKCkgKyAxICsgZ2V0TGlzdERhdGVPZmZzZXQoKSlcbiAgICAgICAgcmV0dXJuIGRhdGVTdHJpbmcobGlzdERhdGUyKS5yZXBsYWNlKCdUb2RheScsICdOb3cnKVxuICAgIH1cbn0pXG5cbnNldHVwRGF0ZUxpc3RlbmVyKHtcbiAgICBlbGVtOiBlbGVtQnlJZCgnbGlzdGJlZm9yZScpLFxuICAgIGZyb206IGVsZW1CeUlkKCdsaXN0bmV4dGRhdGUnKSxcbiAgICBjdXJyZW50OiBlbGVtQnlJZCgnbGlzdG5vd2RhdGUnKSxcbiAgICB0bzogZWxlbUJ5SWQoJ2xpc3RwcmV2ZGF0ZScpLFxuICAgIGhvb2tzOiBbZGVjcmVtZW50TGlzdERhdGVPZmZzZXQsIGRpc3BsYXldLFxuICAgIGZvcndhcmQ6IGZhbHNlLFxuICAgIG5ld3N1cHBsaWVyOiAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGxpc3REYXRlMiA9IG5ldyBEYXRlKClcbiAgICAgICAgbGlzdERhdGUyLnNldERhdGUobGlzdERhdGUyLmdldERhdGUoKSAtIDEgKyBnZXRMaXN0RGF0ZU9mZnNldCgpKVxuICAgICAgICByZXR1cm4gZGF0ZVN0cmluZyhsaXN0RGF0ZTIpLnJlcGxhY2UoJ1RvZGF5JywgJ05vdycpXG4gICAgfVxufSlcblxuZnVuY3Rpb24gbGF6eUZldGNoKCk6IHZvaWQge1xuICAgIEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndlZWssIC51cGNvbWluZ1Rlc3QnKSlcbiAgICAgICAgLmZvckVhY2goKHMpID0+IHMucmVtb3ZlKCkpXG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtcGNydmlldycpXG4gICAgaWYgKGdldENhbERhdGVPZmZzZXQoKSA9PT0gMCkge1xuICAgICAgICBzZXREYXRhKGxvY2FsU3RvcmFnZVJlYWQoJ2RhdGEnKSlcbiAgICAgICAgZGlzcGxheSgpXG4gICAgfSBlbHNlIHtcbiAgICAgICAgZmV0Y2godHJ1ZSlcbiAgICB9XG59XG5cbnNldHVwRGF0ZUxpc3RlbmVyKHtcbiAgICBlbGVtOiBlbGVtQnlJZCgnY2FsbmV4dCcpLFxuICAgIGZyb206IGVsZW1CeUlkKCdjYWxwcmV2ZGF0ZScpLFxuICAgIGN1cnJlbnQ6IGVsZW1CeUlkKCdjYWxub3dkYXRlJyksXG4gICAgdG86IGVsZW1CeUlkKCdjYWxuZXh0ZGF0ZScpLFxuICAgIGhvb2tzOiBbaW5jcmVtZW50Q2FsRGF0ZU9mZnNldCwgbGF6eUZldGNoXSxcbiAgICBmb3J3YXJkOiB0cnVlLFxuICAgIG5ld3N1cHBsaWVyOiAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGxpc3REYXRlMiA9IG5ldyBEYXRlKClcbiAgICAgICAgbGlzdERhdGUyLnNldE1vbnRoKGxpc3REYXRlMi5nZXRNb250aCgpICsgMSArIGdldENhbERhdGVPZmZzZXQoKSlcbiAgICAgICAgcmV0dXJuIG1vbnRoU3RyaW5nKGxpc3REYXRlMikucmVwbGFjZSgnVG9kYXknLCAnTm93JylcbiAgICB9XG59KVxuXG5zZXR1cERhdGVMaXN0ZW5lcih7XG4gICAgZWxlbTogZWxlbUJ5SWQoJ2NhbGJlZm9yZScpLFxuICAgIGZyb206IGVsZW1CeUlkKCdjYWxuZXh0ZGF0ZScpLFxuICAgIGN1cnJlbnQ6IGVsZW1CeUlkKCdjYWxub3dkYXRlJyksXG4gICAgdG86IGVsZW1CeUlkKCdjYWxwcmV2ZGF0ZScpLFxuICAgIGhvb2tzOiBbZGVjcmVtZW50Q2FsRGF0ZU9mZnNldCwgbGF6eUZldGNoXSxcbiAgICBmb3J3YXJkOiBmYWxzZSxcbiAgICBuZXdzdXBwbGllcjogKCkgPT4ge1xuICAgICAgICBjb25zdCBsaXN0RGF0ZTIgPSBuZXcgRGF0ZSgpXG4gICAgICAgIGxpc3REYXRlMi5zZXRNb250aChsaXN0RGF0ZTIuZ2V0TW9udGgoKSAtIDEgKyBnZXRDYWxEYXRlT2Zmc2V0KCkpXG4gICAgICAgIHJldHVybiBtb250aFN0cmluZyhsaXN0RGF0ZTIpXG4gICAgfVxufSlcblxuZnVuY3Rpb24gdXBkYXRlTGlzdE5hdigpOiB2b2lkIHtcbiAgICBjb25zdCBkID0gbmV3IERhdGUoKVxuICAgIGQuc2V0RGF0ZSgoZC5nZXREYXRlKCkgKyBnZXRMaXN0RGF0ZU9mZnNldCgpKSAtIDEpXG4gICAgY29uc3QgdXAgPSAoaWQ6IHN0cmluZykgPT4ge1xuICAgICAgICBlbGVtQnlJZChpZCkuaW5uZXJIVE1MID0gZGF0ZVN0cmluZyhkKS5yZXBsYWNlKCdUb2RheScsICdOb3cnKVxuICAgICAgICByZXR1cm4gZC5zZXREYXRlKGQuZ2V0RGF0ZSgpICsgMSlcbiAgICB9XG4gICAgdXAoJ2xpc3RwcmV2ZGF0ZScpXG4gICAgdXAoJ2xpc3Rub3dkYXRlJylcbiAgICB1cCgnbGlzdG5leHRkYXRlJylcbn1cblxuZnVuY3Rpb24gdXBkYXRlQ2FsTmF2KCk6IHZvaWQge1xuICAgIGNvbnN0IGQgPSBuZXcgRGF0ZSgpXG4gICAgZC5zZXRNb250aCgoZC5nZXRNb250aCgpICsgZ2V0Q2FsRGF0ZU9mZnNldCgpKSAtIDEpXG4gICAgY29uc3QgdXAgPSAoaWQ6IHN0cmluZykgPT4ge1xuICAgICAgICBlbGVtQnlJZChpZCkuaW5uZXJIVE1MID0gbW9udGhTdHJpbmcoZClcbiAgICAgICAgcmV0dXJuIGQuc2V0TW9udGgoZC5nZXRNb250aCgpICsgMSlcbiAgICB9XG4gICAgdXAoJ2NhbHByZXZkYXRlJylcbiAgICB1cCgnY2Fsbm93ZGF0ZScpXG4gICAgdXAoJ2NhbG5leHRkYXRlJylcbn1cblxuLy8gV2hlbmV2ZXIgYSBkYXRlIGlzIGRvdWJsZSBjbGlja2VkLCBsb25nIHRhcHBlZCwgb3IgZm9yY2UgdG91Y2hlZCwgbGlzdCB2aWV3IGZvciB0aGF0IGRheSBpcyBkaXNwbGF5ZWQuXG5mdW5jdGlvbiB1cGRhdGVEYXRlTmF2cygpOiB2b2lkIHtcbiAgICB1cGRhdGVMaXN0TmF2KClcbiAgICB1cGRhdGVDYWxOYXYoKVxufVxuXG5mdW5jdGlvbiBzd2l0Y2hUb0xpc3QoZXZ0OiBFdmVudCk6IHZvaWQge1xuICAgIGlmIChfJGgoZXZ0LnRhcmdldCkuY2xhc3NMaXN0LmNvbnRhaW5zKCdtb250aCcpIHx8IF8kaChldnQudGFyZ2V0KS5jbGFzc0xpc3QuY29udGFpbnMoJ2RhdGUnKSkge1xuICAgICAgICBzZXRMaXN0RGF0ZU9mZnNldCh0b0RhdGVOdW0oTnVtYmVyKF8kaChfJGgoZXZ0LnRhcmdldCkucGFyZW50Tm9kZSkuZ2V0QXR0cmlidXRlKCdkYXRhLWRhdGUnKSkpIC0gdG9kYXkoKSlcbiAgICAgICAgdXBkYXRlRGF0ZU5hdnMoKVxuICAgICAgICBkb2N1bWVudC5ib2R5LnNldEF0dHJpYnV0ZSgnZGF0YS12aWV3JywgJzEnKVxuICAgICAgICByZXR1cm4gZGlzcGxheSgpXG4gICAgfVxufVxuXG5kb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2RibGNsaWNrJywgc3dpdGNoVG9MaXN0KVxuZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCd3ZWJraXRtb3VzZWZvcmNldXAnLCBzd2l0Y2hUb0xpc3QpO1xuKCgpID0+IHtcbiAgICBsZXQgdGFwdGltZXI6IG51bWJlcnxudWxsID0gbnVsbFxuICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIChldnQpID0+IHRhcHRpbWVyID0gc2V0VGltZW91dCgoKCkgPT4gc3dpdGNoVG9MaXN0KGV2dCkpLCAxMDAwKSlcbiAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgKGV2dCkgPT4ge1xuICAgICAgICBpZiAodGFwdGltZXIpIGNsZWFyVGltZW91dCh0YXB0aW1lcilcbiAgICAgICAgdGFwdGltZXIgPSBudWxsXG4gICAgfSlcbn0pKClcblxuLy8gPGEgbmFtZT1cInNpZGVcIi8+XG4vLyBTaWRlIG1lbnUgYW5kIE5hdmJhclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vXG4vLyBUaGUgW0hlYWRyb29tIGxpYnJhcnldKGh0dHBzOi8vZ2l0aHViLmNvbS9XaWNreU5pbGxpYW1zL2hlYWRyb29tLmpzKSBpcyB1c2VkIHRvIHNob3cgdGhlIG5hdmJhciB3aGVuIHNjcm9sbGluZyB1cFxuY29uc3QgaGVhZHJvb20gPSBuZXcgSGVhZHJvb20oXyQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbmF2JykpLCB7XG4gIHRvbGVyYW5jZTogMTAsXG4gIG9mZnNldDogNjZcbn0pXG5oZWFkcm9vbS5pbml0KClcblxuLy8gQWxzbywgdGhlIHNpZGUgbWVudSBuZWVkcyBldmVudCBsaXN0ZW5lcnMuXG5lbGVtQnlJZCgnY29sbGFwc2VCdXR0b24nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nXG4gIGVsZW1CeUlkKCdzaWRlTmF2JykuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcbiAgcmV0dXJuIGVsZW1CeUlkKCdzaWRlQmFja2dyb3VuZCcpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXG59KVxuXG5lbGVtQnlJZCgnc2lkZUJhY2tncm91bmQnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgZWxlbUJ5SWQoJ3NpZGVCYWNrZ3JvdW5kJykuc3R5bGUub3BhY2l0eSA9ICcwJ1xuICBlbGVtQnlJZCgnc2lkZU5hdicpLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gIGVsZW1CeUlkKCdkcmFnVGFyZ2V0Jykuc3R5bGUud2lkdGggPSAnJ1xuICByZXR1cm4gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICdhdXRvJ1xuICAgIGVsZW1CeUlkKCdzaWRlQmFja2dyb3VuZCcpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcbiAgfVxuICAsIDM1MClcbn0pXG5cbnVwZGF0ZUF2YXRhcigpXG5cbi8vIDxhIG5hbWU9XCJhdGhlbmFcIi8+IEF0aGVuYSAoU2Nob29sb2d5KVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tXG4vL1xuXG4vLyA8YSBuYW1lPVwic2V0dGluZ3NcIi8+IFNldHRpbmdzXG4vLyAtLS0tLS0tLVxuLy9cbi8vIFRoZSBjb2RlIGJlbG93IHVwZGF0ZXMgdGhlIGN1cnJlbnQgdmVyc2lvbiB0ZXh0IGluIHRoZSBzZXR0aW5ncy4gSSBzaG91bGQndmUgcHV0IHRoaXMgdW5kZXIgdGhlXG4vLyBVcGRhdGVzIHNlY3Rpb24sIGJ1dCBpdCBzaG91bGQgZ28gYmVmb3JlIHRoZSBkaXNwbGF5KCkgZnVuY3Rpb24gZm9yY2VzIGEgcmVmbG93LlxuZWxlbUJ5SWQoJ3ZlcnNpb24nKS5pbm5lckhUTUwgPSBWRVJTSU9OXG5cbi8vIFRvIGJyaW5nIHVwIHRoZSBzZXR0aW5ncyB3aW5kb3dzLCBhbiBldmVudCBsaXN0ZW5lciBuZWVkcyB0byBiZSBhZGRlZCB0byB0aGUgYnV0dG9uLlxuZWxlbUJ5SWQoJ3NldHRpbmdzQicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgIGVsZW1CeUlkKCdzaWRlQmFja2dyb3VuZCcpLmNsaWNrKClcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ3NldHRpbmdzU2hvd24nKVxuICAgIGVsZW1CeUlkKCdicmFuZCcpLmlubmVySFRNTCA9ICdTZXR0aW5ncydcbiAgICByZXR1cm4gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIF8kaChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdtYWluJykpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcbiAgICB9KVxufSlcblxuLy8gVGhlIGJhY2sgYnV0dG9uIGFsc28gbmVlZHMgdG8gY2xvc2UgdGhlIHNldHRpbmdzIHdpbmRvdy5cbmVsZW1CeUlkKCdiYWNrQnV0dG9uJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgXyRoKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ21haW4nKSkuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ3NldHRpbmdzU2hvd24nKVxuICAgIHJldHVybiBlbGVtQnlJZCgnYnJhbmQnKS5pbm5lckhUTUwgPSAnQ2hlY2sgUENSJ1xufSlcblxuLy8gVGhlIGNvZGUgYmVsb3cgaXMgd2hhdCB0aGUgc2V0dGluZ3MgY29udHJvbC5cbmlmIChzZXR0aW5ncy5zZXBUYXNrcykge1xuICAgIGVsZW1CeUlkKCdpbmZvJykuY2xhc3NMaXN0LmFkZCgnaXNUYXNrcycpXG4gICAgZWxlbUJ5SWQoJ25ldycpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcbn1cbmlmIChzZXR0aW5ncy5ob2xpZGF5VGhlbWVzKSB7IGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnaG9saWRheVRoZW1lcycpIH1cbmlmIChzZXR0aW5ncy5zZXBUYXNrQ2xhc3MpIHsgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdzZXBUYXNrQ2xhc3MnKSB9XG5pbnRlcmZhY2UgSUNvbG9yTWFwIHsgW2Nsczogc3RyaW5nXTogc3RyaW5nIH1cbmxldCBhc3NpZ25tZW50Q29sb3JzOiBJQ29sb3JNYXAgPSBsb2NhbFN0b3JhZ2VSZWFkKCdhc3NpZ25tZW50Q29sb3JzJywge1xuICAgIGNsYXNzd29yazogJyM2ODlmMzgnLCBob21ld29yazogJyMyMTk2ZjMnLCBsb25ndGVybTogJyNmNTdjMDAnLCB0ZXN0OiAnI2Y0NDMzNidcbn0pXG5sZXQgY2xhc3NDb2xvcnMgPSBsb2NhbFN0b3JhZ2VSZWFkKCdjbGFzc0NvbG9ycycsICgpID0+IHtcbiAgICBjb25zdCBjYzogSUNvbG9yTWFwID0ge31cbiAgICBjb25zdCBkYXRhID0gZ2V0RGF0YSgpXG4gICAgaWYgKCFkYXRhKSByZXR1cm4gY2NcbiAgICBkYXRhLmNsYXNzZXMuZm9yRWFjaCgoYzogc3RyaW5nKSA9PiB7XG4gICAgICAgIGNjW2NdID0gJyM2MTYxNjEnXG4gICAgfSlcbiAgICByZXR1cm4gY2Ncbn0pXG5lbGVtQnlJZChgJHtzZXR0aW5ncy5jb2xvclR5cGV9Q29sb3JzYCkuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsICgpID0+IHtcbiAgaWYgKHNldHRpbmdzLnJlZnJlc2hPbkZvY3VzKSBmZXRjaCgpXG59KVxuZnVuY3Rpb24gaW50ZXJ2YWxSZWZyZXNoKCk6IHZvaWQge1xuICAgIGNvbnN0IHIgPSBzZXR0aW5ncy5yZWZyZXNoUmF0ZVxuICAgIGlmIChyID4gMCkge1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoJ1JlZnJlc2hpbmcgYmVjYXVzZSBvZiB0aW1lcicpXG4gICAgICAgICAgICBmZXRjaCgpXG4gICAgICAgICAgICBpbnRlcnZhbFJlZnJlc2goKVxuICAgICAgICB9LCByICogNjAgKiAxMDAwKVxuICAgIH1cbn1cbmludGVydmFsUmVmcmVzaCgpXG5cbi8vIEZvciBjaG9vc2luZyBjb2xvcnMsIHRoZSBjb2xvciBjaG9vc2luZyBib3hlcyBuZWVkIHRvIGJlIGluaXRpYWxpemVkLlxuY29uc3QgcGFsZXR0ZTogSUNvbG9yTWFwID0ge1xuICAnI2Y0NDMzNic6ICcjQjcxQzFDJyxcbiAgJyNlOTFlNjMnOiAnIzg4MEU0RicsXG4gICcjOWMyN2IwJzogJyM0QTE0OEMnLFxuICAnIzY3M2FiNyc6ICcjMzExQjkyJyxcbiAgJyMzZjUxYjUnOiAnIzFBMjM3RScsXG4gICcjMjE5NmYzJzogJyMwRDQ3QTEnLFxuICAnIzAzYTlmNCc6ICcjMDE1NzlCJyxcbiAgJyMwMGJjZDQnOiAnIzAwNjA2NCcsXG4gICcjMDA5Njg4JzogJyMwMDRENDAnLFxuICAnIzRjYWY1MCc6ICcjMUI1RTIwJyxcbiAgJyM2ODlmMzgnOiAnIzMzNjkxRScsXG4gICcjYWZiNDJiJzogJyM4Mjc3MTcnLFxuICAnI2ZiYzAyZCc6ICcjRjU3RjE3JyxcbiAgJyNmZmEwMDAnOiAnI0ZGNkYwMCcsXG4gICcjZjU3YzAwJzogJyNFNjUxMDAnLFxuICAnI2ZmNTcyMic6ICcjQkYzNjBDJyxcbiAgJyM3OTU1NDgnOiAnIzNFMjcyMycsXG4gICcjNjE2MTYxJzogJyMyMTIxMjEnXG59XG5cbmdldENsYXNzZXMoKS5mb3JFYWNoKChjOiBzdHJpbmcpID0+IHtcbiAgICBjb25zdCBkID0gZWxlbWVudCgnZGl2JywgW10sIGMpXG4gICAgZC5zZXRBdHRyaWJ1dGUoJ2RhdGEtY29udHJvbCcsIGMpXG4gICAgZC5hcHBlbmRDaGlsZChlbGVtZW50KCdzcGFuJywgW10pKVxuICAgIGVsZW1CeUlkKCdjbGFzc0NvbG9ycycpLmFwcGVuZENoaWxkKGQpXG59KVxuZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNvbG9ycycpLmZvckVhY2goKGUpID0+IHtcbiAgICBlLnF1ZXJ5U2VsZWN0b3JBbGwoJ2RpdicpLmZvckVhY2goKGNvbG9yKSA9PiB7XG4gICAgICAgIGNvbnN0IGNvbnRyb2xsZWRDb2xvciA9IGNvbG9yLmdldEF0dHJpYnV0ZSgnZGF0YS1jb250cm9sJylcbiAgICAgICAgaWYgKCFjb250cm9sbGVkQ29sb3IpIHRocm93IG5ldyBFcnJvcignRWxlbWVudCBoYXMgbm8gY29udHJvbGxlZCBjb2xvcicpXG5cbiAgICAgICAgY29uc3Qgc3AgPSBfJGgoY29sb3IucXVlcnlTZWxlY3Rvcignc3BhbicpKVxuICAgICAgICBjb25zdCBsaXN0TmFtZSA9IGUuZ2V0QXR0cmlidXRlKCdpZCcpID09PSAnY2xhc3NDb2xvcnMnID8gJ2NsYXNzQ29sb3JzJyA6ICdhc3NpZ25tZW50Q29sb3JzJ1xuICAgICAgICBjb25zdCBsaXN0U2V0dGVyID0gKHY6IElDb2xvck1hcCkgPT4ge1xuICAgICAgICAgICAgZS5nZXRBdHRyaWJ1dGUoJ2lkJykgPT09ICdjbGFzc0NvbG9ycycgPyBjbGFzc0NvbG9ycyA9IHYgOiBhc3NpZ25tZW50Q29sb3JzID0gdlxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGxpc3QgPSBlLmdldEF0dHJpYnV0ZSgnaWQnKSA9PT0gJ2NsYXNzQ29sb3JzJyA/IGNsYXNzQ29sb3JzIDogYXNzaWdubWVudENvbG9yc1xuICAgICAgICBzcC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBsaXN0W2NvbnRyb2xsZWRDb2xvcl1cbiAgICAgICAgT2JqZWN0LmtleXMocGFsZXR0ZSkuZm9yRWFjaCgocCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcGUgPSBlbGVtZW50KCdzcGFuJywgW10pXG4gICAgICAgICAgICBwZS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBwXG4gICAgICAgICAgICBpZiAocCA9PT0gbGlzdFtjb250cm9sbGVkQ29sb3JdKSB7XG4gICAgICAgICAgICAgICAgcGUuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3AuYXBwZW5kQ2hpbGQocGUpXG4gICAgICAgIH0pXG4gICAgICAgIGNvbnN0IGN1c3RvbSA9IGVsZW1lbnQoJ3NwYW4nLCBbJ2N1c3RvbUNvbG9yJ10sIGA8YT5DdXN0b208L2E+IFxcXG4gICAgPGlucHV0IHR5cGU9J3RleHQnIHBsYWNlaG9sZGVyPSdXYXMgJHtsaXN0W2NvbnRyb2xsZWRDb2xvcl19JyAvPiBcXFxuICAgIDxzcGFuIGNsYXNzPSdjdXN0b21JbmZvJz5Vc2UgYW55IENTUyB2YWxpZCBjb2xvciBuYW1lLCBzdWNoIGFzIFxcXG4gICAgPGNvZGU+I0Y0NDMzNjwvY29kZT4gb3IgPGNvZGU+cmdiKDY0LCA0MywgMik8L2NvZGU+IG9yIDxjb2RlPmN5YW48L2NvZGU+PC9zcGFuPiBcXFxuICAgIDxhIGNsYXNzPSdjdXN0b21Payc+U2V0PC9hPmApXG4gICAgICAgIGN1c3RvbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldnQpID0+IGV2dC5zdG9wUHJvcGFnYXRpb24oKSlcbiAgICAgICAgXyQoY3VzdG9tLnF1ZXJ5U2VsZWN0b3IoJ2EnKSkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZ0KSA9PiB7XG4gICAgICAgICAgICBzcC5jbGFzc0xpc3QudG9nZ2xlKCdvbkN1c3RvbScpXG4gICAgICAgICAgICBldnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgfSlcbiAgICAgICAgc3AuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZ0KSA9PiB7XG4gICAgICAgICAgICBpZiAoc3AuY2xhc3NMaXN0LmNvbnRhaW5zKCdjaG9vc2UnKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IF8kaChldnQudGFyZ2V0KVxuICAgICAgICAgICAgICAgIGNvbnN0IGJnID0gdGlueWNvbG9yKHRhcmdldC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgfHwgJyMwMDAnKS50b0hleFN0cmluZygpXG4gICAgICAgICAgICAgICAgbGlzdFtjb250cm9sbGVkQ29sb3JdID0gYmdcbiAgICAgICAgICAgICAgICBzcC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBiZ1xuICAgICAgICAgICAgICAgIGNvbnN0IHNlbGVjdGVkID0gdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5zZWxlY3RlZCcpXG4gICAgICAgICAgICAgICAgaWYgKHNlbGVjdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJylcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJylcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2VbbGlzdE5hbWVdID0gSlNPTi5zdHJpbmdpZnkobGlzdClcbiAgICAgICAgICAgICAgICBsaXN0U2V0dGVyKGxpc3QpXG4gICAgICAgICAgICAgICAgdXBkYXRlQ29sb3JzKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNwLmNsYXNzTGlzdC50b2dnbGUoJ2Nob29zZScpXG4gICAgICAgIH0pXG4gICAgICAgIF8kKGN1c3RvbS5xdWVyeVNlbGVjdG9yKCcuY3VzdG9tT2snKSkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZ0KSA9PiB7XG4gICAgICAgICAgICBzcC5jbGFzc0xpc3QucmVtb3ZlKCdvbkN1c3RvbScpXG4gICAgICAgICAgICBzcC5jbGFzc0xpc3QudG9nZ2xlKCdjaG9vc2UnKVxuICAgICAgICAgICAgY29uc3Qgc2VsZWN0ZWRFbCA9IHNwLnF1ZXJ5U2VsZWN0b3IoJy5zZWxlY3RlZCcpXG4gICAgICAgICAgICBpZiAoc2VsZWN0ZWRFbCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRFbC5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzcC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAobGlzdFtjb250cm9sbGVkQ29sb3JdID0gXyQoY3VzdG9tLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0JykpLnZhbHVlKVxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlW2xpc3ROYW1lXSA9IEpTT04uc3RyaW5naWZ5KGxpc3QpXG4gICAgICAgICAgICB1cGRhdGVDb2xvcnMoKVxuICAgICAgICAgICAgcmV0dXJuIGV2dC5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICB9KVxuICAgIH0pXG59KVxuXG4vLyBUaGVuLCBhIGZ1bmN0aW9uIHRoYXQgdXBkYXRlcyB0aGUgY29sb3IgcHJlZmVyZW5jZXMgaXMgZGVmaW5lZC5cbmZ1bmN0aW9uIHVwZGF0ZUNvbG9ycygpOiB2b2lkIHtcbiAgICBjb25zdCBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJylcbiAgICBzdHlsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJykpXG4gICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzdHlsZSlcbiAgICBjb25zdCBzaGVldCA9IF8kKHN0eWxlLnNoZWV0KSBhcyBDU1NTdHlsZVNoZWV0XG5cbiAgICBjb25zdCBhZGRDb2xvclJ1bGUgPSAoc2VsZWN0b3I6IHN0cmluZywgbGlnaHQ6IHN0cmluZywgZGFyazogc3RyaW5nLCBleHRyYSA9ICcnKSA9PiB7XG4gICAgICAgIGNvbnN0IG1peGVkID0gdGlueWNvbG9yLm1peChsaWdodCwgJyMxQjVFMjAnLCA3MCkudG9IZXhTdHJpbmcoKVxuICAgICAgICBzaGVldC5pbnNlcnRSdWxlKGAke2V4dHJhfS5hc3NpZ25tZW50JHtzZWxlY3Rvcn0geyBiYWNrZ3JvdW5kLWNvbG9yOiAke2xpZ2h0fTsgfWAsIDApXG4gICAgICAgIHNoZWV0Lmluc2VydFJ1bGUoYCR7ZXh0cmF9LmFzc2lnbm1lbnQke3NlbGVjdG9yfS5kb25lIHsgYmFja2dyb3VuZC1jb2xvcjogJHtkYXJrfTsgfWAsIDApXG4gICAgICAgIHNoZWV0Lmluc2VydFJ1bGUoYCR7ZXh0cmF9LmFzc2lnbm1lbnQke3NlbGVjdG9yfTo6YmVmb3JlIHsgYmFja2dyb3VuZC1jb2xvcjogJHttaXhlZH07IH1gLCAwKVxuICAgICAgICBzaGVldC5pbnNlcnRSdWxlKGAke2V4dHJhfS5hc3NpZ25tZW50SXRlbSR7c2VsZWN0b3J9PmkgeyBiYWNrZ3JvdW5kLWNvbG9yOiAke2xpZ2h0fTsgfWAsIDApXG4gICAgICAgIHNoZWV0Lmluc2VydFJ1bGUoYCR7ZXh0cmF9LmFzc2lnbm1lbnRJdGVtJHtzZWxlY3Rvcn0uZG9uZT5pIHsgYmFja2dyb3VuZC1jb2xvcjogJHtkYXJrfTsgfWAsIDApXG4gICAgfVxuXG4gICAgY29uc3QgY3JlYXRlUGFsZXR0ZSA9IChjb2xvcjogc3RyaW5nKSA9PiB0aW55Y29sb3IoY29sb3IpLmRhcmtlbigyNCkudG9IZXhTdHJpbmcoKVxuXG4gICAgaWYgKHNldHRpbmdzLmNvbG9yVHlwZSA9PT0gJ2Fzc2lnbm1lbnQnKSB7XG4gICAgICAgIE9iamVjdC5lbnRyaWVzKGFzc2lnbm1lbnRDb2xvcnMpLmZvckVhY2goKFtuYW1lLCBjb2xvcl0pID0+IHtcbiAgICAgICAgICAgIGFkZENvbG9yUnVsZShgLiR7bmFtZX1gLCBjb2xvciwgcGFsZXR0ZVtjb2xvcl0gfHwgY3JlYXRlUGFsZXR0ZShjb2xvcikpXG4gICAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgICAgT2JqZWN0LmVudHJpZXMoY2xhc3NDb2xvcnMpLmZvckVhY2goKFtuYW1lLCBjb2xvcl0pID0+IHtcbiAgICAgICAgICAgIGFkZENvbG9yUnVsZShgW2RhdGEtY2xhc3M9XFxcIiR7bmFtZX1cXFwiXWAsIGNvbG9yLCBwYWxldHRlW2NvbG9yXSB8fCBjcmVhdGVQYWxldHRlKGNvbG9yKSlcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBhZGRDb2xvclJ1bGUoJy50YXNrJywgJyNGNUY1RjUnLCAnI0UwRTBFMCcpXG4gICAgYWRkQ29sb3JSdWxlKCcudGFzaycsICcjNDI0MjQyJywgJyMyMTIxMjEnLCAnLmRhcmsgJylcbn1cblxuLy8gVGhlIGZ1bmN0aW9uIHRoZW4gbmVlZHMgdG8gYmUgY2FsbGVkLlxudXBkYXRlQ29sb3JzKClcblxuLy8gVGhlIGVsZW1lbnRzIHRoYXQgY29udHJvbCB0aGUgc2V0dGluZ3MgYWxzbyBuZWVkIGV2ZW50IGxpc3RlbmVyc1xuZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnNldHRpbmdzQ29udHJvbCcpLmZvckVhY2goKGU6IEhUTUxJbnB1dEVsZW1lbnQpID0+IHtcbiAgICBpZiAoZS50eXBlID09PSAnY2hlY2tib3gnKSB7XG4gICAgICAgIGUuY2hlY2tlZCA9IGdldFNldHRpbmcoZS5uYW1lKVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGUudmFsdWUgPSBnZXRTZXR0aW5nKGUubmFtZSlcbiAgICB9XG4gICAgZS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZXZ0KSA9PiB7XG4gICAgICAgIGlmIChlLnR5cGUgPT09ICdjaGVja2JveCcpIHtcbiAgICAgICAgICAgIHNldFNldHRpbmcoZS5uYW1lLCBlLmNoZWNrZWQpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZXRTZXR0aW5nKGUubmFtZSwgZS52YWx1ZSlcbiAgICAgICAgfVxuICAgICAgICBzd2l0Y2ggKGUubmFtZSkge1xuICAgICAgICAgICAgY2FzZSAncmVmcmVzaFJhdGUnOiByZXR1cm4gaW50ZXJ2YWxSZWZyZXNoKClcbiAgICAgICAgICAgIGNhc2UgJ2Vhcmx5VGVzdCc6IHJldHVybiBkaXNwbGF5KClcbiAgICAgICAgICAgIGNhc2UgJ2Fzc2lnbm1lbnRTcGFuJzogcmV0dXJuIGRpc3BsYXkoKVxuICAgICAgICAgICAgY2FzZSAncHJvamVjdHNJblRlc3RQYW5lJzogcmV0dXJuIGRpc3BsYXkoKVxuICAgICAgICAgICAgY2FzZSAnaGlkZUFzc2lnbm1lbnRzJzogcmV0dXJuIGRpc3BsYXkoKVxuICAgICAgICAgICAgY2FzZSAnaG9saWRheVRoZW1lcyc6IHJldHVybiBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC50b2dnbGUoJ2hvbGlkYXlUaGVtZXMnLCBlLmNoZWNrZWQpXG4gICAgICAgICAgICBjYXNlICdzZXBUYXNrQ2xhc3MnOiBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC50b2dnbGUoJ3NlcFRhc2tDbGFzcycsIGUuY2hlY2tlZCk7IHJldHVybiBkaXNwbGF5KClcbiAgICAgICAgICAgIGNhc2UgJ3NlcFRhc2tzJzogcmV0dXJuIGVsZW1CeUlkKCdzZXBUYXNrc1JlZnJlc2gnKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xuICAgICAgICB9XG4gICAgfSlcbn0pXG5cbi8vIFRoaXMgYWxzbyBuZWVkcyB0byBiZSBkb25lIGZvciByYWRpbyBidXR0b25zXG5jb25zdCBjb2xvclR5cGUgPVxuICAgIF8kKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYGlucHV0W25hbWU9XFxcImNvbG9yVHlwZVxcXCJdW3ZhbHVlPVxcXCIke3NldHRpbmdzLmNvbG9yVHlwZX1cXFwiXWApKSBhcyBIVE1MSW5wdXRFbGVtZW50XG5jb2xvclR5cGUuY2hlY2tlZCA9IHRydWVcbkFycmF5LmZyb20oZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUoJ2NvbG9yVHlwZScpKS5mb3JFYWNoKChjKSA9PiB7XG4gIGMuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGV2dCkgPT4ge1xuICAgIGNvbnN0IHYgPSAoXyQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaW5wdXRbbmFtZT1cImNvbG9yVHlwZVwiXTpjaGVja2VkJykpIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlXG4gICAgaWYgKHYgIT09ICdhc3NpZ25tZW50JyAmJiB2ICE9PSAnY2xhc3MnKSByZXR1cm5cbiAgICBzZXR0aW5ncy5jb2xvclR5cGUgPSB2XG4gICAgaWYgKHYgPT09ICdjbGFzcycpIHtcbiAgICAgIGVsZW1CeUlkKCdhc3NpZ25tZW50Q29sb3JzJykuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuICAgICAgZWxlbUJ5SWQoJ2NsYXNzQ29sb3JzJykuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcbiAgICB9IGVsc2Uge1xuICAgICAgZWxlbUJ5SWQoJ2Fzc2lnbm1lbnRDb2xvcnMnKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xuICAgICAgZWxlbUJ5SWQoJ2NsYXNzQ29sb3JzJykuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuICAgIH1cbiAgICByZXR1cm4gdXBkYXRlQ29sb3JzKClcbiAgfSlcbn0pXG5cbi8vIFRoZSBzYW1lIGdvZXMgZm9yIHRleHRhcmVhcy5cbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3RleHRhcmVhJykuZm9yRWFjaCgoZSkgPT4ge1xuICBpZiAoKGUubmFtZSAhPT0gJ2F0aGVuYURhdGFSYXcnKSAmJiAobG9jYWxTdG9yYWdlW2UubmFtZV0gIT0gbnVsbCkpIHtcbiAgICBlLnZhbHVlID0gbG9jYWxTdG9yYWdlW2UubmFtZV1cbiAgfVxuICBlLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKGV2dCkgPT4ge1xuICAgIGxvY2FsU3RvcmFnZVtlLm5hbWVdID0gZS52YWx1ZVxuICAgIGlmIChlLm5hbWUgPT09ICdhdGhlbmFEYXRhUmF3Jykge1xuICAgICAgdXBkYXRlQXRoZW5hRGF0YShlLnZhbHVlKVxuICAgIH1cbiAgfSlcbn0pXG5cbi8vIDxhIG5hbWU9XCJzdGFydGluZ1wiLz5cbi8vIFN0YXJ0aW5nIGV2ZXJ5dGhpbmdcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vXG4vLyBGaW5hbGx5ISBXZSBhcmUgKGFsbW9zdCkgZG9uZSFcbi8vXG4vLyBCZWZvcmUgZ2V0dGluZyB0byBhbnl0aGluZywgbGV0J3MgcHJpbnQgb3V0IGEgd2VsY29taW5nIG1lc3NhZ2UgdG8gdGhlIGNvbnNvbGUhXG5jb25zb2xlLmxvZygnJWNDaGVjayBQQ1InLCAnY29sb3I6ICMwMDQwMDA7IGZvbnQtc2l6ZTogM2VtJylcbmNvbnNvbGUubG9nKGAlY1ZlcnNpb24gJHtWRVJTSU9OfSAoQ2hlY2sgYmVsb3cgZm9yIGN1cnJlbnQgdmVyc2lvbilgLCAnZm9udC1zaXplOiAxLjFlbScpXG5jb25zb2xlLmxvZyhgV2VsY29tZSB0byB0aGUgZGV2ZWxvcGVyIGNvbnNvbGUgZm9yIHlvdXIgYnJvd3NlciEgQmVzaWRlcyBsb29raW5nIGF0IHRoZSBzb3VyY2UgY29kZSwgXFxcbnlvdSBjYW4gYWxzbyBwbGF5IGFyb3VuZCB3aXRoIENoZWNrIFBDUiBieSBleGVjdXRpbmcgdGhlIGxpbmVzIGJlbG93OlxuJWNcXHRmZXRjaCh0cnVlKSAgICAgICAgICAgICAgICVjLy8gUmVsb2FkcyBhbGwgb2YgeW91ciBhc3NpZ25tZW50cyAodGhlIHRydWUgaXMgZm9yIGZvcmNpbmcgYSByZWxvYWQgaWYgb25lIFxcXG5oYXMgYWxyZWFkeSBiZWVuIHRyaWdnZXJlZCBpbiB0aGUgbGFzdCBtaW51dGUpXG4lY1xcdGRhdGEgICAgICAgICAgICAgICAgICAgICAgJWMvLyBEaXNwbGF5cyB0aGUgb2JqZWN0IHRoYXQgY29udGFpbnMgdGhlIGRhdGEgcGFyc2VkIGZyb20gUENSJ3MgaW50ZXJmYWNlXG4lY1xcdGFjdGl2aXR5ICAgICAgICAgICAgICAgICAgJWMvLyBUaGUgZGF0YSBmb3IgdGhlIGFzc2lnbm1lbnRzIHRoYXQgc2hvdyB1cCBpbiB0aGUgYWN0aXZpdHkgcGFuZVxuJWNcXHRleHRyYSAgICAgICAgICAgICAgICAgICAgICVjLy8gQWxsIG9mIHRoZSB0YXNrcyB5b3UndmUgY3JlYXRlZCBieSBjbGlja2luZyB0aGUgKyBidXR0b25cbiVjXFx0YXRoZW5hRGF0YSAgICAgICAgICAgICAgICAlYy8vIFRoZSBkYXRhIGZldGNoZWQgZnJvbSBBdGhlbmEgKGlmIHlvdSd2ZSBwYXN0ZWQgdGhlIHJhdyBkYXRhIGludG8gc2V0dGluZ3MpXG4lY1xcdHNuYWNrYmFyKFwiSGVsbG8gV29ybGQhXCIpICAlYy8vIENyZWF0ZXMgYSBzbmFja2JhciBzaG93aW5nIHRoZSBtZXNzYWdlIFwiSGVsbG8gV29ybGQhXCJcbiVjXFx0ZGlzcGxheUVycm9yKG5ldyBFcnJvcigpKSAlYy8vIERpc3BsYXlzIHRoZSBzdGFjayB0cmFjZSBmb3IgYSByYW5kb20gZXJyb3IgKEp1c3QgZG9uJ3Qgc3VibWl0IGl0ISlcbiVjXFx0Y2xvc2VFcnJvcigpICAgICAgICAgICAgICAlYy8vIENsb3NlcyB0aGF0IGRpYWxvZ2AsXG4gICAgICAgICAgICAgICAuLi4oKFtdIGFzIHN0cmluZ1tdKS5jb25jYXQoLi4uQXJyYXkuZnJvbShuZXcgQXJyYXkoOCksICgpID0+IFsnY29sb3I6IGluaXRpYWwnLCAnY29sb3I6IGdyZXknXSkpKSlcbmNvbnNvbGUubG9nKCcnKVxuXG4vLyBUaGUgXCJsYXN0IHVwZGF0ZWRcIiB0ZXh0IGlzIHNldCB0byB0aGUgY29ycmVjdCBkYXRlLlxuY29uc3QgdHJpZWRMYXN0VXBkYXRlID0gbG9jYWxTdG9yYWdlUmVhZCgnbGFzdFVwZGF0ZScpXG5lbGVtQnlJZCgnbGFzdFVwZGF0ZScpLmlubmVySFRNTCA9IHRyaWVkTGFzdFVwZGF0ZSA/IGZvcm1hdFVwZGF0ZSh0cmllZExhc3RVcGRhdGUpIDogJ05ldmVyJ1xuXG5pZiAobG9jYWxTdG9yYWdlUmVhZCgnZGF0YScpICE9IG51bGwpIHtcbiAgICAvLyBOb3cgY2hlY2sgaWYgdGhlcmUncyBhY3Rpdml0eVxuICAgIHJlY2VudEFjdGl2aXR5KCkuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICBhZGRBY3Rpdml0eShpdGVtWzBdLCBpdGVtWzFdLCBuZXcgRGF0ZShpdGVtWzJdKSwgZmFsc2UsIGl0ZW1bM10pXG4gICAgfSlcblxuICAgIGRpc3BsYXkoKVxufVxuXG5mZXRjaCgpXG5cbi8vIDxhIG5hbWU9XCJldmVudHNcIi8+XG4vLyBFdmVudHNcbi8vIC0tLS0tLVxuLy9cbi8vIFRoZSBkb2N1bWVudCBib2R5IG5lZWRzIHRvIGJlIGVuYWJsZWQgZm9yIGhhbW1lci5qcyBldmVudHMuXG5kZWxldGUgSGFtbWVyLmRlZmF1bHRzLmNzc1Byb3BzLnVzZXJTZWxlY3RcbmNvbnN0IGhhbW1lcnRpbWUgPSBuZXcgSGFtbWVyLk1hbmFnZXIoZG9jdW1lbnQuYm9keSwge1xuICByZWNvZ25pemVyczogW1xuICAgIFtIYW1tZXIuUGFuLCB7ZGlyZWN0aW9uOiBIYW1tZXIuRElSRUNUSU9OX0hPUklaT05UQUx9XVxuICBdXG59KVxuXG4vLyBGb3IgdG91Y2ggZGlzcGxheXMsIGhhbW1lci5qcyBpcyB1c2VkIHRvIG1ha2UgdGhlIHNpZGUgbWVudSBhcHBlYXIvZGlzYXBwZWFyLiBUaGUgY29kZSBiZWxvdyBpc1xuLy8gYWRhcHRlZCBmcm9tIE1hdGVyaWFsaXplJ3MgaW1wbGVtZW50YXRpb24uXG5sZXQgbWVudU91dCA9IGZhbHNlXG5jb25zdCBkcmFnVGFyZ2V0ID0gbmV3IEhhbW1lcihlbGVtQnlJZCgnZHJhZ1RhcmdldCcpKVxuZHJhZ1RhcmdldC5vbigncGFuJywgKGUpID0+IHtcbiAgaWYgKGUucG9pbnRlclR5cGUgPT09ICd0b3VjaCcpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICBsZXQgeyB4IH0gPSBlLmNlbnRlclxuICAgIGNvbnN0IHsgeSB9ID0gZS5jZW50ZXJcblxuICAgIGNvbnN0IHNCa2cgPSBlbGVtQnlJZCgnc2lkZUJhY2tncm91bmQnKVxuICAgIHNCa2cuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcbiAgICBzQmtnLnN0eWxlLm9wYWNpdHkgPSAnMCdcbiAgICBlbGVtQnlJZCgnc2lkZU5hdicpLmNsYXNzTGlzdC5hZGQoJ21hbnVhbCcpXG5cbiAgICAvLyBLZWVwIHdpdGhpbiBib3VuZGFyaWVzXG4gICAgaWYgKHggPiAyNDApIHtcbiAgICAgIHggPSAyNDBcbiAgICB9IGVsc2UgaWYgKHggPCAwKSB7XG4gICAgICB4ID0gMFxuXG4gICAgICAvLyBMZWZ0IERpcmVjdGlvblxuICAgICAgaWYgKHggPCAxMjApIHtcbiAgICAgICAgbWVudU91dCA9IGZhbHNlXG4gICAgICAvLyBSaWdodCBEaXJlY3Rpb25cbiAgICAgIH0gZWxzZSBpZiAoeCA+PSAxMjApIHtcbiAgICAgICAgbWVudU91dCA9IHRydWVcbiAgICAgIH1cbiAgICB9XG5cbiAgICBlbGVtQnlJZCgnc2lkZU5hdicpLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGVYKCR7eCAtIDI0MH1weClgXG4gICAgY29uc3Qgb3ZlcmxheVBlcmNlbnQgPSBNYXRoLm1pbih4IC8gNDgwLCAwLjUpXG4gICAgcmV0dXJuIHNCa2cuc3R5bGUub3BhY2l0eSA9IFN0cmluZyhvdmVybGF5UGVyY2VudClcbiAgfVxufSlcblxuZHJhZ1RhcmdldC5vbigncGFuZW5kJywgKGUpID0+IHtcbiAgaWYgKGUucG9pbnRlclR5cGUgPT09ICd0b3VjaCcpIHtcbiAgICBsZXQgc2lkZU5hdlxuICAgIGNvbnN0IHsgdmVsb2NpdHlYIH0gPSBlXG4gICAgLy8gSWYgdmVsb2NpdHlYIDw9IDAuMyB0aGVuIHRoZSB1c2VyIGlzIGZsaW5naW5nIHRoZSBtZW51IGNsb3NlZCBzbyBpZ25vcmUgbWVudU91dFxuICAgIGlmICgobWVudU91dCAmJiAodmVsb2NpdHlYIDw9IDAuMykpIHx8ICh2ZWxvY2l0eVggPCAtMC41KSkge1xuICAgICAgc2lkZU5hdiA9IGVsZW1CeUlkKCdzaWRlTmF2JylcbiAgICAgIHNpZGVOYXYuY2xhc3NMaXN0LnJlbW92ZSgnbWFudWFsJylcbiAgICAgIHNpZGVOYXYuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcbiAgICAgIHNpZGVOYXYuc3R5bGUudHJhbnNmb3JtID0gJydcbiAgICAgIGVsZW1CeUlkKCdkcmFnVGFyZ2V0Jykuc3R5bGUud2lkdGggPSAnMTAwJSdcblxuICAgIH0gZWxzZSBpZiAoIW1lbnVPdXQgfHwgKHZlbG9jaXR5WCA+IDAuMykpIHtcbiAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnYXV0bydcbiAgICAgIHNpZGVOYXYgPSBlbGVtQnlJZCgnc2lkZU5hdicpXG4gICAgICBzaWRlTmF2LmNsYXNzTGlzdC5yZW1vdmUoJ21hbnVhbCcpXG4gICAgICBzaWRlTmF2LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gICAgICBzaWRlTmF2LnN0eWxlLnRyYW5zZm9ybSA9ICcnXG4gICAgICBlbGVtQnlJZCgnc2lkZUJhY2tncm91bmQnKS5zdHlsZS5vcGFjaXR5ID0gJydcbiAgICAgIGVsZW1CeUlkKCdkcmFnVGFyZ2V0Jykuc3R5bGUud2lkdGggPSAnMTBweCdcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gZWxlbUJ5SWQoJ3NpZGVCYWNrZ3JvdW5kJykuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuICAgICAgLCAzNTApXG4gICAgfVxuICB9XG59KVxuXG5kcmFnVGFyZ2V0Lm9uKCd0YXAnLCAoZSkgPT4ge1xuICAgIGVsZW1CeUlkKCdzaWRlQmFja2dyb3VuZCcpLmNsaWNrKClcbiAgICBlLnByZXZlbnREZWZhdWx0KClcbn0pXG5cbmNvbnN0IGR0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RyYWdUYXJnZXQnKVxuXG4vLyBUaGUgYWN0aXZpdHkgZmlsdGVyIGJ1dHRvbiBhbHNvIG5lZWRzIGFuIGV2ZW50IGxpc3RlbmVyLlxucmlwcGxlKGVsZW1CeUlkKCdmaWx0ZXJBY3Rpdml0eScpKVxuZWxlbUJ5SWQoJ2ZpbHRlckFjdGl2aXR5JykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gIGVsZW1CeUlkKCdpbmZvQWN0aXZpdHknKS5jbGFzc0xpc3QudG9nZ2xlKCdmaWx0ZXInKVxufSlcblxuLy8gQXQgdGhlIHN0YXJ0LCBpdCBuZWVkcyB0byBiZSBjb3JyZWN0bHkgcG9wdWxhdGVkXG5jb25zdCBhY3Rpdml0eVR5cGVzID0gc2V0dGluZ3Muc2hvd25BY3Rpdml0eVxuXG5mdW5jdGlvbiB1cGRhdGVTZWxlY3ROdW0oKTogc3RyaW5nIHtcbiAgICBjb25zdCBjID0gKGJvb2w6IGJvb2xlYW4pICA9PiBib29sID8gMSA6IDBcbiAgICBjb25zdCBjb3VudCA9IFN0cmluZyhjKGFjdGl2aXR5VHlwZXMuYWRkKSArIGMoYWN0aXZpdHlUeXBlcy5lZGl0KSArIGMoYWN0aXZpdHlUeXBlcy5kZWxldGUpKVxuICAgIHJldHVybiBlbGVtQnlJZCgnc2VsZWN0TnVtJykuaW5uZXJIVE1MID0gY291bnRcbn1cbnVwZGF0ZVNlbGVjdE51bSgpXG5PYmplY3QuZW50cmllcyhhY3Rpdml0eVR5cGVzKS5mb3JFYWNoKChbdHlwZSwgZW5hYmxlZF0pID0+IHtcbiAgaWYgKHR5cGUgIT09ICdhZGQnICYmIHR5cGUgIT09ICdlZGl0JyAmJiB0eXBlICE9PSAnZGVsZXRlJykge1xuICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBhY3Rpdml0eSB0eXBlICR7dHlwZX1gKVxuICB9XG5cbiAgY29uc3Qgc2VsZWN0RWwgPSBlbGVtQnlJZCh0eXBlICsgJ1NlbGVjdCcpIGFzIEhUTUxJbnB1dEVsZW1lbnRcbiAgc2VsZWN0RWwuY2hlY2tlZCA9IGVuYWJsZWRcbiAgaWYgKGVuYWJsZWQpIHsgZWxlbUJ5SWQoJ2luZm9BY3Rpdml0eScpLmNsYXNzTGlzdC5hZGQodHlwZSkgfVxuICBzZWxlY3RFbC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZXZ0KSA9PiB7XG4gICAgYWN0aXZpdHlUeXBlc1t0eXBlXSA9IHNlbGVjdEVsLmNoZWNrZWRcbiAgICBlbGVtQnlJZCgnaW5mb0FjdGl2aXR5Jykuc2V0QXR0cmlidXRlKCdkYXRhLWZpbHRlcmVkJywgdXBkYXRlU2VsZWN0TnVtKCkpXG4gICAgZWxlbUJ5SWQoJ2luZm9BY3Rpdml0eScpLmNsYXNzTGlzdC50b2dnbGUodHlwZSlcbiAgICBzZXR0aW5ncy5zaG93bkFjdGl2aXR5ID0gYWN0aXZpdHlUeXBlc1xuICB9KVxufSlcblxuLy8gVGhlIHNob3cgY29tcGxldGVkIHRhc2tzIGNoZWNrYm94IGlzIHNldCBjb3JyZWN0bHkgYW5kIGlzIGFzc2lnbmVkIGFuIGV2ZW50IGxpc3RlbmVyLlxuY29uc3Qgc2hvd0RvbmVUYXNrc0VsID0gZWxlbUJ5SWQoJ3Nob3dEb25lVGFza3MnKSBhcyBIVE1MSW5wdXRFbGVtZW50XG5pZiAoc2V0dGluZ3Muc2hvd0RvbmVUYXNrcykge1xuICBzaG93RG9uZVRhc2tzRWwuY2hlY2tlZCA9IHRydWVcbiAgZWxlbUJ5SWQoJ2luZm9UYXNrc0lubmVyJykuY2xhc3NMaXN0LmFkZCgnc2hvd0RvbmVUYXNrcycpXG59XG5zaG93RG9uZVRhc2tzRWwuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKCkgPT4ge1xuICBzZXR0aW5ncy5zaG93RG9uZVRhc2tzID0gc2hvd0RvbmVUYXNrc0VsLmNoZWNrZWRcbiAgZWxlbUJ5SWQoJ2luZm9UYXNrc0lubmVyJykuY2xhc3NMaXN0LnRvZ2dsZSgnc2hvd0RvbmVUYXNrcycsIHNldHRpbmdzLnNob3dEb25lVGFza3MpXG59KVxuXG4vLyA8YSBuYW1lPVwidXBkYXRlc1wiLz5cbi8vIFVwZGF0ZXMgYW5kIE5ld3Ncbi8vIC0tLS0tLS0tLS0tLS0tLS1cbi8vXG5cbmlmIChsb2NhdGlvbi5wcm90b2NvbCA9PT0gJ2Nocm9tZS1leHRlbnNpb246JykgeyBjaGVja0NvbW1pdCgpIH1cblxuLy8gVGhpcyB1cGRhdGUgZGlhbG9nIGFsc28gbmVlZHMgdG8gYmUgY2xvc2VkIHdoZW4gdGhlIGJ1dHRvbnMgYXJlIGNsaWNrZWQuXG5lbGVtQnlJZCgndXBkYXRlRGVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgZWxlbUJ5SWQoJ3VwZGF0ZScpLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgIGVsZW1CeUlkKCd1cGRhdGVCYWNrZ3JvdW5kJykuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuICB9LCAzNTApXG59KVxuXG4vLyBGb3IgbmV3cywgdGhlIGxhdGVzdCBuZXdzIGlzIGZldGNoZWQgZnJvbSBhIEdpdEh1YiBnaXN0LlxuZmV0Y2hOZXdzKClcblxuLy8gVGhlIG5ld3MgZGlhbG9nIHRoZW4gbmVlZHMgdG8gYmUgY2xvc2VkIHdoZW4gT0sgb3IgdGhlIGJhY2tncm91bmQgaXMgY2xpY2tlZC5cbmZ1bmN0aW9uIGNsb3NlTmV3cygpOiB2b2lkIHtcbiAgZWxlbUJ5SWQoJ25ld3MnKS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICBlbGVtQnlJZCgnbmV3c0JhY2tncm91bmQnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXG4gIH0sIDM1MClcbn1cblxuZWxlbUJ5SWQoJ25ld3NPaycpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xvc2VOZXdzKVxuZWxlbUJ5SWQoJ25ld3NCYWNrZ3JvdW5kJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbG9zZU5ld3MpXG5cbi8vIEl0IGFsc28gbmVlZHMgdG8gYmUgb3BlbmVkIHdoZW4gdGhlIG5ld3MgYnV0dG9uIGlzIGNsaWNrZWQuXG5lbGVtQnlJZCgnbmV3c0InKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgZWxlbUJ5SWQoJ3NpZGVCYWNrZ3JvdW5kJykuY2xpY2soKVxuICBjb25zdCBkaXNwbGF5TmV3cyA9ICgpID0+IHtcbiAgICBlbGVtQnlJZCgnbmV3c0JhY2tncm91bmQnKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xuICAgIHJldHVybiBlbGVtQnlJZCgnbmV3cycpLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG4gIH1cblxuICBpZiAoZWxlbUJ5SWQoJ25ld3NDb250ZW50JykuY2hpbGROb2Rlcy5sZW5ndGggPT09IDApIHtcbiAgICBnZXROZXdzKGRpc3BsYXlOZXdzKVxuICB9IGVsc2Uge1xuICAgIGRpc3BsYXlOZXdzKClcbiAgfVxufSlcblxuLy8gVGhlIHNhbWUgZ29lcyBmb3IgdGhlIGVycm9yIGRpYWxvZy5cbmZ1bmN0aW9uIGNsb3NlRXJyb3IoKTogdm9pZCB7XG4gIGVsZW1CeUlkKCdlcnJvcicpLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgIGVsZW1CeUlkKCdlcnJvckJhY2tncm91bmQnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXG4gIH0sIDM1MClcbn1cblxuZWxlbUJ5SWQoJ2Vycm9yTm8nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsb3NlRXJyb3IpXG5lbGVtQnlJZCgnZXJyb3JCYWNrZ3JvdW5kJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbG9zZUVycm9yKVxuXG4vLyA8YSBuYW1lPVwibmV3XCIvPlxuLy8gQWRkaW5nIG5ldyBhc3NpZ25tZW50c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy9cbi8vIFRoZSBldmVudCBsaXN0ZW5lcnMgZm9yIHRoZSBuZXcgYnV0dG9ucyBhcmUgYWRkZWQuXG5yaXBwbGUoZWxlbUJ5SWQoJ25ldycpKVxucmlwcGxlKGVsZW1CeUlkKCduZXdUYXNrJykpXG5jb25zdCBvbk5ld1Rhc2sgPSAoKSA9PiB7XG4gIHVwZGF0ZU5ld1RpcHMoKGVsZW1CeUlkKCduZXdUZXh0JykgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWUgPSAnJylcbiAgZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nXG4gIGVsZW1CeUlkKCduZXdCYWNrZ3JvdW5kJykuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcbiAgZWxlbUJ5SWQoJ25ld0RpYWxvZycpLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG4gIGVsZW1CeUlkKCduZXdUZXh0JykuZm9jdXMoKVxufVxuZWxlbUJ5SWQoJ25ldycpLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBvbk5ld1Rhc2spXG5lbGVtQnlJZCgnbmV3VGFzaycpLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBvbk5ld1Rhc2spXG5cbi8vIEEgZnVuY3Rpb24gdG8gY2xvc2UgdGhlIGRpYWxvZyBpcyB0aGVuIGRlZmluZWQuXG5mdW5jdGlvbiBjbG9zZU5ldygpOiB2b2lkIHtcbiAgZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICdhdXRvJ1xuICBlbGVtQnlJZCgnbmV3RGlhbG9nJykuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcbiAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgZWxlbUJ5SWQoJ25ld0JhY2tncm91bmQnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXG4gIH0sIDM1MClcbn1cblxuLy8gVGhpcyBmdW5jdGlvbiBpcyBzZXQgdG8gYmUgY2FsbGVkIGNhbGxlZCB3aGVuIHRoZSBFU0Mga2V5IGlzIGNhbGxlZCBpbnNpZGUgb2YgdGhlIGRpYWxvZy5cbmVsZW1CeUlkKCduZXdUZXh0JykuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldnQpID0+IHtcbiAgaWYgKGV2dC53aGljaCA9PT0gMjcpIHsgLy8gRXNjYXBlIGtleSBwcmVzc2VkXG4gICAgY2xvc2VOZXcoKVxuICB9XG59KVxuXG4vLyBBbiBldmVudCBsaXN0ZW5lciB0byBjYWxsIHRoZSBmdW5jdGlvbiBpcyBhbHNvIGFkZGVkIHRvIHRoZSBYIGJ1dHRvblxuZWxlbUJ5SWQoJ25ld0NhbmNlbCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xvc2VOZXcpXG5cbi8vIFdoZW4gdGhlIGVudGVyIGtleSBpcyBwcmVzc2VkIG9yIHRoZSBzdWJtaXQgYnV0dG9uIGlzIGNsaWNrZWQsIHRoZSBuZXcgYXNzaWdubWVudCBpcyBhZGRlZC5cbmVsZW1CeUlkKCduZXdEaWFsb2cnKS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCAoZXZ0KSA9PiB7XG4gIGV2dC5wcmV2ZW50RGVmYXVsdCgpXG4gIGNvbnN0IGl0ZXh0ID0gKGVsZW1CeUlkKCduZXdUZXh0JykgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWVcbiAgY29uc3QgeyB0ZXh0LCBjbHMsIGR1ZSwgc3QgfSA9IHBhcnNlQ3VzdG9tVGFzayhpdGV4dClcbiAgbGV0IGVuZDogJ0ZvcmV2ZXInfG51bWJlciA9ICdGb3JldmVyJ1xuXG4gIGNvbnN0IHN0YXJ0ID0gKHN0ICE9IG51bGwpID8gdG9EYXRlTnVtKGNocm9uby5wYXJzZURhdGUoc3QpKSA6IHRvZGF5KClcbiAgaWYgKGR1ZSAhPSBudWxsKSB7XG4gICAgZW5kID0gdG9EYXRlTnVtKGNocm9uby5wYXJzZURhdGUoZHVlKSlcbiAgICBpZiAoZW5kIDwgc3RhcnQpIHsgLy8gQXNzaWdubWVudCBlbmRzIGJlZm9yZSBpdCBpcyBhc3NpZ25lZFxuICAgICAgZW5kICs9IE1hdGguY2VpbCgoc3RhcnQgLSBlbmQpIC8gNykgKiA3XG4gICAgfVxuICB9XG4gIGFkZFRvRXh0cmEoe1xuICAgIGJvZHk6IHRleHQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB0ZXh0LnN1YnN0cigxKSxcbiAgICBkb25lOiBmYWxzZSxcbiAgICBzdGFydCxcbiAgICBjbGFzczogKGNscyAhPSBudWxsKSA/IGNscy50b0xvd2VyQ2FzZSgpLnRyaW0oKSA6IG51bGwsXG4gICAgZW5kXG4gIH0pXG4gIHNhdmVFeHRyYSgpXG4gIGNsb3NlTmV3KClcbiAgZGlzcGxheShmYWxzZSlcbn0pXG5cbnVwZGF0ZU5ld1RpcHMoJycsIGZhbHNlKVxuZWxlbUJ5SWQoJ25ld1RleHQnKS5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsICgpID0+IHtcbiAgcmV0dXJuIHVwZGF0ZU5ld1RpcHMoKGVsZW1CeUlkKCduZXdUZXh0JykgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWUpXG59KVxuXG4vLyBUaGUgY29kZSBiZWxvdyByZWdpc3RlcnMgYSBzZXJ2aWNlIHdvcmtlciB0aGF0IGNhY2hlcyB0aGUgcGFnZSBzbyBpdCBjYW4gYmUgdmlld2VkIG9mZmxpbmUuXG5pZiAoJ3NlcnZpY2VXb3JrZXInIGluIG5hdmlnYXRvcikge1xuICBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5yZWdpc3RlcignL3NlcnZpY2Utd29ya2VyLmpzJylcbiAgICAudGhlbigocmVnaXN0cmF0aW9uKSA9PlxuICAgICAgLy8gUmVnaXN0cmF0aW9uIHdhcyBzdWNjZXNzZnVsXG4gICAgICBjb25zb2xlLmxvZygnU2VydmljZVdvcmtlciByZWdpc3RyYXRpb24gc3VjY2Vzc2Z1bCB3aXRoIHNjb3BlJywgcmVnaXN0cmF0aW9uLnNjb3BlKSkuY2F0Y2goKGVycikgPT5cbiAgICAgIC8vIHJlZ2lzdHJhdGlvbiBmYWlsZWQgOihcbiAgICAgIGNvbnNvbGUubG9nKCdTZXJ2aWNlV29ya2VyIHJlZ2lzdHJhdGlvbiBmYWlsZWQ6ICcsIGVycilcbiAgKVxufVxuXG4vLyBJZiB0aGUgc2VydmljZSB3b3JrZXIgZGV0ZWN0cyB0aGF0IHRoZSB3ZWIgYXBwIGhhcyBiZWVuIHVwZGF0ZWQsIHRoZSBjb21taXQgaXMgZmV0Y2hlZCBmcm9tIEdpdEh1Yi5cbm5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCAoZXZlbnQpID0+IHtcbiAgICBjb25zb2xlLmxvZygnR2V0dGluZyBjb21taXQgYmVjYXVzZSBvZiBzZXJ2aWNld29ya2VyJylcbiAgICBpZiAoZXZlbnQuZGF0YS5nZXRDb21taXQpIHsgcmV0dXJuIGNoZWNrQ29tbWl0KCkgfVxufSlcbiIsImltcG9ydCB7IGNsYXNzQnlJZCwgZ2V0RGF0YSwgSUFzc2lnbm1lbnQgfSBmcm9tICcuLi9wY3InXG5pbXBvcnQgeyBBY3Rpdml0eVR5cGUgfSBmcm9tICcuLi9wbHVnaW5zL2FjdGl2aXR5J1xuaW1wb3J0IHsgYXNzaWdubWVudEluRG9uZSB9IGZyb20gJy4uL3BsdWdpbnMvZG9uZSdcbmltcG9ydCB7IF8kLCBkYXRlU3RyaW5nLCBlbGVtQnlJZCwgZWxlbWVudCwgc21vb3RoU2Nyb2xsIH0gZnJvbSAnLi4vdXRpbCdcbmltcG9ydCB7IHNlcGFyYXRlIH0gZnJvbSAnLi9hc3NpZ25tZW50J1xuXG5leHBvcnQgZnVuY3Rpb24gYWRkQWN0aXZpdHlFbGVtZW50KGVsOiBIVE1MRWxlbWVudCk6IHZvaWQge1xuICAgIGNvbnN0IGluc2VydFRvID0gZWxlbUJ5SWQoJ2luZm9BY3Rpdml0eScpXG4gICAgaW5zZXJ0VG8uaW5zZXJ0QmVmb3JlKGVsLCBpbnNlcnRUby5xdWVyeVNlbGVjdG9yKCcuYWN0aXZpdHknKSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUFjdGl2aXR5KHR5cGU6IEFjdGl2aXR5VHlwZSwgYXNzaWdubWVudDogSUFzc2lnbm1lbnQsIGRhdGU6IERhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPzogc3RyaW5nICk6IEhUTUxFbGVtZW50IHtcbiAgICBjb25zdCBjbmFtZSA9IGNsYXNzTmFtZSB8fCBjbGFzc0J5SWQoYXNzaWdubWVudC5jbGFzcylcblxuICAgIGNvbnN0IHRlID0gZWxlbWVudCgnZGl2JywgWydhY3Rpdml0eScsICdhc3NpZ25tZW50SXRlbScsIGFzc2lnbm1lbnQuYmFzZVR5cGUsIHR5cGVdLCBgXG4gICAgICAgIDxpIGNsYXNzPSdtYXRlcmlhbC1pY29ucyc+JHt0eXBlfTwvaT5cbiAgICAgICAgPHNwYW4gY2xhc3M9J3RpdGxlJz4ke2Fzc2lnbm1lbnQudGl0bGV9PC9zcGFuPlxuICAgICAgICA8c21hbGw+JHtzZXBhcmF0ZShjbmFtZSlbMl19PC9zbWFsbD5cbiAgICAgICAgPGRpdiBjbGFzcz0ncmFuZ2UnPiR7ZGF0ZVN0cmluZyhkYXRlKX08L2Rpdj5gLCBgYWN0aXZpdHkke2Fzc2lnbm1lbnQuaWR9YClcbiAgICB0ZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtY2xhc3MnLCBjbmFtZSlcbiAgICBjb25zdCB7IGlkIH0gPSBhc3NpZ25tZW50XG4gICAgaWYgKHR5cGUgIT09ICdkZWxldGUnKSB7XG4gICAgICAgIHRlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZG9TY3JvbGxpbmcgPSBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZWwgPSBfJChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAuYXNzaWdubWVudFtpZCo9XFxcIiR7aWR9XFxcIl1gKSkgYXMgSFRNTEVsZW1lbnRcbiAgICAgICAgICAgICAgICBhd2FpdCBzbW9vdGhTY3JvbGwoKGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCArIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wKSAtIDExNilcbiAgICAgICAgICAgICAgICBlbC5jbGljaygpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuYm9keS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmlldycpID09PSAnMCcpIHtcbiAgICAgICAgICAgIHJldHVybiBkb1Njcm9sbGluZygpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIChfJChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbmF2VGFicz5saTpmaXJzdC1jaGlsZCcpKSBhcyBIVE1MRWxlbWVudCkuY2xpY2soKVxuICAgICAgICAgICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGRvU2Nyb2xsaW5nLCA1MDApXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgaWYgKGFzc2lnbm1lbnRJbkRvbmUoYXNzaWdubWVudC5pZCkpIHtcbiAgICAgIHRlLmNsYXNzTGlzdC5hZGQoJ2RvbmUnKVxuICAgIH1cbiAgICByZXR1cm4gdGVcbn1cbiIsImltcG9ydCB7IGZyb21EYXRlTnVtLCB0b2RheSB9IGZyb20gJy4uL2RhdGVzJ1xuaW1wb3J0IHsgZGlzcGxheSwgZ2V0VGltZUFmdGVyLCBJU3BsaXRBc3NpZ25tZW50IH0gZnJvbSAnLi4vZGlzcGxheSdcbmltcG9ydCB7IGdldExpc3REYXRlT2Zmc2V0IH0gZnJvbSAnLi4vbmF2aWdhdGlvbidcbmltcG9ydCB7IGdldEF0dGFjaG1lbnRNaW1lVHlwZSwgSUFwcGxpY2F0aW9uRGF0YSwgSUFzc2lnbm1lbnQsIHVybEZvckF0dGFjaG1lbnQgfSBmcm9tICcuLi9wY3InXG5pbXBvcnQgeyByZWNlbnRBY3Rpdml0eSB9IGZyb20gJy4uL3BsdWdpbnMvYWN0aXZpdHknXG5pbXBvcnQgeyBnZXRBdGhlbmFEYXRhIH0gZnJvbSAnLi4vcGx1Z2lucy9hdGhlbmEnXG5pbXBvcnQgeyByZW1vdmVGcm9tRXh0cmEsIHNhdmVFeHRyYSB9IGZyb20gJy4uL3BsdWdpbnMvY3VzdG9tQXNzaWdubWVudHMnXG5pbXBvcnQgeyBhZGRUb0RvbmUsIGFzc2lnbm1lbnRJbkRvbmUsIHJlbW92ZUZyb21Eb25lLCBzYXZlRG9uZSB9IGZyb20gJy4uL3BsdWdpbnMvZG9uZSdcbmltcG9ydCB7IG1vZGlmaWVkQm9keSwgcmVtb3ZlRnJvbU1vZGlmaWVkLCBzYXZlTW9kaWZpZWQsIHNldE1vZGlmaWVkIH0gZnJvbSAnLi4vcGx1Z2lucy9tb2RpZmllZEFzc2lnbm1lbnRzJ1xuaW1wb3J0IHsgc2V0dGluZ3MgfSBmcm9tICcuLi9zZXR0aW5ncydcbmltcG9ydCB7IF8kLCBjc3NOdW1iZXIsIGRhdGVTdHJpbmcsIGVsZW1CeUlkLCBlbGVtZW50LCBmb3JjZUxheW91dCwgcmlwcGxlIH0gZnJvbSAnLi4vdXRpbCdcbmltcG9ydCB7IHJlc2l6ZSB9IGZyb20gJy4vcmVzaXplcidcblxuY29uc3QgbWltZVR5cGVzOiB7IFttaW1lOiBzdHJpbmddOiBbc3RyaW5nLCBzdHJpbmddIH0gPSB7XG4gICAgJ2FwcGxpY2F0aW9uL21zd29yZCc6IFsnV29yZCBEb2MnLCAnZG9jdW1lbnQnXSxcbiAgICAnYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LndvcmRwcm9jZXNzaW5nbWwuZG9jdW1lbnQnOiBbJ1dvcmQgRG9jJywgJ2RvY3VtZW50J10sXG4gICAgJ2FwcGxpY2F0aW9uL3ZuZC5tcy1wb3dlcnBvaW50JzogWydQUFQgUHJlc2VudGF0aW9uJywgJ3NsaWRlcyddLFxuICAgICdhcHBsaWNhdGlvbi9wZGYnOiBbJ1BERiBGaWxlJywgJ3BkZiddLFxuICAgICd0ZXh0L3BsYWluJzogWydUZXh0IERvYycsICdwbGFpbiddXG59XG5cbmNvbnN0IGRtcCA9IG5ldyBkaWZmX21hdGNoX3BhdGNoKCkgLy8gRm9yIGRpZmZpbmdcblxuZnVuY3Rpb24gcG9wdWxhdGVBZGRlZERlbGV0ZWQoZGlmZnM6IGFueVtdLCBlZGl0czogSFRNTEVsZW1lbnQpOiBib29sZWFuIHtcbiAgICBsZXQgYWRkZWQgPSAwXG4gICAgbGV0IGRlbGV0ZWQgPSAwXG4gICAgZGlmZnMuZm9yRWFjaCgoZGlmZikgPT4ge1xuICAgICAgICBpZiAoZGlmZlswXSA9PT0gMSkgeyBhZGRlZCsrIH1cbiAgICAgICAgaWYgKGRpZmZbMF0gPT09IC0xKSB7IGRlbGV0ZWQrKyB9XG4gICAgfSlcbiAgICBfJChlZGl0cy5xdWVyeVNlbGVjdG9yKCcuYWRkaXRpb25zJykpLmlubmVySFRNTCA9IGFkZGVkICE9PSAwID8gYCske2FkZGVkfWAgOiAnJ1xuICAgIF8kKGVkaXRzLnF1ZXJ5U2VsZWN0b3IoJy5kZWxldGlvbnMnKSkuaW5uZXJIVE1MID0gZGVsZXRlZCAhPT0gMCA/IGAtJHtkZWxldGVkfWAgOiAnJ1xuICAgIGVkaXRzLmNsYXNzTGlzdC5hZGQoJ25vdEVtcHR5JylcbiAgICByZXR1cm4gYWRkZWQgPiAwIHx8IGRlbGV0ZWQgPiAwXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb21wdXRlV2Vla0lkKHNwbGl0OiBJU3BsaXRBc3NpZ25tZW50KTogc3RyaW5nIHtcbiAgICBjb25zdCBzdGFydFN1biA9IG5ldyBEYXRlKHNwbGl0LnN0YXJ0LmdldFRpbWUoKSlcbiAgICBzdGFydFN1bi5zZXREYXRlKHN0YXJ0U3VuLmdldERhdGUoKSAtIHN0YXJ0U3VuLmdldERheSgpKVxuICAgIHJldHVybiBgd2ske3N0YXJ0U3VuLmdldE1vbnRoKCl9LSR7c3RhcnRTdW4uZ2V0RGF0ZSgpfWBcbn1cblxuLy8gVGhpcyBmdW5jdGlvbiBzZXBhcmF0ZXMgdGhlIHBhcnRzIG9mIGEgY2xhc3MgbmFtZS5cbmV4cG9ydCBmdW5jdGlvbiBzZXBhcmF0ZShjbDogc3RyaW5nKTogUmVnRXhwTWF0Y2hBcnJheSB7XG4gICAgY29uc3QgbSA9IGNsLm1hdGNoKC8oKD86XFxkKlxccyspPyg/Oig/Omhvblxcdyp8KD86YWR2XFx3KlxccyopP2NvcmUpXFxzKyk/KSguKikvaSlcbiAgICBpZiAobSA9PSBudWxsKSB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBzZXBhcmF0ZSBjbGFzcyBzdHJpbmcgJHtjbH1gKVxuICAgIHJldHVybiBtXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3NpZ25tZW50Q2xhc3MoYXNzaWdubWVudDogSUFzc2lnbm1lbnQsIGRhdGE6IElBcHBsaWNhdGlvbkRhdGEpOiBzdHJpbmcge1xuICAgIGNvbnN0IGNscyA9IChhc3NpZ25tZW50LmNsYXNzICE9IG51bGwpID8gZGF0YS5jbGFzc2VzW2Fzc2lnbm1lbnQuY2xhc3NdIDogJ1Rhc2snXG4gICAgaWYgKGNscyA9PSBudWxsKSB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBmaW5kIGNsYXNzICR7YXNzaWdubWVudC5jbGFzc30gaW4gJHtkYXRhLmNsYXNzZXN9YClcbiAgICByZXR1cm4gY2xzXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXBhcmF0ZWRDbGFzcyhhc3NpZ25tZW50OiBJQXNzaWdubWVudCwgZGF0YTogSUFwcGxpY2F0aW9uRGF0YSk6IFJlZ0V4cE1hdGNoQXJyYXkge1xuICAgIHJldHVybiBzZXBhcmF0ZShhc3NpZ25tZW50Q2xhc3MoYXNzaWdubWVudCwgZGF0YSkpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVBc3NpZ25tZW50KHNwbGl0OiBJU3BsaXRBc3NpZ25tZW50LCBkYXRhOiBJQXBwbGljYXRpb25EYXRhKTogSFRNTEVsZW1lbnQge1xuICAgIGNvbnN0IHsgYXNzaWdubWVudCwgcmVmZXJlbmNlIH0gPSBzcGxpdFxuXG4gICAgLy8gU2VwYXJhdGUgdGhlIGNsYXNzIGRlc2NyaXB0aW9uIGZyb20gdGhlIGFjdHVhbCBjbGFzc1xuICAgIGNvbnN0IHNlcGFyYXRlZCA9IHNlcGFyYXRlZENsYXNzKGFzc2lnbm1lbnQsIGRhdGEpXG5cbiAgICBjb25zdCB3ZWVrSWQgPSBjb21wdXRlV2Vla0lkKHNwbGl0KVxuXG4gICAgbGV0IHNtYWxsVGFnID0gJ3NtYWxsJ1xuICAgIGxldCBsaW5rID0gbnVsbFxuICAgIGNvbnN0IGF0aGVuYURhdGEgPSBnZXRBdGhlbmFEYXRhKClcbiAgICBpZiAoYXRoZW5hRGF0YSAmJiBhc3NpZ25tZW50LmNsYXNzICE9IG51bGwgJiYgKGF0aGVuYURhdGFbZGF0YS5jbGFzc2VzW2Fzc2lnbm1lbnQuY2xhc3NdXSAhPSBudWxsKSkge1xuICAgICAgICBsaW5rID0gYXRoZW5hRGF0YVtkYXRhLmNsYXNzZXNbYXNzaWdubWVudC5jbGFzc11dLmxpbmtcbiAgICAgICAgc21hbGxUYWcgPSAnYSdcbiAgICB9XG5cbiAgICBjb25zdCBlID0gZWxlbWVudCgnZGl2JywgWydhc3NpZ25tZW50JywgYXNzaWdubWVudC5iYXNlVHlwZSwgJ2FuaW0nXSxcbiAgICAgICAgICAgICAgICAgICAgICBgPCR7c21hbGxUYWd9JHtsaW5rID8gYCBocmVmPScke2xpbmt9JyBjbGFzcz0nbGlua2VkJyB0YXJnZXQ9J19ibGFuaydgIDogJyd9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9J2V4dHJhJz4ke3NlcGFyYXRlZFsxXX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAke3NlcGFyYXRlZFsyXX1cbiAgICAgICAgICAgICAgICAgICAgICAgPC8ke3NtYWxsVGFnfT48c3BhbiBjbGFzcz0ndGl0bGUnPiR7YXNzaWdubWVudC50aXRsZX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPSdoaWRkZW4nIGNsYXNzPSdkdWUnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT0nJHthc3NpZ25tZW50LmVuZCA9PT0gJ0ZvcmV2ZXInID8gMCA6IGFzc2lnbm1lbnQuZW5kfScgLz5gLFxuICAgICAgICAgICAgICAgICAgICAgIGFzc2lnbm1lbnQuaWQgKyB3ZWVrSWQpXG5cbiAgICBpZiAoKCByZWZlcmVuY2UgJiYgcmVmZXJlbmNlLmRvbmUpIHx8IGFzc2lnbm1lbnRJbkRvbmUoYXNzaWdubWVudC5pZCkpIHtcbiAgICAgICAgZS5jbGFzc0xpc3QuYWRkKCdkb25lJylcbiAgICB9XG4gICAgZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtY2xhc3MnLCBhc3NpZ25tZW50Q2xhc3MoYXNzaWdubWVudCwgZGF0YSkpXG4gICAgY29uc3QgY2xvc2UgPSBlbGVtZW50KCdhJywgWydjbG9zZScsICdtYXRlcmlhbC1pY29ucyddLCAnY2xvc2UnKVxuICAgIGNsb3NlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xvc2VPcGVuZWQpXG4gICAgZS5hcHBlbmRDaGlsZChjbG9zZSlcblxuICAgIC8vIFByZXZlbnQgY2xpY2tpbmcgdGhlIGNsYXNzIG5hbWUgd2hlbiBhbiBpdGVtIGlzIGRpc3BsYXllZCBvbiB0aGUgY2FsZW5kYXIgZnJvbSBkb2luZyBhbnl0aGluZ1xuICAgIGlmIChsaW5rICE9IG51bGwpIHtcbiAgICAgICAgXyQoZS5xdWVyeVNlbGVjdG9yKCdhJykpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2dCkgPT4ge1xuICAgICAgICAgICAgaWYgKChkb2N1bWVudC5ib2R5LmdldEF0dHJpYnV0ZSgnZGF0YS12aWV3JykgPT09ICcwJykgJiYgIWUuY2xhc3NMaXN0LmNvbnRhaW5zKCdmdWxsJykpIHtcbiAgICAgICAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGNvbnN0IGNvbXBsZXRlID0gZWxlbWVudCgnYScsIFsnY29tcGxldGUnLCAnbWF0ZXJpYWwtaWNvbnMnLCAnd2F2ZXMnXSwgJ2RvbmUnKVxuICAgIHJpcHBsZShjb21wbGV0ZSlcbiAgICBjb25zdCBpZCA9IHNwbGl0LmFzc2lnbm1lbnQuaWRcbiAgICBjb21wbGV0ZS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgKGV2dCkgPT4ge1xuICAgICAgICBpZiAoZXZ0LndoaWNoID09PSAxKSB7IC8vIExlZnQgYnV0dG9uXG4gICAgICAgICAgICBsZXQgYWRkZWQgPSB0cnVlXG4gICAgICAgICAgICBpZiAocmVmZXJlbmNlICE9IG51bGwpIHsgLy8gVGFzayBpdGVtXG4gICAgICAgICAgICAgICAgaWYgKGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdkb25lJykpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVmZXJlbmNlLmRvbmUgPSBmYWxzZVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGFkZGVkID0gZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgcmVmZXJlbmNlLmRvbmUgPSB0cnVlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNhdmVFeHRyYSgpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChlLmNsYXNzTGlzdC5jb250YWlucygnZG9uZScpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlbW92ZUZyb21Eb25lKGFzc2lnbm1lbnQuaWQpXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYWRkZWQgPSBmYWxzZVxuICAgICAgICAgICAgICAgICAgICBhZGRUb0RvbmUoYXNzaWdubWVudC5pZClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2F2ZURvbmUoKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGRvY3VtZW50LmJvZHkuZ2V0QXR0cmlidXRlKCdkYXRhLXZpZXcnKSA9PT0gJzEnKSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICAgICAgICAgICAgICAgICBgLmFzc2lnbm1lbnRbaWRePVxcXCIke2lkfVxcXCJdLCAjdGVzdCR7aWR9LCAjYWN0aXZpdHkke2lkfSwgI2lhJHtpZH1gXG4gICAgICAgICAgICAgICAgKS5mb3JFYWNoKChlbGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW0uY2xhc3NMaXN0LnRvZ2dsZSgnZG9uZScpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICBpZiAoYWRkZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5hc3NpZ25tZW50Lmxpc3REaXNwOm5vdCguZG9uZSknKS5sZW5ndGggIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnbm9MaXN0JylcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYXNzaWdubWVudC5saXN0RGlzcDpub3QoLmRvbmUpJykubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ25vTGlzdCcpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzaXplKClcbiAgICAgICAgICAgIH0sIDEwMClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXG4gICAgICAgICAgICAgICAgYC5hc3NpZ25tZW50W2lkXj1cXFwiJHtpZH1cXFwiXSwgI3Rlc3Qke2lkfSwgI2FjdGl2aXR5JHtpZH0sICNpYSR7aWR9YFxuICAgICAgICAgICAgKS5mb3JFYWNoKChlbGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgZWxlbS5jbGFzc0xpc3QudG9nZ2xlKCdkb25lJylcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBpZiAoYWRkZWQpIHtcbiAgICAgICAgICAgICAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmFzc2lnbm1lbnQubGlzdERpc3A6bm90KC5kb25lKScpLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ25vTGlzdCcpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmFzc2lnbm1lbnQubGlzdERpc3A6bm90KC5kb25lKScpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ25vTGlzdCcpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSlcbiAgICBlLmFwcGVuZENoaWxkKGNvbXBsZXRlKVxuXG4gICAgLy8gSWYgdGhlIGFzc2lnbm1lbnQgaXMgYSBjdXN0b20gb25lLCBhZGQgYSBidXR0b24gdG8gZGVsZXRlIGl0XG4gICAgaWYgKHNwbGl0LmN1c3RvbSkge1xuICAgICAgICBjb25zdCBkZWxldGVBID0gZWxlbWVudCgnYScsIFsnbWF0ZXJpYWwtaWNvbnMnLCAnZGVsZXRlQXNzaWdubWVudCcsICd3YXZlcyddLCAnZGVsZXRlJylcbiAgICAgICAgcmlwcGxlKGRlbGV0ZUEpXG4gICAgICAgIGRlbGV0ZUEuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIChldnQpID0+IHtcbiAgICAgICAgICAgIGlmIChldnQud2hpY2ggIT09IDEgfHwgIXJlZmVyZW5jZSkgcmV0dXJuXG4gICAgICAgICAgICByZW1vdmVGcm9tRXh0cmEocmVmZXJlbmNlKVxuICAgICAgICAgICAgc2F2ZUV4dHJhKClcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZnVsbCcpICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2F1dG8nXG4gICAgICAgICAgICAgICAgY29uc3QgYmFjayA9IGVsZW1CeUlkKCdiYWNrZ3JvdW5kJylcbiAgICAgICAgICAgICAgICBiYWNrLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGJhY2suc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuICAgICAgICAgICAgICAgIH0sIDM1MClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGUucmVtb3ZlKClcbiAgICAgICAgICAgIGRpc3BsYXkoZmFsc2UpXG4gICAgICAgIH0pXG4gICAgICAgIGUuYXBwZW5kQ2hpbGQoZGVsZXRlQSlcbiAgICB9XG5cbiAgICAvLyBNb2RpZmljYXRpb24gYnV0dG9uXG4gICAgY29uc3QgZWRpdCA9IGVsZW1lbnQoJ2EnLCBbJ2VkaXRBc3NpZ25tZW50JywgJ21hdGVyaWFsLWljb25zJywgJ3dhdmVzJ10sICdlZGl0JylcbiAgICBlZGl0LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCAoZXZ0KSA9PiB7XG4gICAgICAgIGlmIChldnQud2hpY2ggPT09IDEpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlbW92ZSA9IGVkaXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKVxuICAgICAgICAgICAgZWRpdC5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnKVxuICAgICAgICAgICAgXyQoZS5xdWVyeVNlbGVjdG9yKCcuYm9keScpKS5zZXRBdHRyaWJ1dGUoJ2NvbnRlbnRFZGl0YWJsZScsIHJlbW92ZSA/ICdmYWxzZScgOiAndHJ1ZScpXG4gICAgICAgICAgICBpZiAoIXJlbW92ZSkge1xuICAgICAgICAgICAgICAgIChlLnF1ZXJ5U2VsZWN0b3IoJy5ib2R5JykgYXMgSFRNTEVsZW1lbnQpLmZvY3VzKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGRuID0gZS5xdWVyeVNlbGVjdG9yKCcuY29tcGxldGUnKSBhcyBIVE1MRWxlbWVudFxuICAgICAgICAgICAgZG4uc3R5bGUuZGlzcGxheSA9IHJlbW92ZSA/ICdibG9jaycgOiAnbm9uZSdcbiAgICAgICAgfVxuICAgIH0pXG4gICAgcmlwcGxlKGVkaXQpXG5cbiAgICBlLmFwcGVuZENoaWxkKGVkaXQpXG5cbiAgICBjb25zdCBzdGFydCA9IG5ldyBEYXRlKGZyb21EYXRlTnVtKGFzc2lnbm1lbnQuc3RhcnQpKVxuICAgIGNvbnN0IGVuZCA9IGFzc2lnbm1lbnQuZW5kID09PSAnRm9yZXZlcicgPyBhc3NpZ25tZW50LmVuZCA6IG5ldyBEYXRlKGZyb21EYXRlTnVtKGFzc2lnbm1lbnQuZW5kKSlcbiAgICBjb25zdCB0aW1lcyA9IGVsZW1lbnQoJ2RpdicsICdyYW5nZScsXG4gICAgICAgIGFzc2lnbm1lbnQuc3RhcnQgPT09IGFzc2lnbm1lbnQuZW5kID8gZGF0ZVN0cmluZyhzdGFydCkgOiBgJHtkYXRlU3RyaW5nKHN0YXJ0KX0gJm5kYXNoOyAke2RhdGVTdHJpbmcoZW5kKX1gKVxuICAgIGUuYXBwZW5kQ2hpbGQodGltZXMpXG4gICAgaWYgKGFzc2lnbm1lbnQuYXR0YWNobWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICBjb25zdCBhdHRhY2htZW50cyA9IGVsZW1lbnQoJ2RpdicsICdhdHRhY2htZW50cycpXG4gICAgICAgIGFzc2lnbm1lbnQuYXR0YWNobWVudHMuZm9yRWFjaCgoYXR0YWNobWVudCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgYSA9IGVsZW1lbnQoJ2EnLCBbXSwgYXR0YWNobWVudFswXSkgYXMgSFRNTEFuY2hvckVsZW1lbnRcbiAgICAgICAgICAgIGEuaHJlZiA9IHVybEZvckF0dGFjaG1lbnQoYXR0YWNobWVudFsxXSlcbiAgICAgICAgICAgIGdldEF0dGFjaG1lbnRNaW1lVHlwZShhdHRhY2htZW50WzFdKS50aGVuKCh0eXBlKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHNwYW5cbiAgICAgICAgICAgICAgICBpZiAobWltZVR5cGVzW3R5cGVdICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgYS5jbGFzc0xpc3QuYWRkKG1pbWVUeXBlc1t0eXBlXVsxXSlcbiAgICAgICAgICAgICAgICAgICAgc3BhbiA9IGVsZW1lbnQoJ3NwYW4nLCBbXSwgbWltZVR5cGVzW3R5cGVdWzBdKVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNwYW4gPSBlbGVtZW50KCdzcGFuJywgW10sICdVbmtub3duIGZpbGUgdHlwZScpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGEuYXBwZW5kQ2hpbGQoc3BhbilcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBhdHRhY2htZW50cy5hcHBlbmRDaGlsZChhKVxuICAgICAgICB9KVxuICAgICAgICBlLmFwcGVuZENoaWxkKGF0dGFjaG1lbnRzKVxuICAgIH1cblxuICAgIGNvbnN0IGJvZHkgPSBlbGVtZW50KCdkaXYnLCAnYm9keScsXG4gICAgICAgIGFzc2lnbm1lbnQuYm9keS5yZXBsYWNlKC9mb250LWZhbWlseTpbXjtdKj8oPzpUaW1lcyBOZXcgUm9tYW58c2VyaWYpW147XSovZywgJycpKVxuICAgIGNvbnN0IGVkaXRzID0gZWxlbWVudCgnZGl2JywgJ2VkaXRzJywgJzxzcGFuIGNsYXNzPVxcJ2FkZGl0aW9uc1xcJz48L3NwYW4+PHNwYW4gY2xhc3M9XFwnZGVsZXRpb25zXFwnPjwvc3Bhbj4nKVxuICAgIGNvbnN0IG0gPSBtb2RpZmllZEJvZHkoYXNzaWdubWVudC5pZClcbiAgICBpZiAobSAhPSBudWxsKSB7XG4gICAgICAgIGNvbnN0IGQgPSBkbXAuZGlmZl9tYWluKGFzc2lnbm1lbnQuYm9keSwgbSlcbiAgICAgICAgZG1wLmRpZmZfY2xlYW51cFNlbWFudGljKGQpXG4gICAgICAgIGlmIChkLmxlbmd0aCAhPT0gMCkgeyAvLyBIYXMgYmVlbiBlZGl0ZWRcbiAgICAgICAgICAgIHBvcHVsYXRlQWRkZWREZWxldGVkKGQsIGVkaXRzKVxuICAgICAgICAgICAgYm9keS5pbm5lckhUTUwgPSBtXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKGV2dCkgPT4ge1xuICAgICAgICBpZiAocmVmZXJlbmNlICE9IG51bGwpIHtcbiAgICAgICAgICAgIHJlZmVyZW5jZS5ib2R5ID0gYm9keS5pbm5lckhUTUxcbiAgICAgICAgICAgIHNhdmVFeHRyYSgpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZXRNb2RpZmllZChhc3NpZ25tZW50LmlkLCAgYm9keS5pbm5lckhUTUwpXG4gICAgICAgICAgICBzYXZlTW9kaWZpZWQoKVxuICAgICAgICAgICAgY29uc3QgZCA9IGRtcC5kaWZmX21haW4oYXNzaWdubWVudC5ib2R5LCBib2R5LmlubmVySFRNTClcbiAgICAgICAgICAgIGRtcC5kaWZmX2NsZWFudXBTZW1hbnRpYyhkKVxuICAgICAgICAgICAgaWYgKHBvcHVsYXRlQWRkZWREZWxldGVkKGQsIGVkaXRzKSkge1xuICAgICAgICAgICAgICAgIGVkaXRzLmNsYXNzTGlzdC5hZGQoJ25vdEVtcHR5JylcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZWRpdHMuY2xhc3NMaXN0LnJlbW92ZSgnbm90RW1wdHknKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChkb2N1bWVudC5ib2R5LmdldEF0dHJpYnV0ZSgnZGF0YS12aWV3JykgPT09ICcxJykgcmVzaXplKClcbiAgICB9KVxuXG4gICAgZS5hcHBlbmRDaGlsZChib2R5KVxuXG4gICAgY29uc3QgcmVzdG9yZSA9IGVsZW1lbnQoJ2EnLCBbJ21hdGVyaWFsLWljb25zJywgJ3Jlc3RvcmUnXSwgJ3NldHRpbmdzX2JhY2t1cF9yZXN0b3JlJylcbiAgICByZXN0b3JlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICByZW1vdmVGcm9tTW9kaWZpZWQoYXNzaWdubWVudC5pZClcbiAgICAgICAgc2F2ZU1vZGlmaWVkKClcbiAgICAgICAgYm9keS5pbm5lckhUTUwgPSBhc3NpZ25tZW50LmJvZHlcbiAgICAgICAgZWRpdHMuY2xhc3NMaXN0LnJlbW92ZSgnbm90RW1wdHknKVxuICAgICAgICBpZiAoZG9jdW1lbnQuYm9keS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmlldycpID09PSAnMScpICByZXNpemUoKVxuICAgIH0pXG4gICAgZWRpdHMuYXBwZW5kQ2hpbGQocmVzdG9yZSlcbiAgICBlLmFwcGVuZENoaWxkKGVkaXRzKVxuXG4gICAgY29uc3QgbW9kcyA9IGVsZW1lbnQoJ2RpdicsIFsnbW9kcyddKVxuICAgIHJlY2VudEFjdGl2aXR5KCkuZm9yRWFjaCgoYSkgPT4ge1xuICAgICAgICBpZiAoKGFbMF0gPT09ICdlZGl0JykgJiYgKGFbMV0uaWQgPT09IGFzc2lnbm1lbnQuaWQpKSB7XG4gICAgICAgIGNvbnN0IHRlID0gZWxlbWVudCgnZGl2JywgWydpbm5lckFjdGl2aXR5JywgJ2Fzc2lnbm1lbnRJdGVtJywgYXNzaWdubWVudC5iYXNlVHlwZV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBgPGkgY2xhc3M9J21hdGVyaWFsLWljb25zJz5lZGl0PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPSd0aXRsZSc+JHtkYXRlU3RyaW5nKG5ldyBEYXRlKGFbMl0pKX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9J2FkZGl0aW9ucyc+PC9zcGFuPjxzcGFuIGNsYXNzPSdkZWxldGlvbnMnPjwvc3Bhbj5gLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgYGlhJHthc3NpZ25tZW50LmlkfWApXG4gICAgICAgIGNvbnN0IGQgPSBkbXAuZGlmZl9tYWluKGFbMV0uYm9keSwgYXNzaWdubWVudC5ib2R5KVxuICAgICAgICBkbXAuZGlmZl9jbGVhbnVwU2VtYW50aWMoZClcbiAgICAgICAgcG9wdWxhdGVBZGRlZERlbGV0ZWQoZCwgdGUpXG5cbiAgICAgICAgaWYgKGFzc2lnbm1lbnQuY2xhc3MpIHRlLnNldEF0dHJpYnV0ZSgnZGF0YS1jbGFzcycsIGRhdGEuY2xhc3Nlc1thc3NpZ25tZW50LmNsYXNzXSlcbiAgICAgICAgdGUuYXBwZW5kQ2hpbGQoZWxlbWVudCgnZGl2JywgJ2lhRGlmZicsIGRtcC5kaWZmX3ByZXR0eUh0bWwoZCkpKVxuICAgICAgICB0ZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgIHRlLmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScpXG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuYm9keS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmlldycpID09PSAnMScpIHJlc2l6ZSgpXG4gICAgICAgIH0pXG4gICAgICAgIG1vZHMuYXBwZW5kQ2hpbGQodGUpXG4gICAgICAgIH1cbiAgICB9KVxuICAgIGUuYXBwZW5kQ2hpbGQobW9kcylcblxuICAgIGlmIChzZXR0aW5ncy5hc3NpZ25tZW50U3BhbiA9PT0gJ211bHRpcGxlJyAmJiAoc3RhcnQgPCBzcGxpdC5zdGFydCkpIHtcbiAgICAgICAgZS5jbGFzc0xpc3QuYWRkKCdmcm9tV2Vla2VuZCcpXG4gICAgfVxuICAgIGlmIChzZXR0aW5ncy5hc3NpZ25tZW50U3BhbiA9PT0gJ211bHRpcGxlJyAmJiAoZW5kID4gc3BsaXQuZW5kKSkge1xuICAgICAgICBlLmNsYXNzTGlzdC5hZGQoJ292ZXJXZWVrZW5kJylcbiAgICB9XG4gICAgZS5jbGFzc0xpc3QuYWRkKGBzJHtzcGxpdC5zdGFydC5nZXREYXkoKX1gKVxuICAgIGlmIChzcGxpdC5lbmQgIT09ICdGb3JldmVyJykgZS5jbGFzc0xpc3QuYWRkKGBlJHs2IC0gc3BsaXQuZW5kLmdldERheSgpfWApXG5cbiAgICBjb25zdCBzdCA9IE1hdGguZmxvb3Ioc3BsaXQuc3RhcnQuZ2V0VGltZSgpIC8gMTAwMCAvIDM2MDAgLyAyNClcbiAgICBpZiAoc3BsaXQuYXNzaWdubWVudC5lbmQgPT09ICdGb3JldmVyJykge1xuICAgICAgICBpZiAoc3QgPD0gKHRvZGF5KCkgKyBnZXRMaXN0RGF0ZU9mZnNldCgpKSkge1xuICAgICAgICAgICAgZS5jbGFzc0xpc3QuYWRkKCdsaXN0RGlzcCcpXG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBtaWREYXRlID0gbmV3IERhdGUoKVxuICAgICAgICBtaWREYXRlLnNldERhdGUobWlkRGF0ZS5nZXREYXRlKCkgKyBnZXRMaXN0RGF0ZU9mZnNldCgpKVxuICAgICAgICBjb25zdCBwdXNoID0gKGFzc2lnbm1lbnQuYmFzZVR5cGUgPT09ICd0ZXN0JyAmJiBhc3NpZ25tZW50LnN0YXJ0ID09PSBzdCkgPyBzZXR0aW5ncy5lYXJseVRlc3QgOiAwXG4gICAgICAgIGNvbnN0IGVuZEV4dHJhID0gZ2V0TGlzdERhdGVPZmZzZXQoKSA9PT0gMCA/IGdldFRpbWVBZnRlcihtaWREYXRlKSA6IDI0ICogMzYwMCAqIDEwMDBcbiAgICAgICAgaWYgKGZyb21EYXRlTnVtKHN0IC0gcHVzaCkgPD0gbWlkRGF0ZSAmJlxuICAgICAgICAgICAgKHNwbGl0LmVuZCA9PT0gJ0ZvcmV2ZXInIHx8IG1pZERhdGUuZ2V0VGltZSgpIDw9IHNwbGl0LmVuZC5nZXRUaW1lKCkgKyBlbmRFeHRyYSkpIHtcbiAgICAgICAgICAgIGUuY2xhc3NMaXN0LmFkZCgnbGlzdERpc3AnKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gQWRkIGNsaWNrIGludGVyYWN0aXZpdHlcbiAgICBpZiAoIXNwbGl0LmN1c3RvbSB8fCAhc2V0dGluZ3Muc2VwVGFza3MpIHtcbiAgICAgICAgZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldnQpID0+IHtcbiAgICAgICAgICAgIGlmICgoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnZnVsbCcpLmxlbmd0aCA9PT0gMCkgJiZcbiAgICAgICAgICAgICAgICAoZG9jdW1lbnQuYm9keS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmlldycpID09PSAnMCcpKSB7XG4gICAgICAgICAgICAgICAgZS5jbGFzc0xpc3QucmVtb3ZlKCdhbmltJylcbiAgICAgICAgICAgICAgICBlLmNsYXNzTGlzdC5hZGQoJ21vZGlmeScpXG4gICAgICAgICAgICAgICAgY29uc3QgdG9wID0gKGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wIC0gZG9jdW1lbnQuYm9keS5zY3JvbGxUb3BcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAtIGNzc051bWJlcihlLnN0eWxlLm1hcmdpblRvcCkpICsgNDRcbiAgICAgICAgICAgICAgICBlLnN0eWxlLnRvcCA9IHRvcCAtIHdpbmRvdy5wYWdlWU9mZnNldCArICdweCdcbiAgICAgICAgICAgICAgICBlLnNldEF0dHJpYnV0ZSgnZGF0YS10b3AnLCBTdHJpbmcodG9wKSlcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbidcbiAgICAgICAgICAgICAgICBjb25zdCBiYWNrID0gZWxlbUJ5SWQoJ2JhY2tncm91bmQnKVxuICAgICAgICAgICAgICAgIGJhY2suY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcbiAgICAgICAgICAgICAgICBiYWNrLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXG4gICAgICAgICAgICAgICAgZS5jbGFzc0xpc3QuYWRkKCdhbmltJylcbiAgICAgICAgICAgICAgICBmb3JjZUxheW91dChlKVxuICAgICAgICAgICAgICAgIGUuY2xhc3NMaXN0LmFkZCgnZnVsbCcpXG4gICAgICAgICAgICAgICAgZS5zdHlsZS50b3AgPSAoNzUgLSBjc3NOdW1iZXIoZS5zdHlsZS5tYXJnaW5Ub3ApKSArICdweCdcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IGUuY2xhc3NMaXN0LnJlbW92ZSgnYW5pbScpLCAzNTApXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgcmV0dXJuIGVcbn1cblxuLy8gSW4gb3JkZXIgdG8gZGlzcGxheSBhbiBhc3NpZ25tZW50IGluIHRoZSBjb3JyZWN0IFggcG9zaXRpb24sIGNsYXNzZXMgd2l0aCBuYW1lcyBlWCBhbmQgZVggYXJlXG4vLyB1c2VkLCB3aGVyZSBYIGlzIHRoZSBudW1iZXIgb2Ygc3F1YXJlcyB0byBmcm9tIHRoZSBhc3NpZ25tZW50IHRvIHRoZSBsZWZ0L3JpZ2h0IHNpZGUgb2YgdGhlXG4vLyBzY3JlZW4uIFRoZSBmdW5jdGlvbiBiZWxvdyBkZXRlcm1pbmVzIHdoaWNoIGVYIGFuZCBzWCBjbGFzcyB0aGUgZ2l2ZW4gZWxlbWVudCBoYXMuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RVMoZWw6IEhUTUxFbGVtZW50KTogW3N0cmluZywgc3RyaW5nXSB7XG4gICAgbGV0IGUgPSAwXG4gICAgbGV0IHMgPSAwXG5cbiAgICBBcnJheS5mcm9tKG5ldyBBcnJheSg3KSwgKF8sIHgpID0+IHgpLmZvckVhY2goKHgpID0+IHtcbiAgICAgICAgaWYgKGVsLmNsYXNzTGlzdC5jb250YWlucyhgZSR7eH1gKSkge1xuICAgICAgICAgICAgZSA9IHhcbiAgICAgICAgfVxuICAgICAgICBpZiAoZWwuY2xhc3NMaXN0LmNvbnRhaW5zKGBzJHt4fWApKSB7XG4gICAgICAgICAgICBzID0geFxuICAgICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gW2BlJHtlfWAsIGBzJHtzfWBdXG59XG5cbi8vIEJlbG93IGlzIGEgZnVuY3Rpb24gdG8gY2xvc2UgdGhlIGN1cnJlbnQgYXNzaWdubWVudCB0aGF0IGlzIG9wZW5lZC5cbmV4cG9ydCBmdW5jdGlvbiBjbG9zZU9wZW5lZChldnQ6IEV2ZW50KTogdm9pZCB7XG4gICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgY29uc3QgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZnVsbCcpIGFzIEhUTUxFbGVtZW50fG51bGxcbiAgICBpZiAoZWwgPT0gbnVsbCkgcmV0dXJuXG5cbiAgICBlbC5zdHlsZS50b3AgPSBOdW1iZXIoZWwuZ2V0QXR0cmlidXRlKCdkYXRhLXRvcCcpIHx8ICcwJykgLSB3aW5kb3cucGFnZVlPZmZzZXQgKyAncHgnXG4gICAgZWwuY2xhc3NMaXN0LmFkZCgnYW5pbScpXG4gICAgZWwuY2xhc3NMaXN0LnJlbW92ZSgnZnVsbCcpXG4gICAgZWwuc2Nyb2xsVG9wID0gMFxuICAgIGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnYXV0bydcbiAgICBjb25zdCBiYWNrID0gZWxlbUJ5SWQoJ2JhY2tncm91bmQnKVxuICAgIGJhY2suY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcblxuICAgIGNvbnN0IHRyYW5zaXRpb25MaXN0ZW5lciA9ICgpID0+IHtcbiAgICAgICAgYmFjay5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXG4gICAgICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2FuaW0nKVxuICAgICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKCdtb2RpZnknKVxuICAgICAgICBlbC5zdHlsZS50b3AgPSAnYXV0bydcbiAgICAgICAgZm9yY2VMYXlvdXQoZWwpXG4gICAgICAgIGVsLmNsYXNzTGlzdC5hZGQoJ2FuaW0nKVxuICAgICAgICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgdHJhbnNpdGlvbkxpc3RlbmVyKVxuICAgIH1cblxuICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCB0cmFuc2l0aW9uTGlzdGVuZXIpXG59XG4iLCJpbXBvcnQgeyBlbGVtQnlJZCwgbG9jYWxTdG9yYWdlUmVhZCB9IGZyb20gJy4uL3V0aWwnXG5cbi8vIFRoZW4sIHRoZSB1c2VybmFtZSBpbiB0aGUgc2lkZWJhciBuZWVkcyB0byBiZSBzZXQgYW5kIHdlIG5lZWQgdG8gZ2VuZXJhdGUgYW4gXCJhdmF0YXJcIiBiYXNlZCBvblxuLy8gaW5pdGlhbHMuIFRvIGRvIHRoYXQsIHNvbWUgY29kZSB0byBjb252ZXJ0IGZyb20gTEFCIHRvIFJHQiBjb2xvcnMgaXMgYm9ycm93ZWQgZnJvbVxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2Jvcm9uaW5lL2NvbG9yc3BhY2VzLmpzXG4vL1xuLy8gTEFCIGlzIGEgY29sb3IgbmFtaW5nIHNjaGVtZSB0aGF0IHVzZXMgdHdvIHZhbHVlcyAoQSBhbmQgQikgYWxvbmcgd2l0aCBhIGxpZ2h0bmVzcyB2YWx1ZSBpbiBvcmRlclxuLy8gdG8gcHJvZHVjZSBjb2xvcnMgdGhhdCBhcmUgZXF1YWxseSBzcGFjZWQgYmV0d2VlbiBhbGwgb2YgdGhlIGNvbG9ycyB0aGF0IGNhbiBiZSBzZWVuIGJ5IHRoZSBodW1hblxuLy8gZXllLiBUaGlzIHdvcmtzIGdyZWF0IGJlY2F1c2UgZXZlcnlvbmUgaGFzIGxldHRlcnMgaW4gaGlzL2hlciBpbml0aWFscy5cblxuLy8gVGhlIEQ2NSBzdGFuZGFyZCBpbGx1bWluYW50XG5jb25zdCBSRUZfWCA9IDAuOTUwNDdcbmNvbnN0IFJFRl9ZID0gMS4wMDAwMFxuY29uc3QgUkVGX1ogPSAxLjA4ODgzXG5cbi8vIENJRSBMKmEqYiogY29uc3RhbnRzXG5jb25zdCBMQUJfRSA9IDAuMDA4ODU2XG5jb25zdCBMQUJfSyA9IDkwMy4zXG5cbmNvbnN0IE0gPSBbXG4gICAgWzMuMjQwNiwgLTEuNTM3MiwgLTAuNDk4Nl0sXG4gICAgWy0wLjk2ODksIDEuODc1OCwgIDAuMDQxNV0sXG4gICAgWzAuMDU1NywgLTAuMjA0MCwgIDEuMDU3MF1cbl1cblxuY29uc3QgZkludiA9ICh0OiBudW1iZXIpID0+IHtcbiAgICBpZiAoTWF0aC5wb3codCwgMykgPiBMQUJfRSkge1xuICAgIHJldHVybiBNYXRoLnBvdyh0LCAzKVxuICAgIH0gZWxzZSB7XG4gICAgcmV0dXJuICgoMTE2ICogdCkgLSAxNikgLyBMQUJfS1xuICAgIH1cbn1cbmNvbnN0IGRvdFByb2R1Y3QgPSAoYTogbnVtYmVyW10sIGI6IG51bWJlcltdKSA9PiB7XG4gICAgbGV0IHJldCA9IDBcbiAgICBhLmZvckVhY2goKF8sIGkpID0+IHtcbiAgICAgICAgcmV0ICs9IGFbaV0gKiBiW2ldXG4gICAgfSlcbiAgICByZXR1cm4gcmV0XG59XG5jb25zdCBmcm9tTGluZWFyID0gKGM6IG51bWJlcikgPT4ge1xuICAgIGNvbnN0IGEgPSAwLjA1NVxuICAgIGlmIChjIDw9IDAuMDAzMTMwOCkge1xuICAgICAgICByZXR1cm4gMTIuOTIgKiBjXG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuICgxLjA1NSAqIE1hdGgucG93KGMsIDEgLyAyLjQpKSAtIDAuMDU1XG4gICAgfVxufVxuXG5mdW5jdGlvbiBsYWJyZ2IobDogbnVtYmVyLCBhOiBudW1iZXIsIGI6IG51bWJlcik6IHN0cmluZyB7XG4gICAgY29uc3QgdmFyWSA9IChsICsgMTYpIC8gMTE2XG4gICAgY29uc3QgdmFyWiA9IHZhclkgLSAoYiAvIDIwMClcbiAgICBjb25zdCB2YXJYID0gKGEgLyA1MDApICsgdmFyWVxuICAgIGNvbnN0IF9YID0gUkVGX1ggKiBmSW52KHZhclgpXG4gICAgY29uc3QgX1kgPSBSRUZfWSAqIGZJbnYodmFyWSlcbiAgICBjb25zdCBfWiA9IFJFRl9aICogZkludih2YXJaKVxuXG4gICAgY29uc3QgdHVwbGUgPSBbX1gsIF9ZLCBfWl1cblxuICAgIGNvbnN0IF9SID0gZnJvbUxpbmVhcihkb3RQcm9kdWN0KE1bMF0sIHR1cGxlKSlcbiAgICBjb25zdCBfRyA9IGZyb21MaW5lYXIoZG90UHJvZHVjdChNWzFdLCB0dXBsZSkpXG4gICAgY29uc3QgX0IgPSBmcm9tTGluZWFyKGRvdFByb2R1Y3QoTVsyXSwgdHVwbGUpKVxuXG4gICAgLy8gT3JpZ2luYWwgZnJvbSBoZXJlXG4gICAgY29uc3QgbiA9ICh2OiBudW1iZXIpID0+IE1hdGgucm91bmQoTWF0aC5tYXgoTWF0aC5taW4odiAqIDI1NiwgMjU1KSwgMCkpXG4gICAgcmV0dXJuIGByZ2IoJHtuKF9SKX0sICR7bihfRyl9LCAke24oX0IpfSlgXG59XG5cbi8qKlxuICogQ29udmVydCBhIGxldHRlciB0byBhIGZsb2F0IHZhbHVlZCBmcm9tIDAgdG8gMjU1XG4gKi9cbmZ1bmN0aW9uIGxldHRlclRvQ29sb3JWYWwobGV0dGVyOiBzdHJpbmcpOiBudW1iZXIge1xuICAgIHJldHVybiAoKChsZXR0ZXIuY2hhckNvZGVBdCgwKSAtIDY1KSAvIDI2KSAqIDI1NikgLSAxMjhcbn1cblxuLy8gVGhlIGZ1bmN0aW9uIGJlbG93IHVzZXMgdGhpcyBhbGdvcml0aG0gdG8gZ2VuZXJhdGUgYSBiYWNrZ3JvdW5kIGNvbG9yIGZvciB0aGUgaW5pdGlhbHMgZGlzcGxheWVkIGluIHRoZSBzaWRlYmFyLlxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZUF2YXRhcigpOiB2b2lkIHtcbiAgICBpZiAoIWxvY2FsU3RvcmFnZVJlYWQoJ3VzZXJuYW1lJykpIHJldHVyblxuICAgIGNvbnN0IHVzZXJFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd1c2VyJylcbiAgICBjb25zdCBpbml0aWFsc0VsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2luaXRpYWxzJylcbiAgICBpZiAoIXVzZXJFbCB8fCAhaW5pdGlhbHNFbCkgcmV0dXJuXG5cbiAgICB1c2VyRWwuaW5uZXJIVE1MID0gbG9jYWxTdG9yYWdlUmVhZCgndXNlcm5hbWUnKVxuICAgIGNvbnN0IGluaXRpYWxzID0gbG9jYWxTdG9yYWdlUmVhZCgndXNlcm5hbWUnKS5tYXRjaCgvXFxkKiguKS4qPyguJCkvKSAvLyBTZXBhcmF0ZSB5ZWFyIGZyb20gZmlyc3QgbmFtZSBhbmQgaW5pdGlhbFxuICAgIGlmIChpbml0aWFscyAhPSBudWxsKSB7XG4gICAgICAgIGNvbnN0IGJnID0gbGFicmdiKDUwLCBsZXR0ZXJUb0NvbG9yVmFsKGluaXRpYWxzWzFdKSwgbGV0dGVyVG9Db2xvclZhbChpbml0aWFsc1syXSkpIC8vIENvbXB1dGUgdGhlIGNvbG9yXG4gICAgICAgIGluaXRpYWxzRWwuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gYmdcbiAgICAgICAgaW5pdGlhbHNFbC5pbm5lckhUTUwgPSBpbml0aWFsc1sxXSArIGluaXRpYWxzWzJdXG4gICAgfVxufVxuIiwiaW1wb3J0IHsgdG9kYXkgfSBmcm9tICcuLi9kYXRlcydcbmltcG9ydCB7IGVsZW1lbnQgfSBmcm9tICcuLi91dGlsJ1xuXG5jb25zdCBNT05USFMgPSBbJ0phbicsICdGZWInLCAnTWFyJywgJ0FwcicsICdNYXknLCAnSnVuJywgJ0p1bCcsICdBdWcnLCAnU2VwJywgJ09jdCcsICdOb3YnLCAnRGVjJ11cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVdlZWsoaWQ6IHN0cmluZyk6IEhUTUxFbGVtZW50IHtcbiAgICBjb25zdCB3ayA9IGVsZW1lbnQoJ3NlY3Rpb24nLCAnd2VlaycsIG51bGwsIGlkKVxuICAgIGNvbnN0IGRheVRhYmxlID0gZWxlbWVudCgndGFibGUnLCAnZGF5VGFibGUnKSBhcyBIVE1MVGFibGVFbGVtZW50XG4gICAgY29uc3QgdHIgPSBkYXlUYWJsZS5pbnNlcnRSb3coKVxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZSBuby1sb29wc1xuICAgIGZvciAobGV0IGRheSA9IDA7IGRheSA8IDc7IGRheSsrKSB0ci5pbnNlcnRDZWxsKClcbiAgICB3ay5hcHBlbmRDaGlsZChkYXlUYWJsZSlcblxuICAgIHJldHVybiB3a1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRGF5KGQ6IERhdGUpOiBIVE1MRWxlbWVudCB7XG4gICAgY29uc3QgZGF5ID0gZWxlbWVudCgnZGl2JywgJ2RheScsIG51bGwsICdkYXknKVxuICAgIGRheS5zZXRBdHRyaWJ1dGUoJ2RhdGEtZGF0ZScsIFN0cmluZyhkLmdldFRpbWUoKSkpXG4gICAgaWYgKE1hdGguZmxvb3IoKGQuZ2V0VGltZSgpIC0gZC5nZXRUaW1lem9uZU9mZnNldCgpKSAvIDEwMDAgLyAzNjAwIC8gMjQpID09PSB0b2RheSgpKSB7XG4gICAgICBkYXkuY2xhc3NMaXN0LmFkZCgndG9kYXknKVxuICAgIH1cblxuICAgIGNvbnN0IG1vbnRoID0gZWxlbWVudCgnc3BhbicsICdtb250aCcsIE1PTlRIU1tkLmdldE1vbnRoKCldKVxuICAgIGRheS5hcHBlbmRDaGlsZChtb250aClcblxuICAgIGNvbnN0IGRhdGUgPSBlbGVtZW50KCdzcGFuJywgJ2RhdGUnLCBTdHJpbmcoZC5nZXREYXRlKCkpKVxuICAgIGRheS5hcHBlbmRDaGlsZChkYXRlKVxuXG4gICAgcmV0dXJuIGRheVxufVxuIiwiaW1wb3J0IHsgZ2V0Q2xhc3NlcywgZ2V0RGF0YSB9IGZyb20gJy4uL3BjcidcbmltcG9ydCB7IF8kLCBjYXBpdGFsaXplU3RyaW5nLCBlbGVtQnlJZCwgZWxlbWVudCB9IGZyb20gJy4uL3V0aWwnXG5cbi8vIFdoZW4gYW55dGhpbmcgaXMgdHlwZWQsIHRoZSBzZWFyY2ggc3VnZ2VzdGlvbnMgbmVlZCB0byBiZSB1cGRhdGVkLlxuY29uc3QgVElQX05BTUVTID0ge1xuICAgIGZvcjogWydmb3InXSxcbiAgICBieTogWydieScsICdkdWUnLCAnZW5kaW5nJ10sXG4gICAgc3RhcnRpbmc6IFsnc3RhcnRpbmcnLCAnYmVnaW5uaW5nJywgJ2Fzc2lnbmVkJ11cbn1cblxuY29uc3QgbmV3VGV4dCA9IGVsZW1CeUlkKCduZXdUZXh0JykgYXMgSFRNTElucHV0RWxlbWVudFxuXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlTmV3VGlwcyh2YWw6IHN0cmluZywgc2Nyb2xsOiBib29sZWFuID0gdHJ1ZSk6IHZvaWQge1xuICAgIGlmIChzY3JvbGwpIHtcbiAgICAgICAgZWxlbUJ5SWQoJ25ld1RpcHMnKS5zY3JvbGxUb3AgPSAwXG4gICAgfVxuXG4gICAgY29uc3Qgc3BhY2VJbmRleCA9IHZhbC5sYXN0SW5kZXhPZignICcpXG4gICAgaWYgKHNwYWNlSW5kZXggIT09IC0xKSB7XG4gICAgICAgIGNvbnN0IGJlZm9yZVNwYWNlID0gdmFsLmxhc3RJbmRleE9mKCcgJywgc3BhY2VJbmRleCAtIDEpXG4gICAgICAgIGNvbnN0IGJlZm9yZSA9IHZhbC5zdWJzdHJpbmcoKGJlZm9yZVNwYWNlID09PSAtMSA/IDAgOiBiZWZvcmVTcGFjZSArIDEpLCBzcGFjZUluZGV4KVxuICAgICAgICBPYmplY3QuZW50cmllcyhUSVBfTkFNRVMpLmZvckVhY2goKFtuYW1lLCBwb3NzaWJsZV0pID0+IHtcbiAgICAgICAgICAgIGlmIChwb3NzaWJsZS5pbmRleE9mKGJlZm9yZSkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgaWYgKG5hbWUgPT09ICdmb3InKSB7XG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKFRJUF9OQU1FUykuZm9yRWFjaCgodGlwTmFtZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbUJ5SWQoYHRpcCR7dGlwTmFtZX1gKS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICBnZXRDbGFzc2VzKCkuZm9yRWFjaCgoY2xzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpZCA9IGB0aXBjbGFzcyR7Y2xzLnJlcGxhY2UoL1xcVy8sICcnKX1gXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3BhY2VJbmRleCA9PT0gKHZhbC5sZW5ndGggLSAxKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY29udGFpbmVyID0gZWxlbWVudCgnZGl2JywgWydjbGFzc1RpcCcsICdhY3RpdmUnLCAndGlwJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgPGkgY2xhc3M9J21hdGVyaWFsLWljb25zJz5jbGFzczwvaT48c3BhbiBjbGFzcz0ndHlwZWQnPiR7Y2xzfTwvc3Bhbj5gLCBpZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGlwQ29tcGxldGUoY2xzKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbUJ5SWQoJ25ld1RpcHMnKS5hcHBlbmRDaGlsZChjb250YWluZXIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtQnlJZChpZCkuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xzLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXModmFsLnRvTG93ZXJDYXNlKCkuc3Vic3RyKHNwYWNlSW5kZXggKyAxKSkpXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jbGFzc1RpcCcpLmZvckVhY2goKGVsKSA9PiB7XG4gICAgICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gICAgfSlcbiAgICBpZiAoKHZhbCA9PT0gJycpIHx8ICh2YWwuY2hhckF0KHZhbC5sZW5ndGggLSAxKSA9PT0gJyAnKSkge1xuICAgICAgICB1cGRhdGVUaXAoJ2ZvcicsICdmb3InLCBmYWxzZSlcbiAgICAgICAgdXBkYXRlVGlwKCdieScsICdieScsIGZhbHNlKVxuICAgICAgICB1cGRhdGVUaXAoJ3N0YXJ0aW5nJywgJ3N0YXJ0aW5nJywgZmFsc2UpXG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgbGFzdFNwYWNlID0gdmFsLmxhc3RJbmRleE9mKCcgJylcbiAgICAgICAgbGV0IGxhc3RXb3JkID0gbGFzdFNwYWNlID09PSAtMSA/IHZhbCA6IHZhbC5zdWJzdHIobGFzdFNwYWNlICsgMSlcbiAgICAgICAgY29uc3QgdXBwZXJjYXNlID0gbGFzdFdvcmQuY2hhckF0KDApID09PSBsYXN0V29yZC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKVxuICAgICAgICBsYXN0V29yZCA9IGxhc3RXb3JkLnRvTG93ZXJDYXNlKClcbiAgICAgICAgT2JqZWN0LmVudHJpZXMoVElQX05BTUVTKS5mb3JFYWNoKChbbmFtZSwgcG9zc2libGVdKSA9PiB7XG4gICAgICAgICAgICBsZXQgZm91bmQ6IHN0cmluZ3xudWxsID0gbnVsbFxuICAgICAgICAgICAgcG9zc2libGUuZm9yRWFjaCgocCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChwLnNsaWNlKDAsIGxhc3RXb3JkLmxlbmd0aCkgPT09IGxhc3RXb3JkKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvdW5kID0gcFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBpZiAoZm91bmQpIHtcbiAgICAgICAgICAgICAgICB1cGRhdGVUaXAobmFtZSwgZm91bmQsIHVwcGVyY2FzZSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZWxlbUJ5SWQoYHRpcCR7bmFtZX1gKS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cbn1cblxuZnVuY3Rpb24gdXBkYXRlVGlwKG5hbWU6IHN0cmluZywgdHlwZWQ6IHN0cmluZywgY2FwaXRhbGl6ZTogYm9vbGVhbik6IHZvaWQge1xuICAgIGlmIChuYW1lICE9PSAnZm9yJyAmJiBuYW1lICE9PSAnYnknICYmIG5hbWUgIT09ICdzdGFydGluZycpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHRpcCBuYW1lJylcbiAgICB9XG5cbiAgICBjb25zdCBlbCA9IGVsZW1CeUlkKGB0aXAke25hbWV9YClcbiAgICBlbC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxuICAgIF8kKGVsLnF1ZXJ5U2VsZWN0b3IoJy50eXBlZCcpKS5pbm5lckhUTUwgPSAoY2FwaXRhbGl6ZSA/IGNhcGl0YWxpemVTdHJpbmcodHlwZWQpIDogdHlwZWQpICsgJy4uLidcbiAgICBjb25zdCBuZXdOYW1lczogc3RyaW5nW10gPSBbXVxuICAgIFRJUF9OQU1FU1tuYW1lXS5mb3JFYWNoKChuKSA9PiB7XG4gICAgICAgIGlmIChuICE9PSB0eXBlZCkgeyBuZXdOYW1lcy5wdXNoKGA8Yj4ke259PC9iPmApIH1cbiAgICB9KVxuICAgIF8kKGVsLnF1ZXJ5U2VsZWN0b3IoJy5vdGhlcnMnKSkuaW5uZXJIVE1MID0gbmV3TmFtZXMubGVuZ3RoID4gMCA/IGBZb3UgY2FuIGFsc28gdXNlICR7bmV3TmFtZXMuam9pbignIG9yICcpfWAgOiAnJ1xufVxuXG5mdW5jdGlvbiB0aXBDb21wbGV0ZShhdXRvY29tcGxldGU6IHN0cmluZyk6IChldnQ6IEV2ZW50KSA9PiB2b2lkIHtcbiAgICByZXR1cm4gKGV2dDogRXZlbnQpID0+IHtcbiAgICAgICAgY29uc3QgdmFsID0gbmV3VGV4dC52YWx1ZVxuICAgICAgICBjb25zdCBsYXN0U3BhY2UgPSB2YWwubGFzdEluZGV4T2YoJyAnKVxuICAgICAgICBjb25zdCBsYXN0V29yZCA9IGxhc3RTcGFjZSA9PT0gLTEgPyAwIDogbGFzdFNwYWNlICsgMVxuICAgICAgICB1cGRhdGVOZXdUaXBzKG5ld1RleHQudmFsdWUgPSB2YWwuc3Vic3RyaW5nKDAsIGxhc3RXb3JkKSArIGF1dG9jb21wbGV0ZSArICcgJylcbiAgICAgICAgcmV0dXJuIG5ld1RleHQuZm9jdXMoKVxuICAgIH1cbn1cblxuLy8gVGhlIGV2ZW50IGxpc3RlbmVyIGlzIHRoZW4gYWRkZWQgdG8gdGhlIHByZWV4aXN0aW5nIHRpcHMuXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGlwJykuZm9yRWFjaCgodGlwKSA9PiB7XG4gICAgdGlwLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGlwQ29tcGxldGUoXyQodGlwLnF1ZXJ5U2VsZWN0b3IoJy50eXBlZCcpKS5pbm5lckhUTUwpKVxufSlcbiIsImltcG9ydCB7IFZFUlNJT04gfSBmcm9tICcuLi9hcHAnXG5pbXBvcnQgeyBlbGVtQnlJZCB9IGZyb20gJy4uL3V0aWwnXG5cbmNvbnN0IEVSUk9SX0ZPUk1fVVJMID0gJ2h0dHBzOi8vZG9jcy5nb29nbGUuY29tL2Evc3R1ZGVudHMuaGFya2VyLm9yZy9mb3Jtcy9kLydcbiAgICAgICAgICAgICAgICAgICAgICsgJzFzYTJnVXRZRlBkS1Q1WUVOWElFWWF1eVJQdWNxc1FDVmFRQVBlRjNiWjRRL3ZpZXdmb3JtJ1xuY29uc3QgRVJST1JfRk9STV9FTlRSWSA9ICc/ZW50cnkuMTIwMDM2MjIzPSdcbmNvbnN0IEVSUk9SX0dJVEhVQl9VUkwgPSAnaHR0cHM6Ly9naXRodWIuY29tLzE5UnlhbkEvQ2hlY2tQQ1IvaXNzdWVzL25ldydcblxuY29uc3QgbGlua0J5SWQgPSAoaWQ6IHN0cmluZykgPT4gZWxlbUJ5SWQoaWQpIGFzIEhUTUxMaW5rRWxlbWVudFxuXG4vLyAqZGlzcGxheUVycm9yKiBkaXNwbGF5cyBhIGRpYWxvZyBjb250YWluaW5nIGluZm9ybWF0aW9uIGFib3V0IGFuIGVycm9yLlxuZXhwb3J0IGZ1bmN0aW9uIGRpc3BsYXlFcnJvcihlOiBFcnJvcik6IHZvaWQge1xuICAgIGNvbnNvbGUubG9nKCdEaXNwbGF5aW5nIGVycm9yJywgZSlcbiAgICBjb25zdCBlcnJvckhUTUwgPSBgTWVzc2FnZTogJHtlLm1lc3NhZ2V9XFxuU3RhY2s6ICR7ZS5zdGFjayB8fCAoZSBhcyBhbnkpLmxpbmVOdW1iZXJ9XFxuYFxuICAgICAgICAgICAgICAgICAgICArIGBCcm93c2VyOiAke25hdmlnYXRvci51c2VyQWdlbnR9XFxuVmVyc2lvbjogJHtWRVJTSU9OfWBcbiAgICBlbGVtQnlJZCgnZXJyb3JDb250ZW50JykuaW5uZXJIVE1MID0gZXJyb3JIVE1MLnJlcGxhY2UoJ1xcbicsICc8YnI+JylcbiAgICBsaW5rQnlJZCgnZXJyb3JHb29nbGUnKS5ocmVmID0gRVJST1JfRk9STV9VUkwgKyBFUlJPUl9GT1JNX0VOVFJZICsgZW5jb2RlVVJJQ29tcG9uZW50KGVycm9ySFRNTClcbiAgICBsaW5rQnlJZCgnZXJyb3JHaXRIdWInKS5ocmVmID1cbiAgICAgICAgRVJST1JfR0lUSFVCX1VSTCArICc/Ym9keT0nICsgZW5jb2RlVVJJQ29tcG9uZW50KGBJJ3ZlIGVuY291bnRlcmVkIGFuIGJ1Zy5cXG5cXG5cXGBcXGBcXGBcXG4ke2Vycm9ySFRNTH1cXG5cXGBcXGBcXGBgKVxuICAgIGVsZW1CeUlkKCdlcnJvckJhY2tncm91bmQnKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xuICAgIHJldHVybiBlbGVtQnlJZCgnZXJyb3InKS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxufVxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCAoZXZ0KSA9PiB7XG4gICAgZXZ0LnByZXZlbnREZWZhdWx0KClcbiAgICBkaXNwbGF5RXJyb3IoZXZ0LmVycm9yKVxufSlcbiIsImltcG9ydCB7IF8kLCBhbmltYXRlRWwgfSBmcm9tICcuLi91dGlsJ1xuXG4vLyBGb3IgbGlzdCB2aWV3LCB0aGUgYXNzaWdubWVudHMgY2FuJ3QgYmUgb24gdG9wIG9mIGVhY2ggb3RoZXIuXG4vLyBUaGVyZWZvcmUsIGEgbGlzdGVuZXIgaXMgYXR0YWNoZWQgdG8gdGhlIHJlc2l6aW5nIG9mIHRoZSBicm93c2VyIHdpbmRvdy5cbmxldCB0aWNraW5nID0gZmFsc2VcbmxldCB0aW1lb3V0SWQ6IG51bWJlcnxudWxsID0gbnVsbFxuZXhwb3J0IGZ1bmN0aW9uIGdldFJlc2l6ZUFzc2lnbm1lbnRzKCk6IEhUTUxFbGVtZW50W10ge1xuICAgIGNvbnN0IGFzc2lnbm1lbnRzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKCdzaG93RG9uZScpID9cbiAgICAgICAgJy5hc3NpZ25tZW50Lmxpc3REaXNwJyA6ICcuYXNzaWdubWVudC5saXN0RGlzcDpub3QoLmRvbmUpJykpXG4gICAgYXNzaWdubWVudHMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICBjb25zdCBhZCA9IGEuY2xhc3NMaXN0LmNvbnRhaW5zKCdkb25lJylcbiAgICAgICAgY29uc3QgYmQgPSBiLmNsYXNzTGlzdC5jb250YWlucygnZG9uZScpXG4gICAgICAgIGlmIChhZCAmJiAhYmQpIHsgcmV0dXJuIDEgfVxuICAgICAgICBpZiAoYmQgJiYgIWFkKSB7IHJldHVybiAtMSB9XG4gICAgICAgIHJldHVybiBOdW1iZXIoKGEucXVlcnlTZWxlY3RvcignLmR1ZScpIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlKVxuICAgICAgICAgICAgIC0gTnVtYmVyKChiLnF1ZXJ5U2VsZWN0b3IoJy5kdWUnKSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSlcbiAgICB9KVxuICAgIHJldHVybiBhc3NpZ25tZW50cyBhcyBIVE1MRWxlbWVudFtdXG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXNpemVDYWxsZXIoKTogdm9pZCB7XG4gICAgaWYgKCF0aWNraW5nKSB7XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShyZXNpemUpXG4gICAgICAgIHRpY2tpbmcgPSB0cnVlXG4gICAgfVxufVxuXG5sZXQgbGFzdENvbHVtbnM6IG51bWJlcnxudWxsID0gbnVsbFxubGV0IGxhc3RBc3NpZ25tZW50czogbnVtYmVyfG51bGwgPSBudWxsXG5sZXQgbGFzdERvbmVDb3VudDogbnVtYmVyfG51bGwgPSBudWxsXG5cbmV4cG9ydCBmdW5jdGlvbiByZXNpemUoKTogdm9pZCB7XG4gICAgdGlja2luZyA9IHRydWVcbiAgICAvLyBUbyBjYWxjdWxhdGUgdGhlIG51bWJlciBvZiBjb2x1bW5zLCB0aGUgYmVsb3cgYWxnb3JpdGhtIGlzIHVzZWQgYmVjYXNlIGFzIHRoZSBzY3JlZW4gc2l6ZVxuICAgIC8vIGluY3JlYXNlcywgdGhlIGNvbHVtbiB3aWR0aCBpbmNyZWFzZXNcbiAgICBjb25zdCB3aWR0aHMgPSBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5jb250YWlucygnc2hvd0luZm8nKSA/XG4gICAgICAgIFs2NTAsIDExMDAsIDE4MDAsIDI3MDAsIDM4MDAsIDUxMDBdIDogWzM1MCwgODAwLCAxNTAwLCAyNDAwLCAzNTAwLCA0ODAwXVxuICAgIGxldCBjb2x1bW5zID0gMVxuICAgIHdpZHRocy5mb3JFYWNoKCh3LCBpbmRleCkgPT4ge1xuICAgICAgICBpZiAod2luZG93LmlubmVyV2lkdGggPiB3KSB7IGNvbHVtbnMgPSBpbmRleCArIDEgfVxuICAgIH0pXG5cbiAgICBjb25zdCBjb2x1bW5IZWlnaHRzID0gQXJyYXkuZnJvbShuZXcgQXJyYXkoY29sdW1ucyksICgpID0+IDApXG4gICAgY29uc3QgY2NoOiBudW1iZXJbXSA9IFtdXG4gICAgY29uc3QgYXNzaWdubWVudHMgPSBnZXRSZXNpemVBc3NpZ25tZW50cygpXG4gICAgY29uc3QgZG9uZUNvdW50ID0gYXNzaWdubWVudHMuZmlsdGVyKChhKSA9PiBhLmNsYXNzTGlzdC5jb250YWlucygnZG9uZScpKS5sZW5ndGhcbiAgICBhc3NpZ25tZW50cy5mb3JFYWNoKChhc3NpZ25tZW50LCBuKSA9PiB7XG4gICAgICAgIGNvbnN0IGNvbCA9IG4gJSBjb2x1bW5zXG4gICAgICAgIGNjaC5wdXNoKGNvbHVtbkhlaWdodHNbY29sXSlcbiAgICAgICAgY29sdW1uSGVpZ2h0c1tjb2xdICs9IGFzc2lnbm1lbnQub2Zmc2V0SGVpZ2h0ICsgMjRcbiAgICB9KVxuICAgIGFzc2lnbm1lbnRzLmZvckVhY2goKGFzc2lnbm1lbnQsIG4pID0+IHtcbiAgICAgICAgY29uc3QgY29sID0gbiAlIGNvbHVtbnNcbiAgICAgICAgYXNzaWdubWVudC5zdHlsZS50b3AgPSBjY2hbbl0gKyAncHgnXG4gICAgICAgIGlmIChjb2x1bW5zICE9PSBsYXN0Q29sdW1ucyB8fCBhc3NpZ25tZW50cy5sZW5ndGggIT09IGxhc3RBc3NpZ25tZW50cyB8fCBkb25lQ291bnQgIT09IGxhc3REb25lQ291bnQpIHtcbiAgICAgICAgICAgIGNvbnN0IGxlZnQgPSAoKDEwMCAvIGNvbHVtbnMpICogY29sKSArICclJ1xuICAgICAgICAgICAgY29uc3QgcmlnaHQgPSAoKDEwMCAvIGNvbHVtbnMpICogKGNvbHVtbnMgLSBjb2wgLSAxKSkgKyAnJSdcbiAgICAgICAgICAgIGlmIChsYXN0Q29sdW1ucyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGFzc2lnbm1lbnQuc3R5bGUubGVmdCA9IGxlZnRcbiAgICAgICAgICAgICAgICBhc3NpZ25tZW50LnN0eWxlLnJpZ2h0ID0gcmlnaHRcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYW5pbWF0ZUVsKGFzc2lnbm1lbnQsIFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogYXNzaWdubWVudC5zdHlsZS5sZWZ0IHx8IGxlZnQsXG4gICAgICAgICAgICAgICAgICAgICAgICByaWdodDogYXNzaWdubWVudC5zdHlsZS5yaWdodCB8fCByaWdodFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7IGxlZnQsIHJpZ2h0IH1cbiAgICAgICAgICAgICAgICBdLCB7IGR1cmF0aW9uOiAzMDAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGFzc2lnbm1lbnQuc3R5bGUubGVmdCA9IGxlZnRcbiAgICAgICAgICAgICAgICAgICAgYXNzaWdubWVudC5zdHlsZS5yaWdodCA9IHJpZ2h0XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pXG4gICAgaWYgKHRpbWVvdXRJZCkgY2xlYXJUaW1lb3V0KHRpbWVvdXRJZClcbiAgICB0aW1lb3V0SWQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgY2NoLmxlbmd0aCA9IDBcbiAgICAgICAgYXNzaWdubWVudHMuZm9yRWFjaCgoYXNzaWdubWVudCwgbikgPT4ge1xuICAgICAgICAgICAgY29uc3QgY29sID0gbiAlIGNvbHVtbnNcbiAgICAgICAgICAgIGlmIChuIDwgY29sdW1ucykge1xuICAgICAgICAgICAgICAgIGNvbHVtbkhlaWdodHNbY29sXSA9IDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNjaC5wdXNoKGNvbHVtbkhlaWdodHNbY29sXSlcbiAgICAgICAgICAgIGNvbHVtbkhlaWdodHNbY29sXSArPSBhc3NpZ25tZW50Lm9mZnNldEhlaWdodCArIDI0XG4gICAgICAgIH0pXG4gICAgICAgIGFzc2lnbm1lbnRzLmZvckVhY2goKGFzc2lnbm1lbnQsIG4pID0+IHtcbiAgICAgICAgICAgIGFzc2lnbm1lbnQuc3R5bGUudG9wID0gY2NoW25dICsgJ3B4J1xuICAgICAgICB9KVxuICAgIH0sIDUwMClcbiAgICBsYXN0Q29sdW1ucyA9IGNvbHVtbnNcbiAgICBsYXN0QXNzaWdubWVudHMgPSBhc3NpZ25tZW50cy5sZW5ndGhcbiAgICBsYXN0RG9uZUNvdW50ID0gZG9uZUNvdW50XG4gICAgdGlja2luZyA9IGZhbHNlXG59XG4iLCIvKipcbiAqIEFsbCB0aGlzIGlzIHJlc3BvbnNpYmxlIGZvciBpcyBjcmVhdGluZyBzbmFja2JhcnMuXG4gKi9cblxuaW1wb3J0IHsgZWxlbWVudCwgZm9yY2VMYXlvdXQgfSBmcm9tICcuLi91dGlsJ1xuXG4vKipcbiAqIENyZWF0ZXMgYSBzbmFja2JhciB3aXRob3V0IGFuIGFjdGlvblxuICogQHBhcmFtIG1lc3NhZ2UgVGhlIHNuYWNrYmFyJ3MgbWVzc2FnZVxuICovXG5leHBvcnQgZnVuY3Rpb24gc25hY2tiYXIobWVzc2FnZTogc3RyaW5nKTogdm9pZFxuLyoqXG4gKiBDcmVhdGVzIGEgc25hY2tiYXIgd2l0aCBhbiBhY3Rpb25cbiAqIEBwYXJhbSBtZXNzYWdlIFRoZSBzbmFja2JhcidzIG1lc3NhZ2VcbiAqIEBwYXJhbSBhY3Rpb24gT3B0aW9uYWwgdGV4dCB0byBzaG93IGFzIGEgbWVzc2FnZSBhY3Rpb25cbiAqIEBwYXJhbSBmICAgICAgQSBmdW5jdGlvbiB0byBleGVjdXRlIHdoZW4gdGhlIGFjdGlvbiBpcyBjbGlja2VkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzbmFja2JhcihtZXNzYWdlOiBzdHJpbmcsIGFjdGlvbjogc3RyaW5nLCBmOiAoKSA9PiB2b2lkKTogdm9pZFxuZXhwb3J0IGZ1bmN0aW9uIHNuYWNrYmFyKG1lc3NhZ2U6IHN0cmluZywgYWN0aW9uPzogc3RyaW5nLCBmPzogKCkgPT4gdm9pZCk6IHZvaWQge1xuICAgIGNvbnN0IHNuYWNrID0gZWxlbWVudCgnZGl2JywgJ3NuYWNrYmFyJylcbiAgICBjb25zdCBzbmFja0lubmVyID0gZWxlbWVudCgnZGl2JywgJ3NuYWNrSW5uZXInLCBtZXNzYWdlKVxuICAgIHNuYWNrLmFwcGVuZENoaWxkKHNuYWNrSW5uZXIpXG5cbiAgICBpZiAoKGFjdGlvbiAhPSBudWxsKSAmJiAoZiAhPSBudWxsKSkge1xuICAgICAgICBjb25zdCBhY3Rpb25FID0gZWxlbWVudCgnYScsIFtdLCBhY3Rpb24pXG4gICAgICAgIGFjdGlvbkUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICBzbmFjay5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuICAgICAgICAgICAgZigpXG4gICAgICAgIH0pXG4gICAgICAgIHNuYWNrSW5uZXIuYXBwZW5kQ2hpbGQoYWN0aW9uRSlcbiAgICB9XG5cbiAgICBjb25zdCBhZGQgPSAoKSA9PiB7XG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNuYWNrKVxuICAgICAgZm9yY2VMYXlvdXQoc25hY2spXG4gICAgICBzbmFjay5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgc25hY2suY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcbiAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHNuYWNrLnJlbW92ZSgpLCA5MDApXG4gICAgICB9LCA1MDAwKVxuICAgIH1cblxuICAgIGNvbnN0IGV4aXN0aW5nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNuYWNrYmFyJylcbiAgICBpZiAoZXhpc3RpbmcgIT0gbnVsbCkge1xuICAgICAgICBleGlzdGluZy5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuICAgICAgICBzZXRUaW1lb3V0KGFkZCwgMzAwKVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGFkZCgpXG4gICAgfVxufVxuIiwiXG4vKipcbiAqIENvb2tpZSBmdW5jdGlvbnMgKGEgY29va2llIGlzIGEgc21hbGwgdGV4dCBkb2N1bWVudCB0aGF0IHRoZSBicm93c2VyIGNhbiByZW1lbWJlcilcbiAqL1xuXG4vKipcbiAqIFJldHJpZXZlcyBhIGNvb2tpZVxuICogQHBhcmFtIGNuYW1lIHRoZSBuYW1lIG9mIHRoZSBjb29raWUgdG8gcmV0cmlldmVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldENvb2tpZShjbmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCBuYW1lID0gY25hbWUgKyAnPSdcbiAgICBjb25zdCBjb29raWVQYXJ0ID0gZG9jdW1lbnQuY29va2llLnNwbGl0KCc7JykuZmluZCgoYykgPT4gYy5pbmNsdWRlcyhuYW1lKSlcbiAgICBpZiAoY29va2llUGFydCkgcmV0dXJuIGNvb2tpZVBhcnQuc3Vic3RyaW5nKG5hbWUubGVuZ3RoKVxuICAgIHJldHVybiAnJyAvLyBCbGFuayBpZiBjb29raWUgbm90IGZvdW5kXG4gIH1cblxuLyoqIFNldHMgdGhlIHZhbHVlIG9mIGEgY29va2llXG4gKiBAcGFyYW0gY25hbWUgdGhlIG5hbWUgb2YgdGhlIGNvb2tpZSB0byBzZXRcbiAqIEBwYXJhbSBjdmFsdWUgdGhlIHZhbHVlIHRvIHNldCB0aGUgY29va2llIHRvXG4gKiBAcGFyYW0gZXhkYXlzIHRoZSBudW1iZXIgb2YgZGF5cyB0aGF0IHRoZSBjb29raWUgd2lsbCBleHBpcmUgaW4gKGFuZCBub3QgYmUgZXhpc3RlbnQgYW55bW9yZSlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldENvb2tpZShjbmFtZTogc3RyaW5nLCBjdmFsdWU6IHN0cmluZywgZXhkYXlzOiBudW1iZXIpOiB2b2lkIHtcbiAgICBjb25zdCBkID0gbmV3IERhdGUoKVxuICAgIGQuc2V0VGltZShkLmdldFRpbWUoKSArIChleGRheXMgKiAyNCAqIDYwICogNjAgKiAxMDAwKSlcbiAgICBjb25zdCBleHBpcmVzID0gYGV4cGlyZXM9JHtkLnRvVVRDU3RyaW5nKCl9YFxuICAgIGRvY3VtZW50LmNvb2tpZSA9IGNuYW1lICsgJz0nICsgY3ZhbHVlICsgJzsgJyArIGV4cGlyZXNcbiAgfVxuXG4vKipcbiAqIERlbGV0cyBhIGNvb2tpZVxuICogQHBhcmFtIGNuYW1lIHRoZSBuYW1lIG9mIHRoZSBjb29raWUgdG8gZGVsZXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWxldGVDb29raWUoY25hbWU6IHN0cmluZyk6IHZvaWQge1xuICAgIC8vIFRoaXMgaXMgbGlrZSAqc2V0Q29va2llKiwgYnV0IHNldHMgdGhlIGV4cGlyeSBkYXRlIHRvIHNvbWV0aGluZyBpbiB0aGUgcGFzdCBzbyB0aGUgY29va2llIGlzIGRlbGV0ZWQuXG4gICAgZG9jdW1lbnQuY29va2llID0gY25hbWUgKyAnPTsgZXhwaXJlcz1UaHUsIDAxIEphbiAxOTcwIDAwOjAwOjAxIEdNVDsnXG59XG4iLCJleHBvcnQgZnVuY3Rpb24gdHpvZmYoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gKG5ldyBEYXRlKCkpLmdldFRpbWV6b25lT2Zmc2V0KCkgKiAxMDAwICogNjAgLy8gRm9yIGZ1dHVyZSBjYWxjdWxhdGlvbnNcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvRGF0ZU51bShkYXRlOiBEYXRlfG51bWJlcik6IG51bWJlciB7XG4gICAgY29uc3QgbnVtID0gZGF0ZSBpbnN0YW5jZW9mIERhdGUgPyBkYXRlLmdldFRpbWUoKSA6IGRhdGVcbiAgICByZXR1cm4gTWF0aC5mbG9vcigobnVtIC0gdHpvZmYoKSkgLyAxMDAwIC8gMzYwMCAvIDI0KVxufVxuXG4vLyAqRnJvbURhdGVOdW0qIGNvbnZlcnRzIGEgbnVtYmVyIG9mIGRheXMgdG8gYSBudW1iZXIgb2Ygc2Vjb25kc1xuZXhwb3J0IGZ1bmN0aW9uIGZyb21EYXRlTnVtKGRheXM6IG51bWJlcik6IERhdGUge1xuICAgIGNvbnN0IGQgPSBuZXcgRGF0ZSgoZGF5cyAqIDEwMDAgKiAzNjAwICogMjQpICsgdHpvZmYoKSlcbiAgICAvLyBUaGUgY2hlY2tzIGJlbG93IGFyZSB0byBoYW5kbGUgZGF5bGlnaHQgc2F2aW5ncyB0aW1lXG4gICAgaWYgKGQuZ2V0SG91cnMoKSA9PT0gMSkgeyBkLnNldEhvdXJzKDApIH1cbiAgICBpZiAoKGQuZ2V0SG91cnMoKSA9PT0gMjIpIHx8IChkLmdldEhvdXJzKCkgPT09IDIzKSkge1xuICAgICAgZC5zZXRIb3VycygyNClcbiAgICAgIGQuc2V0TWludXRlcygwKVxuICAgICAgZC5zZXRTZWNvbmRzKDApXG4gICAgfVxuICAgIHJldHVybiBkXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b2RheSgpOiBudW1iZXIge1xuICAgIHJldHVybiB0b0RhdGVOdW0obmV3IERhdGUoKSlcbn1cblxuLyoqXG4gKiBJdGVyYXRlcyBmcm9tIHRoZSBzdGFydGluZyBkYXRlIHRvIGVuZGluZyBkYXRlIGluY2x1c2l2ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXRlckRheXMoc3RhcnQ6IERhdGUsIGVuZDogRGF0ZSwgY2I6IChkYXRlOiBEYXRlKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lIG5vLWxvb3BzXG4gICAgZm9yIChjb25zdCBkID0gbmV3IERhdGUoc3RhcnQpOyBkIDw9IGVuZDsgZC5zZXREYXRlKGQuZ2V0RGF0ZSgpICsgMSkpIHtcbiAgICAgICAgY2IoZClcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBjb21wdXRlV2Vla0lkLCBjcmVhdGVBc3NpZ25tZW50LCBnZXRFUywgc2VwYXJhdGVkQ2xhc3MgfSBmcm9tICcuL2NvbXBvbmVudHMvYXNzaWdubWVudCdcbmltcG9ydCB7IGNyZWF0ZURheSwgY3JlYXRlV2VlayB9IGZyb20gJy4vY29tcG9uZW50cy9jYWxlbmRhcidcbmltcG9ydCB7IGRpc3BsYXlFcnJvciB9IGZyb20gJy4vY29tcG9uZW50cy9lcnJvckRpc3BsYXknXG5pbXBvcnQgeyByZXNpemUgfSBmcm9tICcuL2NvbXBvbmVudHMvcmVzaXplcidcbmltcG9ydCB7IGZyb21EYXRlTnVtLCBpdGVyRGF5cywgdG9kYXkgfSBmcm9tICcuL2RhdGVzJ1xuaW1wb3J0IHsgY2xhc3NCeUlkLCBnZXREYXRhLCBJQXBwbGljYXRpb25EYXRhLCBJQXNzaWdubWVudCB9IGZyb20gJy4vcGNyJ1xuaW1wb3J0IHsgYWRkQWN0aXZpdHksIHNhdmVBY3Rpdml0eSB9IGZyb20gJy4vcGx1Z2lucy9hY3Rpdml0eSdcbmltcG9ydCB7IGV4dHJhVG9UYXNrLCBnZXRFeHRyYSwgSUN1c3RvbUFzc2lnbm1lbnQgfSBmcm9tICcuL3BsdWdpbnMvY3VzdG9tQXNzaWdubWVudHMnXG5pbXBvcnQgeyBhc3NpZ25tZW50SW5Eb25lLCByZW1vdmVGcm9tRG9uZSwgc2F2ZURvbmUgfSBmcm9tICcuL3BsdWdpbnMvZG9uZSdcbmltcG9ydCB7IGFzc2lnbm1lbnRJbk1vZGlmaWVkLCByZW1vdmVGcm9tTW9kaWZpZWQsIHNhdmVNb2RpZmllZCB9IGZyb20gJy4vcGx1Z2lucy9tb2RpZmllZEFzc2lnbm1lbnRzJ1xuaW1wb3J0IHsgc2V0dGluZ3MgfSBmcm9tICcuL3NldHRpbmdzJ1xuaW1wb3J0IHsgXyQsIGRhdGVTdHJpbmcsIGVsZW1CeUlkLCBlbGVtZW50LCBsb2NhbFN0b3JhZ2VSZWFkLCBzbW9vdGhTY3JvbGwgfSBmcm9tICcuL3V0aWwnXG5pbXBvcnQgeyBnZXRDYWxEYXRlT2Zmc2V0IH0gZnJvbSAnLi9uYXZpZ2F0aW9uJztcblxuZXhwb3J0IGludGVyZmFjZSBJU3BsaXRBc3NpZ25tZW50IHtcbiAgICBhc3NpZ25tZW50OiBJQXNzaWdubWVudFxuICAgIHN0YXJ0OiBEYXRlXG4gICAgZW5kOiBEYXRlfCdGb3JldmVyJ1xuICAgIGN1c3RvbTogYm9vbGVhblxuICAgIHJlZmVyZW5jZT86IElDdXN0b21Bc3NpZ25tZW50XG59XG5cbmNvbnN0IFNDSEVEVUxFX0VORFMgPSB7XG4gICAgZGF5OiAoZGF0ZTogRGF0ZSkgPT4gMjQgKiAzNjAwICogMTAwMCxcbiAgICBtczogKGRhdGU6IERhdGUpID0+IFsyNCwgICAgICAgICAgICAgIC8vIFN1bmRheVxuICAgICAgICAgICAgICAgICAgICAgICAgIDE1ICsgKDM1IC8gNjApLCAgLy8gTW9uZGF5XG4gICAgICAgICAgICAgICAgICAgICAgICAgMTUgKyAoMzUgLyA2MCksICAvLyBUdWVzZGF5XG4gICAgICAgICAgICAgICAgICAgICAgICAgMTUgKyAoMTUgLyA2MCksICAvLyBXZWRuZXNkYXlcbiAgICAgICAgICAgICAgICAgICAgICAgICAxNSArICgxNSAvIDYwKSwgIC8vIFRodXJzZGF5XG4gICAgICAgICAgICAgICAgICAgICAgICAgMTUgKyAoMTUgLyA2MCksICAvLyBGcmlkYXlcbiAgICAgICAgICAgICAgICAgICAgICAgICAyNCAgICAgICAgICAgICAgIC8vIFNhdHVyZGF5XG4gICAgICAgICAgICAgICAgICAgICAgICBdW2RhdGUuZ2V0RGF5KCldLFxuICAgIHVzOiAoZGF0ZTogRGF0ZSkgPT4gMTUgKiAzNjAwICogMTAwMFxufVxuY29uc3QgV0VFS0VORF9DTEFTU05BTUVTID0gWydmcm9tV2Vla2VuZCcsICdvdmVyV2Vla2VuZCddXG5cbmxldCBzY3JvbGwgPSAwIC8vIFRoZSBsb2NhdGlvbiB0byBzY3JvbGwgdG8gaW4gb3JkZXIgdG8gcmVhY2ggdG9kYXkgaW4gY2FsZW5kYXIgdmlld1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2Nyb2xsKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHNjcm9sbFxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VGltZUFmdGVyKGRhdGU6IERhdGUpOiBudW1iZXIge1xuICAgIGNvbnN0IGhpZGVBc3NpZ25tZW50cyA9IHNldHRpbmdzLmhpZGVBc3NpZ25tZW50c1xuICAgIGlmIChoaWRlQXNzaWdubWVudHMgPT09ICdkYXknIHx8IGhpZGVBc3NpZ25tZW50cyA9PT0gJ21zJyB8fCBoaWRlQXNzaWdubWVudHMgPT09ICd1cycpIHtcbiAgICAgICAgcmV0dXJuIFNDSEVEVUxFX0VORFNbaGlkZUFzc2lnbm1lbnRzXShkYXRlKVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBTQ0hFRFVMRV9FTkRTLmRheShkYXRlKVxuICAgIH1cbn1cblxuZnVuY3Rpb24gZ2V0U3RhcnRFbmREYXRlcyhkYXRhOiBJQXBwbGljYXRpb25EYXRhKToge3N0YXJ0OiBEYXRlLCBlbmQ6IERhdGUgfSB7XG4gICAgaWYgKGRhdGEubW9udGhWaWV3KSB7XG4gICAgICAgIGNvbnN0IHN0YXJ0TiA9IE1hdGgubWluKC4uLmRhdGEuYXNzaWdubWVudHMubWFwKChhKSA9PiBhLnN0YXJ0KSkgLy8gU21hbGxlc3QgZGF0ZVxuICAgICAgICBjb25zdCBlbmROID0gTWF0aC5tYXgoLi4uZGF0YS5hc3NpZ25tZW50cy5tYXAoKGEpID0+IGEuc3RhcnQpKSAvLyBMYXJnZXN0IGRhdGVcblxuICAgICAgICBjb25zdCB5ZWFyID0gKG5ldyBEYXRlKCkpLmdldEZ1bGxZZWFyKCkgLy8gRm9yIGZ1dHVyZSBjYWxjdWxhdGlvbnNcblxuICAgICAgICAvLyBDYWxjdWxhdGUgd2hhdCBtb250aCB3ZSB3aWxsIGJlIGRpc3BsYXlpbmcgYnkgZmluZGluZyB0aGUgbW9udGggb2YgdG9kYXlcbiAgICAgICAgY29uc3QgbW9udGggPSAobmV3IERhdGUoKSkuZ2V0TW9udGgoKSArIGdldENhbERhdGVPZmZzZXQoKVxuXG4gICAgICAgIC8vIE1ha2Ugc3VyZSB0aGUgc3RhcnQgYW5kIGVuZCBkYXRlcyBsaWUgd2l0aGluIHRoZSBtb250aFxuICAgICAgICBjb25zdCBzdGFydCA9IG5ldyBEYXRlKE1hdGgubWF4KGZyb21EYXRlTnVtKHN0YXJ0TikuZ2V0VGltZSgpLCAobmV3IERhdGUoeWVhciwgbW9udGgpKS5nZXRUaW1lKCkpKVxuICAgICAgICAvLyBJZiB0aGUgZGF5IGFyZ3VtZW50IGZvciBEYXRlIGlzIDAsIHRoZW4gdGhlIHJlc3VsdGluZyBkYXRlIHdpbGwgYmUgb2YgdGhlIHByZXZpb3VzIG1vbnRoXG4gICAgICAgIGNvbnN0IGVuZCA9IG5ldyBEYXRlKE1hdGgubWluKGZyb21EYXRlTnVtKGVuZE4pLmdldFRpbWUoKSwgKG5ldyBEYXRlKHllYXIsIG1vbnRoICsgMSwgMCkpLmdldFRpbWUoKSkpXG4gICAgICAgIHJldHVybiB7IHN0YXJ0LCBlbmQgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgdG9kYXlTRSA9IG5ldyBEYXRlKClcbiAgICAgICAgY29uc3Qgc3RhcnQgPSBuZXcgRGF0ZSh0b2RheVNFLmdldEZ1bGxZZWFyKCksIHRvZGF5U0UuZ2V0TW9udGgoKSwgdG9kYXlTRS5nZXREYXRlKCkpXG4gICAgICAgIGNvbnN0IGVuZCA9IG5ldyBEYXRlKHRvZGF5U0UuZ2V0RnVsbFllYXIoKSwgdG9kYXlTRS5nZXRNb250aCgpLCB0b2RheVNFLmdldERhdGUoKSlcbiAgICAgICAgcmV0dXJuIHsgc3RhcnQsIGVuZCB9XG4gICAgICB9XG59XG5cbmZ1bmN0aW9uIGdldEFzc2lnbm1lbnRTcGxpdHMoYXNzaWdubWVudDogSUFzc2lnbm1lbnQsIHN0YXJ0OiBEYXRlLCBlbmQ6IERhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlZmVyZW5jZT86IElDdXN0b21Bc3NpZ25tZW50KTogSVNwbGl0QXNzaWdubWVudFtdIHtcbiAgICBjb25zdCBzcGxpdDogSVNwbGl0QXNzaWdubWVudFtdID0gW11cbiAgICBpZiAoc2V0dGluZ3MuYXNzaWdubWVudFNwYW4gPT09ICdtdWx0aXBsZScpIHtcbiAgICAgICAgY29uc3QgcyA9IE1hdGgubWF4KHN0YXJ0LmdldFRpbWUoKSwgZnJvbURhdGVOdW0oYXNzaWdubWVudC5zdGFydCkuZ2V0VGltZSgpKVxuICAgICAgICBjb25zdCBlID0gYXNzaWdubWVudC5lbmQgPT09ICdGb3JldmVyJyA/IHMgOiBNYXRoLm1pbihlbmQuZ2V0VGltZSgpLCBmcm9tRGF0ZU51bShhc3NpZ25tZW50LmVuZCkuZ2V0VGltZSgpKVxuICAgICAgICBjb25zdCBzcGFuID0gKChlIC0gcykgLyAxMDAwIC8gMzYwMCAvIDI0KSArIDEgLy8gTnVtYmVyIG9mIGRheXMgYXNzaWdubWVudCB0YWtlcyB1cFxuICAgICAgICBjb25zdCBzcGFuUmVsYXRpdmUgPSA2IC0gKG5ldyBEYXRlKHMpKS5nZXREYXkoKSAvLyBOdW1iZXIgb2YgZGF5cyB1bnRpbCB0aGUgbmV4dCBTYXR1cmRheVxuXG4gICAgICAgIGNvbnN0IG5zID0gbmV3IERhdGUocylcbiAgICAgICAgbnMuc2V0RGF0ZShucy5nZXREYXRlKCkgKyBzcGFuUmVsYXRpdmUpIC8vICBUaGUgZGF0ZSBvZiB0aGUgbmV4dCBTYXR1cmRheVxuXG4gICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZSBuby1sb29wc1xuICAgICAgICBmb3IgKGxldCBuID0gLTY7IG4gPCBzcGFuIC0gc3BhblJlbGF0aXZlOyBuICs9IDcpIHtcbiAgICAgICAgICAgIGNvbnN0IGxhc3RTdW4gPSBuZXcgRGF0ZShucylcbiAgICAgICAgICAgIGxhc3RTdW4uc2V0RGF0ZShsYXN0U3VuLmdldERhdGUoKSArIG4pXG5cbiAgICAgICAgICAgIGNvbnN0IG5leHRTYXQgPSBuZXcgRGF0ZShsYXN0U3VuKVxuICAgICAgICAgICAgbmV4dFNhdC5zZXREYXRlKG5leHRTYXQuZ2V0RGF0ZSgpICsgNilcbiAgICAgICAgICAgIHNwbGl0LnB1c2goe1xuICAgICAgICAgICAgICAgIGFzc2lnbm1lbnQsXG4gICAgICAgICAgICAgICAgc3RhcnQ6IG5ldyBEYXRlKE1hdGgubWF4KHMsIGxhc3RTdW4uZ2V0VGltZSgpKSksXG4gICAgICAgICAgICAgICAgZW5kOiBuZXcgRGF0ZShNYXRoLm1pbihlLCBuZXh0U2F0LmdldFRpbWUoKSkpLFxuICAgICAgICAgICAgICAgIGN1c3RvbTogQm9vbGVhbihyZWZlcmVuY2UpLFxuICAgICAgICAgICAgICAgIHJlZmVyZW5jZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAoc2V0dGluZ3MuYXNzaWdubWVudFNwYW4gPT09ICdzdGFydCcpIHtcbiAgICAgICAgY29uc3QgcyA9IGZyb21EYXRlTnVtKGFzc2lnbm1lbnQuc3RhcnQpXG4gICAgICAgIGlmIChzLmdldFRpbWUoKSA+PSBzdGFydC5nZXRUaW1lKCkpIHtcbiAgICAgICAgICAgIHNwbGl0LnB1c2goe1xuICAgICAgICAgICAgICAgIGFzc2lnbm1lbnQsXG4gICAgICAgICAgICAgICAgc3RhcnQ6IHMsXG4gICAgICAgICAgICAgICAgZW5kOiBzLFxuICAgICAgICAgICAgICAgIGN1c3RvbTogQm9vbGVhbihyZWZlcmVuY2UpLFxuICAgICAgICAgICAgICAgIHJlZmVyZW5jZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAoc2V0dGluZ3MuYXNzaWdubWVudFNwYW4gPT09ICdlbmQnKSB7XG4gICAgICAgIGNvbnN0IGUgPSBhc3NpZ25tZW50LmVuZCA9PT0gJ0ZvcmV2ZXInID8gYXNzaWdubWVudC5lbmQgOiBmcm9tRGF0ZU51bShhc3NpZ25tZW50LmVuZClcbiAgICAgICAgY29uc3QgZGUgPSBlID09PSAnRm9yZXZlcicgPyBmcm9tRGF0ZU51bShhc3NpZ25tZW50LnN0YXJ0KSA6IGVcbiAgICAgICAgaWYgKGRlLmdldFRpbWUoKSA8PSBlbmQuZ2V0VGltZSgpKSB7XG4gICAgICAgICAgICBzcGxpdC5wdXNoKHtcbiAgICAgICAgICAgICAgICBhc3NpZ25tZW50LFxuICAgICAgICAgICAgICAgIHN0YXJ0OiBkZSxcbiAgICAgICAgICAgICAgICBlbmQ6IGUsXG4gICAgICAgICAgICAgICAgY3VzdG9tOiBCb29sZWFuKHJlZmVyZW5jZSksXG4gICAgICAgICAgICAgICAgcmVmZXJlbmNlXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHNwbGl0XG59XG5cbi8vIFRoaXMgZnVuY3Rpb24gd2lsbCBjb252ZXJ0IHRoZSBhcnJheSBvZiBhc3NpZ25tZW50cyBnZW5lcmF0ZWQgYnkgKnBhcnNlKiBpbnRvIHJlYWRhYmxlIEhUTUwuXG5leHBvcnQgZnVuY3Rpb24gZGlzcGxheShkb1Njcm9sbDogYm9vbGVhbiA9IHRydWUpOiB2b2lkIHtcbiAgICBjb25zb2xlLnRpbWUoJ0Rpc3BsYXlpbmcgZGF0YScpXG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgZGF0YSA9IGdldERhdGEoKVxuICAgICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRGF0YSBzaG91bGQgaGF2ZSBiZWVuIGZldGNoZWQgYmVmb3JlIGRpc3BsYXkoKSB3YXMgY2FsbGVkJylcbiAgICAgICAgfVxuXG4gICAgICAgIGRvY3VtZW50LmJvZHkuc2V0QXR0cmlidXRlKCdkYXRhLXBjcnZpZXcnLCBkYXRhLm1vbnRoVmlldyA/ICdtb250aCcgOiAnb3RoZXInKVxuICAgICAgICBjb25zdCBtYWluID0gXyQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbWFpbicpKVxuICAgICAgICBjb25zdCB0YWtlbjogeyBbZGF0ZTogbnVtYmVyXTogbnVtYmVyW10gfSA9IHt9XG5cbiAgICAgICAgY29uc3QgdGltZWFmdGVyID0gZ2V0VGltZUFmdGVyKG5ldyBEYXRlKCkpXG5cbiAgICAgICAgY29uc3Qge3N0YXJ0LCBlbmR9ID0gZ2V0U3RhcnRFbmREYXRlcyhkYXRhKVxuXG4gICAgICAgIC8vIFNldCB0aGUgc3RhcnQgZGF0ZSB0byBiZSBhIFN1bmRheSBhbmQgdGhlIGVuZCBkYXRlIHRvIGJlIGEgU2F0dXJkYXlcbiAgICAgICAgc3RhcnQuc2V0RGF0ZShzdGFydC5nZXREYXRlKCkgLSBzdGFydC5nZXREYXkoKSlcbiAgICAgICAgZW5kLnNldERhdGUoZW5kLmdldERhdGUoKSArICg2IC0gZW5kLmdldERheSgpKSlcblxuICAgICAgICAvLyBGaXJzdCBwb3B1bGF0ZSB0aGUgY2FsZW5kYXIgd2l0aCBib3hlcyBmb3IgZWFjaCBkYXlcbiAgICAgICAgY29uc3QgbGFzdERhdGEgPSBsb2NhbFN0b3JhZ2VSZWFkKCdkYXRhJykgYXMgSUFwcGxpY2F0aW9uRGF0YVxuICAgICAgICBsZXQgd2s6IEhUTUxFbGVtZW50fG51bGwgPSBudWxsXG4gICAgICAgIGl0ZXJEYXlzKHN0YXJ0LCBlbmQsIChkKSA9PiB7XG4gICAgICAgICAgICBpZiAoZC5nZXREYXkoKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGlkID0gYHdrJHtkLmdldE1vbnRoKCl9LSR7ZC5nZXREYXRlKCl9YCAvLyBEb24ndCBjcmVhdGUgYSBuZXcgd2VlayBlbGVtZW50IGlmIG9uZSBhbHJlYWR5IGV4aXN0c1xuICAgICAgICAgICAgICAgIHdrID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpXG4gICAgICAgICAgICAgICAgaWYgKHdrID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgd2sgPSBjcmVhdGVXZWVrKGlkKVxuICAgICAgICAgICAgICAgICAgICBtYWluLmFwcGVuZENoaWxkKHdrKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCF3aykgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCB3ZWVrIGVsZW1lbnQgb24gZGF5ICR7ZH0gdG8gbm90IGJlIG51bGxgKVxuICAgICAgICAgICAgaWYgKHdrLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2RheScpLmxlbmd0aCA8PSBkLmdldERheSgpKSB7XG4gICAgICAgICAgICAgICAgd2suYXBwZW5kQ2hpbGQoY3JlYXRlRGF5KGQpKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0YWtlbltkLmdldFRpbWUoKV0gPSBbXVxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIFNwbGl0IGFzc2lnbm1lbnRzIHRha2luZyBtb3JlIHRoYW4gMSB3ZWVrXG4gICAgICAgIGNvbnN0IHNwbGl0OiBJU3BsaXRBc3NpZ25tZW50W10gPSBbXVxuICAgICAgICBkYXRhLmFzc2lnbm1lbnRzLmZvckVhY2goKGFzc2lnbm1lbnQsIG51bSkgPT4ge1xuICAgICAgICAgICAgc3BsaXQucHVzaCguLi5nZXRBc3NpZ25tZW50U3BsaXRzKGFzc2lnbm1lbnQsIHN0YXJ0LCBlbmQpKVxuXG4gICAgICAgICAgICAvLyBBY3Rpdml0eSBzdHVmZlxuICAgICAgICAgICAgaWYgKGxhc3REYXRhICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBvbGRBc3NpZ25tZW50ID0gbGFzdERhdGEuYXNzaWdubWVudHMuZmluZCgoYSkgPT4gYS5pZCA9PT0gYXNzaWdubWVudC5pZClcbiAgICAgICAgICAgICAgICBpZiAob2xkQXNzaWdubWVudCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAob2xkQXNzaWdubWVudC5ib2R5ICE9PSBhc3NpZ25tZW50LmJvZHkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkZEFjdGl2aXR5KCdlZGl0Jywgb2xkQXNzaWdubWVudCwgbmV3IERhdGUoKSwgdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9sZEFzc2lnbm1lbnQuY2xhc3MgIT0gbnVsbCA/IGxhc3REYXRhLmNsYXNzZXNbb2xkQXNzaWdubWVudC5jbGFzc10gOiB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgICAgICAgICByZW1vdmVGcm9tTW9kaWZpZWQoYXNzaWdubWVudC5pZCkgLy8gSWYgdGhlIGFzc2lnbm1lbnQgaXMgbW9kaWZpZWQsIHJlc2V0IGl0XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbGFzdERhdGEuYXNzaWdubWVudHMuc3BsaWNlKGxhc3REYXRhLmFzc2lnbm1lbnRzLmluZGV4T2Yob2xkQXNzaWdubWVudCksIDEpXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYWRkQWN0aXZpdHkoJ2FkZCcsIGFzc2lnbm1lbnQsIG5ldyBEYXRlKCksIHRydWUpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIGlmIChsYXN0RGF0YSAhPSBudWxsKSB7XG4gICAgICAgICAgICAvLyBDaGVjayBpZiBhbnkgb2YgdGhlIGxhc3QgYXNzaWdubWVudHMgd2VyZW4ndCBkZWxldGVkIChzbyB0aGV5IGhhdmUgYmVlbiBkZWxldGVkIGluIFBDUilcbiAgICAgICAgICAgIGxhc3REYXRhLmFzc2lnbm1lbnRzLmZvckVhY2goKGFzc2lnbm1lbnQpID0+IHtcbiAgICAgICAgICAgICAgICBhZGRBY3Rpdml0eSgnZGVsZXRlJywgYXNzaWdubWVudCwgbmV3IERhdGUoKSwgdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhc3NpZ25tZW50LmNsYXNzICE9IG51bGwgPyBsYXN0RGF0YS5jbGFzc2VzW2Fzc2lnbm1lbnQuY2xhc3NdIDogdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIHJlbW92ZUZyb21Eb25lKGFzc2lnbm1lbnQuaWQpXG4gICAgICAgICAgICAgICAgcmVtb3ZlRnJvbU1vZGlmaWVkKGFzc2lnbm1lbnQuaWQpXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAvLyBUaGVuIHNhdmUgYSBtYXhpbXVtIG9mIDEyOCBhY3Rpdml0eSBpdGVtc1xuICAgICAgICAgICAgc2F2ZUFjdGl2aXR5KClcblxuICAgICAgICAgICAgLy8gQW5kIGNvbXBsZXRlZCBhc3NpZ25tZW50cyArIG1vZGlmaWNhdGlvbnNcbiAgICAgICAgICAgIHNhdmVEb25lKClcbiAgICAgICAgICAgIHNhdmVNb2RpZmllZCgpXG4gICAgICAgIH1cblxuICAgICAgICAvLyBBZGQgY3VzdG9tIGFzc2lnbm1lbnRzIHRvIHRoZSBzcGxpdCBhcnJheVxuICAgICAgICBnZXRFeHRyYSgpLmZvckVhY2goKGN1c3RvbSkgPT4ge1xuICAgICAgICAgICAgc3BsaXQucHVzaCguLi5nZXRBc3NpZ25tZW50U3BsaXRzKGV4dHJhVG9UYXNrKGN1c3RvbSwgZGF0YSksIHN0YXJ0LCBlbmQsIGN1c3RvbSkpXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gQ2FsY3VsYXRlIHRoZSB0b2RheSdzIHdlZWsgaWRcbiAgICAgICAgY29uc3QgdGRzdCA9IG5ldyBEYXRlKClcbiAgICAgICAgdGRzdC5zZXREYXRlKHRkc3QuZ2V0RGF0ZSgpIC0gdGRzdC5nZXREYXkoKSlcbiAgICAgICAgY29uc3QgdG9kYXlXa0lkID0gYHdrJHt0ZHN0LmdldE1vbnRoKCl9LSR7dGRzdC5nZXREYXRlKCl9YFxuXG4gICAgICAgIC8vIFRoZW4gYWRkIGFzc2lnbm1lbnRzXG4gICAgICAgIGNvbnN0IHdlZWtIZWlnaHRzOiB7IFt3ZWVrSWQ6IHN0cmluZ106IG51bWJlciB9ID0ge31cbiAgICAgICAgY29uc3QgcHJldmlvdXNBc3NpZ25tZW50czogeyBbaWQ6IHN0cmluZ106IEhUTUxFbGVtZW50IH0gPSB7fVxuICAgICAgICBBcnJheS5wcm90b3R5cGUuZm9yRWFjaC5jYWxsKGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2Fzc2lnbm1lbnQnKSwgKGFzc2lnbm1lbnQ6IEhUTUxFbGVtZW50KSA9PiB7XG4gICAgICAgICAgICBwcmV2aW91c0Fzc2lnbm1lbnRzW2Fzc2lnbm1lbnQuaWRdID0gYXNzaWdubWVudFxuICAgICAgICB9KVxuXG4gICAgICAgIHNwbGl0LmZvckVhY2goKHMpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHdlZWtJZCA9IGNvbXB1dGVXZWVrSWQocylcbiAgICAgICAgICAgIHdrID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQod2Vla0lkKVxuICAgICAgICAgICAgaWYgKHdrID09IG51bGwpIHJldHVyblxuXG4gICAgICAgICAgICBjb25zdCBlID0gY3JlYXRlQXNzaWdubWVudChzLCBkYXRhKVxuXG4gICAgICAgICAgICAvLyBDYWxjdWxhdGUgaG93IG1hbnkgYXNzaWdubWVudHMgYXJlIHBsYWNlZCBiZWZvcmUgdGhlIGN1cnJlbnQgb25lXG4gICAgICAgICAgICBpZiAoIXMuY3VzdG9tIHx8ICFzZXR0aW5ncy5zZXBUYXNrcykge1xuICAgICAgICAgICAgICAgIGxldCBwb3MgPSAwXG4gICAgICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lIG5vLWxvb3BzXG4gICAgICAgICAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZvdW5kID0gdHJ1ZVxuICAgICAgICAgICAgICAgICAgICBpdGVyRGF5cyhzLnN0YXJ0LCBzLmVuZCA9PT0gJ0ZvcmV2ZXInID8gcy5zdGFydCA6IHMuZW5kLCAoZCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRha2VuW2QuZ2V0VGltZSgpXS5pbmRleE9mKHBvcykgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm91bmQgPSBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICBpZiAoZm91bmQpIHsgYnJlYWsgfVxuICAgICAgICAgICAgICAgICAgICBwb3MrK1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIEFwcGVuZCB0aGUgcG9zaXRpb24gdGhlIGFzc2lnbm1lbnQgaXMgYXQgdG8gdGhlIHRha2VuIGFycmF5XG4gICAgICAgICAgICAgICAgaXRlckRheXMocy5zdGFydCwgcy5lbmQgPT09ICdGb3JldmVyJyA/IHMuc3RhcnQgOiBzLmVuZCwgKGQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGFrZW5bZC5nZXRUaW1lKCldLnB1c2gocG9zKVxuICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICAvLyBDYWxjdWxhdGUgaG93IGZhciBkb3duIHRoZSBhc3NpZ25tZW50IG11c3QgYmUgcGxhY2VkIGFzIHRvIG5vdCBibG9jayB0aGUgb25lcyBhYm92ZSBpdFxuICAgICAgICAgICAgICAgIGUuc3R5bGUubWFyZ2luVG9wID0gKHBvcyAqIDMwKSArICdweCdcblxuICAgICAgICAgICAgICAgIGlmICgod2Vla0hlaWdodHNbd2Vla0lkXSA9PSBudWxsKSB8fCAocG9zID4gd2Vla0hlaWdodHNbd2Vla0lkXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgd2Vla0hlaWdodHNbd2Vla0lkXSA9IHBvc1xuICAgICAgICAgICAgICAgICAgICB3ay5zdHlsZS5oZWlnaHQgPSA0NyArICgocG9zICsgMSkgKiAzMCkgKyAncHgnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBJZiB0aGUgYXNzaWdubWVudCBpcyBhIHRlc3QgYW5kIGlzIHVwY29taW5nLCBhZGQgaXQgdG8gdGhlIHVwY29taW5nIHRlc3RzIHBhbmVsLlxuICAgICAgICAgICAgaWYgKHMuYXNzaWdubWVudC5lbmQgPj0gdG9kYXkoKSAmJiAocy5hc3NpZ25tZW50LmJhc2VUeXBlID09PSAndGVzdCcgfHxcbiAgICAgICAgICAgICAgICAoc2V0dGluZ3MucHJvamVjdHNJblRlc3RQYW5lICYmIHMuYXNzaWdubWVudC5iYXNlVHlwZSA9PT0gJ2xvbmd0ZXJtJykpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdGUgPSBlbGVtZW50KCdkaXYnLCBbJ3VwY29taW5nVGVzdCcsICdhc3NpZ25tZW50SXRlbScsIHMuYXNzaWdubWVudC5iYXNlVHlwZV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGA8aSBjbGFzcz0nbWF0ZXJpYWwtaWNvbnMnPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7cy5hc3NpZ25tZW50LmJhc2VUeXBlID09PSAnbG9uZ3Rlcm0nID8gJ2Fzc2lnbm1lbnQnIDogJ2Fzc2Vzc21lbnQnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9J3RpdGxlJz4ke3MuYXNzaWdubWVudC50aXRsZX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c21hbGw+JHtzZXBhcmF0ZWRDbGFzcyhzLmFzc2lnbm1lbnQsIGRhdGEpWzJdfTwvc21hbGw+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPSdyYW5nZSc+JHtkYXRlU3RyaW5nKHMuYXNzaWdubWVudC5lbmQsIHRydWUpfTwvZGl2PmAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGB0ZXN0JHtzLmFzc2lnbm1lbnQuaWR9YClcbiAgICAgICAgICAgICAgICBpZiAocy5hc3NpZ25tZW50LmNsYXNzKSB0ZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtY2xhc3MnLCBkYXRhLmNsYXNzZXNbcy5hc3NpZ25tZW50LmNsYXNzXSlcbiAgICAgICAgICAgICAgICB0ZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZG9TY3JvbGxpbmcgPSBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBzbW9vdGhTY3JvbGwoKGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wICsgZG9jdW1lbnQuYm9keS5zY3JvbGxUb3ApIC0gMTE2KVxuICAgICAgICAgICAgICAgICAgICAgICAgZS5jbGljaygpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGRvY3VtZW50LmJvZHkuZ2V0QXR0cmlidXRlKCdkYXRhLXZpZXcnKSA9PT0gJzAnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkb1Njcm9sbGluZygpXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfJChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbmF2VGFicz5saTpmaXJzdC1jaGlsZCcpIGFzIEhUTUxFbGVtZW50KS5jbGljaygpXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGRvU2Nyb2xsaW5nLCA1MDApXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgaWYgKGFzc2lnbm1lbnRJbkRvbmUocy5hc3NpZ25tZW50LmlkKSkge1xuICAgICAgICAgICAgICAgICAgICB0ZS5jbGFzc0xpc3QuYWRkKCdkb25lJylcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgdGVzdEVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgdGVzdCR7cy5hc3NpZ25tZW50LmlkfWApXG4gICAgICAgICAgICAgICAgaWYgKHRlc3RFbGVtKSB7XG4gICAgICAgICAgICAgICAgdGVzdEVsZW0uaW5uZXJIVE1MID0gdGUuaW5uZXJIVE1MXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbUJ5SWQoJ2luZm9UZXN0cycpLmFwcGVuZENoaWxkKHRlKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgYWxyZWFkeSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHMuYXNzaWdubWVudC5pZCArIHdlZWtJZClcbiAgICAgICAgICAgIGlmIChhbHJlYWR5ICE9IG51bGwpIHsgLy8gQXNzaWdubWVudCBhbHJlYWR5IGV4aXN0c1xuICAgICAgICAgICAgICAgIGFscmVhZHkuc3R5bGUubWFyZ2luVG9wID0gZS5zdHlsZS5tYXJnaW5Ub3BcbiAgICAgICAgICAgICAgICBhbHJlYWR5LnNldEF0dHJpYnV0ZSgnZGF0YS1jbGFzcycsXG4gICAgICAgICAgICAgICAgICAgIHMuY3VzdG9tICYmIHNldHRpbmdzLnNlcFRhc2tDbGFzcyA/ICdUYXNrJyA6IGNsYXNzQnlJZChzLmFzc2lnbm1lbnQuY2xhc3MpKVxuICAgICAgICAgICAgICAgIGlmICghYXNzaWdubWVudEluTW9kaWZpZWQocy5hc3NpZ25tZW50LmlkKSkge1xuICAgICAgICAgICAgICAgICAgICBhbHJlYWR5LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2JvZHknKVswXS5pbm5lckhUTUwgPSBlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2JvZHknKVswXS5pbm5lckhUTUxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXyQoYWxyZWFkeS5xdWVyeVNlbGVjdG9yKCcuZWRpdHMnKSkuY2xhc3NOYW1lID0gXyQoZS5xdWVyeVNlbGVjdG9yKCcuZWRpdHMnKSkuY2xhc3NOYW1lXG4gICAgICAgICAgICAgICAgaWYgKGFscmVhZHkuY2xhc3NMaXN0LnRvZ2dsZSkge1xuICAgICAgICAgICAgICAgICAgICBhbHJlYWR5LmNsYXNzTGlzdC50b2dnbGUoJ2xpc3REaXNwJywgZS5jbGFzc0xpc3QuY29udGFpbnMoJ2xpc3REaXNwJykpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGdldEVTKGFscmVhZHkpLmZvckVhY2goKGNsKSA9PiBhbHJlYWR5LmNsYXNzTGlzdC5yZW1vdmUoY2wpKVxuICAgICAgICAgICAgICAgIGdldEVTKGUpLmZvckVhY2goKGNsKSA9PiBhbHJlYWR5LmNsYXNzTGlzdC5hZGQoY2wpKVxuICAgICAgICAgICAgICAgIFdFRUtFTkRfQ0xBU1NOQU1FUy5mb3JFYWNoKChjbCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBhbHJlYWR5LmNsYXNzTGlzdC5yZW1vdmUoY2wpXG4gICAgICAgICAgICAgICAgICAgIGlmIChlLmNsYXNzTGlzdC5jb250YWlucyhjbCkpIGFscmVhZHkuY2xhc3NMaXN0LmFkZChjbClcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAocy5jdXN0b20gJiYgc2V0dGluZ3Muc2VwVGFza3MpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3QgPSBNYXRoLmZsb29yKHMuc3RhcnQuZ2V0VGltZSgpIC8gMTAwMCAvIDM2MDAgLyAyNClcbiAgICAgICAgICAgICAgICAgICAgaWYgKChzLmFzc2lnbm1lbnQuc3RhcnQgPT09IHN0KSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgKHMuYXNzaWdubWVudC5lbmQgPT09ICdGb3JldmVyJyB8fCBzLmFzc2lnbm1lbnQuZW5kID49IHRvZGF5KCkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlLmNsYXNzTGlzdC5yZW1vdmUoJ2Fzc2lnbm1lbnQnKVxuICAgICAgICAgICAgICAgICAgICAgICAgZS5jbGFzc0xpc3QuYWRkKCd0YXNrUGFuZUl0ZW0nKVxuICAgICAgICAgICAgICAgICAgICAgICAgZS5zdHlsZS5vcmRlciA9IFN0cmluZyhzLmFzc2lnbm1lbnQuZW5kID09PSAnRm9yZXZlcicgPyBOdW1iZXIuTUFYX1ZBTFVFIDogcy5hc3NpZ25tZW50LmVuZClcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGxpbmsgPSBlLnF1ZXJ5U2VsZWN0b3IoJy5saW5rZWQnKVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxpbmspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLmluc2VydEJlZm9yZShlbGVtZW50KCdzbWFsbCcsIFtdLCBsaW5rLmlubmVySFRNTCksIGxpbmspXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluay5yZW1vdmUoKVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbUJ5SWQoJ2luZm9UYXNrc0lubmVyJykuYXBwZW5kQ2hpbGQoZSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7IHdrLmFwcGVuZENoaWxkKGUpIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRlbGV0ZSBwcmV2aW91c0Fzc2lnbm1lbnRzW3MuYXNzaWdubWVudC5pZCArIHdlZWtJZF1cbiAgICAgICAgfSlcblxuICAgICAgICAvLyBEZWxldGUgYW55IGFzc2lnbm1lbnRzIHRoYXQgaGF2ZSBiZWVuIGRlbGV0ZWQgc2luY2UgdXBkYXRpbmdcbiAgICAgICAgT2JqZWN0LmVudHJpZXMocHJldmlvdXNBc3NpZ25tZW50cykuZm9yRWFjaCgoW25hbWUsIGFzc2lnbm1lbnRdKSA9PiB7XG4gICAgICAgICAgICBpZiAoYXNzaWdubWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2Z1bGwnKSkge1xuICAgICAgICAgICAgICAgIGVsZW1CeUlkKCdiYWNrZ3JvdW5kJykuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFzc2lnbm1lbnQucmVtb3ZlKClcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBTY3JvbGwgdG8gdGhlIGNvcnJlY3QgcG9zaXRpb24gaW4gY2FsZW5kYXIgdmlld1xuICAgICAgICBpZiAod2Vla0hlaWdodHNbdG9kYXlXa0lkXSAhPSBudWxsKSB7XG4gICAgICAgICAgICBsZXQgaCA9IDBcbiAgICAgICAgICAgIGNvbnN0IHN3ID0gKHdraWQ6IHN0cmluZykgPT4gd2tpZC5zdWJzdHJpbmcoMikuc3BsaXQoJy0nKS5tYXAoKHgpID0+IE51bWJlcih4KSlcbiAgICAgICAgICAgIGNvbnN0IHRvZGF5V2sgPSBzdyh0b2RheVdrSWQpXG4gICAgICAgICAgICBPYmplY3QuZW50cmllcyh3ZWVrSGVpZ2h0cykuZm9yRWFjaCgoW3drSWQsIHZhbF0pID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB3a1NwbGl0ID0gc3cod2tJZClcbiAgICAgICAgICAgICAgICBpZiAoKHdrU3BsaXRbMF0gPCB0b2RheVdrWzBdKSB8fCAoKHdrU3BsaXRbMF0gPT09IHRvZGF5V2tbMF0pICYmICh3a1NwbGl0WzFdIDwgdG9kYXlXa1sxXSkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGggKz0gdmFsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHNjcm9sbCA9IChoICogMzApICsgMTEyICsgMTRcbiAgICAgICAgICAgIC8vIEFsc28gc2hvdyB0aGUgZGF5IGhlYWRlcnMgaWYgdG9kYXkncyBkYXRlIGlzIGRpc3BsYXllZCBpbiB0aGUgZmlyc3Qgcm93IG9mIHRoZSBjYWxlbmRhclxuICAgICAgICAgICAgaWYgKHNjcm9sbCA8IDUwKSBzY3JvbGwgPSAwXG4gICAgICAgICAgICBpZiAoZG9TY3JvbGwgJiYgKGRvY3VtZW50LmJvZHkuZ2V0QXR0cmlidXRlKCdkYXRhLXZpZXcnKSA9PT0gJzAnKSAmJlxuICAgICAgICAgICAgICAgICFkb2N1bWVudC5ib2R5LnF1ZXJ5U2VsZWN0b3IoJy5mdWxsJykpIHtcbiAgICAgICAgICAgICAgICAvLyBpbiBjYWxlbmRhciB2aWV3XG4gICAgICAgICAgICAgICAgd2luZG93LnNjcm9sbFRvKDAsIHNjcm9sbClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnRvZ2dsZSgnbm9MaXN0JyxcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5hc3NpZ25tZW50Lmxpc3REaXNwOm5vdCguZG9uZSknKS5sZW5ndGggPT09IDApXG4gICAgICAgIGlmIChkb2N1bWVudC5ib2R5LmdldEF0dHJpYnV0ZSgnZGF0YS12aWV3JykgPT09ICcxJykgeyAvLyBpbiBsaXN0IHZpZXdcbiAgICAgICAgICAgIHJlc2l6ZSgpXG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgZGlzcGxheUVycm9yKGVycilcbiAgICB9XG4gICAgY29uc29sZS50aW1lRW5kKCdEaXNwbGF5aW5nIGRhdGEnKVxufVxuXG4vLyBUaGUgZnVuY3Rpb24gYmVsb3cgY29udmVydHMgYW4gdXBkYXRlIHRpbWUgdG8gYSBodW1hbi1yZWFkYWJsZSBkYXRlLlxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdFVwZGF0ZShkYXRlOiBudW1iZXIpOiBzdHJpbmcge1xuICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpXG4gIGNvbnN0IHVwZGF0ZSA9IG5ldyBEYXRlKCtkYXRlKVxuICBpZiAobm93LmdldERhdGUoKSA9PT0gdXBkYXRlLmdldERhdGUoKSkge1xuICAgIGxldCBhbXBtID0gJ0FNJ1xuICAgIGxldCBociA9IHVwZGF0ZS5nZXRIb3VycygpXG4gICAgaWYgKGhyID4gMTIpIHtcbiAgICAgIGFtcG0gPSAnUE0nXG4gICAgICBociAtPSAxMlxuICAgIH1cbiAgICBjb25zdCBtaW4gPSB1cGRhdGUuZ2V0TWludXRlcygpXG4gICAgcmV0dXJuIGBUb2RheSBhdCAke2hyfToke21pbiA8IDEwID8gYDAke21pbn1gIDogbWlufSAke2FtcG19YFxuICB9IGVsc2Uge1xuICAgIGNvbnN0IGRheXNQYXN0ID0gTWF0aC5jZWlsKChub3cuZ2V0VGltZSgpIC0gdXBkYXRlLmdldFRpbWUoKSkgLyAxMDAwIC8gMzYwMCAvIDI0KVxuICAgIGlmIChkYXlzUGFzdCA9PT0gMSkgeyByZXR1cm4gJ1llc3RlcmRheScgfSBlbHNlIHsgcmV0dXJuIGRheXNQYXN0ICsgJyBkYXlzIGFnbycgfVxuICB9XG59XG4iLCJsZXQgbGlzdERhdGVPZmZzZXQgPSAwXG5sZXQgY2FsRGF0ZU9mZnNldCA9IDBcblxuZXhwb3J0IGZ1bmN0aW9uIGdldExpc3REYXRlT2Zmc2V0KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIGxpc3REYXRlT2Zmc2V0XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbmNyZW1lbnRMaXN0RGF0ZU9mZnNldCgpOiB2b2lkIHtcbiAgICBsaXN0RGF0ZU9mZnNldCArPSAxXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWNyZW1lbnRMaXN0RGF0ZU9mZnNldCgpOiB2b2lkIHtcbiAgICBsaXN0RGF0ZU9mZnNldCAtPSAxXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRMaXN0RGF0ZU9mZnNldChvZmZzZXQ6IG51bWJlcik6IHZvaWQge1xuICAgIGxpc3REYXRlT2Zmc2V0ID0gb2Zmc2V0XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDYWxEYXRlT2Zmc2V0KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIGNhbERhdGVPZmZzZXRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGluY3JlbWVudENhbERhdGVPZmZzZXQoKTogdm9pZCB7XG4gICAgY2FsRGF0ZU9mZnNldCArPSAxXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWNyZW1lbnRDYWxEYXRlT2Zmc2V0KCk6IHZvaWQge1xuICAgIGNhbERhdGVPZmZzZXQgLT0gMVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0Q2FsRGF0ZU9mZnNldChvZmZzZXQ6IG51bWJlcik6IHZvaWQge1xuICAgIGNhbERhdGVPZmZzZXQgPSBvZmZzZXRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHplcm9EYXRlT2Zmc2V0cygpOiB2b2lkIHtcbiAgICBsaXN0RGF0ZU9mZnNldCA9IDBcbiAgICBjYWxEYXRlT2Zmc2V0ID0gMFxufVxuIiwiLyoqXG4gKiBUaGlzIG1vZHVsZSBjb250YWlucyBjb2RlIHRvIGJvdGggZmV0Y2ggYW5kIHBhcnNlIGFzc2lnbm1lbnRzIGZyb20gUENSLlxuICovXG5pbXBvcnQgeyB1cGRhdGVBdmF0YXIgfSBmcm9tICcuL2NvbXBvbmVudHMvYXZhdGFyJ1xuaW1wb3J0IHsgZGlzcGxheUVycm9yIH0gZnJvbSAnLi9jb21wb25lbnRzL2Vycm9yRGlzcGxheSdcbmltcG9ydCB7IHNuYWNrYmFyIH0gZnJvbSAnLi9jb21wb25lbnRzL3NuYWNrYmFyJ1xuaW1wb3J0IHsgZGVsZXRlQ29va2llLCBnZXRDb29raWUsIHNldENvb2tpZSB9IGZyb20gJy4vY29va2llcydcbmltcG9ydCB7IHRvRGF0ZU51bSB9IGZyb20gJy4vZGF0ZXMnXG5pbXBvcnQgeyBkaXNwbGF5LCBmb3JtYXRVcGRhdGUgfSBmcm9tICcuL2Rpc3BsYXknXG5pbXBvcnQgeyB6ZXJvRGF0ZU9mZnNldHMsIGdldENhbERhdGVPZmZzZXQsIGdldExpc3REYXRlT2Zmc2V0IH0gZnJvbSAnLi9uYXZpZ2F0aW9uJ1xuaW1wb3J0IHsgXyQsIGVsZW1CeUlkLCBsb2NhbFN0b3JhZ2VXcml0ZSwgc2VuZCB9IGZyb20gJy4vdXRpbCdcblxuY29uc3QgUENSX1VSTCA9ICdodHRwczovL3dlYmFwcHNjYS5wY3Jzb2Z0LmNvbSdcbmNvbnN0IEFTU0lHTk1FTlRTX1VSTCA9IGAke1BDUl9VUkx9L0NsdWUvU0MtQXNzaWdubWVudHMtU3RhcnQtYW5kLUVuZC1EYXRlLShOby1SYW5nZSkvMTg1OTRgXG5jb25zdCBMT0dJTl9VUkwgPSBgJHtQQ1JfVVJMfS9DbHVlL1NDLVN0dWRlbnQtUG9ydGFsLUxvZ2luLUxEQVAvODQ2ND9yZXR1cm5Vcmw9JHtlbmNvZGVVUklDb21wb25lbnQoQVNTSUdOTUVOVFNfVVJMKX1gXG5jb25zdCBBVFRBQ0hNRU5UU19VUkwgPSBgJHtQQ1JfVVJMfS9DbHVlL0NvbW1vbi9BdHRhY2htZW50UmVuZGVyLmFzcHhgXG5jb25zdCBGT1JNX0hFQURFUl9PTkxZID0geyAnQ29udGVudC10eXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcgfVxuY29uc3QgT05FX01JTlVURV9NUyA9IDYwMDAwXG5cbmNvbnN0IHByb2dyZXNzRWxlbWVudCA9IGVsZW1CeUlkKCdwcm9ncmVzcycpXG5jb25zdCBsb2dpbkRpYWxvZyA9IGVsZW1CeUlkKCdsb2dpbicpXG5jb25zdCBsb2dpbkJhY2tncm91bmQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9naW5CYWNrZ3JvdW5kJylcbmNvbnN0IGxhc3RVcGRhdGVFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsYXN0VXBkYXRlJylcbmNvbnN0IHVzZXJuYW1lRWwgPSBlbGVtQnlJZCgndXNlcm5hbWUnKSBhcyBIVE1MSW5wdXRFbGVtZW50XG5jb25zdCBwYXNzd29yZEVsID0gZWxlbUJ5SWQoJ3Bhc3N3b3JkJykgYXMgSFRNTElucHV0RWxlbWVudFxuY29uc3QgcmVtZW1iZXJDaGVjayA9IGVsZW1CeUlkKCdyZW1lbWJlcicpIGFzIEhUTUxJbnB1dEVsZW1lbnRcbmNvbnN0IGluY29ycmVjdExvZ2luRWwgPSBlbGVtQnlJZCgnbG9naW5JbmNvcnJlY3QnKVxuXG4vLyBUT0RPIGtlZXBpbmcgdGhlc2UgYXMgYSBnbG9iYWwgdmFycyBpcyBiYWRcbmNvbnN0IGxvZ2luSGVhZGVyczoge1toZWFkZXI6IHN0cmluZ106IHN0cmluZ30gPSB7fVxuY29uc3Qgdmlld0RhdGE6IHtbaGFkZXI6IHN0cmluZ106IHN0cmluZ30gPSB7fVxubGV0IGxhc3RVcGRhdGUgPSAwIC8vIFRoZSBsYXN0IHRpbWUgZXZlcnl0aGluZyB3YXMgdXBkYXRlZFxuXG5leHBvcnQgaW50ZXJmYWNlIElBcHBsaWNhdGlvbkRhdGEge1xuICAgIGNsYXNzZXM6IHN0cmluZ1tdXG4gICAgYXNzaWdubWVudHM6IElBc3NpZ25tZW50W11cbiAgICBtb250aFZpZXc6IGJvb2xlYW5cbn1cblxuZXhwb3J0IGludGVyZmFjZSBJQXNzaWdubWVudCB7XG4gICAgc3RhcnQ6IG51bWJlclxuICAgIGVuZDogbnVtYmVyfCdGb3JldmVyJ1xuICAgIGF0dGFjaG1lbnRzOiBBdHRhY2htZW50QXJyYXlbXVxuICAgIGJvZHk6IHN0cmluZ1xuICAgIHR5cGU6IHN0cmluZ1xuICAgIGJhc2VUeXBlOiBzdHJpbmdcbiAgICBjbGFzczogbnVtYmVyfG51bGwsXG4gICAgdGl0bGU6IHN0cmluZ1xuICAgIGlkOiBzdHJpbmdcbn1cblxuZXhwb3J0IHR5cGUgQXR0YWNobWVudEFycmF5ID0gW3N0cmluZywgc3RyaW5nXVxuXG4vLyBUaGlzIGlzIHRoZSBmdW5jdGlvbiB0aGF0IHJldHJpZXZlcyB5b3VyIGFzc2lnbm1lbnRzIGZyb20gUENSLlxuLy9cbi8vIEZpcnN0LCBhIHJlcXVlc3QgaXMgc2VudCB0byBQQ1IgdG8gbG9hZCB0aGUgcGFnZSB5b3Ugd291bGQgbm9ybWFsbHkgc2VlIHdoZW4gYWNjZXNzaW5nIFBDUi5cbi8vXG4vLyBCZWNhdXNlIHRoaXMgaXMgcnVuIGFzIGEgY2hyb21lIGV4dGVuc2lvbiwgdGhpcyBwYWdlIGNhbiBiZSBhY2Nlc3NlZC4gT3RoZXJ3aXNlLCB0aGUgYnJvd3NlclxuLy8gd291bGQgdGhyb3cgYW4gZXJyb3IgZm9yIHNlY3VyaXR5IHJlYXNvbnMgKHlvdSBkb24ndCB3YW50IGEgcmFuZG9tIHdlYnNpdGUgYmVpbmcgYWJsZSB0byBhY2Nlc3Ncbi8vIGNvbmZpZGVudGlhbCBkYXRhIGZyb20gYSB3ZWJzaXRlIHlvdSBoYXZlIGxvZ2dlZCBpbnRvKS5cblxuLyoqXG4gKiBGZXRjaGVzIGRhdGEgZnJvbSBQQ1IgYW5kIGlmIHRoZSB1c2VyIGlzIGxvZ2dlZCBpbiBwYXJzZXMgYW5kIGRpc3BsYXlzIGl0XG4gKiBAcGFyYW0gb3ZlcnJpZGUgV2hldGhlciB0byBmb3JjZSBhbiB1cGRhdGUgZXZlbiB0aGVyZSB3YXMgb25lIHJlY2VudGx5XG4gKiBAcGFyYW0gZGF0YSAgT3B0aW9uYWwgZGF0YSB0byBiZSBwb3N0ZWQgdG8gUENSXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmZXRjaChvdmVycmlkZTogYm9vbGVhbiA9IGZhbHNlLCBkYXRhPzogc3RyaW5nLCBvbnN1Y2Nlc3M6ICgpID0+IHZvaWQgPSBkaXNwbGF5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ubG9naW4/OiAoKSA9PiB2b2lkKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKCFvdmVycmlkZSAmJiBEYXRlLm5vdygpIC0gbGFzdFVwZGF0ZSA8IE9ORV9NSU5VVEVfTVMpIHJldHVyblxuICAgIGxhc3RVcGRhdGUgPSBEYXRlLm5vdygpXG5cbiAgICAvLyBSZXF1ZXN0IGEgbmV3IG1vbnRoIGlmIG5lZWRlZFxuICAgIGNvbnN0IG1vbnRoT2Zmc2V0ID0gZ2V0Q2FsRGF0ZU9mZnNldCgpXG4gICAgaWYgKG1vbnRoT2Zmc2V0ICE9PSAwKSB7XG4gICAgICAgIGNvbnN0IHRvZGF5ID0gbmV3IERhdGUoKVxuICAgICAgICB0b2RheS5zZXRNb250aCh0b2RheS5nZXRNb250aCgpICsgZ2V0Q2FsRGF0ZU9mZnNldCgpKVxuICAgICAgICAvLyBSZW1lbWJlciBtb250aHMgYXJlIHplcm8taW5kZXhlZFxuICAgICAgICBjb25zdCBkYXRlQXJyYXkgPSBbdG9kYXkuZ2V0RnVsbFllYXIoKSwgdG9kYXkuZ2V0TW9udGgoKSArIDEsIDFdXG4gICAgICAgIGNvbnN0IG5ld1ZpZXdEYXRhID0ge1xuICAgICAgICAgICAgLi4udmlld0RhdGEsXG4gICAgICAgICAgICBfX0VWRU5UVEFSR0VUOiAnY3RsMDAkY3RsMDAkYmFzZUNvbnRlbnQkYmFzZUNvbnRlbnQkZmxhc2hUb3AkY3RsMDAkUmFkU2NoZWR1bGVyMSRTZWxlY3RlZERhdGVDYWxlbmRhcicsXG4gICAgICAgICAgICBfX0VWRU5UQVJHVU1FTlQ6ICdkJyxcbiAgICAgICAgICAgIGN0bDAwX2N0bDAwX2Jhc2VDb250ZW50X2Jhc2VDb250ZW50X2ZsYXNoVG9wX2N0bDAwX1JhZFNjaGVkdWxlcjFfU2VsZWN0ZWREYXRlQ2FsZW5kYXJfU0Q6XG4gICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoW2RhdGVBcnJheV0pLFxuICAgICAgICAgICAgY3RsMDBfY3RsMDBfYmFzZUNvbnRlbnRfYmFzZUNvbnRlbnRfZmxhc2hUb3BfY3RsMDBfUmFkU2NoZWR1bGVyMV9TZWxlY3RlZERhdGVDYWxlbmRhcl9BRDpcbiAgICAgICAgICAgICAgICBKU09OLnN0cmluZ2lmeShbWzE5MDAsIDEsIDFdLCBbMjA5OSwgMTIsIDMwXSwgZGF0ZUFycmF5XSksXG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcG9zdEFycmF5OiBzdHJpbmdbXSA9IFtdIC8vIEFycmF5IG9mIGRhdGEgdG8gcG9zdFxuICAgICAgICBPYmplY3QuZW50cmllcyhuZXdWaWV3RGF0YSkuZm9yRWFjaCgoW2gsIHZdKSA9PiB7XG4gICAgICAgICAgICBwb3N0QXJyYXkucHVzaChlbmNvZGVVUklDb21wb25lbnQoaCkgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQodikpXG4gICAgICAgIH0pXG4gICAgICAgIGRhdGEgPSAoZGF0YSA/IGRhdGEgKyAnJicgOiAnJykgKyBwb3N0QXJyYXkuam9pbignJicpXG4gICAgfVxuXG4gICAgY29uc3QgaGVhZGVycyA9IGRhdGEgPyBGT1JNX0hFQURFUl9PTkxZIDogdW5kZWZpbmVkXG4gICAgY29uc29sZS50aW1lKCdGZXRjaGluZyBhc3NpZ25tZW50cycpXG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmVzcCA9IGF3YWl0IHNlbmQoQVNTSUdOTUVOVFNfVVJMLCAnZG9jdW1lbnQnLCBoZWFkZXJzLCBkYXRhLCBwcm9ncmVzc0VsZW1lbnQpXG4gICAgICAgIGNvbnNvbGUudGltZUVuZCgnRmV0Y2hpbmcgYXNzaWdubWVudHMnKVxuICAgICAgICBpZiAocmVzcC5yZXNwb25zZVVSTC5pbmRleE9mKCdMb2dpbicpICE9PSAtMSkge1xuICAgICAgICAgICAgLy8gV2UgaGF2ZSB0byBsb2cgaW4gbm93XG4gICAgICAgICAgICAocmVzcC5yZXNwb25zZSBhcyBIVE1MRG9jdW1lbnQpLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdpbnB1dCcpLmZvckVhY2goKGUpID0+IHtcbiAgICAgICAgICAgICAgICBsb2dpbkhlYWRlcnNbZS5uYW1lXSA9IGUudmFsdWUgfHwgJydcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnTmVlZCB0byBsb2cgaW4nKVxuICAgICAgICAgICAgY29uc3QgdXAgPSBnZXRDb29raWUoJ3VzZXJQYXNzJykgLy8gQXR0ZW1wdHMgdG8gZ2V0IHRoZSBjb29raWUgKnVzZXJQYXNzKiwgd2hpY2ggaXMgc2V0IGlmIHRoZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gXCJSZW1lbWJlciBtZVwiIGNoZWNrYm94IGlzIGNoZWNrZWQgd2hlbiBsb2dnaW5nIGluIHRocm91Z2ggQ2hlY2tQQ1JcbiAgICAgICAgICAgIGlmICh1cCA9PT0gJycpIHtcbiAgICAgICAgICAgICAgICBpZiAobG9naW5CYWNrZ3JvdW5kKSBsb2dpbkJhY2tncm91bmQuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcbiAgICAgICAgICAgICAgICBsb2dpbkRpYWxvZy5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxuICAgICAgICAgICAgICAgIGlmIChvbmxvZ2luKSBvbmxvZ2luKClcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gQmVjYXVzZSB3ZSB3ZXJlIHJlbWVtYmVyZWQsIHdlIGNhbiBsb2cgaW4gaW1tZWRpYXRlbHkgd2l0aG91dCB3YWl0aW5nIGZvciB0aGVcbiAgICAgICAgICAgICAgICAvLyB1c2VyIHRvIGxvZyBpbiB0aHJvdWdoIHRoZSBsb2dpbiBmb3JtXG4gICAgICAgICAgICAgICAgZG9sb2dpbih3aW5kb3cuYXRvYih1cCkuc3BsaXQoJzonKSBhcyBbc3RyaW5nLCBzdHJpbmddLCBmYWxzZSwgb25zdWNjZXNzKVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gTG9nZ2VkIGluIG5vd1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0ZldGNoaW5nIGFzc2lnbm1lbnRzIHN1Y2Nlc3NmdWwnKVxuICAgICAgICAgICAgY29uc3QgdCA9IERhdGUubm93KClcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5sYXN0VXBkYXRlID0gdFxuICAgICAgICAgICAgaWYgKGxhc3RVcGRhdGVFbCkgbGFzdFVwZGF0ZUVsLmlubmVySFRNTCA9IGZvcm1hdFVwZGF0ZSh0KVxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBwYXJzZShyZXNwLnJlc3BvbnNlKVxuICAgICAgICAgICAgICAgIG9uc3VjY2VzcygpXG4gICAgICAgICAgICAgICAgaWYgKG1vbnRoT2Zmc2V0ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZVdyaXRlKCdkYXRhJywgZ2V0RGF0YSgpKSAvLyBTdG9yZSBmb3Igb2ZmbGluZSB1c2VcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKVxuICAgICAgICAgICAgICAgIGRpc3BsYXlFcnJvcihlcnJvcilcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdDb3VsZCBub3QgZmV0Y2ggYXNzaWdubWVudHM7IFlvdSBhcmUgcHJvYmFibHkgb2ZmbGluZS4gSGVyZVxcJ3MgdGhlIGVycm9yOicsIGVycm9yKVxuICAgICAgICBzbmFja2JhcignQ291bGQgbm90IGZldGNoIHlvdXIgYXNzaWdubWVudHMnLCAnUmV0cnknLCAoKSA9PiBmZXRjaCh0cnVlKSlcbiAgICB9XG59XG5cbi8qKlxuICogTG9ncyB0aGUgdXNlciBpbnRvIFBDUlxuICogQHBhcmFtIHZhbCAgIEFuIG9wdGlvbmFsIGxlbmd0aC0yIGFycmF5IG9mIHRoZSBmb3JtIFt1c2VybmFtZSwgcGFzc3dvcmRdIHRvIHVzZSB0aGUgdXNlciBpbiB3aXRoLlxuICogICAgICAgICAgICAgIElmIHRoaXMgYXJyYXkgaXMgbm90IGdpdmVuIHRoZSBsb2dpbiBkaWFsb2cgaW5wdXRzIHdpbGwgYmUgdXNlZC5cbiAqIEBwYXJhbSBzdWJtaXRFdnQgV2hldGhlciB0byBvdmVycmlkZSB0aGUgdXNlcm5hbWUgYW5kIHBhc3N3b3JkIHN1cHBsZWlkIGluIHZhbCB3aXRoIHRoZSB2YWx1ZXMgb2YgdGhlIGlucHV0IGVsZW1lbnRzXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkb2xvZ2luKHZhbD86IFtzdHJpbmcsIHN0cmluZ118bnVsbCwgc3VibWl0RXZ0OiBib29sZWFuID0gZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbnN1Y2Nlc3M6ICgpID0+IHZvaWQgPSBkaXNwbGF5KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgbG9naW5EaWFsb2cuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgaWYgKGxvZ2luQmFja2dyb3VuZCkgbG9naW5CYWNrZ3JvdW5kLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcbiAgICB9LCAzNTApXG5cbiAgICBjb25zdCBwb3N0QXJyYXk6IHN0cmluZ1tdID0gW10gLy8gQXJyYXkgb2YgZGF0YSB0byBwb3N0XG4gICAgbG9jYWxTdG9yYWdlV3JpdGUoJ3VzZXJuYW1lJywgdmFsICYmICFzdWJtaXRFdnQgPyB2YWxbMF0gOiB1c2VybmFtZUVsLnZhbHVlKVxuICAgIHVwZGF0ZUF2YXRhcigpXG4gICAgT2JqZWN0LmtleXMobG9naW5IZWFkZXJzKS5mb3JFYWNoKChoKSA9PiAge1xuICAgICAgICAvLyBMb29wIHRocm91Z2ggdGhlIGlucHV0IGVsZW1lbnRzIGNvbnRhaW5lZCBpbiB0aGUgbG9naW4gcGFnZS4gQXMgbWVudGlvbmVkIGJlZm9yZSwgdGhleVxuICAgICAgICAvLyB3aWxsIGJlIHNlbnQgdG8gUENSIHRvIGxvZyBpbi5cbiAgICAgICAgaWYgKGgudG9Mb3dlckNhc2UoKS5pbmRleE9mKCd1c2VyJykgIT09IC0xKSB7XG4gICAgICAgICAgICBsb2dpbkhlYWRlcnNbaF0gPSB2YWwgJiYgIXN1Ym1pdEV2dCA/IHZhbFswXSA6IHVzZXJuYW1lRWwudmFsdWVcbiAgICAgICAgfVxuICAgICAgICBpZiAoaC50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ3Bhc3MnKSAhPT0gLTEpIHtcbiAgICAgICAgICAgIGxvZ2luSGVhZGVyc1toXSA9IHZhbCAmJiAhc3VibWl0RXZ0ID8gdmFsWzFdIDogcGFzc3dvcmRFbC52YWx1ZVxuICAgICAgICB9XG4gICAgICAgIHBvc3RBcnJheS5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChoKSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudChsb2dpbkhlYWRlcnNbaF0pKVxuICAgIH0pXG5cbiAgICAvLyBOb3cgc2VuZCB0aGUgbG9naW4gcmVxdWVzdCB0byBQQ1JcbiAgICBjb25zb2xlLnRpbWUoJ0xvZ2dpbmcgaW4nKVxuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJlc3AgPSBhd2FpdCBzZW5kKExPR0lOX1VSTCwgJ2RvY3VtZW50JywgRk9STV9IRUFERVJfT05MWSwgcG9zdEFycmF5LmpvaW4oJyYnKSwgcHJvZ3Jlc3NFbGVtZW50KVxuICAgICAgICBjb25zb2xlLnRpbWVFbmQoJ0xvZ2dpbmcgaW4nKVxuICAgICAgICBpZiAocmVzcC5yZXNwb25zZVVSTC5pbmRleE9mKCdMb2dpbicpICE9PSAtMSkge1xuICAgICAgICAvLyBJZiBQQ1Igc3RpbGwgd2FudHMgdXMgdG8gbG9nIGluLCB0aGVuIHRoZSB1c2VybmFtZSBvciBwYXNzd29yZCBlbnRlcmVkIHdlcmUgaW5jb3JyZWN0LlxuICAgICAgICAgICAgaW5jb3JyZWN0TG9naW5FbC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xuICAgICAgICAgICAgcGFzc3dvcmRFbC52YWx1ZSA9ICcnXG5cbiAgICAgICAgICAgIGxvZ2luRGlhbG9nLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG4gICAgICAgICAgICBpZiAobG9naW5CYWNrZ3JvdW5kKSBsb2dpbkJhY2tncm91bmQuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIE90aGVyd2lzZSwgd2UgYXJlIGxvZ2dlZCBpblxuICAgICAgICAgICAgaWYgKHJlbWVtYmVyQ2hlY2suY2hlY2tlZCkgeyAvLyBJcyB0aGUgXCJyZW1lbWJlciBtZVwiIGNoZWNrYm94IGNoZWNrZWQ/XG4gICAgICAgICAgICAgICAgLy8gU2V0IGEgY29va2llIHdpdGggdGhlIHVzZXJuYW1lIGFuZCBwYXNzd29yZCBzbyB3ZSBjYW4gbG9nIGluIGF1dG9tYXRpY2FsbHkgaW4gdGhlXG4gICAgICAgICAgICAgICAgLy8gZnV0dXJlIHdpdGhvdXQgaGF2aW5nIHRvIHByb21wdCBmb3IgYSB1c2VybmFtZSBhbmQgcGFzc3dvcmQgYWdhaW5cbiAgICAgICAgICAgICAgICBzZXRDb29raWUoJ3VzZXJQYXNzJywgd2luZG93LmJ0b2EodXNlcm5hbWVFbC52YWx1ZSArICc6JyArIHBhc3N3b3JkRWwudmFsdWUpLCAxNClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGxvYWRpbmdCYXIuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiXG4gICAgICAgICAgICBjb25zdCB0ID0gRGF0ZS5ub3coKVxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLmxhc3RVcGRhdGUgPSB0XG4gICAgICAgICAgICBpZiAobGFzdFVwZGF0ZUVsKSBsYXN0VXBkYXRlRWwuaW5uZXJIVE1MID0gZm9ybWF0VXBkYXRlKHQpXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHBhcnNlKHJlc3AucmVzcG9uc2UpIC8vIFBhcnNlIHRoZSBkYXRhIFBDUiBoYXMgcmVwbGllZCB3aXRoXG4gICAgICAgICAgICAgICAgb25zdWNjZXNzKClcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2VXcml0ZSgnZGF0YScsIGdldERhdGEoKSkgLy8gU3RvcmUgZm9yIG9mZmxpbmUgdXNlXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZSlcbiAgICAgICAgICAgICAgICBkaXNwbGF5RXJyb3IoZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICBjb25zb2xlLmxvZygnQ291bGQgbm90IGxvZyBpbiB0byBQQ1IuIEVpdGhlciB5b3VyIG5ldHdvcmsgY29ubmVjdGlvbiB3YXMgbG9zdCBkdXJpbmcgeW91ciB2aXNpdCAnICtcbiAgICAgICAgICAgICAgICAgICAgICdvciBQQ1IgaXMganVzdCBub3Qgd29ya2luZy4gSGVyZVxcJ3MgdGhlIGVycm9yOicsIGVycm9yKVxuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldERhdGEoKTogSUFwcGxpY2F0aW9uRGF0YXx1bmRlZmluZWQge1xuICAgIHJldHVybiAod2luZG93IGFzIGFueSkuZGF0YVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2xhc3NlcygpOiBzdHJpbmdbXSB7XG4gICAgY29uc3QgZGF0YSA9IGdldERhdGEoKVxuICAgIGlmICghZGF0YSkgcmV0dXJuIFtdXG4gICAgcmV0dXJuIGRhdGEuY2xhc3Nlc1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0RGF0YShkYXRhOiBJQXBwbGljYXRpb25EYXRhKTogdm9pZCB7XG4gICAgKHdpbmRvdyBhcyBhbnkpLmRhdGEgPSBkYXRhXG59XG5cbi8vIEluIFBDUidzIGludGVyZmFjZSwgeW91IGNhbiBjbGljayBhIGRhdGUgaW4gbW9udGggb3Igd2VlayB2aWV3IHRvIHNlZSBpdCBpbiBkYXkgdmlldy5cbi8vIFRoZXJlZm9yZSwgdGhlIEhUTUwgZWxlbWVudCB0aGF0IHNob3dzIHRoZSBkYXRlIHRoYXQgeW91IGNhbiBjbGljayBvbiBoYXMgYSBoeXBlcmxpbmsgdGhhdCBsb29rcyBsaWtlIGAjMjAxNS0wNC0yNmAuXG4vLyBUaGUgZnVuY3Rpb24gYmVsb3cgd2lsbCBwYXJzZSB0aGF0IFN0cmluZyBhbmQgcmV0dXJuIGEgRGF0ZSB0aW1lc3RhbXBcbmZ1bmN0aW9uIHBhcnNlRGF0ZUhhc2goZWxlbWVudDogSFRNTEFuY2hvckVsZW1lbnQpOiBudW1iZXIge1xuICAgIGNvbnN0IFt5ZWFyLCBtb250aCwgZGF5XSA9IGVsZW1lbnQuaGFzaC5zdWJzdHJpbmcoMSkuc3BsaXQoJy0nKS5tYXAoTnVtYmVyKVxuICAgIHJldHVybiAobmV3IERhdGUoeWVhciwgbW9udGggLSAxLCBkYXkpKS5nZXRUaW1lKClcbn1cblxuLy8gVGhlICphdHRhY2htZW50aWZ5KiBmdW5jdGlvbiBwYXJzZXMgdGhlIGJvZHkgb2YgYW4gYXNzaWdubWVudCAoKnRleHQqKSBhbmQgcmV0dXJucyB0aGUgYXNzaWdubWVudCdzIGF0dGFjaG1lbnRzLlxuLy8gU2lkZSBlZmZlY3Q6IHRoZXNlIGF0dGFjaG1lbnRzIGFyZSByZW1vdmVkXG5mdW5jdGlvbiBhdHRhY2htZW50aWZ5KGVsZW1lbnQ6IEhUTUxFbGVtZW50KTogQXR0YWNobWVudEFycmF5W10ge1xuICAgIGNvbnN0IGF0dGFjaG1lbnRzOiBBdHRhY2htZW50QXJyYXlbXSA9IFtdXG5cbiAgICAvLyBHZXQgYWxsIGxpbmtzXG4gICAgY29uc3QgYXMgPSBBcnJheS5mcm9tKGVsZW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2EnKSlcbiAgICBhcy5mb3JFYWNoKChhKSA9PiB7XG4gICAgICAgIGlmIChhLmlkLmluY2x1ZGVzKCdBdHRhY2htZW50JykpIHtcbiAgICAgICAgICAgIGF0dGFjaG1lbnRzLnB1c2goW1xuICAgICAgICAgICAgICAgIGEuaW5uZXJIVE1MLFxuICAgICAgICAgICAgICAgIGEuc2VhcmNoICsgYS5oYXNoXG4gICAgICAgICAgICBdKVxuICAgICAgICAgICAgYS5yZW1vdmUoKVxuICAgICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gYXR0YWNobWVudHNcbn1cblxuY29uc3QgVVJMX1JFR0VYID0gbmV3IFJlZ0V4cChgKFxcXG5odHRwcz86XFxcXC9cXFxcL1xcXG5bLUEtWjAtOSsmQCNcXFxcLyU/PX5ffCE6LC47XSpcXFxuWy1BLVowLTkrJkAjXFxcXC8lPX5ffF0rXFxcbilgLCAnaWcnXG4pXG5cbi8vIFRoaXMgZnVuY3Rpb24gcmVwbGFjZXMgdGV4dCB0aGF0IHJlcHJlc2VudHMgYSBoeXBlcmxpbmsgd2l0aCBhIGZ1bmN0aW9uYWwgaHlwZXJsaW5rIGJ5IHVzaW5nXG4vLyBqYXZhc2NyaXB0J3MgcmVwbGFjZSBmdW5jdGlvbiB3aXRoIGEgcmVndWxhciBleHByZXNzaW9uIGlmIHRoZSB0ZXh0IGFscmVhZHkgaXNuJ3QgcGFydCBvZiBhXG4vLyBoeXBlcmxpbmsuXG5mdW5jdGlvbiB1cmxpZnkodGV4dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGV4dC5yZXBsYWNlKFVSTF9SRUdFWCwgKHN0ciwgc3RyMiwgb2Zmc2V0KSA9PiB7IC8vIEZ1bmN0aW9uIHRvIHJlcGxhY2UgbWF0Y2hlc1xuICAgICAgICBpZiAoL2hyZWZcXHMqPVxccyouLy50ZXN0KHRleHQuc3Vic3RyaW5nKG9mZnNldCAtIDEwLCBvZmZzZXQpKSB8fFxuICAgICAgICAgICAgL29yaWdpbmFscGF0aFxccyo9XFxzKi4vLnRlc3QodGV4dC5zdWJzdHJpbmcob2Zmc2V0IC0gMjAsIG9mZnNldCkpXG4gICAgICAgICkge1xuICAgICAgICAgICAgcmV0dXJuIHN0clxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGA8YSBocmVmPVwiJHtzdHJ9XCI+JHtzdHJ9PC9hPmBcbiAgICAgICAgfVxuICAgIH0pXG59XG5cbi8vIEFsc28sIFBDUlwicyBpbnRlcmZhY2UgdXNlcyBhIHN5c3RlbSBvZiBJRHMgdG8gaWRlbnRpZnkgZGlmZmVyZW50IGVsZW1lbnRzLiBGb3IgZXhhbXBsZSwgdGhlIElEIG9mXG4vLyBvbmUgb2YgdGhlIGJveGVzIHNob3dpbmcgdGhlIG5hbWUgb2YgYW4gYXNzaWdubWVudCBjb3VsZCBiZVxuLy8gYGN0bDAwX2N0bDAwX2Jhc2VDb250ZW50X2Jhc2VDb250ZW50X2ZsYXNoVG9wX2N0bDAwX1JhZFNjaGVkdWxlcjFfOTVfMGAuIFRoZSBmdW5jdGlvbiBiZWxvdyB3aWxsXG4vLyByZXR1cm4gdGhlIGZpcnN0IEhUTUwgZWxlbWVudCB3aG9zZSBJRCBjb250YWlucyBhIHNwZWNpZmllZCBTdHJpbmcgKCppZCopIGFuZCBjb250YWluaW5nIGFcbi8vIHNwZWNpZmllZCB0YWcgKCp0YWcqKS5cbmZ1bmN0aW9uIGZpbmRJZChlbGVtZW50OiBIVE1MRWxlbWVudHxIVE1MRG9jdW1lbnQsIHRhZzogc3RyaW5nLCBpZDogc3RyaW5nKTogSFRNTEVsZW1lbnQge1xuICAgIGNvbnN0IGVsID0gWy4uLmVsZW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUodGFnKV0uZmluZCgoZSkgPT4gZS5pZC5pbmNsdWRlcyhpZCkpXG4gICAgaWYgKCFlbCkgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCBlbGVtZW50IHdpdGggdGFnICR7dGFnfSBhbmQgaWQgJHtpZH0gaW4gJHtlbGVtZW50fWApXG4gICAgcmV0dXJuIGVsIGFzIEhUTUxFbGVtZW50XG59XG5cbmZ1bmN0aW9uIHBhcnNlQXNzaWdubWVudFR5cGUodHlwZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdHlwZS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoJyYgcXVpenplcycsICcnKS5yZXBsYWNlKCd0ZXN0cycsICd0ZXN0Jylcbn1cblxuZnVuY3Rpb24gcGFyc2VBc3NpZ25tZW50QmFzZVR5cGUodHlwZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdHlwZS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoJyYgcXVpenplcycsICcnKS5yZXBsYWNlKC9cXHMvZywgJycpLnJlcGxhY2UoJ3F1aXp6ZXMnLCAndGVzdCcpXG59XG5cbmZ1bmN0aW9uIHBhcnNlQXNzaWdubWVudChjYTogSFRNTEVsZW1lbnQpOiBJQXNzaWdubWVudCB7XG4gICAgY29uc3QgZGF0YSA9IGdldERhdGEoKVxuICAgIGlmICghZGF0YSkgdGhyb3cgbmV3IEVycm9yKCdEYXRhIGRpY3Rpb25hcnkgbm90IHNldCB1cCcpXG5cbiAgICAvLyBUaGUgc3RhcnRpbmcgZGF0ZSBhbmQgZW5kaW5nIGRhdGUgb2YgdGhlIGFzc2lnbm1lbnQgYXJlIHBhcnNlZCBmaXJzdFxuICAgIGNvbnN0IHJhbmdlID0gZmluZElkKGNhLCAnc3BhbicsICdTdGFydGluZ09uJykuaW5uZXJIVE1MLnNwbGl0KCcgLSAnKVxuICAgIGNvbnN0IGFzc2lnbm1lbnRTdGFydCA9IHRvRGF0ZU51bShEYXRlLnBhcnNlKHJhbmdlWzBdKSlcbiAgICBjb25zdCBhc3NpZ25tZW50RW5kID0gKHJhbmdlWzFdICE9IG51bGwpID8gdG9EYXRlTnVtKERhdGUucGFyc2UocmFuZ2VbMV0pKSA6IGFzc2lnbm1lbnRTdGFydFxuXG4gICAgLy8gVGhlbiwgdGhlIG5hbWUgb2YgdGhlIGFzc2lnbm1lbnQgaXMgcGFyc2VkXG4gICAgY29uc3QgdCA9IGZpbmRJZChjYSwgJ3NwYW4nLCAnbGJsVGl0bGUnKVxuICAgIGxldCB0aXRsZSA9IHQuaW5uZXJIVE1MXG5cbiAgICAvLyBUaGUgYWN0dWFsIGJvZHkgb2YgdGhlIGFzc2lnbm1lbnQgYW5kIGl0cyBhdHRhY2htZW50cyBhcmUgcGFyc2VkIG5leHRcbiAgICBjb25zdCBiID0gXyQoXyQodC5wYXJlbnROb2RlKS5wYXJlbnROb2RlKSBhcyBIVE1MRWxlbWVudFxuICAgIFsuLi5iLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdkaXYnKV0uc2xpY2UoMCwgMikuZm9yRWFjaCgoZGl2KSA9PiBkaXYucmVtb3ZlKCkpXG5cbiAgICBjb25zdCBhcCA9IGF0dGFjaG1lbnRpZnkoYikgLy8gU2VwYXJhdGVzIGF0dGFjaG1lbnRzIGZyb20gdGhlIGJvZHlcblxuICAgIC8vIFRoZSBsYXN0IFJlcGxhY2UgcmVtb3ZlcyBsZWFkaW5nIGFuZCB0cmFpbGluZyBuZXdsaW5lc1xuICAgIGNvbnN0IGFzc2lnbm1lbnRCb2R5ID0gdXJsaWZ5KGIuaW5uZXJIVE1MKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9eKD86XFxzKjxiclxccypcXC8/PikqLywgJycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLyg/Olxccyo8YnJcXHMqXFwvPz4pKlxccyokLywgJycpLnRyaW0oKVxuXG4gICAgLy8gRmluYWxseSwgd2Ugc2VwYXJhdGUgdGhlIGNsYXNzIG5hbWUgYW5kIHR5cGUgKGhvbWV3b3JrLCBjbGFzc3dvcmssIG9yIHByb2plY3RzKSBmcm9tIHRoZSB0aXRsZSBvZiB0aGUgYXNzaWdubWVudFxuICAgIGNvbnN0IG1hdGNoZWRUaXRsZSA9IHRpdGxlLm1hdGNoKC9cXCgoW14pXSpcXCkqKVxcKSQvKVxuICAgIGlmICgobWF0Y2hlZFRpdGxlID09IG51bGwpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IHBhcnNlIGFzc2lnbm1lbnQgdGl0bGUgXFxcIiR7dGl0bGV9XFxcImApXG4gICAgfVxuICAgIGNvbnN0IGFzc2lnbm1lbnRUeXBlID0gbWF0Y2hlZFRpdGxlWzFdXG4gICAgY29uc3QgYXNzaWdubWVudEJhc2VUeXBlID0gcGFyc2VBc3NpZ25tZW50QmFzZVR5cGUoY2EudGl0bGUuc3Vic3RyaW5nKDAsIGNhLnRpdGxlLmluZGV4T2YoJ1xcbicpKSlcbiAgICBsZXQgYXNzaWdubWVudENsYXNzSW5kZXggPSBudWxsXG4gICAgZGF0YS5jbGFzc2VzLnNvbWUoKGMsIHBvcykgPT4ge1xuICAgICAgICBpZiAodGl0bGUuaW5kZXhPZihjKSAhPT0gLTEpIHtcbiAgICAgICAgICAgIGFzc2lnbm1lbnRDbGFzc0luZGV4ID0gcG9zXG4gICAgICAgICAgICB0aXRsZSA9IHRpdGxlLnJlcGxhY2UoYywgJycpXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgIH0pXG5cbiAgICBpZiAoYXNzaWdubWVudENsYXNzSW5kZXggPT09IG51bGwgfHwgYXNzaWdubWVudENsYXNzSW5kZXggPT09IC0xKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGZpbmQgY2xhc3MgaW4gdGl0bGUgJHt0aXRsZX0gKGNsYXNzZXMgYXJlICR7ZGF0YS5jbGFzc2VzfWApXG4gICAgfVxuXG4gICAgY29uc3QgYXNzaWdubWVudFRpdGxlID0gdGl0bGUuc3Vic3RyaW5nKHRpdGxlLmluZGV4T2YoJzogJykgKyAyKS5yZXBsYWNlKC9cXChbXlxcKFxcKV0qXFwpJC8sICcnKS50cmltKClcblxuICAgIC8vIFRvIG1ha2Ugc3VyZSB0aGVyZSBhcmUgbm8gcmVwZWF0cywgdGhlIHRpdGxlIG9mIHRoZSBhc3NpZ25tZW50IChvbmx5IGxldHRlcnMpIGFuZCBpdHMgc3RhcnQgJlxuICAgIC8vIGVuZCBkYXRlIGFyZSBjb21iaW5lZCB0byBnaXZlIGl0IGEgdW5pcXVlIGlkZW50aWZpZXIuXG4gICAgY29uc3QgYXNzaWdubWVudElkID0gYXNzaWdubWVudFRpdGxlLnJlcGxhY2UoL1teXFx3XSovZywgJycpICsgKGFzc2lnbm1lbnRTdGFydCArIGFzc2lnbm1lbnRFbmQpXG5cbiAgICByZXR1cm4ge1xuICAgICAgICBzdGFydDogYXNzaWdubWVudFN0YXJ0LFxuICAgICAgICBlbmQ6IGFzc2lnbm1lbnRFbmQsXG4gICAgICAgIGF0dGFjaG1lbnRzOiBhcCxcbiAgICAgICAgYm9keTogYXNzaWdubWVudEJvZHksXG4gICAgICAgIHR5cGU6IGFzc2lnbm1lbnRUeXBlLFxuICAgICAgICBiYXNlVHlwZTogYXNzaWdubWVudEJhc2VUeXBlLFxuICAgICAgICBjbGFzczogYXNzaWdubWVudENsYXNzSW5kZXgsXG4gICAgICAgIHRpdGxlOiBhc3NpZ25tZW50VGl0bGUsXG4gICAgICAgIGlkOiBhc3NpZ25tZW50SWRcbiAgICB9XG59XG5cbi8vIFRoZSBmdW5jdGlvbiBiZWxvdyB3aWxsIHBhcnNlIHRoZSBkYXRhIGdpdmVuIGJ5IFBDUiBhbmQgY29udmVydCBpdCBpbnRvIGFuIG9iamVjdC4gSWYgeW91IG9wZW4gdXBcbi8vIHRoZSBkZXZlbG9wZXIgY29uc29sZSBvbiBDaGVja1BDUiBhbmQgdHlwZSBpbiBgZGF0YWAsIHlvdSBjYW4gc2VlIHRoZSBhcnJheSBjb250YWluaW5nIGFsbCBvZlxuLy8geW91ciBhc3NpZ25tZW50cy5cbmZ1bmN0aW9uIHBhcnNlKGRvYzogSFRNTERvY3VtZW50KTogdm9pZCB7XG4gICAgY29uc29sZS50aW1lKCdIYW5kbGluZyBkYXRhJykgLy8gVG8gdGltZSBob3cgbG9uZyBpdCB0YWtlcyB0byBwYXJzZSB0aGUgYXNzaWdubWVudHNcbiAgICBjb25zdCBoYW5kbGVkRGF0YVNob3J0OiBzdHJpbmdbXSA9IFtdIC8vIEFycmF5IHVzZWQgdG8gbWFrZSBzdXJlIHdlIGRvblwidCBwYXJzZSB0aGUgc2FtZSBhc3NpZ25tZW50IHR3aWNlLlxuICAgIGNvbnN0IGRhdGE6IElBcHBsaWNhdGlvbkRhdGEgPSB7XG4gICAgICAgIGNsYXNzZXM6IFtdLFxuICAgICAgICBhc3NpZ25tZW50czogW10sXG4gICAgICAgIG1vbnRoVmlldzogKF8kKGRvYy5xdWVyeVNlbGVjdG9yKCcucnNIZWFkZXJNb250aCcpKS5wYXJlbnROb2RlIGFzIEhUTUxFbGVtZW50KS5jbGFzc0xpc3QuY29udGFpbnMoJ3JzU2VsZWN0ZWQnKVxuICAgIH0gLy8gUmVzZXQgdGhlIGFycmF5IGluIHdoaWNoIGFsbCBvZiB5b3VyIGFzc2lnbm1lbnRzIGFyZSBzdG9yZWQgaW4uXG4gICAgc2V0RGF0YShkYXRhKVxuXG4gICAgZG9jLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0Om5vdChbdHlwZT1cInN1Ym1pdFwiXSknKS5mb3JFYWNoKChlKSA9PiB7XG4gICAgICAgIHZpZXdEYXRhWyhlIGFzIEhUTUxJbnB1dEVsZW1lbnQpLm5hbWVdID0gKGUgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWUgfHwgJydcbiAgICB9KVxuXG4gICAgLy8gTm93LCB0aGUgY2xhc3NlcyB5b3UgdGFrZSBhcmUgcGFyc2VkICh0aGVzZSBhcmUgdGhlIGNoZWNrYm94ZXMgeW91IHNlZSB1cCB0b3Agd2hlbiBsb29raW5nIGF0IFBDUikuXG4gICAgY29uc3QgY2xhc3NlcyA9IGZpbmRJZChkb2MsICd0YWJsZScsICdjYkNsYXNzZXMnKS5nZXRFbGVtZW50c0J5VGFnTmFtZSgnbGFiZWwnKVxuICAgIGNsYXNzZXMuZm9yRWFjaCgoYykgPT4ge1xuICAgICAgICBkYXRhLmNsYXNzZXMucHVzaChjLmlubmVySFRNTClcbiAgICB9KVxuXG4gICAgY29uc3QgYXNzaWdubWVudHMgPSBkb2MuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgncnNBcHQgcnNBcHRTaW1wbGUnKVxuICAgIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwoYXNzaWdubWVudHMsIChhc3NpZ25tZW50RWw6IEhUTUxFbGVtZW50KSA9PiB7XG4gICAgICAgIGNvbnN0IGFzc2lnbm1lbnQgPSBwYXJzZUFzc2lnbm1lbnQoYXNzaWdubWVudEVsKVxuICAgICAgICBpZiAoaGFuZGxlZERhdGFTaG9ydC5pbmRleE9mKGFzc2lnbm1lbnQuaWQpID09PSAtMSkgeyAvLyBNYWtlIHN1cmUgd2UgaGF2ZW4ndCBhbHJlYWR5IHBhcnNlZCB0aGUgYXNzaWdubWVudFxuICAgICAgICAgICAgaGFuZGxlZERhdGFTaG9ydC5wdXNoKGFzc2lnbm1lbnQuaWQpXG4gICAgICAgICAgICBkYXRhLmFzc2lnbm1lbnRzLnB1c2goYXNzaWdubWVudClcbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICBjb25zb2xlLnRpbWVFbmQoJ0hhbmRsaW5nIGRhdGEnKVxuXG4gICAgLy8gTm93IGFsbG93IHRoZSB2aWV3IHRvIGJlIHN3aXRjaGVkXG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdsb2FkZWQnKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdXJsRm9yQXR0YWNobWVudChzZWFyY2g6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIEFUVEFDSE1FTlRTX1VSTCArIHNlYXJjaFxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QXR0YWNobWVudE1pbWVUeXBlKHNlYXJjaDogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBjb25zdCByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuICAgICAgICByZXEub3BlbignSEVBRCcsIHVybEZvckF0dGFjaG1lbnQoc2VhcmNoKSlcbiAgICAgICAgcmVxLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgICAgIGlmIChyZXEuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICAgICAgICBjb25zdCB0eXBlID0gcmVxLmdldFJlc3BvbnNlSGVhZGVyKCdDb250ZW50LVR5cGUnKVxuICAgICAgICAgICAgICAgIGlmICh0eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUodHlwZSlcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKCdDb250ZW50IHR5cGUgaXMgbnVsbCcpKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXEuc2VuZCgpXG4gICAgfSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsYXNzQnlJZChpZDogbnVtYmVyfG51bGx8dW5kZWZpbmVkKTogc3RyaW5nIHtcbiAgICByZXR1cm4gKGlkID8gZ2V0Q2xhc3NlcygpW2lkXSA6IG51bGwpIHx8ICdVbmtub3duIGNsYXNzJ1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3dpdGNoVmlld3MoKTogdm9pZCB7XG4gICAgaWYgKE9iamVjdC5rZXlzKHZpZXdEYXRhKS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGVsZW1CeUlkKCdzaWRlQmFja2dyb3VuZCcpLmNsaWNrKClcbiAgICAgICAgY29uc3QgbmV3Vmlld0RhdGEgPSB7XG4gICAgICAgICAgICAuLi52aWV3RGF0YSxcbiAgICAgICAgICAgIF9fRVZFTlRUQVJHRVQ6ICdjdGwwMCRjdGwwMCRiYXNlQ29udGVudCRiYXNlQ29udGVudCRmbGFzaFRvcCRjdGwwMCRSYWRTY2hlZHVsZXIxJyxcbiAgICAgICAgICAgIF9fRVZFTlRBUkdVTUVOVDogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgIENvbW1hbmQ6IGBTd2l0Y2hUbyR7ZG9jdW1lbnQuYm9keS5nZXRBdHRyaWJ1dGUoJ2RhdGEtcGNydmlldycpID09PSAnbW9udGgnID8gJ1dlZWsnIDogJ01vbnRoJ31WaWV3YFxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBjdGwwMF9jdGwwMF9iYXNlQ29udGVudF9iYXNlQ29udGVudF9mbGFzaFRvcF9jdGwwMF9SYWRTY2hlZHVsZXIxX0NsaWVudFN0YXRlOlxuICAgICAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHtzY3JvbGxUb3A6IDAsIHNjcm9sbExlZnQ6IDAsIGlzRGlydHk6IGZhbHNlfSksXG4gICAgICAgICAgICBjdGwwMF9jdGwwMF9SYWRTY3JpcHRNYW5hZ2VyMV9UU006ICc7O1N5c3RlbS5XZWIuRXh0ZW5zaW9ucywgVmVyc2lvbj00LjAuMC4wLCBDdWx0dXJlPW5ldXRyYWwsICcgK1xuICAgICAgICAgICAgICAgICdQdWJsaWNLZXlUb2tlbj0zMWJmMzg1NmFkMzY0ZTM1OmVuLVVTOmQyODU2OGQzLWU1M2UtNDcwNi05MjhmLTM3NjU5MTJiNjZjYTplYTU5N2Q0YjpiMjUzNzhkMidcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwb3N0QXJyYXk6IHN0cmluZ1tdID0gW10gLy8gQXJyYXkgb2YgZGF0YSB0byBwb3N0XG4gICAgICAgIE9iamVjdC5lbnRyaWVzKG5ld1ZpZXdEYXRhKS5mb3JFYWNoKChbaCwgdl0pID0+IHtcbiAgICAgICAgICAgIHBvc3RBcnJheS5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChoKSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudCh2KSlcbiAgICAgICAgfSlcbiAgICAgICAgemVyb0RhdGVPZmZzZXRzKClcbiAgICAgICAgZmV0Y2godHJ1ZSwgcG9zdEFycmF5LmpvaW4oJyYnKSlcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsb2dvdXQoKTogdm9pZCB7XG4gICAgaWYgKE9iamVjdC5rZXlzKHZpZXdEYXRhKS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGRlbGV0ZUNvb2tpZSgndXNlclBhc3MnKVxuICAgICAgICBlbGVtQnlJZCgnc2lkZUJhY2tncm91bmQnKS5jbGljaygpXG4gICAgICAgIHZpZXdEYXRhLl9fRVZFTlRUQVJHRVQgPSAnY3RsMDAkY3RsMDAkYmFzZUNvbnRlbnQkTG9nb3V0Q29udHJvbDEkTG9naW5TdGF0dXMxJGN0bDAwJ1xuICAgICAgICB2aWV3RGF0YS5fX0VWRU5UQVJHVU1FTlQgPSAnJ1xuICAgICAgICB2aWV3RGF0YS5jdGwwMF9jdGwwMF9iYXNlQ29udGVudF9iYXNlQ29udGVudF9mbGFzaFRvcF9jdGwwMF9SYWRTY2hlZHVsZXIxX0NsaWVudFN0YXRlID1cbiAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHtzY3JvbGxUb3A6IDAsIHNjcm9sbExlZnQ6IDAsIGlzRGlydHk6IGZhbHNlfSlcbiAgICAgICAgY29uc3QgcG9zdEFycmF5OiBzdHJpbmdbXSA9IFtdIC8vIEFycmF5IG9mIGRhdGEgdG8gcG9zdFxuICAgICAgICBPYmplY3QuZW50cmllcyh2aWV3RGF0YSkuZm9yRWFjaCgoW2gsIHZdKSA9PiB7XG4gICAgICAgICAgICBwb3N0QXJyYXkucHVzaChlbmNvZGVVUklDb21wb25lbnQoaCkgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQodikpXG4gICAgICAgIH0pXG4gICAgICAgIGZldGNoKHRydWUsIHBvc3RBcnJheS5qb2luKCcmJykpXG4gICAgICB9XG59XG4iLCJpbXBvcnQgeyBhZGRBY3Rpdml0eUVsZW1lbnQsIGNyZWF0ZUFjdGl2aXR5IH0gZnJvbSAnLi4vY29tcG9uZW50cy9hY3Rpdml0eSdcbmltcG9ydCB7IGdldENhbERhdGVPZmZzZXQgfSBmcm9tICcuLi9uYXZpZ2F0aW9uJ1xuaW1wb3J0IHsgSUFzc2lnbm1lbnQgfSBmcm9tICcuLi9wY3InXG5pbXBvcnQgeyBsb2NhbFN0b3JhZ2VSZWFkLCBsb2NhbFN0b3JhZ2VXcml0ZSB9IGZyb20gJy4uL3V0aWwnXG5cbmV4cG9ydCB0eXBlIEFjdGl2aXR5VHlwZSA9ICdkZWxldGUnIHwgJ2VkaXQnIHwgJ2FkZCdcbmV4cG9ydCB0eXBlIEFjdGl2aXR5SXRlbSA9IFtBY3Rpdml0eVR5cGUsIElBc3NpZ25tZW50LCBudW1iZXIsIHN0cmluZyB8IHVuZGVmaW5lZF1cblxuY29uc3QgQUNUSVZJVFlfU1RPUkFHRV9OQU1FID0gJ2FjdGl2aXR5J1xuXG5sZXQgYWN0aXZpdHk6IEFjdGl2aXR5SXRlbVtdID0gbG9jYWxTdG9yYWdlUmVhZChBQ1RJVklUWV9TVE9SQUdFX05BTUUpIHx8IFtdXG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRBY3Rpdml0eSh0eXBlOiBBY3Rpdml0eVR5cGUsIGFzc2lnbm1lbnQ6IElBc3NpZ25tZW50LCBkYXRlOiBEYXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0FjdGl2aXR5OiBib29sZWFuLCBjbGFzc05hbWU/OiBzdHJpbmcgKTogdm9pZCB7XG4gICAgaWYgKGdldENhbERhdGVPZmZzZXQoKSAhPT0gMCkgcmV0dXJuIC8vIElnbm9yZSBhY3Rpdml0eSB3aGVuIG9uIGFub3RoZXIgbW9udGhcbiAgICBpZiAobmV3QWN0aXZpdHkpIGFjdGl2aXR5LnB1c2goW3R5cGUsIGFzc2lnbm1lbnQsIERhdGUubm93KCksIGNsYXNzTmFtZV0pXG4gICAgY29uc3QgZWwgPSBjcmVhdGVBY3Rpdml0eSh0eXBlLCBhc3NpZ25tZW50LCBkYXRlLCBjbGFzc05hbWUpXG4gICAgYWRkQWN0aXZpdHlFbGVtZW50KGVsKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc2F2ZUFjdGl2aXR5KCk6IHZvaWQge1xuICAgIGFjdGl2aXR5ID0gYWN0aXZpdHkuc2xpY2UoYWN0aXZpdHkubGVuZ3RoIC0gMTI4LCBhY3Rpdml0eS5sZW5ndGgpXG4gICAgbG9jYWxTdG9yYWdlV3JpdGUoQUNUSVZJVFlfU1RPUkFHRV9OQU1FLCBhY3Rpdml0eSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlY2VudEFjdGl2aXR5KCk6IEFjdGl2aXR5SXRlbVtdIHtcbiAgICByZXR1cm4gYWN0aXZpdHkuc2xpY2UoYWN0aXZpdHkubGVuZ3RoIC0gMzIsIGFjdGl2aXR5Lmxlbmd0aClcbn1cbiIsImltcG9ydCB7IGVsZW1CeUlkLCBsb2NhbFN0b3JhZ2VSZWFkLCBsb2NhbFN0b3JhZ2VXcml0ZSB9IGZyb20gJy4uL3V0aWwnXG5cbmNvbnN0IEFUSEVOQV9TVE9SQUdFX05BTUUgPSAnYXRoZW5hRGF0YSdcblxuaW50ZXJmYWNlIElSYXdBdGhlbmFEYXRhIHtcbiAgICByZXNwb25zZV9jb2RlOiAyMDBcbiAgICBib2R5OiB7XG4gICAgICAgIGNvdXJzZXM6IHtcbiAgICAgICAgICAgIGNvdXJzZXM6IElSYXdDb3Vyc2VbXVxuICAgICAgICAgICAgc2VjdGlvbnM6IElSYXdTZWN0aW9uW11cbiAgICAgICAgfVxuICAgIH1cbiAgICBwZXJtaXNzaW9uczogYW55XG59XG5cbmludGVyZmFjZSBJUmF3Q291cnNlIHtcbiAgICBuaWQ6IG51bWJlclxuICAgIGNvdXJzZV90aXRsZTogc3RyaW5nXG4gICAgLy8gVGhlcmUncyBhIGJ1bmNoIG1vcmUgdGhhdCBJJ3ZlIG9taXR0ZWRcbn1cblxuaW50ZXJmYWNlIElSYXdTZWN0aW9uIHtcbiAgICBjb3Vyc2VfbmlkOiBudW1iZXJcbiAgICBsaW5rOiBzdHJpbmdcbiAgICBsb2dvOiBzdHJpbmdcbiAgICBzZWN0aW9uX3RpdGxlOiBzdHJpbmdcbiAgICAvLyBUaGVyZSdzIGEgYnVuY2ggbW9yZSB0aGF0IEkndmUgb21pdHRlZFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIElBdGhlbmFEYXRhSXRlbSB7XG4gICAgbGluazogc3RyaW5nXG4gICAgbG9nbzogc3RyaW5nXG4gICAgcGVyaW9kOiBzdHJpbmdcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJQXRoZW5hRGF0YSB7XG4gICAgW2Nsczogc3RyaW5nXTogSUF0aGVuYURhdGFJdGVtXG59XG5cbmxldCBhdGhlbmFEYXRhOiBJQXRoZW5hRGF0YXxudWxsID0gbG9jYWxTdG9yYWdlUmVhZChBVEhFTkFfU1RPUkFHRV9OQU1FKVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QXRoZW5hRGF0YSgpOiBJQXRoZW5hRGF0YXxudWxsIHtcbiAgICByZXR1cm4gYXRoZW5hRGF0YVxufVxuXG5mdW5jdGlvbiBmb3JtYXRMb2dvKGxvZ286IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGxvZ28uc3Vic3RyKDAsIGxvZ28uaW5kZXhPZignXCIgYWx0PVwiJykpXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoJzxkaXYgY2xhc3M9XCJwcm9maWxlLXBpY3R1cmVcIj48aW1nIHNyYz1cIicsICcnKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKCd0aW55JywgJ3JlZycpXG59XG5cbi8vIE5vdywgdGhlcmUncyB0aGUgc2Nob29sb2d5L2F0aGVuYSBpbnRlZ3JhdGlvbiBzdHVmZi4gRmlyc3QsIHdlIG5lZWQgdG8gY2hlY2sgaWYgaXQncyBiZWVuIG1vcmVcbi8vIHRoYW4gYSBkYXkuIFRoZXJlJ3Mgbm8gcG9pbnQgY29uc3RhbnRseSByZXRyaWV2aW5nIGNsYXNzZXMgZnJvbSBBdGhlbmE7IHRoZXkgZG9udCd0IGNoYW5nZSB0aGF0XG4vLyBtdWNoLlxuXG4vLyBUaGVuLCBvbmNlIHRoZSB2YXJpYWJsZSBmb3IgdGhlIGxhc3QgZGF0ZSBpcyBpbml0aWFsaXplZCwgaXQncyB0aW1lIHRvIGdldCB0aGUgY2xhc3NlcyBmcm9tXG4vLyBhdGhlbmEuIEx1Y2tpbHksIHRoZXJlJ3MgdGhpcyBmaWxlIGF0IC9pYXBpL2NvdXJzZS9hY3RpdmUgLSBhbmQgaXQncyBpbiBKU09OISBMaWZlIGNhbid0IGJlIGFueVxuLy8gYmV0dGVyISBTZXJpb3VzbHkhIEl0J3MganVzdCB0b28gYmFkIHRoZSBsb2dpbiBwYWdlIGlzbid0IGluIEpTT04uXG5mdW5jdGlvbiBwYXJzZUF0aGVuYURhdGEoZGF0OiBzdHJpbmcpOiBJQXRoZW5hRGF0YXxudWxsIHtcbiAgICBpZiAoZGF0ID09PSAnJykgcmV0dXJuIG51bGxcbiAgICBjb25zdCBkID0gSlNPTi5wYXJzZShkYXQpIGFzIElSYXdBdGhlbmFEYXRhXG4gICAgY29uc3QgYXRoZW5hRGF0YTI6IElBdGhlbmFEYXRhID0ge31cbiAgICBjb25zdCBhbGxDb3Vyc2VEZXRhaWxzOiB7IFtuaWQ6IG51bWJlcl06IElSYXdTZWN0aW9uIH0gPSB7fVxuICAgIGQuYm9keS5jb3Vyc2VzLnNlY3Rpb25zLmZvckVhY2goKHNlY3Rpb24pID0+IHtcbiAgICAgICAgYWxsQ291cnNlRGV0YWlsc1tzZWN0aW9uLmNvdXJzZV9uaWRdID0gc2VjdGlvblxuICAgIH0pXG4gICAgZC5ib2R5LmNvdXJzZXMuY291cnNlcy5yZXZlcnNlKCkuZm9yRWFjaCgoY291cnNlKSA9PiB7XG4gICAgICAgIGNvbnN0IGNvdXJzZURldGFpbHMgPSBhbGxDb3Vyc2VEZXRhaWxzW2NvdXJzZS5uaWRdXG4gICAgICAgIGF0aGVuYURhdGEyW2NvdXJzZS5jb3Vyc2VfdGl0bGVdID0ge1xuICAgICAgICAgICAgbGluazogYGh0dHBzOi8vYXRoZW5hLmhhcmtlci5vcmcke2NvdXJzZURldGFpbHMubGlua31gLFxuICAgICAgICAgICAgbG9nbzogZm9ybWF0TG9nbyhjb3Vyc2VEZXRhaWxzLmxvZ28pLFxuICAgICAgICAgICAgcGVyaW9kOiBjb3Vyc2VEZXRhaWxzLnNlY3Rpb25fdGl0bGVcbiAgICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIGF0aGVuYURhdGEyXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVBdGhlbmFEYXRhKGRhdGE6IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnN0IHJlZnJlc2hFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhdGhlbmFEYXRhUmVmcmVzaCcpXG4gICAgdHJ5IHtcbiAgICAgICAgYXRoZW5hRGF0YSA9IHBhcnNlQXRoZW5hRGF0YShkYXRhKVxuICAgICAgICBsb2NhbFN0b3JhZ2VXcml0ZShBVEhFTkFfU1RPUkFHRV9OQU1FLCBhdGhlbmFEYXRhKVxuICAgICAgICBlbGVtQnlJZCgnYXRoZW5hRGF0YUVycm9yJykuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuICAgICAgICBpZiAocmVmcmVzaEVsKSByZWZyZXNoRWwuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGVsZW1CeUlkKCdhdGhlbmFEYXRhRXJyb3InKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xuICAgICAgICBpZiAocmVmcmVzaEVsKSByZWZyZXNoRWwuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuICAgICAgICBlbGVtQnlJZCgnYXRoZW5hRGF0YUVycm9yJykuaW5uZXJIVE1MID0gZS5tZXNzYWdlXG4gICAgfVxufVxuIiwiaW1wb3J0IHsgZ2V0RGF0YSwgSUFwcGxpY2F0aW9uRGF0YSwgSUFzc2lnbm1lbnQgfSBmcm9tICcuLi9wY3InXG5pbXBvcnQgeyBsb2NhbFN0b3JhZ2VSZWFkLCBsb2NhbFN0b3JhZ2VXcml0ZSB9IGZyb20gJy4uL3V0aWwnXG5cbmNvbnN0IENVU1RPTV9TVE9SQUdFX05BTUUgPSAnZXh0cmEnXG5cbmV4cG9ydCBpbnRlcmZhY2UgSUN1c3RvbUFzc2lnbm1lbnQge1xuICAgIGJvZHk6IHN0cmluZ1xuICAgIGRvbmU6IGJvb2xlYW5cbiAgICBzdGFydDogbnVtYmVyXG4gICAgY2xhc3M6IHN0cmluZ3xudWxsXG4gICAgZW5kOiBudW1iZXJ8J0ZvcmV2ZXInXG59XG5cbmNvbnN0IGV4dHJhOiBJQ3VzdG9tQXNzaWdubWVudFtdID0gbG9jYWxTdG9yYWdlUmVhZChDVVNUT01fU1RPUkFHRV9OQU1FLCBbXSlcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEV4dHJhKCk6IElDdXN0b21Bc3NpZ25tZW50W10ge1xuICAgIHJldHVybiBleHRyYVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc2F2ZUV4dHJhKCk6IHZvaWQge1xuICAgIGxvY2FsU3RvcmFnZVdyaXRlKENVU1RPTV9TVE9SQUdFX05BTUUsIGV4dHJhKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYWRkVG9FeHRyYShjdXN0b206IElDdXN0b21Bc3NpZ25tZW50KTogdm9pZCB7XG4gICAgZXh0cmEucHVzaChjdXN0b20pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVGcm9tRXh0cmEoY3VzdG9tOiBJQ3VzdG9tQXNzaWdubWVudCk6IHZvaWQge1xuICAgIGlmICghZXh0cmEuaW5jbHVkZXMoY3VzdG9tKSkgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgcmVtb3ZlIGN1c3RvbSBhc3NpZ25tZW50IHRoYXQgZG9lcyBub3QgZXhpc3QnKVxuICAgIGV4dHJhLnNwbGljZShleHRyYS5pbmRleE9mKGN1c3RvbSksIDEpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBleHRyYVRvVGFzayhjdXN0b206IElDdXN0b21Bc3NpZ25tZW50LCBkYXRhOiBJQXBwbGljYXRpb25EYXRhKTogSUFzc2lnbm1lbnQge1xuICAgIGxldCBjbHM6IG51bWJlcnxudWxsID0gbnVsbFxuICAgIGNvbnN0IGNsYXNzTmFtZSA9IGN1c3RvbS5jbGFzc1xuICAgIGlmIChjbGFzc05hbWUgIT0gbnVsbCkge1xuICAgICAgICBjbHMgPSBkYXRhLmNsYXNzZXMuZmluZEluZGV4KChjKSA9PiBjLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoY2xhc3NOYW1lKSlcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICB0aXRsZTogJ1Rhc2snLFxuICAgICAgICBiYXNlVHlwZTogJ3Rhc2snLFxuICAgICAgICB0eXBlOiAndGFzaycsXG4gICAgICAgIGF0dGFjaG1lbnRzOiBbXSxcbiAgICAgICAgc3RhcnQ6IGN1c3RvbS5zdGFydCxcbiAgICAgICAgZW5kOiBjdXN0b20uZW5kIHx8ICdGb3JldmVyJyxcbiAgICAgICAgYm9keTogY3VzdG9tLmJvZHksXG4gICAgICAgIGlkOiBgdGFzayR7Y3VzdG9tLmJvZHkucmVwbGFjZSgvW15cXHddKi9nLCAnJyl9JHtjdXN0b20uc3RhcnR9JHtjdXN0b20uZW5kfSR7Y3VzdG9tLmNsYXNzfWAsXG4gICAgICAgIGNsYXNzOiBjbHMgPT09IC0xID8gbnVsbCA6IGNsc1xuICAgIH1cbn1cblxuaW50ZXJmYWNlIElQYXJzZVJlc3VsdCB7XG4gICAgdGV4dDogc3RyaW5nXG4gICAgY2xzPzogc3RyaW5nXG4gICAgZHVlPzogc3RyaW5nXG4gICAgc3Q/OiBzdHJpbmdcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlQ3VzdG9tVGFzayh0ZXh0OiBzdHJpbmcsIHJlc3VsdDogSVBhcnNlUmVzdWx0ID0geyB0ZXh0OiAnJyB9KTogSVBhcnNlUmVzdWx0IHtcbiAgICBjb25zdCBwYXJzZWQgPSB0ZXh0Lm1hdGNoKC8oLiopIChmb3J8Ynl8ZHVlfGFzc2lnbmVkfHN0YXJ0aW5nfGVuZGluZ3xiZWdpbm5pbmcpICguKikvKVxuICAgIGlmIChwYXJzZWQgPT0gbnVsbCkge1xuICAgICAgICByZXN1bHQudGV4dCA9IHRleHRcbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgIH1cblxuICAgIHN3aXRjaCAocGFyc2VkWzJdKSB7XG4gICAgICAgIGNhc2UgJ2Zvcic6IHJlc3VsdC5jbHMgPSBwYXJzZWRbM107IGJyZWFrXG4gICAgICAgIGNhc2UgJ2J5JzogY2FzZSAnZHVlJzogY2FzZSAnZW5kaW5nJzogcmVzdWx0LmR1ZSA9IHBhcnNlZFszXTsgYnJlYWtcbiAgICAgICAgY2FzZSAnYXNzaWduZWQnOiBjYXNlICdzdGFydGluZyc6IGNhc2UgJ2JlZ2lubmluZyc6IHJlc3VsdC5zdCA9IHBhcnNlZFszXTsgYnJlYWtcbiAgICB9XG5cbiAgICByZXR1cm4gcGFyc2VDdXN0b21UYXNrKHBhcnNlZFsxXSwgcmVzdWx0KVxufVxuIiwiaW1wb3J0IHsgbG9jYWxTdG9yYWdlUmVhZCwgbG9jYWxTdG9yYWdlV3JpdGUgfSBmcm9tICcuLi91dGlsJ1xuXG5jb25zdCBET05FX1NUT1JBR0VfTkFNRSA9ICdkb25lJ1xuXG5jb25zdCBkb25lOiBzdHJpbmdbXSA9IGxvY2FsU3RvcmFnZVJlYWQoRE9ORV9TVE9SQUdFX05BTUUsIFtdKVxuXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlRnJvbURvbmUoaWQ6IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnN0IGluZGV4ID0gZG9uZS5pbmRleE9mKGlkKVxuICAgIGlmIChpbmRleCA+PSAwKSBkb25lLnNwbGljZShpbmRleCwgMSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZFRvRG9uZShpZDogc3RyaW5nKTogdm9pZCB7XG4gICAgZG9uZS5wdXNoKGlkKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc2F2ZURvbmUoKTogdm9pZCB7XG4gICAgbG9jYWxTdG9yYWdlV3JpdGUoRE9ORV9TVE9SQUdFX05BTUUsIGRvbmUpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3NpZ25tZW50SW5Eb25lKGlkOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gZG9uZS5pbmNsdWRlcyhpZClcbn1cbiIsImltcG9ydCB7IGxvY2FsU3RvcmFnZVJlYWQsIGxvY2FsU3RvcmFnZVdyaXRlIH0gZnJvbSAnLi4vdXRpbCdcblxuY29uc3QgTU9ESUZJRURfU1RPUkFHRV9OQU1FID0gJ21vZGlmaWVkJ1xuXG5pbnRlcmZhY2UgSU1vZGlmaWVkQm9kaWVzIHtcbiAgICBbaWQ6IHN0cmluZ106IHN0cmluZ1xufVxuXG5jb25zdCBtb2RpZmllZDogSU1vZGlmaWVkQm9kaWVzID0gbG9jYWxTdG9yYWdlUmVhZChNT0RJRklFRF9TVE9SQUdFX05BTUUsIHt9KVxuXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlRnJvbU1vZGlmaWVkKGlkOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBkZWxldGUgbW9kaWZpZWRbaWRdXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzYXZlTW9kaWZpZWQoKTogdm9pZCB7XG4gICAgbG9jYWxTdG9yYWdlV3JpdGUoTU9ESUZJRURfU1RPUkFHRV9OQU1FLCBtb2RpZmllZClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2lnbm1lbnRJbk1vZGlmaWVkKGlkOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gbW9kaWZpZWQuaGFzT3duUHJvcGVydHkoaWQpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtb2RpZmllZEJvZHkoaWQ6IHN0cmluZyk6IHN0cmluZ3x1bmRlZmluZWQge1xuICAgIHJldHVybiBtb2RpZmllZFtpZF1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldE1vZGlmaWVkKGlkOiBzdHJpbmcsIGJvZHk6IHN0cmluZyk6IHZvaWQge1xuICAgIG1vZGlmaWVkW2lkXSA9IGJvZHlcbn1cbiIsImltcG9ydCB7IGxvY2FsU3RvcmFnZVJlYWQsIGxvY2FsU3RvcmFnZVdyaXRlIH0gZnJvbSAnLi91dGlsJ1xuXG50eXBlIEFzc2lnbm1lbnRTcGFuID0gJ211bHRpcGxlJyB8ICdzdGFydCcgfCAnZW5kJ1xudHlwZSBIaWRlQXNzaWdubWVudHMgPSAnZGF5JyB8ICdtcycgfCAndXMnXG50eXBlIENvbG9yVHlwZSA9ICdhc3NpZ25tZW50JyB8ICdjbGFzcydcbmludGVyZmFjZSBJU2hvd25BY3Rpdml0eSB7XG4gICAgYWRkOiBib29sZWFuXG4gICAgZWRpdDogYm9vbGVhblxuICAgIGRlbGV0ZTogYm9vbGVhblxufVxuXG5leHBvcnQgY29uc3Qgc2V0dGluZ3MgPSB7XG4gICAgLyoqXG4gICAgICogTWludXRlcyBiZXR3ZWVuIGVhY2ggYXV0b21hdGljIHJlZnJlc2ggb2YgdGhlIHBhZ2UuIE5lZ2F0aXZlIG51bWJlcnMgaW5kaWNhdGUgbm8gYXV0b21hdGljXG4gICAgICogcmVmcmVzaGluZy5cbiAgICAgKi9cbiAgICBnZXQgcmVmcmVzaFJhdGUoKTogbnVtYmVyIHsgcmV0dXJuIGxvY2FsU3RvcmFnZVJlYWQoJ3JlZnJlc2hSYXRlJywgLTEpIH0sXG4gICAgc2V0IHJlZnJlc2hSYXRlKHY6IG51bWJlcikgeyBsb2NhbFN0b3JhZ2VXcml0ZSgncmVmcmVzaFJhdGUnLCB2KSB9LFxuXG4gICAgLyoqXG4gICAgICogV2hldGhlciB0aGUgd2luZG93IHNob3VsZCByZWZyZXNoIGFzc2lnbm1lbnQgZGF0YSB3aGVuIGZvY3Vzc2VkXG4gICAgICovXG4gICAgZ2V0IHJlZnJlc2hPbkZvY3VzKCk6IGJvb2xlYW4geyByZXR1cm4gbG9jYWxTdG9yYWdlUmVhZCgncmVmcmVzaE9uRm9jdXMnLCB0cnVlKSB9LFxuICAgIHNldCByZWZyZXNoT25Gb2N1cyh2OiBib29sZWFuKSB7IGxvY2FsU3RvcmFnZVdyaXRlKCdyZWZyZXNoT25Gb2N1cycsIHYpIH0sXG5cbiAgICAvKipcbiAgICAgKiBXaGV0aGVyIHN3aXRjaGluZyBiZXR3ZWVuIHZpZXdzIHNob3VsZCBiZSBhbmltYXRlZFxuICAgICAqL1xuICAgIGdldCB2aWV3VHJhbnMoKTogYm9vbGVhbiB7IHJldHVybiBsb2NhbFN0b3JhZ2VSZWFkKCd2aWV3VHJhbnMnLCB0cnVlKSB9LFxuICAgIHNldCB2aWV3VHJhbnModjogYm9vbGVhbikgeyBsb2NhbFN0b3JhZ2VXcml0ZSgndmlld1RyYW5zJywgdikgfSxcblxuICAgIC8qKlxuICAgICAqIE51bWJlciBvZiBkYXlzIGVhcmx5IHRvIHNob3cgdGVzdHMgaW4gbGlzdCB2aWV3XG4gICAgICovXG4gICAgZ2V0IGVhcmx5VGVzdCgpOiBudW1iZXIgeyByZXR1cm4gbG9jYWxTdG9yYWdlUmVhZCgnZWFybHlUZXN0JywgMSkgfSxcbiAgICBzZXQgZWFybHlUZXN0KHY6IG51bWJlcikgeyBsb2NhbFN0b3JhZ2VXcml0ZSgnZWFybHlUZXN0JywgdikgfSxcblxuICAgIC8qKlxuICAgICAqIFdoZXRoZXIgdG8gdGFrZSB0YXNrcyBvZmYgdGhlIGNhbGVuZGFyIHZpZXcgYW5kIHNob3cgdGhlbSBpbiB0aGUgaW5mbyBwYW5lXG4gICAgICovXG4gICAgZ2V0IHNlcFRhc2tzKCk6IGJvb2xlYW4geyByZXR1cm4gbG9jYWxTdG9yYWdlUmVhZCgnc2VwVGFza3MnLCBmYWxzZSkgfSxcbiAgICBzZXQgc2VwVGFza3ModjogYm9vbGVhbikgeyBsb2NhbFN0b3JhZ2VXcml0ZSgnc2VwVGFza3MnLCB2KSB9LFxuXG4gICAgLyoqXG4gICAgICogV2hldGhlciB0YXNrcyBzaG91bGQgaGF2ZSB0aGVpciBvd24gY29sb3JcbiAgICAgKi9cbiAgICBnZXQgc2VwVGFza0NsYXNzKCk6IGJvb2xlYW4geyByZXR1cm4gbG9jYWxTdG9yYWdlUmVhZCgnc2VwVGFza0NsYXNzJywgZmFsc2UpIH0sXG4gICAgc2V0IHNlcFRhc2tDbGFzcyh2OiBib29sZWFuKSB7IGxvY2FsU3RvcmFnZVdyaXRlKCdzZXBUYXNrQ2xhc3MnLCB2KSB9LFxuXG4gICAgLyoqXG4gICAgICogV2hldGhlciBwcm9qZWN0cyBzaG93IHVwIGluIHRoZSB0ZXN0IHBhZ2VcbiAgICAgKi9cbiAgICBnZXQgcHJvamVjdHNJblRlc3RQYW5lKCk6IGJvb2xlYW4geyByZXR1cm4gbG9jYWxTdG9yYWdlUmVhZCgncHJvamVjdHNJblRlc3RQYW5lJywgZmFsc2UpIH0sXG4gICAgc2V0IHByb2plY3RzSW5UZXN0UGFuZSh2OiBib29sZWFuKSB7IGxvY2FsU3RvcmFnZVdyaXRlKCdwcm9qZWN0c0luVGVzdFBhbmUnLCB2KSB9LFxuXG4gICAgLyoqXG4gICAgICogV2hlbiBhc3NpZ25tZW50cyBzaG91bGQgYmUgc2hvd24gb24gY2FsZW5kYXIgdmlld1xuICAgICAqL1xuICAgIGdldCBhc3NpZ25tZW50U3BhbigpOiBBc3NpZ25tZW50U3BhbiB7IHJldHVybiBsb2NhbFN0b3JhZ2VSZWFkKCdhc3NpZ25tZW50U3BhbicsICdtdWx0aXBsZScpIH0sXG4gICAgc2V0IGFzc2lnbm1lbnRTcGFuKHY6IEFzc2lnbm1lbnRTcGFuKSB7IGxvY2FsU3RvcmFnZVdyaXRlKCdhc3NpZ25tZW50U3BhbicsIHYpIH0sXG5cbiAgICAvKipcbiAgICAgKiBXaGVuIGFzc2lnbm1lbnRzIHNob3VsZCBkaXNhcHBlYXIgZnJvbSBsaXN0IHZpZXdcbiAgICAgKi9cbiAgICBnZXQgaGlkZUFzc2lnbm1lbnRzKCk6IEhpZGVBc3NpZ25tZW50cyB7IHJldHVybiBsb2NhbFN0b3JhZ2VSZWFkKCdoaWRlQXNzaWdubWVudHMnLCAnZGF5JykgfSxcbiAgICBzZXQgaGlkZUFzc2lnbm1lbnRzKHY6IEhpZGVBc3NpZ25tZW50cykgeyBsb2NhbFN0b3JhZ2VXcml0ZSgnaGlkZUFzc2lnbm1lbnRzJywgdikgfSxcblxuICAgIC8qKlxuICAgICAqIFdoZXRoZXIgdG8gdXNlIGhvbGlkYXkgdGhlbWluZ1xuICAgICAqL1xuICAgIGdldCBob2xpZGF5VGhlbWVzKCk6IGJvb2xlYW4geyByZXR1cm4gbG9jYWxTdG9yYWdlUmVhZCgnaG9saWRheVRoZW1lcycsIGZhbHNlKSB9LFxuICAgIHNldCBob2xpZGF5VGhlbWVzKHY6IGJvb2xlYW4pIHsgbG9jYWxTdG9yYWdlV3JpdGUoJ2hvbGlkYXlUaGVtZXMnLCB2KSB9LFxuXG4gICAgLyoqXG4gICAgICogV2hldGhlciB0byBjb2xvciBhc3NpZ25tZW50cyBiYXNlZCBvbiB0aGVpciB0eXBlIG9yIGNsYXNzXG4gICAgICovXG4gICAgZ2V0IGNvbG9yVHlwZSgpOiBDb2xvclR5cGUgeyByZXR1cm4gbG9jYWxTdG9yYWdlUmVhZCgnY29sb3JUeXBlJywgJ2Fzc2lnbm1lbnQnKSB9LFxuICAgIHNldCBjb2xvclR5cGUodjogQ29sb3JUeXBlKSB7IGxvY2FsU3RvcmFnZVdyaXRlKCdjb2xvclR5cGUnLCB2KSB9LFxuXG4gICAgLyoqXG4gICAgICogV2hpY2ggdHlwZXMgb2YgYWN0aXZpdHkgYXJlIHNob3duIGluIHRoZSBhY3Rpdml0eSBwYW5lXG4gICAgICovXG4gICAgZ2V0IHNob3duQWN0aXZpdHkoKTogSVNob3duQWN0aXZpdHkgeyByZXR1cm4gbG9jYWxTdG9yYWdlUmVhZCgnc2hvd25BY3Rpdml0eScsIHtcbiAgICAgICAgYWRkOiB0cnVlLFxuICAgICAgICBlZGl0OiB0cnVlLFxuICAgICAgICBkZWxldGU6IHRydWVcbiAgICB9KSB9LFxuICAgIHNldCBzaG93bkFjdGl2aXR5KHY6IElTaG93bkFjdGl2aXR5KSB7IGxvY2FsU3RvcmFnZVdyaXRlKCdzaG93bkFjdGl2aXR5JywgdikgfSxcblxuICAgIC8qKlxuICAgICAqIFdoZXRoZXIgdG8gZGlzcGxheSB0YXNrcyBpbiB0aGUgdGFzayBwYW5lIHRoYXQgYXJlIGNvbXBsZXRlZFxuICAgICAqL1xuICAgIGdldCBzaG93RG9uZVRhc2tzKCk6IGJvb2xlYW4geyByZXR1cm4gbG9jYWxTdG9yYWdlUmVhZCgnc2hvd0RvbmVUYXNrcycsIGZhbHNlKSB9LFxuICAgIHNldCBzaG93RG9uZVRhc2tzKHY6IGJvb2xlYW4pIHsgbG9jYWxTdG9yYWdlV3JpdGUoJ3Nob3dEb25lVGFza3MnLCB2KSB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTZXR0aW5nKG5hbWU6IHN0cmluZyk6IGFueSB7XG4gICAgaWYgKCFzZXR0aW5ncy5oYXNPd25Qcm9wZXJ0eShuYW1lKSkgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHNldHRpbmcgbmFtZSAke25hbWV9YClcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgcmV0dXJuIHNldHRpbmdzW25hbWVdXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRTZXR0aW5nKG5hbWU6IHN0cmluZywgdmFsdWU6IGFueSk6IHZvaWQge1xuICAgIGlmICghc2V0dGluZ3MuaGFzT3duUHJvcGVydHkobmFtZSkpIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBzZXR0aW5nIG5hbWUgJHtuYW1lfWApXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIHNldHRpbmdzW25hbWVdID0gdmFsdWVcbn1cbiIsImltcG9ydCB7IGZyb21EYXRlTnVtLCB0b0RhdGVOdW0gfSBmcm9tICcuL2RhdGVzJ1xuXG4vLyBAdHMtaWdub3JlIFRPRE86IE1ha2UgdGhpcyBsZXNzIGhhY2t5XG5Ob2RlTGlzdC5wcm90b3R5cGUuZm9yRWFjaCA9IEhUTUxDb2xsZWN0aW9uLnByb3RvdHlwZS5mb3JFYWNoID0gQXJyYXkucHJvdG90eXBlLmZvckVhY2hcblxuLyoqXG4gKiBGb3JjZXMgYSBsYXlvdXQgb24gYW4gZWxlbWVudFxuICovXG5leHBvcnQgZnVuY3Rpb24gZm9yY2VMYXlvdXQoZWw6IEhUTUxFbGVtZW50KTogdm9pZCB7XG4gICAgLy8gVGhpcyBpbnZvbHZlcyBhIGxpdHRsZSB0cmlja2VyeSBpbiB0aGF0IGJ5IHJlcXVlc3RpbmcgdGhlIGNvbXB1dGVkIGhlaWdodCBvZiB0aGUgZWxlbWVudCB0aGVcbiAgICAvLyBicm93c2VyIGlzIGZvcmNlZCB0byBkbyBhIGZ1bGwgbGF5b3V0XG5cbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLWV4cHJlc3Npb25cbiAgICBlbC5vZmZzZXRIZWlnaHRcbn1cblxuLyoqXG4gKiBSZXR1cm4gYSBzdHJpbmcgd2l0aCB0aGUgZmlyc3QgbGV0dGVyIGNhcGl0YWxpemVkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjYXBpdGFsaXplU3RyaW5nKHN0cjogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gc3RyLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc3RyLnN1YnN0cigxKVxufVxuXG4vKipcbiAqIFJldHVybnMgYW4gWE1MSHR0cFJlcXVlc3Qgd2l0aCB0aGUgc3BlY2lmaWVkIHVybCwgcmVzcG9uc2UgdHlwZSwgaGVhZGVycywgYW5kIGRhdGFcbiAqL1xuZnVuY3Rpb24gY29uc3RydWN0WE1MSHR0cFJlcXVlc3QodXJsOiBzdHJpbmcsIHJlc3BUeXBlPzogWE1MSHR0cFJlcXVlc3RSZXNwb25zZVR5cGV8bnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRlcnM/OiB7W25hbWU6IHN0cmluZ106IHN0cmluZ318bnVsbCwgZGF0YT86IHN0cmluZ3xudWxsKTogWE1MSHR0cFJlcXVlc3Qge1xuICAgIGNvbnN0IHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG5cbiAgICAvLyBJZiBQT1NUIGRhdGEgaXMgcHJvdmlkZWQgc2VuZCBhIFBPU1QgcmVxdWVzdCwgb3RoZXJ3aXNlIHNlbmQgYSBHRVQgcmVxdWVzdFxuICAgIHJlcS5vcGVuKChkYXRhID8gJ1BPU1QnIDogJ0dFVCcpLCB1cmwsIHRydWUpXG5cbiAgICBpZiAocmVzcFR5cGUpIHJlcS5yZXNwb25zZVR5cGUgPSByZXNwVHlwZVxuXG4gICAgaWYgKGhlYWRlcnMpIHtcbiAgICAgICAgT2JqZWN0LmtleXMoaGVhZGVycykuZm9yRWFjaCgoaGVhZGVyKSA9PiB7XG4gICAgICAgICAgICByZXEuc2V0UmVxdWVzdEhlYWRlcihoZWFkZXIsIGhlYWRlcnNbaGVhZGVyXSlcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICAvLyBJZiBkYXRhIGlzIHVuZGVmaW5lZCBkZWZhdWx0IHRvIHRoZSBub3JtYWwgcmVxLnNlbmQoKSwgb3RoZXJ3aXNlIHBhc3MgdGhlIGRhdGEgaW5cbiAgICByZXEuc2VuZChkYXRhKVxuICAgIHJldHVybiByZXFcbn1cblxuLyoqIFNlbmRzIGEgcmVxdWVzdCB0byBhIHNlcnZlciBhbmQgcmV0dXJucyBhIFByb21pc2UuXG4gKiBAcGFyYW0gdXJsIHRoZSB1cmwgdG8gcmV0cmlldmVcbiAqIEBwYXJhbSByZXNwVHlwZSB0aGUgdHlwZSBvZiByZXNwb25zZSB0aGF0IHNob3VsZCBiZSByZWNlaXZlZFxuICogQHBhcmFtIGhlYWRlcnMgdGhlIGhlYWRlcnMgdGhhdCB3aWxsIGJlIHNlbnQgdG8gdGhlIHNlcnZlclxuICogQHBhcmFtIGRhdGEgdGhlIGRhdGEgdGhhdCB3aWxsIGJlIHNlbnQgdG8gdGhlIHNlcnZlciAob25seSBmb3IgUE9TVCByZXF1ZXN0cylcbiAqIEBwYXJhbSBwcm9ncmVzc0VsZW1lbnQgYW4gb3B0aW9uYWwgZWxlbWVudCBmb3IgdGhlIHByb2dyZXNzIGJhciB1c2VkIHRvIGRpc3BsYXkgdGhlIHN0YXR1cyBvZiB0aGUgcmVxdWVzdFxuICovXG5leHBvcnQgZnVuY3Rpb24gc2VuZCh1cmw6IHN0cmluZywgcmVzcFR5cGU/OiBYTUxIdHRwUmVxdWVzdFJlc3BvbnNlVHlwZXxudWxsLCBoZWFkZXJzPzoge1tuYW1lOiBzdHJpbmddOiBzdHJpbmd9fG51bGwsXG4gICAgICAgICAgICAgICAgICAgICBkYXRhPzogc3RyaW5nfG51bGwsIHByb2dyZXNzPzogSFRNTEVsZW1lbnR8bnVsbCk6IFByb21pc2U8WE1MSHR0cFJlcXVlc3Q+IHtcblxuICAgIGNvbnN0IHJlcSA9IGNvbnN0cnVjdFhNTEh0dHBSZXF1ZXN0KHVybCwgcmVzcFR5cGUsIGhlYWRlcnMsIGRhdGEpXG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgICAgIGNvbnN0IHByb2dyZXNzSW5uZXIgPSBwcm9ncmVzcyA/IHByb2dyZXNzLnF1ZXJ5U2VsZWN0b3IoJ2RpdicpIDogbnVsbFxuICAgICAgICBpZiAocHJvZ3Jlc3MgJiYgcHJvZ3Jlc3NJbm5lcikge1xuICAgICAgICAgICAgZm9yY2VMYXlvdXQocHJvZ3Jlc3NJbm5lcikgLy8gV2FpdCBmb3IgaXQgdG8gcmVuZGVyXG4gICAgICAgICAgICBwcm9ncmVzcy5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKSAvLyBEaXNwbGF5IHRoZSBwcm9ncmVzcyBiYXJcbiAgICAgICAgICAgIGlmIChwcm9ncmVzc0lubmVyLmNsYXNzTGlzdC5jb250YWlucygnZGV0ZXJtaW5hdGUnKSkge1xuICAgICAgICAgICAgICAgIHByb2dyZXNzSW5uZXIuY2xhc3NMaXN0LnJlbW92ZSgnZGV0ZXJtaW5hdGUnKVxuICAgICAgICAgICAgICAgIHByb2dyZXNzSW5uZXIuY2xhc3NMaXN0LmFkZCgnaW5kZXRlcm1pbmF0ZScpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTb21ldGltZXMgdGhlIGJyb3dzZXIgd29uJ3QgZ2l2ZSB0aGUgdG90YWwgYnl0ZXMgaW4gdGhlIHJlc3BvbnNlLCBzbyB1c2UgcGFzdCByZXN1bHRzIG9yXG4gICAgICAgIC8vIGEgZGVmYXVsdCBvZiAxNzAsMDAwIGJ5dGVzIGlmIHRoZSBicm93c2VyIGRvZXNuJ3QgcHJvdmlkZSB0aGUgbnVtYmVyXG4gICAgICAgIGNvbnN0IGxvYWQgPSBsb2NhbFN0b3JhZ2VSZWFkKCdsb2FkJywgMTcwMDAwKVxuICAgICAgICBsZXQgY29tcHV0ZWRMb2FkID0gMFxuXG4gICAgICAgIHJlcS5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKGV2dCkgPT4ge1xuICAgICAgICAgICAgLy8gQ2FjaGUgdGhlIG51bWJlciBvZiBieXRlcyBsb2FkZWQgc28gaXQgY2FuIGJlIHVzZWQgZm9yIGJldHRlciBlc3RpbWF0ZXMgbGF0ZXIgb25cbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZVdyaXRlKCdsb2FkJywgY29tcHV0ZWRMb2FkKVxuICAgICAgICAgICAgaWYgKHByb2dyZXNzKSBwcm9ncmVzcy5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuICAgICAgICAgICAgLy8gUmVzb2x2ZSB3aXRoIHRoZSByZXF1ZXN0XG4gICAgICAgICAgICBpZiAocmVxLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShyZXEpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlamVjdChFcnJvcihyZXEuc3RhdHVzVGV4dCkpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgcmVxLmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHByb2dyZXNzKSBwcm9ncmVzcy5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuICAgICAgICAgICAgcmVqZWN0KEVycm9yKCdOZXR3b3JrIEVycm9yJykpXG4gICAgICAgIH0pXG5cbiAgICAgICAgaWYgKHByb2dyZXNzICYmIHByb2dyZXNzSW5uZXIpIHtcbiAgICAgICAgICAgIHJlcS5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIChldnQpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBVcGRhdGUgdGhlIHByb2dyZXNzIGJhclxuICAgICAgICAgICAgICAgIGlmIChwcm9ncmVzc0lubmVyLmNsYXNzTGlzdC5jb250YWlucygnaW5kZXRlcm1pbmF0ZScpKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb2dyZXNzSW5uZXIuY2xhc3NMaXN0LnJlbW92ZSgnaW5kZXRlcm1pbmF0ZScpXG4gICAgICAgICAgICAgICAgICAgIHByb2dyZXNzSW5uZXIuY2xhc3NMaXN0LmFkZCgnZGV0ZXJtaW5hdGUnKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb21wdXRlZExvYWQgPSBldnQubG9hZGVkXG4gICAgICAgICAgICAgICAgcHJvZ3Jlc3NJbm5lci5zdHlsZS53aWR0aCA9ICgoMTAwICogZXZ0LmxvYWRlZCkgLyAoZXZ0Lmxlbmd0aENvbXB1dGFibGUgPyBldnQudG90YWwgOiBsb2FkKSkgKyAnJSdcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9KVxufVxuXG4vKipcbiAqIFRoZSBlcXVpdmFsZW50IG9mIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkIGJ1dCB0aHJvd3MgYW4gZXJyb3IgaWYgdGhlIGVsZW1lbnQgaXMgbm90IGRlZmluZWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGVsZW1CeUlkKGlkOiBzdHJpbmcpOiBIVE1MRWxlbWVudCB7XG4gICAgY29uc3QgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZClcbiAgICBpZiAoZWwgPT0gbnVsbCkgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCBlbGVtZW50IHdpdGggaWQgJHtpZH1gKVxuICAgIHJldHVybiBlbFxufVxuXG4vKipcbiAqIEEgbGl0dGxlIGhlbHBlciBmdW5jdGlvbiB0byBzaW1wbGlmeSB0aGUgY3JlYXRpb24gb2YgSFRNTCBlbGVtZW50c1xuICovXG5leHBvcnQgZnVuY3Rpb24gZWxlbWVudCh0YWc6IHN0cmluZywgY2xzOiBzdHJpbmd8c3RyaW5nW10sIGh0bWw/OiBzdHJpbmd8bnVsbCwgaWQ/OiBzdHJpbmd8bnVsbCk6IEhUTUxFbGVtZW50IHtcbiAgICBjb25zdCBlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWcpXG5cbiAgICBpZiAodHlwZW9mIGNscyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgZS5jbGFzc0xpc3QuYWRkKGNscylcbiAgICB9IGVsc2Uge1xuICAgICAgICBjbHMuZm9yRWFjaCgoYykgPT4gZS5jbGFzc0xpc3QuYWRkKGMpKVxuICAgIH1cblxuICAgIGlmIChodG1sKSBlLmlubmVySFRNTCA9IGh0bWxcbiAgICBpZiAoaWQpIGUuc2V0QXR0cmlidXRlKCdpZCcsIGlkKVxuXG4gICAgcmV0dXJuIGVcbn1cblxuLyoqXG4gKiBUaHJvd3MgYW4gZXJyb3IgaWYgdGhlIHN1cHBsaWVkIGFyZ3VtZW50IGlzIG51bGwsIG90aGVyd2lzZSByZXR1cm5zIHRoZSBhcmd1bWVudFxuICovXG5leHBvcnQgZnVuY3Rpb24gXyQ8VD4oYXJnOiBUfG51bGwpOiBUIHtcbiAgICBpZiAoYXJnID09IG51bGwpIHRocm93IG5ldyBFcnJvcignRXhwZWN0ZWQgYXJndW1lbnQgdG8gYmUgbm9uLW51bGwnKVxuICAgIHJldHVybiBhcmdcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF8kaChhcmc6IE5vZGV8RXZlbnRUYXJnZXR8bnVsbCk6IEhUTUxFbGVtZW50IHtcbiAgICBpZiAoYXJnID09IG51bGwpIHRocm93IG5ldyBFcnJvcignRXhwZWN0ZWQgbm9kZSB0byBiZSBub24tbnVsbCcpXG4gICAgaWYgKCEoYXJnIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpKSB0aHJvdyBuZXcgRXJyb3IoJ05vZGUgaXMgbm90IGFuIEhUTUwgZWxlbWVudCcpXG4gICAgcmV0dXJuIGFyZ1xufVxuXG4vLyBCZWNhdXNlIHNvbWUgbG9jYWxTdG9yYWdlIGVudHJpZXMgY2FuIGJlY29tZSBjb3JydXB0ZWQgZHVlIHRvIGVycm9yIHNpZGUgZWZmZWN0cywgdGhlIGJlbG93XG4vLyBtZXRob2QgdHJpZXMgdG8gcmVhZCBhIHZhbHVlIGZyb20gbG9jYWxTdG9yYWdlIGFuZCBoYW5kbGVzIGVycm9ycy5cbmV4cG9ydCBmdW5jdGlvbiBsb2NhbFN0b3JhZ2VSZWFkKG5hbWU6IHN0cmluZyk6IGFueVxuZXhwb3J0IGZ1bmN0aW9uIGxvY2FsU3RvcmFnZVJlYWQ8Uj4obmFtZTogc3RyaW5nLCBkZWZhdWx0VmFsOiAoKSA9PiBSKTogUlxuZXhwb3J0IGZ1bmN0aW9uIGxvY2FsU3RvcmFnZVJlYWQ8VD4obmFtZTogc3RyaW5nLCBkZWZhdWx0VmFsOiBUKTogVFxuZXhwb3J0IGZ1bmN0aW9uIGxvY2FsU3RvcmFnZVJlYWQobmFtZTogc3RyaW5nLCBkZWZhdWx0VmFsPzogYW55KTogYW55IHtcbiAgICB0cnkge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2VbbmFtZV0pXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZXR1cm4gdHlwZW9mIGRlZmF1bHRWYWwgPT09ICdmdW5jdGlvbicgPyBkZWZhdWx0VmFsKCkgOiBkZWZhdWx0VmFsXG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbG9jYWxTdG9yYWdlV3JpdGUobmFtZTogc3RyaW5nLCBpdGVtOiBhbnkpOiB2b2lkIHtcbiAgICBsb2NhbFN0b3JhZ2VbbmFtZV0gPSBKU09OLnN0cmluZ2lmeShpdGVtKVxufVxuXG5pbnRlcmZhY2UgSWRsZURlYWRsaW5lIHtcbiAgICBkaWRUaW1lb3V0OiBib29sZWFuXG4gICAgdGltZVJlbWFpbmluZzogKCkgPT4gbnVtYmVyXG59XG5cbi8vIEJlY2F1c2UgdGhlIHJlcXVlc3RJZGxlQ2FsbGJhY2sgZnVuY3Rpb24gaXMgdmVyeSBuZXcgKGFzIG9mIHdyaXRpbmcgb25seSB3b3JrcyB3aXRoIENocm9tZVxuLy8gdmVyc2lvbiA0NyksIHRoZSBiZWxvdyBmdW5jdGlvbiBwb2x5ZmlsbHMgdGhhdCBtZXRob2QuXG5leHBvcnQgZnVuY3Rpb24gcmVxdWVzdElkbGVDYWxsYmFjayhjYjogKGRlYWRsaW5lOiBJZGxlRGVhZGxpbmUpID0+IHZvaWQsIG9wdHM6IHsgdGltZW91dDogbnVtYmVyfSk6IG51bWJlciB7XG4gICAgaWYgKCdyZXF1ZXN0SWRsZUNhbGxiYWNrJyBpbiB3aW5kb3cpIHtcbiAgICAgICAgcmV0dXJuICh3aW5kb3cgYXMgYW55KS5yZXF1ZXN0SWRsZUNhbGxiYWNrKGNiLCBvcHRzKVxuICAgIH1cbiAgICBjb25zdCBzdGFydCA9IERhdGUubm93KClcblxuICAgIHJldHVybiBzZXRUaW1lb3V0KCgpID0+IGNiKHtcbiAgICAgICAgZGlkVGltZW91dDogZmFsc2UsXG4gICAgICAgIHRpbWVSZW1haW5pbmcoKTogbnVtYmVyIHtcbiAgICAgICAgICAgIHJldHVybiBNYXRoLm1heCgwLCA1MCAtIChEYXRlLm5vdygpIC0gc3RhcnQpKVxuICAgICAgICB9XG4gICAgfSksIDEpXG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIHRoZSB0d28gZGF0ZXMgaGF2ZSB0aGUgc2FtZSB5ZWFyLCBtb250aCwgYW5kIGRheVxuICovXG5mdW5jdGlvbiBkYXRlc0VxdWFsKGE6IERhdGUsIGI6IERhdGUpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdG9EYXRlTnVtKGEpID09PSB0b0RhdGVOdW0oYilcbn1cblxuY29uc3QgREFURV9SRUxBVElWRU5BTUVTOiB7W25hbWU6IHN0cmluZ106IG51bWJlcn0gPSB7XG4gICAgJ1RvbW9ycm93JzogMSxcbiAgICAnVG9kYXknOiAwLFxuICAgICdZZXN0ZXJkYXknOiAtMSxcbiAgICAnMiBkYXlzIGFnbyc6IC0yXG59XG5jb25zdCBXRUVLREFZUyA9IFsnU3VuZGF5JywgJ01vbmRheScsICdUdWVzZGF5JywgJ1dlZG5lc2RheScsICdUaHVyc2RheScsICdGcmlkYXknLCAnU2F0dXJkYXknXVxuY29uc3QgRlVMTE1PTlRIUyA9IFsnSmFudWFyeScsICdGZWJydWFyeScsICdNYXJjaCcsICdBcHJpbCcsICdNYXknLCAnSnVuZScsICdKdWx5JywgJ0F1Z3VzdCcsICdTZXB0ZW1iZXInLCAnT2N0b2JlcicsXG4gICAgICAgICAgICAgICAgICAgICdOb3ZlbWJlcicsICdEZWNlbWJlciddXG5cbmV4cG9ydCBmdW5jdGlvbiBkYXRlU3RyaW5nKGRhdGU6IERhdGV8bnVtYmVyfCdGb3JldmVyJywgYWRkVGhpczogYm9vbGVhbiA9IGZhbHNlKTogc3RyaW5nIHtcbiAgICBpZiAoZGF0ZSA9PT0gJ0ZvcmV2ZXInKSByZXR1cm4gZGF0ZVxuICAgIGlmICh0eXBlb2YgZGF0ZSA9PT0gJ251bWJlcicpIHJldHVybiBkYXRlU3RyaW5nKGZyb21EYXRlTnVtKGRhdGUpLCBhZGRUaGlzKVxuXG4gICAgY29uc3QgcmVsYXRpdmVNYXRjaCA9IE9iamVjdC5rZXlzKERBVEVfUkVMQVRJVkVOQU1FUykuZmluZCgobmFtZSkgPT4ge1xuICAgICAgICBjb25zdCBkYXlBdCA9IG5ldyBEYXRlKClcbiAgICAgICAgZGF5QXQuc2V0RGF0ZShkYXlBdC5nZXREYXRlKCkgKyBEQVRFX1JFTEFUSVZFTkFNRVNbbmFtZV0pXG4gICAgICAgIHJldHVybiBkYXRlc0VxdWFsKGRheUF0LCBkYXRlKVxuICAgIH0pXG4gICAgaWYgKHJlbGF0aXZlTWF0Y2gpIHJldHVybiByZWxhdGl2ZU1hdGNoXG5cbiAgICBjb25zdCBkYXlzQWhlYWQgPSAoZGF0ZS5nZXRUaW1lKCkgLSBEYXRlLm5vdygpKSAvIDEwMDAgLyAzNjAwIC8gMjRcblxuICAgIC8vIElmIHRoZSBkYXRlIGlzIHdpdGhpbiA2IGRheXMgb2YgdG9kYXksIG9ubHkgZGlzcGxheSB0aGUgZGF5IG9mIHRoZSB3ZWVrXG4gICAgaWYgKDAgPCBkYXlzQWhlYWQgJiYgZGF5c0FoZWFkIDw9IDYpIHtcbiAgICAgICAgcmV0dXJuIChhZGRUaGlzID8gJ1RoaXMgJyA6ICcnKSArIFdFRUtEQVlTW2RhdGUuZ2V0RGF5KCldXG4gICAgfVxuICAgIHJldHVybiBgJHtXRUVLREFZU1tkYXRlLmdldERheSgpXX0sICR7RlVMTE1PTlRIU1tkYXRlLmdldE1vbnRoKCldfSAke2RhdGUuZ2V0RGF0ZSgpfWBcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1vbnRoU3RyaW5nKGRhdGU6IERhdGV8bnVtYmVyKTogc3RyaW5nIHtcbiAgICBpZiAodHlwZW9mIGRhdGUgPT09ICdudW1iZXInKSByZXR1cm4gbW9udGhTdHJpbmcoZnJvbURhdGVOdW0oZGF0ZSkpXG5cbiAgICBjb25zdCB0b2RheSA9IG5ldyBEYXRlKClcbiAgICBpZiAodG9kYXkuZ2V0RnVsbFllYXIoKSA9PT0gZGF0ZS5nZXRGdWxsWWVhcigpKSB7XG4gICAgICAgIGlmICh0b2RheS5nZXRNb250aCgpID09PSBkYXRlLmdldE1vbnRoKCkpIHJldHVybiAnVGhpcyBNb250aCdcbiAgICAgICAgaWYgKHRvZGF5LmdldE1vbnRoKCkgKyAxID09PSBkYXRlLmdldE1vbnRoKCkpIHJldHVybiAnTmV4dCBNb250aCdcbiAgICAgICAgaWYgKHRvZGF5LmdldE1vbnRoKCkgLSAxID09PSBkYXRlLmdldE1vbnRoKCkpIHJldHVybiAnTGFzdCBNb250aCdcbiAgICAgICAgcmV0dXJuIEZVTExNT05USFNbZGF0ZS5nZXRNb250aCgpXVxuICAgIH1cbiAgICByZXR1cm4gRlVMTE1PTlRIU1tkYXRlLmdldE1vbnRoKCldICsgJyAnICsgZGF0ZS5nZXRGdWxsWWVhcigpXG59XG5cbi8vIFRoZSBvbmUgYmVsb3cgc2Nyb2xscyBzbW9vdGhseSB0byBhIHkgcG9zaXRpb24uXG5leHBvcnQgZnVuY3Rpb24gc21vb3RoU2Nyb2xsKHRvOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBsZXQgc3RhcnQ6IG51bWJlcnxudWxsID0gbnVsbFxuICAgICAgICBjb25zdCBmcm9tID0gZG9jdW1lbnQuYm9keS5zY3JvbGxUb3BcbiAgICAgICAgY29uc3QgYW1vdW50ID0gdG8gLSBmcm9tXG4gICAgICAgIGNvbnN0IHN0ZXAgPSAodGltZXN0YW1wOiBudW1iZXIpID0+IHtcbiAgICAgICAgICAgIGlmIChzdGFydCA9PSBudWxsKSB7IHN0YXJ0ID0gdGltZXN0YW1wIH1cbiAgICAgICAgICAgIGNvbnN0IHByb2dyZXNzID0gdGltZXN0YW1wIC0gc3RhcnRcbiAgICAgICAgICAgIHdpbmRvdy5zY3JvbGxUbygwLCBmcm9tICsgKGFtb3VudCAqIChwcm9ncmVzcyAvIDM1MCkpKVxuICAgICAgICAgICAgaWYgKHByb2dyZXNzIDwgMzUwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3RBbmltYXRpb25GcmFtZShzdGVwKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBfJChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCduYXYnKSkuY2xhc3NMaXN0LnJlbW92ZSgnaGVhZHJvb20tLXVucGlubmVkJylcbiAgICAgICAgICAgICAgICByZXNvbHZlKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RlcClcbiAgICB9KVxufVxuXG4vLyBBbmQgYSBmdW5jdGlvbiB0byBhcHBseSBhbiBpbmsgZWZmZWN0XG5leHBvcnQgZnVuY3Rpb24gcmlwcGxlKGVsOiBIVE1MRWxlbWVudCk6IHZvaWQge1xuICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIChldnQpID0+IHtcbiAgICAgICAgaWYgKGV2dC53aGljaCAhPT0gMSkgcmV0dXJuIC8vIE5vdCBsZWZ0IGJ1dHRvblxuICAgICAgICBjb25zdCB3YXZlID0gZWxlbWVudCgnc3BhbicsICd3YXZlJylcbiAgICAgICAgY29uc3Qgc2l6ZSA9IE1hdGgubWF4KE51bWJlcihlbC5vZmZzZXRXaWR0aCksIE51bWJlcihlbC5vZmZzZXRIZWlnaHQpKVxuICAgICAgICB3YXZlLnN0eWxlLndpZHRoID0gKHdhdmUuc3R5bGUuaGVpZ2h0ID0gc2l6ZSArICdweCcpXG5cbiAgICAgICAgbGV0IHggPSBldnQuY2xpZW50WFxuICAgICAgICBsZXQgeSA9IGV2dC5jbGllbnRZXG4gICAgICAgIGNvbnN0IHJlY3QgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgICAgICB4IC09IHJlY3QubGVmdFxuICAgICAgICB5IC09IHJlY3QudG9wXG5cbiAgICAgICAgd2F2ZS5zdHlsZS50b3AgPSAoeSAtIChzaXplIC8gMikpICsgJ3B4J1xuICAgICAgICB3YXZlLnN0eWxlLmxlZnQgPSAoeCAtIChzaXplIC8gMikpICsgJ3B4J1xuICAgICAgICBlbC5hcHBlbmRDaGlsZCh3YXZlKVxuICAgICAgICB3YXZlLnNldEF0dHJpYnV0ZSgnZGF0YS1ob2xkJywgU3RyaW5nKERhdGUubm93KCkpKVxuICAgICAgICBmb3JjZUxheW91dCh3YXZlKVxuICAgICAgICB3YXZlLnN0eWxlLnRyYW5zZm9ybSA9ICdzY2FsZSgyLjUpJ1xuICAgIH0pXG4gICAgZWwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIChldnQpID0+IHtcbiAgICAgICAgaWYgKGV2dC53aGljaCAhPT0gMSkgcmV0dXJuIC8vIE9ubHkgZm9yIGxlZnQgYnV0dG9uXG4gICAgICAgIGNvbnN0IHdhdmVzID0gZWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnd2F2ZScpXG4gICAgICAgIHdhdmVzLmZvckVhY2goKHdhdmUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGRpZmYgPSBEYXRlLm5vdygpIC0gTnVtYmVyKHdhdmUuZ2V0QXR0cmlidXRlKCdkYXRhLWhvbGQnKSlcbiAgICAgICAgICAgIGNvbnN0IGRlbGF5ID0gTWF0aC5tYXgoMzUwIC0gZGlmZiwgMClcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICh3YXZlIGFzIEhUTUxFbGVtZW50KS5zdHlsZS5vcGFjaXR5ID0gJzAnXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHdhdmUucmVtb3ZlKClcbiAgICAgICAgICAgICAgICB9LCA1NTApXG4gICAgICAgICAgICB9LCBkZWxheSlcbiAgICAgICAgfSlcbiAgICB9KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY3NzTnVtYmVyKGNzczogc3RyaW5nfG51bGwpOiBudW1iZXIge1xuICAgIGlmICghY3NzKSByZXR1cm4gMFxuICAgIHJldHVybiBwYXJzZUludChjc3MsIDEwKVxufVxuXG4vLyBGb3IgZWFzZSBvZiBhbmltYXRpb25zLCBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIHByb21pc2UgaXMgZGVmaW5lZC5cbmV4cG9ydCBmdW5jdGlvbiBhbmltYXRlRWwoZWw6IEhUTUxFbGVtZW50LCBrZXlmcmFtZXM6IEFuaW1hdGlvbktleUZyYW1lW10sIG9wdGlvbnM6IEFuaW1hdGlvbk9wdGlvbnMpOlxuICAgIFByb21pc2U8QW5pbWF0aW9uUGxheWJhY2tFdmVudD4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGNvbnN0IHBsYXllciA9IGVsLmFuaW1hdGUoa2V5ZnJhbWVzLCBvcHRpb25zKVxuICAgICAgICBwbGF5ZXIub25maW5pc2ggPSAoZSkgPT4gcmVzb2x2ZShlKVxuICAgIH0pXG59XG4iXSwic291cmNlUm9vdCI6IiJ9