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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50LnRzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2FjdGl2aXR5LnRzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2Fzc2lnbm1lbnQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvYXZhdGFyLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2NhbGVuZGFyLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2N1c3RvbUFkZGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2Vycm9yRGlzcGxheS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9yZXNpemVyLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL3NuYWNrYmFyLnRzIiwid2VicGFjazovLy8uL3NyYy9jb29raWVzLnRzIiwid2VicGFjazovLy8uL3NyYy9kYXRlcy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZGlzcGxheS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbmF2aWdhdGlvbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGNyLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW5zL2FjdGl2aXR5LnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW5zL2F0aGVuYS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2lucy9jdXN0b21Bc3NpZ25tZW50cy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2lucy9kb25lLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW5zL21vZGlmaWVkQXNzaWdubWVudHMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NldHRpbmdzLnRzIiwid2VicGFjazovLy8uL3NyYy91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNB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RyxDQUFDLENBQUMsR0FBRyxLQUFLO0tBQ2hEO0FBQ0wsQ0FBQztBQUVELGdCQUFnQixDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVM7SUFDM0MsTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsR0FBRztJQUMzQixNQUFNLElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO0lBQzdCLE1BQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLElBQUk7SUFDN0IsTUFBTSxFQUFFLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDN0IsTUFBTSxFQUFFLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDN0IsTUFBTSxFQUFFLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7SUFFN0IsTUFBTSxLQUFLLEdBQUcsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztJQUUxQixNQUFNLEVBQUUsR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUM5QyxNQUFNLEVBQUUsR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUM5QyxNQUFNLEVBQUUsR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUU5QyxxQkFBcUI7SUFDckIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFTLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDeEUsT0FBTyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMs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RSxDQUFDLENBQUM7WUFDckMsVUFBVSxDQUFDLEdBQUcsRUFBRTtnQkFDWCxJQUFvQixDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsR0FBRztnQkFDekMsVUFBVSxDQUFDLEdBQUcsRUFBRTtvQkFDWixJQUFJLENBQUMsTUFBTSxFQUFFO2dCQUNqQixDQUFDLEVBQUUsR0FBRyxDQUFDO1lBQ1gsQ0FBQyxFQUFFLEtBQUssQ0FBQztRQUNiLENBQUMsQ0FBQztJQUNOLENBQUMsQ0FBQztBQUNOLENBQUM7QUFFSyxtQkFBb0IsR0FBZ0I7SUFDdEMsSUFBSSxDQUFDLEdBQUc7UUFBRSxPQUFPLENBQUM7SUFDbEIsT0FBTyxRQUFRLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQztBQUM1QixDQUFDIiwiZmlsZSI6ImFwcC1idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvY2xpZW50LnRzXCIpO1xuIiwiaW1wb3J0IHsgZWxlbUJ5SWQsIGVsZW1lbnQsIGxvY2FsU3RvcmFnZVJlYWQsIGxvY2FsU3RvcmFnZVdyaXRlLCBzZW5kIH0gZnJvbSAnLi91dGlsJ1xyXG5cclxuZXhwb3J0IGNvbnN0IFZFUlNJT04gPSAnMi4yNC4zJ1xyXG5cclxuY29uc3QgVkVSU0lPTl9VUkwgPSAnaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tLzE5UnlhbkEvQ2hlY2tQQ1IvbWFzdGVyL3ZlcnNpb24udHh0J1xyXG5jb25zdCBDT01NSVRfVVJMID0gKGxvY2F0aW9uLnByb3RvY29sID09PSAnY2hyb21lLWV4dGVuc2lvbjonID9cclxuICAgICdodHRwczovL2FwaS5naXRodWIuY29tL3JlcG9zLzE5UnlhbkEvQ2hlY2tQQ1IvZ2l0L3JlZnMvaGVhZHMvbWFzdGVyJyA6ICcvYXBpL2NvbW1pdCcpXHJcbmNvbnN0IE5FV1NfVVJMID0gJ2h0dHBzOi8vYXBpLmdpdGh1Yi5jb20vZ2lzdHMvMjFiZjExYTQyOWRhMjU3NTM5YTY4NTIwZjUxM2EzOGInXHJcblxyXG5mdW5jdGlvbiBmb3JtYXRDb21taXRNZXNzYWdlKG1lc3NhZ2U6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gbWVzc2FnZS5zdWJzdHIobWVzc2FnZS5pbmRleE9mKCdcXG5cXG4nKSArIDIpXHJcbiAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXCogKC4qPykoPz0kfFxcbikvZywgKGEsIGIpID0+IGA8bGk+JHtifTwvbGk+YClcclxuICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLz5cXG48L2csICc+PCcpXHJcbiAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXG4vZywgJzxicj4nKVxyXG59XHJcblxyXG4vLyBGb3IgdXBkYXRpbmcsIGEgcmVxdWVzdCB3aWxsIGJlIHNlbmQgdG8gR2l0aHViIHRvIGdldCB0aGUgY3VycmVudCBjb21taXQgaWQgYW5kIGNoZWNrIHRoYXQgYWdhaW5zdCB3aGF0J3Mgc3RvcmVkXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjaGVja0NvbW1pdCgpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcmVzcCA9IGF3YWl0IHNlbmQoVkVSU0lPTl9VUkwsICd0ZXh0JylcclxuICAgICAgICBjb25zdCBjID0gcmVzcC5yZXNwb25zZVRleHQudHJpbSgpXHJcbiAgICAgICAgY29uc29sZS5sb2coYEN1cnJlbnQgdmVyc2lvbjogJHtjfSAke1ZFUlNJT04gPT09IGMgPyAnKG5vIHVwZGF0ZSBhdmFpbGFibGUpJyA6ICcodXBkYXRlIGF2YWlsYWJsZSknfWApXHJcbiAgICAgICAgZWxlbUJ5SWQoJ25ld3ZlcnNpb24nKS5pbm5lckhUTUwgPSBjXHJcbiAgICAgICAgaWYgKFZFUlNJT04gIT09IGMpIHtcclxuICAgICAgICAgICAgZWxlbUJ5SWQoJ3VwZGF0ZUlnbm9yZScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGxvY2F0aW9uLnByb3RvY29sID09PSAnY2hyb21lLWV4dGVuc2lvbjonKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbUJ5SWQoJ3VwZGF0ZScpLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1CeUlkKCd1cGRhdGVCYWNrZ3JvdW5kJykuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0sIDM1MClcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3AyID0gYXdhaXQgc2VuZChDT01NSVRfVVJMLCAnanNvbicpXHJcbiAgICAgICAgICAgIGNvbnN0IHsgc2hhLCB1cmwgfSA9IHJlc3AyLnJlc3BvbnNlLm9iamVjdFxyXG4gICAgICAgICAgICBjb25zdCByZXNwMyA9IGF3YWl0IHNlbmQoKGxvY2F0aW9uLnByb3RvY29sID09PSAnY2hyb21lLWV4dGVuc2lvbjonID8gdXJsIDogYC9hcGkvY29tbWl0LyR7c2hhfWApLCAnanNvbicpXHJcbiAgICAgICAgICAgIGVsZW1CeUlkKCdwYXN0VXBkYXRlVmVyc2lvbicpLmlubmVySFRNTCA9IFZFUlNJT05cclxuICAgICAgICAgICAgZWxlbUJ5SWQoJ25ld1VwZGF0ZVZlcnNpb24nKS5pbm5lckhUTUwgPSBjXHJcbiAgICAgICAgICAgIGVsZW1CeUlkKCd1cGRhdGVGZWF0dXJlcycpLmlubmVySFRNTCA9IGZvcm1hdENvbW1pdE1lc3NhZ2UocmVzcDMucmVzcG9uc2UubWVzc2FnZSlcclxuICAgICAgICAgICAgZWxlbUJ5SWQoJ3VwZGF0ZUJhY2tncm91bmQnKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xyXG4gICAgICAgICAgICBlbGVtQnlJZCgndXBkYXRlJykuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuICAgICAgICB9XHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnQ291bGQgbm90IGFjY2VzcyBHaXRodWIuIEhlcmVcXCdzIHRoZSBlcnJvcjonLCBlcnIpXHJcbiAgICB9XHJcbn1cclxuXHJcbmxldCBuZXdzVXJsOiBzdHJpbmd8bnVsbCA9IG51bGxcclxubGV0IG5ld3NDb21taXQ6IHN0cmluZ3xudWxsID0gbnVsbFxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZldGNoTmV3cygpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcmVzcCA9IGF3YWl0IHNlbmQoTkVXU19VUkwsICdqc29uJylcclxuICAgICAgICBsZXQgbGFzdCA9IGxvY2FsU3RvcmFnZVJlYWQoJ25ld3NDb21taXQnKVxyXG4gICAgICAgIG5ld3NDb21taXQgPSByZXNwLnJlc3BvbnNlLmhpc3RvcnlbMF0udmVyc2lvblxyXG5cclxuICAgICAgICBpZiAobGFzdCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGxhc3QgPSBuZXdzQ29tbWl0XHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZVdyaXRlKCduZXdzQ29tbWl0JywgbmV3c0NvbW1pdClcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG5ld3NVcmwgPSByZXNwLnJlc3BvbnNlLmZpbGVzWyd1cGRhdGVzLmh0bSddLnJhd191cmxcclxuXHJcbiAgICAgICAgaWYgKGxhc3QgIT09IG5ld3NDb21taXQpIHtcclxuICAgICAgICAgICAgZ2V0TmV3cygpXHJcbiAgICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ0NvdWxkIG5vdCBhY2Nlc3MgR2l0aHViLiBIZXJlXFwncyB0aGUgZXJyb3I6JywgZXJyKVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0TmV3cyhvbmZhaWw/OiAoKSA9PiB2b2lkKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICBpZiAoIW5ld3NVcmwpIHtcclxuICAgICAgICBpZiAob25mYWlsKSBvbmZhaWwoKVxyXG4gICAgICAgIHJldHVyblxyXG4gICAgfVxyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCByZXNwID0gYXdhaXQgc2VuZChuZXdzVXJsKVxyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5uZXdzQ29tbWl0ID0gbmV3c0NvbW1pdFxyXG4gICAgICAgIHJlc3AucmVzcG9uc2VUZXh0LnNwbGl0KCc8aHI+JykuZm9yRWFjaCgobmV3cykgPT4ge1xyXG4gICAgICAgICAgICBlbGVtQnlJZCgnbmV3c0NvbnRlbnQnKS5hcHBlbmRDaGlsZChlbGVtZW50KCdkaXYnLCAnbmV3c0l0ZW0nLCBuZXdzKSlcclxuICAgICAgICB9KVxyXG4gICAgICAgIGVsZW1CeUlkKCduZXdzQmFja2dyb3VuZCcpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXHJcbiAgICAgICAgZWxlbUJ5SWQoJ25ld3MnKS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG4gICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ0NvdWxkIG5vdCBhY2Nlc3MgR2l0aHViLiBIZXJlXFwncyB0aGUgZXJyb3I6JywgZXJyKVxyXG4gICAgICAgIGlmIChvbmZhaWwpIG9uZmFpbCgpXHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgY2hlY2tDb21taXQsIGZldGNoTmV3cywgZ2V0TmV3cywgVkVSU0lPTiB9IGZyb20gJy4vYXBwJ1xyXG5pbXBvcnQgeyBjbG9zZU9wZW5lZCB9IGZyb20gJy4vY29tcG9uZW50cy9hc3NpZ25tZW50J1xyXG5pbXBvcnQgeyB1cGRhdGVBdmF0YXIgfSBmcm9tICcuL2NvbXBvbmVudHMvYXZhdGFyJ1xyXG5pbXBvcnQgeyB1cGRhdGVOZXdUaXBzIH0gZnJvbSAnLi9jb21wb25lbnRzL2N1c3RvbUFkZGVyJ1xyXG5pbXBvcnQgeyBnZXRSZXNpemVBc3NpZ25tZW50cywgcmVzaXplLCByZXNpemVDYWxsZXIgfSBmcm9tICcuL2NvbXBvbmVudHMvcmVzaXplcidcclxuaW1wb3J0IHsgdG9EYXRlTnVtLCB0b2RheSB9IGZyb20gJy4vZGF0ZXMnXHJcbmltcG9ydCB7IGRpc3BsYXksIGZvcm1hdFVwZGF0ZSwgZ2V0U2Nyb2xsIH0gZnJvbSAnLi9kaXNwbGF5J1xyXG5pbXBvcnQge1xyXG4gICAgZGVjcmVtZW50TGlzdERhdGVPZmZzZXQsXHJcbiAgICBnZXRMaXN0RGF0ZU9mZnNldCxcclxuICAgIGluY3JlbWVudExpc3REYXRlT2Zmc2V0LFxyXG4gICAgc2V0TGlzdERhdGVPZmZzZXQsXHJcbiAgICB6ZXJvTGlzdERhdGVPZmZzZXRcclxufSBmcm9tICcuL25hdmlnYXRpb24nXHJcbmltcG9ydCB7IGRvbG9naW4sIGZldGNoLCBnZXRDbGFzc2VzLCBnZXREYXRhLCBsb2dvdXQsIHNldERhdGEsIHN3aXRjaFZpZXdzIH0gZnJvbSAnLi9wY3InXHJcbmltcG9ydCB7IGFkZEFjdGl2aXR5LCByZWNlbnRBY3Rpdml0eSB9IGZyb20gJy4vcGx1Z2lucy9hY3Rpdml0eSdcclxuaW1wb3J0IHsgdXBkYXRlQXRoZW5hRGF0YSB9IGZyb20gJy4vcGx1Z2lucy9hdGhlbmEnXHJcbmltcG9ydCB7IGFkZFRvRXh0cmEsIHBhcnNlQ3VzdG9tVGFzaywgc2F2ZUV4dHJhIH0gZnJvbSAnLi9wbHVnaW5zL2N1c3RvbUFzc2lnbm1lbnRzJ1xyXG5pbXBvcnQgeyBnZXRTZXR0aW5nLCBzZXRTZXR0aW5nLCBzZXR0aW5ncyB9IGZyb20gJy4vc2V0dGluZ3MnXHJcbmltcG9ydCB7XHJcbiAgICBfJCxcclxuICAgIF8kaCxcclxuICAgIGRhdGVTdHJpbmcsXHJcbiAgICBlbGVtQnlJZCxcclxuICAgIGVsZW1lbnQsXHJcbiAgICBmb3JjZUxheW91dCxcclxuICAgIGxvY2FsU3RvcmFnZVJlYWQsXHJcbiAgICBsb2NhbFN0b3JhZ2VXcml0ZSxcclxuICAgIHJlcXVlc3RJZGxlQ2FsbGJhY2ssXHJcbiAgICByaXBwbGVcclxufSBmcm9tICcuL3V0aWwnXHJcblxyXG5pZiAobG9jYWxTdG9yYWdlUmVhZCgnZGF0YScpICE9IG51bGwpIHtcclxuICAgIHNldERhdGEobG9jYWxTdG9yYWdlUmVhZCgnZGF0YScpKVxyXG59XHJcblxyXG4vLyBBZGRpdGlvbmFsbHksIGlmIGl0J3MgdGhlIHVzZXIncyBmaXJzdCB0aW1lLCB0aGUgcGFnZSBpcyBzZXQgdG8gdGhlIHdlbGNvbWUgcGFnZS5cclxuaWYgKCFsb2NhbFN0b3JhZ2VSZWFkKCdub1dlbGNvbWUnKSkge1xyXG4gICAgbG9jYWxTdG9yYWdlV3JpdGUoJ25vV2VsY29tZScsIHRydWUpXHJcbiAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICd3ZWxjb21lLmh0bWwnXHJcbn1cclxuXHJcbmNvbnN0IE5BVl9FTEVNRU5UID0gXyQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbmF2JykpXHJcbmNvbnN0IElOUFVUX0VMRU1FTlRTID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcclxuICAgICdpbnB1dFt0eXBlPXRleHRdOm5vdCgjbmV3VGV4dCk6bm90KFtyZWFkb25seV0pLCBpbnB1dFt0eXBlPXBhc3N3b3JkXSwgaW5wdXRbdHlwZT1lbWFpbF0sICcgK1xyXG4gICAgJ2lucHV0W3R5cGU9dXJsXSwgaW5wdXRbdHlwZT10ZWxdLCBpbnB1dFt0eXBlPW51bWJlcl06bm90KC5jb250cm9sKSwgaW5wdXRbdHlwZT1zZWFyY2hdJ1xyXG4pIGFzIE5vZGVMaXN0T2Y8SFRNTElucHV0RWxlbWVudD5cclxuXHJcbi8vICMjIyMgU2VuZCBmdW5jdGlvblxyXG4vL1xyXG5cclxuLy8gVGhpcyBmdW5jdGlvbiBkaXNwbGF5cyBhIHNuYWNrYmFyIHRvIHRlbGwgdGhlIHVzZXIgc29tZXRoaW5nXHJcblxyXG4vLyA8YSBuYW1lPVwicmV0XCIvPlxyXG4vLyBSZXRyaWV2aW5nIGRhdGFcclxuLy8gLS0tLS0tLS0tLS0tLS0tXHJcbi8vXHJcbmVsZW1CeUlkKCdsb2dpbicpLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIChldnQpID0+IHtcclxuICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICBkb2xvZ2luKG51bGwsIHRydWUpXHJcbn0pXHJcblxyXG4vLyBUaGUgdmlldyBzd2l0Y2hpbmcgYnV0dG9uIG5lZWRzIGFuIGV2ZW50IGhhbmRsZXIuXHJcbmVsZW1CeUlkKCdzd2l0Y2hWaWV3cycpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgc3dpdGNoVmlld3MpXHJcblxyXG4vLyBUaGUgc2FtZSBnb2VzIGZvciB0aGUgbG9nIG91dCBidXR0b24uXHJcbmVsZW1CeUlkKCdsb2dvdXQnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGxvZ291dClcclxuXHJcbi8vIE5vdyB3ZSBhc3NpZ24gaXQgdG8gY2xpY2tpbmcgdGhlIGJhY2tncm91bmQuXHJcbmVsZW1CeUlkKCdiYWNrZ3JvdW5kJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbG9zZU9wZW5lZClcclxuXHJcbi8vIFRoZW4sIHRoZSB0YWJzIGFyZSBtYWRlIGludGVyYWN0aXZlLlxyXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcjbmF2VGFicz5saScpLmZvckVhY2goKHRhYiwgdGFiSW5kZXgpID0+IHtcclxuICB0YWIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZ0KSA9PiB7XHJcbiAgICBpZiAoIXNldHRpbmdzLnZpZXdUcmFucykge1xyXG4gICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ25vVHJhbnMnKVxyXG4gICAgICBmb3JjZUxheW91dChkb2N1bWVudC5ib2R5KVxyXG4gICAgfVxyXG4gICAgbG9jYWxTdG9yYWdlV3JpdGUoJ3ZpZXcnLCB0YWJJbmRleClcclxuICAgIGRvY3VtZW50LmJvZHkuc2V0QXR0cmlidXRlKCdkYXRhLXZpZXcnLCBTdHJpbmcodGFiSW5kZXgpKVxyXG4gICAgaWYgKHRhYkluZGV4ID09PSAxKSB7XHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJlc2l6ZUNhbGxlcilcclxuICAgICAgICBpZiAoc2V0dGluZ3Mudmlld1RyYW5zKSB7XHJcbiAgICAgICAgICAgIGxldCBzdGFydDogbnVtYmVyfG51bGwgPSBudWxsXHJcbiAgICAgICAgICAgIC8vIFRoZSBjb2RlIGJlbG93IGlzIHRoZSBzYW1lIGNvZGUgdXNlZCBpbiB0aGUgcmVzaXplKCkgZnVuY3Rpb24uIEl0IGJhc2ljYWxseSBqdXN0XHJcbiAgICAgICAgICAgIC8vIHBvc2l0aW9ucyB0aGUgYXNzaWdubWVudHMgY29ycmVjdGx5IGFzIHRoZXkgYW5pbWF0ZVxyXG4gICAgICAgICAgICBjb25zdCB3aWR0aHMgPSBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5jb250YWlucygnc2hvd0luZm8nKSA/XHJcbiAgICAgICAgICAgICAgICBbNjUwLCAxMTAwLCAxODAwLCAyNzAwLCAzODAwLCA1MTAwXSA6IFszNTAsIDgwMCwgMTUwMCwgMjQwMCwgMzUwMCwgNDgwMF1cclxuICAgICAgICAgICAgbGV0IGNvbHVtbnMgPSAxXHJcbiAgICAgICAgICAgIHdpZHRocy5mb3JFYWNoKCh3LCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHdpbmRvdy5pbm5lcldpZHRoID4gdykgeyBjb2x1bW5zID0gaW5kZXggKyAxIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgY29uc3QgYXNzaWdubWVudHMgPSBnZXRSZXNpemVBc3NpZ25tZW50cygpXHJcbiAgICAgICAgICAgIGNvbnN0IGNvbHVtbkhlaWdodHMgPSBBcnJheS5mcm9tKG5ldyBBcnJheShjb2x1bW5zKSwgKCkgPT4gMClcclxuICAgICAgICAgICAgY29uc3Qgc3RlcCA9ICh0aW1lc3RhbXA6IG51bWJlcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFjb2x1bW5zKSB0aHJvdyBuZXcgRXJyb3IoJ0NvbHVtbnMgbnVtYmVyIG5vdCBmb3VuZCcpXHJcbiAgICAgICAgICAgICAgICBpZiAoc3RhcnQgPT0gbnVsbCkgeyBzdGFydCA9IHRpbWVzdGFtcCB9XHJcbiAgICAgICAgICAgICAgICBhc3NpZ25tZW50cy5mb3JFYWNoKChhc3NpZ25tZW50LCBuKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY29sID0gbiAlIGNvbHVtbnNcclxuICAgICAgICAgICAgICAgICAgICBpZiAobiA8IGNvbHVtbnMpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb2x1bW5IZWlnaHRzW2NvbF0gPSAwXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGFzc2lnbm1lbnQuc3R5bGUudG9wID0gY29sdW1uSGVpZ2h0c1tjb2xdICsgJ3B4J1xyXG4gICAgICAgICAgICAgICAgICAgIGFzc2lnbm1lbnQuc3R5bGUubGVmdCA9ICgoMTAwIC8gY29sdW1ucykgKiBjb2wpICsgJyUnXHJcbiAgICAgICAgICAgICAgICAgICAgYXNzaWdubWVudC5zdHlsZS5yaWdodCA9ICgoMTAwIC8gY29sdW1ucykgKiAoY29sdW1ucyAtIGNvbCAtIDEpKSArICclJ1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbHVtbkhlaWdodHNbY29sXSArPSBhc3NpZ25tZW50Lm9mZnNldEhlaWdodCArIDI0XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgaWYgKCh0aW1lc3RhbXAgLSBzdGFydCkgPCAzNTApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShzdGVwKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RlcClcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWNvbHVtbnMpIHRocm93IG5ldyBFcnJvcignQ29sdW1ucyBudW1iZXIgbm90IGZvdW5kJylcclxuICAgICAgICAgICAgICAgIGFzc2lnbm1lbnRzLmZvckVhY2goKGFzc2lnbm1lbnQsIG4pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjb2wgPSBuICUgY29sdW1uc1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChuIDwgY29sdW1ucykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbHVtbkhlaWdodHNbY29sXSA9IDBcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYXNzaWdubWVudC5zdHlsZS50b3AgPSBjb2x1bW5IZWlnaHRzW2NvbF0gKyAncHgnXHJcbiAgICAgICAgICAgICAgICAgICAgY29sdW1uSGVpZ2h0c1tjb2xdICs9IGFzc2lnbm1lbnQub2Zmc2V0SGVpZ2h0ICsgMjRcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0sIDM1MClcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXNpemUoKVxyXG4gICAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgd2luZG93LnNjcm9sbFRvKDAsIGdldFNjcm9sbCgpKVxyXG4gICAgICAgIE5BVl9FTEVNRU5ULmNsYXNzTGlzdC5hZGQoJ2hlYWRyb29tLS1sb2NrZWQnKVxyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICBOQVZfRUxFTUVOVC5jbGFzc0xpc3QucmVtb3ZlKCdoZWFkcm9vbS0tdW5waW5uZWQnKVxyXG4gICAgICAgICAgICBOQVZfRUxFTUVOVC5jbGFzc0xpc3QucmVtb3ZlKCdoZWFkcm9vbS0tbG9ja2VkJylcclxuICAgICAgICAgICAgTkFWX0VMRU1FTlQuY2xhc3NMaXN0LmFkZCgnaGVhZHJvb20tLXBpbm5lZCcpXHJcbiAgICAgICAgICAgIHJlcXVlc3RJZGxlQ2FsbGJhY2soKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgemVyb0xpc3REYXRlT2Zmc2V0KClcclxuICAgICAgICAgICAgICAgIHVwZGF0ZUxpc3ROYXYoKVxyXG4gICAgICAgICAgICAgICAgZGlzcGxheSgpXHJcbiAgICAgICAgICAgIH0sIHt0aW1lb3V0OiAyMDAwfSlcclxuICAgICAgICB9LCAzNTApXHJcbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJlc2l6ZUNhbGxlcilcclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYXNzaWdubWVudCcpLmZvckVhY2goKGFzc2lnbm1lbnQpID0+IHtcclxuICAgICAgICAgICAgKGFzc2lnbm1lbnQgYXMgSFRNTEVsZW1lbnQpLnN0eWxlLnRvcCA9ICdhdXRvJ1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbiAgICBpZiAoIXNldHRpbmdzLnZpZXdUcmFucykge1xyXG4gICAgICBmb3JjZUxheW91dChkb2N1bWVudC5ib2R5KVxyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnbm9UcmFucycpXHJcbiAgICAgIH0sIDM1MClcclxuICAgIH1cclxuICB9KVxyXG59KVxyXG5cclxuLy8gQW5kIHRoZSBpbmZvIHRhYnMgKGp1c3QgYSBsaXR0bGUgbGVzcyBjb2RlKVxyXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcjaW5mb1RhYnM+bGknKS5mb3JFYWNoKCh0YWIsIHRhYkluZGV4KSA9PiB7XHJcbiAgICB0YWIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZ0KSA9PiB7XHJcbiAgICAgICAgZWxlbUJ5SWQoJ2luZm8nKS5zZXRBdHRyaWJ1dGUoJ2RhdGEtdmlldycsIFN0cmluZyh0YWJJbmRleCkpXHJcbiAgICB9KVxyXG59KVxyXG5cclxuLy8gVGhlIHZpZXcgaXMgc2V0IHRvIHdoYXQgaXQgd2FzIGxhc3QuXHJcbmlmIChsb2NhbFN0b3JhZ2VSZWFkKCd2aWV3JykgIT0gbnVsbCkge1xyXG4gIGRvY3VtZW50LmJvZHkuc2V0QXR0cmlidXRlKCdkYXRhLXZpZXcnLCBsb2NhbFN0b3JhZ2VSZWFkKCd2aWV3JykpXHJcbiAgaWYgKGxvY2FsU3RvcmFnZVJlYWQoJ3ZpZXcnKSA9PT0gJzEnKSB7XHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgcmVzaXplQ2FsbGVyKVxyXG4gIH1cclxufVxyXG5cclxuLy8gQWRkaXRpb25hbGx5LCB0aGUgYWN0aXZlIGNsYXNzIG5lZWRzIHRvIGJlIGFkZGVkIHdoZW4gaW5wdXRzIGFyZSBzZWxlY3RlZCAoZm9yIHRoZSBsb2dpbiBib3gpLlxyXG5JTlBVVF9FTEVNRU5UUy5mb3JFYWNoKChpbnB1dCkgPT4ge1xyXG4gICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGV2dCkgPT4ge1xyXG4gICAgICAgIF8kaChfJGgoaW5wdXQucGFyZW50Tm9kZSkucXVlcnlTZWxlY3RvcignbGFiZWwnKSkuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuICAgIH0pXHJcbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsIChldnQpID0+IHtcclxuICAgICAgICBfJGgoXyRoKGlucHV0LnBhcmVudE5vZGUpLnF1ZXJ5U2VsZWN0b3IoJ2xhYmVsJykpLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcbiAgICB9KVxyXG4gICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIChldnQpID0+IHtcclxuICAgICAgICBpZiAoaW5wdXQudmFsdWUubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIF8kaChfJGgoaW5wdXQucGFyZW50Tm9kZSkucXVlcnlTZWxlY3RvcignbGFiZWwnKSkuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59KVxyXG5cclxuLy8gV2hlbiB0aGUgZXNjYXBlIGtleSBpcyBwcmVzc2VkLCB0aGUgY3VycmVudCBhc3NpZ25tZW50IHNob3VsZCBiZSBjbG9zZWQuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGV2dCkgPT4ge1xyXG4gIGlmIChldnQud2hpY2ggPT09IDI3KSB7IC8vIEVzY2FwZSBrZXkgcHJlc3NlZFxyXG4gICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2Z1bGwnKS5sZW5ndGggIT09IDApIHsgcmV0dXJuIGNsb3NlT3BlbmVkKG5ldyBFdmVudCgnR2VuZXJhdGVkIEV2ZW50JykpIH1cclxuICB9XHJcbn0pO1xyXG5cclxuLy8gSWYgaXQncyB3aW50ZXIgdGltZSwgYSBjbGFzcyBpcyBhZGRlZCB0byB0aGUgYm9keSBlbGVtZW50LlxyXG4oKCkgPT4ge1xyXG4gICAgY29uc3QgdG9kYXlEYXRlID0gbmV3IERhdGUoKVxyXG4gICAgaWYgKG5ldyBEYXRlKHRvZGF5RGF0ZS5nZXRGdWxsWWVhcigpLCAxMCwgMjcpIDw9IHRvZGF5RGF0ZSAmJlxyXG4gICAgICAgIHRvZGF5RGF0ZSA8PSBuZXcgRGF0ZSh0b2RheURhdGUuZ2V0RnVsbFllYXIoKSwgMTEsIDMyKSkge1xyXG4gICAgICAgIHJldHVybiBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ3dpbnRlcicpXHJcbiAgICB9XHJcbn0pKClcclxuXHJcbi8vIEZvciB0aGUgbmF2YmFyIHRvZ2dsZSBidXR0b25zLCBhIGZ1bmN0aW9uIHRvIHRvZ2dsZSB0aGUgYWN0aW9uIGlzIGRlZmluZWQgdG8gZWxpbWluYXRlIGNvZGUuXHJcbmZ1bmN0aW9uIG5hdlRvZ2dsZShlbGVtOiBzdHJpbmcsIGxzOiBzdHJpbmcsIGY/OiAoKSA9PiB2b2lkKTogdm9pZCB7XHJcbiAgICByaXBwbGUoZWxlbUJ5SWQoZWxlbSkpXHJcbiAgICBlbGVtQnlJZChlbGVtKS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgKCkgPT4ge1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnRvZ2dsZShscylcclxuICAgICAgICByZXNpemUoKVxyXG4gICAgICAgIGxvY2FsU3RvcmFnZVdyaXRlKGxzLCBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5jb250YWlucyhscykpXHJcbiAgICAgICAgaWYgKGYgIT0gbnVsbCkgZigpXHJcbiAgICB9KVxyXG4gICAgaWYgKGxvY2FsU3RvcmFnZVJlYWQobHMpKSBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQobHMpXHJcbn1cclxuXHJcbi8vIFRoZSBidXR0b24gdG8gc2hvdy9oaWRlIGNvbXBsZXRlZCBhc3NpZ25tZW50cyBpbiBsaXN0IHZpZXcgYWxzbyBuZWVkcyBldmVudCBsaXN0ZW5lcnMuXHJcbm5hdlRvZ2dsZSgnY3ZCdXR0b24nLCAnc2hvd0RvbmUnLCAoKSA9PiBzZXRUaW1lb3V0KHJlc2l6ZSwgMTAwMCkpXHJcblxyXG4vLyBUaGUgc2FtZSBnb2VzIGZvciB0aGUgYnV0dG9uIHRoYXQgc2hvd3MgdXBjb21pbmcgdGVzdHMuXHJcbmlmIChsb2NhbFN0b3JhZ2Uuc2hvd0luZm8gPT0gbnVsbCkgeyBsb2NhbFN0b3JhZ2Uuc2hvd0luZm8gPSBKU09OLnN0cmluZ2lmeSh0cnVlKSB9XHJcbm5hdlRvZ2dsZSgnaW5mb0J1dHRvbicsICdzaG93SW5mbycpXHJcblxyXG4vLyBUaGlzIGFsc28gZ2V0cyByZXBlYXRlZCBmb3IgdGhlIHRoZW1lIHRvZ2dsaW5nLlxyXG5uYXZUb2dnbGUoJ2xpZ2h0QnV0dG9uJywgJ2RhcmsnKVxyXG5cclxuLy8gRm9yIGVhc2Ugb2YgYW5pbWF0aW9ucywgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSBwcm9taXNlIGlzIGRlZmluZWQuXHJcbmZ1bmN0aW9uIGFuaW1hdGVFbChlbDogSFRNTEVsZW1lbnQsIGtleWZyYW1lczogQW5pbWF0aW9uS2V5RnJhbWVbXSwgb3B0aW9uczogQW5pbWF0aW9uT3B0aW9ucyk6XHJcbiAgICBQcm9taXNlPEFuaW1hdGlvblBsYXliYWNrRXZlbnQ+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgY29uc3QgcGxheWVyID0gZWwuYW5pbWF0ZShrZXlmcmFtZXMsIG9wdGlvbnMpXHJcbiAgICAgICAgcGxheWVyLm9uZmluaXNoID0gKGUpID0+IHJlc29sdmUoZSlcclxuICAgIH0pXHJcbn1cclxuXHJcbi8vIEluIG9yZGVyIHRvIG1ha2UgdGhlIHByZXZpb3VzIGRhdGUgLyBuZXh0IGRhdGUgYnV0dG9ucyBkbyBzb21ldGhpbmcsIHRoZXkgbmVlZCBldmVudCBsaXN0ZW5lcnMuXHJcbmVsZW1CeUlkKCdsaXN0bmV4dCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gIGNvbnN0IHBkID0gZWxlbUJ5SWQoJ2xpc3RwcmV2ZGF0ZScpXHJcbiAgY29uc3QgdGQgPSBlbGVtQnlJZCgnbGlzdG5vd2RhdGUnKVxyXG4gIGNvbnN0IG5kID0gZWxlbUJ5SWQoJ2xpc3RuZXh0ZGF0ZScpXHJcbiAgaW5jcmVtZW50TGlzdERhdGVPZmZzZXQoKVxyXG4gIGRpc3BsYXkoKVxyXG4gIG5kLnN0eWxlLmRpc3BsYXkgPSAnaW5saW5lLWJsb2NrJ1xyXG4gIHJldHVybiBQcm9taXNlLnJhY2UoW1xyXG4gICAgYW5pbWF0ZUVsKHRkLCBbXHJcbiAgICAgIHt0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKDAlKScsIG9wYWNpdHk6IDF9LFxyXG4gICAgICB7b3BhY2l0eTogMH0sXHJcbiAgICAgIHt0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKC0xMDAlKScsIG9wYWNpdHk6IDB9XHJcbiAgICBdLCB7ZHVyYXRpb246IDMwMCwgZWFzaW5nOiAnZWFzZS1vdXQnfSksXHJcbiAgICBhbmltYXRlRWwobmQsIFtcclxuICAgICAge3RyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoMCUpJywgb3BhY2l0eTogMH0sXHJcbiAgICAgIHtvcGFjaXR5OiAwfSxcclxuICAgICAge3RyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoLTEwMCUpJywgb3BhY2l0eTogMX1cclxuICAgIF0sIHtkdXJhdGlvbjogMzAwLCBlYXNpbmc6ICdlYXNlLW91dCd9KVxyXG4gIF0pLnRoZW4oKCkgPT4ge1xyXG4gICAgcGQuaW5uZXJIVE1MID0gdGQuaW5uZXJIVE1MXHJcbiAgICB0ZC5pbm5lckhUTUwgPSBuZC5pbm5lckhUTUxcclxuICAgIGNvbnN0IGxpc3REYXRlMiA9IG5ldyBEYXRlKClcclxuICAgIGxpc3REYXRlMi5zZXREYXRlKGxpc3REYXRlMi5nZXREYXRlKCkgKyAxICsgZ2V0TGlzdERhdGVPZmZzZXQoKSlcclxuICAgIG5kLmlubmVySFRNTCA9IGRhdGVTdHJpbmcobGlzdERhdGUyKS5yZXBsYWNlKCdUb2RheScsICdOb3cnKVxyXG4gICAgcmV0dXJuIG5kLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcclxuICB9KVxyXG59KVxyXG5cclxuLy8gVGhlIGV2ZW50IGxpc3RlbmVyIGZvciB0aGUgcHJldmlvdXMgZGF0ZSBidXR0b24gaXMgbW9zdGx5IHRoZSBzYW1lLlxyXG5lbGVtQnlJZCgnbGlzdGJlZm9yZScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gIGNvbnN0IHBkID0gZWxlbUJ5SWQoJ2xpc3RwcmV2ZGF0ZScpXHJcbiAgY29uc3QgdGQgPSBlbGVtQnlJZCgnbGlzdG5vd2RhdGUnKVxyXG4gIGNvbnN0IG5kID0gZWxlbUJ5SWQoJ2xpc3RuZXh0ZGF0ZScpXHJcbiAgZGVjcmVtZW50TGlzdERhdGVPZmZzZXQoKVxyXG4gIGRpc3BsYXkoKVxyXG4gIHBkLnN0eWxlLmRpc3BsYXkgPSAnaW5saW5lLWJsb2NrJ1xyXG4gIHJldHVybiBQcm9taXNlLnJhY2UoW1xyXG4gICAgYW5pbWF0ZUVsKHRkLCBbXHJcbiAgICAgIHt0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKC0xMDAlKScsIG9wYWNpdHk6IDF9LFxyXG4gICAgICB7b3BhY2l0eTogMH0sXHJcbiAgICAgIHt0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKDAlKScsIG9wYWNpdHk6IDB9XHJcbiAgICBdLCB7ZHVyYXRpb246IDMwMCwgZWFzaW5nOiAnZWFzZS1vdXQnfSksXHJcbiAgICBhbmltYXRlRWwocGQsIFtcclxuICAgICAge3RyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoLTEwMCUpJywgb3BhY2l0eTogMH0sXHJcbiAgICAgIHtvcGFjaXR5OiAwfSxcclxuICAgICAge3RyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoMCUpJywgb3BhY2l0eTogMX1cclxuICAgIF0sIHtkdXJhdGlvbjogMzAwLCBlYXNpbmc6ICdlYXNlLW91dCd9KVxyXG4gIF0pLnRoZW4oKCkgPT4ge1xyXG4gICAgbmQuaW5uZXJIVE1MID0gdGQuaW5uZXJIVE1MXHJcbiAgICB0ZC5pbm5lckhUTUwgPSBwZC5pbm5lckhUTUxcclxuICAgIGNvbnN0IGxpc3REYXRlMiA9IG5ldyBEYXRlKClcclxuICAgIGxpc3REYXRlMi5zZXREYXRlKChsaXN0RGF0ZTIuZ2V0RGF0ZSgpICsgZ2V0TGlzdERhdGVPZmZzZXQoKSkgLSAxKVxyXG4gICAgcGQuaW5uZXJIVE1MID0gZGF0ZVN0cmluZyhsaXN0RGF0ZTIpLnJlcGxhY2UoJ1RvZGF5JywgJ05vdycpXHJcbiAgICByZXR1cm4gcGQuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xyXG4gIH0pXHJcbn0pXHJcblxyXG4vLyBXaGVuZXZlciBhIGRhdGUgaXMgZG91YmxlIGNsaWNrZWQsIGxvbmcgdGFwcGVkLCBvciBmb3JjZSB0b3VjaGVkLCBsaXN0IHZpZXcgZm9yIHRoYXQgZGF5IGlzIGRpc3BsYXllZC5cclxuZnVuY3Rpb24gdXBkYXRlTGlzdE5hdigpOiB2b2lkIHtcclxuICAgIGNvbnN0IGQgPSBuZXcgRGF0ZSgpXHJcbiAgICBkLnNldERhdGUoKGQuZ2V0RGF0ZSgpICsgZ2V0TGlzdERhdGVPZmZzZXQoKSkgLSAxKVxyXG4gICAgY29uc3QgdXAgPSAoaWQ6IHN0cmluZykgPT4ge1xyXG4gICAgICAgIGVsZW1CeUlkKGlkKS5pbm5lckhUTUwgPSBkYXRlU3RyaW5nKGQpLnJlcGxhY2UoJ1RvZGF5JywgJ05vdycpXHJcbiAgICAgICAgcmV0dXJuIGQuc2V0RGF0ZShkLmdldERhdGUoKSArIDEpXHJcbiAgICB9XHJcbiAgICB1cCgnbGlzdHByZXZkYXRlJylcclxuICAgIHVwKCdsaXN0bm93ZGF0ZScpXHJcbiAgICB1cCgnbGlzdG5leHRkYXRlJylcclxufVxyXG5cclxuZnVuY3Rpb24gc3dpdGNoVG9MaXN0KGV2dDogRXZlbnQpOiB2b2lkIHtcclxuICAgIGlmIChfJGgoZXZ0LnRhcmdldCkuY2xhc3NMaXN0LmNvbnRhaW5zKCdtb250aCcpIHx8IF8kaChldnQudGFyZ2V0KS5jbGFzc0xpc3QuY29udGFpbnMoJ2RhdGUnKSkge1xyXG4gICAgICAgIHNldExpc3REYXRlT2Zmc2V0KHRvRGF0ZU51bShOdW1iZXIoXyRoKF8kaChldnQudGFyZ2V0KS5wYXJlbnROb2RlKS5nZXRBdHRyaWJ1dGUoJ2RhdGEtZGF0ZScpKSkgLSB0b2RheSgpKVxyXG4gICAgICAgIHVwZGF0ZUxpc3ROYXYoKVxyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuc2V0QXR0cmlidXRlKCdkYXRhLXZpZXcnLCAnMScpXHJcbiAgICAgICAgcmV0dXJuIGRpc3BsYXkoKVxyXG4gICAgfVxyXG59XHJcblxyXG5kb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2RibGNsaWNrJywgc3dpdGNoVG9MaXN0KVxyXG5kb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ3dlYmtpdG1vdXNlZm9yY2V1cCcsIHN3aXRjaFRvTGlzdCk7XHJcbigoKSA9PiB7XHJcbiAgICBsZXQgdGFwdGltZXI6IG51bWJlcnxudWxsID0gbnVsbFxyXG4gICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgKGV2dCkgPT4gdGFwdGltZXIgPSBzZXRUaW1lb3V0KCgoKSA9PiBzd2l0Y2hUb0xpc3QoZXZ0KSksIDEwMDApKVxyXG4gICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIChldnQpID0+IHtcclxuICAgICAgICBpZiAodGFwdGltZXIpIGNsZWFyVGltZW91dCh0YXB0aW1lcilcclxuICAgICAgICB0YXB0aW1lciA9IG51bGxcclxuICAgIH0pXHJcbn0pKClcclxuXHJcbi8vIDxhIG5hbWU9XCJzaWRlXCIvPlxyXG4vLyBTaWRlIG1lbnUgYW5kIE5hdmJhclxyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4vL1xyXG4vLyBUaGUgW0hlYWRyb29tIGxpYnJhcnldKGh0dHBzOi8vZ2l0aHViLmNvbS9XaWNreU5pbGxpYW1zL2hlYWRyb29tLmpzKSBpcyB1c2VkIHRvIHNob3cgdGhlIG5hdmJhciB3aGVuIHNjcm9sbGluZyB1cFxyXG5jb25zdCBoZWFkcm9vbSA9IG5ldyBIZWFkcm9vbShfJChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCduYXYnKSksIHtcclxuICB0b2xlcmFuY2U6IDEwLFxyXG4gIG9mZnNldDogNjZcclxufSlcclxuaGVhZHJvb20uaW5pdCgpXHJcblxyXG4vLyBBbHNvLCB0aGUgc2lkZSBtZW51IG5lZWRzIGV2ZW50IGxpc3RlbmVycy5cclxuZWxlbUJ5SWQoJ2NvbGxhcHNlQnV0dG9uJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nXHJcbiAgZWxlbUJ5SWQoJ3NpZGVOYXYnKS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG4gIHJldHVybiBlbGVtQnlJZCgnc2lkZUJhY2tncm91bmQnKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xyXG59KVxyXG5cclxuZWxlbUJ5SWQoJ3NpZGVCYWNrZ3JvdW5kJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgZWxlbUJ5SWQoJ3NpZGVCYWNrZ3JvdW5kJykuc3R5bGUub3BhY2l0eSA9ICcwJ1xyXG4gIGVsZW1CeUlkKCdzaWRlTmF2JykuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcclxuICBlbGVtQnlJZCgnZHJhZ1RhcmdldCcpLnN0eWxlLndpZHRoID0gJydcclxuICByZXR1cm4gc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2F1dG8nXHJcbiAgICBlbGVtQnlJZCgnc2lkZUJhY2tncm91bmQnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXHJcbiAgfVxyXG4gICwgMzUwKVxyXG59KVxyXG5cclxudXBkYXRlQXZhdGFyKClcclxuXHJcbi8vIDxhIG5hbWU9XCJhdGhlbmFcIi8+IEF0aGVuYSAoU2Nob29sb2d5KVxyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS1cclxuLy9cclxuXHJcbi8vIDxhIG5hbWU9XCJzZXR0aW5nc1wiLz4gU2V0dGluZ3NcclxuLy8gLS0tLS0tLS1cclxuLy9cclxuLy8gVGhlIGNvZGUgYmVsb3cgdXBkYXRlcyB0aGUgY3VycmVudCB2ZXJzaW9uIHRleHQgaW4gdGhlIHNldHRpbmdzLiBJIHNob3VsZCd2ZSBwdXQgdGhpcyB1bmRlciB0aGVcclxuLy8gVXBkYXRlcyBzZWN0aW9uLCBidXQgaXQgc2hvdWxkIGdvIGJlZm9yZSB0aGUgZGlzcGxheSgpIGZ1bmN0aW9uIGZvcmNlcyBhIHJlZmxvdy5cclxuZWxlbUJ5SWQoJ3ZlcnNpb24nKS5pbm5lckhUTUwgPSBWRVJTSU9OXHJcblxyXG4vLyBUbyBicmluZyB1cCB0aGUgc2V0dGluZ3Mgd2luZG93cywgYW4gZXZlbnQgbGlzdGVuZXIgbmVlZHMgdG8gYmUgYWRkZWQgdG8gdGhlIGJ1dHRvbi5cclxuZWxlbUJ5SWQoJ3NldHRpbmdzQicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgZWxlbUJ5SWQoJ3NpZGVCYWNrZ3JvdW5kJykuY2xpY2soKVxyXG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdzZXR0aW5nc1Nob3duJylcclxuICAgIGVsZW1CeUlkKCdicmFuZCcpLmlubmVySFRNTCA9ICdTZXR0aW5ncydcclxuICAgIHJldHVybiBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBfJGgoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbWFpbicpKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXHJcbiAgICB9KVxyXG59KVxyXG5cclxuLy8gVGhlIGJhY2sgYnV0dG9uIGFsc28gbmVlZHMgdG8gY2xvc2UgdGhlIHNldHRpbmdzIHdpbmRvdy5cclxuZWxlbUJ5SWQoJ2JhY2tCdXR0b24nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgIF8kaChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdtYWluJykpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXHJcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ3NldHRpbmdzU2hvd24nKVxyXG4gICAgcmV0dXJuIGVsZW1CeUlkKCdicmFuZCcpLmlubmVySFRNTCA9ICdDaGVjayBQQ1InXHJcbn0pXHJcblxyXG4vLyBUaGUgY29kZSBiZWxvdyBpcyB3aGF0IHRoZSBzZXR0aW5ncyBjb250cm9sLlxyXG5pZiAoc2V0dGluZ3Muc2VwVGFza3MpIHtcclxuICAgIGVsZW1CeUlkKCdpbmZvJykuY2xhc3NMaXN0LmFkZCgnaXNUYXNrcycpXHJcbiAgICBlbGVtQnlJZCgnbmV3Jykuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xyXG59XHJcbmlmIChzZXR0aW5ncy5ob2xpZGF5VGhlbWVzKSB7IGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnaG9saWRheVRoZW1lcycpIH1cclxuaWYgKHNldHRpbmdzLnNlcFRhc2tDbGFzcykgeyBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ3NlcFRhc2tDbGFzcycpIH1cclxuaW50ZXJmYWNlIElDb2xvck1hcCB7IFtjbHM6IHN0cmluZ106IHN0cmluZyB9XHJcbmxldCBhc3NpZ25tZW50Q29sb3JzOiBJQ29sb3JNYXAgPSBsb2NhbFN0b3JhZ2VSZWFkKCdhc3NpZ25tZW50Q29sb3JzJywge1xyXG4gICAgY2xhc3N3b3JrOiAnIzY4OWYzOCcsIGhvbWV3b3JrOiAnIzIxOTZmMycsIGxvbmd0ZXJtOiAnI2Y1N2MwMCcsIHRlc3Q6ICcjZjQ0MzM2J1xyXG59KVxyXG5sZXQgY2xhc3NDb2xvcnMgPSBsb2NhbFN0b3JhZ2VSZWFkKCdjbGFzc0NvbG9ycycsICgpID0+IHtcclxuICAgIGNvbnN0IGNjOiBJQ29sb3JNYXAgPSB7fVxyXG4gICAgY29uc3QgZGF0YSA9IGdldERhdGEoKVxyXG4gICAgaWYgKCFkYXRhKSByZXR1cm4gY2NcclxuICAgIGRhdGEuY2xhc3Nlcy5mb3JFYWNoKChjOiBzdHJpbmcpID0+IHtcclxuICAgICAgICBjY1tjXSA9ICcjNjE2MTYxJ1xyXG4gICAgfSlcclxuICAgIHJldHVybiBjY1xyXG59KVxyXG5lbGVtQnlJZChgJHtzZXR0aW5ncy5jb2xvclR5cGV9Q29sb3JzYCkuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgKCkgPT4ge1xyXG4gIGlmIChzZXR0aW5ncy5yZWZyZXNoT25Gb2N1cykgZmV0Y2goKVxyXG59KVxyXG5mdW5jdGlvbiBpbnRlcnZhbFJlZnJlc2goKTogdm9pZCB7XHJcbiAgICBjb25zdCByID0gc2V0dGluZ3MucmVmcmVzaFJhdGVcclxuICAgIGlmIChyID4gMCkge1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmRlYnVnKCdSZWZyZXNoaW5nIGJlY2F1c2Ugb2YgdGltZXInKVxyXG4gICAgICAgICAgICBmZXRjaCgpXHJcbiAgICAgICAgICAgIGludGVydmFsUmVmcmVzaCgpXHJcbiAgICAgICAgfSwgciAqIDYwICogMTAwMClcclxuICAgIH1cclxufVxyXG5pbnRlcnZhbFJlZnJlc2goKVxyXG5cclxuLy8gRm9yIGNob29zaW5nIGNvbG9ycywgdGhlIGNvbG9yIGNob29zaW5nIGJveGVzIG5lZWQgdG8gYmUgaW5pdGlhbGl6ZWQuXHJcbmNvbnN0IHBhbGV0dGU6IElDb2xvck1hcCA9IHtcclxuICAnI2Y0NDMzNic6ICcjQjcxQzFDJyxcclxuICAnI2U5MWU2Myc6ICcjODgwRTRGJyxcclxuICAnIzljMjdiMCc6ICcjNEExNDhDJyxcclxuICAnIzY3M2FiNyc6ICcjMzExQjkyJyxcclxuICAnIzNmNTFiNSc6ICcjMUEyMzdFJyxcclxuICAnIzIxOTZmMyc6ICcjMEQ0N0ExJyxcclxuICAnIzAzYTlmNCc6ICcjMDE1NzlCJyxcclxuICAnIzAwYmNkNCc6ICcjMDA2MDY0JyxcclxuICAnIzAwOTY4OCc6ICcjMDA0RDQwJyxcclxuICAnIzRjYWY1MCc6ICcjMUI1RTIwJyxcclxuICAnIzY4OWYzOCc6ICcjMzM2OTFFJyxcclxuICAnI2FmYjQyYic6ICcjODI3NzE3JyxcclxuICAnI2ZiYzAyZCc6ICcjRjU3RjE3JyxcclxuICAnI2ZmYTAwMCc6ICcjRkY2RjAwJyxcclxuICAnI2Y1N2MwMCc6ICcjRTY1MTAwJyxcclxuICAnI2ZmNTcyMic6ICcjQkYzNjBDJyxcclxuICAnIzc5NTU0OCc6ICcjM0UyNzIzJyxcclxuICAnIzYxNjE2MSc6ICcjMjEyMTIxJ1xyXG59XHJcblxyXG5nZXRDbGFzc2VzKCkuZm9yRWFjaCgoYzogc3RyaW5nKSA9PiB7XHJcbiAgICBjb25zdCBkID0gZWxlbWVudCgnZGl2JywgW10sIGMpXHJcbiAgICBkLnNldEF0dHJpYnV0ZSgnZGF0YS1jb250cm9sJywgYylcclxuICAgIGQuYXBwZW5kQ2hpbGQoZWxlbWVudCgnc3BhbicsIFtdKSlcclxuICAgIGVsZW1CeUlkKCdjbGFzc0NvbG9ycycpLmFwcGVuZENoaWxkKGQpXHJcbn0pXHJcbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jb2xvcnMnKS5mb3JFYWNoKChlKSA9PiB7XHJcbiAgICBlLnF1ZXJ5U2VsZWN0b3JBbGwoJ2RpdicpLmZvckVhY2goKGNvbG9yKSA9PiB7XHJcbiAgICAgICAgY29uc3QgY29udHJvbGxlZENvbG9yID0gY29sb3IuZ2V0QXR0cmlidXRlKCdkYXRhLWNvbnRyb2wnKVxyXG4gICAgICAgIGlmICghY29udHJvbGxlZENvbG9yKSB0aHJvdyBuZXcgRXJyb3IoJ0VsZW1lbnQgaGFzIG5vIGNvbnRyb2xsZWQgY29sb3InKVxyXG5cclxuICAgICAgICBjb25zdCBzcCA9IF8kaChjb2xvci5xdWVyeVNlbGVjdG9yKCdzcGFuJykpXHJcbiAgICAgICAgY29uc3QgbGlzdE5hbWUgPSBlLmdldEF0dHJpYnV0ZSgnaWQnKSA9PT0gJ2NsYXNzQ29sb3JzJyA/ICdjbGFzc0NvbG9ycycgOiAnYXNzaWdubWVudENvbG9ycydcclxuICAgICAgICBjb25zdCBsaXN0U2V0dGVyID0gKHY6IElDb2xvck1hcCkgPT4ge1xyXG4gICAgICAgICAgICBlLmdldEF0dHJpYnV0ZSgnaWQnKSA9PT0gJ2NsYXNzQ29sb3JzJyA/IGNsYXNzQ29sb3JzID0gdiA6IGFzc2lnbm1lbnRDb2xvcnMgPSB2XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGxpc3QgPSBlLmdldEF0dHJpYnV0ZSgnaWQnKSA9PT0gJ2NsYXNzQ29sb3JzJyA/IGNsYXNzQ29sb3JzIDogYXNzaWdubWVudENvbG9yc1xyXG4gICAgICAgIHNwLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGxpc3RbY29udHJvbGxlZENvbG9yXVxyXG4gICAgICAgIE9iamVjdC5rZXlzKHBhbGV0dGUpLmZvckVhY2goKHApID0+IHtcclxuICAgICAgICAgICAgY29uc3QgcGUgPSBlbGVtZW50KCdzcGFuJywgW10pXHJcbiAgICAgICAgICAgIHBlLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHBcclxuICAgICAgICAgICAgaWYgKHAgPT09IGxpc3RbY29udHJvbGxlZENvbG9yXSkge1xyXG4gICAgICAgICAgICAgICAgcGUuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNwLmFwcGVuZENoaWxkKHBlKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgY29uc3QgY3VzdG9tID0gZWxlbWVudCgnc3BhbicsIFsnY3VzdG9tQ29sb3InXSwgYDxhPkN1c3RvbTwvYT4gXFxcclxuICAgIDxpbnB1dCB0eXBlPSd0ZXh0JyBwbGFjZWhvbGRlcj0nV2FzICR7bGlzdFtjb250cm9sbGVkQ29sb3JdfScgLz4gXFxcclxuICAgIDxzcGFuIGNsYXNzPSdjdXN0b21JbmZvJz5Vc2UgYW55IENTUyB2YWxpZCBjb2xvciBuYW1lLCBzdWNoIGFzIFxcXHJcbiAgICA8Y29kZT4jRjQ0MzM2PC9jb2RlPiBvciA8Y29kZT5yZ2IoNjQsIDQzLCAyKTwvY29kZT4gb3IgPGNvZGU+Y3lhbjwvY29kZT48L3NwYW4+IFxcXHJcbiAgICA8YSBjbGFzcz0nY3VzdG9tT2snPlNldDwvYT5gKVxyXG4gICAgICAgIGN1c3RvbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldnQpID0+IGV2dC5zdG9wUHJvcGFnYXRpb24oKSlcclxuICAgICAgICBfJChjdXN0b20ucXVlcnlTZWxlY3RvcignYScpKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldnQpID0+IHtcclxuICAgICAgICAgICAgc3AuY2xhc3NMaXN0LnRvZ2dsZSgnb25DdXN0b20nKVxyXG4gICAgICAgICAgICBldnQuc3RvcFByb3BhZ2F0aW9uKClcclxuICAgICAgICB9KVxyXG4gICAgICAgIHNwLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2dCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoc3AuY2xhc3NMaXN0LmNvbnRhaW5zKCdjaG9vc2UnKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gXyRoKGV2dC50YXJnZXQpXHJcbiAgICAgICAgICAgICAgICBjb25zdCBiZyA9IHRpbnljb2xvcih0YXJnZXQuc3R5bGUuYmFja2dyb3VuZENvbG9yIHx8ICcjMDAwJykudG9IZXhTdHJpbmcoKVxyXG4gICAgICAgICAgICAgICAgbGlzdFtjb250cm9sbGVkQ29sb3JdID0gYmdcclxuICAgICAgICAgICAgICAgIHNwLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGJnXHJcbiAgICAgICAgICAgICAgICBjb25zdCBzZWxlY3RlZCA9IHRhcmdldC5xdWVyeVNlbGVjdG9yKCcuc2VsZWN0ZWQnKVxyXG4gICAgICAgICAgICAgICAgaWYgKHNlbGVjdGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWQuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJylcclxuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZVtsaXN0TmFtZV0gPSBKU09OLnN0cmluZ2lmeShsaXN0KVxyXG4gICAgICAgICAgICAgICAgbGlzdFNldHRlcihsaXN0KVxyXG4gICAgICAgICAgICAgICAgdXBkYXRlQ29sb3JzKClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzcC5jbGFzc0xpc3QudG9nZ2xlKCdjaG9vc2UnKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgXyQoY3VzdG9tLnF1ZXJ5U2VsZWN0b3IoJy5jdXN0b21PaycpKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldnQpID0+IHtcclxuICAgICAgICAgICAgc3AuY2xhc3NMaXN0LnJlbW92ZSgnb25DdXN0b20nKVxyXG4gICAgICAgICAgICBzcC5jbGFzc0xpc3QudG9nZ2xlKCdjaG9vc2UnKVxyXG4gICAgICAgICAgICBjb25zdCBzZWxlY3RlZEVsID0gc3AucXVlcnlTZWxlY3RvcignLnNlbGVjdGVkJylcclxuICAgICAgICAgICAgaWYgKHNlbGVjdGVkRWwgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRFbC5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc3Auc3R5bGUuYmFja2dyb3VuZENvbG9yID0gKGxpc3RbY29udHJvbGxlZENvbG9yXSA9IF8kKGN1c3RvbS5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpKS52YWx1ZSlcclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlW2xpc3ROYW1lXSA9IEpTT04uc3RyaW5naWZ5KGxpc3QpXHJcbiAgICAgICAgICAgIHVwZGF0ZUNvbG9ycygpXHJcbiAgICAgICAgICAgIHJldHVybiBldnQuc3RvcFByb3BhZ2F0aW9uKClcclxuICAgICAgICB9KVxyXG4gICAgfSlcclxufSlcclxuXHJcbi8vIFRoZW4sIGEgZnVuY3Rpb24gdGhhdCB1cGRhdGVzIHRoZSBjb2xvciBwcmVmZXJlbmNlcyBpcyBkZWZpbmVkLlxyXG5mdW5jdGlvbiB1cGRhdGVDb2xvcnMoKTogdm9pZCB7XHJcbiAgICBjb25zdCBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJylcclxuICAgIHN0eWxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKSlcclxuICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpXHJcbiAgICBjb25zdCBzaGVldCA9IF8kKHN0eWxlLnNoZWV0KSBhcyBDU1NTdHlsZVNoZWV0XHJcblxyXG4gICAgY29uc3QgYWRkQ29sb3JSdWxlID0gKHNlbGVjdG9yOiBzdHJpbmcsIGxpZ2h0OiBzdHJpbmcsIGRhcms6IHN0cmluZywgZXh0cmEgPSAnJykgPT4ge1xyXG4gICAgICAgIGNvbnN0IG1peGVkID0gdGlueWNvbG9yLm1peChsaWdodCwgJyMxQjVFMjAnLCA3MCkudG9IZXhTdHJpbmcoKVxyXG4gICAgICAgIHNoZWV0Lmluc2VydFJ1bGUoYCR7ZXh0cmF9LmFzc2lnbm1lbnQke3NlbGVjdG9yfSB7IGJhY2tncm91bmQtY29sb3I6ICR7bGlnaHR9OyB9YCwgMClcclxuICAgICAgICBzaGVldC5pbnNlcnRSdWxlKGAke2V4dHJhfS5hc3NpZ25tZW50JHtzZWxlY3Rvcn0uZG9uZSB7IGJhY2tncm91bmQtY29sb3I6ICR7ZGFya307IH1gLCAwKVxyXG4gICAgICAgIHNoZWV0Lmluc2VydFJ1bGUoYCR7ZXh0cmF9LmFzc2lnbm1lbnQke3NlbGVjdG9yfTo6YmVmb3JlIHsgYmFja2dyb3VuZC1jb2xvcjogJHttaXhlZH07IH1gLCAwKVxyXG4gICAgICAgIHNoZWV0Lmluc2VydFJ1bGUoYCR7ZXh0cmF9LmFzc2lnbm1lbnRJdGVtJHtzZWxlY3Rvcn0+aSB7IGJhY2tncm91bmQtY29sb3I6ICR7bGlnaHR9OyB9YCwgMClcclxuICAgICAgICBzaGVldC5pbnNlcnRSdWxlKGAke2V4dHJhfS5hc3NpZ25tZW50SXRlbSR7c2VsZWN0b3J9LmRvbmU+aSB7IGJhY2tncm91bmQtY29sb3I6ICR7ZGFya307IH1gLCAwKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGNyZWF0ZVBhbGV0dGUgPSAoY29sb3I6IHN0cmluZykgPT4gdGlueWNvbG9yKGNvbG9yKS5kYXJrZW4oMjQpLnRvSGV4U3RyaW5nKClcclxuXHJcbiAgICBpZiAoc2V0dGluZ3MuY29sb3JUeXBlID09PSAnYXNzaWdubWVudCcpIHtcclxuICAgICAgICBPYmplY3QuZW50cmllcyhhc3NpZ25tZW50Q29sb3JzKS5mb3JFYWNoKChbbmFtZSwgY29sb3JdKSA9PiB7XHJcbiAgICAgICAgICAgIGFkZENvbG9yUnVsZShgLiR7bmFtZX1gLCBjb2xvciwgcGFsZXR0ZVtjb2xvcl0gfHwgY3JlYXRlUGFsZXR0ZShjb2xvcikpXHJcbiAgICAgICAgfSlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgT2JqZWN0LmVudHJpZXMoY2xhc3NDb2xvcnMpLmZvckVhY2goKFtuYW1lLCBjb2xvcl0pID0+IHtcclxuICAgICAgICAgICAgYWRkQ29sb3JSdWxlKGBbZGF0YS1jbGFzcz1cXFwiJHtuYW1lfVxcXCJdYCwgY29sb3IsIHBhbGV0dGVbY29sb3JdIHx8IGNyZWF0ZVBhbGV0dGUoY29sb3IpKVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgYWRkQ29sb3JSdWxlKCcudGFzaycsICcjRjVGNUY1JywgJyNFMEUwRTAnKVxyXG4gICAgYWRkQ29sb3JSdWxlKCcudGFzaycsICcjNDI0MjQyJywgJyMyMTIxMjEnLCAnLmRhcmsgJylcclxufVxyXG5cclxuLy8gVGhlIGZ1bmN0aW9uIHRoZW4gbmVlZHMgdG8gYmUgY2FsbGVkLlxyXG51cGRhdGVDb2xvcnMoKVxyXG5cclxuLy8gVGhlIGVsZW1lbnRzIHRoYXQgY29udHJvbCB0aGUgc2V0dGluZ3MgYWxzbyBuZWVkIGV2ZW50IGxpc3RlbmVyc1xyXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc2V0dGluZ3NDb250cm9sJykuZm9yRWFjaCgoZSkgPT4ge1xyXG4gICAgaWYgKCEoZSBpbnN0YW5jZW9mIEhUTUxJbnB1dEVsZW1lbnQpKSByZXR1cm5cclxuICAgIGlmIChlLnR5cGUgPT09ICdjaGVja2JveCcpIHtcclxuICAgICAgICBlLmNoZWNrZWQgPSBnZXRTZXR0aW5nKGUubmFtZSlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZS52YWx1ZSA9IGdldFNldHRpbmcoZS5uYW1lKVxyXG4gICAgfVxyXG4gICAgZS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZXZ0KSA9PiB7XHJcbiAgICAgICAgaWYgKGUudHlwZSA9PT0gJ2NoZWNrYm94Jykge1xyXG4gICAgICAgICAgICBzZXRTZXR0aW5nKGUubmFtZSwgZS5jaGVja2VkKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHNldFNldHRpbmcoZS5uYW1lLCBlLnZhbHVlKVxyXG4gICAgICAgIH1cclxuICAgICAgICBzd2l0Y2ggKGUubmFtZSkge1xyXG4gICAgICAgICAgICBjYXNlICdyZWZyZXNoUmF0ZSc6IHJldHVybiBpbnRlcnZhbFJlZnJlc2goKVxyXG4gICAgICAgICAgICBjYXNlICdlYXJseVRlc3QnOiByZXR1cm4gZGlzcGxheSgpXHJcbiAgICAgICAgICAgIGNhc2UgJ2Fzc2lnbm1lbnRTcGFuJzogcmV0dXJuIGRpc3BsYXkoKVxyXG4gICAgICAgICAgICBjYXNlICdwcm9qZWN0c0luVGVzdFBhbmUnOiByZXR1cm4gZGlzcGxheSgpXHJcbiAgICAgICAgICAgIGNhc2UgJ2hpZGVBc3NpZ25tZW50cyc6IHJldHVybiBkaXNwbGF5KClcclxuICAgICAgICAgICAgY2FzZSAnaG9saWRheVRoZW1lcyc6IHJldHVybiBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC50b2dnbGUoJ2hvbGlkYXlUaGVtZXMnLCBlLmNoZWNrZWQpXHJcbiAgICAgICAgICAgIGNhc2UgJ3NlcFRhc2tDbGFzcyc6IGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnRvZ2dsZSgnc2VwVGFza0NsYXNzJywgZS5jaGVja2VkKTsgcmV0dXJuIGRpc3BsYXkoKVxyXG4gICAgICAgICAgICBjYXNlICdzZXBUYXNrcyc6IHJldHVybiBlbGVtQnlJZCgnc2VwVGFza3NSZWZyZXNoJykuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59KVxyXG5cclxuLy8gVGhpcyBhbHNvIG5lZWRzIHRvIGJlIGRvbmUgZm9yIHJhZGlvIGJ1dHRvbnNcclxuY29uc3QgY29sb3JUeXBlID1cclxuICAgIF8kKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYGlucHV0W25hbWU9XFxcImNvbG9yVHlwZVxcXCJdW3ZhbHVlPVxcXCIke3NldHRpbmdzLmNvbG9yVHlwZX1cXFwiXWApKSBhcyBIVE1MSW5wdXRFbGVtZW50XHJcbmNvbG9yVHlwZS5jaGVja2VkID0gdHJ1ZVxyXG5BcnJheS5mcm9tKGRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKCdjb2xvclR5cGUnKSkuZm9yRWFjaCgoYykgPT4ge1xyXG4gIGMuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGV2dCkgPT4ge1xyXG4gICAgY29uc3QgdiA9IChfJChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdpbnB1dFtuYW1lPVwiY29sb3JUeXBlXCJdOmNoZWNrZWQnKSkgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWVcclxuICAgIGlmICh2ICE9PSAnYXNzaWdubWVudCcgJiYgdiAhPT0gJ2NsYXNzJykgcmV0dXJuXHJcbiAgICBzZXR0aW5ncy5jb2xvclR5cGUgPSB2XHJcbiAgICBpZiAodiA9PT0gJ2NsYXNzJykge1xyXG4gICAgICBlbGVtQnlJZCgnYXNzaWdubWVudENvbG9ycycpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcclxuICAgICAgZWxlbUJ5SWQoJ2NsYXNzQ29sb3JzJykuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGVsZW1CeUlkKCdhc3NpZ25tZW50Q29sb3JzJykuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcclxuICAgICAgZWxlbUJ5SWQoJ2NsYXNzQ29sb3JzJykuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHVwZGF0ZUNvbG9ycygpXHJcbiAgfSlcclxufSlcclxuXHJcbi8vIFRoZSBzYW1lIGdvZXMgZm9yIHRleHRhcmVhcy5cclxuZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgndGV4dGFyZWEnKS5mb3JFYWNoKChlKSA9PiB7XHJcbiAgaWYgKChlLm5hbWUgIT09ICdhdGhlbmFEYXRhUmF3JykgJiYgKGxvY2FsU3RvcmFnZVtlLm5hbWVdICE9IG51bGwpKSB7XHJcbiAgICBlLnZhbHVlID0gbG9jYWxTdG9yYWdlW2UubmFtZV1cclxuICB9XHJcbiAgZS5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIChldnQpID0+IHtcclxuICAgIGxvY2FsU3RvcmFnZVtlLm5hbWVdID0gZS52YWx1ZVxyXG4gICAgaWYgKGUubmFtZSA9PT0gJ2F0aGVuYURhdGFSYXcnKSB7XHJcbiAgICAgIHVwZGF0ZUF0aGVuYURhdGEoZS52YWx1ZSlcclxuICAgIH1cclxuICB9KVxyXG59KVxyXG5cclxuLy8gPGEgbmFtZT1cInN0YXJ0aW5nXCIvPlxyXG4vLyBTdGFydGluZyBldmVyeXRoaW5nXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS1cclxuLy9cclxuLy8gRmluYWxseSEgV2UgYXJlIChhbG1vc3QpIGRvbmUhXHJcbi8vXHJcbi8vIEJlZm9yZSBnZXR0aW5nIHRvIGFueXRoaW5nLCBsZXQncyBwcmludCBvdXQgYSB3ZWxjb21pbmcgbWVzc2FnZSB0byB0aGUgY29uc29sZSFcclxuY29uc29sZS5sb2coJyVjQ2hlY2sgUENSJywgJ2NvbG9yOiAjMDA0MDAwOyBmb250LXNpemU6IDNlbScpXHJcbmNvbnNvbGUubG9nKGAlY1ZlcnNpb24gJHtWRVJTSU9OfSAoQ2hlY2sgYmVsb3cgZm9yIGN1cnJlbnQgdmVyc2lvbilgLCAnZm9udC1zaXplOiAxLjFlbScpXHJcbmNvbnNvbGUubG9nKGBXZWxjb21lIHRvIHRoZSBkZXZlbG9wZXIgY29uc29sZSBmb3IgeW91ciBicm93c2VyISBCZXNpZGVzIGxvb2tpbmcgYXQgdGhlIHNvdXJjZSBjb2RlLCBcXFxyXG55b3UgY2FuIGFsc28gcGxheSBhcm91bmQgd2l0aCBDaGVjayBQQ1IgYnkgZXhlY3V0aW5nIHRoZSBsaW5lcyBiZWxvdzpcclxuJWNcXHRmZXRjaCh0cnVlKSAgICAgICAgICAgICAgICVjLy8gUmVsb2FkcyBhbGwgb2YgeW91ciBhc3NpZ25tZW50cyAodGhlIHRydWUgaXMgZm9yIGZvcmNpbmcgYSByZWxvYWQgaWYgb25lIFxcXHJcbmhhcyBhbHJlYWR5IGJlZW4gdHJpZ2dlcmVkIGluIHRoZSBsYXN0IG1pbnV0ZSlcclxuJWNcXHRkYXRhICAgICAgICAgICAgICAgICAgICAgICVjLy8gRGlzcGxheXMgdGhlIG9iamVjdCB0aGF0IGNvbnRhaW5zIHRoZSBkYXRhIHBhcnNlZCBmcm9tIFBDUidzIGludGVyZmFjZVxyXG4lY1xcdGFjdGl2aXR5ICAgICAgICAgICAgICAgICAgJWMvLyBUaGUgZGF0YSBmb3IgdGhlIGFzc2lnbm1lbnRzIHRoYXQgc2hvdyB1cCBpbiB0aGUgYWN0aXZpdHkgcGFuZVxyXG4lY1xcdGV4dHJhICAgICAgICAgICAgICAgICAgICAgJWMvLyBBbGwgb2YgdGhlIHRhc2tzIHlvdSd2ZSBjcmVhdGVkIGJ5IGNsaWNraW5nIHRoZSArIGJ1dHRvblxyXG4lY1xcdGF0aGVuYURhdGEgICAgICAgICAgICAgICAgJWMvLyBUaGUgZGF0YSBmZXRjaGVkIGZyb20gQXRoZW5hIChpZiB5b3UndmUgcGFzdGVkIHRoZSByYXcgZGF0YSBpbnRvIHNldHRpbmdzKVxyXG4lY1xcdHNuYWNrYmFyKFwiSGVsbG8gV29ybGQhXCIpICAlYy8vIENyZWF0ZXMgYSBzbmFja2JhciBzaG93aW5nIHRoZSBtZXNzYWdlIFwiSGVsbG8gV29ybGQhXCJcclxuJWNcXHRkaXNwbGF5RXJyb3IobmV3IEVycm9yKCkpICVjLy8gRGlzcGxheXMgdGhlIHN0YWNrIHRyYWNlIGZvciBhIHJhbmRvbSBlcnJvciAoSnVzdCBkb24ndCBzdWJtaXQgaXQhKVxyXG4lY1xcdGNsb3NlRXJyb3IoKSAgICAgICAgICAgICAgJWMvLyBDbG9zZXMgdGhhdCBkaWFsb2dgLFxyXG4gICAgICAgICAgICAgICAuLi4oKFtdIGFzIHN0cmluZ1tdKS5jb25jYXQoLi4uQXJyYXkuZnJvbShuZXcgQXJyYXkoOCksICgpID0+IFsnY29sb3I6IGluaXRpYWwnLCAnY29sb3I6IGdyZXknXSkpKSlcclxuY29uc29sZS5sb2coJycpXHJcblxyXG4vLyBUaGUgXCJsYXN0IHVwZGF0ZWRcIiB0ZXh0IGlzIHNldCB0byB0aGUgY29ycmVjdCBkYXRlLlxyXG5jb25zdCB0cmllZExhc3RVcGRhdGUgPSBsb2NhbFN0b3JhZ2VSZWFkKCdsYXN0VXBkYXRlJylcclxuZWxlbUJ5SWQoJ2xhc3RVcGRhdGUnKS5pbm5lckhUTUwgPSB0cmllZExhc3RVcGRhdGUgPyBmb3JtYXRVcGRhdGUodHJpZWRMYXN0VXBkYXRlKSA6ICdOZXZlcidcclxuXHJcbmlmIChsb2NhbFN0b3JhZ2VSZWFkKCdkYXRhJykgIT0gbnVsbCkge1xyXG4gICAgLy8gTm93IGNoZWNrIGlmIHRoZXJlJ3MgYWN0aXZpdHlcclxuICAgIHJlY2VudEFjdGl2aXR5KCkuZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG4gICAgICAgIGFkZEFjdGl2aXR5KGl0ZW1bMF0sIGl0ZW1bMV0sIG5ldyBEYXRlKGl0ZW1bMl0pLCB0cnVlLCBpdGVtWzNdKVxyXG4gICAgfSlcclxuXHJcbiAgICBkaXNwbGF5KClcclxufVxyXG5cclxuZmV0Y2goKVxyXG5cclxuLy8gPGEgbmFtZT1cImV2ZW50c1wiLz5cclxuLy8gRXZlbnRzXHJcbi8vIC0tLS0tLVxyXG4vL1xyXG4vLyBUaGUgZG9jdW1lbnQgYm9keSBuZWVkcyB0byBiZSBlbmFibGVkIGZvciBoYW1tZXIuanMgZXZlbnRzLlxyXG5kZWxldGUgSGFtbWVyLmRlZmF1bHRzLmNzc1Byb3BzLnVzZXJTZWxlY3RcclxuY29uc3QgaGFtbWVydGltZSA9IG5ldyBIYW1tZXIuTWFuYWdlcihkb2N1bWVudC5ib2R5LCB7XHJcbiAgcmVjb2duaXplcnM6IFtcclxuICAgIFtIYW1tZXIuUGFuLCB7ZGlyZWN0aW9uOiBIYW1tZXIuRElSRUNUSU9OX0hPUklaT05UQUx9XVxyXG4gIF1cclxufSlcclxuXHJcbi8vIEZvciB0b3VjaCBkaXNwbGF5cywgaGFtbWVyLmpzIGlzIHVzZWQgdG8gbWFrZSB0aGUgc2lkZSBtZW51IGFwcGVhci9kaXNhcHBlYXIuIFRoZSBjb2RlIGJlbG93IGlzXHJcbi8vIGFkYXB0ZWQgZnJvbSBNYXRlcmlhbGl6ZSdzIGltcGxlbWVudGF0aW9uLlxyXG5sZXQgbWVudU91dCA9IGZhbHNlXHJcbmNvbnN0IGRyYWdUYXJnZXQgPSBuZXcgSGFtbWVyKGVsZW1CeUlkKCdkcmFnVGFyZ2V0JykpXHJcbmRyYWdUYXJnZXQub24oJ3BhbicsIChlKSA9PiB7XHJcbiAgaWYgKGUucG9pbnRlclR5cGUgPT09ICd0b3VjaCcpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgbGV0IHsgeCB9ID0gZS5jZW50ZXJcclxuICAgIGNvbnN0IHsgeSB9ID0gZS5jZW50ZXJcclxuXHJcbiAgICBjb25zdCBzQmtnID0gZWxlbUJ5SWQoJ3NpZGVCYWNrZ3JvdW5kJylcclxuICAgIHNCa2cuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcclxuICAgIHNCa2cuc3R5bGUub3BhY2l0eSA9ICcwJ1xyXG4gICAgZWxlbUJ5SWQoJ3NpZGVOYXYnKS5jbGFzc0xpc3QuYWRkKCdtYW51YWwnKVxyXG5cclxuICAgIC8vIEtlZXAgd2l0aGluIGJvdW5kYXJpZXNcclxuICAgIGlmICh4ID4gMjQwKSB7XHJcbiAgICAgIHggPSAyNDBcclxuICAgIH0gZWxzZSBpZiAoeCA8IDApIHtcclxuICAgICAgeCA9IDBcclxuXHJcbiAgICAgIC8vIExlZnQgRGlyZWN0aW9uXHJcbiAgICAgIGlmICh4IDwgMTIwKSB7XHJcbiAgICAgICAgbWVudU91dCA9IGZhbHNlXHJcbiAgICAgIC8vIFJpZ2h0IERpcmVjdGlvblxyXG4gICAgICB9IGVsc2UgaWYgKHggPj0gMTIwKSB7XHJcbiAgICAgICAgbWVudU91dCA9IHRydWVcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGVsZW1CeUlkKCdzaWRlTmF2Jykuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVgoJHt4IC0gMjQwfXB4KWBcclxuICAgIGNvbnN0IG92ZXJsYXlQZXJjZW50ID0gTWF0aC5taW4oeCAvIDQ4MCwgMC41KVxyXG4gICAgcmV0dXJuIHNCa2cuc3R5bGUub3BhY2l0eSA9IFN0cmluZyhvdmVybGF5UGVyY2VudClcclxuICB9XHJcbn0pXHJcblxyXG5kcmFnVGFyZ2V0Lm9uKCdwYW5lbmQnLCAoZSkgPT4ge1xyXG4gIGlmIChlLnBvaW50ZXJUeXBlID09PSAndG91Y2gnKSB7XHJcbiAgICBsZXQgc2lkZU5hdlxyXG4gICAgY29uc3QgeyB2ZWxvY2l0eVggfSA9IGVcclxuICAgIC8vIElmIHZlbG9jaXR5WCA8PSAwLjMgdGhlbiB0aGUgdXNlciBpcyBmbGluZ2luZyB0aGUgbWVudSBjbG9zZWQgc28gaWdub3JlIG1lbnVPdXRcclxuICAgIGlmICgobWVudU91dCAmJiAodmVsb2NpdHlYIDw9IDAuMykpIHx8ICh2ZWxvY2l0eVggPCAtMC41KSkge1xyXG4gICAgICBzaWRlTmF2ID0gZWxlbUJ5SWQoJ3NpZGVOYXYnKVxyXG4gICAgICBzaWRlTmF2LmNsYXNzTGlzdC5yZW1vdmUoJ21hbnVhbCcpXHJcbiAgICAgIHNpZGVOYXYuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuICAgICAgc2lkZU5hdi5zdHlsZS50cmFuc2Zvcm0gPSAnJ1xyXG4gICAgICBlbGVtQnlJZCgnZHJhZ1RhcmdldCcpLnN0eWxlLndpZHRoID0gJzEwMCUnXHJcblxyXG4gICAgfSBlbHNlIGlmICghbWVudU91dCB8fCAodmVsb2NpdHlYID4gMC4zKSkge1xyXG4gICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2F1dG8nXHJcbiAgICAgIHNpZGVOYXYgPSBlbGVtQnlJZCgnc2lkZU5hdicpXHJcbiAgICAgIHNpZGVOYXYuY2xhc3NMaXN0LnJlbW92ZSgnbWFudWFsJylcclxuICAgICAgc2lkZU5hdi5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gICAgICBzaWRlTmF2LnN0eWxlLnRyYW5zZm9ybSA9ICcnXHJcbiAgICAgIGVsZW1CeUlkKCdzaWRlQmFja2dyb3VuZCcpLnN0eWxlLm9wYWNpdHkgPSAnJ1xyXG4gICAgICBlbGVtQnlJZCgnZHJhZ1RhcmdldCcpLnN0eWxlLndpZHRoID0gJzEwcHgnXHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gZWxlbUJ5SWQoJ3NpZGVCYWNrZ3JvdW5kJykuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xyXG4gICAgICAsIDM1MClcclxuICAgIH1cclxuICB9XHJcbn0pXHJcblxyXG5kcmFnVGFyZ2V0Lm9uKCd0YXAnLCAoZSkgPT4ge1xyXG4gICAgZWxlbUJ5SWQoJ3NpZGVCYWNrZ3JvdW5kJykuY2xpY2soKVxyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbn0pXHJcblxyXG5jb25zdCBkdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkcmFnVGFyZ2V0JylcclxuXHJcbi8vIFRoZSBhY3Rpdml0eSBmaWx0ZXIgYnV0dG9uIGFsc28gbmVlZHMgYW4gZXZlbnQgbGlzdGVuZXIuXHJcbnJpcHBsZShlbGVtQnlJZCgnZmlsdGVyQWN0aXZpdHknKSlcclxuZWxlbUJ5SWQoJ2ZpbHRlckFjdGl2aXR5JykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgZWxlbUJ5SWQoJ2luZm9BY3Rpdml0eScpLmNsYXNzTGlzdC50b2dnbGUoJ2ZpbHRlcicpXHJcbn0pXHJcblxyXG4vLyBBdCB0aGUgc3RhcnQsIGl0IG5lZWRzIHRvIGJlIGNvcnJlY3RseSBwb3B1bGF0ZWRcclxuY29uc3QgYWN0aXZpdHlUeXBlcyA9IHNldHRpbmdzLnNob3duQWN0aXZpdHlcclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZVNlbGVjdE51bSgpOiBzdHJpbmcge1xyXG4gICAgY29uc3QgYyA9IChib29sOiBib29sZWFuKSAgPT4gYm9vbCA/IDEgOiAwXHJcbiAgICBjb25zdCBjb3VudCA9IFN0cmluZyhjKGFjdGl2aXR5VHlwZXMuYWRkKSArIGMoYWN0aXZpdHlUeXBlcy5lZGl0KSArIGMoYWN0aXZpdHlUeXBlcy5kZWxldGUpKVxyXG4gICAgcmV0dXJuIGVsZW1CeUlkKCdzZWxlY3ROdW0nKS5pbm5lckhUTUwgPSBjb3VudFxyXG59XHJcbnVwZGF0ZVNlbGVjdE51bSgpXHJcbk9iamVjdC5lbnRyaWVzKGFjdGl2aXR5VHlwZXMpLmZvckVhY2goKFt0eXBlLCBlbmFibGVkXSkgPT4ge1xyXG4gIGlmICh0eXBlICE9PSAnYWRkJyAmJiB0eXBlICE9PSAnZWRpdCcgJiYgdHlwZSAhPT0gJ2RlbGV0ZScpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBhY3Rpdml0eSB0eXBlICR7dHlwZX1gKVxyXG4gIH1cclxuXHJcbiAgY29uc3Qgc2VsZWN0RWwgPSBlbGVtQnlJZCh0eXBlICsgJ1NlbGVjdCcpIGFzIEhUTUxJbnB1dEVsZW1lbnRcclxuICBzZWxlY3RFbC5jaGVja2VkID0gZW5hYmxlZFxyXG4gIGlmIChlbmFibGVkKSB7IGVsZW1CeUlkKCdpbmZvQWN0aXZpdHknKS5jbGFzc0xpc3QuYWRkKHR5cGUpIH1cclxuICBzZWxlY3RFbC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZXZ0KSA9PiB7XHJcbiAgICBhY3Rpdml0eVR5cGVzW3R5cGVdID0gc2VsZWN0RWwuY2hlY2tlZFxyXG4gICAgZWxlbUJ5SWQoJ2luZm9BY3Rpdml0eScpLnNldEF0dHJpYnV0ZSgnZGF0YS1maWx0ZXJlZCcsIHVwZGF0ZVNlbGVjdE51bSgpKVxyXG4gICAgZWxlbUJ5SWQoJ2luZm9BY3Rpdml0eScpLmNsYXNzTGlzdC50b2dnbGUodHlwZSlcclxuICAgIHNldHRpbmdzLnNob3duQWN0aXZpdHkgPSBhY3Rpdml0eVR5cGVzXHJcbiAgfSlcclxufSlcclxuXHJcbi8vIFRoZSBzaG93IGNvbXBsZXRlZCB0YXNrcyBjaGVja2JveCBpcyBzZXQgY29ycmVjdGx5IGFuZCBpcyBhc3NpZ25lZCBhbiBldmVudCBsaXN0ZW5lci5cclxuY29uc3Qgc2hvd0RvbmVUYXNrc0VsID0gZWxlbUJ5SWQoJ3Nob3dEb25lVGFza3MnKSBhcyBIVE1MSW5wdXRFbGVtZW50XHJcbmlmIChzZXR0aW5ncy5zaG93RG9uZVRhc2tzKSB7XHJcbiAgc2hvd0RvbmVUYXNrc0VsLmNoZWNrZWQgPSB0cnVlXHJcbiAgZWxlbUJ5SWQoJ2luZm9UYXNrc0lubmVyJykuY2xhc3NMaXN0LmFkZCgnc2hvd0RvbmVUYXNrcycpXHJcbn1cclxuc2hvd0RvbmVUYXNrc0VsLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsICgpID0+IHtcclxuICBzZXR0aW5ncy5zaG93RG9uZVRhc2tzID0gc2hvd0RvbmVUYXNrc0VsLmNoZWNrZWRcclxuICBlbGVtQnlJZCgnaW5mb1Rhc2tzSW5uZXInKS5jbGFzc0xpc3QudG9nZ2xlKCdzaG93RG9uZVRhc2tzJywgc2V0dGluZ3Muc2hvd0RvbmVUYXNrcylcclxufSlcclxuXHJcbi8vIDxhIG5hbWU9XCJ1cGRhdGVzXCIvPlxyXG4vLyBVcGRhdGVzIGFuZCBOZXdzXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS1cclxuLy9cclxuXHJcbmlmIChsb2NhdGlvbi5wcm90b2NvbCA9PT0gJ2Nocm9tZS1leHRlbnNpb246JykgeyBjaGVja0NvbW1pdCgpIH1cclxuXHJcbi8vIFRoaXMgdXBkYXRlIGRpYWxvZyBhbHNvIG5lZWRzIHRvIGJlIGNsb3NlZCB3aGVuIHRoZSBidXR0b25zIGFyZSBjbGlja2VkLlxyXG5lbGVtQnlJZCgndXBkYXRlRGVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICBlbGVtQnlJZCgndXBkYXRlJykuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcclxuICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgIGVsZW1CeUlkKCd1cGRhdGVCYWNrZ3JvdW5kJykuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xyXG4gIH0sIDM1MClcclxufSlcclxuXHJcbi8vIEZvciBuZXdzLCB0aGUgbGF0ZXN0IG5ld3MgaXMgZmV0Y2hlZCBmcm9tIGEgR2l0SHViIGdpc3QuXHJcbmZldGNoTmV3cygpXHJcblxyXG4vLyBUaGUgbmV3cyBkaWFsb2cgdGhlbiBuZWVkcyB0byBiZSBjbG9zZWQgd2hlbiBPSyBvciB0aGUgYmFja2dyb3VuZCBpcyBjbGlja2VkLlxyXG5mdW5jdGlvbiBjbG9zZU5ld3MoKTogdm9pZCB7XHJcbiAgZWxlbUJ5SWQoJ25ld3MnKS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgZWxlbUJ5SWQoJ25ld3NCYWNrZ3JvdW5kJykuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xyXG4gIH0sIDM1MClcclxufVxyXG5cclxuZWxlbUJ5SWQoJ25ld3NPaycpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xvc2VOZXdzKVxyXG5lbGVtQnlJZCgnbmV3c0JhY2tncm91bmQnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsb3NlTmV3cylcclxuXHJcbi8vIEl0IGFsc28gbmVlZHMgdG8gYmUgb3BlbmVkIHdoZW4gdGhlIG5ld3MgYnV0dG9uIGlzIGNsaWNrZWQuXHJcbmVsZW1CeUlkKCduZXdzQicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gIGVsZW1CeUlkKCdzaWRlQmFja2dyb3VuZCcpLmNsaWNrKClcclxuICBjb25zdCBkaXNwbGF5TmV3cyA9ICgpID0+IHtcclxuICAgIGVsZW1CeUlkKCduZXdzQmFja2dyb3VuZCcpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXHJcbiAgICByZXR1cm4gZWxlbUJ5SWQoJ25ld3MnKS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG4gIH1cclxuXHJcbiAgaWYgKGVsZW1CeUlkKCduZXdzQ29udGVudCcpLmNoaWxkTm9kZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICBnZXROZXdzKGRpc3BsYXlOZXdzKVxyXG4gIH0gZWxzZSB7XHJcbiAgICBkaXNwbGF5TmV3cygpXHJcbiAgfVxyXG59KVxyXG5cclxuLy8gVGhlIHNhbWUgZ29lcyBmb3IgdGhlIGVycm9yIGRpYWxvZy5cclxuZnVuY3Rpb24gY2xvc2VFcnJvcigpOiB2b2lkIHtcclxuICBlbGVtQnlJZCgnZXJyb3InKS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgZWxlbUJ5SWQoJ2Vycm9yQmFja2dyb3VuZCcpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcclxuICB9LCAzNTApXHJcbn1cclxuXHJcbmVsZW1CeUlkKCdlcnJvck5vJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbG9zZUVycm9yKVxyXG5lbGVtQnlJZCgnZXJyb3JCYWNrZ3JvdW5kJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbG9zZUVycm9yKVxyXG5cclxuLy8gPGEgbmFtZT1cIm5ld1wiLz5cclxuLy8gQWRkaW5nIG5ldyBhc3NpZ25tZW50c1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbi8vXHJcbi8vIFRoZSBldmVudCBsaXN0ZW5lcnMgZm9yIHRoZSBuZXcgYnV0dG9ucyBhcmUgYWRkZWQuXHJcbnJpcHBsZShlbGVtQnlJZCgnbmV3JykpXHJcbnJpcHBsZShlbGVtQnlJZCgnbmV3VGFzaycpKVxyXG5jb25zdCBvbk5ld1Rhc2sgPSAoKSA9PiB7XHJcbiAgdXBkYXRlTmV3VGlwcygoZWxlbUJ5SWQoJ25ld1RleHQnKSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSA9ICcnKVxyXG4gIGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJ1xyXG4gIGVsZW1CeUlkKCduZXdCYWNrZ3JvdW5kJykuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcclxuICBlbGVtQnlJZCgnbmV3RGlhbG9nJykuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuICBlbGVtQnlJZCgnbmV3VGV4dCcpLmZvY3VzKClcclxufVxyXG5lbGVtQnlJZCgnbmV3JykuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG9uTmV3VGFzaylcclxuZWxlbUJ5SWQoJ25ld1Rhc2snKS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgb25OZXdUYXNrKVxyXG5cclxuLy8gQSBmdW5jdGlvbiB0byBjbG9zZSB0aGUgZGlhbG9nIGlzIHRoZW4gZGVmaW5lZC5cclxuZnVuY3Rpb24gY2xvc2VOZXcoKTogdm9pZCB7XHJcbiAgZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICdhdXRvJ1xyXG4gIGVsZW1CeUlkKCduZXdEaWFsb2cnKS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgZWxlbUJ5SWQoJ25ld0JhY2tncm91bmQnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXHJcbiAgfSwgMzUwKVxyXG59XHJcblxyXG4vLyBUaGlzIGZ1bmN0aW9uIGlzIHNldCB0byBiZSBjYWxsZWQgY2FsbGVkIHdoZW4gdGhlIEVTQyBrZXkgaXMgY2FsbGVkIGluc2lkZSBvZiB0aGUgZGlhbG9nLlxyXG5lbGVtQnlJZCgnbmV3VGV4dCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZXZ0KSA9PiB7XHJcbiAgaWYgKGV2dC53aGljaCA9PT0gMjcpIHsgLy8gRXNjYXBlIGtleSBwcmVzc2VkXHJcbiAgICBjbG9zZU5ldygpXHJcbiAgfVxyXG59KVxyXG5cclxuLy8gQW4gZXZlbnQgbGlzdGVuZXIgdG8gY2FsbCB0aGUgZnVuY3Rpb24gaXMgYWxzbyBhZGRlZCB0byB0aGUgWCBidXR0b25cclxuZWxlbUJ5SWQoJ25ld0NhbmNlbCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xvc2VOZXcpXHJcblxyXG4vLyBXaGVuIHRoZSBlbnRlciBrZXkgaXMgcHJlc3NlZCBvciB0aGUgc3VibWl0IGJ1dHRvbiBpcyBjbGlja2VkLCB0aGUgbmV3IGFzc2lnbm1lbnQgaXMgYWRkZWQuXHJcbmVsZW1CeUlkKCduZXdEaWFsb2cnKS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCAoZXZ0KSA9PiB7XHJcbiAgZXZ0LnByZXZlbnREZWZhdWx0KClcclxuICBjb25zdCB0ZXh0ID0gKGVsZW1CeUlkKCduZXdUZXh0JykgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWVcclxuICBjb25zdCB7IGNscywgZHVlLCBzdCB9ID0gcGFyc2VDdXN0b21UYXNrKHRleHQpXHJcbiAgbGV0IGVuZDogJ0ZvcmV2ZXInfG51bWJlciA9ICdGb3JldmVyJ1xyXG5cclxuICBjb25zdCBzdGFydCA9IChzdCAhPSBudWxsKSA/IHRvRGF0ZU51bShjaHJvbm8ucGFyc2VEYXRlKHN0KSkgOiB0b2RheSgpXHJcbiAgaWYgKGR1ZSAhPSBudWxsKSB7XHJcbiAgICBlbmQgPSBzdGFydFxyXG4gICAgaWYgKGVuZCA8IHN0YXJ0KSB7IC8vIEFzc2lnbm1lbnQgZW5kcyBiZWZvcmUgaXQgaXMgYXNzaWduZWRcclxuICAgICAgZW5kICs9IE1hdGguY2VpbCgoc3RhcnQgLSBlbmQpIC8gNykgKiA3XHJcbiAgICB9XHJcbiAgfVxyXG4gIGFkZFRvRXh0cmEoe1xyXG4gICAgYm9keTogdGV4dC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHRleHQuc3Vic3RyKDEpLFxyXG4gICAgZG9uZTogZmFsc2UsXHJcbiAgICBzdGFydCxcclxuICAgIGNsYXNzOiAoY2xzICE9IG51bGwpID8gY2xzLnRvTG93ZXJDYXNlKCkudHJpbSgpIDogbnVsbCxcclxuICAgIGVuZFxyXG4gIH0pXHJcbiAgc2F2ZUV4dHJhKClcclxuICBjbG9zZU5ldygpXHJcbiAgZGlzcGxheShmYWxzZSlcclxufSlcclxuXHJcbnVwZGF0ZU5ld1RpcHMoJycsIGZhbHNlKVxyXG5lbGVtQnlJZCgnbmV3VGV4dCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKCkgPT4ge1xyXG4gIHJldHVybiB1cGRhdGVOZXdUaXBzKChlbGVtQnlJZCgnbmV3VGV4dCcpIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlKVxyXG59KVxyXG5cclxuLy8gVGhlIGNvZGUgYmVsb3cgcmVnaXN0ZXJzIGEgc2VydmljZSB3b3JrZXIgdGhhdCBjYWNoZXMgdGhlIHBhZ2Ugc28gaXQgY2FuIGJlIHZpZXdlZCBvZmZsaW5lLlxyXG5pZiAoJ3NlcnZpY2VXb3JrZXInIGluIG5hdmlnYXRvcikge1xyXG4gIG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLnJlZ2lzdGVyKCcvc2VydmljZS13b3JrZXIuanMnKVxyXG4gICAgLnRoZW4oKHJlZ2lzdHJhdGlvbikgPT5cclxuICAgICAgLy8gUmVnaXN0cmF0aW9uIHdhcyBzdWNjZXNzZnVsXHJcbiAgICAgIGNvbnNvbGUubG9nKCdTZXJ2aWNlV29ya2VyIHJlZ2lzdHJhdGlvbiBzdWNjZXNzZnVsIHdpdGggc2NvcGUnLCByZWdpc3RyYXRpb24uc2NvcGUpKS5jYXRjaCgoZXJyKSA9PlxyXG4gICAgICAvLyByZWdpc3RyYXRpb24gZmFpbGVkIDooXHJcbiAgICAgIGNvbnNvbGUubG9nKCdTZXJ2aWNlV29ya2VyIHJlZ2lzdHJhdGlvbiBmYWlsZWQ6ICcsIGVycilcclxuICApXHJcbn1cclxuXHJcbi8vIElmIHRoZSBzZXJ2aWNlIHdvcmtlciBkZXRlY3RzIHRoYXQgdGhlIHdlYiBhcHAgaGFzIGJlZW4gdXBkYXRlZCwgdGhlIGNvbW1pdCBpcyBmZXRjaGVkIGZyb20gR2l0SHViLlxyXG5uYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgKGV2ZW50KSA9PiB7XHJcbiAgICBjb25zb2xlLmxvZygnR2V0dGluZyBjb21taXQgYmVjYXVzZSBvZiBzZXJ2aWNld29ya2VyJylcclxuICAgIGlmIChldmVudC5kYXRhLmdldENvbW1pdCkgeyByZXR1cm4gY2hlY2tDb21taXQoKSB9XHJcbn0pXHJcbiIsImltcG9ydCB7IGNsYXNzQnlJZCwgZ2V0RGF0YSwgSUFzc2lnbm1lbnQgfSBmcm9tICcuLi9wY3InXHJcbmltcG9ydCB7IEFjdGl2aXR5VHlwZSB9IGZyb20gJy4uL3BsdWdpbnMvYWN0aXZpdHknXHJcbmltcG9ydCB7IGFzc2lnbm1lbnRJbkRvbmUgfSBmcm9tICcuLi9wbHVnaW5zL2RvbmUnXHJcbmltcG9ydCB7IF8kLCBkYXRlU3RyaW5nLCBlbGVtQnlJZCwgZWxlbWVudCwgc21vb3RoU2Nyb2xsIH0gZnJvbSAnLi4vdXRpbCdcclxuaW1wb3J0IHsgc2VwYXJhdGUgfSBmcm9tICcuL2Fzc2lnbm1lbnQnXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYWRkQWN0aXZpdHlFbGVtZW50KGVsOiBIVE1MRWxlbWVudCk6IHZvaWQge1xyXG4gICAgY29uc3QgaW5zZXJ0VG8gPSBlbGVtQnlJZCgnaW5mb0FjdGl2aXR5JylcclxuICAgIGluc2VydFRvLmluc2VydEJlZm9yZShlbCwgaW5zZXJ0VG8ucXVlcnlTZWxlY3RvcignLmFjdGl2aXR5JykpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVBY3Rpdml0eSh0eXBlOiBBY3Rpdml0eVR5cGUsIGFzc2lnbm1lbnQ6IElBc3NpZ25tZW50LCBkYXRlOiBEYXRlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPzogc3RyaW5nICk6IEhUTUxFbGVtZW50IHtcclxuICAgIGNvbnN0IGNuYW1lID0gY2xhc3NOYW1lIHx8IGNsYXNzQnlJZChhc3NpZ25tZW50LmNsYXNzKVxyXG5cclxuICAgIGNvbnN0IHRlID0gZWxlbWVudCgnZGl2JywgWydhY3Rpdml0eScsICdhc3NpZ25tZW50SXRlbScsIGFzc2lnbm1lbnQuYmFzZVR5cGUsIHR5cGVdLCBgXHJcbiAgICAgICAgPGkgY2xhc3M9J21hdGVyaWFsLWljb25zJz4ke3R5cGV9PC9pPlxyXG4gICAgICAgIDxzcGFuIGNsYXNzPSd0aXRsZSc+JHthc3NpZ25tZW50LnRpdGxlfTwvc3Bhbj5cclxuICAgICAgICA8c21hbGw+JHtzZXBhcmF0ZShjbmFtZSlbMl19PC9zbWFsbD5cclxuICAgICAgICA8ZGl2IGNsYXNzPSdyYW5nZSc+JHtkYXRlU3RyaW5nKGRhdGUpfTwvZGl2PmAsIGBhY3Rpdml0eSR7YXNzaWdubWVudC5pZH1gKVxyXG4gICAgdGUuc2V0QXR0cmlidXRlKCdkYXRhLWNsYXNzJywgY25hbWUpXHJcbiAgICBjb25zdCB7IGlkIH0gPSBhc3NpZ25tZW50XHJcbiAgICBpZiAodHlwZSAhPT0gJ2RlbGV0ZScpIHtcclxuICAgICAgICB0ZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgZG9TY3JvbGxpbmcgPSBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBlbCA9IF8kKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYC5hc3NpZ25tZW50W2lkKj1cXFwiJHtpZH1cXFwiXWApKSBhcyBIVE1MRWxlbWVudFxyXG4gICAgICAgICAgICAgICAgYXdhaXQgc21vb3RoU2Nyb2xsKChlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgKyBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCkgLSAxMTYpXHJcbiAgICAgICAgICAgICAgICBlbC5jbGljaygpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGRvY3VtZW50LmJvZHkuZ2V0QXR0cmlidXRlKCdkYXRhLXZpZXcnKSA9PT0gJzAnKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBkb1Njcm9sbGluZygpXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAoXyQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI25hdlRhYnM+bGk6Zmlyc3QtY2hpbGQnKSkgYXMgSFRNTEVsZW1lbnQpLmNsaWNrKClcclxuICAgICAgICAgICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGRvU2Nyb2xsaW5nLCA1MDApXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChhc3NpZ25tZW50SW5Eb25lKGFzc2lnbm1lbnQuaWQpKSB7XHJcbiAgICAgIHRlLmNsYXNzTGlzdC5hZGQoJ2RvbmUnKVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRlXHJcbn1cclxuIiwiaW1wb3J0IHsgZnJvbURhdGVOdW0sIHRvZGF5IH0gZnJvbSAnLi4vZGF0ZXMnXHJcbmltcG9ydCB7IGRpc3BsYXksIGdldFRpbWVBZnRlciwgSVNwbGl0QXNzaWdubWVudCB9IGZyb20gJy4uL2Rpc3BsYXknXHJcbmltcG9ydCB7IGdldExpc3REYXRlT2Zmc2V0IH0gZnJvbSAnLi4vbmF2aWdhdGlvbidcclxuaW1wb3J0IHsgZ2V0QXR0YWNobWVudE1pbWVUeXBlLCBJQXBwbGljYXRpb25EYXRhLCBJQXNzaWdubWVudCwgdXJsRm9yQXR0YWNobWVudCB9IGZyb20gJy4uL3BjcidcclxuaW1wb3J0IHsgcmVjZW50QWN0aXZpdHkgfSBmcm9tICcuLi9wbHVnaW5zL2FjdGl2aXR5J1xyXG5pbXBvcnQgeyBnZXRBdGhlbmFEYXRhIH0gZnJvbSAnLi4vcGx1Z2lucy9hdGhlbmEnXHJcbmltcG9ydCB7IHJlbW92ZUZyb21FeHRyYSwgc2F2ZUV4dHJhIH0gZnJvbSAnLi4vcGx1Z2lucy9jdXN0b21Bc3NpZ25tZW50cydcclxuaW1wb3J0IHsgYWRkVG9Eb25lLCBhc3NpZ25tZW50SW5Eb25lLCByZW1vdmVGcm9tRG9uZSwgc2F2ZURvbmUgfSBmcm9tICcuLi9wbHVnaW5zL2RvbmUnXHJcbmltcG9ydCB7IG1vZGlmaWVkQm9keSwgcmVtb3ZlRnJvbU1vZGlmaWVkLCBzYXZlTW9kaWZpZWQsIHNldE1vZGlmaWVkIH0gZnJvbSAnLi4vcGx1Z2lucy9tb2RpZmllZEFzc2lnbm1lbnRzJ1xyXG5pbXBvcnQgeyBzZXR0aW5ncyB9IGZyb20gJy4uL3NldHRpbmdzJ1xyXG5pbXBvcnQgeyBfJCwgY3NzTnVtYmVyLCBkYXRlU3RyaW5nLCBlbGVtQnlJZCwgZWxlbWVudCwgZm9yY2VMYXlvdXQsIHJpcHBsZSB9IGZyb20gJy4uL3V0aWwnXHJcbmltcG9ydCB7IHJlc2l6ZSB9IGZyb20gJy4vcmVzaXplcidcclxuXHJcbmNvbnN0IG1pbWVUeXBlczogeyBbbWltZTogc3RyaW5nXTogW3N0cmluZywgc3RyaW5nXSB9ID0ge1xyXG4gICAgJ2FwcGxpY2F0aW9uL21zd29yZCc6IFsnV29yZCBEb2MnLCAnZG9jdW1lbnQnXSxcclxuICAgICdhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQud29yZHByb2Nlc3NpbmdtbC5kb2N1bWVudCc6IFsnV29yZCBEb2MnLCAnZG9jdW1lbnQnXSxcclxuICAgICdhcHBsaWNhdGlvbi92bmQubXMtcG93ZXJwb2ludCc6IFsnUFBUIFByZXNlbnRhdGlvbicsICdzbGlkZXMnXSxcclxuICAgICdhcHBsaWNhdGlvbi9wZGYnOiBbJ1BERiBGaWxlJywgJ3BkZiddLFxyXG4gICAgJ3RleHQvcGxhaW4nOiBbJ1RleHQgRG9jJywgJ3BsYWluJ11cclxufVxyXG5cclxuY29uc3QgZG1wID0gbmV3IGRpZmZfbWF0Y2hfcGF0Y2goKSAvLyBGb3IgZGlmZmluZ1xyXG5cclxuZnVuY3Rpb24gcG9wdWxhdGVBZGRlZERlbGV0ZWQoZGlmZnM6IGFueVtdLCBlZGl0czogSFRNTEVsZW1lbnQpOiBib29sZWFuIHtcclxuICAgIGxldCBhZGRlZCA9IDBcclxuICAgIGxldCBkZWxldGVkID0gMFxyXG4gICAgZGlmZnMuZm9yRWFjaCgoZGlmZikgPT4ge1xyXG4gICAgICAgIGlmIChkaWZmWzBdID09PSAxKSB7IGFkZGVkKysgfVxyXG4gICAgICAgIGlmIChkaWZmWzBdID09PSAtMSkgeyBkZWxldGVkKysgfVxyXG4gICAgfSlcclxuICAgIF8kKGVkaXRzLnF1ZXJ5U2VsZWN0b3IoJy5hZGRpdGlvbnMnKSkuaW5uZXJIVE1MID0gYWRkZWQgIT09IDAgPyBgKyR7YWRkZWR9YCA6ICcnXHJcbiAgICBfJChlZGl0cy5xdWVyeVNlbGVjdG9yKCcuZGVsZXRpb25zJykpLmlubmVySFRNTCA9IGRlbGV0ZWQgIT09IDAgPyBgLSR7ZGVsZXRlZH1gIDogJydcclxuICAgIGVkaXRzLmNsYXNzTGlzdC5hZGQoJ25vdEVtcHR5JylcclxuICAgIHJldHVybiBhZGRlZCA+IDAgfHwgZGVsZXRlZCA+IDBcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNvbXB1dGVXZWVrSWQoc3BsaXQ6IElTcGxpdEFzc2lnbm1lbnQpOiBzdHJpbmcge1xyXG4gICAgY29uc3Qgc3RhcnRTdW4gPSBuZXcgRGF0ZShzcGxpdC5zdGFydC5nZXRUaW1lKCkpXHJcbiAgICBzdGFydFN1bi5zZXREYXRlKHN0YXJ0U3VuLmdldERhdGUoKSAtIHN0YXJ0U3VuLmdldERheSgpKVxyXG4gICAgcmV0dXJuIGB3ayR7c3RhcnRTdW4uZ2V0TW9udGgoKX0tJHtzdGFydFN1bi5nZXREYXRlKCl9YFxyXG59XHJcblxyXG4vLyBUaGlzIGZ1bmN0aW9uIHNlcGFyYXRlcyB0aGUgcGFydHMgb2YgYSBjbGFzcyBuYW1lLlxyXG5leHBvcnQgZnVuY3Rpb24gc2VwYXJhdGUoY2w6IHN0cmluZyk6IFJlZ0V4cE1hdGNoQXJyYXkge1xyXG4gICAgY29uc3QgbSA9IGNsLm1hdGNoKC8oKD86XFxkKlxccyspPyg/Oig/Omhvblxcdyp8KD86YWR2XFx3KlxccyopP2NvcmUpXFxzKyk/KSguKikvaSlcclxuICAgIGlmIChtID09IG51bGwpIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IHNlcGFyYXRlIGNsYXNzIHN0cmluZyAke2NsfWApXHJcbiAgICByZXR1cm4gbVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYXNzaWdubWVudENsYXNzKGFzc2lnbm1lbnQ6IElBc3NpZ25tZW50LCBkYXRhOiBJQXBwbGljYXRpb25EYXRhKTogc3RyaW5nIHtcclxuICAgIGNvbnN0IGNscyA9IChhc3NpZ25tZW50LmNsYXNzICE9IG51bGwpID8gZGF0YS5jbGFzc2VzW2Fzc2lnbm1lbnQuY2xhc3NdIDogJ1Rhc2snXHJcbiAgICBpZiAoY2xzID09IG51bGwpIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGZpbmQgY2xhc3MgJHthc3NpZ25tZW50LmNsYXNzfSBpbiAke2RhdGEuY2xhc3Nlc31gKVxyXG4gICAgcmV0dXJuIGNsc1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2VwYXJhdGVkQ2xhc3MoYXNzaWdubWVudDogSUFzc2lnbm1lbnQsIGRhdGE6IElBcHBsaWNhdGlvbkRhdGEpOiBSZWdFeHBNYXRjaEFycmF5IHtcclxuICAgIHJldHVybiBzZXBhcmF0ZShhc3NpZ25tZW50Q2xhc3MoYXNzaWdubWVudCwgZGF0YSkpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVBc3NpZ25tZW50KHNwbGl0OiBJU3BsaXRBc3NpZ25tZW50LCBkYXRhOiBJQXBwbGljYXRpb25EYXRhKTogSFRNTEVsZW1lbnQge1xyXG4gICAgY29uc3QgeyBhc3NpZ25tZW50LCByZWZlcmVuY2UgfSA9IHNwbGl0XHJcblxyXG4gICAgLy8gU2VwYXJhdGUgdGhlIGNsYXNzIGRlc2NyaXB0aW9uIGZyb20gdGhlIGFjdHVhbCBjbGFzc1xyXG4gICAgY29uc3Qgc2VwYXJhdGVkID0gc2VwYXJhdGVkQ2xhc3MoYXNzaWdubWVudCwgZGF0YSlcclxuXHJcbiAgICBjb25zdCB3ZWVrSWQgPSBjb21wdXRlV2Vla0lkKHNwbGl0KVxyXG5cclxuICAgIGxldCBzbWFsbFRhZyA9ICdzbWFsbCdcclxuICAgIGxldCBsaW5rID0gbnVsbFxyXG4gICAgY29uc3QgYXRoZW5hRGF0YSA9IGdldEF0aGVuYURhdGEoKVxyXG4gICAgaWYgKGF0aGVuYURhdGEgJiYgYXNzaWdubWVudC5jbGFzcyAhPSBudWxsICYmIChhdGhlbmFEYXRhW2RhdGEuY2xhc3Nlc1thc3NpZ25tZW50LmNsYXNzXV0gIT0gbnVsbCkpIHtcclxuICAgICAgICBsaW5rID0gYXRoZW5hRGF0YVtkYXRhLmNsYXNzZXNbYXNzaWdubWVudC5jbGFzc11dLmxpbmtcclxuICAgICAgICBzbWFsbFRhZyA9ICdhJ1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGUgPSBlbGVtZW50KCdkaXYnLCBbJ2Fzc2lnbm1lbnQnLCBhc3NpZ25tZW50LmJhc2VUeXBlLCAnYW5pbSddLFxyXG4gICAgICAgICAgICAgICAgICAgICAgYDwke3NtYWxsVGFnfSR7bGluayA/IGAgaHJlZj0nJHtsaW5rfScgY2xhc3M9J2xpbmtlZCcgdGFyZ2V0PSdfYmxhbmsnYCA6ICcnfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9J2V4dHJhJz4ke3NlcGFyYXRlZFsxXX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICR7c2VwYXJhdGVkWzJdfVxyXG4gICAgICAgICAgICAgICAgICAgICAgIDwvJHtzbWFsbFRhZ30+PHNwYW4gY2xhc3M9J3RpdGxlJz4ke2Fzc2lnbm1lbnQudGl0bGV9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPSdoaWRkZW4nIGNsYXNzPSdkdWUnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPScke2Fzc2lnbm1lbnQuZW5kID09PSAnRm9yZXZlcicgPyAwIDogYXNzaWdubWVudC5lbmR9JyAvPmAsXHJcbiAgICAgICAgICAgICAgICAgICAgICBhc3NpZ25tZW50LmlkICsgd2Vla0lkKVxyXG5cclxuICAgIGlmICgoIHJlZmVyZW5jZSAmJiByZWZlcmVuY2UuZG9uZSkgfHwgYXNzaWdubWVudEluRG9uZShhc3NpZ25tZW50LmlkKSkge1xyXG4gICAgICAgIGUuY2xhc3NMaXN0LmFkZCgnZG9uZScpXHJcbiAgICB9XHJcbiAgICBlLnNldEF0dHJpYnV0ZSgnZGF0YS1jbGFzcycsIGFzc2lnbm1lbnRDbGFzcyhhc3NpZ25tZW50LCBkYXRhKSlcclxuICAgIGNvbnN0IGNsb3NlID0gZWxlbWVudCgnYScsIFsnY2xvc2UnLCAnbWF0ZXJpYWwtaWNvbnMnXSwgJ2Nsb3NlJylcclxuICAgIGNsb3NlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xvc2VPcGVuZWQpXHJcbiAgICBlLmFwcGVuZENoaWxkKGNsb3NlKVxyXG5cclxuICAgIC8vIFByZXZlbnQgY2xpY2tpbmcgdGhlIGNsYXNzIG5hbWUgd2hlbiBhbiBpdGVtIGlzIGRpc3BsYXllZCBvbiB0aGUgY2FsZW5kYXIgZnJvbSBkb2luZyBhbnl0aGluZ1xyXG4gICAgaWYgKGxpbmsgIT0gbnVsbCkge1xyXG4gICAgICAgIF8kKGUucXVlcnlTZWxlY3RvcignYScpKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldnQpID0+IHtcclxuICAgICAgICAgICAgaWYgKChkb2N1bWVudC5ib2R5LmdldEF0dHJpYnV0ZSgnZGF0YS12aWV3JykgPT09ICcwJykgJiYgIWUuY2xhc3NMaXN0LmNvbnRhaW5zKCdmdWxsJykpIHtcclxuICAgICAgICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGNvbXBsZXRlID0gZWxlbWVudCgnYScsIFsnY29tcGxldGUnLCAnbWF0ZXJpYWwtaWNvbnMnLCAnd2F2ZXMnXSwgJ2RvbmUnKVxyXG4gICAgcmlwcGxlKGNvbXBsZXRlKVxyXG4gICAgY29uc3QgaWQgPSBzcGxpdC5hc3NpZ25tZW50LmlkXHJcbiAgICBjb21wbGV0ZS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgKGV2dCkgPT4ge1xyXG4gICAgICAgIGlmIChldnQud2hpY2ggPT09IDEpIHsgLy8gTGVmdCBidXR0b25cclxuICAgICAgICAgICAgbGV0IGFkZGVkID0gdHJ1ZVxyXG4gICAgICAgICAgICBpZiAocmVmZXJlbmNlICE9IG51bGwpIHsgLy8gVGFzayBpdGVtXHJcbiAgICAgICAgICAgICAgICBpZiAoZS5jbGFzc0xpc3QuY29udGFpbnMoJ2RvbmUnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlZmVyZW5jZS5kb25lID0gZmFsc2VcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWRkZWQgPSBmYWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHJlZmVyZW5jZS5kb25lID0gdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgc2F2ZUV4dHJhKClcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChlLmNsYXNzTGlzdC5jb250YWlucygnZG9uZScpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVtb3ZlRnJvbURvbmUoYXNzaWdubWVudC5pZClcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWRkZWQgPSBmYWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIGFkZFRvRG9uZShhc3NpZ25tZW50LmlkKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgc2F2ZURvbmUoKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5ib2R5LmdldEF0dHJpYnV0ZSgnZGF0YS12aWV3JykgPT09ICcxJykge1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXHJcbiAgICAgICAgICAgICAgICAgICAgYC5hc3NpZ25tZW50W2lkXj1cXFwiJHtpZH1cXFwiXSwgI3Rlc3Qke2lkfSwgI2FjdGl2aXR5JHtpZH0sICNpYSR7aWR9YFxyXG4gICAgICAgICAgICAgICAgKS5mb3JFYWNoKChlbGVtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbS5jbGFzc0xpc3QudG9nZ2xlKCdkb25lJylcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICBpZiAoYWRkZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmFzc2lnbm1lbnQubGlzdERpc3A6bm90KC5kb25lKScpLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ25vTGlzdCcpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmFzc2lnbm1lbnQubGlzdERpc3A6bm90KC5kb25lKScpLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ25vTGlzdCcpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmVzaXplKClcclxuICAgICAgICAgICAgfSwgMTAwKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXHJcbiAgICAgICAgICAgICAgICBgLmFzc2lnbm1lbnRbaWRePVxcXCIke2lkfVxcXCJdLCAjdGVzdCR7aWR9LCAjYWN0aXZpdHkke2lkfSwgI2lhJHtpZH1gXHJcbiAgICAgICAgICAgICkuZm9yRWFjaCgoZWxlbSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZWxlbS5jbGFzc0xpc3QudG9nZ2xlKCdkb25lJylcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgaWYgKGFkZGVkKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmFzc2lnbm1lbnQubGlzdERpc3A6bm90KC5kb25lKScpLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnbm9MaXN0JylcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYXNzaWdubWVudC5saXN0RGlzcDpub3QoLmRvbmUpJykubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdub0xpc3QnKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICAgZS5hcHBlbmRDaGlsZChjb21wbGV0ZSlcclxuXHJcbiAgICAvLyBJZiB0aGUgYXNzaWdubWVudCBpcyBhIGN1c3RvbSBvbmUsIGFkZCBhIGJ1dHRvbiB0byBkZWxldGUgaXRcclxuICAgIGlmIChzcGxpdC5jdXN0b20pIHtcclxuICAgICAgICBjb25zdCBkZWxldGVBID0gZWxlbWVudCgnYScsIFsnbWF0ZXJpYWwtaWNvbnMnLCAnZGVsZXRlQXNzaWdubWVudCcsICd3YXZlcyddLCAnZGVsZXRlJylcclxuICAgICAgICByaXBwbGUoZGVsZXRlQSlcclxuICAgICAgICBkZWxldGVBLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCAoZXZ0KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChldnQud2hpY2ggIT09IDEgfHwgIXJlZmVyZW5jZSkgcmV0dXJuXHJcbiAgICAgICAgICAgIHJlbW92ZUZyb21FeHRyYShyZWZlcmVuY2UpXHJcbiAgICAgICAgICAgIHNhdmVFeHRyYSgpXHJcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZnVsbCcpICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnYXV0bydcclxuICAgICAgICAgICAgICAgIGNvbnN0IGJhY2sgPSBlbGVtQnlJZCgnYmFja2dyb3VuZCcpXHJcbiAgICAgICAgICAgICAgICBiYWNrLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBiYWNrLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcclxuICAgICAgICAgICAgICAgIH0sIDM1MClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlLnJlbW92ZSgpXHJcbiAgICAgICAgICAgIGRpc3BsYXkoZmFsc2UpXHJcbiAgICAgICAgfSlcclxuICAgICAgICBlLmFwcGVuZENoaWxkKGRlbGV0ZUEpXHJcbiAgICB9XHJcblxyXG4gICAgLy8gTW9kaWZpY2F0aW9uIGJ1dHRvblxyXG4gICAgY29uc3QgZWRpdCA9IGVsZW1lbnQoJ2EnLCBbJ2VkaXRBc3NpZ25tZW50JywgJ21hdGVyaWFsLWljb25zJywgJ3dhdmVzJ10sICdlZGl0JylcclxuICAgIGVkaXQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIChldnQpID0+IHtcclxuICAgICAgICBpZiAoZXZ0LndoaWNoID09PSAxKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlbW92ZSA9IGVkaXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKVxyXG4gICAgICAgICAgICBlZGl0LmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScpXHJcbiAgICAgICAgICAgIF8kKGUucXVlcnlTZWxlY3RvcignLmJvZHknKSkuc2V0QXR0cmlidXRlKCdjb250ZW50RWRpdGFibGUnLCByZW1vdmUgPyAnZmFsc2UnIDogJ3RydWUnKVxyXG4gICAgICAgICAgICBpZiAoIXJlbW92ZSkge1xyXG4gICAgICAgICAgICAgICAgKGUucXVlcnlTZWxlY3RvcignLmJvZHknKSBhcyBIVE1MRWxlbWVudCkuZm9jdXMoKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGRuID0gZS5xdWVyeVNlbGVjdG9yKCcuY29tcGxldGUnKSBhcyBIVE1MRWxlbWVudFxyXG4gICAgICAgICAgICBkbi5zdHlsZS5kaXNwbGF5ID0gcmVtb3ZlID8gJ2Jsb2NrJyA6ICdub25lJ1xyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbiAgICByaXBwbGUoZWRpdClcclxuXHJcbiAgICBlLmFwcGVuZENoaWxkKGVkaXQpXHJcblxyXG4gICAgY29uc3Qgc3RhcnQgPSBuZXcgRGF0ZShmcm9tRGF0ZU51bShhc3NpZ25tZW50LnN0YXJ0KSlcclxuICAgIGNvbnN0IGVuZCA9IGFzc2lnbm1lbnQuZW5kID09PSAnRm9yZXZlcicgPyBhc3NpZ25tZW50LmVuZCA6IG5ldyBEYXRlKGZyb21EYXRlTnVtKGFzc2lnbm1lbnQuZW5kKSlcclxuICAgIGNvbnN0IHRpbWVzID0gZWxlbWVudCgnZGl2JywgJ3JhbmdlJyxcclxuICAgICAgICBhc3NpZ25tZW50LnN0YXJ0ID09PSBhc3NpZ25tZW50LmVuZCA/IGRhdGVTdHJpbmcoc3RhcnQpIDogYCR7ZGF0ZVN0cmluZyhzdGFydCl9ICZuZGFzaDsgJHtkYXRlU3RyaW5nKGVuZCl9YClcclxuICAgIGUuYXBwZW5kQ2hpbGQodGltZXMpXHJcbiAgICBpZiAoYXNzaWdubWVudC5hdHRhY2htZW50cy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgY29uc3QgYXR0YWNobWVudHMgPSBlbGVtZW50KCdkaXYnLCAnYXR0YWNobWVudHMnKVxyXG4gICAgICAgIGFzc2lnbm1lbnQuYXR0YWNobWVudHMuZm9yRWFjaCgoYXR0YWNobWVudCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBhID0gZWxlbWVudCgnYScsIFtdLCBhdHRhY2htZW50WzBdKSBhcyBIVE1MQW5jaG9yRWxlbWVudFxyXG4gICAgICAgICAgICBhLmhyZWYgPSB1cmxGb3JBdHRhY2htZW50KGF0dGFjaG1lbnRbMV0pXHJcbiAgICAgICAgICAgIGdldEF0dGFjaG1lbnRNaW1lVHlwZShhdHRhY2htZW50WzFdKS50aGVuKCh0eXBlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc3BhblxyXG4gICAgICAgICAgICAgICAgaWYgKG1pbWVUeXBlc1t0eXBlXSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYS5jbGFzc0xpc3QuYWRkKG1pbWVUeXBlc1t0eXBlXVsxXSlcclxuICAgICAgICAgICAgICAgICAgICBzcGFuID0gZWxlbWVudCgnc3BhbicsIFtdLCBtaW1lVHlwZXNbdHlwZV1bMF0pXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHNwYW4gPSBlbGVtZW50KCdzcGFuJywgW10sICdVbmtub3duIGZpbGUgdHlwZScpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBhLmFwcGVuZENoaWxkKHNwYW4pXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIGF0dGFjaG1lbnRzLmFwcGVuZENoaWxkKGEpXHJcbiAgICAgICAgfSlcclxuICAgICAgICBlLmFwcGVuZENoaWxkKGF0dGFjaG1lbnRzKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGJvZHkgPSBlbGVtZW50KCdkaXYnLCAnYm9keScsXHJcbiAgICAgICAgYXNzaWdubWVudC5ib2R5LnJlcGxhY2UoL2ZvbnQtZmFtaWx5OlteO10qPyg/OlRpbWVzIE5ldyBSb21hbnxzZXJpZilbXjtdKi9nLCAnJykpXHJcbiAgICBjb25zdCBlZGl0cyA9IGVsZW1lbnQoJ2RpdicsICdlZGl0cycsICc8c3BhbiBjbGFzcz1cXCdhZGRpdGlvbnNcXCc+PC9zcGFuPjxzcGFuIGNsYXNzPVxcJ2RlbGV0aW9uc1xcJz48L3NwYW4+JylcclxuICAgIGNvbnN0IG0gPSBtb2RpZmllZEJvZHkoYXNzaWdubWVudC5pZClcclxuICAgIGlmIChtICE9IG51bGwpIHtcclxuICAgICAgICBjb25zdCBkID0gZG1wLmRpZmZfbWFpbihhc3NpZ25tZW50LmJvZHksIG0pXHJcbiAgICAgICAgZG1wLmRpZmZfY2xlYW51cFNlbWFudGljKGQpXHJcbiAgICAgICAgaWYgKGQubGVuZ3RoICE9PSAwKSB7IC8vIEhhcyBiZWVuIGVkaXRlZFxyXG4gICAgICAgICAgICBwb3B1bGF0ZUFkZGVkRGVsZXRlZChkLCBlZGl0cylcclxuICAgICAgICAgICAgYm9keS5pbm5lckhUTUwgPSBtXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGJvZHkuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoZXZ0KSA9PiB7XHJcbiAgICAgICAgaWYgKHJlZmVyZW5jZSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHJlZmVyZW5jZS5ib2R5ID0gYm9keS5pbm5lckhUTUxcclxuICAgICAgICAgICAgc2F2ZUV4dHJhKClcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBzZXRNb2RpZmllZChhc3NpZ25tZW50LmlkLCAgYm9keS5pbm5lckhUTUwpXHJcbiAgICAgICAgICAgIHNhdmVNb2RpZmllZCgpXHJcbiAgICAgICAgICAgIGNvbnN0IGQgPSBkbXAuZGlmZl9tYWluKGFzc2lnbm1lbnQuYm9keSwgYm9keS5pbm5lckhUTUwpXHJcbiAgICAgICAgICAgIGRtcC5kaWZmX2NsZWFudXBTZW1hbnRpYyhkKVxyXG4gICAgICAgICAgICBpZiAocG9wdWxhdGVBZGRlZERlbGV0ZWQoZCwgZWRpdHMpKSB7XHJcbiAgICAgICAgICAgICAgICBlZGl0cy5jbGFzc0xpc3QuYWRkKCdub3RFbXB0eScpXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBlZGl0cy5jbGFzc0xpc3QucmVtb3ZlKCdub3RFbXB0eScpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGRvY3VtZW50LmJvZHkuZ2V0QXR0cmlidXRlKCdkYXRhLXZpZXcnKSA9PT0gJzEnKSByZXNpemUoKVxyXG4gICAgfSlcclxuXHJcbiAgICBlLmFwcGVuZENoaWxkKGJvZHkpXHJcblxyXG4gICAgY29uc3QgcmVzdG9yZSA9IGVsZW1lbnQoJ2EnLCBbJ21hdGVyaWFsLWljb25zJywgJ3Jlc3RvcmUnXSwgJ3NldHRpbmdzX2JhY2t1cF9yZXN0b3JlJylcclxuICAgIHJlc3RvcmUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgcmVtb3ZlRnJvbU1vZGlmaWVkKGFzc2lnbm1lbnQuaWQpXHJcbiAgICAgICAgc2F2ZU1vZGlmaWVkKClcclxuICAgICAgICBib2R5LmlubmVySFRNTCA9IGFzc2lnbm1lbnQuYm9keVxyXG4gICAgICAgIGVkaXRzLmNsYXNzTGlzdC5yZW1vdmUoJ25vdEVtcHR5JylcclxuICAgICAgICBpZiAoZG9jdW1lbnQuYm9keS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmlldycpID09PSAnMScpICByZXNpemUoKVxyXG4gICAgfSlcclxuICAgIGVkaXRzLmFwcGVuZENoaWxkKHJlc3RvcmUpXHJcbiAgICBlLmFwcGVuZENoaWxkKGVkaXRzKVxyXG5cclxuICAgIGNvbnN0IG1vZHMgPSBlbGVtZW50KCdkaXYnLCBbJ21vZHMnXSlcclxuICAgIHJlY2VudEFjdGl2aXR5KCkuZm9yRWFjaCgoYSkgPT4ge1xyXG4gICAgICAgIGlmICgoYVswXSA9PT0gJ2VkaXQnKSAmJiAoYVsxXS5pZCA9PT0gYXNzaWdubWVudC5pZCkpIHtcclxuICAgICAgICBjb25zdCB0ZSA9IGVsZW1lbnQoJ2RpdicsIFsnaW5uZXJBY3Rpdml0eScsICdhc3NpZ25tZW50SXRlbScsIGFzc2lnbm1lbnQuYmFzZVR5cGVdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBgPGkgY2xhc3M9J21hdGVyaWFsLWljb25zJz5lZGl0PC9pPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9J3RpdGxlJz4ke2RhdGVTdHJpbmcobmV3IERhdGUoYVsyXSkpfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPSdhZGRpdGlvbnMnPjwvc3Bhbj48c3BhbiBjbGFzcz0nZGVsZXRpb25zJz48L3NwYW4+YCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgYGlhJHthc3NpZ25tZW50LmlkfWApXHJcbiAgICAgICAgY29uc3QgZCA9IGRtcC5kaWZmX21haW4oYVsxXS5ib2R5LCBhc3NpZ25tZW50LmJvZHkpXHJcbiAgICAgICAgZG1wLmRpZmZfY2xlYW51cFNlbWFudGljKGQpXHJcbiAgICAgICAgcG9wdWxhdGVBZGRlZERlbGV0ZWQoZCwgdGUpXHJcblxyXG4gICAgICAgIGlmIChhc3NpZ25tZW50LmNsYXNzKSB0ZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtY2xhc3MnLCBkYXRhLmNsYXNzZXNbYXNzaWdubWVudC5jbGFzc10pXHJcbiAgICAgICAgdGUuYXBwZW5kQ2hpbGQoZWxlbWVudCgnZGl2JywgJ2lhRGlmZicsIGRtcC5kaWZmX3ByZXR0eUh0bWwoZCkpKVxyXG4gICAgICAgIHRlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICB0ZS5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnKVxyXG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuYm9keS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmlldycpID09PSAnMScpIHJlc2l6ZSgpXHJcbiAgICAgICAgfSlcclxuICAgICAgICBtb2RzLmFwcGVuZENoaWxkKHRlKVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbiAgICBlLmFwcGVuZENoaWxkKG1vZHMpXHJcblxyXG4gICAgaWYgKHNldHRpbmdzLmFzc2lnbm1lbnRTcGFuID09PSAnbXVsdGlwbGUnICYmIChzdGFydCA8IHNwbGl0LnN0YXJ0KSkge1xyXG4gICAgICAgIGUuY2xhc3NMaXN0LmFkZCgnZnJvbVdlZWtlbmQnKVxyXG4gICAgfVxyXG4gICAgaWYgKHNldHRpbmdzLmFzc2lnbm1lbnRTcGFuID09PSAnbXVsdGlwbGUnICYmIChlbmQgPiBzcGxpdC5lbmQpKSB7XHJcbiAgICAgICAgZS5jbGFzc0xpc3QuYWRkKCdvdmVyV2Vla2VuZCcpXHJcbiAgICB9XHJcbiAgICBlLmNsYXNzTGlzdC5hZGQoYHMke3NwbGl0LnN0YXJ0LmdldERheSgpfWApXHJcbiAgICBpZiAoc3BsaXQuZW5kICE9PSAnRm9yZXZlcicpIGUuY2xhc3NMaXN0LmFkZChgZSR7NiAtIHNwbGl0LmVuZC5nZXREYXkoKX1gKVxyXG5cclxuICAgIGNvbnN0IHN0ID0gTWF0aC5mbG9vcihzcGxpdC5zdGFydC5nZXRUaW1lKCkgLyAxMDAwIC8gMzYwMCAvIDI0KVxyXG4gICAgaWYgKHNwbGl0LmFzc2lnbm1lbnQuZW5kID09PSAnRm9yZXZlcicpIHtcclxuICAgICAgICBpZiAoc3QgPD0gKHRvZGF5KCkgKyBnZXRMaXN0RGF0ZU9mZnNldCgpKSkge1xyXG4gICAgICAgICAgICBlLmNsYXNzTGlzdC5hZGQoJ2xpc3REaXNwJylcclxuICAgICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IG1pZERhdGUgPSBuZXcgRGF0ZSgpXHJcbiAgICAgICAgbWlkRGF0ZS5zZXREYXRlKG1pZERhdGUuZ2V0RGF0ZSgpICsgZ2V0TGlzdERhdGVPZmZzZXQoKSlcclxuICAgICAgICBjb25zdCBwdXNoID0gKGFzc2lnbm1lbnQuYmFzZVR5cGUgPT09ICd0ZXN0JyAmJiBhc3NpZ25tZW50LnN0YXJ0ID09PSBzdCkgPyBzZXR0aW5ncy5lYXJseVRlc3QgOiAwXHJcbiAgICAgICAgY29uc3QgZW5kRXh0cmEgPSBnZXRMaXN0RGF0ZU9mZnNldCgpID09PSAwID8gZ2V0VGltZUFmdGVyKG1pZERhdGUpIDogMjQgKiAzNjAwICogMTAwMFxyXG4gICAgICAgIGlmIChmcm9tRGF0ZU51bShzdCAtIHB1c2gpIDw9IG1pZERhdGUgJiZcclxuICAgICAgICAgICAgKHNwbGl0LmVuZCA9PT0gJ0ZvcmV2ZXInIHx8IG1pZERhdGUuZ2V0VGltZSgpIDw9IHNwbGl0LmVuZC5nZXRUaW1lKCkgKyBlbmRFeHRyYSkpIHtcclxuICAgICAgICAgICAgZS5jbGFzc0xpc3QuYWRkKCdsaXN0RGlzcCcpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIEFkZCBjbGljayBpbnRlcmFjdGl2aXR5XHJcbiAgICBpZiAoIXNwbGl0LmN1c3RvbSB8fCAhc2V0dGluZ3Muc2VwVGFza3MpIHtcclxuICAgICAgICBlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2dCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoKGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2Z1bGwnKS5sZW5ndGggPT09IDApICYmXHJcbiAgICAgICAgICAgICAgICAoZG9jdW1lbnQuYm9keS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmlldycpID09PSAnMCcpKSB7XHJcbiAgICAgICAgICAgICAgICBlLmNsYXNzTGlzdC5yZW1vdmUoJ2FuaW0nKVxyXG4gICAgICAgICAgICAgICAgZS5jbGFzc0xpc3QuYWRkKCdtb2RpZnknKVxyXG4gICAgICAgICAgICAgICAgZS5zdHlsZS50b3AgPSAoZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgLSBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLSBjc3NOdW1iZXIoZS5zdHlsZS5tYXJnaW5Ub3ApKSArIDQ0ICsgJ3B4J1xyXG4gICAgICAgICAgICAgICAgZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtdG9wJywgZS5zdHlsZS50b3ApXHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbidcclxuICAgICAgICAgICAgICAgIGNvbnN0IGJhY2sgPSBlbGVtQnlJZCgnYmFja2dyb3VuZCcpXHJcbiAgICAgICAgICAgICAgICBiYWNrLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcbiAgICAgICAgICAgICAgICBiYWNrLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXHJcbiAgICAgICAgICAgICAgICBlLmNsYXNzTGlzdC5hZGQoJ2FuaW0nKVxyXG4gICAgICAgICAgICAgICAgZm9yY2VMYXlvdXQoZSlcclxuICAgICAgICAgICAgICAgIGUuY2xhc3NMaXN0LmFkZCgnZnVsbCcpXHJcbiAgICAgICAgICAgICAgICBlLnN0eWxlLnRvcCA9ICg3NSAtIGNzc051bWJlcihlLnN0eWxlLm1hcmdpblRvcCkpICsgJ3B4J1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiBlLmNsYXNzTGlzdC5yZW1vdmUoJ2FuaW0nKSwgMzUwKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZVxyXG59XHJcblxyXG4vLyBJbiBvcmRlciB0byBkaXNwbGF5IGFuIGFzc2lnbm1lbnQgaW4gdGhlIGNvcnJlY3QgWCBwb3NpdGlvbiwgY2xhc3NlcyB3aXRoIG5hbWVzIGVYIGFuZCBlWCBhcmVcclxuLy8gdXNlZCwgd2hlcmUgWCBpcyB0aGUgbnVtYmVyIG9mIHNxdWFyZXMgdG8gZnJvbSB0aGUgYXNzaWdubWVudCB0byB0aGUgbGVmdC9yaWdodCBzaWRlIG9mIHRoZVxyXG4vLyBzY3JlZW4uIFRoZSBmdW5jdGlvbiBiZWxvdyBkZXRlcm1pbmVzIHdoaWNoIGVYIGFuZCBzWCBjbGFzcyB0aGUgZ2l2ZW4gZWxlbWVudCBoYXMuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRFUyhlbDogSFRNTEVsZW1lbnQpOiBbc3RyaW5nLCBzdHJpbmddIHtcclxuICAgIGxldCBlID0gMFxyXG4gICAgbGV0IHMgPSAwXHJcblxyXG4gICAgQXJyYXkuZnJvbShuZXcgQXJyYXkoNyksIChfLCB4KSA9PiB4KS5mb3JFYWNoKCh4KSA9PiB7XHJcbiAgICAgICAgaWYgKGVsLmNsYXNzTGlzdC5jb250YWlucyhgZSR7eH1gKSkge1xyXG4gICAgICAgICAgICBlID0geFxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZWwuY2xhc3NMaXN0LmNvbnRhaW5zKGBzJHt4fWApKSB7XHJcbiAgICAgICAgICAgIHMgPSB4XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICAgIHJldHVybiBbYGUke2V9YCwgYHMke3N9YF1cclxufVxyXG5cclxuLy8gQmVsb3cgaXMgYSBmdW5jdGlvbiB0byBjbG9zZSB0aGUgY3VycmVudCBhc3NpZ25tZW50IHRoYXQgaXMgb3BlbmVkLlxyXG5leHBvcnQgZnVuY3Rpb24gY2xvc2VPcGVuZWQoZXZ0OiBFdmVudCk6IHZvaWQge1xyXG4gICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICBjb25zdCBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mdWxsJykgYXMgSFRNTEVsZW1lbnR8bnVsbFxyXG4gICAgaWYgKGVsID09IG51bGwpIHJldHVyblxyXG5cclxuICAgIGVsLnN0eWxlLnRvcCA9IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS10b3AnKVxyXG4gICAgZWwuY2xhc3NMaXN0LmFkZCgnYW5pbScpXHJcbiAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKCdmdWxsJylcclxuICAgIGVsLnNjcm9sbFRvcCA9IDBcclxuICAgIGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnYXV0bydcclxuICAgIGNvbnN0IGJhY2sgPSBlbGVtQnlJZCgnYmFja2dyb3VuZCcpXHJcbiAgICBiYWNrLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBiYWNrLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcclxuICAgICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKCdhbmltJylcclxuICAgICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKCdtb2RpZnknKVxyXG4gICAgICAgIGVsLnN0eWxlLnRvcCA9ICdhdXRvJ1xyXG4gICAgICAgIGZvcmNlTGF5b3V0KGVsKVxyXG4gICAgICAgIGVsLmNsYXNzTGlzdC5hZGQoJ2FuaW0nKVxyXG4gICAgfSwgMTAwMClcclxufVxyXG4iLCJpbXBvcnQgeyBlbGVtQnlJZCwgbG9jYWxTdG9yYWdlUmVhZCB9IGZyb20gJy4uL3V0aWwnXHJcblxyXG4vLyBUaGVuLCB0aGUgdXNlcm5hbWUgaW4gdGhlIHNpZGViYXIgbmVlZHMgdG8gYmUgc2V0IGFuZCB3ZSBuZWVkIHRvIGdlbmVyYXRlIGFuIFwiYXZhdGFyXCIgYmFzZWQgb25cclxuLy8gaW5pdGlhbHMuIFRvIGRvIHRoYXQsIHNvbWUgY29kZSB0byBjb252ZXJ0IGZyb20gTEFCIHRvIFJHQiBjb2xvcnMgaXMgYm9ycm93ZWQgZnJvbVxyXG4vLyBodHRwczovL2dpdGh1Yi5jb20vYm9yb25pbmUvY29sb3JzcGFjZXMuanNcclxuLy9cclxuLy8gTEFCIGlzIGEgY29sb3IgbmFtaW5nIHNjaGVtZSB0aGF0IHVzZXMgdHdvIHZhbHVlcyAoQSBhbmQgQikgYWxvbmcgd2l0aCBhIGxpZ2h0bmVzcyB2YWx1ZSBpbiBvcmRlclxyXG4vLyB0byBwcm9kdWNlIGNvbG9ycyB0aGF0IGFyZSBlcXVhbGx5IHNwYWNlZCBiZXR3ZWVuIGFsbCBvZiB0aGUgY29sb3JzIHRoYXQgY2FuIGJlIHNlZW4gYnkgdGhlIGh1bWFuXHJcbi8vIGV5ZS4gVGhpcyB3b3JrcyBncmVhdCBiZWNhdXNlIGV2ZXJ5b25lIGhhcyBsZXR0ZXJzIGluIGhpcy9oZXIgaW5pdGlhbHMuXHJcblxyXG4vLyBUaGUgRDY1IHN0YW5kYXJkIGlsbHVtaW5hbnRcclxuY29uc3QgUkVGX1ggPSAwLjk1MDQ3XHJcbmNvbnN0IFJFRl9ZID0gMS4wMDAwMFxyXG5jb25zdCBSRUZfWiA9IDEuMDg4ODNcclxuXHJcbi8vIENJRSBMKmEqYiogY29uc3RhbnRzXHJcbmNvbnN0IExBQl9FID0gMC4wMDg4NTZcclxuY29uc3QgTEFCX0sgPSA5MDMuM1xyXG5cclxuY29uc3QgTSA9IFtcclxuICAgIFszLjI0MDYsIC0xLjUzNzIsIC0wLjQ5ODZdLFxyXG4gICAgWy0wLjk2ODksIDEuODc1OCwgIDAuMDQxNV0sXHJcbiAgICBbMC4wNTU3LCAtMC4yMDQwLCAgMS4wNTcwXVxyXG5dXHJcblxyXG5jb25zdCBmSW52ID0gKHQ6IG51bWJlcikgPT4ge1xyXG4gICAgaWYgKE1hdGgucG93KHQsIDMpID4gTEFCX0UpIHtcclxuICAgIHJldHVybiBNYXRoLnBvdyh0LCAzKVxyXG4gICAgfSBlbHNlIHtcclxuICAgIHJldHVybiAoKDExNiAqIHQpIC0gMTYpIC8gTEFCX0tcclxuICAgIH1cclxufVxyXG5jb25zdCBkb3RQcm9kdWN0ID0gKGE6IG51bWJlcltdLCBiOiBudW1iZXJbXSkgPT4ge1xyXG4gICAgbGV0IHJldCA9IDBcclxuICAgIGEuZm9yRWFjaCgoXywgaSkgPT4ge1xyXG4gICAgICAgIHJldCArPSBhW2ldICogYltpXVxyXG4gICAgfSlcclxuICAgIHJldHVybiByZXRcclxufVxyXG5jb25zdCBmcm9tTGluZWFyID0gKGM6IG51bWJlcikgPT4ge1xyXG4gICAgY29uc3QgYSA9IDAuMDU1XHJcbiAgICBpZiAoYyA8PSAwLjAwMzEzMDgpIHtcclxuICAgICAgICByZXR1cm4gMTIuOTIgKiBjXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiAoMS4wNTUgKiBNYXRoLnBvdyhjLCAxIC8gMi40KSkgLSAwLjA1NVxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBsYWJyZ2IobDogbnVtYmVyLCBhOiBudW1iZXIsIGI6IG51bWJlcik6IHN0cmluZyB7XHJcbiAgICBjb25zdCB2YXJZID0gKGwgKyAxNikgLyAxMTZcclxuICAgIGNvbnN0IHZhclogPSB2YXJZIC0gKGIgLyAyMDApXHJcbiAgICBjb25zdCB2YXJYID0gKGEgLyA1MDApICsgdmFyWVxyXG4gICAgY29uc3QgX1ggPSBSRUZfWCAqIGZJbnYodmFyWClcclxuICAgIGNvbnN0IF9ZID0gUkVGX1kgKiBmSW52KHZhclkpXHJcbiAgICBjb25zdCBfWiA9IFJFRl9aICogZkludih2YXJaKVxyXG5cclxuICAgIGNvbnN0IHR1cGxlID0gW19YLCBfWSwgX1pdXHJcblxyXG4gICAgY29uc3QgX1IgPSBmcm9tTGluZWFyKGRvdFByb2R1Y3QoTVswXSwgdHVwbGUpKVxyXG4gICAgY29uc3QgX0cgPSBmcm9tTGluZWFyKGRvdFByb2R1Y3QoTVsxXSwgdHVwbGUpKVxyXG4gICAgY29uc3QgX0IgPSBmcm9tTGluZWFyKGRvdFByb2R1Y3QoTVsyXSwgdHVwbGUpKVxyXG5cclxuICAgIC8vIE9yaWdpbmFsIGZyb20gaGVyZVxyXG4gICAgY29uc3QgbiA9ICh2OiBudW1iZXIpID0+IE1hdGgucm91bmQoTWF0aC5tYXgoTWF0aC5taW4odiAqIDI1NiwgMjU1KSwgMCkpXHJcbiAgICByZXR1cm4gYHJnYigke24oX1IpfSwgJHtuKF9HKX0sICR7bihfQil9KWBcclxufVxyXG5cclxuLyoqXHJcbiAqIENvbnZlcnQgYSBsZXR0ZXIgdG8gYSBmbG9hdCB2YWx1ZWQgZnJvbSAwIHRvIDI1NVxyXG4gKi9cclxuZnVuY3Rpb24gbGV0dGVyVG9Db2xvclZhbChsZXR0ZXI6IHN0cmluZyk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gKCgobGV0dGVyLmNoYXJDb2RlQXQoMCkgLSA2NSkgLyAyNikgKiAyNTYpIC0gMTI4XHJcbn1cclxuXHJcbi8vIFRoZSBmdW5jdGlvbiBiZWxvdyB1c2VzIHRoaXMgYWxnb3JpdGhtIHRvIGdlbmVyYXRlIGEgYmFja2dyb3VuZCBjb2xvciBmb3IgdGhlIGluaXRpYWxzIGRpc3BsYXllZCBpbiB0aGUgc2lkZWJhci5cclxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZUF2YXRhcigpOiB2b2lkIHtcclxuICAgIGlmICghbG9jYWxTdG9yYWdlUmVhZCgndXNlcm5hbWUnKSkgcmV0dXJuXHJcbiAgICBjb25zdCB1c2VyRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndXNlcicpXHJcbiAgICBjb25zdCBpbml0aWFsc0VsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2luaXRpYWxzJylcclxuICAgIGlmICghdXNlckVsIHx8ICFpbml0aWFsc0VsKSByZXR1cm5cclxuXHJcbiAgICB1c2VyRWwuaW5uZXJIVE1MID0gbG9jYWxTdG9yYWdlUmVhZCgndXNlcm5hbWUnKVxyXG4gICAgY29uc3QgaW5pdGlhbHMgPSBsb2NhbFN0b3JhZ2VSZWFkKCd1c2VybmFtZScpLm1hdGNoKC9cXGQqKC4pLio/KC4kKS8pIC8vIFNlcGFyYXRlIHllYXIgZnJvbSBmaXJzdCBuYW1lIGFuZCBpbml0aWFsXHJcbiAgICBpZiAoaW5pdGlhbHMgIT0gbnVsbCkge1xyXG4gICAgICAgIGNvbnN0IGJnID0gbGFicmdiKDUwLCBsZXR0ZXJUb0NvbG9yVmFsKGluaXRpYWxzWzFdKSwgbGV0dGVyVG9Db2xvclZhbChpbml0aWFsc1syXSkpIC8vIENvbXB1dGUgdGhlIGNvbG9yXHJcbiAgICAgICAgaW5pdGlhbHNFbC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBiZ1xyXG4gICAgICAgIGluaXRpYWxzRWwuaW5uZXJIVE1MID0gaW5pdGlhbHNbMV0gKyBpbml0aWFsc1syXVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IHRvZGF5IH0gZnJvbSAnLi4vZGF0ZXMnXHJcbmltcG9ydCB7IGVsZW1lbnQgfSBmcm9tICcuLi91dGlsJ1xyXG5cclxuY29uc3QgTU9OVEhTID0gWydKYW4nLCAnRmViJywgJ01hcicsICdBcHInLCAnTWF5JywgJ0p1bicsICdKdWwnLCAnQXVnJywgJ1NlcCcsICdPY3QnLCAnTm92JywgJ0RlYyddXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlV2VlayhpZDogc3RyaW5nKTogSFRNTEVsZW1lbnQge1xyXG4gICAgY29uc3Qgd2sgPSBlbGVtZW50KCdzZWN0aW9uJywgJ3dlZWsnLCBudWxsLCBpZClcclxuICAgIGNvbnN0IGRheVRhYmxlID0gZWxlbWVudCgndGFibGUnLCAnZGF5VGFibGUnKSBhcyBIVE1MVGFibGVFbGVtZW50XHJcbiAgICBjb25zdCB0ciA9IGRheVRhYmxlLmluc2VydFJvdygpXHJcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmUgbm8tbG9vcHNcclxuICAgIGZvciAobGV0IGRheSA9IDA7IGRheSA8IDc7IGRheSsrKSB0ci5pbnNlcnRDZWxsKClcclxuICAgIHdrLmFwcGVuZENoaWxkKGRheVRhYmxlKVxyXG5cclxuICAgIHJldHVybiB3a1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRGF5KGQ6IERhdGUpOiBIVE1MRWxlbWVudCB7XHJcbiAgICBjb25zdCBkYXkgPSBlbGVtZW50KCdkaXYnLCAnZGF5JywgbnVsbCwgJ2RheScpXHJcbiAgICBkYXkuc2V0QXR0cmlidXRlKCdkYXRhLWRhdGUnLCBTdHJpbmcoZC5nZXRUaW1lKCkpKVxyXG4gICAgaWYgKE1hdGguZmxvb3IoKGQuZ2V0VGltZSgpIC0gZC5nZXRUaW1lem9uZU9mZnNldCgpKSAvIDEwMDAgLyAzNjAwIC8gMjQpID09PSB0b2RheSgpKSB7XHJcbiAgICAgIGRheS5jbGFzc0xpc3QuYWRkKCd0b2RheScpXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbW9udGggPSBlbGVtZW50KCdzcGFuJywgJ21vbnRoJywgTU9OVEhTW2QuZ2V0TW9udGgoKV0pXHJcbiAgICBkYXkuYXBwZW5kQ2hpbGQobW9udGgpXHJcblxyXG4gICAgY29uc3QgZGF0ZSA9IGVsZW1lbnQoJ3NwYW4nLCAnZGF0ZScsIFN0cmluZyhkLmdldERhdGUoKSkpXHJcbiAgICBkYXkuYXBwZW5kQ2hpbGQoZGF0ZSlcclxuXHJcbiAgICByZXR1cm4gZGF5XHJcbn1cclxuIiwiaW1wb3J0IHsgZ2V0Q2xhc3NlcywgZ2V0RGF0YSB9IGZyb20gJy4uL3BjcidcclxuaW1wb3J0IHsgXyQsIGNhcGl0YWxpemVTdHJpbmcsIGVsZW1CeUlkLCBlbGVtZW50IH0gZnJvbSAnLi4vdXRpbCdcclxuXHJcbi8vIFdoZW4gYW55dGhpbmcgaXMgdHlwZWQsIHRoZSBzZWFyY2ggc3VnZ2VzdGlvbnMgbmVlZCB0byBiZSB1cGRhdGVkLlxyXG5jb25zdCBUSVBfTkFNRVMgPSB7XHJcbiAgICBmb3I6IFsnZm9yJ10sXHJcbiAgICBieTogWydieScsICdkdWUnLCAnZW5kaW5nJ10sXHJcbiAgICBzdGFydGluZzogWydzdGFydGluZycsICdiZWdpbm5pbmcnLCAnYXNzaWduZWQnXVxyXG59XHJcblxyXG5jb25zdCBuZXdUZXh0ID0gZWxlbUJ5SWQoJ25ld1RleHQnKSBhcyBIVE1MSW5wdXRFbGVtZW50XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlTmV3VGlwcyh2YWw6IHN0cmluZywgc2Nyb2xsOiBib29sZWFuID0gdHJ1ZSk6IHZvaWQge1xyXG4gICAgaWYgKHNjcm9sbCkge1xyXG4gICAgICAgIGVsZW1CeUlkKCduZXdUaXBzJykuc2Nyb2xsVG9wID0gMFxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHNwYWNlSW5kZXggPSB2YWwubGFzdEluZGV4T2YoJyAnKVxyXG4gICAgaWYgKHNwYWNlSW5kZXggIT09IC0xKSB7XHJcbiAgICAgICAgY29uc3QgYmVmb3JlU3BhY2UgPSB2YWwubGFzdEluZGV4T2YoJyAnLCBzcGFjZUluZGV4IC0gMSlcclxuICAgICAgICBjb25zdCBiZWZvcmUgPSB2YWwuc3Vic3RyaW5nKChiZWZvcmVTcGFjZSA9PT0gLTEgPyAwIDogYmVmb3JlU3BhY2UgKyAxKSwgc3BhY2VJbmRleClcclxuICAgICAgICBPYmplY3QuZW50cmllcyhUSVBfTkFNRVMpLmZvckVhY2goKFtuYW1lLCBwb3NzaWJsZV0pID0+IHtcclxuICAgICAgICAgICAgaWYgKHBvc3NpYmxlLmluZGV4T2YoYmVmb3JlKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChuYW1lID09PSAnZm9yJykge1xyXG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKFRJUF9OQU1FUykuZm9yRWFjaCgodGlwTmFtZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtQnlJZChgdGlwJHt0aXBOYW1lfWApLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICBnZXRDbGFzc2VzKCkuZm9yRWFjaCgoY2xzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGlkID0gYHRpcGNsYXNzJHtjbHMucmVwbGFjZSgvXFxXLywgJycpfWBcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNwYWNlSW5kZXggPT09ICh2YWwubGVuZ3RoIC0gMSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjb250YWluZXIgPSBlbGVtZW50KCdkaXYnLCBbJ2NsYXNzVGlwJywgJ2FjdGl2ZScsICd0aXAnXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYDxpIGNsYXNzPSdtYXRlcmlhbC1pY29ucyc+Y2xhc3M8L2k+PHNwYW4gY2xhc3M9J3R5cGVkJz4ke2Nsc308L3NwYW4+YCwgaWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGlwQ29tcGxldGUoY2xzKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtQnlJZCgnbmV3VGlwcycpLmFwcGVuZENoaWxkKGNvbnRhaW5lcilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1CeUlkKGlkKS5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNscy50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHZhbC50b0xvd2VyQ2FzZSgpLnN1YnN0cihzcGFjZUluZGV4ICsgMSkpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNsYXNzVGlwJykuZm9yRWFjaCgoZWwpID0+IHtcclxuICAgICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gICAgfSlcclxuICAgIGlmICgodmFsID09PSAnJykgfHwgKHZhbC5jaGFyQXQodmFsLmxlbmd0aCAtIDEpID09PSAnICcpKSB7XHJcbiAgICAgICAgdXBkYXRlVGlwKCdmb3InLCAnZm9yJywgZmFsc2UpXHJcbiAgICAgICAgdXBkYXRlVGlwKCdieScsICdieScsIGZhbHNlKVxyXG4gICAgICAgIHVwZGF0ZVRpcCgnc3RhcnRpbmcnLCAnc3RhcnRpbmcnLCBmYWxzZSlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc3QgbGFzdFNwYWNlID0gdmFsLmxhc3RJbmRleE9mKCcgJylcclxuICAgICAgICBsZXQgbGFzdFdvcmQgPSBsYXN0U3BhY2UgPT09IC0xID8gdmFsIDogdmFsLnN1YnN0cihsYXN0U3BhY2UgKyAxKVxyXG4gICAgICAgIGNvbnN0IHVwcGVyY2FzZSA9IGxhc3RXb3JkLmNoYXJBdCgwKSA9PT0gbGFzdFdvcmQuY2hhckF0KDApLnRvVXBwZXJDYXNlKClcclxuICAgICAgICBsYXN0V29yZCA9IGxhc3RXb3JkLnRvTG93ZXJDYXNlKClcclxuICAgICAgICBPYmplY3QuZW50cmllcyhUSVBfTkFNRVMpLmZvckVhY2goKFtuYW1lLCBwb3NzaWJsZV0pID0+IHtcclxuICAgICAgICAgICAgbGV0IGZvdW5kOiBzdHJpbmd8bnVsbCA9IG51bGxcclxuICAgICAgICAgICAgcG9zc2libGUuZm9yRWFjaCgocCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHAuc2xpY2UoMCwgbGFzdFdvcmQubGVuZ3RoKSA9PT0gbGFzdFdvcmQpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IHBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgaWYgKGZvdW5kKSB7XHJcbiAgICAgICAgICAgICAgICB1cGRhdGVUaXAobmFtZSwgZm91bmQsIHVwcGVyY2FzZSlcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGVsZW1CeUlkKGB0aXAke25hbWV9YCkuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZVRpcChuYW1lOiBzdHJpbmcsIHR5cGVkOiBzdHJpbmcsIGNhcGl0YWxpemU6IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgIGlmIChuYW1lICE9PSAnZm9yJyAmJiBuYW1lICE9PSAnYnknICYmIG5hbWUgIT09ICdzdGFydGluZycpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgdGlwIG5hbWUnKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGVsID0gZWxlbUJ5SWQoYHRpcCR7bmFtZX1gKVxyXG4gICAgZWwuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuICAgIF8kKGVsLnF1ZXJ5U2VsZWN0b3IoJy50eXBlZCcpKS5pbm5lckhUTUwgPSAoY2FwaXRhbGl6ZSA/IGNhcGl0YWxpemVTdHJpbmcodHlwZWQpIDogdHlwZWQpICsgJy4uLidcclxuICAgIGNvbnN0IG5ld05hbWVzOiBzdHJpbmdbXSA9IFtdXHJcbiAgICBUSVBfTkFNRVNbbmFtZV0uZm9yRWFjaCgobikgPT4ge1xyXG4gICAgICAgIGlmIChuICE9PSB0eXBlZCkgeyBuZXdOYW1lcy5wdXNoKGA8Yj4ke259PC9iPmApIH1cclxuICAgIH0pXHJcbiAgICBfJChlbC5xdWVyeVNlbGVjdG9yKCcub3RoZXJzJykpLmlubmVySFRNTCA9IG5ld05hbWVzLmxlbmd0aCA+IDAgPyBgWW91IGNhbiBhbHNvIHVzZSAke25ld05hbWVzLmpvaW4oJyBvciAnKX1gIDogJydcclxufVxyXG5cclxuZnVuY3Rpb24gdGlwQ29tcGxldGUoYXV0b2NvbXBsZXRlOiBzdHJpbmcpOiAoZXZ0OiBFdmVudCkgPT4gdm9pZCB7XHJcbiAgICByZXR1cm4gKGV2dDogRXZlbnQpID0+IHtcclxuICAgICAgICBjb25zdCB2YWwgPSBuZXdUZXh0LnZhbHVlXHJcbiAgICAgICAgY29uc3QgbGFzdFNwYWNlID0gdmFsLmxhc3RJbmRleE9mKCcgJylcclxuICAgICAgICBjb25zdCBsYXN0V29yZCA9IGxhc3RTcGFjZSA9PT0gLTEgPyAwIDogbGFzdFNwYWNlICsgMVxyXG4gICAgICAgIHVwZGF0ZU5ld1RpcHMobmV3VGV4dC52YWx1ZSA9IHZhbC5zdWJzdHJpbmcoMCwgbGFzdFdvcmQpICsgYXV0b2NvbXBsZXRlICsgJyAnKVxyXG4gICAgICAgIHJldHVybiBuZXdUZXh0LmZvY3VzKClcclxuICAgIH1cclxufVxyXG5cclxuLy8gVGhlIGV2ZW50IGxpc3RlbmVyIGlzIHRoZW4gYWRkZWQgdG8gdGhlIHByZWV4aXN0aW5nIHRpcHMuXHJcbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50aXAnKS5mb3JFYWNoKCh0aXApID0+IHtcclxuICAgIHRpcC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRpcENvbXBsZXRlKF8kKHRpcC5xdWVyeVNlbGVjdG9yKCcudHlwZWQnKSkuaW5uZXJIVE1MKSlcclxufSlcclxuIiwiaW1wb3J0IHsgVkVSU0lPTiB9IGZyb20gJy4uL2FwcCdcclxuaW1wb3J0IHsgZWxlbUJ5SWQgfSBmcm9tICcuLi91dGlsJ1xyXG5cclxuY29uc3QgRVJST1JfRk9STV9VUkwgPSAnaHR0cHM6Ly9kb2NzLmdvb2dsZS5jb20vYS9zdHVkZW50cy5oYXJrZXIub3JnL2Zvcm1zL2QvJ1xyXG4gICAgICAgICAgICAgICAgICAgICArICcxc2EyZ1V0WUZQZEtUNVlFTlhJRVlhdXlSUHVjcXNRQ1ZhUUFQZUYzYlo0US92aWV3Zm9ybSdcclxuY29uc3QgRVJST1JfRk9STV9FTlRSWSA9ICc/ZW50cnkuMTIwMDM2MjIzPSdcclxuY29uc3QgRVJST1JfR0lUSFVCX1VSTCA9ICdodHRwczovL2dpdGh1Yi5jb20vMTlSeWFuQS9DaGVja1BDUi9pc3N1ZXMvbmV3J1xyXG5cclxuY29uc3QgbGlua0J5SWQgPSAoaWQ6IHN0cmluZykgPT4gZWxlbUJ5SWQoaWQpIGFzIEhUTUxMaW5rRWxlbWVudFxyXG5cclxuLy8gKmRpc3BsYXlFcnJvciogZGlzcGxheXMgYSBkaWFsb2cgY29udGFpbmluZyBpbmZvcm1hdGlvbiBhYm91dCBhbiBlcnJvci5cclxuZXhwb3J0IGZ1bmN0aW9uIGRpc3BsYXlFcnJvcihlOiBFcnJvcik6IHZvaWQge1xyXG4gICAgY29uc29sZS5sb2coJ0Rpc3BsYXlpbmcgZXJyb3InLCBlKVxyXG4gICAgY29uc3QgZXJyb3JIVE1MID0gYE1lc3NhZ2U6ICR7ZS5tZXNzYWdlfVxcblN0YWNrOiAke2Uuc3RhY2sgfHwgKGUgYXMgYW55KS5saW5lTnVtYmVyfVxcbmBcclxuICAgICAgICAgICAgICAgICAgICArIGBCcm93c2VyOiAke25hdmlnYXRvci51c2VyQWdlbnR9XFxuVmVyc2lvbjogJHtWRVJTSU9OfWBcclxuICAgIGVsZW1CeUlkKCdlcnJvckNvbnRlbnQnKS5pbm5lckhUTUwgPSBlcnJvckhUTUwucmVwbGFjZSgnXFxuJywgJzxicj4nKVxyXG4gICAgbGlua0J5SWQoJ2Vycm9yR29vZ2xlJykuaHJlZiA9IEVSUk9SX0ZPUk1fVVJMICsgRVJST1JfRk9STV9FTlRSWSArIGVuY29kZVVSSUNvbXBvbmVudChlcnJvckhUTUwpXHJcbiAgICBsaW5rQnlJZCgnZXJyb3JHaXRIdWInKS5ocmVmID1cclxuICAgICAgICBFUlJPUl9HSVRIVUJfVVJMICsgJz9ib2R5PScgKyBlbmNvZGVVUklDb21wb25lbnQoYEkndmUgZW5jb3VudGVyZWQgYW4gYnVnLlxcblxcblxcYFxcYFxcYFxcbiR7ZXJyb3JIVE1MfVxcblxcYFxcYFxcYGApXHJcbiAgICBlbGVtQnlJZCgnZXJyb3JCYWNrZ3JvdW5kJykuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcclxuICAgIHJldHVybiBlbGVtQnlJZCgnZXJyb3InKS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG59XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCAoZXZ0KSA9PiB7XHJcbiAgICBldnQucHJldmVudERlZmF1bHQoKVxyXG4gICAgZGlzcGxheUVycm9yKGV2dC5lcnJvcilcclxufSlcclxuIiwiaW1wb3J0IHsgXyQgfSBmcm9tICcuLi91dGlsJ1xyXG5cclxuLy8gRm9yIGxpc3QgdmlldywgdGhlIGFzc2lnbm1lbnRzIGNhbid0IGJlIG9uIHRvcCBvZiBlYWNoIG90aGVyLlxyXG4vLyBUaGVyZWZvcmUsIGEgbGlzdGVuZXIgaXMgYXR0YWNoZWQgdG8gdGhlIHJlc2l6aW5nIG9mIHRoZSBicm93c2VyIHdpbmRvdy5cclxubGV0IHRpY2tpbmcgPSBmYWxzZVxyXG5sZXQgdGltZW91dElkOiBudW1iZXJ8bnVsbCA9IG51bGxcclxuZXhwb3J0IGZ1bmN0aW9uIGdldFJlc2l6ZUFzc2lnbm1lbnRzKCk6IEhUTUxFbGVtZW50W10ge1xyXG4gICAgY29uc3QgYXNzaWdubWVudHMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuY29udGFpbnMoJ3Nob3dEb25lJykgP1xyXG4gICAgICAgICcuYXNzaWdubWVudC5saXN0RGlzcCcgOiAnLmFzc2lnbm1lbnQubGlzdERpc3A6bm90KC5kb25lKScpKVxyXG4gICAgYXNzaWdubWVudHMuc29ydCgoYSwgYikgPT4ge1xyXG4gICAgICAgIGNvbnN0IGFkID0gYS5jbGFzc0xpc3QuY29udGFpbnMoJ2RvbmUnKVxyXG4gICAgICAgIGNvbnN0IGJkID0gYi5jbGFzc0xpc3QuY29udGFpbnMoJ2RvbmUnKVxyXG4gICAgICAgIGlmIChhZCAmJiAhYmQpIHsgcmV0dXJuIDEgfVxyXG4gICAgICAgIGlmIChiZCAmJiAhYWQpIHsgcmV0dXJuIC0xIH1cclxuICAgICAgICByZXR1cm4gTnVtYmVyKChhLnF1ZXJ5U2VsZWN0b3IoJy5kdWUnKSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSlcclxuICAgICAgICAgICAgIC0gTnVtYmVyKChiLnF1ZXJ5U2VsZWN0b3IoJy5kdWUnKSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSlcclxuICAgIH0pXHJcbiAgICByZXR1cm4gYXNzaWdubWVudHMgYXMgSFRNTEVsZW1lbnRbXVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVzaXplQ2FsbGVyKCk6IHZvaWQge1xyXG4gICAgaWYgKCF0aWNraW5nKSB7XHJcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlc2l6ZSlcclxuICAgICAgICB0aWNraW5nID0gdHJ1ZVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVzaXplKCk6IHZvaWQge1xyXG4gICAgdGlja2luZyA9IHRydWVcclxuICAgIC8vIFRvIGNhbGN1bGF0ZSB0aGUgbnVtYmVyIG9mIGNvbHVtbnMsIHRoZSBiZWxvdyBhbGdvcml0aG0gaXMgdXNlZCBiZWNhc2UgYXMgdGhlIHNjcmVlbiBzaXplXHJcbiAgICAvLyBpbmNyZWFzZXMsIHRoZSBjb2x1bW4gd2lkdGggaW5jcmVhc2VzXHJcbiAgICBjb25zdCB3aWR0aHMgPSBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5jb250YWlucygnc2hvd0luZm8nKSA/XHJcbiAgICAgICAgWzY1MCwgMTEwMCwgMTgwMCwgMjcwMCwgMzgwMCwgNTEwMF0gOiBbMzUwLCA4MDAsIDE1MDAsIDI0MDAsIDM1MDAsIDQ4MDBdXHJcbiAgICBsZXQgY29sdW1ucyA9IDFcclxuICAgIHdpZHRocy5mb3JFYWNoKCh3LCBpbmRleCkgPT4ge1xyXG4gICAgICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA+IHcpIHsgY29sdW1ucyA9IGluZGV4ICsgMSB9XHJcbiAgICB9KVxyXG4gICAgY29uc3QgY29sdW1uSGVpZ2h0cyA9IEFycmF5LmZyb20obmV3IEFycmF5KGNvbHVtbnMpLCAoKSA9PiAwKVxyXG4gICAgY29uc3QgY2NoOiBudW1iZXJbXSA9IFtdXHJcbiAgICBjb25zdCBhc3NpZ25tZW50cyA9IGdldFJlc2l6ZUFzc2lnbm1lbnRzKClcclxuICAgIGFzc2lnbm1lbnRzLmZvckVhY2goKGFzc2lnbm1lbnQsIG4pID0+IHtcclxuICAgICAgICBjb25zdCBjb2wgPSBuICUgY29sdW1uc1xyXG4gICAgICAgIGNjaC5wdXNoKGNvbHVtbkhlaWdodHNbY29sXSlcclxuICAgICAgICBjb2x1bW5IZWlnaHRzW2NvbF0gKz0gYXNzaWdubWVudC5vZmZzZXRIZWlnaHQgKyAyNFxyXG4gICAgfSlcclxuICAgIGFzc2lnbm1lbnRzLmZvckVhY2goKGFzc2lnbm1lbnQsIG4pID0+IHtcclxuICAgICAgICBjb25zdCBjb2wgPSBuICUgY29sdW1uc1xyXG4gICAgICAgIGFzc2lnbm1lbnQuc3R5bGUudG9wID0gY2NoW25dICsgJ3B4J1xyXG4gICAgICAgIGFzc2lnbm1lbnQuc3R5bGUubGVmdCA9ICgoMTAwIC8gY29sdW1ucykgKiBjb2wpICsgJyUnXHJcbiAgICAgICAgYXNzaWdubWVudC5zdHlsZS5yaWdodCA9ICgoMTAwIC8gY29sdW1ucykgKiAoY29sdW1ucyAtIGNvbCAtIDEpKSArICclJ1xyXG4gICAgfSlcclxuICAgIGlmICh0aW1lb3V0SWQpIGNsZWFyVGltZW91dCh0aW1lb3V0SWQpXHJcbiAgICB0aW1lb3V0SWQgPSBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBjY2gubGVuZ3RoID0gMFxyXG4gICAgICAgIGFzc2lnbm1lbnRzLmZvckVhY2goKGFzc2lnbm1lbnQsIG4pID0+IHtcclxuICAgICAgICAgICAgY29uc3QgY29sID0gbiAlIGNvbHVtbnNcclxuICAgICAgICAgICAgaWYgKG4gPCBjb2x1bW5zKSB7XHJcbiAgICAgICAgICAgICAgICBjb2x1bW5IZWlnaHRzW2NvbF0gPSAwXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2NoLnB1c2goY29sdW1uSGVpZ2h0c1tjb2xdKVxyXG4gICAgICAgICAgICBjb2x1bW5IZWlnaHRzW2NvbF0gKz0gYXNzaWdubWVudC5vZmZzZXRIZWlnaHQgKyAyNFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgYXNzaWdubWVudHMuZm9yRWFjaCgoYXNzaWdubWVudCwgbikgPT4ge1xyXG4gICAgICAgICAgICBhc3NpZ25tZW50LnN0eWxlLnRvcCA9IGNjaFtuXSArICdweCdcclxuICAgICAgICB9KVxyXG4gICAgfSwgNTAwKVxyXG4gICAgdGlja2luZyA9IGZhbHNlXHJcbn1cclxuIiwiLyoqXHJcbiAqIEFsbCB0aGlzIGlzIHJlc3BvbnNpYmxlIGZvciBpcyBjcmVhdGluZyBzbmFja2JhcnMuXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgZWxlbWVudCwgZm9yY2VMYXlvdXQgfSBmcm9tICcuLi91dGlsJ1xyXG5cclxuLyoqXHJcbiAqIENyZWF0ZXMgYSBzbmFja2JhciB3aXRob3V0IGFuIGFjdGlvblxyXG4gKiBAcGFyYW0gbWVzc2FnZSBUaGUgc25hY2tiYXIncyBtZXNzYWdlXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gc25hY2tiYXIobWVzc2FnZTogc3RyaW5nKTogdm9pZFxyXG4vKipcclxuICogQ3JlYXRlcyBhIHNuYWNrYmFyIHdpdGggYW4gYWN0aW9uXHJcbiAqIEBwYXJhbSBtZXNzYWdlIFRoZSBzbmFja2JhcidzIG1lc3NhZ2VcclxuICogQHBhcmFtIGFjdGlvbiBPcHRpb25hbCB0ZXh0IHRvIHNob3cgYXMgYSBtZXNzYWdlIGFjdGlvblxyXG4gKiBAcGFyYW0gZiAgICAgIEEgZnVuY3Rpb24gdG8gZXhlY3V0ZSB3aGVuIHRoZSBhY3Rpb24gaXMgY2xpY2tlZFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHNuYWNrYmFyKG1lc3NhZ2U6IHN0cmluZywgYWN0aW9uOiBzdHJpbmcsIGY6ICgpID0+IHZvaWQpOiB2b2lkXHJcbmV4cG9ydCBmdW5jdGlvbiBzbmFja2JhcihtZXNzYWdlOiBzdHJpbmcsIGFjdGlvbj86IHN0cmluZywgZj86ICgpID0+IHZvaWQpOiB2b2lkIHtcclxuICAgIGNvbnN0IHNuYWNrID0gZWxlbWVudCgnZGl2JywgJ3NuYWNrYmFyJylcclxuICAgIGNvbnN0IHNuYWNrSW5uZXIgPSBlbGVtZW50KCdkaXYnLCAnc25hY2tJbm5lcicsIG1lc3NhZ2UpXHJcbiAgICBzbmFjay5hcHBlbmRDaGlsZChzbmFja0lubmVyKVxyXG5cclxuICAgIGlmICgoYWN0aW9uICE9IG51bGwpICYmIChmICE9IG51bGwpKSB7XHJcbiAgICAgICAgY29uc3QgYWN0aW9uRSA9IGVsZW1lbnQoJ2EnLCBbXSwgYWN0aW9uKVxyXG4gICAgICAgIGFjdGlvbkUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHNuYWNrLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgICAgICAgICAgIGYoKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgc25hY2tJbm5lci5hcHBlbmRDaGlsZChhY3Rpb25FKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGFkZCA9ICgpID0+IHtcclxuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzbmFjaylcclxuICAgICAgZm9yY2VMYXlvdXQoc25hY2spXHJcbiAgICAgIHNuYWNrLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgc25hY2suY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcclxuICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gc25hY2sucmVtb3ZlKCksIDkwMClcclxuICAgICAgfSwgNTAwMClcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBleGlzdGluZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zbmFja2JhcicpXHJcbiAgICBpZiAoZXhpc3RpbmcgIT0gbnVsbCkge1xyXG4gICAgICAgIGV4aXN0aW5nLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgICAgICAgc2V0VGltZW91dChhZGQsIDMwMClcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYWRkKClcclxuICAgIH1cclxufVxyXG4iLCJcclxuLyoqXHJcbiAqIENvb2tpZSBmdW5jdGlvbnMgKGEgY29va2llIGlzIGEgc21hbGwgdGV4dCBkb2N1bWVudCB0aGF0IHRoZSBicm93c2VyIGNhbiByZW1lbWJlcilcclxuICovXHJcblxyXG4vKipcclxuICogUmV0cmlldmVzIGEgY29va2llXHJcbiAqIEBwYXJhbSBjbmFtZSB0aGUgbmFtZSBvZiB0aGUgY29va2llIHRvIHJldHJpZXZlXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29va2llKGNuYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgY29uc3QgbmFtZSA9IGNuYW1lICsgJz0nXHJcbiAgICBjb25zdCBjb29raWVQYXJ0ID0gZG9jdW1lbnQuY29va2llLnNwbGl0KCc7JykuZmluZCgoYykgPT4gYy5pbmNsdWRlcyhuYW1lKSlcclxuICAgIGlmIChjb29raWVQYXJ0KSByZXR1cm4gY29va2llUGFydC5zdWJzdHJpbmcobmFtZS5sZW5ndGgpXHJcbiAgICByZXR1cm4gJycgLy8gQmxhbmsgaWYgY29va2llIG5vdCBmb3VuZFxyXG4gIH1cclxuXHJcbi8qKiBTZXRzIHRoZSB2YWx1ZSBvZiBhIGNvb2tpZVxyXG4gKiBAcGFyYW0gY25hbWUgdGhlIG5hbWUgb2YgdGhlIGNvb2tpZSB0byBzZXRcclxuICogQHBhcmFtIGN2YWx1ZSB0aGUgdmFsdWUgdG8gc2V0IHRoZSBjb29raWUgdG9cclxuICogQHBhcmFtIGV4ZGF5cyB0aGUgbnVtYmVyIG9mIGRheXMgdGhhdCB0aGUgY29va2llIHdpbGwgZXhwaXJlIGluIChhbmQgbm90IGJlIGV4aXN0ZW50IGFueW1vcmUpXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gc2V0Q29va2llKGNuYW1lOiBzdHJpbmcsIGN2YWx1ZTogc3RyaW5nLCBleGRheXM6IG51bWJlcik6IHZvaWQge1xyXG4gICAgY29uc3QgZCA9IG5ldyBEYXRlKClcclxuICAgIGQuc2V0VGltZShkLmdldFRpbWUoKSArIChleGRheXMgKiAyNCAqIDYwICogNjAgKiAxMDAwKSlcclxuICAgIGNvbnN0IGV4cGlyZXMgPSBgZXhwaXJlcz0ke2QudG9VVENTdHJpbmcoKX1gXHJcbiAgICBkb2N1bWVudC5jb29raWUgPSBjbmFtZSArICc9JyArIGN2YWx1ZSArICc7ICcgKyBleHBpcmVzXHJcbiAgfVxyXG5cclxuLyoqXHJcbiAqIERlbGV0cyBhIGNvb2tpZVxyXG4gKiBAcGFyYW0gY25hbWUgdGhlIG5hbWUgb2YgdGhlIGNvb2tpZSB0byBkZWxldGVcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBkZWxldGVDb29raWUoY25hbWU6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgLy8gVGhpcyBpcyBsaWtlICpzZXRDb29raWUqLCBidXQgc2V0cyB0aGUgZXhwaXJ5IGRhdGUgdG8gc29tZXRoaW5nIGluIHRoZSBwYXN0IHNvIHRoZSBjb29raWUgaXMgZGVsZXRlZC5cclxuICAgIGRvY3VtZW50LmNvb2tpZSA9IGNuYW1lICsgJz07IGV4cGlyZXM9VGh1LCAwMSBKYW4gMTk3MCAwMDowMDowMSBHTVQ7J1xyXG59XHJcbiIsImV4cG9ydCBmdW5jdGlvbiB0em9mZigpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIChuZXcgRGF0ZSgpKS5nZXRUaW1lem9uZU9mZnNldCgpICogMTAwMCAqIDYwIC8vIEZvciBmdXR1cmUgY2FsY3VsYXRpb25zXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB0b0RhdGVOdW0oZGF0ZTogRGF0ZXxudW1iZXIpOiBudW1iZXIge1xyXG4gICAgY29uc3QgbnVtID0gZGF0ZSBpbnN0YW5jZW9mIERhdGUgPyBkYXRlLmdldFRpbWUoKSA6IGRhdGVcclxuICAgIHJldHVybiBNYXRoLmZsb29yKChudW0gLSB0em9mZigpKSAvIDEwMDAgLyAzNjAwIC8gMjQpXHJcbn1cclxuXHJcbi8vICpGcm9tRGF0ZU51bSogY29udmVydHMgYSBudW1iZXIgb2YgZGF5cyB0byBhIG51bWJlciBvZiBzZWNvbmRzXHJcbmV4cG9ydCBmdW5jdGlvbiBmcm9tRGF0ZU51bShkYXlzOiBudW1iZXIpOiBEYXRlIHtcclxuICAgIGNvbnN0IGQgPSBuZXcgRGF0ZSgoZGF5cyAqIDEwMDAgKiAzNjAwICogMjQpICsgdHpvZmYoKSlcclxuICAgIC8vIFRoZSBjaGVja3MgYmVsb3cgYXJlIHRvIGhhbmRsZSBkYXlsaWdodCBzYXZpbmdzIHRpbWVcclxuICAgIGlmIChkLmdldEhvdXJzKCkgPT09IDEpIHsgZC5zZXRIb3VycygwKSB9XHJcbiAgICBpZiAoKGQuZ2V0SG91cnMoKSA9PT0gMjIpIHx8IChkLmdldEhvdXJzKCkgPT09IDIzKSkge1xyXG4gICAgICBkLnNldEhvdXJzKDI0KVxyXG4gICAgICBkLnNldE1pbnV0ZXMoMClcclxuICAgICAgZC5zZXRTZWNvbmRzKDApXHJcbiAgICB9XHJcbiAgICByZXR1cm4gZFxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdG9kYXkoKTogbnVtYmVyIHtcclxuICAgIHJldHVybiB0b0RhdGVOdW0obmV3IERhdGUoKSlcclxufVxyXG5cclxuLyoqXHJcbiAqIEl0ZXJhdGVzIGZyb20gdGhlIHN0YXJ0aW5nIGRhdGUgdG8gZW5kaW5nIGRhdGUgaW5jbHVzaXZlXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gaXRlckRheXMoc3RhcnQ6IERhdGUsIGVuZDogRGF0ZSwgY2I6IChkYXRlOiBEYXRlKSA9PiB2b2lkKTogdm9pZCB7XHJcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmUgbm8tbG9vcHNcclxuICAgIGZvciAoY29uc3QgZCA9IG5ldyBEYXRlKHN0YXJ0KTsgZCA8PSBlbmQ7IGQuc2V0RGF0ZShkLmdldERhdGUoKSArIDEpKSB7XHJcbiAgICAgICAgY2IoZClcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBjb21wdXRlV2Vla0lkLCBjcmVhdGVBc3NpZ25tZW50LCBnZXRFUywgc2VwYXJhdGVkQ2xhc3MgfSBmcm9tICcuL2NvbXBvbmVudHMvYXNzaWdubWVudCdcclxuaW1wb3J0IHsgY3JlYXRlRGF5LCBjcmVhdGVXZWVrIH0gZnJvbSAnLi9jb21wb25lbnRzL2NhbGVuZGFyJ1xyXG5pbXBvcnQgeyBkaXNwbGF5RXJyb3IgfSBmcm9tICcuL2NvbXBvbmVudHMvZXJyb3JEaXNwbGF5J1xyXG5pbXBvcnQgeyByZXNpemUgfSBmcm9tICcuL2NvbXBvbmVudHMvcmVzaXplcidcclxuaW1wb3J0IHsgZnJvbURhdGVOdW0sIGl0ZXJEYXlzLCB0b2RheSB9IGZyb20gJy4vZGF0ZXMnXHJcbmltcG9ydCB7IGNsYXNzQnlJZCwgZ2V0RGF0YSwgSUFwcGxpY2F0aW9uRGF0YSwgSUFzc2lnbm1lbnQgfSBmcm9tICcuL3BjcidcclxuaW1wb3J0IHsgYWRkQWN0aXZpdHksIHNhdmVBY3Rpdml0eSB9IGZyb20gJy4vcGx1Z2lucy9hY3Rpdml0eSdcclxuaW1wb3J0IHsgZXh0cmFUb1Rhc2ssIGdldEV4dHJhLCBJQ3VzdG9tQXNzaWdubWVudCB9IGZyb20gJy4vcGx1Z2lucy9jdXN0b21Bc3NpZ25tZW50cydcclxuaW1wb3J0IHsgYXNzaWdubWVudEluRG9uZSwgcmVtb3ZlRnJvbURvbmUsIHNhdmVEb25lIH0gZnJvbSAnLi9wbHVnaW5zL2RvbmUnXHJcbmltcG9ydCB7IGFzc2lnbm1lbnRJbk1vZGlmaWVkLCByZW1vdmVGcm9tTW9kaWZpZWQsIHNhdmVNb2RpZmllZCB9IGZyb20gJy4vcGx1Z2lucy9tb2RpZmllZEFzc2lnbm1lbnRzJ1xyXG5pbXBvcnQgeyBzZXR0aW5ncyB9IGZyb20gJy4vc2V0dGluZ3MnXHJcbmltcG9ydCB7IF8kLCBkYXRlU3RyaW5nLCBlbGVtQnlJZCwgZWxlbWVudCwgbG9jYWxTdG9yYWdlUmVhZCwgc21vb3RoU2Nyb2xsIH0gZnJvbSAnLi91dGlsJ1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJU3BsaXRBc3NpZ25tZW50IHtcclxuICAgIGFzc2lnbm1lbnQ6IElBc3NpZ25tZW50XHJcbiAgICBzdGFydDogRGF0ZVxyXG4gICAgZW5kOiBEYXRlfCdGb3JldmVyJ1xyXG4gICAgY3VzdG9tOiBib29sZWFuXHJcbiAgICByZWZlcmVuY2U/OiBJQ3VzdG9tQXNzaWdubWVudFxyXG59XHJcblxyXG5jb25zdCBTQ0hFRFVMRV9FTkRTID0ge1xyXG4gICAgZGF5OiAoZGF0ZTogRGF0ZSkgPT4gMjQgKiAzNjAwICogMTAwMCxcclxuICAgIG1zOiAoZGF0ZTogRGF0ZSkgPT4gWzI0LCAgICAgICAgICAgICAgLy8gU3VuZGF5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAxNSArICgzNSAvIDYwKSwgIC8vIE1vbmRheVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgMTUgKyAoMzUgLyA2MCksICAvLyBUdWVzZGF5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAxNSArICgxNSAvIDYwKSwgIC8vIFdlZG5lc2RheVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgMTUgKyAoMTUgLyA2MCksICAvLyBUaHVyc2RheVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgMTUgKyAoMTUgLyA2MCksICAvLyBGcmlkYXlcclxuICAgICAgICAgICAgICAgICAgICAgICAgIDI0ICAgICAgICAgICAgICAgLy8gU2F0dXJkYXlcclxuICAgICAgICAgICAgICAgICAgICAgICAgXVtkYXRlLmdldERheSgpXSxcclxuICAgIHVzOiAoZGF0ZTogRGF0ZSkgPT4gMTUgKiAzNjAwICogMTAwMFxyXG59XHJcbmNvbnN0IFdFRUtFTkRfQ0xBU1NOQU1FUyA9IFsnZnJvbVdlZWtlbmQnLCAnb3ZlcldlZWtlbmQnXVxyXG5cclxubGV0IHNjcm9sbCA9IDAgLy8gVGhlIGxvY2F0aW9uIHRvIHNjcm9sbCB0byBpbiBvcmRlciB0byByZWFjaCB0b2RheSBpbiBjYWxlbmRhciB2aWV3XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2Nyb2xsKCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gc2Nyb2xsXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRUaW1lQWZ0ZXIoZGF0ZTogRGF0ZSk6IG51bWJlciB7XHJcbiAgICBjb25zdCBoaWRlQXNzaWdubWVudHMgPSBzZXR0aW5ncy5oaWRlQXNzaWdubWVudHNcclxuICAgIGlmIChoaWRlQXNzaWdubWVudHMgPT09ICdkYXknIHx8IGhpZGVBc3NpZ25tZW50cyA9PT0gJ21zJyB8fCBoaWRlQXNzaWdubWVudHMgPT09ICd1cycpIHtcclxuICAgICAgICByZXR1cm4gU0NIRURVTEVfRU5EU1toaWRlQXNzaWdubWVudHNdKGRhdGUpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBTQ0hFRFVMRV9FTkRTLmRheShkYXRlKVxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRTdGFydEVuZERhdGVzKGRhdGE6IElBcHBsaWNhdGlvbkRhdGEpOiB7c3RhcnQ6IERhdGUsIGVuZDogRGF0ZSB9IHtcclxuICAgIGlmIChkYXRhLm1vbnRoVmlldykge1xyXG4gICAgICAgIGNvbnN0IHN0YXJ0TiA9IE1hdGgubWluKC4uLmRhdGEuYXNzaWdubWVudHMubWFwKChhKSA9PiBhLnN0YXJ0KSkgLy8gU21hbGxlc3QgZGF0ZVxyXG4gICAgICAgIGNvbnN0IGVuZE4gPSBNYXRoLm1heCguLi5kYXRhLmFzc2lnbm1lbnRzLm1hcCgoYSkgPT4gYS5zdGFydCkpIC8vIExhcmdlc3QgZGF0ZVxyXG5cclxuICAgICAgICBjb25zdCB5ZWFyID0gKG5ldyBEYXRlKCkpLmdldEZ1bGxZZWFyKCkgLy8gRm9yIGZ1dHVyZSBjYWxjdWxhdGlvbnNcclxuXHJcbiAgICAgICAgLy8gQ2FsY3VsYXRlIHdoYXQgbW9udGggd2Ugd2lsbCBiZSBkaXNwbGF5aW5nIGJ5IGZpbmRpbmcgdGhlIG1vbnRoIG9mIHRvZGF5XHJcbiAgICAgICAgY29uc3QgbW9udGggPSAobmV3IERhdGUoKSkuZ2V0TW9udGgoKVxyXG5cclxuICAgICAgICAvLyBNYWtlIHN1cmUgdGhlIHN0YXJ0IGFuZCBlbmQgZGF0ZXMgbGllIHdpdGhpbiB0aGUgbW9udGhcclxuICAgICAgICBjb25zdCBzdGFydCA9IG5ldyBEYXRlKE1hdGgubWF4KGZyb21EYXRlTnVtKHN0YXJ0TikuZ2V0VGltZSgpLCAobmV3IERhdGUoeWVhciwgbW9udGgpKS5nZXRUaW1lKCkpKVxyXG4gICAgICAgIC8vIElmIHRoZSBkYXkgYXJndW1lbnQgZm9yIERhdGUgaXMgMCwgdGhlbiB0aGUgcmVzdWx0aW5nIGRhdGUgd2lsbCBiZSBvZiB0aGUgcHJldmlvdXMgbW9udGhcclxuICAgICAgICBjb25zdCBlbmQgPSBuZXcgRGF0ZShNYXRoLm1pbihmcm9tRGF0ZU51bShlbmROKS5nZXRUaW1lKCksIChuZXcgRGF0ZSh5ZWFyLCBtb250aCArIDEsIDApKS5nZXRUaW1lKCkpKVxyXG4gICAgICAgIHJldHVybiB7IHN0YXJ0LCBlbmQgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IHRvZGF5U0UgPSBuZXcgRGF0ZSgpXHJcbiAgICAgICAgY29uc3Qgc3RhcnQgPSBuZXcgRGF0ZSh0b2RheVNFLmdldEZ1bGxZZWFyKCksIHRvZGF5U0UuZ2V0TW9udGgoKSwgdG9kYXlTRS5nZXREYXRlKCkpXHJcbiAgICAgICAgY29uc3QgZW5kID0gbmV3IERhdGUodG9kYXlTRS5nZXRGdWxsWWVhcigpLCB0b2RheVNFLmdldE1vbnRoKCksIHRvZGF5U0UuZ2V0RGF0ZSgpKVxyXG4gICAgICAgIHJldHVybiB7IHN0YXJ0LCBlbmQgfVxyXG4gICAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEFzc2lnbm1lbnRTcGxpdHMoYXNzaWdubWVudDogSUFzc2lnbm1lbnQsIHN0YXJ0OiBEYXRlLCBlbmQ6IERhdGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVmZXJlbmNlPzogSUN1c3RvbUFzc2lnbm1lbnQpOiBJU3BsaXRBc3NpZ25tZW50W10ge1xyXG4gICAgY29uc3Qgc3BsaXQ6IElTcGxpdEFzc2lnbm1lbnRbXSA9IFtdXHJcbiAgICBpZiAoc2V0dGluZ3MuYXNzaWdubWVudFNwYW4gPT09ICdtdWx0aXBsZScpIHtcclxuICAgICAgICBjb25zdCBzID0gTWF0aC5tYXgoc3RhcnQuZ2V0VGltZSgpLCBmcm9tRGF0ZU51bShhc3NpZ25tZW50LnN0YXJ0KS5nZXRUaW1lKCkpXHJcbiAgICAgICAgY29uc3QgZSA9IGFzc2lnbm1lbnQuZW5kID09PSAnRm9yZXZlcicgPyBzIDogTWF0aC5taW4oZW5kLmdldFRpbWUoKSwgZnJvbURhdGVOdW0oYXNzaWdubWVudC5lbmQpLmdldFRpbWUoKSlcclxuICAgICAgICBjb25zdCBzcGFuID0gKChlIC0gcykgLyAxMDAwIC8gMzYwMCAvIDI0KSArIDEgLy8gTnVtYmVyIG9mIGRheXMgYXNzaWdubWVudCB0YWtlcyB1cFxyXG4gICAgICAgIGNvbnN0IHNwYW5SZWxhdGl2ZSA9IDYgLSAobmV3IERhdGUocykpLmdldERheSgpIC8vIE51bWJlciBvZiBkYXlzIHVudGlsIHRoZSBuZXh0IFNhdHVyZGF5XHJcblxyXG4gICAgICAgIGNvbnN0IG5zID0gbmV3IERhdGUocylcclxuICAgICAgICBucy5zZXREYXRlKG5zLmdldERhdGUoKSArIHNwYW5SZWxhdGl2ZSkgLy8gIFRoZSBkYXRlIG9mIHRoZSBuZXh0IFNhdHVyZGF5XHJcblxyXG4gICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZSBuby1sb29wc1xyXG4gICAgICAgIGZvciAobGV0IG4gPSAtNjsgbiA8IHNwYW4gLSBzcGFuUmVsYXRpdmU7IG4gKz0gNykge1xyXG4gICAgICAgICAgICBjb25zdCBsYXN0U3VuID0gbmV3IERhdGUobnMpXHJcbiAgICAgICAgICAgIGxhc3RTdW4uc2V0RGF0ZShsYXN0U3VuLmdldERhdGUoKSArIG4pXHJcblxyXG4gICAgICAgICAgICBjb25zdCBuZXh0U2F0ID0gbmV3IERhdGUobGFzdFN1bilcclxuICAgICAgICAgICAgbmV4dFNhdC5zZXREYXRlKG5leHRTYXQuZ2V0RGF0ZSgpICsgNilcclxuICAgICAgICAgICAgc3BsaXQucHVzaCh7XHJcbiAgICAgICAgICAgICAgICBhc3NpZ25tZW50LFxyXG4gICAgICAgICAgICAgICAgc3RhcnQ6IG5ldyBEYXRlKE1hdGgubWF4KHMsIGxhc3RTdW4uZ2V0VGltZSgpKSksXHJcbiAgICAgICAgICAgICAgICBlbmQ6IG5ldyBEYXRlKE1hdGgubWluKGUsIG5leHRTYXQuZ2V0VGltZSgpKSksXHJcbiAgICAgICAgICAgICAgICBjdXN0b206IEJvb2xlYW4ocmVmZXJlbmNlKSxcclxuICAgICAgICAgICAgICAgIHJlZmVyZW5jZVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAoc2V0dGluZ3MuYXNzaWdubWVudFNwYW4gPT09ICdzdGFydCcpIHtcclxuICAgICAgICBjb25zdCBzID0gZnJvbURhdGVOdW0oYXNzaWdubWVudC5zdGFydClcclxuICAgICAgICBpZiAocy5nZXRUaW1lKCkgPj0gc3RhcnQuZ2V0VGltZSgpKSB7XHJcbiAgICAgICAgICAgIHNwbGl0LnB1c2goe1xyXG4gICAgICAgICAgICAgICAgYXNzaWdubWVudCxcclxuICAgICAgICAgICAgICAgIHN0YXJ0OiBzLFxyXG4gICAgICAgICAgICAgICAgZW5kOiBzLFxyXG4gICAgICAgICAgICAgICAgY3VzdG9tOiBCb29sZWFuKHJlZmVyZW5jZSksXHJcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKHNldHRpbmdzLmFzc2lnbm1lbnRTcGFuID09PSAnZW5kJykge1xyXG4gICAgICAgIGNvbnN0IGUgPSBhc3NpZ25tZW50LmVuZCA9PT0gJ0ZvcmV2ZXInID8gYXNzaWdubWVudC5lbmQgOiBmcm9tRGF0ZU51bShhc3NpZ25tZW50LmVuZClcclxuICAgICAgICBjb25zdCBkZSA9IGUgPT09ICdGb3JldmVyJyA/IGZyb21EYXRlTnVtKGFzc2lnbm1lbnQuc3RhcnQpIDogZVxyXG4gICAgICAgIGlmIChkZS5nZXRUaW1lKCkgPD0gZW5kLmdldFRpbWUoKSkge1xyXG4gICAgICAgICAgICBzcGxpdC5wdXNoKHtcclxuICAgICAgICAgICAgICAgIGFzc2lnbm1lbnQsXHJcbiAgICAgICAgICAgICAgICBzdGFydDogZGUsXHJcbiAgICAgICAgICAgICAgICBlbmQ6IGUsXHJcbiAgICAgICAgICAgICAgICBjdXN0b206IEJvb2xlYW4ocmVmZXJlbmNlKSxcclxuICAgICAgICAgICAgICAgIHJlZmVyZW5jZVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gc3BsaXRcclxufVxyXG5cclxuLy8gVGhpcyBmdW5jdGlvbiB3aWxsIGNvbnZlcnQgdGhlIGFycmF5IG9mIGFzc2lnbm1lbnRzIGdlbmVyYXRlZCBieSAqcGFyc2UqIGludG8gcmVhZGFibGUgSFRNTC5cclxuZXhwb3J0IGZ1bmN0aW9uIGRpc3BsYXkoZG9TY3JvbGw6IGJvb2xlYW4gPSB0cnVlKTogdm9pZCB7XHJcbiAgICBjb25zb2xlLnRpbWUoJ0Rpc3BsYXlpbmcgZGF0YScpXHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IGRhdGEgPSBnZXREYXRhKClcclxuICAgICAgICBpZiAoIWRhdGEpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdEYXRhIHNob3VsZCBoYXZlIGJlZW4gZmV0Y2hlZCBiZWZvcmUgZGlzcGxheSgpIHdhcyBjYWxsZWQnKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5zZXRBdHRyaWJ1dGUoJ2RhdGEtcGNydmlldycsIGRhdGEubW9udGhWaWV3ID8gJ21vbnRoJyA6ICdvdGhlcicpXHJcbiAgICAgICAgY29uc3QgbWFpbiA9IF8kKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ21haW4nKSlcclxuICAgICAgICBjb25zdCB0YWtlbjogeyBbZGF0ZTogbnVtYmVyXTogbnVtYmVyW10gfSA9IHt9XHJcblxyXG4gICAgICAgIGNvbnN0IHRpbWVhZnRlciA9IGdldFRpbWVBZnRlcihuZXcgRGF0ZSgpKVxyXG5cclxuICAgICAgICBjb25zdCB7c3RhcnQsIGVuZH0gPSBnZXRTdGFydEVuZERhdGVzKGRhdGEpXHJcblxyXG4gICAgICAgIC8vIFNldCB0aGUgc3RhcnQgZGF0ZSB0byBiZSBhIFN1bmRheSBhbmQgdGhlIGVuZCBkYXRlIHRvIGJlIGEgU2F0dXJkYXlcclxuICAgICAgICBzdGFydC5zZXREYXRlKHN0YXJ0LmdldERhdGUoKSAtIHN0YXJ0LmdldERheSgpKVxyXG4gICAgICAgIGVuZC5zZXREYXRlKGVuZC5nZXREYXRlKCkgKyAoNiAtIGVuZC5nZXREYXkoKSkpXHJcblxyXG4gICAgICAgIC8vIEZpcnN0IHBvcHVsYXRlIHRoZSBjYWxlbmRhciB3aXRoIGJveGVzIGZvciBlYWNoIGRheVxyXG4gICAgICAgIGNvbnN0IGxhc3REYXRhID0gbG9jYWxTdG9yYWdlUmVhZCgnZGF0YScpIGFzIElBcHBsaWNhdGlvbkRhdGFcclxuICAgICAgICBsZXQgd2s6IEhUTUxFbGVtZW50fG51bGwgPSBudWxsXHJcbiAgICAgICAgaXRlckRheXMoc3RhcnQsIGVuZCwgKGQpID0+IHtcclxuICAgICAgICAgICAgaWYgKGQuZ2V0RGF5KCkgPT09IDApIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGlkID0gYHdrJHtkLmdldE1vbnRoKCl9LSR7ZC5nZXREYXRlKCl9YCAvLyBEb24ndCBjcmVhdGUgYSBuZXcgd2VlayBlbGVtZW50IGlmIG9uZSBhbHJlYWR5IGV4aXN0c1xyXG4gICAgICAgICAgICAgICAgd2sgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZClcclxuICAgICAgICAgICAgICAgIGlmICh3ayA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd2sgPSBjcmVhdGVXZWVrKGlkKVxyXG4gICAgICAgICAgICAgICAgICAgIG1haW4uYXBwZW5kQ2hpbGQod2spXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghd2spIHRocm93IG5ldyBFcnJvcihgRXhwZWN0ZWQgd2VlayBlbGVtZW50IG9uIGRheSAke2R9IHRvIG5vdCBiZSBudWxsYClcclxuICAgICAgICAgICAgaWYgKHdrLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2RheScpLmxlbmd0aCA8PSBkLmdldERheSgpKSB7XHJcbiAgICAgICAgICAgICAgICB3ay5hcHBlbmRDaGlsZChjcmVhdGVEYXkoZCkpXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRha2VuW2QuZ2V0VGltZSgpXSA9IFtdXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgLy8gU3BsaXQgYXNzaWdubWVudHMgdGFraW5nIG1vcmUgdGhhbiAxIHdlZWtcclxuICAgICAgICBjb25zdCBzcGxpdDogSVNwbGl0QXNzaWdubWVudFtdID0gW11cclxuICAgICAgICBkYXRhLmFzc2lnbm1lbnRzLmZvckVhY2goKGFzc2lnbm1lbnQsIG51bSkgPT4ge1xyXG4gICAgICAgICAgICBzcGxpdC5wdXNoKC4uLmdldEFzc2lnbm1lbnRTcGxpdHMoYXNzaWdubWVudCwgc3RhcnQsIGVuZCkpXHJcblxyXG4gICAgICAgICAgICAvLyBBY3Rpdml0eSBzdHVmZlxyXG4gICAgICAgICAgICBpZiAobGFzdERhdGEgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgb2xkQXNzaWdubWVudCA9IGxhc3REYXRhLmFzc2lnbm1lbnRzLmZpbmQoKGEpID0+IGEuaWQgPT09IGFzc2lnbm1lbnQuaWQpXHJcbiAgICAgICAgICAgICAgICBpZiAob2xkQXNzaWdubWVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvbGRBc3NpZ25tZW50LmJvZHkgIT09IGFzc2lnbm1lbnQuYm9keSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRBY3Rpdml0eSgnZWRpdCcsIG9sZEFzc2lnbm1lbnQsIG5ldyBEYXRlKCksIHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9sZEFzc2lnbm1lbnQuY2xhc3MgIT0gbnVsbCA/IGxhc3REYXRhLmNsYXNzZXNbb2xkQXNzaWdubWVudC5jbGFzc10gOiB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbW92ZUZyb21Nb2RpZmllZChhc3NpZ25tZW50LmlkKSAvLyBJZiB0aGUgYXNzaWdubWVudCBpcyBtb2RpZmllZCwgcmVzZXQgaXRcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgbGFzdERhdGEuYXNzaWdubWVudHMuc3BsaWNlKGxhc3REYXRhLmFzc2lnbm1lbnRzLmluZGV4T2Yob2xkQXNzaWdubWVudCksIDEpXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGFkZEFjdGl2aXR5KCdhZGQnLCBhc3NpZ25tZW50LCBuZXcgRGF0ZSgpLCB0cnVlKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgaWYgKGxhc3REYXRhICE9IG51bGwpIHtcclxuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgYW55IG9mIHRoZSBsYXN0IGFzc2lnbm1lbnRzIHdlcmVuJ3QgZGVsZXRlZCAoc28gdGhleSBoYXZlIGJlZW4gZGVsZXRlZCBpbiBQQ1IpXHJcbiAgICAgICAgICAgIGxhc3REYXRhLmFzc2lnbm1lbnRzLmZvckVhY2goKGFzc2lnbm1lbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIGFkZEFjdGl2aXR5KCdkZWxldGUnLCBhc3NpZ25tZW50LCBuZXcgRGF0ZSgpLCB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXNzaWdubWVudC5jbGFzcyAhPSBudWxsID8gbGFzdERhdGEuY2xhc3Nlc1thc3NpZ25tZW50LmNsYXNzXSA6IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgIHJlbW92ZUZyb21Eb25lKGFzc2lnbm1lbnQuaWQpXHJcbiAgICAgICAgICAgICAgICByZW1vdmVGcm9tTW9kaWZpZWQoYXNzaWdubWVudC5pZClcclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIC8vIFRoZW4gc2F2ZSBhIG1heGltdW0gb2YgMTI4IGFjdGl2aXR5IGl0ZW1zXHJcbiAgICAgICAgICAgIHNhdmVBY3Rpdml0eSgpXHJcblxyXG4gICAgICAgICAgICAvLyBBbmQgY29tcGxldGVkIGFzc2lnbm1lbnRzICsgbW9kaWZpY2F0aW9uc1xyXG4gICAgICAgICAgICBzYXZlRG9uZSgpXHJcbiAgICAgICAgICAgIHNhdmVNb2RpZmllZCgpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBBZGQgY3VzdG9tIGFzc2lnbm1lbnRzIHRvIHRoZSBzcGxpdCBhcnJheVxyXG4gICAgICAgIGdldEV4dHJhKCkuZm9yRWFjaCgoY3VzdG9tKSA9PiB7XHJcbiAgICAgICAgICAgIHNwbGl0LnB1c2goLi4uZ2V0QXNzaWdubWVudFNwbGl0cyhleHRyYVRvVGFzayhjdXN0b20sIGRhdGEpLCBzdGFydCwgZW5kLCBjdXN0b20pKVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIC8vIENhbGN1bGF0ZSB0aGUgdG9kYXkncyB3ZWVrIGlkXHJcbiAgICAgICAgY29uc3QgdGRzdCA9IG5ldyBEYXRlKClcclxuICAgICAgICB0ZHN0LnNldERhdGUodGRzdC5nZXREYXRlKCkgLSB0ZHN0LmdldERheSgpKVxyXG4gICAgICAgIGNvbnN0IHRvZGF5V2tJZCA9IGB3ayR7dGRzdC5nZXRNb250aCgpfS0ke3Rkc3QuZ2V0RGF0ZSgpfWBcclxuXHJcbiAgICAgICAgLy8gVGhlbiBhZGQgYXNzaWdubWVudHNcclxuICAgICAgICBjb25zdCB3ZWVrSGVpZ2h0czogeyBbd2Vla0lkOiBzdHJpbmddOiBudW1iZXIgfSA9IHt9XHJcbiAgICAgICAgY29uc3QgcHJldmlvdXNBc3NpZ25tZW50czogeyBbaWQ6IHN0cmluZ106IEhUTUxFbGVtZW50IH0gPSB7fVxyXG4gICAgICAgIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYXNzaWdubWVudCcpLCAoYXNzaWdubWVudDogSFRNTEVsZW1lbnQpID0+IHtcclxuICAgICAgICAgICAgcHJldmlvdXNBc3NpZ25tZW50c1thc3NpZ25tZW50LmlkXSA9IGFzc2lnbm1lbnRcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICBzcGxpdC5mb3JFYWNoKChzKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHdlZWtJZCA9IGNvbXB1dGVXZWVrSWQocylcclxuICAgICAgICAgICAgd2sgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh3ZWVrSWQpXHJcbiAgICAgICAgICAgIGlmICh3ayA9PSBudWxsKSByZXR1cm5cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGUgPSBjcmVhdGVBc3NpZ25tZW50KHMsIGRhdGEpXHJcblxyXG4gICAgICAgICAgICAvLyBDYWxjdWxhdGUgaG93IG1hbnkgYXNzaWdubWVudHMgYXJlIHBsYWNlZCBiZWZvcmUgdGhlIGN1cnJlbnQgb25lXHJcbiAgICAgICAgICAgIGlmICghcy5jdXN0b20gfHwgIXNldHRpbmdzLnNlcFRhc2tzKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcG9zID0gMFxyXG4gICAgICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lIG5vLWxvb3BzXHJcbiAgICAgICAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBmb3VuZCA9IHRydWVcclxuICAgICAgICAgICAgICAgICAgICBpdGVyRGF5cyhzLnN0YXJ0LCBzLmVuZCA9PT0gJ0ZvcmV2ZXInID8gcy5zdGFydCA6IHMuZW5kLCAoZCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGFrZW5bZC5nZXRUaW1lKCldLmluZGV4T2YocG9zKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kID0gZmFsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZvdW5kKSB7IGJyZWFrIH1cclxuICAgICAgICAgICAgICAgICAgICBwb3MrK1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIEFwcGVuZCB0aGUgcG9zaXRpb24gdGhlIGFzc2lnbm1lbnQgaXMgYXQgdG8gdGhlIHRha2VuIGFycmF5XHJcbiAgICAgICAgICAgICAgICBpdGVyRGF5cyhzLnN0YXJ0LCBzLmVuZCA9PT0gJ0ZvcmV2ZXInID8gcy5zdGFydCA6IHMuZW5kLCAoZCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRha2VuW2QuZ2V0VGltZSgpXS5wdXNoKHBvcylcclxuICAgICAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICAgICAgLy8gQ2FsY3VsYXRlIGhvdyBmYXIgZG93biB0aGUgYXNzaWdubWVudCBtdXN0IGJlIHBsYWNlZCBhcyB0byBub3QgYmxvY2sgdGhlIG9uZXMgYWJvdmUgaXRcclxuICAgICAgICAgICAgICAgIGUuc3R5bGUubWFyZ2luVG9wID0gKHBvcyAqIDMwKSArICdweCdcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoKHdlZWtIZWlnaHRzW3dlZWtJZF0gPT0gbnVsbCkgfHwgKHBvcyA+IHdlZWtIZWlnaHRzW3dlZWtJZF0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd2Vla0hlaWdodHNbd2Vla0lkXSA9IHBvc1xyXG4gICAgICAgICAgICAgICAgICAgIHdrLnN0eWxlLmhlaWdodCA9IDQ3ICsgKChwb3MgKyAxKSAqIDMwKSArICdweCdcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gSWYgdGhlIGFzc2lnbm1lbnQgaXMgYSB0ZXN0IGFuZCBpcyB1cGNvbWluZywgYWRkIGl0IHRvIHRoZSB1cGNvbWluZyB0ZXN0cyBwYW5lbC5cclxuICAgICAgICAgICAgaWYgKHMuYXNzaWdubWVudC5lbmQgPj0gdG9kYXkoKSAmJiAocy5hc3NpZ25tZW50LmJhc2VUeXBlID09PSAndGVzdCcgfHxcclxuICAgICAgICAgICAgICAgIChzZXR0aW5ncy5wcm9qZWN0c0luVGVzdFBhbmUgJiYgcy5hc3NpZ25tZW50LmJhc2VUeXBlID09PSAnbG9uZ3Rlcm0nKSkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRlID0gZWxlbWVudCgnZGl2JywgWyd1cGNvbWluZ1Rlc3QnLCAnYXNzaWdubWVudEl0ZW0nLCBzLmFzc2lnbm1lbnQuYmFzZVR5cGVdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGA8aSBjbGFzcz0nbWF0ZXJpYWwtaWNvbnMnPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtzLmFzc2lnbm1lbnQuYmFzZVR5cGUgPT09ICdsb25ndGVybScgPyAnYXNzaWdubWVudCcgOiAnYXNzZXNzbWVudCd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvaT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9J3RpdGxlJz4ke3MuYXNzaWdubWVudC50aXRsZX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzbWFsbD4ke3NlcGFyYXRlZENsYXNzKHMuYXNzaWdubWVudCwgZGF0YSlbMl19PC9zbWFsbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz0ncmFuZ2UnPiR7ZGF0ZVN0cmluZyhzLmFzc2lnbm1lbnQuZW5kLCB0cnVlKX08L2Rpdj5gLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGB0ZXN0JHtzLmFzc2lnbm1lbnQuaWR9YClcclxuICAgICAgICAgICAgICAgIGlmIChzLmFzc2lnbm1lbnQuY2xhc3MpIHRlLnNldEF0dHJpYnV0ZSgnZGF0YS1jbGFzcycsIGRhdGEuY2xhc3Nlc1tzLmFzc2lnbm1lbnQuY2xhc3NdKVxyXG4gICAgICAgICAgICAgICAgdGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZG9TY3JvbGxpbmcgPSBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHNtb290aFNjcm9sbCgoZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgKyBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCkgLSAxMTYpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGUuY2xpY2soKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAoZG9jdW1lbnQuYm9keS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmlldycpID09PSAnMCcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZG9TY3JvbGxpbmcoKVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8kKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNuYXZUYWJzPmxpOmZpcnN0LWNoaWxkJykgYXMgSFRNTEVsZW1lbnQpLmNsaWNrKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChkb1Njcm9sbGluZywgNTAwKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGFzc2lnbm1lbnRJbkRvbmUocy5hc3NpZ25tZW50LmlkKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlLmNsYXNzTGlzdC5hZGQoJ2RvbmUnKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29uc3QgdGVzdEVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgdGVzdCR7cy5hc3NpZ25tZW50LmlkfWApXHJcbiAgICAgICAgICAgICAgICBpZiAodGVzdEVsZW0pIHtcclxuICAgICAgICAgICAgICAgIHRlc3RFbGVtLmlubmVySFRNTCA9IHRlLmlubmVySFRNTFxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBlbGVtQnlJZCgnaW5mb1Rlc3RzJykuYXBwZW5kQ2hpbGQodGUpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGFscmVhZHkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChzLmFzc2lnbm1lbnQuaWQgKyB3ZWVrSWQpXHJcbiAgICAgICAgICAgIGlmIChhbHJlYWR5ICE9IG51bGwpIHsgLy8gQXNzaWdubWVudCBhbHJlYWR5IGV4aXN0c1xyXG4gICAgICAgICAgICAgICAgYWxyZWFkeS5zdHlsZS5tYXJnaW5Ub3AgPSBlLnN0eWxlLm1hcmdpblRvcFxyXG4gICAgICAgICAgICAgICAgYWxyZWFkeS5zZXRBdHRyaWJ1dGUoJ2RhdGEtY2xhc3MnLFxyXG4gICAgICAgICAgICAgICAgICAgIHMuY3VzdG9tICYmIHNldHRpbmdzLnNlcFRhc2tDbGFzcyA/ICdUYXNrJyA6IGNsYXNzQnlJZChzLmFzc2lnbm1lbnQuY2xhc3MpKVxyXG4gICAgICAgICAgICAgICAgaWYgKCFhc3NpZ25tZW50SW5Nb2RpZmllZChzLmFzc2lnbm1lbnQuaWQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxyZWFkeS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdib2R5JylbMF0uaW5uZXJIVE1MID0gZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdib2R5JylbMF0uaW5uZXJIVE1MXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBfJChhbHJlYWR5LnF1ZXJ5U2VsZWN0b3IoJy5lZGl0cycpKS5jbGFzc05hbWUgPSBfJChlLnF1ZXJ5U2VsZWN0b3IoJy5lZGl0cycpKS5jbGFzc05hbWVcclxuICAgICAgICAgICAgICAgIGlmIChhbHJlYWR5LmNsYXNzTGlzdC50b2dnbGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBhbHJlYWR5LmNsYXNzTGlzdC50b2dnbGUoJ2xpc3REaXNwJywgZS5jbGFzc0xpc3QuY29udGFpbnMoJ2xpc3REaXNwJykpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBnZXRFUyhhbHJlYWR5KS5mb3JFYWNoKChjbCkgPT4gYWxyZWFkeS5jbGFzc0xpc3QucmVtb3ZlKGNsKSlcclxuICAgICAgICAgICAgICAgIGdldEVTKGUpLmZvckVhY2goKGNsKSA9PiBhbHJlYWR5LmNsYXNzTGlzdC5hZGQoY2wpKVxyXG4gICAgICAgICAgICAgICAgV0VFS0VORF9DTEFTU05BTUVTLmZvckVhY2goKGNsKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxyZWFkeS5jbGFzc0xpc3QucmVtb3ZlKGNsKVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChlLmNsYXNzTGlzdC5jb250YWlucyhjbCkpIGFscmVhZHkuY2xhc3NMaXN0LmFkZChjbClcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocy5jdXN0b20gJiYgc2V0dGluZ3Muc2VwVGFza3MpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzdCA9IE1hdGguZmxvb3Iocy5zdGFydC5nZXRUaW1lKCkgLyAxMDAwIC8gMzYwMCAvIDI0KVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICgocy5hc3NpZ25tZW50LnN0YXJ0ID09PSBzdCkgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgKHMuYXNzaWdubWVudC5lbmQgPT09ICdGb3JldmVyJyB8fCBzLmFzc2lnbm1lbnQuZW5kID49IHRvZGF5KCkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGUuY2xhc3NMaXN0LnJlbW92ZSgnYXNzaWdubWVudCcpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGUuY2xhc3NMaXN0LmFkZCgndGFza1BhbmVJdGVtJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgZS5zdHlsZS5vcmRlciA9IFN0cmluZyhzLmFzc2lnbm1lbnQuZW5kID09PSAnRm9yZXZlcicgPyBOdW1iZXIuTUFYX1ZBTFVFIDogcy5hc3NpZ25tZW50LmVuZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbGluayA9IGUucXVlcnlTZWxlY3RvcignLmxpbmtlZCcpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsaW5rKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLmluc2VydEJlZm9yZShlbGVtZW50KCdzbWFsbCcsIFtdLCBsaW5rLmlubmVySFRNTCksIGxpbmspXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5rLnJlbW92ZSgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbUJ5SWQoJ2luZm9UYXNrc0lubmVyJykuYXBwZW5kQ2hpbGQoZSlcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgeyB3ay5hcHBlbmRDaGlsZChlKSB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZGVsZXRlIHByZXZpb3VzQXNzaWdubWVudHNbcy5hc3NpZ25tZW50LmlkICsgd2Vla0lkXVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIC8vIERlbGV0ZSBhbnkgYXNzaWdubWVudHMgdGhhdCBoYXZlIGJlZW4gZGVsZXRlZCBzaW5jZSB1cGRhdGluZ1xyXG4gICAgICAgIE9iamVjdC5lbnRyaWVzKHByZXZpb3VzQXNzaWdubWVudHMpLmZvckVhY2goKFtuYW1lLCBhc3NpZ25tZW50XSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoYXNzaWdubWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2Z1bGwnKSkge1xyXG4gICAgICAgICAgICAgICAgZWxlbUJ5SWQoJ2JhY2tncm91bmQnKS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGFzc2lnbm1lbnQucmVtb3ZlKClcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICAvLyBTY3JvbGwgdG8gdGhlIGNvcnJlY3QgcG9zaXRpb24gaW4gY2FsZW5kYXIgdmlld1xyXG4gICAgICAgIGlmICh3ZWVrSGVpZ2h0c1t0b2RheVdrSWRdICE9IG51bGwpIHtcclxuICAgICAgICAgICAgbGV0IGggPSAwXHJcbiAgICAgICAgICAgIGNvbnN0IHN3ID0gKHdraWQ6IHN0cmluZykgPT4gd2tpZC5zdWJzdHJpbmcoMikuc3BsaXQoJy0nKS5tYXAoKHgpID0+IE51bWJlcih4KSlcclxuICAgICAgICAgICAgY29uc3QgdG9kYXlXayA9IHN3KHRvZGF5V2tJZClcclxuICAgICAgICAgICAgT2JqZWN0LmVudHJpZXMod2Vla0hlaWdodHMpLmZvckVhY2goKFt3a0lkLCB2YWxdKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB3a1NwbGl0ID0gc3cod2tJZClcclxuICAgICAgICAgICAgICAgIGlmICgod2tTcGxpdFswXSA8IHRvZGF5V2tbMF0pIHx8ICgod2tTcGxpdFswXSA9PT0gdG9kYXlXa1swXSkgJiYgKHdrU3BsaXRbMV0gPCB0b2RheVdrWzFdKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBoICs9IHZhbFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICBzY3JvbGwgPSAoaCAqIDMwKSArIDExMiArIDE0XHJcbiAgICAgICAgICAgIC8vIEFsc28gc2hvdyB0aGUgZGF5IGhlYWRlcnMgaWYgdG9kYXkncyBkYXRlIGlzIGRpc3BsYXllZCBpbiB0aGUgZmlyc3Qgcm93IG9mIHRoZSBjYWxlbmRhclxyXG4gICAgICAgICAgICBpZiAoc2Nyb2xsIDwgNTApIHNjcm9sbCA9IDBcclxuICAgICAgICAgICAgaWYgKGRvU2Nyb2xsICYmIChkb2N1bWVudC5ib2R5LmdldEF0dHJpYnV0ZSgnZGF0YS12aWV3JykgPT09ICcwJykgJiZcclxuICAgICAgICAgICAgICAgICFkb2N1bWVudC5ib2R5LnF1ZXJ5U2VsZWN0b3IoJy5mdWxsJykpIHtcclxuICAgICAgICAgICAgICAgIC8vIGluIGNhbGVuZGFyIHZpZXdcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5zY3JvbGxUbygwLCBzY3JvbGwpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnRvZ2dsZSgnbm9MaXN0JyxcclxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmFzc2lnbm1lbnQubGlzdERpc3A6bm90KC5kb25lKScpLmxlbmd0aCA9PT0gMClcclxuICAgICAgICBpZiAoZG9jdW1lbnQuYm9keS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmlldycpID09PSAnMScpIHsgLy8gaW4gbGlzdCB2aWV3XHJcbiAgICAgICAgICAgIHJlc2l6ZSgpXHJcbiAgICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgZGlzcGxheUVycm9yKGVycilcclxuICAgIH1cclxuICAgIGNvbnNvbGUudGltZUVuZCgnRGlzcGxheWluZyBkYXRhJylcclxufVxyXG5cclxuLy8gVGhlIGZ1bmN0aW9uIGJlbG93IGNvbnZlcnRzIGFuIHVwZGF0ZSB0aW1lIHRvIGEgaHVtYW4tcmVhZGFibGUgZGF0ZS5cclxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdFVwZGF0ZShkYXRlOiBudW1iZXIpOiBzdHJpbmcge1xyXG4gIGNvbnN0IG5vdyA9IG5ldyBEYXRlKClcclxuICBjb25zdCB1cGRhdGUgPSBuZXcgRGF0ZSgrZGF0ZSlcclxuICBpZiAobm93LmdldERhdGUoKSA9PT0gdXBkYXRlLmdldERhdGUoKSkge1xyXG4gICAgbGV0IGFtcG0gPSAnQU0nXHJcbiAgICBsZXQgaHIgPSB1cGRhdGUuZ2V0SG91cnMoKVxyXG4gICAgaWYgKGhyID4gMTIpIHtcclxuICAgICAgYW1wbSA9ICdQTSdcclxuICAgICAgaHIgLT0gMTJcclxuICAgIH1cclxuICAgIGNvbnN0IG1pbiA9IHVwZGF0ZS5nZXRNaW51dGVzKClcclxuICAgIHJldHVybiBgVG9kYXkgYXQgJHtocn06JHttaW4gPCAxMCA/IGAwJHttaW59YCA6IG1pbn0gJHthbXBtfWBcclxuICB9IGVsc2Uge1xyXG4gICAgY29uc3QgZGF5c1Bhc3QgPSBNYXRoLmNlaWwoKG5vdy5nZXRUaW1lKCkgLSB1cGRhdGUuZ2V0VGltZSgpKSAvIDEwMDAgLyAzNjAwIC8gMjQpXHJcbiAgICBpZiAoZGF5c1Bhc3QgPT09IDEpIHsgcmV0dXJuICdZZXN0ZXJkYXknIH0gZWxzZSB7IHJldHVybiBkYXlzUGFzdCArICcgZGF5cyBhZ28nIH1cclxuICB9XHJcbn1cclxuIiwibGV0IGxpc3REYXRlT2Zmc2V0ID0gMFxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldExpc3REYXRlT2Zmc2V0KCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gbGlzdERhdGVPZmZzZXRcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHplcm9MaXN0RGF0ZU9mZnNldCgpOiB2b2lkIHtcclxuICAgIGxpc3REYXRlT2Zmc2V0ID0gMFxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaW5jcmVtZW50TGlzdERhdGVPZmZzZXQoKTogdm9pZCB7XHJcbiAgICBsaXN0RGF0ZU9mZnNldCArPSAxXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkZWNyZW1lbnRMaXN0RGF0ZU9mZnNldCgpOiB2b2lkIHtcclxuICAgIGxpc3REYXRlT2Zmc2V0IC09IDFcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNldExpc3REYXRlT2Zmc2V0KG9mZnNldDogbnVtYmVyKTogdm9pZCB7XHJcbiAgICBsaXN0RGF0ZU9mZnNldCA9IG9mZnNldFxyXG59XHJcbiIsIi8qKlxyXG4gKiBUaGlzIG1vZHVsZSBjb250YWlucyBjb2RlIHRvIGJvdGggZmV0Y2ggYW5kIHBhcnNlIGFzc2lnbm1lbnRzIGZyb20gUENSLlxyXG4gKi9cclxuaW1wb3J0IHsgdXBkYXRlQXZhdGFyIH0gZnJvbSAnLi9jb21wb25lbnRzL2F2YXRhcidcclxuaW1wb3J0IHsgZGlzcGxheUVycm9yIH0gZnJvbSAnLi9jb21wb25lbnRzL2Vycm9yRGlzcGxheSdcclxuaW1wb3J0IHsgc25hY2tiYXIgfSBmcm9tICcuL2NvbXBvbmVudHMvc25hY2tiYXInXHJcbmltcG9ydCB7IGRlbGV0ZUNvb2tpZSwgZ2V0Q29va2llLCBzZXRDb29raWUgfSBmcm9tICcuL2Nvb2tpZXMnXHJcbmltcG9ydCB7IHRvRGF0ZU51bSB9IGZyb20gJy4vZGF0ZXMnXHJcbmltcG9ydCB7IGRpc3BsYXksIGZvcm1hdFVwZGF0ZSB9IGZyb20gJy4vZGlzcGxheSdcclxuaW1wb3J0IHsgXyQsIGVsZW1CeUlkLCBsb2NhbFN0b3JhZ2VXcml0ZSwgc2VuZCB9IGZyb20gJy4vdXRpbCdcclxuXHJcbmNvbnN0IFBDUl9VUkwgPSAnaHR0cHM6Ly93ZWJhcHBzY2EucGNyc29mdC5jb20nXHJcbmNvbnN0IEFTU0lHTk1FTlRTX1VSTCA9IGAke1BDUl9VUkx9L0NsdWUvU0MtQXNzaWdubWVudHMtRW5kLURhdGUtUmFuZ2UvNzUzNmBcclxuY29uc3QgTE9HSU5fVVJMID0gYCR7UENSX1VSTH0vQ2x1ZS9TQy1TdHVkZW50LVBvcnRhbC1Mb2dpbi1MREFQLzg0NjQ/cmV0dXJuVXJsPSR7ZW5jb2RlVVJJQ29tcG9uZW50KEFTU0lHTk1FTlRTX1VSTCl9YFxyXG5jb25zdCBBVFRBQ0hNRU5UU19VUkwgPSBgJHtQQ1JfVVJMfS9DbHVlL0NvbW1vbi9BdHRhY2htZW50UmVuZGVyLmFzcHhgXHJcbmNvbnN0IEZPUk1fSEVBREVSX09OTFkgPSB7ICdDb250ZW50LXR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyB9XHJcbmNvbnN0IE9ORV9NSU5VVEVfTVMgPSA2MDAwMFxyXG5cclxuY29uc3QgcHJvZ3Jlc3NFbGVtZW50ID0gZWxlbUJ5SWQoJ3Byb2dyZXNzJylcclxuY29uc3QgbG9naW5EaWFsb2cgPSBlbGVtQnlJZCgnbG9naW4nKVxyXG5jb25zdCBsb2dpbkJhY2tncm91bmQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9naW5CYWNrZ3JvdW5kJylcclxuY29uc3QgbGFzdFVwZGF0ZUVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xhc3RVcGRhdGUnKVxyXG5jb25zdCB1c2VybmFtZUVsID0gZWxlbUJ5SWQoJ3VzZXJuYW1lJykgYXMgSFRNTElucHV0RWxlbWVudFxyXG5jb25zdCBwYXNzd29yZEVsID0gZWxlbUJ5SWQoJ3Bhc3N3b3JkJykgYXMgSFRNTElucHV0RWxlbWVudFxyXG5jb25zdCByZW1lbWJlckNoZWNrID0gZWxlbUJ5SWQoJ3JlbWVtYmVyJykgYXMgSFRNTElucHV0RWxlbWVudFxyXG5jb25zdCBpbmNvcnJlY3RMb2dpbkVsID0gZWxlbUJ5SWQoJ2xvZ2luSW5jb3JyZWN0JylcclxuXHJcbi8vIFRPRE8ga2VlcGluZyB0aGVzZSBhcyBhIGdsb2JhbCB2YXJzIGlzIGJhZFxyXG5jb25zdCBsb2dpbkhlYWRlcnM6IHtbaGVhZGVyOiBzdHJpbmddOiBzdHJpbmd9ID0ge31cclxuY29uc3Qgdmlld0RhdGE6IHtbaGFkZXI6IHN0cmluZ106IHN0cmluZ30gPSB7fVxyXG5sZXQgbGFzdFVwZGF0ZSA9IDAgLy8gVGhlIGxhc3QgdGltZSBldmVyeXRoaW5nIHdhcyB1cGRhdGVkXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElBcHBsaWNhdGlvbkRhdGEge1xyXG4gICAgY2xhc3Nlczogc3RyaW5nW11cclxuICAgIGFzc2lnbm1lbnRzOiBJQXNzaWdubWVudFtdXHJcbiAgICBtb250aFZpZXc6IGJvb2xlYW5cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJQXNzaWdubWVudCB7XHJcbiAgICBzdGFydDogbnVtYmVyXHJcbiAgICBlbmQ6IG51bWJlcnwnRm9yZXZlcidcclxuICAgIGF0dGFjaG1lbnRzOiBBdHRhY2htZW50QXJyYXlbXVxyXG4gICAgYm9keTogc3RyaW5nXHJcbiAgICB0eXBlOiBzdHJpbmdcclxuICAgIGJhc2VUeXBlOiBzdHJpbmdcclxuICAgIGNsYXNzOiBudW1iZXJ8bnVsbCxcclxuICAgIHRpdGxlOiBzdHJpbmdcclxuICAgIGlkOiBzdHJpbmdcclxufVxyXG5cclxuZXhwb3J0IHR5cGUgQXR0YWNobWVudEFycmF5ID0gW3N0cmluZywgc3RyaW5nXVxyXG5cclxuLy8gVGhpcyBpcyB0aGUgZnVuY3Rpb24gdGhhdCByZXRyaWV2ZXMgeW91ciBhc3NpZ25tZW50cyBmcm9tIFBDUi5cclxuLy9cclxuLy8gRmlyc3QsIGEgcmVxdWVzdCBpcyBzZW50IHRvIFBDUiB0byBsb2FkIHRoZSBwYWdlIHlvdSB3b3VsZCBub3JtYWxseSBzZWUgd2hlbiBhY2Nlc3NpbmcgUENSLlxyXG4vL1xyXG4vLyBCZWNhdXNlIHRoaXMgaXMgcnVuIGFzIGEgY2hyb21lIGV4dGVuc2lvbiwgdGhpcyBwYWdlIGNhbiBiZSBhY2Nlc3NlZC4gT3RoZXJ3aXNlLCB0aGUgYnJvd3NlclxyXG4vLyB3b3VsZCB0aHJvdyBhbiBlcnJvciBmb3Igc2VjdXJpdHkgcmVhc29ucyAoeW91IGRvbid0IHdhbnQgYSByYW5kb20gd2Vic2l0ZSBiZWluZyBhYmxlIHRvIGFjY2Vzc1xyXG4vLyBjb25maWRlbnRpYWwgZGF0YSBmcm9tIGEgd2Vic2l0ZSB5b3UgaGF2ZSBsb2dnZWQgaW50bykuXHJcblxyXG4vKipcclxuICogRmV0Y2hlcyBkYXRhIGZyb20gUENSIGFuZCBpZiB0aGUgdXNlciBpcyBsb2dnZWQgaW4gcGFyc2VzIGFuZCBkaXNwbGF5cyBpdFxyXG4gKiBAcGFyYW0gb3ZlcnJpZGUgV2hldGhlciB0byBmb3JjZSBhbiB1cGRhdGUgZXZlbiB0aGVyZSB3YXMgb25lIHJlY2VudGx5XHJcbiAqIEBwYXJhbSBkYXRhICBPcHRpb25hbCBkYXRhIHRvIGJlIHBvc3RlZCB0byBQQ1JcclxuICovXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmZXRjaChvdmVycmlkZTogYm9vbGVhbiA9IGZhbHNlLCBkYXRhPzogc3RyaW5nLCBvbnN1Y2Nlc3M6ICgpID0+IHZvaWQgPSBkaXNwbGF5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25sb2dpbj86ICgpID0+IHZvaWQpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIGlmICghb3ZlcnJpZGUgJiYgRGF0ZS5ub3coKSAtIGxhc3RVcGRhdGUgPCBPTkVfTUlOVVRFX01TKSByZXR1cm5cclxuICAgIGxhc3RVcGRhdGUgPSBEYXRlLm5vdygpXHJcblxyXG4gICAgY29uc3QgaGVhZGVycyA9IGRhdGEgPyBGT1JNX0hFQURFUl9PTkxZIDogdW5kZWZpbmVkXHJcbiAgICBjb25zb2xlLnRpbWUoJ0ZldGNoaW5nIGFzc2lnbm1lbnRzJylcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcmVzcCA9IGF3YWl0IHNlbmQoQVNTSUdOTUVOVFNfVVJMLCAnZG9jdW1lbnQnLCBoZWFkZXJzLCBkYXRhLCBwcm9ncmVzc0VsZW1lbnQpXHJcbiAgICAgICAgY29uc29sZS50aW1lRW5kKCdGZXRjaGluZyBhc3NpZ25tZW50cycpXHJcbiAgICAgICAgaWYgKHJlc3AucmVzcG9uc2VVUkwuaW5kZXhPZignTG9naW4nKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgLy8gV2UgaGF2ZSB0byBsb2cgaW4gbm93XHJcbiAgICAgICAgICAgIChyZXNwLnJlc3BvbnNlIGFzIEhUTUxEb2N1bWVudCkuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2lucHV0JykuZm9yRWFjaCgoZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbG9naW5IZWFkZXJzW2UubmFtZV0gPSBlLnZhbHVlIHx8ICcnXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdOZWVkIHRvIGxvZyBpbicpXHJcbiAgICAgICAgICAgIGNvbnN0IHVwID0gZ2V0Q29va2llKCd1c2VyUGFzcycpIC8vIEF0dGVtcHRzIHRvIGdldCB0aGUgY29va2llICp1c2VyUGFzcyosIHdoaWNoIGlzIHNldCBpZiB0aGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gXCJSZW1lbWJlciBtZVwiIGNoZWNrYm94IGlzIGNoZWNrZWQgd2hlbiBsb2dnaW5nIGluIHRocm91Z2ggQ2hlY2tQQ1JcclxuICAgICAgICAgICAgaWYgKHVwID09PSAnJykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGxvZ2luQmFja2dyb3VuZCkgbG9naW5CYWNrZ3JvdW5kLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXHJcbiAgICAgICAgICAgICAgICBsb2dpbkRpYWxvZy5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gQmVjYXVzZSB3ZSB3ZXJlIHJlbWVtYmVyZWQsIHdlIGNhbiBsb2cgaW4gaW1tZWRpYXRlbHkgd2l0aG91dCB3YWl0aW5nIGZvciB0aGVcclxuICAgICAgICAgICAgICAgIC8vIHVzZXIgdG8gbG9nIGluIHRocm91Z2ggdGhlIGxvZ2luIGZvcm1cclxuICAgICAgICAgICAgICAgIGRvbG9naW4od2luZG93LmF0b2IodXApLnNwbGl0KCc6JykgYXMgW3N0cmluZywgc3RyaW5nXSlcclxuICAgICAgICAgICAgICAgIGlmIChvbmxvZ2luKSBvbmxvZ2luKClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIExvZ2dlZCBpbiBub3dcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ0ZldGNoaW5nIGFzc2lnbm1lbnRzIHN1Y2Nlc3NmdWwnKVxyXG4gICAgICAgICAgICBjb25zdCB0ID0gRGF0ZS5ub3coKVxyXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2UubGFzdFVwZGF0ZSA9IHRcclxuICAgICAgICAgICAgaWYgKGxhc3RVcGRhdGVFbCkgbGFzdFVwZGF0ZUVsLmlubmVySFRNTCA9IGZvcm1hdFVwZGF0ZSh0KVxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgcGFyc2UocmVzcC5yZXNwb25zZSlcclxuICAgICAgICAgICAgICAgIG9uc3VjY2VzcygpXHJcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2VXcml0ZSgnZGF0YScsIGdldERhdGEoKSkgLy8gU3RvcmUgZm9yIG9mZmxpbmUgdXNlXHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcilcclxuICAgICAgICAgICAgICAgIGRpc3BsYXlFcnJvcihlcnJvcilcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ0NvdWxkIG5vdCBmZXRjaCBhc3NpZ25tZW50czsgWW91IGFyZSBwcm9iYWJseSBvZmZsaW5lLiBIZXJlXFwncyB0aGUgZXJyb3I6JywgZXJyb3IpXHJcbiAgICAgICAgc25hY2tiYXIoJ0NvdWxkIG5vdCBmZXRjaCB5b3VyIGFzc2lnbm1lbnRzJywgJ1JldHJ5JywgKCkgPT4gZmV0Y2godHJ1ZSkpXHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBMb2dzIHRoZSB1c2VyIGludG8gUENSXHJcbiAqIEBwYXJhbSB2YWwgICBBbiBvcHRpb25hbCBsZW5ndGgtMiBhcnJheSBvZiB0aGUgZm9ybSBbdXNlcm5hbWUsIHBhc3N3b3JkXSB0byB1c2UgdGhlIHVzZXIgaW4gd2l0aC5cclxuICogICAgICAgICAgICAgIElmIHRoaXMgYXJyYXkgaXMgbm90IGdpdmVuIHRoZSBsb2dpbiBkaWFsb2cgaW5wdXRzIHdpbGwgYmUgdXNlZC5cclxuICogQHBhcmFtIHN1Ym1pdEV2dCBXaGV0aGVyIHRvIG92ZXJyaWRlIHRoZSB1c2VybmFtZSBhbmQgcGFzc3dvcmQgc3VwcGxlaWQgaW4gdmFsIHdpdGggdGhlIHZhbHVlcyBvZiB0aGUgaW5wdXQgZWxlbWVudHNcclxuICovXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkb2xvZ2luKHZhbD86IFtzdHJpbmcsIHN0cmluZ118bnVsbCwgc3VibWl0RXZ0OiBib29sZWFuID0gZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uc3VjY2VzczogKCkgPT4gdm9pZCA9IGRpc3BsYXkpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIGxvZ2luRGlhbG9nLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBpZiAobG9naW5CYWNrZ3JvdW5kKSBsb2dpbkJhY2tncm91bmQuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xyXG4gICAgfSwgMzUwKVxyXG5cclxuICAgIGNvbnN0IHBvc3RBcnJheTogc3RyaW5nW10gPSBbXSAvLyBBcnJheSBvZiBkYXRhIHRvIHBvc3RcclxuICAgIGxvY2FsU3RvcmFnZVdyaXRlKCd1c2VybmFtZScsIHZhbCAmJiAhc3VibWl0RXZ0ID8gdmFsWzBdIDogdXNlcm5hbWVFbC52YWx1ZSlcclxuICAgIHVwZGF0ZUF2YXRhcigpXHJcbiAgICBPYmplY3Qua2V5cyhsb2dpbkhlYWRlcnMpLmZvckVhY2goKGgpID0+ICB7XHJcbiAgICAgICAgLy8gTG9vcCB0aHJvdWdoIHRoZSBpbnB1dCBlbGVtZW50cyBjb250YWluZWQgaW4gdGhlIGxvZ2luIHBhZ2UuIEFzIG1lbnRpb25lZCBiZWZvcmUsIHRoZXlcclxuICAgICAgICAvLyB3aWxsIGJlIHNlbnQgdG8gUENSIHRvIGxvZyBpbi5cclxuICAgICAgICBpZiAoaC50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ3VzZXInKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgbG9naW5IZWFkZXJzW2hdID0gdmFsICYmICFzdWJtaXRFdnQgPyB2YWxbMF0gOiB1c2VybmFtZUVsLnZhbHVlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChoLnRvTG93ZXJDYXNlKCkuaW5kZXhPZigncGFzcycpICE9PSAtMSkge1xyXG4gICAgICAgICAgICBsb2dpbkhlYWRlcnNbaF0gPSB2YWwgJiYgIXN1Ym1pdEV2dCA/IHZhbFsxXSA6IHBhc3N3b3JkRWwudmFsdWVcclxuICAgICAgICB9XHJcbiAgICAgICAgcG9zdEFycmF5LnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KGgpICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KGxvZ2luSGVhZGVyc1toXSkpXHJcbiAgICB9KVxyXG5cclxuICAgIC8vIE5vdyBzZW5kIHRoZSBsb2dpbiByZXF1ZXN0IHRvIFBDUlxyXG4gICAgY29uc29sZS50aW1lKCdMb2dnaW5nIGluJylcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcmVzcCA9IGF3YWl0IHNlbmQoTE9HSU5fVVJMLCAnZG9jdW1lbnQnLCBGT1JNX0hFQURFUl9PTkxZLCBwb3N0QXJyYXkuam9pbignJicpLCBwcm9ncmVzc0VsZW1lbnQpXHJcbiAgICAgICAgY29uc29sZS50aW1lRW5kKCdMb2dnaW5nIGluJylcclxuICAgICAgICBpZiAocmVzcC5yZXNwb25zZVVSTC5pbmRleE9mKCdMb2dpbicpICE9PSAtMSkge1xyXG4gICAgICAgIC8vIElmIFBDUiBzdGlsbCB3YW50cyB1cyB0byBsb2cgaW4sIHRoZW4gdGhlIHVzZXJuYW1lIG9yIHBhc3N3b3JkIGVudGVyZWQgd2VyZSBpbmNvcnJlY3QuXHJcbiAgICAgICAgICAgIGluY29ycmVjdExvZ2luRWwuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcclxuICAgICAgICAgICAgcGFzc3dvcmRFbC52YWx1ZSA9ICcnXHJcblxyXG4gICAgICAgICAgICBsb2dpbkRpYWxvZy5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG4gICAgICAgICAgICBpZiAobG9naW5CYWNrZ3JvdW5kKSBsb2dpbkJhY2tncm91bmQuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBPdGhlcndpc2UsIHdlIGFyZSBsb2dnZWQgaW5cclxuICAgICAgICAgICAgaWYgKHJlbWVtYmVyQ2hlY2suY2hlY2tlZCkgeyAvLyBJcyB0aGUgXCJyZW1lbWJlciBtZVwiIGNoZWNrYm94IGNoZWNrZWQ/XHJcbiAgICAgICAgICAgICAgICAvLyBTZXQgYSBjb29raWUgd2l0aCB0aGUgdXNlcm5hbWUgYW5kIHBhc3N3b3JkIHNvIHdlIGNhbiBsb2cgaW4gYXV0b21hdGljYWxseSBpbiB0aGVcclxuICAgICAgICAgICAgICAgIC8vIGZ1dHVyZSB3aXRob3V0IGhhdmluZyB0byBwcm9tcHQgZm9yIGEgdXNlcm5hbWUgYW5kIHBhc3N3b3JkIGFnYWluXHJcbiAgICAgICAgICAgICAgICBzZXRDb29raWUoJ3VzZXJQYXNzJywgd2luZG93LmJ0b2EodXNlcm5hbWVFbC52YWx1ZSArICc6JyArIHBhc3N3b3JkRWwudmFsdWUpLCAxNClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBsb2FkaW5nQmFyLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIlxyXG4gICAgICAgICAgICBjb25zdCB0ID0gRGF0ZS5ub3coKVxyXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2UubGFzdFVwZGF0ZSA9IHRcclxuICAgICAgICAgICAgaWYgKGxhc3RVcGRhdGVFbCkgbGFzdFVwZGF0ZUVsLmlubmVySFRNTCA9IGZvcm1hdFVwZGF0ZSh0KVxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgcGFyc2UocmVzcC5yZXNwb25zZSkgLy8gUGFyc2UgdGhlIGRhdGEgUENSIGhhcyByZXBsaWVkIHdpdGhcclxuICAgICAgICAgICAgICAgIG9uc3VjY2VzcygpXHJcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2VXcml0ZSgnZGF0YScsIGdldERhdGEoKSkgLy8gU3RvcmUgZm9yIG9mZmxpbmUgdXNlXHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpXHJcbiAgICAgICAgICAgICAgICBkaXNwbGF5RXJyb3IoZSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgIGNvbnNvbGUubG9nKCdDb3VsZCBub3QgbG9nIGluIHRvIFBDUi4gRWl0aGVyIHlvdXIgbmV0d29yayBjb25uZWN0aW9uIHdhcyBsb3N0IGR1cmluZyB5b3VyIHZpc2l0ICcgK1xyXG4gICAgICAgICAgICAgICAgICAgICAnb3IgUENSIGlzIGp1c3Qgbm90IHdvcmtpbmcuIEhlcmVcXCdzIHRoZSBlcnJvcjonLCBlcnJvcilcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldERhdGEoKTogSUFwcGxpY2F0aW9uRGF0YXx1bmRlZmluZWQge1xyXG4gICAgcmV0dXJuICh3aW5kb3cgYXMgYW55KS5kYXRhXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRDbGFzc2VzKCk6IHN0cmluZ1tdIHtcclxuICAgIGNvbnN0IGRhdGEgPSBnZXREYXRhKClcclxuICAgIGlmICghZGF0YSkgcmV0dXJuIFtdXHJcbiAgICByZXR1cm4gZGF0YS5jbGFzc2VzXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXREYXRhKGRhdGE6IElBcHBsaWNhdGlvbkRhdGEpOiB2b2lkIHtcclxuICAgICh3aW5kb3cgYXMgYW55KS5kYXRhID0gZGF0YVxyXG59XHJcblxyXG4vLyBJbiBQQ1IncyBpbnRlcmZhY2UsIHlvdSBjYW4gY2xpY2sgYSBkYXRlIGluIG1vbnRoIG9yIHdlZWsgdmlldyB0byBzZWUgaXQgaW4gZGF5IHZpZXcuXHJcbi8vIFRoZXJlZm9yZSwgdGhlIEhUTUwgZWxlbWVudCB0aGF0IHNob3dzIHRoZSBkYXRlIHRoYXQgeW91IGNhbiBjbGljayBvbiBoYXMgYSBoeXBlcmxpbmsgdGhhdCBsb29rcyBsaWtlIGAjMjAxNS0wNC0yNmAuXHJcbi8vIFRoZSBmdW5jdGlvbiBiZWxvdyB3aWxsIHBhcnNlIHRoYXQgU3RyaW5nIGFuZCByZXR1cm4gYSBEYXRlIHRpbWVzdGFtcFxyXG5mdW5jdGlvbiBwYXJzZURhdGVIYXNoKGVsZW1lbnQ6IEhUTUxBbmNob3JFbGVtZW50KTogbnVtYmVyIHtcclxuICAgIGNvbnN0IFt5ZWFyLCBtb250aCwgZGF5XSA9IGVsZW1lbnQuaGFzaC5zdWJzdHJpbmcoMSkuc3BsaXQoJy0nKS5tYXAoTnVtYmVyKVxyXG4gICAgcmV0dXJuIChuZXcgRGF0ZSh5ZWFyLCBtb250aCAtIDEsIGRheSkpLmdldFRpbWUoKVxyXG59XHJcblxyXG4vLyBUaGUgKmF0dGFjaG1lbnRpZnkqIGZ1bmN0aW9uIHBhcnNlcyB0aGUgYm9keSBvZiBhbiBhc3NpZ25tZW50ICgqdGV4dCopIGFuZCByZXR1cm5zIHRoZSBhc3NpZ25tZW50J3MgYXR0YWNobWVudHMuXHJcbi8vIFNpZGUgZWZmZWN0OiB0aGVzZSBhdHRhY2htZW50cyBhcmUgcmVtb3ZlZFxyXG5mdW5jdGlvbiBhdHRhY2htZW50aWZ5KGVsZW1lbnQ6IEhUTUxFbGVtZW50KTogQXR0YWNobWVudEFycmF5W10ge1xyXG4gICAgY29uc3QgYXR0YWNobWVudHM6IEF0dGFjaG1lbnRBcnJheVtdID0gW11cclxuXHJcbiAgICAvLyBHZXQgYWxsIGxpbmtzXHJcbiAgICBjb25zdCBhcyA9IEFycmF5LmZyb20oZWxlbWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYScpKVxyXG4gICAgYXMuZm9yRWFjaCgoYSkgPT4ge1xyXG4gICAgICAgIGlmIChhLmlkLmluY2x1ZGVzKCdBdHRhY2htZW50JykpIHtcclxuICAgICAgICAgICAgYXR0YWNobWVudHMucHVzaChbXHJcbiAgICAgICAgICAgICAgICBhLmlubmVySFRNTCxcclxuICAgICAgICAgICAgICAgIGEuc2VhcmNoICsgYS5oYXNoXHJcbiAgICAgICAgICAgIF0pXHJcbiAgICAgICAgICAgIGEucmVtb3ZlKClcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICAgcmV0dXJuIGF0dGFjaG1lbnRzXHJcbn1cclxuXHJcbmNvbnN0IFVSTF9SRUdFWCA9IG5ldyBSZWdFeHAoYChcXFxyXG5odHRwcz86XFxcXC9cXFxcL1xcXHJcblstQS1aMC05KyZAI1xcXFwvJT89fl98ITosLjtdKlxcXHJcblstQS1aMC05KyZAI1xcXFwvJT1+X3xdK1xcXHJcbilgLCAnaWcnXHJcbilcclxuXHJcbi8vIFRoaXMgZnVuY3Rpb24gcmVwbGFjZXMgdGV4dCB0aGF0IHJlcHJlc2VudHMgYSBoeXBlcmxpbmsgd2l0aCBhIGZ1bmN0aW9uYWwgaHlwZXJsaW5rIGJ5IHVzaW5nXHJcbi8vIGphdmFzY3JpcHQncyByZXBsYWNlIGZ1bmN0aW9uIHdpdGggYSByZWd1bGFyIGV4cHJlc3Npb24gaWYgdGhlIHRleHQgYWxyZWFkeSBpc24ndCBwYXJ0IG9mIGFcclxuLy8gaHlwZXJsaW5rLlxyXG5mdW5jdGlvbiB1cmxpZnkodGV4dDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0ZXh0LnJlcGxhY2UoVVJMX1JFR0VYLCAoc3RyLCBzdHIyLCBvZmZzZXQpID0+IHsgLy8gRnVuY3Rpb24gdG8gcmVwbGFjZSBtYXRjaGVzXHJcbiAgICAgICAgaWYgKC9ocmVmXFxzKj1cXHMqLi8udGVzdCh0ZXh0LnN1YnN0cmluZyhvZmZzZXQgLSAxMCwgb2Zmc2V0KSkgfHxcclxuICAgICAgICAgICAgL29yaWdpbmFscGF0aFxccyo9XFxzKi4vLnRlc3QodGV4dC5zdWJzdHJpbmcob2Zmc2V0IC0gMjAsIG9mZnNldCkpXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzdHJcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gYDxhIGhyZWY9XCIke3N0cn1cIj4ke3N0cn08L2E+YFxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbn1cclxuXHJcbi8vIEFsc28sIFBDUlwicyBpbnRlcmZhY2UgdXNlcyBhIHN5c3RlbSBvZiBJRHMgdG8gaWRlbnRpZnkgZGlmZmVyZW50IGVsZW1lbnRzLiBGb3IgZXhhbXBsZSwgdGhlIElEIG9mXHJcbi8vIG9uZSBvZiB0aGUgYm94ZXMgc2hvd2luZyB0aGUgbmFtZSBvZiBhbiBhc3NpZ25tZW50IGNvdWxkIGJlXHJcbi8vIGBjdGwwMF9jdGwwMF9iYXNlQ29udGVudF9iYXNlQ29udGVudF9mbGFzaFRvcF9jdGwwMF9SYWRTY2hlZHVsZXIxXzk1XzBgLiBUaGUgZnVuY3Rpb24gYmVsb3cgd2lsbFxyXG4vLyByZXR1cm4gdGhlIGZpcnN0IEhUTUwgZWxlbWVudCB3aG9zZSBJRCBjb250YWlucyBhIHNwZWNpZmllZCBTdHJpbmcgKCppZCopIGFuZCBjb250YWluaW5nIGFcclxuLy8gc3BlY2lmaWVkIHRhZyAoKnRhZyopLlxyXG5mdW5jdGlvbiBmaW5kSWQoZWxlbWVudDogSFRNTEVsZW1lbnR8SFRNTERvY3VtZW50LCB0YWc6IHN0cmluZywgaWQ6IHN0cmluZyk6IEhUTUxFbGVtZW50IHtcclxuICAgIGNvbnN0IGVsID0gWy4uLmVsZW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUodGFnKV0uZmluZCgoZSkgPT4gZS5pZC5pbmNsdWRlcyhpZCkpXHJcbiAgICBpZiAoIWVsKSB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBmaW5kIGVsZW1lbnQgd2l0aCB0YWcgJHt0YWd9IGFuZCBpZCAke2lkfSBpbiAke2VsZW1lbnR9YClcclxuICAgIHJldHVybiBlbCBhcyBIVE1MRWxlbWVudFxyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJzZUFzc2lnbm1lbnRUeXBlKHR5cGU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdHlwZS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoJyYgcXVpenplcycsICcnKS5yZXBsYWNlKCd0ZXN0cycsICd0ZXN0JylcclxufVxyXG5cclxuZnVuY3Rpb24gcGFyc2VBc3NpZ25tZW50QmFzZVR5cGUodHlwZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0eXBlLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgnJiBxdWl6emVzJywgJycpLnJlcGxhY2UoL1xccy9nLCAnJykucmVwbGFjZSgncXVpenplcycsICd0ZXN0JylcclxufVxyXG5cclxuZnVuY3Rpb24gcGFyc2VBc3NpZ25tZW50KGNhOiBIVE1MRWxlbWVudCk6IElBc3NpZ25tZW50IHtcclxuICAgIGNvbnN0IGRhdGEgPSBnZXREYXRhKClcclxuICAgIGlmICghZGF0YSkgdGhyb3cgbmV3IEVycm9yKCdEYXRhIGRpY3Rpb25hcnkgbm90IHNldCB1cCcpXHJcblxyXG4gICAgLy8gVGhlIHN0YXJ0aW5nIGRhdGUgYW5kIGVuZGluZyBkYXRlIG9mIHRoZSBhc3NpZ25tZW50IGFyZSBwYXJzZWQgZmlyc3RcclxuICAgIGNvbnN0IHJhbmdlID0gZmluZElkKGNhLCAnc3BhbicsICdTdGFydGluZ09uJykuaW5uZXJIVE1MLnNwbGl0KCcgLSAnKVxyXG4gICAgY29uc3QgYXNzaWdubWVudFN0YXJ0ID0gdG9EYXRlTnVtKERhdGUucGFyc2UocmFuZ2VbMF0pKVxyXG4gICAgY29uc3QgYXNzaWdubWVudEVuZCA9IChyYW5nZVsxXSAhPSBudWxsKSA/IHRvRGF0ZU51bShEYXRlLnBhcnNlKHJhbmdlWzFdKSkgOiBhc3NpZ25tZW50U3RhcnRcclxuXHJcbiAgICAvLyBUaGVuLCB0aGUgbmFtZSBvZiB0aGUgYXNzaWdubWVudCBpcyBwYXJzZWRcclxuICAgIGNvbnN0IHQgPSBmaW5kSWQoY2EsICdzcGFuJywgJ2xibFRpdGxlJylcclxuICAgIGxldCB0aXRsZSA9IHQuaW5uZXJIVE1MXHJcblxyXG4gICAgLy8gVGhlIGFjdHVhbCBib2R5IG9mIHRoZSBhc3NpZ25tZW50IGFuZCBpdHMgYXR0YWNobWVudHMgYXJlIHBhcnNlZCBuZXh0XHJcbiAgICBjb25zdCBiID0gXyQoXyQodC5wYXJlbnROb2RlKS5wYXJlbnROb2RlKSBhcyBIVE1MRWxlbWVudFxyXG4gICAgWy4uLmIuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2RpdicpXS5zbGljZSgwLCAyKS5mb3JFYWNoKChkaXYpID0+IGRpdi5yZW1vdmUoKSlcclxuXHJcbiAgICBjb25zdCBhcCA9IGF0dGFjaG1lbnRpZnkoYikgLy8gU2VwYXJhdGVzIGF0dGFjaG1lbnRzIGZyb20gdGhlIGJvZHlcclxuXHJcbiAgICAvLyBUaGUgbGFzdCBSZXBsYWNlIHJlbW92ZXMgbGVhZGluZyBhbmQgdHJhaWxpbmcgbmV3bGluZXNcclxuICAgIGNvbnN0IGFzc2lnbm1lbnRCb2R5ID0gdXJsaWZ5KGIuaW5uZXJIVE1MKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL14oPzpcXHMqPGJyXFxzKlxcLz8+KSovLCAnJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8oPzpcXHMqPGJyXFxzKlxcLz8+KSpcXHMqJC8sICcnKS50cmltKClcclxuXHJcbiAgICAvLyBGaW5hbGx5LCB3ZSBzZXBhcmF0ZSB0aGUgY2xhc3MgbmFtZSBhbmQgdHlwZSAoaG9tZXdvcmssIGNsYXNzd29yaywgb3IgcHJvamVjdHMpIGZyb20gdGhlIHRpdGxlIG9mIHRoZSBhc3NpZ25tZW50XHJcbiAgICBjb25zdCBtYXRjaGVkVGl0bGUgPSB0aXRsZS5tYXRjaCgvXFwoKFteKV0qXFwpKilcXCkkLylcclxuICAgIGlmICgobWF0Y2hlZFRpdGxlID09IG51bGwpKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgcGFyc2UgYXNzaWdubWVudCB0aXRsZSBcXFwiJHt0aXRsZX1cXFwiYClcclxuICAgIH1cclxuICAgIGNvbnN0IGFzc2lnbm1lbnRUeXBlID0gbWF0Y2hlZFRpdGxlWzFdXHJcbiAgICBjb25zdCBhc3NpZ25tZW50QmFzZVR5cGUgPSBwYXJzZUFzc2lnbm1lbnRCYXNlVHlwZShjYS50aXRsZS5zdWJzdHJpbmcoMCwgY2EudGl0bGUuaW5kZXhPZignXFxuJykpKVxyXG4gICAgbGV0IGFzc2lnbm1lbnRDbGFzc0luZGV4ID0gbnVsbFxyXG4gICAgZGF0YS5jbGFzc2VzLnNvbWUoKGMsIHBvcykgPT4ge1xyXG4gICAgICAgIGlmICh0aXRsZS5pbmRleE9mKGMpICE9PSAtMSkge1xyXG4gICAgICAgICAgICBhc3NpZ25tZW50Q2xhc3NJbmRleCA9IHBvc1xyXG4gICAgICAgICAgICB0aXRsZSA9IHRpdGxlLnJlcGxhY2UoYywgJycpXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgfSlcclxuXHJcbiAgICBpZiAoYXNzaWdubWVudENsYXNzSW5kZXggPT09IG51bGwgfHwgYXNzaWdubWVudENsYXNzSW5kZXggPT09IC0xKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCBjbGFzcyBpbiB0aXRsZSAke3RpdGxlfSAoY2xhc3NlcyBhcmUgJHtkYXRhLmNsYXNzZXN9YClcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBhc3NpZ25tZW50VGl0bGUgPSB0aXRsZS5zdWJzdHJpbmcodGl0bGUuaW5kZXhPZignOiAnKSArIDIpLnJlcGxhY2UoL1xcKFteXFwoXFwpXSpcXCkkLywgJycpLnRyaW0oKVxyXG5cclxuICAgIC8vIFRvIG1ha2Ugc3VyZSB0aGVyZSBhcmUgbm8gcmVwZWF0cywgdGhlIHRpdGxlIG9mIHRoZSBhc3NpZ25tZW50IChvbmx5IGxldHRlcnMpIGFuZCBpdHMgc3RhcnQgJlxyXG4gICAgLy8gZW5kIGRhdGUgYXJlIGNvbWJpbmVkIHRvIGdpdmUgaXQgYSB1bmlxdWUgaWRlbnRpZmllci5cclxuICAgIGNvbnN0IGFzc2lnbm1lbnRJZCA9IGFzc2lnbm1lbnRUaXRsZS5yZXBsYWNlKC9bXlxcd10qL2csICcnKSArIChhc3NpZ25tZW50U3RhcnQgKyBhc3NpZ25tZW50RW5kKVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgc3RhcnQ6IGFzc2lnbm1lbnRTdGFydCxcclxuICAgICAgICBlbmQ6IGFzc2lnbm1lbnRFbmQsXHJcbiAgICAgICAgYXR0YWNobWVudHM6IGFwLFxyXG4gICAgICAgIGJvZHk6IGFzc2lnbm1lbnRCb2R5LFxyXG4gICAgICAgIHR5cGU6IGFzc2lnbm1lbnRUeXBlLFxyXG4gICAgICAgIGJhc2VUeXBlOiBhc3NpZ25tZW50QmFzZVR5cGUsXHJcbiAgICAgICAgY2xhc3M6IGFzc2lnbm1lbnRDbGFzc0luZGV4LFxyXG4gICAgICAgIHRpdGxlOiBhc3NpZ25tZW50VGl0bGUsXHJcbiAgICAgICAgaWQ6IGFzc2lnbm1lbnRJZFxyXG4gICAgfVxyXG59XHJcblxyXG4vLyBUaGUgZnVuY3Rpb24gYmVsb3cgd2lsbCBwYXJzZSB0aGUgZGF0YSBnaXZlbiBieSBQQ1IgYW5kIGNvbnZlcnQgaXQgaW50byBhbiBvYmplY3QuIElmIHlvdSBvcGVuIHVwXHJcbi8vIHRoZSBkZXZlbG9wZXIgY29uc29sZSBvbiBDaGVja1BDUiBhbmQgdHlwZSBpbiBgZGF0YWAsIHlvdSBjYW4gc2VlIHRoZSBhcnJheSBjb250YWluaW5nIGFsbCBvZlxyXG4vLyB5b3VyIGFzc2lnbm1lbnRzLlxyXG5mdW5jdGlvbiBwYXJzZShkb2M6IEhUTUxEb2N1bWVudCk6IHZvaWQge1xyXG4gICAgY29uc29sZS50aW1lKCdIYW5kbGluZyBkYXRhJykgLy8gVG8gdGltZSBob3cgbG9uZyBpdCB0YWtlcyB0byBwYXJzZSB0aGUgYXNzaWdubWVudHNcclxuICAgIGNvbnN0IGhhbmRsZWREYXRhU2hvcnQ6IHN0cmluZ1tdID0gW10gLy8gQXJyYXkgdXNlZCB0byBtYWtlIHN1cmUgd2UgZG9uXCJ0IHBhcnNlIHRoZSBzYW1lIGFzc2lnbm1lbnQgdHdpY2UuXHJcbiAgICBjb25zdCBkYXRhOiBJQXBwbGljYXRpb25EYXRhID0ge1xyXG4gICAgICAgIGNsYXNzZXM6IFtdLFxyXG4gICAgICAgIGFzc2lnbm1lbnRzOiBbXSxcclxuICAgICAgICBtb250aFZpZXc6IChfJChkb2MucXVlcnlTZWxlY3RvcignLnJzSGVhZGVyTW9udGgnKSkucGFyZW50Tm9kZSBhcyBIVE1MRWxlbWVudCkuY2xhc3NMaXN0LmNvbnRhaW5zKCdyc1NlbGVjdGVkJylcclxuICAgIH0gLy8gUmVzZXQgdGhlIGFycmF5IGluIHdoaWNoIGFsbCBvZiB5b3VyIGFzc2lnbm1lbnRzIGFyZSBzdG9yZWQgaW4uXHJcbiAgICBzZXREYXRhKGRhdGEpXHJcblxyXG4gICAgZG9jLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0Om5vdChbdHlwZT1cInN1Ym1pdFwiXSknKS5mb3JFYWNoKChlKSA9PiB7XHJcbiAgICAgICAgdmlld0RhdGFbKGUgYXMgSFRNTElucHV0RWxlbWVudCkubmFtZV0gPSAoZSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSB8fCAnJ1xyXG4gICAgfSlcclxuXHJcbiAgICAvLyBOb3csIHRoZSBjbGFzc2VzIHlvdSB0YWtlIGFyZSBwYXJzZWQgKHRoZXNlIGFyZSB0aGUgY2hlY2tib3hlcyB5b3Ugc2VlIHVwIHRvcCB3aGVuIGxvb2tpbmcgYXQgUENSKS5cclxuICAgIGNvbnN0IGNsYXNzZXMgPSBmaW5kSWQoZG9jLCAndGFibGUnLCAnY2JDbGFzc2VzJykuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2xhYmVsJylcclxuICAgIGNsYXNzZXMuZm9yRWFjaCgoYykgPT4ge1xyXG4gICAgICAgIGRhdGEuY2xhc3Nlcy5wdXNoKGMuaW5uZXJIVE1MKVxyXG4gICAgfSlcclxuXHJcbiAgICBjb25zdCBhc3NpZ25tZW50cyA9IGRvYy5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdyc0FwdCByc0FwdFNpbXBsZScpXHJcbiAgICBBcnJheS5wcm90b3R5cGUuZm9yRWFjaC5jYWxsKGFzc2lnbm1lbnRzLCAoYXNzaWdubWVudEVsOiBIVE1MRWxlbWVudCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGFzc2lnbm1lbnQgPSBwYXJzZUFzc2lnbm1lbnQoYXNzaWdubWVudEVsKVxyXG4gICAgICAgIGlmIChoYW5kbGVkRGF0YVNob3J0LmluZGV4T2YoYXNzaWdubWVudC5pZCkgPT09IC0xKSB7IC8vIE1ha2Ugc3VyZSB3ZSBoYXZlbid0IGFscmVhZHkgcGFyc2VkIHRoZSBhc3NpZ25tZW50XHJcbiAgICAgICAgICAgIGhhbmRsZWREYXRhU2hvcnQucHVzaChhc3NpZ25tZW50LmlkKVxyXG4gICAgICAgICAgICBkYXRhLmFzc2lnbm1lbnRzLnB1c2goYXNzaWdubWVudClcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG5cclxuICAgIGNvbnNvbGUudGltZUVuZCgnSGFuZGxpbmcgZGF0YScpXHJcblxyXG4gICAgLy8gTm93IGFsbG93IHRoZSB2aWV3IHRvIGJlIHN3aXRjaGVkXHJcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ2xvYWRlZCcpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1cmxGb3JBdHRhY2htZW50KHNlYXJjaDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIHJldHVybiBBVFRBQ0hNRU5UU19VUkwgKyBzZWFyY2hcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldEF0dGFjaG1lbnRNaW1lVHlwZShzZWFyY2g6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXHJcbiAgICAgICAgcmVxLm9wZW4oJ0hFQUQnLCB1cmxGb3JBdHRhY2htZW50KHNlYXJjaCkpXHJcbiAgICAgICAgcmVxLm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKHJlcS5zdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdHlwZSA9IHJlcS5nZXRSZXNwb25zZUhlYWRlcignQ29udGVudC1UeXBlJylcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh0eXBlKVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKCdDb250ZW50IHR5cGUgaXMgbnVsbCcpKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJlcS5zZW5kKClcclxuICAgIH0pXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjbGFzc0J5SWQoaWQ6IG51bWJlcnxudWxsfHVuZGVmaW5lZCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gKGlkID8gZ2V0Q2xhc3NlcygpW2lkXSA6IG51bGwpIHx8ICdVbmtub3duIGNsYXNzJ1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc3dpdGNoVmlld3MoKTogdm9pZCB7XHJcbiAgICBpZiAoT2JqZWN0LmtleXModmlld0RhdGEpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBlbGVtQnlJZCgnc2lkZUJhY2tncm91bmQnKS5jbGljaygpXHJcbiAgICAgICAgdmlld0RhdGEuX19FVkVOVFRBUkdFVCA9ICdjdGwwMCRjdGwwMCRiYXNlQ29udGVudCRiYXNlQ29udGVudCRmbGFzaFRvcCRjdGwwMCRSYWRTY2hlZHVsZXIxJ1xyXG4gICAgICAgIHZpZXdEYXRhLl9fRVZFTlRBUkdVTUVOVCA9IEpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICAgICAgQ29tbWFuZDogYFN3aXRjaFRvJHtkb2N1bWVudC5ib2R5LmdldEF0dHJpYnV0ZSgnZGF0YS1wY3J2aWV3JykgPT09ICdtb250aCcgPyAnV2VlaycgOiAnTW9udGgnfVZpZXdgXHJcbiAgICAgICAgfSlcclxuICAgICAgICB2aWV3RGF0YS5jdGwwMF9jdGwwMF9iYXNlQ29udGVudF9iYXNlQ29udGVudF9mbGFzaFRvcF9jdGwwMF9SYWRTY2hlZHVsZXIxX0NsaWVudFN0YXRlID1cclxuICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoe3Njcm9sbFRvcDogMCwgc2Nyb2xsTGVmdDogMCwgaXNEaXJ0eTogZmFsc2V9KVxyXG4gICAgICAgIHZpZXdEYXRhLmN0bDAwX2N0bDAwX1JhZFNjcmlwdE1hbmFnZXIxX1RTTSA9ICc7O1N5c3RlbS5XZWIuRXh0ZW5zaW9ucywgVmVyc2lvbj00LjAuMC4wLCBDdWx0dXJlPW5ldXRyYWwsICcgK1xyXG4gICAgICAgICAgICAnUHVibGljS2V5VG9rZW49MzFiZjM4NTZhZDM2NGUzNTplbi1VUzpkMjg1NjhkMy1lNTNlLTQ3MDYtOTI4Zi0zNzY1OTEyYjY2Y2E6ZWE1OTdkNGI6YjI1Mzc4ZDInXHJcbiAgICAgICAgY29uc3QgcG9zdEFycmF5OiBzdHJpbmdbXSA9IFtdIC8vIEFycmF5IG9mIGRhdGEgdG8gcG9zdFxyXG4gICAgICAgIE9iamVjdC5lbnRyaWVzKHZpZXdEYXRhKS5mb3JFYWNoKChbaCwgdl0pID0+IHtcclxuICAgICAgICAgICAgcG9zdEFycmF5LnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KGgpICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHYpKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgZmV0Y2godHJ1ZSwgcG9zdEFycmF5LmpvaW4oJyYnKSlcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGxvZ291dCgpOiB2b2lkIHtcclxuICAgIGlmIChPYmplY3Qua2V5cyh2aWV3RGF0YSkubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGRlbGV0ZUNvb2tpZSgndXNlclBhc3MnKVxyXG4gICAgICAgIGVsZW1CeUlkKCdzaWRlQmFja2dyb3VuZCcpLmNsaWNrKClcclxuICAgICAgICB2aWV3RGF0YS5fX0VWRU5UVEFSR0VUID0gJ2N0bDAwJGN0bDAwJGJhc2VDb250ZW50JExvZ291dENvbnRyb2wxJExvZ2luU3RhdHVzMSRjdGwwMCdcclxuICAgICAgICB2aWV3RGF0YS5fX0VWRU5UQVJHVU1FTlQgPSAnJ1xyXG4gICAgICAgIHZpZXdEYXRhLmN0bDAwX2N0bDAwX2Jhc2VDb250ZW50X2Jhc2VDb250ZW50X2ZsYXNoVG9wX2N0bDAwX1JhZFNjaGVkdWxlcjFfQ2xpZW50U3RhdGUgPVxyXG4gICAgICAgICAgICBKU09OLnN0cmluZ2lmeSh7c2Nyb2xsVG9wOiAwLCBzY3JvbGxMZWZ0OiAwLCBpc0RpcnR5OiBmYWxzZX0pXHJcbiAgICAgICAgY29uc3QgcG9zdEFycmF5OiBzdHJpbmdbXSA9IFtdIC8vIEFycmF5IG9mIGRhdGEgdG8gcG9zdFxyXG4gICAgICAgIE9iamVjdC5lbnRyaWVzKHZpZXdEYXRhKS5mb3JFYWNoKChbaCwgdl0pID0+IHtcclxuICAgICAgICAgICAgcG9zdEFycmF5LnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KGgpICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHYpKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgZmV0Y2godHJ1ZSwgcG9zdEFycmF5LmpvaW4oJyYnKSlcclxuICAgICAgfVxyXG59XHJcbiIsImltcG9ydCB7IGFkZEFjdGl2aXR5RWxlbWVudCwgY3JlYXRlQWN0aXZpdHkgfSBmcm9tICcuLi9jb21wb25lbnRzL2FjdGl2aXR5J1xyXG5pbXBvcnQgeyBJQXNzaWdubWVudCB9IGZyb20gJy4uL3BjcidcclxuaW1wb3J0IHsgbG9jYWxTdG9yYWdlUmVhZCwgbG9jYWxTdG9yYWdlV3JpdGUgfSBmcm9tICcuLi91dGlsJ1xyXG5cclxuZXhwb3J0IHR5cGUgQWN0aXZpdHlUeXBlID0gJ2RlbGV0ZScgfCAnZWRpdCcgfCAnYWRkJ1xyXG5leHBvcnQgdHlwZSBBY3Rpdml0eUl0ZW0gPSBbQWN0aXZpdHlUeXBlLCBJQXNzaWdubWVudCwgbnVtYmVyLCBzdHJpbmcgfCB1bmRlZmluZWRdXHJcblxyXG5jb25zdCBBQ1RJVklUWV9TVE9SQUdFX05BTUUgPSAnYWN0aXZpdHknXHJcblxyXG5sZXQgYWN0aXZpdHk6IEFjdGl2aXR5SXRlbVtdID0gbG9jYWxTdG9yYWdlUmVhZChBQ1RJVklUWV9TVE9SQUdFX05BTUUpIHx8IFtdXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYWRkQWN0aXZpdHkodHlwZTogQWN0aXZpdHlUeXBlLCBhc3NpZ25tZW50OiBJQXNzaWdubWVudCwgZGF0ZTogRGF0ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0FjdGl2aXR5OiBib29sZWFuLCBjbGFzc05hbWU/OiBzdHJpbmcgKTogdm9pZCB7XHJcbiAgICBpZiAobmV3QWN0aXZpdHkpIGFjdGl2aXR5LnB1c2goW3R5cGUsIGFzc2lnbm1lbnQsIERhdGUubm93KCksIGNsYXNzTmFtZV0pXHJcbiAgICBjb25zdCBlbCA9IGNyZWF0ZUFjdGl2aXR5KHR5cGUsIGFzc2lnbm1lbnQsIGRhdGUsIGNsYXNzTmFtZSlcclxuICAgIGFkZEFjdGl2aXR5RWxlbWVudChlbClcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVBY3Rpdml0eSgpOiB2b2lkIHtcclxuICAgIGFjdGl2aXR5ID0gYWN0aXZpdHkuc2xpY2UoYWN0aXZpdHkubGVuZ3RoIC0gMTI4LCBhY3Rpdml0eS5sZW5ndGgpXHJcbiAgICBsb2NhbFN0b3JhZ2VXcml0ZShBQ1RJVklUWV9TVE9SQUdFX05BTUUsIGFjdGl2aXR5KVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVjZW50QWN0aXZpdHkoKTogQWN0aXZpdHlJdGVtW10ge1xyXG4gICAgcmV0dXJuIGFjdGl2aXR5LnNsaWNlKGFjdGl2aXR5Lmxlbmd0aCAtIDMyLCBhY3Rpdml0eS5sZW5ndGgpXHJcbn1cclxuIiwiaW1wb3J0IHsgZWxlbUJ5SWQsIGxvY2FsU3RvcmFnZVJlYWQsIGxvY2FsU3RvcmFnZVdyaXRlIH0gZnJvbSAnLi4vdXRpbCdcclxuXHJcbmNvbnN0IEFUSEVOQV9TVE9SQUdFX05BTUUgPSAnYXRoZW5hRGF0YSdcclxuXHJcbmludGVyZmFjZSBJUmF3QXRoZW5hRGF0YSB7XHJcbiAgICByZXNwb25zZV9jb2RlOiAyMDBcclxuICAgIGJvZHk6IHtcclxuICAgICAgICBjb3Vyc2VzOiB7XHJcbiAgICAgICAgICAgIGNvdXJzZXM6IElSYXdDb3Vyc2VbXVxyXG4gICAgICAgICAgICBzZWN0aW9uczogSVJhd1NlY3Rpb25bXVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHBlcm1pc3Npb25zOiBhbnlcclxufVxyXG5cclxuaW50ZXJmYWNlIElSYXdDb3Vyc2Uge1xyXG4gICAgbmlkOiBudW1iZXJcclxuICAgIGNvdXJzZV90aXRsZTogc3RyaW5nXHJcbiAgICAvLyBUaGVyZSdzIGEgYnVuY2ggbW9yZSB0aGF0IEkndmUgb21pdHRlZFxyXG59XHJcblxyXG5pbnRlcmZhY2UgSVJhd1NlY3Rpb24ge1xyXG4gICAgY291cnNlX25pZDogbnVtYmVyXHJcbiAgICBsaW5rOiBzdHJpbmdcclxuICAgIGxvZ286IHN0cmluZ1xyXG4gICAgc2VjdGlvbl90aXRsZTogc3RyaW5nXHJcbiAgICAvLyBUaGVyZSdzIGEgYnVuY2ggbW9yZSB0aGF0IEkndmUgb21pdHRlZFxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElBdGhlbmFEYXRhSXRlbSB7XHJcbiAgICBsaW5rOiBzdHJpbmdcclxuICAgIGxvZ286IHN0cmluZ1xyXG4gICAgcGVyaW9kOiBzdHJpbmdcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJQXRoZW5hRGF0YSB7XHJcbiAgICBbY2xzOiBzdHJpbmddOiBJQXRoZW5hRGF0YUl0ZW1cclxufVxyXG5cclxubGV0IGF0aGVuYURhdGE6IElBdGhlbmFEYXRhfG51bGwgPSBsb2NhbFN0b3JhZ2VSZWFkKEFUSEVOQV9TVE9SQUdFX05BTUUpXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0QXRoZW5hRGF0YSgpOiBJQXRoZW5hRGF0YXxudWxsIHtcclxuICAgIHJldHVybiBhdGhlbmFEYXRhXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZvcm1hdExvZ28obG9nbzogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIHJldHVybiBsb2dvLnN1YnN0cigwLCBsb2dvLmluZGV4T2YoJ1wiIGFsdD1cIicpKVxyXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoJzxkaXYgY2xhc3M9XCJwcm9maWxlLXBpY3R1cmVcIj48aW1nIHNyYz1cIicsICcnKVxyXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoJ3RpbnknLCAncmVnJylcclxufVxyXG5cclxuLy8gTm93LCB0aGVyZSdzIHRoZSBzY2hvb2xvZ3kvYXRoZW5hIGludGVncmF0aW9uIHN0dWZmLiBGaXJzdCwgd2UgbmVlZCB0byBjaGVjayBpZiBpdCdzIGJlZW4gbW9yZVxyXG4vLyB0aGFuIGEgZGF5LiBUaGVyZSdzIG5vIHBvaW50IGNvbnN0YW50bHkgcmV0cmlldmluZyBjbGFzc2VzIGZyb20gQXRoZW5hOyB0aGV5IGRvbnQndCBjaGFuZ2UgdGhhdFxyXG4vLyBtdWNoLlxyXG5cclxuLy8gVGhlbiwgb25jZSB0aGUgdmFyaWFibGUgZm9yIHRoZSBsYXN0IGRhdGUgaXMgaW5pdGlhbGl6ZWQsIGl0J3MgdGltZSB0byBnZXQgdGhlIGNsYXNzZXMgZnJvbVxyXG4vLyBhdGhlbmEuIEx1Y2tpbHksIHRoZXJlJ3MgdGhpcyBmaWxlIGF0IC9pYXBpL2NvdXJzZS9hY3RpdmUgLSBhbmQgaXQncyBpbiBKU09OISBMaWZlIGNhbid0IGJlIGFueVxyXG4vLyBiZXR0ZXIhIFNlcmlvdXNseSEgSXQncyBqdXN0IHRvbyBiYWQgdGhlIGxvZ2luIHBhZ2UgaXNuJ3QgaW4gSlNPTi5cclxuZnVuY3Rpb24gcGFyc2VBdGhlbmFEYXRhKGRhdDogc3RyaW5nKTogSUF0aGVuYURhdGF8bnVsbCB7XHJcbiAgICBpZiAoZGF0ID09PSAnJykgcmV0dXJuIG51bGxcclxuICAgIGNvbnN0IGQgPSBKU09OLnBhcnNlKGRhdCkgYXMgSVJhd0F0aGVuYURhdGFcclxuICAgIGNvbnN0IGF0aGVuYURhdGEyOiBJQXRoZW5hRGF0YSA9IHt9XHJcbiAgICBjb25zdCBhbGxDb3Vyc2VEZXRhaWxzOiB7IFtuaWQ6IG51bWJlcl06IElSYXdTZWN0aW9uIH0gPSB7fVxyXG4gICAgZC5ib2R5LmNvdXJzZXMuc2VjdGlvbnMuZm9yRWFjaCgoc2VjdGlvbikgPT4ge1xyXG4gICAgICAgIGFsbENvdXJzZURldGFpbHNbc2VjdGlvbi5jb3Vyc2VfbmlkXSA9IHNlY3Rpb25cclxuICAgIH0pXHJcbiAgICBkLmJvZHkuY291cnNlcy5jb3Vyc2VzLnJldmVyc2UoKS5mb3JFYWNoKChjb3Vyc2UpID0+IHtcclxuICAgICAgICBjb25zdCBjb3Vyc2VEZXRhaWxzID0gYWxsQ291cnNlRGV0YWlsc1tjb3Vyc2UubmlkXVxyXG4gICAgICAgIGF0aGVuYURhdGEyW2NvdXJzZS5jb3Vyc2VfdGl0bGVdID0ge1xyXG4gICAgICAgICAgICBsaW5rOiBgaHR0cHM6Ly9hdGhlbmEuaGFya2VyLm9yZyR7Y291cnNlRGV0YWlscy5saW5rfWAsXHJcbiAgICAgICAgICAgIGxvZ286IGZvcm1hdExvZ28oY291cnNlRGV0YWlscy5sb2dvKSxcclxuICAgICAgICAgICAgcGVyaW9kOiBjb3Vyc2VEZXRhaWxzLnNlY3Rpb25fdGl0bGVcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICAgcmV0dXJuIGF0aGVuYURhdGEyXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVBdGhlbmFEYXRhKGRhdGE6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgY29uc3QgcmVmcmVzaEVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2F0aGVuYURhdGFSZWZyZXNoJylcclxuICAgIHRyeSB7XHJcbiAgICAgICAgYXRoZW5hRGF0YSA9IHBhcnNlQXRoZW5hRGF0YShkYXRhKVxyXG4gICAgICAgIGxvY2FsU3RvcmFnZVdyaXRlKEFUSEVOQV9TVE9SQUdFX05BTUUsIGRhdGEpXHJcbiAgICAgICAgZWxlbUJ5SWQoJ2F0aGVuYURhdGFFcnJvcicpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcclxuICAgICAgICBpZiAocmVmcmVzaEVsKSByZWZyZXNoRWwuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICBlbGVtQnlJZCgnYXRoZW5hRGF0YUVycm9yJykuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcclxuICAgICAgICBpZiAocmVmcmVzaEVsKSByZWZyZXNoRWwuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xyXG4gICAgICAgIGVsZW1CeUlkKCdhdGhlbmFEYXRhRXJyb3InKS5pbm5lckhUTUwgPSBlLm1lc3NhZ2VcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBnZXREYXRhLCBJQXBwbGljYXRpb25EYXRhLCBJQXNzaWdubWVudCB9IGZyb20gJy4uL3BjcidcclxuaW1wb3J0IHsgbG9jYWxTdG9yYWdlUmVhZCwgbG9jYWxTdG9yYWdlV3JpdGUgfSBmcm9tICcuLi91dGlsJ1xyXG5cclxuY29uc3QgQ1VTVE9NX1NUT1JBR0VfTkFNRSA9ICdleHRyYSdcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUN1c3RvbUFzc2lnbm1lbnQge1xyXG4gICAgYm9keTogc3RyaW5nXHJcbiAgICBkb25lOiBib29sZWFuXHJcbiAgICBzdGFydDogbnVtYmVyXHJcbiAgICBjbGFzczogc3RyaW5nfG51bGxcclxuICAgIGVuZDogbnVtYmVyfCdGb3JldmVyJ1xyXG59XHJcblxyXG5jb25zdCBleHRyYTogSUN1c3RvbUFzc2lnbm1lbnRbXSA9IGxvY2FsU3RvcmFnZVJlYWQoQ1VTVE9NX1NUT1JBR0VfTkFNRSwgW10pXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0RXh0cmEoKTogSUN1c3RvbUFzc2lnbm1lbnRbXSB7XHJcbiAgICByZXR1cm4gZXh0cmFcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVFeHRyYSgpOiB2b2lkIHtcclxuICAgIGxvY2FsU3RvcmFnZVdyaXRlKENVU1RPTV9TVE9SQUdFX05BTUUsIGV4dHJhKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYWRkVG9FeHRyYShjdXN0b206IElDdXN0b21Bc3NpZ25tZW50KTogdm9pZCB7XHJcbiAgICBleHRyYS5wdXNoKGN1c3RvbSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUZyb21FeHRyYShjdXN0b206IElDdXN0b21Bc3NpZ25tZW50KTogdm9pZCB7XHJcbiAgICBpZiAoIWV4dHJhLmluY2x1ZGVzKGN1c3RvbSkpIHRocm93IG5ldyBFcnJvcignQ2Fubm90IHJlbW92ZSBjdXN0b20gYXNzaWdubWVudCB0aGF0IGRvZXMgbm90IGV4aXN0JylcclxuICAgIGV4dHJhLnNwbGljZShleHRyYS5pbmRleE9mKGN1c3RvbSksIDEpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBleHRyYVRvVGFzayhjdXN0b206IElDdXN0b21Bc3NpZ25tZW50LCBkYXRhOiBJQXBwbGljYXRpb25EYXRhKTogSUFzc2lnbm1lbnQge1xyXG4gICAgbGV0IGNsczogbnVtYmVyfG51bGwgPSBudWxsXHJcbiAgICBjb25zdCBjbGFzc05hbWUgPSBjdXN0b20uY2xhc3NcclxuICAgIGlmIChjbGFzc05hbWUgIT0gbnVsbCkge1xyXG4gICAgICAgIGNscyA9IGRhdGEuY2xhc3Nlcy5maW5kSW5kZXgoKGMpID0+IGMudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhjbGFzc05hbWUpKVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdGl0bGU6ICdUYXNrJyxcclxuICAgICAgICBiYXNlVHlwZTogJ3Rhc2snLFxyXG4gICAgICAgIHR5cGU6ICd0YXNrJyxcclxuICAgICAgICBhdHRhY2htZW50czogW10sXHJcbiAgICAgICAgc3RhcnQ6IGN1c3RvbS5zdGFydCxcclxuICAgICAgICBlbmQ6IGN1c3RvbS5lbmQgfHwgJ0ZvcmV2ZXInLFxyXG4gICAgICAgIGJvZHk6IGN1c3RvbS5ib2R5LFxyXG4gICAgICAgIGlkOiBgdGFzayR7Y3VzdG9tLmJvZHkucmVwbGFjZSgvW15cXHddKi9nLCAnJyl9JHtjdXN0b20uc3RhcnR9JHtjdXN0b20uZW5kfSR7Y3VzdG9tLmNsYXNzfWAsXHJcbiAgICAgICAgY2xhc3M6IGNscyA9PT0gLTEgPyBudWxsIDogY2xzXHJcbiAgICB9XHJcbn1cclxuXHJcbmludGVyZmFjZSBJUGFyc2VSZXN1bHQge1xyXG4gICAgY2xzPzogc3RyaW5nXHJcbiAgICBkdWU/OiBzdHJpbmdcclxuICAgIHN0Pzogc3RyaW5nXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUN1c3RvbVRhc2sodGV4dDogc3RyaW5nLCByZXN1bHQ6IElQYXJzZVJlc3VsdCA9IHt9KTogSVBhcnNlUmVzdWx0IHtcclxuICAgIGNvbnN0IHBhcnNlZCA9IHRleHQubWF0Y2goLyguKikgKGZvcnxieXxkdWV8YXNzaWduZWR8c3RhcnRpbmd8ZW5kaW5nfGJlZ2lubmluZykgKC4qKS8pXHJcbiAgICBpZiAocGFyc2VkID09IG51bGwpIHJldHVybiByZXN1bHRcclxuXHJcbiAgICBzd2l0Y2ggKHBhcnNlZFsyXSkge1xyXG4gICAgICAgIGNhc2UgJ2Zvcic6IHJlc3VsdC5jbHMgPSBwYXJzZWRbM107IGJyZWFrXHJcbiAgICAgICAgY2FzZSAnYnknOiBjYXNlICdkdWUnOiBjYXNlICdlbmRpbmcnOiByZXN1bHQuZHVlID0gcGFyc2VkWzNdOyBicmVha1xyXG4gICAgICAgIGNhc2UgJ2Fzc2lnbmVkJzogY2FzZSAnc3RhcnRpbmcnOiBjYXNlICdiZWdpbm5pbmcnOiByZXN1bHQuc3QgPSBwYXJzZWRbM107IGJyZWFrXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHBhcnNlQ3VzdG9tVGFzayhwYXJzZWRbMV0sIHJlc3VsdClcclxufVxyXG4iLCJpbXBvcnQgeyBsb2NhbFN0b3JhZ2VSZWFkLCBsb2NhbFN0b3JhZ2VXcml0ZSB9IGZyb20gJy4uL3V0aWwnXHJcblxyXG5jb25zdCBET05FX1NUT1JBR0VfTkFNRSA9ICdkb25lJ1xyXG5cclxuY29uc3QgZG9uZTogc3RyaW5nW10gPSBsb2NhbFN0b3JhZ2VSZWFkKERPTkVfU1RPUkFHRV9OQU1FLCBbXSlcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVGcm9tRG9uZShpZDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICBjb25zdCBpbmRleCA9IGRvbmUuaW5kZXhPZihpZClcclxuICAgIGlmIChpbmRleCA+PSAwKSBkb25lLnNwbGljZShpbmRleCwgMSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFkZFRvRG9uZShpZDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICBkb25lLnB1c2goaWQpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlRG9uZSgpOiB2b2lkIHtcclxuICAgIGxvY2FsU3RvcmFnZVdyaXRlKERPTkVfU1RPUkFHRV9OQU1FLCBkb25lKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYXNzaWdubWVudEluRG9uZShpZDogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gZG9uZS5pbmNsdWRlcyhpZClcclxufVxyXG4iLCJpbXBvcnQgeyBsb2NhbFN0b3JhZ2VSZWFkLCBsb2NhbFN0b3JhZ2VXcml0ZSB9IGZyb20gJy4uL3V0aWwnXHJcblxyXG5jb25zdCBNT0RJRklFRF9TVE9SQUdFX05BTUUgPSAnbW9kaWZpZWQnXHJcblxyXG5pbnRlcmZhY2UgSU1vZGlmaWVkQm9kaWVzIHtcclxuICAgIFtpZDogc3RyaW5nXTogc3RyaW5nXHJcbn1cclxuXHJcbmNvbnN0IG1vZGlmaWVkOiBJTW9kaWZpZWRCb2RpZXMgPSBsb2NhbFN0b3JhZ2VSZWFkKE1PRElGSUVEX1NUT1JBR0VfTkFNRSwge30pXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlRnJvbU1vZGlmaWVkKGlkOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgIGRlbGV0ZSBtb2RpZmllZFtpZF1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVNb2RpZmllZCgpOiB2b2lkIHtcclxuICAgIGxvY2FsU3RvcmFnZVdyaXRlKE1PRElGSUVEX1NUT1JBR0VfTkFNRSwgbW9kaWZpZWQpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBhc3NpZ25tZW50SW5Nb2RpZmllZChpZDogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gbW9kaWZpZWQuaGFzT3duUHJvcGVydHkoaWQpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBtb2RpZmllZEJvZHkoaWQ6IHN0cmluZyk6IHN0cmluZ3x1bmRlZmluZWQge1xyXG4gICAgcmV0dXJuIG1vZGlmaWVkW2lkXVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2V0TW9kaWZpZWQoaWQ6IHN0cmluZywgYm9keTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICBtb2RpZmllZFtpZF0gPSBib2R5XHJcbn1cclxuIiwiaW1wb3J0IHsgbG9jYWxTdG9yYWdlUmVhZCwgbG9jYWxTdG9yYWdlV3JpdGUgfSBmcm9tICcuL3V0aWwnXHJcblxyXG50eXBlIEFzc2lnbm1lbnRTcGFuID0gJ211bHRpcGxlJyB8ICdzdGFydCcgfCAnZW5kJ1xyXG50eXBlIEhpZGVBc3NpZ25tZW50cyA9ICdkYXknIHwgJ21zJyB8ICd1cydcclxudHlwZSBDb2xvclR5cGUgPSAnYXNzaWdubWVudCcgfCAnY2xhc3MnXHJcbmludGVyZmFjZSBJU2hvd25BY3Rpdml0eSB7XHJcbiAgICBhZGQ6IGJvb2xlYW5cclxuICAgIGVkaXQ6IGJvb2xlYW5cclxuICAgIGRlbGV0ZTogYm9vbGVhblxyXG59XHJcblxyXG5leHBvcnQgY29uc3Qgc2V0dGluZ3MgPSB7XHJcbiAgICAvKipcclxuICAgICAqIE1pbnV0ZXMgYmV0d2VlbiBlYWNoIGF1dG9tYXRpYyByZWZyZXNoIG9mIHRoZSBwYWdlLiBOZWdhdGl2ZSBudW1iZXJzIGluZGljYXRlIG5vIGF1dG9tYXRpY1xyXG4gICAgICogcmVmcmVzaGluZy5cclxuICAgICAqL1xyXG4gICAgZ2V0IHJlZnJlc2hSYXRlKCk6IG51bWJlciB7IHJldHVybiBsb2NhbFN0b3JhZ2VSZWFkKCdyZWZyZXNoUmF0ZScsIC0xKSB9LFxyXG4gICAgc2V0IHJlZnJlc2hSYXRlKHY6IG51bWJlcikgeyBsb2NhbFN0b3JhZ2VXcml0ZSgncmVmcmVzaFJhdGUnLCB2KSB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogV2hldGhlciB0aGUgd2luZG93IHNob3VsZCByZWZyZXNoIGFzc2lnbm1lbnQgZGF0YSB3aGVuIGZvY3Vzc2VkXHJcbiAgICAgKi9cclxuICAgIGdldCByZWZyZXNoT25Gb2N1cygpOiBib29sZWFuIHsgcmV0dXJuIGxvY2FsU3RvcmFnZVJlYWQoJ3JlZnJlc2hPbkZvY3VzJywgdHJ1ZSkgfSxcclxuICAgIHNldCByZWZyZXNoT25Gb2N1cyh2OiBib29sZWFuKSB7IGxvY2FsU3RvcmFnZVdyaXRlKCdyZWZyZXNoT25Gb2N1cycsIHYpIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBXaGV0aGVyIHN3aXRjaGluZyBiZXR3ZWVuIHZpZXdzIHNob3VsZCBiZSBhbmltYXRlZFxyXG4gICAgICovXHJcbiAgICBnZXQgdmlld1RyYW5zKCk6IGJvb2xlYW4geyByZXR1cm4gbG9jYWxTdG9yYWdlUmVhZCgndmlld1RyYW5zJywgdHJ1ZSkgfSxcclxuICAgIHNldCB2aWV3VHJhbnModjogYm9vbGVhbikgeyBsb2NhbFN0b3JhZ2VXcml0ZSgndmlld1RyYW5zJywgdikgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIE51bWJlciBvZiBkYXlzIGVhcmx5IHRvIHNob3cgdGVzdHMgaW4gbGlzdCB2aWV3XHJcbiAgICAgKi9cclxuICAgIGdldCBlYXJseVRlc3QoKTogbnVtYmVyIHsgcmV0dXJuIGxvY2FsU3RvcmFnZVJlYWQoJ2Vhcmx5VGVzdCcsIDEpIH0sXHJcbiAgICBzZXQgZWFybHlUZXN0KHY6IG51bWJlcikgeyBsb2NhbFN0b3JhZ2VXcml0ZSgnZWFybHlUZXN0JywgdikgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIFdoZXRoZXIgdG8gdGFrZSB0YXNrcyBvZmYgdGhlIGNhbGVuZGFyIHZpZXcgYW5kIHNob3cgdGhlbSBpbiB0aGUgaW5mbyBwYW5lXHJcbiAgICAgKi9cclxuICAgIGdldCBzZXBUYXNrcygpOiBib29sZWFuIHsgcmV0dXJuIGxvY2FsU3RvcmFnZVJlYWQoJ3NlcFRhc2tzJywgZmFsc2UpIH0sXHJcbiAgICBzZXQgc2VwVGFza3ModjogYm9vbGVhbikgeyBsb2NhbFN0b3JhZ2VXcml0ZSgnc2VwVGFza3MnLCB2KSB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogV2hldGhlciB0YXNrcyBzaG91bGQgaGF2ZSB0aGVpciBvd24gY29sb3JcclxuICAgICAqL1xyXG4gICAgZ2V0IHNlcFRhc2tDbGFzcygpOiBib29sZWFuIHsgcmV0dXJuIGxvY2FsU3RvcmFnZVJlYWQoJ3NlcFRhc2tDbGFzcycsIGZhbHNlKSB9LFxyXG4gICAgc2V0IHNlcFRhc2tDbGFzcyh2OiBib29sZWFuKSB7IGxvY2FsU3RvcmFnZVdyaXRlKCdzZXBUYXNrQ2xhc3MnLCB2KSB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogV2hldGhlciBwcm9qZWN0cyBzaG93IHVwIGluIHRoZSB0ZXN0IHBhZ2VcclxuICAgICAqL1xyXG4gICAgZ2V0IHByb2plY3RzSW5UZXN0UGFuZSgpOiBib29sZWFuIHsgcmV0dXJuIGxvY2FsU3RvcmFnZVJlYWQoJ3Byb2plY3RzSW5UZXN0UGFuZScsIGZhbHNlKSB9LFxyXG4gICAgc2V0IHByb2plY3RzSW5UZXN0UGFuZSh2OiBib29sZWFuKSB7IGxvY2FsU3RvcmFnZVdyaXRlKCdwcm9qZWN0c0luVGVzdFBhbmUnLCB2KSB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogV2hlbiBhc3NpZ25tZW50cyBzaG91bGQgYmUgc2hvd24gb24gY2FsZW5kYXIgdmlld1xyXG4gICAgICovXHJcbiAgICBnZXQgYXNzaWdubWVudFNwYW4oKTogQXNzaWdubWVudFNwYW4geyByZXR1cm4gbG9jYWxTdG9yYWdlUmVhZCgnYXNzaWdubWVudFNwYW4nLCAnbXVsdGlwbGUnKSB9LFxyXG4gICAgc2V0IGFzc2lnbm1lbnRTcGFuKHY6IEFzc2lnbm1lbnRTcGFuKSB7IGxvY2FsU3RvcmFnZVdyaXRlKCdhc3NpZ25tZW50U3BhbicsIHYpIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBXaGVuIGFzc2lnbm1lbnRzIHNob3VsZCBkaXNhcHBlYXIgZnJvbSBsaXN0IHZpZXdcclxuICAgICAqL1xyXG4gICAgZ2V0IGhpZGVBc3NpZ25tZW50cygpOiBIaWRlQXNzaWdubWVudHMgeyByZXR1cm4gbG9jYWxTdG9yYWdlUmVhZCgnaGlkZUFzc2lnbm1lbnRzJywgJ2RheScpIH0sXHJcbiAgICBzZXQgaGlkZUFzc2lnbm1lbnRzKHY6IEhpZGVBc3NpZ25tZW50cykgeyBsb2NhbFN0b3JhZ2VXcml0ZSgnaGlkZUFzc2lnbm1lbnRzJywgdikgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIFdoZXRoZXIgdG8gdXNlIGhvbGlkYXkgdGhlbWluZ1xyXG4gICAgICovXHJcbiAgICBnZXQgaG9saWRheVRoZW1lcygpOiBib29sZWFuIHsgcmV0dXJuIGxvY2FsU3RvcmFnZVJlYWQoJ2hvbGlkYXlUaGVtZXMnLCBmYWxzZSkgfSxcclxuICAgIHNldCBob2xpZGF5VGhlbWVzKHY6IGJvb2xlYW4pIHsgbG9jYWxTdG9yYWdlV3JpdGUoJ2hvbGlkYXlUaGVtZXMnLCB2KSB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogV2hldGhlciB0byBjb2xvciBhc3NpZ25tZW50cyBiYXNlZCBvbiB0aGVpciB0eXBlIG9yIGNsYXNzXHJcbiAgICAgKi9cclxuICAgIGdldCBjb2xvclR5cGUoKTogQ29sb3JUeXBlIHsgcmV0dXJuIGxvY2FsU3RvcmFnZVJlYWQoJ2NvbG9yVHlwZScsICdhc3NpZ25tZW50JykgfSxcclxuICAgIHNldCBjb2xvclR5cGUodjogQ29sb3JUeXBlKSB7IGxvY2FsU3RvcmFnZVdyaXRlKCdjb2xvclR5cGUnLCB2KSB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogV2hpY2ggdHlwZXMgb2YgYWN0aXZpdHkgYXJlIHNob3duIGluIHRoZSBhY3Rpdml0eSBwYW5lXHJcbiAgICAgKi9cclxuICAgIGdldCBzaG93bkFjdGl2aXR5KCk6IElTaG93bkFjdGl2aXR5IHsgcmV0dXJuIGxvY2FsU3RvcmFnZVJlYWQoJ3Nob3duQWN0aXZpdHknLCB7XHJcbiAgICAgICAgYWRkOiB0cnVlLFxyXG4gICAgICAgIGVkaXQ6IHRydWUsXHJcbiAgICAgICAgZGVsZXRlOiB0cnVlXHJcbiAgICB9KSB9LFxyXG4gICAgc2V0IHNob3duQWN0aXZpdHkodjogSVNob3duQWN0aXZpdHkpIHsgbG9jYWxTdG9yYWdlV3JpdGUoJ3Nob3duQWN0aXZpdHknLCB2KSB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogV2hldGhlciB0byBkaXNwbGF5IHRhc2tzIGluIHRoZSB0YXNrIHBhbmUgdGhhdCBhcmUgY29tcGxldGVkXHJcbiAgICAgKi9cclxuICAgIGdldCBzaG93RG9uZVRhc2tzKCk6IGJvb2xlYW4geyByZXR1cm4gbG9jYWxTdG9yYWdlUmVhZCgnc2hvd0RvbmVUYXNrcycsIGZhbHNlKSB9LFxyXG4gICAgc2V0IHNob3dEb25lVGFza3ModjogYm9vbGVhbikgeyBsb2NhbFN0b3JhZ2VXcml0ZSgnc2hvd0RvbmVUYXNrcycsIHYpIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFNldHRpbmcobmFtZTogc3RyaW5nKTogYW55IHtcclxuICAgIGlmICghc2V0dGluZ3MuaGFzT3duUHJvcGVydHkobmFtZSkpIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBzZXR0aW5nIG5hbWUgJHtuYW1lfWApXHJcbiAgICAvLyBAdHMtaWdub3JlXHJcbiAgICByZXR1cm4gc2V0dGluZ3NbbmFtZV1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNldFNldHRpbmcobmFtZTogc3RyaW5nLCB2YWx1ZTogYW55KTogdm9pZCB7XHJcbiAgICBpZiAoIXNldHRpbmdzLmhhc093blByb3BlcnR5KG5hbWUpKSB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgc2V0dGluZyBuYW1lICR7bmFtZX1gKVxyXG4gICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgc2V0dGluZ3NbbmFtZV0gPSB2YWx1ZVxyXG59XHJcbiIsImltcG9ydCB7IGZyb21EYXRlTnVtLCB0b0RhdGVOdW0gfSBmcm9tICcuL2RhdGVzJ1xyXG5cclxuLy8gQHRzLWlnbm9yZSBUT0RPOiBNYWtlIHRoaXMgbGVzcyBoYWNreVxyXG5Ob2RlTGlzdC5wcm90b3R5cGUuZm9yRWFjaCA9IEhUTUxDb2xsZWN0aW9uLnByb3RvdHlwZS5mb3JFYWNoID0gQXJyYXkucHJvdG90eXBlLmZvckVhY2hcclxuXHJcbi8qKlxyXG4gKiBGb3JjZXMgYSBsYXlvdXQgb24gYW4gZWxlbWVudFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGZvcmNlTGF5b3V0KGVsOiBIVE1MRWxlbWVudCk6IHZvaWQge1xyXG4gICAgLy8gVGhpcyBpbnZvbHZlcyBhIGxpdHRsZSB0cmlja2VyeSBpbiB0aGF0IGJ5IHJlcXVlc3RpbmcgdGhlIGNvbXB1dGVkIGhlaWdodCBvZiB0aGUgZWxlbWVudCB0aGVcclxuICAgIC8vIGJyb3dzZXIgaXMgZm9yY2VkIHRvIGRvIGEgZnVsbCBsYXlvdXRcclxuXHJcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLWV4cHJlc3Npb25cclxuICAgIGVsLm9mZnNldEhlaWdodFxyXG59XHJcblxyXG4vKipcclxuICogUmV0dXJuIGEgc3RyaW5nIHdpdGggdGhlIGZpcnN0IGxldHRlciBjYXBpdGFsaXplZFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGNhcGl0YWxpemVTdHJpbmcoc3RyOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHN0ci5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0ci5zdWJzdHIoMSlcclxufVxyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgYW4gWE1MSHR0cFJlcXVlc3Qgd2l0aCB0aGUgc3BlY2lmaWVkIHVybCwgcmVzcG9uc2UgdHlwZSwgaGVhZGVycywgYW5kIGRhdGFcclxuICovXHJcbmZ1bmN0aW9uIGNvbnN0cnVjdFhNTEh0dHBSZXF1ZXN0KHVybDogc3RyaW5nLCByZXNwVHlwZT86IFhNTEh0dHBSZXF1ZXN0UmVzcG9uc2VUeXBlfG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRlcnM/OiB7W25hbWU6IHN0cmluZ106IHN0cmluZ318bnVsbCwgZGF0YT86IHN0cmluZ3xudWxsKTogWE1MSHR0cFJlcXVlc3Qge1xyXG4gICAgY29uc3QgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KClcclxuXHJcbiAgICAvLyBJZiBQT1NUIGRhdGEgaXMgcHJvdmlkZWQgc2VuZCBhIFBPU1QgcmVxdWVzdCwgb3RoZXJ3aXNlIHNlbmQgYSBHRVQgcmVxdWVzdFxyXG4gICAgcmVxLm9wZW4oKGRhdGEgPyAnUE9TVCcgOiAnR0VUJyksIHVybCwgdHJ1ZSlcclxuXHJcbiAgICBpZiAocmVzcFR5cGUpIHJlcS5yZXNwb25zZVR5cGUgPSByZXNwVHlwZVxyXG5cclxuICAgIGlmIChoZWFkZXJzKSB7XHJcbiAgICAgICAgT2JqZWN0LmtleXMoaGVhZGVycykuZm9yRWFjaCgoaGVhZGVyKSA9PiB7XHJcbiAgICAgICAgICAgIHJlcS5zZXRSZXF1ZXN0SGVhZGVyKGhlYWRlciwgaGVhZGVyc1toZWFkZXJdKVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgLy8gSWYgZGF0YSBpcyB1bmRlZmluZWQgZGVmYXVsdCB0byB0aGUgbm9ybWFsIHJlcS5zZW5kKCksIG90aGVyd2lzZSBwYXNzIHRoZSBkYXRhIGluXHJcbiAgICByZXEuc2VuZChkYXRhKVxyXG4gICAgcmV0dXJuIHJlcVxyXG59XHJcblxyXG4vKiogU2VuZHMgYSByZXF1ZXN0IHRvIGEgc2VydmVyIGFuZCByZXR1cm5zIGEgUHJvbWlzZS5cclxuICogQHBhcmFtIHVybCB0aGUgdXJsIHRvIHJldHJpZXZlXHJcbiAqIEBwYXJhbSByZXNwVHlwZSB0aGUgdHlwZSBvZiByZXNwb25zZSB0aGF0IHNob3VsZCBiZSByZWNlaXZlZFxyXG4gKiBAcGFyYW0gaGVhZGVycyB0aGUgaGVhZGVycyB0aGF0IHdpbGwgYmUgc2VudCB0byB0aGUgc2VydmVyXHJcbiAqIEBwYXJhbSBkYXRhIHRoZSBkYXRhIHRoYXQgd2lsbCBiZSBzZW50IHRvIHRoZSBzZXJ2ZXIgKG9ubHkgZm9yIFBPU1QgcmVxdWVzdHMpXHJcbiAqIEBwYXJhbSBwcm9ncmVzc0VsZW1lbnQgYW4gb3B0aW9uYWwgZWxlbWVudCBmb3IgdGhlIHByb2dyZXNzIGJhciB1c2VkIHRvIGRpc3BsYXkgdGhlIHN0YXR1cyBvZiB0aGUgcmVxdWVzdFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHNlbmQodXJsOiBzdHJpbmcsIHJlc3BUeXBlPzogWE1MSHR0cFJlcXVlc3RSZXNwb25zZVR5cGV8bnVsbCwgaGVhZGVycz86IHtbbmFtZTogc3RyaW5nXTogc3RyaW5nfXxudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgICBkYXRhPzogc3RyaW5nfG51bGwsIHByb2dyZXNzPzogSFRNTEVsZW1lbnR8bnVsbCk6IFByb21pc2U8WE1MSHR0cFJlcXVlc3Q+IHtcclxuXHJcbiAgICBjb25zdCByZXEgPSBjb25zdHJ1Y3RYTUxIdHRwUmVxdWVzdCh1cmwsIHJlc3BUeXBlLCBoZWFkZXJzLCBkYXRhKVxyXG5cclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IHByb2dyZXNzSW5uZXIgPSBwcm9ncmVzcyA/IHByb2dyZXNzLnF1ZXJ5U2VsZWN0b3IoJ2RpdicpIDogbnVsbFxyXG4gICAgICAgIGlmIChwcm9ncmVzcyAmJiBwcm9ncmVzc0lubmVyKSB7XHJcbiAgICAgICAgICAgIGZvcmNlTGF5b3V0KHByb2dyZXNzSW5uZXIpIC8vIFdhaXQgZm9yIGl0IHRvIHJlbmRlclxyXG4gICAgICAgICAgICBwcm9ncmVzcy5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKSAvLyBEaXNwbGF5IHRoZSBwcm9ncmVzcyBiYXJcclxuICAgICAgICAgICAgaWYgKHByb2dyZXNzSW5uZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdkZXRlcm1pbmF0ZScpKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9ncmVzc0lubmVyLmNsYXNzTGlzdC5yZW1vdmUoJ2RldGVybWluYXRlJylcclxuICAgICAgICAgICAgICAgIHByb2dyZXNzSW5uZXIuY2xhc3NMaXN0LmFkZCgnaW5kZXRlcm1pbmF0ZScpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFNvbWV0aW1lcyB0aGUgYnJvd3NlciB3b24ndCBnaXZlIHRoZSB0b3RhbCBieXRlcyBpbiB0aGUgcmVzcG9uc2UsIHNvIHVzZSBwYXN0IHJlc3VsdHMgb3JcclxuICAgICAgICAvLyBhIGRlZmF1bHQgb2YgMTcwLDAwMCBieXRlcyBpZiB0aGUgYnJvd3NlciBkb2Vzbid0IHByb3ZpZGUgdGhlIG51bWJlclxyXG4gICAgICAgIGNvbnN0IGxvYWQgPSBsb2NhbFN0b3JhZ2VSZWFkKCdsb2FkJywgMTcwMDAwKVxyXG4gICAgICAgIGxldCBjb21wdXRlZExvYWQgPSAwXHJcblxyXG4gICAgICAgIHJlcS5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKGV2dCkgPT4ge1xyXG4gICAgICAgICAgICAvLyBDYWNoZSB0aGUgbnVtYmVyIG9mIGJ5dGVzIGxvYWRlZCBzbyBpdCBjYW4gYmUgdXNlZCBmb3IgYmV0dGVyIGVzdGltYXRlcyBsYXRlciBvblxyXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2VXcml0ZSgnbG9hZCcsIGNvbXB1dGVkTG9hZClcclxuICAgICAgICAgICAgaWYgKHByb2dyZXNzKSBwcm9ncmVzcy5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gICAgICAgICAgICAvLyBSZXNvbHZlIHdpdGggdGhlIHJlcXVlc3RcclxuICAgICAgICAgICAgaWYgKHJlcS5zdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShyZXEpXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoRXJyb3IocmVxLnN0YXR1c1RleHQpKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgcmVxLmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAocHJvZ3Jlc3MpIHByb2dyZXNzLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgICAgICAgICAgIHJlamVjdChFcnJvcignTmV0d29yayBFcnJvcicpKVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIGlmIChwcm9ncmVzcyAmJiBwcm9ncmVzc0lubmVyKSB7XHJcbiAgICAgICAgICAgIHJlcS5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIChldnQpID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIFVwZGF0ZSB0aGUgcHJvZ3Jlc3MgYmFyXHJcbiAgICAgICAgICAgICAgICBpZiAocHJvZ3Jlc3NJbm5lci5jbGFzc0xpc3QuY29udGFpbnMoJ2luZGV0ZXJtaW5hdGUnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb2dyZXNzSW5uZXIuY2xhc3NMaXN0LnJlbW92ZSgnaW5kZXRlcm1pbmF0ZScpXHJcbiAgICAgICAgICAgICAgICAgICAgcHJvZ3Jlc3NJbm5lci5jbGFzc0xpc3QuYWRkKCdkZXRlcm1pbmF0ZScpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb21wdXRlZExvYWQgPSBldnQubG9hZGVkXHJcbiAgICAgICAgICAgICAgICBwcm9ncmVzc0lubmVyLnN0eWxlLndpZHRoID0gKCgxMDAgKiBldnQubG9hZGVkKSAvIChldnQubGVuZ3RoQ29tcHV0YWJsZSA/IGV2dC50b3RhbCA6IGxvYWQpKSArICclJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBUaGUgZXF1aXZhbGVudCBvZiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCBidXQgdGhyb3dzIGFuIGVycm9yIGlmIHRoZSBlbGVtZW50IGlzIG5vdCBkZWZpbmVkXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZWxlbUJ5SWQoaWQ6IHN0cmluZyk6IEhUTUxFbGVtZW50IHtcclxuICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpXHJcbiAgICBpZiAoZWwgPT0gbnVsbCkgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCBlbGVtZW50IHdpdGggaWQgJHtpZH1gKVxyXG4gICAgcmV0dXJuIGVsXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBIGxpdHRsZSBoZWxwZXIgZnVuY3Rpb24gdG8gc2ltcGxpZnkgdGhlIGNyZWF0aW9uIG9mIEhUTUwgZWxlbWVudHNcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBlbGVtZW50KHRhZzogc3RyaW5nLCBjbHM6IHN0cmluZ3xzdHJpbmdbXSwgaHRtbD86IHN0cmluZ3xudWxsLCBpZD86IHN0cmluZ3xudWxsKTogSFRNTEVsZW1lbnQge1xyXG4gICAgY29uc3QgZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnKVxyXG5cclxuICAgIGlmICh0eXBlb2YgY2xzID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgIGUuY2xhc3NMaXN0LmFkZChjbHMpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNscy5mb3JFYWNoKChjKSA9PiBlLmNsYXNzTGlzdC5hZGQoYykpXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGh0bWwpIGUuaW5uZXJIVE1MID0gaHRtbFxyXG4gICAgaWYgKGlkKSBlLnNldEF0dHJpYnV0ZSgnaWQnLCBpZClcclxuXHJcbiAgICByZXR1cm4gZVxyXG59XHJcblxyXG4vKipcclxuICogVGhyb3dzIGFuIGVycm9yIGlmIHRoZSBzdXBwbGllZCBhcmd1bWVudCBpcyBudWxsLCBvdGhlcndpc2UgcmV0dXJucyB0aGUgYXJndW1lbnRcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBfJDxUPihhcmc6IFR8bnVsbCk6IFQge1xyXG4gICAgaWYgKGFyZyA9PSBudWxsKSB0aHJvdyBuZXcgRXJyb3IoJ0V4cGVjdGVkIGFyZ3VtZW50IHRvIGJlIG5vbi1udWxsJylcclxuICAgIHJldHVybiBhcmdcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF8kaChhcmc6IE5vZGV8RXZlbnRUYXJnZXR8bnVsbCk6IEhUTUxFbGVtZW50IHtcclxuICAgIGlmIChhcmcgPT0gbnVsbCkgdGhyb3cgbmV3IEVycm9yKCdFeHBlY3RlZCBub2RlIHRvIGJlIG5vbi1udWxsJylcclxuICAgIHJldHVybiBhcmcgYXMgSFRNTEVsZW1lbnRcclxufVxyXG5cclxuLy8gQmVjYXVzZSBzb21lIGxvY2FsU3RvcmFnZSBlbnRyaWVzIGNhbiBiZWNvbWUgY29ycnVwdGVkIGR1ZSB0byBlcnJvciBzaWRlIGVmZmVjdHMsIHRoZSBiZWxvd1xyXG4vLyBtZXRob2QgdHJpZXMgdG8gcmVhZCBhIHZhbHVlIGZyb20gbG9jYWxTdG9yYWdlIGFuZCBoYW5kbGVzIGVycm9ycy5cclxuZXhwb3J0IGZ1bmN0aW9uIGxvY2FsU3RvcmFnZVJlYWQobmFtZTogc3RyaW5nKTogYW55XHJcbmV4cG9ydCBmdW5jdGlvbiBsb2NhbFN0b3JhZ2VSZWFkPFI+KG5hbWU6IHN0cmluZywgZGVmYXVsdFZhbDogKCkgPT4gUik6IFJcclxuZXhwb3J0IGZ1bmN0aW9uIGxvY2FsU3RvcmFnZVJlYWQ8VD4obmFtZTogc3RyaW5nLCBkZWZhdWx0VmFsOiBUKTogVFxyXG5leHBvcnQgZnVuY3Rpb24gbG9jYWxTdG9yYWdlUmVhZChuYW1lOiBzdHJpbmcsIGRlZmF1bHRWYWw/OiBhbnkpOiBhbnkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2VbbmFtZV0pXHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBkZWZhdWx0VmFsID09PSAnZnVuY3Rpb24nID8gZGVmYXVsdFZhbCgpIDogZGVmYXVsdFZhbFxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbG9jYWxTdG9yYWdlV3JpdGUobmFtZTogc3RyaW5nLCBpdGVtOiBhbnkpOiB2b2lkIHtcclxuICAgIGxvY2FsU3RvcmFnZVtuYW1lXSA9IEpTT04uc3RyaW5naWZ5KGl0ZW0pXHJcbn1cclxuXHJcbmludGVyZmFjZSBJZGxlRGVhZGxpbmUge1xyXG4gICAgZGlkVGltZW91dDogYm9vbGVhblxyXG4gICAgdGltZVJlbWFpbmluZzogKCkgPT4gbnVtYmVyXHJcbn1cclxuXHJcbi8vIEJlY2F1c2UgdGhlIHJlcXVlc3RJZGxlQ2FsbGJhY2sgZnVuY3Rpb24gaXMgdmVyeSBuZXcgKGFzIG9mIHdyaXRpbmcgb25seSB3b3JrcyB3aXRoIENocm9tZVxyXG4vLyB2ZXJzaW9uIDQ3KSwgdGhlIGJlbG93IGZ1bmN0aW9uIHBvbHlmaWxscyB0aGF0IG1ldGhvZC5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlcXVlc3RJZGxlQ2FsbGJhY2soY2I6IChkZWFkbGluZTogSWRsZURlYWRsaW5lKSA9PiB2b2lkLCBvcHRzOiB7IHRpbWVvdXQ6IG51bWJlcn0pOiBudW1iZXIge1xyXG4gICAgaWYgKCdyZXF1ZXN0SWRsZUNhbGxiYWNrJyBpbiB3aW5kb3cpIHtcclxuICAgICAgICByZXR1cm4gKHdpbmRvdyBhcyBhbnkpLnJlcXVlc3RJZGxlQ2FsbGJhY2soY2IsIG9wdHMpXHJcbiAgICB9XHJcbiAgICBjb25zdCBzdGFydCA9IERhdGUubm93KClcclxuXHJcbiAgICByZXR1cm4gc2V0VGltZW91dCgoKSA9PiBjYih7XHJcbiAgICAgICAgZGlkVGltZW91dDogZmFsc2UsXHJcbiAgICAgICAgdGltZVJlbWFpbmluZygpOiBudW1iZXIge1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5tYXgoMCwgNTAgLSAoRGF0ZS5ub3coKSAtIHN0YXJ0KSlcclxuICAgICAgICB9XHJcbiAgICB9KSwgMSlcclxufVxyXG5cclxuLyoqXHJcbiAqIERldGVybWluZSBpZiB0aGUgdHdvIGRhdGVzIGhhdmUgdGhlIHNhbWUgeWVhciwgbW9udGgsIGFuZCBkYXlcclxuICovXHJcbmZ1bmN0aW9uIGRhdGVzRXF1YWwoYTogRGF0ZSwgYjogRGF0ZSk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRvRGF0ZU51bShhKSA9PT0gdG9EYXRlTnVtKGIpXHJcbn1cclxuXHJcbmNvbnN0IERBVEVfUkVMQVRJVkVOQU1FUzoge1tuYW1lOiBzdHJpbmddOiBudW1iZXJ9ID0ge1xyXG4gICAgJ1RvbW9ycm93JzogMSxcclxuICAgICdUb2RheSc6IDAsXHJcbiAgICAnWWVzdGVyZGF5JzogLTEsXHJcbiAgICAnMiBkYXlzIGFnbyc6IC0yXHJcbn1cclxuY29uc3QgV0VFS0RBWVMgPSBbJ1N1bmRheScsICdNb25kYXknLCAnVHVlc2RheScsICdXZWRuZXNkYXknLCAnVGh1cnNkYXknLCAnRnJpZGF5JywgJ1NhdHVyZGF5J11cclxuY29uc3QgRlVMTE1PTlRIUyA9IFsnSmFudWFyeScsICdGZWJydWFyeScsICdNYXJjaCcsICdBcHJpbCcsICdNYXknLCAnSnVuZScsICdKdWx5JywgJ0F1Z3VzdCcsICdTZXB0ZW1iZXInLCAnT2N0b2JlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgJ05vdmVtYmVyJywgJ0RlY2VtYmVyJ11cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkYXRlU3RyaW5nKGRhdGU6IERhdGV8bnVtYmVyfCdGb3JldmVyJywgYWRkVGhpczogYm9vbGVhbiA9IGZhbHNlKTogc3RyaW5nIHtcclxuICAgIGlmIChkYXRlID09PSAnRm9yZXZlcicpIHJldHVybiBkYXRlXHJcbiAgICBpZiAodHlwZW9mIGRhdGUgPT09ICdudW1iZXInKSByZXR1cm4gZGF0ZVN0cmluZyhmcm9tRGF0ZU51bShkYXRlKSwgYWRkVGhpcylcclxuXHJcbiAgICBjb25zdCByZWxhdGl2ZU1hdGNoID0gT2JqZWN0LmtleXMoREFURV9SRUxBVElWRU5BTUVTKS5maW5kKChuYW1lKSA9PiB7XHJcbiAgICAgICAgY29uc3QgZGF5QXQgPSBuZXcgRGF0ZSgpXHJcbiAgICAgICAgZGF5QXQuc2V0RGF0ZShkYXlBdC5nZXREYXRlKCkgKyBEQVRFX1JFTEFUSVZFTkFNRVNbbmFtZV0pXHJcbiAgICAgICAgcmV0dXJuIGRhdGVzRXF1YWwoZGF5QXQsIGRhdGUpXHJcbiAgICB9KVxyXG4gICAgaWYgKHJlbGF0aXZlTWF0Y2gpIHJldHVybiByZWxhdGl2ZU1hdGNoXHJcblxyXG4gICAgY29uc3QgZGF5c0FoZWFkID0gKGRhdGUuZ2V0VGltZSgpIC0gRGF0ZS5ub3coKSkgLyAxMDAwIC8gMzYwMCAvIDI0XHJcblxyXG4gICAgLy8gSWYgdGhlIGRhdGUgaXMgd2l0aGluIDYgZGF5cyBvZiB0b2RheSwgb25seSBkaXNwbGF5IHRoZSBkYXkgb2YgdGhlIHdlZWtcclxuICAgIGlmICgwIDwgZGF5c0FoZWFkICYmIGRheXNBaGVhZCA8PSA2KSB7XHJcbiAgICAgICAgcmV0dXJuIChhZGRUaGlzID8gJ1RoaXMgJyA6ICcnKSArIFdFRUtEQVlTW2RhdGUuZ2V0RGF5KCldXHJcbiAgICB9XHJcbiAgICByZXR1cm4gYCR7V0VFS0RBWVNbZGF0ZS5nZXREYXkoKV19LCAke0ZVTExNT05USFNbZGF0ZS5nZXRNb250aCgpXX0gJHtkYXRlLmdldERhdGUoKX1gXHJcbn1cclxuXHJcbi8vIFRoZSBvbmUgYmVsb3cgc2Nyb2xscyBzbW9vdGhseSB0byBhIHkgcG9zaXRpb24uXHJcbmV4cG9ydCBmdW5jdGlvbiBzbW9vdGhTY3JvbGwodG86IG51bWJlcik6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICBsZXQgc3RhcnQ6IG51bWJlcnxudWxsID0gbnVsbFxyXG4gICAgICAgIGNvbnN0IGZyb20gPSBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcFxyXG4gICAgICAgIGNvbnN0IGFtb3VudCA9IHRvIC0gZnJvbVxyXG4gICAgICAgIGNvbnN0IHN0ZXAgPSAodGltZXN0YW1wOiBudW1iZXIpID0+IHtcclxuICAgICAgICAgICAgaWYgKHN0YXJ0ID09IG51bGwpIHsgc3RhcnQgPSB0aW1lc3RhbXAgfVxyXG4gICAgICAgICAgICBjb25zdCBwcm9ncmVzcyA9IHRpbWVzdGFtcCAtIHN0YXJ0XHJcbiAgICAgICAgICAgIHdpbmRvdy5zY3JvbGxUbygwLCBmcm9tICsgKGFtb3VudCAqIChwcm9ncmVzcyAvIDM1MCkpKVxyXG4gICAgICAgICAgICBpZiAocHJvZ3Jlc3MgPCAzNTApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RlcClcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIF8kKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ25hdicpKS5jbGFzc0xpc3QucmVtb3ZlKCdoZWFkcm9vbS0tdW5waW5uZWQnKVxyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0ZXApXHJcbiAgICB9KVxyXG59XHJcblxyXG4vLyBBbmQgYSBmdW5jdGlvbiB0byBhcHBseSBhbiBpbmsgZWZmZWN0XHJcbmV4cG9ydCBmdW5jdGlvbiByaXBwbGUoZWw6IEhUTUxFbGVtZW50KTogdm9pZCB7XHJcbiAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCAoZXZ0KSA9PiB7XHJcbiAgICAgICAgaWYgKGV2dC53aGljaCAhPT0gMSkgcmV0dXJuIC8vIE5vdCBsZWZ0IGJ1dHRvblxyXG4gICAgICAgIGNvbnN0IHdhdmUgPSBlbGVtZW50KCdzcGFuJywgJ3dhdmUnKVxyXG4gICAgICAgIGNvbnN0IHNpemUgPSBNYXRoLm1heChOdW1iZXIoZWwub2Zmc2V0V2lkdGgpLCBOdW1iZXIoZWwub2Zmc2V0SGVpZ2h0KSlcclxuICAgICAgICB3YXZlLnN0eWxlLndpZHRoID0gKHdhdmUuc3R5bGUuaGVpZ2h0ID0gc2l6ZSArICdweCcpXHJcblxyXG4gICAgICAgIGxldCB4ID0gZXZ0LmNsaWVudFhcclxuICAgICAgICBsZXQgeSA9IGV2dC5jbGllbnRZXHJcbiAgICAgICAgY29uc3QgcmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXHJcbiAgICAgICAgeCAtPSByZWN0LmxlZnRcclxuICAgICAgICB5IC09IHJlY3QudG9wXHJcblxyXG4gICAgICAgIHdhdmUuc3R5bGUudG9wID0gKHkgLSAoc2l6ZSAvIDIpKSArICdweCdcclxuICAgICAgICB3YXZlLnN0eWxlLmxlZnQgPSAoeCAtIChzaXplIC8gMikpICsgJ3B4J1xyXG4gICAgICAgIGVsLmFwcGVuZENoaWxkKHdhdmUpXHJcbiAgICAgICAgd2F2ZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtaG9sZCcsIFN0cmluZyhEYXRlLm5vdygpKSlcclxuICAgICAgICBmb3JjZUxheW91dCh3YXZlKVxyXG4gICAgICAgIHdhdmUuc3R5bGUudHJhbnNmb3JtID0gJ3NjYWxlKDIuNSknXHJcbiAgICB9KVxyXG4gICAgZWwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIChldnQpID0+IHtcclxuICAgICAgICBpZiAoZXZ0LndoaWNoICE9PSAxKSByZXR1cm4gLy8gT25seSBmb3IgbGVmdCBidXR0b25cclxuICAgICAgICBjb25zdCB3YXZlcyA9IGVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3dhdmUnKVxyXG4gICAgICAgIHdhdmVzLmZvckVhY2goKHdhdmUpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgZGlmZiA9IERhdGUubm93KCkgLSBOdW1iZXIod2F2ZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtaG9sZCcpKVxyXG4gICAgICAgICAgICBjb25zdCBkZWxheSA9IE1hdGgubWF4KDM1MCAtIGRpZmYsIDApXHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgKHdhdmUgYXMgSFRNTEVsZW1lbnQpLnN0eWxlLm9wYWNpdHkgPSAnMCdcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHdhdmUucmVtb3ZlKClcclxuICAgICAgICAgICAgICAgIH0sIDU1MClcclxuICAgICAgICAgICAgfSwgZGVsYXkpXHJcbiAgICAgICAgfSlcclxuICAgIH0pXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjc3NOdW1iZXIoY3NzOiBzdHJpbmd8bnVsbCk6IG51bWJlciB7XHJcbiAgICBpZiAoIWNzcykgcmV0dXJuIDBcclxuICAgIHJldHVybiBwYXJzZUludChjc3MsIDEwKVxyXG59XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=