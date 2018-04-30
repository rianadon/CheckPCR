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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50LnRzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2FjdGl2aXR5LnRzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2Fzc2lnbm1lbnQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvYXZhdGFyLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2NhbGVuZGFyLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2N1c3RvbUFkZGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2Vycm9yRGlzcGxheS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9yZXNpemVyLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL3NuYWNrYmFyLnRzIiwid2VicGFjazovLy8uL3NyYy9jb29raWVzLnRzIiwid2VicGFjazovLy8uL3NyYy9kYXRlcy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZGlzcGxheS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbmF2aWdhdGlvbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGNyLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW5zL2FjdGl2aXR5LnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW5zL2F0aGVuYS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2lucy9jdXN0b21Bc3NpZ25tZW50cy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2lucy9kb25lLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW5zL21vZGlmaWVkQXNzaWdubWVudHMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NldHRpbmdzLnRzIiwid2VicGFjazovLy8uL3NyYy91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOzs7QUFHQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbkVxRjtBQUU5RSxNQUFNLE9BQU8sR0FBRyxRQUFRO0FBRS9CLE1BQU0sV0FBVyxHQUFHLHVFQUF1RTtBQUMzRixNQUFNLFVBQVUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxRQUFRLEtBQUssbUJBQW1CLENBQUMsQ0FBQztJQUMzRCxxRUFBcUUsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDO0FBQzFGLE1BQU0sUUFBUSxHQUFHLCtEQUErRDtBQUVoRiw2QkFBNkIsT0FBZTtJQUN4QyxPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDbkMsT0FBTyxDQUFDLG1CQUFtQixFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQztTQUN2RCxPQUFPLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQztTQUN0QixPQUFPLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQztBQUN6QyxDQUFDO0FBRUQsbUhBQW1IO0FBQzVHLEtBQUs7SUFDUixJQUFJO1FBQ0EsTUFBTSxJQUFJLEdBQUcsTUFBTSxrREFBSSxDQUFDLFdBQVcsRUFBRSxNQUFNLENBQUM7UUFDNUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUU7UUFDbEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLE9BQU8sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1FBQ3RHLHNEQUFRLENBQUMsWUFBWSxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUM7UUFDcEMsSUFBSSxPQUFPLEtBQUssQ0FBQyxFQUFFO1lBQ2Ysc0RBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO2dCQUNwRCxJQUFJLFFBQVEsQ0FBQyxRQUFRLEtBQUssbUJBQW1CLEVBQUU7b0JBQzNDLHNEQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7b0JBQzdDLFVBQVUsQ0FBQyxHQUFHLEVBQUU7d0JBQ1osc0RBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTTtvQkFDdkQsQ0FBQyxFQUFFLEdBQUcsQ0FBQztpQkFDVjtxQkFBTTtvQkFDSCxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRTtpQkFDM0I7WUFDTCxDQUFDLENBQUM7WUFDRixNQUFNLEtBQUssR0FBRyxNQUFNLGtEQUFJLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQztZQUM1QyxNQUFNLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTTtZQUMxQyxNQUFNLEtBQUssR0FBRyxNQUFNLGtEQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsUUFBUSxLQUFLLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLGVBQWUsR0FBRyxFQUFFLENBQUMsRUFBRSxNQUFNLENBQUM7WUFDMUcsc0RBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLFNBQVMsR0FBRyxPQUFPO1lBQ2pELHNEQUFRLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQztZQUMxQyxzREFBUSxDQUFDLGdCQUFnQixDQUFDLENBQUMsU0FBUyxHQUFHLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDO1lBQ2xGLHNEQUFRLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE9BQU87WUFDcEQsc0RBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQztTQUM3QztLQUNKO0lBQUMsT0FBTyxHQUFHLEVBQUU7UUFDVixPQUFPLENBQUMsR0FBRyxDQUFDLDZDQUE2QyxFQUFFLEdBQUcsQ0FBQztLQUNsRTtBQUNMLENBQUM7QUFFRCxJQUFJLE9BQU8sR0FBZ0IsSUFBSTtBQUMvQixJQUFJLFVBQVUsR0FBZ0IsSUFBSTtBQUUzQixLQUFLO0lBQ1IsSUFBSTtRQUNBLE1BQU0sSUFBSSxHQUFHLE1BQU0sa0RBQUksQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDO1FBQ3pDLElBQUksSUFBSSxHQUFHLDhEQUFnQixDQUFDLFlBQVksQ0FBQztRQUN6QyxVQUFVLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTztRQUU3QyxJQUFJLElBQUksSUFBSSxJQUFJLEVBQUU7WUFDZCxJQUFJLEdBQUcsVUFBVTtZQUNqQiwrREFBaUIsQ0FBQyxZQUFZLEVBQUUsVUFBVSxDQUFDO1NBQzlDO1FBRUQsT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDLE9BQU87UUFFcEQsSUFBSSxJQUFJLEtBQUssVUFBVSxFQUFFO1lBQ3JCLE9BQU8sRUFBRTtTQUNaO0tBQ0o7SUFBQyxPQUFPLEdBQUcsRUFBRTtRQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUMsNkNBQTZDLEVBQUUsR0FBRyxDQUFDO0tBQ2xFO0FBQ0wsQ0FBQztBQUVNLEtBQUssa0JBQWtCLE1BQW1CO0lBQzdDLElBQUksQ0FBQyxPQUFPLEVBQUU7UUFDVixJQUFJLE1BQU07WUFBRSxNQUFNLEVBQUU7UUFDcEIsT0FBTTtLQUNUO0lBQ0QsSUFBSTtRQUNBLE1BQU0sSUFBSSxHQUFHLE1BQU0sa0RBQUksQ0FBQyxPQUFPLENBQUM7UUFDaEMsWUFBWSxDQUFDLFVBQVUsR0FBRyxVQUFVO1FBQ3BDLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO1lBQzdDLHNEQUFRLENBQUMsYUFBYSxDQUFDLENBQUMsV0FBVyxDQUFDLHFEQUFPLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN6RSxDQUFDLENBQUM7UUFDRixzREFBUSxDQUFDLGdCQUFnQixDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxPQUFPO1FBQ2xELHNEQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUM7S0FDM0M7SUFBQyxPQUFPLEdBQUcsRUFBRTtRQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUMsNkNBQTZDLEVBQUUsR0FBRyxDQUFDO1FBQy9ELElBQUksTUFBTTtZQUFFLE1BQU0sRUFBRTtLQUN2QjtBQUNMLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN6RitEO0FBQ1g7QUFDSDtBQUNNO0FBQ3lCO0FBQ3ZDO0FBQ2tCO0FBT3ZDO0FBQ29FO0FBQ3pCO0FBQ2I7QUFDaUM7QUFDdkI7QUFZOUM7QUFFZixJQUFJLCtEQUFnQixDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksRUFBRTtJQUNsQyxvREFBTyxDQUFDLCtEQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0NBQ3BDO0FBRUQsb0ZBQW9GO0FBQ3BGLElBQUksQ0FBQywrREFBZ0IsQ0FBQyxXQUFXLENBQUMsRUFBRTtJQUNoQyxnRUFBaUIsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDO0lBQ3BDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLGNBQWM7Q0FDeEM7QUFFRCxNQUFNLFdBQVcsR0FBRyxpREFBRSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDckQsTUFBTSxjQUFjLEdBQUcsUUFBUSxDQUFDLGdCQUFnQixDQUM1QywyRkFBMkY7SUFDM0Ysd0ZBQXdGLENBQzNEO0FBRWpDLHFCQUFxQjtBQUNyQixFQUFFO0FBRUYsK0RBQStEO0FBRS9ELGtCQUFrQjtBQUNsQixrQkFBa0I7QUFDbEIsa0JBQWtCO0FBQ2xCLEVBQUU7QUFDRix1REFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFO0lBQ2pELEdBQUcsQ0FBQyxjQUFjLEVBQUU7SUFDcEIsb0RBQU8sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO0FBQ3ZCLENBQUMsQ0FBQztBQUVGLG9EQUFvRDtBQUNwRCx1REFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxnREFBVyxDQUFDO0FBRTlELHdDQUF3QztBQUN4Qyx1REFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSwyQ0FBTSxDQUFDO0FBRXBELCtDQUErQztBQUMvQyx1REFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxrRUFBVyxDQUFDO0FBRTdELHVDQUF1QztBQUN2QyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLFFBQVEsRUFBRSxFQUFFO0lBQ2pFLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtRQUNwQyxJQUFJLENBQUMsbURBQVEsQ0FBQyxTQUFTLEVBQUU7WUFDdkIsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQztZQUN0QywwREFBVyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7U0FDM0I7UUFDRCxnRUFBaUIsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDO1FBQ25DLFFBQVEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDekQsSUFBSSxRQUFRLEtBQUssQ0FBQyxFQUFFO1lBQ2hCLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsZ0VBQVksQ0FBQztZQUMvQyxJQUFJLG1EQUFRLENBQUMsU0FBUyxFQUFFO2dCQUNwQixJQUFJLEtBQUssR0FBZ0IsSUFBSTtnQkFDN0IsbUZBQW1GO2dCQUNuRixzREFBc0Q7Z0JBQ3RELE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO29CQUN6RCxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUM7Z0JBQzVFLElBQUksT0FBTyxHQUFHLENBQUM7Z0JBQ2YsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRTtvQkFDeEIsSUFBSSxNQUFNLENBQUMsVUFBVSxHQUFHLENBQUMsRUFBRTt3QkFBRSxPQUFPLEdBQUcsS0FBSyxHQUFHLENBQUM7cUJBQUU7Z0JBQ3RELENBQUMsQ0FBQztnQkFDRixNQUFNLFdBQVcsR0FBRyxnRkFBb0IsRUFBRTtnQkFDMUMsTUFBTSxhQUFhLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQzdELE1BQU0sSUFBSSxHQUFHLENBQUMsU0FBaUIsRUFBRSxFQUFFO29CQUMvQixJQUFJLENBQUMsT0FBTzt3QkFBRSxNQUFNLElBQUksS0FBSyxDQUFDLDBCQUEwQixDQUFDO29CQUN6RCxJQUFJLEtBQUssSUFBSSxJQUFJLEVBQUU7d0JBQUUsS0FBSyxHQUFHLFNBQVM7cUJBQUU7b0JBQ3hDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxFQUFFLEVBQUU7d0JBQ2xDLE1BQU0sR0FBRyxHQUFHLENBQUMsR0FBRyxPQUFPO3dCQUN2QixJQUFJLENBQUMsR0FBRyxPQUFPLEVBQUU7NEJBQ2pCLGFBQWEsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO3lCQUNyQjt3QkFDRCxVQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxhQUFhLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSTt3QkFDaEQsVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHO3dCQUNyRCxVQUFVLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUc7d0JBQ3RFLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxVQUFVLENBQUMsWUFBWSxHQUFHLEVBQUU7b0JBQ3RELENBQUMsQ0FBQztvQkFDRixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsRUFBRTt3QkFDM0IsT0FBTyxNQUFNLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDO3FCQUM1QztnQkFDTCxDQUFDO2dCQUNELE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUM7Z0JBQ2xDLFVBQVUsQ0FBQyxHQUFHLEVBQUU7b0JBQ1osSUFBSSxDQUFDLE9BQU87d0JBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQywwQkFBMEIsQ0FBQztvQkFDekQsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDLEVBQUUsRUFBRTt3QkFDbEMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxHQUFHLE9BQU87d0JBQ3ZCLElBQUksQ0FBQyxHQUFHLE9BQU8sRUFBRTs0QkFDakIsYUFBYSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7eUJBQ3JCO3dCQUNELFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJO3dCQUNoRCxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksVUFBVSxDQUFDLFlBQVksR0FBRyxFQUFFO29CQUN0RCxDQUFDLENBQUM7Z0JBQ04sQ0FBQyxFQUFFLEdBQUcsQ0FBQzthQUNWO2lCQUFNO2dCQUNILGtFQUFNLEVBQUU7YUFDWDtTQUNKO2FBQU07WUFDSCxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSwwREFBUyxFQUFFLENBQUM7WUFDL0IsV0FBVyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUM7WUFDN0MsVUFBVSxDQUFDLEdBQUcsRUFBRTtnQkFDWixXQUFXLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQztnQkFDbEQsV0FBVyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUM7Z0JBQ2hELFdBQVcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDO2dCQUM3QyxrRUFBbUIsQ0FBQyxHQUFHLEVBQUU7b0JBQ3JCLHNFQUFrQixFQUFFO29CQUNwQixhQUFhLEVBQUU7b0JBQ2Ysd0RBQU8sRUFBRTtnQkFDYixDQUFDLEVBQUUsRUFBQyxPQUFPLEVBQUUsSUFBSSxFQUFDLENBQUM7WUFDdkIsQ0FBQyxFQUFFLEdBQUcsQ0FBQztZQUNQLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLEVBQUUsZ0VBQVksQ0FBQztZQUNsRCxRQUFRLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsVUFBVSxFQUFFLEVBQUU7Z0JBQzNELFVBQTBCLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxNQUFNO1lBQ2xELENBQUMsQ0FBQztTQUNMO1FBQ0QsSUFBSSxDQUFDLG1EQUFRLENBQUMsU0FBUyxFQUFFO1lBQ3ZCLDBEQUFXLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztZQUMxQixVQUFVLENBQUMsR0FBRyxFQUFFO2dCQUNaLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7WUFDN0MsQ0FBQyxFQUFFLEdBQUcsQ0FBQztTQUNSO0lBQ0gsQ0FBQyxDQUFDO0FBQ0osQ0FBQyxDQUFDO0FBRUYsOENBQThDO0FBQzlDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsUUFBUSxFQUFFLEVBQUU7SUFDaEUsR0FBRyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFO1FBQ2xDLHVEQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDaEUsQ0FBQyxDQUFDO0FBQ04sQ0FBQyxDQUFDO0FBRUYsdUNBQXVDO0FBQ3ZDLElBQUksK0RBQWdCLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxFQUFFO0lBQ3BDLFFBQVEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSwrREFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNqRSxJQUFJLCtEQUFnQixDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsRUFBRTtRQUNwQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLGdFQUFZLENBQUM7S0FDaEQ7Q0FDRjtBQUVELGlHQUFpRztBQUNqRyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUU7SUFDN0IsS0FBSyxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFO1FBQ3JDLGtEQUFHLENBQUMsa0RBQUcsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUM7SUFDN0UsQ0FBQyxDQUFDO0lBQ0YsS0FBSyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFO1FBQ3BDLGtEQUFHLENBQUMsa0RBQUcsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUM7SUFDN0UsQ0FBQyxDQUFDO0lBQ0YsS0FBSyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFO1FBQ25DLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQzFCLGtEQUFHLENBQUMsa0RBQUcsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7U0FDL0U7SUFDTCxDQUFDLENBQUM7QUFDTixDQUFDLENBQUM7QUFFRiwyRUFBMkU7QUFDM0UsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFO0lBQ3pDLElBQUksR0FBRyxDQUFDLEtBQUssS0FBSyxFQUFFLEVBQUUsRUFBRSxxQkFBcUI7UUFDM0MsSUFBSSxRQUFRLENBQUMsc0JBQXNCLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUFFLE9BQU8sMEVBQVcsQ0FBQyxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1NBQUU7S0FDL0c7QUFDSCxDQUFDLENBQUMsQ0FBQztBQUVILDZEQUE2RDtBQUM3RCxDQUFDLEdBQUcsRUFBRTtJQUNGLE1BQU0sU0FBUyxHQUFHLElBQUksSUFBSSxFQUFFO0lBQzVCLElBQUksSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsSUFBSSxTQUFTO1FBQ3RELFNBQVMsSUFBSSxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFO1FBQ3hELE9BQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQztLQUMvQztBQUNMLENBQUMsQ0FBQyxFQUFFO0FBRUosK0ZBQStGO0FBQy9GLG1CQUFtQixJQUFZLEVBQUUsRUFBVSxFQUFFLENBQWM7SUFDdkQscURBQU0sQ0FBQyx1REFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3RCLHVEQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLEdBQUcsRUFBRTtRQUM1QyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO1FBQ2xDLGtFQUFNLEVBQUU7UUFDUixnRUFBaUIsQ0FBQyxFQUFFLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzNELElBQUksQ0FBQyxJQUFJLElBQUk7WUFBRSxDQUFDLEVBQUU7SUFDdEIsQ0FBQyxDQUFDO0lBQ0YsSUFBSSwrREFBZ0IsQ0FBQyxFQUFFLENBQUM7UUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO0FBQzdELENBQUM7QUFFRCx5RkFBeUY7QUFDekYsU0FBUyxDQUFDLFVBQVUsRUFBRSxVQUFVLEVBQUUsR0FBRyxFQUFFLENBQUMsVUFBVSxDQUFDLDBEQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFFakUsMERBQTBEO0FBQzFELElBQUksWUFBWSxDQUFDLFFBQVEsSUFBSSxJQUFJLEVBQUU7SUFBRSxZQUFZLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO0NBQUU7QUFDbkYsU0FBUyxDQUFDLFlBQVksRUFBRSxVQUFVLENBQUM7QUFFbkMsa0RBQWtEO0FBQ2xELFNBQVMsQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDO0FBRWhDLHdFQUF3RTtBQUN4RSxtQkFBbUIsRUFBZSxFQUFFLFNBQThCLEVBQUUsT0FBeUI7SUFFekYsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtRQUNuQyxNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUM7UUFDN0MsTUFBTSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUN2QyxDQUFDLENBQUM7QUFDTixDQUFDO0FBRUQsa0dBQWtHO0FBQ2xHLHVEQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtJQUNsRCxNQUFNLEVBQUUsR0FBRyx1REFBUSxDQUFDLGNBQWMsQ0FBQztJQUNuQyxNQUFNLEVBQUUsR0FBRyx1REFBUSxDQUFDLGFBQWEsQ0FBQztJQUNsQyxNQUFNLEVBQUUsR0FBRyx1REFBUSxDQUFDLGNBQWMsQ0FBQztJQUNuQywyRUFBdUIsRUFBRTtJQUN6Qix3REFBTyxFQUFFO0lBQ1QsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsY0FBYztJQUNqQyxPQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUM7UUFDbEIsU0FBUyxDQUFDLEVBQUUsRUFBRTtZQUNaLEVBQUMsU0FBUyxFQUFFLGdCQUFnQixFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUM7WUFDekMsRUFBQyxPQUFPLEVBQUUsQ0FBQyxFQUFDO1lBQ1osRUFBQyxTQUFTLEVBQUUsbUJBQW1CLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBQztTQUM3QyxFQUFFLEVBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFDLENBQUM7UUFDdkMsU0FBUyxDQUFDLEVBQUUsRUFBRTtZQUNaLEVBQUMsU0FBUyxFQUFFLGdCQUFnQixFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUM7WUFDekMsRUFBQyxPQUFPLEVBQUUsQ0FBQyxFQUFDO1lBQ1osRUFBQyxTQUFTLEVBQUUsbUJBQW1CLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBQztTQUM3QyxFQUFFLEVBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFDLENBQUM7S0FDeEMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUU7UUFDWCxFQUFFLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQyxTQUFTO1FBQzNCLEVBQUUsQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDLFNBQVM7UUFDM0IsTUFBTSxTQUFTLEdBQUcsSUFBSSxJQUFJLEVBQUU7UUFDNUIsU0FBUyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxHQUFHLHFFQUFpQixFQUFFLENBQUM7UUFDaEUsRUFBRSxDQUFDLFNBQVMsR0FBRyx5REFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDO1FBQzVELE9BQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTTtJQUNsQyxDQUFDLENBQUM7QUFDSixDQUFDLENBQUM7QUFFRixzRUFBc0U7QUFDdEUsdURBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO0lBQ3BELE1BQU0sRUFBRSxHQUFHLHVEQUFRLENBQUMsY0FBYyxDQUFDO0lBQ25DLE1BQU0sRUFBRSxHQUFHLHVEQUFRLENBQUMsYUFBYSxDQUFDO0lBQ2xDLE1BQU0sRUFBRSxHQUFHLHVEQUFRLENBQUMsY0FBYyxDQUFDO0lBQ25DLDJFQUF1QixFQUFFO0lBQ3pCLHdEQUFPLEVBQUU7SUFDVCxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxjQUFjO0lBQ2pDLE9BQU8sT0FBTyxDQUFDLElBQUksQ0FBQztRQUNsQixTQUFTLENBQUMsRUFBRSxFQUFFO1lBQ1osRUFBQyxTQUFTLEVBQUUsbUJBQW1CLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBQztZQUM1QyxFQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUM7WUFDWixFQUFDLFNBQVMsRUFBRSxnQkFBZ0IsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFDO1NBQzFDLEVBQUUsRUFBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUMsQ0FBQztRQUN2QyxTQUFTLENBQUMsRUFBRSxFQUFFO1lBQ1osRUFBQyxTQUFTLEVBQUUsbUJBQW1CLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBQztZQUM1QyxFQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUM7WUFDWixFQUFDLFNBQVMsRUFBRSxnQkFBZ0IsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFDO1NBQzFDLEVBQUUsRUFBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUMsQ0FBQztLQUN4QyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRTtRQUNYLEVBQUUsQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDLFNBQVM7UUFDM0IsRUFBRSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUMsU0FBUztRQUMzQixNQUFNLFNBQVMsR0FBRyxJQUFJLElBQUksRUFBRTtRQUM1QixTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxHQUFHLHFFQUFpQixFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbEUsRUFBRSxDQUFDLFNBQVMsR0FBRyx5REFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDO1FBQzVELE9BQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTTtJQUNsQyxDQUFDLENBQUM7QUFDSixDQUFDLENBQUM7QUFFRix5R0FBeUc7QUFDekc7SUFDSSxNQUFNLENBQUMsR0FBRyxJQUFJLElBQUksRUFBRTtJQUNwQixDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxHQUFHLHFFQUFpQixFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDbEQsTUFBTSxFQUFFLEdBQUcsQ0FBQyxFQUFVLEVBQUUsRUFBRTtRQUN0Qix1REFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsR0FBRyx5REFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDO1FBQzlELE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFDRCxFQUFFLENBQUMsY0FBYyxDQUFDO0lBQ2xCLEVBQUUsQ0FBQyxhQUFhLENBQUM7SUFDakIsRUFBRSxDQUFDLGNBQWMsQ0FBQztBQUN0QixDQUFDO0FBRUQsc0JBQXNCLEdBQVU7SUFDNUIsSUFBSSxrREFBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLGtEQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUU7UUFDM0YscUVBQWlCLENBQUMsd0RBQVMsQ0FBQyxNQUFNLENBQUMsa0RBQUcsQ0FBQyxrREFBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLG9EQUFLLEVBQUUsQ0FBQztRQUN6RyxhQUFhLEVBQUU7UUFDZixRQUFRLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsR0FBRyxDQUFDO1FBQzVDLE9BQU8sd0RBQU8sRUFBRTtLQUNuQjtBQUNMLENBQUM7QUFFRCxRQUFRLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxZQUFZLENBQUM7QUFDeEQsUUFBUSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxvQkFBb0IsRUFBRSxZQUFZLENBQUMsQ0FBQztBQUNuRSxDQUFDLEdBQUcsRUFBRTtJQUNGLElBQUksUUFBUSxHQUFnQixJQUFJO0lBQ2hDLFFBQVEsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDN0csUUFBUSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtRQUMvQyxJQUFJLFFBQVE7WUFBRSxZQUFZLENBQUMsUUFBUSxDQUFDO1FBQ3BDLFFBQVEsR0FBRyxJQUFJO0lBQ25CLENBQUMsQ0FBQztBQUNOLENBQUMsQ0FBQyxFQUFFO0FBRUosbUJBQW1CO0FBQ25CLHVCQUF1QjtBQUN2Qix1QkFBdUI7QUFDdkIsRUFBRTtBQUNGLG9IQUFvSDtBQUNwSCxNQUFNLFFBQVEsR0FBRyxJQUFJLFFBQVEsQ0FBQyxpREFBRSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtJQUMvRCxTQUFTLEVBQUUsRUFBRTtJQUNiLE1BQU0sRUFBRSxFQUFFO0NBQ1gsQ0FBQztBQUNGLFFBQVEsQ0FBQyxJQUFJLEVBQUU7QUFFZiw2Q0FBNkM7QUFDN0MsdURBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7SUFDeEQsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLFFBQVE7SUFDdkMsdURBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQztJQUMzQyxPQUFPLHVEQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE9BQU87QUFDM0QsQ0FBQyxDQUFDO0FBRUYsdURBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7SUFDeEQsdURBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsR0FBRztJQUM5Qyx1REFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO0lBQzlDLHVEQUFRLENBQUMsWUFBWSxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxFQUFFO0lBQ3ZDLE9BQU8sVUFBVSxDQUFDLEdBQUcsRUFBRTtRQUNyQixRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsTUFBTTtRQUNyQyx1REFBUSxDQUFDLGdCQUFnQixDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNO0lBQ25ELENBQUMsRUFDQyxHQUFHLENBQUM7QUFDUixDQUFDLENBQUM7QUFFRix1RUFBWSxFQUFFO0FBRWQsd0NBQXdDO0FBQ3hDLHFCQUFxQjtBQUNyQixFQUFFO0FBRUYsZ0NBQWdDO0FBQ2hDLFdBQVc7QUFDWCxFQUFFO0FBQ0Ysa0dBQWtHO0FBQ2xHLG1GQUFtRjtBQUNuRix1REFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLFNBQVMsR0FBRyw0Q0FBTztBQUV2Qyx1RkFBdUY7QUFDdkYsdURBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO0lBQ2pELHVEQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxLQUFLLEVBQUU7SUFDbEMsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQztJQUM1Qyx1REFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsR0FBRyxVQUFVO0lBQ3hDLE9BQU8sVUFBVSxDQUFDLEdBQUcsRUFBRTtRQUNuQixrREFBRyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU07SUFDOUQsQ0FBQyxDQUFDO0FBQ04sQ0FBQyxDQUFDO0FBRUYsMkRBQTJEO0FBQzNELHVEQUFRLENBQUMsWUFBWSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtJQUNsRCxrREFBRyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE9BQU87SUFDM0QsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQztJQUMvQyxPQUFPLHVEQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxHQUFHLFdBQVc7QUFDcEQsQ0FBQyxDQUFDO0FBRUYsK0NBQStDO0FBQy9DLElBQUksbURBQVEsQ0FBQyxRQUFRLEVBQUU7SUFDbkIsdURBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQztJQUN6Qyx1REFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTTtDQUN6QztBQUNELElBQUksbURBQVEsQ0FBQyxhQUFhLEVBQUU7SUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDO0NBQUU7QUFDNUUsSUFBSSxtREFBUSxDQUFDLFlBQVksRUFBRTtJQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUM7Q0FBRTtBQUUxRSxJQUFJLGdCQUFnQixHQUFjLCtEQUFnQixDQUFDLGtCQUFrQixFQUFFO0lBQ25FLFNBQVMsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxTQUFTO0NBQ2xGLENBQUM7QUFDRixJQUFJLFdBQVcsR0FBRywrREFBZ0IsQ0FBQyxhQUFhLEVBQUUsR0FBRyxFQUFFO0lBQ25ELE1BQU0sRUFBRSxHQUFjLEVBQUU7SUFDeEIsTUFBTSxJQUFJLEdBQUcsb0RBQU8sRUFBRTtJQUN0QixJQUFJLENBQUMsSUFBSTtRQUFFLE9BQU8sRUFBRTtJQUNwQixJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQVMsRUFBRSxFQUFFO1FBQy9CLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTO0lBQ3JCLENBQUMsQ0FBQztJQUNGLE9BQU8sRUFBRTtBQUNiLENBQUMsQ0FBQztBQUNGLHVEQUFRLENBQUMsR0FBRyxtREFBUSxDQUFDLFNBQVMsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxPQUFPO0FBQy9ELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO0lBQ3BDLElBQUksbURBQVEsQ0FBQyxjQUFjO1FBQUUsa0RBQUssRUFBRTtBQUN0QyxDQUFDLENBQUM7QUFDRjtJQUNJLE1BQU0sQ0FBQyxHQUFHLG1EQUFRLENBQUMsV0FBVztJQUM5QixJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDUCxVQUFVLENBQUMsR0FBRyxFQUFFO1lBQ1osT0FBTyxDQUFDLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQztZQUM1QyxrREFBSyxFQUFFO1lBQ1AsZUFBZSxFQUFFO1FBQ3JCLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQztLQUNwQjtBQUNMLENBQUM7QUFDRCxlQUFlLEVBQUU7QUFFakIsd0VBQXdFO0FBQ3hFLE1BQU0sT0FBTyxHQUFjO0lBQ3pCLFNBQVMsRUFBRSxTQUFTO0lBQ3BCLFNBQVMsRUFBRSxTQUFTO0lBQ3BCLFNBQVMsRUFBRSxTQUFTO0lBQ3BCLFNBQVMsRUFBRSxTQUFTO0lBQ3BCLFNBQVMsRUFBRSxTQUFTO0lBQ3BCLFNBQVMsRUFBRSxTQUFTO0lBQ3BCLFNBQVMsRUFBRSxTQUFTO0lBQ3BCLFNBQVMsRUFBRSxTQUFTO0lBQ3BCLFNBQVMsRUFBRSxTQUFTO0lBQ3BCLFNBQVMsRUFBRSxTQUFTO0lBQ3BCLFNBQVMsRUFBRSxTQUFTO0lBQ3BCLFNBQVMsRUFBRSxTQUFTO0lBQ3BCLFNBQVMsRUFBRSxTQUFTO0lBQ3BCLFNBQVMsRUFBRSxTQUFTO0lBQ3BCLFNBQVMsRUFBRSxTQUFTO0lBQ3BCLFNBQVMsRUFBRSxTQUFTO0lBQ3BCLFNBQVMsRUFBRSxTQUFTO0lBQ3BCLFNBQVMsRUFBRSxTQUFTO0NBQ3JCO0FBRUQsdURBQVUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQVMsRUFBRSxFQUFFO0lBQy9CLE1BQU0sQ0FBQyxHQUFHLHNEQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDL0IsQ0FBQyxDQUFDLFlBQVksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDO0lBQ2pDLENBQUMsQ0FBQyxXQUFXLENBQUMsc0RBQU8sQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDbEMsdURBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO0FBQzFDLENBQUMsQ0FBQztBQUNGLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtJQUMvQyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUU7UUFDeEMsTUFBTSxlQUFlLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUM7UUFDMUQsSUFBSSxDQUFDLGVBQWU7WUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLGlDQUFpQyxDQUFDO1FBRXhFLE1BQU0sRUFBRSxHQUFHLGtEQUFHLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMzQyxNQUFNLFFBQVEsR0FBRyxDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLGFBQWEsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxrQkFBa0I7UUFDNUYsTUFBTSxVQUFVLEdBQUcsQ0FBQyxDQUFZLEVBQUUsRUFBRTtZQUNoQyxDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLGFBQWEsQ0FBQyxDQUFDLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLEdBQUcsQ0FBQztRQUNuRixDQUFDO1FBQ0QsTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxhQUFhLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCO1FBQ3BGLEVBQUUsQ0FBQyxLQUFLLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUM7UUFDaEQsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtZQUMvQixNQUFNLEVBQUUsR0FBRyxzREFBTyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUM7WUFDOUIsRUFBRSxDQUFDLEtBQUssQ0FBQyxlQUFlLEdBQUcsQ0FBQztZQUM1QixJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsZUFBZSxDQUFDLEVBQUU7Z0JBQzdCLEVBQUUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQzthQUMvQjtZQUNELEVBQUUsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDO1FBQ3RCLENBQUMsQ0FBQztRQUNGLE1BQU0sTUFBTSxHQUFHLHNEQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsYUFBYSxDQUFDLEVBQUU7MENBQ2QsSUFBSSxDQUFDLGVBQWUsQ0FBQzs7O2dDQUcvQixDQUFDO1FBQ3pCLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUNoRSxpREFBRSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtZQUM1RCxFQUFFLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7WUFDL0IsR0FBRyxDQUFDLGVBQWUsRUFBRTtRQUN6QixDQUFDLENBQUM7UUFDRixFQUFFLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUU7WUFDakMsSUFBSSxFQUFFLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsRUFBRTtnQkFDakMsTUFBTSxNQUFNLEdBQUcsa0RBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDO2dCQUM5QixNQUFNLEVBQUUsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxlQUFlLElBQUksTUFBTSxDQUFDLENBQUMsV0FBVyxFQUFFO2dCQUMxRSxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsRUFBRTtnQkFDMUIsRUFBRSxDQUFDLEtBQUssQ0FBQyxlQUFlLEdBQUcsRUFBRTtnQkFDN0IsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUM7Z0JBQ2xELElBQUksUUFBUSxFQUFFO29CQUNWLFFBQVEsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQztpQkFDeEM7Z0JBQ0QsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDO2dCQUNoQyxZQUFZLENBQUMsUUFBUSxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7Z0JBQzdDLFVBQVUsQ0FBQyxJQUFJLENBQUM7Z0JBQ2hCLFlBQVksRUFBRTthQUNqQjtZQUNELEVBQUUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUNqQyxDQUFDLENBQUM7UUFDRixpREFBRSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtZQUNwRSxFQUFFLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7WUFDL0IsRUFBRSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO1lBQzdCLE1BQU0sVUFBVSxHQUFHLEVBQUUsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDO1lBQ2hELElBQUksVUFBVSxJQUFJLElBQUksRUFBRTtnQkFDcEIsVUFBVSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDO2FBQzFDO1lBQ0QsRUFBRSxDQUFDLEtBQUssQ0FBQyxlQUFlLEdBQUcsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsaURBQUUsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1lBQzVGLFlBQVksQ0FBQyxRQUFRLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztZQUM3QyxZQUFZLEVBQUU7WUFDZCxPQUFPLEdBQUcsQ0FBQyxlQUFlLEVBQUU7UUFDaEMsQ0FBQyxDQUFDO0lBQ04sQ0FBQyxDQUFDO0FBQ04sQ0FBQyxDQUFDO0FBRUYsa0VBQWtFO0FBQ2xFO0lBQ0ksTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUM7SUFDN0MsS0FBSyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzlDLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQztJQUNoQyxNQUFNLEtBQUssR0FBRyxpREFBRSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQWtCO0lBRTlDLE1BQU0sWUFBWSxHQUFHLENBQUMsUUFBZ0IsRUFBRSxLQUFhLEVBQUUsSUFBWSxFQUFFLEtBQUssR0FBRyxFQUFFLEVBQUUsRUFBRTtRQUMvRSxNQUFNLEtBQUssR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUMsV0FBVyxFQUFFO1FBQy9ELEtBQUssQ0FBQyxVQUFVLENBQUMsR0FBRyxLQUFLLGNBQWMsUUFBUSx3QkFBd0IsS0FBSyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQ3JGLEtBQUssQ0FBQyxVQUFVLENBQUMsR0FBRyxLQUFLLGNBQWMsUUFBUSw2QkFBNkIsSUFBSSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQ3pGLEtBQUssQ0FBQyxVQUFVLENBQUMsR0FBRyxLQUFLLGNBQWMsUUFBUSxnQ0FBZ0MsS0FBSyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQzdGLEtBQUssQ0FBQyxVQUFVLENBQUMsR0FBRyxLQUFLLGtCQUFrQixRQUFRLDBCQUEwQixLQUFLLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDM0YsS0FBSyxDQUFDLFVBQVUsQ0FBQyxHQUFHLEtBQUssa0JBQWtCLFFBQVEsK0JBQStCLElBQUksS0FBSyxFQUFFLENBQUMsQ0FBQztJQUNuRyxDQUFDO0lBRUQsTUFBTSxhQUFhLEdBQUcsQ0FBQyxLQUFhLEVBQUUsRUFBRSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsV0FBVyxFQUFFO0lBRWxGLElBQUksbURBQVEsQ0FBQyxTQUFTLEtBQUssWUFBWSxFQUFFO1FBQ3JDLE1BQU0sQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsRUFBRSxFQUFFO1lBQ3ZELFlBQVksQ0FBQyxJQUFJLElBQUksRUFBRSxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNFLENBQUMsQ0FBQztLQUNMO1NBQU07UUFDSCxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxFQUFFLEVBQUU7WUFDbEQsWUFBWSxDQUFDLGlCQUFpQixJQUFJLEtBQUssRUFBRSxLQUFLLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMzRixDQUFDLENBQUM7S0FDTDtJQUVELFlBQVksQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQztJQUMzQyxZQUFZLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsUUFBUSxDQUFDO0FBQ3pELENBQUM7QUFFRCx3Q0FBd0M7QUFDeEMsWUFBWSxFQUFFO0FBRWQsbUVBQW1FO0FBQ25FLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO0lBQ3hELElBQUksQ0FBQyxDQUFDLENBQUMsWUFBWSxnQkFBZ0IsQ0FBQztRQUFFLE9BQU07SUFDNUMsSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLFVBQVUsRUFBRTtRQUN2QixDQUFDLENBQUMsT0FBTyxHQUFHLDZEQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztLQUNqQztTQUFNO1FBQ0gsQ0FBQyxDQUFDLEtBQUssR0FBRyw2REFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7S0FDL0I7SUFDRCxDQUFDLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUU7UUFDakMsSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLFVBQVUsRUFBRTtZQUN2Qiw2REFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQztTQUNoQzthQUFNO1lBQ0gsNkRBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUM7U0FDOUI7UUFDRCxRQUFRLENBQUMsQ0FBQyxJQUFJLEVBQUU7WUFDWixLQUFLLGFBQWEsQ0FBQyxDQUFDLE9BQU8sZUFBZSxFQUFFO1lBQzVDLEtBQUssV0FBVyxDQUFDLENBQUMsT0FBTyx3REFBTyxFQUFFO1lBQ2xDLEtBQUssZ0JBQWdCLENBQUMsQ0FBQyxPQUFPLHdEQUFPLEVBQUU7WUFDdkMsS0FBSyxvQkFBb0IsQ0FBQyxDQUFDLE9BQU8sd0RBQU8sRUFBRTtZQUMzQyxLQUFLLGlCQUFpQixDQUFDLENBQUMsT0FBTyx3REFBTyxFQUFFO1lBQ3hDLEtBQUssZUFBZSxDQUFDLENBQUMsT0FBTyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFDdkYsS0FBSyxjQUFjO2dCQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUFDLE9BQU8sd0RBQU8sRUFBRTtZQUNoRyxLQUFLLFVBQVUsQ0FBQyxDQUFDLE9BQU8sdURBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsT0FBTztTQUM5RTtJQUNMLENBQUMsQ0FBQztBQUNOLENBQUMsQ0FBQztBQUVGLCtDQUErQztBQUMvQyxNQUFNLFNBQVMsR0FDWCxpREFBRSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMscUNBQXFDLG1EQUFRLENBQUMsU0FBUyxLQUFLLENBQUMsQ0FBcUI7QUFDaEgsU0FBUyxDQUFDLE9BQU8sR0FBRyxJQUFJO0FBQ3hCLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7SUFDaEUsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFO1FBQ25DLE1BQU0sQ0FBQyxHQUFJLGlEQUFFLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFzQixDQUFDLEtBQUs7UUFDbkcsSUFBSSxDQUFDLEtBQUssWUFBWSxJQUFJLENBQUMsS0FBSyxPQUFPO1lBQUUsT0FBTTtRQUMvQyxtREFBUSxDQUFDLFNBQVMsR0FBRyxDQUFDO1FBQ3RCLElBQUksQ0FBQyxLQUFLLE9BQU8sRUFBRTtZQUNqQix1REFBUSxDQUFDLGtCQUFrQixDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNO1lBQ25ELHVEQUFRLENBQUMsYUFBYSxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxPQUFPO1NBQ2hEO2FBQU07WUFDTCx1REFBUSxDQUFDLGtCQUFrQixDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxPQUFPO1lBQ3BELHVEQUFRLENBQUMsYUFBYSxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNO1NBQy9DO1FBQ0QsT0FBTyxZQUFZLEVBQUU7SUFDdkIsQ0FBQyxDQUFDO0FBQ0osQ0FBQyxDQUFDO0FBRUYsK0JBQStCO0FBQy9CLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtJQUNsRCxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxlQUFlLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLEVBQUU7UUFDbEUsQ0FBQyxDQUFDLEtBQUssR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztLQUMvQjtJQUNELENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtRQUNsQyxZQUFZLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLO1FBQzlCLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxlQUFlLEVBQUU7WUFDOUIseUVBQWdCLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztTQUMxQjtJQUNILENBQUMsQ0FBQztBQUNKLENBQUMsQ0FBQztBQUVGLHVCQUF1QjtBQUN2QixzQkFBc0I7QUFDdEIsc0JBQXNCO0FBQ3RCLEVBQUU7QUFDRixpQ0FBaUM7QUFDakMsRUFBRTtBQUNGLGtGQUFrRjtBQUNsRixPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxnQ0FBZ0MsQ0FBQztBQUM1RCxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsNENBQU8sb0NBQW9DLEVBQUUsa0JBQWtCLENBQUM7QUFDekYsT0FBTyxDQUFDLEdBQUcsQ0FBQzs7Ozs7Ozs7OztzREFVMEMsRUFDdkMsR0FBRyxDQUFFLEVBQWUsQ0FBQyxNQUFNLENBQUMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsZ0JBQWdCLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbEgsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7QUFFZixzREFBc0Q7QUFDdEQsTUFBTSxlQUFlLEdBQUcsK0RBQWdCLENBQUMsWUFBWSxDQUFDO0FBQ3RELHVEQUFRLENBQUMsWUFBWSxDQUFDLENBQUMsU0FBUyxHQUFHLGVBQWUsQ0FBQyxDQUFDLENBQUMsNkRBQVksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTztBQUU1RixJQUFJLCtEQUFnQixDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksRUFBRTtJQUNsQyxnQ0FBZ0M7SUFDaEMsd0VBQWMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO1FBQzlCLHFFQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ25FLENBQUMsQ0FBQztJQUVGLHdEQUFPLEVBQUU7Q0FDWjtBQUVELGtEQUFLLEVBQUU7QUFFUCxxQkFBcUI7QUFDckIsU0FBUztBQUNULFNBQVM7QUFDVCxFQUFFO0FBQ0YsOERBQThEO0FBQzlELE9BQU8sTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsVUFBVTtBQUMxQyxNQUFNLFVBQVUsR0FBRyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRTtJQUNuRCxXQUFXLEVBQUU7UUFDWCxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsRUFBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLG9CQUFvQixFQUFDLENBQUM7S0FDdkQ7Q0FDRixDQUFDO0FBRUYsa0dBQWtHO0FBQ2xHLDZDQUE2QztBQUM3QyxJQUFJLE9BQU8sR0FBRyxLQUFLO0FBQ25CLE1BQU0sVUFBVSxHQUFHLElBQUksTUFBTSxDQUFDLHVEQUFRLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDckQsVUFBVSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRTtJQUN6QixJQUFJLENBQUMsQ0FBQyxXQUFXLEtBQUssT0FBTyxFQUFFO1FBQzdCLENBQUMsQ0FBQyxjQUFjLEVBQUU7UUFDbEIsSUFBSSxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxNQUFNO1FBQ3BCLE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsTUFBTTtRQUV0QixNQUFNLElBQUksR0FBRyx1REFBUSxDQUFDLGdCQUFnQixDQUFDO1FBQ3ZDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE9BQU87UUFDNUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsR0FBRztRQUN4Qix1REFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDO1FBRTNDLHlCQUF5QjtRQUN6QixJQUFJLENBQUMsR0FBRyxHQUFHLEVBQUU7WUFDWCxDQUFDLEdBQUcsR0FBRztTQUNSO2FBQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ2hCLENBQUMsR0FBRyxDQUFDO1lBRUwsaUJBQWlCO1lBQ2pCLElBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRTtnQkFDWCxPQUFPLEdBQUcsS0FBSztnQkFDakIsa0JBQWtCO2FBQ2pCO2lCQUFNLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRTtnQkFDbkIsT0FBTyxHQUFHLElBQUk7YUFDZjtTQUNGO1FBRUQsdURBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLGNBQWMsQ0FBQyxHQUFHLEdBQUcsS0FBSztRQUNoRSxNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLEVBQUUsR0FBRyxDQUFDO1FBQzdDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQztLQUNuRDtBQUNILENBQUMsQ0FBQztBQUVGLFVBQVUsQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUU7SUFDNUIsSUFBSSxDQUFDLENBQUMsV0FBVyxLQUFLLE9BQU8sRUFBRTtRQUM3QixJQUFJLE9BQU87UUFDWCxNQUFNLEVBQUUsU0FBUyxFQUFFLEdBQUcsQ0FBQztRQUN2QixrRkFBa0Y7UUFDbEYsSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLFNBQVMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDekQsT0FBTyxHQUFHLHVEQUFRLENBQUMsU0FBUyxDQUFDO1lBQzdCLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztZQUNsQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUM7WUFDL0IsT0FBTyxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsRUFBRTtZQUM1Qix1REFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsTUFBTTtTQUU1QzthQUFNLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDLEVBQUU7WUFDeEMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLE1BQU07WUFDckMsT0FBTyxHQUFHLHVEQUFRLENBQUMsU0FBUyxDQUFDO1lBQzdCLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztZQUNsQyxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7WUFDbEMsT0FBTyxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsRUFBRTtZQUM1Qix1REFBUSxDQUFDLGdCQUFnQixDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxFQUFFO1lBQzdDLHVEQUFRLENBQUMsWUFBWSxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxNQUFNO1lBQzNDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyx1REFBUSxDQUFDLGdCQUFnQixDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLEVBQ2hFLEdBQUcsQ0FBQztTQUNQO0tBQ0Y7QUFDSCxDQUFDLENBQUM7QUFFRixVQUFVLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFO0lBQ3ZCLHVEQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxLQUFLLEVBQUU7SUFDbEMsQ0FBQyxDQUFDLGNBQWMsRUFBRTtBQUN0QixDQUFDLENBQUM7QUFFRixNQUFNLEVBQUUsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQztBQUVoRCwyREFBMkQ7QUFDM0QscURBQU0sQ0FBQyx1REFBUSxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDbEMsdURBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7SUFDeEQsdURBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztBQUNyRCxDQUFDLENBQUM7QUFFRixtREFBbUQ7QUFDbkQsTUFBTSxhQUFhLEdBQUcsbURBQVEsQ0FBQyxhQUFhO0FBRTVDO0lBQ0ksTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFhLEVBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFDLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM1RixPQUFPLHVEQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsU0FBUyxHQUFHLEtBQUs7QUFDbEQsQ0FBQztBQUNELGVBQWUsRUFBRTtBQUNqQixNQUFNLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxFQUFFLEVBQUU7SUFDeEQsSUFBSSxJQUFJLEtBQUssS0FBSyxJQUFJLElBQUksS0FBSyxNQUFNLElBQUksSUFBSSxLQUFLLFFBQVEsRUFBRTtRQUMxRCxNQUFNLElBQUksS0FBSyxDQUFDLHlCQUF5QixJQUFJLEVBQUUsQ0FBQztLQUNqRDtJQUVELE1BQU0sUUFBUSxHQUFHLHVEQUFRLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBcUI7SUFDOUQsUUFBUSxDQUFDLE9BQU8sR0FBRyxPQUFPO0lBQzFCLElBQUksT0FBTyxFQUFFO1FBQUUsdURBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQztLQUFFO0lBQzdELFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtRQUMxQyxhQUFhLENBQUMsSUFBSSxDQUFDLEdBQUcsUUFBUSxDQUFDLE9BQU87UUFDdEMsdURBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQyxZQUFZLENBQUMsZUFBZSxFQUFFLGVBQWUsRUFBRSxDQUFDO1FBQ3pFLHVEQUFRLENBQUMsY0FBYyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDL0MsbURBQVEsQ0FBQyxhQUFhLEdBQUcsYUFBYTtJQUN4QyxDQUFDLENBQUM7QUFDSixDQUFDLENBQUM7QUFFRix3RkFBd0Y7QUFDeEYsTUFBTSxlQUFlLEdBQUcsdURBQVEsQ0FBQyxlQUFlLENBQXFCO0FBQ3JFLElBQUksbURBQVEsQ0FBQyxhQUFhLEVBQUU7SUFDMUIsZUFBZSxDQUFDLE9BQU8sR0FBRyxJQUFJO0lBQzlCLHVEQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQztDQUMxRDtBQUNELGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFO0lBQzlDLG1EQUFRLENBQUMsYUFBYSxHQUFHLGVBQWUsQ0FBQyxPQUFPO0lBQ2hELHVEQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRSxtREFBUSxDQUFDLGFBQWEsQ0FBQztBQUN0RixDQUFDLENBQUM7QUFFRixzQkFBc0I7QUFDdEIsbUJBQW1CO0FBQ25CLG1CQUFtQjtBQUNuQixFQUFFO0FBRUYsSUFBSSxRQUFRLENBQUMsUUFBUSxLQUFLLG1CQUFtQixFQUFFO0lBQUUsd0RBQVcsRUFBRTtDQUFFO0FBRWhFLDJFQUEyRTtBQUMzRSx1REFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7SUFDckQsdURBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztJQUM3QyxVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ2QsdURBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTTtJQUNyRCxDQUFDLEVBQUUsR0FBRyxDQUFDO0FBQ1QsQ0FBQyxDQUFDO0FBRUYsMkRBQTJEO0FBQzNELHNEQUFTLEVBQUU7QUFFWCxnRkFBZ0Y7QUFDaEY7SUFDRSx1REFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO0lBQzNDLFVBQVUsQ0FBQyxHQUFHLEVBQUU7UUFDZCx1REFBUSxDQUFDLGdCQUFnQixDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNO0lBQ25ELENBQUMsRUFBRSxHQUFHLENBQUM7QUFDVCxDQUFDO0FBRUQsdURBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDO0FBQ3ZELHVEQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDO0FBRS9ELDhEQUE4RDtBQUM5RCx1REFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7SUFDL0MsdURBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLEtBQUssRUFBRTtJQUNsQyxNQUFNLFdBQVcsR0FBRyxHQUFHLEVBQUU7UUFDdkIsdURBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsT0FBTztRQUNsRCxPQUFPLHVEQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUM7SUFDakQsQ0FBQztJQUVELElBQUksdURBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtRQUNuRCxvREFBTyxDQUFDLFdBQVcsQ0FBQztLQUNyQjtTQUFNO1FBQ0wsV0FBVyxFQUFFO0tBQ2Q7QUFDSCxDQUFDLENBQUM7QUFFRixzQ0FBc0M7QUFDdEM7SUFDRSx1REFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO0lBQzVDLFVBQVUsQ0FBQyxHQUFHLEVBQUU7UUFDZCx1REFBUSxDQUFDLGlCQUFpQixDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNO0lBQ3BELENBQUMsRUFBRSxHQUFHLENBQUM7QUFDVCxDQUFDO0FBRUQsdURBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDO0FBQ3pELHVEQUFRLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDO0FBRWpFLGtCQUFrQjtBQUNsQix5QkFBeUI7QUFDekIseUJBQXlCO0FBQ3pCLEVBQUU7QUFDRixxREFBcUQ7QUFDckQscURBQU0sQ0FBQyx1REFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3ZCLHFEQUFNLENBQUMsdURBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUMzQixNQUFNLFNBQVMsR0FBRyxHQUFHLEVBQUU7SUFDckIsNkVBQWEsQ0FBRSx1REFBUSxDQUFDLFNBQVMsQ0FBc0IsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO0lBQ25FLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxRQUFRO0lBQ3ZDLHVEQUFRLENBQUMsZUFBZSxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxPQUFPO0lBQ2pELHVEQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUM7SUFDN0MsdURBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxLQUFLLEVBQUU7QUFDN0IsQ0FBQztBQUNELHVEQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQztBQUN0RCx1REFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUM7QUFFMUQsa0RBQWtEO0FBQ2xEO0lBQ0UsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLE1BQU07SUFDckMsdURBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztJQUNoRCxVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ2QsdURBQVEsQ0FBQyxlQUFlLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU07SUFDbEQsQ0FBQyxFQUFFLEdBQUcsQ0FBQztBQUNULENBQUM7QUFFRCw0RkFBNEY7QUFDNUYsdURBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtJQUN0RCxJQUFJLEdBQUcsQ0FBQyxLQUFLLEtBQUssRUFBRSxFQUFFLEVBQUUscUJBQXFCO1FBQzNDLFFBQVEsRUFBRTtLQUNYO0FBQ0gsQ0FBQyxDQUFDO0FBRUYsdUVBQXVFO0FBQ3ZFLHVEQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQztBQUV6RCw4RkFBOEY7QUFDOUYsdURBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtJQUN2RCxHQUFHLENBQUMsY0FBYyxFQUFFO0lBQ3BCLE1BQU0sS0FBSyxHQUFJLHVEQUFRLENBQUMsU0FBUyxDQUFzQixDQUFDLEtBQUs7SUFDN0QsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLG1GQUFlLENBQUMsS0FBSyxDQUFDO0lBQ3JELElBQUksR0FBRyxHQUFxQixTQUFTO0lBRXJDLE1BQU0sS0FBSyxHQUFHLENBQUMsRUFBRSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyx3REFBUyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsb0RBQUssRUFBRTtJQUN0RSxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUU7UUFDZixHQUFHLEdBQUcsd0RBQVMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3RDLElBQUksR0FBRyxHQUFHLEtBQUssRUFBRSxFQUFFLHdDQUF3QztZQUN6RCxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDO1NBQ3hDO0tBQ0Y7SUFDRCw4RUFBVSxDQUFDO1FBQ1QsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDbkQsSUFBSSxFQUFFLEtBQUs7UUFDWCxLQUFLO1FBQ0wsS0FBSyxFQUFFLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUk7UUFDdEQsR0FBRztLQUNKLENBQUM7SUFDRiw2RUFBUyxFQUFFO0lBQ1gsUUFBUSxFQUFFO0lBQ1Ysd0RBQU8sQ0FBQyxLQUFLLENBQUM7QUFDaEIsQ0FBQyxDQUFDO0FBRUYsNkVBQWEsQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDO0FBQ3hCLHVEQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtJQUNqRCxPQUFPLDZFQUFhLENBQUUsdURBQVEsQ0FBQyxTQUFTLENBQXNCLENBQUMsS0FBSyxDQUFDO0FBQ3ZFLENBQUMsQ0FBQztBQUVGLDhGQUE4RjtBQUM5RixJQUFJLGVBQWUsSUFBSSxTQUFTLEVBQUU7SUFDaEMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsb0JBQW9CLENBQUM7U0FDbkQsSUFBSSxDQUFDLENBQUMsWUFBWSxFQUFFLEVBQUU7SUFDckIsOEJBQThCO0lBQzlCLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0RBQWtELEVBQUUsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7SUFDbkcseUJBQXlCO0lBQ3pCLE9BQU8sQ0FBQyxHQUFHLENBQUMscUNBQXFDLEVBQUUsR0FBRyxDQUFDLENBQzFEO0NBQ0Y7QUFFRCxzR0FBc0c7QUFDdEcsU0FBUyxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRTtJQUMxRCxPQUFPLENBQUMsR0FBRyxDQUFDLHlDQUF5QyxDQUFDO0lBQ3RELElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7UUFBRSxPQUFPLHdEQUFXLEVBQUU7S0FBRTtBQUN0RCxDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbjRCc0Q7QUFFTjtBQUN1QjtBQUNsQztBQUVqQyw0QkFBNkIsRUFBZTtJQUM5QyxNQUFNLFFBQVEsR0FBRyxzREFBUSxDQUFDLGNBQWMsQ0FBQztJQUN6QyxRQUFRLENBQUMsWUFBWSxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ2xFLENBQUM7QUFFSyx3QkFBeUIsSUFBa0IsRUFBRSxVQUF1QixFQUFFLElBQVUsRUFDdkQsU0FBa0I7SUFDN0MsTUFBTSxLQUFLLEdBQUcsU0FBUyxJQUFJLHNEQUFTLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQztJQUV0RCxNQUFNLEVBQUUsR0FBRyxxREFBTyxDQUFDLEtBQUssRUFBRSxDQUFDLFVBQVUsRUFBRSxnQkFBZ0IsRUFBRSxVQUFVLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxFQUFFO29DQUNyRCxJQUFJOzhCQUNWLFVBQVUsQ0FBQyxLQUFLO2lCQUM3Qiw0REFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzs2QkFDTix3REFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsV0FBVyxVQUFVLENBQUMsRUFBRSxFQUFFLENBQUM7SUFDOUUsRUFBRSxDQUFDLFlBQVksQ0FBQyxZQUFZLEVBQUUsS0FBSyxDQUFDO0lBQ3BDLE1BQU0sRUFBRSxFQUFFLEVBQUUsR0FBRyxVQUFVO0lBQ3pCLElBQUksSUFBSSxLQUFLLFFBQVEsRUFBRTtRQUNuQixFQUFFLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtZQUM5QixNQUFNLFdBQVcsR0FBRyxLQUFLLElBQUksRUFBRTtnQkFDM0IsTUFBTSxFQUFFLEdBQUcsZ0RBQUUsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLHFCQUFxQixFQUFFLEtBQUssQ0FBQyxDQUFnQjtnQkFDbEYsTUFBTSwwREFBWSxDQUFDLENBQUMsRUFBRSxDQUFDLHFCQUFxQixFQUFFLENBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsR0FBRyxDQUFDO2dCQUNwRixFQUFFLENBQUMsS0FBSyxFQUFFO1lBQ2QsQ0FBQztZQUNELElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLEtBQUssR0FBRyxFQUFFO2dCQUNyRCxPQUFPLFdBQVcsRUFBRTthQUNuQjtpQkFBTTtnQkFDRixnREFBRSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMseUJBQXlCLENBQUMsQ0FBaUIsQ0FBQyxLQUFLLEVBQUU7Z0JBQzlFLE9BQU8sVUFBVSxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUM7YUFDdEM7UUFDTCxDQUFDLENBQUM7S0FDTDtJQUVELElBQUksc0VBQWdCLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1FBQ25DLEVBQUUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQztLQUN6QjtJQUNELE9BQU8sRUFBRTtBQUNiLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzFDNEM7QUFDdUI7QUFDbkI7QUFDOEM7QUFDM0M7QUFDSDtBQUN3QjtBQUNjO0FBQ3FCO0FBQ3RFO0FBQ3FEO0FBQ3pEO0FBRWxDLE1BQU0sU0FBUyxHQUF5QztJQUNwRCxvQkFBb0IsRUFBRSxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUM7SUFDOUMseUVBQXlFLEVBQUUsQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDO0lBQ25HLCtCQUErQixFQUFFLENBQUMsa0JBQWtCLEVBQUUsUUFBUSxDQUFDO0lBQy9ELGlCQUFpQixFQUFFLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQztJQUN0QyxZQUFZLEVBQUUsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDO0NBQ3RDO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxnQkFBZ0IsRUFBRSxFQUFDLGNBQWM7QUFFakQsOEJBQThCLEtBQVksRUFBRSxLQUFrQjtJQUMxRCxJQUFJLEtBQUssR0FBRyxDQUFDO0lBQ2IsSUFBSSxPQUFPLEdBQUcsQ0FBQztJQUNmLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtRQUNuQixJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFBRSxLQUFLLEVBQUU7U0FBRTtRQUM5QixJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtZQUFFLE9BQU8sRUFBRTtTQUFFO0lBQ3JDLENBQUMsQ0FBQztJQUNGLGlEQUFFLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLFNBQVMsR0FBRyxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFO0lBQ2hGLGlEQUFFLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLFNBQVMsR0FBRyxPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFO0lBQ3BGLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQztJQUMvQixPQUFPLEtBQUssR0FBRyxDQUFDLElBQUksT0FBTyxHQUFHLENBQUM7QUFDbkMsQ0FBQztBQUVLLHVCQUF3QixLQUF1QjtJQUNqRCxNQUFNLFFBQVEsR0FBRyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ2hELFFBQVEsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUN4RCxPQUFPLEtBQUssUUFBUSxDQUFDLFFBQVEsRUFBRSxJQUFJLFFBQVEsQ0FBQyxPQUFPLEVBQUUsRUFBRTtBQUMzRCxDQUFDO0FBRUQscURBQXFEO0FBQy9DLGtCQUFtQixFQUFVO0lBQy9CLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMseURBQXlELENBQUM7SUFDN0UsSUFBSSxDQUFDLElBQUksSUFBSTtRQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsbUNBQW1DLEVBQUUsRUFBRSxDQUFDO0lBQ3ZFLE9BQU8sQ0FBQztBQUNaLENBQUM7QUFFSyx5QkFBMEIsVUFBdUIsRUFBRSxJQUFzQjtJQUMzRSxNQUFNLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNO0lBQ2hGLElBQUksR0FBRyxJQUFJLElBQUk7UUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLHdCQUF3QixVQUFVLENBQUMsS0FBSyxPQUFPLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUMvRixPQUFPLEdBQUc7QUFDZCxDQUFDO0FBRUssd0JBQXlCLFVBQXVCLEVBQUUsSUFBc0I7SUFDMUUsT0FBTyxRQUFRLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUN0RCxDQUFDO0FBRUssMEJBQTJCLEtBQXVCLEVBQUUsSUFBc0I7SUFDNUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsR0FBRyxLQUFLO0lBRXZDLHVEQUF1RDtJQUN2RCxNQUFNLFNBQVMsR0FBRyxjQUFjLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQztJQUVsRCxNQUFNLE1BQU0sR0FBRyxhQUFhLENBQUMsS0FBSyxDQUFDO0lBRW5DLElBQUksUUFBUSxHQUFHLE9BQU87SUFDdEIsSUFBSSxJQUFJLEdBQUcsSUFBSTtJQUNmLE1BQU0sVUFBVSxHQUFHLHFFQUFhLEVBQUU7SUFDbEMsSUFBSSxVQUFVLElBQUksVUFBVSxDQUFDLEtBQUssSUFBSSxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsRUFBRTtRQUNoRyxJQUFJLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSTtRQUN0RCxRQUFRLEdBQUcsR0FBRztLQUNqQjtJQUVELE1BQU0sQ0FBQyxHQUFHLHNEQUFPLENBQUMsS0FBSyxFQUFFLENBQUMsWUFBWSxFQUFFLFVBQVUsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQ2xELElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxJQUFJLGtDQUFrQyxDQUFDLENBQUMsQ0FBQyxFQUFFO2lEQUNoRCxTQUFTLENBQUMsQ0FBQyxDQUFDOzZCQUNoQyxTQUFTLENBQUMsQ0FBQyxDQUFDOzJCQUNkLFFBQVEsd0JBQXdCLFVBQVUsQ0FBQyxLQUFLOzt1Q0FFcEMsVUFBVSxDQUFDLEdBQUcsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLEdBQUcsTUFBTSxFQUN4RSxVQUFVLENBQUMsRUFBRSxHQUFHLE1BQU0sQ0FBQztJQUV6QyxJQUFJLENBQUUsU0FBUyxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxzRUFBZ0IsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUU7UUFDbkUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDO0tBQzFCO0lBQ0QsQ0FBQyxDQUFDLFlBQVksQ0FBQyxZQUFZLEVBQUUsZUFBZSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUMvRCxNQUFNLEtBQUssR0FBRyxzREFBTyxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sRUFBRSxnQkFBZ0IsQ0FBQyxFQUFFLE9BQU8sQ0FBQztJQUNoRSxLQUFLLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFdBQVcsQ0FBQztJQUM1QyxDQUFDLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQztJQUVwQixnR0FBZ0c7SUFDaEcsSUFBSSxJQUFJLElBQUksSUFBSSxFQUFFO1FBQ2QsaURBQUUsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUU7WUFDdkQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUU7Z0JBQ3BGLEdBQUcsQ0FBQyxjQUFjLEVBQUU7YUFDdkI7UUFDTCxDQUFDLENBQUM7S0FDTDtJQUVELE1BQU0sUUFBUSxHQUFHLHNEQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsVUFBVSxFQUFFLGdCQUFnQixFQUFFLE9BQU8sQ0FBQyxFQUFFLE1BQU0sQ0FBQztJQUM5RSxxREFBTSxDQUFDLFFBQVEsQ0FBQztJQUNoQixNQUFNLEVBQUUsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLEVBQUU7SUFDOUIsUUFBUSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFO1FBQ3pDLElBQUksR0FBRyxDQUFDLEtBQUssS0FBSyxDQUFDLEVBQUUsRUFBRSxjQUFjO1lBQ2pDLElBQUksS0FBSyxHQUFHLElBQUk7WUFDaEIsSUFBSSxTQUFTLElBQUksSUFBSSxFQUFFLEVBQUUsWUFBWTtnQkFDakMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRTtvQkFDOUIsU0FBUyxDQUFDLElBQUksR0FBRyxLQUFLO2lCQUN6QjtxQkFBTTtvQkFDSCxLQUFLLEdBQUcsS0FBSztvQkFDYixTQUFTLENBQUMsSUFBSSxHQUFHLElBQUk7aUJBQ3hCO2dCQUNELDRFQUFTLEVBQUU7YUFDZDtpQkFBTTtnQkFDSCxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFO29CQUM5QixvRUFBYyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUM7aUJBQ2hDO3FCQUFNO29CQUNILEtBQUssR0FBRyxLQUFLO29CQUNiLCtEQUFTLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQztpQkFDM0I7Z0JBQ0QsOERBQVEsRUFBRTthQUNiO1lBQ0QsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsS0FBSyxHQUFHLEVBQUU7Z0JBQ3JELFVBQVUsQ0FBQyxHQUFHLEVBQUU7b0JBQ1osUUFBUSxDQUFDLGdCQUFnQixDQUNyQixxQkFBcUIsRUFBRSxhQUFhLEVBQUUsY0FBYyxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQ3JFLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7d0JBQ2YsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO29CQUNqQyxDQUFDLENBQUM7b0JBQ0YsSUFBSSxLQUFLLEVBQUU7d0JBQ1AsSUFBSSxRQUFRLENBQUMsZ0JBQWdCLENBQUMsaUNBQWlDLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFOzRCQUMzRSxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO3lCQUMzQztxQkFDSjt5QkFBTTt3QkFDSCxJQUFJLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7NEJBQzNFLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUM7eUJBQ3hDO3FCQUNKO29CQUNELHdEQUFNLEVBQUU7Z0JBQ1osQ0FBQyxFQUFFLEdBQUcsQ0FBQzthQUNWO2lCQUFNO2dCQUNILFFBQVEsQ0FBQyxnQkFBZ0IsQ0FDckIscUJBQXFCLEVBQUUsYUFBYSxFQUFFLGNBQWMsRUFBRSxRQUFRLEVBQUUsRUFBRSxDQUNyRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO29CQUNmLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztnQkFDakMsQ0FBQyxDQUFDO2dCQUNGLElBQUksS0FBSyxFQUFFO29CQUNQLElBQUksUUFBUSxDQUFDLGdCQUFnQixDQUFDLGlDQUFpQyxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTt3QkFDM0UsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztxQkFDM0M7aUJBQ0o7cUJBQU07b0JBQ0gsSUFBSSxRQUFRLENBQUMsZ0JBQWdCLENBQUMsaUNBQWlDLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO3dCQUMzRSxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDO3FCQUN4QztpQkFDSjthQUNBO1NBQ0o7SUFDTCxDQUFDLENBQUM7SUFDRixDQUFDLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQztJQUV2QiwrREFBK0Q7SUFDL0QsSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFO1FBQ2QsTUFBTSxPQUFPLEdBQUcsc0RBQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxrQkFBa0IsRUFBRSxPQUFPLENBQUMsRUFBRSxRQUFRLENBQUM7UUFDdkYscURBQU0sQ0FBQyxPQUFPLENBQUM7UUFDZixPQUFPLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUU7WUFDeEMsSUFBSSxHQUFHLENBQUMsS0FBSyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVM7Z0JBQUUsT0FBTTtZQUN6QyxrRkFBZSxDQUFDLFNBQVMsQ0FBQztZQUMxQiw0RUFBUyxFQUFFO1lBQ1gsSUFBSSxRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksRUFBRTtnQkFDekMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLE1BQU07Z0JBQ3JDLE1BQU0sSUFBSSxHQUFHLHVEQUFRLENBQUMsWUFBWSxDQUFDO2dCQUNuQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7Z0JBQy9CLFVBQVUsQ0FBQyxHQUFHLEVBQUU7b0JBQ1osSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTTtnQkFDL0IsQ0FBQyxFQUFFLEdBQUcsQ0FBQzthQUNWO1lBQ0QsQ0FBQyxDQUFDLE1BQU0sRUFBRTtZQUNWLHdEQUFPLENBQUMsS0FBSyxDQUFDO1FBQ2xCLENBQUMsQ0FBQztRQUNGLENBQUMsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDO0tBQ3pCO0lBRUQsc0JBQXNCO0lBQ3RCLE1BQU0sSUFBSSxHQUFHLHNEQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsZ0JBQWdCLEVBQUUsT0FBTyxDQUFDLEVBQUUsTUFBTSxDQUFDO0lBQ2hGLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtRQUNyQyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEtBQUssQ0FBQyxFQUFFO1lBQ2pCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztZQUNoRCxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7WUFDL0IsaURBQUUsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLGlCQUFpQixFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7WUFDdkYsSUFBSSxDQUFDLE1BQU0sRUFBRTtnQkFDUixDQUFDLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBaUIsQ0FBQyxLQUFLLEVBQUU7YUFDcEQ7WUFDRCxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBZ0I7WUFDdEQsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU07U0FDL0M7SUFDTCxDQUFDLENBQUM7SUFDRixxREFBTSxDQUFDLElBQUksQ0FBQztJQUVaLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDO0lBRW5CLE1BQU0sS0FBSyxHQUFHLElBQUksSUFBSSxDQUFDLDBEQUFXLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3JELE1BQU0sR0FBRyxHQUFHLFVBQVUsQ0FBQyxHQUFHLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQywwREFBVyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNqRyxNQUFNLEtBQUssR0FBRyxzREFBTyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQ2hDLFVBQVUsQ0FBQyxLQUFLLEtBQUssVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMseURBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyx5REFBVSxDQUFDLEtBQUssQ0FBQyxZQUFZLHlEQUFVLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztJQUNoSCxDQUFDLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQztJQUNwQixJQUFJLFVBQVUsQ0FBQyxXQUFXLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtRQUNuQyxNQUFNLFdBQVcsR0FBRyxzREFBTyxDQUFDLEtBQUssRUFBRSxhQUFhLENBQUM7UUFDakQsVUFBVSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxVQUFVLEVBQUUsRUFBRTtZQUMxQyxNQUFNLENBQUMsR0FBRyxzREFBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFzQjtZQUM5RCxDQUFDLENBQUMsSUFBSSxHQUFHLDZEQUFnQixDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN4QyxrRUFBcUIsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtnQkFDL0MsSUFBSSxJQUFJO2dCQUNSLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksRUFBRTtvQkFDekIsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNuQyxJQUFJLEdBQUcsc0RBQU8sQ0FBQyxNQUFNLEVBQUUsRUFBRSxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDakQ7cUJBQU07b0JBQ0gsSUFBSSxHQUFHLHNEQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsRUFBRSxtQkFBbUIsQ0FBQztpQkFDbEQ7Z0JBQ0QsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7WUFDdkIsQ0FBQyxDQUFDO1lBQ0YsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7UUFDOUIsQ0FBQyxDQUFDO1FBQ0YsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUM7S0FDN0I7SUFFRCxNQUFNLElBQUksR0FBRyxzREFBTyxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQzlCLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLG1EQUFtRCxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3JGLE1BQU0sS0FBSyxHQUFHLHNEQUFPLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxvRUFBb0UsQ0FBQztJQUMzRyxNQUFNLENBQUMsR0FBRyxpRkFBWSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUM7SUFDckMsSUFBSSxDQUFDLElBQUksSUFBSSxFQUFFO1FBQ1gsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUMzQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDO1FBQzNCLElBQUksQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUUsRUFBRSxrQkFBa0I7WUFDcEMsb0JBQW9CLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQztZQUM5QixJQUFJLENBQUMsU0FBUyxHQUFHLENBQUM7U0FDckI7S0FDSjtJQUVELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtRQUNuQyxJQUFJLFNBQVMsSUFBSSxJQUFJLEVBQUU7WUFDbkIsU0FBUyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUztZQUMvQiw0RUFBUyxFQUFFO1NBQ2Q7YUFBTTtZQUNILGdGQUFXLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1lBQzNDLGlGQUFZLEVBQUU7WUFDZCxNQUFNLENBQUMsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQztZQUN4RCxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDO1lBQzNCLElBQUksb0JBQW9CLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxFQUFFO2dCQUNoQyxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUM7YUFDbEM7aUJBQU07Z0JBQ0gsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDO2FBQ3JDO1NBQ0o7UUFDRCxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEdBQUc7WUFBRSx3REFBTSxFQUFFO0lBQ2pFLENBQUMsQ0FBQztJQUVGLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDO0lBRW5CLE1BQU0sT0FBTyxHQUFHLHNEQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsU0FBUyxDQUFDLEVBQUUseUJBQXlCLENBQUM7SUFDdEYsT0FBTyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7UUFDbkMsdUZBQWtCLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQztRQUNqQyxpRkFBWSxFQUFFO1FBQ2QsSUFBSSxDQUFDLFNBQVMsR0FBRyxVQUFVLENBQUMsSUFBSTtRQUNoQyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7UUFDbEMsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsS0FBSyxHQUFHO1lBQUcsd0RBQU0sRUFBRTtJQUNsRSxDQUFDLENBQUM7SUFDRixLQUFLLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQztJQUMxQixDQUFDLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQztJQUVwQixNQUFNLElBQUksR0FBRyxzREFBTyxDQUFDLEtBQUssRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3JDLHdFQUFjLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtRQUMzQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUU7WUFDdEQsTUFBTSxFQUFFLEdBQUcsc0RBQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxlQUFlLEVBQUUsZ0JBQWdCLEVBQUUsVUFBVSxDQUFDLFFBQVEsQ0FBQyxFQUMvRDtrREFDdUIseURBQVUsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzsyRkFDZSxFQUNoRSxLQUFLLFVBQVUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUN4QyxNQUFNLENBQUMsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLElBQUksQ0FBQztZQUNuRCxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDO1lBQzNCLG9CQUFvQixDQUFDLENBQUMsRUFBRSxFQUFFLENBQUM7WUFFM0IsSUFBSSxVQUFVLENBQUMsS0FBSztnQkFBRSxFQUFFLENBQUMsWUFBWSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNuRixFQUFFLENBQUMsV0FBVyxDQUFDLHNEQUFPLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEUsRUFBRSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7Z0JBQzlCLEVBQUUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztnQkFDN0IsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsS0FBSyxHQUFHO29CQUFFLHdEQUFNLEVBQUU7WUFDakUsQ0FBQyxDQUFDO1lBQ0YsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUM7U0FDbkI7SUFDTCxDQUFDLENBQUM7SUFDRixDQUFDLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQztJQUVuQixJQUFJLGtEQUFRLENBQUMsY0FBYyxLQUFLLFVBQVUsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDakUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDO0tBQ2pDO0lBQ0QsSUFBSSxrREFBUSxDQUFDLGNBQWMsS0FBSyxVQUFVLElBQUksQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQzdELENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQztLQUNqQztJQUNELENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDO0lBQzNDLElBQUksS0FBSyxDQUFDLEdBQUcsS0FBSyxTQUFTO1FBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDO0lBRTFFLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsR0FBRyxJQUFJLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUMvRCxJQUFJLEtBQUssQ0FBQyxVQUFVLENBQUMsR0FBRyxLQUFLLFNBQVMsRUFBRTtRQUNwQyxJQUFJLEVBQUUsSUFBSSxDQUFDLG9EQUFLLEVBQUUsR0FBRyxxRUFBaUIsRUFBRSxDQUFDLEVBQUU7WUFDdkMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDO1NBQzlCO0tBQ0o7U0FBTTtRQUNILE1BQU0sT0FBTyxHQUFHLElBQUksSUFBSSxFQUFFO1FBQzFCLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxHQUFHLHFFQUFpQixFQUFFLENBQUM7UUFDeEQsTUFBTSxJQUFJLEdBQUcsQ0FBQyxVQUFVLENBQUMsUUFBUSxLQUFLLE1BQU0sSUFBSSxVQUFVLENBQUMsS0FBSyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxrREFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqRyxNQUFNLFFBQVEsR0FBRyxxRUFBaUIsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsNkRBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLElBQUksR0FBRyxJQUFJO1FBQ3JGLElBQUksMERBQVcsQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksT0FBTztZQUNqQyxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUssU0FBUyxJQUFJLE9BQU8sQ0FBQyxPQUFPLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxHQUFHLFFBQVEsQ0FBQyxFQUFFO1lBQ2xGLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQztTQUM5QjtLQUNKO0lBRUQsMEJBQTBCO0lBQzFCLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxJQUFJLENBQUMsa0RBQVEsQ0FBQyxRQUFRLEVBQUU7UUFDckMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFO1lBQ2hDLElBQUksQ0FBQyxRQUFRLENBQUMsc0JBQXNCLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQztnQkFDdEQsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRTtnQkFDbkQsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO2dCQUMxQixDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUM7Z0JBQ3pCLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLHFCQUFxQixFQUFFLENBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUztzQkFDeEQsd0RBQVMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLElBQUk7Z0JBQ3ZELENBQUMsQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO2dCQUN2QyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsUUFBUTtnQkFDdkMsTUFBTSxJQUFJLEdBQUcsdURBQVEsQ0FBQyxZQUFZLENBQUM7Z0JBQ25DLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQztnQkFDNUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsT0FBTztnQkFDNUIsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDO2dCQUN2QiwwREFBVyxDQUFDLENBQUMsQ0FBQztnQkFDZCxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUM7Z0JBQ3ZCLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxHQUFHLHdEQUFTLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLElBQUk7Z0JBQ3hELFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxHQUFHLENBQUM7YUFDcEQ7UUFDTCxDQUFDLENBQUM7S0FDTDtJQUVELE9BQU8sQ0FBQztBQUNaLENBQUM7QUFFRCxnR0FBZ0c7QUFDaEcsOEZBQThGO0FBQzlGLHFGQUFxRjtBQUMvRSxlQUFnQixFQUFlO0lBQ2pDLElBQUksQ0FBQyxHQUFHLENBQUM7SUFDVCxJQUFJLENBQUMsR0FBRyxDQUFDO0lBRVQsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO1FBQ2hELElBQUksRUFBRSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQ2hDLENBQUMsR0FBRyxDQUFDO1NBQ1I7UUFDRCxJQUFJLEVBQUUsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRTtZQUNoQyxDQUFDLEdBQUcsQ0FBQztTQUNSO0lBQ0wsQ0FBQyxDQUFDO0lBQ0YsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQztBQUM3QixDQUFDO0FBRUQsc0VBQXNFO0FBQ2hFLHFCQUFzQixHQUFVO0lBQ2xDLEdBQUcsQ0FBQyxlQUFlLEVBQUU7SUFDckIsTUFBTSxFQUFFLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQXFCO0lBQzlELElBQUksRUFBRSxJQUFJLElBQUk7UUFBRSxPQUFNO0lBRXRCLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDO0lBQzFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQztJQUN4QixFQUFFLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDM0IsRUFBRSxDQUFDLFNBQVMsR0FBRyxDQUFDO0lBQ2hCLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxNQUFNO0lBQ3JDLE1BQU0sSUFBSSxHQUFHLHVEQUFRLENBQUMsWUFBWSxDQUFDO0lBQ25DLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztJQUMvQixVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ1osSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTTtRQUMzQixFQUFFLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDM0IsRUFBRSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQzdCLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLE1BQU07UUFDckIsMERBQVcsQ0FBQyxFQUFFLENBQUM7UUFDZixFQUFFLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUM7SUFDNUIsQ0FBQyxFQUFFLElBQUksQ0FBQztBQUNaLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7QUNoWW1EO0FBRXBELGlHQUFpRztBQUNqRyxxRkFBcUY7QUFDckYsNkNBQTZDO0FBQzdDLEVBQUU7QUFDRixvR0FBb0c7QUFDcEcsb0dBQW9HO0FBQ3BHLDBFQUEwRTtBQUUxRSw4QkFBOEI7QUFDOUIsTUFBTSxLQUFLLEdBQUcsT0FBTztBQUNyQixNQUFNLEtBQUssR0FBRyxPQUFPO0FBQ3JCLE1BQU0sS0FBSyxHQUFHLE9BQU87QUFFckIsdUJBQXVCO0FBQ3ZCLE1BQU0sS0FBSyxHQUFHLFFBQVE7QUFDdEIsTUFBTSxLQUFLLEdBQUcsS0FBSztBQUVuQixNQUFNLENBQUMsR0FBRztJQUNOLENBQUMsTUFBTSxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsTUFBTSxDQUFDO0lBQzFCLENBQUMsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFHLE1BQU0sQ0FBQztJQUMxQixDQUFDLE1BQU0sRUFBRSxDQUFDLE1BQU0sRUFBRyxNQUFNLENBQUM7Q0FDN0I7QUFFRCxNQUFNLElBQUksR0FBRyxDQUFDLENBQVMsRUFBRSxFQUFFO0lBQ3ZCLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxFQUFFO1FBQzVCLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQ3BCO1NBQU07UUFDUCxPQUFPLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsS0FBSztLQUM5QjtBQUNMLENBQUM7QUFDRCxNQUFNLFVBQVUsR0FBRyxDQUFDLENBQVcsRUFBRSxDQUFXLEVBQUUsRUFBRTtJQUM1QyxJQUFJLEdBQUcsR0FBRyxDQUFDO0lBQ1gsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNmLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN0QixDQUFDLENBQUM7SUFDRixPQUFPLEdBQUc7QUFDZCxDQUFDO0FBQ0QsTUFBTSxVQUFVLEdBQUcsQ0FBQyxDQUFTLEVBQUUsRUFBRTtJQUM3QixNQUFNLENBQUMsR0FBRyxLQUFLO0lBQ2YsSUFBSSxDQUFDLElBQUksU0FBUyxFQUFFO1FBQ2hCLE9BQU8sS0FBSyxHQUFHLENBQUM7S0FDbkI7U0FBTTtRQUNILE9BQU8sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsS0FBSztLQUNoRDtBQUNMLENBQUM7QUFFRCxnQkFBZ0IsQ0FBUyxFQUFFLENBQVMsRUFBRSxDQUFTO0lBQzNDLE1BQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEdBQUc7SUFDM0IsTUFBTSxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztJQUM3QixNQUFNLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxJQUFJO0lBQzdCLE1BQU0sRUFBRSxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQzdCLE1BQU0sRUFBRSxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQzdCLE1BQU0sRUFBRSxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBRTdCLE1BQU0sS0FBSyxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7SUFFMUIsTUFBTSxFQUFFLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDOUMsTUFBTSxFQUFFLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDOUMsTUFBTSxFQUFFLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFFOUMscUJBQXFCO0lBQ3JCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBUyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFF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RUFBRSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ2hFLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLElBQUksRUFBRSxDQUFDLENBQUM7WUFDckMsVUFBVSxDQUFDLEdBQUcsRUFBRTtnQkFDWCxJQUFvQixDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsR0FBRztnQkFDekMsVUFBVSxDQUFDLEdBQUcsRUFBRTtvQkFDWixJQUFJLENBQUMsTUFBTSxFQUFFO2dCQUNqQixDQUFDLEVBQUUsR0FBRyxDQUFDO1lBQ1gsQ0FBQyxFQUFFLEtBQUssQ0FBQztRQUNiLENBQUMsQ0FBQztJQUNOLENBQUMsQ0FBQztBQUNOLENBQUM7QUFFSyxtQkFBb0IsR0FBZ0I7SUFDdEMsSUFBSSxDQUFDLEdBQUc7UUFBRSxPQUFPLENBQUM7SUFDbEIsT0FBTyxRQUFRLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQztBQUM1QixDQUFDIiwiZmlsZSI6ImFwcC1idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvY2xpZW50LnRzXCIpO1xuIiwiaW1wb3J0IHsgZWxlbUJ5SWQsIGVsZW1lbnQsIGxvY2FsU3RvcmFnZVJlYWQsIGxvY2FsU3RvcmFnZVdyaXRlLCBzZW5kIH0gZnJvbSAnLi91dGlsJ1xyXG5cclxuZXhwb3J0IGNvbnN0IFZFUlNJT04gPSAnMi4yNC4zJ1xyXG5cclxuY29uc3QgVkVSU0lPTl9VUkwgPSAnaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tLzE5UnlhbkEvQ2hlY2tQQ1IvbWFzdGVyL3ZlcnNpb24udHh0J1xyXG5jb25zdCBDT01NSVRfVVJMID0gKGxvY2F0aW9uLnByb3RvY29sID09PSAnY2hyb21lLWV4dGVuc2lvbjonID9cclxuICAgICdodHRwczovL2FwaS5naXRodWIuY29tL3JlcG9zLzE5UnlhbkEvQ2hlY2tQQ1IvZ2l0L3JlZnMvaGVhZHMvbWFzdGVyJyA6ICcvYXBpL2NvbW1pdCcpXHJcbmNvbnN0IE5FV1NfVVJMID0gJ2h0dHBzOi8vYXBpLmdpdGh1Yi5jb20vZ2lzdHMvMjFiZjExYTQyOWRhMjU3NTM5YTY4NTIwZjUxM2EzOGInXHJcblxyXG5mdW5jdGlvbiBmb3JtYXRDb21taXRNZXNzYWdlKG1lc3NhZ2U6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gbWVzc2FnZS5zdWJzdHIobWVzc2FnZS5pbmRleE9mKCdcXG5cXG4nKSArIDIpXHJcbiAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXCogKC4qPykoPz0kfFxcbikvZywgKGEsIGIpID0+IGA8bGk+JHtifTwvbGk+YClcclxuICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLz5cXG48L2csICc+PCcpXHJcbiAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXG4vZywgJzxicj4nKVxyXG59XHJcblxyXG4vLyBGb3IgdXBkYXRpbmcsIGEgcmVxdWVzdCB3aWxsIGJlIHNlbmQgdG8gR2l0aHViIHRvIGdldCB0aGUgY3VycmVudCBjb21taXQgaWQgYW5kIGNoZWNrIHRoYXQgYWdhaW5zdCB3aGF0J3Mgc3RvcmVkXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjaGVja0NvbW1pdCgpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcmVzcCA9IGF3YWl0IHNlbmQoVkVSU0lPTl9VUkwsICd0ZXh0JylcclxuICAgICAgICBjb25zdCBjID0gcmVzcC5yZXNwb25zZVRleHQudHJpbSgpXHJcbiAgICAgICAgY29uc29sZS5sb2coYEN1cnJlbnQgdmVyc2lvbjogJHtjfSAke1ZFUlNJT04gPT09IGMgPyAnKG5vIHVwZGF0ZSBhdmFpbGFibGUpJyA6ICcodXBkYXRlIGF2YWlsYWJsZSknfWApXHJcbiAgICAgICAgZWxlbUJ5SWQoJ25ld3ZlcnNpb24nKS5pbm5lckhUTUwgPSBjXHJcbiAgICAgICAgaWYgKFZFUlNJT04gIT09IGMpIHtcclxuICAgICAgICAgICAgZWxlbUJ5SWQoJ3VwZGF0ZUlnbm9yZScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGxvY2F0aW9uLnByb3RvY29sID09PSAnY2hyb21lLWV4dGVuc2lvbjonKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbUJ5SWQoJ3VwZGF0ZScpLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1CeUlkKCd1cGRhdGVCYWNrZ3JvdW5kJykuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0sIDM1MClcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3AyID0gYXdhaXQgc2VuZChDT01NSVRfVVJMLCAnanNvbicpXHJcbiAgICAgICAgICAgIGNvbnN0IHsgc2hhLCB1cmwgfSA9IHJlc3AyLnJlc3BvbnNlLm9iamVjdFxyXG4gICAgICAgICAgICBjb25zdCByZXNwMyA9IGF3YWl0IHNlbmQoKGxvY2F0aW9uLnByb3RvY29sID09PSAnY2hyb21lLWV4dGVuc2lvbjonID8gdXJsIDogYC9hcGkvY29tbWl0LyR7c2hhfWApLCAnanNvbicpXHJcbiAgICAgICAgICAgIGVsZW1CeUlkKCdwYXN0VXBkYXRlVmVyc2lvbicpLmlubmVySFRNTCA9IFZFUlNJT05cclxuICAgICAgICAgICAgZWxlbUJ5SWQoJ25ld1VwZGF0ZVZlcnNpb24nKS5pbm5lckhUTUwgPSBjXHJcbiAgICAgICAgICAgIGVsZW1CeUlkKCd1cGRhdGVGZWF0dXJlcycpLmlubmVySFRNTCA9IGZvcm1hdENvbW1pdE1lc3NhZ2UocmVzcDMucmVzcG9uc2UubWVzc2FnZSlcclxuICAgICAgICAgICAgZWxlbUJ5SWQoJ3VwZGF0ZUJhY2tncm91bmQnKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xyXG4gICAgICAgICAgICBlbGVtQnlJZCgndXBkYXRlJykuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuICAgICAgICB9XHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnQ291bGQgbm90IGFjY2VzcyBHaXRodWIuIEhlcmVcXCdzIHRoZSBlcnJvcjonLCBlcnIpXHJcbiAgICB9XHJcbn1cclxuXHJcbmxldCBuZXdzVXJsOiBzdHJpbmd8bnVsbCA9IG51bGxcclxubGV0IG5ld3NDb21taXQ6IHN0cmluZ3xudWxsID0gbnVsbFxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZldGNoTmV3cygpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcmVzcCA9IGF3YWl0IHNlbmQoTkVXU19VUkwsICdqc29uJylcclxuICAgICAgICBsZXQgbGFzdCA9IGxvY2FsU3RvcmFnZVJlYWQoJ25ld3NDb21taXQnKVxyXG4gICAgICAgIG5ld3NDb21taXQgPSByZXNwLnJlc3BvbnNlLmhpc3RvcnlbMF0udmVyc2lvblxyXG5cclxuICAgICAgICBpZiAobGFzdCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGxhc3QgPSBuZXdzQ29tbWl0XHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZVdyaXRlKCduZXdzQ29tbWl0JywgbmV3c0NvbW1pdClcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG5ld3NVcmwgPSByZXNwLnJlc3BvbnNlLmZpbGVzWyd1cGRhdGVzLmh0bSddLnJhd191cmxcclxuXHJcbiAgICAgICAgaWYgKGxhc3QgIT09IG5ld3NDb21taXQpIHtcclxuICAgICAgICAgICAgZ2V0TmV3cygpXHJcbiAgICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ0NvdWxkIG5vdCBhY2Nlc3MgR2l0aHViLiBIZXJlXFwncyB0aGUgZXJyb3I6JywgZXJyKVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0TmV3cyhvbmZhaWw/OiAoKSA9PiB2b2lkKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICBpZiAoIW5ld3NVcmwpIHtcclxuICAgICAgICBpZiAob25mYWlsKSBvbmZhaWwoKVxyXG4gICAgICAgIHJldHVyblxyXG4gICAgfVxyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCByZXNwID0gYXdhaXQgc2VuZChuZXdzVXJsKVxyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5uZXdzQ29tbWl0ID0gbmV3c0NvbW1pdFxyXG4gICAgICAgIHJlc3AucmVzcG9uc2VUZXh0LnNwbGl0KCc8aHI+JykuZm9yRWFjaCgobmV3cykgPT4ge1xyXG4gICAgICAgICAgICBlbGVtQnlJZCgnbmV3c0NvbnRlbnQnKS5hcHBlbmRDaGlsZChlbGVtZW50KCdkaXYnLCAnbmV3c0l0ZW0nLCBuZXdzKSlcclxuICAgICAgICB9KVxyXG4gICAgICAgIGVsZW1CeUlkKCduZXdzQmFja2dyb3VuZCcpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXHJcbiAgICAgICAgZWxlbUJ5SWQoJ25ld3MnKS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG4gICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ0NvdWxkIG5vdCBhY2Nlc3MgR2l0aHViLiBIZXJlXFwncyB0aGUgZXJyb3I6JywgZXJyKVxyXG4gICAgICAgIGlmIChvbmZhaWwpIG9uZmFpbCgpXHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgY2hlY2tDb21taXQsIGZldGNoTmV3cywgZ2V0TmV3cywgVkVSU0lPTiB9IGZyb20gJy4vYXBwJ1xyXG5pbXBvcnQgeyBjbG9zZU9wZW5lZCB9IGZyb20gJy4vY29tcG9uZW50cy9hc3NpZ25tZW50J1xyXG5pbXBvcnQgeyB1cGRhdGVBdmF0YXIgfSBmcm9tICcuL2NvbXBvbmVudHMvYXZhdGFyJ1xyXG5pbXBvcnQgeyB1cGRhdGVOZXdUaXBzIH0gZnJvbSAnLi9jb21wb25lbnRzL2N1c3RvbUFkZGVyJ1xyXG5pbXBvcnQgeyBnZXRSZXNpemVBc3NpZ25tZW50cywgcmVzaXplLCByZXNpemVDYWxsZXIgfSBmcm9tICcuL2NvbXBvbmVudHMvcmVzaXplcidcclxuaW1wb3J0IHsgdG9EYXRlTnVtLCB0b2RheSB9IGZyb20gJy4vZGF0ZXMnXHJcbmltcG9ydCB7IGRpc3BsYXksIGZvcm1hdFVwZGF0ZSwgZ2V0U2Nyb2xsIH0gZnJvbSAnLi9kaXNwbGF5J1xyXG5pbXBvcnQge1xyXG4gICAgZGVjcmVtZW50TGlzdERhdGVPZmZzZXQsXHJcbiAgICBnZXRMaXN0RGF0ZU9mZnNldCxcclxuICAgIGluY3JlbWVudExpc3REYXRlT2Zmc2V0LFxyXG4gICAgc2V0TGlzdERhdGVPZmZzZXQsXHJcbiAgICB6ZXJvTGlzdERhdGVPZmZzZXRcclxufSBmcm9tICcuL25hdmlnYXRpb24nXHJcbmltcG9ydCB7IGRvbG9naW4sIGZldGNoLCBnZXRDbGFzc2VzLCBnZXREYXRhLCBsb2dvdXQsIHNldERhdGEsIHN3aXRjaFZpZXdzIH0gZnJvbSAnLi9wY3InXHJcbmltcG9ydCB7IGFkZEFjdGl2aXR5LCByZWNlbnRBY3Rpdml0eSB9IGZyb20gJy4vcGx1Z2lucy9hY3Rpdml0eSdcclxuaW1wb3J0IHsgdXBkYXRlQXRoZW5hRGF0YSB9IGZyb20gJy4vcGx1Z2lucy9hdGhlbmEnXHJcbmltcG9ydCB7IGFkZFRvRXh0cmEsIHBhcnNlQ3VzdG9tVGFzaywgc2F2ZUV4dHJhIH0gZnJvbSAnLi9wbHVnaW5zL2N1c3RvbUFzc2lnbm1lbnRzJ1xyXG5pbXBvcnQgeyBnZXRTZXR0aW5nLCBzZXRTZXR0aW5nLCBzZXR0aW5ncyB9IGZyb20gJy4vc2V0dGluZ3MnXHJcbmltcG9ydCB7XHJcbiAgICBfJCxcclxuICAgIF8kaCxcclxuICAgIGRhdGVTdHJpbmcsXHJcbiAgICBlbGVtQnlJZCxcclxuICAgIGVsZW1lbnQsXHJcbiAgICBmb3JjZUxheW91dCxcclxuICAgIGxvY2FsU3RvcmFnZVJlYWQsXHJcbiAgICBsb2NhbFN0b3JhZ2VXcml0ZSxcclxuICAgIHJlcXVlc3RJZGxlQ2FsbGJhY2ssXHJcbiAgICByaXBwbGVcclxufSBmcm9tICcuL3V0aWwnXHJcblxyXG5pZiAobG9jYWxTdG9yYWdlUmVhZCgnZGF0YScpICE9IG51bGwpIHtcclxuICAgIHNldERhdGEobG9jYWxTdG9yYWdlUmVhZCgnZGF0YScpKVxyXG59XHJcblxyXG4vLyBBZGRpdGlvbmFsbHksIGlmIGl0J3MgdGhlIHVzZXIncyBmaXJzdCB0aW1lLCB0aGUgcGFnZSBpcyBzZXQgdG8gdGhlIHdlbGNvbWUgcGFnZS5cclxuaWYgKCFsb2NhbFN0b3JhZ2VSZWFkKCdub1dlbGNvbWUnKSkge1xyXG4gICAgbG9jYWxTdG9yYWdlV3JpdGUoJ25vV2VsY29tZScsIHRydWUpXHJcbiAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICd3ZWxjb21lLmh0bWwnXHJcbn1cclxuXHJcbmNvbnN0IE5BVl9FTEVNRU5UID0gXyQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbmF2JykpXHJcbmNvbnN0IElOUFVUX0VMRU1FTlRTID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcclxuICAgICdpbnB1dFt0eXBlPXRleHRdOm5vdCgjbmV3VGV4dCk6bm90KFtyZWFkb25seV0pLCBpbnB1dFt0eXBlPXBhc3N3b3JkXSwgaW5wdXRbdHlwZT1lbWFpbF0sICcgK1xyXG4gICAgJ2lucHV0W3R5cGU9dXJsXSwgaW5wdXRbdHlwZT10ZWxdLCBpbnB1dFt0eXBlPW51bWJlcl06bm90KC5jb250cm9sKSwgaW5wdXRbdHlwZT1zZWFyY2hdJ1xyXG4pIGFzIE5vZGVMaXN0T2Y8SFRNTElucHV0RWxlbWVudD5cclxuXHJcbi8vICMjIyMgU2VuZCBmdW5jdGlvblxyXG4vL1xyXG5cclxuLy8gVGhpcyBmdW5jdGlvbiBkaXNwbGF5cyBhIHNuYWNrYmFyIHRvIHRlbGwgdGhlIHVzZXIgc29tZXRoaW5nXHJcblxyXG4vLyA8YSBuYW1lPVwicmV0XCIvPlxyXG4vLyBSZXRyaWV2aW5nIGRhdGFcclxuLy8gLS0tLS0tLS0tLS0tLS0tXHJcbi8vXHJcbmVsZW1CeUlkKCdsb2dpbicpLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIChldnQpID0+IHtcclxuICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICBkb2xvZ2luKG51bGwsIHRydWUpXHJcbn0pXHJcblxyXG4vLyBUaGUgdmlldyBzd2l0Y2hpbmcgYnV0dG9uIG5lZWRzIGFuIGV2ZW50IGhhbmRsZXIuXHJcbmVsZW1CeUlkKCdzd2l0Y2hWaWV3cycpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgc3dpdGNoVmlld3MpXHJcblxyXG4vLyBUaGUgc2FtZSBnb2VzIGZvciB0aGUgbG9nIG91dCBidXR0b24uXHJcbmVsZW1CeUlkKCdsb2dvdXQnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGxvZ291dClcclxuXHJcbi8vIE5vdyB3ZSBhc3NpZ24gaXQgdG8gY2xpY2tpbmcgdGhlIGJhY2tncm91bmQuXHJcbmVsZW1CeUlkKCdiYWNrZ3JvdW5kJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbG9zZU9wZW5lZClcclxuXHJcbi8vIFRoZW4sIHRoZSB0YWJzIGFyZSBtYWRlIGludGVyYWN0aXZlLlxyXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcjbmF2VGFicz5saScpLmZvckVhY2goKHRhYiwgdGFiSW5kZXgpID0+IHtcclxuICB0YWIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZ0KSA9PiB7XHJcbiAgICBpZiAoIXNldHRpbmdzLnZpZXdUcmFucykge1xyXG4gICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ25vVHJhbnMnKVxyXG4gICAgICBmb3JjZUxheW91dChkb2N1bWVudC5ib2R5KVxyXG4gICAgfVxyXG4gICAgbG9jYWxTdG9yYWdlV3JpdGUoJ3ZpZXcnLCB0YWJJbmRleClcclxuICAgIGRvY3VtZW50LmJvZHkuc2V0QXR0cmlidXRlKCdkYXRhLXZpZXcnLCBTdHJpbmcodGFiSW5kZXgpKVxyXG4gICAgaWYgKHRhYkluZGV4ID09PSAxKSB7XHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJlc2l6ZUNhbGxlcilcclxuICAgICAgICBpZiAoc2V0dGluZ3Mudmlld1RyYW5zKSB7XHJcbiAgICAgICAgICAgIGxldCBzdGFydDogbnVtYmVyfG51bGwgPSBudWxsXHJcbiAgICAgICAgICAgIC8vIFRoZSBjb2RlIGJlbG93IGlzIHRoZSBzYW1lIGNvZGUgdXNlZCBpbiB0aGUgcmVzaXplKCkgZnVuY3Rpb24uIEl0IGJhc2ljYWxseSBqdXN0XHJcbiAgICAgICAgICAgIC8vIHBvc2l0aW9ucyB0aGUgYXNzaWdubWVudHMgY29ycmVjdGx5IGFzIHRoZXkgYW5pbWF0ZVxyXG4gICAgICAgICAgICBjb25zdCB3aWR0aHMgPSBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5jb250YWlucygnc2hvd0luZm8nKSA/XHJcbiAgICAgICAgICAgICAgICBbNjUwLCAxMTAwLCAxODAwLCAyNzAwLCAzODAwLCA1MTAwXSA6IFszNTAsIDgwMCwgMTUwMCwgMjQwMCwgMzUwMCwgNDgwMF1cclxuICAgICAgICAgICAgbGV0IGNvbHVtbnMgPSAxXHJcbiAgICAgICAgICAgIHdpZHRocy5mb3JFYWNoKCh3LCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHdpbmRvdy5pbm5lcldpZHRoID4gdykgeyBjb2x1bW5zID0gaW5kZXggKyAxIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgY29uc3QgYXNzaWdubWVudHMgPSBnZXRSZXNpemVBc3NpZ25tZW50cygpXHJcbiAgICAgICAgICAgIGNvbnN0IGNvbHVtbkhlaWdodHMgPSBBcnJheS5mcm9tKG5ldyBBcnJheShjb2x1bW5zKSwgKCkgPT4gMClcclxuICAgICAgICAgICAgY29uc3Qgc3RlcCA9ICh0aW1lc3RhbXA6IG51bWJlcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFjb2x1bW5zKSB0aHJvdyBuZXcgRXJyb3IoJ0NvbHVtbnMgbnVtYmVyIG5vdCBmb3VuZCcpXHJcbiAgICAgICAgICAgICAgICBpZiAoc3RhcnQgPT0gbnVsbCkgeyBzdGFydCA9IHRpbWVzdGFtcCB9XHJcbiAgICAgICAgICAgICAgICBhc3NpZ25tZW50cy5mb3JFYWNoKChhc3NpZ25tZW50LCBuKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY29sID0gbiAlIGNvbHVtbnNcclxuICAgICAgICAgICAgICAgICAgICBpZiAobiA8IGNvbHVtbnMpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb2x1bW5IZWlnaHRzW2NvbF0gPSAwXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGFzc2lnbm1lbnQuc3R5bGUudG9wID0gY29sdW1uSGVpZ2h0c1tjb2xdICsgJ3B4J1xyXG4gICAgICAgICAgICAgICAgICAgIGFzc2lnbm1lbnQuc3R5bGUubGVmdCA9ICgoMTAwIC8gY29sdW1ucykgKiBjb2wpICsgJyUnXHJcbiAgICAgICAgICAgICAgICAgICAgYXNzaWdubWVudC5zdHlsZS5yaWdodCA9ICgoMTAwIC8gY29sdW1ucykgKiAoY29sdW1ucyAtIGNvbCAtIDEpKSArICclJ1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbHVtbkhlaWdodHNbY29sXSArPSBhc3NpZ25tZW50Lm9mZnNldEhlaWdodCArIDI0XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgaWYgKCh0aW1lc3RhbXAgLSBzdGFydCkgPCAzNTApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShzdGVwKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RlcClcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWNvbHVtbnMpIHRocm93IG5ldyBFcnJvcignQ29sdW1ucyBudW1iZXIgbm90IGZvdW5kJylcclxuICAgICAgICAgICAgICAgIGFzc2lnbm1lbnRzLmZvckVhY2goKGFzc2lnbm1lbnQsIG4pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjb2wgPSBuICUgY29sdW1uc1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChuIDwgY29sdW1ucykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbHVtbkhlaWdodHNbY29sXSA9IDBcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYXNzaWdubWVudC5zdHlsZS50b3AgPSBjb2x1bW5IZWlnaHRzW2NvbF0gKyAncHgnXHJcbiAgICAgICAgICAgICAgICAgICAgY29sdW1uSGVpZ2h0c1tjb2xdICs9IGFzc2lnbm1lbnQub2Zmc2V0SGVpZ2h0ICsgMjRcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0sIDM1MClcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXNpemUoKVxyXG4gICAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgd2luZG93LnNjcm9sbFRvKDAsIGdldFNjcm9sbCgpKVxyXG4gICAgICAgIE5BVl9FTEVNRU5ULmNsYXNzTGlzdC5hZGQoJ2hlYWRyb29tLS1sb2NrZWQnKVxyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICBOQVZfRUxFTUVOVC5jbGFzc0xpc3QucmVtb3ZlKCdoZWFkcm9vbS0tdW5waW5uZWQnKVxyXG4gICAgICAgICAgICBOQVZfRUxFTUVOVC5jbGFzc0xpc3QucmVtb3ZlKCdoZWFkcm9vbS0tbG9ja2VkJylcclxuICAgICAgICAgICAgTkFWX0VMRU1FTlQuY2xhc3NMaXN0LmFkZCgnaGVhZHJvb20tLXBpbm5lZCcpXHJcbiAgICAgICAgICAgIHJlcXVlc3RJZGxlQ2FsbGJhY2soKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgemVyb0xpc3REYXRlT2Zmc2V0KClcclxuICAgICAgICAgICAgICAgIHVwZGF0ZUxpc3ROYXYoKVxyXG4gICAgICAgICAgICAgICAgZGlzcGxheSgpXHJcbiAgICAgICAgICAgIH0sIHt0aW1lb3V0OiAyMDAwfSlcclxuICAgICAgICB9LCAzNTApXHJcbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJlc2l6ZUNhbGxlcilcclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYXNzaWdubWVudCcpLmZvckVhY2goKGFzc2lnbm1lbnQpID0+IHtcclxuICAgICAgICAgICAgKGFzc2lnbm1lbnQgYXMgSFRNTEVsZW1lbnQpLnN0eWxlLnRvcCA9ICdhdXRvJ1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbiAgICBpZiAoIXNldHRpbmdzLnZpZXdUcmFucykge1xyXG4gICAgICBmb3JjZUxheW91dChkb2N1bWVudC5ib2R5KVxyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnbm9UcmFucycpXHJcbiAgICAgIH0sIDM1MClcclxuICAgIH1cclxuICB9KVxyXG59KVxyXG5cclxuLy8gQW5kIHRoZSBpbmZvIHRhYnMgKGp1c3QgYSBsaXR0bGUgbGVzcyBjb2RlKVxyXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcjaW5mb1RhYnM+bGknKS5mb3JFYWNoKCh0YWIsIHRhYkluZGV4KSA9PiB7XHJcbiAgICB0YWIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZ0KSA9PiB7XHJcbiAgICAgICAgZWxlbUJ5SWQoJ2luZm8nKS5zZXRBdHRyaWJ1dGUoJ2RhdGEtdmlldycsIFN0cmluZyh0YWJJbmRleCkpXHJcbiAgICB9KVxyXG59KVxyXG5cclxuLy8gVGhlIHZpZXcgaXMgc2V0IHRvIHdoYXQgaXQgd2FzIGxhc3QuXHJcbmlmIChsb2NhbFN0b3JhZ2VSZWFkKCd2aWV3JykgIT0gbnVsbCkge1xyXG4gIGRvY3VtZW50LmJvZHkuc2V0QXR0cmlidXRlKCdkYXRhLXZpZXcnLCBsb2NhbFN0b3JhZ2VSZWFkKCd2aWV3JykpXHJcbiAgaWYgKGxvY2FsU3RvcmFnZVJlYWQoJ3ZpZXcnKSA9PT0gJzEnKSB7XHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgcmVzaXplQ2FsbGVyKVxyXG4gIH1cclxufVxyXG5cclxuLy8gQWRkaXRpb25hbGx5LCB0aGUgYWN0aXZlIGNsYXNzIG5lZWRzIHRvIGJlIGFkZGVkIHdoZW4gaW5wdXRzIGFyZSBzZWxlY3RlZCAoZm9yIHRoZSBsb2dpbiBib3gpLlxyXG5JTlBVVF9FTEVNRU5UUy5mb3JFYWNoKChpbnB1dCkgPT4ge1xyXG4gICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGV2dCkgPT4ge1xyXG4gICAgICAgIF8kaChfJGgoaW5wdXQucGFyZW50Tm9kZSkucXVlcnlTZWxlY3RvcignbGFiZWwnKSkuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuICAgIH0pXHJcbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsIChldnQpID0+IHtcclxuICAgICAgICBfJGgoXyRoKGlucHV0LnBhcmVudE5vZGUpLnF1ZXJ5U2VsZWN0b3IoJ2xhYmVsJykpLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcbiAgICB9KVxyXG4gICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIChldnQpID0+IHtcclxuICAgICAgICBpZiAoaW5wdXQudmFsdWUubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIF8kaChfJGgoaW5wdXQucGFyZW50Tm9kZSkucXVlcnlTZWxlY3RvcignbGFiZWwnKSkuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59KVxyXG5cclxuLy8gV2hlbiB0aGUgZXNjYXBlIGtleSBpcyBwcmVzc2VkLCB0aGUgY3VycmVudCBhc3NpZ25tZW50IHNob3VsZCBiZSBjbG9zZWQuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGV2dCkgPT4ge1xyXG4gIGlmIChldnQud2hpY2ggPT09IDI3KSB7IC8vIEVzY2FwZSBrZXkgcHJlc3NlZFxyXG4gICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2Z1bGwnKS5sZW5ndGggIT09IDApIHsgcmV0dXJuIGNsb3NlT3BlbmVkKG5ldyBFdmVudCgnR2VuZXJhdGVkIEV2ZW50JykpIH1cclxuICB9XHJcbn0pO1xyXG5cclxuLy8gSWYgaXQncyB3aW50ZXIgdGltZSwgYSBjbGFzcyBpcyBhZGRlZCB0byB0aGUgYm9keSBlbGVtZW50LlxyXG4oKCkgPT4ge1xyXG4gICAgY29uc3QgdG9kYXlEYXRlID0gbmV3IERhdGUoKVxyXG4gICAgaWYgKG5ldyBEYXRlKHRvZGF5RGF0ZS5nZXRGdWxsWWVhcigpLCAxMCwgMjcpIDw9IHRvZGF5RGF0ZSAmJlxyXG4gICAgICAgIHRvZGF5RGF0ZSA8PSBuZXcgRGF0ZSh0b2RheURhdGUuZ2V0RnVsbFllYXIoKSwgMTEsIDMyKSkge1xyXG4gICAgICAgIHJldHVybiBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ3dpbnRlcicpXHJcbiAgICB9XHJcbn0pKClcclxuXHJcbi8vIEZvciB0aGUgbmF2YmFyIHRvZ2dsZSBidXR0b25zLCBhIGZ1bmN0aW9uIHRvIHRvZ2dsZSB0aGUgYWN0aW9uIGlzIGRlZmluZWQgdG8gZWxpbWluYXRlIGNvZGUuXHJcbmZ1bmN0aW9uIG5hdlRvZ2dsZShlbGVtOiBzdHJpbmcsIGxzOiBzdHJpbmcsIGY/OiAoKSA9PiB2b2lkKTogdm9pZCB7XHJcbiAgICByaXBwbGUoZWxlbUJ5SWQoZWxlbSkpXHJcbiAgICBlbGVtQnlJZChlbGVtKS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgKCkgPT4ge1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnRvZ2dsZShscylcclxuICAgICAgICByZXNpemUoKVxyXG4gICAgICAgIGxvY2FsU3RvcmFnZVdyaXRlKGxzLCBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5jb250YWlucyhscykpXHJcbiAgICAgICAgaWYgKGYgIT0gbnVsbCkgZigpXHJcbiAgICB9KVxyXG4gICAgaWYgKGxvY2FsU3RvcmFnZVJlYWQobHMpKSBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQobHMpXHJcbn1cclxuXHJcbi8vIFRoZSBidXR0b24gdG8gc2hvdy9oaWRlIGNvbXBsZXRlZCBhc3NpZ25tZW50cyBpbiBsaXN0IHZpZXcgYWxzbyBuZWVkcyBldmVudCBsaXN0ZW5lcnMuXHJcbm5hdlRvZ2dsZSgnY3ZCdXR0b24nLCAnc2hvd0RvbmUnLCAoKSA9PiBzZXRUaW1lb3V0KHJlc2l6ZSwgMTAwMCkpXHJcblxyXG4vLyBUaGUgc2FtZSBnb2VzIGZvciB0aGUgYnV0dG9uIHRoYXQgc2hvd3MgdXBjb21pbmcgdGVzdHMuXHJcbmlmIChsb2NhbFN0b3JhZ2Uuc2hvd0luZm8gPT0gbnVsbCkgeyBsb2NhbFN0b3JhZ2Uuc2hvd0luZm8gPSBKU09OLnN0cmluZ2lmeSh0cnVlKSB9XHJcbm5hdlRvZ2dsZSgnaW5mb0J1dHRvbicsICdzaG93SW5mbycpXHJcblxyXG4vLyBUaGlzIGFsc28gZ2V0cyByZXBlYXRlZCBmb3IgdGhlIHRoZW1lIHRvZ2dsaW5nLlxyXG5uYXZUb2dnbGUoJ2xpZ2h0QnV0dG9uJywgJ2RhcmsnKVxyXG5cclxuLy8gRm9yIGVhc2Ugb2YgYW5pbWF0aW9ucywgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSBwcm9taXNlIGlzIGRlZmluZWQuXHJcbmZ1bmN0aW9uIGFuaW1hdGVFbChlbDogSFRNTEVsZW1lbnQsIGtleWZyYW1lczogQW5pbWF0aW9uS2V5RnJhbWVbXSwgb3B0aW9uczogQW5pbWF0aW9uT3B0aW9ucyk6XHJcbiAgICBQcm9taXNlPEFuaW1hdGlvblBsYXliYWNrRXZlbnQ+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgY29uc3QgcGxheWVyID0gZWwuYW5pbWF0ZShrZXlmcmFtZXMsIG9wdGlvbnMpXHJcbiAgICAgICAgcGxheWVyLm9uZmluaXNoID0gKGUpID0+IHJlc29sdmUoZSlcclxuICAgIH0pXHJcbn1cclxuXHJcbi8vIEluIG9yZGVyIHRvIG1ha2UgdGhlIHByZXZpb3VzIGRhdGUgLyBuZXh0IGRhdGUgYnV0dG9ucyBkbyBzb21ldGhpbmcsIHRoZXkgbmVlZCBldmVudCBsaXN0ZW5lcnMuXHJcbmVsZW1CeUlkKCdsaXN0bmV4dCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gIGNvbnN0IHBkID0gZWxlbUJ5SWQoJ2xpc3RwcmV2ZGF0ZScpXHJcbiAgY29uc3QgdGQgPSBlbGVtQnlJZCgnbGlzdG5vd2RhdGUnKVxyXG4gIGNvbnN0IG5kID0gZWxlbUJ5SWQoJ2xpc3RuZXh0ZGF0ZScpXHJcbiAgaW5jcmVtZW50TGlzdERhdGVPZmZzZXQoKVxyXG4gIGRpc3BsYXkoKVxyXG4gIG5kLnN0eWxlLmRpc3BsYXkgPSAnaW5saW5lLWJsb2NrJ1xyXG4gIHJldHVybiBQcm9taXNlLnJhY2UoW1xyXG4gICAgYW5pbWF0ZUVsKHRkLCBbXHJcbiAgICAgIHt0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKDAlKScsIG9wYWNpdHk6IDF9LFxyXG4gICAgICB7b3BhY2l0eTogMH0sXHJcbiAgICAgIHt0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKC0xMDAlKScsIG9wYWNpdHk6IDB9XHJcbiAgICBdLCB7ZHVyYXRpb246IDMwMCwgZWFzaW5nOiAnZWFzZS1vdXQnfSksXHJcbiAgICBhbmltYXRlRWwobmQsIFtcclxuICAgICAge3RyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoMCUpJywgb3BhY2l0eTogMH0sXHJcbiAgICAgIHtvcGFjaXR5OiAwfSxcclxuICAgICAge3RyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoLTEwMCUpJywgb3BhY2l0eTogMX1cclxuICAgIF0sIHtkdXJhdGlvbjogMzAwLCBlYXNpbmc6ICdlYXNlLW91dCd9KVxyXG4gIF0pLnRoZW4oKCkgPT4ge1xyXG4gICAgcGQuaW5uZXJIVE1MID0gdGQuaW5uZXJIVE1MXHJcbiAgICB0ZC5pbm5lckhUTUwgPSBuZC5pbm5lckhUTUxcclxuICAgIGNvbnN0IGxpc3REYXRlMiA9IG5ldyBEYXRlKClcclxuICAgIGxpc3REYXRlMi5zZXREYXRlKGxpc3REYXRlMi5nZXREYXRlKCkgKyAxICsgZ2V0TGlzdERhdGVPZmZzZXQoKSlcclxuICAgIG5kLmlubmVySFRNTCA9IGRhdGVTdHJpbmcobGlzdERhdGUyKS5yZXBsYWNlKCdUb2RheScsICdOb3cnKVxyXG4gICAgcmV0dXJuIG5kLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcclxuICB9KVxyXG59KVxyXG5cclxuLy8gVGhlIGV2ZW50IGxpc3RlbmVyIGZvciB0aGUgcHJldmlvdXMgZGF0ZSBidXR0b24gaXMgbW9zdGx5IHRoZSBzYW1lLlxyXG5lbGVtQnlJZCgnbGlzdGJlZm9yZScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gIGNvbnN0IHBkID0gZWxlbUJ5SWQoJ2xpc3RwcmV2ZGF0ZScpXHJcbiAgY29uc3QgdGQgPSBlbGVtQnlJZCgnbGlzdG5vd2RhdGUnKVxyXG4gIGNvbnN0IG5kID0gZWxlbUJ5SWQoJ2xpc3RuZXh0ZGF0ZScpXHJcbiAgZGVjcmVtZW50TGlzdERhdGVPZmZzZXQoKVxyXG4gIGRpc3BsYXkoKVxyXG4gIHBkLnN0eWxlLmRpc3BsYXkgPSAnaW5saW5lLWJsb2NrJ1xyXG4gIHJldHVybiBQcm9taXNlLnJhY2UoW1xyXG4gICAgYW5pbWF0ZUVsKHRkLCBbXHJcbiAgICAgIHt0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKC0xMDAlKScsIG9wYWNpdHk6IDF9LFxyXG4gICAgICB7b3BhY2l0eTogMH0sXHJcbiAgICAgIHt0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKDAlKScsIG9wYWNpdHk6IDB9XHJcbiAgICBdLCB7ZHVyYXRpb246IDMwMCwgZWFzaW5nOiAnZWFzZS1vdXQnfSksXHJcbiAgICBhbmltYXRlRWwocGQsIFtcclxuICAgICAge3RyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoLTEwMCUpJywgb3BhY2l0eTogMH0sXHJcbiAgICAgIHtvcGFjaXR5OiAwfSxcclxuICAgICAge3RyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoMCUpJywgb3BhY2l0eTogMX1cclxuICAgIF0sIHtkdXJhdGlvbjogMzAwLCBlYXNpbmc6ICdlYXNlLW91dCd9KVxyXG4gIF0pLnRoZW4oKCkgPT4ge1xyXG4gICAgbmQuaW5uZXJIVE1MID0gdGQuaW5uZXJIVE1MXHJcbiAgICB0ZC5pbm5lckhUTUwgPSBwZC5pbm5lckhUTUxcclxuICAgIGNvbnN0IGxpc3REYXRlMiA9IG5ldyBEYXRlKClcclxuICAgIGxpc3REYXRlMi5zZXREYXRlKChsaXN0RGF0ZTIuZ2V0RGF0ZSgpICsgZ2V0TGlzdERhdGVPZmZzZXQoKSkgLSAxKVxyXG4gICAgcGQuaW5uZXJIVE1MID0gZGF0ZVN0cmluZyhsaXN0RGF0ZTIpLnJlcGxhY2UoJ1RvZGF5JywgJ05vdycpXHJcbiAgICByZXR1cm4gcGQuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xyXG4gIH0pXHJcbn0pXHJcblxyXG4vLyBXaGVuZXZlciBhIGRhdGUgaXMgZG91YmxlIGNsaWNrZWQsIGxvbmcgdGFwcGVkLCBvciBmb3JjZSB0b3VjaGVkLCBsaXN0IHZpZXcgZm9yIHRoYXQgZGF5IGlzIGRpc3BsYXllZC5cclxuZnVuY3Rpb24gdXBkYXRlTGlzdE5hdigpOiB2b2lkIHtcclxuICAgIGNvbnN0IGQgPSBuZXcgRGF0ZSgpXHJcbiAgICBkLnNldERhdGUoKGQuZ2V0RGF0ZSgpICsgZ2V0TGlzdERhdGVPZmZzZXQoKSkgLSAxKVxyXG4gICAgY29uc3QgdXAgPSAoaWQ6IHN0cmluZykgPT4ge1xyXG4gICAgICAgIGVsZW1CeUlkKGlkKS5pbm5lckhUTUwgPSBkYXRlU3RyaW5nKGQpLnJlcGxhY2UoJ1RvZGF5JywgJ05vdycpXHJcbiAgICAgICAgcmV0dXJuIGQuc2V0RGF0ZShkLmdldERhdGUoKSArIDEpXHJcbiAgICB9XHJcbiAgICB1cCgnbGlzdHByZXZkYXRlJylcclxuICAgIHVwKCdsaXN0bm93ZGF0ZScpXHJcbiAgICB1cCgnbGlzdG5leHRkYXRlJylcclxufVxyXG5cclxuZnVuY3Rpb24gc3dpdGNoVG9MaXN0KGV2dDogRXZlbnQpOiB2b2lkIHtcclxuICAgIGlmIChfJGgoZXZ0LnRhcmdldCkuY2xhc3NMaXN0LmNvbnRhaW5zKCdtb250aCcpIHx8IF8kaChldnQudGFyZ2V0KS5jbGFzc0xpc3QuY29udGFpbnMoJ2RhdGUnKSkge1xyXG4gICAgICAgIHNldExpc3REYXRlT2Zmc2V0KHRvRGF0ZU51bShOdW1iZXIoXyRoKF8kaChldnQudGFyZ2V0KS5wYXJlbnROb2RlKS5nZXRBdHRyaWJ1dGUoJ2RhdGEtZGF0ZScpKSkgLSB0b2RheSgpKVxyXG4gICAgICAgIHVwZGF0ZUxpc3ROYXYoKVxyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuc2V0QXR0cmlidXRlKCdkYXRhLXZpZXcnLCAnMScpXHJcbiAgICAgICAgcmV0dXJuIGRpc3BsYXkoKVxyXG4gICAgfVxyXG59XHJcblxyXG5kb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2RibGNsaWNrJywgc3dpdGNoVG9MaXN0KVxyXG5kb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ3dlYmtpdG1vdXNlZm9yY2V1cCcsIHN3aXRjaFRvTGlzdCk7XHJcbigoKSA9PiB7XHJcbiAgICBsZXQgdGFwdGltZXI6IG51bWJlcnxudWxsID0gbnVsbFxyXG4gICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgKGV2dCkgPT4gdGFwdGltZXIgPSBzZXRUaW1lb3V0KCgoKSA9PiBzd2l0Y2hUb0xpc3QoZXZ0KSksIDEwMDApKVxyXG4gICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIChldnQpID0+IHtcclxuICAgICAgICBpZiAodGFwdGltZXIpIGNsZWFyVGltZW91dCh0YXB0aW1lcilcclxuICAgICAgICB0YXB0aW1lciA9IG51bGxcclxuICAgIH0pXHJcbn0pKClcclxuXHJcbi8vIDxhIG5hbWU9XCJzaWRlXCIvPlxyXG4vLyBTaWRlIG1lbnUgYW5kIE5hdmJhclxyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4vL1xyXG4vLyBUaGUgW0hlYWRyb29tIGxpYnJhcnldKGh0dHBzOi8vZ2l0aHViLmNvbS9XaWNreU5pbGxpYW1zL2hlYWRyb29tLmpzKSBpcyB1c2VkIHRvIHNob3cgdGhlIG5hdmJhciB3aGVuIHNjcm9sbGluZyB1cFxyXG5jb25zdCBoZWFkcm9vbSA9IG5ldyBIZWFkcm9vbShfJChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCduYXYnKSksIHtcclxuICB0b2xlcmFuY2U6IDEwLFxyXG4gIG9mZnNldDogNjZcclxufSlcclxuaGVhZHJvb20uaW5pdCgpXHJcblxyXG4vLyBBbHNvLCB0aGUgc2lkZSBtZW51IG5lZWRzIGV2ZW50IGxpc3RlbmVycy5cclxuZWxlbUJ5SWQoJ2NvbGxhcHNlQnV0dG9uJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nXHJcbiAgZWxlbUJ5SWQoJ3NpZGVOYXYnKS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG4gIHJldHVybiBlbGVtQnlJZCgnc2lkZUJhY2tncm91bmQnKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xyXG59KVxyXG5cclxuZWxlbUJ5SWQoJ3NpZGVCYWNrZ3JvdW5kJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgZWxlbUJ5SWQoJ3NpZGVCYWNrZ3JvdW5kJykuc3R5bGUub3BhY2l0eSA9ICcwJ1xyXG4gIGVsZW1CeUlkKCdzaWRlTmF2JykuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcclxuICBlbGVtQnlJZCgnZHJhZ1RhcmdldCcpLnN0eWxlLndpZHRoID0gJydcclxuICByZXR1cm4gc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2F1dG8nXHJcbiAgICBlbGVtQnlJZCgnc2lkZUJhY2tncm91bmQnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXHJcbiAgfVxyXG4gICwgMzUwKVxyXG59KVxyXG5cclxudXBkYXRlQXZhdGFyKClcclxuXHJcbi8vIDxhIG5hbWU9XCJhdGhlbmFcIi8+IEF0aGVuYSAoU2Nob29sb2d5KVxyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS1cclxuLy9cclxuXHJcbi8vIDxhIG5hbWU9XCJzZXR0aW5nc1wiLz4gU2V0dGluZ3NcclxuLy8gLS0tLS0tLS1cclxuLy9cclxuLy8gVGhlIGNvZGUgYmVsb3cgdXBkYXRlcyB0aGUgY3VycmVudCB2ZXJzaW9uIHRleHQgaW4gdGhlIHNldHRpbmdzLiBJIHNob3VsZCd2ZSBwdXQgdGhpcyB1bmRlciB0aGVcclxuLy8gVXBkYXRlcyBzZWN0aW9uLCBidXQgaXQgc2hvdWxkIGdvIGJlZm9yZSB0aGUgZGlzcGxheSgpIGZ1bmN0aW9uIGZvcmNlcyBhIHJlZmxvdy5cclxuZWxlbUJ5SWQoJ3ZlcnNpb24nKS5pbm5lckhUTUwgPSBWRVJTSU9OXHJcblxyXG4vLyBUbyBicmluZyB1cCB0aGUgc2V0dGluZ3Mgd2luZG93cywgYW4gZXZlbnQgbGlzdGVuZXIgbmVlZHMgdG8gYmUgYWRkZWQgdG8gdGhlIGJ1dHRvbi5cclxuZWxlbUJ5SWQoJ3NldHRpbmdzQicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgZWxlbUJ5SWQoJ3NpZGVCYWNrZ3JvdW5kJykuY2xpY2soKVxyXG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdzZXR0aW5nc1Nob3duJylcclxuICAgIGVsZW1CeUlkKCdicmFuZCcpLmlubmVySFRNTCA9ICdTZXR0aW5ncydcclxuICAgIHJldHVybiBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBfJGgoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbWFpbicpKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXHJcbiAgICB9KVxyXG59KVxyXG5cclxuLy8gVGhlIGJhY2sgYnV0dG9uIGFsc28gbmVlZHMgdG8gY2xvc2UgdGhlIHNldHRpbmdzIHdpbmRvdy5cclxuZWxlbUJ5SWQoJ2JhY2tCdXR0b24nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgIF8kaChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdtYWluJykpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXHJcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ3NldHRpbmdzU2hvd24nKVxyXG4gICAgcmV0dXJuIGVsZW1CeUlkKCdicmFuZCcpLmlubmVySFRNTCA9ICdDaGVjayBQQ1InXHJcbn0pXHJcblxyXG4vLyBUaGUgY29kZSBiZWxvdyBpcyB3aGF0IHRoZSBzZXR0aW5ncyBjb250cm9sLlxyXG5pZiAoc2V0dGluZ3Muc2VwVGFza3MpIHtcclxuICAgIGVsZW1CeUlkKCdpbmZvJykuY2xhc3NMaXN0LmFkZCgnaXNUYXNrcycpXHJcbiAgICBlbGVtQnlJZCgnbmV3Jykuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xyXG59XHJcbmlmIChzZXR0aW5ncy5ob2xpZGF5VGhlbWVzKSB7IGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnaG9saWRheVRoZW1lcycpIH1cclxuaWYgKHNldHRpbmdzLnNlcFRhc2tDbGFzcykgeyBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ3NlcFRhc2tDbGFzcycpIH1cclxuaW50ZXJmYWNlIElDb2xvck1hcCB7IFtjbHM6IHN0cmluZ106IHN0cmluZyB9XHJcbmxldCBhc3NpZ25tZW50Q29sb3JzOiBJQ29sb3JNYXAgPSBsb2NhbFN0b3JhZ2VSZWFkKCdhc3NpZ25tZW50Q29sb3JzJywge1xyXG4gICAgY2xhc3N3b3JrOiAnIzY4OWYzOCcsIGhvbWV3b3JrOiAnIzIxOTZmMycsIGxvbmd0ZXJtOiAnI2Y1N2MwMCcsIHRlc3Q6ICcjZjQ0MzM2J1xyXG59KVxyXG5sZXQgY2xhc3NDb2xvcnMgPSBsb2NhbFN0b3JhZ2VSZWFkKCdjbGFzc0NvbG9ycycsICgpID0+IHtcclxuICAgIGNvbnN0IGNjOiBJQ29sb3JNYXAgPSB7fVxyXG4gICAgY29uc3QgZGF0YSA9IGdldERhdGEoKVxyXG4gICAgaWYgKCFkYXRhKSByZXR1cm4gY2NcclxuICAgIGRhdGEuY2xhc3Nlcy5mb3JFYWNoKChjOiBzdHJpbmcpID0+IHtcclxuICAgICAgICBjY1tjXSA9ICcjNjE2MTYxJ1xyXG4gICAgfSlcclxuICAgIHJldHVybiBjY1xyXG59KVxyXG5lbGVtQnlJZChgJHtzZXR0aW5ncy5jb2xvclR5cGV9Q29sb3JzYCkuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgKCkgPT4ge1xyXG4gIGlmIChzZXR0aW5ncy5yZWZyZXNoT25Gb2N1cykgZmV0Y2goKVxyXG59KVxyXG5mdW5jdGlvbiBpbnRlcnZhbFJlZnJlc2goKTogdm9pZCB7XHJcbiAgICBjb25zdCByID0gc2V0dGluZ3MucmVmcmVzaFJhdGVcclxuICAgIGlmIChyID4gMCkge1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmRlYnVnKCdSZWZyZXNoaW5nIGJlY2F1c2Ugb2YgdGltZXInKVxyXG4gICAgICAgICAgICBmZXRjaCgpXHJcbiAgICAgICAgICAgIGludGVydmFsUmVmcmVzaCgpXHJcbiAgICAgICAgfSwgciAqIDYwICogMTAwMClcclxuICAgIH1cclxufVxyXG5pbnRlcnZhbFJlZnJlc2goKVxyXG5cclxuLy8gRm9yIGNob29zaW5nIGNvbG9ycywgdGhlIGNvbG9yIGNob29zaW5nIGJveGVzIG5lZWQgdG8gYmUgaW5pdGlhbGl6ZWQuXHJcbmNvbnN0IHBhbGV0dGU6IElDb2xvck1hcCA9IHtcclxuICAnI2Y0NDMzNic6ICcjQjcxQzFDJyxcclxuICAnI2U5MWU2Myc6ICcjODgwRTRGJyxcclxuICAnIzljMjdiMCc6ICcjNEExNDhDJyxcclxuICAnIzY3M2FiNyc6ICcjMzExQjkyJyxcclxuICAnIzNmNTFiNSc6ICcjMUEyMzdFJyxcclxuICAnIzIxOTZmMyc6ICcjMEQ0N0ExJyxcclxuICAnIzAzYTlmNCc6ICcjMDE1NzlCJyxcclxuICAnIzAwYmNkNCc6ICcjMDA2MDY0JyxcclxuICAnIzAwOTY4OCc6ICcjMDA0RDQwJyxcclxuICAnIzRjYWY1MCc6ICcjMUI1RTIwJyxcclxuICAnIzY4OWYzOCc6ICcjMzM2OTFFJyxcclxuICAnI2FmYjQyYic6ICcjODI3NzE3JyxcclxuICAnI2ZiYzAyZCc6ICcjRjU3RjE3JyxcclxuICAnI2ZmYTAwMCc6ICcjRkY2RjAwJyxcclxuICAnI2Y1N2MwMCc6ICcjRTY1MTAwJyxcclxuICAnI2ZmNTcyMic6ICcjQkYzNjBDJyxcclxuICAnIzc5NTU0OCc6ICcjM0UyNzIzJyxcclxuICAnIzYxNjE2MSc6ICcjMjEyMTIxJ1xyXG59XHJcblxyXG5nZXRDbGFzc2VzKCkuZm9yRWFjaCgoYzogc3RyaW5nKSA9PiB7XHJcbiAgICBjb25zdCBkID0gZWxlbWVudCgnZGl2JywgW10sIGMpXHJcbiAgICBkLnNldEF0dHJpYnV0ZSgnZGF0YS1jb250cm9sJywgYylcclxuICAgIGQuYXBwZW5kQ2hpbGQoZWxlbWVudCgnc3BhbicsIFtdKSlcclxuICAgIGVsZW1CeUlkKCdjbGFzc0NvbG9ycycpLmFwcGVuZENoaWxkKGQpXHJcbn0pXHJcbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jb2xvcnMnKS5mb3JFYWNoKChlKSA9PiB7XHJcbiAgICBlLnF1ZXJ5U2VsZWN0b3JBbGwoJ2RpdicpLmZvckVhY2goKGNvbG9yKSA9PiB7XHJcbiAgICAgICAgY29uc3QgY29udHJvbGxlZENvbG9yID0gY29sb3IuZ2V0QXR0cmlidXRlKCdkYXRhLWNvbnRyb2wnKVxyXG4gICAgICAgIGlmICghY29udHJvbGxlZENvbG9yKSB0aHJvdyBuZXcgRXJyb3IoJ0VsZW1lbnQgaGFzIG5vIGNvbnRyb2xsZWQgY29sb3InKVxyXG5cclxuICAgICAgICBjb25zdCBzcCA9IF8kaChjb2xvci5xdWVyeVNlbGVjdG9yKCdzcGFuJykpXHJcbiAgICAgICAgY29uc3QgbGlzdE5hbWUgPSBlLmdldEF0dHJpYnV0ZSgnaWQnKSA9PT0gJ2NsYXNzQ29sb3JzJyA/ICdjbGFzc0NvbG9ycycgOiAnYXNzaWdubWVudENvbG9ycydcclxuICAgICAgICBjb25zdCBsaXN0U2V0dGVyID0gKHY6IElDb2xvck1hcCkgPT4ge1xyXG4gICAgICAgICAgICBlLmdldEF0dHJpYnV0ZSgnaWQnKSA9PT0gJ2NsYXNzQ29sb3JzJyA/IGNsYXNzQ29sb3JzID0gdiA6IGFzc2lnbm1lbnRDb2xvcnMgPSB2XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGxpc3QgPSBlLmdldEF0dHJpYnV0ZSgnaWQnKSA9PT0gJ2NsYXNzQ29sb3JzJyA/IGNsYXNzQ29sb3JzIDogYXNzaWdubWVudENvbG9yc1xyXG4gICAgICAgIHNwLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGxpc3RbY29udHJvbGxlZENvbG9yXVxyXG4gICAgICAgIE9iamVjdC5rZXlzKHBhbGV0dGUpLmZvckVhY2goKHApID0+IHtcclxuICAgICAgICAgICAgY29uc3QgcGUgPSBlbGVtZW50KCdzcGFuJywgW10pXHJcbiAgICAgICAgICAgIHBlLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHBcclxuICAgICAgICAgICAgaWYgKHAgPT09IGxpc3RbY29udHJvbGxlZENvbG9yXSkge1xyXG4gICAgICAgICAgICAgICAgcGUuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNwLmFwcGVuZENoaWxkKHBlKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgY29uc3QgY3VzdG9tID0gZWxlbWVudCgnc3BhbicsIFsnY3VzdG9tQ29sb3InXSwgYDxhPkN1c3RvbTwvYT4gXFxcclxuICAgIDxpbnB1dCB0eXBlPSd0ZXh0JyBwbGFjZWhvbGRlcj0nV2FzICR7bGlzdFtjb250cm9sbGVkQ29sb3JdfScgLz4gXFxcclxuICAgIDxzcGFuIGNsYXNzPSdjdXN0b21JbmZvJz5Vc2UgYW55IENTUyB2YWxpZCBjb2xvciBuYW1lLCBzdWNoIGFzIFxcXHJcbiAgICA8Y29kZT4jRjQ0MzM2PC9jb2RlPiBvciA8Y29kZT5yZ2IoNjQsIDQzLCAyKTwvY29kZT4gb3IgPGNvZGU+Y3lhbjwvY29kZT48L3NwYW4+IFxcXHJcbiAgICA8YSBjbGFzcz0nY3VzdG9tT2snPlNldDwvYT5gKVxyXG4gICAgICAgIGN1c3RvbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldnQpID0+IGV2dC5zdG9wUHJvcGFnYXRpb24oKSlcclxuICAgICAgICBfJChjdXN0b20ucXVlcnlTZWxlY3RvcignYScpKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldnQpID0+IHtcclxuICAgICAgICAgICAgc3AuY2xhc3NMaXN0LnRvZ2dsZSgnb25DdXN0b20nKVxyXG4gICAgICAgICAgICBldnQuc3RvcFByb3BhZ2F0aW9uKClcclxuICAgICAgICB9KVxyXG4gICAgICAgIHNwLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2dCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoc3AuY2xhc3NMaXN0LmNvbnRhaW5zKCdjaG9vc2UnKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gXyRoKGV2dC50YXJnZXQpXHJcbiAgICAgICAgICAgICAgICBjb25zdCBiZyA9IHRpbnljb2xvcih0YXJnZXQuc3R5bGUuYmFja2dyb3VuZENvbG9yIHx8ICcjMDAwJykudG9IZXhTdHJpbmcoKVxyXG4gICAgICAgICAgICAgICAgbGlzdFtjb250cm9sbGVkQ29sb3JdID0gYmdcclxuICAgICAgICAgICAgICAgIHNwLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGJnXHJcbiAgICAgICAgICAgICAgICBjb25zdCBzZWxlY3RlZCA9IHRhcmdldC5xdWVyeVNlbGVjdG9yKCcuc2VsZWN0ZWQnKVxyXG4gICAgICAgICAgICAgICAgaWYgKHNlbGVjdGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWQuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJylcclxuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZVtsaXN0TmFtZV0gPSBKU09OLnN0cmluZ2lmeShsaXN0KVxyXG4gICAgICAgICAgICAgICAgbGlzdFNldHRlcihsaXN0KVxyXG4gICAgICAgICAgICAgICAgdXBkYXRlQ29sb3JzKClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzcC5jbGFzc0xpc3QudG9nZ2xlKCdjaG9vc2UnKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgXyQoY3VzdG9tLnF1ZXJ5U2VsZWN0b3IoJy5jdXN0b21PaycpKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldnQpID0+IHtcclxuICAgICAgICAgICAgc3AuY2xhc3NMaXN0LnJlbW92ZSgnb25DdXN0b20nKVxyXG4gICAgICAgICAgICBzcC5jbGFzc0xpc3QudG9nZ2xlKCdjaG9vc2UnKVxyXG4gICAgICAgICAgICBjb25zdCBzZWxlY3RlZEVsID0gc3AucXVlcnlTZWxlY3RvcignLnNlbGVjdGVkJylcclxuICAgICAgICAgICAgaWYgKHNlbGVjdGVkRWwgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRFbC5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc3Auc3R5bGUuYmFja2dyb3VuZENvbG9yID0gKGxpc3RbY29udHJvbGxlZENvbG9yXSA9IF8kKGN1c3RvbS5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpKS52YWx1ZSlcclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlW2xpc3ROYW1lXSA9IEpTT04uc3RyaW5naWZ5KGxpc3QpXHJcbiAgICAgICAgICAgIHVwZGF0ZUNvbG9ycygpXHJcbiAgICAgICAgICAgIHJldHVybiBldnQuc3RvcFByb3BhZ2F0aW9uKClcclxuICAgICAgICB9KVxyXG4gICAgfSlcclxufSlcclxuXHJcbi8vIFRoZW4sIGEgZnVuY3Rpb24gdGhhdCB1cGRhdGVzIHRoZSBjb2xvciBwcmVmZXJlbmNlcyBpcyBkZWZpbmVkLlxyXG5mdW5jdGlvbiB1cGRhdGVDb2xvcnMoKTogdm9pZCB7XHJcbiAgICBjb25zdCBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJylcclxuICAgIHN0eWxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKSlcclxuICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpXHJcbiAgICBjb25zdCBzaGVldCA9IF8kKHN0eWxlLnNoZWV0KSBhcyBDU1NTdHlsZVNoZWV0XHJcblxyXG4gICAgY29uc3QgYWRkQ29sb3JSdWxlID0gKHNlbGVjdG9yOiBzdHJpbmcsIGxpZ2h0OiBzdHJpbmcsIGRhcms6IHN0cmluZywgZXh0cmEgPSAnJykgPT4ge1xyXG4gICAgICAgIGNvbnN0IG1peGVkID0gdGlueWNvbG9yLm1peChsaWdodCwgJyMxQjVFMjAnLCA3MCkudG9IZXhTdHJpbmcoKVxyXG4gICAgICAgIHNoZWV0Lmluc2VydFJ1bGUoYCR7ZXh0cmF9LmFzc2lnbm1lbnQke3NlbGVjdG9yfSB7IGJhY2tncm91bmQtY29sb3I6ICR7bGlnaHR9OyB9YCwgMClcclxuICAgICAgICBzaGVldC5pbnNlcnRSdWxlKGAke2V4dHJhfS5hc3NpZ25tZW50JHtzZWxlY3Rvcn0uZG9uZSB7IGJhY2tncm91bmQtY29sb3I6ICR7ZGFya307IH1gLCAwKVxyXG4gICAgICAgIHNoZWV0Lmluc2VydFJ1bGUoYCR7ZXh0cmF9LmFzc2lnbm1lbnQke3NlbGVjdG9yfTo6YmVmb3JlIHsgYmFja2dyb3VuZC1jb2xvcjogJHttaXhlZH07IH1gLCAwKVxyXG4gICAgICAgIHNoZWV0Lmluc2VydFJ1bGUoYCR7ZXh0cmF9LmFzc2lnbm1lbnRJdGVtJHtzZWxlY3Rvcn0+aSB7IGJhY2tncm91bmQtY29sb3I6ICR7bGlnaHR9OyB9YCwgMClcclxuICAgICAgICBzaGVldC5pbnNlcnRSdWxlKGAke2V4dHJhfS5hc3NpZ25tZW50SXRlbSR7c2VsZWN0b3J9LmRvbmU+aSB7IGJhY2tncm91bmQtY29sb3I6ICR7ZGFya307IH1gLCAwKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGNyZWF0ZVBhbGV0dGUgPSAoY29sb3I6IHN0cmluZykgPT4gdGlueWNvbG9yKGNvbG9yKS5kYXJrZW4oMjQpLnRvSGV4U3RyaW5nKClcclxuXHJcbiAgICBpZiAoc2V0dGluZ3MuY29sb3JUeXBlID09PSAnYXNzaWdubWVudCcpIHtcclxuICAgICAgICBPYmplY3QuZW50cmllcyhhc3NpZ25tZW50Q29sb3JzKS5mb3JFYWNoKChbbmFtZSwgY29sb3JdKSA9PiB7XHJcbiAgICAgICAgICAgIGFkZENvbG9yUnVsZShgLiR7bmFtZX1gLCBjb2xvciwgcGFsZXR0ZVtjb2xvcl0gfHwgY3JlYXRlUGFsZXR0ZShjb2xvcikpXHJcbiAgICAgICAgfSlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgT2JqZWN0LmVudHJpZXMoY2xhc3NDb2xvcnMpLmZvckVhY2goKFtuYW1lLCBjb2xvcl0pID0+IHtcclxuICAgICAgICAgICAgYWRkQ29sb3JSdWxlKGBbZGF0YS1jbGFzcz1cXFwiJHtuYW1lfVxcXCJdYCwgY29sb3IsIHBhbGV0dGVbY29sb3JdIHx8IGNyZWF0ZVBhbGV0dGUoY29sb3IpKVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgYWRkQ29sb3JSdWxlKCcudGFzaycsICcjRjVGNUY1JywgJyNFMEUwRTAnKVxyXG4gICAgYWRkQ29sb3JSdWxlKCcudGFzaycsICcjNDI0MjQyJywgJyMyMTIxMjEnLCAnLmRhcmsgJylcclxufVxyXG5cclxuLy8gVGhlIGZ1bmN0aW9uIHRoZW4gbmVlZHMgdG8gYmUgY2FsbGVkLlxyXG51cGRhdGVDb2xvcnMoKVxyXG5cclxuLy8gVGhlIGVsZW1lbnRzIHRoYXQgY29udHJvbCB0aGUgc2V0dGluZ3MgYWxzbyBuZWVkIGV2ZW50IGxpc3RlbmVyc1xyXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc2V0dGluZ3NDb250cm9sJykuZm9yRWFjaCgoZSkgPT4ge1xyXG4gICAgaWYgKCEoZSBpbnN0YW5jZW9mIEhUTUxJbnB1dEVsZW1lbnQpKSByZXR1cm5cclxuICAgIGlmIChlLnR5cGUgPT09ICdjaGVja2JveCcpIHtcclxuICAgICAgICBlLmNoZWNrZWQgPSBnZXRTZXR0aW5nKGUubmFtZSlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZS52YWx1ZSA9IGdldFNldHRpbmcoZS5uYW1lKVxyXG4gICAgfVxyXG4gICAgZS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZXZ0KSA9PiB7XHJcbiAgICAgICAgaWYgKGUudHlwZSA9PT0gJ2NoZWNrYm94Jykge1xyXG4gICAgICAgICAgICBzZXRTZXR0aW5nKGUubmFtZSwgZS5jaGVja2VkKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHNldFNldHRpbmcoZS5uYW1lLCBlLnZhbHVlKVxyXG4gICAgICAgIH1cclxuICAgICAgICBzd2l0Y2ggKGUubmFtZSkge1xyXG4gICAgICAgICAgICBjYXNlICdyZWZyZXNoUmF0ZSc6IHJldHVybiBpbnRlcnZhbFJlZnJlc2goKVxyXG4gICAgICAgICAgICBjYXNlICdlYXJseVRlc3QnOiByZXR1cm4gZGlzcGxheSgpXHJcbiAgICAgICAgICAgIGNhc2UgJ2Fzc2lnbm1lbnRTcGFuJzogcmV0dXJuIGRpc3BsYXkoKVxyXG4gICAgICAgICAgICBjYXNlICdwcm9qZWN0c0luVGVzdFBhbmUnOiByZXR1cm4gZGlzcGxheSgpXHJcbiAgICAgICAgICAgIGNhc2UgJ2hpZGVBc3NpZ25tZW50cyc6IHJldHVybiBkaXNwbGF5KClcclxuICAgICAgICAgICAgY2FzZSAnaG9saWRheVRoZW1lcyc6IHJldHVybiBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC50b2dnbGUoJ2hvbGlkYXlUaGVtZXMnLCBlLmNoZWNrZWQpXHJcbiAgICAgICAgICAgIGNhc2UgJ3NlcFRhc2tDbGFzcyc6IGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnRvZ2dsZSgnc2VwVGFza0NsYXNzJywgZS5jaGVja2VkKTsgcmV0dXJuIGRpc3BsYXkoKVxyXG4gICAgICAgICAgICBjYXNlICdzZXBUYXNrcyc6IHJldHVybiBlbGVtQnlJZCgnc2VwVGFza3NSZWZyZXNoJykuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59KVxyXG5cclxuLy8gVGhpcyBhbHNvIG5lZWRzIHRvIGJlIGRvbmUgZm9yIHJhZGlvIGJ1dHRvbnNcclxuY29uc3QgY29sb3JUeXBlID1cclxuICAgIF8kKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYGlucHV0W25hbWU9XFxcImNvbG9yVHlwZVxcXCJdW3ZhbHVlPVxcXCIke3NldHRpbmdzLmNvbG9yVHlwZX1cXFwiXWApKSBhcyBIVE1MSW5wdXRFbGVtZW50XHJcbmNvbG9yVHlwZS5jaGVja2VkID0gdHJ1ZVxyXG5BcnJheS5mcm9tKGRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKCdjb2xvclR5cGUnKSkuZm9yRWFjaCgoYykgPT4ge1xyXG4gIGMuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGV2dCkgPT4ge1xyXG4gICAgY29uc3QgdiA9IChfJChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdpbnB1dFtuYW1lPVwiY29sb3JUeXBlXCJdOmNoZWNrZWQnKSkgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWVcclxuICAgIGlmICh2ICE9PSAnYXNzaWdubWVudCcgJiYgdiAhPT0gJ2NsYXNzJykgcmV0dXJuXHJcbiAgICBzZXR0aW5ncy5jb2xvclR5cGUgPSB2XHJcbiAgICBpZiAodiA9PT0gJ2NsYXNzJykge1xyXG4gICAgICBlbGVtQnlJZCgnYXNzaWdubWVudENvbG9ycycpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcclxuICAgICAgZWxlbUJ5SWQoJ2NsYXNzQ29sb3JzJykuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGVsZW1CeUlkKCdhc3NpZ25tZW50Q29sb3JzJykuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcclxuICAgICAgZWxlbUJ5SWQoJ2NsYXNzQ29sb3JzJykuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHVwZGF0ZUNvbG9ycygpXHJcbiAgfSlcclxufSlcclxuXHJcbi8vIFRoZSBzYW1lIGdvZXMgZm9yIHRleHRhcmVhcy5cclxuZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgndGV4dGFyZWEnKS5mb3JFYWNoKChlKSA9PiB7XHJcbiAgaWYgKChlLm5hbWUgIT09ICdhdGhlbmFEYXRhUmF3JykgJiYgKGxvY2FsU3RvcmFnZVtlLm5hbWVdICE9IG51bGwpKSB7XHJcbiAgICBlLnZhbHVlID0gbG9jYWxTdG9yYWdlW2UubmFtZV1cclxuICB9XHJcbiAgZS5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIChldnQpID0+IHtcclxuICAgIGxvY2FsU3RvcmFnZVtlLm5hbWVdID0gZS52YWx1ZVxyXG4gICAgaWYgKGUubmFtZSA9PT0gJ2F0aGVuYURhdGFSYXcnKSB7XHJcbiAgICAgIHVwZGF0ZUF0aGVuYURhdGEoZS52YWx1ZSlcclxuICAgIH1cclxuICB9KVxyXG59KVxyXG5cclxuLy8gPGEgbmFtZT1cInN0YXJ0aW5nXCIvPlxyXG4vLyBTdGFydGluZyBldmVyeXRoaW5nXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS1cclxuLy9cclxuLy8gRmluYWxseSEgV2UgYXJlIChhbG1vc3QpIGRvbmUhXHJcbi8vXHJcbi8vIEJlZm9yZSBnZXR0aW5nIHRvIGFueXRoaW5nLCBsZXQncyBwcmludCBvdXQgYSB3ZWxjb21pbmcgbWVzc2FnZSB0byB0aGUgY29uc29sZSFcclxuY29uc29sZS5sb2coJyVjQ2hlY2sgUENSJywgJ2NvbG9yOiAjMDA0MDAwOyBmb250LXNpemU6IDNlbScpXHJcbmNvbnNvbGUubG9nKGAlY1ZlcnNpb24gJHtWRVJTSU9OfSAoQ2hlY2sgYmVsb3cgZm9yIGN1cnJlbnQgdmVyc2lvbilgLCAnZm9udC1zaXplOiAxLjFlbScpXHJcbmNvbnNvbGUubG9nKGBXZWxjb21lIHRvIHRoZSBkZXZlbG9wZXIgY29uc29sZSBmb3IgeW91ciBicm93c2VyISBCZXNpZGVzIGxvb2tpbmcgYXQgdGhlIHNvdXJjZSBjb2RlLCBcXFxyXG55b3UgY2FuIGFsc28gcGxheSBhcm91bmQgd2l0aCBDaGVjayBQQ1IgYnkgZXhlY3V0aW5nIHRoZSBsaW5lcyBiZWxvdzpcclxuJWNcXHRmZXRjaCh0cnVlKSAgICAgICAgICAgICAgICVjLy8gUmVsb2FkcyBhbGwgb2YgeW91ciBhc3NpZ25tZW50cyAodGhlIHRydWUgaXMgZm9yIGZvcmNpbmcgYSByZWxvYWQgaWYgb25lIFxcXHJcbmhhcyBhbHJlYWR5IGJlZW4gdHJpZ2dlcmVkIGluIHRoZSBsYXN0IG1pbnV0ZSlcclxuJWNcXHRkYXRhICAgICAgICAgICAgICAgICAgICAgICVjLy8gRGlzcGxheXMgdGhlIG9iamVjdCB0aGF0IGNvbnRhaW5zIHRoZSBkYXRhIHBhcnNlZCBmcm9tIFBDUidzIGludGVyZmFjZVxyXG4lY1xcdGFjdGl2aXR5ICAgICAgICAgICAgICAgICAgJWMvLyBUaGUgZGF0YSBmb3IgdGhlIGFzc2lnbm1lbnRzIHRoYXQgc2hvdyB1cCBpbiB0aGUgYWN0aXZpdHkgcGFuZVxyXG4lY1xcdGV4dHJhICAgICAgICAgICAgICAgICAgICAgJWMvLyBBbGwgb2YgdGhlIHRhc2tzIHlvdSd2ZSBjcmVhdGVkIGJ5IGNsaWNraW5nIHRoZSArIGJ1dHRvblxyXG4lY1xcdGF0aGVuYURhdGEgICAgICAgICAgICAgICAgJWMvLyBUaGUgZGF0YSBmZXRjaGVkIGZyb20gQXRoZW5hIChpZiB5b3UndmUgcGFzdGVkIHRoZSByYXcgZGF0YSBpbnRvIHNldHRpbmdzKVxyXG4lY1xcdHNuYWNrYmFyKFwiSGVsbG8gV29ybGQhXCIpICAlYy8vIENyZWF0ZXMgYSBzbmFja2JhciBzaG93aW5nIHRoZSBtZXNzYWdlIFwiSGVsbG8gV29ybGQhXCJcclxuJWNcXHRkaXNwbGF5RXJyb3IobmV3IEVycm9yKCkpICVjLy8gRGlzcGxheXMgdGhlIHN0YWNrIHRyYWNlIGZvciBhIHJhbmRvbSBlcnJvciAoSnVzdCBkb24ndCBzdWJtaXQgaXQhKVxyXG4lY1xcdGNsb3NlRXJyb3IoKSAgICAgICAgICAgICAgJWMvLyBDbG9zZXMgdGhhdCBkaWFsb2dgLFxyXG4gICAgICAgICAgICAgICAuLi4oKFtdIGFzIHN0cmluZ1tdKS5jb25jYXQoLi4uQXJyYXkuZnJvbShuZXcgQXJyYXkoOCksICgpID0+IFsnY29sb3I6IGluaXRpYWwnLCAnY29sb3I6IGdyZXknXSkpKSlcclxuY29uc29sZS5sb2coJycpXHJcblxyXG4vLyBUaGUgXCJsYXN0IHVwZGF0ZWRcIiB0ZXh0IGlzIHNldCB0byB0aGUgY29ycmVjdCBkYXRlLlxyXG5jb25zdCB0cmllZExhc3RVcGRhdGUgPSBsb2NhbFN0b3JhZ2VSZWFkKCdsYXN0VXBkYXRlJylcclxuZWxlbUJ5SWQoJ2xhc3RVcGRhdGUnKS5pbm5lckhUTUwgPSB0cmllZExhc3RVcGRhdGUgPyBmb3JtYXRVcGRhdGUodHJpZWRMYXN0VXBkYXRlKSA6ICdOZXZlcidcclxuXHJcbmlmIChsb2NhbFN0b3JhZ2VSZWFkKCdkYXRhJykgIT0gbnVsbCkge1xyXG4gICAgLy8gTm93IGNoZWNrIGlmIHRoZXJlJ3MgYWN0aXZpdHlcclxuICAgIHJlY2VudEFjdGl2aXR5KCkuZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG4gICAgICAgIGFkZEFjdGl2aXR5KGl0ZW1bMF0sIGl0ZW1bMV0sIG5ldyBEYXRlKGl0ZW1bMl0pLCB0cnVlLCBpdGVtWzNdKVxyXG4gICAgfSlcclxuXHJcbiAgICBkaXNwbGF5KClcclxufVxyXG5cclxuZmV0Y2goKVxyXG5cclxuLy8gPGEgbmFtZT1cImV2ZW50c1wiLz5cclxuLy8gRXZlbnRzXHJcbi8vIC0tLS0tLVxyXG4vL1xyXG4vLyBUaGUgZG9jdW1lbnQgYm9keSBuZWVkcyB0byBiZSBlbmFibGVkIGZvciBoYW1tZXIuanMgZXZlbnRzLlxyXG5kZWxldGUgSGFtbWVyLmRlZmF1bHRzLmNzc1Byb3BzLnVzZXJTZWxlY3RcclxuY29uc3QgaGFtbWVydGltZSA9IG5ldyBIYW1tZXIuTWFuYWdlcihkb2N1bWVudC5ib2R5LCB7XHJcbiAgcmVjb2duaXplcnM6IFtcclxuICAgIFtIYW1tZXIuUGFuLCB7ZGlyZWN0aW9uOiBIYW1tZXIuRElSRUNUSU9OX0hPUklaT05UQUx9XVxyXG4gIF1cclxufSlcclxuXHJcbi8vIEZvciB0b3VjaCBkaXNwbGF5cywgaGFtbWVyLmpzIGlzIHVzZWQgdG8gbWFrZSB0aGUgc2lkZSBtZW51IGFwcGVhci9kaXNhcHBlYXIuIFRoZSBjb2RlIGJlbG93IGlzXHJcbi8vIGFkYXB0ZWQgZnJvbSBNYXRlcmlhbGl6ZSdzIGltcGxlbWVudGF0aW9uLlxyXG5sZXQgbWVudU91dCA9IGZhbHNlXHJcbmNvbnN0IGRyYWdUYXJnZXQgPSBuZXcgSGFtbWVyKGVsZW1CeUlkKCdkcmFnVGFyZ2V0JykpXHJcbmRyYWdUYXJnZXQub24oJ3BhbicsIChlKSA9PiB7XHJcbiAgaWYgKGUucG9pbnRlclR5cGUgPT09ICd0b3VjaCcpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgbGV0IHsgeCB9ID0gZS5jZW50ZXJcclxuICAgIGNvbnN0IHsgeSB9ID0gZS5jZW50ZXJcclxuXHJcbiAgICBjb25zdCBzQmtnID0gZWxlbUJ5SWQoJ3NpZGVCYWNrZ3JvdW5kJylcclxuICAgIHNCa2cuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcclxuICAgIHNCa2cuc3R5bGUub3BhY2l0eSA9ICcwJ1xyXG4gICAgZWxlbUJ5SWQoJ3NpZGVOYXYnKS5jbGFzc0xpc3QuYWRkKCdtYW51YWwnKVxyXG5cclxuICAgIC8vIEtlZXAgd2l0aGluIGJvdW5kYXJpZXNcclxuICAgIGlmICh4ID4gMjQwKSB7XHJcbiAgICAgIHggPSAyNDBcclxuICAgIH0gZWxzZSBpZiAoeCA8IDApIHtcclxuICAgICAgeCA9IDBcclxuXHJcbiAgICAgIC8vIExlZnQgRGlyZWN0aW9uXHJcbiAgICAgIGlmICh4IDwgMTIwKSB7XHJcbiAgICAgICAgbWVudU91dCA9IGZhbHNlXHJcbiAgICAgIC8vIFJpZ2h0IERpcmVjdGlvblxyXG4gICAgICB9IGVsc2UgaWYgKHggPj0gMTIwKSB7XHJcbiAgICAgICAgbWVudU91dCA9IHRydWVcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGVsZW1CeUlkKCdzaWRlTmF2Jykuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVgoJHt4IC0gMjQwfXB4KWBcclxuICAgIGNvbnN0IG92ZXJsYXlQZXJjZW50ID0gTWF0aC5taW4oeCAvIDQ4MCwgMC41KVxyXG4gICAgcmV0dXJuIHNCa2cuc3R5bGUub3BhY2l0eSA9IFN0cmluZyhvdmVybGF5UGVyY2VudClcclxuICB9XHJcbn0pXHJcblxyXG5kcmFnVGFyZ2V0Lm9uKCdwYW5lbmQnLCAoZSkgPT4ge1xyXG4gIGlmIChlLnBvaW50ZXJUeXBlID09PSAndG91Y2gnKSB7XHJcbiAgICBsZXQgc2lkZU5hdlxyXG4gICAgY29uc3QgeyB2ZWxvY2l0eVggfSA9IGVcclxuICAgIC8vIElmIHZlbG9jaXR5WCA8PSAwLjMgdGhlbiB0aGUgdXNlciBpcyBmbGluZ2luZyB0aGUgbWVudSBjbG9zZWQgc28gaWdub3JlIG1lbnVPdXRcclxuICAgIGlmICgobWVudU91dCAmJiAodmVsb2NpdHlYIDw9IDAuMykpIHx8ICh2ZWxvY2l0eVggPCAtMC41KSkge1xyXG4gICAgICBzaWRlTmF2ID0gZWxlbUJ5SWQoJ3NpZGVOYXYnKVxyXG4gICAgICBzaWRlTmF2LmNsYXNzTGlzdC5yZW1vdmUoJ21hbnVhbCcpXHJcbiAgICAgIHNpZGVOYXYuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuICAgICAgc2lkZU5hdi5zdHlsZS50cmFuc2Zvcm0gPSAnJ1xyXG4gICAgICBlbGVtQnlJZCgnZHJhZ1RhcmdldCcpLnN0eWxlLndpZHRoID0gJzEwMCUnXHJcblxyXG4gICAgfSBlbHNlIGlmICghbWVudU91dCB8fCAodmVsb2NpdHlYID4gMC4zKSkge1xyXG4gICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2F1dG8nXHJcbiAgICAgIHNpZGVOYXYgPSBlbGVtQnlJZCgnc2lkZU5hdicpXHJcbiAgICAgIHNpZGVOYXYuY2xhc3NMaXN0LnJlbW92ZSgnbWFudWFsJylcclxuICAgICAgc2lkZU5hdi5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gICAgICBzaWRlTmF2LnN0eWxlLnRyYW5zZm9ybSA9ICcnXHJcbiAgICAgIGVsZW1CeUlkKCdzaWRlQmFja2dyb3VuZCcpLnN0eWxlLm9wYWNpdHkgPSAnJ1xyXG4gICAgICBlbGVtQnlJZCgnZHJhZ1RhcmdldCcpLnN0eWxlLndpZHRoID0gJzEwcHgnXHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gZWxlbUJ5SWQoJ3NpZGVCYWNrZ3JvdW5kJykuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xyXG4gICAgICAsIDM1MClcclxuICAgIH1cclxuICB9XHJcbn0pXHJcblxyXG5kcmFnVGFyZ2V0Lm9uKCd0YXAnLCAoZSkgPT4ge1xyXG4gICAgZWxlbUJ5SWQoJ3NpZGVCYWNrZ3JvdW5kJykuY2xpY2soKVxyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbn0pXHJcblxyXG5jb25zdCBkdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkcmFnVGFyZ2V0JylcclxuXHJcbi8vIFRoZSBhY3Rpdml0eSBmaWx0ZXIgYnV0dG9uIGFsc28gbmVlZHMgYW4gZXZlbnQgbGlzdGVuZXIuXHJcbnJpcHBsZShlbGVtQnlJZCgnZmlsdGVyQWN0aXZpdHknKSlcclxuZWxlbUJ5SWQoJ2ZpbHRlckFjdGl2aXR5JykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgZWxlbUJ5SWQoJ2luZm9BY3Rpdml0eScpLmNsYXNzTGlzdC50b2dnbGUoJ2ZpbHRlcicpXHJcbn0pXHJcblxyXG4vLyBBdCB0aGUgc3RhcnQsIGl0IG5lZWRzIHRvIGJlIGNvcnJlY3RseSBwb3B1bGF0ZWRcclxuY29uc3QgYWN0aXZpdHlUeXBlcyA9IHNldHRpbmdzLnNob3duQWN0aXZpdHlcclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZVNlbGVjdE51bSgpOiBzdHJpbmcge1xyXG4gICAgY29uc3QgYyA9IChib29sOiBib29sZWFuKSAgPT4gYm9vbCA/IDEgOiAwXHJcbiAgICBjb25zdCBjb3VudCA9IFN0cmluZyhjKGFjdGl2aXR5VHlwZXMuYWRkKSArIGMoYWN0aXZpdHlUeXBlcy5lZGl0KSArIGMoYWN0aXZpdHlUeXBlcy5kZWxldGUpKVxyXG4gICAgcmV0dXJuIGVsZW1CeUlkKCdzZWxlY3ROdW0nKS5pbm5lckhUTUwgPSBjb3VudFxyXG59XHJcbnVwZGF0ZVNlbGVjdE51bSgpXHJcbk9iamVjdC5lbnRyaWVzKGFjdGl2aXR5VHlwZXMpLmZvckVhY2goKFt0eXBlLCBlbmFibGVkXSkgPT4ge1xyXG4gIGlmICh0eXBlICE9PSAnYWRkJyAmJiB0eXBlICE9PSAnZWRpdCcgJiYgdHlwZSAhPT0gJ2RlbGV0ZScpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBhY3Rpdml0eSB0eXBlICR7dHlwZX1gKVxyXG4gIH1cclxuXHJcbiAgY29uc3Qgc2VsZWN0RWwgPSBlbGVtQnlJZCh0eXBlICsgJ1NlbGVjdCcpIGFzIEhUTUxJbnB1dEVsZW1lbnRcclxuICBzZWxlY3RFbC5jaGVja2VkID0gZW5hYmxlZFxyXG4gIGlmIChlbmFibGVkKSB7IGVsZW1CeUlkKCdpbmZvQWN0aXZpdHknKS5jbGFzc0xpc3QuYWRkKHR5cGUpIH1cclxuICBzZWxlY3RFbC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZXZ0KSA9PiB7XHJcbiAgICBhY3Rpdml0eVR5cGVzW3R5cGVdID0gc2VsZWN0RWwuY2hlY2tlZFxyXG4gICAgZWxlbUJ5SWQoJ2luZm9BY3Rpdml0eScpLnNldEF0dHJpYnV0ZSgnZGF0YS1maWx0ZXJlZCcsIHVwZGF0ZVNlbGVjdE51bSgpKVxyXG4gICAgZWxlbUJ5SWQoJ2luZm9BY3Rpdml0eScpLmNsYXNzTGlzdC50b2dnbGUodHlwZSlcclxuICAgIHNldHRpbmdzLnNob3duQWN0aXZpdHkgPSBhY3Rpdml0eVR5cGVzXHJcbiAgfSlcclxufSlcclxuXHJcbi8vIFRoZSBzaG93IGNvbXBsZXRlZCB0YXNrcyBjaGVja2JveCBpcyBzZXQgY29ycmVjdGx5IGFuZCBpcyBhc3NpZ25lZCBhbiBldmVudCBsaXN0ZW5lci5cclxuY29uc3Qgc2hvd0RvbmVUYXNrc0VsID0gZWxlbUJ5SWQoJ3Nob3dEb25lVGFza3MnKSBhcyBIVE1MSW5wdXRFbGVtZW50XHJcbmlmIChzZXR0aW5ncy5zaG93RG9uZVRhc2tzKSB7XHJcbiAgc2hvd0RvbmVUYXNrc0VsLmNoZWNrZWQgPSB0cnVlXHJcbiAgZWxlbUJ5SWQoJ2luZm9UYXNrc0lubmVyJykuY2xhc3NMaXN0LmFkZCgnc2hvd0RvbmVUYXNrcycpXHJcbn1cclxuc2hvd0RvbmVUYXNrc0VsLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsICgpID0+IHtcclxuICBzZXR0aW5ncy5zaG93RG9uZVRhc2tzID0gc2hvd0RvbmVUYXNrc0VsLmNoZWNrZWRcclxuICBlbGVtQnlJZCgnaW5mb1Rhc2tzSW5uZXInKS5jbGFzc0xpc3QudG9nZ2xlKCdzaG93RG9uZVRhc2tzJywgc2V0dGluZ3Muc2hvd0RvbmVUYXNrcylcclxufSlcclxuXHJcbi8vIDxhIG5hbWU9XCJ1cGRhdGVzXCIvPlxyXG4vLyBVcGRhdGVzIGFuZCBOZXdzXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS1cclxuLy9cclxuXHJcbmlmIChsb2NhdGlvbi5wcm90b2NvbCA9PT0gJ2Nocm9tZS1leHRlbnNpb246JykgeyBjaGVja0NvbW1pdCgpIH1cclxuXHJcbi8vIFRoaXMgdXBkYXRlIGRpYWxvZyBhbHNvIG5lZWRzIHRvIGJlIGNsb3NlZCB3aGVuIHRoZSBidXR0b25zIGFyZSBjbGlja2VkLlxyXG5lbGVtQnlJZCgndXBkYXRlRGVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICBlbGVtQnlJZCgndXBkYXRlJykuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcclxuICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgIGVsZW1CeUlkKCd1cGRhdGVCYWNrZ3JvdW5kJykuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xyXG4gIH0sIDM1MClcclxufSlcclxuXHJcbi8vIEZvciBuZXdzLCB0aGUgbGF0ZXN0IG5ld3MgaXMgZmV0Y2hlZCBmcm9tIGEgR2l0SHViIGdpc3QuXHJcbmZldGNoTmV3cygpXHJcblxyXG4vLyBUaGUgbmV3cyBkaWFsb2cgdGhlbiBuZWVkcyB0byBiZSBjbG9zZWQgd2hlbiBPSyBvciB0aGUgYmFja2dyb3VuZCBpcyBjbGlja2VkLlxyXG5mdW5jdGlvbiBjbG9zZU5ld3MoKTogdm9pZCB7XHJcbiAgZWxlbUJ5SWQoJ25ld3MnKS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgZWxlbUJ5SWQoJ25ld3NCYWNrZ3JvdW5kJykuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xyXG4gIH0sIDM1MClcclxufVxyXG5cclxuZWxlbUJ5SWQoJ25ld3NPaycpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xvc2VOZXdzKVxyXG5lbGVtQnlJZCgnbmV3c0JhY2tncm91bmQnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsb3NlTmV3cylcclxuXHJcbi8vIEl0IGFsc28gbmVlZHMgdG8gYmUgb3BlbmVkIHdoZW4gdGhlIG5ld3MgYnV0dG9uIGlzIGNsaWNrZWQuXHJcbmVsZW1CeUlkKCduZXdzQicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gIGVsZW1CeUlkKCdzaWRlQmFja2dyb3VuZCcpLmNsaWNrKClcclxuICBjb25zdCBkaXNwbGF5TmV3cyA9ICgpID0+IHtcclxuICAgIGVsZW1CeUlkKCduZXdzQmFja2dyb3VuZCcpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXHJcbiAgICByZXR1cm4gZWxlbUJ5SWQoJ25ld3MnKS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG4gIH1cclxuXHJcbiAgaWYgKGVsZW1CeUlkKCduZXdzQ29udGVudCcpLmNoaWxkTm9kZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICBnZXROZXdzKGRpc3BsYXlOZXdzKVxyXG4gIH0gZWxzZSB7XHJcbiAgICBkaXNwbGF5TmV3cygpXHJcbiAgfVxyXG59KVxyXG5cclxuLy8gVGhlIHNhbWUgZ29lcyBmb3IgdGhlIGVycm9yIGRpYWxvZy5cclxuZnVuY3Rpb24gY2xvc2VFcnJvcigpOiB2b2lkIHtcclxuICBlbGVtQnlJZCgnZXJyb3InKS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgZWxlbUJ5SWQoJ2Vycm9yQmFja2dyb3VuZCcpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcclxuICB9LCAzNTApXHJcbn1cclxuXHJcbmVsZW1CeUlkKCdlcnJvck5vJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbG9zZUVycm9yKVxyXG5lbGVtQnlJZCgnZXJyb3JCYWNrZ3JvdW5kJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbG9zZUVycm9yKVxyXG5cclxuLy8gPGEgbmFtZT1cIm5ld1wiLz5cclxuLy8gQWRkaW5nIG5ldyBhc3NpZ25tZW50c1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbi8vXHJcbi8vIFRoZSBldmVudCBsaXN0ZW5lcnMgZm9yIHRoZSBuZXcgYnV0dG9ucyBhcmUgYWRkZWQuXHJcbnJpcHBsZShlbGVtQnlJZCgnbmV3JykpXHJcbnJpcHBsZShlbGVtQnlJZCgnbmV3VGFzaycpKVxyXG5jb25zdCBvbk5ld1Rhc2sgPSAoKSA9PiB7XHJcbiAgdXBkYXRlTmV3VGlwcygoZWxlbUJ5SWQoJ25ld1RleHQnKSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSA9ICcnKVxyXG4gIGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJ1xyXG4gIGVsZW1CeUlkKCduZXdCYWNrZ3JvdW5kJykuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcclxuICBlbGVtQnlJZCgnbmV3RGlhbG9nJykuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuICBlbGVtQnlJZCgnbmV3VGV4dCcpLmZvY3VzKClcclxufVxyXG5lbGVtQnlJZCgnbmV3JykuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG9uTmV3VGFzaylcclxuZWxlbUJ5SWQoJ25ld1Rhc2snKS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgb25OZXdUYXNrKVxyXG5cclxuLy8gQSBmdW5jdGlvbiB0byBjbG9zZSB0aGUgZGlhbG9nIGlzIHRoZW4gZGVmaW5lZC5cclxuZnVuY3Rpb24gY2xvc2VOZXcoKTogdm9pZCB7XHJcbiAgZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICdhdXRvJ1xyXG4gIGVsZW1CeUlkKCduZXdEaWFsb2cnKS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgZWxlbUJ5SWQoJ25ld0JhY2tncm91bmQnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXHJcbiAgfSwgMzUwKVxyXG59XHJcblxyXG4vLyBUaGlzIGZ1bmN0aW9uIGlzIHNldCB0byBiZSBjYWxsZWQgY2FsbGVkIHdoZW4gdGhlIEVTQyBrZXkgaXMgY2FsbGVkIGluc2lkZSBvZiB0aGUgZGlhbG9nLlxyXG5lbGVtQnlJZCgnbmV3VGV4dCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZXZ0KSA9PiB7XHJcbiAgaWYgKGV2dC53aGljaCA9PT0gMjcpIHsgLy8gRXNjYXBlIGtleSBwcmVzc2VkXHJcbiAgICBjbG9zZU5ldygpXHJcbiAgfVxyXG59KVxyXG5cclxuLy8gQW4gZXZlbnQgbGlzdGVuZXIgdG8gY2FsbCB0aGUgZnVuY3Rpb24gaXMgYWxzbyBhZGRlZCB0byB0aGUgWCBidXR0b25cclxuZWxlbUJ5SWQoJ25ld0NhbmNlbCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xvc2VOZXcpXHJcblxyXG4vLyBXaGVuIHRoZSBlbnRlciBrZXkgaXMgcHJlc3NlZCBvciB0aGUgc3VibWl0IGJ1dHRvbiBpcyBjbGlja2VkLCB0aGUgbmV3IGFzc2lnbm1lbnQgaXMgYWRkZWQuXHJcbmVsZW1CeUlkKCduZXdEaWFsb2cnKS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCAoZXZ0KSA9PiB7XHJcbiAgZXZ0LnByZXZlbnREZWZhdWx0KClcclxuICBjb25zdCBpdGV4dCA9IChlbGVtQnlJZCgnbmV3VGV4dCcpIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlXHJcbiAgY29uc3QgeyB0ZXh0LCBjbHMsIGR1ZSwgc3QgfSA9IHBhcnNlQ3VzdG9tVGFzayhpdGV4dClcclxuICBsZXQgZW5kOiAnRm9yZXZlcid8bnVtYmVyID0gJ0ZvcmV2ZXInXHJcblxyXG4gIGNvbnN0IHN0YXJ0ID0gKHN0ICE9IG51bGwpID8gdG9EYXRlTnVtKGNocm9uby5wYXJzZURhdGUoc3QpKSA6IHRvZGF5KClcclxuICBpZiAoZHVlICE9IG51bGwpIHtcclxuICAgIGVuZCA9IHRvRGF0ZU51bShjaHJvbm8ucGFyc2VEYXRlKGR1ZSkpXHJcbiAgICBpZiAoZW5kIDwgc3RhcnQpIHsgLy8gQXNzaWdubWVudCBlbmRzIGJlZm9yZSBpdCBpcyBhc3NpZ25lZFxyXG4gICAgICBlbmQgKz0gTWF0aC5jZWlsKChzdGFydCAtIGVuZCkgLyA3KSAqIDdcclxuICAgIH1cclxuICB9XHJcbiAgYWRkVG9FeHRyYSh7XHJcbiAgICBib2R5OiB0ZXh0LmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgdGV4dC5zdWJzdHIoMSksXHJcbiAgICBkb25lOiBmYWxzZSxcclxuICAgIHN0YXJ0LFxyXG4gICAgY2xhc3M6IChjbHMgIT0gbnVsbCkgPyBjbHMudG9Mb3dlckNhc2UoKS50cmltKCkgOiBudWxsLFxyXG4gICAgZW5kXHJcbiAgfSlcclxuICBzYXZlRXh0cmEoKVxyXG4gIGNsb3NlTmV3KClcclxuICBkaXNwbGF5KGZhbHNlKVxyXG59KVxyXG5cclxudXBkYXRlTmV3VGlwcygnJywgZmFsc2UpXHJcbmVsZW1CeUlkKCduZXdUZXh0JykuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoKSA9PiB7XHJcbiAgcmV0dXJuIHVwZGF0ZU5ld1RpcHMoKGVsZW1CeUlkKCduZXdUZXh0JykgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWUpXHJcbn0pXHJcblxyXG4vLyBUaGUgY29kZSBiZWxvdyByZWdpc3RlcnMgYSBzZXJ2aWNlIHdvcmtlciB0aGF0IGNhY2hlcyB0aGUgcGFnZSBzbyBpdCBjYW4gYmUgdmlld2VkIG9mZmxpbmUuXHJcbmlmICgnc2VydmljZVdvcmtlcicgaW4gbmF2aWdhdG9yKSB7XHJcbiAgbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIucmVnaXN0ZXIoJy9zZXJ2aWNlLXdvcmtlci5qcycpXHJcbiAgICAudGhlbigocmVnaXN0cmF0aW9uKSA9PlxyXG4gICAgICAvLyBSZWdpc3RyYXRpb24gd2FzIHN1Y2Nlc3NmdWxcclxuICAgICAgY29uc29sZS5sb2coJ1NlcnZpY2VXb3JrZXIgcmVnaXN0cmF0aW9uIHN1Y2Nlc3NmdWwgd2l0aCBzY29wZScsIHJlZ2lzdHJhdGlvbi5zY29wZSkpLmNhdGNoKChlcnIpID0+XHJcbiAgICAgIC8vIHJlZ2lzdHJhdGlvbiBmYWlsZWQgOihcclxuICAgICAgY29uc29sZS5sb2coJ1NlcnZpY2VXb3JrZXIgcmVnaXN0cmF0aW9uIGZhaWxlZDogJywgZXJyKVxyXG4gIClcclxufVxyXG5cclxuLy8gSWYgdGhlIHNlcnZpY2Ugd29ya2VyIGRldGVjdHMgdGhhdCB0aGUgd2ViIGFwcCBoYXMgYmVlbiB1cGRhdGVkLCB0aGUgY29tbWl0IGlzIGZldGNoZWQgZnJvbSBHaXRIdWIuXHJcbm5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCAoZXZlbnQpID0+IHtcclxuICAgIGNvbnNvbGUubG9nKCdHZXR0aW5nIGNvbW1pdCBiZWNhdXNlIG9mIHNlcnZpY2V3b3JrZXInKVxyXG4gICAgaWYgKGV2ZW50LmRhdGEuZ2V0Q29tbWl0KSB7IHJldHVybiBjaGVja0NvbW1pdCgpIH1cclxufSlcclxuIiwiaW1wb3J0IHsgY2xhc3NCeUlkLCBnZXREYXRhLCBJQXNzaWdubWVudCB9IGZyb20gJy4uL3BjcidcclxuaW1wb3J0IHsgQWN0aXZpdHlUeXBlIH0gZnJvbSAnLi4vcGx1Z2lucy9hY3Rpdml0eSdcclxuaW1wb3J0IHsgYXNzaWdubWVudEluRG9uZSB9IGZyb20gJy4uL3BsdWdpbnMvZG9uZSdcclxuaW1wb3J0IHsgXyQsIGRhdGVTdHJpbmcsIGVsZW1CeUlkLCBlbGVtZW50LCBzbW9vdGhTY3JvbGwgfSBmcm9tICcuLi91dGlsJ1xyXG5pbXBvcnQgeyBzZXBhcmF0ZSB9IGZyb20gJy4vYXNzaWdubWVudCdcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBhZGRBY3Rpdml0eUVsZW1lbnQoZWw6IEhUTUxFbGVtZW50KTogdm9pZCB7XHJcbiAgICBjb25zdCBpbnNlcnRUbyA9IGVsZW1CeUlkKCdpbmZvQWN0aXZpdHknKVxyXG4gICAgaW5zZXJ0VG8uaW5zZXJ0QmVmb3JlKGVsLCBpbnNlcnRUby5xdWVyeVNlbGVjdG9yKCcuYWN0aXZpdHknKSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUFjdGl2aXR5KHR5cGU6IEFjdGl2aXR5VHlwZSwgYXNzaWdubWVudDogSUFzc2lnbm1lbnQsIGRhdGU6IERhdGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU/OiBzdHJpbmcgKTogSFRNTEVsZW1lbnQge1xyXG4gICAgY29uc3QgY25hbWUgPSBjbGFzc05hbWUgfHwgY2xhc3NCeUlkKGFzc2lnbm1lbnQuY2xhc3MpXHJcblxyXG4gICAgY29uc3QgdGUgPSBlbGVtZW50KCdkaXYnLCBbJ2FjdGl2aXR5JywgJ2Fzc2lnbm1lbnRJdGVtJywgYXNzaWdubWVudC5iYXNlVHlwZSwgdHlwZV0sIGBcclxuICAgICAgICA8aSBjbGFzcz0nbWF0ZXJpYWwtaWNvbnMnPiR7dHlwZX08L2k+XHJcbiAgICAgICAgPHNwYW4gY2xhc3M9J3RpdGxlJz4ke2Fzc2lnbm1lbnQudGl0bGV9PC9zcGFuPlxyXG4gICAgICAgIDxzbWFsbD4ke3NlcGFyYXRlKGNuYW1lKVsyXX08L3NtYWxsPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9J3JhbmdlJz4ke2RhdGVTdHJpbmcoZGF0ZSl9PC9kaXY+YCwgYGFjdGl2aXR5JHthc3NpZ25tZW50LmlkfWApXHJcbiAgICB0ZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtY2xhc3MnLCBjbmFtZSlcclxuICAgIGNvbnN0IHsgaWQgfSA9IGFzc2lnbm1lbnRcclxuICAgIGlmICh0eXBlICE9PSAnZGVsZXRlJykge1xyXG4gICAgICAgIHRlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBkb1Njcm9sbGluZyA9IGFzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGVsID0gXyQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLmFzc2lnbm1lbnRbaWQqPVxcXCIke2lkfVxcXCJdYCkpIGFzIEhUTUxFbGVtZW50XHJcbiAgICAgICAgICAgICAgICBhd2FpdCBzbW9vdGhTY3JvbGwoKGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCArIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wKSAtIDExNilcclxuICAgICAgICAgICAgICAgIGVsLmNsaWNrKClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuYm9keS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmlldycpID09PSAnMCcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGRvU2Nyb2xsaW5nKClcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIChfJChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbmF2VGFicz5saTpmaXJzdC1jaGlsZCcpKSBhcyBIVE1MRWxlbWVudCkuY2xpY2soKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZG9TY3JvbGxpbmcsIDUwMClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGFzc2lnbm1lbnRJbkRvbmUoYXNzaWdubWVudC5pZCkpIHtcclxuICAgICAgdGUuY2xhc3NMaXN0LmFkZCgnZG9uZScpXHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGVcclxufVxyXG4iLCJpbXBvcnQgeyBmcm9tRGF0ZU51bSwgdG9kYXkgfSBmcm9tICcuLi9kYXRlcydcclxuaW1wb3J0IHsgZGlzcGxheSwgZ2V0VGltZUFmdGVyLCBJU3BsaXRBc3NpZ25tZW50IH0gZnJvbSAnLi4vZGlzcGxheSdcclxuaW1wb3J0IHsgZ2V0TGlzdERhdGVPZmZzZXQgfSBmcm9tICcuLi9uYXZpZ2F0aW9uJ1xyXG5pbXBvcnQgeyBnZXRBdHRhY2htZW50TWltZVR5cGUsIElBcHBsaWNhdGlvbkRhdGEsIElBc3NpZ25tZW50LCB1cmxGb3JBdHRhY2htZW50IH0gZnJvbSAnLi4vcGNyJ1xyXG5pbXBvcnQgeyByZWNlbnRBY3Rpdml0eSB9IGZyb20gJy4uL3BsdWdpbnMvYWN0aXZpdHknXHJcbmltcG9ydCB7IGdldEF0aGVuYURhdGEgfSBmcm9tICcuLi9wbHVnaW5zL2F0aGVuYSdcclxuaW1wb3J0IHsgcmVtb3ZlRnJvbUV4dHJhLCBzYXZlRXh0cmEgfSBmcm9tICcuLi9wbHVnaW5zL2N1c3RvbUFzc2lnbm1lbnRzJ1xyXG5pbXBvcnQgeyBhZGRUb0RvbmUsIGFzc2lnbm1lbnRJbkRvbmUsIHJlbW92ZUZyb21Eb25lLCBzYXZlRG9uZSB9IGZyb20gJy4uL3BsdWdpbnMvZG9uZSdcclxuaW1wb3J0IHsgbW9kaWZpZWRCb2R5LCByZW1vdmVGcm9tTW9kaWZpZWQsIHNhdmVNb2RpZmllZCwgc2V0TW9kaWZpZWQgfSBmcm9tICcuLi9wbHVnaW5zL21vZGlmaWVkQXNzaWdubWVudHMnXHJcbmltcG9ydCB7IHNldHRpbmdzIH0gZnJvbSAnLi4vc2V0dGluZ3MnXHJcbmltcG9ydCB7IF8kLCBjc3NOdW1iZXIsIGRhdGVTdHJpbmcsIGVsZW1CeUlkLCBlbGVtZW50LCBmb3JjZUxheW91dCwgcmlwcGxlIH0gZnJvbSAnLi4vdXRpbCdcclxuaW1wb3J0IHsgcmVzaXplIH0gZnJvbSAnLi9yZXNpemVyJ1xyXG5cclxuY29uc3QgbWltZVR5cGVzOiB7IFttaW1lOiBzdHJpbmddOiBbc3RyaW5nLCBzdHJpbmddIH0gPSB7XHJcbiAgICAnYXBwbGljYXRpb24vbXN3b3JkJzogWydXb3JkIERvYycsICdkb2N1bWVudCddLFxyXG4gICAgJ2FwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC53b3JkcHJvY2Vzc2luZ21sLmRvY3VtZW50JzogWydXb3JkIERvYycsICdkb2N1bWVudCddLFxyXG4gICAgJ2FwcGxpY2F0aW9uL3ZuZC5tcy1wb3dlcnBvaW50JzogWydQUFQgUHJlc2VudGF0aW9uJywgJ3NsaWRlcyddLFxyXG4gICAgJ2FwcGxpY2F0aW9uL3BkZic6IFsnUERGIEZpbGUnLCAncGRmJ10sXHJcbiAgICAndGV4dC9wbGFpbic6IFsnVGV4dCBEb2MnLCAncGxhaW4nXVxyXG59XHJcblxyXG5jb25zdCBkbXAgPSBuZXcgZGlmZl9tYXRjaF9wYXRjaCgpIC8vIEZvciBkaWZmaW5nXHJcblxyXG5mdW5jdGlvbiBwb3B1bGF0ZUFkZGVkRGVsZXRlZChkaWZmczogYW55W10sIGVkaXRzOiBIVE1MRWxlbWVudCk6IGJvb2xlYW4ge1xyXG4gICAgbGV0IGFkZGVkID0gMFxyXG4gICAgbGV0IGRlbGV0ZWQgPSAwXHJcbiAgICBkaWZmcy5mb3JFYWNoKChkaWZmKSA9PiB7XHJcbiAgICAgICAgaWYgKGRpZmZbMF0gPT09IDEpIHsgYWRkZWQrKyB9XHJcbiAgICAgICAgaWYgKGRpZmZbMF0gPT09IC0xKSB7IGRlbGV0ZWQrKyB9XHJcbiAgICB9KVxyXG4gICAgXyQoZWRpdHMucXVlcnlTZWxlY3RvcignLmFkZGl0aW9ucycpKS5pbm5lckhUTUwgPSBhZGRlZCAhPT0gMCA/IGArJHthZGRlZH1gIDogJydcclxuICAgIF8kKGVkaXRzLnF1ZXJ5U2VsZWN0b3IoJy5kZWxldGlvbnMnKSkuaW5uZXJIVE1MID0gZGVsZXRlZCAhPT0gMCA/IGAtJHtkZWxldGVkfWAgOiAnJ1xyXG4gICAgZWRpdHMuY2xhc3NMaXN0LmFkZCgnbm90RW1wdHknKVxyXG4gICAgcmV0dXJuIGFkZGVkID4gMCB8fCBkZWxldGVkID4gMFxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY29tcHV0ZVdlZWtJZChzcGxpdDogSVNwbGl0QXNzaWdubWVudCk6IHN0cmluZyB7XHJcbiAgICBjb25zdCBzdGFydFN1biA9IG5ldyBEYXRlKHNwbGl0LnN0YXJ0LmdldFRpbWUoKSlcclxuICAgIHN0YXJ0U3VuLnNldERhdGUoc3RhcnRTdW4uZ2V0RGF0ZSgpIC0gc3RhcnRTdW4uZ2V0RGF5KCkpXHJcbiAgICByZXR1cm4gYHdrJHtzdGFydFN1bi5nZXRNb250aCgpfS0ke3N0YXJ0U3VuLmdldERhdGUoKX1gXHJcbn1cclxuXHJcbi8vIFRoaXMgZnVuY3Rpb24gc2VwYXJhdGVzIHRoZSBwYXJ0cyBvZiBhIGNsYXNzIG5hbWUuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXBhcmF0ZShjbDogc3RyaW5nKTogUmVnRXhwTWF0Y2hBcnJheSB7XHJcbiAgICBjb25zdCBtID0gY2wubWF0Y2goLygoPzpcXGQqXFxzKyk/KD86KD86aG9uXFx3KnwoPzphZHZcXHcqXFxzKik/Y29yZSlcXHMrKT8pKC4qKS9pKVxyXG4gICAgaWYgKG0gPT0gbnVsbCkgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3Qgc2VwYXJhdGUgY2xhc3Mgc3RyaW5nICR7Y2x9YClcclxuICAgIHJldHVybiBtXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBhc3NpZ25tZW50Q2xhc3MoYXNzaWdubWVudDogSUFzc2lnbm1lbnQsIGRhdGE6IElBcHBsaWNhdGlvbkRhdGEpOiBzdHJpbmcge1xyXG4gICAgY29uc3QgY2xzID0gKGFzc2lnbm1lbnQuY2xhc3MgIT0gbnVsbCkgPyBkYXRhLmNsYXNzZXNbYXNzaWdubWVudC5jbGFzc10gOiAnVGFzaydcclxuICAgIGlmIChjbHMgPT0gbnVsbCkgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCBjbGFzcyAke2Fzc2lnbm1lbnQuY2xhc3N9IGluICR7ZGF0YS5jbGFzc2VzfWApXHJcbiAgICByZXR1cm4gY2xzXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXBhcmF0ZWRDbGFzcyhhc3NpZ25tZW50OiBJQXNzaWdubWVudCwgZGF0YTogSUFwcGxpY2F0aW9uRGF0YSk6IFJlZ0V4cE1hdGNoQXJyYXkge1xyXG4gICAgcmV0dXJuIHNlcGFyYXRlKGFzc2lnbm1lbnRDbGFzcyhhc3NpZ25tZW50LCBkYXRhKSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUFzc2lnbm1lbnQoc3BsaXQ6IElTcGxpdEFzc2lnbm1lbnQsIGRhdGE6IElBcHBsaWNhdGlvbkRhdGEpOiBIVE1MRWxlbWVudCB7XHJcbiAgICBjb25zdCB7IGFzc2lnbm1lbnQsIHJlZmVyZW5jZSB9ID0gc3BsaXRcclxuXHJcbiAgICAvLyBTZXBhcmF0ZSB0aGUgY2xhc3MgZGVzY3JpcHRpb24gZnJvbSB0aGUgYWN0dWFsIGNsYXNzXHJcbiAgICBjb25zdCBzZXBhcmF0ZWQgPSBzZXBhcmF0ZWRDbGFzcyhhc3NpZ25tZW50LCBkYXRhKVxyXG5cclxuICAgIGNvbnN0IHdlZWtJZCA9IGNvbXB1dGVXZWVrSWQoc3BsaXQpXHJcblxyXG4gICAgbGV0IHNtYWxsVGFnID0gJ3NtYWxsJ1xyXG4gICAgbGV0IGxpbmsgPSBudWxsXHJcbiAgICBjb25zdCBhdGhlbmFEYXRhID0gZ2V0QXRoZW5hRGF0YSgpXHJcbiAgICBpZiAoYXRoZW5hRGF0YSAmJiBhc3NpZ25tZW50LmNsYXNzICE9IG51bGwgJiYgKGF0aGVuYURhdGFbZGF0YS5jbGFzc2VzW2Fzc2lnbm1lbnQuY2xhc3NdXSAhPSBudWxsKSkge1xyXG4gICAgICAgIGxpbmsgPSBhdGhlbmFEYXRhW2RhdGEuY2xhc3Nlc1thc3NpZ25tZW50LmNsYXNzXV0ubGlua1xyXG4gICAgICAgIHNtYWxsVGFnID0gJ2EnXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZSA9IGVsZW1lbnQoJ2RpdicsIFsnYXNzaWdubWVudCcsIGFzc2lnbm1lbnQuYmFzZVR5cGUsICdhbmltJ10sXHJcbiAgICAgICAgICAgICAgICAgICAgICBgPCR7c21hbGxUYWd9JHtsaW5rID8gYCBocmVmPScke2xpbmt9JyBjbGFzcz0nbGlua2VkJyB0YXJnZXQ9J19ibGFuaydgIDogJyd9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz0nZXh0cmEnPiR7c2VwYXJhdGVkWzFdfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtzZXBhcmF0ZWRbMl19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgPC8ke3NtYWxsVGFnfT48c3BhbiBjbGFzcz0ndGl0bGUnPiR7YXNzaWdubWVudC50aXRsZX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9J2hpZGRlbicgY2xhc3M9J2R1ZSdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9JyR7YXNzaWdubWVudC5lbmQgPT09ICdGb3JldmVyJyA/IDAgOiBhc3NpZ25tZW50LmVuZH0nIC8+YCxcclxuICAgICAgICAgICAgICAgICAgICAgIGFzc2lnbm1lbnQuaWQgKyB3ZWVrSWQpXHJcblxyXG4gICAgaWYgKCggcmVmZXJlbmNlICYmIHJlZmVyZW5jZS5kb25lKSB8fCBhc3NpZ25tZW50SW5Eb25lKGFzc2lnbm1lbnQuaWQpKSB7XHJcbiAgICAgICAgZS5jbGFzc0xpc3QuYWRkKCdkb25lJylcclxuICAgIH1cclxuICAgIGUuc2V0QXR0cmlidXRlKCdkYXRhLWNsYXNzJywgYXNzaWdubWVudENsYXNzKGFzc2lnbm1lbnQsIGRhdGEpKVxyXG4gICAgY29uc3QgY2xvc2UgPSBlbGVtZW50KCdhJywgWydjbG9zZScsICdtYXRlcmlhbC1pY29ucyddLCAnY2xvc2UnKVxyXG4gICAgY2xvc2UuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbG9zZU9wZW5lZClcclxuICAgIGUuYXBwZW5kQ2hpbGQoY2xvc2UpXHJcblxyXG4gICAgLy8gUHJldmVudCBjbGlja2luZyB0aGUgY2xhc3MgbmFtZSB3aGVuIGFuIGl0ZW0gaXMgZGlzcGxheWVkIG9uIHRoZSBjYWxlbmRhciBmcm9tIGRvaW5nIGFueXRoaW5nXHJcbiAgICBpZiAobGluayAhPSBudWxsKSB7XHJcbiAgICAgICAgXyQoZS5xdWVyeVNlbGVjdG9yKCdhJykpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2dCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoKGRvY3VtZW50LmJvZHkuZ2V0QXR0cmlidXRlKCdkYXRhLXZpZXcnKSA9PT0gJzAnKSAmJiAhZS5jbGFzc0xpc3QuY29udGFpbnMoJ2Z1bGwnKSkge1xyXG4gICAgICAgICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgY29tcGxldGUgPSBlbGVtZW50KCdhJywgWydjb21wbGV0ZScsICdtYXRlcmlhbC1pY29ucycsICd3YXZlcyddLCAnZG9uZScpXHJcbiAgICByaXBwbGUoY29tcGxldGUpXHJcbiAgICBjb25zdCBpZCA9IHNwbGl0LmFzc2lnbm1lbnQuaWRcclxuICAgIGNvbXBsZXRlLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCAoZXZ0KSA9PiB7XHJcbiAgICAgICAgaWYgKGV2dC53aGljaCA9PT0gMSkgeyAvLyBMZWZ0IGJ1dHRvblxyXG4gICAgICAgICAgICBsZXQgYWRkZWQgPSB0cnVlXHJcbiAgICAgICAgICAgIGlmIChyZWZlcmVuY2UgIT0gbnVsbCkgeyAvLyBUYXNrIGl0ZW1cclxuICAgICAgICAgICAgICAgIGlmIChlLmNsYXNzTGlzdC5jb250YWlucygnZG9uZScpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVmZXJlbmNlLmRvbmUgPSBmYWxzZVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBhZGRlZCA9IGZhbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgcmVmZXJlbmNlLmRvbmUgPSB0cnVlXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBzYXZlRXh0cmEoKVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdkb25lJykpIHtcclxuICAgICAgICAgICAgICAgICAgICByZW1vdmVGcm9tRG9uZShhc3NpZ25tZW50LmlkKVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBhZGRlZCA9IGZhbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgYWRkVG9Eb25lKGFzc2lnbm1lbnQuaWQpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBzYXZlRG9uZSgpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGRvY3VtZW50LmJvZHkuZ2V0QXR0cmlidXRlKCdkYXRhLXZpZXcnKSA9PT0gJzEnKSB7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcclxuICAgICAgICAgICAgICAgICAgICBgLmFzc2lnbm1lbnRbaWRePVxcXCIke2lkfVxcXCJdLCAjdGVzdCR7aWR9LCAjYWN0aXZpdHkke2lkfSwgI2lhJHtpZH1gXHJcbiAgICAgICAgICAgICAgICApLmZvckVhY2goKGVsZW0pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBlbGVtLmNsYXNzTGlzdC50b2dnbGUoJ2RvbmUnKVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIGlmIChhZGRlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYXNzaWdubWVudC5saXN0RGlzcDpub3QoLmRvbmUpJykubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnbm9MaXN0JylcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYXNzaWdubWVudC5saXN0RGlzcDpub3QoLmRvbmUpJykubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnbm9MaXN0JylcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXNpemUoKVxyXG4gICAgICAgICAgICB9LCAxMDApXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcclxuICAgICAgICAgICAgICAgIGAuYXNzaWdubWVudFtpZF49XFxcIiR7aWR9XFxcIl0sICN0ZXN0JHtpZH0sICNhY3Rpdml0eSR7aWR9LCAjaWEke2lkfWBcclxuICAgICAgICAgICAgKS5mb3JFYWNoKChlbGVtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBlbGVtLmNsYXNzTGlzdC50b2dnbGUoJ2RvbmUnKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICBpZiAoYWRkZWQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYXNzaWdubWVudC5saXN0RGlzcDpub3QoLmRvbmUpJykubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdub0xpc3QnKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5hc3NpZ25tZW50Lmxpc3REaXNwOm5vdCguZG9uZSknKS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ25vTGlzdCcpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbiAgICBlLmFwcGVuZENoaWxkKGNvbXBsZXRlKVxyXG5cclxuICAgIC8vIElmIHRoZSBhc3NpZ25tZW50IGlzIGEgY3VzdG9tIG9uZSwgYWRkIGEgYnV0dG9uIHRvIGRlbGV0ZSBpdFxyXG4gICAgaWYgKHNwbGl0LmN1c3RvbSkge1xyXG4gICAgICAgIGNvbnN0IGRlbGV0ZUEgPSBlbGVtZW50KCdhJywgWydtYXRlcmlhbC1pY29ucycsICdkZWxldGVBc3NpZ25tZW50JywgJ3dhdmVzJ10sICdkZWxldGUnKVxyXG4gICAgICAgIHJpcHBsZShkZWxldGVBKVxyXG4gICAgICAgIGRlbGV0ZUEuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIChldnQpID0+IHtcclxuICAgICAgICAgICAgaWYgKGV2dC53aGljaCAhPT0gMSB8fCAhcmVmZXJlbmNlKSByZXR1cm5cclxuICAgICAgICAgICAgcmVtb3ZlRnJvbUV4dHJhKHJlZmVyZW5jZSlcclxuICAgICAgICAgICAgc2F2ZUV4dHJhKClcclxuICAgICAgICAgICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mdWxsJykgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICdhdXRvJ1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYmFjayA9IGVsZW1CeUlkKCdiYWNrZ3JvdW5kJylcclxuICAgICAgICAgICAgICAgIGJhY2suY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGJhY2suc3R5bGUuZGlzcGxheSA9ICdub25lJ1xyXG4gICAgICAgICAgICAgICAgfSwgMzUwKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGUucmVtb3ZlKClcclxuICAgICAgICAgICAgZGlzcGxheShmYWxzZSlcclxuICAgICAgICB9KVxyXG4gICAgICAgIGUuYXBwZW5kQ2hpbGQoZGVsZXRlQSlcclxuICAgIH1cclxuXHJcbiAgICAvLyBNb2RpZmljYXRpb24gYnV0dG9uXHJcbiAgICBjb25zdCBlZGl0ID0gZWxlbWVudCgnYScsIFsnZWRpdEFzc2lnbm1lbnQnLCAnbWF0ZXJpYWwtaWNvbnMnLCAnd2F2ZXMnXSwgJ2VkaXQnKVxyXG4gICAgZWRpdC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgKGV2dCkgPT4ge1xyXG4gICAgICAgIGlmIChldnQud2hpY2ggPT09IDEpIHtcclxuICAgICAgICAgICAgY29uc3QgcmVtb3ZlID0gZWRpdC5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpXHJcbiAgICAgICAgICAgIGVkaXQuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJylcclxuICAgICAgICAgICAgXyQoZS5xdWVyeVNlbGVjdG9yKCcuYm9keScpKS5zZXRBdHRyaWJ1dGUoJ2NvbnRlbnRFZGl0YWJsZScsIHJlbW92ZSA/ICdmYWxzZScgOiAndHJ1ZScpXHJcbiAgICAgICAgICAgIGlmICghcmVtb3ZlKSB7XHJcbiAgICAgICAgICAgICAgICAoZS5xdWVyeVNlbGVjdG9yKCcuYm9keScpIGFzIEhUTUxFbGVtZW50KS5mb2N1cygpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgZG4gPSBlLnF1ZXJ5U2VsZWN0b3IoJy5jb21wbGV0ZScpIGFzIEhUTUxFbGVtZW50XHJcbiAgICAgICAgICAgIGRuLnN0eWxlLmRpc3BsYXkgPSByZW1vdmUgPyAnYmxvY2snIDogJ25vbmUnXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICAgIHJpcHBsZShlZGl0KVxyXG5cclxuICAgIGUuYXBwZW5kQ2hpbGQoZWRpdClcclxuXHJcbiAgICBjb25zdCBzdGFydCA9IG5ldyBEYXRlKGZyb21EYXRlTnVtKGFzc2lnbm1lbnQuc3RhcnQpKVxyXG4gICAgY29uc3QgZW5kID0gYXNzaWdubWVudC5lbmQgPT09ICdGb3JldmVyJyA/IGFzc2lnbm1lbnQuZW5kIDogbmV3IERhdGUoZnJvbURhdGVOdW0oYXNzaWdubWVudC5lbmQpKVxyXG4gICAgY29uc3QgdGltZXMgPSBlbGVtZW50KCdkaXYnLCAncmFuZ2UnLFxyXG4gICAgICAgIGFzc2lnbm1lbnQuc3RhcnQgPT09IGFzc2lnbm1lbnQuZW5kID8gZGF0ZVN0cmluZyhzdGFydCkgOiBgJHtkYXRlU3RyaW5nKHN0YXJ0KX0gJm5kYXNoOyAke2RhdGVTdHJpbmcoZW5kKX1gKVxyXG4gICAgZS5hcHBlbmRDaGlsZCh0aW1lcylcclxuICAgIGlmIChhc3NpZ25tZW50LmF0dGFjaG1lbnRzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBjb25zdCBhdHRhY2htZW50cyA9IGVsZW1lbnQoJ2RpdicsICdhdHRhY2htZW50cycpXHJcbiAgICAgICAgYXNzaWdubWVudC5hdHRhY2htZW50cy5mb3JFYWNoKChhdHRhY2htZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGEgPSBlbGVtZW50KCdhJywgW10sIGF0dGFjaG1lbnRbMF0pIGFzIEhUTUxBbmNob3JFbGVtZW50XHJcbiAgICAgICAgICAgIGEuaHJlZiA9IHVybEZvckF0dGFjaG1lbnQoYXR0YWNobWVudFsxXSlcclxuICAgICAgICAgICAgZ2V0QXR0YWNobWVudE1pbWVUeXBlKGF0dGFjaG1lbnRbMV0pLnRoZW4oKHR5cGUpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBzcGFuXHJcbiAgICAgICAgICAgICAgICBpZiAobWltZVR5cGVzW3R5cGVdICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICBhLmNsYXNzTGlzdC5hZGQobWltZVR5cGVzW3R5cGVdWzFdKVxyXG4gICAgICAgICAgICAgICAgICAgIHNwYW4gPSBlbGVtZW50KCdzcGFuJywgW10sIG1pbWVUeXBlc1t0eXBlXVswXSlcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3BhbiA9IGVsZW1lbnQoJ3NwYW4nLCBbXSwgJ1Vua25vd24gZmlsZSB0eXBlJylcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGEuYXBwZW5kQ2hpbGQoc3BhbilcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgYXR0YWNobWVudHMuYXBwZW5kQ2hpbGQoYSlcclxuICAgICAgICB9KVxyXG4gICAgICAgIGUuYXBwZW5kQ2hpbGQoYXR0YWNobWVudHMpXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgYm9keSA9IGVsZW1lbnQoJ2RpdicsICdib2R5JyxcclxuICAgICAgICBhc3NpZ25tZW50LmJvZHkucmVwbGFjZSgvZm9udC1mYW1pbHk6W147XSo/KD86VGltZXMgTmV3IFJvbWFufHNlcmlmKVteO10qL2csICcnKSlcclxuICAgIGNvbnN0IGVkaXRzID0gZWxlbWVudCgnZGl2JywgJ2VkaXRzJywgJzxzcGFuIGNsYXNzPVxcJ2FkZGl0aW9uc1xcJz48L3NwYW4+PHNwYW4gY2xhc3M9XFwnZGVsZXRpb25zXFwnPjwvc3Bhbj4nKVxyXG4gICAgY29uc3QgbSA9IG1vZGlmaWVkQm9keShhc3NpZ25tZW50LmlkKVxyXG4gICAgaWYgKG0gIT0gbnVsbCkge1xyXG4gICAgICAgIGNvbnN0IGQgPSBkbXAuZGlmZl9tYWluKGFzc2lnbm1lbnQuYm9keSwgbSlcclxuICAgICAgICBkbXAuZGlmZl9jbGVhbnVwU2VtYW50aWMoZClcclxuICAgICAgICBpZiAoZC5sZW5ndGggIT09IDApIHsgLy8gSGFzIGJlZW4gZWRpdGVkXHJcbiAgICAgICAgICAgIHBvcHVsYXRlQWRkZWREZWxldGVkKGQsIGVkaXRzKVxyXG4gICAgICAgICAgICBib2R5LmlubmVySFRNTCA9IG1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYm9keS5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIChldnQpID0+IHtcclxuICAgICAgICBpZiAocmVmZXJlbmNlICE9IG51bGwpIHtcclxuICAgICAgICAgICAgcmVmZXJlbmNlLmJvZHkgPSBib2R5LmlubmVySFRNTFxyXG4gICAgICAgICAgICBzYXZlRXh0cmEoKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHNldE1vZGlmaWVkKGFzc2lnbm1lbnQuaWQsICBib2R5LmlubmVySFRNTClcclxuICAgICAgICAgICAgc2F2ZU1vZGlmaWVkKClcclxuICAgICAgICAgICAgY29uc3QgZCA9IGRtcC5kaWZmX21haW4oYXNzaWdubWVudC5ib2R5LCBib2R5LmlubmVySFRNTClcclxuICAgICAgICAgICAgZG1wLmRpZmZfY2xlYW51cFNlbWFudGljKGQpXHJcbiAgICAgICAgICAgIGlmIChwb3B1bGF0ZUFkZGVkRGVsZXRlZChkLCBlZGl0cykpIHtcclxuICAgICAgICAgICAgICAgIGVkaXRzLmNsYXNzTGlzdC5hZGQoJ25vdEVtcHR5JylcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGVkaXRzLmNsYXNzTGlzdC5yZW1vdmUoJ25vdEVtcHR5JylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZG9jdW1lbnQuYm9keS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmlldycpID09PSAnMScpIHJlc2l6ZSgpXHJcbiAgICB9KVxyXG5cclxuICAgIGUuYXBwZW5kQ2hpbGQoYm9keSlcclxuXHJcbiAgICBjb25zdCByZXN0b3JlID0gZWxlbWVudCgnYScsIFsnbWF0ZXJpYWwtaWNvbnMnLCAncmVzdG9yZSddLCAnc2V0dGluZ3NfYmFja3VwX3Jlc3RvcmUnKVxyXG4gICAgcmVzdG9yZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICByZW1vdmVGcm9tTW9kaWZpZWQoYXNzaWdubWVudC5pZClcclxuICAgICAgICBzYXZlTW9kaWZpZWQoKVxyXG4gICAgICAgIGJvZHkuaW5uZXJIVE1MID0gYXNzaWdubWVudC5ib2R5XHJcbiAgICAgICAgZWRpdHMuY2xhc3NMaXN0LnJlbW92ZSgnbm90RW1wdHknKVxyXG4gICAgICAgIGlmIChkb2N1bWVudC5ib2R5LmdldEF0dHJpYnV0ZSgnZGF0YS12aWV3JykgPT09ICcxJykgIHJlc2l6ZSgpXHJcbiAgICB9KVxyXG4gICAgZWRpdHMuYXBwZW5kQ2hpbGQocmVzdG9yZSlcclxuICAgIGUuYXBwZW5kQ2hpbGQoZWRpdHMpXHJcblxyXG4gICAgY29uc3QgbW9kcyA9IGVsZW1lbnQoJ2RpdicsIFsnbW9kcyddKVxyXG4gICAgcmVjZW50QWN0aXZpdHkoKS5mb3JFYWNoKChhKSA9PiB7XHJcbiAgICAgICAgaWYgKChhWzBdID09PSAnZWRpdCcpICYmIChhWzFdLmlkID09PSBhc3NpZ25tZW50LmlkKSkge1xyXG4gICAgICAgIGNvbnN0IHRlID0gZWxlbWVudCgnZGl2JywgWydpbm5lckFjdGl2aXR5JywgJ2Fzc2lnbm1lbnRJdGVtJywgYXNzaWdubWVudC5iYXNlVHlwZV0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGA8aSBjbGFzcz0nbWF0ZXJpYWwtaWNvbnMnPmVkaXQ8L2k+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz0ndGl0bGUnPiR7ZGF0ZVN0cmluZyhuZXcgRGF0ZShhWzJdKSl9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9J2FkZGl0aW9ucyc+PC9zcGFuPjxzcGFuIGNsYXNzPSdkZWxldGlvbnMnPjwvc3Bhbj5gLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBgaWEke2Fzc2lnbm1lbnQuaWR9YClcclxuICAgICAgICBjb25zdCBkID0gZG1wLmRpZmZfbWFpbihhWzFdLmJvZHksIGFzc2lnbm1lbnQuYm9keSlcclxuICAgICAgICBkbXAuZGlmZl9jbGVhbnVwU2VtYW50aWMoZClcclxuICAgICAgICBwb3B1bGF0ZUFkZGVkRGVsZXRlZChkLCB0ZSlcclxuXHJcbiAgICAgICAgaWYgKGFzc2lnbm1lbnQuY2xhc3MpIHRlLnNldEF0dHJpYnV0ZSgnZGF0YS1jbGFzcycsIGRhdGEuY2xhc3Nlc1thc3NpZ25tZW50LmNsYXNzXSlcclxuICAgICAgICB0ZS5hcHBlbmRDaGlsZChlbGVtZW50KCdkaXYnLCAnaWFEaWZmJywgZG1wLmRpZmZfcHJldHR5SHRtbChkKSkpXHJcbiAgICAgICAgdGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRlLmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScpXHJcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5ib2R5LmdldEF0dHJpYnV0ZSgnZGF0YS12aWV3JykgPT09ICcxJykgcmVzaXplKClcclxuICAgICAgICB9KVxyXG4gICAgICAgIG1vZHMuYXBwZW5kQ2hpbGQodGUpXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICAgIGUuYXBwZW5kQ2hpbGQobW9kcylcclxuXHJcbiAgICBpZiAoc2V0dGluZ3MuYXNzaWdubWVudFNwYW4gPT09ICdtdWx0aXBsZScgJiYgKHN0YXJ0IDwgc3BsaXQuc3RhcnQpKSB7XHJcbiAgICAgICAgZS5jbGFzc0xpc3QuYWRkKCdmcm9tV2Vla2VuZCcpXHJcbiAgICB9XHJcbiAgICBpZiAoc2V0dGluZ3MuYXNzaWdubWVudFNwYW4gPT09ICdtdWx0aXBsZScgJiYgKGVuZCA+IHNwbGl0LmVuZCkpIHtcclxuICAgICAgICBlLmNsYXNzTGlzdC5hZGQoJ292ZXJXZWVrZW5kJylcclxuICAgIH1cclxuICAgIGUuY2xhc3NMaXN0LmFkZChgcyR7c3BsaXQuc3RhcnQuZ2V0RGF5KCl9YClcclxuICAgIGlmIChzcGxpdC5lbmQgIT09ICdGb3JldmVyJykgZS5jbGFzc0xpc3QuYWRkKGBlJHs2IC0gc3BsaXQuZW5kLmdldERheSgpfWApXHJcblxyXG4gICAgY29uc3Qgc3QgPSBNYXRoLmZsb29yKHNwbGl0LnN0YXJ0LmdldFRpbWUoKSAvIDEwMDAgLyAzNjAwIC8gMjQpXHJcbiAgICBpZiAoc3BsaXQuYXNzaWdubWVudC5lbmQgPT09ICdGb3JldmVyJykge1xyXG4gICAgICAgIGlmIChzdCA8PSAodG9kYXkoKSArIGdldExpc3REYXRlT2Zmc2V0KCkpKSB7XHJcbiAgICAgICAgICAgIGUuY2xhc3NMaXN0LmFkZCgnbGlzdERpc3AnKVxyXG4gICAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc3QgbWlkRGF0ZSA9IG5ldyBEYXRlKClcclxuICAgICAgICBtaWREYXRlLnNldERhdGUobWlkRGF0ZS5nZXREYXRlKCkgKyBnZXRMaXN0RGF0ZU9mZnNldCgpKVxyXG4gICAgICAgIGNvbnN0IHB1c2ggPSAoYXNzaWdubWVudC5iYXNlVHlwZSA9PT0gJ3Rlc3QnICYmIGFzc2lnbm1lbnQuc3RhcnQgPT09IHN0KSA/IHNldHRpbmdzLmVhcmx5VGVzdCA6IDBcclxuICAgICAgICBjb25zdCBlbmRFeHRyYSA9IGdldExpc3REYXRlT2Zmc2V0KCkgPT09IDAgPyBnZXRUaW1lQWZ0ZXIobWlkRGF0ZSkgOiAyNCAqIDM2MDAgKiAxMDAwXHJcbiAgICAgICAgaWYgKGZyb21EYXRlTnVtKHN0IC0gcHVzaCkgPD0gbWlkRGF0ZSAmJlxyXG4gICAgICAgICAgICAoc3BsaXQuZW5kID09PSAnRm9yZXZlcicgfHwgbWlkRGF0ZS5nZXRUaW1lKCkgPD0gc3BsaXQuZW5kLmdldFRpbWUoKSArIGVuZEV4dHJhKSkge1xyXG4gICAgICAgICAgICBlLmNsYXNzTGlzdC5hZGQoJ2xpc3REaXNwJylcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQWRkIGNsaWNrIGludGVyYWN0aXZpdHlcclxuICAgIGlmICghc3BsaXQuY3VzdG9tIHx8ICFzZXR0aW5ncy5zZXBUYXNrcykge1xyXG4gICAgICAgIGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZ0KSA9PiB7XHJcbiAgICAgICAgICAgIGlmICgoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnZnVsbCcpLmxlbmd0aCA9PT0gMCkgJiZcclxuICAgICAgICAgICAgICAgIChkb2N1bWVudC5ib2R5LmdldEF0dHJpYnV0ZSgnZGF0YS12aWV3JykgPT09ICcwJykpIHtcclxuICAgICAgICAgICAgICAgIGUuY2xhc3NMaXN0LnJlbW92ZSgnYW5pbScpXHJcbiAgICAgICAgICAgICAgICBlLmNsYXNzTGlzdC5hZGQoJ21vZGlmeScpXHJcbiAgICAgICAgICAgICAgICBlLnN0eWxlLnRvcCA9IChlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCAtIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAtIGNzc051bWJlcihlLnN0eWxlLm1hcmdpblRvcCkpICsgNDQgKyAncHgnXHJcbiAgICAgICAgICAgICAgICBlLnNldEF0dHJpYnV0ZSgnZGF0YS10b3AnLCBlLnN0eWxlLnRvcClcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJ1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYmFjayA9IGVsZW1CeUlkKCdiYWNrZ3JvdW5kJylcclxuICAgICAgICAgICAgICAgIGJhY2suY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuICAgICAgICAgICAgICAgIGJhY2suc3R5bGUuZGlzcGxheSA9ICdibG9jaydcclxuICAgICAgICAgICAgICAgIGUuY2xhc3NMaXN0LmFkZCgnYW5pbScpXHJcbiAgICAgICAgICAgICAgICBmb3JjZUxheW91dChlKVxyXG4gICAgICAgICAgICAgICAgZS5jbGFzc0xpc3QuYWRkKCdmdWxsJylcclxuICAgICAgICAgICAgICAgIGUuc3R5bGUudG9wID0gKDc1IC0gY3NzTnVtYmVyKGUuc3R5bGUubWFyZ2luVG9wKSkgKyAncHgnXHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IGUuY2xhc3NMaXN0LnJlbW92ZSgnYW5pbScpLCAzNTApXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBlXHJcbn1cclxuXHJcbi8vIEluIG9yZGVyIHRvIGRpc3BsYXkgYW4gYXNzaWdubWVudCBpbiB0aGUgY29ycmVjdCBYIHBvc2l0aW9uLCBjbGFzc2VzIHdpdGggbmFtZXMgZVggYW5kIGVYIGFyZVxyXG4vLyB1c2VkLCB3aGVyZSBYIGlzIHRoZSBudW1iZXIgb2Ygc3F1YXJlcyB0byBmcm9tIHRoZSBhc3NpZ25tZW50IHRvIHRoZSBsZWZ0L3JpZ2h0IHNpZGUgb2YgdGhlXHJcbi8vIHNjcmVlbi4gVGhlIGZ1bmN0aW9uIGJlbG93IGRldGVybWluZXMgd2hpY2ggZVggYW5kIHNYIGNsYXNzIHRoZSBnaXZlbiBlbGVtZW50IGhhcy5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldEVTKGVsOiBIVE1MRWxlbWVudCk6IFtzdHJpbmcsIHN0cmluZ10ge1xyXG4gICAgbGV0IGUgPSAwXHJcbiAgICBsZXQgcyA9IDBcclxuXHJcbiAgICBBcnJheS5mcm9tKG5ldyBBcnJheSg3KSwgKF8sIHgpID0+IHgpLmZvckVhY2goKHgpID0+IHtcclxuICAgICAgICBpZiAoZWwuY2xhc3NMaXN0LmNvbnRhaW5zKGBlJHt4fWApKSB7XHJcbiAgICAgICAgICAgIGUgPSB4XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChlbC5jbGFzc0xpc3QuY29udGFpbnMoYHMke3h9YCkpIHtcclxuICAgICAgICAgICAgcyA9IHhcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICAgcmV0dXJuIFtgZSR7ZX1gLCBgcyR7c31gXVxyXG59XHJcblxyXG4vLyBCZWxvdyBpcyBhIGZ1bmN0aW9uIHRvIGNsb3NlIHRoZSBjdXJyZW50IGFzc2lnbm1lbnQgdGhhdCBpcyBvcGVuZWQuXHJcbmV4cG9ydCBmdW5jdGlvbiBjbG9zZU9wZW5lZChldnQ6IEV2ZW50KTogdm9pZCB7XHJcbiAgICBldnQuc3RvcFByb3BhZ2F0aW9uKClcclxuICAgIGNvbnN0IGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZ1bGwnKSBhcyBIVE1MRWxlbWVudHxudWxsXHJcbiAgICBpZiAoZWwgPT0gbnVsbCkgcmV0dXJuXHJcblxyXG4gICAgZWwuc3R5bGUudG9wID0gZWwuZ2V0QXR0cmlidXRlKCdkYXRhLXRvcCcpXHJcbiAgICBlbC5jbGFzc0xpc3QuYWRkKCdhbmltJylcclxuICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2Z1bGwnKVxyXG4gICAgZWwuc2Nyb2xsVG9wID0gMFxyXG4gICAgZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICdhdXRvJ1xyXG4gICAgY29uc3QgYmFjayA9IGVsZW1CeUlkKCdiYWNrZ3JvdW5kJylcclxuICAgIGJhY2suY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIGJhY2suc3R5bGUuZGlzcGxheSA9ICdub25lJ1xyXG4gICAgICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2FuaW0nKVxyXG4gICAgICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoJ21vZGlmeScpXHJcbiAgICAgICAgZWwuc3R5bGUudG9wID0gJ2F1dG8nXHJcbiAgICAgICAgZm9yY2VMYXlvdXQoZWwpXHJcbiAgICAgICAgZWwuY2xhc3NMaXN0LmFkZCgnYW5pbScpXHJcbiAgICB9LCAxMDAwKVxyXG59XHJcbiIsImltcG9ydCB7IGVsZW1CeUlkLCBsb2NhbFN0b3JhZ2VSZWFkIH0gZnJvbSAnLi4vdXRpbCdcclxuXHJcbi8vIFRoZW4sIHRoZSB1c2VybmFtZSBpbiB0aGUgc2lkZWJhciBuZWVkcyB0byBiZSBzZXQgYW5kIHdlIG5lZWQgdG8gZ2VuZXJhdGUgYW4gXCJhdmF0YXJcIiBiYXNlZCBvblxyXG4vLyBpbml0aWFscy4gVG8gZG8gdGhhdCwgc29tZSBjb2RlIHRvIGNvbnZlcnQgZnJvbSBMQUIgdG8gUkdCIGNvbG9ycyBpcyBib3Jyb3dlZCBmcm9tXHJcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9ib3JvbmluZS9jb2xvcnNwYWNlcy5qc1xyXG4vL1xyXG4vLyBMQUIgaXMgYSBjb2xvciBuYW1pbmcgc2NoZW1lIHRoYXQgdXNlcyB0d28gdmFsdWVzIChBIGFuZCBCKSBhbG9uZyB3aXRoIGEgbGlnaHRuZXNzIHZhbHVlIGluIG9yZGVyXHJcbi8vIHRvIHByb2R1Y2UgY29sb3JzIHRoYXQgYXJlIGVxdWFsbHkgc3BhY2VkIGJldHdlZW4gYWxsIG9mIHRoZSBjb2xvcnMgdGhhdCBjYW4gYmUgc2VlbiBieSB0aGUgaHVtYW5cclxuLy8gZXllLiBUaGlzIHdvcmtzIGdyZWF0IGJlY2F1c2UgZXZlcnlvbmUgaGFzIGxldHRlcnMgaW4gaGlzL2hlciBpbml0aWFscy5cclxuXHJcbi8vIFRoZSBENjUgc3RhbmRhcmQgaWxsdW1pbmFudFxyXG5jb25zdCBSRUZfWCA9IDAuOTUwNDdcclxuY29uc3QgUkVGX1kgPSAxLjAwMDAwXHJcbmNvbnN0IFJFRl9aID0gMS4wODg4M1xyXG5cclxuLy8gQ0lFIEwqYSpiKiBjb25zdGFudHNcclxuY29uc3QgTEFCX0UgPSAwLjAwODg1NlxyXG5jb25zdCBMQUJfSyA9IDkwMy4zXHJcblxyXG5jb25zdCBNID0gW1xyXG4gICAgWzMuMjQwNiwgLTEuNTM3MiwgLTAuNDk4Nl0sXHJcbiAgICBbLTAuOTY4OSwgMS44NzU4LCAgMC4wNDE1XSxcclxuICAgIFswLjA1NTcsIC0wLjIwNDAsICAxLjA1NzBdXHJcbl1cclxuXHJcbmNvbnN0IGZJbnYgPSAodDogbnVtYmVyKSA9PiB7XHJcbiAgICBpZiAoTWF0aC5wb3codCwgMykgPiBMQUJfRSkge1xyXG4gICAgcmV0dXJuIE1hdGgucG93KHQsIDMpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuICgoMTE2ICogdCkgLSAxNikgLyBMQUJfS1xyXG4gICAgfVxyXG59XHJcbmNvbnN0IGRvdFByb2R1Y3QgPSAoYTogbnVtYmVyW10sIGI6IG51bWJlcltdKSA9PiB7XHJcbiAgICBsZXQgcmV0ID0gMFxyXG4gICAgYS5mb3JFYWNoKChfLCBpKSA9PiB7XHJcbiAgICAgICAgcmV0ICs9IGFbaV0gKiBiW2ldXHJcbiAgICB9KVxyXG4gICAgcmV0dXJuIHJldFxyXG59XHJcbmNvbnN0IGZyb21MaW5lYXIgPSAoYzogbnVtYmVyKSA9PiB7XHJcbiAgICBjb25zdCBhID0gMC4wNTVcclxuICAgIGlmIChjIDw9IDAuMDAzMTMwOCkge1xyXG4gICAgICAgIHJldHVybiAxMi45MiAqIGNcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuICgxLjA1NSAqIE1hdGgucG93KGMsIDEgLyAyLjQpKSAtIDAuMDU1XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxhYnJnYihsOiBudW1iZXIsIGE6IG51bWJlciwgYjogbnVtYmVyKTogc3RyaW5nIHtcclxuICAgIGNvbnN0IHZhclkgPSAobCArIDE2KSAvIDExNlxyXG4gICAgY29uc3QgdmFyWiA9IHZhclkgLSAoYiAvIDIwMClcclxuICAgIGNvbnN0IHZhclggPSAoYSAvIDUwMCkgKyB2YXJZXHJcbiAgICBjb25zdCBfWCA9IFJFRl9YICogZkludih2YXJYKVxyXG4gICAgY29uc3QgX1kgPSBSRUZfWSAqIGZJbnYodmFyWSlcclxuICAgIGNvbnN0IF9aID0gUkVGX1ogKiBmSW52KHZhclopXHJcblxyXG4gICAgY29uc3QgdHVwbGUgPSBbX1gsIF9ZLCBfWl1cclxuXHJcbiAgICBjb25zdCBfUiA9IGZyb21MaW5lYXIoZG90UHJvZHVjdChNWzBdLCB0dXBsZSkpXHJcbiAgICBjb25zdCBfRyA9IGZyb21MaW5lYXIoZG90UHJvZHVjdChNWzFdLCB0dXBsZSkpXHJcbiAgICBjb25zdCBfQiA9IGZyb21MaW5lYXIoZG90UHJvZHVjdChNWzJdLCB0dXBsZSkpXHJcblxyXG4gICAgLy8gT3JpZ2luYWwgZnJvbSBoZXJlXHJcbiAgICBjb25zdCBuID0gKHY6IG51bWJlcikgPT4gTWF0aC5yb3VuZChNYXRoLm1heChNYXRoLm1pbih2ICogMjU2LCAyNTUpLCAwKSlcclxuICAgIHJldHVybiBgcmdiKCR7bihfUil9LCAke24oX0cpfSwgJHtuKF9CKX0pYFxyXG59XHJcblxyXG4vKipcclxuICogQ29udmVydCBhIGxldHRlciB0byBhIGZsb2F0IHZhbHVlZCBmcm9tIDAgdG8gMjU1XHJcbiAqL1xyXG5mdW5jdGlvbiBsZXR0ZXJUb0NvbG9yVmFsKGxldHRlcjogc3RyaW5nKTogbnVtYmVyIHtcclxuICAgIHJldHVybiAoKChsZXR0ZXIuY2hhckNvZGVBdCgwKSAtIDY1KSAvIDI2KSAqIDI1NikgLSAxMjhcclxufVxyXG5cclxuLy8gVGhlIGZ1bmN0aW9uIGJlbG93IHVzZXMgdGhpcyBhbGdvcml0aG0gdG8gZ2VuZXJhdGUgYSBiYWNrZ3JvdW5kIGNvbG9yIGZvciB0aGUgaW5pdGlhbHMgZGlzcGxheWVkIGluIHRoZSBzaWRlYmFyLlxyXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlQXZhdGFyKCk6IHZvaWQge1xyXG4gICAgaWYgKCFsb2NhbFN0b3JhZ2VSZWFkKCd1c2VybmFtZScpKSByZXR1cm5cclxuICAgIGNvbnN0IHVzZXJFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd1c2VyJylcclxuICAgIGNvbnN0IGluaXRpYWxzRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW5pdGlhbHMnKVxyXG4gICAgaWYgKCF1c2VyRWwgfHwgIWluaXRpYWxzRWwpIHJldHVyblxyXG5cclxuICAgIHVzZXJFbC5pbm5lckhUTUwgPSBsb2NhbFN0b3JhZ2VSZWFkKCd1c2VybmFtZScpXHJcbiAgICBjb25zdCBpbml0aWFscyA9IGxvY2FsU3RvcmFnZVJlYWQoJ3VzZXJuYW1lJykubWF0Y2goL1xcZCooLikuKj8oLiQpLykgLy8gU2VwYXJhdGUgeWVhciBmcm9tIGZpcnN0IG5hbWUgYW5kIGluaXRpYWxcclxuICAgIGlmIChpbml0aWFscyAhPSBudWxsKSB7XHJcbiAgICAgICAgY29uc3QgYmcgPSBsYWJyZ2IoNTAsIGxldHRlclRvQ29sb3JWYWwoaW5pdGlhbHNbMV0pLCBsZXR0ZXJUb0NvbG9yVmFsKGluaXRpYWxzWzJdKSkgLy8gQ29tcHV0ZSB0aGUgY29sb3JcclxuICAgICAgICBpbml0aWFsc0VsLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGJnXHJcbiAgICAgICAgaW5pdGlhbHNFbC5pbm5lckhUTUwgPSBpbml0aWFsc1sxXSArIGluaXRpYWxzWzJdXHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgdG9kYXkgfSBmcm9tICcuLi9kYXRlcydcclxuaW1wb3J0IHsgZWxlbWVudCB9IGZyb20gJy4uL3V0aWwnXHJcblxyXG5jb25zdCBNT05USFMgPSBbJ0phbicsICdGZWInLCAnTWFyJywgJ0FwcicsICdNYXknLCAnSnVuJywgJ0p1bCcsICdBdWcnLCAnU2VwJywgJ09jdCcsICdOb3YnLCAnRGVjJ11cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVXZWVrKGlkOiBzdHJpbmcpOiBIVE1MRWxlbWVudCB7XHJcbiAgICBjb25zdCB3ayA9IGVsZW1lbnQoJ3NlY3Rpb24nLCAnd2VlaycsIG51bGwsIGlkKVxyXG4gICAgY29uc3QgZGF5VGFibGUgPSBlbGVtZW50KCd0YWJsZScsICdkYXlUYWJsZScpIGFzIEhUTUxUYWJsZUVsZW1lbnRcclxuICAgIGNvbnN0IHRyID0gZGF5VGFibGUuaW5zZXJ0Um93KClcclxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZSBuby1sb29wc1xyXG4gICAgZm9yIChsZXQgZGF5ID0gMDsgZGF5IDwgNzsgZGF5KyspIHRyLmluc2VydENlbGwoKVxyXG4gICAgd2suYXBwZW5kQ2hpbGQoZGF5VGFibGUpXHJcblxyXG4gICAgcmV0dXJuIHdrXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVEYXkoZDogRGF0ZSk6IEhUTUxFbGVtZW50IHtcclxuICAgIGNvbnN0IGRheSA9IGVsZW1lbnQoJ2RpdicsICdkYXknLCBudWxsLCAnZGF5JylcclxuICAgIGRheS5zZXRBdHRyaWJ1dGUoJ2RhdGEtZGF0ZScsIFN0cmluZyhkLmdldFRpbWUoKSkpXHJcbiAgICBpZiAoTWF0aC5mbG9vcigoZC5nZXRUaW1lKCkgLSBkLmdldFRpbWV6b25lT2Zmc2V0KCkpIC8gMTAwMCAvIDM2MDAgLyAyNCkgPT09IHRvZGF5KCkpIHtcclxuICAgICAgZGF5LmNsYXNzTGlzdC5hZGQoJ3RvZGF5JylcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBtb250aCA9IGVsZW1lbnQoJ3NwYW4nLCAnbW9udGgnLCBNT05USFNbZC5nZXRNb250aCgpXSlcclxuICAgIGRheS5hcHBlbmRDaGlsZChtb250aClcclxuXHJcbiAgICBjb25zdCBkYXRlID0gZWxlbWVudCgnc3BhbicsICdkYXRlJywgU3RyaW5nKGQuZ2V0RGF0ZSgpKSlcclxuICAgIGRheS5hcHBlbmRDaGlsZChkYXRlKVxyXG5cclxuICAgIHJldHVybiBkYXlcclxufVxyXG4iLCJpbXBvcnQgeyBnZXRDbGFzc2VzLCBnZXREYXRhIH0gZnJvbSAnLi4vcGNyJ1xyXG5pbXBvcnQgeyBfJCwgY2FwaXRhbGl6ZVN0cmluZywgZWxlbUJ5SWQsIGVsZW1lbnQgfSBmcm9tICcuLi91dGlsJ1xyXG5cclxuLy8gV2hlbiBhbnl0aGluZyBpcyB0eXBlZCwgdGhlIHNlYXJjaCBzdWdnZXN0aW9ucyBuZWVkIHRvIGJlIHVwZGF0ZWQuXHJcbmNvbnN0IFRJUF9OQU1FUyA9IHtcclxuICAgIGZvcjogWydmb3InXSxcclxuICAgIGJ5OiBbJ2J5JywgJ2R1ZScsICdlbmRpbmcnXSxcclxuICAgIHN0YXJ0aW5nOiBbJ3N0YXJ0aW5nJywgJ2JlZ2lubmluZycsICdhc3NpZ25lZCddXHJcbn1cclxuXHJcbmNvbnN0IG5ld1RleHQgPSBlbGVtQnlJZCgnbmV3VGV4dCcpIGFzIEhUTUxJbnB1dEVsZW1lbnRcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVOZXdUaXBzKHZhbDogc3RyaW5nLCBzY3JvbGw6IGJvb2xlYW4gPSB0cnVlKTogdm9pZCB7XHJcbiAgICBpZiAoc2Nyb2xsKSB7XHJcbiAgICAgICAgZWxlbUJ5SWQoJ25ld1RpcHMnKS5zY3JvbGxUb3AgPSAwXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qgc3BhY2VJbmRleCA9IHZhbC5sYXN0SW5kZXhPZignICcpXHJcbiAgICBpZiAoc3BhY2VJbmRleCAhPT0gLTEpIHtcclxuICAgICAgICBjb25zdCBiZWZvcmVTcGFjZSA9IHZhbC5sYXN0SW5kZXhPZignICcsIHNwYWNlSW5kZXggLSAxKVxyXG4gICAgICAgIGNvbnN0IGJlZm9yZSA9IHZhbC5zdWJzdHJpbmcoKGJlZm9yZVNwYWNlID09PSAtMSA/IDAgOiBiZWZvcmVTcGFjZSArIDEpLCBzcGFjZUluZGV4KVxyXG4gICAgICAgIE9iamVjdC5lbnRyaWVzKFRJUF9OQU1FUykuZm9yRWFjaCgoW25hbWUsIHBvc3NpYmxlXSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAocG9zc2libGUuaW5kZXhPZihiZWZvcmUpICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG5hbWUgPT09ICdmb3InKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmtleXMoVElQX05BTUVTKS5mb3JFYWNoKCh0aXBOYW1lKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1CeUlkKGB0aXAke3RpcE5hbWV9YCkuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIGdldENsYXNzZXMoKS5mb3JFYWNoKChjbHMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaWQgPSBgdGlwY2xhc3Mke2Nscy5yZXBsYWNlKC9cXFcvLCAnJyl9YFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3BhY2VJbmRleCA9PT0gKHZhbC5sZW5ndGggLSAxKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IGVsZW1lbnQoJ2RpdicsIFsnY2xhc3NUaXAnLCAnYWN0aXZlJywgJ3RpcCddLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgPGkgY2xhc3M9J21hdGVyaWFsLWljb25zJz5jbGFzczwvaT48c3BhbiBjbGFzcz0ndHlwZWQnPiR7Y2xzfTwvc3Bhbj5gLCBpZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aXBDb21wbGV0ZShjbHMpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1CeUlkKCduZXdUaXBzJykuYXBwZW5kQ2hpbGQoY29udGFpbmVyKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbUJ5SWQoaWQpLmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xzLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXModmFsLnRvTG93ZXJDYXNlKCkuc3Vic3RyKHNwYWNlSW5kZXggKyAxKSkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY2xhc3NUaXAnKS5mb3JFYWNoKChlbCkgPT4ge1xyXG4gICAgICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgICB9KVxyXG4gICAgaWYgKCh2YWwgPT09ICcnKSB8fCAodmFsLmNoYXJBdCh2YWwubGVuZ3RoIC0gMSkgPT09ICcgJykpIHtcclxuICAgICAgICB1cGRhdGVUaXAoJ2ZvcicsICdmb3InLCBmYWxzZSlcclxuICAgICAgICB1cGRhdGVUaXAoJ2J5JywgJ2J5JywgZmFsc2UpXHJcbiAgICAgICAgdXBkYXRlVGlwKCdzdGFydGluZycsICdzdGFydGluZycsIGZhbHNlKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zdCBsYXN0U3BhY2UgPSB2YWwubGFzdEluZGV4T2YoJyAnKVxyXG4gICAgICAgIGxldCBsYXN0V29yZCA9IGxhc3RTcGFjZSA9PT0gLTEgPyB2YWwgOiB2YWwuc3Vic3RyKGxhc3RTcGFjZSArIDEpXHJcbiAgICAgICAgY29uc3QgdXBwZXJjYXNlID0gbGFzdFdvcmQuY2hhckF0KDApID09PSBsYXN0V29yZC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKVxyXG4gICAgICAgIGxhc3RXb3JkID0gbGFzdFdvcmQudG9Mb3dlckNhc2UoKVxyXG4gICAgICAgIE9iamVjdC5lbnRyaWVzKFRJUF9OQU1FUykuZm9yRWFjaCgoW25hbWUsIHBvc3NpYmxlXSkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgZm91bmQ6IHN0cmluZ3xudWxsID0gbnVsbFxyXG4gICAgICAgICAgICBwb3NzaWJsZS5mb3JFYWNoKChwKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAocC5zbGljZSgwLCBsYXN0V29yZC5sZW5ndGgpID09PSBsYXN0V29yZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvdW5kID0gcFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICBpZiAoZm91bmQpIHtcclxuICAgICAgICAgICAgICAgIHVwZGF0ZVRpcChuYW1lLCBmb3VuZCwgdXBwZXJjYXNlKVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZWxlbUJ5SWQoYHRpcCR7bmFtZX1gKS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gdXBkYXRlVGlwKG5hbWU6IHN0cmluZywgdHlwZWQ6IHN0cmluZywgY2FwaXRhbGl6ZTogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgaWYgKG5hbWUgIT09ICdmb3InICYmIG5hbWUgIT09ICdieScgJiYgbmFtZSAhPT0gJ3N0YXJ0aW5nJykge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCB0aXAgbmFtZScpXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZWwgPSBlbGVtQnlJZChgdGlwJHtuYW1lfWApXHJcbiAgICBlbC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG4gICAgXyQoZWwucXVlcnlTZWxlY3RvcignLnR5cGVkJykpLmlubmVySFRNTCA9IChjYXBpdGFsaXplID8gY2FwaXRhbGl6ZVN0cmluZyh0eXBlZCkgOiB0eXBlZCkgKyAnLi4uJ1xyXG4gICAgY29uc3QgbmV3TmFtZXM6IHN0cmluZ1tdID0gW11cclxuICAgIFRJUF9OQU1FU1tuYW1lXS5mb3JFYWNoKChuKSA9PiB7XHJcbiAgICAgICAgaWYgKG4gIT09IHR5cGVkKSB7IG5ld05hbWVzLnB1c2goYDxiPiR7bn08L2I+YCkgfVxyXG4gICAgfSlcclxuICAgIF8kKGVsLnF1ZXJ5U2VsZWN0b3IoJy5vdGhlcnMnKSkuaW5uZXJIVE1MID0gbmV3TmFtZXMubGVuZ3RoID4gMCA/IGBZb3UgY2FuIGFsc28gdXNlICR7bmV3TmFtZXMuam9pbignIG9yICcpfWAgOiAnJ1xyXG59XHJcblxyXG5mdW5jdGlvbiB0aXBDb21wbGV0ZShhdXRvY29tcGxldGU6IHN0cmluZyk6IChldnQ6IEV2ZW50KSA9PiB2b2lkIHtcclxuICAgIHJldHVybiAoZXZ0OiBFdmVudCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHZhbCA9IG5ld1RleHQudmFsdWVcclxuICAgICAgICBjb25zdCBsYXN0U3BhY2UgPSB2YWwubGFzdEluZGV4T2YoJyAnKVxyXG4gICAgICAgIGNvbnN0IGxhc3RXb3JkID0gbGFzdFNwYWNlID09PSAtMSA/IDAgOiBsYXN0U3BhY2UgKyAxXHJcbiAgICAgICAgdXBkYXRlTmV3VGlwcyhuZXdUZXh0LnZhbHVlID0gdmFsLnN1YnN0cmluZygwLCBsYXN0V29yZCkgKyBhdXRvY29tcGxldGUgKyAnICcpXHJcbiAgICAgICAgcmV0dXJuIG5ld1RleHQuZm9jdXMoKVxyXG4gICAgfVxyXG59XHJcblxyXG4vLyBUaGUgZXZlbnQgbGlzdGVuZXIgaXMgdGhlbiBhZGRlZCB0byB0aGUgcHJlZXhpc3RpbmcgdGlwcy5cclxuZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRpcCcpLmZvckVhY2goKHRpcCkgPT4ge1xyXG4gICAgdGlwLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGlwQ29tcGxldGUoXyQodGlwLnF1ZXJ5U2VsZWN0b3IoJy50eXBlZCcpKS5pbm5lckhUTUwpKVxyXG59KVxyXG4iLCJpbXBvcnQgeyBWRVJTSU9OIH0gZnJvbSAnLi4vYXBwJ1xyXG5pbXBvcnQgeyBlbGVtQnlJZCB9IGZyb20gJy4uL3V0aWwnXHJcblxyXG5jb25zdCBFUlJPUl9GT1JNX1VSTCA9ICdodHRwczovL2RvY3MuZ29vZ2xlLmNvbS9hL3N0dWRlbnRzLmhhcmtlci5vcmcvZm9ybXMvZC8nXHJcbiAgICAgICAgICAgICAgICAgICAgICsgJzFzYTJnVXRZRlBkS1Q1WUVOWElFWWF1eVJQdWNxc1FDVmFRQVBlRjNiWjRRL3ZpZXdmb3JtJ1xyXG5jb25zdCBFUlJPUl9GT1JNX0VOVFJZID0gJz9lbnRyeS4xMjAwMzYyMjM9J1xyXG5jb25zdCBFUlJPUl9HSVRIVUJfVVJMID0gJ2h0dHBzOi8vZ2l0aHViLmNvbS8xOVJ5YW5BL0NoZWNrUENSL2lzc3Vlcy9uZXcnXHJcblxyXG5jb25zdCBsaW5rQnlJZCA9IChpZDogc3RyaW5nKSA9PiBlbGVtQnlJZChpZCkgYXMgSFRNTExpbmtFbGVtZW50XHJcblxyXG4vLyAqZGlzcGxheUVycm9yKiBkaXNwbGF5cyBhIGRpYWxvZyBjb250YWluaW5nIGluZm9ybWF0aW9uIGFib3V0IGFuIGVycm9yLlxyXG5leHBvcnQgZnVuY3Rpb24gZGlzcGxheUVycm9yKGU6IEVycm9yKTogdm9pZCB7XHJcbiAgICBjb25zb2xlLmxvZygnRGlzcGxheWluZyBlcnJvcicsIGUpXHJcbiAgICBjb25zdCBlcnJvckhUTUwgPSBgTWVzc2FnZTogJHtlLm1lc3NhZ2V9XFxuU3RhY2s6ICR7ZS5zdGFjayB8fCAoZSBhcyBhbnkpLmxpbmVOdW1iZXJ9XFxuYFxyXG4gICAgICAgICAgICAgICAgICAgICsgYEJyb3dzZXI6ICR7bmF2aWdhdG9yLnVzZXJBZ2VudH1cXG5WZXJzaW9uOiAke1ZFUlNJT059YFxyXG4gICAgZWxlbUJ5SWQoJ2Vycm9yQ29udGVudCcpLmlubmVySFRNTCA9IGVycm9ySFRNTC5yZXBsYWNlKCdcXG4nLCAnPGJyPicpXHJcbiAgICBsaW5rQnlJZCgnZXJyb3JHb29nbGUnKS5ocmVmID0gRVJST1JfRk9STV9VUkwgKyBFUlJPUl9GT1JNX0VOVFJZICsgZW5jb2RlVVJJQ29tcG9uZW50KGVycm9ySFRNTClcclxuICAgIGxpbmtCeUlkKCdlcnJvckdpdEh1YicpLmhyZWYgPVxyXG4gICAgICAgIEVSUk9SX0dJVEhVQl9VUkwgKyAnP2JvZHk9JyArIGVuY29kZVVSSUNvbXBvbmVudChgSSd2ZSBlbmNvdW50ZXJlZCBhbiBidWcuXFxuXFxuXFxgXFxgXFxgXFxuJHtlcnJvckhUTUx9XFxuXFxgXFxgXFxgYClcclxuICAgIGVsZW1CeUlkKCdlcnJvckJhY2tncm91bmQnKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xyXG4gICAgcmV0dXJuIGVsZW1CeUlkKCdlcnJvcicpLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcbn1cclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIChldnQpID0+IHtcclxuICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICBkaXNwbGF5RXJyb3IoZXZ0LmVycm9yKVxyXG59KVxyXG4iLCJpbXBvcnQgeyBfJCB9IGZyb20gJy4uL3V0aWwnXHJcblxyXG4vLyBGb3IgbGlzdCB2aWV3LCB0aGUgYXNzaWdubWVudHMgY2FuJ3QgYmUgb24gdG9wIG9mIGVhY2ggb3RoZXIuXHJcbi8vIFRoZXJlZm9yZSwgYSBsaXN0ZW5lciBpcyBhdHRhY2hlZCB0byB0aGUgcmVzaXppbmcgb2YgdGhlIGJyb3dzZXIgd2luZG93LlxyXG5sZXQgdGlja2luZyA9IGZhbHNlXHJcbmxldCB0aW1lb3V0SWQ6IG51bWJlcnxudWxsID0gbnVsbFxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0UmVzaXplQXNzaWdubWVudHMoKTogSFRNTEVsZW1lbnRbXSB7XHJcbiAgICBjb25zdCBhc3NpZ25tZW50cyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5jb250YWlucygnc2hvd0RvbmUnKSA/XHJcbiAgICAgICAgJy5hc3NpZ25tZW50Lmxpc3REaXNwJyA6ICcuYXNzaWdubWVudC5saXN0RGlzcDpub3QoLmRvbmUpJykpXHJcbiAgICBhc3NpZ25tZW50cy5zb3J0KChhLCBiKSA9PiB7XHJcbiAgICAgICAgY29uc3QgYWQgPSBhLmNsYXNzTGlzdC5jb250YWlucygnZG9uZScpXHJcbiAgICAgICAgY29uc3QgYmQgPSBiLmNsYXNzTGlzdC5jb250YWlucygnZG9uZScpXHJcbiAgICAgICAgaWYgKGFkICYmICFiZCkgeyByZXR1cm4gMSB9XHJcbiAgICAgICAgaWYgKGJkICYmICFhZCkgeyByZXR1cm4gLTEgfVxyXG4gICAgICAgIHJldHVybiBOdW1iZXIoKGEucXVlcnlTZWxlY3RvcignLmR1ZScpIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlKVxyXG4gICAgICAgICAgICAgLSBOdW1iZXIoKGIucXVlcnlTZWxlY3RvcignLmR1ZScpIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlKVxyXG4gICAgfSlcclxuICAgIHJldHVybiBhc3NpZ25tZW50cyBhcyBIVE1MRWxlbWVudFtdXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZXNpemVDYWxsZXIoKTogdm9pZCB7XHJcbiAgICBpZiAoIXRpY2tpbmcpIHtcclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVzaXplKVxyXG4gICAgICAgIHRpY2tpbmcgPSB0cnVlXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZXNpemUoKTogdm9pZCB7XHJcbiAgICB0aWNraW5nID0gdHJ1ZVxyXG4gICAgLy8gVG8gY2FsY3VsYXRlIHRoZSBudW1iZXIgb2YgY29sdW1ucywgdGhlIGJlbG93IGFsZ29yaXRobSBpcyB1c2VkIGJlY2FzZSBhcyB0aGUgc2NyZWVuIHNpemVcclxuICAgIC8vIGluY3JlYXNlcywgdGhlIGNvbHVtbiB3aWR0aCBpbmNyZWFzZXNcclxuICAgIGNvbnN0IHdpZHRocyA9IGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKCdzaG93SW5mbycpID9cclxuICAgICAgICBbNjUwLCAxMTAwLCAxODAwLCAyNzAwLCAzODAwLCA1MTAwXSA6IFszNTAsIDgwMCwgMTUwMCwgMjQwMCwgMzUwMCwgNDgwMF1cclxuICAgIGxldCBjb2x1bW5zID0gMVxyXG4gICAgd2lkdGhzLmZvckVhY2goKHcsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgaWYgKHdpbmRvdy5pbm5lcldpZHRoID4gdykgeyBjb2x1bW5zID0gaW5kZXggKyAxIH1cclxuICAgIH0pXHJcbiAgICBjb25zdCBjb2x1bW5IZWlnaHRzID0gQXJyYXkuZnJvbShuZXcgQXJyYXkoY29sdW1ucyksICgpID0+IDApXHJcbiAgICBjb25zdCBjY2g6IG51bWJlcltdID0gW11cclxuICAgIGNvbnN0IGFzc2lnbm1lbnRzID0gZ2V0UmVzaXplQXNzaWdubWVudHMoKVxyXG4gICAgYXNzaWdubWVudHMuZm9yRWFjaCgoYXNzaWdubWVudCwgbikgPT4ge1xyXG4gICAgICAgIGNvbnN0IGNvbCA9IG4gJSBjb2x1bW5zXHJcbiAgICAgICAgY2NoLnB1c2goY29sdW1uSGVpZ2h0c1tjb2xdKVxyXG4gICAgICAgIGNvbHVtbkhlaWdodHNbY29sXSArPSBhc3NpZ25tZW50Lm9mZnNldEhlaWdodCArIDI0XHJcbiAgICB9KVxyXG4gICAgYXNzaWdubWVudHMuZm9yRWFjaCgoYXNzaWdubWVudCwgbikgPT4ge1xyXG4gICAgICAgIGNvbnN0IGNvbCA9IG4gJSBjb2x1bW5zXHJcbiAgICAgICAgYXNzaWdubWVudC5zdHlsZS50b3AgPSBjY2hbbl0gKyAncHgnXHJcbiAgICAgICAgYXNzaWdubWVudC5zdHlsZS5sZWZ0ID0gKCgxMDAgLyBjb2x1bW5zKSAqIGNvbCkgKyAnJSdcclxuICAgICAgICBhc3NpZ25tZW50LnN0eWxlLnJpZ2h0ID0gKCgxMDAgLyBjb2x1bW5zKSAqIChjb2x1bW5zIC0gY29sIC0gMSkpICsgJyUnXHJcbiAgICB9KVxyXG4gICAgaWYgKHRpbWVvdXRJZCkgY2xlYXJUaW1lb3V0KHRpbWVvdXRJZClcclxuICAgIHRpbWVvdXRJZCA9IHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIGNjaC5sZW5ndGggPSAwXHJcbiAgICAgICAgYXNzaWdubWVudHMuZm9yRWFjaCgoYXNzaWdubWVudCwgbikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBjb2wgPSBuICUgY29sdW1uc1xyXG4gICAgICAgICAgICBpZiAobiA8IGNvbHVtbnMpIHtcclxuICAgICAgICAgICAgICAgIGNvbHVtbkhlaWdodHNbY29sXSA9IDBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjY2gucHVzaChjb2x1bW5IZWlnaHRzW2NvbF0pXHJcbiAgICAgICAgICAgIGNvbHVtbkhlaWdodHNbY29sXSArPSBhc3NpZ25tZW50Lm9mZnNldEhlaWdodCArIDI0XHJcbiAgICAgICAgfSlcclxuICAgICAgICBhc3NpZ25tZW50cy5mb3JFYWNoKChhc3NpZ25tZW50LCBuKSA9PiB7XHJcbiAgICAgICAgICAgIGFzc2lnbm1lbnQuc3R5bGUudG9wID0gY2NoW25dICsgJ3B4J1xyXG4gICAgICAgIH0pXHJcbiAgICB9LCA1MDApXHJcbiAgICB0aWNraW5nID0gZmFsc2VcclxufVxyXG4iLCIvKipcclxuICogQWxsIHRoaXMgaXMgcmVzcG9uc2libGUgZm9yIGlzIGNyZWF0aW5nIHNuYWNrYmFycy5cclxuICovXHJcblxyXG5pbXBvcnQgeyBlbGVtZW50LCBmb3JjZUxheW91dCB9IGZyb20gJy4uL3V0aWwnXHJcblxyXG4vKipcclxuICogQ3JlYXRlcyBhIHNuYWNrYmFyIHdpdGhvdXQgYW4gYWN0aW9uXHJcbiAqIEBwYXJhbSBtZXNzYWdlIFRoZSBzbmFja2JhcidzIG1lc3NhZ2VcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBzbmFja2JhcihtZXNzYWdlOiBzdHJpbmcpOiB2b2lkXHJcbi8qKlxyXG4gKiBDcmVhdGVzIGEgc25hY2tiYXIgd2l0aCBhbiBhY3Rpb25cclxuICogQHBhcmFtIG1lc3NhZ2UgVGhlIHNuYWNrYmFyJ3MgbWVzc2FnZVxyXG4gKiBAcGFyYW0gYWN0aW9uIE9wdGlvbmFsIHRleHQgdG8gc2hvdyBhcyBhIG1lc3NhZ2UgYWN0aW9uXHJcbiAqIEBwYXJhbSBmICAgICAgQSBmdW5jdGlvbiB0byBleGVjdXRlIHdoZW4gdGhlIGFjdGlvbiBpcyBjbGlja2VkXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gc25hY2tiYXIobWVzc2FnZTogc3RyaW5nLCBhY3Rpb246IHN0cmluZywgZjogKCkgPT4gdm9pZCk6IHZvaWRcclxuZXhwb3J0IGZ1bmN0aW9uIHNuYWNrYmFyKG1lc3NhZ2U6IHN0cmluZywgYWN0aW9uPzogc3RyaW5nLCBmPzogKCkgPT4gdm9pZCk6IHZvaWQge1xyXG4gICAgY29uc3Qgc25hY2sgPSBlbGVtZW50KCdkaXYnLCAnc25hY2tiYXInKVxyXG4gICAgY29uc3Qgc25hY2tJbm5lciA9IGVsZW1lbnQoJ2RpdicsICdzbmFja0lubmVyJywgbWVzc2FnZSlcclxuICAgIHNuYWNrLmFwcGVuZENoaWxkKHNuYWNrSW5uZXIpXHJcblxyXG4gICAgaWYgKChhY3Rpb24gIT0gbnVsbCkgJiYgKGYgIT0gbnVsbCkpIHtcclxuICAgICAgICBjb25zdCBhY3Rpb25FID0gZWxlbWVudCgnYScsIFtdLCBhY3Rpb24pXHJcbiAgICAgICAgYWN0aW9uRS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgc25hY2suY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcclxuICAgICAgICAgICAgZigpXHJcbiAgICAgICAgfSlcclxuICAgICAgICBzbmFja0lubmVyLmFwcGVuZENoaWxkKGFjdGlvbkUpXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgYWRkID0gKCkgPT4ge1xyXG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNuYWNrKVxyXG4gICAgICBmb3JjZUxheW91dChzbmFjaylcclxuICAgICAgc25hY2suY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICBzbmFjay5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gICAgICAgICAgc2V0VGltZW91dCgoKSA9PiBzbmFjay5yZW1vdmUoKSwgOTAwKVxyXG4gICAgICB9LCA1MDAwKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGV4aXN0aW5nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNuYWNrYmFyJylcclxuICAgIGlmIChleGlzdGluZyAhPSBudWxsKSB7XHJcbiAgICAgICAgZXhpc3RpbmcuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcclxuICAgICAgICBzZXRUaW1lb3V0KGFkZCwgMzAwKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBhZGQoKVxyXG4gICAgfVxyXG59XHJcbiIsIlxyXG4vKipcclxuICogQ29va2llIGZ1bmN0aW9ucyAoYSBjb29raWUgaXMgYSBzbWFsbCB0ZXh0IGRvY3VtZW50IHRoYXQgdGhlIGJyb3dzZXIgY2FuIHJlbWVtYmVyKVxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBSZXRyaWV2ZXMgYSBjb29raWVcclxuICogQHBhcmFtIGNuYW1lIHRoZSBuYW1lIG9mIHRoZSBjb29raWUgdG8gcmV0cmlldmVcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRDb29raWUoY25hbWU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICBjb25zdCBuYW1lID0gY25hbWUgKyAnPSdcclxuICAgIGNvbnN0IGNvb2tpZVBhcnQgPSBkb2N1bWVudC5jb29raWUuc3BsaXQoJzsnKS5maW5kKChjKSA9PiBjLmluY2x1ZGVzKG5hbWUpKVxyXG4gICAgaWYgKGNvb2tpZVBhcnQpIHJldHVybiBjb29raWVQYXJ0LnN1YnN0cmluZyhuYW1lLmxlbmd0aClcclxuICAgIHJldHVybiAnJyAvLyBCbGFuayBpZiBjb29raWUgbm90IGZvdW5kXHJcbiAgfVxyXG5cclxuLyoqIFNldHMgdGhlIHZhbHVlIG9mIGEgY29va2llXHJcbiAqIEBwYXJhbSBjbmFtZSB0aGUgbmFtZSBvZiB0aGUgY29va2llIHRvIHNldFxyXG4gKiBAcGFyYW0gY3ZhbHVlIHRoZSB2YWx1ZSB0byBzZXQgdGhlIGNvb2tpZSB0b1xyXG4gKiBAcGFyYW0gZXhkYXlzIHRoZSBudW1iZXIgb2YgZGF5cyB0aGF0IHRoZSBjb29raWUgd2lsbCBleHBpcmUgaW4gKGFuZCBub3QgYmUgZXhpc3RlbnQgYW55bW9yZSlcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRDb29raWUoY25hbWU6IHN0cmluZywgY3ZhbHVlOiBzdHJpbmcsIGV4ZGF5czogbnVtYmVyKTogdm9pZCB7XHJcbiAgICBjb25zdCBkID0gbmV3IERhdGUoKVxyXG4gICAgZC5zZXRUaW1lKGQuZ2V0VGltZSgpICsgKGV4ZGF5cyAqIDI0ICogNjAgKiA2MCAqIDEwMDApKVxyXG4gICAgY29uc3QgZXhwaXJlcyA9IGBleHBpcmVzPSR7ZC50b1VUQ1N0cmluZygpfWBcclxuICAgIGRvY3VtZW50LmNvb2tpZSA9IGNuYW1lICsgJz0nICsgY3ZhbHVlICsgJzsgJyArIGV4cGlyZXNcclxuICB9XHJcblxyXG4vKipcclxuICogRGVsZXRzIGEgY29va2llXHJcbiAqIEBwYXJhbSBjbmFtZSB0aGUgbmFtZSBvZiB0aGUgY29va2llIHRvIGRlbGV0ZVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGRlbGV0ZUNvb2tpZShjbmFtZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAvLyBUaGlzIGlzIGxpa2UgKnNldENvb2tpZSosIGJ1dCBzZXRzIHRoZSBleHBpcnkgZGF0ZSB0byBzb21ldGhpbmcgaW4gdGhlIHBhc3Qgc28gdGhlIGNvb2tpZSBpcyBkZWxldGVkLlxyXG4gICAgZG9jdW1lbnQuY29va2llID0gY25hbWUgKyAnPTsgZXhwaXJlcz1UaHUsIDAxIEphbiAxOTcwIDAwOjAwOjAxIEdNVDsnXHJcbn1cclxuIiwiZXhwb3J0IGZ1bmN0aW9uIHR6b2ZmKCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gKG5ldyBEYXRlKCkpLmdldFRpbWV6b25lT2Zmc2V0KCkgKiAxMDAwICogNjAgLy8gRm9yIGZ1dHVyZSBjYWxjdWxhdGlvbnNcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHRvRGF0ZU51bShkYXRlOiBEYXRlfG51bWJlcik6IG51bWJlciB7XHJcbiAgICBjb25zdCBudW0gPSBkYXRlIGluc3RhbmNlb2YgRGF0ZSA/IGRhdGUuZ2V0VGltZSgpIDogZGF0ZVxyXG4gICAgcmV0dXJuIE1hdGguZmxvb3IoKG51bSAtIHR6b2ZmKCkpIC8gMTAwMCAvIDM2MDAgLyAyNClcclxufVxyXG5cclxuLy8gKkZyb21EYXRlTnVtKiBjb252ZXJ0cyBhIG51bWJlciBvZiBkYXlzIHRvIGEgbnVtYmVyIG9mIHNlY29uZHNcclxuZXhwb3J0IGZ1bmN0aW9uIGZyb21EYXRlTnVtKGRheXM6IG51bWJlcik6IERhdGUge1xyXG4gICAgY29uc3QgZCA9IG5ldyBEYXRlKChkYXlzICogMTAwMCAqIDM2MDAgKiAyNCkgKyB0em9mZigpKVxyXG4gICAgLy8gVGhlIGNoZWNrcyBiZWxvdyBhcmUgdG8gaGFuZGxlIGRheWxpZ2h0IHNhdmluZ3MgdGltZVxyXG4gICAgaWYgKGQuZ2V0SG91cnMoKSA9PT0gMSkgeyBkLnNldEhvdXJzKDApIH1cclxuICAgIGlmICgoZC5nZXRIb3VycygpID09PSAyMikgfHwgKGQuZ2V0SG91cnMoKSA9PT0gMjMpKSB7XHJcbiAgICAgIGQuc2V0SG91cnMoMjQpXHJcbiAgICAgIGQuc2V0TWludXRlcygwKVxyXG4gICAgICBkLnNldFNlY29uZHMoMClcclxuICAgIH1cclxuICAgIHJldHVybiBkXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB0b2RheSgpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIHRvRGF0ZU51bShuZXcgRGF0ZSgpKVxyXG59XHJcblxyXG4vKipcclxuICogSXRlcmF0ZXMgZnJvbSB0aGUgc3RhcnRpbmcgZGF0ZSB0byBlbmRpbmcgZGF0ZSBpbmNsdXNpdmVcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBpdGVyRGF5cyhzdGFydDogRGF0ZSwgZW5kOiBEYXRlLCBjYjogKGRhdGU6IERhdGUpID0+IHZvaWQpOiB2b2lkIHtcclxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZSBuby1sb29wc1xyXG4gICAgZm9yIChjb25zdCBkID0gbmV3IERhdGUoc3RhcnQpOyBkIDw9IGVuZDsgZC5zZXREYXRlKGQuZ2V0RGF0ZSgpICsgMSkpIHtcclxuICAgICAgICBjYihkKVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IGNvbXB1dGVXZWVrSWQsIGNyZWF0ZUFzc2lnbm1lbnQsIGdldEVTLCBzZXBhcmF0ZWRDbGFzcyB9IGZyb20gJy4vY29tcG9uZW50cy9hc3NpZ25tZW50J1xyXG5pbXBvcnQgeyBjcmVhdGVEYXksIGNyZWF0ZVdlZWsgfSBmcm9tICcuL2NvbXBvbmVudHMvY2FsZW5kYXInXHJcbmltcG9ydCB7IGRpc3BsYXlFcnJvciB9IGZyb20gJy4vY29tcG9uZW50cy9lcnJvckRpc3BsYXknXHJcbmltcG9ydCB7IHJlc2l6ZSB9IGZyb20gJy4vY29tcG9uZW50cy9yZXNpemVyJ1xyXG5pbXBvcnQgeyBmcm9tRGF0ZU51bSwgaXRlckRheXMsIHRvZGF5IH0gZnJvbSAnLi9kYXRlcydcclxuaW1wb3J0IHsgY2xhc3NCeUlkLCBnZXREYXRhLCBJQXBwbGljYXRpb25EYXRhLCBJQXNzaWdubWVudCB9IGZyb20gJy4vcGNyJ1xyXG5pbXBvcnQgeyBhZGRBY3Rpdml0eSwgc2F2ZUFjdGl2aXR5IH0gZnJvbSAnLi9wbHVnaW5zL2FjdGl2aXR5J1xyXG5pbXBvcnQgeyBleHRyYVRvVGFzaywgZ2V0RXh0cmEsIElDdXN0b21Bc3NpZ25tZW50IH0gZnJvbSAnLi9wbHVnaW5zL2N1c3RvbUFzc2lnbm1lbnRzJ1xyXG5pbXBvcnQgeyBhc3NpZ25tZW50SW5Eb25lLCByZW1vdmVGcm9tRG9uZSwgc2F2ZURvbmUgfSBmcm9tICcuL3BsdWdpbnMvZG9uZSdcclxuaW1wb3J0IHsgYXNzaWdubWVudEluTW9kaWZpZWQsIHJlbW92ZUZyb21Nb2RpZmllZCwgc2F2ZU1vZGlmaWVkIH0gZnJvbSAnLi9wbHVnaW5zL21vZGlmaWVkQXNzaWdubWVudHMnXHJcbmltcG9ydCB7IHNldHRpbmdzIH0gZnJvbSAnLi9zZXR0aW5ncydcclxuaW1wb3J0IHsgXyQsIGRhdGVTdHJpbmcsIGVsZW1CeUlkLCBlbGVtZW50LCBsb2NhbFN0b3JhZ2VSZWFkLCBzbW9vdGhTY3JvbGwgfSBmcm9tICcuL3V0aWwnXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElTcGxpdEFzc2lnbm1lbnQge1xyXG4gICAgYXNzaWdubWVudDogSUFzc2lnbm1lbnRcclxuICAgIHN0YXJ0OiBEYXRlXHJcbiAgICBlbmQ6IERhdGV8J0ZvcmV2ZXInXHJcbiAgICBjdXN0b206IGJvb2xlYW5cclxuICAgIHJlZmVyZW5jZT86IElDdXN0b21Bc3NpZ25tZW50XHJcbn1cclxuXHJcbmNvbnN0IFNDSEVEVUxFX0VORFMgPSB7XHJcbiAgICBkYXk6IChkYXRlOiBEYXRlKSA9PiAyNCAqIDM2MDAgKiAxMDAwLFxyXG4gICAgbXM6IChkYXRlOiBEYXRlKSA9PiBbMjQsICAgICAgICAgICAgICAvLyBTdW5kYXlcclxuICAgICAgICAgICAgICAgICAgICAgICAgIDE1ICsgKDM1IC8gNjApLCAgLy8gTW9uZGF5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAxNSArICgzNSAvIDYwKSwgIC8vIFR1ZXNkYXlcclxuICAgICAgICAgICAgICAgICAgICAgICAgIDE1ICsgKDE1IC8gNjApLCAgLy8gV2VkbmVzZGF5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAxNSArICgxNSAvIDYwKSwgIC8vIFRodXJzZGF5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAxNSArICgxNSAvIDYwKSwgIC8vIEZyaWRheVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgMjQgICAgICAgICAgICAgICAvLyBTYXR1cmRheVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdW2RhdGUuZ2V0RGF5KCldLFxyXG4gICAgdXM6IChkYXRlOiBEYXRlKSA9PiAxNSAqIDM2MDAgKiAxMDAwXHJcbn1cclxuY29uc3QgV0VFS0VORF9DTEFTU05BTUVTID0gWydmcm9tV2Vla2VuZCcsICdvdmVyV2Vla2VuZCddXHJcblxyXG5sZXQgc2Nyb2xsID0gMCAvLyBUaGUgbG9jYXRpb24gdG8gc2Nyb2xsIHRvIGluIG9yZGVyIHRvIHJlYWNoIHRvZGF5IGluIGNhbGVuZGFyIHZpZXdcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRTY3JvbGwoKTogbnVtYmVyIHtcclxuICAgIHJldHVybiBzY3JvbGxcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFRpbWVBZnRlcihkYXRlOiBEYXRlKTogbnVtYmVyIHtcclxuICAgIGNvbnN0IGhpZGVBc3NpZ25tZW50cyA9IHNldHRpbmdzLmhpZGVBc3NpZ25tZW50c1xyXG4gICAgaWYgKGhpZGVBc3NpZ25tZW50cyA9PT0gJ2RheScgfHwgaGlkZUFzc2lnbm1lbnRzID09PSAnbXMnIHx8IGhpZGVBc3NpZ25tZW50cyA9PT0gJ3VzJykge1xyXG4gICAgICAgIHJldHVybiBTQ0hFRFVMRV9FTkRTW2hpZGVBc3NpZ25tZW50c10oZGF0ZSlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIFNDSEVEVUxFX0VORFMuZGF5KGRhdGUpXHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFN0YXJ0RW5kRGF0ZXMoZGF0YTogSUFwcGxpY2F0aW9uRGF0YSk6IHtzdGFydDogRGF0ZSwgZW5kOiBEYXRlIH0ge1xyXG4gICAgaWYgKGRhdGEubW9udGhWaWV3KSB7XHJcbiAgICAgICAgY29uc3Qgc3RhcnROID0gTWF0aC5taW4oLi4uZGF0YS5hc3NpZ25tZW50cy5tYXAoKGEpID0+IGEuc3RhcnQpKSAvLyBTbWFsbGVzdCBkYXRlXHJcbiAgICAgICAgY29uc3QgZW5kTiA9IE1hdGgubWF4KC4uLmRhdGEuYXNzaWdubWVudHMubWFwKChhKSA9PiBhLnN0YXJ0KSkgLy8gTGFyZ2VzdCBkYXRlXHJcblxyXG4gICAgICAgIGNvbnN0IHllYXIgPSAobmV3IERhdGUoKSkuZ2V0RnVsbFllYXIoKSAvLyBGb3IgZnV0dXJlIGNhbGN1bGF0aW9uc1xyXG5cclxuICAgICAgICAvLyBDYWxjdWxhdGUgd2hhdCBtb250aCB3ZSB3aWxsIGJlIGRpc3BsYXlpbmcgYnkgZmluZGluZyB0aGUgbW9udGggb2YgdG9kYXlcclxuICAgICAgICBjb25zdCBtb250aCA9IChuZXcgRGF0ZSgpKS5nZXRNb250aCgpXHJcblxyXG4gICAgICAgIC8vIE1ha2Ugc3VyZSB0aGUgc3RhcnQgYW5kIGVuZCBkYXRlcyBsaWUgd2l0aGluIHRoZSBtb250aFxyXG4gICAgICAgIGNvbnN0IHN0YXJ0ID0gbmV3IERhdGUoTWF0aC5tYXgoZnJvbURhdGVOdW0oc3RhcnROKS5nZXRUaW1lKCksIChuZXcgRGF0ZSh5ZWFyLCBtb250aCkpLmdldFRpbWUoKSkpXHJcbiAgICAgICAgLy8gSWYgdGhlIGRheSBhcmd1bWVudCBmb3IgRGF0ZSBpcyAwLCB0aGVuIHRoZSByZXN1bHRpbmcgZGF0ZSB3aWxsIGJlIG9mIHRoZSBwcmV2aW91cyBtb250aFxyXG4gICAgICAgIGNvbnN0IGVuZCA9IG5ldyBEYXRlKE1hdGgubWluKGZyb21EYXRlTnVtKGVuZE4pLmdldFRpbWUoKSwgKG5ldyBEYXRlKHllYXIsIG1vbnRoICsgMSwgMCkpLmdldFRpbWUoKSkpXHJcbiAgICAgICAgcmV0dXJuIHsgc3RhcnQsIGVuZCB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc3QgdG9kYXlTRSA9IG5ldyBEYXRlKClcclxuICAgICAgICBjb25zdCBzdGFydCA9IG5ldyBEYXRlKHRvZGF5U0UuZ2V0RnVsbFllYXIoKSwgdG9kYXlTRS5nZXRNb250aCgpLCB0b2RheVNFLmdldERhdGUoKSlcclxuICAgICAgICBjb25zdCBlbmQgPSBuZXcgRGF0ZSh0b2RheVNFLmdldEZ1bGxZZWFyKCksIHRvZGF5U0UuZ2V0TW9udGgoKSwgdG9kYXlTRS5nZXREYXRlKCkpXHJcbiAgICAgICAgcmV0dXJuIHsgc3RhcnQsIGVuZCB9XHJcbiAgICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0QXNzaWdubWVudFNwbGl0cyhhc3NpZ25tZW50OiBJQXNzaWdubWVudCwgc3RhcnQ6IERhdGUsIGVuZDogRGF0ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWZlcmVuY2U/OiBJQ3VzdG9tQXNzaWdubWVudCk6IElTcGxpdEFzc2lnbm1lbnRbXSB7XHJcbiAgICBjb25zdCBzcGxpdDogSVNwbGl0QXNzaWdubWVudFtdID0gW11cclxuICAgIGlmIChzZXR0aW5ncy5hc3NpZ25tZW50U3BhbiA9PT0gJ211bHRpcGxlJykge1xyXG4gICAgICAgIGNvbnN0IHMgPSBNYXRoLm1heChzdGFydC5nZXRUaW1lKCksIGZyb21EYXRlTnVtKGFzc2lnbm1lbnQuc3RhcnQpLmdldFRpbWUoKSlcclxuICAgICAgICBjb25zdCBlID0gYXNzaWdubWVudC5lbmQgPT09ICdGb3JldmVyJyA/IHMgOiBNYXRoLm1pbihlbmQuZ2V0VGltZSgpLCBmcm9tRGF0ZU51bShhc3NpZ25tZW50LmVuZCkuZ2V0VGltZSgpKVxyXG4gICAgICAgIGNvbnN0IHNwYW4gPSAoKGUgLSBzKSAvIDEwMDAgLyAzNjAwIC8gMjQpICsgMSAvLyBOdW1iZXIgb2YgZGF5cyBhc3NpZ25tZW50IHRha2VzIHVwXHJcbiAgICAgICAgY29uc3Qgc3BhblJlbGF0aXZlID0gNiAtIChuZXcgRGF0ZShzKSkuZ2V0RGF5KCkgLy8gTnVtYmVyIG9mIGRheXMgdW50aWwgdGhlIG5leHQgU2F0dXJkYXlcclxuXHJcbiAgICAgICAgY29uc3QgbnMgPSBuZXcgRGF0ZShzKVxyXG4gICAgICAgIG5zLnNldERhdGUobnMuZ2V0RGF0ZSgpICsgc3BhblJlbGF0aXZlKSAvLyAgVGhlIGRhdGUgb2YgdGhlIG5leHQgU2F0dXJkYXlcclxuXHJcbiAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lIG5vLWxvb3BzXHJcbiAgICAgICAgZm9yIChsZXQgbiA9IC02OyBuIDwgc3BhbiAtIHNwYW5SZWxhdGl2ZTsgbiArPSA3KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGxhc3RTdW4gPSBuZXcgRGF0ZShucylcclxuICAgICAgICAgICAgbGFzdFN1bi5zZXREYXRlKGxhc3RTdW4uZ2V0RGF0ZSgpICsgbilcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG5leHRTYXQgPSBuZXcgRGF0ZShsYXN0U3VuKVxyXG4gICAgICAgICAgICBuZXh0U2F0LnNldERhdGUobmV4dFNhdC5nZXREYXRlKCkgKyA2KVxyXG4gICAgICAgICAgICBzcGxpdC5wdXNoKHtcclxuICAgICAgICAgICAgICAgIGFzc2lnbm1lbnQsXHJcbiAgICAgICAgICAgICAgICBzdGFydDogbmV3IERhdGUoTWF0aC5tYXgocywgbGFzdFN1bi5nZXRUaW1lKCkpKSxcclxuICAgICAgICAgICAgICAgIGVuZDogbmV3IERhdGUoTWF0aC5taW4oZSwgbmV4dFNhdC5nZXRUaW1lKCkpKSxcclxuICAgICAgICAgICAgICAgIGN1c3RvbTogQm9vbGVhbihyZWZlcmVuY2UpLFxyXG4gICAgICAgICAgICAgICAgcmVmZXJlbmNlXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChzZXR0aW5ncy5hc3NpZ25tZW50U3BhbiA9PT0gJ3N0YXJ0Jykge1xyXG4gICAgICAgIGNvbnN0IHMgPSBmcm9tRGF0ZU51bShhc3NpZ25tZW50LnN0YXJ0KVxyXG4gICAgICAgIGlmIChzLmdldFRpbWUoKSA+PSBzdGFydC5nZXRUaW1lKCkpIHtcclxuICAgICAgICAgICAgc3BsaXQucHVzaCh7XHJcbiAgICAgICAgICAgICAgICBhc3NpZ25tZW50LFxyXG4gICAgICAgICAgICAgICAgc3RhcnQ6IHMsXHJcbiAgICAgICAgICAgICAgICBlbmQ6IHMsXHJcbiAgICAgICAgICAgICAgICBjdXN0b206IEJvb2xlYW4ocmVmZXJlbmNlKSxcclxuICAgICAgICAgICAgICAgIHJlZmVyZW5jZVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAoc2V0dGluZ3MuYXNzaWdubWVudFNwYW4gPT09ICdlbmQnKSB7XHJcbiAgICAgICAgY29uc3QgZSA9IGFzc2lnbm1lbnQuZW5kID09PSAnRm9yZXZlcicgPyBhc3NpZ25tZW50LmVuZCA6IGZyb21EYXRlTnVtKGFzc2lnbm1lbnQuZW5kKVxyXG4gICAgICAgIGNvbnN0IGRlID0gZSA9PT0gJ0ZvcmV2ZXInID8gZnJvbURhdGVOdW0oYXNzaWdubWVudC5zdGFydCkgOiBlXHJcbiAgICAgICAgaWYgKGRlLmdldFRpbWUoKSA8PSBlbmQuZ2V0VGltZSgpKSB7XHJcbiAgICAgICAgICAgIHNwbGl0LnB1c2goe1xyXG4gICAgICAgICAgICAgICAgYXNzaWdubWVudCxcclxuICAgICAgICAgICAgICAgIHN0YXJ0OiBkZSxcclxuICAgICAgICAgICAgICAgIGVuZDogZSxcclxuICAgICAgICAgICAgICAgIGN1c3RvbTogQm9vbGVhbihyZWZlcmVuY2UpLFxyXG4gICAgICAgICAgICAgICAgcmVmZXJlbmNlXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBzcGxpdFxyXG59XHJcblxyXG4vLyBUaGlzIGZ1bmN0aW9uIHdpbGwgY29udmVydCB0aGUgYXJyYXkgb2YgYXNzaWdubWVudHMgZ2VuZXJhdGVkIGJ5ICpwYXJzZSogaW50byByZWFkYWJsZSBIVE1MLlxyXG5leHBvcnQgZnVuY3Rpb24gZGlzcGxheShkb1Njcm9sbDogYm9vbGVhbiA9IHRydWUpOiB2b2lkIHtcclxuICAgIGNvbnNvbGUudGltZSgnRGlzcGxheWluZyBkYXRhJylcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgZGF0YSA9IGdldERhdGEoKVxyXG4gICAgICAgIGlmICghZGF0YSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0RhdGEgc2hvdWxkIGhhdmUgYmVlbiBmZXRjaGVkIGJlZm9yZSBkaXNwbGF5KCkgd2FzIGNhbGxlZCcpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkb2N1bWVudC5ib2R5LnNldEF0dHJpYnV0ZSgnZGF0YS1wY3J2aWV3JywgZGF0YS5tb250aFZpZXcgPyAnbW9udGgnIDogJ290aGVyJylcclxuICAgICAgICBjb25zdCBtYWluID0gXyQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbWFpbicpKVxyXG4gICAgICAgIGNvbnN0IHRha2VuOiB7IFtkYXRlOiBudW1iZXJdOiBudW1iZXJbXSB9ID0ge31cclxuXHJcbiAgICAgICAgY29uc3QgdGltZWFmdGVyID0gZ2V0VGltZUFmdGVyKG5ldyBEYXRlKCkpXHJcblxyXG4gICAgICAgIGNvbnN0IHtzdGFydCwgZW5kfSA9IGdldFN0YXJ0RW5kRGF0ZXMoZGF0YSlcclxuXHJcbiAgICAgICAgLy8gU2V0IHRoZSBzdGFydCBkYXRlIHRvIGJlIGEgU3VuZGF5IGFuZCB0aGUgZW5kIGRhdGUgdG8gYmUgYSBTYXR1cmRheVxyXG4gICAgICAgIHN0YXJ0LnNldERhdGUoc3RhcnQuZ2V0RGF0ZSgpIC0gc3RhcnQuZ2V0RGF5KCkpXHJcbiAgICAgICAgZW5kLnNldERhdGUoZW5kLmdldERhdGUoKSArICg2IC0gZW5kLmdldERheSgpKSlcclxuXHJcbiAgICAgICAgLy8gRmlyc3QgcG9wdWxhdGUgdGhlIGNhbGVuZGFyIHdpdGggYm94ZXMgZm9yIGVhY2ggZGF5XHJcbiAgICAgICAgY29uc3QgbGFzdERhdGEgPSBsb2NhbFN0b3JhZ2VSZWFkKCdkYXRhJykgYXMgSUFwcGxpY2F0aW9uRGF0YVxyXG4gICAgICAgIGxldCB3azogSFRNTEVsZW1lbnR8bnVsbCA9IG51bGxcclxuICAgICAgICBpdGVyRGF5cyhzdGFydCwgZW5kLCAoZCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZC5nZXREYXkoKSA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaWQgPSBgd2ske2QuZ2V0TW9udGgoKX0tJHtkLmdldERhdGUoKX1gIC8vIERvbid0IGNyZWF0ZSBhIG5ldyB3ZWVrIGVsZW1lbnQgaWYgb25lIGFscmVhZHkgZXhpc3RzXHJcbiAgICAgICAgICAgICAgICB3ayA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKVxyXG4gICAgICAgICAgICAgICAgaWYgKHdrID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICB3ayA9IGNyZWF0ZVdlZWsoaWQpXHJcbiAgICAgICAgICAgICAgICAgICAgbWFpbi5hcHBlbmRDaGlsZCh3aylcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCF3aykgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCB3ZWVrIGVsZW1lbnQgb24gZGF5ICR7ZH0gdG8gbm90IGJlIG51bGxgKVxyXG4gICAgICAgICAgICBpZiAod2suZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnZGF5JykubGVuZ3RoIDw9IGQuZ2V0RGF5KCkpIHtcclxuICAgICAgICAgICAgICAgIHdrLmFwcGVuZENoaWxkKGNyZWF0ZURheShkKSlcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGFrZW5bZC5nZXRUaW1lKCldID0gW11cclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICAvLyBTcGxpdCBhc3NpZ25tZW50cyB0YWtpbmcgbW9yZSB0aGFuIDEgd2Vla1xyXG4gICAgICAgIGNvbnN0IHNwbGl0OiBJU3BsaXRBc3NpZ25tZW50W10gPSBbXVxyXG4gICAgICAgIGRhdGEuYXNzaWdubWVudHMuZm9yRWFjaCgoYXNzaWdubWVudCwgbnVtKSA9PiB7XHJcbiAgICAgICAgICAgIHNwbGl0LnB1c2goLi4uZ2V0QXNzaWdubWVudFNwbGl0cyhhc3NpZ25tZW50LCBzdGFydCwgZW5kKSlcclxuXHJcbiAgICAgICAgICAgIC8vIEFjdGl2aXR5IHN0dWZmXHJcbiAgICAgICAgICAgIGlmIChsYXN0RGF0YSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBvbGRBc3NpZ25tZW50ID0gbGFzdERhdGEuYXNzaWdubWVudHMuZmluZCgoYSkgPT4gYS5pZCA9PT0gYXNzaWdubWVudC5pZClcclxuICAgICAgICAgICAgICAgIGlmIChvbGRBc3NpZ25tZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9sZEFzc2lnbm1lbnQuYm9keSAhPT0gYXNzaWdubWVudC5ib2R5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkZEFjdGl2aXR5KCdlZGl0Jywgb2xkQXNzaWdubWVudCwgbmV3IERhdGUoKSwgdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2xkQXNzaWdubWVudC5jbGFzcyAhPSBudWxsID8gbGFzdERhdGEuY2xhc3Nlc1tvbGRBc3NpZ25tZW50LmNsYXNzXSA6IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlRnJvbU1vZGlmaWVkKGFzc2lnbm1lbnQuaWQpIC8vIElmIHRoZSBhc3NpZ25tZW50IGlzIG1vZGlmaWVkLCByZXNldCBpdFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBsYXN0RGF0YS5hc3NpZ25tZW50cy5zcGxpY2UobGFzdERhdGEuYXNzaWdubWVudHMuaW5kZXhPZihvbGRBc3NpZ25tZW50KSwgMSlcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWRkQWN0aXZpdHkoJ2FkZCcsIGFzc2lnbm1lbnQsIG5ldyBEYXRlKCksIHRydWUpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICBpZiAobGFzdERhdGEgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAvLyBDaGVjayBpZiBhbnkgb2YgdGhlIGxhc3QgYXNzaWdubWVudHMgd2VyZW4ndCBkZWxldGVkIChzbyB0aGV5IGhhdmUgYmVlbiBkZWxldGVkIGluIFBDUilcclxuICAgICAgICAgICAgbGFzdERhdGEuYXNzaWdubWVudHMuZm9yRWFjaCgoYXNzaWdubWVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgYWRkQWN0aXZpdHkoJ2RlbGV0ZScsIGFzc2lnbm1lbnQsIG5ldyBEYXRlKCksIHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhc3NpZ25tZW50LmNsYXNzICE9IG51bGwgPyBsYXN0RGF0YS5jbGFzc2VzW2Fzc2lnbm1lbnQuY2xhc3NdIDogdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgcmVtb3ZlRnJvbURvbmUoYXNzaWdubWVudC5pZClcclxuICAgICAgICAgICAgICAgIHJlbW92ZUZyb21Nb2RpZmllZChhc3NpZ25tZW50LmlkKVxyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgLy8gVGhlbiBzYXZlIGEgbWF4aW11bSBvZiAxMjggYWN0aXZpdHkgaXRlbXNcclxuICAgICAgICAgICAgc2F2ZUFjdGl2aXR5KClcclxuXHJcbiAgICAgICAgICAgIC8vIEFuZCBjb21wbGV0ZWQgYXNzaWdubWVudHMgKyBtb2RpZmljYXRpb25zXHJcbiAgICAgICAgICAgIHNhdmVEb25lKClcclxuICAgICAgICAgICAgc2F2ZU1vZGlmaWVkKClcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEFkZCBjdXN0b20gYXNzaWdubWVudHMgdG8gdGhlIHNwbGl0IGFycmF5XHJcbiAgICAgICAgZ2V0RXh0cmEoKS5mb3JFYWNoKChjdXN0b20pID0+IHtcclxuICAgICAgICAgICAgc3BsaXQucHVzaCguLi5nZXRBc3NpZ25tZW50U3BsaXRzKGV4dHJhVG9UYXNrKGN1c3RvbSwgZGF0YSksIHN0YXJ0LCBlbmQsIGN1c3RvbSkpXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgLy8gQ2FsY3VsYXRlIHRoZSB0b2RheSdzIHdlZWsgaWRcclxuICAgICAgICBjb25zdCB0ZHN0ID0gbmV3IERhdGUoKVxyXG4gICAgICAgIHRkc3Quc2V0RGF0ZSh0ZHN0LmdldERhdGUoKSAtIHRkc3QuZ2V0RGF5KCkpXHJcbiAgICAgICAgY29uc3QgdG9kYXlXa0lkID0gYHdrJHt0ZHN0LmdldE1vbnRoKCl9LSR7dGRzdC5nZXREYXRlKCl9YFxyXG5cclxuICAgICAgICAvLyBUaGVuIGFkZCBhc3NpZ25tZW50c1xyXG4gICAgICAgIGNvbnN0IHdlZWtIZWlnaHRzOiB7IFt3ZWVrSWQ6IHN0cmluZ106IG51bWJlciB9ID0ge31cclxuICAgICAgICBjb25zdCBwcmV2aW91c0Fzc2lnbm1lbnRzOiB7IFtpZDogc3RyaW5nXTogSFRNTEVsZW1lbnQgfSA9IHt9XHJcbiAgICAgICAgQXJyYXkucHJvdG90eXBlLmZvckVhY2guY2FsbChkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdhc3NpZ25tZW50JyksIChhc3NpZ25tZW50OiBIVE1MRWxlbWVudCkgPT4ge1xyXG4gICAgICAgICAgICBwcmV2aW91c0Fzc2lnbm1lbnRzW2Fzc2lnbm1lbnQuaWRdID0gYXNzaWdubWVudFxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIHNwbGl0LmZvckVhY2goKHMpID0+IHtcclxuICAgICAgICAgICAgY29uc3Qgd2Vla0lkID0gY29tcHV0ZVdlZWtJZChzKVxyXG4gICAgICAgICAgICB3ayA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHdlZWtJZClcclxuICAgICAgICAgICAgaWYgKHdrID09IG51bGwpIHJldHVyblxyXG5cclxuICAgICAgICAgICAgY29uc3QgZSA9IGNyZWF0ZUFzc2lnbm1lbnQocywgZGF0YSlcclxuXHJcbiAgICAgICAgICAgIC8vIENhbGN1bGF0ZSBob3cgbWFueSBhc3NpZ25tZW50cyBhcmUgcGxhY2VkIGJlZm9yZSB0aGUgY3VycmVudCBvbmVcclxuICAgICAgICAgICAgaWYgKCFzLmN1c3RvbSB8fCAhc2V0dGluZ3Muc2VwVGFza3MpIHtcclxuICAgICAgICAgICAgICAgIGxldCBwb3MgPSAwXHJcbiAgICAgICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmUgbm8tbG9vcHNcclxuICAgICAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZvdW5kID0gdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgIGl0ZXJEYXlzKHMuc3RhcnQsIHMuZW5kID09PSAnRm9yZXZlcicgPyBzLnN0YXJ0IDogcy5lbmQsIChkKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0YWtlbltkLmdldFRpbWUoKV0uaW5kZXhPZihwb3MpICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm91bmQgPSBmYWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZm91bmQpIHsgYnJlYWsgfVxyXG4gICAgICAgICAgICAgICAgICAgIHBvcysrXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gQXBwZW5kIHRoZSBwb3NpdGlvbiB0aGUgYXNzaWdubWVudCBpcyBhdCB0byB0aGUgdGFrZW4gYXJyYXlcclxuICAgICAgICAgICAgICAgIGl0ZXJEYXlzKHMuc3RhcnQsIHMuZW5kID09PSAnRm9yZXZlcicgPyBzLnN0YXJ0IDogcy5lbmQsIChkKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFrZW5bZC5nZXRUaW1lKCldLnB1c2gocG9zKVxyXG4gICAgICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBDYWxjdWxhdGUgaG93IGZhciBkb3duIHRoZSBhc3NpZ25tZW50IG11c3QgYmUgcGxhY2VkIGFzIHRvIG5vdCBibG9jayB0aGUgb25lcyBhYm92ZSBpdFxyXG4gICAgICAgICAgICAgICAgZS5zdHlsZS5tYXJnaW5Ub3AgPSAocG9zICogMzApICsgJ3B4J1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICgod2Vla0hlaWdodHNbd2Vla0lkXSA9PSBudWxsKSB8fCAocG9zID4gd2Vla0hlaWdodHNbd2Vla0lkXSkpIHtcclxuICAgICAgICAgICAgICAgICAgICB3ZWVrSGVpZ2h0c1t3ZWVrSWRdID0gcG9zXHJcbiAgICAgICAgICAgICAgICAgICAgd2suc3R5bGUuaGVpZ2h0ID0gNDcgKyAoKHBvcyArIDEpICogMzApICsgJ3B4J1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBJZiB0aGUgYXNzaWdubWVudCBpcyBhIHRlc3QgYW5kIGlzIHVwY29taW5nLCBhZGQgaXQgdG8gdGhlIHVwY29taW5nIHRlc3RzIHBhbmVsLlxyXG4gICAgICAgICAgICBpZiAocy5hc3NpZ25tZW50LmVuZCA+PSB0b2RheSgpICYmIChzLmFzc2lnbm1lbnQuYmFzZVR5cGUgPT09ICd0ZXN0JyB8fFxyXG4gICAgICAgICAgICAgICAgKHNldHRpbmdzLnByb2plY3RzSW5UZXN0UGFuZSAmJiBzLmFzc2lnbm1lbnQuYmFzZVR5cGUgPT09ICdsb25ndGVybScpKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGUgPSBlbGVtZW50KCdkaXYnLCBbJ3VwY29taW5nVGVzdCcsICdhc3NpZ25tZW50SXRlbScsIHMuYXNzaWdubWVudC5iYXNlVHlwZV0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYDxpIGNsYXNzPSdtYXRlcmlhbC1pY29ucyc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke3MuYXNzaWdubWVudC5iYXNlVHlwZSA9PT0gJ2xvbmd0ZXJtJyA/ICdhc3NpZ25tZW50JyA6ICdhc3Nlc3NtZW50J31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9pPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz0ndGl0bGUnPiR7cy5hc3NpZ25tZW50LnRpdGxlfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNtYWxsPiR7c2VwYXJhdGVkQ2xhc3Mocy5hc3NpZ25tZW50LCBkYXRhKVsyXX08L3NtYWxsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPSdyYW5nZSc+JHtkYXRlU3RyaW5nKHMuYXNzaWdubWVudC5lbmQsIHRydWUpfTwvZGl2PmAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYHRlc3Qke3MuYXNzaWdubWVudC5pZH1gKVxyXG4gICAgICAgICAgICAgICAgaWYgKHMuYXNzaWdubWVudC5jbGFzcykgdGUuc2V0QXR0cmlidXRlKCdkYXRhLWNsYXNzJywgZGF0YS5jbGFzc2VzW3MuYXNzaWdubWVudC5jbGFzc10pXHJcbiAgICAgICAgICAgICAgICB0ZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkb1Njcm9sbGluZyA9IGFzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgc21vb3RoU2Nyb2xsKChlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCArIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wKSAtIDExNilcclxuICAgICAgICAgICAgICAgICAgICAgICAgZS5jbGljaygpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkb2N1bWVudC5ib2R5LmdldEF0dHJpYnV0ZSgnZGF0YS12aWV3JykgPT09ICcwJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb1Njcm9sbGluZygpXHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXyQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI25hdlRhYnM+bGk6Zmlyc3QtY2hpbGQnKSBhcyBIVE1MRWxlbWVudCkuY2xpY2soKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGRvU2Nyb2xsaW5nLCA1MDApXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoYXNzaWdubWVudEluRG9uZShzLmFzc2lnbm1lbnQuaWQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGUuY2xhc3NMaXN0LmFkZCgnZG9uZScpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0ZXN0RWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGB0ZXN0JHtzLmFzc2lnbm1lbnQuaWR9YClcclxuICAgICAgICAgICAgICAgIGlmICh0ZXN0RWxlbSkge1xyXG4gICAgICAgICAgICAgICAgdGVzdEVsZW0uaW5uZXJIVE1MID0gdGUuaW5uZXJIVE1MXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1CeUlkKCdpbmZvVGVzdHMnKS5hcHBlbmRDaGlsZCh0ZSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgYWxyZWFkeSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHMuYXNzaWdubWVudC5pZCArIHdlZWtJZClcclxuICAgICAgICAgICAgaWYgKGFscmVhZHkgIT0gbnVsbCkgeyAvLyBBc3NpZ25tZW50IGFscmVhZHkgZXhpc3RzXHJcbiAgICAgICAgICAgICAgICBhbHJlYWR5LnN0eWxlLm1hcmdpblRvcCA9IGUuc3R5bGUubWFyZ2luVG9wXHJcbiAgICAgICAgICAgICAgICBhbHJlYWR5LnNldEF0dHJpYnV0ZSgnZGF0YS1jbGFzcycsXHJcbiAgICAgICAgICAgICAgICAgICAgcy5jdXN0b20gJiYgc2V0dGluZ3Muc2VwVGFza0NsYXNzID8gJ1Rhc2snIDogY2xhc3NCeUlkKHMuYXNzaWdubWVudC5jbGFzcykpXHJcbiAgICAgICAgICAgICAgICBpZiAoIWFzc2lnbm1lbnRJbk1vZGlmaWVkKHMuYXNzaWdubWVudC5pZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBhbHJlYWR5LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2JvZHknKVswXS5pbm5lckhUTUwgPSBlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2JvZHknKVswXS5pbm5lckhUTUxcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF8kKGFscmVhZHkucXVlcnlTZWxlY3RvcignLmVkaXRzJykpLmNsYXNzTmFtZSA9IF8kKGUucXVlcnlTZWxlY3RvcignLmVkaXRzJykpLmNsYXNzTmFtZVxyXG4gICAgICAgICAgICAgICAgaWYgKGFscmVhZHkuY2xhc3NMaXN0LnRvZ2dsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFscmVhZHkuY2xhc3NMaXN0LnRvZ2dsZSgnbGlzdERpc3AnLCBlLmNsYXNzTGlzdC5jb250YWlucygnbGlzdERpc3AnKSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGdldEVTKGFscmVhZHkpLmZvckVhY2goKGNsKSA9PiBhbHJlYWR5LmNsYXNzTGlzdC5yZW1vdmUoY2wpKVxyXG4gICAgICAgICAgICAgICAgZ2V0RVMoZSkuZm9yRWFjaCgoY2wpID0+IGFscmVhZHkuY2xhc3NMaXN0LmFkZChjbCkpXHJcbiAgICAgICAgICAgICAgICBXRUVLRU5EX0NMQVNTTkFNRVMuZm9yRWFjaCgoY2wpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBhbHJlYWR5LmNsYXNzTGlzdC5yZW1vdmUoY2wpXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUuY2xhc3NMaXN0LmNvbnRhaW5zKGNsKSkgYWxyZWFkeS5jbGFzc0xpc3QuYWRkKGNsKVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChzLmN1c3RvbSAmJiBzZXR0aW5ncy5zZXBUYXNrcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHN0ID0gTWF0aC5mbG9vcihzLnN0YXJ0LmdldFRpbWUoKSAvIDEwMDAgLyAzNjAwIC8gMjQpXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKChzLmFzc2lnbm1lbnQuc3RhcnQgPT09IHN0KSAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAocy5hc3NpZ25tZW50LmVuZCA9PT0gJ0ZvcmV2ZXInIHx8IHMuYXNzaWdubWVudC5lbmQgPj0gdG9kYXkoKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZS5jbGFzc0xpc3QucmVtb3ZlKCdhc3NpZ25tZW50JylcclxuICAgICAgICAgICAgICAgICAgICAgICAgZS5jbGFzc0xpc3QuYWRkKCd0YXNrUGFuZUl0ZW0nKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlLnN0eWxlLm9yZGVyID0gU3RyaW5nKHMuYXNzaWdubWVudC5lbmQgPT09ICdGb3JldmVyJyA/IE51bWJlci5NQVhfVkFMVUUgOiBzLmFzc2lnbm1lbnQuZW5kKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBsaW5rID0gZS5xdWVyeVNlbGVjdG9yKCcubGlua2VkJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxpbmspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUuaW5zZXJ0QmVmb3JlKGVsZW1lbnQoJ3NtYWxsJywgW10sIGxpbmsuaW5uZXJIVE1MKSwgbGluaylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmsucmVtb3ZlKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtQnlJZCgnaW5mb1Rhc2tzSW5uZXInKS5hcHBlbmRDaGlsZChlKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7IHdrLmFwcGVuZENoaWxkKGUpIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBkZWxldGUgcHJldmlvdXNBc3NpZ25tZW50c1tzLmFzc2lnbm1lbnQuaWQgKyB3ZWVrSWRdXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgLy8gRGVsZXRlIGFueSBhc3NpZ25tZW50cyB0aGF0IGhhdmUgYmVlbiBkZWxldGVkIHNpbmNlIHVwZGF0aW5nXHJcbiAgICAgICAgT2JqZWN0LmVudHJpZXMocHJldmlvdXNBc3NpZ25tZW50cykuZm9yRWFjaCgoW25hbWUsIGFzc2lnbm1lbnRdKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChhc3NpZ25tZW50LmNsYXNzTGlzdC5jb250YWlucygnZnVsbCcpKSB7XHJcbiAgICAgICAgICAgICAgICBlbGVtQnlJZCgnYmFja2dyb3VuZCcpLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYXNzaWdubWVudC5yZW1vdmUoKVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIC8vIFNjcm9sbCB0byB0aGUgY29ycmVjdCBwb3NpdGlvbiBpbiBjYWxlbmRhciB2aWV3XHJcbiAgICAgICAgaWYgKHdlZWtIZWlnaHRzW3RvZGF5V2tJZF0gIT0gbnVsbCkge1xyXG4gICAgICAgICAgICBsZXQgaCA9IDBcclxuICAgICAgICAgICAgY29uc3Qgc3cgPSAod2tpZDogc3RyaW5nKSA9PiB3a2lkLnN1YnN0cmluZygyKS5zcGxpdCgnLScpLm1hcCgoeCkgPT4gTnVtYmVyKHgpKVxyXG4gICAgICAgICAgICBjb25zdCB0b2RheVdrID0gc3codG9kYXlXa0lkKVxyXG4gICAgICAgICAgICBPYmplY3QuZW50cmllcyh3ZWVrSGVpZ2h0cykuZm9yRWFjaCgoW3drSWQsIHZhbF0pID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHdrU3BsaXQgPSBzdyh3a0lkKVxyXG4gICAgICAgICAgICAgICAgaWYgKCh3a1NwbGl0WzBdIDwgdG9kYXlXa1swXSkgfHwgKCh3a1NwbGl0WzBdID09PSB0b2RheVdrWzBdKSAmJiAod2tTcGxpdFsxXSA8IHRvZGF5V2tbMV0pKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGggKz0gdmFsXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIHNjcm9sbCA9IChoICogMzApICsgMTEyICsgMTRcclxuICAgICAgICAgICAgLy8gQWxzbyBzaG93IHRoZSBkYXkgaGVhZGVycyBpZiB0b2RheSdzIGRhdGUgaXMgZGlzcGxheWVkIGluIHRoZSBmaXJzdCByb3cgb2YgdGhlIGNhbGVuZGFyXHJcbiAgICAgICAgICAgIGlmIChzY3JvbGwgPCA1MCkgc2Nyb2xsID0gMFxyXG4gICAgICAgICAgICBpZiAoZG9TY3JvbGwgJiYgKGRvY3VtZW50LmJvZHkuZ2V0QXR0cmlidXRlKCdkYXRhLXZpZXcnKSA9PT0gJzAnKSAmJlxyXG4gICAgICAgICAgICAgICAgIWRvY3VtZW50LmJvZHkucXVlcnlTZWxlY3RvcignLmZ1bGwnKSkge1xyXG4gICAgICAgICAgICAgICAgLy8gaW4gY2FsZW5kYXIgdmlld1xyXG4gICAgICAgICAgICAgICAgd2luZG93LnNjcm9sbFRvKDAsIHNjcm9sbClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QudG9nZ2xlKCdub0xpc3QnLFxyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYXNzaWdubWVudC5saXN0RGlzcDpub3QoLmRvbmUpJykubGVuZ3RoID09PSAwKVxyXG4gICAgICAgIGlmIChkb2N1bWVudC5ib2R5LmdldEF0dHJpYnV0ZSgnZGF0YS12aWV3JykgPT09ICcxJykgeyAvLyBpbiBsaXN0IHZpZXdcclxuICAgICAgICAgICAgcmVzaXplKClcclxuICAgICAgICB9XHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICBkaXNwbGF5RXJyb3IoZXJyKVxyXG4gICAgfVxyXG4gICAgY29uc29sZS50aW1lRW5kKCdEaXNwbGF5aW5nIGRhdGEnKVxyXG59XHJcblxyXG4vLyBUaGUgZnVuY3Rpb24gYmVsb3cgY29udmVydHMgYW4gdXBkYXRlIHRpbWUgdG8gYSBodW1hbi1yZWFkYWJsZSBkYXRlLlxyXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0VXBkYXRlKGRhdGU6IG51bWJlcik6IHN0cmluZyB7XHJcbiAgY29uc3Qgbm93ID0gbmV3IERhdGUoKVxyXG4gIGNvbnN0IHVwZGF0ZSA9IG5ldyBEYXRlKCtkYXRlKVxyXG4gIGlmIChub3cuZ2V0RGF0ZSgpID09PSB1cGRhdGUuZ2V0RGF0ZSgpKSB7XHJcbiAgICBsZXQgYW1wbSA9ICdBTSdcclxuICAgIGxldCBociA9IHVwZGF0ZS5nZXRIb3VycygpXHJcbiAgICBpZiAoaHIgPiAxMikge1xyXG4gICAgICBhbXBtID0gJ1BNJ1xyXG4gICAgICBociAtPSAxMlxyXG4gICAgfVxyXG4gICAgY29uc3QgbWluID0gdXBkYXRlLmdldE1pbnV0ZXMoKVxyXG4gICAgcmV0dXJuIGBUb2RheSBhdCAke2hyfToke21pbiA8IDEwID8gYDAke21pbn1gIDogbWlufSAke2FtcG19YFxyXG4gIH0gZWxzZSB7XHJcbiAgICBjb25zdCBkYXlzUGFzdCA9IE1hdGguY2VpbCgobm93LmdldFRpbWUoKSAtIHVwZGF0ZS5nZXRUaW1lKCkpIC8gMTAwMCAvIDM2MDAgLyAyNClcclxuICAgIGlmIChkYXlzUGFzdCA9PT0gMSkgeyByZXR1cm4gJ1llc3RlcmRheScgfSBlbHNlIHsgcmV0dXJuIGRheXNQYXN0ICsgJyBkYXlzIGFnbycgfVxyXG4gIH1cclxufVxyXG4iLCJsZXQgbGlzdERhdGVPZmZzZXQgPSAwXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0TGlzdERhdGVPZmZzZXQoKTogbnVtYmVyIHtcclxuICAgIHJldHVybiBsaXN0RGF0ZU9mZnNldFxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gemVyb0xpc3REYXRlT2Zmc2V0KCk6IHZvaWQge1xyXG4gICAgbGlzdERhdGVPZmZzZXQgPSAwXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpbmNyZW1lbnRMaXN0RGF0ZU9mZnNldCgpOiB2b2lkIHtcclxuICAgIGxpc3REYXRlT2Zmc2V0ICs9IDFcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRlY3JlbWVudExpc3REYXRlT2Zmc2V0KCk6IHZvaWQge1xyXG4gICAgbGlzdERhdGVPZmZzZXQgLT0gMVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2V0TGlzdERhdGVPZmZzZXQob2Zmc2V0OiBudW1iZXIpOiB2b2lkIHtcclxuICAgIGxpc3REYXRlT2Zmc2V0ID0gb2Zmc2V0XHJcbn1cclxuIiwiLyoqXHJcbiAqIFRoaXMgbW9kdWxlIGNvbnRhaW5zIGNvZGUgdG8gYm90aCBmZXRjaCBhbmQgcGFyc2UgYXNzaWdubWVudHMgZnJvbSBQQ1IuXHJcbiAqL1xyXG5pbXBvcnQgeyB1cGRhdGVBdmF0YXIgfSBmcm9tICcuL2NvbXBvbmVudHMvYXZhdGFyJ1xyXG5pbXBvcnQgeyBkaXNwbGF5RXJyb3IgfSBmcm9tICcuL2NvbXBvbmVudHMvZXJyb3JEaXNwbGF5J1xyXG5pbXBvcnQgeyBzbmFja2JhciB9IGZyb20gJy4vY29tcG9uZW50cy9zbmFja2JhcidcclxuaW1wb3J0IHsgZGVsZXRlQ29va2llLCBnZXRDb29raWUsIHNldENvb2tpZSB9IGZyb20gJy4vY29va2llcydcclxuaW1wb3J0IHsgdG9EYXRlTnVtIH0gZnJvbSAnLi9kYXRlcydcclxuaW1wb3J0IHsgZGlzcGxheSwgZm9ybWF0VXBkYXRlIH0gZnJvbSAnLi9kaXNwbGF5J1xyXG5pbXBvcnQgeyBfJCwgZWxlbUJ5SWQsIGxvY2FsU3RvcmFnZVdyaXRlLCBzZW5kIH0gZnJvbSAnLi91dGlsJ1xyXG5cclxuY29uc3QgUENSX1VSTCA9ICdodHRwczovL3dlYmFwcHNjYS5wY3Jzb2Z0LmNvbSdcclxuY29uc3QgQVNTSUdOTUVOVFNfVVJMID0gYCR7UENSX1VSTH0vQ2x1ZS9TQy1Bc3NpZ25tZW50cy1FbmQtRGF0ZS1SYW5nZS83NTM2YFxyXG5jb25zdCBMT0dJTl9VUkwgPSBgJHtQQ1JfVVJMfS9DbHVlL1NDLVN0dWRlbnQtUG9ydGFsLUxvZ2luLUxEQVAvODQ2ND9yZXR1cm5Vcmw9JHtlbmNvZGVVUklDb21wb25lbnQoQVNTSUdOTUVOVFNfVVJMKX1gXHJcbmNvbnN0IEFUVEFDSE1FTlRTX1VSTCA9IGAke1BDUl9VUkx9L0NsdWUvQ29tbW9uL0F0dGFjaG1lbnRSZW5kZXIuYXNweGBcclxuY29uc3QgRk9STV9IRUFERVJfT05MWSA9IHsgJ0NvbnRlbnQtdHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnIH1cclxuY29uc3QgT05FX01JTlVURV9NUyA9IDYwMDAwXHJcblxyXG5jb25zdCBwcm9ncmVzc0VsZW1lbnQgPSBlbGVtQnlJZCgncHJvZ3Jlc3MnKVxyXG5jb25zdCBsb2dpbkRpYWxvZyA9IGVsZW1CeUlkKCdsb2dpbicpXHJcbmNvbnN0IGxvZ2luQmFja2dyb3VuZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2dpbkJhY2tncm91bmQnKVxyXG5jb25zdCBsYXN0VXBkYXRlRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGFzdFVwZGF0ZScpXHJcbmNvbnN0IHVzZXJuYW1lRWwgPSBlbGVtQnlJZCgndXNlcm5hbWUnKSBhcyBIVE1MSW5wdXRFbGVtZW50XHJcbmNvbnN0IHBhc3N3b3JkRWwgPSBlbGVtQnlJZCgncGFzc3dvcmQnKSBhcyBIVE1MSW5wdXRFbGVtZW50XHJcbmNvbnN0IHJlbWVtYmVyQ2hlY2sgPSBlbGVtQnlJZCgncmVtZW1iZXInKSBhcyBIVE1MSW5wdXRFbGVtZW50XHJcbmNvbnN0IGluY29ycmVjdExvZ2luRWwgPSBlbGVtQnlJZCgnbG9naW5JbmNvcnJlY3QnKVxyXG5cclxuLy8gVE9ETyBrZWVwaW5nIHRoZXNlIGFzIGEgZ2xvYmFsIHZhcnMgaXMgYmFkXHJcbmNvbnN0IGxvZ2luSGVhZGVyczoge1toZWFkZXI6IHN0cmluZ106IHN0cmluZ30gPSB7fVxyXG5jb25zdCB2aWV3RGF0YToge1toYWRlcjogc3RyaW5nXTogc3RyaW5nfSA9IHt9XHJcbmxldCBsYXN0VXBkYXRlID0gMCAvLyBUaGUgbGFzdCB0aW1lIGV2ZXJ5dGhpbmcgd2FzIHVwZGF0ZWRcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUFwcGxpY2F0aW9uRGF0YSB7XHJcbiAgICBjbGFzc2VzOiBzdHJpbmdbXVxyXG4gICAgYXNzaWdubWVudHM6IElBc3NpZ25tZW50W11cclxuICAgIG1vbnRoVmlldzogYm9vbGVhblxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElBc3NpZ25tZW50IHtcclxuICAgIHN0YXJ0OiBudW1iZXJcclxuICAgIGVuZDogbnVtYmVyfCdGb3JldmVyJ1xyXG4gICAgYXR0YWNobWVudHM6IEF0dGFjaG1lbnRBcnJheVtdXHJcbiAgICBib2R5OiBzdHJpbmdcclxuICAgIHR5cGU6IHN0cmluZ1xyXG4gICAgYmFzZVR5cGU6IHN0cmluZ1xyXG4gICAgY2xhc3M6IG51bWJlcnxudWxsLFxyXG4gICAgdGl0bGU6IHN0cmluZ1xyXG4gICAgaWQ6IHN0cmluZ1xyXG59XHJcblxyXG5leHBvcnQgdHlwZSBBdHRhY2htZW50QXJyYXkgPSBbc3RyaW5nLCBzdHJpbmddXHJcblxyXG4vLyBUaGlzIGlzIHRoZSBmdW5jdGlvbiB0aGF0IHJldHJpZXZlcyB5b3VyIGFzc2lnbm1lbnRzIGZyb20gUENSLlxyXG4vL1xyXG4vLyBGaXJzdCwgYSByZXF1ZXN0IGlzIHNlbnQgdG8gUENSIHRvIGxvYWQgdGhlIHBhZ2UgeW91IHdvdWxkIG5vcm1hbGx5IHNlZSB3aGVuIGFjY2Vzc2luZyBQQ1IuXHJcbi8vXHJcbi8vIEJlY2F1c2UgdGhpcyBpcyBydW4gYXMgYSBjaHJvbWUgZXh0ZW5zaW9uLCB0aGlzIHBhZ2UgY2FuIGJlIGFjY2Vzc2VkLiBPdGhlcndpc2UsIHRoZSBicm93c2VyXHJcbi8vIHdvdWxkIHRocm93IGFuIGVycm9yIGZvciBzZWN1cml0eSByZWFzb25zICh5b3UgZG9uJ3Qgd2FudCBhIHJhbmRvbSB3ZWJzaXRlIGJlaW5nIGFibGUgdG8gYWNjZXNzXHJcbi8vIGNvbmZpZGVudGlhbCBkYXRhIGZyb20gYSB3ZWJzaXRlIHlvdSBoYXZlIGxvZ2dlZCBpbnRvKS5cclxuXHJcbi8qKlxyXG4gKiBGZXRjaGVzIGRhdGEgZnJvbSBQQ1IgYW5kIGlmIHRoZSB1c2VyIGlzIGxvZ2dlZCBpbiBwYXJzZXMgYW5kIGRpc3BsYXlzIGl0XHJcbiAqIEBwYXJhbSBvdmVycmlkZSBXaGV0aGVyIHRvIGZvcmNlIGFuIHVwZGF0ZSBldmVuIHRoZXJlIHdhcyBvbmUgcmVjZW50bHlcclxuICogQHBhcmFtIGRhdGEgIE9wdGlvbmFsIGRhdGEgdG8gYmUgcG9zdGVkIHRvIFBDUlxyXG4gKi9cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZldGNoKG92ZXJyaWRlOiBib29sZWFuID0gZmFsc2UsIGRhdGE/OiBzdHJpbmcsIG9uc3VjY2VzczogKCkgPT4gdm9pZCA9IGRpc3BsYXksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbmxvZ2luPzogKCkgPT4gdm9pZCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgaWYgKCFvdmVycmlkZSAmJiBEYXRlLm5vdygpIC0gbGFzdFVwZGF0ZSA8IE9ORV9NSU5VVEVfTVMpIHJldHVyblxyXG4gICAgbGFzdFVwZGF0ZSA9IERhdGUubm93KClcclxuXHJcbiAgICBjb25zdCBoZWFkZXJzID0gZGF0YSA/IEZPUk1fSEVBREVSX09OTFkgOiB1bmRlZmluZWRcclxuICAgIGNvbnNvbGUudGltZSgnRmV0Y2hpbmcgYXNzaWdubWVudHMnKVxyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCByZXNwID0gYXdhaXQgc2VuZChBU1NJR05NRU5UU19VUkwsICdkb2N1bWVudCcsIGhlYWRlcnMsIGRhdGEsIHByb2dyZXNzRWxlbWVudClcclxuICAgICAgICBjb25zb2xlLnRpbWVFbmQoJ0ZldGNoaW5nIGFzc2lnbm1lbnRzJylcclxuICAgICAgICBpZiAocmVzcC5yZXNwb25zZVVSTC5pbmRleE9mKCdMb2dpbicpICE9PSAtMSkge1xyXG4gICAgICAgICAgICAvLyBXZSBoYXZlIHRvIGxvZyBpbiBub3dcclxuICAgICAgICAgICAgKHJlc3AucmVzcG9uc2UgYXMgSFRNTERvY3VtZW50KS5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaW5wdXQnKS5mb3JFYWNoKChlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsb2dpbkhlYWRlcnNbZS5uYW1lXSA9IGUudmFsdWUgfHwgJydcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ05lZWQgdG8gbG9nIGluJylcclxuICAgICAgICAgICAgY29uc3QgdXAgPSBnZXRDb29raWUoJ3VzZXJQYXNzJykgLy8gQXR0ZW1wdHMgdG8gZ2V0IHRoZSBjb29raWUgKnVzZXJQYXNzKiwgd2hpY2ggaXMgc2V0IGlmIHRoZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBcIlJlbWVtYmVyIG1lXCIgY2hlY2tib3ggaXMgY2hlY2tlZCB3aGVuIGxvZ2dpbmcgaW4gdGhyb3VnaCBDaGVja1BDUlxyXG4gICAgICAgICAgICBpZiAodXAgPT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobG9naW5CYWNrZ3JvdW5kKSBsb2dpbkJhY2tncm91bmQuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcclxuICAgICAgICAgICAgICAgIGxvZ2luRGlhbG9nLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBCZWNhdXNlIHdlIHdlcmUgcmVtZW1iZXJlZCwgd2UgY2FuIGxvZyBpbiBpbW1lZGlhdGVseSB3aXRob3V0IHdhaXRpbmcgZm9yIHRoZVxyXG4gICAgICAgICAgICAgICAgLy8gdXNlciB0byBsb2cgaW4gdGhyb3VnaCB0aGUgbG9naW4gZm9ybVxyXG4gICAgICAgICAgICAgICAgZG9sb2dpbih3aW5kb3cuYXRvYih1cCkuc3BsaXQoJzonKSBhcyBbc3RyaW5nLCBzdHJpbmddKVxyXG4gICAgICAgICAgICAgICAgaWYgKG9ubG9naW4pIG9ubG9naW4oKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gTG9nZ2VkIGluIG5vd1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnRmV0Y2hpbmcgYXNzaWdubWVudHMgc3VjY2Vzc2Z1bCcpXHJcbiAgICAgICAgICAgIGNvbnN0IHQgPSBEYXRlLm5vdygpXHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5sYXN0VXBkYXRlID0gdFxyXG4gICAgICAgICAgICBpZiAobGFzdFVwZGF0ZUVsKSBsYXN0VXBkYXRlRWwuaW5uZXJIVE1MID0gZm9ybWF0VXBkYXRlKHQpXHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBwYXJzZShyZXNwLnJlc3BvbnNlKVxyXG4gICAgICAgICAgICAgICAgb25zdWNjZXNzKClcclxuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZVdyaXRlKCdkYXRhJywgZ2V0RGF0YSgpKSAvLyBTdG9yZSBmb3Igb2ZmbGluZSB1c2VcclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKVxyXG4gICAgICAgICAgICAgICAgZGlzcGxheUVycm9yKGVycm9yKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnQ291bGQgbm90IGZldGNoIGFzc2lnbm1lbnRzOyBZb3UgYXJlIHByb2JhYmx5IG9mZmxpbmUuIEhlcmVcXCdzIHRoZSBlcnJvcjonLCBlcnJvcilcclxuICAgICAgICBzbmFja2JhcignQ291bGQgbm90IGZldGNoIHlvdXIgYXNzaWdubWVudHMnLCAnUmV0cnknLCAoKSA9PiBmZXRjaCh0cnVlKSlcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIExvZ3MgdGhlIHVzZXIgaW50byBQQ1JcclxuICogQHBhcmFtIHZhbCAgIEFuIG9wdGlvbmFsIGxlbmd0aC0yIGFycmF5IG9mIHRoZSBmb3JtIFt1c2VybmFtZSwgcGFzc3dvcmRdIHRvIHVzZSB0aGUgdXNlciBpbiB3aXRoLlxyXG4gKiAgICAgICAgICAgICAgSWYgdGhpcyBhcnJheSBpcyBub3QgZ2l2ZW4gdGhlIGxvZ2luIGRpYWxvZyBpbnB1dHMgd2lsbCBiZSB1c2VkLlxyXG4gKiBAcGFyYW0gc3VibWl0RXZ0IFdoZXRoZXIgdG8gb3ZlcnJpZGUgdGhlIHVzZXJuYW1lIGFuZCBwYXNzd29yZCBzdXBwbGVpZCBpbiB2YWwgd2l0aCB0aGUgdmFsdWVzIG9mIHRoZSBpbnB1dCBlbGVtZW50c1xyXG4gKi9cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRvbG9naW4odmFsPzogW3N0cmluZywgc3RyaW5nXXxudWxsLCBzdWJtaXRFdnQ6IGJvb2xlYW4gPSBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25zdWNjZXNzOiAoKSA9PiB2b2lkID0gZGlzcGxheSk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgbG9naW5EaWFsb2cuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIGlmIChsb2dpbkJhY2tncm91bmQpIGxvZ2luQmFja2dyb3VuZC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXHJcbiAgICB9LCAzNTApXHJcblxyXG4gICAgY29uc3QgcG9zdEFycmF5OiBzdHJpbmdbXSA9IFtdIC8vIEFycmF5IG9mIGRhdGEgdG8gcG9zdFxyXG4gICAgbG9jYWxTdG9yYWdlV3JpdGUoJ3VzZXJuYW1lJywgdmFsICYmICFzdWJtaXRFdnQgPyB2YWxbMF0gOiB1c2VybmFtZUVsLnZhbHVlKVxyXG4gICAgdXBkYXRlQXZhdGFyKClcclxuICAgIE9iamVjdC5rZXlzKGxvZ2luSGVhZGVycykuZm9yRWFjaCgoaCkgPT4gIHtcclxuICAgICAgICAvLyBMb29wIHRocm91Z2ggdGhlIGlucHV0IGVsZW1lbnRzIGNvbnRhaW5lZCBpbiB0aGUgbG9naW4gcGFnZS4gQXMgbWVudGlvbmVkIGJlZm9yZSwgdGhleVxyXG4gICAgICAgIC8vIHdpbGwgYmUgc2VudCB0byBQQ1IgdG8gbG9nIGluLlxyXG4gICAgICAgIGlmIChoLnRvTG93ZXJDYXNlKCkuaW5kZXhPZigndXNlcicpICE9PSAtMSkge1xyXG4gICAgICAgICAgICBsb2dpbkhlYWRlcnNbaF0gPSB2YWwgJiYgIXN1Ym1pdEV2dCA/IHZhbFswXSA6IHVzZXJuYW1lRWwudmFsdWVcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGgudG9Mb3dlckNhc2UoKS5pbmRleE9mKCdwYXNzJykgIT09IC0xKSB7XHJcbiAgICAgICAgICAgIGxvZ2luSGVhZGVyc1toXSA9IHZhbCAmJiAhc3VibWl0RXZ0ID8gdmFsWzFdIDogcGFzc3dvcmRFbC52YWx1ZVxyXG4gICAgICAgIH1cclxuICAgICAgICBwb3N0QXJyYXkucHVzaChlbmNvZGVVUklDb21wb25lbnQoaCkgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQobG9naW5IZWFkZXJzW2hdKSlcclxuICAgIH0pXHJcblxyXG4gICAgLy8gTm93IHNlbmQgdGhlIGxvZ2luIHJlcXVlc3QgdG8gUENSXHJcbiAgICBjb25zb2xlLnRpbWUoJ0xvZ2dpbmcgaW4nKVxyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCByZXNwID0gYXdhaXQgc2VuZChMT0dJTl9VUkwsICdkb2N1bWVudCcsIEZPUk1fSEVBREVSX09OTFksIHBvc3RBcnJheS5qb2luKCcmJyksIHByb2dyZXNzRWxlbWVudClcclxuICAgICAgICBjb25zb2xlLnRpbWVFbmQoJ0xvZ2dpbmcgaW4nKVxyXG4gICAgICAgIGlmIChyZXNwLnJlc3BvbnNlVVJMLmluZGV4T2YoJ0xvZ2luJykgIT09IC0xKSB7XHJcbiAgICAgICAgLy8gSWYgUENSIHN0aWxsIHdhbnRzIHVzIHRvIGxvZyBpbiwgdGhlbiB0aGUgdXNlcm5hbWUgb3IgcGFzc3dvcmQgZW50ZXJlZCB3ZXJlIGluY29ycmVjdC5cclxuICAgICAgICAgICAgaW5jb3JyZWN0TG9naW5FbC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xyXG4gICAgICAgICAgICBwYXNzd29yZEVsLnZhbHVlID0gJydcclxuXHJcbiAgICAgICAgICAgIGxvZ2luRGlhbG9nLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcbiAgICAgICAgICAgIGlmIChsb2dpbkJhY2tncm91bmQpIGxvZ2luQmFja2dyb3VuZC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIE90aGVyd2lzZSwgd2UgYXJlIGxvZ2dlZCBpblxyXG4gICAgICAgICAgICBpZiAocmVtZW1iZXJDaGVjay5jaGVja2VkKSB7IC8vIElzIHRoZSBcInJlbWVtYmVyIG1lXCIgY2hlY2tib3ggY2hlY2tlZD9cclxuICAgICAgICAgICAgICAgIC8vIFNldCBhIGNvb2tpZSB3aXRoIHRoZSB1c2VybmFtZSBhbmQgcGFzc3dvcmQgc28gd2UgY2FuIGxvZyBpbiBhdXRvbWF0aWNhbGx5IGluIHRoZVxyXG4gICAgICAgICAgICAgICAgLy8gZnV0dXJlIHdpdGhvdXQgaGF2aW5nIHRvIHByb21wdCBmb3IgYSB1c2VybmFtZSBhbmQgcGFzc3dvcmQgYWdhaW5cclxuICAgICAgICAgICAgICAgIHNldENvb2tpZSgndXNlclBhc3MnLCB3aW5kb3cuYnRvYSh1c2VybmFtZUVsLnZhbHVlICsgJzonICsgcGFzc3dvcmRFbC52YWx1ZSksIDE0KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGxvYWRpbmdCYXIuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiXHJcbiAgICAgICAgICAgIGNvbnN0IHQgPSBEYXRlLm5vdygpXHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5sYXN0VXBkYXRlID0gdFxyXG4gICAgICAgICAgICBpZiAobGFzdFVwZGF0ZUVsKSBsYXN0VXBkYXRlRWwuaW5uZXJIVE1MID0gZm9ybWF0VXBkYXRlKHQpXHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBwYXJzZShyZXNwLnJlc3BvbnNlKSAvLyBQYXJzZSB0aGUgZGF0YSBQQ1IgaGFzIHJlcGxpZWQgd2l0aFxyXG4gICAgICAgICAgICAgICAgb25zdWNjZXNzKClcclxuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZVdyaXRlKCdkYXRhJywgZ2V0RGF0YSgpKSAvLyBTdG9yZSBmb3Igb2ZmbGluZSB1c2VcclxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZSlcclxuICAgICAgICAgICAgICAgIGRpc3BsYXlFcnJvcihlKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgY29uc29sZS5sb2coJ0NvdWxkIG5vdCBsb2cgaW4gdG8gUENSLiBFaXRoZXIgeW91ciBuZXR3b3JrIGNvbm5lY3Rpb24gd2FzIGxvc3QgZHVyaW5nIHlvdXIgdmlzaXQgJyArXHJcbiAgICAgICAgICAgICAgICAgICAgICdvciBQQ1IgaXMganVzdCBub3Qgd29ya2luZy4gSGVyZVxcJ3MgdGhlIGVycm9yOicsIGVycm9yKVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0RGF0YSgpOiBJQXBwbGljYXRpb25EYXRhfHVuZGVmaW5lZCB7XHJcbiAgICByZXR1cm4gKHdpbmRvdyBhcyBhbnkpLmRhdGFcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldENsYXNzZXMoKTogc3RyaW5nW10ge1xyXG4gICAgY29uc3QgZGF0YSA9IGdldERhdGEoKVxyXG4gICAgaWYgKCFkYXRhKSByZXR1cm4gW11cclxuICAgIHJldHVybiBkYXRhLmNsYXNzZXNcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNldERhdGEoZGF0YTogSUFwcGxpY2F0aW9uRGF0YSk6IHZvaWQge1xyXG4gICAgKHdpbmRvdyBhcyBhbnkpLmRhdGEgPSBkYXRhXHJcbn1cclxuXHJcbi8vIEluIFBDUidzIGludGVyZmFjZSwgeW91IGNhbiBjbGljayBhIGRhdGUgaW4gbW9udGggb3Igd2VlayB2aWV3IHRvIHNlZSBpdCBpbiBkYXkgdmlldy5cclxuLy8gVGhlcmVmb3JlLCB0aGUgSFRNTCBlbGVtZW50IHRoYXQgc2hvd3MgdGhlIGRhdGUgdGhhdCB5b3UgY2FuIGNsaWNrIG9uIGhhcyBhIGh5cGVybGluayB0aGF0IGxvb2tzIGxpa2UgYCMyMDE1LTA0LTI2YC5cclxuLy8gVGhlIGZ1bmN0aW9uIGJlbG93IHdpbGwgcGFyc2UgdGhhdCBTdHJpbmcgYW5kIHJldHVybiBhIERhdGUgdGltZXN0YW1wXHJcbmZ1bmN0aW9uIHBhcnNlRGF0ZUhhc2goZWxlbWVudDogSFRNTEFuY2hvckVsZW1lbnQpOiBudW1iZXIge1xyXG4gICAgY29uc3QgW3llYXIsIG1vbnRoLCBkYXldID0gZWxlbWVudC5oYXNoLnN1YnN0cmluZygxKS5zcGxpdCgnLScpLm1hcChOdW1iZXIpXHJcbiAgICByZXR1cm4gKG5ldyBEYXRlKHllYXIsIG1vbnRoIC0gMSwgZGF5KSkuZ2V0VGltZSgpXHJcbn1cclxuXHJcbi8vIFRoZSAqYXR0YWNobWVudGlmeSogZnVuY3Rpb24gcGFyc2VzIHRoZSBib2R5IG9mIGFuIGFzc2lnbm1lbnQgKCp0ZXh0KikgYW5kIHJldHVybnMgdGhlIGFzc2lnbm1lbnQncyBhdHRhY2htZW50cy5cclxuLy8gU2lkZSBlZmZlY3Q6IHRoZXNlIGF0dGFjaG1lbnRzIGFyZSByZW1vdmVkXHJcbmZ1bmN0aW9uIGF0dGFjaG1lbnRpZnkoZWxlbWVudDogSFRNTEVsZW1lbnQpOiBBdHRhY2htZW50QXJyYXlbXSB7XHJcbiAgICBjb25zdCBhdHRhY2htZW50czogQXR0YWNobWVudEFycmF5W10gPSBbXVxyXG5cclxuICAgIC8vIEdldCBhbGwgbGlua3NcclxuICAgIGNvbnN0IGFzID0gQXJyYXkuZnJvbShlbGVtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdhJykpXHJcbiAgICBhcy5mb3JFYWNoKChhKSA9PiB7XHJcbiAgICAgICAgaWYgKGEuaWQuaW5jbHVkZXMoJ0F0dGFjaG1lbnQnKSkge1xyXG4gICAgICAgICAgICBhdHRhY2htZW50cy5wdXNoKFtcclxuICAgICAgICAgICAgICAgIGEuaW5uZXJIVE1MLFxyXG4gICAgICAgICAgICAgICAgYS5zZWFyY2ggKyBhLmhhc2hcclxuICAgICAgICAgICAgXSlcclxuICAgICAgICAgICAgYS5yZW1vdmUoKVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbiAgICByZXR1cm4gYXR0YWNobWVudHNcclxufVxyXG5cclxuY29uc3QgVVJMX1JFR0VYID0gbmV3IFJlZ0V4cChgKFxcXHJcbmh0dHBzPzpcXFxcL1xcXFwvXFxcclxuWy1BLVowLTkrJkAjXFxcXC8lPz1+X3whOiwuO10qXFxcclxuWy1BLVowLTkrJkAjXFxcXC8lPX5ffF0rXFxcclxuKWAsICdpZydcclxuKVxyXG5cclxuLy8gVGhpcyBmdW5jdGlvbiByZXBsYWNlcyB0ZXh0IHRoYXQgcmVwcmVzZW50cyBhIGh5cGVybGluayB3aXRoIGEgZnVuY3Rpb25hbCBoeXBlcmxpbmsgYnkgdXNpbmdcclxuLy8gamF2YXNjcmlwdCdzIHJlcGxhY2UgZnVuY3Rpb24gd2l0aCBhIHJlZ3VsYXIgZXhwcmVzc2lvbiBpZiB0aGUgdGV4dCBhbHJlYWR5IGlzbid0IHBhcnQgb2YgYVxyXG4vLyBoeXBlcmxpbmsuXHJcbmZ1bmN0aW9uIHVybGlmeSh0ZXh0OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRleHQucmVwbGFjZShVUkxfUkVHRVgsIChzdHIsIHN0cjIsIG9mZnNldCkgPT4geyAvLyBGdW5jdGlvbiB0byByZXBsYWNlIG1hdGNoZXNcclxuICAgICAgICBpZiAoL2hyZWZcXHMqPVxccyouLy50ZXN0KHRleHQuc3Vic3RyaW5nKG9mZnNldCAtIDEwLCBvZmZzZXQpKSB8fFxyXG4gICAgICAgICAgICAvb3JpZ2luYWxwYXRoXFxzKj1cXHMqLi8udGVzdCh0ZXh0LnN1YnN0cmluZyhvZmZzZXQgLSAyMCwgb2Zmc2V0KSlcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHN0clxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBgPGEgaHJlZj1cIiR7c3RyfVwiPiR7c3RyfTwvYT5gXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxufVxyXG5cclxuLy8gQWxzbywgUENSXCJzIGludGVyZmFjZSB1c2VzIGEgc3lzdGVtIG9mIElEcyB0byBpZGVudGlmeSBkaWZmZXJlbnQgZWxlbWVudHMuIEZvciBleGFtcGxlLCB0aGUgSUQgb2ZcclxuLy8gb25lIG9mIHRoZSBib3hlcyBzaG93aW5nIHRoZSBuYW1lIG9mIGFuIGFzc2lnbm1lbnQgY291bGQgYmVcclxuLy8gYGN0bDAwX2N0bDAwX2Jhc2VDb250ZW50X2Jhc2VDb250ZW50X2ZsYXNoVG9wX2N0bDAwX1JhZFNjaGVkdWxlcjFfOTVfMGAuIFRoZSBmdW5jdGlvbiBiZWxvdyB3aWxsXHJcbi8vIHJldHVybiB0aGUgZmlyc3QgSFRNTCBlbGVtZW50IHdob3NlIElEIGNvbnRhaW5zIGEgc3BlY2lmaWVkIFN0cmluZyAoKmlkKikgYW5kIGNvbnRhaW5pbmcgYVxyXG4vLyBzcGVjaWZpZWQgdGFnICgqdGFnKikuXHJcbmZ1bmN0aW9uIGZpbmRJZChlbGVtZW50OiBIVE1MRWxlbWVudHxIVE1MRG9jdW1lbnQsIHRhZzogc3RyaW5nLCBpZDogc3RyaW5nKTogSFRNTEVsZW1lbnQge1xyXG4gICAgY29uc3QgZWwgPSBbLi4uZWxlbWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSh0YWcpXS5maW5kKChlKSA9PiBlLmlkLmluY2x1ZGVzKGlkKSlcclxuICAgIGlmICghZWwpIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGZpbmQgZWxlbWVudCB3aXRoIHRhZyAke3RhZ30gYW5kIGlkICR7aWR9IGluICR7ZWxlbWVudH1gKVxyXG4gICAgcmV0dXJuIGVsIGFzIEhUTUxFbGVtZW50XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBhcnNlQXNzaWdubWVudFR5cGUodHlwZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0eXBlLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgnJiBxdWl6emVzJywgJycpLnJlcGxhY2UoJ3Rlc3RzJywgJ3Rlc3QnKVxyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJzZUFzc2lnbm1lbnRCYXNlVHlwZSh0eXBlOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHR5cGUudG9Mb3dlckNhc2UoKS5yZXBsYWNlKCcmIHF1aXp6ZXMnLCAnJykucmVwbGFjZSgvXFxzL2csICcnKS5yZXBsYWNlKCdxdWl6emVzJywgJ3Rlc3QnKVxyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJzZUFzc2lnbm1lbnQoY2E6IEhUTUxFbGVtZW50KTogSUFzc2lnbm1lbnQge1xyXG4gICAgY29uc3QgZGF0YSA9IGdldERhdGEoKVxyXG4gICAgaWYgKCFkYXRhKSB0aHJvdyBuZXcgRXJyb3IoJ0RhdGEgZGljdGlvbmFyeSBub3Qgc2V0IHVwJylcclxuXHJcbiAgICAvLyBUaGUgc3RhcnRpbmcgZGF0ZSBhbmQgZW5kaW5nIGRhdGUgb2YgdGhlIGFzc2lnbm1lbnQgYXJlIHBhcnNlZCBmaXJzdFxyXG4gICAgY29uc3QgcmFuZ2UgPSBmaW5kSWQoY2EsICdzcGFuJywgJ1N0YXJ0aW5nT24nKS5pbm5lckhUTUwuc3BsaXQoJyAtICcpXHJcbiAgICBjb25zdCBhc3NpZ25tZW50U3RhcnQgPSB0b0RhdGVOdW0oRGF0ZS5wYXJzZShyYW5nZVswXSkpXHJcbiAgICBjb25zdCBhc3NpZ25tZW50RW5kID0gKHJhbmdlWzFdICE9IG51bGwpID8gdG9EYXRlTnVtKERhdGUucGFyc2UocmFuZ2VbMV0pKSA6IGFzc2lnbm1lbnRTdGFydFxyXG5cclxuICAgIC8vIFRoZW4sIHRoZSBuYW1lIG9mIHRoZSBhc3NpZ25tZW50IGlzIHBhcnNlZFxyXG4gICAgY29uc3QgdCA9IGZpbmRJZChjYSwgJ3NwYW4nLCAnbGJsVGl0bGUnKVxyXG4gICAgbGV0IHRpdGxlID0gdC5pbm5lckhUTUxcclxuXHJcbiAgICAvLyBUaGUgYWN0dWFsIGJvZHkgb2YgdGhlIGFzc2lnbm1lbnQgYW5kIGl0cyBhdHRhY2htZW50cyBhcmUgcGFyc2VkIG5leHRcclxuICAgIGNvbnN0IGIgPSBfJChfJCh0LnBhcmVudE5vZGUpLnBhcmVudE5vZGUpIGFzIEhUTUxFbGVtZW50XHJcbiAgICBbLi4uYi5nZXRFbGVtZW50c0J5VGFnTmFtZSgnZGl2JyldLnNsaWNlKDAsIDIpLmZvckVhY2goKGRpdikgPT4gZGl2LnJlbW92ZSgpKVxyXG5cclxuICAgIGNvbnN0IGFwID0gYXR0YWNobWVudGlmeShiKSAvLyBTZXBhcmF0ZXMgYXR0YWNobWVudHMgZnJvbSB0aGUgYm9keVxyXG5cclxuICAgIC8vIFRoZSBsYXN0IFJlcGxhY2UgcmVtb3ZlcyBsZWFkaW5nIGFuZCB0cmFpbGluZyBuZXdsaW5lc1xyXG4gICAgY29uc3QgYXNzaWdubWVudEJvZHkgPSB1cmxpZnkoYi5pbm5lckhUTUwpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXig/Olxccyo8YnJcXHMqXFwvPz4pKi8sICcnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLyg/Olxccyo8YnJcXHMqXFwvPz4pKlxccyokLywgJycpLnRyaW0oKVxyXG5cclxuICAgIC8vIEZpbmFsbHksIHdlIHNlcGFyYXRlIHRoZSBjbGFzcyBuYW1lIGFuZCB0eXBlIChob21ld29yaywgY2xhc3N3b3JrLCBvciBwcm9qZWN0cykgZnJvbSB0aGUgdGl0bGUgb2YgdGhlIGFzc2lnbm1lbnRcclxuICAgIGNvbnN0IG1hdGNoZWRUaXRsZSA9IHRpdGxlLm1hdGNoKC9cXCgoW14pXSpcXCkqKVxcKSQvKVxyXG4gICAgaWYgKChtYXRjaGVkVGl0bGUgPT0gbnVsbCkpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBwYXJzZSBhc3NpZ25tZW50IHRpdGxlIFxcXCIke3RpdGxlfVxcXCJgKVxyXG4gICAgfVxyXG4gICAgY29uc3QgYXNzaWdubWVudFR5cGUgPSBtYXRjaGVkVGl0bGVbMV1cclxuICAgIGNvbnN0IGFzc2lnbm1lbnRCYXNlVHlwZSA9IHBhcnNlQXNzaWdubWVudEJhc2VUeXBlKGNhLnRpdGxlLnN1YnN0cmluZygwLCBjYS50aXRsZS5pbmRleE9mKCdcXG4nKSkpXHJcbiAgICBsZXQgYXNzaWdubWVudENsYXNzSW5kZXggPSBudWxsXHJcbiAgICBkYXRhLmNsYXNzZXMuc29tZSgoYywgcG9zKSA9PiB7XHJcbiAgICAgICAgaWYgKHRpdGxlLmluZGV4T2YoYykgIT09IC0xKSB7XHJcbiAgICAgICAgICAgIGFzc2lnbm1lbnRDbGFzc0luZGV4ID0gcG9zXHJcbiAgICAgICAgICAgIHRpdGxlID0gdGl0bGUucmVwbGFjZShjLCAnJylcclxuICAgICAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICB9KVxyXG5cclxuICAgIGlmIChhc3NpZ25tZW50Q2xhc3NJbmRleCA9PT0gbnVsbCB8fCBhc3NpZ25tZW50Q2xhc3NJbmRleCA9PT0gLTEpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBmaW5kIGNsYXNzIGluIHRpdGxlICR7dGl0bGV9IChjbGFzc2VzIGFyZSAke2RhdGEuY2xhc3Nlc31gKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGFzc2lnbm1lbnRUaXRsZSA9IHRpdGxlLnN1YnN0cmluZyh0aXRsZS5pbmRleE9mKCc6ICcpICsgMikucmVwbGFjZSgvXFwoW15cXChcXCldKlxcKSQvLCAnJykudHJpbSgpXHJcblxyXG4gICAgLy8gVG8gbWFrZSBzdXJlIHRoZXJlIGFyZSBubyByZXBlYXRzLCB0aGUgdGl0bGUgb2YgdGhlIGFzc2lnbm1lbnQgKG9ubHkgbGV0dGVycykgYW5kIGl0cyBzdGFydCAmXHJcbiAgICAvLyBlbmQgZGF0ZSBhcmUgY29tYmluZWQgdG8gZ2l2ZSBpdCBhIHVuaXF1ZSBpZGVudGlmaWVyLlxyXG4gICAgY29uc3QgYXNzaWdubWVudElkID0gYXNzaWdubWVudFRpdGxlLnJlcGxhY2UoL1teXFx3XSovZywgJycpICsgKGFzc2lnbm1lbnRTdGFydCArIGFzc2lnbm1lbnRFbmQpXHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBzdGFydDogYXNzaWdubWVudFN0YXJ0LFxyXG4gICAgICAgIGVuZDogYXNzaWdubWVudEVuZCxcclxuICAgICAgICBhdHRhY2htZW50czogYXAsXHJcbiAgICAgICAgYm9keTogYXNzaWdubWVudEJvZHksXHJcbiAgICAgICAgdHlwZTogYXNzaWdubWVudFR5cGUsXHJcbiAgICAgICAgYmFzZVR5cGU6IGFzc2lnbm1lbnRCYXNlVHlwZSxcclxuICAgICAgICBjbGFzczogYXNzaWdubWVudENsYXNzSW5kZXgsXHJcbiAgICAgICAgdGl0bGU6IGFzc2lnbm1lbnRUaXRsZSxcclxuICAgICAgICBpZDogYXNzaWdubWVudElkXHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIFRoZSBmdW5jdGlvbiBiZWxvdyB3aWxsIHBhcnNlIHRoZSBkYXRhIGdpdmVuIGJ5IFBDUiBhbmQgY29udmVydCBpdCBpbnRvIGFuIG9iamVjdC4gSWYgeW91IG9wZW4gdXBcclxuLy8gdGhlIGRldmVsb3BlciBjb25zb2xlIG9uIENoZWNrUENSIGFuZCB0eXBlIGluIGBkYXRhYCwgeW91IGNhbiBzZWUgdGhlIGFycmF5IGNvbnRhaW5pbmcgYWxsIG9mXHJcbi8vIHlvdXIgYXNzaWdubWVudHMuXHJcbmZ1bmN0aW9uIHBhcnNlKGRvYzogSFRNTERvY3VtZW50KTogdm9pZCB7XHJcbiAgICBjb25zb2xlLnRpbWUoJ0hhbmRsaW5nIGRhdGEnKSAvLyBUbyB0aW1lIGhvdyBsb25nIGl0IHRha2VzIHRvIHBhcnNlIHRoZSBhc3NpZ25tZW50c1xyXG4gICAgY29uc3QgaGFuZGxlZERhdGFTaG9ydDogc3RyaW5nW10gPSBbXSAvLyBBcnJheSB1c2VkIHRvIG1ha2Ugc3VyZSB3ZSBkb25cInQgcGFyc2UgdGhlIHNhbWUgYXNzaWdubWVudCB0d2ljZS5cclxuICAgIGNvbnN0IGRhdGE6IElBcHBsaWNhdGlvbkRhdGEgPSB7XHJcbiAgICAgICAgY2xhc3NlczogW10sXHJcbiAgICAgICAgYXNzaWdubWVudHM6IFtdLFxyXG4gICAgICAgIG1vbnRoVmlldzogKF8kKGRvYy5xdWVyeVNlbGVjdG9yKCcucnNIZWFkZXJNb250aCcpKS5wYXJlbnROb2RlIGFzIEhUTUxFbGVtZW50KS5jbGFzc0xpc3QuY29udGFpbnMoJ3JzU2VsZWN0ZWQnKVxyXG4gICAgfSAvLyBSZXNldCB0aGUgYXJyYXkgaW4gd2hpY2ggYWxsIG9mIHlvdXIgYXNzaWdubWVudHMgYXJlIHN0b3JlZCBpbi5cclxuICAgIHNldERhdGEoZGF0YSlcclxuXHJcbiAgICBkb2MucXVlcnlTZWxlY3RvckFsbCgnaW5wdXQ6bm90KFt0eXBlPVwic3VibWl0XCJdKScpLmZvckVhY2goKGUpID0+IHtcclxuICAgICAgICB2aWV3RGF0YVsoZSBhcyBIVE1MSW5wdXRFbGVtZW50KS5uYW1lXSA9IChlIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlIHx8ICcnXHJcbiAgICB9KVxyXG5cclxuICAgIC8vIE5vdywgdGhlIGNsYXNzZXMgeW91IHRha2UgYXJlIHBhcnNlZCAodGhlc2UgYXJlIHRoZSBjaGVja2JveGVzIHlvdSBzZWUgdXAgdG9wIHdoZW4gbG9va2luZyBhdCBQQ1IpLlxyXG4gICAgY29uc3QgY2xhc3NlcyA9IGZpbmRJZChkb2MsICd0YWJsZScsICdjYkNsYXNzZXMnKS5nZXRFbGVtZW50c0J5VGFnTmFtZSgnbGFiZWwnKVxyXG4gICAgY2xhc3Nlcy5mb3JFYWNoKChjKSA9PiB7XHJcbiAgICAgICAgZGF0YS5jbGFzc2VzLnB1c2goYy5pbm5lckhUTUwpXHJcbiAgICB9KVxyXG5cclxuICAgIGNvbnN0IGFzc2lnbm1lbnRzID0gZG9jLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3JzQXB0IHJzQXB0U2ltcGxlJylcclxuICAgIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwoYXNzaWdubWVudHMsIChhc3NpZ25tZW50RWw6IEhUTUxFbGVtZW50KSA9PiB7XHJcbiAgICAgICAgY29uc3QgYXNzaWdubWVudCA9IHBhcnNlQXNzaWdubWVudChhc3NpZ25tZW50RWwpXHJcbiAgICAgICAgaWYgKGhhbmRsZWREYXRhU2hvcnQuaW5kZXhPZihhc3NpZ25tZW50LmlkKSA9PT0gLTEpIHsgLy8gTWFrZSBzdXJlIHdlIGhhdmVuJ3QgYWxyZWFkeSBwYXJzZWQgdGhlIGFzc2lnbm1lbnRcclxuICAgICAgICAgICAgaGFuZGxlZERhdGFTaG9ydC5wdXNoKGFzc2lnbm1lbnQuaWQpXHJcbiAgICAgICAgICAgIGRhdGEuYXNzaWdubWVudHMucHVzaChhc3NpZ25tZW50KVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcblxyXG4gICAgY29uc29sZS50aW1lRW5kKCdIYW5kbGluZyBkYXRhJylcclxuXHJcbiAgICAvLyBOb3cgYWxsb3cgdGhlIHZpZXcgdG8gYmUgc3dpdGNoZWRcclxuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnbG9hZGVkJylcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVybEZvckF0dGFjaG1lbnQoc2VhcmNoOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIEFUVEFDSE1FTlRTX1VSTCArIHNlYXJjaFxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0QXR0YWNobWVudE1pbWVUeXBlKHNlYXJjaDogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgY29uc3QgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KClcclxuICAgICAgICByZXEub3BlbignSEVBRCcsIHVybEZvckF0dGFjaG1lbnQoc2VhcmNoKSlcclxuICAgICAgICByZXEub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAocmVxLnN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0eXBlID0gcmVxLmdldFJlc3BvbnNlSGVhZGVyKCdDb250ZW50LVR5cGUnKVxyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHR5cGUpXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoJ0NvbnRlbnQgdHlwZSBpcyBudWxsJykpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmVxLnNlbmQoKVxyXG4gICAgfSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNsYXNzQnlJZChpZDogbnVtYmVyfG51bGx8dW5kZWZpbmVkKTogc3RyaW5nIHtcclxuICAgIHJldHVybiAoaWQgPyBnZXRDbGFzc2VzKClbaWRdIDogbnVsbCkgfHwgJ1Vua25vd24gY2xhc3MnXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzd2l0Y2hWaWV3cygpOiB2b2lkIHtcclxuICAgIGlmIChPYmplY3Qua2V5cyh2aWV3RGF0YSkubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGVsZW1CeUlkKCdzaWRlQmFja2dyb3VuZCcpLmNsaWNrKClcclxuICAgICAgICB2aWV3RGF0YS5fX0VWRU5UVEFSR0VUID0gJ2N0bDAwJGN0bDAwJGJhc2VDb250ZW50JGJhc2VDb250ZW50JGZsYXNoVG9wJGN0bDAwJFJhZFNjaGVkdWxlcjEnXHJcbiAgICAgICAgdmlld0RhdGEuX19FVkVOVEFSR1VNRU5UID0gSlNPTi5zdHJpbmdpZnkoe1xyXG4gICAgICAgICAgICBDb21tYW5kOiBgU3dpdGNoVG8ke2RvY3VtZW50LmJvZHkuZ2V0QXR0cmlidXRlKCdkYXRhLXBjcnZpZXcnKSA9PT0gJ21vbnRoJyA/ICdXZWVrJyA6ICdNb250aCd9Vmlld2BcclxuICAgICAgICB9KVxyXG4gICAgICAgIHZpZXdEYXRhLmN0bDAwX2N0bDAwX2Jhc2VDb250ZW50X2Jhc2VDb250ZW50X2ZsYXNoVG9wX2N0bDAwX1JhZFNjaGVkdWxlcjFfQ2xpZW50U3RhdGUgPVxyXG4gICAgICAgICAgICBKU09OLnN0cmluZ2lmeSh7c2Nyb2xsVG9wOiAwLCBzY3JvbGxMZWZ0OiAwLCBpc0RpcnR5OiBmYWxzZX0pXHJcbiAgICAgICAgdmlld0RhdGEuY3RsMDBfY3RsMDBfUmFkU2NyaXB0TWFuYWdlcjFfVFNNID0gJzs7U3lzdGVtLldlYi5FeHRlbnNpb25zLCBWZXJzaW9uPTQuMC4wLjAsIEN1bHR1cmU9bmV1dHJhbCwgJyArXHJcbiAgICAgICAgICAgICdQdWJsaWNLZXlUb2tlbj0zMWJmMzg1NmFkMzY0ZTM1OmVuLVVTOmQyODU2OGQzLWU1M2UtNDcwNi05MjhmLTM3NjU5MTJiNjZjYTplYTU5N2Q0YjpiMjUzNzhkMidcclxuICAgICAgICBjb25zdCBwb3N0QXJyYXk6IHN0cmluZ1tdID0gW10gLy8gQXJyYXkgb2YgZGF0YSB0byBwb3N0XHJcbiAgICAgICAgT2JqZWN0LmVudHJpZXModmlld0RhdGEpLmZvckVhY2goKFtoLCB2XSkgPT4ge1xyXG4gICAgICAgICAgICBwb3N0QXJyYXkucHVzaChlbmNvZGVVUklDb21wb25lbnQoaCkgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQodikpXHJcbiAgICAgICAgfSlcclxuICAgICAgICBmZXRjaCh0cnVlLCBwb3N0QXJyYXkuam9pbignJicpKVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbG9nb3V0KCk6IHZvaWQge1xyXG4gICAgaWYgKE9iamVjdC5rZXlzKHZpZXdEYXRhKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgZGVsZXRlQ29va2llKCd1c2VyUGFzcycpXHJcbiAgICAgICAgZWxlbUJ5SWQoJ3NpZGVCYWNrZ3JvdW5kJykuY2xpY2soKVxyXG4gICAgICAgIHZpZXdEYXRhLl9fRVZFTlRUQVJHRVQgPSAnY3RsMDAkY3RsMDAkYmFzZUNvbnRlbnQkTG9nb3V0Q29udHJvbDEkTG9naW5TdGF0dXMxJGN0bDAwJ1xyXG4gICAgICAgIHZpZXdEYXRhLl9fRVZFTlRBUkdVTUVOVCA9ICcnXHJcbiAgICAgICAgdmlld0RhdGEuY3RsMDBfY3RsMDBfYmFzZUNvbnRlbnRfYmFzZUNvbnRlbnRfZmxhc2hUb3BfY3RsMDBfUmFkU2NoZWR1bGVyMV9DbGllbnRTdGF0ZSA9XHJcbiAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHtzY3JvbGxUb3A6IDAsIHNjcm9sbExlZnQ6IDAsIGlzRGlydHk6IGZhbHNlfSlcclxuICAgICAgICBjb25zdCBwb3N0QXJyYXk6IHN0cmluZ1tdID0gW10gLy8gQXJyYXkgb2YgZGF0YSB0byBwb3N0XHJcbiAgICAgICAgT2JqZWN0LmVudHJpZXModmlld0RhdGEpLmZvckVhY2goKFtoLCB2XSkgPT4ge1xyXG4gICAgICAgICAgICBwb3N0QXJyYXkucHVzaChlbmNvZGVVUklDb21wb25lbnQoaCkgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQodikpXHJcbiAgICAgICAgfSlcclxuICAgICAgICBmZXRjaCh0cnVlLCBwb3N0QXJyYXkuam9pbignJicpKVxyXG4gICAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgYWRkQWN0aXZpdHlFbGVtZW50LCBjcmVhdGVBY3Rpdml0eSB9IGZyb20gJy4uL2NvbXBvbmVudHMvYWN0aXZpdHknXHJcbmltcG9ydCB7IElBc3NpZ25tZW50IH0gZnJvbSAnLi4vcGNyJ1xyXG5pbXBvcnQgeyBsb2NhbFN0b3JhZ2VSZWFkLCBsb2NhbFN0b3JhZ2VXcml0ZSB9IGZyb20gJy4uL3V0aWwnXHJcblxyXG5leHBvcnQgdHlwZSBBY3Rpdml0eVR5cGUgPSAnZGVsZXRlJyB8ICdlZGl0JyB8ICdhZGQnXHJcbmV4cG9ydCB0eXBlIEFjdGl2aXR5SXRlbSA9IFtBY3Rpdml0eVR5cGUsIElBc3NpZ25tZW50LCBudW1iZXIsIHN0cmluZyB8IHVuZGVmaW5lZF1cclxuXHJcbmNvbnN0IEFDVElWSVRZX1NUT1JBR0VfTkFNRSA9ICdhY3Rpdml0eSdcclxuXHJcbmxldCBhY3Rpdml0eTogQWN0aXZpdHlJdGVtW10gPSBsb2NhbFN0b3JhZ2VSZWFkKEFDVElWSVRZX1NUT1JBR0VfTkFNRSkgfHwgW11cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBhZGRBY3Rpdml0eSh0eXBlOiBBY3Rpdml0eVR5cGUsIGFzc2lnbm1lbnQ6IElBc3NpZ25tZW50LCBkYXRlOiBEYXRlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3QWN0aXZpdHk6IGJvb2xlYW4sIGNsYXNzTmFtZT86IHN0cmluZyApOiB2b2lkIHtcclxuICAgIGlmIChuZXdBY3Rpdml0eSkgYWN0aXZpdHkucHVzaChbdHlwZSwgYXNzaWdubWVudCwgRGF0ZS5ub3coKSwgY2xhc3NOYW1lXSlcclxuICAgIGNvbnN0IGVsID0gY3JlYXRlQWN0aXZpdHkodHlwZSwgYXNzaWdubWVudCwgZGF0ZSwgY2xhc3NOYW1lKVxyXG4gICAgYWRkQWN0aXZpdHlFbGVtZW50KGVsKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2F2ZUFjdGl2aXR5KCk6IHZvaWQge1xyXG4gICAgYWN0aXZpdHkgPSBhY3Rpdml0eS5zbGljZShhY3Rpdml0eS5sZW5ndGggLSAxMjgsIGFjdGl2aXR5Lmxlbmd0aClcclxuICAgIGxvY2FsU3RvcmFnZVdyaXRlKEFDVElWSVRZX1NUT1JBR0VfTkFNRSwgYWN0aXZpdHkpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZWNlbnRBY3Rpdml0eSgpOiBBY3Rpdml0eUl0ZW1bXSB7XHJcbiAgICByZXR1cm4gYWN0aXZpdHkuc2xpY2UoYWN0aXZpdHkubGVuZ3RoIC0gMzIsIGFjdGl2aXR5Lmxlbmd0aClcclxufVxyXG4iLCJpbXBvcnQgeyBlbGVtQnlJZCwgbG9jYWxTdG9yYWdlUmVhZCwgbG9jYWxTdG9yYWdlV3JpdGUgfSBmcm9tICcuLi91dGlsJ1xyXG5cclxuY29uc3QgQVRIRU5BX1NUT1JBR0VfTkFNRSA9ICdhdGhlbmFEYXRhJ1xyXG5cclxuaW50ZXJmYWNlIElSYXdBdGhlbmFEYXRhIHtcclxuICAgIHJlc3BvbnNlX2NvZGU6IDIwMFxyXG4gICAgYm9keToge1xyXG4gICAgICAgIGNvdXJzZXM6IHtcclxuICAgICAgICAgICAgY291cnNlczogSVJhd0NvdXJzZVtdXHJcbiAgICAgICAgICAgIHNlY3Rpb25zOiBJUmF3U2VjdGlvbltdXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcGVybWlzc2lvbnM6IGFueVxyXG59XHJcblxyXG5pbnRlcmZhY2UgSVJhd0NvdXJzZSB7XHJcbiAgICBuaWQ6IG51bWJlclxyXG4gICAgY291cnNlX3RpdGxlOiBzdHJpbmdcclxuICAgIC8vIFRoZXJlJ3MgYSBidW5jaCBtb3JlIHRoYXQgSSd2ZSBvbWl0dGVkXHJcbn1cclxuXHJcbmludGVyZmFjZSBJUmF3U2VjdGlvbiB7XHJcbiAgICBjb3Vyc2VfbmlkOiBudW1iZXJcclxuICAgIGxpbms6IHN0cmluZ1xyXG4gICAgbG9nbzogc3RyaW5nXHJcbiAgICBzZWN0aW9uX3RpdGxlOiBzdHJpbmdcclxuICAgIC8vIFRoZXJlJ3MgYSBidW5jaCBtb3JlIHRoYXQgSSd2ZSBvbWl0dGVkXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUF0aGVuYURhdGFJdGVtIHtcclxuICAgIGxpbms6IHN0cmluZ1xyXG4gICAgbG9nbzogc3RyaW5nXHJcbiAgICBwZXJpb2Q6IHN0cmluZ1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElBdGhlbmFEYXRhIHtcclxuICAgIFtjbHM6IHN0cmluZ106IElBdGhlbmFEYXRhSXRlbVxyXG59XHJcblxyXG5sZXQgYXRoZW5hRGF0YTogSUF0aGVuYURhdGF8bnVsbCA9IGxvY2FsU3RvcmFnZVJlYWQoQVRIRU5BX1NUT1JBR0VfTkFNRSlcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRBdGhlbmFEYXRhKCk6IElBdGhlbmFEYXRhfG51bGwge1xyXG4gICAgcmV0dXJuIGF0aGVuYURhdGFcclxufVxyXG5cclxuZnVuY3Rpb24gZm9ybWF0TG9nbyhsb2dvOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIGxvZ28uc3Vic3RyKDAsIGxvZ28uaW5kZXhPZignXCIgYWx0PVwiJykpXHJcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgnPGRpdiBjbGFzcz1cInByb2ZpbGUtcGljdHVyZVwiPjxpbWcgc3JjPVwiJywgJycpXHJcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgndGlueScsICdyZWcnKVxyXG59XHJcblxyXG4vLyBOb3csIHRoZXJlJ3MgdGhlIHNjaG9vbG9neS9hdGhlbmEgaW50ZWdyYXRpb24gc3R1ZmYuIEZpcnN0LCB3ZSBuZWVkIHRvIGNoZWNrIGlmIGl0J3MgYmVlbiBtb3JlXHJcbi8vIHRoYW4gYSBkYXkuIFRoZXJlJ3Mgbm8gcG9pbnQgY29uc3RhbnRseSByZXRyaWV2aW5nIGNsYXNzZXMgZnJvbSBBdGhlbmE7IHRoZXkgZG9udCd0IGNoYW5nZSB0aGF0XHJcbi8vIG11Y2guXHJcblxyXG4vLyBUaGVuLCBvbmNlIHRoZSB2YXJpYWJsZSBmb3IgdGhlIGxhc3QgZGF0ZSBpcyBpbml0aWFsaXplZCwgaXQncyB0aW1lIHRvIGdldCB0aGUgY2xhc3NlcyBmcm9tXHJcbi8vIGF0aGVuYS4gTHVja2lseSwgdGhlcmUncyB0aGlzIGZpbGUgYXQgL2lhcGkvY291cnNlL2FjdGl2ZSAtIGFuZCBpdCdzIGluIEpTT04hIExpZmUgY2FuJ3QgYmUgYW55XHJcbi8vIGJldHRlciEgU2VyaW91c2x5ISBJdCdzIGp1c3QgdG9vIGJhZCB0aGUgbG9naW4gcGFnZSBpc24ndCBpbiBKU09OLlxyXG5mdW5jdGlvbiBwYXJzZUF0aGVuYURhdGEoZGF0OiBzdHJpbmcpOiBJQXRoZW5hRGF0YXxudWxsIHtcclxuICAgIGlmIChkYXQgPT09ICcnKSByZXR1cm4gbnVsbFxyXG4gICAgY29uc3QgZCA9IEpTT04ucGFyc2UoZGF0KSBhcyBJUmF3QXRoZW5hRGF0YVxyXG4gICAgY29uc3QgYXRoZW5hRGF0YTI6IElBdGhlbmFEYXRhID0ge31cclxuICAgIGNvbnN0IGFsbENvdXJzZURldGFpbHM6IHsgW25pZDogbnVtYmVyXTogSVJhd1NlY3Rpb24gfSA9IHt9XHJcbiAgICBkLmJvZHkuY291cnNlcy5zZWN0aW9ucy5mb3JFYWNoKChzZWN0aW9uKSA9PiB7XHJcbiAgICAgICAgYWxsQ291cnNlRGV0YWlsc1tzZWN0aW9uLmNvdXJzZV9uaWRdID0gc2VjdGlvblxyXG4gICAgfSlcclxuICAgIGQuYm9keS5jb3Vyc2VzLmNvdXJzZXMucmV2ZXJzZSgpLmZvckVhY2goKGNvdXJzZSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGNvdXJzZURldGFpbHMgPSBhbGxDb3Vyc2VEZXRhaWxzW2NvdXJzZS5uaWRdXHJcbiAgICAgICAgYXRoZW5hRGF0YTJbY291cnNlLmNvdXJzZV90aXRsZV0gPSB7XHJcbiAgICAgICAgICAgIGxpbms6IGBodHRwczovL2F0aGVuYS5oYXJrZXIub3JnJHtjb3Vyc2VEZXRhaWxzLmxpbmt9YCxcclxuICAgICAgICAgICAgbG9nbzogZm9ybWF0TG9nbyhjb3Vyc2VEZXRhaWxzLmxvZ28pLFxyXG4gICAgICAgICAgICBwZXJpb2Q6IGNvdXJzZURldGFpbHMuc2VjdGlvbl90aXRsZVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbiAgICByZXR1cm4gYXRoZW5hRGF0YTJcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZUF0aGVuYURhdGEoZGF0YTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICBjb25zdCByZWZyZXNoRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXRoZW5hRGF0YVJlZnJlc2gnKVxyXG4gICAgdHJ5IHtcclxuICAgICAgICBhdGhlbmFEYXRhID0gcGFyc2VBdGhlbmFEYXRhKGRhdGEpXHJcbiAgICAgICAgbG9jYWxTdG9yYWdlV3JpdGUoQVRIRU5BX1NUT1JBR0VfTkFNRSwgZGF0YSlcclxuICAgICAgICBlbGVtQnlJZCgnYXRoZW5hRGF0YUVycm9yJykuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xyXG4gICAgICAgIGlmIChyZWZyZXNoRWwpIHJlZnJlc2hFbC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgIGVsZW1CeUlkKCdhdGhlbmFEYXRhRXJyb3InKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xyXG4gICAgICAgIGlmIChyZWZyZXNoRWwpIHJlZnJlc2hFbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXHJcbiAgICAgICAgZWxlbUJ5SWQoJ2F0aGVuYURhdGFFcnJvcicpLmlubmVySFRNTCA9IGUubWVzc2FnZVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IGdldERhdGEsIElBcHBsaWNhdGlvbkRhdGEsIElBc3NpZ25tZW50IH0gZnJvbSAnLi4vcGNyJ1xyXG5pbXBvcnQgeyBsb2NhbFN0b3JhZ2VSZWFkLCBsb2NhbFN0b3JhZ2VXcml0ZSB9IGZyb20gJy4uL3V0aWwnXHJcblxyXG5jb25zdCBDVVNUT01fU1RPUkFHRV9OQU1FID0gJ2V4dHJhJ1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJQ3VzdG9tQXNzaWdubWVudCB7XHJcbiAgICBib2R5OiBzdHJpbmdcclxuICAgIGRvbmU6IGJvb2xlYW5cclxuICAgIHN0YXJ0OiBudW1iZXJcclxuICAgIGNsYXNzOiBzdHJpbmd8bnVsbFxyXG4gICAgZW5kOiBudW1iZXJ8J0ZvcmV2ZXInXHJcbn1cclxuXHJcbmNvbnN0IGV4dHJhOiBJQ3VzdG9tQXNzaWdubWVudFtdID0gbG9jYWxTdG9yYWdlUmVhZChDVVNUT01fU1RPUkFHRV9OQU1FLCBbXSlcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRFeHRyYSgpOiBJQ3VzdG9tQXNzaWdubWVudFtdIHtcclxuICAgIHJldHVybiBleHRyYVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2F2ZUV4dHJhKCk6IHZvaWQge1xyXG4gICAgbG9jYWxTdG9yYWdlV3JpdGUoQ1VTVE9NX1NUT1JBR0VfTkFNRSwgZXh0cmEpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBhZGRUb0V4dHJhKGN1c3RvbTogSUN1c3RvbUFzc2lnbm1lbnQpOiB2b2lkIHtcclxuICAgIGV4dHJhLnB1c2goY3VzdG9tKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlRnJvbUV4dHJhKGN1c3RvbTogSUN1c3RvbUFzc2lnbm1lbnQpOiB2b2lkIHtcclxuICAgIGlmICghZXh0cmEuaW5jbHVkZXMoY3VzdG9tKSkgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgcmVtb3ZlIGN1c3RvbSBhc3NpZ25tZW50IHRoYXQgZG9lcyBub3QgZXhpc3QnKVxyXG4gICAgZXh0cmEuc3BsaWNlKGV4dHJhLmluZGV4T2YoY3VzdG9tKSwgMSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGV4dHJhVG9UYXNrKGN1c3RvbTogSUN1c3RvbUFzc2lnbm1lbnQsIGRhdGE6IElBcHBsaWNhdGlvbkRhdGEpOiBJQXNzaWdubWVudCB7XHJcbiAgICBsZXQgY2xzOiBudW1iZXJ8bnVsbCA9IG51bGxcclxuICAgIGNvbnN0IGNsYXNzTmFtZSA9IGN1c3RvbS5jbGFzc1xyXG4gICAgaWYgKGNsYXNzTmFtZSAhPSBudWxsKSB7XHJcbiAgICAgICAgY2xzID0gZGF0YS5jbGFzc2VzLmZpbmRJbmRleCgoYykgPT4gYy50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKGNsYXNzTmFtZSkpXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0aXRsZTogJ1Rhc2snLFxyXG4gICAgICAgIGJhc2VUeXBlOiAndGFzaycsXHJcbiAgICAgICAgdHlwZTogJ3Rhc2snLFxyXG4gICAgICAgIGF0dGFjaG1lbnRzOiBbXSxcclxuICAgICAgICBzdGFydDogY3VzdG9tLnN0YXJ0LFxyXG4gICAgICAgIGVuZDogY3VzdG9tLmVuZCB8fCAnRm9yZXZlcicsXHJcbiAgICAgICAgYm9keTogY3VzdG9tLmJvZHksXHJcbiAgICAgICAgaWQ6IGB0YXNrJHtjdXN0b20uYm9keS5yZXBsYWNlKC9bXlxcd10qL2csICcnKX0ke2N1c3RvbS5zdGFydH0ke2N1c3RvbS5lbmR9JHtjdXN0b20uY2xhc3N9YCxcclxuICAgICAgICBjbGFzczogY2xzID09PSAtMSA/IG51bGwgOiBjbHNcclxuICAgIH1cclxufVxyXG5cclxuaW50ZXJmYWNlIElQYXJzZVJlc3VsdCB7XHJcbiAgICB0ZXh0OiBzdHJpbmdcclxuICAgIGNscz86IHN0cmluZ1xyXG4gICAgZHVlPzogc3RyaW5nXHJcbiAgICBzdD86IHN0cmluZ1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VDdXN0b21UYXNrKHRleHQ6IHN0cmluZywgcmVzdWx0OiBJUGFyc2VSZXN1bHQgPSB7IHRleHQ6ICcnIH0pOiBJUGFyc2VSZXN1bHQge1xyXG4gICAgY29uc3QgcGFyc2VkID0gdGV4dC5tYXRjaCgvKC4qKSAoZm9yfGJ5fGR1ZXxhc3NpZ25lZHxzdGFydGluZ3xlbmRpbmd8YmVnaW5uaW5nKSAoLiopLylcclxuICAgIGlmIChwYXJzZWQgPT0gbnVsbCkge1xyXG4gICAgICAgIHJlc3VsdC50ZXh0ID0gdGV4dFxyXG4gICAgICAgIHJldHVybiByZXN1bHRcclxuICAgIH1cclxuXHJcbiAgICBzd2l0Y2ggKHBhcnNlZFsyXSkge1xyXG4gICAgICAgIGNhc2UgJ2Zvcic6IHJlc3VsdC5jbHMgPSBwYXJzZWRbM107IGJyZWFrXHJcbiAgICAgICAgY2FzZSAnYnknOiBjYXNlICdkdWUnOiBjYXNlICdlbmRpbmcnOiByZXN1bHQuZHVlID0gcGFyc2VkWzNdOyBicmVha1xyXG4gICAgICAgIGNhc2UgJ2Fzc2lnbmVkJzogY2FzZSAnc3RhcnRpbmcnOiBjYXNlICdiZWdpbm5pbmcnOiByZXN1bHQuc3QgPSBwYXJzZWRbM107IGJyZWFrXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHBhcnNlQ3VzdG9tVGFzayhwYXJzZWRbMV0sIHJlc3VsdClcclxufVxyXG4iLCJpbXBvcnQgeyBsb2NhbFN0b3JhZ2VSZWFkLCBsb2NhbFN0b3JhZ2VXcml0ZSB9IGZyb20gJy4uL3V0aWwnXHJcblxyXG5jb25zdCBET05FX1NUT1JBR0VfTkFNRSA9ICdkb25lJ1xyXG5cclxuY29uc3QgZG9uZTogc3RyaW5nW10gPSBsb2NhbFN0b3JhZ2VSZWFkKERPTkVfU1RPUkFHRV9OQU1FLCBbXSlcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVGcm9tRG9uZShpZDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICBjb25zdCBpbmRleCA9IGRvbmUuaW5kZXhPZihpZClcclxuICAgIGlmIChpbmRleCA+PSAwKSBkb25lLnNwbGljZShpbmRleCwgMSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFkZFRvRG9uZShpZDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICBkb25lLnB1c2goaWQpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlRG9uZSgpOiB2b2lkIHtcclxuICAgIGxvY2FsU3RvcmFnZVdyaXRlKERPTkVfU1RPUkFHRV9OQU1FLCBkb25lKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYXNzaWdubWVudEluRG9uZShpZDogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gZG9uZS5pbmNsdWRlcyhpZClcclxufVxyXG4iLCJpbXBvcnQgeyBsb2NhbFN0b3JhZ2VSZWFkLCBsb2NhbFN0b3JhZ2VXcml0ZSB9IGZyb20gJy4uL3V0aWwnXHJcblxyXG5jb25zdCBNT0RJRklFRF9TVE9SQUdFX05BTUUgPSAnbW9kaWZpZWQnXHJcblxyXG5pbnRlcmZhY2UgSU1vZGlmaWVkQm9kaWVzIHtcclxuICAgIFtpZDogc3RyaW5nXTogc3RyaW5nXHJcbn1cclxuXHJcbmNvbnN0IG1vZGlmaWVkOiBJTW9kaWZpZWRCb2RpZXMgPSBsb2NhbFN0b3JhZ2VSZWFkKE1PRElGSUVEX1NUT1JBR0VfTkFNRSwge30pXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlRnJvbU1vZGlmaWVkKGlkOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgIGRlbGV0ZSBtb2RpZmllZFtpZF1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVNb2RpZmllZCgpOiB2b2lkIHtcclxuICAgIGxvY2FsU3RvcmFnZVdyaXRlKE1PRElGSUVEX1NUT1JBR0VfTkFNRSwgbW9kaWZpZWQpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBhc3NpZ25tZW50SW5Nb2RpZmllZChpZDogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gbW9kaWZpZWQuaGFzT3duUHJvcGVydHkoaWQpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBtb2RpZmllZEJvZHkoaWQ6IHN0cmluZyk6IHN0cmluZ3x1bmRlZmluZWQge1xyXG4gICAgcmV0dXJuIG1vZGlmaWVkW2lkXVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2V0TW9kaWZpZWQoaWQ6IHN0cmluZywgYm9keTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICBtb2RpZmllZFtpZF0gPSBib2R5XHJcbn1cclxuIiwiaW1wb3J0IHsgbG9jYWxTdG9yYWdlUmVhZCwgbG9jYWxTdG9yYWdlV3JpdGUgfSBmcm9tICcuL3V0aWwnXHJcblxyXG50eXBlIEFzc2lnbm1lbnRTcGFuID0gJ211bHRpcGxlJyB8ICdzdGFydCcgfCAnZW5kJ1xyXG50eXBlIEhpZGVBc3NpZ25tZW50cyA9ICdkYXknIHwgJ21zJyB8ICd1cydcclxudHlwZSBDb2xvclR5cGUgPSAnYXNzaWdubWVudCcgfCAnY2xhc3MnXHJcbmludGVyZmFjZSBJU2hvd25BY3Rpdml0eSB7XHJcbiAgICBhZGQ6IGJvb2xlYW5cclxuICAgIGVkaXQ6IGJvb2xlYW5cclxuICAgIGRlbGV0ZTogYm9vbGVhblxyXG59XHJcblxyXG5leHBvcnQgY29uc3Qgc2V0dGluZ3MgPSB7XHJcbiAgICAvKipcclxuICAgICAqIE1pbnV0ZXMgYmV0d2VlbiBlYWNoIGF1dG9tYXRpYyByZWZyZXNoIG9mIHRoZSBwYWdlLiBOZWdhdGl2ZSBudW1iZXJzIGluZGljYXRlIG5vIGF1dG9tYXRpY1xyXG4gICAgICogcmVmcmVzaGluZy5cclxuICAgICAqL1xyXG4gICAgZ2V0IHJlZnJlc2hSYXRlKCk6IG51bWJlciB7IHJldHVybiBsb2NhbFN0b3JhZ2VSZWFkKCdyZWZyZXNoUmF0ZScsIC0xKSB9LFxyXG4gICAgc2V0IHJlZnJlc2hSYXRlKHY6IG51bWJlcikgeyBsb2NhbFN0b3JhZ2VXcml0ZSgncmVmcmVzaFJhdGUnLCB2KSB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogV2hldGhlciB0aGUgd2luZG93IHNob3VsZCByZWZyZXNoIGFzc2lnbm1lbnQgZGF0YSB3aGVuIGZvY3Vzc2VkXHJcbiAgICAgKi9cclxuICAgIGdldCByZWZyZXNoT25Gb2N1cygpOiBib29sZWFuIHsgcmV0dXJuIGxvY2FsU3RvcmFnZVJlYWQoJ3JlZnJlc2hPbkZvY3VzJywgdHJ1ZSkgfSxcclxuICAgIHNldCByZWZyZXNoT25Gb2N1cyh2OiBib29sZWFuKSB7IGxvY2FsU3RvcmFnZVdyaXRlKCdyZWZyZXNoT25Gb2N1cycsIHYpIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBXaGV0aGVyIHN3aXRjaGluZyBiZXR3ZWVuIHZpZXdzIHNob3VsZCBiZSBhbmltYXRlZFxyXG4gICAgICovXHJcbiAgICBnZXQgdmlld1RyYW5zKCk6IGJvb2xlYW4geyByZXR1cm4gbG9jYWxTdG9yYWdlUmVhZCgndmlld1RyYW5zJywgdHJ1ZSkgfSxcclxuICAgIHNldCB2aWV3VHJhbnModjogYm9vbGVhbikgeyBsb2NhbFN0b3JhZ2VXcml0ZSgndmlld1RyYW5zJywgdikgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIE51bWJlciBvZiBkYXlzIGVhcmx5IHRvIHNob3cgdGVzdHMgaW4gbGlzdCB2aWV3XHJcbiAgICAgKi9cclxuICAgIGdldCBlYXJseVRlc3QoKTogbnVtYmVyIHsgcmV0dXJuIGxvY2FsU3RvcmFnZVJlYWQoJ2Vhcmx5VGVzdCcsIDEpIH0sXHJcbiAgICBzZXQgZWFybHlUZXN0KHY6IG51bWJlcikgeyBsb2NhbFN0b3JhZ2VXcml0ZSgnZWFybHlUZXN0JywgdikgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIFdoZXRoZXIgdG8gdGFrZSB0YXNrcyBvZmYgdGhlIGNhbGVuZGFyIHZpZXcgYW5kIHNob3cgdGhlbSBpbiB0aGUgaW5mbyBwYW5lXHJcbiAgICAgKi9cclxuICAgIGdldCBzZXBUYXNrcygpOiBib29sZWFuIHsgcmV0dXJuIGxvY2FsU3RvcmFnZVJlYWQoJ3NlcFRhc2tzJywgZmFsc2UpIH0sXHJcbiAgICBzZXQgc2VwVGFza3ModjogYm9vbGVhbikgeyBsb2NhbFN0b3JhZ2VXcml0ZSgnc2VwVGFza3MnLCB2KSB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogV2hldGhlciB0YXNrcyBzaG91bGQgaGF2ZSB0aGVpciBvd24gY29sb3JcclxuICAgICAqL1xyXG4gICAgZ2V0IHNlcFRhc2tDbGFzcygpOiBib29sZWFuIHsgcmV0dXJuIGxvY2FsU3RvcmFnZVJlYWQoJ3NlcFRhc2tDbGFzcycsIGZhbHNlKSB9LFxyXG4gICAgc2V0IHNlcFRhc2tDbGFzcyh2OiBib29sZWFuKSB7IGxvY2FsU3RvcmFnZVdyaXRlKCdzZXBUYXNrQ2xhc3MnLCB2KSB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogV2hldGhlciBwcm9qZWN0cyBzaG93IHVwIGluIHRoZSB0ZXN0IHBhZ2VcclxuICAgICAqL1xyXG4gICAgZ2V0IHByb2plY3RzSW5UZXN0UGFuZSgpOiBib29sZWFuIHsgcmV0dXJuIGxvY2FsU3RvcmFnZVJlYWQoJ3Byb2plY3RzSW5UZXN0UGFuZScsIGZhbHNlKSB9LFxyXG4gICAgc2V0IHByb2plY3RzSW5UZXN0UGFuZSh2OiBib29sZWFuKSB7IGxvY2FsU3RvcmFnZVdyaXRlKCdwcm9qZWN0c0luVGVzdFBhbmUnLCB2KSB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogV2hlbiBhc3NpZ25tZW50cyBzaG91bGQgYmUgc2hvd24gb24gY2FsZW5kYXIgdmlld1xyXG4gICAgICovXHJcbiAgICBnZXQgYXNzaWdubWVudFNwYW4oKTogQXNzaWdubWVudFNwYW4geyByZXR1cm4gbG9jYWxTdG9yYWdlUmVhZCgnYXNzaWdubWVudFNwYW4nLCAnbXVsdGlwbGUnKSB9LFxyXG4gICAgc2V0IGFzc2lnbm1lbnRTcGFuKHY6IEFzc2lnbm1lbnRTcGFuKSB7IGxvY2FsU3RvcmFnZVdyaXRlKCdhc3NpZ25tZW50U3BhbicsIHYpIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBXaGVuIGFzc2lnbm1lbnRzIHNob3VsZCBkaXNhcHBlYXIgZnJvbSBsaXN0IHZpZXdcclxuICAgICAqL1xyXG4gICAgZ2V0IGhpZGVBc3NpZ25tZW50cygpOiBIaWRlQXNzaWdubWVudHMgeyByZXR1cm4gbG9jYWxTdG9yYWdlUmVhZCgnaGlkZUFzc2lnbm1lbnRzJywgJ2RheScpIH0sXHJcbiAgICBzZXQgaGlkZUFzc2lnbm1lbnRzKHY6IEhpZGVBc3NpZ25tZW50cykgeyBsb2NhbFN0b3JhZ2VXcml0ZSgnaGlkZUFzc2lnbm1lbnRzJywgdikgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIFdoZXRoZXIgdG8gdXNlIGhvbGlkYXkgdGhlbWluZ1xyXG4gICAgICovXHJcbiAgICBnZXQgaG9saWRheVRoZW1lcygpOiBib29sZWFuIHsgcmV0dXJuIGxvY2FsU3RvcmFnZVJlYWQoJ2hvbGlkYXlUaGVtZXMnLCBmYWxzZSkgfSxcclxuICAgIHNldCBob2xpZGF5VGhlbWVzKHY6IGJvb2xlYW4pIHsgbG9jYWxTdG9yYWdlV3JpdGUoJ2hvbGlkYXlUaGVtZXMnLCB2KSB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogV2hldGhlciB0byBjb2xvciBhc3NpZ25tZW50cyBiYXNlZCBvbiB0aGVpciB0eXBlIG9yIGNsYXNzXHJcbiAgICAgKi9cclxuICAgIGdldCBjb2xvclR5cGUoKTogQ29sb3JUeXBlIHsgcmV0dXJuIGxvY2FsU3RvcmFnZVJlYWQoJ2NvbG9yVHlwZScsICdhc3NpZ25tZW50JykgfSxcclxuICAgIHNldCBjb2xvclR5cGUodjogQ29sb3JUeXBlKSB7IGxvY2FsU3RvcmFnZVdyaXRlKCdjb2xvclR5cGUnLCB2KSB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogV2hpY2ggdHlwZXMgb2YgYWN0aXZpdHkgYXJlIHNob3duIGluIHRoZSBhY3Rpdml0eSBwYW5lXHJcbiAgICAgKi9cclxuICAgIGdldCBzaG93bkFjdGl2aXR5KCk6IElTaG93bkFjdGl2aXR5IHsgcmV0dXJuIGxvY2FsU3RvcmFnZVJlYWQoJ3Nob3duQWN0aXZpdHknLCB7XHJcbiAgICAgICAgYWRkOiB0cnVlLFxyXG4gICAgICAgIGVkaXQ6IHRydWUsXHJcbiAgICAgICAgZGVsZXRlOiB0cnVlXHJcbiAgICB9KSB9LFxyXG4gICAgc2V0IHNob3duQWN0aXZpdHkodjogSVNob3duQWN0aXZpdHkpIHsgbG9jYWxTdG9yYWdlV3JpdGUoJ3Nob3duQWN0aXZpdHknLCB2KSB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogV2hldGhlciB0byBkaXNwbGF5IHRhc2tzIGluIHRoZSB0YXNrIHBhbmUgdGhhdCBhcmUgY29tcGxldGVkXHJcbiAgICAgKi9cclxuICAgIGdldCBzaG93RG9uZVRhc2tzKCk6IGJvb2xlYW4geyByZXR1cm4gbG9jYWxTdG9yYWdlUmVhZCgnc2hvd0RvbmVUYXNrcycsIGZhbHNlKSB9LFxyXG4gICAgc2V0IHNob3dEb25lVGFza3ModjogYm9vbGVhbikgeyBsb2NhbFN0b3JhZ2VXcml0ZSgnc2hvd0RvbmVUYXNrcycsIHYpIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFNldHRpbmcobmFtZTogc3RyaW5nKTogYW55IHtcclxuICAgIGlmICghc2V0dGluZ3MuaGFzT3duUHJvcGVydHkobmFtZSkpIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBzZXR0aW5nIG5hbWUgJHtuYW1lfWApXHJcbiAgICAvLyBAdHMtaWdub3JlXHJcbiAgICByZXR1cm4gc2V0dGluZ3NbbmFtZV1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNldFNldHRpbmcobmFtZTogc3RyaW5nLCB2YWx1ZTogYW55KTogdm9pZCB7XHJcbiAgICBpZiAoIXNldHRpbmdzLmhhc093blByb3BlcnR5KG5hbWUpKSB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgc2V0dGluZyBuYW1lICR7bmFtZX1gKVxyXG4gICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgc2V0dGluZ3NbbmFtZV0gPSB2YWx1ZVxyXG59XHJcbiIsImltcG9ydCB7IGZyb21EYXRlTnVtLCB0b0RhdGVOdW0gfSBmcm9tICcuL2RhdGVzJ1xyXG5cclxuLy8gQHRzLWlnbm9yZSBUT0RPOiBNYWtlIHRoaXMgbGVzcyBoYWNreVxyXG5Ob2RlTGlzdC5wcm90b3R5cGUuZm9yRWFjaCA9IEhUTUxDb2xsZWN0aW9uLnByb3RvdHlwZS5mb3JFYWNoID0gQXJyYXkucHJvdG90eXBlLmZvckVhY2hcclxuXHJcbi8qKlxyXG4gKiBGb3JjZXMgYSBsYXlvdXQgb24gYW4gZWxlbWVudFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGZvcmNlTGF5b3V0KGVsOiBIVE1MRWxlbWVudCk6IHZvaWQge1xyXG4gICAgLy8gVGhpcyBpbnZvbHZlcyBhIGxpdHRsZSB0cmlja2VyeSBpbiB0aGF0IGJ5IHJlcXVlc3RpbmcgdGhlIGNvbXB1dGVkIGhlaWdodCBvZiB0aGUgZWxlbWVudCB0aGVcclxuICAgIC8vIGJyb3dzZXIgaXMgZm9yY2VkIHRvIGRvIGEgZnVsbCBsYXlvdXRcclxuXHJcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLWV4cHJlc3Npb25cclxuICAgIGVsLm9mZnNldEhlaWdodFxyXG59XHJcblxyXG4vKipcclxuICogUmV0dXJuIGEgc3RyaW5nIHdpdGggdGhlIGZpcnN0IGxldHRlciBjYXBpdGFsaXplZFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGNhcGl0YWxpemVTdHJpbmcoc3RyOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHN0ci5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0ci5zdWJzdHIoMSlcclxufVxyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgYW4gWE1MSHR0cFJlcXVlc3Qgd2l0aCB0aGUgc3BlY2lmaWVkIHVybCwgcmVzcG9uc2UgdHlwZSwgaGVhZGVycywgYW5kIGRhdGFcclxuICovXHJcbmZ1bmN0aW9uIGNvbnN0cnVjdFhNTEh0dHBSZXF1ZXN0KHVybDogc3RyaW5nLCByZXNwVHlwZT86IFhNTEh0dHBSZXF1ZXN0UmVzcG9uc2VUeXBlfG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRlcnM/OiB7W25hbWU6IHN0cmluZ106IHN0cmluZ318bnVsbCwgZGF0YT86IHN0cmluZ3xudWxsKTogWE1MSHR0cFJlcXVlc3Qge1xyXG4gICAgY29uc3QgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KClcclxuXHJcbiAgICAvLyBJZiBQT1NUIGRhdGEgaXMgcHJvdmlkZWQgc2VuZCBhIFBPU1QgcmVxdWVzdCwgb3RoZXJ3aXNlIHNlbmQgYSBHRVQgcmVxdWVzdFxyXG4gICAgcmVxLm9wZW4oKGRhdGEgPyAnUE9TVCcgOiAnR0VUJyksIHVybCwgdHJ1ZSlcclxuXHJcbiAgICBpZiAocmVzcFR5cGUpIHJlcS5yZXNwb25zZVR5cGUgPSByZXNwVHlwZVxyXG5cclxuICAgIGlmIChoZWFkZXJzKSB7XHJcbiAgICAgICAgT2JqZWN0LmtleXMoaGVhZGVycykuZm9yRWFjaCgoaGVhZGVyKSA9PiB7XHJcbiAgICAgICAgICAgIHJlcS5zZXRSZXF1ZXN0SGVhZGVyKGhlYWRlciwgaGVhZGVyc1toZWFkZXJdKVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgLy8gSWYgZGF0YSBpcyB1bmRlZmluZWQgZGVmYXVsdCB0byB0aGUgbm9ybWFsIHJlcS5zZW5kKCksIG90aGVyd2lzZSBwYXNzIHRoZSBkYXRhIGluXHJcbiAgICByZXEuc2VuZChkYXRhKVxyXG4gICAgcmV0dXJuIHJlcVxyXG59XHJcblxyXG4vKiogU2VuZHMgYSByZXF1ZXN0IHRvIGEgc2VydmVyIGFuZCByZXR1cm5zIGEgUHJvbWlzZS5cclxuICogQHBhcmFtIHVybCB0aGUgdXJsIHRvIHJldHJpZXZlXHJcbiAqIEBwYXJhbSByZXNwVHlwZSB0aGUgdHlwZSBvZiByZXNwb25zZSB0aGF0IHNob3VsZCBiZSByZWNlaXZlZFxyXG4gKiBAcGFyYW0gaGVhZGVycyB0aGUgaGVhZGVycyB0aGF0IHdpbGwgYmUgc2VudCB0byB0aGUgc2VydmVyXHJcbiAqIEBwYXJhbSBkYXRhIHRoZSBkYXRhIHRoYXQgd2lsbCBiZSBzZW50IHRvIHRoZSBzZXJ2ZXIgKG9ubHkgZm9yIFBPU1QgcmVxdWVzdHMpXHJcbiAqIEBwYXJhbSBwcm9ncmVzc0VsZW1lbnQgYW4gb3B0aW9uYWwgZWxlbWVudCBmb3IgdGhlIHByb2dyZXNzIGJhciB1c2VkIHRvIGRpc3BsYXkgdGhlIHN0YXR1cyBvZiB0aGUgcmVxdWVzdFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHNlbmQodXJsOiBzdHJpbmcsIHJlc3BUeXBlPzogWE1MSHR0cFJlcXVlc3RSZXNwb25zZVR5cGV8bnVsbCwgaGVhZGVycz86IHtbbmFtZTogc3RyaW5nXTogc3RyaW5nfXxudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgICBkYXRhPzogc3RyaW5nfG51bGwsIHByb2dyZXNzPzogSFRNTEVsZW1lbnR8bnVsbCk6IFByb21pc2U8WE1MSHR0cFJlcXVlc3Q+IHtcclxuXHJcbiAgICBjb25zdCByZXEgPSBjb25zdHJ1Y3RYTUxIdHRwUmVxdWVzdCh1cmwsIHJlc3BUeXBlLCBoZWFkZXJzLCBkYXRhKVxyXG5cclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IHByb2dyZXNzSW5uZXIgPSBwcm9ncmVzcyA/IHByb2dyZXNzLnF1ZXJ5U2VsZWN0b3IoJ2RpdicpIDogbnVsbFxyXG4gICAgICAgIGlmIChwcm9ncmVzcyAmJiBwcm9ncmVzc0lubmVyKSB7XHJcbiAgICAgICAgICAgIGZvcmNlTGF5b3V0KHByb2dyZXNzSW5uZXIpIC8vIFdhaXQgZm9yIGl0IHRvIHJlbmRlclxyXG4gICAgICAgICAgICBwcm9ncmVzcy5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKSAvLyBEaXNwbGF5IHRoZSBwcm9ncmVzcyBiYXJcclxuICAgICAgICAgICAgaWYgKHByb2dyZXNzSW5uZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdkZXRlcm1pbmF0ZScpKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9ncmVzc0lubmVyLmNsYXNzTGlzdC5yZW1vdmUoJ2RldGVybWluYXRlJylcclxuICAgICAgICAgICAgICAgIHByb2dyZXNzSW5uZXIuY2xhc3NMaXN0LmFkZCgnaW5kZXRlcm1pbmF0ZScpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFNvbWV0aW1lcyB0aGUgYnJvd3NlciB3b24ndCBnaXZlIHRoZSB0b3RhbCBieXRlcyBpbiB0aGUgcmVzcG9uc2UsIHNvIHVzZSBwYXN0IHJlc3VsdHMgb3JcclxuICAgICAgICAvLyBhIGRlZmF1bHQgb2YgMTcwLDAwMCBieXRlcyBpZiB0aGUgYnJvd3NlciBkb2Vzbid0IHByb3ZpZGUgdGhlIG51bWJlclxyXG4gICAgICAgIGNvbnN0IGxvYWQgPSBsb2NhbFN0b3JhZ2VSZWFkKCdsb2FkJywgMTcwMDAwKVxyXG4gICAgICAgIGxldCBjb21wdXRlZExvYWQgPSAwXHJcblxyXG4gICAgICAgIHJlcS5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKGV2dCkgPT4ge1xyXG4gICAgICAgICAgICAvLyBDYWNoZSB0aGUgbnVtYmVyIG9mIGJ5dGVzIGxvYWRlZCBzbyBpdCBjYW4gYmUgdXNlZCBmb3IgYmV0dGVyIGVzdGltYXRlcyBsYXRlciBvblxyXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2VXcml0ZSgnbG9hZCcsIGNvbXB1dGVkTG9hZClcclxuICAgICAgICAgICAgaWYgKHByb2dyZXNzKSBwcm9ncmVzcy5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gICAgICAgICAgICAvLyBSZXNvbHZlIHdpdGggdGhlIHJlcXVlc3RcclxuICAgICAgICAgICAgaWYgKHJlcS5zdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShyZXEpXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoRXJyb3IocmVxLnN0YXR1c1RleHQpKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgcmVxLmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAocHJvZ3Jlc3MpIHByb2dyZXNzLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgICAgICAgICAgIHJlamVjdChFcnJvcignTmV0d29yayBFcnJvcicpKVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIGlmIChwcm9ncmVzcyAmJiBwcm9ncmVzc0lubmVyKSB7XHJcbiAgICAgICAgICAgIHJlcS5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIChldnQpID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIFVwZGF0ZSB0aGUgcHJvZ3Jlc3MgYmFyXHJcbiAgICAgICAgICAgICAgICBpZiAocHJvZ3Jlc3NJbm5lci5jbGFzc0xpc3QuY29udGFpbnMoJ2luZGV0ZXJtaW5hdGUnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb2dyZXNzSW5uZXIuY2xhc3NMaXN0LnJlbW92ZSgnaW5kZXRlcm1pbmF0ZScpXHJcbiAgICAgICAgICAgICAgICAgICAgcHJvZ3Jlc3NJbm5lci5jbGFzc0xpc3QuYWRkKCdkZXRlcm1pbmF0ZScpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb21wdXRlZExvYWQgPSBldnQubG9hZGVkXHJcbiAgICAgICAgICAgICAgICBwcm9ncmVzc0lubmVyLnN0eWxlLndpZHRoID0gKCgxMDAgKiBldnQubG9hZGVkKSAvIChldnQubGVuZ3RoQ29tcHV0YWJsZSA/IGV2dC50b3RhbCA6IGxvYWQpKSArICclJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBUaGUgZXF1aXZhbGVudCBvZiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCBidXQgdGhyb3dzIGFuIGVycm9yIGlmIHRoZSBlbGVtZW50IGlzIG5vdCBkZWZpbmVkXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZWxlbUJ5SWQoaWQ6IHN0cmluZyk6IEhUTUxFbGVtZW50IHtcclxuICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpXHJcbiAgICBpZiAoZWwgPT0gbnVsbCkgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCBlbGVtZW50IHdpdGggaWQgJHtpZH1gKVxyXG4gICAgcmV0dXJuIGVsXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBIGxpdHRsZSBoZWxwZXIgZnVuY3Rpb24gdG8gc2ltcGxpZnkgdGhlIGNyZWF0aW9uIG9mIEhUTUwgZWxlbWVudHNcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBlbGVtZW50KHRhZzogc3RyaW5nLCBjbHM6IHN0cmluZ3xzdHJpbmdbXSwgaHRtbD86IHN0cmluZ3xudWxsLCBpZD86IHN0cmluZ3xudWxsKTogSFRNTEVsZW1lbnQge1xyXG4gICAgY29uc3QgZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnKVxyXG5cclxuICAgIGlmICh0eXBlb2YgY2xzID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgIGUuY2xhc3NMaXN0LmFkZChjbHMpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNscy5mb3JFYWNoKChjKSA9PiBlLmNsYXNzTGlzdC5hZGQoYykpXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGh0bWwpIGUuaW5uZXJIVE1MID0gaHRtbFxyXG4gICAgaWYgKGlkKSBlLnNldEF0dHJpYnV0ZSgnaWQnLCBpZClcclxuXHJcbiAgICByZXR1cm4gZVxyXG59XHJcblxyXG4vKipcclxuICogVGhyb3dzIGFuIGVycm9yIGlmIHRoZSBzdXBwbGllZCBhcmd1bWVudCBpcyBudWxsLCBvdGhlcndpc2UgcmV0dXJucyB0aGUgYXJndW1lbnRcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBfJDxUPihhcmc6IFR8bnVsbCk6IFQge1xyXG4gICAgaWYgKGFyZyA9PSBudWxsKSB0aHJvdyBuZXcgRXJyb3IoJ0V4cGVjdGVkIGFyZ3VtZW50IHRvIGJlIG5vbi1udWxsJylcclxuICAgIHJldHVybiBhcmdcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF8kaChhcmc6IE5vZGV8RXZlbnRUYXJnZXR8bnVsbCk6IEhUTUxFbGVtZW50IHtcclxuICAgIGlmIChhcmcgPT0gbnVsbCkgdGhyb3cgbmV3IEVycm9yKCdFeHBlY3RlZCBub2RlIHRvIGJlIG5vbi1udWxsJylcclxuICAgIHJldHVybiBhcmcgYXMgSFRNTEVsZW1lbnRcclxufVxyXG5cclxuLy8gQmVjYXVzZSBzb21lIGxvY2FsU3RvcmFnZSBlbnRyaWVzIGNhbiBiZWNvbWUgY29ycnVwdGVkIGR1ZSB0byBlcnJvciBzaWRlIGVmZmVjdHMsIHRoZSBiZWxvd1xyXG4vLyBtZXRob2QgdHJpZXMgdG8gcmVhZCBhIHZhbHVlIGZyb20gbG9jYWxTdG9yYWdlIGFuZCBoYW5kbGVzIGVycm9ycy5cclxuZXhwb3J0IGZ1bmN0aW9uIGxvY2FsU3RvcmFnZVJlYWQobmFtZTogc3RyaW5nKTogYW55XHJcbmV4cG9ydCBmdW5jdGlvbiBsb2NhbFN0b3JhZ2VSZWFkPFI+KG5hbWU6IHN0cmluZywgZGVmYXVsdFZhbDogKCkgPT4gUik6IFJcclxuZXhwb3J0IGZ1bmN0aW9uIGxvY2FsU3RvcmFnZVJlYWQ8VD4obmFtZTogc3RyaW5nLCBkZWZhdWx0VmFsOiBUKTogVFxyXG5leHBvcnQgZnVuY3Rpb24gbG9jYWxTdG9yYWdlUmVhZChuYW1lOiBzdHJpbmcsIGRlZmF1bHRWYWw/OiBhbnkpOiBhbnkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2VbbmFtZV0pXHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBkZWZhdWx0VmFsID09PSAnZnVuY3Rpb24nID8gZGVmYXVsdFZhbCgpIDogZGVmYXVsdFZhbFxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbG9jYWxTdG9yYWdlV3JpdGUobmFtZTogc3RyaW5nLCBpdGVtOiBhbnkpOiB2b2lkIHtcclxuICAgIGxvY2FsU3RvcmFnZVtuYW1lXSA9IEpTT04uc3RyaW5naWZ5KGl0ZW0pXHJcbn1cclxuXHJcbmludGVyZmFjZSBJZGxlRGVhZGxpbmUge1xyXG4gICAgZGlkVGltZW91dDogYm9vbGVhblxyXG4gICAgdGltZVJlbWFpbmluZzogKCkgPT4gbnVtYmVyXHJcbn1cclxuXHJcbi8vIEJlY2F1c2UgdGhlIHJlcXVlc3RJZGxlQ2FsbGJhY2sgZnVuY3Rpb24gaXMgdmVyeSBuZXcgKGFzIG9mIHdyaXRpbmcgb25seSB3b3JrcyB3aXRoIENocm9tZVxyXG4vLyB2ZXJzaW9uIDQ3KSwgdGhlIGJlbG93IGZ1bmN0aW9uIHBvbHlmaWxscyB0aGF0IG1ldGhvZC5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlcXVlc3RJZGxlQ2FsbGJhY2soY2I6IChkZWFkbGluZTogSWRsZURlYWRsaW5lKSA9PiB2b2lkLCBvcHRzOiB7IHRpbWVvdXQ6IG51bWJlcn0pOiBudW1iZXIge1xyXG4gICAgaWYgKCdyZXF1ZXN0SWRsZUNhbGxiYWNrJyBpbiB3aW5kb3cpIHtcclxuICAgICAgICByZXR1cm4gKHdpbmRvdyBhcyBhbnkpLnJlcXVlc3RJZGxlQ2FsbGJhY2soY2IsIG9wdHMpXHJcbiAgICB9XHJcbiAgICBjb25zdCBzdGFydCA9IERhdGUubm93KClcclxuXHJcbiAgICByZXR1cm4gc2V0VGltZW91dCgoKSA9PiBjYih7XHJcbiAgICAgICAgZGlkVGltZW91dDogZmFsc2UsXHJcbiAgICAgICAgdGltZVJlbWFpbmluZygpOiBudW1iZXIge1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5tYXgoMCwgNTAgLSAoRGF0ZS5ub3coKSAtIHN0YXJ0KSlcclxuICAgICAgICB9XHJcbiAgICB9KSwgMSlcclxufVxyXG5cclxuLyoqXHJcbiAqIERldGVybWluZSBpZiB0aGUgdHdvIGRhdGVzIGhhdmUgdGhlIHNhbWUgeWVhciwgbW9udGgsIGFuZCBkYXlcclxuICovXHJcbmZ1bmN0aW9uIGRhdGVzRXF1YWwoYTogRGF0ZSwgYjogRGF0ZSk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRvRGF0ZU51bShhKSA9PT0gdG9EYXRlTnVtKGIpXHJcbn1cclxuXHJcbmNvbnN0IERBVEVfUkVMQVRJVkVOQU1FUzoge1tuYW1lOiBzdHJpbmddOiBudW1iZXJ9ID0ge1xyXG4gICAgJ1RvbW9ycm93JzogMSxcclxuICAgICdUb2RheSc6IDAsXHJcbiAgICAnWWVzdGVyZGF5JzogLTEsXHJcbiAgICAnMiBkYXlzIGFnbyc6IC0yXHJcbn1cclxuY29uc3QgV0VFS0RBWVMgPSBbJ1N1bmRheScsICdNb25kYXknLCAnVHVlc2RheScsICdXZWRuZXNkYXknLCAnVGh1cnNkYXknLCAnRnJpZGF5JywgJ1NhdHVyZGF5J11cclxuY29uc3QgRlVMTE1PTlRIUyA9IFsnSmFudWFyeScsICdGZWJydWFyeScsICdNYXJjaCcsICdBcHJpbCcsICdNYXknLCAnSnVuZScsICdKdWx5JywgJ0F1Z3VzdCcsICdTZXB0ZW1iZXInLCAnT2N0b2JlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgJ05vdmVtYmVyJywgJ0RlY2VtYmVyJ11cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkYXRlU3RyaW5nKGRhdGU6IERhdGV8bnVtYmVyfCdGb3JldmVyJywgYWRkVGhpczogYm9vbGVhbiA9IGZhbHNlKTogc3RyaW5nIHtcclxuICAgIGlmIChkYXRlID09PSAnRm9yZXZlcicpIHJldHVybiBkYXRlXHJcbiAgICBpZiAodHlwZW9mIGRhdGUgPT09ICdudW1iZXInKSByZXR1cm4gZGF0ZVN0cmluZyhmcm9tRGF0ZU51bShkYXRlKSwgYWRkVGhpcylcclxuXHJcbiAgICBjb25zdCByZWxhdGl2ZU1hdGNoID0gT2JqZWN0LmtleXMoREFURV9SRUxBVElWRU5BTUVTKS5maW5kKChuYW1lKSA9PiB7XHJcbiAgICAgICAgY29uc3QgZGF5QXQgPSBuZXcgRGF0ZSgpXHJcbiAgICAgICAgZGF5QXQuc2V0RGF0ZShkYXlBdC5nZXREYXRlKCkgKyBEQVRFX1JFTEFUSVZFTkFNRVNbbmFtZV0pXHJcbiAgICAgICAgcmV0dXJuIGRhdGVzRXF1YWwoZGF5QXQsIGRhdGUpXHJcbiAgICB9KVxyXG4gICAgaWYgKHJlbGF0aXZlTWF0Y2gpIHJldHVybiByZWxhdGl2ZU1hdGNoXHJcblxyXG4gICAgY29uc3QgZGF5c0FoZWFkID0gKGRhdGUuZ2V0VGltZSgpIC0gRGF0ZS5ub3coKSkgLyAxMDAwIC8gMzYwMCAvIDI0XHJcblxyXG4gICAgLy8gSWYgdGhlIGRhdGUgaXMgd2l0aGluIDYgZGF5cyBvZiB0b2RheSwgb25seSBkaXNwbGF5IHRoZSBkYXkgb2YgdGhlIHdlZWtcclxuICAgIGlmICgwIDwgZGF5c0FoZWFkICYmIGRheXNBaGVhZCA8PSA2KSB7XHJcbiAgICAgICAgcmV0dXJuIChhZGRUaGlzID8gJ1RoaXMgJyA6ICcnKSArIFdFRUtEQVlTW2RhdGUuZ2V0RGF5KCldXHJcbiAgICB9XHJcbiAgICByZXR1cm4gYCR7V0VFS0RBWVNbZGF0ZS5nZXREYXkoKV19LCAke0ZVTExNT05USFNbZGF0ZS5nZXRNb250aCgpXX0gJHtkYXRlLmdldERhdGUoKX1gXHJcbn1cclxuXHJcbi8vIFRoZSBvbmUgYmVsb3cgc2Nyb2xscyBzbW9vdGhseSB0byBhIHkgcG9zaXRpb24uXHJcbmV4cG9ydCBmdW5jdGlvbiBzbW9vdGhTY3JvbGwodG86IG51bWJlcik6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICBsZXQgc3RhcnQ6IG51bWJlcnxudWxsID0gbnVsbFxyXG4gICAgICAgIGNvbnN0IGZyb20gPSBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcFxyXG4gICAgICAgIGNvbnN0IGFtb3VudCA9IHRvIC0gZnJvbVxyXG4gICAgICAgIGNvbnN0IHN0ZXAgPSAodGltZXN0YW1wOiBudW1iZXIpID0+IHtcclxuICAgICAgICAgICAgaWYgKHN0YXJ0ID09IG51bGwpIHsgc3RhcnQgPSB0aW1lc3RhbXAgfVxyXG4gICAgICAgICAgICBjb25zdCBwcm9ncmVzcyA9IHRpbWVzdGFtcCAtIHN0YXJ0XHJcbiAgICAgICAgICAgIHdpbmRvdy5zY3JvbGxUbygwLCBmcm9tICsgKGFtb3VudCAqIChwcm9ncmVzcyAvIDM1MCkpKVxyXG4gICAgICAgICAgICBpZiAocHJvZ3Jlc3MgPCAzNTApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RlcClcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIF8kKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ25hdicpKS5jbGFzc0xpc3QucmVtb3ZlKCdoZWFkcm9vbS0tdW5waW5uZWQnKVxyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0ZXApXHJcbiAgICB9KVxyXG59XHJcblxyXG4vLyBBbmQgYSBmdW5jdGlvbiB0byBhcHBseSBhbiBpbmsgZWZmZWN0XHJcbmV4cG9ydCBmdW5jdGlvbiByaXBwbGUoZWw6IEhUTUxFbGVtZW50KTogdm9pZCB7XHJcbiAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCAoZXZ0KSA9PiB7XHJcbiAgICAgICAgaWYgKGV2dC53aGljaCAhPT0gMSkgcmV0dXJuIC8vIE5vdCBsZWZ0IGJ1dHRvblxyXG4gICAgICAgIGNvbnN0IHdhdmUgPSBlbGVtZW50KCdzcGFuJywgJ3dhdmUnKVxyXG4gICAgICAgIGNvbnN0IHNpemUgPSBNYXRoLm1heChOdW1iZXIoZWwub2Zmc2V0V2lkdGgpLCBOdW1iZXIoZWwub2Zmc2V0SGVpZ2h0KSlcclxuICAgICAgICB3YXZlLnN0eWxlLndpZHRoID0gKHdhdmUuc3R5bGUuaGVpZ2h0ID0gc2l6ZSArICdweCcpXHJcblxyXG4gICAgICAgIGxldCB4ID0gZXZ0LmNsaWVudFhcclxuICAgICAgICBsZXQgeSA9IGV2dC5jbGllbnRZXHJcbiAgICAgICAgY29uc3QgcmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXHJcbiAgICAgICAgeCAtPSByZWN0LmxlZnRcclxuICAgICAgICB5IC09IHJlY3QudG9wXHJcblxyXG4gICAgICAgIHdhdmUuc3R5bGUudG9wID0gKHkgLSAoc2l6ZSAvIDIpKSArICdweCdcclxuICAgICAgICB3YXZlLnN0eWxlLmxlZnQgPSAoeCAtIChzaXplIC8gMikpICsgJ3B4J1xyXG4gICAgICAgIGVsLmFwcGVuZENoaWxkKHdhdmUpXHJcbiAgICAgICAgd2F2ZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtaG9sZCcsIFN0cmluZyhEYXRlLm5vdygpKSlcclxuICAgICAgICBmb3JjZUxheW91dCh3YXZlKVxyXG4gICAgICAgIHdhdmUuc3R5bGUudHJhbnNmb3JtID0gJ3NjYWxlKDIuNSknXHJcbiAgICB9KVxyXG4gICAgZWwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIChldnQpID0+IHtcclxuICAgICAgICBpZiAoZXZ0LndoaWNoICE9PSAxKSByZXR1cm4gLy8gT25seSBmb3IgbGVmdCBidXR0b25cclxuICAgICAgICBjb25zdCB3YXZlcyA9IGVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3dhdmUnKVxyXG4gICAgICAgIHdhdmVzLmZvckVhY2goKHdhdmUpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgZGlmZiA9IERhdGUubm93KCkgLSBOdW1iZXIod2F2ZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtaG9sZCcpKVxyXG4gICAgICAgICAgICBjb25zdCBkZWxheSA9IE1hdGgubWF4KDM1MCAtIGRpZmYsIDApXHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgKHdhdmUgYXMgSFRNTEVsZW1lbnQpLnN0eWxlLm9wYWNpdHkgPSAnMCdcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHdhdmUucmVtb3ZlKClcclxuICAgICAgICAgICAgICAgIH0sIDU1MClcclxuICAgICAgICAgICAgfSwgZGVsYXkpXHJcbiAgICAgICAgfSlcclxuICAgIH0pXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjc3NOdW1iZXIoY3NzOiBzdHJpbmd8bnVsbCk6IG51bWJlciB7XHJcbiAgICBpZiAoIWNzcykgcmV0dXJuIDBcclxuICAgIHJldHVybiBwYXJzZUludChjc3MsIDEwKVxyXG59XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=