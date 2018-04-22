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
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./util */ "./src/util.ts");













// @ts-ignore TODO: Make this less hacky
NodeList.prototype.forEach = HTMLCollection.prototype.forEach = Array.prototype.forEach;
if (Object(_util__WEBPACK_IMPORTED_MODULE_12__["localStorageRead"])('data') != null) {
    Object(_pcr__WEBPACK_IMPORTED_MODULE_8__["setData"])(Object(_util__WEBPACK_IMPORTED_MODULE_12__["localStorageRead"])('data'));
}
// Additionally, if it's the user's first time, the page is set to the welcome page.
if (!Object(_util__WEBPACK_IMPORTED_MODULE_12__["localStorageRead"])('noWelcome')) {
    Object(_util__WEBPACK_IMPORTED_MODULE_12__["localStorageWrite"])('noWelcome', true);
    window.location.href = 'welcome.html';
}
const NAV_ELEMENT = Object(_util__WEBPACK_IMPORTED_MODULE_12__["_$"])(document.querySelector('nav'));
const INPUT_ELEMENTS = document.querySelectorAll('input[type=text]:not(#newText):not([readonly]), input[type=password], input[type=email], ' +
    'input[type=url], input[type=tel], input[type=number]:not(.control), input[type=search]');
// #### Send function
//
// This function displays a snackbar to tell the user something
// <a name="ret"/>
// Retrieving data
// ---------------
//
Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('login').addEventListener('submit', (evt) => {
    evt.preventDefault();
    Object(_pcr__WEBPACK_IMPORTED_MODULE_8__["dologin"])(null, true);
});
// The view switching button needs an event handler.
Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('switchViews').addEventListener('click', _pcr__WEBPACK_IMPORTED_MODULE_8__["switchViews"]);
// The same goes for the log out button.
Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('logout').addEventListener('click', _pcr__WEBPACK_IMPORTED_MODULE_8__["logout"]);
// Now we assign it to clicking the background.
Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('background').addEventListener('click', _components_assignment__WEBPACK_IMPORTED_MODULE_1__["closeOpened"]);
// Then, the tabs are made interactive.
document.querySelectorAll('#navTabs>li').forEach((tab, tabIndex) => {
    tab.addEventListener('click', (evt) => {
        const trans = Object(_util__WEBPACK_IMPORTED_MODULE_12__["localStorageRead"])('viewTrans');
        if (!trans) {
            document.body.classList.add('noTrans');
            Object(_util__WEBPACK_IMPORTED_MODULE_12__["forceLayout"])(document.body);
        }
        Object(_util__WEBPACK_IMPORTED_MODULE_12__["localStorageWrite"])('view', tabIndex);
        document.body.setAttribute('data-view', String(tabIndex));
        if (tabIndex === 1) {
            window.addEventListener('resize', _components_resizer__WEBPACK_IMPORTED_MODULE_4__["resizeCaller"]);
            if (trans) {
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
                Object(_util__WEBPACK_IMPORTED_MODULE_12__["requestIdleCallback"])(() => {
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
        if (!trans) {
            Object(_util__WEBPACK_IMPORTED_MODULE_12__["forceLayout"])(document.body);
            setTimeout(() => {
                document.body.classList.remove('noTrans');
            }, 350);
        }
    });
});
// And the info tabs (just a little less code)
document.querySelectorAll('#infoTabs>li').forEach((tab, tabIndex) => {
    tab.addEventListener('click', (evt) => {
        Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('info').setAttribute('data-view', String(tabIndex));
    });
});
// The view is set to what it was last.
if (localStorage.view != null) {
    document.body.setAttribute('data-view', localStorage.view);
    if (localStorage.view === '1') {
        window.addEventListener('resize', _components_resizer__WEBPACK_IMPORTED_MODULE_4__["resizeCaller"]);
    }
}
// Additionally, the active class needs to be added when inputs are selected (for the login box).
INPUT_ELEMENTS.forEach((input) => {
    input.addEventListener('change', (evt) => {
        Object(_util__WEBPACK_IMPORTED_MODULE_12__["_$h"])(Object(_util__WEBPACK_IMPORTED_MODULE_12__["_$h"])(input.parentNode).querySelector('label')).classList.add('active');
    });
    input.addEventListener('focus', (evt) => {
        Object(_util__WEBPACK_IMPORTED_MODULE_12__["_$h"])(Object(_util__WEBPACK_IMPORTED_MODULE_12__["_$h"])(input.parentNode).querySelector('label')).classList.add('active');
    });
    input.addEventListener('blur', (evt) => {
        if (input.value.length === 0) {
            Object(_util__WEBPACK_IMPORTED_MODULE_12__["_$h"])(Object(_util__WEBPACK_IMPORTED_MODULE_12__["_$h"])(input.parentNode).querySelector('label')).classList.remove('active');
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
    Object(_util__WEBPACK_IMPORTED_MODULE_12__["ripple"])(Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])(elem));
    Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])(elem).addEventListener('mouseup', () => {
        document.body.classList.toggle(ls);
        Object(_components_resizer__WEBPACK_IMPORTED_MODULE_4__["resize"])();
        Object(_util__WEBPACK_IMPORTED_MODULE_12__["localStorageWrite"])(ls, document.body.classList.contains(ls));
        if (f != null)
            f();
    });
    if (Object(_util__WEBPACK_IMPORTED_MODULE_12__["localStorageRead"])(ls))
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
// function animateEl(el: HTMLElement, keyframes: AnimationKeyFrame[], options: AnimationOptions):
//     Promise<AnimationPlaybackEvent> {
//     return new Promise((resolve, reject) => {
//         const player = el.animate(keyframes, options)
//         player.onfinish = (e) => resolve(e)
//     })
// }
function animateEl(el, keyframes, options) {
    console.error('TODO: Upgrade typescript');
    return Promise.resolve(null);
}
// In order to make the previous date / next date buttons do something, they need event listeners.
Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('listnext').addEventListener('click', () => {
    const pd = Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('listprevdate');
    const td = Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('listnowdate');
    const nd = Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('listnextdate');
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
        nd.innerHTML = Object(_util__WEBPACK_IMPORTED_MODULE_12__["dateString"])(listDate2).replace('Today', 'Now');
        return nd.style.display = 'none';
    });
});
// The event listener for the previous date button is mostly the same.
Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('listbefore').addEventListener('click', () => {
    const pd = Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('listprevdate');
    const td = Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('listnowdate');
    const nd = Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('listnextdate');
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
        pd.innerHTML = Object(_util__WEBPACK_IMPORTED_MODULE_12__["dateString"])(listDate2).replace('Today', 'Now');
        return pd.style.display = 'none';
    });
});
// Whenever a date is double clicked, long tapped, or force touched, list view for that day is displayed.
function updateListNav() {
    const d = new Date();
    d.setDate((d.getDate() + Object(_navigation__WEBPACK_IMPORTED_MODULE_7__["getListDateOffset"])()) - 1);
    const up = (id) => {
        Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])(id).innerHTML = Object(_util__WEBPACK_IMPORTED_MODULE_12__["dateString"])(d).replace('Today', 'Now');
        return d.setDate(d.getDate() + 1);
    };
    up('listprevdate');
    up('listnowdate');
    up('listnextdate');
}
function switchToList(evt) {
    if (Object(_util__WEBPACK_IMPORTED_MODULE_12__["_$h"])(evt.target).classList.contains('month') || Object(_util__WEBPACK_IMPORTED_MODULE_12__["_$h"])(evt.target).classList.contains('date')) {
        Object(_navigation__WEBPACK_IMPORTED_MODULE_7__["setListDateOffset"])(Object(_dates__WEBPACK_IMPORTED_MODULE_5__["toDateNum"])(Number(Object(_util__WEBPACK_IMPORTED_MODULE_12__["_$h"])(Object(_util__WEBPACK_IMPORTED_MODULE_12__["_$h"])(evt.target).parentNode).getAttribute('data-date'))) - Object(_dates__WEBPACK_IMPORTED_MODULE_5__["today"])());
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
const headroom = new Headroom(Object(_util__WEBPACK_IMPORTED_MODULE_12__["_$"])(document.querySelector('nav')), {
    tolerance: 10,
    offset: 66
});
headroom.init();
// Also, the side menu needs event listeners.
Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('collapseButton').addEventListener('click', () => {
    document.body.style.overflow = 'hidden';
    Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('sideNav').classList.add('active');
    return Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('sideBackground').style.display = 'block';
});
Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('sideBackground').addEventListener('click', () => {
    Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('sideBackground').style.opacity = '0';
    Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('sideNav').classList.remove('active');
    Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('dragTarget').style.width = '';
    return setTimeout(() => {
        document.body.style.overflow = 'auto';
        Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('sideBackground').style.display = 'none';
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
Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('version').innerHTML = _app__WEBPACK_IMPORTED_MODULE_0__["VERSION"];
// To bring up the settings windows, an event listener needs to be added to the button.
Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('settingsB').addEventListener('click', () => {
    Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('sideBackground').click();
    document.body.classList.add('settingsShown');
    Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('brand').innerHTML = 'Settings';
    return setTimeout(() => {
        Object(_util__WEBPACK_IMPORTED_MODULE_12__["_$h"])(document.querySelector('main')).style.display = 'none';
    });
});
// The back button also needs to close the settings window.
Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('backButton').addEventListener('click', () => {
    Object(_util__WEBPACK_IMPORTED_MODULE_12__["_$h"])(document.querySelector('main')).style.display = 'block';
    document.body.classList.remove('settingsShown');
    return Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('brand').innerHTML = 'Check PCR';
});
// The code below is what the settings control.
if (localStorage.viewTrans == null) {
    localStorage.viewTrans = JSON.stringify(true);
}
if (localStorage.earlyTest == null) {
    localStorage.earlyTest = JSON.stringify(1);
}
if (localStorage.googleA == null) {
    localStorage.googleA = JSON.stringify(true);
}
if (localStorage.sepTasks == null) {
    localStorage.sepTasks = JSON.stringify(false);
}
if (localStorage.sepTaskClass == null) {
    localStorage.sepTaskClass = JSON.stringify(true);
}
if (localStorage.projectsInTestPane == null) {
    localStorage.projectsInTestPane = JSON.stringify(false);
}
if (localStorage.assignmentSpan == null) {
    localStorage.assignmentSpan = JSON.stringify('multiple');
}
if (localStorage.hideassignments == null) {
    localStorage.hideassignments = JSON.stringify('day');
}
if (JSON.parse(localStorage.sepTasks)) {
    Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('info').classList.add('isTasks');
    Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('new').style.display = 'none';
}
if (localStorage.holidayThemes == null) {
    localStorage.holidayThemes = JSON.stringify(false);
}
if (JSON.parse(localStorage.holidayThemes)) {
    document.body.classList.add('holidayThemes');
}
if (JSON.parse(localStorage.sepTaskClass)) {
    document.body.classList.add('sepTaskClass');
}
if (localStorage.colorType == null) {
    localStorage.colorType = 'assignment';
}
let assignmentColors = Object(_util__WEBPACK_IMPORTED_MODULE_12__["localStorageRead"])('assignmentColors', {
    classwork: '#689f38', homework: '#2196f3', longterm: '#f57c00', test: '#f44336'
});
let classColors = Object(_util__WEBPACK_IMPORTED_MODULE_12__["localStorageRead"])('classColors', () => {
    const cc = {};
    const data = Object(_pcr__WEBPACK_IMPORTED_MODULE_8__["getData"])();
    if (!data)
        return cc;
    data.classes.forEach((c) => {
        cc[c] = '#616161';
    });
    return cc;
});
Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])(`${localStorage.colorType}Colors`).style.display = 'block';
if (localStorage.refreshOnFocus == null) {
    localStorage.refreshOnFocus = JSON.stringify(true);
}
window.addEventListener('focus', () => {
    if (Object(_util__WEBPACK_IMPORTED_MODULE_12__["localStorageRead"])('refreshOnFocus')) {
        return Object(_pcr__WEBPACK_IMPORTED_MODULE_8__["fetch"])();
    }
});
if (localStorage.refreshRate == null) {
    localStorage.refreshRate = JSON.stringify(-1);
}
function intervalRefresh() {
    const r = JSON.parse(localStorage.refreshRate);
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
if (Object(_util__WEBPACK_IMPORTED_MODULE_12__["localStorageRead"])('data') != null) {
    Object(_util__WEBPACK_IMPORTED_MODULE_12__["localStorageRead"])('data').classes.forEach((c) => {
        const d = Object(_util__WEBPACK_IMPORTED_MODULE_12__["element"])('div', [], c);
        d.setAttribute('data-control', c);
        d.appendChild(Object(_util__WEBPACK_IMPORTED_MODULE_12__["element"])('span', []));
        Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('classColors').appendChild(d);
    });
}
document.querySelectorAll('.colors').forEach((e) => {
    e.querySelectorAll('div').forEach((color) => {
        const controlledColor = color.getAttribute('data-control');
        if (!controlledColor)
            throw new Error('Element has no controlled color');
        const sp = Object(_util__WEBPACK_IMPORTED_MODULE_12__["_$h"])(color.querySelector('span'));
        const listName = e.getAttribute('id') === 'classColors' ? 'classColors' : 'assignmentColors';
        const listSetter = (v) => {
            e.getAttribute('id') === 'classColors' ? classColors = v : assignmentColors = v;
        };
        const list = e.getAttribute('id') === 'classColors' ? classColors : assignmentColors;
        sp.style.backgroundColor = list[controlledColor];
        Object.keys(palette).forEach((p) => {
            const pe = Object(_util__WEBPACK_IMPORTED_MODULE_12__["element"])('span', []);
            pe.style.backgroundColor = p;
            if (p === list[controlledColor]) {
                pe.classList.add('selected');
            }
            sp.appendChild(pe);
        });
        const custom = Object(_util__WEBPACK_IMPORTED_MODULE_12__["element"])('span', ['customColor'], `<a>Custom</a> \
    <input type='text' placeholder='Was ${list[controlledColor]}' /> \
    <span class='customInfo'>Use any CSS valid color name, such as \
    <code>#F44336</code> or <code>rgb(64, 43, 2)</code> or <code>cyan</code></span> \
    <a class='customOk'>Set</a>`);
        custom.addEventListener('click', (evt) => evt.stopPropagation());
        Object(_util__WEBPACK_IMPORTED_MODULE_12__["_$"])(custom.querySelector('a')).addEventListener('click', (evt) => {
            sp.classList.toggle('onCustom');
            evt.stopPropagation();
        });
        sp.addEventListener('click', (evt) => {
            if (sp.classList.contains('choose')) {
                const target = Object(_util__WEBPACK_IMPORTED_MODULE_12__["_$h"])(evt.target);
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
        Object(_util__WEBPACK_IMPORTED_MODULE_12__["_$"])(custom.querySelector('.customOk')).addEventListener('click', (evt) => {
            sp.classList.remove('onCustom');
            sp.classList.toggle('choose');
            const selectedEl = sp.querySelector('.selected');
            if (selectedEl != null) {
                selectedEl.classList.remove('selected');
            }
            sp.style.backgroundColor = (list[controlledColor] = Object(_util__WEBPACK_IMPORTED_MODULE_12__["_$"])(custom.querySelector('input')).value);
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
    const sheet = Object(_util__WEBPACK_IMPORTED_MODULE_12__["_$"])(style.sheet);
    const addColorRule = (selector, light, dark, extra = '') => {
        const mixed = tinycolor.mix(light, '#1B5E20', 70).toHexString();
        sheet.insertRule(`${extra}.assignment${selector} { background-color: ${light}; }`, 0);
        sheet.insertRule(`${extra}.assignment${selector}.done { background-color: ${dark}; }`, 0);
        sheet.insertRule(`${extra}.assignment${selector}::before { background-color: ${mixed}; }`, 0);
        sheet.insertRule(`${extra}.assignmentItem${selector}>i { background-color: ${light}; }`, 0);
        sheet.insertRule(`${extra}.assignmentItem${selector}.done>i { background-color: ${dark}; }`, 0);
    };
    const createPalette = (color) => tinycolor(color).darken(24).toHexString();
    if (localStorage.colorType === 'assignment') {
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
            Object(_util__WEBPACK_IMPORTED_MODULE_12__["localStorageWrite"])(e.name, e.checked);
        }
        else {
            Object(_util__WEBPACK_IMPORTED_MODULE_12__["localStorageWrite"])(e.name, e.value);
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
            case 'sepTasks': return Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('sepTasksRefresh').style.display = 'block';
        }
    });
});
// This also needs to be done for radio buttons
const colorType = Object(_util__WEBPACK_IMPORTED_MODULE_12__["_$"])(document.querySelector(`input[name=\"colorType\"][value=\"${localStorage.colorType}\"]`));
colorType.checked = true;
Array.from(document.getElementsByName('colorType')).forEach((c) => {
    c.addEventListener('change', (evt) => {
        const v = Object(_util__WEBPACK_IMPORTED_MODULE_12__["_$"])(document.querySelector('input[name="colorType"]:checked')).value;
        localStorage.colorType = v;
        if (v === 'class') {
            Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('assignmentColors').style.display = 'none';
            Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('classColors').style.display = 'block';
        }
        else {
            Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('assignmentColors').style.display = 'block';
            Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('classColors').style.display = 'none';
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
const triedLastUpdate = Object(_util__WEBPACK_IMPORTED_MODULE_12__["localStorageRead"])('lastUpdate');
Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('lastUpdate').innerHTML = triedLastUpdate ? Object(_display__WEBPACK_IMPORTED_MODULE_6__["formatUpdate"])(triedLastUpdate) : 'Never';
if (Object(_util__WEBPACK_IMPORTED_MODULE_12__["localStorageRead"])('data') != null) {
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
const dragTarget = new Hammer(Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('dragTarget'));
dragTarget.on('pan', (e) => {
    if (e.pointerType === 'touch') {
        e.preventDefault();
        let { x } = e.center;
        const { y } = e.center;
        const sbkg = Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('sideBackground');
        sbkg.style.display = 'block';
        sbkg.style.opacity = '0';
        Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('sideNav').classList.add('manual');
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
        Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('sideNav').style.transform = `translateX(${x - 240}px)`;
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
            sideNav = Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('sideNav');
            sideNav.classList.remove('manual');
            sideNav.classList.add('active');
            sideNav.style.transform = '';
            Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('dragTarget').style.width = '100%';
        }
        else if (!menuOut || (velocityX > 0.3)) {
            document.body.style.overflow = 'auto';
            sideNav = Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('sideNav');
            sideNav.classList.remove('manual');
            sideNav.classList.remove('active');
            sideNav.style.transform = '';
            Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('sideBackground').style.opacity = '';
            Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('dragTarget').style.width = '10px';
            setTimeout(() => Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('sideBackground').style.display = 'none', 350);
        }
    }
});
dragTarget.on('tap', (e) => {
    Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('sideBackground').click();
    e.preventDefault();
});
const dt = document.getElementById('dragTarget');
// The activity filter button also needs an event listener.
Object(_util__WEBPACK_IMPORTED_MODULE_12__["ripple"])(Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('filterActivity'));
Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('filterActivity').addEventListener('click', () => {
    Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('infoActivity').classList.toggle('filter');
});
// At the start, it needs to be correctly populated
const activityTypes = Object(_util__WEBPACK_IMPORTED_MODULE_12__["localStorageRead"])('shownActivity', {
    add: true,
    edit: true,
    delete: true
});
function updateSelectNum() {
    const c = (bool) => bool ? 1 : 0;
    const count = String(c(activityTypes.add) + c(activityTypes.edit) + c(activityTypes.delete));
    return Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('selectNum').innerHTML = count;
}
updateSelectNum();
Object.entries(activityTypes).forEach(([type, enabled]) => {
    if (type !== 'add' && type !== 'edit' && type !== 'delete') {
        throw new Error(`Invalid activity type ${type}`);
    }
    const selectEl = Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])(type + 'Select');
    selectEl.checked = enabled;
    if (enabled) {
        Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('infoActivity').classList.add(type);
    }
    selectEl.addEventListener('change', (evt) => {
        activityTypes[type] = selectEl.checked;
        Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('infoActivity').setAttribute('data-filtered', updateSelectNum());
        Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('infoActivity').classList.toggle(type);
        return localStorage.shownActivity = JSON.stringify(activityTypes);
    });
});
// The show completed tasks checkbox is set correctly and is assigned an event listener.
const showDoneTasksEl = Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('showDoneTasks');
if (Object(_util__WEBPACK_IMPORTED_MODULE_12__["localStorageRead"])('showDoneTasks')) {
    showDoneTasksEl.checked = true;
    Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('infoTasksInner').classList.add('showDoneTasks');
}
showDoneTasksEl.addEventListener('change', () => {
    Object(_util__WEBPACK_IMPORTED_MODULE_12__["localStorageWrite"])('showDoneTasks', showDoneTasksEl.checked);
    Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('infoTasksInner').classList.toggle('showDoneTasks', showDoneTasksEl.checked);
});
// <a name="updates"/>
// Updates and News
// ----------------
//
if (location.protocol === 'chrome-extension:') {
    Object(_app__WEBPACK_IMPORTED_MODULE_0__["checkCommit"])();
}
// This update dialog also needs to be closed when the buttons are clicked.
Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('updateDelay').addEventListener('click', () => {
    Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('update').classList.remove('active');
    setTimeout(() => {
        Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('updateBackground').style.display = 'none';
    }, 350);
});
// For news, the latest news is fetched from a GitHub gist.
Object(_app__WEBPACK_IMPORTED_MODULE_0__["fetchNews"])();
// The news dialog then needs to be closed when OK or the background is clicked.
function closeNews() {
    Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('news').classList.remove('active');
    setTimeout(() => {
        Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('newsBackground').style.display = 'none';
    }, 350);
}
Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('newsOk').addEventListener('click', closeNews);
Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('newsBackground').addEventListener('click', closeNews);
// It also needs to be opened when the news button is clicked.
Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('newsB').addEventListener('click', () => {
    Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('sideBackground').click();
    const dispNews = () => {
        Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('newsBackground').style.display = 'block';
        return Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('news').classList.add('active');
    };
    if (Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('newsContent').childNodes.length === 0) {
        Object(_app__WEBPACK_IMPORTED_MODULE_0__["getNews"])(dispNews);
    }
    else {
        dispNews();
    }
});
// The same goes for the error dialog.
function closeError() {
    Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('error').classList.remove('active');
    setTimeout(() => {
        Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('errorBackground').style.display = 'none';
    }, 350);
}
Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('errorNo').addEventListener('click', closeError);
Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('errorBackground').addEventListener('click', closeError);
// <a name="new"/>
// Adding new assignments
// ----------------------
//
// The event listeners for the new buttons are added.
Object(_util__WEBPACK_IMPORTED_MODULE_12__["ripple"])(Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('new'));
Object(_util__WEBPACK_IMPORTED_MODULE_12__["ripple"])(Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('newTask'));
const onNewTask = () => {
    Object(_components_customAdder__WEBPACK_IMPORTED_MODULE_3__["updateNewTips"])(Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('newText').value = '');
    document.body.style.overflow = 'hidden';
    Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('newBackground').style.display = 'block';
    Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('newDialog').classList.add('active');
    Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('newText').focus();
};
Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('new').addEventListener('mouseup', onNewTask);
Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('newTask').addEventListener('mouseup', onNewTask);
// A function to close the dialog is then defined.
function closeNew() {
    document.body.style.overflow = 'auto';
    Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('newDialog').classList.remove('active');
    setTimeout(() => {
        Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('newBackground').style.display = 'none';
    }, 350);
}
// This function is set to be called called when the ESC key is called inside of the dialog.
Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('newText').addEventListener('keydown', (evt) => {
    if (evt.which === 27) { // Escape key pressed
        closeNew();
    }
});
// An event listener to call the function is also added to the X button
Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('newCancel').addEventListener('click', closeNew);
// When the enter key is pressed or the submit button is clicked, the new assignment is added.
Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('newDialog').addEventListener('submit', (evt) => {
    evt.preventDefault();
    const text = Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('newText').value;
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
Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('newText').addEventListener('input', () => {
    return Object(_components_customAdder__WEBPACK_IMPORTED_MODULE_3__["updateNewTips"])(Object(_util__WEBPACK_IMPORTED_MODULE_12__["elemById"])('newText').value);
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
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../util */ "./src/util.ts");
/* harmony import */ var _resizer__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./resizer */ "./src/components/resizer.ts");











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
    Object(_util__WEBPACK_IMPORTED_MODULE_9__["_$"])(edits.querySelector('.additions')).innerHTML = added !== 0 ? `+${added}` : '';
    Object(_util__WEBPACK_IMPORTED_MODULE_9__["_$"])(edits.querySelector('.deletions')).innerHTML = deleted !== 0 ? `-${deleted}` : '';
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
    const e = Object(_util__WEBPACK_IMPORTED_MODULE_9__["element"])('div', ['assignment', assignment.baseType, 'anim'], `<${smallTag}${link ? ` href='${link}' class='linked' target='_blank'` : ''}>
                           <span class='extra'>${separated[1]}</span>
                           ${separated[2]}
                       </${smallTag}><span class='title'>${assignment.title}</span>
                       <input type='hidden' class='due'
                              value='${assignment.end === 'Forever' ? 0 : assignment.end}' />`, assignment.id + weekId);
    if ((reference && reference.done) || Object(_plugins_done__WEBPACK_IMPORTED_MODULE_7__["assignmentInDone"])(assignment.id)) {
        e.classList.add('done');
    }
    e.setAttribute('data-class', assignmentClass(assignment, data));
    const close = Object(_util__WEBPACK_IMPORTED_MODULE_9__["element"])('a', ['close', 'material-icons'], 'close');
    close.addEventListener('click', closeOpened);
    e.appendChild(close);
    // Prevent clicking the class name when an item is displayed on the calendar from doing anything
    if (link != null) {
        Object(_util__WEBPACK_IMPORTED_MODULE_9__["_$"])(e.querySelector('a')).addEventListener('click', (evt) => {
            if ((document.body.getAttribute('data-view') === '0') && !e.classList.contains('full')) {
                evt.preventDefault();
            }
        });
    }
    const complete = Object(_util__WEBPACK_IMPORTED_MODULE_9__["element"])('a', ['complete', 'material-icons', 'waves'], 'done');
    Object(_util__WEBPACK_IMPORTED_MODULE_9__["ripple"])(complete);
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
                    Object(_resizer__WEBPACK_IMPORTED_MODULE_10__["resize"])();
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
        const deleteA = Object(_util__WEBPACK_IMPORTED_MODULE_9__["element"])('a', ['material-icons', 'deleteAssignment', 'waves'], 'delete');
        Object(_util__WEBPACK_IMPORTED_MODULE_9__["ripple"])(deleteA);
        deleteA.addEventListener('mouseup', (evt) => {
            if (evt.which !== 1 || !reference)
                return;
            Object(_plugins_customAssignments__WEBPACK_IMPORTED_MODULE_6__["removeFromExtra"])(reference);
            Object(_plugins_customAssignments__WEBPACK_IMPORTED_MODULE_6__["saveExtra"])();
            if (document.querySelector('.full') != null) {
                document.body.style.overflow = 'auto';
                const back = Object(_util__WEBPACK_IMPORTED_MODULE_9__["elemById"])('background');
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
    const edit = Object(_util__WEBPACK_IMPORTED_MODULE_9__["element"])('a', ['editAssignment', 'material-icons', 'waves'], 'edit');
    edit.addEventListener('mouseup', (evt) => {
        if (evt.which === 1) {
            const remove = edit.classList.contains('active');
            edit.classList.toggle('active');
            Object(_util__WEBPACK_IMPORTED_MODULE_9__["_$"])(e.querySelector('.body')).setAttribute('contentEditable', remove ? 'false' : 'true');
            if (!remove) {
                e.querySelector('.body').focus();
            }
            const dn = e.querySelector('.complete');
            dn.style.display = remove ? 'block' : 'none';
        }
    });
    Object(_util__WEBPACK_IMPORTED_MODULE_9__["ripple"])(edit);
    e.appendChild(edit);
    const start = new Date(Object(_dates__WEBPACK_IMPORTED_MODULE_0__["fromDateNum"])(assignment.start));
    const end = assignment.end === 'Forever' ? assignment.end : new Date(Object(_dates__WEBPACK_IMPORTED_MODULE_0__["fromDateNum"])(assignment.end));
    const times = Object(_util__WEBPACK_IMPORTED_MODULE_9__["element"])('div', 'range', assignment.start === assignment.end ? Object(_util__WEBPACK_IMPORTED_MODULE_9__["dateString"])(start) : `${Object(_util__WEBPACK_IMPORTED_MODULE_9__["dateString"])(start)} &ndash; ${Object(_util__WEBPACK_IMPORTED_MODULE_9__["dateString"])(end)}`);
    e.appendChild(times);
    if (assignment.attachments.length > 0) {
        const attachments = Object(_util__WEBPACK_IMPORTED_MODULE_9__["element"])('div', 'attachments');
        assignment.attachments.forEach((attachment) => {
            const a = Object(_util__WEBPACK_IMPORTED_MODULE_9__["element"])('a', [], attachment[0]);
            a.href = Object(_pcr__WEBPACK_IMPORTED_MODULE_3__["urlForAttachment"])(attachment[1]);
            Object(_pcr__WEBPACK_IMPORTED_MODULE_3__["getAttachmentMimeType"])(attachment[1]).then((type) => {
                let span;
                if (mimeTypes[type] != null) {
                    a.classList.add(mimeTypes[type][1]);
                    span = Object(_util__WEBPACK_IMPORTED_MODULE_9__["element"])('span', [], mimeTypes[type][0]);
                }
                else {
                    span = Object(_util__WEBPACK_IMPORTED_MODULE_9__["element"])('span', [], 'Unknown file type');
                }
                a.appendChild(span);
            });
            attachments.appendChild(a);
        });
        e.appendChild(attachments);
    }
    const body = Object(_util__WEBPACK_IMPORTED_MODULE_9__["element"])('div', 'body', assignment.body.replace(/font-family:[^;]*?(?:Times New Roman|serif)[^;]*/g, ''));
    const edits = Object(_util__WEBPACK_IMPORTED_MODULE_9__["element"])('div', 'edits', '<span class=\'additions\'></span><span class=\'deletions\'></span>');
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
            Object(_resizer__WEBPACK_IMPORTED_MODULE_10__["resize"])();
    });
    e.appendChild(body);
    const restore = Object(_util__WEBPACK_IMPORTED_MODULE_9__["element"])('a', ['material-icons', 'restore'], 'settings_backup_restore');
    restore.addEventListener('click', () => {
        Object(_plugins_modifiedAssignments__WEBPACK_IMPORTED_MODULE_8__["removeFromModified"])(assignment.id);
        Object(_plugins_modifiedAssignments__WEBPACK_IMPORTED_MODULE_8__["saveModified"])();
        body.innerHTML = assignment.body;
        edits.classList.remove('notEmpty');
        if (document.body.getAttribute('data-view') === '1')
            Object(_resizer__WEBPACK_IMPORTED_MODULE_10__["resize"])();
    });
    edits.appendChild(restore);
    e.appendChild(edits);
    const mods = Object(_util__WEBPACK_IMPORTED_MODULE_9__["element"])('div', ['mods']);
    Object(_plugins_activity__WEBPACK_IMPORTED_MODULE_4__["recentActivity"])().forEach((a) => {
        if ((a[0] === 'edit') && (a[1].id === assignment.id)) {
            const te = Object(_util__WEBPACK_IMPORTED_MODULE_9__["element"])('div', ['innerActivity', 'assignmentItem', assignment.baseType], `<i class='material-icons'>edit</i>
                            <span class='title'>${Object(_util__WEBPACK_IMPORTED_MODULE_9__["dateString"])(new Date(a[2]))}</span>
                            <span class='additions'></span><span class='deletions'></span>`, `ia${assignment.id}`);
            const d = dmp.diff_main(a[1].body, assignment.body);
            dmp.diff_cleanupSemantic(d);
            populateAddedDeleted(d, te);
            if (assignment.class)
                te.setAttribute('data-class', data.classes[assignment.class]);
            te.appendChild(Object(_util__WEBPACK_IMPORTED_MODULE_9__["element"])('div', 'iaDiff', dmp.diff_prettyHtml(d)));
            te.addEventListener('click', () => {
                te.classList.toggle('active');
                if (document.body.getAttribute('data-view') === '1')
                    Object(_resizer__WEBPACK_IMPORTED_MODULE_10__["resize"])();
            });
            mods.appendChild(te);
        }
    });
    e.appendChild(mods);
    if ((Object(_util__WEBPACK_IMPORTED_MODULE_9__["localStorageRead"])('assignmentSpan') === 'multiple') && (start < split.start)) {
        e.classList.add('fromWeekend');
    }
    if ((Object(_util__WEBPACK_IMPORTED_MODULE_9__["localStorageRead"])('assignmentSpan') === 'multiple') && (end > split.end)) {
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
        const push = (assignment.baseType === 'test' && assignment.start === st) ? Object(_util__WEBPACK_IMPORTED_MODULE_9__["localStorageRead"])('earlyTest') : 0;
        const endExtra = Object(_navigation__WEBPACK_IMPORTED_MODULE_2__["getListDateOffset"])() === 0 ? Object(_display__WEBPACK_IMPORTED_MODULE_1__["getTimeAfter"])(midDate) : 24 * 3600 * 1000;
        if (Object(_dates__WEBPACK_IMPORTED_MODULE_0__["fromDateNum"])(st - push) <= midDate &&
            (split.end === 'Forever' || midDate.getTime() <= split.end.getTime() + endExtra)) {
            e.classList.add('listDisp');
        }
    }
    // Add click interactivity
    if (!split.custom || !JSON.parse(localStorage.sepTasks)) {
        e.addEventListener('click', (evt) => {
            if ((document.getElementsByClassName('full').length === 0) &&
                (document.body.getAttribute('data-view') === '0')) {
                e.classList.remove('anim');
                e.classList.add('modify');
                e.style.top = (e.getBoundingClientRect().top - document.body.scrollTop
                    - Object(_util__WEBPACK_IMPORTED_MODULE_9__["cssNumber"])(e.style.marginTop)) + 44 + 'px';
                e.setAttribute('data-top', e.style.top);
                document.body.style.overflow = 'hidden';
                const back = Object(_util__WEBPACK_IMPORTED_MODULE_9__["elemById"])('background');
                back.classList.add('active');
                back.style.display = 'block';
                e.classList.add('anim');
                Object(_util__WEBPACK_IMPORTED_MODULE_9__["forceLayout"])(e);
                e.classList.add('full');
                e.style.top = (75 - Object(_util__WEBPACK_IMPORTED_MODULE_9__["cssNumber"])(e.style.marginTop)) + 'px';
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
    const back = Object(_util__WEBPACK_IMPORTED_MODULE_9__["elemById"])('background');
    back.classList.remove('active');
    setTimeout(() => {
        back.style.display = 'none';
        el.classList.remove('anim');
        el.classList.remove('modify');
        el.style.top = 'auto';
        Object(_util__WEBPACK_IMPORTED_MODULE_9__["forceLayout"])(el);
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
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./util */ "./src/util.ts");











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
    const hideassignments = localStorage.getItem('hideAssignments');
    if (hideassignments === 'day' || hideassignments === 'ms' || hideassignments === 'us') {
        return SCHEDULE_ENDS[hideassignments](date);
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
    if (Object(_util__WEBPACK_IMPORTED_MODULE_10__["localStorageRead"])('assignmentSpan') === 'multiple') {
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
    else if (Object(_util__WEBPACK_IMPORTED_MODULE_10__["localStorageRead"])('assignmentSpan') === 'start') {
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
    else if (Object(_util__WEBPACK_IMPORTED_MODULE_10__["localStorageRead"])('assignmentSpan') === 'end') {
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
        const main = Object(_util__WEBPACK_IMPORTED_MODULE_10__["_$"])(document.querySelector('main'));
        const taken = {};
        const timeafter = getTimeAfter(new Date());
        const { start, end } = getStartEndDates(data);
        // Set the start date to be a Sunday and the end date to be a Saturday
        start.setDate(start.getDate() - start.getDay());
        end.setDate(end.getDate() + (6 - end.getDay()));
        // First populate the calendar with boxes for each day
        const lastData = Object(_util__WEBPACK_IMPORTED_MODULE_10__["localStorageRead"])('data');
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
        const separateTaskClass = JSON.parse(localStorage.sepTaskClass);
        split.forEach((s) => {
            const weekId = Object(_components_assignment__WEBPACK_IMPORTED_MODULE_0__["computeWeekId"])(s);
            wk = document.getElementById(weekId);
            if (wk == null)
                return;
            const e = Object(_components_assignment__WEBPACK_IMPORTED_MODULE_0__["createAssignment"])(s, data);
            // Calculate how many assignments are placed before the current one
            if (!s.custom || !Object(_util__WEBPACK_IMPORTED_MODULE_10__["localStorageRead"])('sepTasks')) {
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
                (Object(_util__WEBPACK_IMPORTED_MODULE_10__["localStorageRead"])('projectsInTestPane') && s.assignment.baseType === 'longterm'))) {
                const te = Object(_util__WEBPACK_IMPORTED_MODULE_10__["element"])('div', ['upcomingTest', 'assignmentItem', s.assignment.baseType], `<i class='material-icons'>
                                        ${s.assignment.baseType === 'longterm' ? 'assignment' : 'assessment'}
                                    </i>
                                    <span class='title'>${s.assignment.title}</span>
                                    <small>${Object(_components_assignment__WEBPACK_IMPORTED_MODULE_0__["separatedClass"])(s.assignment, data)[2]}</small>
                                    <div class='range'>${Object(_util__WEBPACK_IMPORTED_MODULE_10__["dateString"])(s.assignment.end, true)}</div>`, `test${s.assignment.id}`);
                if (s.assignment.class)
                    te.setAttribute('data-class', data.classes[s.assignment.class]);
                te.addEventListener('click', () => {
                    const doScrolling = async () => {
                        await Object(_util__WEBPACK_IMPORTED_MODULE_10__["smoothScroll"])((e.getBoundingClientRect().top + document.body.scrollTop) - 116);
                        e.click();
                    };
                    if (document.body.getAttribute('data-view') === '0') {
                        doScrolling();
                    }
                    else {
                        Object(_util__WEBPACK_IMPORTED_MODULE_10__["_$"])(document.querySelector('#navTabs>li:first-child')).click();
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
                    Object(_util__WEBPACK_IMPORTED_MODULE_10__["elemById"])('infoTests').appendChild(te);
                }
            }
            const already = document.getElementById(s.assignment.id + weekId);
            if (already != null) { // Assignment already exists
                already.style.marginTop = e.style.marginTop;
                already.setAttribute('data-class', s.custom && separateTaskClass ? 'Task' : Object(_pcr__WEBPACK_IMPORTED_MODULE_5__["classById"])(s.assignment.class));
                if (!Object(_plugins_modifiedAssignments__WEBPACK_IMPORTED_MODULE_9__["assignmentInModified"])(s.assignment.id)) {
                    already.getElementsByClassName('body')[0].innerHTML = e.getElementsByClassName('body')[0].innerHTML;
                }
                Object(_util__WEBPACK_IMPORTED_MODULE_10__["_$"])(already.querySelector('.edits')).className = Object(_util__WEBPACK_IMPORTED_MODULE_10__["_$"])(e.querySelector('.edits')).className;
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
                if (s.custom && JSON.parse(localStorage.sepTasks)) {
                    const st = Math.floor(s.start.getTime() / 1000 / 3600 / 24);
                    if ((s.assignment.start === st) &&
                        (s.assignment.end === 'Forever' || s.assignment.end >= Object(_dates__WEBPACK_IMPORTED_MODULE_4__["today"])())) {
                        e.classList.remove('assignment');
                        e.classList.add('taskPaneItem');
                        e.style.order = String(s.assignment.end === 'Forever' ? Number.MAX_VALUE : s.assignment.end);
                        const link = e.querySelector('.linked');
                        if (link) {
                            e.insertBefore(Object(_util__WEBPACK_IMPORTED_MODULE_10__["element"])('small', [], link.innerHTML), link);
                            link.remove();
                        }
                        Object(_util__WEBPACK_IMPORTED_MODULE_10__["elemById"])('infoTasksInner').appendChild(e);
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
                Object(_util__WEBPACK_IMPORTED_MODULE_10__["elemById"])('background').classList.remove('active');
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
    const divs = [...b.getElementsByTagName('div')].splice(0, 2);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50LnRzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2FjdGl2aXR5LnRzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2Fzc2lnbm1lbnQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvYXZhdGFyLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2NhbGVuZGFyLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2N1c3RvbUFkZGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2Vycm9yRGlzcGxheS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9yZXNpemVyLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL3NuYWNrYmFyLnRzIiwid2VicGFjazovLy8uL3NyYy9jb29raWVzLnRzIiwid2VicGFjazovLy8uL3NyYy9kYXRlcy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZGlzcGxheS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbmF2aWdhdGlvbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGNyLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW5zL2FjdGl2aXR5LnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW5zL2F0aGVuYS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2lucy9jdXN0b21Bc3NpZ25tZW50cy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2lucy9kb25lLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW5zL21vZGlmaWVkQXNzaWdubWVudHMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFD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WUFBWTtJQUN2QyxDQUFDLENBQUM7SUFDRixFQUFFLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUU7UUFDbkMsSUFBSSxHQUFHLENBQUMsS0FBSyxLQUFLLENBQUM7WUFBRSxPQUFNLENBQUMsdUJBQXVCO1FBQ25ELE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQyxNQUFNLENBQUM7UUFDL0MsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO1lBQ25CLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUNoRSxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBQ3JDLFVBQVUsQ0FBQyxHQUFHLEVBQUU7Z0JBQ1gsSUFBb0IsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLEdBQUc7Z0JBQ3pDLFVBQVUsQ0FBQyxHQUFHLEVBQUU7b0JBQ1osSUFBSSxDQUFDLE1BQU0sRUFBRTtnQkFDakIsQ0FBQyxFQUFFLEdBQUcsQ0FBQztZQUNYLENBQUMsRUFBRSxLQUFLLENBQUM7UUFDYixDQUFDLENBQUM7SUFDTixDQUFDLENBQUM7QUFDTixDQUFDO0FBRUssbUJBQW9CLEdBQWdCO0lBQ3RDLElBQUksQ0FBQyxHQUFHO1FBQUUsT0FBTyxDQUFDO0lBQ2xCLE9BQU8sUUFBUSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUM7QUFDNUIsQ0FBQyIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvY2xpZW50LnRzXCIpO1xuIiwiaW1wb3J0IHsgZWxlbUJ5SWQsIGVsZW1lbnQsIGxvY2FsU3RvcmFnZVJlYWQsIGxvY2FsU3RvcmFnZVdyaXRlLCBzZW5kIH0gZnJvbSAnLi91dGlsJ1xyXG5cclxuZXhwb3J0IGNvbnN0IFZFUlNJT04gPSAnMi4yNC4zJ1xyXG5cclxuY29uc3QgVkVSU0lPTl9VUkwgPSAnaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tLzE5UnlhbkEvQ2hlY2tQQ1IvbWFzdGVyL3ZlcnNpb24udHh0J1xyXG5jb25zdCBDT01NSVRfVVJMID0gKGxvY2F0aW9uLnByb3RvY29sID09PSAnY2hyb21lLWV4dGVuc2lvbjonID9cclxuICAgICdodHRwczovL2FwaS5naXRodWIuY29tL3JlcG9zLzE5UnlhbkEvQ2hlY2tQQ1IvZ2l0L3JlZnMvaGVhZHMvbWFzdGVyJyA6ICcvYXBpL2NvbW1pdCcpXHJcbmNvbnN0IE5FV1NfVVJMID0gJ2h0dHBzOi8vYXBpLmdpdGh1Yi5jb20vZ2lzdHMvMjFiZjExYTQyOWRhMjU3NTM5YTY4NTIwZjUxM2EzOGInXHJcblxyXG5mdW5jdGlvbiBmb3JtYXRDb21taXRNZXNzYWdlKG1lc3NhZ2U6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gbWVzc2FnZS5zdWJzdHIobWVzc2FnZS5pbmRleE9mKCdcXG5cXG4nKSArIDIpXHJcbiAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXCogKC4qPykoPz0kfFxcbikvZywgKGEsIGIpID0+IGA8bGk+JHtifTwvbGk+YClcclxuICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLz5cXG48L2csICc+PCcpXHJcbiAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXG4vZywgJzxicj4nKVxyXG59XHJcblxyXG4vLyBGb3IgdXBkYXRpbmcsIGEgcmVxdWVzdCB3aWxsIGJlIHNlbmQgdG8gR2l0aHViIHRvIGdldCB0aGUgY3VycmVudCBjb21taXQgaWQgYW5kIGNoZWNrIHRoYXQgYWdhaW5zdCB3aGF0J3Mgc3RvcmVkXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjaGVja0NvbW1pdCgpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcmVzcCA9IGF3YWl0IHNlbmQoVkVSU0lPTl9VUkwsICd0ZXh0JylcclxuICAgICAgICBjb25zdCBjID0gcmVzcC5yZXNwb25zZVRleHQudHJpbSgpXHJcbiAgICAgICAgY29uc29sZS5sb2coYEN1cnJlbnQgdmVyc2lvbjogJHtjfSAke1ZFUlNJT04gPT09IGMgPyAnKG5vIHVwZGF0ZSBhdmFpbGFibGUpJyA6ICcodXBkYXRlIGF2YWlsYWJsZSknfWApXHJcbiAgICAgICAgZWxlbUJ5SWQoJ25ld3ZlcnNpb24nKS5pbm5lckhUTUwgPSBjXHJcbiAgICAgICAgaWYgKFZFUlNJT04gIT09IGMpIHtcclxuICAgICAgICAgICAgZWxlbUJ5SWQoJ3VwZGF0ZUlnbm9yZScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGxvY2F0aW9uLnByb3RvY29sID09PSAnY2hyb21lLWV4dGVuc2lvbjonKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbUJ5SWQoJ3VwZGF0ZScpLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1CeUlkKCd1cGRhdGVCYWNrZ3JvdW5kJykuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0sIDM1MClcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3AyID0gYXdhaXQgc2VuZChDT01NSVRfVVJMLCAnanNvbicpXHJcbiAgICAgICAgICAgIGNvbnN0IHsgc2hhLCB1cmwgfSA9IHJlc3AyLnJlc3BvbnNlLm9iamVjdFxyXG4gICAgICAgICAgICBjb25zdCByZXNwMyA9IGF3YWl0IHNlbmQoKGxvY2F0aW9uLnByb3RvY29sID09PSAnY2hyb21lLWV4dGVuc2lvbjonID8gdXJsIDogYC9hcGkvY29tbWl0LyR7c2hhfWApLCAnanNvbicpXHJcbiAgICAgICAgICAgIGVsZW1CeUlkKCdwYXN0VXBkYXRlVmVyc2lvbicpLmlubmVySFRNTCA9IFZFUlNJT05cclxuICAgICAgICAgICAgZWxlbUJ5SWQoJ25ld1VwZGF0ZVZlcnNpb24nKS5pbm5lckhUTUwgPSBjXHJcbiAgICAgICAgICAgIGVsZW1CeUlkKCd1cGRhdGVGZWF0dXJlcycpLmlubmVySFRNTCA9IGZvcm1hdENvbW1pdE1lc3NhZ2UocmVzcDMucmVzcG9uc2UubWVzc2FnZSlcclxuICAgICAgICAgICAgZWxlbUJ5SWQoJ3VwZGF0ZUJhY2tncm91bmQnKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xyXG4gICAgICAgICAgICBlbGVtQnlJZCgndXBkYXRlJykuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuICAgICAgICB9XHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnQ291bGQgbm90IGFjY2VzcyBHaXRodWIuIEhlcmVcXCdzIHRoZSBlcnJvcjonLCBlcnIpXHJcbiAgICB9XHJcbn1cclxuXHJcbmxldCBuZXdzVXJsOiBzdHJpbmd8bnVsbCA9IG51bGxcclxubGV0IG5ld3NDb21taXQ6IHN0cmluZ3xudWxsID0gbnVsbFxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZldGNoTmV3cygpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcmVzcCA9IGF3YWl0IHNlbmQoTkVXU19VUkwsICdqc29uJylcclxuICAgICAgICBsZXQgbGFzdCA9IGxvY2FsU3RvcmFnZVJlYWQoJ25ld3NDb21taXQnKVxyXG4gICAgICAgIG5ld3NDb21taXQgPSByZXNwLnJlc3BvbnNlLmhpc3RvcnlbMF0udmVyc2lvblxyXG5cclxuICAgICAgICBpZiAobGFzdCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGxhc3QgPSBuZXdzQ29tbWl0XHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZVdyaXRlKCduZXdzQ29tbWl0JywgbmV3c0NvbW1pdClcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG5ld3NVcmwgPSByZXNwLnJlc3BvbnNlLmZpbGVzWyd1cGRhdGVzLmh0bSddLnJhd191cmxcclxuXHJcbiAgICAgICAgaWYgKGxhc3QgIT09IG5ld3NDb21taXQpIHtcclxuICAgICAgICAgICAgZ2V0TmV3cygpXHJcbiAgICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ0NvdWxkIG5vdCBhY2Nlc3MgR2l0aHViLiBIZXJlXFwncyB0aGUgZXJyb3I6JywgZXJyKVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0TmV3cyhvbmZhaWw/OiAoKSA9PiB2b2lkKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICBpZiAoIW5ld3NVcmwpIHtcclxuICAgICAgICBpZiAob25mYWlsKSBvbmZhaWwoKVxyXG4gICAgICAgIHJldHVyblxyXG4gICAgfVxyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCByZXNwID0gYXdhaXQgc2VuZChuZXdzVXJsKVxyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5uZXdzQ29tbWl0ID0gbmV3c0NvbW1pdFxyXG4gICAgICAgIHJlc3AucmVzcG9uc2VUZXh0LnNwbGl0KCc8aHI+JykuZm9yRWFjaCgobmV3cykgPT4ge1xyXG4gICAgICAgICAgICBlbGVtQnlJZCgnbmV3c0NvbnRlbnQnKS5hcHBlbmRDaGlsZChlbGVtZW50KCdkaXYnLCAnbmV3c0l0ZW0nLCBuZXdzKSlcclxuICAgICAgICB9KVxyXG4gICAgICAgIGVsZW1CeUlkKCduZXdzQmFja2dyb3VuZCcpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXHJcbiAgICAgICAgZWxlbUJ5SWQoJ25ld3MnKS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG4gICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ0NvdWxkIG5vdCBhY2Nlc3MgR2l0aHViLiBIZXJlXFwncyB0aGUgZXJyb3I6JywgZXJyKVxyXG4gICAgICAgIGlmIChvbmZhaWwpIG9uZmFpbCgpXHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgY2hlY2tDb21taXQsIGZldGNoTmV3cywgZ2V0TmV3cywgVkVSU0lPTiB9IGZyb20gJy4vYXBwJ1xyXG5pbXBvcnQgeyBjbG9zZU9wZW5lZCB9IGZyb20gJy4vY29tcG9uZW50cy9hc3NpZ25tZW50J1xyXG5pbXBvcnQgeyB1cGRhdGVBdmF0YXIgfSBmcm9tICcuL2NvbXBvbmVudHMvYXZhdGFyJ1xyXG5pbXBvcnQgeyB1cGRhdGVOZXdUaXBzIH0gZnJvbSAnLi9jb21wb25lbnRzL2N1c3RvbUFkZGVyJ1xyXG5pbXBvcnQgeyBnZXRSZXNpemVBc3NpZ25tZW50cywgcmVzaXplLCByZXNpemVDYWxsZXIgfSBmcm9tICcuL2NvbXBvbmVudHMvcmVzaXplcidcclxuaW1wb3J0IHsgdG9EYXRlTnVtLCB0b2RheSB9IGZyb20gJy4vZGF0ZXMnXHJcbmltcG9ydCB7IGRpc3BsYXksIGZvcm1hdFVwZGF0ZSwgZ2V0U2Nyb2xsIH0gZnJvbSAnLi9kaXNwbGF5J1xyXG5pbXBvcnQge1xyXG4gICAgZGVjcmVtZW50TGlzdERhdGVPZmZzZXQsXHJcbiAgICBnZXRMaXN0RGF0ZU9mZnNldCxcclxuICAgIGluY3JlbWVudExpc3REYXRlT2Zmc2V0LFxyXG4gICAgc2V0TGlzdERhdGVPZmZzZXQsXHJcbiAgICB6ZXJvTGlzdERhdGVPZmZzZXRcclxufSBmcm9tICcuL25hdmlnYXRpb24nXHJcbmltcG9ydCB7IGRvbG9naW4sIGZldGNoLCBnZXREYXRhLCBsb2dvdXQsIHNldERhdGEsIHN3aXRjaFZpZXdzIH0gZnJvbSAnLi9wY3InXHJcbmltcG9ydCB7IGFkZEFjdGl2aXR5LCByZWNlbnRBY3Rpdml0eSB9IGZyb20gJy4vcGx1Z2lucy9hY3Rpdml0eSdcclxuaW1wb3J0IHsgdXBkYXRlQXRoZW5hRGF0YSB9IGZyb20gJy4vcGx1Z2lucy9hdGhlbmEnXHJcbmltcG9ydCB7IGFkZFRvRXh0cmEsIHBhcnNlQ3VzdG9tVGFzaywgc2F2ZUV4dHJhIH0gZnJvbSAnLi9wbHVnaW5zL2N1c3RvbUFzc2lnbm1lbnRzJ1xyXG5pbXBvcnQge1xyXG4gICAgXyQsXHJcbiAgICBfJGgsXHJcbiAgICBkYXRlU3RyaW5nLFxyXG4gICAgZWxlbUJ5SWQsXHJcbiAgICBlbGVtZW50LFxyXG4gICAgZm9yY2VMYXlvdXQsXHJcbiAgICBsb2NhbFN0b3JhZ2VSZWFkLFxyXG4gICAgbG9jYWxTdG9yYWdlV3JpdGUsXHJcbiAgICByZXF1ZXN0SWRsZUNhbGxiYWNrLFxyXG4gICAgcmlwcGxlXHJcbn0gZnJvbSAnLi91dGlsJ1xyXG5cclxuLy8gQHRzLWlnbm9yZSBUT0RPOiBNYWtlIHRoaXMgbGVzcyBoYWNreVxyXG5Ob2RlTGlzdC5wcm90b3R5cGUuZm9yRWFjaCA9IEhUTUxDb2xsZWN0aW9uLnByb3RvdHlwZS5mb3JFYWNoID0gQXJyYXkucHJvdG90eXBlLmZvckVhY2hcclxuXHJcbmlmIChsb2NhbFN0b3JhZ2VSZWFkKCdkYXRhJykgIT0gbnVsbCkge1xyXG4gICAgc2V0RGF0YShsb2NhbFN0b3JhZ2VSZWFkKCdkYXRhJykpXHJcbn1cclxuXHJcbi8vIEFkZGl0aW9uYWxseSwgaWYgaXQncyB0aGUgdXNlcidzIGZpcnN0IHRpbWUsIHRoZSBwYWdlIGlzIHNldCB0byB0aGUgd2VsY29tZSBwYWdlLlxyXG5pZiAoIWxvY2FsU3RvcmFnZVJlYWQoJ25vV2VsY29tZScpKSB7XHJcbiAgICBsb2NhbFN0b3JhZ2VXcml0ZSgnbm9XZWxjb21lJywgdHJ1ZSlcclxuICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJ3dlbGNvbWUuaHRtbCdcclxufVxyXG5cclxuY29uc3QgTkFWX0VMRU1FTlQgPSBfJChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCduYXYnKSlcclxuY29uc3QgSU5QVVRfRUxFTUVOVFMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFxyXG4gICAgJ2lucHV0W3R5cGU9dGV4dF06bm90KCNuZXdUZXh0KTpub3QoW3JlYWRvbmx5XSksIGlucHV0W3R5cGU9cGFzc3dvcmRdLCBpbnB1dFt0eXBlPWVtYWlsXSwgJyArXHJcbiAgICAnaW5wdXRbdHlwZT11cmxdLCBpbnB1dFt0eXBlPXRlbF0sIGlucHV0W3R5cGU9bnVtYmVyXTpub3QoLmNvbnRyb2wpLCBpbnB1dFt0eXBlPXNlYXJjaF0nXHJcbikgYXMgTm9kZUxpc3RPZjxIVE1MSW5wdXRFbGVtZW50PlxyXG5cclxuLy8gIyMjIyBTZW5kIGZ1bmN0aW9uXHJcbi8vXHJcblxyXG4vLyBUaGlzIGZ1bmN0aW9uIGRpc3BsYXlzIGEgc25hY2tiYXIgdG8gdGVsbCB0aGUgdXNlciBzb21ldGhpbmdcclxuXHJcbi8vIDxhIG5hbWU9XCJyZXRcIi8+XHJcbi8vIFJldHJpZXZpbmcgZGF0YVxyXG4vLyAtLS0tLS0tLS0tLS0tLS1cclxuLy9cclxuZWxlbUJ5SWQoJ2xvZ2luJykuYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgKGV2dCkgPT4ge1xyXG4gICAgZXZ0LnByZXZlbnREZWZhdWx0KClcclxuICAgIGRvbG9naW4obnVsbCwgdHJ1ZSlcclxufSlcclxuXHJcbi8vIFRoZSB2aWV3IHN3aXRjaGluZyBidXR0b24gbmVlZHMgYW4gZXZlbnQgaGFuZGxlci5cclxuZWxlbUJ5SWQoJ3N3aXRjaFZpZXdzJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzd2l0Y2hWaWV3cylcclxuXHJcbi8vIFRoZSBzYW1lIGdvZXMgZm9yIHRoZSBsb2cgb3V0IGJ1dHRvbi5cclxuZWxlbUJ5SWQoJ2xvZ291dCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgbG9nb3V0KVxyXG5cclxuLy8gTm93IHdlIGFzc2lnbiBpdCB0byBjbGlja2luZyB0aGUgYmFja2dyb3VuZC5cclxuZWxlbUJ5SWQoJ2JhY2tncm91bmQnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsb3NlT3BlbmVkKVxyXG5cclxuLy8gVGhlbiwgdGhlIHRhYnMgYXJlIG1hZGUgaW50ZXJhY3RpdmUuXHJcbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyNuYXZUYWJzPmxpJykuZm9yRWFjaCgodGFiLCB0YWJJbmRleCkgPT4ge1xyXG4gIHRhYi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldnQpID0+IHtcclxuICAgIGNvbnN0IHRyYW5zID0gbG9jYWxTdG9yYWdlUmVhZCgndmlld1RyYW5zJylcclxuICAgIGlmICghdHJhbnMpIHtcclxuICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdub1RyYW5zJylcclxuICAgICAgZm9yY2VMYXlvdXQoZG9jdW1lbnQuYm9keSlcclxuICAgIH1cclxuICAgIGxvY2FsU3RvcmFnZVdyaXRlKCd2aWV3JywgdGFiSW5kZXgpXHJcbiAgICBkb2N1bWVudC5ib2R5LnNldEF0dHJpYnV0ZSgnZGF0YS12aWV3JywgU3RyaW5nKHRhYkluZGV4KSlcclxuICAgIGlmICh0YWJJbmRleCA9PT0gMSkge1xyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCByZXNpemVDYWxsZXIpXHJcbiAgICAgICAgaWYgKHRyYW5zKSB7XHJcbiAgICAgICAgbGV0IHN0YXJ0OiBudW1iZXJ8bnVsbCA9IG51bGxcclxuICAgICAgICAvLyBUaGUgY29kZSBiZWxvdyBpcyB0aGUgc2FtZSBjb2RlIHVzZWQgaW4gdGhlIHJlc2l6ZSgpIGZ1bmN0aW9uLiBJdCBiYXNpY2FsbHkganVzdFxyXG4gICAgICAgIC8vIHBvc2l0aW9ucyB0aGUgYXNzaWdubWVudHMgY29ycmVjdGx5IGFzIHRoZXkgYW5pbWF0ZVxyXG4gICAgICAgIGNvbnN0IHdpZHRocyA9IGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKCdzaG93SW5mbycpID9cclxuICAgICAgICAgICAgWzY1MCwgMTEwMCwgMTgwMCwgMjcwMCwgMzgwMCwgNTEwMF0gOiBbMzUwLCA4MDAsIDE1MDAsIDI0MDAsIDM1MDAsIDQ4MDBdXHJcbiAgICAgICAgbGV0IGNvbHVtbnMgPSAxXHJcbiAgICAgICAgd2lkdGhzLmZvckVhY2goKHcsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA+IHcpIHsgY29sdW1ucyA9IGluZGV4ICsgMSB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICBjb25zdCBhc3NpZ25tZW50cyA9IGdldFJlc2l6ZUFzc2lnbm1lbnRzKClcclxuICAgICAgICBjb25zdCBjb2x1bW5IZWlnaHRzID0gQXJyYXkuZnJvbShuZXcgQXJyYXkoY29sdW1ucyksICgpID0+IDApXHJcbiAgICAgICAgY29uc3Qgc3RlcCA9ICh0aW1lc3RhbXA6IG51bWJlcikgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIWNvbHVtbnMpIHRocm93IG5ldyBFcnJvcignQ29sdW1ucyBudW1iZXIgbm90IGZvdW5kJylcclxuICAgICAgICAgICAgaWYgKHN0YXJ0ID09IG51bGwpIHsgc3RhcnQgPSB0aW1lc3RhbXAgfVxyXG4gICAgICAgICAgICBhc3NpZ25tZW50cy5mb3JFYWNoKChhc3NpZ25tZW50LCBuKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb2wgPSBuICUgY29sdW1uc1xyXG4gICAgICAgICAgICAgICAgaWYgKG4gPCBjb2x1bW5zKSB7XHJcbiAgICAgICAgICAgICAgICBjb2x1bW5IZWlnaHRzW2NvbF0gPSAwXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBhc3NpZ25tZW50LnN0eWxlLnRvcCA9IGNvbHVtbkhlaWdodHNbY29sXSArICdweCdcclxuICAgICAgICAgICAgICAgIGFzc2lnbm1lbnQuc3R5bGUubGVmdCA9ICgoMTAwIC8gY29sdW1ucykgKiBjb2wpICsgJyUnXHJcbiAgICAgICAgICAgICAgICBhc3NpZ25tZW50LnN0eWxlLnJpZ2h0ID0gKCgxMDAgLyBjb2x1bW5zKSAqIChjb2x1bW5zIC0gY29sIC0gMSkpICsgJyUnXHJcbiAgICAgICAgICAgICAgICBjb2x1bW5IZWlnaHRzW2NvbF0gKz0gYXNzaWdubWVudC5vZmZzZXRIZWlnaHQgKyAyNFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICBpZiAoKHRpbWVzdGFtcCAtIHN0YXJ0KSA8IDM1MCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RlcClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0ZXApXHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghY29sdW1ucykgdGhyb3cgbmV3IEVycm9yKCdDb2x1bW5zIG51bWJlciBub3QgZm91bmQnKVxyXG4gICAgICAgICAgICBhc3NpZ25tZW50cy5mb3JFYWNoKChhc3NpZ25tZW50LCBuKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb2wgPSBuICUgY29sdW1uc1xyXG4gICAgICAgICAgICAgICAgaWYgKG4gPCBjb2x1bW5zKSB7XHJcbiAgICAgICAgICAgICAgICBjb2x1bW5IZWlnaHRzW2NvbF0gPSAwXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBhc3NpZ25tZW50LnN0eWxlLnRvcCA9IGNvbHVtbkhlaWdodHNbY29sXSArICdweCdcclxuICAgICAgICAgICAgICAgIGNvbHVtbkhlaWdodHNbY29sXSArPSBhc3NpZ25tZW50Lm9mZnNldEhlaWdodCArIDI0XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSwgMzUwKVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJlc2l6ZSgpXHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgd2luZG93LnNjcm9sbFRvKDAsIGdldFNjcm9sbCgpKVxyXG4gICAgICAgIE5BVl9FTEVNRU5ULmNsYXNzTGlzdC5hZGQoJ2hlYWRyb29tLS1sb2NrZWQnKVxyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICBOQVZfRUxFTUVOVC5jbGFzc0xpc3QucmVtb3ZlKCdoZWFkcm9vbS0tdW5waW5uZWQnKVxyXG4gICAgICAgICAgICBOQVZfRUxFTUVOVC5jbGFzc0xpc3QucmVtb3ZlKCdoZWFkcm9vbS0tbG9ja2VkJylcclxuICAgICAgICAgICAgTkFWX0VMRU1FTlQuY2xhc3NMaXN0LmFkZCgnaGVhZHJvb20tLXBpbm5lZCcpXHJcbiAgICAgICAgICAgIHJlcXVlc3RJZGxlQ2FsbGJhY2soKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgemVyb0xpc3REYXRlT2Zmc2V0KClcclxuICAgICAgICAgICAgICAgIHVwZGF0ZUxpc3ROYXYoKVxyXG4gICAgICAgICAgICAgICAgZGlzcGxheSgpXHJcbiAgICAgICAgICAgIH0sIHt0aW1lb3V0OiAyMDAwfSlcclxuICAgICAgICB9LCAzNTApXHJcbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJlc2l6ZUNhbGxlcilcclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYXNzaWdubWVudCcpLmZvckVhY2goKGFzc2lnbm1lbnQpID0+IHtcclxuICAgICAgICAgICAgKGFzc2lnbm1lbnQgYXMgSFRNTEVsZW1lbnQpLnN0eWxlLnRvcCA9ICdhdXRvJ1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbiAgICBpZiAoIXRyYW5zKSB7XHJcbiAgICAgIGZvcmNlTGF5b3V0KGRvY3VtZW50LmJvZHkpXHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdub1RyYW5zJylcclxuICAgICAgfSwgMzUwKVxyXG4gICAgfVxyXG4gIH0pXHJcbn0pXHJcblxyXG4vLyBBbmQgdGhlIGluZm8gdGFicyAoanVzdCBhIGxpdHRsZSBsZXNzIGNvZGUpXHJcbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyNpbmZvVGFicz5saScpLmZvckVhY2goKHRhYiwgdGFiSW5kZXgpID0+IHtcclxuICAgIHRhYi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldnQpID0+IHtcclxuICAgICAgICBlbGVtQnlJZCgnaW5mbycpLnNldEF0dHJpYnV0ZSgnZGF0YS12aWV3JywgU3RyaW5nKHRhYkluZGV4KSlcclxuICAgIH0pXHJcbn0pXHJcblxyXG4vLyBUaGUgdmlldyBpcyBzZXQgdG8gd2hhdCBpdCB3YXMgbGFzdC5cclxuaWYgKGxvY2FsU3RvcmFnZS52aWV3ICE9IG51bGwpIHtcclxuICBkb2N1bWVudC5ib2R5LnNldEF0dHJpYnV0ZSgnZGF0YS12aWV3JywgbG9jYWxTdG9yYWdlLnZpZXcpXHJcbiAgaWYgKGxvY2FsU3RvcmFnZS52aWV3ID09PSAnMScpIHtcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCByZXNpemVDYWxsZXIpXHJcbiAgfVxyXG59XHJcblxyXG4vLyBBZGRpdGlvbmFsbHksIHRoZSBhY3RpdmUgY2xhc3MgbmVlZHMgdG8gYmUgYWRkZWQgd2hlbiBpbnB1dHMgYXJlIHNlbGVjdGVkIChmb3IgdGhlIGxvZ2luIGJveCkuXHJcbklOUFVUX0VMRU1FTlRTLmZvckVhY2goKGlucHV0KSA9PiB7XHJcbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZXZ0KSA9PiB7XHJcbiAgICAgICAgXyRoKF8kaChpbnB1dC5wYXJlbnROb2RlKS5xdWVyeVNlbGVjdG9yKCdsYWJlbCcpKS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG4gICAgfSlcclxuICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgKGV2dCkgPT4ge1xyXG4gICAgICAgIF8kaChfJGgoaW5wdXQucGFyZW50Tm9kZSkucXVlcnlTZWxlY3RvcignbGFiZWwnKSkuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuICAgIH0pXHJcbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgKGV2dCkgPT4ge1xyXG4gICAgICAgIGlmIChpbnB1dC52YWx1ZS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgXyRoKF8kaChpbnB1dC5wYXJlbnROb2RlKS5xdWVyeVNlbGVjdG9yKCdsYWJlbCcpKS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbn0pXHJcblxyXG4vLyBXaGVuIHRoZSBlc2NhcGUga2V5IGlzIHByZXNzZWQsIHRoZSBjdXJyZW50IGFzc2lnbm1lbnQgc2hvdWxkIGJlIGNsb3NlZC5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZXZ0KSA9PiB7XHJcbiAgaWYgKGV2dC53aGljaCA9PT0gMjcpIHsgLy8gRXNjYXBlIGtleSBwcmVzc2VkXHJcbiAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnZnVsbCcpLmxlbmd0aCAhPT0gMCkgeyByZXR1cm4gY2xvc2VPcGVuZWQobmV3IEV2ZW50KCdHZW5lcmF0ZWQgRXZlbnQnKSkgfVxyXG4gIH1cclxufSk7XHJcblxyXG4vLyBJZiBpdCdzIHdpbnRlciB0aW1lLCBhIGNsYXNzIGlzIGFkZGVkIHRvIHRoZSBib2R5IGVsZW1lbnQuXHJcbigoKSA9PiB7XHJcbiAgICBjb25zdCB0b2RheURhdGUgPSBuZXcgRGF0ZSgpXHJcbiAgICBpZiAobmV3IERhdGUodG9kYXlEYXRlLmdldEZ1bGxZZWFyKCksIDEwLCAyNykgPD0gdG9kYXlEYXRlICYmXHJcbiAgICAgICAgdG9kYXlEYXRlIDw9IG5ldyBEYXRlKHRvZGF5RGF0ZS5nZXRGdWxsWWVhcigpLCAxMSwgMzIpKSB7XHJcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnd2ludGVyJylcclxuICAgIH1cclxufSkoKVxyXG5cclxuLy8gRm9yIHRoZSBuYXZiYXIgdG9nZ2xlIGJ1dHRvbnMsIGEgZnVuY3Rpb24gdG8gdG9nZ2xlIHRoZSBhY3Rpb24gaXMgZGVmaW5lZCB0byBlbGltaW5hdGUgY29kZS5cclxuZnVuY3Rpb24gbmF2VG9nZ2xlKGVsZW06IHN0cmluZywgbHM6IHN0cmluZywgZj86ICgpID0+IHZvaWQpOiB2b2lkIHtcclxuICAgIHJpcHBsZShlbGVtQnlJZChlbGVtKSlcclxuICAgIGVsZW1CeUlkKGVsZW0pLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCAoKSA9PiB7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QudG9nZ2xlKGxzKVxyXG4gICAgICAgIHJlc2l6ZSgpXHJcbiAgICAgICAgbG9jYWxTdG9yYWdlV3JpdGUobHMsIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKGxzKSlcclxuICAgICAgICBpZiAoZiAhPSBudWxsKSBmKClcclxuICAgIH0pXHJcbiAgICBpZiAobG9jYWxTdG9yYWdlUmVhZChscykpIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZChscylcclxufVxyXG5cclxuLy8gVGhlIGJ1dHRvbiB0byBzaG93L2hpZGUgY29tcGxldGVkIGFzc2lnbm1lbnRzIGluIGxpc3QgdmlldyBhbHNvIG5lZWRzIGV2ZW50IGxpc3RlbmVycy5cclxubmF2VG9nZ2xlKCdjdkJ1dHRvbicsICdzaG93RG9uZScsICgpID0+IHNldFRpbWVvdXQocmVzaXplLCAxMDAwKSlcclxuXHJcbi8vIFRoZSBzYW1lIGdvZXMgZm9yIHRoZSBidXR0b24gdGhhdCBzaG93cyB1cGNvbWluZyB0ZXN0cy5cclxuaWYgKGxvY2FsU3RvcmFnZS5zaG93SW5mbyA9PSBudWxsKSB7IGxvY2FsU3RvcmFnZS5zaG93SW5mbyA9IEpTT04uc3RyaW5naWZ5KHRydWUpIH1cclxubmF2VG9nZ2xlKCdpbmZvQnV0dG9uJywgJ3Nob3dJbmZvJylcclxuXHJcbi8vIFRoaXMgYWxzbyBnZXRzIHJlcGVhdGVkIGZvciB0aGUgdGhlbWUgdG9nZ2xpbmcuXHJcbm5hdlRvZ2dsZSgnbGlnaHRCdXR0b24nLCAnZGFyaycpXHJcblxyXG4vLyBGb3IgZWFzZSBvZiBhbmltYXRpb25zLCBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIHByb21pc2UgaXMgZGVmaW5lZC5cclxuLy8gZnVuY3Rpb24gYW5pbWF0ZUVsKGVsOiBIVE1MRWxlbWVudCwga2V5ZnJhbWVzOiBBbmltYXRpb25LZXlGcmFtZVtdLCBvcHRpb25zOiBBbmltYXRpb25PcHRpb25zKTpcclxuLy8gICAgIFByb21pc2U8QW5pbWF0aW9uUGxheWJhY2tFdmVudD4ge1xyXG4vLyAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuLy8gICAgICAgICBjb25zdCBwbGF5ZXIgPSBlbC5hbmltYXRlKGtleWZyYW1lcywgb3B0aW9ucylcclxuLy8gICAgICAgICBwbGF5ZXIub25maW5pc2ggPSAoZSkgPT4gcmVzb2x2ZShlKVxyXG4vLyAgICAgfSlcclxuLy8gfVxyXG5mdW5jdGlvbiBhbmltYXRlRWwoZWw6IEhUTUxFbGVtZW50LCBrZXlmcmFtZXM6IGFueSwgb3B0aW9uczogYW55KTogUHJvbWlzZTxhbnk+IHtcclxuICAgIGNvbnNvbGUuZXJyb3IoJ1RPRE86IFVwZ3JhZGUgdHlwZXNjcmlwdCcpXHJcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG51bGwpXHJcbn1cclxuXHJcbi8vIEluIG9yZGVyIHRvIG1ha2UgdGhlIHByZXZpb3VzIGRhdGUgLyBuZXh0IGRhdGUgYnV0dG9ucyBkbyBzb21ldGhpbmcsIHRoZXkgbmVlZCBldmVudCBsaXN0ZW5lcnMuXHJcbmVsZW1CeUlkKCdsaXN0bmV4dCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gIGNvbnN0IHBkID0gZWxlbUJ5SWQoJ2xpc3RwcmV2ZGF0ZScpXHJcbiAgY29uc3QgdGQgPSBlbGVtQnlJZCgnbGlzdG5vd2RhdGUnKVxyXG4gIGNvbnN0IG5kID0gZWxlbUJ5SWQoJ2xpc3RuZXh0ZGF0ZScpXHJcbiAgaW5jcmVtZW50TGlzdERhdGVPZmZzZXQoKVxyXG4gIGRpc3BsYXkoKVxyXG4gIG5kLnN0eWxlLmRpc3BsYXkgPSAnaW5saW5lLWJsb2NrJ1xyXG4gIHJldHVybiBQcm9taXNlLnJhY2UoW1xyXG4gICAgYW5pbWF0ZUVsKHRkLCBbXHJcbiAgICAgIHt0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKDAlKScsIG9wYWNpdHk6IDF9LFxyXG4gICAgICB7b3BhY2l0eTogMH0sXHJcbiAgICAgIHt0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKC0xMDAlKScsIG9wYWNpdHk6IDB9XHJcbiAgICBdLCB7ZHVyYXRpb246IDMwMCwgZWFzaW5nOiAnZWFzZS1vdXQnfSksXHJcbiAgICBhbmltYXRlRWwobmQsIFtcclxuICAgICAge3RyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoMCUpJywgb3BhY2l0eTogMH0sXHJcbiAgICAgIHtvcGFjaXR5OiAwfSxcclxuICAgICAge3RyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoLTEwMCUpJywgb3BhY2l0eTogMX1cclxuICAgIF0sIHtkdXJhdGlvbjogMzAwLCBlYXNpbmc6ICdlYXNlLW91dCd9KVxyXG4gIF0pLnRoZW4oKCkgPT4ge1xyXG4gICAgcGQuaW5uZXJIVE1MID0gdGQuaW5uZXJIVE1MXHJcbiAgICB0ZC5pbm5lckhUTUwgPSBuZC5pbm5lckhUTUxcclxuICAgIGNvbnN0IGxpc3REYXRlMiA9IG5ldyBEYXRlKClcclxuICAgIGxpc3REYXRlMi5zZXREYXRlKGxpc3REYXRlMi5nZXREYXRlKCkgKyAxICsgZ2V0TGlzdERhdGVPZmZzZXQoKSlcclxuICAgIG5kLmlubmVySFRNTCA9IGRhdGVTdHJpbmcobGlzdERhdGUyKS5yZXBsYWNlKCdUb2RheScsICdOb3cnKVxyXG4gICAgcmV0dXJuIG5kLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcclxuICB9KVxyXG59KVxyXG5cclxuLy8gVGhlIGV2ZW50IGxpc3RlbmVyIGZvciB0aGUgcHJldmlvdXMgZGF0ZSBidXR0b24gaXMgbW9zdGx5IHRoZSBzYW1lLlxyXG5lbGVtQnlJZCgnbGlzdGJlZm9yZScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gIGNvbnN0IHBkID0gZWxlbUJ5SWQoJ2xpc3RwcmV2ZGF0ZScpXHJcbiAgY29uc3QgdGQgPSBlbGVtQnlJZCgnbGlzdG5vd2RhdGUnKVxyXG4gIGNvbnN0IG5kID0gZWxlbUJ5SWQoJ2xpc3RuZXh0ZGF0ZScpXHJcbiAgZGVjcmVtZW50TGlzdERhdGVPZmZzZXQoKVxyXG4gIGRpc3BsYXkoKVxyXG4gIHBkLnN0eWxlLmRpc3BsYXkgPSAnaW5saW5lLWJsb2NrJ1xyXG4gIHJldHVybiBQcm9taXNlLnJhY2UoW1xyXG4gICAgYW5pbWF0ZUVsKHRkLCBbXHJcbiAgICAgIHt0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKC0xMDAlKScsIG9wYWNpdHk6IDF9LFxyXG4gICAgICB7b3BhY2l0eTogMH0sXHJcbiAgICAgIHt0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKDAlKScsIG9wYWNpdHk6IDB9XHJcbiAgICBdLCB7ZHVyYXRpb246IDMwMCwgZWFzaW5nOiAnZWFzZS1vdXQnfSksXHJcbiAgICBhbmltYXRlRWwocGQsIFtcclxuICAgICAge3RyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoLTEwMCUpJywgb3BhY2l0eTogMH0sXHJcbiAgICAgIHtvcGFjaXR5OiAwfSxcclxuICAgICAge3RyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoMCUpJywgb3BhY2l0eTogMX1cclxuICAgIF0sIHtkdXJhdGlvbjogMzAwLCBlYXNpbmc6ICdlYXNlLW91dCd9KVxyXG4gIF0pLnRoZW4oKCkgPT4ge1xyXG4gICAgbmQuaW5uZXJIVE1MID0gdGQuaW5uZXJIVE1MXHJcbiAgICB0ZC5pbm5lckhUTUwgPSBwZC5pbm5lckhUTUxcclxuICAgIGNvbnN0IGxpc3REYXRlMiA9IG5ldyBEYXRlKClcclxuICAgIGxpc3REYXRlMi5zZXREYXRlKChsaXN0RGF0ZTIuZ2V0RGF0ZSgpICsgZ2V0TGlzdERhdGVPZmZzZXQoKSkgLSAxKVxyXG4gICAgcGQuaW5uZXJIVE1MID0gZGF0ZVN0cmluZyhsaXN0RGF0ZTIpLnJlcGxhY2UoJ1RvZGF5JywgJ05vdycpXHJcbiAgICByZXR1cm4gcGQuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xyXG4gIH0pXHJcbn0pXHJcblxyXG4vLyBXaGVuZXZlciBhIGRhdGUgaXMgZG91YmxlIGNsaWNrZWQsIGxvbmcgdGFwcGVkLCBvciBmb3JjZSB0b3VjaGVkLCBsaXN0IHZpZXcgZm9yIHRoYXQgZGF5IGlzIGRpc3BsYXllZC5cclxuZnVuY3Rpb24gdXBkYXRlTGlzdE5hdigpOiB2b2lkIHtcclxuICAgIGNvbnN0IGQgPSBuZXcgRGF0ZSgpXHJcbiAgICBkLnNldERhdGUoKGQuZ2V0RGF0ZSgpICsgZ2V0TGlzdERhdGVPZmZzZXQoKSkgLSAxKVxyXG4gICAgY29uc3QgdXAgPSAoaWQ6IHN0cmluZykgPT4ge1xyXG4gICAgICAgIGVsZW1CeUlkKGlkKS5pbm5lckhUTUwgPSBkYXRlU3RyaW5nKGQpLnJlcGxhY2UoJ1RvZGF5JywgJ05vdycpXHJcbiAgICAgICAgcmV0dXJuIGQuc2V0RGF0ZShkLmdldERhdGUoKSArIDEpXHJcbiAgICB9XHJcbiAgICB1cCgnbGlzdHByZXZkYXRlJylcclxuICAgIHVwKCdsaXN0bm93ZGF0ZScpXHJcbiAgICB1cCgnbGlzdG5leHRkYXRlJylcclxufVxyXG5cclxuZnVuY3Rpb24gc3dpdGNoVG9MaXN0KGV2dDogRXZlbnQpOiB2b2lkIHtcclxuICAgIGlmIChfJGgoZXZ0LnRhcmdldCkuY2xhc3NMaXN0LmNvbnRhaW5zKCdtb250aCcpIHx8IF8kaChldnQudGFyZ2V0KS5jbGFzc0xpc3QuY29udGFpbnMoJ2RhdGUnKSkge1xyXG4gICAgICAgIHNldExpc3REYXRlT2Zmc2V0KHRvRGF0ZU51bShOdW1iZXIoXyRoKF8kaChldnQudGFyZ2V0KS5wYXJlbnROb2RlKS5nZXRBdHRyaWJ1dGUoJ2RhdGEtZGF0ZScpKSkgLSB0b2RheSgpKVxyXG4gICAgICAgIHVwZGF0ZUxpc3ROYXYoKVxyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuc2V0QXR0cmlidXRlKCdkYXRhLXZpZXcnLCAnMScpXHJcbiAgICAgICAgcmV0dXJuIGRpc3BsYXkoKVxyXG4gICAgfVxyXG59XHJcblxyXG5kb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2RibGNsaWNrJywgc3dpdGNoVG9MaXN0KVxyXG5kb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ3dlYmtpdG1vdXNlZm9yY2V1cCcsIHN3aXRjaFRvTGlzdCk7XHJcbigoKSA9PiB7XHJcbiAgICBsZXQgdGFwdGltZXI6IG51bWJlcnxudWxsID0gbnVsbFxyXG4gICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgKGV2dCkgPT4gdGFwdGltZXIgPSBzZXRUaW1lb3V0KCgoKSA9PiBzd2l0Y2hUb0xpc3QoZXZ0KSksIDEwMDApKVxyXG4gICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIChldnQpID0+IHtcclxuICAgICAgICBpZiAodGFwdGltZXIpIGNsZWFyVGltZW91dCh0YXB0aW1lcilcclxuICAgICAgICB0YXB0aW1lciA9IG51bGxcclxuICAgIH0pXHJcbn0pKClcclxuXHJcbi8vIDxhIG5hbWU9XCJzaWRlXCIvPlxyXG4vLyBTaWRlIG1lbnUgYW5kIE5hdmJhclxyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4vL1xyXG4vLyBUaGUgW0hlYWRyb29tIGxpYnJhcnldKGh0dHBzOi8vZ2l0aHViLmNvbS9XaWNreU5pbGxpYW1zL2hlYWRyb29tLmpzKSBpcyB1c2VkIHRvIHNob3cgdGhlIG5hdmJhciB3aGVuIHNjcm9sbGluZyB1cFxyXG5jb25zdCBoZWFkcm9vbSA9IG5ldyBIZWFkcm9vbShfJChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCduYXYnKSksIHtcclxuICB0b2xlcmFuY2U6IDEwLFxyXG4gIG9mZnNldDogNjZcclxufSlcclxuaGVhZHJvb20uaW5pdCgpXHJcblxyXG4vLyBBbHNvLCB0aGUgc2lkZSBtZW51IG5lZWRzIGV2ZW50IGxpc3RlbmVycy5cclxuZWxlbUJ5SWQoJ2NvbGxhcHNlQnV0dG9uJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nXHJcbiAgZWxlbUJ5SWQoJ3NpZGVOYXYnKS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG4gIHJldHVybiBlbGVtQnlJZCgnc2lkZUJhY2tncm91bmQnKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xyXG59KVxyXG5cclxuZWxlbUJ5SWQoJ3NpZGVCYWNrZ3JvdW5kJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgZWxlbUJ5SWQoJ3NpZGVCYWNrZ3JvdW5kJykuc3R5bGUub3BhY2l0eSA9ICcwJ1xyXG4gIGVsZW1CeUlkKCdzaWRlTmF2JykuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcclxuICBlbGVtQnlJZCgnZHJhZ1RhcmdldCcpLnN0eWxlLndpZHRoID0gJydcclxuICByZXR1cm4gc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2F1dG8nXHJcbiAgICBlbGVtQnlJZCgnc2lkZUJhY2tncm91bmQnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXHJcbiAgfVxyXG4gICwgMzUwKVxyXG59KVxyXG5cclxudXBkYXRlQXZhdGFyKClcclxuXHJcbi8vIDxhIG5hbWU9XCJhdGhlbmFcIi8+IEF0aGVuYSAoU2Nob29sb2d5KVxyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS1cclxuLy9cclxuXHJcbi8vIDxhIG5hbWU9XCJzZXR0aW5nc1wiLz4gU2V0dGluZ3NcclxuLy8gLS0tLS0tLS1cclxuLy9cclxuLy8gVGhlIGNvZGUgYmVsb3cgdXBkYXRlcyB0aGUgY3VycmVudCB2ZXJzaW9uIHRleHQgaW4gdGhlIHNldHRpbmdzLiBJIHNob3VsZCd2ZSBwdXQgdGhpcyB1bmRlciB0aGVcclxuLy8gVXBkYXRlcyBzZWN0aW9uLCBidXQgaXQgc2hvdWxkIGdvIGJlZm9yZSB0aGUgZGlzcGxheSgpIGZ1bmN0aW9uIGZvcmNlcyBhIHJlZmxvdy5cclxuZWxlbUJ5SWQoJ3ZlcnNpb24nKS5pbm5lckhUTUwgPSBWRVJTSU9OXHJcblxyXG4vLyBUbyBicmluZyB1cCB0aGUgc2V0dGluZ3Mgd2luZG93cywgYW4gZXZlbnQgbGlzdGVuZXIgbmVlZHMgdG8gYmUgYWRkZWQgdG8gdGhlIGJ1dHRvbi5cclxuZWxlbUJ5SWQoJ3NldHRpbmdzQicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgZWxlbUJ5SWQoJ3NpZGVCYWNrZ3JvdW5kJykuY2xpY2soKVxyXG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdzZXR0aW5nc1Nob3duJylcclxuICAgIGVsZW1CeUlkKCdicmFuZCcpLmlubmVySFRNTCA9ICdTZXR0aW5ncydcclxuICAgIHJldHVybiBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBfJGgoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbWFpbicpKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXHJcbiAgICB9KVxyXG59KVxyXG5cclxuLy8gVGhlIGJhY2sgYnV0dG9uIGFsc28gbmVlZHMgdG8gY2xvc2UgdGhlIHNldHRpbmdzIHdpbmRvdy5cclxuZWxlbUJ5SWQoJ2JhY2tCdXR0b24nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgIF8kaChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdtYWluJykpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXHJcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ3NldHRpbmdzU2hvd24nKVxyXG4gICAgcmV0dXJuIGVsZW1CeUlkKCdicmFuZCcpLmlubmVySFRNTCA9ICdDaGVjayBQQ1InXHJcbn0pXHJcblxyXG4vLyBUaGUgY29kZSBiZWxvdyBpcyB3aGF0IHRoZSBzZXR0aW5ncyBjb250cm9sLlxyXG5pZiAobG9jYWxTdG9yYWdlLnZpZXdUcmFucyA9PSBudWxsKSB7IGxvY2FsU3RvcmFnZS52aWV3VHJhbnMgPSBKU09OLnN0cmluZ2lmeSh0cnVlKSB9XHJcbmlmIChsb2NhbFN0b3JhZ2UuZWFybHlUZXN0ID09IG51bGwpIHsgbG9jYWxTdG9yYWdlLmVhcmx5VGVzdCA9IEpTT04uc3RyaW5naWZ5KDEpIH1cclxuaWYgKGxvY2FsU3RvcmFnZS5nb29nbGVBID09IG51bGwpIHsgbG9jYWxTdG9yYWdlLmdvb2dsZUEgPSBKU09OLnN0cmluZ2lmeSh0cnVlKSB9XHJcbmlmIChsb2NhbFN0b3JhZ2Uuc2VwVGFza3MgPT0gbnVsbCkgeyBsb2NhbFN0b3JhZ2Uuc2VwVGFza3MgPSBKU09OLnN0cmluZ2lmeShmYWxzZSkgfVxyXG5pZiAobG9jYWxTdG9yYWdlLnNlcFRhc2tDbGFzcyA9PSBudWxsKSB7IGxvY2FsU3RvcmFnZS5zZXBUYXNrQ2xhc3MgPSBKU09OLnN0cmluZ2lmeSh0cnVlKSB9XHJcbmlmIChsb2NhbFN0b3JhZ2UucHJvamVjdHNJblRlc3RQYW5lID09IG51bGwpIHsgbG9jYWxTdG9yYWdlLnByb2plY3RzSW5UZXN0UGFuZSA9IEpTT04uc3RyaW5naWZ5KGZhbHNlKSB9XHJcbmlmIChsb2NhbFN0b3JhZ2UuYXNzaWdubWVudFNwYW4gPT0gbnVsbCkgeyBsb2NhbFN0b3JhZ2UuYXNzaWdubWVudFNwYW4gPSBKU09OLnN0cmluZ2lmeSgnbXVsdGlwbGUnKSB9XHJcbmlmIChsb2NhbFN0b3JhZ2UuaGlkZWFzc2lnbm1lbnRzID09IG51bGwpIHsgbG9jYWxTdG9yYWdlLmhpZGVhc3NpZ25tZW50cyA9IEpTT04uc3RyaW5naWZ5KCdkYXknKSB9XHJcbmlmIChKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5zZXBUYXNrcykpIHtcclxuICAgIGVsZW1CeUlkKCdpbmZvJykuY2xhc3NMaXN0LmFkZCgnaXNUYXNrcycpXHJcbiAgICBlbGVtQnlJZCgnbmV3Jykuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xyXG59XHJcbmlmIChsb2NhbFN0b3JhZ2UuaG9saWRheVRoZW1lcyA9PSBudWxsKSB7IGxvY2FsU3RvcmFnZS5ob2xpZGF5VGhlbWVzID0gSlNPTi5zdHJpbmdpZnkoZmFsc2UpIH1cclxuaWYgKEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmhvbGlkYXlUaGVtZXMpKSB7IGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnaG9saWRheVRoZW1lcycpIH1cclxuaWYgKEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLnNlcFRhc2tDbGFzcykpIHsgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdzZXBUYXNrQ2xhc3MnKSB9XHJcbmlmIChsb2NhbFN0b3JhZ2UuY29sb3JUeXBlID09IG51bGwpIHsgbG9jYWxTdG9yYWdlLmNvbG9yVHlwZSA9ICdhc3NpZ25tZW50JyB9XHJcblxyXG5pbnRlcmZhY2UgSUNvbG9yTWFwIHsgW2Nsczogc3RyaW5nXTogc3RyaW5nIH1cclxubGV0IGFzc2lnbm1lbnRDb2xvcnM6IElDb2xvck1hcCA9IGxvY2FsU3RvcmFnZVJlYWQoJ2Fzc2lnbm1lbnRDb2xvcnMnLCB7XHJcbiAgICBjbGFzc3dvcms6ICcjNjg5ZjM4JywgaG9tZXdvcms6ICcjMjE5NmYzJywgbG9uZ3Rlcm06ICcjZjU3YzAwJywgdGVzdDogJyNmNDQzMzYnXHJcbn0pXHJcbmxldCBjbGFzc0NvbG9ycyA9IGxvY2FsU3RvcmFnZVJlYWQoJ2NsYXNzQ29sb3JzJywgKCkgPT4ge1xyXG4gICAgY29uc3QgY2M6IElDb2xvck1hcCA9IHt9XHJcbiAgICBjb25zdCBkYXRhID0gZ2V0RGF0YSgpXHJcbiAgICBpZiAoIWRhdGEpIHJldHVybiBjY1xyXG4gICAgZGF0YS5jbGFzc2VzLmZvckVhY2goKGM6IHN0cmluZykgPT4ge1xyXG4gICAgICAgIGNjW2NdID0gJyM2MTYxNjEnXHJcbiAgICB9KVxyXG4gICAgcmV0dXJuIGNjXHJcbn0pXHJcbmVsZW1CeUlkKGAke2xvY2FsU3RvcmFnZS5jb2xvclR5cGV9Q29sb3JzYCkuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcclxuaWYgKGxvY2FsU3RvcmFnZS5yZWZyZXNoT25Gb2N1cyA9PSBudWxsKSB7IGxvY2FsU3RvcmFnZS5yZWZyZXNoT25Gb2N1cyA9IEpTT04uc3RyaW5naWZ5KHRydWUpIH1cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgKCkgPT4ge1xyXG4gIGlmIChsb2NhbFN0b3JhZ2VSZWFkKCdyZWZyZXNoT25Gb2N1cycpKSB7XHJcbiAgICByZXR1cm4gZmV0Y2goKVxyXG4gIH1cclxufSlcclxuaWYgKGxvY2FsU3RvcmFnZS5yZWZyZXNoUmF0ZSA9PSBudWxsKSB7IGxvY2FsU3RvcmFnZS5yZWZyZXNoUmF0ZSA9IEpTT04uc3RyaW5naWZ5KC0xKSB9XHJcbmZ1bmN0aW9uIGludGVydmFsUmVmcmVzaCgpOiB2b2lkIHtcclxuICAgIGNvbnN0IHIgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5yZWZyZXNoUmF0ZSlcclxuICAgIGlmIChyID4gMCkge1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmRlYnVnKCdSZWZyZXNoaW5nIGJlY2F1c2Ugb2YgdGltZXInKVxyXG4gICAgICAgICAgICBmZXRjaCgpXHJcbiAgICAgICAgICAgIGludGVydmFsUmVmcmVzaCgpXHJcbiAgICAgICAgfSwgciAqIDYwICogMTAwMClcclxuICAgIH1cclxufVxyXG5pbnRlcnZhbFJlZnJlc2goKVxyXG5cclxuLy8gRm9yIGNob29zaW5nIGNvbG9ycywgdGhlIGNvbG9yIGNob29zaW5nIGJveGVzIG5lZWQgdG8gYmUgaW5pdGlhbGl6ZWQuXHJcbmNvbnN0IHBhbGV0dGU6IElDb2xvck1hcCA9IHtcclxuICAnI2Y0NDMzNic6ICcjQjcxQzFDJyxcclxuICAnI2U5MWU2Myc6ICcjODgwRTRGJyxcclxuICAnIzljMjdiMCc6ICcjNEExNDhDJyxcclxuICAnIzY3M2FiNyc6ICcjMzExQjkyJyxcclxuICAnIzNmNTFiNSc6ICcjMUEyMzdFJyxcclxuICAnIzIxOTZmMyc6ICcjMEQ0N0ExJyxcclxuICAnIzAzYTlmNCc6ICcjMDE1NzlCJyxcclxuICAnIzAwYmNkNCc6ICcjMDA2MDY0JyxcclxuICAnIzAwOTY4OCc6ICcjMDA0RDQwJyxcclxuICAnIzRjYWY1MCc6ICcjMUI1RTIwJyxcclxuICAnIzY4OWYzOCc6ICcjMzM2OTFFJyxcclxuICAnI2FmYjQyYic6ICcjODI3NzE3JyxcclxuICAnI2ZiYzAyZCc6ICcjRjU3RjE3JyxcclxuICAnI2ZmYTAwMCc6ICcjRkY2RjAwJyxcclxuICAnI2Y1N2MwMCc6ICcjRTY1MTAwJyxcclxuICAnI2ZmNTcyMic6ICcjQkYzNjBDJyxcclxuICAnIzc5NTU0OCc6ICcjM0UyNzIzJyxcclxuICAnIzYxNjE2MSc6ICcjMjEyMTIxJ1xyXG59XHJcbmlmIChsb2NhbFN0b3JhZ2VSZWFkKCdkYXRhJykgIT0gbnVsbCkge1xyXG4gICAgbG9jYWxTdG9yYWdlUmVhZCgnZGF0YScpLmNsYXNzZXMuZm9yRWFjaCgoYzogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgY29uc3QgZCA9IGVsZW1lbnQoJ2RpdicsIFtdLCBjKVxyXG4gICAgICAgIGQuc2V0QXR0cmlidXRlKCdkYXRhLWNvbnRyb2wnLCBjKVxyXG4gICAgICAgIGQuYXBwZW5kQ2hpbGQoZWxlbWVudCgnc3BhbicsIFtdKSlcclxuICAgICAgICBlbGVtQnlJZCgnY2xhc3NDb2xvcnMnKS5hcHBlbmRDaGlsZChkKVxyXG4gICAgfSlcclxufVxyXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY29sb3JzJykuZm9yRWFjaCgoZSkgPT4ge1xyXG4gICAgZS5xdWVyeVNlbGVjdG9yQWxsKCdkaXYnKS5mb3JFYWNoKChjb2xvcikgPT4ge1xyXG4gICAgICAgIGNvbnN0IGNvbnRyb2xsZWRDb2xvciA9IGNvbG9yLmdldEF0dHJpYnV0ZSgnZGF0YS1jb250cm9sJylcclxuICAgICAgICBpZiAoIWNvbnRyb2xsZWRDb2xvcikgdGhyb3cgbmV3IEVycm9yKCdFbGVtZW50IGhhcyBubyBjb250cm9sbGVkIGNvbG9yJylcclxuXHJcbiAgICAgICAgY29uc3Qgc3AgPSBfJGgoY29sb3IucXVlcnlTZWxlY3Rvcignc3BhbicpKVxyXG4gICAgICAgIGNvbnN0IGxpc3ROYW1lID0gZS5nZXRBdHRyaWJ1dGUoJ2lkJykgPT09ICdjbGFzc0NvbG9ycycgPyAnY2xhc3NDb2xvcnMnIDogJ2Fzc2lnbm1lbnRDb2xvcnMnXHJcbiAgICAgICAgY29uc3QgbGlzdFNldHRlciA9ICh2OiBJQ29sb3JNYXApID0+IHtcclxuICAgICAgICAgICAgZS5nZXRBdHRyaWJ1dGUoJ2lkJykgPT09ICdjbGFzc0NvbG9ycycgPyBjbGFzc0NvbG9ycyA9IHYgOiBhc3NpZ25tZW50Q29sb3JzID0gdlxyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBsaXN0ID0gZS5nZXRBdHRyaWJ1dGUoJ2lkJykgPT09ICdjbGFzc0NvbG9ycycgPyBjbGFzc0NvbG9ycyA6IGFzc2lnbm1lbnRDb2xvcnNcclxuICAgICAgICBzcC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBsaXN0W2NvbnRyb2xsZWRDb2xvcl1cclxuICAgICAgICBPYmplY3Qua2V5cyhwYWxldHRlKS5mb3JFYWNoKChwKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBlID0gZWxlbWVudCgnc3BhbicsIFtdKVxyXG4gICAgICAgICAgICBwZS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBwXHJcbiAgICAgICAgICAgIGlmIChwID09PSBsaXN0W2NvbnRyb2xsZWRDb2xvcl0pIHtcclxuICAgICAgICAgICAgICAgIHBlLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzcC5hcHBlbmRDaGlsZChwZSlcclxuICAgICAgICB9KVxyXG4gICAgICAgIGNvbnN0IGN1c3RvbSA9IGVsZW1lbnQoJ3NwYW4nLCBbJ2N1c3RvbUNvbG9yJ10sIGA8YT5DdXN0b208L2E+IFxcXHJcbiAgICA8aW5wdXQgdHlwZT0ndGV4dCcgcGxhY2Vob2xkZXI9J1dhcyAke2xpc3RbY29udHJvbGxlZENvbG9yXX0nIC8+IFxcXHJcbiAgICA8c3BhbiBjbGFzcz0nY3VzdG9tSW5mbyc+VXNlIGFueSBDU1MgdmFsaWQgY29sb3IgbmFtZSwgc3VjaCBhcyBcXFxyXG4gICAgPGNvZGU+I0Y0NDMzNjwvY29kZT4gb3IgPGNvZGU+cmdiKDY0LCA0MywgMik8L2NvZGU+IG9yIDxjb2RlPmN5YW48L2NvZGU+PC9zcGFuPiBcXFxyXG4gICAgPGEgY2xhc3M9J2N1c3RvbU9rJz5TZXQ8L2E+YClcclxuICAgICAgICBjdXN0b20uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZ0KSA9PiBldnQuc3RvcFByb3BhZ2F0aW9uKCkpXHJcbiAgICAgICAgXyQoY3VzdG9tLnF1ZXJ5U2VsZWN0b3IoJ2EnKSkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZ0KSA9PiB7XHJcbiAgICAgICAgICAgIHNwLmNsYXNzTGlzdC50b2dnbGUoJ29uQ3VzdG9tJylcclxuICAgICAgICAgICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICAgICAgfSlcclxuICAgICAgICBzcC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldnQpID0+IHtcclxuICAgICAgICAgICAgaWYgKHNwLmNsYXNzTGlzdC5jb250YWlucygnY2hvb3NlJykpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IF8kaChldnQudGFyZ2V0KVxyXG4gICAgICAgICAgICAgICAgY29uc3QgYmcgPSB0aW55Y29sb3IodGFyZ2V0LnN0eWxlLmJhY2tncm91bmRDb2xvciB8fCAnIzAwMCcpLnRvSGV4U3RyaW5nKClcclxuICAgICAgICAgICAgICAgIGxpc3RbY29udHJvbGxlZENvbG9yXSA9IGJnXHJcbiAgICAgICAgICAgICAgICBzcC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBiZ1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2VsZWN0ZWQgPSB0YXJnZXQucXVlcnlTZWxlY3RvcignLnNlbGVjdGVkJylcclxuICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJylcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRhcmdldC5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpXHJcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2VbbGlzdE5hbWVdID0gSlNPTi5zdHJpbmdpZnkobGlzdClcclxuICAgICAgICAgICAgICAgIGxpc3RTZXR0ZXIobGlzdClcclxuICAgICAgICAgICAgICAgIHVwZGF0ZUNvbG9ycygpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc3AuY2xhc3NMaXN0LnRvZ2dsZSgnY2hvb3NlJylcclxuICAgICAgICB9KVxyXG4gICAgICAgIF8kKGN1c3RvbS5xdWVyeVNlbGVjdG9yKCcuY3VzdG9tT2snKSkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZ0KSA9PiB7XHJcbiAgICAgICAgICAgIHNwLmNsYXNzTGlzdC5yZW1vdmUoJ29uQ3VzdG9tJylcclxuICAgICAgICAgICAgc3AuY2xhc3NMaXN0LnRvZ2dsZSgnY2hvb3NlJylcclxuICAgICAgICAgICAgY29uc3Qgc2VsZWN0ZWRFbCA9IHNwLnF1ZXJ5U2VsZWN0b3IoJy5zZWxlY3RlZCcpXHJcbiAgICAgICAgICAgIGlmIChzZWxlY3RlZEVsICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHNlbGVjdGVkRWwuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNwLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IChsaXN0W2NvbnRyb2xsZWRDb2xvcl0gPSBfJChjdXN0b20ucXVlcnlTZWxlY3RvcignaW5wdXQnKSkudmFsdWUpXHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZVtsaXN0TmFtZV0gPSBKU09OLnN0cmluZ2lmeShsaXN0KVxyXG4gICAgICAgICAgICB1cGRhdGVDb2xvcnMoKVxyXG4gICAgICAgICAgICByZXR1cm4gZXZ0LnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICAgICAgfSlcclxuICAgIH0pXHJcbn0pXHJcblxyXG4vLyBUaGVuLCBhIGZ1bmN0aW9uIHRoYXQgdXBkYXRlcyB0aGUgY29sb3IgcHJlZmVyZW5jZXMgaXMgZGVmaW5lZC5cclxuZnVuY3Rpb24gdXBkYXRlQ29sb3JzKCk6IHZvaWQge1xyXG4gICAgY29uc3Qgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpXHJcbiAgICBzdHlsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJykpXHJcbiAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHN0eWxlKVxyXG4gICAgY29uc3Qgc2hlZXQgPSBfJChzdHlsZS5zaGVldCkgYXMgQ1NTU3R5bGVTaGVldFxyXG5cclxuICAgIGNvbnN0IGFkZENvbG9yUnVsZSA9IChzZWxlY3Rvcjogc3RyaW5nLCBsaWdodDogc3RyaW5nLCBkYXJrOiBzdHJpbmcsIGV4dHJhID0gJycpID0+IHtcclxuICAgICAgICBjb25zdCBtaXhlZCA9IHRpbnljb2xvci5taXgobGlnaHQsICcjMUI1RTIwJywgNzApLnRvSGV4U3RyaW5nKClcclxuICAgICAgICBzaGVldC5pbnNlcnRSdWxlKGAke2V4dHJhfS5hc3NpZ25tZW50JHtzZWxlY3Rvcn0geyBiYWNrZ3JvdW5kLWNvbG9yOiAke2xpZ2h0fTsgfWAsIDApXHJcbiAgICAgICAgc2hlZXQuaW5zZXJ0UnVsZShgJHtleHRyYX0uYXNzaWdubWVudCR7c2VsZWN0b3J9LmRvbmUgeyBiYWNrZ3JvdW5kLWNvbG9yOiAke2Rhcmt9OyB9YCwgMClcclxuICAgICAgICBzaGVldC5pbnNlcnRSdWxlKGAke2V4dHJhfS5hc3NpZ25tZW50JHtzZWxlY3Rvcn06OmJlZm9yZSB7IGJhY2tncm91bmQtY29sb3I6ICR7bWl4ZWR9OyB9YCwgMClcclxuICAgICAgICBzaGVldC5pbnNlcnRSdWxlKGAke2V4dHJhfS5hc3NpZ25tZW50SXRlbSR7c2VsZWN0b3J9PmkgeyBiYWNrZ3JvdW5kLWNvbG9yOiAke2xpZ2h0fTsgfWAsIDApXHJcbiAgICAgICAgc2hlZXQuaW5zZXJ0UnVsZShgJHtleHRyYX0uYXNzaWdubWVudEl0ZW0ke3NlbGVjdG9yfS5kb25lPmkgeyBiYWNrZ3JvdW5kLWNvbG9yOiAke2Rhcmt9OyB9YCwgMClcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjcmVhdGVQYWxldHRlID0gKGNvbG9yOiBzdHJpbmcpID0+IHRpbnljb2xvcihjb2xvcikuZGFya2VuKDI0KS50b0hleFN0cmluZygpXHJcblxyXG4gICAgaWYgKGxvY2FsU3RvcmFnZS5jb2xvclR5cGUgPT09ICdhc3NpZ25tZW50Jykge1xyXG4gICAgICAgIE9iamVjdC5lbnRyaWVzKGFzc2lnbm1lbnRDb2xvcnMpLmZvckVhY2goKFtuYW1lLCBjb2xvcl0pID0+IHtcclxuICAgICAgICAgICAgYWRkQ29sb3JSdWxlKGAuJHtuYW1lfWAsIGNvbG9yLCBwYWxldHRlW2NvbG9yXSB8fCBjcmVhdGVQYWxldHRlKGNvbG9yKSlcclxuICAgICAgICB9KVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBPYmplY3QuZW50cmllcyhjbGFzc0NvbG9ycykuZm9yRWFjaCgoW25hbWUsIGNvbG9yXSkgPT4ge1xyXG4gICAgICAgICAgICBhZGRDb2xvclJ1bGUoYFtkYXRhLWNsYXNzPVxcXCIke25hbWV9XFxcIl1gLCBjb2xvciwgcGFsZXR0ZVtjb2xvcl0gfHwgY3JlYXRlUGFsZXR0ZShjb2xvcikpXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBhZGRDb2xvclJ1bGUoJy50YXNrJywgJyNGNUY1RjUnLCAnI0UwRTBFMCcpXHJcbiAgICBhZGRDb2xvclJ1bGUoJy50YXNrJywgJyM0MjQyNDInLCAnIzIxMjEyMScsICcuZGFyayAnKVxyXG59XHJcblxyXG4vLyBUaGUgZnVuY3Rpb24gdGhlbiBuZWVkcyB0byBiZSBjYWxsZWQuXHJcbnVwZGF0ZUNvbG9ycygpXHJcblxyXG4vLyBUaGUgZWxlbWVudHMgdGhhdCBjb250cm9sIHRoZSBzZXR0aW5ncyBhbHNvIG5lZWQgZXZlbnQgbGlzdGVuZXJzXHJcbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zZXR0aW5nc0NvbnRyb2wnKS5mb3JFYWNoKChlKSA9PiB7XHJcbiAgICBpZiAoIShlIGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudCkpIHJldHVyblxyXG4gICAgaWYgKGxvY2FsU3RvcmFnZVtlLm5hbWVdICE9IG51bGwpIHtcclxuICAgICAgICBpZiAoZS50eXBlID09PSAnY2hlY2tib3gnKSB7XHJcbiAgICAgICAgZS5jaGVja2VkID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2VbZS5uYW1lXSlcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGUudmFsdWUgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZVtlLm5hbWVdKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGUuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGV2dCkgPT4ge1xyXG4gICAgICAgIGlmIChlLnR5cGUgPT09ICdjaGVja2JveCcpIHtcclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlV3JpdGUoZS5uYW1lLCBlLmNoZWNrZWQpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlV3JpdGUoZS5uYW1lLCBlLnZhbHVlKVxyXG4gICAgICAgIH1cclxuICAgICAgICBzd2l0Y2ggKGUubmFtZSkge1xyXG4gICAgICAgICAgICBjYXNlICdyZWZyZXNoUmF0ZSc6IHJldHVybiBpbnRlcnZhbFJlZnJlc2goKVxyXG4gICAgICAgICAgICBjYXNlICdlYXJseVRlc3QnOiByZXR1cm4gZGlzcGxheSgpXHJcbiAgICAgICAgICAgIGNhc2UgJ2Fzc2lnbm1lbnRTcGFuJzogcmV0dXJuIGRpc3BsYXkoKVxyXG4gICAgICAgICAgICBjYXNlICdwcm9qZWN0c0luVGVzdFBhbmUnOiByZXR1cm4gZGlzcGxheSgpXHJcbiAgICAgICAgICAgIGNhc2UgJ2hpZGVhc3NpZ25tZW50cyc6IHJldHVybiBkaXNwbGF5KClcclxuICAgICAgICAgICAgY2FzZSAnaG9saWRheVRoZW1lcyc6IHJldHVybiBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC50b2dnbGUoJ2hvbGlkYXlUaGVtZXMnLCBlLmNoZWNrZWQpXHJcbiAgICAgICAgICAgIGNhc2UgJ3NlcFRhc2tDbGFzcyc6IGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnRvZ2dsZSgnc2VwVGFza0NsYXNzJywgZS5jaGVja2VkKTsgcmV0dXJuIGRpc3BsYXkoKVxyXG4gICAgICAgICAgICBjYXNlICdzZXBUYXNrcyc6IHJldHVybiBlbGVtQnlJZCgnc2VwVGFza3NSZWZyZXNoJykuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59KVxyXG5cclxuLy8gVGhpcyBhbHNvIG5lZWRzIHRvIGJlIGRvbmUgZm9yIHJhZGlvIGJ1dHRvbnNcclxuY29uc3QgY29sb3JUeXBlID1cclxuICAgIF8kKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYGlucHV0W25hbWU9XFxcImNvbG9yVHlwZVxcXCJdW3ZhbHVlPVxcXCIke2xvY2FsU3RvcmFnZS5jb2xvclR5cGV9XFxcIl1gKSkgYXMgSFRNTElucHV0RWxlbWVudFxyXG5jb2xvclR5cGUuY2hlY2tlZCA9IHRydWVcclxuQXJyYXkuZnJvbShkb2N1bWVudC5nZXRFbGVtZW50c0J5TmFtZSgnY29sb3JUeXBlJykpLmZvckVhY2goKGMpID0+IHtcclxuICBjLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChldnQpID0+IHtcclxuICAgIGNvbnN0IHYgPSAoXyQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaW5wdXRbbmFtZT1cImNvbG9yVHlwZVwiXTpjaGVja2VkJykpIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlXHJcbiAgICBsb2NhbFN0b3JhZ2UuY29sb3JUeXBlID0gdlxyXG4gICAgaWYgKHYgPT09ICdjbGFzcycpIHtcclxuICAgICAgZWxlbUJ5SWQoJ2Fzc2lnbm1lbnRDb2xvcnMnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXHJcbiAgICAgIGVsZW1CeUlkKCdjbGFzc0NvbG9ycycpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBlbGVtQnlJZCgnYXNzaWdubWVudENvbG9ycycpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXHJcbiAgICAgIGVsZW1CeUlkKCdjbGFzc0NvbG9ycycpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcclxuICAgIH1cclxuICAgIHJldHVybiB1cGRhdGVDb2xvcnMoKVxyXG4gIH0pXHJcbn0pXHJcblxyXG4vLyBUaGUgc2FtZSBnb2VzIGZvciB0ZXh0YXJlYXMuXHJcbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3RleHRhcmVhJykuZm9yRWFjaCgoZSkgPT4ge1xyXG4gIGlmICgoZS5uYW1lICE9PSAnYXRoZW5hRGF0YVJhdycpICYmIChsb2NhbFN0b3JhZ2VbZS5uYW1lXSAhPSBudWxsKSkge1xyXG4gICAgZS52YWx1ZSA9IGxvY2FsU3RvcmFnZVtlLm5hbWVdXHJcbiAgfVxyXG4gIGUuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoZXZ0KSA9PiB7XHJcbiAgICBsb2NhbFN0b3JhZ2VbZS5uYW1lXSA9IGUudmFsdWVcclxuICAgIGlmIChlLm5hbWUgPT09ICdhdGhlbmFEYXRhUmF3Jykge1xyXG4gICAgICB1cGRhdGVBdGhlbmFEYXRhKGUudmFsdWUpXHJcbiAgICB9XHJcbiAgfSlcclxufSlcclxuXHJcbi8vIDxhIG5hbWU9XCJzdGFydGluZ1wiLz5cclxuLy8gU3RhcnRpbmcgZXZlcnl0aGluZ1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tXHJcbi8vXHJcbi8vIEZpbmFsbHkhIFdlIGFyZSAoYWxtb3N0KSBkb25lIVxyXG4vL1xyXG4vLyBCZWZvcmUgZ2V0dGluZyB0byBhbnl0aGluZywgbGV0J3MgcHJpbnQgb3V0IGEgd2VsY29taW5nIG1lc3NhZ2UgdG8gdGhlIGNvbnNvbGUhXHJcbmNvbnNvbGUubG9nKCclY0NoZWNrIFBDUicsICdjb2xvcjogIzAwNDAwMDsgZm9udC1zaXplOiAzZW0nKVxyXG5jb25zb2xlLmxvZyhgJWNWZXJzaW9uICR7VkVSU0lPTn0gKENoZWNrIGJlbG93IGZvciBjdXJyZW50IHZlcnNpb24pYCwgJ2ZvbnQtc2l6ZTogMS4xZW0nKVxyXG5jb25zb2xlLmxvZyhgV2VsY29tZSB0byB0aGUgZGV2ZWxvcGVyIGNvbnNvbGUgZm9yIHlvdXIgYnJvd3NlciEgQmVzaWRlcyBsb29raW5nIGF0IHRoZSBzb3VyY2UgY29kZSwgXFxcclxueW91IGNhbiBhbHNvIHBsYXkgYXJvdW5kIHdpdGggQ2hlY2sgUENSIGJ5IGV4ZWN1dGluZyB0aGUgbGluZXMgYmVsb3c6XHJcbiVjXFx0ZmV0Y2godHJ1ZSkgICAgICAgICAgICAgICAlYy8vIFJlbG9hZHMgYWxsIG9mIHlvdXIgYXNzaWdubWVudHMgKHRoZSB0cnVlIGlzIGZvciBmb3JjaW5nIGEgcmVsb2FkIGlmIG9uZSBcXFxyXG5oYXMgYWxyZWFkeSBiZWVuIHRyaWdnZXJlZCBpbiB0aGUgbGFzdCBtaW51dGUpXHJcbiVjXFx0ZGF0YSAgICAgICAgICAgICAgICAgICAgICAlYy8vIERpc3BsYXlzIHRoZSBvYmplY3QgdGhhdCBjb250YWlucyB0aGUgZGF0YSBwYXJzZWQgZnJvbSBQQ1IncyBpbnRlcmZhY2VcclxuJWNcXHRhY3Rpdml0eSAgICAgICAgICAgICAgICAgICVjLy8gVGhlIGRhdGEgZm9yIHRoZSBhc3NpZ25tZW50cyB0aGF0IHNob3cgdXAgaW4gdGhlIGFjdGl2aXR5IHBhbmVcclxuJWNcXHRleHRyYSAgICAgICAgICAgICAgICAgICAgICVjLy8gQWxsIG9mIHRoZSB0YXNrcyB5b3UndmUgY3JlYXRlZCBieSBjbGlja2luZyB0aGUgKyBidXR0b25cclxuJWNcXHRhdGhlbmFEYXRhICAgICAgICAgICAgICAgICVjLy8gVGhlIGRhdGEgZmV0Y2hlZCBmcm9tIEF0aGVuYSAoaWYgeW91J3ZlIHBhc3RlZCB0aGUgcmF3IGRhdGEgaW50byBzZXR0aW5ncylcclxuJWNcXHRzbmFja2JhcihcIkhlbGxvIFdvcmxkIVwiKSAgJWMvLyBDcmVhdGVzIGEgc25hY2tiYXIgc2hvd2luZyB0aGUgbWVzc2FnZSBcIkhlbGxvIFdvcmxkIVwiXHJcbiVjXFx0ZGlzcGxheUVycm9yKG5ldyBFcnJvcigpKSAlYy8vIERpc3BsYXlzIHRoZSBzdGFjayB0cmFjZSBmb3IgYSByYW5kb20gZXJyb3IgKEp1c3QgZG9uJ3Qgc3VibWl0IGl0ISlcclxuJWNcXHRjbG9zZUVycm9yKCkgICAgICAgICAgICAgICVjLy8gQ2xvc2VzIHRoYXQgZGlhbG9nYCxcclxuICAgICAgICAgICAgICAgLi4uKChbXSBhcyBzdHJpbmdbXSkuY29uY2F0KC4uLkFycmF5LmZyb20obmV3IEFycmF5KDgpLCAoKSA9PiBbJ2NvbG9yOiBpbml0aWFsJywgJ2NvbG9yOiBncmV5J10pKSkpXHJcbmNvbnNvbGUubG9nKCcnKVxyXG5cclxuLy8gVGhlIFwibGFzdCB1cGRhdGVkXCIgdGV4dCBpcyBzZXQgdG8gdGhlIGNvcnJlY3QgZGF0ZS5cclxuY29uc3QgdHJpZWRMYXN0VXBkYXRlID0gbG9jYWxTdG9yYWdlUmVhZCgnbGFzdFVwZGF0ZScpXHJcbmVsZW1CeUlkKCdsYXN0VXBkYXRlJykuaW5uZXJIVE1MID0gdHJpZWRMYXN0VXBkYXRlID8gZm9ybWF0VXBkYXRlKHRyaWVkTGFzdFVwZGF0ZSkgOiAnTmV2ZXInXHJcblxyXG5pZiAobG9jYWxTdG9yYWdlUmVhZCgnZGF0YScpICE9IG51bGwpIHtcclxuICAgIC8vIE5vdyBjaGVjayBpZiB0aGVyZSdzIGFjdGl2aXR5XHJcbiAgICByZWNlbnRBY3Rpdml0eSgpLmZvckVhY2goKGl0ZW0pID0+IHtcclxuICAgICAgICBhZGRBY3Rpdml0eShpdGVtWzBdLCBpdGVtWzFdLCBuZXcgRGF0ZShpdGVtWzJdKSwgdHJ1ZSwgaXRlbVszXSlcclxuICAgIH0pXHJcblxyXG4gICAgZGlzcGxheSgpXHJcbn1cclxuXHJcbmZldGNoKClcclxuXHJcbi8vIDxhIG5hbWU9XCJldmVudHNcIi8+XHJcbi8vIEV2ZW50c1xyXG4vLyAtLS0tLS1cclxuLy9cclxuLy8gVGhlIGRvY3VtZW50IGJvZHkgbmVlZHMgdG8gYmUgZW5hYmxlZCBmb3IgaGFtbWVyLmpzIGV2ZW50cy5cclxuZGVsZXRlIEhhbW1lci5kZWZhdWx0cy5jc3NQcm9wcy51c2VyU2VsZWN0XHJcbmNvbnN0IGhhbW1lcnRpbWUgPSBuZXcgSGFtbWVyLk1hbmFnZXIoZG9jdW1lbnQuYm9keSwge1xyXG4gIHJlY29nbml6ZXJzOiBbXHJcbiAgICBbSGFtbWVyLlBhbiwge2RpcmVjdGlvbjogSGFtbWVyLkRJUkVDVElPTl9IT1JJWk9OVEFMfV1cclxuICBdXHJcbn0pXHJcblxyXG4vLyBGb3IgdG91Y2ggZGlzcGxheXMsIGhhbW1lci5qcyBpcyB1c2VkIHRvIG1ha2UgdGhlIHNpZGUgbWVudSBhcHBlYXIvZGlzYXBwZWFyLiBUaGUgY29kZSBiZWxvdyBpc1xyXG4vLyBhZGFwdGVkIGZyb20gTWF0ZXJpYWxpemUncyBpbXBsZW1lbnRhdGlvbi5cclxubGV0IG1lbnVPdXQgPSBmYWxzZVxyXG5jb25zdCBkcmFnVGFyZ2V0ID0gbmV3IEhhbW1lcihlbGVtQnlJZCgnZHJhZ1RhcmdldCcpKVxyXG5kcmFnVGFyZ2V0Lm9uKCdwYW4nLCAoZSkgPT4ge1xyXG4gIGlmIChlLnBvaW50ZXJUeXBlID09PSAndG91Y2gnKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgIGxldCB7IHggfSA9IGUuY2VudGVyXHJcbiAgICBjb25zdCB7IHkgfSA9IGUuY2VudGVyXHJcblxyXG4gICAgY29uc3Qgc2JrZyA9IGVsZW1CeUlkKCdzaWRlQmFja2dyb3VuZCcpXHJcbiAgICBzYmtnLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXHJcbiAgICBzYmtnLnN0eWxlLm9wYWNpdHkgPSAnMCdcclxuICAgIGVsZW1CeUlkKCdzaWRlTmF2JykuY2xhc3NMaXN0LmFkZCgnbWFudWFsJylcclxuXHJcbiAgICAvLyBLZWVwIHdpdGhpbiBib3VuZGFyaWVzXHJcbiAgICBpZiAoeCA+IDI0MCkge1xyXG4gICAgICB4ID0gMjQwXHJcbiAgICB9IGVsc2UgaWYgKHggPCAwKSB7XHJcbiAgICAgIHggPSAwXHJcblxyXG4gICAgICAvLyBMZWZ0IERpcmVjdGlvblxyXG4gICAgICBpZiAoeCA8IDEyMCkge1xyXG4gICAgICAgIG1lbnVPdXQgPSBmYWxzZVxyXG4gICAgICAvLyBSaWdodCBEaXJlY3Rpb25cclxuICAgICAgfSBlbHNlIGlmICh4ID49IDEyMCkge1xyXG4gICAgICAgIG1lbnVPdXQgPSB0cnVlXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBlbGVtQnlJZCgnc2lkZU5hdicpLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGVYKCR7eCAtIDI0MH1weClgXHJcbiAgICBjb25zdCBvdmVybGF5UGVyYyA9IE1hdGgubWluKHggLyA0ODAsIDAuNSlcclxuICAgIHJldHVybiBzYmtnLnN0eWxlLm9wYWNpdHkgPSBTdHJpbmcob3ZlcmxheVBlcmMpXHJcbiAgfVxyXG59KVxyXG5cclxuZHJhZ1RhcmdldC5vbigncGFuZW5kJywgKGUpID0+IHtcclxuICBpZiAoZS5wb2ludGVyVHlwZSA9PT0gJ3RvdWNoJykge1xyXG4gICAgbGV0IHNpZGVOYXZcclxuICAgIGNvbnN0IHsgdmVsb2NpdHlYIH0gPSBlXHJcbiAgICAvLyBJZiB2ZWxvY2l0eVggPD0gMC4zIHRoZW4gdGhlIHVzZXIgaXMgZmxpbmdpbmcgdGhlIG1lbnUgY2xvc2VkIHNvIGlnbm9yZSBtZW51T3V0XHJcbiAgICBpZiAoKG1lbnVPdXQgJiYgKHZlbG9jaXR5WCA8PSAwLjMpKSB8fCAodmVsb2NpdHlYIDwgLTAuNSkpIHtcclxuICAgICAgc2lkZU5hdiA9IGVsZW1CeUlkKCdzaWRlTmF2JylcclxuICAgICAgc2lkZU5hdi5jbGFzc0xpc3QucmVtb3ZlKCdtYW51YWwnKVxyXG4gICAgICBzaWRlTmF2LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcbiAgICAgIHNpZGVOYXYuc3R5bGUudHJhbnNmb3JtID0gJydcclxuICAgICAgZWxlbUJ5SWQoJ2RyYWdUYXJnZXQnKS5zdHlsZS53aWR0aCA9ICcxMDAlJ1xyXG5cclxuICAgIH0gZWxzZSBpZiAoIW1lbnVPdXQgfHwgKHZlbG9jaXR5WCA+IDAuMykpIHtcclxuICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICdhdXRvJ1xyXG4gICAgICBzaWRlTmF2ID0gZWxlbUJ5SWQoJ3NpZGVOYXYnKVxyXG4gICAgICBzaWRlTmF2LmNsYXNzTGlzdC5yZW1vdmUoJ21hbnVhbCcpXHJcbiAgICAgIHNpZGVOYXYuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcclxuICAgICAgc2lkZU5hdi5zdHlsZS50cmFuc2Zvcm0gPSAnJ1xyXG4gICAgICBlbGVtQnlJZCgnc2lkZUJhY2tncm91bmQnKS5zdHlsZS5vcGFjaXR5ID0gJydcclxuICAgICAgZWxlbUJ5SWQoJ2RyYWdUYXJnZXQnKS5zdHlsZS53aWR0aCA9ICcxMHB4J1xyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IGVsZW1CeUlkKCdzaWRlQmFja2dyb3VuZCcpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcclxuICAgICAgLCAzNTApXHJcbiAgICB9XHJcbiAgfVxyXG59KVxyXG5cclxuZHJhZ1RhcmdldC5vbigndGFwJywgKGUpID0+IHtcclxuICAgIGVsZW1CeUlkKCdzaWRlQmFja2dyb3VuZCcpLmNsaWNrKClcclxuICAgIGUucHJldmVudERlZmF1bHQoKVxyXG59KVxyXG5cclxuY29uc3QgZHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZHJhZ1RhcmdldCcpXHJcblxyXG4vLyBUaGUgYWN0aXZpdHkgZmlsdGVyIGJ1dHRvbiBhbHNvIG5lZWRzIGFuIGV2ZW50IGxpc3RlbmVyLlxyXG5yaXBwbGUoZWxlbUJ5SWQoJ2ZpbHRlckFjdGl2aXR5JykpXHJcbmVsZW1CeUlkKCdmaWx0ZXJBY3Rpdml0eScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gIGVsZW1CeUlkKCdpbmZvQWN0aXZpdHknKS5jbGFzc0xpc3QudG9nZ2xlKCdmaWx0ZXInKVxyXG59KVxyXG5cclxuLy8gQXQgdGhlIHN0YXJ0LCBpdCBuZWVkcyB0byBiZSBjb3JyZWN0bHkgcG9wdWxhdGVkXHJcbmNvbnN0IGFjdGl2aXR5VHlwZXMgPSBsb2NhbFN0b3JhZ2VSZWFkKCdzaG93bkFjdGl2aXR5Jywge1xyXG4gIGFkZDogdHJ1ZSxcclxuICBlZGl0OiB0cnVlLFxyXG4gIGRlbGV0ZTogdHJ1ZVxyXG59KVxyXG5cclxuZnVuY3Rpb24gdXBkYXRlU2VsZWN0TnVtKCk6IHN0cmluZyB7XHJcbiAgICBjb25zdCBjID0gKGJvb2w6IGJvb2xlYW4pICA9PiBib29sID8gMSA6IDBcclxuICAgIGNvbnN0IGNvdW50ID0gU3RyaW5nKGMoYWN0aXZpdHlUeXBlcy5hZGQpICsgYyhhY3Rpdml0eVR5cGVzLmVkaXQpICsgYyhhY3Rpdml0eVR5cGVzLmRlbGV0ZSkpXHJcbiAgICByZXR1cm4gZWxlbUJ5SWQoJ3NlbGVjdE51bScpLmlubmVySFRNTCA9IGNvdW50XHJcbn1cclxudXBkYXRlU2VsZWN0TnVtKClcclxuT2JqZWN0LmVudHJpZXMoYWN0aXZpdHlUeXBlcykuZm9yRWFjaCgoW3R5cGUsIGVuYWJsZWRdKSA9PiB7XHJcbiAgaWYgKHR5cGUgIT09ICdhZGQnICYmIHR5cGUgIT09ICdlZGl0JyAmJiB0eXBlICE9PSAnZGVsZXRlJykge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGFjdGl2aXR5IHR5cGUgJHt0eXBlfWApXHJcbiAgfVxyXG5cclxuICBjb25zdCBzZWxlY3RFbCA9IGVsZW1CeUlkKHR5cGUgKyAnU2VsZWN0JykgYXMgSFRNTElucHV0RWxlbWVudFxyXG4gIHNlbGVjdEVsLmNoZWNrZWQgPSBlbmFibGVkXHJcbiAgaWYgKGVuYWJsZWQpIHsgZWxlbUJ5SWQoJ2luZm9BY3Rpdml0eScpLmNsYXNzTGlzdC5hZGQodHlwZSkgfVxyXG4gIHNlbGVjdEVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChldnQpID0+IHtcclxuICAgIGFjdGl2aXR5VHlwZXNbdHlwZV0gPSBzZWxlY3RFbC5jaGVja2VkXHJcbiAgICBlbGVtQnlJZCgnaW5mb0FjdGl2aXR5Jykuc2V0QXR0cmlidXRlKCdkYXRhLWZpbHRlcmVkJywgdXBkYXRlU2VsZWN0TnVtKCkpXHJcbiAgICBlbGVtQnlJZCgnaW5mb0FjdGl2aXR5JykuY2xhc3NMaXN0LnRvZ2dsZSh0eXBlKVxyXG4gICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5zaG93bkFjdGl2aXR5ID0gSlNPTi5zdHJpbmdpZnkoYWN0aXZpdHlUeXBlcylcclxuICB9KVxyXG59KVxyXG5cclxuLy8gVGhlIHNob3cgY29tcGxldGVkIHRhc2tzIGNoZWNrYm94IGlzIHNldCBjb3JyZWN0bHkgYW5kIGlzIGFzc2lnbmVkIGFuIGV2ZW50IGxpc3RlbmVyLlxyXG5jb25zdCBzaG93RG9uZVRhc2tzRWwgPSBlbGVtQnlJZCgnc2hvd0RvbmVUYXNrcycpIGFzIEhUTUxJbnB1dEVsZW1lbnRcclxuaWYgKGxvY2FsU3RvcmFnZVJlYWQoJ3Nob3dEb25lVGFza3MnKSkge1xyXG4gIHNob3dEb25lVGFza3NFbC5jaGVja2VkID0gdHJ1ZVxyXG4gIGVsZW1CeUlkKCdpbmZvVGFza3NJbm5lcicpLmNsYXNzTGlzdC5hZGQoJ3Nob3dEb25lVGFza3MnKVxyXG59XHJcbnNob3dEb25lVGFza3NFbC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoKSA9PiB7XHJcbiAgbG9jYWxTdG9yYWdlV3JpdGUoJ3Nob3dEb25lVGFza3MnLCBzaG93RG9uZVRhc2tzRWwuY2hlY2tlZClcclxuICBlbGVtQnlJZCgnaW5mb1Rhc2tzSW5uZXInKS5jbGFzc0xpc3QudG9nZ2xlKCdzaG93RG9uZVRhc2tzJywgc2hvd0RvbmVUYXNrc0VsLmNoZWNrZWQpXHJcbn0pXHJcblxyXG4vLyA8YSBuYW1lPVwidXBkYXRlc1wiLz5cclxuLy8gVXBkYXRlcyBhbmQgTmV3c1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tXHJcbi8vXHJcblxyXG5pZiAobG9jYXRpb24ucHJvdG9jb2wgPT09ICdjaHJvbWUtZXh0ZW5zaW9uOicpIHsgY2hlY2tDb21taXQoKSB9XHJcblxyXG4vLyBUaGlzIHVwZGF0ZSBkaWFsb2cgYWxzbyBuZWVkcyB0byBiZSBjbG9zZWQgd2hlbiB0aGUgYnV0dG9ucyBhcmUgY2xpY2tlZC5cclxuZWxlbUJ5SWQoJ3VwZGF0ZURlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgZWxlbUJ5SWQoJ3VwZGF0ZScpLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICBlbGVtQnlJZCgndXBkYXRlQmFja2dyb3VuZCcpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcclxuICB9LCAzNTApXHJcbn0pXHJcblxyXG4vLyBGb3IgbmV3cywgdGhlIGxhdGVzdCBuZXdzIGlzIGZldGNoZWQgZnJvbSBhIEdpdEh1YiBnaXN0LlxyXG5mZXRjaE5ld3MoKVxyXG5cclxuLy8gVGhlIG5ld3MgZGlhbG9nIHRoZW4gbmVlZHMgdG8gYmUgY2xvc2VkIHdoZW4gT0sgb3IgdGhlIGJhY2tncm91bmQgaXMgY2xpY2tlZC5cclxuZnVuY3Rpb24gY2xvc2VOZXdzKCk6IHZvaWQge1xyXG4gIGVsZW1CeUlkKCduZXdzJykuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcclxuICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgIGVsZW1CeUlkKCduZXdzQmFja2dyb3VuZCcpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcclxuICB9LCAzNTApXHJcbn1cclxuXHJcbmVsZW1CeUlkKCduZXdzT2snKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsb3NlTmV3cylcclxuZWxlbUJ5SWQoJ25ld3NCYWNrZ3JvdW5kJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbG9zZU5ld3MpXHJcblxyXG4vLyBJdCBhbHNvIG5lZWRzIHRvIGJlIG9wZW5lZCB3aGVuIHRoZSBuZXdzIGJ1dHRvbiBpcyBjbGlja2VkLlxyXG5lbGVtQnlJZCgnbmV3c0InKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICBlbGVtQnlJZCgnc2lkZUJhY2tncm91bmQnKS5jbGljaygpXHJcbiAgY29uc3QgZGlzcE5ld3MgPSAoKSA9PiB7XHJcbiAgICBlbGVtQnlJZCgnbmV3c0JhY2tncm91bmQnKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xyXG4gICAgcmV0dXJuIGVsZW1CeUlkKCduZXdzJykuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuICB9XHJcblxyXG4gIGlmIChlbGVtQnlJZCgnbmV3c0NvbnRlbnQnKS5jaGlsZE5vZGVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgZ2V0TmV3cyhkaXNwTmV3cylcclxuICB9IGVsc2Uge1xyXG4gICAgZGlzcE5ld3MoKVxyXG4gIH1cclxufSlcclxuXHJcbi8vIFRoZSBzYW1lIGdvZXMgZm9yIHRoZSBlcnJvciBkaWFsb2cuXHJcbmZ1bmN0aW9uIGNsb3NlRXJyb3IoKTogdm9pZCB7XHJcbiAgZWxlbUJ5SWQoJ2Vycm9yJykuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcclxuICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgIGVsZW1CeUlkKCdlcnJvckJhY2tncm91bmQnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXHJcbiAgfSwgMzUwKVxyXG59XHJcblxyXG5lbGVtQnlJZCgnZXJyb3JObycpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xvc2VFcnJvcilcclxuZWxlbUJ5SWQoJ2Vycm9yQmFja2dyb3VuZCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xvc2VFcnJvcilcclxuXHJcbi8vIDxhIG5hbWU9XCJuZXdcIi8+XHJcbi8vIEFkZGluZyBuZXcgYXNzaWdubWVudHNcclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4vL1xyXG4vLyBUaGUgZXZlbnQgbGlzdGVuZXJzIGZvciB0aGUgbmV3IGJ1dHRvbnMgYXJlIGFkZGVkLlxyXG5yaXBwbGUoZWxlbUJ5SWQoJ25ldycpKVxyXG5yaXBwbGUoZWxlbUJ5SWQoJ25ld1Rhc2snKSlcclxuY29uc3Qgb25OZXdUYXNrID0gKCkgPT4ge1xyXG4gIHVwZGF0ZU5ld1RpcHMoKGVsZW1CeUlkKCduZXdUZXh0JykgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWUgPSAnJylcclxuICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbidcclxuICBlbGVtQnlJZCgnbmV3QmFja2dyb3VuZCcpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXHJcbiAgZWxlbUJ5SWQoJ25ld0RpYWxvZycpLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcbiAgZWxlbUJ5SWQoJ25ld1RleHQnKS5mb2N1cygpXHJcbn1cclxuZWxlbUJ5SWQoJ25ldycpLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBvbk5ld1Rhc2spXHJcbmVsZW1CeUlkKCduZXdUYXNrJykuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG9uTmV3VGFzaylcclxuXHJcbi8vIEEgZnVuY3Rpb24gdG8gY2xvc2UgdGhlIGRpYWxvZyBpcyB0aGVuIGRlZmluZWQuXHJcbmZ1bmN0aW9uIGNsb3NlTmV3KCk6IHZvaWQge1xyXG4gIGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnYXV0bydcclxuICBlbGVtQnlJZCgnbmV3RGlhbG9nJykuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcclxuICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgIGVsZW1CeUlkKCduZXdCYWNrZ3JvdW5kJykuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xyXG4gIH0sIDM1MClcclxufVxyXG5cclxuLy8gVGhpcyBmdW5jdGlvbiBpcyBzZXQgdG8gYmUgY2FsbGVkIGNhbGxlZCB3aGVuIHRoZSBFU0Mga2V5IGlzIGNhbGxlZCBpbnNpZGUgb2YgdGhlIGRpYWxvZy5cclxuZWxlbUJ5SWQoJ25ld1RleHQnKS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGV2dCkgPT4ge1xyXG4gIGlmIChldnQud2hpY2ggPT09IDI3KSB7IC8vIEVzY2FwZSBrZXkgcHJlc3NlZFxyXG4gICAgY2xvc2VOZXcoKVxyXG4gIH1cclxufSlcclxuXHJcbi8vIEFuIGV2ZW50IGxpc3RlbmVyIHRvIGNhbGwgdGhlIGZ1bmN0aW9uIGlzIGFsc28gYWRkZWQgdG8gdGhlIFggYnV0dG9uXHJcbmVsZW1CeUlkKCduZXdDYW5jZWwnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsb3NlTmV3KVxyXG5cclxuLy8gV2hlbiB0aGUgZW50ZXIga2V5IGlzIHByZXNzZWQgb3IgdGhlIHN1Ym1pdCBidXR0b24gaXMgY2xpY2tlZCwgdGhlIG5ldyBhc3NpZ25tZW50IGlzIGFkZGVkLlxyXG5lbGVtQnlJZCgnbmV3RGlhbG9nJykuYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgKGV2dCkgPT4ge1xyXG4gIGV2dC5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgY29uc3QgdGV4dCA9IChlbGVtQnlJZCgnbmV3VGV4dCcpIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlXHJcbiAgY29uc3QgeyBjbHMsIGR1ZSwgc3QgfSA9IHBhcnNlQ3VzdG9tVGFzayh0ZXh0KVxyXG4gIGxldCBlbmQ6ICdGb3JldmVyJ3xudW1iZXIgPSAnRm9yZXZlcidcclxuXHJcbiAgY29uc3Qgc3RhcnQgPSAoc3QgIT0gbnVsbCkgPyB0b0RhdGVOdW0oY2hyb25vLnBhcnNlRGF0ZShzdCkpIDogdG9kYXkoKVxyXG4gIGlmIChkdWUgIT0gbnVsbCkge1xyXG4gICAgZW5kID0gc3RhcnRcclxuICAgIGlmIChlbmQgPCBzdGFydCkgeyAvLyBBc3NpZ25tZW5kIGVuZHMgYmVmb3JlIGl0IGlzIGFzc2lnbmVkXHJcbiAgICAgIGVuZCArPSBNYXRoLmNlaWwoKHN0YXJ0IC0gZW5kKSAvIDcpICogN1xyXG4gICAgfVxyXG4gIH1cclxuICBhZGRUb0V4dHJhKHtcclxuICAgIGJvZHk6IHRleHQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB0ZXh0LnN1YnN0cigxKSxcclxuICAgIGRvbmU6IGZhbHNlLFxyXG4gICAgc3RhcnQsXHJcbiAgICBjbGFzczogKGNscyAhPSBudWxsKSA/IGNscy50b0xvd2VyQ2FzZSgpLnRyaW0oKSA6IG51bGwsXHJcbiAgICBlbmRcclxuICB9KVxyXG4gIHNhdmVFeHRyYSgpXHJcbiAgY2xvc2VOZXcoKVxyXG4gIGRpc3BsYXkoZmFsc2UpXHJcbn0pXHJcblxyXG51cGRhdGVOZXdUaXBzKCcnLCBmYWxzZSlcclxuZWxlbUJ5SWQoJ25ld1RleHQnKS5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsICgpID0+IHtcclxuICByZXR1cm4gdXBkYXRlTmV3VGlwcygoZWxlbUJ5SWQoJ25ld1RleHQnKSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSlcclxufSlcclxuXHJcbi8vIFRoZSBjb2RlIGJlbG93IHJlZ2lzdGVycyBhIHNlcnZpY2Ugd29ya2VyIHRoYXQgY2FjaGVzIHRoZSBwYWdlIHNvIGl0IGNhbiBiZSB2aWV3ZWQgb2ZmbGluZS5cclxuaWYgKCdzZXJ2aWNlV29ya2VyJyBpbiBuYXZpZ2F0b3IpIHtcclxuICBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5yZWdpc3RlcignL3NlcnZpY2Utd29ya2VyLmpzJylcclxuICAgIC50aGVuKChyZWdpc3RyYXRpb24pID0+XHJcbiAgICAgIC8vIFJlZ2lzdHJhdGlvbiB3YXMgc3VjY2Vzc2Z1bFxyXG4gICAgICBjb25zb2xlLmxvZygnU2VydmljZVdvcmtlciByZWdpc3RyYXRpb24gc3VjY2Vzc2Z1bCB3aXRoIHNjb3BlJywgcmVnaXN0cmF0aW9uLnNjb3BlKSkuY2F0Y2goKGVycikgPT5cclxuICAgICAgLy8gcmVnaXN0cmF0aW9uIGZhaWxlZCA6KFxyXG4gICAgICBjb25zb2xlLmxvZygnU2VydmljZVdvcmtlciByZWdpc3RyYXRpb24gZmFpbGVkOiAnLCBlcnIpXHJcbiAgKVxyXG59XHJcblxyXG4vLyBJZiB0aGUgc2VydmljZXdvcmtlciBkZXRlY3RzIHRoYXQgdGhlIHdlYiBhcHAgaGFzIGJlZW4gdXBkYXRlZCwgdGhlIGNvbW1pdCBpcyBmZXRjaGVkIGZyb20gR2l0SHViLlxyXG5uYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgKGV2ZW50KSA9PiB7XHJcbiAgICBjb25zb2xlLmxvZygnR2V0dGluZyBjb21taXQgYmVjYXVzZSBvZiBzZXJ2aWNld29ya2VyJylcclxuICAgIGlmIChldmVudC5kYXRhLmdldENvbW1pdCkgeyByZXR1cm4gY2hlY2tDb21taXQoKSB9XHJcbn0pXHJcbiIsImltcG9ydCB7IGNsYXNzQnlJZCwgZ2V0RGF0YSwgSUFzc2lnbm1lbnQgfSBmcm9tICcuLi9wY3InXHJcbmltcG9ydCB7IEFjdGl2aXR5VHlwZSB9IGZyb20gJy4uL3BsdWdpbnMvYWN0aXZpdHknXHJcbmltcG9ydCB7IGFzc2lnbm1lbnRJbkRvbmUgfSBmcm9tICcuLi9wbHVnaW5zL2RvbmUnXHJcbmltcG9ydCB7IF8kLCBkYXRlU3RyaW5nLCBlbGVtQnlJZCwgZWxlbWVudCwgc21vb3RoU2Nyb2xsIH0gZnJvbSAnLi4vdXRpbCdcclxuaW1wb3J0IHsgc2VwYXJhdGUgfSBmcm9tICcuL2Fzc2lnbm1lbnQnXHJcblxyXG5jb25zdCBpbnNlcnRUbyA9IGVsZW1CeUlkKCdpbmZvQWN0aXZpdHknKVxyXG5leHBvcnQgZnVuY3Rpb24gYWRkQWN0aXZpdHlFbGVtZW50KGVsOiBIVE1MRWxlbWVudCk6IHZvaWQge1xyXG4gICAgaW5zZXJ0VG8uaW5zZXJ0QmVmb3JlKGVsLCBpbnNlcnRUby5xdWVyeVNlbGVjdG9yKCcuYWN0aXZpdHknKSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUFjdGl2aXR5KHR5cGU6IEFjdGl2aXR5VHlwZSwgYXNzaWdubWVudDogSUFzc2lnbm1lbnQsIGRhdGU6IERhdGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU/OiBzdHJpbmcgKTogSFRNTEVsZW1lbnQge1xyXG4gICAgY29uc3QgY25hbWUgPSBjbGFzc05hbWUgfHwgY2xhc3NCeUlkKGFzc2lnbm1lbnQuY2xhc3MpXHJcblxyXG4gICAgY29uc3QgdGUgPSBlbGVtZW50KCdkaXYnLCBbJ2FjdGl2aXR5JywgJ2Fzc2lnbm1lbnRJdGVtJywgYXNzaWdubWVudC5iYXNlVHlwZSwgdHlwZV0sIGBcclxuICAgICAgICA8aSBjbGFzcz0nbWF0ZXJpYWwtaWNvbnMnPiR7dHlwZX08L2k+XHJcbiAgICAgICAgPHNwYW4gY2xhc3M9J3RpdGxlJz4ke2Fzc2lnbm1lbnQudGl0bGV9PC9zcGFuPlxyXG4gICAgICAgIDxzbWFsbD4ke3NlcGFyYXRlKGNuYW1lKVsyXX08L3NtYWxsPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9J3JhbmdlJz4ke2RhdGVTdHJpbmcoZGF0ZSl9PC9kaXY+YCwgYGFjdGl2aXR5JHthc3NpZ25tZW50LmlkfWApXHJcbiAgICB0ZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtY2xhc3MnLCBjbmFtZSlcclxuICAgIGNvbnN0IHsgaWQgfSA9IGFzc2lnbm1lbnRcclxuICAgIGlmICh0eXBlICE9PSAnZGVsZXRlJykge1xyXG4gICAgICAgIHRlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBkb1Njcm9sbGluZyA9IGFzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGVsID0gXyQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLmFzc2lnbm1lbnRbaWQqPVxcXCIke2lkfVxcXCJdYCkpIGFzIEhUTUxFbGVtZW50XHJcbiAgICAgICAgICAgICAgICBhd2FpdCBzbW9vdGhTY3JvbGwoKGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCArIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wKSAtIDExNilcclxuICAgICAgICAgICAgICAgIGVsLmNsaWNrKClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuYm9keS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmlldycpID09PSAnMCcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGRvU2Nyb2xsaW5nKClcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIChfJChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbmF2VGFicz5saTpmaXJzdC1jaGlsZCcpKSBhcyBIVE1MRWxlbWVudCkuY2xpY2soKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZG9TY3JvbGxpbmcsIDUwMClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGFzc2lnbm1lbnRJbkRvbmUoYXNzaWdubWVudC5pZCkpIHtcclxuICAgICAgdGUuY2xhc3NMaXN0LmFkZCgnZG9uZScpXHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGVcclxufVxyXG4iLCJpbXBvcnQgeyBmcm9tRGF0ZU51bSwgdG9kYXkgfSBmcm9tICcuLi9kYXRlcydcclxuaW1wb3J0IHsgZGlzcGxheSwgZ2V0VGltZUFmdGVyLCBJU3BsaXRBc3NpZ25tZW50IH0gZnJvbSAnLi4vZGlzcGxheSdcclxuaW1wb3J0IHsgZ2V0TGlzdERhdGVPZmZzZXQgfSBmcm9tICcuLi9uYXZpZ2F0aW9uJ1xyXG5pbXBvcnQgeyBnZXRBdHRhY2htZW50TWltZVR5cGUsIElBcHBsaWNhdGlvbkRhdGEsIElBc3NpZ25tZW50LCB1cmxGb3JBdHRhY2htZW50IH0gZnJvbSAnLi4vcGNyJ1xyXG5pbXBvcnQgeyByZWNlbnRBY3Rpdml0eSB9IGZyb20gJy4uL3BsdWdpbnMvYWN0aXZpdHknXHJcbmltcG9ydCB7IGdldEF0aGVuYURhdGEgfSBmcm9tICcuLi9wbHVnaW5zL2F0aGVuYSdcclxuaW1wb3J0IHsgcmVtb3ZlRnJvbUV4dHJhLCBzYXZlRXh0cmEgfSBmcm9tICcuLi9wbHVnaW5zL2N1c3RvbUFzc2lnbm1lbnRzJ1xyXG5pbXBvcnQgeyBhZGRUb0RvbmUsIGFzc2lnbm1lbnRJbkRvbmUsIHJlbW92ZUZyb21Eb25lLCBzYXZlRG9uZSB9IGZyb20gJy4uL3BsdWdpbnMvZG9uZSdcclxuaW1wb3J0IHsgbW9kaWZpZWRCb2R5LCByZW1vdmVGcm9tTW9kaWZpZWQsIHNhdmVNb2RpZmllZCwgc2V0TW9kaWZpZWQgfSBmcm9tICcuLi9wbHVnaW5zL21vZGlmaWVkQXNzaWdubWVudHMnXHJcbmltcG9ydCB7IF8kLCBjc3NOdW1iZXIsIGRhdGVTdHJpbmcsIGVsZW1CeUlkLCBlbGVtZW50LCBmb3JjZUxheW91dCwgbG9jYWxTdG9yYWdlUmVhZCwgcmlwcGxlIH0gZnJvbSAnLi4vdXRpbCdcclxuaW1wb3J0IHsgcmVzaXplIH0gZnJvbSAnLi9yZXNpemVyJ1xyXG5cclxuY29uc3QgbWltZVR5cGVzOiB7IFttaW1lOiBzdHJpbmddOiBbc3RyaW5nLCBzdHJpbmddIH0gPSB7XHJcbiAgICAnYXBwbGljYXRpb24vbXN3b3JkJzogWydXb3JkIERvYycsICdkb2N1bWVudCddLFxyXG4gICAgJ2FwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC53b3JkcHJvY2Vzc2luZ21sLmRvY3VtZW50JzogWydXb3JkIERvYycsICdkb2N1bWVudCddLFxyXG4gICAgJ2FwcGxpY2F0aW9uL3ZuZC5tcy1wb3dlcnBvaW50JzogWydQUFQgUHJlc2VudGF0aW9uJywgJ3NsaWRlcyddLFxyXG4gICAgJ2FwcGxpY2F0aW9uL3BkZic6IFsnUERGIEZpbGUnLCAncGRmJ10sXHJcbiAgICAndGV4dC9wbGFpbic6IFsnVGV4dCBEb2MnLCAncGxhaW4nXVxyXG59XHJcblxyXG5jb25zdCBkbXAgPSBuZXcgZGlmZl9tYXRjaF9wYXRjaCgpIC8vIEZvciBkaWZmaW5nXHJcblxyXG5mdW5jdGlvbiBwb3B1bGF0ZUFkZGVkRGVsZXRlZChkaWZmczogYW55W10sIGVkaXRzOiBIVE1MRWxlbWVudCk6IGJvb2xlYW4ge1xyXG4gICAgbGV0IGFkZGVkID0gMFxyXG4gICAgbGV0IGRlbGV0ZWQgPSAwXHJcbiAgICBkaWZmcy5mb3JFYWNoKChkaWZmKSA9PiB7XHJcbiAgICAgICAgaWYgKGRpZmZbMF0gPT09IDEpIHsgYWRkZWQrKyB9XHJcbiAgICAgICAgaWYgKGRpZmZbMF0gPT09IC0xKSB7IGRlbGV0ZWQrKyB9XHJcbiAgICB9KVxyXG4gICAgXyQoZWRpdHMucXVlcnlTZWxlY3RvcignLmFkZGl0aW9ucycpKS5pbm5lckhUTUwgPSBhZGRlZCAhPT0gMCA/IGArJHthZGRlZH1gIDogJydcclxuICAgIF8kKGVkaXRzLnF1ZXJ5U2VsZWN0b3IoJy5kZWxldGlvbnMnKSkuaW5uZXJIVE1MID0gZGVsZXRlZCAhPT0gMCA/IGAtJHtkZWxldGVkfWAgOiAnJ1xyXG4gICAgZWRpdHMuY2xhc3NMaXN0LmFkZCgnbm90RW1wdHknKVxyXG4gICAgcmV0dXJuIGFkZGVkID4gMCB8fCBkZWxldGVkID4gMFxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY29tcHV0ZVdlZWtJZChzcGxpdDogSVNwbGl0QXNzaWdubWVudCk6IHN0cmluZyB7XHJcbiAgICBjb25zdCBzdGFydFN1biA9IG5ldyBEYXRlKHNwbGl0LnN0YXJ0LmdldFRpbWUoKSlcclxuICAgIHN0YXJ0U3VuLnNldERhdGUoc3RhcnRTdW4uZ2V0RGF0ZSgpIC0gc3RhcnRTdW4uZ2V0RGF5KCkpXHJcbiAgICByZXR1cm4gYHdrJHtzdGFydFN1bi5nZXRNb250aCgpfS0ke3N0YXJ0U3VuLmdldERhdGUoKX1gXHJcbn1cclxuXHJcbi8vIFRoaXMgZnVuY3Rpb24gc2VwYXJhdGVzIHRoZSBwYXJ0cyBvZiBhIGNsYXNzIG5hbWUuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXBhcmF0ZShjbDogc3RyaW5nKTogUmVnRXhwTWF0Y2hBcnJheSB7XHJcbiAgICBjb25zdCBtID0gY2wubWF0Y2goLygoPzpcXGQqXFxzKyk/KD86KD86aG9uXFx3KnwoPzphZHZcXHcqXFxzKik/Y29yZSlcXHMrKT8pKC4qKS9pKVxyXG4gICAgaWYgKG0gPT0gbnVsbCkgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3Qgc2VwYXJhdGUgY2xhc3Mgc3RyaW5nICR7Y2x9YClcclxuICAgIHJldHVybiBtXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBhc3NpZ25tZW50Q2xhc3MoYXNzaWdubWVudDogSUFzc2lnbm1lbnQsIGRhdGE6IElBcHBsaWNhdGlvbkRhdGEpOiBzdHJpbmcge1xyXG4gICAgY29uc3QgY2xzID0gKGFzc2lnbm1lbnQuY2xhc3MgIT0gbnVsbCkgPyBkYXRhLmNsYXNzZXNbYXNzaWdubWVudC5jbGFzc10gOiAnVGFzaydcclxuICAgIGlmIChjbHMgPT0gbnVsbCkgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCBjbGFzcyAke2Fzc2lnbm1lbnQuY2xhc3N9IGluICR7ZGF0YS5jbGFzc2VzfWApXHJcbiAgICByZXR1cm4gY2xzXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXBhcmF0ZWRDbGFzcyhhc3NpZ25tZW50OiBJQXNzaWdubWVudCwgZGF0YTogSUFwcGxpY2F0aW9uRGF0YSk6IFJlZ0V4cE1hdGNoQXJyYXkge1xyXG4gICAgcmV0dXJuIHNlcGFyYXRlKGFzc2lnbm1lbnRDbGFzcyhhc3NpZ25tZW50LCBkYXRhKSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUFzc2lnbm1lbnQoc3BsaXQ6IElTcGxpdEFzc2lnbm1lbnQsIGRhdGE6IElBcHBsaWNhdGlvbkRhdGEpOiBIVE1MRWxlbWVudCB7XHJcbiAgICBjb25zdCB7IGFzc2lnbm1lbnQsIHJlZmVyZW5jZSB9ID0gc3BsaXRcclxuXHJcbiAgICAvLyBTZXBhcmF0ZSB0aGUgY2xhc3MgZGVzY3JpcHRpb24gZnJvbSB0aGUgYWN0dWFsIGNsYXNzXHJcbiAgICBjb25zdCBzZXBhcmF0ZWQgPSBzZXBhcmF0ZWRDbGFzcyhhc3NpZ25tZW50LCBkYXRhKVxyXG5cclxuICAgIGNvbnN0IHdlZWtJZCA9IGNvbXB1dGVXZWVrSWQoc3BsaXQpXHJcblxyXG4gICAgbGV0IHNtYWxsVGFnID0gJ3NtYWxsJ1xyXG4gICAgbGV0IGxpbmsgPSBudWxsXHJcbiAgICBjb25zdCBhdGhlbmFEYXRhID0gZ2V0QXRoZW5hRGF0YSgpXHJcbiAgICBpZiAoYXRoZW5hRGF0YSAmJiBhc3NpZ25tZW50LmNsYXNzICE9IG51bGwgJiYgKGF0aGVuYURhdGFbZGF0YS5jbGFzc2VzW2Fzc2lnbm1lbnQuY2xhc3NdXSAhPSBudWxsKSkge1xyXG4gICAgICAgIGxpbmsgPSBhdGhlbmFEYXRhW2RhdGEuY2xhc3Nlc1thc3NpZ25tZW50LmNsYXNzXV0ubGlua1xyXG4gICAgICAgIHNtYWxsVGFnID0gJ2EnXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZSA9IGVsZW1lbnQoJ2RpdicsIFsnYXNzaWdubWVudCcsIGFzc2lnbm1lbnQuYmFzZVR5cGUsICdhbmltJ10sXHJcbiAgICAgICAgICAgICAgICAgICAgICBgPCR7c21hbGxUYWd9JHtsaW5rID8gYCBocmVmPScke2xpbmt9JyBjbGFzcz0nbGlua2VkJyB0YXJnZXQ9J19ibGFuaydgIDogJyd9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz0nZXh0cmEnPiR7c2VwYXJhdGVkWzFdfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtzZXBhcmF0ZWRbMl19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgPC8ke3NtYWxsVGFnfT48c3BhbiBjbGFzcz0ndGl0bGUnPiR7YXNzaWdubWVudC50aXRsZX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9J2hpZGRlbicgY2xhc3M9J2R1ZSdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9JyR7YXNzaWdubWVudC5lbmQgPT09ICdGb3JldmVyJyA/IDAgOiBhc3NpZ25tZW50LmVuZH0nIC8+YCxcclxuICAgICAgICAgICAgICAgICAgICAgIGFzc2lnbm1lbnQuaWQgKyB3ZWVrSWQpXHJcblxyXG4gICAgaWYgKCggcmVmZXJlbmNlICYmIHJlZmVyZW5jZS5kb25lKSB8fCBhc3NpZ25tZW50SW5Eb25lKGFzc2lnbm1lbnQuaWQpKSB7XHJcbiAgICAgICAgZS5jbGFzc0xpc3QuYWRkKCdkb25lJylcclxuICAgIH1cclxuICAgIGUuc2V0QXR0cmlidXRlKCdkYXRhLWNsYXNzJywgYXNzaWdubWVudENsYXNzKGFzc2lnbm1lbnQsIGRhdGEpKVxyXG4gICAgY29uc3QgY2xvc2UgPSBlbGVtZW50KCdhJywgWydjbG9zZScsICdtYXRlcmlhbC1pY29ucyddLCAnY2xvc2UnKVxyXG4gICAgY2xvc2UuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbG9zZU9wZW5lZClcclxuICAgIGUuYXBwZW5kQ2hpbGQoY2xvc2UpXHJcblxyXG4gICAgLy8gUHJldmVudCBjbGlja2luZyB0aGUgY2xhc3MgbmFtZSB3aGVuIGFuIGl0ZW0gaXMgZGlzcGxheWVkIG9uIHRoZSBjYWxlbmRhciBmcm9tIGRvaW5nIGFueXRoaW5nXHJcbiAgICBpZiAobGluayAhPSBudWxsKSB7XHJcbiAgICAgICAgXyQoZS5xdWVyeVNlbGVjdG9yKCdhJykpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2dCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoKGRvY3VtZW50LmJvZHkuZ2V0QXR0cmlidXRlKCdkYXRhLXZpZXcnKSA9PT0gJzAnKSAmJiAhZS5jbGFzc0xpc3QuY29udGFpbnMoJ2Z1bGwnKSkge1xyXG4gICAgICAgICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgY29tcGxldGUgPSBlbGVtZW50KCdhJywgWydjb21wbGV0ZScsICdtYXRlcmlhbC1pY29ucycsICd3YXZlcyddLCAnZG9uZScpXHJcbiAgICByaXBwbGUoY29tcGxldGUpXHJcbiAgICBjb25zdCBpZCA9IHNwbGl0LmFzc2lnbm1lbnQuaWRcclxuICAgIGNvbXBsZXRlLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCAoZXZ0KSA9PiB7XHJcbiAgICAgICAgaWYgKGV2dC53aGljaCA9PT0gMSkgeyAvLyBMZWZ0IGJ1dHRvblxyXG4gICAgICAgICAgICBsZXQgYWRkZWQgPSB0cnVlXHJcbiAgICAgICAgICAgIGlmIChyZWZlcmVuY2UgIT0gbnVsbCkgeyAvLyBUYXNrIGl0ZW1cclxuICAgICAgICAgICAgICAgIGlmIChlLmNsYXNzTGlzdC5jb250YWlucygnZG9uZScpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVmZXJlbmNlLmRvbmUgPSBmYWxzZVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBhZGRlZCA9IGZhbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgcmVmZXJlbmNlLmRvbmUgPSB0cnVlXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBzYXZlRXh0cmEoKVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdkb25lJykpIHtcclxuICAgICAgICAgICAgICAgICAgICByZW1vdmVGcm9tRG9uZShhc3NpZ25tZW50LmlkKVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBhZGRlZCA9IGZhbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgYWRkVG9Eb25lKGFzc2lnbm1lbnQuaWQpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBzYXZlRG9uZSgpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGRvY3VtZW50LmJvZHkuZ2V0QXR0cmlidXRlKCdkYXRhLXZpZXcnKSA9PT0gJzEnKSB7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcclxuICAgICAgICAgICAgICAgICAgICBgLmFzc2lnbm1lbnRbaWRePVxcXCIke2lkfVxcXCJdLCAjdGVzdCR7aWR9LCAjYWN0aXZpdHkke2lkfSwgI2lhJHtpZH1gXHJcbiAgICAgICAgICAgICAgICApLmZvckVhY2goKGVsZW0pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBlbGVtLmNsYXNzTGlzdC50b2dnbGUoJ2RvbmUnKVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIGlmIChhZGRlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYXNzaWdubWVudC5saXN0RGlzcDpub3QoLmRvbmUpJykubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnbm9MaXN0JylcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYXNzaWdubWVudC5saXN0RGlzcDpub3QoLmRvbmUpJykubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnbm9MaXN0JylcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXNpemUoKVxyXG4gICAgICAgICAgICB9LCAxMDApXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcclxuICAgICAgICAgICAgICAgIGAuYXNzaWdubWVudFtpZF49XFxcIiR7aWR9XFxcIl0sICN0ZXN0JHtpZH0sICNhY3Rpdml0eSR7aWR9LCAjaWEke2lkfWBcclxuICAgICAgICAgICAgKS5mb3JFYWNoKChlbGVtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBlbGVtLmNsYXNzTGlzdC50b2dnbGUoJ2RvbmUnKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICBpZiAoYWRkZWQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYXNzaWdubWVudC5saXN0RGlzcDpub3QoLmRvbmUpJykubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdub0xpc3QnKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5hc3NpZ25tZW50Lmxpc3REaXNwOm5vdCguZG9uZSknKS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ25vTGlzdCcpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbiAgICBlLmFwcGVuZENoaWxkKGNvbXBsZXRlKVxyXG5cclxuICAgIC8vIElmIHRoZSBhc3NpZ25tZW50IGlzIGEgY3VzdG9tIG9uZSwgYWRkIGEgYnV0dG9uIHRvIGRlbGV0ZSBpdFxyXG4gICAgaWYgKHNwbGl0LmN1c3RvbSkge1xyXG4gICAgICAgIGNvbnN0IGRlbGV0ZUEgPSBlbGVtZW50KCdhJywgWydtYXRlcmlhbC1pY29ucycsICdkZWxldGVBc3NpZ25tZW50JywgJ3dhdmVzJ10sICdkZWxldGUnKVxyXG4gICAgICAgIHJpcHBsZShkZWxldGVBKVxyXG4gICAgICAgIGRlbGV0ZUEuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIChldnQpID0+IHtcclxuICAgICAgICAgICAgaWYgKGV2dC53aGljaCAhPT0gMSB8fCAhcmVmZXJlbmNlKSByZXR1cm5cclxuICAgICAgICAgICAgcmVtb3ZlRnJvbUV4dHJhKHJlZmVyZW5jZSlcclxuICAgICAgICAgICAgc2F2ZUV4dHJhKClcclxuICAgICAgICAgICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mdWxsJykgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICdhdXRvJ1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYmFjayA9IGVsZW1CeUlkKCdiYWNrZ3JvdW5kJylcclxuICAgICAgICAgICAgICAgIGJhY2suY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGJhY2suc3R5bGUuZGlzcGxheSA9ICdub25lJ1xyXG4gICAgICAgICAgICAgICAgfSwgMzUwKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGUucmVtb3ZlKClcclxuICAgICAgICAgICAgZGlzcGxheShmYWxzZSlcclxuICAgICAgICB9KVxyXG4gICAgICAgIGUuYXBwZW5kQ2hpbGQoZGVsZXRlQSlcclxuICAgIH1cclxuXHJcbiAgICAvLyBNb2RpZmljYXRpb24gYnV0dG9uXHJcbiAgICBjb25zdCBlZGl0ID0gZWxlbWVudCgnYScsIFsnZWRpdEFzc2lnbm1lbnQnLCAnbWF0ZXJpYWwtaWNvbnMnLCAnd2F2ZXMnXSwgJ2VkaXQnKVxyXG4gICAgZWRpdC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgKGV2dCkgPT4ge1xyXG4gICAgICAgIGlmIChldnQud2hpY2ggPT09IDEpIHtcclxuICAgICAgICAgICAgY29uc3QgcmVtb3ZlID0gZWRpdC5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpXHJcbiAgICAgICAgICAgIGVkaXQuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJylcclxuICAgICAgICAgICAgXyQoZS5xdWVyeVNlbGVjdG9yKCcuYm9keScpKS5zZXRBdHRyaWJ1dGUoJ2NvbnRlbnRFZGl0YWJsZScsIHJlbW92ZSA/ICdmYWxzZScgOiAndHJ1ZScpXHJcbiAgICAgICAgICAgIGlmICghcmVtb3ZlKSB7XHJcbiAgICAgICAgICAgICAgICAoZS5xdWVyeVNlbGVjdG9yKCcuYm9keScpIGFzIEhUTUxFbGVtZW50KS5mb2N1cygpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgZG4gPSBlLnF1ZXJ5U2VsZWN0b3IoJy5jb21wbGV0ZScpIGFzIEhUTUxFbGVtZW50XHJcbiAgICAgICAgICAgIGRuLnN0eWxlLmRpc3BsYXkgPSByZW1vdmUgPyAnYmxvY2snIDogJ25vbmUnXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICAgIHJpcHBsZShlZGl0KVxyXG5cclxuICAgIGUuYXBwZW5kQ2hpbGQoZWRpdClcclxuXHJcbiAgICBjb25zdCBzdGFydCA9IG5ldyBEYXRlKGZyb21EYXRlTnVtKGFzc2lnbm1lbnQuc3RhcnQpKVxyXG4gICAgY29uc3QgZW5kID0gYXNzaWdubWVudC5lbmQgPT09ICdGb3JldmVyJyA/IGFzc2lnbm1lbnQuZW5kIDogbmV3IERhdGUoZnJvbURhdGVOdW0oYXNzaWdubWVudC5lbmQpKVxyXG4gICAgY29uc3QgdGltZXMgPSBlbGVtZW50KCdkaXYnLCAncmFuZ2UnLFxyXG4gICAgICAgIGFzc2lnbm1lbnQuc3RhcnQgPT09IGFzc2lnbm1lbnQuZW5kID8gZGF0ZVN0cmluZyhzdGFydCkgOiBgJHtkYXRlU3RyaW5nKHN0YXJ0KX0gJm5kYXNoOyAke2RhdGVTdHJpbmcoZW5kKX1gKVxyXG4gICAgZS5hcHBlbmRDaGlsZCh0aW1lcylcclxuICAgIGlmIChhc3NpZ25tZW50LmF0dGFjaG1lbnRzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBjb25zdCBhdHRhY2htZW50cyA9IGVsZW1lbnQoJ2RpdicsICdhdHRhY2htZW50cycpXHJcbiAgICAgICAgYXNzaWdubWVudC5hdHRhY2htZW50cy5mb3JFYWNoKChhdHRhY2htZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGEgPSBlbGVtZW50KCdhJywgW10sIGF0dGFjaG1lbnRbMF0pIGFzIEhUTUxBbmNob3JFbGVtZW50XHJcbiAgICAgICAgICAgIGEuaHJlZiA9IHVybEZvckF0dGFjaG1lbnQoYXR0YWNobWVudFsxXSlcclxuICAgICAgICAgICAgZ2V0QXR0YWNobWVudE1pbWVUeXBlKGF0dGFjaG1lbnRbMV0pLnRoZW4oKHR5cGUpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBzcGFuXHJcbiAgICAgICAgICAgICAgICBpZiAobWltZVR5cGVzW3R5cGVdICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICBhLmNsYXNzTGlzdC5hZGQobWltZVR5cGVzW3R5cGVdWzFdKVxyXG4gICAgICAgICAgICAgICAgICAgIHNwYW4gPSBlbGVtZW50KCdzcGFuJywgW10sIG1pbWVUeXBlc1t0eXBlXVswXSlcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3BhbiA9IGVsZW1lbnQoJ3NwYW4nLCBbXSwgJ1Vua25vd24gZmlsZSB0eXBlJylcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGEuYXBwZW5kQ2hpbGQoc3BhbilcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgYXR0YWNobWVudHMuYXBwZW5kQ2hpbGQoYSlcclxuICAgICAgICB9KVxyXG4gICAgICAgIGUuYXBwZW5kQ2hpbGQoYXR0YWNobWVudHMpXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgYm9keSA9IGVsZW1lbnQoJ2RpdicsICdib2R5JyxcclxuICAgICAgICBhc3NpZ25tZW50LmJvZHkucmVwbGFjZSgvZm9udC1mYW1pbHk6W147XSo/KD86VGltZXMgTmV3IFJvbWFufHNlcmlmKVteO10qL2csICcnKSlcclxuICAgIGNvbnN0IGVkaXRzID0gZWxlbWVudCgnZGl2JywgJ2VkaXRzJywgJzxzcGFuIGNsYXNzPVxcJ2FkZGl0aW9uc1xcJz48L3NwYW4+PHNwYW4gY2xhc3M9XFwnZGVsZXRpb25zXFwnPjwvc3Bhbj4nKVxyXG4gICAgY29uc3QgbSA9IG1vZGlmaWVkQm9keShhc3NpZ25tZW50LmlkKVxyXG4gICAgaWYgKG0gIT0gbnVsbCkge1xyXG4gICAgICAgIGNvbnN0IGQgPSBkbXAuZGlmZl9tYWluKGFzc2lnbm1lbnQuYm9keSwgbSlcclxuICAgICAgICBkbXAuZGlmZl9jbGVhbnVwU2VtYW50aWMoZClcclxuICAgICAgICBpZiAoZC5sZW5ndGggIT09IDApIHsgLy8gSGFzIGJlZW4gZWRpdGVkXHJcbiAgICAgICAgICAgIHBvcHVsYXRlQWRkZWREZWxldGVkKGQsIGVkaXRzKVxyXG4gICAgICAgICAgICBib2R5LmlubmVySFRNTCA9IG1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYm9keS5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIChldnQpID0+IHtcclxuICAgICAgICBpZiAocmVmZXJlbmNlICE9IG51bGwpIHtcclxuICAgICAgICAgICAgcmVmZXJlbmNlLmJvZHkgPSBib2R5LmlubmVySFRNTFxyXG4gICAgICAgICAgICBzYXZlRXh0cmEoKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHNldE1vZGlmaWVkKGFzc2lnbm1lbnQuaWQsICBib2R5LmlubmVySFRNTClcclxuICAgICAgICAgICAgc2F2ZU1vZGlmaWVkKClcclxuICAgICAgICAgICAgY29uc3QgZCA9IGRtcC5kaWZmX21haW4oYXNzaWdubWVudC5ib2R5LCBib2R5LmlubmVySFRNTClcclxuICAgICAgICAgICAgZG1wLmRpZmZfY2xlYW51cFNlbWFudGljKGQpXHJcbiAgICAgICAgICAgIGlmIChwb3B1bGF0ZUFkZGVkRGVsZXRlZChkLCBlZGl0cykpIHtcclxuICAgICAgICAgICAgICAgIGVkaXRzLmNsYXNzTGlzdC5hZGQoJ25vdEVtcHR5JylcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGVkaXRzLmNsYXNzTGlzdC5yZW1vdmUoJ25vdEVtcHR5JylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZG9jdW1lbnQuYm9keS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmlldycpID09PSAnMScpIHJlc2l6ZSgpXHJcbiAgICB9KVxyXG5cclxuICAgIGUuYXBwZW5kQ2hpbGQoYm9keSlcclxuXHJcbiAgICBjb25zdCByZXN0b3JlID0gZWxlbWVudCgnYScsIFsnbWF0ZXJpYWwtaWNvbnMnLCAncmVzdG9yZSddLCAnc2V0dGluZ3NfYmFja3VwX3Jlc3RvcmUnKVxyXG4gICAgcmVzdG9yZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICByZW1vdmVGcm9tTW9kaWZpZWQoYXNzaWdubWVudC5pZClcclxuICAgICAgICBzYXZlTW9kaWZpZWQoKVxyXG4gICAgICAgIGJvZHkuaW5uZXJIVE1MID0gYXNzaWdubWVudC5ib2R5XHJcbiAgICAgICAgZWRpdHMuY2xhc3NMaXN0LnJlbW92ZSgnbm90RW1wdHknKVxyXG4gICAgICAgIGlmIChkb2N1bWVudC5ib2R5LmdldEF0dHJpYnV0ZSgnZGF0YS12aWV3JykgPT09ICcxJykgIHJlc2l6ZSgpXHJcbiAgICB9KVxyXG4gICAgZWRpdHMuYXBwZW5kQ2hpbGQocmVzdG9yZSlcclxuICAgIGUuYXBwZW5kQ2hpbGQoZWRpdHMpXHJcblxyXG4gICAgY29uc3QgbW9kcyA9IGVsZW1lbnQoJ2RpdicsIFsnbW9kcyddKVxyXG4gICAgcmVjZW50QWN0aXZpdHkoKS5mb3JFYWNoKChhKSA9PiB7XHJcbiAgICAgICAgaWYgKChhWzBdID09PSAnZWRpdCcpICYmIChhWzFdLmlkID09PSBhc3NpZ25tZW50LmlkKSkge1xyXG4gICAgICAgIGNvbnN0IHRlID0gZWxlbWVudCgnZGl2JywgWydpbm5lckFjdGl2aXR5JywgJ2Fzc2lnbm1lbnRJdGVtJywgYXNzaWdubWVudC5iYXNlVHlwZV0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGA8aSBjbGFzcz0nbWF0ZXJpYWwtaWNvbnMnPmVkaXQ8L2k+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz0ndGl0bGUnPiR7ZGF0ZVN0cmluZyhuZXcgRGF0ZShhWzJdKSl9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9J2FkZGl0aW9ucyc+PC9zcGFuPjxzcGFuIGNsYXNzPSdkZWxldGlvbnMnPjwvc3Bhbj5gLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBgaWEke2Fzc2lnbm1lbnQuaWR9YClcclxuICAgICAgICBjb25zdCBkID0gZG1wLmRpZmZfbWFpbihhWzFdLmJvZHksIGFzc2lnbm1lbnQuYm9keSlcclxuICAgICAgICBkbXAuZGlmZl9jbGVhbnVwU2VtYW50aWMoZClcclxuICAgICAgICBwb3B1bGF0ZUFkZGVkRGVsZXRlZChkLCB0ZSlcclxuXHJcbiAgICAgICAgaWYgKGFzc2lnbm1lbnQuY2xhc3MpIHRlLnNldEF0dHJpYnV0ZSgnZGF0YS1jbGFzcycsIGRhdGEuY2xhc3Nlc1thc3NpZ25tZW50LmNsYXNzXSlcclxuICAgICAgICB0ZS5hcHBlbmRDaGlsZChlbGVtZW50KCdkaXYnLCAnaWFEaWZmJywgZG1wLmRpZmZfcHJldHR5SHRtbChkKSkpXHJcbiAgICAgICAgdGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRlLmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScpXHJcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5ib2R5LmdldEF0dHJpYnV0ZSgnZGF0YS12aWV3JykgPT09ICcxJykgcmVzaXplKClcclxuICAgICAgICB9KVxyXG4gICAgICAgIG1vZHMuYXBwZW5kQ2hpbGQodGUpXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICAgIGUuYXBwZW5kQ2hpbGQobW9kcylcclxuXHJcbiAgICBpZiAoKGxvY2FsU3RvcmFnZVJlYWQoJ2Fzc2lnbm1lbnRTcGFuJykgPT09ICdtdWx0aXBsZScpICYmIChzdGFydCA8IHNwbGl0LnN0YXJ0KSkge1xyXG4gICAgICAgIGUuY2xhc3NMaXN0LmFkZCgnZnJvbVdlZWtlbmQnKVxyXG4gICAgfVxyXG4gICAgaWYgKChsb2NhbFN0b3JhZ2VSZWFkKCdhc3NpZ25tZW50U3BhbicpID09PSAnbXVsdGlwbGUnKSAmJiAoZW5kID4gc3BsaXQuZW5kKSkge1xyXG4gICAgICAgIGUuY2xhc3NMaXN0LmFkZCgnb3ZlcldlZWtlbmQnKVxyXG4gICAgfVxyXG4gICAgZS5jbGFzc0xpc3QuYWRkKGBzJHtzcGxpdC5zdGFydC5nZXREYXkoKX1gKVxyXG4gICAgaWYgKHNwbGl0LmVuZCAhPT0gJ0ZvcmV2ZXInKSBlLmNsYXNzTGlzdC5hZGQoYGUkezYgLSBzcGxpdC5lbmQuZ2V0RGF5KCl9YClcclxuXHJcbiAgICBjb25zdCBzdCA9IE1hdGguZmxvb3Ioc3BsaXQuc3RhcnQuZ2V0VGltZSgpIC8gMTAwMCAvIDM2MDAgLyAyNClcclxuICAgIGlmIChzcGxpdC5hc3NpZ25tZW50LmVuZCA9PT0gJ0ZvcmV2ZXInKSB7XHJcbiAgICAgICAgaWYgKHN0IDw9ICh0b2RheSgpICsgZ2V0TGlzdERhdGVPZmZzZXQoKSkpIHtcclxuICAgICAgICAgICAgZS5jbGFzc0xpc3QuYWRkKCdsaXN0RGlzcCcpXHJcbiAgICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zdCBtaWREYXRlID0gbmV3IERhdGUoKVxyXG4gICAgICAgIG1pZERhdGUuc2V0RGF0ZShtaWREYXRlLmdldERhdGUoKSArIGdldExpc3REYXRlT2Zmc2V0KCkpXHJcbiAgICAgICAgY29uc3QgcHVzaCA9IChhc3NpZ25tZW50LmJhc2VUeXBlID09PSAndGVzdCcgJiYgYXNzaWdubWVudC5zdGFydCA9PT0gc3QpID8gbG9jYWxTdG9yYWdlUmVhZCgnZWFybHlUZXN0JykgOiAwXHJcbiAgICAgICAgY29uc3QgZW5kRXh0cmEgPSBnZXRMaXN0RGF0ZU9mZnNldCgpID09PSAwID8gZ2V0VGltZUFmdGVyKG1pZERhdGUpIDogMjQgKiAzNjAwICogMTAwMFxyXG4gICAgICAgIGlmIChmcm9tRGF0ZU51bShzdCAtIHB1c2gpIDw9IG1pZERhdGUgJiZcclxuICAgICAgICAgICAgKHNwbGl0LmVuZCA9PT0gJ0ZvcmV2ZXInIHx8IG1pZERhdGUuZ2V0VGltZSgpIDw9IHNwbGl0LmVuZC5nZXRUaW1lKCkgKyBlbmRFeHRyYSkpIHtcclxuICAgICAgICAgICAgZS5jbGFzc0xpc3QuYWRkKCdsaXN0RGlzcCcpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIEFkZCBjbGljayBpbnRlcmFjdGl2aXR5XHJcbiAgICBpZiAoIXNwbGl0LmN1c3RvbSB8fCAhSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2Uuc2VwVGFza3MpKSB7XHJcbiAgICAgICAgZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldnQpID0+IHtcclxuICAgICAgICAgICAgaWYgKChkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdmdWxsJykubGVuZ3RoID09PSAwKSAmJlxyXG4gICAgICAgICAgICAgICAgKGRvY3VtZW50LmJvZHkuZ2V0QXR0cmlidXRlKCdkYXRhLXZpZXcnKSA9PT0gJzAnKSkge1xyXG4gICAgICAgICAgICAgICAgZS5jbGFzc0xpc3QucmVtb3ZlKCdhbmltJylcclxuICAgICAgICAgICAgICAgIGUuY2xhc3NMaXN0LmFkZCgnbW9kaWZ5JylcclxuICAgICAgICAgICAgICAgIGUuc3R5bGUudG9wID0gKGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wIC0gZG9jdW1lbnQuYm9keS5zY3JvbGxUb3BcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gY3NzTnVtYmVyKGUuc3R5bGUubWFyZ2luVG9wKSkgKyA0NCArICdweCdcclxuICAgICAgICAgICAgICAgIGUuc2V0QXR0cmlidXRlKCdkYXRhLXRvcCcsIGUuc3R5bGUudG9wKVxyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nXHJcbiAgICAgICAgICAgICAgICBjb25zdCBiYWNrID0gZWxlbUJ5SWQoJ2JhY2tncm91bmQnKVxyXG4gICAgICAgICAgICAgICAgYmFjay5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG4gICAgICAgICAgICAgICAgYmFjay5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xyXG4gICAgICAgICAgICAgICAgZS5jbGFzc0xpc3QuYWRkKCdhbmltJylcclxuICAgICAgICAgICAgICAgIGZvcmNlTGF5b3V0KGUpXHJcbiAgICAgICAgICAgICAgICBlLmNsYXNzTGlzdC5hZGQoJ2Z1bGwnKVxyXG4gICAgICAgICAgICAgICAgZS5zdHlsZS50b3AgPSAoNzUgLSBjc3NOdW1iZXIoZS5zdHlsZS5tYXJnaW5Ub3ApKSArICdweCdcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gZS5jbGFzc0xpc3QucmVtb3ZlKCdhbmltJyksIDM1MClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGVcclxufVxyXG5cclxuLy8gSW4gb3JkZXIgdG8gZGlzcGxheSBhbiBhc3NpZ25tZW50IGluIHRoZSBjb3JyZWN0IFggcG9zaXRpb24sIGNsYXNzZXMgd2l0aCBuYW1lcyBlWCBhbmQgZVggYXJlXHJcbi8vIHVzZWQsIHdoZXJlIFggaXMgdGhlIG51bWJlciBvZiBzcXVhcmVzIHRvIGZyb20gdGhlIGFzc2lnbm1lbnQgdG8gdGhlIGxlZnQvcmlnaHQgc2lkZSBvZiB0aGVcclxuLy8gc2NyZWVuLiBUaGUgZnVuY3Rpb24gYmVsb3cgZGV0ZXJtaW5lcyB3aGljaCBlWCBhbmQgc1ggY2xhc3MgdGhlIGdpdmVuIGVsZW1lbnQgaGFzLlxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0RVMoZWw6IEhUTUxFbGVtZW50KTogW3N0cmluZywgc3RyaW5nXSB7XHJcbiAgICBsZXQgZSA9IDBcclxuICAgIGxldCBzID0gMFxyXG5cclxuICAgIEFycmF5LmZyb20obmV3IEFycmF5KDcpLCAoXywgeCkgPT4geCkuZm9yRWFjaCgoeCkgPT4ge1xyXG4gICAgICAgIGlmIChlbC5jbGFzc0xpc3QuY29udGFpbnMoYGUke3h9YCkpIHtcclxuICAgICAgICAgICAgZSA9IHhcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGVsLmNsYXNzTGlzdC5jb250YWlucyhgcyR7eH1gKSkge1xyXG4gICAgICAgICAgICBzID0geFxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbiAgICByZXR1cm4gW2BlJHtlfWAsIGBzJHtzfWBdXHJcbn1cclxuXHJcbi8vIEJlbG93IGlzIGEgZnVuY3Rpb24gdG8gY2xvc2UgdGhlIGN1cnJlbnQgYXNzaWdubWVudCB0aGF0IGlzIG9wZW5lZC5cclxuZXhwb3J0IGZ1bmN0aW9uIGNsb3NlT3BlbmVkKGV2dDogRXZlbnQpOiB2b2lkIHtcclxuICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKVxyXG4gICAgY29uc3QgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZnVsbCcpIGFzIEhUTUxFbGVtZW50fG51bGxcclxuICAgIGlmIChlbCA9PSBudWxsKSByZXR1cm5cclxuXHJcbiAgICBlbC5zdHlsZS50b3AgPSBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdG9wJylcclxuICAgIGVsLmNsYXNzTGlzdC5hZGQoJ2FuaW0nKVxyXG4gICAgZWwuY2xhc3NMaXN0LnJlbW92ZSgnZnVsbCcpXHJcbiAgICBlbC5zY3JvbGxUb3AgPSAwXHJcbiAgICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2F1dG8nXHJcbiAgICBjb25zdCBiYWNrID0gZWxlbUJ5SWQoJ2JhY2tncm91bmQnKVxyXG4gICAgYmFjay5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgYmFjay5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXHJcbiAgICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZSgnYW5pbScpXHJcbiAgICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZSgnbW9kaWZ5JylcclxuICAgICAgICBlbC5zdHlsZS50b3AgPSAnYXV0bydcclxuICAgICAgICBmb3JjZUxheW91dChlbClcclxuICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKCdhbmltJylcclxuICAgIH0sIDEwMDApXHJcbn1cclxuIiwiaW1wb3J0IHsgZWxlbUJ5SWQsIGxvY2FsU3RvcmFnZVJlYWQgfSBmcm9tICcuLi91dGlsJ1xyXG5cclxuLy8gVGhlbiwgdGhlIHVzZXJuYW1lIGluIHRoZSBzaWRlYmFyIG5lZWRzIHRvIGJlIHNldCBhbmQgd2UgbmVlZCB0byBnZW5lcmF0ZSBhbiBcImF2YXRhclwiIGJhc2VkIG9uXHJcbi8vIGluaXRpYWxzLiBUbyBkbyB0aGF0LCBzb21lIGNvZGUgdG8gY29udmVydCBmcm9tIExBQiB0byBSR0IgY29sb3JzIGlzIGJvcnJvd2VkIGZyb21cclxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2Jvcm9uaW5lL2NvbG9yc3BhY2VzLmpzXHJcbi8vXHJcbi8vIExBQiBpcyBhIGNvbG9yIG5hbWluZyBzY2hlbWUgdGhhdCB1c2VzIHR3byB2YWx1ZXMgKEEgYW5kIEIpIGFsb25nIHdpdGggYSBsaWdodG5lc3MgdmFsdWUgaW4gb3JkZXJcclxuLy8gdG8gcHJvZHVjZSBjb2xvcnMgdGhhdCBhcmUgZXF1YWxseSBzcGFjZWQgYmV0d2VlbiBhbGwgb2YgdGhlIGNvbG9ycyB0aGF0IGNhbiBiZSBzZWVuIGJ5IHRoZSBodW1hblxyXG4vLyBleWUuIFRoaXMgd29ya3MgZ3JlYXQgYmVjYXVzZSBldmVyeW9uZSBoYXMgbGV0dGVycyBpbiBoaXMvaGVyIGluaXRpYWxzLlxyXG5cclxuLy8gVGhlIEQ2NSBzdGFuZGFyZCBpbGx1bWluYW50XHJcbmNvbnN0IFJFRl9YID0gMC45NTA0N1xyXG5jb25zdCBSRUZfWSA9IDEuMDAwMDBcclxuY29uc3QgUkVGX1ogPSAxLjA4ODgzXHJcblxyXG4vLyBDSUUgTCphKmIqIGNvbnN0YW50c1xyXG5jb25zdCBMQUJfRSA9IDAuMDA4ODU2XHJcbmNvbnN0IExBQl9LID0gOTAzLjNcclxuXHJcbmNvbnN0IE0gPSBbXHJcbiAgICBbMy4yNDA2LCAtMS41MzcyLCAtMC40OTg2XSxcclxuICAgIFstMC45Njg5LCAxLjg3NTgsICAwLjA0MTVdLFxyXG4gICAgWzAuMDU1NywgLTAuMjA0MCwgIDEuMDU3MF1cclxuXVxyXG5cclxuY29uc3QgZkludiA9ICh0OiBudW1iZXIpID0+IHtcclxuICAgIGlmIChNYXRoLnBvdyh0LCAzKSA+IExBQl9FKSB7XHJcbiAgICByZXR1cm4gTWF0aC5wb3codCwgMylcclxuICAgIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gKCgxMTYgKiB0KSAtIDE2KSAvIExBQl9LXHJcbiAgICB9XHJcbn1cclxuY29uc3QgZG90UHJvZHVjdCA9IChhOiBudW1iZXJbXSwgYjogbnVtYmVyW10pID0+IHtcclxuICAgIGxldCByZXQgPSAwXHJcbiAgICBhLmZvckVhY2goKF8sIGkpID0+IHtcclxuICAgICAgICByZXQgKz0gYVtpXSAqIGJbaV1cclxuICAgIH0pXHJcbiAgICByZXR1cm4gcmV0XHJcbn1cclxuY29uc3QgZnJvbUxpbmVhciA9IChjOiBudW1iZXIpID0+IHtcclxuICAgIGNvbnN0IGEgPSAwLjA1NVxyXG4gICAgaWYgKGMgPD0gMC4wMDMxMzA4KSB7XHJcbiAgICAgICAgcmV0dXJuIDEyLjkyICogY1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gKDEuMDU1ICogTWF0aC5wb3coYywgMSAvIDIuNCkpIC0gMC4wNTVcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gbGFicmdiKGw6IG51bWJlciwgYTogbnVtYmVyLCBiOiBudW1iZXIpOiBzdHJpbmcge1xyXG4gICAgY29uc3QgdmFyWSA9IChsICsgMTYpIC8gMTE2XHJcbiAgICBjb25zdCB2YXJaID0gdmFyWSAtIChiIC8gMjAwKVxyXG4gICAgY29uc3QgdmFyWCA9IChhIC8gNTAwKSArIHZhcllcclxuICAgIGNvbnN0IF9YID0gUkVGX1ggKiBmSW52KHZhclgpXHJcbiAgICBjb25zdCBfWSA9IFJFRl9ZICogZkludih2YXJZKVxyXG4gICAgY29uc3QgX1ogPSBSRUZfWiAqIGZJbnYodmFyWilcclxuXHJcbiAgICBjb25zdCB0dXBsZSA9IFtfWCwgX1ksIF9aXVxyXG5cclxuICAgIGNvbnN0IF9SID0gZnJvbUxpbmVhcihkb3RQcm9kdWN0KE1bMF0sIHR1cGxlKSlcclxuICAgIGNvbnN0IF9HID0gZnJvbUxpbmVhcihkb3RQcm9kdWN0KE1bMV0sIHR1cGxlKSlcclxuICAgIGNvbnN0IF9CID0gZnJvbUxpbmVhcihkb3RQcm9kdWN0KE1bMl0sIHR1cGxlKSlcclxuXHJcbiAgICAvLyBPcmlnaW5hbCBmcm9tIGhlcmVcclxuICAgIGNvbnN0IG4gPSAodjogbnVtYmVyKSA9PiBNYXRoLnJvdW5kKE1hdGgubWF4KE1hdGgubWluKHYgKiAyNTYsIDI1NSksIDApKVxyXG4gICAgcmV0dXJuIGByZ2IoJHtuKF9SKX0sICR7bihfRyl9LCAke24oX0IpfSlgXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDb252ZXJ0IGEgbGV0dGVyIHRvIGEgZmxvYXQgdmFsdWVkIGZyb20gMCB0byAyNTVcclxuICovXHJcbmZ1bmN0aW9uIGxldHRlclRvQ29sb3JWYWwobGV0dGVyOiBzdHJpbmcpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuICgoKGxldHRlci5jaGFyQ29kZUF0KDApIC0gNjUpIC8gMjYpICogMjU2KSAtIDEyOFxyXG59XHJcblxyXG4vLyBUaGUgZnVuY3Rpb24gYmVsb3cgdXNlcyB0aGlzIGFsZ29yaXRobSB0byBnZW5lcmF0ZSBhIGJhY2tncm91bmQgY29sb3IgZm9yIHRoZSBpbml0aWFscyBkaXNwbGF5ZWQgaW4gdGhlIHNpZGViYXIuXHJcbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVBdmF0YXIoKTogdm9pZCB7XHJcbiAgICBpZiAoIWxvY2FsU3RvcmFnZVJlYWQoJ3VzZXJuYW1lJykpIHJldHVyblxyXG4gICAgZWxlbUJ5SWQoJ3VzZXInKS5pbm5lckhUTUwgPSBsb2NhbFN0b3JhZ2VSZWFkKCd1c2VybmFtZScpXHJcbiAgICBjb25zdCBpbml0aWFscyA9IGxvY2FsU3RvcmFnZVJlYWQoJ3VzZXJuYW1lJykubWF0Y2goL1xcZCooLikuKj8oLiQpLykgLy8gU2VwYXJhdGUgeWVhciBmcm9tIGZpcnN0IG5hbWUgYW5kIGluaXRpYWxcclxuICAgIGlmIChpbml0aWFscyAhPSBudWxsKSB7XHJcbiAgICAgICAgY29uc3QgYmcgPSBsYWJyZ2IoNTAsIGxldHRlclRvQ29sb3JWYWwoaW5pdGlhbHNbMV0pLCBsZXR0ZXJUb0NvbG9yVmFsKGluaXRpYWxzWzJdKSkgLy8gQ29tcHV0ZSB0aGUgY29sb3JcclxuICAgICAgICBlbGVtQnlJZCgnaW5pdGlhbHMnKS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBiZ1xyXG4gICAgICAgIGVsZW1CeUlkKCdpbml0aWFscycpLmlubmVySFRNTCA9IGluaXRpYWxzWzFdICsgaW5pdGlhbHNbMl1cclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyB0b2RheSB9IGZyb20gJy4uL2RhdGVzJ1xyXG5pbXBvcnQgeyBlbGVtZW50IH0gZnJvbSAnLi4vdXRpbCdcclxuXHJcbmNvbnN0IE1PTlRIUyA9IFsnSmFuJywgJ0ZlYicsICdNYXInLCAnQXByJywgJ01heScsICdKdW4nLCAnSnVsJywgJ0F1ZycsICdTZXAnLCAnT2N0JywgJ05vdicsICdEZWMnXVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVdlZWsoaWQ6IHN0cmluZyk6IEhUTUxFbGVtZW50IHtcclxuICAgIGNvbnN0IHdrID0gZWxlbWVudCgnc2VjdGlvbicsICd3ZWVrJywgbnVsbCwgaWQpXHJcbiAgICBjb25zdCBkYXlUYWJsZSA9IGVsZW1lbnQoJ3RhYmxlJywgJ2RheVRhYmxlJykgYXMgSFRNTFRhYmxlRWxlbWVudFxyXG4gICAgY29uc3QgdHIgPSBkYXlUYWJsZS5pbnNlcnRSb3coKVxyXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lIG5vLWxvb3BzXHJcbiAgICBmb3IgKGxldCBkYXkgPSAwOyBkYXkgPCA3OyBkYXkrKykgdHIuaW5zZXJ0Q2VsbCgpXHJcbiAgICB3ay5hcHBlbmRDaGlsZChkYXlUYWJsZSlcclxuXHJcbiAgICByZXR1cm4gd2tcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZURheShkOiBEYXRlKTogSFRNTEVsZW1lbnQge1xyXG4gICAgY29uc3QgZGF5ID0gZWxlbWVudCgnZGl2JywgJ2RheScsIG51bGwsICdkYXknKVxyXG4gICAgZGF5LnNldEF0dHJpYnV0ZSgnZGF0YS1kYXRlJywgU3RyaW5nKGQuZ2V0VGltZSgpKSlcclxuICAgIGlmIChNYXRoLmZsb29yKChkLmdldFRpbWUoKSAtIGQuZ2V0VGltZXpvbmVPZmZzZXQoKSkgLyAxMDAwIC8gMzYwMCAvIDI0KSA9PT0gdG9kYXkoKSkge1xyXG4gICAgICBkYXkuY2xhc3NMaXN0LmFkZCgndG9kYXknKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG1vbnRoID0gZWxlbWVudCgnc3BhbicsICdtb250aCcsIE1PTlRIU1tkLmdldE1vbnRoKCldKVxyXG4gICAgZGF5LmFwcGVuZENoaWxkKG1vbnRoKVxyXG5cclxuICAgIGNvbnN0IGRhdGUgPSBlbGVtZW50KCdzcGFuJywgJ2RhdGUnLCBTdHJpbmcoZC5nZXREYXRlKCkpKVxyXG4gICAgZGF5LmFwcGVuZENoaWxkKGRhdGUpXHJcblxyXG4gICAgcmV0dXJuIGRheVxyXG59XHJcbiIsImltcG9ydCB7IGdldENsYXNzZXMsIGdldERhdGEgfSBmcm9tICcuLi9wY3InXHJcbmltcG9ydCB7IF8kLCBjYXBpdGFsaXplU3RyaW5nLCBlbGVtQnlJZCwgZWxlbWVudCB9IGZyb20gJy4uL3V0aWwnXHJcblxyXG4vLyBXaGVuIGFueXRoaW5nIGlzIHR5cGVkLCB0aGUgc2VhcmNoIHN1Z2dlc3Rpb25zIG5lZWQgdG8gYmUgdXBkYXRlZC5cclxuY29uc3QgVElQX05BTUVTID0ge1xyXG4gICAgZm9yOiBbJ2ZvciddLFxyXG4gICAgYnk6IFsnYnknLCAnZHVlJywgJ2VuZGluZyddLFxyXG4gICAgc3RhcnRpbmc6IFsnc3RhcnRpbmcnLCAnYmVnaW5uaW5nJywgJ2Fzc2lnbmVkJ11cclxufVxyXG5cclxuY29uc3QgbmV3VGV4dCA9IGVsZW1CeUlkKCduZXdUZXh0JykgYXMgSFRNTElucHV0RWxlbWVudFxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZU5ld1RpcHModmFsOiBzdHJpbmcsIHNjcm9sbDogYm9vbGVhbiA9IHRydWUpOiB2b2lkIHtcclxuICAgIGlmIChzY3JvbGwpIHtcclxuICAgICAgICBlbGVtQnlJZCgnbmV3VGlwcycpLnNjcm9sbFRvcCA9IDBcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBzcGFjZUluZGV4ID0gdmFsLmxhc3RJbmRleE9mKCcgJylcclxuICAgIGlmIChzcGFjZUluZGV4ICE9PSAtMSkge1xyXG4gICAgICAgIGNvbnN0IGJlZm9yZVNwYWNlID0gdmFsLmxhc3RJbmRleE9mKCcgJywgc3BhY2VJbmRleCAtIDEpXHJcbiAgICAgICAgY29uc3QgYmVmb3JlID0gdmFsLnN1YnN0cmluZygoYmVmb3JlU3BhY2UgPT09IC0xID8gMCA6IGJlZm9yZVNwYWNlICsgMSksIHNwYWNlSW5kZXgpXHJcbiAgICAgICAgT2JqZWN0LmVudHJpZXMoVElQX05BTUVTKS5mb3JFYWNoKChbbmFtZSwgcG9zc2libGVdKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChwb3NzaWJsZS5pbmRleE9mKGJlZm9yZSkgIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobmFtZSA9PT0gJ2ZvcicpIHtcclxuICAgICAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhUSVBfTkFNRVMpLmZvckVhY2goKHRpcE5hbWUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbUJ5SWQoYHRpcCR7dGlwTmFtZX1gKS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgZ2V0Q2xhc3NlcygpLmZvckVhY2goKGNscykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpZCA9IGB0aXBjbGFzcyR7Y2xzLnJlcGxhY2UoL1xcVy8sICcnKX1gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzcGFjZUluZGV4ID09PSAodmFsLmxlbmd0aCAtIDEpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY29udGFpbmVyID0gZWxlbWVudCgnZGl2JywgWydjbGFzc1RpcCcsICdhY3RpdmUnLCAndGlwJ10sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGA8aSBjbGFzcz0nbWF0ZXJpYWwtaWNvbnMnPmNsYXNzPC9pPjxzcGFuIGNsYXNzPSd0eXBlZCc+JHtjbHN9PC9zcGFuPmAsIGlkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRpcENvbXBsZXRlKGNscykpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbUJ5SWQoJ25ld1RpcHMnKS5hcHBlbmRDaGlsZChjb250YWluZXIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtQnlJZChpZCkuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbHMudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyh2YWwudG9Mb3dlckNhc2UoKS5zdWJzdHIoc3BhY2VJbmRleCArIDEpKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jbGFzc1RpcCcpLmZvckVhY2goKGVsKSA9PiB7XHJcbiAgICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcclxuICAgIH0pXHJcbiAgICBpZiAoKHZhbCA9PT0gJycpIHx8ICh2YWwuY2hhckF0KHZhbC5sZW5ndGggLSAxKSA9PT0gJyAnKSkge1xyXG4gICAgICAgIHVwZGF0ZVRpcCgnZm9yJywgJ2ZvcicsIGZhbHNlKVxyXG4gICAgICAgIHVwZGF0ZVRpcCgnYnknLCAnYnknLCBmYWxzZSlcclxuICAgICAgICB1cGRhdGVUaXAoJ3N0YXJ0aW5nJywgJ3N0YXJ0aW5nJywgZmFsc2UpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IGxhc3RTcGFjZSA9IHZhbC5sYXN0SW5kZXhPZignICcpXHJcbiAgICAgICAgbGV0IGxhc3RXb3JkID0gbGFzdFNwYWNlID09PSAtMSA/IHZhbCA6IHZhbC5zdWJzdHIobGFzdFNwYWNlICsgMSlcclxuICAgICAgICBjb25zdCB1cHBlcmNhc2UgPSBsYXN0V29yZC5jaGFyQXQoMCkgPT09IGxhc3RXb3JkLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpXHJcbiAgICAgICAgbGFzdFdvcmQgPSBsYXN0V29yZC50b0xvd2VyQ2FzZSgpXHJcbiAgICAgICAgT2JqZWN0LmVudHJpZXMoVElQX05BTUVTKS5mb3JFYWNoKChbbmFtZSwgcG9zc2libGVdKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBmb3VuZDogc3RyaW5nfG51bGwgPSBudWxsXHJcbiAgICAgICAgICAgIHBvc3NpYmxlLmZvckVhY2goKHApID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChwLnNsaWNlKDAsIGxhc3RXb3JkLmxlbmd0aCkgPT09IGxhc3RXb3JkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm91bmQgPSBwXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIGlmIChmb3VuZCkge1xyXG4gICAgICAgICAgICAgICAgdXBkYXRlVGlwKG5hbWUsIGZvdW5kLCB1cHBlcmNhc2UpXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBlbGVtQnlJZChgdGlwJHtuYW1lfWApLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVUaXAobmFtZTogc3RyaW5nLCB0eXBlZDogc3RyaW5nLCBjYXBpdGFsaXplOiBib29sZWFuKTogdm9pZCB7XHJcbiAgICBpZiAobmFtZSAhPT0gJ2ZvcicgJiYgbmFtZSAhPT0gJ2J5JyAmJiBuYW1lICE9PSAnc3RhcnRpbmcnKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHRpcCBuYW1lJylcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBlbCA9IGVsZW1CeUlkKGB0aXAke25hbWV9YClcclxuICAgIGVsLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcbiAgICBfJChlbC5xdWVyeVNlbGVjdG9yKCcudHlwZWQnKSkuaW5uZXJIVE1MID0gKGNhcGl0YWxpemUgPyBjYXBpdGFsaXplU3RyaW5nKHR5cGVkKSA6IHR5cGVkKSArICcuLi4nXHJcbiAgICBjb25zdCBuZXdOYW1lczogc3RyaW5nW10gPSBbXVxyXG4gICAgVElQX05BTUVTW25hbWVdLmZvckVhY2goKG4pID0+IHtcclxuICAgICAgICBpZiAobiAhPT0gdHlwZWQpIHsgbmV3TmFtZXMucHVzaChgPGI+JHtufTwvYj5gKSB9XHJcbiAgICB9KVxyXG4gICAgXyQoZWwucXVlcnlTZWxlY3RvcignLm90aGVycycpKS5pbm5lckhUTUwgPSBuZXdOYW1lcy5sZW5ndGggPiAwID8gYFlvdSBjYW4gYWxzbyB1c2UgJHtuZXdOYW1lcy5qb2luKCcgb3IgJyl9YCA6ICcnXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHRpcENvbXBsZXRlKGF1dG9jb21wbGV0ZTogc3RyaW5nKTogKGV2dDogRXZlbnQpID0+IHZvaWQge1xyXG4gICAgcmV0dXJuIChldnQ6IEV2ZW50KSA9PiB7XHJcbiAgICAgICAgY29uc3QgdmFsID0gbmV3VGV4dC52YWx1ZVxyXG4gICAgICAgIGNvbnN0IGxhc3RTcGFjZSA9IHZhbC5sYXN0SW5kZXhPZignICcpXHJcbiAgICAgICAgY29uc3QgbGFzdFdvcmQgPSBsYXN0U3BhY2UgPT09IC0xID8gMCA6IGxhc3RTcGFjZSArIDFcclxuICAgICAgICB1cGRhdGVOZXdUaXBzKG5ld1RleHQudmFsdWUgPSB2YWwuc3Vic3RyaW5nKDAsIGxhc3RXb3JkKSArIGF1dG9jb21wbGV0ZSArICcgJylcclxuICAgICAgICByZXR1cm4gbmV3VGV4dC5mb2N1cygpXHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIFRoZSBldmVudCBsaXN0ZW5lciBpcyB0aGVuIGFkZGVkIHRvIHRoZSBwcmVleGlzdGluZyB0aXBzLlxyXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGlwJykuZm9yRWFjaCgodGlwKSA9PiB7XHJcbiAgICB0aXAuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aXBDb21wbGV0ZShfJCh0aXAucXVlcnlTZWxlY3RvcignLnR5cGVkJykpLmlubmVySFRNTCkpXHJcbn0pXHJcbiIsImltcG9ydCB7IFZFUlNJT04gfSBmcm9tICcuLi9hcHAnXHJcbmltcG9ydCB7IGVsZW1CeUlkIH0gZnJvbSAnLi4vdXRpbCdcclxuXHJcbmNvbnN0IEVSUk9SX0ZPUk1fVVJMID0gJ2h0dHBzOi8vZG9jcy5nb29nbGUuY29tL2Evc3R1ZGVudHMuaGFya2VyLm9yZy9mb3Jtcy9kLydcclxuICAgICAgICAgICAgICAgICAgICAgKyAnMXNhMmdVdFlGUGRLVDVZRU5YSUVZYXV5UlB1Y3FzUUNWYVFBUGVGM2JaNFEvdmlld2Zvcm0nXHJcbmNvbnN0IEVSUk9SX0ZPUk1fRU5UUlkgPSAnP2VudHJ5LjEyMDAzNjIyMz0nXHJcbmNvbnN0IEVSUk9SX0dJVEhVQl9VUkwgPSAnaHR0cHM6Ly9naXRodWIuY29tLzE5UnlhbkEvQ2hlY2tQQ1IvaXNzdWVzL25ldydcclxuXHJcbmNvbnN0IGxpbmtCeUlkID0gKGlkOiBzdHJpbmcpID0+IGVsZW1CeUlkKGlkKSBhcyBIVE1MTGlua0VsZW1lbnRcclxuXHJcbi8vICpkaXNwbGF5RXJyb3IqIGRpc3BsYXlzIGEgZGlhbG9nIGNvbnRhaW5pbmcgaW5mb3JtYXRpb24gYWJvdXQgYW4gZXJyb3IuXHJcbmV4cG9ydCBmdW5jdGlvbiBkaXNwbGF5RXJyb3IoZTogRXJyb3IpOiB2b2lkIHtcclxuICAgIGNvbnNvbGUubG9nKCdEaXNwbGF5aW5nIGVycm9yJywgZSlcclxuICAgIGNvbnN0IGVycm9ySFRNTCA9IGBNZXNzYWdlOiAke2UubWVzc2FnZX1cXG5TdGFjazogJHtlLnN0YWNrIHx8IChlIGFzIGFueSkubGluZU51bWJlcn1cXG5gXHJcbiAgICAgICAgICAgICAgICAgICAgKyBgQnJvd3NlcjogJHtuYXZpZ2F0b3IudXNlckFnZW50fVxcblZlcnNpb246ICR7VkVSU0lPTn1gXHJcbiAgICBlbGVtQnlJZCgnZXJyb3JDb250ZW50JykuaW5uZXJIVE1MID0gZXJyb3JIVE1MLnJlcGxhY2UoJ1xcbicsICc8YnI+JylcclxuICAgIGxpbmtCeUlkKCdlcnJvckdvb2dsZScpLmhyZWYgPSBFUlJPUl9GT1JNX1VSTCArIEVSUk9SX0ZPUk1fRU5UUlkgKyBlbmNvZGVVUklDb21wb25lbnQoZXJyb3JIVE1MKVxyXG4gICAgbGlua0J5SWQoJ2Vycm9yR2l0SHViJykuaHJlZiA9XHJcbiAgICAgICAgRVJST1JfR0lUSFVCX1VSTCArICc/Ym9keT0nICsgZW5jb2RlVVJJQ29tcG9uZW50KGBJJ3ZlIGVuY291bnRlcmVkIGFuIGJ1Zy5cXG5cXG5cXGBcXGBcXGBcXG4ke2Vycm9ySFRNTH1cXG5cXGBcXGBcXGBgKVxyXG4gICAgZWxlbUJ5SWQoJ2Vycm9yQmFja2dyb3VuZCcpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXHJcbiAgICByZXR1cm4gZWxlbUJ5SWQoJ2Vycm9yJykuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxufVxyXG4iLCJpbXBvcnQgeyBfJCB9IGZyb20gJy4uL3V0aWwnXHJcblxyXG4vLyBGb3IgbGlzdCB2aWV3LCB0aGUgYXNzaWdubWVudHMgY2FuJ3QgYmUgb24gdG9wIG9mIGVhY2ggb3RoZXIuXHJcbi8vIFRoZXJlZm9yZSwgYSBsaXN0ZW5lciBpcyBhdHRhY2hlZCB0byB0aGUgcmVzaXppbmcgb2YgdGhlIGJyb3dzZXIgd2luZG93LlxyXG5sZXQgdGlja2luZyA9IGZhbHNlXHJcbmxldCB0aW1lb3V0SWQ6IG51bWJlcnxudWxsID0gbnVsbFxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0UmVzaXplQXNzaWdubWVudHMoKTogSFRNTEVsZW1lbnRbXSB7XHJcbiAgICBjb25zdCBhc3NpZ25tZW50cyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5jb250YWlucygnc2hvd0RvbmUnKSA/XHJcbiAgICAgICAgJy5hc3NpZ25tZW50Lmxpc3REaXNwJyA6ICcuYXNzaWdubWVudC5saXN0RGlzcDpub3QoLmRvbmUpJykpXHJcbiAgICBhc3NpZ25tZW50cy5zb3J0KChhLCBiKSA9PiB7XHJcbiAgICAgICAgY29uc3QgYWQgPSBhLmNsYXNzTGlzdC5jb250YWlucygnZG9uZScpXHJcbiAgICAgICAgY29uc3QgYmQgPSBiLmNsYXNzTGlzdC5jb250YWlucygnZG9uZScpXHJcbiAgICAgICAgaWYgKGFkICYmICFiZCkgeyByZXR1cm4gMSB9XHJcbiAgICAgICAgaWYgKGJkICYmICFhZCkgeyByZXR1cm4gLTEgfVxyXG4gICAgICAgIHJldHVybiBOdW1iZXIoKGEucXVlcnlTZWxlY3RvcignLmR1ZScpIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlKVxyXG4gICAgICAgICAgICAgLSBOdW1iZXIoKGIucXVlcnlTZWxlY3RvcignLmR1ZScpIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlKVxyXG4gICAgfSlcclxuICAgIHJldHVybiBhc3NpZ25tZW50cyBhcyBIVE1MRWxlbWVudFtdXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZXNpemVDYWxsZXIoKTogdm9pZCB7XHJcbiAgICBpZiAoIXRpY2tpbmcpIHtcclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVzaXplKVxyXG4gICAgICAgIHRpY2tpbmcgPSB0cnVlXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZXNpemUoKTogdm9pZCB7XHJcbiAgICB0aWNraW5nID0gdHJ1ZVxyXG4gICAgLy8gVG8gY2FsY3VsYXRlIHRoZSBudW1iZXIgb2YgY29sdW1ucywgdGhlIGJlbG93IGFsZ29yaXRobSBpcyB1c2VkIGJlY2FzZSBhcyB0aGUgc2NyZWVuIHNpemVcclxuICAgIC8vIGluY3JlYXNlcywgdGhlIGNvbHVtbiB3aWR0aCBpbmNyZWFzZXNcclxuICAgIGNvbnN0IHdpZHRocyA9IGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKCdzaG93SW5mbycpID9cclxuICAgICAgICBbNjUwLCAxMTAwLCAxODAwLCAyNzAwLCAzODAwLCA1MTAwXSA6IFszNTAsIDgwMCwgMTUwMCwgMjQwMCwgMzUwMCwgNDgwMF1cclxuICAgIGxldCBjb2x1bW5zID0gMVxyXG4gICAgd2lkdGhzLmZvckVhY2goKHcsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgaWYgKHdpbmRvdy5pbm5lcldpZHRoID4gdykgeyBjb2x1bW5zID0gaW5kZXggKyAxIH1cclxuICAgIH0pXHJcbiAgICBjb25zdCBjb2x1bW5IZWlnaHRzID0gQXJyYXkuZnJvbShuZXcgQXJyYXkoY29sdW1ucyksICgpID0+IDApXHJcbiAgICBjb25zdCBjY2g6IG51bWJlcltdID0gW11cclxuICAgIGNvbnN0IGFzc2lnbm1lbnRzID0gZ2V0UmVzaXplQXNzaWdubWVudHMoKVxyXG4gICAgYXNzaWdubWVudHMuZm9yRWFjaCgoYXNzaWdubWVudCwgbikgPT4ge1xyXG4gICAgICAgIGNvbnN0IGNvbCA9IG4gJSBjb2x1bW5zXHJcbiAgICAgICAgY2NoLnB1c2goY29sdW1uSGVpZ2h0c1tjb2xdKVxyXG4gICAgICAgIGNvbHVtbkhlaWdodHNbY29sXSArPSBhc3NpZ25tZW50Lm9mZnNldEhlaWdodCArIDI0XHJcbiAgICB9KVxyXG4gICAgYXNzaWdubWVudHMuZm9yRWFjaCgoYXNzaWdubWVudCwgbikgPT4ge1xyXG4gICAgICAgIGNvbnN0IGNvbCA9IG4gJSBjb2x1bW5zXHJcbiAgICAgICAgYXNzaWdubWVudC5zdHlsZS50b3AgPSBjY2hbbl0gKyAncHgnXHJcbiAgICAgICAgYXNzaWdubWVudC5zdHlsZS5sZWZ0ID0gKCgxMDAgLyBjb2x1bW5zKSAqIGNvbCkgKyAnJSdcclxuICAgICAgICBhc3NpZ25tZW50LnN0eWxlLnJpZ2h0ID0gKCgxMDAgLyBjb2x1bW5zKSAqIChjb2x1bW5zIC0gY29sIC0gMSkpICsgJyUnXHJcbiAgICB9KVxyXG4gICAgaWYgKHRpbWVvdXRJZCkgY2xlYXJUaW1lb3V0KHRpbWVvdXRJZClcclxuICAgIHRpbWVvdXRJZCA9IHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIGNjaC5sZW5ndGggPSAwXHJcbiAgICAgICAgYXNzaWdubWVudHMuZm9yRWFjaCgoYXNzaWdubWVudCwgbikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBjb2wgPSBuICUgY29sdW1uc1xyXG4gICAgICAgICAgICBpZiAobiA8IGNvbHVtbnMpIHtcclxuICAgICAgICAgICAgICAgIGNvbHVtbkhlaWdodHNbY29sXSA9IDBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjY2gucHVzaChjb2x1bW5IZWlnaHRzW2NvbF0pXHJcbiAgICAgICAgICAgIGNvbHVtbkhlaWdodHNbY29sXSArPSBhc3NpZ25tZW50Lm9mZnNldEhlaWdodCArIDI0XHJcbiAgICAgICAgfSlcclxuICAgICAgICBhc3NpZ25tZW50cy5mb3JFYWNoKChhc3NpZ25tZW50LCBuKSA9PiB7XHJcbiAgICAgICAgICAgIGFzc2lnbm1lbnQuc3R5bGUudG9wID0gY2NoW25dICsgJ3B4J1xyXG4gICAgICAgIH0pXHJcbiAgICB9LCA1MDApXHJcbiAgICB0aWNraW5nID0gZmFsc2VcclxufVxyXG4iLCIvKipcclxuICogQWxsIHRoaXMgaXMgcmVzcG9uc2libGUgZm9yIGlzIGNyZWF0aW5nIHNuYWNrYmFycy5cclxuICovXHJcblxyXG5pbXBvcnQgeyBlbGVtZW50LCBmb3JjZUxheW91dCB9IGZyb20gJy4uL3V0aWwnXHJcblxyXG4vKipcclxuICogQ3JlYXRlcyBhIHNuYWNrYmFyIHdpdGhvdXQgYW4gYWN0aW9uXHJcbiAqIEBwYXJhbSBtZXNzYWdlIFRoZSBzbmFja2JhcidzIG1lc3NhZ2VcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBzbmFja2JhcihtZXNzYWdlOiBzdHJpbmcpOiB2b2lkXHJcbi8qKlxyXG4gKiBDcmVhdGVzIGEgc25hY2tiYXIgd2l0aCBhbiBhY3Rpb25cclxuICogQHBhcmFtIG1lc3NhZ2UgVGhlIHNuYWNrYmFyJ3MgbWVzc2FnZVxyXG4gKiBAcGFyYW0gYWN0aW9uIE9wdGlvbmFsIHRleHQgdG8gc2hvdyBhcyBhIG1lc3NhZ2UgYWN0aW9uXHJcbiAqIEBwYXJhbSBmICAgICAgQSBmdW5jdGlvbiB0byBleGVjdXRlIHdoZW4gdGhlIGFjdGlvbiBpcyBjbGlja2VkXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gc25hY2tiYXIobWVzc2FnZTogc3RyaW5nLCBhY3Rpb246IHN0cmluZywgZjogKCkgPT4gdm9pZCk6IHZvaWRcclxuZXhwb3J0IGZ1bmN0aW9uIHNuYWNrYmFyKG1lc3NhZ2U6IHN0cmluZywgYWN0aW9uPzogc3RyaW5nLCBmPzogKCkgPT4gdm9pZCk6IHZvaWQge1xyXG4gICAgY29uc3Qgc25hY2sgPSBlbGVtZW50KCdkaXYnLCAnc25hY2tiYXInKVxyXG4gICAgY29uc3Qgc25hY2tJbm5lciA9IGVsZW1lbnQoJ2RpdicsICdzbmFja0lubmVyJywgbWVzc2FnZSlcclxuICAgIHNuYWNrLmFwcGVuZENoaWxkKHNuYWNrSW5uZXIpXHJcblxyXG4gICAgaWYgKChhY3Rpb24gIT0gbnVsbCkgJiYgKGYgIT0gbnVsbCkpIHtcclxuICAgICAgICBjb25zdCBhY3Rpb25FID0gZWxlbWVudCgnYScsIFtdLCBhY3Rpb24pXHJcbiAgICAgICAgYWN0aW9uRS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgc25hY2suY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcclxuICAgICAgICAgICAgZigpXHJcbiAgICAgICAgfSlcclxuICAgICAgICBzbmFja0lubmVyLmFwcGVuZENoaWxkKGFjdGlvbkUpXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgYWRkID0gKCkgPT4ge1xyXG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNuYWNrKVxyXG4gICAgICBmb3JjZUxheW91dChzbmFjaylcclxuICAgICAgc25hY2suY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICBzbmFjay5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gICAgICAgICAgc2V0VGltZW91dCgoKSA9PiBzbmFjay5yZW1vdmUoKSwgOTAwKVxyXG4gICAgICB9LCA1MDAwKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGV4aXN0aW5nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNuYWNrYmFyJylcclxuICAgIGlmIChleGlzdGluZyAhPSBudWxsKSB7XHJcbiAgICAgICAgZXhpc3RpbmcuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcclxuICAgICAgICBzZXRUaW1lb3V0KGFkZCwgMzAwKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBhZGQoKVxyXG4gICAgfVxyXG59XHJcbiIsIlxyXG4vKipcclxuICogQ29va2llIGZ1bmN0aW9ucyAoYSBjb29raWUgaXMgYSBzbWFsbCB0ZXh0IGRvY3VtZW50IHRoYXQgdGhlIGJyb3dzZXIgY2FuIHJlbWVtYmVyKVxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBSZXRyaWV2ZXMgYSBjb29raWVcclxuICogQHBhcmFtIGNuYW1lIHRoZSBuYW1lIG9mIHRoZSBjb29raWUgdG8gcmV0cmlldmVcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRDb29raWUoY25hbWU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICBjb25zdCBuYW1lID0gY25hbWUgKyAnPSdcclxuICAgIGNvbnN0IGNvb2tpZVBhcnQgPSBkb2N1bWVudC5jb29raWUuc3BsaXQoJzsnKS5maW5kKChjKSA9PiBjLmluY2x1ZGVzKG5hbWUpKVxyXG4gICAgaWYgKGNvb2tpZVBhcnQpIHJldHVybiBjb29raWVQYXJ0LnN1YnN0cmluZyhuYW1lLmxlbmd0aClcclxuICAgIHJldHVybiAnJyAvLyBCbGFuayBpZiBjb29raWUgbm90IGZvdW5kXHJcbiAgfVxyXG5cclxuLyoqIFNldHMgdGhlIHZhbHVlIG9mIGEgY29va2llXHJcbiAqIEBwYXJhbSBjbmFtZSB0aGUgbmFtZSBvZiB0aGUgY29va2llIHRvIHNldFxyXG4gKiBAcGFyYW0gY3ZhbHVlIHRoZSB2YWx1ZSB0byBzZXQgdGhlIGNvb2tpZSB0b1xyXG4gKiBAcGFyYW0gZXhkYXlzIHRoZSBudW1iZXIgb2YgZGF5cyB0aGF0IHRoZSBjb29raWUgd2lsbCBleHBpcmUgaW4gKGFuZCBub3QgYmUgZXhpc3RlbnQgYW55bW9yZSlcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRDb29raWUoY25hbWU6IHN0cmluZywgY3ZhbHVlOiBzdHJpbmcsIGV4ZGF5czogbnVtYmVyKTogdm9pZCB7XHJcbiAgICBjb25zdCBkID0gbmV3IERhdGUoKVxyXG4gICAgZC5zZXRUaW1lKGQuZ2V0VGltZSgpICsgKGV4ZGF5cyAqIDI0ICogNjAgKiA2MCAqIDEwMDApKVxyXG4gICAgY29uc3QgZXhwaXJlcyA9IGBleHBpcmVzPSR7ZC50b1VUQ1N0cmluZygpfWBcclxuICAgIGRvY3VtZW50LmNvb2tpZSA9IGNuYW1lICsgJz0nICsgY3ZhbHVlICsgJzsgJyArIGV4cGlyZXNcclxuICB9XHJcblxyXG4vKipcclxuICogRGVsZXRzIGEgY29va2llXHJcbiAqIEBwYXJhbSBjbmFtZSB0aGUgbmFtZSBvZiB0aGUgY29va2llIHRvIGRlbGV0ZVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGRlbGV0ZUNvb2tpZShjbmFtZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAvLyBUaGlzIGlzIGxpa2UgKnNldENvb2tpZSosIGJ1dCBzZXRzIHRoZSBleHBpcnkgZGF0ZSB0byBzb21ldGhpbmcgaW4gdGhlIHBhc3Qgc28gdGhlIGNvb2tpZSBpcyBkZWxldGVkLlxyXG4gICAgZG9jdW1lbnQuY29va2llID0gY25hbWUgKyAnPTsgZXhwaXJlcz1UaHUsIDAxIEphbiAxOTcwIDAwOjAwOjAxIEdNVDsnXHJcbn1cclxuIiwiZXhwb3J0IGZ1bmN0aW9uIHR6b2ZmKCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gKG5ldyBEYXRlKCkpLmdldFRpbWV6b25lT2Zmc2V0KCkgKiAxMDAwICogNjAgLy8gRm9yIGZ1dHVyZSBjYWxjdWxhdGlvbnNcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHRvRGF0ZU51bShkYXRlOiBEYXRlfG51bWJlcik6IG51bWJlciB7XHJcbiAgICBjb25zdCBudW0gPSBkYXRlIGluc3RhbmNlb2YgRGF0ZSA/IGRhdGUuZ2V0VGltZSgpIDogZGF0ZVxyXG4gICAgcmV0dXJuIE1hdGguZmxvb3IoKG51bSAtIHR6b2ZmKCkpIC8gMTAwMCAvIDM2MDAgLyAyNClcclxufVxyXG5cclxuLy8gKkZyb21EYXRlTnVtKiBjb252ZXJ0cyBhIG51bWJlciBvZiBkYXlzIHRvIGEgbnVtYmVyIG9mIHNlY29uZHNcclxuZXhwb3J0IGZ1bmN0aW9uIGZyb21EYXRlTnVtKGRheXM6IG51bWJlcik6IERhdGUge1xyXG4gICAgY29uc3QgZCA9IG5ldyBEYXRlKChkYXlzICogMTAwMCAqIDM2MDAgKiAyNCkgKyB0em9mZigpKVxyXG4gICAgLy8gVGhlIGNoZWNrcyBiZWxvdyBhcmUgdG8gaGFuZGxlIGRheWxpZ2h0IHNhdmluZ3MgdGltZVxyXG4gICAgaWYgKGQuZ2V0SG91cnMoKSA9PT0gMSkgeyBkLnNldEhvdXJzKDApIH1cclxuICAgIGlmICgoZC5nZXRIb3VycygpID09PSAyMikgfHwgKGQuZ2V0SG91cnMoKSA9PT0gMjMpKSB7XHJcbiAgICAgIGQuc2V0SG91cnMoMjQpXHJcbiAgICAgIGQuc2V0TWludXRlcygwKVxyXG4gICAgICBkLnNldFNlY29uZHMoMClcclxuICAgIH1cclxuICAgIHJldHVybiBkXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB0b2RheSgpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIHRvRGF0ZU51bShuZXcgRGF0ZSgpKVxyXG59XHJcblxyXG4vKipcclxuICogSXRlcmF0ZXMgZnJvbSB0aGUgc3RhcnRpbmcgZGF0ZSB0byBlbmRpbmcgZGF0ZSBpbmNsdXNpdmVcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBpdGVyRGF5cyhzdGFydDogRGF0ZSwgZW5kOiBEYXRlLCBjYjogKGRhdGU6IERhdGUpID0+IHZvaWQpOiB2b2lkIHtcclxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZSBuby1sb29wc1xyXG4gICAgZm9yIChjb25zdCBkID0gbmV3IERhdGUoc3RhcnQpOyBkIDw9IGVuZDsgZC5zZXREYXRlKGQuZ2V0RGF0ZSgpICsgMSkpIHtcclxuICAgICAgICBjYihkKVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IGNvbXB1dGVXZWVrSWQsIGNyZWF0ZUFzc2lnbm1lbnQsIGdldEVTLCBzZXBhcmF0ZWRDbGFzcyB9IGZyb20gJy4vY29tcG9uZW50cy9hc3NpZ25tZW50J1xyXG5pbXBvcnQgeyBjcmVhdGVEYXksIGNyZWF0ZVdlZWsgfSBmcm9tICcuL2NvbXBvbmVudHMvY2FsZW5kYXInXHJcbmltcG9ydCB7IGRpc3BsYXlFcnJvciB9IGZyb20gJy4vY29tcG9uZW50cy9lcnJvckRpc3BsYXknXHJcbmltcG9ydCB7IHJlc2l6ZSB9IGZyb20gJy4vY29tcG9uZW50cy9yZXNpemVyJ1xyXG5pbXBvcnQgeyBmcm9tRGF0ZU51bSwgaXRlckRheXMsIHRvZGF5IH0gZnJvbSAnLi9kYXRlcydcclxuaW1wb3J0IHsgY2xhc3NCeUlkLCBnZXREYXRhLCBJQXBwbGljYXRpb25EYXRhLCBJQXNzaWdubWVudCB9IGZyb20gJy4vcGNyJ1xyXG5pbXBvcnQgeyBhZGRBY3Rpdml0eSwgc2F2ZUFjdGl2aXR5IH0gZnJvbSAnLi9wbHVnaW5zL2FjdGl2aXR5J1xyXG5pbXBvcnQgeyBleHRyYVRvVGFzaywgZ2V0RXh0cmEsIElDdXN0b21Bc3NpZ25tZW50IH0gZnJvbSAnLi9wbHVnaW5zL2N1c3RvbUFzc2lnbm1lbnRzJ1xyXG5pbXBvcnQgeyBhc3NpZ25tZW50SW5Eb25lLCByZW1vdmVGcm9tRG9uZSwgc2F2ZURvbmUgfSBmcm9tICcuL3BsdWdpbnMvZG9uZSdcclxuaW1wb3J0IHsgYXNzaWdubWVudEluTW9kaWZpZWQsIHJlbW92ZUZyb21Nb2RpZmllZCwgc2F2ZU1vZGlmaWVkIH0gZnJvbSAnLi9wbHVnaW5zL21vZGlmaWVkQXNzaWdubWVudHMnXHJcbmltcG9ydCB7IF8kLCBkYXRlU3RyaW5nLCBlbGVtQnlJZCwgZWxlbWVudCwgbG9jYWxTdG9yYWdlUmVhZCwgc21vb3RoU2Nyb2xsIH0gZnJvbSAnLi91dGlsJ1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJU3BsaXRBc3NpZ25tZW50IHtcclxuICAgIGFzc2lnbm1lbnQ6IElBc3NpZ25tZW50XHJcbiAgICBzdGFydDogRGF0ZVxyXG4gICAgZW5kOiBEYXRlfCdGb3JldmVyJ1xyXG4gICAgY3VzdG9tOiBib29sZWFuXHJcbiAgICByZWZlcmVuY2U/OiBJQ3VzdG9tQXNzaWdubWVudFxyXG59XHJcblxyXG5jb25zdCBTQ0hFRFVMRV9FTkRTID0ge1xyXG4gICAgZGF5OiAoZGF0ZTogRGF0ZSkgPT4gMjQgKiAzNjAwICogMTAwMCxcclxuICAgIG1zOiAoZGF0ZTogRGF0ZSkgPT4gWzI0LCAgICAgICAgICAgICAgLy8gU3VuZGF5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAxNSArICgzNSAvIDYwKSwgIC8vIE1vbmRheVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgMTUgKyAoMzUgLyA2MCksICAvLyBUdWVzZGF5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAxNSArICgxNSAvIDYwKSwgIC8vIFdlZG5lc2RheVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgMTUgKyAoMTUgLyA2MCksICAvLyBUaHVyc2RheVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgMTUgKyAoMTUgLyA2MCksICAvLyBGcmlkYXlcclxuICAgICAgICAgICAgICAgICAgICAgICAgIDI0ICAgICAgICAgICAgICAgLy8gU2F0dXJkYXlcclxuICAgICAgICAgICAgICAgICAgICAgICAgXVtkYXRlLmdldERheSgpXSxcclxuICAgIHVzOiAoZGF0ZTogRGF0ZSkgPT4gMTUgKiAzNjAwICogMTAwMFxyXG59XHJcbmNvbnN0IFdFRUtFTkRfQ0xBU1NOQU1FUyA9IFsnZnJvbVdlZWtlbmQnLCAnb3ZlcldlZWtlbmQnXVxyXG5cclxubGV0IHNjcm9sbCA9IDAgLy8gVGhlIGxvY2F0aW9uIHRvIHNjcm9sbCB0byBpbiBvcmRlciB0byByZWFjaCB0b2RheSBpbiBjYWxlbmRhciB2aWV3XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2Nyb2xsKCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gc2Nyb2xsXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRUaW1lQWZ0ZXIoZGF0ZTogRGF0ZSk6IG51bWJlciB7XHJcbiAgICBjb25zdCBoaWRlYXNzaWdubWVudHMgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnaGlkZUFzc2lnbm1lbnRzJylcclxuICAgIGlmIChoaWRlYXNzaWdubWVudHMgPT09ICdkYXknIHx8IGhpZGVhc3NpZ25tZW50cyA9PT0gJ21zJyB8fCBoaWRlYXNzaWdubWVudHMgPT09ICd1cycpIHtcclxuICAgICAgICByZXR1cm4gU0NIRURVTEVfRU5EU1toaWRlYXNzaWdubWVudHNdKGRhdGUpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBTQ0hFRFVMRV9FTkRTLmRheShkYXRlKVxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRTdGFydEVuZERhdGVzKGRhdGE6IElBcHBsaWNhdGlvbkRhdGEpOiB7c3RhcnQ6IERhdGUsIGVuZDogRGF0ZSB9IHtcclxuICAgIGlmIChkYXRhLm1vbnRoVmlldykge1xyXG4gICAgICAgIGNvbnN0IHN0YXJ0TiA9IE1hdGgubWluKC4uLmRhdGEuYXNzaWdubWVudHMubWFwKChhKSA9PiBhLnN0YXJ0KSkgLy8gU21hbGxlc3QgZGF0ZVxyXG4gICAgICAgIGNvbnN0IGVuZE4gPSBNYXRoLm1heCguLi5kYXRhLmFzc2lnbm1lbnRzLm1hcCgoYSkgPT4gYS5zdGFydCkpIC8vIExhcmdlc3QgZGF0ZVxyXG5cclxuICAgICAgICBjb25zdCB5ZWFyID0gKG5ldyBEYXRlKCkpLmdldEZ1bGxZZWFyKCkgLy8gRm9yIGZ1dHVyZSBjYWxjdWxhdGlvbnNcclxuXHJcbiAgICAgICAgLy8gQ2FsY3VsYXRlIHdoYXQgbW9udGggd2Ugd2lsbCBiZSBkaXNwbGF5aW5nIGJ5IGZpbmRpbmcgdGhlIG1vbnRoIG9mIHRvZGF5XHJcbiAgICAgICAgY29uc3QgbW9udGggPSAobmV3IERhdGUoKSkuZ2V0TW9udGgoKVxyXG5cclxuICAgICAgICAvLyBNYWtlIHN1cmUgdGhlIHN0YXJ0IGFuZCBlbmQgZGF0ZXMgbGllIHdpdGhpbiB0aGUgbW9udGhcclxuICAgICAgICBjb25zdCBzdGFydCA9IG5ldyBEYXRlKE1hdGgubWF4KGZyb21EYXRlTnVtKHN0YXJ0TikuZ2V0VGltZSgpLCAobmV3IERhdGUoeWVhciwgbW9udGgpKS5nZXRUaW1lKCkpKVxyXG4gICAgICAgIC8vIElmIHRoZSBkYXkgYXJndW1lbnQgZm9yIERhdGUgaXMgMCwgdGhlbiB0aGUgcmVzdWx0aW5nIGRhdGUgd2lsbCBiZSBvZiB0aGUgcHJldmlvdXMgbW9udGhcclxuICAgICAgICBjb25zdCBlbmQgPSBuZXcgRGF0ZShNYXRoLm1pbihmcm9tRGF0ZU51bShlbmROKS5nZXRUaW1lKCksIChuZXcgRGF0ZSh5ZWFyLCBtb250aCArIDEsIDApKS5nZXRUaW1lKCkpKVxyXG4gICAgICAgIHJldHVybiB7IHN0YXJ0LCBlbmQgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IHRvZGF5U0UgPSBuZXcgRGF0ZSgpXHJcbiAgICAgICAgY29uc3Qgc3RhcnQgPSBuZXcgRGF0ZSh0b2RheVNFLmdldEZ1bGxZZWFyKCksIHRvZGF5U0UuZ2V0TW9udGgoKSwgdG9kYXlTRS5nZXREYXRlKCkpXHJcbiAgICAgICAgY29uc3QgZW5kID0gbmV3IERhdGUodG9kYXlTRS5nZXRGdWxsWWVhcigpLCB0b2RheVNFLmdldE1vbnRoKCksIHRvZGF5U0UuZ2V0RGF0ZSgpKVxyXG4gICAgICAgIHJldHVybiB7IHN0YXJ0LCBlbmQgfVxyXG4gICAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEFzc2lnbm1lbnRTcGxpdHMoYXNzaWdubWVudDogSUFzc2lnbm1lbnQsIHN0YXJ0OiBEYXRlLCBlbmQ6IERhdGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVmZXJlbmNlPzogSUN1c3RvbUFzc2lnbm1lbnQpOiBJU3BsaXRBc3NpZ25tZW50W10ge1xyXG4gICAgY29uc3Qgc3BsaXQ6IElTcGxpdEFzc2lnbm1lbnRbXSA9IFtdXHJcbiAgICBpZiAobG9jYWxTdG9yYWdlUmVhZCgnYXNzaWdubWVudFNwYW4nKSA9PT0gJ211bHRpcGxlJykge1xyXG4gICAgICAgIGNvbnN0IHMgPSBNYXRoLm1heChzdGFydC5nZXRUaW1lKCksIGZyb21EYXRlTnVtKGFzc2lnbm1lbnQuc3RhcnQpLmdldFRpbWUoKSlcclxuICAgICAgICBjb25zdCBlID0gYXNzaWdubWVudC5lbmQgPT09ICdGb3JldmVyJyA/IHMgOiBNYXRoLm1pbihlbmQuZ2V0VGltZSgpLCBmcm9tRGF0ZU51bShhc3NpZ25tZW50LmVuZCkuZ2V0VGltZSgpKVxyXG4gICAgICAgIGNvbnN0IHNwYW4gPSAoKGUgLSBzKSAvIDEwMDAgLyAzNjAwIC8gMjQpICsgMSAvLyBOdW1iZXIgb2YgZGF5cyBhc3NpZ25tZW50IHRha2VzIHVwXHJcbiAgICAgICAgY29uc3Qgc3BhblJlbGF0aXZlID0gNiAtIChuZXcgRGF0ZShzKSkuZ2V0RGF5KCkgLy8gTnVtYmVyIG9mIGRheXMgdW50aWwgdGhlIG5leHQgU2F0dXJkYXlcclxuXHJcbiAgICAgICAgY29uc3QgbnMgPSBuZXcgRGF0ZShzKVxyXG4gICAgICAgIG5zLnNldERhdGUobnMuZ2V0RGF0ZSgpICsgc3BhblJlbGF0aXZlKSAvLyAgVGhlIGRhdGUgb2YgdGhlIG5leHQgU2F0dXJkYXlcclxuXHJcbiAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lIG5vLWxvb3BzXHJcbiAgICAgICAgZm9yIChsZXQgbiA9IC02OyBuIDwgc3BhbiAtIHNwYW5SZWxhdGl2ZTsgbiArPSA3KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGxhc3RTdW4gPSBuZXcgRGF0ZShucylcclxuICAgICAgICAgICAgbGFzdFN1bi5zZXREYXRlKGxhc3RTdW4uZ2V0RGF0ZSgpICsgbilcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG5leHRTYXQgPSBuZXcgRGF0ZShsYXN0U3VuKVxyXG4gICAgICAgICAgICBuZXh0U2F0LnNldERhdGUobmV4dFNhdC5nZXREYXRlKCkgKyA2KVxyXG4gICAgICAgICAgICBzcGxpdC5wdXNoKHtcclxuICAgICAgICAgICAgICAgIGFzc2lnbm1lbnQsXHJcbiAgICAgICAgICAgICAgICBzdGFydDogbmV3IERhdGUoTWF0aC5tYXgocywgbGFzdFN1bi5nZXRUaW1lKCkpKSxcclxuICAgICAgICAgICAgICAgIGVuZDogbmV3IERhdGUoTWF0aC5taW4oZSwgbmV4dFNhdC5nZXRUaW1lKCkpKSxcclxuICAgICAgICAgICAgICAgIGN1c3RvbTogQm9vbGVhbihyZWZlcmVuY2UpLFxyXG4gICAgICAgICAgICAgICAgcmVmZXJlbmNlXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChsb2NhbFN0b3JhZ2VSZWFkKCdhc3NpZ25tZW50U3BhbicpID09PSAnc3RhcnQnKSB7XHJcbiAgICAgICAgY29uc3QgcyA9IGZyb21EYXRlTnVtKGFzc2lnbm1lbnQuc3RhcnQpXHJcbiAgICAgICAgaWYgKHMuZ2V0VGltZSgpID49IHN0YXJ0LmdldFRpbWUoKSkge1xyXG4gICAgICAgICAgICBzcGxpdC5wdXNoKHtcclxuICAgICAgICAgICAgICAgIGFzc2lnbm1lbnQsXHJcbiAgICAgICAgICAgICAgICBzdGFydDogcyxcclxuICAgICAgICAgICAgICAgIGVuZDogcyxcclxuICAgICAgICAgICAgICAgIGN1c3RvbTogQm9vbGVhbihyZWZlcmVuY2UpLFxyXG4gICAgICAgICAgICAgICAgcmVmZXJlbmNlXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChsb2NhbFN0b3JhZ2VSZWFkKCdhc3NpZ25tZW50U3BhbicpID09PSAnZW5kJykge1xyXG4gICAgICAgIGNvbnN0IGUgPSBhc3NpZ25tZW50LmVuZCA9PT0gJ0ZvcmV2ZXInID8gYXNzaWdubWVudC5lbmQgOiBmcm9tRGF0ZU51bShhc3NpZ25tZW50LmVuZClcclxuICAgICAgICBjb25zdCBkZSA9IGUgPT09ICdGb3JldmVyJyA/IGZyb21EYXRlTnVtKGFzc2lnbm1lbnQuc3RhcnQpIDogZVxyXG4gICAgICAgIGlmIChkZS5nZXRUaW1lKCkgPD0gZW5kLmdldFRpbWUoKSkge1xyXG4gICAgICAgICAgICBzcGxpdC5wdXNoKHtcclxuICAgICAgICAgICAgICAgIGFzc2lnbm1lbnQsXHJcbiAgICAgICAgICAgICAgICBzdGFydDogZGUsXHJcbiAgICAgICAgICAgICAgICBlbmQ6IGUsXHJcbiAgICAgICAgICAgICAgICBjdXN0b206IEJvb2xlYW4ocmVmZXJlbmNlKSxcclxuICAgICAgICAgICAgICAgIHJlZmVyZW5jZVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gc3BsaXRcclxufVxyXG5cclxuLy8gVGhpcyBmdW5jdGlvbiB3aWxsIGNvbnZlcnQgdGhlIGFycmF5IG9mIGFzc2lnbm1lbnRzIGdlbmVyYXRlZCBieSAqcGFyc2UqIGludG8gcmVhZGFibGUgSFRNTC5cclxuZXhwb3J0IGZ1bmN0aW9uIGRpc3BsYXkoZG9TY3JvbGw6IGJvb2xlYW4gPSB0cnVlKTogdm9pZCB7XHJcbiAgICBjb25zb2xlLnRpbWUoJ0Rpc3BsYXlpbmcgZGF0YScpXHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IGRhdGEgPSBnZXREYXRhKClcclxuICAgICAgICBpZiAoIWRhdGEpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdEYXRhIHNob3VsZCBoYXZlIGJlZW4gZmV0Y2hlZCBiZWZvcmUgZGlzcGxheSgpIHdhcyBjYWxsZWQnKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5zZXRBdHRyaWJ1dGUoJ2RhdGEtcGNydmlldycsIGRhdGEubW9udGhWaWV3ID8gJ21vbnRoJyA6ICdvdGhlcicpXHJcbiAgICAgICAgY29uc3QgbWFpbiA9IF8kKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ21haW4nKSlcclxuICAgICAgICBjb25zdCB0YWtlbjogeyBbZGF0ZTogbnVtYmVyXTogbnVtYmVyW10gfSA9IHt9XHJcblxyXG4gICAgICAgIGNvbnN0IHRpbWVhZnRlciA9IGdldFRpbWVBZnRlcihuZXcgRGF0ZSgpKVxyXG5cclxuICAgICAgICBjb25zdCB7c3RhcnQsIGVuZH0gPSBnZXRTdGFydEVuZERhdGVzKGRhdGEpXHJcblxyXG4gICAgICAgIC8vIFNldCB0aGUgc3RhcnQgZGF0ZSB0byBiZSBhIFN1bmRheSBhbmQgdGhlIGVuZCBkYXRlIHRvIGJlIGEgU2F0dXJkYXlcclxuICAgICAgICBzdGFydC5zZXREYXRlKHN0YXJ0LmdldERhdGUoKSAtIHN0YXJ0LmdldERheSgpKVxyXG4gICAgICAgIGVuZC5zZXREYXRlKGVuZC5nZXREYXRlKCkgKyAoNiAtIGVuZC5nZXREYXkoKSkpXHJcblxyXG4gICAgICAgIC8vIEZpcnN0IHBvcHVsYXRlIHRoZSBjYWxlbmRhciB3aXRoIGJveGVzIGZvciBlYWNoIGRheVxyXG4gICAgICAgIGNvbnN0IGxhc3REYXRhID0gbG9jYWxTdG9yYWdlUmVhZCgnZGF0YScpIGFzIElBcHBsaWNhdGlvbkRhdGFcclxuICAgICAgICBsZXQgd2s6IEhUTUxFbGVtZW50fG51bGwgPSBudWxsXHJcbiAgICAgICAgaXRlckRheXMoc3RhcnQsIGVuZCwgKGQpID0+IHtcclxuICAgICAgICAgICAgaWYgKGQuZ2V0RGF5KCkgPT09IDApIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGlkID0gYHdrJHtkLmdldE1vbnRoKCl9LSR7ZC5nZXREYXRlKCl9YCAvLyBEb24ndCBjcmVhdGUgYSBuZXcgd2VlayBlbGVtZW50IGlmIG9uZSBhbHJlYWR5IGV4aXN0c1xyXG4gICAgICAgICAgICAgICAgd2sgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZClcclxuICAgICAgICAgICAgICAgIGlmICh3ayA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd2sgPSBjcmVhdGVXZWVrKGlkKVxyXG4gICAgICAgICAgICAgICAgICAgIG1haW4uYXBwZW5kQ2hpbGQod2spXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghd2spIHRocm93IG5ldyBFcnJvcihgRXhwZWN0ZWQgd2VlayBlbGVtZW50IG9uIGRheSAke2R9IHRvIG5vdCBiZSBudWxsYClcclxuICAgICAgICAgICAgaWYgKHdrLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2RheScpLmxlbmd0aCA8PSBkLmdldERheSgpKSB7XHJcbiAgICAgICAgICAgICAgICB3ay5hcHBlbmRDaGlsZChjcmVhdGVEYXkoZCkpXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRha2VuW2QuZ2V0VGltZSgpXSA9IFtdXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgLy8gU3BsaXQgYXNzaWdubWVudHMgdGFraW5nIG1vcmUgdGhhbiAxIHdlZWtcclxuICAgICAgICBjb25zdCBzcGxpdDogSVNwbGl0QXNzaWdubWVudFtdID0gW11cclxuICAgICAgICBkYXRhLmFzc2lnbm1lbnRzLmZvckVhY2goKGFzc2lnbm1lbnQsIG51bSkgPT4ge1xyXG4gICAgICAgICAgICBzcGxpdC5wdXNoKC4uLmdldEFzc2lnbm1lbnRTcGxpdHMoYXNzaWdubWVudCwgc3RhcnQsIGVuZCkpXHJcblxyXG4gICAgICAgICAgICAvLyBBY3Rpdml0eSBzdHVmZlxyXG4gICAgICAgICAgICBpZiAobGFzdERhdGEgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgb2xkQXNzaWdubWVudCA9IGxhc3REYXRhLmFzc2lnbm1lbnRzLmZpbmQoKGEpID0+IGEuaWQgPT09IGFzc2lnbm1lbnQuaWQpXHJcbiAgICAgICAgICAgICAgICBpZiAob2xkQXNzaWdubWVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvbGRBc3NpZ25tZW50LmJvZHkgIT09IGFzc2lnbm1lbnQuYm9keSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRBY3Rpdml0eSgnZWRpdCcsIG9sZEFzc2lnbm1lbnQsIG5ldyBEYXRlKCksIHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9sZEFzc2lnbm1lbnQuY2xhc3MgIT0gbnVsbCA/IGxhc3REYXRhLmNsYXNzZXNbb2xkQXNzaWdubWVudC5jbGFzc10gOiB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbW92ZUZyb21Nb2RpZmllZChhc3NpZ25tZW50LmlkKSAvLyBJZiB0aGUgYXNzaWdubWVudCBpcyBtb2RpZmllZCwgcmVzZXQgaXRcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgbGFzdERhdGEuYXNzaWdubWVudHMuc3BsaWNlKGxhc3REYXRhLmFzc2lnbm1lbnRzLmluZGV4T2Yob2xkQXNzaWdubWVudCksIDEpXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGFkZEFjdGl2aXR5KCdhZGQnLCBhc3NpZ25tZW50LCBuZXcgRGF0ZSgpLCB0cnVlKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgaWYgKGxhc3REYXRhICE9IG51bGwpIHtcclxuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgYW55IG9mIHRoZSBsYXN0IGFzc2lnbm1lbnRzIHdlcmVuJ3QgZGVsZXRlZCAoc28gdGhleSBoYXZlIGJlZW4gZGVsZXRlZCBpbiBQQ1IpXHJcbiAgICAgICAgICAgIGxhc3REYXRhLmFzc2lnbm1lbnRzLmZvckVhY2goKGFzc2lnbm1lbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIGFkZEFjdGl2aXR5KCdkZWxldGUnLCBhc3NpZ25tZW50LCBuZXcgRGF0ZSgpLCB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXNzaWdubWVudC5jbGFzcyAhPSBudWxsID8gbGFzdERhdGEuY2xhc3Nlc1thc3NpZ25tZW50LmNsYXNzXSA6IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgIHJlbW92ZUZyb21Eb25lKGFzc2lnbm1lbnQuaWQpXHJcbiAgICAgICAgICAgICAgICByZW1vdmVGcm9tTW9kaWZpZWQoYXNzaWdubWVudC5pZClcclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIC8vIFRoZW4gc2F2ZSBhIG1heGltdW0gb2YgMTI4IGFjdGl2aXR5IGl0ZW1zXHJcbiAgICAgICAgICAgIHNhdmVBY3Rpdml0eSgpXHJcblxyXG4gICAgICAgICAgICAvLyBBbmQgY29tcGxldGVkIGFzc2lnbm1lbnRzICsgbW9kaWZpY2F0aW9uc1xyXG4gICAgICAgICAgICBzYXZlRG9uZSgpXHJcbiAgICAgICAgICAgIHNhdmVNb2RpZmllZCgpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBBZGQgY3VzdG9tIGFzc2lnbm1lbnRzIHRvIHRoZSBzcGxpdCBhcnJheVxyXG4gICAgICAgIGdldEV4dHJhKCkuZm9yRWFjaCgoY3VzdG9tKSA9PiB7XHJcbiAgICAgICAgICAgIHNwbGl0LnB1c2goLi4uZ2V0QXNzaWdubWVudFNwbGl0cyhleHRyYVRvVGFzayhjdXN0b20sIGRhdGEpLCBzdGFydCwgZW5kLCBjdXN0b20pKVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIC8vIENhbGN1bGF0ZSB0aGUgdG9kYXkncyB3ZWVrIGlkXHJcbiAgICAgICAgY29uc3QgdGRzdCA9IG5ldyBEYXRlKClcclxuICAgICAgICB0ZHN0LnNldERhdGUodGRzdC5nZXREYXRlKCkgLSB0ZHN0LmdldERheSgpKVxyXG4gICAgICAgIGNvbnN0IHRvZGF5V2tJZCA9IGB3ayR7dGRzdC5nZXRNb250aCgpfS0ke3Rkc3QuZ2V0RGF0ZSgpfWBcclxuXHJcbiAgICAgICAgLy8gVGhlbiBhZGQgYXNzaWdubWVudHNcclxuICAgICAgICBjb25zdCB3ZWVrSGVpZ2h0czogeyBbd2Vla0lkOiBzdHJpbmddOiBudW1iZXIgfSA9IHt9XHJcbiAgICAgICAgY29uc3QgcHJldmlvdXNBc3NpZ25tZW50czogeyBbaWQ6IHN0cmluZ106IEhUTUxFbGVtZW50IH0gPSB7fVxyXG4gICAgICAgIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYXNzaWdubWVudCcpLCAoYXNzaWdubWVudDogSFRNTEVsZW1lbnQpID0+IHtcclxuICAgICAgICAgICAgcHJldmlvdXNBc3NpZ25tZW50c1thc3NpZ25tZW50LmlkXSA9IGFzc2lnbm1lbnRcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICBjb25zdCBzZXBhcmF0ZVRhc2tDbGFzcyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLnNlcFRhc2tDbGFzcylcclxuICAgICAgICBzcGxpdC5mb3JFYWNoKChzKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHdlZWtJZCA9IGNvbXB1dGVXZWVrSWQocylcclxuICAgICAgICAgICAgd2sgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh3ZWVrSWQpXHJcbiAgICAgICAgICAgIGlmICh3ayA9PSBudWxsKSByZXR1cm5cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGUgPSBjcmVhdGVBc3NpZ25tZW50KHMsIGRhdGEpXHJcblxyXG4gICAgICAgICAgICAvLyBDYWxjdWxhdGUgaG93IG1hbnkgYXNzaWdubWVudHMgYXJlIHBsYWNlZCBiZWZvcmUgdGhlIGN1cnJlbnQgb25lXHJcbiAgICAgICAgICAgIGlmICghcy5jdXN0b20gfHwgIWxvY2FsU3RvcmFnZVJlYWQoJ3NlcFRhc2tzJykpIHtcclxuICAgICAgICAgICAgICAgIGxldCBwb3MgPSAwXHJcbiAgICAgICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmUgbm8tbG9vcHNcclxuICAgICAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZvdW5kID0gdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgIGl0ZXJEYXlzKHMuc3RhcnQsIHMuZW5kID09PSAnRm9yZXZlcicgPyBzLnN0YXJ0IDogcy5lbmQsIChkKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0YWtlbltkLmdldFRpbWUoKV0uaW5kZXhPZihwb3MpICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm91bmQgPSBmYWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZm91bmQpIHsgYnJlYWsgfVxyXG4gICAgICAgICAgICAgICAgICAgIHBvcysrXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gQXBwZW5kIHRoZSBwb3NpdGlvbiB0aGUgYXNzaWdubWVudCBpcyBhdCB0byB0aGUgdGFrZW4gYXJyYXlcclxuICAgICAgICAgICAgICAgIGl0ZXJEYXlzKHMuc3RhcnQsIHMuZW5kID09PSAnRm9yZXZlcicgPyBzLnN0YXJ0IDogcy5lbmQsIChkKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFrZW5bZC5nZXRUaW1lKCldLnB1c2gocG9zKVxyXG4gICAgICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBDYWxjdWxhdGUgaG93IGZhciBkb3duIHRoZSBhc3NpZ25tZW50IG11c3QgYmUgcGxhY2VkIGFzIHRvIG5vdCBibG9jayB0aGUgb25lcyBhYm92ZSBpdFxyXG4gICAgICAgICAgICAgICAgZS5zdHlsZS5tYXJnaW5Ub3AgPSAocG9zICogMzApICsgJ3B4J1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICgod2Vla0hlaWdodHNbd2Vla0lkXSA9PSBudWxsKSB8fCAocG9zID4gd2Vla0hlaWdodHNbd2Vla0lkXSkpIHtcclxuICAgICAgICAgICAgICAgICAgICB3ZWVrSGVpZ2h0c1t3ZWVrSWRdID0gcG9zXHJcbiAgICAgICAgICAgICAgICAgICAgd2suc3R5bGUuaGVpZ2h0ID0gNDcgKyAoKHBvcyArIDEpICogMzApICsgJ3B4J1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBJZiB0aGUgYXNzaWdubWVudCBpcyBhIHRlc3QgYW5kIGlzIHVwY29taW5nLCBhZGQgaXQgdG8gdGhlIHVwY29taW5nIHRlc3RzIHBhbmVsLlxyXG4gICAgICAgICAgICBpZiAocy5hc3NpZ25tZW50LmVuZCA+PSB0b2RheSgpICYmIChzLmFzc2lnbm1lbnQuYmFzZVR5cGUgPT09ICd0ZXN0JyB8fFxyXG4gICAgICAgICAgICAgICAgKGxvY2FsU3RvcmFnZVJlYWQoJ3Byb2plY3RzSW5UZXN0UGFuZScpICYmIHMuYXNzaWdubWVudC5iYXNlVHlwZSA9PT0gJ2xvbmd0ZXJtJykpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0ZSA9IGVsZW1lbnQoJ2RpdicsIFsndXBjb21pbmdUZXN0JywgJ2Fzc2lnbm1lbnRJdGVtJywgcy5hc3NpZ25tZW50LmJhc2VUeXBlXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgPGkgY2xhc3M9J21hdGVyaWFsLWljb25zJz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7cy5hc3NpZ25tZW50LmJhc2VUeXBlID09PSAnbG9uZ3Rlcm0nID8gJ2Fzc2lnbm1lbnQnIDogJ2Fzc2Vzc21lbnQnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2k+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPSd0aXRsZSc+JHtzLmFzc2lnbm1lbnQudGl0bGV9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c21hbGw+JHtzZXBhcmF0ZWRDbGFzcyhzLmFzc2lnbm1lbnQsIGRhdGEpWzJdfTwvc21hbGw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9J3JhbmdlJz4ke2RhdGVTdHJpbmcocy5hc3NpZ25tZW50LmVuZCwgdHJ1ZSl9PC9kaXY+YCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgdGVzdCR7cy5hc3NpZ25tZW50LmlkfWApXHJcbiAgICAgICAgICAgICAgICBpZiAocy5hc3NpZ25tZW50LmNsYXNzKSB0ZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtY2xhc3MnLCBkYXRhLmNsYXNzZXNbcy5hc3NpZ25tZW50LmNsYXNzXSlcclxuICAgICAgICAgICAgICAgIHRlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRvU2Nyb2xsaW5nID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBzbW9vdGhTY3JvbGwoKGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wICsgZG9jdW1lbnQuYm9keS5zY3JvbGxUb3ApIC0gMTE2KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlLmNsaWNrKClcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRvY3VtZW50LmJvZHkuZ2V0QXR0cmlidXRlKCdkYXRhLXZpZXcnKSA9PT0gJzAnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvU2Nyb2xsaW5nKClcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfJChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbmF2VGFicz5saTpmaXJzdC1jaGlsZCcpIGFzIEhUTUxFbGVtZW50KS5jbGljaygpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZG9TY3JvbGxpbmcsIDUwMClcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChhc3NpZ25tZW50SW5Eb25lKHMuYXNzaWdubWVudC5pZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0ZS5jbGFzc0xpc3QuYWRkKCdkb25lJylcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvbnN0IHRlc3RFbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYHRlc3Qke3MuYXNzaWdubWVudC5pZH1gKVxyXG4gICAgICAgICAgICAgICAgaWYgKHRlc3RFbGVtKSB7XHJcbiAgICAgICAgICAgICAgICB0ZXN0RWxlbS5pbm5lckhUTUwgPSB0ZS5pbm5lckhUTUxcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbUJ5SWQoJ2luZm9UZXN0cycpLmFwcGVuZENoaWxkKHRlKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBhbHJlYWR5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocy5hc3NpZ25tZW50LmlkICsgd2Vla0lkKVxyXG4gICAgICAgICAgICBpZiAoYWxyZWFkeSAhPSBudWxsKSB7IC8vIEFzc2lnbm1lbnQgYWxyZWFkeSBleGlzdHNcclxuICAgICAgICAgICAgICAgIGFscmVhZHkuc3R5bGUubWFyZ2luVG9wID0gZS5zdHlsZS5tYXJnaW5Ub3BcclxuICAgICAgICAgICAgICAgIGFscmVhZHkuc2V0QXR0cmlidXRlKCdkYXRhLWNsYXNzJyxcclxuICAgICAgICAgICAgICAgICAgICBzLmN1c3RvbSAmJiBzZXBhcmF0ZVRhc2tDbGFzcyA/ICdUYXNrJyA6IGNsYXNzQnlJZChzLmFzc2lnbm1lbnQuY2xhc3MpKVxyXG4gICAgICAgICAgICAgICAgaWYgKCFhc3NpZ25tZW50SW5Nb2RpZmllZChzLmFzc2lnbm1lbnQuaWQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxyZWFkeS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdib2R5JylbMF0uaW5uZXJIVE1MID0gZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdib2R5JylbMF0uaW5uZXJIVE1MXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBfJChhbHJlYWR5LnF1ZXJ5U2VsZWN0b3IoJy5lZGl0cycpKS5jbGFzc05hbWUgPSBfJChlLnF1ZXJ5U2VsZWN0b3IoJy5lZGl0cycpKS5jbGFzc05hbWVcclxuICAgICAgICAgICAgICAgIGlmIChhbHJlYWR5LmNsYXNzTGlzdC50b2dnbGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBhbHJlYWR5LmNsYXNzTGlzdC50b2dnbGUoJ2xpc3REaXNwJywgZS5jbGFzc0xpc3QuY29udGFpbnMoJ2xpc3REaXNwJykpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBnZXRFUyhhbHJlYWR5KS5mb3JFYWNoKChjbCkgPT4gYWxyZWFkeS5jbGFzc0xpc3QucmVtb3ZlKGNsKSlcclxuICAgICAgICAgICAgICAgIGdldEVTKGUpLmZvckVhY2goKGNsKSA9PiBhbHJlYWR5LmNsYXNzTGlzdC5hZGQoY2wpKVxyXG4gICAgICAgICAgICAgICAgV0VFS0VORF9DTEFTU05BTUVTLmZvckVhY2goKGNsKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxyZWFkeS5jbGFzc0xpc3QucmVtb3ZlKGNsKVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChlLmNsYXNzTGlzdC5jb250YWlucyhjbCkpIGFscmVhZHkuY2xhc3NMaXN0LmFkZChjbClcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocy5jdXN0b20gJiYgSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2Uuc2VwVGFza3MpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3QgPSBNYXRoLmZsb29yKHMuc3RhcnQuZ2V0VGltZSgpIC8gMTAwMCAvIDM2MDAgLyAyNClcclxuICAgICAgICAgICAgICAgICAgICBpZiAoKHMuYXNzaWdubWVudC5zdGFydCA9PT0gc3QpICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIChzLmFzc2lnbm1lbnQuZW5kID09PSAnRm9yZXZlcicgfHwgcy5hc3NpZ25tZW50LmVuZCA+PSB0b2RheSgpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlLmNsYXNzTGlzdC5yZW1vdmUoJ2Fzc2lnbm1lbnQnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlLmNsYXNzTGlzdC5hZGQoJ3Rhc2tQYW5lSXRlbScpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGUuc3R5bGUub3JkZXIgPSBTdHJpbmcocy5hc3NpZ25tZW50LmVuZCA9PT0gJ0ZvcmV2ZXInID8gTnVtYmVyLk1BWF9WQUxVRSA6IHMuYXNzaWdubWVudC5lbmQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGxpbmsgPSBlLnF1ZXJ5U2VsZWN0b3IoJy5saW5rZWQnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobGluaykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5pbnNlcnRCZWZvcmUoZWxlbWVudCgnc21hbGwnLCBbXSwgbGluay5pbm5lckhUTUwpLCBsaW5rKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluay5yZW1vdmUoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1CeUlkKCdpbmZvVGFza3NJbm5lcicpLmFwcGVuZENoaWxkKGUpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHsgd2suYXBwZW5kQ2hpbGQoZSkgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGRlbGV0ZSBwcmV2aW91c0Fzc2lnbm1lbnRzW3MuYXNzaWdubWVudC5pZCArIHdlZWtJZF1cclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICAvLyBEZWxldGUgYW55IGFzc2lnbm1lbnRzIHRoYXQgaGF2ZSBiZWVuIGRlbGV0ZWQgc2luY2UgdXBkYXRpbmdcclxuICAgICAgICBPYmplY3QuZW50cmllcyhwcmV2aW91c0Fzc2lnbm1lbnRzKS5mb3JFYWNoKChbbmFtZSwgYXNzaWdubWVudF0pID0+IHtcclxuICAgICAgICAgICAgaWYgKGFzc2lnbm1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdmdWxsJykpIHtcclxuICAgICAgICAgICAgICAgIGVsZW1CeUlkKCdiYWNrZ3JvdW5kJykuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBhc3NpZ25tZW50LnJlbW92ZSgpXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgLy8gU2Nyb2xsIHRvIHRoZSBjb3JyZWN0IHBvc2l0aW9uIGluIGNhbGVuZGFyIHZpZXdcclxuICAgICAgICBpZiAod2Vla0hlaWdodHNbdG9kYXlXa0lkXSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIGxldCBoID0gMFxyXG4gICAgICAgICAgICBjb25zdCBzdyA9ICh3a2lkOiBzdHJpbmcpID0+IHdraWQuc3Vic3RyaW5nKDIpLnNwbGl0KCctJykubWFwKCh4KSA9PiBOdW1iZXIoeCkpXHJcbiAgICAgICAgICAgIGNvbnN0IHRvZGF5V2sgPSBzdyh0b2RheVdrSWQpXHJcbiAgICAgICAgICAgIE9iamVjdC5lbnRyaWVzKHdlZWtIZWlnaHRzKS5mb3JFYWNoKChbd2tJZCwgdmFsXSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgd2tTcGxpdCA9IHN3KHdrSWQpXHJcbiAgICAgICAgICAgICAgICBpZiAoKHdrU3BsaXRbMF0gPCB0b2RheVdrWzBdKSB8fCAoKHdrU3BsaXRbMF0gPT09IHRvZGF5V2tbMF0pICYmICh3a1NwbGl0WzFdIDwgdG9kYXlXa1sxXSkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaCArPSB2YWxcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgc2Nyb2xsID0gKGggKiAzMCkgKyAxMTIgKyAxNFxyXG4gICAgICAgICAgICAvLyBBbHNvIHNob3cgdGhlIGRheSBoZWFkZXJzIGlmIHRvZGF5J3MgZGF0ZSBpcyBkaXNwbGF5ZWQgaW4gdGhlIGZpcnN0IHJvdyBvZiB0aGUgY2FsZW5kYXJcclxuICAgICAgICAgICAgaWYgKHNjcm9sbCA8IDUwKSBzY3JvbGwgPSAwXHJcbiAgICAgICAgICAgIGlmIChkb1Njcm9sbCAmJiAoZG9jdW1lbnQuYm9keS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmlldycpID09PSAnMCcpICYmXHJcbiAgICAgICAgICAgICAgICAhZG9jdW1lbnQuYm9keS5xdWVyeVNlbGVjdG9yKCcuZnVsbCcpKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBpbiBjYWxlbmRhciB2aWV3XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgc2Nyb2xsKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC50b2dnbGUoJ25vTGlzdCcsXHJcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5hc3NpZ25tZW50Lmxpc3REaXNwOm5vdCguZG9uZSknKS5sZW5ndGggPT09IDApXHJcbiAgICAgICAgaWYgKGRvY3VtZW50LmJvZHkuZ2V0QXR0cmlidXRlKCdkYXRhLXZpZXcnKSA9PT0gJzEnKSB7IC8vIGluIGxpc3Qgdmlld1xyXG4gICAgICAgICAgICByZXNpemUoKVxyXG4gICAgICAgIH1cclxuICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgIGRpc3BsYXlFcnJvcihlcnIpXHJcbiAgICB9XHJcbiAgICBjb25zb2xlLnRpbWVFbmQoJ0Rpc3BsYXlpbmcgZGF0YScpXHJcbn1cclxuXHJcbi8vIFRoZSBmdW5jdGlvbiBiZWxvdyBjb252ZXJ0cyBhbiB1cGRhdGUgdGltZSB0byBhIGh1bWFuLXJlYWRhYmxlIGRhdGUuXHJcbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRVcGRhdGUoZGF0ZTogbnVtYmVyKTogc3RyaW5nIHtcclxuICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpXHJcbiAgY29uc3QgdXBkYXRlID0gbmV3IERhdGUoK2RhdGUpXHJcbiAgaWYgKG5vdy5nZXREYXRlKCkgPT09IHVwZGF0ZS5nZXREYXRlKCkpIHtcclxuICAgIGxldCBhbXBtID0gJ0FNJ1xyXG4gICAgbGV0IGhyID0gdXBkYXRlLmdldEhvdXJzKClcclxuICAgIGlmIChociA+IDEyKSB7XHJcbiAgICAgIGFtcG0gPSAnUE0nXHJcbiAgICAgIGhyIC09IDEyXHJcbiAgICB9XHJcbiAgICBjb25zdCBtaW4gPSB1cGRhdGUuZ2V0TWludXRlcygpXHJcbiAgICByZXR1cm4gYFRvZGF5IGF0ICR7aHJ9OiR7bWluIDwgMTAgPyBgMCR7bWlufWAgOiBtaW59ICR7YW1wbX1gXHJcbiAgfSBlbHNlIHtcclxuICAgIGNvbnN0IGRheXNQYXN0ID0gTWF0aC5jZWlsKChub3cuZ2V0VGltZSgpIC0gdXBkYXRlLmdldFRpbWUoKSkgLyAxMDAwIC8gMzYwMCAvIDI0KVxyXG4gICAgaWYgKGRheXNQYXN0ID09PSAxKSB7IHJldHVybiAnWWVzdGVyZGF5JyB9IGVsc2UgeyByZXR1cm4gZGF5c1Bhc3QgKyAnIGRheXMgYWdvJyB9XHJcbiAgfVxyXG59XHJcbiIsImxldCBsaXN0RGF0ZU9mZnNldCA9IDBcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRMaXN0RGF0ZU9mZnNldCgpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIGxpc3REYXRlT2Zmc2V0XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB6ZXJvTGlzdERhdGVPZmZzZXQoKTogdm9pZCB7XHJcbiAgICBsaXN0RGF0ZU9mZnNldCA9IDBcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGluY3JlbWVudExpc3REYXRlT2Zmc2V0KCk6IHZvaWQge1xyXG4gICAgbGlzdERhdGVPZmZzZXQgKz0gMVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZGVjcmVtZW50TGlzdERhdGVPZmZzZXQoKTogdm9pZCB7XHJcbiAgICBsaXN0RGF0ZU9mZnNldCAtPSAxXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRMaXN0RGF0ZU9mZnNldChvZmZzZXQ6IG51bWJlcik6IHZvaWQge1xyXG4gICAgbGlzdERhdGVPZmZzZXQgPSBvZmZzZXRcclxufVxyXG4iLCIvKipcclxuICogVGhpcyBtb2R1bGUgY29udGFpbnMgY29kZSB0byBib3RoIGZldGNoIGFuZCBwYXJzZSBhc3NpZ25tZW50cyBmcm9tIFBDUi5cclxuICovXHJcbmltcG9ydCB7IHVwZGF0ZUF2YXRhciB9IGZyb20gJy4vY29tcG9uZW50cy9hdmF0YXInXHJcbmltcG9ydCB7IGRpc3BsYXlFcnJvciB9IGZyb20gJy4vY29tcG9uZW50cy9lcnJvckRpc3BsYXknXHJcbmltcG9ydCB7IHNuYWNrYmFyIH0gZnJvbSAnLi9jb21wb25lbnRzL3NuYWNrYmFyJ1xyXG5pbXBvcnQgeyBkZWxldGVDb29raWUsIGdldENvb2tpZSwgc2V0Q29va2llIH0gZnJvbSAnLi9jb29raWVzJ1xyXG5pbXBvcnQgeyB0b0RhdGVOdW0gfSBmcm9tICcuL2RhdGVzJ1xyXG5pbXBvcnQgeyBkaXNwbGF5LCBmb3JtYXRVcGRhdGUgfSBmcm9tICcuL2Rpc3BsYXknXHJcbmltcG9ydCB7IF8kLCBlbGVtQnlJZCwgbG9jYWxTdG9yYWdlV3JpdGUsIHNlbmQgfSBmcm9tICcuL3V0aWwnXHJcblxyXG5jb25zdCBQQ1JfVVJMID0gJ2h0dHBzOi8vd2ViYXBwc2NhLnBjcnNvZnQuY29tJ1xyXG5jb25zdCBBU1NJR05NRU5UU19VUkwgPSBgJHtQQ1JfVVJMfS9DbHVlL1NDLUFzc2lnbm1lbnRzLUVuZC1EYXRlLVJhbmdlLzc1MzZgXHJcbmNvbnN0IExPR0lOX1VSTCA9IGAke1BDUl9VUkx9L0NsdWUvU0MtU3R1ZGVudC1Qb3J0YWwtTG9naW4tTERBUC84NDY0P3JldHVyblVybD0ke2VuY29kZVVSSUNvbXBvbmVudChBU1NJR05NRU5UU19VUkwpfWBcclxuY29uc3QgQVRUQUNITUVOVFNfVVJMID0gYCR7UENSX1VSTH0vQ2x1ZS9Db21tb24vQXR0YWNobWVudFJlbmRlci5hc3B4YFxyXG5jb25zdCBGT1JNX0hFQURFUl9PTkxZID0geyAnQ29udGVudC10eXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcgfVxyXG5jb25zdCBPTkVfTUlOVVRFX01TID0gNjAwMDBcclxuXHJcbmNvbnN0IHByb2dyZXNzRWxlbWVudCA9IGVsZW1CeUlkKCdwcm9ncmVzcycpXHJcbmNvbnN0IGxvZ2luRGlhbG9nID0gZWxlbUJ5SWQoJ2xvZ2luJylcclxuY29uc3QgbG9naW5CYWNrZ3JvdW5kID0gZWxlbUJ5SWQoJ2xvZ2luQmFja2dyb3VuZCcpXHJcbmNvbnN0IGxhc3RVcGRhdGVFbCA9IGVsZW1CeUlkKCdsYXN0VXBkYXRlJylcclxuY29uc3QgdXNlcm5hbWVFbCA9IGVsZW1CeUlkKCd1c2VybmFtZScpIGFzIEhUTUxJbnB1dEVsZW1lbnRcclxuY29uc3QgcGFzc3dvcmRFbCA9IGVsZW1CeUlkKCdwYXNzd29yZCcpIGFzIEhUTUxJbnB1dEVsZW1lbnRcclxuY29uc3QgcmVtZW1iZXJDaGVjayA9IGVsZW1CeUlkKCdyZW1lbWJlcicpIGFzIEhUTUxJbnB1dEVsZW1lbnRcclxuY29uc3QgaW5jb3JyZWN0TG9naW5FbCA9IGVsZW1CeUlkKCdsb2dpbkluY29ycmVjdCcpXHJcblxyXG4vLyBUT0RPIGtlZXBpbmcgdGhlc2UgYXMgYSBnbG9iYWwgdmFycyBpcyBiYWRcclxuY29uc3QgbG9naW5IZWFkZXJzOiB7W2hlYWRlcjogc3RyaW5nXTogc3RyaW5nfSA9IHt9XHJcbmNvbnN0IHZpZXdEYXRhOiB7W2hhZGVyOiBzdHJpbmddOiBzdHJpbmd9ID0ge31cclxubGV0IGxhc3RVcGRhdGUgPSAwIC8vIFRoZSBsYXN0IHRpbWUgZXZlcnl0aGluZyB3YXMgdXBkYXRlZFxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJQXBwbGljYXRpb25EYXRhIHtcclxuICAgIGNsYXNzZXM6IHN0cmluZ1tdXHJcbiAgICBhc3NpZ25tZW50czogSUFzc2lnbm1lbnRbXVxyXG4gICAgbW9udGhWaWV3OiBib29sZWFuXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUFzc2lnbm1lbnQge1xyXG4gICAgc3RhcnQ6IG51bWJlclxyXG4gICAgZW5kOiBudW1iZXJ8J0ZvcmV2ZXInXHJcbiAgICBhdHRhY2htZW50czogQXR0YWNobWVudEFycmF5W11cclxuICAgIGJvZHk6IHN0cmluZ1xyXG4gICAgdHlwZTogc3RyaW5nXHJcbiAgICBiYXNlVHlwZTogc3RyaW5nXHJcbiAgICBjbGFzczogbnVtYmVyfG51bGwsXHJcbiAgICB0aXRsZTogc3RyaW5nXHJcbiAgICBpZDogc3RyaW5nXHJcbn1cclxuXHJcbmV4cG9ydCB0eXBlIEF0dGFjaG1lbnRBcnJheSA9IFtzdHJpbmcsIHN0cmluZ11cclxuXHJcbi8vIFRoaXMgaXMgdGhlIGZ1bmN0aW9uIHRoYXQgcmV0cmlldmVzIHlvdXIgYXNzaWdubWVudHMgZnJvbSBQQ1IuXHJcbi8vXHJcbi8vIEZpcnN0LCBhIHJlcXVlc3QgaXMgc2VudCB0byBQQ1IgdG8gbG9hZCB0aGUgcGFnZSB5b3Ugd291bGQgbm9ybWFsbHkgc2VlIHdoZW4gYWNjZXNzaW5nIFBDUi5cclxuLy9cclxuLy8gQmVjYXVzZSB0aGlzIGlzIHJ1biBhcyBhIGNocm9tZSBleHRlbnNpb24sIHRoaXMgcGFnZSBjYW4gYmUgYWNjZXNzZWQuIE90aGVyd2lzZSwgdGhlIGJyb3dzZXJcclxuLy8gd291bGQgdGhyb3cgYW4gZXJyb3IgZm9yIHNlY3VyaXR5IHJlYXNvbnMgKHlvdSBkb24ndCB3YW50IGEgcmFuZG9tIHdlYnNpdGUgYmVpbmcgYWJsZSB0byBhY2Nlc3NcclxuLy8gY29uZmlkZW50aWFsIGRhdGEgZnJvbSBhIHdlYnNpdGUgeW91IGhhdmUgbG9nZ2VkIGludG8pLlxyXG5cclxuLyoqXHJcbiAqIEZldGNoZXMgZGF0YSBmcm9tIFBDUiBhbmQgaWYgdGhlIHVzZXIgaXMgbG9nZ2VkIGluIHBhcnNlcyBhbmQgZGlzcGxheXMgaXRcclxuICogQHBhcmFtIG92ZXJyaWRlIFdoZXRoZXIgdG8gZm9yY2UgYW4gdXBkYXRlIGV2ZW4gdGhlcmUgd2FzIG9uZSByZWNlbnRseVxyXG4gKiBAcGFyYW0gZGF0YSAgT3B0aW9uYWwgZGF0YSB0byBiZSBwb3N0ZWQgdG8gUENSXHJcbiAqL1xyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmV0Y2gob3ZlcnJpZGU6IGJvb2xlYW4gPSBmYWxzZSwgZGF0YT86IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgaWYgKCFvdmVycmlkZSAmJiBEYXRlLm5vdygpIC0gbGFzdFVwZGF0ZSA8IE9ORV9NSU5VVEVfTVMpIHJldHVyblxyXG4gICAgbGFzdFVwZGF0ZSA9IERhdGUubm93KClcclxuXHJcbiAgICBjb25zdCBoZWFkZXJzID0gZGF0YSA/IEZPUk1fSEVBREVSX09OTFkgOiB1bmRlZmluZWRcclxuICAgIGNvbnNvbGUudGltZSgnRmV0Y2hpbmcgYXNzaWdubWVudHMnKVxyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCByZXNwID0gYXdhaXQgc2VuZChBU1NJR05NRU5UU19VUkwsICdkb2N1bWVudCcsIGhlYWRlcnMsIGRhdGEsIHByb2dyZXNzRWxlbWVudClcclxuICAgICAgICBjb25zb2xlLnRpbWVFbmQoJ0ZldGNoaW5nIGFzc2lnbm1lbnRzJylcclxuICAgICAgICBpZiAocmVzcC5yZXNwb25zZVVSTC5pbmRleE9mKCdMb2dpbicpICE9PSAtMSkge1xyXG4gICAgICAgICAgICAvLyBXZSBoYXZlIHRvIGxvZyBpbiBub3dcclxuICAgICAgICAgICAgKHJlc3AucmVzcG9uc2UgYXMgSFRNTERvY3VtZW50KS5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaW5wdXQnKS5mb3JFYWNoKChlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsb2dpbkhlYWRlcnNbZS5uYW1lXSA9IGUudmFsdWUgfHwgJydcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ05lZWQgdG8gbG9nIGluJylcclxuICAgICAgICAgICAgY29uc3QgdXAgPSBnZXRDb29raWUoJ3VzZXJQYXNzJykgLy8gQXR0ZW1wdHMgdG8gZ2V0IHRoZSBjb29raWUgKnVzZXJQYXNzKiwgd2hpY2ggaXMgc2V0IGlmIHRoZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBcIlJlbWVtYmVyIG1lXCIgY2hlY2tib3ggaXMgY2hlY2tlZCB3aGVuIGxvZ2dpbmcgaW4gdGhyb3VnaCBDaGVja1BDUlxyXG4gICAgICAgICAgICBpZiAodXAgPT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICBsb2dpbkJhY2tncm91bmQuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcclxuICAgICAgICAgICAgICAgIGxvZ2luRGlhbG9nLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBCZWNhdXNlIHdlIHdlcmUgcmVtZW1iZXJlZCwgd2UgY2FuIGxvZyBpbiBpbW1lZGlhdGVseSB3aXRob3V0IHdhaXRpbmcgZm9yIHRoZVxyXG4gICAgICAgICAgICAgICAgLy8gdXNlciB0byBsb2cgaW4gdGhyb3VnaCB0aGUgbG9naW4gZm9ybVxyXG4gICAgICAgICAgICAgICAgZG9sb2dpbih3aW5kb3cuYXRvYih1cCkuc3BsaXQoJzonKSBhcyBbc3RyaW5nLCBzdHJpbmddKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gTG9nZ2VkIGluIG5vd1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnRmV0Y2hpbmcgYXNzaWdubWVudHMgc3VjY2Vzc2Z1bCcpXHJcbiAgICAgICAgICAgIGNvbnN0IHQgPSBEYXRlLm5vdygpXHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5sYXN0VXBkYXRlID0gdFxyXG4gICAgICAgICAgICBsYXN0VXBkYXRlRWwuaW5uZXJIVE1MID0gZm9ybWF0VXBkYXRlKHQpXHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBwYXJzZShyZXNwLnJlc3BvbnNlKVxyXG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpXHJcbiAgICAgICAgICAgICAgICBkaXNwbGF5RXJyb3IoZXJyb3IpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdDb3VsZCBub3QgZmV0Y2ggYXNzaWdubWVudHM7IFlvdSBhcmUgcHJvYmFibHkgb2ZmbGluZS4gSGVyZVxcJ3MgdGhlIGVycm9yOicsIGVycm9yKVxyXG4gICAgICAgIHNuYWNrYmFyKCdDb3VsZCBub3QgZmV0Y2ggeW91ciBhc3NpZ25tZW50cycsICdSZXRyeScsICgpID0+IGZldGNoKHRydWUpKVxyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogTG9ncyB0aGUgdXNlciBpbnRvIFBDUlxyXG4gKiBAcGFyYW0gdmFsICAgQW4gb3B0aW9uYWwgbGVuZ3RoLTIgYXJyYXkgb2YgdGhlIGZvcm0gW3VzZXJuYW1lLCBwYXNzd29yZF0gdG8gdXNlIHRoZSB1c2VyIGluIHdpdGguXHJcbiAqICAgICAgICAgICAgICBJZiB0aGlzIGFycmF5IGlzIG5vdCBnaXZlbiB0aGUgbG9naW4gZGlhbG9nIGlucHV0cyB3aWxsIGJlIHVzZWQuXHJcbiAqIEBwYXJhbSBzdWJtaXRFdnQgV2hldGhlciB0byBvdmVycmlkZSB0aGUgdXNlcm5hbWUgYW5kIHBhc3N3b3JkIHN1cHBsZWlkIGluIHZhbCB3aXRoIHRoZSB2YWx1ZXMgb2YgdGhlIGlucHV0IGVsZW1lbnRzXHJcbiAqL1xyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZG9sb2dpbih2YWw/OiBbc3RyaW5nLCBzdHJpbmddfG51bGwsIHN1Ym1pdEV2dDogYm9vbGVhbiA9IGZhbHNlKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICBsb2dpbkRpYWxvZy5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gICAgc2V0VGltZW91dCgoKSA9PiBsb2dpbkJhY2tncm91bmQuc3R5bGUuZGlzcGxheSA9ICdub25lJywgMzUwKVxyXG5cclxuICAgIGNvbnN0IHBvc3RBcnJheTogc3RyaW5nW10gPSBbXSAvLyBBcnJheSBvZiBkYXRhIHRvIHBvc3RcclxuICAgIGxvY2FsU3RvcmFnZVdyaXRlKCd1c2VybmFtZScsIHZhbCAmJiAhc3VibWl0RXZ0ID8gdmFsWzBdIDogdXNlcm5hbWVFbC52YWx1ZSlcclxuICAgIHVwZGF0ZUF2YXRhcigpXHJcbiAgICBPYmplY3Qua2V5cyhsb2dpbkhlYWRlcnMpLmZvckVhY2goKGgpID0+ICB7XHJcbiAgICAgICAgLy8gTG9vcCB0aHJvdWdoIHRoZSBpbnB1dCBlbGVtZW50cyBjb250YWluZWQgaW4gdGhlIGxvZ2luIHBhZ2UuIEFzIG1lbnRpb25lZCBiZWZvcmUsIHRoZXlcclxuICAgICAgICAvLyB3aWxsIGJlIHNlbnQgdG8gUENSIHRvIGxvZyBpbi5cclxuICAgICAgICBpZiAoaC50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ3VzZXInKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgbG9naW5IZWFkZXJzW2hdID0gdmFsICYmICFzdWJtaXRFdnQgPyB2YWxbMF0gOiB1c2VybmFtZUVsLnZhbHVlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChoLnRvTG93ZXJDYXNlKCkuaW5kZXhPZigncGFzcycpICE9PSAtMSkge1xyXG4gICAgICAgICAgICBsb2dpbkhlYWRlcnNbaF0gPSB2YWwgJiYgIXN1Ym1pdEV2dCA/IHZhbFsxXSA6IHBhc3N3b3JkRWwudmFsdWVcclxuICAgICAgICB9XHJcbiAgICAgICAgcG9zdEFycmF5LnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KGgpICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KGxvZ2luSGVhZGVyc1toXSkpXHJcbiAgICB9KVxyXG5cclxuICAgIC8vIE5vdyBzZW5kIHRoZSBsb2dpbiByZXF1ZXN0IHRvIFBDUlxyXG4gICAgY29uc29sZS50aW1lKCdMb2dnaW5nIGluJylcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcmVzcCA9IGF3YWl0IHNlbmQoTE9HSU5fVVJMLCAnZG9jdW1lbnQnLCBGT1JNX0hFQURFUl9PTkxZLCBwb3N0QXJyYXkuam9pbignJicpLCBwcm9ncmVzc0VsZW1lbnQpXHJcbiAgICAgICAgY29uc29sZS50aW1lRW5kKCdMb2dnaW5nIGluJylcclxuICAgICAgICBpZiAocmVzcC5yZXNwb25zZVVSTC5pbmRleE9mKCdMb2dpbicpICE9PSAtMSkge1xyXG4gICAgICAgIC8vIElmIFBDUiBzdGlsbCB3YW50cyB1cyB0byBsb2cgaW4sIHRoZW4gdGhlIHVzZXJuYW1lIG9yIHBhc3N3b3JkIGVudGVyZWQgd2VyZSBpbmNvcnJlY3QuXHJcbiAgICAgICAgICAgIGluY29ycmVjdExvZ2luRWwuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcclxuICAgICAgICAgICAgcGFzc3dvcmRFbC52YWx1ZSA9ICcnXHJcblxyXG4gICAgICAgICAgICBsb2dpbkRpYWxvZy5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG4gICAgICAgICAgICBsb2dpbkJhY2tncm91bmQuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBPdGhlcndpc2UsIHdlIGFyZSBsb2dnZWQgaW5cclxuICAgICAgICAgICAgaWYgKHJlbWVtYmVyQ2hlY2suY2hlY2tlZCkgeyAvLyBJcyB0aGUgXCJyZW1lbWJlciBtZVwiIGNoZWNrYm94IGNoZWNrZWQ/XHJcbiAgICAgICAgICAgICAgICAvLyBTZXQgYSBjb29raWUgd2l0aCB0aGUgdXNlcm5hbWUgYW5kIHBhc3N3b3JkIHNvIHdlIGNhbiBsb2cgaW4gYXV0b21hdGljYWxseSBpbiB0aGVcclxuICAgICAgICAgICAgICAgIC8vIGZ1dHVyZSB3aXRob3V0IGhhdmluZyB0byBwcm9tcHQgZm9yIGEgdXNlcm5hbWUgYW5kIHBhc3N3b3JkIGFnYWluXHJcbiAgICAgICAgICAgICAgICBzZXRDb29raWUoJ3VzZXJQYXNzJywgd2luZG93LmJ0b2EodXNlcm5hbWVFbC52YWx1ZSArICc6JyArIHBhc3N3b3JkRWwudmFsdWUpLCAxNClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBsb2FkaW5nQmFyLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIlxyXG4gICAgICAgICAgICBjb25zdCB0ID0gRGF0ZS5ub3coKVxyXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2UubGFzdFVwZGF0ZSA9IHRcclxuICAgICAgICAgICAgbGFzdFVwZGF0ZUVsLmlubmVySFRNTCA9IGZvcm1hdFVwZGF0ZSh0KVxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgcGFyc2UocmVzcC5yZXNwb25zZSkgLy8gUGFyc2UgdGhlIGRhdGEgUENSIGhhcyByZXBsaWVkIHdpdGhcclxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZSlcclxuICAgICAgICAgICAgICAgIGRpc3BsYXlFcnJvcihlKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgY29uc29sZS5sb2coJ0NvdWxkIG5vdCBsb2cgaW4gdG8gUENSLiBFaXRoZXIgeW91ciBuZXR3b3JrIGNvbm5lY3Rpb24gd2FzIGxvc3QgZHVyaW5nIHlvdXIgdmlzaXQgJyArXHJcbiAgICAgICAgICAgICAgICAgICAgICdvciBQQ1IgaXMganVzdCBub3Qgd29ya2luZy4gSGVyZVxcJ3MgdGhlIGVycm9yOicsIGVycm9yKVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0RGF0YSgpOiBJQXBwbGljYXRpb25EYXRhfHVuZGVmaW5lZCB7XHJcbiAgICByZXR1cm4gKHdpbmRvdyBhcyBhbnkpLmRhdGFcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldENsYXNzZXMoKTogc3RyaW5nW10ge1xyXG4gICAgY29uc3QgZGF0YSA9IGdldERhdGEoKVxyXG4gICAgaWYgKCFkYXRhKSByZXR1cm4gW11cclxuICAgIHJldHVybiBkYXRhLmNsYXNzZXNcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNldERhdGEoZGF0YTogSUFwcGxpY2F0aW9uRGF0YSk6IHZvaWQge1xyXG4gICAgKHdpbmRvdyBhcyBhbnkpLmRhdGEgPSBkYXRhXHJcbn1cclxuXHJcbi8vIEluIFBDUidzIGludGVyZmFjZSwgeW91IGNhbiBjbGljayBhIGRhdGUgaW4gbW9udGggb3Igd2VlayB2aWV3IHRvIHNlZSBpdCBpbiBkYXkgdmlldy5cclxuLy8gVGhlcmVmb3JlLCB0aGUgSFRNTCBlbGVtZW50IHRoYXQgc2hvd3MgdGhlIGRhdGUgdGhhdCB5b3UgY2FuIGNsaWNrIG9uIGhhcyBhIGh5cGVybGluayB0aGF0IGxvb2tzIGxpa2UgYCMyMDE1LTA0LTI2YC5cclxuLy8gVGhlIGZ1bmN0aW9uIGJlbG93IHdpbGwgcGFyc2UgdGhhdCBTdHJpbmcgYW5kIHJldHVybiBhIERhdGUgdGltZXN0YW1wXHJcbmZ1bmN0aW9uIHBhcnNlRGF0ZUhhc2goZWxlbWVudDogSFRNTEFuY2hvckVsZW1lbnQpOiBudW1iZXIge1xyXG4gICAgY29uc3QgW3llYXIsIG1vbnRoLCBkYXldID0gZWxlbWVudC5oYXNoLnN1YnN0cmluZygxKS5zcGxpdCgnLScpLm1hcChOdW1iZXIpXHJcbiAgICByZXR1cm4gKG5ldyBEYXRlKHllYXIsIG1vbnRoIC0gMSwgZGF5KSkuZ2V0VGltZSgpXHJcbn1cclxuXHJcbi8vIFRoZSAqYXR0YWNobWVudGlmeSogZnVuY3Rpb24gcGFyc2VzIHRoZSBib2R5IG9mIGFuIGFzc2lnbm1lbnQgKCp0ZXh0KikgYW5kIHJldHVybnMgdGhlIGFzc2lnbm1lbnQncyBhdHRhY2htZW50cy5cclxuZnVuY3Rpb24gYXR0YWNobWVudGlmeShlbGVtZW50OiBIVE1MRWxlbWVudCk6IEF0dGFjaG1lbnRBcnJheVtdIHtcclxuICAgIGNvbnN0IGF0dGFjaG1lbnRzOiBBdHRhY2htZW50QXJyYXlbXSA9IFtdXHJcblxyXG4gICAgLy8gR2V0IGFsbCBsaW5rc1xyXG4gICAgY29uc3QgYXMgPSBBcnJheS5mcm9tKGVsZW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2EnKSlcclxuICAgIGFzLmZvckVhY2goKGEpID0+IHtcclxuICAgICAgICBpZiAoYS5pZC5pbmNsdWRlcygnQXR0YWNobWVudCcpKSB7XHJcbiAgICAgICAgICAgIGF0dGFjaG1lbnRzLnB1c2goW1xyXG4gICAgICAgICAgICAgICAgYS5pbm5lckhUTUwsXHJcbiAgICAgICAgICAgICAgICBhLnNlYXJjaCArIGEuaGFzaFxyXG4gICAgICAgICAgICBdKVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbiAgICByZXR1cm4gYXR0YWNobWVudHNcclxufVxyXG5cclxuLy8gVGhpcyBmdW5jdGlvbiByZXBsYWNlcyB0ZXh0IHRoYXQgcmVwcmVzZW50cyBhIGh5cGVybGluayB3aXRoIGEgZnVuY3Rpb25hbCBoeXBlcmxpbmsgYnkgdXNpbmdcclxuLy8gamF2YXNjcmlwdCdzIHJlcGxhY2UgZnVuY3Rpb24gd2l0aCBhIHJlZ3VsYXIgZXhwcmVzc2lvbiBpZiB0aGUgdGV4dCBhbHJlYWR5IGlzbid0IHBhcnQgb2YgYVxyXG4vLyBoeXBlcmxpbmsuXHJcbmZ1bmN0aW9uIHVybGlmeSh0ZXh0OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRleHQucmVwbGFjZShuZXcgUmVnRXhwKGAoXFxcclxuICAgICAgICBodHRwcz86XFxcXC9cXFxcL1xcXHJcbiAgICAgICAgWy1BLVowLTkrJkAjXFxcXC8lPz1+X3whOiwuO10qXFxcclxuICAgICAgICBbLUEtWjAtOSsmQCNcXFxcLyU9fl98XStcXFxyXG4gICAgICAgIClgLCAnaWcnXHJcbiAgICApLCAoc3RyLCBzdHIyLCBvZmZzZXQpID0+IHsgLy8gRnVuY3Rpb24gdG8gcmVwbGFjZSBtYXRjaGVzXHJcbiAgICAgICAgaWYgKC9ocmVmXFxzKj1cXHMqLi8udGVzdCh0ZXh0LnN1YnN0cmluZyhvZmZzZXQgLSAxMCwgb2Zmc2V0KSkgfHxcclxuICAgICAgICAgICAgL29yaWdpbmFscGF0aFxccyo9XFxzKi4vLnRlc3QodGV4dC5zdWJzdHJpbmcob2Zmc2V0IC0gMjAsIG9mZnNldCkpXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzdHJcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gYDxhIGhyZWY9XCIke3N0cn1cIj4ke3N0cn08L2E+YFxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbn1cclxuXHJcbi8vIEFsc28sIFBDUlwicyBpbnRlcmZhY2UgdXNlcyBhIHN5c3RlbSBvZiBJRHMgdG8gaWRlbnRpZnkgZGlmZmVyZW50IGVsZW1lbnRzLiBGb3IgZXhhbXBsZSwgdGhlIElEIG9mXHJcbi8vIG9uZSBvZiB0aGUgYm94ZXMgc2hvd2luZyB0aGUgbmFtZSBvZiBhbiBhc3NpZ25tZW50IGNvdWxkIGJlXHJcbi8vIGBjdGwwMF9jdGwwMF9iYXNlQ29udGVudF9iYXNlQ29udGVudF9mbGFzaFRvcF9jdGwwMF9SYWRTY2hlZHVsZXIxXzk1XzBgLiBUaGUgZnVuY3Rpb24gYmVsb3cgd2lsbFxyXG4vLyByZXR1cm4gdGhlIGZpcnN0IEhUTUwgZWxlbWVudCB3aG9zZSBJRCBjb250YWlucyBhIHNwZWNpZmllZCBTdHJpbmcgKCppZCopIGFuZCBjb250YWluaW5nIGFcclxuLy8gc3BlY2lmaWVkIHRhZyAoKnRhZyopLlxyXG5mdW5jdGlvbiBmaW5kSWQoZWxlbWVudDogSFRNTEVsZW1lbnR8SFRNTERvY3VtZW50LCB0YWc6IHN0cmluZywgaWQ6IHN0cmluZyk6IEhUTUxFbGVtZW50IHtcclxuICAgIGNvbnN0IGVsID0gWy4uLmVsZW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUodGFnKV0uZmluZCgoZSkgPT4gZS5pZC5pbmNsdWRlcyhpZCkpXHJcbiAgICBpZiAoIWVsKSB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBmaW5kIGVsZW1lbnQgd2l0aCB0YWcgJHt0YWd9IGFuZCBpZCAke2lkfSBpbiAke2VsZW1lbnR9YClcclxuICAgIHJldHVybiBlbCBhcyBIVE1MRWxlbWVudFxyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJzZUFzc2lnbm1lbnRUeXBlKHR5cGU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdHlwZS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoJyYgcXVpenplcycsICcnKS5yZXBsYWNlKCd0ZXN0cycsICd0ZXN0JylcclxufVxyXG5cclxuZnVuY3Rpb24gcGFyc2VBc3NpZ25tZW50QmFzZVR5cGUodHlwZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0eXBlLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgnJiBxdWl6emVzJywgJycpLnJlcGxhY2UoL1xccy9nLCAnJylcclxufVxyXG5cclxuZnVuY3Rpb24gcGFyc2VBc3NpZ25tZW50KGNhOiBIVE1MRWxlbWVudCk6IElBc3NpZ25tZW50IHtcclxuICAgIGNvbnN0IGRhdGEgPSBnZXREYXRhKClcclxuICAgIGlmICghZGF0YSkgdGhyb3cgbmV3IEVycm9yKCdEYXRhIGRpY3Rpb25hcnkgbm90IHNldCB1cCcpXHJcblxyXG4gICAgLy8gVGhlIHN0YXJ0aW5nIGRhdGUgYW5kIGVuZGluZyBkYXRlIG9mIHRoZSBhc3NpZ25tZW50IGFyZSBwYXJzZWQgZmlyc3RcclxuICAgIGNvbnN0IHJhbmdlID0gZmluZElkKGNhLCAnc3BhbicsICdTdGFydGluZ09uJykuaW5uZXJIVE1MLnNwbGl0KCcgLSAnKVxyXG4gICAgY29uc3QgYXNzaWdubWVudFN0YXJ0ID0gdG9EYXRlTnVtKERhdGUucGFyc2UocmFuZ2VbMF0pKVxyXG4gICAgY29uc3QgYXNzaWdubWVudEVuZCA9IChyYW5nZVsxXSAhPSBudWxsKSA/IHRvRGF0ZU51bShEYXRlLnBhcnNlKHJhbmdlWzFdKSkgOiBhc3NpZ25tZW50U3RhcnRcclxuXHJcbiAgICAvLyBUaGVuLCB0aGUgbmFtZSBvZiB0aGUgYXNzaWdubWVudCBpcyBwYXJzZWRcclxuICAgIGNvbnN0IHQgPSBmaW5kSWQoY2EsICdzcGFuJywgJ2xibFRpdGxlJylcclxuICAgIGxldCB0aXRsZSA9IHQuaW5uZXJIVE1MXHJcblxyXG4gICAgLy8gVGhlIGFjdHVhbCBib2R5IG9mIHRoZSBhc3NpZ25tZW50IGFuZCBpdHMgYXR0YWNobWVudHMgYXJlIHBhcnNlZCBuZXh0XHJcbiAgICBjb25zdCBiID0gXyQoXyQodC5wYXJlbnROb2RlKS5wYXJlbnROb2RlKSBhcyBIVE1MRWxlbWVudFxyXG4gICAgY29uc3QgZGl2cyA9IFsuLi5iLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdkaXYnKV0uc3BsaWNlKDAsIDIpXHJcblxyXG4gICAgY29uc3QgYXAgPSBhdHRhY2htZW50aWZ5KGIpIC8vIFNlcGFyYXRlcyBhdHRhY2htZW50cyBmcm9tIHRoZSBib2R5XHJcblxyXG4gICAgLy8gVGhlIGxhc3QgUmVwbGFjZSByZW1vdmVzIGxlYWRpbmcgYW5kIHRyYWlsaW5nIG5ld2xpbmVzXHJcbiAgICBjb25zdCBhc3NpZ25tZW50Qm9keSA9IHVybGlmeShiLmlubmVySFRNTClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9eKD86XFxzKjxiclxccypcXC8/PikqLywgJycpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvKD86XFxzKjxiclxccypcXC8/PikqXFxzKiQvLCAnJykudHJpbSgpXHJcblxyXG4gICAgLy8gRmluYWxseSwgd2Ugc2VwYXJhdGUgdGhlIGNsYXNzIG5hbWUgYW5kIHR5cGUgKGhvbWV3b3JrLCBjbGFzc3dvcmssIG9yIHByb2plY3RzKSBmcm9tIHRoZSB0aXRsZSBvZiB0aGUgYXNzaWdubWVudFxyXG4gICAgY29uc3QgbWF0Y2hlZFRpdGxlID0gdGl0bGUubWF0Y2goL1xcKChbXildKlxcKSopXFwpJC8pXHJcbiAgICBpZiAoKG1hdGNoZWRUaXRsZSA9PSBudWxsKSkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IHBhcnNlIGFzc2lnbm1lbnQgdGl0bGUgXFxcIiR7dGl0bGV9XFxcImApXHJcbiAgICB9XHJcbiAgICBjb25zdCBhc3NpZ25tZW50VHlwZSA9IG1hdGNoZWRUaXRsZVsxXVxyXG4gICAgY29uc3QgYXNzaWdubWVudEJhc2VUeXBlID0gcGFyc2VBc3NpZ25tZW50QmFzZVR5cGUoY2EudGl0bGUuc3Vic3RyaW5nKDAsIGNhLnRpdGxlLmluZGV4T2YoJ1xcbicpKSlcclxuICAgIGxldCBhc3NpZ25tZW50Q2xhc3NJbmRleCA9IG51bGxcclxuICAgIGRhdGEuY2xhc3Nlcy5zb21lKChjLCBwb3MpID0+IHtcclxuICAgICAgICBpZiAodGl0bGUuaW5kZXhPZihjKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgYXNzaWdubWVudENsYXNzSW5kZXggPSBwb3NcclxuICAgICAgICAgICAgdGl0bGUgPSB0aXRsZS5yZXBsYWNlKGMsICcnKVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgIH0pXHJcblxyXG4gICAgaWYgKGFzc2lnbm1lbnRDbGFzc0luZGV4ID09PSBudWxsIHx8IGFzc2lnbm1lbnRDbGFzc0luZGV4ID09PSAtMSkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGZpbmQgY2xhc3MgaW4gdGl0bGUgJHt0aXRsZX0gKGNsYXNzZXMgYXJlICR7ZGF0YS5jbGFzc2VzfWApXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgYXNzaWdubWVudFRpdGxlID0gdGl0bGUuc3Vic3RyaW5nKHRpdGxlLmluZGV4T2YoJzogJykgKyAyKS5yZXBsYWNlKC9cXChbXlxcKFxcKV0qXFwpJC8sICcnKS50cmltKClcclxuXHJcbiAgICAvLyBUbyBtYWtlIHN1cmUgdGhlcmUgYXJlIG5vIHJlcGVhdHMsIHRoZSB0aXRsZSBvZiB0aGUgYXNzaWdubWVudCAob25seSBsZXR0ZXJzKSBhbmQgaXRzIHN0YXJ0ICZcclxuICAgIC8vIGVuZCBkYXRlIGFyZSBjb21iaW5lZCB0byBnaXZlIGl0IGEgdW5pcXVlIGlkZW50aWZpZXIuXHJcbiAgICBjb25zdCBhc3NpZ25tZW50SWQgPSBhc3NpZ25tZW50VGl0bGUucmVwbGFjZSgvW15cXHddKi9nLCAnJykgKyAoYXNzaWdubWVudFN0YXJ0ICsgYXNzaWdubWVudEVuZClcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHN0YXJ0OiBhc3NpZ25tZW50U3RhcnQsXHJcbiAgICAgICAgZW5kOiBhc3NpZ25tZW50RW5kLFxyXG4gICAgICAgIGF0dGFjaG1lbnRzOiBhcCxcclxuICAgICAgICBib2R5OiBhc3NpZ25tZW50Qm9keSxcclxuICAgICAgICB0eXBlOiBhc3NpZ25tZW50VHlwZSxcclxuICAgICAgICBiYXNlVHlwZTogYXNzaWdubWVudEJhc2VUeXBlLFxyXG4gICAgICAgIGNsYXNzOiBhc3NpZ25tZW50Q2xhc3NJbmRleCxcclxuICAgICAgICB0aXRsZTogYXNzaWdubWVudFRpdGxlLFxyXG4gICAgICAgIGlkOiBhc3NpZ25tZW50SWRcclxuICAgIH1cclxufVxyXG5cclxuLy8gVGhlIGZ1bmN0aW9uIGJlbG93IHdpbGwgcGFyc2UgdGhlIGRhdGEgZ2l2ZW4gYnkgUENSIGFuZCBjb252ZXJ0IGl0IGludG8gYW4gb2JqZWN0LiBJZiB5b3Ugb3BlbiB1cFxyXG4vLyB0aGUgZGV2ZWxvcGVyIGNvbnNvbGUgb24gQ2hlY2tQQ1IgYW5kIHR5cGUgaW4gYGRhdGFgLCB5b3UgY2FuIHNlZSB0aGUgYXJyYXkgY29udGFpbmluZyBhbGwgb2ZcclxuLy8geW91ciBhc3NpZ25tZW50cy5cclxuZnVuY3Rpb24gcGFyc2UoZG9jOiBIVE1MRG9jdW1lbnQpOiB2b2lkIHtcclxuICAgIGNvbnNvbGUudGltZSgnSGFuZGxpbmcgZGF0YScpIC8vIFRvIHRpbWUgaG93IGxvbmcgaXQgdGFrZXMgdG8gcGFyc2UgdGhlIGFzc2lnbm1lbnRzXHJcbiAgICBjb25zdCBoYW5kbGVkRGF0YVNob3J0OiBzdHJpbmdbXSA9IFtdIC8vIEFycmF5IHVzZWQgdG8gbWFrZSBzdXJlIHdlIGRvblwidCBwYXJzZSB0aGUgc2FtZSBhc3NpZ25tZW50IHR3aWNlLlxyXG4gICAgY29uc3QgZGF0YTogSUFwcGxpY2F0aW9uRGF0YSA9IHtcclxuICAgICAgICBjbGFzc2VzOiBbXSxcclxuICAgICAgICBhc3NpZ25tZW50czogW10sXHJcbiAgICAgICAgbW9udGhWaWV3OiAoXyQoZG9jLnF1ZXJ5U2VsZWN0b3IoJy5yc0hlYWRlck1vbnRoJykpLnBhcmVudE5vZGUgYXMgSFRNTEVsZW1lbnQpLmNsYXNzTGlzdC5jb250YWlucygncnNTZWxlY3RlZCcpXHJcbiAgICB9IC8vIFJlc2V0IHRoZSBhcnJheSBpbiB3aGljaCBhbGwgb2YgeW91ciBhc3NpZ25tZW50cyBhcmUgc3RvcmVkIGluLlxyXG4gICAgc2V0RGF0YShkYXRhKVxyXG5cclxuICAgIGRvYy5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dDpub3QoW3R5cGU9XCJzdWJtaXRcIl0pJykuZm9yRWFjaCgoZSkgPT4ge1xyXG4gICAgICAgIHZpZXdEYXRhWyhlIGFzIEhUTUxJbnB1dEVsZW1lbnQpLm5hbWVdID0gKGUgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWUgfHwgJydcclxuICAgIH0pXHJcblxyXG4gICAgLy8gTm93LCB0aGUgY2xhc3NlcyB5b3UgdGFrZSBhcmUgcGFyc2VkICh0aGVzZSBhcmUgdGhlIGNoZWNrYm94ZXMgeW91IHNlZSB1cCB0b3Agd2hlbiBsb29raW5nIGF0IFBDUikuXHJcbiAgICBjb25zdCBjbGFzc2VzID0gZmluZElkKGRvYywgJ3RhYmxlJywgJ2NiQ2xhc3NlcycpLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdsYWJlbCcpXHJcbiAgICBjbGFzc2VzLmZvckVhY2goKGMpID0+IHtcclxuICAgICAgICBkYXRhLmNsYXNzZXMucHVzaChjLmlubmVySFRNTClcclxuICAgIH0pXHJcblxyXG4gICAgY29uc3QgYXNzaWdubWVudHMgPSBkb2MuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgncnNBcHQgcnNBcHRTaW1wbGUnKVxyXG4gICAgQXJyYXkucHJvdG90eXBlLmZvckVhY2guY2FsbChhc3NpZ25tZW50cywgKGFzc2lnbm1lbnRFbDogSFRNTEVsZW1lbnQpID0+IHtcclxuICAgICAgICBjb25zdCBhc3NpZ25tZW50ID0gcGFyc2VBc3NpZ25tZW50KGFzc2lnbm1lbnRFbClcclxuICAgICAgICBpZiAoaGFuZGxlZERhdGFTaG9ydC5pbmRleE9mKGFzc2lnbm1lbnQuaWQpID09PSAtMSkgeyAvLyBNYWtlIHN1cmUgd2UgaGF2ZW4ndCBhbHJlYWR5IHBhcnNlZCB0aGUgYXNzaWdubWVudFxyXG4gICAgICAgICAgICBoYW5kbGVkRGF0YVNob3J0LnB1c2goYXNzaWdubWVudC5pZClcclxuICAgICAgICAgICAgZGF0YS5hc3NpZ25tZW50cy5wdXNoKGFzc2lnbm1lbnQpXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuXHJcbiAgICBjb25zb2xlLnRpbWVFbmQoJ0hhbmRsaW5nIGRhdGEnKVxyXG5cclxuICAgIC8vIE5vdyBhbGxvdyB0aGUgdmlldyB0byBiZSBzd2l0Y2hlZFxyXG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdsb2FkZWQnKVxyXG5cclxuICAgIGRpc3BsYXkoKSAvLyBEaXNwbGF5IHRoZSBkYXRhXHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnZGF0YScsIEpTT04uc3RyaW5naWZ5KGdldERhdGEoKSkpIC8vIFN0b3JlIGZvciBvZmZsaW5lIHVzZVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXJsRm9yQXR0YWNobWVudChzZWFyY2g6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gQVRUQUNITUVOVFNfVVJMICsgc2VhcmNoXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRBdHRhY2htZW50TWltZVR5cGUoc2VhcmNoOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZz4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICBjb25zdCByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKVxyXG4gICAgICAgIHJlcS5vcGVuKCdIRUFEJywgdXJsRm9yQXR0YWNobWVudChzZWFyY2gpKVxyXG4gICAgICAgIHJlcS5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChyZXEuc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHR5cGUgPSByZXEuZ2V0UmVzcG9uc2VIZWFkZXIoJ0NvbnRlbnQtVHlwZScpXHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUodHlwZSlcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcignQ29udGVudCB0eXBlIGlzIG51bGwnKSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXEuc2VuZCgpXHJcbiAgICB9KVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY2xhc3NCeUlkKGlkOiBudW1iZXJ8bnVsbHx1bmRlZmluZWQpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIChpZCA/IGdldENsYXNzZXMoKVtpZF0gOiBudWxsKSB8fCAnVW5rbm93biBjbGFzcydcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHN3aXRjaFZpZXdzKCk6IHZvaWQge1xyXG4gICAgaWYgKE9iamVjdC5rZXlzKHZpZXdEYXRhKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgZWxlbUJ5SWQoJ3NpZGVCYWNrZ3JvdW5kJykuY2xpY2soKVxyXG4gICAgICAgIHZpZXdEYXRhLl9fRVZFTlRUQVJHRVQgPSAnY3RsMDAkY3RsMDAkYmFzZUNvbnRlbnQkYmFzZUNvbnRlbnQkZmxhc2hUb3AkY3RsMDAkUmFkU2NoZWR1bGVyMSdcclxuICAgICAgICB2aWV3RGF0YS5fX0VWRU5UQVJHVU1FTlQgPSBKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgICAgIENvbW1hbmQ6IGBTd2l0Y2hUbyR7ZG9jdW1lbnQuYm9keS5nZXRBdHRyaWJ1dGUoJ2RhdGEtcGNydmlldycpID09PSAnbW9udGgnID8gJ1dlZWsnIDogJ01vbnRoJ31WaWV3YFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgdmlld0RhdGEuY3RsMDBfY3RsMDBfYmFzZUNvbnRlbnRfYmFzZUNvbnRlbnRfZmxhc2hUb3BfY3RsMDBfUmFkU2NoZWR1bGVyMV9DbGllbnRTdGF0ZSA9XHJcbiAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHtzY3JvbGxUb3A6IDAsIHNjcm9sbExlZnQ6IDAsIGlzRGlydHk6IGZhbHNlfSlcclxuICAgICAgICB2aWV3RGF0YS5jdGwwMF9jdGwwMF9SYWRTY3JpcHRNYW5hZ2VyMV9UU00gPSAnOztTeXN0ZW0uV2ViLkV4dGVuc2lvbnMsIFZlcnNpb249NC4wLjAuMCwgQ3VsdHVyZT1uZXV0cmFsLCAnICtcclxuICAgICAgICAgICAgJ1B1YmxpY0tleVRva2VuPTMxYmYzODU2YWQzNjRlMzU6ZW4tVVM6ZDI4NTY4ZDMtZTUzZS00NzA2LTkyOGYtMzc2NTkxMmI2NmNhOmVhNTk3ZDRiOmIyNTM3OGQyJ1xyXG4gICAgICAgIGNvbnN0IHBvc3RBcnJheTogc3RyaW5nW10gPSBbXSAvLyBBcnJheSBvZiBkYXRhIHRvIHBvc3RcclxuICAgICAgICBPYmplY3QuZW50cmllcyh2aWV3RGF0YSkuZm9yRWFjaCgoW2gsIHZdKSA9PiB7XHJcbiAgICAgICAgICAgIHBvc3RBcnJheS5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChoKSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudCh2KSlcclxuICAgICAgICB9KVxyXG4gICAgICAgIGZldGNoKHRydWUsIHBvc3RBcnJheS5qb2luKCcmJykpXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBsb2dvdXQoKTogdm9pZCB7XHJcbiAgICBpZiAoT2JqZWN0LmtleXModmlld0RhdGEpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBkZWxldGVDb29raWUoJ3VzZXJQYXNzJylcclxuICAgICAgICBlbGVtQnlJZCgnc2lkZUJhY2tncm91bmQnKS5jbGljaygpXHJcbiAgICAgICAgdmlld0RhdGEuX19FVkVOVFRBUkdFVCA9ICdjdGwwMCRjdGwwMCRiYXNlQ29udGVudCRMb2dvdXRDb250cm9sMSRMb2dpblN0YXR1czEkY3RsMDAnXHJcbiAgICAgICAgdmlld0RhdGEuX19FVkVOVEFSR1VNRU5UID0gJydcclxuICAgICAgICB2aWV3RGF0YS5jdGwwMF9jdGwwMF9iYXNlQ29udGVudF9iYXNlQ29udGVudF9mbGFzaFRvcF9jdGwwMF9SYWRTY2hlZHVsZXIxX0NsaWVudFN0YXRlID1cclxuICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoe3Njcm9sbFRvcDogMCwgc2Nyb2xsTGVmdDogMCwgaXNEaXJ0eTogZmFsc2V9KVxyXG4gICAgICAgIGNvbnN0IHBvc3RBcnJheTogc3RyaW5nW10gPSBbXSAvLyBBcnJheSBvZiBkYXRhIHRvIHBvc3RcclxuICAgICAgICBPYmplY3QuZW50cmllcyh2aWV3RGF0YSkuZm9yRWFjaCgoW2gsIHZdKSA9PiB7XHJcbiAgICAgICAgICAgIHBvc3RBcnJheS5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChoKSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudCh2KSlcclxuICAgICAgICB9KVxyXG4gICAgICAgIGZldGNoKHRydWUsIHBvc3RBcnJheS5qb2luKCcmJykpXHJcbiAgICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBhZGRBY3Rpdml0eUVsZW1lbnQsIGNyZWF0ZUFjdGl2aXR5IH0gZnJvbSAnLi4vY29tcG9uZW50cy9hY3Rpdml0eSdcclxuaW1wb3J0IHsgSUFzc2lnbm1lbnQgfSBmcm9tICcuLi9wY3InXHJcbmltcG9ydCB7IGxvY2FsU3RvcmFnZVJlYWQsIGxvY2FsU3RvcmFnZVdyaXRlIH0gZnJvbSAnLi4vdXRpbCdcclxuXHJcbmV4cG9ydCB0eXBlIEFjdGl2aXR5VHlwZSA9ICdkZWxldGUnIHwgJ2VkaXQnIHwgJ2FkZCdcclxuZXhwb3J0IHR5cGUgQWN0aXZpdHlJdGVtID0gW0FjdGl2aXR5VHlwZSwgSUFzc2lnbm1lbnQsIG51bWJlciwgc3RyaW5nIHwgdW5kZWZpbmVkXVxyXG5cclxuY29uc3QgQUNUSVZJVFlfU1RPUkFHRV9OQU1FID0gJ2FjdGl2aXR5J1xyXG5cclxubGV0IGFjdGl2aXR5OiBBY3Rpdml0eUl0ZW1bXSA9IGxvY2FsU3RvcmFnZVJlYWQoQUNUSVZJVFlfU1RPUkFHRV9OQU1FKSB8fCBbXVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFkZEFjdGl2aXR5KHR5cGU6IEFjdGl2aXR5VHlwZSwgYXNzaWdubWVudDogSUFzc2lnbm1lbnQsIGRhdGU6IERhdGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdBY3Rpdml0eTogYm9vbGVhbiwgY2xhc3NOYW1lPzogc3RyaW5nICk6IHZvaWQge1xyXG4gICAgaWYgKG5ld0FjdGl2aXR5KSBhY3Rpdml0eS5wdXNoKFt0eXBlLCBhc3NpZ25tZW50LCBEYXRlLm5vdygpLCBjbGFzc05hbWVdKVxyXG4gICAgY29uc3QgZWwgPSBjcmVhdGVBY3Rpdml0eSh0eXBlLCBhc3NpZ25tZW50LCBkYXRlLCBjbGFzc05hbWUpXHJcbiAgICBhZGRBY3Rpdml0eUVsZW1lbnQoZWwpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlQWN0aXZpdHkoKTogdm9pZCB7XHJcbiAgICBhY3Rpdml0eSA9IGFjdGl2aXR5LnNsaWNlKGFjdGl2aXR5Lmxlbmd0aCAtIDEyOCwgYWN0aXZpdHkubGVuZ3RoKVxyXG4gICAgbG9jYWxTdG9yYWdlV3JpdGUoQUNUSVZJVFlfU1RPUkFHRV9OQU1FLCBhY3Rpdml0eSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlY2VudEFjdGl2aXR5KCk6IEFjdGl2aXR5SXRlbVtdIHtcclxuICAgIHJldHVybiBhY3Rpdml0eS5zbGljZShhY3Rpdml0eS5sZW5ndGggLSAzMiwgYWN0aXZpdHkubGVuZ3RoKVxyXG59XHJcbiIsImltcG9ydCB7IGVsZW1CeUlkLCBsb2NhbFN0b3JhZ2VSZWFkLCBsb2NhbFN0b3JhZ2VXcml0ZSB9IGZyb20gJy4uL3V0aWwnXHJcblxyXG5jb25zdCBBVEhFTkFfU1RPUkFHRV9OQU1FID0gJ2F0aGVuYURhdGEnXHJcblxyXG5pbnRlcmZhY2UgSVJhd0F0aGVuYURhdGEge1xyXG4gICAgcmVzcG9uc2VfY29kZTogMjAwXHJcbiAgICBib2R5OiB7XHJcbiAgICAgICAgY291cnNlczoge1xyXG4gICAgICAgICAgICBjb3Vyc2VzOiBJUmF3Q291cnNlW11cclxuICAgICAgICAgICAgc2VjdGlvbnM6IElSYXdTZWN0aW9uW11cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwZXJtaXNzaW9uczogYW55XHJcbn1cclxuXHJcbmludGVyZmFjZSBJUmF3Q291cnNlIHtcclxuICAgIG5pZDogbnVtYmVyXHJcbiAgICBjb3Vyc2VfdGl0bGU6IHN0cmluZ1xyXG4gICAgLy8gVGhlcmUncyBhIGJ1bmNoIG1vcmUgdGhhdCBJJ3ZlIG9taXR0ZWRcclxufVxyXG5cclxuaW50ZXJmYWNlIElSYXdTZWN0aW9uIHtcclxuICAgIGNvdXJzZV9uaWQ6IG51bWJlclxyXG4gICAgbGluazogc3RyaW5nXHJcbiAgICBsb2dvOiBzdHJpbmdcclxuICAgIHNlY3Rpb25fdGl0bGU6IHN0cmluZ1xyXG4gICAgLy8gVGhlcmUncyBhIGJ1bmNoIG1vcmUgdGhhdCBJJ3ZlIG9taXR0ZWRcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJQXRoZW5hRGF0YUl0ZW0ge1xyXG4gICAgbGluazogc3RyaW5nXHJcbiAgICBsb2dvOiBzdHJpbmdcclxuICAgIHBlcmlvZDogc3RyaW5nXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUF0aGVuYURhdGEge1xyXG4gICAgW2Nsczogc3RyaW5nXTogSUF0aGVuYURhdGFJdGVtXHJcbn1cclxuXHJcbmxldCBhdGhlbmFEYXRhOiBJQXRoZW5hRGF0YXxudWxsID0gbG9jYWxTdG9yYWdlUmVhZChBVEhFTkFfU1RPUkFHRV9OQU1FKVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldEF0aGVuYURhdGEoKTogSUF0aGVuYURhdGF8bnVsbCB7XHJcbiAgICByZXR1cm4gYXRoZW5hRGF0YVxyXG59XHJcblxyXG5mdW5jdGlvbiBmb3JtYXRMb2dvKGxvZ286IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gbG9nby5zdWJzdHIoMCwgbG9nby5pbmRleE9mKCdcIiBhbHQ9XCInKSlcclxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKCc8ZGl2IGNsYXNzPVwicHJvZmlsZS1waWN0dXJlXCI+PGltZyBzcmM9XCInLCAnJylcclxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKCd0aW55JywgJ3JlZycpXHJcbn1cclxuXHJcbi8vIE5vdywgdGhlcmUncyB0aGUgc2Nob29sb2d5L2F0aGVuYSBpbnRlZ3JhdGlvbiBzdHVmZi4gRmlyc3QsIHdlIG5lZWQgdG8gY2hlY2sgaWYgaXQncyBiZWVuIG1vcmVcclxuLy8gdGhhbiBhIGRheS4gVGhlcmUncyBubyBwb2ludCBjb25zdGFudGx5IHJldHJpZXZpbmcgY2xhc3NlcyBmcm9tIEF0aGVuYTsgdGhleSBkb250J3QgY2hhbmdlIHRoYXRcclxuLy8gbXVjaC5cclxuXHJcbi8vIFRoZW4sIG9uY2UgdGhlIHZhcmlhYmxlIGZvciB0aGUgbGFzdCBkYXRlIGlzIGluaXRpYWxpemVkLCBpdCdzIHRpbWUgdG8gZ2V0IHRoZSBjbGFzc2VzIGZyb21cclxuLy8gYXRoZW5hLiBMdWNraWx5LCB0aGVyZSdzIHRoaXMgZmlsZSBhdCAvaWFwaS9jb3Vyc2UvYWN0aXZlIC0gYW5kIGl0J3MgaW4gSlNPTiEgTGlmZSBjYW4ndCBiZSBhbnlcclxuLy8gYmV0dGVyISBTZXJpb3VzbHkhIEl0J3MganVzdCB0b28gYmFkIHRoZSBsb2dpbiBwYWdlIGlzbid0IGluIEpTT04uXHJcbmZ1bmN0aW9uIHBhcnNlQXRoZW5hRGF0YShkYXQ6IHN0cmluZyk6IElBdGhlbmFEYXRhfG51bGwge1xyXG4gICAgaWYgKGRhdCA9PT0gJycpIHJldHVybiBudWxsXHJcbiAgICBjb25zdCBkID0gSlNPTi5wYXJzZShkYXQpIGFzIElSYXdBdGhlbmFEYXRhXHJcbiAgICBjb25zdCBhdGhlbmFEYXRhMjogSUF0aGVuYURhdGEgPSB7fVxyXG4gICAgY29uc3QgYWxsQ291cnNlRGV0YWlsczogeyBbbmlkOiBudW1iZXJdOiBJUmF3U2VjdGlvbiB9ID0ge31cclxuICAgIGQuYm9keS5jb3Vyc2VzLnNlY3Rpb25zLmZvckVhY2goKHNlY3Rpb24pID0+IHtcclxuICAgICAgICBhbGxDb3Vyc2VEZXRhaWxzW3NlY3Rpb24uY291cnNlX25pZF0gPSBzZWN0aW9uXHJcbiAgICB9KVxyXG4gICAgZC5ib2R5LmNvdXJzZXMuY291cnNlcy5yZXZlcnNlKCkuZm9yRWFjaCgoY291cnNlKSA9PiB7XHJcbiAgICAgICAgY29uc3QgY291cnNlRGV0YWlscyA9IGFsbENvdXJzZURldGFpbHNbY291cnNlLm5pZF1cclxuICAgICAgICBhdGhlbmFEYXRhMltjb3Vyc2UuY291cnNlX3RpdGxlXSA9IHtcclxuICAgICAgICAgICAgbGluazogYGh0dHBzOi8vYXRoZW5hLmhhcmtlci5vcmcke2NvdXJzZURldGFpbHMubGlua31gLFxyXG4gICAgICAgICAgICBsb2dvOiBmb3JtYXRMb2dvKGNvdXJzZURldGFpbHMubG9nbyksXHJcbiAgICAgICAgICAgIHBlcmlvZDogY291cnNlRGV0YWlscy5zZWN0aW9uX3RpdGxlXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICAgIHJldHVybiBhdGhlbmFEYXRhMlxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlQXRoZW5hRGF0YShkYXRhOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgYXRoZW5hRGF0YSA9IHBhcnNlQXRoZW5hRGF0YShkYXRhKVxyXG4gICAgICAgIGxvY2FsU3RvcmFnZVdyaXRlKEFUSEVOQV9TVE9SQUdFX05BTUUsIGRhdGEpXHJcbiAgICAgICAgZWxlbUJ5SWQoJ2F0aGVuYURhdGFFcnJvcicpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcclxuICAgICAgICBlbGVtQnlJZCgnYXRoZW5hRGF0YVJlZnJlc2gnKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgIGVsZW1CeUlkKCdhdGhlbmFEYXRhRXJyb3InKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xyXG4gICAgICAgIGVsZW1CeUlkKCdhdGhlbmFEYXRhUmVmcmVzaCcpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcclxuICAgICAgICBlbGVtQnlJZCgnYXRoZW5hRGF0YUVycm9yJykuaW5uZXJIVE1MID0gZS5tZXNzYWdlXHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgZ2V0RGF0YSwgSUFwcGxpY2F0aW9uRGF0YSwgSUFzc2lnbm1lbnQgfSBmcm9tICcuLi9wY3InXHJcbmltcG9ydCB7IGxvY2FsU3RvcmFnZVJlYWQsIGxvY2FsU3RvcmFnZVdyaXRlIH0gZnJvbSAnLi4vdXRpbCdcclxuXHJcbmNvbnN0IENVU1RPTV9TVE9SQUdFX05BTUUgPSAnZXh0cmEnXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElDdXN0b21Bc3NpZ25tZW50IHtcclxuICAgIGJvZHk6IHN0cmluZ1xyXG4gICAgZG9uZTogYm9vbGVhblxyXG4gICAgc3RhcnQ6IG51bWJlclxyXG4gICAgY2xhc3M6IHN0cmluZ3xudWxsXHJcbiAgICBlbmQ6IG51bWJlcnwnRm9yZXZlcidcclxufVxyXG5cclxuY29uc3QgZXh0cmE6IElDdXN0b21Bc3NpZ25tZW50W10gPSBsb2NhbFN0b3JhZ2VSZWFkKENVU1RPTV9TVE9SQUdFX05BTUUpIHx8IHt9XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0RXh0cmEoKTogSUN1c3RvbUFzc2lnbm1lbnRbXSB7XHJcbiAgICByZXR1cm4gZXh0cmFcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVFeHRyYSgpOiB2b2lkIHtcclxuICAgIGxvY2FsU3RvcmFnZVdyaXRlKENVU1RPTV9TVE9SQUdFX05BTUUsIGV4dHJhKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYWRkVG9FeHRyYShjdXN0b206IElDdXN0b21Bc3NpZ25tZW50KTogdm9pZCB7XHJcbiAgICBleHRyYS5wdXNoKGN1c3RvbSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUZyb21FeHRyYShjdXN0b206IElDdXN0b21Bc3NpZ25tZW50KTogdm9pZCB7XHJcbiAgICBpZiAoIWV4dHJhLmluY2x1ZGVzKGN1c3RvbSkpIHRocm93IG5ldyBFcnJvcignQ2Fubm90IHJlbW92ZSBjdXN0b20gYXNzaWdubWVudCB0aGF0IGRvZXMgbm90IGV4aXN0JylcclxuICAgIGV4dHJhLnNwbGljZShleHRyYS5pbmRleE9mKGN1c3RvbSksIDEpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBleHRyYVRvVGFzayhjdXN0b206IElDdXN0b21Bc3NpZ25tZW50LCBkYXRhOiBJQXBwbGljYXRpb25EYXRhKTogSUFzc2lnbm1lbnQge1xyXG4gICAgbGV0IGNsczogbnVtYmVyfG51bGwgPSBudWxsXHJcbiAgICBjb25zdCBjbGFzc05hbWUgPSBjdXN0b20uY2xhc3NcclxuICAgIGlmIChjbGFzc05hbWUgIT0gbnVsbCkge1xyXG4gICAgICAgIGNscyA9IGRhdGEuY2xhc3Nlcy5maW5kSW5kZXgoKGMpID0+IGMudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhjbGFzc05hbWUpKVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdGl0bGU6ICdUYXNrJyxcclxuICAgICAgICBiYXNlVHlwZTogJ3Rhc2snLFxyXG4gICAgICAgIHR5cGU6ICd0YXNrJyxcclxuICAgICAgICBhdHRhY2htZW50czogW10sXHJcbiAgICAgICAgc3RhcnQ6IGN1c3RvbS5zdGFydCxcclxuICAgICAgICBlbmQ6IGN1c3RvbS5lbmQgfHwgJ0ZvcmV2ZXInLFxyXG4gICAgICAgIGJvZHk6IGN1c3RvbS5ib2R5LFxyXG4gICAgICAgIGlkOiBgdGFzayR7Y3VzdG9tLmJvZHkucmVwbGFjZSgvW15cXHddKi9nLCAnJyl9JHtjdXN0b20uc3RhcnR9JHtjdXN0b20uZW5kfSR7Y3VzdG9tLmNsYXNzfWAsXHJcbiAgICAgICAgY2xhc3M6IGNscyA9PT0gLTEgPyBudWxsIDogY2xzXHJcbiAgICB9XHJcbn1cclxuXHJcbmludGVyZmFjZSBJUGFyc2VSZXN1bHQge1xyXG4gICAgY2xzPzogc3RyaW5nXHJcbiAgICBkdWU/OiBzdHJpbmdcclxuICAgIHN0Pzogc3RyaW5nXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUN1c3RvbVRhc2sodGV4dDogc3RyaW5nLCByZXN1bHQ6IElQYXJzZVJlc3VsdCA9IHt9KTogSVBhcnNlUmVzdWx0IHtcclxuICAgIGNvbnN0IHBhcnNlZCA9IHRleHQubWF0Y2goLyguKikgKGZvcnxieXxkdWV8YXNzaWduZWR8c3RhcnRpbmd8ZW5kaW5nfGJlZ2lubmluZykgKC4qKS8pXHJcbiAgICBpZiAocGFyc2VkID09IG51bGwpIHJldHVybiByZXN1bHRcclxuXHJcbiAgICBzd2l0Y2ggKHBhcnNlZFsyXSkge1xyXG4gICAgICAgIGNhc2UgJ2Zvcic6IHJlc3VsdC5jbHMgPSBwYXJzZWRbM107IGJyZWFrXHJcbiAgICAgICAgY2FzZSAnYnknOiBjYXNlICdkdWUnOiBjYXNlICdlbmRpbmcnOiByZXN1bHQuZHVlID0gcGFyc2VkWzNdOyBicmVha1xyXG4gICAgICAgIGNhc2UgJ2Fzc2lnbmVkJzogY2FzZSAnc3RhcnRpbmcnOiBjYXNlICdiZWdpbm5pbmcnOiByZXN1bHQuc3QgPSBwYXJzZWRbM107IGJyZWFrXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHBhcnNlQ3VzdG9tVGFzayhwYXJzZWRbMV0sIHJlc3VsdClcclxufVxyXG4iLCJpbXBvcnQgeyBsb2NhbFN0b3JhZ2VSZWFkLCBsb2NhbFN0b3JhZ2VXcml0ZSB9IGZyb20gJy4uL3V0aWwnXHJcblxyXG5jb25zdCBET05FX1NUT1JBR0VfTkFNRSA9ICdkb25lJ1xyXG5cclxuY29uc3QgZG9uZTogc3RyaW5nW10gPSBsb2NhbFN0b3JhZ2VSZWFkKERPTkVfU1RPUkFHRV9OQU1FKSB8fCBbXVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUZyb21Eb25lKGlkOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgIGNvbnN0IGluZGV4ID0gZG9uZS5pbmRleE9mKGlkKVxyXG4gICAgaWYgKGluZGV4ID49IDApIGRvbmUuc3BsaWNlKGluZGV4LCAxKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYWRkVG9Eb25lKGlkOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgIGRvbmUucHVzaChpZClcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVEb25lKCk6IHZvaWQge1xyXG4gICAgbG9jYWxTdG9yYWdlV3JpdGUoRE9ORV9TVE9SQUdFX05BTUUsIGRvbmUpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBhc3NpZ25tZW50SW5Eb25lKGlkOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgIHJldHVybiBkb25lLmluY2x1ZGVzKGlkKVxyXG59XHJcbiIsImltcG9ydCB7IGxvY2FsU3RvcmFnZVJlYWQsIGxvY2FsU3RvcmFnZVdyaXRlIH0gZnJvbSAnLi4vdXRpbCdcclxuXHJcbmNvbnN0IE1PRElGSUVEX1NUT1JBR0VfTkFNRSA9ICdtb2RpZmllZCdcclxuXHJcbmludGVyZmFjZSBJTW9kaWZpZWRCb2RpZXMge1xyXG4gICAgW2lkOiBzdHJpbmddOiBzdHJpbmdcclxufVxyXG5cclxuY29uc3QgbW9kaWZpZWQ6IElNb2RpZmllZEJvZGllcyA9IGxvY2FsU3RvcmFnZVJlYWQoTU9ESUZJRURfU1RPUkFHRV9OQU1FKSB8fCB7fVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUZyb21Nb2RpZmllZChpZDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICBkZWxldGUgbW9kaWZpZWRbaWRdXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlTW9kaWZpZWQoKTogdm9pZCB7XHJcbiAgICBsb2NhbFN0b3JhZ2VXcml0ZShNT0RJRklFRF9TVE9SQUdFX05BTUUsIG1vZGlmaWVkKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYXNzaWdubWVudEluTW9kaWZpZWQoaWQ6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIG1vZGlmaWVkLmhhc093blByb3BlcnR5KGlkKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbW9kaWZpZWRCb2R5KGlkOiBzdHJpbmcpOiBzdHJpbmd8dW5kZWZpbmVkIHtcclxuICAgIHJldHVybiBtb2RpZmllZFtpZF1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNldE1vZGlmaWVkKGlkOiBzdHJpbmcsIGJvZHk6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgbW9kaWZpZWRbaWRdID0gYm9keVxyXG59XHJcbiIsImltcG9ydCB7IGZyb21EYXRlTnVtLCB0b0RhdGVOdW0gfSBmcm9tICcuL2RhdGVzJ1xyXG5cclxuLyoqXHJcbiAqIEZvcmNlcyBhIGxheW91dCBvbiBhbiBlbGVtZW50XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZm9yY2VMYXlvdXQoZWw6IEhUTUxFbGVtZW50KTogdm9pZCB7XHJcbiAgICAvLyBUaGlzIGludm9sdmVzIGEgbGl0dGxlIHRyaWNrZXJ5IGluIHRoYXQgYnkgcmVxdWVzdGluZyB0aGUgY29tcHV0ZWQgaGVpZ2h0IG9mIHRoZSBlbGVtZW50IHRoZVxyXG4gICAgLy8gYnJvd3NlciBpcyBmb3JjZWQgdG8gZG8gYSBmdWxsIGxheW91dFxyXG5cclxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtZXhwcmVzc2lvblxyXG4gICAgZWwub2Zmc2V0SGVpZ2h0XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZXR1cm4gYSBzdHJpbmcgd2l0aCB0aGUgZmlyc3QgbGV0dGVyIGNhcGl0YWxpemVkXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gY2FwaXRhbGl6ZVN0cmluZyhzdHI6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gc3RyLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc3RyLnN1YnN0cigxKVxyXG59XHJcblxyXG4vKipcclxuICogUmV0dXJucyBhbiBYTUxIdHRwUmVxdWVzdCB3aXRoIHRoZSBzcGVjaWZpZWQgdXJsLCByZXNwb25zZSB0eXBlLCBoZWFkZXJzLCBhbmQgZGF0YVxyXG4gKi9cclxuZnVuY3Rpb24gY29uc3RydWN0WE1MSHR0cFJlcXVlc3QodXJsOiBzdHJpbmcsIHJlc3BUeXBlPzogWE1MSHR0cFJlcXVlc3RSZXNwb25zZVR5cGV8bnVsbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVycz86IHtbbmFtZTogc3RyaW5nXTogc3RyaW5nfXxudWxsLCBkYXRhPzogc3RyaW5nfG51bGwpOiBYTUxIdHRwUmVxdWVzdCB7XHJcbiAgICBjb25zdCByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKVxyXG5cclxuICAgIC8vIElmIFBPU1QgZGF0YSBpcyBwcm92aWRlZCBzZW5kIGEgUE9TVCByZXF1ZXN0LCBvdGhlcndpc2Ugc2VuZCBhIEdFVCByZXF1ZXN0XHJcbiAgICByZXEub3BlbigoZGF0YSA/ICdQT1NUJyA6ICdHRVQnKSwgdXJsLCB0cnVlKVxyXG5cclxuICAgIGlmIChyZXNwVHlwZSkgcmVxLnJlc3BvbnNlVHlwZSA9IHJlc3BUeXBlXHJcblxyXG4gICAgaWYgKGhlYWRlcnMpIHtcclxuICAgICAgICBPYmplY3Qua2V5cyhoZWFkZXJzKS5mb3JFYWNoKChoZWFkZXIpID0+IHtcclxuICAgICAgICAgICAgcmVxLnNldFJlcXVlc3RIZWFkZXIoaGVhZGVyLCBoZWFkZXJzW2hlYWRlcl0pXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICAvLyBJZiBkYXRhIGlzIHVuZGVmaW5lZCBkZWZhdWx0IHRvIHRoZSBub3JtYWwgcmVxLnNlbmQoKSwgb3RoZXJ3aXNlIHBhc3MgdGhlIGRhdGEgaW5cclxuICAgIHJlcS5zZW5kKGRhdGEpXHJcbiAgICByZXR1cm4gcmVxXHJcbn1cclxuXHJcbi8qKiBTZW5kcyBhIHJlcXVlc3QgdG8gYSBzZXJ2ZXIgYW5kIHJldHVybnMgYSBQcm9taXNlLlxyXG4gKiBAcGFyYW0gdXJsIHRoZSB1cmwgdG8gcmV0cmlldmVcclxuICogQHBhcmFtIHJlc3BUeXBlIHRoZSB0eXBlIG9mIHJlc3BvbnNlIHRoYXQgc2hvdWxkIGJlIHJlY2VpdmVkXHJcbiAqIEBwYXJhbSBoZWFkZXJzIHRoZSBoZWFkZXJzIHRoYXQgd2lsbCBiZSBzZW50IHRvIHRoZSBzZXJ2ZXJcclxuICogQHBhcmFtIGRhdGEgdGhlIGRhdGEgdGhhdCB3aWxsIGJlIHNlbnQgdG8gdGhlIHNlcnZlciAob25seSBmb3IgUE9TVCByZXF1ZXN0cylcclxuICogQHBhcmFtIHByb2dyZXNzRWxlbWVudCBhbiBvcHRpb25hbCBlbGVtZW50IGZvciB0aGUgcHJvZ3Jlc3MgYmFyIHVzZWQgdG8gZGlzcGxheSB0aGUgc3RhdHVzIG9mIHRoZSByZXF1ZXN0XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gc2VuZCh1cmw6IHN0cmluZywgcmVzcFR5cGU/OiBYTUxIdHRwUmVxdWVzdFJlc3BvbnNlVHlwZXxudWxsLCBoZWFkZXJzPzoge1tuYW1lOiBzdHJpbmddOiBzdHJpbmd9fG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgIGRhdGE/OiBzdHJpbmd8bnVsbCwgcHJvZ3Jlc3M/OiBIVE1MRWxlbWVudHxudWxsKTogUHJvbWlzZTxYTUxIdHRwUmVxdWVzdD4ge1xyXG5cclxuICAgIGNvbnN0IHJlcSA9IGNvbnN0cnVjdFhNTEh0dHBSZXF1ZXN0KHVybCwgcmVzcFR5cGUsIGhlYWRlcnMsIGRhdGEpXHJcblxyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHJcbiAgICAgICAgY29uc3QgcHJvZ3Jlc3NJbm5lciA9IHByb2dyZXNzID8gcHJvZ3Jlc3MucXVlcnlTZWxlY3RvcignZGl2JykgOiBudWxsXHJcbiAgICAgICAgaWYgKHByb2dyZXNzICYmIHByb2dyZXNzSW5uZXIpIHtcclxuICAgICAgICAgICAgZm9yY2VMYXlvdXQocHJvZ3Jlc3NJbm5lcikgLy8gV2FpdCBmb3IgaXQgdG8gcmVuZGVyXHJcbiAgICAgICAgICAgIHByb2dyZXNzLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpIC8vIERpc3BsYXkgdGhlIHByb2dyZXNzIGJhclxyXG4gICAgICAgICAgICBpZiAocHJvZ3Jlc3NJbm5lci5jbGFzc0xpc3QuY29udGFpbnMoJ2RldGVybWluYXRlJykpIHtcclxuICAgICAgICAgICAgICAgIHByb2dyZXNzSW5uZXIuY2xhc3NMaXN0LnJlbW92ZSgnZGV0ZXJtaW5hdGUnKVxyXG4gICAgICAgICAgICAgICAgcHJvZ3Jlc3NJbm5lci5jbGFzc0xpc3QuYWRkKCdpbmRldGVybWluYXRlJylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gU29tZXRpbWVzIHRoZSBicm93c2VyIHdvbid0IGdpdmUgdGhlIHRvdGFsIGJ5dGVzIGluIHRoZSByZXNwb25zZSwgc28gdXNlIHBhc3QgcmVzdWx0cyBvclxyXG4gICAgICAgIC8vIGEgZGVmYXVsdCBvZiAxNzAsMDAwIGJ5dGVzIGlmIHRoZSBicm93c2VyIGRvZXNuJ3QgcHJvdmlkZSB0aGUgbnVtYmVyXHJcbiAgICAgICAgY29uc3QgbG9hZCA9IE51bWJlcihsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnbG9hZCcpKSB8fCAxNzAwMDBcclxuICAgICAgICBsZXQgY29tcHV0ZWRMb2FkID0gMFxyXG5cclxuICAgICAgICByZXEuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIChldnQpID0+IHtcclxuICAgICAgICAgICAgLy8gQ2FjaGUgdGhlIG51bWJlciBvZiBieXRlcyBsb2FkZWQgc28gaXQgY2FuIGJlIHVzZWQgZm9yIGJldHRlciBlc3RpbWF0ZXMgbGF0ZXIgb25cclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2xvYWQnLCBTdHJpbmcoY29tcHV0ZWRMb2FkKSlcclxuICAgICAgICAgICAgaWYgKHByb2dyZXNzKSBwcm9ncmVzcy5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gICAgICAgICAgICAvLyBSZXNvbHZlIHdpdGggdGhlIHJlcXVlc3RcclxuICAgICAgICAgICAgaWYgKHJlcS5zdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShyZXEpXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoRXJyb3IocmVxLnN0YXR1c1RleHQpKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgcmVxLmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAocHJvZ3Jlc3MpIHByb2dyZXNzLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgICAgICAgICAgIHJlamVjdChFcnJvcignTmV0d29yayBFcnJvcicpKVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIGlmIChwcm9ncmVzcyAmJiBwcm9ncmVzc0lubmVyKSB7XHJcbiAgICAgICAgICAgIHJlcS5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIChldnQpID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIFVwZGF0ZSB0aGUgcHJvZ3Jlc3MgYmFyXHJcbiAgICAgICAgICAgICAgICBpZiAocHJvZ3Jlc3NJbm5lci5jbGFzc0xpc3QuY29udGFpbnMoJ2luZGV0ZXJtaW5hdGUnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb2dyZXNzSW5uZXIuY2xhc3NMaXN0LnJlbW92ZSgnaW5kZXRlcm1pbmF0ZScpXHJcbiAgICAgICAgICAgICAgICAgICAgcHJvZ3Jlc3NJbm5lci5jbGFzc0xpc3QuYWRkKCdkZXRlcm1pbmF0ZScpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb21wdXRlZExvYWQgPSBldnQubG9hZGVkXHJcbiAgICAgICAgICAgICAgICBwcm9ncmVzc0lubmVyLnN0eWxlLndpZHRoID0gKCgxMDAgKiBldnQubG9hZGVkKSAvIChldnQubGVuZ3RoQ29tcHV0YWJsZSA/IGV2dC50b3RhbCA6IGxvYWQpKSArICclJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBUaGUgZXF1aXZhbGVudCBvZiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCBidXQgdGhyb3dzIGFuIGVycm9yIGlmIHRoZSBlbGVtZW50IGlzIG5vdCBkZWZpbmVkXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZWxlbUJ5SWQoaWQ6IHN0cmluZyk6IEhUTUxFbGVtZW50IHtcclxuICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpXHJcbiAgICBpZiAoZWwgPT0gbnVsbCkgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCBlbGVtZW50IHdpdGggaWQgJHtpZH1gKVxyXG4gICAgcmV0dXJuIGVsXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBIGxpdHRsZSBoZWxwZXIgZnVuY3Rpb24gdG8gc2ltcGxpZnkgdGhlIGNyZWF0aW9uIG9mIEhUTUwgZWxlbWVudHNcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBlbGVtZW50KHRhZzogc3RyaW5nLCBjbHM6IHN0cmluZ3xzdHJpbmdbXSwgaHRtbD86IHN0cmluZ3xudWxsLCBpZD86IHN0cmluZ3xudWxsKTogSFRNTEVsZW1lbnQge1xyXG4gICAgY29uc3QgZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnKVxyXG5cclxuICAgIGlmICh0eXBlb2YgY2xzID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgIGUuY2xhc3NMaXN0LmFkZChjbHMpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNscy5mb3JFYWNoKChjKSA9PiBlLmNsYXNzTGlzdC5hZGQoYykpXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGh0bWwpIGUuaW5uZXJIVE1MID0gaHRtbFxyXG4gICAgaWYgKGlkKSBlLnNldEF0dHJpYnV0ZSgnaWQnLCBpZClcclxuXHJcbiAgICByZXR1cm4gZVxyXG59XHJcblxyXG4vKipcclxuICogVGhyb3dzIGFuIGVycm9yIGlmIHRoZSBzdXBwbGllZCBhcmd1bWVudCBpcyBudWxsLCBvdGhlcndpc2UgcmV0dXJucyB0aGUgYXJndW1lbnRcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBfJDxUPihhcmc6IFR8bnVsbCk6IFQge1xyXG4gICAgaWYgKGFyZyA9PSBudWxsKSB0aHJvdyBuZXcgRXJyb3IoJ0V4cGVjdGVkIGFyZ3VtZW50IHRvIGJlIG5vbi1udWxsJylcclxuICAgIHJldHVybiBhcmdcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF8kaChhcmc6IE5vZGV8RXZlbnRUYXJnZXR8bnVsbCk6IEhUTUxFbGVtZW50IHtcclxuICAgIGlmIChhcmcgPT0gbnVsbCkgdGhyb3cgbmV3IEVycm9yKCdFeHBlY3RlZCBub2RlIHRvIGJlIG5vbi1udWxsJylcclxuICAgIHJldHVybiBhcmcgYXMgSFRNTEVsZW1lbnRcclxufVxyXG5cclxuLy8gQmVjYXVzZSBzb21lIGxvY2FsU3RvcmFnZSBlbnRyaWVzIGNhbiBiZWNvbWUgY29ycnVwdGVkIGR1ZSB0byBlcnJvciBzaWRlIGVmZmVjdHMsIHRoZSBiZWxvd1xyXG4vLyBtZXRob2QgdHJpZXMgdG8gcmVhZCBhIHZhbHVlIGZyb20gbG9jYWxTdG9yYWdlIGFuZCBoYW5kbGVzIGVycm9ycy5cclxuZXhwb3J0IGZ1bmN0aW9uIGxvY2FsU3RvcmFnZVJlYWQobmFtZTogc3RyaW5nKTogYW55XHJcbmV4cG9ydCBmdW5jdGlvbiBsb2NhbFN0b3JhZ2VSZWFkPFI+KG5hbWU6IHN0cmluZywgZGVmYXVsdFZhbDogKCkgPT4gUik6IFJcclxuZXhwb3J0IGZ1bmN0aW9uIGxvY2FsU3RvcmFnZVJlYWQ8VD4obmFtZTogc3RyaW5nLCBkZWZhdWx0VmFsOiBUKTogVFxyXG5leHBvcnQgZnVuY3Rpb24gbG9jYWxTdG9yYWdlUmVhZChuYW1lOiBzdHJpbmcsIGRlZmF1bHRWYWw/OiBhbnkpOiBhbnkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2VbbmFtZV0pXHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBkZWZhdWx0VmFsID09PSAnZnVuY3Rpb24nID8gZGVmYXVsdFZhbCgpIDogZGVmYXVsdFZhbFxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbG9jYWxTdG9yYWdlV3JpdGUobmFtZTogc3RyaW5nLCBpdGVtOiBhbnkpOiB2b2lkIHtcclxuICAgIGxvY2FsU3RvcmFnZVtuYW1lXSA9IEpTT04uc3RyaW5naWZ5KGl0ZW0pXHJcbn1cclxuXHJcbmludGVyZmFjZSBJZGxlRGVhZGxpbmUge1xyXG4gICAgZGlkVGltZW91dDogYm9vbGVhblxyXG4gICAgdGltZVJlbWFpbmluZzogKCkgPT4gbnVtYmVyXHJcbn1cclxuXHJcbi8vIEJlY2F1c2UgdGhlIHJlcXVlc3RJZGxlQ2FsbGJhY2sgZnVuY3Rpb24gaXMgdmVyeSBuZXcgKGFzIG9mIHdyaXRpbmcgb25seSB3b3JrcyB3aXRoIENocm9tZVxyXG4vLyB2ZXJzaW9uIDQ3KSwgdGhlIGJlbG93IGZ1bmN0aW9uIHBvbHlmaWxscyB0aGF0IG1ldGhvZC5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlcXVlc3RJZGxlQ2FsbGJhY2soY2I6IChkZWFkbGluZTogSWRsZURlYWRsaW5lKSA9PiB2b2lkLCBvcHRzOiB7IHRpbWVvdXQ6IG51bWJlcn0pOiBudW1iZXIge1xyXG4gICAgaWYgKCdyZXF1ZXN0SWRsZUNhbGxiYWNrJyBpbiB3aW5kb3cpIHtcclxuICAgICAgICByZXR1cm4gKHdpbmRvdyBhcyBhbnkpLnJlcXVlc3RJZGxlQ2FsbGJhY2soY2IsIG9wdHMpXHJcbiAgICB9XHJcbiAgICBjb25zdCBzdGFydCA9IERhdGUubm93KClcclxuXHJcbiAgICByZXR1cm4gc2V0VGltZW91dCgoKSA9PiBjYih7XHJcbiAgICAgICAgZGlkVGltZW91dDogZmFsc2UsXHJcbiAgICAgICAgdGltZVJlbWFpbmluZygpOiBudW1iZXIge1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5tYXgoMCwgNTAgLSAoRGF0ZS5ub3coKSAtIHN0YXJ0KSlcclxuICAgICAgICB9XHJcbiAgICB9KSwgMSlcclxufVxyXG5cclxuLyoqXHJcbiAqIERldGVybWluZSBpZiB0aGUgdHdvIGRhdGVzIGhhdmUgdGhlIHNhbWUgeWVhciwgbW9udGgsIGFuZCBkYXlcclxuICovXHJcbmZ1bmN0aW9uIGRhdGVzRXF1YWwoYTogRGF0ZSwgYjogRGF0ZSk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRvRGF0ZU51bShhKSA9PT0gdG9EYXRlTnVtKGIpXHJcbn1cclxuXHJcbmNvbnN0IERBVEVfUkVMQVRJVkVOQU1FUzoge1tuYW1lOiBzdHJpbmddOiBudW1iZXJ9ID0ge1xyXG4gICAgJ1RvbW9ycm93JzogMSxcclxuICAgICdUb2RheSc6IDAsXHJcbiAgICAnWWVzdGVyZGF5JzogLTEsXHJcbiAgICAnMiBkYXlzIGFnbyc6IC0yXHJcbn1cclxuY29uc3QgV0VFS0RBWVMgPSBbJ1N1bmRheScsICdNb25kYXknLCAnVHVlc2RheScsICdXZWRuZXNkYXknLCAnVGh1cnNkYXknLCAnRnJpZGF5JywgJ1NhdHVyZGF5J11cclxuY29uc3QgRlVMTE1PTlRIUyA9IFsnSmFudWFyeScsICdGZWJydWFyeScsICdNYXJjaCcsICdBcHJpbCcsICdNYXknLCAnSnVuZScsICdKdWx5JywgJ0F1Z3VzdCcsICdTZXB0ZW1iZXInLCAnT2N0b2JlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgJ05vdmVtYmVyJywgJ0RlY2VtYmVyJ11cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkYXRlU3RyaW5nKGRhdGU6IERhdGV8bnVtYmVyfCdGb3JldmVyJywgYWRkVGhpczogYm9vbGVhbiA9IGZhbHNlKTogc3RyaW5nIHtcclxuICAgIGlmIChkYXRlID09PSAnRm9yZXZlcicpIHJldHVybiBkYXRlXHJcbiAgICBpZiAodHlwZW9mIGRhdGUgPT09ICdudW1iZXInKSByZXR1cm4gZGF0ZVN0cmluZyhmcm9tRGF0ZU51bShkYXRlKSwgYWRkVGhpcylcclxuXHJcbiAgICBjb25zdCByZWxhdGl2ZU1hdGNoID0gT2JqZWN0LmtleXMoREFURV9SRUxBVElWRU5BTUVTKS5maW5kKChuYW1lKSA9PiB7XHJcbiAgICAgICAgY29uc3QgZGF5QXQgPSBuZXcgRGF0ZSgpXHJcbiAgICAgICAgZGF5QXQuc2V0RGF0ZShkYXlBdC5nZXREYXRlKCkgKyBEQVRFX1JFTEFUSVZFTkFNRVNbbmFtZV0pXHJcbiAgICAgICAgcmV0dXJuIGRhdGVzRXF1YWwoZGF5QXQsIGRhdGUpXHJcbiAgICB9KVxyXG4gICAgaWYgKHJlbGF0aXZlTWF0Y2gpIHJldHVybiByZWxhdGl2ZU1hdGNoXHJcblxyXG4gICAgY29uc3QgZGF5c0FoZWFkID0gKGRhdGUuZ2V0VGltZSgpIC0gRGF0ZS5ub3coKSkgLyAxMDAwIC8gMzYwMCAvIDI0XHJcblxyXG4gICAgLy8gSWYgdGhlIGRhdGUgaXMgd2l0aGluIDYgZGF5cyBvZiB0b2RheSwgb25seSBkaXNwbGF5IHRoZSBkYXkgb2YgdGhlIHdlZWtcclxuICAgIGlmICgwIDwgZGF5c0FoZWFkICYmIGRheXNBaGVhZCA8PSA2KSB7XHJcbiAgICAgICAgcmV0dXJuIChhZGRUaGlzID8gJ1RoaXMgJyA6ICcnKSArIFdFRUtEQVlTW2RhdGUuZ2V0RGF5KCldXHJcbiAgICB9XHJcbiAgICByZXR1cm4gYCR7V0VFS0RBWVNbZGF0ZS5nZXREYXkoKV19LCAke0ZVTExNT05USFNbZGF0ZS5nZXRNb250aCgpXX0gJHtkYXRlLmdldERhdGUoKX1gXHJcbn1cclxuXHJcbi8vIFRoZSBvbmUgYmVsb3cgc2Nyb2xscyBzbW9vdGhseSB0byBhIHkgcG9zaXRpb24uXHJcbmV4cG9ydCBmdW5jdGlvbiBzbW9vdGhTY3JvbGwodG86IG51bWJlcik6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICBsZXQgc3RhcnQ6IG51bWJlcnxudWxsID0gbnVsbFxyXG4gICAgICAgIGNvbnN0IGZyb20gPSBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcFxyXG4gICAgICAgIGNvbnN0IGFtb3VudCA9IHRvIC0gZnJvbVxyXG4gICAgICAgIGNvbnN0IHN0ZXAgPSAodGltZXN0YW1wOiBudW1iZXIpID0+IHtcclxuICAgICAgICAgICAgaWYgKHN0YXJ0ID09IG51bGwpIHsgc3RhcnQgPSB0aW1lc3RhbXAgfVxyXG4gICAgICAgICAgICBjb25zdCBwcm9ncmVzcyA9IHRpbWVzdGFtcCAtIHN0YXJ0XHJcbiAgICAgICAgICAgIHdpbmRvdy5zY3JvbGxUbygwLCBmcm9tICsgKGFtb3VudCAqIChwcm9ncmVzcyAvIDM1MCkpKVxyXG4gICAgICAgICAgICBpZiAocHJvZ3Jlc3MgPCAzNTApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RlcClcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIF8kKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ25hdicpKS5jbGFzc0xpc3QucmVtb3ZlKCdoZWFkcm9vbS0tdW5waW5uZWQnKVxyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0ZXApXHJcbiAgICB9KVxyXG59XHJcblxyXG4vLyBBbmQgYSBmdW5jdGlvbiB0byBhcHBseSBhbiBpbmsgZWZmZWN0XHJcbmV4cG9ydCBmdW5jdGlvbiByaXBwbGUoZWw6IEhUTUxFbGVtZW50KTogdm9pZCB7XHJcbiAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCAoZXZ0KSA9PiB7XHJcbiAgICAgICAgaWYgKGV2dC53aGljaCAhPT0gMSkgcmV0dXJuIC8vIE5vdCBsZWZ0IGJ1dHRvblxyXG4gICAgICAgIGNvbnN0IHdhdmUgPSBlbGVtZW50KCdzcGFuJywgJ3dhdmUnKVxyXG4gICAgICAgIGNvbnN0IHNpemUgPSBNYXRoLm1heChOdW1iZXIoZWwub2Zmc2V0V2lkdGgpLCBOdW1iZXIoZWwub2Zmc2V0SGVpZ2h0KSlcclxuICAgICAgICB3YXZlLnN0eWxlLndpZHRoID0gKHdhdmUuc3R5bGUuaGVpZ2h0ID0gc2l6ZSArICdweCcpXHJcblxyXG4gICAgICAgIGxldCB4ID0gZXZ0LmNsaWVudFhcclxuICAgICAgICBsZXQgeSA9IGV2dC5jbGllbnRZXHJcbiAgICAgICAgY29uc3QgcmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXHJcbiAgICAgICAgeCAtPSByZWN0LmxlZnRcclxuICAgICAgICB5IC09IHJlY3QudG9wXHJcblxyXG4gICAgICAgIHdhdmUuc3R5bGUudG9wID0gKHkgLSAoc2l6ZSAvIDIpKSArICdweCdcclxuICAgICAgICB3YXZlLnN0eWxlLmxlZnQgPSAoeCAtIChzaXplIC8gMikpICsgJ3B4J1xyXG4gICAgICAgIGVsLmFwcGVuZENoaWxkKHdhdmUpXHJcbiAgICAgICAgd2F2ZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtaG9sZCcsIFN0cmluZyhEYXRlLm5vdygpKSlcclxuICAgICAgICBmb3JjZUxheW91dCh3YXZlKVxyXG4gICAgICAgIHdhdmUuc3R5bGUudHJhbnNmb3JtID0gJ3NjYWxlKDIuNSknXHJcbiAgICB9KVxyXG4gICAgZWwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIChldnQpID0+IHtcclxuICAgICAgICBpZiAoZXZ0LndoaWNoICE9PSAxKSByZXR1cm4gLy8gT25seSBmb3IgbGVmdCBidXR0b25cclxuICAgICAgICBjb25zdCB3YXZlcyA9IGVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3dhdmUnKVxyXG4gICAgICAgIHdhdmVzLmZvckVhY2goKHdhdmUpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgZGlmZiA9IERhdGUubm93KCkgLSBOdW1iZXIod2F2ZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtaG9sZCcpKVxyXG4gICAgICAgICAgICBjb25zdCBkZWxheSA9IE1hdGgubWF4KDM1MCAtIGRpZmYsIDApXHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgKHdhdmUgYXMgSFRNTEVsZW1lbnQpLnN0eWxlLm9wYWNpdHkgPSAnMCdcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHdhdmUucmVtb3ZlKClcclxuICAgICAgICAgICAgICAgIH0sIDU1MClcclxuICAgICAgICAgICAgfSwgZGVsYXkpXHJcbiAgICAgICAgfSlcclxuICAgIH0pXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjc3NOdW1iZXIoY3NzOiBzdHJpbmd8bnVsbCk6IG51bWJlciB7XHJcbiAgICBpZiAoIWNzcykgcmV0dXJuIDBcclxuICAgIHJldHVybiBwYXJzZUludChjc3MsIDEwKVxyXG59XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=