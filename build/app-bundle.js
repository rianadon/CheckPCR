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
                    if (start == null) {
                        start = timestamp;
                    }
                    assignments.forEach((assignment, n) => {
                        const col = n % columns;
                        if (n < columns) {
                            columnHeights[col] = 0;
                        }
                        assignment.style.top = columnHeights[col] + 'px';
                        assignment.style.left = ((100 / columns) * col) + '%';
                        assignment.style.right = ((100 / columns) * (columns - col - 1)) + '%';
                        columnHeights[col] += assignment.offsetHeight + 24;
                    });
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
    if (Object(_util__WEBPACK_IMPORTED_MODULE_13__["localStorageRead"])('view') === '1') {
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
// For ease of animations, a function that returns a promise is defined.
function animateEl(el, keyframes, options) {
    return new Promise((resolve, reject) => {
        const player = el.animate(keyframes, options);
        player.onfinish = (e) => resolve(e);
    });
}
// In order to make the previous date / next date buttons do something, they need event listeners.
Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('listnext').addEventListener('click', () => {
    const pd = Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('listprevdate');
    const td = Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('listnowdate');
    const nd = Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('listnextdate');
    Object(_navigation__WEBPACK_IMPORTED_MODULE_7__["incrementListDateOffset"])();
    Object(_display__WEBPACK_IMPORTED_MODULE_6__["display"])();
    nd.style.display = 'inline-block';
    return Promise.race([
        animateEl(td, [
            { transform: 'translateX(0%)', opacity: 1 },
            { opacity: 0 },
            { transform: 'translateX(-100%)', opacity: 0 }
        ], { duration: 300, easing: 'ease-out' }),
        animateEl(nd, [
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
        animateEl(td, [
            { transform: 'translateX(-100%)', opacity: 1 },
            { opacity: 0 },
            { transform: 'translateX(0%)', opacity: 0 }
        ], { duration: 300, easing: 'ease-out' }),
        animateEl(pd, [
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
        Object(_plugins_activity__WEBPACK_IMPORTED_MODULE_9__["addActivity"])(item[0], item[1], new Date(item[2]), true, item[3]);
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
    const text = Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('newText').value;
    const { cls, due, st } = Object(_plugins_customAssignments__WEBPACK_IMPORTED_MODULE_11__["parseCustomTask"])(text);
    let end = 'Forever';
    const start = (st != null) ? Object(_dates__WEBPACK_IMPORTED_MODULE_5__["toDateNum"])(chrono.parseDate(st)) : Object(_dates__WEBPACK_IMPORTED_MODULE_5__["today"])();
    if (due != null) {
        end = start;
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


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50LnRzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2FjdGl2aXR5LnRzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2Fzc2lnbm1lbnQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvYXZhdGFyLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2NhbGVuZGFyLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2N1c3RvbUFkZGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2Vycm9yRGlzcGxheS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9yZXNpemVyLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL3NuYWNrYmFyLnRzIiwid2VicGFjazovLy8uL3NyYy9jb29raWVzLnRzIiwid2VicGFjazovLy8uL3NyYy9kYXRlcy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZGlzcGxheS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbmF2aWdhdGlvbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGNyLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW5zL2FjdGl2aXR5LnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW5zL2F0aGVuYS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2lucy9jdXN0b21Bc3NpZ25tZW50cy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2lucy9kb25lLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW5zL21vZGlmaWVkQXNzaWdubWVudHMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NldHRpbmdzLnRzIiwid2VicGFjazovLy8uL3NyYy91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNB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RyxDQUFDLENBQUMsR0FBRyxLQUFLO0tBQ2hEO0FBQ0wsQ0FBQztBQUVELGdCQUFnQixDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVM7SUFDM0MsTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsR0FBRztJQUMzQixNQUFNLElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO0lBQzdCLE1BQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLElBQUk7SUFDN0IsTUFBTSxFQUFFLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDN0IsTUFBTSxFQUFFLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDN0IsTUFBTSxFQUFFLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7SUFFN0IsTUFBTSxLQUFLLEdBQUcsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztJQUUxQixNQUFNLEVBQUUsR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUM5QyxNQUFNLEVBQUUsR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUM5QyxNQUFNLEVBQUUsR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUU5QyxxQkFBcUI7SUFDckIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFTLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDeEUsT0FBTyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMs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Z0JBQ1gsSUFBb0IsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLEdBQUc7Z0JBQ3pDLFVBQVUsQ0FBQyxHQUFHLEVBQUU7b0JBQ1osSUFBSSxDQUFDLE1BQU0sRUFBRTtnQkFDakIsQ0FBQyxFQUFFLEdBQUcsQ0FBQztZQUNYLENBQUMsRUFBRSxLQUFLLENBQUM7UUFDYixDQUFDLENBQUM7SUFDTixDQUFDLENBQUM7QUFDTixDQUFDO0FBRUssbUJBQW9CLEdBQWdCO0lBQ3RDLElBQUksQ0FBQyxHQUFHO1FBQUUsT0FBTyxDQUFDO0lBQ2xCLE9BQU8sUUFBUSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUM7QUFDNUIsQ0FBQyIsImZpbGUiOiJhcHAtYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2NsaWVudC50c1wiKTtcbiIsImltcG9ydCB7IGVsZW1CeUlkLCBlbGVtZW50LCBsb2NhbFN0b3JhZ2VSZWFkLCBsb2NhbFN0b3JhZ2VXcml0ZSwgc2VuZCB9IGZyb20gJy4vdXRpbCdcclxuXHJcbmV4cG9ydCBjb25zdCBWRVJTSU9OID0gJzIuMjQuMydcclxuXHJcbmNvbnN0IFZFUlNJT05fVVJMID0gJ2h0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS8xOVJ5YW5BL0NoZWNrUENSL21hc3Rlci92ZXJzaW9uLnR4dCdcclxuY29uc3QgQ09NTUlUX1VSTCA9IChsb2NhdGlvbi5wcm90b2NvbCA9PT0gJ2Nocm9tZS1leHRlbnNpb246JyA/XHJcbiAgICAnaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbS9yZXBvcy8xOVJ5YW5BL0NoZWNrUENSL2dpdC9yZWZzL2hlYWRzL21hc3RlcicgOiAnL2FwaS9jb21taXQnKVxyXG5jb25zdCBORVdTX1VSTCA9ICdodHRwczovL2FwaS5naXRodWIuY29tL2dpc3RzLzIxYmYxMWE0MjlkYTI1NzUzOWE2ODUyMGY1MTNhMzhiJ1xyXG5cclxuZnVuY3Rpb24gZm9ybWF0Q29tbWl0TWVzc2FnZShtZXNzYWdlOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIG1lc3NhZ2Uuc3Vic3RyKG1lc3NhZ2UuaW5kZXhPZignXFxuXFxuJykgKyAyKVxyXG4gICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFwqICguKj8pKD89JHxcXG4pL2csIChhLCBiKSA9PiBgPGxpPiR7Yn08L2xpPmApXHJcbiAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8+XFxuPC9nLCAnPjwnKVxyXG4gICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxuL2csICc8YnI+JylcclxufVxyXG5cclxuLy8gRm9yIHVwZGF0aW5nLCBhIHJlcXVlc3Qgd2lsbCBiZSBzZW5kIHRvIEdpdGh1YiB0byBnZXQgdGhlIGN1cnJlbnQgY29tbWl0IGlkIGFuZCBjaGVjayB0aGF0IGFnYWluc3Qgd2hhdCdzIHN0b3JlZFxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY2hlY2tDb21taXQoKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHJlc3AgPSBhd2FpdCBzZW5kKFZFUlNJT05fVVJMLCAndGV4dCcpXHJcbiAgICAgICAgY29uc3QgYyA9IHJlc3AucmVzcG9uc2VUZXh0LnRyaW0oKVxyXG4gICAgICAgIGNvbnNvbGUubG9nKGBDdXJyZW50IHZlcnNpb246ICR7Y30gJHtWRVJTSU9OID09PSBjID8gJyhubyB1cGRhdGUgYXZhaWxhYmxlKScgOiAnKHVwZGF0ZSBhdmFpbGFibGUpJ31gKVxyXG4gICAgICAgIGVsZW1CeUlkKCduZXd2ZXJzaW9uJykuaW5uZXJIVE1MID0gY1xyXG4gICAgICAgIGlmIChWRVJTSU9OICE9PSBjKSB7XHJcbiAgICAgICAgICAgIGVsZW1CeUlkKCd1cGRhdGVJZ25vcmUnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChsb2NhdGlvbi5wcm90b2NvbCA9PT0gJ2Nocm9tZS1leHRlbnNpb246Jykge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1CeUlkKCd1cGRhdGUnKS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtQnlJZCgndXBkYXRlQmFja2dyb3VuZCcpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcclxuICAgICAgICAgICAgICAgICAgICB9LCAzNTApXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICBjb25zdCByZXNwMiA9IGF3YWl0IHNlbmQoQ09NTUlUX1VSTCwgJ2pzb24nKVxyXG4gICAgICAgICAgICBjb25zdCB7IHNoYSwgdXJsIH0gPSByZXNwMi5yZXNwb25zZS5vYmplY3RcclxuICAgICAgICAgICAgY29uc3QgcmVzcDMgPSBhd2FpdCBzZW5kKChsb2NhdGlvbi5wcm90b2NvbCA9PT0gJ2Nocm9tZS1leHRlbnNpb246JyA/IHVybCA6IGAvYXBpL2NvbW1pdC8ke3NoYX1gKSwgJ2pzb24nKVxyXG4gICAgICAgICAgICBlbGVtQnlJZCgncGFzdFVwZGF0ZVZlcnNpb24nKS5pbm5lckhUTUwgPSBWRVJTSU9OXHJcbiAgICAgICAgICAgIGVsZW1CeUlkKCduZXdVcGRhdGVWZXJzaW9uJykuaW5uZXJIVE1MID0gY1xyXG4gICAgICAgICAgICBlbGVtQnlJZCgndXBkYXRlRmVhdHVyZXMnKS5pbm5lckhUTUwgPSBmb3JtYXRDb21taXRNZXNzYWdlKHJlc3AzLnJlc3BvbnNlLm1lc3NhZ2UpXHJcbiAgICAgICAgICAgIGVsZW1CeUlkKCd1cGRhdGVCYWNrZ3JvdW5kJykuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcclxuICAgICAgICAgICAgZWxlbUJ5SWQoJ3VwZGF0ZScpLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcbiAgICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ0NvdWxkIG5vdCBhY2Nlc3MgR2l0aHViLiBIZXJlXFwncyB0aGUgZXJyb3I6JywgZXJyKVxyXG4gICAgfVxyXG59XHJcblxyXG5sZXQgbmV3c1VybDogc3RyaW5nfG51bGwgPSBudWxsXHJcbmxldCBuZXdzQ29tbWl0OiBzdHJpbmd8bnVsbCA9IG51bGxcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmZXRjaE5ld3MoKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHJlc3AgPSBhd2FpdCBzZW5kKE5FV1NfVVJMLCAnanNvbicpXHJcbiAgICAgICAgbGV0IGxhc3QgPSBsb2NhbFN0b3JhZ2VSZWFkKCduZXdzQ29tbWl0JylcclxuICAgICAgICBuZXdzQ29tbWl0ID0gcmVzcC5yZXNwb25zZS5oaXN0b3J5WzBdLnZlcnNpb25cclxuXHJcbiAgICAgICAgaWYgKGxhc3QgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBsYXN0ID0gbmV3c0NvbW1pdFxyXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2VXcml0ZSgnbmV3c0NvbW1pdCcsIG5ld3NDb21taXQpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBuZXdzVXJsID0gcmVzcC5yZXNwb25zZS5maWxlc1sndXBkYXRlcy5odG0nXS5yYXdfdXJsXHJcblxyXG4gICAgICAgIGlmIChsYXN0ICE9PSBuZXdzQ29tbWl0KSB7XHJcbiAgICAgICAgICAgIGdldE5ld3MoKVxyXG4gICAgICAgIH1cclxuICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdDb3VsZCBub3QgYWNjZXNzIEdpdGh1Yi4gSGVyZVxcJ3MgdGhlIGVycm9yOicsIGVycilcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldE5ld3Mob25mYWlsPzogKCkgPT4gdm9pZCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgaWYgKCFuZXdzVXJsKSB7XHJcbiAgICAgICAgaWYgKG9uZmFpbCkgb25mYWlsKClcclxuICAgICAgICByZXR1cm5cclxuICAgIH1cclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcmVzcCA9IGF3YWl0IHNlbmQobmV3c1VybClcclxuICAgICAgICBsb2NhbFN0b3JhZ2UubmV3c0NvbW1pdCA9IG5ld3NDb21taXRcclxuICAgICAgICByZXNwLnJlc3BvbnNlVGV4dC5zcGxpdCgnPGhyPicpLmZvckVhY2goKG5ld3MpID0+IHtcclxuICAgICAgICAgICAgZWxlbUJ5SWQoJ25ld3NDb250ZW50JykuYXBwZW5kQ2hpbGQoZWxlbWVudCgnZGl2JywgJ25ld3NJdGVtJywgbmV3cykpXHJcbiAgICAgICAgfSlcclxuICAgICAgICBlbGVtQnlJZCgnbmV3c0JhY2tncm91bmQnKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xyXG4gICAgICAgIGVsZW1CeUlkKCduZXdzJykuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdDb3VsZCBub3QgYWNjZXNzIEdpdGh1Yi4gSGVyZVxcJ3MgdGhlIGVycm9yOicsIGVycilcclxuICAgICAgICBpZiAob25mYWlsKSBvbmZhaWwoKVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IGNoZWNrQ29tbWl0LCBmZXRjaE5ld3MsIGdldE5ld3MsIFZFUlNJT04gfSBmcm9tICcuL2FwcCdcclxuaW1wb3J0IHsgY2xvc2VPcGVuZWQgfSBmcm9tICcuL2NvbXBvbmVudHMvYXNzaWdubWVudCdcclxuaW1wb3J0IHsgdXBkYXRlQXZhdGFyIH0gZnJvbSAnLi9jb21wb25lbnRzL2F2YXRhcidcclxuaW1wb3J0IHsgdXBkYXRlTmV3VGlwcyB9IGZyb20gJy4vY29tcG9uZW50cy9jdXN0b21BZGRlcidcclxuaW1wb3J0IHsgZ2V0UmVzaXplQXNzaWdubWVudHMsIHJlc2l6ZSwgcmVzaXplQ2FsbGVyIH0gZnJvbSAnLi9jb21wb25lbnRzL3Jlc2l6ZXInXHJcbmltcG9ydCB7IHRvRGF0ZU51bSwgdG9kYXkgfSBmcm9tICcuL2RhdGVzJ1xyXG5pbXBvcnQgeyBkaXNwbGF5LCBmb3JtYXRVcGRhdGUsIGdldFNjcm9sbCB9IGZyb20gJy4vZGlzcGxheSdcclxuaW1wb3J0IHtcclxuICAgIGRlY3JlbWVudExpc3REYXRlT2Zmc2V0LFxyXG4gICAgZ2V0TGlzdERhdGVPZmZzZXQsXHJcbiAgICBpbmNyZW1lbnRMaXN0RGF0ZU9mZnNldCxcclxuICAgIHNldExpc3REYXRlT2Zmc2V0LFxyXG4gICAgemVyb0xpc3REYXRlT2Zmc2V0XHJcbn0gZnJvbSAnLi9uYXZpZ2F0aW9uJ1xyXG5pbXBvcnQgeyBkb2xvZ2luLCBmZXRjaCwgZ2V0Q2xhc3NlcywgZ2V0RGF0YSwgbG9nb3V0LCBzZXREYXRhLCBzd2l0Y2hWaWV3cyB9IGZyb20gJy4vcGNyJ1xyXG5pbXBvcnQgeyBhZGRBY3Rpdml0eSwgcmVjZW50QWN0aXZpdHkgfSBmcm9tICcuL3BsdWdpbnMvYWN0aXZpdHknXHJcbmltcG9ydCB7IHVwZGF0ZUF0aGVuYURhdGEgfSBmcm9tICcuL3BsdWdpbnMvYXRoZW5hJ1xyXG5pbXBvcnQgeyBhZGRUb0V4dHJhLCBwYXJzZUN1c3RvbVRhc2ssIHNhdmVFeHRyYSB9IGZyb20gJy4vcGx1Z2lucy9jdXN0b21Bc3NpZ25tZW50cydcclxuaW1wb3J0IHsgZ2V0U2V0dGluZywgc2V0U2V0dGluZywgc2V0dGluZ3MgfSBmcm9tICcuL3NldHRpbmdzJ1xyXG5pbXBvcnQge1xyXG4gICAgXyQsXHJcbiAgICBfJGgsXHJcbiAgICBkYXRlU3RyaW5nLFxyXG4gICAgZWxlbUJ5SWQsXHJcbiAgICBlbGVtZW50LFxyXG4gICAgZm9yY2VMYXlvdXQsXHJcbiAgICBsb2NhbFN0b3JhZ2VSZWFkLFxyXG4gICAgbG9jYWxTdG9yYWdlV3JpdGUsXHJcbiAgICByZXF1ZXN0SWRsZUNhbGxiYWNrLFxyXG4gICAgcmlwcGxlXHJcbn0gZnJvbSAnLi91dGlsJ1xyXG5cclxuaWYgKGxvY2FsU3RvcmFnZVJlYWQoJ2RhdGEnKSAhPSBudWxsKSB7XHJcbiAgICBzZXREYXRhKGxvY2FsU3RvcmFnZVJlYWQoJ2RhdGEnKSlcclxufVxyXG5cclxuLy8gQWRkaXRpb25hbGx5LCBpZiBpdCdzIHRoZSB1c2VyJ3MgZmlyc3QgdGltZSwgdGhlIHBhZ2UgaXMgc2V0IHRvIHRoZSB3ZWxjb21lIHBhZ2UuXHJcbmlmICghbG9jYWxTdG9yYWdlUmVhZCgnbm9XZWxjb21lJykpIHtcclxuICAgIGxvY2FsU3RvcmFnZVdyaXRlKCdub1dlbGNvbWUnLCB0cnVlKVxyXG4gICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnd2VsY29tZS5odG1sJ1xyXG59XHJcblxyXG5jb25zdCBOQVZfRUxFTUVOVCA9IF8kKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ25hdicpKVxyXG5jb25zdCBJTlBVVF9FTEVNRU5UUyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXHJcbiAgICAnaW5wdXRbdHlwZT10ZXh0XTpub3QoI25ld1RleHQpOm5vdChbcmVhZG9ubHldKSwgaW5wdXRbdHlwZT1wYXNzd29yZF0sIGlucHV0W3R5cGU9ZW1haWxdLCAnICtcclxuICAgICdpbnB1dFt0eXBlPXVybF0sIGlucHV0W3R5cGU9dGVsXSwgaW5wdXRbdHlwZT1udW1iZXJdOm5vdCguY29udHJvbCksIGlucHV0W3R5cGU9c2VhcmNoXSdcclxuKSBhcyBOb2RlTGlzdE9mPEhUTUxJbnB1dEVsZW1lbnQ+XHJcblxyXG4vLyAjIyMjIFNlbmQgZnVuY3Rpb25cclxuLy9cclxuXHJcbi8vIFRoaXMgZnVuY3Rpb24gZGlzcGxheXMgYSBzbmFja2JhciB0byB0ZWxsIHRoZSB1c2VyIHNvbWV0aGluZ1xyXG5cclxuLy8gPGEgbmFtZT1cInJldFwiLz5cclxuLy8gUmV0cmlldmluZyBkYXRhXHJcbi8vIC0tLS0tLS0tLS0tLS0tLVxyXG4vL1xyXG5lbGVtQnlJZCgnbG9naW4nKS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCAoZXZ0KSA9PiB7XHJcbiAgICBldnQucHJldmVudERlZmF1bHQoKVxyXG4gICAgZG9sb2dpbihudWxsLCB0cnVlKVxyXG59KVxyXG5cclxuLy8gVGhlIHZpZXcgc3dpdGNoaW5nIGJ1dHRvbiBuZWVkcyBhbiBldmVudCBoYW5kbGVyLlxyXG5lbGVtQnlJZCgnc3dpdGNoVmlld3MnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHN3aXRjaFZpZXdzKVxyXG5cclxuLy8gVGhlIHNhbWUgZ29lcyBmb3IgdGhlIGxvZyBvdXQgYnV0dG9uLlxyXG5lbGVtQnlJZCgnbG9nb3V0JykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBsb2dvdXQpXHJcblxyXG4vLyBOb3cgd2UgYXNzaWduIGl0IHRvIGNsaWNraW5nIHRoZSBiYWNrZ3JvdW5kLlxyXG5lbGVtQnlJZCgnYmFja2dyb3VuZCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xvc2VPcGVuZWQpXHJcblxyXG4vLyBUaGVuLCB0aGUgdGFicyBhcmUgbWFkZSBpbnRlcmFjdGl2ZS5cclxuZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnI25hdlRhYnM+bGknKS5mb3JFYWNoKCh0YWIsIHRhYkluZGV4KSA9PiB7XHJcbiAgdGFiLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2dCkgPT4ge1xyXG4gICAgaWYgKCFzZXR0aW5ncy52aWV3VHJhbnMpIHtcclxuICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdub1RyYW5zJylcclxuICAgICAgZm9yY2VMYXlvdXQoZG9jdW1lbnQuYm9keSlcclxuICAgIH1cclxuICAgIGxvY2FsU3RvcmFnZVdyaXRlKCd2aWV3JywgdGFiSW5kZXgpXHJcbiAgICBkb2N1bWVudC5ib2R5LnNldEF0dHJpYnV0ZSgnZGF0YS12aWV3JywgU3RyaW5nKHRhYkluZGV4KSlcclxuICAgIGlmICh0YWJJbmRleCA9PT0gMSkge1xyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCByZXNpemVDYWxsZXIpXHJcbiAgICAgICAgaWYgKHNldHRpbmdzLnZpZXdUcmFucykge1xyXG4gICAgICAgICAgICBsZXQgc3RhcnQ6IG51bWJlcnxudWxsID0gbnVsbFxyXG4gICAgICAgICAgICAvLyBUaGUgY29kZSBiZWxvdyBpcyB0aGUgc2FtZSBjb2RlIHVzZWQgaW4gdGhlIHJlc2l6ZSgpIGZ1bmN0aW9uLiBJdCBiYXNpY2FsbHkganVzdFxyXG4gICAgICAgICAgICAvLyBwb3NpdGlvbnMgdGhlIGFzc2lnbm1lbnRzIGNvcnJlY3RseSBhcyB0aGV5IGFuaW1hdGVcclxuICAgICAgICAgICAgY29uc3Qgd2lkdGhzID0gZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuY29udGFpbnMoJ3Nob3dJbmZvJykgP1xyXG4gICAgICAgICAgICAgICAgWzY1MCwgMTEwMCwgMTgwMCwgMjcwMCwgMzgwMCwgNTEwMF0gOiBbMzUwLCA4MDAsIDE1MDAsIDI0MDAsIDM1MDAsIDQ4MDBdXHJcbiAgICAgICAgICAgIGxldCBjb2x1bW5zID0gMVxyXG4gICAgICAgICAgICB3aWR0aHMuZm9yRWFjaCgodywgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA+IHcpIHsgY29sdW1ucyA9IGluZGV4ICsgMSB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIGNvbnN0IGFzc2lnbm1lbnRzID0gZ2V0UmVzaXplQXNzaWdubWVudHMoKVxyXG4gICAgICAgICAgICBjb25zdCBjb2x1bW5IZWlnaHRzID0gQXJyYXkuZnJvbShuZXcgQXJyYXkoY29sdW1ucyksICgpID0+IDApXHJcbiAgICAgICAgICAgIGNvbnN0IHN0ZXAgPSAodGltZXN0YW1wOiBudW1iZXIpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICghY29sdW1ucykgdGhyb3cgbmV3IEVycm9yKCdDb2x1bW5zIG51bWJlciBub3QgZm91bmQnKVxyXG4gICAgICAgICAgICAgICAgaWYgKHN0YXJ0ID09IG51bGwpIHsgc3RhcnQgPSB0aW1lc3RhbXAgfVxyXG4gICAgICAgICAgICAgICAgYXNzaWdubWVudHMuZm9yRWFjaCgoYXNzaWdubWVudCwgbikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbCA9IG4gJSBjb2x1bW5zXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG4gPCBjb2x1bW5zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29sdW1uSGVpZ2h0c1tjb2xdID0gMFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBhc3NpZ25tZW50LnN0eWxlLnRvcCA9IGNvbHVtbkhlaWdodHNbY29sXSArICdweCdcclxuICAgICAgICAgICAgICAgICAgICBhc3NpZ25tZW50LnN0eWxlLmxlZnQgPSAoKDEwMCAvIGNvbHVtbnMpICogY29sKSArICclJ1xyXG4gICAgICAgICAgICAgICAgICAgIGFzc2lnbm1lbnQuc3R5bGUucmlnaHQgPSAoKDEwMCAvIGNvbHVtbnMpICogKGNvbHVtbnMgLSBjb2wgLSAxKSkgKyAnJSdcclxuICAgICAgICAgICAgICAgICAgICBjb2x1bW5IZWlnaHRzW2NvbF0gKz0gYXNzaWdubWVudC5vZmZzZXRIZWlnaHQgKyAyNFxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIGlmICgodGltZXN0YW1wIC0gc3RhcnQpIDwgMzUwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RlcClcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0ZXApXHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFjb2x1bW5zKSB0aHJvdyBuZXcgRXJyb3IoJ0NvbHVtbnMgbnVtYmVyIG5vdCBmb3VuZCcpXHJcbiAgICAgICAgICAgICAgICBhc3NpZ25tZW50cy5mb3JFYWNoKChhc3NpZ25tZW50LCBuKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY29sID0gbiAlIGNvbHVtbnNcclxuICAgICAgICAgICAgICAgICAgICBpZiAobiA8IGNvbHVtbnMpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb2x1bW5IZWlnaHRzW2NvbF0gPSAwXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGFzc2lnbm1lbnQuc3R5bGUudG9wID0gY29sdW1uSGVpZ2h0c1tjb2xdICsgJ3B4J1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbHVtbkhlaWdodHNbY29sXSArPSBhc3NpZ25tZW50Lm9mZnNldEhlaWdodCArIDI0XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9LCAzNTApXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmVzaXplKClcclxuICAgICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHdpbmRvdy5zY3JvbGxUbygwLCBnZXRTY3JvbGwoKSlcclxuICAgICAgICBOQVZfRUxFTUVOVC5jbGFzc0xpc3QuYWRkKCdoZWFkcm9vbS0tbG9ja2VkJylcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgTkFWX0VMRU1FTlQuY2xhc3NMaXN0LnJlbW92ZSgnaGVhZHJvb20tLXVucGlubmVkJylcclxuICAgICAgICAgICAgTkFWX0VMRU1FTlQuY2xhc3NMaXN0LnJlbW92ZSgnaGVhZHJvb20tLWxvY2tlZCcpXHJcbiAgICAgICAgICAgIE5BVl9FTEVNRU5ULmNsYXNzTGlzdC5hZGQoJ2hlYWRyb29tLS1waW5uZWQnKVxyXG4gICAgICAgICAgICByZXF1ZXN0SWRsZUNhbGxiYWNrKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHplcm9MaXN0RGF0ZU9mZnNldCgpXHJcbiAgICAgICAgICAgICAgICB1cGRhdGVMaXN0TmF2KClcclxuICAgICAgICAgICAgICAgIGRpc3BsYXkoKVxyXG4gICAgICAgICAgICB9LCB7dGltZW91dDogMjAwMH0pXHJcbiAgICAgICAgfSwgMzUwKVxyXG4gICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCByZXNpemVDYWxsZXIpXHJcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmFzc2lnbm1lbnQnKS5mb3JFYWNoKChhc3NpZ25tZW50KSA9PiB7XHJcbiAgICAgICAgICAgIChhc3NpZ25tZW50IGFzIEhUTUxFbGVtZW50KS5zdHlsZS50b3AgPSAnYXV0bydcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG4gICAgaWYgKCFzZXR0aW5ncy52aWV3VHJhbnMpIHtcclxuICAgICAgZm9yY2VMYXlvdXQoZG9jdW1lbnQuYm9keSlcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ25vVHJhbnMnKVxyXG4gICAgICB9LCAzNTApXHJcbiAgICB9XHJcbiAgfSlcclxufSlcclxuXHJcbi8vIEFuZCB0aGUgaW5mbyB0YWJzIChqdXN0IGEgbGl0dGxlIGxlc3MgY29kZSlcclxuZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnI2luZm9UYWJzPmxpJykuZm9yRWFjaCgodGFiLCB0YWJJbmRleCkgPT4ge1xyXG4gICAgdGFiLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2dCkgPT4ge1xyXG4gICAgICAgIGVsZW1CeUlkKCdpbmZvJykuc2V0QXR0cmlidXRlKCdkYXRhLXZpZXcnLCBTdHJpbmcodGFiSW5kZXgpKVxyXG4gICAgfSlcclxufSlcclxuXHJcbi8vIFRoZSB2aWV3IGlzIHNldCB0byB3aGF0IGl0IHdhcyBsYXN0LlxyXG5pZiAobG9jYWxTdG9yYWdlUmVhZCgndmlldycpICE9IG51bGwpIHtcclxuICBkb2N1bWVudC5ib2R5LnNldEF0dHJpYnV0ZSgnZGF0YS12aWV3JywgbG9jYWxTdG9yYWdlUmVhZCgndmlldycpKVxyXG4gIGlmIChsb2NhbFN0b3JhZ2VSZWFkKCd2aWV3JykgPT09ICcxJykge1xyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJlc2l6ZUNhbGxlcilcclxuICB9XHJcbn1cclxuXHJcbi8vIEFkZGl0aW9uYWxseSwgdGhlIGFjdGl2ZSBjbGFzcyBuZWVkcyB0byBiZSBhZGRlZCB3aGVuIGlucHV0cyBhcmUgc2VsZWN0ZWQgKGZvciB0aGUgbG9naW4gYm94KS5cclxuSU5QVVRfRUxFTUVOVFMuZm9yRWFjaCgoaW5wdXQpID0+IHtcclxuICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChldnQpID0+IHtcclxuICAgICAgICBfJGgoXyRoKGlucHV0LnBhcmVudE5vZGUpLnF1ZXJ5U2VsZWN0b3IoJ2xhYmVsJykpLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcbiAgICB9KVxyXG4gICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCAoZXZ0KSA9PiB7XHJcbiAgICAgICAgXyRoKF8kaChpbnB1dC5wYXJlbnROb2RlKS5xdWVyeVNlbGVjdG9yKCdsYWJlbCcpKS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG4gICAgfSlcclxuICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCAoZXZ0KSA9PiB7XHJcbiAgICAgICAgaWYgKGlucHV0LnZhbHVlLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICBfJGgoXyRoKGlucHV0LnBhcmVudE5vZGUpLnF1ZXJ5U2VsZWN0b3IoJ2xhYmVsJykpLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxufSlcclxuXHJcbi8vIFdoZW4gdGhlIGVzY2FwZSBrZXkgaXMgcHJlc3NlZCwgdGhlIGN1cnJlbnQgYXNzaWdubWVudCBzaG91bGQgYmUgY2xvc2VkLlxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldnQpID0+IHtcclxuICBpZiAoZXZ0LndoaWNoID09PSAyNykgeyAvLyBFc2NhcGUga2V5IHByZXNzZWRcclxuICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdmdWxsJykubGVuZ3RoICE9PSAwKSB7IHJldHVybiBjbG9zZU9wZW5lZChuZXcgRXZlbnQoJ0dlbmVyYXRlZCBFdmVudCcpKSB9XHJcbiAgfVxyXG59KTtcclxuXHJcbi8vIElmIGl0J3Mgd2ludGVyIHRpbWUsIGEgY2xhc3MgaXMgYWRkZWQgdG8gdGhlIGJvZHkgZWxlbWVudC5cclxuKCgpID0+IHtcclxuICAgIGNvbnN0IHRvZGF5RGF0ZSA9IG5ldyBEYXRlKClcclxuICAgIGlmIChuZXcgRGF0ZSh0b2RheURhdGUuZ2V0RnVsbFllYXIoKSwgMTAsIDI3KSA8PSB0b2RheURhdGUgJiZcclxuICAgICAgICB0b2RheURhdGUgPD0gbmV3IERhdGUodG9kYXlEYXRlLmdldEZ1bGxZZWFyKCksIDExLCAzMikpIHtcclxuICAgICAgICByZXR1cm4gZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCd3aW50ZXInKVxyXG4gICAgfVxyXG59KSgpXHJcblxyXG4vLyBGb3IgdGhlIG5hdmJhciB0b2dnbGUgYnV0dG9ucywgYSBmdW5jdGlvbiB0byB0b2dnbGUgdGhlIGFjdGlvbiBpcyBkZWZpbmVkIHRvIGVsaW1pbmF0ZSBjb2RlLlxyXG5mdW5jdGlvbiBuYXZUb2dnbGUoZWxlbTogc3RyaW5nLCBsczogc3RyaW5nLCBmPzogKCkgPT4gdm9pZCk6IHZvaWQge1xyXG4gICAgcmlwcGxlKGVsZW1CeUlkKGVsZW0pKVxyXG4gICAgZWxlbUJ5SWQoZWxlbSkuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsICgpID0+IHtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC50b2dnbGUobHMpXHJcbiAgICAgICAgcmVzaXplKClcclxuICAgICAgICBsb2NhbFN0b3JhZ2VXcml0ZShscywgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuY29udGFpbnMobHMpKVxyXG4gICAgICAgIGlmIChmICE9IG51bGwpIGYoKVxyXG4gICAgfSlcclxuICAgIGlmIChsb2NhbFN0b3JhZ2VSZWFkKGxzKSkgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKGxzKVxyXG59XHJcblxyXG4vLyBUaGUgYnV0dG9uIHRvIHNob3cvaGlkZSBjb21wbGV0ZWQgYXNzaWdubWVudHMgaW4gbGlzdCB2aWV3IGFsc28gbmVlZHMgZXZlbnQgbGlzdGVuZXJzLlxyXG5uYXZUb2dnbGUoJ2N2QnV0dG9uJywgJ3Nob3dEb25lJywgKCkgPT4gc2V0VGltZW91dChyZXNpemUsIDEwMDApKVxyXG5cclxuLy8gVGhlIHNhbWUgZ29lcyBmb3IgdGhlIGJ1dHRvbiB0aGF0IHNob3dzIHVwY29taW5nIHRlc3RzLlxyXG5pZiAobG9jYWxTdG9yYWdlLnNob3dJbmZvID09IG51bGwpIHsgbG9jYWxTdG9yYWdlLnNob3dJbmZvID0gSlNPTi5zdHJpbmdpZnkodHJ1ZSkgfVxyXG5uYXZUb2dnbGUoJ2luZm9CdXR0b24nLCAnc2hvd0luZm8nKVxyXG5cclxuLy8gVGhpcyBhbHNvIGdldHMgcmVwZWF0ZWQgZm9yIHRoZSB0aGVtZSB0b2dnbGluZy5cclxubmF2VG9nZ2xlKCdsaWdodEJ1dHRvbicsICdkYXJrJylcclxuXHJcbi8vIEZvciBlYXNlIG9mIGFuaW1hdGlvbnMsIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgcHJvbWlzZSBpcyBkZWZpbmVkLlxyXG5mdW5jdGlvbiBhbmltYXRlRWwoZWw6IEhUTUxFbGVtZW50LCBrZXlmcmFtZXM6IEFuaW1hdGlvbktleUZyYW1lW10sIG9wdGlvbnM6IEFuaW1hdGlvbk9wdGlvbnMpOlxyXG4gICAgUHJvbWlzZTxBbmltYXRpb25QbGF5YmFja0V2ZW50PiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHBsYXllciA9IGVsLmFuaW1hdGUoa2V5ZnJhbWVzLCBvcHRpb25zKVxyXG4gICAgICAgIHBsYXllci5vbmZpbmlzaCA9IChlKSA9PiByZXNvbHZlKGUpXHJcbiAgICB9KVxyXG59XHJcblxyXG4vLyBJbiBvcmRlciB0byBtYWtlIHRoZSBwcmV2aW91cyBkYXRlIC8gbmV4dCBkYXRlIGJ1dHRvbnMgZG8gc29tZXRoaW5nLCB0aGV5IG5lZWQgZXZlbnQgbGlzdGVuZXJzLlxyXG5lbGVtQnlJZCgnbGlzdG5leHQnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICBjb25zdCBwZCA9IGVsZW1CeUlkKCdsaXN0cHJldmRhdGUnKVxyXG4gIGNvbnN0IHRkID0gZWxlbUJ5SWQoJ2xpc3Rub3dkYXRlJylcclxuICBjb25zdCBuZCA9IGVsZW1CeUlkKCdsaXN0bmV4dGRhdGUnKVxyXG4gIGluY3JlbWVudExpc3REYXRlT2Zmc2V0KClcclxuICBkaXNwbGF5KClcclxuICBuZC5zdHlsZS5kaXNwbGF5ID0gJ2lubGluZS1ibG9jaydcclxuICByZXR1cm4gUHJvbWlzZS5yYWNlKFtcclxuICAgIGFuaW1hdGVFbCh0ZCwgW1xyXG4gICAgICB7dHJhbnNmb3JtOiAndHJhbnNsYXRlWCgwJSknLCBvcGFjaXR5OiAxfSxcclxuICAgICAge29wYWNpdHk6IDB9LFxyXG4gICAgICB7dHJhbnNmb3JtOiAndHJhbnNsYXRlWCgtMTAwJSknLCBvcGFjaXR5OiAwfVxyXG4gICAgXSwge2R1cmF0aW9uOiAzMDAsIGVhc2luZzogJ2Vhc2Utb3V0J30pLFxyXG4gICAgYW5pbWF0ZUVsKG5kLCBbXHJcbiAgICAgIHt0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKDAlKScsIG9wYWNpdHk6IDB9LFxyXG4gICAgICB7b3BhY2l0eTogMH0sXHJcbiAgICAgIHt0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKC0xMDAlKScsIG9wYWNpdHk6IDF9XHJcbiAgICBdLCB7ZHVyYXRpb246IDMwMCwgZWFzaW5nOiAnZWFzZS1vdXQnfSlcclxuICBdKS50aGVuKCgpID0+IHtcclxuICAgIHBkLmlubmVySFRNTCA9IHRkLmlubmVySFRNTFxyXG4gICAgdGQuaW5uZXJIVE1MID0gbmQuaW5uZXJIVE1MXHJcbiAgICBjb25zdCBsaXN0RGF0ZTIgPSBuZXcgRGF0ZSgpXHJcbiAgICBsaXN0RGF0ZTIuc2V0RGF0ZShsaXN0RGF0ZTIuZ2V0RGF0ZSgpICsgMSArIGdldExpc3REYXRlT2Zmc2V0KCkpXHJcbiAgICBuZC5pbm5lckhUTUwgPSBkYXRlU3RyaW5nKGxpc3REYXRlMikucmVwbGFjZSgnVG9kYXknLCAnTm93JylcclxuICAgIHJldHVybiBuZC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXHJcbiAgfSlcclxufSlcclxuXHJcbi8vIFRoZSBldmVudCBsaXN0ZW5lciBmb3IgdGhlIHByZXZpb3VzIGRhdGUgYnV0dG9uIGlzIG1vc3RseSB0aGUgc2FtZS5cclxuZWxlbUJ5SWQoJ2xpc3RiZWZvcmUnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICBjb25zdCBwZCA9IGVsZW1CeUlkKCdsaXN0cHJldmRhdGUnKVxyXG4gIGNvbnN0IHRkID0gZWxlbUJ5SWQoJ2xpc3Rub3dkYXRlJylcclxuICBjb25zdCBuZCA9IGVsZW1CeUlkKCdsaXN0bmV4dGRhdGUnKVxyXG4gIGRlY3JlbWVudExpc3REYXRlT2Zmc2V0KClcclxuICBkaXNwbGF5KClcclxuICBwZC5zdHlsZS5kaXNwbGF5ID0gJ2lubGluZS1ibG9jaydcclxuICByZXR1cm4gUHJvbWlzZS5yYWNlKFtcclxuICAgIGFuaW1hdGVFbCh0ZCwgW1xyXG4gICAgICB7dHJhbnNmb3JtOiAndHJhbnNsYXRlWCgtMTAwJSknLCBvcGFjaXR5OiAxfSxcclxuICAgICAge29wYWNpdHk6IDB9LFxyXG4gICAgICB7dHJhbnNmb3JtOiAndHJhbnNsYXRlWCgwJSknLCBvcGFjaXR5OiAwfVxyXG4gICAgXSwge2R1cmF0aW9uOiAzMDAsIGVhc2luZzogJ2Vhc2Utb3V0J30pLFxyXG4gICAgYW5pbWF0ZUVsKHBkLCBbXHJcbiAgICAgIHt0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKC0xMDAlKScsIG9wYWNpdHk6IDB9LFxyXG4gICAgICB7b3BhY2l0eTogMH0sXHJcbiAgICAgIHt0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKDAlKScsIG9wYWNpdHk6IDF9XHJcbiAgICBdLCB7ZHVyYXRpb246IDMwMCwgZWFzaW5nOiAnZWFzZS1vdXQnfSlcclxuICBdKS50aGVuKCgpID0+IHtcclxuICAgIG5kLmlubmVySFRNTCA9IHRkLmlubmVySFRNTFxyXG4gICAgdGQuaW5uZXJIVE1MID0gcGQuaW5uZXJIVE1MXHJcbiAgICBjb25zdCBsaXN0RGF0ZTIgPSBuZXcgRGF0ZSgpXHJcbiAgICBsaXN0RGF0ZTIuc2V0RGF0ZSgobGlzdERhdGUyLmdldERhdGUoKSArIGdldExpc3REYXRlT2Zmc2V0KCkpIC0gMSlcclxuICAgIHBkLmlubmVySFRNTCA9IGRhdGVTdHJpbmcobGlzdERhdGUyKS5yZXBsYWNlKCdUb2RheScsICdOb3cnKVxyXG4gICAgcmV0dXJuIHBkLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcclxuICB9KVxyXG59KVxyXG5cclxuLy8gV2hlbmV2ZXIgYSBkYXRlIGlzIGRvdWJsZSBjbGlja2VkLCBsb25nIHRhcHBlZCwgb3IgZm9yY2UgdG91Y2hlZCwgbGlzdCB2aWV3IGZvciB0aGF0IGRheSBpcyBkaXNwbGF5ZWQuXHJcbmZ1bmN0aW9uIHVwZGF0ZUxpc3ROYXYoKTogdm9pZCB7XHJcbiAgICBjb25zdCBkID0gbmV3IERhdGUoKVxyXG4gICAgZC5zZXREYXRlKChkLmdldERhdGUoKSArIGdldExpc3REYXRlT2Zmc2V0KCkpIC0gMSlcclxuICAgIGNvbnN0IHVwID0gKGlkOiBzdHJpbmcpID0+IHtcclxuICAgICAgICBlbGVtQnlJZChpZCkuaW5uZXJIVE1MID0gZGF0ZVN0cmluZyhkKS5yZXBsYWNlKCdUb2RheScsICdOb3cnKVxyXG4gICAgICAgIHJldHVybiBkLnNldERhdGUoZC5nZXREYXRlKCkgKyAxKVxyXG4gICAgfVxyXG4gICAgdXAoJ2xpc3RwcmV2ZGF0ZScpXHJcbiAgICB1cCgnbGlzdG5vd2RhdGUnKVxyXG4gICAgdXAoJ2xpc3RuZXh0ZGF0ZScpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHN3aXRjaFRvTGlzdChldnQ6IEV2ZW50KTogdm9pZCB7XHJcbiAgICBpZiAoXyRoKGV2dC50YXJnZXQpLmNsYXNzTGlzdC5jb250YWlucygnbW9udGgnKSB8fCBfJGgoZXZ0LnRhcmdldCkuY2xhc3NMaXN0LmNvbnRhaW5zKCdkYXRlJykpIHtcclxuICAgICAgICBzZXRMaXN0RGF0ZU9mZnNldCh0b0RhdGVOdW0oTnVtYmVyKF8kaChfJGgoZXZ0LnRhcmdldCkucGFyZW50Tm9kZSkuZ2V0QXR0cmlidXRlKCdkYXRhLWRhdGUnKSkpIC0gdG9kYXkoKSlcclxuICAgICAgICB1cGRhdGVMaXN0TmF2KClcclxuICAgICAgICBkb2N1bWVudC5ib2R5LnNldEF0dHJpYnV0ZSgnZGF0YS12aWV3JywgJzEnKVxyXG4gICAgICAgIHJldHVybiBkaXNwbGF5KClcclxuICAgIH1cclxufVxyXG5cclxuZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdkYmxjbGljaycsIHN3aXRjaFRvTGlzdClcclxuZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCd3ZWJraXRtb3VzZWZvcmNldXAnLCBzd2l0Y2hUb0xpc3QpO1xyXG4oKCkgPT4ge1xyXG4gICAgbGV0IHRhcHRpbWVyOiBudW1iZXJ8bnVsbCA9IG51bGxcclxuICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIChldnQpID0+IHRhcHRpbWVyID0gc2V0VGltZW91dCgoKCkgPT4gc3dpdGNoVG9MaXN0KGV2dCkpLCAxMDAwKSlcclxuICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCAoZXZ0KSA9PiB7XHJcbiAgICAgICAgaWYgKHRhcHRpbWVyKSBjbGVhclRpbWVvdXQodGFwdGltZXIpXHJcbiAgICAgICAgdGFwdGltZXIgPSBudWxsXHJcbiAgICB9KVxyXG59KSgpXHJcblxyXG4vLyA8YSBuYW1lPVwic2lkZVwiLz5cclxuLy8gU2lkZSBtZW51IGFuZCBOYXZiYXJcclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuLy9cclxuLy8gVGhlIFtIZWFkcm9vbSBsaWJyYXJ5XShodHRwczovL2dpdGh1Yi5jb20vV2lja3lOaWxsaWFtcy9oZWFkcm9vbS5qcykgaXMgdXNlZCB0byBzaG93IHRoZSBuYXZiYXIgd2hlbiBzY3JvbGxpbmcgdXBcclxuY29uc3QgaGVhZHJvb20gPSBuZXcgSGVhZHJvb20oXyQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbmF2JykpLCB7XHJcbiAgdG9sZXJhbmNlOiAxMCxcclxuICBvZmZzZXQ6IDY2XHJcbn0pXHJcbmhlYWRyb29tLmluaXQoKVxyXG5cclxuLy8gQWxzbywgdGhlIHNpZGUgbWVudSBuZWVkcyBldmVudCBsaXN0ZW5lcnMuXHJcbmVsZW1CeUlkKCdjb2xsYXBzZUJ1dHRvbicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gIGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJ1xyXG4gIGVsZW1CeUlkKCdzaWRlTmF2JykuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuICByZXR1cm4gZWxlbUJ5SWQoJ3NpZGVCYWNrZ3JvdW5kJykuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcclxufSlcclxuXHJcbmVsZW1CeUlkKCdzaWRlQmFja2dyb3VuZCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gIGVsZW1CeUlkKCdzaWRlQmFja2dyb3VuZCcpLnN0eWxlLm9wYWNpdHkgPSAnMCdcclxuICBlbGVtQnlJZCgnc2lkZU5hdicpLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgZWxlbUJ5SWQoJ2RyYWdUYXJnZXQnKS5zdHlsZS53aWR0aCA9ICcnXHJcbiAgcmV0dXJuIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICdhdXRvJ1xyXG4gICAgZWxlbUJ5SWQoJ3NpZGVCYWNrZ3JvdW5kJykuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xyXG4gIH1cclxuICAsIDM1MClcclxufSlcclxuXHJcbnVwZGF0ZUF2YXRhcigpXHJcblxyXG4vLyA8YSBuYW1lPVwiYXRoZW5hXCIvPiBBdGhlbmEgKFNjaG9vbG9neSlcclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tXHJcbi8vXHJcblxyXG4vLyA8YSBuYW1lPVwic2V0dGluZ3NcIi8+IFNldHRpbmdzXHJcbi8vIC0tLS0tLS0tXHJcbi8vXHJcbi8vIFRoZSBjb2RlIGJlbG93IHVwZGF0ZXMgdGhlIGN1cnJlbnQgdmVyc2lvbiB0ZXh0IGluIHRoZSBzZXR0aW5ncy4gSSBzaG91bGQndmUgcHV0IHRoaXMgdW5kZXIgdGhlXHJcbi8vIFVwZGF0ZXMgc2VjdGlvbiwgYnV0IGl0IHNob3VsZCBnbyBiZWZvcmUgdGhlIGRpc3BsYXkoKSBmdW5jdGlvbiBmb3JjZXMgYSByZWZsb3cuXHJcbmVsZW1CeUlkKCd2ZXJzaW9uJykuaW5uZXJIVE1MID0gVkVSU0lPTlxyXG5cclxuLy8gVG8gYnJpbmcgdXAgdGhlIHNldHRpbmdzIHdpbmRvd3MsIGFuIGV2ZW50IGxpc3RlbmVyIG5lZWRzIHRvIGJlIGFkZGVkIHRvIHRoZSBidXR0b24uXHJcbmVsZW1CeUlkKCdzZXR0aW5nc0InKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgIGVsZW1CeUlkKCdzaWRlQmFja2dyb3VuZCcpLmNsaWNrKClcclxuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnc2V0dGluZ3NTaG93bicpXHJcbiAgICBlbGVtQnlJZCgnYnJhbmQnKS5pbm5lckhUTUwgPSAnU2V0dGluZ3MnXHJcbiAgICByZXR1cm4gc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgXyRoKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ21haW4nKSkuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xyXG4gICAgfSlcclxufSlcclxuXHJcbi8vIFRoZSBiYWNrIGJ1dHRvbiBhbHNvIG5lZWRzIHRvIGNsb3NlIHRoZSBzZXR0aW5ncyB3aW5kb3cuXHJcbmVsZW1CeUlkKCdiYWNrQnV0dG9uJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICBfJGgoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbWFpbicpKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xyXG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdzZXR0aW5nc1Nob3duJylcclxuICAgIHJldHVybiBlbGVtQnlJZCgnYnJhbmQnKS5pbm5lckhUTUwgPSAnQ2hlY2sgUENSJ1xyXG59KVxyXG5cclxuLy8gVGhlIGNvZGUgYmVsb3cgaXMgd2hhdCB0aGUgc2V0dGluZ3MgY29udHJvbC5cclxuaWYgKHNldHRpbmdzLnNlcFRhc2tzKSB7XHJcbiAgICBlbGVtQnlJZCgnaW5mbycpLmNsYXNzTGlzdC5hZGQoJ2lzVGFza3MnKVxyXG4gICAgZWxlbUJ5SWQoJ25ldycpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcclxufVxyXG5pZiAoc2V0dGluZ3MuaG9saWRheVRoZW1lcykgeyBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ2hvbGlkYXlUaGVtZXMnKSB9XHJcbmlmIChzZXR0aW5ncy5zZXBUYXNrQ2xhc3MpIHsgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdzZXBUYXNrQ2xhc3MnKSB9XHJcbmludGVyZmFjZSBJQ29sb3JNYXAgeyBbY2xzOiBzdHJpbmddOiBzdHJpbmcgfVxyXG5sZXQgYXNzaWdubWVudENvbG9yczogSUNvbG9yTWFwID0gbG9jYWxTdG9yYWdlUmVhZCgnYXNzaWdubWVudENvbG9ycycsIHtcclxuICAgIGNsYXNzd29yazogJyM2ODlmMzgnLCBob21ld29yazogJyMyMTk2ZjMnLCBsb25ndGVybTogJyNmNTdjMDAnLCB0ZXN0OiAnI2Y0NDMzNidcclxufSlcclxubGV0IGNsYXNzQ29sb3JzID0gbG9jYWxTdG9yYWdlUmVhZCgnY2xhc3NDb2xvcnMnLCAoKSA9PiB7XHJcbiAgICBjb25zdCBjYzogSUNvbG9yTWFwID0ge31cclxuICAgIGNvbnN0IGRhdGEgPSBnZXREYXRhKClcclxuICAgIGlmICghZGF0YSkgcmV0dXJuIGNjXHJcbiAgICBkYXRhLmNsYXNzZXMuZm9yRWFjaCgoYzogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgY2NbY10gPSAnIzYxNjE2MSdcclxuICAgIH0pXHJcbiAgICByZXR1cm4gY2NcclxufSlcclxuZWxlbUJ5SWQoYCR7c2V0dGluZ3MuY29sb3JUeXBlfUNvbG9yc2ApLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsICgpID0+IHtcclxuICBpZiAoc2V0dGluZ3MucmVmcmVzaE9uRm9jdXMpIGZldGNoKClcclxufSlcclxuZnVuY3Rpb24gaW50ZXJ2YWxSZWZyZXNoKCk6IHZvaWQge1xyXG4gICAgY29uc3QgciA9IHNldHRpbmdzLnJlZnJlc2hSYXRlXHJcbiAgICBpZiAociA+IDApIHtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5kZWJ1ZygnUmVmcmVzaGluZyBiZWNhdXNlIG9mIHRpbWVyJylcclxuICAgICAgICAgICAgZmV0Y2goKVxyXG4gICAgICAgICAgICBpbnRlcnZhbFJlZnJlc2goKVxyXG4gICAgICAgIH0sIHIgKiA2MCAqIDEwMDApXHJcbiAgICB9XHJcbn1cclxuaW50ZXJ2YWxSZWZyZXNoKClcclxuXHJcbi8vIEZvciBjaG9vc2luZyBjb2xvcnMsIHRoZSBjb2xvciBjaG9vc2luZyBib3hlcyBuZWVkIHRvIGJlIGluaXRpYWxpemVkLlxyXG5jb25zdCBwYWxldHRlOiBJQ29sb3JNYXAgPSB7XHJcbiAgJyNmNDQzMzYnOiAnI0I3MUMxQycsXHJcbiAgJyNlOTFlNjMnOiAnIzg4MEU0RicsXHJcbiAgJyM5YzI3YjAnOiAnIzRBMTQ4QycsXHJcbiAgJyM2NzNhYjcnOiAnIzMxMUI5MicsXHJcbiAgJyMzZjUxYjUnOiAnIzFBMjM3RScsXHJcbiAgJyMyMTk2ZjMnOiAnIzBENDdBMScsXHJcbiAgJyMwM2E5ZjQnOiAnIzAxNTc5QicsXHJcbiAgJyMwMGJjZDQnOiAnIzAwNjA2NCcsXHJcbiAgJyMwMDk2ODgnOiAnIzAwNEQ0MCcsXHJcbiAgJyM0Y2FmNTAnOiAnIzFCNUUyMCcsXHJcbiAgJyM2ODlmMzgnOiAnIzMzNjkxRScsXHJcbiAgJyNhZmI0MmInOiAnIzgyNzcxNycsXHJcbiAgJyNmYmMwMmQnOiAnI0Y1N0YxNycsXHJcbiAgJyNmZmEwMDAnOiAnI0ZGNkYwMCcsXHJcbiAgJyNmNTdjMDAnOiAnI0U2NTEwMCcsXHJcbiAgJyNmZjU3MjInOiAnI0JGMzYwQycsXHJcbiAgJyM3OTU1NDgnOiAnIzNFMjcyMycsXHJcbiAgJyM2MTYxNjEnOiAnIzIxMjEyMSdcclxufVxyXG5cclxuZ2V0Q2xhc3NlcygpLmZvckVhY2goKGM6IHN0cmluZykgPT4ge1xyXG4gICAgY29uc3QgZCA9IGVsZW1lbnQoJ2RpdicsIFtdLCBjKVxyXG4gICAgZC5zZXRBdHRyaWJ1dGUoJ2RhdGEtY29udHJvbCcsIGMpXHJcbiAgICBkLmFwcGVuZENoaWxkKGVsZW1lbnQoJ3NwYW4nLCBbXSkpXHJcbiAgICBlbGVtQnlJZCgnY2xhc3NDb2xvcnMnKS5hcHBlbmRDaGlsZChkKVxyXG59KVxyXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY29sb3JzJykuZm9yRWFjaCgoZSkgPT4ge1xyXG4gICAgZS5xdWVyeVNlbGVjdG9yQWxsKCdkaXYnKS5mb3JFYWNoKChjb2xvcikgPT4ge1xyXG4gICAgICAgIGNvbnN0IGNvbnRyb2xsZWRDb2xvciA9IGNvbG9yLmdldEF0dHJpYnV0ZSgnZGF0YS1jb250cm9sJylcclxuICAgICAgICBpZiAoIWNvbnRyb2xsZWRDb2xvcikgdGhyb3cgbmV3IEVycm9yKCdFbGVtZW50IGhhcyBubyBjb250cm9sbGVkIGNvbG9yJylcclxuXHJcbiAgICAgICAgY29uc3Qgc3AgPSBfJGgoY29sb3IucXVlcnlTZWxlY3Rvcignc3BhbicpKVxyXG4gICAgICAgIGNvbnN0IGxpc3ROYW1lID0gZS5nZXRBdHRyaWJ1dGUoJ2lkJykgPT09ICdjbGFzc0NvbG9ycycgPyAnY2xhc3NDb2xvcnMnIDogJ2Fzc2lnbm1lbnRDb2xvcnMnXHJcbiAgICAgICAgY29uc3QgbGlzdFNldHRlciA9ICh2OiBJQ29sb3JNYXApID0+IHtcclxuICAgICAgICAgICAgZS5nZXRBdHRyaWJ1dGUoJ2lkJykgPT09ICdjbGFzc0NvbG9ycycgPyBjbGFzc0NvbG9ycyA9IHYgOiBhc3NpZ25tZW50Q29sb3JzID0gdlxyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBsaXN0ID0gZS5nZXRBdHRyaWJ1dGUoJ2lkJykgPT09ICdjbGFzc0NvbG9ycycgPyBjbGFzc0NvbG9ycyA6IGFzc2lnbm1lbnRDb2xvcnNcclxuICAgICAgICBzcC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBsaXN0W2NvbnRyb2xsZWRDb2xvcl1cclxuICAgICAgICBPYmplY3Qua2V5cyhwYWxldHRlKS5mb3JFYWNoKChwKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBlID0gZWxlbWVudCgnc3BhbicsIFtdKVxyXG4gICAgICAgICAgICBwZS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBwXHJcbiAgICAgICAgICAgIGlmIChwID09PSBsaXN0W2NvbnRyb2xsZWRDb2xvcl0pIHtcclxuICAgICAgICAgICAgICAgIHBlLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzcC5hcHBlbmRDaGlsZChwZSlcclxuICAgICAgICB9KVxyXG4gICAgICAgIGNvbnN0IGN1c3RvbSA9IGVsZW1lbnQoJ3NwYW4nLCBbJ2N1c3RvbUNvbG9yJ10sIGA8YT5DdXN0b208L2E+IFxcXHJcbiAgICA8aW5wdXQgdHlwZT0ndGV4dCcgcGxhY2Vob2xkZXI9J1dhcyAke2xpc3RbY29udHJvbGxlZENvbG9yXX0nIC8+IFxcXHJcbiAgICA8c3BhbiBjbGFzcz0nY3VzdG9tSW5mbyc+VXNlIGFueSBDU1MgdmFsaWQgY29sb3IgbmFtZSwgc3VjaCBhcyBcXFxyXG4gICAgPGNvZGU+I0Y0NDMzNjwvY29kZT4gb3IgPGNvZGU+cmdiKDY0LCA0MywgMik8L2NvZGU+IG9yIDxjb2RlPmN5YW48L2NvZGU+PC9zcGFuPiBcXFxyXG4gICAgPGEgY2xhc3M9J2N1c3RvbU9rJz5TZXQ8L2E+YClcclxuICAgICAgICBjdXN0b20uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZ0KSA9PiBldnQuc3RvcFByb3BhZ2F0aW9uKCkpXHJcbiAgICAgICAgXyQoY3VzdG9tLnF1ZXJ5U2VsZWN0b3IoJ2EnKSkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZ0KSA9PiB7XHJcbiAgICAgICAgICAgIHNwLmNsYXNzTGlzdC50b2dnbGUoJ29uQ3VzdG9tJylcclxuICAgICAgICAgICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICAgICAgfSlcclxuICAgICAgICBzcC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldnQpID0+IHtcclxuICAgICAgICAgICAgaWYgKHNwLmNsYXNzTGlzdC5jb250YWlucygnY2hvb3NlJykpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IF8kaChldnQudGFyZ2V0KVxyXG4gICAgICAgICAgICAgICAgY29uc3QgYmcgPSB0aW55Y29sb3IodGFyZ2V0LnN0eWxlLmJhY2tncm91bmRDb2xvciB8fCAnIzAwMCcpLnRvSGV4U3RyaW5nKClcclxuICAgICAgICAgICAgICAgIGxpc3RbY29udHJvbGxlZENvbG9yXSA9IGJnXHJcbiAgICAgICAgICAgICAgICBzcC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBiZ1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2VsZWN0ZWQgPSB0YXJnZXQucXVlcnlTZWxlY3RvcignLnNlbGVjdGVkJylcclxuICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJylcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRhcmdldC5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpXHJcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2VbbGlzdE5hbWVdID0gSlNPTi5zdHJpbmdpZnkobGlzdClcclxuICAgICAgICAgICAgICAgIGxpc3RTZXR0ZXIobGlzdClcclxuICAgICAgICAgICAgICAgIHVwZGF0ZUNvbG9ycygpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc3AuY2xhc3NMaXN0LnRvZ2dsZSgnY2hvb3NlJylcclxuICAgICAgICB9KVxyXG4gICAgICAgIF8kKGN1c3RvbS5xdWVyeVNlbGVjdG9yKCcuY3VzdG9tT2snKSkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZ0KSA9PiB7XHJcbiAgICAgICAgICAgIHNwLmNsYXNzTGlzdC5yZW1vdmUoJ29uQ3VzdG9tJylcclxuICAgICAgICAgICAgc3AuY2xhc3NMaXN0LnRvZ2dsZSgnY2hvb3NlJylcclxuICAgICAgICAgICAgY29uc3Qgc2VsZWN0ZWRFbCA9IHNwLnF1ZXJ5U2VsZWN0b3IoJy5zZWxlY3RlZCcpXHJcbiAgICAgICAgICAgIGlmIChzZWxlY3RlZEVsICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHNlbGVjdGVkRWwuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNwLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IChsaXN0W2NvbnRyb2xsZWRDb2xvcl0gPSBfJChjdXN0b20ucXVlcnlTZWxlY3RvcignaW5wdXQnKSkudmFsdWUpXHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZVtsaXN0TmFtZV0gPSBKU09OLnN0cmluZ2lmeShsaXN0KVxyXG4gICAgICAgICAgICB1cGRhdGVDb2xvcnMoKVxyXG4gICAgICAgICAgICByZXR1cm4gZXZ0LnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICAgICAgfSlcclxuICAgIH0pXHJcbn0pXHJcblxyXG4vLyBUaGVuLCBhIGZ1bmN0aW9uIHRoYXQgdXBkYXRlcyB0aGUgY29sb3IgcHJlZmVyZW5jZXMgaXMgZGVmaW5lZC5cclxuZnVuY3Rpb24gdXBkYXRlQ29sb3JzKCk6IHZvaWQge1xyXG4gICAgY29uc3Qgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpXHJcbiAgICBzdHlsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJykpXHJcbiAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHN0eWxlKVxyXG4gICAgY29uc3Qgc2hlZXQgPSBfJChzdHlsZS5zaGVldCkgYXMgQ1NTU3R5bGVTaGVldFxyXG5cclxuICAgIGNvbnN0IGFkZENvbG9yUnVsZSA9IChzZWxlY3Rvcjogc3RyaW5nLCBsaWdodDogc3RyaW5nLCBkYXJrOiBzdHJpbmcsIGV4dHJhID0gJycpID0+IHtcclxuICAgICAgICBjb25zdCBtaXhlZCA9IHRpbnljb2xvci5taXgobGlnaHQsICcjMUI1RTIwJywgNzApLnRvSGV4U3RyaW5nKClcclxuICAgICAgICBzaGVldC5pbnNlcnRSdWxlKGAke2V4dHJhfS5hc3NpZ25tZW50JHtzZWxlY3Rvcn0geyBiYWNrZ3JvdW5kLWNvbG9yOiAke2xpZ2h0fTsgfWAsIDApXHJcbiAgICAgICAgc2hlZXQuaW5zZXJ0UnVsZShgJHtleHRyYX0uYXNzaWdubWVudCR7c2VsZWN0b3J9LmRvbmUgeyBiYWNrZ3JvdW5kLWNvbG9yOiAke2Rhcmt9OyB9YCwgMClcclxuICAgICAgICBzaGVldC5pbnNlcnRSdWxlKGAke2V4dHJhfS5hc3NpZ25tZW50JHtzZWxlY3Rvcn06OmJlZm9yZSB7IGJhY2tncm91bmQtY29sb3I6ICR7bWl4ZWR9OyB9YCwgMClcclxuICAgICAgICBzaGVldC5pbnNlcnRSdWxlKGAke2V4dHJhfS5hc3NpZ25tZW50SXRlbSR7c2VsZWN0b3J9PmkgeyBiYWNrZ3JvdW5kLWNvbG9yOiAke2xpZ2h0fTsgfWAsIDApXHJcbiAgICAgICAgc2hlZXQuaW5zZXJ0UnVsZShgJHtleHRyYX0uYXNzaWdubWVudEl0ZW0ke3NlbGVjdG9yfS5kb25lPmkgeyBiYWNrZ3JvdW5kLWNvbG9yOiAke2Rhcmt9OyB9YCwgMClcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjcmVhdGVQYWxldHRlID0gKGNvbG9yOiBzdHJpbmcpID0+IHRpbnljb2xvcihjb2xvcikuZGFya2VuKDI0KS50b0hleFN0cmluZygpXHJcblxyXG4gICAgaWYgKHNldHRpbmdzLmNvbG9yVHlwZSA9PT0gJ2Fzc2lnbm1lbnQnKSB7XHJcbiAgICAgICAgT2JqZWN0LmVudHJpZXMoYXNzaWdubWVudENvbG9ycykuZm9yRWFjaCgoW25hbWUsIGNvbG9yXSkgPT4ge1xyXG4gICAgICAgICAgICBhZGRDb2xvclJ1bGUoYC4ke25hbWV9YCwgY29sb3IsIHBhbGV0dGVbY29sb3JdIHx8IGNyZWF0ZVBhbGV0dGUoY29sb3IpKVxyXG4gICAgICAgIH0pXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIE9iamVjdC5lbnRyaWVzKGNsYXNzQ29sb3JzKS5mb3JFYWNoKChbbmFtZSwgY29sb3JdKSA9PiB7XHJcbiAgICAgICAgICAgIGFkZENvbG9yUnVsZShgW2RhdGEtY2xhc3M9XFxcIiR7bmFtZX1cXFwiXWAsIGNvbG9yLCBwYWxldHRlW2NvbG9yXSB8fCBjcmVhdGVQYWxldHRlKGNvbG9yKSlcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGFkZENvbG9yUnVsZSgnLnRhc2snLCAnI0Y1RjVGNScsICcjRTBFMEUwJylcclxuICAgIGFkZENvbG9yUnVsZSgnLnRhc2snLCAnIzQyNDI0MicsICcjMjEyMTIxJywgJy5kYXJrICcpXHJcbn1cclxuXHJcbi8vIFRoZSBmdW5jdGlvbiB0aGVuIG5lZWRzIHRvIGJlIGNhbGxlZC5cclxudXBkYXRlQ29sb3JzKClcclxuXHJcbi8vIFRoZSBlbGVtZW50cyB0aGF0IGNvbnRyb2wgdGhlIHNldHRpbmdzIGFsc28gbmVlZCBldmVudCBsaXN0ZW5lcnNcclxuZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnNldHRpbmdzQ29udHJvbCcpLmZvckVhY2goKGUpID0+IHtcclxuICAgIGlmICghKGUgaW5zdGFuY2VvZiBIVE1MSW5wdXRFbGVtZW50KSkgcmV0dXJuXHJcbiAgICBpZiAoZS50eXBlID09PSAnY2hlY2tib3gnKSB7XHJcbiAgICAgICAgZS5jaGVja2VkID0gZ2V0U2V0dGluZyhlLm5hbWUpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGUudmFsdWUgPSBnZXRTZXR0aW5nKGUubmFtZSlcclxuICAgIH1cclxuICAgIGUuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGV2dCkgPT4ge1xyXG4gICAgICAgIGlmIChlLnR5cGUgPT09ICdjaGVja2JveCcpIHtcclxuICAgICAgICAgICAgc2V0U2V0dGluZyhlLm5hbWUsIGUuY2hlY2tlZClcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBzZXRTZXR0aW5nKGUubmFtZSwgZS52YWx1ZSlcclxuICAgICAgICB9XHJcbiAgICAgICAgc3dpdGNoIChlLm5hbWUpIHtcclxuICAgICAgICAgICAgY2FzZSAncmVmcmVzaFJhdGUnOiByZXR1cm4gaW50ZXJ2YWxSZWZyZXNoKClcclxuICAgICAgICAgICAgY2FzZSAnZWFybHlUZXN0JzogcmV0dXJuIGRpc3BsYXkoKVxyXG4gICAgICAgICAgICBjYXNlICdhc3NpZ25tZW50U3Bhbic6IHJldHVybiBkaXNwbGF5KClcclxuICAgICAgICAgICAgY2FzZSAncHJvamVjdHNJblRlc3RQYW5lJzogcmV0dXJuIGRpc3BsYXkoKVxyXG4gICAgICAgICAgICBjYXNlICdoaWRlQXNzaWdubWVudHMnOiByZXR1cm4gZGlzcGxheSgpXHJcbiAgICAgICAgICAgIGNhc2UgJ2hvbGlkYXlUaGVtZXMnOiByZXR1cm4gZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QudG9nZ2xlKCdob2xpZGF5VGhlbWVzJywgZS5jaGVja2VkKVxyXG4gICAgICAgICAgICBjYXNlICdzZXBUYXNrQ2xhc3MnOiBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC50b2dnbGUoJ3NlcFRhc2tDbGFzcycsIGUuY2hlY2tlZCk7IHJldHVybiBkaXNwbGF5KClcclxuICAgICAgICAgICAgY2FzZSAnc2VwVGFza3MnOiByZXR1cm4gZWxlbUJ5SWQoJ3NlcFRhc2tzUmVmcmVzaCcpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxufSlcclxuXHJcbi8vIFRoaXMgYWxzbyBuZWVkcyB0byBiZSBkb25lIGZvciByYWRpbyBidXR0b25zXHJcbmNvbnN0IGNvbG9yVHlwZSA9XHJcbiAgICBfJChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBpbnB1dFtuYW1lPVxcXCJjb2xvclR5cGVcXFwiXVt2YWx1ZT1cXFwiJHtzZXR0aW5ncy5jb2xvclR5cGV9XFxcIl1gKSkgYXMgSFRNTElucHV0RWxlbWVudFxyXG5jb2xvclR5cGUuY2hlY2tlZCA9IHRydWVcclxuQXJyYXkuZnJvbShkb2N1bWVudC5nZXRFbGVtZW50c0J5TmFtZSgnY29sb3JUeXBlJykpLmZvckVhY2goKGMpID0+IHtcclxuICBjLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChldnQpID0+IHtcclxuICAgIGNvbnN0IHYgPSAoXyQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaW5wdXRbbmFtZT1cImNvbG9yVHlwZVwiXTpjaGVja2VkJykpIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlXHJcbiAgICBpZiAodiAhPT0gJ2Fzc2lnbm1lbnQnICYmIHYgIT09ICdjbGFzcycpIHJldHVyblxyXG4gICAgc2V0dGluZ3MuY29sb3JUeXBlID0gdlxyXG4gICAgaWYgKHYgPT09ICdjbGFzcycpIHtcclxuICAgICAgZWxlbUJ5SWQoJ2Fzc2lnbm1lbnRDb2xvcnMnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXHJcbiAgICAgIGVsZW1CeUlkKCdjbGFzc0NvbG9ycycpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBlbGVtQnlJZCgnYXNzaWdubWVudENvbG9ycycpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXHJcbiAgICAgIGVsZW1CeUlkKCdjbGFzc0NvbG9ycycpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcclxuICAgIH1cclxuICAgIHJldHVybiB1cGRhdGVDb2xvcnMoKVxyXG4gIH0pXHJcbn0pXHJcblxyXG4vLyBUaGUgc2FtZSBnb2VzIGZvciB0ZXh0YXJlYXMuXHJcbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3RleHRhcmVhJykuZm9yRWFjaCgoZSkgPT4ge1xyXG4gIGlmICgoZS5uYW1lICE9PSAnYXRoZW5hRGF0YVJhdycpICYmIChsb2NhbFN0b3JhZ2VbZS5uYW1lXSAhPSBudWxsKSkge1xyXG4gICAgZS52YWx1ZSA9IGxvY2FsU3RvcmFnZVtlLm5hbWVdXHJcbiAgfVxyXG4gIGUuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoZXZ0KSA9PiB7XHJcbiAgICBsb2NhbFN0b3JhZ2VbZS5uYW1lXSA9IGUudmFsdWVcclxuICAgIGlmIChlLm5hbWUgPT09ICdhdGhlbmFEYXRhUmF3Jykge1xyXG4gICAgICB1cGRhdGVBdGhlbmFEYXRhKGUudmFsdWUpXHJcbiAgICB9XHJcbiAgfSlcclxufSlcclxuXHJcbi8vIDxhIG5hbWU9XCJzdGFydGluZ1wiLz5cclxuLy8gU3RhcnRpbmcgZXZlcnl0aGluZ1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tXHJcbi8vXHJcbi8vIEZpbmFsbHkhIFdlIGFyZSAoYWxtb3N0KSBkb25lIVxyXG4vL1xyXG4vLyBCZWZvcmUgZ2V0dGluZyB0byBhbnl0aGluZywgbGV0J3MgcHJpbnQgb3V0IGEgd2VsY29taW5nIG1lc3NhZ2UgdG8gdGhlIGNvbnNvbGUhXHJcbmNvbnNvbGUubG9nKCclY0NoZWNrIFBDUicsICdjb2xvcjogIzAwNDAwMDsgZm9udC1zaXplOiAzZW0nKVxyXG5jb25zb2xlLmxvZyhgJWNWZXJzaW9uICR7VkVSU0lPTn0gKENoZWNrIGJlbG93IGZvciBjdXJyZW50IHZlcnNpb24pYCwgJ2ZvbnQtc2l6ZTogMS4xZW0nKVxyXG5jb25zb2xlLmxvZyhgV2VsY29tZSB0byB0aGUgZGV2ZWxvcGVyIGNvbnNvbGUgZm9yIHlvdXIgYnJvd3NlciEgQmVzaWRlcyBsb29raW5nIGF0IHRoZSBzb3VyY2UgY29kZSwgXFxcclxueW91IGNhbiBhbHNvIHBsYXkgYXJvdW5kIHdpdGggQ2hlY2sgUENSIGJ5IGV4ZWN1dGluZyB0aGUgbGluZXMgYmVsb3c6XHJcbiVjXFx0ZmV0Y2godHJ1ZSkgICAgICAgICAgICAgICAlYy8vIFJlbG9hZHMgYWxsIG9mIHlvdXIgYXNzaWdubWVudHMgKHRoZSB0cnVlIGlzIGZvciBmb3JjaW5nIGEgcmVsb2FkIGlmIG9uZSBcXFxyXG5oYXMgYWxyZWFkeSBiZWVuIHRyaWdnZXJlZCBpbiB0aGUgbGFzdCBtaW51dGUpXHJcbiVjXFx0ZGF0YSAgICAgICAgICAgICAgICAgICAgICAlYy8vIERpc3BsYXlzIHRoZSBvYmplY3QgdGhhdCBjb250YWlucyB0aGUgZGF0YSBwYXJzZWQgZnJvbSBQQ1IncyBpbnRlcmZhY2VcclxuJWNcXHRhY3Rpdml0eSAgICAgICAgICAgICAgICAgICVjLy8gVGhlIGRhdGEgZm9yIHRoZSBhc3NpZ25tZW50cyB0aGF0IHNob3cgdXAgaW4gdGhlIGFjdGl2aXR5IHBhbmVcclxuJWNcXHRleHRyYSAgICAgICAgICAgICAgICAgICAgICVjLy8gQWxsIG9mIHRoZSB0YXNrcyB5b3UndmUgY3JlYXRlZCBieSBjbGlja2luZyB0aGUgKyBidXR0b25cclxuJWNcXHRhdGhlbmFEYXRhICAgICAgICAgICAgICAgICVjLy8gVGhlIGRhdGEgZmV0Y2hlZCBmcm9tIEF0aGVuYSAoaWYgeW91J3ZlIHBhc3RlZCB0aGUgcmF3IGRhdGEgaW50byBzZXR0aW5ncylcclxuJWNcXHRzbmFja2JhcihcIkhlbGxvIFdvcmxkIVwiKSAgJWMvLyBDcmVhdGVzIGEgc25hY2tiYXIgc2hvd2luZyB0aGUgbWVzc2FnZSBcIkhlbGxvIFdvcmxkIVwiXHJcbiVjXFx0ZGlzcGxheUVycm9yKG5ldyBFcnJvcigpKSAlYy8vIERpc3BsYXlzIHRoZSBzdGFjayB0cmFjZSBmb3IgYSByYW5kb20gZXJyb3IgKEp1c3QgZG9uJ3Qgc3VibWl0IGl0ISlcclxuJWNcXHRjbG9zZUVycm9yKCkgICAgICAgICAgICAgICVjLy8gQ2xvc2VzIHRoYXQgZGlhbG9nYCxcclxuICAgICAgICAgICAgICAgLi4uKChbXSBhcyBzdHJpbmdbXSkuY29uY2F0KC4uLkFycmF5LmZyb20obmV3IEFycmF5KDgpLCAoKSA9PiBbJ2NvbG9yOiBpbml0aWFsJywgJ2NvbG9yOiBncmV5J10pKSkpXHJcbmNvbnNvbGUubG9nKCcnKVxyXG5cclxuLy8gVGhlIFwibGFzdCB1cGRhdGVkXCIgdGV4dCBpcyBzZXQgdG8gdGhlIGNvcnJlY3QgZGF0ZS5cclxuY29uc3QgdHJpZWRMYXN0VXBkYXRlID0gbG9jYWxTdG9yYWdlUmVhZCgnbGFzdFVwZGF0ZScpXHJcbmVsZW1CeUlkKCdsYXN0VXBkYXRlJykuaW5uZXJIVE1MID0gdHJpZWRMYXN0VXBkYXRlID8gZm9ybWF0VXBkYXRlKHRyaWVkTGFzdFVwZGF0ZSkgOiAnTmV2ZXInXHJcblxyXG5pZiAobG9jYWxTdG9yYWdlUmVhZCgnZGF0YScpICE9IG51bGwpIHtcclxuICAgIC8vIE5vdyBjaGVjayBpZiB0aGVyZSdzIGFjdGl2aXR5XHJcbiAgICByZWNlbnRBY3Rpdml0eSgpLmZvckVhY2goKGl0ZW0pID0+IHtcclxuICAgICAgICBhZGRBY3Rpdml0eShpdGVtWzBdLCBpdGVtWzFdLCBuZXcgRGF0ZShpdGVtWzJdKSwgdHJ1ZSwgaXRlbVszXSlcclxuICAgIH0pXHJcblxyXG4gICAgZGlzcGxheSgpXHJcbn1cclxuXHJcbmZldGNoKClcclxuXHJcbi8vIDxhIG5hbWU9XCJldmVudHNcIi8+XHJcbi8vIEV2ZW50c1xyXG4vLyAtLS0tLS1cclxuLy9cclxuLy8gVGhlIGRvY3VtZW50IGJvZHkgbmVlZHMgdG8gYmUgZW5hYmxlZCBmb3IgaGFtbWVyLmpzIGV2ZW50cy5cclxuZGVsZXRlIEhhbW1lci5kZWZhdWx0cy5jc3NQcm9wcy51c2VyU2VsZWN0XHJcbmNvbnN0IGhhbW1lcnRpbWUgPSBuZXcgSGFtbWVyLk1hbmFnZXIoZG9jdW1lbnQuYm9keSwge1xyXG4gIHJlY29nbml6ZXJzOiBbXHJcbiAgICBbSGFtbWVyLlBhbiwge2RpcmVjdGlvbjogSGFtbWVyLkRJUkVDVElPTl9IT1JJWk9OVEFMfV1cclxuICBdXHJcbn0pXHJcblxyXG4vLyBGb3IgdG91Y2ggZGlzcGxheXMsIGhhbW1lci5qcyBpcyB1c2VkIHRvIG1ha2UgdGhlIHNpZGUgbWVudSBhcHBlYXIvZGlzYXBwZWFyLiBUaGUgY29kZSBiZWxvdyBpc1xyXG4vLyBhZGFwdGVkIGZyb20gTWF0ZXJpYWxpemUncyBpbXBsZW1lbnRhdGlvbi5cclxubGV0IG1lbnVPdXQgPSBmYWxzZVxyXG5jb25zdCBkcmFnVGFyZ2V0ID0gbmV3IEhhbW1lcihlbGVtQnlJZCgnZHJhZ1RhcmdldCcpKVxyXG5kcmFnVGFyZ2V0Lm9uKCdwYW4nLCAoZSkgPT4ge1xyXG4gIGlmIChlLnBvaW50ZXJUeXBlID09PSAndG91Y2gnKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgIGxldCB7IHggfSA9IGUuY2VudGVyXHJcbiAgICBjb25zdCB7IHkgfSA9IGUuY2VudGVyXHJcblxyXG4gICAgY29uc3Qgc0JrZyA9IGVsZW1CeUlkKCdzaWRlQmFja2dyb3VuZCcpXHJcbiAgICBzQmtnLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXHJcbiAgICBzQmtnLnN0eWxlLm9wYWNpdHkgPSAnMCdcclxuICAgIGVsZW1CeUlkKCdzaWRlTmF2JykuY2xhc3NMaXN0LmFkZCgnbWFudWFsJylcclxuXHJcbiAgICAvLyBLZWVwIHdpdGhpbiBib3VuZGFyaWVzXHJcbiAgICBpZiAoeCA+IDI0MCkge1xyXG4gICAgICB4ID0gMjQwXHJcbiAgICB9IGVsc2UgaWYgKHggPCAwKSB7XHJcbiAgICAgIHggPSAwXHJcblxyXG4gICAgICAvLyBMZWZ0IERpcmVjdGlvblxyXG4gICAgICBpZiAoeCA8IDEyMCkge1xyXG4gICAgICAgIG1lbnVPdXQgPSBmYWxzZVxyXG4gICAgICAvLyBSaWdodCBEaXJlY3Rpb25cclxuICAgICAgfSBlbHNlIGlmICh4ID49IDEyMCkge1xyXG4gICAgICAgIG1lbnVPdXQgPSB0cnVlXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBlbGVtQnlJZCgnc2lkZU5hdicpLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGVYKCR7eCAtIDI0MH1weClgXHJcbiAgICBjb25zdCBvdmVybGF5UGVyY2VudCA9IE1hdGgubWluKHggLyA0ODAsIDAuNSlcclxuICAgIHJldHVybiBzQmtnLnN0eWxlLm9wYWNpdHkgPSBTdHJpbmcob3ZlcmxheVBlcmNlbnQpXHJcbiAgfVxyXG59KVxyXG5cclxuZHJhZ1RhcmdldC5vbigncGFuZW5kJywgKGUpID0+IHtcclxuICBpZiAoZS5wb2ludGVyVHlwZSA9PT0gJ3RvdWNoJykge1xyXG4gICAgbGV0IHNpZGVOYXZcclxuICAgIGNvbnN0IHsgdmVsb2NpdHlYIH0gPSBlXHJcbiAgICAvLyBJZiB2ZWxvY2l0eVggPD0gMC4zIHRoZW4gdGhlIHVzZXIgaXMgZmxpbmdpbmcgdGhlIG1lbnUgY2xvc2VkIHNvIGlnbm9yZSBtZW51T3V0XHJcbiAgICBpZiAoKG1lbnVPdXQgJiYgKHZlbG9jaXR5WCA8PSAwLjMpKSB8fCAodmVsb2NpdHlYIDwgLTAuNSkpIHtcclxuICAgICAgc2lkZU5hdiA9IGVsZW1CeUlkKCdzaWRlTmF2JylcclxuICAgICAgc2lkZU5hdi5jbGFzc0xpc3QucmVtb3ZlKCdtYW51YWwnKVxyXG4gICAgICBzaWRlTmF2LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcbiAgICAgIHNpZGVOYXYuc3R5bGUudHJhbnNmb3JtID0gJydcclxuICAgICAgZWxlbUJ5SWQoJ2RyYWdUYXJnZXQnKS5zdHlsZS53aWR0aCA9ICcxMDAlJ1xyXG5cclxuICAgIH0gZWxzZSBpZiAoIW1lbnVPdXQgfHwgKHZlbG9jaXR5WCA+IDAuMykpIHtcclxuICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICdhdXRvJ1xyXG4gICAgICBzaWRlTmF2ID0gZWxlbUJ5SWQoJ3NpZGVOYXYnKVxyXG4gICAgICBzaWRlTmF2LmNsYXNzTGlzdC5yZW1vdmUoJ21hbnVhbCcpXHJcbiAgICAgIHNpZGVOYXYuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcclxuICAgICAgc2lkZU5hdi5zdHlsZS50cmFuc2Zvcm0gPSAnJ1xyXG4gICAgICBlbGVtQnlJZCgnc2lkZUJhY2tncm91bmQnKS5zdHlsZS5vcGFjaXR5ID0gJydcclxuICAgICAgZWxlbUJ5SWQoJ2RyYWdUYXJnZXQnKS5zdHlsZS53aWR0aCA9ICcxMHB4J1xyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IGVsZW1CeUlkKCdzaWRlQmFja2dyb3VuZCcpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcclxuICAgICAgLCAzNTApXHJcbiAgICB9XHJcbiAgfVxyXG59KVxyXG5cclxuZHJhZ1RhcmdldC5vbigndGFwJywgKGUpID0+IHtcclxuICAgIGVsZW1CeUlkKCdzaWRlQmFja2dyb3VuZCcpLmNsaWNrKClcclxuICAgIGUucHJldmVudERlZmF1bHQoKVxyXG59KVxyXG5cclxuY29uc3QgZHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZHJhZ1RhcmdldCcpXHJcblxyXG4vLyBUaGUgYWN0aXZpdHkgZmlsdGVyIGJ1dHRvbiBhbHNvIG5lZWRzIGFuIGV2ZW50IGxpc3RlbmVyLlxyXG5yaXBwbGUoZWxlbUJ5SWQoJ2ZpbHRlckFjdGl2aXR5JykpXHJcbmVsZW1CeUlkKCdmaWx0ZXJBY3Rpdml0eScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gIGVsZW1CeUlkKCdpbmZvQWN0aXZpdHknKS5jbGFzc0xpc3QudG9nZ2xlKCdmaWx0ZXInKVxyXG59KVxyXG5cclxuLy8gQXQgdGhlIHN0YXJ0LCBpdCBuZWVkcyB0byBiZSBjb3JyZWN0bHkgcG9wdWxhdGVkXHJcbmNvbnN0IGFjdGl2aXR5VHlwZXMgPSBzZXR0aW5ncy5zaG93bkFjdGl2aXR5XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVTZWxlY3ROdW0oKTogc3RyaW5nIHtcclxuICAgIGNvbnN0IGMgPSAoYm9vbDogYm9vbGVhbikgID0+IGJvb2wgPyAxIDogMFxyXG4gICAgY29uc3QgY291bnQgPSBTdHJpbmcoYyhhY3Rpdml0eVR5cGVzLmFkZCkgKyBjKGFjdGl2aXR5VHlwZXMuZWRpdCkgKyBjKGFjdGl2aXR5VHlwZXMuZGVsZXRlKSlcclxuICAgIHJldHVybiBlbGVtQnlJZCgnc2VsZWN0TnVtJykuaW5uZXJIVE1MID0gY291bnRcclxufVxyXG51cGRhdGVTZWxlY3ROdW0oKVxyXG5PYmplY3QuZW50cmllcyhhY3Rpdml0eVR5cGVzKS5mb3JFYWNoKChbdHlwZSwgZW5hYmxlZF0pID0+IHtcclxuICBpZiAodHlwZSAhPT0gJ2FkZCcgJiYgdHlwZSAhPT0gJ2VkaXQnICYmIHR5cGUgIT09ICdkZWxldGUnKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgYWN0aXZpdHkgdHlwZSAke3R5cGV9YClcclxuICB9XHJcblxyXG4gIGNvbnN0IHNlbGVjdEVsID0gZWxlbUJ5SWQodHlwZSArICdTZWxlY3QnKSBhcyBIVE1MSW5wdXRFbGVtZW50XHJcbiAgc2VsZWN0RWwuY2hlY2tlZCA9IGVuYWJsZWRcclxuICBpZiAoZW5hYmxlZCkgeyBlbGVtQnlJZCgnaW5mb0FjdGl2aXR5JykuY2xhc3NMaXN0LmFkZCh0eXBlKSB9XHJcbiAgc2VsZWN0RWwuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGV2dCkgPT4ge1xyXG4gICAgYWN0aXZpdHlUeXBlc1t0eXBlXSA9IHNlbGVjdEVsLmNoZWNrZWRcclxuICAgIGVsZW1CeUlkKCdpbmZvQWN0aXZpdHknKS5zZXRBdHRyaWJ1dGUoJ2RhdGEtZmlsdGVyZWQnLCB1cGRhdGVTZWxlY3ROdW0oKSlcclxuICAgIGVsZW1CeUlkKCdpbmZvQWN0aXZpdHknKS5jbGFzc0xpc3QudG9nZ2xlKHR5cGUpXHJcbiAgICBzZXR0aW5ncy5zaG93bkFjdGl2aXR5ID0gYWN0aXZpdHlUeXBlc1xyXG4gIH0pXHJcbn0pXHJcblxyXG4vLyBUaGUgc2hvdyBjb21wbGV0ZWQgdGFza3MgY2hlY2tib3ggaXMgc2V0IGNvcnJlY3RseSBhbmQgaXMgYXNzaWduZWQgYW4gZXZlbnQgbGlzdGVuZXIuXHJcbmNvbnN0IHNob3dEb25lVGFza3NFbCA9IGVsZW1CeUlkKCdzaG93RG9uZVRhc2tzJykgYXMgSFRNTElucHV0RWxlbWVudFxyXG5pZiAoc2V0dGluZ3Muc2hvd0RvbmVUYXNrcykge1xyXG4gIHNob3dEb25lVGFza3NFbC5jaGVja2VkID0gdHJ1ZVxyXG4gIGVsZW1CeUlkKCdpbmZvVGFza3NJbm5lcicpLmNsYXNzTGlzdC5hZGQoJ3Nob3dEb25lVGFza3MnKVxyXG59XHJcbnNob3dEb25lVGFza3NFbC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoKSA9PiB7XHJcbiAgc2V0dGluZ3Muc2hvd0RvbmVUYXNrcyA9IHNob3dEb25lVGFza3NFbC5jaGVja2VkXHJcbiAgZWxlbUJ5SWQoJ2luZm9UYXNrc0lubmVyJykuY2xhc3NMaXN0LnRvZ2dsZSgnc2hvd0RvbmVUYXNrcycsIHNldHRpbmdzLnNob3dEb25lVGFza3MpXHJcbn0pXHJcblxyXG4vLyA8YSBuYW1lPVwidXBkYXRlc1wiLz5cclxuLy8gVXBkYXRlcyBhbmQgTmV3c1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tXHJcbi8vXHJcblxyXG5pZiAobG9jYXRpb24ucHJvdG9jb2wgPT09ICdjaHJvbWUtZXh0ZW5zaW9uOicpIHsgY2hlY2tDb21taXQoKSB9XHJcblxyXG4vLyBUaGlzIHVwZGF0ZSBkaWFsb2cgYWxzbyBuZWVkcyB0byBiZSBjbG9zZWQgd2hlbiB0aGUgYnV0dG9ucyBhcmUgY2xpY2tlZC5cclxuZWxlbUJ5SWQoJ3VwZGF0ZURlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgZWxlbUJ5SWQoJ3VwZGF0ZScpLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICBlbGVtQnlJZCgndXBkYXRlQmFja2dyb3VuZCcpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcclxuICB9LCAzNTApXHJcbn0pXHJcblxyXG4vLyBGb3IgbmV3cywgdGhlIGxhdGVzdCBuZXdzIGlzIGZldGNoZWQgZnJvbSBhIEdpdEh1YiBnaXN0LlxyXG5mZXRjaE5ld3MoKVxyXG5cclxuLy8gVGhlIG5ld3MgZGlhbG9nIHRoZW4gbmVlZHMgdG8gYmUgY2xvc2VkIHdoZW4gT0sgb3IgdGhlIGJhY2tncm91bmQgaXMgY2xpY2tlZC5cclxuZnVuY3Rpb24gY2xvc2VOZXdzKCk6IHZvaWQge1xyXG4gIGVsZW1CeUlkKCduZXdzJykuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcclxuICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgIGVsZW1CeUlkKCduZXdzQmFja2dyb3VuZCcpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcclxuICB9LCAzNTApXHJcbn1cclxuXHJcbmVsZW1CeUlkKCduZXdzT2snKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsb3NlTmV3cylcclxuZWxlbUJ5SWQoJ25ld3NCYWNrZ3JvdW5kJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbG9zZU5ld3MpXHJcblxyXG4vLyBJdCBhbHNvIG5lZWRzIHRvIGJlIG9wZW5lZCB3aGVuIHRoZSBuZXdzIGJ1dHRvbiBpcyBjbGlja2VkLlxyXG5lbGVtQnlJZCgnbmV3c0InKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICBlbGVtQnlJZCgnc2lkZUJhY2tncm91bmQnKS5jbGljaygpXHJcbiAgY29uc3QgZGlzcGxheU5ld3MgPSAoKSA9PiB7XHJcbiAgICBlbGVtQnlJZCgnbmV3c0JhY2tncm91bmQnKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xyXG4gICAgcmV0dXJuIGVsZW1CeUlkKCduZXdzJykuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuICB9XHJcblxyXG4gIGlmIChlbGVtQnlJZCgnbmV3c0NvbnRlbnQnKS5jaGlsZE5vZGVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgZ2V0TmV3cyhkaXNwbGF5TmV3cylcclxuICB9IGVsc2Uge1xyXG4gICAgZGlzcGxheU5ld3MoKVxyXG4gIH1cclxufSlcclxuXHJcbi8vIFRoZSBzYW1lIGdvZXMgZm9yIHRoZSBlcnJvciBkaWFsb2cuXHJcbmZ1bmN0aW9uIGNsb3NlRXJyb3IoKTogdm9pZCB7XHJcbiAgZWxlbUJ5SWQoJ2Vycm9yJykuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcclxuICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgIGVsZW1CeUlkKCdlcnJvckJhY2tncm91bmQnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXHJcbiAgfSwgMzUwKVxyXG59XHJcblxyXG5lbGVtQnlJZCgnZXJyb3JObycpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xvc2VFcnJvcilcclxuZWxlbUJ5SWQoJ2Vycm9yQmFja2dyb3VuZCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xvc2VFcnJvcilcclxuXHJcbi8vIDxhIG5hbWU9XCJuZXdcIi8+XHJcbi8vIEFkZGluZyBuZXcgYXNzaWdubWVudHNcclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4vL1xyXG4vLyBUaGUgZXZlbnQgbGlzdGVuZXJzIGZvciB0aGUgbmV3IGJ1dHRvbnMgYXJlIGFkZGVkLlxyXG5yaXBwbGUoZWxlbUJ5SWQoJ25ldycpKVxyXG5yaXBwbGUoZWxlbUJ5SWQoJ25ld1Rhc2snKSlcclxuY29uc3Qgb25OZXdUYXNrID0gKCkgPT4ge1xyXG4gIHVwZGF0ZU5ld1RpcHMoKGVsZW1CeUlkKCduZXdUZXh0JykgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWUgPSAnJylcclxuICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbidcclxuICBlbGVtQnlJZCgnbmV3QmFja2dyb3VuZCcpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXHJcbiAgZWxlbUJ5SWQoJ25ld0RpYWxvZycpLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcbiAgZWxlbUJ5SWQoJ25ld1RleHQnKS5mb2N1cygpXHJcbn1cclxuZWxlbUJ5SWQoJ25ldycpLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBvbk5ld1Rhc2spXHJcbmVsZW1CeUlkKCduZXdUYXNrJykuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG9uTmV3VGFzaylcclxuXHJcbi8vIEEgZnVuY3Rpb24gdG8gY2xvc2UgdGhlIGRpYWxvZyBpcyB0aGVuIGRlZmluZWQuXHJcbmZ1bmN0aW9uIGNsb3NlTmV3KCk6IHZvaWQge1xyXG4gIGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnYXV0bydcclxuICBlbGVtQnlJZCgnbmV3RGlhbG9nJykuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcclxuICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgIGVsZW1CeUlkKCduZXdCYWNrZ3JvdW5kJykuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xyXG4gIH0sIDM1MClcclxufVxyXG5cclxuLy8gVGhpcyBmdW5jdGlvbiBpcyBzZXQgdG8gYmUgY2FsbGVkIGNhbGxlZCB3aGVuIHRoZSBFU0Mga2V5IGlzIGNhbGxlZCBpbnNpZGUgb2YgdGhlIGRpYWxvZy5cclxuZWxlbUJ5SWQoJ25ld1RleHQnKS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGV2dCkgPT4ge1xyXG4gIGlmIChldnQud2hpY2ggPT09IDI3KSB7IC8vIEVzY2FwZSBrZXkgcHJlc3NlZFxyXG4gICAgY2xvc2VOZXcoKVxyXG4gIH1cclxufSlcclxuXHJcbi8vIEFuIGV2ZW50IGxpc3RlbmVyIHRvIGNhbGwgdGhlIGZ1bmN0aW9uIGlzIGFsc28gYWRkZWQgdG8gdGhlIFggYnV0dG9uXHJcbmVsZW1CeUlkKCduZXdDYW5jZWwnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsb3NlTmV3KVxyXG5cclxuLy8gV2hlbiB0aGUgZW50ZXIga2V5IGlzIHByZXNzZWQgb3IgdGhlIHN1Ym1pdCBidXR0b24gaXMgY2xpY2tlZCwgdGhlIG5ldyBhc3NpZ25tZW50IGlzIGFkZGVkLlxyXG5lbGVtQnlJZCgnbmV3RGlhbG9nJykuYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgKGV2dCkgPT4ge1xyXG4gIGV2dC5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgY29uc3QgdGV4dCA9IChlbGVtQnlJZCgnbmV3VGV4dCcpIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlXHJcbiAgY29uc3QgeyBjbHMsIGR1ZSwgc3QgfSA9IHBhcnNlQ3VzdG9tVGFzayh0ZXh0KVxyXG4gIGxldCBlbmQ6ICdGb3JldmVyJ3xudW1iZXIgPSAnRm9yZXZlcidcclxuXHJcbiAgY29uc3Qgc3RhcnQgPSAoc3QgIT0gbnVsbCkgPyB0b0RhdGVOdW0oY2hyb25vLnBhcnNlRGF0ZShzdCkpIDogdG9kYXkoKVxyXG4gIGlmIChkdWUgIT0gbnVsbCkge1xyXG4gICAgZW5kID0gc3RhcnRcclxuICAgIGlmIChlbmQgPCBzdGFydCkgeyAvLyBBc3NpZ25tZW50IGVuZHMgYmVmb3JlIGl0IGlzIGFzc2lnbmVkXHJcbiAgICAgIGVuZCArPSBNYXRoLmNlaWwoKHN0YXJ0IC0gZW5kKSAvIDcpICogN1xyXG4gICAgfVxyXG4gIH1cclxuICBhZGRUb0V4dHJhKHtcclxuICAgIGJvZHk6IHRleHQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB0ZXh0LnN1YnN0cigxKSxcclxuICAgIGRvbmU6IGZhbHNlLFxyXG4gICAgc3RhcnQsXHJcbiAgICBjbGFzczogKGNscyAhPSBudWxsKSA/IGNscy50b0xvd2VyQ2FzZSgpLnRyaW0oKSA6IG51bGwsXHJcbiAgICBlbmRcclxuICB9KVxyXG4gIHNhdmVFeHRyYSgpXHJcbiAgY2xvc2VOZXcoKVxyXG4gIGRpc3BsYXkoZmFsc2UpXHJcbn0pXHJcblxyXG51cGRhdGVOZXdUaXBzKCcnLCBmYWxzZSlcclxuZWxlbUJ5SWQoJ25ld1RleHQnKS5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsICgpID0+IHtcclxuICByZXR1cm4gdXBkYXRlTmV3VGlwcygoZWxlbUJ5SWQoJ25ld1RleHQnKSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSlcclxufSlcclxuXHJcbi8vIFRoZSBjb2RlIGJlbG93IHJlZ2lzdGVycyBhIHNlcnZpY2Ugd29ya2VyIHRoYXQgY2FjaGVzIHRoZSBwYWdlIHNvIGl0IGNhbiBiZSB2aWV3ZWQgb2ZmbGluZS5cclxuaWYgKCdzZXJ2aWNlV29ya2VyJyBpbiBuYXZpZ2F0b3IpIHtcclxuICBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5yZWdpc3RlcignL3NlcnZpY2Utd29ya2VyLmpzJylcclxuICAgIC50aGVuKChyZWdpc3RyYXRpb24pID0+XHJcbiAgICAgIC8vIFJlZ2lzdHJhdGlvbiB3YXMgc3VjY2Vzc2Z1bFxyXG4gICAgICBjb25zb2xlLmxvZygnU2VydmljZVdvcmtlciByZWdpc3RyYXRpb24gc3VjY2Vzc2Z1bCB3aXRoIHNjb3BlJywgcmVnaXN0cmF0aW9uLnNjb3BlKSkuY2F0Y2goKGVycikgPT5cclxuICAgICAgLy8gcmVnaXN0cmF0aW9uIGZhaWxlZCA6KFxyXG4gICAgICBjb25zb2xlLmxvZygnU2VydmljZVdvcmtlciByZWdpc3RyYXRpb24gZmFpbGVkOiAnLCBlcnIpXHJcbiAgKVxyXG59XHJcblxyXG4vLyBJZiB0aGUgc2VydmljZSB3b3JrZXIgZGV0ZWN0cyB0aGF0IHRoZSB3ZWIgYXBwIGhhcyBiZWVuIHVwZGF0ZWQsIHRoZSBjb21taXQgaXMgZmV0Y2hlZCBmcm9tIEdpdEh1Yi5cclxubmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIChldmVudCkgPT4ge1xyXG4gICAgY29uc29sZS5sb2coJ0dldHRpbmcgY29tbWl0IGJlY2F1c2Ugb2Ygc2VydmljZXdvcmtlcicpXHJcbiAgICBpZiAoZXZlbnQuZGF0YS5nZXRDb21taXQpIHsgcmV0dXJuIGNoZWNrQ29tbWl0KCkgfVxyXG59KVxyXG4iLCJpbXBvcnQgeyBjbGFzc0J5SWQsIGdldERhdGEsIElBc3NpZ25tZW50IH0gZnJvbSAnLi4vcGNyJ1xyXG5pbXBvcnQgeyBBY3Rpdml0eVR5cGUgfSBmcm9tICcuLi9wbHVnaW5zL2FjdGl2aXR5J1xyXG5pbXBvcnQgeyBhc3NpZ25tZW50SW5Eb25lIH0gZnJvbSAnLi4vcGx1Z2lucy9kb25lJ1xyXG5pbXBvcnQgeyBfJCwgZGF0ZVN0cmluZywgZWxlbUJ5SWQsIGVsZW1lbnQsIHNtb290aFNjcm9sbCB9IGZyb20gJy4uL3V0aWwnXHJcbmltcG9ydCB7IHNlcGFyYXRlIH0gZnJvbSAnLi9hc3NpZ25tZW50J1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFkZEFjdGl2aXR5RWxlbWVudChlbDogSFRNTEVsZW1lbnQpOiB2b2lkIHtcclxuICAgIGNvbnN0IGluc2VydFRvID0gZWxlbUJ5SWQoJ2luZm9BY3Rpdml0eScpXHJcbiAgICBpbnNlcnRUby5pbnNlcnRCZWZvcmUoZWwsIGluc2VydFRvLnF1ZXJ5U2VsZWN0b3IoJy5hY3Rpdml0eScpKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQWN0aXZpdHkodHlwZTogQWN0aXZpdHlUeXBlLCBhc3NpZ25tZW50OiBJQXNzaWdubWVudCwgZGF0ZTogRGF0ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT86IHN0cmluZyApOiBIVE1MRWxlbWVudCB7XHJcbiAgICBjb25zdCBjbmFtZSA9IGNsYXNzTmFtZSB8fCBjbGFzc0J5SWQoYXNzaWdubWVudC5jbGFzcylcclxuXHJcbiAgICBjb25zdCB0ZSA9IGVsZW1lbnQoJ2RpdicsIFsnYWN0aXZpdHknLCAnYXNzaWdubWVudEl0ZW0nLCBhc3NpZ25tZW50LmJhc2VUeXBlLCB0eXBlXSwgYFxyXG4gICAgICAgIDxpIGNsYXNzPSdtYXRlcmlhbC1pY29ucyc+JHt0eXBlfTwvaT5cclxuICAgICAgICA8c3BhbiBjbGFzcz0ndGl0bGUnPiR7YXNzaWdubWVudC50aXRsZX08L3NwYW4+XHJcbiAgICAgICAgPHNtYWxsPiR7c2VwYXJhdGUoY25hbWUpWzJdfTwvc21hbGw+XHJcbiAgICAgICAgPGRpdiBjbGFzcz0ncmFuZ2UnPiR7ZGF0ZVN0cmluZyhkYXRlKX08L2Rpdj5gLCBgYWN0aXZpdHkke2Fzc2lnbm1lbnQuaWR9YClcclxuICAgIHRlLnNldEF0dHJpYnV0ZSgnZGF0YS1jbGFzcycsIGNuYW1lKVxyXG4gICAgY29uc3QgeyBpZCB9ID0gYXNzaWdubWVudFxyXG4gICAgaWYgKHR5cGUgIT09ICdkZWxldGUnKSB7XHJcbiAgICAgICAgdGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRvU2Nyb2xsaW5nID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZWwgPSBfJChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAuYXNzaWdubWVudFtpZCo9XFxcIiR7aWR9XFxcIl1gKSkgYXMgSFRNTEVsZW1lbnRcclxuICAgICAgICAgICAgICAgIGF3YWl0IHNtb290aFNjcm9sbCgoZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wICsgZG9jdW1lbnQuYm9keS5zY3JvbGxUb3ApIC0gMTE2KVxyXG4gICAgICAgICAgICAgICAgZWwuY2xpY2soKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5ib2R5LmdldEF0dHJpYnV0ZSgnZGF0YS12aWV3JykgPT09ICcwJykge1xyXG4gICAgICAgICAgICByZXR1cm4gZG9TY3JvbGxpbmcoKVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgKF8kKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNuYXZUYWJzPmxpOmZpcnN0LWNoaWxkJykpIGFzIEhUTUxFbGVtZW50KS5jbGljaygpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc2V0VGltZW91dChkb1Njcm9sbGluZywgNTAwKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBpZiAoYXNzaWdubWVudEluRG9uZShhc3NpZ25tZW50LmlkKSkge1xyXG4gICAgICB0ZS5jbGFzc0xpc3QuYWRkKCdkb25lJylcclxuICAgIH1cclxuICAgIHJldHVybiB0ZVxyXG59XHJcbiIsImltcG9ydCB7IGZyb21EYXRlTnVtLCB0b2RheSB9IGZyb20gJy4uL2RhdGVzJ1xyXG5pbXBvcnQgeyBkaXNwbGF5LCBnZXRUaW1lQWZ0ZXIsIElTcGxpdEFzc2lnbm1lbnQgfSBmcm9tICcuLi9kaXNwbGF5J1xyXG5pbXBvcnQgeyBnZXRMaXN0RGF0ZU9mZnNldCB9IGZyb20gJy4uL25hdmlnYXRpb24nXHJcbmltcG9ydCB7IGdldEF0dGFjaG1lbnRNaW1lVHlwZSwgSUFwcGxpY2F0aW9uRGF0YSwgSUFzc2lnbm1lbnQsIHVybEZvckF0dGFjaG1lbnQgfSBmcm9tICcuLi9wY3InXHJcbmltcG9ydCB7IHJlY2VudEFjdGl2aXR5IH0gZnJvbSAnLi4vcGx1Z2lucy9hY3Rpdml0eSdcclxuaW1wb3J0IHsgZ2V0QXRoZW5hRGF0YSB9IGZyb20gJy4uL3BsdWdpbnMvYXRoZW5hJ1xyXG5pbXBvcnQgeyByZW1vdmVGcm9tRXh0cmEsIHNhdmVFeHRyYSB9IGZyb20gJy4uL3BsdWdpbnMvY3VzdG9tQXNzaWdubWVudHMnXHJcbmltcG9ydCB7IGFkZFRvRG9uZSwgYXNzaWdubWVudEluRG9uZSwgcmVtb3ZlRnJvbURvbmUsIHNhdmVEb25lIH0gZnJvbSAnLi4vcGx1Z2lucy9kb25lJ1xyXG5pbXBvcnQgeyBtb2RpZmllZEJvZHksIHJlbW92ZUZyb21Nb2RpZmllZCwgc2F2ZU1vZGlmaWVkLCBzZXRNb2RpZmllZCB9IGZyb20gJy4uL3BsdWdpbnMvbW9kaWZpZWRBc3NpZ25tZW50cydcclxuaW1wb3J0IHsgc2V0dGluZ3MgfSBmcm9tICcuLi9zZXR0aW5ncydcclxuaW1wb3J0IHsgXyQsIGNzc051bWJlciwgZGF0ZVN0cmluZywgZWxlbUJ5SWQsIGVsZW1lbnQsIGZvcmNlTGF5b3V0LCByaXBwbGUgfSBmcm9tICcuLi91dGlsJ1xyXG5pbXBvcnQgeyByZXNpemUgfSBmcm9tICcuL3Jlc2l6ZXInXHJcblxyXG5jb25zdCBtaW1lVHlwZXM6IHsgW21pbWU6IHN0cmluZ106IFtzdHJpbmcsIHN0cmluZ10gfSA9IHtcclxuICAgICdhcHBsaWNhdGlvbi9tc3dvcmQnOiBbJ1dvcmQgRG9jJywgJ2RvY3VtZW50J10sXHJcbiAgICAnYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LndvcmRwcm9jZXNzaW5nbWwuZG9jdW1lbnQnOiBbJ1dvcmQgRG9jJywgJ2RvY3VtZW50J10sXHJcbiAgICAnYXBwbGljYXRpb24vdm5kLm1zLXBvd2VycG9pbnQnOiBbJ1BQVCBQcmVzZW50YXRpb24nLCAnc2xpZGVzJ10sXHJcbiAgICAnYXBwbGljYXRpb24vcGRmJzogWydQREYgRmlsZScsICdwZGYnXSxcclxuICAgICd0ZXh0L3BsYWluJzogWydUZXh0IERvYycsICdwbGFpbiddXHJcbn1cclxuXHJcbmNvbnN0IGRtcCA9IG5ldyBkaWZmX21hdGNoX3BhdGNoKCkgLy8gRm9yIGRpZmZpbmdcclxuXHJcbmZ1bmN0aW9uIHBvcHVsYXRlQWRkZWREZWxldGVkKGRpZmZzOiBhbnlbXSwgZWRpdHM6IEhUTUxFbGVtZW50KTogYm9vbGVhbiB7XHJcbiAgICBsZXQgYWRkZWQgPSAwXHJcbiAgICBsZXQgZGVsZXRlZCA9IDBcclxuICAgIGRpZmZzLmZvckVhY2goKGRpZmYpID0+IHtcclxuICAgICAgICBpZiAoZGlmZlswXSA9PT0gMSkgeyBhZGRlZCsrIH1cclxuICAgICAgICBpZiAoZGlmZlswXSA9PT0gLTEpIHsgZGVsZXRlZCsrIH1cclxuICAgIH0pXHJcbiAgICBfJChlZGl0cy5xdWVyeVNlbGVjdG9yKCcuYWRkaXRpb25zJykpLmlubmVySFRNTCA9IGFkZGVkICE9PSAwID8gYCske2FkZGVkfWAgOiAnJ1xyXG4gICAgXyQoZWRpdHMucXVlcnlTZWxlY3RvcignLmRlbGV0aW9ucycpKS5pbm5lckhUTUwgPSBkZWxldGVkICE9PSAwID8gYC0ke2RlbGV0ZWR9YCA6ICcnXHJcbiAgICBlZGl0cy5jbGFzc0xpc3QuYWRkKCdub3RFbXB0eScpXHJcbiAgICByZXR1cm4gYWRkZWQgPiAwIHx8IGRlbGV0ZWQgPiAwXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjb21wdXRlV2Vla0lkKHNwbGl0OiBJU3BsaXRBc3NpZ25tZW50KTogc3RyaW5nIHtcclxuICAgIGNvbnN0IHN0YXJ0U3VuID0gbmV3IERhdGUoc3BsaXQuc3RhcnQuZ2V0VGltZSgpKVxyXG4gICAgc3RhcnRTdW4uc2V0RGF0ZShzdGFydFN1bi5nZXREYXRlKCkgLSBzdGFydFN1bi5nZXREYXkoKSlcclxuICAgIHJldHVybiBgd2ske3N0YXJ0U3VuLmdldE1vbnRoKCl9LSR7c3RhcnRTdW4uZ2V0RGF0ZSgpfWBcclxufVxyXG5cclxuLy8gVGhpcyBmdW5jdGlvbiBzZXBhcmF0ZXMgdGhlIHBhcnRzIG9mIGEgY2xhc3MgbmFtZS5cclxuZXhwb3J0IGZ1bmN0aW9uIHNlcGFyYXRlKGNsOiBzdHJpbmcpOiBSZWdFeHBNYXRjaEFycmF5IHtcclxuICAgIGNvbnN0IG0gPSBjbC5tYXRjaCgvKCg/OlxcZCpcXHMrKT8oPzooPzpob25cXHcqfCg/OmFkdlxcdypcXHMqKT9jb3JlKVxccyspPykoLiopL2kpXHJcbiAgICBpZiAobSA9PSBudWxsKSB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBzZXBhcmF0ZSBjbGFzcyBzdHJpbmcgJHtjbH1gKVxyXG4gICAgcmV0dXJuIG1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFzc2lnbm1lbnRDbGFzcyhhc3NpZ25tZW50OiBJQXNzaWdubWVudCwgZGF0YTogSUFwcGxpY2F0aW9uRGF0YSk6IHN0cmluZyB7XHJcbiAgICBjb25zdCBjbHMgPSAoYXNzaWdubWVudC5jbGFzcyAhPSBudWxsKSA/IGRhdGEuY2xhc3Nlc1thc3NpZ25tZW50LmNsYXNzXSA6ICdUYXNrJ1xyXG4gICAgaWYgKGNscyA9PSBudWxsKSB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBmaW5kIGNsYXNzICR7YXNzaWdubWVudC5jbGFzc30gaW4gJHtkYXRhLmNsYXNzZXN9YClcclxuICAgIHJldHVybiBjbHNcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNlcGFyYXRlZENsYXNzKGFzc2lnbm1lbnQ6IElBc3NpZ25tZW50LCBkYXRhOiBJQXBwbGljYXRpb25EYXRhKTogUmVnRXhwTWF0Y2hBcnJheSB7XHJcbiAgICByZXR1cm4gc2VwYXJhdGUoYXNzaWdubWVudENsYXNzKGFzc2lnbm1lbnQsIGRhdGEpKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQXNzaWdubWVudChzcGxpdDogSVNwbGl0QXNzaWdubWVudCwgZGF0YTogSUFwcGxpY2F0aW9uRGF0YSk6IEhUTUxFbGVtZW50IHtcclxuICAgIGNvbnN0IHsgYXNzaWdubWVudCwgcmVmZXJlbmNlIH0gPSBzcGxpdFxyXG5cclxuICAgIC8vIFNlcGFyYXRlIHRoZSBjbGFzcyBkZXNjcmlwdGlvbiBmcm9tIHRoZSBhY3R1YWwgY2xhc3NcclxuICAgIGNvbnN0IHNlcGFyYXRlZCA9IHNlcGFyYXRlZENsYXNzKGFzc2lnbm1lbnQsIGRhdGEpXHJcblxyXG4gICAgY29uc3Qgd2Vla0lkID0gY29tcHV0ZVdlZWtJZChzcGxpdClcclxuXHJcbiAgICBsZXQgc21hbGxUYWcgPSAnc21hbGwnXHJcbiAgICBsZXQgbGluayA9IG51bGxcclxuICAgIGNvbnN0IGF0aGVuYURhdGEgPSBnZXRBdGhlbmFEYXRhKClcclxuICAgIGlmIChhdGhlbmFEYXRhICYmIGFzc2lnbm1lbnQuY2xhc3MgIT0gbnVsbCAmJiAoYXRoZW5hRGF0YVtkYXRhLmNsYXNzZXNbYXNzaWdubWVudC5jbGFzc11dICE9IG51bGwpKSB7XHJcbiAgICAgICAgbGluayA9IGF0aGVuYURhdGFbZGF0YS5jbGFzc2VzW2Fzc2lnbm1lbnQuY2xhc3NdXS5saW5rXHJcbiAgICAgICAgc21hbGxUYWcgPSAnYSdcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBlID0gZWxlbWVudCgnZGl2JywgWydhc3NpZ25tZW50JywgYXNzaWdubWVudC5iYXNlVHlwZSwgJ2FuaW0nXSxcclxuICAgICAgICAgICAgICAgICAgICAgIGA8JHtzbWFsbFRhZ30ke2xpbmsgPyBgIGhyZWY9JyR7bGlua30nIGNsYXNzPSdsaW5rZWQnIHRhcmdldD0nX2JsYW5rJ2AgOiAnJ30+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPSdleHRyYSc+JHtzZXBhcmF0ZWRbMV19PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAke3NlcGFyYXRlZFsyXX1cclxuICAgICAgICAgICAgICAgICAgICAgICA8LyR7c21hbGxUYWd9PjxzcGFuIGNsYXNzPSd0aXRsZSc+JHthc3NpZ25tZW50LnRpdGxlfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT0naGlkZGVuJyBjbGFzcz0nZHVlJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT0nJHthc3NpZ25tZW50LmVuZCA9PT0gJ0ZvcmV2ZXInID8gMCA6IGFzc2lnbm1lbnQuZW5kfScgLz5gLFxyXG4gICAgICAgICAgICAgICAgICAgICAgYXNzaWdubWVudC5pZCArIHdlZWtJZClcclxuXHJcbiAgICBpZiAoKCByZWZlcmVuY2UgJiYgcmVmZXJlbmNlLmRvbmUpIHx8IGFzc2lnbm1lbnRJbkRvbmUoYXNzaWdubWVudC5pZCkpIHtcclxuICAgICAgICBlLmNsYXNzTGlzdC5hZGQoJ2RvbmUnKVxyXG4gICAgfVxyXG4gICAgZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtY2xhc3MnLCBhc3NpZ25tZW50Q2xhc3MoYXNzaWdubWVudCwgZGF0YSkpXHJcbiAgICBjb25zdCBjbG9zZSA9IGVsZW1lbnQoJ2EnLCBbJ2Nsb3NlJywgJ21hdGVyaWFsLWljb25zJ10sICdjbG9zZScpXHJcbiAgICBjbG9zZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsb3NlT3BlbmVkKVxyXG4gICAgZS5hcHBlbmRDaGlsZChjbG9zZSlcclxuXHJcbiAgICAvLyBQcmV2ZW50IGNsaWNraW5nIHRoZSBjbGFzcyBuYW1lIHdoZW4gYW4gaXRlbSBpcyBkaXNwbGF5ZWQgb24gdGhlIGNhbGVuZGFyIGZyb20gZG9pbmcgYW55dGhpbmdcclxuICAgIGlmIChsaW5rICE9IG51bGwpIHtcclxuICAgICAgICBfJChlLnF1ZXJ5U2VsZWN0b3IoJ2EnKSkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZ0KSA9PiB7XHJcbiAgICAgICAgICAgIGlmICgoZG9jdW1lbnQuYm9keS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmlldycpID09PSAnMCcpICYmICFlLmNsYXNzTGlzdC5jb250YWlucygnZnVsbCcpKSB7XHJcbiAgICAgICAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjb21wbGV0ZSA9IGVsZW1lbnQoJ2EnLCBbJ2NvbXBsZXRlJywgJ21hdGVyaWFsLWljb25zJywgJ3dhdmVzJ10sICdkb25lJylcclxuICAgIHJpcHBsZShjb21wbGV0ZSlcclxuICAgIGNvbnN0IGlkID0gc3BsaXQuYXNzaWdubWVudC5pZFxyXG4gICAgY29tcGxldGUuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIChldnQpID0+IHtcclxuICAgICAgICBpZiAoZXZ0LndoaWNoID09PSAxKSB7IC8vIExlZnQgYnV0dG9uXHJcbiAgICAgICAgICAgIGxldCBhZGRlZCA9IHRydWVcclxuICAgICAgICAgICAgaWYgKHJlZmVyZW5jZSAhPSBudWxsKSB7IC8vIFRhc2sgaXRlbVxyXG4gICAgICAgICAgICAgICAgaWYgKGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdkb25lJykpIHtcclxuICAgICAgICAgICAgICAgICAgICByZWZlcmVuY2UuZG9uZSA9IGZhbHNlXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGFkZGVkID0gZmFsc2VcclxuICAgICAgICAgICAgICAgICAgICByZWZlcmVuY2UuZG9uZSA9IHRydWVcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHNhdmVFeHRyYSgpXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZS5jbGFzc0xpc3QuY29udGFpbnMoJ2RvbmUnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlbW92ZUZyb21Eb25lKGFzc2lnbm1lbnQuaWQpXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGFkZGVkID0gZmFsc2VcclxuICAgICAgICAgICAgICAgICAgICBhZGRUb0RvbmUoYXNzaWdubWVudC5pZClcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHNhdmVEb25lKClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuYm9keS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmlldycpID09PSAnMScpIHtcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFxyXG4gICAgICAgICAgICAgICAgICAgIGAuYXNzaWdubWVudFtpZF49XFxcIiR7aWR9XFxcIl0sICN0ZXN0JHtpZH0sICNhY3Rpdml0eSR7aWR9LCAjaWEke2lkfWBcclxuICAgICAgICAgICAgICAgICkuZm9yRWFjaCgoZWxlbSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZW0uY2xhc3NMaXN0LnRvZ2dsZSgnZG9uZScpXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgaWYgKGFkZGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5hc3NpZ25tZW50Lmxpc3REaXNwOm5vdCguZG9uZSknKS5sZW5ndGggIT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdub0xpc3QnKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5hc3NpZ25tZW50Lmxpc3REaXNwOm5vdCguZG9uZSknKS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdub0xpc3QnKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJlc2l6ZSgpXHJcbiAgICAgICAgICAgIH0sIDEwMClcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFxyXG4gICAgICAgICAgICAgICAgYC5hc3NpZ25tZW50W2lkXj1cXFwiJHtpZH1cXFwiXSwgI3Rlc3Qke2lkfSwgI2FjdGl2aXR5JHtpZH0sICNpYSR7aWR9YFxyXG4gICAgICAgICAgICApLmZvckVhY2goKGVsZW0pID0+IHtcclxuICAgICAgICAgICAgICAgIGVsZW0uY2xhc3NMaXN0LnRvZ2dsZSgnZG9uZScpXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIGlmIChhZGRlZCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5hc3NpZ25tZW50Lmxpc3REaXNwOm5vdCguZG9uZSknKS5sZW5ndGggIT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ25vTGlzdCcpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmFzc2lnbm1lbnQubGlzdERpc3A6bm90KC5kb25lKScpLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnbm9MaXN0JylcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICAgIGUuYXBwZW5kQ2hpbGQoY29tcGxldGUpXHJcblxyXG4gICAgLy8gSWYgdGhlIGFzc2lnbm1lbnQgaXMgYSBjdXN0b20gb25lLCBhZGQgYSBidXR0b24gdG8gZGVsZXRlIGl0XHJcbiAgICBpZiAoc3BsaXQuY3VzdG9tKSB7XHJcbiAgICAgICAgY29uc3QgZGVsZXRlQSA9IGVsZW1lbnQoJ2EnLCBbJ21hdGVyaWFsLWljb25zJywgJ2RlbGV0ZUFzc2lnbm1lbnQnLCAnd2F2ZXMnXSwgJ2RlbGV0ZScpXHJcbiAgICAgICAgcmlwcGxlKGRlbGV0ZUEpXHJcbiAgICAgICAgZGVsZXRlQS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgKGV2dCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXZ0LndoaWNoICE9PSAxIHx8ICFyZWZlcmVuY2UpIHJldHVyblxyXG4gICAgICAgICAgICByZW1vdmVGcm9tRXh0cmEocmVmZXJlbmNlKVxyXG4gICAgICAgICAgICBzYXZlRXh0cmEoKVxyXG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZ1bGwnKSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2F1dG8nXHJcbiAgICAgICAgICAgICAgICBjb25zdCBiYWNrID0gZWxlbUJ5SWQoJ2JhY2tncm91bmQnKVxyXG4gICAgICAgICAgICAgICAgYmFjay5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmFjay5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXHJcbiAgICAgICAgICAgICAgICB9LCAzNTApXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZS5yZW1vdmUoKVxyXG4gICAgICAgICAgICBkaXNwbGF5KGZhbHNlKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgZS5hcHBlbmRDaGlsZChkZWxldGVBKVxyXG4gICAgfVxyXG5cclxuICAgIC8vIE1vZGlmaWNhdGlvbiBidXR0b25cclxuICAgIGNvbnN0IGVkaXQgPSBlbGVtZW50KCdhJywgWydlZGl0QXNzaWdubWVudCcsICdtYXRlcmlhbC1pY29ucycsICd3YXZlcyddLCAnZWRpdCcpXHJcbiAgICBlZGl0LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCAoZXZ0KSA9PiB7XHJcbiAgICAgICAgaWYgKGV2dC53aGljaCA9PT0gMSkge1xyXG4gICAgICAgICAgICBjb25zdCByZW1vdmUgPSBlZGl0LmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJylcclxuICAgICAgICAgICAgZWRpdC5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnKVxyXG4gICAgICAgICAgICBfJChlLnF1ZXJ5U2VsZWN0b3IoJy5ib2R5JykpLnNldEF0dHJpYnV0ZSgnY29udGVudEVkaXRhYmxlJywgcmVtb3ZlID8gJ2ZhbHNlJyA6ICd0cnVlJylcclxuICAgICAgICAgICAgaWYgKCFyZW1vdmUpIHtcclxuICAgICAgICAgICAgICAgIChlLnF1ZXJ5U2VsZWN0b3IoJy5ib2R5JykgYXMgSFRNTEVsZW1lbnQpLmZvY3VzKClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBkbiA9IGUucXVlcnlTZWxlY3RvcignLmNvbXBsZXRlJykgYXMgSFRNTEVsZW1lbnRcclxuICAgICAgICAgICAgZG4uc3R5bGUuZGlzcGxheSA9IHJlbW92ZSA/ICdibG9jaycgOiAnbm9uZSdcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICAgcmlwcGxlKGVkaXQpXHJcblxyXG4gICAgZS5hcHBlbmRDaGlsZChlZGl0KVxyXG5cclxuICAgIGNvbnN0IHN0YXJ0ID0gbmV3IERhdGUoZnJvbURhdGVOdW0oYXNzaWdubWVudC5zdGFydCkpXHJcbiAgICBjb25zdCBlbmQgPSBhc3NpZ25tZW50LmVuZCA9PT0gJ0ZvcmV2ZXInID8gYXNzaWdubWVudC5lbmQgOiBuZXcgRGF0ZShmcm9tRGF0ZU51bShhc3NpZ25tZW50LmVuZCkpXHJcbiAgICBjb25zdCB0aW1lcyA9IGVsZW1lbnQoJ2RpdicsICdyYW5nZScsXHJcbiAgICAgICAgYXNzaWdubWVudC5zdGFydCA9PT0gYXNzaWdubWVudC5lbmQgPyBkYXRlU3RyaW5nKHN0YXJ0KSA6IGAke2RhdGVTdHJpbmcoc3RhcnQpfSAmbmRhc2g7ICR7ZGF0ZVN0cmluZyhlbmQpfWApXHJcbiAgICBlLmFwcGVuZENoaWxkKHRpbWVzKVxyXG4gICAgaWYgKGFzc2lnbm1lbnQuYXR0YWNobWVudHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGNvbnN0IGF0dGFjaG1lbnRzID0gZWxlbWVudCgnZGl2JywgJ2F0dGFjaG1lbnRzJylcclxuICAgICAgICBhc3NpZ25tZW50LmF0dGFjaG1lbnRzLmZvckVhY2goKGF0dGFjaG1lbnQpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgYSA9IGVsZW1lbnQoJ2EnLCBbXSwgYXR0YWNobWVudFswXSkgYXMgSFRNTEFuY2hvckVsZW1lbnRcclxuICAgICAgICAgICAgYS5ocmVmID0gdXJsRm9yQXR0YWNobWVudChhdHRhY2htZW50WzFdKVxyXG4gICAgICAgICAgICBnZXRBdHRhY2htZW50TWltZVR5cGUoYXR0YWNobWVudFsxXSkudGhlbigodHlwZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IHNwYW5cclxuICAgICAgICAgICAgICAgIGlmIChtaW1lVHlwZXNbdHlwZV0gIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGEuY2xhc3NMaXN0LmFkZChtaW1lVHlwZXNbdHlwZV1bMV0pXHJcbiAgICAgICAgICAgICAgICAgICAgc3BhbiA9IGVsZW1lbnQoJ3NwYW4nLCBbXSwgbWltZVR5cGVzW3R5cGVdWzBdKVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBzcGFuID0gZWxlbWVudCgnc3BhbicsIFtdLCAnVW5rbm93biBmaWxlIHR5cGUnKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYS5hcHBlbmRDaGlsZChzcGFuKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICBhdHRhY2htZW50cy5hcHBlbmRDaGlsZChhKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgZS5hcHBlbmRDaGlsZChhdHRhY2htZW50cylcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBib2R5ID0gZWxlbWVudCgnZGl2JywgJ2JvZHknLFxyXG4gICAgICAgIGFzc2lnbm1lbnQuYm9keS5yZXBsYWNlKC9mb250LWZhbWlseTpbXjtdKj8oPzpUaW1lcyBOZXcgUm9tYW58c2VyaWYpW147XSovZywgJycpKVxyXG4gICAgY29uc3QgZWRpdHMgPSBlbGVtZW50KCdkaXYnLCAnZWRpdHMnLCAnPHNwYW4gY2xhc3M9XFwnYWRkaXRpb25zXFwnPjwvc3Bhbj48c3BhbiBjbGFzcz1cXCdkZWxldGlvbnNcXCc+PC9zcGFuPicpXHJcbiAgICBjb25zdCBtID0gbW9kaWZpZWRCb2R5KGFzc2lnbm1lbnQuaWQpXHJcbiAgICBpZiAobSAhPSBudWxsKSB7XHJcbiAgICAgICAgY29uc3QgZCA9IGRtcC5kaWZmX21haW4oYXNzaWdubWVudC5ib2R5LCBtKVxyXG4gICAgICAgIGRtcC5kaWZmX2NsZWFudXBTZW1hbnRpYyhkKVxyXG4gICAgICAgIGlmIChkLmxlbmd0aCAhPT0gMCkgeyAvLyBIYXMgYmVlbiBlZGl0ZWRcclxuICAgICAgICAgICAgcG9wdWxhdGVBZGRlZERlbGV0ZWQoZCwgZWRpdHMpXHJcbiAgICAgICAgICAgIGJvZHkuaW5uZXJIVE1MID0gbVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKGV2dCkgPT4ge1xyXG4gICAgICAgIGlmIChyZWZlcmVuY2UgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZWZlcmVuY2UuYm9keSA9IGJvZHkuaW5uZXJIVE1MXHJcbiAgICAgICAgICAgIHNhdmVFeHRyYSgpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgc2V0TW9kaWZpZWQoYXNzaWdubWVudC5pZCwgIGJvZHkuaW5uZXJIVE1MKVxyXG4gICAgICAgICAgICBzYXZlTW9kaWZpZWQoKVxyXG4gICAgICAgICAgICBjb25zdCBkID0gZG1wLmRpZmZfbWFpbihhc3NpZ25tZW50LmJvZHksIGJvZHkuaW5uZXJIVE1MKVxyXG4gICAgICAgICAgICBkbXAuZGlmZl9jbGVhbnVwU2VtYW50aWMoZClcclxuICAgICAgICAgICAgaWYgKHBvcHVsYXRlQWRkZWREZWxldGVkKGQsIGVkaXRzKSkge1xyXG4gICAgICAgICAgICAgICAgZWRpdHMuY2xhc3NMaXN0LmFkZCgnbm90RW1wdHknKVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZWRpdHMuY2xhc3NMaXN0LnJlbW92ZSgnbm90RW1wdHknKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChkb2N1bWVudC5ib2R5LmdldEF0dHJpYnV0ZSgnZGF0YS12aWV3JykgPT09ICcxJykgcmVzaXplKClcclxuICAgIH0pXHJcblxyXG4gICAgZS5hcHBlbmRDaGlsZChib2R5KVxyXG5cclxuICAgIGNvbnN0IHJlc3RvcmUgPSBlbGVtZW50KCdhJywgWydtYXRlcmlhbC1pY29ucycsICdyZXN0b3JlJ10sICdzZXR0aW5nc19iYWNrdXBfcmVzdG9yZScpXHJcbiAgICByZXN0b3JlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgIHJlbW92ZUZyb21Nb2RpZmllZChhc3NpZ25tZW50LmlkKVxyXG4gICAgICAgIHNhdmVNb2RpZmllZCgpXHJcbiAgICAgICAgYm9keS5pbm5lckhUTUwgPSBhc3NpZ25tZW50LmJvZHlcclxuICAgICAgICBlZGl0cy5jbGFzc0xpc3QucmVtb3ZlKCdub3RFbXB0eScpXHJcbiAgICAgICAgaWYgKGRvY3VtZW50LmJvZHkuZ2V0QXR0cmlidXRlKCdkYXRhLXZpZXcnKSA9PT0gJzEnKSAgcmVzaXplKClcclxuICAgIH0pXHJcbiAgICBlZGl0cy5hcHBlbmRDaGlsZChyZXN0b3JlKVxyXG4gICAgZS5hcHBlbmRDaGlsZChlZGl0cylcclxuXHJcbiAgICBjb25zdCBtb2RzID0gZWxlbWVudCgnZGl2JywgWydtb2RzJ10pXHJcbiAgICByZWNlbnRBY3Rpdml0eSgpLmZvckVhY2goKGEpID0+IHtcclxuICAgICAgICBpZiAoKGFbMF0gPT09ICdlZGl0JykgJiYgKGFbMV0uaWQgPT09IGFzc2lnbm1lbnQuaWQpKSB7XHJcbiAgICAgICAgY29uc3QgdGUgPSBlbGVtZW50KCdkaXYnLCBbJ2lubmVyQWN0aXZpdHknLCAnYXNzaWdubWVudEl0ZW0nLCBhc3NpZ25tZW50LmJhc2VUeXBlXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgYDxpIGNsYXNzPSdtYXRlcmlhbC1pY29ucyc+ZWRpdDwvaT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPSd0aXRsZSc+JHtkYXRlU3RyaW5nKG5ldyBEYXRlKGFbMl0pKX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz0nYWRkaXRpb25zJz48L3NwYW4+PHNwYW4gY2xhc3M9J2RlbGV0aW9ucyc+PC9zcGFuPmAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGBpYSR7YXNzaWdubWVudC5pZH1gKVxyXG4gICAgICAgIGNvbnN0IGQgPSBkbXAuZGlmZl9tYWluKGFbMV0uYm9keSwgYXNzaWdubWVudC5ib2R5KVxyXG4gICAgICAgIGRtcC5kaWZmX2NsZWFudXBTZW1hbnRpYyhkKVxyXG4gICAgICAgIHBvcHVsYXRlQWRkZWREZWxldGVkKGQsIHRlKVxyXG5cclxuICAgICAgICBpZiAoYXNzaWdubWVudC5jbGFzcykgdGUuc2V0QXR0cmlidXRlKCdkYXRhLWNsYXNzJywgZGF0YS5jbGFzc2VzW2Fzc2lnbm1lbnQuY2xhc3NdKVxyXG4gICAgICAgIHRlLmFwcGVuZENoaWxkKGVsZW1lbnQoJ2RpdicsICdpYURpZmYnLCBkbXAuZGlmZl9wcmV0dHlIdG1sKGQpKSlcclxuICAgICAgICB0ZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgdGUuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJylcclxuICAgICAgICAgICAgaWYgKGRvY3VtZW50LmJvZHkuZ2V0QXR0cmlidXRlKCdkYXRhLXZpZXcnKSA9PT0gJzEnKSByZXNpemUoKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgbW9kcy5hcHBlbmRDaGlsZCh0ZSlcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICAgZS5hcHBlbmRDaGlsZChtb2RzKVxyXG5cclxuICAgIGlmIChzZXR0aW5ncy5hc3NpZ25tZW50U3BhbiA9PT0gJ211bHRpcGxlJyAmJiAoc3RhcnQgPCBzcGxpdC5zdGFydCkpIHtcclxuICAgICAgICBlLmNsYXNzTGlzdC5hZGQoJ2Zyb21XZWVrZW5kJylcclxuICAgIH1cclxuICAgIGlmIChzZXR0aW5ncy5hc3NpZ25tZW50U3BhbiA9PT0gJ211bHRpcGxlJyAmJiAoZW5kID4gc3BsaXQuZW5kKSkge1xyXG4gICAgICAgIGUuY2xhc3NMaXN0LmFkZCgnb3ZlcldlZWtlbmQnKVxyXG4gICAgfVxyXG4gICAgZS5jbGFzc0xpc3QuYWRkKGBzJHtzcGxpdC5zdGFydC5nZXREYXkoKX1gKVxyXG4gICAgaWYgKHNwbGl0LmVuZCAhPT0gJ0ZvcmV2ZXInKSBlLmNsYXNzTGlzdC5hZGQoYGUkezYgLSBzcGxpdC5lbmQuZ2V0RGF5KCl9YClcclxuXHJcbiAgICBjb25zdCBzdCA9IE1hdGguZmxvb3Ioc3BsaXQuc3RhcnQuZ2V0VGltZSgpIC8gMTAwMCAvIDM2MDAgLyAyNClcclxuICAgIGlmIChzcGxpdC5hc3NpZ25tZW50LmVuZCA9PT0gJ0ZvcmV2ZXInKSB7XHJcbiAgICAgICAgaWYgKHN0IDw9ICh0b2RheSgpICsgZ2V0TGlzdERhdGVPZmZzZXQoKSkpIHtcclxuICAgICAgICAgICAgZS5jbGFzc0xpc3QuYWRkKCdsaXN0RGlzcCcpXHJcbiAgICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zdCBtaWREYXRlID0gbmV3IERhdGUoKVxyXG4gICAgICAgIG1pZERhdGUuc2V0RGF0ZShtaWREYXRlLmdldERhdGUoKSArIGdldExpc3REYXRlT2Zmc2V0KCkpXHJcbiAgICAgICAgY29uc3QgcHVzaCA9IChhc3NpZ25tZW50LmJhc2VUeXBlID09PSAndGVzdCcgJiYgYXNzaWdubWVudC5zdGFydCA9PT0gc3QpID8gc2V0dGluZ3MuZWFybHlUZXN0IDogMFxyXG4gICAgICAgIGNvbnN0IGVuZEV4dHJhID0gZ2V0TGlzdERhdGVPZmZzZXQoKSA9PT0gMCA/IGdldFRpbWVBZnRlcihtaWREYXRlKSA6IDI0ICogMzYwMCAqIDEwMDBcclxuICAgICAgICBpZiAoZnJvbURhdGVOdW0oc3QgLSBwdXNoKSA8PSBtaWREYXRlICYmXHJcbiAgICAgICAgICAgIChzcGxpdC5lbmQgPT09ICdGb3JldmVyJyB8fCBtaWREYXRlLmdldFRpbWUoKSA8PSBzcGxpdC5lbmQuZ2V0VGltZSgpICsgZW5kRXh0cmEpKSB7XHJcbiAgICAgICAgICAgIGUuY2xhc3NMaXN0LmFkZCgnbGlzdERpc3AnKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBBZGQgY2xpY2sgaW50ZXJhY3Rpdml0eVxyXG4gICAgaWYgKCFzcGxpdC5jdXN0b20gfHwgIXNldHRpbmdzLnNlcFRhc2tzKSB7XHJcbiAgICAgICAgZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldnQpID0+IHtcclxuICAgICAgICAgICAgaWYgKChkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdmdWxsJykubGVuZ3RoID09PSAwKSAmJlxyXG4gICAgICAgICAgICAgICAgKGRvY3VtZW50LmJvZHkuZ2V0QXR0cmlidXRlKCdkYXRhLXZpZXcnKSA9PT0gJzAnKSkge1xyXG4gICAgICAgICAgICAgICAgZS5jbGFzc0xpc3QucmVtb3ZlKCdhbmltJylcclxuICAgICAgICAgICAgICAgIGUuY2xhc3NMaXN0LmFkZCgnbW9kaWZ5JylcclxuICAgICAgICAgICAgICAgIGUuc3R5bGUudG9wID0gKGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wIC0gZG9jdW1lbnQuYm9keS5zY3JvbGxUb3BcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gY3NzTnVtYmVyKGUuc3R5bGUubWFyZ2luVG9wKSkgKyA0NCArICdweCdcclxuICAgICAgICAgICAgICAgIGUuc2V0QXR0cmlidXRlKCdkYXRhLXRvcCcsIGUuc3R5bGUudG9wKVxyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nXHJcbiAgICAgICAgICAgICAgICBjb25zdCBiYWNrID0gZWxlbUJ5SWQoJ2JhY2tncm91bmQnKVxyXG4gICAgICAgICAgICAgICAgYmFjay5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG4gICAgICAgICAgICAgICAgYmFjay5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xyXG4gICAgICAgICAgICAgICAgZS5jbGFzc0xpc3QuYWRkKCdhbmltJylcclxuICAgICAgICAgICAgICAgIGZvcmNlTGF5b3V0KGUpXHJcbiAgICAgICAgICAgICAgICBlLmNsYXNzTGlzdC5hZGQoJ2Z1bGwnKVxyXG4gICAgICAgICAgICAgICAgZS5zdHlsZS50b3AgPSAoNzUgLSBjc3NOdW1iZXIoZS5zdHlsZS5tYXJnaW5Ub3ApKSArICdweCdcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gZS5jbGFzc0xpc3QucmVtb3ZlKCdhbmltJyksIDM1MClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGVcclxufVxyXG5cclxuLy8gSW4gb3JkZXIgdG8gZGlzcGxheSBhbiBhc3NpZ25tZW50IGluIHRoZSBjb3JyZWN0IFggcG9zaXRpb24sIGNsYXNzZXMgd2l0aCBuYW1lcyBlWCBhbmQgZVggYXJlXHJcbi8vIHVzZWQsIHdoZXJlIFggaXMgdGhlIG51bWJlciBvZiBzcXVhcmVzIHRvIGZyb20gdGhlIGFzc2lnbm1lbnQgdG8gdGhlIGxlZnQvcmlnaHQgc2lkZSBvZiB0aGVcclxuLy8gc2NyZWVuLiBUaGUgZnVuY3Rpb24gYmVsb3cgZGV0ZXJtaW5lcyB3aGljaCBlWCBhbmQgc1ggY2xhc3MgdGhlIGdpdmVuIGVsZW1lbnQgaGFzLlxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0RVMoZWw6IEhUTUxFbGVtZW50KTogW3N0cmluZywgc3RyaW5nXSB7XHJcbiAgICBsZXQgZSA9IDBcclxuICAgIGxldCBzID0gMFxyXG5cclxuICAgIEFycmF5LmZyb20obmV3IEFycmF5KDcpLCAoXywgeCkgPT4geCkuZm9yRWFjaCgoeCkgPT4ge1xyXG4gICAgICAgIGlmIChlbC5jbGFzc0xpc3QuY29udGFpbnMoYGUke3h9YCkpIHtcclxuICAgICAgICAgICAgZSA9IHhcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGVsLmNsYXNzTGlzdC5jb250YWlucyhgcyR7eH1gKSkge1xyXG4gICAgICAgICAgICBzID0geFxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbiAgICByZXR1cm4gW2BlJHtlfWAsIGBzJHtzfWBdXHJcbn1cclxuXHJcbi8vIEJlbG93IGlzIGEgZnVuY3Rpb24gdG8gY2xvc2UgdGhlIGN1cnJlbnQgYXNzaWdubWVudCB0aGF0IGlzIG9wZW5lZC5cclxuZXhwb3J0IGZ1bmN0aW9uIGNsb3NlT3BlbmVkKGV2dDogRXZlbnQpOiB2b2lkIHtcclxuICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKVxyXG4gICAgY29uc3QgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZnVsbCcpIGFzIEhUTUxFbGVtZW50fG51bGxcclxuICAgIGlmIChlbCA9PSBudWxsKSByZXR1cm5cclxuXHJcbiAgICBlbC5zdHlsZS50b3AgPSBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdG9wJylcclxuICAgIGVsLmNsYXNzTGlzdC5hZGQoJ2FuaW0nKVxyXG4gICAgZWwuY2xhc3NMaXN0LnJlbW92ZSgnZnVsbCcpXHJcbiAgICBlbC5zY3JvbGxUb3AgPSAwXHJcbiAgICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2F1dG8nXHJcbiAgICBjb25zdCBiYWNrID0gZWxlbUJ5SWQoJ2JhY2tncm91bmQnKVxyXG4gICAgYmFjay5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgYmFjay5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXHJcbiAgICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZSgnYW5pbScpXHJcbiAgICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZSgnbW9kaWZ5JylcclxuICAgICAgICBlbC5zdHlsZS50b3AgPSAnYXV0bydcclxuICAgICAgICBmb3JjZUxheW91dChlbClcclxuICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKCdhbmltJylcclxuICAgIH0sIDEwMDApXHJcbn1cclxuIiwiaW1wb3J0IHsgZWxlbUJ5SWQsIGxvY2FsU3RvcmFnZVJlYWQgfSBmcm9tICcuLi91dGlsJ1xyXG5cclxuLy8gVGhlbiwgdGhlIHVzZXJuYW1lIGluIHRoZSBzaWRlYmFyIG5lZWRzIHRvIGJlIHNldCBhbmQgd2UgbmVlZCB0byBnZW5lcmF0ZSBhbiBcImF2YXRhclwiIGJhc2VkIG9uXHJcbi8vIGluaXRpYWxzLiBUbyBkbyB0aGF0LCBzb21lIGNvZGUgdG8gY29udmVydCBmcm9tIExBQiB0byBSR0IgY29sb3JzIGlzIGJvcnJvd2VkIGZyb21cclxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2Jvcm9uaW5lL2NvbG9yc3BhY2VzLmpzXHJcbi8vXHJcbi8vIExBQiBpcyBhIGNvbG9yIG5hbWluZyBzY2hlbWUgdGhhdCB1c2VzIHR3byB2YWx1ZXMgKEEgYW5kIEIpIGFsb25nIHdpdGggYSBsaWdodG5lc3MgdmFsdWUgaW4gb3JkZXJcclxuLy8gdG8gcHJvZHVjZSBjb2xvcnMgdGhhdCBhcmUgZXF1YWxseSBzcGFjZWQgYmV0d2VlbiBhbGwgb2YgdGhlIGNvbG9ycyB0aGF0IGNhbiBiZSBzZWVuIGJ5IHRoZSBodW1hblxyXG4vLyBleWUuIFRoaXMgd29ya3MgZ3JlYXQgYmVjYXVzZSBldmVyeW9uZSBoYXMgbGV0dGVycyBpbiBoaXMvaGVyIGluaXRpYWxzLlxyXG5cclxuLy8gVGhlIEQ2NSBzdGFuZGFyZCBpbGx1bWluYW50XHJcbmNvbnN0IFJFRl9YID0gMC45NTA0N1xyXG5jb25zdCBSRUZfWSA9IDEuMDAwMDBcclxuY29uc3QgUkVGX1ogPSAxLjA4ODgzXHJcblxyXG4vLyBDSUUgTCphKmIqIGNvbnN0YW50c1xyXG5jb25zdCBMQUJfRSA9IDAuMDA4ODU2XHJcbmNvbnN0IExBQl9LID0gOTAzLjNcclxuXHJcbmNvbnN0IE0gPSBbXHJcbiAgICBbMy4yNDA2LCAtMS41MzcyLCAtMC40OTg2XSxcclxuICAgIFstMC45Njg5LCAxLjg3NTgsICAwLjA0MTVdLFxyXG4gICAgWzAuMDU1NywgLTAuMjA0MCwgIDEuMDU3MF1cclxuXVxyXG5cclxuY29uc3QgZkludiA9ICh0OiBudW1iZXIpID0+IHtcclxuICAgIGlmIChNYXRoLnBvdyh0LCAzKSA+IExBQl9FKSB7XHJcbiAgICByZXR1cm4gTWF0aC5wb3codCwgMylcclxuICAgIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gKCgxMTYgKiB0KSAtIDE2KSAvIExBQl9LXHJcbiAgICB9XHJcbn1cclxuY29uc3QgZG90UHJvZHVjdCA9IChhOiBudW1iZXJbXSwgYjogbnVtYmVyW10pID0+IHtcclxuICAgIGxldCByZXQgPSAwXHJcbiAgICBhLmZvckVhY2goKF8sIGkpID0+IHtcclxuICAgICAgICByZXQgKz0gYVtpXSAqIGJbaV1cclxuICAgIH0pXHJcbiAgICByZXR1cm4gcmV0XHJcbn1cclxuY29uc3QgZnJvbUxpbmVhciA9IChjOiBudW1iZXIpID0+IHtcclxuICAgIGNvbnN0IGEgPSAwLjA1NVxyXG4gICAgaWYgKGMgPD0gMC4wMDMxMzA4KSB7XHJcbiAgICAgICAgcmV0dXJuIDEyLjkyICogY1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gKDEuMDU1ICogTWF0aC5wb3coYywgMSAvIDIuNCkpIC0gMC4wNTVcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gbGFicmdiKGw6IG51bWJlciwgYTogbnVtYmVyLCBiOiBudW1iZXIpOiBzdHJpbmcge1xyXG4gICAgY29uc3QgdmFyWSA9IChsICsgMTYpIC8gMTE2XHJcbiAgICBjb25zdCB2YXJaID0gdmFyWSAtIChiIC8gMjAwKVxyXG4gICAgY29uc3QgdmFyWCA9IChhIC8gNTAwKSArIHZhcllcclxuICAgIGNvbnN0IF9YID0gUkVGX1ggKiBmSW52KHZhclgpXHJcbiAgICBjb25zdCBfWSA9IFJFRl9ZICogZkludih2YXJZKVxyXG4gICAgY29uc3QgX1ogPSBSRUZfWiAqIGZJbnYodmFyWilcclxuXHJcbiAgICBjb25zdCB0dXBsZSA9IFtfWCwgX1ksIF9aXVxyXG5cclxuICAgIGNvbnN0IF9SID0gZnJvbUxpbmVhcihkb3RQcm9kdWN0KE1bMF0sIHR1cGxlKSlcclxuICAgIGNvbnN0IF9HID0gZnJvbUxpbmVhcihkb3RQcm9kdWN0KE1bMV0sIHR1cGxlKSlcclxuICAgIGNvbnN0IF9CID0gZnJvbUxpbmVhcihkb3RQcm9kdWN0KE1bMl0sIHR1cGxlKSlcclxuXHJcbiAgICAvLyBPcmlnaW5hbCBmcm9tIGhlcmVcclxuICAgIGNvbnN0IG4gPSAodjogbnVtYmVyKSA9PiBNYXRoLnJvdW5kKE1hdGgubWF4KE1hdGgubWluKHYgKiAyNTYsIDI1NSksIDApKVxyXG4gICAgcmV0dXJuIGByZ2IoJHtuKF9SKX0sICR7bihfRyl9LCAke24oX0IpfSlgXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDb252ZXJ0IGEgbGV0dGVyIHRvIGEgZmxvYXQgdmFsdWVkIGZyb20gMCB0byAyNTVcclxuICovXHJcbmZ1bmN0aW9uIGxldHRlclRvQ29sb3JWYWwobGV0dGVyOiBzdHJpbmcpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuICgoKGxldHRlci5jaGFyQ29kZUF0KDApIC0gNjUpIC8gMjYpICogMjU2KSAtIDEyOFxyXG59XHJcblxyXG4vLyBUaGUgZnVuY3Rpb24gYmVsb3cgdXNlcyB0aGlzIGFsZ29yaXRobSB0byBnZW5lcmF0ZSBhIGJhY2tncm91bmQgY29sb3IgZm9yIHRoZSBpbml0aWFscyBkaXNwbGF5ZWQgaW4gdGhlIHNpZGViYXIuXHJcbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVBdmF0YXIoKTogdm9pZCB7XHJcbiAgICBpZiAoIWxvY2FsU3RvcmFnZVJlYWQoJ3VzZXJuYW1lJykpIHJldHVyblxyXG4gICAgY29uc3QgdXNlckVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3VzZXInKVxyXG4gICAgY29uc3QgaW5pdGlhbHNFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbml0aWFscycpXHJcbiAgICBpZiAoIXVzZXJFbCB8fCAhaW5pdGlhbHNFbCkgcmV0dXJuXHJcblxyXG4gICAgdXNlckVsLmlubmVySFRNTCA9IGxvY2FsU3RvcmFnZVJlYWQoJ3VzZXJuYW1lJylcclxuICAgIGNvbnN0IGluaXRpYWxzID0gbG9jYWxTdG9yYWdlUmVhZCgndXNlcm5hbWUnKS5tYXRjaCgvXFxkKiguKS4qPyguJCkvKSAvLyBTZXBhcmF0ZSB5ZWFyIGZyb20gZmlyc3QgbmFtZSBhbmQgaW5pdGlhbFxyXG4gICAgaWYgKGluaXRpYWxzICE9IG51bGwpIHtcclxuICAgICAgICBjb25zdCBiZyA9IGxhYnJnYig1MCwgbGV0dGVyVG9Db2xvclZhbChpbml0aWFsc1sxXSksIGxldHRlclRvQ29sb3JWYWwoaW5pdGlhbHNbMl0pKSAvLyBDb21wdXRlIHRoZSBjb2xvclxyXG4gICAgICAgIGluaXRpYWxzRWwuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gYmdcclxuICAgICAgICBpbml0aWFsc0VsLmlubmVySFRNTCA9IGluaXRpYWxzWzFdICsgaW5pdGlhbHNbMl1cclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyB0b2RheSB9IGZyb20gJy4uL2RhdGVzJ1xyXG5pbXBvcnQgeyBlbGVtZW50IH0gZnJvbSAnLi4vdXRpbCdcclxuXHJcbmNvbnN0IE1PTlRIUyA9IFsnSmFuJywgJ0ZlYicsICdNYXInLCAnQXByJywgJ01heScsICdKdW4nLCAnSnVsJywgJ0F1ZycsICdTZXAnLCAnT2N0JywgJ05vdicsICdEZWMnXVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVdlZWsoaWQ6IHN0cmluZyk6IEhUTUxFbGVtZW50IHtcclxuICAgIGNvbnN0IHdrID0gZWxlbWVudCgnc2VjdGlvbicsICd3ZWVrJywgbnVsbCwgaWQpXHJcbiAgICBjb25zdCBkYXlUYWJsZSA9IGVsZW1lbnQoJ3RhYmxlJywgJ2RheVRhYmxlJykgYXMgSFRNTFRhYmxlRWxlbWVudFxyXG4gICAgY29uc3QgdHIgPSBkYXlUYWJsZS5pbnNlcnRSb3coKVxyXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lIG5vLWxvb3BzXHJcbiAgICBmb3IgKGxldCBkYXkgPSAwOyBkYXkgPCA3OyBkYXkrKykgdHIuaW5zZXJ0Q2VsbCgpXHJcbiAgICB3ay5hcHBlbmRDaGlsZChkYXlUYWJsZSlcclxuXHJcbiAgICByZXR1cm4gd2tcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZURheShkOiBEYXRlKTogSFRNTEVsZW1lbnQge1xyXG4gICAgY29uc3QgZGF5ID0gZWxlbWVudCgnZGl2JywgJ2RheScsIG51bGwsICdkYXknKVxyXG4gICAgZGF5LnNldEF0dHJpYnV0ZSgnZGF0YS1kYXRlJywgU3RyaW5nKGQuZ2V0VGltZSgpKSlcclxuICAgIGlmIChNYXRoLmZsb29yKChkLmdldFRpbWUoKSAtIGQuZ2V0VGltZXpvbmVPZmZzZXQoKSkgLyAxMDAwIC8gMzYwMCAvIDI0KSA9PT0gdG9kYXkoKSkge1xyXG4gICAgICBkYXkuY2xhc3NMaXN0LmFkZCgndG9kYXknKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG1vbnRoID0gZWxlbWVudCgnc3BhbicsICdtb250aCcsIE1PTlRIU1tkLmdldE1vbnRoKCldKVxyXG4gICAgZGF5LmFwcGVuZENoaWxkKG1vbnRoKVxyXG5cclxuICAgIGNvbnN0IGRhdGUgPSBlbGVtZW50KCdzcGFuJywgJ2RhdGUnLCBTdHJpbmcoZC5nZXREYXRlKCkpKVxyXG4gICAgZGF5LmFwcGVuZENoaWxkKGRhdGUpXHJcblxyXG4gICAgcmV0dXJuIGRheVxyXG59XHJcbiIsImltcG9ydCB7IGdldENsYXNzZXMsIGdldERhdGEgfSBmcm9tICcuLi9wY3InXHJcbmltcG9ydCB7IF8kLCBjYXBpdGFsaXplU3RyaW5nLCBlbGVtQnlJZCwgZWxlbWVudCB9IGZyb20gJy4uL3V0aWwnXHJcblxyXG4vLyBXaGVuIGFueXRoaW5nIGlzIHR5cGVkLCB0aGUgc2VhcmNoIHN1Z2dlc3Rpb25zIG5lZWQgdG8gYmUgdXBkYXRlZC5cclxuY29uc3QgVElQX05BTUVTID0ge1xyXG4gICAgZm9yOiBbJ2ZvciddLFxyXG4gICAgYnk6IFsnYnknLCAnZHVlJywgJ2VuZGluZyddLFxyXG4gICAgc3RhcnRpbmc6IFsnc3RhcnRpbmcnLCAnYmVnaW5uaW5nJywgJ2Fzc2lnbmVkJ11cclxufVxyXG5cclxuY29uc3QgbmV3VGV4dCA9IGVsZW1CeUlkKCduZXdUZXh0JykgYXMgSFRNTElucHV0RWxlbWVudFxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZU5ld1RpcHModmFsOiBzdHJpbmcsIHNjcm9sbDogYm9vbGVhbiA9IHRydWUpOiB2b2lkIHtcclxuICAgIGlmIChzY3JvbGwpIHtcclxuICAgICAgICBlbGVtQnlJZCgnbmV3VGlwcycpLnNjcm9sbFRvcCA9IDBcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBzcGFjZUluZGV4ID0gdmFsLmxhc3RJbmRleE9mKCcgJylcclxuICAgIGlmIChzcGFjZUluZGV4ICE9PSAtMSkge1xyXG4gICAgICAgIGNvbnN0IGJlZm9yZVNwYWNlID0gdmFsLmxhc3RJbmRleE9mKCcgJywgc3BhY2VJbmRleCAtIDEpXHJcbiAgICAgICAgY29uc3QgYmVmb3JlID0gdmFsLnN1YnN0cmluZygoYmVmb3JlU3BhY2UgPT09IC0xID8gMCA6IGJlZm9yZVNwYWNlICsgMSksIHNwYWNlSW5kZXgpXHJcbiAgICAgICAgT2JqZWN0LmVudHJpZXMoVElQX05BTUVTKS5mb3JFYWNoKChbbmFtZSwgcG9zc2libGVdKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChwb3NzaWJsZS5pbmRleE9mKGJlZm9yZSkgIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobmFtZSA9PT0gJ2ZvcicpIHtcclxuICAgICAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhUSVBfTkFNRVMpLmZvckVhY2goKHRpcE5hbWUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbUJ5SWQoYHRpcCR7dGlwTmFtZX1gKS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgZ2V0Q2xhc3NlcygpLmZvckVhY2goKGNscykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpZCA9IGB0aXBjbGFzcyR7Y2xzLnJlcGxhY2UoL1xcVy8sICcnKX1gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzcGFjZUluZGV4ID09PSAodmFsLmxlbmd0aCAtIDEpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY29udGFpbmVyID0gZWxlbWVudCgnZGl2JywgWydjbGFzc1RpcCcsICdhY3RpdmUnLCAndGlwJ10sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGA8aSBjbGFzcz0nbWF0ZXJpYWwtaWNvbnMnPmNsYXNzPC9pPjxzcGFuIGNsYXNzPSd0eXBlZCc+JHtjbHN9PC9zcGFuPmAsIGlkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRpcENvbXBsZXRlKGNscykpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbUJ5SWQoJ25ld1RpcHMnKS5hcHBlbmRDaGlsZChjb250YWluZXIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtQnlJZChpZCkuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbHMudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyh2YWwudG9Mb3dlckNhc2UoKS5zdWJzdHIoc3BhY2VJbmRleCArIDEpKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jbGFzc1RpcCcpLmZvckVhY2goKGVsKSA9PiB7XHJcbiAgICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcclxuICAgIH0pXHJcbiAgICBpZiAoKHZhbCA9PT0gJycpIHx8ICh2YWwuY2hhckF0KHZhbC5sZW5ndGggLSAxKSA9PT0gJyAnKSkge1xyXG4gICAgICAgIHVwZGF0ZVRpcCgnZm9yJywgJ2ZvcicsIGZhbHNlKVxyXG4gICAgICAgIHVwZGF0ZVRpcCgnYnknLCAnYnknLCBmYWxzZSlcclxuICAgICAgICB1cGRhdGVUaXAoJ3N0YXJ0aW5nJywgJ3N0YXJ0aW5nJywgZmFsc2UpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IGxhc3RTcGFjZSA9IHZhbC5sYXN0SW5kZXhPZignICcpXHJcbiAgICAgICAgbGV0IGxhc3RXb3JkID0gbGFzdFNwYWNlID09PSAtMSA/IHZhbCA6IHZhbC5zdWJzdHIobGFzdFNwYWNlICsgMSlcclxuICAgICAgICBjb25zdCB1cHBlcmNhc2UgPSBsYXN0V29yZC5jaGFyQXQoMCkgPT09IGxhc3RXb3JkLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpXHJcbiAgICAgICAgbGFzdFdvcmQgPSBsYXN0V29yZC50b0xvd2VyQ2FzZSgpXHJcbiAgICAgICAgT2JqZWN0LmVudHJpZXMoVElQX05BTUVTKS5mb3JFYWNoKChbbmFtZSwgcG9zc2libGVdKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBmb3VuZDogc3RyaW5nfG51bGwgPSBudWxsXHJcbiAgICAgICAgICAgIHBvc3NpYmxlLmZvckVhY2goKHApID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChwLnNsaWNlKDAsIGxhc3RXb3JkLmxlbmd0aCkgPT09IGxhc3RXb3JkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm91bmQgPSBwXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIGlmIChmb3VuZCkge1xyXG4gICAgICAgICAgICAgICAgdXBkYXRlVGlwKG5hbWUsIGZvdW5kLCB1cHBlcmNhc2UpXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBlbGVtQnlJZChgdGlwJHtuYW1lfWApLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVUaXAobmFtZTogc3RyaW5nLCB0eXBlZDogc3RyaW5nLCBjYXBpdGFsaXplOiBib29sZWFuKTogdm9pZCB7XHJcbiAgICBpZiAobmFtZSAhPT0gJ2ZvcicgJiYgbmFtZSAhPT0gJ2J5JyAmJiBuYW1lICE9PSAnc3RhcnRpbmcnKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHRpcCBuYW1lJylcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBlbCA9IGVsZW1CeUlkKGB0aXAke25hbWV9YClcclxuICAgIGVsLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcbiAgICBfJChlbC5xdWVyeVNlbGVjdG9yKCcudHlwZWQnKSkuaW5uZXJIVE1MID0gKGNhcGl0YWxpemUgPyBjYXBpdGFsaXplU3RyaW5nKHR5cGVkKSA6IHR5cGVkKSArICcuLi4nXHJcbiAgICBjb25zdCBuZXdOYW1lczogc3RyaW5nW10gPSBbXVxyXG4gICAgVElQX05BTUVTW25hbWVdLmZvckVhY2goKG4pID0+IHtcclxuICAgICAgICBpZiAobiAhPT0gdHlwZWQpIHsgbmV3TmFtZXMucHVzaChgPGI+JHtufTwvYj5gKSB9XHJcbiAgICB9KVxyXG4gICAgXyQoZWwucXVlcnlTZWxlY3RvcignLm90aGVycycpKS5pbm5lckhUTUwgPSBuZXdOYW1lcy5sZW5ndGggPiAwID8gYFlvdSBjYW4gYWxzbyB1c2UgJHtuZXdOYW1lcy5qb2luKCcgb3IgJyl9YCA6ICcnXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHRpcENvbXBsZXRlKGF1dG9jb21wbGV0ZTogc3RyaW5nKTogKGV2dDogRXZlbnQpID0+IHZvaWQge1xyXG4gICAgcmV0dXJuIChldnQ6IEV2ZW50KSA9PiB7XHJcbiAgICAgICAgY29uc3QgdmFsID0gbmV3VGV4dC52YWx1ZVxyXG4gICAgICAgIGNvbnN0IGxhc3RTcGFjZSA9IHZhbC5sYXN0SW5kZXhPZignICcpXHJcbiAgICAgICAgY29uc3QgbGFzdFdvcmQgPSBsYXN0U3BhY2UgPT09IC0xID8gMCA6IGxhc3RTcGFjZSArIDFcclxuICAgICAgICB1cGRhdGVOZXdUaXBzKG5ld1RleHQudmFsdWUgPSB2YWwuc3Vic3RyaW5nKDAsIGxhc3RXb3JkKSArIGF1dG9jb21wbGV0ZSArICcgJylcclxuICAgICAgICByZXR1cm4gbmV3VGV4dC5mb2N1cygpXHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIFRoZSBldmVudCBsaXN0ZW5lciBpcyB0aGVuIGFkZGVkIHRvIHRoZSBwcmVleGlzdGluZyB0aXBzLlxyXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGlwJykuZm9yRWFjaCgodGlwKSA9PiB7XHJcbiAgICB0aXAuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aXBDb21wbGV0ZShfJCh0aXAucXVlcnlTZWxlY3RvcignLnR5cGVkJykpLmlubmVySFRNTCkpXHJcbn0pXHJcbiIsImltcG9ydCB7IFZFUlNJT04gfSBmcm9tICcuLi9hcHAnXHJcbmltcG9ydCB7IGVsZW1CeUlkIH0gZnJvbSAnLi4vdXRpbCdcclxuXHJcbmNvbnN0IEVSUk9SX0ZPUk1fVVJMID0gJ2h0dHBzOi8vZG9jcy5nb29nbGUuY29tL2Evc3R1ZGVudHMuaGFya2VyLm9yZy9mb3Jtcy9kLydcclxuICAgICAgICAgICAgICAgICAgICAgKyAnMXNhMmdVdFlGUGRLVDVZRU5YSUVZYXV5UlB1Y3FzUUNWYVFBUGVGM2JaNFEvdmlld2Zvcm0nXHJcbmNvbnN0IEVSUk9SX0ZPUk1fRU5UUlkgPSAnP2VudHJ5LjEyMDAzNjIyMz0nXHJcbmNvbnN0IEVSUk9SX0dJVEhVQl9VUkwgPSAnaHR0cHM6Ly9naXRodWIuY29tLzE5UnlhbkEvQ2hlY2tQQ1IvaXNzdWVzL25ldydcclxuXHJcbmNvbnN0IGxpbmtCeUlkID0gKGlkOiBzdHJpbmcpID0+IGVsZW1CeUlkKGlkKSBhcyBIVE1MTGlua0VsZW1lbnRcclxuXHJcbi8vICpkaXNwbGF5RXJyb3IqIGRpc3BsYXlzIGEgZGlhbG9nIGNvbnRhaW5pbmcgaW5mb3JtYXRpb24gYWJvdXQgYW4gZXJyb3IuXHJcbmV4cG9ydCBmdW5jdGlvbiBkaXNwbGF5RXJyb3IoZTogRXJyb3IpOiB2b2lkIHtcclxuICAgIGNvbnNvbGUubG9nKCdEaXNwbGF5aW5nIGVycm9yJywgZSlcclxuICAgIGNvbnN0IGVycm9ySFRNTCA9IGBNZXNzYWdlOiAke2UubWVzc2FnZX1cXG5TdGFjazogJHtlLnN0YWNrIHx8IChlIGFzIGFueSkubGluZU51bWJlcn1cXG5gXHJcbiAgICAgICAgICAgICAgICAgICAgKyBgQnJvd3NlcjogJHtuYXZpZ2F0b3IudXNlckFnZW50fVxcblZlcnNpb246ICR7VkVSU0lPTn1gXHJcbiAgICBlbGVtQnlJZCgnZXJyb3JDb250ZW50JykuaW5uZXJIVE1MID0gZXJyb3JIVE1MLnJlcGxhY2UoJ1xcbicsICc8YnI+JylcclxuICAgIGxpbmtCeUlkKCdlcnJvckdvb2dsZScpLmhyZWYgPSBFUlJPUl9GT1JNX1VSTCArIEVSUk9SX0ZPUk1fRU5UUlkgKyBlbmNvZGVVUklDb21wb25lbnQoZXJyb3JIVE1MKVxyXG4gICAgbGlua0J5SWQoJ2Vycm9yR2l0SHViJykuaHJlZiA9XHJcbiAgICAgICAgRVJST1JfR0lUSFVCX1VSTCArICc/Ym9keT0nICsgZW5jb2RlVVJJQ29tcG9uZW50KGBJJ3ZlIGVuY291bnRlcmVkIGFuIGJ1Zy5cXG5cXG5cXGBcXGBcXGBcXG4ke2Vycm9ySFRNTH1cXG5cXGBcXGBcXGBgKVxyXG4gICAgZWxlbUJ5SWQoJ2Vycm9yQmFja2dyb3VuZCcpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXHJcbiAgICByZXR1cm4gZWxlbUJ5SWQoJ2Vycm9yJykuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxufVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgKGV2dCkgPT4ge1xyXG4gICAgZXZ0LnByZXZlbnREZWZhdWx0KClcclxuICAgIGRpc3BsYXlFcnJvcihldnQuZXJyb3IpXHJcbn0pXHJcbiIsImltcG9ydCB7IF8kIH0gZnJvbSAnLi4vdXRpbCdcclxuXHJcbi8vIEZvciBsaXN0IHZpZXcsIHRoZSBhc3NpZ25tZW50cyBjYW4ndCBiZSBvbiB0b3Agb2YgZWFjaCBvdGhlci5cclxuLy8gVGhlcmVmb3JlLCBhIGxpc3RlbmVyIGlzIGF0dGFjaGVkIHRvIHRoZSByZXNpemluZyBvZiB0aGUgYnJvd3NlciB3aW5kb3cuXHJcbmxldCB0aWNraW5nID0gZmFsc2VcclxubGV0IHRpbWVvdXRJZDogbnVtYmVyfG51bGwgPSBudWxsXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRSZXNpemVBc3NpZ25tZW50cygpOiBIVE1MRWxlbWVudFtdIHtcclxuICAgIGNvbnN0IGFzc2lnbm1lbnRzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKCdzaG93RG9uZScpID9cclxuICAgICAgICAnLmFzc2lnbm1lbnQubGlzdERpc3AnIDogJy5hc3NpZ25tZW50Lmxpc3REaXNwOm5vdCguZG9uZSknKSlcclxuICAgIGFzc2lnbm1lbnRzLnNvcnQoKGEsIGIpID0+IHtcclxuICAgICAgICBjb25zdCBhZCA9IGEuY2xhc3NMaXN0LmNvbnRhaW5zKCdkb25lJylcclxuICAgICAgICBjb25zdCBiZCA9IGIuY2xhc3NMaXN0LmNvbnRhaW5zKCdkb25lJylcclxuICAgICAgICBpZiAoYWQgJiYgIWJkKSB7IHJldHVybiAxIH1cclxuICAgICAgICBpZiAoYmQgJiYgIWFkKSB7IHJldHVybiAtMSB9XHJcbiAgICAgICAgcmV0dXJuIE51bWJlcigoYS5xdWVyeVNlbGVjdG9yKCcuZHVlJykgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWUpXHJcbiAgICAgICAgICAgICAtIE51bWJlcigoYi5xdWVyeVNlbGVjdG9yKCcuZHVlJykgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWUpXHJcbiAgICB9KVxyXG4gICAgcmV0dXJuIGFzc2lnbm1lbnRzIGFzIEhUTUxFbGVtZW50W11cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlc2l6ZUNhbGxlcigpOiB2b2lkIHtcclxuICAgIGlmICghdGlja2luZykge1xyXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShyZXNpemUpXHJcbiAgICAgICAgdGlja2luZyA9IHRydWVcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlc2l6ZSgpOiB2b2lkIHtcclxuICAgIHRpY2tpbmcgPSB0cnVlXHJcbiAgICAvLyBUbyBjYWxjdWxhdGUgdGhlIG51bWJlciBvZiBjb2x1bW5zLCB0aGUgYmVsb3cgYWxnb3JpdGhtIGlzIHVzZWQgYmVjYXNlIGFzIHRoZSBzY3JlZW4gc2l6ZVxyXG4gICAgLy8gaW5jcmVhc2VzLCB0aGUgY29sdW1uIHdpZHRoIGluY3JlYXNlc1xyXG4gICAgY29uc3Qgd2lkdGhzID0gZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuY29udGFpbnMoJ3Nob3dJbmZvJykgP1xyXG4gICAgICAgIFs2NTAsIDExMDAsIDE4MDAsIDI3MDAsIDM4MDAsIDUxMDBdIDogWzM1MCwgODAwLCAxNTAwLCAyNDAwLCAzNTAwLCA0ODAwXVxyXG4gICAgbGV0IGNvbHVtbnMgPSAxXHJcbiAgICB3aWR0aHMuZm9yRWFjaCgodywgaW5kZXgpID0+IHtcclxuICAgICAgICBpZiAod2luZG93LmlubmVyV2lkdGggPiB3KSB7IGNvbHVtbnMgPSBpbmRleCArIDEgfVxyXG4gICAgfSlcclxuICAgIGNvbnN0IGNvbHVtbkhlaWdodHMgPSBBcnJheS5mcm9tKG5ldyBBcnJheShjb2x1bW5zKSwgKCkgPT4gMClcclxuICAgIGNvbnN0IGNjaDogbnVtYmVyW10gPSBbXVxyXG4gICAgY29uc3QgYXNzaWdubWVudHMgPSBnZXRSZXNpemVBc3NpZ25tZW50cygpXHJcbiAgICBhc3NpZ25tZW50cy5mb3JFYWNoKChhc3NpZ25tZW50LCBuKSA9PiB7XHJcbiAgICAgICAgY29uc3QgY29sID0gbiAlIGNvbHVtbnNcclxuICAgICAgICBjY2gucHVzaChjb2x1bW5IZWlnaHRzW2NvbF0pXHJcbiAgICAgICAgY29sdW1uSGVpZ2h0c1tjb2xdICs9IGFzc2lnbm1lbnQub2Zmc2V0SGVpZ2h0ICsgMjRcclxuICAgIH0pXHJcbiAgICBhc3NpZ25tZW50cy5mb3JFYWNoKChhc3NpZ25tZW50LCBuKSA9PiB7XHJcbiAgICAgICAgY29uc3QgY29sID0gbiAlIGNvbHVtbnNcclxuICAgICAgICBhc3NpZ25tZW50LnN0eWxlLnRvcCA9IGNjaFtuXSArICdweCdcclxuICAgICAgICBhc3NpZ25tZW50LnN0eWxlLmxlZnQgPSAoKDEwMCAvIGNvbHVtbnMpICogY29sKSArICclJ1xyXG4gICAgICAgIGFzc2lnbm1lbnQuc3R5bGUucmlnaHQgPSAoKDEwMCAvIGNvbHVtbnMpICogKGNvbHVtbnMgLSBjb2wgLSAxKSkgKyAnJSdcclxuICAgIH0pXHJcbiAgICBpZiAodGltZW91dElkKSBjbGVhclRpbWVvdXQodGltZW91dElkKVxyXG4gICAgdGltZW91dElkID0gc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgY2NoLmxlbmd0aCA9IDBcclxuICAgICAgICBhc3NpZ25tZW50cy5mb3JFYWNoKChhc3NpZ25tZW50LCBuKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbCA9IG4gJSBjb2x1bW5zXHJcbiAgICAgICAgICAgIGlmIChuIDwgY29sdW1ucykge1xyXG4gICAgICAgICAgICAgICAgY29sdW1uSGVpZ2h0c1tjb2xdID0gMFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNjaC5wdXNoKGNvbHVtbkhlaWdodHNbY29sXSlcclxuICAgICAgICAgICAgY29sdW1uSGVpZ2h0c1tjb2xdICs9IGFzc2lnbm1lbnQub2Zmc2V0SGVpZ2h0ICsgMjRcclxuICAgICAgICB9KVxyXG4gICAgICAgIGFzc2lnbm1lbnRzLmZvckVhY2goKGFzc2lnbm1lbnQsIG4pID0+IHtcclxuICAgICAgICAgICAgYXNzaWdubWVudC5zdHlsZS50b3AgPSBjY2hbbl0gKyAncHgnXHJcbiAgICAgICAgfSlcclxuICAgIH0sIDUwMClcclxuICAgIHRpY2tpbmcgPSBmYWxzZVxyXG59XHJcbiIsIi8qKlxyXG4gKiBBbGwgdGhpcyBpcyByZXNwb25zaWJsZSBmb3IgaXMgY3JlYXRpbmcgc25hY2tiYXJzLlxyXG4gKi9cclxuXHJcbmltcG9ydCB7IGVsZW1lbnQsIGZvcmNlTGF5b3V0IH0gZnJvbSAnLi4vdXRpbCdcclxuXHJcbi8qKlxyXG4gKiBDcmVhdGVzIGEgc25hY2tiYXIgd2l0aG91dCBhbiBhY3Rpb25cclxuICogQHBhcmFtIG1lc3NhZ2UgVGhlIHNuYWNrYmFyJ3MgbWVzc2FnZVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHNuYWNrYmFyKG1lc3NhZ2U6IHN0cmluZyk6IHZvaWRcclxuLyoqXHJcbiAqIENyZWF0ZXMgYSBzbmFja2JhciB3aXRoIGFuIGFjdGlvblxyXG4gKiBAcGFyYW0gbWVzc2FnZSBUaGUgc25hY2tiYXIncyBtZXNzYWdlXHJcbiAqIEBwYXJhbSBhY3Rpb24gT3B0aW9uYWwgdGV4dCB0byBzaG93IGFzIGEgbWVzc2FnZSBhY3Rpb25cclxuICogQHBhcmFtIGYgICAgICBBIGZ1bmN0aW9uIHRvIGV4ZWN1dGUgd2hlbiB0aGUgYWN0aW9uIGlzIGNsaWNrZWRcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBzbmFja2JhcihtZXNzYWdlOiBzdHJpbmcsIGFjdGlvbjogc3RyaW5nLCBmOiAoKSA9PiB2b2lkKTogdm9pZFxyXG5leHBvcnQgZnVuY3Rpb24gc25hY2tiYXIobWVzc2FnZTogc3RyaW5nLCBhY3Rpb24/OiBzdHJpbmcsIGY/OiAoKSA9PiB2b2lkKTogdm9pZCB7XHJcbiAgICBjb25zdCBzbmFjayA9IGVsZW1lbnQoJ2RpdicsICdzbmFja2JhcicpXHJcbiAgICBjb25zdCBzbmFja0lubmVyID0gZWxlbWVudCgnZGl2JywgJ3NuYWNrSW5uZXInLCBtZXNzYWdlKVxyXG4gICAgc25hY2suYXBwZW5kQ2hpbGQoc25hY2tJbm5lcilcclxuXHJcbiAgICBpZiAoKGFjdGlvbiAhPSBudWxsKSAmJiAoZiAhPSBudWxsKSkge1xyXG4gICAgICAgIGNvbnN0IGFjdGlvbkUgPSBlbGVtZW50KCdhJywgW10sIGFjdGlvbilcclxuICAgICAgICBhY3Rpb25FLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBzbmFjay5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gICAgICAgICAgICBmKClcclxuICAgICAgICB9KVxyXG4gICAgICAgIHNuYWNrSW5uZXIuYXBwZW5kQ2hpbGQoYWN0aW9uRSlcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBhZGQgPSAoKSA9PiB7XHJcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc25hY2spXHJcbiAgICAgIGZvcmNlTGF5b3V0KHNuYWNrKVxyXG4gICAgICBzbmFjay5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgIHNuYWNrLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHNuYWNrLnJlbW92ZSgpLCA5MDApXHJcbiAgICAgIH0sIDUwMDApXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZXhpc3RpbmcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc25hY2tiYXInKVxyXG4gICAgaWYgKGV4aXN0aW5nICE9IG51bGwpIHtcclxuICAgICAgICBleGlzdGluZy5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gICAgICAgIHNldFRpbWVvdXQoYWRkLCAzMDApXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGFkZCgpXHJcbiAgICB9XHJcbn1cclxuIiwiXHJcbi8qKlxyXG4gKiBDb29raWUgZnVuY3Rpb25zIChhIGNvb2tpZSBpcyBhIHNtYWxsIHRleHQgZG9jdW1lbnQgdGhhdCB0aGUgYnJvd3NlciBjYW4gcmVtZW1iZXIpXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIFJldHJpZXZlcyBhIGNvb2tpZVxyXG4gKiBAcGFyYW0gY25hbWUgdGhlIG5hbWUgb2YgdGhlIGNvb2tpZSB0byByZXRyaWV2ZVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGdldENvb2tpZShjbmFtZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIGNvbnN0IG5hbWUgPSBjbmFtZSArICc9J1xyXG4gICAgY29uc3QgY29va2llUGFydCA9IGRvY3VtZW50LmNvb2tpZS5zcGxpdCgnOycpLmZpbmQoKGMpID0+IGMuaW5jbHVkZXMobmFtZSkpXHJcbiAgICBpZiAoY29va2llUGFydCkgcmV0dXJuIGNvb2tpZVBhcnQuc3Vic3RyaW5nKG5hbWUubGVuZ3RoKVxyXG4gICAgcmV0dXJuICcnIC8vIEJsYW5rIGlmIGNvb2tpZSBub3QgZm91bmRcclxuICB9XHJcblxyXG4vKiogU2V0cyB0aGUgdmFsdWUgb2YgYSBjb29raWVcclxuICogQHBhcmFtIGNuYW1lIHRoZSBuYW1lIG9mIHRoZSBjb29raWUgdG8gc2V0XHJcbiAqIEBwYXJhbSBjdmFsdWUgdGhlIHZhbHVlIHRvIHNldCB0aGUgY29va2llIHRvXHJcbiAqIEBwYXJhbSBleGRheXMgdGhlIG51bWJlciBvZiBkYXlzIHRoYXQgdGhlIGNvb2tpZSB3aWxsIGV4cGlyZSBpbiAoYW5kIG5vdCBiZSBleGlzdGVudCBhbnltb3JlKVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHNldENvb2tpZShjbmFtZTogc3RyaW5nLCBjdmFsdWU6IHN0cmluZywgZXhkYXlzOiBudW1iZXIpOiB2b2lkIHtcclxuICAgIGNvbnN0IGQgPSBuZXcgRGF0ZSgpXHJcbiAgICBkLnNldFRpbWUoZC5nZXRUaW1lKCkgKyAoZXhkYXlzICogMjQgKiA2MCAqIDYwICogMTAwMCkpXHJcbiAgICBjb25zdCBleHBpcmVzID0gYGV4cGlyZXM9JHtkLnRvVVRDU3RyaW5nKCl9YFxyXG4gICAgZG9jdW1lbnQuY29va2llID0gY25hbWUgKyAnPScgKyBjdmFsdWUgKyAnOyAnICsgZXhwaXJlc1xyXG4gIH1cclxuXHJcbi8qKlxyXG4gKiBEZWxldHMgYSBjb29raWVcclxuICogQHBhcmFtIGNuYW1lIHRoZSBuYW1lIG9mIHRoZSBjb29raWUgdG8gZGVsZXRlXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZGVsZXRlQ29va2llKGNuYW1lOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgIC8vIFRoaXMgaXMgbGlrZSAqc2V0Q29va2llKiwgYnV0IHNldHMgdGhlIGV4cGlyeSBkYXRlIHRvIHNvbWV0aGluZyBpbiB0aGUgcGFzdCBzbyB0aGUgY29va2llIGlzIGRlbGV0ZWQuXHJcbiAgICBkb2N1bWVudC5jb29raWUgPSBjbmFtZSArICc9OyBleHBpcmVzPVRodSwgMDEgSmFuIDE5NzAgMDA6MDA6MDEgR01UOydcclxufVxyXG4iLCJleHBvcnQgZnVuY3Rpb24gdHpvZmYoKTogbnVtYmVyIHtcclxuICAgIHJldHVybiAobmV3IERhdGUoKSkuZ2V0VGltZXpvbmVPZmZzZXQoKSAqIDEwMDAgKiA2MCAvLyBGb3IgZnV0dXJlIGNhbGN1bGF0aW9uc1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdG9EYXRlTnVtKGRhdGU6IERhdGV8bnVtYmVyKTogbnVtYmVyIHtcclxuICAgIGNvbnN0IG51bSA9IGRhdGUgaW5zdGFuY2VvZiBEYXRlID8gZGF0ZS5nZXRUaW1lKCkgOiBkYXRlXHJcbiAgICByZXR1cm4gTWF0aC5mbG9vcigobnVtIC0gdHpvZmYoKSkgLyAxMDAwIC8gMzYwMCAvIDI0KVxyXG59XHJcblxyXG4vLyAqRnJvbURhdGVOdW0qIGNvbnZlcnRzIGEgbnVtYmVyIG9mIGRheXMgdG8gYSBudW1iZXIgb2Ygc2Vjb25kc1xyXG5leHBvcnQgZnVuY3Rpb24gZnJvbURhdGVOdW0oZGF5czogbnVtYmVyKTogRGF0ZSB7XHJcbiAgICBjb25zdCBkID0gbmV3IERhdGUoKGRheXMgKiAxMDAwICogMzYwMCAqIDI0KSArIHR6b2ZmKCkpXHJcbiAgICAvLyBUaGUgY2hlY2tzIGJlbG93IGFyZSB0byBoYW5kbGUgZGF5bGlnaHQgc2F2aW5ncyB0aW1lXHJcbiAgICBpZiAoZC5nZXRIb3VycygpID09PSAxKSB7IGQuc2V0SG91cnMoMCkgfVxyXG4gICAgaWYgKChkLmdldEhvdXJzKCkgPT09IDIyKSB8fCAoZC5nZXRIb3VycygpID09PSAyMykpIHtcclxuICAgICAgZC5zZXRIb3VycygyNClcclxuICAgICAgZC5zZXRNaW51dGVzKDApXHJcbiAgICAgIGQuc2V0U2Vjb25kcygwKVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGRcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHRvZGF5KCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gdG9EYXRlTnVtKG5ldyBEYXRlKCkpXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBJdGVyYXRlcyBmcm9tIHRoZSBzdGFydGluZyBkYXRlIHRvIGVuZGluZyBkYXRlIGluY2x1c2l2ZVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGl0ZXJEYXlzKHN0YXJ0OiBEYXRlLCBlbmQ6IERhdGUsIGNiOiAoZGF0ZTogRGF0ZSkgPT4gdm9pZCk6IHZvaWQge1xyXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lIG5vLWxvb3BzXHJcbiAgICBmb3IgKGNvbnN0IGQgPSBuZXcgRGF0ZShzdGFydCk7IGQgPD0gZW5kOyBkLnNldERhdGUoZC5nZXREYXRlKCkgKyAxKSkge1xyXG4gICAgICAgIGNiKGQpXHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgY29tcHV0ZVdlZWtJZCwgY3JlYXRlQXNzaWdubWVudCwgZ2V0RVMsIHNlcGFyYXRlZENsYXNzIH0gZnJvbSAnLi9jb21wb25lbnRzL2Fzc2lnbm1lbnQnXHJcbmltcG9ydCB7IGNyZWF0ZURheSwgY3JlYXRlV2VlayB9IGZyb20gJy4vY29tcG9uZW50cy9jYWxlbmRhcidcclxuaW1wb3J0IHsgZGlzcGxheUVycm9yIH0gZnJvbSAnLi9jb21wb25lbnRzL2Vycm9yRGlzcGxheSdcclxuaW1wb3J0IHsgcmVzaXplIH0gZnJvbSAnLi9jb21wb25lbnRzL3Jlc2l6ZXInXHJcbmltcG9ydCB7IGZyb21EYXRlTnVtLCBpdGVyRGF5cywgdG9kYXkgfSBmcm9tICcuL2RhdGVzJ1xyXG5pbXBvcnQgeyBjbGFzc0J5SWQsIGdldERhdGEsIElBcHBsaWNhdGlvbkRhdGEsIElBc3NpZ25tZW50IH0gZnJvbSAnLi9wY3InXHJcbmltcG9ydCB7IGFkZEFjdGl2aXR5LCBzYXZlQWN0aXZpdHkgfSBmcm9tICcuL3BsdWdpbnMvYWN0aXZpdHknXHJcbmltcG9ydCB7IGV4dHJhVG9UYXNrLCBnZXRFeHRyYSwgSUN1c3RvbUFzc2lnbm1lbnQgfSBmcm9tICcuL3BsdWdpbnMvY3VzdG9tQXNzaWdubWVudHMnXHJcbmltcG9ydCB7IGFzc2lnbm1lbnRJbkRvbmUsIHJlbW92ZUZyb21Eb25lLCBzYXZlRG9uZSB9IGZyb20gJy4vcGx1Z2lucy9kb25lJ1xyXG5pbXBvcnQgeyBhc3NpZ25tZW50SW5Nb2RpZmllZCwgcmVtb3ZlRnJvbU1vZGlmaWVkLCBzYXZlTW9kaWZpZWQgfSBmcm9tICcuL3BsdWdpbnMvbW9kaWZpZWRBc3NpZ25tZW50cydcclxuaW1wb3J0IHsgc2V0dGluZ3MgfSBmcm9tICcuL3NldHRpbmdzJ1xyXG5pbXBvcnQgeyBfJCwgZGF0ZVN0cmluZywgZWxlbUJ5SWQsIGVsZW1lbnQsIGxvY2FsU3RvcmFnZVJlYWQsIHNtb290aFNjcm9sbCB9IGZyb20gJy4vdXRpbCdcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVNwbGl0QXNzaWdubWVudCB7XHJcbiAgICBhc3NpZ25tZW50OiBJQXNzaWdubWVudFxyXG4gICAgc3RhcnQ6IERhdGVcclxuICAgIGVuZDogRGF0ZXwnRm9yZXZlcidcclxuICAgIGN1c3RvbTogYm9vbGVhblxyXG4gICAgcmVmZXJlbmNlPzogSUN1c3RvbUFzc2lnbm1lbnRcclxufVxyXG5cclxuY29uc3QgU0NIRURVTEVfRU5EUyA9IHtcclxuICAgIGRheTogKGRhdGU6IERhdGUpID0+IDI0ICogMzYwMCAqIDEwMDAsXHJcbiAgICBtczogKGRhdGU6IERhdGUpID0+IFsyNCwgICAgICAgICAgICAgIC8vIFN1bmRheVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgMTUgKyAoMzUgLyA2MCksICAvLyBNb25kYXlcclxuICAgICAgICAgICAgICAgICAgICAgICAgIDE1ICsgKDM1IC8gNjApLCAgLy8gVHVlc2RheVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgMTUgKyAoMTUgLyA2MCksICAvLyBXZWRuZXNkYXlcclxuICAgICAgICAgICAgICAgICAgICAgICAgIDE1ICsgKDE1IC8gNjApLCAgLy8gVGh1cnNkYXlcclxuICAgICAgICAgICAgICAgICAgICAgICAgIDE1ICsgKDE1IC8gNjApLCAgLy8gRnJpZGF5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAyNCAgICAgICAgICAgICAgIC8vIFNhdHVyZGF5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF1bZGF0ZS5nZXREYXkoKV0sXHJcbiAgICB1czogKGRhdGU6IERhdGUpID0+IDE1ICogMzYwMCAqIDEwMDBcclxufVxyXG5jb25zdCBXRUVLRU5EX0NMQVNTTkFNRVMgPSBbJ2Zyb21XZWVrZW5kJywgJ292ZXJXZWVrZW5kJ11cclxuXHJcbmxldCBzY3JvbGwgPSAwIC8vIFRoZSBsb2NhdGlvbiB0byBzY3JvbGwgdG8gaW4gb3JkZXIgdG8gcmVhY2ggdG9kYXkgaW4gY2FsZW5kYXIgdmlld1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFNjcm9sbCgpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIHNjcm9sbFxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0VGltZUFmdGVyKGRhdGU6IERhdGUpOiBudW1iZXIge1xyXG4gICAgY29uc3QgaGlkZUFzc2lnbm1lbnRzID0gc2V0dGluZ3MuaGlkZUFzc2lnbm1lbnRzXHJcbiAgICBpZiAoaGlkZUFzc2lnbm1lbnRzID09PSAnZGF5JyB8fCBoaWRlQXNzaWdubWVudHMgPT09ICdtcycgfHwgaGlkZUFzc2lnbm1lbnRzID09PSAndXMnKSB7XHJcbiAgICAgICAgcmV0dXJuIFNDSEVEVUxFX0VORFNbaGlkZUFzc2lnbm1lbnRzXShkYXRlKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gU0NIRURVTEVfRU5EUy5kYXkoZGF0ZSlcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0U3RhcnRFbmREYXRlcyhkYXRhOiBJQXBwbGljYXRpb25EYXRhKToge3N0YXJ0OiBEYXRlLCBlbmQ6IERhdGUgfSB7XHJcbiAgICBpZiAoZGF0YS5tb250aFZpZXcpIHtcclxuICAgICAgICBjb25zdCBzdGFydE4gPSBNYXRoLm1pbiguLi5kYXRhLmFzc2lnbm1lbnRzLm1hcCgoYSkgPT4gYS5zdGFydCkpIC8vIFNtYWxsZXN0IGRhdGVcclxuICAgICAgICBjb25zdCBlbmROID0gTWF0aC5tYXgoLi4uZGF0YS5hc3NpZ25tZW50cy5tYXAoKGEpID0+IGEuc3RhcnQpKSAvLyBMYXJnZXN0IGRhdGVcclxuXHJcbiAgICAgICAgY29uc3QgeWVhciA9IChuZXcgRGF0ZSgpKS5nZXRGdWxsWWVhcigpIC8vIEZvciBmdXR1cmUgY2FsY3VsYXRpb25zXHJcblxyXG4gICAgICAgIC8vIENhbGN1bGF0ZSB3aGF0IG1vbnRoIHdlIHdpbGwgYmUgZGlzcGxheWluZyBieSBmaW5kaW5nIHRoZSBtb250aCBvZiB0b2RheVxyXG4gICAgICAgIGNvbnN0IG1vbnRoID0gKG5ldyBEYXRlKCkpLmdldE1vbnRoKClcclxuXHJcbiAgICAgICAgLy8gTWFrZSBzdXJlIHRoZSBzdGFydCBhbmQgZW5kIGRhdGVzIGxpZSB3aXRoaW4gdGhlIG1vbnRoXHJcbiAgICAgICAgY29uc3Qgc3RhcnQgPSBuZXcgRGF0ZShNYXRoLm1heChmcm9tRGF0ZU51bShzdGFydE4pLmdldFRpbWUoKSwgKG5ldyBEYXRlKHllYXIsIG1vbnRoKSkuZ2V0VGltZSgpKSlcclxuICAgICAgICAvLyBJZiB0aGUgZGF5IGFyZ3VtZW50IGZvciBEYXRlIGlzIDAsIHRoZW4gdGhlIHJlc3VsdGluZyBkYXRlIHdpbGwgYmUgb2YgdGhlIHByZXZpb3VzIG1vbnRoXHJcbiAgICAgICAgY29uc3QgZW5kID0gbmV3IERhdGUoTWF0aC5taW4oZnJvbURhdGVOdW0oZW5kTikuZ2V0VGltZSgpLCAobmV3IERhdGUoeWVhciwgbW9udGggKyAxLCAwKSkuZ2V0VGltZSgpKSlcclxuICAgICAgICByZXR1cm4geyBzdGFydCwgZW5kIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zdCB0b2RheVNFID0gbmV3IERhdGUoKVxyXG4gICAgICAgIGNvbnN0IHN0YXJ0ID0gbmV3IERhdGUodG9kYXlTRS5nZXRGdWxsWWVhcigpLCB0b2RheVNFLmdldE1vbnRoKCksIHRvZGF5U0UuZ2V0RGF0ZSgpKVxyXG4gICAgICAgIGNvbnN0IGVuZCA9IG5ldyBEYXRlKHRvZGF5U0UuZ2V0RnVsbFllYXIoKSwgdG9kYXlTRS5nZXRNb250aCgpLCB0b2RheVNFLmdldERhdGUoKSlcclxuICAgICAgICByZXR1cm4geyBzdGFydCwgZW5kIH1cclxuICAgICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRBc3NpZ25tZW50U3BsaXRzKGFzc2lnbm1lbnQ6IElBc3NpZ25tZW50LCBzdGFydDogRGF0ZSwgZW5kOiBEYXRlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlZmVyZW5jZT86IElDdXN0b21Bc3NpZ25tZW50KTogSVNwbGl0QXNzaWdubWVudFtdIHtcclxuICAgIGNvbnN0IHNwbGl0OiBJU3BsaXRBc3NpZ25tZW50W10gPSBbXVxyXG4gICAgaWYgKHNldHRpbmdzLmFzc2lnbm1lbnRTcGFuID09PSAnbXVsdGlwbGUnKSB7XHJcbiAgICAgICAgY29uc3QgcyA9IE1hdGgubWF4KHN0YXJ0LmdldFRpbWUoKSwgZnJvbURhdGVOdW0oYXNzaWdubWVudC5zdGFydCkuZ2V0VGltZSgpKVxyXG4gICAgICAgIGNvbnN0IGUgPSBhc3NpZ25tZW50LmVuZCA9PT0gJ0ZvcmV2ZXInID8gcyA6IE1hdGgubWluKGVuZC5nZXRUaW1lKCksIGZyb21EYXRlTnVtKGFzc2lnbm1lbnQuZW5kKS5nZXRUaW1lKCkpXHJcbiAgICAgICAgY29uc3Qgc3BhbiA9ICgoZSAtIHMpIC8gMTAwMCAvIDM2MDAgLyAyNCkgKyAxIC8vIE51bWJlciBvZiBkYXlzIGFzc2lnbm1lbnQgdGFrZXMgdXBcclxuICAgICAgICBjb25zdCBzcGFuUmVsYXRpdmUgPSA2IC0gKG5ldyBEYXRlKHMpKS5nZXREYXkoKSAvLyBOdW1iZXIgb2YgZGF5cyB1bnRpbCB0aGUgbmV4dCBTYXR1cmRheVxyXG5cclxuICAgICAgICBjb25zdCBucyA9IG5ldyBEYXRlKHMpXHJcbiAgICAgICAgbnMuc2V0RGF0ZShucy5nZXREYXRlKCkgKyBzcGFuUmVsYXRpdmUpIC8vICBUaGUgZGF0ZSBvZiB0aGUgbmV4dCBTYXR1cmRheVxyXG5cclxuICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmUgbm8tbG9vcHNcclxuICAgICAgICBmb3IgKGxldCBuID0gLTY7IG4gPCBzcGFuIC0gc3BhblJlbGF0aXZlOyBuICs9IDcpIHtcclxuICAgICAgICAgICAgY29uc3QgbGFzdFN1biA9IG5ldyBEYXRlKG5zKVxyXG4gICAgICAgICAgICBsYXN0U3VuLnNldERhdGUobGFzdFN1bi5nZXREYXRlKCkgKyBuKVxyXG5cclxuICAgICAgICAgICAgY29uc3QgbmV4dFNhdCA9IG5ldyBEYXRlKGxhc3RTdW4pXHJcbiAgICAgICAgICAgIG5leHRTYXQuc2V0RGF0ZShuZXh0U2F0LmdldERhdGUoKSArIDYpXHJcbiAgICAgICAgICAgIHNwbGl0LnB1c2goe1xyXG4gICAgICAgICAgICAgICAgYXNzaWdubWVudCxcclxuICAgICAgICAgICAgICAgIHN0YXJ0OiBuZXcgRGF0ZShNYXRoLm1heChzLCBsYXN0U3VuLmdldFRpbWUoKSkpLFxyXG4gICAgICAgICAgICAgICAgZW5kOiBuZXcgRGF0ZShNYXRoLm1pbihlLCBuZXh0U2F0LmdldFRpbWUoKSkpLFxyXG4gICAgICAgICAgICAgICAgY3VzdG9tOiBCb29sZWFuKHJlZmVyZW5jZSksXHJcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKHNldHRpbmdzLmFzc2lnbm1lbnRTcGFuID09PSAnc3RhcnQnKSB7XHJcbiAgICAgICAgY29uc3QgcyA9IGZyb21EYXRlTnVtKGFzc2lnbm1lbnQuc3RhcnQpXHJcbiAgICAgICAgaWYgKHMuZ2V0VGltZSgpID49IHN0YXJ0LmdldFRpbWUoKSkge1xyXG4gICAgICAgICAgICBzcGxpdC5wdXNoKHtcclxuICAgICAgICAgICAgICAgIGFzc2lnbm1lbnQsXHJcbiAgICAgICAgICAgICAgICBzdGFydDogcyxcclxuICAgICAgICAgICAgICAgIGVuZDogcyxcclxuICAgICAgICAgICAgICAgIGN1c3RvbTogQm9vbGVhbihyZWZlcmVuY2UpLFxyXG4gICAgICAgICAgICAgICAgcmVmZXJlbmNlXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChzZXR0aW5ncy5hc3NpZ25tZW50U3BhbiA9PT0gJ2VuZCcpIHtcclxuICAgICAgICBjb25zdCBlID0gYXNzaWdubWVudC5lbmQgPT09ICdGb3JldmVyJyA/IGFzc2lnbm1lbnQuZW5kIDogZnJvbURhdGVOdW0oYXNzaWdubWVudC5lbmQpXHJcbiAgICAgICAgY29uc3QgZGUgPSBlID09PSAnRm9yZXZlcicgPyBmcm9tRGF0ZU51bShhc3NpZ25tZW50LnN0YXJ0KSA6IGVcclxuICAgICAgICBpZiAoZGUuZ2V0VGltZSgpIDw9IGVuZC5nZXRUaW1lKCkpIHtcclxuICAgICAgICAgICAgc3BsaXQucHVzaCh7XHJcbiAgICAgICAgICAgICAgICBhc3NpZ25tZW50LFxyXG4gICAgICAgICAgICAgICAgc3RhcnQ6IGRlLFxyXG4gICAgICAgICAgICAgICAgZW5kOiBlLFxyXG4gICAgICAgICAgICAgICAgY3VzdG9tOiBCb29sZWFuKHJlZmVyZW5jZSksXHJcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHNwbGl0XHJcbn1cclxuXHJcbi8vIFRoaXMgZnVuY3Rpb24gd2lsbCBjb252ZXJ0IHRoZSBhcnJheSBvZiBhc3NpZ25tZW50cyBnZW5lcmF0ZWQgYnkgKnBhcnNlKiBpbnRvIHJlYWRhYmxlIEhUTUwuXHJcbmV4cG9ydCBmdW5jdGlvbiBkaXNwbGF5KGRvU2Nyb2xsOiBib29sZWFuID0gdHJ1ZSk6IHZvaWQge1xyXG4gICAgY29uc29sZS50aW1lKCdEaXNwbGF5aW5nIGRhdGEnKVxyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBkYXRhID0gZ2V0RGF0YSgpXHJcbiAgICAgICAgaWYgKCFkYXRhKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRGF0YSBzaG91bGQgaGF2ZSBiZWVuIGZldGNoZWQgYmVmb3JlIGRpc3BsYXkoKSB3YXMgY2FsbGVkJylcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuc2V0QXR0cmlidXRlKCdkYXRhLXBjcnZpZXcnLCBkYXRhLm1vbnRoVmlldyA/ICdtb250aCcgOiAnb3RoZXInKVxyXG4gICAgICAgIGNvbnN0IG1haW4gPSBfJChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdtYWluJykpXHJcbiAgICAgICAgY29uc3QgdGFrZW46IHsgW2RhdGU6IG51bWJlcl06IG51bWJlcltdIH0gPSB7fVxyXG5cclxuICAgICAgICBjb25zdCB0aW1lYWZ0ZXIgPSBnZXRUaW1lQWZ0ZXIobmV3IERhdGUoKSlcclxuXHJcbiAgICAgICAgY29uc3Qge3N0YXJ0LCBlbmR9ID0gZ2V0U3RhcnRFbmREYXRlcyhkYXRhKVxyXG5cclxuICAgICAgICAvLyBTZXQgdGhlIHN0YXJ0IGRhdGUgdG8gYmUgYSBTdW5kYXkgYW5kIHRoZSBlbmQgZGF0ZSB0byBiZSBhIFNhdHVyZGF5XHJcbiAgICAgICAgc3RhcnQuc2V0RGF0ZShzdGFydC5nZXREYXRlKCkgLSBzdGFydC5nZXREYXkoKSlcclxuICAgICAgICBlbmQuc2V0RGF0ZShlbmQuZ2V0RGF0ZSgpICsgKDYgLSBlbmQuZ2V0RGF5KCkpKVxyXG5cclxuICAgICAgICAvLyBGaXJzdCBwb3B1bGF0ZSB0aGUgY2FsZW5kYXIgd2l0aCBib3hlcyBmb3IgZWFjaCBkYXlcclxuICAgICAgICBjb25zdCBsYXN0RGF0YSA9IGxvY2FsU3RvcmFnZVJlYWQoJ2RhdGEnKSBhcyBJQXBwbGljYXRpb25EYXRhXHJcbiAgICAgICAgbGV0IHdrOiBIVE1MRWxlbWVudHxudWxsID0gbnVsbFxyXG4gICAgICAgIGl0ZXJEYXlzKHN0YXJ0LCBlbmQsIChkKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChkLmdldERheSgpID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpZCA9IGB3ayR7ZC5nZXRNb250aCgpfS0ke2QuZ2V0RGF0ZSgpfWAgLy8gRG9uJ3QgY3JlYXRlIGEgbmV3IHdlZWsgZWxlbWVudCBpZiBvbmUgYWxyZWFkeSBleGlzdHNcclxuICAgICAgICAgICAgICAgIHdrID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpXHJcbiAgICAgICAgICAgICAgICBpZiAod2sgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHdrID0gY3JlYXRlV2VlayhpZClcclxuICAgICAgICAgICAgICAgICAgICBtYWluLmFwcGVuZENoaWxkKHdrKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIXdrKSB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkIHdlZWsgZWxlbWVudCBvbiBkYXkgJHtkfSB0byBub3QgYmUgbnVsbGApXHJcbiAgICAgICAgICAgIGlmICh3ay5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdkYXknKS5sZW5ndGggPD0gZC5nZXREYXkoKSkge1xyXG4gICAgICAgICAgICAgICAgd2suYXBwZW5kQ2hpbGQoY3JlYXRlRGF5KGQpKVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0YWtlbltkLmdldFRpbWUoKV0gPSBbXVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIC8vIFNwbGl0IGFzc2lnbm1lbnRzIHRha2luZyBtb3JlIHRoYW4gMSB3ZWVrXHJcbiAgICAgICAgY29uc3Qgc3BsaXQ6IElTcGxpdEFzc2lnbm1lbnRbXSA9IFtdXHJcbiAgICAgICAgZGF0YS5hc3NpZ25tZW50cy5mb3JFYWNoKChhc3NpZ25tZW50LCBudW0pID0+IHtcclxuICAgICAgICAgICAgc3BsaXQucHVzaCguLi5nZXRBc3NpZ25tZW50U3BsaXRzKGFzc2lnbm1lbnQsIHN0YXJ0LCBlbmQpKVxyXG5cclxuICAgICAgICAgICAgLy8gQWN0aXZpdHkgc3R1ZmZcclxuICAgICAgICAgICAgaWYgKGxhc3REYXRhICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG9sZEFzc2lnbm1lbnQgPSBsYXN0RGF0YS5hc3NpZ25tZW50cy5maW5kKChhKSA9PiBhLmlkID09PSBhc3NpZ25tZW50LmlkKVxyXG4gICAgICAgICAgICAgICAgaWYgKG9sZEFzc2lnbm1lbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAob2xkQXNzaWdubWVudC5ib2R5ICE9PSBhc3NpZ25tZW50LmJvZHkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWRkQWN0aXZpdHkoJ2VkaXQnLCBvbGRBc3NpZ25tZW50LCBuZXcgRGF0ZSgpLCB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbGRBc3NpZ25tZW50LmNsYXNzICE9IG51bGwgPyBsYXN0RGF0YS5jbGFzc2VzW29sZEFzc2lnbm1lbnQuY2xhc3NdIDogdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZW1vdmVGcm9tTW9kaWZpZWQoYXNzaWdubWVudC5pZCkgLy8gSWYgdGhlIGFzc2lnbm1lbnQgaXMgbW9kaWZpZWQsIHJlc2V0IGl0XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGxhc3REYXRhLmFzc2lnbm1lbnRzLnNwbGljZShsYXN0RGF0YS5hc3NpZ25tZW50cy5pbmRleE9mKG9sZEFzc2lnbm1lbnQpLCAxKVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBhZGRBY3Rpdml0eSgnYWRkJywgYXNzaWdubWVudCwgbmV3IERhdGUoKSwgdHJ1ZSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIGlmIChsYXN0RGF0YSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIC8vIENoZWNrIGlmIGFueSBvZiB0aGUgbGFzdCBhc3NpZ25tZW50cyB3ZXJlbid0IGRlbGV0ZWQgKHNvIHRoZXkgaGF2ZSBiZWVuIGRlbGV0ZWQgaW4gUENSKVxyXG4gICAgICAgICAgICBsYXN0RGF0YS5hc3NpZ25tZW50cy5mb3JFYWNoKChhc3NpZ25tZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBhZGRBY3Rpdml0eSgnZGVsZXRlJywgYXNzaWdubWVudCwgbmV3IERhdGUoKSwgdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzc2lnbm1lbnQuY2xhc3MgIT0gbnVsbCA/IGxhc3REYXRhLmNsYXNzZXNbYXNzaWdubWVudC5jbGFzc10gOiB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICByZW1vdmVGcm9tRG9uZShhc3NpZ25tZW50LmlkKVxyXG4gICAgICAgICAgICAgICAgcmVtb3ZlRnJvbU1vZGlmaWVkKGFzc2lnbm1lbnQuaWQpXHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICAvLyBUaGVuIHNhdmUgYSBtYXhpbXVtIG9mIDEyOCBhY3Rpdml0eSBpdGVtc1xyXG4gICAgICAgICAgICBzYXZlQWN0aXZpdHkoKVxyXG5cclxuICAgICAgICAgICAgLy8gQW5kIGNvbXBsZXRlZCBhc3NpZ25tZW50cyArIG1vZGlmaWNhdGlvbnNcclxuICAgICAgICAgICAgc2F2ZURvbmUoKVxyXG4gICAgICAgICAgICBzYXZlTW9kaWZpZWQoKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gQWRkIGN1c3RvbSBhc3NpZ25tZW50cyB0byB0aGUgc3BsaXQgYXJyYXlcclxuICAgICAgICBnZXRFeHRyYSgpLmZvckVhY2goKGN1c3RvbSkgPT4ge1xyXG4gICAgICAgICAgICBzcGxpdC5wdXNoKC4uLmdldEFzc2lnbm1lbnRTcGxpdHMoZXh0cmFUb1Rhc2soY3VzdG9tLCBkYXRhKSwgc3RhcnQsIGVuZCwgY3VzdG9tKSlcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICAvLyBDYWxjdWxhdGUgdGhlIHRvZGF5J3Mgd2VlayBpZFxyXG4gICAgICAgIGNvbnN0IHRkc3QgPSBuZXcgRGF0ZSgpXHJcbiAgICAgICAgdGRzdC5zZXREYXRlKHRkc3QuZ2V0RGF0ZSgpIC0gdGRzdC5nZXREYXkoKSlcclxuICAgICAgICBjb25zdCB0b2RheVdrSWQgPSBgd2ske3Rkc3QuZ2V0TW9udGgoKX0tJHt0ZHN0LmdldERhdGUoKX1gXHJcblxyXG4gICAgICAgIC8vIFRoZW4gYWRkIGFzc2lnbm1lbnRzXHJcbiAgICAgICAgY29uc3Qgd2Vla0hlaWdodHM6IHsgW3dlZWtJZDogc3RyaW5nXTogbnVtYmVyIH0gPSB7fVxyXG4gICAgICAgIGNvbnN0IHByZXZpb3VzQXNzaWdubWVudHM6IHsgW2lkOiBzdHJpbmddOiBIVE1MRWxlbWVudCB9ID0ge31cclxuICAgICAgICBBcnJheS5wcm90b3R5cGUuZm9yRWFjaC5jYWxsKGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2Fzc2lnbm1lbnQnKSwgKGFzc2lnbm1lbnQ6IEhUTUxFbGVtZW50KSA9PiB7XHJcbiAgICAgICAgICAgIHByZXZpb3VzQXNzaWdubWVudHNbYXNzaWdubWVudC5pZF0gPSBhc3NpZ25tZW50XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgc3BsaXQuZm9yRWFjaCgocykgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB3ZWVrSWQgPSBjb21wdXRlV2Vla0lkKHMpXHJcbiAgICAgICAgICAgIHdrID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQod2Vla0lkKVxyXG4gICAgICAgICAgICBpZiAod2sgPT0gbnVsbCkgcmV0dXJuXHJcblxyXG4gICAgICAgICAgICBjb25zdCBlID0gY3JlYXRlQXNzaWdubWVudChzLCBkYXRhKVxyXG5cclxuICAgICAgICAgICAgLy8gQ2FsY3VsYXRlIGhvdyBtYW55IGFzc2lnbm1lbnRzIGFyZSBwbGFjZWQgYmVmb3JlIHRoZSBjdXJyZW50IG9uZVxyXG4gICAgICAgICAgICBpZiAoIXMuY3VzdG9tIHx8ICFzZXR0aW5ncy5zZXBUYXNrcykge1xyXG4gICAgICAgICAgICAgICAgbGV0IHBvcyA9IDBcclxuICAgICAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZSBuby1sb29wc1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZm91bmQgPSB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgaXRlckRheXMocy5zdGFydCwgcy5lbmQgPT09ICdGb3JldmVyJyA/IHMuc3RhcnQgOiBzLmVuZCwgKGQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRha2VuW2QuZ2V0VGltZSgpXS5pbmRleE9mKHBvcykgIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IGZhbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChmb3VuZCkgeyBicmVhayB9XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zKytcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBBcHBlbmQgdGhlIHBvc2l0aW9uIHRoZSBhc3NpZ25tZW50IGlzIGF0IHRvIHRoZSB0YWtlbiBhcnJheVxyXG4gICAgICAgICAgICAgICAgaXRlckRheXMocy5zdGFydCwgcy5lbmQgPT09ICdGb3JldmVyJyA/IHMuc3RhcnQgOiBzLmVuZCwgKGQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0YWtlbltkLmdldFRpbWUoKV0ucHVzaChwb3MpXHJcbiAgICAgICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIENhbGN1bGF0ZSBob3cgZmFyIGRvd24gdGhlIGFzc2lnbm1lbnQgbXVzdCBiZSBwbGFjZWQgYXMgdG8gbm90IGJsb2NrIHRoZSBvbmVzIGFib3ZlIGl0XHJcbiAgICAgICAgICAgICAgICBlLnN0eWxlLm1hcmdpblRvcCA9IChwb3MgKiAzMCkgKyAncHgnXHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCh3ZWVrSGVpZ2h0c1t3ZWVrSWRdID09IG51bGwpIHx8IChwb3MgPiB3ZWVrSGVpZ2h0c1t3ZWVrSWRdKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHdlZWtIZWlnaHRzW3dlZWtJZF0gPSBwb3NcclxuICAgICAgICAgICAgICAgICAgICB3ay5zdHlsZS5oZWlnaHQgPSA0NyArICgocG9zICsgMSkgKiAzMCkgKyAncHgnXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIElmIHRoZSBhc3NpZ25tZW50IGlzIGEgdGVzdCBhbmQgaXMgdXBjb21pbmcsIGFkZCBpdCB0byB0aGUgdXBjb21pbmcgdGVzdHMgcGFuZWwuXHJcbiAgICAgICAgICAgIGlmIChzLmFzc2lnbm1lbnQuZW5kID49IHRvZGF5KCkgJiYgKHMuYXNzaWdubWVudC5iYXNlVHlwZSA9PT0gJ3Rlc3QnIHx8XHJcbiAgICAgICAgICAgICAgICAoc2V0dGluZ3MucHJvamVjdHNJblRlc3RQYW5lICYmIHMuYXNzaWdubWVudC5iYXNlVHlwZSA9PT0gJ2xvbmd0ZXJtJykpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0ZSA9IGVsZW1lbnQoJ2RpdicsIFsndXBjb21pbmdUZXN0JywgJ2Fzc2lnbm1lbnRJdGVtJywgcy5hc3NpZ25tZW50LmJhc2VUeXBlXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgPGkgY2xhc3M9J21hdGVyaWFsLWljb25zJz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7cy5hc3NpZ25tZW50LmJhc2VUeXBlID09PSAnbG9uZ3Rlcm0nID8gJ2Fzc2lnbm1lbnQnIDogJ2Fzc2Vzc21lbnQnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2k+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPSd0aXRsZSc+JHtzLmFzc2lnbm1lbnQudGl0bGV9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c21hbGw+JHtzZXBhcmF0ZWRDbGFzcyhzLmFzc2lnbm1lbnQsIGRhdGEpWzJdfTwvc21hbGw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9J3JhbmdlJz4ke2RhdGVTdHJpbmcocy5hc3NpZ25tZW50LmVuZCwgdHJ1ZSl9PC9kaXY+YCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgdGVzdCR7cy5hc3NpZ25tZW50LmlkfWApXHJcbiAgICAgICAgICAgICAgICBpZiAocy5hc3NpZ25tZW50LmNsYXNzKSB0ZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtY2xhc3MnLCBkYXRhLmNsYXNzZXNbcy5hc3NpZ25tZW50LmNsYXNzXSlcclxuICAgICAgICAgICAgICAgIHRlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRvU2Nyb2xsaW5nID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBzbW9vdGhTY3JvbGwoKGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wICsgZG9jdW1lbnQuYm9keS5zY3JvbGxUb3ApIC0gMTE2KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlLmNsaWNrKClcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRvY3VtZW50LmJvZHkuZ2V0QXR0cmlidXRlKCdkYXRhLXZpZXcnKSA9PT0gJzAnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvU2Nyb2xsaW5nKClcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfJChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbmF2VGFicz5saTpmaXJzdC1jaGlsZCcpIGFzIEhUTUxFbGVtZW50KS5jbGljaygpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZG9TY3JvbGxpbmcsIDUwMClcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChhc3NpZ25tZW50SW5Eb25lKHMuYXNzaWdubWVudC5pZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0ZS5jbGFzc0xpc3QuYWRkKCdkb25lJylcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvbnN0IHRlc3RFbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYHRlc3Qke3MuYXNzaWdubWVudC5pZH1gKVxyXG4gICAgICAgICAgICAgICAgaWYgKHRlc3RFbGVtKSB7XHJcbiAgICAgICAgICAgICAgICB0ZXN0RWxlbS5pbm5lckhUTUwgPSB0ZS5pbm5lckhUTUxcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbUJ5SWQoJ2luZm9UZXN0cycpLmFwcGVuZENoaWxkKHRlKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBhbHJlYWR5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocy5hc3NpZ25tZW50LmlkICsgd2Vla0lkKVxyXG4gICAgICAgICAgICBpZiAoYWxyZWFkeSAhPSBudWxsKSB7IC8vIEFzc2lnbm1lbnQgYWxyZWFkeSBleGlzdHNcclxuICAgICAgICAgICAgICAgIGFscmVhZHkuc3R5bGUubWFyZ2luVG9wID0gZS5zdHlsZS5tYXJnaW5Ub3BcclxuICAgICAgICAgICAgICAgIGFscmVhZHkuc2V0QXR0cmlidXRlKCdkYXRhLWNsYXNzJyxcclxuICAgICAgICAgICAgICAgICAgICBzLmN1c3RvbSAmJiBzZXR0aW5ncy5zZXBUYXNrQ2xhc3MgPyAnVGFzaycgOiBjbGFzc0J5SWQocy5hc3NpZ25tZW50LmNsYXNzKSlcclxuICAgICAgICAgICAgICAgIGlmICghYXNzaWdubWVudEluTW9kaWZpZWQocy5hc3NpZ25tZW50LmlkKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFscmVhZHkuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYm9keScpWzBdLmlubmVySFRNTCA9IGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYm9keScpWzBdLmlubmVySFRNTFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXyQoYWxyZWFkeS5xdWVyeVNlbGVjdG9yKCcuZWRpdHMnKSkuY2xhc3NOYW1lID0gXyQoZS5xdWVyeVNlbGVjdG9yKCcuZWRpdHMnKSkuY2xhc3NOYW1lXHJcbiAgICAgICAgICAgICAgICBpZiAoYWxyZWFkeS5jbGFzc0xpc3QudG9nZ2xlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxyZWFkeS5jbGFzc0xpc3QudG9nZ2xlKCdsaXN0RGlzcCcsIGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdsaXN0RGlzcCcpKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZ2V0RVMoYWxyZWFkeSkuZm9yRWFjaCgoY2wpID0+IGFscmVhZHkuY2xhc3NMaXN0LnJlbW92ZShjbCkpXHJcbiAgICAgICAgICAgICAgICBnZXRFUyhlKS5mb3JFYWNoKChjbCkgPT4gYWxyZWFkeS5jbGFzc0xpc3QuYWRkKGNsKSlcclxuICAgICAgICAgICAgICAgIFdFRUtFTkRfQ0xBU1NOQU1FUy5mb3JFYWNoKChjbCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGFscmVhZHkuY2xhc3NMaXN0LnJlbW92ZShjbClcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZS5jbGFzc0xpc3QuY29udGFpbnMoY2wpKSBhbHJlYWR5LmNsYXNzTGlzdC5hZGQoY2wpXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKHMuY3VzdG9tICYmIHNldHRpbmdzLnNlcFRhc2tzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3QgPSBNYXRoLmZsb29yKHMuc3RhcnQuZ2V0VGltZSgpIC8gMTAwMCAvIDM2MDAgLyAyNClcclxuICAgICAgICAgICAgICAgICAgICBpZiAoKHMuYXNzaWdubWVudC5zdGFydCA9PT0gc3QpICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIChzLmFzc2lnbm1lbnQuZW5kID09PSAnRm9yZXZlcicgfHwgcy5hc3NpZ25tZW50LmVuZCA+PSB0b2RheSgpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlLmNsYXNzTGlzdC5yZW1vdmUoJ2Fzc2lnbm1lbnQnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlLmNsYXNzTGlzdC5hZGQoJ3Rhc2tQYW5lSXRlbScpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGUuc3R5bGUub3JkZXIgPSBTdHJpbmcocy5hc3NpZ25tZW50LmVuZCA9PT0gJ0ZvcmV2ZXInID8gTnVtYmVyLk1BWF9WQUxVRSA6IHMuYXNzaWdubWVudC5lbmQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGxpbmsgPSBlLnF1ZXJ5U2VsZWN0b3IoJy5saW5rZWQnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobGluaykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5pbnNlcnRCZWZvcmUoZWxlbWVudCgnc21hbGwnLCBbXSwgbGluay5pbm5lckhUTUwpLCBsaW5rKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluay5yZW1vdmUoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1CeUlkKCdpbmZvVGFza3NJbm5lcicpLmFwcGVuZENoaWxkKGUpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHsgd2suYXBwZW5kQ2hpbGQoZSkgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGRlbGV0ZSBwcmV2aW91c0Fzc2lnbm1lbnRzW3MuYXNzaWdubWVudC5pZCArIHdlZWtJZF1cclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICAvLyBEZWxldGUgYW55IGFzc2lnbm1lbnRzIHRoYXQgaGF2ZSBiZWVuIGRlbGV0ZWQgc2luY2UgdXBkYXRpbmdcclxuICAgICAgICBPYmplY3QuZW50cmllcyhwcmV2aW91c0Fzc2lnbm1lbnRzKS5mb3JFYWNoKChbbmFtZSwgYXNzaWdubWVudF0pID0+IHtcclxuICAgICAgICAgICAgaWYgKGFzc2lnbm1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdmdWxsJykpIHtcclxuICAgICAgICAgICAgICAgIGVsZW1CeUlkKCdiYWNrZ3JvdW5kJykuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBhc3NpZ25tZW50LnJlbW92ZSgpXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgLy8gU2Nyb2xsIHRvIHRoZSBjb3JyZWN0IHBvc2l0aW9uIGluIGNhbGVuZGFyIHZpZXdcclxuICAgICAgICBpZiAod2Vla0hlaWdodHNbdG9kYXlXa0lkXSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIGxldCBoID0gMFxyXG4gICAgICAgICAgICBjb25zdCBzdyA9ICh3a2lkOiBzdHJpbmcpID0+IHdraWQuc3Vic3RyaW5nKDIpLnNwbGl0KCctJykubWFwKCh4KSA9PiBOdW1iZXIoeCkpXHJcbiAgICAgICAgICAgIGNvbnN0IHRvZGF5V2sgPSBzdyh0b2RheVdrSWQpXHJcbiAgICAgICAgICAgIE9iamVjdC5lbnRyaWVzKHdlZWtIZWlnaHRzKS5mb3JFYWNoKChbd2tJZCwgdmFsXSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgd2tTcGxpdCA9IHN3KHdrSWQpXHJcbiAgICAgICAgICAgICAgICBpZiAoKHdrU3BsaXRbMF0gPCB0b2RheVdrWzBdKSB8fCAoKHdrU3BsaXRbMF0gPT09IHRvZGF5V2tbMF0pICYmICh3a1NwbGl0WzFdIDwgdG9kYXlXa1sxXSkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaCArPSB2YWxcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgc2Nyb2xsID0gKGggKiAzMCkgKyAxMTIgKyAxNFxyXG4gICAgICAgICAgICAvLyBBbHNvIHNob3cgdGhlIGRheSBoZWFkZXJzIGlmIHRvZGF5J3MgZGF0ZSBpcyBkaXNwbGF5ZWQgaW4gdGhlIGZpcnN0IHJvdyBvZiB0aGUgY2FsZW5kYXJcclxuICAgICAgICAgICAgaWYgKHNjcm9sbCA8IDUwKSBzY3JvbGwgPSAwXHJcbiAgICAgICAgICAgIGlmIChkb1Njcm9sbCAmJiAoZG9jdW1lbnQuYm9keS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmlldycpID09PSAnMCcpICYmXHJcbiAgICAgICAgICAgICAgICAhZG9jdW1lbnQuYm9keS5xdWVyeVNlbGVjdG9yKCcuZnVsbCcpKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBpbiBjYWxlbmRhciB2aWV3XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgc2Nyb2xsKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC50b2dnbGUoJ25vTGlzdCcsXHJcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5hc3NpZ25tZW50Lmxpc3REaXNwOm5vdCguZG9uZSknKS5sZW5ndGggPT09IDApXHJcbiAgICAgICAgaWYgKGRvY3VtZW50LmJvZHkuZ2V0QXR0cmlidXRlKCdkYXRhLXZpZXcnKSA9PT0gJzEnKSB7IC8vIGluIGxpc3Qgdmlld1xyXG4gICAgICAgICAgICByZXNpemUoKVxyXG4gICAgICAgIH1cclxuICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgIGRpc3BsYXlFcnJvcihlcnIpXHJcbiAgICB9XHJcbiAgICBjb25zb2xlLnRpbWVFbmQoJ0Rpc3BsYXlpbmcgZGF0YScpXHJcbn1cclxuXHJcbi8vIFRoZSBmdW5jdGlvbiBiZWxvdyBjb252ZXJ0cyBhbiB1cGRhdGUgdGltZSB0byBhIGh1bWFuLXJlYWRhYmxlIGRhdGUuXHJcbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRVcGRhdGUoZGF0ZTogbnVtYmVyKTogc3RyaW5nIHtcclxuICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpXHJcbiAgY29uc3QgdXBkYXRlID0gbmV3IERhdGUoK2RhdGUpXHJcbiAgaWYgKG5vdy5nZXREYXRlKCkgPT09IHVwZGF0ZS5nZXREYXRlKCkpIHtcclxuICAgIGxldCBhbXBtID0gJ0FNJ1xyXG4gICAgbGV0IGhyID0gdXBkYXRlLmdldEhvdXJzKClcclxuICAgIGlmIChociA+IDEyKSB7XHJcbiAgICAgIGFtcG0gPSAnUE0nXHJcbiAgICAgIGhyIC09IDEyXHJcbiAgICB9XHJcbiAgICBjb25zdCBtaW4gPSB1cGRhdGUuZ2V0TWludXRlcygpXHJcbiAgICByZXR1cm4gYFRvZGF5IGF0ICR7aHJ9OiR7bWluIDwgMTAgPyBgMCR7bWlufWAgOiBtaW59ICR7YW1wbX1gXHJcbiAgfSBlbHNlIHtcclxuICAgIGNvbnN0IGRheXNQYXN0ID0gTWF0aC5jZWlsKChub3cuZ2V0VGltZSgpIC0gdXBkYXRlLmdldFRpbWUoKSkgLyAxMDAwIC8gMzYwMCAvIDI0KVxyXG4gICAgaWYgKGRheXNQYXN0ID09PSAxKSB7IHJldHVybiAnWWVzdGVyZGF5JyB9IGVsc2UgeyByZXR1cm4gZGF5c1Bhc3QgKyAnIGRheXMgYWdvJyB9XHJcbiAgfVxyXG59XHJcbiIsImxldCBsaXN0RGF0ZU9mZnNldCA9IDBcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRMaXN0RGF0ZU9mZnNldCgpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIGxpc3REYXRlT2Zmc2V0XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB6ZXJvTGlzdERhdGVPZmZzZXQoKTogdm9pZCB7XHJcbiAgICBsaXN0RGF0ZU9mZnNldCA9IDBcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGluY3JlbWVudExpc3REYXRlT2Zmc2V0KCk6IHZvaWQge1xyXG4gICAgbGlzdERhdGVPZmZzZXQgKz0gMVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZGVjcmVtZW50TGlzdERhdGVPZmZzZXQoKTogdm9pZCB7XHJcbiAgICBsaXN0RGF0ZU9mZnNldCAtPSAxXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRMaXN0RGF0ZU9mZnNldChvZmZzZXQ6IG51bWJlcik6IHZvaWQge1xyXG4gICAgbGlzdERhdGVPZmZzZXQgPSBvZmZzZXRcclxufVxyXG4iLCIvKipcclxuICogVGhpcyBtb2R1bGUgY29udGFpbnMgY29kZSB0byBib3RoIGZldGNoIGFuZCBwYXJzZSBhc3NpZ25tZW50cyBmcm9tIFBDUi5cclxuICovXHJcbmltcG9ydCB7IHVwZGF0ZUF2YXRhciB9IGZyb20gJy4vY29tcG9uZW50cy9hdmF0YXInXHJcbmltcG9ydCB7IGRpc3BsYXlFcnJvciB9IGZyb20gJy4vY29tcG9uZW50cy9lcnJvckRpc3BsYXknXHJcbmltcG9ydCB7IHNuYWNrYmFyIH0gZnJvbSAnLi9jb21wb25lbnRzL3NuYWNrYmFyJ1xyXG5pbXBvcnQgeyBkZWxldGVDb29raWUsIGdldENvb2tpZSwgc2V0Q29va2llIH0gZnJvbSAnLi9jb29raWVzJ1xyXG5pbXBvcnQgeyB0b0RhdGVOdW0gfSBmcm9tICcuL2RhdGVzJ1xyXG5pbXBvcnQgeyBmb3JtYXRVcGRhdGUsIGRpc3BsYXkgfSBmcm9tICcuL2Rpc3BsYXknXHJcbmltcG9ydCB7IF8kLCBlbGVtQnlJZCwgbG9jYWxTdG9yYWdlV3JpdGUsIHNlbmQgfSBmcm9tICcuL3V0aWwnXHJcblxyXG5jb25zdCBQQ1JfVVJMID0gJ2h0dHBzOi8vd2ViYXBwc2NhLnBjcnNvZnQuY29tJ1xyXG5jb25zdCBBU1NJR05NRU5UU19VUkwgPSBgJHtQQ1JfVVJMfS9DbHVlL1NDLUFzc2lnbm1lbnRzLUVuZC1EYXRlLVJhbmdlLzc1MzZgXHJcbmNvbnN0IExPR0lOX1VSTCA9IGAke1BDUl9VUkx9L0NsdWUvU0MtU3R1ZGVudC1Qb3J0YWwtTG9naW4tTERBUC84NDY0P3JldHVyblVybD0ke2VuY29kZVVSSUNvbXBvbmVudChBU1NJR05NRU5UU19VUkwpfWBcclxuY29uc3QgQVRUQUNITUVOVFNfVVJMID0gYCR7UENSX1VSTH0vQ2x1ZS9Db21tb24vQXR0YWNobWVudFJlbmRlci5hc3B4YFxyXG5jb25zdCBGT1JNX0hFQURFUl9PTkxZID0geyAnQ29udGVudC10eXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcgfVxyXG5jb25zdCBPTkVfTUlOVVRFX01TID0gNjAwMDBcclxuXHJcbmNvbnN0IHByb2dyZXNzRWxlbWVudCA9IGVsZW1CeUlkKCdwcm9ncmVzcycpXHJcbmNvbnN0IGxvZ2luRGlhbG9nID0gZWxlbUJ5SWQoJ2xvZ2luJylcclxuY29uc3QgbG9naW5CYWNrZ3JvdW5kID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xvZ2luQmFja2dyb3VuZCcpXHJcbmNvbnN0IGxhc3RVcGRhdGVFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsYXN0VXBkYXRlJylcclxuY29uc3QgdXNlcm5hbWVFbCA9IGVsZW1CeUlkKCd1c2VybmFtZScpIGFzIEhUTUxJbnB1dEVsZW1lbnRcclxuY29uc3QgcGFzc3dvcmRFbCA9IGVsZW1CeUlkKCdwYXNzd29yZCcpIGFzIEhUTUxJbnB1dEVsZW1lbnRcclxuY29uc3QgcmVtZW1iZXJDaGVjayA9IGVsZW1CeUlkKCdyZW1lbWJlcicpIGFzIEhUTUxJbnB1dEVsZW1lbnRcclxuY29uc3QgaW5jb3JyZWN0TG9naW5FbCA9IGVsZW1CeUlkKCdsb2dpbkluY29ycmVjdCcpXHJcblxyXG4vLyBUT0RPIGtlZXBpbmcgdGhlc2UgYXMgYSBnbG9iYWwgdmFycyBpcyBiYWRcclxuY29uc3QgbG9naW5IZWFkZXJzOiB7W2hlYWRlcjogc3RyaW5nXTogc3RyaW5nfSA9IHt9XHJcbmNvbnN0IHZpZXdEYXRhOiB7W2hhZGVyOiBzdHJpbmddOiBzdHJpbmd9ID0ge31cclxubGV0IGxhc3RVcGRhdGUgPSAwIC8vIFRoZSBsYXN0IHRpbWUgZXZlcnl0aGluZyB3YXMgdXBkYXRlZFxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJQXBwbGljYXRpb25EYXRhIHtcclxuICAgIGNsYXNzZXM6IHN0cmluZ1tdXHJcbiAgICBhc3NpZ25tZW50czogSUFzc2lnbm1lbnRbXVxyXG4gICAgbW9udGhWaWV3OiBib29sZWFuXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUFzc2lnbm1lbnQge1xyXG4gICAgc3RhcnQ6IG51bWJlclxyXG4gICAgZW5kOiBudW1iZXJ8J0ZvcmV2ZXInXHJcbiAgICBhdHRhY2htZW50czogQXR0YWNobWVudEFycmF5W11cclxuICAgIGJvZHk6IHN0cmluZ1xyXG4gICAgdHlwZTogc3RyaW5nXHJcbiAgICBiYXNlVHlwZTogc3RyaW5nXHJcbiAgICBjbGFzczogbnVtYmVyfG51bGwsXHJcbiAgICB0aXRsZTogc3RyaW5nXHJcbiAgICBpZDogc3RyaW5nXHJcbn1cclxuXHJcbmV4cG9ydCB0eXBlIEF0dGFjaG1lbnRBcnJheSA9IFtzdHJpbmcsIHN0cmluZ11cclxuXHJcbi8vIFRoaXMgaXMgdGhlIGZ1bmN0aW9uIHRoYXQgcmV0cmlldmVzIHlvdXIgYXNzaWdubWVudHMgZnJvbSBQQ1IuXHJcbi8vXHJcbi8vIEZpcnN0LCBhIHJlcXVlc3QgaXMgc2VudCB0byBQQ1IgdG8gbG9hZCB0aGUgcGFnZSB5b3Ugd291bGQgbm9ybWFsbHkgc2VlIHdoZW4gYWNjZXNzaW5nIFBDUi5cclxuLy9cclxuLy8gQmVjYXVzZSB0aGlzIGlzIHJ1biBhcyBhIGNocm9tZSBleHRlbnNpb24sIHRoaXMgcGFnZSBjYW4gYmUgYWNjZXNzZWQuIE90aGVyd2lzZSwgdGhlIGJyb3dzZXJcclxuLy8gd291bGQgdGhyb3cgYW4gZXJyb3IgZm9yIHNlY3VyaXR5IHJlYXNvbnMgKHlvdSBkb24ndCB3YW50IGEgcmFuZG9tIHdlYnNpdGUgYmVpbmcgYWJsZSB0byBhY2Nlc3NcclxuLy8gY29uZmlkZW50aWFsIGRhdGEgZnJvbSBhIHdlYnNpdGUgeW91IGhhdmUgbG9nZ2VkIGludG8pLlxyXG5cclxuLyoqXHJcbiAqIEZldGNoZXMgZGF0YSBmcm9tIFBDUiBhbmQgaWYgdGhlIHVzZXIgaXMgbG9nZ2VkIGluIHBhcnNlcyBhbmQgZGlzcGxheXMgaXRcclxuICogQHBhcmFtIG92ZXJyaWRlIFdoZXRoZXIgdG8gZm9yY2UgYW4gdXBkYXRlIGV2ZW4gdGhlcmUgd2FzIG9uZSByZWNlbnRseVxyXG4gKiBAcGFyYW0gZGF0YSAgT3B0aW9uYWwgZGF0YSB0byBiZSBwb3N0ZWQgdG8gUENSXHJcbiAqL1xyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmV0Y2gob3ZlcnJpZGU6IGJvb2xlYW4gPSBmYWxzZSwgZGF0YT86IHN0cmluZywgb25zdWNjZXNzOiAoKSA9PiB2b2lkID0gZGlzcGxheSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ubG9naW4/OiAoKSA9PiB2b2lkKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICBpZiAoIW92ZXJyaWRlICYmIERhdGUubm93KCkgLSBsYXN0VXBkYXRlIDwgT05FX01JTlVURV9NUykgcmV0dXJuXHJcbiAgICBsYXN0VXBkYXRlID0gRGF0ZS5ub3coKVxyXG5cclxuICAgIGNvbnN0IGhlYWRlcnMgPSBkYXRhID8gRk9STV9IRUFERVJfT05MWSA6IHVuZGVmaW5lZFxyXG4gICAgY29uc29sZS50aW1lKCdGZXRjaGluZyBhc3NpZ25tZW50cycpXHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHJlc3AgPSBhd2FpdCBzZW5kKEFTU0lHTk1FTlRTX1VSTCwgJ2RvY3VtZW50JywgaGVhZGVycywgZGF0YSwgcHJvZ3Jlc3NFbGVtZW50KVxyXG4gICAgICAgIGNvbnNvbGUudGltZUVuZCgnRmV0Y2hpbmcgYXNzaWdubWVudHMnKVxyXG4gICAgICAgIGlmIChyZXNwLnJlc3BvbnNlVVJMLmluZGV4T2YoJ0xvZ2luJykgIT09IC0xKSB7XHJcbiAgICAgICAgICAgIC8vIFdlIGhhdmUgdG8gbG9nIGluIG5vd1xyXG4gICAgICAgICAgICAocmVzcC5yZXNwb25zZSBhcyBIVE1MRG9jdW1lbnQpLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdpbnB1dCcpLmZvckVhY2goKGUpID0+IHtcclxuICAgICAgICAgICAgICAgIGxvZ2luSGVhZGVyc1tlLm5hbWVdID0gZS52YWx1ZSB8fCAnJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnTmVlZCB0byBsb2cgaW4nKVxyXG4gICAgICAgICAgICBjb25zdCB1cCA9IGdldENvb2tpZSgndXNlclBhc3MnKSAvLyBBdHRlbXB0cyB0byBnZXQgdGhlIGNvb2tpZSAqdXNlclBhc3MqLCB3aGljaCBpcyBzZXQgaWYgdGhlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFwiUmVtZW1iZXIgbWVcIiBjaGVja2JveCBpcyBjaGVja2VkIHdoZW4gbG9nZ2luZyBpbiB0aHJvdWdoIENoZWNrUENSXHJcbiAgICAgICAgICAgIGlmICh1cCA9PT0gJycpIHtcclxuICAgICAgICAgICAgICAgIGlmIChsb2dpbkJhY2tncm91bmQpIGxvZ2luQmFja2dyb3VuZC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xyXG4gICAgICAgICAgICAgICAgbG9naW5EaWFsb2cuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIEJlY2F1c2Ugd2Ugd2VyZSByZW1lbWJlcmVkLCB3ZSBjYW4gbG9nIGluIGltbWVkaWF0ZWx5IHdpdGhvdXQgd2FpdGluZyBmb3IgdGhlXHJcbiAgICAgICAgICAgICAgICAvLyB1c2VyIHRvIGxvZyBpbiB0aHJvdWdoIHRoZSBsb2dpbiBmb3JtXHJcbiAgICAgICAgICAgICAgICBkb2xvZ2luKHdpbmRvdy5hdG9iKHVwKS5zcGxpdCgnOicpIGFzIFtzdHJpbmcsIHN0cmluZ10pXHJcbiAgICAgICAgICAgICAgICBpZiAob25sb2dpbikgb25sb2dpbigpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBMb2dnZWQgaW4gbm93XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdGZXRjaGluZyBhc3NpZ25tZW50cyBzdWNjZXNzZnVsJylcclxuICAgICAgICAgICAgY29uc3QgdCA9IERhdGUubm93KClcclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLmxhc3RVcGRhdGUgPSB0XHJcbiAgICAgICAgICAgIGlmIChsYXN0VXBkYXRlRWwpIGxhc3RVcGRhdGVFbC5pbm5lckhUTUwgPSBmb3JtYXRVcGRhdGUodClcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIHBhcnNlKHJlc3AucmVzcG9uc2UpXHJcbiAgICAgICAgICAgICAgICBvbnN1Y2Nlc3MoKVxyXG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpXHJcbiAgICAgICAgICAgICAgICBkaXNwbGF5RXJyb3IoZXJyb3IpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdDb3VsZCBub3QgZmV0Y2ggYXNzaWdubWVudHM7IFlvdSBhcmUgcHJvYmFibHkgb2ZmbGluZS4gSGVyZVxcJ3MgdGhlIGVycm9yOicsIGVycm9yKVxyXG4gICAgICAgIHNuYWNrYmFyKCdDb3VsZCBub3QgZmV0Y2ggeW91ciBhc3NpZ25tZW50cycsICdSZXRyeScsICgpID0+IGZldGNoKHRydWUpKVxyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogTG9ncyB0aGUgdXNlciBpbnRvIFBDUlxyXG4gKiBAcGFyYW0gdmFsICAgQW4gb3B0aW9uYWwgbGVuZ3RoLTIgYXJyYXkgb2YgdGhlIGZvcm0gW3VzZXJuYW1lLCBwYXNzd29yZF0gdG8gdXNlIHRoZSB1c2VyIGluIHdpdGguXHJcbiAqICAgICAgICAgICAgICBJZiB0aGlzIGFycmF5IGlzIG5vdCBnaXZlbiB0aGUgbG9naW4gZGlhbG9nIGlucHV0cyB3aWxsIGJlIHVzZWQuXHJcbiAqIEBwYXJhbSBzdWJtaXRFdnQgV2hldGhlciB0byBvdmVycmlkZSB0aGUgdXNlcm5hbWUgYW5kIHBhc3N3b3JkIHN1cHBsZWlkIGluIHZhbCB3aXRoIHRoZSB2YWx1ZXMgb2YgdGhlIGlucHV0IGVsZW1lbnRzXHJcbiAqL1xyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZG9sb2dpbih2YWw/OiBbc3RyaW5nLCBzdHJpbmddfG51bGwsIHN1Ym1pdEV2dDogYm9vbGVhbiA9IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbnN1Y2Nlc3M6ICgpID0+IHZvaWQgPSBkaXNwbGF5KTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICBsb2dpbkRpYWxvZy5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgaWYgKGxvZ2luQmFja2dyb3VuZCkgbG9naW5CYWNrZ3JvdW5kLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcclxuICAgIH0sIDM1MClcclxuXHJcbiAgICBjb25zdCBwb3N0QXJyYXk6IHN0cmluZ1tdID0gW10gLy8gQXJyYXkgb2YgZGF0YSB0byBwb3N0XHJcbiAgICBsb2NhbFN0b3JhZ2VXcml0ZSgndXNlcm5hbWUnLCB2YWwgJiYgIXN1Ym1pdEV2dCA/IHZhbFswXSA6IHVzZXJuYW1lRWwudmFsdWUpXHJcbiAgICB1cGRhdGVBdmF0YXIoKVxyXG4gICAgT2JqZWN0LmtleXMobG9naW5IZWFkZXJzKS5mb3JFYWNoKChoKSA9PiAge1xyXG4gICAgICAgIC8vIExvb3AgdGhyb3VnaCB0aGUgaW5wdXQgZWxlbWVudHMgY29udGFpbmVkIGluIHRoZSBsb2dpbiBwYWdlLiBBcyBtZW50aW9uZWQgYmVmb3JlLCB0aGV5XHJcbiAgICAgICAgLy8gd2lsbCBiZSBzZW50IHRvIFBDUiB0byBsb2cgaW4uXHJcbiAgICAgICAgaWYgKGgudG9Mb3dlckNhc2UoKS5pbmRleE9mKCd1c2VyJykgIT09IC0xKSB7XHJcbiAgICAgICAgICAgIGxvZ2luSGVhZGVyc1toXSA9IHZhbCAmJiAhc3VibWl0RXZ0ID8gdmFsWzBdIDogdXNlcm5hbWVFbC52YWx1ZVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaC50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ3Bhc3MnKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgbG9naW5IZWFkZXJzW2hdID0gdmFsICYmICFzdWJtaXRFdnQgPyB2YWxbMV0gOiBwYXNzd29yZEVsLnZhbHVlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBvc3RBcnJheS5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChoKSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudChsb2dpbkhlYWRlcnNbaF0pKVxyXG4gICAgfSlcclxuXHJcbiAgICAvLyBOb3cgc2VuZCB0aGUgbG9naW4gcmVxdWVzdCB0byBQQ1JcclxuICAgIGNvbnNvbGUudGltZSgnTG9nZ2luZyBpbicpXHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHJlc3AgPSBhd2FpdCBzZW5kKExPR0lOX1VSTCwgJ2RvY3VtZW50JywgRk9STV9IRUFERVJfT05MWSwgcG9zdEFycmF5LmpvaW4oJyYnKSwgcHJvZ3Jlc3NFbGVtZW50KVxyXG4gICAgICAgIGNvbnNvbGUudGltZUVuZCgnTG9nZ2luZyBpbicpXHJcbiAgICAgICAgaWYgKHJlc3AucmVzcG9uc2VVUkwuaW5kZXhPZignTG9naW4nKSAhPT0gLTEpIHtcclxuICAgICAgICAvLyBJZiBQQ1Igc3RpbGwgd2FudHMgdXMgdG8gbG9nIGluLCB0aGVuIHRoZSB1c2VybmFtZSBvciBwYXNzd29yZCBlbnRlcmVkIHdlcmUgaW5jb3JyZWN0LlxyXG4gICAgICAgICAgICBpbmNvcnJlY3RMb2dpbkVsLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXHJcbiAgICAgICAgICAgIHBhc3N3b3JkRWwudmFsdWUgPSAnJ1xyXG5cclxuICAgICAgICAgICAgbG9naW5EaWFsb2cuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuICAgICAgICAgICAgaWYgKGxvZ2luQmFja2dyb3VuZCkgbG9naW5CYWNrZ3JvdW5kLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gT3RoZXJ3aXNlLCB3ZSBhcmUgbG9nZ2VkIGluXHJcbiAgICAgICAgICAgIGlmIChyZW1lbWJlckNoZWNrLmNoZWNrZWQpIHsgLy8gSXMgdGhlIFwicmVtZW1iZXIgbWVcIiBjaGVja2JveCBjaGVja2VkP1xyXG4gICAgICAgICAgICAgICAgLy8gU2V0IGEgY29va2llIHdpdGggdGhlIHVzZXJuYW1lIGFuZCBwYXNzd29yZCBzbyB3ZSBjYW4gbG9nIGluIGF1dG9tYXRpY2FsbHkgaW4gdGhlXHJcbiAgICAgICAgICAgICAgICAvLyBmdXR1cmUgd2l0aG91dCBoYXZpbmcgdG8gcHJvbXB0IGZvciBhIHVzZXJuYW1lIGFuZCBwYXNzd29yZCBhZ2FpblxyXG4gICAgICAgICAgICAgICAgc2V0Q29va2llKCd1c2VyUGFzcycsIHdpbmRvdy5idG9hKHVzZXJuYW1lRWwudmFsdWUgKyAnOicgKyBwYXNzd29yZEVsLnZhbHVlKSwgMTQpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gbG9hZGluZ0Jhci5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCJcclxuICAgICAgICAgICAgY29uc3QgdCA9IERhdGUubm93KClcclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLmxhc3RVcGRhdGUgPSB0XHJcbiAgICAgICAgICAgIGlmIChsYXN0VXBkYXRlRWwpIGxhc3RVcGRhdGVFbC5pbm5lckhUTUwgPSBmb3JtYXRVcGRhdGUodClcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIHBhcnNlKHJlc3AucmVzcG9uc2UpIC8vIFBhcnNlIHRoZSBkYXRhIFBDUiBoYXMgcmVwbGllZCB3aXRoXHJcbiAgICAgICAgICAgICAgICBvbnN1Y2Nlc3MoKVxyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlKVxyXG4gICAgICAgICAgICAgICAgZGlzcGxheUVycm9yKGUpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICBjb25zb2xlLmxvZygnQ291bGQgbm90IGxvZyBpbiB0byBQQ1IuIEVpdGhlciB5b3VyIG5ldHdvcmsgY29ubmVjdGlvbiB3YXMgbG9zdCBkdXJpbmcgeW91ciB2aXNpdCAnICtcclxuICAgICAgICAgICAgICAgICAgICAgJ29yIFBDUiBpcyBqdXN0IG5vdCB3b3JraW5nLiBIZXJlXFwncyB0aGUgZXJyb3I6JywgZXJyb3IpXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXREYXRhKCk6IElBcHBsaWNhdGlvbkRhdGF8dW5kZWZpbmVkIHtcclxuICAgIHJldHVybiAod2luZG93IGFzIGFueSkuZGF0YVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2xhc3NlcygpOiBzdHJpbmdbXSB7XHJcbiAgICBjb25zdCBkYXRhID0gZ2V0RGF0YSgpXHJcbiAgICBpZiAoIWRhdGEpIHJldHVybiBbXVxyXG4gICAgcmV0dXJuIGRhdGEuY2xhc3Nlc1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2V0RGF0YShkYXRhOiBJQXBwbGljYXRpb25EYXRhKTogdm9pZCB7XHJcbiAgICAod2luZG93IGFzIGFueSkuZGF0YSA9IGRhdGFcclxufVxyXG5cclxuLy8gSW4gUENSJ3MgaW50ZXJmYWNlLCB5b3UgY2FuIGNsaWNrIGEgZGF0ZSBpbiBtb250aCBvciB3ZWVrIHZpZXcgdG8gc2VlIGl0IGluIGRheSB2aWV3LlxyXG4vLyBUaGVyZWZvcmUsIHRoZSBIVE1MIGVsZW1lbnQgdGhhdCBzaG93cyB0aGUgZGF0ZSB0aGF0IHlvdSBjYW4gY2xpY2sgb24gaGFzIGEgaHlwZXJsaW5rIHRoYXQgbG9va3MgbGlrZSBgIzIwMTUtMDQtMjZgLlxyXG4vLyBUaGUgZnVuY3Rpb24gYmVsb3cgd2lsbCBwYXJzZSB0aGF0IFN0cmluZyBhbmQgcmV0dXJuIGEgRGF0ZSB0aW1lc3RhbXBcclxuZnVuY3Rpb24gcGFyc2VEYXRlSGFzaChlbGVtZW50OiBIVE1MQW5jaG9yRWxlbWVudCk6IG51bWJlciB7XHJcbiAgICBjb25zdCBbeWVhciwgbW9udGgsIGRheV0gPSBlbGVtZW50Lmhhc2guc3Vic3RyaW5nKDEpLnNwbGl0KCctJykubWFwKE51bWJlcilcclxuICAgIHJldHVybiAobmV3IERhdGUoeWVhciwgbW9udGggLSAxLCBkYXkpKS5nZXRUaW1lKClcclxufVxyXG5cclxuLy8gVGhlICphdHRhY2htZW50aWZ5KiBmdW5jdGlvbiBwYXJzZXMgdGhlIGJvZHkgb2YgYW4gYXNzaWdubWVudCAoKnRleHQqKSBhbmQgcmV0dXJucyB0aGUgYXNzaWdubWVudCdzIGF0dGFjaG1lbnRzLlxyXG4vLyBTaWRlIGVmZmVjdDogdGhlc2UgYXR0YWNobWVudHMgYXJlIHJlbW92ZWRcclxuZnVuY3Rpb24gYXR0YWNobWVudGlmeShlbGVtZW50OiBIVE1MRWxlbWVudCk6IEF0dGFjaG1lbnRBcnJheVtdIHtcclxuICAgIGNvbnN0IGF0dGFjaG1lbnRzOiBBdHRhY2htZW50QXJyYXlbXSA9IFtdXHJcblxyXG4gICAgLy8gR2V0IGFsbCBsaW5rc1xyXG4gICAgY29uc3QgYXMgPSBBcnJheS5mcm9tKGVsZW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2EnKSlcclxuICAgIGFzLmZvckVhY2goKGEpID0+IHtcclxuICAgICAgICBpZiAoYS5pZC5pbmNsdWRlcygnQXR0YWNobWVudCcpKSB7XHJcbiAgICAgICAgICAgIGF0dGFjaG1lbnRzLnB1c2goW1xyXG4gICAgICAgICAgICAgICAgYS5pbm5lckhUTUwsXHJcbiAgICAgICAgICAgICAgICBhLnNlYXJjaCArIGEuaGFzaFxyXG4gICAgICAgICAgICBdKVxyXG4gICAgICAgICAgICBhLnJlbW92ZSgpXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICAgIHJldHVybiBhdHRhY2htZW50c1xyXG59XHJcblxyXG4vLyBUaGlzIGZ1bmN0aW9uIHJlcGxhY2VzIHRleHQgdGhhdCByZXByZXNlbnRzIGEgaHlwZXJsaW5rIHdpdGggYSBmdW5jdGlvbmFsIGh5cGVybGluayBieSB1c2luZ1xyXG4vLyBqYXZhc2NyaXB0J3MgcmVwbGFjZSBmdW5jdGlvbiB3aXRoIGEgcmVndWxhciBleHByZXNzaW9uIGlmIHRoZSB0ZXh0IGFscmVhZHkgaXNuJ3QgcGFydCBvZiBhXHJcbi8vIGh5cGVybGluay5cclxuZnVuY3Rpb24gdXJsaWZ5KHRleHQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGV4dC5yZXBsYWNlKG5ldyBSZWdFeHAoYChcXFxyXG4gICAgICAgIGh0dHBzPzpcXFxcL1xcXFwvXFxcclxuICAgICAgICBbLUEtWjAtOSsmQCNcXFxcLyU/PX5ffCE6LC47XSpcXFxyXG4gICAgICAgIFstQS1aMC05KyZAI1xcXFwvJT1+X3xdK1xcXHJcbiAgICAgICAgKWAsICdpZydcclxuICAgICksIChzdHIsIHN0cjIsIG9mZnNldCkgPT4geyAvLyBGdW5jdGlvbiB0byByZXBsYWNlIG1hdGNoZXNcclxuICAgICAgICBpZiAoL2hyZWZcXHMqPVxccyouLy50ZXN0KHRleHQuc3Vic3RyaW5nKG9mZnNldCAtIDEwLCBvZmZzZXQpKSB8fFxyXG4gICAgICAgICAgICAvb3JpZ2luYWxwYXRoXFxzKj1cXHMqLi8udGVzdCh0ZXh0LnN1YnN0cmluZyhvZmZzZXQgLSAyMCwgb2Zmc2V0KSlcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHN0clxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBgPGEgaHJlZj1cIiR7c3RyfVwiPiR7c3RyfTwvYT5gXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxufVxyXG5cclxuLy8gQWxzbywgUENSXCJzIGludGVyZmFjZSB1c2VzIGEgc3lzdGVtIG9mIElEcyB0byBpZGVudGlmeSBkaWZmZXJlbnQgZWxlbWVudHMuIEZvciBleGFtcGxlLCB0aGUgSUQgb2ZcclxuLy8gb25lIG9mIHRoZSBib3hlcyBzaG93aW5nIHRoZSBuYW1lIG9mIGFuIGFzc2lnbm1lbnQgY291bGQgYmVcclxuLy8gYGN0bDAwX2N0bDAwX2Jhc2VDb250ZW50X2Jhc2VDb250ZW50X2ZsYXNoVG9wX2N0bDAwX1JhZFNjaGVkdWxlcjFfOTVfMGAuIFRoZSBmdW5jdGlvbiBiZWxvdyB3aWxsXHJcbi8vIHJldHVybiB0aGUgZmlyc3QgSFRNTCBlbGVtZW50IHdob3NlIElEIGNvbnRhaW5zIGEgc3BlY2lmaWVkIFN0cmluZyAoKmlkKikgYW5kIGNvbnRhaW5pbmcgYVxyXG4vLyBzcGVjaWZpZWQgdGFnICgqdGFnKikuXHJcbmZ1bmN0aW9uIGZpbmRJZChlbGVtZW50OiBIVE1MRWxlbWVudHxIVE1MRG9jdW1lbnQsIHRhZzogc3RyaW5nLCBpZDogc3RyaW5nKTogSFRNTEVsZW1lbnQge1xyXG4gICAgY29uc3QgZWwgPSBbLi4uZWxlbWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSh0YWcpXS5maW5kKChlKSA9PiBlLmlkLmluY2x1ZGVzKGlkKSlcclxuICAgIGlmICghZWwpIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGZpbmQgZWxlbWVudCB3aXRoIHRhZyAke3RhZ30gYW5kIGlkICR7aWR9IGluICR7ZWxlbWVudH1gKVxyXG4gICAgcmV0dXJuIGVsIGFzIEhUTUxFbGVtZW50XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBhcnNlQXNzaWdubWVudFR5cGUodHlwZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0eXBlLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgnJiBxdWl6emVzJywgJycpLnJlcGxhY2UoJ3Rlc3RzJywgJ3Rlc3QnKVxyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJzZUFzc2lnbm1lbnRCYXNlVHlwZSh0eXBlOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHR5cGUudG9Mb3dlckNhc2UoKS5yZXBsYWNlKCcmIHF1aXp6ZXMnLCAnJykucmVwbGFjZSgvXFxzL2csICcnKVxyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJzZUFzc2lnbm1lbnQoY2E6IEhUTUxFbGVtZW50KTogSUFzc2lnbm1lbnQge1xyXG4gICAgY29uc3QgZGF0YSA9IGdldERhdGEoKVxyXG4gICAgaWYgKCFkYXRhKSB0aHJvdyBuZXcgRXJyb3IoJ0RhdGEgZGljdGlvbmFyeSBub3Qgc2V0IHVwJylcclxuXHJcbiAgICAvLyBUaGUgc3RhcnRpbmcgZGF0ZSBhbmQgZW5kaW5nIGRhdGUgb2YgdGhlIGFzc2lnbm1lbnQgYXJlIHBhcnNlZCBmaXJzdFxyXG4gICAgY29uc3QgcmFuZ2UgPSBmaW5kSWQoY2EsICdzcGFuJywgJ1N0YXJ0aW5nT24nKS5pbm5lckhUTUwuc3BsaXQoJyAtICcpXHJcbiAgICBjb25zdCBhc3NpZ25tZW50U3RhcnQgPSB0b0RhdGVOdW0oRGF0ZS5wYXJzZShyYW5nZVswXSkpXHJcbiAgICBjb25zdCBhc3NpZ25tZW50RW5kID0gKHJhbmdlWzFdICE9IG51bGwpID8gdG9EYXRlTnVtKERhdGUucGFyc2UocmFuZ2VbMV0pKSA6IGFzc2lnbm1lbnRTdGFydFxyXG5cclxuICAgIC8vIFRoZW4sIHRoZSBuYW1lIG9mIHRoZSBhc3NpZ25tZW50IGlzIHBhcnNlZFxyXG4gICAgY29uc3QgdCA9IGZpbmRJZChjYSwgJ3NwYW4nLCAnbGJsVGl0bGUnKVxyXG4gICAgbGV0IHRpdGxlID0gdC5pbm5lckhUTUxcclxuXHJcbiAgICAvLyBUaGUgYWN0dWFsIGJvZHkgb2YgdGhlIGFzc2lnbm1lbnQgYW5kIGl0cyBhdHRhY2htZW50cyBhcmUgcGFyc2VkIG5leHRcclxuICAgIGNvbnN0IGIgPSBfJChfJCh0LnBhcmVudE5vZGUpLnBhcmVudE5vZGUpIGFzIEhUTUxFbGVtZW50XHJcbiAgICBbLi4uYi5nZXRFbGVtZW50c0J5VGFnTmFtZSgnZGl2JyldLnNsaWNlKDAsIDIpLmZvckVhY2goKGRpdikgPT4gZGl2LnJlbW92ZSgpKVxyXG5cclxuICAgIGNvbnN0IGFwID0gYXR0YWNobWVudGlmeShiKSAvLyBTZXBhcmF0ZXMgYXR0YWNobWVudHMgZnJvbSB0aGUgYm9keVxyXG5cclxuICAgIC8vIFRoZSBsYXN0IFJlcGxhY2UgcmVtb3ZlcyBsZWFkaW5nIGFuZCB0cmFpbGluZyBuZXdsaW5lc1xyXG4gICAgY29uc3QgYXNzaWdubWVudEJvZHkgPSB1cmxpZnkoYi5pbm5lckhUTUwpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXig/Olxccyo8YnJcXHMqXFwvPz4pKi8sICcnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLyg/Olxccyo8YnJcXHMqXFwvPz4pKlxccyokLywgJycpLnRyaW0oKVxyXG5cclxuICAgIC8vIEZpbmFsbHksIHdlIHNlcGFyYXRlIHRoZSBjbGFzcyBuYW1lIGFuZCB0eXBlIChob21ld29yaywgY2xhc3N3b3JrLCBvciBwcm9qZWN0cykgZnJvbSB0aGUgdGl0bGUgb2YgdGhlIGFzc2lnbm1lbnRcclxuICAgIGNvbnN0IG1hdGNoZWRUaXRsZSA9IHRpdGxlLm1hdGNoKC9cXCgoW14pXSpcXCkqKVxcKSQvKVxyXG4gICAgaWYgKChtYXRjaGVkVGl0bGUgPT0gbnVsbCkpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBwYXJzZSBhc3NpZ25tZW50IHRpdGxlIFxcXCIke3RpdGxlfVxcXCJgKVxyXG4gICAgfVxyXG4gICAgY29uc3QgYXNzaWdubWVudFR5cGUgPSBtYXRjaGVkVGl0bGVbMV1cclxuICAgIGNvbnN0IGFzc2lnbm1lbnRCYXNlVHlwZSA9IHBhcnNlQXNzaWdubWVudEJhc2VUeXBlKGNhLnRpdGxlLnN1YnN0cmluZygwLCBjYS50aXRsZS5pbmRleE9mKCdcXG4nKSkpXHJcbiAgICBsZXQgYXNzaWdubWVudENsYXNzSW5kZXggPSBudWxsXHJcbiAgICBkYXRhLmNsYXNzZXMuc29tZSgoYywgcG9zKSA9PiB7XHJcbiAgICAgICAgaWYgKHRpdGxlLmluZGV4T2YoYykgIT09IC0xKSB7XHJcbiAgICAgICAgICAgIGFzc2lnbm1lbnRDbGFzc0luZGV4ID0gcG9zXHJcbiAgICAgICAgICAgIHRpdGxlID0gdGl0bGUucmVwbGFjZShjLCAnJylcclxuICAgICAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICB9KVxyXG5cclxuICAgIGlmIChhc3NpZ25tZW50Q2xhc3NJbmRleCA9PT0gbnVsbCB8fCBhc3NpZ25tZW50Q2xhc3NJbmRleCA9PT0gLTEpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBmaW5kIGNsYXNzIGluIHRpdGxlICR7dGl0bGV9IChjbGFzc2VzIGFyZSAke2RhdGEuY2xhc3Nlc31gKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGFzc2lnbm1lbnRUaXRsZSA9IHRpdGxlLnN1YnN0cmluZyh0aXRsZS5pbmRleE9mKCc6ICcpICsgMikucmVwbGFjZSgvXFwoW15cXChcXCldKlxcKSQvLCAnJykudHJpbSgpXHJcblxyXG4gICAgLy8gVG8gbWFrZSBzdXJlIHRoZXJlIGFyZSBubyByZXBlYXRzLCB0aGUgdGl0bGUgb2YgdGhlIGFzc2lnbm1lbnQgKG9ubHkgbGV0dGVycykgYW5kIGl0cyBzdGFydCAmXHJcbiAgICAvLyBlbmQgZGF0ZSBhcmUgY29tYmluZWQgdG8gZ2l2ZSBpdCBhIHVuaXF1ZSBpZGVudGlmaWVyLlxyXG4gICAgY29uc3QgYXNzaWdubWVudElkID0gYXNzaWdubWVudFRpdGxlLnJlcGxhY2UoL1teXFx3XSovZywgJycpICsgKGFzc2lnbm1lbnRTdGFydCArIGFzc2lnbm1lbnRFbmQpXHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBzdGFydDogYXNzaWdubWVudFN0YXJ0LFxyXG4gICAgICAgIGVuZDogYXNzaWdubWVudEVuZCxcclxuICAgICAgICBhdHRhY2htZW50czogYXAsXHJcbiAgICAgICAgYm9keTogYXNzaWdubWVudEJvZHksXHJcbiAgICAgICAgdHlwZTogYXNzaWdubWVudFR5cGUsXHJcbiAgICAgICAgYmFzZVR5cGU6IGFzc2lnbm1lbnRCYXNlVHlwZSxcclxuICAgICAgICBjbGFzczogYXNzaWdubWVudENsYXNzSW5kZXgsXHJcbiAgICAgICAgdGl0bGU6IGFzc2lnbm1lbnRUaXRsZSxcclxuICAgICAgICBpZDogYXNzaWdubWVudElkXHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIFRoZSBmdW5jdGlvbiBiZWxvdyB3aWxsIHBhcnNlIHRoZSBkYXRhIGdpdmVuIGJ5IFBDUiBhbmQgY29udmVydCBpdCBpbnRvIGFuIG9iamVjdC4gSWYgeW91IG9wZW4gdXBcclxuLy8gdGhlIGRldmVsb3BlciBjb25zb2xlIG9uIENoZWNrUENSIGFuZCB0eXBlIGluIGBkYXRhYCwgeW91IGNhbiBzZWUgdGhlIGFycmF5IGNvbnRhaW5pbmcgYWxsIG9mXHJcbi8vIHlvdXIgYXNzaWdubWVudHMuXHJcbmZ1bmN0aW9uIHBhcnNlKGRvYzogSFRNTERvY3VtZW50KTogdm9pZCB7XHJcbiAgICBjb25zb2xlLnRpbWUoJ0hhbmRsaW5nIGRhdGEnKSAvLyBUbyB0aW1lIGhvdyBsb25nIGl0IHRha2VzIHRvIHBhcnNlIHRoZSBhc3NpZ25tZW50c1xyXG4gICAgY29uc3QgaGFuZGxlZERhdGFTaG9ydDogc3RyaW5nW10gPSBbXSAvLyBBcnJheSB1c2VkIHRvIG1ha2Ugc3VyZSB3ZSBkb25cInQgcGFyc2UgdGhlIHNhbWUgYXNzaWdubWVudCB0d2ljZS5cclxuICAgIGNvbnN0IGRhdGE6IElBcHBsaWNhdGlvbkRhdGEgPSB7XHJcbiAgICAgICAgY2xhc3NlczogW10sXHJcbiAgICAgICAgYXNzaWdubWVudHM6IFtdLFxyXG4gICAgICAgIG1vbnRoVmlldzogKF8kKGRvYy5xdWVyeVNlbGVjdG9yKCcucnNIZWFkZXJNb250aCcpKS5wYXJlbnROb2RlIGFzIEhUTUxFbGVtZW50KS5jbGFzc0xpc3QuY29udGFpbnMoJ3JzU2VsZWN0ZWQnKVxyXG4gICAgfSAvLyBSZXNldCB0aGUgYXJyYXkgaW4gd2hpY2ggYWxsIG9mIHlvdXIgYXNzaWdubWVudHMgYXJlIHN0b3JlZCBpbi5cclxuICAgIHNldERhdGEoZGF0YSlcclxuXHJcbiAgICBkb2MucXVlcnlTZWxlY3RvckFsbCgnaW5wdXQ6bm90KFt0eXBlPVwic3VibWl0XCJdKScpLmZvckVhY2goKGUpID0+IHtcclxuICAgICAgICB2aWV3RGF0YVsoZSBhcyBIVE1MSW5wdXRFbGVtZW50KS5uYW1lXSA9IChlIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlIHx8ICcnXHJcbiAgICB9KVxyXG5cclxuICAgIC8vIE5vdywgdGhlIGNsYXNzZXMgeW91IHRha2UgYXJlIHBhcnNlZCAodGhlc2UgYXJlIHRoZSBjaGVja2JveGVzIHlvdSBzZWUgdXAgdG9wIHdoZW4gbG9va2luZyBhdCBQQ1IpLlxyXG4gICAgY29uc3QgY2xhc3NlcyA9IGZpbmRJZChkb2MsICd0YWJsZScsICdjYkNsYXNzZXMnKS5nZXRFbGVtZW50c0J5VGFnTmFtZSgnbGFiZWwnKVxyXG4gICAgY2xhc3Nlcy5mb3JFYWNoKChjKSA9PiB7XHJcbiAgICAgICAgZGF0YS5jbGFzc2VzLnB1c2goYy5pbm5lckhUTUwpXHJcbiAgICB9KVxyXG5cclxuICAgIGNvbnN0IGFzc2lnbm1lbnRzID0gZG9jLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3JzQXB0IHJzQXB0U2ltcGxlJylcclxuICAgIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwoYXNzaWdubWVudHMsIChhc3NpZ25tZW50RWw6IEhUTUxFbGVtZW50KSA9PiB7XHJcbiAgICAgICAgY29uc3QgYXNzaWdubWVudCA9IHBhcnNlQXNzaWdubWVudChhc3NpZ25tZW50RWwpXHJcbiAgICAgICAgaWYgKGhhbmRsZWREYXRhU2hvcnQuaW5kZXhPZihhc3NpZ25tZW50LmlkKSA9PT0gLTEpIHsgLy8gTWFrZSBzdXJlIHdlIGhhdmVuJ3QgYWxyZWFkeSBwYXJzZWQgdGhlIGFzc2lnbm1lbnRcclxuICAgICAgICAgICAgaGFuZGxlZERhdGFTaG9ydC5wdXNoKGFzc2lnbm1lbnQuaWQpXHJcbiAgICAgICAgICAgIGRhdGEuYXNzaWdubWVudHMucHVzaChhc3NpZ25tZW50KVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcblxyXG4gICAgY29uc29sZS50aW1lRW5kKCdIYW5kbGluZyBkYXRhJylcclxuXHJcbiAgICAvLyBOb3cgYWxsb3cgdGhlIHZpZXcgdG8gYmUgc3dpdGNoZWRcclxuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnbG9hZGVkJylcclxuXHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnZGF0YScsIEpTT04uc3RyaW5naWZ5KGdldERhdGEoKSkpIC8vIFN0b3JlIGZvciBvZmZsaW5lIHVzZVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXJsRm9yQXR0YWNobWVudChzZWFyY2g6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gQVRUQUNITUVOVFNfVVJMICsgc2VhcmNoXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRBdHRhY2htZW50TWltZVR5cGUoc2VhcmNoOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZz4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICBjb25zdCByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKVxyXG4gICAgICAgIHJlcS5vcGVuKCdIRUFEJywgdXJsRm9yQXR0YWNobWVudChzZWFyY2gpKVxyXG4gICAgICAgIHJlcS5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChyZXEuc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHR5cGUgPSByZXEuZ2V0UmVzcG9uc2VIZWFkZXIoJ0NvbnRlbnQtVHlwZScpXHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUodHlwZSlcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcignQ29udGVudCB0eXBlIGlzIG51bGwnKSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXEuc2VuZCgpXHJcbiAgICB9KVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY2xhc3NCeUlkKGlkOiBudW1iZXJ8bnVsbHx1bmRlZmluZWQpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIChpZCA/IGdldENsYXNzZXMoKVtpZF0gOiBudWxsKSB8fCAnVW5rbm93biBjbGFzcydcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHN3aXRjaFZpZXdzKCk6IHZvaWQge1xyXG4gICAgaWYgKE9iamVjdC5rZXlzKHZpZXdEYXRhKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgZWxlbUJ5SWQoJ3NpZGVCYWNrZ3JvdW5kJykuY2xpY2soKVxyXG4gICAgICAgIHZpZXdEYXRhLl9fRVZFTlRUQVJHRVQgPSAnY3RsMDAkY3RsMDAkYmFzZUNvbnRlbnQkYmFzZUNvbnRlbnQkZmxhc2hUb3AkY3RsMDAkUmFkU2NoZWR1bGVyMSdcclxuICAgICAgICB2aWV3RGF0YS5fX0VWRU5UQVJHVU1FTlQgPSBKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgICAgIENvbW1hbmQ6IGBTd2l0Y2hUbyR7ZG9jdW1lbnQuYm9keS5nZXRBdHRyaWJ1dGUoJ2RhdGEtcGNydmlldycpID09PSAnbW9udGgnID8gJ1dlZWsnIDogJ01vbnRoJ31WaWV3YFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgdmlld0RhdGEuY3RsMDBfY3RsMDBfYmFzZUNvbnRlbnRfYmFzZUNvbnRlbnRfZmxhc2hUb3BfY3RsMDBfUmFkU2NoZWR1bGVyMV9DbGllbnRTdGF0ZSA9XHJcbiAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHtzY3JvbGxUb3A6IDAsIHNjcm9sbExlZnQ6IDAsIGlzRGlydHk6IGZhbHNlfSlcclxuICAgICAgICB2aWV3RGF0YS5jdGwwMF9jdGwwMF9SYWRTY3JpcHRNYW5hZ2VyMV9UU00gPSAnOztTeXN0ZW0uV2ViLkV4dGVuc2lvbnMsIFZlcnNpb249NC4wLjAuMCwgQ3VsdHVyZT1uZXV0cmFsLCAnICtcclxuICAgICAgICAgICAgJ1B1YmxpY0tleVRva2VuPTMxYmYzODU2YWQzNjRlMzU6ZW4tVVM6ZDI4NTY4ZDMtZTUzZS00NzA2LTkyOGYtMzc2NTkxMmI2NmNhOmVhNTk3ZDRiOmIyNTM3OGQyJ1xyXG4gICAgICAgIGNvbnN0IHBvc3RBcnJheTogc3RyaW5nW10gPSBbXSAvLyBBcnJheSBvZiBkYXRhIHRvIHBvc3RcclxuICAgICAgICBPYmplY3QuZW50cmllcyh2aWV3RGF0YSkuZm9yRWFjaCgoW2gsIHZdKSA9PiB7XHJcbiAgICAgICAgICAgIHBvc3RBcnJheS5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChoKSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudCh2KSlcclxuICAgICAgICB9KVxyXG4gICAgICAgIGZldGNoKHRydWUsIHBvc3RBcnJheS5qb2luKCcmJykpXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBsb2dvdXQoKTogdm9pZCB7XHJcbiAgICBpZiAoT2JqZWN0LmtleXModmlld0RhdGEpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBkZWxldGVDb29raWUoJ3VzZXJQYXNzJylcclxuICAgICAgICBlbGVtQnlJZCgnc2lkZUJhY2tncm91bmQnKS5jbGljaygpXHJcbiAgICAgICAgdmlld0RhdGEuX19FVkVOVFRBUkdFVCA9ICdjdGwwMCRjdGwwMCRiYXNlQ29udGVudCRMb2dvdXRDb250cm9sMSRMb2dpblN0YXR1czEkY3RsMDAnXHJcbiAgICAgICAgdmlld0RhdGEuX19FVkVOVEFSR1VNRU5UID0gJydcclxuICAgICAgICB2aWV3RGF0YS5jdGwwMF9jdGwwMF9iYXNlQ29udGVudF9iYXNlQ29udGVudF9mbGFzaFRvcF9jdGwwMF9SYWRTY2hlZHVsZXIxX0NsaWVudFN0YXRlID1cclxuICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoe3Njcm9sbFRvcDogMCwgc2Nyb2xsTGVmdDogMCwgaXNEaXJ0eTogZmFsc2V9KVxyXG4gICAgICAgIGNvbnN0IHBvc3RBcnJheTogc3RyaW5nW10gPSBbXSAvLyBBcnJheSBvZiBkYXRhIHRvIHBvc3RcclxuICAgICAgICBPYmplY3QuZW50cmllcyh2aWV3RGF0YSkuZm9yRWFjaCgoW2gsIHZdKSA9PiB7XHJcbiAgICAgICAgICAgIHBvc3RBcnJheS5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChoKSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudCh2KSlcclxuICAgICAgICB9KVxyXG4gICAgICAgIGZldGNoKHRydWUsIHBvc3RBcnJheS5qb2luKCcmJykpXHJcbiAgICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBhZGRBY3Rpdml0eUVsZW1lbnQsIGNyZWF0ZUFjdGl2aXR5IH0gZnJvbSAnLi4vY29tcG9uZW50cy9hY3Rpdml0eSdcclxuaW1wb3J0IHsgSUFzc2lnbm1lbnQgfSBmcm9tICcuLi9wY3InXHJcbmltcG9ydCB7IGxvY2FsU3RvcmFnZVJlYWQsIGxvY2FsU3RvcmFnZVdyaXRlIH0gZnJvbSAnLi4vdXRpbCdcclxuXHJcbmV4cG9ydCB0eXBlIEFjdGl2aXR5VHlwZSA9ICdkZWxldGUnIHwgJ2VkaXQnIHwgJ2FkZCdcclxuZXhwb3J0IHR5cGUgQWN0aXZpdHlJdGVtID0gW0FjdGl2aXR5VHlwZSwgSUFzc2lnbm1lbnQsIG51bWJlciwgc3RyaW5nIHwgdW5kZWZpbmVkXVxyXG5cclxuY29uc3QgQUNUSVZJVFlfU1RPUkFHRV9OQU1FID0gJ2FjdGl2aXR5J1xyXG5cclxubGV0IGFjdGl2aXR5OiBBY3Rpdml0eUl0ZW1bXSA9IGxvY2FsU3RvcmFnZVJlYWQoQUNUSVZJVFlfU1RPUkFHRV9OQU1FKSB8fCBbXVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFkZEFjdGl2aXR5KHR5cGU6IEFjdGl2aXR5VHlwZSwgYXNzaWdubWVudDogSUFzc2lnbm1lbnQsIGRhdGU6IERhdGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdBY3Rpdml0eTogYm9vbGVhbiwgY2xhc3NOYW1lPzogc3RyaW5nICk6IHZvaWQge1xyXG4gICAgaWYgKG5ld0FjdGl2aXR5KSBhY3Rpdml0eS5wdXNoKFt0eXBlLCBhc3NpZ25tZW50LCBEYXRlLm5vdygpLCBjbGFzc05hbWVdKVxyXG4gICAgY29uc3QgZWwgPSBjcmVhdGVBY3Rpdml0eSh0eXBlLCBhc3NpZ25tZW50LCBkYXRlLCBjbGFzc05hbWUpXHJcbiAgICBhZGRBY3Rpdml0eUVsZW1lbnQoZWwpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlQWN0aXZpdHkoKTogdm9pZCB7XHJcbiAgICBhY3Rpdml0eSA9IGFjdGl2aXR5LnNsaWNlKGFjdGl2aXR5Lmxlbmd0aCAtIDEyOCwgYWN0aXZpdHkubGVuZ3RoKVxyXG4gICAgbG9jYWxTdG9yYWdlV3JpdGUoQUNUSVZJVFlfU1RPUkFHRV9OQU1FLCBhY3Rpdml0eSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlY2VudEFjdGl2aXR5KCk6IEFjdGl2aXR5SXRlbVtdIHtcclxuICAgIHJldHVybiBhY3Rpdml0eS5zbGljZShhY3Rpdml0eS5sZW5ndGggLSAzMiwgYWN0aXZpdHkubGVuZ3RoKVxyXG59XHJcbiIsImltcG9ydCB7IGVsZW1CeUlkLCBsb2NhbFN0b3JhZ2VSZWFkLCBsb2NhbFN0b3JhZ2VXcml0ZSB9IGZyb20gJy4uL3V0aWwnXHJcblxyXG5jb25zdCBBVEhFTkFfU1RPUkFHRV9OQU1FID0gJ2F0aGVuYURhdGEnXHJcblxyXG5pbnRlcmZhY2UgSVJhd0F0aGVuYURhdGEge1xyXG4gICAgcmVzcG9uc2VfY29kZTogMjAwXHJcbiAgICBib2R5OiB7XHJcbiAgICAgICAgY291cnNlczoge1xyXG4gICAgICAgICAgICBjb3Vyc2VzOiBJUmF3Q291cnNlW11cclxuICAgICAgICAgICAgc2VjdGlvbnM6IElSYXdTZWN0aW9uW11cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwZXJtaXNzaW9uczogYW55XHJcbn1cclxuXHJcbmludGVyZmFjZSBJUmF3Q291cnNlIHtcclxuICAgIG5pZDogbnVtYmVyXHJcbiAgICBjb3Vyc2VfdGl0bGU6IHN0cmluZ1xyXG4gICAgLy8gVGhlcmUncyBhIGJ1bmNoIG1vcmUgdGhhdCBJJ3ZlIG9taXR0ZWRcclxufVxyXG5cclxuaW50ZXJmYWNlIElSYXdTZWN0aW9uIHtcclxuICAgIGNvdXJzZV9uaWQ6IG51bWJlclxyXG4gICAgbGluazogc3RyaW5nXHJcbiAgICBsb2dvOiBzdHJpbmdcclxuICAgIHNlY3Rpb25fdGl0bGU6IHN0cmluZ1xyXG4gICAgLy8gVGhlcmUncyBhIGJ1bmNoIG1vcmUgdGhhdCBJJ3ZlIG9taXR0ZWRcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJQXRoZW5hRGF0YUl0ZW0ge1xyXG4gICAgbGluazogc3RyaW5nXHJcbiAgICBsb2dvOiBzdHJpbmdcclxuICAgIHBlcmlvZDogc3RyaW5nXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUF0aGVuYURhdGEge1xyXG4gICAgW2Nsczogc3RyaW5nXTogSUF0aGVuYURhdGFJdGVtXHJcbn1cclxuXHJcbmxldCBhdGhlbmFEYXRhOiBJQXRoZW5hRGF0YXxudWxsID0gbG9jYWxTdG9yYWdlUmVhZChBVEhFTkFfU1RPUkFHRV9OQU1FKVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldEF0aGVuYURhdGEoKTogSUF0aGVuYURhdGF8bnVsbCB7XHJcbiAgICByZXR1cm4gYXRoZW5hRGF0YVxyXG59XHJcblxyXG5mdW5jdGlvbiBmb3JtYXRMb2dvKGxvZ286IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gbG9nby5zdWJzdHIoMCwgbG9nby5pbmRleE9mKCdcIiBhbHQ9XCInKSlcclxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKCc8ZGl2IGNsYXNzPVwicHJvZmlsZS1waWN0dXJlXCI+PGltZyBzcmM9XCInLCAnJylcclxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKCd0aW55JywgJ3JlZycpXHJcbn1cclxuXHJcbi8vIE5vdywgdGhlcmUncyB0aGUgc2Nob29sb2d5L2F0aGVuYSBpbnRlZ3JhdGlvbiBzdHVmZi4gRmlyc3QsIHdlIG5lZWQgdG8gY2hlY2sgaWYgaXQncyBiZWVuIG1vcmVcclxuLy8gdGhhbiBhIGRheS4gVGhlcmUncyBubyBwb2ludCBjb25zdGFudGx5IHJldHJpZXZpbmcgY2xhc3NlcyBmcm9tIEF0aGVuYTsgdGhleSBkb250J3QgY2hhbmdlIHRoYXRcclxuLy8gbXVjaC5cclxuXHJcbi8vIFRoZW4sIG9uY2UgdGhlIHZhcmlhYmxlIGZvciB0aGUgbGFzdCBkYXRlIGlzIGluaXRpYWxpemVkLCBpdCdzIHRpbWUgdG8gZ2V0IHRoZSBjbGFzc2VzIGZyb21cclxuLy8gYXRoZW5hLiBMdWNraWx5LCB0aGVyZSdzIHRoaXMgZmlsZSBhdCAvaWFwaS9jb3Vyc2UvYWN0aXZlIC0gYW5kIGl0J3MgaW4gSlNPTiEgTGlmZSBjYW4ndCBiZSBhbnlcclxuLy8gYmV0dGVyISBTZXJpb3VzbHkhIEl0J3MganVzdCB0b28gYmFkIHRoZSBsb2dpbiBwYWdlIGlzbid0IGluIEpTT04uXHJcbmZ1bmN0aW9uIHBhcnNlQXRoZW5hRGF0YShkYXQ6IHN0cmluZyk6IElBdGhlbmFEYXRhfG51bGwge1xyXG4gICAgaWYgKGRhdCA9PT0gJycpIHJldHVybiBudWxsXHJcbiAgICBjb25zdCBkID0gSlNPTi5wYXJzZShkYXQpIGFzIElSYXdBdGhlbmFEYXRhXHJcbiAgICBjb25zdCBhdGhlbmFEYXRhMjogSUF0aGVuYURhdGEgPSB7fVxyXG4gICAgY29uc3QgYWxsQ291cnNlRGV0YWlsczogeyBbbmlkOiBudW1iZXJdOiBJUmF3U2VjdGlvbiB9ID0ge31cclxuICAgIGQuYm9keS5jb3Vyc2VzLnNlY3Rpb25zLmZvckVhY2goKHNlY3Rpb24pID0+IHtcclxuICAgICAgICBhbGxDb3Vyc2VEZXRhaWxzW3NlY3Rpb24uY291cnNlX25pZF0gPSBzZWN0aW9uXHJcbiAgICB9KVxyXG4gICAgZC5ib2R5LmNvdXJzZXMuY291cnNlcy5yZXZlcnNlKCkuZm9yRWFjaCgoY291cnNlKSA9PiB7XHJcbiAgICAgICAgY29uc3QgY291cnNlRGV0YWlscyA9IGFsbENvdXJzZURldGFpbHNbY291cnNlLm5pZF1cclxuICAgICAgICBhdGhlbmFEYXRhMltjb3Vyc2UuY291cnNlX3RpdGxlXSA9IHtcclxuICAgICAgICAgICAgbGluazogYGh0dHBzOi8vYXRoZW5hLmhhcmtlci5vcmcke2NvdXJzZURldGFpbHMubGlua31gLFxyXG4gICAgICAgICAgICBsb2dvOiBmb3JtYXRMb2dvKGNvdXJzZURldGFpbHMubG9nbyksXHJcbiAgICAgICAgICAgIHBlcmlvZDogY291cnNlRGV0YWlscy5zZWN0aW9uX3RpdGxlXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICAgIHJldHVybiBhdGhlbmFEYXRhMlxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlQXRoZW5hRGF0YShkYXRhOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgIGNvbnN0IHJlZnJlc2hFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhdGhlbmFEYXRhUmVmcmVzaCcpXHJcbiAgICB0cnkge1xyXG4gICAgICAgIGF0aGVuYURhdGEgPSBwYXJzZUF0aGVuYURhdGEoZGF0YSlcclxuICAgICAgICBsb2NhbFN0b3JhZ2VXcml0ZShBVEhFTkFfU1RPUkFHRV9OQU1FLCBkYXRhKVxyXG4gICAgICAgIGVsZW1CeUlkKCdhdGhlbmFEYXRhRXJyb3InKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXHJcbiAgICAgICAgaWYgKHJlZnJlc2hFbCkgcmVmcmVzaEVsLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgZWxlbUJ5SWQoJ2F0aGVuYURhdGFFcnJvcicpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXHJcbiAgICAgICAgaWYgKHJlZnJlc2hFbCkgcmVmcmVzaEVsLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcclxuICAgICAgICBlbGVtQnlJZCgnYXRoZW5hRGF0YUVycm9yJykuaW5uZXJIVE1MID0gZS5tZXNzYWdlXHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgZ2V0RGF0YSwgSUFwcGxpY2F0aW9uRGF0YSwgSUFzc2lnbm1lbnQgfSBmcm9tICcuLi9wY3InXHJcbmltcG9ydCB7IGxvY2FsU3RvcmFnZVJlYWQsIGxvY2FsU3RvcmFnZVdyaXRlIH0gZnJvbSAnLi4vdXRpbCdcclxuXHJcbmNvbnN0IENVU1RPTV9TVE9SQUdFX05BTUUgPSAnZXh0cmEnXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElDdXN0b21Bc3NpZ25tZW50IHtcclxuICAgIGJvZHk6IHN0cmluZ1xyXG4gICAgZG9uZTogYm9vbGVhblxyXG4gICAgc3RhcnQ6IG51bWJlclxyXG4gICAgY2xhc3M6IHN0cmluZ3xudWxsXHJcbiAgICBlbmQ6IG51bWJlcnwnRm9yZXZlcidcclxufVxyXG5cclxuY29uc3QgZXh0cmE6IElDdXN0b21Bc3NpZ25tZW50W10gPSBsb2NhbFN0b3JhZ2VSZWFkKENVU1RPTV9TVE9SQUdFX05BTUUsIFtdKVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldEV4dHJhKCk6IElDdXN0b21Bc3NpZ25tZW50W10ge1xyXG4gICAgcmV0dXJuIGV4dHJhXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlRXh0cmEoKTogdm9pZCB7XHJcbiAgICBsb2NhbFN0b3JhZ2VXcml0ZShDVVNUT01fU1RPUkFHRV9OQU1FLCBleHRyYSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFkZFRvRXh0cmEoY3VzdG9tOiBJQ3VzdG9tQXNzaWdubWVudCk6IHZvaWQge1xyXG4gICAgZXh0cmEucHVzaChjdXN0b20pXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVGcm9tRXh0cmEoY3VzdG9tOiBJQ3VzdG9tQXNzaWdubWVudCk6IHZvaWQge1xyXG4gICAgaWYgKCFleHRyYS5pbmNsdWRlcyhjdXN0b20pKSB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCByZW1vdmUgY3VzdG9tIGFzc2lnbm1lbnQgdGhhdCBkb2VzIG5vdCBleGlzdCcpXHJcbiAgICBleHRyYS5zcGxpY2UoZXh0cmEuaW5kZXhPZihjdXN0b20pLCAxKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZXh0cmFUb1Rhc2soY3VzdG9tOiBJQ3VzdG9tQXNzaWdubWVudCwgZGF0YTogSUFwcGxpY2F0aW9uRGF0YSk6IElBc3NpZ25tZW50IHtcclxuICAgIGxldCBjbHM6IG51bWJlcnxudWxsID0gbnVsbFxyXG4gICAgY29uc3QgY2xhc3NOYW1lID0gY3VzdG9tLmNsYXNzXHJcbiAgICBpZiAoY2xhc3NOYW1lICE9IG51bGwpIHtcclxuICAgICAgICBjbHMgPSBkYXRhLmNsYXNzZXMuZmluZEluZGV4KChjKSA9PiBjLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoY2xhc3NOYW1lKSlcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHRpdGxlOiAnVGFzaycsXHJcbiAgICAgICAgYmFzZVR5cGU6ICd0YXNrJyxcclxuICAgICAgICB0eXBlOiAndGFzaycsXHJcbiAgICAgICAgYXR0YWNobWVudHM6IFtdLFxyXG4gICAgICAgIHN0YXJ0OiBjdXN0b20uc3RhcnQsXHJcbiAgICAgICAgZW5kOiBjdXN0b20uZW5kIHx8ICdGb3JldmVyJyxcclxuICAgICAgICBib2R5OiBjdXN0b20uYm9keSxcclxuICAgICAgICBpZDogYHRhc2ske2N1c3RvbS5ib2R5LnJlcGxhY2UoL1teXFx3XSovZywgJycpfSR7Y3VzdG9tLnN0YXJ0fSR7Y3VzdG9tLmVuZH0ke2N1c3RvbS5jbGFzc31gLFxyXG4gICAgICAgIGNsYXNzOiBjbHMgPT09IC0xID8gbnVsbCA6IGNsc1xyXG4gICAgfVxyXG59XHJcblxyXG5pbnRlcmZhY2UgSVBhcnNlUmVzdWx0IHtcclxuICAgIGNscz86IHN0cmluZ1xyXG4gICAgZHVlPzogc3RyaW5nXHJcbiAgICBzdD86IHN0cmluZ1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VDdXN0b21UYXNrKHRleHQ6IHN0cmluZywgcmVzdWx0OiBJUGFyc2VSZXN1bHQgPSB7fSk6IElQYXJzZVJlc3VsdCB7XHJcbiAgICBjb25zdCBwYXJzZWQgPSB0ZXh0Lm1hdGNoKC8oLiopIChmb3J8Ynl8ZHVlfGFzc2lnbmVkfHN0YXJ0aW5nfGVuZGluZ3xiZWdpbm5pbmcpICguKikvKVxyXG4gICAgaWYgKHBhcnNlZCA9PSBudWxsKSByZXR1cm4gcmVzdWx0XHJcblxyXG4gICAgc3dpdGNoIChwYXJzZWRbMl0pIHtcclxuICAgICAgICBjYXNlICdmb3InOiByZXN1bHQuY2xzID0gcGFyc2VkWzNdOyBicmVha1xyXG4gICAgICAgIGNhc2UgJ2J5JzogY2FzZSAnZHVlJzogY2FzZSAnZW5kaW5nJzogcmVzdWx0LmR1ZSA9IHBhcnNlZFszXTsgYnJlYWtcclxuICAgICAgICBjYXNlICdhc3NpZ25lZCc6IGNhc2UgJ3N0YXJ0aW5nJzogY2FzZSAnYmVnaW5uaW5nJzogcmVzdWx0LnN0ID0gcGFyc2VkWzNdOyBicmVha1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBwYXJzZUN1c3RvbVRhc2socGFyc2VkWzFdLCByZXN1bHQpXHJcbn1cclxuIiwiaW1wb3J0IHsgbG9jYWxTdG9yYWdlUmVhZCwgbG9jYWxTdG9yYWdlV3JpdGUgfSBmcm9tICcuLi91dGlsJ1xyXG5cclxuY29uc3QgRE9ORV9TVE9SQUdFX05BTUUgPSAnZG9uZSdcclxuXHJcbmNvbnN0IGRvbmU6IHN0cmluZ1tdID0gbG9jYWxTdG9yYWdlUmVhZChET05FX1NUT1JBR0VfTkFNRSwgW10pXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlRnJvbURvbmUoaWQ6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgY29uc3QgaW5kZXggPSBkb25lLmluZGV4T2YoaWQpXHJcbiAgICBpZiAoaW5kZXggPj0gMCkgZG9uZS5zcGxpY2UoaW5kZXgsIDEpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBhZGRUb0RvbmUoaWQ6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgZG9uZS5wdXNoKGlkKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2F2ZURvbmUoKTogdm9pZCB7XHJcbiAgICBsb2NhbFN0b3JhZ2VXcml0ZShET05FX1NUT1JBR0VfTkFNRSwgZG9uZSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFzc2lnbm1lbnRJbkRvbmUoaWQ6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIGRvbmUuaW5jbHVkZXMoaWQpXHJcbn1cclxuIiwiaW1wb3J0IHsgbG9jYWxTdG9yYWdlUmVhZCwgbG9jYWxTdG9yYWdlV3JpdGUgfSBmcm9tICcuLi91dGlsJ1xyXG5cclxuY29uc3QgTU9ESUZJRURfU1RPUkFHRV9OQU1FID0gJ21vZGlmaWVkJ1xyXG5cclxuaW50ZXJmYWNlIElNb2RpZmllZEJvZGllcyB7XHJcbiAgICBbaWQ6IHN0cmluZ106IHN0cmluZ1xyXG59XHJcblxyXG5jb25zdCBtb2RpZmllZDogSU1vZGlmaWVkQm9kaWVzID0gbG9jYWxTdG9yYWdlUmVhZChNT0RJRklFRF9TVE9SQUdFX05BTUUsIHt9KVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUZyb21Nb2RpZmllZChpZDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICBkZWxldGUgbW9kaWZpZWRbaWRdXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlTW9kaWZpZWQoKTogdm9pZCB7XHJcbiAgICBsb2NhbFN0b3JhZ2VXcml0ZShNT0RJRklFRF9TVE9SQUdFX05BTUUsIG1vZGlmaWVkKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYXNzaWdubWVudEluTW9kaWZpZWQoaWQ6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIG1vZGlmaWVkLmhhc093blByb3BlcnR5KGlkKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbW9kaWZpZWRCb2R5KGlkOiBzdHJpbmcpOiBzdHJpbmd8dW5kZWZpbmVkIHtcclxuICAgIHJldHVybiBtb2RpZmllZFtpZF1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNldE1vZGlmaWVkKGlkOiBzdHJpbmcsIGJvZHk6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgbW9kaWZpZWRbaWRdID0gYm9keVxyXG59XHJcbiIsImltcG9ydCB7IGxvY2FsU3RvcmFnZVJlYWQsIGxvY2FsU3RvcmFnZVdyaXRlIH0gZnJvbSAnLi91dGlsJ1xyXG5cclxudHlwZSBBc3NpZ25tZW50U3BhbiA9ICdtdWx0aXBsZScgfCAnc3RhcnQnIHwgJ2VuZCdcclxudHlwZSBIaWRlQXNzaWdubWVudHMgPSAnZGF5JyB8ICdtcycgfCAndXMnXHJcbnR5cGUgQ29sb3JUeXBlID0gJ2Fzc2lnbm1lbnQnIHwgJ2NsYXNzJ1xyXG5pbnRlcmZhY2UgSVNob3duQWN0aXZpdHkge1xyXG4gICAgYWRkOiBib29sZWFuXHJcbiAgICBlZGl0OiBib29sZWFuXHJcbiAgICBkZWxldGU6IGJvb2xlYW5cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHNldHRpbmdzID0ge1xyXG4gICAgLyoqXHJcbiAgICAgKiBNaW51dGVzIGJldHdlZW4gZWFjaCBhdXRvbWF0aWMgcmVmcmVzaCBvZiB0aGUgcGFnZS4gTmVnYXRpdmUgbnVtYmVycyBpbmRpY2F0ZSBubyBhdXRvbWF0aWNcclxuICAgICAqIHJlZnJlc2hpbmcuXHJcbiAgICAgKi9cclxuICAgIGdldCByZWZyZXNoUmF0ZSgpOiBudW1iZXIgeyByZXR1cm4gbG9jYWxTdG9yYWdlUmVhZCgncmVmcmVzaFJhdGUnLCAtMSkgfSxcclxuICAgIHNldCByZWZyZXNoUmF0ZSh2OiBudW1iZXIpIHsgbG9jYWxTdG9yYWdlV3JpdGUoJ3JlZnJlc2hSYXRlJywgdikgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIFdoZXRoZXIgdGhlIHdpbmRvdyBzaG91bGQgcmVmcmVzaCBhc3NpZ25tZW50IGRhdGEgd2hlbiBmb2N1c3NlZFxyXG4gICAgICovXHJcbiAgICBnZXQgcmVmcmVzaE9uRm9jdXMoKTogYm9vbGVhbiB7IHJldHVybiBsb2NhbFN0b3JhZ2VSZWFkKCdyZWZyZXNoT25Gb2N1cycsIHRydWUpIH0sXHJcbiAgICBzZXQgcmVmcmVzaE9uRm9jdXModjogYm9vbGVhbikgeyBsb2NhbFN0b3JhZ2VXcml0ZSgncmVmcmVzaE9uRm9jdXMnLCB2KSB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogV2hldGhlciBzd2l0Y2hpbmcgYmV0d2VlbiB2aWV3cyBzaG91bGQgYmUgYW5pbWF0ZWRcclxuICAgICAqL1xyXG4gICAgZ2V0IHZpZXdUcmFucygpOiBib29sZWFuIHsgcmV0dXJuIGxvY2FsU3RvcmFnZVJlYWQoJ3ZpZXdUcmFucycsIHRydWUpIH0sXHJcbiAgICBzZXQgdmlld1RyYW5zKHY6IGJvb2xlYW4pIHsgbG9jYWxTdG9yYWdlV3JpdGUoJ3ZpZXdUcmFucycsIHYpIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBOdW1iZXIgb2YgZGF5cyBlYXJseSB0byBzaG93IHRlc3RzIGluIGxpc3Qgdmlld1xyXG4gICAgICovXHJcbiAgICBnZXQgZWFybHlUZXN0KCk6IG51bWJlciB7IHJldHVybiBsb2NhbFN0b3JhZ2VSZWFkKCdlYXJseVRlc3QnLCAxKSB9LFxyXG4gICAgc2V0IGVhcmx5VGVzdCh2OiBudW1iZXIpIHsgbG9jYWxTdG9yYWdlV3JpdGUoJ2Vhcmx5VGVzdCcsIHYpIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBXaGV0aGVyIHRvIHRha2UgdGFza3Mgb2ZmIHRoZSBjYWxlbmRhciB2aWV3IGFuZCBzaG93IHRoZW0gaW4gdGhlIGluZm8gcGFuZVxyXG4gICAgICovXHJcbiAgICBnZXQgc2VwVGFza3MoKTogYm9vbGVhbiB7IHJldHVybiBsb2NhbFN0b3JhZ2VSZWFkKCdzZXBUYXNrcycsIGZhbHNlKSB9LFxyXG4gICAgc2V0IHNlcFRhc2tzKHY6IGJvb2xlYW4pIHsgbG9jYWxTdG9yYWdlV3JpdGUoJ3NlcFRhc2tzJywgdikgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIFdoZXRoZXIgdGFza3Mgc2hvdWxkIGhhdmUgdGhlaXIgb3duIGNvbG9yXHJcbiAgICAgKi9cclxuICAgIGdldCBzZXBUYXNrQ2xhc3MoKTogYm9vbGVhbiB7IHJldHVybiBsb2NhbFN0b3JhZ2VSZWFkKCdzZXBUYXNrQ2xhc3MnLCBmYWxzZSkgfSxcclxuICAgIHNldCBzZXBUYXNrQ2xhc3ModjogYm9vbGVhbikgeyBsb2NhbFN0b3JhZ2VXcml0ZSgnc2VwVGFza0NsYXNzJywgdikgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIFdoZXRoZXIgcHJvamVjdHMgc2hvdyB1cCBpbiB0aGUgdGVzdCBwYWdlXHJcbiAgICAgKi9cclxuICAgIGdldCBwcm9qZWN0c0luVGVzdFBhbmUoKTogYm9vbGVhbiB7IHJldHVybiBsb2NhbFN0b3JhZ2VSZWFkKCdwcm9qZWN0c0luVGVzdFBhbmUnLCBmYWxzZSkgfSxcclxuICAgIHNldCBwcm9qZWN0c0luVGVzdFBhbmUodjogYm9vbGVhbikgeyBsb2NhbFN0b3JhZ2VXcml0ZSgncHJvamVjdHNJblRlc3RQYW5lJywgdikgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIFdoZW4gYXNzaWdubWVudHMgc2hvdWxkIGJlIHNob3duIG9uIGNhbGVuZGFyIHZpZXdcclxuICAgICAqL1xyXG4gICAgZ2V0IGFzc2lnbm1lbnRTcGFuKCk6IEFzc2lnbm1lbnRTcGFuIHsgcmV0dXJuIGxvY2FsU3RvcmFnZVJlYWQoJ2Fzc2lnbm1lbnRTcGFuJywgJ211bHRpcGxlJykgfSxcclxuICAgIHNldCBhc3NpZ25tZW50U3Bhbih2OiBBc3NpZ25tZW50U3BhbikgeyBsb2NhbFN0b3JhZ2VXcml0ZSgnYXNzaWdubWVudFNwYW4nLCB2KSB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogV2hlbiBhc3NpZ25tZW50cyBzaG91bGQgZGlzYXBwZWFyIGZyb20gbGlzdCB2aWV3XHJcbiAgICAgKi9cclxuICAgIGdldCBoaWRlQXNzaWdubWVudHMoKTogSGlkZUFzc2lnbm1lbnRzIHsgcmV0dXJuIGxvY2FsU3RvcmFnZVJlYWQoJ2hpZGVBc3NpZ25tZW50cycsICdkYXknKSB9LFxyXG4gICAgc2V0IGhpZGVBc3NpZ25tZW50cyh2OiBIaWRlQXNzaWdubWVudHMpIHsgbG9jYWxTdG9yYWdlV3JpdGUoJ2hpZGVBc3NpZ25tZW50cycsIHYpIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBXaGV0aGVyIHRvIHVzZSBob2xpZGF5IHRoZW1pbmdcclxuICAgICAqL1xyXG4gICAgZ2V0IGhvbGlkYXlUaGVtZXMoKTogYm9vbGVhbiB7IHJldHVybiBsb2NhbFN0b3JhZ2VSZWFkKCdob2xpZGF5VGhlbWVzJywgZmFsc2UpIH0sXHJcbiAgICBzZXQgaG9saWRheVRoZW1lcyh2OiBib29sZWFuKSB7IGxvY2FsU3RvcmFnZVdyaXRlKCdob2xpZGF5VGhlbWVzJywgdikgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIFdoZXRoZXIgdG8gY29sb3IgYXNzaWdubWVudHMgYmFzZWQgb24gdGhlaXIgdHlwZSBvciBjbGFzc1xyXG4gICAgICovXHJcbiAgICBnZXQgY29sb3JUeXBlKCk6IENvbG9yVHlwZSB7IHJldHVybiBsb2NhbFN0b3JhZ2VSZWFkKCdjb2xvclR5cGUnLCAnYXNzaWdubWVudCcpIH0sXHJcbiAgICBzZXQgY29sb3JUeXBlKHY6IENvbG9yVHlwZSkgeyBsb2NhbFN0b3JhZ2VXcml0ZSgnY29sb3JUeXBlJywgdikgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIFdoaWNoIHR5cGVzIG9mIGFjdGl2aXR5IGFyZSBzaG93biBpbiB0aGUgYWN0aXZpdHkgcGFuZVxyXG4gICAgICovXHJcbiAgICBnZXQgc2hvd25BY3Rpdml0eSgpOiBJU2hvd25BY3Rpdml0eSB7IHJldHVybiBsb2NhbFN0b3JhZ2VSZWFkKCdzaG93bkFjdGl2aXR5Jywge1xyXG4gICAgICAgIGFkZDogdHJ1ZSxcclxuICAgICAgICBlZGl0OiB0cnVlLFxyXG4gICAgICAgIGRlbGV0ZTogdHJ1ZVxyXG4gICAgfSkgfSxcclxuICAgIHNldCBzaG93bkFjdGl2aXR5KHY6IElTaG93bkFjdGl2aXR5KSB7IGxvY2FsU3RvcmFnZVdyaXRlKCdzaG93bkFjdGl2aXR5JywgdikgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIFdoZXRoZXIgdG8gZGlzcGxheSB0YXNrcyBpbiB0aGUgdGFzayBwYW5lIHRoYXQgYXJlIGNvbXBsZXRlZFxyXG4gICAgICovXHJcbiAgICBnZXQgc2hvd0RvbmVUYXNrcygpOiBib29sZWFuIHsgcmV0dXJuIGxvY2FsU3RvcmFnZVJlYWQoJ3Nob3dEb25lVGFza3MnLCBmYWxzZSkgfSxcclxuICAgIHNldCBzaG93RG9uZVRhc2tzKHY6IGJvb2xlYW4pIHsgbG9jYWxTdG9yYWdlV3JpdGUoJ3Nob3dEb25lVGFza3MnLCB2KSB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRTZXR0aW5nKG5hbWU6IHN0cmluZyk6IGFueSB7XHJcbiAgICBpZiAoIXNldHRpbmdzLmhhc093blByb3BlcnR5KG5hbWUpKSB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgc2V0dGluZyBuYW1lICR7bmFtZX1gKVxyXG4gICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgcmV0dXJuIHNldHRpbmdzW25hbWVdXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRTZXR0aW5nKG5hbWU6IHN0cmluZywgdmFsdWU6IGFueSk6IHZvaWQge1xyXG4gICAgaWYgKCFzZXR0aW5ncy5oYXNPd25Qcm9wZXJ0eShuYW1lKSkgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHNldHRpbmcgbmFtZSAke25hbWV9YClcclxuICAgIC8vIEB0cy1pZ25vcmVcclxuICAgIHNldHRpbmdzW25hbWVdID0gdmFsdWVcclxufVxyXG4iLCJpbXBvcnQgeyBmcm9tRGF0ZU51bSwgdG9EYXRlTnVtIH0gZnJvbSAnLi9kYXRlcydcclxuXHJcbi8vIEB0cy1pZ25vcmUgVE9ETzogTWFrZSB0aGlzIGxlc3MgaGFja3lcclxuTm9kZUxpc3QucHJvdG90eXBlLmZvckVhY2ggPSBIVE1MQ29sbGVjdGlvbi5wcm90b3R5cGUuZm9yRWFjaCA9IEFycmF5LnByb3RvdHlwZS5mb3JFYWNoXHJcblxyXG4vKipcclxuICogRm9yY2VzIGEgbGF5b3V0IG9uIGFuIGVsZW1lbnRcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBmb3JjZUxheW91dChlbDogSFRNTEVsZW1lbnQpOiB2b2lkIHtcclxuICAgIC8vIFRoaXMgaW52b2x2ZXMgYSBsaXR0bGUgdHJpY2tlcnkgaW4gdGhhdCBieSByZXF1ZXN0aW5nIHRoZSBjb21wdXRlZCBoZWlnaHQgb2YgdGhlIGVsZW1lbnQgdGhlXHJcbiAgICAvLyBicm93c2VyIGlzIGZvcmNlZCB0byBkbyBhIGZ1bGwgbGF5b3V0XHJcblxyXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC1leHByZXNzaW9uXHJcbiAgICBlbC5vZmZzZXRIZWlnaHRcclxufVxyXG5cclxuLyoqXHJcbiAqIFJldHVybiBhIHN0cmluZyB3aXRoIHRoZSBmaXJzdCBsZXR0ZXIgY2FwaXRhbGl6ZWRcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBjYXBpdGFsaXplU3RyaW5nKHN0cjogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIHJldHVybiBzdHIuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHIuc3Vic3RyKDEpXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZXR1cm5zIGFuIFhNTEh0dHBSZXF1ZXN0IHdpdGggdGhlIHNwZWNpZmllZCB1cmwsIHJlc3BvbnNlIHR5cGUsIGhlYWRlcnMsIGFuZCBkYXRhXHJcbiAqL1xyXG5mdW5jdGlvbiBjb25zdHJ1Y3RYTUxIdHRwUmVxdWVzdCh1cmw6IHN0cmluZywgcmVzcFR5cGU/OiBYTUxIdHRwUmVxdWVzdFJlc3BvbnNlVHlwZXxudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXJzPzoge1tuYW1lOiBzdHJpbmddOiBzdHJpbmd9fG51bGwsIGRhdGE/OiBzdHJpbmd8bnVsbCk6IFhNTEh0dHBSZXF1ZXN0IHtcclxuICAgIGNvbnN0IHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXHJcblxyXG4gICAgLy8gSWYgUE9TVCBkYXRhIGlzIHByb3ZpZGVkIHNlbmQgYSBQT1NUIHJlcXVlc3QsIG90aGVyd2lzZSBzZW5kIGEgR0VUIHJlcXVlc3RcclxuICAgIHJlcS5vcGVuKChkYXRhID8gJ1BPU1QnIDogJ0dFVCcpLCB1cmwsIHRydWUpXHJcblxyXG4gICAgaWYgKHJlc3BUeXBlKSByZXEucmVzcG9uc2VUeXBlID0gcmVzcFR5cGVcclxuXHJcbiAgICBpZiAoaGVhZGVycykge1xyXG4gICAgICAgIE9iamVjdC5rZXlzKGhlYWRlcnMpLmZvckVhY2goKGhlYWRlcikgPT4ge1xyXG4gICAgICAgICAgICByZXEuc2V0UmVxdWVzdEhlYWRlcihoZWFkZXIsIGhlYWRlcnNbaGVhZGVyXSlcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIC8vIElmIGRhdGEgaXMgdW5kZWZpbmVkIGRlZmF1bHQgdG8gdGhlIG5vcm1hbCByZXEuc2VuZCgpLCBvdGhlcndpc2UgcGFzcyB0aGUgZGF0YSBpblxyXG4gICAgcmVxLnNlbmQoZGF0YSlcclxuICAgIHJldHVybiByZXFcclxufVxyXG5cclxuLyoqIFNlbmRzIGEgcmVxdWVzdCB0byBhIHNlcnZlciBhbmQgcmV0dXJucyBhIFByb21pc2UuXHJcbiAqIEBwYXJhbSB1cmwgdGhlIHVybCB0byByZXRyaWV2ZVxyXG4gKiBAcGFyYW0gcmVzcFR5cGUgdGhlIHR5cGUgb2YgcmVzcG9uc2UgdGhhdCBzaG91bGQgYmUgcmVjZWl2ZWRcclxuICogQHBhcmFtIGhlYWRlcnMgdGhlIGhlYWRlcnMgdGhhdCB3aWxsIGJlIHNlbnQgdG8gdGhlIHNlcnZlclxyXG4gKiBAcGFyYW0gZGF0YSB0aGUgZGF0YSB0aGF0IHdpbGwgYmUgc2VudCB0byB0aGUgc2VydmVyIChvbmx5IGZvciBQT1NUIHJlcXVlc3RzKVxyXG4gKiBAcGFyYW0gcHJvZ3Jlc3NFbGVtZW50IGFuIG9wdGlvbmFsIGVsZW1lbnQgZm9yIHRoZSBwcm9ncmVzcyBiYXIgdXNlZCB0byBkaXNwbGF5IHRoZSBzdGF0dXMgb2YgdGhlIHJlcXVlc3RcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBzZW5kKHVybDogc3RyaW5nLCByZXNwVHlwZT86IFhNTEh0dHBSZXF1ZXN0UmVzcG9uc2VUeXBlfG51bGwsIGhlYWRlcnM/OiB7W25hbWU6IHN0cmluZ106IHN0cmluZ318bnVsbCxcclxuICAgICAgICAgICAgICAgICAgICAgZGF0YT86IHN0cmluZ3xudWxsLCBwcm9ncmVzcz86IEhUTUxFbGVtZW50fG51bGwpOiBQcm9taXNlPFhNTEh0dHBSZXF1ZXN0PiB7XHJcblxyXG4gICAgY29uc3QgcmVxID0gY29uc3RydWN0WE1MSHR0cFJlcXVlc3QodXJsLCByZXNwVHlwZSwgaGVhZGVycywgZGF0YSlcclxuXHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cclxuICAgICAgICBjb25zdCBwcm9ncmVzc0lubmVyID0gcHJvZ3Jlc3MgPyBwcm9ncmVzcy5xdWVyeVNlbGVjdG9yKCdkaXYnKSA6IG51bGxcclxuICAgICAgICBpZiAocHJvZ3Jlc3MgJiYgcHJvZ3Jlc3NJbm5lcikge1xyXG4gICAgICAgICAgICBmb3JjZUxheW91dChwcm9ncmVzc0lubmVyKSAvLyBXYWl0IGZvciBpdCB0byByZW5kZXJcclxuICAgICAgICAgICAgcHJvZ3Jlc3MuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJykgLy8gRGlzcGxheSB0aGUgcHJvZ3Jlc3MgYmFyXHJcbiAgICAgICAgICAgIGlmIChwcm9ncmVzc0lubmVyLmNsYXNzTGlzdC5jb250YWlucygnZGV0ZXJtaW5hdGUnKSkge1xyXG4gICAgICAgICAgICAgICAgcHJvZ3Jlc3NJbm5lci5jbGFzc0xpc3QucmVtb3ZlKCdkZXRlcm1pbmF0ZScpXHJcbiAgICAgICAgICAgICAgICBwcm9ncmVzc0lubmVyLmNsYXNzTGlzdC5hZGQoJ2luZGV0ZXJtaW5hdGUnKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBTb21ldGltZXMgdGhlIGJyb3dzZXIgd29uJ3QgZ2l2ZSB0aGUgdG90YWwgYnl0ZXMgaW4gdGhlIHJlc3BvbnNlLCBzbyB1c2UgcGFzdCByZXN1bHRzIG9yXHJcbiAgICAgICAgLy8gYSBkZWZhdWx0IG9mIDE3MCwwMDAgYnl0ZXMgaWYgdGhlIGJyb3dzZXIgZG9lc24ndCBwcm92aWRlIHRoZSBudW1iZXJcclxuICAgICAgICBjb25zdCBsb2FkID0gTnVtYmVyKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdsb2FkJykpIHx8IDE3MDAwMFxyXG4gICAgICAgIGxldCBjb21wdXRlZExvYWQgPSAwXHJcblxyXG4gICAgICAgIHJlcS5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKGV2dCkgPT4ge1xyXG4gICAgICAgICAgICAvLyBDYWNoZSB0aGUgbnVtYmVyIG9mIGJ5dGVzIGxvYWRlZCBzbyBpdCBjYW4gYmUgdXNlZCBmb3IgYmV0dGVyIGVzdGltYXRlcyBsYXRlciBvblxyXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnbG9hZCcsIFN0cmluZyhjb21wdXRlZExvYWQpKVxyXG4gICAgICAgICAgICBpZiAocHJvZ3Jlc3MpIHByb2dyZXNzLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgICAgICAgICAgIC8vIFJlc29sdmUgd2l0aCB0aGUgcmVxdWVzdFxyXG4gICAgICAgICAgICBpZiAocmVxLnN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKHJlcSlcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChFcnJvcihyZXEuc3RhdHVzVGV4dCkpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICByZXEuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChwcm9ncmVzcykgcHJvZ3Jlc3MuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcclxuICAgICAgICAgICAgcmVqZWN0KEVycm9yKCdOZXR3b3JrIEVycm9yJykpXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgaWYgKHByb2dyZXNzICYmIHByb2dyZXNzSW5uZXIpIHtcclxuICAgICAgICAgICAgcmVxLmFkZEV2ZW50TGlzdGVuZXIoJ3Byb2dyZXNzJywgKGV2dCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gVXBkYXRlIHRoZSBwcm9ncmVzcyBiYXJcclxuICAgICAgICAgICAgICAgIGlmIChwcm9ncmVzc0lubmVyLmNsYXNzTGlzdC5jb250YWlucygnaW5kZXRlcm1pbmF0ZScpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvZ3Jlc3NJbm5lci5jbGFzc0xpc3QucmVtb3ZlKCdpbmRldGVybWluYXRlJylcclxuICAgICAgICAgICAgICAgICAgICBwcm9ncmVzc0lubmVyLmNsYXNzTGlzdC5hZGQoJ2RldGVybWluYXRlJylcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvbXB1dGVkTG9hZCA9IGV2dC5sb2FkZWRcclxuICAgICAgICAgICAgICAgIHByb2dyZXNzSW5uZXIuc3R5bGUud2lkdGggPSAoKDEwMCAqIGV2dC5sb2FkZWQpIC8gKGV2dC5sZW5ndGhDb21wdXRhYmxlID8gZXZ0LnRvdGFsIDogbG9hZCkpICsgJyUnXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxufVxyXG5cclxuLyoqXHJcbiAqIFRoZSBlcXVpdmFsZW50IG9mIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkIGJ1dCB0aHJvd3MgYW4gZXJyb3IgaWYgdGhlIGVsZW1lbnQgaXMgbm90IGRlZmluZWRcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBlbGVtQnlJZChpZDogc3RyaW5nKTogSFRNTEVsZW1lbnQge1xyXG4gICAgY29uc3QgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZClcclxuICAgIGlmIChlbCA9PSBudWxsKSB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBmaW5kIGVsZW1lbnQgd2l0aCBpZCAke2lkfWApXHJcbiAgICByZXR1cm4gZWxcclxufVxyXG5cclxuLyoqXHJcbiAqIEEgbGl0dGxlIGhlbHBlciBmdW5jdGlvbiB0byBzaW1wbGlmeSB0aGUgY3JlYXRpb24gb2YgSFRNTCBlbGVtZW50c1xyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGVsZW1lbnQodGFnOiBzdHJpbmcsIGNsczogc3RyaW5nfHN0cmluZ1tdLCBodG1sPzogc3RyaW5nfG51bGwsIGlkPzogc3RyaW5nfG51bGwpOiBIVE1MRWxlbWVudCB7XHJcbiAgICBjb25zdCBlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWcpXHJcblxyXG4gICAgaWYgKHR5cGVvZiBjbHMgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgZS5jbGFzc0xpc3QuYWRkKGNscylcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY2xzLmZvckVhY2goKGMpID0+IGUuY2xhc3NMaXN0LmFkZChjKSlcclxuICAgIH1cclxuXHJcbiAgICBpZiAoaHRtbCkgZS5pbm5lckhUTUwgPSBodG1sXHJcbiAgICBpZiAoaWQpIGUuc2V0QXR0cmlidXRlKCdpZCcsIGlkKVxyXG5cclxuICAgIHJldHVybiBlXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBUaHJvd3MgYW4gZXJyb3IgaWYgdGhlIHN1cHBsaWVkIGFyZ3VtZW50IGlzIG51bGwsIG90aGVyd2lzZSByZXR1cm5zIHRoZSBhcmd1bWVudFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIF8kPFQ+KGFyZzogVHxudWxsKTogVCB7XHJcbiAgICBpZiAoYXJnID09IG51bGwpIHRocm93IG5ldyBFcnJvcignRXhwZWN0ZWQgYXJndW1lbnQgdG8gYmUgbm9uLW51bGwnKVxyXG4gICAgcmV0dXJuIGFyZ1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gXyRoKGFyZzogTm9kZXxFdmVudFRhcmdldHxudWxsKTogSFRNTEVsZW1lbnQge1xyXG4gICAgaWYgKGFyZyA9PSBudWxsKSB0aHJvdyBuZXcgRXJyb3IoJ0V4cGVjdGVkIG5vZGUgdG8gYmUgbm9uLW51bGwnKVxyXG4gICAgcmV0dXJuIGFyZyBhcyBIVE1MRWxlbWVudFxyXG59XHJcblxyXG4vLyBCZWNhdXNlIHNvbWUgbG9jYWxTdG9yYWdlIGVudHJpZXMgY2FuIGJlY29tZSBjb3JydXB0ZWQgZHVlIHRvIGVycm9yIHNpZGUgZWZmZWN0cywgdGhlIGJlbG93XHJcbi8vIG1ldGhvZCB0cmllcyB0byByZWFkIGEgdmFsdWUgZnJvbSBsb2NhbFN0b3JhZ2UgYW5kIGhhbmRsZXMgZXJyb3JzLlxyXG5leHBvcnQgZnVuY3Rpb24gbG9jYWxTdG9yYWdlUmVhZChuYW1lOiBzdHJpbmcpOiBhbnlcclxuZXhwb3J0IGZ1bmN0aW9uIGxvY2FsU3RvcmFnZVJlYWQ8Uj4obmFtZTogc3RyaW5nLCBkZWZhdWx0VmFsOiAoKSA9PiBSKTogUlxyXG5leHBvcnQgZnVuY3Rpb24gbG9jYWxTdG9yYWdlUmVhZDxUPihuYW1lOiBzdHJpbmcsIGRlZmF1bHRWYWw6IFQpOiBUXHJcbmV4cG9ydCBmdW5jdGlvbiBsb2NhbFN0b3JhZ2VSZWFkKG5hbWU6IHN0cmluZywgZGVmYXVsdFZhbD86IGFueSk6IGFueSB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZVtuYW1lXSlcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICByZXR1cm4gdHlwZW9mIGRlZmF1bHRWYWwgPT09ICdmdW5jdGlvbicgPyBkZWZhdWx0VmFsKCkgOiBkZWZhdWx0VmFsXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBsb2NhbFN0b3JhZ2VXcml0ZShuYW1lOiBzdHJpbmcsIGl0ZW06IGFueSk6IHZvaWQge1xyXG4gICAgbG9jYWxTdG9yYWdlW25hbWVdID0gSlNPTi5zdHJpbmdpZnkoaXRlbSlcclxufVxyXG5cclxuaW50ZXJmYWNlIElkbGVEZWFkbGluZSB7XHJcbiAgICBkaWRUaW1lb3V0OiBib29sZWFuXHJcbiAgICB0aW1lUmVtYWluaW5nOiAoKSA9PiBudW1iZXJcclxufVxyXG5cclxuLy8gQmVjYXVzZSB0aGUgcmVxdWVzdElkbGVDYWxsYmFjayBmdW5jdGlvbiBpcyB2ZXJ5IG5ldyAoYXMgb2Ygd3JpdGluZyBvbmx5IHdvcmtzIHdpdGggQ2hyb21lXHJcbi8vIHZlcnNpb24gNDcpLCB0aGUgYmVsb3cgZnVuY3Rpb24gcG9seWZpbGxzIHRoYXQgbWV0aG9kLlxyXG5leHBvcnQgZnVuY3Rpb24gcmVxdWVzdElkbGVDYWxsYmFjayhjYjogKGRlYWRsaW5lOiBJZGxlRGVhZGxpbmUpID0+IHZvaWQsIG9wdHM6IHsgdGltZW91dDogbnVtYmVyfSk6IG51bWJlciB7XHJcbiAgICBpZiAoJ3JlcXVlc3RJZGxlQ2FsbGJhY2snIGluIHdpbmRvdykge1xyXG4gICAgICAgIHJldHVybiAod2luZG93IGFzIGFueSkucmVxdWVzdElkbGVDYWxsYmFjayhjYiwgb3B0cylcclxuICAgIH1cclxuICAgIGNvbnN0IHN0YXJ0ID0gRGF0ZS5ub3coKVxyXG5cclxuICAgIHJldHVybiBzZXRUaW1lb3V0KCgpID0+IGNiKHtcclxuICAgICAgICBkaWRUaW1lb3V0OiBmYWxzZSxcclxuICAgICAgICB0aW1lUmVtYWluaW5nKCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIHJldHVybiBNYXRoLm1heCgwLCA1MCAtIChEYXRlLm5vdygpIC0gc3RhcnQpKVxyXG4gICAgICAgIH1cclxuICAgIH0pLCAxKVxyXG59XHJcblxyXG4vKipcclxuICogRGV0ZXJtaW5lIGlmIHRoZSB0d28gZGF0ZXMgaGF2ZSB0aGUgc2FtZSB5ZWFyLCBtb250aCwgYW5kIGRheVxyXG4gKi9cclxuZnVuY3Rpb24gZGF0ZXNFcXVhbChhOiBEYXRlLCBiOiBEYXRlKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdG9EYXRlTnVtKGEpID09PSB0b0RhdGVOdW0oYilcclxufVxyXG5cclxuY29uc3QgREFURV9SRUxBVElWRU5BTUVTOiB7W25hbWU6IHN0cmluZ106IG51bWJlcn0gPSB7XHJcbiAgICAnVG9tb3Jyb3cnOiAxLFxyXG4gICAgJ1RvZGF5JzogMCxcclxuICAgICdZZXN0ZXJkYXknOiAtMSxcclxuICAgICcyIGRheXMgYWdvJzogLTJcclxufVxyXG5jb25zdCBXRUVLREFZUyA9IFsnU3VuZGF5JywgJ01vbmRheScsICdUdWVzZGF5JywgJ1dlZG5lc2RheScsICdUaHVyc2RheScsICdGcmlkYXknLCAnU2F0dXJkYXknXVxyXG5jb25zdCBGVUxMTU9OVEhTID0gWydKYW51YXJ5JywgJ0ZlYnJ1YXJ5JywgJ01hcmNoJywgJ0FwcmlsJywgJ01heScsICdKdW5lJywgJ0p1bHknLCAnQXVndXN0JywgJ1NlcHRlbWJlcicsICdPY3RvYmVyJyxcclxuICAgICAgICAgICAgICAgICAgICAnTm92ZW1iZXInLCAnRGVjZW1iZXInXVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRhdGVTdHJpbmcoZGF0ZTogRGF0ZXxudW1iZXJ8J0ZvcmV2ZXInLCBhZGRUaGlzOiBib29sZWFuID0gZmFsc2UpOiBzdHJpbmcge1xyXG4gICAgaWYgKGRhdGUgPT09ICdGb3JldmVyJykgcmV0dXJuIGRhdGVcclxuICAgIGlmICh0eXBlb2YgZGF0ZSA9PT0gJ251bWJlcicpIHJldHVybiBkYXRlU3RyaW5nKGZyb21EYXRlTnVtKGRhdGUpLCBhZGRUaGlzKVxyXG5cclxuICAgIGNvbnN0IHJlbGF0aXZlTWF0Y2ggPSBPYmplY3Qua2V5cyhEQVRFX1JFTEFUSVZFTkFNRVMpLmZpbmQoKG5hbWUpID0+IHtcclxuICAgICAgICBjb25zdCBkYXlBdCA9IG5ldyBEYXRlKClcclxuICAgICAgICBkYXlBdC5zZXREYXRlKGRheUF0LmdldERhdGUoKSArIERBVEVfUkVMQVRJVkVOQU1FU1tuYW1lXSlcclxuICAgICAgICByZXR1cm4gZGF0ZXNFcXVhbChkYXlBdCwgZGF0ZSlcclxuICAgIH0pXHJcbiAgICBpZiAocmVsYXRpdmVNYXRjaCkgcmV0dXJuIHJlbGF0aXZlTWF0Y2hcclxuXHJcbiAgICBjb25zdCBkYXlzQWhlYWQgPSAoZGF0ZS5nZXRUaW1lKCkgLSBEYXRlLm5vdygpKSAvIDEwMDAgLyAzNjAwIC8gMjRcclxuXHJcbiAgICAvLyBJZiB0aGUgZGF0ZSBpcyB3aXRoaW4gNiBkYXlzIG9mIHRvZGF5LCBvbmx5IGRpc3BsYXkgdGhlIGRheSBvZiB0aGUgd2Vla1xyXG4gICAgaWYgKDAgPCBkYXlzQWhlYWQgJiYgZGF5c0FoZWFkIDw9IDYpIHtcclxuICAgICAgICByZXR1cm4gKGFkZFRoaXMgPyAnVGhpcyAnIDogJycpICsgV0VFS0RBWVNbZGF0ZS5nZXREYXkoKV1cclxuICAgIH1cclxuICAgIHJldHVybiBgJHtXRUVLREFZU1tkYXRlLmdldERheSgpXX0sICR7RlVMTE1PTlRIU1tkYXRlLmdldE1vbnRoKCldfSAke2RhdGUuZ2V0RGF0ZSgpfWBcclxufVxyXG5cclxuLy8gVGhlIG9uZSBiZWxvdyBzY3JvbGxzIHNtb290aGx5IHRvIGEgeSBwb3NpdGlvbi5cclxuZXhwb3J0IGZ1bmN0aW9uIHNtb290aFNjcm9sbCh0bzogbnVtYmVyKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgIGxldCBzdGFydDogbnVtYmVyfG51bGwgPSBudWxsXHJcbiAgICAgICAgY29uc3QgZnJvbSA9IGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wXHJcbiAgICAgICAgY29uc3QgYW1vdW50ID0gdG8gLSBmcm9tXHJcbiAgICAgICAgY29uc3Qgc3RlcCA9ICh0aW1lc3RhbXA6IG51bWJlcikgPT4ge1xyXG4gICAgICAgICAgICBpZiAoc3RhcnQgPT0gbnVsbCkgeyBzdGFydCA9IHRpbWVzdGFtcCB9XHJcbiAgICAgICAgICAgIGNvbnN0IHByb2dyZXNzID0gdGltZXN0YW1wIC0gc3RhcnRcclxuICAgICAgICAgICAgd2luZG93LnNjcm9sbFRvKDAsIGZyb20gKyAoYW1vdW50ICogKHByb2dyZXNzIC8gMzUwKSkpXHJcbiAgICAgICAgICAgIGlmIChwcm9ncmVzcyA8IDM1MCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3RBbmltYXRpb25GcmFtZShzdGVwKVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgXyQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbmF2JykpLmNsYXNzTGlzdC5yZW1vdmUoJ2hlYWRyb29tLS11bnBpbm5lZCcpXHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RlcClcclxuICAgIH0pXHJcbn1cclxuXHJcbi8vIEFuZCBhIGZ1bmN0aW9uIHRvIGFwcGx5IGFuIGluayBlZmZlY3RcclxuZXhwb3J0IGZ1bmN0aW9uIHJpcHBsZShlbDogSFRNTEVsZW1lbnQpOiB2b2lkIHtcclxuICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIChldnQpID0+IHtcclxuICAgICAgICBpZiAoZXZ0LndoaWNoICE9PSAxKSByZXR1cm4gLy8gTm90IGxlZnQgYnV0dG9uXHJcbiAgICAgICAgY29uc3Qgd2F2ZSA9IGVsZW1lbnQoJ3NwYW4nLCAnd2F2ZScpXHJcbiAgICAgICAgY29uc3Qgc2l6ZSA9IE1hdGgubWF4KE51bWJlcihlbC5vZmZzZXRXaWR0aCksIE51bWJlcihlbC5vZmZzZXRIZWlnaHQpKVxyXG4gICAgICAgIHdhdmUuc3R5bGUud2lkdGggPSAod2F2ZS5zdHlsZS5oZWlnaHQgPSBzaXplICsgJ3B4JylcclxuXHJcbiAgICAgICAgbGV0IHggPSBldnQuY2xpZW50WFxyXG4gICAgICAgIGxldCB5ID0gZXZ0LmNsaWVudFlcclxuICAgICAgICBjb25zdCByZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcclxuICAgICAgICB4IC09IHJlY3QubGVmdFxyXG4gICAgICAgIHkgLT0gcmVjdC50b3BcclxuXHJcbiAgICAgICAgd2F2ZS5zdHlsZS50b3AgPSAoeSAtIChzaXplIC8gMikpICsgJ3B4J1xyXG4gICAgICAgIHdhdmUuc3R5bGUubGVmdCA9ICh4IC0gKHNpemUgLyAyKSkgKyAncHgnXHJcbiAgICAgICAgZWwuYXBwZW5kQ2hpbGQod2F2ZSlcclxuICAgICAgICB3YXZlLnNldEF0dHJpYnV0ZSgnZGF0YS1ob2xkJywgU3RyaW5nKERhdGUubm93KCkpKVxyXG4gICAgICAgIGZvcmNlTGF5b3V0KHdhdmUpXHJcbiAgICAgICAgd2F2ZS5zdHlsZS50cmFuc2Zvcm0gPSAnc2NhbGUoMi41KSdcclxuICAgIH0pXHJcbiAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgKGV2dCkgPT4ge1xyXG4gICAgICAgIGlmIChldnQud2hpY2ggIT09IDEpIHJldHVybiAvLyBPbmx5IGZvciBsZWZ0IGJ1dHRvblxyXG4gICAgICAgIGNvbnN0IHdhdmVzID0gZWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnd2F2ZScpXHJcbiAgICAgICAgd2F2ZXMuZm9yRWFjaCgod2F2ZSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBkaWZmID0gRGF0ZS5ub3coKSAtIE51bWJlcih3YXZlLmdldEF0dHJpYnV0ZSgnZGF0YS1ob2xkJykpXHJcbiAgICAgICAgICAgIGNvbnN0IGRlbGF5ID0gTWF0aC5tYXgoMzUwIC0gZGlmZiwgMClcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAod2F2ZSBhcyBIVE1MRWxlbWVudCkuc3R5bGUub3BhY2l0eSA9ICcwJ1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgd2F2ZS5yZW1vdmUoKVxyXG4gICAgICAgICAgICAgICAgfSwgNTUwKVxyXG4gICAgICAgICAgICB9LCBkZWxheSlcclxuICAgICAgICB9KVxyXG4gICAgfSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNzc051bWJlcihjc3M6IHN0cmluZ3xudWxsKTogbnVtYmVyIHtcclxuICAgIGlmICghY3NzKSByZXR1cm4gMFxyXG4gICAgcmV0dXJuIHBhcnNlSW50KGNzcywgMTApXHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiIifQ==