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














// @ts-ignore TODO: Make this less hacky
NodeList.prototype.forEach = HTMLCollection.prototype.forEach = Array.prototype.forEach;
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
    if (localStorage[e.name] != null) {
        if (e.type === 'checkbox') {
            e.checked = JSON.parse(localStorage[e.name]);
        }
        else {
            e.value = JSON.parse(localStorage[e.name]);
        }
    }
    e.addEventListener('change', (evt) => {
        if (e.type === 'checkbox') {
            Object(_util__WEBPACK_IMPORTED_MODULE_13__["localStorageWrite"])(e.name, e.checked);
        }
        else {
            Object(_util__WEBPACK_IMPORTED_MODULE_13__["localStorageWrite"])(e.name, e.value);
        }
        switch (e.name) {
            case 'refreshRate': return intervalRefresh();
            case 'earlyTest': return Object(_display__WEBPACK_IMPORTED_MODULE_6__["display"])();
            case 'assignmentSpan': return Object(_display__WEBPACK_IMPORTED_MODULE_6__["display"])();
            case 'projectsInTestPane': return Object(_display__WEBPACK_IMPORTED_MODULE_6__["display"])();
            case 'hideassignments': return Object(_display__WEBPACK_IMPORTED_MODULE_6__["display"])();
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
        const sbkg = Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('sideBackground');
        sbkg.style.display = 'block';
        sbkg.style.opacity = '0';
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
        const overlayPerc = Math.min(x / 480, 0.5);
        return sbkg.style.opacity = String(overlayPerc);
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
    const dispNews = () => {
        Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('newsBackground').style.display = 'block';
        return Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('news').classList.add('active');
    };
    if (Object(_util__WEBPACK_IMPORTED_MODULE_13__["elemById"])('newsContent').childNodes.length === 0) {
        Object(_app__WEBPACK_IMPORTED_MODULE_0__["getNews"])(dispNews);
    }
    else {
        dispNews();
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
        if (end < start) { // Assignmend ends before it is assigned
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
// If the serviceworker detects that the web app has been updated, the commit is fetched from GitHub.
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




const insertTo = Object(_util__WEBPACK_IMPORTED_MODULE_2__["elemById"])('infoActivity');
function addActivityElement(el) {
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
    Object(_util__WEBPACK_IMPORTED_MODULE_0__["elemById"])('user').innerHTML = Object(_util__WEBPACK_IMPORTED_MODULE_0__["localStorageRead"])('username');
    const initials = Object(_util__WEBPACK_IMPORTED_MODULE_0__["localStorageRead"])('username').match(/\d*(.).*?(.$)/); // Separate year from first name and initial
    if (initials != null) {
        const bg = labrgb(50, letterToColorVal(initials[1]), letterToColorVal(initials[2])); // Compute the color
        Object(_util__WEBPACK_IMPORTED_MODULE_0__["elemById"])('initials').style.backgroundColor = bg;
        Object(_util__WEBPACK_IMPORTED_MODULE_0__["elemById"])('initials').innerHTML = initials[1] + initials[2];
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
const loginBackground = Object(_util__WEBPACK_IMPORTED_MODULE_6__["elemById"])('loginBackground');
const lastUpdateEl = Object(_util__WEBPACK_IMPORTED_MODULE_6__["elemById"])('lastUpdate');
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
async function fetch(override = false, data) {
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
                loginBackground.style.display = 'block';
                loginDialog.classList.add('active');
            }
            else {
                // Because we were remembered, we can log in immediately without waiting for the
                // user to log in through the login form
                dologin(window.atob(up).split(':'));
            }
        }
        else {
            // Logged in now
            console.log('Fetching assignments successful');
            const t = Date.now();
            localStorage.lastUpdate = t;
            lastUpdateEl.innerHTML = Object(_display__WEBPACK_IMPORTED_MODULE_5__["formatUpdate"])(t);
            try {
                parse(resp.response);
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
async function dologin(val, submitEvt = false) {
    loginDialog.classList.remove('active');
    setTimeout(() => loginBackground.style.display = 'none', 350);
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
            lastUpdateEl.innerHTML = Object(_display__WEBPACK_IMPORTED_MODULE_5__["formatUpdate"])(t);
            try {
                parse(resp.response); // Parse the data PCR has replied with
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
    Object(_display__WEBPACK_IMPORTED_MODULE_5__["display"])(); // Display the data
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
    try {
        athenaData = parseAthenaData(data);
        Object(_util__WEBPACK_IMPORTED_MODULE_0__["localStorageWrite"])(ATHENA_STORAGE_NAME, data);
        Object(_util__WEBPACK_IMPORTED_MODULE_0__["elemById"])('athenaDataError').style.display = 'none';
        Object(_util__WEBPACK_IMPORTED_MODULE_0__["elemById"])('athenaDataRefresh').style.display = 'block';
    }
    catch (e) {
        Object(_util__WEBPACK_IMPORTED_MODULE_0__["elemById"])('athenaDataError').style.display = 'block';
        Object(_util__WEBPACK_IMPORTED_MODULE_0__["elemById"])('athenaDataRefresh').style.display = 'none';
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
const extra = Object(_util__WEBPACK_IMPORTED_MODULE_0__["localStorageRead"])(CUSTOM_STORAGE_NAME) || {};
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
const done = Object(_util__WEBPACK_IMPORTED_MODULE_0__["localStorageRead"])(DONE_STORAGE_NAME) || [];
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
const modified = Object(_util__WEBPACK_IMPORTED_MODULE_0__["localStorageRead"])(MODIFIED_STORAGE_NAME) || {};
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50LnRzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2FjdGl2aXR5LnRzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2Fzc2lnbm1lbnQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvYXZhdGFyLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2NhbGVuZGFyLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2N1c3RvbUFkZGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2Vycm9yRGlzcGxheS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9yZXNpemVyLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL3NuYWNrYmFyLnRzIiwid2VicGFjazovLy8uL3NyYy9jb29raWVzLnRzIiwid2VicGFjazovLy8uL3NyYy9kYXRlcy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZGlzcGxheS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbmF2aWdhdGlvbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGNyLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW5zL2FjdGl2aXR5LnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW5zL2F0aGVuYS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2lucy9jdXN0b21Bc3NpZ25tZW50cy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2lucy9kb25lLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW5zL21vZGlmaWVkQXNzaWdubWVudHMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NldHRpbmdzLnRzIiwid2VicGFjazovLy8uL3NyYy91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNB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QUMsR0FBRyxFQUFFLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDaEUsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUNyQyxVQUFVLENBQUMsR0FBRyxFQUFFO2dCQUNYLElBQW9CLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxHQUFHO2dCQUN6QyxVQUFVLENBQUMsR0FBRyxFQUFFO29CQUNaLElBQUksQ0FBQyxNQUFNLEVBQUU7Z0JBQ2pCLENBQUMsRUFBRSxHQUFHLENBQUM7WUFDWCxDQUFDLEVBQUUsS0FBSyxDQUFDO1FBQ2IsQ0FBQyxDQUFDO0lBQ04sQ0FBQyxDQUFDO0FBQ04sQ0FBQztBQUVLLG1CQUFvQixHQUFnQjtJQUN0QyxJQUFJLENBQUMsR0FBRztRQUFFLE9BQU8sQ0FBQztJQUNsQixPQUFPLFFBQVEsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDO0FBQzVCLENBQUMiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2NsaWVudC50c1wiKTtcbiIsImltcG9ydCB7IGVsZW1CeUlkLCBlbGVtZW50LCBsb2NhbFN0b3JhZ2VSZWFkLCBsb2NhbFN0b3JhZ2VXcml0ZSwgc2VuZCB9IGZyb20gJy4vdXRpbCdcclxuXHJcbmV4cG9ydCBjb25zdCBWRVJTSU9OID0gJzIuMjQuMydcclxuXHJcbmNvbnN0IFZFUlNJT05fVVJMID0gJ2h0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS8xOVJ5YW5BL0NoZWNrUENSL21hc3Rlci92ZXJzaW9uLnR4dCdcclxuY29uc3QgQ09NTUlUX1VSTCA9IChsb2NhdGlvbi5wcm90b2NvbCA9PT0gJ2Nocm9tZS1leHRlbnNpb246JyA/XHJcbiAgICAnaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbS9yZXBvcy8xOVJ5YW5BL0NoZWNrUENSL2dpdC9yZWZzL2hlYWRzL21hc3RlcicgOiAnL2FwaS9jb21taXQnKVxyXG5jb25zdCBORVdTX1VSTCA9ICdodHRwczovL2FwaS5naXRodWIuY29tL2dpc3RzLzIxYmYxMWE0MjlkYTI1NzUzOWE2ODUyMGY1MTNhMzhiJ1xyXG5cclxuZnVuY3Rpb24gZm9ybWF0Q29tbWl0TWVzc2FnZShtZXNzYWdlOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIG1lc3NhZ2Uuc3Vic3RyKG1lc3NhZ2UuaW5kZXhPZignXFxuXFxuJykgKyAyKVxyXG4gICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFwqICguKj8pKD89JHxcXG4pL2csIChhLCBiKSA9PiBgPGxpPiR7Yn08L2xpPmApXHJcbiAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8+XFxuPC9nLCAnPjwnKVxyXG4gICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxuL2csICc8YnI+JylcclxufVxyXG5cclxuLy8gRm9yIHVwZGF0aW5nLCBhIHJlcXVlc3Qgd2lsbCBiZSBzZW5kIHRvIEdpdGh1YiB0byBnZXQgdGhlIGN1cnJlbnQgY29tbWl0IGlkIGFuZCBjaGVjayB0aGF0IGFnYWluc3Qgd2hhdCdzIHN0b3JlZFxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY2hlY2tDb21taXQoKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHJlc3AgPSBhd2FpdCBzZW5kKFZFUlNJT05fVVJMLCAndGV4dCcpXHJcbiAgICAgICAgY29uc3QgYyA9IHJlc3AucmVzcG9uc2VUZXh0LnRyaW0oKVxyXG4gICAgICAgIGNvbnNvbGUubG9nKGBDdXJyZW50IHZlcnNpb246ICR7Y30gJHtWRVJTSU9OID09PSBjID8gJyhubyB1cGRhdGUgYXZhaWxhYmxlKScgOiAnKHVwZGF0ZSBhdmFpbGFibGUpJ31gKVxyXG4gICAgICAgIGVsZW1CeUlkKCduZXd2ZXJzaW9uJykuaW5uZXJIVE1MID0gY1xyXG4gICAgICAgIGlmIChWRVJTSU9OICE9PSBjKSB7XHJcbiAgICAgICAgICAgIGVsZW1CeUlkKCd1cGRhdGVJZ25vcmUnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChsb2NhdGlvbi5wcm90b2NvbCA9PT0gJ2Nocm9tZS1leHRlbnNpb246Jykge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1CeUlkKCd1cGRhdGUnKS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtQnlJZCgndXBkYXRlQmFja2dyb3VuZCcpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcclxuICAgICAgICAgICAgICAgICAgICB9LCAzNTApXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICBjb25zdCByZXNwMiA9IGF3YWl0IHNlbmQoQ09NTUlUX1VSTCwgJ2pzb24nKVxyXG4gICAgICAgICAgICBjb25zdCB7IHNoYSwgdXJsIH0gPSByZXNwMi5yZXNwb25zZS5vYmplY3RcclxuICAgICAgICAgICAgY29uc3QgcmVzcDMgPSBhd2FpdCBzZW5kKChsb2NhdGlvbi5wcm90b2NvbCA9PT0gJ2Nocm9tZS1leHRlbnNpb246JyA/IHVybCA6IGAvYXBpL2NvbW1pdC8ke3NoYX1gKSwgJ2pzb24nKVxyXG4gICAgICAgICAgICBlbGVtQnlJZCgncGFzdFVwZGF0ZVZlcnNpb24nKS5pbm5lckhUTUwgPSBWRVJTSU9OXHJcbiAgICAgICAgICAgIGVsZW1CeUlkKCduZXdVcGRhdGVWZXJzaW9uJykuaW5uZXJIVE1MID0gY1xyXG4gICAgICAgICAgICBlbGVtQnlJZCgndXBkYXRlRmVhdHVyZXMnKS5pbm5lckhUTUwgPSBmb3JtYXRDb21taXRNZXNzYWdlKHJlc3AzLnJlc3BvbnNlLm1lc3NhZ2UpXHJcbiAgICAgICAgICAgIGVsZW1CeUlkKCd1cGRhdGVCYWNrZ3JvdW5kJykuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcclxuICAgICAgICAgICAgZWxlbUJ5SWQoJ3VwZGF0ZScpLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcbiAgICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ0NvdWxkIG5vdCBhY2Nlc3MgR2l0aHViLiBIZXJlXFwncyB0aGUgZXJyb3I6JywgZXJyKVxyXG4gICAgfVxyXG59XHJcblxyXG5sZXQgbmV3c1VybDogc3RyaW5nfG51bGwgPSBudWxsXHJcbmxldCBuZXdzQ29tbWl0OiBzdHJpbmd8bnVsbCA9IG51bGxcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmZXRjaE5ld3MoKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHJlc3AgPSBhd2FpdCBzZW5kKE5FV1NfVVJMLCAnanNvbicpXHJcbiAgICAgICAgbGV0IGxhc3QgPSBsb2NhbFN0b3JhZ2VSZWFkKCduZXdzQ29tbWl0JylcclxuICAgICAgICBuZXdzQ29tbWl0ID0gcmVzcC5yZXNwb25zZS5oaXN0b3J5WzBdLnZlcnNpb25cclxuXHJcbiAgICAgICAgaWYgKGxhc3QgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBsYXN0ID0gbmV3c0NvbW1pdFxyXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2VXcml0ZSgnbmV3c0NvbW1pdCcsIG5ld3NDb21taXQpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBuZXdzVXJsID0gcmVzcC5yZXNwb25zZS5maWxlc1sndXBkYXRlcy5odG0nXS5yYXdfdXJsXHJcblxyXG4gICAgICAgIGlmIChsYXN0ICE9PSBuZXdzQ29tbWl0KSB7XHJcbiAgICAgICAgICAgIGdldE5ld3MoKVxyXG4gICAgICAgIH1cclxuICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdDb3VsZCBub3QgYWNjZXNzIEdpdGh1Yi4gSGVyZVxcJ3MgdGhlIGVycm9yOicsIGVycilcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldE5ld3Mob25mYWlsPzogKCkgPT4gdm9pZCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgaWYgKCFuZXdzVXJsKSB7XHJcbiAgICAgICAgaWYgKG9uZmFpbCkgb25mYWlsKClcclxuICAgICAgICByZXR1cm5cclxuICAgIH1cclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcmVzcCA9IGF3YWl0IHNlbmQobmV3c1VybClcclxuICAgICAgICBsb2NhbFN0b3JhZ2UubmV3c0NvbW1pdCA9IG5ld3NDb21taXRcclxuICAgICAgICByZXNwLnJlc3BvbnNlVGV4dC5zcGxpdCgnPGhyPicpLmZvckVhY2goKG5ld3MpID0+IHtcclxuICAgICAgICAgICAgZWxlbUJ5SWQoJ25ld3NDb250ZW50JykuYXBwZW5kQ2hpbGQoZWxlbWVudCgnZGl2JywgJ25ld3NJdGVtJywgbmV3cykpXHJcbiAgICAgICAgfSlcclxuICAgICAgICBlbGVtQnlJZCgnbmV3c0JhY2tncm91bmQnKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xyXG4gICAgICAgIGVsZW1CeUlkKCduZXdzJykuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdDb3VsZCBub3QgYWNjZXNzIEdpdGh1Yi4gSGVyZVxcJ3MgdGhlIGVycm9yOicsIGVycilcclxuICAgICAgICBpZiAob25mYWlsKSBvbmZhaWwoKVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IGNoZWNrQ29tbWl0LCBmZXRjaE5ld3MsIGdldE5ld3MsIFZFUlNJT04gfSBmcm9tICcuL2FwcCdcclxuaW1wb3J0IHsgY2xvc2VPcGVuZWQgfSBmcm9tICcuL2NvbXBvbmVudHMvYXNzaWdubWVudCdcclxuaW1wb3J0IHsgdXBkYXRlQXZhdGFyIH0gZnJvbSAnLi9jb21wb25lbnRzL2F2YXRhcidcclxuaW1wb3J0IHsgdXBkYXRlTmV3VGlwcyB9IGZyb20gJy4vY29tcG9uZW50cy9jdXN0b21BZGRlcidcclxuaW1wb3J0IHsgZ2V0UmVzaXplQXNzaWdubWVudHMsIHJlc2l6ZSwgcmVzaXplQ2FsbGVyIH0gZnJvbSAnLi9jb21wb25lbnRzL3Jlc2l6ZXInXHJcbmltcG9ydCB7IHRvRGF0ZU51bSwgdG9kYXkgfSBmcm9tICcuL2RhdGVzJ1xyXG5pbXBvcnQgeyBkaXNwbGF5LCBmb3JtYXRVcGRhdGUsIGdldFNjcm9sbCB9IGZyb20gJy4vZGlzcGxheSdcclxuaW1wb3J0IHtcclxuICAgIGRlY3JlbWVudExpc3REYXRlT2Zmc2V0LFxyXG4gICAgZ2V0TGlzdERhdGVPZmZzZXQsXHJcbiAgICBpbmNyZW1lbnRMaXN0RGF0ZU9mZnNldCxcclxuICAgIHNldExpc3REYXRlT2Zmc2V0LFxyXG4gICAgemVyb0xpc3REYXRlT2Zmc2V0XHJcbn0gZnJvbSAnLi9uYXZpZ2F0aW9uJ1xyXG5pbXBvcnQgeyBkb2xvZ2luLCBmZXRjaCwgZ2V0Q2xhc3NlcywgZ2V0RGF0YSwgbG9nb3V0LCBzZXREYXRhLCBzd2l0Y2hWaWV3cyB9IGZyb20gJy4vcGNyJ1xyXG5pbXBvcnQgeyBhZGRBY3Rpdml0eSwgcmVjZW50QWN0aXZpdHkgfSBmcm9tICcuL3BsdWdpbnMvYWN0aXZpdHknXHJcbmltcG9ydCB7IHVwZGF0ZUF0aGVuYURhdGEgfSBmcm9tICcuL3BsdWdpbnMvYXRoZW5hJ1xyXG5pbXBvcnQgeyBhZGRUb0V4dHJhLCBwYXJzZUN1c3RvbVRhc2ssIHNhdmVFeHRyYSB9IGZyb20gJy4vcGx1Z2lucy9jdXN0b21Bc3NpZ25tZW50cydcclxuaW1wb3J0IHsgc2V0dGluZ3MgfSBmcm9tICcuL3NldHRpbmdzJ1xyXG5pbXBvcnQge1xyXG4gICAgXyQsXHJcbiAgICBfJGgsXHJcbiAgICBkYXRlU3RyaW5nLFxyXG4gICAgZWxlbUJ5SWQsXHJcbiAgICBlbGVtZW50LFxyXG4gICAgZm9yY2VMYXlvdXQsXHJcbiAgICBsb2NhbFN0b3JhZ2VSZWFkLFxyXG4gICAgbG9jYWxTdG9yYWdlV3JpdGUsXHJcbiAgICByZXF1ZXN0SWRsZUNhbGxiYWNrLFxyXG4gICAgcmlwcGxlXHJcbn0gZnJvbSAnLi91dGlsJ1xyXG5cclxuLy8gQHRzLWlnbm9yZSBUT0RPOiBNYWtlIHRoaXMgbGVzcyBoYWNreVxyXG5Ob2RlTGlzdC5wcm90b3R5cGUuZm9yRWFjaCA9IEhUTUxDb2xsZWN0aW9uLnByb3RvdHlwZS5mb3JFYWNoID0gQXJyYXkucHJvdG90eXBlLmZvckVhY2hcclxuXHJcbmlmIChsb2NhbFN0b3JhZ2VSZWFkKCdkYXRhJykgIT0gbnVsbCkge1xyXG4gICAgc2V0RGF0YShsb2NhbFN0b3JhZ2VSZWFkKCdkYXRhJykpXHJcbn1cclxuXHJcbi8vIEFkZGl0aW9uYWxseSwgaWYgaXQncyB0aGUgdXNlcidzIGZpcnN0IHRpbWUsIHRoZSBwYWdlIGlzIHNldCB0byB0aGUgd2VsY29tZSBwYWdlLlxyXG5pZiAoIWxvY2FsU3RvcmFnZVJlYWQoJ25vV2VsY29tZScpKSB7XHJcbiAgICBsb2NhbFN0b3JhZ2VXcml0ZSgnbm9XZWxjb21lJywgdHJ1ZSlcclxuICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJ3dlbGNvbWUuaHRtbCdcclxufVxyXG5cclxuY29uc3QgTkFWX0VMRU1FTlQgPSBfJChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCduYXYnKSlcclxuY29uc3QgSU5QVVRfRUxFTUVOVFMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFxyXG4gICAgJ2lucHV0W3R5cGU9dGV4dF06bm90KCNuZXdUZXh0KTpub3QoW3JlYWRvbmx5XSksIGlucHV0W3R5cGU9cGFzc3dvcmRdLCBpbnB1dFt0eXBlPWVtYWlsXSwgJyArXHJcbiAgICAnaW5wdXRbdHlwZT11cmxdLCBpbnB1dFt0eXBlPXRlbF0sIGlucHV0W3R5cGU9bnVtYmVyXTpub3QoLmNvbnRyb2wpLCBpbnB1dFt0eXBlPXNlYXJjaF0nXHJcbikgYXMgTm9kZUxpc3RPZjxIVE1MSW5wdXRFbGVtZW50PlxyXG5cclxuLy8gIyMjIyBTZW5kIGZ1bmN0aW9uXHJcbi8vXHJcblxyXG4vLyBUaGlzIGZ1bmN0aW9uIGRpc3BsYXlzIGEgc25hY2tiYXIgdG8gdGVsbCB0aGUgdXNlciBzb21ldGhpbmdcclxuXHJcbi8vIDxhIG5hbWU9XCJyZXRcIi8+XHJcbi8vIFJldHJpZXZpbmcgZGF0YVxyXG4vLyAtLS0tLS0tLS0tLS0tLS1cclxuLy9cclxuZWxlbUJ5SWQoJ2xvZ2luJykuYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgKGV2dCkgPT4ge1xyXG4gICAgZXZ0LnByZXZlbnREZWZhdWx0KClcclxuICAgIGRvbG9naW4obnVsbCwgdHJ1ZSlcclxufSlcclxuXHJcbi8vIFRoZSB2aWV3IHN3aXRjaGluZyBidXR0b24gbmVlZHMgYW4gZXZlbnQgaGFuZGxlci5cclxuZWxlbUJ5SWQoJ3N3aXRjaFZpZXdzJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzd2l0Y2hWaWV3cylcclxuXHJcbi8vIFRoZSBzYW1lIGdvZXMgZm9yIHRoZSBsb2cgb3V0IGJ1dHRvbi5cclxuZWxlbUJ5SWQoJ2xvZ291dCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgbG9nb3V0KVxyXG5cclxuLy8gTm93IHdlIGFzc2lnbiBpdCB0byBjbGlja2luZyB0aGUgYmFja2dyb3VuZC5cclxuZWxlbUJ5SWQoJ2JhY2tncm91bmQnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsb3NlT3BlbmVkKVxyXG5cclxuLy8gVGhlbiwgdGhlIHRhYnMgYXJlIG1hZGUgaW50ZXJhY3RpdmUuXHJcbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyNuYXZUYWJzPmxpJykuZm9yRWFjaCgodGFiLCB0YWJJbmRleCkgPT4ge1xyXG4gIHRhYi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldnQpID0+IHtcclxuICAgIGlmICghc2V0dGluZ3Mudmlld1RyYW5zKSB7XHJcbiAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnbm9UcmFucycpXHJcbiAgICAgIGZvcmNlTGF5b3V0KGRvY3VtZW50LmJvZHkpXHJcbiAgICB9XHJcbiAgICBsb2NhbFN0b3JhZ2VXcml0ZSgndmlldycsIHRhYkluZGV4KVxyXG4gICAgZG9jdW1lbnQuYm9keS5zZXRBdHRyaWJ1dGUoJ2RhdGEtdmlldycsIFN0cmluZyh0YWJJbmRleCkpXHJcbiAgICBpZiAodGFiSW5kZXggPT09IDEpIHtcclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgcmVzaXplQ2FsbGVyKVxyXG4gICAgICAgIGlmIChzZXR0aW5ncy52aWV3VHJhbnMpIHtcclxuICAgICAgICAgICAgbGV0IHN0YXJ0OiBudW1iZXJ8bnVsbCA9IG51bGxcclxuICAgICAgICAgICAgLy8gVGhlIGNvZGUgYmVsb3cgaXMgdGhlIHNhbWUgY29kZSB1c2VkIGluIHRoZSByZXNpemUoKSBmdW5jdGlvbi4gSXQgYmFzaWNhbGx5IGp1c3RcclxuICAgICAgICAgICAgLy8gcG9zaXRpb25zIHRoZSBhc3NpZ25tZW50cyBjb3JyZWN0bHkgYXMgdGhleSBhbmltYXRlXHJcbiAgICAgICAgICAgIGNvbnN0IHdpZHRocyA9IGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKCdzaG93SW5mbycpID9cclxuICAgICAgICAgICAgICAgIFs2NTAsIDExMDAsIDE4MDAsIDI3MDAsIDM4MDAsIDUxMDBdIDogWzM1MCwgODAwLCAxNTAwLCAyNDAwLCAzNTAwLCA0ODAwXVxyXG4gICAgICAgICAgICBsZXQgY29sdW1ucyA9IDFcclxuICAgICAgICAgICAgd2lkdGhzLmZvckVhY2goKHcsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAod2luZG93LmlubmVyV2lkdGggPiB3KSB7IGNvbHVtbnMgPSBpbmRleCArIDEgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICBjb25zdCBhc3NpZ25tZW50cyA9IGdldFJlc2l6ZUFzc2lnbm1lbnRzKClcclxuICAgICAgICAgICAgY29uc3QgY29sdW1uSGVpZ2h0cyA9IEFycmF5LmZyb20obmV3IEFycmF5KGNvbHVtbnMpLCAoKSA9PiAwKVxyXG4gICAgICAgICAgICBjb25zdCBzdGVwID0gKHRpbWVzdGFtcDogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWNvbHVtbnMpIHRocm93IG5ldyBFcnJvcignQ29sdW1ucyBudW1iZXIgbm90IGZvdW5kJylcclxuICAgICAgICAgICAgICAgIGlmIChzdGFydCA9PSBudWxsKSB7IHN0YXJ0ID0gdGltZXN0YW1wIH1cclxuICAgICAgICAgICAgICAgIGFzc2lnbm1lbnRzLmZvckVhY2goKGFzc2lnbm1lbnQsIG4pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjb2wgPSBuICUgY29sdW1uc1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChuIDwgY29sdW1ucykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbHVtbkhlaWdodHNbY29sXSA9IDBcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYXNzaWdubWVudC5zdHlsZS50b3AgPSBjb2x1bW5IZWlnaHRzW2NvbF0gKyAncHgnXHJcbiAgICAgICAgICAgICAgICAgICAgYXNzaWdubWVudC5zdHlsZS5sZWZ0ID0gKCgxMDAgLyBjb2x1bW5zKSAqIGNvbCkgKyAnJSdcclxuICAgICAgICAgICAgICAgICAgICBhc3NpZ25tZW50LnN0eWxlLnJpZ2h0ID0gKCgxMDAgLyBjb2x1bW5zKSAqIChjb2x1bW5zIC0gY29sIC0gMSkpICsgJyUnXHJcbiAgICAgICAgICAgICAgICAgICAgY29sdW1uSGVpZ2h0c1tjb2xdICs9IGFzc2lnbm1lbnQub2Zmc2V0SGVpZ2h0ICsgMjRcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICBpZiAoKHRpbWVzdGFtcCAtIHN0YXJ0KSA8IDM1MCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0ZXApXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShzdGVwKVxyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICghY29sdW1ucykgdGhyb3cgbmV3IEVycm9yKCdDb2x1bW5zIG51bWJlciBub3QgZm91bmQnKVxyXG4gICAgICAgICAgICAgICAgYXNzaWdubWVudHMuZm9yRWFjaCgoYXNzaWdubWVudCwgbikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbCA9IG4gJSBjb2x1bW5zXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG4gPCBjb2x1bW5zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29sdW1uSGVpZ2h0c1tjb2xdID0gMFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBhc3NpZ25tZW50LnN0eWxlLnRvcCA9IGNvbHVtbkhlaWdodHNbY29sXSArICdweCdcclxuICAgICAgICAgICAgICAgICAgICBjb2x1bW5IZWlnaHRzW2NvbF0gKz0gYXNzaWdubWVudC5vZmZzZXRIZWlnaHQgKyAyNFxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfSwgMzUwKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJlc2l6ZSgpXHJcbiAgICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgZ2V0U2Nyb2xsKCkpXHJcbiAgICAgICAgTkFWX0VMRU1FTlQuY2xhc3NMaXN0LmFkZCgnaGVhZHJvb20tLWxvY2tlZCcpXHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIE5BVl9FTEVNRU5ULmNsYXNzTGlzdC5yZW1vdmUoJ2hlYWRyb29tLS11bnBpbm5lZCcpXHJcbiAgICAgICAgICAgIE5BVl9FTEVNRU5ULmNsYXNzTGlzdC5yZW1vdmUoJ2hlYWRyb29tLS1sb2NrZWQnKVxyXG4gICAgICAgICAgICBOQVZfRUxFTUVOVC5jbGFzc0xpc3QuYWRkKCdoZWFkcm9vbS0tcGlubmVkJylcclxuICAgICAgICAgICAgcmVxdWVzdElkbGVDYWxsYmFjaygoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB6ZXJvTGlzdERhdGVPZmZzZXQoKVxyXG4gICAgICAgICAgICAgICAgdXBkYXRlTGlzdE5hdigpXHJcbiAgICAgICAgICAgICAgICBkaXNwbGF5KClcclxuICAgICAgICAgICAgfSwge3RpbWVvdXQ6IDIwMDB9KVxyXG4gICAgICAgIH0sIDM1MClcclxuICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgcmVzaXplQ2FsbGVyKVxyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5hc3NpZ25tZW50JykuZm9yRWFjaCgoYXNzaWdubWVudCkgPT4ge1xyXG4gICAgICAgICAgICAoYXNzaWdubWVudCBhcyBIVE1MRWxlbWVudCkuc3R5bGUudG9wID0gJ2F1dG8nXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuICAgIGlmICghc2V0dGluZ3Mudmlld1RyYW5zKSB7XHJcbiAgICAgIGZvcmNlTGF5b3V0KGRvY3VtZW50LmJvZHkpXHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdub1RyYW5zJylcclxuICAgICAgfSwgMzUwKVxyXG4gICAgfVxyXG4gIH0pXHJcbn0pXHJcblxyXG4vLyBBbmQgdGhlIGluZm8gdGFicyAoanVzdCBhIGxpdHRsZSBsZXNzIGNvZGUpXHJcbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyNpbmZvVGFicz5saScpLmZvckVhY2goKHRhYiwgdGFiSW5kZXgpID0+IHtcclxuICAgIHRhYi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldnQpID0+IHtcclxuICAgICAgICBlbGVtQnlJZCgnaW5mbycpLnNldEF0dHJpYnV0ZSgnZGF0YS12aWV3JywgU3RyaW5nKHRhYkluZGV4KSlcclxuICAgIH0pXHJcbn0pXHJcblxyXG4vLyBUaGUgdmlldyBpcyBzZXQgdG8gd2hhdCBpdCB3YXMgbGFzdC5cclxuaWYgKGxvY2FsU3RvcmFnZVJlYWQoJ3ZpZXcnKSAhPSBudWxsKSB7XHJcbiAgZG9jdW1lbnQuYm9keS5zZXRBdHRyaWJ1dGUoJ2RhdGEtdmlldycsIGxvY2FsU3RvcmFnZVJlYWQoJ3ZpZXcnKSlcclxuICBpZiAobG9jYWxTdG9yYWdlUmVhZCgndmlldycpID09PSAnMScpIHtcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCByZXNpemVDYWxsZXIpXHJcbiAgfVxyXG59XHJcblxyXG4vLyBBZGRpdGlvbmFsbHksIHRoZSBhY3RpdmUgY2xhc3MgbmVlZHMgdG8gYmUgYWRkZWQgd2hlbiBpbnB1dHMgYXJlIHNlbGVjdGVkIChmb3IgdGhlIGxvZ2luIGJveCkuXHJcbklOUFVUX0VMRU1FTlRTLmZvckVhY2goKGlucHV0KSA9PiB7XHJcbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZXZ0KSA9PiB7XHJcbiAgICAgICAgXyRoKF8kaChpbnB1dC5wYXJlbnROb2RlKS5xdWVyeVNlbGVjdG9yKCdsYWJlbCcpKS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG4gICAgfSlcclxuICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgKGV2dCkgPT4ge1xyXG4gICAgICAgIF8kaChfJGgoaW5wdXQucGFyZW50Tm9kZSkucXVlcnlTZWxlY3RvcignbGFiZWwnKSkuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuICAgIH0pXHJcbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgKGV2dCkgPT4ge1xyXG4gICAgICAgIGlmIChpbnB1dC52YWx1ZS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgXyRoKF8kaChpbnB1dC5wYXJlbnROb2RlKS5xdWVyeVNlbGVjdG9yKCdsYWJlbCcpKS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbn0pXHJcblxyXG4vLyBXaGVuIHRoZSBlc2NhcGUga2V5IGlzIHByZXNzZWQsIHRoZSBjdXJyZW50IGFzc2lnbm1lbnQgc2hvdWxkIGJlIGNsb3NlZC5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZXZ0KSA9PiB7XHJcbiAgaWYgKGV2dC53aGljaCA9PT0gMjcpIHsgLy8gRXNjYXBlIGtleSBwcmVzc2VkXHJcbiAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnZnVsbCcpLmxlbmd0aCAhPT0gMCkgeyByZXR1cm4gY2xvc2VPcGVuZWQobmV3IEV2ZW50KCdHZW5lcmF0ZWQgRXZlbnQnKSkgfVxyXG4gIH1cclxufSk7XHJcblxyXG4vLyBJZiBpdCdzIHdpbnRlciB0aW1lLCBhIGNsYXNzIGlzIGFkZGVkIHRvIHRoZSBib2R5IGVsZW1lbnQuXHJcbigoKSA9PiB7XHJcbiAgICBjb25zdCB0b2RheURhdGUgPSBuZXcgRGF0ZSgpXHJcbiAgICBpZiAobmV3IERhdGUodG9kYXlEYXRlLmdldEZ1bGxZZWFyKCksIDEwLCAyNykgPD0gdG9kYXlEYXRlICYmXHJcbiAgICAgICAgdG9kYXlEYXRlIDw9IG5ldyBEYXRlKHRvZGF5RGF0ZS5nZXRGdWxsWWVhcigpLCAxMSwgMzIpKSB7XHJcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnd2ludGVyJylcclxuICAgIH1cclxufSkoKVxyXG5cclxuLy8gRm9yIHRoZSBuYXZiYXIgdG9nZ2xlIGJ1dHRvbnMsIGEgZnVuY3Rpb24gdG8gdG9nZ2xlIHRoZSBhY3Rpb24gaXMgZGVmaW5lZCB0byBlbGltaW5hdGUgY29kZS5cclxuZnVuY3Rpb24gbmF2VG9nZ2xlKGVsZW06IHN0cmluZywgbHM6IHN0cmluZywgZj86ICgpID0+IHZvaWQpOiB2b2lkIHtcclxuICAgIHJpcHBsZShlbGVtQnlJZChlbGVtKSlcclxuICAgIGVsZW1CeUlkKGVsZW0pLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCAoKSA9PiB7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QudG9nZ2xlKGxzKVxyXG4gICAgICAgIHJlc2l6ZSgpXHJcbiAgICAgICAgbG9jYWxTdG9yYWdlV3JpdGUobHMsIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKGxzKSlcclxuICAgICAgICBpZiAoZiAhPSBudWxsKSBmKClcclxuICAgIH0pXHJcbiAgICBpZiAobG9jYWxTdG9yYWdlUmVhZChscykpIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZChscylcclxufVxyXG5cclxuLy8gVGhlIGJ1dHRvbiB0byBzaG93L2hpZGUgY29tcGxldGVkIGFzc2lnbm1lbnRzIGluIGxpc3QgdmlldyBhbHNvIG5lZWRzIGV2ZW50IGxpc3RlbmVycy5cclxubmF2VG9nZ2xlKCdjdkJ1dHRvbicsICdzaG93RG9uZScsICgpID0+IHNldFRpbWVvdXQocmVzaXplLCAxMDAwKSlcclxuXHJcbi8vIFRoZSBzYW1lIGdvZXMgZm9yIHRoZSBidXR0b24gdGhhdCBzaG93cyB1cGNvbWluZyB0ZXN0cy5cclxuaWYgKGxvY2FsU3RvcmFnZS5zaG93SW5mbyA9PSBudWxsKSB7IGxvY2FsU3RvcmFnZS5zaG93SW5mbyA9IEpTT04uc3RyaW5naWZ5KHRydWUpIH1cclxubmF2VG9nZ2xlKCdpbmZvQnV0dG9uJywgJ3Nob3dJbmZvJylcclxuXHJcbi8vIFRoaXMgYWxzbyBnZXRzIHJlcGVhdGVkIGZvciB0aGUgdGhlbWUgdG9nZ2xpbmcuXHJcbm5hdlRvZ2dsZSgnbGlnaHRCdXR0b24nLCAnZGFyaycpXHJcblxyXG4vLyBGb3IgZWFzZSBvZiBhbmltYXRpb25zLCBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIHByb21pc2UgaXMgZGVmaW5lZC5cclxuZnVuY3Rpb24gYW5pbWF0ZUVsKGVsOiBIVE1MRWxlbWVudCwga2V5ZnJhbWVzOiBBbmltYXRpb25LZXlGcmFtZVtdLCBvcHRpb25zOiBBbmltYXRpb25PcHRpb25zKTpcclxuICAgIFByb21pc2U8QW5pbWF0aW9uUGxheWJhY2tFdmVudD4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICBjb25zdCBwbGF5ZXIgPSBlbC5hbmltYXRlKGtleWZyYW1lcywgb3B0aW9ucylcclxuICAgICAgICBwbGF5ZXIub25maW5pc2ggPSAoZSkgPT4gcmVzb2x2ZShlKVxyXG4gICAgfSlcclxufVxyXG5cclxuLy8gSW4gb3JkZXIgdG8gbWFrZSB0aGUgcHJldmlvdXMgZGF0ZSAvIG5leHQgZGF0ZSBidXR0b25zIGRvIHNvbWV0aGluZywgdGhleSBuZWVkIGV2ZW50IGxpc3RlbmVycy5cclxuZWxlbUJ5SWQoJ2xpc3RuZXh0JykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgY29uc3QgcGQgPSBlbGVtQnlJZCgnbGlzdHByZXZkYXRlJylcclxuICBjb25zdCB0ZCA9IGVsZW1CeUlkKCdsaXN0bm93ZGF0ZScpXHJcbiAgY29uc3QgbmQgPSBlbGVtQnlJZCgnbGlzdG5leHRkYXRlJylcclxuICBpbmNyZW1lbnRMaXN0RGF0ZU9mZnNldCgpXHJcbiAgZGlzcGxheSgpXHJcbiAgbmQuc3R5bGUuZGlzcGxheSA9ICdpbmxpbmUtYmxvY2snXHJcbiAgcmV0dXJuIFByb21pc2UucmFjZShbXHJcbiAgICBhbmltYXRlRWwodGQsIFtcclxuICAgICAge3RyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoMCUpJywgb3BhY2l0eTogMX0sXHJcbiAgICAgIHtvcGFjaXR5OiAwfSxcclxuICAgICAge3RyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoLTEwMCUpJywgb3BhY2l0eTogMH1cclxuICAgIF0sIHtkdXJhdGlvbjogMzAwLCBlYXNpbmc6ICdlYXNlLW91dCd9KSxcclxuICAgIGFuaW1hdGVFbChuZCwgW1xyXG4gICAgICB7dHJhbnNmb3JtOiAndHJhbnNsYXRlWCgwJSknLCBvcGFjaXR5OiAwfSxcclxuICAgICAge29wYWNpdHk6IDB9LFxyXG4gICAgICB7dHJhbnNmb3JtOiAndHJhbnNsYXRlWCgtMTAwJSknLCBvcGFjaXR5OiAxfVxyXG4gICAgXSwge2R1cmF0aW9uOiAzMDAsIGVhc2luZzogJ2Vhc2Utb3V0J30pXHJcbiAgXSkudGhlbigoKSA9PiB7XHJcbiAgICBwZC5pbm5lckhUTUwgPSB0ZC5pbm5lckhUTUxcclxuICAgIHRkLmlubmVySFRNTCA9IG5kLmlubmVySFRNTFxyXG4gICAgY29uc3QgbGlzdERhdGUyID0gbmV3IERhdGUoKVxyXG4gICAgbGlzdERhdGUyLnNldERhdGUobGlzdERhdGUyLmdldERhdGUoKSArIDEgKyBnZXRMaXN0RGF0ZU9mZnNldCgpKVxyXG4gICAgbmQuaW5uZXJIVE1MID0gZGF0ZVN0cmluZyhsaXN0RGF0ZTIpLnJlcGxhY2UoJ1RvZGF5JywgJ05vdycpXHJcbiAgICByZXR1cm4gbmQuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xyXG4gIH0pXHJcbn0pXHJcblxyXG4vLyBUaGUgZXZlbnQgbGlzdGVuZXIgZm9yIHRoZSBwcmV2aW91cyBkYXRlIGJ1dHRvbiBpcyBtb3N0bHkgdGhlIHNhbWUuXHJcbmVsZW1CeUlkKCdsaXN0YmVmb3JlJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgY29uc3QgcGQgPSBlbGVtQnlJZCgnbGlzdHByZXZkYXRlJylcclxuICBjb25zdCB0ZCA9IGVsZW1CeUlkKCdsaXN0bm93ZGF0ZScpXHJcbiAgY29uc3QgbmQgPSBlbGVtQnlJZCgnbGlzdG5leHRkYXRlJylcclxuICBkZWNyZW1lbnRMaXN0RGF0ZU9mZnNldCgpXHJcbiAgZGlzcGxheSgpXHJcbiAgcGQuc3R5bGUuZGlzcGxheSA9ICdpbmxpbmUtYmxvY2snXHJcbiAgcmV0dXJuIFByb21pc2UucmFjZShbXHJcbiAgICBhbmltYXRlRWwodGQsIFtcclxuICAgICAge3RyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoLTEwMCUpJywgb3BhY2l0eTogMX0sXHJcbiAgICAgIHtvcGFjaXR5OiAwfSxcclxuICAgICAge3RyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoMCUpJywgb3BhY2l0eTogMH1cclxuICAgIF0sIHtkdXJhdGlvbjogMzAwLCBlYXNpbmc6ICdlYXNlLW91dCd9KSxcclxuICAgIGFuaW1hdGVFbChwZCwgW1xyXG4gICAgICB7dHJhbnNmb3JtOiAndHJhbnNsYXRlWCgtMTAwJSknLCBvcGFjaXR5OiAwfSxcclxuICAgICAge29wYWNpdHk6IDB9LFxyXG4gICAgICB7dHJhbnNmb3JtOiAndHJhbnNsYXRlWCgwJSknLCBvcGFjaXR5OiAxfVxyXG4gICAgXSwge2R1cmF0aW9uOiAzMDAsIGVhc2luZzogJ2Vhc2Utb3V0J30pXHJcbiAgXSkudGhlbigoKSA9PiB7XHJcbiAgICBuZC5pbm5lckhUTUwgPSB0ZC5pbm5lckhUTUxcclxuICAgIHRkLmlubmVySFRNTCA9IHBkLmlubmVySFRNTFxyXG4gICAgY29uc3QgbGlzdERhdGUyID0gbmV3IERhdGUoKVxyXG4gICAgbGlzdERhdGUyLnNldERhdGUoKGxpc3REYXRlMi5nZXREYXRlKCkgKyBnZXRMaXN0RGF0ZU9mZnNldCgpKSAtIDEpXHJcbiAgICBwZC5pbm5lckhUTUwgPSBkYXRlU3RyaW5nKGxpc3REYXRlMikucmVwbGFjZSgnVG9kYXknLCAnTm93JylcclxuICAgIHJldHVybiBwZC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXHJcbiAgfSlcclxufSlcclxuXHJcbi8vIFdoZW5ldmVyIGEgZGF0ZSBpcyBkb3VibGUgY2xpY2tlZCwgbG9uZyB0YXBwZWQsIG9yIGZvcmNlIHRvdWNoZWQsIGxpc3QgdmlldyBmb3IgdGhhdCBkYXkgaXMgZGlzcGxheWVkLlxyXG5mdW5jdGlvbiB1cGRhdGVMaXN0TmF2KCk6IHZvaWQge1xyXG4gICAgY29uc3QgZCA9IG5ldyBEYXRlKClcclxuICAgIGQuc2V0RGF0ZSgoZC5nZXREYXRlKCkgKyBnZXRMaXN0RGF0ZU9mZnNldCgpKSAtIDEpXHJcbiAgICBjb25zdCB1cCA9IChpZDogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgZWxlbUJ5SWQoaWQpLmlubmVySFRNTCA9IGRhdGVTdHJpbmcoZCkucmVwbGFjZSgnVG9kYXknLCAnTm93JylcclxuICAgICAgICByZXR1cm4gZC5zZXREYXRlKGQuZ2V0RGF0ZSgpICsgMSlcclxuICAgIH1cclxuICAgIHVwKCdsaXN0cHJldmRhdGUnKVxyXG4gICAgdXAoJ2xpc3Rub3dkYXRlJylcclxuICAgIHVwKCdsaXN0bmV4dGRhdGUnKVxyXG59XHJcblxyXG5mdW5jdGlvbiBzd2l0Y2hUb0xpc3QoZXZ0OiBFdmVudCk6IHZvaWQge1xyXG4gICAgaWYgKF8kaChldnQudGFyZ2V0KS5jbGFzc0xpc3QuY29udGFpbnMoJ21vbnRoJykgfHwgXyRoKGV2dC50YXJnZXQpLmNsYXNzTGlzdC5jb250YWlucygnZGF0ZScpKSB7XHJcbiAgICAgICAgc2V0TGlzdERhdGVPZmZzZXQodG9EYXRlTnVtKE51bWJlcihfJGgoXyRoKGV2dC50YXJnZXQpLnBhcmVudE5vZGUpLmdldEF0dHJpYnV0ZSgnZGF0YS1kYXRlJykpKSAtIHRvZGF5KCkpXHJcbiAgICAgICAgdXBkYXRlTGlzdE5hdigpXHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5zZXRBdHRyaWJ1dGUoJ2RhdGEtdmlldycsICcxJylcclxuICAgICAgICByZXR1cm4gZGlzcGxheSgpXHJcbiAgICB9XHJcbn1cclxuXHJcbmRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcignZGJsY2xpY2snLCBzd2l0Y2hUb0xpc3QpXHJcbmRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcignd2Via2l0bW91c2Vmb3JjZXVwJywgc3dpdGNoVG9MaXN0KTtcclxuKCgpID0+IHtcclxuICAgIGxldCB0YXB0aW1lcjogbnVtYmVyfG51bGwgPSBudWxsXHJcbiAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCAoZXZ0KSA9PiB0YXB0aW1lciA9IHNldFRpbWVvdXQoKCgpID0+IHN3aXRjaFRvTGlzdChldnQpKSwgMTAwMCkpXHJcbiAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgKGV2dCkgPT4ge1xyXG4gICAgICAgIGlmICh0YXB0aW1lcikgY2xlYXJUaW1lb3V0KHRhcHRpbWVyKVxyXG4gICAgICAgIHRhcHRpbWVyID0gbnVsbFxyXG4gICAgfSlcclxufSkoKVxyXG5cclxuLy8gPGEgbmFtZT1cInNpZGVcIi8+XHJcbi8vIFNpZGUgbWVudSBhbmQgTmF2YmFyXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbi8vXHJcbi8vIFRoZSBbSGVhZHJvb20gbGlicmFyeV0oaHR0cHM6Ly9naXRodWIuY29tL1dpY2t5TmlsbGlhbXMvaGVhZHJvb20uanMpIGlzIHVzZWQgdG8gc2hvdyB0aGUgbmF2YmFyIHdoZW4gc2Nyb2xsaW5nIHVwXHJcbmNvbnN0IGhlYWRyb29tID0gbmV3IEhlYWRyb29tKF8kKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ25hdicpKSwge1xyXG4gIHRvbGVyYW5jZTogMTAsXHJcbiAgb2Zmc2V0OiA2NlxyXG59KVxyXG5oZWFkcm9vbS5pbml0KClcclxuXHJcbi8vIEFsc28sIHRoZSBzaWRlIG1lbnUgbmVlZHMgZXZlbnQgbGlzdGVuZXJzLlxyXG5lbGVtQnlJZCgnY29sbGFwc2VCdXR0b24nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbidcclxuICBlbGVtQnlJZCgnc2lkZU5hdicpLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcbiAgcmV0dXJuIGVsZW1CeUlkKCdzaWRlQmFja2dyb3VuZCcpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXHJcbn0pXHJcblxyXG5lbGVtQnlJZCgnc2lkZUJhY2tncm91bmQnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICBlbGVtQnlJZCgnc2lkZUJhY2tncm91bmQnKS5zdHlsZS5vcGFjaXR5ID0gJzAnXHJcbiAgZWxlbUJ5SWQoJ3NpZGVOYXYnKS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gIGVsZW1CeUlkKCdkcmFnVGFyZ2V0Jykuc3R5bGUud2lkdGggPSAnJ1xyXG4gIHJldHVybiBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgIGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnYXV0bydcclxuICAgIGVsZW1CeUlkKCdzaWRlQmFja2dyb3VuZCcpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcclxuICB9XHJcbiAgLCAzNTApXHJcbn0pXHJcblxyXG51cGRhdGVBdmF0YXIoKVxyXG5cclxuLy8gPGEgbmFtZT1cImF0aGVuYVwiLz4gQXRoZW5hIChTY2hvb2xvZ3kpXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLVxyXG4vL1xyXG5cclxuLy8gPGEgbmFtZT1cInNldHRpbmdzXCIvPiBTZXR0aW5nc1xyXG4vLyAtLS0tLS0tLVxyXG4vL1xyXG4vLyBUaGUgY29kZSBiZWxvdyB1cGRhdGVzIHRoZSBjdXJyZW50IHZlcnNpb24gdGV4dCBpbiB0aGUgc2V0dGluZ3MuIEkgc2hvdWxkJ3ZlIHB1dCB0aGlzIHVuZGVyIHRoZVxyXG4vLyBVcGRhdGVzIHNlY3Rpb24sIGJ1dCBpdCBzaG91bGQgZ28gYmVmb3JlIHRoZSBkaXNwbGF5KCkgZnVuY3Rpb24gZm9yY2VzIGEgcmVmbG93LlxyXG5lbGVtQnlJZCgndmVyc2lvbicpLmlubmVySFRNTCA9IFZFUlNJT05cclxuXHJcbi8vIFRvIGJyaW5nIHVwIHRoZSBzZXR0aW5ncyB3aW5kb3dzLCBhbiBldmVudCBsaXN0ZW5lciBuZWVkcyB0byBiZSBhZGRlZCB0byB0aGUgYnV0dG9uLlxyXG5lbGVtQnlJZCgnc2V0dGluZ3NCJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICBlbGVtQnlJZCgnc2lkZUJhY2tncm91bmQnKS5jbGljaygpXHJcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ3NldHRpbmdzU2hvd24nKVxyXG4gICAgZWxlbUJ5SWQoJ2JyYW5kJykuaW5uZXJIVE1MID0gJ1NldHRpbmdzJ1xyXG4gICAgcmV0dXJuIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIF8kaChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdtYWluJykpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcclxuICAgIH0pXHJcbn0pXHJcblxyXG4vLyBUaGUgYmFjayBidXR0b24gYWxzbyBuZWVkcyB0byBjbG9zZSB0aGUgc2V0dGluZ3Mgd2luZG93LlxyXG5lbGVtQnlJZCgnYmFja0J1dHRvbicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgXyRoKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ21haW4nKSkuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcclxuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnc2V0dGluZ3NTaG93bicpXHJcbiAgICByZXR1cm4gZWxlbUJ5SWQoJ2JyYW5kJykuaW5uZXJIVE1MID0gJ0NoZWNrIFBDUidcclxufSlcclxuXHJcbi8vIFRoZSBjb2RlIGJlbG93IGlzIHdoYXQgdGhlIHNldHRpbmdzIGNvbnRyb2wuXHJcbmlmIChzZXR0aW5ncy5zZXBUYXNrcykge1xyXG4gICAgZWxlbUJ5SWQoJ2luZm8nKS5jbGFzc0xpc3QuYWRkKCdpc1Rhc2tzJylcclxuICAgIGVsZW1CeUlkKCduZXcnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXHJcbn1cclxuaWYgKHNldHRpbmdzLmhvbGlkYXlUaGVtZXMpIHsgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdob2xpZGF5VGhlbWVzJykgfVxyXG5pZiAoc2V0dGluZ3Muc2VwVGFza0NsYXNzKSB7IGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnc2VwVGFza0NsYXNzJykgfVxyXG5pbnRlcmZhY2UgSUNvbG9yTWFwIHsgW2Nsczogc3RyaW5nXTogc3RyaW5nIH1cclxubGV0IGFzc2lnbm1lbnRDb2xvcnM6IElDb2xvck1hcCA9IGxvY2FsU3RvcmFnZVJlYWQoJ2Fzc2lnbm1lbnRDb2xvcnMnLCB7XHJcbiAgICBjbGFzc3dvcms6ICcjNjg5ZjM4JywgaG9tZXdvcms6ICcjMjE5NmYzJywgbG9uZ3Rlcm06ICcjZjU3YzAwJywgdGVzdDogJyNmNDQzMzYnXHJcbn0pXHJcbmxldCBjbGFzc0NvbG9ycyA9IGxvY2FsU3RvcmFnZVJlYWQoJ2NsYXNzQ29sb3JzJywgKCkgPT4ge1xyXG4gICAgY29uc3QgY2M6IElDb2xvck1hcCA9IHt9XHJcbiAgICBjb25zdCBkYXRhID0gZ2V0RGF0YSgpXHJcbiAgICBpZiAoIWRhdGEpIHJldHVybiBjY1xyXG4gICAgZGF0YS5jbGFzc2VzLmZvckVhY2goKGM6IHN0cmluZykgPT4ge1xyXG4gICAgICAgIGNjW2NdID0gJyM2MTYxNjEnXHJcbiAgICB9KVxyXG4gICAgcmV0dXJuIGNjXHJcbn0pXHJcbmVsZW1CeUlkKGAke3NldHRpbmdzLmNvbG9yVHlwZX1Db2xvcnNgKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCAoKSA9PiB7XHJcbiAgaWYgKHNldHRpbmdzLnJlZnJlc2hPbkZvY3VzKSBmZXRjaCgpXHJcbn0pXHJcbmZ1bmN0aW9uIGludGVydmFsUmVmcmVzaCgpOiB2b2lkIHtcclxuICAgIGNvbnN0IHIgPSBzZXR0aW5ncy5yZWZyZXNoUmF0ZVxyXG4gICAgaWYgKHIgPiAwKSB7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoJ1JlZnJlc2hpbmcgYmVjYXVzZSBvZiB0aW1lcicpXHJcbiAgICAgICAgICAgIGZldGNoKClcclxuICAgICAgICAgICAgaW50ZXJ2YWxSZWZyZXNoKClcclxuICAgICAgICB9LCByICogNjAgKiAxMDAwKVxyXG4gICAgfVxyXG59XHJcbmludGVydmFsUmVmcmVzaCgpXHJcblxyXG4vLyBGb3IgY2hvb3NpbmcgY29sb3JzLCB0aGUgY29sb3IgY2hvb3NpbmcgYm94ZXMgbmVlZCB0byBiZSBpbml0aWFsaXplZC5cclxuY29uc3QgcGFsZXR0ZTogSUNvbG9yTWFwID0ge1xyXG4gICcjZjQ0MzM2JzogJyNCNzFDMUMnLFxyXG4gICcjZTkxZTYzJzogJyM4ODBFNEYnLFxyXG4gICcjOWMyN2IwJzogJyM0QTE0OEMnLFxyXG4gICcjNjczYWI3JzogJyMzMTFCOTInLFxyXG4gICcjM2Y1MWI1JzogJyMxQTIzN0UnLFxyXG4gICcjMjE5NmYzJzogJyMwRDQ3QTEnLFxyXG4gICcjMDNhOWY0JzogJyMwMTU3OUInLFxyXG4gICcjMDBiY2Q0JzogJyMwMDYwNjQnLFxyXG4gICcjMDA5Njg4JzogJyMwMDRENDAnLFxyXG4gICcjNGNhZjUwJzogJyMxQjVFMjAnLFxyXG4gICcjNjg5ZjM4JzogJyMzMzY5MUUnLFxyXG4gICcjYWZiNDJiJzogJyM4Mjc3MTcnLFxyXG4gICcjZmJjMDJkJzogJyNGNTdGMTcnLFxyXG4gICcjZmZhMDAwJzogJyNGRjZGMDAnLFxyXG4gICcjZjU3YzAwJzogJyNFNjUxMDAnLFxyXG4gICcjZmY1NzIyJzogJyNCRjM2MEMnLFxyXG4gICcjNzk1NTQ4JzogJyMzRTI3MjMnLFxyXG4gICcjNjE2MTYxJzogJyMyMTIxMjEnXHJcbn1cclxuXHJcbmdldENsYXNzZXMoKS5mb3JFYWNoKChjOiBzdHJpbmcpID0+IHtcclxuICAgIGNvbnN0IGQgPSBlbGVtZW50KCdkaXYnLCBbXSwgYylcclxuICAgIGQuc2V0QXR0cmlidXRlKCdkYXRhLWNvbnRyb2wnLCBjKVxyXG4gICAgZC5hcHBlbmRDaGlsZChlbGVtZW50KCdzcGFuJywgW10pKVxyXG4gICAgZWxlbUJ5SWQoJ2NsYXNzQ29sb3JzJykuYXBwZW5kQ2hpbGQoZClcclxufSlcclxuZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNvbG9ycycpLmZvckVhY2goKGUpID0+IHtcclxuICAgIGUucXVlcnlTZWxlY3RvckFsbCgnZGl2JykuZm9yRWFjaCgoY29sb3IpID0+IHtcclxuICAgICAgICBjb25zdCBjb250cm9sbGVkQ29sb3IgPSBjb2xvci5nZXRBdHRyaWJ1dGUoJ2RhdGEtY29udHJvbCcpXHJcbiAgICAgICAgaWYgKCFjb250cm9sbGVkQ29sb3IpIHRocm93IG5ldyBFcnJvcignRWxlbWVudCBoYXMgbm8gY29udHJvbGxlZCBjb2xvcicpXHJcblxyXG4gICAgICAgIGNvbnN0IHNwID0gXyRoKGNvbG9yLnF1ZXJ5U2VsZWN0b3IoJ3NwYW4nKSlcclxuICAgICAgICBjb25zdCBsaXN0TmFtZSA9IGUuZ2V0QXR0cmlidXRlKCdpZCcpID09PSAnY2xhc3NDb2xvcnMnID8gJ2NsYXNzQ29sb3JzJyA6ICdhc3NpZ25tZW50Q29sb3JzJ1xyXG4gICAgICAgIGNvbnN0IGxpc3RTZXR0ZXIgPSAodjogSUNvbG9yTWFwKSA9PiB7XHJcbiAgICAgICAgICAgIGUuZ2V0QXR0cmlidXRlKCdpZCcpID09PSAnY2xhc3NDb2xvcnMnID8gY2xhc3NDb2xvcnMgPSB2IDogYXNzaWdubWVudENvbG9ycyA9IHZcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgbGlzdCA9IGUuZ2V0QXR0cmlidXRlKCdpZCcpID09PSAnY2xhc3NDb2xvcnMnID8gY2xhc3NDb2xvcnMgOiBhc3NpZ25tZW50Q29sb3JzXHJcbiAgICAgICAgc3Auc3R5bGUuYmFja2dyb3VuZENvbG9yID0gbGlzdFtjb250cm9sbGVkQ29sb3JdXHJcbiAgICAgICAgT2JqZWN0LmtleXMocGFsZXR0ZSkuZm9yRWFjaCgocCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBwZSA9IGVsZW1lbnQoJ3NwYW4nLCBbXSlcclxuICAgICAgICAgICAgcGUuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gcFxyXG4gICAgICAgICAgICBpZiAocCA9PT0gbGlzdFtjb250cm9sbGVkQ29sb3JdKSB7XHJcbiAgICAgICAgICAgICAgICBwZS5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc3AuYXBwZW5kQ2hpbGQocGUpXHJcbiAgICAgICAgfSlcclxuICAgICAgICBjb25zdCBjdXN0b20gPSBlbGVtZW50KCdzcGFuJywgWydjdXN0b21Db2xvciddLCBgPGE+Q3VzdG9tPC9hPiBcXFxyXG4gICAgPGlucHV0IHR5cGU9J3RleHQnIHBsYWNlaG9sZGVyPSdXYXMgJHtsaXN0W2NvbnRyb2xsZWRDb2xvcl19JyAvPiBcXFxyXG4gICAgPHNwYW4gY2xhc3M9J2N1c3RvbUluZm8nPlVzZSBhbnkgQ1NTIHZhbGlkIGNvbG9yIG5hbWUsIHN1Y2ggYXMgXFxcclxuICAgIDxjb2RlPiNGNDQzMzY8L2NvZGU+IG9yIDxjb2RlPnJnYig2NCwgNDMsIDIpPC9jb2RlPiBvciA8Y29kZT5jeWFuPC9jb2RlPjwvc3Bhbj4gXFxcclxuICAgIDxhIGNsYXNzPSdjdXN0b21Payc+U2V0PC9hPmApXHJcbiAgICAgICAgY3VzdG9tLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2dCkgPT4gZXZ0LnN0b3BQcm9wYWdhdGlvbigpKVxyXG4gICAgICAgIF8kKGN1c3RvbS5xdWVyeVNlbGVjdG9yKCdhJykpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2dCkgPT4ge1xyXG4gICAgICAgICAgICBzcC5jbGFzc0xpc3QudG9nZ2xlKCdvbkN1c3RvbScpXHJcbiAgICAgICAgICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgc3AuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZ0KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChzcC5jbGFzc0xpc3QuY29udGFpbnMoJ2Nob29zZScpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXQgPSBfJGgoZXZ0LnRhcmdldClcclxuICAgICAgICAgICAgICAgIGNvbnN0IGJnID0gdGlueWNvbG9yKHRhcmdldC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgfHwgJyMwMDAnKS50b0hleFN0cmluZygpXHJcbiAgICAgICAgICAgICAgICBsaXN0W2NvbnRyb2xsZWRDb2xvcl0gPSBiZ1xyXG4gICAgICAgICAgICAgICAgc3Auc3R5bGUuYmFja2dyb3VuZENvbG9yID0gYmdcclxuICAgICAgICAgICAgICAgIGNvbnN0IHNlbGVjdGVkID0gdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5zZWxlY3RlZCcpXHJcbiAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZC5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKVxyXG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlW2xpc3ROYW1lXSA9IEpTT04uc3RyaW5naWZ5KGxpc3QpXHJcbiAgICAgICAgICAgICAgICBsaXN0U2V0dGVyKGxpc3QpXHJcbiAgICAgICAgICAgICAgICB1cGRhdGVDb2xvcnMoKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNwLmNsYXNzTGlzdC50b2dnbGUoJ2Nob29zZScpXHJcbiAgICAgICAgfSlcclxuICAgICAgICBfJChjdXN0b20ucXVlcnlTZWxlY3RvcignLmN1c3RvbU9rJykpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2dCkgPT4ge1xyXG4gICAgICAgICAgICBzcC5jbGFzc0xpc3QucmVtb3ZlKCdvbkN1c3RvbScpXHJcbiAgICAgICAgICAgIHNwLmNsYXNzTGlzdC50b2dnbGUoJ2Nob29zZScpXHJcbiAgICAgICAgICAgIGNvbnN0IHNlbGVjdGVkRWwgPSBzcC5xdWVyeVNlbGVjdG9yKCcuc2VsZWN0ZWQnKVxyXG4gICAgICAgICAgICBpZiAoc2VsZWN0ZWRFbCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxlY3RlZEVsLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzcC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAobGlzdFtjb250cm9sbGVkQ29sb3JdID0gXyQoY3VzdG9tLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0JykpLnZhbHVlKVxyXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2VbbGlzdE5hbWVdID0gSlNPTi5zdHJpbmdpZnkobGlzdClcclxuICAgICAgICAgICAgdXBkYXRlQ29sb3JzKClcclxuICAgICAgICAgICAgcmV0dXJuIGV2dC5zdG9wUHJvcGFnYXRpb24oKVxyXG4gICAgICAgIH0pXHJcbiAgICB9KVxyXG59KVxyXG5cclxuLy8gVGhlbiwgYSBmdW5jdGlvbiB0aGF0IHVwZGF0ZXMgdGhlIGNvbG9yIHByZWZlcmVuY2VzIGlzIGRlZmluZWQuXHJcbmZ1bmN0aW9uIHVwZGF0ZUNvbG9ycygpOiB2b2lkIHtcclxuICAgIGNvbnN0IHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKVxyXG4gICAgc3R5bGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpKVxyXG4gICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzdHlsZSlcclxuICAgIGNvbnN0IHNoZWV0ID0gXyQoc3R5bGUuc2hlZXQpIGFzIENTU1N0eWxlU2hlZXRcclxuXHJcbiAgICBjb25zdCBhZGRDb2xvclJ1bGUgPSAoc2VsZWN0b3I6IHN0cmluZywgbGlnaHQ6IHN0cmluZywgZGFyazogc3RyaW5nLCBleHRyYSA9ICcnKSA9PiB7XHJcbiAgICAgICAgY29uc3QgbWl4ZWQgPSB0aW55Y29sb3IubWl4KGxpZ2h0LCAnIzFCNUUyMCcsIDcwKS50b0hleFN0cmluZygpXHJcbiAgICAgICAgc2hlZXQuaW5zZXJ0UnVsZShgJHtleHRyYX0uYXNzaWdubWVudCR7c2VsZWN0b3J9IHsgYmFja2dyb3VuZC1jb2xvcjogJHtsaWdodH07IH1gLCAwKVxyXG4gICAgICAgIHNoZWV0Lmluc2VydFJ1bGUoYCR7ZXh0cmF9LmFzc2lnbm1lbnQke3NlbGVjdG9yfS5kb25lIHsgYmFja2dyb3VuZC1jb2xvcjogJHtkYXJrfTsgfWAsIDApXHJcbiAgICAgICAgc2hlZXQuaW5zZXJ0UnVsZShgJHtleHRyYX0uYXNzaWdubWVudCR7c2VsZWN0b3J9OjpiZWZvcmUgeyBiYWNrZ3JvdW5kLWNvbG9yOiAke21peGVkfTsgfWAsIDApXHJcbiAgICAgICAgc2hlZXQuaW5zZXJ0UnVsZShgJHtleHRyYX0uYXNzaWdubWVudEl0ZW0ke3NlbGVjdG9yfT5pIHsgYmFja2dyb3VuZC1jb2xvcjogJHtsaWdodH07IH1gLCAwKVxyXG4gICAgICAgIHNoZWV0Lmluc2VydFJ1bGUoYCR7ZXh0cmF9LmFzc2lnbm1lbnRJdGVtJHtzZWxlY3Rvcn0uZG9uZT5pIHsgYmFja2dyb3VuZC1jb2xvcjogJHtkYXJrfTsgfWAsIDApXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgY3JlYXRlUGFsZXR0ZSA9IChjb2xvcjogc3RyaW5nKSA9PiB0aW55Y29sb3IoY29sb3IpLmRhcmtlbigyNCkudG9IZXhTdHJpbmcoKVxyXG5cclxuICAgIGlmIChzZXR0aW5ncy5jb2xvclR5cGUgPT09ICdhc3NpZ25tZW50Jykge1xyXG4gICAgICAgIE9iamVjdC5lbnRyaWVzKGFzc2lnbm1lbnRDb2xvcnMpLmZvckVhY2goKFtuYW1lLCBjb2xvcl0pID0+IHtcclxuICAgICAgICAgICAgYWRkQ29sb3JSdWxlKGAuJHtuYW1lfWAsIGNvbG9yLCBwYWxldHRlW2NvbG9yXSB8fCBjcmVhdGVQYWxldHRlKGNvbG9yKSlcclxuICAgICAgICB9KVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBPYmplY3QuZW50cmllcyhjbGFzc0NvbG9ycykuZm9yRWFjaCgoW25hbWUsIGNvbG9yXSkgPT4ge1xyXG4gICAgICAgICAgICBhZGRDb2xvclJ1bGUoYFtkYXRhLWNsYXNzPVxcXCIke25hbWV9XFxcIl1gLCBjb2xvciwgcGFsZXR0ZVtjb2xvcl0gfHwgY3JlYXRlUGFsZXR0ZShjb2xvcikpXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBhZGRDb2xvclJ1bGUoJy50YXNrJywgJyNGNUY1RjUnLCAnI0UwRTBFMCcpXHJcbiAgICBhZGRDb2xvclJ1bGUoJy50YXNrJywgJyM0MjQyNDInLCAnIzIxMjEyMScsICcuZGFyayAnKVxyXG59XHJcblxyXG4vLyBUaGUgZnVuY3Rpb24gdGhlbiBuZWVkcyB0byBiZSBjYWxsZWQuXHJcbnVwZGF0ZUNvbG9ycygpXHJcblxyXG4vLyBUaGUgZWxlbWVudHMgdGhhdCBjb250cm9sIHRoZSBzZXR0aW5ncyBhbHNvIG5lZWQgZXZlbnQgbGlzdGVuZXJzXHJcbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zZXR0aW5nc0NvbnRyb2wnKS5mb3JFYWNoKChlKSA9PiB7XHJcbiAgICBpZiAoIShlIGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudCkpIHJldHVyblxyXG4gICAgaWYgKGxvY2FsU3RvcmFnZVtlLm5hbWVdICE9IG51bGwpIHtcclxuICAgICAgICBpZiAoZS50eXBlID09PSAnY2hlY2tib3gnKSB7XHJcbiAgICAgICAgZS5jaGVja2VkID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2VbZS5uYW1lXSlcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGUudmFsdWUgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZVtlLm5hbWVdKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGUuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGV2dCkgPT4ge1xyXG4gICAgICAgIGlmIChlLnR5cGUgPT09ICdjaGVja2JveCcpIHtcclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlV3JpdGUoZS5uYW1lLCBlLmNoZWNrZWQpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlV3JpdGUoZS5uYW1lLCBlLnZhbHVlKVxyXG4gICAgICAgIH1cclxuICAgICAgICBzd2l0Y2ggKGUubmFtZSkge1xyXG4gICAgICAgICAgICBjYXNlICdyZWZyZXNoUmF0ZSc6IHJldHVybiBpbnRlcnZhbFJlZnJlc2goKVxyXG4gICAgICAgICAgICBjYXNlICdlYXJseVRlc3QnOiByZXR1cm4gZGlzcGxheSgpXHJcbiAgICAgICAgICAgIGNhc2UgJ2Fzc2lnbm1lbnRTcGFuJzogcmV0dXJuIGRpc3BsYXkoKVxyXG4gICAgICAgICAgICBjYXNlICdwcm9qZWN0c0luVGVzdFBhbmUnOiByZXR1cm4gZGlzcGxheSgpXHJcbiAgICAgICAgICAgIGNhc2UgJ2hpZGVhc3NpZ25tZW50cyc6IHJldHVybiBkaXNwbGF5KClcclxuICAgICAgICAgICAgY2FzZSAnaG9saWRheVRoZW1lcyc6IHJldHVybiBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC50b2dnbGUoJ2hvbGlkYXlUaGVtZXMnLCBlLmNoZWNrZWQpXHJcbiAgICAgICAgICAgIGNhc2UgJ3NlcFRhc2tDbGFzcyc6IGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnRvZ2dsZSgnc2VwVGFza0NsYXNzJywgZS5jaGVja2VkKTsgcmV0dXJuIGRpc3BsYXkoKVxyXG4gICAgICAgICAgICBjYXNlICdzZXBUYXNrcyc6IHJldHVybiBlbGVtQnlJZCgnc2VwVGFza3NSZWZyZXNoJykuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59KVxyXG5cclxuLy8gVGhpcyBhbHNvIG5lZWRzIHRvIGJlIGRvbmUgZm9yIHJhZGlvIGJ1dHRvbnNcclxuY29uc3QgY29sb3JUeXBlID1cclxuICAgIF8kKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYGlucHV0W25hbWU9XFxcImNvbG9yVHlwZVxcXCJdW3ZhbHVlPVxcXCIke3NldHRpbmdzLmNvbG9yVHlwZX1cXFwiXWApKSBhcyBIVE1MSW5wdXRFbGVtZW50XHJcbmNvbG9yVHlwZS5jaGVja2VkID0gdHJ1ZVxyXG5BcnJheS5mcm9tKGRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKCdjb2xvclR5cGUnKSkuZm9yRWFjaCgoYykgPT4ge1xyXG4gIGMuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGV2dCkgPT4ge1xyXG4gICAgY29uc3QgdiA9IChfJChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdpbnB1dFtuYW1lPVwiY29sb3JUeXBlXCJdOmNoZWNrZWQnKSkgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWVcclxuICAgIGlmICh2ICE9PSAnYXNzaWdubWVudCcgJiYgdiAhPT0gJ2NsYXNzJykgcmV0dXJuXHJcbiAgICBzZXR0aW5ncy5jb2xvclR5cGUgPSB2XHJcbiAgICBpZiAodiA9PT0gJ2NsYXNzJykge1xyXG4gICAgICBlbGVtQnlJZCgnYXNzaWdubWVudENvbG9ycycpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcclxuICAgICAgZWxlbUJ5SWQoJ2NsYXNzQ29sb3JzJykuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGVsZW1CeUlkKCdhc3NpZ25tZW50Q29sb3JzJykuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcclxuICAgICAgZWxlbUJ5SWQoJ2NsYXNzQ29sb3JzJykuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHVwZGF0ZUNvbG9ycygpXHJcbiAgfSlcclxufSlcclxuXHJcbi8vIFRoZSBzYW1lIGdvZXMgZm9yIHRleHRhcmVhcy5cclxuZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgndGV4dGFyZWEnKS5mb3JFYWNoKChlKSA9PiB7XHJcbiAgaWYgKChlLm5hbWUgIT09ICdhdGhlbmFEYXRhUmF3JykgJiYgKGxvY2FsU3RvcmFnZVtlLm5hbWVdICE9IG51bGwpKSB7XHJcbiAgICBlLnZhbHVlID0gbG9jYWxTdG9yYWdlW2UubmFtZV1cclxuICB9XHJcbiAgZS5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIChldnQpID0+IHtcclxuICAgIGxvY2FsU3RvcmFnZVtlLm5hbWVdID0gZS52YWx1ZVxyXG4gICAgaWYgKGUubmFtZSA9PT0gJ2F0aGVuYURhdGFSYXcnKSB7XHJcbiAgICAgIHVwZGF0ZUF0aGVuYURhdGEoZS52YWx1ZSlcclxuICAgIH1cclxuICB9KVxyXG59KVxyXG5cclxuLy8gPGEgbmFtZT1cInN0YXJ0aW5nXCIvPlxyXG4vLyBTdGFydGluZyBldmVyeXRoaW5nXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS1cclxuLy9cclxuLy8gRmluYWxseSEgV2UgYXJlIChhbG1vc3QpIGRvbmUhXHJcbi8vXHJcbi8vIEJlZm9yZSBnZXR0aW5nIHRvIGFueXRoaW5nLCBsZXQncyBwcmludCBvdXQgYSB3ZWxjb21pbmcgbWVzc2FnZSB0byB0aGUgY29uc29sZSFcclxuY29uc29sZS5sb2coJyVjQ2hlY2sgUENSJywgJ2NvbG9yOiAjMDA0MDAwOyBmb250LXNpemU6IDNlbScpXHJcbmNvbnNvbGUubG9nKGAlY1ZlcnNpb24gJHtWRVJTSU9OfSAoQ2hlY2sgYmVsb3cgZm9yIGN1cnJlbnQgdmVyc2lvbilgLCAnZm9udC1zaXplOiAxLjFlbScpXHJcbmNvbnNvbGUubG9nKGBXZWxjb21lIHRvIHRoZSBkZXZlbG9wZXIgY29uc29sZSBmb3IgeW91ciBicm93c2VyISBCZXNpZGVzIGxvb2tpbmcgYXQgdGhlIHNvdXJjZSBjb2RlLCBcXFxyXG55b3UgY2FuIGFsc28gcGxheSBhcm91bmQgd2l0aCBDaGVjayBQQ1IgYnkgZXhlY3V0aW5nIHRoZSBsaW5lcyBiZWxvdzpcclxuJWNcXHRmZXRjaCh0cnVlKSAgICAgICAgICAgICAgICVjLy8gUmVsb2FkcyBhbGwgb2YgeW91ciBhc3NpZ25tZW50cyAodGhlIHRydWUgaXMgZm9yIGZvcmNpbmcgYSByZWxvYWQgaWYgb25lIFxcXHJcbmhhcyBhbHJlYWR5IGJlZW4gdHJpZ2dlcmVkIGluIHRoZSBsYXN0IG1pbnV0ZSlcclxuJWNcXHRkYXRhICAgICAgICAgICAgICAgICAgICAgICVjLy8gRGlzcGxheXMgdGhlIG9iamVjdCB0aGF0IGNvbnRhaW5zIHRoZSBkYXRhIHBhcnNlZCBmcm9tIFBDUidzIGludGVyZmFjZVxyXG4lY1xcdGFjdGl2aXR5ICAgICAgICAgICAgICAgICAgJWMvLyBUaGUgZGF0YSBmb3IgdGhlIGFzc2lnbm1lbnRzIHRoYXQgc2hvdyB1cCBpbiB0aGUgYWN0aXZpdHkgcGFuZVxyXG4lY1xcdGV4dHJhICAgICAgICAgICAgICAgICAgICAgJWMvLyBBbGwgb2YgdGhlIHRhc2tzIHlvdSd2ZSBjcmVhdGVkIGJ5IGNsaWNraW5nIHRoZSArIGJ1dHRvblxyXG4lY1xcdGF0aGVuYURhdGEgICAgICAgICAgICAgICAgJWMvLyBUaGUgZGF0YSBmZXRjaGVkIGZyb20gQXRoZW5hIChpZiB5b3UndmUgcGFzdGVkIHRoZSByYXcgZGF0YSBpbnRvIHNldHRpbmdzKVxyXG4lY1xcdHNuYWNrYmFyKFwiSGVsbG8gV29ybGQhXCIpICAlYy8vIENyZWF0ZXMgYSBzbmFja2JhciBzaG93aW5nIHRoZSBtZXNzYWdlIFwiSGVsbG8gV29ybGQhXCJcclxuJWNcXHRkaXNwbGF5RXJyb3IobmV3IEVycm9yKCkpICVjLy8gRGlzcGxheXMgdGhlIHN0YWNrIHRyYWNlIGZvciBhIHJhbmRvbSBlcnJvciAoSnVzdCBkb24ndCBzdWJtaXQgaXQhKVxyXG4lY1xcdGNsb3NlRXJyb3IoKSAgICAgICAgICAgICAgJWMvLyBDbG9zZXMgdGhhdCBkaWFsb2dgLFxyXG4gICAgICAgICAgICAgICAuLi4oKFtdIGFzIHN0cmluZ1tdKS5jb25jYXQoLi4uQXJyYXkuZnJvbShuZXcgQXJyYXkoOCksICgpID0+IFsnY29sb3I6IGluaXRpYWwnLCAnY29sb3I6IGdyZXknXSkpKSlcclxuY29uc29sZS5sb2coJycpXHJcblxyXG4vLyBUaGUgXCJsYXN0IHVwZGF0ZWRcIiB0ZXh0IGlzIHNldCB0byB0aGUgY29ycmVjdCBkYXRlLlxyXG5jb25zdCB0cmllZExhc3RVcGRhdGUgPSBsb2NhbFN0b3JhZ2VSZWFkKCdsYXN0VXBkYXRlJylcclxuZWxlbUJ5SWQoJ2xhc3RVcGRhdGUnKS5pbm5lckhUTUwgPSB0cmllZExhc3RVcGRhdGUgPyBmb3JtYXRVcGRhdGUodHJpZWRMYXN0VXBkYXRlKSA6ICdOZXZlcidcclxuXHJcbmlmIChsb2NhbFN0b3JhZ2VSZWFkKCdkYXRhJykgIT0gbnVsbCkge1xyXG4gICAgLy8gTm93IGNoZWNrIGlmIHRoZXJlJ3MgYWN0aXZpdHlcclxuICAgIHJlY2VudEFjdGl2aXR5KCkuZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG4gICAgICAgIGFkZEFjdGl2aXR5KGl0ZW1bMF0sIGl0ZW1bMV0sIG5ldyBEYXRlKGl0ZW1bMl0pLCB0cnVlLCBpdGVtWzNdKVxyXG4gICAgfSlcclxuXHJcbiAgICBkaXNwbGF5KClcclxufVxyXG5cclxuZmV0Y2goKVxyXG5cclxuLy8gPGEgbmFtZT1cImV2ZW50c1wiLz5cclxuLy8gRXZlbnRzXHJcbi8vIC0tLS0tLVxyXG4vL1xyXG4vLyBUaGUgZG9jdW1lbnQgYm9keSBuZWVkcyB0byBiZSBlbmFibGVkIGZvciBoYW1tZXIuanMgZXZlbnRzLlxyXG5kZWxldGUgSGFtbWVyLmRlZmF1bHRzLmNzc1Byb3BzLnVzZXJTZWxlY3RcclxuY29uc3QgaGFtbWVydGltZSA9IG5ldyBIYW1tZXIuTWFuYWdlcihkb2N1bWVudC5ib2R5LCB7XHJcbiAgcmVjb2duaXplcnM6IFtcclxuICAgIFtIYW1tZXIuUGFuLCB7ZGlyZWN0aW9uOiBIYW1tZXIuRElSRUNUSU9OX0hPUklaT05UQUx9XVxyXG4gIF1cclxufSlcclxuXHJcbi8vIEZvciB0b3VjaCBkaXNwbGF5cywgaGFtbWVyLmpzIGlzIHVzZWQgdG8gbWFrZSB0aGUgc2lkZSBtZW51IGFwcGVhci9kaXNhcHBlYXIuIFRoZSBjb2RlIGJlbG93IGlzXHJcbi8vIGFkYXB0ZWQgZnJvbSBNYXRlcmlhbGl6ZSdzIGltcGxlbWVudGF0aW9uLlxyXG5sZXQgbWVudU91dCA9IGZhbHNlXHJcbmNvbnN0IGRyYWdUYXJnZXQgPSBuZXcgSGFtbWVyKGVsZW1CeUlkKCdkcmFnVGFyZ2V0JykpXHJcbmRyYWdUYXJnZXQub24oJ3BhbicsIChlKSA9PiB7XHJcbiAgaWYgKGUucG9pbnRlclR5cGUgPT09ICd0b3VjaCcpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgbGV0IHsgeCB9ID0gZS5jZW50ZXJcclxuICAgIGNvbnN0IHsgeSB9ID0gZS5jZW50ZXJcclxuXHJcbiAgICBjb25zdCBzYmtnID0gZWxlbUJ5SWQoJ3NpZGVCYWNrZ3JvdW5kJylcclxuICAgIHNia2cuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcclxuICAgIHNia2cuc3R5bGUub3BhY2l0eSA9ICcwJ1xyXG4gICAgZWxlbUJ5SWQoJ3NpZGVOYXYnKS5jbGFzc0xpc3QuYWRkKCdtYW51YWwnKVxyXG5cclxuICAgIC8vIEtlZXAgd2l0aGluIGJvdW5kYXJpZXNcclxuICAgIGlmICh4ID4gMjQwKSB7XHJcbiAgICAgIHggPSAyNDBcclxuICAgIH0gZWxzZSBpZiAoeCA8IDApIHtcclxuICAgICAgeCA9IDBcclxuXHJcbiAgICAgIC8vIExlZnQgRGlyZWN0aW9uXHJcbiAgICAgIGlmICh4IDwgMTIwKSB7XHJcbiAgICAgICAgbWVudU91dCA9IGZhbHNlXHJcbiAgICAgIC8vIFJpZ2h0IERpcmVjdGlvblxyXG4gICAgICB9IGVsc2UgaWYgKHggPj0gMTIwKSB7XHJcbiAgICAgICAgbWVudU91dCA9IHRydWVcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGVsZW1CeUlkKCdzaWRlTmF2Jykuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVgoJHt4IC0gMjQwfXB4KWBcclxuICAgIGNvbnN0IG92ZXJsYXlQZXJjID0gTWF0aC5taW4oeCAvIDQ4MCwgMC41KVxyXG4gICAgcmV0dXJuIHNia2cuc3R5bGUub3BhY2l0eSA9IFN0cmluZyhvdmVybGF5UGVyYylcclxuICB9XHJcbn0pXHJcblxyXG5kcmFnVGFyZ2V0Lm9uKCdwYW5lbmQnLCAoZSkgPT4ge1xyXG4gIGlmIChlLnBvaW50ZXJUeXBlID09PSAndG91Y2gnKSB7XHJcbiAgICBsZXQgc2lkZU5hdlxyXG4gICAgY29uc3QgeyB2ZWxvY2l0eVggfSA9IGVcclxuICAgIC8vIElmIHZlbG9jaXR5WCA8PSAwLjMgdGhlbiB0aGUgdXNlciBpcyBmbGluZ2luZyB0aGUgbWVudSBjbG9zZWQgc28gaWdub3JlIG1lbnVPdXRcclxuICAgIGlmICgobWVudU91dCAmJiAodmVsb2NpdHlYIDw9IDAuMykpIHx8ICh2ZWxvY2l0eVggPCAtMC41KSkge1xyXG4gICAgICBzaWRlTmF2ID0gZWxlbUJ5SWQoJ3NpZGVOYXYnKVxyXG4gICAgICBzaWRlTmF2LmNsYXNzTGlzdC5yZW1vdmUoJ21hbnVhbCcpXHJcbiAgICAgIHNpZGVOYXYuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuICAgICAgc2lkZU5hdi5zdHlsZS50cmFuc2Zvcm0gPSAnJ1xyXG4gICAgICBlbGVtQnlJZCgnZHJhZ1RhcmdldCcpLnN0eWxlLndpZHRoID0gJzEwMCUnXHJcblxyXG4gICAgfSBlbHNlIGlmICghbWVudU91dCB8fCAodmVsb2NpdHlYID4gMC4zKSkge1xyXG4gICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2F1dG8nXHJcbiAgICAgIHNpZGVOYXYgPSBlbGVtQnlJZCgnc2lkZU5hdicpXHJcbiAgICAgIHNpZGVOYXYuY2xhc3NMaXN0LnJlbW92ZSgnbWFudWFsJylcclxuICAgICAgc2lkZU5hdi5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gICAgICBzaWRlTmF2LnN0eWxlLnRyYW5zZm9ybSA9ICcnXHJcbiAgICAgIGVsZW1CeUlkKCdzaWRlQmFja2dyb3VuZCcpLnN0eWxlLm9wYWNpdHkgPSAnJ1xyXG4gICAgICBlbGVtQnlJZCgnZHJhZ1RhcmdldCcpLnN0eWxlLndpZHRoID0gJzEwcHgnXHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gZWxlbUJ5SWQoJ3NpZGVCYWNrZ3JvdW5kJykuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xyXG4gICAgICAsIDM1MClcclxuICAgIH1cclxuICB9XHJcbn0pXHJcblxyXG5kcmFnVGFyZ2V0Lm9uKCd0YXAnLCAoZSkgPT4ge1xyXG4gICAgZWxlbUJ5SWQoJ3NpZGVCYWNrZ3JvdW5kJykuY2xpY2soKVxyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbn0pXHJcblxyXG5jb25zdCBkdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkcmFnVGFyZ2V0JylcclxuXHJcbi8vIFRoZSBhY3Rpdml0eSBmaWx0ZXIgYnV0dG9uIGFsc28gbmVlZHMgYW4gZXZlbnQgbGlzdGVuZXIuXHJcbnJpcHBsZShlbGVtQnlJZCgnZmlsdGVyQWN0aXZpdHknKSlcclxuZWxlbUJ5SWQoJ2ZpbHRlckFjdGl2aXR5JykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgZWxlbUJ5SWQoJ2luZm9BY3Rpdml0eScpLmNsYXNzTGlzdC50b2dnbGUoJ2ZpbHRlcicpXHJcbn0pXHJcblxyXG4vLyBBdCB0aGUgc3RhcnQsIGl0IG5lZWRzIHRvIGJlIGNvcnJlY3RseSBwb3B1bGF0ZWRcclxuY29uc3QgYWN0aXZpdHlUeXBlcyA9IHNldHRpbmdzLnNob3duQWN0aXZpdHlcclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZVNlbGVjdE51bSgpOiBzdHJpbmcge1xyXG4gICAgY29uc3QgYyA9IChib29sOiBib29sZWFuKSAgPT4gYm9vbCA/IDEgOiAwXHJcbiAgICBjb25zdCBjb3VudCA9IFN0cmluZyhjKGFjdGl2aXR5VHlwZXMuYWRkKSArIGMoYWN0aXZpdHlUeXBlcy5lZGl0KSArIGMoYWN0aXZpdHlUeXBlcy5kZWxldGUpKVxyXG4gICAgcmV0dXJuIGVsZW1CeUlkKCdzZWxlY3ROdW0nKS5pbm5lckhUTUwgPSBjb3VudFxyXG59XHJcbnVwZGF0ZVNlbGVjdE51bSgpXHJcbk9iamVjdC5lbnRyaWVzKGFjdGl2aXR5VHlwZXMpLmZvckVhY2goKFt0eXBlLCBlbmFibGVkXSkgPT4ge1xyXG4gIGlmICh0eXBlICE9PSAnYWRkJyAmJiB0eXBlICE9PSAnZWRpdCcgJiYgdHlwZSAhPT0gJ2RlbGV0ZScpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBhY3Rpdml0eSB0eXBlICR7dHlwZX1gKVxyXG4gIH1cclxuXHJcbiAgY29uc3Qgc2VsZWN0RWwgPSBlbGVtQnlJZCh0eXBlICsgJ1NlbGVjdCcpIGFzIEhUTUxJbnB1dEVsZW1lbnRcclxuICBzZWxlY3RFbC5jaGVja2VkID0gZW5hYmxlZFxyXG4gIGlmIChlbmFibGVkKSB7IGVsZW1CeUlkKCdpbmZvQWN0aXZpdHknKS5jbGFzc0xpc3QuYWRkKHR5cGUpIH1cclxuICBzZWxlY3RFbC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZXZ0KSA9PiB7XHJcbiAgICBhY3Rpdml0eVR5cGVzW3R5cGVdID0gc2VsZWN0RWwuY2hlY2tlZFxyXG4gICAgZWxlbUJ5SWQoJ2luZm9BY3Rpdml0eScpLnNldEF0dHJpYnV0ZSgnZGF0YS1maWx0ZXJlZCcsIHVwZGF0ZVNlbGVjdE51bSgpKVxyXG4gICAgZWxlbUJ5SWQoJ2luZm9BY3Rpdml0eScpLmNsYXNzTGlzdC50b2dnbGUodHlwZSlcclxuICAgIHNldHRpbmdzLnNob3duQWN0aXZpdHkgPSBhY3Rpdml0eVR5cGVzXHJcbiAgfSlcclxufSlcclxuXHJcbi8vIFRoZSBzaG93IGNvbXBsZXRlZCB0YXNrcyBjaGVja2JveCBpcyBzZXQgY29ycmVjdGx5IGFuZCBpcyBhc3NpZ25lZCBhbiBldmVudCBsaXN0ZW5lci5cclxuY29uc3Qgc2hvd0RvbmVUYXNrc0VsID0gZWxlbUJ5SWQoJ3Nob3dEb25lVGFza3MnKSBhcyBIVE1MSW5wdXRFbGVtZW50XHJcbmlmIChzZXR0aW5ncy5zaG93RG9uZVRhc2tzKSB7XHJcbiAgc2hvd0RvbmVUYXNrc0VsLmNoZWNrZWQgPSB0cnVlXHJcbiAgZWxlbUJ5SWQoJ2luZm9UYXNrc0lubmVyJykuY2xhc3NMaXN0LmFkZCgnc2hvd0RvbmVUYXNrcycpXHJcbn1cclxuc2hvd0RvbmVUYXNrc0VsLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsICgpID0+IHtcclxuICBzZXR0aW5ncy5zaG93RG9uZVRhc2tzID0gc2hvd0RvbmVUYXNrc0VsLmNoZWNrZWRcclxuICBlbGVtQnlJZCgnaW5mb1Rhc2tzSW5uZXInKS5jbGFzc0xpc3QudG9nZ2xlKCdzaG93RG9uZVRhc2tzJywgc2V0dGluZ3Muc2hvd0RvbmVUYXNrcylcclxufSlcclxuXHJcbi8vIDxhIG5hbWU9XCJ1cGRhdGVzXCIvPlxyXG4vLyBVcGRhdGVzIGFuZCBOZXdzXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS1cclxuLy9cclxuXHJcbmlmIChsb2NhdGlvbi5wcm90b2NvbCA9PT0gJ2Nocm9tZS1leHRlbnNpb246JykgeyBjaGVja0NvbW1pdCgpIH1cclxuXHJcbi8vIFRoaXMgdXBkYXRlIGRpYWxvZyBhbHNvIG5lZWRzIHRvIGJlIGNsb3NlZCB3aGVuIHRoZSBidXR0b25zIGFyZSBjbGlja2VkLlxyXG5lbGVtQnlJZCgndXBkYXRlRGVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICBlbGVtQnlJZCgndXBkYXRlJykuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcclxuICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgIGVsZW1CeUlkKCd1cGRhdGVCYWNrZ3JvdW5kJykuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xyXG4gIH0sIDM1MClcclxufSlcclxuXHJcbi8vIEZvciBuZXdzLCB0aGUgbGF0ZXN0IG5ld3MgaXMgZmV0Y2hlZCBmcm9tIGEgR2l0SHViIGdpc3QuXHJcbmZldGNoTmV3cygpXHJcblxyXG4vLyBUaGUgbmV3cyBkaWFsb2cgdGhlbiBuZWVkcyB0byBiZSBjbG9zZWQgd2hlbiBPSyBvciB0aGUgYmFja2dyb3VuZCBpcyBjbGlja2VkLlxyXG5mdW5jdGlvbiBjbG9zZU5ld3MoKTogdm9pZCB7XHJcbiAgZWxlbUJ5SWQoJ25ld3MnKS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgZWxlbUJ5SWQoJ25ld3NCYWNrZ3JvdW5kJykuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xyXG4gIH0sIDM1MClcclxufVxyXG5cclxuZWxlbUJ5SWQoJ25ld3NPaycpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xvc2VOZXdzKVxyXG5lbGVtQnlJZCgnbmV3c0JhY2tncm91bmQnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsb3NlTmV3cylcclxuXHJcbi8vIEl0IGFsc28gbmVlZHMgdG8gYmUgb3BlbmVkIHdoZW4gdGhlIG5ld3MgYnV0dG9uIGlzIGNsaWNrZWQuXHJcbmVsZW1CeUlkKCduZXdzQicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gIGVsZW1CeUlkKCdzaWRlQmFja2dyb3VuZCcpLmNsaWNrKClcclxuICBjb25zdCBkaXNwTmV3cyA9ICgpID0+IHtcclxuICAgIGVsZW1CeUlkKCduZXdzQmFja2dyb3VuZCcpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXHJcbiAgICByZXR1cm4gZWxlbUJ5SWQoJ25ld3MnKS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG4gIH1cclxuXHJcbiAgaWYgKGVsZW1CeUlkKCduZXdzQ29udGVudCcpLmNoaWxkTm9kZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICBnZXROZXdzKGRpc3BOZXdzKVxyXG4gIH0gZWxzZSB7XHJcbiAgICBkaXNwTmV3cygpXHJcbiAgfVxyXG59KVxyXG5cclxuLy8gVGhlIHNhbWUgZ29lcyBmb3IgdGhlIGVycm9yIGRpYWxvZy5cclxuZnVuY3Rpb24gY2xvc2VFcnJvcigpOiB2b2lkIHtcclxuICBlbGVtQnlJZCgnZXJyb3InKS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgZWxlbUJ5SWQoJ2Vycm9yQmFja2dyb3VuZCcpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcclxuICB9LCAzNTApXHJcbn1cclxuXHJcbmVsZW1CeUlkKCdlcnJvck5vJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbG9zZUVycm9yKVxyXG5lbGVtQnlJZCgnZXJyb3JCYWNrZ3JvdW5kJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbG9zZUVycm9yKVxyXG5cclxuLy8gPGEgbmFtZT1cIm5ld1wiLz5cclxuLy8gQWRkaW5nIG5ldyBhc3NpZ25tZW50c1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbi8vXHJcbi8vIFRoZSBldmVudCBsaXN0ZW5lcnMgZm9yIHRoZSBuZXcgYnV0dG9ucyBhcmUgYWRkZWQuXHJcbnJpcHBsZShlbGVtQnlJZCgnbmV3JykpXHJcbnJpcHBsZShlbGVtQnlJZCgnbmV3VGFzaycpKVxyXG5jb25zdCBvbk5ld1Rhc2sgPSAoKSA9PiB7XHJcbiAgdXBkYXRlTmV3VGlwcygoZWxlbUJ5SWQoJ25ld1RleHQnKSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSA9ICcnKVxyXG4gIGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJ1xyXG4gIGVsZW1CeUlkKCduZXdCYWNrZ3JvdW5kJykuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcclxuICBlbGVtQnlJZCgnbmV3RGlhbG9nJykuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuICBlbGVtQnlJZCgnbmV3VGV4dCcpLmZvY3VzKClcclxufVxyXG5lbGVtQnlJZCgnbmV3JykuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG9uTmV3VGFzaylcclxuZWxlbUJ5SWQoJ25ld1Rhc2snKS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgb25OZXdUYXNrKVxyXG5cclxuLy8gQSBmdW5jdGlvbiB0byBjbG9zZSB0aGUgZGlhbG9nIGlzIHRoZW4gZGVmaW5lZC5cclxuZnVuY3Rpb24gY2xvc2VOZXcoKTogdm9pZCB7XHJcbiAgZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICdhdXRvJ1xyXG4gIGVsZW1CeUlkKCduZXdEaWFsb2cnKS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgZWxlbUJ5SWQoJ25ld0JhY2tncm91bmQnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXHJcbiAgfSwgMzUwKVxyXG59XHJcblxyXG4vLyBUaGlzIGZ1bmN0aW9uIGlzIHNldCB0byBiZSBjYWxsZWQgY2FsbGVkIHdoZW4gdGhlIEVTQyBrZXkgaXMgY2FsbGVkIGluc2lkZSBvZiB0aGUgZGlhbG9nLlxyXG5lbGVtQnlJZCgnbmV3VGV4dCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZXZ0KSA9PiB7XHJcbiAgaWYgKGV2dC53aGljaCA9PT0gMjcpIHsgLy8gRXNjYXBlIGtleSBwcmVzc2VkXHJcbiAgICBjbG9zZU5ldygpXHJcbiAgfVxyXG59KVxyXG5cclxuLy8gQW4gZXZlbnQgbGlzdGVuZXIgdG8gY2FsbCB0aGUgZnVuY3Rpb24gaXMgYWxzbyBhZGRlZCB0byB0aGUgWCBidXR0b25cclxuZWxlbUJ5SWQoJ25ld0NhbmNlbCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xvc2VOZXcpXHJcblxyXG4vLyBXaGVuIHRoZSBlbnRlciBrZXkgaXMgcHJlc3NlZCBvciB0aGUgc3VibWl0IGJ1dHRvbiBpcyBjbGlja2VkLCB0aGUgbmV3IGFzc2lnbm1lbnQgaXMgYWRkZWQuXHJcbmVsZW1CeUlkKCduZXdEaWFsb2cnKS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCAoZXZ0KSA9PiB7XHJcbiAgZXZ0LnByZXZlbnREZWZhdWx0KClcclxuICBjb25zdCB0ZXh0ID0gKGVsZW1CeUlkKCduZXdUZXh0JykgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWVcclxuICBjb25zdCB7IGNscywgZHVlLCBzdCB9ID0gcGFyc2VDdXN0b21UYXNrKHRleHQpXHJcbiAgbGV0IGVuZDogJ0ZvcmV2ZXInfG51bWJlciA9ICdGb3JldmVyJ1xyXG5cclxuICBjb25zdCBzdGFydCA9IChzdCAhPSBudWxsKSA/IHRvRGF0ZU51bShjaHJvbm8ucGFyc2VEYXRlKHN0KSkgOiB0b2RheSgpXHJcbiAgaWYgKGR1ZSAhPSBudWxsKSB7XHJcbiAgICBlbmQgPSBzdGFydFxyXG4gICAgaWYgKGVuZCA8IHN0YXJ0KSB7IC8vIEFzc2lnbm1lbmQgZW5kcyBiZWZvcmUgaXQgaXMgYXNzaWduZWRcclxuICAgICAgZW5kICs9IE1hdGguY2VpbCgoc3RhcnQgLSBlbmQpIC8gNykgKiA3XHJcbiAgICB9XHJcbiAgfVxyXG4gIGFkZFRvRXh0cmEoe1xyXG4gICAgYm9keTogdGV4dC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHRleHQuc3Vic3RyKDEpLFxyXG4gICAgZG9uZTogZmFsc2UsXHJcbiAgICBzdGFydCxcclxuICAgIGNsYXNzOiAoY2xzICE9IG51bGwpID8gY2xzLnRvTG93ZXJDYXNlKCkudHJpbSgpIDogbnVsbCxcclxuICAgIGVuZFxyXG4gIH0pXHJcbiAgc2F2ZUV4dHJhKClcclxuICBjbG9zZU5ldygpXHJcbiAgZGlzcGxheShmYWxzZSlcclxufSlcclxuXHJcbnVwZGF0ZU5ld1RpcHMoJycsIGZhbHNlKVxyXG5lbGVtQnlJZCgnbmV3VGV4dCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKCkgPT4ge1xyXG4gIHJldHVybiB1cGRhdGVOZXdUaXBzKChlbGVtQnlJZCgnbmV3VGV4dCcpIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlKVxyXG59KVxyXG5cclxuLy8gVGhlIGNvZGUgYmVsb3cgcmVnaXN0ZXJzIGEgc2VydmljZSB3b3JrZXIgdGhhdCBjYWNoZXMgdGhlIHBhZ2Ugc28gaXQgY2FuIGJlIHZpZXdlZCBvZmZsaW5lLlxyXG5pZiAoJ3NlcnZpY2VXb3JrZXInIGluIG5hdmlnYXRvcikge1xyXG4gIG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLnJlZ2lzdGVyKCcvc2VydmljZS13b3JrZXIuanMnKVxyXG4gICAgLnRoZW4oKHJlZ2lzdHJhdGlvbikgPT5cclxuICAgICAgLy8gUmVnaXN0cmF0aW9uIHdhcyBzdWNjZXNzZnVsXHJcbiAgICAgIGNvbnNvbGUubG9nKCdTZXJ2aWNlV29ya2VyIHJlZ2lzdHJhdGlvbiBzdWNjZXNzZnVsIHdpdGggc2NvcGUnLCByZWdpc3RyYXRpb24uc2NvcGUpKS5jYXRjaCgoZXJyKSA9PlxyXG4gICAgICAvLyByZWdpc3RyYXRpb24gZmFpbGVkIDooXHJcbiAgICAgIGNvbnNvbGUubG9nKCdTZXJ2aWNlV29ya2VyIHJlZ2lzdHJhdGlvbiBmYWlsZWQ6ICcsIGVycilcclxuICApXHJcbn1cclxuXHJcbi8vIElmIHRoZSBzZXJ2aWNld29ya2VyIGRldGVjdHMgdGhhdCB0aGUgd2ViIGFwcCBoYXMgYmVlbiB1cGRhdGVkLCB0aGUgY29tbWl0IGlzIGZldGNoZWQgZnJvbSBHaXRIdWIuXHJcbm5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCAoZXZlbnQpID0+IHtcclxuICAgIGNvbnNvbGUubG9nKCdHZXR0aW5nIGNvbW1pdCBiZWNhdXNlIG9mIHNlcnZpY2V3b3JrZXInKVxyXG4gICAgaWYgKGV2ZW50LmRhdGEuZ2V0Q29tbWl0KSB7IHJldHVybiBjaGVja0NvbW1pdCgpIH1cclxufSlcclxuIiwiaW1wb3J0IHsgY2xhc3NCeUlkLCBnZXREYXRhLCBJQXNzaWdubWVudCB9IGZyb20gJy4uL3BjcidcclxuaW1wb3J0IHsgQWN0aXZpdHlUeXBlIH0gZnJvbSAnLi4vcGx1Z2lucy9hY3Rpdml0eSdcclxuaW1wb3J0IHsgYXNzaWdubWVudEluRG9uZSB9IGZyb20gJy4uL3BsdWdpbnMvZG9uZSdcclxuaW1wb3J0IHsgXyQsIGRhdGVTdHJpbmcsIGVsZW1CeUlkLCBlbGVtZW50LCBzbW9vdGhTY3JvbGwgfSBmcm9tICcuLi91dGlsJ1xyXG5pbXBvcnQgeyBzZXBhcmF0ZSB9IGZyb20gJy4vYXNzaWdubWVudCdcclxuXHJcbmNvbnN0IGluc2VydFRvID0gZWxlbUJ5SWQoJ2luZm9BY3Rpdml0eScpXHJcbmV4cG9ydCBmdW5jdGlvbiBhZGRBY3Rpdml0eUVsZW1lbnQoZWw6IEhUTUxFbGVtZW50KTogdm9pZCB7XHJcbiAgICBpbnNlcnRUby5pbnNlcnRCZWZvcmUoZWwsIGluc2VydFRvLnF1ZXJ5U2VsZWN0b3IoJy5hY3Rpdml0eScpKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQWN0aXZpdHkodHlwZTogQWN0aXZpdHlUeXBlLCBhc3NpZ25tZW50OiBJQXNzaWdubWVudCwgZGF0ZTogRGF0ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT86IHN0cmluZyApOiBIVE1MRWxlbWVudCB7XHJcbiAgICBjb25zdCBjbmFtZSA9IGNsYXNzTmFtZSB8fCBjbGFzc0J5SWQoYXNzaWdubWVudC5jbGFzcylcclxuXHJcbiAgICBjb25zdCB0ZSA9IGVsZW1lbnQoJ2RpdicsIFsnYWN0aXZpdHknLCAnYXNzaWdubWVudEl0ZW0nLCBhc3NpZ25tZW50LmJhc2VUeXBlLCB0eXBlXSwgYFxyXG4gICAgICAgIDxpIGNsYXNzPSdtYXRlcmlhbC1pY29ucyc+JHt0eXBlfTwvaT5cclxuICAgICAgICA8c3BhbiBjbGFzcz0ndGl0bGUnPiR7YXNzaWdubWVudC50aXRsZX08L3NwYW4+XHJcbiAgICAgICAgPHNtYWxsPiR7c2VwYXJhdGUoY25hbWUpWzJdfTwvc21hbGw+XHJcbiAgICAgICAgPGRpdiBjbGFzcz0ncmFuZ2UnPiR7ZGF0ZVN0cmluZyhkYXRlKX08L2Rpdj5gLCBgYWN0aXZpdHkke2Fzc2lnbm1lbnQuaWR9YClcclxuICAgIHRlLnNldEF0dHJpYnV0ZSgnZGF0YS1jbGFzcycsIGNuYW1lKVxyXG4gICAgY29uc3QgeyBpZCB9ID0gYXNzaWdubWVudFxyXG4gICAgaWYgKHR5cGUgIT09ICdkZWxldGUnKSB7XHJcbiAgICAgICAgdGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRvU2Nyb2xsaW5nID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZWwgPSBfJChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAuYXNzaWdubWVudFtpZCo9XFxcIiR7aWR9XFxcIl1gKSkgYXMgSFRNTEVsZW1lbnRcclxuICAgICAgICAgICAgICAgIGF3YWl0IHNtb290aFNjcm9sbCgoZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wICsgZG9jdW1lbnQuYm9keS5zY3JvbGxUb3ApIC0gMTE2KVxyXG4gICAgICAgICAgICAgICAgZWwuY2xpY2soKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5ib2R5LmdldEF0dHJpYnV0ZSgnZGF0YS12aWV3JykgPT09ICcwJykge1xyXG4gICAgICAgICAgICByZXR1cm4gZG9TY3JvbGxpbmcoKVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgKF8kKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNuYXZUYWJzPmxpOmZpcnN0LWNoaWxkJykpIGFzIEhUTUxFbGVtZW50KS5jbGljaygpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc2V0VGltZW91dChkb1Njcm9sbGluZywgNTAwKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBpZiAoYXNzaWdubWVudEluRG9uZShhc3NpZ25tZW50LmlkKSkge1xyXG4gICAgICB0ZS5jbGFzc0xpc3QuYWRkKCdkb25lJylcclxuICAgIH1cclxuICAgIHJldHVybiB0ZVxyXG59XHJcbiIsImltcG9ydCB7IGZyb21EYXRlTnVtLCB0b2RheSB9IGZyb20gJy4uL2RhdGVzJ1xyXG5pbXBvcnQgeyBkaXNwbGF5LCBnZXRUaW1lQWZ0ZXIsIElTcGxpdEFzc2lnbm1lbnQgfSBmcm9tICcuLi9kaXNwbGF5J1xyXG5pbXBvcnQgeyBnZXRMaXN0RGF0ZU9mZnNldCB9IGZyb20gJy4uL25hdmlnYXRpb24nXHJcbmltcG9ydCB7IGdldEF0dGFjaG1lbnRNaW1lVHlwZSwgSUFwcGxpY2F0aW9uRGF0YSwgSUFzc2lnbm1lbnQsIHVybEZvckF0dGFjaG1lbnQgfSBmcm9tICcuLi9wY3InXHJcbmltcG9ydCB7IHJlY2VudEFjdGl2aXR5IH0gZnJvbSAnLi4vcGx1Z2lucy9hY3Rpdml0eSdcclxuaW1wb3J0IHsgZ2V0QXRoZW5hRGF0YSB9IGZyb20gJy4uL3BsdWdpbnMvYXRoZW5hJ1xyXG5pbXBvcnQgeyByZW1vdmVGcm9tRXh0cmEsIHNhdmVFeHRyYSB9IGZyb20gJy4uL3BsdWdpbnMvY3VzdG9tQXNzaWdubWVudHMnXHJcbmltcG9ydCB7IGFkZFRvRG9uZSwgYXNzaWdubWVudEluRG9uZSwgcmVtb3ZlRnJvbURvbmUsIHNhdmVEb25lIH0gZnJvbSAnLi4vcGx1Z2lucy9kb25lJ1xyXG5pbXBvcnQgeyBtb2RpZmllZEJvZHksIHJlbW92ZUZyb21Nb2RpZmllZCwgc2F2ZU1vZGlmaWVkLCBzZXRNb2RpZmllZCB9IGZyb20gJy4uL3BsdWdpbnMvbW9kaWZpZWRBc3NpZ25tZW50cydcclxuaW1wb3J0IHsgc2V0dGluZ3MgfSBmcm9tICcuLi9zZXR0aW5ncydcclxuaW1wb3J0IHsgXyQsIGNzc051bWJlciwgZGF0ZVN0cmluZywgZWxlbUJ5SWQsIGVsZW1lbnQsIGZvcmNlTGF5b3V0LCByaXBwbGUgfSBmcm9tICcuLi91dGlsJ1xyXG5pbXBvcnQgeyByZXNpemUgfSBmcm9tICcuL3Jlc2l6ZXInXHJcblxyXG5jb25zdCBtaW1lVHlwZXM6IHsgW21pbWU6IHN0cmluZ106IFtzdHJpbmcsIHN0cmluZ10gfSA9IHtcclxuICAgICdhcHBsaWNhdGlvbi9tc3dvcmQnOiBbJ1dvcmQgRG9jJywgJ2RvY3VtZW50J10sXHJcbiAgICAnYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LndvcmRwcm9jZXNzaW5nbWwuZG9jdW1lbnQnOiBbJ1dvcmQgRG9jJywgJ2RvY3VtZW50J10sXHJcbiAgICAnYXBwbGljYXRpb24vdm5kLm1zLXBvd2VycG9pbnQnOiBbJ1BQVCBQcmVzZW50YXRpb24nLCAnc2xpZGVzJ10sXHJcbiAgICAnYXBwbGljYXRpb24vcGRmJzogWydQREYgRmlsZScsICdwZGYnXSxcclxuICAgICd0ZXh0L3BsYWluJzogWydUZXh0IERvYycsICdwbGFpbiddXHJcbn1cclxuXHJcbmNvbnN0IGRtcCA9IG5ldyBkaWZmX21hdGNoX3BhdGNoKCkgLy8gRm9yIGRpZmZpbmdcclxuXHJcbmZ1bmN0aW9uIHBvcHVsYXRlQWRkZWREZWxldGVkKGRpZmZzOiBhbnlbXSwgZWRpdHM6IEhUTUxFbGVtZW50KTogYm9vbGVhbiB7XHJcbiAgICBsZXQgYWRkZWQgPSAwXHJcbiAgICBsZXQgZGVsZXRlZCA9IDBcclxuICAgIGRpZmZzLmZvckVhY2goKGRpZmYpID0+IHtcclxuICAgICAgICBpZiAoZGlmZlswXSA9PT0gMSkgeyBhZGRlZCsrIH1cclxuICAgICAgICBpZiAoZGlmZlswXSA9PT0gLTEpIHsgZGVsZXRlZCsrIH1cclxuICAgIH0pXHJcbiAgICBfJChlZGl0cy5xdWVyeVNlbGVjdG9yKCcuYWRkaXRpb25zJykpLmlubmVySFRNTCA9IGFkZGVkICE9PSAwID8gYCske2FkZGVkfWAgOiAnJ1xyXG4gICAgXyQoZWRpdHMucXVlcnlTZWxlY3RvcignLmRlbGV0aW9ucycpKS5pbm5lckhUTUwgPSBkZWxldGVkICE9PSAwID8gYC0ke2RlbGV0ZWR9YCA6ICcnXHJcbiAgICBlZGl0cy5jbGFzc0xpc3QuYWRkKCdub3RFbXB0eScpXHJcbiAgICByZXR1cm4gYWRkZWQgPiAwIHx8IGRlbGV0ZWQgPiAwXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjb21wdXRlV2Vla0lkKHNwbGl0OiBJU3BsaXRBc3NpZ25tZW50KTogc3RyaW5nIHtcclxuICAgIGNvbnN0IHN0YXJ0U3VuID0gbmV3IERhdGUoc3BsaXQuc3RhcnQuZ2V0VGltZSgpKVxyXG4gICAgc3RhcnRTdW4uc2V0RGF0ZShzdGFydFN1bi5nZXREYXRlKCkgLSBzdGFydFN1bi5nZXREYXkoKSlcclxuICAgIHJldHVybiBgd2ske3N0YXJ0U3VuLmdldE1vbnRoKCl9LSR7c3RhcnRTdW4uZ2V0RGF0ZSgpfWBcclxufVxyXG5cclxuLy8gVGhpcyBmdW5jdGlvbiBzZXBhcmF0ZXMgdGhlIHBhcnRzIG9mIGEgY2xhc3MgbmFtZS5cclxuZXhwb3J0IGZ1bmN0aW9uIHNlcGFyYXRlKGNsOiBzdHJpbmcpOiBSZWdFeHBNYXRjaEFycmF5IHtcclxuICAgIGNvbnN0IG0gPSBjbC5tYXRjaCgvKCg/OlxcZCpcXHMrKT8oPzooPzpob25cXHcqfCg/OmFkdlxcdypcXHMqKT9jb3JlKVxccyspPykoLiopL2kpXHJcbiAgICBpZiAobSA9PSBudWxsKSB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBzZXBhcmF0ZSBjbGFzcyBzdHJpbmcgJHtjbH1gKVxyXG4gICAgcmV0dXJuIG1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFzc2lnbm1lbnRDbGFzcyhhc3NpZ25tZW50OiBJQXNzaWdubWVudCwgZGF0YTogSUFwcGxpY2F0aW9uRGF0YSk6IHN0cmluZyB7XHJcbiAgICBjb25zdCBjbHMgPSAoYXNzaWdubWVudC5jbGFzcyAhPSBudWxsKSA/IGRhdGEuY2xhc3Nlc1thc3NpZ25tZW50LmNsYXNzXSA6ICdUYXNrJ1xyXG4gICAgaWYgKGNscyA9PSBudWxsKSB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBmaW5kIGNsYXNzICR7YXNzaWdubWVudC5jbGFzc30gaW4gJHtkYXRhLmNsYXNzZXN9YClcclxuICAgIHJldHVybiBjbHNcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNlcGFyYXRlZENsYXNzKGFzc2lnbm1lbnQ6IElBc3NpZ25tZW50LCBkYXRhOiBJQXBwbGljYXRpb25EYXRhKTogUmVnRXhwTWF0Y2hBcnJheSB7XHJcbiAgICByZXR1cm4gc2VwYXJhdGUoYXNzaWdubWVudENsYXNzKGFzc2lnbm1lbnQsIGRhdGEpKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQXNzaWdubWVudChzcGxpdDogSVNwbGl0QXNzaWdubWVudCwgZGF0YTogSUFwcGxpY2F0aW9uRGF0YSk6IEhUTUxFbGVtZW50IHtcclxuICAgIGNvbnN0IHsgYXNzaWdubWVudCwgcmVmZXJlbmNlIH0gPSBzcGxpdFxyXG5cclxuICAgIC8vIFNlcGFyYXRlIHRoZSBjbGFzcyBkZXNjcmlwdGlvbiBmcm9tIHRoZSBhY3R1YWwgY2xhc3NcclxuICAgIGNvbnN0IHNlcGFyYXRlZCA9IHNlcGFyYXRlZENsYXNzKGFzc2lnbm1lbnQsIGRhdGEpXHJcblxyXG4gICAgY29uc3Qgd2Vla0lkID0gY29tcHV0ZVdlZWtJZChzcGxpdClcclxuXHJcbiAgICBsZXQgc21hbGxUYWcgPSAnc21hbGwnXHJcbiAgICBsZXQgbGluayA9IG51bGxcclxuICAgIGNvbnN0IGF0aGVuYURhdGEgPSBnZXRBdGhlbmFEYXRhKClcclxuICAgIGlmIChhdGhlbmFEYXRhICYmIGFzc2lnbm1lbnQuY2xhc3MgIT0gbnVsbCAmJiAoYXRoZW5hRGF0YVtkYXRhLmNsYXNzZXNbYXNzaWdubWVudC5jbGFzc11dICE9IG51bGwpKSB7XHJcbiAgICAgICAgbGluayA9IGF0aGVuYURhdGFbZGF0YS5jbGFzc2VzW2Fzc2lnbm1lbnQuY2xhc3NdXS5saW5rXHJcbiAgICAgICAgc21hbGxUYWcgPSAnYSdcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBlID0gZWxlbWVudCgnZGl2JywgWydhc3NpZ25tZW50JywgYXNzaWdubWVudC5iYXNlVHlwZSwgJ2FuaW0nXSxcclxuICAgICAgICAgICAgICAgICAgICAgIGA8JHtzbWFsbFRhZ30ke2xpbmsgPyBgIGhyZWY9JyR7bGlua30nIGNsYXNzPSdsaW5rZWQnIHRhcmdldD0nX2JsYW5rJ2AgOiAnJ30+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPSdleHRyYSc+JHtzZXBhcmF0ZWRbMV19PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAke3NlcGFyYXRlZFsyXX1cclxuICAgICAgICAgICAgICAgICAgICAgICA8LyR7c21hbGxUYWd9PjxzcGFuIGNsYXNzPSd0aXRsZSc+JHthc3NpZ25tZW50LnRpdGxlfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT0naGlkZGVuJyBjbGFzcz0nZHVlJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT0nJHthc3NpZ25tZW50LmVuZCA9PT0gJ0ZvcmV2ZXInID8gMCA6IGFzc2lnbm1lbnQuZW5kfScgLz5gLFxyXG4gICAgICAgICAgICAgICAgICAgICAgYXNzaWdubWVudC5pZCArIHdlZWtJZClcclxuXHJcbiAgICBpZiAoKCByZWZlcmVuY2UgJiYgcmVmZXJlbmNlLmRvbmUpIHx8IGFzc2lnbm1lbnRJbkRvbmUoYXNzaWdubWVudC5pZCkpIHtcclxuICAgICAgICBlLmNsYXNzTGlzdC5hZGQoJ2RvbmUnKVxyXG4gICAgfVxyXG4gICAgZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtY2xhc3MnLCBhc3NpZ25tZW50Q2xhc3MoYXNzaWdubWVudCwgZGF0YSkpXHJcbiAgICBjb25zdCBjbG9zZSA9IGVsZW1lbnQoJ2EnLCBbJ2Nsb3NlJywgJ21hdGVyaWFsLWljb25zJ10sICdjbG9zZScpXHJcbiAgICBjbG9zZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsb3NlT3BlbmVkKVxyXG4gICAgZS5hcHBlbmRDaGlsZChjbG9zZSlcclxuXHJcbiAgICAvLyBQcmV2ZW50IGNsaWNraW5nIHRoZSBjbGFzcyBuYW1lIHdoZW4gYW4gaXRlbSBpcyBkaXNwbGF5ZWQgb24gdGhlIGNhbGVuZGFyIGZyb20gZG9pbmcgYW55dGhpbmdcclxuICAgIGlmIChsaW5rICE9IG51bGwpIHtcclxuICAgICAgICBfJChlLnF1ZXJ5U2VsZWN0b3IoJ2EnKSkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZ0KSA9PiB7XHJcbiAgICAgICAgICAgIGlmICgoZG9jdW1lbnQuYm9keS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmlldycpID09PSAnMCcpICYmICFlLmNsYXNzTGlzdC5jb250YWlucygnZnVsbCcpKSB7XHJcbiAgICAgICAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjb21wbGV0ZSA9IGVsZW1lbnQoJ2EnLCBbJ2NvbXBsZXRlJywgJ21hdGVyaWFsLWljb25zJywgJ3dhdmVzJ10sICdkb25lJylcclxuICAgIHJpcHBsZShjb21wbGV0ZSlcclxuICAgIGNvbnN0IGlkID0gc3BsaXQuYXNzaWdubWVudC5pZFxyXG4gICAgY29tcGxldGUuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIChldnQpID0+IHtcclxuICAgICAgICBpZiAoZXZ0LndoaWNoID09PSAxKSB7IC8vIExlZnQgYnV0dG9uXHJcbiAgICAgICAgICAgIGxldCBhZGRlZCA9IHRydWVcclxuICAgICAgICAgICAgaWYgKHJlZmVyZW5jZSAhPSBudWxsKSB7IC8vIFRhc2sgaXRlbVxyXG4gICAgICAgICAgICAgICAgaWYgKGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdkb25lJykpIHtcclxuICAgICAgICAgICAgICAgICAgICByZWZlcmVuY2UuZG9uZSA9IGZhbHNlXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGFkZGVkID0gZmFsc2VcclxuICAgICAgICAgICAgICAgICAgICByZWZlcmVuY2UuZG9uZSA9IHRydWVcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHNhdmVFeHRyYSgpXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZS5jbGFzc0xpc3QuY29udGFpbnMoJ2RvbmUnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlbW92ZUZyb21Eb25lKGFzc2lnbm1lbnQuaWQpXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGFkZGVkID0gZmFsc2VcclxuICAgICAgICAgICAgICAgICAgICBhZGRUb0RvbmUoYXNzaWdubWVudC5pZClcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHNhdmVEb25lKClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuYm9keS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmlldycpID09PSAnMScpIHtcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFxyXG4gICAgICAgICAgICAgICAgICAgIGAuYXNzaWdubWVudFtpZF49XFxcIiR7aWR9XFxcIl0sICN0ZXN0JHtpZH0sICNhY3Rpdml0eSR7aWR9LCAjaWEke2lkfWBcclxuICAgICAgICAgICAgICAgICkuZm9yRWFjaCgoZWxlbSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZW0uY2xhc3NMaXN0LnRvZ2dsZSgnZG9uZScpXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgaWYgKGFkZGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5hc3NpZ25tZW50Lmxpc3REaXNwOm5vdCguZG9uZSknKS5sZW5ndGggIT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdub0xpc3QnKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5hc3NpZ25tZW50Lmxpc3REaXNwOm5vdCguZG9uZSknKS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdub0xpc3QnKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJlc2l6ZSgpXHJcbiAgICAgICAgICAgIH0sIDEwMClcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFxyXG4gICAgICAgICAgICAgICAgYC5hc3NpZ25tZW50W2lkXj1cXFwiJHtpZH1cXFwiXSwgI3Rlc3Qke2lkfSwgI2FjdGl2aXR5JHtpZH0sICNpYSR7aWR9YFxyXG4gICAgICAgICAgICApLmZvckVhY2goKGVsZW0pID0+IHtcclxuICAgICAgICAgICAgICAgIGVsZW0uY2xhc3NMaXN0LnRvZ2dsZSgnZG9uZScpXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIGlmIChhZGRlZCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5hc3NpZ25tZW50Lmxpc3REaXNwOm5vdCguZG9uZSknKS5sZW5ndGggIT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ25vTGlzdCcpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmFzc2lnbm1lbnQubGlzdERpc3A6bm90KC5kb25lKScpLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnbm9MaXN0JylcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICAgIGUuYXBwZW5kQ2hpbGQoY29tcGxldGUpXHJcblxyXG4gICAgLy8gSWYgdGhlIGFzc2lnbm1lbnQgaXMgYSBjdXN0b20gb25lLCBhZGQgYSBidXR0b24gdG8gZGVsZXRlIGl0XHJcbiAgICBpZiAoc3BsaXQuY3VzdG9tKSB7XHJcbiAgICAgICAgY29uc3QgZGVsZXRlQSA9IGVsZW1lbnQoJ2EnLCBbJ21hdGVyaWFsLWljb25zJywgJ2RlbGV0ZUFzc2lnbm1lbnQnLCAnd2F2ZXMnXSwgJ2RlbGV0ZScpXHJcbiAgICAgICAgcmlwcGxlKGRlbGV0ZUEpXHJcbiAgICAgICAgZGVsZXRlQS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgKGV2dCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXZ0LndoaWNoICE9PSAxIHx8ICFyZWZlcmVuY2UpIHJldHVyblxyXG4gICAgICAgICAgICByZW1vdmVGcm9tRXh0cmEocmVmZXJlbmNlKVxyXG4gICAgICAgICAgICBzYXZlRXh0cmEoKVxyXG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZ1bGwnKSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2F1dG8nXHJcbiAgICAgICAgICAgICAgICBjb25zdCBiYWNrID0gZWxlbUJ5SWQoJ2JhY2tncm91bmQnKVxyXG4gICAgICAgICAgICAgICAgYmFjay5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmFjay5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXHJcbiAgICAgICAgICAgICAgICB9LCAzNTApXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZS5yZW1vdmUoKVxyXG4gICAgICAgICAgICBkaXNwbGF5KGZhbHNlKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgZS5hcHBlbmRDaGlsZChkZWxldGVBKVxyXG4gICAgfVxyXG5cclxuICAgIC8vIE1vZGlmaWNhdGlvbiBidXR0b25cclxuICAgIGNvbnN0IGVkaXQgPSBlbGVtZW50KCdhJywgWydlZGl0QXNzaWdubWVudCcsICdtYXRlcmlhbC1pY29ucycsICd3YXZlcyddLCAnZWRpdCcpXHJcbiAgICBlZGl0LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCAoZXZ0KSA9PiB7XHJcbiAgICAgICAgaWYgKGV2dC53aGljaCA9PT0gMSkge1xyXG4gICAgICAgICAgICBjb25zdCByZW1vdmUgPSBlZGl0LmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJylcclxuICAgICAgICAgICAgZWRpdC5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnKVxyXG4gICAgICAgICAgICBfJChlLnF1ZXJ5U2VsZWN0b3IoJy5ib2R5JykpLnNldEF0dHJpYnV0ZSgnY29udGVudEVkaXRhYmxlJywgcmVtb3ZlID8gJ2ZhbHNlJyA6ICd0cnVlJylcclxuICAgICAgICAgICAgaWYgKCFyZW1vdmUpIHtcclxuICAgICAgICAgICAgICAgIChlLnF1ZXJ5U2VsZWN0b3IoJy5ib2R5JykgYXMgSFRNTEVsZW1lbnQpLmZvY3VzKClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBkbiA9IGUucXVlcnlTZWxlY3RvcignLmNvbXBsZXRlJykgYXMgSFRNTEVsZW1lbnRcclxuICAgICAgICAgICAgZG4uc3R5bGUuZGlzcGxheSA9IHJlbW92ZSA/ICdibG9jaycgOiAnbm9uZSdcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICAgcmlwcGxlKGVkaXQpXHJcblxyXG4gICAgZS5hcHBlbmRDaGlsZChlZGl0KVxyXG5cclxuICAgIGNvbnN0IHN0YXJ0ID0gbmV3IERhdGUoZnJvbURhdGVOdW0oYXNzaWdubWVudC5zdGFydCkpXHJcbiAgICBjb25zdCBlbmQgPSBhc3NpZ25tZW50LmVuZCA9PT0gJ0ZvcmV2ZXInID8gYXNzaWdubWVudC5lbmQgOiBuZXcgRGF0ZShmcm9tRGF0ZU51bShhc3NpZ25tZW50LmVuZCkpXHJcbiAgICBjb25zdCB0aW1lcyA9IGVsZW1lbnQoJ2RpdicsICdyYW5nZScsXHJcbiAgICAgICAgYXNzaWdubWVudC5zdGFydCA9PT0gYXNzaWdubWVudC5lbmQgPyBkYXRlU3RyaW5nKHN0YXJ0KSA6IGAke2RhdGVTdHJpbmcoc3RhcnQpfSAmbmRhc2g7ICR7ZGF0ZVN0cmluZyhlbmQpfWApXHJcbiAgICBlLmFwcGVuZENoaWxkKHRpbWVzKVxyXG4gICAgaWYgKGFzc2lnbm1lbnQuYXR0YWNobWVudHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGNvbnN0IGF0dGFjaG1lbnRzID0gZWxlbWVudCgnZGl2JywgJ2F0dGFjaG1lbnRzJylcclxuICAgICAgICBhc3NpZ25tZW50LmF0dGFjaG1lbnRzLmZvckVhY2goKGF0dGFjaG1lbnQpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgYSA9IGVsZW1lbnQoJ2EnLCBbXSwgYXR0YWNobWVudFswXSkgYXMgSFRNTEFuY2hvckVsZW1lbnRcclxuICAgICAgICAgICAgYS5ocmVmID0gdXJsRm9yQXR0YWNobWVudChhdHRhY2htZW50WzFdKVxyXG4gICAgICAgICAgICBnZXRBdHRhY2htZW50TWltZVR5cGUoYXR0YWNobWVudFsxXSkudGhlbigodHlwZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IHNwYW5cclxuICAgICAgICAgICAgICAgIGlmIChtaW1lVHlwZXNbdHlwZV0gIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGEuY2xhc3NMaXN0LmFkZChtaW1lVHlwZXNbdHlwZV1bMV0pXHJcbiAgICAgICAgICAgICAgICAgICAgc3BhbiA9IGVsZW1lbnQoJ3NwYW4nLCBbXSwgbWltZVR5cGVzW3R5cGVdWzBdKVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBzcGFuID0gZWxlbWVudCgnc3BhbicsIFtdLCAnVW5rbm93biBmaWxlIHR5cGUnKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYS5hcHBlbmRDaGlsZChzcGFuKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICBhdHRhY2htZW50cy5hcHBlbmRDaGlsZChhKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgZS5hcHBlbmRDaGlsZChhdHRhY2htZW50cylcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBib2R5ID0gZWxlbWVudCgnZGl2JywgJ2JvZHknLFxyXG4gICAgICAgIGFzc2lnbm1lbnQuYm9keS5yZXBsYWNlKC9mb250LWZhbWlseTpbXjtdKj8oPzpUaW1lcyBOZXcgUm9tYW58c2VyaWYpW147XSovZywgJycpKVxyXG4gICAgY29uc3QgZWRpdHMgPSBlbGVtZW50KCdkaXYnLCAnZWRpdHMnLCAnPHNwYW4gY2xhc3M9XFwnYWRkaXRpb25zXFwnPjwvc3Bhbj48c3BhbiBjbGFzcz1cXCdkZWxldGlvbnNcXCc+PC9zcGFuPicpXHJcbiAgICBjb25zdCBtID0gbW9kaWZpZWRCb2R5KGFzc2lnbm1lbnQuaWQpXHJcbiAgICBpZiAobSAhPSBudWxsKSB7XHJcbiAgICAgICAgY29uc3QgZCA9IGRtcC5kaWZmX21haW4oYXNzaWdubWVudC5ib2R5LCBtKVxyXG4gICAgICAgIGRtcC5kaWZmX2NsZWFudXBTZW1hbnRpYyhkKVxyXG4gICAgICAgIGlmIChkLmxlbmd0aCAhPT0gMCkgeyAvLyBIYXMgYmVlbiBlZGl0ZWRcclxuICAgICAgICAgICAgcG9wdWxhdGVBZGRlZERlbGV0ZWQoZCwgZWRpdHMpXHJcbiAgICAgICAgICAgIGJvZHkuaW5uZXJIVE1MID0gbVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKGV2dCkgPT4ge1xyXG4gICAgICAgIGlmIChyZWZlcmVuY2UgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZWZlcmVuY2UuYm9keSA9IGJvZHkuaW5uZXJIVE1MXHJcbiAgICAgICAgICAgIHNhdmVFeHRyYSgpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgc2V0TW9kaWZpZWQoYXNzaWdubWVudC5pZCwgIGJvZHkuaW5uZXJIVE1MKVxyXG4gICAgICAgICAgICBzYXZlTW9kaWZpZWQoKVxyXG4gICAgICAgICAgICBjb25zdCBkID0gZG1wLmRpZmZfbWFpbihhc3NpZ25tZW50LmJvZHksIGJvZHkuaW5uZXJIVE1MKVxyXG4gICAgICAgICAgICBkbXAuZGlmZl9jbGVhbnVwU2VtYW50aWMoZClcclxuICAgICAgICAgICAgaWYgKHBvcHVsYXRlQWRkZWREZWxldGVkKGQsIGVkaXRzKSkge1xyXG4gICAgICAgICAgICAgICAgZWRpdHMuY2xhc3NMaXN0LmFkZCgnbm90RW1wdHknKVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZWRpdHMuY2xhc3NMaXN0LnJlbW92ZSgnbm90RW1wdHknKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChkb2N1bWVudC5ib2R5LmdldEF0dHJpYnV0ZSgnZGF0YS12aWV3JykgPT09ICcxJykgcmVzaXplKClcclxuICAgIH0pXHJcblxyXG4gICAgZS5hcHBlbmRDaGlsZChib2R5KVxyXG5cclxuICAgIGNvbnN0IHJlc3RvcmUgPSBlbGVtZW50KCdhJywgWydtYXRlcmlhbC1pY29ucycsICdyZXN0b3JlJ10sICdzZXR0aW5nc19iYWNrdXBfcmVzdG9yZScpXHJcbiAgICByZXN0b3JlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgIHJlbW92ZUZyb21Nb2RpZmllZChhc3NpZ25tZW50LmlkKVxyXG4gICAgICAgIHNhdmVNb2RpZmllZCgpXHJcbiAgICAgICAgYm9keS5pbm5lckhUTUwgPSBhc3NpZ25tZW50LmJvZHlcclxuICAgICAgICBlZGl0cy5jbGFzc0xpc3QucmVtb3ZlKCdub3RFbXB0eScpXHJcbiAgICAgICAgaWYgKGRvY3VtZW50LmJvZHkuZ2V0QXR0cmlidXRlKCdkYXRhLXZpZXcnKSA9PT0gJzEnKSAgcmVzaXplKClcclxuICAgIH0pXHJcbiAgICBlZGl0cy5hcHBlbmRDaGlsZChyZXN0b3JlKVxyXG4gICAgZS5hcHBlbmRDaGlsZChlZGl0cylcclxuXHJcbiAgICBjb25zdCBtb2RzID0gZWxlbWVudCgnZGl2JywgWydtb2RzJ10pXHJcbiAgICByZWNlbnRBY3Rpdml0eSgpLmZvckVhY2goKGEpID0+IHtcclxuICAgICAgICBpZiAoKGFbMF0gPT09ICdlZGl0JykgJiYgKGFbMV0uaWQgPT09IGFzc2lnbm1lbnQuaWQpKSB7XHJcbiAgICAgICAgY29uc3QgdGUgPSBlbGVtZW50KCdkaXYnLCBbJ2lubmVyQWN0aXZpdHknLCAnYXNzaWdubWVudEl0ZW0nLCBhc3NpZ25tZW50LmJhc2VUeXBlXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgYDxpIGNsYXNzPSdtYXRlcmlhbC1pY29ucyc+ZWRpdDwvaT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPSd0aXRsZSc+JHtkYXRlU3RyaW5nKG5ldyBEYXRlKGFbMl0pKX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz0nYWRkaXRpb25zJz48L3NwYW4+PHNwYW4gY2xhc3M9J2RlbGV0aW9ucyc+PC9zcGFuPmAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGBpYSR7YXNzaWdubWVudC5pZH1gKVxyXG4gICAgICAgIGNvbnN0IGQgPSBkbXAuZGlmZl9tYWluKGFbMV0uYm9keSwgYXNzaWdubWVudC5ib2R5KVxyXG4gICAgICAgIGRtcC5kaWZmX2NsZWFudXBTZW1hbnRpYyhkKVxyXG4gICAgICAgIHBvcHVsYXRlQWRkZWREZWxldGVkKGQsIHRlKVxyXG5cclxuICAgICAgICBpZiAoYXNzaWdubWVudC5jbGFzcykgdGUuc2V0QXR0cmlidXRlKCdkYXRhLWNsYXNzJywgZGF0YS5jbGFzc2VzW2Fzc2lnbm1lbnQuY2xhc3NdKVxyXG4gICAgICAgIHRlLmFwcGVuZENoaWxkKGVsZW1lbnQoJ2RpdicsICdpYURpZmYnLCBkbXAuZGlmZl9wcmV0dHlIdG1sKGQpKSlcclxuICAgICAgICB0ZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgdGUuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJylcclxuICAgICAgICAgICAgaWYgKGRvY3VtZW50LmJvZHkuZ2V0QXR0cmlidXRlKCdkYXRhLXZpZXcnKSA9PT0gJzEnKSByZXNpemUoKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgbW9kcy5hcHBlbmRDaGlsZCh0ZSlcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICAgZS5hcHBlbmRDaGlsZChtb2RzKVxyXG5cclxuICAgIGlmIChzZXR0aW5ncy5hc3NpZ25tZW50U3BhbiA9PT0gJ211bHRpcGxlJyAmJiAoc3RhcnQgPCBzcGxpdC5zdGFydCkpIHtcclxuICAgICAgICBlLmNsYXNzTGlzdC5hZGQoJ2Zyb21XZWVrZW5kJylcclxuICAgIH1cclxuICAgIGlmIChzZXR0aW5ncy5hc3NpZ25tZW50U3BhbiA9PT0gJ211bHRpcGxlJyAmJiAoZW5kID4gc3BsaXQuZW5kKSkge1xyXG4gICAgICAgIGUuY2xhc3NMaXN0LmFkZCgnb3ZlcldlZWtlbmQnKVxyXG4gICAgfVxyXG4gICAgZS5jbGFzc0xpc3QuYWRkKGBzJHtzcGxpdC5zdGFydC5nZXREYXkoKX1gKVxyXG4gICAgaWYgKHNwbGl0LmVuZCAhPT0gJ0ZvcmV2ZXInKSBlLmNsYXNzTGlzdC5hZGQoYGUkezYgLSBzcGxpdC5lbmQuZ2V0RGF5KCl9YClcclxuXHJcbiAgICBjb25zdCBzdCA9IE1hdGguZmxvb3Ioc3BsaXQuc3RhcnQuZ2V0VGltZSgpIC8gMTAwMCAvIDM2MDAgLyAyNClcclxuICAgIGlmIChzcGxpdC5hc3NpZ25tZW50LmVuZCA9PT0gJ0ZvcmV2ZXInKSB7XHJcbiAgICAgICAgaWYgKHN0IDw9ICh0b2RheSgpICsgZ2V0TGlzdERhdGVPZmZzZXQoKSkpIHtcclxuICAgICAgICAgICAgZS5jbGFzc0xpc3QuYWRkKCdsaXN0RGlzcCcpXHJcbiAgICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zdCBtaWREYXRlID0gbmV3IERhdGUoKVxyXG4gICAgICAgIG1pZERhdGUuc2V0RGF0ZShtaWREYXRlLmdldERhdGUoKSArIGdldExpc3REYXRlT2Zmc2V0KCkpXHJcbiAgICAgICAgY29uc3QgcHVzaCA9IChhc3NpZ25tZW50LmJhc2VUeXBlID09PSAndGVzdCcgJiYgYXNzaWdubWVudC5zdGFydCA9PT0gc3QpID8gc2V0dGluZ3MuZWFybHlUZXN0IDogMFxyXG4gICAgICAgIGNvbnN0IGVuZEV4dHJhID0gZ2V0TGlzdERhdGVPZmZzZXQoKSA9PT0gMCA/IGdldFRpbWVBZnRlcihtaWREYXRlKSA6IDI0ICogMzYwMCAqIDEwMDBcclxuICAgICAgICBpZiAoZnJvbURhdGVOdW0oc3QgLSBwdXNoKSA8PSBtaWREYXRlICYmXHJcbiAgICAgICAgICAgIChzcGxpdC5lbmQgPT09ICdGb3JldmVyJyB8fCBtaWREYXRlLmdldFRpbWUoKSA8PSBzcGxpdC5lbmQuZ2V0VGltZSgpICsgZW5kRXh0cmEpKSB7XHJcbiAgICAgICAgICAgIGUuY2xhc3NMaXN0LmFkZCgnbGlzdERpc3AnKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBBZGQgY2xpY2sgaW50ZXJhY3Rpdml0eVxyXG4gICAgaWYgKCFzcGxpdC5jdXN0b20gfHwgIXNldHRpbmdzLnNlcFRhc2tzKSB7XHJcbiAgICAgICAgZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldnQpID0+IHtcclxuICAgICAgICAgICAgaWYgKChkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdmdWxsJykubGVuZ3RoID09PSAwKSAmJlxyXG4gICAgICAgICAgICAgICAgKGRvY3VtZW50LmJvZHkuZ2V0QXR0cmlidXRlKCdkYXRhLXZpZXcnKSA9PT0gJzAnKSkge1xyXG4gICAgICAgICAgICAgICAgZS5jbGFzc0xpc3QucmVtb3ZlKCdhbmltJylcclxuICAgICAgICAgICAgICAgIGUuY2xhc3NMaXN0LmFkZCgnbW9kaWZ5JylcclxuICAgICAgICAgICAgICAgIGUuc3R5bGUudG9wID0gKGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wIC0gZG9jdW1lbnQuYm9keS5zY3JvbGxUb3BcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gY3NzTnVtYmVyKGUuc3R5bGUubWFyZ2luVG9wKSkgKyA0NCArICdweCdcclxuICAgICAgICAgICAgICAgIGUuc2V0QXR0cmlidXRlKCdkYXRhLXRvcCcsIGUuc3R5bGUudG9wKVxyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nXHJcbiAgICAgICAgICAgICAgICBjb25zdCBiYWNrID0gZWxlbUJ5SWQoJ2JhY2tncm91bmQnKVxyXG4gICAgICAgICAgICAgICAgYmFjay5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG4gICAgICAgICAgICAgICAgYmFjay5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xyXG4gICAgICAgICAgICAgICAgZS5jbGFzc0xpc3QuYWRkKCdhbmltJylcclxuICAgICAgICAgICAgICAgIGZvcmNlTGF5b3V0KGUpXHJcbiAgICAgICAgICAgICAgICBlLmNsYXNzTGlzdC5hZGQoJ2Z1bGwnKVxyXG4gICAgICAgICAgICAgICAgZS5zdHlsZS50b3AgPSAoNzUgLSBjc3NOdW1iZXIoZS5zdHlsZS5tYXJnaW5Ub3ApKSArICdweCdcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gZS5jbGFzc0xpc3QucmVtb3ZlKCdhbmltJyksIDM1MClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGVcclxufVxyXG5cclxuLy8gSW4gb3JkZXIgdG8gZGlzcGxheSBhbiBhc3NpZ25tZW50IGluIHRoZSBjb3JyZWN0IFggcG9zaXRpb24sIGNsYXNzZXMgd2l0aCBuYW1lcyBlWCBhbmQgZVggYXJlXHJcbi8vIHVzZWQsIHdoZXJlIFggaXMgdGhlIG51bWJlciBvZiBzcXVhcmVzIHRvIGZyb20gdGhlIGFzc2lnbm1lbnQgdG8gdGhlIGxlZnQvcmlnaHQgc2lkZSBvZiB0aGVcclxuLy8gc2NyZWVuLiBUaGUgZnVuY3Rpb24gYmVsb3cgZGV0ZXJtaW5lcyB3aGljaCBlWCBhbmQgc1ggY2xhc3MgdGhlIGdpdmVuIGVsZW1lbnQgaGFzLlxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0RVMoZWw6IEhUTUxFbGVtZW50KTogW3N0cmluZywgc3RyaW5nXSB7XHJcbiAgICBsZXQgZSA9IDBcclxuICAgIGxldCBzID0gMFxyXG5cclxuICAgIEFycmF5LmZyb20obmV3IEFycmF5KDcpLCAoXywgeCkgPT4geCkuZm9yRWFjaCgoeCkgPT4ge1xyXG4gICAgICAgIGlmIChlbC5jbGFzc0xpc3QuY29udGFpbnMoYGUke3h9YCkpIHtcclxuICAgICAgICAgICAgZSA9IHhcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGVsLmNsYXNzTGlzdC5jb250YWlucyhgcyR7eH1gKSkge1xyXG4gICAgICAgICAgICBzID0geFxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbiAgICByZXR1cm4gW2BlJHtlfWAsIGBzJHtzfWBdXHJcbn1cclxuXHJcbi8vIEJlbG93IGlzIGEgZnVuY3Rpb24gdG8gY2xvc2UgdGhlIGN1cnJlbnQgYXNzaWdubWVudCB0aGF0IGlzIG9wZW5lZC5cclxuZXhwb3J0IGZ1bmN0aW9uIGNsb3NlT3BlbmVkKGV2dDogRXZlbnQpOiB2b2lkIHtcclxuICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKVxyXG4gICAgY29uc3QgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZnVsbCcpIGFzIEhUTUxFbGVtZW50fG51bGxcclxuICAgIGlmIChlbCA9PSBudWxsKSByZXR1cm5cclxuXHJcbiAgICBlbC5zdHlsZS50b3AgPSBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdG9wJylcclxuICAgIGVsLmNsYXNzTGlzdC5hZGQoJ2FuaW0nKVxyXG4gICAgZWwuY2xhc3NMaXN0LnJlbW92ZSgnZnVsbCcpXHJcbiAgICBlbC5zY3JvbGxUb3AgPSAwXHJcbiAgICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2F1dG8nXHJcbiAgICBjb25zdCBiYWNrID0gZWxlbUJ5SWQoJ2JhY2tncm91bmQnKVxyXG4gICAgYmFjay5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgYmFjay5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXHJcbiAgICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZSgnYW5pbScpXHJcbiAgICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZSgnbW9kaWZ5JylcclxuICAgICAgICBlbC5zdHlsZS50b3AgPSAnYXV0bydcclxuICAgICAgICBmb3JjZUxheW91dChlbClcclxuICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKCdhbmltJylcclxuICAgIH0sIDEwMDApXHJcbn1cclxuIiwiaW1wb3J0IHsgZWxlbUJ5SWQsIGxvY2FsU3RvcmFnZVJlYWQgfSBmcm9tICcuLi91dGlsJ1xyXG5cclxuLy8gVGhlbiwgdGhlIHVzZXJuYW1lIGluIHRoZSBzaWRlYmFyIG5lZWRzIHRvIGJlIHNldCBhbmQgd2UgbmVlZCB0byBnZW5lcmF0ZSBhbiBcImF2YXRhclwiIGJhc2VkIG9uXHJcbi8vIGluaXRpYWxzLiBUbyBkbyB0aGF0LCBzb21lIGNvZGUgdG8gY29udmVydCBmcm9tIExBQiB0byBSR0IgY29sb3JzIGlzIGJvcnJvd2VkIGZyb21cclxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2Jvcm9uaW5lL2NvbG9yc3BhY2VzLmpzXHJcbi8vXHJcbi8vIExBQiBpcyBhIGNvbG9yIG5hbWluZyBzY2hlbWUgdGhhdCB1c2VzIHR3byB2YWx1ZXMgKEEgYW5kIEIpIGFsb25nIHdpdGggYSBsaWdodG5lc3MgdmFsdWUgaW4gb3JkZXJcclxuLy8gdG8gcHJvZHVjZSBjb2xvcnMgdGhhdCBhcmUgZXF1YWxseSBzcGFjZWQgYmV0d2VlbiBhbGwgb2YgdGhlIGNvbG9ycyB0aGF0IGNhbiBiZSBzZWVuIGJ5IHRoZSBodW1hblxyXG4vLyBleWUuIFRoaXMgd29ya3MgZ3JlYXQgYmVjYXVzZSBldmVyeW9uZSBoYXMgbGV0dGVycyBpbiBoaXMvaGVyIGluaXRpYWxzLlxyXG5cclxuLy8gVGhlIEQ2NSBzdGFuZGFyZCBpbGx1bWluYW50XHJcbmNvbnN0IFJFRl9YID0gMC45NTA0N1xyXG5jb25zdCBSRUZfWSA9IDEuMDAwMDBcclxuY29uc3QgUkVGX1ogPSAxLjA4ODgzXHJcblxyXG4vLyBDSUUgTCphKmIqIGNvbnN0YW50c1xyXG5jb25zdCBMQUJfRSA9IDAuMDA4ODU2XHJcbmNvbnN0IExBQl9LID0gOTAzLjNcclxuXHJcbmNvbnN0IE0gPSBbXHJcbiAgICBbMy4yNDA2LCAtMS41MzcyLCAtMC40OTg2XSxcclxuICAgIFstMC45Njg5LCAxLjg3NTgsICAwLjA0MTVdLFxyXG4gICAgWzAuMDU1NywgLTAuMjA0MCwgIDEuMDU3MF1cclxuXVxyXG5cclxuY29uc3QgZkludiA9ICh0OiBudW1iZXIpID0+IHtcclxuICAgIGlmIChNYXRoLnBvdyh0LCAzKSA+IExBQl9FKSB7XHJcbiAgICByZXR1cm4gTWF0aC5wb3codCwgMylcclxuICAgIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gKCgxMTYgKiB0KSAtIDE2KSAvIExBQl9LXHJcbiAgICB9XHJcbn1cclxuY29uc3QgZG90UHJvZHVjdCA9IChhOiBudW1iZXJbXSwgYjogbnVtYmVyW10pID0+IHtcclxuICAgIGxldCByZXQgPSAwXHJcbiAgICBhLmZvckVhY2goKF8sIGkpID0+IHtcclxuICAgICAgICByZXQgKz0gYVtpXSAqIGJbaV1cclxuICAgIH0pXHJcbiAgICByZXR1cm4gcmV0XHJcbn1cclxuY29uc3QgZnJvbUxpbmVhciA9IChjOiBudW1iZXIpID0+IHtcclxuICAgIGNvbnN0IGEgPSAwLjA1NVxyXG4gICAgaWYgKGMgPD0gMC4wMDMxMzA4KSB7XHJcbiAgICAgICAgcmV0dXJuIDEyLjkyICogY1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gKDEuMDU1ICogTWF0aC5wb3coYywgMSAvIDIuNCkpIC0gMC4wNTVcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gbGFicmdiKGw6IG51bWJlciwgYTogbnVtYmVyLCBiOiBudW1iZXIpOiBzdHJpbmcge1xyXG4gICAgY29uc3QgdmFyWSA9IChsICsgMTYpIC8gMTE2XHJcbiAgICBjb25zdCB2YXJaID0gdmFyWSAtIChiIC8gMjAwKVxyXG4gICAgY29uc3QgdmFyWCA9IChhIC8gNTAwKSArIHZhcllcclxuICAgIGNvbnN0IF9YID0gUkVGX1ggKiBmSW52KHZhclgpXHJcbiAgICBjb25zdCBfWSA9IFJFRl9ZICogZkludih2YXJZKVxyXG4gICAgY29uc3QgX1ogPSBSRUZfWiAqIGZJbnYodmFyWilcclxuXHJcbiAgICBjb25zdCB0dXBsZSA9IFtfWCwgX1ksIF9aXVxyXG5cclxuICAgIGNvbnN0IF9SID0gZnJvbUxpbmVhcihkb3RQcm9kdWN0KE1bMF0sIHR1cGxlKSlcclxuICAgIGNvbnN0IF9HID0gZnJvbUxpbmVhcihkb3RQcm9kdWN0KE1bMV0sIHR1cGxlKSlcclxuICAgIGNvbnN0IF9CID0gZnJvbUxpbmVhcihkb3RQcm9kdWN0KE1bMl0sIHR1cGxlKSlcclxuXHJcbiAgICAvLyBPcmlnaW5hbCBmcm9tIGhlcmVcclxuICAgIGNvbnN0IG4gPSAodjogbnVtYmVyKSA9PiBNYXRoLnJvdW5kKE1hdGgubWF4KE1hdGgubWluKHYgKiAyNTYsIDI1NSksIDApKVxyXG4gICAgcmV0dXJuIGByZ2IoJHtuKF9SKX0sICR7bihfRyl9LCAke24oX0IpfSlgXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDb252ZXJ0IGEgbGV0dGVyIHRvIGEgZmxvYXQgdmFsdWVkIGZyb20gMCB0byAyNTVcclxuICovXHJcbmZ1bmN0aW9uIGxldHRlclRvQ29sb3JWYWwobGV0dGVyOiBzdHJpbmcpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuICgoKGxldHRlci5jaGFyQ29kZUF0KDApIC0gNjUpIC8gMjYpICogMjU2KSAtIDEyOFxyXG59XHJcblxyXG4vLyBUaGUgZnVuY3Rpb24gYmVsb3cgdXNlcyB0aGlzIGFsZ29yaXRobSB0byBnZW5lcmF0ZSBhIGJhY2tncm91bmQgY29sb3IgZm9yIHRoZSBpbml0aWFscyBkaXNwbGF5ZWQgaW4gdGhlIHNpZGViYXIuXHJcbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVBdmF0YXIoKTogdm9pZCB7XHJcbiAgICBpZiAoIWxvY2FsU3RvcmFnZVJlYWQoJ3VzZXJuYW1lJykpIHJldHVyblxyXG4gICAgZWxlbUJ5SWQoJ3VzZXInKS5pbm5lckhUTUwgPSBsb2NhbFN0b3JhZ2VSZWFkKCd1c2VybmFtZScpXHJcbiAgICBjb25zdCBpbml0aWFscyA9IGxvY2FsU3RvcmFnZVJlYWQoJ3VzZXJuYW1lJykubWF0Y2goL1xcZCooLikuKj8oLiQpLykgLy8gU2VwYXJhdGUgeWVhciBmcm9tIGZpcnN0IG5hbWUgYW5kIGluaXRpYWxcclxuICAgIGlmIChpbml0aWFscyAhPSBudWxsKSB7XHJcbiAgICAgICAgY29uc3QgYmcgPSBsYWJyZ2IoNTAsIGxldHRlclRvQ29sb3JWYWwoaW5pdGlhbHNbMV0pLCBsZXR0ZXJUb0NvbG9yVmFsKGluaXRpYWxzWzJdKSkgLy8gQ29tcHV0ZSB0aGUgY29sb3JcclxuICAgICAgICBlbGVtQnlJZCgnaW5pdGlhbHMnKS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBiZ1xyXG4gICAgICAgIGVsZW1CeUlkKCdpbml0aWFscycpLmlubmVySFRNTCA9IGluaXRpYWxzWzFdICsgaW5pdGlhbHNbMl1cclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyB0b2RheSB9IGZyb20gJy4uL2RhdGVzJ1xyXG5pbXBvcnQgeyBlbGVtZW50IH0gZnJvbSAnLi4vdXRpbCdcclxuXHJcbmNvbnN0IE1PTlRIUyA9IFsnSmFuJywgJ0ZlYicsICdNYXInLCAnQXByJywgJ01heScsICdKdW4nLCAnSnVsJywgJ0F1ZycsICdTZXAnLCAnT2N0JywgJ05vdicsICdEZWMnXVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVdlZWsoaWQ6IHN0cmluZyk6IEhUTUxFbGVtZW50IHtcclxuICAgIGNvbnN0IHdrID0gZWxlbWVudCgnc2VjdGlvbicsICd3ZWVrJywgbnVsbCwgaWQpXHJcbiAgICBjb25zdCBkYXlUYWJsZSA9IGVsZW1lbnQoJ3RhYmxlJywgJ2RheVRhYmxlJykgYXMgSFRNTFRhYmxlRWxlbWVudFxyXG4gICAgY29uc3QgdHIgPSBkYXlUYWJsZS5pbnNlcnRSb3coKVxyXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lIG5vLWxvb3BzXHJcbiAgICBmb3IgKGxldCBkYXkgPSAwOyBkYXkgPCA3OyBkYXkrKykgdHIuaW5zZXJ0Q2VsbCgpXHJcbiAgICB3ay5hcHBlbmRDaGlsZChkYXlUYWJsZSlcclxuXHJcbiAgICByZXR1cm4gd2tcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZURheShkOiBEYXRlKTogSFRNTEVsZW1lbnQge1xyXG4gICAgY29uc3QgZGF5ID0gZWxlbWVudCgnZGl2JywgJ2RheScsIG51bGwsICdkYXknKVxyXG4gICAgZGF5LnNldEF0dHJpYnV0ZSgnZGF0YS1kYXRlJywgU3RyaW5nKGQuZ2V0VGltZSgpKSlcclxuICAgIGlmIChNYXRoLmZsb29yKChkLmdldFRpbWUoKSAtIGQuZ2V0VGltZXpvbmVPZmZzZXQoKSkgLyAxMDAwIC8gMzYwMCAvIDI0KSA9PT0gdG9kYXkoKSkge1xyXG4gICAgICBkYXkuY2xhc3NMaXN0LmFkZCgndG9kYXknKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG1vbnRoID0gZWxlbWVudCgnc3BhbicsICdtb250aCcsIE1PTlRIU1tkLmdldE1vbnRoKCldKVxyXG4gICAgZGF5LmFwcGVuZENoaWxkKG1vbnRoKVxyXG5cclxuICAgIGNvbnN0IGRhdGUgPSBlbGVtZW50KCdzcGFuJywgJ2RhdGUnLCBTdHJpbmcoZC5nZXREYXRlKCkpKVxyXG4gICAgZGF5LmFwcGVuZENoaWxkKGRhdGUpXHJcblxyXG4gICAgcmV0dXJuIGRheVxyXG59XHJcbiIsImltcG9ydCB7IGdldENsYXNzZXMsIGdldERhdGEgfSBmcm9tICcuLi9wY3InXHJcbmltcG9ydCB7IF8kLCBjYXBpdGFsaXplU3RyaW5nLCBlbGVtQnlJZCwgZWxlbWVudCB9IGZyb20gJy4uL3V0aWwnXHJcblxyXG4vLyBXaGVuIGFueXRoaW5nIGlzIHR5cGVkLCB0aGUgc2VhcmNoIHN1Z2dlc3Rpb25zIG5lZWQgdG8gYmUgdXBkYXRlZC5cclxuY29uc3QgVElQX05BTUVTID0ge1xyXG4gICAgZm9yOiBbJ2ZvciddLFxyXG4gICAgYnk6IFsnYnknLCAnZHVlJywgJ2VuZGluZyddLFxyXG4gICAgc3RhcnRpbmc6IFsnc3RhcnRpbmcnLCAnYmVnaW5uaW5nJywgJ2Fzc2lnbmVkJ11cclxufVxyXG5cclxuY29uc3QgbmV3VGV4dCA9IGVsZW1CeUlkKCduZXdUZXh0JykgYXMgSFRNTElucHV0RWxlbWVudFxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZU5ld1RpcHModmFsOiBzdHJpbmcsIHNjcm9sbDogYm9vbGVhbiA9IHRydWUpOiB2b2lkIHtcclxuICAgIGlmIChzY3JvbGwpIHtcclxuICAgICAgICBlbGVtQnlJZCgnbmV3VGlwcycpLnNjcm9sbFRvcCA9IDBcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBzcGFjZUluZGV4ID0gdmFsLmxhc3RJbmRleE9mKCcgJylcclxuICAgIGlmIChzcGFjZUluZGV4ICE9PSAtMSkge1xyXG4gICAgICAgIGNvbnN0IGJlZm9yZVNwYWNlID0gdmFsLmxhc3RJbmRleE9mKCcgJywgc3BhY2VJbmRleCAtIDEpXHJcbiAgICAgICAgY29uc3QgYmVmb3JlID0gdmFsLnN1YnN0cmluZygoYmVmb3JlU3BhY2UgPT09IC0xID8gMCA6IGJlZm9yZVNwYWNlICsgMSksIHNwYWNlSW5kZXgpXHJcbiAgICAgICAgT2JqZWN0LmVudHJpZXMoVElQX05BTUVTKS5mb3JFYWNoKChbbmFtZSwgcG9zc2libGVdKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChwb3NzaWJsZS5pbmRleE9mKGJlZm9yZSkgIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobmFtZSA9PT0gJ2ZvcicpIHtcclxuICAgICAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhUSVBfTkFNRVMpLmZvckVhY2goKHRpcE5hbWUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbUJ5SWQoYHRpcCR7dGlwTmFtZX1gKS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgZ2V0Q2xhc3NlcygpLmZvckVhY2goKGNscykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpZCA9IGB0aXBjbGFzcyR7Y2xzLnJlcGxhY2UoL1xcVy8sICcnKX1gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzcGFjZUluZGV4ID09PSAodmFsLmxlbmd0aCAtIDEpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY29udGFpbmVyID0gZWxlbWVudCgnZGl2JywgWydjbGFzc1RpcCcsICdhY3RpdmUnLCAndGlwJ10sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGA8aSBjbGFzcz0nbWF0ZXJpYWwtaWNvbnMnPmNsYXNzPC9pPjxzcGFuIGNsYXNzPSd0eXBlZCc+JHtjbHN9PC9zcGFuPmAsIGlkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRpcENvbXBsZXRlKGNscykpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbUJ5SWQoJ25ld1RpcHMnKS5hcHBlbmRDaGlsZChjb250YWluZXIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtQnlJZChpZCkuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbHMudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyh2YWwudG9Mb3dlckNhc2UoKS5zdWJzdHIoc3BhY2VJbmRleCArIDEpKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jbGFzc1RpcCcpLmZvckVhY2goKGVsKSA9PiB7XHJcbiAgICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcclxuICAgIH0pXHJcbiAgICBpZiAoKHZhbCA9PT0gJycpIHx8ICh2YWwuY2hhckF0KHZhbC5sZW5ndGggLSAxKSA9PT0gJyAnKSkge1xyXG4gICAgICAgIHVwZGF0ZVRpcCgnZm9yJywgJ2ZvcicsIGZhbHNlKVxyXG4gICAgICAgIHVwZGF0ZVRpcCgnYnknLCAnYnknLCBmYWxzZSlcclxuICAgICAgICB1cGRhdGVUaXAoJ3N0YXJ0aW5nJywgJ3N0YXJ0aW5nJywgZmFsc2UpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IGxhc3RTcGFjZSA9IHZhbC5sYXN0SW5kZXhPZignICcpXHJcbiAgICAgICAgbGV0IGxhc3RXb3JkID0gbGFzdFNwYWNlID09PSAtMSA/IHZhbCA6IHZhbC5zdWJzdHIobGFzdFNwYWNlICsgMSlcclxuICAgICAgICBjb25zdCB1cHBlcmNhc2UgPSBsYXN0V29yZC5jaGFyQXQoMCkgPT09IGxhc3RXb3JkLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpXHJcbiAgICAgICAgbGFzdFdvcmQgPSBsYXN0V29yZC50b0xvd2VyQ2FzZSgpXHJcbiAgICAgICAgT2JqZWN0LmVudHJpZXMoVElQX05BTUVTKS5mb3JFYWNoKChbbmFtZSwgcG9zc2libGVdKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBmb3VuZDogc3RyaW5nfG51bGwgPSBudWxsXHJcbiAgICAgICAgICAgIHBvc3NpYmxlLmZvckVhY2goKHApID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChwLnNsaWNlKDAsIGxhc3RXb3JkLmxlbmd0aCkgPT09IGxhc3RXb3JkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm91bmQgPSBwXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIGlmIChmb3VuZCkge1xyXG4gICAgICAgICAgICAgICAgdXBkYXRlVGlwKG5hbWUsIGZvdW5kLCB1cHBlcmNhc2UpXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBlbGVtQnlJZChgdGlwJHtuYW1lfWApLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVUaXAobmFtZTogc3RyaW5nLCB0eXBlZDogc3RyaW5nLCBjYXBpdGFsaXplOiBib29sZWFuKTogdm9pZCB7XHJcbiAgICBpZiAobmFtZSAhPT0gJ2ZvcicgJiYgbmFtZSAhPT0gJ2J5JyAmJiBuYW1lICE9PSAnc3RhcnRpbmcnKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHRpcCBuYW1lJylcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBlbCA9IGVsZW1CeUlkKGB0aXAke25hbWV9YClcclxuICAgIGVsLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcbiAgICBfJChlbC5xdWVyeVNlbGVjdG9yKCcudHlwZWQnKSkuaW5uZXJIVE1MID0gKGNhcGl0YWxpemUgPyBjYXBpdGFsaXplU3RyaW5nKHR5cGVkKSA6IHR5cGVkKSArICcuLi4nXHJcbiAgICBjb25zdCBuZXdOYW1lczogc3RyaW5nW10gPSBbXVxyXG4gICAgVElQX05BTUVTW25hbWVdLmZvckVhY2goKG4pID0+IHtcclxuICAgICAgICBpZiAobiAhPT0gdHlwZWQpIHsgbmV3TmFtZXMucHVzaChgPGI+JHtufTwvYj5gKSB9XHJcbiAgICB9KVxyXG4gICAgXyQoZWwucXVlcnlTZWxlY3RvcignLm90aGVycycpKS5pbm5lckhUTUwgPSBuZXdOYW1lcy5sZW5ndGggPiAwID8gYFlvdSBjYW4gYWxzbyB1c2UgJHtuZXdOYW1lcy5qb2luKCcgb3IgJyl9YCA6ICcnXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHRpcENvbXBsZXRlKGF1dG9jb21wbGV0ZTogc3RyaW5nKTogKGV2dDogRXZlbnQpID0+IHZvaWQge1xyXG4gICAgcmV0dXJuIChldnQ6IEV2ZW50KSA9PiB7XHJcbiAgICAgICAgY29uc3QgdmFsID0gbmV3VGV4dC52YWx1ZVxyXG4gICAgICAgIGNvbnN0IGxhc3RTcGFjZSA9IHZhbC5sYXN0SW5kZXhPZignICcpXHJcbiAgICAgICAgY29uc3QgbGFzdFdvcmQgPSBsYXN0U3BhY2UgPT09IC0xID8gMCA6IGxhc3RTcGFjZSArIDFcclxuICAgICAgICB1cGRhdGVOZXdUaXBzKG5ld1RleHQudmFsdWUgPSB2YWwuc3Vic3RyaW5nKDAsIGxhc3RXb3JkKSArIGF1dG9jb21wbGV0ZSArICcgJylcclxuICAgICAgICByZXR1cm4gbmV3VGV4dC5mb2N1cygpXHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIFRoZSBldmVudCBsaXN0ZW5lciBpcyB0aGVuIGFkZGVkIHRvIHRoZSBwcmVleGlzdGluZyB0aXBzLlxyXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGlwJykuZm9yRWFjaCgodGlwKSA9PiB7XHJcbiAgICB0aXAuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aXBDb21wbGV0ZShfJCh0aXAucXVlcnlTZWxlY3RvcignLnR5cGVkJykpLmlubmVySFRNTCkpXHJcbn0pXHJcbiIsImltcG9ydCB7IFZFUlNJT04gfSBmcm9tICcuLi9hcHAnXHJcbmltcG9ydCB7IGVsZW1CeUlkIH0gZnJvbSAnLi4vdXRpbCdcclxuXHJcbmNvbnN0IEVSUk9SX0ZPUk1fVVJMID0gJ2h0dHBzOi8vZG9jcy5nb29nbGUuY29tL2Evc3R1ZGVudHMuaGFya2VyLm9yZy9mb3Jtcy9kLydcclxuICAgICAgICAgICAgICAgICAgICAgKyAnMXNhMmdVdFlGUGRLVDVZRU5YSUVZYXV5UlB1Y3FzUUNWYVFBUGVGM2JaNFEvdmlld2Zvcm0nXHJcbmNvbnN0IEVSUk9SX0ZPUk1fRU5UUlkgPSAnP2VudHJ5LjEyMDAzNjIyMz0nXHJcbmNvbnN0IEVSUk9SX0dJVEhVQl9VUkwgPSAnaHR0cHM6Ly9naXRodWIuY29tLzE5UnlhbkEvQ2hlY2tQQ1IvaXNzdWVzL25ldydcclxuXHJcbmNvbnN0IGxpbmtCeUlkID0gKGlkOiBzdHJpbmcpID0+IGVsZW1CeUlkKGlkKSBhcyBIVE1MTGlua0VsZW1lbnRcclxuXHJcbi8vICpkaXNwbGF5RXJyb3IqIGRpc3BsYXlzIGEgZGlhbG9nIGNvbnRhaW5pbmcgaW5mb3JtYXRpb24gYWJvdXQgYW4gZXJyb3IuXHJcbmV4cG9ydCBmdW5jdGlvbiBkaXNwbGF5RXJyb3IoZTogRXJyb3IpOiB2b2lkIHtcclxuICAgIGNvbnNvbGUubG9nKCdEaXNwbGF5aW5nIGVycm9yJywgZSlcclxuICAgIGNvbnN0IGVycm9ySFRNTCA9IGBNZXNzYWdlOiAke2UubWVzc2FnZX1cXG5TdGFjazogJHtlLnN0YWNrIHx8IChlIGFzIGFueSkubGluZU51bWJlcn1cXG5gXHJcbiAgICAgICAgICAgICAgICAgICAgKyBgQnJvd3NlcjogJHtuYXZpZ2F0b3IudXNlckFnZW50fVxcblZlcnNpb246ICR7VkVSU0lPTn1gXHJcbiAgICBlbGVtQnlJZCgnZXJyb3JDb250ZW50JykuaW5uZXJIVE1MID0gZXJyb3JIVE1MLnJlcGxhY2UoJ1xcbicsICc8YnI+JylcclxuICAgIGxpbmtCeUlkKCdlcnJvckdvb2dsZScpLmhyZWYgPSBFUlJPUl9GT1JNX1VSTCArIEVSUk9SX0ZPUk1fRU5UUlkgKyBlbmNvZGVVUklDb21wb25lbnQoZXJyb3JIVE1MKVxyXG4gICAgbGlua0J5SWQoJ2Vycm9yR2l0SHViJykuaHJlZiA9XHJcbiAgICAgICAgRVJST1JfR0lUSFVCX1VSTCArICc/Ym9keT0nICsgZW5jb2RlVVJJQ29tcG9uZW50KGBJJ3ZlIGVuY291bnRlcmVkIGFuIGJ1Zy5cXG5cXG5cXGBcXGBcXGBcXG4ke2Vycm9ySFRNTH1cXG5cXGBcXGBcXGBgKVxyXG4gICAgZWxlbUJ5SWQoJ2Vycm9yQmFja2dyb3VuZCcpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXHJcbiAgICByZXR1cm4gZWxlbUJ5SWQoJ2Vycm9yJykuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxufVxyXG4iLCJpbXBvcnQgeyBfJCB9IGZyb20gJy4uL3V0aWwnXHJcblxyXG4vLyBGb3IgbGlzdCB2aWV3LCB0aGUgYXNzaWdubWVudHMgY2FuJ3QgYmUgb24gdG9wIG9mIGVhY2ggb3RoZXIuXHJcbi8vIFRoZXJlZm9yZSwgYSBsaXN0ZW5lciBpcyBhdHRhY2hlZCB0byB0aGUgcmVzaXppbmcgb2YgdGhlIGJyb3dzZXIgd2luZG93LlxyXG5sZXQgdGlja2luZyA9IGZhbHNlXHJcbmxldCB0aW1lb3V0SWQ6IG51bWJlcnxudWxsID0gbnVsbFxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0UmVzaXplQXNzaWdubWVudHMoKTogSFRNTEVsZW1lbnRbXSB7XHJcbiAgICBjb25zdCBhc3NpZ25tZW50cyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5jb250YWlucygnc2hvd0RvbmUnKSA/XHJcbiAgICAgICAgJy5hc3NpZ25tZW50Lmxpc3REaXNwJyA6ICcuYXNzaWdubWVudC5saXN0RGlzcDpub3QoLmRvbmUpJykpXHJcbiAgICBhc3NpZ25tZW50cy5zb3J0KChhLCBiKSA9PiB7XHJcbiAgICAgICAgY29uc3QgYWQgPSBhLmNsYXNzTGlzdC5jb250YWlucygnZG9uZScpXHJcbiAgICAgICAgY29uc3QgYmQgPSBiLmNsYXNzTGlzdC5jb250YWlucygnZG9uZScpXHJcbiAgICAgICAgaWYgKGFkICYmICFiZCkgeyByZXR1cm4gMSB9XHJcbiAgICAgICAgaWYgKGJkICYmICFhZCkgeyByZXR1cm4gLTEgfVxyXG4gICAgICAgIHJldHVybiBOdW1iZXIoKGEucXVlcnlTZWxlY3RvcignLmR1ZScpIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlKVxyXG4gICAgICAgICAgICAgLSBOdW1iZXIoKGIucXVlcnlTZWxlY3RvcignLmR1ZScpIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlKVxyXG4gICAgfSlcclxuICAgIHJldHVybiBhc3NpZ25tZW50cyBhcyBIVE1MRWxlbWVudFtdXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZXNpemVDYWxsZXIoKTogdm9pZCB7XHJcbiAgICBpZiAoIXRpY2tpbmcpIHtcclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVzaXplKVxyXG4gICAgICAgIHRpY2tpbmcgPSB0cnVlXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZXNpemUoKTogdm9pZCB7XHJcbiAgICB0aWNraW5nID0gdHJ1ZVxyXG4gICAgLy8gVG8gY2FsY3VsYXRlIHRoZSBudW1iZXIgb2YgY29sdW1ucywgdGhlIGJlbG93IGFsZ29yaXRobSBpcyB1c2VkIGJlY2FzZSBhcyB0aGUgc2NyZWVuIHNpemVcclxuICAgIC8vIGluY3JlYXNlcywgdGhlIGNvbHVtbiB3aWR0aCBpbmNyZWFzZXNcclxuICAgIGNvbnN0IHdpZHRocyA9IGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKCdzaG93SW5mbycpID9cclxuICAgICAgICBbNjUwLCAxMTAwLCAxODAwLCAyNzAwLCAzODAwLCA1MTAwXSA6IFszNTAsIDgwMCwgMTUwMCwgMjQwMCwgMzUwMCwgNDgwMF1cclxuICAgIGxldCBjb2x1bW5zID0gMVxyXG4gICAgd2lkdGhzLmZvckVhY2goKHcsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgaWYgKHdpbmRvdy5pbm5lcldpZHRoID4gdykgeyBjb2x1bW5zID0gaW5kZXggKyAxIH1cclxuICAgIH0pXHJcbiAgICBjb25zdCBjb2x1bW5IZWlnaHRzID0gQXJyYXkuZnJvbShuZXcgQXJyYXkoY29sdW1ucyksICgpID0+IDApXHJcbiAgICBjb25zdCBjY2g6IG51bWJlcltdID0gW11cclxuICAgIGNvbnN0IGFzc2lnbm1lbnRzID0gZ2V0UmVzaXplQXNzaWdubWVudHMoKVxyXG4gICAgYXNzaWdubWVudHMuZm9yRWFjaCgoYXNzaWdubWVudCwgbikgPT4ge1xyXG4gICAgICAgIGNvbnN0IGNvbCA9IG4gJSBjb2x1bW5zXHJcbiAgICAgICAgY2NoLnB1c2goY29sdW1uSGVpZ2h0c1tjb2xdKVxyXG4gICAgICAgIGNvbHVtbkhlaWdodHNbY29sXSArPSBhc3NpZ25tZW50Lm9mZnNldEhlaWdodCArIDI0XHJcbiAgICB9KVxyXG4gICAgYXNzaWdubWVudHMuZm9yRWFjaCgoYXNzaWdubWVudCwgbikgPT4ge1xyXG4gICAgICAgIGNvbnN0IGNvbCA9IG4gJSBjb2x1bW5zXHJcbiAgICAgICAgYXNzaWdubWVudC5zdHlsZS50b3AgPSBjY2hbbl0gKyAncHgnXHJcbiAgICAgICAgYXNzaWdubWVudC5zdHlsZS5sZWZ0ID0gKCgxMDAgLyBjb2x1bW5zKSAqIGNvbCkgKyAnJSdcclxuICAgICAgICBhc3NpZ25tZW50LnN0eWxlLnJpZ2h0ID0gKCgxMDAgLyBjb2x1bW5zKSAqIChjb2x1bW5zIC0gY29sIC0gMSkpICsgJyUnXHJcbiAgICB9KVxyXG4gICAgaWYgKHRpbWVvdXRJZCkgY2xlYXJUaW1lb3V0KHRpbWVvdXRJZClcclxuICAgIHRpbWVvdXRJZCA9IHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIGNjaC5sZW5ndGggPSAwXHJcbiAgICAgICAgYXNzaWdubWVudHMuZm9yRWFjaCgoYXNzaWdubWVudCwgbikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBjb2wgPSBuICUgY29sdW1uc1xyXG4gICAgICAgICAgICBpZiAobiA8IGNvbHVtbnMpIHtcclxuICAgICAgICAgICAgICAgIGNvbHVtbkhlaWdodHNbY29sXSA9IDBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjY2gucHVzaChjb2x1bW5IZWlnaHRzW2NvbF0pXHJcbiAgICAgICAgICAgIGNvbHVtbkhlaWdodHNbY29sXSArPSBhc3NpZ25tZW50Lm9mZnNldEhlaWdodCArIDI0XHJcbiAgICAgICAgfSlcclxuICAgICAgICBhc3NpZ25tZW50cy5mb3JFYWNoKChhc3NpZ25tZW50LCBuKSA9PiB7XHJcbiAgICAgICAgICAgIGFzc2lnbm1lbnQuc3R5bGUudG9wID0gY2NoW25dICsgJ3B4J1xyXG4gICAgICAgIH0pXHJcbiAgICB9LCA1MDApXHJcbiAgICB0aWNraW5nID0gZmFsc2VcclxufVxyXG4iLCIvKipcclxuICogQWxsIHRoaXMgaXMgcmVzcG9uc2libGUgZm9yIGlzIGNyZWF0aW5nIHNuYWNrYmFycy5cclxuICovXHJcblxyXG5pbXBvcnQgeyBlbGVtZW50LCBmb3JjZUxheW91dCB9IGZyb20gJy4uL3V0aWwnXHJcblxyXG4vKipcclxuICogQ3JlYXRlcyBhIHNuYWNrYmFyIHdpdGhvdXQgYW4gYWN0aW9uXHJcbiAqIEBwYXJhbSBtZXNzYWdlIFRoZSBzbmFja2JhcidzIG1lc3NhZ2VcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBzbmFja2JhcihtZXNzYWdlOiBzdHJpbmcpOiB2b2lkXHJcbi8qKlxyXG4gKiBDcmVhdGVzIGEgc25hY2tiYXIgd2l0aCBhbiBhY3Rpb25cclxuICogQHBhcmFtIG1lc3NhZ2UgVGhlIHNuYWNrYmFyJ3MgbWVzc2FnZVxyXG4gKiBAcGFyYW0gYWN0aW9uIE9wdGlvbmFsIHRleHQgdG8gc2hvdyBhcyBhIG1lc3NhZ2UgYWN0aW9uXHJcbiAqIEBwYXJhbSBmICAgICAgQSBmdW5jdGlvbiB0byBleGVjdXRlIHdoZW4gdGhlIGFjdGlvbiBpcyBjbGlja2VkXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gc25hY2tiYXIobWVzc2FnZTogc3RyaW5nLCBhY3Rpb246IHN0cmluZywgZjogKCkgPT4gdm9pZCk6IHZvaWRcclxuZXhwb3J0IGZ1bmN0aW9uIHNuYWNrYmFyKG1lc3NhZ2U6IHN0cmluZywgYWN0aW9uPzogc3RyaW5nLCBmPzogKCkgPT4gdm9pZCk6IHZvaWQge1xyXG4gICAgY29uc3Qgc25hY2sgPSBlbGVtZW50KCdkaXYnLCAnc25hY2tiYXInKVxyXG4gICAgY29uc3Qgc25hY2tJbm5lciA9IGVsZW1lbnQoJ2RpdicsICdzbmFja0lubmVyJywgbWVzc2FnZSlcclxuICAgIHNuYWNrLmFwcGVuZENoaWxkKHNuYWNrSW5uZXIpXHJcblxyXG4gICAgaWYgKChhY3Rpb24gIT0gbnVsbCkgJiYgKGYgIT0gbnVsbCkpIHtcclxuICAgICAgICBjb25zdCBhY3Rpb25FID0gZWxlbWVudCgnYScsIFtdLCBhY3Rpb24pXHJcbiAgICAgICAgYWN0aW9uRS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgc25hY2suY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcclxuICAgICAgICAgICAgZigpXHJcbiAgICAgICAgfSlcclxuICAgICAgICBzbmFja0lubmVyLmFwcGVuZENoaWxkKGFjdGlvbkUpXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgYWRkID0gKCkgPT4ge1xyXG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNuYWNrKVxyXG4gICAgICBmb3JjZUxheW91dChzbmFjaylcclxuICAgICAgc25hY2suY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICBzbmFjay5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gICAgICAgICAgc2V0VGltZW91dCgoKSA9PiBzbmFjay5yZW1vdmUoKSwgOTAwKVxyXG4gICAgICB9LCA1MDAwKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGV4aXN0aW5nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNuYWNrYmFyJylcclxuICAgIGlmIChleGlzdGluZyAhPSBudWxsKSB7XHJcbiAgICAgICAgZXhpc3RpbmcuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcclxuICAgICAgICBzZXRUaW1lb3V0KGFkZCwgMzAwKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBhZGQoKVxyXG4gICAgfVxyXG59XHJcbiIsIlxyXG4vKipcclxuICogQ29va2llIGZ1bmN0aW9ucyAoYSBjb29raWUgaXMgYSBzbWFsbCB0ZXh0IGRvY3VtZW50IHRoYXQgdGhlIGJyb3dzZXIgY2FuIHJlbWVtYmVyKVxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBSZXRyaWV2ZXMgYSBjb29raWVcclxuICogQHBhcmFtIGNuYW1lIHRoZSBuYW1lIG9mIHRoZSBjb29raWUgdG8gcmV0cmlldmVcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRDb29raWUoY25hbWU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICBjb25zdCBuYW1lID0gY25hbWUgKyAnPSdcclxuICAgIGNvbnN0IGNvb2tpZVBhcnQgPSBkb2N1bWVudC5jb29raWUuc3BsaXQoJzsnKS5maW5kKChjKSA9PiBjLmluY2x1ZGVzKG5hbWUpKVxyXG4gICAgaWYgKGNvb2tpZVBhcnQpIHJldHVybiBjb29raWVQYXJ0LnN1YnN0cmluZyhuYW1lLmxlbmd0aClcclxuICAgIHJldHVybiAnJyAvLyBCbGFuayBpZiBjb29raWUgbm90IGZvdW5kXHJcbiAgfVxyXG5cclxuLyoqIFNldHMgdGhlIHZhbHVlIG9mIGEgY29va2llXHJcbiAqIEBwYXJhbSBjbmFtZSB0aGUgbmFtZSBvZiB0aGUgY29va2llIHRvIHNldFxyXG4gKiBAcGFyYW0gY3ZhbHVlIHRoZSB2YWx1ZSB0byBzZXQgdGhlIGNvb2tpZSB0b1xyXG4gKiBAcGFyYW0gZXhkYXlzIHRoZSBudW1iZXIgb2YgZGF5cyB0aGF0IHRoZSBjb29raWUgd2lsbCBleHBpcmUgaW4gKGFuZCBub3QgYmUgZXhpc3RlbnQgYW55bW9yZSlcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRDb29raWUoY25hbWU6IHN0cmluZywgY3ZhbHVlOiBzdHJpbmcsIGV4ZGF5czogbnVtYmVyKTogdm9pZCB7XHJcbiAgICBjb25zdCBkID0gbmV3IERhdGUoKVxyXG4gICAgZC5zZXRUaW1lKGQuZ2V0VGltZSgpICsgKGV4ZGF5cyAqIDI0ICogNjAgKiA2MCAqIDEwMDApKVxyXG4gICAgY29uc3QgZXhwaXJlcyA9IGBleHBpcmVzPSR7ZC50b1VUQ1N0cmluZygpfWBcclxuICAgIGRvY3VtZW50LmNvb2tpZSA9IGNuYW1lICsgJz0nICsgY3ZhbHVlICsgJzsgJyArIGV4cGlyZXNcclxuICB9XHJcblxyXG4vKipcclxuICogRGVsZXRzIGEgY29va2llXHJcbiAqIEBwYXJhbSBjbmFtZSB0aGUgbmFtZSBvZiB0aGUgY29va2llIHRvIGRlbGV0ZVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGRlbGV0ZUNvb2tpZShjbmFtZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAvLyBUaGlzIGlzIGxpa2UgKnNldENvb2tpZSosIGJ1dCBzZXRzIHRoZSBleHBpcnkgZGF0ZSB0byBzb21ldGhpbmcgaW4gdGhlIHBhc3Qgc28gdGhlIGNvb2tpZSBpcyBkZWxldGVkLlxyXG4gICAgZG9jdW1lbnQuY29va2llID0gY25hbWUgKyAnPTsgZXhwaXJlcz1UaHUsIDAxIEphbiAxOTcwIDAwOjAwOjAxIEdNVDsnXHJcbn1cclxuIiwiZXhwb3J0IGZ1bmN0aW9uIHR6b2ZmKCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gKG5ldyBEYXRlKCkpLmdldFRpbWV6b25lT2Zmc2V0KCkgKiAxMDAwICogNjAgLy8gRm9yIGZ1dHVyZSBjYWxjdWxhdGlvbnNcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHRvRGF0ZU51bShkYXRlOiBEYXRlfG51bWJlcik6IG51bWJlciB7XHJcbiAgICBjb25zdCBudW0gPSBkYXRlIGluc3RhbmNlb2YgRGF0ZSA/IGRhdGUuZ2V0VGltZSgpIDogZGF0ZVxyXG4gICAgcmV0dXJuIE1hdGguZmxvb3IoKG51bSAtIHR6b2ZmKCkpIC8gMTAwMCAvIDM2MDAgLyAyNClcclxufVxyXG5cclxuLy8gKkZyb21EYXRlTnVtKiBjb252ZXJ0cyBhIG51bWJlciBvZiBkYXlzIHRvIGEgbnVtYmVyIG9mIHNlY29uZHNcclxuZXhwb3J0IGZ1bmN0aW9uIGZyb21EYXRlTnVtKGRheXM6IG51bWJlcik6IERhdGUge1xyXG4gICAgY29uc3QgZCA9IG5ldyBEYXRlKChkYXlzICogMTAwMCAqIDM2MDAgKiAyNCkgKyB0em9mZigpKVxyXG4gICAgLy8gVGhlIGNoZWNrcyBiZWxvdyBhcmUgdG8gaGFuZGxlIGRheWxpZ2h0IHNhdmluZ3MgdGltZVxyXG4gICAgaWYgKGQuZ2V0SG91cnMoKSA9PT0gMSkgeyBkLnNldEhvdXJzKDApIH1cclxuICAgIGlmICgoZC5nZXRIb3VycygpID09PSAyMikgfHwgKGQuZ2V0SG91cnMoKSA9PT0gMjMpKSB7XHJcbiAgICAgIGQuc2V0SG91cnMoMjQpXHJcbiAgICAgIGQuc2V0TWludXRlcygwKVxyXG4gICAgICBkLnNldFNlY29uZHMoMClcclxuICAgIH1cclxuICAgIHJldHVybiBkXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB0b2RheSgpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIHRvRGF0ZU51bShuZXcgRGF0ZSgpKVxyXG59XHJcblxyXG4vKipcclxuICogSXRlcmF0ZXMgZnJvbSB0aGUgc3RhcnRpbmcgZGF0ZSB0byBlbmRpbmcgZGF0ZSBpbmNsdXNpdmVcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBpdGVyRGF5cyhzdGFydDogRGF0ZSwgZW5kOiBEYXRlLCBjYjogKGRhdGU6IERhdGUpID0+IHZvaWQpOiB2b2lkIHtcclxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZSBuby1sb29wc1xyXG4gICAgZm9yIChjb25zdCBkID0gbmV3IERhdGUoc3RhcnQpOyBkIDw9IGVuZDsgZC5zZXREYXRlKGQuZ2V0RGF0ZSgpICsgMSkpIHtcclxuICAgICAgICBjYihkKVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IGNvbXB1dGVXZWVrSWQsIGNyZWF0ZUFzc2lnbm1lbnQsIGdldEVTLCBzZXBhcmF0ZWRDbGFzcyB9IGZyb20gJy4vY29tcG9uZW50cy9hc3NpZ25tZW50J1xyXG5pbXBvcnQgeyBjcmVhdGVEYXksIGNyZWF0ZVdlZWsgfSBmcm9tICcuL2NvbXBvbmVudHMvY2FsZW5kYXInXHJcbmltcG9ydCB7IGRpc3BsYXlFcnJvciB9IGZyb20gJy4vY29tcG9uZW50cy9lcnJvckRpc3BsYXknXHJcbmltcG9ydCB7IHJlc2l6ZSB9IGZyb20gJy4vY29tcG9uZW50cy9yZXNpemVyJ1xyXG5pbXBvcnQgeyBmcm9tRGF0ZU51bSwgaXRlckRheXMsIHRvZGF5IH0gZnJvbSAnLi9kYXRlcydcclxuaW1wb3J0IHsgY2xhc3NCeUlkLCBnZXREYXRhLCBJQXBwbGljYXRpb25EYXRhLCBJQXNzaWdubWVudCB9IGZyb20gJy4vcGNyJ1xyXG5pbXBvcnQgeyBhZGRBY3Rpdml0eSwgc2F2ZUFjdGl2aXR5IH0gZnJvbSAnLi9wbHVnaW5zL2FjdGl2aXR5J1xyXG5pbXBvcnQgeyBleHRyYVRvVGFzaywgZ2V0RXh0cmEsIElDdXN0b21Bc3NpZ25tZW50IH0gZnJvbSAnLi9wbHVnaW5zL2N1c3RvbUFzc2lnbm1lbnRzJ1xyXG5pbXBvcnQgeyBhc3NpZ25tZW50SW5Eb25lLCByZW1vdmVGcm9tRG9uZSwgc2F2ZURvbmUgfSBmcm9tICcuL3BsdWdpbnMvZG9uZSdcclxuaW1wb3J0IHsgYXNzaWdubWVudEluTW9kaWZpZWQsIHJlbW92ZUZyb21Nb2RpZmllZCwgc2F2ZU1vZGlmaWVkIH0gZnJvbSAnLi9wbHVnaW5zL21vZGlmaWVkQXNzaWdubWVudHMnXHJcbmltcG9ydCB7IHNldHRpbmdzIH0gZnJvbSAnLi9zZXR0aW5ncydcclxuaW1wb3J0IHsgXyQsIGRhdGVTdHJpbmcsIGVsZW1CeUlkLCBlbGVtZW50LCBsb2NhbFN0b3JhZ2VSZWFkLCBzbW9vdGhTY3JvbGwgfSBmcm9tICcuL3V0aWwnXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElTcGxpdEFzc2lnbm1lbnQge1xyXG4gICAgYXNzaWdubWVudDogSUFzc2lnbm1lbnRcclxuICAgIHN0YXJ0OiBEYXRlXHJcbiAgICBlbmQ6IERhdGV8J0ZvcmV2ZXInXHJcbiAgICBjdXN0b206IGJvb2xlYW5cclxuICAgIHJlZmVyZW5jZT86IElDdXN0b21Bc3NpZ25tZW50XHJcbn1cclxuXHJcbmNvbnN0IFNDSEVEVUxFX0VORFMgPSB7XHJcbiAgICBkYXk6IChkYXRlOiBEYXRlKSA9PiAyNCAqIDM2MDAgKiAxMDAwLFxyXG4gICAgbXM6IChkYXRlOiBEYXRlKSA9PiBbMjQsICAgICAgICAgICAgICAvLyBTdW5kYXlcclxuICAgICAgICAgICAgICAgICAgICAgICAgIDE1ICsgKDM1IC8gNjApLCAgLy8gTW9uZGF5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAxNSArICgzNSAvIDYwKSwgIC8vIFR1ZXNkYXlcclxuICAgICAgICAgICAgICAgICAgICAgICAgIDE1ICsgKDE1IC8gNjApLCAgLy8gV2VkbmVzZGF5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAxNSArICgxNSAvIDYwKSwgIC8vIFRodXJzZGF5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAxNSArICgxNSAvIDYwKSwgIC8vIEZyaWRheVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgMjQgICAgICAgICAgICAgICAvLyBTYXR1cmRheVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdW2RhdGUuZ2V0RGF5KCldLFxyXG4gICAgdXM6IChkYXRlOiBEYXRlKSA9PiAxNSAqIDM2MDAgKiAxMDAwXHJcbn1cclxuY29uc3QgV0VFS0VORF9DTEFTU05BTUVTID0gWydmcm9tV2Vla2VuZCcsICdvdmVyV2Vla2VuZCddXHJcblxyXG5sZXQgc2Nyb2xsID0gMCAvLyBUaGUgbG9jYXRpb24gdG8gc2Nyb2xsIHRvIGluIG9yZGVyIHRvIHJlYWNoIHRvZGF5IGluIGNhbGVuZGFyIHZpZXdcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRTY3JvbGwoKTogbnVtYmVyIHtcclxuICAgIHJldHVybiBzY3JvbGxcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFRpbWVBZnRlcihkYXRlOiBEYXRlKTogbnVtYmVyIHtcclxuICAgIGNvbnN0IGhpZGVBc3NpZ25tZW50cyA9IHNldHRpbmdzLmhpZGVBc3NpZ25tZW50c1xyXG4gICAgaWYgKGhpZGVBc3NpZ25tZW50cyA9PT0gJ2RheScgfHwgaGlkZUFzc2lnbm1lbnRzID09PSAnbXMnIHx8IGhpZGVBc3NpZ25tZW50cyA9PT0gJ3VzJykge1xyXG4gICAgICAgIHJldHVybiBTQ0hFRFVMRV9FTkRTW2hpZGVBc3NpZ25tZW50c10oZGF0ZSlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIFNDSEVEVUxFX0VORFMuZGF5KGRhdGUpXHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFN0YXJ0RW5kRGF0ZXMoZGF0YTogSUFwcGxpY2F0aW9uRGF0YSk6IHtzdGFydDogRGF0ZSwgZW5kOiBEYXRlIH0ge1xyXG4gICAgaWYgKGRhdGEubW9udGhWaWV3KSB7XHJcbiAgICAgICAgY29uc3Qgc3RhcnROID0gTWF0aC5taW4oLi4uZGF0YS5hc3NpZ25tZW50cy5tYXAoKGEpID0+IGEuc3RhcnQpKSAvLyBTbWFsbGVzdCBkYXRlXHJcbiAgICAgICAgY29uc3QgZW5kTiA9IE1hdGgubWF4KC4uLmRhdGEuYXNzaWdubWVudHMubWFwKChhKSA9PiBhLnN0YXJ0KSkgLy8gTGFyZ2VzdCBkYXRlXHJcblxyXG4gICAgICAgIGNvbnN0IHllYXIgPSAobmV3IERhdGUoKSkuZ2V0RnVsbFllYXIoKSAvLyBGb3IgZnV0dXJlIGNhbGN1bGF0aW9uc1xyXG5cclxuICAgICAgICAvLyBDYWxjdWxhdGUgd2hhdCBtb250aCB3ZSB3aWxsIGJlIGRpc3BsYXlpbmcgYnkgZmluZGluZyB0aGUgbW9udGggb2YgdG9kYXlcclxuICAgICAgICBjb25zdCBtb250aCA9IChuZXcgRGF0ZSgpKS5nZXRNb250aCgpXHJcblxyXG4gICAgICAgIC8vIE1ha2Ugc3VyZSB0aGUgc3RhcnQgYW5kIGVuZCBkYXRlcyBsaWUgd2l0aGluIHRoZSBtb250aFxyXG4gICAgICAgIGNvbnN0IHN0YXJ0ID0gbmV3IERhdGUoTWF0aC5tYXgoZnJvbURhdGVOdW0oc3RhcnROKS5nZXRUaW1lKCksIChuZXcgRGF0ZSh5ZWFyLCBtb250aCkpLmdldFRpbWUoKSkpXHJcbiAgICAgICAgLy8gSWYgdGhlIGRheSBhcmd1bWVudCBmb3IgRGF0ZSBpcyAwLCB0aGVuIHRoZSByZXN1bHRpbmcgZGF0ZSB3aWxsIGJlIG9mIHRoZSBwcmV2aW91cyBtb250aFxyXG4gICAgICAgIGNvbnN0IGVuZCA9IG5ldyBEYXRlKE1hdGgubWluKGZyb21EYXRlTnVtKGVuZE4pLmdldFRpbWUoKSwgKG5ldyBEYXRlKHllYXIsIG1vbnRoICsgMSwgMCkpLmdldFRpbWUoKSkpXHJcbiAgICAgICAgcmV0dXJuIHsgc3RhcnQsIGVuZCB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc3QgdG9kYXlTRSA9IG5ldyBEYXRlKClcclxuICAgICAgICBjb25zdCBzdGFydCA9IG5ldyBEYXRlKHRvZGF5U0UuZ2V0RnVsbFllYXIoKSwgdG9kYXlTRS5nZXRNb250aCgpLCB0b2RheVNFLmdldERhdGUoKSlcclxuICAgICAgICBjb25zdCBlbmQgPSBuZXcgRGF0ZSh0b2RheVNFLmdldEZ1bGxZZWFyKCksIHRvZGF5U0UuZ2V0TW9udGgoKSwgdG9kYXlTRS5nZXREYXRlKCkpXHJcbiAgICAgICAgcmV0dXJuIHsgc3RhcnQsIGVuZCB9XHJcbiAgICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0QXNzaWdubWVudFNwbGl0cyhhc3NpZ25tZW50OiBJQXNzaWdubWVudCwgc3RhcnQ6IERhdGUsIGVuZDogRGF0ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWZlcmVuY2U/OiBJQ3VzdG9tQXNzaWdubWVudCk6IElTcGxpdEFzc2lnbm1lbnRbXSB7XHJcbiAgICBjb25zdCBzcGxpdDogSVNwbGl0QXNzaWdubWVudFtdID0gW11cclxuICAgIGlmIChzZXR0aW5ncy5hc3NpZ25tZW50U3BhbiA9PT0gJ211bHRpcGxlJykge1xyXG4gICAgICAgIGNvbnN0IHMgPSBNYXRoLm1heChzdGFydC5nZXRUaW1lKCksIGZyb21EYXRlTnVtKGFzc2lnbm1lbnQuc3RhcnQpLmdldFRpbWUoKSlcclxuICAgICAgICBjb25zdCBlID0gYXNzaWdubWVudC5lbmQgPT09ICdGb3JldmVyJyA/IHMgOiBNYXRoLm1pbihlbmQuZ2V0VGltZSgpLCBmcm9tRGF0ZU51bShhc3NpZ25tZW50LmVuZCkuZ2V0VGltZSgpKVxyXG4gICAgICAgIGNvbnN0IHNwYW4gPSAoKGUgLSBzKSAvIDEwMDAgLyAzNjAwIC8gMjQpICsgMSAvLyBOdW1iZXIgb2YgZGF5cyBhc3NpZ25tZW50IHRha2VzIHVwXHJcbiAgICAgICAgY29uc3Qgc3BhblJlbGF0aXZlID0gNiAtIChuZXcgRGF0ZShzKSkuZ2V0RGF5KCkgLy8gTnVtYmVyIG9mIGRheXMgdW50aWwgdGhlIG5leHQgU2F0dXJkYXlcclxuXHJcbiAgICAgICAgY29uc3QgbnMgPSBuZXcgRGF0ZShzKVxyXG4gICAgICAgIG5zLnNldERhdGUobnMuZ2V0RGF0ZSgpICsgc3BhblJlbGF0aXZlKSAvLyAgVGhlIGRhdGUgb2YgdGhlIG5leHQgU2F0dXJkYXlcclxuXHJcbiAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lIG5vLWxvb3BzXHJcbiAgICAgICAgZm9yIChsZXQgbiA9IC02OyBuIDwgc3BhbiAtIHNwYW5SZWxhdGl2ZTsgbiArPSA3KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGxhc3RTdW4gPSBuZXcgRGF0ZShucylcclxuICAgICAgICAgICAgbGFzdFN1bi5zZXREYXRlKGxhc3RTdW4uZ2V0RGF0ZSgpICsgbilcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG5leHRTYXQgPSBuZXcgRGF0ZShsYXN0U3VuKVxyXG4gICAgICAgICAgICBuZXh0U2F0LnNldERhdGUobmV4dFNhdC5nZXREYXRlKCkgKyA2KVxyXG4gICAgICAgICAgICBzcGxpdC5wdXNoKHtcclxuICAgICAgICAgICAgICAgIGFzc2lnbm1lbnQsXHJcbiAgICAgICAgICAgICAgICBzdGFydDogbmV3IERhdGUoTWF0aC5tYXgocywgbGFzdFN1bi5nZXRUaW1lKCkpKSxcclxuICAgICAgICAgICAgICAgIGVuZDogbmV3IERhdGUoTWF0aC5taW4oZSwgbmV4dFNhdC5nZXRUaW1lKCkpKSxcclxuICAgICAgICAgICAgICAgIGN1c3RvbTogQm9vbGVhbihyZWZlcmVuY2UpLFxyXG4gICAgICAgICAgICAgICAgcmVmZXJlbmNlXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChzZXR0aW5ncy5hc3NpZ25tZW50U3BhbiA9PT0gJ3N0YXJ0Jykge1xyXG4gICAgICAgIGNvbnN0IHMgPSBmcm9tRGF0ZU51bShhc3NpZ25tZW50LnN0YXJ0KVxyXG4gICAgICAgIGlmIChzLmdldFRpbWUoKSA+PSBzdGFydC5nZXRUaW1lKCkpIHtcclxuICAgICAgICAgICAgc3BsaXQucHVzaCh7XHJcbiAgICAgICAgICAgICAgICBhc3NpZ25tZW50LFxyXG4gICAgICAgICAgICAgICAgc3RhcnQ6IHMsXHJcbiAgICAgICAgICAgICAgICBlbmQ6IHMsXHJcbiAgICAgICAgICAgICAgICBjdXN0b206IEJvb2xlYW4ocmVmZXJlbmNlKSxcclxuICAgICAgICAgICAgICAgIHJlZmVyZW5jZVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAoc2V0dGluZ3MuYXNzaWdubWVudFNwYW4gPT09ICdlbmQnKSB7XHJcbiAgICAgICAgY29uc3QgZSA9IGFzc2lnbm1lbnQuZW5kID09PSAnRm9yZXZlcicgPyBhc3NpZ25tZW50LmVuZCA6IGZyb21EYXRlTnVtKGFzc2lnbm1lbnQuZW5kKVxyXG4gICAgICAgIGNvbnN0IGRlID0gZSA9PT0gJ0ZvcmV2ZXInID8gZnJvbURhdGVOdW0oYXNzaWdubWVudC5zdGFydCkgOiBlXHJcbiAgICAgICAgaWYgKGRlLmdldFRpbWUoKSA8PSBlbmQuZ2V0VGltZSgpKSB7XHJcbiAgICAgICAgICAgIHNwbGl0LnB1c2goe1xyXG4gICAgICAgICAgICAgICAgYXNzaWdubWVudCxcclxuICAgICAgICAgICAgICAgIHN0YXJ0OiBkZSxcclxuICAgICAgICAgICAgICAgIGVuZDogZSxcclxuICAgICAgICAgICAgICAgIGN1c3RvbTogQm9vbGVhbihyZWZlcmVuY2UpLFxyXG4gICAgICAgICAgICAgICAgcmVmZXJlbmNlXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBzcGxpdFxyXG59XHJcblxyXG4vLyBUaGlzIGZ1bmN0aW9uIHdpbGwgY29udmVydCB0aGUgYXJyYXkgb2YgYXNzaWdubWVudHMgZ2VuZXJhdGVkIGJ5ICpwYXJzZSogaW50byByZWFkYWJsZSBIVE1MLlxyXG5leHBvcnQgZnVuY3Rpb24gZGlzcGxheShkb1Njcm9sbDogYm9vbGVhbiA9IHRydWUpOiB2b2lkIHtcclxuICAgIGNvbnNvbGUudGltZSgnRGlzcGxheWluZyBkYXRhJylcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgZGF0YSA9IGdldERhdGEoKVxyXG4gICAgICAgIGlmICghZGF0YSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0RhdGEgc2hvdWxkIGhhdmUgYmVlbiBmZXRjaGVkIGJlZm9yZSBkaXNwbGF5KCkgd2FzIGNhbGxlZCcpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkb2N1bWVudC5ib2R5LnNldEF0dHJpYnV0ZSgnZGF0YS1wY3J2aWV3JywgZGF0YS5tb250aFZpZXcgPyAnbW9udGgnIDogJ290aGVyJylcclxuICAgICAgICBjb25zdCBtYWluID0gXyQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbWFpbicpKVxyXG4gICAgICAgIGNvbnN0IHRha2VuOiB7IFtkYXRlOiBudW1iZXJdOiBudW1iZXJbXSB9ID0ge31cclxuXHJcbiAgICAgICAgY29uc3QgdGltZWFmdGVyID0gZ2V0VGltZUFmdGVyKG5ldyBEYXRlKCkpXHJcblxyXG4gICAgICAgIGNvbnN0IHtzdGFydCwgZW5kfSA9IGdldFN0YXJ0RW5kRGF0ZXMoZGF0YSlcclxuXHJcbiAgICAgICAgLy8gU2V0IHRoZSBzdGFydCBkYXRlIHRvIGJlIGEgU3VuZGF5IGFuZCB0aGUgZW5kIGRhdGUgdG8gYmUgYSBTYXR1cmRheVxyXG4gICAgICAgIHN0YXJ0LnNldERhdGUoc3RhcnQuZ2V0RGF0ZSgpIC0gc3RhcnQuZ2V0RGF5KCkpXHJcbiAgICAgICAgZW5kLnNldERhdGUoZW5kLmdldERhdGUoKSArICg2IC0gZW5kLmdldERheSgpKSlcclxuXHJcbiAgICAgICAgLy8gRmlyc3QgcG9wdWxhdGUgdGhlIGNhbGVuZGFyIHdpdGggYm94ZXMgZm9yIGVhY2ggZGF5XHJcbiAgICAgICAgY29uc3QgbGFzdERhdGEgPSBsb2NhbFN0b3JhZ2VSZWFkKCdkYXRhJykgYXMgSUFwcGxpY2F0aW9uRGF0YVxyXG4gICAgICAgIGxldCB3azogSFRNTEVsZW1lbnR8bnVsbCA9IG51bGxcclxuICAgICAgICBpdGVyRGF5cyhzdGFydCwgZW5kLCAoZCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZC5nZXREYXkoKSA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaWQgPSBgd2ske2QuZ2V0TW9udGgoKX0tJHtkLmdldERhdGUoKX1gIC8vIERvbid0IGNyZWF0ZSBhIG5ldyB3ZWVrIGVsZW1lbnQgaWYgb25lIGFscmVhZHkgZXhpc3RzXHJcbiAgICAgICAgICAgICAgICB3ayA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKVxyXG4gICAgICAgICAgICAgICAgaWYgKHdrID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICB3ayA9IGNyZWF0ZVdlZWsoaWQpXHJcbiAgICAgICAgICAgICAgICAgICAgbWFpbi5hcHBlbmRDaGlsZCh3aylcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCF3aykgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCB3ZWVrIGVsZW1lbnQgb24gZGF5ICR7ZH0gdG8gbm90IGJlIG51bGxgKVxyXG4gICAgICAgICAgICBpZiAod2suZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnZGF5JykubGVuZ3RoIDw9IGQuZ2V0RGF5KCkpIHtcclxuICAgICAgICAgICAgICAgIHdrLmFwcGVuZENoaWxkKGNyZWF0ZURheShkKSlcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGFrZW5bZC5nZXRUaW1lKCldID0gW11cclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICAvLyBTcGxpdCBhc3NpZ25tZW50cyB0YWtpbmcgbW9yZSB0aGFuIDEgd2Vla1xyXG4gICAgICAgIGNvbnN0IHNwbGl0OiBJU3BsaXRBc3NpZ25tZW50W10gPSBbXVxyXG4gICAgICAgIGRhdGEuYXNzaWdubWVudHMuZm9yRWFjaCgoYXNzaWdubWVudCwgbnVtKSA9PiB7XHJcbiAgICAgICAgICAgIHNwbGl0LnB1c2goLi4uZ2V0QXNzaWdubWVudFNwbGl0cyhhc3NpZ25tZW50LCBzdGFydCwgZW5kKSlcclxuXHJcbiAgICAgICAgICAgIC8vIEFjdGl2aXR5IHN0dWZmXHJcbiAgICAgICAgICAgIGlmIChsYXN0RGF0YSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBvbGRBc3NpZ25tZW50ID0gbGFzdERhdGEuYXNzaWdubWVudHMuZmluZCgoYSkgPT4gYS5pZCA9PT0gYXNzaWdubWVudC5pZClcclxuICAgICAgICAgICAgICAgIGlmIChvbGRBc3NpZ25tZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9sZEFzc2lnbm1lbnQuYm9keSAhPT0gYXNzaWdubWVudC5ib2R5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkZEFjdGl2aXR5KCdlZGl0Jywgb2xkQXNzaWdubWVudCwgbmV3IERhdGUoKSwgdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2xkQXNzaWdubWVudC5jbGFzcyAhPSBudWxsID8gbGFzdERhdGEuY2xhc3Nlc1tvbGRBc3NpZ25tZW50LmNsYXNzXSA6IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlRnJvbU1vZGlmaWVkKGFzc2lnbm1lbnQuaWQpIC8vIElmIHRoZSBhc3NpZ25tZW50IGlzIG1vZGlmaWVkLCByZXNldCBpdFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBsYXN0RGF0YS5hc3NpZ25tZW50cy5zcGxpY2UobGFzdERhdGEuYXNzaWdubWVudHMuaW5kZXhPZihvbGRBc3NpZ25tZW50KSwgMSlcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWRkQWN0aXZpdHkoJ2FkZCcsIGFzc2lnbm1lbnQsIG5ldyBEYXRlKCksIHRydWUpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICBpZiAobGFzdERhdGEgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAvLyBDaGVjayBpZiBhbnkgb2YgdGhlIGxhc3QgYXNzaWdubWVudHMgd2VyZW4ndCBkZWxldGVkIChzbyB0aGV5IGhhdmUgYmVlbiBkZWxldGVkIGluIFBDUilcclxuICAgICAgICAgICAgbGFzdERhdGEuYXNzaWdubWVudHMuZm9yRWFjaCgoYXNzaWdubWVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgYWRkQWN0aXZpdHkoJ2RlbGV0ZScsIGFzc2lnbm1lbnQsIG5ldyBEYXRlKCksIHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhc3NpZ25tZW50LmNsYXNzICE9IG51bGwgPyBsYXN0RGF0YS5jbGFzc2VzW2Fzc2lnbm1lbnQuY2xhc3NdIDogdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgcmVtb3ZlRnJvbURvbmUoYXNzaWdubWVudC5pZClcclxuICAgICAgICAgICAgICAgIHJlbW92ZUZyb21Nb2RpZmllZChhc3NpZ25tZW50LmlkKVxyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgLy8gVGhlbiBzYXZlIGEgbWF4aW11bSBvZiAxMjggYWN0aXZpdHkgaXRlbXNcclxuICAgICAgICAgICAgc2F2ZUFjdGl2aXR5KClcclxuXHJcbiAgICAgICAgICAgIC8vIEFuZCBjb21wbGV0ZWQgYXNzaWdubWVudHMgKyBtb2RpZmljYXRpb25zXHJcbiAgICAgICAgICAgIHNhdmVEb25lKClcclxuICAgICAgICAgICAgc2F2ZU1vZGlmaWVkKClcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEFkZCBjdXN0b20gYXNzaWdubWVudHMgdG8gdGhlIHNwbGl0IGFycmF5XHJcbiAgICAgICAgZ2V0RXh0cmEoKS5mb3JFYWNoKChjdXN0b20pID0+IHtcclxuICAgICAgICAgICAgc3BsaXQucHVzaCguLi5nZXRBc3NpZ25tZW50U3BsaXRzKGV4dHJhVG9UYXNrKGN1c3RvbSwgZGF0YSksIHN0YXJ0LCBlbmQsIGN1c3RvbSkpXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgLy8gQ2FsY3VsYXRlIHRoZSB0b2RheSdzIHdlZWsgaWRcclxuICAgICAgICBjb25zdCB0ZHN0ID0gbmV3IERhdGUoKVxyXG4gICAgICAgIHRkc3Quc2V0RGF0ZSh0ZHN0LmdldERhdGUoKSAtIHRkc3QuZ2V0RGF5KCkpXHJcbiAgICAgICAgY29uc3QgdG9kYXlXa0lkID0gYHdrJHt0ZHN0LmdldE1vbnRoKCl9LSR7dGRzdC5nZXREYXRlKCl9YFxyXG5cclxuICAgICAgICAvLyBUaGVuIGFkZCBhc3NpZ25tZW50c1xyXG4gICAgICAgIGNvbnN0IHdlZWtIZWlnaHRzOiB7IFt3ZWVrSWQ6IHN0cmluZ106IG51bWJlciB9ID0ge31cclxuICAgICAgICBjb25zdCBwcmV2aW91c0Fzc2lnbm1lbnRzOiB7IFtpZDogc3RyaW5nXTogSFRNTEVsZW1lbnQgfSA9IHt9XHJcbiAgICAgICAgQXJyYXkucHJvdG90eXBlLmZvckVhY2guY2FsbChkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdhc3NpZ25tZW50JyksIChhc3NpZ25tZW50OiBIVE1MRWxlbWVudCkgPT4ge1xyXG4gICAgICAgICAgICBwcmV2aW91c0Fzc2lnbm1lbnRzW2Fzc2lnbm1lbnQuaWRdID0gYXNzaWdubWVudFxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIHNwbGl0LmZvckVhY2goKHMpID0+IHtcclxuICAgICAgICAgICAgY29uc3Qgd2Vla0lkID0gY29tcHV0ZVdlZWtJZChzKVxyXG4gICAgICAgICAgICB3ayA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHdlZWtJZClcclxuICAgICAgICAgICAgaWYgKHdrID09IG51bGwpIHJldHVyblxyXG5cclxuICAgICAgICAgICAgY29uc3QgZSA9IGNyZWF0ZUFzc2lnbm1lbnQocywgZGF0YSlcclxuXHJcbiAgICAgICAgICAgIC8vIENhbGN1bGF0ZSBob3cgbWFueSBhc3NpZ25tZW50cyBhcmUgcGxhY2VkIGJlZm9yZSB0aGUgY3VycmVudCBvbmVcclxuICAgICAgICAgICAgaWYgKCFzLmN1c3RvbSB8fCAhc2V0dGluZ3Muc2VwVGFza3MpIHtcclxuICAgICAgICAgICAgICAgIGxldCBwb3MgPSAwXHJcbiAgICAgICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmUgbm8tbG9vcHNcclxuICAgICAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZvdW5kID0gdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgIGl0ZXJEYXlzKHMuc3RhcnQsIHMuZW5kID09PSAnRm9yZXZlcicgPyBzLnN0YXJ0IDogcy5lbmQsIChkKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0YWtlbltkLmdldFRpbWUoKV0uaW5kZXhPZihwb3MpICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm91bmQgPSBmYWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZm91bmQpIHsgYnJlYWsgfVxyXG4gICAgICAgICAgICAgICAgICAgIHBvcysrXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gQXBwZW5kIHRoZSBwb3NpdGlvbiB0aGUgYXNzaWdubWVudCBpcyBhdCB0byB0aGUgdGFrZW4gYXJyYXlcclxuICAgICAgICAgICAgICAgIGl0ZXJEYXlzKHMuc3RhcnQsIHMuZW5kID09PSAnRm9yZXZlcicgPyBzLnN0YXJ0IDogcy5lbmQsIChkKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFrZW5bZC5nZXRUaW1lKCldLnB1c2gocG9zKVxyXG4gICAgICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBDYWxjdWxhdGUgaG93IGZhciBkb3duIHRoZSBhc3NpZ25tZW50IG11c3QgYmUgcGxhY2VkIGFzIHRvIG5vdCBibG9jayB0aGUgb25lcyBhYm92ZSBpdFxyXG4gICAgICAgICAgICAgICAgZS5zdHlsZS5tYXJnaW5Ub3AgPSAocG9zICogMzApICsgJ3B4J1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICgod2Vla0hlaWdodHNbd2Vla0lkXSA9PSBudWxsKSB8fCAocG9zID4gd2Vla0hlaWdodHNbd2Vla0lkXSkpIHtcclxuICAgICAgICAgICAgICAgICAgICB3ZWVrSGVpZ2h0c1t3ZWVrSWRdID0gcG9zXHJcbiAgICAgICAgICAgICAgICAgICAgd2suc3R5bGUuaGVpZ2h0ID0gNDcgKyAoKHBvcyArIDEpICogMzApICsgJ3B4J1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBJZiB0aGUgYXNzaWdubWVudCBpcyBhIHRlc3QgYW5kIGlzIHVwY29taW5nLCBhZGQgaXQgdG8gdGhlIHVwY29taW5nIHRlc3RzIHBhbmVsLlxyXG4gICAgICAgICAgICBpZiAocy5hc3NpZ25tZW50LmVuZCA+PSB0b2RheSgpICYmIChzLmFzc2lnbm1lbnQuYmFzZVR5cGUgPT09ICd0ZXN0JyB8fFxyXG4gICAgICAgICAgICAgICAgKHNldHRpbmdzLnByb2plY3RzSW5UZXN0UGFuZSAmJiBzLmFzc2lnbm1lbnQuYmFzZVR5cGUgPT09ICdsb25ndGVybScpKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGUgPSBlbGVtZW50KCdkaXYnLCBbJ3VwY29taW5nVGVzdCcsICdhc3NpZ25tZW50SXRlbScsIHMuYXNzaWdubWVudC5iYXNlVHlwZV0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYDxpIGNsYXNzPSdtYXRlcmlhbC1pY29ucyc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke3MuYXNzaWdubWVudC5iYXNlVHlwZSA9PT0gJ2xvbmd0ZXJtJyA/ICdhc3NpZ25tZW50JyA6ICdhc3Nlc3NtZW50J31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9pPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz0ndGl0bGUnPiR7cy5hc3NpZ25tZW50LnRpdGxlfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNtYWxsPiR7c2VwYXJhdGVkQ2xhc3Mocy5hc3NpZ25tZW50LCBkYXRhKVsyXX08L3NtYWxsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPSdyYW5nZSc+JHtkYXRlU3RyaW5nKHMuYXNzaWdubWVudC5lbmQsIHRydWUpfTwvZGl2PmAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYHRlc3Qke3MuYXNzaWdubWVudC5pZH1gKVxyXG4gICAgICAgICAgICAgICAgaWYgKHMuYXNzaWdubWVudC5jbGFzcykgdGUuc2V0QXR0cmlidXRlKCdkYXRhLWNsYXNzJywgZGF0YS5jbGFzc2VzW3MuYXNzaWdubWVudC5jbGFzc10pXHJcbiAgICAgICAgICAgICAgICB0ZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkb1Njcm9sbGluZyA9IGFzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgc21vb3RoU2Nyb2xsKChlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCArIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wKSAtIDExNilcclxuICAgICAgICAgICAgICAgICAgICAgICAgZS5jbGljaygpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkb2N1bWVudC5ib2R5LmdldEF0dHJpYnV0ZSgnZGF0YS12aWV3JykgPT09ICcwJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb1Njcm9sbGluZygpXHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXyQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI25hdlRhYnM+bGk6Zmlyc3QtY2hpbGQnKSBhcyBIVE1MRWxlbWVudCkuY2xpY2soKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGRvU2Nyb2xsaW5nLCA1MDApXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoYXNzaWdubWVudEluRG9uZShzLmFzc2lnbm1lbnQuaWQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGUuY2xhc3NMaXN0LmFkZCgnZG9uZScpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0ZXN0RWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGB0ZXN0JHtzLmFzc2lnbm1lbnQuaWR9YClcclxuICAgICAgICAgICAgICAgIGlmICh0ZXN0RWxlbSkge1xyXG4gICAgICAgICAgICAgICAgdGVzdEVsZW0uaW5uZXJIVE1MID0gdGUuaW5uZXJIVE1MXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1CeUlkKCdpbmZvVGVzdHMnKS5hcHBlbmRDaGlsZCh0ZSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgYWxyZWFkeSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHMuYXNzaWdubWVudC5pZCArIHdlZWtJZClcclxuICAgICAgICAgICAgaWYgKGFscmVhZHkgIT0gbnVsbCkgeyAvLyBBc3NpZ25tZW50IGFscmVhZHkgZXhpc3RzXHJcbiAgICAgICAgICAgICAgICBhbHJlYWR5LnN0eWxlLm1hcmdpblRvcCA9IGUuc3R5bGUubWFyZ2luVG9wXHJcbiAgICAgICAgICAgICAgICBhbHJlYWR5LnNldEF0dHJpYnV0ZSgnZGF0YS1jbGFzcycsXHJcbiAgICAgICAgICAgICAgICAgICAgcy5jdXN0b20gJiYgc2V0dGluZ3Muc2VwVGFza0NsYXNzID8gJ1Rhc2snIDogY2xhc3NCeUlkKHMuYXNzaWdubWVudC5jbGFzcykpXHJcbiAgICAgICAgICAgICAgICBpZiAoIWFzc2lnbm1lbnRJbk1vZGlmaWVkKHMuYXNzaWdubWVudC5pZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBhbHJlYWR5LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2JvZHknKVswXS5pbm5lckhUTUwgPSBlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2JvZHknKVswXS5pbm5lckhUTUxcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF8kKGFscmVhZHkucXVlcnlTZWxlY3RvcignLmVkaXRzJykpLmNsYXNzTmFtZSA9IF8kKGUucXVlcnlTZWxlY3RvcignLmVkaXRzJykpLmNsYXNzTmFtZVxyXG4gICAgICAgICAgICAgICAgaWYgKGFscmVhZHkuY2xhc3NMaXN0LnRvZ2dsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFscmVhZHkuY2xhc3NMaXN0LnRvZ2dsZSgnbGlzdERpc3AnLCBlLmNsYXNzTGlzdC5jb250YWlucygnbGlzdERpc3AnKSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGdldEVTKGFscmVhZHkpLmZvckVhY2goKGNsKSA9PiBhbHJlYWR5LmNsYXNzTGlzdC5yZW1vdmUoY2wpKVxyXG4gICAgICAgICAgICAgICAgZ2V0RVMoZSkuZm9yRWFjaCgoY2wpID0+IGFscmVhZHkuY2xhc3NMaXN0LmFkZChjbCkpXHJcbiAgICAgICAgICAgICAgICBXRUVLRU5EX0NMQVNTTkFNRVMuZm9yRWFjaCgoY2wpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBhbHJlYWR5LmNsYXNzTGlzdC5yZW1vdmUoY2wpXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUuY2xhc3NMaXN0LmNvbnRhaW5zKGNsKSkgYWxyZWFkeS5jbGFzc0xpc3QuYWRkKGNsKVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChzLmN1c3RvbSAmJiBzZXR0aW5ncy5zZXBUYXNrcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHN0ID0gTWF0aC5mbG9vcihzLnN0YXJ0LmdldFRpbWUoKSAvIDEwMDAgLyAzNjAwIC8gMjQpXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKChzLmFzc2lnbm1lbnQuc3RhcnQgPT09IHN0KSAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAocy5hc3NpZ25tZW50LmVuZCA9PT0gJ0ZvcmV2ZXInIHx8IHMuYXNzaWdubWVudC5lbmQgPj0gdG9kYXkoKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZS5jbGFzc0xpc3QucmVtb3ZlKCdhc3NpZ25tZW50JylcclxuICAgICAgICAgICAgICAgICAgICAgICAgZS5jbGFzc0xpc3QuYWRkKCd0YXNrUGFuZUl0ZW0nKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlLnN0eWxlLm9yZGVyID0gU3RyaW5nKHMuYXNzaWdubWVudC5lbmQgPT09ICdGb3JldmVyJyA/IE51bWJlci5NQVhfVkFMVUUgOiBzLmFzc2lnbm1lbnQuZW5kKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBsaW5rID0gZS5xdWVyeVNlbGVjdG9yKCcubGlua2VkJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxpbmspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUuaW5zZXJ0QmVmb3JlKGVsZW1lbnQoJ3NtYWxsJywgW10sIGxpbmsuaW5uZXJIVE1MKSwgbGluaylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmsucmVtb3ZlKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtQnlJZCgnaW5mb1Rhc2tzSW5uZXInKS5hcHBlbmRDaGlsZChlKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7IHdrLmFwcGVuZENoaWxkKGUpIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBkZWxldGUgcHJldmlvdXNBc3NpZ25tZW50c1tzLmFzc2lnbm1lbnQuaWQgKyB3ZWVrSWRdXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgLy8gRGVsZXRlIGFueSBhc3NpZ25tZW50cyB0aGF0IGhhdmUgYmVlbiBkZWxldGVkIHNpbmNlIHVwZGF0aW5nXHJcbiAgICAgICAgT2JqZWN0LmVudHJpZXMocHJldmlvdXNBc3NpZ25tZW50cykuZm9yRWFjaCgoW25hbWUsIGFzc2lnbm1lbnRdKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChhc3NpZ25tZW50LmNsYXNzTGlzdC5jb250YWlucygnZnVsbCcpKSB7XHJcbiAgICAgICAgICAgICAgICBlbGVtQnlJZCgnYmFja2dyb3VuZCcpLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYXNzaWdubWVudC5yZW1vdmUoKVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIC8vIFNjcm9sbCB0byB0aGUgY29ycmVjdCBwb3NpdGlvbiBpbiBjYWxlbmRhciB2aWV3XHJcbiAgICAgICAgaWYgKHdlZWtIZWlnaHRzW3RvZGF5V2tJZF0gIT0gbnVsbCkge1xyXG4gICAgICAgICAgICBsZXQgaCA9IDBcclxuICAgICAgICAgICAgY29uc3Qgc3cgPSAod2tpZDogc3RyaW5nKSA9PiB3a2lkLnN1YnN0cmluZygyKS5zcGxpdCgnLScpLm1hcCgoeCkgPT4gTnVtYmVyKHgpKVxyXG4gICAgICAgICAgICBjb25zdCB0b2RheVdrID0gc3codG9kYXlXa0lkKVxyXG4gICAgICAgICAgICBPYmplY3QuZW50cmllcyh3ZWVrSGVpZ2h0cykuZm9yRWFjaCgoW3drSWQsIHZhbF0pID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHdrU3BsaXQgPSBzdyh3a0lkKVxyXG4gICAgICAgICAgICAgICAgaWYgKCh3a1NwbGl0WzBdIDwgdG9kYXlXa1swXSkgfHwgKCh3a1NwbGl0WzBdID09PSB0b2RheVdrWzBdKSAmJiAod2tTcGxpdFsxXSA8IHRvZGF5V2tbMV0pKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGggKz0gdmFsXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIHNjcm9sbCA9IChoICogMzApICsgMTEyICsgMTRcclxuICAgICAgICAgICAgLy8gQWxzbyBzaG93IHRoZSBkYXkgaGVhZGVycyBpZiB0b2RheSdzIGRhdGUgaXMgZGlzcGxheWVkIGluIHRoZSBmaXJzdCByb3cgb2YgdGhlIGNhbGVuZGFyXHJcbiAgICAgICAgICAgIGlmIChzY3JvbGwgPCA1MCkgc2Nyb2xsID0gMFxyXG4gICAgICAgICAgICBpZiAoZG9TY3JvbGwgJiYgKGRvY3VtZW50LmJvZHkuZ2V0QXR0cmlidXRlKCdkYXRhLXZpZXcnKSA9PT0gJzAnKSAmJlxyXG4gICAgICAgICAgICAgICAgIWRvY3VtZW50LmJvZHkucXVlcnlTZWxlY3RvcignLmZ1bGwnKSkge1xyXG4gICAgICAgICAgICAgICAgLy8gaW4gY2FsZW5kYXIgdmlld1xyXG4gICAgICAgICAgICAgICAgd2luZG93LnNjcm9sbFRvKDAsIHNjcm9sbClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QudG9nZ2xlKCdub0xpc3QnLFxyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYXNzaWdubWVudC5saXN0RGlzcDpub3QoLmRvbmUpJykubGVuZ3RoID09PSAwKVxyXG4gICAgICAgIGlmIChkb2N1bWVudC5ib2R5LmdldEF0dHJpYnV0ZSgnZGF0YS12aWV3JykgPT09ICcxJykgeyAvLyBpbiBsaXN0IHZpZXdcclxuICAgICAgICAgICAgcmVzaXplKClcclxuICAgICAgICB9XHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICBkaXNwbGF5RXJyb3IoZXJyKVxyXG4gICAgfVxyXG4gICAgY29uc29sZS50aW1lRW5kKCdEaXNwbGF5aW5nIGRhdGEnKVxyXG59XHJcblxyXG4vLyBUaGUgZnVuY3Rpb24gYmVsb3cgY29udmVydHMgYW4gdXBkYXRlIHRpbWUgdG8gYSBodW1hbi1yZWFkYWJsZSBkYXRlLlxyXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0VXBkYXRlKGRhdGU6IG51bWJlcik6IHN0cmluZyB7XHJcbiAgY29uc3Qgbm93ID0gbmV3IERhdGUoKVxyXG4gIGNvbnN0IHVwZGF0ZSA9IG5ldyBEYXRlKCtkYXRlKVxyXG4gIGlmIChub3cuZ2V0RGF0ZSgpID09PSB1cGRhdGUuZ2V0RGF0ZSgpKSB7XHJcbiAgICBsZXQgYW1wbSA9ICdBTSdcclxuICAgIGxldCBociA9IHVwZGF0ZS5nZXRIb3VycygpXHJcbiAgICBpZiAoaHIgPiAxMikge1xyXG4gICAgICBhbXBtID0gJ1BNJ1xyXG4gICAgICBociAtPSAxMlxyXG4gICAgfVxyXG4gICAgY29uc3QgbWluID0gdXBkYXRlLmdldE1pbnV0ZXMoKVxyXG4gICAgcmV0dXJuIGBUb2RheSBhdCAke2hyfToke21pbiA8IDEwID8gYDAke21pbn1gIDogbWlufSAke2FtcG19YFxyXG4gIH0gZWxzZSB7XHJcbiAgICBjb25zdCBkYXlzUGFzdCA9IE1hdGguY2VpbCgobm93LmdldFRpbWUoKSAtIHVwZGF0ZS5nZXRUaW1lKCkpIC8gMTAwMCAvIDM2MDAgLyAyNClcclxuICAgIGlmIChkYXlzUGFzdCA9PT0gMSkgeyByZXR1cm4gJ1llc3RlcmRheScgfSBlbHNlIHsgcmV0dXJuIGRheXNQYXN0ICsgJyBkYXlzIGFnbycgfVxyXG4gIH1cclxufVxyXG4iLCJsZXQgbGlzdERhdGVPZmZzZXQgPSAwXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0TGlzdERhdGVPZmZzZXQoKTogbnVtYmVyIHtcclxuICAgIHJldHVybiBsaXN0RGF0ZU9mZnNldFxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gemVyb0xpc3REYXRlT2Zmc2V0KCk6IHZvaWQge1xyXG4gICAgbGlzdERhdGVPZmZzZXQgPSAwXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpbmNyZW1lbnRMaXN0RGF0ZU9mZnNldCgpOiB2b2lkIHtcclxuICAgIGxpc3REYXRlT2Zmc2V0ICs9IDFcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRlY3JlbWVudExpc3REYXRlT2Zmc2V0KCk6IHZvaWQge1xyXG4gICAgbGlzdERhdGVPZmZzZXQgLT0gMVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2V0TGlzdERhdGVPZmZzZXQob2Zmc2V0OiBudW1iZXIpOiB2b2lkIHtcclxuICAgIGxpc3REYXRlT2Zmc2V0ID0gb2Zmc2V0XHJcbn1cclxuIiwiLyoqXHJcbiAqIFRoaXMgbW9kdWxlIGNvbnRhaW5zIGNvZGUgdG8gYm90aCBmZXRjaCBhbmQgcGFyc2UgYXNzaWdubWVudHMgZnJvbSBQQ1IuXHJcbiAqL1xyXG5pbXBvcnQgeyB1cGRhdGVBdmF0YXIgfSBmcm9tICcuL2NvbXBvbmVudHMvYXZhdGFyJ1xyXG5pbXBvcnQgeyBkaXNwbGF5RXJyb3IgfSBmcm9tICcuL2NvbXBvbmVudHMvZXJyb3JEaXNwbGF5J1xyXG5pbXBvcnQgeyBzbmFja2JhciB9IGZyb20gJy4vY29tcG9uZW50cy9zbmFja2JhcidcclxuaW1wb3J0IHsgZGVsZXRlQ29va2llLCBnZXRDb29raWUsIHNldENvb2tpZSB9IGZyb20gJy4vY29va2llcydcclxuaW1wb3J0IHsgdG9EYXRlTnVtIH0gZnJvbSAnLi9kYXRlcydcclxuaW1wb3J0IHsgZGlzcGxheSwgZm9ybWF0VXBkYXRlIH0gZnJvbSAnLi9kaXNwbGF5J1xyXG5pbXBvcnQgeyBfJCwgZWxlbUJ5SWQsIGxvY2FsU3RvcmFnZVdyaXRlLCBzZW5kIH0gZnJvbSAnLi91dGlsJ1xyXG5cclxuY29uc3QgUENSX1VSTCA9ICdodHRwczovL3dlYmFwcHNjYS5wY3Jzb2Z0LmNvbSdcclxuY29uc3QgQVNTSUdOTUVOVFNfVVJMID0gYCR7UENSX1VSTH0vQ2x1ZS9TQy1Bc3NpZ25tZW50cy1FbmQtRGF0ZS1SYW5nZS83NTM2YFxyXG5jb25zdCBMT0dJTl9VUkwgPSBgJHtQQ1JfVVJMfS9DbHVlL1NDLVN0dWRlbnQtUG9ydGFsLUxvZ2luLUxEQVAvODQ2ND9yZXR1cm5Vcmw9JHtlbmNvZGVVUklDb21wb25lbnQoQVNTSUdOTUVOVFNfVVJMKX1gXHJcbmNvbnN0IEFUVEFDSE1FTlRTX1VSTCA9IGAke1BDUl9VUkx9L0NsdWUvQ29tbW9uL0F0dGFjaG1lbnRSZW5kZXIuYXNweGBcclxuY29uc3QgRk9STV9IRUFERVJfT05MWSA9IHsgJ0NvbnRlbnQtdHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnIH1cclxuY29uc3QgT05FX01JTlVURV9NUyA9IDYwMDAwXHJcblxyXG5jb25zdCBwcm9ncmVzc0VsZW1lbnQgPSBlbGVtQnlJZCgncHJvZ3Jlc3MnKVxyXG5jb25zdCBsb2dpbkRpYWxvZyA9IGVsZW1CeUlkKCdsb2dpbicpXHJcbmNvbnN0IGxvZ2luQmFja2dyb3VuZCA9IGVsZW1CeUlkKCdsb2dpbkJhY2tncm91bmQnKVxyXG5jb25zdCBsYXN0VXBkYXRlRWwgPSBlbGVtQnlJZCgnbGFzdFVwZGF0ZScpXHJcbmNvbnN0IHVzZXJuYW1lRWwgPSBlbGVtQnlJZCgndXNlcm5hbWUnKSBhcyBIVE1MSW5wdXRFbGVtZW50XHJcbmNvbnN0IHBhc3N3b3JkRWwgPSBlbGVtQnlJZCgncGFzc3dvcmQnKSBhcyBIVE1MSW5wdXRFbGVtZW50XHJcbmNvbnN0IHJlbWVtYmVyQ2hlY2sgPSBlbGVtQnlJZCgncmVtZW1iZXInKSBhcyBIVE1MSW5wdXRFbGVtZW50XHJcbmNvbnN0IGluY29ycmVjdExvZ2luRWwgPSBlbGVtQnlJZCgnbG9naW5JbmNvcnJlY3QnKVxyXG5cclxuLy8gVE9ETyBrZWVwaW5nIHRoZXNlIGFzIGEgZ2xvYmFsIHZhcnMgaXMgYmFkXHJcbmNvbnN0IGxvZ2luSGVhZGVyczoge1toZWFkZXI6IHN0cmluZ106IHN0cmluZ30gPSB7fVxyXG5jb25zdCB2aWV3RGF0YToge1toYWRlcjogc3RyaW5nXTogc3RyaW5nfSA9IHt9XHJcbmxldCBsYXN0VXBkYXRlID0gMCAvLyBUaGUgbGFzdCB0aW1lIGV2ZXJ5dGhpbmcgd2FzIHVwZGF0ZWRcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUFwcGxpY2F0aW9uRGF0YSB7XHJcbiAgICBjbGFzc2VzOiBzdHJpbmdbXVxyXG4gICAgYXNzaWdubWVudHM6IElBc3NpZ25tZW50W11cclxuICAgIG1vbnRoVmlldzogYm9vbGVhblxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElBc3NpZ25tZW50IHtcclxuICAgIHN0YXJ0OiBudW1iZXJcclxuICAgIGVuZDogbnVtYmVyfCdGb3JldmVyJ1xyXG4gICAgYXR0YWNobWVudHM6IEF0dGFjaG1lbnRBcnJheVtdXHJcbiAgICBib2R5OiBzdHJpbmdcclxuICAgIHR5cGU6IHN0cmluZ1xyXG4gICAgYmFzZVR5cGU6IHN0cmluZ1xyXG4gICAgY2xhc3M6IG51bWJlcnxudWxsLFxyXG4gICAgdGl0bGU6IHN0cmluZ1xyXG4gICAgaWQ6IHN0cmluZ1xyXG59XHJcblxyXG5leHBvcnQgdHlwZSBBdHRhY2htZW50QXJyYXkgPSBbc3RyaW5nLCBzdHJpbmddXHJcblxyXG4vLyBUaGlzIGlzIHRoZSBmdW5jdGlvbiB0aGF0IHJldHJpZXZlcyB5b3VyIGFzc2lnbm1lbnRzIGZyb20gUENSLlxyXG4vL1xyXG4vLyBGaXJzdCwgYSByZXF1ZXN0IGlzIHNlbnQgdG8gUENSIHRvIGxvYWQgdGhlIHBhZ2UgeW91IHdvdWxkIG5vcm1hbGx5IHNlZSB3aGVuIGFjY2Vzc2luZyBQQ1IuXHJcbi8vXHJcbi8vIEJlY2F1c2UgdGhpcyBpcyBydW4gYXMgYSBjaHJvbWUgZXh0ZW5zaW9uLCB0aGlzIHBhZ2UgY2FuIGJlIGFjY2Vzc2VkLiBPdGhlcndpc2UsIHRoZSBicm93c2VyXHJcbi8vIHdvdWxkIHRocm93IGFuIGVycm9yIGZvciBzZWN1cml0eSByZWFzb25zICh5b3UgZG9uJ3Qgd2FudCBhIHJhbmRvbSB3ZWJzaXRlIGJlaW5nIGFibGUgdG8gYWNjZXNzXHJcbi8vIGNvbmZpZGVudGlhbCBkYXRhIGZyb20gYSB3ZWJzaXRlIHlvdSBoYXZlIGxvZ2dlZCBpbnRvKS5cclxuXHJcbi8qKlxyXG4gKiBGZXRjaGVzIGRhdGEgZnJvbSBQQ1IgYW5kIGlmIHRoZSB1c2VyIGlzIGxvZ2dlZCBpbiBwYXJzZXMgYW5kIGRpc3BsYXlzIGl0XHJcbiAqIEBwYXJhbSBvdmVycmlkZSBXaGV0aGVyIHRvIGZvcmNlIGFuIHVwZGF0ZSBldmVuIHRoZXJlIHdhcyBvbmUgcmVjZW50bHlcclxuICogQHBhcmFtIGRhdGEgIE9wdGlvbmFsIGRhdGEgdG8gYmUgcG9zdGVkIHRvIFBDUlxyXG4gKi9cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZldGNoKG92ZXJyaWRlOiBib29sZWFuID0gZmFsc2UsIGRhdGE/OiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIGlmICghb3ZlcnJpZGUgJiYgRGF0ZS5ub3coKSAtIGxhc3RVcGRhdGUgPCBPTkVfTUlOVVRFX01TKSByZXR1cm5cclxuICAgIGxhc3RVcGRhdGUgPSBEYXRlLm5vdygpXHJcblxyXG4gICAgY29uc3QgaGVhZGVycyA9IGRhdGEgPyBGT1JNX0hFQURFUl9PTkxZIDogdW5kZWZpbmVkXHJcbiAgICBjb25zb2xlLnRpbWUoJ0ZldGNoaW5nIGFzc2lnbm1lbnRzJylcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcmVzcCA9IGF3YWl0IHNlbmQoQVNTSUdOTUVOVFNfVVJMLCAnZG9jdW1lbnQnLCBoZWFkZXJzLCBkYXRhLCBwcm9ncmVzc0VsZW1lbnQpXHJcbiAgICAgICAgY29uc29sZS50aW1lRW5kKCdGZXRjaGluZyBhc3NpZ25tZW50cycpXHJcbiAgICAgICAgaWYgKHJlc3AucmVzcG9uc2VVUkwuaW5kZXhPZignTG9naW4nKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgLy8gV2UgaGF2ZSB0byBsb2cgaW4gbm93XHJcbiAgICAgICAgICAgIChyZXNwLnJlc3BvbnNlIGFzIEhUTUxEb2N1bWVudCkuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2lucHV0JykuZm9yRWFjaCgoZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbG9naW5IZWFkZXJzW2UubmFtZV0gPSBlLnZhbHVlIHx8ICcnXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdOZWVkIHRvIGxvZyBpbicpXHJcbiAgICAgICAgICAgIGNvbnN0IHVwID0gZ2V0Q29va2llKCd1c2VyUGFzcycpIC8vIEF0dGVtcHRzIHRvIGdldCB0aGUgY29va2llICp1c2VyUGFzcyosIHdoaWNoIGlzIHNldCBpZiB0aGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gXCJSZW1lbWJlciBtZVwiIGNoZWNrYm94IGlzIGNoZWNrZWQgd2hlbiBsb2dnaW5nIGluIHRocm91Z2ggQ2hlY2tQQ1JcclxuICAgICAgICAgICAgaWYgKHVwID09PSAnJykge1xyXG4gICAgICAgICAgICAgICAgbG9naW5CYWNrZ3JvdW5kLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXHJcbiAgICAgICAgICAgICAgICBsb2dpbkRpYWxvZy5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gQmVjYXVzZSB3ZSB3ZXJlIHJlbWVtYmVyZWQsIHdlIGNhbiBsb2cgaW4gaW1tZWRpYXRlbHkgd2l0aG91dCB3YWl0aW5nIGZvciB0aGVcclxuICAgICAgICAgICAgICAgIC8vIHVzZXIgdG8gbG9nIGluIHRocm91Z2ggdGhlIGxvZ2luIGZvcm1cclxuICAgICAgICAgICAgICAgIGRvbG9naW4od2luZG93LmF0b2IodXApLnNwbGl0KCc6JykgYXMgW3N0cmluZywgc3RyaW5nXSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIExvZ2dlZCBpbiBub3dcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ0ZldGNoaW5nIGFzc2lnbm1lbnRzIHN1Y2Nlc3NmdWwnKVxyXG4gICAgICAgICAgICBjb25zdCB0ID0gRGF0ZS5ub3coKVxyXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2UubGFzdFVwZGF0ZSA9IHRcclxuICAgICAgICAgICAgbGFzdFVwZGF0ZUVsLmlubmVySFRNTCA9IGZvcm1hdFVwZGF0ZSh0KVxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgcGFyc2UocmVzcC5yZXNwb25zZSlcclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKVxyXG4gICAgICAgICAgICAgICAgZGlzcGxheUVycm9yKGVycm9yKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnQ291bGQgbm90IGZldGNoIGFzc2lnbm1lbnRzOyBZb3UgYXJlIHByb2JhYmx5IG9mZmxpbmUuIEhlcmVcXCdzIHRoZSBlcnJvcjonLCBlcnJvcilcclxuICAgICAgICBzbmFja2JhcignQ291bGQgbm90IGZldGNoIHlvdXIgYXNzaWdubWVudHMnLCAnUmV0cnknLCAoKSA9PiBmZXRjaCh0cnVlKSlcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIExvZ3MgdGhlIHVzZXIgaW50byBQQ1JcclxuICogQHBhcmFtIHZhbCAgIEFuIG9wdGlvbmFsIGxlbmd0aC0yIGFycmF5IG9mIHRoZSBmb3JtIFt1c2VybmFtZSwgcGFzc3dvcmRdIHRvIHVzZSB0aGUgdXNlciBpbiB3aXRoLlxyXG4gKiAgICAgICAgICAgICAgSWYgdGhpcyBhcnJheSBpcyBub3QgZ2l2ZW4gdGhlIGxvZ2luIGRpYWxvZyBpbnB1dHMgd2lsbCBiZSB1c2VkLlxyXG4gKiBAcGFyYW0gc3VibWl0RXZ0IFdoZXRoZXIgdG8gb3ZlcnJpZGUgdGhlIHVzZXJuYW1lIGFuZCBwYXNzd29yZCBzdXBwbGVpZCBpbiB2YWwgd2l0aCB0aGUgdmFsdWVzIG9mIHRoZSBpbnB1dCBlbGVtZW50c1xyXG4gKi9cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRvbG9naW4odmFsPzogW3N0cmluZywgc3RyaW5nXXxudWxsLCBzdWJtaXRFdnQ6IGJvb2xlYW4gPSBmYWxzZSk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgbG9naW5EaWFsb2cuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcclxuICAgIHNldFRpbWVvdXQoKCkgPT4gbG9naW5CYWNrZ3JvdW5kLnN0eWxlLmRpc3BsYXkgPSAnbm9uZScsIDM1MClcclxuXHJcbiAgICBjb25zdCBwb3N0QXJyYXk6IHN0cmluZ1tdID0gW10gLy8gQXJyYXkgb2YgZGF0YSB0byBwb3N0XHJcbiAgICBsb2NhbFN0b3JhZ2VXcml0ZSgndXNlcm5hbWUnLCB2YWwgJiYgIXN1Ym1pdEV2dCA/IHZhbFswXSA6IHVzZXJuYW1lRWwudmFsdWUpXHJcbiAgICB1cGRhdGVBdmF0YXIoKVxyXG4gICAgT2JqZWN0LmtleXMobG9naW5IZWFkZXJzKS5mb3JFYWNoKChoKSA9PiAge1xyXG4gICAgICAgIC8vIExvb3AgdGhyb3VnaCB0aGUgaW5wdXQgZWxlbWVudHMgY29udGFpbmVkIGluIHRoZSBsb2dpbiBwYWdlLiBBcyBtZW50aW9uZWQgYmVmb3JlLCB0aGV5XHJcbiAgICAgICAgLy8gd2lsbCBiZSBzZW50IHRvIFBDUiB0byBsb2cgaW4uXHJcbiAgICAgICAgaWYgKGgudG9Mb3dlckNhc2UoKS5pbmRleE9mKCd1c2VyJykgIT09IC0xKSB7XHJcbiAgICAgICAgICAgIGxvZ2luSGVhZGVyc1toXSA9IHZhbCAmJiAhc3VibWl0RXZ0ID8gdmFsWzBdIDogdXNlcm5hbWVFbC52YWx1ZVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaC50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ3Bhc3MnKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgbG9naW5IZWFkZXJzW2hdID0gdmFsICYmICFzdWJtaXRFdnQgPyB2YWxbMV0gOiBwYXNzd29yZEVsLnZhbHVlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBvc3RBcnJheS5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChoKSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudChsb2dpbkhlYWRlcnNbaF0pKVxyXG4gICAgfSlcclxuXHJcbiAgICAvLyBOb3cgc2VuZCB0aGUgbG9naW4gcmVxdWVzdCB0byBQQ1JcclxuICAgIGNvbnNvbGUudGltZSgnTG9nZ2luZyBpbicpXHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHJlc3AgPSBhd2FpdCBzZW5kKExPR0lOX1VSTCwgJ2RvY3VtZW50JywgRk9STV9IRUFERVJfT05MWSwgcG9zdEFycmF5LmpvaW4oJyYnKSwgcHJvZ3Jlc3NFbGVtZW50KVxyXG4gICAgICAgIGNvbnNvbGUudGltZUVuZCgnTG9nZ2luZyBpbicpXHJcbiAgICAgICAgaWYgKHJlc3AucmVzcG9uc2VVUkwuaW5kZXhPZignTG9naW4nKSAhPT0gLTEpIHtcclxuICAgICAgICAvLyBJZiBQQ1Igc3RpbGwgd2FudHMgdXMgdG8gbG9nIGluLCB0aGVuIHRoZSB1c2VybmFtZSBvciBwYXNzd29yZCBlbnRlcmVkIHdlcmUgaW5jb3JyZWN0LlxyXG4gICAgICAgICAgICBpbmNvcnJlY3RMb2dpbkVsLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXHJcbiAgICAgICAgICAgIHBhc3N3b3JkRWwudmFsdWUgPSAnJ1xyXG5cclxuICAgICAgICAgICAgbG9naW5EaWFsb2cuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuICAgICAgICAgICAgbG9naW5CYWNrZ3JvdW5kLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gT3RoZXJ3aXNlLCB3ZSBhcmUgbG9nZ2VkIGluXHJcbiAgICAgICAgICAgIGlmIChyZW1lbWJlckNoZWNrLmNoZWNrZWQpIHsgLy8gSXMgdGhlIFwicmVtZW1iZXIgbWVcIiBjaGVja2JveCBjaGVja2VkP1xyXG4gICAgICAgICAgICAgICAgLy8gU2V0IGEgY29va2llIHdpdGggdGhlIHVzZXJuYW1lIGFuZCBwYXNzd29yZCBzbyB3ZSBjYW4gbG9nIGluIGF1dG9tYXRpY2FsbHkgaW4gdGhlXHJcbiAgICAgICAgICAgICAgICAvLyBmdXR1cmUgd2l0aG91dCBoYXZpbmcgdG8gcHJvbXB0IGZvciBhIHVzZXJuYW1lIGFuZCBwYXNzd29yZCBhZ2FpblxyXG4gICAgICAgICAgICAgICAgc2V0Q29va2llKCd1c2VyUGFzcycsIHdpbmRvdy5idG9hKHVzZXJuYW1lRWwudmFsdWUgKyAnOicgKyBwYXNzd29yZEVsLnZhbHVlKSwgMTQpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gbG9hZGluZ0Jhci5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCJcclxuICAgICAgICAgICAgY29uc3QgdCA9IERhdGUubm93KClcclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLmxhc3RVcGRhdGUgPSB0XHJcbiAgICAgICAgICAgIGxhc3RVcGRhdGVFbC5pbm5lckhUTUwgPSBmb3JtYXRVcGRhdGUodClcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIHBhcnNlKHJlc3AucmVzcG9uc2UpIC8vIFBhcnNlIHRoZSBkYXRhIFBDUiBoYXMgcmVwbGllZCB3aXRoXHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpXHJcbiAgICAgICAgICAgICAgICBkaXNwbGF5RXJyb3IoZSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgIGNvbnNvbGUubG9nKCdDb3VsZCBub3QgbG9nIGluIHRvIFBDUi4gRWl0aGVyIHlvdXIgbmV0d29yayBjb25uZWN0aW9uIHdhcyBsb3N0IGR1cmluZyB5b3VyIHZpc2l0ICcgK1xyXG4gICAgICAgICAgICAgICAgICAgICAnb3IgUENSIGlzIGp1c3Qgbm90IHdvcmtpbmcuIEhlcmVcXCdzIHRoZSBlcnJvcjonLCBlcnJvcilcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldERhdGEoKTogSUFwcGxpY2F0aW9uRGF0YXx1bmRlZmluZWQge1xyXG4gICAgcmV0dXJuICh3aW5kb3cgYXMgYW55KS5kYXRhXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRDbGFzc2VzKCk6IHN0cmluZ1tdIHtcclxuICAgIGNvbnN0IGRhdGEgPSBnZXREYXRhKClcclxuICAgIGlmICghZGF0YSkgcmV0dXJuIFtdXHJcbiAgICByZXR1cm4gZGF0YS5jbGFzc2VzXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXREYXRhKGRhdGE6IElBcHBsaWNhdGlvbkRhdGEpOiB2b2lkIHtcclxuICAgICh3aW5kb3cgYXMgYW55KS5kYXRhID0gZGF0YVxyXG59XHJcblxyXG4vLyBJbiBQQ1IncyBpbnRlcmZhY2UsIHlvdSBjYW4gY2xpY2sgYSBkYXRlIGluIG1vbnRoIG9yIHdlZWsgdmlldyB0byBzZWUgaXQgaW4gZGF5IHZpZXcuXHJcbi8vIFRoZXJlZm9yZSwgdGhlIEhUTUwgZWxlbWVudCB0aGF0IHNob3dzIHRoZSBkYXRlIHRoYXQgeW91IGNhbiBjbGljayBvbiBoYXMgYSBoeXBlcmxpbmsgdGhhdCBsb29rcyBsaWtlIGAjMjAxNS0wNC0yNmAuXHJcbi8vIFRoZSBmdW5jdGlvbiBiZWxvdyB3aWxsIHBhcnNlIHRoYXQgU3RyaW5nIGFuZCByZXR1cm4gYSBEYXRlIHRpbWVzdGFtcFxyXG5mdW5jdGlvbiBwYXJzZURhdGVIYXNoKGVsZW1lbnQ6IEhUTUxBbmNob3JFbGVtZW50KTogbnVtYmVyIHtcclxuICAgIGNvbnN0IFt5ZWFyLCBtb250aCwgZGF5XSA9IGVsZW1lbnQuaGFzaC5zdWJzdHJpbmcoMSkuc3BsaXQoJy0nKS5tYXAoTnVtYmVyKVxyXG4gICAgcmV0dXJuIChuZXcgRGF0ZSh5ZWFyLCBtb250aCAtIDEsIGRheSkpLmdldFRpbWUoKVxyXG59XHJcblxyXG4vLyBUaGUgKmF0dGFjaG1lbnRpZnkqIGZ1bmN0aW9uIHBhcnNlcyB0aGUgYm9keSBvZiBhbiBhc3NpZ25tZW50ICgqdGV4dCopIGFuZCByZXR1cm5zIHRoZSBhc3NpZ25tZW50J3MgYXR0YWNobWVudHMuXHJcbmZ1bmN0aW9uIGF0dGFjaG1lbnRpZnkoZWxlbWVudDogSFRNTEVsZW1lbnQpOiBBdHRhY2htZW50QXJyYXlbXSB7XHJcbiAgICBjb25zdCBhdHRhY2htZW50czogQXR0YWNobWVudEFycmF5W10gPSBbXVxyXG5cclxuICAgIC8vIEdldCBhbGwgbGlua3NcclxuICAgIGNvbnN0IGFzID0gQXJyYXkuZnJvbShlbGVtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdhJykpXHJcbiAgICBhcy5mb3JFYWNoKChhKSA9PiB7XHJcbiAgICAgICAgaWYgKGEuaWQuaW5jbHVkZXMoJ0F0dGFjaG1lbnQnKSkge1xyXG4gICAgICAgICAgICBhdHRhY2htZW50cy5wdXNoKFtcclxuICAgICAgICAgICAgICAgIGEuaW5uZXJIVE1MLFxyXG4gICAgICAgICAgICAgICAgYS5zZWFyY2ggKyBhLmhhc2hcclxuICAgICAgICAgICAgXSlcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICAgcmV0dXJuIGF0dGFjaG1lbnRzXHJcbn1cclxuXHJcbi8vIFRoaXMgZnVuY3Rpb24gcmVwbGFjZXMgdGV4dCB0aGF0IHJlcHJlc2VudHMgYSBoeXBlcmxpbmsgd2l0aCBhIGZ1bmN0aW9uYWwgaHlwZXJsaW5rIGJ5IHVzaW5nXHJcbi8vIGphdmFzY3JpcHQncyByZXBsYWNlIGZ1bmN0aW9uIHdpdGggYSByZWd1bGFyIGV4cHJlc3Npb24gaWYgdGhlIHRleHQgYWxyZWFkeSBpc24ndCBwYXJ0IG9mIGFcclxuLy8gaHlwZXJsaW5rLlxyXG5mdW5jdGlvbiB1cmxpZnkodGV4dDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0ZXh0LnJlcGxhY2UobmV3IFJlZ0V4cChgKFxcXHJcbiAgICAgICAgaHR0cHM/OlxcXFwvXFxcXC9cXFxyXG4gICAgICAgIFstQS1aMC05KyZAI1xcXFwvJT89fl98ITosLjtdKlxcXHJcbiAgICAgICAgWy1BLVowLTkrJkAjXFxcXC8lPX5ffF0rXFxcclxuICAgICAgICApYCwgJ2lnJ1xyXG4gICAgKSwgKHN0ciwgc3RyMiwgb2Zmc2V0KSA9PiB7IC8vIEZ1bmN0aW9uIHRvIHJlcGxhY2UgbWF0Y2hlc1xyXG4gICAgICAgIGlmICgvaHJlZlxccyo9XFxzKi4vLnRlc3QodGV4dC5zdWJzdHJpbmcob2Zmc2V0IC0gMTAsIG9mZnNldCkpIHx8XHJcbiAgICAgICAgICAgIC9vcmlnaW5hbHBhdGhcXHMqPVxccyouLy50ZXN0KHRleHQuc3Vic3RyaW5nKG9mZnNldCAtIDIwLCBvZmZzZXQpKVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICByZXR1cm4gc3RyXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGA8YSBocmVmPVwiJHtzdHJ9XCI+JHtzdHJ9PC9hPmBcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59XHJcblxyXG4vLyBBbHNvLCBQQ1JcInMgaW50ZXJmYWNlIHVzZXMgYSBzeXN0ZW0gb2YgSURzIHRvIGlkZW50aWZ5IGRpZmZlcmVudCBlbGVtZW50cy4gRm9yIGV4YW1wbGUsIHRoZSBJRCBvZlxyXG4vLyBvbmUgb2YgdGhlIGJveGVzIHNob3dpbmcgdGhlIG5hbWUgb2YgYW4gYXNzaWdubWVudCBjb3VsZCBiZVxyXG4vLyBgY3RsMDBfY3RsMDBfYmFzZUNvbnRlbnRfYmFzZUNvbnRlbnRfZmxhc2hUb3BfY3RsMDBfUmFkU2NoZWR1bGVyMV85NV8wYC4gVGhlIGZ1bmN0aW9uIGJlbG93IHdpbGxcclxuLy8gcmV0dXJuIHRoZSBmaXJzdCBIVE1MIGVsZW1lbnQgd2hvc2UgSUQgY29udGFpbnMgYSBzcGVjaWZpZWQgU3RyaW5nICgqaWQqKSBhbmQgY29udGFpbmluZyBhXHJcbi8vIHNwZWNpZmllZCB0YWcgKCp0YWcqKS5cclxuZnVuY3Rpb24gZmluZElkKGVsZW1lbnQ6IEhUTUxFbGVtZW50fEhUTUxEb2N1bWVudCwgdGFnOiBzdHJpbmcsIGlkOiBzdHJpbmcpOiBIVE1MRWxlbWVudCB7XHJcbiAgICBjb25zdCBlbCA9IFsuLi5lbGVtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKHRhZyldLmZpbmQoKGUpID0+IGUuaWQuaW5jbHVkZXMoaWQpKVxyXG4gICAgaWYgKCFlbCkgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCBlbGVtZW50IHdpdGggdGFnICR7dGFnfSBhbmQgaWQgJHtpZH0gaW4gJHtlbGVtZW50fWApXHJcbiAgICByZXR1cm4gZWwgYXMgSFRNTEVsZW1lbnRcclxufVxyXG5cclxuZnVuY3Rpb24gcGFyc2VBc3NpZ25tZW50VHlwZSh0eXBlOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHR5cGUudG9Mb3dlckNhc2UoKS5yZXBsYWNlKCcmIHF1aXp6ZXMnLCAnJykucmVwbGFjZSgndGVzdHMnLCAndGVzdCcpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBhcnNlQXNzaWdubWVudEJhc2VUeXBlKHR5cGU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdHlwZS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoJyYgcXVpenplcycsICcnKS5yZXBsYWNlKC9cXHMvZywgJycpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBhcnNlQXNzaWdubWVudChjYTogSFRNTEVsZW1lbnQpOiBJQXNzaWdubWVudCB7XHJcbiAgICBjb25zdCBkYXRhID0gZ2V0RGF0YSgpXHJcbiAgICBpZiAoIWRhdGEpIHRocm93IG5ldyBFcnJvcignRGF0YSBkaWN0aW9uYXJ5IG5vdCBzZXQgdXAnKVxyXG5cclxuICAgIC8vIFRoZSBzdGFydGluZyBkYXRlIGFuZCBlbmRpbmcgZGF0ZSBvZiB0aGUgYXNzaWdubWVudCBhcmUgcGFyc2VkIGZpcnN0XHJcbiAgICBjb25zdCByYW5nZSA9IGZpbmRJZChjYSwgJ3NwYW4nLCAnU3RhcnRpbmdPbicpLmlubmVySFRNTC5zcGxpdCgnIC0gJylcclxuICAgIGNvbnN0IGFzc2lnbm1lbnRTdGFydCA9IHRvRGF0ZU51bShEYXRlLnBhcnNlKHJhbmdlWzBdKSlcclxuICAgIGNvbnN0IGFzc2lnbm1lbnRFbmQgPSAocmFuZ2VbMV0gIT0gbnVsbCkgPyB0b0RhdGVOdW0oRGF0ZS5wYXJzZShyYW5nZVsxXSkpIDogYXNzaWdubWVudFN0YXJ0XHJcblxyXG4gICAgLy8gVGhlbiwgdGhlIG5hbWUgb2YgdGhlIGFzc2lnbm1lbnQgaXMgcGFyc2VkXHJcbiAgICBjb25zdCB0ID0gZmluZElkKGNhLCAnc3BhbicsICdsYmxUaXRsZScpXHJcbiAgICBsZXQgdGl0bGUgPSB0LmlubmVySFRNTFxyXG5cclxuICAgIC8vIFRoZSBhY3R1YWwgYm9keSBvZiB0aGUgYXNzaWdubWVudCBhbmQgaXRzIGF0dGFjaG1lbnRzIGFyZSBwYXJzZWQgbmV4dFxyXG4gICAgY29uc3QgYiA9IF8kKF8kKHQucGFyZW50Tm9kZSkucGFyZW50Tm9kZSkgYXMgSFRNTEVsZW1lbnRcclxuICAgIFsuLi5iLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdkaXYnKV0uc2xpY2UoMCwgMikuZm9yRWFjaCgoZGl2KSA9PiBkaXYucmVtb3ZlKCkpXHJcblxyXG4gICAgY29uc3QgYXAgPSBhdHRhY2htZW50aWZ5KGIpIC8vIFNlcGFyYXRlcyBhdHRhY2htZW50cyBmcm9tIHRoZSBib2R5XHJcblxyXG4gICAgLy8gVGhlIGxhc3QgUmVwbGFjZSByZW1vdmVzIGxlYWRpbmcgYW5kIHRyYWlsaW5nIG5ld2xpbmVzXHJcbiAgICBjb25zdCBhc3NpZ25tZW50Qm9keSA9IHVybGlmeShiLmlubmVySFRNTClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9eKD86XFxzKjxiclxccypcXC8/PikqLywgJycpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvKD86XFxzKjxiclxccypcXC8/PikqXFxzKiQvLCAnJykudHJpbSgpXHJcblxyXG4gICAgLy8gRmluYWxseSwgd2Ugc2VwYXJhdGUgdGhlIGNsYXNzIG5hbWUgYW5kIHR5cGUgKGhvbWV3b3JrLCBjbGFzc3dvcmssIG9yIHByb2plY3RzKSBmcm9tIHRoZSB0aXRsZSBvZiB0aGUgYXNzaWdubWVudFxyXG4gICAgY29uc3QgbWF0Y2hlZFRpdGxlID0gdGl0bGUubWF0Y2goL1xcKChbXildKlxcKSopXFwpJC8pXHJcbiAgICBpZiAoKG1hdGNoZWRUaXRsZSA9PSBudWxsKSkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IHBhcnNlIGFzc2lnbm1lbnQgdGl0bGUgXFxcIiR7dGl0bGV9XFxcImApXHJcbiAgICB9XHJcbiAgICBjb25zdCBhc3NpZ25tZW50VHlwZSA9IG1hdGNoZWRUaXRsZVsxXVxyXG4gICAgY29uc3QgYXNzaWdubWVudEJhc2VUeXBlID0gcGFyc2VBc3NpZ25tZW50QmFzZVR5cGUoY2EudGl0bGUuc3Vic3RyaW5nKDAsIGNhLnRpdGxlLmluZGV4T2YoJ1xcbicpKSlcclxuICAgIGxldCBhc3NpZ25tZW50Q2xhc3NJbmRleCA9IG51bGxcclxuICAgIGRhdGEuY2xhc3Nlcy5zb21lKChjLCBwb3MpID0+IHtcclxuICAgICAgICBpZiAodGl0bGUuaW5kZXhPZihjKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgYXNzaWdubWVudENsYXNzSW5kZXggPSBwb3NcclxuICAgICAgICAgICAgdGl0bGUgPSB0aXRsZS5yZXBsYWNlKGMsICcnKVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgIH0pXHJcblxyXG4gICAgaWYgKGFzc2lnbm1lbnRDbGFzc0luZGV4ID09PSBudWxsIHx8IGFzc2lnbm1lbnRDbGFzc0luZGV4ID09PSAtMSkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGZpbmQgY2xhc3MgaW4gdGl0bGUgJHt0aXRsZX0gKGNsYXNzZXMgYXJlICR7ZGF0YS5jbGFzc2VzfWApXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgYXNzaWdubWVudFRpdGxlID0gdGl0bGUuc3Vic3RyaW5nKHRpdGxlLmluZGV4T2YoJzogJykgKyAyKS5yZXBsYWNlKC9cXChbXlxcKFxcKV0qXFwpJC8sICcnKS50cmltKClcclxuXHJcbiAgICAvLyBUbyBtYWtlIHN1cmUgdGhlcmUgYXJlIG5vIHJlcGVhdHMsIHRoZSB0aXRsZSBvZiB0aGUgYXNzaWdubWVudCAob25seSBsZXR0ZXJzKSBhbmQgaXRzIHN0YXJ0ICZcclxuICAgIC8vIGVuZCBkYXRlIGFyZSBjb21iaW5lZCB0byBnaXZlIGl0IGEgdW5pcXVlIGlkZW50aWZpZXIuXHJcbiAgICBjb25zdCBhc3NpZ25tZW50SWQgPSBhc3NpZ25tZW50VGl0bGUucmVwbGFjZSgvW15cXHddKi9nLCAnJykgKyAoYXNzaWdubWVudFN0YXJ0ICsgYXNzaWdubWVudEVuZClcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHN0YXJ0OiBhc3NpZ25tZW50U3RhcnQsXHJcbiAgICAgICAgZW5kOiBhc3NpZ25tZW50RW5kLFxyXG4gICAgICAgIGF0dGFjaG1lbnRzOiBhcCxcclxuICAgICAgICBib2R5OiBhc3NpZ25tZW50Qm9keSxcclxuICAgICAgICB0eXBlOiBhc3NpZ25tZW50VHlwZSxcclxuICAgICAgICBiYXNlVHlwZTogYXNzaWdubWVudEJhc2VUeXBlLFxyXG4gICAgICAgIGNsYXNzOiBhc3NpZ25tZW50Q2xhc3NJbmRleCxcclxuICAgICAgICB0aXRsZTogYXNzaWdubWVudFRpdGxlLFxyXG4gICAgICAgIGlkOiBhc3NpZ25tZW50SWRcclxuICAgIH1cclxufVxyXG5cclxuLy8gVGhlIGZ1bmN0aW9uIGJlbG93IHdpbGwgcGFyc2UgdGhlIGRhdGEgZ2l2ZW4gYnkgUENSIGFuZCBjb252ZXJ0IGl0IGludG8gYW4gb2JqZWN0LiBJZiB5b3Ugb3BlbiB1cFxyXG4vLyB0aGUgZGV2ZWxvcGVyIGNvbnNvbGUgb24gQ2hlY2tQQ1IgYW5kIHR5cGUgaW4gYGRhdGFgLCB5b3UgY2FuIHNlZSB0aGUgYXJyYXkgY29udGFpbmluZyBhbGwgb2ZcclxuLy8geW91ciBhc3NpZ25tZW50cy5cclxuZnVuY3Rpb24gcGFyc2UoZG9jOiBIVE1MRG9jdW1lbnQpOiB2b2lkIHtcclxuICAgIGNvbnNvbGUudGltZSgnSGFuZGxpbmcgZGF0YScpIC8vIFRvIHRpbWUgaG93IGxvbmcgaXQgdGFrZXMgdG8gcGFyc2UgdGhlIGFzc2lnbm1lbnRzXHJcbiAgICBjb25zdCBoYW5kbGVkRGF0YVNob3J0OiBzdHJpbmdbXSA9IFtdIC8vIEFycmF5IHVzZWQgdG8gbWFrZSBzdXJlIHdlIGRvblwidCBwYXJzZSB0aGUgc2FtZSBhc3NpZ25tZW50IHR3aWNlLlxyXG4gICAgY29uc3QgZGF0YTogSUFwcGxpY2F0aW9uRGF0YSA9IHtcclxuICAgICAgICBjbGFzc2VzOiBbXSxcclxuICAgICAgICBhc3NpZ25tZW50czogW10sXHJcbiAgICAgICAgbW9udGhWaWV3OiAoXyQoZG9jLnF1ZXJ5U2VsZWN0b3IoJy5yc0hlYWRlck1vbnRoJykpLnBhcmVudE5vZGUgYXMgSFRNTEVsZW1lbnQpLmNsYXNzTGlzdC5jb250YWlucygncnNTZWxlY3RlZCcpXHJcbiAgICB9IC8vIFJlc2V0IHRoZSBhcnJheSBpbiB3aGljaCBhbGwgb2YgeW91ciBhc3NpZ25tZW50cyBhcmUgc3RvcmVkIGluLlxyXG4gICAgc2V0RGF0YShkYXRhKVxyXG5cclxuICAgIGRvYy5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dDpub3QoW3R5cGU9XCJzdWJtaXRcIl0pJykuZm9yRWFjaCgoZSkgPT4ge1xyXG4gICAgICAgIHZpZXdEYXRhWyhlIGFzIEhUTUxJbnB1dEVsZW1lbnQpLm5hbWVdID0gKGUgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWUgfHwgJydcclxuICAgIH0pXHJcblxyXG4gICAgLy8gTm93LCB0aGUgY2xhc3NlcyB5b3UgdGFrZSBhcmUgcGFyc2VkICh0aGVzZSBhcmUgdGhlIGNoZWNrYm94ZXMgeW91IHNlZSB1cCB0b3Agd2hlbiBsb29raW5nIGF0IFBDUikuXHJcbiAgICBjb25zdCBjbGFzc2VzID0gZmluZElkKGRvYywgJ3RhYmxlJywgJ2NiQ2xhc3NlcycpLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdsYWJlbCcpXHJcbiAgICBjbGFzc2VzLmZvckVhY2goKGMpID0+IHtcclxuICAgICAgICBkYXRhLmNsYXNzZXMucHVzaChjLmlubmVySFRNTClcclxuICAgIH0pXHJcblxyXG4gICAgY29uc3QgYXNzaWdubWVudHMgPSBkb2MuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgncnNBcHQgcnNBcHRTaW1wbGUnKVxyXG4gICAgQXJyYXkucHJvdG90eXBlLmZvckVhY2guY2FsbChhc3NpZ25tZW50cywgKGFzc2lnbm1lbnRFbDogSFRNTEVsZW1lbnQpID0+IHtcclxuICAgICAgICBjb25zdCBhc3NpZ25tZW50ID0gcGFyc2VBc3NpZ25tZW50KGFzc2lnbm1lbnRFbClcclxuICAgICAgICBpZiAoaGFuZGxlZERhdGFTaG9ydC5pbmRleE9mKGFzc2lnbm1lbnQuaWQpID09PSAtMSkgeyAvLyBNYWtlIHN1cmUgd2UgaGF2ZW4ndCBhbHJlYWR5IHBhcnNlZCB0aGUgYXNzaWdubWVudFxyXG4gICAgICAgICAgICBoYW5kbGVkRGF0YVNob3J0LnB1c2goYXNzaWdubWVudC5pZClcclxuICAgICAgICAgICAgZGF0YS5hc3NpZ25tZW50cy5wdXNoKGFzc2lnbm1lbnQpXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuXHJcbiAgICBjb25zb2xlLnRpbWVFbmQoJ0hhbmRsaW5nIGRhdGEnKVxyXG5cclxuICAgIC8vIE5vdyBhbGxvdyB0aGUgdmlldyB0byBiZSBzd2l0Y2hlZFxyXG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdsb2FkZWQnKVxyXG5cclxuICAgIGRpc3BsYXkoKSAvLyBEaXNwbGF5IHRoZSBkYXRhXHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnZGF0YScsIEpTT04uc3RyaW5naWZ5KGdldERhdGEoKSkpIC8vIFN0b3JlIGZvciBvZmZsaW5lIHVzZVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXJsRm9yQXR0YWNobWVudChzZWFyY2g6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gQVRUQUNITUVOVFNfVVJMICsgc2VhcmNoXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRBdHRhY2htZW50TWltZVR5cGUoc2VhcmNoOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZz4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICBjb25zdCByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKVxyXG4gICAgICAgIHJlcS5vcGVuKCdIRUFEJywgdXJsRm9yQXR0YWNobWVudChzZWFyY2gpKVxyXG4gICAgICAgIHJlcS5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChyZXEuc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHR5cGUgPSByZXEuZ2V0UmVzcG9uc2VIZWFkZXIoJ0NvbnRlbnQtVHlwZScpXHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUodHlwZSlcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcignQ29udGVudCB0eXBlIGlzIG51bGwnKSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXEuc2VuZCgpXHJcbiAgICB9KVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY2xhc3NCeUlkKGlkOiBudW1iZXJ8bnVsbHx1bmRlZmluZWQpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIChpZCA/IGdldENsYXNzZXMoKVtpZF0gOiBudWxsKSB8fCAnVW5rbm93biBjbGFzcydcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHN3aXRjaFZpZXdzKCk6IHZvaWQge1xyXG4gICAgaWYgKE9iamVjdC5rZXlzKHZpZXdEYXRhKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgZWxlbUJ5SWQoJ3NpZGVCYWNrZ3JvdW5kJykuY2xpY2soKVxyXG4gICAgICAgIHZpZXdEYXRhLl9fRVZFTlRUQVJHRVQgPSAnY3RsMDAkY3RsMDAkYmFzZUNvbnRlbnQkYmFzZUNvbnRlbnQkZmxhc2hUb3AkY3RsMDAkUmFkU2NoZWR1bGVyMSdcclxuICAgICAgICB2aWV3RGF0YS5fX0VWRU5UQVJHVU1FTlQgPSBKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgICAgIENvbW1hbmQ6IGBTd2l0Y2hUbyR7ZG9jdW1lbnQuYm9keS5nZXRBdHRyaWJ1dGUoJ2RhdGEtcGNydmlldycpID09PSAnbW9udGgnID8gJ1dlZWsnIDogJ01vbnRoJ31WaWV3YFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgdmlld0RhdGEuY3RsMDBfY3RsMDBfYmFzZUNvbnRlbnRfYmFzZUNvbnRlbnRfZmxhc2hUb3BfY3RsMDBfUmFkU2NoZWR1bGVyMV9DbGllbnRTdGF0ZSA9XHJcbiAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHtzY3JvbGxUb3A6IDAsIHNjcm9sbExlZnQ6IDAsIGlzRGlydHk6IGZhbHNlfSlcclxuICAgICAgICB2aWV3RGF0YS5jdGwwMF9jdGwwMF9SYWRTY3JpcHRNYW5hZ2VyMV9UU00gPSAnOztTeXN0ZW0uV2ViLkV4dGVuc2lvbnMsIFZlcnNpb249NC4wLjAuMCwgQ3VsdHVyZT1uZXV0cmFsLCAnICtcclxuICAgICAgICAgICAgJ1B1YmxpY0tleVRva2VuPTMxYmYzODU2YWQzNjRlMzU6ZW4tVVM6ZDI4NTY4ZDMtZTUzZS00NzA2LTkyOGYtMzc2NTkxMmI2NmNhOmVhNTk3ZDRiOmIyNTM3OGQyJ1xyXG4gICAgICAgIGNvbnN0IHBvc3RBcnJheTogc3RyaW5nW10gPSBbXSAvLyBBcnJheSBvZiBkYXRhIHRvIHBvc3RcclxuICAgICAgICBPYmplY3QuZW50cmllcyh2aWV3RGF0YSkuZm9yRWFjaCgoW2gsIHZdKSA9PiB7XHJcbiAgICAgICAgICAgIHBvc3RBcnJheS5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChoKSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudCh2KSlcclxuICAgICAgICB9KVxyXG4gICAgICAgIGZldGNoKHRydWUsIHBvc3RBcnJheS5qb2luKCcmJykpXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBsb2dvdXQoKTogdm9pZCB7XHJcbiAgICBpZiAoT2JqZWN0LmtleXModmlld0RhdGEpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBkZWxldGVDb29raWUoJ3VzZXJQYXNzJylcclxuICAgICAgICBlbGVtQnlJZCgnc2lkZUJhY2tncm91bmQnKS5jbGljaygpXHJcbiAgICAgICAgdmlld0RhdGEuX19FVkVOVFRBUkdFVCA9ICdjdGwwMCRjdGwwMCRiYXNlQ29udGVudCRMb2dvdXRDb250cm9sMSRMb2dpblN0YXR1czEkY3RsMDAnXHJcbiAgICAgICAgdmlld0RhdGEuX19FVkVOVEFSR1VNRU5UID0gJydcclxuICAgICAgICB2aWV3RGF0YS5jdGwwMF9jdGwwMF9iYXNlQ29udGVudF9iYXNlQ29udGVudF9mbGFzaFRvcF9jdGwwMF9SYWRTY2hlZHVsZXIxX0NsaWVudFN0YXRlID1cclxuICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoe3Njcm9sbFRvcDogMCwgc2Nyb2xsTGVmdDogMCwgaXNEaXJ0eTogZmFsc2V9KVxyXG4gICAgICAgIGNvbnN0IHBvc3RBcnJheTogc3RyaW5nW10gPSBbXSAvLyBBcnJheSBvZiBkYXRhIHRvIHBvc3RcclxuICAgICAgICBPYmplY3QuZW50cmllcyh2aWV3RGF0YSkuZm9yRWFjaCgoW2gsIHZdKSA9PiB7XHJcbiAgICAgICAgICAgIHBvc3RBcnJheS5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChoKSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudCh2KSlcclxuICAgICAgICB9KVxyXG4gICAgICAgIGZldGNoKHRydWUsIHBvc3RBcnJheS5qb2luKCcmJykpXHJcbiAgICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBhZGRBY3Rpdml0eUVsZW1lbnQsIGNyZWF0ZUFjdGl2aXR5IH0gZnJvbSAnLi4vY29tcG9uZW50cy9hY3Rpdml0eSdcclxuaW1wb3J0IHsgSUFzc2lnbm1lbnQgfSBmcm9tICcuLi9wY3InXHJcbmltcG9ydCB7IGxvY2FsU3RvcmFnZVJlYWQsIGxvY2FsU3RvcmFnZVdyaXRlIH0gZnJvbSAnLi4vdXRpbCdcclxuXHJcbmV4cG9ydCB0eXBlIEFjdGl2aXR5VHlwZSA9ICdkZWxldGUnIHwgJ2VkaXQnIHwgJ2FkZCdcclxuZXhwb3J0IHR5cGUgQWN0aXZpdHlJdGVtID0gW0FjdGl2aXR5VHlwZSwgSUFzc2lnbm1lbnQsIG51bWJlciwgc3RyaW5nIHwgdW5kZWZpbmVkXVxyXG5cclxuY29uc3QgQUNUSVZJVFlfU1RPUkFHRV9OQU1FID0gJ2FjdGl2aXR5J1xyXG5cclxubGV0IGFjdGl2aXR5OiBBY3Rpdml0eUl0ZW1bXSA9IGxvY2FsU3RvcmFnZVJlYWQoQUNUSVZJVFlfU1RPUkFHRV9OQU1FKSB8fCBbXVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFkZEFjdGl2aXR5KHR5cGU6IEFjdGl2aXR5VHlwZSwgYXNzaWdubWVudDogSUFzc2lnbm1lbnQsIGRhdGU6IERhdGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdBY3Rpdml0eTogYm9vbGVhbiwgY2xhc3NOYW1lPzogc3RyaW5nICk6IHZvaWQge1xyXG4gICAgaWYgKG5ld0FjdGl2aXR5KSBhY3Rpdml0eS5wdXNoKFt0eXBlLCBhc3NpZ25tZW50LCBEYXRlLm5vdygpLCBjbGFzc05hbWVdKVxyXG4gICAgY29uc3QgZWwgPSBjcmVhdGVBY3Rpdml0eSh0eXBlLCBhc3NpZ25tZW50LCBkYXRlLCBjbGFzc05hbWUpXHJcbiAgICBhZGRBY3Rpdml0eUVsZW1lbnQoZWwpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlQWN0aXZpdHkoKTogdm9pZCB7XHJcbiAgICBhY3Rpdml0eSA9IGFjdGl2aXR5LnNsaWNlKGFjdGl2aXR5Lmxlbmd0aCAtIDEyOCwgYWN0aXZpdHkubGVuZ3RoKVxyXG4gICAgbG9jYWxTdG9yYWdlV3JpdGUoQUNUSVZJVFlfU1RPUkFHRV9OQU1FLCBhY3Rpdml0eSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlY2VudEFjdGl2aXR5KCk6IEFjdGl2aXR5SXRlbVtdIHtcclxuICAgIHJldHVybiBhY3Rpdml0eS5zbGljZShhY3Rpdml0eS5sZW5ndGggLSAzMiwgYWN0aXZpdHkubGVuZ3RoKVxyXG59XHJcbiIsImltcG9ydCB7IGVsZW1CeUlkLCBsb2NhbFN0b3JhZ2VSZWFkLCBsb2NhbFN0b3JhZ2VXcml0ZSB9IGZyb20gJy4uL3V0aWwnXHJcblxyXG5jb25zdCBBVEhFTkFfU1RPUkFHRV9OQU1FID0gJ2F0aGVuYURhdGEnXHJcblxyXG5pbnRlcmZhY2UgSVJhd0F0aGVuYURhdGEge1xyXG4gICAgcmVzcG9uc2VfY29kZTogMjAwXHJcbiAgICBib2R5OiB7XHJcbiAgICAgICAgY291cnNlczoge1xyXG4gICAgICAgICAgICBjb3Vyc2VzOiBJUmF3Q291cnNlW11cclxuICAgICAgICAgICAgc2VjdGlvbnM6IElSYXdTZWN0aW9uW11cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwZXJtaXNzaW9uczogYW55XHJcbn1cclxuXHJcbmludGVyZmFjZSBJUmF3Q291cnNlIHtcclxuICAgIG5pZDogbnVtYmVyXHJcbiAgICBjb3Vyc2VfdGl0bGU6IHN0cmluZ1xyXG4gICAgLy8gVGhlcmUncyBhIGJ1bmNoIG1vcmUgdGhhdCBJJ3ZlIG9taXR0ZWRcclxufVxyXG5cclxuaW50ZXJmYWNlIElSYXdTZWN0aW9uIHtcclxuICAgIGNvdXJzZV9uaWQ6IG51bWJlclxyXG4gICAgbGluazogc3RyaW5nXHJcbiAgICBsb2dvOiBzdHJpbmdcclxuICAgIHNlY3Rpb25fdGl0bGU6IHN0cmluZ1xyXG4gICAgLy8gVGhlcmUncyBhIGJ1bmNoIG1vcmUgdGhhdCBJJ3ZlIG9taXR0ZWRcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJQXRoZW5hRGF0YUl0ZW0ge1xyXG4gICAgbGluazogc3RyaW5nXHJcbiAgICBsb2dvOiBzdHJpbmdcclxuICAgIHBlcmlvZDogc3RyaW5nXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUF0aGVuYURhdGEge1xyXG4gICAgW2Nsczogc3RyaW5nXTogSUF0aGVuYURhdGFJdGVtXHJcbn1cclxuXHJcbmxldCBhdGhlbmFEYXRhOiBJQXRoZW5hRGF0YXxudWxsID0gbG9jYWxTdG9yYWdlUmVhZChBVEhFTkFfU1RPUkFHRV9OQU1FKVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldEF0aGVuYURhdGEoKTogSUF0aGVuYURhdGF8bnVsbCB7XHJcbiAgICByZXR1cm4gYXRoZW5hRGF0YVxyXG59XHJcblxyXG5mdW5jdGlvbiBmb3JtYXRMb2dvKGxvZ286IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gbG9nby5zdWJzdHIoMCwgbG9nby5pbmRleE9mKCdcIiBhbHQ9XCInKSlcclxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKCc8ZGl2IGNsYXNzPVwicHJvZmlsZS1waWN0dXJlXCI+PGltZyBzcmM9XCInLCAnJylcclxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKCd0aW55JywgJ3JlZycpXHJcbn1cclxuXHJcbi8vIE5vdywgdGhlcmUncyB0aGUgc2Nob29sb2d5L2F0aGVuYSBpbnRlZ3JhdGlvbiBzdHVmZi4gRmlyc3QsIHdlIG5lZWQgdG8gY2hlY2sgaWYgaXQncyBiZWVuIG1vcmVcclxuLy8gdGhhbiBhIGRheS4gVGhlcmUncyBubyBwb2ludCBjb25zdGFudGx5IHJldHJpZXZpbmcgY2xhc3NlcyBmcm9tIEF0aGVuYTsgdGhleSBkb250J3QgY2hhbmdlIHRoYXRcclxuLy8gbXVjaC5cclxuXHJcbi8vIFRoZW4sIG9uY2UgdGhlIHZhcmlhYmxlIGZvciB0aGUgbGFzdCBkYXRlIGlzIGluaXRpYWxpemVkLCBpdCdzIHRpbWUgdG8gZ2V0IHRoZSBjbGFzc2VzIGZyb21cclxuLy8gYXRoZW5hLiBMdWNraWx5LCB0aGVyZSdzIHRoaXMgZmlsZSBhdCAvaWFwaS9jb3Vyc2UvYWN0aXZlIC0gYW5kIGl0J3MgaW4gSlNPTiEgTGlmZSBjYW4ndCBiZSBhbnlcclxuLy8gYmV0dGVyISBTZXJpb3VzbHkhIEl0J3MganVzdCB0b28gYmFkIHRoZSBsb2dpbiBwYWdlIGlzbid0IGluIEpTT04uXHJcbmZ1bmN0aW9uIHBhcnNlQXRoZW5hRGF0YShkYXQ6IHN0cmluZyk6IElBdGhlbmFEYXRhfG51bGwge1xyXG4gICAgaWYgKGRhdCA9PT0gJycpIHJldHVybiBudWxsXHJcbiAgICBjb25zdCBkID0gSlNPTi5wYXJzZShkYXQpIGFzIElSYXdBdGhlbmFEYXRhXHJcbiAgICBjb25zdCBhdGhlbmFEYXRhMjogSUF0aGVuYURhdGEgPSB7fVxyXG4gICAgY29uc3QgYWxsQ291cnNlRGV0YWlsczogeyBbbmlkOiBudW1iZXJdOiBJUmF3U2VjdGlvbiB9ID0ge31cclxuICAgIGQuYm9keS5jb3Vyc2VzLnNlY3Rpb25zLmZvckVhY2goKHNlY3Rpb24pID0+IHtcclxuICAgICAgICBhbGxDb3Vyc2VEZXRhaWxzW3NlY3Rpb24uY291cnNlX25pZF0gPSBzZWN0aW9uXHJcbiAgICB9KVxyXG4gICAgZC5ib2R5LmNvdXJzZXMuY291cnNlcy5yZXZlcnNlKCkuZm9yRWFjaCgoY291cnNlKSA9PiB7XHJcbiAgICAgICAgY29uc3QgY291cnNlRGV0YWlscyA9IGFsbENvdXJzZURldGFpbHNbY291cnNlLm5pZF1cclxuICAgICAgICBhdGhlbmFEYXRhMltjb3Vyc2UuY291cnNlX3RpdGxlXSA9IHtcclxuICAgICAgICAgICAgbGluazogYGh0dHBzOi8vYXRoZW5hLmhhcmtlci5vcmcke2NvdXJzZURldGFpbHMubGlua31gLFxyXG4gICAgICAgICAgICBsb2dvOiBmb3JtYXRMb2dvKGNvdXJzZURldGFpbHMubG9nbyksXHJcbiAgICAgICAgICAgIHBlcmlvZDogY291cnNlRGV0YWlscy5zZWN0aW9uX3RpdGxlXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICAgIHJldHVybiBhdGhlbmFEYXRhMlxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlQXRoZW5hRGF0YShkYXRhOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgYXRoZW5hRGF0YSA9IHBhcnNlQXRoZW5hRGF0YShkYXRhKVxyXG4gICAgICAgIGxvY2FsU3RvcmFnZVdyaXRlKEFUSEVOQV9TVE9SQUdFX05BTUUsIGRhdGEpXHJcbiAgICAgICAgZWxlbUJ5SWQoJ2F0aGVuYURhdGFFcnJvcicpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcclxuICAgICAgICBlbGVtQnlJZCgnYXRoZW5hRGF0YVJlZnJlc2gnKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgIGVsZW1CeUlkKCdhdGhlbmFEYXRhRXJyb3InKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xyXG4gICAgICAgIGVsZW1CeUlkKCdhdGhlbmFEYXRhUmVmcmVzaCcpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcclxuICAgICAgICBlbGVtQnlJZCgnYXRoZW5hRGF0YUVycm9yJykuaW5uZXJIVE1MID0gZS5tZXNzYWdlXHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgZ2V0RGF0YSwgSUFwcGxpY2F0aW9uRGF0YSwgSUFzc2lnbm1lbnQgfSBmcm9tICcuLi9wY3InXHJcbmltcG9ydCB7IGxvY2FsU3RvcmFnZVJlYWQsIGxvY2FsU3RvcmFnZVdyaXRlIH0gZnJvbSAnLi4vdXRpbCdcclxuXHJcbmNvbnN0IENVU1RPTV9TVE9SQUdFX05BTUUgPSAnZXh0cmEnXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElDdXN0b21Bc3NpZ25tZW50IHtcclxuICAgIGJvZHk6IHN0cmluZ1xyXG4gICAgZG9uZTogYm9vbGVhblxyXG4gICAgc3RhcnQ6IG51bWJlclxyXG4gICAgY2xhc3M6IHN0cmluZ3xudWxsXHJcbiAgICBlbmQ6IG51bWJlcnwnRm9yZXZlcidcclxufVxyXG5cclxuY29uc3QgZXh0cmE6IElDdXN0b21Bc3NpZ25tZW50W10gPSBsb2NhbFN0b3JhZ2VSZWFkKENVU1RPTV9TVE9SQUdFX05BTUUpIHx8IHt9XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0RXh0cmEoKTogSUN1c3RvbUFzc2lnbm1lbnRbXSB7XHJcbiAgICByZXR1cm4gZXh0cmFcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVFeHRyYSgpOiB2b2lkIHtcclxuICAgIGxvY2FsU3RvcmFnZVdyaXRlKENVU1RPTV9TVE9SQUdFX05BTUUsIGV4dHJhKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYWRkVG9FeHRyYShjdXN0b206IElDdXN0b21Bc3NpZ25tZW50KTogdm9pZCB7XHJcbiAgICBleHRyYS5wdXNoKGN1c3RvbSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUZyb21FeHRyYShjdXN0b206IElDdXN0b21Bc3NpZ25tZW50KTogdm9pZCB7XHJcbiAgICBpZiAoIWV4dHJhLmluY2x1ZGVzKGN1c3RvbSkpIHRocm93IG5ldyBFcnJvcignQ2Fubm90IHJlbW92ZSBjdXN0b20gYXNzaWdubWVudCB0aGF0IGRvZXMgbm90IGV4aXN0JylcclxuICAgIGV4dHJhLnNwbGljZShleHRyYS5pbmRleE9mKGN1c3RvbSksIDEpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBleHRyYVRvVGFzayhjdXN0b206IElDdXN0b21Bc3NpZ25tZW50LCBkYXRhOiBJQXBwbGljYXRpb25EYXRhKTogSUFzc2lnbm1lbnQge1xyXG4gICAgbGV0IGNsczogbnVtYmVyfG51bGwgPSBudWxsXHJcbiAgICBjb25zdCBjbGFzc05hbWUgPSBjdXN0b20uY2xhc3NcclxuICAgIGlmIChjbGFzc05hbWUgIT0gbnVsbCkge1xyXG4gICAgICAgIGNscyA9IGRhdGEuY2xhc3Nlcy5maW5kSW5kZXgoKGMpID0+IGMudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhjbGFzc05hbWUpKVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdGl0bGU6ICdUYXNrJyxcclxuICAgICAgICBiYXNlVHlwZTogJ3Rhc2snLFxyXG4gICAgICAgIHR5cGU6ICd0YXNrJyxcclxuICAgICAgICBhdHRhY2htZW50czogW10sXHJcbiAgICAgICAgc3RhcnQ6IGN1c3RvbS5zdGFydCxcclxuICAgICAgICBlbmQ6IGN1c3RvbS5lbmQgfHwgJ0ZvcmV2ZXInLFxyXG4gICAgICAgIGJvZHk6IGN1c3RvbS5ib2R5LFxyXG4gICAgICAgIGlkOiBgdGFzayR7Y3VzdG9tLmJvZHkucmVwbGFjZSgvW15cXHddKi9nLCAnJyl9JHtjdXN0b20uc3RhcnR9JHtjdXN0b20uZW5kfSR7Y3VzdG9tLmNsYXNzfWAsXHJcbiAgICAgICAgY2xhc3M6IGNscyA9PT0gLTEgPyBudWxsIDogY2xzXHJcbiAgICB9XHJcbn1cclxuXHJcbmludGVyZmFjZSBJUGFyc2VSZXN1bHQge1xyXG4gICAgY2xzPzogc3RyaW5nXHJcbiAgICBkdWU/OiBzdHJpbmdcclxuICAgIHN0Pzogc3RyaW5nXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUN1c3RvbVRhc2sodGV4dDogc3RyaW5nLCByZXN1bHQ6IElQYXJzZVJlc3VsdCA9IHt9KTogSVBhcnNlUmVzdWx0IHtcclxuICAgIGNvbnN0IHBhcnNlZCA9IHRleHQubWF0Y2goLyguKikgKGZvcnxieXxkdWV8YXNzaWduZWR8c3RhcnRpbmd8ZW5kaW5nfGJlZ2lubmluZykgKC4qKS8pXHJcbiAgICBpZiAocGFyc2VkID09IG51bGwpIHJldHVybiByZXN1bHRcclxuXHJcbiAgICBzd2l0Y2ggKHBhcnNlZFsyXSkge1xyXG4gICAgICAgIGNhc2UgJ2Zvcic6IHJlc3VsdC5jbHMgPSBwYXJzZWRbM107IGJyZWFrXHJcbiAgICAgICAgY2FzZSAnYnknOiBjYXNlICdkdWUnOiBjYXNlICdlbmRpbmcnOiByZXN1bHQuZHVlID0gcGFyc2VkWzNdOyBicmVha1xyXG4gICAgICAgIGNhc2UgJ2Fzc2lnbmVkJzogY2FzZSAnc3RhcnRpbmcnOiBjYXNlICdiZWdpbm5pbmcnOiByZXN1bHQuc3QgPSBwYXJzZWRbM107IGJyZWFrXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHBhcnNlQ3VzdG9tVGFzayhwYXJzZWRbMV0sIHJlc3VsdClcclxufVxyXG4iLCJpbXBvcnQgeyBsb2NhbFN0b3JhZ2VSZWFkLCBsb2NhbFN0b3JhZ2VXcml0ZSB9IGZyb20gJy4uL3V0aWwnXHJcblxyXG5jb25zdCBET05FX1NUT1JBR0VfTkFNRSA9ICdkb25lJ1xyXG5cclxuY29uc3QgZG9uZTogc3RyaW5nW10gPSBsb2NhbFN0b3JhZ2VSZWFkKERPTkVfU1RPUkFHRV9OQU1FKSB8fCBbXVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUZyb21Eb25lKGlkOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgIGNvbnN0IGluZGV4ID0gZG9uZS5pbmRleE9mKGlkKVxyXG4gICAgaWYgKGluZGV4ID49IDApIGRvbmUuc3BsaWNlKGluZGV4LCAxKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYWRkVG9Eb25lKGlkOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgIGRvbmUucHVzaChpZClcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVEb25lKCk6IHZvaWQge1xyXG4gICAgbG9jYWxTdG9yYWdlV3JpdGUoRE9ORV9TVE9SQUdFX05BTUUsIGRvbmUpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBhc3NpZ25tZW50SW5Eb25lKGlkOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgIHJldHVybiBkb25lLmluY2x1ZGVzKGlkKVxyXG59XHJcbiIsImltcG9ydCB7IGxvY2FsU3RvcmFnZVJlYWQsIGxvY2FsU3RvcmFnZVdyaXRlIH0gZnJvbSAnLi4vdXRpbCdcclxuXHJcbmNvbnN0IE1PRElGSUVEX1NUT1JBR0VfTkFNRSA9ICdtb2RpZmllZCdcclxuXHJcbmludGVyZmFjZSBJTW9kaWZpZWRCb2RpZXMge1xyXG4gICAgW2lkOiBzdHJpbmddOiBzdHJpbmdcclxufVxyXG5cclxuY29uc3QgbW9kaWZpZWQ6IElNb2RpZmllZEJvZGllcyA9IGxvY2FsU3RvcmFnZVJlYWQoTU9ESUZJRURfU1RPUkFHRV9OQU1FKSB8fCB7fVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUZyb21Nb2RpZmllZChpZDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICBkZWxldGUgbW9kaWZpZWRbaWRdXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlTW9kaWZpZWQoKTogdm9pZCB7XHJcbiAgICBsb2NhbFN0b3JhZ2VXcml0ZShNT0RJRklFRF9TVE9SQUdFX05BTUUsIG1vZGlmaWVkKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYXNzaWdubWVudEluTW9kaWZpZWQoaWQ6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIG1vZGlmaWVkLmhhc093blByb3BlcnR5KGlkKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbW9kaWZpZWRCb2R5KGlkOiBzdHJpbmcpOiBzdHJpbmd8dW5kZWZpbmVkIHtcclxuICAgIHJldHVybiBtb2RpZmllZFtpZF1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNldE1vZGlmaWVkKGlkOiBzdHJpbmcsIGJvZHk6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgbW9kaWZpZWRbaWRdID0gYm9keVxyXG59XHJcbiIsImltcG9ydCB7IGxvY2FsU3RvcmFnZVJlYWQsIGxvY2FsU3RvcmFnZVdyaXRlIH0gZnJvbSAnLi91dGlsJ1xyXG5cclxudHlwZSBBc3NpZ25tZW50U3BhbiA9ICdtdWx0aXBsZScgfCAnc3RhcnQnIHwgJ2VuZCdcclxudHlwZSBIaWRlQXNzaWdubWVudHMgPSAnZGF5JyB8ICdtcycgfCAndXMnXHJcbnR5cGUgQ29sb3JUeXBlID0gJ2Fzc2lnbm1lbnQnIHwgJ2NsYXNzJ1xyXG5pbnRlcmZhY2UgSVNob3duQWN0aXZpdHkge1xyXG4gICAgYWRkOiBib29sZWFuXHJcbiAgICBlZGl0OiBib29sZWFuXHJcbiAgICBkZWxldGU6IGJvb2xlYW5cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHNldHRpbmdzID0ge1xyXG4gICAgLyoqXHJcbiAgICAgKiBNaW51dGVzIGJldHdlZW4gZWFjaCBhdXRvbWF0aWMgcmVmcmVzaCBvZiB0aGUgcGFnZS4gTmVnYXRpdmUgbnVtYmVycyBpbmRpY2F0ZSBubyBhdXRvbWF0aWNcclxuICAgICAqIHJlZnJlc2hpbmcuXHJcbiAgICAgKi9cclxuICAgIGdldCByZWZyZXNoUmF0ZSgpOiBudW1iZXIgeyByZXR1cm4gbG9jYWxTdG9yYWdlUmVhZCgncmVmcmVzaFJhdGUnLCAtMSkgfSxcclxuICAgIHNldCByZWZyZXNoUmF0ZSh2OiBudW1iZXIpIHsgbG9jYWxTdG9yYWdlV3JpdGUoJ3JlZnJlc2hSYXRlJywgdikgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIFdoZXRoZXIgdGhlIHdpbmRvdyBzaG91bGQgcmVmcmVzaCBhc3NpZ25tZW50IGRhdGEgd2hlbiBmb2N1c3NlZFxyXG4gICAgICovXHJcbiAgICBnZXQgcmVmcmVzaE9uRm9jdXMoKTogYm9vbGVhbiB7IHJldHVybiBsb2NhbFN0b3JhZ2VSZWFkKCdyZWZyZXNoT25Gb2N1cycsIHRydWUpIH0sXHJcbiAgICBzZXQgcmVmcmVzaE9uRm9jdXModjogYm9vbGVhbikgeyBsb2NhbFN0b3JhZ2VXcml0ZSgncmVmcmVzaE9uRm9jdXMnLCB2KSB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogV2hldGhlciBzd2l0Y2hpbmcgYmV0d2VlbiB2aWV3cyBzaG91bGQgYmUgYW5pbWF0ZWRcclxuICAgICAqL1xyXG4gICAgZ2V0IHZpZXdUcmFucygpOiBib29sZWFuIHsgcmV0dXJuIGxvY2FsU3RvcmFnZVJlYWQoJ3ZpZXdUcmFucycsIHRydWUpIH0sXHJcbiAgICBzZXQgdmlld1RyYW5zKHY6IGJvb2xlYW4pIHsgbG9jYWxTdG9yYWdlV3JpdGUoJ3ZpZXdUcmFucycsIHYpIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBOdW1iZXIgb2YgZGF5cyBlYXJseSB0byBzaG93IHRlc3RzIGluIGxpc3Qgdmlld1xyXG4gICAgICovXHJcbiAgICBnZXQgZWFybHlUZXN0KCk6IG51bWJlciB7IHJldHVybiBsb2NhbFN0b3JhZ2VSZWFkKCdlYXJseVRlc3QnLCAxKSB9LFxyXG4gICAgc2V0IGVhcmx5VGVzdCh2OiBudW1iZXIpIHsgbG9jYWxTdG9yYWdlV3JpdGUoJ2Vhcmx5VGVzdCcsIHYpIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBXaGV0aGVyIHRvIHRha2UgdGFza3Mgb2ZmIHRoZSBjYWxlbmRhciB2aWV3IGFuZCBzaG93IHRoZW0gaW4gdGhlIGluZm8gcGFuZVxyXG4gICAgICovXHJcbiAgICBnZXQgc2VwVGFza3MoKTogYm9vbGVhbiB7IHJldHVybiBsb2NhbFN0b3JhZ2VSZWFkKCdzZXBUYXNrcycsIGZhbHNlKSB9LFxyXG4gICAgc2V0IHNlcFRhc2tzKHY6IGJvb2xlYW4pIHsgbG9jYWxTdG9yYWdlV3JpdGUoJ3NlcFRhc2tzJywgdikgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIFdoZXRoZXIgdGFza3Mgc2hvdWxkIGhhdmUgdGhlaXIgb3duIGNvbG9yXHJcbiAgICAgKi9cclxuICAgIGdldCBzZXBUYXNrQ2xhc3MoKTogYm9vbGVhbiB7IHJldHVybiBsb2NhbFN0b3JhZ2VSZWFkKCdzZXBUYXNrQ2xhc3MnLCBmYWxzZSkgfSxcclxuICAgIHNldCBzZXBUYXNrQ2xhc3ModjogYm9vbGVhbikgeyBsb2NhbFN0b3JhZ2VXcml0ZSgnc2VwVGFza0NsYXNzJywgdikgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIFdoZXRoZXIgcHJvamVjdHMgc2hvdyB1cCBpbiB0aGUgdGVzdCBwYWdlXHJcbiAgICAgKi9cclxuICAgIGdldCBwcm9qZWN0c0luVGVzdFBhbmUoKTogYm9vbGVhbiB7IHJldHVybiBsb2NhbFN0b3JhZ2VSZWFkKCdwcm9qZWN0c0luVGVzdFBhbmUnLCBmYWxzZSkgfSxcclxuICAgIHNldCBwcm9qZWN0c0luVGVzdFBhbmUodjogYm9vbGVhbikgeyBsb2NhbFN0b3JhZ2VXcml0ZSgncHJvamVjdHNJblRlc3RQYW5lJywgdikgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIFdoZW4gYXNzaWdubWVudHMgc2hvdWxkIGJlIHNob3duIG9uIGNhbGVuZGFyIHZpZXdcclxuICAgICAqL1xyXG4gICAgZ2V0IGFzc2lnbm1lbnRTcGFuKCk6IEFzc2lnbm1lbnRTcGFuIHsgcmV0dXJuIGxvY2FsU3RvcmFnZVJlYWQoJ2Fzc2lnbm1lbnRTcGFuJywgJ211bHRpcGxlJykgfSxcclxuICAgIHNldCBhc3NpZ25tZW50U3Bhbih2OiBBc3NpZ25tZW50U3BhbikgeyBsb2NhbFN0b3JhZ2VXcml0ZSgnYXNzaWdubWVudFNwYW4nLCB2KSB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogV2hlbiBhc3NpZ25tZW50cyBzaG91bGQgZGlzYXBwZWFyIGZyb20gbGlzdCB2aWV3XHJcbiAgICAgKi9cclxuICAgIGdldCBoaWRlQXNzaWdubWVudHMoKTogSGlkZUFzc2lnbm1lbnRzIHsgcmV0dXJuIGxvY2FsU3RvcmFnZVJlYWQoJ2hpZGVBc3NpZ25tZW50cycsICdkYXknKSB9LFxyXG4gICAgc2V0IGhpZGVBc3NpZ25tZW50cyh2OiBIaWRlQXNzaWdubWVudHMpIHsgbG9jYWxTdG9yYWdlV3JpdGUoJ2hpZGVBc3NpZ25tZW50cycsIHYpIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBXaGV0aGVyIHRvIHVzZSBob2xpZGF5IHRoZW1pbmdcclxuICAgICAqL1xyXG4gICAgZ2V0IGhvbGlkYXlUaGVtZXMoKTogYm9vbGVhbiB7IHJldHVybiBsb2NhbFN0b3JhZ2VSZWFkKCdob2xpZGF5VGhlbWVzJywgZmFsc2UpIH0sXHJcbiAgICBzZXQgaG9saWRheVRoZW1lcyh2OiBib29sZWFuKSB7IGxvY2FsU3RvcmFnZVdyaXRlKCdob2xpZGF5VGhlbWVzJywgdikgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIFdoZXRoZXIgdG8gY29sb3IgYXNzaWdubWVudHMgYmFzZWQgb24gdGhlaXIgdHlwZSBvciBjbGFzc1xyXG4gICAgICovXHJcbiAgICBnZXQgY29sb3JUeXBlKCk6IENvbG9yVHlwZSB7IHJldHVybiBsb2NhbFN0b3JhZ2VSZWFkKCdjb2xvclR5cGUnLCAnYXNzaWdubWVudCcpIH0sXHJcbiAgICBzZXQgY29sb3JUeXBlKHY6IENvbG9yVHlwZSkgeyBsb2NhbFN0b3JhZ2VXcml0ZSgnY29sb3JUeXBlJywgdikgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIFdoaWNoIHR5cGVzIG9mIGFjdGl2aXR5IGFyZSBzaG93biBpbiB0aGUgYWN0aXZpdHkgcGFuZVxyXG4gICAgICovXHJcbiAgICBnZXQgc2hvd25BY3Rpdml0eSgpOiBJU2hvd25BY3Rpdml0eSB7IHJldHVybiBsb2NhbFN0b3JhZ2VSZWFkKCdzaG93bkFjdGl2aXR5Jywge1xyXG4gICAgICAgIGFkZDogdHJ1ZSxcclxuICAgICAgICBlZGl0OiB0cnVlLFxyXG4gICAgICAgIGRlbGV0ZTogdHJ1ZVxyXG4gICAgfSkgfSxcclxuICAgIHNldCBzaG93bkFjdGl2aXR5KHY6IElTaG93bkFjdGl2aXR5KSB7IGxvY2FsU3RvcmFnZVdyaXRlKCdzaG93bkFjdGl2aXR5JywgdikgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIFdoZXRoZXIgdG8gZGlzcGxheSB0YXNrcyBpbiB0aGUgdGFzayBwYW5lIHRoYXQgYXJlIGNvbXBsZXRlZFxyXG4gICAgICovXHJcbiAgICBnZXQgc2hvd0RvbmVUYXNrcygpOiBib29sZWFuIHsgcmV0dXJuIGxvY2FsU3RvcmFnZVJlYWQoJ3Nob3dEb25lVGFza3MnLCBmYWxzZSkgfSxcclxuICAgIHNldCBzaG93RG9uZVRhc2tzKHY6IGJvb2xlYW4pIHsgbG9jYWxTdG9yYWdlV3JpdGUoJ3Nob3dEb25lVGFza3MnLCB2KSB9XHJcbn1cclxuIiwiaW1wb3J0IHsgZnJvbURhdGVOdW0sIHRvRGF0ZU51bSB9IGZyb20gJy4vZGF0ZXMnXHJcblxyXG4vKipcclxuICogRm9yY2VzIGEgbGF5b3V0IG9uIGFuIGVsZW1lbnRcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBmb3JjZUxheW91dChlbDogSFRNTEVsZW1lbnQpOiB2b2lkIHtcclxuICAgIC8vIFRoaXMgaW52b2x2ZXMgYSBsaXR0bGUgdHJpY2tlcnkgaW4gdGhhdCBieSByZXF1ZXN0aW5nIHRoZSBjb21wdXRlZCBoZWlnaHQgb2YgdGhlIGVsZW1lbnQgdGhlXHJcbiAgICAvLyBicm93c2VyIGlzIGZvcmNlZCB0byBkbyBhIGZ1bGwgbGF5b3V0XHJcblxyXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC1leHByZXNzaW9uXHJcbiAgICBlbC5vZmZzZXRIZWlnaHRcclxufVxyXG5cclxuLyoqXHJcbiAqIFJldHVybiBhIHN0cmluZyB3aXRoIHRoZSBmaXJzdCBsZXR0ZXIgY2FwaXRhbGl6ZWRcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBjYXBpdGFsaXplU3RyaW5nKHN0cjogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIHJldHVybiBzdHIuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHIuc3Vic3RyKDEpXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZXR1cm5zIGFuIFhNTEh0dHBSZXF1ZXN0IHdpdGggdGhlIHNwZWNpZmllZCB1cmwsIHJlc3BvbnNlIHR5cGUsIGhlYWRlcnMsIGFuZCBkYXRhXHJcbiAqL1xyXG5mdW5jdGlvbiBjb25zdHJ1Y3RYTUxIdHRwUmVxdWVzdCh1cmw6IHN0cmluZywgcmVzcFR5cGU/OiBYTUxIdHRwUmVxdWVzdFJlc3BvbnNlVHlwZXxudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXJzPzoge1tuYW1lOiBzdHJpbmddOiBzdHJpbmd9fG51bGwsIGRhdGE/OiBzdHJpbmd8bnVsbCk6IFhNTEh0dHBSZXF1ZXN0IHtcclxuICAgIGNvbnN0IHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXHJcblxyXG4gICAgLy8gSWYgUE9TVCBkYXRhIGlzIHByb3ZpZGVkIHNlbmQgYSBQT1NUIHJlcXVlc3QsIG90aGVyd2lzZSBzZW5kIGEgR0VUIHJlcXVlc3RcclxuICAgIHJlcS5vcGVuKChkYXRhID8gJ1BPU1QnIDogJ0dFVCcpLCB1cmwsIHRydWUpXHJcblxyXG4gICAgaWYgKHJlc3BUeXBlKSByZXEucmVzcG9uc2VUeXBlID0gcmVzcFR5cGVcclxuXHJcbiAgICBpZiAoaGVhZGVycykge1xyXG4gICAgICAgIE9iamVjdC5rZXlzKGhlYWRlcnMpLmZvckVhY2goKGhlYWRlcikgPT4ge1xyXG4gICAgICAgICAgICByZXEuc2V0UmVxdWVzdEhlYWRlcihoZWFkZXIsIGhlYWRlcnNbaGVhZGVyXSlcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIC8vIElmIGRhdGEgaXMgdW5kZWZpbmVkIGRlZmF1bHQgdG8gdGhlIG5vcm1hbCByZXEuc2VuZCgpLCBvdGhlcndpc2UgcGFzcyB0aGUgZGF0YSBpblxyXG4gICAgcmVxLnNlbmQoZGF0YSlcclxuICAgIHJldHVybiByZXFcclxufVxyXG5cclxuLyoqIFNlbmRzIGEgcmVxdWVzdCB0byBhIHNlcnZlciBhbmQgcmV0dXJucyBhIFByb21pc2UuXHJcbiAqIEBwYXJhbSB1cmwgdGhlIHVybCB0byByZXRyaWV2ZVxyXG4gKiBAcGFyYW0gcmVzcFR5cGUgdGhlIHR5cGUgb2YgcmVzcG9uc2UgdGhhdCBzaG91bGQgYmUgcmVjZWl2ZWRcclxuICogQHBhcmFtIGhlYWRlcnMgdGhlIGhlYWRlcnMgdGhhdCB3aWxsIGJlIHNlbnQgdG8gdGhlIHNlcnZlclxyXG4gKiBAcGFyYW0gZGF0YSB0aGUgZGF0YSB0aGF0IHdpbGwgYmUgc2VudCB0byB0aGUgc2VydmVyIChvbmx5IGZvciBQT1NUIHJlcXVlc3RzKVxyXG4gKiBAcGFyYW0gcHJvZ3Jlc3NFbGVtZW50IGFuIG9wdGlvbmFsIGVsZW1lbnQgZm9yIHRoZSBwcm9ncmVzcyBiYXIgdXNlZCB0byBkaXNwbGF5IHRoZSBzdGF0dXMgb2YgdGhlIHJlcXVlc3RcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBzZW5kKHVybDogc3RyaW5nLCByZXNwVHlwZT86IFhNTEh0dHBSZXF1ZXN0UmVzcG9uc2VUeXBlfG51bGwsIGhlYWRlcnM/OiB7W25hbWU6IHN0cmluZ106IHN0cmluZ318bnVsbCxcclxuICAgICAgICAgICAgICAgICAgICAgZGF0YT86IHN0cmluZ3xudWxsLCBwcm9ncmVzcz86IEhUTUxFbGVtZW50fG51bGwpOiBQcm9taXNlPFhNTEh0dHBSZXF1ZXN0PiB7XHJcblxyXG4gICAgY29uc3QgcmVxID0gY29uc3RydWN0WE1MSHR0cFJlcXVlc3QodXJsLCByZXNwVHlwZSwgaGVhZGVycywgZGF0YSlcclxuXHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cclxuICAgICAgICBjb25zdCBwcm9ncmVzc0lubmVyID0gcHJvZ3Jlc3MgPyBwcm9ncmVzcy5xdWVyeVNlbGVjdG9yKCdkaXYnKSA6IG51bGxcclxuICAgICAgICBpZiAocHJvZ3Jlc3MgJiYgcHJvZ3Jlc3NJbm5lcikge1xyXG4gICAgICAgICAgICBmb3JjZUxheW91dChwcm9ncmVzc0lubmVyKSAvLyBXYWl0IGZvciBpdCB0byByZW5kZXJcclxuICAgICAgICAgICAgcHJvZ3Jlc3MuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJykgLy8gRGlzcGxheSB0aGUgcHJvZ3Jlc3MgYmFyXHJcbiAgICAgICAgICAgIGlmIChwcm9ncmVzc0lubmVyLmNsYXNzTGlzdC5jb250YWlucygnZGV0ZXJtaW5hdGUnKSkge1xyXG4gICAgICAgICAgICAgICAgcHJvZ3Jlc3NJbm5lci5jbGFzc0xpc3QucmVtb3ZlKCdkZXRlcm1pbmF0ZScpXHJcbiAgICAgICAgICAgICAgICBwcm9ncmVzc0lubmVyLmNsYXNzTGlzdC5hZGQoJ2luZGV0ZXJtaW5hdGUnKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBTb21ldGltZXMgdGhlIGJyb3dzZXIgd29uJ3QgZ2l2ZSB0aGUgdG90YWwgYnl0ZXMgaW4gdGhlIHJlc3BvbnNlLCBzbyB1c2UgcGFzdCByZXN1bHRzIG9yXHJcbiAgICAgICAgLy8gYSBkZWZhdWx0IG9mIDE3MCwwMDAgYnl0ZXMgaWYgdGhlIGJyb3dzZXIgZG9lc24ndCBwcm92aWRlIHRoZSBudW1iZXJcclxuICAgICAgICBjb25zdCBsb2FkID0gTnVtYmVyKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdsb2FkJykpIHx8IDE3MDAwMFxyXG4gICAgICAgIGxldCBjb21wdXRlZExvYWQgPSAwXHJcblxyXG4gICAgICAgIHJlcS5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKGV2dCkgPT4ge1xyXG4gICAgICAgICAgICAvLyBDYWNoZSB0aGUgbnVtYmVyIG9mIGJ5dGVzIGxvYWRlZCBzbyBpdCBjYW4gYmUgdXNlZCBmb3IgYmV0dGVyIGVzdGltYXRlcyBsYXRlciBvblxyXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnbG9hZCcsIFN0cmluZyhjb21wdXRlZExvYWQpKVxyXG4gICAgICAgICAgICBpZiAocHJvZ3Jlc3MpIHByb2dyZXNzLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgICAgICAgICAgIC8vIFJlc29sdmUgd2l0aCB0aGUgcmVxdWVzdFxyXG4gICAgICAgICAgICBpZiAocmVxLnN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKHJlcSlcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChFcnJvcihyZXEuc3RhdHVzVGV4dCkpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICByZXEuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChwcm9ncmVzcykgcHJvZ3Jlc3MuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcclxuICAgICAgICAgICAgcmVqZWN0KEVycm9yKCdOZXR3b3JrIEVycm9yJykpXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgaWYgKHByb2dyZXNzICYmIHByb2dyZXNzSW5uZXIpIHtcclxuICAgICAgICAgICAgcmVxLmFkZEV2ZW50TGlzdGVuZXIoJ3Byb2dyZXNzJywgKGV2dCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gVXBkYXRlIHRoZSBwcm9ncmVzcyBiYXJcclxuICAgICAgICAgICAgICAgIGlmIChwcm9ncmVzc0lubmVyLmNsYXNzTGlzdC5jb250YWlucygnaW5kZXRlcm1pbmF0ZScpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvZ3Jlc3NJbm5lci5jbGFzc0xpc3QucmVtb3ZlKCdpbmRldGVybWluYXRlJylcclxuICAgICAgICAgICAgICAgICAgICBwcm9ncmVzc0lubmVyLmNsYXNzTGlzdC5hZGQoJ2RldGVybWluYXRlJylcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvbXB1dGVkTG9hZCA9IGV2dC5sb2FkZWRcclxuICAgICAgICAgICAgICAgIHByb2dyZXNzSW5uZXIuc3R5bGUud2lkdGggPSAoKDEwMCAqIGV2dC5sb2FkZWQpIC8gKGV2dC5sZW5ndGhDb21wdXRhYmxlID8gZXZ0LnRvdGFsIDogbG9hZCkpICsgJyUnXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxufVxyXG5cclxuLyoqXHJcbiAqIFRoZSBlcXVpdmFsZW50IG9mIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkIGJ1dCB0aHJvd3MgYW4gZXJyb3IgaWYgdGhlIGVsZW1lbnQgaXMgbm90IGRlZmluZWRcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBlbGVtQnlJZChpZDogc3RyaW5nKTogSFRNTEVsZW1lbnQge1xyXG4gICAgY29uc3QgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZClcclxuICAgIGlmIChlbCA9PSBudWxsKSB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBmaW5kIGVsZW1lbnQgd2l0aCBpZCAke2lkfWApXHJcbiAgICByZXR1cm4gZWxcclxufVxyXG5cclxuLyoqXHJcbiAqIEEgbGl0dGxlIGhlbHBlciBmdW5jdGlvbiB0byBzaW1wbGlmeSB0aGUgY3JlYXRpb24gb2YgSFRNTCBlbGVtZW50c1xyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGVsZW1lbnQodGFnOiBzdHJpbmcsIGNsczogc3RyaW5nfHN0cmluZ1tdLCBodG1sPzogc3RyaW5nfG51bGwsIGlkPzogc3RyaW5nfG51bGwpOiBIVE1MRWxlbWVudCB7XHJcbiAgICBjb25zdCBlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWcpXHJcblxyXG4gICAgaWYgKHR5cGVvZiBjbHMgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgZS5jbGFzc0xpc3QuYWRkKGNscylcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY2xzLmZvckVhY2goKGMpID0+IGUuY2xhc3NMaXN0LmFkZChjKSlcclxuICAgIH1cclxuXHJcbiAgICBpZiAoaHRtbCkgZS5pbm5lckhUTUwgPSBodG1sXHJcbiAgICBpZiAoaWQpIGUuc2V0QXR0cmlidXRlKCdpZCcsIGlkKVxyXG5cclxuICAgIHJldHVybiBlXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBUaHJvd3MgYW4gZXJyb3IgaWYgdGhlIHN1cHBsaWVkIGFyZ3VtZW50IGlzIG51bGwsIG90aGVyd2lzZSByZXR1cm5zIHRoZSBhcmd1bWVudFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIF8kPFQ+KGFyZzogVHxudWxsKTogVCB7XHJcbiAgICBpZiAoYXJnID09IG51bGwpIHRocm93IG5ldyBFcnJvcignRXhwZWN0ZWQgYXJndW1lbnQgdG8gYmUgbm9uLW51bGwnKVxyXG4gICAgcmV0dXJuIGFyZ1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gXyRoKGFyZzogTm9kZXxFdmVudFRhcmdldHxudWxsKTogSFRNTEVsZW1lbnQge1xyXG4gICAgaWYgKGFyZyA9PSBudWxsKSB0aHJvdyBuZXcgRXJyb3IoJ0V4cGVjdGVkIG5vZGUgdG8gYmUgbm9uLW51bGwnKVxyXG4gICAgcmV0dXJuIGFyZyBhcyBIVE1MRWxlbWVudFxyXG59XHJcblxyXG4vLyBCZWNhdXNlIHNvbWUgbG9jYWxTdG9yYWdlIGVudHJpZXMgY2FuIGJlY29tZSBjb3JydXB0ZWQgZHVlIHRvIGVycm9yIHNpZGUgZWZmZWN0cywgdGhlIGJlbG93XHJcbi8vIG1ldGhvZCB0cmllcyB0byByZWFkIGEgdmFsdWUgZnJvbSBsb2NhbFN0b3JhZ2UgYW5kIGhhbmRsZXMgZXJyb3JzLlxyXG5leHBvcnQgZnVuY3Rpb24gbG9jYWxTdG9yYWdlUmVhZChuYW1lOiBzdHJpbmcpOiBhbnlcclxuZXhwb3J0IGZ1bmN0aW9uIGxvY2FsU3RvcmFnZVJlYWQ8Uj4obmFtZTogc3RyaW5nLCBkZWZhdWx0VmFsOiAoKSA9PiBSKTogUlxyXG5leHBvcnQgZnVuY3Rpb24gbG9jYWxTdG9yYWdlUmVhZDxUPihuYW1lOiBzdHJpbmcsIGRlZmF1bHRWYWw6IFQpOiBUXHJcbmV4cG9ydCBmdW5jdGlvbiBsb2NhbFN0b3JhZ2VSZWFkKG5hbWU6IHN0cmluZywgZGVmYXVsdFZhbD86IGFueSk6IGFueSB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZVtuYW1lXSlcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICByZXR1cm4gdHlwZW9mIGRlZmF1bHRWYWwgPT09ICdmdW5jdGlvbicgPyBkZWZhdWx0VmFsKCkgOiBkZWZhdWx0VmFsXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBsb2NhbFN0b3JhZ2VXcml0ZShuYW1lOiBzdHJpbmcsIGl0ZW06IGFueSk6IHZvaWQge1xyXG4gICAgbG9jYWxTdG9yYWdlW25hbWVdID0gSlNPTi5zdHJpbmdpZnkoaXRlbSlcclxufVxyXG5cclxuaW50ZXJmYWNlIElkbGVEZWFkbGluZSB7XHJcbiAgICBkaWRUaW1lb3V0OiBib29sZWFuXHJcbiAgICB0aW1lUmVtYWluaW5nOiAoKSA9PiBudW1iZXJcclxufVxyXG5cclxuLy8gQmVjYXVzZSB0aGUgcmVxdWVzdElkbGVDYWxsYmFjayBmdW5jdGlvbiBpcyB2ZXJ5IG5ldyAoYXMgb2Ygd3JpdGluZyBvbmx5IHdvcmtzIHdpdGggQ2hyb21lXHJcbi8vIHZlcnNpb24gNDcpLCB0aGUgYmVsb3cgZnVuY3Rpb24gcG9seWZpbGxzIHRoYXQgbWV0aG9kLlxyXG5leHBvcnQgZnVuY3Rpb24gcmVxdWVzdElkbGVDYWxsYmFjayhjYjogKGRlYWRsaW5lOiBJZGxlRGVhZGxpbmUpID0+IHZvaWQsIG9wdHM6IHsgdGltZW91dDogbnVtYmVyfSk6IG51bWJlciB7XHJcbiAgICBpZiAoJ3JlcXVlc3RJZGxlQ2FsbGJhY2snIGluIHdpbmRvdykge1xyXG4gICAgICAgIHJldHVybiAod2luZG93IGFzIGFueSkucmVxdWVzdElkbGVDYWxsYmFjayhjYiwgb3B0cylcclxuICAgIH1cclxuICAgIGNvbnN0IHN0YXJ0ID0gRGF0ZS5ub3coKVxyXG5cclxuICAgIHJldHVybiBzZXRUaW1lb3V0KCgpID0+IGNiKHtcclxuICAgICAgICBkaWRUaW1lb3V0OiBmYWxzZSxcclxuICAgICAgICB0aW1lUmVtYWluaW5nKCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIHJldHVybiBNYXRoLm1heCgwLCA1MCAtIChEYXRlLm5vdygpIC0gc3RhcnQpKVxyXG4gICAgICAgIH1cclxuICAgIH0pLCAxKVxyXG59XHJcblxyXG4vKipcclxuICogRGV0ZXJtaW5lIGlmIHRoZSB0d28gZGF0ZXMgaGF2ZSB0aGUgc2FtZSB5ZWFyLCBtb250aCwgYW5kIGRheVxyXG4gKi9cclxuZnVuY3Rpb24gZGF0ZXNFcXVhbChhOiBEYXRlLCBiOiBEYXRlKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdG9EYXRlTnVtKGEpID09PSB0b0RhdGVOdW0oYilcclxufVxyXG5cclxuY29uc3QgREFURV9SRUxBVElWRU5BTUVTOiB7W25hbWU6IHN0cmluZ106IG51bWJlcn0gPSB7XHJcbiAgICAnVG9tb3Jyb3cnOiAxLFxyXG4gICAgJ1RvZGF5JzogMCxcclxuICAgICdZZXN0ZXJkYXknOiAtMSxcclxuICAgICcyIGRheXMgYWdvJzogLTJcclxufVxyXG5jb25zdCBXRUVLREFZUyA9IFsnU3VuZGF5JywgJ01vbmRheScsICdUdWVzZGF5JywgJ1dlZG5lc2RheScsICdUaHVyc2RheScsICdGcmlkYXknLCAnU2F0dXJkYXknXVxyXG5jb25zdCBGVUxMTU9OVEhTID0gWydKYW51YXJ5JywgJ0ZlYnJ1YXJ5JywgJ01hcmNoJywgJ0FwcmlsJywgJ01heScsICdKdW5lJywgJ0p1bHknLCAnQXVndXN0JywgJ1NlcHRlbWJlcicsICdPY3RvYmVyJyxcclxuICAgICAgICAgICAgICAgICAgICAnTm92ZW1iZXInLCAnRGVjZW1iZXInXVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRhdGVTdHJpbmcoZGF0ZTogRGF0ZXxudW1iZXJ8J0ZvcmV2ZXInLCBhZGRUaGlzOiBib29sZWFuID0gZmFsc2UpOiBzdHJpbmcge1xyXG4gICAgaWYgKGRhdGUgPT09ICdGb3JldmVyJykgcmV0dXJuIGRhdGVcclxuICAgIGlmICh0eXBlb2YgZGF0ZSA9PT0gJ251bWJlcicpIHJldHVybiBkYXRlU3RyaW5nKGZyb21EYXRlTnVtKGRhdGUpLCBhZGRUaGlzKVxyXG5cclxuICAgIGNvbnN0IHJlbGF0aXZlTWF0Y2ggPSBPYmplY3Qua2V5cyhEQVRFX1JFTEFUSVZFTkFNRVMpLmZpbmQoKG5hbWUpID0+IHtcclxuICAgICAgICBjb25zdCBkYXlBdCA9IG5ldyBEYXRlKClcclxuICAgICAgICBkYXlBdC5zZXREYXRlKGRheUF0LmdldERhdGUoKSArIERBVEVfUkVMQVRJVkVOQU1FU1tuYW1lXSlcclxuICAgICAgICByZXR1cm4gZGF0ZXNFcXVhbChkYXlBdCwgZGF0ZSlcclxuICAgIH0pXHJcbiAgICBpZiAocmVsYXRpdmVNYXRjaCkgcmV0dXJuIHJlbGF0aXZlTWF0Y2hcclxuXHJcbiAgICBjb25zdCBkYXlzQWhlYWQgPSAoZGF0ZS5nZXRUaW1lKCkgLSBEYXRlLm5vdygpKSAvIDEwMDAgLyAzNjAwIC8gMjRcclxuXHJcbiAgICAvLyBJZiB0aGUgZGF0ZSBpcyB3aXRoaW4gNiBkYXlzIG9mIHRvZGF5LCBvbmx5IGRpc3BsYXkgdGhlIGRheSBvZiB0aGUgd2Vla1xyXG4gICAgaWYgKDAgPCBkYXlzQWhlYWQgJiYgZGF5c0FoZWFkIDw9IDYpIHtcclxuICAgICAgICByZXR1cm4gKGFkZFRoaXMgPyAnVGhpcyAnIDogJycpICsgV0VFS0RBWVNbZGF0ZS5nZXREYXkoKV1cclxuICAgIH1cclxuICAgIHJldHVybiBgJHtXRUVLREFZU1tkYXRlLmdldERheSgpXX0sICR7RlVMTE1PTlRIU1tkYXRlLmdldE1vbnRoKCldfSAke2RhdGUuZ2V0RGF0ZSgpfWBcclxufVxyXG5cclxuLy8gVGhlIG9uZSBiZWxvdyBzY3JvbGxzIHNtb290aGx5IHRvIGEgeSBwb3NpdGlvbi5cclxuZXhwb3J0IGZ1bmN0aW9uIHNtb290aFNjcm9sbCh0bzogbnVtYmVyKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgIGxldCBzdGFydDogbnVtYmVyfG51bGwgPSBudWxsXHJcbiAgICAgICAgY29uc3QgZnJvbSA9IGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wXHJcbiAgICAgICAgY29uc3QgYW1vdW50ID0gdG8gLSBmcm9tXHJcbiAgICAgICAgY29uc3Qgc3RlcCA9ICh0aW1lc3RhbXA6IG51bWJlcikgPT4ge1xyXG4gICAgICAgICAgICBpZiAoc3RhcnQgPT0gbnVsbCkgeyBzdGFydCA9IHRpbWVzdGFtcCB9XHJcbiAgICAgICAgICAgIGNvbnN0IHByb2dyZXNzID0gdGltZXN0YW1wIC0gc3RhcnRcclxuICAgICAgICAgICAgd2luZG93LnNjcm9sbFRvKDAsIGZyb20gKyAoYW1vdW50ICogKHByb2dyZXNzIC8gMzUwKSkpXHJcbiAgICAgICAgICAgIGlmIChwcm9ncmVzcyA8IDM1MCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3RBbmltYXRpb25GcmFtZShzdGVwKVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgXyQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbmF2JykpLmNsYXNzTGlzdC5yZW1vdmUoJ2hlYWRyb29tLS11bnBpbm5lZCcpXHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RlcClcclxuICAgIH0pXHJcbn1cclxuXHJcbi8vIEFuZCBhIGZ1bmN0aW9uIHRvIGFwcGx5IGFuIGluayBlZmZlY3RcclxuZXhwb3J0IGZ1bmN0aW9uIHJpcHBsZShlbDogSFRNTEVsZW1lbnQpOiB2b2lkIHtcclxuICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIChldnQpID0+IHtcclxuICAgICAgICBpZiAoZXZ0LndoaWNoICE9PSAxKSByZXR1cm4gLy8gTm90IGxlZnQgYnV0dG9uXHJcbiAgICAgICAgY29uc3Qgd2F2ZSA9IGVsZW1lbnQoJ3NwYW4nLCAnd2F2ZScpXHJcbiAgICAgICAgY29uc3Qgc2l6ZSA9IE1hdGgubWF4KE51bWJlcihlbC5vZmZzZXRXaWR0aCksIE51bWJlcihlbC5vZmZzZXRIZWlnaHQpKVxyXG4gICAgICAgIHdhdmUuc3R5bGUud2lkdGggPSAod2F2ZS5zdHlsZS5oZWlnaHQgPSBzaXplICsgJ3B4JylcclxuXHJcbiAgICAgICAgbGV0IHggPSBldnQuY2xpZW50WFxyXG4gICAgICAgIGxldCB5ID0gZXZ0LmNsaWVudFlcclxuICAgICAgICBjb25zdCByZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcclxuICAgICAgICB4IC09IHJlY3QubGVmdFxyXG4gICAgICAgIHkgLT0gcmVjdC50b3BcclxuXHJcbiAgICAgICAgd2F2ZS5zdHlsZS50b3AgPSAoeSAtIChzaXplIC8gMikpICsgJ3B4J1xyXG4gICAgICAgIHdhdmUuc3R5bGUubGVmdCA9ICh4IC0gKHNpemUgLyAyKSkgKyAncHgnXHJcbiAgICAgICAgZWwuYXBwZW5kQ2hpbGQod2F2ZSlcclxuICAgICAgICB3YXZlLnNldEF0dHJpYnV0ZSgnZGF0YS1ob2xkJywgU3RyaW5nKERhdGUubm93KCkpKVxyXG4gICAgICAgIGZvcmNlTGF5b3V0KHdhdmUpXHJcbiAgICAgICAgd2F2ZS5zdHlsZS50cmFuc2Zvcm0gPSAnc2NhbGUoMi41KSdcclxuICAgIH0pXHJcbiAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgKGV2dCkgPT4ge1xyXG4gICAgICAgIGlmIChldnQud2hpY2ggIT09IDEpIHJldHVybiAvLyBPbmx5IGZvciBsZWZ0IGJ1dHRvblxyXG4gICAgICAgIGNvbnN0IHdhdmVzID0gZWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnd2F2ZScpXHJcbiAgICAgICAgd2F2ZXMuZm9yRWFjaCgod2F2ZSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBkaWZmID0gRGF0ZS5ub3coKSAtIE51bWJlcih3YXZlLmdldEF0dHJpYnV0ZSgnZGF0YS1ob2xkJykpXHJcbiAgICAgICAgICAgIGNvbnN0IGRlbGF5ID0gTWF0aC5tYXgoMzUwIC0gZGlmZiwgMClcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAod2F2ZSBhcyBIVE1MRWxlbWVudCkuc3R5bGUub3BhY2l0eSA9ICcwJ1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgd2F2ZS5yZW1vdmUoKVxyXG4gICAgICAgICAgICAgICAgfSwgNTUwKVxyXG4gICAgICAgICAgICB9LCBkZWxheSlcclxuICAgICAgICB9KVxyXG4gICAgfSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNzc051bWJlcihjc3M6IHN0cmluZ3xudWxsKTogbnVtYmVyIHtcclxuICAgIGlmICghY3NzKSByZXR1cm4gMFxyXG4gICAgcmV0dXJuIHBhcnNlSW50KGNzcywgMTApXHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiIifQ==