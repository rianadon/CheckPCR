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
        }
        else {
            window.scrollTo(0, Object(_display__WEBPACK_IMPORTED_MODULE_6__["getScroll"])());
            NAV_ELEMENT.classList.add('headroom--locked');
            setTimeout(() => {
                NAV_ELEMENT.classList.remove('headroom--unpinned');
                NAV_ELEMENT.classList.remove('headroom--locked');
                NAV_ELEMENT.classList.add('headroom--pinned');
                Object(_util__WEBPACK_IMPORTED_MODULE_13__["requestIdleCallback"])(() => {
                    Object(_navigation__WEBPACK_IMPORTED_MODULE_7__["zeroListDateOffset"])();
                    updateListNav();
                    Object(_display__WEBPACK_IMPORTED_MODULE_6__["display"])();
                }, { timeout: 2000 });
            }, 350);
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
// In order to make the previous date / next date buttons do something, they need event listeners.
Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('listnext').addEventListener('click', () => {
    const pd = Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('listprevdate');
    const td = Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('listnowdate');
    const nd = Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('listnextdate');
    Object(_navigation__WEBPACK_IMPORTED_MODULE_7__["incrementListDateOffset"])();
    Object(_display__WEBPACK_IMPORTED_MODULE_6__["display"])();
    nd.style.display = 'inline-block';
    return Promise.race([
        Object(_util__WEBPACK_IMPORTED_MODULE_13__["animateEl"])(td, [
            { transform: 'translateX(0%)', opacity: 1 },
            { opacity: 0 },
            { transform: 'translateX(-100%)', opacity: 0 }
        ], { duration: 300, easing: 'ease-out' }),
        Object(_util__WEBPACK_IMPORTED_MODULE_13__["animateEl"])(nd, [
            { transform: 'translateX(0%)', opacity: 0 },
            { opacity: 0 },
            { transform: 'translateX(-100%)', opacity: 1 }
        ], { duration: 300, easing: 'ease-out' })
    ]).then(() => {
        pd.innerHTML = td.innerHTML;
        td.innerHTML = nd.innerHTML;
        const listDate2 = new Date();
        listDate2.setDate(listDate2.getDate() + 1 + Object(_navigation__WEBPACK_IMPORTED_MODULE_7__["getListDateOffset"])());
        nd.innerHTML = Object(_util__WEBPACK_IMPORTED_MODULE_13__["dateString"])(listDate2).replace('Today', 'Now');
        return nd.style.display = 'none';
    });
});
// The event listener for the previous date button is mostly the same.
Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('listbefore').addEventListener('click', () => {
    const pd = Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('listprevdate');
    const td = Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('listnowdate');
    const nd = Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('listnextdate');
    Object(_navigation__WEBPACK_IMPORTED_MODULE_7__["decrementListDateOffset"])();
    Object(_display__WEBPACK_IMPORTED_MODULE_6__["display"])();
    pd.style.display = 'inline-block';
    return Promise.race([
        Object(_util__WEBPACK_IMPORTED_MODULE_13__["animateEl"])(td, [
            { transform: 'translateX(-100%)', opacity: 1 },
            { opacity: 0 },
            { transform: 'translateX(0%)', opacity: 0 }
        ], { duration: 300, easing: 'ease-out' }),
        Object(_util__WEBPACK_IMPORTED_MODULE_13__["animateEl"])(pd, [
            { transform: 'translateX(-100%)', opacity: 0 },
            { opacity: 0 },
            { transform: 'translateX(0%)', opacity: 1 }
        ], { duration: 300, easing: 'ease-out' })
    ]).then(() => {
        nd.innerHTML = td.innerHTML;
        td.innerHTML = pd.innerHTML;
        const listDate2 = new Date();
        listDate2.setDate((listDate2.getDate() + Object(_navigation__WEBPACK_IMPORTED_MODULE_7__["getListDateOffset"])()) - 1);
        pd.innerHTML = Object(_util__WEBPACK_IMPORTED_MODULE_13__["dateString"])(listDate2).replace('Today', 'Now');
        return pd.style.display = 'none';
    });
});
// Whenever a date is double clicked, long tapped, or force touched, list view for that day is displayed.
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
function switchToList(evt) {
    if (Object(_util__WEBPACK_IMPORTED_MODULE_13__["_$h"])(evt.target).classList.contains('month') || Object(_util__WEBPACK_IMPORTED_MODULE_13__["_$h"])(evt.target).classList.contains('date')) {
        Object(_navigation__WEBPACK_IMPORTED_MODULE_7__["setListDateOffset"])(Object(_dates__WEBPACK_IMPORTED_MODULE_5__["toDateNum"])(Number(Object(_util__WEBPACK_IMPORTED_MODULE_13__["_$h"])(Object(_util__WEBPACK_IMPORTED_MODULE_13__["_$h"])(evt.target).parentNode).getAttribute('data-date'))) - Object(_dates__WEBPACK_IMPORTED_MODULE_5__["today"])());
        updateListNav();
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
    if (!(e instanceof HTMLInputElement))
        return;
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
                Object(_util__WEBPACK_IMPORTED_MODULE_6__["localStorageWrite"])('data', getData()); // Store for offline use
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
                Object(_util__WEBPACK_IMPORTED_MODULE_6__["localStorageWrite"])('data', getData()); // Store for offline use
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
/*! exports provided: forceLayout, capitalizeString, send, elemById, element, _$, _$h, localStorageRead, localStorageWrite, requestIdleCallback, dateString, smoothScroll, ripple, cssNumber, animateEl */
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50LnRzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2FjdGl2aXR5LnRzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2Fzc2lnbm1lbnQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvYXZhdGFyLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2NhbGVuZGFyLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2N1c3RvbUFkZGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2Vycm9yRGlzcGxheS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9yZXNpemVyLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL3NuYWNrYmFyLnRzIiwid2VicGFjazovLy8uL3NyYy9jb29raWVzLnRzIiwid2VicGFjazovLy8uL3NyYy9kYXRlcy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZGlzcGxheS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbmF2aWdhdGlvbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGNyLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW5zL2FjdGl2aXR5LnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW5zL2F0aGVuYS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2lucy9jdXN0b21Bc3NpZ25tZW50cy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2lucy9kb25lLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW5zL21vZGlmaWVkQXNzaWdubWVudHMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NldHRpbmdzLnRzIiwid2VicGFjazovLy8uL3NyYy91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNB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QUM1QixDQUFDO0FBRUQsd0VBQXdFO0FBQ2xFLG1CQUFvQixFQUFlLEVBQUUsU0FBOEIsRUFBRSxPQUF5QjtJQUVoRyxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1FBQ25DLE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQztRQUM3QyxNQUFNLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQ3ZDLENBQUMsQ0FBQztBQUNOLENBQUMiLCJmaWxlIjoiYXBwLWJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9jbGllbnQudHNcIik7XG4iLCJpbXBvcnQgeyBlbGVtQnlJZCwgZWxlbWVudCwgbG9jYWxTdG9yYWdlUmVhZCwgbG9jYWxTdG9yYWdlV3JpdGUsIHNlbmQgfSBmcm9tICcuL3V0aWwnXHJcblxyXG5leHBvcnQgY29uc3QgVkVSU0lPTiA9ICcyLjI0LjMnXHJcblxyXG5jb25zdCBWRVJTSU9OX1VSTCA9ICdodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vMTlSeWFuQS9DaGVja1BDUi9tYXN0ZXIvdmVyc2lvbi50eHQnXHJcbmNvbnN0IENPTU1JVF9VUkwgPSAobG9jYXRpb24ucHJvdG9jb2wgPT09ICdjaHJvbWUtZXh0ZW5zaW9uOicgP1xyXG4gICAgJ2h0dHBzOi8vYXBpLmdpdGh1Yi5jb20vcmVwb3MvMTlSeWFuQS9DaGVja1BDUi9naXQvcmVmcy9oZWFkcy9tYXN0ZXInIDogJy9hcGkvY29tbWl0JylcclxuY29uc3QgTkVXU19VUkwgPSAnaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbS9naXN0cy8yMWJmMTFhNDI5ZGEyNTc1MzlhNjg1MjBmNTEzYTM4YidcclxuXHJcbmZ1bmN0aW9uIGZvcm1hdENvbW1pdE1lc3NhZ2UobWVzc2FnZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIHJldHVybiBtZXNzYWdlLnN1YnN0cihtZXNzYWdlLmluZGV4T2YoJ1xcblxcbicpICsgMilcclxuICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcKiAoLio/KSg/PSR8XFxuKS9nLCAoYSwgYikgPT4gYDxsaT4ke2J9PC9saT5gKVxyXG4gICAgICAgICAgICAgICAgICAucmVwbGFjZSgvPlxcbjwvZywgJz48JylcclxuICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcbi9nLCAnPGJyPicpXHJcbn1cclxuXHJcbi8vIEZvciB1cGRhdGluZywgYSByZXF1ZXN0IHdpbGwgYmUgc2VuZCB0byBHaXRodWIgdG8gZ2V0IHRoZSBjdXJyZW50IGNvbW1pdCBpZCBhbmQgY2hlY2sgdGhhdCBhZ2FpbnN0IHdoYXQncyBzdG9yZWRcclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNoZWNrQ29tbWl0KCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCByZXNwID0gYXdhaXQgc2VuZChWRVJTSU9OX1VSTCwgJ3RleHQnKVxyXG4gICAgICAgIGNvbnN0IGMgPSByZXNwLnJlc3BvbnNlVGV4dC50cmltKClcclxuICAgICAgICBjb25zb2xlLmxvZyhgQ3VycmVudCB2ZXJzaW9uOiAke2N9ICR7VkVSU0lPTiA9PT0gYyA/ICcobm8gdXBkYXRlIGF2YWlsYWJsZSknIDogJyh1cGRhdGUgYXZhaWxhYmxlKSd9YClcclxuICAgICAgICBlbGVtQnlJZCgnbmV3dmVyc2lvbicpLmlubmVySFRNTCA9IGNcclxuICAgICAgICBpZiAoVkVSU0lPTiAhPT0gYykge1xyXG4gICAgICAgICAgICBlbGVtQnlJZCgndXBkYXRlSWdub3JlJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAobG9jYXRpb24ucHJvdG9jb2wgPT09ICdjaHJvbWUtZXh0ZW5zaW9uOicpIHtcclxuICAgICAgICAgICAgICAgICAgICBlbGVtQnlJZCgndXBkYXRlJykuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbUJ5SWQoJ3VwZGF0ZUJhY2tncm91bmQnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgMzUwKVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKClcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgY29uc3QgcmVzcDIgPSBhd2FpdCBzZW5kKENPTU1JVF9VUkwsICdqc29uJylcclxuICAgICAgICAgICAgY29uc3QgeyBzaGEsIHVybCB9ID0gcmVzcDIucmVzcG9uc2Uub2JqZWN0XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3AzID0gYXdhaXQgc2VuZCgobG9jYXRpb24ucHJvdG9jb2wgPT09ICdjaHJvbWUtZXh0ZW5zaW9uOicgPyB1cmwgOiBgL2FwaS9jb21taXQvJHtzaGF9YCksICdqc29uJylcclxuICAgICAgICAgICAgZWxlbUJ5SWQoJ3Bhc3RVcGRhdGVWZXJzaW9uJykuaW5uZXJIVE1MID0gVkVSU0lPTlxyXG4gICAgICAgICAgICBlbGVtQnlJZCgnbmV3VXBkYXRlVmVyc2lvbicpLmlubmVySFRNTCA9IGNcclxuICAgICAgICAgICAgZWxlbUJ5SWQoJ3VwZGF0ZUZlYXR1cmVzJykuaW5uZXJIVE1MID0gZm9ybWF0Q29tbWl0TWVzc2FnZShyZXNwMy5yZXNwb25zZS5tZXNzYWdlKVxyXG4gICAgICAgICAgICBlbGVtQnlJZCgndXBkYXRlQmFja2dyb3VuZCcpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXHJcbiAgICAgICAgICAgIGVsZW1CeUlkKCd1cGRhdGUnKS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG4gICAgICAgIH1cclxuICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdDb3VsZCBub3QgYWNjZXNzIEdpdGh1Yi4gSGVyZVxcJ3MgdGhlIGVycm9yOicsIGVycilcclxuICAgIH1cclxufVxyXG5cclxubGV0IG5ld3NVcmw6IHN0cmluZ3xudWxsID0gbnVsbFxyXG5sZXQgbmV3c0NvbW1pdDogc3RyaW5nfG51bGwgPSBudWxsXHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmV0Y2hOZXdzKCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCByZXNwID0gYXdhaXQgc2VuZChORVdTX1VSTCwgJ2pzb24nKVxyXG4gICAgICAgIGxldCBsYXN0ID0gbG9jYWxTdG9yYWdlUmVhZCgnbmV3c0NvbW1pdCcpXHJcbiAgICAgICAgbmV3c0NvbW1pdCA9IHJlc3AucmVzcG9uc2UuaGlzdG9yeVswXS52ZXJzaW9uXHJcblxyXG4gICAgICAgIGlmIChsYXN0ID09IG51bGwpIHtcclxuICAgICAgICAgICAgbGFzdCA9IG5ld3NDb21taXRcclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlV3JpdGUoJ25ld3NDb21taXQnLCBuZXdzQ29tbWl0KVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbmV3c1VybCA9IHJlc3AucmVzcG9uc2UuZmlsZXNbJ3VwZGF0ZXMuaHRtJ10ucmF3X3VybFxyXG5cclxuICAgICAgICBpZiAobGFzdCAhPT0gbmV3c0NvbW1pdCkge1xyXG4gICAgICAgICAgICBnZXROZXdzKClcclxuICAgICAgICB9XHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnQ291bGQgbm90IGFjY2VzcyBHaXRodWIuIEhlcmVcXCdzIHRoZSBlcnJvcjonLCBlcnIpXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXROZXdzKG9uZmFpbD86ICgpID0+IHZvaWQpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIGlmICghbmV3c1VybCkge1xyXG4gICAgICAgIGlmIChvbmZhaWwpIG9uZmFpbCgpXHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICB9XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHJlc3AgPSBhd2FpdCBzZW5kKG5ld3NVcmwpXHJcbiAgICAgICAgbG9jYWxTdG9yYWdlLm5ld3NDb21taXQgPSBuZXdzQ29tbWl0XHJcbiAgICAgICAgcmVzcC5yZXNwb25zZVRleHQuc3BsaXQoJzxocj4nKS5mb3JFYWNoKChuZXdzKSA9PiB7XHJcbiAgICAgICAgICAgIGVsZW1CeUlkKCduZXdzQ29udGVudCcpLmFwcGVuZENoaWxkKGVsZW1lbnQoJ2RpdicsICduZXdzSXRlbScsIG5ld3MpKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgZWxlbUJ5SWQoJ25ld3NCYWNrZ3JvdW5kJykuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcclxuICAgICAgICBlbGVtQnlJZCgnbmV3cycpLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnQ291bGQgbm90IGFjY2VzcyBHaXRodWIuIEhlcmVcXCdzIHRoZSBlcnJvcjonLCBlcnIpXHJcbiAgICAgICAgaWYgKG9uZmFpbCkgb25mYWlsKClcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBjaGVja0NvbW1pdCwgZmV0Y2hOZXdzLCBnZXROZXdzLCBWRVJTSU9OIH0gZnJvbSAnLi9hcHAnXHJcbmltcG9ydCB7IGNsb3NlT3BlbmVkLCBnZXRFUyB9IGZyb20gJy4vY29tcG9uZW50cy9hc3NpZ25tZW50J1xyXG5pbXBvcnQgeyB1cGRhdGVBdmF0YXIgfSBmcm9tICcuL2NvbXBvbmVudHMvYXZhdGFyJ1xyXG5pbXBvcnQgeyB1cGRhdGVOZXdUaXBzIH0gZnJvbSAnLi9jb21wb25lbnRzL2N1c3RvbUFkZGVyJ1xyXG5pbXBvcnQgeyBnZXRSZXNpemVBc3NpZ25tZW50cywgcmVzaXplLCByZXNpemVDYWxsZXIgfSBmcm9tICcuL2NvbXBvbmVudHMvcmVzaXplcidcclxuaW1wb3J0IHsgdG9EYXRlTnVtLCB0b2RheSB9IGZyb20gJy4vZGF0ZXMnXHJcbmltcG9ydCB7IGRpc3BsYXksIGZvcm1hdFVwZGF0ZSwgZ2V0U2Nyb2xsIH0gZnJvbSAnLi9kaXNwbGF5J1xyXG5pbXBvcnQge1xyXG4gICAgZGVjcmVtZW50TGlzdERhdGVPZmZzZXQsXHJcbiAgICBnZXRMaXN0RGF0ZU9mZnNldCxcclxuICAgIGluY3JlbWVudExpc3REYXRlT2Zmc2V0LFxyXG4gICAgc2V0TGlzdERhdGVPZmZzZXQsXHJcbiAgICB6ZXJvTGlzdERhdGVPZmZzZXRcclxufSBmcm9tICcuL25hdmlnYXRpb24nXHJcbmltcG9ydCB7IGRvbG9naW4sIGZldGNoLCBnZXRDbGFzc2VzLCBnZXREYXRhLCBsb2dvdXQsIHNldERhdGEsIHN3aXRjaFZpZXdzIH0gZnJvbSAnLi9wY3InXHJcbmltcG9ydCB7IGFkZEFjdGl2aXR5LCByZWNlbnRBY3Rpdml0eSB9IGZyb20gJy4vcGx1Z2lucy9hY3Rpdml0eSdcclxuaW1wb3J0IHsgdXBkYXRlQXRoZW5hRGF0YSB9IGZyb20gJy4vcGx1Z2lucy9hdGhlbmEnXHJcbmltcG9ydCB7IGFkZFRvRXh0cmEsIHBhcnNlQ3VzdG9tVGFzaywgc2F2ZUV4dHJhIH0gZnJvbSAnLi9wbHVnaW5zL2N1c3RvbUFzc2lnbm1lbnRzJ1xyXG5pbXBvcnQgeyBnZXRTZXR0aW5nLCBzZXRTZXR0aW5nLCBzZXR0aW5ncyB9IGZyb20gJy4vc2V0dGluZ3MnXHJcbmltcG9ydCB7XHJcbiAgICBfJCxcclxuICAgIF8kaCxcclxuICAgIGFuaW1hdGVFbCxcclxuICAgIGRhdGVTdHJpbmcsXHJcbiAgICBlbGVtQnlJZCxcclxuICAgIGVsZW1lbnQsXHJcbiAgICBmb3JjZUxheW91dCxcclxuICAgIGxvY2FsU3RvcmFnZVJlYWQsXHJcbiAgICBsb2NhbFN0b3JhZ2VXcml0ZSxcclxuICAgIHJlcXVlc3RJZGxlQ2FsbGJhY2ssXHJcbiAgICByaXBwbGVcclxufSBmcm9tICcuL3V0aWwnXHJcblxyXG5pZiAobG9jYWxTdG9yYWdlUmVhZCgnZGF0YScpICE9IG51bGwpIHtcclxuICAgIHNldERhdGEobG9jYWxTdG9yYWdlUmVhZCgnZGF0YScpKVxyXG59XHJcblxyXG4vLyBBZGRpdGlvbmFsbHksIGlmIGl0J3MgdGhlIHVzZXIncyBmaXJzdCB0aW1lLCB0aGUgcGFnZSBpcyBzZXQgdG8gdGhlIHdlbGNvbWUgcGFnZS5cclxuaWYgKCFsb2NhbFN0b3JhZ2VSZWFkKCdub1dlbGNvbWUnKSkge1xyXG4gICAgbG9jYWxTdG9yYWdlV3JpdGUoJ25vV2VsY29tZScsIHRydWUpXHJcbiAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICd3ZWxjb21lLmh0bWwnXHJcbn1cclxuXHJcbmNvbnN0IE5BVl9FTEVNRU5UID0gXyQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbmF2JykpXHJcbmNvbnN0IElOUFVUX0VMRU1FTlRTID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcclxuICAgICdpbnB1dFt0eXBlPXRleHRdOm5vdCgjbmV3VGV4dCk6bm90KFtyZWFkb25seV0pLCBpbnB1dFt0eXBlPXBhc3N3b3JkXSwgaW5wdXRbdHlwZT1lbWFpbF0sICcgK1xyXG4gICAgJ2lucHV0W3R5cGU9dXJsXSwgaW5wdXRbdHlwZT10ZWxdLCBpbnB1dFt0eXBlPW51bWJlcl06bm90KC5jb250cm9sKSwgaW5wdXRbdHlwZT1zZWFyY2hdJ1xyXG4pIGFzIE5vZGVMaXN0T2Y8SFRNTElucHV0RWxlbWVudD5cclxuXHJcbi8vICMjIyMgU2VuZCBmdW5jdGlvblxyXG4vL1xyXG5cclxuLy8gVGhpcyBmdW5jdGlvbiBkaXNwbGF5cyBhIHNuYWNrYmFyIHRvIHRlbGwgdGhlIHVzZXIgc29tZXRoaW5nXHJcblxyXG4vLyA8YSBuYW1lPVwicmV0XCIvPlxyXG4vLyBSZXRyaWV2aW5nIGRhdGFcclxuLy8gLS0tLS0tLS0tLS0tLS0tXHJcbi8vXHJcbmVsZW1CeUlkKCdsb2dpbicpLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIChldnQpID0+IHtcclxuICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICBkb2xvZ2luKG51bGwsIHRydWUpXHJcbn0pXHJcblxyXG4vLyBUaGUgdmlldyBzd2l0Y2hpbmcgYnV0dG9uIG5lZWRzIGFuIGV2ZW50IGhhbmRsZXIuXHJcbmVsZW1CeUlkKCdzd2l0Y2hWaWV3cycpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgc3dpdGNoVmlld3MpXHJcblxyXG4vLyBUaGUgc2FtZSBnb2VzIGZvciB0aGUgbG9nIG91dCBidXR0b24uXHJcbmVsZW1CeUlkKCdsb2dvdXQnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGxvZ291dClcclxuXHJcbi8vIE5vdyB3ZSBhc3NpZ24gaXQgdG8gY2xpY2tpbmcgdGhlIGJhY2tncm91bmQuXHJcbmVsZW1CeUlkKCdiYWNrZ3JvdW5kJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbG9zZU9wZW5lZClcclxuXHJcbi8vIFRoZW4sIHRoZSB0YWJzIGFyZSBtYWRlIGludGVyYWN0aXZlLlxyXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcjbmF2VGFicz5saScpLmZvckVhY2goKHRhYiwgdGFiSW5kZXgpID0+IHtcclxuICB0YWIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZ0KSA9PiB7XHJcbiAgICBpZiAoIXNldHRpbmdzLnZpZXdUcmFucykge1xyXG4gICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ25vVHJhbnMnKVxyXG4gICAgICBmb3JjZUxheW91dChkb2N1bWVudC5ib2R5KVxyXG4gICAgfVxyXG4gICAgbG9jYWxTdG9yYWdlV3JpdGUoJ3ZpZXcnLCB0YWJJbmRleClcclxuICAgIGRvY3VtZW50LmJvZHkuc2V0QXR0cmlidXRlKCdkYXRhLXZpZXcnLCBTdHJpbmcodGFiSW5kZXgpKVxyXG4gICAgaWYgKHRhYkluZGV4ID09PSAxKSB7XHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJlc2l6ZUNhbGxlcilcclxuICAgICAgICBpZiAoc2V0dGluZ3Mudmlld1RyYW5zKSB7XHJcbiAgICAgICAgICAgIGxldCBzdGFydDogbnVtYmVyfG51bGwgPSBudWxsXHJcbiAgICAgICAgICAgIC8vIFRoZSBjb2RlIGJlbG93IGlzIHRoZSBzYW1lIGNvZGUgdXNlZCBpbiB0aGUgcmVzaXplKCkgZnVuY3Rpb24uIEl0IGJhc2ljYWxseSBqdXN0XHJcbiAgICAgICAgICAgIC8vIHBvc2l0aW9ucyB0aGUgYXNzaWdubWVudHMgY29ycmVjdGx5IGFzIHRoZXkgYW5pbWF0ZVxyXG4gICAgICAgICAgICBjb25zdCB3aWR0aHMgPSBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5jb250YWlucygnc2hvd0luZm8nKSA/XHJcbiAgICAgICAgICAgICAgICBbNjUwLCAxMTAwLCAxODAwLCAyNzAwLCAzODAwLCA1MTAwXSA6IFszNTAsIDgwMCwgMTUwMCwgMjQwMCwgMzUwMCwgNDgwMF1cclxuICAgICAgICAgICAgbGV0IGNvbHVtbnMgPSAxXHJcbiAgICAgICAgICAgIHdpZHRocy5mb3JFYWNoKCh3LCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHdpbmRvdy5pbm5lcldpZHRoID4gdykgeyBjb2x1bW5zID0gaW5kZXggKyAxIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgY29uc3QgYXNzaWdubWVudHMgPSBnZXRSZXNpemVBc3NpZ25tZW50cygpXHJcbiAgICAgICAgICAgIGNvbnN0IGNvbHVtbkhlaWdodHMgPSBBcnJheS5mcm9tKG5ldyBBcnJheShjb2x1bW5zKSwgKCkgPT4gMClcclxuICAgICAgICAgICAgY29uc3Qgc3RlcCA9ICh0aW1lc3RhbXA6IG51bWJlcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFjb2x1bW5zKSB0aHJvdyBuZXcgRXJyb3IoJ0NvbHVtbnMgbnVtYmVyIG5vdCBmb3VuZCcpXHJcbiAgICAgICAgICAgICAgICBhc3NpZ25tZW50cy5mb3JFYWNoKChhc3NpZ25tZW50LCBuKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY29sID0gbiAlIGNvbHVtbnNcclxuICAgICAgICAgICAgICAgICAgICBpZiAobiA8IGNvbHVtbnMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1uSGVpZ2h0c1tjb2xdID0gMFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBhc3NpZ25tZW50LnN0eWxlLnRvcCA9IGNvbHVtbkhlaWdodHNbY29sXSArICdweCdcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc3RhcnQgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBbZU5hbWUsIHNOYW1lXSA9IGdldEVTKGFzc2lnbm1lbnQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9sZExlZnQgPSBOdW1iZXIoc05hbWUuc3Vic3RyaW5nKDEpKSAqIDEwMCAvIDcgKyAnJSdcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgb2xkUmlnaHQgPSBOdW1iZXIoZU5hbWUuc3Vic3RyaW5nKDEpKSAqIDEwMCAvIDcgKyAnJSdcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGxlZnQgPSAoKDEwMCAvIGNvbHVtbnMpICogY29sKSArICclJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByaWdodCA9ICgoMTAwIC8gY29sdW1ucykgKiAoY29sdW1ucyAtIGNvbCAtIDEpKSArICclJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRlRWwoYXNzaWdubWVudCwgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBsZWZ0OiBvbGRMZWZ0LCByaWdodDogb2xkUmlnaHQgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgbGVmdCwgcmlnaHQgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdLCB7IGR1cmF0aW9uOiAzMDAgfSkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhc3NpZ25tZW50LnN0eWxlLmxlZnQgPSBsZWZ0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhc3NpZ25tZW50LnN0eWxlLnJpZ2h0ID0gcmlnaHRcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY29sdW1uSGVpZ2h0c1tjb2xdICs9IGFzc2lnbm1lbnQub2Zmc2V0SGVpZ2h0ICsgMjRcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICBpZiAoc3RhcnQgPT0gbnVsbCkgc3RhcnQgPSB0aW1lc3RhbXBcclxuICAgICAgICAgICAgICAgIGlmICgodGltZXN0YW1wIC0gc3RhcnQpIDwgMzUwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RlcClcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0ZXApXHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFjb2x1bW5zKSB0aHJvdyBuZXcgRXJyb3IoJ0NvbHVtbnMgbnVtYmVyIG5vdCBmb3VuZCcpXHJcbiAgICAgICAgICAgICAgICBhc3NpZ25tZW50cy5mb3JFYWNoKChhc3NpZ25tZW50LCBuKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY29sID0gbiAlIGNvbHVtbnNcclxuICAgICAgICAgICAgICAgICAgICBpZiAobiA8IGNvbHVtbnMpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb2x1bW5IZWlnaHRzW2NvbF0gPSAwXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGFzc2lnbm1lbnQuc3R5bGUudG9wID0gY29sdW1uSGVpZ2h0c1tjb2xdICsgJ3B4J1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbHVtbkhlaWdodHNbY29sXSArPSBhc3NpZ25tZW50Lm9mZnNldEhlaWdodCArIDI0XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9LCAzNTApXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmVzaXplKClcclxuICAgICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHdpbmRvdy5zY3JvbGxUbygwLCBnZXRTY3JvbGwoKSlcclxuICAgICAgICBOQVZfRUxFTUVOVC5jbGFzc0xpc3QuYWRkKCdoZWFkcm9vbS0tbG9ja2VkJylcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgTkFWX0VMRU1FTlQuY2xhc3NMaXN0LnJlbW92ZSgnaGVhZHJvb20tLXVucGlubmVkJylcclxuICAgICAgICAgICAgTkFWX0VMRU1FTlQuY2xhc3NMaXN0LnJlbW92ZSgnaGVhZHJvb20tLWxvY2tlZCcpXHJcbiAgICAgICAgICAgIE5BVl9FTEVNRU5ULmNsYXNzTGlzdC5hZGQoJ2hlYWRyb29tLS1waW5uZWQnKVxyXG4gICAgICAgICAgICByZXF1ZXN0SWRsZUNhbGxiYWNrKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHplcm9MaXN0RGF0ZU9mZnNldCgpXHJcbiAgICAgICAgICAgICAgICB1cGRhdGVMaXN0TmF2KClcclxuICAgICAgICAgICAgICAgIGRpc3BsYXkoKVxyXG4gICAgICAgICAgICB9LCB7dGltZW91dDogMjAwMH0pXHJcbiAgICAgICAgfSwgMzUwKVxyXG4gICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCByZXNpemVDYWxsZXIpXHJcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmFzc2lnbm1lbnQnKS5mb3JFYWNoKChhc3NpZ25tZW50KSA9PiB7XHJcbiAgICAgICAgICAgIChhc3NpZ25tZW50IGFzIEhUTUxFbGVtZW50KS5zdHlsZS50b3AgPSAnYXV0bydcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG4gICAgaWYgKCFzZXR0aW5ncy52aWV3VHJhbnMpIHtcclxuICAgICAgZm9yY2VMYXlvdXQoZG9jdW1lbnQuYm9keSlcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ25vVHJhbnMnKVxyXG4gICAgICB9LCAzNTApXHJcbiAgICB9XHJcbiAgfSlcclxufSlcclxuXHJcbi8vIEFuZCB0aGUgaW5mbyB0YWJzIChqdXN0IGEgbGl0dGxlIGxlc3MgY29kZSlcclxuZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnI2luZm9UYWJzPmxpJykuZm9yRWFjaCgodGFiLCB0YWJJbmRleCkgPT4ge1xyXG4gICAgdGFiLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2dCkgPT4ge1xyXG4gICAgICAgIGVsZW1CeUlkKCdpbmZvJykuc2V0QXR0cmlidXRlKCdkYXRhLXZpZXcnLCBTdHJpbmcodGFiSW5kZXgpKVxyXG4gICAgfSlcclxufSlcclxuXHJcbi8vIFRoZSB2aWV3IGlzIHNldCB0byB3aGF0IGl0IHdhcyBsYXN0LlxyXG5pZiAobG9jYWxTdG9yYWdlUmVhZCgndmlldycpICE9IG51bGwpIHtcclxuICBkb2N1bWVudC5ib2R5LnNldEF0dHJpYnV0ZSgnZGF0YS12aWV3JywgbG9jYWxTdG9yYWdlUmVhZCgndmlldycpKVxyXG4gIGlmIChsb2NhbFN0b3JhZ2VSZWFkKCd2aWV3JykgPT09IDEpIHtcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCByZXNpemVDYWxsZXIpXHJcbiAgfVxyXG59XHJcblxyXG4vLyBBZGRpdGlvbmFsbHksIHRoZSBhY3RpdmUgY2xhc3MgbmVlZHMgdG8gYmUgYWRkZWQgd2hlbiBpbnB1dHMgYXJlIHNlbGVjdGVkIChmb3IgdGhlIGxvZ2luIGJveCkuXHJcbklOUFVUX0VMRU1FTlRTLmZvckVhY2goKGlucHV0KSA9PiB7XHJcbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZXZ0KSA9PiB7XHJcbiAgICAgICAgXyRoKF8kaChpbnB1dC5wYXJlbnROb2RlKS5xdWVyeVNlbGVjdG9yKCdsYWJlbCcpKS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG4gICAgfSlcclxuICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgKGV2dCkgPT4ge1xyXG4gICAgICAgIF8kaChfJGgoaW5wdXQucGFyZW50Tm9kZSkucXVlcnlTZWxlY3RvcignbGFiZWwnKSkuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuICAgIH0pXHJcbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgKGV2dCkgPT4ge1xyXG4gICAgICAgIGlmIChpbnB1dC52YWx1ZS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgXyRoKF8kaChpbnB1dC5wYXJlbnROb2RlKS5xdWVyeVNlbGVjdG9yKCdsYWJlbCcpKS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbn0pXHJcblxyXG4vLyBXaGVuIHRoZSBlc2NhcGUga2V5IGlzIHByZXNzZWQsIHRoZSBjdXJyZW50IGFzc2lnbm1lbnQgc2hvdWxkIGJlIGNsb3NlZC5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZXZ0KSA9PiB7XHJcbiAgaWYgKGV2dC53aGljaCA9PT0gMjcpIHsgLy8gRXNjYXBlIGtleSBwcmVzc2VkXHJcbiAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnZnVsbCcpLmxlbmd0aCAhPT0gMCkgeyByZXR1cm4gY2xvc2VPcGVuZWQobmV3IEV2ZW50KCdHZW5lcmF0ZWQgRXZlbnQnKSkgfVxyXG4gIH1cclxufSk7XHJcblxyXG4vLyBJZiBpdCdzIHdpbnRlciB0aW1lLCBhIGNsYXNzIGlzIGFkZGVkIHRvIHRoZSBib2R5IGVsZW1lbnQuXHJcbigoKSA9PiB7XHJcbiAgICBjb25zdCB0b2RheURhdGUgPSBuZXcgRGF0ZSgpXHJcbiAgICBpZiAobmV3IERhdGUodG9kYXlEYXRlLmdldEZ1bGxZZWFyKCksIDEwLCAyNykgPD0gdG9kYXlEYXRlICYmXHJcbiAgICAgICAgdG9kYXlEYXRlIDw9IG5ldyBEYXRlKHRvZGF5RGF0ZS5nZXRGdWxsWWVhcigpLCAxMSwgMzIpKSB7XHJcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnd2ludGVyJylcclxuICAgIH1cclxufSkoKVxyXG5cclxuLy8gRm9yIHRoZSBuYXZiYXIgdG9nZ2xlIGJ1dHRvbnMsIGEgZnVuY3Rpb24gdG8gdG9nZ2xlIHRoZSBhY3Rpb24gaXMgZGVmaW5lZCB0byBlbGltaW5hdGUgY29kZS5cclxuZnVuY3Rpb24gbmF2VG9nZ2xlKGVsZW06IHN0cmluZywgbHM6IHN0cmluZywgZj86ICgpID0+IHZvaWQpOiB2b2lkIHtcclxuICAgIHJpcHBsZShlbGVtQnlJZChlbGVtKSlcclxuICAgIGVsZW1CeUlkKGVsZW0pLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCAoKSA9PiB7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QudG9nZ2xlKGxzKVxyXG4gICAgICAgIHJlc2l6ZSgpXHJcbiAgICAgICAgbG9jYWxTdG9yYWdlV3JpdGUobHMsIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKGxzKSlcclxuICAgICAgICBpZiAoZiAhPSBudWxsKSBmKClcclxuICAgIH0pXHJcbiAgICBpZiAobG9jYWxTdG9yYWdlUmVhZChscykpIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZChscylcclxufVxyXG5cclxuLy8gVGhlIGJ1dHRvbiB0byBzaG93L2hpZGUgY29tcGxldGVkIGFzc2lnbm1lbnRzIGluIGxpc3QgdmlldyBhbHNvIG5lZWRzIGV2ZW50IGxpc3RlbmVycy5cclxubmF2VG9nZ2xlKCdjdkJ1dHRvbicsICdzaG93RG9uZScsICgpID0+IHNldFRpbWVvdXQocmVzaXplLCAxMDAwKSlcclxuXHJcbi8vIFRoZSBzYW1lIGdvZXMgZm9yIHRoZSBidXR0b24gdGhhdCBzaG93cyB1cGNvbWluZyB0ZXN0cy5cclxuaWYgKGxvY2FsU3RvcmFnZS5zaG93SW5mbyA9PSBudWxsKSB7IGxvY2FsU3RvcmFnZS5zaG93SW5mbyA9IEpTT04uc3RyaW5naWZ5KHRydWUpIH1cclxubmF2VG9nZ2xlKCdpbmZvQnV0dG9uJywgJ3Nob3dJbmZvJylcclxuXHJcbi8vIFRoaXMgYWxzbyBnZXRzIHJlcGVhdGVkIGZvciB0aGUgdGhlbWUgdG9nZ2xpbmcuXHJcbm5hdlRvZ2dsZSgnbGlnaHRCdXR0b24nLCAnZGFyaycpXHJcblxyXG4vLyBJbiBvcmRlciB0byBtYWtlIHRoZSBwcmV2aW91cyBkYXRlIC8gbmV4dCBkYXRlIGJ1dHRvbnMgZG8gc29tZXRoaW5nLCB0aGV5IG5lZWQgZXZlbnQgbGlzdGVuZXJzLlxyXG5lbGVtQnlJZCgnbGlzdG5leHQnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICBjb25zdCBwZCA9IGVsZW1CeUlkKCdsaXN0cHJldmRhdGUnKVxyXG4gIGNvbnN0IHRkID0gZWxlbUJ5SWQoJ2xpc3Rub3dkYXRlJylcclxuICBjb25zdCBuZCA9IGVsZW1CeUlkKCdsaXN0bmV4dGRhdGUnKVxyXG4gIGluY3JlbWVudExpc3REYXRlT2Zmc2V0KClcclxuICBkaXNwbGF5KClcclxuICBuZC5zdHlsZS5kaXNwbGF5ID0gJ2lubGluZS1ibG9jaydcclxuICByZXR1cm4gUHJvbWlzZS5yYWNlKFtcclxuICAgIGFuaW1hdGVFbCh0ZCwgW1xyXG4gICAgICB7dHJhbnNmb3JtOiAndHJhbnNsYXRlWCgwJSknLCBvcGFjaXR5OiAxfSxcclxuICAgICAge29wYWNpdHk6IDB9LFxyXG4gICAgICB7dHJhbnNmb3JtOiAndHJhbnNsYXRlWCgtMTAwJSknLCBvcGFjaXR5OiAwfVxyXG4gICAgXSwge2R1cmF0aW9uOiAzMDAsIGVhc2luZzogJ2Vhc2Utb3V0J30pLFxyXG4gICAgYW5pbWF0ZUVsKG5kLCBbXHJcbiAgICAgIHt0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKDAlKScsIG9wYWNpdHk6IDB9LFxyXG4gICAgICB7b3BhY2l0eTogMH0sXHJcbiAgICAgIHt0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKC0xMDAlKScsIG9wYWNpdHk6IDF9XHJcbiAgICBdLCB7ZHVyYXRpb246IDMwMCwgZWFzaW5nOiAnZWFzZS1vdXQnfSlcclxuICBdKS50aGVuKCgpID0+IHtcclxuICAgIHBkLmlubmVySFRNTCA9IHRkLmlubmVySFRNTFxyXG4gICAgdGQuaW5uZXJIVE1MID0gbmQuaW5uZXJIVE1MXHJcbiAgICBjb25zdCBsaXN0RGF0ZTIgPSBuZXcgRGF0ZSgpXHJcbiAgICBsaXN0RGF0ZTIuc2V0RGF0ZShsaXN0RGF0ZTIuZ2V0RGF0ZSgpICsgMSArIGdldExpc3REYXRlT2Zmc2V0KCkpXHJcbiAgICBuZC5pbm5lckhUTUwgPSBkYXRlU3RyaW5nKGxpc3REYXRlMikucmVwbGFjZSgnVG9kYXknLCAnTm93JylcclxuICAgIHJldHVybiBuZC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXHJcbiAgfSlcclxufSlcclxuXHJcbi8vIFRoZSBldmVudCBsaXN0ZW5lciBmb3IgdGhlIHByZXZpb3VzIGRhdGUgYnV0dG9uIGlzIG1vc3RseSB0aGUgc2FtZS5cclxuZWxlbUJ5SWQoJ2xpc3RiZWZvcmUnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICBjb25zdCBwZCA9IGVsZW1CeUlkKCdsaXN0cHJldmRhdGUnKVxyXG4gIGNvbnN0IHRkID0gZWxlbUJ5SWQoJ2xpc3Rub3dkYXRlJylcclxuICBjb25zdCBuZCA9IGVsZW1CeUlkKCdsaXN0bmV4dGRhdGUnKVxyXG4gIGRlY3JlbWVudExpc3REYXRlT2Zmc2V0KClcclxuICBkaXNwbGF5KClcclxuICBwZC5zdHlsZS5kaXNwbGF5ID0gJ2lubGluZS1ibG9jaydcclxuICByZXR1cm4gUHJvbWlzZS5yYWNlKFtcclxuICAgIGFuaW1hdGVFbCh0ZCwgW1xyXG4gICAgICB7dHJhbnNmb3JtOiAndHJhbnNsYXRlWCgtMTAwJSknLCBvcGFjaXR5OiAxfSxcclxuICAgICAge29wYWNpdHk6IDB9LFxyXG4gICAgICB7dHJhbnNmb3JtOiAndHJhbnNsYXRlWCgwJSknLCBvcGFjaXR5OiAwfVxyXG4gICAgXSwge2R1cmF0aW9uOiAzMDAsIGVhc2luZzogJ2Vhc2Utb3V0J30pLFxyXG4gICAgYW5pbWF0ZUVsKHBkLCBbXHJcbiAgICAgIHt0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKC0xMDAlKScsIG9wYWNpdHk6IDB9LFxyXG4gICAgICB7b3BhY2l0eTogMH0sXHJcbiAgICAgIHt0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKDAlKScsIG9wYWNpdHk6IDF9XHJcbiAgICBdLCB7ZHVyYXRpb246IDMwMCwgZWFzaW5nOiAnZWFzZS1vdXQnfSlcclxuICBdKS50aGVuKCgpID0+IHtcclxuICAgIG5kLmlubmVySFRNTCA9IHRkLmlubmVySFRNTFxyXG4gICAgdGQuaW5uZXJIVE1MID0gcGQuaW5uZXJIVE1MXHJcbiAgICBjb25zdCBsaXN0RGF0ZTIgPSBuZXcgRGF0ZSgpXHJcbiAgICBsaXN0RGF0ZTIuc2V0RGF0ZSgobGlzdERhdGUyLmdldERhdGUoKSArIGdldExpc3REYXRlT2Zmc2V0KCkpIC0gMSlcclxuICAgIHBkLmlubmVySFRNTCA9IGRhdGVTdHJpbmcobGlzdERhdGUyKS5yZXBsYWNlKCdUb2RheScsICdOb3cnKVxyXG4gICAgcmV0dXJuIHBkLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcclxuICB9KVxyXG59KVxyXG5cclxuLy8gV2hlbmV2ZXIgYSBkYXRlIGlzIGRvdWJsZSBjbGlja2VkLCBsb25nIHRhcHBlZCwgb3IgZm9yY2UgdG91Y2hlZCwgbGlzdCB2aWV3IGZvciB0aGF0IGRheSBpcyBkaXNwbGF5ZWQuXHJcbmZ1bmN0aW9uIHVwZGF0ZUxpc3ROYXYoKTogdm9pZCB7XHJcbiAgICBjb25zdCBkID0gbmV3IERhdGUoKVxyXG4gICAgZC5zZXREYXRlKChkLmdldERhdGUoKSArIGdldExpc3REYXRlT2Zmc2V0KCkpIC0gMSlcclxuICAgIGNvbnN0IHVwID0gKGlkOiBzdHJpbmcpID0+IHtcclxuICAgICAgICBlbGVtQnlJZChpZCkuaW5uZXJIVE1MID0gZGF0ZVN0cmluZyhkKS5yZXBsYWNlKCdUb2RheScsICdOb3cnKVxyXG4gICAgICAgIHJldHVybiBkLnNldERhdGUoZC5nZXREYXRlKCkgKyAxKVxyXG4gICAgfVxyXG4gICAgdXAoJ2xpc3RwcmV2ZGF0ZScpXHJcbiAgICB1cCgnbGlzdG5vd2RhdGUnKVxyXG4gICAgdXAoJ2xpc3RuZXh0ZGF0ZScpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHN3aXRjaFRvTGlzdChldnQ6IEV2ZW50KTogdm9pZCB7XHJcbiAgICBpZiAoXyRoKGV2dC50YXJnZXQpLmNsYXNzTGlzdC5jb250YWlucygnbW9udGgnKSB8fCBfJGgoZXZ0LnRhcmdldCkuY2xhc3NMaXN0LmNvbnRhaW5zKCdkYXRlJykpIHtcclxuICAgICAgICBzZXRMaXN0RGF0ZU9mZnNldCh0b0RhdGVOdW0oTnVtYmVyKF8kaChfJGgoZXZ0LnRhcmdldCkucGFyZW50Tm9kZSkuZ2V0QXR0cmlidXRlKCdkYXRhLWRhdGUnKSkpIC0gdG9kYXkoKSlcclxuICAgICAgICB1cGRhdGVMaXN0TmF2KClcclxuICAgICAgICBkb2N1bWVudC5ib2R5LnNldEF0dHJpYnV0ZSgnZGF0YS12aWV3JywgJzEnKVxyXG4gICAgICAgIHJldHVybiBkaXNwbGF5KClcclxuICAgIH1cclxufVxyXG5cclxuZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdkYmxjbGljaycsIHN3aXRjaFRvTGlzdClcclxuZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCd3ZWJraXRtb3VzZWZvcmNldXAnLCBzd2l0Y2hUb0xpc3QpO1xyXG4oKCkgPT4ge1xyXG4gICAgbGV0IHRhcHRpbWVyOiBudW1iZXJ8bnVsbCA9IG51bGxcclxuICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIChldnQpID0+IHRhcHRpbWVyID0gc2V0VGltZW91dCgoKCkgPT4gc3dpdGNoVG9MaXN0KGV2dCkpLCAxMDAwKSlcclxuICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCAoZXZ0KSA9PiB7XHJcbiAgICAgICAgaWYgKHRhcHRpbWVyKSBjbGVhclRpbWVvdXQodGFwdGltZXIpXHJcbiAgICAgICAgdGFwdGltZXIgPSBudWxsXHJcbiAgICB9KVxyXG59KSgpXHJcblxyXG4vLyA8YSBuYW1lPVwic2lkZVwiLz5cclxuLy8gU2lkZSBtZW51IGFuZCBOYXZiYXJcclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuLy9cclxuLy8gVGhlIFtIZWFkcm9vbSBsaWJyYXJ5XShodHRwczovL2dpdGh1Yi5jb20vV2lja3lOaWxsaWFtcy9oZWFkcm9vbS5qcykgaXMgdXNlZCB0byBzaG93IHRoZSBuYXZiYXIgd2hlbiBzY3JvbGxpbmcgdXBcclxuY29uc3QgaGVhZHJvb20gPSBuZXcgSGVhZHJvb20oXyQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbmF2JykpLCB7XHJcbiAgdG9sZXJhbmNlOiAxMCxcclxuICBvZmZzZXQ6IDY2XHJcbn0pXHJcbmhlYWRyb29tLmluaXQoKVxyXG5cclxuLy8gQWxzbywgdGhlIHNpZGUgbWVudSBuZWVkcyBldmVudCBsaXN0ZW5lcnMuXHJcbmVsZW1CeUlkKCdjb2xsYXBzZUJ1dHRvbicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gIGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJ1xyXG4gIGVsZW1CeUlkKCdzaWRlTmF2JykuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuICByZXR1cm4gZWxlbUJ5SWQoJ3NpZGVCYWNrZ3JvdW5kJykuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcclxufSlcclxuXHJcbmVsZW1CeUlkKCdzaWRlQmFja2dyb3VuZCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gIGVsZW1CeUlkKCdzaWRlQmFja2dyb3VuZCcpLnN0eWxlLm9wYWNpdHkgPSAnMCdcclxuICBlbGVtQnlJZCgnc2lkZU5hdicpLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgZWxlbUJ5SWQoJ2RyYWdUYXJnZXQnKS5zdHlsZS53aWR0aCA9ICcnXHJcbiAgcmV0dXJuIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICdhdXRvJ1xyXG4gICAgZWxlbUJ5SWQoJ3NpZGVCYWNrZ3JvdW5kJykuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xyXG4gIH1cclxuICAsIDM1MClcclxufSlcclxuXHJcbnVwZGF0ZUF2YXRhcigpXHJcblxyXG4vLyA8YSBuYW1lPVwiYXRoZW5hXCIvPiBBdGhlbmEgKFNjaG9vbG9neSlcclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tXHJcbi8vXHJcblxyXG4vLyA8YSBuYW1lPVwic2V0dGluZ3NcIi8+IFNldHRpbmdzXHJcbi8vIC0tLS0tLS0tXHJcbi8vXHJcbi8vIFRoZSBjb2RlIGJlbG93IHVwZGF0ZXMgdGhlIGN1cnJlbnQgdmVyc2lvbiB0ZXh0IGluIHRoZSBzZXR0aW5ncy4gSSBzaG91bGQndmUgcHV0IHRoaXMgdW5kZXIgdGhlXHJcbi8vIFVwZGF0ZXMgc2VjdGlvbiwgYnV0IGl0IHNob3VsZCBnbyBiZWZvcmUgdGhlIGRpc3BsYXkoKSBmdW5jdGlvbiBmb3JjZXMgYSByZWZsb3cuXHJcbmVsZW1CeUlkKCd2ZXJzaW9uJykuaW5uZXJIVE1MID0gVkVSU0lPTlxyXG5cclxuLy8gVG8gYnJpbmcgdXAgdGhlIHNldHRpbmdzIHdpbmRvd3MsIGFuIGV2ZW50IGxpc3RlbmVyIG5lZWRzIHRvIGJlIGFkZGVkIHRvIHRoZSBidXR0b24uXHJcbmVsZW1CeUlkKCdzZXR0aW5nc0InKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgIGVsZW1CeUlkKCdzaWRlQmFja2dyb3VuZCcpLmNsaWNrKClcclxuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnc2V0dGluZ3NTaG93bicpXHJcbiAgICBlbGVtQnlJZCgnYnJhbmQnKS5pbm5lckhUTUwgPSAnU2V0dGluZ3MnXHJcbiAgICByZXR1cm4gc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgXyRoKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ21haW4nKSkuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xyXG4gICAgfSlcclxufSlcclxuXHJcbi8vIFRoZSBiYWNrIGJ1dHRvbiBhbHNvIG5lZWRzIHRvIGNsb3NlIHRoZSBzZXR0aW5ncyB3aW5kb3cuXHJcbmVsZW1CeUlkKCdiYWNrQnV0dG9uJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICBfJGgoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbWFpbicpKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xyXG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdzZXR0aW5nc1Nob3duJylcclxuICAgIHJldHVybiBlbGVtQnlJZCgnYnJhbmQnKS5pbm5lckhUTUwgPSAnQ2hlY2sgUENSJ1xyXG59KVxyXG5cclxuLy8gVGhlIGNvZGUgYmVsb3cgaXMgd2hhdCB0aGUgc2V0dGluZ3MgY29udHJvbC5cclxuaWYgKHNldHRpbmdzLnNlcFRhc2tzKSB7XHJcbiAgICBlbGVtQnlJZCgnaW5mbycpLmNsYXNzTGlzdC5hZGQoJ2lzVGFza3MnKVxyXG4gICAgZWxlbUJ5SWQoJ25ldycpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcclxufVxyXG5pZiAoc2V0dGluZ3MuaG9saWRheVRoZW1lcykgeyBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ2hvbGlkYXlUaGVtZXMnKSB9XHJcbmlmIChzZXR0aW5ncy5zZXBUYXNrQ2xhc3MpIHsgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdzZXBUYXNrQ2xhc3MnKSB9XHJcbmludGVyZmFjZSBJQ29sb3JNYXAgeyBbY2xzOiBzdHJpbmddOiBzdHJpbmcgfVxyXG5sZXQgYXNzaWdubWVudENvbG9yczogSUNvbG9yTWFwID0gbG9jYWxTdG9yYWdlUmVhZCgnYXNzaWdubWVudENvbG9ycycsIHtcclxuICAgIGNsYXNzd29yazogJyM2ODlmMzgnLCBob21ld29yazogJyMyMTk2ZjMnLCBsb25ndGVybTogJyNmNTdjMDAnLCB0ZXN0OiAnI2Y0NDMzNidcclxufSlcclxubGV0IGNsYXNzQ29sb3JzID0gbG9jYWxTdG9yYWdlUmVhZCgnY2xhc3NDb2xvcnMnLCAoKSA9PiB7XHJcbiAgICBjb25zdCBjYzogSUNvbG9yTWFwID0ge31cclxuICAgIGNvbnN0IGRhdGEgPSBnZXREYXRhKClcclxuICAgIGlmICghZGF0YSkgcmV0dXJuIGNjXHJcbiAgICBkYXRhLmNsYXNzZXMuZm9yRWFjaCgoYzogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgY2NbY10gPSAnIzYxNjE2MSdcclxuICAgIH0pXHJcbiAgICByZXR1cm4gY2NcclxufSlcclxuZWxlbUJ5SWQoYCR7c2V0dGluZ3MuY29sb3JUeXBlfUNvbG9yc2ApLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsICgpID0+IHtcclxuICBpZiAoc2V0dGluZ3MucmVmcmVzaE9uRm9jdXMpIGZldGNoKClcclxufSlcclxuZnVuY3Rpb24gaW50ZXJ2YWxSZWZyZXNoKCk6IHZvaWQge1xyXG4gICAgY29uc3QgciA9IHNldHRpbmdzLnJlZnJlc2hSYXRlXHJcbiAgICBpZiAociA+IDApIHtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5kZWJ1ZygnUmVmcmVzaGluZyBiZWNhdXNlIG9mIHRpbWVyJylcclxuICAgICAgICAgICAgZmV0Y2goKVxyXG4gICAgICAgICAgICBpbnRlcnZhbFJlZnJlc2goKVxyXG4gICAgICAgIH0sIHIgKiA2MCAqIDEwMDApXHJcbiAgICB9XHJcbn1cclxuaW50ZXJ2YWxSZWZyZXNoKClcclxuXHJcbi8vIEZvciBjaG9vc2luZyBjb2xvcnMsIHRoZSBjb2xvciBjaG9vc2luZyBib3hlcyBuZWVkIHRvIGJlIGluaXRpYWxpemVkLlxyXG5jb25zdCBwYWxldHRlOiBJQ29sb3JNYXAgPSB7XHJcbiAgJyNmNDQzMzYnOiAnI0I3MUMxQycsXHJcbiAgJyNlOTFlNjMnOiAnIzg4MEU0RicsXHJcbiAgJyM5YzI3YjAnOiAnIzRBMTQ4QycsXHJcbiAgJyM2NzNhYjcnOiAnIzMxMUI5MicsXHJcbiAgJyMzZjUxYjUnOiAnIzFBMjM3RScsXHJcbiAgJyMyMTk2ZjMnOiAnIzBENDdBMScsXHJcbiAgJyMwM2E5ZjQnOiAnIzAxNTc5QicsXHJcbiAgJyMwMGJjZDQnOiAnIzAwNjA2NCcsXHJcbiAgJyMwMDk2ODgnOiAnIzAwNEQ0MCcsXHJcbiAgJyM0Y2FmNTAnOiAnIzFCNUUyMCcsXHJcbiAgJyM2ODlmMzgnOiAnIzMzNjkxRScsXHJcbiAgJyNhZmI0MmInOiAnIzgyNzcxNycsXHJcbiAgJyNmYmMwMmQnOiAnI0Y1N0YxNycsXHJcbiAgJyNmZmEwMDAnOiAnI0ZGNkYwMCcsXHJcbiAgJyNmNTdjMDAnOiAnI0U2NTEwMCcsXHJcbiAgJyNmZjU3MjInOiAnI0JGMzYwQycsXHJcbiAgJyM3OTU1NDgnOiAnIzNFMjcyMycsXHJcbiAgJyM2MTYxNjEnOiAnIzIxMjEyMSdcclxufVxyXG5cclxuZ2V0Q2xhc3NlcygpLmZvckVhY2goKGM6IHN0cmluZykgPT4ge1xyXG4gICAgY29uc3QgZCA9IGVsZW1lbnQoJ2RpdicsIFtdLCBjKVxyXG4gICAgZC5zZXRBdHRyaWJ1dGUoJ2RhdGEtY29udHJvbCcsIGMpXHJcbiAgICBkLmFwcGVuZENoaWxkKGVsZW1lbnQoJ3NwYW4nLCBbXSkpXHJcbiAgICBlbGVtQnlJZCgnY2xhc3NDb2xvcnMnKS5hcHBlbmRDaGlsZChkKVxyXG59KVxyXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY29sb3JzJykuZm9yRWFjaCgoZSkgPT4ge1xyXG4gICAgZS5xdWVyeVNlbGVjdG9yQWxsKCdkaXYnKS5mb3JFYWNoKChjb2xvcikgPT4ge1xyXG4gICAgICAgIGNvbnN0IGNvbnRyb2xsZWRDb2xvciA9IGNvbG9yLmdldEF0dHJpYnV0ZSgnZGF0YS1jb250cm9sJylcclxuICAgICAgICBpZiAoIWNvbnRyb2xsZWRDb2xvcikgdGhyb3cgbmV3IEVycm9yKCdFbGVtZW50IGhhcyBubyBjb250cm9sbGVkIGNvbG9yJylcclxuXHJcbiAgICAgICAgY29uc3Qgc3AgPSBfJGgoY29sb3IucXVlcnlTZWxlY3Rvcignc3BhbicpKVxyXG4gICAgICAgIGNvbnN0IGxpc3ROYW1lID0gZS5nZXRBdHRyaWJ1dGUoJ2lkJykgPT09ICdjbGFzc0NvbG9ycycgPyAnY2xhc3NDb2xvcnMnIDogJ2Fzc2lnbm1lbnRDb2xvcnMnXHJcbiAgICAgICAgY29uc3QgbGlzdFNldHRlciA9ICh2OiBJQ29sb3JNYXApID0+IHtcclxuICAgICAgICAgICAgZS5nZXRBdHRyaWJ1dGUoJ2lkJykgPT09ICdjbGFzc0NvbG9ycycgPyBjbGFzc0NvbG9ycyA9IHYgOiBhc3NpZ25tZW50Q29sb3JzID0gdlxyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBsaXN0ID0gZS5nZXRBdHRyaWJ1dGUoJ2lkJykgPT09ICdjbGFzc0NvbG9ycycgPyBjbGFzc0NvbG9ycyA6IGFzc2lnbm1lbnRDb2xvcnNcclxuICAgICAgICBzcC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBsaXN0W2NvbnRyb2xsZWRDb2xvcl1cclxuICAgICAgICBPYmplY3Qua2V5cyhwYWxldHRlKS5mb3JFYWNoKChwKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBlID0gZWxlbWVudCgnc3BhbicsIFtdKVxyXG4gICAgICAgICAgICBwZS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBwXHJcbiAgICAgICAgICAgIGlmIChwID09PSBsaXN0W2NvbnRyb2xsZWRDb2xvcl0pIHtcclxuICAgICAgICAgICAgICAgIHBlLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzcC5hcHBlbmRDaGlsZChwZSlcclxuICAgICAgICB9KVxyXG4gICAgICAgIGNvbnN0IGN1c3RvbSA9IGVsZW1lbnQoJ3NwYW4nLCBbJ2N1c3RvbUNvbG9yJ10sIGA8YT5DdXN0b208L2E+IFxcXHJcbiAgICA8aW5wdXQgdHlwZT0ndGV4dCcgcGxhY2Vob2xkZXI9J1dhcyAke2xpc3RbY29udHJvbGxlZENvbG9yXX0nIC8+IFxcXHJcbiAgICA8c3BhbiBjbGFzcz0nY3VzdG9tSW5mbyc+VXNlIGFueSBDU1MgdmFsaWQgY29sb3IgbmFtZSwgc3VjaCBhcyBcXFxyXG4gICAgPGNvZGU+I0Y0NDMzNjwvY29kZT4gb3IgPGNvZGU+cmdiKDY0LCA0MywgMik8L2NvZGU+IG9yIDxjb2RlPmN5YW48L2NvZGU+PC9zcGFuPiBcXFxyXG4gICAgPGEgY2xhc3M9J2N1c3RvbU9rJz5TZXQ8L2E+YClcclxuICAgICAgICBjdXN0b20uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZ0KSA9PiBldnQuc3RvcFByb3BhZ2F0aW9uKCkpXHJcbiAgICAgICAgXyQoY3VzdG9tLnF1ZXJ5U2VsZWN0b3IoJ2EnKSkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZ0KSA9PiB7XHJcbiAgICAgICAgICAgIHNwLmNsYXNzTGlzdC50b2dnbGUoJ29uQ3VzdG9tJylcclxuICAgICAgICAgICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICAgICAgfSlcclxuICAgICAgICBzcC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldnQpID0+IHtcclxuICAgICAgICAgICAgaWYgKHNwLmNsYXNzTGlzdC5jb250YWlucygnY2hvb3NlJykpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IF8kaChldnQudGFyZ2V0KVxyXG4gICAgICAgICAgICAgICAgY29uc3QgYmcgPSB0aW55Y29sb3IodGFyZ2V0LnN0eWxlLmJhY2tncm91bmRDb2xvciB8fCAnIzAwMCcpLnRvSGV4U3RyaW5nKClcclxuICAgICAgICAgICAgICAgIGxpc3RbY29udHJvbGxlZENvbG9yXSA9IGJnXHJcbiAgICAgICAgICAgICAgICBzcC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBiZ1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2VsZWN0ZWQgPSB0YXJnZXQucXVlcnlTZWxlY3RvcignLnNlbGVjdGVkJylcclxuICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJylcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRhcmdldC5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpXHJcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2VbbGlzdE5hbWVdID0gSlNPTi5zdHJpbmdpZnkobGlzdClcclxuICAgICAgICAgICAgICAgIGxpc3RTZXR0ZXIobGlzdClcclxuICAgICAgICAgICAgICAgIHVwZGF0ZUNvbG9ycygpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc3AuY2xhc3NMaXN0LnRvZ2dsZSgnY2hvb3NlJylcclxuICAgICAgICB9KVxyXG4gICAgICAgIF8kKGN1c3RvbS5xdWVyeVNlbGVjdG9yKCcuY3VzdG9tT2snKSkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZ0KSA9PiB7XHJcbiAgICAgICAgICAgIHNwLmNsYXNzTGlzdC5yZW1vdmUoJ29uQ3VzdG9tJylcclxuICAgICAgICAgICAgc3AuY2xhc3NMaXN0LnRvZ2dsZSgnY2hvb3NlJylcclxuICAgICAgICAgICAgY29uc3Qgc2VsZWN0ZWRFbCA9IHNwLnF1ZXJ5U2VsZWN0b3IoJy5zZWxlY3RlZCcpXHJcbiAgICAgICAgICAgIGlmIChzZWxlY3RlZEVsICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHNlbGVjdGVkRWwuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNwLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IChsaXN0W2NvbnRyb2xsZWRDb2xvcl0gPSBfJChjdXN0b20ucXVlcnlTZWxlY3RvcignaW5wdXQnKSkudmFsdWUpXHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZVtsaXN0TmFtZV0gPSBKU09OLnN0cmluZ2lmeShsaXN0KVxyXG4gICAgICAgICAgICB1cGRhdGVDb2xvcnMoKVxyXG4gICAgICAgICAgICByZXR1cm4gZXZ0LnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICAgICAgfSlcclxuICAgIH0pXHJcbn0pXHJcblxyXG4vLyBUaGVuLCBhIGZ1bmN0aW9uIHRoYXQgdXBkYXRlcyB0aGUgY29sb3IgcHJlZmVyZW5jZXMgaXMgZGVmaW5lZC5cclxuZnVuY3Rpb24gdXBkYXRlQ29sb3JzKCk6IHZvaWQge1xyXG4gICAgY29uc3Qgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpXHJcbiAgICBzdHlsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJykpXHJcbiAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHN0eWxlKVxyXG4gICAgY29uc3Qgc2hlZXQgPSBfJChzdHlsZS5zaGVldCkgYXMgQ1NTU3R5bGVTaGVldFxyXG5cclxuICAgIGNvbnN0IGFkZENvbG9yUnVsZSA9IChzZWxlY3Rvcjogc3RyaW5nLCBsaWdodDogc3RyaW5nLCBkYXJrOiBzdHJpbmcsIGV4dHJhID0gJycpID0+IHtcclxuICAgICAgICBjb25zdCBtaXhlZCA9IHRpbnljb2xvci5taXgobGlnaHQsICcjMUI1RTIwJywgNzApLnRvSGV4U3RyaW5nKClcclxuICAgICAgICBzaGVldC5pbnNlcnRSdWxlKGAke2V4dHJhfS5hc3NpZ25tZW50JHtzZWxlY3Rvcn0geyBiYWNrZ3JvdW5kLWNvbG9yOiAke2xpZ2h0fTsgfWAsIDApXHJcbiAgICAgICAgc2hlZXQuaW5zZXJ0UnVsZShgJHtleHRyYX0uYXNzaWdubWVudCR7c2VsZWN0b3J9LmRvbmUgeyBiYWNrZ3JvdW5kLWNvbG9yOiAke2Rhcmt9OyB9YCwgMClcclxuICAgICAgICBzaGVldC5pbnNlcnRSdWxlKGAke2V4dHJhfS5hc3NpZ25tZW50JHtzZWxlY3Rvcn06OmJlZm9yZSB7IGJhY2tncm91bmQtY29sb3I6ICR7bWl4ZWR9OyB9YCwgMClcclxuICAgICAgICBzaGVldC5pbnNlcnRSdWxlKGAke2V4dHJhfS5hc3NpZ25tZW50SXRlbSR7c2VsZWN0b3J9PmkgeyBiYWNrZ3JvdW5kLWNvbG9yOiAke2xpZ2h0fTsgfWAsIDApXHJcbiAgICAgICAgc2hlZXQuaW5zZXJ0UnVsZShgJHtleHRyYX0uYXNzaWdubWVudEl0ZW0ke3NlbGVjdG9yfS5kb25lPmkgeyBiYWNrZ3JvdW5kLWNvbG9yOiAke2Rhcmt9OyB9YCwgMClcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjcmVhdGVQYWxldHRlID0gKGNvbG9yOiBzdHJpbmcpID0+IHRpbnljb2xvcihjb2xvcikuZGFya2VuKDI0KS50b0hleFN0cmluZygpXHJcblxyXG4gICAgaWYgKHNldHRpbmdzLmNvbG9yVHlwZSA9PT0gJ2Fzc2lnbm1lbnQnKSB7XHJcbiAgICAgICAgT2JqZWN0LmVudHJpZXMoYXNzaWdubWVudENvbG9ycykuZm9yRWFjaCgoW25hbWUsIGNvbG9yXSkgPT4ge1xyXG4gICAgICAgICAgICBhZGRDb2xvclJ1bGUoYC4ke25hbWV9YCwgY29sb3IsIHBhbGV0dGVbY29sb3JdIHx8IGNyZWF0ZVBhbGV0dGUoY29sb3IpKVxyXG4gICAgICAgIH0pXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIE9iamVjdC5lbnRyaWVzKGNsYXNzQ29sb3JzKS5mb3JFYWNoKChbbmFtZSwgY29sb3JdKSA9PiB7XHJcbiAgICAgICAgICAgIGFkZENvbG9yUnVsZShgW2RhdGEtY2xhc3M9XFxcIiR7bmFtZX1cXFwiXWAsIGNvbG9yLCBwYWxldHRlW2NvbG9yXSB8fCBjcmVhdGVQYWxldHRlKGNvbG9yKSlcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGFkZENvbG9yUnVsZSgnLnRhc2snLCAnI0Y1RjVGNScsICcjRTBFMEUwJylcclxuICAgIGFkZENvbG9yUnVsZSgnLnRhc2snLCAnIzQyNDI0MicsICcjMjEyMTIxJywgJy5kYXJrICcpXHJcbn1cclxuXHJcbi8vIFRoZSBmdW5jdGlvbiB0aGVuIG5lZWRzIHRvIGJlIGNhbGxlZC5cclxudXBkYXRlQ29sb3JzKClcclxuXHJcbi8vIFRoZSBlbGVtZW50cyB0aGF0IGNvbnRyb2wgdGhlIHNldHRpbmdzIGFsc28gbmVlZCBldmVudCBsaXN0ZW5lcnNcclxuZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnNldHRpbmdzQ29udHJvbCcpLmZvckVhY2goKGUpID0+IHtcclxuICAgIGlmICghKGUgaW5zdGFuY2VvZiBIVE1MSW5wdXRFbGVtZW50KSkgcmV0dXJuXHJcbiAgICBpZiAoZS50eXBlID09PSAnY2hlY2tib3gnKSB7XHJcbiAgICAgICAgZS5jaGVja2VkID0gZ2V0U2V0dGluZyhlLm5hbWUpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGUudmFsdWUgPSBnZXRTZXR0aW5nKGUubmFtZSlcclxuICAgIH1cclxuICAgIGUuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGV2dCkgPT4ge1xyXG4gICAgICAgIGlmIChlLnR5cGUgPT09ICdjaGVja2JveCcpIHtcclxuICAgICAgICAgICAgc2V0U2V0dGluZyhlLm5hbWUsIGUuY2hlY2tlZClcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBzZXRTZXR0aW5nKGUubmFtZSwgZS52YWx1ZSlcclxuICAgICAgICB9XHJcbiAgICAgICAgc3dpdGNoIChlLm5hbWUpIHtcclxuICAgICAgICAgICAgY2FzZSAncmVmcmVzaFJhdGUnOiByZXR1cm4gaW50ZXJ2YWxSZWZyZXNoKClcclxuICAgICAgICAgICAgY2FzZSAnZWFybHlUZXN0JzogcmV0dXJuIGRpc3BsYXkoKVxyXG4gICAgICAgICAgICBjYXNlICdhc3NpZ25tZW50U3Bhbic6IHJldHVybiBkaXNwbGF5KClcclxuICAgICAgICAgICAgY2FzZSAncHJvamVjdHNJblRlc3RQYW5lJzogcmV0dXJuIGRpc3BsYXkoKVxyXG4gICAgICAgICAgICBjYXNlICdoaWRlQXNzaWdubWVudHMnOiByZXR1cm4gZGlzcGxheSgpXHJcbiAgICAgICAgICAgIGNhc2UgJ2hvbGlkYXlUaGVtZXMnOiByZXR1cm4gZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QudG9nZ2xlKCdob2xpZGF5VGhlbWVzJywgZS5jaGVja2VkKVxyXG4gICAgICAgICAgICBjYXNlICdzZXBUYXNrQ2xhc3MnOiBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC50b2dnbGUoJ3NlcFRhc2tDbGFzcycsIGUuY2hlY2tlZCk7IHJldHVybiBkaXNwbGF5KClcclxuICAgICAgICAgICAgY2FzZSAnc2VwVGFza3MnOiByZXR1cm4gZWxlbUJ5SWQoJ3NlcFRhc2tzUmVmcmVzaCcpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxufSlcclxuXHJcbi8vIFRoaXMgYWxzbyBuZWVkcyB0byBiZSBkb25lIGZvciByYWRpbyBidXR0b25zXHJcbmNvbnN0IGNvbG9yVHlwZSA9XHJcbiAgICBfJChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBpbnB1dFtuYW1lPVxcXCJjb2xvclR5cGVcXFwiXVt2YWx1ZT1cXFwiJHtzZXR0aW5ncy5jb2xvclR5cGV9XFxcIl1gKSkgYXMgSFRNTElucHV0RWxlbWVudFxyXG5jb2xvclR5cGUuY2hlY2tlZCA9IHRydWVcclxuQXJyYXkuZnJvbShkb2N1bWVudC5nZXRFbGVtZW50c0J5TmFtZSgnY29sb3JUeXBlJykpLmZvckVhY2goKGMpID0+IHtcclxuICBjLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChldnQpID0+IHtcclxuICAgIGNvbnN0IHYgPSAoXyQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaW5wdXRbbmFtZT1cImNvbG9yVHlwZVwiXTpjaGVja2VkJykpIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlXHJcbiAgICBpZiAodiAhPT0gJ2Fzc2lnbm1lbnQnICYmIHYgIT09ICdjbGFzcycpIHJldHVyblxyXG4gICAgc2V0dGluZ3MuY29sb3JUeXBlID0gdlxyXG4gICAgaWYgKHYgPT09ICdjbGFzcycpIHtcclxuICAgICAgZWxlbUJ5SWQoJ2Fzc2lnbm1lbnRDb2xvcnMnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXHJcbiAgICAgIGVsZW1CeUlkKCdjbGFzc0NvbG9ycycpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBlbGVtQnlJZCgnYXNzaWdubWVudENvbG9ycycpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXHJcbiAgICAgIGVsZW1CeUlkKCdjbGFzc0NvbG9ycycpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcclxuICAgIH1cclxuICAgIHJldHVybiB1cGRhdGVDb2xvcnMoKVxyXG4gIH0pXHJcbn0pXHJcblxyXG4vLyBUaGUgc2FtZSBnb2VzIGZvciB0ZXh0YXJlYXMuXHJcbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3RleHRhcmVhJykuZm9yRWFjaCgoZSkgPT4ge1xyXG4gIGlmICgoZS5uYW1lICE9PSAnYXRoZW5hRGF0YVJhdycpICYmIChsb2NhbFN0b3JhZ2VbZS5uYW1lXSAhPSBudWxsKSkge1xyXG4gICAgZS52YWx1ZSA9IGxvY2FsU3RvcmFnZVtlLm5hbWVdXHJcbiAgfVxyXG4gIGUuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoZXZ0KSA9PiB7XHJcbiAgICBsb2NhbFN0b3JhZ2VbZS5uYW1lXSA9IGUudmFsdWVcclxuICAgIGlmIChlLm5hbWUgPT09ICdhdGhlbmFEYXRhUmF3Jykge1xyXG4gICAgICB1cGRhdGVBdGhlbmFEYXRhKGUudmFsdWUpXHJcbiAgICB9XHJcbiAgfSlcclxufSlcclxuXHJcbi8vIDxhIG5hbWU9XCJzdGFydGluZ1wiLz5cclxuLy8gU3RhcnRpbmcgZXZlcnl0aGluZ1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tXHJcbi8vXHJcbi8vIEZpbmFsbHkhIFdlIGFyZSAoYWxtb3N0KSBkb25lIVxyXG4vL1xyXG4vLyBCZWZvcmUgZ2V0dGluZyB0byBhbnl0aGluZywgbGV0J3MgcHJpbnQgb3V0IGEgd2VsY29taW5nIG1lc3NhZ2UgdG8gdGhlIGNvbnNvbGUhXHJcbmNvbnNvbGUubG9nKCclY0NoZWNrIFBDUicsICdjb2xvcjogIzAwNDAwMDsgZm9udC1zaXplOiAzZW0nKVxyXG5jb25zb2xlLmxvZyhgJWNWZXJzaW9uICR7VkVSU0lPTn0gKENoZWNrIGJlbG93IGZvciBjdXJyZW50IHZlcnNpb24pYCwgJ2ZvbnQtc2l6ZTogMS4xZW0nKVxyXG5jb25zb2xlLmxvZyhgV2VsY29tZSB0byB0aGUgZGV2ZWxvcGVyIGNvbnNvbGUgZm9yIHlvdXIgYnJvd3NlciEgQmVzaWRlcyBsb29raW5nIGF0IHRoZSBzb3VyY2UgY29kZSwgXFxcclxueW91IGNhbiBhbHNvIHBsYXkgYXJvdW5kIHdpdGggQ2hlY2sgUENSIGJ5IGV4ZWN1dGluZyB0aGUgbGluZXMgYmVsb3c6XHJcbiVjXFx0ZmV0Y2godHJ1ZSkgICAgICAgICAgICAgICAlYy8vIFJlbG9hZHMgYWxsIG9mIHlvdXIgYXNzaWdubWVudHMgKHRoZSB0cnVlIGlzIGZvciBmb3JjaW5nIGEgcmVsb2FkIGlmIG9uZSBcXFxyXG5oYXMgYWxyZWFkeSBiZWVuIHRyaWdnZXJlZCBpbiB0aGUgbGFzdCBtaW51dGUpXHJcbiVjXFx0ZGF0YSAgICAgICAgICAgICAgICAgICAgICAlYy8vIERpc3BsYXlzIHRoZSBvYmplY3QgdGhhdCBjb250YWlucyB0aGUgZGF0YSBwYXJzZWQgZnJvbSBQQ1IncyBpbnRlcmZhY2VcclxuJWNcXHRhY3Rpdml0eSAgICAgICAgICAgICAgICAgICVjLy8gVGhlIGRhdGEgZm9yIHRoZSBhc3NpZ25tZW50cyB0aGF0IHNob3cgdXAgaW4gdGhlIGFjdGl2aXR5IHBhbmVcclxuJWNcXHRleHRyYSAgICAgICAgICAgICAgICAgICAgICVjLy8gQWxsIG9mIHRoZSB0YXNrcyB5b3UndmUgY3JlYXRlZCBieSBjbGlja2luZyB0aGUgKyBidXR0b25cclxuJWNcXHRhdGhlbmFEYXRhICAgICAgICAgICAgICAgICVjLy8gVGhlIGRhdGEgZmV0Y2hlZCBmcm9tIEF0aGVuYSAoaWYgeW91J3ZlIHBhc3RlZCB0aGUgcmF3IGRhdGEgaW50byBzZXR0aW5ncylcclxuJWNcXHRzbmFja2JhcihcIkhlbGxvIFdvcmxkIVwiKSAgJWMvLyBDcmVhdGVzIGEgc25hY2tiYXIgc2hvd2luZyB0aGUgbWVzc2FnZSBcIkhlbGxvIFdvcmxkIVwiXHJcbiVjXFx0ZGlzcGxheUVycm9yKG5ldyBFcnJvcigpKSAlYy8vIERpc3BsYXlzIHRoZSBzdGFjayB0cmFjZSBmb3IgYSByYW5kb20gZXJyb3IgKEp1c3QgZG9uJ3Qgc3VibWl0IGl0ISlcclxuJWNcXHRjbG9zZUVycm9yKCkgICAgICAgICAgICAgICVjLy8gQ2xvc2VzIHRoYXQgZGlhbG9nYCxcclxuICAgICAgICAgICAgICAgLi4uKChbXSBhcyBzdHJpbmdbXSkuY29uY2F0KC4uLkFycmF5LmZyb20obmV3IEFycmF5KDgpLCAoKSA9PiBbJ2NvbG9yOiBpbml0aWFsJywgJ2NvbG9yOiBncmV5J10pKSkpXHJcbmNvbnNvbGUubG9nKCcnKVxyXG5cclxuLy8gVGhlIFwibGFzdCB1cGRhdGVkXCIgdGV4dCBpcyBzZXQgdG8gdGhlIGNvcnJlY3QgZGF0ZS5cclxuY29uc3QgdHJpZWRMYXN0VXBkYXRlID0gbG9jYWxTdG9yYWdlUmVhZCgnbGFzdFVwZGF0ZScpXHJcbmVsZW1CeUlkKCdsYXN0VXBkYXRlJykuaW5uZXJIVE1MID0gdHJpZWRMYXN0VXBkYXRlID8gZm9ybWF0VXBkYXRlKHRyaWVkTGFzdFVwZGF0ZSkgOiAnTmV2ZXInXHJcblxyXG5pZiAobG9jYWxTdG9yYWdlUmVhZCgnZGF0YScpICE9IG51bGwpIHtcclxuICAgIC8vIE5vdyBjaGVjayBpZiB0aGVyZSdzIGFjdGl2aXR5XHJcbiAgICByZWNlbnRBY3Rpdml0eSgpLmZvckVhY2goKGl0ZW0pID0+IHtcclxuICAgICAgICBhZGRBY3Rpdml0eShpdGVtWzBdLCBpdGVtWzFdLCBuZXcgRGF0ZShpdGVtWzJdKSwgZmFsc2UsIGl0ZW1bM10pXHJcbiAgICB9KVxyXG5cclxuICAgIGRpc3BsYXkoKVxyXG59XHJcblxyXG5mZXRjaCgpXHJcblxyXG4vLyA8YSBuYW1lPVwiZXZlbnRzXCIvPlxyXG4vLyBFdmVudHNcclxuLy8gLS0tLS0tXHJcbi8vXHJcbi8vIFRoZSBkb2N1bWVudCBib2R5IG5lZWRzIHRvIGJlIGVuYWJsZWQgZm9yIGhhbW1lci5qcyBldmVudHMuXHJcbmRlbGV0ZSBIYW1tZXIuZGVmYXVsdHMuY3NzUHJvcHMudXNlclNlbGVjdFxyXG5jb25zdCBoYW1tZXJ0aW1lID0gbmV3IEhhbW1lci5NYW5hZ2VyKGRvY3VtZW50LmJvZHksIHtcclxuICByZWNvZ25pemVyczogW1xyXG4gICAgW0hhbW1lci5QYW4sIHtkaXJlY3Rpb246IEhhbW1lci5ESVJFQ1RJT05fSE9SSVpPTlRBTH1dXHJcbiAgXVxyXG59KVxyXG5cclxuLy8gRm9yIHRvdWNoIGRpc3BsYXlzLCBoYW1tZXIuanMgaXMgdXNlZCB0byBtYWtlIHRoZSBzaWRlIG1lbnUgYXBwZWFyL2Rpc2FwcGVhci4gVGhlIGNvZGUgYmVsb3cgaXNcclxuLy8gYWRhcHRlZCBmcm9tIE1hdGVyaWFsaXplJ3MgaW1wbGVtZW50YXRpb24uXHJcbmxldCBtZW51T3V0ID0gZmFsc2VcclxuY29uc3QgZHJhZ1RhcmdldCA9IG5ldyBIYW1tZXIoZWxlbUJ5SWQoJ2RyYWdUYXJnZXQnKSlcclxuZHJhZ1RhcmdldC5vbigncGFuJywgKGUpID0+IHtcclxuICBpZiAoZS5wb2ludGVyVHlwZSA9PT0gJ3RvdWNoJykge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICBsZXQgeyB4IH0gPSBlLmNlbnRlclxyXG4gICAgY29uc3QgeyB5IH0gPSBlLmNlbnRlclxyXG5cclxuICAgIGNvbnN0IHNCa2cgPSBlbGVtQnlJZCgnc2lkZUJhY2tncm91bmQnKVxyXG4gICAgc0JrZy5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xyXG4gICAgc0JrZy5zdHlsZS5vcGFjaXR5ID0gJzAnXHJcbiAgICBlbGVtQnlJZCgnc2lkZU5hdicpLmNsYXNzTGlzdC5hZGQoJ21hbnVhbCcpXHJcblxyXG4gICAgLy8gS2VlcCB3aXRoaW4gYm91bmRhcmllc1xyXG4gICAgaWYgKHggPiAyNDApIHtcclxuICAgICAgeCA9IDI0MFxyXG4gICAgfSBlbHNlIGlmICh4IDwgMCkge1xyXG4gICAgICB4ID0gMFxyXG5cclxuICAgICAgLy8gTGVmdCBEaXJlY3Rpb25cclxuICAgICAgaWYgKHggPCAxMjApIHtcclxuICAgICAgICBtZW51T3V0ID0gZmFsc2VcclxuICAgICAgLy8gUmlnaHQgRGlyZWN0aW9uXHJcbiAgICAgIH0gZWxzZSBpZiAoeCA+PSAxMjApIHtcclxuICAgICAgICBtZW51T3V0ID0gdHJ1ZVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZWxlbUJ5SWQoJ3NpZGVOYXYnKS5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlWCgke3ggLSAyNDB9cHgpYFxyXG4gICAgY29uc3Qgb3ZlcmxheVBlcmNlbnQgPSBNYXRoLm1pbih4IC8gNDgwLCAwLjUpXHJcbiAgICByZXR1cm4gc0JrZy5zdHlsZS5vcGFjaXR5ID0gU3RyaW5nKG92ZXJsYXlQZXJjZW50KVxyXG4gIH1cclxufSlcclxuXHJcbmRyYWdUYXJnZXQub24oJ3BhbmVuZCcsIChlKSA9PiB7XHJcbiAgaWYgKGUucG9pbnRlclR5cGUgPT09ICd0b3VjaCcpIHtcclxuICAgIGxldCBzaWRlTmF2XHJcbiAgICBjb25zdCB7IHZlbG9jaXR5WCB9ID0gZVxyXG4gICAgLy8gSWYgdmVsb2NpdHlYIDw9IDAuMyB0aGVuIHRoZSB1c2VyIGlzIGZsaW5naW5nIHRoZSBtZW51IGNsb3NlZCBzbyBpZ25vcmUgbWVudU91dFxyXG4gICAgaWYgKChtZW51T3V0ICYmICh2ZWxvY2l0eVggPD0gMC4zKSkgfHwgKHZlbG9jaXR5WCA8IC0wLjUpKSB7XHJcbiAgICAgIHNpZGVOYXYgPSBlbGVtQnlJZCgnc2lkZU5hdicpXHJcbiAgICAgIHNpZGVOYXYuY2xhc3NMaXN0LnJlbW92ZSgnbWFudWFsJylcclxuICAgICAgc2lkZU5hdi5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG4gICAgICBzaWRlTmF2LnN0eWxlLnRyYW5zZm9ybSA9ICcnXHJcbiAgICAgIGVsZW1CeUlkKCdkcmFnVGFyZ2V0Jykuc3R5bGUud2lkdGggPSAnMTAwJSdcclxuXHJcbiAgICB9IGVsc2UgaWYgKCFtZW51T3V0IHx8ICh2ZWxvY2l0eVggPiAwLjMpKSB7XHJcbiAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnYXV0bydcclxuICAgICAgc2lkZU5hdiA9IGVsZW1CeUlkKCdzaWRlTmF2JylcclxuICAgICAgc2lkZU5hdi5jbGFzc0xpc3QucmVtb3ZlKCdtYW51YWwnKVxyXG4gICAgICBzaWRlTmF2LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgICAgIHNpZGVOYXYuc3R5bGUudHJhbnNmb3JtID0gJydcclxuICAgICAgZWxlbUJ5SWQoJ3NpZGVCYWNrZ3JvdW5kJykuc3R5bGUub3BhY2l0eSA9ICcnXHJcbiAgICAgIGVsZW1CeUlkKCdkcmFnVGFyZ2V0Jykuc3R5bGUud2lkdGggPSAnMTBweCdcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiBlbGVtQnlJZCgnc2lkZUJhY2tncm91bmQnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXHJcbiAgICAgICwgMzUwKVxyXG4gICAgfVxyXG4gIH1cclxufSlcclxuXHJcbmRyYWdUYXJnZXQub24oJ3RhcCcsIChlKSA9PiB7XHJcbiAgICBlbGVtQnlJZCgnc2lkZUJhY2tncm91bmQnKS5jbGljaygpXHJcbiAgICBlLnByZXZlbnREZWZhdWx0KClcclxufSlcclxuXHJcbmNvbnN0IGR0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RyYWdUYXJnZXQnKVxyXG5cclxuLy8gVGhlIGFjdGl2aXR5IGZpbHRlciBidXR0b24gYWxzbyBuZWVkcyBhbiBldmVudCBsaXN0ZW5lci5cclxucmlwcGxlKGVsZW1CeUlkKCdmaWx0ZXJBY3Rpdml0eScpKVxyXG5lbGVtQnlJZCgnZmlsdGVyQWN0aXZpdHknKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICBlbGVtQnlJZCgnaW5mb0FjdGl2aXR5JykuY2xhc3NMaXN0LnRvZ2dsZSgnZmlsdGVyJylcclxufSlcclxuXHJcbi8vIEF0IHRoZSBzdGFydCwgaXQgbmVlZHMgdG8gYmUgY29ycmVjdGx5IHBvcHVsYXRlZFxyXG5jb25zdCBhY3Rpdml0eVR5cGVzID0gc2V0dGluZ3Muc2hvd25BY3Rpdml0eVxyXG5cclxuZnVuY3Rpb24gdXBkYXRlU2VsZWN0TnVtKCk6IHN0cmluZyB7XHJcbiAgICBjb25zdCBjID0gKGJvb2w6IGJvb2xlYW4pICA9PiBib29sID8gMSA6IDBcclxuICAgIGNvbnN0IGNvdW50ID0gU3RyaW5nKGMoYWN0aXZpdHlUeXBlcy5hZGQpICsgYyhhY3Rpdml0eVR5cGVzLmVkaXQpICsgYyhhY3Rpdml0eVR5cGVzLmRlbGV0ZSkpXHJcbiAgICByZXR1cm4gZWxlbUJ5SWQoJ3NlbGVjdE51bScpLmlubmVySFRNTCA9IGNvdW50XHJcbn1cclxudXBkYXRlU2VsZWN0TnVtKClcclxuT2JqZWN0LmVudHJpZXMoYWN0aXZpdHlUeXBlcykuZm9yRWFjaCgoW3R5cGUsIGVuYWJsZWRdKSA9PiB7XHJcbiAgaWYgKHR5cGUgIT09ICdhZGQnICYmIHR5cGUgIT09ICdlZGl0JyAmJiB0eXBlICE9PSAnZGVsZXRlJykge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGFjdGl2aXR5IHR5cGUgJHt0eXBlfWApXHJcbiAgfVxyXG5cclxuICBjb25zdCBzZWxlY3RFbCA9IGVsZW1CeUlkKHR5cGUgKyAnU2VsZWN0JykgYXMgSFRNTElucHV0RWxlbWVudFxyXG4gIHNlbGVjdEVsLmNoZWNrZWQgPSBlbmFibGVkXHJcbiAgaWYgKGVuYWJsZWQpIHsgZWxlbUJ5SWQoJ2luZm9BY3Rpdml0eScpLmNsYXNzTGlzdC5hZGQodHlwZSkgfVxyXG4gIHNlbGVjdEVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChldnQpID0+IHtcclxuICAgIGFjdGl2aXR5VHlwZXNbdHlwZV0gPSBzZWxlY3RFbC5jaGVja2VkXHJcbiAgICBlbGVtQnlJZCgnaW5mb0FjdGl2aXR5Jykuc2V0QXR0cmlidXRlKCdkYXRhLWZpbHRlcmVkJywgdXBkYXRlU2VsZWN0TnVtKCkpXHJcbiAgICBlbGVtQnlJZCgnaW5mb0FjdGl2aXR5JykuY2xhc3NMaXN0LnRvZ2dsZSh0eXBlKVxyXG4gICAgc2V0dGluZ3Muc2hvd25BY3Rpdml0eSA9IGFjdGl2aXR5VHlwZXNcclxuICB9KVxyXG59KVxyXG5cclxuLy8gVGhlIHNob3cgY29tcGxldGVkIHRhc2tzIGNoZWNrYm94IGlzIHNldCBjb3JyZWN0bHkgYW5kIGlzIGFzc2lnbmVkIGFuIGV2ZW50IGxpc3RlbmVyLlxyXG5jb25zdCBzaG93RG9uZVRhc2tzRWwgPSBlbGVtQnlJZCgnc2hvd0RvbmVUYXNrcycpIGFzIEhUTUxJbnB1dEVsZW1lbnRcclxuaWYgKHNldHRpbmdzLnNob3dEb25lVGFza3MpIHtcclxuICBzaG93RG9uZVRhc2tzRWwuY2hlY2tlZCA9IHRydWVcclxuICBlbGVtQnlJZCgnaW5mb1Rhc2tzSW5uZXInKS5jbGFzc0xpc3QuYWRkKCdzaG93RG9uZVRhc2tzJylcclxufVxyXG5zaG93RG9uZVRhc2tzRWwuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKCkgPT4ge1xyXG4gIHNldHRpbmdzLnNob3dEb25lVGFza3MgPSBzaG93RG9uZVRhc2tzRWwuY2hlY2tlZFxyXG4gIGVsZW1CeUlkKCdpbmZvVGFza3NJbm5lcicpLmNsYXNzTGlzdC50b2dnbGUoJ3Nob3dEb25lVGFza3MnLCBzZXR0aW5ncy5zaG93RG9uZVRhc2tzKVxyXG59KVxyXG5cclxuLy8gPGEgbmFtZT1cInVwZGF0ZXNcIi8+XHJcbi8vIFVwZGF0ZXMgYW5kIE5ld3NcclxuLy8gLS0tLS0tLS0tLS0tLS0tLVxyXG4vL1xyXG5cclxuaWYgKGxvY2F0aW9uLnByb3RvY29sID09PSAnY2hyb21lLWV4dGVuc2lvbjonKSB7IGNoZWNrQ29tbWl0KCkgfVxyXG5cclxuLy8gVGhpcyB1cGRhdGUgZGlhbG9nIGFsc28gbmVlZHMgdG8gYmUgY2xvc2VkIHdoZW4gdGhlIGJ1dHRvbnMgYXJlIGNsaWNrZWQuXHJcbmVsZW1CeUlkKCd1cGRhdGVEZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gIGVsZW1CeUlkKCd1cGRhdGUnKS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgZWxlbUJ5SWQoJ3VwZGF0ZUJhY2tncm91bmQnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXHJcbiAgfSwgMzUwKVxyXG59KVxyXG5cclxuLy8gRm9yIG5ld3MsIHRoZSBsYXRlc3QgbmV3cyBpcyBmZXRjaGVkIGZyb20gYSBHaXRIdWIgZ2lzdC5cclxuZmV0Y2hOZXdzKClcclxuXHJcbi8vIFRoZSBuZXdzIGRpYWxvZyB0aGVuIG5lZWRzIHRvIGJlIGNsb3NlZCB3aGVuIE9LIG9yIHRoZSBiYWNrZ3JvdW5kIGlzIGNsaWNrZWQuXHJcbmZ1bmN0aW9uIGNsb3NlTmV3cygpOiB2b2lkIHtcclxuICBlbGVtQnlJZCgnbmV3cycpLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICBlbGVtQnlJZCgnbmV3c0JhY2tncm91bmQnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXHJcbiAgfSwgMzUwKVxyXG59XHJcblxyXG5lbGVtQnlJZCgnbmV3c09rJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbG9zZU5ld3MpXHJcbmVsZW1CeUlkKCduZXdzQmFja2dyb3VuZCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xvc2VOZXdzKVxyXG5cclxuLy8gSXQgYWxzbyBuZWVkcyB0byBiZSBvcGVuZWQgd2hlbiB0aGUgbmV3cyBidXR0b24gaXMgY2xpY2tlZC5cclxuZWxlbUJ5SWQoJ25ld3NCJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgZWxlbUJ5SWQoJ3NpZGVCYWNrZ3JvdW5kJykuY2xpY2soKVxyXG4gIGNvbnN0IGRpc3BsYXlOZXdzID0gKCkgPT4ge1xyXG4gICAgZWxlbUJ5SWQoJ25ld3NCYWNrZ3JvdW5kJykuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcclxuICAgIHJldHVybiBlbGVtQnlJZCgnbmV3cycpLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcbiAgfVxyXG5cclxuICBpZiAoZWxlbUJ5SWQoJ25ld3NDb250ZW50JykuY2hpbGROb2Rlcy5sZW5ndGggPT09IDApIHtcclxuICAgIGdldE5ld3MoZGlzcGxheU5ld3MpXHJcbiAgfSBlbHNlIHtcclxuICAgIGRpc3BsYXlOZXdzKClcclxuICB9XHJcbn0pXHJcblxyXG4vLyBUaGUgc2FtZSBnb2VzIGZvciB0aGUgZXJyb3IgZGlhbG9nLlxyXG5mdW5jdGlvbiBjbG9zZUVycm9yKCk6IHZvaWQge1xyXG4gIGVsZW1CeUlkKCdlcnJvcicpLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICBlbGVtQnlJZCgnZXJyb3JCYWNrZ3JvdW5kJykuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xyXG4gIH0sIDM1MClcclxufVxyXG5cclxuZWxlbUJ5SWQoJ2Vycm9yTm8nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsb3NlRXJyb3IpXHJcbmVsZW1CeUlkKCdlcnJvckJhY2tncm91bmQnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsb3NlRXJyb3IpXHJcblxyXG4vLyA8YSBuYW1lPVwibmV3XCIvPlxyXG4vLyBBZGRpbmcgbmV3IGFzc2lnbm1lbnRzXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuLy9cclxuLy8gVGhlIGV2ZW50IGxpc3RlbmVycyBmb3IgdGhlIG5ldyBidXR0b25zIGFyZSBhZGRlZC5cclxucmlwcGxlKGVsZW1CeUlkKCduZXcnKSlcclxucmlwcGxlKGVsZW1CeUlkKCduZXdUYXNrJykpXHJcbmNvbnN0IG9uTmV3VGFzayA9ICgpID0+IHtcclxuICB1cGRhdGVOZXdUaXBzKChlbGVtQnlJZCgnbmV3VGV4dCcpIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlID0gJycpXHJcbiAgZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nXHJcbiAgZWxlbUJ5SWQoJ25ld0JhY2tncm91bmQnKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xyXG4gIGVsZW1CeUlkKCduZXdEaWFsb2cnKS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG4gIGVsZW1CeUlkKCduZXdUZXh0JykuZm9jdXMoKVxyXG59XHJcbmVsZW1CeUlkKCduZXcnKS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgb25OZXdUYXNrKVxyXG5lbGVtQnlJZCgnbmV3VGFzaycpLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBvbk5ld1Rhc2spXHJcblxyXG4vLyBBIGZ1bmN0aW9uIHRvIGNsb3NlIHRoZSBkaWFsb2cgaXMgdGhlbiBkZWZpbmVkLlxyXG5mdW5jdGlvbiBjbG9zZU5ldygpOiB2b2lkIHtcclxuICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2F1dG8nXHJcbiAgZWxlbUJ5SWQoJ25ld0RpYWxvZycpLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICBlbGVtQnlJZCgnbmV3QmFja2dyb3VuZCcpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcclxuICB9LCAzNTApXHJcbn1cclxuXHJcbi8vIFRoaXMgZnVuY3Rpb24gaXMgc2V0IHRvIGJlIGNhbGxlZCBjYWxsZWQgd2hlbiB0aGUgRVNDIGtleSBpcyBjYWxsZWQgaW5zaWRlIG9mIHRoZSBkaWFsb2cuXHJcbmVsZW1CeUlkKCduZXdUZXh0JykuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldnQpID0+IHtcclxuICBpZiAoZXZ0LndoaWNoID09PSAyNykgeyAvLyBFc2NhcGUga2V5IHByZXNzZWRcclxuICAgIGNsb3NlTmV3KClcclxuICB9XHJcbn0pXHJcblxyXG4vLyBBbiBldmVudCBsaXN0ZW5lciB0byBjYWxsIHRoZSBmdW5jdGlvbiBpcyBhbHNvIGFkZGVkIHRvIHRoZSBYIGJ1dHRvblxyXG5lbGVtQnlJZCgnbmV3Q2FuY2VsJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbG9zZU5ldylcclxuXHJcbi8vIFdoZW4gdGhlIGVudGVyIGtleSBpcyBwcmVzc2VkIG9yIHRoZSBzdWJtaXQgYnV0dG9uIGlzIGNsaWNrZWQsIHRoZSBuZXcgYXNzaWdubWVudCBpcyBhZGRlZC5cclxuZWxlbUJ5SWQoJ25ld0RpYWxvZycpLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIChldnQpID0+IHtcclxuICBldnQucHJldmVudERlZmF1bHQoKVxyXG4gIGNvbnN0IGl0ZXh0ID0gKGVsZW1CeUlkKCduZXdUZXh0JykgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWVcclxuICBjb25zdCB7IHRleHQsIGNscywgZHVlLCBzdCB9ID0gcGFyc2VDdXN0b21UYXNrKGl0ZXh0KVxyXG4gIGxldCBlbmQ6ICdGb3JldmVyJ3xudW1iZXIgPSAnRm9yZXZlcidcclxuXHJcbiAgY29uc3Qgc3RhcnQgPSAoc3QgIT0gbnVsbCkgPyB0b0RhdGVOdW0oY2hyb25vLnBhcnNlRGF0ZShzdCkpIDogdG9kYXkoKVxyXG4gIGlmIChkdWUgIT0gbnVsbCkge1xyXG4gICAgZW5kID0gdG9EYXRlTnVtKGNocm9uby5wYXJzZURhdGUoZHVlKSlcclxuICAgIGlmIChlbmQgPCBzdGFydCkgeyAvLyBBc3NpZ25tZW50IGVuZHMgYmVmb3JlIGl0IGlzIGFzc2lnbmVkXHJcbiAgICAgIGVuZCArPSBNYXRoLmNlaWwoKHN0YXJ0IC0gZW5kKSAvIDcpICogN1xyXG4gICAgfVxyXG4gIH1cclxuICBhZGRUb0V4dHJhKHtcclxuICAgIGJvZHk6IHRleHQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB0ZXh0LnN1YnN0cigxKSxcclxuICAgIGRvbmU6IGZhbHNlLFxyXG4gICAgc3RhcnQsXHJcbiAgICBjbGFzczogKGNscyAhPSBudWxsKSA/IGNscy50b0xvd2VyQ2FzZSgpLnRyaW0oKSA6IG51bGwsXHJcbiAgICBlbmRcclxuICB9KVxyXG4gIHNhdmVFeHRyYSgpXHJcbiAgY2xvc2VOZXcoKVxyXG4gIGRpc3BsYXkoZmFsc2UpXHJcbn0pXHJcblxyXG51cGRhdGVOZXdUaXBzKCcnLCBmYWxzZSlcclxuZWxlbUJ5SWQoJ25ld1RleHQnKS5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsICgpID0+IHtcclxuICByZXR1cm4gdXBkYXRlTmV3VGlwcygoZWxlbUJ5SWQoJ25ld1RleHQnKSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSlcclxufSlcclxuXHJcbi8vIFRoZSBjb2RlIGJlbG93IHJlZ2lzdGVycyBhIHNlcnZpY2Ugd29ya2VyIHRoYXQgY2FjaGVzIHRoZSBwYWdlIHNvIGl0IGNhbiBiZSB2aWV3ZWQgb2ZmbGluZS5cclxuaWYgKCdzZXJ2aWNlV29ya2VyJyBpbiBuYXZpZ2F0b3IpIHtcclxuICBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5yZWdpc3RlcignL3NlcnZpY2Utd29ya2VyLmpzJylcclxuICAgIC50aGVuKChyZWdpc3RyYXRpb24pID0+XHJcbiAgICAgIC8vIFJlZ2lzdHJhdGlvbiB3YXMgc3VjY2Vzc2Z1bFxyXG4gICAgICBjb25zb2xlLmxvZygnU2VydmljZVdvcmtlciByZWdpc3RyYXRpb24gc3VjY2Vzc2Z1bCB3aXRoIHNjb3BlJywgcmVnaXN0cmF0aW9uLnNjb3BlKSkuY2F0Y2goKGVycikgPT5cclxuICAgICAgLy8gcmVnaXN0cmF0aW9uIGZhaWxlZCA6KFxyXG4gICAgICBjb25zb2xlLmxvZygnU2VydmljZVdvcmtlciByZWdpc3RyYXRpb24gZmFpbGVkOiAnLCBlcnIpXHJcbiAgKVxyXG59XHJcblxyXG4vLyBJZiB0aGUgc2VydmljZSB3b3JrZXIgZGV0ZWN0cyB0aGF0IHRoZSB3ZWIgYXBwIGhhcyBiZWVuIHVwZGF0ZWQsIHRoZSBjb21taXQgaXMgZmV0Y2hlZCBmcm9tIEdpdEh1Yi5cclxubmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIChldmVudCkgPT4ge1xyXG4gICAgY29uc29sZS5sb2coJ0dldHRpbmcgY29tbWl0IGJlY2F1c2Ugb2Ygc2VydmljZXdvcmtlcicpXHJcbiAgICBpZiAoZXZlbnQuZGF0YS5nZXRDb21taXQpIHsgcmV0dXJuIGNoZWNrQ29tbWl0KCkgfVxyXG59KVxyXG4iLCJpbXBvcnQgeyBjbGFzc0J5SWQsIGdldERhdGEsIElBc3NpZ25tZW50IH0gZnJvbSAnLi4vcGNyJ1xyXG5pbXBvcnQgeyBBY3Rpdml0eVR5cGUgfSBmcm9tICcuLi9wbHVnaW5zL2FjdGl2aXR5J1xyXG5pbXBvcnQgeyBhc3NpZ25tZW50SW5Eb25lIH0gZnJvbSAnLi4vcGx1Z2lucy9kb25lJ1xyXG5pbXBvcnQgeyBfJCwgZGF0ZVN0cmluZywgZWxlbUJ5SWQsIGVsZW1lbnQsIHNtb290aFNjcm9sbCB9IGZyb20gJy4uL3V0aWwnXHJcbmltcG9ydCB7IHNlcGFyYXRlIH0gZnJvbSAnLi9hc3NpZ25tZW50J1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFkZEFjdGl2aXR5RWxlbWVudChlbDogSFRNTEVsZW1lbnQpOiB2b2lkIHtcclxuICAgIGNvbnN0IGluc2VydFRvID0gZWxlbUJ5SWQoJ2luZm9BY3Rpdml0eScpXHJcbiAgICBpbnNlcnRUby5pbnNlcnRCZWZvcmUoZWwsIGluc2VydFRvLnF1ZXJ5U2VsZWN0b3IoJy5hY3Rpdml0eScpKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQWN0aXZpdHkodHlwZTogQWN0aXZpdHlUeXBlLCBhc3NpZ25tZW50OiBJQXNzaWdubWVudCwgZGF0ZTogRGF0ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT86IHN0cmluZyApOiBIVE1MRWxlbWVudCB7XHJcbiAgICBjb25zdCBjbmFtZSA9IGNsYXNzTmFtZSB8fCBjbGFzc0J5SWQoYXNzaWdubWVudC5jbGFzcylcclxuXHJcbiAgICBjb25zdCB0ZSA9IGVsZW1lbnQoJ2RpdicsIFsnYWN0aXZpdHknLCAnYXNzaWdubWVudEl0ZW0nLCBhc3NpZ25tZW50LmJhc2VUeXBlLCB0eXBlXSwgYFxyXG4gICAgICAgIDxpIGNsYXNzPSdtYXRlcmlhbC1pY29ucyc+JHt0eXBlfTwvaT5cclxuICAgICAgICA8c3BhbiBjbGFzcz0ndGl0bGUnPiR7YXNzaWdubWVudC50aXRsZX08L3NwYW4+XHJcbiAgICAgICAgPHNtYWxsPiR7c2VwYXJhdGUoY25hbWUpWzJdfTwvc21hbGw+XHJcbiAgICAgICAgPGRpdiBjbGFzcz0ncmFuZ2UnPiR7ZGF0ZVN0cmluZyhkYXRlKX08L2Rpdj5gLCBgYWN0aXZpdHkke2Fzc2lnbm1lbnQuaWR9YClcclxuICAgIHRlLnNldEF0dHJpYnV0ZSgnZGF0YS1jbGFzcycsIGNuYW1lKVxyXG4gICAgY29uc3QgeyBpZCB9ID0gYXNzaWdubWVudFxyXG4gICAgaWYgKHR5cGUgIT09ICdkZWxldGUnKSB7XHJcbiAgICAgICAgdGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRvU2Nyb2xsaW5nID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZWwgPSBfJChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAuYXNzaWdubWVudFtpZCo9XFxcIiR7aWR9XFxcIl1gKSkgYXMgSFRNTEVsZW1lbnRcclxuICAgICAgICAgICAgICAgIGF3YWl0IHNtb290aFNjcm9sbCgoZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wICsgZG9jdW1lbnQuYm9keS5zY3JvbGxUb3ApIC0gMTE2KVxyXG4gICAgICAgICAgICAgICAgZWwuY2xpY2soKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5ib2R5LmdldEF0dHJpYnV0ZSgnZGF0YS12aWV3JykgPT09ICcwJykge1xyXG4gICAgICAgICAgICByZXR1cm4gZG9TY3JvbGxpbmcoKVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgKF8kKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNuYXZUYWJzPmxpOmZpcnN0LWNoaWxkJykpIGFzIEhUTUxFbGVtZW50KS5jbGljaygpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc2V0VGltZW91dChkb1Njcm9sbGluZywgNTAwKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBpZiAoYXNzaWdubWVudEluRG9uZShhc3NpZ25tZW50LmlkKSkge1xyXG4gICAgICB0ZS5jbGFzc0xpc3QuYWRkKCdkb25lJylcclxuICAgIH1cclxuICAgIHJldHVybiB0ZVxyXG59XHJcbiIsImltcG9ydCB7IGZyb21EYXRlTnVtLCB0b2RheSB9IGZyb20gJy4uL2RhdGVzJ1xyXG5pbXBvcnQgeyBkaXNwbGF5LCBnZXRUaW1lQWZ0ZXIsIElTcGxpdEFzc2lnbm1lbnQgfSBmcm9tICcuLi9kaXNwbGF5J1xyXG5pbXBvcnQgeyBnZXRMaXN0RGF0ZU9mZnNldCB9IGZyb20gJy4uL25hdmlnYXRpb24nXHJcbmltcG9ydCB7IGdldEF0dGFjaG1lbnRNaW1lVHlwZSwgSUFwcGxpY2F0aW9uRGF0YSwgSUFzc2lnbm1lbnQsIHVybEZvckF0dGFjaG1lbnQgfSBmcm9tICcuLi9wY3InXHJcbmltcG9ydCB7IHJlY2VudEFjdGl2aXR5IH0gZnJvbSAnLi4vcGx1Z2lucy9hY3Rpdml0eSdcclxuaW1wb3J0IHsgZ2V0QXRoZW5hRGF0YSB9IGZyb20gJy4uL3BsdWdpbnMvYXRoZW5hJ1xyXG5pbXBvcnQgeyByZW1vdmVGcm9tRXh0cmEsIHNhdmVFeHRyYSB9IGZyb20gJy4uL3BsdWdpbnMvY3VzdG9tQXNzaWdubWVudHMnXHJcbmltcG9ydCB7IGFkZFRvRG9uZSwgYXNzaWdubWVudEluRG9uZSwgcmVtb3ZlRnJvbURvbmUsIHNhdmVEb25lIH0gZnJvbSAnLi4vcGx1Z2lucy9kb25lJ1xyXG5pbXBvcnQgeyBtb2RpZmllZEJvZHksIHJlbW92ZUZyb21Nb2RpZmllZCwgc2F2ZU1vZGlmaWVkLCBzZXRNb2RpZmllZCB9IGZyb20gJy4uL3BsdWdpbnMvbW9kaWZpZWRBc3NpZ25tZW50cydcclxuaW1wb3J0IHsgc2V0dGluZ3MgfSBmcm9tICcuLi9zZXR0aW5ncydcclxuaW1wb3J0IHsgXyQsIGNzc051bWJlciwgZGF0ZVN0cmluZywgZWxlbUJ5SWQsIGVsZW1lbnQsIGZvcmNlTGF5b3V0LCByaXBwbGUgfSBmcm9tICcuLi91dGlsJ1xyXG5pbXBvcnQgeyByZXNpemUgfSBmcm9tICcuL3Jlc2l6ZXInXHJcblxyXG5jb25zdCBtaW1lVHlwZXM6IHsgW21pbWU6IHN0cmluZ106IFtzdHJpbmcsIHN0cmluZ10gfSA9IHtcclxuICAgICdhcHBsaWNhdGlvbi9tc3dvcmQnOiBbJ1dvcmQgRG9jJywgJ2RvY3VtZW50J10sXHJcbiAgICAnYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LndvcmRwcm9jZXNzaW5nbWwuZG9jdW1lbnQnOiBbJ1dvcmQgRG9jJywgJ2RvY3VtZW50J10sXHJcbiAgICAnYXBwbGljYXRpb24vdm5kLm1zLXBvd2VycG9pbnQnOiBbJ1BQVCBQcmVzZW50YXRpb24nLCAnc2xpZGVzJ10sXHJcbiAgICAnYXBwbGljYXRpb24vcGRmJzogWydQREYgRmlsZScsICdwZGYnXSxcclxuICAgICd0ZXh0L3BsYWluJzogWydUZXh0IERvYycsICdwbGFpbiddXHJcbn1cclxuXHJcbmNvbnN0IGRtcCA9IG5ldyBkaWZmX21hdGNoX3BhdGNoKCkgLy8gRm9yIGRpZmZpbmdcclxuXHJcbmZ1bmN0aW9uIHBvcHVsYXRlQWRkZWREZWxldGVkKGRpZmZzOiBhbnlbXSwgZWRpdHM6IEhUTUxFbGVtZW50KTogYm9vbGVhbiB7XHJcbiAgICBsZXQgYWRkZWQgPSAwXHJcbiAgICBsZXQgZGVsZXRlZCA9IDBcclxuICAgIGRpZmZzLmZvckVhY2goKGRpZmYpID0+IHtcclxuICAgICAgICBpZiAoZGlmZlswXSA9PT0gMSkgeyBhZGRlZCsrIH1cclxuICAgICAgICBpZiAoZGlmZlswXSA9PT0gLTEpIHsgZGVsZXRlZCsrIH1cclxuICAgIH0pXHJcbiAgICBfJChlZGl0cy5xdWVyeVNlbGVjdG9yKCcuYWRkaXRpb25zJykpLmlubmVySFRNTCA9IGFkZGVkICE9PSAwID8gYCske2FkZGVkfWAgOiAnJ1xyXG4gICAgXyQoZWRpdHMucXVlcnlTZWxlY3RvcignLmRlbGV0aW9ucycpKS5pbm5lckhUTUwgPSBkZWxldGVkICE9PSAwID8gYC0ke2RlbGV0ZWR9YCA6ICcnXHJcbiAgICBlZGl0cy5jbGFzc0xpc3QuYWRkKCdub3RFbXB0eScpXHJcbiAgICByZXR1cm4gYWRkZWQgPiAwIHx8IGRlbGV0ZWQgPiAwXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjb21wdXRlV2Vla0lkKHNwbGl0OiBJU3BsaXRBc3NpZ25tZW50KTogc3RyaW5nIHtcclxuICAgIGNvbnN0IHN0YXJ0U3VuID0gbmV3IERhdGUoc3BsaXQuc3RhcnQuZ2V0VGltZSgpKVxyXG4gICAgc3RhcnRTdW4uc2V0RGF0ZShzdGFydFN1bi5nZXREYXRlKCkgLSBzdGFydFN1bi5nZXREYXkoKSlcclxuICAgIHJldHVybiBgd2ske3N0YXJ0U3VuLmdldE1vbnRoKCl9LSR7c3RhcnRTdW4uZ2V0RGF0ZSgpfWBcclxufVxyXG5cclxuLy8gVGhpcyBmdW5jdGlvbiBzZXBhcmF0ZXMgdGhlIHBhcnRzIG9mIGEgY2xhc3MgbmFtZS5cclxuZXhwb3J0IGZ1bmN0aW9uIHNlcGFyYXRlKGNsOiBzdHJpbmcpOiBSZWdFeHBNYXRjaEFycmF5IHtcclxuICAgIGNvbnN0IG0gPSBjbC5tYXRjaCgvKCg/OlxcZCpcXHMrKT8oPzooPzpob25cXHcqfCg/OmFkdlxcdypcXHMqKT9jb3JlKVxccyspPykoLiopL2kpXHJcbiAgICBpZiAobSA9PSBudWxsKSB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBzZXBhcmF0ZSBjbGFzcyBzdHJpbmcgJHtjbH1gKVxyXG4gICAgcmV0dXJuIG1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFzc2lnbm1lbnRDbGFzcyhhc3NpZ25tZW50OiBJQXNzaWdubWVudCwgZGF0YTogSUFwcGxpY2F0aW9uRGF0YSk6IHN0cmluZyB7XHJcbiAgICBjb25zdCBjbHMgPSAoYXNzaWdubWVudC5jbGFzcyAhPSBudWxsKSA/IGRhdGEuY2xhc3Nlc1thc3NpZ25tZW50LmNsYXNzXSA6ICdUYXNrJ1xyXG4gICAgaWYgKGNscyA9PSBudWxsKSB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBmaW5kIGNsYXNzICR7YXNzaWdubWVudC5jbGFzc30gaW4gJHtkYXRhLmNsYXNzZXN9YClcclxuICAgIHJldHVybiBjbHNcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNlcGFyYXRlZENsYXNzKGFzc2lnbm1lbnQ6IElBc3NpZ25tZW50LCBkYXRhOiBJQXBwbGljYXRpb25EYXRhKTogUmVnRXhwTWF0Y2hBcnJheSB7XHJcbiAgICByZXR1cm4gc2VwYXJhdGUoYXNzaWdubWVudENsYXNzKGFzc2lnbm1lbnQsIGRhdGEpKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQXNzaWdubWVudChzcGxpdDogSVNwbGl0QXNzaWdubWVudCwgZGF0YTogSUFwcGxpY2F0aW9uRGF0YSk6IEhUTUxFbGVtZW50IHtcclxuICAgIGNvbnN0IHsgYXNzaWdubWVudCwgcmVmZXJlbmNlIH0gPSBzcGxpdFxyXG5cclxuICAgIC8vIFNlcGFyYXRlIHRoZSBjbGFzcyBkZXNjcmlwdGlvbiBmcm9tIHRoZSBhY3R1YWwgY2xhc3NcclxuICAgIGNvbnN0IHNlcGFyYXRlZCA9IHNlcGFyYXRlZENsYXNzKGFzc2lnbm1lbnQsIGRhdGEpXHJcblxyXG4gICAgY29uc3Qgd2Vla0lkID0gY29tcHV0ZVdlZWtJZChzcGxpdClcclxuXHJcbiAgICBsZXQgc21hbGxUYWcgPSAnc21hbGwnXHJcbiAgICBsZXQgbGluayA9IG51bGxcclxuICAgIGNvbnN0IGF0aGVuYURhdGEgPSBnZXRBdGhlbmFEYXRhKClcclxuICAgIGlmIChhdGhlbmFEYXRhICYmIGFzc2lnbm1lbnQuY2xhc3MgIT0gbnVsbCAmJiAoYXRoZW5hRGF0YVtkYXRhLmNsYXNzZXNbYXNzaWdubWVudC5jbGFzc11dICE9IG51bGwpKSB7XHJcbiAgICAgICAgbGluayA9IGF0aGVuYURhdGFbZGF0YS5jbGFzc2VzW2Fzc2lnbm1lbnQuY2xhc3NdXS5saW5rXHJcbiAgICAgICAgc21hbGxUYWcgPSAnYSdcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBlID0gZWxlbWVudCgnZGl2JywgWydhc3NpZ25tZW50JywgYXNzaWdubWVudC5iYXNlVHlwZSwgJ2FuaW0nXSxcclxuICAgICAgICAgICAgICAgICAgICAgIGA8JHtzbWFsbFRhZ30ke2xpbmsgPyBgIGhyZWY9JyR7bGlua30nIGNsYXNzPSdsaW5rZWQnIHRhcmdldD0nX2JsYW5rJ2AgOiAnJ30+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPSdleHRyYSc+JHtzZXBhcmF0ZWRbMV19PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAke3NlcGFyYXRlZFsyXX1cclxuICAgICAgICAgICAgICAgICAgICAgICA8LyR7c21hbGxUYWd9PjxzcGFuIGNsYXNzPSd0aXRsZSc+JHthc3NpZ25tZW50LnRpdGxlfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT0naGlkZGVuJyBjbGFzcz0nZHVlJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT0nJHthc3NpZ25tZW50LmVuZCA9PT0gJ0ZvcmV2ZXInID8gMCA6IGFzc2lnbm1lbnQuZW5kfScgLz5gLFxyXG4gICAgICAgICAgICAgICAgICAgICAgYXNzaWdubWVudC5pZCArIHdlZWtJZClcclxuXHJcbiAgICBpZiAoKCByZWZlcmVuY2UgJiYgcmVmZXJlbmNlLmRvbmUpIHx8IGFzc2lnbm1lbnRJbkRvbmUoYXNzaWdubWVudC5pZCkpIHtcclxuICAgICAgICBlLmNsYXNzTGlzdC5hZGQoJ2RvbmUnKVxyXG4gICAgfVxyXG4gICAgZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtY2xhc3MnLCBhc3NpZ25tZW50Q2xhc3MoYXNzaWdubWVudCwgZGF0YSkpXHJcbiAgICBjb25zdCBjbG9zZSA9IGVsZW1lbnQoJ2EnLCBbJ2Nsb3NlJywgJ21hdGVyaWFsLWljb25zJ10sICdjbG9zZScpXHJcbiAgICBjbG9zZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsb3NlT3BlbmVkKVxyXG4gICAgZS5hcHBlbmRDaGlsZChjbG9zZSlcclxuXHJcbiAgICAvLyBQcmV2ZW50IGNsaWNraW5nIHRoZSBjbGFzcyBuYW1lIHdoZW4gYW4gaXRlbSBpcyBkaXNwbGF5ZWQgb24gdGhlIGNhbGVuZGFyIGZyb20gZG9pbmcgYW55dGhpbmdcclxuICAgIGlmIChsaW5rICE9IG51bGwpIHtcclxuICAgICAgICBfJChlLnF1ZXJ5U2VsZWN0b3IoJ2EnKSkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZ0KSA9PiB7XHJcbiAgICAgICAgICAgIGlmICgoZG9jdW1lbnQuYm9keS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmlldycpID09PSAnMCcpICYmICFlLmNsYXNzTGlzdC5jb250YWlucygnZnVsbCcpKSB7XHJcbiAgICAgICAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjb21wbGV0ZSA9IGVsZW1lbnQoJ2EnLCBbJ2NvbXBsZXRlJywgJ21hdGVyaWFsLWljb25zJywgJ3dhdmVzJ10sICdkb25lJylcclxuICAgIHJpcHBsZShjb21wbGV0ZSlcclxuICAgIGNvbnN0IGlkID0gc3BsaXQuYXNzaWdubWVudC5pZFxyXG4gICAgY29tcGxldGUuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIChldnQpID0+IHtcclxuICAgICAgICBpZiAoZXZ0LndoaWNoID09PSAxKSB7IC8vIExlZnQgYnV0dG9uXHJcbiAgICAgICAgICAgIGxldCBhZGRlZCA9IHRydWVcclxuICAgICAgICAgICAgaWYgKHJlZmVyZW5jZSAhPSBudWxsKSB7IC8vIFRhc2sgaXRlbVxyXG4gICAgICAgICAgICAgICAgaWYgKGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdkb25lJykpIHtcclxuICAgICAgICAgICAgICAgICAgICByZWZlcmVuY2UuZG9uZSA9IGZhbHNlXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGFkZGVkID0gZmFsc2VcclxuICAgICAgICAgICAgICAgICAgICByZWZlcmVuY2UuZG9uZSA9IHRydWVcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHNhdmVFeHRyYSgpXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZS5jbGFzc0xpc3QuY29udGFpbnMoJ2RvbmUnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlbW92ZUZyb21Eb25lKGFzc2lnbm1lbnQuaWQpXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGFkZGVkID0gZmFsc2VcclxuICAgICAgICAgICAgICAgICAgICBhZGRUb0RvbmUoYXNzaWdubWVudC5pZClcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHNhdmVEb25lKClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuYm9keS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmlldycpID09PSAnMScpIHtcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFxyXG4gICAgICAgICAgICAgICAgICAgIGAuYXNzaWdubWVudFtpZF49XFxcIiR7aWR9XFxcIl0sICN0ZXN0JHtpZH0sICNhY3Rpdml0eSR7aWR9LCAjaWEke2lkfWBcclxuICAgICAgICAgICAgICAgICkuZm9yRWFjaCgoZWxlbSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZW0uY2xhc3NMaXN0LnRvZ2dsZSgnZG9uZScpXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgaWYgKGFkZGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5hc3NpZ25tZW50Lmxpc3REaXNwOm5vdCguZG9uZSknKS5sZW5ndGggIT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdub0xpc3QnKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5hc3NpZ25tZW50Lmxpc3REaXNwOm5vdCguZG9uZSknKS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdub0xpc3QnKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJlc2l6ZSgpXHJcbiAgICAgICAgICAgIH0sIDEwMClcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFxyXG4gICAgICAgICAgICAgICAgYC5hc3NpZ25tZW50W2lkXj1cXFwiJHtpZH1cXFwiXSwgI3Rlc3Qke2lkfSwgI2FjdGl2aXR5JHtpZH0sICNpYSR7aWR9YFxyXG4gICAgICAgICAgICApLmZvckVhY2goKGVsZW0pID0+IHtcclxuICAgICAgICAgICAgICAgIGVsZW0uY2xhc3NMaXN0LnRvZ2dsZSgnZG9uZScpXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIGlmIChhZGRlZCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5hc3NpZ25tZW50Lmxpc3REaXNwOm5vdCguZG9uZSknKS5sZW5ndGggIT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ25vTGlzdCcpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmFzc2lnbm1lbnQubGlzdERpc3A6bm90KC5kb25lKScpLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnbm9MaXN0JylcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICAgIGUuYXBwZW5kQ2hpbGQoY29tcGxldGUpXHJcblxyXG4gICAgLy8gSWYgdGhlIGFzc2lnbm1lbnQgaXMgYSBjdXN0b20gb25lLCBhZGQgYSBidXR0b24gdG8gZGVsZXRlIGl0XHJcbiAgICBpZiAoc3BsaXQuY3VzdG9tKSB7XHJcbiAgICAgICAgY29uc3QgZGVsZXRlQSA9IGVsZW1lbnQoJ2EnLCBbJ21hdGVyaWFsLWljb25zJywgJ2RlbGV0ZUFzc2lnbm1lbnQnLCAnd2F2ZXMnXSwgJ2RlbGV0ZScpXHJcbiAgICAgICAgcmlwcGxlKGRlbGV0ZUEpXHJcbiAgICAgICAgZGVsZXRlQS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgKGV2dCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXZ0LndoaWNoICE9PSAxIHx8ICFyZWZlcmVuY2UpIHJldHVyblxyXG4gICAgICAgICAgICByZW1vdmVGcm9tRXh0cmEocmVmZXJlbmNlKVxyXG4gICAgICAgICAgICBzYXZlRXh0cmEoKVxyXG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZ1bGwnKSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2F1dG8nXHJcbiAgICAgICAgICAgICAgICBjb25zdCBiYWNrID0gZWxlbUJ5SWQoJ2JhY2tncm91bmQnKVxyXG4gICAgICAgICAgICAgICAgYmFjay5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmFjay5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXHJcbiAgICAgICAgICAgICAgICB9LCAzNTApXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZS5yZW1vdmUoKVxyXG4gICAgICAgICAgICBkaXNwbGF5KGZhbHNlKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgZS5hcHBlbmRDaGlsZChkZWxldGVBKVxyXG4gICAgfVxyXG5cclxuICAgIC8vIE1vZGlmaWNhdGlvbiBidXR0b25cclxuICAgIGNvbnN0IGVkaXQgPSBlbGVtZW50KCdhJywgWydlZGl0QXNzaWdubWVudCcsICdtYXRlcmlhbC1pY29ucycsICd3YXZlcyddLCAnZWRpdCcpXHJcbiAgICBlZGl0LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCAoZXZ0KSA9PiB7XHJcbiAgICAgICAgaWYgKGV2dC53aGljaCA9PT0gMSkge1xyXG4gICAgICAgICAgICBjb25zdCByZW1vdmUgPSBlZGl0LmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJylcclxuICAgICAgICAgICAgZWRpdC5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnKVxyXG4gICAgICAgICAgICBfJChlLnF1ZXJ5U2VsZWN0b3IoJy5ib2R5JykpLnNldEF0dHJpYnV0ZSgnY29udGVudEVkaXRhYmxlJywgcmVtb3ZlID8gJ2ZhbHNlJyA6ICd0cnVlJylcclxuICAgICAgICAgICAgaWYgKCFyZW1vdmUpIHtcclxuICAgICAgICAgICAgICAgIChlLnF1ZXJ5U2VsZWN0b3IoJy5ib2R5JykgYXMgSFRNTEVsZW1lbnQpLmZvY3VzKClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBkbiA9IGUucXVlcnlTZWxlY3RvcignLmNvbXBsZXRlJykgYXMgSFRNTEVsZW1lbnRcclxuICAgICAgICAgICAgZG4uc3R5bGUuZGlzcGxheSA9IHJlbW92ZSA/ICdibG9jaycgOiAnbm9uZSdcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICAgcmlwcGxlKGVkaXQpXHJcblxyXG4gICAgZS5hcHBlbmRDaGlsZChlZGl0KVxyXG5cclxuICAgIGNvbnN0IHN0YXJ0ID0gbmV3IERhdGUoZnJvbURhdGVOdW0oYXNzaWdubWVudC5zdGFydCkpXHJcbiAgICBjb25zdCBlbmQgPSBhc3NpZ25tZW50LmVuZCA9PT0gJ0ZvcmV2ZXInID8gYXNzaWdubWVudC5lbmQgOiBuZXcgRGF0ZShmcm9tRGF0ZU51bShhc3NpZ25tZW50LmVuZCkpXHJcbiAgICBjb25zdCB0aW1lcyA9IGVsZW1lbnQoJ2RpdicsICdyYW5nZScsXHJcbiAgICAgICAgYXNzaWdubWVudC5zdGFydCA9PT0gYXNzaWdubWVudC5lbmQgPyBkYXRlU3RyaW5nKHN0YXJ0KSA6IGAke2RhdGVTdHJpbmcoc3RhcnQpfSAmbmRhc2g7ICR7ZGF0ZVN0cmluZyhlbmQpfWApXHJcbiAgICBlLmFwcGVuZENoaWxkKHRpbWVzKVxyXG4gICAgaWYgKGFzc2lnbm1lbnQuYXR0YWNobWVudHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGNvbnN0IGF0dGFjaG1lbnRzID0gZWxlbWVudCgnZGl2JywgJ2F0dGFjaG1lbnRzJylcclxuICAgICAgICBhc3NpZ25tZW50LmF0dGFjaG1lbnRzLmZvckVhY2goKGF0dGFjaG1lbnQpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgYSA9IGVsZW1lbnQoJ2EnLCBbXSwgYXR0YWNobWVudFswXSkgYXMgSFRNTEFuY2hvckVsZW1lbnRcclxuICAgICAgICAgICAgYS5ocmVmID0gdXJsRm9yQXR0YWNobWVudChhdHRhY2htZW50WzFdKVxyXG4gICAgICAgICAgICBnZXRBdHRhY2htZW50TWltZVR5cGUoYXR0YWNobWVudFsxXSkudGhlbigodHlwZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IHNwYW5cclxuICAgICAgICAgICAgICAgIGlmIChtaW1lVHlwZXNbdHlwZV0gIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGEuY2xhc3NMaXN0LmFkZChtaW1lVHlwZXNbdHlwZV1bMV0pXHJcbiAgICAgICAgICAgICAgICAgICAgc3BhbiA9IGVsZW1lbnQoJ3NwYW4nLCBbXSwgbWltZVR5cGVzW3R5cGVdWzBdKVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBzcGFuID0gZWxlbWVudCgnc3BhbicsIFtdLCAnVW5rbm93biBmaWxlIHR5cGUnKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYS5hcHBlbmRDaGlsZChzcGFuKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICBhdHRhY2htZW50cy5hcHBlbmRDaGlsZChhKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgZS5hcHBlbmRDaGlsZChhdHRhY2htZW50cylcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBib2R5ID0gZWxlbWVudCgnZGl2JywgJ2JvZHknLFxyXG4gICAgICAgIGFzc2lnbm1lbnQuYm9keS5yZXBsYWNlKC9mb250LWZhbWlseTpbXjtdKj8oPzpUaW1lcyBOZXcgUm9tYW58c2VyaWYpW147XSovZywgJycpKVxyXG4gICAgY29uc3QgZWRpdHMgPSBlbGVtZW50KCdkaXYnLCAnZWRpdHMnLCAnPHNwYW4gY2xhc3M9XFwnYWRkaXRpb25zXFwnPjwvc3Bhbj48c3BhbiBjbGFzcz1cXCdkZWxldGlvbnNcXCc+PC9zcGFuPicpXHJcbiAgICBjb25zdCBtID0gbW9kaWZpZWRCb2R5KGFzc2lnbm1lbnQuaWQpXHJcbiAgICBpZiAobSAhPSBudWxsKSB7XHJcbiAgICAgICAgY29uc3QgZCA9IGRtcC5kaWZmX21haW4oYXNzaWdubWVudC5ib2R5LCBtKVxyXG4gICAgICAgIGRtcC5kaWZmX2NsZWFudXBTZW1hbnRpYyhkKVxyXG4gICAgICAgIGlmIChkLmxlbmd0aCAhPT0gMCkgeyAvLyBIYXMgYmVlbiBlZGl0ZWRcclxuICAgICAgICAgICAgcG9wdWxhdGVBZGRlZERlbGV0ZWQoZCwgZWRpdHMpXHJcbiAgICAgICAgICAgIGJvZHkuaW5uZXJIVE1MID0gbVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKGV2dCkgPT4ge1xyXG4gICAgICAgIGlmIChyZWZlcmVuY2UgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZWZlcmVuY2UuYm9keSA9IGJvZHkuaW5uZXJIVE1MXHJcbiAgICAgICAgICAgIHNhdmVFeHRyYSgpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgc2V0TW9kaWZpZWQoYXNzaWdubWVudC5pZCwgIGJvZHkuaW5uZXJIVE1MKVxyXG4gICAgICAgICAgICBzYXZlTW9kaWZpZWQoKVxyXG4gICAgICAgICAgICBjb25zdCBkID0gZG1wLmRpZmZfbWFpbihhc3NpZ25tZW50LmJvZHksIGJvZHkuaW5uZXJIVE1MKVxyXG4gICAgICAgICAgICBkbXAuZGlmZl9jbGVhbnVwU2VtYW50aWMoZClcclxuICAgICAgICAgICAgaWYgKHBvcHVsYXRlQWRkZWREZWxldGVkKGQsIGVkaXRzKSkge1xyXG4gICAgICAgICAgICAgICAgZWRpdHMuY2xhc3NMaXN0LmFkZCgnbm90RW1wdHknKVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZWRpdHMuY2xhc3NMaXN0LnJlbW92ZSgnbm90RW1wdHknKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChkb2N1bWVudC5ib2R5LmdldEF0dHJpYnV0ZSgnZGF0YS12aWV3JykgPT09ICcxJykgcmVzaXplKClcclxuICAgIH0pXHJcblxyXG4gICAgZS5hcHBlbmRDaGlsZChib2R5KVxyXG5cclxuICAgIGNvbnN0IHJlc3RvcmUgPSBlbGVtZW50KCdhJywgWydtYXRlcmlhbC1pY29ucycsICdyZXN0b3JlJ10sICdzZXR0aW5nc19iYWNrdXBfcmVzdG9yZScpXHJcbiAgICByZXN0b3JlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgIHJlbW92ZUZyb21Nb2RpZmllZChhc3NpZ25tZW50LmlkKVxyXG4gICAgICAgIHNhdmVNb2RpZmllZCgpXHJcbiAgICAgICAgYm9keS5pbm5lckhUTUwgPSBhc3NpZ25tZW50LmJvZHlcclxuICAgICAgICBlZGl0cy5jbGFzc0xpc3QucmVtb3ZlKCdub3RFbXB0eScpXHJcbiAgICAgICAgaWYgKGRvY3VtZW50LmJvZHkuZ2V0QXR0cmlidXRlKCdkYXRhLXZpZXcnKSA9PT0gJzEnKSAgcmVzaXplKClcclxuICAgIH0pXHJcbiAgICBlZGl0cy5hcHBlbmRDaGlsZChyZXN0b3JlKVxyXG4gICAgZS5hcHBlbmRDaGlsZChlZGl0cylcclxuXHJcbiAgICBjb25zdCBtb2RzID0gZWxlbWVudCgnZGl2JywgWydtb2RzJ10pXHJcbiAgICByZWNlbnRBY3Rpdml0eSgpLmZvckVhY2goKGEpID0+IHtcclxuICAgICAgICBpZiAoKGFbMF0gPT09ICdlZGl0JykgJiYgKGFbMV0uaWQgPT09IGFzc2lnbm1lbnQuaWQpKSB7XHJcbiAgICAgICAgY29uc3QgdGUgPSBlbGVtZW50KCdkaXYnLCBbJ2lubmVyQWN0aXZpdHknLCAnYXNzaWdubWVudEl0ZW0nLCBhc3NpZ25tZW50LmJhc2VUeXBlXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgYDxpIGNsYXNzPSdtYXRlcmlhbC1pY29ucyc+ZWRpdDwvaT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPSd0aXRsZSc+JHtkYXRlU3RyaW5nKG5ldyBEYXRlKGFbMl0pKX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz0nYWRkaXRpb25zJz48L3NwYW4+PHNwYW4gY2xhc3M9J2RlbGV0aW9ucyc+PC9zcGFuPmAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGBpYSR7YXNzaWdubWVudC5pZH1gKVxyXG4gICAgICAgIGNvbnN0IGQgPSBkbXAuZGlmZl9tYWluKGFbMV0uYm9keSwgYXNzaWdubWVudC5ib2R5KVxyXG4gICAgICAgIGRtcC5kaWZmX2NsZWFudXBTZW1hbnRpYyhkKVxyXG4gICAgICAgIHBvcHVsYXRlQWRkZWREZWxldGVkKGQsIHRlKVxyXG5cclxuICAgICAgICBpZiAoYXNzaWdubWVudC5jbGFzcykgdGUuc2V0QXR0cmlidXRlKCdkYXRhLWNsYXNzJywgZGF0YS5jbGFzc2VzW2Fzc2lnbm1lbnQuY2xhc3NdKVxyXG4gICAgICAgIHRlLmFwcGVuZENoaWxkKGVsZW1lbnQoJ2RpdicsICdpYURpZmYnLCBkbXAuZGlmZl9wcmV0dHlIdG1sKGQpKSlcclxuICAgICAgICB0ZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgdGUuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJylcclxuICAgICAgICAgICAgaWYgKGRvY3VtZW50LmJvZHkuZ2V0QXR0cmlidXRlKCdkYXRhLXZpZXcnKSA9PT0gJzEnKSByZXNpemUoKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgbW9kcy5hcHBlbmRDaGlsZCh0ZSlcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICAgZS5hcHBlbmRDaGlsZChtb2RzKVxyXG5cclxuICAgIGlmIChzZXR0aW5ncy5hc3NpZ25tZW50U3BhbiA9PT0gJ211bHRpcGxlJyAmJiAoc3RhcnQgPCBzcGxpdC5zdGFydCkpIHtcclxuICAgICAgICBlLmNsYXNzTGlzdC5hZGQoJ2Zyb21XZWVrZW5kJylcclxuICAgIH1cclxuICAgIGlmIChzZXR0aW5ncy5hc3NpZ25tZW50U3BhbiA9PT0gJ211bHRpcGxlJyAmJiAoZW5kID4gc3BsaXQuZW5kKSkge1xyXG4gICAgICAgIGUuY2xhc3NMaXN0LmFkZCgnb3ZlcldlZWtlbmQnKVxyXG4gICAgfVxyXG4gICAgZS5jbGFzc0xpc3QuYWRkKGBzJHtzcGxpdC5zdGFydC5nZXREYXkoKX1gKVxyXG4gICAgaWYgKHNwbGl0LmVuZCAhPT0gJ0ZvcmV2ZXInKSBlLmNsYXNzTGlzdC5hZGQoYGUkezYgLSBzcGxpdC5lbmQuZ2V0RGF5KCl9YClcclxuXHJcbiAgICBjb25zdCBzdCA9IE1hdGguZmxvb3Ioc3BsaXQuc3RhcnQuZ2V0VGltZSgpIC8gMTAwMCAvIDM2MDAgLyAyNClcclxuICAgIGlmIChzcGxpdC5hc3NpZ25tZW50LmVuZCA9PT0gJ0ZvcmV2ZXInKSB7XHJcbiAgICAgICAgaWYgKHN0IDw9ICh0b2RheSgpICsgZ2V0TGlzdERhdGVPZmZzZXQoKSkpIHtcclxuICAgICAgICAgICAgZS5jbGFzc0xpc3QuYWRkKCdsaXN0RGlzcCcpXHJcbiAgICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zdCBtaWREYXRlID0gbmV3IERhdGUoKVxyXG4gICAgICAgIG1pZERhdGUuc2V0RGF0ZShtaWREYXRlLmdldERhdGUoKSArIGdldExpc3REYXRlT2Zmc2V0KCkpXHJcbiAgICAgICAgY29uc3QgcHVzaCA9IChhc3NpZ25tZW50LmJhc2VUeXBlID09PSAndGVzdCcgJiYgYXNzaWdubWVudC5zdGFydCA9PT0gc3QpID8gc2V0dGluZ3MuZWFybHlUZXN0IDogMFxyXG4gICAgICAgIGNvbnN0IGVuZEV4dHJhID0gZ2V0TGlzdERhdGVPZmZzZXQoKSA9PT0gMCA/IGdldFRpbWVBZnRlcihtaWREYXRlKSA6IDI0ICogMzYwMCAqIDEwMDBcclxuICAgICAgICBpZiAoZnJvbURhdGVOdW0oc3QgLSBwdXNoKSA8PSBtaWREYXRlICYmXHJcbiAgICAgICAgICAgIChzcGxpdC5lbmQgPT09ICdGb3JldmVyJyB8fCBtaWREYXRlLmdldFRpbWUoKSA8PSBzcGxpdC5lbmQuZ2V0VGltZSgpICsgZW5kRXh0cmEpKSB7XHJcbiAgICAgICAgICAgIGUuY2xhc3NMaXN0LmFkZCgnbGlzdERpc3AnKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBBZGQgY2xpY2sgaW50ZXJhY3Rpdml0eVxyXG4gICAgaWYgKCFzcGxpdC5jdXN0b20gfHwgIXNldHRpbmdzLnNlcFRhc2tzKSB7XHJcbiAgICAgICAgZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldnQpID0+IHtcclxuICAgICAgICAgICAgaWYgKChkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdmdWxsJykubGVuZ3RoID09PSAwKSAmJlxyXG4gICAgICAgICAgICAgICAgKGRvY3VtZW50LmJvZHkuZ2V0QXR0cmlidXRlKCdkYXRhLXZpZXcnKSA9PT0gJzAnKSkge1xyXG4gICAgICAgICAgICAgICAgZS5jbGFzc0xpc3QucmVtb3ZlKCdhbmltJylcclxuICAgICAgICAgICAgICAgIGUuY2xhc3NMaXN0LmFkZCgnbW9kaWZ5JylcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRvcCA9IChlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCAtIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAtIGNzc051bWJlcihlLnN0eWxlLm1hcmdpblRvcCkpICsgNDRcclxuICAgICAgICAgICAgICAgIGUuc3R5bGUudG9wID0gdG9wIC0gd2luZG93LnBhZ2VZT2Zmc2V0ICsgJ3B4J1xyXG4gICAgICAgICAgICAgICAgZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtdG9wJywgU3RyaW5nKHRvcCkpXHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbidcclxuICAgICAgICAgICAgICAgIGNvbnN0IGJhY2sgPSBlbGVtQnlJZCgnYmFja2dyb3VuZCcpXHJcbiAgICAgICAgICAgICAgICBiYWNrLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcbiAgICAgICAgICAgICAgICBiYWNrLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXHJcbiAgICAgICAgICAgICAgICBlLmNsYXNzTGlzdC5hZGQoJ2FuaW0nKVxyXG4gICAgICAgICAgICAgICAgZm9yY2VMYXlvdXQoZSlcclxuICAgICAgICAgICAgICAgIGUuY2xhc3NMaXN0LmFkZCgnZnVsbCcpXHJcbiAgICAgICAgICAgICAgICBlLnN0eWxlLnRvcCA9ICg3NSAtIGNzc051bWJlcihlLnN0eWxlLm1hcmdpblRvcCkpICsgJ3B4J1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiBlLmNsYXNzTGlzdC5yZW1vdmUoJ2FuaW0nKSwgMzUwKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZVxyXG59XHJcblxyXG4vLyBJbiBvcmRlciB0byBkaXNwbGF5IGFuIGFzc2lnbm1lbnQgaW4gdGhlIGNvcnJlY3QgWCBwb3NpdGlvbiwgY2xhc3NlcyB3aXRoIG5hbWVzIGVYIGFuZCBlWCBhcmVcclxuLy8gdXNlZCwgd2hlcmUgWCBpcyB0aGUgbnVtYmVyIG9mIHNxdWFyZXMgdG8gZnJvbSB0aGUgYXNzaWdubWVudCB0byB0aGUgbGVmdC9yaWdodCBzaWRlIG9mIHRoZVxyXG4vLyBzY3JlZW4uIFRoZSBmdW5jdGlvbiBiZWxvdyBkZXRlcm1pbmVzIHdoaWNoIGVYIGFuZCBzWCBjbGFzcyB0aGUgZ2l2ZW4gZWxlbWVudCBoYXMuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRFUyhlbDogSFRNTEVsZW1lbnQpOiBbc3RyaW5nLCBzdHJpbmddIHtcclxuICAgIGxldCBlID0gMFxyXG4gICAgbGV0IHMgPSAwXHJcblxyXG4gICAgQXJyYXkuZnJvbShuZXcgQXJyYXkoNyksIChfLCB4KSA9PiB4KS5mb3JFYWNoKCh4KSA9PiB7XHJcbiAgICAgICAgaWYgKGVsLmNsYXNzTGlzdC5jb250YWlucyhgZSR7eH1gKSkge1xyXG4gICAgICAgICAgICBlID0geFxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZWwuY2xhc3NMaXN0LmNvbnRhaW5zKGBzJHt4fWApKSB7XHJcbiAgICAgICAgICAgIHMgPSB4XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICAgIHJldHVybiBbYGUke2V9YCwgYHMke3N9YF1cclxufVxyXG5cclxuLy8gQmVsb3cgaXMgYSBmdW5jdGlvbiB0byBjbG9zZSB0aGUgY3VycmVudCBhc3NpZ25tZW50IHRoYXQgaXMgb3BlbmVkLlxyXG5leHBvcnQgZnVuY3Rpb24gY2xvc2VPcGVuZWQoZXZ0OiBFdmVudCk6IHZvaWQge1xyXG4gICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICBjb25zdCBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mdWxsJykgYXMgSFRNTEVsZW1lbnR8bnVsbFxyXG4gICAgaWYgKGVsID09IG51bGwpIHJldHVyblxyXG5cclxuICAgIGVsLnN0eWxlLnRvcCA9IE51bWJlcihlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdG9wJykgfHwgJzAnKSAtIHdpbmRvdy5wYWdlWU9mZnNldCArICdweCdcclxuICAgIGVsLmNsYXNzTGlzdC5hZGQoJ2FuaW0nKVxyXG4gICAgZWwuY2xhc3NMaXN0LnJlbW92ZSgnZnVsbCcpXHJcbiAgICBlbC5zY3JvbGxUb3AgPSAwXHJcbiAgICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2F1dG8nXHJcbiAgICBjb25zdCBiYWNrID0gZWxlbUJ5SWQoJ2JhY2tncm91bmQnKVxyXG4gICAgYmFjay5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG5cclxuICAgIGNvbnN0IHRyYW5zaXRpb25MaXN0ZW5lciA9ICgpID0+IHtcclxuICAgICAgICBiYWNrLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcclxuICAgICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKCdhbmltJylcclxuICAgICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKCdtb2RpZnknKVxyXG4gICAgICAgIGVsLnN0eWxlLnRvcCA9ICdhdXRvJ1xyXG4gICAgICAgIGZvcmNlTGF5b3V0KGVsKVxyXG4gICAgICAgIGVsLmNsYXNzTGlzdC5hZGQoJ2FuaW0nKVxyXG4gICAgICAgIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCB0cmFuc2l0aW9uTGlzdGVuZXIpXHJcbiAgICB9XHJcblxyXG4gICAgZWwuYWRkRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIHRyYW5zaXRpb25MaXN0ZW5lcilcclxufVxyXG4iLCJpbXBvcnQgeyBlbGVtQnlJZCwgbG9jYWxTdG9yYWdlUmVhZCB9IGZyb20gJy4uL3V0aWwnXHJcblxyXG4vLyBUaGVuLCB0aGUgdXNlcm5hbWUgaW4gdGhlIHNpZGViYXIgbmVlZHMgdG8gYmUgc2V0IGFuZCB3ZSBuZWVkIHRvIGdlbmVyYXRlIGFuIFwiYXZhdGFyXCIgYmFzZWQgb25cclxuLy8gaW5pdGlhbHMuIFRvIGRvIHRoYXQsIHNvbWUgY29kZSB0byBjb252ZXJ0IGZyb20gTEFCIHRvIFJHQiBjb2xvcnMgaXMgYm9ycm93ZWQgZnJvbVxyXG4vLyBodHRwczovL2dpdGh1Yi5jb20vYm9yb25pbmUvY29sb3JzcGFjZXMuanNcclxuLy9cclxuLy8gTEFCIGlzIGEgY29sb3IgbmFtaW5nIHNjaGVtZSB0aGF0IHVzZXMgdHdvIHZhbHVlcyAoQSBhbmQgQikgYWxvbmcgd2l0aCBhIGxpZ2h0bmVzcyB2YWx1ZSBpbiBvcmRlclxyXG4vLyB0byBwcm9kdWNlIGNvbG9ycyB0aGF0IGFyZSBlcXVhbGx5IHNwYWNlZCBiZXR3ZWVuIGFsbCBvZiB0aGUgY29sb3JzIHRoYXQgY2FuIGJlIHNlZW4gYnkgdGhlIGh1bWFuXHJcbi8vIGV5ZS4gVGhpcyB3b3JrcyBncmVhdCBiZWNhdXNlIGV2ZXJ5b25lIGhhcyBsZXR0ZXJzIGluIGhpcy9oZXIgaW5pdGlhbHMuXHJcblxyXG4vLyBUaGUgRDY1IHN0YW5kYXJkIGlsbHVtaW5hbnRcclxuY29uc3QgUkVGX1ggPSAwLjk1MDQ3XHJcbmNvbnN0IFJFRl9ZID0gMS4wMDAwMFxyXG5jb25zdCBSRUZfWiA9IDEuMDg4ODNcclxuXHJcbi8vIENJRSBMKmEqYiogY29uc3RhbnRzXHJcbmNvbnN0IExBQl9FID0gMC4wMDg4NTZcclxuY29uc3QgTEFCX0sgPSA5MDMuM1xyXG5cclxuY29uc3QgTSA9IFtcclxuICAgIFszLjI0MDYsIC0xLjUzNzIsIC0wLjQ5ODZdLFxyXG4gICAgWy0wLjk2ODksIDEuODc1OCwgIDAuMDQxNV0sXHJcbiAgICBbMC4wNTU3LCAtMC4yMDQwLCAgMS4wNTcwXVxyXG5dXHJcblxyXG5jb25zdCBmSW52ID0gKHQ6IG51bWJlcikgPT4ge1xyXG4gICAgaWYgKE1hdGgucG93KHQsIDMpID4gTEFCX0UpIHtcclxuICAgIHJldHVybiBNYXRoLnBvdyh0LCAzKVxyXG4gICAgfSBlbHNlIHtcclxuICAgIHJldHVybiAoKDExNiAqIHQpIC0gMTYpIC8gTEFCX0tcclxuICAgIH1cclxufVxyXG5jb25zdCBkb3RQcm9kdWN0ID0gKGE6IG51bWJlcltdLCBiOiBudW1iZXJbXSkgPT4ge1xyXG4gICAgbGV0IHJldCA9IDBcclxuICAgIGEuZm9yRWFjaCgoXywgaSkgPT4ge1xyXG4gICAgICAgIHJldCArPSBhW2ldICogYltpXVxyXG4gICAgfSlcclxuICAgIHJldHVybiByZXRcclxufVxyXG5jb25zdCBmcm9tTGluZWFyID0gKGM6IG51bWJlcikgPT4ge1xyXG4gICAgY29uc3QgYSA9IDAuMDU1XHJcbiAgICBpZiAoYyA8PSAwLjAwMzEzMDgpIHtcclxuICAgICAgICByZXR1cm4gMTIuOTIgKiBjXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiAoMS4wNTUgKiBNYXRoLnBvdyhjLCAxIC8gMi40KSkgLSAwLjA1NVxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBsYWJyZ2IobDogbnVtYmVyLCBhOiBudW1iZXIsIGI6IG51bWJlcik6IHN0cmluZyB7XHJcbiAgICBjb25zdCB2YXJZID0gKGwgKyAxNikgLyAxMTZcclxuICAgIGNvbnN0IHZhclogPSB2YXJZIC0gKGIgLyAyMDApXHJcbiAgICBjb25zdCB2YXJYID0gKGEgLyA1MDApICsgdmFyWVxyXG4gICAgY29uc3QgX1ggPSBSRUZfWCAqIGZJbnYodmFyWClcclxuICAgIGNvbnN0IF9ZID0gUkVGX1kgKiBmSW52KHZhclkpXHJcbiAgICBjb25zdCBfWiA9IFJFRl9aICogZkludih2YXJaKVxyXG5cclxuICAgIGNvbnN0IHR1cGxlID0gW19YLCBfWSwgX1pdXHJcblxyXG4gICAgY29uc3QgX1IgPSBmcm9tTGluZWFyKGRvdFByb2R1Y3QoTVswXSwgdHVwbGUpKVxyXG4gICAgY29uc3QgX0cgPSBmcm9tTGluZWFyKGRvdFByb2R1Y3QoTVsxXSwgdHVwbGUpKVxyXG4gICAgY29uc3QgX0IgPSBmcm9tTGluZWFyKGRvdFByb2R1Y3QoTVsyXSwgdHVwbGUpKVxyXG5cclxuICAgIC8vIE9yaWdpbmFsIGZyb20gaGVyZVxyXG4gICAgY29uc3QgbiA9ICh2OiBudW1iZXIpID0+IE1hdGgucm91bmQoTWF0aC5tYXgoTWF0aC5taW4odiAqIDI1NiwgMjU1KSwgMCkpXHJcbiAgICByZXR1cm4gYHJnYigke24oX1IpfSwgJHtuKF9HKX0sICR7bihfQil9KWBcclxufVxyXG5cclxuLyoqXHJcbiAqIENvbnZlcnQgYSBsZXR0ZXIgdG8gYSBmbG9hdCB2YWx1ZWQgZnJvbSAwIHRvIDI1NVxyXG4gKi9cclxuZnVuY3Rpb24gbGV0dGVyVG9Db2xvclZhbChsZXR0ZXI6IHN0cmluZyk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gKCgobGV0dGVyLmNoYXJDb2RlQXQoMCkgLSA2NSkgLyAyNikgKiAyNTYpIC0gMTI4XHJcbn1cclxuXHJcbi8vIFRoZSBmdW5jdGlvbiBiZWxvdyB1c2VzIHRoaXMgYWxnb3JpdGhtIHRvIGdlbmVyYXRlIGEgYmFja2dyb3VuZCBjb2xvciBmb3IgdGhlIGluaXRpYWxzIGRpc3BsYXllZCBpbiB0aGUgc2lkZWJhci5cclxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZUF2YXRhcigpOiB2b2lkIHtcclxuICAgIGlmICghbG9jYWxTdG9yYWdlUmVhZCgndXNlcm5hbWUnKSkgcmV0dXJuXHJcbiAgICBjb25zdCB1c2VyRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndXNlcicpXHJcbiAgICBjb25zdCBpbml0aWFsc0VsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2luaXRpYWxzJylcclxuICAgIGlmICghdXNlckVsIHx8ICFpbml0aWFsc0VsKSByZXR1cm5cclxuXHJcbiAgICB1c2VyRWwuaW5uZXJIVE1MID0gbG9jYWxTdG9yYWdlUmVhZCgndXNlcm5hbWUnKVxyXG4gICAgY29uc3QgaW5pdGlhbHMgPSBsb2NhbFN0b3JhZ2VSZWFkKCd1c2VybmFtZScpLm1hdGNoKC9cXGQqKC4pLio/KC4kKS8pIC8vIFNlcGFyYXRlIHllYXIgZnJvbSBmaXJzdCBuYW1lIGFuZCBpbml0aWFsXHJcbiAgICBpZiAoaW5pdGlhbHMgIT0gbnVsbCkge1xyXG4gICAgICAgIGNvbnN0IGJnID0gbGFicmdiKDUwLCBsZXR0ZXJUb0NvbG9yVmFsKGluaXRpYWxzWzFdKSwgbGV0dGVyVG9Db2xvclZhbChpbml0aWFsc1syXSkpIC8vIENvbXB1dGUgdGhlIGNvbG9yXHJcbiAgICAgICAgaW5pdGlhbHNFbC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBiZ1xyXG4gICAgICAgIGluaXRpYWxzRWwuaW5uZXJIVE1MID0gaW5pdGlhbHNbMV0gKyBpbml0aWFsc1syXVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IHRvZGF5IH0gZnJvbSAnLi4vZGF0ZXMnXHJcbmltcG9ydCB7IGVsZW1lbnQgfSBmcm9tICcuLi91dGlsJ1xyXG5cclxuY29uc3QgTU9OVEhTID0gWydKYW4nLCAnRmViJywgJ01hcicsICdBcHInLCAnTWF5JywgJ0p1bicsICdKdWwnLCAnQXVnJywgJ1NlcCcsICdPY3QnLCAnTm92JywgJ0RlYyddXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlV2VlayhpZDogc3RyaW5nKTogSFRNTEVsZW1lbnQge1xyXG4gICAgY29uc3Qgd2sgPSBlbGVtZW50KCdzZWN0aW9uJywgJ3dlZWsnLCBudWxsLCBpZClcclxuICAgIGNvbnN0IGRheVRhYmxlID0gZWxlbWVudCgndGFibGUnLCAnZGF5VGFibGUnKSBhcyBIVE1MVGFibGVFbGVtZW50XHJcbiAgICBjb25zdCB0ciA9IGRheVRhYmxlLmluc2VydFJvdygpXHJcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmUgbm8tbG9vcHNcclxuICAgIGZvciAobGV0IGRheSA9IDA7IGRheSA8IDc7IGRheSsrKSB0ci5pbnNlcnRDZWxsKClcclxuICAgIHdrLmFwcGVuZENoaWxkKGRheVRhYmxlKVxyXG5cclxuICAgIHJldHVybiB3a1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRGF5KGQ6IERhdGUpOiBIVE1MRWxlbWVudCB7XHJcbiAgICBjb25zdCBkYXkgPSBlbGVtZW50KCdkaXYnLCAnZGF5JywgbnVsbCwgJ2RheScpXHJcbiAgICBkYXkuc2V0QXR0cmlidXRlKCdkYXRhLWRhdGUnLCBTdHJpbmcoZC5nZXRUaW1lKCkpKVxyXG4gICAgaWYgKE1hdGguZmxvb3IoKGQuZ2V0VGltZSgpIC0gZC5nZXRUaW1lem9uZU9mZnNldCgpKSAvIDEwMDAgLyAzNjAwIC8gMjQpID09PSB0b2RheSgpKSB7XHJcbiAgICAgIGRheS5jbGFzc0xpc3QuYWRkKCd0b2RheScpXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbW9udGggPSBlbGVtZW50KCdzcGFuJywgJ21vbnRoJywgTU9OVEhTW2QuZ2V0TW9udGgoKV0pXHJcbiAgICBkYXkuYXBwZW5kQ2hpbGQobW9udGgpXHJcblxyXG4gICAgY29uc3QgZGF0ZSA9IGVsZW1lbnQoJ3NwYW4nLCAnZGF0ZScsIFN0cmluZyhkLmdldERhdGUoKSkpXHJcbiAgICBkYXkuYXBwZW5kQ2hpbGQoZGF0ZSlcclxuXHJcbiAgICByZXR1cm4gZGF5XHJcbn1cclxuIiwiaW1wb3J0IHsgZ2V0Q2xhc3NlcywgZ2V0RGF0YSB9IGZyb20gJy4uL3BjcidcclxuaW1wb3J0IHsgXyQsIGNhcGl0YWxpemVTdHJpbmcsIGVsZW1CeUlkLCBlbGVtZW50IH0gZnJvbSAnLi4vdXRpbCdcclxuXHJcbi8vIFdoZW4gYW55dGhpbmcgaXMgdHlwZWQsIHRoZSBzZWFyY2ggc3VnZ2VzdGlvbnMgbmVlZCB0byBiZSB1cGRhdGVkLlxyXG5jb25zdCBUSVBfTkFNRVMgPSB7XHJcbiAgICBmb3I6IFsnZm9yJ10sXHJcbiAgICBieTogWydieScsICdkdWUnLCAnZW5kaW5nJ10sXHJcbiAgICBzdGFydGluZzogWydzdGFydGluZycsICdiZWdpbm5pbmcnLCAnYXNzaWduZWQnXVxyXG59XHJcblxyXG5jb25zdCBuZXdUZXh0ID0gZWxlbUJ5SWQoJ25ld1RleHQnKSBhcyBIVE1MSW5wdXRFbGVtZW50XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlTmV3VGlwcyh2YWw6IHN0cmluZywgc2Nyb2xsOiBib29sZWFuID0gdHJ1ZSk6IHZvaWQge1xyXG4gICAgaWYgKHNjcm9sbCkge1xyXG4gICAgICAgIGVsZW1CeUlkKCduZXdUaXBzJykuc2Nyb2xsVG9wID0gMFxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHNwYWNlSW5kZXggPSB2YWwubGFzdEluZGV4T2YoJyAnKVxyXG4gICAgaWYgKHNwYWNlSW5kZXggIT09IC0xKSB7XHJcbiAgICAgICAgY29uc3QgYmVmb3JlU3BhY2UgPSB2YWwubGFzdEluZGV4T2YoJyAnLCBzcGFjZUluZGV4IC0gMSlcclxuICAgICAgICBjb25zdCBiZWZvcmUgPSB2YWwuc3Vic3RyaW5nKChiZWZvcmVTcGFjZSA9PT0gLTEgPyAwIDogYmVmb3JlU3BhY2UgKyAxKSwgc3BhY2VJbmRleClcclxuICAgICAgICBPYmplY3QuZW50cmllcyhUSVBfTkFNRVMpLmZvckVhY2goKFtuYW1lLCBwb3NzaWJsZV0pID0+IHtcclxuICAgICAgICAgICAgaWYgKHBvc3NpYmxlLmluZGV4T2YoYmVmb3JlKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChuYW1lID09PSAnZm9yJykge1xyXG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKFRJUF9OQU1FUykuZm9yRWFjaCgodGlwTmFtZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtQnlJZChgdGlwJHt0aXBOYW1lfWApLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICBnZXRDbGFzc2VzKCkuZm9yRWFjaCgoY2xzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGlkID0gYHRpcGNsYXNzJHtjbHMucmVwbGFjZSgvXFxXLywgJycpfWBcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNwYWNlSW5kZXggPT09ICh2YWwubGVuZ3RoIC0gMSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjb250YWluZXIgPSBlbGVtZW50KCdkaXYnLCBbJ2NsYXNzVGlwJywgJ2FjdGl2ZScsICd0aXAnXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYDxpIGNsYXNzPSdtYXRlcmlhbC1pY29ucyc+Y2xhc3M8L2k+PHNwYW4gY2xhc3M9J3R5cGVkJz4ke2Nsc308L3NwYW4+YCwgaWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGlwQ29tcGxldGUoY2xzKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtQnlJZCgnbmV3VGlwcycpLmFwcGVuZENoaWxkKGNvbnRhaW5lcilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1CeUlkKGlkKS5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNscy50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHZhbC50b0xvd2VyQ2FzZSgpLnN1YnN0cihzcGFjZUluZGV4ICsgMSkpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNsYXNzVGlwJykuZm9yRWFjaCgoZWwpID0+IHtcclxuICAgICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gICAgfSlcclxuICAgIGlmICgodmFsID09PSAnJykgfHwgKHZhbC5jaGFyQXQodmFsLmxlbmd0aCAtIDEpID09PSAnICcpKSB7XHJcbiAgICAgICAgdXBkYXRlVGlwKCdmb3InLCAnZm9yJywgZmFsc2UpXHJcbiAgICAgICAgdXBkYXRlVGlwKCdieScsICdieScsIGZhbHNlKVxyXG4gICAgICAgIHVwZGF0ZVRpcCgnc3RhcnRpbmcnLCAnc3RhcnRpbmcnLCBmYWxzZSlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc3QgbGFzdFNwYWNlID0gdmFsLmxhc3RJbmRleE9mKCcgJylcclxuICAgICAgICBsZXQgbGFzdFdvcmQgPSBsYXN0U3BhY2UgPT09IC0xID8gdmFsIDogdmFsLnN1YnN0cihsYXN0U3BhY2UgKyAxKVxyXG4gICAgICAgIGNvbnN0IHVwcGVyY2FzZSA9IGxhc3RXb3JkLmNoYXJBdCgwKSA9PT0gbGFzdFdvcmQuY2hhckF0KDApLnRvVXBwZXJDYXNlKClcclxuICAgICAgICBsYXN0V29yZCA9IGxhc3RXb3JkLnRvTG93ZXJDYXNlKClcclxuICAgICAgICBPYmplY3QuZW50cmllcyhUSVBfTkFNRVMpLmZvckVhY2goKFtuYW1lLCBwb3NzaWJsZV0pID0+IHtcclxuICAgICAgICAgICAgbGV0IGZvdW5kOiBzdHJpbmd8bnVsbCA9IG51bGxcclxuICAgICAgICAgICAgcG9zc2libGUuZm9yRWFjaCgocCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHAuc2xpY2UoMCwgbGFzdFdvcmQubGVuZ3RoKSA9PT0gbGFzdFdvcmQpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IHBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgaWYgKGZvdW5kKSB7XHJcbiAgICAgICAgICAgICAgICB1cGRhdGVUaXAobmFtZSwgZm91bmQsIHVwcGVyY2FzZSlcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGVsZW1CeUlkKGB0aXAke25hbWV9YCkuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZVRpcChuYW1lOiBzdHJpbmcsIHR5cGVkOiBzdHJpbmcsIGNhcGl0YWxpemU6IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgIGlmIChuYW1lICE9PSAnZm9yJyAmJiBuYW1lICE9PSAnYnknICYmIG5hbWUgIT09ICdzdGFydGluZycpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgdGlwIG5hbWUnKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGVsID0gZWxlbUJ5SWQoYHRpcCR7bmFtZX1gKVxyXG4gICAgZWwuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuICAgIF8kKGVsLnF1ZXJ5U2VsZWN0b3IoJy50eXBlZCcpKS5pbm5lckhUTUwgPSAoY2FwaXRhbGl6ZSA/IGNhcGl0YWxpemVTdHJpbmcodHlwZWQpIDogdHlwZWQpICsgJy4uLidcclxuICAgIGNvbnN0IG5ld05hbWVzOiBzdHJpbmdbXSA9IFtdXHJcbiAgICBUSVBfTkFNRVNbbmFtZV0uZm9yRWFjaCgobikgPT4ge1xyXG4gICAgICAgIGlmIChuICE9PSB0eXBlZCkgeyBuZXdOYW1lcy5wdXNoKGA8Yj4ke259PC9iPmApIH1cclxuICAgIH0pXHJcbiAgICBfJChlbC5xdWVyeVNlbGVjdG9yKCcub3RoZXJzJykpLmlubmVySFRNTCA9IG5ld05hbWVzLmxlbmd0aCA+IDAgPyBgWW91IGNhbiBhbHNvIHVzZSAke25ld05hbWVzLmpvaW4oJyBvciAnKX1gIDogJydcclxufVxyXG5cclxuZnVuY3Rpb24gdGlwQ29tcGxldGUoYXV0b2NvbXBsZXRlOiBzdHJpbmcpOiAoZXZ0OiBFdmVudCkgPT4gdm9pZCB7XHJcbiAgICByZXR1cm4gKGV2dDogRXZlbnQpID0+IHtcclxuICAgICAgICBjb25zdCB2YWwgPSBuZXdUZXh0LnZhbHVlXHJcbiAgICAgICAgY29uc3QgbGFzdFNwYWNlID0gdmFsLmxhc3RJbmRleE9mKCcgJylcclxuICAgICAgICBjb25zdCBsYXN0V29yZCA9IGxhc3RTcGFjZSA9PT0gLTEgPyAwIDogbGFzdFNwYWNlICsgMVxyXG4gICAgICAgIHVwZGF0ZU5ld1RpcHMobmV3VGV4dC52YWx1ZSA9IHZhbC5zdWJzdHJpbmcoMCwgbGFzdFdvcmQpICsgYXV0b2NvbXBsZXRlICsgJyAnKVxyXG4gICAgICAgIHJldHVybiBuZXdUZXh0LmZvY3VzKClcclxuICAgIH1cclxufVxyXG5cclxuLy8gVGhlIGV2ZW50IGxpc3RlbmVyIGlzIHRoZW4gYWRkZWQgdG8gdGhlIHByZWV4aXN0aW5nIHRpcHMuXHJcbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50aXAnKS5mb3JFYWNoKCh0aXApID0+IHtcclxuICAgIHRpcC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRpcENvbXBsZXRlKF8kKHRpcC5xdWVyeVNlbGVjdG9yKCcudHlwZWQnKSkuaW5uZXJIVE1MKSlcclxufSlcclxuIiwiaW1wb3J0IHsgVkVSU0lPTiB9IGZyb20gJy4uL2FwcCdcclxuaW1wb3J0IHsgZWxlbUJ5SWQgfSBmcm9tICcuLi91dGlsJ1xyXG5cclxuY29uc3QgRVJST1JfRk9STV9VUkwgPSAnaHR0cHM6Ly9kb2NzLmdvb2dsZS5jb20vYS9zdHVkZW50cy5oYXJrZXIub3JnL2Zvcm1zL2QvJ1xyXG4gICAgICAgICAgICAgICAgICAgICArICcxc2EyZ1V0WUZQZEtUNVlFTlhJRVlhdXlSUHVjcXNRQ1ZhUUFQZUYzYlo0US92aWV3Zm9ybSdcclxuY29uc3QgRVJST1JfRk9STV9FTlRSWSA9ICc/ZW50cnkuMTIwMDM2MjIzPSdcclxuY29uc3QgRVJST1JfR0lUSFVCX1VSTCA9ICdodHRwczovL2dpdGh1Yi5jb20vMTlSeWFuQS9DaGVja1BDUi9pc3N1ZXMvbmV3J1xyXG5cclxuY29uc3QgbGlua0J5SWQgPSAoaWQ6IHN0cmluZykgPT4gZWxlbUJ5SWQoaWQpIGFzIEhUTUxMaW5rRWxlbWVudFxyXG5cclxuLy8gKmRpc3BsYXlFcnJvciogZGlzcGxheXMgYSBkaWFsb2cgY29udGFpbmluZyBpbmZvcm1hdGlvbiBhYm91dCBhbiBlcnJvci5cclxuZXhwb3J0IGZ1bmN0aW9uIGRpc3BsYXlFcnJvcihlOiBFcnJvcik6IHZvaWQge1xyXG4gICAgY29uc29sZS5sb2coJ0Rpc3BsYXlpbmcgZXJyb3InLCBlKVxyXG4gICAgY29uc3QgZXJyb3JIVE1MID0gYE1lc3NhZ2U6ICR7ZS5tZXNzYWdlfVxcblN0YWNrOiAke2Uuc3RhY2sgfHwgKGUgYXMgYW55KS5saW5lTnVtYmVyfVxcbmBcclxuICAgICAgICAgICAgICAgICAgICArIGBCcm93c2VyOiAke25hdmlnYXRvci51c2VyQWdlbnR9XFxuVmVyc2lvbjogJHtWRVJTSU9OfWBcclxuICAgIGVsZW1CeUlkKCdlcnJvckNvbnRlbnQnKS5pbm5lckhUTUwgPSBlcnJvckhUTUwucmVwbGFjZSgnXFxuJywgJzxicj4nKVxyXG4gICAgbGlua0J5SWQoJ2Vycm9yR29vZ2xlJykuaHJlZiA9IEVSUk9SX0ZPUk1fVVJMICsgRVJST1JfRk9STV9FTlRSWSArIGVuY29kZVVSSUNvbXBvbmVudChlcnJvckhUTUwpXHJcbiAgICBsaW5rQnlJZCgnZXJyb3JHaXRIdWInKS5ocmVmID1cclxuICAgICAgICBFUlJPUl9HSVRIVUJfVVJMICsgJz9ib2R5PScgKyBlbmNvZGVVUklDb21wb25lbnQoYEkndmUgZW5jb3VudGVyZWQgYW4gYnVnLlxcblxcblxcYFxcYFxcYFxcbiR7ZXJyb3JIVE1MfVxcblxcYFxcYFxcYGApXHJcbiAgICBlbGVtQnlJZCgnZXJyb3JCYWNrZ3JvdW5kJykuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcclxuICAgIHJldHVybiBlbGVtQnlJZCgnZXJyb3InKS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG59XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCAoZXZ0KSA9PiB7XHJcbiAgICBldnQucHJldmVudERlZmF1bHQoKVxyXG4gICAgZGlzcGxheUVycm9yKGV2dC5lcnJvcilcclxufSlcclxuIiwiaW1wb3J0IHsgXyQsIGFuaW1hdGVFbCB9IGZyb20gJy4uL3V0aWwnXHJcblxyXG4vLyBGb3IgbGlzdCB2aWV3LCB0aGUgYXNzaWdubWVudHMgY2FuJ3QgYmUgb24gdG9wIG9mIGVhY2ggb3RoZXIuXHJcbi8vIFRoZXJlZm9yZSwgYSBsaXN0ZW5lciBpcyBhdHRhY2hlZCB0byB0aGUgcmVzaXppbmcgb2YgdGhlIGJyb3dzZXIgd2luZG93LlxyXG5sZXQgdGlja2luZyA9IGZhbHNlXHJcbmxldCB0aW1lb3V0SWQ6IG51bWJlcnxudWxsID0gbnVsbFxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0UmVzaXplQXNzaWdubWVudHMoKTogSFRNTEVsZW1lbnRbXSB7XHJcbiAgICBjb25zdCBhc3NpZ25tZW50cyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5jb250YWlucygnc2hvd0RvbmUnKSA/XHJcbiAgICAgICAgJy5hc3NpZ25tZW50Lmxpc3REaXNwJyA6ICcuYXNzaWdubWVudC5saXN0RGlzcDpub3QoLmRvbmUpJykpXHJcbiAgICBhc3NpZ25tZW50cy5zb3J0KChhLCBiKSA9PiB7XHJcbiAgICAgICAgY29uc3QgYWQgPSBhLmNsYXNzTGlzdC5jb250YWlucygnZG9uZScpXHJcbiAgICAgICAgY29uc3QgYmQgPSBiLmNsYXNzTGlzdC5jb250YWlucygnZG9uZScpXHJcbiAgICAgICAgaWYgKGFkICYmICFiZCkgeyByZXR1cm4gMSB9XHJcbiAgICAgICAgaWYgKGJkICYmICFhZCkgeyByZXR1cm4gLTEgfVxyXG4gICAgICAgIHJldHVybiBOdW1iZXIoKGEucXVlcnlTZWxlY3RvcignLmR1ZScpIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlKVxyXG4gICAgICAgICAgICAgLSBOdW1iZXIoKGIucXVlcnlTZWxlY3RvcignLmR1ZScpIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlKVxyXG4gICAgfSlcclxuICAgIHJldHVybiBhc3NpZ25tZW50cyBhcyBIVE1MRWxlbWVudFtdXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZXNpemVDYWxsZXIoKTogdm9pZCB7XHJcbiAgICBpZiAoIXRpY2tpbmcpIHtcclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVzaXplKVxyXG4gICAgICAgIHRpY2tpbmcgPSB0cnVlXHJcbiAgICB9XHJcbn1cclxuXHJcbmxldCBsYXN0Q29sdW1uczogbnVtYmVyfG51bGwgPSBudWxsXHJcbmxldCBsYXN0QXNzaWdubWVudHM6IG51bWJlcnxudWxsID0gbnVsbFxyXG5sZXQgbGFzdERvbmVDb3VudDogbnVtYmVyfG51bGwgPSBudWxsXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVzaXplKCk6IHZvaWQge1xyXG4gICAgdGlja2luZyA9IHRydWVcclxuICAgIC8vIFRvIGNhbGN1bGF0ZSB0aGUgbnVtYmVyIG9mIGNvbHVtbnMsIHRoZSBiZWxvdyBhbGdvcml0aG0gaXMgdXNlZCBiZWNhc2UgYXMgdGhlIHNjcmVlbiBzaXplXHJcbiAgICAvLyBpbmNyZWFzZXMsIHRoZSBjb2x1bW4gd2lkdGggaW5jcmVhc2VzXHJcbiAgICBjb25zdCB3aWR0aHMgPSBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5jb250YWlucygnc2hvd0luZm8nKSA/XHJcbiAgICAgICAgWzY1MCwgMTEwMCwgMTgwMCwgMjcwMCwgMzgwMCwgNTEwMF0gOiBbMzUwLCA4MDAsIDE1MDAsIDI0MDAsIDM1MDAsIDQ4MDBdXHJcbiAgICBsZXQgY29sdW1ucyA9IDFcclxuICAgIHdpZHRocy5mb3JFYWNoKCh3LCBpbmRleCkgPT4ge1xyXG4gICAgICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA+IHcpIHsgY29sdW1ucyA9IGluZGV4ICsgMSB9XHJcbiAgICB9KVxyXG5cclxuICAgIGNvbnN0IGNvbHVtbkhlaWdodHMgPSBBcnJheS5mcm9tKG5ldyBBcnJheShjb2x1bW5zKSwgKCkgPT4gMClcclxuICAgIGNvbnN0IGNjaDogbnVtYmVyW10gPSBbXVxyXG4gICAgY29uc3QgYXNzaWdubWVudHMgPSBnZXRSZXNpemVBc3NpZ25tZW50cygpXHJcbiAgICBjb25zdCBkb25lQ291bnQgPSBhc3NpZ25tZW50cy5maWx0ZXIoKGEpID0+IGEuY2xhc3NMaXN0LmNvbnRhaW5zKCdkb25lJykpLmxlbmd0aFxyXG4gICAgYXNzaWdubWVudHMuZm9yRWFjaCgoYXNzaWdubWVudCwgbikgPT4ge1xyXG4gICAgICAgIGNvbnN0IGNvbCA9IG4gJSBjb2x1bW5zXHJcbiAgICAgICAgY2NoLnB1c2goY29sdW1uSGVpZ2h0c1tjb2xdKVxyXG4gICAgICAgIGNvbHVtbkhlaWdodHNbY29sXSArPSBhc3NpZ25tZW50Lm9mZnNldEhlaWdodCArIDI0XHJcbiAgICB9KVxyXG4gICAgYXNzaWdubWVudHMuZm9yRWFjaCgoYXNzaWdubWVudCwgbikgPT4ge1xyXG4gICAgICAgIGNvbnN0IGNvbCA9IG4gJSBjb2x1bW5zXHJcbiAgICAgICAgYXNzaWdubWVudC5zdHlsZS50b3AgPSBjY2hbbl0gKyAncHgnXHJcbiAgICAgICAgaWYgKGNvbHVtbnMgIT09IGxhc3RDb2x1bW5zIHx8IGFzc2lnbm1lbnRzLmxlbmd0aCAhPT0gbGFzdEFzc2lnbm1lbnRzIHx8IGRvbmVDb3VudCAhPT0gbGFzdERvbmVDb3VudCkge1xyXG4gICAgICAgICAgICBjb25zdCBsZWZ0ID0gKCgxMDAgLyBjb2x1bW5zKSAqIGNvbCkgKyAnJSdcclxuICAgICAgICAgICAgY29uc3QgcmlnaHQgPSAoKDEwMCAvIGNvbHVtbnMpICogKGNvbHVtbnMgLSBjb2wgLSAxKSkgKyAnJSdcclxuICAgICAgICAgICAgaWYgKGxhc3RDb2x1bW5zID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBhc3NpZ25tZW50LnN0eWxlLmxlZnQgPSBsZWZ0XHJcbiAgICAgICAgICAgICAgICBhc3NpZ25tZW50LnN0eWxlLnJpZ2h0ID0gcmlnaHRcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGFuaW1hdGVFbChhc3NpZ25tZW50LCBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiBhc3NpZ25tZW50LnN0eWxlLmxlZnQgfHwgbGVmdCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmlnaHQ6IGFzc2lnbm1lbnQuc3R5bGUucmlnaHQgfHwgcmlnaHRcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHsgbGVmdCwgcmlnaHQgfVxyXG4gICAgICAgICAgICAgICAgXSwgeyBkdXJhdGlvbjogMzAwIH0pLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGFzc2lnbm1lbnQuc3R5bGUubGVmdCA9IGxlZnRcclxuICAgICAgICAgICAgICAgICAgICBhc3NpZ25tZW50LnN0eWxlLnJpZ2h0ID0gcmlnaHRcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICAgaWYgKHRpbWVvdXRJZCkgY2xlYXJUaW1lb3V0KHRpbWVvdXRJZClcclxuICAgIHRpbWVvdXRJZCA9IHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIGNjaC5sZW5ndGggPSAwXHJcbiAgICAgICAgYXNzaWdubWVudHMuZm9yRWFjaCgoYXNzaWdubWVudCwgbikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBjb2wgPSBuICUgY29sdW1uc1xyXG4gICAgICAgICAgICBpZiAobiA8IGNvbHVtbnMpIHtcclxuICAgICAgICAgICAgICAgIGNvbHVtbkhlaWdodHNbY29sXSA9IDBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjY2gucHVzaChjb2x1bW5IZWlnaHRzW2NvbF0pXHJcbiAgICAgICAgICAgIGNvbHVtbkhlaWdodHNbY29sXSArPSBhc3NpZ25tZW50Lm9mZnNldEhlaWdodCArIDI0XHJcbiAgICAgICAgfSlcclxuICAgICAgICBhc3NpZ25tZW50cy5mb3JFYWNoKChhc3NpZ25tZW50LCBuKSA9PiB7XHJcbiAgICAgICAgICAgIGFzc2lnbm1lbnQuc3R5bGUudG9wID0gY2NoW25dICsgJ3B4J1xyXG4gICAgICAgIH0pXHJcbiAgICB9LCA1MDApXHJcbiAgICBsYXN0Q29sdW1ucyA9IGNvbHVtbnNcclxuICAgIGxhc3RBc3NpZ25tZW50cyA9IGFzc2lnbm1lbnRzLmxlbmd0aFxyXG4gICAgbGFzdERvbmVDb3VudCA9IGRvbmVDb3VudFxyXG4gICAgdGlja2luZyA9IGZhbHNlXHJcbn1cclxuIiwiLyoqXHJcbiAqIEFsbCB0aGlzIGlzIHJlc3BvbnNpYmxlIGZvciBpcyBjcmVhdGluZyBzbmFja2JhcnMuXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgZWxlbWVudCwgZm9yY2VMYXlvdXQgfSBmcm9tICcuLi91dGlsJ1xyXG5cclxuLyoqXHJcbiAqIENyZWF0ZXMgYSBzbmFja2JhciB3aXRob3V0IGFuIGFjdGlvblxyXG4gKiBAcGFyYW0gbWVzc2FnZSBUaGUgc25hY2tiYXIncyBtZXNzYWdlXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gc25hY2tiYXIobWVzc2FnZTogc3RyaW5nKTogdm9pZFxyXG4vKipcclxuICogQ3JlYXRlcyBhIHNuYWNrYmFyIHdpdGggYW4gYWN0aW9uXHJcbiAqIEBwYXJhbSBtZXNzYWdlIFRoZSBzbmFja2JhcidzIG1lc3NhZ2VcclxuICogQHBhcmFtIGFjdGlvbiBPcHRpb25hbCB0ZXh0IHRvIHNob3cgYXMgYSBtZXNzYWdlIGFjdGlvblxyXG4gKiBAcGFyYW0gZiAgICAgIEEgZnVuY3Rpb24gdG8gZXhlY3V0ZSB3aGVuIHRoZSBhY3Rpb24gaXMgY2xpY2tlZFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHNuYWNrYmFyKG1lc3NhZ2U6IHN0cmluZywgYWN0aW9uOiBzdHJpbmcsIGY6ICgpID0+IHZvaWQpOiB2b2lkXHJcbmV4cG9ydCBmdW5jdGlvbiBzbmFja2JhcihtZXNzYWdlOiBzdHJpbmcsIGFjdGlvbj86IHN0cmluZywgZj86ICgpID0+IHZvaWQpOiB2b2lkIHtcclxuICAgIGNvbnN0IHNuYWNrID0gZWxlbWVudCgnZGl2JywgJ3NuYWNrYmFyJylcclxuICAgIGNvbnN0IHNuYWNrSW5uZXIgPSBlbGVtZW50KCdkaXYnLCAnc25hY2tJbm5lcicsIG1lc3NhZ2UpXHJcbiAgICBzbmFjay5hcHBlbmRDaGlsZChzbmFja0lubmVyKVxyXG5cclxuICAgIGlmICgoYWN0aW9uICE9IG51bGwpICYmIChmICE9IG51bGwpKSB7XHJcbiAgICAgICAgY29uc3QgYWN0aW9uRSA9IGVsZW1lbnQoJ2EnLCBbXSwgYWN0aW9uKVxyXG4gICAgICAgIGFjdGlvbkUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHNuYWNrLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgICAgICAgICAgIGYoKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgc25hY2tJbm5lci5hcHBlbmRDaGlsZChhY3Rpb25FKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGFkZCA9ICgpID0+IHtcclxuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzbmFjaylcclxuICAgICAgZm9yY2VMYXlvdXQoc25hY2spXHJcbiAgICAgIHNuYWNrLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgc25hY2suY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcclxuICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gc25hY2sucmVtb3ZlKCksIDkwMClcclxuICAgICAgfSwgNTAwMClcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBleGlzdGluZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zbmFja2JhcicpXHJcbiAgICBpZiAoZXhpc3RpbmcgIT0gbnVsbCkge1xyXG4gICAgICAgIGV4aXN0aW5nLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgICAgICAgc2V0VGltZW91dChhZGQsIDMwMClcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYWRkKClcclxuICAgIH1cclxufVxyXG4iLCJcclxuLyoqXHJcbiAqIENvb2tpZSBmdW5jdGlvbnMgKGEgY29va2llIGlzIGEgc21hbGwgdGV4dCBkb2N1bWVudCB0aGF0IHRoZSBicm93c2VyIGNhbiByZW1lbWJlcilcclxuICovXHJcblxyXG4vKipcclxuICogUmV0cmlldmVzIGEgY29va2llXHJcbiAqIEBwYXJhbSBjbmFtZSB0aGUgbmFtZSBvZiB0aGUgY29va2llIHRvIHJldHJpZXZlXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29va2llKGNuYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgY29uc3QgbmFtZSA9IGNuYW1lICsgJz0nXHJcbiAgICBjb25zdCBjb29raWVQYXJ0ID0gZG9jdW1lbnQuY29va2llLnNwbGl0KCc7JykuZmluZCgoYykgPT4gYy5pbmNsdWRlcyhuYW1lKSlcclxuICAgIGlmIChjb29raWVQYXJ0KSByZXR1cm4gY29va2llUGFydC5zdWJzdHJpbmcobmFtZS5sZW5ndGgpXHJcbiAgICByZXR1cm4gJycgLy8gQmxhbmsgaWYgY29va2llIG5vdCBmb3VuZFxyXG4gIH1cclxuXHJcbi8qKiBTZXRzIHRoZSB2YWx1ZSBvZiBhIGNvb2tpZVxyXG4gKiBAcGFyYW0gY25hbWUgdGhlIG5hbWUgb2YgdGhlIGNvb2tpZSB0byBzZXRcclxuICogQHBhcmFtIGN2YWx1ZSB0aGUgdmFsdWUgdG8gc2V0IHRoZSBjb29raWUgdG9cclxuICogQHBhcmFtIGV4ZGF5cyB0aGUgbnVtYmVyIG9mIGRheXMgdGhhdCB0aGUgY29va2llIHdpbGwgZXhwaXJlIGluIChhbmQgbm90IGJlIGV4aXN0ZW50IGFueW1vcmUpXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gc2V0Q29va2llKGNuYW1lOiBzdHJpbmcsIGN2YWx1ZTogc3RyaW5nLCBleGRheXM6IG51bWJlcik6IHZvaWQge1xyXG4gICAgY29uc3QgZCA9IG5ldyBEYXRlKClcclxuICAgIGQuc2V0VGltZShkLmdldFRpbWUoKSArIChleGRheXMgKiAyNCAqIDYwICogNjAgKiAxMDAwKSlcclxuICAgIGNvbnN0IGV4cGlyZXMgPSBgZXhwaXJlcz0ke2QudG9VVENTdHJpbmcoKX1gXHJcbiAgICBkb2N1bWVudC5jb29raWUgPSBjbmFtZSArICc9JyArIGN2YWx1ZSArICc7ICcgKyBleHBpcmVzXHJcbiAgfVxyXG5cclxuLyoqXHJcbiAqIERlbGV0cyBhIGNvb2tpZVxyXG4gKiBAcGFyYW0gY25hbWUgdGhlIG5hbWUgb2YgdGhlIGNvb2tpZSB0byBkZWxldGVcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBkZWxldGVDb29raWUoY25hbWU6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgLy8gVGhpcyBpcyBsaWtlICpzZXRDb29raWUqLCBidXQgc2V0cyB0aGUgZXhwaXJ5IGRhdGUgdG8gc29tZXRoaW5nIGluIHRoZSBwYXN0IHNvIHRoZSBjb29raWUgaXMgZGVsZXRlZC5cclxuICAgIGRvY3VtZW50LmNvb2tpZSA9IGNuYW1lICsgJz07IGV4cGlyZXM9VGh1LCAwMSBKYW4gMTk3MCAwMDowMDowMSBHTVQ7J1xyXG59XHJcbiIsImV4cG9ydCBmdW5jdGlvbiB0em9mZigpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIChuZXcgRGF0ZSgpKS5nZXRUaW1lem9uZU9mZnNldCgpICogMTAwMCAqIDYwIC8vIEZvciBmdXR1cmUgY2FsY3VsYXRpb25zXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB0b0RhdGVOdW0oZGF0ZTogRGF0ZXxudW1iZXIpOiBudW1iZXIge1xyXG4gICAgY29uc3QgbnVtID0gZGF0ZSBpbnN0YW5jZW9mIERhdGUgPyBkYXRlLmdldFRpbWUoKSA6IGRhdGVcclxuICAgIHJldHVybiBNYXRoLmZsb29yKChudW0gLSB0em9mZigpKSAvIDEwMDAgLyAzNjAwIC8gMjQpXHJcbn1cclxuXHJcbi8vICpGcm9tRGF0ZU51bSogY29udmVydHMgYSBudW1iZXIgb2YgZGF5cyB0byBhIG51bWJlciBvZiBzZWNvbmRzXHJcbmV4cG9ydCBmdW5jdGlvbiBmcm9tRGF0ZU51bShkYXlzOiBudW1iZXIpOiBEYXRlIHtcclxuICAgIGNvbnN0IGQgPSBuZXcgRGF0ZSgoZGF5cyAqIDEwMDAgKiAzNjAwICogMjQpICsgdHpvZmYoKSlcclxuICAgIC8vIFRoZSBjaGVja3MgYmVsb3cgYXJlIHRvIGhhbmRsZSBkYXlsaWdodCBzYXZpbmdzIHRpbWVcclxuICAgIGlmIChkLmdldEhvdXJzKCkgPT09IDEpIHsgZC5zZXRIb3VycygwKSB9XHJcbiAgICBpZiAoKGQuZ2V0SG91cnMoKSA9PT0gMjIpIHx8IChkLmdldEhvdXJzKCkgPT09IDIzKSkge1xyXG4gICAgICBkLnNldEhvdXJzKDI0KVxyXG4gICAgICBkLnNldE1pbnV0ZXMoMClcclxuICAgICAgZC5zZXRTZWNvbmRzKDApXHJcbiAgICB9XHJcbiAgICByZXR1cm4gZFxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdG9kYXkoKTogbnVtYmVyIHtcclxuICAgIHJldHVybiB0b0RhdGVOdW0obmV3IERhdGUoKSlcclxufVxyXG5cclxuLyoqXHJcbiAqIEl0ZXJhdGVzIGZyb20gdGhlIHN0YXJ0aW5nIGRhdGUgdG8gZW5kaW5nIGRhdGUgaW5jbHVzaXZlXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gaXRlckRheXMoc3RhcnQ6IERhdGUsIGVuZDogRGF0ZSwgY2I6IChkYXRlOiBEYXRlKSA9PiB2b2lkKTogdm9pZCB7XHJcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmUgbm8tbG9vcHNcclxuICAgIGZvciAoY29uc3QgZCA9IG5ldyBEYXRlKHN0YXJ0KTsgZCA8PSBlbmQ7IGQuc2V0RGF0ZShkLmdldERhdGUoKSArIDEpKSB7XHJcbiAgICAgICAgY2IoZClcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBjb21wdXRlV2Vla0lkLCBjcmVhdGVBc3NpZ25tZW50LCBnZXRFUywgc2VwYXJhdGVkQ2xhc3MgfSBmcm9tICcuL2NvbXBvbmVudHMvYXNzaWdubWVudCdcclxuaW1wb3J0IHsgY3JlYXRlRGF5LCBjcmVhdGVXZWVrIH0gZnJvbSAnLi9jb21wb25lbnRzL2NhbGVuZGFyJ1xyXG5pbXBvcnQgeyBkaXNwbGF5RXJyb3IgfSBmcm9tICcuL2NvbXBvbmVudHMvZXJyb3JEaXNwbGF5J1xyXG5pbXBvcnQgeyByZXNpemUgfSBmcm9tICcuL2NvbXBvbmVudHMvcmVzaXplcidcclxuaW1wb3J0IHsgZnJvbURhdGVOdW0sIGl0ZXJEYXlzLCB0b2RheSB9IGZyb20gJy4vZGF0ZXMnXHJcbmltcG9ydCB7IGNsYXNzQnlJZCwgZ2V0RGF0YSwgSUFwcGxpY2F0aW9uRGF0YSwgSUFzc2lnbm1lbnQgfSBmcm9tICcuL3BjcidcclxuaW1wb3J0IHsgYWRkQWN0aXZpdHksIHNhdmVBY3Rpdml0eSB9IGZyb20gJy4vcGx1Z2lucy9hY3Rpdml0eSdcclxuaW1wb3J0IHsgZXh0cmFUb1Rhc2ssIGdldEV4dHJhLCBJQ3VzdG9tQXNzaWdubWVudCB9IGZyb20gJy4vcGx1Z2lucy9jdXN0b21Bc3NpZ25tZW50cydcclxuaW1wb3J0IHsgYXNzaWdubWVudEluRG9uZSwgcmVtb3ZlRnJvbURvbmUsIHNhdmVEb25lIH0gZnJvbSAnLi9wbHVnaW5zL2RvbmUnXHJcbmltcG9ydCB7IGFzc2lnbm1lbnRJbk1vZGlmaWVkLCByZW1vdmVGcm9tTW9kaWZpZWQsIHNhdmVNb2RpZmllZCB9IGZyb20gJy4vcGx1Z2lucy9tb2RpZmllZEFzc2lnbm1lbnRzJ1xyXG5pbXBvcnQgeyBzZXR0aW5ncyB9IGZyb20gJy4vc2V0dGluZ3MnXHJcbmltcG9ydCB7IF8kLCBkYXRlU3RyaW5nLCBlbGVtQnlJZCwgZWxlbWVudCwgbG9jYWxTdG9yYWdlUmVhZCwgc21vb3RoU2Nyb2xsIH0gZnJvbSAnLi91dGlsJ1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJU3BsaXRBc3NpZ25tZW50IHtcclxuICAgIGFzc2lnbm1lbnQ6IElBc3NpZ25tZW50XHJcbiAgICBzdGFydDogRGF0ZVxyXG4gICAgZW5kOiBEYXRlfCdGb3JldmVyJ1xyXG4gICAgY3VzdG9tOiBib29sZWFuXHJcbiAgICByZWZlcmVuY2U/OiBJQ3VzdG9tQXNzaWdubWVudFxyXG59XHJcblxyXG5jb25zdCBTQ0hFRFVMRV9FTkRTID0ge1xyXG4gICAgZGF5OiAoZGF0ZTogRGF0ZSkgPT4gMjQgKiAzNjAwICogMTAwMCxcclxuICAgIG1zOiAoZGF0ZTogRGF0ZSkgPT4gWzI0LCAgICAgICAgICAgICAgLy8gU3VuZGF5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAxNSArICgzNSAvIDYwKSwgIC8vIE1vbmRheVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgMTUgKyAoMzUgLyA2MCksICAvLyBUdWVzZGF5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAxNSArICgxNSAvIDYwKSwgIC8vIFdlZG5lc2RheVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgMTUgKyAoMTUgLyA2MCksICAvLyBUaHVyc2RheVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgMTUgKyAoMTUgLyA2MCksICAvLyBGcmlkYXlcclxuICAgICAgICAgICAgICAgICAgICAgICAgIDI0ICAgICAgICAgICAgICAgLy8gU2F0dXJkYXlcclxuICAgICAgICAgICAgICAgICAgICAgICAgXVtkYXRlLmdldERheSgpXSxcclxuICAgIHVzOiAoZGF0ZTogRGF0ZSkgPT4gMTUgKiAzNjAwICogMTAwMFxyXG59XHJcbmNvbnN0IFdFRUtFTkRfQ0xBU1NOQU1FUyA9IFsnZnJvbVdlZWtlbmQnLCAnb3ZlcldlZWtlbmQnXVxyXG5cclxubGV0IHNjcm9sbCA9IDAgLy8gVGhlIGxvY2F0aW9uIHRvIHNjcm9sbCB0byBpbiBvcmRlciB0byByZWFjaCB0b2RheSBpbiBjYWxlbmRhciB2aWV3XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2Nyb2xsKCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gc2Nyb2xsXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRUaW1lQWZ0ZXIoZGF0ZTogRGF0ZSk6IG51bWJlciB7XHJcbiAgICBjb25zdCBoaWRlQXNzaWdubWVudHMgPSBzZXR0aW5ncy5oaWRlQXNzaWdubWVudHNcclxuICAgIGlmIChoaWRlQXNzaWdubWVudHMgPT09ICdkYXknIHx8IGhpZGVBc3NpZ25tZW50cyA9PT0gJ21zJyB8fCBoaWRlQXNzaWdubWVudHMgPT09ICd1cycpIHtcclxuICAgICAgICByZXR1cm4gU0NIRURVTEVfRU5EU1toaWRlQXNzaWdubWVudHNdKGRhdGUpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBTQ0hFRFVMRV9FTkRTLmRheShkYXRlKVxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRTdGFydEVuZERhdGVzKGRhdGE6IElBcHBsaWNhdGlvbkRhdGEpOiB7c3RhcnQ6IERhdGUsIGVuZDogRGF0ZSB9IHtcclxuICAgIGlmIChkYXRhLm1vbnRoVmlldykge1xyXG4gICAgICAgIGNvbnN0IHN0YXJ0TiA9IE1hdGgubWluKC4uLmRhdGEuYXNzaWdubWVudHMubWFwKChhKSA9PiBhLnN0YXJ0KSkgLy8gU21hbGxlc3QgZGF0ZVxyXG4gICAgICAgIGNvbnN0IGVuZE4gPSBNYXRoLm1heCguLi5kYXRhLmFzc2lnbm1lbnRzLm1hcCgoYSkgPT4gYS5zdGFydCkpIC8vIExhcmdlc3QgZGF0ZVxyXG5cclxuICAgICAgICBjb25zdCB5ZWFyID0gKG5ldyBEYXRlKCkpLmdldEZ1bGxZZWFyKCkgLy8gRm9yIGZ1dHVyZSBjYWxjdWxhdGlvbnNcclxuXHJcbiAgICAgICAgLy8gQ2FsY3VsYXRlIHdoYXQgbW9udGggd2Ugd2lsbCBiZSBkaXNwbGF5aW5nIGJ5IGZpbmRpbmcgdGhlIG1vbnRoIG9mIHRvZGF5XHJcbiAgICAgICAgY29uc3QgbW9udGggPSAobmV3IERhdGUoKSkuZ2V0TW9udGgoKVxyXG5cclxuICAgICAgICAvLyBNYWtlIHN1cmUgdGhlIHN0YXJ0IGFuZCBlbmQgZGF0ZXMgbGllIHdpdGhpbiB0aGUgbW9udGhcclxuICAgICAgICBjb25zdCBzdGFydCA9IG5ldyBEYXRlKE1hdGgubWF4KGZyb21EYXRlTnVtKHN0YXJ0TikuZ2V0VGltZSgpLCAobmV3IERhdGUoeWVhciwgbW9udGgpKS5nZXRUaW1lKCkpKVxyXG4gICAgICAgIC8vIElmIHRoZSBkYXkgYXJndW1lbnQgZm9yIERhdGUgaXMgMCwgdGhlbiB0aGUgcmVzdWx0aW5nIGRhdGUgd2lsbCBiZSBvZiB0aGUgcHJldmlvdXMgbW9udGhcclxuICAgICAgICBjb25zdCBlbmQgPSBuZXcgRGF0ZShNYXRoLm1pbihmcm9tRGF0ZU51bShlbmROKS5nZXRUaW1lKCksIChuZXcgRGF0ZSh5ZWFyLCBtb250aCArIDEsIDApKS5nZXRUaW1lKCkpKVxyXG4gICAgICAgIHJldHVybiB7IHN0YXJ0LCBlbmQgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IHRvZGF5U0UgPSBuZXcgRGF0ZSgpXHJcbiAgICAgICAgY29uc3Qgc3RhcnQgPSBuZXcgRGF0ZSh0b2RheVNFLmdldEZ1bGxZZWFyKCksIHRvZGF5U0UuZ2V0TW9udGgoKSwgdG9kYXlTRS5nZXREYXRlKCkpXHJcbiAgICAgICAgY29uc3QgZW5kID0gbmV3IERhdGUodG9kYXlTRS5nZXRGdWxsWWVhcigpLCB0b2RheVNFLmdldE1vbnRoKCksIHRvZGF5U0UuZ2V0RGF0ZSgpKVxyXG4gICAgICAgIHJldHVybiB7IHN0YXJ0LCBlbmQgfVxyXG4gICAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEFzc2lnbm1lbnRTcGxpdHMoYXNzaWdubWVudDogSUFzc2lnbm1lbnQsIHN0YXJ0OiBEYXRlLCBlbmQ6IERhdGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVmZXJlbmNlPzogSUN1c3RvbUFzc2lnbm1lbnQpOiBJU3BsaXRBc3NpZ25tZW50W10ge1xyXG4gICAgY29uc3Qgc3BsaXQ6IElTcGxpdEFzc2lnbm1lbnRbXSA9IFtdXHJcbiAgICBpZiAoc2V0dGluZ3MuYXNzaWdubWVudFNwYW4gPT09ICdtdWx0aXBsZScpIHtcclxuICAgICAgICBjb25zdCBzID0gTWF0aC5tYXgoc3RhcnQuZ2V0VGltZSgpLCBmcm9tRGF0ZU51bShhc3NpZ25tZW50LnN0YXJ0KS5nZXRUaW1lKCkpXHJcbiAgICAgICAgY29uc3QgZSA9IGFzc2lnbm1lbnQuZW5kID09PSAnRm9yZXZlcicgPyBzIDogTWF0aC5taW4oZW5kLmdldFRpbWUoKSwgZnJvbURhdGVOdW0oYXNzaWdubWVudC5lbmQpLmdldFRpbWUoKSlcclxuICAgICAgICBjb25zdCBzcGFuID0gKChlIC0gcykgLyAxMDAwIC8gMzYwMCAvIDI0KSArIDEgLy8gTnVtYmVyIG9mIGRheXMgYXNzaWdubWVudCB0YWtlcyB1cFxyXG4gICAgICAgIGNvbnN0IHNwYW5SZWxhdGl2ZSA9IDYgLSAobmV3IERhdGUocykpLmdldERheSgpIC8vIE51bWJlciBvZiBkYXlzIHVudGlsIHRoZSBuZXh0IFNhdHVyZGF5XHJcblxyXG4gICAgICAgIGNvbnN0IG5zID0gbmV3IERhdGUocylcclxuICAgICAgICBucy5zZXREYXRlKG5zLmdldERhdGUoKSArIHNwYW5SZWxhdGl2ZSkgLy8gIFRoZSBkYXRlIG9mIHRoZSBuZXh0IFNhdHVyZGF5XHJcblxyXG4gICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZSBuby1sb29wc1xyXG4gICAgICAgIGZvciAobGV0IG4gPSAtNjsgbiA8IHNwYW4gLSBzcGFuUmVsYXRpdmU7IG4gKz0gNykge1xyXG4gICAgICAgICAgICBjb25zdCBsYXN0U3VuID0gbmV3IERhdGUobnMpXHJcbiAgICAgICAgICAgIGxhc3RTdW4uc2V0RGF0ZShsYXN0U3VuLmdldERhdGUoKSArIG4pXHJcblxyXG4gICAgICAgICAgICBjb25zdCBuZXh0U2F0ID0gbmV3IERhdGUobGFzdFN1bilcclxuICAgICAgICAgICAgbmV4dFNhdC5zZXREYXRlKG5leHRTYXQuZ2V0RGF0ZSgpICsgNilcclxuICAgICAgICAgICAgc3BsaXQucHVzaCh7XHJcbiAgICAgICAgICAgICAgICBhc3NpZ25tZW50LFxyXG4gICAgICAgICAgICAgICAgc3RhcnQ6IG5ldyBEYXRlKE1hdGgubWF4KHMsIGxhc3RTdW4uZ2V0VGltZSgpKSksXHJcbiAgICAgICAgICAgICAgICBlbmQ6IG5ldyBEYXRlKE1hdGgubWluKGUsIG5leHRTYXQuZ2V0VGltZSgpKSksXHJcbiAgICAgICAgICAgICAgICBjdXN0b206IEJvb2xlYW4ocmVmZXJlbmNlKSxcclxuICAgICAgICAgICAgICAgIHJlZmVyZW5jZVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAoc2V0dGluZ3MuYXNzaWdubWVudFNwYW4gPT09ICdzdGFydCcpIHtcclxuICAgICAgICBjb25zdCBzID0gZnJvbURhdGVOdW0oYXNzaWdubWVudC5zdGFydClcclxuICAgICAgICBpZiAocy5nZXRUaW1lKCkgPj0gc3RhcnQuZ2V0VGltZSgpKSB7XHJcbiAgICAgICAgICAgIHNwbGl0LnB1c2goe1xyXG4gICAgICAgICAgICAgICAgYXNzaWdubWVudCxcclxuICAgICAgICAgICAgICAgIHN0YXJ0OiBzLFxyXG4gICAgICAgICAgICAgICAgZW5kOiBzLFxyXG4gICAgICAgICAgICAgICAgY3VzdG9tOiBCb29sZWFuKHJlZmVyZW5jZSksXHJcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKHNldHRpbmdzLmFzc2lnbm1lbnRTcGFuID09PSAnZW5kJykge1xyXG4gICAgICAgIGNvbnN0IGUgPSBhc3NpZ25tZW50LmVuZCA9PT0gJ0ZvcmV2ZXInID8gYXNzaWdubWVudC5lbmQgOiBmcm9tRGF0ZU51bShhc3NpZ25tZW50LmVuZClcclxuICAgICAgICBjb25zdCBkZSA9IGUgPT09ICdGb3JldmVyJyA/IGZyb21EYXRlTnVtKGFzc2lnbm1lbnQuc3RhcnQpIDogZVxyXG4gICAgICAgIGlmIChkZS5nZXRUaW1lKCkgPD0gZW5kLmdldFRpbWUoKSkge1xyXG4gICAgICAgICAgICBzcGxpdC5wdXNoKHtcclxuICAgICAgICAgICAgICAgIGFzc2lnbm1lbnQsXHJcbiAgICAgICAgICAgICAgICBzdGFydDogZGUsXHJcbiAgICAgICAgICAgICAgICBlbmQ6IGUsXHJcbiAgICAgICAgICAgICAgICBjdXN0b206IEJvb2xlYW4ocmVmZXJlbmNlKSxcclxuICAgICAgICAgICAgICAgIHJlZmVyZW5jZVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gc3BsaXRcclxufVxyXG5cclxuLy8gVGhpcyBmdW5jdGlvbiB3aWxsIGNvbnZlcnQgdGhlIGFycmF5IG9mIGFzc2lnbm1lbnRzIGdlbmVyYXRlZCBieSAqcGFyc2UqIGludG8gcmVhZGFibGUgSFRNTC5cclxuZXhwb3J0IGZ1bmN0aW9uIGRpc3BsYXkoZG9TY3JvbGw6IGJvb2xlYW4gPSB0cnVlKTogdm9pZCB7XHJcbiAgICBjb25zb2xlLnRpbWUoJ0Rpc3BsYXlpbmcgZGF0YScpXHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IGRhdGEgPSBnZXREYXRhKClcclxuICAgICAgICBpZiAoIWRhdGEpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdEYXRhIHNob3VsZCBoYXZlIGJlZW4gZmV0Y2hlZCBiZWZvcmUgZGlzcGxheSgpIHdhcyBjYWxsZWQnKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5zZXRBdHRyaWJ1dGUoJ2RhdGEtcGNydmlldycsIGRhdGEubW9udGhWaWV3ID8gJ21vbnRoJyA6ICdvdGhlcicpXHJcbiAgICAgICAgY29uc3QgbWFpbiA9IF8kKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ21haW4nKSlcclxuICAgICAgICBjb25zdCB0YWtlbjogeyBbZGF0ZTogbnVtYmVyXTogbnVtYmVyW10gfSA9IHt9XHJcblxyXG4gICAgICAgIGNvbnN0IHRpbWVhZnRlciA9IGdldFRpbWVBZnRlcihuZXcgRGF0ZSgpKVxyXG5cclxuICAgICAgICBjb25zdCB7c3RhcnQsIGVuZH0gPSBnZXRTdGFydEVuZERhdGVzKGRhdGEpXHJcblxyXG4gICAgICAgIC8vIFNldCB0aGUgc3RhcnQgZGF0ZSB0byBiZSBhIFN1bmRheSBhbmQgdGhlIGVuZCBkYXRlIHRvIGJlIGEgU2F0dXJkYXlcclxuICAgICAgICBzdGFydC5zZXREYXRlKHN0YXJ0LmdldERhdGUoKSAtIHN0YXJ0LmdldERheSgpKVxyXG4gICAgICAgIGVuZC5zZXREYXRlKGVuZC5nZXREYXRlKCkgKyAoNiAtIGVuZC5nZXREYXkoKSkpXHJcblxyXG4gICAgICAgIC8vIEZpcnN0IHBvcHVsYXRlIHRoZSBjYWxlbmRhciB3aXRoIGJveGVzIGZvciBlYWNoIGRheVxyXG4gICAgICAgIGNvbnN0IGxhc3REYXRhID0gbG9jYWxTdG9yYWdlUmVhZCgnZGF0YScpIGFzIElBcHBsaWNhdGlvbkRhdGFcclxuICAgICAgICBsZXQgd2s6IEhUTUxFbGVtZW50fG51bGwgPSBudWxsXHJcbiAgICAgICAgaXRlckRheXMoc3RhcnQsIGVuZCwgKGQpID0+IHtcclxuICAgICAgICAgICAgaWYgKGQuZ2V0RGF5KCkgPT09IDApIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGlkID0gYHdrJHtkLmdldE1vbnRoKCl9LSR7ZC5nZXREYXRlKCl9YCAvLyBEb24ndCBjcmVhdGUgYSBuZXcgd2VlayBlbGVtZW50IGlmIG9uZSBhbHJlYWR5IGV4aXN0c1xyXG4gICAgICAgICAgICAgICAgd2sgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZClcclxuICAgICAgICAgICAgICAgIGlmICh3ayA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd2sgPSBjcmVhdGVXZWVrKGlkKVxyXG4gICAgICAgICAgICAgICAgICAgIG1haW4uYXBwZW5kQ2hpbGQod2spXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghd2spIHRocm93IG5ldyBFcnJvcihgRXhwZWN0ZWQgd2VlayBlbGVtZW50IG9uIGRheSAke2R9IHRvIG5vdCBiZSBudWxsYClcclxuICAgICAgICAgICAgaWYgKHdrLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2RheScpLmxlbmd0aCA8PSBkLmdldERheSgpKSB7XHJcbiAgICAgICAgICAgICAgICB3ay5hcHBlbmRDaGlsZChjcmVhdGVEYXkoZCkpXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRha2VuW2QuZ2V0VGltZSgpXSA9IFtdXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgLy8gU3BsaXQgYXNzaWdubWVudHMgdGFraW5nIG1vcmUgdGhhbiAxIHdlZWtcclxuICAgICAgICBjb25zdCBzcGxpdDogSVNwbGl0QXNzaWdubWVudFtdID0gW11cclxuICAgICAgICBkYXRhLmFzc2lnbm1lbnRzLmZvckVhY2goKGFzc2lnbm1lbnQsIG51bSkgPT4ge1xyXG4gICAgICAgICAgICBzcGxpdC5wdXNoKC4uLmdldEFzc2lnbm1lbnRTcGxpdHMoYXNzaWdubWVudCwgc3RhcnQsIGVuZCkpXHJcblxyXG4gICAgICAgICAgICAvLyBBY3Rpdml0eSBzdHVmZlxyXG4gICAgICAgICAgICBpZiAobGFzdERhdGEgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgb2xkQXNzaWdubWVudCA9IGxhc3REYXRhLmFzc2lnbm1lbnRzLmZpbmQoKGEpID0+IGEuaWQgPT09IGFzc2lnbm1lbnQuaWQpXHJcbiAgICAgICAgICAgICAgICBpZiAob2xkQXNzaWdubWVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvbGRBc3NpZ25tZW50LmJvZHkgIT09IGFzc2lnbm1lbnQuYm9keSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRBY3Rpdml0eSgnZWRpdCcsIG9sZEFzc2lnbm1lbnQsIG5ldyBEYXRlKCksIHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9sZEFzc2lnbm1lbnQuY2xhc3MgIT0gbnVsbCA/IGxhc3REYXRhLmNsYXNzZXNbb2xkQXNzaWdubWVudC5jbGFzc10gOiB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbW92ZUZyb21Nb2RpZmllZChhc3NpZ25tZW50LmlkKSAvLyBJZiB0aGUgYXNzaWdubWVudCBpcyBtb2RpZmllZCwgcmVzZXQgaXRcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgbGFzdERhdGEuYXNzaWdubWVudHMuc3BsaWNlKGxhc3REYXRhLmFzc2lnbm1lbnRzLmluZGV4T2Yob2xkQXNzaWdubWVudCksIDEpXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGFkZEFjdGl2aXR5KCdhZGQnLCBhc3NpZ25tZW50LCBuZXcgRGF0ZSgpLCB0cnVlKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgaWYgKGxhc3REYXRhICE9IG51bGwpIHtcclxuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgYW55IG9mIHRoZSBsYXN0IGFzc2lnbm1lbnRzIHdlcmVuJ3QgZGVsZXRlZCAoc28gdGhleSBoYXZlIGJlZW4gZGVsZXRlZCBpbiBQQ1IpXHJcbiAgICAgICAgICAgIGxhc3REYXRhLmFzc2lnbm1lbnRzLmZvckVhY2goKGFzc2lnbm1lbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIGFkZEFjdGl2aXR5KCdkZWxldGUnLCBhc3NpZ25tZW50LCBuZXcgRGF0ZSgpLCB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXNzaWdubWVudC5jbGFzcyAhPSBudWxsID8gbGFzdERhdGEuY2xhc3Nlc1thc3NpZ25tZW50LmNsYXNzXSA6IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgIHJlbW92ZUZyb21Eb25lKGFzc2lnbm1lbnQuaWQpXHJcbiAgICAgICAgICAgICAgICByZW1vdmVGcm9tTW9kaWZpZWQoYXNzaWdubWVudC5pZClcclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIC8vIFRoZW4gc2F2ZSBhIG1heGltdW0gb2YgMTI4IGFjdGl2aXR5IGl0ZW1zXHJcbiAgICAgICAgICAgIHNhdmVBY3Rpdml0eSgpXHJcblxyXG4gICAgICAgICAgICAvLyBBbmQgY29tcGxldGVkIGFzc2lnbm1lbnRzICsgbW9kaWZpY2F0aW9uc1xyXG4gICAgICAgICAgICBzYXZlRG9uZSgpXHJcbiAgICAgICAgICAgIHNhdmVNb2RpZmllZCgpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBBZGQgY3VzdG9tIGFzc2lnbm1lbnRzIHRvIHRoZSBzcGxpdCBhcnJheVxyXG4gICAgICAgIGdldEV4dHJhKCkuZm9yRWFjaCgoY3VzdG9tKSA9PiB7XHJcbiAgICAgICAgICAgIHNwbGl0LnB1c2goLi4uZ2V0QXNzaWdubWVudFNwbGl0cyhleHRyYVRvVGFzayhjdXN0b20sIGRhdGEpLCBzdGFydCwgZW5kLCBjdXN0b20pKVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIC8vIENhbGN1bGF0ZSB0aGUgdG9kYXkncyB3ZWVrIGlkXHJcbiAgICAgICAgY29uc3QgdGRzdCA9IG5ldyBEYXRlKClcclxuICAgICAgICB0ZHN0LnNldERhdGUodGRzdC5nZXREYXRlKCkgLSB0ZHN0LmdldERheSgpKVxyXG4gICAgICAgIGNvbnN0IHRvZGF5V2tJZCA9IGB3ayR7dGRzdC5nZXRNb250aCgpfS0ke3Rkc3QuZ2V0RGF0ZSgpfWBcclxuXHJcbiAgICAgICAgLy8gVGhlbiBhZGQgYXNzaWdubWVudHNcclxuICAgICAgICBjb25zdCB3ZWVrSGVpZ2h0czogeyBbd2Vla0lkOiBzdHJpbmddOiBudW1iZXIgfSA9IHt9XHJcbiAgICAgICAgY29uc3QgcHJldmlvdXNBc3NpZ25tZW50czogeyBbaWQ6IHN0cmluZ106IEhUTUxFbGVtZW50IH0gPSB7fVxyXG4gICAgICAgIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYXNzaWdubWVudCcpLCAoYXNzaWdubWVudDogSFRNTEVsZW1lbnQpID0+IHtcclxuICAgICAgICAgICAgcHJldmlvdXNBc3NpZ25tZW50c1thc3NpZ25tZW50LmlkXSA9IGFzc2lnbm1lbnRcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICBzcGxpdC5mb3JFYWNoKChzKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHdlZWtJZCA9IGNvbXB1dGVXZWVrSWQocylcclxuICAgICAgICAgICAgd2sgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh3ZWVrSWQpXHJcbiAgICAgICAgICAgIGlmICh3ayA9PSBudWxsKSByZXR1cm5cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGUgPSBjcmVhdGVBc3NpZ25tZW50KHMsIGRhdGEpXHJcblxyXG4gICAgICAgICAgICAvLyBDYWxjdWxhdGUgaG93IG1hbnkgYXNzaWdubWVudHMgYXJlIHBsYWNlZCBiZWZvcmUgdGhlIGN1cnJlbnQgb25lXHJcbiAgICAgICAgICAgIGlmICghcy5jdXN0b20gfHwgIXNldHRpbmdzLnNlcFRhc2tzKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcG9zID0gMFxyXG4gICAgICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lIG5vLWxvb3BzXHJcbiAgICAgICAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBmb3VuZCA9IHRydWVcclxuICAgICAgICAgICAgICAgICAgICBpdGVyRGF5cyhzLnN0YXJ0LCBzLmVuZCA9PT0gJ0ZvcmV2ZXInID8gcy5zdGFydCA6IHMuZW5kLCAoZCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGFrZW5bZC5nZXRUaW1lKCldLmluZGV4T2YocG9zKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kID0gZmFsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZvdW5kKSB7IGJyZWFrIH1cclxuICAgICAgICAgICAgICAgICAgICBwb3MrK1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIEFwcGVuZCB0aGUgcG9zaXRpb24gdGhlIGFzc2lnbm1lbnQgaXMgYXQgdG8gdGhlIHRha2VuIGFycmF5XHJcbiAgICAgICAgICAgICAgICBpdGVyRGF5cyhzLnN0YXJ0LCBzLmVuZCA9PT0gJ0ZvcmV2ZXInID8gcy5zdGFydCA6IHMuZW5kLCAoZCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRha2VuW2QuZ2V0VGltZSgpXS5wdXNoKHBvcylcclxuICAgICAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICAgICAgLy8gQ2FsY3VsYXRlIGhvdyBmYXIgZG93biB0aGUgYXNzaWdubWVudCBtdXN0IGJlIHBsYWNlZCBhcyB0byBub3QgYmxvY2sgdGhlIG9uZXMgYWJvdmUgaXRcclxuICAgICAgICAgICAgICAgIGUuc3R5bGUubWFyZ2luVG9wID0gKHBvcyAqIDMwKSArICdweCdcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoKHdlZWtIZWlnaHRzW3dlZWtJZF0gPT0gbnVsbCkgfHwgKHBvcyA+IHdlZWtIZWlnaHRzW3dlZWtJZF0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd2Vla0hlaWdodHNbd2Vla0lkXSA9IHBvc1xyXG4gICAgICAgICAgICAgICAgICAgIHdrLnN0eWxlLmhlaWdodCA9IDQ3ICsgKChwb3MgKyAxKSAqIDMwKSArICdweCdcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gSWYgdGhlIGFzc2lnbm1lbnQgaXMgYSB0ZXN0IGFuZCBpcyB1cGNvbWluZywgYWRkIGl0IHRvIHRoZSB1cGNvbWluZyB0ZXN0cyBwYW5lbC5cclxuICAgICAgICAgICAgaWYgKHMuYXNzaWdubWVudC5lbmQgPj0gdG9kYXkoKSAmJiAocy5hc3NpZ25tZW50LmJhc2VUeXBlID09PSAndGVzdCcgfHxcclxuICAgICAgICAgICAgICAgIChzZXR0aW5ncy5wcm9qZWN0c0luVGVzdFBhbmUgJiYgcy5hc3NpZ25tZW50LmJhc2VUeXBlID09PSAnbG9uZ3Rlcm0nKSkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRlID0gZWxlbWVudCgnZGl2JywgWyd1cGNvbWluZ1Rlc3QnLCAnYXNzaWdubWVudEl0ZW0nLCBzLmFzc2lnbm1lbnQuYmFzZVR5cGVdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGA8aSBjbGFzcz0nbWF0ZXJpYWwtaWNvbnMnPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtzLmFzc2lnbm1lbnQuYmFzZVR5cGUgPT09ICdsb25ndGVybScgPyAnYXNzaWdubWVudCcgOiAnYXNzZXNzbWVudCd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvaT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9J3RpdGxlJz4ke3MuYXNzaWdubWVudC50aXRsZX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzbWFsbD4ke3NlcGFyYXRlZENsYXNzKHMuYXNzaWdubWVudCwgZGF0YSlbMl19PC9zbWFsbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz0ncmFuZ2UnPiR7ZGF0ZVN0cmluZyhzLmFzc2lnbm1lbnQuZW5kLCB0cnVlKX08L2Rpdj5gLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGB0ZXN0JHtzLmFzc2lnbm1lbnQuaWR9YClcclxuICAgICAgICAgICAgICAgIGlmIChzLmFzc2lnbm1lbnQuY2xhc3MpIHRlLnNldEF0dHJpYnV0ZSgnZGF0YS1jbGFzcycsIGRhdGEuY2xhc3Nlc1tzLmFzc2lnbm1lbnQuY2xhc3NdKVxyXG4gICAgICAgICAgICAgICAgdGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZG9TY3JvbGxpbmcgPSBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHNtb290aFNjcm9sbCgoZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgKyBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCkgLSAxMTYpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGUuY2xpY2soKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAoZG9jdW1lbnQuYm9keS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmlldycpID09PSAnMCcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZG9TY3JvbGxpbmcoKVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8kKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNuYXZUYWJzPmxpOmZpcnN0LWNoaWxkJykgYXMgSFRNTEVsZW1lbnQpLmNsaWNrKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChkb1Njcm9sbGluZywgNTAwKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGFzc2lnbm1lbnRJbkRvbmUocy5hc3NpZ25tZW50LmlkKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlLmNsYXNzTGlzdC5hZGQoJ2RvbmUnKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29uc3QgdGVzdEVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgdGVzdCR7cy5hc3NpZ25tZW50LmlkfWApXHJcbiAgICAgICAgICAgICAgICBpZiAodGVzdEVsZW0pIHtcclxuICAgICAgICAgICAgICAgIHRlc3RFbGVtLmlubmVySFRNTCA9IHRlLmlubmVySFRNTFxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBlbGVtQnlJZCgnaW5mb1Rlc3RzJykuYXBwZW5kQ2hpbGQodGUpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGFscmVhZHkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChzLmFzc2lnbm1lbnQuaWQgKyB3ZWVrSWQpXHJcbiAgICAgICAgICAgIGlmIChhbHJlYWR5ICE9IG51bGwpIHsgLy8gQXNzaWdubWVudCBhbHJlYWR5IGV4aXN0c1xyXG4gICAgICAgICAgICAgICAgYWxyZWFkeS5zdHlsZS5tYXJnaW5Ub3AgPSBlLnN0eWxlLm1hcmdpblRvcFxyXG4gICAgICAgICAgICAgICAgYWxyZWFkeS5zZXRBdHRyaWJ1dGUoJ2RhdGEtY2xhc3MnLFxyXG4gICAgICAgICAgICAgICAgICAgIHMuY3VzdG9tICYmIHNldHRpbmdzLnNlcFRhc2tDbGFzcyA/ICdUYXNrJyA6IGNsYXNzQnlJZChzLmFzc2lnbm1lbnQuY2xhc3MpKVxyXG4gICAgICAgICAgICAgICAgaWYgKCFhc3NpZ25tZW50SW5Nb2RpZmllZChzLmFzc2lnbm1lbnQuaWQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxyZWFkeS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdib2R5JylbMF0uaW5uZXJIVE1MID0gZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdib2R5JylbMF0uaW5uZXJIVE1MXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBfJChhbHJlYWR5LnF1ZXJ5U2VsZWN0b3IoJy5lZGl0cycpKS5jbGFzc05hbWUgPSBfJChlLnF1ZXJ5U2VsZWN0b3IoJy5lZGl0cycpKS5jbGFzc05hbWVcclxuICAgICAgICAgICAgICAgIGlmIChhbHJlYWR5LmNsYXNzTGlzdC50b2dnbGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBhbHJlYWR5LmNsYXNzTGlzdC50b2dnbGUoJ2xpc3REaXNwJywgZS5jbGFzc0xpc3QuY29udGFpbnMoJ2xpc3REaXNwJykpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBnZXRFUyhhbHJlYWR5KS5mb3JFYWNoKChjbCkgPT4gYWxyZWFkeS5jbGFzc0xpc3QucmVtb3ZlKGNsKSlcclxuICAgICAgICAgICAgICAgIGdldEVTKGUpLmZvckVhY2goKGNsKSA9PiBhbHJlYWR5LmNsYXNzTGlzdC5hZGQoY2wpKVxyXG4gICAgICAgICAgICAgICAgV0VFS0VORF9DTEFTU05BTUVTLmZvckVhY2goKGNsKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxyZWFkeS5jbGFzc0xpc3QucmVtb3ZlKGNsKVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChlLmNsYXNzTGlzdC5jb250YWlucyhjbCkpIGFscmVhZHkuY2xhc3NMaXN0LmFkZChjbClcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocy5jdXN0b20gJiYgc2V0dGluZ3Muc2VwVGFza3MpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzdCA9IE1hdGguZmxvb3Iocy5zdGFydC5nZXRUaW1lKCkgLyAxMDAwIC8gMzYwMCAvIDI0KVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICgocy5hc3NpZ25tZW50LnN0YXJ0ID09PSBzdCkgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgKHMuYXNzaWdubWVudC5lbmQgPT09ICdGb3JldmVyJyB8fCBzLmFzc2lnbm1lbnQuZW5kID49IHRvZGF5KCkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGUuY2xhc3NMaXN0LnJlbW92ZSgnYXNzaWdubWVudCcpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGUuY2xhc3NMaXN0LmFkZCgndGFza1BhbmVJdGVtJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgZS5zdHlsZS5vcmRlciA9IFN0cmluZyhzLmFzc2lnbm1lbnQuZW5kID09PSAnRm9yZXZlcicgPyBOdW1iZXIuTUFYX1ZBTFVFIDogcy5hc3NpZ25tZW50LmVuZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbGluayA9IGUucXVlcnlTZWxlY3RvcignLmxpbmtlZCcpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsaW5rKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLmluc2VydEJlZm9yZShlbGVtZW50KCdzbWFsbCcsIFtdLCBsaW5rLmlubmVySFRNTCksIGxpbmspXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5rLnJlbW92ZSgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbUJ5SWQoJ2luZm9UYXNrc0lubmVyJykuYXBwZW5kQ2hpbGQoZSlcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgeyB3ay5hcHBlbmRDaGlsZChlKSB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZGVsZXRlIHByZXZpb3VzQXNzaWdubWVudHNbcy5hc3NpZ25tZW50LmlkICsgd2Vla0lkXVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIC8vIERlbGV0ZSBhbnkgYXNzaWdubWVudHMgdGhhdCBoYXZlIGJlZW4gZGVsZXRlZCBzaW5jZSB1cGRhdGluZ1xyXG4gICAgICAgIE9iamVjdC5lbnRyaWVzKHByZXZpb3VzQXNzaWdubWVudHMpLmZvckVhY2goKFtuYW1lLCBhc3NpZ25tZW50XSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoYXNzaWdubWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2Z1bGwnKSkge1xyXG4gICAgICAgICAgICAgICAgZWxlbUJ5SWQoJ2JhY2tncm91bmQnKS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGFzc2lnbm1lbnQucmVtb3ZlKClcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICAvLyBTY3JvbGwgdG8gdGhlIGNvcnJlY3QgcG9zaXRpb24gaW4gY2FsZW5kYXIgdmlld1xyXG4gICAgICAgIGlmICh3ZWVrSGVpZ2h0c1t0b2RheVdrSWRdICE9IG51bGwpIHtcclxuICAgICAgICAgICAgbGV0IGggPSAwXHJcbiAgICAgICAgICAgIGNvbnN0IHN3ID0gKHdraWQ6IHN0cmluZykgPT4gd2tpZC5zdWJzdHJpbmcoMikuc3BsaXQoJy0nKS5tYXAoKHgpID0+IE51bWJlcih4KSlcclxuICAgICAgICAgICAgY29uc3QgdG9kYXlXayA9IHN3KHRvZGF5V2tJZClcclxuICAgICAgICAgICAgT2JqZWN0LmVudHJpZXMod2Vla0hlaWdodHMpLmZvckVhY2goKFt3a0lkLCB2YWxdKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB3a1NwbGl0ID0gc3cod2tJZClcclxuICAgICAgICAgICAgICAgIGlmICgod2tTcGxpdFswXSA8IHRvZGF5V2tbMF0pIHx8ICgod2tTcGxpdFswXSA9PT0gdG9kYXlXa1swXSkgJiYgKHdrU3BsaXRbMV0gPCB0b2RheVdrWzFdKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBoICs9IHZhbFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICBzY3JvbGwgPSAoaCAqIDMwKSArIDExMiArIDE0XHJcbiAgICAgICAgICAgIC8vIEFsc28gc2hvdyB0aGUgZGF5IGhlYWRlcnMgaWYgdG9kYXkncyBkYXRlIGlzIGRpc3BsYXllZCBpbiB0aGUgZmlyc3Qgcm93IG9mIHRoZSBjYWxlbmRhclxyXG4gICAgICAgICAgICBpZiAoc2Nyb2xsIDwgNTApIHNjcm9sbCA9IDBcclxuICAgICAgICAgICAgaWYgKGRvU2Nyb2xsICYmIChkb2N1bWVudC5ib2R5LmdldEF0dHJpYnV0ZSgnZGF0YS12aWV3JykgPT09ICcwJykgJiZcclxuICAgICAgICAgICAgICAgICFkb2N1bWVudC5ib2R5LnF1ZXJ5U2VsZWN0b3IoJy5mdWxsJykpIHtcclxuICAgICAgICAgICAgICAgIC8vIGluIGNhbGVuZGFyIHZpZXdcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5zY3JvbGxUbygwLCBzY3JvbGwpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnRvZ2dsZSgnbm9MaXN0JyxcclxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmFzc2lnbm1lbnQubGlzdERpc3A6bm90KC5kb25lKScpLmxlbmd0aCA9PT0gMClcclxuICAgICAgICBpZiAoZG9jdW1lbnQuYm9keS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmlldycpID09PSAnMScpIHsgLy8gaW4gbGlzdCB2aWV3XHJcbiAgICAgICAgICAgIHJlc2l6ZSgpXHJcbiAgICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgZGlzcGxheUVycm9yKGVycilcclxuICAgIH1cclxuICAgIGNvbnNvbGUudGltZUVuZCgnRGlzcGxheWluZyBkYXRhJylcclxufVxyXG5cclxuLy8gVGhlIGZ1bmN0aW9uIGJlbG93IGNvbnZlcnRzIGFuIHVwZGF0ZSB0aW1lIHRvIGEgaHVtYW4tcmVhZGFibGUgZGF0ZS5cclxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdFVwZGF0ZShkYXRlOiBudW1iZXIpOiBzdHJpbmcge1xyXG4gIGNvbnN0IG5vdyA9IG5ldyBEYXRlKClcclxuICBjb25zdCB1cGRhdGUgPSBuZXcgRGF0ZSgrZGF0ZSlcclxuICBpZiAobm93LmdldERhdGUoKSA9PT0gdXBkYXRlLmdldERhdGUoKSkge1xyXG4gICAgbGV0IGFtcG0gPSAnQU0nXHJcbiAgICBsZXQgaHIgPSB1cGRhdGUuZ2V0SG91cnMoKVxyXG4gICAgaWYgKGhyID4gMTIpIHtcclxuICAgICAgYW1wbSA9ICdQTSdcclxuICAgICAgaHIgLT0gMTJcclxuICAgIH1cclxuICAgIGNvbnN0IG1pbiA9IHVwZGF0ZS5nZXRNaW51dGVzKClcclxuICAgIHJldHVybiBgVG9kYXkgYXQgJHtocn06JHttaW4gPCAxMCA/IGAwJHttaW59YCA6IG1pbn0gJHthbXBtfWBcclxuICB9IGVsc2Uge1xyXG4gICAgY29uc3QgZGF5c1Bhc3QgPSBNYXRoLmNlaWwoKG5vdy5nZXRUaW1lKCkgLSB1cGRhdGUuZ2V0VGltZSgpKSAvIDEwMDAgLyAzNjAwIC8gMjQpXHJcbiAgICBpZiAoZGF5c1Bhc3QgPT09IDEpIHsgcmV0dXJuICdZZXN0ZXJkYXknIH0gZWxzZSB7IHJldHVybiBkYXlzUGFzdCArICcgZGF5cyBhZ28nIH1cclxuICB9XHJcbn1cclxuIiwibGV0IGxpc3REYXRlT2Zmc2V0ID0gMFxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldExpc3REYXRlT2Zmc2V0KCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gbGlzdERhdGVPZmZzZXRcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHplcm9MaXN0RGF0ZU9mZnNldCgpOiB2b2lkIHtcclxuICAgIGxpc3REYXRlT2Zmc2V0ID0gMFxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaW5jcmVtZW50TGlzdERhdGVPZmZzZXQoKTogdm9pZCB7XHJcbiAgICBsaXN0RGF0ZU9mZnNldCArPSAxXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkZWNyZW1lbnRMaXN0RGF0ZU9mZnNldCgpOiB2b2lkIHtcclxuICAgIGxpc3REYXRlT2Zmc2V0IC09IDFcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNldExpc3REYXRlT2Zmc2V0KG9mZnNldDogbnVtYmVyKTogdm9pZCB7XHJcbiAgICBsaXN0RGF0ZU9mZnNldCA9IG9mZnNldFxyXG59XHJcbiIsIi8qKlxyXG4gKiBUaGlzIG1vZHVsZSBjb250YWlucyBjb2RlIHRvIGJvdGggZmV0Y2ggYW5kIHBhcnNlIGFzc2lnbm1lbnRzIGZyb20gUENSLlxyXG4gKi9cclxuaW1wb3J0IHsgdXBkYXRlQXZhdGFyIH0gZnJvbSAnLi9jb21wb25lbnRzL2F2YXRhcidcclxuaW1wb3J0IHsgZGlzcGxheUVycm9yIH0gZnJvbSAnLi9jb21wb25lbnRzL2Vycm9yRGlzcGxheSdcclxuaW1wb3J0IHsgc25hY2tiYXIgfSBmcm9tICcuL2NvbXBvbmVudHMvc25hY2tiYXInXHJcbmltcG9ydCB7IGRlbGV0ZUNvb2tpZSwgZ2V0Q29va2llLCBzZXRDb29raWUgfSBmcm9tICcuL2Nvb2tpZXMnXHJcbmltcG9ydCB7IHRvRGF0ZU51bSB9IGZyb20gJy4vZGF0ZXMnXHJcbmltcG9ydCB7IGRpc3BsYXksIGZvcm1hdFVwZGF0ZSB9IGZyb20gJy4vZGlzcGxheSdcclxuaW1wb3J0IHsgXyQsIGVsZW1CeUlkLCBsb2NhbFN0b3JhZ2VXcml0ZSwgc2VuZCB9IGZyb20gJy4vdXRpbCdcclxuXHJcbmNvbnN0IFBDUl9VUkwgPSAnaHR0cHM6Ly93ZWJhcHBzY2EucGNyc29mdC5jb20nXHJcbmNvbnN0IEFTU0lHTk1FTlRTX1VSTCA9IGAke1BDUl9VUkx9L0NsdWUvU0MtQXNzaWdubWVudHMtRW5kLURhdGUtUmFuZ2UvNzUzNmBcclxuY29uc3QgTE9HSU5fVVJMID0gYCR7UENSX1VSTH0vQ2x1ZS9TQy1TdHVkZW50LVBvcnRhbC1Mb2dpbi1MREFQLzg0NjQ/cmV0dXJuVXJsPSR7ZW5jb2RlVVJJQ29tcG9uZW50KEFTU0lHTk1FTlRTX1VSTCl9YFxyXG5jb25zdCBBVFRBQ0hNRU5UU19VUkwgPSBgJHtQQ1JfVVJMfS9DbHVlL0NvbW1vbi9BdHRhY2htZW50UmVuZGVyLmFzcHhgXHJcbmNvbnN0IEZPUk1fSEVBREVSX09OTFkgPSB7ICdDb250ZW50LXR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyB9XHJcbmNvbnN0IE9ORV9NSU5VVEVfTVMgPSA2MDAwMFxyXG5cclxuY29uc3QgcHJvZ3Jlc3NFbGVtZW50ID0gZWxlbUJ5SWQoJ3Byb2dyZXNzJylcclxuY29uc3QgbG9naW5EaWFsb2cgPSBlbGVtQnlJZCgnbG9naW4nKVxyXG5jb25zdCBsb2dpbkJhY2tncm91bmQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9naW5CYWNrZ3JvdW5kJylcclxuY29uc3QgbGFzdFVwZGF0ZUVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xhc3RVcGRhdGUnKVxyXG5jb25zdCB1c2VybmFtZUVsID0gZWxlbUJ5SWQoJ3VzZXJuYW1lJykgYXMgSFRNTElucHV0RWxlbWVudFxyXG5jb25zdCBwYXNzd29yZEVsID0gZWxlbUJ5SWQoJ3Bhc3N3b3JkJykgYXMgSFRNTElucHV0RWxlbWVudFxyXG5jb25zdCByZW1lbWJlckNoZWNrID0gZWxlbUJ5SWQoJ3JlbWVtYmVyJykgYXMgSFRNTElucHV0RWxlbWVudFxyXG5jb25zdCBpbmNvcnJlY3RMb2dpbkVsID0gZWxlbUJ5SWQoJ2xvZ2luSW5jb3JyZWN0JylcclxuXHJcbi8vIFRPRE8ga2VlcGluZyB0aGVzZSBhcyBhIGdsb2JhbCB2YXJzIGlzIGJhZFxyXG5jb25zdCBsb2dpbkhlYWRlcnM6IHtbaGVhZGVyOiBzdHJpbmddOiBzdHJpbmd9ID0ge31cclxuY29uc3Qgdmlld0RhdGE6IHtbaGFkZXI6IHN0cmluZ106IHN0cmluZ30gPSB7fVxyXG5sZXQgbGFzdFVwZGF0ZSA9IDAgLy8gVGhlIGxhc3QgdGltZSBldmVyeXRoaW5nIHdhcyB1cGRhdGVkXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElBcHBsaWNhdGlvbkRhdGEge1xyXG4gICAgY2xhc3Nlczogc3RyaW5nW11cclxuICAgIGFzc2lnbm1lbnRzOiBJQXNzaWdubWVudFtdXHJcbiAgICBtb250aFZpZXc6IGJvb2xlYW5cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJQXNzaWdubWVudCB7XHJcbiAgICBzdGFydDogbnVtYmVyXHJcbiAgICBlbmQ6IG51bWJlcnwnRm9yZXZlcidcclxuICAgIGF0dGFjaG1lbnRzOiBBdHRhY2htZW50QXJyYXlbXVxyXG4gICAgYm9keTogc3RyaW5nXHJcbiAgICB0eXBlOiBzdHJpbmdcclxuICAgIGJhc2VUeXBlOiBzdHJpbmdcclxuICAgIGNsYXNzOiBudW1iZXJ8bnVsbCxcclxuICAgIHRpdGxlOiBzdHJpbmdcclxuICAgIGlkOiBzdHJpbmdcclxufVxyXG5cclxuZXhwb3J0IHR5cGUgQXR0YWNobWVudEFycmF5ID0gW3N0cmluZywgc3RyaW5nXVxyXG5cclxuLy8gVGhpcyBpcyB0aGUgZnVuY3Rpb24gdGhhdCByZXRyaWV2ZXMgeW91ciBhc3NpZ25tZW50cyBmcm9tIFBDUi5cclxuLy9cclxuLy8gRmlyc3QsIGEgcmVxdWVzdCBpcyBzZW50IHRvIFBDUiB0byBsb2FkIHRoZSBwYWdlIHlvdSB3b3VsZCBub3JtYWxseSBzZWUgd2hlbiBhY2Nlc3NpbmcgUENSLlxyXG4vL1xyXG4vLyBCZWNhdXNlIHRoaXMgaXMgcnVuIGFzIGEgY2hyb21lIGV4dGVuc2lvbiwgdGhpcyBwYWdlIGNhbiBiZSBhY2Nlc3NlZC4gT3RoZXJ3aXNlLCB0aGUgYnJvd3NlclxyXG4vLyB3b3VsZCB0aHJvdyBhbiBlcnJvciBmb3Igc2VjdXJpdHkgcmVhc29ucyAoeW91IGRvbid0IHdhbnQgYSByYW5kb20gd2Vic2l0ZSBiZWluZyBhYmxlIHRvIGFjY2Vzc1xyXG4vLyBjb25maWRlbnRpYWwgZGF0YSBmcm9tIGEgd2Vic2l0ZSB5b3UgaGF2ZSBsb2dnZWQgaW50bykuXHJcblxyXG4vKipcclxuICogRmV0Y2hlcyBkYXRhIGZyb20gUENSIGFuZCBpZiB0aGUgdXNlciBpcyBsb2dnZWQgaW4gcGFyc2VzIGFuZCBkaXNwbGF5cyBpdFxyXG4gKiBAcGFyYW0gb3ZlcnJpZGUgV2hldGhlciB0byBmb3JjZSBhbiB1cGRhdGUgZXZlbiB0aGVyZSB3YXMgb25lIHJlY2VudGx5XHJcbiAqIEBwYXJhbSBkYXRhICBPcHRpb25hbCBkYXRhIHRvIGJlIHBvc3RlZCB0byBQQ1JcclxuICovXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmZXRjaChvdmVycmlkZTogYm9vbGVhbiA9IGZhbHNlLCBkYXRhPzogc3RyaW5nLCBvbnN1Y2Nlc3M6ICgpID0+IHZvaWQgPSBkaXNwbGF5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25sb2dpbj86ICgpID0+IHZvaWQpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIGlmICghb3ZlcnJpZGUgJiYgRGF0ZS5ub3coKSAtIGxhc3RVcGRhdGUgPCBPTkVfTUlOVVRFX01TKSByZXR1cm5cclxuICAgIGxhc3RVcGRhdGUgPSBEYXRlLm5vdygpXHJcblxyXG4gICAgY29uc3QgaGVhZGVycyA9IGRhdGEgPyBGT1JNX0hFQURFUl9PTkxZIDogdW5kZWZpbmVkXHJcbiAgICBjb25zb2xlLnRpbWUoJ0ZldGNoaW5nIGFzc2lnbm1lbnRzJylcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcmVzcCA9IGF3YWl0IHNlbmQoQVNTSUdOTUVOVFNfVVJMLCAnZG9jdW1lbnQnLCBoZWFkZXJzLCBkYXRhLCBwcm9ncmVzc0VsZW1lbnQpXHJcbiAgICAgICAgY29uc29sZS50aW1lRW5kKCdGZXRjaGluZyBhc3NpZ25tZW50cycpXHJcbiAgICAgICAgaWYgKHJlc3AucmVzcG9uc2VVUkwuaW5kZXhPZignTG9naW4nKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgLy8gV2UgaGF2ZSB0byBsb2cgaW4gbm93XHJcbiAgICAgICAgICAgIChyZXNwLnJlc3BvbnNlIGFzIEhUTUxEb2N1bWVudCkuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2lucHV0JykuZm9yRWFjaCgoZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbG9naW5IZWFkZXJzW2UubmFtZV0gPSBlLnZhbHVlIHx8ICcnXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdOZWVkIHRvIGxvZyBpbicpXHJcbiAgICAgICAgICAgIGNvbnN0IHVwID0gZ2V0Q29va2llKCd1c2VyUGFzcycpIC8vIEF0dGVtcHRzIHRvIGdldCB0aGUgY29va2llICp1c2VyUGFzcyosIHdoaWNoIGlzIHNldCBpZiB0aGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gXCJSZW1lbWJlciBtZVwiIGNoZWNrYm94IGlzIGNoZWNrZWQgd2hlbiBsb2dnaW5nIGluIHRocm91Z2ggQ2hlY2tQQ1JcclxuICAgICAgICAgICAgaWYgKHVwID09PSAnJykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGxvZ2luQmFja2dyb3VuZCkgbG9naW5CYWNrZ3JvdW5kLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXHJcbiAgICAgICAgICAgICAgICBsb2dpbkRpYWxvZy5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG4gICAgICAgICAgICAgICAgaWYgKG9ubG9naW4pIG9ubG9naW4oKVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gQmVjYXVzZSB3ZSB3ZXJlIHJlbWVtYmVyZWQsIHdlIGNhbiBsb2cgaW4gaW1tZWRpYXRlbHkgd2l0aG91dCB3YWl0aW5nIGZvciB0aGVcclxuICAgICAgICAgICAgICAgIC8vIHVzZXIgdG8gbG9nIGluIHRocm91Z2ggdGhlIGxvZ2luIGZvcm1cclxuICAgICAgICAgICAgICAgIGRvbG9naW4od2luZG93LmF0b2IodXApLnNwbGl0KCc6JykgYXMgW3N0cmluZywgc3RyaW5nXSwgZmFsc2UsIG9uc3VjY2VzcylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIExvZ2dlZCBpbiBub3dcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ0ZldGNoaW5nIGFzc2lnbm1lbnRzIHN1Y2Nlc3NmdWwnKVxyXG4gICAgICAgICAgICBjb25zdCB0ID0gRGF0ZS5ub3coKVxyXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2UubGFzdFVwZGF0ZSA9IHRcclxuICAgICAgICAgICAgaWYgKGxhc3RVcGRhdGVFbCkgbGFzdFVwZGF0ZUVsLmlubmVySFRNTCA9IGZvcm1hdFVwZGF0ZSh0KVxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgcGFyc2UocmVzcC5yZXNwb25zZSlcclxuICAgICAgICAgICAgICAgIG9uc3VjY2VzcygpXHJcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2VXcml0ZSgnZGF0YScsIGdldERhdGEoKSkgLy8gU3RvcmUgZm9yIG9mZmxpbmUgdXNlXHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcilcclxuICAgICAgICAgICAgICAgIGRpc3BsYXlFcnJvcihlcnJvcilcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ0NvdWxkIG5vdCBmZXRjaCBhc3NpZ25tZW50czsgWW91IGFyZSBwcm9iYWJseSBvZmZsaW5lLiBIZXJlXFwncyB0aGUgZXJyb3I6JywgZXJyb3IpXHJcbiAgICAgICAgc25hY2tiYXIoJ0NvdWxkIG5vdCBmZXRjaCB5b3VyIGFzc2lnbm1lbnRzJywgJ1JldHJ5JywgKCkgPT4gZmV0Y2godHJ1ZSkpXHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBMb2dzIHRoZSB1c2VyIGludG8gUENSXHJcbiAqIEBwYXJhbSB2YWwgICBBbiBvcHRpb25hbCBsZW5ndGgtMiBhcnJheSBvZiB0aGUgZm9ybSBbdXNlcm5hbWUsIHBhc3N3b3JkXSB0byB1c2UgdGhlIHVzZXIgaW4gd2l0aC5cclxuICogICAgICAgICAgICAgIElmIHRoaXMgYXJyYXkgaXMgbm90IGdpdmVuIHRoZSBsb2dpbiBkaWFsb2cgaW5wdXRzIHdpbGwgYmUgdXNlZC5cclxuICogQHBhcmFtIHN1Ym1pdEV2dCBXaGV0aGVyIHRvIG92ZXJyaWRlIHRoZSB1c2VybmFtZSBhbmQgcGFzc3dvcmQgc3VwcGxlaWQgaW4gdmFsIHdpdGggdGhlIHZhbHVlcyBvZiB0aGUgaW5wdXQgZWxlbWVudHNcclxuICovXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkb2xvZ2luKHZhbD86IFtzdHJpbmcsIHN0cmluZ118bnVsbCwgc3VibWl0RXZ0OiBib29sZWFuID0gZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uc3VjY2VzczogKCkgPT4gdm9pZCA9IGRpc3BsYXkpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIGxvZ2luRGlhbG9nLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBpZiAobG9naW5CYWNrZ3JvdW5kKSBsb2dpbkJhY2tncm91bmQuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xyXG4gICAgfSwgMzUwKVxyXG5cclxuICAgIGNvbnN0IHBvc3RBcnJheTogc3RyaW5nW10gPSBbXSAvLyBBcnJheSBvZiBkYXRhIHRvIHBvc3RcclxuICAgIGxvY2FsU3RvcmFnZVdyaXRlKCd1c2VybmFtZScsIHZhbCAmJiAhc3VibWl0RXZ0ID8gdmFsWzBdIDogdXNlcm5hbWVFbC52YWx1ZSlcclxuICAgIHVwZGF0ZUF2YXRhcigpXHJcbiAgICBPYmplY3Qua2V5cyhsb2dpbkhlYWRlcnMpLmZvckVhY2goKGgpID0+ICB7XHJcbiAgICAgICAgLy8gTG9vcCB0aHJvdWdoIHRoZSBpbnB1dCBlbGVtZW50cyBjb250YWluZWQgaW4gdGhlIGxvZ2luIHBhZ2UuIEFzIG1lbnRpb25lZCBiZWZvcmUsIHRoZXlcclxuICAgICAgICAvLyB3aWxsIGJlIHNlbnQgdG8gUENSIHRvIGxvZyBpbi5cclxuICAgICAgICBpZiAoaC50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ3VzZXInKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgbG9naW5IZWFkZXJzW2hdID0gdmFsICYmICFzdWJtaXRFdnQgPyB2YWxbMF0gOiB1c2VybmFtZUVsLnZhbHVlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChoLnRvTG93ZXJDYXNlKCkuaW5kZXhPZigncGFzcycpICE9PSAtMSkge1xyXG4gICAgICAgICAgICBsb2dpbkhlYWRlcnNbaF0gPSB2YWwgJiYgIXN1Ym1pdEV2dCA/IHZhbFsxXSA6IHBhc3N3b3JkRWwudmFsdWVcclxuICAgICAgICB9XHJcbiAgICAgICAgcG9zdEFycmF5LnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KGgpICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KGxvZ2luSGVhZGVyc1toXSkpXHJcbiAgICB9KVxyXG5cclxuICAgIC8vIE5vdyBzZW5kIHRoZSBsb2dpbiByZXF1ZXN0IHRvIFBDUlxyXG4gICAgY29uc29sZS50aW1lKCdMb2dnaW5nIGluJylcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcmVzcCA9IGF3YWl0IHNlbmQoTE9HSU5fVVJMLCAnZG9jdW1lbnQnLCBGT1JNX0hFQURFUl9PTkxZLCBwb3N0QXJyYXkuam9pbignJicpLCBwcm9ncmVzc0VsZW1lbnQpXHJcbiAgICAgICAgY29uc29sZS50aW1lRW5kKCdMb2dnaW5nIGluJylcclxuICAgICAgICBpZiAocmVzcC5yZXNwb25zZVVSTC5pbmRleE9mKCdMb2dpbicpICE9PSAtMSkge1xyXG4gICAgICAgIC8vIElmIFBDUiBzdGlsbCB3YW50cyB1cyB0byBsb2cgaW4sIHRoZW4gdGhlIHVzZXJuYW1lIG9yIHBhc3N3b3JkIGVudGVyZWQgd2VyZSBpbmNvcnJlY3QuXHJcbiAgICAgICAgICAgIGluY29ycmVjdExvZ2luRWwuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcclxuICAgICAgICAgICAgcGFzc3dvcmRFbC52YWx1ZSA9ICcnXHJcblxyXG4gICAgICAgICAgICBsb2dpbkRpYWxvZy5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG4gICAgICAgICAgICBpZiAobG9naW5CYWNrZ3JvdW5kKSBsb2dpbkJhY2tncm91bmQuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBPdGhlcndpc2UsIHdlIGFyZSBsb2dnZWQgaW5cclxuICAgICAgICAgICAgaWYgKHJlbWVtYmVyQ2hlY2suY2hlY2tlZCkgeyAvLyBJcyB0aGUgXCJyZW1lbWJlciBtZVwiIGNoZWNrYm94IGNoZWNrZWQ/XHJcbiAgICAgICAgICAgICAgICAvLyBTZXQgYSBjb29raWUgd2l0aCB0aGUgdXNlcm5hbWUgYW5kIHBhc3N3b3JkIHNvIHdlIGNhbiBsb2cgaW4gYXV0b21hdGljYWxseSBpbiB0aGVcclxuICAgICAgICAgICAgICAgIC8vIGZ1dHVyZSB3aXRob3V0IGhhdmluZyB0byBwcm9tcHQgZm9yIGEgdXNlcm5hbWUgYW5kIHBhc3N3b3JkIGFnYWluXHJcbiAgICAgICAgICAgICAgICBzZXRDb29raWUoJ3VzZXJQYXNzJywgd2luZG93LmJ0b2EodXNlcm5hbWVFbC52YWx1ZSArICc6JyArIHBhc3N3b3JkRWwudmFsdWUpLCAxNClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBsb2FkaW5nQmFyLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIlxyXG4gICAgICAgICAgICBjb25zdCB0ID0gRGF0ZS5ub3coKVxyXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2UubGFzdFVwZGF0ZSA9IHRcclxuICAgICAgICAgICAgaWYgKGxhc3RVcGRhdGVFbCkgbGFzdFVwZGF0ZUVsLmlubmVySFRNTCA9IGZvcm1hdFVwZGF0ZSh0KVxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgcGFyc2UocmVzcC5yZXNwb25zZSkgLy8gUGFyc2UgdGhlIGRhdGEgUENSIGhhcyByZXBsaWVkIHdpdGhcclxuICAgICAgICAgICAgICAgIG9uc3VjY2VzcygpXHJcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2VXcml0ZSgnZGF0YScsIGdldERhdGEoKSkgLy8gU3RvcmUgZm9yIG9mZmxpbmUgdXNlXHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpXHJcbiAgICAgICAgICAgICAgICBkaXNwbGF5RXJyb3IoZSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgIGNvbnNvbGUubG9nKCdDb3VsZCBub3QgbG9nIGluIHRvIFBDUi4gRWl0aGVyIHlvdXIgbmV0d29yayBjb25uZWN0aW9uIHdhcyBsb3N0IGR1cmluZyB5b3VyIHZpc2l0ICcgK1xyXG4gICAgICAgICAgICAgICAgICAgICAnb3IgUENSIGlzIGp1c3Qgbm90IHdvcmtpbmcuIEhlcmVcXCdzIHRoZSBlcnJvcjonLCBlcnJvcilcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldERhdGEoKTogSUFwcGxpY2F0aW9uRGF0YXx1bmRlZmluZWQge1xyXG4gICAgcmV0dXJuICh3aW5kb3cgYXMgYW55KS5kYXRhXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRDbGFzc2VzKCk6IHN0cmluZ1tdIHtcclxuICAgIGNvbnN0IGRhdGEgPSBnZXREYXRhKClcclxuICAgIGlmICghZGF0YSkgcmV0dXJuIFtdXHJcbiAgICByZXR1cm4gZGF0YS5jbGFzc2VzXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXREYXRhKGRhdGE6IElBcHBsaWNhdGlvbkRhdGEpOiB2b2lkIHtcclxuICAgICh3aW5kb3cgYXMgYW55KS5kYXRhID0gZGF0YVxyXG59XHJcblxyXG4vLyBJbiBQQ1IncyBpbnRlcmZhY2UsIHlvdSBjYW4gY2xpY2sgYSBkYXRlIGluIG1vbnRoIG9yIHdlZWsgdmlldyB0byBzZWUgaXQgaW4gZGF5IHZpZXcuXHJcbi8vIFRoZXJlZm9yZSwgdGhlIEhUTUwgZWxlbWVudCB0aGF0IHNob3dzIHRoZSBkYXRlIHRoYXQgeW91IGNhbiBjbGljayBvbiBoYXMgYSBoeXBlcmxpbmsgdGhhdCBsb29rcyBsaWtlIGAjMjAxNS0wNC0yNmAuXHJcbi8vIFRoZSBmdW5jdGlvbiBiZWxvdyB3aWxsIHBhcnNlIHRoYXQgU3RyaW5nIGFuZCByZXR1cm4gYSBEYXRlIHRpbWVzdGFtcFxyXG5mdW5jdGlvbiBwYXJzZURhdGVIYXNoKGVsZW1lbnQ6IEhUTUxBbmNob3JFbGVtZW50KTogbnVtYmVyIHtcclxuICAgIGNvbnN0IFt5ZWFyLCBtb250aCwgZGF5XSA9IGVsZW1lbnQuaGFzaC5zdWJzdHJpbmcoMSkuc3BsaXQoJy0nKS5tYXAoTnVtYmVyKVxyXG4gICAgcmV0dXJuIChuZXcgRGF0ZSh5ZWFyLCBtb250aCAtIDEsIGRheSkpLmdldFRpbWUoKVxyXG59XHJcblxyXG4vLyBUaGUgKmF0dGFjaG1lbnRpZnkqIGZ1bmN0aW9uIHBhcnNlcyB0aGUgYm9keSBvZiBhbiBhc3NpZ25tZW50ICgqdGV4dCopIGFuZCByZXR1cm5zIHRoZSBhc3NpZ25tZW50J3MgYXR0YWNobWVudHMuXHJcbi8vIFNpZGUgZWZmZWN0OiB0aGVzZSBhdHRhY2htZW50cyBhcmUgcmVtb3ZlZFxyXG5mdW5jdGlvbiBhdHRhY2htZW50aWZ5KGVsZW1lbnQ6IEhUTUxFbGVtZW50KTogQXR0YWNobWVudEFycmF5W10ge1xyXG4gICAgY29uc3QgYXR0YWNobWVudHM6IEF0dGFjaG1lbnRBcnJheVtdID0gW11cclxuXHJcbiAgICAvLyBHZXQgYWxsIGxpbmtzXHJcbiAgICBjb25zdCBhcyA9IEFycmF5LmZyb20oZWxlbWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYScpKVxyXG4gICAgYXMuZm9yRWFjaCgoYSkgPT4ge1xyXG4gICAgICAgIGlmIChhLmlkLmluY2x1ZGVzKCdBdHRhY2htZW50JykpIHtcclxuICAgICAgICAgICAgYXR0YWNobWVudHMucHVzaChbXHJcbiAgICAgICAgICAgICAgICBhLmlubmVySFRNTCxcclxuICAgICAgICAgICAgICAgIGEuc2VhcmNoICsgYS5oYXNoXHJcbiAgICAgICAgICAgIF0pXHJcbiAgICAgICAgICAgIGEucmVtb3ZlKClcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICAgcmV0dXJuIGF0dGFjaG1lbnRzXHJcbn1cclxuXHJcbmNvbnN0IFVSTF9SRUdFWCA9IG5ldyBSZWdFeHAoYChcXFxyXG5odHRwcz86XFxcXC9cXFxcL1xcXHJcblstQS1aMC05KyZAI1xcXFwvJT89fl98ITosLjtdKlxcXHJcblstQS1aMC05KyZAI1xcXFwvJT1+X3xdK1xcXHJcbilgLCAnaWcnXHJcbilcclxuXHJcbi8vIFRoaXMgZnVuY3Rpb24gcmVwbGFjZXMgdGV4dCB0aGF0IHJlcHJlc2VudHMgYSBoeXBlcmxpbmsgd2l0aCBhIGZ1bmN0aW9uYWwgaHlwZXJsaW5rIGJ5IHVzaW5nXHJcbi8vIGphdmFzY3JpcHQncyByZXBsYWNlIGZ1bmN0aW9uIHdpdGggYSByZWd1bGFyIGV4cHJlc3Npb24gaWYgdGhlIHRleHQgYWxyZWFkeSBpc24ndCBwYXJ0IG9mIGFcclxuLy8gaHlwZXJsaW5rLlxyXG5mdW5jdGlvbiB1cmxpZnkodGV4dDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0ZXh0LnJlcGxhY2UoVVJMX1JFR0VYLCAoc3RyLCBzdHIyLCBvZmZzZXQpID0+IHsgLy8gRnVuY3Rpb24gdG8gcmVwbGFjZSBtYXRjaGVzXHJcbiAgICAgICAgaWYgKC9ocmVmXFxzKj1cXHMqLi8udGVzdCh0ZXh0LnN1YnN0cmluZyhvZmZzZXQgLSAxMCwgb2Zmc2V0KSkgfHxcclxuICAgICAgICAgICAgL29yaWdpbmFscGF0aFxccyo9XFxzKi4vLnRlc3QodGV4dC5zdWJzdHJpbmcob2Zmc2V0IC0gMjAsIG9mZnNldCkpXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzdHJcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gYDxhIGhyZWY9XCIke3N0cn1cIj4ke3N0cn08L2E+YFxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbn1cclxuXHJcbi8vIEFsc28sIFBDUlwicyBpbnRlcmZhY2UgdXNlcyBhIHN5c3RlbSBvZiBJRHMgdG8gaWRlbnRpZnkgZGlmZmVyZW50IGVsZW1lbnRzLiBGb3IgZXhhbXBsZSwgdGhlIElEIG9mXHJcbi8vIG9uZSBvZiB0aGUgYm94ZXMgc2hvd2luZyB0aGUgbmFtZSBvZiBhbiBhc3NpZ25tZW50IGNvdWxkIGJlXHJcbi8vIGBjdGwwMF9jdGwwMF9iYXNlQ29udGVudF9iYXNlQ29udGVudF9mbGFzaFRvcF9jdGwwMF9SYWRTY2hlZHVsZXIxXzk1XzBgLiBUaGUgZnVuY3Rpb24gYmVsb3cgd2lsbFxyXG4vLyByZXR1cm4gdGhlIGZpcnN0IEhUTUwgZWxlbWVudCB3aG9zZSBJRCBjb250YWlucyBhIHNwZWNpZmllZCBTdHJpbmcgKCppZCopIGFuZCBjb250YWluaW5nIGFcclxuLy8gc3BlY2lmaWVkIHRhZyAoKnRhZyopLlxyXG5mdW5jdGlvbiBmaW5kSWQoZWxlbWVudDogSFRNTEVsZW1lbnR8SFRNTERvY3VtZW50LCB0YWc6IHN0cmluZywgaWQ6IHN0cmluZyk6IEhUTUxFbGVtZW50IHtcclxuICAgIGNvbnN0IGVsID0gWy4uLmVsZW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUodGFnKV0uZmluZCgoZSkgPT4gZS5pZC5pbmNsdWRlcyhpZCkpXHJcbiAgICBpZiAoIWVsKSB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBmaW5kIGVsZW1lbnQgd2l0aCB0YWcgJHt0YWd9IGFuZCBpZCAke2lkfSBpbiAke2VsZW1lbnR9YClcclxuICAgIHJldHVybiBlbCBhcyBIVE1MRWxlbWVudFxyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJzZUFzc2lnbm1lbnRUeXBlKHR5cGU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdHlwZS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoJyYgcXVpenplcycsICcnKS5yZXBsYWNlKCd0ZXN0cycsICd0ZXN0JylcclxufVxyXG5cclxuZnVuY3Rpb24gcGFyc2VBc3NpZ25tZW50QmFzZVR5cGUodHlwZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0eXBlLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgnJiBxdWl6emVzJywgJycpLnJlcGxhY2UoL1xccy9nLCAnJykucmVwbGFjZSgncXVpenplcycsICd0ZXN0JylcclxufVxyXG5cclxuZnVuY3Rpb24gcGFyc2VBc3NpZ25tZW50KGNhOiBIVE1MRWxlbWVudCk6IElBc3NpZ25tZW50IHtcclxuICAgIGNvbnN0IGRhdGEgPSBnZXREYXRhKClcclxuICAgIGlmICghZGF0YSkgdGhyb3cgbmV3IEVycm9yKCdEYXRhIGRpY3Rpb25hcnkgbm90IHNldCB1cCcpXHJcblxyXG4gICAgLy8gVGhlIHN0YXJ0aW5nIGRhdGUgYW5kIGVuZGluZyBkYXRlIG9mIHRoZSBhc3NpZ25tZW50IGFyZSBwYXJzZWQgZmlyc3RcclxuICAgIGNvbnN0IHJhbmdlID0gZmluZElkKGNhLCAnc3BhbicsICdTdGFydGluZ09uJykuaW5uZXJIVE1MLnNwbGl0KCcgLSAnKVxyXG4gICAgY29uc3QgYXNzaWdubWVudFN0YXJ0ID0gdG9EYXRlTnVtKERhdGUucGFyc2UocmFuZ2VbMF0pKVxyXG4gICAgY29uc3QgYXNzaWdubWVudEVuZCA9IChyYW5nZVsxXSAhPSBudWxsKSA/IHRvRGF0ZU51bShEYXRlLnBhcnNlKHJhbmdlWzFdKSkgOiBhc3NpZ25tZW50U3RhcnRcclxuXHJcbiAgICAvLyBUaGVuLCB0aGUgbmFtZSBvZiB0aGUgYXNzaWdubWVudCBpcyBwYXJzZWRcclxuICAgIGNvbnN0IHQgPSBmaW5kSWQoY2EsICdzcGFuJywgJ2xibFRpdGxlJylcclxuICAgIGxldCB0aXRsZSA9IHQuaW5uZXJIVE1MXHJcblxyXG4gICAgLy8gVGhlIGFjdHVhbCBib2R5IG9mIHRoZSBhc3NpZ25tZW50IGFuZCBpdHMgYXR0YWNobWVudHMgYXJlIHBhcnNlZCBuZXh0XHJcbiAgICBjb25zdCBiID0gXyQoXyQodC5wYXJlbnROb2RlKS5wYXJlbnROb2RlKSBhcyBIVE1MRWxlbWVudFxyXG4gICAgWy4uLmIuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2RpdicpXS5zbGljZSgwLCAyKS5mb3JFYWNoKChkaXYpID0+IGRpdi5yZW1vdmUoKSlcclxuXHJcbiAgICBjb25zdCBhcCA9IGF0dGFjaG1lbnRpZnkoYikgLy8gU2VwYXJhdGVzIGF0dGFjaG1lbnRzIGZyb20gdGhlIGJvZHlcclxuXHJcbiAgICAvLyBUaGUgbGFzdCBSZXBsYWNlIHJlbW92ZXMgbGVhZGluZyBhbmQgdHJhaWxpbmcgbmV3bGluZXNcclxuICAgIGNvbnN0IGFzc2lnbm1lbnRCb2R5ID0gdXJsaWZ5KGIuaW5uZXJIVE1MKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL14oPzpcXHMqPGJyXFxzKlxcLz8+KSovLCAnJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8oPzpcXHMqPGJyXFxzKlxcLz8+KSpcXHMqJC8sICcnKS50cmltKClcclxuXHJcbiAgICAvLyBGaW5hbGx5LCB3ZSBzZXBhcmF0ZSB0aGUgY2xhc3MgbmFtZSBhbmQgdHlwZSAoaG9tZXdvcmssIGNsYXNzd29yaywgb3IgcHJvamVjdHMpIGZyb20gdGhlIHRpdGxlIG9mIHRoZSBhc3NpZ25tZW50XHJcbiAgICBjb25zdCBtYXRjaGVkVGl0bGUgPSB0aXRsZS5tYXRjaCgvXFwoKFteKV0qXFwpKilcXCkkLylcclxuICAgIGlmICgobWF0Y2hlZFRpdGxlID09IG51bGwpKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgcGFyc2UgYXNzaWdubWVudCB0aXRsZSBcXFwiJHt0aXRsZX1cXFwiYClcclxuICAgIH1cclxuICAgIGNvbnN0IGFzc2lnbm1lbnRUeXBlID0gbWF0Y2hlZFRpdGxlWzFdXHJcbiAgICBjb25zdCBhc3NpZ25tZW50QmFzZVR5cGUgPSBwYXJzZUFzc2lnbm1lbnRCYXNlVHlwZShjYS50aXRsZS5zdWJzdHJpbmcoMCwgY2EudGl0bGUuaW5kZXhPZignXFxuJykpKVxyXG4gICAgbGV0IGFzc2lnbm1lbnRDbGFzc0luZGV4ID0gbnVsbFxyXG4gICAgZGF0YS5jbGFzc2VzLnNvbWUoKGMsIHBvcykgPT4ge1xyXG4gICAgICAgIGlmICh0aXRsZS5pbmRleE9mKGMpICE9PSAtMSkge1xyXG4gICAgICAgICAgICBhc3NpZ25tZW50Q2xhc3NJbmRleCA9IHBvc1xyXG4gICAgICAgICAgICB0aXRsZSA9IHRpdGxlLnJlcGxhY2UoYywgJycpXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgfSlcclxuXHJcbiAgICBpZiAoYXNzaWdubWVudENsYXNzSW5kZXggPT09IG51bGwgfHwgYXNzaWdubWVudENsYXNzSW5kZXggPT09IC0xKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCBjbGFzcyBpbiB0aXRsZSAke3RpdGxlfSAoY2xhc3NlcyBhcmUgJHtkYXRhLmNsYXNzZXN9YClcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBhc3NpZ25tZW50VGl0bGUgPSB0aXRsZS5zdWJzdHJpbmcodGl0bGUuaW5kZXhPZignOiAnKSArIDIpLnJlcGxhY2UoL1xcKFteXFwoXFwpXSpcXCkkLywgJycpLnRyaW0oKVxyXG5cclxuICAgIC8vIFRvIG1ha2Ugc3VyZSB0aGVyZSBhcmUgbm8gcmVwZWF0cywgdGhlIHRpdGxlIG9mIHRoZSBhc3NpZ25tZW50IChvbmx5IGxldHRlcnMpIGFuZCBpdHMgc3RhcnQgJlxyXG4gICAgLy8gZW5kIGRhdGUgYXJlIGNvbWJpbmVkIHRvIGdpdmUgaXQgYSB1bmlxdWUgaWRlbnRpZmllci5cclxuICAgIGNvbnN0IGFzc2lnbm1lbnRJZCA9IGFzc2lnbm1lbnRUaXRsZS5yZXBsYWNlKC9bXlxcd10qL2csICcnKSArIChhc3NpZ25tZW50U3RhcnQgKyBhc3NpZ25tZW50RW5kKVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgc3RhcnQ6IGFzc2lnbm1lbnRTdGFydCxcclxuICAgICAgICBlbmQ6IGFzc2lnbm1lbnRFbmQsXHJcbiAgICAgICAgYXR0YWNobWVudHM6IGFwLFxyXG4gICAgICAgIGJvZHk6IGFzc2lnbm1lbnRCb2R5LFxyXG4gICAgICAgIHR5cGU6IGFzc2lnbm1lbnRUeXBlLFxyXG4gICAgICAgIGJhc2VUeXBlOiBhc3NpZ25tZW50QmFzZVR5cGUsXHJcbiAgICAgICAgY2xhc3M6IGFzc2lnbm1lbnRDbGFzc0luZGV4LFxyXG4gICAgICAgIHRpdGxlOiBhc3NpZ25tZW50VGl0bGUsXHJcbiAgICAgICAgaWQ6IGFzc2lnbm1lbnRJZFxyXG4gICAgfVxyXG59XHJcblxyXG4vLyBUaGUgZnVuY3Rpb24gYmVsb3cgd2lsbCBwYXJzZSB0aGUgZGF0YSBnaXZlbiBieSBQQ1IgYW5kIGNvbnZlcnQgaXQgaW50byBhbiBvYmplY3QuIElmIHlvdSBvcGVuIHVwXHJcbi8vIHRoZSBkZXZlbG9wZXIgY29uc29sZSBvbiBDaGVja1BDUiBhbmQgdHlwZSBpbiBgZGF0YWAsIHlvdSBjYW4gc2VlIHRoZSBhcnJheSBjb250YWluaW5nIGFsbCBvZlxyXG4vLyB5b3VyIGFzc2lnbm1lbnRzLlxyXG5mdW5jdGlvbiBwYXJzZShkb2M6IEhUTUxEb2N1bWVudCk6IHZvaWQge1xyXG4gICAgY29uc29sZS50aW1lKCdIYW5kbGluZyBkYXRhJykgLy8gVG8gdGltZSBob3cgbG9uZyBpdCB0YWtlcyB0byBwYXJzZSB0aGUgYXNzaWdubWVudHNcclxuICAgIGNvbnN0IGhhbmRsZWREYXRhU2hvcnQ6IHN0cmluZ1tdID0gW10gLy8gQXJyYXkgdXNlZCB0byBtYWtlIHN1cmUgd2UgZG9uXCJ0IHBhcnNlIHRoZSBzYW1lIGFzc2lnbm1lbnQgdHdpY2UuXHJcbiAgICBjb25zdCBkYXRhOiBJQXBwbGljYXRpb25EYXRhID0ge1xyXG4gICAgICAgIGNsYXNzZXM6IFtdLFxyXG4gICAgICAgIGFzc2lnbm1lbnRzOiBbXSxcclxuICAgICAgICBtb250aFZpZXc6IChfJChkb2MucXVlcnlTZWxlY3RvcignLnJzSGVhZGVyTW9udGgnKSkucGFyZW50Tm9kZSBhcyBIVE1MRWxlbWVudCkuY2xhc3NMaXN0LmNvbnRhaW5zKCdyc1NlbGVjdGVkJylcclxuICAgIH0gLy8gUmVzZXQgdGhlIGFycmF5IGluIHdoaWNoIGFsbCBvZiB5b3VyIGFzc2lnbm1lbnRzIGFyZSBzdG9yZWQgaW4uXHJcbiAgICBzZXREYXRhKGRhdGEpXHJcblxyXG4gICAgZG9jLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0Om5vdChbdHlwZT1cInN1Ym1pdFwiXSknKS5mb3JFYWNoKChlKSA9PiB7XHJcbiAgICAgICAgdmlld0RhdGFbKGUgYXMgSFRNTElucHV0RWxlbWVudCkubmFtZV0gPSAoZSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSB8fCAnJ1xyXG4gICAgfSlcclxuXHJcbiAgICAvLyBOb3csIHRoZSBjbGFzc2VzIHlvdSB0YWtlIGFyZSBwYXJzZWQgKHRoZXNlIGFyZSB0aGUgY2hlY2tib3hlcyB5b3Ugc2VlIHVwIHRvcCB3aGVuIGxvb2tpbmcgYXQgUENSKS5cclxuICAgIGNvbnN0IGNsYXNzZXMgPSBmaW5kSWQoZG9jLCAndGFibGUnLCAnY2JDbGFzc2VzJykuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2xhYmVsJylcclxuICAgIGNsYXNzZXMuZm9yRWFjaCgoYykgPT4ge1xyXG4gICAgICAgIGRhdGEuY2xhc3Nlcy5wdXNoKGMuaW5uZXJIVE1MKVxyXG4gICAgfSlcclxuXHJcbiAgICBjb25zdCBhc3NpZ25tZW50cyA9IGRvYy5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdyc0FwdCByc0FwdFNpbXBsZScpXHJcbiAgICBBcnJheS5wcm90b3R5cGUuZm9yRWFjaC5jYWxsKGFzc2lnbm1lbnRzLCAoYXNzaWdubWVudEVsOiBIVE1MRWxlbWVudCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGFzc2lnbm1lbnQgPSBwYXJzZUFzc2lnbm1lbnQoYXNzaWdubWVudEVsKVxyXG4gICAgICAgIGlmIChoYW5kbGVkRGF0YVNob3J0LmluZGV4T2YoYXNzaWdubWVudC5pZCkgPT09IC0xKSB7IC8vIE1ha2Ugc3VyZSB3ZSBoYXZlbid0IGFscmVhZHkgcGFyc2VkIHRoZSBhc3NpZ25tZW50XHJcbiAgICAgICAgICAgIGhhbmRsZWREYXRhU2hvcnQucHVzaChhc3NpZ25tZW50LmlkKVxyXG4gICAgICAgICAgICBkYXRhLmFzc2lnbm1lbnRzLnB1c2goYXNzaWdubWVudClcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG5cclxuICAgIGNvbnNvbGUudGltZUVuZCgnSGFuZGxpbmcgZGF0YScpXHJcblxyXG4gICAgLy8gTm93IGFsbG93IHRoZSB2aWV3IHRvIGJlIHN3aXRjaGVkXHJcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ2xvYWRlZCcpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1cmxGb3JBdHRhY2htZW50KHNlYXJjaDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIHJldHVybiBBVFRBQ0hNRU5UU19VUkwgKyBzZWFyY2hcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldEF0dGFjaG1lbnRNaW1lVHlwZShzZWFyY2g6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXHJcbiAgICAgICAgcmVxLm9wZW4oJ0hFQUQnLCB1cmxGb3JBdHRhY2htZW50KHNlYXJjaCkpXHJcbiAgICAgICAgcmVxLm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKHJlcS5zdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdHlwZSA9IHJlcS5nZXRSZXNwb25zZUhlYWRlcignQ29udGVudC1UeXBlJylcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh0eXBlKVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKCdDb250ZW50IHR5cGUgaXMgbnVsbCcpKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJlcS5zZW5kKClcclxuICAgIH0pXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjbGFzc0J5SWQoaWQ6IG51bWJlcnxudWxsfHVuZGVmaW5lZCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gKGlkID8gZ2V0Q2xhc3NlcygpW2lkXSA6IG51bGwpIHx8ICdVbmtub3duIGNsYXNzJ1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc3dpdGNoVmlld3MoKTogdm9pZCB7XHJcbiAgICBpZiAoT2JqZWN0LmtleXModmlld0RhdGEpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBlbGVtQnlJZCgnc2lkZUJhY2tncm91bmQnKS5jbGljaygpXHJcbiAgICAgICAgdmlld0RhdGEuX19FVkVOVFRBUkdFVCA9ICdjdGwwMCRjdGwwMCRiYXNlQ29udGVudCRiYXNlQ29udGVudCRmbGFzaFRvcCRjdGwwMCRSYWRTY2hlZHVsZXIxJ1xyXG4gICAgICAgIHZpZXdEYXRhLl9fRVZFTlRBUkdVTUVOVCA9IEpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICAgICAgQ29tbWFuZDogYFN3aXRjaFRvJHtkb2N1bWVudC5ib2R5LmdldEF0dHJpYnV0ZSgnZGF0YS1wY3J2aWV3JykgPT09ICdtb250aCcgPyAnV2VlaycgOiAnTW9udGgnfVZpZXdgXHJcbiAgICAgICAgfSlcclxuICAgICAgICB2aWV3RGF0YS5jdGwwMF9jdGwwMF9iYXNlQ29udGVudF9iYXNlQ29udGVudF9mbGFzaFRvcF9jdGwwMF9SYWRTY2hlZHVsZXIxX0NsaWVudFN0YXRlID1cclxuICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoe3Njcm9sbFRvcDogMCwgc2Nyb2xsTGVmdDogMCwgaXNEaXJ0eTogZmFsc2V9KVxyXG4gICAgICAgIHZpZXdEYXRhLmN0bDAwX2N0bDAwX1JhZFNjcmlwdE1hbmFnZXIxX1RTTSA9ICc7O1N5c3RlbS5XZWIuRXh0ZW5zaW9ucywgVmVyc2lvbj00LjAuMC4wLCBDdWx0dXJlPW5ldXRyYWwsICcgK1xyXG4gICAgICAgICAgICAnUHVibGljS2V5VG9rZW49MzFiZjM4NTZhZDM2NGUzNTplbi1VUzpkMjg1NjhkMy1lNTNlLTQ3MDYtOTI4Zi0zNzY1OTEyYjY2Y2E6ZWE1OTdkNGI6YjI1Mzc4ZDInXHJcbiAgICAgICAgY29uc3QgcG9zdEFycmF5OiBzdHJpbmdbXSA9IFtdIC8vIEFycmF5IG9mIGRhdGEgdG8gcG9zdFxyXG4gICAgICAgIE9iamVjdC5lbnRyaWVzKHZpZXdEYXRhKS5mb3JFYWNoKChbaCwgdl0pID0+IHtcclxuICAgICAgICAgICAgcG9zdEFycmF5LnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KGgpICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHYpKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgZmV0Y2godHJ1ZSwgcG9zdEFycmF5LmpvaW4oJyYnKSlcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGxvZ291dCgpOiB2b2lkIHtcclxuICAgIGlmIChPYmplY3Qua2V5cyh2aWV3RGF0YSkubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGRlbGV0ZUNvb2tpZSgndXNlclBhc3MnKVxyXG4gICAgICAgIGVsZW1CeUlkKCdzaWRlQmFja2dyb3VuZCcpLmNsaWNrKClcclxuICAgICAgICB2aWV3RGF0YS5fX0VWRU5UVEFSR0VUID0gJ2N0bDAwJGN0bDAwJGJhc2VDb250ZW50JExvZ291dENvbnRyb2wxJExvZ2luU3RhdHVzMSRjdGwwMCdcclxuICAgICAgICB2aWV3RGF0YS5fX0VWRU5UQVJHVU1FTlQgPSAnJ1xyXG4gICAgICAgIHZpZXdEYXRhLmN0bDAwX2N0bDAwX2Jhc2VDb250ZW50X2Jhc2VDb250ZW50X2ZsYXNoVG9wX2N0bDAwX1JhZFNjaGVkdWxlcjFfQ2xpZW50U3RhdGUgPVxyXG4gICAgICAgICAgICBKU09OLnN0cmluZ2lmeSh7c2Nyb2xsVG9wOiAwLCBzY3JvbGxMZWZ0OiAwLCBpc0RpcnR5OiBmYWxzZX0pXHJcbiAgICAgICAgY29uc3QgcG9zdEFycmF5OiBzdHJpbmdbXSA9IFtdIC8vIEFycmF5IG9mIGRhdGEgdG8gcG9zdFxyXG4gICAgICAgIE9iamVjdC5lbnRyaWVzKHZpZXdEYXRhKS5mb3JFYWNoKChbaCwgdl0pID0+IHtcclxuICAgICAgICAgICAgcG9zdEFycmF5LnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KGgpICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHYpKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgZmV0Y2godHJ1ZSwgcG9zdEFycmF5LmpvaW4oJyYnKSlcclxuICAgICAgfVxyXG59XHJcbiIsImltcG9ydCB7IGFkZEFjdGl2aXR5RWxlbWVudCwgY3JlYXRlQWN0aXZpdHkgfSBmcm9tICcuLi9jb21wb25lbnRzL2FjdGl2aXR5J1xyXG5pbXBvcnQgeyBJQXNzaWdubWVudCB9IGZyb20gJy4uL3BjcidcclxuaW1wb3J0IHsgbG9jYWxTdG9yYWdlUmVhZCwgbG9jYWxTdG9yYWdlV3JpdGUgfSBmcm9tICcuLi91dGlsJ1xyXG5cclxuZXhwb3J0IHR5cGUgQWN0aXZpdHlUeXBlID0gJ2RlbGV0ZScgfCAnZWRpdCcgfCAnYWRkJ1xyXG5leHBvcnQgdHlwZSBBY3Rpdml0eUl0ZW0gPSBbQWN0aXZpdHlUeXBlLCBJQXNzaWdubWVudCwgbnVtYmVyLCBzdHJpbmcgfCB1bmRlZmluZWRdXHJcblxyXG5jb25zdCBBQ1RJVklUWV9TVE9SQUdFX05BTUUgPSAnYWN0aXZpdHknXHJcblxyXG5sZXQgYWN0aXZpdHk6IEFjdGl2aXR5SXRlbVtdID0gbG9jYWxTdG9yYWdlUmVhZChBQ1RJVklUWV9TVE9SQUdFX05BTUUpIHx8IFtdXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYWRkQWN0aXZpdHkodHlwZTogQWN0aXZpdHlUeXBlLCBhc3NpZ25tZW50OiBJQXNzaWdubWVudCwgZGF0ZTogRGF0ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0FjdGl2aXR5OiBib29sZWFuLCBjbGFzc05hbWU/OiBzdHJpbmcgKTogdm9pZCB7XHJcbiAgICBpZiAobmV3QWN0aXZpdHkpIGFjdGl2aXR5LnB1c2goW3R5cGUsIGFzc2lnbm1lbnQsIERhdGUubm93KCksIGNsYXNzTmFtZV0pXHJcbiAgICBjb25zdCBlbCA9IGNyZWF0ZUFjdGl2aXR5KHR5cGUsIGFzc2lnbm1lbnQsIGRhdGUsIGNsYXNzTmFtZSlcclxuICAgIGFkZEFjdGl2aXR5RWxlbWVudChlbClcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVBY3Rpdml0eSgpOiB2b2lkIHtcclxuICAgIGFjdGl2aXR5ID0gYWN0aXZpdHkuc2xpY2UoYWN0aXZpdHkubGVuZ3RoIC0gMTI4LCBhY3Rpdml0eS5sZW5ndGgpXHJcbiAgICBsb2NhbFN0b3JhZ2VXcml0ZShBQ1RJVklUWV9TVE9SQUdFX05BTUUsIGFjdGl2aXR5KVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVjZW50QWN0aXZpdHkoKTogQWN0aXZpdHlJdGVtW10ge1xyXG4gICAgcmV0dXJuIGFjdGl2aXR5LnNsaWNlKGFjdGl2aXR5Lmxlbmd0aCAtIDMyLCBhY3Rpdml0eS5sZW5ndGgpXHJcbn1cclxuIiwiaW1wb3J0IHsgZWxlbUJ5SWQsIGxvY2FsU3RvcmFnZVJlYWQsIGxvY2FsU3RvcmFnZVdyaXRlIH0gZnJvbSAnLi4vdXRpbCdcclxuXHJcbmNvbnN0IEFUSEVOQV9TVE9SQUdFX05BTUUgPSAnYXRoZW5hRGF0YSdcclxuXHJcbmludGVyZmFjZSBJUmF3QXRoZW5hRGF0YSB7XHJcbiAgICByZXNwb25zZV9jb2RlOiAyMDBcclxuICAgIGJvZHk6IHtcclxuICAgICAgICBjb3Vyc2VzOiB7XHJcbiAgICAgICAgICAgIGNvdXJzZXM6IElSYXdDb3Vyc2VbXVxyXG4gICAgICAgICAgICBzZWN0aW9uczogSVJhd1NlY3Rpb25bXVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHBlcm1pc3Npb25zOiBhbnlcclxufVxyXG5cclxuaW50ZXJmYWNlIElSYXdDb3Vyc2Uge1xyXG4gICAgbmlkOiBudW1iZXJcclxuICAgIGNvdXJzZV90aXRsZTogc3RyaW5nXHJcbiAgICAvLyBUaGVyZSdzIGEgYnVuY2ggbW9yZSB0aGF0IEkndmUgb21pdHRlZFxyXG59XHJcblxyXG5pbnRlcmZhY2UgSVJhd1NlY3Rpb24ge1xyXG4gICAgY291cnNlX25pZDogbnVtYmVyXHJcbiAgICBsaW5rOiBzdHJpbmdcclxuICAgIGxvZ286IHN0cmluZ1xyXG4gICAgc2VjdGlvbl90aXRsZTogc3RyaW5nXHJcbiAgICAvLyBUaGVyZSdzIGEgYnVuY2ggbW9yZSB0aGF0IEkndmUgb21pdHRlZFxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElBdGhlbmFEYXRhSXRlbSB7XHJcbiAgICBsaW5rOiBzdHJpbmdcclxuICAgIGxvZ286IHN0cmluZ1xyXG4gICAgcGVyaW9kOiBzdHJpbmdcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJQXRoZW5hRGF0YSB7XHJcbiAgICBbY2xzOiBzdHJpbmddOiBJQXRoZW5hRGF0YUl0ZW1cclxufVxyXG5cclxubGV0IGF0aGVuYURhdGE6IElBdGhlbmFEYXRhfG51bGwgPSBsb2NhbFN0b3JhZ2VSZWFkKEFUSEVOQV9TVE9SQUdFX05BTUUpXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0QXRoZW5hRGF0YSgpOiBJQXRoZW5hRGF0YXxudWxsIHtcclxuICAgIHJldHVybiBhdGhlbmFEYXRhXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZvcm1hdExvZ28obG9nbzogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIHJldHVybiBsb2dvLnN1YnN0cigwLCBsb2dvLmluZGV4T2YoJ1wiIGFsdD1cIicpKVxyXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoJzxkaXYgY2xhc3M9XCJwcm9maWxlLXBpY3R1cmVcIj48aW1nIHNyYz1cIicsICcnKVxyXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoJ3RpbnknLCAncmVnJylcclxufVxyXG5cclxuLy8gTm93LCB0aGVyZSdzIHRoZSBzY2hvb2xvZ3kvYXRoZW5hIGludGVncmF0aW9uIHN0dWZmLiBGaXJzdCwgd2UgbmVlZCB0byBjaGVjayBpZiBpdCdzIGJlZW4gbW9yZVxyXG4vLyB0aGFuIGEgZGF5LiBUaGVyZSdzIG5vIHBvaW50IGNvbnN0YW50bHkgcmV0cmlldmluZyBjbGFzc2VzIGZyb20gQXRoZW5hOyB0aGV5IGRvbnQndCBjaGFuZ2UgdGhhdFxyXG4vLyBtdWNoLlxyXG5cclxuLy8gVGhlbiwgb25jZSB0aGUgdmFyaWFibGUgZm9yIHRoZSBsYXN0IGRhdGUgaXMgaW5pdGlhbGl6ZWQsIGl0J3MgdGltZSB0byBnZXQgdGhlIGNsYXNzZXMgZnJvbVxyXG4vLyBhdGhlbmEuIEx1Y2tpbHksIHRoZXJlJ3MgdGhpcyBmaWxlIGF0IC9pYXBpL2NvdXJzZS9hY3RpdmUgLSBhbmQgaXQncyBpbiBKU09OISBMaWZlIGNhbid0IGJlIGFueVxyXG4vLyBiZXR0ZXIhIFNlcmlvdXNseSEgSXQncyBqdXN0IHRvbyBiYWQgdGhlIGxvZ2luIHBhZ2UgaXNuJ3QgaW4gSlNPTi5cclxuZnVuY3Rpb24gcGFyc2VBdGhlbmFEYXRhKGRhdDogc3RyaW5nKTogSUF0aGVuYURhdGF8bnVsbCB7XHJcbiAgICBpZiAoZGF0ID09PSAnJykgcmV0dXJuIG51bGxcclxuICAgIGNvbnN0IGQgPSBKU09OLnBhcnNlKGRhdCkgYXMgSVJhd0F0aGVuYURhdGFcclxuICAgIGNvbnN0IGF0aGVuYURhdGEyOiBJQXRoZW5hRGF0YSA9IHt9XHJcbiAgICBjb25zdCBhbGxDb3Vyc2VEZXRhaWxzOiB7IFtuaWQ6IG51bWJlcl06IElSYXdTZWN0aW9uIH0gPSB7fVxyXG4gICAgZC5ib2R5LmNvdXJzZXMuc2VjdGlvbnMuZm9yRWFjaCgoc2VjdGlvbikgPT4ge1xyXG4gICAgICAgIGFsbENvdXJzZURldGFpbHNbc2VjdGlvbi5jb3Vyc2VfbmlkXSA9IHNlY3Rpb25cclxuICAgIH0pXHJcbiAgICBkLmJvZHkuY291cnNlcy5jb3Vyc2VzLnJldmVyc2UoKS5mb3JFYWNoKChjb3Vyc2UpID0+IHtcclxuICAgICAgICBjb25zdCBjb3Vyc2VEZXRhaWxzID0gYWxsQ291cnNlRGV0YWlsc1tjb3Vyc2UubmlkXVxyXG4gICAgICAgIGF0aGVuYURhdGEyW2NvdXJzZS5jb3Vyc2VfdGl0bGVdID0ge1xyXG4gICAgICAgICAgICBsaW5rOiBgaHR0cHM6Ly9hdGhlbmEuaGFya2VyLm9yZyR7Y291cnNlRGV0YWlscy5saW5rfWAsXHJcbiAgICAgICAgICAgIGxvZ286IGZvcm1hdExvZ28oY291cnNlRGV0YWlscy5sb2dvKSxcclxuICAgICAgICAgICAgcGVyaW9kOiBjb3Vyc2VEZXRhaWxzLnNlY3Rpb25fdGl0bGVcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICAgcmV0dXJuIGF0aGVuYURhdGEyXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVBdGhlbmFEYXRhKGRhdGE6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgY29uc3QgcmVmcmVzaEVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2F0aGVuYURhdGFSZWZyZXNoJylcclxuICAgIHRyeSB7XHJcbiAgICAgICAgYXRoZW5hRGF0YSA9IHBhcnNlQXRoZW5hRGF0YShkYXRhKVxyXG4gICAgICAgIGxvY2FsU3RvcmFnZVdyaXRlKEFUSEVOQV9TVE9SQUdFX05BTUUsIGRhdGEpXHJcbiAgICAgICAgZWxlbUJ5SWQoJ2F0aGVuYURhdGFFcnJvcicpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcclxuICAgICAgICBpZiAocmVmcmVzaEVsKSByZWZyZXNoRWwuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICBlbGVtQnlJZCgnYXRoZW5hRGF0YUVycm9yJykuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcclxuICAgICAgICBpZiAocmVmcmVzaEVsKSByZWZyZXNoRWwuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xyXG4gICAgICAgIGVsZW1CeUlkKCdhdGhlbmFEYXRhRXJyb3InKS5pbm5lckhUTUwgPSBlLm1lc3NhZ2VcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBnZXREYXRhLCBJQXBwbGljYXRpb25EYXRhLCBJQXNzaWdubWVudCB9IGZyb20gJy4uL3BjcidcclxuaW1wb3J0IHsgbG9jYWxTdG9yYWdlUmVhZCwgbG9jYWxTdG9yYWdlV3JpdGUgfSBmcm9tICcuLi91dGlsJ1xyXG5cclxuY29uc3QgQ1VTVE9NX1NUT1JBR0VfTkFNRSA9ICdleHRyYSdcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUN1c3RvbUFzc2lnbm1lbnQge1xyXG4gICAgYm9keTogc3RyaW5nXHJcbiAgICBkb25lOiBib29sZWFuXHJcbiAgICBzdGFydDogbnVtYmVyXHJcbiAgICBjbGFzczogc3RyaW5nfG51bGxcclxuICAgIGVuZDogbnVtYmVyfCdGb3JldmVyJ1xyXG59XHJcblxyXG5jb25zdCBleHRyYTogSUN1c3RvbUFzc2lnbm1lbnRbXSA9IGxvY2FsU3RvcmFnZVJlYWQoQ1VTVE9NX1NUT1JBR0VfTkFNRSwgW10pXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0RXh0cmEoKTogSUN1c3RvbUFzc2lnbm1lbnRbXSB7XHJcbiAgICByZXR1cm4gZXh0cmFcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVFeHRyYSgpOiB2b2lkIHtcclxuICAgIGxvY2FsU3RvcmFnZVdyaXRlKENVU1RPTV9TVE9SQUdFX05BTUUsIGV4dHJhKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYWRkVG9FeHRyYShjdXN0b206IElDdXN0b21Bc3NpZ25tZW50KTogdm9pZCB7XHJcbiAgICBleHRyYS5wdXNoKGN1c3RvbSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUZyb21FeHRyYShjdXN0b206IElDdXN0b21Bc3NpZ25tZW50KTogdm9pZCB7XHJcbiAgICBpZiAoIWV4dHJhLmluY2x1ZGVzKGN1c3RvbSkpIHRocm93IG5ldyBFcnJvcignQ2Fubm90IHJlbW92ZSBjdXN0b20gYXNzaWdubWVudCB0aGF0IGRvZXMgbm90IGV4aXN0JylcclxuICAgIGV4dHJhLnNwbGljZShleHRyYS5pbmRleE9mKGN1c3RvbSksIDEpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBleHRyYVRvVGFzayhjdXN0b206IElDdXN0b21Bc3NpZ25tZW50LCBkYXRhOiBJQXBwbGljYXRpb25EYXRhKTogSUFzc2lnbm1lbnQge1xyXG4gICAgbGV0IGNsczogbnVtYmVyfG51bGwgPSBudWxsXHJcbiAgICBjb25zdCBjbGFzc05hbWUgPSBjdXN0b20uY2xhc3NcclxuICAgIGlmIChjbGFzc05hbWUgIT0gbnVsbCkge1xyXG4gICAgICAgIGNscyA9IGRhdGEuY2xhc3Nlcy5maW5kSW5kZXgoKGMpID0+IGMudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhjbGFzc05hbWUpKVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdGl0bGU6ICdUYXNrJyxcclxuICAgICAgICBiYXNlVHlwZTogJ3Rhc2snLFxyXG4gICAgICAgIHR5cGU6ICd0YXNrJyxcclxuICAgICAgICBhdHRhY2htZW50czogW10sXHJcbiAgICAgICAgc3RhcnQ6IGN1c3RvbS5zdGFydCxcclxuICAgICAgICBlbmQ6IGN1c3RvbS5lbmQgfHwgJ0ZvcmV2ZXInLFxyXG4gICAgICAgIGJvZHk6IGN1c3RvbS5ib2R5LFxyXG4gICAgICAgIGlkOiBgdGFzayR7Y3VzdG9tLmJvZHkucmVwbGFjZSgvW15cXHddKi9nLCAnJyl9JHtjdXN0b20uc3RhcnR9JHtjdXN0b20uZW5kfSR7Y3VzdG9tLmNsYXNzfWAsXHJcbiAgICAgICAgY2xhc3M6IGNscyA9PT0gLTEgPyBudWxsIDogY2xzXHJcbiAgICB9XHJcbn1cclxuXHJcbmludGVyZmFjZSBJUGFyc2VSZXN1bHQge1xyXG4gICAgdGV4dDogc3RyaW5nXHJcbiAgICBjbHM/OiBzdHJpbmdcclxuICAgIGR1ZT86IHN0cmluZ1xyXG4gICAgc3Q/OiBzdHJpbmdcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlQ3VzdG9tVGFzayh0ZXh0OiBzdHJpbmcsIHJlc3VsdDogSVBhcnNlUmVzdWx0ID0geyB0ZXh0OiAnJyB9KTogSVBhcnNlUmVzdWx0IHtcclxuICAgIGNvbnN0IHBhcnNlZCA9IHRleHQubWF0Y2goLyguKikgKGZvcnxieXxkdWV8YXNzaWduZWR8c3RhcnRpbmd8ZW5kaW5nfGJlZ2lubmluZykgKC4qKS8pXHJcbiAgICBpZiAocGFyc2VkID09IG51bGwpIHtcclxuICAgICAgICByZXN1bHQudGV4dCA9IHRleHRcclxuICAgICAgICByZXR1cm4gcmVzdWx0XHJcbiAgICB9XHJcblxyXG4gICAgc3dpdGNoIChwYXJzZWRbMl0pIHtcclxuICAgICAgICBjYXNlICdmb3InOiByZXN1bHQuY2xzID0gcGFyc2VkWzNdOyBicmVha1xyXG4gICAgICAgIGNhc2UgJ2J5JzogY2FzZSAnZHVlJzogY2FzZSAnZW5kaW5nJzogcmVzdWx0LmR1ZSA9IHBhcnNlZFszXTsgYnJlYWtcclxuICAgICAgICBjYXNlICdhc3NpZ25lZCc6IGNhc2UgJ3N0YXJ0aW5nJzogY2FzZSAnYmVnaW5uaW5nJzogcmVzdWx0LnN0ID0gcGFyc2VkWzNdOyBicmVha1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBwYXJzZUN1c3RvbVRhc2socGFyc2VkWzFdLCByZXN1bHQpXHJcbn1cclxuIiwiaW1wb3J0IHsgbG9jYWxTdG9yYWdlUmVhZCwgbG9jYWxTdG9yYWdlV3JpdGUgfSBmcm9tICcuLi91dGlsJ1xyXG5cclxuY29uc3QgRE9ORV9TVE9SQUdFX05BTUUgPSAnZG9uZSdcclxuXHJcbmNvbnN0IGRvbmU6IHN0cmluZ1tdID0gbG9jYWxTdG9yYWdlUmVhZChET05FX1NUT1JBR0VfTkFNRSwgW10pXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlRnJvbURvbmUoaWQ6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgY29uc3QgaW5kZXggPSBkb25lLmluZGV4T2YoaWQpXHJcbiAgICBpZiAoaW5kZXggPj0gMCkgZG9uZS5zcGxpY2UoaW5kZXgsIDEpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBhZGRUb0RvbmUoaWQ6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgZG9uZS5wdXNoKGlkKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2F2ZURvbmUoKTogdm9pZCB7XHJcbiAgICBsb2NhbFN0b3JhZ2VXcml0ZShET05FX1NUT1JBR0VfTkFNRSwgZG9uZSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFzc2lnbm1lbnRJbkRvbmUoaWQ6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIGRvbmUuaW5jbHVkZXMoaWQpXHJcbn1cclxuIiwiaW1wb3J0IHsgbG9jYWxTdG9yYWdlUmVhZCwgbG9jYWxTdG9yYWdlV3JpdGUgfSBmcm9tICcuLi91dGlsJ1xyXG5cclxuY29uc3QgTU9ESUZJRURfU1RPUkFHRV9OQU1FID0gJ21vZGlmaWVkJ1xyXG5cclxuaW50ZXJmYWNlIElNb2RpZmllZEJvZGllcyB7XHJcbiAgICBbaWQ6IHN0cmluZ106IHN0cmluZ1xyXG59XHJcblxyXG5jb25zdCBtb2RpZmllZDogSU1vZGlmaWVkQm9kaWVzID0gbG9jYWxTdG9yYWdlUmVhZChNT0RJRklFRF9TVE9SQUdFX05BTUUsIHt9KVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUZyb21Nb2RpZmllZChpZDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICBkZWxldGUgbW9kaWZpZWRbaWRdXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlTW9kaWZpZWQoKTogdm9pZCB7XHJcbiAgICBsb2NhbFN0b3JhZ2VXcml0ZShNT0RJRklFRF9TVE9SQUdFX05BTUUsIG1vZGlmaWVkKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYXNzaWdubWVudEluTW9kaWZpZWQoaWQ6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIG1vZGlmaWVkLmhhc093blByb3BlcnR5KGlkKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbW9kaWZpZWRCb2R5KGlkOiBzdHJpbmcpOiBzdHJpbmd8dW5kZWZpbmVkIHtcclxuICAgIHJldHVybiBtb2RpZmllZFtpZF1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNldE1vZGlmaWVkKGlkOiBzdHJpbmcsIGJvZHk6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgbW9kaWZpZWRbaWRdID0gYm9keVxyXG59XHJcbiIsImltcG9ydCB7IGxvY2FsU3RvcmFnZVJlYWQsIGxvY2FsU3RvcmFnZVdyaXRlIH0gZnJvbSAnLi91dGlsJ1xyXG5cclxudHlwZSBBc3NpZ25tZW50U3BhbiA9ICdtdWx0aXBsZScgfCAnc3RhcnQnIHwgJ2VuZCdcclxudHlwZSBIaWRlQXNzaWdubWVudHMgPSAnZGF5JyB8ICdtcycgfCAndXMnXHJcbnR5cGUgQ29sb3JUeXBlID0gJ2Fzc2lnbm1lbnQnIHwgJ2NsYXNzJ1xyXG5pbnRlcmZhY2UgSVNob3duQWN0aXZpdHkge1xyXG4gICAgYWRkOiBib29sZWFuXHJcbiAgICBlZGl0OiBib29sZWFuXHJcbiAgICBkZWxldGU6IGJvb2xlYW5cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHNldHRpbmdzID0ge1xyXG4gICAgLyoqXHJcbiAgICAgKiBNaW51dGVzIGJldHdlZW4gZWFjaCBhdXRvbWF0aWMgcmVmcmVzaCBvZiB0aGUgcGFnZS4gTmVnYXRpdmUgbnVtYmVycyBpbmRpY2F0ZSBubyBhdXRvbWF0aWNcclxuICAgICAqIHJlZnJlc2hpbmcuXHJcbiAgICAgKi9cclxuICAgIGdldCByZWZyZXNoUmF0ZSgpOiBudW1iZXIgeyByZXR1cm4gbG9jYWxTdG9yYWdlUmVhZCgncmVmcmVzaFJhdGUnLCAtMSkgfSxcclxuICAgIHNldCByZWZyZXNoUmF0ZSh2OiBudW1iZXIpIHsgbG9jYWxTdG9yYWdlV3JpdGUoJ3JlZnJlc2hSYXRlJywgdikgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIFdoZXRoZXIgdGhlIHdpbmRvdyBzaG91bGQgcmVmcmVzaCBhc3NpZ25tZW50IGRhdGEgd2hlbiBmb2N1c3NlZFxyXG4gICAgICovXHJcbiAgICBnZXQgcmVmcmVzaE9uRm9jdXMoKTogYm9vbGVhbiB7IHJldHVybiBsb2NhbFN0b3JhZ2VSZWFkKCdyZWZyZXNoT25Gb2N1cycsIHRydWUpIH0sXHJcbiAgICBzZXQgcmVmcmVzaE9uRm9jdXModjogYm9vbGVhbikgeyBsb2NhbFN0b3JhZ2VXcml0ZSgncmVmcmVzaE9uRm9jdXMnLCB2KSB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogV2hldGhlciBzd2l0Y2hpbmcgYmV0d2VlbiB2aWV3cyBzaG91bGQgYmUgYW5pbWF0ZWRcclxuICAgICAqL1xyXG4gICAgZ2V0IHZpZXdUcmFucygpOiBib29sZWFuIHsgcmV0dXJuIGxvY2FsU3RvcmFnZVJlYWQoJ3ZpZXdUcmFucycsIHRydWUpIH0sXHJcbiAgICBzZXQgdmlld1RyYW5zKHY6IGJvb2xlYW4pIHsgbG9jYWxTdG9yYWdlV3JpdGUoJ3ZpZXdUcmFucycsIHYpIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBOdW1iZXIgb2YgZGF5cyBlYXJseSB0byBzaG93IHRlc3RzIGluIGxpc3Qgdmlld1xyXG4gICAgICovXHJcbiAgICBnZXQgZWFybHlUZXN0KCk6IG51bWJlciB7IHJldHVybiBsb2NhbFN0b3JhZ2VSZWFkKCdlYXJseVRlc3QnLCAxKSB9LFxyXG4gICAgc2V0IGVhcmx5VGVzdCh2OiBudW1iZXIpIHsgbG9jYWxTdG9yYWdlV3JpdGUoJ2Vhcmx5VGVzdCcsIHYpIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBXaGV0aGVyIHRvIHRha2UgdGFza3Mgb2ZmIHRoZSBjYWxlbmRhciB2aWV3IGFuZCBzaG93IHRoZW0gaW4gdGhlIGluZm8gcGFuZVxyXG4gICAgICovXHJcbiAgICBnZXQgc2VwVGFza3MoKTogYm9vbGVhbiB7IHJldHVybiBsb2NhbFN0b3JhZ2VSZWFkKCdzZXBUYXNrcycsIGZhbHNlKSB9LFxyXG4gICAgc2V0IHNlcFRhc2tzKHY6IGJvb2xlYW4pIHsgbG9jYWxTdG9yYWdlV3JpdGUoJ3NlcFRhc2tzJywgdikgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIFdoZXRoZXIgdGFza3Mgc2hvdWxkIGhhdmUgdGhlaXIgb3duIGNvbG9yXHJcbiAgICAgKi9cclxuICAgIGdldCBzZXBUYXNrQ2xhc3MoKTogYm9vbGVhbiB7IHJldHVybiBsb2NhbFN0b3JhZ2VSZWFkKCdzZXBUYXNrQ2xhc3MnLCBmYWxzZSkgfSxcclxuICAgIHNldCBzZXBUYXNrQ2xhc3ModjogYm9vbGVhbikgeyBsb2NhbFN0b3JhZ2VXcml0ZSgnc2VwVGFza0NsYXNzJywgdikgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIFdoZXRoZXIgcHJvamVjdHMgc2hvdyB1cCBpbiB0aGUgdGVzdCBwYWdlXHJcbiAgICAgKi9cclxuICAgIGdldCBwcm9qZWN0c0luVGVzdFBhbmUoKTogYm9vbGVhbiB7IHJldHVybiBsb2NhbFN0b3JhZ2VSZWFkKCdwcm9qZWN0c0luVGVzdFBhbmUnLCBmYWxzZSkgfSxcclxuICAgIHNldCBwcm9qZWN0c0luVGVzdFBhbmUodjogYm9vbGVhbikgeyBsb2NhbFN0b3JhZ2VXcml0ZSgncHJvamVjdHNJblRlc3RQYW5lJywgdikgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIFdoZW4gYXNzaWdubWVudHMgc2hvdWxkIGJlIHNob3duIG9uIGNhbGVuZGFyIHZpZXdcclxuICAgICAqL1xyXG4gICAgZ2V0IGFzc2lnbm1lbnRTcGFuKCk6IEFzc2lnbm1lbnRTcGFuIHsgcmV0dXJuIGxvY2FsU3RvcmFnZVJlYWQoJ2Fzc2lnbm1lbnRTcGFuJywgJ211bHRpcGxlJykgfSxcclxuICAgIHNldCBhc3NpZ25tZW50U3Bhbih2OiBBc3NpZ25tZW50U3BhbikgeyBsb2NhbFN0b3JhZ2VXcml0ZSgnYXNzaWdubWVudFNwYW4nLCB2KSB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogV2hlbiBhc3NpZ25tZW50cyBzaG91bGQgZGlzYXBwZWFyIGZyb20gbGlzdCB2aWV3XHJcbiAgICAgKi9cclxuICAgIGdldCBoaWRlQXNzaWdubWVudHMoKTogSGlkZUFzc2lnbm1lbnRzIHsgcmV0dXJuIGxvY2FsU3RvcmFnZVJlYWQoJ2hpZGVBc3NpZ25tZW50cycsICdkYXknKSB9LFxyXG4gICAgc2V0IGhpZGVBc3NpZ25tZW50cyh2OiBIaWRlQXNzaWdubWVudHMpIHsgbG9jYWxTdG9yYWdlV3JpdGUoJ2hpZGVBc3NpZ25tZW50cycsIHYpIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBXaGV0aGVyIHRvIHVzZSBob2xpZGF5IHRoZW1pbmdcclxuICAgICAqL1xyXG4gICAgZ2V0IGhvbGlkYXlUaGVtZXMoKTogYm9vbGVhbiB7IHJldHVybiBsb2NhbFN0b3JhZ2VSZWFkKCdob2xpZGF5VGhlbWVzJywgZmFsc2UpIH0sXHJcbiAgICBzZXQgaG9saWRheVRoZW1lcyh2OiBib29sZWFuKSB7IGxvY2FsU3RvcmFnZVdyaXRlKCdob2xpZGF5VGhlbWVzJywgdikgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIFdoZXRoZXIgdG8gY29sb3IgYXNzaWdubWVudHMgYmFzZWQgb24gdGhlaXIgdHlwZSBvciBjbGFzc1xyXG4gICAgICovXHJcbiAgICBnZXQgY29sb3JUeXBlKCk6IENvbG9yVHlwZSB7IHJldHVybiBsb2NhbFN0b3JhZ2VSZWFkKCdjb2xvclR5cGUnLCAnYXNzaWdubWVudCcpIH0sXHJcbiAgICBzZXQgY29sb3JUeXBlKHY6IENvbG9yVHlwZSkgeyBsb2NhbFN0b3JhZ2VXcml0ZSgnY29sb3JUeXBlJywgdikgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIFdoaWNoIHR5cGVzIG9mIGFjdGl2aXR5IGFyZSBzaG93biBpbiB0aGUgYWN0aXZpdHkgcGFuZVxyXG4gICAgICovXHJcbiAgICBnZXQgc2hvd25BY3Rpdml0eSgpOiBJU2hvd25BY3Rpdml0eSB7IHJldHVybiBsb2NhbFN0b3JhZ2VSZWFkKCdzaG93bkFjdGl2aXR5Jywge1xyXG4gICAgICAgIGFkZDogdHJ1ZSxcclxuICAgICAgICBlZGl0OiB0cnVlLFxyXG4gICAgICAgIGRlbGV0ZTogdHJ1ZVxyXG4gICAgfSkgfSxcclxuICAgIHNldCBzaG93bkFjdGl2aXR5KHY6IElTaG93bkFjdGl2aXR5KSB7IGxvY2FsU3RvcmFnZVdyaXRlKCdzaG93bkFjdGl2aXR5JywgdikgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIFdoZXRoZXIgdG8gZGlzcGxheSB0YXNrcyBpbiB0aGUgdGFzayBwYW5lIHRoYXQgYXJlIGNvbXBsZXRlZFxyXG4gICAgICovXHJcbiAgICBnZXQgc2hvd0RvbmVUYXNrcygpOiBib29sZWFuIHsgcmV0dXJuIGxvY2FsU3RvcmFnZVJlYWQoJ3Nob3dEb25lVGFza3MnLCBmYWxzZSkgfSxcclxuICAgIHNldCBzaG93RG9uZVRhc2tzKHY6IGJvb2xlYW4pIHsgbG9jYWxTdG9yYWdlV3JpdGUoJ3Nob3dEb25lVGFza3MnLCB2KSB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRTZXR0aW5nKG5hbWU6IHN0cmluZyk6IGFueSB7XHJcbiAgICBpZiAoIXNldHRpbmdzLmhhc093blByb3BlcnR5KG5hbWUpKSB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgc2V0dGluZyBuYW1lICR7bmFtZX1gKVxyXG4gICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgcmV0dXJuIHNldHRpbmdzW25hbWVdXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRTZXR0aW5nKG5hbWU6IHN0cmluZywgdmFsdWU6IGFueSk6IHZvaWQge1xyXG4gICAgaWYgKCFzZXR0aW5ncy5oYXNPd25Qcm9wZXJ0eShuYW1lKSkgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHNldHRpbmcgbmFtZSAke25hbWV9YClcclxuICAgIC8vIEB0cy1pZ25vcmVcclxuICAgIHNldHRpbmdzW25hbWVdID0gdmFsdWVcclxufVxyXG4iLCJpbXBvcnQgeyBmcm9tRGF0ZU51bSwgdG9EYXRlTnVtIH0gZnJvbSAnLi9kYXRlcydcclxuXHJcbi8vIEB0cy1pZ25vcmUgVE9ETzogTWFrZSB0aGlzIGxlc3MgaGFja3lcclxuTm9kZUxpc3QucHJvdG90eXBlLmZvckVhY2ggPSBIVE1MQ29sbGVjdGlvbi5wcm90b3R5cGUuZm9yRWFjaCA9IEFycmF5LnByb3RvdHlwZS5mb3JFYWNoXHJcblxyXG4vKipcclxuICogRm9yY2VzIGEgbGF5b3V0IG9uIGFuIGVsZW1lbnRcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBmb3JjZUxheW91dChlbDogSFRNTEVsZW1lbnQpOiB2b2lkIHtcclxuICAgIC8vIFRoaXMgaW52b2x2ZXMgYSBsaXR0bGUgdHJpY2tlcnkgaW4gdGhhdCBieSByZXF1ZXN0aW5nIHRoZSBjb21wdXRlZCBoZWlnaHQgb2YgdGhlIGVsZW1lbnQgdGhlXHJcbiAgICAvLyBicm93c2VyIGlzIGZvcmNlZCB0byBkbyBhIGZ1bGwgbGF5b3V0XHJcblxyXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC1leHByZXNzaW9uXHJcbiAgICBlbC5vZmZzZXRIZWlnaHRcclxufVxyXG5cclxuLyoqXHJcbiAqIFJldHVybiBhIHN0cmluZyB3aXRoIHRoZSBmaXJzdCBsZXR0ZXIgY2FwaXRhbGl6ZWRcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBjYXBpdGFsaXplU3RyaW5nKHN0cjogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIHJldHVybiBzdHIuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHIuc3Vic3RyKDEpXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZXR1cm5zIGFuIFhNTEh0dHBSZXF1ZXN0IHdpdGggdGhlIHNwZWNpZmllZCB1cmwsIHJlc3BvbnNlIHR5cGUsIGhlYWRlcnMsIGFuZCBkYXRhXHJcbiAqL1xyXG5mdW5jdGlvbiBjb25zdHJ1Y3RYTUxIdHRwUmVxdWVzdCh1cmw6IHN0cmluZywgcmVzcFR5cGU/OiBYTUxIdHRwUmVxdWVzdFJlc3BvbnNlVHlwZXxudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXJzPzoge1tuYW1lOiBzdHJpbmddOiBzdHJpbmd9fG51bGwsIGRhdGE/OiBzdHJpbmd8bnVsbCk6IFhNTEh0dHBSZXF1ZXN0IHtcclxuICAgIGNvbnN0IHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXHJcblxyXG4gICAgLy8gSWYgUE9TVCBkYXRhIGlzIHByb3ZpZGVkIHNlbmQgYSBQT1NUIHJlcXVlc3QsIG90aGVyd2lzZSBzZW5kIGEgR0VUIHJlcXVlc3RcclxuICAgIHJlcS5vcGVuKChkYXRhID8gJ1BPU1QnIDogJ0dFVCcpLCB1cmwsIHRydWUpXHJcblxyXG4gICAgaWYgKHJlc3BUeXBlKSByZXEucmVzcG9uc2VUeXBlID0gcmVzcFR5cGVcclxuXHJcbiAgICBpZiAoaGVhZGVycykge1xyXG4gICAgICAgIE9iamVjdC5rZXlzKGhlYWRlcnMpLmZvckVhY2goKGhlYWRlcikgPT4ge1xyXG4gICAgICAgICAgICByZXEuc2V0UmVxdWVzdEhlYWRlcihoZWFkZXIsIGhlYWRlcnNbaGVhZGVyXSlcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIC8vIElmIGRhdGEgaXMgdW5kZWZpbmVkIGRlZmF1bHQgdG8gdGhlIG5vcm1hbCByZXEuc2VuZCgpLCBvdGhlcndpc2UgcGFzcyB0aGUgZGF0YSBpblxyXG4gICAgcmVxLnNlbmQoZGF0YSlcclxuICAgIHJldHVybiByZXFcclxufVxyXG5cclxuLyoqIFNlbmRzIGEgcmVxdWVzdCB0byBhIHNlcnZlciBhbmQgcmV0dXJucyBhIFByb21pc2UuXHJcbiAqIEBwYXJhbSB1cmwgdGhlIHVybCB0byByZXRyaWV2ZVxyXG4gKiBAcGFyYW0gcmVzcFR5cGUgdGhlIHR5cGUgb2YgcmVzcG9uc2UgdGhhdCBzaG91bGQgYmUgcmVjZWl2ZWRcclxuICogQHBhcmFtIGhlYWRlcnMgdGhlIGhlYWRlcnMgdGhhdCB3aWxsIGJlIHNlbnQgdG8gdGhlIHNlcnZlclxyXG4gKiBAcGFyYW0gZGF0YSB0aGUgZGF0YSB0aGF0IHdpbGwgYmUgc2VudCB0byB0aGUgc2VydmVyIChvbmx5IGZvciBQT1NUIHJlcXVlc3RzKVxyXG4gKiBAcGFyYW0gcHJvZ3Jlc3NFbGVtZW50IGFuIG9wdGlvbmFsIGVsZW1lbnQgZm9yIHRoZSBwcm9ncmVzcyBiYXIgdXNlZCB0byBkaXNwbGF5IHRoZSBzdGF0dXMgb2YgdGhlIHJlcXVlc3RcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBzZW5kKHVybDogc3RyaW5nLCByZXNwVHlwZT86IFhNTEh0dHBSZXF1ZXN0UmVzcG9uc2VUeXBlfG51bGwsIGhlYWRlcnM/OiB7W25hbWU6IHN0cmluZ106IHN0cmluZ318bnVsbCxcclxuICAgICAgICAgICAgICAgICAgICAgZGF0YT86IHN0cmluZ3xudWxsLCBwcm9ncmVzcz86IEhUTUxFbGVtZW50fG51bGwpOiBQcm9taXNlPFhNTEh0dHBSZXF1ZXN0PiB7XHJcblxyXG4gICAgY29uc3QgcmVxID0gY29uc3RydWN0WE1MSHR0cFJlcXVlc3QodXJsLCByZXNwVHlwZSwgaGVhZGVycywgZGF0YSlcclxuXHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cclxuICAgICAgICBjb25zdCBwcm9ncmVzc0lubmVyID0gcHJvZ3Jlc3MgPyBwcm9ncmVzcy5xdWVyeVNlbGVjdG9yKCdkaXYnKSA6IG51bGxcclxuICAgICAgICBpZiAocHJvZ3Jlc3MgJiYgcHJvZ3Jlc3NJbm5lcikge1xyXG4gICAgICAgICAgICBmb3JjZUxheW91dChwcm9ncmVzc0lubmVyKSAvLyBXYWl0IGZvciBpdCB0byByZW5kZXJcclxuICAgICAgICAgICAgcHJvZ3Jlc3MuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJykgLy8gRGlzcGxheSB0aGUgcHJvZ3Jlc3MgYmFyXHJcbiAgICAgICAgICAgIGlmIChwcm9ncmVzc0lubmVyLmNsYXNzTGlzdC5jb250YWlucygnZGV0ZXJtaW5hdGUnKSkge1xyXG4gICAgICAgICAgICAgICAgcHJvZ3Jlc3NJbm5lci5jbGFzc0xpc3QucmVtb3ZlKCdkZXRlcm1pbmF0ZScpXHJcbiAgICAgICAgICAgICAgICBwcm9ncmVzc0lubmVyLmNsYXNzTGlzdC5hZGQoJ2luZGV0ZXJtaW5hdGUnKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBTb21ldGltZXMgdGhlIGJyb3dzZXIgd29uJ3QgZ2l2ZSB0aGUgdG90YWwgYnl0ZXMgaW4gdGhlIHJlc3BvbnNlLCBzbyB1c2UgcGFzdCByZXN1bHRzIG9yXHJcbiAgICAgICAgLy8gYSBkZWZhdWx0IG9mIDE3MCwwMDAgYnl0ZXMgaWYgdGhlIGJyb3dzZXIgZG9lc24ndCBwcm92aWRlIHRoZSBudW1iZXJcclxuICAgICAgICBjb25zdCBsb2FkID0gbG9jYWxTdG9yYWdlUmVhZCgnbG9hZCcsIDE3MDAwMClcclxuICAgICAgICBsZXQgY29tcHV0ZWRMb2FkID0gMFxyXG5cclxuICAgICAgICByZXEuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIChldnQpID0+IHtcclxuICAgICAgICAgICAgLy8gQ2FjaGUgdGhlIG51bWJlciBvZiBieXRlcyBsb2FkZWQgc28gaXQgY2FuIGJlIHVzZWQgZm9yIGJldHRlciBlc3RpbWF0ZXMgbGF0ZXIgb25cclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlV3JpdGUoJ2xvYWQnLCBjb21wdXRlZExvYWQpXHJcbiAgICAgICAgICAgIGlmIChwcm9ncmVzcykgcHJvZ3Jlc3MuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcclxuICAgICAgICAgICAgLy8gUmVzb2x2ZSB3aXRoIHRoZSByZXF1ZXN0XHJcbiAgICAgICAgICAgIGlmIChyZXEuc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUocmVxKVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KEVycm9yKHJlcS5zdGF0dXNUZXh0KSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIHJlcS5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKHByb2dyZXNzKSBwcm9ncmVzcy5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gICAgICAgICAgICByZWplY3QoRXJyb3IoJ05ldHdvcmsgRXJyb3InKSlcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICBpZiAocHJvZ3Jlc3MgJiYgcHJvZ3Jlc3NJbm5lcikge1xyXG4gICAgICAgICAgICByZXEuYWRkRXZlbnRMaXN0ZW5lcigncHJvZ3Jlc3MnLCAoZXZ0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyBVcGRhdGUgdGhlIHByb2dyZXNzIGJhclxyXG4gICAgICAgICAgICAgICAgaWYgKHByb2dyZXNzSW5uZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdpbmRldGVybWluYXRlJykpIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9ncmVzc0lubmVyLmNsYXNzTGlzdC5yZW1vdmUoJ2luZGV0ZXJtaW5hdGUnKVxyXG4gICAgICAgICAgICAgICAgICAgIHByb2dyZXNzSW5uZXIuY2xhc3NMaXN0LmFkZCgnZGV0ZXJtaW5hdGUnKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29tcHV0ZWRMb2FkID0gZXZ0LmxvYWRlZFxyXG4gICAgICAgICAgICAgICAgcHJvZ3Jlc3NJbm5lci5zdHlsZS53aWR0aCA9ICgoMTAwICogZXZ0LmxvYWRlZCkgLyAoZXZ0Lmxlbmd0aENvbXB1dGFibGUgPyBldnQudG90YWwgOiBsb2FkKSkgKyAnJSdcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59XHJcblxyXG4vKipcclxuICogVGhlIGVxdWl2YWxlbnQgb2YgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQgYnV0IHRocm93cyBhbiBlcnJvciBpZiB0aGUgZWxlbWVudCBpcyBub3QgZGVmaW5lZFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGVsZW1CeUlkKGlkOiBzdHJpbmcpOiBIVE1MRWxlbWVudCB7XHJcbiAgICBjb25zdCBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKVxyXG4gICAgaWYgKGVsID09IG51bGwpIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGZpbmQgZWxlbWVudCB3aXRoIGlkICR7aWR9YClcclxuICAgIHJldHVybiBlbFxyXG59XHJcblxyXG4vKipcclxuICogQSBsaXR0bGUgaGVscGVyIGZ1bmN0aW9uIHRvIHNpbXBsaWZ5IHRoZSBjcmVhdGlvbiBvZiBIVE1MIGVsZW1lbnRzXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZWxlbWVudCh0YWc6IHN0cmluZywgY2xzOiBzdHJpbmd8c3RyaW5nW10sIGh0bWw/OiBzdHJpbmd8bnVsbCwgaWQ/OiBzdHJpbmd8bnVsbCk6IEhUTUxFbGVtZW50IHtcclxuICAgIGNvbnN0IGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZylcclxuXHJcbiAgICBpZiAodHlwZW9mIGNscyA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICBlLmNsYXNzTGlzdC5hZGQoY2xzKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBjbHMuZm9yRWFjaCgoYykgPT4gZS5jbGFzc0xpc3QuYWRkKGMpKVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChodG1sKSBlLmlubmVySFRNTCA9IGh0bWxcclxuICAgIGlmIChpZCkgZS5zZXRBdHRyaWJ1dGUoJ2lkJywgaWQpXHJcblxyXG4gICAgcmV0dXJuIGVcclxufVxyXG5cclxuLyoqXHJcbiAqIFRocm93cyBhbiBlcnJvciBpZiB0aGUgc3VwcGxpZWQgYXJndW1lbnQgaXMgbnVsbCwgb3RoZXJ3aXNlIHJldHVybnMgdGhlIGFyZ3VtZW50XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gXyQ8VD4oYXJnOiBUfG51bGwpOiBUIHtcclxuICAgIGlmIChhcmcgPT0gbnVsbCkgdGhyb3cgbmV3IEVycm9yKCdFeHBlY3RlZCBhcmd1bWVudCB0byBiZSBub24tbnVsbCcpXHJcbiAgICByZXR1cm4gYXJnXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfJGgoYXJnOiBOb2RlfEV2ZW50VGFyZ2V0fG51bGwpOiBIVE1MRWxlbWVudCB7XHJcbiAgICBpZiAoYXJnID09IG51bGwpIHRocm93IG5ldyBFcnJvcignRXhwZWN0ZWQgbm9kZSB0byBiZSBub24tbnVsbCcpXHJcbiAgICBpZiAoIShhcmcgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkpIHRocm93IG5ldyBFcnJvcignTm9kZSBpcyBub3QgYW4gSFRNTCBlbGVtZW50JylcclxuICAgIHJldHVybiBhcmdcclxufVxyXG5cclxuLy8gQmVjYXVzZSBzb21lIGxvY2FsU3RvcmFnZSBlbnRyaWVzIGNhbiBiZWNvbWUgY29ycnVwdGVkIGR1ZSB0byBlcnJvciBzaWRlIGVmZmVjdHMsIHRoZSBiZWxvd1xyXG4vLyBtZXRob2QgdHJpZXMgdG8gcmVhZCBhIHZhbHVlIGZyb20gbG9jYWxTdG9yYWdlIGFuZCBoYW5kbGVzIGVycm9ycy5cclxuZXhwb3J0IGZ1bmN0aW9uIGxvY2FsU3RvcmFnZVJlYWQobmFtZTogc3RyaW5nKTogYW55XHJcbmV4cG9ydCBmdW5jdGlvbiBsb2NhbFN0b3JhZ2VSZWFkPFI+KG5hbWU6IHN0cmluZywgZGVmYXVsdFZhbDogKCkgPT4gUik6IFJcclxuZXhwb3J0IGZ1bmN0aW9uIGxvY2FsU3RvcmFnZVJlYWQ8VD4obmFtZTogc3RyaW5nLCBkZWZhdWx0VmFsOiBUKTogVFxyXG5leHBvcnQgZnVuY3Rpb24gbG9jYWxTdG9yYWdlUmVhZChuYW1lOiBzdHJpbmcsIGRlZmF1bHRWYWw/OiBhbnkpOiBhbnkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2VbbmFtZV0pXHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBkZWZhdWx0VmFsID09PSAnZnVuY3Rpb24nID8gZGVmYXVsdFZhbCgpIDogZGVmYXVsdFZhbFxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbG9jYWxTdG9yYWdlV3JpdGUobmFtZTogc3RyaW5nLCBpdGVtOiBhbnkpOiB2b2lkIHtcclxuICAgIGxvY2FsU3RvcmFnZVtuYW1lXSA9IEpTT04uc3RyaW5naWZ5KGl0ZW0pXHJcbn1cclxuXHJcbmludGVyZmFjZSBJZGxlRGVhZGxpbmUge1xyXG4gICAgZGlkVGltZW91dDogYm9vbGVhblxyXG4gICAgdGltZVJlbWFpbmluZzogKCkgPT4gbnVtYmVyXHJcbn1cclxuXHJcbi8vIEJlY2F1c2UgdGhlIHJlcXVlc3RJZGxlQ2FsbGJhY2sgZnVuY3Rpb24gaXMgdmVyeSBuZXcgKGFzIG9mIHdyaXRpbmcgb25seSB3b3JrcyB3aXRoIENocm9tZVxyXG4vLyB2ZXJzaW9uIDQ3KSwgdGhlIGJlbG93IGZ1bmN0aW9uIHBvbHlmaWxscyB0aGF0IG1ldGhvZC5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlcXVlc3RJZGxlQ2FsbGJhY2soY2I6IChkZWFkbGluZTogSWRsZURlYWRsaW5lKSA9PiB2b2lkLCBvcHRzOiB7IHRpbWVvdXQ6IG51bWJlcn0pOiBudW1iZXIge1xyXG4gICAgaWYgKCdyZXF1ZXN0SWRsZUNhbGxiYWNrJyBpbiB3aW5kb3cpIHtcclxuICAgICAgICByZXR1cm4gKHdpbmRvdyBhcyBhbnkpLnJlcXVlc3RJZGxlQ2FsbGJhY2soY2IsIG9wdHMpXHJcbiAgICB9XHJcbiAgICBjb25zdCBzdGFydCA9IERhdGUubm93KClcclxuXHJcbiAgICByZXR1cm4gc2V0VGltZW91dCgoKSA9PiBjYih7XHJcbiAgICAgICAgZGlkVGltZW91dDogZmFsc2UsXHJcbiAgICAgICAgdGltZVJlbWFpbmluZygpOiBudW1iZXIge1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5tYXgoMCwgNTAgLSAoRGF0ZS5ub3coKSAtIHN0YXJ0KSlcclxuICAgICAgICB9XHJcbiAgICB9KSwgMSlcclxufVxyXG5cclxuLyoqXHJcbiAqIERldGVybWluZSBpZiB0aGUgdHdvIGRhdGVzIGhhdmUgdGhlIHNhbWUgeWVhciwgbW9udGgsIGFuZCBkYXlcclxuICovXHJcbmZ1bmN0aW9uIGRhdGVzRXF1YWwoYTogRGF0ZSwgYjogRGF0ZSk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRvRGF0ZU51bShhKSA9PT0gdG9EYXRlTnVtKGIpXHJcbn1cclxuXHJcbmNvbnN0IERBVEVfUkVMQVRJVkVOQU1FUzoge1tuYW1lOiBzdHJpbmddOiBudW1iZXJ9ID0ge1xyXG4gICAgJ1RvbW9ycm93JzogMSxcclxuICAgICdUb2RheSc6IDAsXHJcbiAgICAnWWVzdGVyZGF5JzogLTEsXHJcbiAgICAnMiBkYXlzIGFnbyc6IC0yXHJcbn1cclxuY29uc3QgV0VFS0RBWVMgPSBbJ1N1bmRheScsICdNb25kYXknLCAnVHVlc2RheScsICdXZWRuZXNkYXknLCAnVGh1cnNkYXknLCAnRnJpZGF5JywgJ1NhdHVyZGF5J11cclxuY29uc3QgRlVMTE1PTlRIUyA9IFsnSmFudWFyeScsICdGZWJydWFyeScsICdNYXJjaCcsICdBcHJpbCcsICdNYXknLCAnSnVuZScsICdKdWx5JywgJ0F1Z3VzdCcsICdTZXB0ZW1iZXInLCAnT2N0b2JlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgJ05vdmVtYmVyJywgJ0RlY2VtYmVyJ11cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkYXRlU3RyaW5nKGRhdGU6IERhdGV8bnVtYmVyfCdGb3JldmVyJywgYWRkVGhpczogYm9vbGVhbiA9IGZhbHNlKTogc3RyaW5nIHtcclxuICAgIGlmIChkYXRlID09PSAnRm9yZXZlcicpIHJldHVybiBkYXRlXHJcbiAgICBpZiAodHlwZW9mIGRhdGUgPT09ICdudW1iZXInKSByZXR1cm4gZGF0ZVN0cmluZyhmcm9tRGF0ZU51bShkYXRlKSwgYWRkVGhpcylcclxuXHJcbiAgICBjb25zdCByZWxhdGl2ZU1hdGNoID0gT2JqZWN0LmtleXMoREFURV9SRUxBVElWRU5BTUVTKS5maW5kKChuYW1lKSA9PiB7XHJcbiAgICAgICAgY29uc3QgZGF5QXQgPSBuZXcgRGF0ZSgpXHJcbiAgICAgICAgZGF5QXQuc2V0RGF0ZShkYXlBdC5nZXREYXRlKCkgKyBEQVRFX1JFTEFUSVZFTkFNRVNbbmFtZV0pXHJcbiAgICAgICAgcmV0dXJuIGRhdGVzRXF1YWwoZGF5QXQsIGRhdGUpXHJcbiAgICB9KVxyXG4gICAgaWYgKHJlbGF0aXZlTWF0Y2gpIHJldHVybiByZWxhdGl2ZU1hdGNoXHJcblxyXG4gICAgY29uc3QgZGF5c0FoZWFkID0gKGRhdGUuZ2V0VGltZSgpIC0gRGF0ZS5ub3coKSkgLyAxMDAwIC8gMzYwMCAvIDI0XHJcblxyXG4gICAgLy8gSWYgdGhlIGRhdGUgaXMgd2l0aGluIDYgZGF5cyBvZiB0b2RheSwgb25seSBkaXNwbGF5IHRoZSBkYXkgb2YgdGhlIHdlZWtcclxuICAgIGlmICgwIDwgZGF5c0FoZWFkICYmIGRheXNBaGVhZCA8PSA2KSB7XHJcbiAgICAgICAgcmV0dXJuIChhZGRUaGlzID8gJ1RoaXMgJyA6ICcnKSArIFdFRUtEQVlTW2RhdGUuZ2V0RGF5KCldXHJcbiAgICB9XHJcbiAgICByZXR1cm4gYCR7V0VFS0RBWVNbZGF0ZS5nZXREYXkoKV19LCAke0ZVTExNT05USFNbZGF0ZS5nZXRNb250aCgpXX0gJHtkYXRlLmdldERhdGUoKX1gXHJcbn1cclxuXHJcbi8vIFRoZSBvbmUgYmVsb3cgc2Nyb2xscyBzbW9vdGhseSB0byBhIHkgcG9zaXRpb24uXHJcbmV4cG9ydCBmdW5jdGlvbiBzbW9vdGhTY3JvbGwodG86IG51bWJlcik6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICBsZXQgc3RhcnQ6IG51bWJlcnxudWxsID0gbnVsbFxyXG4gICAgICAgIGNvbnN0IGZyb20gPSBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcFxyXG4gICAgICAgIGNvbnN0IGFtb3VudCA9IHRvIC0gZnJvbVxyXG4gICAgICAgIGNvbnN0IHN0ZXAgPSAodGltZXN0YW1wOiBudW1iZXIpID0+IHtcclxuICAgICAgICAgICAgaWYgKHN0YXJ0ID09IG51bGwpIHsgc3RhcnQgPSB0aW1lc3RhbXAgfVxyXG4gICAgICAgICAgICBjb25zdCBwcm9ncmVzcyA9IHRpbWVzdGFtcCAtIHN0YXJ0XHJcbiAgICAgICAgICAgIHdpbmRvdy5zY3JvbGxUbygwLCBmcm9tICsgKGFtb3VudCAqIChwcm9ncmVzcyAvIDM1MCkpKVxyXG4gICAgICAgICAgICBpZiAocHJvZ3Jlc3MgPCAzNTApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RlcClcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIF8kKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ25hdicpKS5jbGFzc0xpc3QucmVtb3ZlKCdoZWFkcm9vbS0tdW5waW5uZWQnKVxyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0ZXApXHJcbiAgICB9KVxyXG59XHJcblxyXG4vLyBBbmQgYSBmdW5jdGlvbiB0byBhcHBseSBhbiBpbmsgZWZmZWN0XHJcbmV4cG9ydCBmdW5jdGlvbiByaXBwbGUoZWw6IEhUTUxFbGVtZW50KTogdm9pZCB7XHJcbiAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCAoZXZ0KSA9PiB7XHJcbiAgICAgICAgaWYgKGV2dC53aGljaCAhPT0gMSkgcmV0dXJuIC8vIE5vdCBsZWZ0IGJ1dHRvblxyXG4gICAgICAgIGNvbnN0IHdhdmUgPSBlbGVtZW50KCdzcGFuJywgJ3dhdmUnKVxyXG4gICAgICAgIGNvbnN0IHNpemUgPSBNYXRoLm1heChOdW1iZXIoZWwub2Zmc2V0V2lkdGgpLCBOdW1iZXIoZWwub2Zmc2V0SGVpZ2h0KSlcclxuICAgICAgICB3YXZlLnN0eWxlLndpZHRoID0gKHdhdmUuc3R5bGUuaGVpZ2h0ID0gc2l6ZSArICdweCcpXHJcblxyXG4gICAgICAgIGxldCB4ID0gZXZ0LmNsaWVudFhcclxuICAgICAgICBsZXQgeSA9IGV2dC5jbGllbnRZXHJcbiAgICAgICAgY29uc3QgcmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXHJcbiAgICAgICAgeCAtPSByZWN0LmxlZnRcclxuICAgICAgICB5IC09IHJlY3QudG9wXHJcblxyXG4gICAgICAgIHdhdmUuc3R5bGUudG9wID0gKHkgLSAoc2l6ZSAvIDIpKSArICdweCdcclxuICAgICAgICB3YXZlLnN0eWxlLmxlZnQgPSAoeCAtIChzaXplIC8gMikpICsgJ3B4J1xyXG4gICAgICAgIGVsLmFwcGVuZENoaWxkKHdhdmUpXHJcbiAgICAgICAgd2F2ZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtaG9sZCcsIFN0cmluZyhEYXRlLm5vdygpKSlcclxuICAgICAgICBmb3JjZUxheW91dCh3YXZlKVxyXG4gICAgICAgIHdhdmUuc3R5bGUudHJhbnNmb3JtID0gJ3NjYWxlKDIuNSknXHJcbiAgICB9KVxyXG4gICAgZWwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIChldnQpID0+IHtcclxuICAgICAgICBpZiAoZXZ0LndoaWNoICE9PSAxKSByZXR1cm4gLy8gT25seSBmb3IgbGVmdCBidXR0b25cclxuICAgICAgICBjb25zdCB3YXZlcyA9IGVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3dhdmUnKVxyXG4gICAgICAgIHdhdmVzLmZvckVhY2goKHdhdmUpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgZGlmZiA9IERhdGUubm93KCkgLSBOdW1iZXIod2F2ZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtaG9sZCcpKVxyXG4gICAgICAgICAgICBjb25zdCBkZWxheSA9IE1hdGgubWF4KDM1MCAtIGRpZmYsIDApXHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgKHdhdmUgYXMgSFRNTEVsZW1lbnQpLnN0eWxlLm9wYWNpdHkgPSAnMCdcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHdhdmUucmVtb3ZlKClcclxuICAgICAgICAgICAgICAgIH0sIDU1MClcclxuICAgICAgICAgICAgfSwgZGVsYXkpXHJcbiAgICAgICAgfSlcclxuICAgIH0pXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjc3NOdW1iZXIoY3NzOiBzdHJpbmd8bnVsbCk6IG51bWJlciB7XHJcbiAgICBpZiAoIWNzcykgcmV0dXJuIDBcclxuICAgIHJldHVybiBwYXJzZUludChjc3MsIDEwKVxyXG59XHJcblxyXG4vLyBGb3IgZWFzZSBvZiBhbmltYXRpb25zLCBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIHByb21pc2UgaXMgZGVmaW5lZC5cclxuZXhwb3J0IGZ1bmN0aW9uIGFuaW1hdGVFbChlbDogSFRNTEVsZW1lbnQsIGtleWZyYW1lczogQW5pbWF0aW9uS2V5RnJhbWVbXSwgb3B0aW9uczogQW5pbWF0aW9uT3B0aW9ucyk6XHJcbiAgICBQcm9taXNlPEFuaW1hdGlvblBsYXliYWNrRXZlbnQ+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgY29uc3QgcGxheWVyID0gZWwuYW5pbWF0ZShrZXlmcmFtZXMsIG9wdGlvbnMpXHJcbiAgICAgICAgcGxheWVyLm9uZmluaXNoID0gKGUpID0+IHJlc29sdmUoZSlcclxuICAgIH0pXHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiIifQ==