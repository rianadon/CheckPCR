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
const assignmentColors = Object(_util__WEBPACK_IMPORTED_MODULE_12__["localStorageRead"])('assignmentColors', {
    classwork: '#689f38', homework: '#2196f3', longterm: '#f57c00', test: '#f44336'
});
const classColors = Object(_util__WEBPACK_IMPORTED_MODULE_12__["localStorageRead"])('classColors', () => {
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
                const bg = tinycolor(sp.style.backgroundColor || '#000').toHexString();
                list[controlledColor] = bg;
                sp.style.backgroundColor = bg;
                const selected = sp.querySelector('.selected');
                if (selected) {
                    selected.classList.remove('selected');
                }
                sp.classList.add('selected');
                localStorage[listName] = JSON.stringify(list);
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
// Now, we load the saved assignments (if any) and fetch the current assignments from PCR.
if (Object(_util__WEBPACK_IMPORTED_MODULE_12__["localStorageRead"])('data') != null) {
    Object(_pcr__WEBPACK_IMPORTED_MODULE_8__["setData"])(Object(_util__WEBPACK_IMPORTED_MODULE_12__["localStorageRead"])('data'));
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
                       </${smallTag}>
                       <span class='title'>${assignment.title}</span>
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
    const st = Math.floor(split.start.getDate() / 1000 / 3600 / 24);
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
                    - Number(e.style.marginTop)) + 44 + 'px';
                e.setAttribute('data-top', e.style.top);
                document.body.style.overflow = 'hidden';
                const back = Object(_util__WEBPACK_IMPORTED_MODULE_9__["elemById"])('background');
                back.classList.add('active');
                back.style.display = 'block';
                e.classList.add('anim');
                Object(_util__WEBPACK_IMPORTED_MODULE_9__["forceLayout"])(e);
                e.classList.add('full');
                e.style.top = (75 - Number(e.style.marginTop)) + 'px';
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
    const initials = localStorage.username.match(/\d*(.).*?(.$)/); // Separate year from first name and initial
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
            n += 7;
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
                                    <div class='range'>${Object(_util__WEBPACK_IMPORTED_MODULE_10__["dateString"])(end, true)}</div>`, `test${s.assignment.id}`);
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
/* harmony import */ var _display__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./display */ "./src/display.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./util */ "./src/util.ts");
/* harmony import */ var _dates__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./dates */ "./src/dates.ts");
/**
 * This module contains code to both fetch and parse assignments from PCR.
 */







const PCR_URL = 'https://webappsca.pcrsoft.com';
const ASSIGNMENTS_URL = `${PCR_URL}/Clue/SC-Assignments-End-Date-Range/7536`;
const LOGIN_URL = `${PCR_URL}/Clue/SC-Student-Portal-Login-LDAP/8464?returnUrl=${encodeURIComponent(ASSIGNMENTS_URL)}`;
const ATTACHMENTS_URL = `${PCR_URL}/Clue/Common/AttachmentRender.aspx`;
const FORM_HEADER_ONLY = { 'Content-type': 'application/x-www-form-urlencoded' };
const ONE_MINUTE_MS = 60000;
const progressElement = Object(_util__WEBPACK_IMPORTED_MODULE_5__["elemById"])('progress');
const loginDialog = Object(_util__WEBPACK_IMPORTED_MODULE_5__["elemById"])('login');
const loginBackground = Object(_util__WEBPACK_IMPORTED_MODULE_5__["elemById"])('loginBackground');
const lastUpdateEl = Object(_util__WEBPACK_IMPORTED_MODULE_5__["elemById"])('lastUpdate');
const usernameEl = Object(_util__WEBPACK_IMPORTED_MODULE_5__["elemById"])('username');
const passwordEl = Object(_util__WEBPACK_IMPORTED_MODULE_5__["elemById"])('password');
const rememberCheck = Object(_util__WEBPACK_IMPORTED_MODULE_5__["elemById"])('remember');
const incorrectLoginEl = Object(_util__WEBPACK_IMPORTED_MODULE_5__["elemById"])('loginIncorrect');
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
        const resp = await Object(_util__WEBPACK_IMPORTED_MODULE_5__["send"])(ASSIGNMENTS_URL, 'document', headers, data, progressElement);
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
            lastUpdateEl.innerHTML = Object(_display__WEBPACK_IMPORTED_MODULE_4__["formatUpdate"])(t);
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
    localStorage.username = val && !submitEvt ? val[0] : usernameEl.value;
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
        const resp = await Object(_util__WEBPACK_IMPORTED_MODULE_5__["send"])(LOGIN_URL, 'document', FORM_HEADER_ONLY, postArray.join('&'), progressElement);
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
            lastUpdateEl.innerHTML = Object(_display__WEBPACK_IMPORTED_MODULE_4__["formatUpdate"])(t);
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
    const assignmentStart = Object(_dates__WEBPACK_IMPORTED_MODULE_6__["toDateNum"])(Date.parse(range[0]));
    const assignmentEnd = (range[1] != null) ? Object(_dates__WEBPACK_IMPORTED_MODULE_6__["toDateNum"])(Date.parse(range[1])) : assignmentStart;
    // Then, the name of the assignment is parsed
    const t = findId(ca, 'span', 'lblTitle');
    let title = t.innerHTML;
    // The actual body of the assignment and its attachments are parsed next
    const b = Object(_util__WEBPACK_IMPORTED_MODULE_5__["_$"])(Object(_util__WEBPACK_IMPORTED_MODULE_5__["_$"])(t.parentNode).parentNode);
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
        monthView: Object(_util__WEBPACK_IMPORTED_MODULE_5__["_$"])(doc.querySelector('.rsHeaderMonth')).parentNode.classList.contains('rsSelected')
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
    Object(_display__WEBPACK_IMPORTED_MODULE_4__["display"])(); // Display the data
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
        Object(_util__WEBPACK_IMPORTED_MODULE_5__["elemById"])('sideBackground').click();
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
        Object(_util__WEBPACK_IMPORTED_MODULE_5__["elemById"])('sideBackground').click();
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
    if (custom.class != null) {
        cls = data.classes.map((c) => c.toLowerCase()).indexOf(custom.class);
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
/*! exports provided: forceLayout, capitalizeString, send, elemById, element, _$, _$h, localStorageRead, localStorageWrite, requestIdleCallback, dateString, smoothScroll, ripple */
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
    return a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
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
    const relativeMatch = Object.keys(DATE_RELATIVENAMES).find((name) => {
        const dayAt = new Date();
        dayAt.setDate(dayAt.getDate() + DATE_RELATIVENAMES[name]);
        return datesEqual(dayAt, date);
    });
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


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50LnRzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2FjdGl2aXR5LnRzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2Fzc2lnbm1lbnQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvYXZhdGFyLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2NhbGVuZGFyLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2N1c3RvbUFkZGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2Vycm9yRGlzcGxheS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9yZXNpemVyLnRzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL3NuYWNrYmFyLnRzIiwid2VicGFjazovLy8uL3NyYy9jb29raWVzLnRzIiwid2VicGFjazovLy8uL3NyYy9kYXRlcy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZGlzcGxheS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbmF2aWdhdGlvbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGNyLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW5zL2FjdGl2aXR5LnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW5zL2F0aGVuYS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2lucy9jdXN0b21Bc3NpZ25tZW50cy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2lucy9kb25lLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW5zL21vZGlmaWVkQXNzaWdubWVudHMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7OztBQUdBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNuRXFGO0FBRTlFLE1BQU0sT0FBTyxHQUFHLFFBQVE7QUFFL0IsTUFBTSxXQUFXLEdBQUcsdUVBQXVFO0FBQzNGLE1BQU0sVUFBVSxHQUFHLENBQUMsUUFBUSxDQUFDLFFBQVEsS0FBSyxtQkFBbUIsQ0FBQyxDQUFDO0lBQzNELHFFQUFxRSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUM7QUFDMUYsTUFBTSxRQUFRLEdBQUcsK0RBQStEO0FBRWhGLDZCQUE2QixPQUFlO0lBQ3hDLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNuQyxPQUFPLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO1NBQ3ZELE9BQU8sQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDO1NBQ3RCLE9BQU8sQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDO0FBQ3pDLENBQUM7QUFFRCxtSEFBbUg7QUFDNUcsS0FBSztJQUNSLElBQUk7UUFDQSxNQUFNLElBQUksR0FBRyxNQUFNLGtEQUFJLENBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQztRQUM1QyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRTtRQUNsQyxPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLElBQUksT0FBTyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixFQUFFLENBQUM7UUFDdEcsc0RBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQztRQUNwQyxJQUFJLE9BQU8sS0FBSyxDQUFDLEVBQUU7WUFDZixzREFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7Z0JBQ3BELElBQUksUUFBUSxDQUFDLFFBQVEsS0FBSyxtQkFBbUIsRUFBRTtvQkFDM0Msc0RBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztvQkFDN0MsVUFBVSxDQUFDLEdBQUcsRUFBRTt3QkFDWixzREFBUSxDQUFDLGtCQUFrQixDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNO29CQUN2RCxDQUFDLEVBQUUsR0FBRyxDQUFDO2lCQUNWO3FCQUFNO29CQUNILE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFO2lCQUMzQjtZQUNMLENBQUMsQ0FBQztZQUNGLE1BQU0sS0FBSyxHQUFHLE1BQU0sa0RBQUksQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDO1lBQzVDLE1BQU0sRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNO1lBQzFDLE1BQU0sS0FBSyxHQUFHLE1BQU0sa0RBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLEtBQUssbUJBQW1CLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsZUFBZSxHQUFHLEVBQUUsQ0FBQyxFQUFFLE1BQU0sQ0FBQztZQUMxRyxzREFBUSxDQUFDLG1CQUFtQixDQUFDLENBQUMsU0FBUyxHQUFHLE9BQU87WUFDakQsc0RBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDO1lBQzFDLHNEQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxTQUFTLEdBQUcsbUJBQW1CLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUM7WUFDbEYsc0RBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsT0FBTztZQUNwRCxzREFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDO1NBQzdDO0tBQ0o7SUFBQyxPQUFPLEdBQUcsRUFBRTtRQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUMsNkNBQTZDLEVBQUUsR0FBRyxDQUFDO0tBQ2xFO0FBQ0wsQ0FBQztBQUVELElBQUksT0FBTyxHQUFnQixJQUFJO0FBQy9CLElBQUksVUFBVSxHQUFnQixJQUFJO0FBRTNCLEtBQUs7SUFDUixJQUFJO1FBQ0EsTUFBTSxJQUFJLEdBQUcsTUFBTSxrREFBSSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUM7UUFDekMsSUFBSSxJQUFJLEdBQUcsOERBQWdCLENBQUMsWUFBWSxDQUFDO1FBQ3pDLFVBQVUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPO1FBRTdDLElBQUksSUFBSSxJQUFJLElBQUksRUFBRTtZQUNkLElBQUksR0FBRyxVQUFVO1lBQ2pCLCtEQUFpQixDQUFDLFlBQVksRUFBRSxVQUFVLENBQUM7U0FDOUM7UUFFRCxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsT0FBTztRQUVwRCxJQUFJLElBQUksS0FBSyxVQUFVLEVBQUU7WUFDckIsT0FBTyxFQUFFO1NBQ1o7S0FDSjtJQUFDLE9BQU8sR0FBRyxFQUFFO1FBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBQyw2Q0FBNkMsRUFBRSxHQUFHLENBQUM7S0FDbEU7QUFDTCxDQUFDO0FBRU0sS0FBSyxrQkFBa0IsTUFBbUI7SUFDN0MsSUFBSSxDQUFDLE9BQU8sRUFBRTtRQUNWLElBQUksTUFBTTtZQUFFLE1BQU0sRUFBRTtRQUNwQixPQUFNO0tBQ1Q7SUFDRCxJQUFJO1FBQ0EsTUFBTSxJQUFJLEdBQUcsTUFBTSxrREFBSSxDQUFDLE9BQU8sQ0FBQztRQUNoQyxZQUFZLENBQUMsVUFBVSxHQUFHLFVBQVU7UUFDcEMsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7WUFDN0Msc0RBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxXQUFXLENBQUMscURBQU8sQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3pFLENBQUMsQ0FBQztRQUNGLHNEQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE9BQU87UUFDbEQsc0RBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQztLQUMzQztJQUFDLE9BQU8sR0FBRyxFQUFFO1FBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBQyw2Q0FBNkMsRUFBRSxHQUFHLENBQUM7UUFDL0QsSUFBSSxNQUFNO1lBQUUsTUFBTSxFQUFFO0tBQ3ZCO0FBQ0wsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDekYrRDtBQUNYO0FBQ0g7QUFDTTtBQUN5QjtBQUN2QztBQUNrQjtBQUVDO0FBQzZCO0FBQzFCO0FBQ2I7QUFDaUM7QUFFakM7QUFFbkQsd0NBQXdDO0FBQ3hDLFFBQVEsQ0FBQyxTQUFTLENBQUMsT0FBTyxHQUFHLGNBQWMsQ0FBQyxTQUFTLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDO0FBRXhGLG9GQUFvRjtBQUNwRixJQUFJLENBQUMsK0RBQWdCLENBQUMsV0FBVyxDQUFDLEVBQUU7SUFDaEMsZ0VBQWlCLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQztJQUNwQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxjQUFjO0NBQ3hDO0FBRUQsTUFBTSxXQUFXLEdBQUcsaURBQUUsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3JELE1BQU0sY0FBYyxHQUFHLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FDNUMsMkZBQTJGO0lBQzNGLHdGQUF3RixDQUMzRDtBQUVqQyxxQkFBcUI7QUFDckIsRUFBRTtBQUVGLCtEQUErRDtBQUUvRCxrQkFBa0I7QUFDbEIsa0JBQWtCO0FBQ2xCLGtCQUFrQjtBQUNsQixFQUFFO0FBQ0YsdURBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtJQUNqRCxHQUFHLENBQUMsY0FBYyxFQUFFO0lBQ3BCLG9EQUFPLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztBQUN2QixDQUFDLENBQUM7QUFFRixvREFBb0Q7QUFDcEQsdURBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsZ0RBQVcsQ0FBQztBQUU5RCx3Q0FBd0M7QUFDeEMsdURBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsMkNBQU0sQ0FBQztBQUVwRCwrQ0FBK0M7QUFDL0MsdURBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsa0VBQVcsQ0FBQztBQUU3RCx1Q0FBdUM7QUFDdkMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUUsRUFBRTtJQUNqRSxHQUFHLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUU7UUFDcEMsTUFBTSxLQUFLLEdBQUcsK0RBQWdCLENBQUMsV0FBVyxDQUFDO1FBQzNDLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDVixRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDO1lBQ3RDLDBEQUFXLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztTQUMzQjtRQUNELGdFQUFpQixDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUM7UUFDbkMsUUFBUSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN6RCxJQUFJLFFBQVEsS0FBSyxDQUFDLEVBQUU7WUFDaEIsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxnRUFBWSxDQUFDO1lBQy9DLElBQUksS0FBSyxFQUFFO2dCQUNYLElBQUksS0FBSyxHQUFnQixJQUFJO2dCQUM3QixtRkFBbUY7Z0JBQ25GLHNEQUFzRDtnQkFDdEQsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7b0JBQ3pELENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDNUUsSUFBSSxPQUFPLEdBQUcsQ0FBQztnQkFDZixNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFO29CQUN4QixJQUFJLE1BQU0sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxFQUFFO3dCQUFFLE9BQU8sR0FBRyxLQUFLLEdBQUcsQ0FBQztxQkFBRTtnQkFDdEQsQ0FBQyxDQUFDO2dCQUNGLE1BQU0sV0FBVyxHQUFHLGdGQUFvQixFQUFFO2dCQUMxQyxNQUFNLGFBQWEsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDN0QsTUFBTSxJQUFJLEdBQUcsQ0FBQyxTQUFpQixFQUFFLEVBQUU7b0JBQy9CLElBQUksQ0FBQyxPQUFPO3dCQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsMEJBQTBCLENBQUM7b0JBQ3pELElBQUksS0FBSyxJQUFJLElBQUksRUFBRTt3QkFBRSxLQUFLLEdBQUcsU0FBUztxQkFBRTtvQkFDeEMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDLEVBQUUsRUFBRTt3QkFDbEMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxHQUFHLE9BQU87d0JBQ3ZCLElBQUksQ0FBQyxHQUFHLE9BQU8sRUFBRTs0QkFDakIsYUFBYSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7eUJBQ3JCO3dCQUNELFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJO3dCQUNoRCxVQUFVLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUc7d0JBQ3JELFVBQVUsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRzt3QkFDdEUsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxZQUFZLEdBQUcsRUFBRTtvQkFDdEQsQ0FBQyxDQUFDO29CQUNGLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRyxFQUFFO3dCQUMzQixPQUFPLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUM7cUJBQzVDO2dCQUNMLENBQUM7Z0JBQ0QsTUFBTSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQztnQkFDbEMsVUFBVSxDQUFDLEdBQUcsRUFBRTtvQkFDWixJQUFJLENBQUMsT0FBTzt3QkFBRSxNQUFNLElBQUksS0FBSyxDQUFDLDBCQUEwQixDQUFDO29CQUN6RCxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUMsRUFBRSxFQUFFO3dCQUNsQyxNQUFNLEdBQUcsR0FBRyxDQUFDLEdBQUcsT0FBTzt3QkFDdkIsSUFBSSxDQUFDLEdBQUcsT0FBTyxFQUFFOzRCQUNqQixhQUFhLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQzt5QkFDckI7d0JBQ0QsVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUk7d0JBQ2hELGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxVQUFVLENBQUMsWUFBWSxHQUFHLEVBQUU7b0JBQ3RELENBQUMsQ0FBQztnQkFDTixDQUFDLEVBQUUsR0FBRyxDQUFDO2FBQ1I7aUJBQU07Z0JBQ0wsa0VBQU0sRUFBRTthQUNUO1NBQ0Y7YUFBTTtZQUNILE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLDBEQUFTLEVBQUUsQ0FBQztZQUMvQixXQUFXLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQztZQUM3QyxVQUFVLENBQUMsR0FBRyxFQUFFO2dCQUNaLFdBQVcsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLG9CQUFvQixDQUFDO2dCQUNsRCxXQUFXLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQztnQkFDaEQsV0FBVyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUM7Z0JBQzdDLGtFQUFtQixDQUFDLEdBQUcsRUFBRTtvQkFDckIsc0VBQWtCLEVBQUU7b0JBQ3BCLGFBQWEsRUFBRTtvQkFDZix3REFBTyxFQUFFO2dCQUNiLENBQUMsRUFBRSxFQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUMsQ0FBQztZQUN2QixDQUFDLEVBQUUsR0FBRyxDQUFDO1lBQ1AsTUFBTSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsRUFBRSxnRUFBWSxDQUFDO1lBQ2xELFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxVQUFVLEVBQUUsRUFBRTtnQkFDM0QsVUFBMEIsQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLE1BQU07WUFDbEQsQ0FBQyxDQUFDO1NBQ0w7UUFDRCxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ1YsMERBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO1lBQzFCLFVBQVUsQ0FBQyxHQUFHLEVBQUU7Z0JBQ1osUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQztZQUM3QyxDQUFDLEVBQUUsR0FBRyxDQUFDO1NBQ1I7SUFDSCxDQUFDLENBQUM7QUFDSixDQUFDLENBQUM7QUFFRiw4Q0FBOEM7QUFDOUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLGNBQWMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUUsRUFBRTtJQUNoRSxHQUFHLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUU7UUFDbEMsdURBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNoRSxDQUFDLENBQUM7QUFDTixDQUFDLENBQUM7QUFFRix1Q0FBdUM7QUFDdkMsSUFBSSxZQUFZLENBQUMsSUFBSSxJQUFJLElBQUksRUFBRTtJQUM3QixRQUFRLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsWUFBWSxDQUFDLElBQUksQ0FBQztJQUMxRCxJQUFJLFlBQVksQ0FBQyxJQUFJLEtBQUssR0FBRyxFQUFFO1FBQzdCLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsZ0VBQVksQ0FBQztLQUNoRDtDQUNGO0FBRUQsaUdBQWlHO0FBQ2pHLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRTtJQUM3QixLQUFLLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUU7UUFDckMsa0RBQUcsQ0FBQyxrREFBRyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQztJQUM3RSxDQUFDLENBQUM7SUFDRixLQUFLLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUU7UUFDcEMsa0RBQUcsQ0FBQyxrREFBRyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQztJQUM3RSxDQUFDLENBQUM7SUFDRixLQUFLLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUU7UUFDbkMsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDMUIsa0RBQUcsQ0FBQyxrREFBRyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztTQUMvRTtJQUNMLENBQUMsQ0FBQztBQUNOLENBQUMsQ0FBQztBQUVGLDJFQUEyRTtBQUMzRSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUU7SUFDekMsSUFBSSxHQUFHLENBQUMsS0FBSyxLQUFLLEVBQUUsRUFBRSxFQUFFLHFCQUFxQjtRQUMzQyxJQUFJLFFBQVEsQ0FBQyxzQkFBc0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQUUsT0FBTywwRUFBVyxDQUFDLElBQUksS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUM7U0FBRTtLQUMvRztBQUNILENBQUMsQ0FBQyxDQUFDO0FBRUgsNkRBQTZEO0FBQzdELENBQUMsR0FBRyxFQUFFO0lBQ0YsTUFBTSxTQUFTLEdBQUcsSUFBSSxJQUFJLEVBQUU7SUFDNUIsSUFBSSxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxJQUFJLFNBQVM7UUFDdEQsU0FBUyxJQUFJLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUU7UUFDeEQsT0FBTyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDO0tBQy9DO0FBQ0wsQ0FBQyxDQUFDLEVBQUU7QUFFSiwrRkFBK0Y7QUFDL0YsbUJBQW1CLElBQVksRUFBRSxFQUFVLEVBQUUsQ0FBYztJQUN2RCxxREFBTSxDQUFDLHVEQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdEIsdURBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsR0FBRyxFQUFFO1FBQzVDLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7UUFDbEMsa0VBQU0sRUFBRTtRQUNSLGdFQUFpQixDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDM0QsSUFBSSxDQUFDLElBQUksSUFBSTtZQUFFLENBQUMsRUFBRTtJQUN0QixDQUFDLENBQUM7SUFDRixJQUFJLCtEQUFnQixDQUFDLEVBQUUsQ0FBQztRQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7QUFDN0QsQ0FBQztBQUVELHlGQUF5RjtBQUN6RixTQUFTLENBQUMsVUFBVSxFQUFFLFVBQVUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUMsMERBQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztBQUVqRSwwREFBMEQ7QUFDMUQsSUFBSSxZQUFZLENBQUMsUUFBUSxJQUFJLElBQUksRUFBRTtJQUFFLFlBQVksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7Q0FBRTtBQUNuRixTQUFTLENBQUMsWUFBWSxFQUFFLFVBQVUsQ0FBQztBQUVuQyxrREFBa0Q7QUFDbEQsU0FBUyxDQUFDLGFBQWEsRUFBRSxNQUFNLENBQUM7QUFFaEMsd0VBQXdFO0FBQ3hFLGtHQUFrRztBQUNsRyx3Q0FBd0M7QUFDeEMsZ0RBQWdEO0FBQ2hELHdEQUF3RDtBQUN4RCw4Q0FBOEM7QUFDOUMsU0FBUztBQUNULElBQUk7QUFDSixtQkFBbUIsRUFBZSxFQUFFLFNBQWMsRUFBRSxPQUFZO0lBQzVELE9BQU8sQ0FBQyxLQUFLLENBQUMsMEJBQTBCLENBQUM7SUFDekMsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztBQUNoQyxDQUFDO0FBRUQsa0dBQWtHO0FBQ2xHLHVEQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtJQUNsRCxNQUFNLEVBQUUsR0FBRyx1REFBUSxDQUFDLGNBQWMsQ0FBQztJQUNuQyxNQUFNLEVBQUUsR0FBRyx1REFBUSxDQUFDLGFBQWEsQ0FBQztJQUNsQyxNQUFNLEVBQUUsR0FBRyx1REFBUSxDQUFDLGNBQWMsQ0FBQztJQUNuQywyRUFBdUIsRUFBRTtJQUN6Qix3REFBTyxFQUFFO0lBQ1QsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsY0FBYztJQUNqQyxPQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUM7UUFDbEIsU0FBUyxDQUFDLEVBQUUsRUFBRTtZQUNaLEVBQUMsU0FBUyxFQUFFLGdCQUFnQixFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUM7WUFDekMsRUFBQyxPQUFPLEVBQUUsQ0FBQyxFQUFDO1lBQ1osRUFBQyxTQUFTLEVBQUUsbUJBQW1CLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBQztTQUM3QyxFQUFFLEVBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFDLENBQUM7UUFDdkMsU0FBUyxDQUFDLEVBQUUsRUFBRTtZQUNaLEVBQUMsU0FBUyxFQUFFLGdCQUFnQixFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUM7WUFDekMsRUFBQyxPQUFPLEVBQUUsQ0FBQyxFQUFDO1lBQ1osRUFBQyxTQUFTLEVBQUUsbUJBQW1CLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBQztTQUM3QyxFQUFFLEVBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFDLENBQUM7S0FDeEMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUU7UUFDWCxFQUFFLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQyxTQUFTO1FBQzNCLEVBQUUsQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDLFNBQVM7UUFDM0IsTUFBTSxTQUFTLEdBQUcsSUFBSSxJQUFJLEVBQUU7UUFDNUIsU0FBUyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxHQUFHLHFFQUFpQixFQUFFLENBQUM7UUFDaEUsRUFBRSxDQUFDLFNBQVMsR0FBRyx5REFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDO1FBQzVELE9BQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTTtJQUNsQyxDQUFDLENBQUM7QUFDSixDQUFDLENBQUM7QUFFRixzRUFBc0U7QUFDdEUsdURBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO0lBQ3BELE1BQU0sRUFBRSxHQUFHLHVEQUFRLENBQUMsY0FBYyxDQUFDO0lBQ25DLE1BQU0sRUFBRSxHQUFHLHVEQUFRLENBQUMsYUFBYSxDQUFDO0lBQ2xDLE1BQU0sRUFBRSxHQUFHLHVEQUFRLENBQUMsY0FBYyxDQUFDO0lBQ25DLDJFQUF1QixFQUFFO0lBQ3pCLHdEQUFPLEVBQUU7SUFDVCxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxjQUFjO0lBQ2pDLE9BQU8sT0FBTyxDQUFDLElBQUksQ0FBQztRQUNsQixTQUFTLENBQUMsRUFBRSxFQUFFO1lBQ1osRUFBQyxTQUFTLEVBQUUsbUJBQW1CLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBQztZQUM1QyxFQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUM7WUFDWixFQUFDLFNBQVMsRUFBRSxnQkFBZ0IsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFDO1NBQzFDLEVBQUUsRUFBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUMsQ0FBQztRQUN2QyxTQUFTLENBQUMsRUFBRSxFQUFFO1lBQ1osRUFBQyxTQUFTLEVBQUUsbUJBQW1CLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBQztZQUM1QyxFQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUM7WUFDWixFQUFDLFNBQVMsRUFBRSxnQkFBZ0IsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFDO1NBQzFDLEVBQUUsRUFBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUMsQ0FBQztLQUN4QyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRTtRQUNYLEVBQUUsQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDLFNBQVM7UUFDM0IsRUFBRSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUMsU0FBUztRQUMzQixNQUFNLFNBQVMsR0FBRyxJQUFJLElBQUksRUFBRTtRQUM1QixTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxHQUFHLHFFQUFpQixFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbEUsRUFBRSxDQUFDLFNBQVMsR0FBRyx5REFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDO1FBQzVELE9BQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTTtJQUNsQyxDQUFDLENBQUM7QUFDSixDQUFDLENBQUM7QUFFRix5R0FBeUc7QUFDekc7SUFDSSxNQUFNLENBQUMsR0FBRyxJQUFJLElBQUksRUFBRTtJQUNwQixDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxHQUFHLHFFQUFpQixFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDbEQsTUFBTSxFQUFFLEdBQUcsQ0FBQyxFQUFVLEVBQUUsRUFBRTtRQUN0Qix1REFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsR0FBRyx5REFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDO1FBQzlELE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFDRCxFQUFFLENBQUMsY0FBYyxDQUFDO0lBQ2xCLEVBQUUsQ0FBQyxhQUFhLENBQUM7SUFDakIsRUFBRSxDQUFDLGNBQWMsQ0FBQztBQUN0QixDQUFDO0FBRUQsc0JBQXNCLEdBQVU7SUFDNUIsSUFBSSxrREFBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLGtEQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUU7UUFDM0YscUVBQWlCLENBQUMsd0RBQVMsQ0FBQyxNQUFNLENBQUMsa0RBQUcsQ0FBQyxrREFBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLG9EQUFLLEVBQUUsQ0FBQztRQUN6RyxhQUFhLEVBQUU7UUFDZixRQUFRLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsR0FBRyxDQUFDO1FBQzVDLE9BQU8sd0RBQU8sRUFBRTtLQUNuQjtBQUNMLENBQUM7QUFFRCxRQUFRLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxZQUFZLENBQUM7QUFDeEQsUUFBUSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxvQkFBb0IsRUFBRSxZQUFZLENBQUMsQ0FBQztBQUNuRSxDQUFDLEdBQUcsRUFBRTtJQUNGLElBQUksUUFBUSxHQUFnQixJQUFJO0lBQ2hDLFFBQVEsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDN0csUUFBUSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtRQUMvQyxJQUFJLFFBQVE7WUFBRSxZQUFZLENBQUMsUUFBUSxDQUFDO1FBQ3BDLFFBQVEsR0FBRyxJQUFJO0lBQ25CLENBQUMsQ0FBQztBQUNOLENBQUMsQ0FBQyxFQUFFO0FBRUosbUJBQW1CO0FBQ25CLHVCQUF1QjtBQUN2Qix1QkFBdUI7QUFDdkIsRUFBRTtBQUNGLG9IQUFvSDtBQUNwSCxNQUFNLFFBQVEsR0FBRyxJQUFJLFFBQVEsQ0FBQyxpREFBRSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtJQUMvRCxTQUFTLEVBQUUsRUFBRTtJQUNiLE1BQU0sRUFBRSxFQUFFO0NBQ1gsQ0FBQztBQUNGLFFBQVEsQ0FBQyxJQUFJLEVBQUU7QUFFZiw2Q0FBNkM7QUFDN0MsdURBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7SUFDeEQsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLFFBQVE7SUFDdkMsdURBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQztJQUMzQyxPQUFPLHVEQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE9BQU87QUFDM0QsQ0FBQyxDQUFDO0FBRUYsdURBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7SUFDeEQsdURBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsR0FBRztJQUM5Qyx1REFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO0lBQzlDLHVEQUFRLENBQUMsWUFBWSxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxFQUFFO0lBQ3ZDLE9BQU8sVUFBVSxDQUFDLEdBQUcsRUFBRTtRQUNyQixRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsTUFBTTtRQUNyQyx1REFBUSxDQUFDLGdCQUFnQixDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNO0lBQ25ELENBQUMsRUFDQyxHQUFHLENBQUM7QUFDUixDQUFDLENBQUM7QUFFRix1RUFBWSxFQUFFO0FBRWQsd0NBQXdDO0FBQ3hDLHFCQUFxQjtBQUNyQixFQUFFO0FBRUYsZ0NBQWdDO0FBQ2hDLFdBQVc7QUFDWCxFQUFFO0FBQ0Ysa0dBQWtHO0FBQ2xHLG1GQUFtRjtBQUNuRix1REFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLFNBQVMsR0FBRyw0Q0FBTztBQUV2Qyx1RkFBdUY7QUFDdkYsdURBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO0lBQ2pELHVEQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxLQUFLLEVBQUU7SUFDbEMsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQztJQUM1Qyx1REFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsR0FBRyxVQUFVO0lBQ3hDLE9BQU8sVUFBVSxDQUFDLEdBQUcsRUFBRTtRQUNuQixrREFBRyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU07SUFDOUQsQ0FBQyxDQUFDO0FBQ04sQ0FBQyxDQUFDO0FBRUYsMkRBQTJEO0FBQzNELHVEQUFRLENBQUMsWUFBWSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtJQUNsRCxrREFBRyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE9BQU87SUFDM0QsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQztJQUMvQyxPQUFPLHVEQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxHQUFHLFdBQVc7QUFDcEQsQ0FBQyxDQUFDO0FBRUYsK0NBQStDO0FBQy9DLElBQUksWUFBWSxDQUFDLFNBQVMsSUFBSSxJQUFJLEVBQUU7SUFBRSxZQUFZLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO0NBQUU7QUFDckYsSUFBSSxZQUFZLENBQUMsU0FBUyxJQUFJLElBQUksRUFBRTtJQUFFLFlBQVksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7Q0FBRTtBQUNsRixJQUFJLFlBQVksQ0FBQyxPQUFPLElBQUksSUFBSSxFQUFFO0lBQUUsWUFBWSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztDQUFFO0FBQ2pGLElBQUksWUFBWSxDQUFDLFFBQVEsSUFBSSxJQUFJLEVBQUU7SUFBRSxZQUFZLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDO0NBQUU7QUFDcEYsSUFBSSxZQUFZLENBQUMsWUFBWSxJQUFJLElBQUksRUFBRTtJQUFFLFlBQVksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7Q0FBRTtBQUMzRixJQUFJLFlBQVksQ0FBQyxrQkFBa0IsSUFBSSxJQUFJLEVBQUU7SUFBRSxZQUFZLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUM7Q0FBRTtBQUN4RyxJQUFJLFlBQVksQ0FBQyxjQUFjLElBQUksSUFBSSxFQUFFO0lBQUUsWUFBWSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQztDQUFFO0FBQ3JHLElBQUksWUFBWSxDQUFDLGVBQWUsSUFBSSxJQUFJLEVBQUU7SUFBRSxZQUFZLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDO0NBQUU7QUFDbEcsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsRUFBRTtJQUNuQyx1REFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDO0lBQ3pDLHVEQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNO0NBQ3pDO0FBQ0QsSUFBSSxZQUFZLENBQUMsYUFBYSxJQUFJLElBQUksRUFBRTtJQUFFLFlBQVksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUM7Q0FBRTtBQUM5RixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxFQUFFO0lBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQztDQUFFO0FBQzVGLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLEVBQUU7SUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDO0NBQUU7QUFDMUYsSUFBSSxZQUFZLENBQUMsU0FBUyxJQUFJLElBQUksRUFBRTtJQUFFLFlBQVksQ0FBQyxTQUFTLEdBQUcsWUFBWTtDQUFFO0FBRzdFLE1BQU0sZ0JBQWdCLEdBQWMsK0RBQWdCLENBQUMsa0JBQWtCLEVBQUU7SUFDckUsU0FBUyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLFNBQVM7Q0FDbEYsQ0FBQztBQUNGLE1BQU0sV0FBVyxHQUFHLCtEQUFnQixDQUFDLGFBQWEsRUFBRSxHQUFHLEVBQUU7SUFDckQsTUFBTSxFQUFFLEdBQWMsRUFBRTtJQUN4QixNQUFNLElBQUksR0FBRyxvREFBTyxFQUFFO0lBQ3RCLElBQUksQ0FBQyxJQUFJO1FBQUUsT0FBTyxFQUFFO0lBQ3BCLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBUyxFQUFFLEVBQUU7UUFDL0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVM7SUFDckIsQ0FBQyxDQUFDO0lBQ0YsT0FBTyxFQUFFO0FBQ2IsQ0FBQyxDQUFDO0FBQ0YsdURBQVEsQ0FBQyxHQUFHLFlBQVksQ0FBQyxTQUFTLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsT0FBTztBQUNuRSxJQUFJLFlBQVksQ0FBQyxjQUFjLElBQUksSUFBSSxFQUFFO0lBQUUsWUFBWSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztDQUFFO0FBQy9GLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO0lBQ3BDLElBQUksK0RBQWdCLENBQUMsZ0JBQWdCLENBQUMsRUFBRTtRQUN0QyxPQUFPLGtEQUFLLEVBQUU7S0FDZjtBQUNILENBQUMsQ0FBQztBQUNGLElBQUksWUFBWSxDQUFDLFdBQVcsSUFBSSxJQUFJLEVBQUU7SUFBRSxZQUFZLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7Q0FBRTtBQUN2RjtJQUNJLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQztJQUM5QyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDUCxVQUFVLENBQUMsR0FBRyxFQUFFO1lBQ1osT0FBTyxDQUFDLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQztZQUM1QyxrREFBSyxFQUFFO1lBQ1AsZUFBZSxFQUFFO1FBQ3JCLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQztLQUNwQjtBQUNMLENBQUM7QUFDRCxlQUFlLEVBQUU7QUFFakIsd0VBQXdFO0FBQ3hFLE1BQU0sT0FBTyxHQUFjO0lBQ3pCLFNBQVMsRUFBRSxTQUFTO0lBQ3BCLFNBQVMsRUFBRSxTQUFTO0lBQ3BCLFNBQVMsRUFBRSxTQUFTO0lBQ3BCLFNBQVMsRUFBRSxTQUFTO0lBQ3BCLFNBQVMsRUFBRSxTQUFTO0lBQ3BCLFNBQVMsRUFBRSxTQUFTO0lBQ3BCLFNBQVMsRUFBRSxTQUFTO0lBQ3BCLFNBQVMsRUFBRSxTQUFTO0lBQ3BCLFNBQVMsRUFBRSxTQUFTO0lBQ3BCLFNBQVMsRUFBRSxTQUFTO0lBQ3BCLFNBQVMsRUFBRSxTQUFTO0lBQ3BCLFNBQVMsRUFBRSxTQUFTO0lBQ3BCLFNBQVMsRUFBRSxTQUFTO0lBQ3BCLFNBQVMsRUFBRSxTQUFTO0lBQ3BCLFNBQVMsRUFBRSxTQUFTO0lBQ3BCLFNBQVMsRUFBRSxTQUFTO0lBQ3BCLFNBQVMsRUFBRSxTQUFTO0lBQ3BCLFNBQVMsRUFBRSxTQUFTO0NBQ3JCO0FBQ0QsSUFBSSwrREFBZ0IsQ0FBQyxNQUFNLENBQUMsSUFBSSxJQUFJLEVBQUU7SUFDbEMsK0RBQWdCLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQVMsRUFBRSxFQUFFO1FBQ25ELE1BQU0sQ0FBQyxHQUFHLHNEQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDL0IsQ0FBQyxDQUFDLFlBQVksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDO1FBQ2pDLENBQUMsQ0FBQyxXQUFXLENBQUMsc0RBQU8sQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDbEMsdURBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO0lBQzFDLENBQUMsQ0FBQztDQUNMO0FBQ0QsUUFBUSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO0lBQy9DLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRTtRQUN4QyxNQUFNLGVBQWUsR0FBRyxLQUFLLENBQUMsWUFBWSxDQUFDLGNBQWMsQ0FBQztRQUMxRCxJQUFJLENBQUMsZUFBZTtZQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsaUNBQWlDLENBQUM7UUFFeEUsTUFBTSxFQUFFLEdBQUcsa0RBQUcsQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzNDLE1BQU0sUUFBUSxHQUFHLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssYUFBYSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLGtCQUFrQjtRQUM1RixNQUFNLElBQUksR0FBRyxDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLGFBQWEsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0I7UUFDcEYsRUFBRSxDQUFDLEtBQUssQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQztRQUNoRCxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO1lBQ25DLE1BQU0sRUFBRSxHQUFHLHNEQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQztZQUM5QixFQUFFLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FBRyxDQUFDO1lBQzVCLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxlQUFlLENBQUMsRUFBRTtnQkFDN0IsRUFBRSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDO2FBQy9CO1lBQ0QsRUFBRSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUM7UUFDbEIsQ0FBQyxDQUFDO1FBQ0YsTUFBTSxNQUFNLEdBQUcsc0RBQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxhQUFhLENBQUMsRUFBRTswQ0FDZCxJQUFJLENBQUMsZUFBZSxDQUFDOzs7Z0NBRy9CLENBQUM7UUFDekIsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQ2hFLGlEQUFFLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFO1lBQzVELEVBQUUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQztZQUMvQixHQUFHLENBQUMsZUFBZSxFQUFFO1FBQ3pCLENBQUMsQ0FBQztRQUNGLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtZQUNqQyxJQUFJLEVBQUUsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFO2dCQUNqQyxNQUFNLEVBQUUsR0FBRyxTQUFTLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxlQUFlLElBQUksTUFBTSxDQUFDLENBQUMsV0FBVyxFQUFFO2dCQUN0RSxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsRUFBRTtnQkFDMUIsRUFBRSxDQUFDLEtBQUssQ0FBQyxlQUFlLEdBQUcsRUFBRTtnQkFDN0IsTUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUM7Z0JBQzlDLElBQUksUUFBUSxFQUFFO29CQUNWLFFBQVEsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQztpQkFDeEM7Z0JBQ0QsRUFBRSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDO2dCQUM1QixZQUFZLENBQUMsUUFBUSxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7Z0JBQzdDLFlBQVksRUFBRTthQUNqQjtZQUNELEVBQUUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUNqQyxDQUFDLENBQUM7UUFDRixpREFBRSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtZQUNwRSxFQUFFLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7WUFDL0IsRUFBRSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO1lBQzdCLE1BQU0sVUFBVSxHQUFHLEVBQUUsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDO1lBQ2hELElBQUksVUFBVSxJQUFJLElBQUksRUFBRTtnQkFDcEIsVUFBVSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDO2FBQzFDO1lBQ0QsRUFBRSxDQUFDLEtBQUssQ0FBQyxlQUFlLEdBQUcsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsaURBQUUsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1lBQzVGLFlBQVksQ0FBQyxRQUFRLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztZQUM3QyxZQUFZLEVBQUU7WUFDZCxPQUFPLEdBQUcsQ0FBQyxlQUFlLEVBQUU7UUFDaEMsQ0FBQyxDQUFDO0lBQ04sQ0FBQyxDQUFDO0FBQ04sQ0FBQyxDQUFDO0FBRUYsa0VBQWtFO0FBQ2xFO0lBQ0ksTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUM7SUFDN0MsS0FBSyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzlDLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQztJQUNoQyxNQUFNLEtBQUssR0FBRyxpREFBRSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQWtCO0lBRTlDLE1BQU0sWUFBWSxHQUFHLENBQUMsUUFBZ0IsRUFBRSxLQUFhLEVBQUUsSUFBWSxFQUFFLEtBQUssR0FBRyxFQUFFLEVBQUUsRUFBRTtRQUMvRSxNQUFNLEtBQUssR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUMsV0FBVyxFQUFFO1FBQy9ELEtBQUssQ0FBQyxVQUFVLENBQUMsR0FBRyxLQUFLLGNBQWMsUUFBUSx3QkFBd0IsS0FBSyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQ3JGLEtBQUssQ0FBQyxVQUFVLENBQUMsR0FBRyxLQUFLLGNBQWMsUUFBUSw2QkFBNkIsSUFBSSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQ3pGLEtBQUssQ0FBQyxVQUFVLENBQUMsR0FBRyxLQUFLLGNBQWMsUUFBUSxnQ0FBZ0MsS0FBSyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQzdGLEtBQUssQ0FBQyxVQUFVLENBQUMsR0FBRyxLQUFLLGtCQUFrQixRQUFRLDBCQUEwQixLQUFLLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDM0YsS0FBSyxDQUFDLFVBQVUsQ0FBQyxHQUFHLEtBQUssa0JBQWtCLFFBQVEsK0JBQStCLElBQUksS0FBSyxFQUFFLENBQUMsQ0FBQztJQUNuRyxDQUFDO0lBRUQsTUFBTSxhQUFhLEdBQUcsQ0FBQyxLQUFhLEVBQUUsRUFBRSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsV0FBVyxFQUFFO0lBRWxGLElBQUksWUFBWSxDQUFDLFNBQVMsS0FBSyxZQUFZLEVBQUU7UUFDekMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxFQUFFLEVBQUU7WUFDdkQsWUFBWSxDQUFDLElBQUksSUFBSSxFQUFFLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDM0UsQ0FBQyxDQUFDO0tBQ0w7U0FBTTtRQUNILE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLEVBQUUsRUFBRTtZQUNsRCxZQUFZLENBQUMsaUJBQWlCLElBQUksS0FBSyxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNGLENBQUMsQ0FBQztLQUNMO0lBRUQsWUFBWSxDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDO0lBQzNDLFlBQVksQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxRQUFRLENBQUM7QUFDekQsQ0FBQztBQUVELHdDQUF3QztBQUN4QyxZQUFZLEVBQUU7QUFFZCxtRUFBbUU7QUFDbkUsUUFBUSxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7SUFDeEQsSUFBSSxDQUFDLENBQUMsQ0FBQyxZQUFZLGdCQUFnQixDQUFDO1FBQUUsT0FBTTtJQUM1QyxJQUFJLFlBQVksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxFQUFFO1FBQzlCLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxVQUFVLEVBQUU7WUFDM0IsQ0FBQyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDM0M7YUFBTTtZQUNQLENBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3pDO0tBQ0o7SUFDRCxDQUFDLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUU7UUFDakMsSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLFVBQVUsRUFBRTtZQUN2QixnRUFBaUIsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUM7U0FDdkM7YUFBTTtZQUNILGdFQUFpQixDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQztTQUNyQztRQUNELFFBQVEsQ0FBQyxDQUFDLElBQUksRUFBRTtZQUNaLEtBQUssYUFBYSxDQUFDLENBQUMsT0FBTyxlQUFlLEVBQUU7WUFDNUMsS0FBSyxXQUFXLENBQUMsQ0FBQyxPQUFPLHdEQUFPLEVBQUU7WUFDbEMsS0FBSyxnQkFBZ0IsQ0FBQyxDQUFDLE9BQU8sd0RBQU8sRUFBRTtZQUN2QyxLQUFLLG9CQUFvQixDQUFDLENBQUMsT0FBTyx3REFBTyxFQUFFO1lBQzNDLEtBQUssaUJBQWlCLENBQUMsQ0FBQyxPQUFPLHdEQUFPLEVBQUU7WUFDeEMsS0FBSyxlQUFlLENBQUMsQ0FBQyxPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQztZQUN2RixLQUFLLGNBQWM7Z0JBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQUMsT0FBTyx3REFBTyxFQUFFO1lBQ2hHLEtBQUssVUFBVSxDQUFDLENBQUMsT0FBTyx1REFBUSxDQUFDLGlCQUFpQixDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxPQUFPO1NBQzlFO0lBQ0wsQ0FBQyxDQUFDO0FBQ04sQ0FBQyxDQUFDO0FBRUYsK0NBQStDO0FBQy9DLE1BQU0sU0FBUyxHQUNYLGlEQUFFLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxxQ0FBcUMsWUFBWSxDQUFDLFNBQVMsS0FBSyxDQUFDLENBQXFCO0FBQ3BILFNBQVMsQ0FBQyxPQUFPLEdBQUcsSUFBSTtBQUN4QixLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO0lBQ2hFLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtRQUNuQyxNQUFNLENBQUMsR0FBSSxpREFBRSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsaUNBQWlDLENBQUMsQ0FBc0IsQ0FBQyxLQUFLO1FBQ25HLFlBQVksQ0FBQyxTQUFTLEdBQUcsQ0FBQztRQUMxQixJQUFJLENBQUMsS0FBSyxPQUFPLEVBQUU7WUFDakIsdURBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTTtZQUNuRCx1REFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsT0FBTztTQUNoRDthQUFNO1lBQ0wsdURBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsT0FBTztZQUNwRCx1REFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTTtTQUMvQztRQUNELE9BQU8sWUFBWSxFQUFFO0lBQ3ZCLENBQUMsQ0FBQztBQUNKLENBQUMsQ0FBQztBQUVGLCtCQUErQjtBQUMvQixRQUFRLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7SUFDbEQsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssZUFBZSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxFQUFFO1FBQ2xFLENBQUMsQ0FBQyxLQUFLLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7S0FDL0I7SUFDRCxDQUFDLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUU7UUFDbEMsWUFBWSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSztRQUM5QixJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssZUFBZSxFQUFFO1lBQzlCLHlFQUFnQixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7U0FDMUI7SUFDSCxDQUFDLENBQUM7QUFDSixDQUFDLENBQUM7QUFFRix1QkFBdUI7QUFDdkIsc0JBQXNCO0FBQ3RCLHNCQUFzQjtBQUN0QixFQUFFO0FBQ0YsaUNBQWlDO0FBQ2pDLEVBQUU7QUFDRixrRkFBa0Y7QUFDbEYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsZ0NBQWdDLENBQUM7QUFDNUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLDRDQUFPLG9DQUFvQyxFQUFFLGtCQUFrQixDQUFDO0FBQ3pGLE9BQU8sQ0FBQyxHQUFHLENBQUM7Ozs7Ozs7Ozs7c0RBVTBDLEVBQ3ZDLEdBQUcsQ0FBRSxFQUFlLENBQUMsTUFBTSxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLGdCQUFnQixFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xILE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO0FBRWYsc0RBQXNEO0FBQ3RELE1BQU0sZUFBZSxHQUFHLCtEQUFnQixDQUFDLFlBQVksQ0FBQztBQUN0RCx1REFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDLFNBQVMsR0FBRyxlQUFlLENBQUMsQ0FBQyxDQUFDLDZEQUFZLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU87QUFFNUYsMEZBQTBGO0FBQzFGLElBQUksK0RBQWdCLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxFQUFFO0lBQ2xDLG9EQUFPLENBQUMsK0RBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFakMsZ0NBQWdDO0lBQ2hDLHdFQUFjLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtRQUM5QixxRUFBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNuRSxDQUFDLENBQUM7SUFFRix3REFBTyxFQUFFO0NBQ1o7QUFFRCxrREFBSyxFQUFFO0FBRVAscUJBQXFCO0FBQ3JCLFNBQVM7QUFDVCxTQUFTO0FBQ1QsRUFBRTtBQUNGLDhEQUE4RDtBQUM5RCxPQUFPLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFVBQVU7QUFDMUMsTUFBTSxVQUFVLEdBQUcsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUU7SUFDbkQsV0FBVyxFQUFFO1FBQ1gsQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLEVBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxvQkFBb0IsRUFBQyxDQUFDO0tBQ3ZEO0NBQ0YsQ0FBQztBQUVGLGtHQUFrRztBQUNsRyw2Q0FBNkM7QUFDN0MsSUFBSSxPQUFPLEdBQUcsS0FBSztBQUNuQixNQUFNLFVBQVUsR0FBRyxJQUFJLE1BQU0sQ0FBQyx1REFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3JELFVBQVUsQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUU7SUFDekIsSUFBSSxDQUFDLENBQUMsV0FBVyxLQUFLLE9BQU8sRUFBRTtRQUM3QixDQUFDLENBQUMsY0FBYyxFQUFFO1FBQ2xCLElBQUksRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsTUFBTTtRQUNwQixNQUFNLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLE1BQU07UUFFdEIsTUFBTSxJQUFJLEdBQUcsdURBQVEsQ0FBQyxnQkFBZ0IsQ0FBQztRQUN2QyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxPQUFPO1FBQzVCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLEdBQUc7UUFDeEIsdURBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQztRQUUzQyx5QkFBeUI7UUFDekIsSUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFO1lBQ1gsQ0FBQyxHQUFHLEdBQUc7U0FDUjthQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNoQixDQUFDLEdBQUcsQ0FBQztZQUVMLGlCQUFpQjtZQUNqQixJQUFJLENBQUMsR0FBRyxHQUFHLEVBQUU7Z0JBQ1gsT0FBTyxHQUFHLEtBQUs7Z0JBQ2pCLGtCQUFrQjthQUNqQjtpQkFBTSxJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUU7Z0JBQ25CLE9BQU8sR0FBRyxJQUFJO2FBQ2Y7U0FDRjtRQUVELHVEQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxjQUFjLENBQUMsR0FBRyxHQUFHLEtBQUs7UUFDaEUsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxFQUFFLEdBQUcsQ0FBQztRQUMxQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUM7S0FDaEQ7QUFDSCxDQUFDLENBQUM7QUFFRixVQUFVLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFO0lBQzVCLElBQUksQ0FBQyxDQUFDLFdBQVcsS0FBSyxPQUFPLEVBQUU7UUFDN0IsSUFBSSxPQUFPO1FBQ1gsTUFBTSxFQUFFLFNBQVMsRUFBRSxHQUFHLENBQUM7UUFDdkIsa0ZBQWtGO1FBQ2xGLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxTQUFTLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ3pELE9BQU8sR0FBRyx1REFBUSxDQUFDLFNBQVMsQ0FBQztZQUM3QixPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7WUFDbEMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDO1lBQy9CLE9BQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLEVBQUU7WUFDNUIsdURBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLE1BQU07U0FFNUM7YUFBTSxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQyxFQUFFO1lBQ3hDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxNQUFNO1lBQ3JDLE9BQU8sR0FBRyx1REFBUSxDQUFDLFNBQVMsQ0FBQztZQUM3QixPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7WUFDbEMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO1lBQ2xDLE9BQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLEVBQUU7WUFDNUIsdURBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsRUFBRTtZQUM3Qyx1REFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsTUFBTTtZQUMzQyxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsdURBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxFQUNoRSxHQUFHLENBQUM7U0FDUDtLQUNGO0FBQ0gsQ0FBQyxDQUFDO0FBRUYsVUFBVSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRTtJQUN2Qix1REFBUSxDQUFDLGdCQUFnQixDQUFDLENBQUMsS0FBSyxFQUFFO0lBQ2xDLENBQUMsQ0FBQyxjQUFjLEVBQUU7QUFDdEIsQ0FBQyxDQUFDO0FBRUYsTUFBTSxFQUFFLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUM7QUFFaEQsMkRBQTJEO0FBQzNELHFEQUFNLENBQUMsdURBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ2xDLHVEQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO0lBQ3hELHVEQUFRLENBQUMsY0FBYyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7QUFDckQsQ0FBQyxDQUFDO0FBRUYsbURBQW1EO0FBQ25ELE1BQU0sYUFBYSxHQUFHLCtEQUFnQixDQUFDLGVBQWUsRUFBRTtJQUN0RCxHQUFHLEVBQUUsSUFBSTtJQUNULElBQUksRUFBRSxJQUFJO0lBQ1YsTUFBTSxFQUFFLElBQUk7Q0FDYixDQUFDO0FBRUY7SUFDSSxNQUFNLENBQUMsR0FBRyxDQUFDLElBQWEsRUFBRyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUMsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzVGLE9BQU8sdURBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxTQUFTLEdBQUcsS0FBSztBQUNsRCxDQUFDO0FBQ0QsZUFBZSxFQUFFO0FBQ2pCLE1BQU0sQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLEVBQUUsRUFBRTtJQUN4RCxJQUFJLElBQUksS0FBSyxLQUFLLElBQUksSUFBSSxLQUFLLE1BQU0sSUFBSSxJQUFJLEtBQUssUUFBUSxFQUFFO1FBQzFELE1BQU0sSUFBSSxLQUFLLENBQUMseUJBQXlCLElBQUksRUFBRSxDQUFDO0tBQ2pEO0lBRUQsTUFBTSxRQUFRLEdBQUcsdURBQVEsQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFxQjtJQUM5RCxRQUFRLENBQUMsT0FBTyxHQUFHLE9BQU87SUFDMUIsSUFBSSxPQUFPLEVBQUU7UUFBRSx1REFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDO0tBQUU7SUFDN0QsUUFBUSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFO1FBQzFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsR0FBRyxRQUFRLENBQUMsT0FBTztRQUN0Qyx1REFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxlQUFlLEVBQUUsZUFBZSxFQUFFLENBQUM7UUFDekUsdURBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztRQUMvQyxPQUFPLFlBQVksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUM7SUFDbkUsQ0FBQyxDQUFDO0FBQ0osQ0FBQyxDQUFDO0FBRUYsd0ZBQXdGO0FBQ3hGLE1BQU0sZUFBZSxHQUFHLHVEQUFRLENBQUMsZUFBZSxDQUFxQjtBQUNyRSxJQUFJLCtEQUFnQixDQUFDLGVBQWUsQ0FBQyxFQUFFO0lBQ3JDLGVBQWUsQ0FBQyxPQUFPLEdBQUcsSUFBSTtJQUM5Qix1REFBUSxDQUFDLGdCQUFnQixDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUM7Q0FDMUQ7QUFDRCxlQUFlLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRTtJQUM5QyxnRUFBaUIsQ0FBQyxlQUFlLEVBQUUsZUFBZSxDQUFDLE9BQU8sQ0FBQztJQUMzRCx1REFBUSxDQUFDLGdCQUFnQixDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxlQUFlLEVBQUUsZUFBZSxDQUFDLE9BQU8sQ0FBQztBQUN2RixDQUFDLENBQUM7QUFFRixzQkFBc0I7QUFDdEIsbUJBQW1CO0FBQ25CLG1CQUFtQjtBQUNuQixFQUFFO0FBRUYsSUFBSSxRQUFRLENBQUMsUUFBUSxLQUFLLG1CQUFtQixFQUFFO0lBQUUsd0RBQVcsRUFBRTtDQUFFO0FBRWhFLDJFQUEyRTtBQUMzRSx1REFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7SUFDckQsdURBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztJQUM3QyxVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ2QsdURBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTTtJQUNyRCxDQUFDLEVBQUUsR0FBRyxDQUFDO0FBQ1QsQ0FBQyxDQUFDO0FBRUYsMkRBQTJEO0FBQzNELHNEQUFTLEVBQUU7QUFFWCxnRkFBZ0Y7QUFDaEY7SUFDRSx1REFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO0lBQzNDLFVBQVUsQ0FBQyxHQUFHLEVBQUU7UUFDZCx1REFBUSxDQUFDLGdCQUFnQixDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNO0lBQ25ELENBQUMsRUFBRSxHQUFHLENBQUM7QUFDVCxDQUFDO0FBRUQsdURBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDO0FBQ3ZELHVEQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDO0FBRS9ELDhEQUE4RDtBQUM5RCx1REFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7SUFDL0MsdURBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLEtBQUssRUFBRTtJQUNsQyxNQUFNLFFBQVEsR0FBRyxHQUFHLEVBQUU7UUFDcEIsdURBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsT0FBTztRQUNsRCxPQUFPLHVEQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUM7SUFDakQsQ0FBQztJQUVELElBQUksdURBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtRQUNuRCxvREFBTyxDQUFDLFFBQVEsQ0FBQztLQUNsQjtTQUFNO1FBQ0wsUUFBUSxFQUFFO0tBQ1g7QUFDSCxDQUFDLENBQUM7QUFFRixzQ0FBc0M7QUFDdEM7SUFDRSx1REFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO0lBQzVDLFVBQVUsQ0FBQyxHQUFHLEVBQUU7UUFDZCx1REFBUSxDQUFDLGlCQUFpQixDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNO0lBQ3BELENBQUMsRUFBRSxHQUFHLENBQUM7QUFDVCxDQUFDO0FBRUQsdURBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDO0FBQ3pELHVEQUFRLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDO0FBRWpFLGtCQUFrQjtBQUNsQix5QkFBeUI7QUFDekIseUJBQXlCO0FBQ3pCLEVBQUU7QUFDRixxREFBcUQ7QUFDckQscURBQU0sQ0FBQyx1REFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3ZCLHFEQUFNLENBQUMsdURBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUMzQixNQUFNLFNBQVMsR0FBRyxHQUFHLEVBQUU7SUFDckIsNkVBQWEsQ0FBRSx1REFBUSxDQUFDLFNBQVMsQ0FBc0IsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO0lBQ25FLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxRQUFRO0lBQ3ZDLHVEQUFRLENBQUMsZUFBZSxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxPQUFPO0lBQ2pELHVEQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUM7SUFDN0MsdURBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxLQUFLLEVBQUU7QUFDN0IsQ0FBQztBQUNELHVEQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQztBQUN0RCx1REFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUM7QUFFMUQsa0RBQWtEO0FBQ2xEO0lBQ0UsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLE1BQU07SUFDckMsdURBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztJQUNoRCxVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ2QsdURBQVEsQ0FBQyxlQUFlLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU07SUFDbEQsQ0FBQyxFQUFFLEdBQUcsQ0FBQztBQUNULENBQUM7QUFFRCw0RkFBNEY7QUFDNUYsdURBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtJQUN0RCxJQUFJLEdBQUcsQ0FBQyxLQUFLLEtBQUssRUFBRSxFQUFFLEVBQUUscUJBQXFCO1FBQzNDLFFBQVEsRUFBRTtLQUNYO0FBQ0gsQ0FBQyxDQUFDO0FBRUYsdUVBQXVFO0FBQ3ZFLHVEQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQztBQUV6RCw4RkFBOEY7QUFDOUYsdURBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtJQUN2RCxHQUFHLENBQUMsY0FBYyxFQUFFO0lBQ3BCLE1BQU0sSUFBSSxHQUFJLHVEQUFRLENBQUMsU0FBUyxDQUFzQixDQUFDLEtBQUs7SUFDNUQsTUFBTSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsbUZBQWUsQ0FBQyxJQUFJLENBQUM7SUFDOUMsSUFBSSxHQUFHLEdBQXFCLFNBQVM7SUFFckMsTUFBTSxLQUFLLEdBQUcsQ0FBQyxFQUFFLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLHdEQUFTLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxvREFBSyxFQUFFO0lBQ3RFLElBQUksR0FBRyxJQUFJLElBQUksRUFBRTtRQUNmLEdBQUcsR0FBRyxLQUFLO1FBQ1gsSUFBSSxHQUFHLEdBQUcsS0FBSyxFQUFFLEVBQUUsd0NBQXdDO1lBQ3pELEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUM7U0FDeEM7S0FDRjtJQUNELDhFQUFVLENBQUM7UUFDVCxJQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNuRCxJQUFJLEVBQUUsS0FBSztRQUNYLEtBQUs7UUFDTCxLQUFLLEVBQUUsQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSTtRQUN0RCxHQUFHO0tBQ0osQ0FBQztJQUNGLDZFQUFTLEVBQUU7SUFDWCxRQUFRLEVBQUU7SUFDVix3REFBTyxDQUFDLEtBQUssQ0FBQztBQUNoQixDQUFDLENBQUM7QUFFRiw2RUFBYSxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUM7QUFDeEIsdURBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO0lBQ2pELE9BQU8sNkVBQWEsQ0FBRSx1REFBUSxDQUFDLFNBQVMsQ0FBc0IsQ0FBQyxLQUFLLENBQUM7QUFDdkUsQ0FBQyxDQUFDO0FBRUYsOEZBQThGO0FBQzlGLElBQUksZUFBZSxJQUFJLFNBQVMsRUFBRTtJQUNoQyxTQUFTLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQztTQUNuRCxJQUFJLENBQUMsQ0FBQyxZQUFZLEVBQUUsRUFBRTtJQUNyQiw4QkFBOEI7SUFDOUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrREFBa0QsRUFBRSxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtJQUNuRyx5QkFBeUI7SUFDekIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQ0FBcUMsRUFBRSxHQUFHLENBQUMsQ0FDMUQ7Q0FDRjtBQUVELHFHQUFxRztBQUNyRyxTQUFTLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFO0lBQzFELE9BQU8sQ0FBQyxHQUFHLENBQUMseUNBQXlDLENBQUM7SUFDdEQsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtRQUFFLE9BQU8sd0RBQVcsRUFBRTtLQUFFO0FBQ3RELENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMxNEJzRDtBQUVOO0FBQ3VCO0FBQ2xDO0FBRXZDLE1BQU0sUUFBUSxHQUFHLHNEQUFRLENBQUMsY0FBYyxDQUFDO0FBQ25DLDRCQUE2QixFQUFlO0lBQzlDLFFBQVEsQ0FBQyxZQUFZLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDbEUsQ0FBQztBQUVLLHdCQUF5QixJQUFrQixFQUFFLFVBQXVCLEVBQUUsSUFBVSxFQUN2RCxTQUFrQjtJQUM3QyxNQUFNLEtBQUssR0FBRyxTQUFTLElBQUksc0RBQVMsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDO0lBRXRELE1BQU0sRUFBRSxHQUFHLHFEQUFPLENBQUMsS0FBSyxFQUFFLENBQUMsVUFBVSxFQUFFLGdCQUFnQixFQUFFLFVBQVUsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLEVBQUU7b0NBQ3JELElBQUk7OEJBQ1YsVUFBVSxDQUFDLEtBQUs7aUJBQzdCLDREQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDOzZCQUNOLHdEQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxXQUFXLFVBQVUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztJQUM5RSxFQUFFLENBQUMsWUFBWSxDQUFDLFlBQVksRUFBRSxLQUFLLENBQUM7SUFDcEMsTUFBTSxFQUFFLEVBQUUsRUFBRSxHQUFHLFVBQVU7SUFDekIsSUFBSSxJQUFJLEtBQUssUUFBUSxFQUFFO1FBQ25CLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO1lBQzlCLE1BQU0sV0FBVyxHQUFHLEtBQUssSUFBSSxFQUFFO2dCQUMzQixNQUFNLEVBQUUsR0FBRyxnREFBRSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMscUJBQXFCLEVBQUUsS0FBSyxDQUFDLENBQWdCO2dCQUNsRixNQUFNLDBEQUFZLENBQUMsQ0FBQyxFQUFFLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxHQUFHLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxHQUFHLENBQUM7Z0JBQ3BGLEVBQUUsQ0FBQyxLQUFLLEVBQUU7WUFDZCxDQUFDO1lBQ0QsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsS0FBSyxHQUFHLEVBQUU7Z0JBQ3JELE9BQU8sV0FBVyxFQUFFO2FBQ25CO2lCQUFNO2dCQUNGLGdEQUFFLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFpQixDQUFDLEtBQUssRUFBRTtnQkFDOUUsT0FBTyxVQUFVLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQzthQUN0QztRQUNMLENBQUMsQ0FBQztLQUNMO0lBRUQsSUFBSSxzRUFBZ0IsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUU7UUFDbkMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDO0tBQ3pCO0lBQ0QsT0FBTyxFQUFFO0FBQ2IsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMxQzRDO0FBQ3VCO0FBQ25CO0FBQ3VEO0FBQ3BEO0FBQ0g7QUFDd0I7QUFDYztBQUNxQjtBQUNWO0FBQ2hFO0FBRWxDLE1BQU0sU0FBUyxHQUF5QztJQUNwRCxvQkFBb0IsRUFBRSxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUM7SUFDOUMseUVBQXlFLEVBQUUsQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDO0lBQ25HLCtCQUErQixFQUFFLENBQUMsa0JBQWtCLEVBQUUsUUFBUSxDQUFDO0lBQy9ELGlCQUFpQixFQUFFLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQztJQUN0QyxZQUFZLEVBQUUsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDO0NBQ3RDO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxnQkFBZ0IsRUFBRSxFQUFDLGNBQWM7QUFFakQsOEJBQThCLEtBQVksRUFBRSxLQUFrQjtJQUMxRCxJQUFJLEtBQUssR0FBRyxDQUFDO0lBQ2IsSUFBSSxPQUFPLEdBQUcsQ0FBQztJQUNmLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtRQUNuQixJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFBRSxLQUFLLEVBQUU7U0FBRTtRQUM5QixJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtZQUFFLE9BQU8sRUFBRTtTQUFFO0lBQ3JDLENBQUMsQ0FBQztJQUNGLGdEQUFFLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLFNBQVMsR0FBRyxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFO0lBQ2hGLGdEQUFFLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLFNBQVMsR0FBRyxPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFO0lBQ3BGLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQztJQUMvQixPQUFPLEtBQUssR0FBRyxDQUFDLElBQUksT0FBTyxHQUFHLENBQUM7QUFDbkMsQ0FBQztBQUVLLHVCQUF3QixLQUF1QjtJQUNqRCxNQUFNLFFBQVEsR0FBRyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ2hELFFBQVEsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUN4RCxPQUFPLEtBQUssUUFBUSxDQUFDLFFBQVEsRUFBRSxJQUFJLFFBQVEsQ0FBQyxPQUFPLEVBQUUsRUFBRTtBQUMzRCxDQUFDO0FBRUQscURBQXFEO0FBQy9DLGtCQUFtQixFQUFVO0lBQy9CLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMseURBQXlELENBQUM7SUFDN0UsSUFBSSxDQUFDLElBQUksSUFBSTtRQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsbUNBQW1DLEVBQUUsRUFBRSxDQUFDO0lBQ3ZFLE9BQU8sQ0FBQztBQUNaLENBQUM7QUFFSyx5QkFBMEIsVUFBdUIsRUFBRSxJQUFzQjtJQUMzRSxNQUFNLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNO0lBQ2hGLElBQUksR0FBRyxJQUFJLElBQUk7UUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLHdCQUF3QixVQUFVLENBQUMsS0FBSyxPQUFPLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUMvRixPQUFPLEdBQUc7QUFDZCxDQUFDO0FBRUssd0JBQXlCLFVBQXVCLEVBQUUsSUFBc0I7SUFDMUUsT0FBTyxRQUFRLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUN0RCxDQUFDO0FBRUssMEJBQTJCLEtBQXVCLEVBQUUsSUFBc0I7SUFDNUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsR0FBRyxLQUFLO0lBRXZDLHVEQUF1RDtJQUN2RCxNQUFNLFNBQVMsR0FBRyxjQUFjLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQztJQUVsRCxNQUFNLE1BQU0sR0FBRyxhQUFhLENBQUMsS0FBSyxDQUFDO0lBRW5DLElBQUksUUFBUSxHQUFHLE9BQU87SUFDdEIsSUFBSSxJQUFJLEdBQUcsSUFBSTtJQUNmLE1BQU0sVUFBVSxHQUFHLHFFQUFhLEVBQUU7SUFDbEMsSUFBSSxVQUFVLElBQUksVUFBVSxDQUFDLEtBQUssSUFBSSxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsRUFBRTtRQUNoRyxJQUFJLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSTtRQUN0RCxRQUFRLEdBQUcsR0FBRztLQUNqQjtJQUVELE1BQU0sQ0FBQyxHQUFHLHFEQUFPLENBQUMsS0FBSyxFQUFFLENBQUMsWUFBWSxFQUFFLFVBQVUsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQ2xELElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxJQUFJLGtDQUFrQyxDQUFDLENBQUMsQ0FBQyxFQUFFO2lEQUNoRCxTQUFTLENBQUMsQ0FBQyxDQUFDOzZCQUNoQyxTQUFTLENBQUMsQ0FBQyxDQUFDOzJCQUNkLFFBQVE7NkNBQ1UsVUFBVSxDQUFDLEtBQUs7O3VDQUV0QixVQUFVLENBQUMsR0FBRyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsR0FBRyxNQUFNLEVBQ3hFLFVBQVUsQ0FBQyxFQUFFLEdBQUcsTUFBTSxDQUFDO0lBRXpDLElBQUksQ0FBRSxTQUFTLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLHNFQUFnQixDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRTtRQUNuRSxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUM7S0FDMUI7SUFDRCxDQUFDLENBQUMsWUFBWSxDQUFDLFlBQVksRUFBRSxlQUFlLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQy9ELE1BQU0sS0FBSyxHQUFHLHFEQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxFQUFFLGdCQUFnQixDQUFDLEVBQUUsT0FBTyxDQUFDO0lBQ2hFLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsV0FBVyxDQUFDO0lBQzVDLENBQUMsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDO0lBRXBCLGdHQUFnRztJQUNoRyxJQUFJLElBQUksSUFBSSxJQUFJLEVBQUU7UUFDZCxnREFBRSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtZQUN2RCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLEtBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRTtnQkFDcEYsR0FBRyxDQUFDLGNBQWMsRUFBRTthQUN2QjtRQUNMLENBQUMsQ0FBQztLQUNMO0lBRUQsTUFBTSxRQUFRLEdBQUcscURBQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxVQUFVLEVBQUUsZ0JBQWdCLEVBQUUsT0FBTyxDQUFDLEVBQUUsTUFBTSxDQUFDO0lBQzlFLG9EQUFNLENBQUMsUUFBUSxDQUFDO0lBQ2hCLE1BQU0sRUFBRSxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUMsRUFBRTtJQUM5QixRQUFRLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUU7UUFDekMsSUFBSSxHQUFHLENBQUMsS0FBSyxLQUFLLENBQUMsRUFBRSxFQUFFLGNBQWM7WUFDakMsSUFBSSxLQUFLLEdBQUcsSUFBSTtZQUNoQixJQUFJLFNBQVMsSUFBSSxJQUFJLEVBQUUsRUFBRSxZQUFZO2dCQUNqQyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFO29CQUM5QixTQUFTLENBQUMsSUFBSSxHQUFHLEtBQUs7aUJBQ3pCO3FCQUFNO29CQUNILEtBQUssR0FBRyxLQUFLO29CQUNiLFNBQVMsQ0FBQyxJQUFJLEdBQUcsSUFBSTtpQkFDeEI7Z0JBQ0QsNEVBQVMsRUFBRTthQUNkO2lCQUFNO2dCQUNILElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUU7b0JBQzlCLG9FQUFjLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQztpQkFDaEM7cUJBQU07b0JBQ0gsS0FBSyxHQUFHLEtBQUs7b0JBQ2IsK0RBQVMsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDO2lCQUMzQjtnQkFDRCw4REFBUSxFQUFFO2FBQ2I7WUFDRCxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEdBQUcsRUFBRTtnQkFDckQsVUFBVSxDQUFDLEdBQUcsRUFBRTtvQkFDWixRQUFRLENBQUMsZ0JBQWdCLENBQ3JCLHFCQUFxQixFQUFFLGFBQWEsRUFBRSxjQUFjLEVBQUUsUUFBUSxFQUFFLEVBQUUsQ0FDckUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTt3QkFDZixJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7b0JBQ2pDLENBQUMsQ0FBQztvQkFDRixJQUFJLEtBQUssRUFBRTt3QkFDUCxJQUFJLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7NEJBQzNFLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7eUJBQzNDO3FCQUNKO3lCQUFNO3dCQUNILElBQUksUUFBUSxDQUFDLGdCQUFnQixDQUFDLGlDQUFpQyxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTs0QkFDM0UsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQzt5QkFDeEM7cUJBQ0o7b0JBQ0Qsd0RBQU0sRUFBRTtnQkFDWixDQUFDLEVBQUUsR0FBRyxDQUFDO2FBQ1Y7aUJBQU07Z0JBQ0gsUUFBUSxDQUFDLGdCQUFnQixDQUNyQixxQkFBcUIsRUFBRSxhQUFhLEVBQUUsY0FBYyxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQ3JFLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7b0JBQ2YsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO2dCQUNqQyxDQUFDLENBQUM7Z0JBQ0YsSUFBSSxLQUFLLEVBQUU7b0JBQ1AsSUFBSSxRQUFRLENBQUMsZ0JBQWdCLENBQUMsaUNBQWlDLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO3dCQUMzRSxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO3FCQUMzQztpQkFDSjtxQkFBTTtvQkFDSCxJQUFJLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7d0JBQzNFLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUM7cUJBQ3hDO2lCQUNKO2FBQ0E7U0FDSjtJQUNMLENBQUMsQ0FBQztJQUNGLENBQUMsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDO0lBRXZCLCtEQUErRDtJQUMvRCxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUU7UUFDZCxNQUFNLE9BQU8sR0FBRyxxREFBTyxDQUFDLEdBQUcsRUFBRSxDQUFDLGdCQUFnQixFQUFFLGtCQUFrQixFQUFFLE9BQU8sQ0FBQyxFQUFFLFFBQVEsQ0FBQztRQUN2RixvREFBTSxDQUFDLE9BQU8sQ0FBQztRQUNmLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtZQUN4QyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUztnQkFBRSxPQUFNO1lBQ3pDLGtGQUFlLENBQUMsU0FBUyxDQUFDO1lBQzFCLDRFQUFTLEVBQUU7WUFDWCxJQUFJLFFBQVEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxFQUFFO2dCQUN6QyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsTUFBTTtnQkFDckMsTUFBTSxJQUFJLEdBQUcsc0RBQVEsQ0FBQyxZQUFZLENBQUM7Z0JBQ25DLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztnQkFDL0IsVUFBVSxDQUFDLEdBQUcsRUFBRTtvQkFDWixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNO2dCQUMvQixDQUFDLEVBQUUsR0FBRyxDQUFDO2FBQ1Y7WUFDRCxDQUFDLENBQUMsTUFBTSxFQUFFO1lBQ1Ysd0RBQU8sQ0FBQyxLQUFLLENBQUM7UUFDbEIsQ0FBQyxDQUFDO1FBQ0YsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUM7S0FDekI7SUFFRCxzQkFBc0I7SUFDdEIsTUFBTSxJQUFJLEdBQUcscURBQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSxPQUFPLENBQUMsRUFBRSxNQUFNLENBQUM7SUFDaEYsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFO1FBQ3JDLElBQUksR0FBRyxDQUFDLEtBQUssS0FBSyxDQUFDLEVBQUU7WUFDakIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDO1lBQ2hELElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztZQUMvQixnREFBRSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsaUJBQWlCLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztZQUN2RixJQUFJLENBQUMsTUFBTSxFQUFFO2dCQUNSLENBQUMsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFpQixDQUFDLEtBQUssRUFBRTthQUNwRDtZQUNELE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFnQjtZQUN0RCxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsTUFBTTtTQUMvQztJQUNMLENBQUMsQ0FBQztJQUNGLG9EQUFNLENBQUMsSUFBSSxDQUFDO0lBRVosQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7SUFFbkIsTUFBTSxLQUFLLEdBQUcsSUFBSSxJQUFJLENBQUMsMERBQVcsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDckQsTUFBTSxHQUFHLEdBQUcsVUFBVSxDQUFDLEdBQUcsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLDBEQUFXLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2pHLE1BQU0sS0FBSyxHQUFHLHFEQUFPLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFDaEMsVUFBVSxDQUFDLEtBQUssS0FBSyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyx3REFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLHdEQUFVLENBQUMsS0FBSyxDQUFDLFlBQVksd0RBQVUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO0lBQ2hILENBQUMsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDO0lBQ3BCLElBQUksVUFBVSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1FBQ25DLE1BQU0sV0FBVyxHQUFHLHFEQUFPLENBQUMsS0FBSyxFQUFFLGFBQWEsQ0FBQztRQUNqRCxVQUFVLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFVBQVUsRUFBRSxFQUFFO1lBQzFDLE1BQU0sQ0FBQyxHQUFHLHFEQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQXNCO1lBQzlELENBQUMsQ0FBQyxJQUFJLEdBQUcsNkRBQWdCLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hDLGtFQUFxQixDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO2dCQUMvQyxJQUFJLElBQUk7Z0JBQ1IsSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxFQUFFO29CQUN6QixDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ25DLElBQUksR0FBRyxxREFBTyxDQUFDLE1BQU0sRUFBRSxFQUFFLEVBQUUsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNqRDtxQkFBTTtvQkFDSCxJQUFJLEdBQUcscURBQU8sQ0FBQyxNQUFNLEVBQUUsRUFBRSxFQUFFLG1CQUFtQixDQUFDO2lCQUNsRDtnQkFDRCxDQUFDLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQztZQUN2QixDQUFDLENBQUM7WUFDRixXQUFXLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztRQUM5QixDQUFDLENBQUM7UUFDRixDQUFDLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQztLQUM3QjtJQUVELE1BQU0sSUFBSSxHQUFHLHFEQUFPLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFDOUIsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsbURBQW1ELEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDckYsTUFBTSxLQUFLLEdBQUcscURBQU8sQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLG9FQUFvRSxDQUFDO0lBQzNHLE1BQU0sQ0FBQyxHQUFHLGlGQUFZLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQztJQUNyQyxJQUFJLENBQUMsSUFBSSxJQUFJLEVBQUU7UUFDWCxNQUFNLENBQUMsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQzNDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUM7UUFDM0IsSUFBSSxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRSxFQUFFLGtCQUFrQjtZQUNwQyxvQkFBb0IsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDO1lBQzlCLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQztTQUNyQjtLQUNKO0lBRUQsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFO1FBQ25DLElBQUksU0FBUyxJQUFJLElBQUksRUFBRTtZQUNuQixTQUFTLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTO1lBQy9CLDRFQUFTLEVBQUU7U0FDZDthQUFNO1lBQ0gsZ0ZBQVcsQ0FBQyxVQUFVLENBQUMsRUFBRSxFQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7WUFDM0MsaUZBQVksRUFBRTtZQUNkLE1BQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDO1lBQ3hELEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUM7WUFDM0IsSUFBSSxvQkFBb0IsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLEVBQUU7Z0JBQ2hDLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQzthQUNsQztpQkFBTTtnQkFDSCxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7YUFDckM7U0FDSjtRQUNELElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLEtBQUssR0FBRztZQUFFLHdEQUFNLEVBQUU7SUFDakUsQ0FBQyxDQUFDO0lBRUYsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7SUFFbkIsTUFBTSxPQUFPLEdBQUcscURBQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxTQUFTLENBQUMsRUFBRSx5QkFBeUIsQ0FBQztJQUN0RixPQUFPLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtRQUNuQyx1RkFBa0IsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDO1FBQ2pDLGlGQUFZLEVBQUU7UUFDZCxJQUFJLENBQUMsU0FBUyxHQUFHLFVBQVUsQ0FBQyxJQUFJO1FBQ2hDLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQztRQUNsQyxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEdBQUc7WUFBRyx3REFBTSxFQUFFO0lBQ2xFLENBQUMsQ0FBQztJQUNGLEtBQUssQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDO0lBQzFCLENBQUMsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDO0lBRXBCLE1BQU0sSUFBSSxHQUFHLHFEQUFPLENBQUMsS0FBSyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDckMsd0VBQWMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO1FBQzNCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRTtZQUN0RCxNQUFNLEVBQUUsR0FBRyxxREFBTyxDQUFDLEtBQUssRUFBRSxDQUFDLGVBQWUsRUFBRSxnQkFBZ0IsRUFBRSxVQUFVLENBQUMsUUFBUSxDQUFDLEVBQy9EO2tEQUN1Qix3REFBVSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOzJGQUNlLEVBQ2hFLEtBQUssVUFBVSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ3hDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsSUFBSSxDQUFDO1lBQ25ELEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUM7WUFDM0Isb0JBQW9CLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUUzQixJQUFJLFVBQVUsQ0FBQyxLQUFLO2dCQUFFLEVBQUUsQ0FBQyxZQUFZLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ25GLEVBQUUsQ0FBQyxXQUFXLENBQUMscURBQU8sQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoRSxFQUFFLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtnQkFDOUIsRUFBRSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO2dCQUM3QixJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEdBQUc7b0JBQUUsd0RBQU0sRUFBRTtZQUNqRSxDQUFDLENBQUM7WUFDRixJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQztTQUNuQjtJQUNMLENBQUMsQ0FBQztJQUNGLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDO0lBRW5CLElBQUksQ0FBQyw4REFBZ0IsQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUM5RSxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUM7S0FDakM7SUFDRCxJQUFJLENBQUMsOERBQWdCLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDMUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDO0tBQ2pDO0lBQ0QsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUM7SUFDM0MsSUFBSSxLQUFLLENBQUMsR0FBRyxLQUFLLFNBQVM7UUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUM7SUFFMUUsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxHQUFHLElBQUksR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0lBQy9ELElBQUksS0FBSyxDQUFDLFVBQVUsQ0FBQyxHQUFHLEtBQUssU0FBUyxFQUFFO1FBQ3BDLElBQUksRUFBRSxJQUFJLENBQUMsb0RBQUssRUFBRSxHQUFHLHFFQUFpQixFQUFFLENBQUMsRUFBRTtZQUN2QyxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUM7U0FDOUI7S0FDSjtTQUFNO1FBQ0gsTUFBTSxPQUFPLEdBQUcsSUFBSSxJQUFJLEVBQUU7UUFDMUIsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEdBQUcscUVBQWlCLEVBQUUsQ0FBQztRQUN4RCxNQUFNLElBQUksR0FBRyxDQUFDLFVBQVUsQ0FBQyxRQUFRLEtBQUssTUFBTSxJQUFJLFVBQVUsQ0FBQyxLQUFLLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLDhEQUFnQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVHLE1BQU0sUUFBUSxHQUFHLHFFQUFpQixFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyw2REFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsSUFBSSxHQUFHLElBQUk7UUFDckYsSUFBSSwwREFBVyxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxPQUFPO1lBQ2pDLENBQUMsS0FBSyxDQUFDLEdBQUcsS0FBSyxTQUFTLElBQUksT0FBTyxDQUFDLE9BQU8sRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEdBQUcsUUFBUSxDQUFDLEVBQUU7WUFDbEYsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDO1NBQzlCO0tBQ0o7SUFFRCwwQkFBMEI7SUFDMUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsRUFBRTtRQUNyRCxDQUFDLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUU7WUFDaEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxzQkFBc0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDO2dCQUN0RCxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFO2dCQUNuRCxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7Z0JBQzFCLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQztnQkFDekIsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxHQUFHLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTO3NCQUN4RCxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJO2dCQUNwRCxDQUFDLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQztnQkFDdkMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLFFBQVE7Z0JBQ3ZDLE1BQU0sSUFBSSxHQUFHLHNEQUFRLENBQUMsWUFBWSxDQUFDO2dCQUNuQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUM7Z0JBQzVCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE9BQU87Z0JBQzVCLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQztnQkFDdkIseURBQVcsQ0FBQyxDQUFDLENBQUM7Z0JBQ2QsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDO2dCQUN2QixDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLElBQUk7Z0JBQ3JELFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxHQUFHLENBQUM7YUFDcEQ7UUFDTCxDQUFDLENBQUM7S0FDTDtJQUVELE9BQU8sQ0FBQztBQUNaLENBQUM7QUFFRCxnR0FBZ0c7QUFDaEcsOEZBQThGO0FBQzlGLHFGQUFxRjtBQUMvRSxlQUFnQixFQUFlO0lBQ2pDLElBQUksQ0FBQyxHQUFHLENBQUM7SUFDVCxJQUFJLENBQUMsR0FBRyxDQUFDO0lBRVQsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO1FBQ2hELElBQUksRUFBRSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQ2hDLENBQUMsR0FBRyxDQUFDO1NBQ1I7UUFDRCxJQUFJLEVBQUUsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRTtZQUNoQyxDQUFDLEdBQUcsQ0FBQztTQUNSO0lBQ0wsQ0FBQyxDQUFDO0lBQ0YsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQztBQUM3QixDQUFDO0FBRUQsc0VBQXNFO0FBQ2hFLHFCQUFzQixHQUFVO0lBQ2xDLEdBQUcsQ0FBQyxlQUFlLEVBQUU7SUFDckIsTUFBTSxFQUFFLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQXFCO0lBQzlELElBQUksRUFBRSxJQUFJLElBQUk7UUFBRSxPQUFNO0lBRXRCLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDO0lBQzFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQztJQUN4QixFQUFFLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDM0IsRUFBRSxDQUFDLFNBQVMsR0FBRyxDQUFDO0lBQ2hCLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxNQUFNO0lBQ3JDLE1BQU0sSUFBSSxHQUFHLHNEQUFRLENBQUMsWUFBWSxDQUFDO0lBQ25DLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztJQUMvQixVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ1osSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTTtRQUMzQixFQUFFLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDM0IsRUFBRSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQzdCLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLE1BQU07UUFDckIseURBQVcsQ0FBQyxFQUFFLENBQUM7UUFDZixFQUFFLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUM7SUFDNUIsQ0FBQyxFQUFFLElBQUksQ0FBQztBQUNaLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7QUNoWW1EO0FBRXBELGlHQUFpRztBQUNqRyxxRkFBcUY7QUFDckYsNkNBQTZDO0FBQzdDLEVBQUU7QUFDRixvR0FBb0c7QUFDcEcsb0dBQW9HO0FBQ3BHLDBFQUEwRTtBQUUxRSw4QkFBOEI7QUFDOUIsTUFBTSxLQUFLLEdBQUcsT0FBTztBQUNyQixNQUFNLEtBQUssR0FBRyxPQUFPO0FBQ3JCLE1BQU0sS0FBSyxHQUFHLE9BQU87QUFFckIsdUJBQXVCO0FBQ3ZCLE1BQU0sS0FBSyxHQUFHLFFBQVE7QUFDdEIsTUFBTSxLQUFLLEdBQUcsS0FBSztBQUVuQixNQUFNLENBQUMsR0FBRztJQUNOLENBQUMsTUFBTSxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsTUFBTSxDQUFDO0lBQzFCLENBQUMsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFHLE1BQU0sQ0FBQztJQUMxQixDQUFDLE1BQU0sRUFBRSxDQUFDLE1BQU0sRUFBRyxNQUFNLENBQUM7Q0FDN0I7QUFFRCxNQUFNLElBQUksR0FBRyxDQUFDLENBQVMsRUFBRSxFQUFFO0lBQ3ZCLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxFQUFFO1FBQzVCLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQ3BCO1NBQU07UUFDUCxPQUFPLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsS0FBSztLQUM5QjtBQUNMLENBQUM7QUFDRCxNQUFNLFVBQVUsR0FBRyxDQUFDLENBQVcsRUFBRSxDQUFXLEVBQUUsRUFBRTtJQUM1QyxJQUFJLEdBQUcsR0FBRyxDQUFDO0lBQ1gsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNmLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN0QixDQUFDLENBQUM7SUFDRixPQUFPLEdBQUc7QUFDZCxDQUFDO0FBQ0QsTUFBTSxVQUFVLEdBQUcsQ0FBQyxDQUFTLEVBQUUsRUFBRTtJQUM3QixNQUFNLENBQUMsR0FBRyxLQUFLO0lBQ2YsSUFBSSxDQUFDLElBQUksU0FBUyxFQUFFO1FBQ2hCLE9BQU8sS0FBSyxHQUFHLENBQUM7S0FDbkI7U0FBTTtRQUNILE9BQU8sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsS0FBSztLQUNoRDtBQUNMLENBQUM7QUFFRCxnQkFBZ0IsQ0FBUyxFQUFFLENBQVMsRUFBRSxDQUFTO0lBQzNDLE1BQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEdBQUc7SUFDM0IsTUFBTSxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztJQUM3QixNQUFNLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxJQUFJO0lBQzdCLE1BQU0sRUFBRSxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQzdCLE1BQU0sRUFBRSxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQzdCLE1BQU0sRUFBRSxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBRTdCLE1BQU0sS0FBSyxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7SUFFMUIsTUFBTSxFQUFFLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDOUMsTUFBTSxFQUFFLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDOUMsTUFBTSxFQUFFLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFFOUMscUJBQXFCO0lBQ3JCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBUyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3hFLE9BQU8sT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRztBQUM5QyxDQUFDO0FBRUQ7O0dBRUc7QUFDSCwwQkFBMEIsTUFBYztJQUNwQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRztBQUMzRCxDQUFDO0FBRUQsbUhBQW1IO0FBQzdHO0lBQ0YsSUFBSSxDQUFDLDhEQUFnQixDQUFDLFVBQVUsQ0FBQztRQUFFLE9BQU07SUFDekMsc0RBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxTQUFTLEdBQUcsOERBQWdCLENBQUMsVUFBVSxDQUFDO0lBQ3pELE1BQU0sUUFBUSxHQUFHLFlBQVksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxFQUFDLDRDQUE0QztJQUMxRyxJQUFJLFFBQVEsSUFBSSxJQUFJLEVBQUU7UUFDbEIsTUFBTSxFQUFFLEdBQUcsTUFBTSxDQUFDLEVBQUUsRUFBRSxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLG9CQUFvQjtRQUN4RyxzREFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxlQUFlLEdBQUcsRUFBRTtRQUMvQyxzREFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQztLQUM3RDtBQUNMLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3BGK0I7QUFDQztBQUVqQyxNQUFNLE1BQU0sR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDO0FBRTdGLG9CQUFxQixFQUFVO0lBQ2pDLE1BQU0sRUFBRSxHQUFHLHFEQUFPLENBQUMsU0FBUyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDO0lBQy9DLE1BQU0sUUFBUSxHQUFHLHFEQUFPLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBcUI7SUFDakUsTUFBTSxFQUFFLEdBQUcsUUFBUSxDQUFDLFNBQVMsRUFBRTtJQUMvQixvQ0FBb0M7SUFDcEMsS0FBSyxJQUFJLEdBQUcsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUU7UUFBRSxFQUFFLENBQUMsVUFBVSxFQUFFO0lBQ2pELEVBQUUsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDO0lBRXhCLE9BQU8sRUFBRTtBQUNiLENBQUM7QUFFSyxtQkFBb0IsQ0FBTztJQUM3QixNQUFNLEdBQUcsR0FBRyxxREFBTyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQztJQUM5QyxHQUFHLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7SUFDbEQsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLEdBQUcsSUFBSSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUMsS0FBSyxvREFBSyxFQUFFLEVBQUU7UUFDcEYsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDO0tBQzNCO0lBRUQsTUFBTSxLQUFLLEdBQUcscURBQU8sQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztJQUM1RCxHQUFHLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQztJQUV0QixNQUFNLElBQUksR0FBRyxxREFBTyxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0lBQ3pELEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDO0lBRXJCLE9BQU8sR0FBRztBQUNkLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDOUIyQztBQUNxQjtBQUVqRSxxRUFBcUU7QUFDckUsTUFBTSxTQUFTLEdBQUc7SUFDZCxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUM7SUFDWixFQUFFLEVBQUUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQztJQUMzQixRQUFRLEVBQUUsQ0FBQyxVQUFVLEVBQUUsV0FBVyxFQUFFLFVBQVUsQ0FBQztDQUNsRDtBQUVELE1BQU0sT0FBTyxHQUFHLHNEQUFRLENBQUMsU0FBUyxDQUFxQjtBQUVqRCx1QkFBd0IsR0FBVyxFQUFFLFNBQWtCLElBQUk7SUFDN0QsSUFBSSxNQUFNLEVBQUU7UUFDUixzREFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDO0tBQ3BDO0lBRUQsTUFBTSxVQUFVLEdBQUcsR0FBRyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUM7SUFDdkMsSUFBSSxVQUFVLEtBQUssQ0FBQyxDQUFDLEVBQUU7UUFDbkIsTUFBTSxXQUFXLEdBQUcsR0FBRyxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsVUFBVSxHQUFHLENBQUMsQ0FBQztRQUN4RCxNQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsV0FBVyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUM7UUFDcEYsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsRUFBRSxFQUFFO1lBQ25ELElBQUksUUFBUSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtnQkFDakMsSUFBSSxJQUFJLEtBQUssS0FBSyxFQUFFO29CQUNoQixNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFO3dCQUN2QyxzREFBUSxDQUFDLE1BQU0sT0FBTyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztvQkFDeEQsQ0FBQyxDQUFDO29CQUNGLHVEQUFVLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTt3QkFDekIsTUFBTSxFQUFFLEdBQUcsV0FBVyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsRUFBRTt3QkFDN0MsSUFBSSxVQUFVLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxFQUFFOzRCQUNqQyxNQUFNLENBQUMsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQzs0QkFDckMsSUFBSSxDQUFDLEVBQUU7Z0NBQ0gsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDOzZCQUM1QjtpQ0FBTTtnQ0FDSCxNQUFNLFNBQVMsR0FBRyxxREFBTyxDQUFDLEtBQUssRUFBRSxDQUFDLFVBQVUsRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLEVBQzFELDBEQUEwRCxHQUFHLFNBQVMsRUFBRSxFQUFFLENBQUM7Z0NBQy9FLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dDQUNyRCxzREFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUM7NkJBQzdDO3lCQUNKOzZCQUFNOzRCQUNILHNEQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQ2xDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzt5QkFDNUU7b0JBQ0wsQ0FBQyxDQUFDO2lCQUNMO2FBQ0o7UUFDTCxDQUFDLENBQUM7S0FDTDtJQUVELFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRTtRQUNsRCxFQUFFLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7SUFDakMsQ0FBQyxDQUFDO0lBQ0YsSUFBSSxDQUFDLEdBQUcsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRTtRQUN0RCxTQUFTLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUM7UUFDOUIsU0FBUyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDO1FBQzVCLFNBQVMsQ0FBQyxVQUFVLEVBQUUsVUFBVSxFQUFFLEtBQUssQ0FBQztLQUMzQztTQUFNO1FBQ0gsTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUM7UUFDdEMsSUFBSSxRQUFRLEdBQUcsU0FBUyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztRQUNqRSxNQUFNLFNBQVMsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFO1FBQ3pFLFFBQVEsR0FBRyxRQUFRLENBQUMsV0FBVyxFQUFFO1FBQ2pDLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLEVBQUUsRUFBRTtZQUNuRCxJQUFJLEtBQUssR0FBZ0IsSUFBSTtZQUM3QixRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7Z0JBQ25CLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLFFBQVEsRUFBRTtvQkFDMUMsS0FBSyxHQUFHLENBQUM7aUJBQ1o7WUFDTCxDQUFDLENBQUM7WUFDRixJQUFJLEtBQUssRUFBRTtnQkFDUCxTQUFTLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxTQUFTLENBQUM7YUFDcEM7aUJBQU07Z0JBQ0gsc0RBQVEsQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7YUFDcEQ7UUFDTCxDQUFDLENBQUM7S0FDTDtBQUNMLENBQUM7QUFFRCxtQkFBbUIsSUFBWSxFQUFFLEtBQWEsRUFBRSxVQUFtQjtJQUMvRCxJQUFJLElBQUksS0FBSyxLQUFLLElBQUksSUFBSSxLQUFLLElBQUksSUFBSSxJQUFJLEtBQUssVUFBVSxFQUFFO1FBQ3hELE1BQU0sSUFBSSxLQUFLLENBQUMsa0JBQWtCLENBQUM7S0FDdEM7SUFFRCxNQUFNLEVBQUUsR0FBRyxzREFBUSxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUM7SUFDakMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDO0lBQzFCLGdEQUFFLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsOERBQWdCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUs7SUFDakcsTUFBTSxRQUFRLEdBQWEsRUFBRTtJQUM3QixTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7UUFDMUIsSUFBSSxDQUFDLEtBQUssS0FBSyxFQUFFO1lBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO1NBQUU7SUFDckQsQ0FBQyxDQUFDO0lBQ0YsZ0RBQUUsQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFO0FBQ3RILENBQUM7QUFFRCxxQkFBcUIsWUFBb0I7SUFDckMsT0FBTyxDQUFDLEdBQVUsRUFBRSxFQUFFO1FBQ2xCLE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxLQUFLO1FBQ3pCLE1BQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDO1FBQ3RDLE1BQU0sUUFBUSxHQUFHLFNBQVMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQztRQUNyRCxhQUFhLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsR0FBRyxZQUFZLEdBQUcsR0FBRyxDQUFDO1FBQzlFLE9BQU8sT0FBTyxDQUFDLEtBQUssRUFBRTtJQUMxQixDQUFDO0FBQ0wsQ0FBQztBQUVELDREQUE0RDtBQUM1RCxRQUFRLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7SUFDOUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxXQUFXLENBQUMsZ0RBQUUsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDekYsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7OztBQ3pHOEI7QUFDRTtBQUVsQyxNQUFNLGNBQWMsR0FBRyx3REFBd0Q7TUFDeEQsdURBQXVEO0FBQzlFLE1BQU0sZ0JBQWdCLEdBQUcsbUJBQW1CO0FBQzVDLE1BQU0sZ0JBQWdCLEdBQUcsZ0RBQWdEO0FBRXpFLE1BQU0sUUFBUSxHQUFHLENBQUMsRUFBVSxFQUFFLEVBQUUsQ0FBQyxzREFBUSxDQUFDLEVBQUUsQ0FBb0I7QUFFaEUsMEVBQTBFO0FBQ3BFLHNCQUF1QixDQUFRO0lBQ2pDLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDO0lBQ2xDLE1BQU0sU0FBUyxHQUFHLFlBQVksQ0FBQyxDQUFDLE9BQU8sWUFBWSxDQUFDLENBQUMsS0FBSyxJQUFLLENBQVMsQ0FBQyxVQUFVLElBQUk7VUFDckUsWUFBWSxTQUFTLENBQUMsU0FBUyxjQUFjLDRDQUFPLEVBQUU7SUFDeEUsc0RBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDO0lBQ3BFLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLEdBQUcsY0FBYyxHQUFHLGdCQUFnQixHQUFHLGtCQUFrQixDQUFDLFNBQVMsQ0FBQztJQUNoRyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUMsSUFBSTtRQUN4QixnQkFBZ0IsR0FBRyxRQUFRLEdBQUcsa0JBQWtCLENBQUMsdUNBQXVDLFNBQVMsVUFBVSxDQUFDO0lBQ2hILHNEQUFRLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE9BQU87SUFDbkQsT0FBTyxzREFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDO0FBQ3BELENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7QUNuQkQ7QUFBQSxnRUFBZ0U7QUFDaEUsMkVBQTJFO0FBQzNFLElBQUksT0FBTyxHQUFHLEtBQUs7QUFDbkIsSUFBSSxTQUFTLEdBQWdCLElBQUk7QUFDM0I7SUFDRixNQUFNLFdBQVcsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUNuRyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsaUNBQWlDLENBQUMsQ0FBQztJQUNoRSxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3RCLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztRQUN2QyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7UUFDdkMsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUU7WUFBRSxPQUFPLENBQUM7U0FBRTtRQUMzQixJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRTtZQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQUU7UUFDNUIsT0FBTyxNQUFNLENBQUUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQXNCLENBQUMsS0FBSyxDQUFDO2NBQzNELE1BQU0sQ0FBRSxDQUFDLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBc0IsQ0FBQyxLQUFLLENBQUM7SUFDdEUsQ0FBQyxDQUFDO0lBQ0YsT0FBTyxXQUE0QjtBQUN2QyxDQUFDO0FBRUs7SUFDRixJQUFJLENBQUMsT0FBTyxFQUFFO1FBQ1YscUJBQXFCLENBQUMsTUFBTSxDQUFDO1FBQzdCLE9BQU8sR0FBRyxJQUFJO0tBQ2pCO0FBQ0wsQ0FBQztBQUVLO0lBQ0YsT0FBTyxHQUFHLElBQUk7SUFDZCw0RkFBNEY7SUFDNUYsd0NBQXdDO0lBQ3hDLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQ3pELENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQztJQUM1RSxJQUFJLE9BQU8sR0FBRyxDQUFDO0lBQ2YsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRTtRQUN4QixJQUFJLE1BQU0sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxFQUFFO1lBQUUsT0FBTyxHQUFHLEtBQUssR0FBRyxDQUFDO1NBQUU7SUFDdEQsQ0FBQyxDQUFDO0lBQ0YsTUFBTSxhQUFhLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDN0QsTUFBTSxHQUFHLEdBQWEsRUFBRTtJQUN4QixNQUFNLFdBQVcsR0FBRyxvQkFBb0IsRUFBRTtJQUMxQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ2xDLE1BQU0sR0FBRyxHQUFHLENBQUMsR0FBRyxPQUFPO1FBQ3ZCLEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzVCLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxVQUFVLENBQUMsWUFBWSxHQUFHLEVBQUU7SUFDdEQsQ0FBQyxDQUFDO0lBQ0YsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNsQyxNQUFNLEdBQUcsR0FBRyxDQUFDLEdBQUcsT0FBTztRQUN2QixVQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSTtRQUNwQyxVQUFVLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUc7UUFDckQsVUFBVSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHO0lBQzFFLENBQUMsQ0FBQztJQUNGLElBQUksU0FBUztRQUFFLFlBQVksQ0FBQyxTQUFTLENBQUM7SUFDdEMsU0FBUyxHQUFHLFVBQVUsQ0FBQyxHQUFHLEVBQUU7UUFDeEIsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDO1FBQ2QsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNsQyxNQUFNLEdBQUcsR0FBRyxDQUFDLEdBQUcsT0FBTztZQUN2QixJQUFJLENBQUMsR0FBRyxPQUFPLEVBQUU7Z0JBQ2IsYUFBYSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7YUFDekI7WUFDRCxHQUFHLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUM1QixhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksVUFBVSxDQUFDLFlBQVksR0FBRyxFQUFFO1FBQ3RELENBQUMsQ0FBQztRQUNGLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDbEMsVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUk7UUFDeEMsQ0FBQyxDQUFDO0lBQ04sQ0FBQyxFQUFFLEdBQUcsQ0FBQztJQUNQLE9BQU8sR0FBRyxLQUFLO0FBQ25CLENBQUM7Ozs7Ozs7Ozs7Ozs7OztBQ25FRDtBQUFBOztHQUVHO0FBRTJDO0FBY3hDLGtCQUFtQixPQUFlLEVBQUUsTUFBZSxFQUFFLENBQWM7SUFDckUsTUFBTSxLQUFLLEdBQUcscURBQU8sQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDO0lBQ3hDLE1BQU0sVUFBVSxHQUFHLHFEQUFPLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRSxPQUFPLENBQUM7SUFDeEQsS0FBSyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUM7SUFFN0IsSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsRUFBRTtRQUNqQyxNQUFNLE9BQU8sR0FBRyxxREFBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsTUFBTSxDQUFDO1FBQ3hDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO1lBQ25DLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztZQUNoQyxDQUFDLEVBQUU7UUFDUCxDQUFDLENBQUM7UUFDRixVQUFVLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQztLQUNsQztJQUVELE1BQU0sR0FBRyxHQUFHLEdBQUcsRUFBRTtRQUNmLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQztRQUNoQyx5REFBVyxDQUFDLEtBQUssQ0FBQztRQUNsQixLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUM7UUFDN0IsVUFBVSxDQUFDLEdBQUcsRUFBRTtZQUNaLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztZQUNoQyxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxFQUFFLEdBQUcsQ0FBQztRQUN6QyxDQUFDLEVBQUUsSUFBSSxDQUFDO0lBQ1YsQ0FBQztJQUVELE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDO0lBQ3BELElBQUksUUFBUSxJQUFJLElBQUksRUFBRTtRQUNsQixRQUFRLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDbkMsVUFBVSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUM7S0FDdkI7U0FBTTtRQUNILEdBQUcsRUFBRTtLQUNSO0FBQ0wsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7OztBQ2hERDtBQUFBOztHQUVHO0FBRUg7OztHQUdHO0FBQ0csbUJBQW9CLEtBQWE7SUFDbkMsTUFBTSxJQUFJLEdBQUcsS0FBSyxHQUFHLEdBQUc7SUFDeEIsTUFBTSxVQUFVLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzNFLElBQUksVUFBVTtRQUFFLE9BQU8sVUFBVSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3hELE9BQU8sRUFBRSxFQUFDLDRCQUE0QjtBQUN4QyxDQUFDO0FBRUg7Ozs7R0FJRztBQUNHLG1CQUFvQixLQUFhLEVBQUUsTUFBYyxFQUFFLE1BQWM7SUFDbkUsTUFBTSxDQUFDLEdBQUcsSUFBSSxJQUFJLEVBQUU7SUFDcEIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxNQUFNLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFDdkQsTUFBTSxPQUFPLEdBQUcsV0FBVyxDQUFDLENBQUMsV0FBVyxFQUFFLEVBQUU7SUFDNUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLE1BQU0sR0FBRyxJQUFJLEdBQUcsT0FBTztBQUN6RCxDQUFDO0FBRUg7OztHQUdHO0FBQ0csc0JBQXVCLEtBQWE7SUFDdEMsd0dBQXdHO0lBQ3hHLFFBQVEsQ0FBQyxNQUFNLEdBQUcsS0FBSyxHQUFHLDJDQUEyQztBQUN6RSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbkNLO0lBQ0YsT0FBTyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLElBQUksR0FBRyxFQUFFLEVBQUMsMEJBQTBCO0FBQ2xGLENBQUM7QUFFSyxtQkFBb0IsSUFBaUI7SUFDdkMsTUFBTSxHQUFHLEdBQUcsSUFBSSxZQUFZLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJO0lBQ3hELE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsR0FBRyxLQUFLLEVBQUUsQ0FBQyxHQUFHLElBQUksR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ3pELENBQUM7QUFFRCxpRUFBaUU7QUFDM0QscUJBQXNCLElBQVk7SUFDcEMsTUFBTSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUMsR0FBRyxLQUFLLEVBQUUsQ0FBQztJQUN2RCx1REFBdUQ7SUFDdkQsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxFQUFFO1FBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7S0FBRTtJQUN6QyxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFO1FBQ2xELENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDO1FBQ2QsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDZixDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztLQUNoQjtJQUNELE9BQU8sQ0FBQztBQUNaLENBQUM7QUFFSztJQUNGLE9BQU8sU0FBUyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUM7QUFDaEMsQ0FBQztBQUVEOztHQUVHO0FBQ0csa0JBQW1CLEtBQVcsRUFBRSxHQUFTLEVBQUUsRUFBd0I7SUFDckUsb0NBQW9DO0lBQ3BDLEtBQUssTUFBTSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRTtRQUNsRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQ1I7QUFDTCxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2xDK0Y7QUFDbkM7QUFDTDtBQUNYO0FBQ1M7QUFDbUI7QUFDWDtBQUN3QjtBQUNYO0FBQzJCO0FBQ1o7QUFVMUYsTUFBTSxhQUFhLEdBQUc7SUFDbEIsR0FBRyxFQUFFLENBQUMsSUFBVSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBSSxHQUFHLElBQUk7SUFDckMsRUFBRSxFQUFFLENBQUMsSUFBVSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUU7UUFDRixFQUFFLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO1FBQ2QsRUFBRSxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUNkLEVBQUUsR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7UUFDZCxFQUFFLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO1FBQ2QsRUFBRSxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUNkLEVBQUUsQ0FBZSxXQUFXO0tBQzVCLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ3BDLEVBQUUsRUFBRSxDQUFDLElBQVUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLElBQUksR0FBRyxJQUFJO0NBQ3ZDO0FBQ0QsTUFBTSxrQkFBa0IsR0FBRyxDQUFDLGFBQWEsRUFBRSxhQUFhLENBQUM7QUFFekQsSUFBSSxNQUFNLEdBQUcsQ0FBQyxFQUFDLHFFQUFxRTtBQUU5RTtJQUNGLE9BQU8sTUFBTTtBQUNqQixDQUFDO0FBRUssc0JBQXVCLElBQVU7SUFDbkMsTUFBTSxlQUFlLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQztJQUMvRCxJQUFJLGVBQWUsS0FBSyxLQUFLLElBQUksZUFBZSxLQUFLLElBQUksSUFBSSxlQUFlLEtBQUssSUFBSSxFQUFFO1FBQ25GLE9BQU8sYUFBYSxDQUFDLGVBQWUsQ0FBQyxDQUFDLElBQUksQ0FBQztLQUM5QztTQUFNO1FBQ0gsT0FBTyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQztLQUNqQztBQUNMLENBQUM7QUFFRCwwQkFBMEIsSUFBc0I7SUFDNUMsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1FBQ2hCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUMsZ0JBQWdCO1FBQ2pGLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUMsZUFBZTtRQUU5RSxNQUFNLElBQUksR0FBRyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsQ0FBQyxXQUFXLEVBQUUsRUFBQywwQkFBMEI7UUFFbEUsMkVBQTJFO1FBQzNFLE1BQU0sS0FBSyxHQUFHLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxDQUFDLFFBQVEsRUFBRTtRQUVyQyx5REFBeUQ7UUFDekQsTUFBTSxLQUFLLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQywwREFBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUNsRywyRkFBMkY7UUFDM0YsTUFBTSxHQUFHLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQywwREFBVyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBQ3JHLE9BQU8sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFO0tBQ3RCO1NBQU07UUFDTCxNQUFNLE9BQU8sR0FBRyxJQUFJLElBQUksRUFBRTtRQUMxQixNQUFNLEtBQUssR0FBRyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLEVBQUUsT0FBTyxDQUFDLFFBQVEsRUFBRSxFQUFFLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNwRixNQUFNLEdBQUcsR0FBRyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLEVBQUUsT0FBTyxDQUFDLFFBQVEsRUFBRSxFQUFFLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNsRixPQUFPLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRTtLQUN0QjtBQUNQLENBQUM7QUFFRCw2QkFBNkIsVUFBdUIsRUFBRSxLQUFXLEVBQUUsR0FBUyxFQUMvQyxTQUE2QjtJQUN0RCxNQUFNLEtBQUssR0FBdUIsRUFBRTtJQUNwQyxJQUFJLCtEQUFnQixDQUFDLGdCQUFnQixDQUFDLEtBQUssVUFBVSxFQUFFO1FBQ25ELE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxFQUFFLDBEQUFXLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQzVFLE1BQU0sQ0FBQyxHQUFHLFVBQVUsQ0FBQyxHQUFHLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxFQUFFLDBEQUFXLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQzNHLE1BQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUMscUNBQXFDO1FBQ25GLE1BQU0sWUFBWSxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUMseUNBQXlDO1FBRXpGLE1BQU0sRUFBRSxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztRQUN0QixFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsR0FBRyxZQUFZLENBQUMsRUFBQyxpQ0FBaUM7UUFFekUsb0NBQW9DO1FBQ3BDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksR0FBRyxZQUFZLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUM5QyxNQUFNLE9BQU8sR0FBRyxJQUFJLElBQUksQ0FBQyxFQUFFLENBQUM7WUFDNUIsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBRXRDLE1BQU0sT0FBTyxHQUFHLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQztZQUNqQyxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDdEMsS0FBSyxDQUFDLElBQUksQ0FBQztnQkFDUCxVQUFVO2dCQUNWLEtBQUssRUFBRSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztnQkFDL0MsR0FBRyxFQUFFLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO2dCQUM3QyxNQUFNLEVBQUUsT0FBTyxDQUFDLFNBQVMsQ0FBQztnQkFDMUIsU0FBUzthQUNaLENBQUM7WUFDRixDQUFDLElBQUksQ0FBQztTQUNUO0tBQ0o7U0FBTSxJQUFJLCtEQUFnQixDQUFDLGdCQUFnQixDQUFDLEtBQUssT0FBTyxFQUFFO1FBQ3ZELE1BQU0sQ0FBQyxHQUFHLDBEQUFXLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQztRQUN2QyxJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxLQUFLLENBQUMsT0FBTyxFQUFFLEVBQUU7WUFDaEMsS0FBSyxDQUFDLElBQUksQ0FBQztnQkFDUCxVQUFVO2dCQUNWLEtBQUssRUFBRSxDQUFDO2dCQUNSLEdBQUcsRUFBRSxDQUFDO2dCQUNOLE1BQU0sRUFBRSxPQUFPLENBQUMsU0FBUyxDQUFDO2dCQUMxQixTQUFTO2FBQ1osQ0FBQztTQUNMO0tBQ0o7U0FBTSxJQUFJLCtEQUFnQixDQUFDLGdCQUFnQixDQUFDLEtBQUssS0FBSyxFQUFFO1FBQ3JELE1BQU0sQ0FBQyxHQUFHLFVBQVUsQ0FBQyxHQUFHLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQywwREFBVyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUM7UUFDckYsTUFBTSxFQUFFLEdBQUcsQ0FBQyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsMERBQVcsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUQsSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLElBQUksR0FBRyxDQUFDLE9BQU8sRUFBRSxFQUFFO1lBQy9CLEtBQUssQ0FBQyxJQUFJLENBQUM7Z0JBQ1AsVUFBVTtnQkFDVixLQUFLLEVBQUUsRUFBRTtnQkFDVCxHQUFHLEVBQUUsQ0FBQztnQkFDTixNQUFNLEVBQUUsT0FBTyxDQUFDLFNBQVMsQ0FBQztnQkFDMUIsU0FBUzthQUNaLENBQUM7U0FDTDtLQUNKO0lBRUQsT0FBTyxLQUFLO0FBQ2hCLENBQUM7QUFFRCwrRkFBK0Y7QUFDekYsaUJBQWtCLFdBQW9CLElBQUk7SUFDNUMsT0FBTyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztJQUMvQixJQUFJO1FBQ0EsTUFBTSxJQUFJLEdBQUcsb0RBQU8sRUFBRTtRQUN0QixJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ1AsTUFBTSxJQUFJLEtBQUssQ0FBQywyREFBMkQsQ0FBQztTQUMvRTtRQUVELFFBQVEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztRQUM5RSxNQUFNLElBQUksR0FBRyxpREFBRSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDL0MsTUFBTSxLQUFLLEdBQWlDLEVBQUU7UUFFOUMsTUFBTSxTQUFTLEdBQUcsWUFBWSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUM7UUFFMUMsTUFBTSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUMsR0FBRyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUM7UUFFM0Msc0VBQXNFO1FBQ3RFLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUMvQyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUUvQyxzREFBc0Q7UUFDdEQsTUFBTSxRQUFRLEdBQUcsK0RBQWdCLENBQUMsTUFBTSxDQUFxQjtRQUM3RCxJQUFJLEVBQUUsR0FBcUIsSUFBSTtRQUMvQix1REFBUSxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRTtZQUN2QixJQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLEVBQUU7Z0JBQ2xCLE1BQU0sRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxFQUFDLHdEQUF3RDtnQkFDdEcsRUFBRSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDO2dCQUNoQyxJQUFJLEVBQUUsSUFBSSxJQUFJLEVBQUU7b0JBQ1osRUFBRSxHQUFHLHVFQUFVLENBQUMsRUFBRSxDQUFDO29CQUNuQixJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQztpQkFDdkI7YUFDSjtZQUVELElBQUksQ0FBQyxFQUFFO2dCQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsZ0NBQWdDLENBQUMsaUJBQWlCLENBQUM7WUFDNUUsSUFBSSxFQUFFLENBQUMsc0JBQXNCLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtnQkFDdkQsRUFBRSxDQUFDLFdBQVcsQ0FBQyxzRUFBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQy9CO1lBRUQsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxHQUFHLEVBQUU7UUFDM0IsQ0FBQyxDQUFDO1FBRUYsNENBQTRDO1FBQzVDLE1BQU0sS0FBSyxHQUF1QixFQUFFO1FBQ3BDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsVUFBVSxFQUFFLEdBQUcsRUFBRSxFQUFFO1lBQ3pDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxtQkFBbUIsQ0FBQyxVQUFVLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBRTFELGlCQUFpQjtZQUNqQixJQUFJLFFBQVEsSUFBSSxJQUFJLEVBQUU7Z0JBQ2xCLE1BQU0sYUFBYSxHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLFVBQVUsQ0FBQyxFQUFFLENBQUM7Z0JBQzlFLElBQUksYUFBYSxFQUFFO29CQUNmLElBQUksYUFBYSxDQUFDLElBQUksS0FBSyxVQUFVLENBQUMsSUFBSSxFQUFFO3dCQUN4QyxxRUFBVyxDQUFDLE1BQU0sRUFBRSxhQUFhLEVBQUUsSUFBSSxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQ3ZDLGFBQWEsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO3dCQUM1Rix1RkFBa0IsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUMsMENBQTBDO3FCQUMvRTtvQkFDRCxRQUFRLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUM7aUJBQzlFO3FCQUFNO29CQUNILHFFQUFXLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRSxJQUFJLElBQUksRUFBRSxFQUFFLElBQUksQ0FBQztpQkFDbkQ7YUFDSjtRQUNMLENBQUMsQ0FBQztRQUVGLElBQUksUUFBUSxJQUFJLElBQUksRUFBRTtZQUNsQiwwRkFBMEY7WUFDMUYsUUFBUSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxVQUFVLEVBQUUsRUFBRTtnQkFDeEMscUVBQVcsQ0FBQyxRQUFRLEVBQUUsVUFBVSxFQUFFLElBQUksSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUN0QyxVQUFVLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztnQkFDdEYsb0VBQWMsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDO2dCQUM3Qix1RkFBa0IsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDO1lBQ3JDLENBQUMsQ0FBQztZQUVGLDRDQUE0QztZQUM1QyxzRUFBWSxFQUFFO1lBRWQsNENBQTRDO1lBQzVDLDhEQUFRLEVBQUU7WUFDVixpRkFBWSxFQUFFO1NBQ2pCO1FBRUQsNENBQTRDO1FBQzVDLDJFQUFRLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtZQUMxQixLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsbUJBQW1CLENBQUMsOEVBQVcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNyRixDQUFDLENBQUM7UUFFRixnQ0FBZ0M7UUFDaEMsTUFBTSxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUU7UUFDdkIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQzVDLE1BQU0sU0FBUyxHQUFHLEtBQUssSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRTtRQUUxRCx1QkFBdUI7UUFDdkIsTUFBTSxXQUFXLEdBQWlDLEVBQUU7UUFDcEQsTUFBTSxtQkFBbUIsR0FBa0MsRUFBRTtRQUM3RCxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLHNCQUFzQixDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsVUFBdUIsRUFBRSxFQUFFO1lBQ3BHLG1CQUFtQixDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVO1FBQ25ELENBQUMsQ0FBQztRQUVGLE1BQU0saUJBQWlCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDO1FBQy9ELEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtZQUNoQixNQUFNLE1BQU0sR0FBRyw0RUFBYSxDQUFDLENBQUMsQ0FBQztZQUMvQixFQUFFLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUM7WUFDcEMsSUFBSSxFQUFFLElBQUksSUFBSTtnQkFBRSxPQUFNO1lBRXRCLE1BQU0sQ0FBQyxHQUFHLCtFQUFnQixDQUFDLENBQUMsRUFBRSxJQUFJLENBQUM7WUFFbkMsbUVBQW1FO1lBQ25FLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsK0RBQWdCLENBQUMsVUFBVSxDQUFDLEVBQUU7Z0JBQzVDLElBQUksR0FBRyxHQUFHLENBQUM7Z0JBQ1gsb0NBQW9DO2dCQUNwQyxPQUFPLElBQUksRUFBRTtvQkFDVCxJQUFJLEtBQUssR0FBRyxJQUFJO29CQUNoQix1REFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRTt3QkFDM0QsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFOzRCQUN4QyxLQUFLLEdBQUcsS0FBSzt5QkFDaEI7b0JBQ0wsQ0FBQyxDQUFDO29CQUNGLElBQUksS0FBSyxFQUFFO3dCQUFFLE1BQUs7cUJBQUU7b0JBQ3BCLEdBQUcsRUFBRTtpQkFDUjtnQkFFRCw4REFBOEQ7Z0JBQzlELHVEQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFO29CQUMzRCxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztnQkFDaEMsQ0FBQyxDQUFDO2dCQUVGLHlGQUF5RjtnQkFDekYsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEdBQUcsSUFBSTtnQkFFckMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRTtvQkFDOUQsV0FBVyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEdBQUc7b0JBQ3pCLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLElBQUk7aUJBQ2pEO2FBQ0o7WUFFRCxtRkFBbUY7WUFDbkYsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLEdBQUcsSUFBSSxvREFBSyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLFFBQVEsS0FBSyxNQUFNO2dCQUNoRSxDQUFDLCtEQUFnQixDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxRQUFRLEtBQUssVUFBVSxDQUFDLENBQUMsRUFBRTtnQkFDbkYsTUFBTSxFQUFFLEdBQUcsc0RBQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxjQUFjLEVBQUUsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsRUFDbkU7MENBQ1UsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxRQUFRLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLFlBQVk7OzBEQUVsRCxDQUFDLENBQUMsVUFBVSxDQUFDLEtBQUs7NkNBQy9CLDZFQUFjLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7eURBQ3pCLHlEQUFVLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQ3RELE9BQU8sQ0FBQyxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDekMsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLEtBQUs7b0JBQUUsRUFBRSxDQUFDLFlBQVksQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUN2RixFQUFFLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtvQkFDOUIsTUFBTSxXQUFXLEdBQUcsS0FBSyxJQUFJLEVBQUU7d0JBQzNCLE1BQU0sMkRBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLEdBQUcsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEdBQUcsQ0FBQzt3QkFDbkYsQ0FBQyxDQUFDLEtBQUssRUFBRTtvQkFDYixDQUFDO29CQUNELElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLEtBQUssR0FBRyxFQUFFO3dCQUNqRCxXQUFXLEVBQUU7cUJBQ2hCO3lCQUFNO3dCQUNILGlEQUFFLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyx5QkFBeUIsQ0FBZ0IsQ0FBQyxDQUFDLEtBQUssRUFBRTt3QkFDNUUsVUFBVSxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUM7cUJBQy9CO2dCQUNMLENBQUMsQ0FBQztnQkFFRixJQUFJLHNFQUFnQixDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUU7b0JBQ25DLEVBQUUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQztpQkFDM0I7Z0JBQ0QsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxVQUFVLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQ2xFLElBQUksUUFBUSxFQUFFO29CQUNkLFFBQVEsQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDLFNBQVM7aUJBQ2hDO3FCQUFNO29CQUNILHVEQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQztpQkFDeEM7YUFDSjtZQUVELE1BQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxFQUFFLEdBQUcsTUFBTSxDQUFDO1lBQ2pFLElBQUksT0FBTyxJQUFJLElBQUksRUFBRSxFQUFFLDRCQUE0QjtnQkFDL0MsT0FBTyxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTO2dCQUMzQyxPQUFPLENBQUMsWUFBWSxDQUFDLFlBQVksRUFDN0IsQ0FBQyxDQUFDLE1BQU0sSUFBSSxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxzREFBUyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzNFLElBQUksQ0FBQyx5RkFBb0IsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFO29CQUN4QyxPQUFPLENBQUMsc0JBQXNCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxzQkFBc0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTO2lCQUN0RztnQkFDRCxpREFBRSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxTQUFTLEdBQUcsaURBQUUsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsU0FBUztnQkFDdkYsSUFBSSxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRTtvQkFDMUIsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2lCQUN6RTtnQkFDRCxvRUFBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQzVELG9FQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDbkQsa0JBQWtCLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUU7b0JBQzlCLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztvQkFDNUIsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUM7d0JBQUUsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO2dCQUMzRCxDQUFDLENBQUM7YUFDTDtpQkFBTTtnQkFDSCxJQUFJLENBQUMsQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLEVBQUU7b0JBQy9DLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsR0FBRyxJQUFJLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztvQkFDM0QsSUFBSSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsS0FBSyxLQUFLLEVBQUUsQ0FBQzt3QkFDM0IsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLEdBQUcsS0FBSyxTQUFTLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxHQUFHLElBQUksb0RBQUssRUFBRSxDQUFDLEVBQUU7d0JBQ2pFLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQzt3QkFDaEMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDO3dCQUMvQixDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxHQUFHLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQzt3QkFDNUYsTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUM7d0JBQ3ZDLElBQUksSUFBSSxFQUFFOzRCQUNOLENBQUMsQ0FBQyxZQUFZLENBQUMsc0RBQU8sQ0FBQyxPQUFPLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxJQUFJLENBQUM7NEJBQzFELElBQUksQ0FBQyxNQUFNLEVBQUU7eUJBQ2hCO3dCQUNELHVEQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO3FCQUM1QztpQkFDSjtxQkFBTTtvQkFBRSxFQUFFLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztpQkFBRTthQUMvQjtZQUNELE9BQU8sbUJBQW1CLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxFQUFFLEdBQUcsTUFBTSxDQUFDO1FBQ3hELENBQUMsQ0FBQztRQUVGLCtEQUErRDtRQUMvRCxNQUFNLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLEVBQUUsRUFBRTtZQUMvRCxJQUFJLFVBQVUsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUN2Qyx1REFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO2FBQ3BEO1lBQ0QsVUFBVSxDQUFDLE1BQU0sRUFBRTtRQUN2QixDQUFDLENBQUM7UUFFRixrREFBa0Q7UUFDbEQsSUFBSSxXQUFXLENBQUMsU0FBUyxDQUFDLElBQUksSUFBSSxFQUFFO1lBQ2hDLElBQUksQ0FBQyxHQUFHLENBQUM7WUFDVCxNQUFNLEVBQUUsR0FBRyxDQUFDLElBQVksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDL0UsTUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQztZQUM3QixNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUU7Z0JBQ2hELE1BQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUM7Z0JBQ3hCLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO29CQUN6RixDQUFDLElBQUksR0FBRztpQkFDWDtZQUNMLENBQUMsQ0FBQztZQUNGLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxHQUFHLEdBQUcsRUFBRTtZQUM1QiwwRkFBMEY7WUFDMUYsSUFBSSxNQUFNLEdBQUcsRUFBRTtnQkFBRSxNQUFNLEdBQUcsQ0FBQztZQUMzQixJQUFJLFFBQVEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEdBQUcsQ0FBQztnQkFDN0QsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsRUFBRTtnQkFDdkMsbUJBQW1CO2dCQUNuQixNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUM7YUFDN0I7U0FDSjtRQUVELFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQ25DLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUM7UUFDOUUsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsS0FBSyxHQUFHLEVBQUUsRUFBRSxlQUFlO1lBQ2xFLGtFQUFNLEVBQUU7U0FDWDtLQUNKO0lBQUMsT0FBTyxHQUFHLEVBQUU7UUFDViw2RUFBWSxDQUFDLEdBQUcsQ0FBQztLQUNwQjtJQUNELE9BQU8sQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUM7QUFDdEMsQ0FBQztBQUVELHVFQUF1RTtBQUNqRSxzQkFBdUIsSUFBWTtJQUN2QyxNQUFNLEdBQUcsR0FBRyxJQUFJLElBQUksRUFBRTtJQUN0QixNQUFNLE1BQU0sR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQztJQUM5QixJQUFJLEdBQUcsQ0FBQyxPQUFPLEVBQUUsS0FBSyxNQUFNLENBQUMsT0FBTyxFQUFFLEVBQUU7UUFDdEMsSUFBSSxJQUFJLEdBQUcsSUFBSTtRQUNmLElBQUksRUFBRSxHQUFHLE1BQU0sQ0FBQyxRQUFRLEVBQUU7UUFDMUIsSUFBSSxFQUFFLEdBQUcsRUFBRSxFQUFFO1lBQ1gsSUFBSSxHQUFHLElBQUk7WUFDWCxFQUFFLElBQUksRUFBRTtTQUNUO1FBQ0QsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLFVBQVUsRUFBRTtRQUMvQixPQUFPLFlBQVksRUFBRSxJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxJQUFJLEVBQUU7S0FDOUQ7U0FBTTtRQUNMLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEdBQUcsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDLEdBQUcsSUFBSSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7UUFDakYsSUFBSSxRQUFRLEtBQUssQ0FBQyxFQUFFO1lBQUUsT0FBTyxXQUFXO1NBQUU7YUFBTTtZQUFFLE9BQU8sUUFBUSxHQUFHLFdBQVc7U0FBRTtLQUNsRjtBQUNILENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3pZRDtBQUFBLElBQUksY0FBYyxHQUFHLENBQUM7QUFFaEI7SUFDRixPQUFPLGNBQWM7QUFDekIsQ0FBQztBQUVLO0lBQ0YsY0FBYyxHQUFHLENBQUM7QUFDdEIsQ0FBQztBQUVLO0lBQ0YsY0FBYyxJQUFJLENBQUM7QUFDdkIsQ0FBQztBQUVLO0lBQ0YsY0FBYyxJQUFJLENBQUM7QUFDdkIsQ0FBQztBQUVLLDJCQUE0QixNQUFjO0lBQzVDLGNBQWMsR0FBRyxNQUFNO0FBQzNCLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3BCRDtBQUFBOztHQUVHO0FBRStDO0FBQ007QUFDUjtBQUNjO0FBQ2I7QUFDTjtBQUNQO0FBRXBDLE1BQU0sT0FBTyxHQUFHLCtCQUErQjtBQUMvQyxNQUFNLGVBQWUsR0FBRyxHQUFHLE9BQU8sMENBQTBDO0FBQzVFLE1BQU0sU0FBUyxHQUFHLEdBQUcsT0FBTyxxREFBcUQsa0JBQWtCLENBQUMsZUFBZSxDQUFDLEVBQUU7QUFDdEgsTUFBTSxlQUFlLEdBQUcsR0FBRyxPQUFPLG9DQUFvQztBQUN0RSxNQUFNLGdCQUFnQixHQUFHLEVBQUUsY0FBYyxFQUFFLG1DQUFtQyxFQUFFO0FBQ2hGLE1BQU0sYUFBYSxHQUFHLEtBQUs7QUFFM0IsTUFBTSxlQUFlLEdBQUcsc0RBQVEsQ0FBQyxVQUFVLENBQUM7QUFDNUMsTUFBTSxXQUFXLEdBQUcsc0RBQVEsQ0FBQyxPQUFPLENBQUM7QUFDckMsTUFBTSxlQUFlLEdBQUcsc0RBQVEsQ0FBQyxpQkFBaUIsQ0FBQztBQUNuRCxNQUFNLFlBQVksR0FBRyxzREFBUSxDQUFDLFlBQVksQ0FBQztBQUMzQyxNQUFNLFVBQVUsR0FBRyxzREFBUSxDQUFDLFVBQVUsQ0FBcUI7QUFDM0QsTUFBTSxVQUFVLEdBQUcsc0RBQVEsQ0FBQyxVQUFVLENBQXFCO0FBQzNELE1BQU0sYUFBYSxHQUFHLHNEQUFRLENBQUMsVUFBVSxDQUFxQjtBQUM5RCxNQUFNLGdCQUFnQixHQUFHLHNEQUFRLENBQUMsZ0JBQWdCLENBQUM7QUFFbkQsNkNBQTZDO0FBQzdDLE1BQU0sWUFBWSxHQUErQixFQUFFO0FBQ25ELE1BQU0sUUFBUSxHQUE4QixFQUFFO0FBQzlDLElBQUksVUFBVSxHQUFHLENBQUMsRUFBQyx1Q0FBdUM7QUFzQjFELGlFQUFpRTtBQUNqRSxFQUFFO0FBQ0YsOEZBQThGO0FBQzlGLEVBQUU7QUFDRiwrRkFBK0Y7QUFDL0Ysa0dBQWtHO0FBQ2xHLDBEQUEwRDtBQUUxRDs7OztHQUlHO0FBQ0ksS0FBSyxnQkFBZ0IsV0FBb0IsS0FBSyxFQUFFLElBQWE7SUFDaEUsSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsVUFBVSxHQUFHLGFBQWE7UUFBRSxPQUFNO0lBQ2hFLFVBQVUsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFO0lBRXZCLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLFNBQVM7SUFDbkQsT0FBTyxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQztJQUNwQyxJQUFJO1FBQ0EsTUFBTSxJQUFJLEdBQUcsTUFBTSxrREFBSSxDQUFDLGVBQWUsRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxlQUFlLENBQUM7UUFDcEYsT0FBTyxDQUFDLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQztRQUN2QyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO1lBQzFDLHdCQUF3QjtZQUN2QixJQUFJLENBQUMsUUFBeUIsQ0FBQyxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtnQkFDeEUsWUFBWSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxJQUFJLEVBQUU7WUFDeEMsQ0FBQyxDQUFDO1lBQ0YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQztZQUM3QixNQUFNLEVBQUUsR0FBRywwREFBUyxDQUFDLFVBQVUsQ0FBQyxFQUFDLDZEQUE2RDtZQUM3RCxxRUFBcUU7WUFDdEcsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO2dCQUNYLGVBQWUsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE9BQU87Z0JBQ3ZDLFdBQVcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQzthQUN0QztpQkFBTTtnQkFDSCxnRkFBZ0Y7Z0JBQ2hGLHdDQUF3QztnQkFDeEMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBcUIsQ0FBQzthQUMxRDtTQUNKO2FBQU07WUFDSCxnQkFBZ0I7WUFDaEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQ0FBaUMsQ0FBQztZQUM5QyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFO1lBQ3BCLFlBQVksQ0FBQyxVQUFVLEdBQUcsQ0FBQztZQUMzQixZQUFZLENBQUMsU0FBUyxHQUFHLDZEQUFZLENBQUMsQ0FBQyxDQUFDO1lBQ3hDLElBQUk7Z0JBQ0EsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7YUFDdkI7WUFBQyxPQUFPLEtBQUssRUFBRTtnQkFDWixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQztnQkFDbEIsNkVBQVksQ0FBQyxLQUFLLENBQUM7YUFDdEI7U0FDSjtLQUNKO0lBQUMsT0FBTyxLQUFLLEVBQUU7UUFDWixPQUFPLENBQUMsR0FBRyxDQUFDLDJFQUEyRSxFQUFFLEtBQUssQ0FBQztRQUMvRixxRUFBUSxDQUFDLGtDQUFrQyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDM0U7QUFDTCxDQUFDO0FBRUQ7Ozs7O0dBS0c7QUFDSSxLQUFLLGtCQUFrQixHQUEyQixFQUFFLFlBQXFCLEtBQUs7SUFDakYsV0FBVyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO0lBQ3RDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLEVBQUUsR0FBRyxDQUFDO0lBRTdELE1BQU0sU0FBUyxHQUFhLEVBQUUsRUFBQyx3QkFBd0I7SUFDdkQsWUFBWSxDQUFDLFFBQVEsR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLEtBQUs7SUFDckUsdUVBQVksRUFBRTtJQUNkLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7UUFDcEMseUZBQXlGO1FBQ3pGLGlDQUFpQztRQUNqQyxJQUFJLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7WUFDeEMsWUFBWSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsS0FBSztTQUNsRTtRQUNELElBQUksQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtZQUN4QyxZQUFZLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxLQUFLO1NBQ2xFO1FBQ0QsU0FBUyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsa0JBQWtCLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckYsQ0FBQyxDQUFDO0lBRUYsb0NBQW9DO0lBQ3BDLE9BQU8sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDO0lBQzFCLElBQUk7UUFDQSxNQUFNLElBQUksR0FBRyxNQUFNLGtEQUFJLENBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxnQkFBZ0IsRUFBRSxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLGVBQWUsQ0FBQztRQUN0RyxPQUFPLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQztRQUM3QixJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO1lBQzlDLHlGQUF5RjtZQUNyRixnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE9BQU87WUFDeEMsVUFBVSxDQUFDLEtBQUssR0FBRyxFQUFFO1lBRXJCLFdBQVcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQztZQUNuQyxlQUFlLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxPQUFPO1NBQzFDO2FBQU07WUFDSCw4QkFBOEI7WUFDOUIsSUFBSSxhQUFhLENBQUMsT0FBTyxFQUFFLEVBQUUseUNBQXlDO2dCQUNsRSxvRkFBb0Y7Z0JBQ3BGLG9FQUFvRTtnQkFDcEUsMERBQVMsQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxHQUFHLEdBQUcsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxDQUFDO2FBQ3BGO1lBQ0Qsb0NBQW9DO1lBQ3BDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDcEIsWUFBWSxDQUFDLFVBQVUsR0FBRyxDQUFDO1lBQzNCLFlBQVksQ0FBQyxTQUFTLEdBQUcsNkRBQVksQ0FBQyxDQUFDLENBQUM7WUFDeEMsSUFBSTtnQkFDQSxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFDLHNDQUFzQzthQUM5RDtZQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNSLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNkLDZFQUFZLENBQUMsQ0FBQyxDQUFDO2FBQ2xCO1NBQ0o7S0FDSjtJQUFDLE9BQU8sS0FBSyxFQUFFO1FBQ1gsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxRkFBcUY7WUFDckYsZ0RBQWdELEVBQUUsS0FBSyxDQUFDO0tBQ3hFO0FBQ0wsQ0FBQztBQUVLO0lBQ0YsT0FBUSxNQUFjLENBQUMsSUFBSTtBQUMvQixDQUFDO0FBRUs7SUFDRixNQUFNLElBQUksR0FBRyxPQUFPLEVBQUU7SUFDdEIsSUFBSSxDQUFDLElBQUk7UUFBRSxPQUFPLEVBQUU7SUFDcEIsT0FBTyxJQUFJLENBQUMsT0FBTztBQUN2QixDQUFDO0FBRUssaUJBQWtCLElBQXNCO0lBQ3pDLE1BQWMsQ0FBQyxJQUFJLEdBQUcsSUFBSTtBQUMvQixDQUFDO0FBRUQsd0ZBQXdGO0FBQ3hGLHVIQUF1SDtBQUN2SCx3RUFBd0U7QUFDeEUsdUJBQXVCLE9BQTBCO0lBQzdDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDO0lBQzNFLE9BQU8sQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRTtBQUNyRCxDQUFDO0FBRUQsbUhBQW1IO0FBQ25ILHVCQUF1QixPQUFvQjtJQUN2QyxNQUFNLFdBQVcsR0FBc0IsRUFBRTtJQUV6QyxnQkFBZ0I7SUFDaEIsTUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDeEQsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO1FBQ2IsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsRUFBRTtZQUM3QixXQUFXLENBQUMsSUFBSSxDQUFDO2dCQUNiLENBQUMsQ0FBQyxTQUFTO2dCQUNYLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUk7YUFDcEIsQ0FBQztTQUNMO0lBQ0wsQ0FBQyxDQUFDO0lBQ0YsT0FBTyxXQUFXO0FBQ3RCLENBQUM7QUFFRCwrRkFBK0Y7QUFDL0YsOEZBQThGO0FBQzlGLGFBQWE7QUFDYixnQkFBZ0IsSUFBWTtJQUN4QixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxNQUFNLENBQUM7Ozs7VUFJekIsRUFBRSxJQUFJLENBQ1gsRUFBRSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEVBQUU7UUFDckIsSUFBSSxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUN4RCxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLEVBQ2xFO1lBQ0UsT0FBTyxHQUFHO1NBQ2I7YUFBTTtZQUNILE9BQU8sWUFBWSxHQUFHLEtBQUssR0FBRyxNQUFNO1NBQ3ZDO0lBQ0wsQ0FBQyxDQUFDO0FBQ04sQ0FBQztBQUVELG9HQUFvRztBQUNwRyw4REFBOEQ7QUFDOUQsbUdBQW1HO0FBQ25HLDZGQUE2RjtBQUM3Rix5QkFBeUI7QUFDekIsZ0JBQWdCLE9BQWlDLEVBQUUsR0FBVyxFQUFFLEVBQVU7SUFDdEUsTUFBTSxFQUFFLEdBQUcsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDaEYsSUFBSSxDQUFDLEVBQUU7UUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLG1DQUFtQyxHQUFHLFdBQVcsRUFBRSxPQUFPLE9BQU8sRUFBRSxDQUFDO0lBQzdGLE9BQU8sRUFBaUI7QUFDNUIsQ0FBQztBQUVELDZCQUE2QixJQUFZO0lBQ3JDLE9BQU8sSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUM7QUFDL0UsQ0FBQztBQUVELGlDQUFpQyxJQUFZO0lBQ3pDLE9BQU8sSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUM7QUFDekUsQ0FBQztBQUVELHlCQUF5QixFQUFlO0lBQ3BDLE1BQU0sSUFBSSxHQUFHLE9BQU8sRUFBRTtJQUN0QixJQUFJLENBQUMsSUFBSTtRQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsNEJBQTRCLENBQUM7SUFFeEQsdUVBQXVFO0lBQ3ZFLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxFQUFFLEVBQUUsTUFBTSxFQUFFLFlBQVksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO0lBQ3JFLE1BQU0sZUFBZSxHQUFHLHdEQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN2RCxNQUFNLGFBQWEsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsd0RBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWU7SUFFNUYsNkNBQTZDO0lBQzdDLE1BQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQyxFQUFFLEVBQUUsTUFBTSxFQUFFLFVBQVUsQ0FBQztJQUN4QyxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsU0FBUztJQUV2Qix3RUFBd0U7SUFDeEUsTUFBTSxDQUFDLEdBQUcsZ0RBQUUsQ0FBQyxnREFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxVQUFVLENBQWdCO0lBQ3hELE1BQU0sSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsb0JBQW9CLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUU1RCxNQUFNLEVBQUUsR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFDLEVBQUMsc0NBQXNDO0lBRWxFLHlEQUF5RDtJQUN6RCxNQUFNLGNBQWMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztTQUNkLE9BQU8sQ0FBQyxxQkFBcUIsRUFBRSxFQUFFLENBQUM7U0FDbEMsT0FBTyxDQUFDLHdCQUF3QixFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRTtJQUV4RSxtSEFBbUg7SUFDbkgsTUFBTSxZQUFZLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQztJQUNuRCxJQUFJLENBQUMsWUFBWSxJQUFJLElBQUksQ0FBQyxFQUFFO1FBQ3hCLE1BQU0sSUFBSSxLQUFLLENBQUMsc0NBQXNDLEtBQUssSUFBSSxDQUFDO0tBQ25FO0lBQ0QsTUFBTSxjQUFjLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQztJQUN0QyxNQUFNLGtCQUFrQixHQUFHLHVCQUF1QixDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ2pHLElBQUksb0JBQW9CLEdBQUcsSUFBSTtJQUMvQixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRTtRQUN6QixJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7WUFDekIsb0JBQW9CLEdBQUcsR0FBRztZQUMxQixLQUFLLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQzVCLE9BQU8sSUFBSTtTQUNkO1FBQ0QsT0FBTyxLQUFLO0lBQ2hCLENBQUMsQ0FBQztJQUVGLElBQUksb0JBQW9CLEtBQUssSUFBSSxJQUFJLG9CQUFvQixLQUFLLENBQUMsQ0FBQyxFQUFFO1FBQzlELE1BQU0sSUFBSSxLQUFLLENBQUMsaUNBQWlDLEtBQUssaUJBQWlCLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUN6RjtJQUVELE1BQU0sZUFBZSxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsZUFBZSxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRTtJQUVwRyxnR0FBZ0c7SUFDaEcsd0RBQXdEO0lBQ3hELE1BQU0sWUFBWSxHQUFHLGVBQWUsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsZUFBZSxHQUFHLGFBQWEsQ0FBQztJQUUvRixPQUFPO1FBQ0gsS0FBSyxFQUFFLGVBQWU7UUFDdEIsR0FBRyxFQUFFLGFBQWE7UUFDbEIsV0FBVyxFQUFFLEVBQUU7UUFDZixJQUFJLEVBQUUsY0FBYztRQUNwQixJQUFJLEVBQUUsY0FBYztRQUNwQixRQUFRLEVBQUUsa0JBQWtCO1FBQzVCLEtBQUssRUFBRSxvQkFBb0I7UUFDM0IsS0FBSyxFQUFFLGVBQWU7UUFDdEIsRUFBRSxFQUFFLFlBQVk7S0FDbkI7QUFDTCxDQUFDO0FBRUQsb0dBQW9HO0FBQ3BHLGdHQUFnRztBQUNoRyxvQkFBb0I7QUFDcEIsZUFBZSxHQUFpQjtJQUM1QixPQUFPLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxFQUFDLHFEQUFxRDtJQUNuRixNQUFNLGdCQUFnQixHQUFhLEVBQUUsRUFBQyxvRUFBb0U7SUFDMUcsTUFBTSxJQUFJLEdBQXFCO1FBQzNCLE9BQU8sRUFBRSxFQUFFO1FBQ1gsV0FBVyxFQUFFLEVBQUU7UUFDZixTQUFTLEVBQUcsZ0RBQUUsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxVQUEwQixDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDO0tBQ2xILEVBQUMsa0VBQWtFO0lBQ3BFLE9BQU8sQ0FBQyxJQUFJLENBQUM7SUFFYixHQUFHLENBQUMsZ0JBQWdCLENBQUMsNEJBQTRCLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtRQUM3RCxRQUFRLENBQUUsQ0FBc0IsQ0FBQyxJQUFJLENBQUMsR0FBSSxDQUFzQixDQUFDLEtBQUssSUFBSSxFQUFFO0lBQ2hGLENBQUMsQ0FBQztJQUVGLHNHQUFzRztJQUN0RyxNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRSxXQUFXLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxPQUFPLENBQUM7SUFDL0UsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO1FBQ2xCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7SUFDbEMsQ0FBQyxDQUFDO0lBRUYsTUFBTSxXQUFXLEdBQUcsR0FBRyxDQUFDLHNCQUFzQixDQUFDLG1CQUFtQixDQUFDO0lBQ25FLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxZQUF5QixFQUFFLEVBQUU7UUFDcEUsTUFBTSxVQUFVLEdBQUcsZUFBZSxDQUFDLFlBQVksQ0FBQztRQUNoRCxJQUFJLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsRUFBRSxxREFBcUQ7WUFDdkcsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUM7WUFDcEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO1NBQ3BDO0lBQ0wsQ0FBQyxDQUFDO0lBRUYsT0FBTyxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUM7SUFFaEMsb0NBQW9DO0lBQ3BDLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUM7SUFFckMsd0RBQU8sRUFBRSxFQUFDLG1CQUFtQjtJQUM3QixZQUFZLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsRUFBQyx3QkFBd0I7QUFDcEYsQ0FBQztBQUVLLDBCQUEyQixNQUFjO0lBQzNDLE9BQU8sZUFBZSxHQUFHLE1BQU07QUFDbkMsQ0FBQztBQUVLLCtCQUFnQyxNQUFjO0lBQ2hELE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7UUFDbkMsTUFBTSxHQUFHLEdBQUcsSUFBSSxjQUFjLEVBQUU7UUFDaEMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDMUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxHQUFHLEVBQUU7WUFDZCxJQUFJLEdBQUcsQ0FBQyxNQUFNLEtBQUssR0FBRyxFQUFFO2dCQUNwQixNQUFNLElBQUksR0FBRyxHQUFHLENBQUMsaUJBQWlCLENBQUMsY0FBYyxDQUFDO2dCQUNsRCxJQUFJLElBQUksRUFBRTtvQkFDTixPQUFPLENBQUMsSUFBSSxDQUFDO2lCQUNoQjtxQkFBTTtvQkFDSCxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsc0JBQXNCLENBQUMsQ0FBQztpQkFDNUM7YUFDSjtRQUNMLENBQUM7UUFDRCxHQUFHLENBQUMsSUFBSSxFQUFFO0lBQ2QsQ0FBQyxDQUFDO0FBQ04sQ0FBQztBQUVLLG1CQUFvQixFQUF5QjtJQUMvQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksZUFBZTtBQUM1RCxDQUFDO0FBRUs7SUFDRixJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtRQUNsQyxzREFBUSxDQUFDLGdCQUFnQixDQUFDLENBQUMsS0FBSyxFQUFFO1FBQ2xDLFFBQVEsQ0FBQyxhQUFhLEdBQUcsa0VBQWtFO1FBQzNGLFFBQVEsQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztZQUN0QyxPQUFPLEVBQUUsV0FBVyxRQUFRLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxNQUFNO1NBQ3RHLENBQUM7UUFDRixRQUFRLENBQUMsNEVBQTRFO1lBQ2pGLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBQyxTQUFTLEVBQUUsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBQyxDQUFDO1FBQ2pFLFFBQVEsQ0FBQyxpQ0FBaUMsR0FBRyw2REFBNkQ7WUFDdEcsOEZBQThGO1FBQ2xHLE1BQU0sU0FBUyxHQUFhLEVBQUUsRUFBQyx3QkFBd0I7UUFDdkQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFO1lBQ3hDLFNBQVMsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZFLENBQUMsQ0FBQztRQUNGLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUNuQztBQUNMLENBQUM7QUFFSztJQUNGLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1FBQ2xDLDZEQUFZLENBQUMsVUFBVSxDQUFDO1FBQ3hCLHNEQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxLQUFLLEVBQUU7UUFDbEMsUUFBUSxDQUFDLGFBQWEsR0FBRywyREFBMkQ7UUFDcEYsUUFBUSxDQUFDLGVBQWUsR0FBRyxFQUFFO1FBQzdCLFFBQVEsQ0FBQyw0RUFBNEU7WUFDakYsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFDLFNBQVMsRUFBRSxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFDLENBQUM7UUFDakUsTUFBTSxTQUFTLEdBQWEsRUFBRSxFQUFDLHdCQUF3QjtRQUN2RCxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUU7WUFDeEMsU0FBUyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkUsQ0FBQyxDQUFDO1FBQ0YsS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ2pDO0FBQ1AsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzdaMEU7QUFFZDtBQUs3RCxNQUFNLHFCQUFxQixHQUFHLFVBQVU7QUFFeEMsSUFBSSxRQUFRLEdBQW1CLDhEQUFnQixDQUFDLHFCQUFxQixDQUFDLElBQUksRUFBRTtBQUV0RSxxQkFBc0IsSUFBa0IsRUFBRSxVQUF1QixFQUFFLElBQVUsRUFDdkQsV0FBb0IsRUFBRSxTQUFrQjtJQUNoRSxJQUFJLFdBQVc7UUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDekUsTUFBTSxFQUFFLEdBQUcsMkVBQWMsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxTQUFTLENBQUM7SUFDNUQsK0VBQWtCLENBQUMsRUFBRSxDQUFDO0FBQzFCLENBQUM7QUFFSztJQUNGLFFBQVEsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsR0FBRyxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUM7SUFDakUsK0RBQWlCLENBQUMscUJBQXFCLEVBQUUsUUFBUSxDQUFDO0FBQ3RELENBQUM7QUFFSztJQUNGLE9BQU8sUUFBUSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLEVBQUUsRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDO0FBQ2hFLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDekJzRTtBQUV2RSxNQUFNLG1CQUFtQixHQUFHLFlBQVk7QUFxQ3hDLElBQUksVUFBVSxHQUFxQiw4REFBZ0IsQ0FBQyxtQkFBbUIsQ0FBQztBQUVsRTtJQUNGLE9BQU8sVUFBVTtBQUNyQixDQUFDO0FBRUQsb0JBQW9CLElBQVk7SUFDNUIsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ2pDLE9BQU8sQ0FBQyx5Q0FBeUMsRUFBRSxFQUFFLENBQUM7U0FDdEQsT0FBTyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUM7QUFDdkMsQ0FBQztBQUVELGlHQUFpRztBQUNqRyxrR0FBa0c7QUFDbEcsUUFBUTtBQUVSLDhGQUE4RjtBQUM5RixrR0FBa0c7QUFDbEcscUVBQXFFO0FBQ3JFLHlCQUF5QixHQUFXO0lBQ2hDLElBQUksR0FBRyxLQUFLLEVBQUU7UUFBRSxPQUFPLElBQUk7SUFDM0IsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQW1CO0lBQzNDLE1BQU0sV0FBVyxHQUFnQixFQUFFO0lBQ25DLE1BQU0sZ0JBQWdCLEdBQW1DLEVBQUU7SUFDM0QsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFO1FBQ3hDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsR0FBRyxPQUFPO0lBQ2xELENBQUMsQ0FBQztJQUNGLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtRQUNoRCxNQUFNLGFBQWEsR0FBRyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ2xELFdBQVcsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLEdBQUc7WUFDL0IsSUFBSSxFQUFFLDRCQUE0QixhQUFhLENBQUMsSUFBSSxFQUFFO1lBQ3RELElBQUksRUFBRSxVQUFVLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQztZQUNwQyxNQUFNLEVBQUUsYUFBYSxDQUFDLGFBQWE7U0FDdEM7SUFDTCxDQUFDLENBQUM7SUFDRixPQUFPLFdBQVc7QUFDdEIsQ0FBQztBQUVLLDBCQUEyQixJQUFZO0lBQ3pDLElBQUk7UUFDQSxVQUFVLEdBQUcsZUFBZSxDQUFDLElBQUksQ0FBQztRQUNsQywrREFBaUIsQ0FBQyxtQkFBbUIsRUFBRSxJQUFJLENBQUM7UUFDNUMsc0RBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTTtRQUNsRCxzREFBUSxDQUFDLG1CQUFtQixDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxPQUFPO0tBQ3hEO0lBQUMsT0FBTyxDQUFDLEVBQUU7UUFDUixzREFBUSxDQUFDLGlCQUFpQixDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxPQUFPO1FBQ25ELHNEQUFRLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU07UUFDcEQsc0RBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsT0FBTztLQUNwRDtBQUNMLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3ZGNEQ7QUFFN0QsTUFBTSxtQkFBbUIsR0FBRyxPQUFPO0FBVW5DLE1BQU0sS0FBSyxHQUF3Qiw4REFBZ0IsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLEVBQUU7QUFFeEU7SUFDRixPQUFPLEtBQUs7QUFDaEIsQ0FBQztBQUVLO0lBQ0YsK0RBQWlCLENBQUMsbUJBQW1CLEVBQUUsS0FBSyxDQUFDO0FBQ2pELENBQUM7QUFFSyxvQkFBcUIsTUFBeUI7SUFDaEQsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7QUFDdEIsQ0FBQztBQUVLLHlCQUEwQixNQUF5QjtJQUNyRCxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7UUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLHFEQUFxRCxDQUFDO0lBQ25HLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDMUMsQ0FBQztBQUVLLHFCQUFzQixNQUF5QixFQUFFLElBQXNCO0lBQ3pFLElBQUksR0FBRyxHQUFnQixJQUFJO0lBQzNCLElBQUksTUFBTSxDQUFDLEtBQUssSUFBSSxJQUFJLEVBQUU7UUFDdEIsR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztLQUN2RTtJQUVELE9BQU87UUFDSCxLQUFLLEVBQUUsTUFBTTtRQUNiLFFBQVEsRUFBRSxNQUFNO1FBQ2hCLElBQUksRUFBRSxNQUFNO1FBQ1osV0FBVyxFQUFFLEVBQUU7UUFDZixLQUFLLEVBQUUsTUFBTSxDQUFDLEtBQUs7UUFDbkIsR0FBRyxFQUFFLE1BQU0sQ0FBQyxHQUFHLElBQUksU0FBUztRQUM1QixJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUk7UUFDakIsRUFBRSxFQUFFLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsS0FBSyxFQUFFO1FBQzFGLEtBQUssRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRztLQUNqQztBQUNMLENBQUM7QUFRSyx5QkFBMEIsSUFBWSxFQUFFLFNBQXVCLEVBQUU7SUFDbkUsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQywyREFBMkQsQ0FBQztJQUN0RixJQUFJLE1BQU0sSUFBSSxJQUFJO1FBQUUsT0FBTyxNQUFNO0lBRWpDLFFBQVEsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQ2YsS0FBSyxLQUFLO1lBQUUsTUFBTSxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFBQyxNQUFLO1FBQ3pDLEtBQUssSUFBSSxDQUFDO1FBQUMsS0FBSyxLQUFLLENBQUM7UUFBQyxLQUFLLFFBQVE7WUFBRSxNQUFNLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUFDLE1BQUs7UUFDbkUsS0FBSyxVQUFVLENBQUM7UUFBQyxLQUFLLFVBQVUsQ0FBQztRQUFDLEtBQUssV0FBVztZQUFFLE1BQU0sQ0FBQyxFQUFFLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQUMsTUFBSztLQUNuRjtJQUVELE9BQU8sZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUM7QUFDN0MsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3BFNEQ7QUFFN0QsTUFBTSxpQkFBaUIsR0FBRyxNQUFNO0FBRWhDLE1BQU0sSUFBSSxHQUFhLDhEQUFnQixDQUFDLGlCQUFpQixDQUFDLElBQUksRUFBRTtBQUUxRCx3QkFBeUIsRUFBVTtJQUNyQyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztJQUM5QixJQUFJLEtBQUssSUFBSSxDQUFDO1FBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0FBQ3pDLENBQUM7QUFFSyxtQkFBb0IsRUFBVTtJQUNoQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztBQUNqQixDQUFDO0FBRUs7SUFDRiwrREFBaUIsQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLENBQUM7QUFDOUMsQ0FBQztBQUVLLDBCQUEyQixFQUFVO0lBQ3ZDLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUM7QUFDNUIsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNyQjREO0FBRTdELE1BQU0scUJBQXFCLEdBQUcsVUFBVTtBQU14QyxNQUFNLFFBQVEsR0FBb0IsOERBQWdCLENBQUMscUJBQXFCLENBQUMsSUFBSSxFQUFFO0FBRXpFLDRCQUE2QixFQUFVO0lBQ3pDLE9BQU8sUUFBUSxDQUFDLEVBQUUsQ0FBQztBQUN2QixDQUFDO0FBRUs7SUFDRiwrREFBaUIsQ0FBQyxxQkFBcUIsRUFBRSxRQUFRLENBQUM7QUFDdEQsQ0FBQztBQUVLLDhCQUErQixFQUFVO0lBQzNDLE9BQU8sUUFBUSxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUM7QUFDdEMsQ0FBQztBQUVLLHNCQUF1QixFQUFVO0lBQ25DLE9BQU8sUUFBUSxDQUFDLEVBQUUsQ0FBQztBQUN2QixDQUFDO0FBRUsscUJBQXNCLEVBQVUsRUFBRSxJQUFZO0lBQ2hELFFBQVEsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJO0FBQ3ZCLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDNUJEO0FBQUE7O0dBRUc7QUFDRyxxQkFBc0IsRUFBZTtJQUN2QywrRkFBK0Y7SUFDL0Ysd0NBQXdDO0lBRXhDLGdEQUFnRDtJQUNoRCxFQUFFLENBQUMsWUFBWTtBQUNuQixDQUFDO0FBRUQ7O0dBRUc7QUFDRywwQkFBMkIsR0FBVztJQUN4QyxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDdEQsQ0FBQztBQUVEOztHQUVHO0FBQ0gsaUNBQWlDLEdBQVcsRUFBRSxRQUEwQyxFQUN2RCxPQUF1QyxFQUFFLElBQWtCO0lBQ3hGLE1BQU0sR0FBRyxHQUFHLElBQUksY0FBYyxFQUFFO0lBRWhDLDZFQUE2RTtJQUM3RSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUM7SUFFNUMsSUFBSSxRQUFRO1FBQUUsR0FBRyxDQUFDLFlBQVksR0FBRyxRQUFRO0lBRXpDLElBQUksT0FBTyxFQUFFO1FBQ1QsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtZQUNwQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNqRCxDQUFDLENBQUM7S0FDTDtJQUVELG9GQUFvRjtJQUNwRixHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztJQUNkLE9BQU8sR0FBRztBQUNkLENBQUM7QUFFRDs7Ozs7O0dBTUc7QUFDRyxjQUFlLEdBQVcsRUFBRSxRQUEwQyxFQUFFLE9BQXVDLEVBQ2hHLElBQWtCLEVBQUUsUUFBMkI7SUFFaEUsTUFBTSxHQUFHLEdBQUcsdUJBQXVCLENBQUMsR0FBRyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDO0lBRWpFLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7UUFFbkMsTUFBTSxhQUFhLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJO1FBQ3JFLElBQUksUUFBUSxJQUFJLGFBQWEsRUFBRTtZQUMzQixXQUFXLENBQUMsYUFBYSxDQUFDLEVBQUMsd0JBQXdCO1lBQ25ELFFBQVEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFDLDJCQUEyQjtZQUM1RCxJQUFJLGFBQWEsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxFQUFFO2dCQUNqRCxhQUFhLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUM7Z0JBQzdDLGFBQWEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQzthQUMvQztTQUNKO1FBRUQsMkZBQTJGO1FBQzNGLHVFQUF1RTtRQUN2RSxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLE1BQU07UUFDM0QsSUFBSSxZQUFZLEdBQUcsQ0FBQztRQUVwQixHQUFHLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUU7WUFDakMsbUZBQW1GO1lBQ25GLFlBQVksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUNsRCxJQUFJLFFBQVE7Z0JBQUUsUUFBUSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO1lBQ2pELDJCQUEyQjtZQUMzQixJQUFJLEdBQUcsQ0FBQyxNQUFNLEtBQUssR0FBRyxFQUFFO2dCQUNwQixPQUFPLENBQUMsR0FBRyxDQUFDO2FBQ2Y7aUJBQU07Z0JBQ0gsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7YUFDaEM7UUFDTCxDQUFDLENBQUM7UUFFRixHQUFHLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtZQUMvQixJQUFJLFFBQVE7Z0JBQUUsUUFBUSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO1lBQ2pELE1BQU0sQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDbEMsQ0FBQyxDQUFDO1FBRUYsSUFBSSxRQUFRLElBQUksYUFBYSxFQUFFO1lBQzNCLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtnQkFDckMsMEJBQTBCO2dCQUMxQixJQUFJLGFBQWEsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxFQUFFO29CQUNuRCxhQUFhLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUM7b0JBQy9DLGFBQWEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQztpQkFDN0M7Z0JBQ0QsWUFBWSxHQUFHLEdBQUcsQ0FBQyxNQUFNO2dCQUN6QixhQUFhLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHO1lBQ3RHLENBQUMsQ0FBQztTQUNMO0lBQ0wsQ0FBQyxDQUFDO0FBQ04sQ0FBQztBQUVEOztHQUVHO0FBQ0csa0JBQW1CLEVBQVU7SUFDL0IsTUFBTSxFQUFFLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUM7SUFDdEMsSUFBSSxFQUFFLElBQUksSUFBSTtRQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsa0NBQWtDLEVBQUUsRUFBRSxDQUFDO0lBQ3ZFLE9BQU8sRUFBRTtBQUNiLENBQUM7QUFFRDs7R0FFRztBQUNHLGlCQUFrQixHQUFXLEVBQUUsR0FBb0IsRUFBRSxJQUFrQixFQUFFLEVBQWdCO0lBQzNGLE1BQU0sQ0FBQyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDO0lBRXJDLElBQUksT0FBTyxHQUFHLEtBQUssUUFBUSxFQUFFO1FBQ3pCLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztLQUN2QjtTQUFNO1FBQ0gsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDekM7SUFFRCxJQUFJLElBQUk7UUFBRSxDQUFDLENBQUMsU0FBUyxHQUFHLElBQUk7SUFDNUIsSUFBSSxFQUFFO1FBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDO0lBRWhDLE9BQU8sQ0FBQztBQUNaLENBQUM7QUFFRDs7R0FFRztBQUNHLFlBQWdCLEdBQVc7SUFDN0IsSUFBSSxHQUFHLElBQUksSUFBSTtRQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsa0NBQWtDLENBQUM7SUFDcEUsT0FBTyxHQUFHO0FBQ2QsQ0FBQztBQUVLLGFBQWMsR0FBMEI7SUFDMUMsSUFBSSxHQUFHLElBQUksSUFBSTtRQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsOEJBQThCLENBQUM7SUFDaEUsT0FBTyxHQUFrQjtBQUM3QixDQUFDO0FBT0ssMEJBQTJCLElBQVksRUFBRSxVQUFnQjtJQUMzRCxJQUFJO1FBQ0EsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUN4QztJQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ1IsT0FBTyxPQUFPLFVBQVUsS0FBSyxVQUFVLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVO0tBQ3RFO0FBQ0wsQ0FBQztBQUVLLDJCQUE0QixJQUFZLEVBQUUsSUFBUztJQUNyRCxZQUFZLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7QUFDN0MsQ0FBQztBQU9ELDZGQUE2RjtBQUM3Rix5REFBeUQ7QUFDbkQsNkJBQThCLEVBQW9DLEVBQUUsSUFBd0I7SUFDOUYsSUFBSSxxQkFBcUIsSUFBSSxNQUFNLEVBQUU7UUFDakMsT0FBUSxNQUFjLENBQUMsbUJBQW1CLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQztLQUN2RDtJQUNELE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUU7SUFFeEIsT0FBTyxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDO1FBQ3ZCLFVBQVUsRUFBRSxLQUFLO1FBQ2pCLGFBQWE7WUFDVCxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQztRQUNqRCxDQUFDO0tBQ0osQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNWLENBQUM7QUFFRDs7R0FFRztBQUNILG9CQUFvQixDQUFPLEVBQUUsQ0FBTztJQUNoQyxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDLFdBQVcsRUFBRTtBQUM5RyxDQUFDO0FBRUQsTUFBTSxrQkFBa0IsR0FBNkI7SUFDakQsVUFBVSxFQUFFLENBQUM7SUFDYixPQUFPLEVBQUUsQ0FBQztJQUNWLFdBQVcsRUFBRSxDQUFDLENBQUM7SUFDZixZQUFZLEVBQUUsQ0FBQyxDQUFDO0NBQ25CO0FBQ0QsTUFBTSxRQUFRLEdBQUcsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxVQUFVLENBQUM7QUFDL0YsTUFBTSxVQUFVLEdBQUcsQ0FBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxTQUFTO0lBQ2hHLFVBQVUsRUFBRSxVQUFVLENBQUM7QUFFckMsb0JBQXFCLElBQW9CLEVBQUUsVUFBbUIsS0FBSztJQUNyRSxJQUFJLElBQUksS0FBSyxTQUFTO1FBQUUsT0FBTyxJQUFJO0lBRW5DLE1BQU0sYUFBYSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtRQUNoRSxNQUFNLEtBQUssR0FBRyxJQUFJLElBQUksRUFBRTtRQUN4QixLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsR0FBRyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN6RCxPQUFPLFVBQVUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDO0lBQ2xDLENBQUMsQ0FBQztJQUVGLE1BQU0sU0FBUyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLElBQUksR0FBRyxJQUFJLEdBQUcsRUFBRTtJQUVsRSwwRUFBMEU7SUFDMUUsSUFBSSxDQUFDLEdBQUcsU0FBUyxJQUFJLFNBQVMsSUFBSSxDQUFDLEVBQUU7UUFDakMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0tBQzVEO0lBQ0QsT0FBTyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsS0FBSyxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFO0FBQ3pGLENBQUM7QUFFRCxrREFBa0Q7QUFDNUMsc0JBQXVCLEVBQVU7SUFDbkMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtRQUNuQyxJQUFJLEtBQUssR0FBZ0IsSUFBSTtRQUM3QixNQUFNLElBQUksR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVM7UUFDcEMsTUFBTSxNQUFNLEdBQUcsRUFBRSxHQUFHLElBQUk7UUFDeEIsTUFBTSxJQUFJLEdBQUcsQ0FBQyxTQUFpQixFQUFFLEVBQUU7WUFDL0IsSUFBSSxLQUFLLElBQUksSUFBSSxFQUFFO2dCQUFFLEtBQUssR0FBRyxTQUFTO2FBQUU7WUFDeEMsTUFBTSxRQUFRLEdBQUcsU0FBUyxHQUFHLEtBQUs7WUFDbEMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsSUFBSSxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDdEQsSUFBSSxRQUFRLEdBQUcsR0FBRyxFQUFFO2dCQUNoQixPQUFPLHFCQUFxQixDQUFDLElBQUksQ0FBQzthQUNyQztpQkFBTTtnQkFDSCxFQUFFLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsb0JBQW9CLENBQUM7Z0JBQ3hFLE9BQU8sRUFBRTthQUNaO1FBQ0wsQ0FBQztRQUNELHFCQUFxQixDQUFDLElBQUksQ0FBQztJQUMvQixDQUFDLENBQUM7QUFDTixDQUFDO0FBRUQsd0NBQXdDO0FBQ2xDLGdCQUFpQixFQUFlO0lBQ2xDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtRQUNyQyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEtBQUssQ0FBQztZQUFFLE9BQU0sQ0FBQyxrQkFBa0I7UUFDOUMsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7UUFDcEMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDdEUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBRXBELElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxPQUFPO1FBQ25CLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxPQUFPO1FBQ25CLE1BQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQyxxQkFBcUIsRUFBRTtRQUN2QyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUk7UUFDZCxDQUFDLElBQUksSUFBSSxDQUFDLEdBQUc7UUFFYixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUk7UUFDeEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJO1FBQ3pDLEVBQUUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUNsRCxXQUFXLENBQUMsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLFlBQVk7SUFDdkMsQ0FBQyxDQUFDO0lBQ0YsRUFBRSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFO1FBQ25DLElBQUksR0FBRyxDQUFDLEtBQUssS0FBSyxDQUFDO1lBQUUsT0FBTSxDQUFDLHVCQUF1QjtRQUNuRCxNQUFNLEtBQUssR0FBRyxFQUFFLENBQUMsc0JBQXNCLENBQUMsTUFBTSxDQUFDO1FBQy9DLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUNuQixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDaEUsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUNyQyxVQUFVLENBQUMsR0FBRyxFQUFFO2dCQUNYLElBQW9CLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxHQUFHO2dCQUN6QyxVQUFVLENBQUMsR0FBRyxFQUFFO29CQUNaLElBQUksQ0FBQyxNQUFNLEVBQUU7Z0JBQ2pCLENBQUMsRUFBRSxHQUFHLENBQUM7WUFDWCxDQUFDLEVBQUUsS0FBSyxDQUFDO1FBQ2IsQ0FBQyxDQUFDO0lBQ04sQ0FBQyxDQUFDO0FBQ0osQ0FBQyIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvY2xpZW50LnRzXCIpO1xuIiwiaW1wb3J0IHsgZWxlbUJ5SWQsIGVsZW1lbnQsIGxvY2FsU3RvcmFnZVJlYWQsIGxvY2FsU3RvcmFnZVdyaXRlLCBzZW5kIH0gZnJvbSAnLi91dGlsJ1xyXG5cclxuZXhwb3J0IGNvbnN0IFZFUlNJT04gPSAnMi4yNC4zJ1xyXG5cclxuY29uc3QgVkVSU0lPTl9VUkwgPSAnaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tLzE5UnlhbkEvQ2hlY2tQQ1IvbWFzdGVyL3ZlcnNpb24udHh0J1xyXG5jb25zdCBDT01NSVRfVVJMID0gKGxvY2F0aW9uLnByb3RvY29sID09PSAnY2hyb21lLWV4dGVuc2lvbjonID9cclxuICAgICdodHRwczovL2FwaS5naXRodWIuY29tL3JlcG9zLzE5UnlhbkEvQ2hlY2tQQ1IvZ2l0L3JlZnMvaGVhZHMvbWFzdGVyJyA6ICcvYXBpL2NvbW1pdCcpXHJcbmNvbnN0IE5FV1NfVVJMID0gJ2h0dHBzOi8vYXBpLmdpdGh1Yi5jb20vZ2lzdHMvMjFiZjExYTQyOWRhMjU3NTM5YTY4NTIwZjUxM2EzOGInXHJcblxyXG5mdW5jdGlvbiBmb3JtYXRDb21taXRNZXNzYWdlKG1lc3NhZ2U6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gbWVzc2FnZS5zdWJzdHIobWVzc2FnZS5pbmRleE9mKCdcXG5cXG4nKSArIDIpXHJcbiAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXCogKC4qPykoPz0kfFxcbikvZywgKGEsIGIpID0+IGA8bGk+JHtifTwvbGk+YClcclxuICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLz5cXG48L2csICc+PCcpXHJcbiAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXG4vZywgJzxicj4nKVxyXG59XHJcblxyXG4vLyBGb3IgdXBkYXRpbmcsIGEgcmVxdWVzdCB3aWxsIGJlIHNlbmQgdG8gR2l0aHViIHRvIGdldCB0aGUgY3VycmVudCBjb21taXQgaWQgYW5kIGNoZWNrIHRoYXQgYWdhaW5zdCB3aGF0J3Mgc3RvcmVkXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjaGVja0NvbW1pdCgpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcmVzcCA9IGF3YWl0IHNlbmQoVkVSU0lPTl9VUkwsICd0ZXh0JylcclxuICAgICAgICBjb25zdCBjID0gcmVzcC5yZXNwb25zZVRleHQudHJpbSgpXHJcbiAgICAgICAgY29uc29sZS5sb2coYEN1cnJlbnQgdmVyc2lvbjogJHtjfSAke1ZFUlNJT04gPT09IGMgPyAnKG5vIHVwZGF0ZSBhdmFpbGFibGUpJyA6ICcodXBkYXRlIGF2YWlsYWJsZSknfWApXHJcbiAgICAgICAgZWxlbUJ5SWQoJ25ld3ZlcnNpb24nKS5pbm5lckhUTUwgPSBjXHJcbiAgICAgICAgaWYgKFZFUlNJT04gIT09IGMpIHtcclxuICAgICAgICAgICAgZWxlbUJ5SWQoJ3VwZGF0ZUlnbm9yZScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGxvY2F0aW9uLnByb3RvY29sID09PSAnY2hyb21lLWV4dGVuc2lvbjonKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbUJ5SWQoJ3VwZGF0ZScpLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1CeUlkKCd1cGRhdGVCYWNrZ3JvdW5kJykuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0sIDM1MClcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3AyID0gYXdhaXQgc2VuZChDT01NSVRfVVJMLCAnanNvbicpXHJcbiAgICAgICAgICAgIGNvbnN0IHsgc2hhLCB1cmwgfSA9IHJlc3AyLnJlc3BvbnNlLm9iamVjdFxyXG4gICAgICAgICAgICBjb25zdCByZXNwMyA9IGF3YWl0IHNlbmQoKGxvY2F0aW9uLnByb3RvY29sID09PSAnY2hyb21lLWV4dGVuc2lvbjonID8gdXJsIDogYC9hcGkvY29tbWl0LyR7c2hhfWApLCAnanNvbicpXHJcbiAgICAgICAgICAgIGVsZW1CeUlkKCdwYXN0VXBkYXRlVmVyc2lvbicpLmlubmVySFRNTCA9IFZFUlNJT05cclxuICAgICAgICAgICAgZWxlbUJ5SWQoJ25ld1VwZGF0ZVZlcnNpb24nKS5pbm5lckhUTUwgPSBjXHJcbiAgICAgICAgICAgIGVsZW1CeUlkKCd1cGRhdGVGZWF0dXJlcycpLmlubmVySFRNTCA9IGZvcm1hdENvbW1pdE1lc3NhZ2UocmVzcDMucmVzcG9uc2UubWVzc2FnZSlcclxuICAgICAgICAgICAgZWxlbUJ5SWQoJ3VwZGF0ZUJhY2tncm91bmQnKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xyXG4gICAgICAgICAgICBlbGVtQnlJZCgndXBkYXRlJykuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuICAgICAgICB9XHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnQ291bGQgbm90IGFjY2VzcyBHaXRodWIuIEhlcmVcXCdzIHRoZSBlcnJvcjonLCBlcnIpXHJcbiAgICB9XHJcbn1cclxuXHJcbmxldCBuZXdzVXJsOiBzdHJpbmd8bnVsbCA9IG51bGxcclxubGV0IG5ld3NDb21taXQ6IHN0cmluZ3xudWxsID0gbnVsbFxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZldGNoTmV3cygpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcmVzcCA9IGF3YWl0IHNlbmQoTkVXU19VUkwsICdqc29uJylcclxuICAgICAgICBsZXQgbGFzdCA9IGxvY2FsU3RvcmFnZVJlYWQoJ25ld3NDb21taXQnKVxyXG4gICAgICAgIG5ld3NDb21taXQgPSByZXNwLnJlc3BvbnNlLmhpc3RvcnlbMF0udmVyc2lvblxyXG5cclxuICAgICAgICBpZiAobGFzdCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGxhc3QgPSBuZXdzQ29tbWl0XHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZVdyaXRlKCduZXdzQ29tbWl0JywgbmV3c0NvbW1pdClcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG5ld3NVcmwgPSByZXNwLnJlc3BvbnNlLmZpbGVzWyd1cGRhdGVzLmh0bSddLnJhd191cmxcclxuXHJcbiAgICAgICAgaWYgKGxhc3QgIT09IG5ld3NDb21taXQpIHtcclxuICAgICAgICAgICAgZ2V0TmV3cygpXHJcbiAgICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ0NvdWxkIG5vdCBhY2Nlc3MgR2l0aHViLiBIZXJlXFwncyB0aGUgZXJyb3I6JywgZXJyKVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0TmV3cyhvbmZhaWw/OiAoKSA9PiB2b2lkKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICBpZiAoIW5ld3NVcmwpIHtcclxuICAgICAgICBpZiAob25mYWlsKSBvbmZhaWwoKVxyXG4gICAgICAgIHJldHVyblxyXG4gICAgfVxyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCByZXNwID0gYXdhaXQgc2VuZChuZXdzVXJsKVxyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5uZXdzQ29tbWl0ID0gbmV3c0NvbW1pdFxyXG4gICAgICAgIHJlc3AucmVzcG9uc2VUZXh0LnNwbGl0KCc8aHI+JykuZm9yRWFjaCgobmV3cykgPT4ge1xyXG4gICAgICAgICAgICBlbGVtQnlJZCgnbmV3c0NvbnRlbnQnKS5hcHBlbmRDaGlsZChlbGVtZW50KCdkaXYnLCAnbmV3c0l0ZW0nLCBuZXdzKSlcclxuICAgICAgICB9KVxyXG4gICAgICAgIGVsZW1CeUlkKCduZXdzQmFja2dyb3VuZCcpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXHJcbiAgICAgICAgZWxlbUJ5SWQoJ25ld3MnKS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG4gICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ0NvdWxkIG5vdCBhY2Nlc3MgR2l0aHViLiBIZXJlXFwncyB0aGUgZXJyb3I6JywgZXJyKVxyXG4gICAgICAgIGlmIChvbmZhaWwpIG9uZmFpbCgpXHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgY2hlY2tDb21taXQsIGZldGNoTmV3cywgZ2V0TmV3cywgVkVSU0lPTiB9IGZyb20gJy4vYXBwJ1xyXG5pbXBvcnQgeyBjbG9zZU9wZW5lZCB9IGZyb20gJy4vY29tcG9uZW50cy9hc3NpZ25tZW50J1xyXG5pbXBvcnQgeyB1cGRhdGVBdmF0YXIgfSBmcm9tICcuL2NvbXBvbmVudHMvYXZhdGFyJ1xyXG5pbXBvcnQgeyB1cGRhdGVOZXdUaXBzIH0gZnJvbSAnLi9jb21wb25lbnRzL2N1c3RvbUFkZGVyJ1xyXG5pbXBvcnQgeyBnZXRSZXNpemVBc3NpZ25tZW50cywgcmVzaXplLCByZXNpemVDYWxsZXIgfSBmcm9tICcuL2NvbXBvbmVudHMvcmVzaXplcidcclxuaW1wb3J0IHsgdG9EYXRlTnVtLCB0b2RheSB9IGZyb20gJy4vZGF0ZXMnXHJcbmltcG9ydCB7IGRpc3BsYXksIGZvcm1hdFVwZGF0ZSwgZ2V0U2Nyb2xsIH0gZnJvbSAnLi9kaXNwbGF5J1xyXG5pbXBvcnQgeyBkZWNyZW1lbnRMaXN0RGF0ZU9mZnNldCwgZ2V0TGlzdERhdGVPZmZzZXQsIGluY3JlbWVudExpc3REYXRlT2Zmc2V0LFxyXG4gIHNldExpc3REYXRlT2Zmc2V0LCB6ZXJvTGlzdERhdGVPZmZzZXQgfSBmcm9tICcuL25hdmlnYXRpb24nXHJcbmltcG9ydCB7IGRvbG9naW4sIGZldGNoLCBnZXREYXRhLCBJQXNzaWdubWVudCwgbG9nb3V0LCBzZXREYXRhLCBzd2l0Y2hWaWV3cyB9IGZyb20gJy4vcGNyJ1xyXG5pbXBvcnQgeyBhZGRBY3Rpdml0eSwgcmVjZW50QWN0aXZpdHkgfSBmcm9tICcuL3BsdWdpbnMvYWN0aXZpdHknXHJcbmltcG9ydCB7IHVwZGF0ZUF0aGVuYURhdGEgfSBmcm9tICcuL3BsdWdpbnMvYXRoZW5hJ1xyXG5pbXBvcnQgeyBhZGRUb0V4dHJhLCBwYXJzZUN1c3RvbVRhc2ssIHNhdmVFeHRyYSB9IGZyb20gJy4vcGx1Z2lucy9jdXN0b21Bc3NpZ25tZW50cydcclxuaW1wb3J0IHsgXyQsIF8kaCwgZGF0ZVN0cmluZywgZWxlbUJ5SWQsIGVsZW1lbnQsIGZvcmNlTGF5b3V0LCBsb2NhbFN0b3JhZ2VSZWFkLCBsb2NhbFN0b3JhZ2VXcml0ZSxcclxuICAgICAgICByZXF1ZXN0SWRsZUNhbGxiYWNrLCByaXBwbGUgfSBmcm9tICcuL3V0aWwnXHJcblxyXG4vLyBAdHMtaWdub3JlIFRPRE86IE1ha2UgdGhpcyBsZXNzIGhhY2t5XHJcbk5vZGVMaXN0LnByb3RvdHlwZS5mb3JFYWNoID0gSFRNTENvbGxlY3Rpb24ucHJvdG90eXBlLmZvckVhY2ggPSBBcnJheS5wcm90b3R5cGUuZm9yRWFjaDtcclxuXHJcbi8vIEFkZGl0aW9uYWxseSwgaWYgaXQncyB0aGUgdXNlcidzIGZpcnN0IHRpbWUsIHRoZSBwYWdlIGlzIHNldCB0byB0aGUgd2VsY29tZSBwYWdlLlxyXG5pZiAoIWxvY2FsU3RvcmFnZVJlYWQoJ25vV2VsY29tZScpKSB7XHJcbiAgICBsb2NhbFN0b3JhZ2VXcml0ZSgnbm9XZWxjb21lJywgdHJ1ZSlcclxuICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJ3dlbGNvbWUuaHRtbCdcclxufVxyXG5cclxuY29uc3QgTkFWX0VMRU1FTlQgPSBfJChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCduYXYnKSlcclxuY29uc3QgSU5QVVRfRUxFTUVOVFMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFxyXG4gICAgJ2lucHV0W3R5cGU9dGV4dF06bm90KCNuZXdUZXh0KTpub3QoW3JlYWRvbmx5XSksIGlucHV0W3R5cGU9cGFzc3dvcmRdLCBpbnB1dFt0eXBlPWVtYWlsXSwgJyArXHJcbiAgICAnaW5wdXRbdHlwZT11cmxdLCBpbnB1dFt0eXBlPXRlbF0sIGlucHV0W3R5cGU9bnVtYmVyXTpub3QoLmNvbnRyb2wpLCBpbnB1dFt0eXBlPXNlYXJjaF0nXHJcbikgYXMgTm9kZUxpc3RPZjxIVE1MSW5wdXRFbGVtZW50PlxyXG5cclxuLy8gIyMjIyBTZW5kIGZ1bmN0aW9uXHJcbi8vXHJcblxyXG4vLyBUaGlzIGZ1bmN0aW9uIGRpc3BsYXlzIGEgc25hY2tiYXIgdG8gdGVsbCB0aGUgdXNlciBzb21ldGhpbmdcclxuXHJcbi8vIDxhIG5hbWU9XCJyZXRcIi8+XHJcbi8vIFJldHJpZXZpbmcgZGF0YVxyXG4vLyAtLS0tLS0tLS0tLS0tLS1cclxuLy9cclxuZWxlbUJ5SWQoJ2xvZ2luJykuYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgKGV2dCkgPT4ge1xyXG4gICAgZXZ0LnByZXZlbnREZWZhdWx0KClcclxuICAgIGRvbG9naW4obnVsbCwgdHJ1ZSlcclxufSlcclxuXHJcbi8vIFRoZSB2aWV3IHN3aXRjaGluZyBidXR0b24gbmVlZHMgYW4gZXZlbnQgaGFuZGxlci5cclxuZWxlbUJ5SWQoJ3N3aXRjaFZpZXdzJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzd2l0Y2hWaWV3cylcclxuXHJcbi8vIFRoZSBzYW1lIGdvZXMgZm9yIHRoZSBsb2cgb3V0IGJ1dHRvbi5cclxuZWxlbUJ5SWQoJ2xvZ291dCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgbG9nb3V0KVxyXG5cclxuLy8gTm93IHdlIGFzc2lnbiBpdCB0byBjbGlja2luZyB0aGUgYmFja2dyb3VuZC5cclxuZWxlbUJ5SWQoJ2JhY2tncm91bmQnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsb3NlT3BlbmVkKVxyXG5cclxuLy8gVGhlbiwgdGhlIHRhYnMgYXJlIG1hZGUgaW50ZXJhY3RpdmUuXHJcbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyNuYXZUYWJzPmxpJykuZm9yRWFjaCgodGFiLCB0YWJJbmRleCkgPT4ge1xyXG4gIHRhYi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldnQpID0+IHtcclxuICAgIGNvbnN0IHRyYW5zID0gbG9jYWxTdG9yYWdlUmVhZCgndmlld1RyYW5zJylcclxuICAgIGlmICghdHJhbnMpIHtcclxuICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdub1RyYW5zJylcclxuICAgICAgZm9yY2VMYXlvdXQoZG9jdW1lbnQuYm9keSlcclxuICAgIH1cclxuICAgIGxvY2FsU3RvcmFnZVdyaXRlKCd2aWV3JywgdGFiSW5kZXgpXHJcbiAgICBkb2N1bWVudC5ib2R5LnNldEF0dHJpYnV0ZSgnZGF0YS12aWV3JywgU3RyaW5nKHRhYkluZGV4KSlcclxuICAgIGlmICh0YWJJbmRleCA9PT0gMSkge1xyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCByZXNpemVDYWxsZXIpXHJcbiAgICAgICAgaWYgKHRyYW5zKSB7XHJcbiAgICAgICAgbGV0IHN0YXJ0OiBudW1iZXJ8bnVsbCA9IG51bGxcclxuICAgICAgICAvLyBUaGUgY29kZSBiZWxvdyBpcyB0aGUgc2FtZSBjb2RlIHVzZWQgaW4gdGhlIHJlc2l6ZSgpIGZ1bmN0aW9uLiBJdCBiYXNpY2FsbHkganVzdFxyXG4gICAgICAgIC8vIHBvc2l0aW9ucyB0aGUgYXNzaWdubWVudHMgY29ycmVjdGx5IGFzIHRoZXkgYW5pbWF0ZVxyXG4gICAgICAgIGNvbnN0IHdpZHRocyA9IGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKCdzaG93SW5mbycpID9cclxuICAgICAgICAgICAgWzY1MCwgMTEwMCwgMTgwMCwgMjcwMCwgMzgwMCwgNTEwMF0gOiBbMzUwLCA4MDAsIDE1MDAsIDI0MDAsIDM1MDAsIDQ4MDBdXHJcbiAgICAgICAgbGV0IGNvbHVtbnMgPSAxXHJcbiAgICAgICAgd2lkdGhzLmZvckVhY2goKHcsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA+IHcpIHsgY29sdW1ucyA9IGluZGV4ICsgMSB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICBjb25zdCBhc3NpZ25tZW50cyA9IGdldFJlc2l6ZUFzc2lnbm1lbnRzKClcclxuICAgICAgICBjb25zdCBjb2x1bW5IZWlnaHRzID0gQXJyYXkuZnJvbShuZXcgQXJyYXkoY29sdW1ucyksICgpID0+IDApXHJcbiAgICAgICAgY29uc3Qgc3RlcCA9ICh0aW1lc3RhbXA6IG51bWJlcikgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIWNvbHVtbnMpIHRocm93IG5ldyBFcnJvcignQ29sdW1ucyBudW1iZXIgbm90IGZvdW5kJylcclxuICAgICAgICAgICAgaWYgKHN0YXJ0ID09IG51bGwpIHsgc3RhcnQgPSB0aW1lc3RhbXAgfVxyXG4gICAgICAgICAgICBhc3NpZ25tZW50cy5mb3JFYWNoKChhc3NpZ25tZW50LCBuKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb2wgPSBuICUgY29sdW1uc1xyXG4gICAgICAgICAgICAgICAgaWYgKG4gPCBjb2x1bW5zKSB7XHJcbiAgICAgICAgICAgICAgICBjb2x1bW5IZWlnaHRzW2NvbF0gPSAwXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBhc3NpZ25tZW50LnN0eWxlLnRvcCA9IGNvbHVtbkhlaWdodHNbY29sXSArICdweCdcclxuICAgICAgICAgICAgICAgIGFzc2lnbm1lbnQuc3R5bGUubGVmdCA9ICgoMTAwIC8gY29sdW1ucykgKiBjb2wpICsgJyUnXHJcbiAgICAgICAgICAgICAgICBhc3NpZ25tZW50LnN0eWxlLnJpZ2h0ID0gKCgxMDAgLyBjb2x1bW5zKSAqIChjb2x1bW5zIC0gY29sIC0gMSkpICsgJyUnXHJcbiAgICAgICAgICAgICAgICBjb2x1bW5IZWlnaHRzW2NvbF0gKz0gYXNzaWdubWVudC5vZmZzZXRIZWlnaHQgKyAyNFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICBpZiAoKHRpbWVzdGFtcCAtIHN0YXJ0KSA8IDM1MCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RlcClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0ZXApXHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghY29sdW1ucykgdGhyb3cgbmV3IEVycm9yKCdDb2x1bW5zIG51bWJlciBub3QgZm91bmQnKVxyXG4gICAgICAgICAgICBhc3NpZ25tZW50cy5mb3JFYWNoKChhc3NpZ25tZW50LCBuKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb2wgPSBuICUgY29sdW1uc1xyXG4gICAgICAgICAgICAgICAgaWYgKG4gPCBjb2x1bW5zKSB7XHJcbiAgICAgICAgICAgICAgICBjb2x1bW5IZWlnaHRzW2NvbF0gPSAwXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBhc3NpZ25tZW50LnN0eWxlLnRvcCA9IGNvbHVtbkhlaWdodHNbY29sXSArICdweCdcclxuICAgICAgICAgICAgICAgIGNvbHVtbkhlaWdodHNbY29sXSArPSBhc3NpZ25tZW50Lm9mZnNldEhlaWdodCArIDI0XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSwgMzUwKVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJlc2l6ZSgpXHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgd2luZG93LnNjcm9sbFRvKDAsIGdldFNjcm9sbCgpKVxyXG4gICAgICAgIE5BVl9FTEVNRU5ULmNsYXNzTGlzdC5hZGQoJ2hlYWRyb29tLS1sb2NrZWQnKVxyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICBOQVZfRUxFTUVOVC5jbGFzc0xpc3QucmVtb3ZlKCdoZWFkcm9vbS0tdW5waW5uZWQnKVxyXG4gICAgICAgICAgICBOQVZfRUxFTUVOVC5jbGFzc0xpc3QucmVtb3ZlKCdoZWFkcm9vbS0tbG9ja2VkJylcclxuICAgICAgICAgICAgTkFWX0VMRU1FTlQuY2xhc3NMaXN0LmFkZCgnaGVhZHJvb20tLXBpbm5lZCcpXHJcbiAgICAgICAgICAgIHJlcXVlc3RJZGxlQ2FsbGJhY2soKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgemVyb0xpc3REYXRlT2Zmc2V0KClcclxuICAgICAgICAgICAgICAgIHVwZGF0ZUxpc3ROYXYoKVxyXG4gICAgICAgICAgICAgICAgZGlzcGxheSgpXHJcbiAgICAgICAgICAgIH0sIHt0aW1lb3V0OiAyMDAwfSlcclxuICAgICAgICB9LCAzNTApXHJcbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJlc2l6ZUNhbGxlcilcclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYXNzaWdubWVudCcpLmZvckVhY2goKGFzc2lnbm1lbnQpID0+IHtcclxuICAgICAgICAgICAgKGFzc2lnbm1lbnQgYXMgSFRNTEVsZW1lbnQpLnN0eWxlLnRvcCA9ICdhdXRvJ1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbiAgICBpZiAoIXRyYW5zKSB7XHJcbiAgICAgIGZvcmNlTGF5b3V0KGRvY3VtZW50LmJvZHkpXHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdub1RyYW5zJylcclxuICAgICAgfSwgMzUwKVxyXG4gICAgfVxyXG4gIH0pXHJcbn0pXHJcblxyXG4vLyBBbmQgdGhlIGluZm8gdGFicyAoanVzdCBhIGxpdHRsZSBsZXNzIGNvZGUpXHJcbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyNpbmZvVGFicz5saScpLmZvckVhY2goKHRhYiwgdGFiSW5kZXgpID0+IHtcclxuICAgIHRhYi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldnQpID0+IHtcclxuICAgICAgICBlbGVtQnlJZCgnaW5mbycpLnNldEF0dHJpYnV0ZSgnZGF0YS12aWV3JywgU3RyaW5nKHRhYkluZGV4KSlcclxuICAgIH0pXHJcbn0pXHJcblxyXG4vLyBUaGUgdmlldyBpcyBzZXQgdG8gd2hhdCBpdCB3YXMgbGFzdC5cclxuaWYgKGxvY2FsU3RvcmFnZS52aWV3ICE9IG51bGwpIHtcclxuICBkb2N1bWVudC5ib2R5LnNldEF0dHJpYnV0ZSgnZGF0YS12aWV3JywgbG9jYWxTdG9yYWdlLnZpZXcpXHJcbiAgaWYgKGxvY2FsU3RvcmFnZS52aWV3ID09PSAnMScpIHtcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCByZXNpemVDYWxsZXIpXHJcbiAgfVxyXG59XHJcblxyXG4vLyBBZGRpdGlvbmFsbHksIHRoZSBhY3RpdmUgY2xhc3MgbmVlZHMgdG8gYmUgYWRkZWQgd2hlbiBpbnB1dHMgYXJlIHNlbGVjdGVkIChmb3IgdGhlIGxvZ2luIGJveCkuXHJcbklOUFVUX0VMRU1FTlRTLmZvckVhY2goKGlucHV0KSA9PiB7XHJcbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZXZ0KSA9PiB7XHJcbiAgICAgICAgXyRoKF8kaChpbnB1dC5wYXJlbnROb2RlKS5xdWVyeVNlbGVjdG9yKCdsYWJlbCcpKS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG4gICAgfSlcclxuICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgKGV2dCkgPT4ge1xyXG4gICAgICAgIF8kaChfJGgoaW5wdXQucGFyZW50Tm9kZSkucXVlcnlTZWxlY3RvcignbGFiZWwnKSkuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuICAgIH0pXHJcbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgKGV2dCkgPT4ge1xyXG4gICAgICAgIGlmIChpbnB1dC52YWx1ZS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgXyRoKF8kaChpbnB1dC5wYXJlbnROb2RlKS5xdWVyeVNlbGVjdG9yKCdsYWJlbCcpKS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbn0pXHJcblxyXG4vLyBXaGVuIHRoZSBlc2NhcGUga2V5IGlzIHByZXNzZWQsIHRoZSBjdXJyZW50IGFzc2lnbm1lbnQgc2hvdWxkIGJlIGNsb3NlZC5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZXZ0KSA9PiB7XHJcbiAgaWYgKGV2dC53aGljaCA9PT0gMjcpIHsgLy8gRXNjYXBlIGtleSBwcmVzc2VkXHJcbiAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnZnVsbCcpLmxlbmd0aCAhPT0gMCkgeyByZXR1cm4gY2xvc2VPcGVuZWQobmV3IEV2ZW50KCdHZW5lcmF0ZWQgRXZlbnQnKSkgfVxyXG4gIH1cclxufSk7XHJcblxyXG4vLyBJZiBpdCdzIHdpbnRlciB0aW1lLCBhIGNsYXNzIGlzIGFkZGVkIHRvIHRoZSBib2R5IGVsZW1lbnQuXHJcbigoKSA9PiB7XHJcbiAgICBjb25zdCB0b2RheURhdGUgPSBuZXcgRGF0ZSgpXHJcbiAgICBpZiAobmV3IERhdGUodG9kYXlEYXRlLmdldEZ1bGxZZWFyKCksIDEwLCAyNykgPD0gdG9kYXlEYXRlICYmXHJcbiAgICAgICAgdG9kYXlEYXRlIDw9IG5ldyBEYXRlKHRvZGF5RGF0ZS5nZXRGdWxsWWVhcigpLCAxMSwgMzIpKSB7XHJcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnd2ludGVyJylcclxuICAgIH1cclxufSkoKVxyXG5cclxuLy8gRm9yIHRoZSBuYXZiYXIgdG9nZ2xlIGJ1dHRvbnMsIGEgZnVuY3Rpb24gdG8gdG9nZ2xlIHRoZSBhY3Rpb24gaXMgZGVmaW5lZCB0byBlbGltaW5hdGUgY29kZS5cclxuZnVuY3Rpb24gbmF2VG9nZ2xlKGVsZW06IHN0cmluZywgbHM6IHN0cmluZywgZj86ICgpID0+IHZvaWQpOiB2b2lkIHtcclxuICAgIHJpcHBsZShlbGVtQnlJZChlbGVtKSlcclxuICAgIGVsZW1CeUlkKGVsZW0pLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCAoKSA9PiB7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QudG9nZ2xlKGxzKVxyXG4gICAgICAgIHJlc2l6ZSgpXHJcbiAgICAgICAgbG9jYWxTdG9yYWdlV3JpdGUobHMsIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKGxzKSlcclxuICAgICAgICBpZiAoZiAhPSBudWxsKSBmKClcclxuICAgIH0pXHJcbiAgICBpZiAobG9jYWxTdG9yYWdlUmVhZChscykpIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZChscylcclxufVxyXG5cclxuLy8gVGhlIGJ1dHRvbiB0byBzaG93L2hpZGUgY29tcGxldGVkIGFzc2lnbm1lbnRzIGluIGxpc3QgdmlldyBhbHNvIG5lZWRzIGV2ZW50IGxpc3RlbmVycy5cclxubmF2VG9nZ2xlKCdjdkJ1dHRvbicsICdzaG93RG9uZScsICgpID0+IHNldFRpbWVvdXQocmVzaXplLCAxMDAwKSlcclxuXHJcbi8vIFRoZSBzYW1lIGdvZXMgZm9yIHRoZSBidXR0b24gdGhhdCBzaG93cyB1cGNvbWluZyB0ZXN0cy5cclxuaWYgKGxvY2FsU3RvcmFnZS5zaG93SW5mbyA9PSBudWxsKSB7IGxvY2FsU3RvcmFnZS5zaG93SW5mbyA9IEpTT04uc3RyaW5naWZ5KHRydWUpIH1cclxubmF2VG9nZ2xlKCdpbmZvQnV0dG9uJywgJ3Nob3dJbmZvJylcclxuXHJcbi8vIFRoaXMgYWxzbyBnZXRzIHJlcGVhdGVkIGZvciB0aGUgdGhlbWUgdG9nZ2xpbmcuXHJcbm5hdlRvZ2dsZSgnbGlnaHRCdXR0b24nLCAnZGFyaycpXHJcblxyXG4vLyBGb3IgZWFzZSBvZiBhbmltYXRpb25zLCBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIHByb21pc2UgaXMgZGVmaW5lZC5cclxuLy8gZnVuY3Rpb24gYW5pbWF0ZUVsKGVsOiBIVE1MRWxlbWVudCwga2V5ZnJhbWVzOiBBbmltYXRpb25LZXlGcmFtZVtdLCBvcHRpb25zOiBBbmltYXRpb25PcHRpb25zKTpcclxuLy8gICAgIFByb21pc2U8QW5pbWF0aW9uUGxheWJhY2tFdmVudD4ge1xyXG4vLyAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuLy8gICAgICAgICBjb25zdCBwbGF5ZXIgPSBlbC5hbmltYXRlKGtleWZyYW1lcywgb3B0aW9ucylcclxuLy8gICAgICAgICBwbGF5ZXIub25maW5pc2ggPSAoZSkgPT4gcmVzb2x2ZShlKVxyXG4vLyAgICAgfSlcclxuLy8gfVxyXG5mdW5jdGlvbiBhbmltYXRlRWwoZWw6IEhUTUxFbGVtZW50LCBrZXlmcmFtZXM6IGFueSwgb3B0aW9uczogYW55KTogUHJvbWlzZTxhbnk+IHtcclxuICAgIGNvbnNvbGUuZXJyb3IoJ1RPRE86IFVwZ3JhZGUgdHlwZXNjcmlwdCcpXHJcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG51bGwpXHJcbn1cclxuXHJcbi8vIEluIG9yZGVyIHRvIG1ha2UgdGhlIHByZXZpb3VzIGRhdGUgLyBuZXh0IGRhdGUgYnV0dG9ucyBkbyBzb21ldGhpbmcsIHRoZXkgbmVlZCBldmVudCBsaXN0ZW5lcnMuXHJcbmVsZW1CeUlkKCdsaXN0bmV4dCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gIGNvbnN0IHBkID0gZWxlbUJ5SWQoJ2xpc3RwcmV2ZGF0ZScpXHJcbiAgY29uc3QgdGQgPSBlbGVtQnlJZCgnbGlzdG5vd2RhdGUnKVxyXG4gIGNvbnN0IG5kID0gZWxlbUJ5SWQoJ2xpc3RuZXh0ZGF0ZScpXHJcbiAgaW5jcmVtZW50TGlzdERhdGVPZmZzZXQoKVxyXG4gIGRpc3BsYXkoKVxyXG4gIG5kLnN0eWxlLmRpc3BsYXkgPSAnaW5saW5lLWJsb2NrJ1xyXG4gIHJldHVybiBQcm9taXNlLnJhY2UoW1xyXG4gICAgYW5pbWF0ZUVsKHRkLCBbXHJcbiAgICAgIHt0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKDAlKScsIG9wYWNpdHk6IDF9LFxyXG4gICAgICB7b3BhY2l0eTogMH0sXHJcbiAgICAgIHt0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKC0xMDAlKScsIG9wYWNpdHk6IDB9XHJcbiAgICBdLCB7ZHVyYXRpb246IDMwMCwgZWFzaW5nOiAnZWFzZS1vdXQnfSksXHJcbiAgICBhbmltYXRlRWwobmQsIFtcclxuICAgICAge3RyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoMCUpJywgb3BhY2l0eTogMH0sXHJcbiAgICAgIHtvcGFjaXR5OiAwfSxcclxuICAgICAge3RyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoLTEwMCUpJywgb3BhY2l0eTogMX1cclxuICAgIF0sIHtkdXJhdGlvbjogMzAwLCBlYXNpbmc6ICdlYXNlLW91dCd9KVxyXG4gIF0pLnRoZW4oKCkgPT4ge1xyXG4gICAgcGQuaW5uZXJIVE1MID0gdGQuaW5uZXJIVE1MXHJcbiAgICB0ZC5pbm5lckhUTUwgPSBuZC5pbm5lckhUTUxcclxuICAgIGNvbnN0IGxpc3REYXRlMiA9IG5ldyBEYXRlKClcclxuICAgIGxpc3REYXRlMi5zZXREYXRlKGxpc3REYXRlMi5nZXREYXRlKCkgKyAxICsgZ2V0TGlzdERhdGVPZmZzZXQoKSlcclxuICAgIG5kLmlubmVySFRNTCA9IGRhdGVTdHJpbmcobGlzdERhdGUyKS5yZXBsYWNlKCdUb2RheScsICdOb3cnKVxyXG4gICAgcmV0dXJuIG5kLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcclxuICB9KVxyXG59KVxyXG5cclxuLy8gVGhlIGV2ZW50IGxpc3RlbmVyIGZvciB0aGUgcHJldmlvdXMgZGF0ZSBidXR0b24gaXMgbW9zdGx5IHRoZSBzYW1lLlxyXG5lbGVtQnlJZCgnbGlzdGJlZm9yZScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gIGNvbnN0IHBkID0gZWxlbUJ5SWQoJ2xpc3RwcmV2ZGF0ZScpXHJcbiAgY29uc3QgdGQgPSBlbGVtQnlJZCgnbGlzdG5vd2RhdGUnKVxyXG4gIGNvbnN0IG5kID0gZWxlbUJ5SWQoJ2xpc3RuZXh0ZGF0ZScpXHJcbiAgZGVjcmVtZW50TGlzdERhdGVPZmZzZXQoKVxyXG4gIGRpc3BsYXkoKVxyXG4gIHBkLnN0eWxlLmRpc3BsYXkgPSAnaW5saW5lLWJsb2NrJ1xyXG4gIHJldHVybiBQcm9taXNlLnJhY2UoW1xyXG4gICAgYW5pbWF0ZUVsKHRkLCBbXHJcbiAgICAgIHt0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKC0xMDAlKScsIG9wYWNpdHk6IDF9LFxyXG4gICAgICB7b3BhY2l0eTogMH0sXHJcbiAgICAgIHt0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKDAlKScsIG9wYWNpdHk6IDB9XHJcbiAgICBdLCB7ZHVyYXRpb246IDMwMCwgZWFzaW5nOiAnZWFzZS1vdXQnfSksXHJcbiAgICBhbmltYXRlRWwocGQsIFtcclxuICAgICAge3RyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoLTEwMCUpJywgb3BhY2l0eTogMH0sXHJcbiAgICAgIHtvcGFjaXR5OiAwfSxcclxuICAgICAge3RyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoMCUpJywgb3BhY2l0eTogMX1cclxuICAgIF0sIHtkdXJhdGlvbjogMzAwLCBlYXNpbmc6ICdlYXNlLW91dCd9KVxyXG4gIF0pLnRoZW4oKCkgPT4ge1xyXG4gICAgbmQuaW5uZXJIVE1MID0gdGQuaW5uZXJIVE1MXHJcbiAgICB0ZC5pbm5lckhUTUwgPSBwZC5pbm5lckhUTUxcclxuICAgIGNvbnN0IGxpc3REYXRlMiA9IG5ldyBEYXRlKClcclxuICAgIGxpc3REYXRlMi5zZXREYXRlKChsaXN0RGF0ZTIuZ2V0RGF0ZSgpICsgZ2V0TGlzdERhdGVPZmZzZXQoKSkgLSAxKVxyXG4gICAgcGQuaW5uZXJIVE1MID0gZGF0ZVN0cmluZyhsaXN0RGF0ZTIpLnJlcGxhY2UoJ1RvZGF5JywgJ05vdycpXHJcbiAgICByZXR1cm4gcGQuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xyXG4gIH0pXHJcbn0pXHJcblxyXG4vLyBXaGVuZXZlciBhIGRhdGUgaXMgZG91YmxlIGNsaWNrZWQsIGxvbmcgdGFwcGVkLCBvciBmb3JjZSB0b3VjaGVkLCBsaXN0IHZpZXcgZm9yIHRoYXQgZGF5IGlzIGRpc3BsYXllZC5cclxuZnVuY3Rpb24gdXBkYXRlTGlzdE5hdigpOiB2b2lkIHtcclxuICAgIGNvbnN0IGQgPSBuZXcgRGF0ZSgpXHJcbiAgICBkLnNldERhdGUoKGQuZ2V0RGF0ZSgpICsgZ2V0TGlzdERhdGVPZmZzZXQoKSkgLSAxKVxyXG4gICAgY29uc3QgdXAgPSAoaWQ6IHN0cmluZykgPT4ge1xyXG4gICAgICAgIGVsZW1CeUlkKGlkKS5pbm5lckhUTUwgPSBkYXRlU3RyaW5nKGQpLnJlcGxhY2UoJ1RvZGF5JywgJ05vdycpXHJcbiAgICAgICAgcmV0dXJuIGQuc2V0RGF0ZShkLmdldERhdGUoKSArIDEpXHJcbiAgICB9XHJcbiAgICB1cCgnbGlzdHByZXZkYXRlJylcclxuICAgIHVwKCdsaXN0bm93ZGF0ZScpXHJcbiAgICB1cCgnbGlzdG5leHRkYXRlJylcclxufVxyXG5cclxuZnVuY3Rpb24gc3dpdGNoVG9MaXN0KGV2dDogRXZlbnQpOiB2b2lkIHtcclxuICAgIGlmIChfJGgoZXZ0LnRhcmdldCkuY2xhc3NMaXN0LmNvbnRhaW5zKCdtb250aCcpIHx8IF8kaChldnQudGFyZ2V0KS5jbGFzc0xpc3QuY29udGFpbnMoJ2RhdGUnKSkge1xyXG4gICAgICAgIHNldExpc3REYXRlT2Zmc2V0KHRvRGF0ZU51bShOdW1iZXIoXyRoKF8kaChldnQudGFyZ2V0KS5wYXJlbnROb2RlKS5nZXRBdHRyaWJ1dGUoJ2RhdGEtZGF0ZScpKSkgLSB0b2RheSgpKVxyXG4gICAgICAgIHVwZGF0ZUxpc3ROYXYoKVxyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuc2V0QXR0cmlidXRlKCdkYXRhLXZpZXcnLCAnMScpXHJcbiAgICAgICAgcmV0dXJuIGRpc3BsYXkoKVxyXG4gICAgfVxyXG59XHJcblxyXG5kb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2RibGNsaWNrJywgc3dpdGNoVG9MaXN0KVxyXG5kb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ3dlYmtpdG1vdXNlZm9yY2V1cCcsIHN3aXRjaFRvTGlzdCk7XHJcbigoKSA9PiB7XHJcbiAgICBsZXQgdGFwdGltZXI6IG51bWJlcnxudWxsID0gbnVsbFxyXG4gICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgKGV2dCkgPT4gdGFwdGltZXIgPSBzZXRUaW1lb3V0KCgoKSA9PiBzd2l0Y2hUb0xpc3QoZXZ0KSksIDEwMDApKVxyXG4gICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIChldnQpID0+IHtcclxuICAgICAgICBpZiAodGFwdGltZXIpIGNsZWFyVGltZW91dCh0YXB0aW1lcilcclxuICAgICAgICB0YXB0aW1lciA9IG51bGxcclxuICAgIH0pXHJcbn0pKClcclxuXHJcbi8vIDxhIG5hbWU9XCJzaWRlXCIvPlxyXG4vLyBTaWRlIG1lbnUgYW5kIE5hdmJhclxyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4vL1xyXG4vLyBUaGUgW0hlYWRyb29tIGxpYnJhcnldKGh0dHBzOi8vZ2l0aHViLmNvbS9XaWNreU5pbGxpYW1zL2hlYWRyb29tLmpzKSBpcyB1c2VkIHRvIHNob3cgdGhlIG5hdmJhciB3aGVuIHNjcm9sbGluZyB1cFxyXG5jb25zdCBoZWFkcm9vbSA9IG5ldyBIZWFkcm9vbShfJChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCduYXYnKSksIHtcclxuICB0b2xlcmFuY2U6IDEwLFxyXG4gIG9mZnNldDogNjZcclxufSlcclxuaGVhZHJvb20uaW5pdCgpXHJcblxyXG4vLyBBbHNvLCB0aGUgc2lkZSBtZW51IG5lZWRzIGV2ZW50IGxpc3RlbmVycy5cclxuZWxlbUJ5SWQoJ2NvbGxhcHNlQnV0dG9uJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nXHJcbiAgZWxlbUJ5SWQoJ3NpZGVOYXYnKS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG4gIHJldHVybiBlbGVtQnlJZCgnc2lkZUJhY2tncm91bmQnKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xyXG59KVxyXG5cclxuZWxlbUJ5SWQoJ3NpZGVCYWNrZ3JvdW5kJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgZWxlbUJ5SWQoJ3NpZGVCYWNrZ3JvdW5kJykuc3R5bGUub3BhY2l0eSA9ICcwJ1xyXG4gIGVsZW1CeUlkKCdzaWRlTmF2JykuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcclxuICBlbGVtQnlJZCgnZHJhZ1RhcmdldCcpLnN0eWxlLndpZHRoID0gJydcclxuICByZXR1cm4gc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2F1dG8nXHJcbiAgICBlbGVtQnlJZCgnc2lkZUJhY2tncm91bmQnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXHJcbiAgfVxyXG4gICwgMzUwKVxyXG59KVxyXG5cclxudXBkYXRlQXZhdGFyKClcclxuXHJcbi8vIDxhIG5hbWU9XCJhdGhlbmFcIi8+IEF0aGVuYSAoU2Nob29sb2d5KVxyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS1cclxuLy9cclxuXHJcbi8vIDxhIG5hbWU9XCJzZXR0aW5nc1wiLz4gU2V0dGluZ3NcclxuLy8gLS0tLS0tLS1cclxuLy9cclxuLy8gVGhlIGNvZGUgYmVsb3cgdXBkYXRlcyB0aGUgY3VycmVudCB2ZXJzaW9uIHRleHQgaW4gdGhlIHNldHRpbmdzLiBJIHNob3VsZCd2ZSBwdXQgdGhpcyB1bmRlciB0aGVcclxuLy8gVXBkYXRlcyBzZWN0aW9uLCBidXQgaXQgc2hvdWxkIGdvIGJlZm9yZSB0aGUgZGlzcGxheSgpIGZ1bmN0aW9uIGZvcmNlcyBhIHJlZmxvdy5cclxuZWxlbUJ5SWQoJ3ZlcnNpb24nKS5pbm5lckhUTUwgPSBWRVJTSU9OXHJcblxyXG4vLyBUbyBicmluZyB1cCB0aGUgc2V0dGluZ3Mgd2luZG93cywgYW4gZXZlbnQgbGlzdGVuZXIgbmVlZHMgdG8gYmUgYWRkZWQgdG8gdGhlIGJ1dHRvbi5cclxuZWxlbUJ5SWQoJ3NldHRpbmdzQicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgZWxlbUJ5SWQoJ3NpZGVCYWNrZ3JvdW5kJykuY2xpY2soKVxyXG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdzZXR0aW5nc1Nob3duJylcclxuICAgIGVsZW1CeUlkKCdicmFuZCcpLmlubmVySFRNTCA9ICdTZXR0aW5ncydcclxuICAgIHJldHVybiBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBfJGgoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbWFpbicpKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXHJcbiAgICB9KVxyXG59KVxyXG5cclxuLy8gVGhlIGJhY2sgYnV0dG9uIGFsc28gbmVlZHMgdG8gY2xvc2UgdGhlIHNldHRpbmdzIHdpbmRvdy5cclxuZWxlbUJ5SWQoJ2JhY2tCdXR0b24nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgIF8kaChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdtYWluJykpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXHJcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ3NldHRpbmdzU2hvd24nKVxyXG4gICAgcmV0dXJuIGVsZW1CeUlkKCdicmFuZCcpLmlubmVySFRNTCA9ICdDaGVjayBQQ1InXHJcbn0pXHJcblxyXG4vLyBUaGUgY29kZSBiZWxvdyBpcyB3aGF0IHRoZSBzZXR0aW5ncyBjb250cm9sLlxyXG5pZiAobG9jYWxTdG9yYWdlLnZpZXdUcmFucyA9PSBudWxsKSB7IGxvY2FsU3RvcmFnZS52aWV3VHJhbnMgPSBKU09OLnN0cmluZ2lmeSh0cnVlKSB9XHJcbmlmIChsb2NhbFN0b3JhZ2UuZWFybHlUZXN0ID09IG51bGwpIHsgbG9jYWxTdG9yYWdlLmVhcmx5VGVzdCA9IEpTT04uc3RyaW5naWZ5KDEpIH1cclxuaWYgKGxvY2FsU3RvcmFnZS5nb29nbGVBID09IG51bGwpIHsgbG9jYWxTdG9yYWdlLmdvb2dsZUEgPSBKU09OLnN0cmluZ2lmeSh0cnVlKSB9XHJcbmlmIChsb2NhbFN0b3JhZ2Uuc2VwVGFza3MgPT0gbnVsbCkgeyBsb2NhbFN0b3JhZ2Uuc2VwVGFza3MgPSBKU09OLnN0cmluZ2lmeShmYWxzZSkgfVxyXG5pZiAobG9jYWxTdG9yYWdlLnNlcFRhc2tDbGFzcyA9PSBudWxsKSB7IGxvY2FsU3RvcmFnZS5zZXBUYXNrQ2xhc3MgPSBKU09OLnN0cmluZ2lmeSh0cnVlKSB9XHJcbmlmIChsb2NhbFN0b3JhZ2UucHJvamVjdHNJblRlc3RQYW5lID09IG51bGwpIHsgbG9jYWxTdG9yYWdlLnByb2plY3RzSW5UZXN0UGFuZSA9IEpTT04uc3RyaW5naWZ5KGZhbHNlKSB9XHJcbmlmIChsb2NhbFN0b3JhZ2UuYXNzaWdubWVudFNwYW4gPT0gbnVsbCkgeyBsb2NhbFN0b3JhZ2UuYXNzaWdubWVudFNwYW4gPSBKU09OLnN0cmluZ2lmeSgnbXVsdGlwbGUnKSB9XHJcbmlmIChsb2NhbFN0b3JhZ2UuaGlkZWFzc2lnbm1lbnRzID09IG51bGwpIHsgbG9jYWxTdG9yYWdlLmhpZGVhc3NpZ25tZW50cyA9IEpTT04uc3RyaW5naWZ5KCdkYXknKSB9XHJcbmlmIChKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5zZXBUYXNrcykpIHtcclxuICAgIGVsZW1CeUlkKCdpbmZvJykuY2xhc3NMaXN0LmFkZCgnaXNUYXNrcycpXHJcbiAgICBlbGVtQnlJZCgnbmV3Jykuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xyXG59XHJcbmlmIChsb2NhbFN0b3JhZ2UuaG9saWRheVRoZW1lcyA9PSBudWxsKSB7IGxvY2FsU3RvcmFnZS5ob2xpZGF5VGhlbWVzID0gSlNPTi5zdHJpbmdpZnkoZmFsc2UpIH1cclxuaWYgKEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmhvbGlkYXlUaGVtZXMpKSB7IGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnaG9saWRheVRoZW1lcycpIH1cclxuaWYgKEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLnNlcFRhc2tDbGFzcykpIHsgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdzZXBUYXNrQ2xhc3MnKSB9XHJcbmlmIChsb2NhbFN0b3JhZ2UuY29sb3JUeXBlID09IG51bGwpIHsgbG9jYWxTdG9yYWdlLmNvbG9yVHlwZSA9ICdhc3NpZ25tZW50JyB9XHJcblxyXG5pbnRlcmZhY2UgSUNvbG9yTWFwIHsgW2Nsczogc3RyaW5nXTogc3RyaW5nIH1cclxuY29uc3QgYXNzaWdubWVudENvbG9yczogSUNvbG9yTWFwID0gbG9jYWxTdG9yYWdlUmVhZCgnYXNzaWdubWVudENvbG9ycycsIHtcclxuICAgIGNsYXNzd29yazogJyM2ODlmMzgnLCBob21ld29yazogJyMyMTk2ZjMnLCBsb25ndGVybTogJyNmNTdjMDAnLCB0ZXN0OiAnI2Y0NDMzNidcclxufSlcclxuY29uc3QgY2xhc3NDb2xvcnMgPSBsb2NhbFN0b3JhZ2VSZWFkKCdjbGFzc0NvbG9ycycsICgpID0+IHtcclxuICAgIGNvbnN0IGNjOiBJQ29sb3JNYXAgPSB7fVxyXG4gICAgY29uc3QgZGF0YSA9IGdldERhdGEoKVxyXG4gICAgaWYgKCFkYXRhKSByZXR1cm4gY2NcclxuICAgIGRhdGEuY2xhc3Nlcy5mb3JFYWNoKChjOiBzdHJpbmcpID0+IHtcclxuICAgICAgICBjY1tjXSA9ICcjNjE2MTYxJ1xyXG4gICAgfSlcclxuICAgIHJldHVybiBjY1xyXG59KVxyXG5lbGVtQnlJZChgJHtsb2NhbFN0b3JhZ2UuY29sb3JUeXBlfUNvbG9yc2ApLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXHJcbmlmIChsb2NhbFN0b3JhZ2UucmVmcmVzaE9uRm9jdXMgPT0gbnVsbCkgeyBsb2NhbFN0b3JhZ2UucmVmcmVzaE9uRm9jdXMgPSBKU09OLnN0cmluZ2lmeSh0cnVlKSB9XHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsICgpID0+IHtcclxuICBpZiAobG9jYWxTdG9yYWdlUmVhZCgncmVmcmVzaE9uRm9jdXMnKSkge1xyXG4gICAgcmV0dXJuIGZldGNoKClcclxuICB9XHJcbn0pXHJcbmlmIChsb2NhbFN0b3JhZ2UucmVmcmVzaFJhdGUgPT0gbnVsbCkgeyBsb2NhbFN0b3JhZ2UucmVmcmVzaFJhdGUgPSBKU09OLnN0cmluZ2lmeSgtMSkgfVxyXG5mdW5jdGlvbiBpbnRlcnZhbFJlZnJlc2goKTogdm9pZCB7XHJcbiAgICBjb25zdCByID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UucmVmcmVzaFJhdGUpXHJcbiAgICBpZiAociA+IDApIHtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5kZWJ1ZygnUmVmcmVzaGluZyBiZWNhdXNlIG9mIHRpbWVyJylcclxuICAgICAgICAgICAgZmV0Y2goKVxyXG4gICAgICAgICAgICBpbnRlcnZhbFJlZnJlc2goKVxyXG4gICAgICAgIH0sIHIgKiA2MCAqIDEwMDApXHJcbiAgICB9XHJcbn1cclxuaW50ZXJ2YWxSZWZyZXNoKClcclxuXHJcbi8vIEZvciBjaG9vc2luZyBjb2xvcnMsIHRoZSBjb2xvciBjaG9vc2luZyBib3hlcyBuZWVkIHRvIGJlIGluaXRpYWxpemVkLlxyXG5jb25zdCBwYWxldHRlOiBJQ29sb3JNYXAgPSB7XHJcbiAgJyNmNDQzMzYnOiAnI0I3MUMxQycsXHJcbiAgJyNlOTFlNjMnOiAnIzg4MEU0RicsXHJcbiAgJyM5YzI3YjAnOiAnIzRBMTQ4QycsXHJcbiAgJyM2NzNhYjcnOiAnIzMxMUI5MicsXHJcbiAgJyMzZjUxYjUnOiAnIzFBMjM3RScsXHJcbiAgJyMyMTk2ZjMnOiAnIzBENDdBMScsXHJcbiAgJyMwM2E5ZjQnOiAnIzAxNTc5QicsXHJcbiAgJyMwMGJjZDQnOiAnIzAwNjA2NCcsXHJcbiAgJyMwMDk2ODgnOiAnIzAwNEQ0MCcsXHJcbiAgJyM0Y2FmNTAnOiAnIzFCNUUyMCcsXHJcbiAgJyM2ODlmMzgnOiAnIzMzNjkxRScsXHJcbiAgJyNhZmI0MmInOiAnIzgyNzcxNycsXHJcbiAgJyNmYmMwMmQnOiAnI0Y1N0YxNycsXHJcbiAgJyNmZmEwMDAnOiAnI0ZGNkYwMCcsXHJcbiAgJyNmNTdjMDAnOiAnI0U2NTEwMCcsXHJcbiAgJyNmZjU3MjInOiAnI0JGMzYwQycsXHJcbiAgJyM3OTU1NDgnOiAnIzNFMjcyMycsXHJcbiAgJyM2MTYxNjEnOiAnIzIxMjEyMSdcclxufVxyXG5pZiAobG9jYWxTdG9yYWdlUmVhZCgnZGF0YScpICE9IG51bGwpIHtcclxuICAgIGxvY2FsU3RvcmFnZVJlYWQoJ2RhdGEnKS5jbGFzc2VzLmZvckVhY2goKGM6IHN0cmluZykgPT4ge1xyXG4gICAgICAgIGNvbnN0IGQgPSBlbGVtZW50KCdkaXYnLCBbXSwgYylcclxuICAgICAgICBkLnNldEF0dHJpYnV0ZSgnZGF0YS1jb250cm9sJywgYylcclxuICAgICAgICBkLmFwcGVuZENoaWxkKGVsZW1lbnQoJ3NwYW4nLCBbXSkpXHJcbiAgICAgICAgZWxlbUJ5SWQoJ2NsYXNzQ29sb3JzJykuYXBwZW5kQ2hpbGQoZClcclxuICAgIH0pXHJcbn1cclxuZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNvbG9ycycpLmZvckVhY2goKGUpID0+IHtcclxuICAgIGUucXVlcnlTZWxlY3RvckFsbCgnZGl2JykuZm9yRWFjaCgoY29sb3IpID0+IHtcclxuICAgICAgICBjb25zdCBjb250cm9sbGVkQ29sb3IgPSBjb2xvci5nZXRBdHRyaWJ1dGUoJ2RhdGEtY29udHJvbCcpXHJcbiAgICAgICAgaWYgKCFjb250cm9sbGVkQ29sb3IpIHRocm93IG5ldyBFcnJvcignRWxlbWVudCBoYXMgbm8gY29udHJvbGxlZCBjb2xvcicpXHJcblxyXG4gICAgICAgIGNvbnN0IHNwID0gXyRoKGNvbG9yLnF1ZXJ5U2VsZWN0b3IoJ3NwYW4nKSlcclxuICAgICAgICBjb25zdCBsaXN0TmFtZSA9IGUuZ2V0QXR0cmlidXRlKCdpZCcpID09PSAnY2xhc3NDb2xvcnMnID8gJ2NsYXNzQ29sb3JzJyA6ICdhc3NpZ25tZW50Q29sb3JzJ1xyXG4gICAgICAgIGNvbnN0IGxpc3QgPSBlLmdldEF0dHJpYnV0ZSgnaWQnKSA9PT0gJ2NsYXNzQ29sb3JzJyA/IGNsYXNzQ29sb3JzIDogYXNzaWdubWVudENvbG9yc1xyXG4gICAgICAgIHNwLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGxpc3RbY29udHJvbGxlZENvbG9yXVxyXG4gICAgICAgIE9iamVjdC5rZXlzKHBhbGV0dGUpLmZvckVhY2goKHApID0+IHtcclxuICAgICAgICBjb25zdCBwZSA9IGVsZW1lbnQoJ3NwYW4nLCBbXSlcclxuICAgICAgICBwZS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBwXHJcbiAgICAgICAgaWYgKHAgPT09IGxpc3RbY29udHJvbGxlZENvbG9yXSkge1xyXG4gICAgICAgICAgICBwZS5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNwLmFwcGVuZENoaWxkKHBlKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgY29uc3QgY3VzdG9tID0gZWxlbWVudCgnc3BhbicsIFsnY3VzdG9tQ29sb3InXSwgYDxhPkN1c3RvbTwvYT4gXFxcclxuICAgIDxpbnB1dCB0eXBlPSd0ZXh0JyBwbGFjZWhvbGRlcj0nV2FzICR7bGlzdFtjb250cm9sbGVkQ29sb3JdfScgLz4gXFxcclxuICAgIDxzcGFuIGNsYXNzPSdjdXN0b21JbmZvJz5Vc2UgYW55IENTUyB2YWxpZCBjb2xvciBuYW1lLCBzdWNoIGFzIFxcXHJcbiAgICA8Y29kZT4jRjQ0MzM2PC9jb2RlPiBvciA8Y29kZT5yZ2IoNjQsIDQzLCAyKTwvY29kZT4gb3IgPGNvZGU+Y3lhbjwvY29kZT48L3NwYW4+IFxcXHJcbiAgICA8YSBjbGFzcz0nY3VzdG9tT2snPlNldDwvYT5gKVxyXG4gICAgICAgIGN1c3RvbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldnQpID0+IGV2dC5zdG9wUHJvcGFnYXRpb24oKSlcclxuICAgICAgICBfJChjdXN0b20ucXVlcnlTZWxlY3RvcignYScpKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldnQpID0+IHtcclxuICAgICAgICAgICAgc3AuY2xhc3NMaXN0LnRvZ2dsZSgnb25DdXN0b20nKVxyXG4gICAgICAgICAgICBldnQuc3RvcFByb3BhZ2F0aW9uKClcclxuICAgICAgICB9KVxyXG4gICAgICAgIHNwLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2dCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoc3AuY2xhc3NMaXN0LmNvbnRhaW5zKCdjaG9vc2UnKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYmcgPSB0aW55Y29sb3Ioc3Auc3R5bGUuYmFja2dyb3VuZENvbG9yIHx8ICcjMDAwJykudG9IZXhTdHJpbmcoKVxyXG4gICAgICAgICAgICAgICAgbGlzdFtjb250cm9sbGVkQ29sb3JdID0gYmdcclxuICAgICAgICAgICAgICAgIHNwLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGJnXHJcbiAgICAgICAgICAgICAgICBjb25zdCBzZWxlY3RlZCA9IHNwLnF1ZXJ5U2VsZWN0b3IoJy5zZWxlY3RlZCcpXHJcbiAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZC5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBzcC5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpXHJcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2VbbGlzdE5hbWVdID0gSlNPTi5zdHJpbmdpZnkobGlzdClcclxuICAgICAgICAgICAgICAgIHVwZGF0ZUNvbG9ycygpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc3AuY2xhc3NMaXN0LnRvZ2dsZSgnY2hvb3NlJylcclxuICAgICAgICB9KVxyXG4gICAgICAgIF8kKGN1c3RvbS5xdWVyeVNlbGVjdG9yKCcuY3VzdG9tT2snKSkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZ0KSA9PiB7XHJcbiAgICAgICAgICAgIHNwLmNsYXNzTGlzdC5yZW1vdmUoJ29uQ3VzdG9tJylcclxuICAgICAgICAgICAgc3AuY2xhc3NMaXN0LnRvZ2dsZSgnY2hvb3NlJylcclxuICAgICAgICAgICAgY29uc3Qgc2VsZWN0ZWRFbCA9IHNwLnF1ZXJ5U2VsZWN0b3IoJy5zZWxlY3RlZCcpXHJcbiAgICAgICAgICAgIGlmIChzZWxlY3RlZEVsICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHNlbGVjdGVkRWwuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNwLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IChsaXN0W2NvbnRyb2xsZWRDb2xvcl0gPSBfJChjdXN0b20ucXVlcnlTZWxlY3RvcignaW5wdXQnKSkudmFsdWUpXHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZVtsaXN0TmFtZV0gPSBKU09OLnN0cmluZ2lmeShsaXN0KVxyXG4gICAgICAgICAgICB1cGRhdGVDb2xvcnMoKVxyXG4gICAgICAgICAgICByZXR1cm4gZXZ0LnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICAgICAgfSlcclxuICAgIH0pXHJcbn0pXHJcblxyXG4vLyBUaGVuLCBhIGZ1bmN0aW9uIHRoYXQgdXBkYXRlcyB0aGUgY29sb3IgcHJlZmVyZW5jZXMgaXMgZGVmaW5lZC5cclxuZnVuY3Rpb24gdXBkYXRlQ29sb3JzKCk6IHZvaWQge1xyXG4gICAgY29uc3Qgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpXHJcbiAgICBzdHlsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJykpXHJcbiAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHN0eWxlKVxyXG4gICAgY29uc3Qgc2hlZXQgPSBfJChzdHlsZS5zaGVldCkgYXMgQ1NTU3R5bGVTaGVldFxyXG5cclxuICAgIGNvbnN0IGFkZENvbG9yUnVsZSA9IChzZWxlY3Rvcjogc3RyaW5nLCBsaWdodDogc3RyaW5nLCBkYXJrOiBzdHJpbmcsIGV4dHJhID0gJycpID0+IHtcclxuICAgICAgICBjb25zdCBtaXhlZCA9IHRpbnljb2xvci5taXgobGlnaHQsICcjMUI1RTIwJywgNzApLnRvSGV4U3RyaW5nKClcclxuICAgICAgICBzaGVldC5pbnNlcnRSdWxlKGAke2V4dHJhfS5hc3NpZ25tZW50JHtzZWxlY3Rvcn0geyBiYWNrZ3JvdW5kLWNvbG9yOiAke2xpZ2h0fTsgfWAsIDApXHJcbiAgICAgICAgc2hlZXQuaW5zZXJ0UnVsZShgJHtleHRyYX0uYXNzaWdubWVudCR7c2VsZWN0b3J9LmRvbmUgeyBiYWNrZ3JvdW5kLWNvbG9yOiAke2Rhcmt9OyB9YCwgMClcclxuICAgICAgICBzaGVldC5pbnNlcnRSdWxlKGAke2V4dHJhfS5hc3NpZ25tZW50JHtzZWxlY3Rvcn06OmJlZm9yZSB7IGJhY2tncm91bmQtY29sb3I6ICR7bWl4ZWR9OyB9YCwgMClcclxuICAgICAgICBzaGVldC5pbnNlcnRSdWxlKGAke2V4dHJhfS5hc3NpZ25tZW50SXRlbSR7c2VsZWN0b3J9PmkgeyBiYWNrZ3JvdW5kLWNvbG9yOiAke2xpZ2h0fTsgfWAsIDApXHJcbiAgICAgICAgc2hlZXQuaW5zZXJ0UnVsZShgJHtleHRyYX0uYXNzaWdubWVudEl0ZW0ke3NlbGVjdG9yfS5kb25lPmkgeyBiYWNrZ3JvdW5kLWNvbG9yOiAke2Rhcmt9OyB9YCwgMClcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjcmVhdGVQYWxldHRlID0gKGNvbG9yOiBzdHJpbmcpID0+IHRpbnljb2xvcihjb2xvcikuZGFya2VuKDI0KS50b0hleFN0cmluZygpXHJcblxyXG4gICAgaWYgKGxvY2FsU3RvcmFnZS5jb2xvclR5cGUgPT09ICdhc3NpZ25tZW50Jykge1xyXG4gICAgICAgIE9iamVjdC5lbnRyaWVzKGFzc2lnbm1lbnRDb2xvcnMpLmZvckVhY2goKFtuYW1lLCBjb2xvcl0pID0+IHtcclxuICAgICAgICAgICAgYWRkQ29sb3JSdWxlKGAuJHtuYW1lfWAsIGNvbG9yLCBwYWxldHRlW2NvbG9yXSB8fCBjcmVhdGVQYWxldHRlKGNvbG9yKSlcclxuICAgICAgICB9KVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBPYmplY3QuZW50cmllcyhjbGFzc0NvbG9ycykuZm9yRWFjaCgoW25hbWUsIGNvbG9yXSkgPT4ge1xyXG4gICAgICAgICAgICBhZGRDb2xvclJ1bGUoYFtkYXRhLWNsYXNzPVxcXCIke25hbWV9XFxcIl1gLCBjb2xvciwgcGFsZXR0ZVtjb2xvcl0gfHwgY3JlYXRlUGFsZXR0ZShjb2xvcikpXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBhZGRDb2xvclJ1bGUoJy50YXNrJywgJyNGNUY1RjUnLCAnI0UwRTBFMCcpXHJcbiAgICBhZGRDb2xvclJ1bGUoJy50YXNrJywgJyM0MjQyNDInLCAnIzIxMjEyMScsICcuZGFyayAnKVxyXG59XHJcblxyXG4vLyBUaGUgZnVuY3Rpb24gdGhlbiBuZWVkcyB0byBiZSBjYWxsZWQuXHJcbnVwZGF0ZUNvbG9ycygpXHJcblxyXG4vLyBUaGUgZWxlbWVudHMgdGhhdCBjb250cm9sIHRoZSBzZXR0aW5ncyBhbHNvIG5lZWQgZXZlbnQgbGlzdGVuZXJzXHJcbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zZXR0aW5nc0NvbnRyb2wnKS5mb3JFYWNoKChlKSA9PiB7XHJcbiAgICBpZiAoIShlIGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudCkpIHJldHVyblxyXG4gICAgaWYgKGxvY2FsU3RvcmFnZVtlLm5hbWVdICE9IG51bGwpIHtcclxuICAgICAgICBpZiAoZS50eXBlID09PSAnY2hlY2tib3gnKSB7XHJcbiAgICAgICAgZS5jaGVja2VkID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2VbZS5uYW1lXSlcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGUudmFsdWUgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZVtlLm5hbWVdKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGUuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGV2dCkgPT4ge1xyXG4gICAgICAgIGlmIChlLnR5cGUgPT09ICdjaGVja2JveCcpIHtcclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlV3JpdGUoZS5uYW1lLCBlLmNoZWNrZWQpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlV3JpdGUoZS5uYW1lLCBlLnZhbHVlKVxyXG4gICAgICAgIH1cclxuICAgICAgICBzd2l0Y2ggKGUubmFtZSkge1xyXG4gICAgICAgICAgICBjYXNlICdyZWZyZXNoUmF0ZSc6IHJldHVybiBpbnRlcnZhbFJlZnJlc2goKVxyXG4gICAgICAgICAgICBjYXNlICdlYXJseVRlc3QnOiByZXR1cm4gZGlzcGxheSgpXHJcbiAgICAgICAgICAgIGNhc2UgJ2Fzc2lnbm1lbnRTcGFuJzogcmV0dXJuIGRpc3BsYXkoKVxyXG4gICAgICAgICAgICBjYXNlICdwcm9qZWN0c0luVGVzdFBhbmUnOiByZXR1cm4gZGlzcGxheSgpXHJcbiAgICAgICAgICAgIGNhc2UgJ2hpZGVhc3NpZ25tZW50cyc6IHJldHVybiBkaXNwbGF5KClcclxuICAgICAgICAgICAgY2FzZSAnaG9saWRheVRoZW1lcyc6IHJldHVybiBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC50b2dnbGUoJ2hvbGlkYXlUaGVtZXMnLCBlLmNoZWNrZWQpXHJcbiAgICAgICAgICAgIGNhc2UgJ3NlcFRhc2tDbGFzcyc6IGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnRvZ2dsZSgnc2VwVGFza0NsYXNzJywgZS5jaGVja2VkKTsgcmV0dXJuIGRpc3BsYXkoKVxyXG4gICAgICAgICAgICBjYXNlICdzZXBUYXNrcyc6IHJldHVybiBlbGVtQnlJZCgnc2VwVGFza3NSZWZyZXNoJykuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59KVxyXG5cclxuLy8gVGhpcyBhbHNvIG5lZWRzIHRvIGJlIGRvbmUgZm9yIHJhZGlvIGJ1dHRvbnNcclxuY29uc3QgY29sb3JUeXBlID1cclxuICAgIF8kKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYGlucHV0W25hbWU9XFxcImNvbG9yVHlwZVxcXCJdW3ZhbHVlPVxcXCIke2xvY2FsU3RvcmFnZS5jb2xvclR5cGV9XFxcIl1gKSkgYXMgSFRNTElucHV0RWxlbWVudFxyXG5jb2xvclR5cGUuY2hlY2tlZCA9IHRydWVcclxuQXJyYXkuZnJvbShkb2N1bWVudC5nZXRFbGVtZW50c0J5TmFtZSgnY29sb3JUeXBlJykpLmZvckVhY2goKGMpID0+IHtcclxuICBjLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChldnQpID0+IHtcclxuICAgIGNvbnN0IHYgPSAoXyQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaW5wdXRbbmFtZT1cImNvbG9yVHlwZVwiXTpjaGVja2VkJykpIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlXHJcbiAgICBsb2NhbFN0b3JhZ2UuY29sb3JUeXBlID0gdlxyXG4gICAgaWYgKHYgPT09ICdjbGFzcycpIHtcclxuICAgICAgZWxlbUJ5SWQoJ2Fzc2lnbm1lbnRDb2xvcnMnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXHJcbiAgICAgIGVsZW1CeUlkKCdjbGFzc0NvbG9ycycpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBlbGVtQnlJZCgnYXNzaWdubWVudENvbG9ycycpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXHJcbiAgICAgIGVsZW1CeUlkKCdjbGFzc0NvbG9ycycpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcclxuICAgIH1cclxuICAgIHJldHVybiB1cGRhdGVDb2xvcnMoKVxyXG4gIH0pXHJcbn0pXHJcblxyXG4vLyBUaGUgc2FtZSBnb2VzIGZvciB0ZXh0YXJlYXMuXHJcbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3RleHRhcmVhJykuZm9yRWFjaCgoZSkgPT4ge1xyXG4gIGlmICgoZS5uYW1lICE9PSAnYXRoZW5hRGF0YVJhdycpICYmIChsb2NhbFN0b3JhZ2VbZS5uYW1lXSAhPSBudWxsKSkge1xyXG4gICAgZS52YWx1ZSA9IGxvY2FsU3RvcmFnZVtlLm5hbWVdXHJcbiAgfVxyXG4gIGUuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoZXZ0KSA9PiB7XHJcbiAgICBsb2NhbFN0b3JhZ2VbZS5uYW1lXSA9IGUudmFsdWVcclxuICAgIGlmIChlLm5hbWUgPT09ICdhdGhlbmFEYXRhUmF3Jykge1xyXG4gICAgICB1cGRhdGVBdGhlbmFEYXRhKGUudmFsdWUpXHJcbiAgICB9XHJcbiAgfSlcclxufSlcclxuXHJcbi8vIDxhIG5hbWU9XCJzdGFydGluZ1wiLz5cclxuLy8gU3RhcnRpbmcgZXZlcnl0aGluZ1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tXHJcbi8vXHJcbi8vIEZpbmFsbHkhIFdlIGFyZSAoYWxtb3N0KSBkb25lIVxyXG4vL1xyXG4vLyBCZWZvcmUgZ2V0dGluZyB0byBhbnl0aGluZywgbGV0J3MgcHJpbnQgb3V0IGEgd2VsY29taW5nIG1lc3NhZ2UgdG8gdGhlIGNvbnNvbGUhXHJcbmNvbnNvbGUubG9nKCclY0NoZWNrIFBDUicsICdjb2xvcjogIzAwNDAwMDsgZm9udC1zaXplOiAzZW0nKVxyXG5jb25zb2xlLmxvZyhgJWNWZXJzaW9uICR7VkVSU0lPTn0gKENoZWNrIGJlbG93IGZvciBjdXJyZW50IHZlcnNpb24pYCwgJ2ZvbnQtc2l6ZTogMS4xZW0nKVxyXG5jb25zb2xlLmxvZyhgV2VsY29tZSB0byB0aGUgZGV2ZWxvcGVyIGNvbnNvbGUgZm9yIHlvdXIgYnJvd3NlciEgQmVzaWRlcyBsb29raW5nIGF0IHRoZSBzb3VyY2UgY29kZSwgXFxcclxueW91IGNhbiBhbHNvIHBsYXkgYXJvdW5kIHdpdGggQ2hlY2sgUENSIGJ5IGV4ZWN1dGluZyB0aGUgbGluZXMgYmVsb3c6XHJcbiVjXFx0ZmV0Y2godHJ1ZSkgICAgICAgICAgICAgICAlYy8vIFJlbG9hZHMgYWxsIG9mIHlvdXIgYXNzaWdubWVudHMgKHRoZSB0cnVlIGlzIGZvciBmb3JjaW5nIGEgcmVsb2FkIGlmIG9uZSBcXFxyXG5oYXMgYWxyZWFkeSBiZWVuIHRyaWdnZXJlZCBpbiB0aGUgbGFzdCBtaW51dGUpXHJcbiVjXFx0ZGF0YSAgICAgICAgICAgICAgICAgICAgICAlYy8vIERpc3BsYXlzIHRoZSBvYmplY3QgdGhhdCBjb250YWlucyB0aGUgZGF0YSBwYXJzZWQgZnJvbSBQQ1IncyBpbnRlcmZhY2VcclxuJWNcXHRhY3Rpdml0eSAgICAgICAgICAgICAgICAgICVjLy8gVGhlIGRhdGEgZm9yIHRoZSBhc3NpZ25tZW50cyB0aGF0IHNob3cgdXAgaW4gdGhlIGFjdGl2aXR5IHBhbmVcclxuJWNcXHRleHRyYSAgICAgICAgICAgICAgICAgICAgICVjLy8gQWxsIG9mIHRoZSB0YXNrcyB5b3UndmUgY3JlYXRlZCBieSBjbGlja2luZyB0aGUgKyBidXR0b25cclxuJWNcXHRhdGhlbmFEYXRhICAgICAgICAgICAgICAgICVjLy8gVGhlIGRhdGEgZmV0Y2hlZCBmcm9tIEF0aGVuYSAoaWYgeW91J3ZlIHBhc3RlZCB0aGUgcmF3IGRhdGEgaW50byBzZXR0aW5ncylcclxuJWNcXHRzbmFja2JhcihcIkhlbGxvIFdvcmxkIVwiKSAgJWMvLyBDcmVhdGVzIGEgc25hY2tiYXIgc2hvd2luZyB0aGUgbWVzc2FnZSBcIkhlbGxvIFdvcmxkIVwiXHJcbiVjXFx0ZGlzcGxheUVycm9yKG5ldyBFcnJvcigpKSAlYy8vIERpc3BsYXlzIHRoZSBzdGFjayB0cmFjZSBmb3IgYSByYW5kb20gZXJyb3IgKEp1c3QgZG9uJ3Qgc3VibWl0IGl0ISlcclxuJWNcXHRjbG9zZUVycm9yKCkgICAgICAgICAgICAgICVjLy8gQ2xvc2VzIHRoYXQgZGlhbG9nYCxcclxuICAgICAgICAgICAgICAgLi4uKChbXSBhcyBzdHJpbmdbXSkuY29uY2F0KC4uLkFycmF5LmZyb20obmV3IEFycmF5KDgpLCAoKSA9PiBbJ2NvbG9yOiBpbml0aWFsJywgJ2NvbG9yOiBncmV5J10pKSkpXHJcbmNvbnNvbGUubG9nKCcnKVxyXG5cclxuLy8gVGhlIFwibGFzdCB1cGRhdGVkXCIgdGV4dCBpcyBzZXQgdG8gdGhlIGNvcnJlY3QgZGF0ZS5cclxuY29uc3QgdHJpZWRMYXN0VXBkYXRlID0gbG9jYWxTdG9yYWdlUmVhZCgnbGFzdFVwZGF0ZScpXHJcbmVsZW1CeUlkKCdsYXN0VXBkYXRlJykuaW5uZXJIVE1MID0gdHJpZWRMYXN0VXBkYXRlID8gZm9ybWF0VXBkYXRlKHRyaWVkTGFzdFVwZGF0ZSkgOiAnTmV2ZXInXHJcblxyXG4vLyBOb3csIHdlIGxvYWQgdGhlIHNhdmVkIGFzc2lnbm1lbnRzIChpZiBhbnkpIGFuZCBmZXRjaCB0aGUgY3VycmVudCBhc3NpZ25tZW50cyBmcm9tIFBDUi5cclxuaWYgKGxvY2FsU3RvcmFnZVJlYWQoJ2RhdGEnKSAhPSBudWxsKSB7XHJcbiAgICBzZXREYXRhKGxvY2FsU3RvcmFnZVJlYWQoJ2RhdGEnKSlcclxuXHJcbiAgICAvLyBOb3cgY2hlY2sgaWYgdGhlcmUncyBhY3Rpdml0eVxyXG4gICAgcmVjZW50QWN0aXZpdHkoKS5mb3JFYWNoKChpdGVtKSA9PiB7XHJcbiAgICAgICAgYWRkQWN0aXZpdHkoaXRlbVswXSwgaXRlbVsxXSwgbmV3IERhdGUoaXRlbVsyXSksIHRydWUsIGl0ZW1bM10pXHJcbiAgICB9KVxyXG5cclxuICAgIGRpc3BsYXkoKVxyXG59XHJcblxyXG5mZXRjaCgpXHJcblxyXG4vLyA8YSBuYW1lPVwiZXZlbnRzXCIvPlxyXG4vLyBFdmVudHNcclxuLy8gLS0tLS0tXHJcbi8vXHJcbi8vIFRoZSBkb2N1bWVudCBib2R5IG5lZWRzIHRvIGJlIGVuYWJsZWQgZm9yIGhhbW1lci5qcyBldmVudHMuXHJcbmRlbGV0ZSBIYW1tZXIuZGVmYXVsdHMuY3NzUHJvcHMudXNlclNlbGVjdFxyXG5jb25zdCBoYW1tZXJ0aW1lID0gbmV3IEhhbW1lci5NYW5hZ2VyKGRvY3VtZW50LmJvZHksIHtcclxuICByZWNvZ25pemVyczogW1xyXG4gICAgW0hhbW1lci5QYW4sIHtkaXJlY3Rpb246IEhhbW1lci5ESVJFQ1RJT05fSE9SSVpPTlRBTH1dXHJcbiAgXVxyXG59KVxyXG5cclxuLy8gRm9yIHRvdWNoIGRpc3BsYXlzLCBoYW1tZXIuanMgaXMgdXNlZCB0byBtYWtlIHRoZSBzaWRlIG1lbnUgYXBwZWFyL2Rpc2FwcGVhci4gVGhlIGNvZGUgYmVsb3cgaXNcclxuLy8gYWRhcHRlZCBmcm9tIE1hdGVyaWFsaXplJ3MgaW1wbGVtZW50YXRpb24uXHJcbmxldCBtZW51T3V0ID0gZmFsc2VcclxuY29uc3QgZHJhZ1RhcmdldCA9IG5ldyBIYW1tZXIoZWxlbUJ5SWQoJ2RyYWdUYXJnZXQnKSlcclxuZHJhZ1RhcmdldC5vbigncGFuJywgKGUpID0+IHtcclxuICBpZiAoZS5wb2ludGVyVHlwZSA9PT0gJ3RvdWNoJykge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICBsZXQgeyB4IH0gPSBlLmNlbnRlclxyXG4gICAgY29uc3QgeyB5IH0gPSBlLmNlbnRlclxyXG5cclxuICAgIGNvbnN0IHNia2cgPSBlbGVtQnlJZCgnc2lkZUJhY2tncm91bmQnKVxyXG4gICAgc2JrZy5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xyXG4gICAgc2JrZy5zdHlsZS5vcGFjaXR5ID0gJzAnXHJcbiAgICBlbGVtQnlJZCgnc2lkZU5hdicpLmNsYXNzTGlzdC5hZGQoJ21hbnVhbCcpXHJcblxyXG4gICAgLy8gS2VlcCB3aXRoaW4gYm91bmRhcmllc1xyXG4gICAgaWYgKHggPiAyNDApIHtcclxuICAgICAgeCA9IDI0MFxyXG4gICAgfSBlbHNlIGlmICh4IDwgMCkge1xyXG4gICAgICB4ID0gMFxyXG5cclxuICAgICAgLy8gTGVmdCBEaXJlY3Rpb25cclxuICAgICAgaWYgKHggPCAxMjApIHtcclxuICAgICAgICBtZW51T3V0ID0gZmFsc2VcclxuICAgICAgLy8gUmlnaHQgRGlyZWN0aW9uXHJcbiAgICAgIH0gZWxzZSBpZiAoeCA+PSAxMjApIHtcclxuICAgICAgICBtZW51T3V0ID0gdHJ1ZVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZWxlbUJ5SWQoJ3NpZGVOYXYnKS5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlWCgke3ggLSAyNDB9cHgpYFxyXG4gICAgY29uc3Qgb3ZlcmxheVBlcmMgPSBNYXRoLm1pbih4IC8gNDgwLCAwLjUpXHJcbiAgICByZXR1cm4gc2JrZy5zdHlsZS5vcGFjaXR5ID0gU3RyaW5nKG92ZXJsYXlQZXJjKVxyXG4gIH1cclxufSlcclxuXHJcbmRyYWdUYXJnZXQub24oJ3BhbmVuZCcsIChlKSA9PiB7XHJcbiAgaWYgKGUucG9pbnRlclR5cGUgPT09ICd0b3VjaCcpIHtcclxuICAgIGxldCBzaWRlTmF2XHJcbiAgICBjb25zdCB7IHZlbG9jaXR5WCB9ID0gZVxyXG4gICAgLy8gSWYgdmVsb2NpdHlYIDw9IDAuMyB0aGVuIHRoZSB1c2VyIGlzIGZsaW5naW5nIHRoZSBtZW51IGNsb3NlZCBzbyBpZ25vcmUgbWVudU91dFxyXG4gICAgaWYgKChtZW51T3V0ICYmICh2ZWxvY2l0eVggPD0gMC4zKSkgfHwgKHZlbG9jaXR5WCA8IC0wLjUpKSB7XHJcbiAgICAgIHNpZGVOYXYgPSBlbGVtQnlJZCgnc2lkZU5hdicpXHJcbiAgICAgIHNpZGVOYXYuY2xhc3NMaXN0LnJlbW92ZSgnbWFudWFsJylcclxuICAgICAgc2lkZU5hdi5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG4gICAgICBzaWRlTmF2LnN0eWxlLnRyYW5zZm9ybSA9ICcnXHJcbiAgICAgIGVsZW1CeUlkKCdkcmFnVGFyZ2V0Jykuc3R5bGUud2lkdGggPSAnMTAwJSdcclxuXHJcbiAgICB9IGVsc2UgaWYgKCFtZW51T3V0IHx8ICh2ZWxvY2l0eVggPiAwLjMpKSB7XHJcbiAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnYXV0bydcclxuICAgICAgc2lkZU5hdiA9IGVsZW1CeUlkKCdzaWRlTmF2JylcclxuICAgICAgc2lkZU5hdi5jbGFzc0xpc3QucmVtb3ZlKCdtYW51YWwnKVxyXG4gICAgICBzaWRlTmF2LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgICAgIHNpZGVOYXYuc3R5bGUudHJhbnNmb3JtID0gJydcclxuICAgICAgZWxlbUJ5SWQoJ3NpZGVCYWNrZ3JvdW5kJykuc3R5bGUub3BhY2l0eSA9ICcnXHJcbiAgICAgIGVsZW1CeUlkKCdkcmFnVGFyZ2V0Jykuc3R5bGUud2lkdGggPSAnMTBweCdcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiBlbGVtQnlJZCgnc2lkZUJhY2tncm91bmQnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXHJcbiAgICAgICwgMzUwKVxyXG4gICAgfVxyXG4gIH1cclxufSlcclxuXHJcbmRyYWdUYXJnZXQub24oJ3RhcCcsIChlKSA9PiB7XHJcbiAgICBlbGVtQnlJZCgnc2lkZUJhY2tncm91bmQnKS5jbGljaygpXHJcbiAgICBlLnByZXZlbnREZWZhdWx0KClcclxufSlcclxuXHJcbmNvbnN0IGR0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RyYWdUYXJnZXQnKVxyXG5cclxuLy8gVGhlIGFjdGl2aXR5IGZpbHRlciBidXR0b24gYWxzbyBuZWVkcyBhbiBldmVudCBsaXN0ZW5lci5cclxucmlwcGxlKGVsZW1CeUlkKCdmaWx0ZXJBY3Rpdml0eScpKVxyXG5lbGVtQnlJZCgnZmlsdGVyQWN0aXZpdHknKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICBlbGVtQnlJZCgnaW5mb0FjdGl2aXR5JykuY2xhc3NMaXN0LnRvZ2dsZSgnZmlsdGVyJylcclxufSlcclxuXHJcbi8vIEF0IHRoZSBzdGFydCwgaXQgbmVlZHMgdG8gYmUgY29ycmVjdGx5IHBvcHVsYXRlZFxyXG5jb25zdCBhY3Rpdml0eVR5cGVzID0gbG9jYWxTdG9yYWdlUmVhZCgnc2hvd25BY3Rpdml0eScsIHtcclxuICBhZGQ6IHRydWUsXHJcbiAgZWRpdDogdHJ1ZSxcclxuICBkZWxldGU6IHRydWVcclxufSlcclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZVNlbGVjdE51bSgpOiBzdHJpbmcge1xyXG4gICAgY29uc3QgYyA9IChib29sOiBib29sZWFuKSAgPT4gYm9vbCA/IDEgOiAwXHJcbiAgICBjb25zdCBjb3VudCA9IFN0cmluZyhjKGFjdGl2aXR5VHlwZXMuYWRkKSArIGMoYWN0aXZpdHlUeXBlcy5lZGl0KSArIGMoYWN0aXZpdHlUeXBlcy5kZWxldGUpKVxyXG4gICAgcmV0dXJuIGVsZW1CeUlkKCdzZWxlY3ROdW0nKS5pbm5lckhUTUwgPSBjb3VudFxyXG59XHJcbnVwZGF0ZVNlbGVjdE51bSgpXHJcbk9iamVjdC5lbnRyaWVzKGFjdGl2aXR5VHlwZXMpLmZvckVhY2goKFt0eXBlLCBlbmFibGVkXSkgPT4ge1xyXG4gIGlmICh0eXBlICE9PSAnYWRkJyAmJiB0eXBlICE9PSAnZWRpdCcgJiYgdHlwZSAhPT0gJ2RlbGV0ZScpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBhY3Rpdml0eSB0eXBlICR7dHlwZX1gKVxyXG4gIH1cclxuXHJcbiAgY29uc3Qgc2VsZWN0RWwgPSBlbGVtQnlJZCh0eXBlICsgJ1NlbGVjdCcpIGFzIEhUTUxJbnB1dEVsZW1lbnRcclxuICBzZWxlY3RFbC5jaGVja2VkID0gZW5hYmxlZFxyXG4gIGlmIChlbmFibGVkKSB7IGVsZW1CeUlkKCdpbmZvQWN0aXZpdHknKS5jbGFzc0xpc3QuYWRkKHR5cGUpIH1cclxuICBzZWxlY3RFbC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZXZ0KSA9PiB7XHJcbiAgICBhY3Rpdml0eVR5cGVzW3R5cGVdID0gc2VsZWN0RWwuY2hlY2tlZFxyXG4gICAgZWxlbUJ5SWQoJ2luZm9BY3Rpdml0eScpLnNldEF0dHJpYnV0ZSgnZGF0YS1maWx0ZXJlZCcsIHVwZGF0ZVNlbGVjdE51bSgpKVxyXG4gICAgZWxlbUJ5SWQoJ2luZm9BY3Rpdml0eScpLmNsYXNzTGlzdC50b2dnbGUodHlwZSlcclxuICAgIHJldHVybiBsb2NhbFN0b3JhZ2Uuc2hvd25BY3Rpdml0eSA9IEpTT04uc3RyaW5naWZ5KGFjdGl2aXR5VHlwZXMpXHJcbiAgfSlcclxufSlcclxuXHJcbi8vIFRoZSBzaG93IGNvbXBsZXRlZCB0YXNrcyBjaGVja2JveCBpcyBzZXQgY29ycmVjdGx5IGFuZCBpcyBhc3NpZ25lZCBhbiBldmVudCBsaXN0ZW5lci5cclxuY29uc3Qgc2hvd0RvbmVUYXNrc0VsID0gZWxlbUJ5SWQoJ3Nob3dEb25lVGFza3MnKSBhcyBIVE1MSW5wdXRFbGVtZW50XHJcbmlmIChsb2NhbFN0b3JhZ2VSZWFkKCdzaG93RG9uZVRhc2tzJykpIHtcclxuICBzaG93RG9uZVRhc2tzRWwuY2hlY2tlZCA9IHRydWVcclxuICBlbGVtQnlJZCgnaW5mb1Rhc2tzSW5uZXInKS5jbGFzc0xpc3QuYWRkKCdzaG93RG9uZVRhc2tzJylcclxufVxyXG5zaG93RG9uZVRhc2tzRWwuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKCkgPT4ge1xyXG4gIGxvY2FsU3RvcmFnZVdyaXRlKCdzaG93RG9uZVRhc2tzJywgc2hvd0RvbmVUYXNrc0VsLmNoZWNrZWQpXHJcbiAgZWxlbUJ5SWQoJ2luZm9UYXNrc0lubmVyJykuY2xhc3NMaXN0LnRvZ2dsZSgnc2hvd0RvbmVUYXNrcycsIHNob3dEb25lVGFza3NFbC5jaGVja2VkKVxyXG59KVxyXG5cclxuLy8gPGEgbmFtZT1cInVwZGF0ZXNcIi8+XHJcbi8vIFVwZGF0ZXMgYW5kIE5ld3NcclxuLy8gLS0tLS0tLS0tLS0tLS0tLVxyXG4vL1xyXG5cclxuaWYgKGxvY2F0aW9uLnByb3RvY29sID09PSAnY2hyb21lLWV4dGVuc2lvbjonKSB7IGNoZWNrQ29tbWl0KCkgfVxyXG5cclxuLy8gVGhpcyB1cGRhdGUgZGlhbG9nIGFsc28gbmVlZHMgdG8gYmUgY2xvc2VkIHdoZW4gdGhlIGJ1dHRvbnMgYXJlIGNsaWNrZWQuXHJcbmVsZW1CeUlkKCd1cGRhdGVEZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gIGVsZW1CeUlkKCd1cGRhdGUnKS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgZWxlbUJ5SWQoJ3VwZGF0ZUJhY2tncm91bmQnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXHJcbiAgfSwgMzUwKVxyXG59KVxyXG5cclxuLy8gRm9yIG5ld3MsIHRoZSBsYXRlc3QgbmV3cyBpcyBmZXRjaGVkIGZyb20gYSBHaXRIdWIgZ2lzdC5cclxuZmV0Y2hOZXdzKClcclxuXHJcbi8vIFRoZSBuZXdzIGRpYWxvZyB0aGVuIG5lZWRzIHRvIGJlIGNsb3NlZCB3aGVuIE9LIG9yIHRoZSBiYWNrZ3JvdW5kIGlzIGNsaWNrZWQuXHJcbmZ1bmN0aW9uIGNsb3NlTmV3cygpOiB2b2lkIHtcclxuICBlbGVtQnlJZCgnbmV3cycpLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICBlbGVtQnlJZCgnbmV3c0JhY2tncm91bmQnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXHJcbiAgfSwgMzUwKVxyXG59XHJcblxyXG5lbGVtQnlJZCgnbmV3c09rJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbG9zZU5ld3MpXHJcbmVsZW1CeUlkKCduZXdzQmFja2dyb3VuZCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xvc2VOZXdzKVxyXG5cclxuLy8gSXQgYWxzbyBuZWVkcyB0byBiZSBvcGVuZWQgd2hlbiB0aGUgbmV3cyBidXR0b24gaXMgY2xpY2tlZC5cclxuZWxlbUJ5SWQoJ25ld3NCJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgZWxlbUJ5SWQoJ3NpZGVCYWNrZ3JvdW5kJykuY2xpY2soKVxyXG4gIGNvbnN0IGRpc3BOZXdzID0gKCkgPT4ge1xyXG4gICAgZWxlbUJ5SWQoJ25ld3NCYWNrZ3JvdW5kJykuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcclxuICAgIHJldHVybiBlbGVtQnlJZCgnbmV3cycpLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcbiAgfVxyXG5cclxuICBpZiAoZWxlbUJ5SWQoJ25ld3NDb250ZW50JykuY2hpbGROb2Rlcy5sZW5ndGggPT09IDApIHtcclxuICAgIGdldE5ld3MoZGlzcE5ld3MpXHJcbiAgfSBlbHNlIHtcclxuICAgIGRpc3BOZXdzKClcclxuICB9XHJcbn0pXHJcblxyXG4vLyBUaGUgc2FtZSBnb2VzIGZvciB0aGUgZXJyb3IgZGlhbG9nLlxyXG5mdW5jdGlvbiBjbG9zZUVycm9yKCk6IHZvaWQge1xyXG4gIGVsZW1CeUlkKCdlcnJvcicpLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICBlbGVtQnlJZCgnZXJyb3JCYWNrZ3JvdW5kJykuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xyXG4gIH0sIDM1MClcclxufVxyXG5cclxuZWxlbUJ5SWQoJ2Vycm9yTm8nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsb3NlRXJyb3IpXHJcbmVsZW1CeUlkKCdlcnJvckJhY2tncm91bmQnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsb3NlRXJyb3IpXHJcblxyXG4vLyA8YSBuYW1lPVwibmV3XCIvPlxyXG4vLyBBZGRpbmcgbmV3IGFzc2lnbm1lbnRzXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuLy9cclxuLy8gVGhlIGV2ZW50IGxpc3RlbmVycyBmb3IgdGhlIG5ldyBidXR0b25zIGFyZSBhZGRlZC5cclxucmlwcGxlKGVsZW1CeUlkKCduZXcnKSlcclxucmlwcGxlKGVsZW1CeUlkKCduZXdUYXNrJykpXHJcbmNvbnN0IG9uTmV3VGFzayA9ICgpID0+IHtcclxuICB1cGRhdGVOZXdUaXBzKChlbGVtQnlJZCgnbmV3VGV4dCcpIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlID0gJycpXHJcbiAgZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nXHJcbiAgZWxlbUJ5SWQoJ25ld0JhY2tncm91bmQnKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xyXG4gIGVsZW1CeUlkKCduZXdEaWFsb2cnKS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG4gIGVsZW1CeUlkKCduZXdUZXh0JykuZm9jdXMoKVxyXG59XHJcbmVsZW1CeUlkKCduZXcnKS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgb25OZXdUYXNrKVxyXG5lbGVtQnlJZCgnbmV3VGFzaycpLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBvbk5ld1Rhc2spXHJcblxyXG4vLyBBIGZ1bmN0aW9uIHRvIGNsb3NlIHRoZSBkaWFsb2cgaXMgdGhlbiBkZWZpbmVkLlxyXG5mdW5jdGlvbiBjbG9zZU5ldygpOiB2b2lkIHtcclxuICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2F1dG8nXHJcbiAgZWxlbUJ5SWQoJ25ld0RpYWxvZycpLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICBlbGVtQnlJZCgnbmV3QmFja2dyb3VuZCcpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcclxuICB9LCAzNTApXHJcbn1cclxuXHJcbi8vIFRoaXMgZnVuY3Rpb24gaXMgc2V0IHRvIGJlIGNhbGxlZCBjYWxsZWQgd2hlbiB0aGUgRVNDIGtleSBpcyBjYWxsZWQgaW5zaWRlIG9mIHRoZSBkaWFsb2cuXHJcbmVsZW1CeUlkKCduZXdUZXh0JykuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldnQpID0+IHtcclxuICBpZiAoZXZ0LndoaWNoID09PSAyNykgeyAvLyBFc2NhcGUga2V5IHByZXNzZWRcclxuICAgIGNsb3NlTmV3KClcclxuICB9XHJcbn0pXHJcblxyXG4vLyBBbiBldmVudCBsaXN0ZW5lciB0byBjYWxsIHRoZSBmdW5jdGlvbiBpcyBhbHNvIGFkZGVkIHRvIHRoZSBYIGJ1dHRvblxyXG5lbGVtQnlJZCgnbmV3Q2FuY2VsJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbG9zZU5ldylcclxuXHJcbi8vIFdoZW4gdGhlIGVudGVyIGtleSBpcyBwcmVzc2VkIG9yIHRoZSBzdWJtaXQgYnV0dG9uIGlzIGNsaWNrZWQsIHRoZSBuZXcgYXNzaWdubWVudCBpcyBhZGRlZC5cclxuZWxlbUJ5SWQoJ25ld0RpYWxvZycpLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIChldnQpID0+IHtcclxuICBldnQucHJldmVudERlZmF1bHQoKVxyXG4gIGNvbnN0IHRleHQgPSAoZWxlbUJ5SWQoJ25ld1RleHQnKSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZVxyXG4gIGNvbnN0IHsgY2xzLCBkdWUsIHN0IH0gPSBwYXJzZUN1c3RvbVRhc2sodGV4dClcclxuICBsZXQgZW5kOiAnRm9yZXZlcid8bnVtYmVyID0gJ0ZvcmV2ZXInXHJcblxyXG4gIGNvbnN0IHN0YXJ0ID0gKHN0ICE9IG51bGwpID8gdG9EYXRlTnVtKGNocm9uby5wYXJzZURhdGUoc3QpKSA6IHRvZGF5KClcclxuICBpZiAoZHVlICE9IG51bGwpIHtcclxuICAgIGVuZCA9IHN0YXJ0XHJcbiAgICBpZiAoZW5kIDwgc3RhcnQpIHsgLy8gQXNzaWdubWVuZCBlbmRzIGJlZm9yZSBpdCBpcyBhc3NpZ25lZFxyXG4gICAgICBlbmQgKz0gTWF0aC5jZWlsKChzdGFydCAtIGVuZCkgLyA3KSAqIDdcclxuICAgIH1cclxuICB9XHJcbiAgYWRkVG9FeHRyYSh7XHJcbiAgICBib2R5OiB0ZXh0LmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgdGV4dC5zdWJzdHIoMSksXHJcbiAgICBkb25lOiBmYWxzZSxcclxuICAgIHN0YXJ0LFxyXG4gICAgY2xhc3M6IChjbHMgIT0gbnVsbCkgPyBjbHMudG9Mb3dlckNhc2UoKS50cmltKCkgOiBudWxsLFxyXG4gICAgZW5kXHJcbiAgfSlcclxuICBzYXZlRXh0cmEoKVxyXG4gIGNsb3NlTmV3KClcclxuICBkaXNwbGF5KGZhbHNlKVxyXG59KVxyXG5cclxudXBkYXRlTmV3VGlwcygnJywgZmFsc2UpXHJcbmVsZW1CeUlkKCduZXdUZXh0JykuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoKSA9PiB7XHJcbiAgcmV0dXJuIHVwZGF0ZU5ld1RpcHMoKGVsZW1CeUlkKCduZXdUZXh0JykgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWUpXHJcbn0pXHJcblxyXG4vLyBUaGUgY29kZSBiZWxvdyByZWdpc3RlcnMgYSBzZXJ2aWNlIHdvcmtlciB0aGF0IGNhY2hlcyB0aGUgcGFnZSBzbyBpdCBjYW4gYmUgdmlld2VkIG9mZmxpbmUuXHJcbmlmICgnc2VydmljZVdvcmtlcicgaW4gbmF2aWdhdG9yKSB7XHJcbiAgbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIucmVnaXN0ZXIoJy9zZXJ2aWNlLXdvcmtlci5qcycpXHJcbiAgICAudGhlbigocmVnaXN0cmF0aW9uKSA9PlxyXG4gICAgICAvLyBSZWdpc3RyYXRpb24gd2FzIHN1Y2Nlc3NmdWxcclxuICAgICAgY29uc29sZS5sb2coJ1NlcnZpY2VXb3JrZXIgcmVnaXN0cmF0aW9uIHN1Y2Nlc3NmdWwgd2l0aCBzY29wZScsIHJlZ2lzdHJhdGlvbi5zY29wZSkpLmNhdGNoKChlcnIpID0+XHJcbiAgICAgIC8vIHJlZ2lzdHJhdGlvbiBmYWlsZWQgOihcclxuICAgICAgY29uc29sZS5sb2coJ1NlcnZpY2VXb3JrZXIgcmVnaXN0cmF0aW9uIGZhaWxlZDogJywgZXJyKVxyXG4gIClcclxufVxyXG5cclxuLy8gSWYgdGhlIHNlcnZpY2V3b3JrZXIgZGV0ZWN0cyB0aGF0IHRoZSB3ZWIgYXBwIGhhcyBiZWVuIHVwZGF0ZWQsIHRoZSBjb21taXQgaXMgZmV0Y2hlZCBmcm9tIEdpdEh1Yi5cclxubmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIChldmVudCkgPT4ge1xyXG4gICAgY29uc29sZS5sb2coJ0dldHRpbmcgY29tbWl0IGJlY2F1c2Ugb2Ygc2VydmljZXdvcmtlcicpXHJcbiAgICBpZiAoZXZlbnQuZGF0YS5nZXRDb21taXQpIHsgcmV0dXJuIGNoZWNrQ29tbWl0KCkgfVxyXG59KVxyXG4iLCJpbXBvcnQgeyBjbGFzc0J5SWQsIGdldERhdGEsIElBc3NpZ25tZW50IH0gZnJvbSAnLi4vcGNyJ1xyXG5pbXBvcnQgeyBBY3Rpdml0eVR5cGUgfSBmcm9tICcuLi9wbHVnaW5zL2FjdGl2aXR5J1xyXG5pbXBvcnQgeyBhc3NpZ25tZW50SW5Eb25lIH0gZnJvbSAnLi4vcGx1Z2lucy9kb25lJ1xyXG5pbXBvcnQgeyBfJCwgZGF0ZVN0cmluZywgZWxlbUJ5SWQsIGVsZW1lbnQsIHNtb290aFNjcm9sbCB9IGZyb20gJy4uL3V0aWwnXHJcbmltcG9ydCB7IHNlcGFyYXRlIH0gZnJvbSAnLi9hc3NpZ25tZW50J1xyXG5cclxuY29uc3QgaW5zZXJ0VG8gPSBlbGVtQnlJZCgnaW5mb0FjdGl2aXR5JylcclxuZXhwb3J0IGZ1bmN0aW9uIGFkZEFjdGl2aXR5RWxlbWVudChlbDogSFRNTEVsZW1lbnQpOiB2b2lkIHtcclxuICAgIGluc2VydFRvLmluc2VydEJlZm9yZShlbCwgaW5zZXJ0VG8ucXVlcnlTZWxlY3RvcignLmFjdGl2aXR5JykpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVBY3Rpdml0eSh0eXBlOiBBY3Rpdml0eVR5cGUsIGFzc2lnbm1lbnQ6IElBc3NpZ25tZW50LCBkYXRlOiBEYXRlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPzogc3RyaW5nICk6IEhUTUxFbGVtZW50IHtcclxuICAgIGNvbnN0IGNuYW1lID0gY2xhc3NOYW1lIHx8IGNsYXNzQnlJZChhc3NpZ25tZW50LmNsYXNzKVxyXG5cclxuICAgIGNvbnN0IHRlID0gZWxlbWVudCgnZGl2JywgWydhY3Rpdml0eScsICdhc3NpZ25tZW50SXRlbScsIGFzc2lnbm1lbnQuYmFzZVR5cGUsIHR5cGVdLCBgXHJcbiAgICAgICAgPGkgY2xhc3M9J21hdGVyaWFsLWljb25zJz4ke3R5cGV9PC9pPlxyXG4gICAgICAgIDxzcGFuIGNsYXNzPSd0aXRsZSc+JHthc3NpZ25tZW50LnRpdGxlfTwvc3Bhbj5cclxuICAgICAgICA8c21hbGw+JHtzZXBhcmF0ZShjbmFtZSlbMl19PC9zbWFsbD5cclxuICAgICAgICA8ZGl2IGNsYXNzPSdyYW5nZSc+JHtkYXRlU3RyaW5nKGRhdGUpfTwvZGl2PmAsIGBhY3Rpdml0eSR7YXNzaWdubWVudC5pZH1gKVxyXG4gICAgdGUuc2V0QXR0cmlidXRlKCdkYXRhLWNsYXNzJywgY25hbWUpXHJcbiAgICBjb25zdCB7IGlkIH0gPSBhc3NpZ25tZW50XHJcbiAgICBpZiAodHlwZSAhPT0gJ2RlbGV0ZScpIHtcclxuICAgICAgICB0ZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgZG9TY3JvbGxpbmcgPSBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBlbCA9IF8kKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYC5hc3NpZ25tZW50W2lkKj1cXFwiJHtpZH1cXFwiXWApKSBhcyBIVE1MRWxlbWVudFxyXG4gICAgICAgICAgICAgICAgYXdhaXQgc21vb3RoU2Nyb2xsKChlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgKyBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCkgLSAxMTYpXHJcbiAgICAgICAgICAgICAgICBlbC5jbGljaygpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGRvY3VtZW50LmJvZHkuZ2V0QXR0cmlidXRlKCdkYXRhLXZpZXcnKSA9PT0gJzAnKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBkb1Njcm9sbGluZygpXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAoXyQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI25hdlRhYnM+bGk6Zmlyc3QtY2hpbGQnKSkgYXMgSFRNTEVsZW1lbnQpLmNsaWNrKClcclxuICAgICAgICAgICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGRvU2Nyb2xsaW5nLCA1MDApXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChhc3NpZ25tZW50SW5Eb25lKGFzc2lnbm1lbnQuaWQpKSB7XHJcbiAgICAgIHRlLmNsYXNzTGlzdC5hZGQoJ2RvbmUnKVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRlXHJcbn1cclxuIiwiaW1wb3J0IHsgZnJvbURhdGVOdW0sIHRvZGF5IH0gZnJvbSAnLi4vZGF0ZXMnXHJcbmltcG9ydCB7IGRpc3BsYXksIGdldFRpbWVBZnRlciwgSVNwbGl0QXNzaWdubWVudCB9IGZyb20gJy4uL2Rpc3BsYXknXHJcbmltcG9ydCB7IGdldExpc3REYXRlT2Zmc2V0IH0gZnJvbSAnLi4vbmF2aWdhdGlvbidcclxuaW1wb3J0IHsgZ2V0QXR0YWNobWVudE1pbWVUeXBlLCBnZXREYXRhLCBJQXBwbGljYXRpb25EYXRhLCBJQXNzaWdubWVudCwgdXJsRm9yQXR0YWNobWVudCB9IGZyb20gJy4uL3BjcidcclxuaW1wb3J0IHsgcmVjZW50QWN0aXZpdHkgfSBmcm9tICcuLi9wbHVnaW5zL2FjdGl2aXR5J1xyXG5pbXBvcnQgeyBnZXRBdGhlbmFEYXRhIH0gZnJvbSAnLi4vcGx1Z2lucy9hdGhlbmEnXHJcbmltcG9ydCB7IHJlbW92ZUZyb21FeHRyYSwgc2F2ZUV4dHJhIH0gZnJvbSAnLi4vcGx1Z2lucy9jdXN0b21Bc3NpZ25tZW50cydcclxuaW1wb3J0IHsgYWRkVG9Eb25lLCBhc3NpZ25tZW50SW5Eb25lLCByZW1vdmVGcm9tRG9uZSwgc2F2ZURvbmUgfSBmcm9tICcuLi9wbHVnaW5zL2RvbmUnXHJcbmltcG9ydCB7IG1vZGlmaWVkQm9keSwgcmVtb3ZlRnJvbU1vZGlmaWVkLCBzYXZlTW9kaWZpZWQsIHNldE1vZGlmaWVkIH0gZnJvbSAnLi4vcGx1Z2lucy9tb2RpZmllZEFzc2lnbm1lbnRzJ1xyXG5pbXBvcnQgeyBfJCwgZGF0ZVN0cmluZywgZWxlbUJ5SWQsIGVsZW1lbnQsIGZvcmNlTGF5b3V0LCBsb2NhbFN0b3JhZ2VSZWFkLCByaXBwbGUgfSBmcm9tICcuLi91dGlsJ1xyXG5pbXBvcnQgeyByZXNpemUgfSBmcm9tICcuL3Jlc2l6ZXInXHJcblxyXG5jb25zdCBtaW1lVHlwZXM6IHsgW21pbWU6IHN0cmluZ106IFtzdHJpbmcsIHN0cmluZ10gfSA9IHtcclxuICAgICdhcHBsaWNhdGlvbi9tc3dvcmQnOiBbJ1dvcmQgRG9jJywgJ2RvY3VtZW50J10sXHJcbiAgICAnYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LndvcmRwcm9jZXNzaW5nbWwuZG9jdW1lbnQnOiBbJ1dvcmQgRG9jJywgJ2RvY3VtZW50J10sXHJcbiAgICAnYXBwbGljYXRpb24vdm5kLm1zLXBvd2VycG9pbnQnOiBbJ1BQVCBQcmVzZW50YXRpb24nLCAnc2xpZGVzJ10sXHJcbiAgICAnYXBwbGljYXRpb24vcGRmJzogWydQREYgRmlsZScsICdwZGYnXSxcclxuICAgICd0ZXh0L3BsYWluJzogWydUZXh0IERvYycsICdwbGFpbiddXHJcbn1cclxuXHJcbmNvbnN0IGRtcCA9IG5ldyBkaWZmX21hdGNoX3BhdGNoKCkgLy8gRm9yIGRpZmZpbmdcclxuXHJcbmZ1bmN0aW9uIHBvcHVsYXRlQWRkZWREZWxldGVkKGRpZmZzOiBhbnlbXSwgZWRpdHM6IEhUTUxFbGVtZW50KTogYm9vbGVhbiB7XHJcbiAgICBsZXQgYWRkZWQgPSAwXHJcbiAgICBsZXQgZGVsZXRlZCA9IDBcclxuICAgIGRpZmZzLmZvckVhY2goKGRpZmYpID0+IHtcclxuICAgICAgICBpZiAoZGlmZlswXSA9PT0gMSkgeyBhZGRlZCsrIH1cclxuICAgICAgICBpZiAoZGlmZlswXSA9PT0gLTEpIHsgZGVsZXRlZCsrIH1cclxuICAgIH0pXHJcbiAgICBfJChlZGl0cy5xdWVyeVNlbGVjdG9yKCcuYWRkaXRpb25zJykpLmlubmVySFRNTCA9IGFkZGVkICE9PSAwID8gYCske2FkZGVkfWAgOiAnJ1xyXG4gICAgXyQoZWRpdHMucXVlcnlTZWxlY3RvcignLmRlbGV0aW9ucycpKS5pbm5lckhUTUwgPSBkZWxldGVkICE9PSAwID8gYC0ke2RlbGV0ZWR9YCA6ICcnXHJcbiAgICBlZGl0cy5jbGFzc0xpc3QuYWRkKCdub3RFbXB0eScpXHJcbiAgICByZXR1cm4gYWRkZWQgPiAwIHx8IGRlbGV0ZWQgPiAwXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjb21wdXRlV2Vla0lkKHNwbGl0OiBJU3BsaXRBc3NpZ25tZW50KTogc3RyaW5nIHtcclxuICAgIGNvbnN0IHN0YXJ0U3VuID0gbmV3IERhdGUoc3BsaXQuc3RhcnQuZ2V0VGltZSgpKVxyXG4gICAgc3RhcnRTdW4uc2V0RGF0ZShzdGFydFN1bi5nZXREYXRlKCkgLSBzdGFydFN1bi5nZXREYXkoKSlcclxuICAgIHJldHVybiBgd2ske3N0YXJ0U3VuLmdldE1vbnRoKCl9LSR7c3RhcnRTdW4uZ2V0RGF0ZSgpfWBcclxufVxyXG5cclxuLy8gVGhpcyBmdW5jdGlvbiBzZXBhcmF0ZXMgdGhlIHBhcnRzIG9mIGEgY2xhc3MgbmFtZS5cclxuZXhwb3J0IGZ1bmN0aW9uIHNlcGFyYXRlKGNsOiBzdHJpbmcpOiBSZWdFeHBNYXRjaEFycmF5IHtcclxuICAgIGNvbnN0IG0gPSBjbC5tYXRjaCgvKCg/OlxcZCpcXHMrKT8oPzooPzpob25cXHcqfCg/OmFkdlxcdypcXHMqKT9jb3JlKVxccyspPykoLiopL2kpXHJcbiAgICBpZiAobSA9PSBudWxsKSB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBzZXBhcmF0ZSBjbGFzcyBzdHJpbmcgJHtjbH1gKVxyXG4gICAgcmV0dXJuIG1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFzc2lnbm1lbnRDbGFzcyhhc3NpZ25tZW50OiBJQXNzaWdubWVudCwgZGF0YTogSUFwcGxpY2F0aW9uRGF0YSk6IHN0cmluZyB7XHJcbiAgICBjb25zdCBjbHMgPSAoYXNzaWdubWVudC5jbGFzcyAhPSBudWxsKSA/IGRhdGEuY2xhc3Nlc1thc3NpZ25tZW50LmNsYXNzXSA6ICdUYXNrJ1xyXG4gICAgaWYgKGNscyA9PSBudWxsKSB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBmaW5kIGNsYXNzICR7YXNzaWdubWVudC5jbGFzc30gaW4gJHtkYXRhLmNsYXNzZXN9YClcclxuICAgIHJldHVybiBjbHNcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNlcGFyYXRlZENsYXNzKGFzc2lnbm1lbnQ6IElBc3NpZ25tZW50LCBkYXRhOiBJQXBwbGljYXRpb25EYXRhKTogUmVnRXhwTWF0Y2hBcnJheSB7XHJcbiAgICByZXR1cm4gc2VwYXJhdGUoYXNzaWdubWVudENsYXNzKGFzc2lnbm1lbnQsIGRhdGEpKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQXNzaWdubWVudChzcGxpdDogSVNwbGl0QXNzaWdubWVudCwgZGF0YTogSUFwcGxpY2F0aW9uRGF0YSk6IEhUTUxFbGVtZW50IHtcclxuICAgIGNvbnN0IHsgYXNzaWdubWVudCwgcmVmZXJlbmNlIH0gPSBzcGxpdFxyXG5cclxuICAgIC8vIFNlcGFyYXRlIHRoZSBjbGFzcyBkZXNjcmlwdGlvbiBmcm9tIHRoZSBhY3R1YWwgY2xhc3NcclxuICAgIGNvbnN0IHNlcGFyYXRlZCA9IHNlcGFyYXRlZENsYXNzKGFzc2lnbm1lbnQsIGRhdGEpXHJcblxyXG4gICAgY29uc3Qgd2Vla0lkID0gY29tcHV0ZVdlZWtJZChzcGxpdClcclxuXHJcbiAgICBsZXQgc21hbGxUYWcgPSAnc21hbGwnXHJcbiAgICBsZXQgbGluayA9IG51bGxcclxuICAgIGNvbnN0IGF0aGVuYURhdGEgPSBnZXRBdGhlbmFEYXRhKClcclxuICAgIGlmIChhdGhlbmFEYXRhICYmIGFzc2lnbm1lbnQuY2xhc3MgIT0gbnVsbCAmJiAoYXRoZW5hRGF0YVtkYXRhLmNsYXNzZXNbYXNzaWdubWVudC5jbGFzc11dICE9IG51bGwpKSB7XHJcbiAgICAgICAgbGluayA9IGF0aGVuYURhdGFbZGF0YS5jbGFzc2VzW2Fzc2lnbm1lbnQuY2xhc3NdXS5saW5rXHJcbiAgICAgICAgc21hbGxUYWcgPSAnYSdcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBlID0gZWxlbWVudCgnZGl2JywgWydhc3NpZ25tZW50JywgYXNzaWdubWVudC5iYXNlVHlwZSwgJ2FuaW0nXSxcclxuICAgICAgICAgICAgICAgICAgICAgIGA8JHtzbWFsbFRhZ30ke2xpbmsgPyBgIGhyZWY9JyR7bGlua30nIGNsYXNzPSdsaW5rZWQnIHRhcmdldD0nX2JsYW5rJ2AgOiAnJ30+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPSdleHRyYSc+JHtzZXBhcmF0ZWRbMV19PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAke3NlcGFyYXRlZFsyXX1cclxuICAgICAgICAgICAgICAgICAgICAgICA8LyR7c21hbGxUYWd9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPSd0aXRsZSc+JHthc3NpZ25tZW50LnRpdGxlfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT0naGlkZGVuJyBjbGFzcz0nZHVlJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT0nJHthc3NpZ25tZW50LmVuZCA9PT0gJ0ZvcmV2ZXInID8gMCA6IGFzc2lnbm1lbnQuZW5kfScgLz5gLFxyXG4gICAgICAgICAgICAgICAgICAgICAgYXNzaWdubWVudC5pZCArIHdlZWtJZClcclxuXHJcbiAgICBpZiAoKCByZWZlcmVuY2UgJiYgcmVmZXJlbmNlLmRvbmUpIHx8IGFzc2lnbm1lbnRJbkRvbmUoYXNzaWdubWVudC5pZCkpIHtcclxuICAgICAgICBlLmNsYXNzTGlzdC5hZGQoJ2RvbmUnKVxyXG4gICAgfVxyXG4gICAgZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtY2xhc3MnLCBhc3NpZ25tZW50Q2xhc3MoYXNzaWdubWVudCwgZGF0YSkpXHJcbiAgICBjb25zdCBjbG9zZSA9IGVsZW1lbnQoJ2EnLCBbJ2Nsb3NlJywgJ21hdGVyaWFsLWljb25zJ10sICdjbG9zZScpXHJcbiAgICBjbG9zZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsb3NlT3BlbmVkKVxyXG4gICAgZS5hcHBlbmRDaGlsZChjbG9zZSlcclxuXHJcbiAgICAvLyBQcmV2ZW50IGNsaWNraW5nIHRoZSBjbGFzcyBuYW1lIHdoZW4gYW4gaXRlbSBpcyBkaXNwbGF5ZWQgb24gdGhlIGNhbGVuZGFyIGZyb20gZG9pbmcgYW55dGhpbmdcclxuICAgIGlmIChsaW5rICE9IG51bGwpIHtcclxuICAgICAgICBfJChlLnF1ZXJ5U2VsZWN0b3IoJ2EnKSkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZ0KSA9PiB7XHJcbiAgICAgICAgICAgIGlmICgoZG9jdW1lbnQuYm9keS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmlldycpID09PSAnMCcpICYmICFlLmNsYXNzTGlzdC5jb250YWlucygnZnVsbCcpKSB7XHJcbiAgICAgICAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjb21wbGV0ZSA9IGVsZW1lbnQoJ2EnLCBbJ2NvbXBsZXRlJywgJ21hdGVyaWFsLWljb25zJywgJ3dhdmVzJ10sICdkb25lJylcclxuICAgIHJpcHBsZShjb21wbGV0ZSlcclxuICAgIGNvbnN0IGlkID0gc3BsaXQuYXNzaWdubWVudC5pZFxyXG4gICAgY29tcGxldGUuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIChldnQpID0+IHtcclxuICAgICAgICBpZiAoZXZ0LndoaWNoID09PSAxKSB7IC8vIExlZnQgYnV0dG9uXHJcbiAgICAgICAgICAgIGxldCBhZGRlZCA9IHRydWVcclxuICAgICAgICAgICAgaWYgKHJlZmVyZW5jZSAhPSBudWxsKSB7IC8vIFRhc2sgaXRlbVxyXG4gICAgICAgICAgICAgICAgaWYgKGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdkb25lJykpIHtcclxuICAgICAgICAgICAgICAgICAgICByZWZlcmVuY2UuZG9uZSA9IGZhbHNlXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGFkZGVkID0gZmFsc2VcclxuICAgICAgICAgICAgICAgICAgICByZWZlcmVuY2UuZG9uZSA9IHRydWVcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHNhdmVFeHRyYSgpXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZS5jbGFzc0xpc3QuY29udGFpbnMoJ2RvbmUnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlbW92ZUZyb21Eb25lKGFzc2lnbm1lbnQuaWQpXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGFkZGVkID0gZmFsc2VcclxuICAgICAgICAgICAgICAgICAgICBhZGRUb0RvbmUoYXNzaWdubWVudC5pZClcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHNhdmVEb25lKClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuYm9keS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmlldycpID09PSAnMScpIHtcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFxyXG4gICAgICAgICAgICAgICAgICAgIGAuYXNzaWdubWVudFtpZF49XFxcIiR7aWR9XFxcIl0sICN0ZXN0JHtpZH0sICNhY3Rpdml0eSR7aWR9LCAjaWEke2lkfWBcclxuICAgICAgICAgICAgICAgICkuZm9yRWFjaCgoZWxlbSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZW0uY2xhc3NMaXN0LnRvZ2dsZSgnZG9uZScpXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgaWYgKGFkZGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5hc3NpZ25tZW50Lmxpc3REaXNwOm5vdCguZG9uZSknKS5sZW5ndGggIT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdub0xpc3QnKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5hc3NpZ25tZW50Lmxpc3REaXNwOm5vdCguZG9uZSknKS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdub0xpc3QnKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJlc2l6ZSgpXHJcbiAgICAgICAgICAgIH0sIDEwMClcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFxyXG4gICAgICAgICAgICAgICAgYC5hc3NpZ25tZW50W2lkXj1cXFwiJHtpZH1cXFwiXSwgI3Rlc3Qke2lkfSwgI2FjdGl2aXR5JHtpZH0sICNpYSR7aWR9YFxyXG4gICAgICAgICAgICApLmZvckVhY2goKGVsZW0pID0+IHtcclxuICAgICAgICAgICAgICAgIGVsZW0uY2xhc3NMaXN0LnRvZ2dsZSgnZG9uZScpXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIGlmIChhZGRlZCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5hc3NpZ25tZW50Lmxpc3REaXNwOm5vdCguZG9uZSknKS5sZW5ndGggIT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ25vTGlzdCcpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmFzc2lnbm1lbnQubGlzdERpc3A6bm90KC5kb25lKScpLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnbm9MaXN0JylcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICAgIGUuYXBwZW5kQ2hpbGQoY29tcGxldGUpXHJcblxyXG4gICAgLy8gSWYgdGhlIGFzc2lnbm1lbnQgaXMgYSBjdXN0b20gb25lLCBhZGQgYSBidXR0b24gdG8gZGVsZXRlIGl0XHJcbiAgICBpZiAoc3BsaXQuY3VzdG9tKSB7XHJcbiAgICAgICAgY29uc3QgZGVsZXRlQSA9IGVsZW1lbnQoJ2EnLCBbJ21hdGVyaWFsLWljb25zJywgJ2RlbGV0ZUFzc2lnbm1lbnQnLCAnd2F2ZXMnXSwgJ2RlbGV0ZScpXHJcbiAgICAgICAgcmlwcGxlKGRlbGV0ZUEpXHJcbiAgICAgICAgZGVsZXRlQS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgKGV2dCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXZ0LndoaWNoICE9PSAxIHx8ICFyZWZlcmVuY2UpIHJldHVyblxyXG4gICAgICAgICAgICByZW1vdmVGcm9tRXh0cmEocmVmZXJlbmNlKVxyXG4gICAgICAgICAgICBzYXZlRXh0cmEoKVxyXG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZ1bGwnKSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2F1dG8nXHJcbiAgICAgICAgICAgICAgICBjb25zdCBiYWNrID0gZWxlbUJ5SWQoJ2JhY2tncm91bmQnKVxyXG4gICAgICAgICAgICAgICAgYmFjay5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmFjay5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXHJcbiAgICAgICAgICAgICAgICB9LCAzNTApXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZS5yZW1vdmUoKVxyXG4gICAgICAgICAgICBkaXNwbGF5KGZhbHNlKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgZS5hcHBlbmRDaGlsZChkZWxldGVBKVxyXG4gICAgfVxyXG5cclxuICAgIC8vIE1vZGlmaWNhdGlvbiBidXR0b25cclxuICAgIGNvbnN0IGVkaXQgPSBlbGVtZW50KCdhJywgWydlZGl0QXNzaWdubWVudCcsICdtYXRlcmlhbC1pY29ucycsICd3YXZlcyddLCAnZWRpdCcpXHJcbiAgICBlZGl0LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCAoZXZ0KSA9PiB7XHJcbiAgICAgICAgaWYgKGV2dC53aGljaCA9PT0gMSkge1xyXG4gICAgICAgICAgICBjb25zdCByZW1vdmUgPSBlZGl0LmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJylcclxuICAgICAgICAgICAgZWRpdC5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnKVxyXG4gICAgICAgICAgICBfJChlLnF1ZXJ5U2VsZWN0b3IoJy5ib2R5JykpLnNldEF0dHJpYnV0ZSgnY29udGVudEVkaXRhYmxlJywgcmVtb3ZlID8gJ2ZhbHNlJyA6ICd0cnVlJylcclxuICAgICAgICAgICAgaWYgKCFyZW1vdmUpIHtcclxuICAgICAgICAgICAgICAgIChlLnF1ZXJ5U2VsZWN0b3IoJy5ib2R5JykgYXMgSFRNTEVsZW1lbnQpLmZvY3VzKClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBkbiA9IGUucXVlcnlTZWxlY3RvcignLmNvbXBsZXRlJykgYXMgSFRNTEVsZW1lbnRcclxuICAgICAgICAgICAgZG4uc3R5bGUuZGlzcGxheSA9IHJlbW92ZSA/ICdibG9jaycgOiAnbm9uZSdcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICAgcmlwcGxlKGVkaXQpXHJcblxyXG4gICAgZS5hcHBlbmRDaGlsZChlZGl0KVxyXG5cclxuICAgIGNvbnN0IHN0YXJ0ID0gbmV3IERhdGUoZnJvbURhdGVOdW0oYXNzaWdubWVudC5zdGFydCkpXHJcbiAgICBjb25zdCBlbmQgPSBhc3NpZ25tZW50LmVuZCA9PT0gJ0ZvcmV2ZXInID8gYXNzaWdubWVudC5lbmQgOiBuZXcgRGF0ZShmcm9tRGF0ZU51bShhc3NpZ25tZW50LmVuZCkpXHJcbiAgICBjb25zdCB0aW1lcyA9IGVsZW1lbnQoJ2RpdicsICdyYW5nZScsXHJcbiAgICAgICAgYXNzaWdubWVudC5zdGFydCA9PT0gYXNzaWdubWVudC5lbmQgPyBkYXRlU3RyaW5nKHN0YXJ0KSA6IGAke2RhdGVTdHJpbmcoc3RhcnQpfSAmbmRhc2g7ICR7ZGF0ZVN0cmluZyhlbmQpfWApXHJcbiAgICBlLmFwcGVuZENoaWxkKHRpbWVzKVxyXG4gICAgaWYgKGFzc2lnbm1lbnQuYXR0YWNobWVudHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGNvbnN0IGF0dGFjaG1lbnRzID0gZWxlbWVudCgnZGl2JywgJ2F0dGFjaG1lbnRzJylcclxuICAgICAgICBhc3NpZ25tZW50LmF0dGFjaG1lbnRzLmZvckVhY2goKGF0dGFjaG1lbnQpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgYSA9IGVsZW1lbnQoJ2EnLCBbXSwgYXR0YWNobWVudFswXSkgYXMgSFRNTEFuY2hvckVsZW1lbnRcclxuICAgICAgICAgICAgYS5ocmVmID0gdXJsRm9yQXR0YWNobWVudChhdHRhY2htZW50WzFdKVxyXG4gICAgICAgICAgICBnZXRBdHRhY2htZW50TWltZVR5cGUoYXR0YWNobWVudFsxXSkudGhlbigodHlwZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IHNwYW5cclxuICAgICAgICAgICAgICAgIGlmIChtaW1lVHlwZXNbdHlwZV0gIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGEuY2xhc3NMaXN0LmFkZChtaW1lVHlwZXNbdHlwZV1bMV0pXHJcbiAgICAgICAgICAgICAgICAgICAgc3BhbiA9IGVsZW1lbnQoJ3NwYW4nLCBbXSwgbWltZVR5cGVzW3R5cGVdWzBdKVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBzcGFuID0gZWxlbWVudCgnc3BhbicsIFtdLCAnVW5rbm93biBmaWxlIHR5cGUnKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYS5hcHBlbmRDaGlsZChzcGFuKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICBhdHRhY2htZW50cy5hcHBlbmRDaGlsZChhKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgZS5hcHBlbmRDaGlsZChhdHRhY2htZW50cylcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBib2R5ID0gZWxlbWVudCgnZGl2JywgJ2JvZHknLFxyXG4gICAgICAgIGFzc2lnbm1lbnQuYm9keS5yZXBsYWNlKC9mb250LWZhbWlseTpbXjtdKj8oPzpUaW1lcyBOZXcgUm9tYW58c2VyaWYpW147XSovZywgJycpKVxyXG4gICAgY29uc3QgZWRpdHMgPSBlbGVtZW50KCdkaXYnLCAnZWRpdHMnLCAnPHNwYW4gY2xhc3M9XFwnYWRkaXRpb25zXFwnPjwvc3Bhbj48c3BhbiBjbGFzcz1cXCdkZWxldGlvbnNcXCc+PC9zcGFuPicpXHJcbiAgICBjb25zdCBtID0gbW9kaWZpZWRCb2R5KGFzc2lnbm1lbnQuaWQpXHJcbiAgICBpZiAobSAhPSBudWxsKSB7XHJcbiAgICAgICAgY29uc3QgZCA9IGRtcC5kaWZmX21haW4oYXNzaWdubWVudC5ib2R5LCBtKVxyXG4gICAgICAgIGRtcC5kaWZmX2NsZWFudXBTZW1hbnRpYyhkKVxyXG4gICAgICAgIGlmIChkLmxlbmd0aCAhPT0gMCkgeyAvLyBIYXMgYmVlbiBlZGl0ZWRcclxuICAgICAgICAgICAgcG9wdWxhdGVBZGRlZERlbGV0ZWQoZCwgZWRpdHMpXHJcbiAgICAgICAgICAgIGJvZHkuaW5uZXJIVE1MID0gbVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKGV2dCkgPT4ge1xyXG4gICAgICAgIGlmIChyZWZlcmVuY2UgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZWZlcmVuY2UuYm9keSA9IGJvZHkuaW5uZXJIVE1MXHJcbiAgICAgICAgICAgIHNhdmVFeHRyYSgpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgc2V0TW9kaWZpZWQoYXNzaWdubWVudC5pZCwgIGJvZHkuaW5uZXJIVE1MKVxyXG4gICAgICAgICAgICBzYXZlTW9kaWZpZWQoKVxyXG4gICAgICAgICAgICBjb25zdCBkID0gZG1wLmRpZmZfbWFpbihhc3NpZ25tZW50LmJvZHksIGJvZHkuaW5uZXJIVE1MKVxyXG4gICAgICAgICAgICBkbXAuZGlmZl9jbGVhbnVwU2VtYW50aWMoZClcclxuICAgICAgICAgICAgaWYgKHBvcHVsYXRlQWRkZWREZWxldGVkKGQsIGVkaXRzKSkge1xyXG4gICAgICAgICAgICAgICAgZWRpdHMuY2xhc3NMaXN0LmFkZCgnbm90RW1wdHknKVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZWRpdHMuY2xhc3NMaXN0LnJlbW92ZSgnbm90RW1wdHknKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChkb2N1bWVudC5ib2R5LmdldEF0dHJpYnV0ZSgnZGF0YS12aWV3JykgPT09ICcxJykgcmVzaXplKClcclxuICAgIH0pXHJcblxyXG4gICAgZS5hcHBlbmRDaGlsZChib2R5KVxyXG5cclxuICAgIGNvbnN0IHJlc3RvcmUgPSBlbGVtZW50KCdhJywgWydtYXRlcmlhbC1pY29ucycsICdyZXN0b3JlJ10sICdzZXR0aW5nc19iYWNrdXBfcmVzdG9yZScpXHJcbiAgICByZXN0b3JlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgIHJlbW92ZUZyb21Nb2RpZmllZChhc3NpZ25tZW50LmlkKVxyXG4gICAgICAgIHNhdmVNb2RpZmllZCgpXHJcbiAgICAgICAgYm9keS5pbm5lckhUTUwgPSBhc3NpZ25tZW50LmJvZHlcclxuICAgICAgICBlZGl0cy5jbGFzc0xpc3QucmVtb3ZlKCdub3RFbXB0eScpXHJcbiAgICAgICAgaWYgKGRvY3VtZW50LmJvZHkuZ2V0QXR0cmlidXRlKCdkYXRhLXZpZXcnKSA9PT0gJzEnKSAgcmVzaXplKClcclxuICAgIH0pXHJcbiAgICBlZGl0cy5hcHBlbmRDaGlsZChyZXN0b3JlKVxyXG4gICAgZS5hcHBlbmRDaGlsZChlZGl0cylcclxuXHJcbiAgICBjb25zdCBtb2RzID0gZWxlbWVudCgnZGl2JywgWydtb2RzJ10pXHJcbiAgICByZWNlbnRBY3Rpdml0eSgpLmZvckVhY2goKGEpID0+IHtcclxuICAgICAgICBpZiAoKGFbMF0gPT09ICdlZGl0JykgJiYgKGFbMV0uaWQgPT09IGFzc2lnbm1lbnQuaWQpKSB7XHJcbiAgICAgICAgY29uc3QgdGUgPSBlbGVtZW50KCdkaXYnLCBbJ2lubmVyQWN0aXZpdHknLCAnYXNzaWdubWVudEl0ZW0nLCBhc3NpZ25tZW50LmJhc2VUeXBlXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgYDxpIGNsYXNzPSdtYXRlcmlhbC1pY29ucyc+ZWRpdDwvaT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPSd0aXRsZSc+JHtkYXRlU3RyaW5nKG5ldyBEYXRlKGFbMl0pKX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz0nYWRkaXRpb25zJz48L3NwYW4+PHNwYW4gY2xhc3M9J2RlbGV0aW9ucyc+PC9zcGFuPmAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGBpYSR7YXNzaWdubWVudC5pZH1gKVxyXG4gICAgICAgIGNvbnN0IGQgPSBkbXAuZGlmZl9tYWluKGFbMV0uYm9keSwgYXNzaWdubWVudC5ib2R5KVxyXG4gICAgICAgIGRtcC5kaWZmX2NsZWFudXBTZW1hbnRpYyhkKVxyXG4gICAgICAgIHBvcHVsYXRlQWRkZWREZWxldGVkKGQsIHRlKVxyXG5cclxuICAgICAgICBpZiAoYXNzaWdubWVudC5jbGFzcykgdGUuc2V0QXR0cmlidXRlKCdkYXRhLWNsYXNzJywgZGF0YS5jbGFzc2VzW2Fzc2lnbm1lbnQuY2xhc3NdKVxyXG4gICAgICAgIHRlLmFwcGVuZENoaWxkKGVsZW1lbnQoJ2RpdicsICdpYURpZmYnLCBkbXAuZGlmZl9wcmV0dHlIdG1sKGQpKSlcclxuICAgICAgICB0ZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgdGUuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJylcclxuICAgICAgICAgICAgaWYgKGRvY3VtZW50LmJvZHkuZ2V0QXR0cmlidXRlKCdkYXRhLXZpZXcnKSA9PT0gJzEnKSByZXNpemUoKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgbW9kcy5hcHBlbmRDaGlsZCh0ZSlcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICAgZS5hcHBlbmRDaGlsZChtb2RzKVxyXG5cclxuICAgIGlmICgobG9jYWxTdG9yYWdlUmVhZCgnYXNzaWdubWVudFNwYW4nKSA9PT0gJ211bHRpcGxlJykgJiYgKHN0YXJ0IDwgc3BsaXQuc3RhcnQpKSB7XHJcbiAgICAgICAgZS5jbGFzc0xpc3QuYWRkKCdmcm9tV2Vla2VuZCcpXHJcbiAgICB9XHJcbiAgICBpZiAoKGxvY2FsU3RvcmFnZVJlYWQoJ2Fzc2lnbm1lbnRTcGFuJykgPT09ICdtdWx0aXBsZScpICYmIChlbmQgPiBzcGxpdC5lbmQpKSB7XHJcbiAgICAgICAgZS5jbGFzc0xpc3QuYWRkKCdvdmVyV2Vla2VuZCcpXHJcbiAgICB9XHJcbiAgICBlLmNsYXNzTGlzdC5hZGQoYHMke3NwbGl0LnN0YXJ0LmdldERheSgpfWApXHJcbiAgICBpZiAoc3BsaXQuZW5kICE9PSAnRm9yZXZlcicpIGUuY2xhc3NMaXN0LmFkZChgZSR7NiAtIHNwbGl0LmVuZC5nZXREYXkoKX1gKVxyXG5cclxuICAgIGNvbnN0IHN0ID0gTWF0aC5mbG9vcihzcGxpdC5zdGFydC5nZXREYXRlKCkgLyAxMDAwIC8gMzYwMCAvIDI0KVxyXG4gICAgaWYgKHNwbGl0LmFzc2lnbm1lbnQuZW5kID09PSAnRm9yZXZlcicpIHtcclxuICAgICAgICBpZiAoc3QgPD0gKHRvZGF5KCkgKyBnZXRMaXN0RGF0ZU9mZnNldCgpKSkge1xyXG4gICAgICAgICAgICBlLmNsYXNzTGlzdC5hZGQoJ2xpc3REaXNwJylcclxuICAgICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IG1pZERhdGUgPSBuZXcgRGF0ZSgpXHJcbiAgICAgICAgbWlkRGF0ZS5zZXREYXRlKG1pZERhdGUuZ2V0RGF0ZSgpICsgZ2V0TGlzdERhdGVPZmZzZXQoKSlcclxuICAgICAgICBjb25zdCBwdXNoID0gKGFzc2lnbm1lbnQuYmFzZVR5cGUgPT09ICd0ZXN0JyAmJiBhc3NpZ25tZW50LnN0YXJ0ID09PSBzdCkgPyBsb2NhbFN0b3JhZ2VSZWFkKCdlYXJseVRlc3QnKSA6IDBcclxuICAgICAgICBjb25zdCBlbmRFeHRyYSA9IGdldExpc3REYXRlT2Zmc2V0KCkgPT09IDAgPyBnZXRUaW1lQWZ0ZXIobWlkRGF0ZSkgOiAyNCAqIDM2MDAgKiAxMDAwXHJcbiAgICAgICAgaWYgKGZyb21EYXRlTnVtKHN0IC0gcHVzaCkgPD0gbWlkRGF0ZSAmJlxyXG4gICAgICAgICAgICAoc3BsaXQuZW5kID09PSAnRm9yZXZlcicgfHwgbWlkRGF0ZS5nZXRUaW1lKCkgPD0gc3BsaXQuZW5kLmdldFRpbWUoKSArIGVuZEV4dHJhKSkge1xyXG4gICAgICAgICAgICBlLmNsYXNzTGlzdC5hZGQoJ2xpc3REaXNwJylcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQWRkIGNsaWNrIGludGVyYWN0aXZpdHlcclxuICAgIGlmICghc3BsaXQuY3VzdG9tIHx8ICFKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5zZXBUYXNrcykpIHtcclxuICAgICAgICBlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2dCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoKGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2Z1bGwnKS5sZW5ndGggPT09IDApICYmXHJcbiAgICAgICAgICAgICAgICAoZG9jdW1lbnQuYm9keS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmlldycpID09PSAnMCcpKSB7XHJcbiAgICAgICAgICAgICAgICBlLmNsYXNzTGlzdC5yZW1vdmUoJ2FuaW0nKVxyXG4gICAgICAgICAgICAgICAgZS5jbGFzc0xpc3QuYWRkKCdtb2RpZnknKVxyXG4gICAgICAgICAgICAgICAgZS5zdHlsZS50b3AgPSAoZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgLSBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLSBOdW1iZXIoZS5zdHlsZS5tYXJnaW5Ub3ApKSArIDQ0ICsgJ3B4J1xyXG4gICAgICAgICAgICAgICAgZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtdG9wJywgZS5zdHlsZS50b3ApXHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbidcclxuICAgICAgICAgICAgICAgIGNvbnN0IGJhY2sgPSBlbGVtQnlJZCgnYmFja2dyb3VuZCcpXHJcbiAgICAgICAgICAgICAgICBiYWNrLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcbiAgICAgICAgICAgICAgICBiYWNrLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXHJcbiAgICAgICAgICAgICAgICBlLmNsYXNzTGlzdC5hZGQoJ2FuaW0nKVxyXG4gICAgICAgICAgICAgICAgZm9yY2VMYXlvdXQoZSlcclxuICAgICAgICAgICAgICAgIGUuY2xhc3NMaXN0LmFkZCgnZnVsbCcpXHJcbiAgICAgICAgICAgICAgICBlLnN0eWxlLnRvcCA9ICg3NSAtIE51bWJlcihlLnN0eWxlLm1hcmdpblRvcCkpICsgJ3B4J1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiBlLmNsYXNzTGlzdC5yZW1vdmUoJ2FuaW0nKSwgMzUwKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZVxyXG59XHJcblxyXG4vLyBJbiBvcmRlciB0byBkaXNwbGF5IGFuIGFzc2lnbm1lbnQgaW4gdGhlIGNvcnJlY3QgWCBwb3NpdGlvbiwgY2xhc3NlcyB3aXRoIG5hbWVzIGVYIGFuZCBlWCBhcmVcclxuLy8gdXNlZCwgd2hlcmUgWCBpcyB0aGUgbnVtYmVyIG9mIHNxdWFyZXMgdG8gZnJvbSB0aGUgYXNzaWdubWVudCB0byB0aGUgbGVmdC9yaWdodCBzaWRlIG9mIHRoZVxyXG4vLyBzY3JlZW4uIFRoZSBmdW5jdGlvbiBiZWxvdyBkZXRlcm1pbmVzIHdoaWNoIGVYIGFuZCBzWCBjbGFzcyB0aGUgZ2l2ZW4gZWxlbWVudCBoYXMuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRFUyhlbDogSFRNTEVsZW1lbnQpOiBbc3RyaW5nLCBzdHJpbmddIHtcclxuICAgIGxldCBlID0gMFxyXG4gICAgbGV0IHMgPSAwXHJcblxyXG4gICAgQXJyYXkuZnJvbShuZXcgQXJyYXkoNyksIChfLCB4KSA9PiB4KS5mb3JFYWNoKCh4KSA9PiB7XHJcbiAgICAgICAgaWYgKGVsLmNsYXNzTGlzdC5jb250YWlucyhgZSR7eH1gKSkge1xyXG4gICAgICAgICAgICBlID0geFxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZWwuY2xhc3NMaXN0LmNvbnRhaW5zKGBzJHt4fWApKSB7XHJcbiAgICAgICAgICAgIHMgPSB4XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICAgIHJldHVybiBbYGUke2V9YCwgYHMke3N9YF1cclxufVxyXG5cclxuLy8gQmVsb3cgaXMgYSBmdW5jdGlvbiB0byBjbG9zZSB0aGUgY3VycmVudCBhc3NpZ25tZW50IHRoYXQgaXMgb3BlbmVkLlxyXG5leHBvcnQgZnVuY3Rpb24gY2xvc2VPcGVuZWQoZXZ0OiBFdmVudCk6IHZvaWQge1xyXG4gICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICBjb25zdCBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mdWxsJykgYXMgSFRNTEVsZW1lbnR8bnVsbFxyXG4gICAgaWYgKGVsID09IG51bGwpIHJldHVyblxyXG5cclxuICAgIGVsLnN0eWxlLnRvcCA9IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS10b3AnKVxyXG4gICAgZWwuY2xhc3NMaXN0LmFkZCgnYW5pbScpXHJcbiAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKCdmdWxsJylcclxuICAgIGVsLnNjcm9sbFRvcCA9IDBcclxuICAgIGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnYXV0bydcclxuICAgIGNvbnN0IGJhY2sgPSBlbGVtQnlJZCgnYmFja2dyb3VuZCcpXHJcbiAgICBiYWNrLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBiYWNrLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcclxuICAgICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKCdhbmltJylcclxuICAgICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKCdtb2RpZnknKVxyXG4gICAgICAgIGVsLnN0eWxlLnRvcCA9ICdhdXRvJ1xyXG4gICAgICAgIGZvcmNlTGF5b3V0KGVsKVxyXG4gICAgICAgIGVsLmNsYXNzTGlzdC5hZGQoJ2FuaW0nKVxyXG4gICAgfSwgMTAwMClcclxufVxyXG4iLCJpbXBvcnQgeyBlbGVtQnlJZCwgbG9jYWxTdG9yYWdlUmVhZCB9IGZyb20gJy4uL3V0aWwnXHJcblxyXG4vLyBUaGVuLCB0aGUgdXNlcm5hbWUgaW4gdGhlIHNpZGViYXIgbmVlZHMgdG8gYmUgc2V0IGFuZCB3ZSBuZWVkIHRvIGdlbmVyYXRlIGFuIFwiYXZhdGFyXCIgYmFzZWQgb25cclxuLy8gaW5pdGlhbHMuIFRvIGRvIHRoYXQsIHNvbWUgY29kZSB0byBjb252ZXJ0IGZyb20gTEFCIHRvIFJHQiBjb2xvcnMgaXMgYm9ycm93ZWQgZnJvbVxyXG4vLyBodHRwczovL2dpdGh1Yi5jb20vYm9yb25pbmUvY29sb3JzcGFjZXMuanNcclxuLy9cclxuLy8gTEFCIGlzIGEgY29sb3IgbmFtaW5nIHNjaGVtZSB0aGF0IHVzZXMgdHdvIHZhbHVlcyAoQSBhbmQgQikgYWxvbmcgd2l0aCBhIGxpZ2h0bmVzcyB2YWx1ZSBpbiBvcmRlclxyXG4vLyB0byBwcm9kdWNlIGNvbG9ycyB0aGF0IGFyZSBlcXVhbGx5IHNwYWNlZCBiZXR3ZWVuIGFsbCBvZiB0aGUgY29sb3JzIHRoYXQgY2FuIGJlIHNlZW4gYnkgdGhlIGh1bWFuXHJcbi8vIGV5ZS4gVGhpcyB3b3JrcyBncmVhdCBiZWNhdXNlIGV2ZXJ5b25lIGhhcyBsZXR0ZXJzIGluIGhpcy9oZXIgaW5pdGlhbHMuXHJcblxyXG4vLyBUaGUgRDY1IHN0YW5kYXJkIGlsbHVtaW5hbnRcclxuY29uc3QgUkVGX1ggPSAwLjk1MDQ3XHJcbmNvbnN0IFJFRl9ZID0gMS4wMDAwMFxyXG5jb25zdCBSRUZfWiA9IDEuMDg4ODNcclxuXHJcbi8vIENJRSBMKmEqYiogY29uc3RhbnRzXHJcbmNvbnN0IExBQl9FID0gMC4wMDg4NTZcclxuY29uc3QgTEFCX0sgPSA5MDMuM1xyXG5cclxuY29uc3QgTSA9IFtcclxuICAgIFszLjI0MDYsIC0xLjUzNzIsIC0wLjQ5ODZdLFxyXG4gICAgWy0wLjk2ODksIDEuODc1OCwgIDAuMDQxNV0sXHJcbiAgICBbMC4wNTU3LCAtMC4yMDQwLCAgMS4wNTcwXVxyXG5dXHJcblxyXG5jb25zdCBmSW52ID0gKHQ6IG51bWJlcikgPT4ge1xyXG4gICAgaWYgKE1hdGgucG93KHQsIDMpID4gTEFCX0UpIHtcclxuICAgIHJldHVybiBNYXRoLnBvdyh0LCAzKVxyXG4gICAgfSBlbHNlIHtcclxuICAgIHJldHVybiAoKDExNiAqIHQpIC0gMTYpIC8gTEFCX0tcclxuICAgIH1cclxufVxyXG5jb25zdCBkb3RQcm9kdWN0ID0gKGE6IG51bWJlcltdLCBiOiBudW1iZXJbXSkgPT4ge1xyXG4gICAgbGV0IHJldCA9IDBcclxuICAgIGEuZm9yRWFjaCgoXywgaSkgPT4ge1xyXG4gICAgICAgIHJldCArPSBhW2ldICogYltpXVxyXG4gICAgfSlcclxuICAgIHJldHVybiByZXRcclxufVxyXG5jb25zdCBmcm9tTGluZWFyID0gKGM6IG51bWJlcikgPT4ge1xyXG4gICAgY29uc3QgYSA9IDAuMDU1XHJcbiAgICBpZiAoYyA8PSAwLjAwMzEzMDgpIHtcclxuICAgICAgICByZXR1cm4gMTIuOTIgKiBjXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiAoMS4wNTUgKiBNYXRoLnBvdyhjLCAxIC8gMi40KSkgLSAwLjA1NVxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBsYWJyZ2IobDogbnVtYmVyLCBhOiBudW1iZXIsIGI6IG51bWJlcik6IHN0cmluZyB7XHJcbiAgICBjb25zdCB2YXJZID0gKGwgKyAxNikgLyAxMTZcclxuICAgIGNvbnN0IHZhclogPSB2YXJZIC0gKGIgLyAyMDApXHJcbiAgICBjb25zdCB2YXJYID0gKGEgLyA1MDApICsgdmFyWVxyXG4gICAgY29uc3QgX1ggPSBSRUZfWCAqIGZJbnYodmFyWClcclxuICAgIGNvbnN0IF9ZID0gUkVGX1kgKiBmSW52KHZhclkpXHJcbiAgICBjb25zdCBfWiA9IFJFRl9aICogZkludih2YXJaKVxyXG5cclxuICAgIGNvbnN0IHR1cGxlID0gW19YLCBfWSwgX1pdXHJcblxyXG4gICAgY29uc3QgX1IgPSBmcm9tTGluZWFyKGRvdFByb2R1Y3QoTVswXSwgdHVwbGUpKVxyXG4gICAgY29uc3QgX0cgPSBmcm9tTGluZWFyKGRvdFByb2R1Y3QoTVsxXSwgdHVwbGUpKVxyXG4gICAgY29uc3QgX0IgPSBmcm9tTGluZWFyKGRvdFByb2R1Y3QoTVsyXSwgdHVwbGUpKVxyXG5cclxuICAgIC8vIE9yaWdpbmFsIGZyb20gaGVyZVxyXG4gICAgY29uc3QgbiA9ICh2OiBudW1iZXIpID0+IE1hdGgucm91bmQoTWF0aC5tYXgoTWF0aC5taW4odiAqIDI1NiwgMjU1KSwgMCkpXHJcbiAgICByZXR1cm4gYHJnYigke24oX1IpfSwgJHtuKF9HKX0sICR7bihfQil9KWBcclxufVxyXG5cclxuLyoqXHJcbiAqIENvbnZlcnQgYSBsZXR0ZXIgdG8gYSBmbG9hdCB2YWx1ZWQgZnJvbSAwIHRvIDI1NVxyXG4gKi9cclxuZnVuY3Rpb24gbGV0dGVyVG9Db2xvclZhbChsZXR0ZXI6IHN0cmluZyk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gKCgobGV0dGVyLmNoYXJDb2RlQXQoMCkgLSA2NSkgLyAyNikgKiAyNTYpIC0gMTI4XHJcbn1cclxuXHJcbi8vIFRoZSBmdW5jdGlvbiBiZWxvdyB1c2VzIHRoaXMgYWxnb3JpdGhtIHRvIGdlbmVyYXRlIGEgYmFja2dyb3VuZCBjb2xvciBmb3IgdGhlIGluaXRpYWxzIGRpc3BsYXllZCBpbiB0aGUgc2lkZWJhci5cclxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZUF2YXRhcigpOiB2b2lkIHtcclxuICAgIGlmICghbG9jYWxTdG9yYWdlUmVhZCgndXNlcm5hbWUnKSkgcmV0dXJuXHJcbiAgICBlbGVtQnlJZCgndXNlcicpLmlubmVySFRNTCA9IGxvY2FsU3RvcmFnZVJlYWQoJ3VzZXJuYW1lJylcclxuICAgIGNvbnN0IGluaXRpYWxzID0gbG9jYWxTdG9yYWdlLnVzZXJuYW1lLm1hdGNoKC9cXGQqKC4pLio/KC4kKS8pIC8vIFNlcGFyYXRlIHllYXIgZnJvbSBmaXJzdCBuYW1lIGFuZCBpbml0aWFsXHJcbiAgICBpZiAoaW5pdGlhbHMgIT0gbnVsbCkge1xyXG4gICAgICAgIGNvbnN0IGJnID0gbGFicmdiKDUwLCBsZXR0ZXJUb0NvbG9yVmFsKGluaXRpYWxzWzFdKSwgbGV0dGVyVG9Db2xvclZhbChpbml0aWFsc1syXSkpIC8vIENvbXB1dGUgdGhlIGNvbG9yXHJcbiAgICAgICAgZWxlbUJ5SWQoJ2luaXRpYWxzJykuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gYmdcclxuICAgICAgICBlbGVtQnlJZCgnaW5pdGlhbHMnKS5pbm5lckhUTUwgPSBpbml0aWFsc1sxXSArIGluaXRpYWxzWzJdXHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgdG9kYXkgfSBmcm9tICcuLi9kYXRlcydcclxuaW1wb3J0IHsgZWxlbWVudCB9IGZyb20gJy4uL3V0aWwnXHJcblxyXG5jb25zdCBNT05USFMgPSBbJ0phbicsICdGZWInLCAnTWFyJywgJ0FwcicsICdNYXknLCAnSnVuJywgJ0p1bCcsICdBdWcnLCAnU2VwJywgJ09jdCcsICdOb3YnLCAnRGVjJ11cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVXZWVrKGlkOiBzdHJpbmcpOiBIVE1MRWxlbWVudCB7XHJcbiAgICBjb25zdCB3ayA9IGVsZW1lbnQoJ3NlY3Rpb24nLCAnd2VlaycsIG51bGwsIGlkKVxyXG4gICAgY29uc3QgZGF5VGFibGUgPSBlbGVtZW50KCd0YWJsZScsICdkYXlUYWJsZScpIGFzIEhUTUxUYWJsZUVsZW1lbnRcclxuICAgIGNvbnN0IHRyID0gZGF5VGFibGUuaW5zZXJ0Um93KClcclxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZSBuby1sb29wc1xyXG4gICAgZm9yIChsZXQgZGF5ID0gMDsgZGF5IDwgNzsgZGF5KyspIHRyLmluc2VydENlbGwoKVxyXG4gICAgd2suYXBwZW5kQ2hpbGQoZGF5VGFibGUpXHJcblxyXG4gICAgcmV0dXJuIHdrXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVEYXkoZDogRGF0ZSk6IEhUTUxFbGVtZW50IHtcclxuICAgIGNvbnN0IGRheSA9IGVsZW1lbnQoJ2RpdicsICdkYXknLCBudWxsLCAnZGF5JylcclxuICAgIGRheS5zZXRBdHRyaWJ1dGUoJ2RhdGEtZGF0ZScsIFN0cmluZyhkLmdldFRpbWUoKSkpXHJcbiAgICBpZiAoTWF0aC5mbG9vcigoZC5nZXRUaW1lKCkgLSBkLmdldFRpbWV6b25lT2Zmc2V0KCkpIC8gMTAwMCAvIDM2MDAgLyAyNCkgPT09IHRvZGF5KCkpIHtcclxuICAgICAgZGF5LmNsYXNzTGlzdC5hZGQoJ3RvZGF5JylcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBtb250aCA9IGVsZW1lbnQoJ3NwYW4nLCAnbW9udGgnLCBNT05USFNbZC5nZXRNb250aCgpXSlcclxuICAgIGRheS5hcHBlbmRDaGlsZChtb250aClcclxuXHJcbiAgICBjb25zdCBkYXRlID0gZWxlbWVudCgnc3BhbicsICdkYXRlJywgU3RyaW5nKGQuZ2V0RGF0ZSgpKSlcclxuICAgIGRheS5hcHBlbmRDaGlsZChkYXRlKVxyXG5cclxuICAgIHJldHVybiBkYXlcclxufVxyXG4iLCJpbXBvcnQgeyBnZXRDbGFzc2VzLCBnZXREYXRhIH0gZnJvbSAnLi4vcGNyJ1xyXG5pbXBvcnQgeyBfJCwgY2FwaXRhbGl6ZVN0cmluZywgZWxlbUJ5SWQsIGVsZW1lbnQgfSBmcm9tICcuLi91dGlsJ1xyXG5cclxuLy8gV2hlbiBhbnl0aGluZyBpcyB0eXBlZCwgdGhlIHNlYXJjaCBzdWdnZXN0aW9ucyBuZWVkIHRvIGJlIHVwZGF0ZWQuXHJcbmNvbnN0IFRJUF9OQU1FUyA9IHtcclxuICAgIGZvcjogWydmb3InXSxcclxuICAgIGJ5OiBbJ2J5JywgJ2R1ZScsICdlbmRpbmcnXSxcclxuICAgIHN0YXJ0aW5nOiBbJ3N0YXJ0aW5nJywgJ2JlZ2lubmluZycsICdhc3NpZ25lZCddXHJcbn1cclxuXHJcbmNvbnN0IG5ld1RleHQgPSBlbGVtQnlJZCgnbmV3VGV4dCcpIGFzIEhUTUxJbnB1dEVsZW1lbnRcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVOZXdUaXBzKHZhbDogc3RyaW5nLCBzY3JvbGw6IGJvb2xlYW4gPSB0cnVlKTogdm9pZCB7XHJcbiAgICBpZiAoc2Nyb2xsKSB7XHJcbiAgICAgICAgZWxlbUJ5SWQoJ25ld1RpcHMnKS5zY3JvbGxUb3AgPSAwXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qgc3BhY2VJbmRleCA9IHZhbC5sYXN0SW5kZXhPZignICcpXHJcbiAgICBpZiAoc3BhY2VJbmRleCAhPT0gLTEpIHtcclxuICAgICAgICBjb25zdCBiZWZvcmVTcGFjZSA9IHZhbC5sYXN0SW5kZXhPZignICcsIHNwYWNlSW5kZXggLSAxKVxyXG4gICAgICAgIGNvbnN0IGJlZm9yZSA9IHZhbC5zdWJzdHJpbmcoKGJlZm9yZVNwYWNlID09PSAtMSA/IDAgOiBiZWZvcmVTcGFjZSArIDEpLCBzcGFjZUluZGV4KVxyXG4gICAgICAgIE9iamVjdC5lbnRyaWVzKFRJUF9OQU1FUykuZm9yRWFjaCgoW25hbWUsIHBvc3NpYmxlXSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAocG9zc2libGUuaW5kZXhPZihiZWZvcmUpICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG5hbWUgPT09ICdmb3InKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmtleXMoVElQX05BTUVTKS5mb3JFYWNoKCh0aXBOYW1lKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1CeUlkKGB0aXAke3RpcE5hbWV9YCkuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIGdldENsYXNzZXMoKS5mb3JFYWNoKChjbHMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaWQgPSBgdGlwY2xhc3Mke2Nscy5yZXBsYWNlKC9cXFcvLCAnJyl9YFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3BhY2VJbmRleCA9PT0gKHZhbC5sZW5ndGggLSAxKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IGVsZW1lbnQoJ2RpdicsIFsnY2xhc3NUaXAnLCAnYWN0aXZlJywgJ3RpcCddLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgPGkgY2xhc3M9J21hdGVyaWFsLWljb25zJz5jbGFzczwvaT48c3BhbiBjbGFzcz0ndHlwZWQnPiR7Y2xzfTwvc3Bhbj5gLCBpZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aXBDb21wbGV0ZShjbHMpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1CeUlkKCduZXdUaXBzJykuYXBwZW5kQ2hpbGQoY29udGFpbmVyKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbUJ5SWQoaWQpLmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xzLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXModmFsLnRvTG93ZXJDYXNlKCkuc3Vic3RyKHNwYWNlSW5kZXggKyAxKSkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY2xhc3NUaXAnKS5mb3JFYWNoKChlbCkgPT4ge1xyXG4gICAgICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgICB9KVxyXG4gICAgaWYgKCh2YWwgPT09ICcnKSB8fCAodmFsLmNoYXJBdCh2YWwubGVuZ3RoIC0gMSkgPT09ICcgJykpIHtcclxuICAgICAgICB1cGRhdGVUaXAoJ2ZvcicsICdmb3InLCBmYWxzZSlcclxuICAgICAgICB1cGRhdGVUaXAoJ2J5JywgJ2J5JywgZmFsc2UpXHJcbiAgICAgICAgdXBkYXRlVGlwKCdzdGFydGluZycsICdzdGFydGluZycsIGZhbHNlKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zdCBsYXN0U3BhY2UgPSB2YWwubGFzdEluZGV4T2YoJyAnKVxyXG4gICAgICAgIGxldCBsYXN0V29yZCA9IGxhc3RTcGFjZSA9PT0gLTEgPyB2YWwgOiB2YWwuc3Vic3RyKGxhc3RTcGFjZSArIDEpXHJcbiAgICAgICAgY29uc3QgdXBwZXJjYXNlID0gbGFzdFdvcmQuY2hhckF0KDApID09PSBsYXN0V29yZC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKVxyXG4gICAgICAgIGxhc3RXb3JkID0gbGFzdFdvcmQudG9Mb3dlckNhc2UoKVxyXG4gICAgICAgIE9iamVjdC5lbnRyaWVzKFRJUF9OQU1FUykuZm9yRWFjaCgoW25hbWUsIHBvc3NpYmxlXSkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgZm91bmQ6IHN0cmluZ3xudWxsID0gbnVsbFxyXG4gICAgICAgICAgICBwb3NzaWJsZS5mb3JFYWNoKChwKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAocC5zbGljZSgwLCBsYXN0V29yZC5sZW5ndGgpID09PSBsYXN0V29yZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvdW5kID0gcFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICBpZiAoZm91bmQpIHtcclxuICAgICAgICAgICAgICAgIHVwZGF0ZVRpcChuYW1lLCBmb3VuZCwgdXBwZXJjYXNlKVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZWxlbUJ5SWQoYHRpcCR7bmFtZX1gKS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gdXBkYXRlVGlwKG5hbWU6IHN0cmluZywgdHlwZWQ6IHN0cmluZywgY2FwaXRhbGl6ZTogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgaWYgKG5hbWUgIT09ICdmb3InICYmIG5hbWUgIT09ICdieScgJiYgbmFtZSAhPT0gJ3N0YXJ0aW5nJykge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCB0aXAgbmFtZScpXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZWwgPSBlbGVtQnlJZChgdGlwJHtuYW1lfWApXHJcbiAgICBlbC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG4gICAgXyQoZWwucXVlcnlTZWxlY3RvcignLnR5cGVkJykpLmlubmVySFRNTCA9IChjYXBpdGFsaXplID8gY2FwaXRhbGl6ZVN0cmluZyh0eXBlZCkgOiB0eXBlZCkgKyAnLi4uJ1xyXG4gICAgY29uc3QgbmV3TmFtZXM6IHN0cmluZ1tdID0gW11cclxuICAgIFRJUF9OQU1FU1tuYW1lXS5mb3JFYWNoKChuKSA9PiB7XHJcbiAgICAgICAgaWYgKG4gIT09IHR5cGVkKSB7IG5ld05hbWVzLnB1c2goYDxiPiR7bn08L2I+YCkgfVxyXG4gICAgfSlcclxuICAgIF8kKGVsLnF1ZXJ5U2VsZWN0b3IoJy5vdGhlcnMnKSkuaW5uZXJIVE1MID0gbmV3TmFtZXMubGVuZ3RoID4gMCA/IGBZb3UgY2FuIGFsc28gdXNlICR7bmV3TmFtZXMuam9pbignIG9yICcpfWAgOiAnJ1xyXG59XHJcblxyXG5mdW5jdGlvbiB0aXBDb21wbGV0ZShhdXRvY29tcGxldGU6IHN0cmluZyk6IChldnQ6IEV2ZW50KSA9PiB2b2lkIHtcclxuICAgIHJldHVybiAoZXZ0OiBFdmVudCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHZhbCA9IG5ld1RleHQudmFsdWVcclxuICAgICAgICBjb25zdCBsYXN0U3BhY2UgPSB2YWwubGFzdEluZGV4T2YoJyAnKVxyXG4gICAgICAgIGNvbnN0IGxhc3RXb3JkID0gbGFzdFNwYWNlID09PSAtMSA/IDAgOiBsYXN0U3BhY2UgKyAxXHJcbiAgICAgICAgdXBkYXRlTmV3VGlwcyhuZXdUZXh0LnZhbHVlID0gdmFsLnN1YnN0cmluZygwLCBsYXN0V29yZCkgKyBhdXRvY29tcGxldGUgKyAnICcpXHJcbiAgICAgICAgcmV0dXJuIG5ld1RleHQuZm9jdXMoKVxyXG4gICAgfVxyXG59XHJcblxyXG4vLyBUaGUgZXZlbnQgbGlzdGVuZXIgaXMgdGhlbiBhZGRlZCB0byB0aGUgcHJlZXhpc3RpbmcgdGlwcy5cclxuZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRpcCcpLmZvckVhY2goKHRpcCkgPT4ge1xyXG4gICAgdGlwLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGlwQ29tcGxldGUoXyQodGlwLnF1ZXJ5U2VsZWN0b3IoJy50eXBlZCcpKS5pbm5lckhUTUwpKVxyXG59KVxyXG4iLCJpbXBvcnQgeyBWRVJTSU9OIH0gZnJvbSAnLi4vYXBwJ1xyXG5pbXBvcnQgeyBlbGVtQnlJZCB9IGZyb20gJy4uL3V0aWwnXHJcblxyXG5jb25zdCBFUlJPUl9GT1JNX1VSTCA9ICdodHRwczovL2RvY3MuZ29vZ2xlLmNvbS9hL3N0dWRlbnRzLmhhcmtlci5vcmcvZm9ybXMvZC8nXHJcbiAgICAgICAgICAgICAgICAgICAgICsgJzFzYTJnVXRZRlBkS1Q1WUVOWElFWWF1eVJQdWNxc1FDVmFRQVBlRjNiWjRRL3ZpZXdmb3JtJ1xyXG5jb25zdCBFUlJPUl9GT1JNX0VOVFJZID0gJz9lbnRyeS4xMjAwMzYyMjM9J1xyXG5jb25zdCBFUlJPUl9HSVRIVUJfVVJMID0gJ2h0dHBzOi8vZ2l0aHViLmNvbS8xOVJ5YW5BL0NoZWNrUENSL2lzc3Vlcy9uZXcnXHJcblxyXG5jb25zdCBsaW5rQnlJZCA9IChpZDogc3RyaW5nKSA9PiBlbGVtQnlJZChpZCkgYXMgSFRNTExpbmtFbGVtZW50XHJcblxyXG4vLyAqZGlzcGxheUVycm9yKiBkaXNwbGF5cyBhIGRpYWxvZyBjb250YWluaW5nIGluZm9ybWF0aW9uIGFib3V0IGFuIGVycm9yLlxyXG5leHBvcnQgZnVuY3Rpb24gZGlzcGxheUVycm9yKGU6IEVycm9yKTogdm9pZCB7XHJcbiAgICBjb25zb2xlLmxvZygnRGlzcGxheWluZyBlcnJvcicsIGUpXHJcbiAgICBjb25zdCBlcnJvckhUTUwgPSBgTWVzc2FnZTogJHtlLm1lc3NhZ2V9XFxuU3RhY2s6ICR7ZS5zdGFjayB8fCAoZSBhcyBhbnkpLmxpbmVOdW1iZXJ9XFxuYFxyXG4gICAgICAgICAgICAgICAgICAgICsgYEJyb3dzZXI6ICR7bmF2aWdhdG9yLnVzZXJBZ2VudH1cXG5WZXJzaW9uOiAke1ZFUlNJT059YFxyXG4gICAgZWxlbUJ5SWQoJ2Vycm9yQ29udGVudCcpLmlubmVySFRNTCA9IGVycm9ySFRNTC5yZXBsYWNlKCdcXG4nLCAnPGJyPicpXHJcbiAgICBsaW5rQnlJZCgnZXJyb3JHb29nbGUnKS5ocmVmID0gRVJST1JfRk9STV9VUkwgKyBFUlJPUl9GT1JNX0VOVFJZICsgZW5jb2RlVVJJQ29tcG9uZW50KGVycm9ySFRNTClcclxuICAgIGxpbmtCeUlkKCdlcnJvckdpdEh1YicpLmhyZWYgPVxyXG4gICAgICAgIEVSUk9SX0dJVEhVQl9VUkwgKyAnP2JvZHk9JyArIGVuY29kZVVSSUNvbXBvbmVudChgSSd2ZSBlbmNvdW50ZXJlZCBhbiBidWcuXFxuXFxuXFxgXFxgXFxgXFxuJHtlcnJvckhUTUx9XFxuXFxgXFxgXFxgYClcclxuICAgIGVsZW1CeUlkKCdlcnJvckJhY2tncm91bmQnKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xyXG4gICAgcmV0dXJuIGVsZW1CeUlkKCdlcnJvcicpLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcbn1cclxuIiwiaW1wb3J0IHsgXyQgfSBmcm9tICcuLi91dGlsJ1xyXG5cclxuLy8gRm9yIGxpc3QgdmlldywgdGhlIGFzc2lnbm1lbnRzIGNhbid0IGJlIG9uIHRvcCBvZiBlYWNoIG90aGVyLlxyXG4vLyBUaGVyZWZvcmUsIGEgbGlzdGVuZXIgaXMgYXR0YWNoZWQgdG8gdGhlIHJlc2l6aW5nIG9mIHRoZSBicm93c2VyIHdpbmRvdy5cclxubGV0IHRpY2tpbmcgPSBmYWxzZVxyXG5sZXQgdGltZW91dElkOiBudW1iZXJ8bnVsbCA9IG51bGxcclxuZXhwb3J0IGZ1bmN0aW9uIGdldFJlc2l6ZUFzc2lnbm1lbnRzKCk6IEhUTUxFbGVtZW50W10ge1xyXG4gICAgY29uc3QgYXNzaWdubWVudHMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuY29udGFpbnMoJ3Nob3dEb25lJykgP1xyXG4gICAgICAgICcuYXNzaWdubWVudC5saXN0RGlzcCcgOiAnLmFzc2lnbm1lbnQubGlzdERpc3A6bm90KC5kb25lKScpKVxyXG4gICAgYXNzaWdubWVudHMuc29ydCgoYSwgYikgPT4ge1xyXG4gICAgICAgIGNvbnN0IGFkID0gYS5jbGFzc0xpc3QuY29udGFpbnMoJ2RvbmUnKVxyXG4gICAgICAgIGNvbnN0IGJkID0gYi5jbGFzc0xpc3QuY29udGFpbnMoJ2RvbmUnKVxyXG4gICAgICAgIGlmIChhZCAmJiAhYmQpIHsgcmV0dXJuIDEgfVxyXG4gICAgICAgIGlmIChiZCAmJiAhYWQpIHsgcmV0dXJuIC0xIH1cclxuICAgICAgICByZXR1cm4gTnVtYmVyKChhLnF1ZXJ5U2VsZWN0b3IoJy5kdWUnKSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSlcclxuICAgICAgICAgICAgIC0gTnVtYmVyKChiLnF1ZXJ5U2VsZWN0b3IoJy5kdWUnKSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSlcclxuICAgIH0pXHJcbiAgICByZXR1cm4gYXNzaWdubWVudHMgYXMgSFRNTEVsZW1lbnRbXVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVzaXplQ2FsbGVyKCk6IHZvaWQge1xyXG4gICAgaWYgKCF0aWNraW5nKSB7XHJcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlc2l6ZSlcclxuICAgICAgICB0aWNraW5nID0gdHJ1ZVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVzaXplKCk6IHZvaWQge1xyXG4gICAgdGlja2luZyA9IHRydWVcclxuICAgIC8vIFRvIGNhbGN1bGF0ZSB0aGUgbnVtYmVyIG9mIGNvbHVtbnMsIHRoZSBiZWxvdyBhbGdvcml0aG0gaXMgdXNlZCBiZWNhc2UgYXMgdGhlIHNjcmVlbiBzaXplXHJcbiAgICAvLyBpbmNyZWFzZXMsIHRoZSBjb2x1bW4gd2lkdGggaW5jcmVhc2VzXHJcbiAgICBjb25zdCB3aWR0aHMgPSBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5jb250YWlucygnc2hvd0luZm8nKSA/XHJcbiAgICAgICAgWzY1MCwgMTEwMCwgMTgwMCwgMjcwMCwgMzgwMCwgNTEwMF0gOiBbMzUwLCA4MDAsIDE1MDAsIDI0MDAsIDM1MDAsIDQ4MDBdXHJcbiAgICBsZXQgY29sdW1ucyA9IDFcclxuICAgIHdpZHRocy5mb3JFYWNoKCh3LCBpbmRleCkgPT4ge1xyXG4gICAgICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA+IHcpIHsgY29sdW1ucyA9IGluZGV4ICsgMSB9XHJcbiAgICB9KVxyXG4gICAgY29uc3QgY29sdW1uSGVpZ2h0cyA9IEFycmF5LmZyb20obmV3IEFycmF5KGNvbHVtbnMpLCAoKSA9PiAwKVxyXG4gICAgY29uc3QgY2NoOiBudW1iZXJbXSA9IFtdXHJcbiAgICBjb25zdCBhc3NpZ25tZW50cyA9IGdldFJlc2l6ZUFzc2lnbm1lbnRzKClcclxuICAgIGFzc2lnbm1lbnRzLmZvckVhY2goKGFzc2lnbm1lbnQsIG4pID0+IHtcclxuICAgICAgICBjb25zdCBjb2wgPSBuICUgY29sdW1uc1xyXG4gICAgICAgIGNjaC5wdXNoKGNvbHVtbkhlaWdodHNbY29sXSlcclxuICAgICAgICBjb2x1bW5IZWlnaHRzW2NvbF0gKz0gYXNzaWdubWVudC5vZmZzZXRIZWlnaHQgKyAyNFxyXG4gICAgfSlcclxuICAgIGFzc2lnbm1lbnRzLmZvckVhY2goKGFzc2lnbm1lbnQsIG4pID0+IHtcclxuICAgICAgICBjb25zdCBjb2wgPSBuICUgY29sdW1uc1xyXG4gICAgICAgIGFzc2lnbm1lbnQuc3R5bGUudG9wID0gY2NoW25dICsgJ3B4J1xyXG4gICAgICAgIGFzc2lnbm1lbnQuc3R5bGUubGVmdCA9ICgoMTAwIC8gY29sdW1ucykgKiBjb2wpICsgJyUnXHJcbiAgICAgICAgYXNzaWdubWVudC5zdHlsZS5yaWdodCA9ICgoMTAwIC8gY29sdW1ucykgKiAoY29sdW1ucyAtIGNvbCAtIDEpKSArICclJ1xyXG4gICAgfSlcclxuICAgIGlmICh0aW1lb3V0SWQpIGNsZWFyVGltZW91dCh0aW1lb3V0SWQpXHJcbiAgICB0aW1lb3V0SWQgPSBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBjY2gubGVuZ3RoID0gMFxyXG4gICAgICAgIGFzc2lnbm1lbnRzLmZvckVhY2goKGFzc2lnbm1lbnQsIG4pID0+IHtcclxuICAgICAgICAgICAgY29uc3QgY29sID0gbiAlIGNvbHVtbnNcclxuICAgICAgICAgICAgaWYgKG4gPCBjb2x1bW5zKSB7XHJcbiAgICAgICAgICAgICAgICBjb2x1bW5IZWlnaHRzW2NvbF0gPSAwXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2NoLnB1c2goY29sdW1uSGVpZ2h0c1tjb2xdKVxyXG4gICAgICAgICAgICBjb2x1bW5IZWlnaHRzW2NvbF0gKz0gYXNzaWdubWVudC5vZmZzZXRIZWlnaHQgKyAyNFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgYXNzaWdubWVudHMuZm9yRWFjaCgoYXNzaWdubWVudCwgbikgPT4ge1xyXG4gICAgICAgICAgICBhc3NpZ25tZW50LnN0eWxlLnRvcCA9IGNjaFtuXSArICdweCdcclxuICAgICAgICB9KVxyXG4gICAgfSwgNTAwKVxyXG4gICAgdGlja2luZyA9IGZhbHNlXHJcbn1cclxuIiwiLyoqXHJcbiAqIEFsbCB0aGlzIGlzIHJlc3BvbnNpYmxlIGZvciBpcyBjcmVhdGluZyBzbmFja2JhcnMuXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgZWxlbWVudCwgZm9yY2VMYXlvdXQgfSBmcm9tICcuLi91dGlsJ1xyXG5cclxuLyoqXHJcbiAqIENyZWF0ZXMgYSBzbmFja2JhciB3aXRob3V0IGFuIGFjdGlvblxyXG4gKiBAcGFyYW0gbWVzc2FnZSBUaGUgc25hY2tiYXIncyBtZXNzYWdlXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gc25hY2tiYXIobWVzc2FnZTogc3RyaW5nKTogdm9pZFxyXG4vKipcclxuICogQ3JlYXRlcyBhIHNuYWNrYmFyIHdpdGggYW4gYWN0aW9uXHJcbiAqIEBwYXJhbSBtZXNzYWdlIFRoZSBzbmFja2JhcidzIG1lc3NhZ2VcclxuICogQHBhcmFtIGFjdGlvbiBPcHRpb25hbCB0ZXh0IHRvIHNob3cgYXMgYSBtZXNzYWdlIGFjdGlvblxyXG4gKiBAcGFyYW0gZiAgICAgIEEgZnVuY3Rpb24gdG8gZXhlY3V0ZSB3aGVuIHRoZSBhY3Rpb24gaXMgY2xpY2tlZFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHNuYWNrYmFyKG1lc3NhZ2U6IHN0cmluZywgYWN0aW9uOiBzdHJpbmcsIGY6ICgpID0+IHZvaWQpOiB2b2lkXHJcbmV4cG9ydCBmdW5jdGlvbiBzbmFja2JhcihtZXNzYWdlOiBzdHJpbmcsIGFjdGlvbj86IHN0cmluZywgZj86ICgpID0+IHZvaWQpOiB2b2lkIHtcclxuICAgIGNvbnN0IHNuYWNrID0gZWxlbWVudCgnZGl2JywgJ3NuYWNrYmFyJylcclxuICAgIGNvbnN0IHNuYWNrSW5uZXIgPSBlbGVtZW50KCdkaXYnLCAnc25hY2tJbm5lcicsIG1lc3NhZ2UpXHJcbiAgICBzbmFjay5hcHBlbmRDaGlsZChzbmFja0lubmVyKVxyXG5cclxuICAgIGlmICgoYWN0aW9uICE9IG51bGwpICYmIChmICE9IG51bGwpKSB7XHJcbiAgICAgICAgY29uc3QgYWN0aW9uRSA9IGVsZW1lbnQoJ2EnLCBbXSwgYWN0aW9uKVxyXG4gICAgICAgIGFjdGlvbkUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHNuYWNrLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgICAgICAgICAgIGYoKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgc25hY2tJbm5lci5hcHBlbmRDaGlsZChhY3Rpb25FKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGFkZCA9ICgpID0+IHtcclxuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzbmFjaylcclxuICAgICAgZm9yY2VMYXlvdXQoc25hY2spXHJcbiAgICAgIHNuYWNrLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgc25hY2suY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcclxuICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gc25hY2sucmVtb3ZlKCksIDkwMClcclxuICAgICAgfSwgNTAwMClcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBleGlzdGluZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zbmFja2JhcicpXHJcbiAgICBpZiAoZXhpc3RpbmcgIT0gbnVsbCkge1xyXG4gICAgICAgIGV4aXN0aW5nLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgICAgICAgc2V0VGltZW91dChhZGQsIDMwMClcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYWRkKClcclxuICAgIH1cclxufVxyXG4iLCJcclxuLyoqXHJcbiAqIENvb2tpZSBmdW5jdGlvbnMgKGEgY29va2llIGlzIGEgc21hbGwgdGV4dCBkb2N1bWVudCB0aGF0IHRoZSBicm93c2VyIGNhbiByZW1lbWJlcilcclxuICovXHJcblxyXG4vKipcclxuICogUmV0cmlldmVzIGEgY29va2llXHJcbiAqIEBwYXJhbSBjbmFtZSB0aGUgbmFtZSBvZiB0aGUgY29va2llIHRvIHJldHJpZXZlXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29va2llKGNuYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgY29uc3QgbmFtZSA9IGNuYW1lICsgJz0nXHJcbiAgICBjb25zdCBjb29raWVQYXJ0ID0gZG9jdW1lbnQuY29va2llLnNwbGl0KCc7JykuZmluZCgoYykgPT4gYy5pbmNsdWRlcyhuYW1lKSlcclxuICAgIGlmIChjb29raWVQYXJ0KSByZXR1cm4gY29va2llUGFydC5zdWJzdHJpbmcobmFtZS5sZW5ndGgpXHJcbiAgICByZXR1cm4gJycgLy8gQmxhbmsgaWYgY29va2llIG5vdCBmb3VuZFxyXG4gIH1cclxuXHJcbi8qKiBTZXRzIHRoZSB2YWx1ZSBvZiBhIGNvb2tpZVxyXG4gKiBAcGFyYW0gY25hbWUgdGhlIG5hbWUgb2YgdGhlIGNvb2tpZSB0byBzZXRcclxuICogQHBhcmFtIGN2YWx1ZSB0aGUgdmFsdWUgdG8gc2V0IHRoZSBjb29raWUgdG9cclxuICogQHBhcmFtIGV4ZGF5cyB0aGUgbnVtYmVyIG9mIGRheXMgdGhhdCB0aGUgY29va2llIHdpbGwgZXhwaXJlIGluIChhbmQgbm90IGJlIGV4aXN0ZW50IGFueW1vcmUpXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gc2V0Q29va2llKGNuYW1lOiBzdHJpbmcsIGN2YWx1ZTogc3RyaW5nLCBleGRheXM6IG51bWJlcik6IHZvaWQge1xyXG4gICAgY29uc3QgZCA9IG5ldyBEYXRlKClcclxuICAgIGQuc2V0VGltZShkLmdldFRpbWUoKSArIChleGRheXMgKiAyNCAqIDYwICogNjAgKiAxMDAwKSlcclxuICAgIGNvbnN0IGV4cGlyZXMgPSBgZXhwaXJlcz0ke2QudG9VVENTdHJpbmcoKX1gXHJcbiAgICBkb2N1bWVudC5jb29raWUgPSBjbmFtZSArICc9JyArIGN2YWx1ZSArICc7ICcgKyBleHBpcmVzXHJcbiAgfVxyXG5cclxuLyoqXHJcbiAqIERlbGV0cyBhIGNvb2tpZVxyXG4gKiBAcGFyYW0gY25hbWUgdGhlIG5hbWUgb2YgdGhlIGNvb2tpZSB0byBkZWxldGVcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBkZWxldGVDb29raWUoY25hbWU6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgLy8gVGhpcyBpcyBsaWtlICpzZXRDb29raWUqLCBidXQgc2V0cyB0aGUgZXhwaXJ5IGRhdGUgdG8gc29tZXRoaW5nIGluIHRoZSBwYXN0IHNvIHRoZSBjb29raWUgaXMgZGVsZXRlZC5cclxuICAgIGRvY3VtZW50LmNvb2tpZSA9IGNuYW1lICsgJz07IGV4cGlyZXM9VGh1LCAwMSBKYW4gMTk3MCAwMDowMDowMSBHTVQ7J1xyXG59XHJcbiIsImV4cG9ydCBmdW5jdGlvbiB0em9mZigpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIChuZXcgRGF0ZSgpKS5nZXRUaW1lem9uZU9mZnNldCgpICogMTAwMCAqIDYwIC8vIEZvciBmdXR1cmUgY2FsY3VsYXRpb25zXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB0b0RhdGVOdW0oZGF0ZTogRGF0ZXxudW1iZXIpOiBudW1iZXIge1xyXG4gICAgY29uc3QgbnVtID0gZGF0ZSBpbnN0YW5jZW9mIERhdGUgPyBkYXRlLmdldFRpbWUoKSA6IGRhdGVcclxuICAgIHJldHVybiBNYXRoLmZsb29yKChudW0gLSB0em9mZigpKSAvIDEwMDAgLyAzNjAwIC8gMjQpXHJcbn1cclxuXHJcbi8vICpGcm9tRGF0ZU51bSogY29udmVydHMgYSBudW1iZXIgb2YgZGF5cyB0byBhIG51bWJlciBvZiBzZWNvbmRzXHJcbmV4cG9ydCBmdW5jdGlvbiBmcm9tRGF0ZU51bShkYXlzOiBudW1iZXIpOiBEYXRlIHtcclxuICAgIGNvbnN0IGQgPSBuZXcgRGF0ZSgoZGF5cyAqIDEwMDAgKiAzNjAwICogMjQpICsgdHpvZmYoKSlcclxuICAgIC8vIFRoZSBjaGVja3MgYmVsb3cgYXJlIHRvIGhhbmRsZSBkYXlsaWdodCBzYXZpbmdzIHRpbWVcclxuICAgIGlmIChkLmdldEhvdXJzKCkgPT09IDEpIHsgZC5zZXRIb3VycygwKSB9XHJcbiAgICBpZiAoKGQuZ2V0SG91cnMoKSA9PT0gMjIpIHx8IChkLmdldEhvdXJzKCkgPT09IDIzKSkge1xyXG4gICAgICBkLnNldEhvdXJzKDI0KVxyXG4gICAgICBkLnNldE1pbnV0ZXMoMClcclxuICAgICAgZC5zZXRTZWNvbmRzKDApXHJcbiAgICB9XHJcbiAgICByZXR1cm4gZFxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdG9kYXkoKTogbnVtYmVyIHtcclxuICAgIHJldHVybiB0b0RhdGVOdW0obmV3IERhdGUoKSlcclxufVxyXG5cclxuLyoqXHJcbiAqIEl0ZXJhdGVzIGZyb20gdGhlIHN0YXJ0aW5nIGRhdGUgdG8gZW5kaW5nIGRhdGUgaW5jbHVzaXZlXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gaXRlckRheXMoc3RhcnQ6IERhdGUsIGVuZDogRGF0ZSwgY2I6IChkYXRlOiBEYXRlKSA9PiB2b2lkKTogdm9pZCB7XHJcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmUgbm8tbG9vcHNcclxuICAgIGZvciAoY29uc3QgZCA9IG5ldyBEYXRlKHN0YXJ0KTsgZCA8PSBlbmQ7IGQuc2V0RGF0ZShkLmdldERhdGUoKSArIDEpKSB7XHJcbiAgICAgICAgY2IoZClcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBjb21wdXRlV2Vla0lkLCBjcmVhdGVBc3NpZ25tZW50LCBnZXRFUywgc2VwYXJhdGVkQ2xhc3MgfSBmcm9tICcuL2NvbXBvbmVudHMvYXNzaWdubWVudCdcclxuaW1wb3J0IHsgY3JlYXRlRGF5LCBjcmVhdGVXZWVrIH0gZnJvbSAnLi9jb21wb25lbnRzL2NhbGVuZGFyJ1xyXG5pbXBvcnQgeyBkaXNwbGF5RXJyb3IgfSBmcm9tICcuL2NvbXBvbmVudHMvZXJyb3JEaXNwbGF5J1xyXG5pbXBvcnQgeyByZXNpemUgfSBmcm9tICcuL2NvbXBvbmVudHMvcmVzaXplcidcclxuaW1wb3J0IHsgZnJvbURhdGVOdW0sIGl0ZXJEYXlzLCB0b2RheSB9IGZyb20gJy4vZGF0ZXMnXHJcbmltcG9ydCB7IGNsYXNzQnlJZCwgZ2V0RGF0YSwgSUFwcGxpY2F0aW9uRGF0YSwgSUFzc2lnbm1lbnQgfSBmcm9tICcuL3BjcidcclxuaW1wb3J0IHsgYWRkQWN0aXZpdHksIHNhdmVBY3Rpdml0eSB9IGZyb20gJy4vcGx1Z2lucy9hY3Rpdml0eSdcclxuaW1wb3J0IHsgZXh0cmFUb1Rhc2ssIGdldEV4dHJhLCBJQ3VzdG9tQXNzaWdubWVudCB9IGZyb20gJy4vcGx1Z2lucy9jdXN0b21Bc3NpZ25tZW50cydcclxuaW1wb3J0IHsgYXNzaWdubWVudEluRG9uZSwgcmVtb3ZlRnJvbURvbmUsIHNhdmVEb25lIH0gZnJvbSAnLi9wbHVnaW5zL2RvbmUnXHJcbmltcG9ydCB7IGFzc2lnbm1lbnRJbk1vZGlmaWVkLCByZW1vdmVGcm9tTW9kaWZpZWQsIHNhdmVNb2RpZmllZCB9IGZyb20gJy4vcGx1Z2lucy9tb2RpZmllZEFzc2lnbm1lbnRzJ1xyXG5pbXBvcnQgeyBfJCwgZGF0ZVN0cmluZywgZWxlbUJ5SWQsIGVsZW1lbnQsIGxvY2FsU3RvcmFnZVJlYWQsIHNtb290aFNjcm9sbCB9IGZyb20gJy4vdXRpbCdcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVNwbGl0QXNzaWdubWVudCB7XHJcbiAgICBhc3NpZ25tZW50OiBJQXNzaWdubWVudFxyXG4gICAgc3RhcnQ6IERhdGVcclxuICAgIGVuZDogRGF0ZXwnRm9yZXZlcidcclxuICAgIGN1c3RvbTogYm9vbGVhblxyXG4gICAgcmVmZXJlbmNlPzogSUN1c3RvbUFzc2lnbm1lbnRcclxufVxyXG5cclxuY29uc3QgU0NIRURVTEVfRU5EUyA9IHtcclxuICAgIGRheTogKGRhdGU6IERhdGUpID0+IDI0ICogMzYwMCAqIDEwMDAsXHJcbiAgICBtczogKGRhdGU6IERhdGUpID0+IFsyNCwgICAgICAgICAgICAgIC8vIFN1bmRheVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgMTUgKyAoMzUgLyA2MCksICAvLyBNb25kYXlcclxuICAgICAgICAgICAgICAgICAgICAgICAgIDE1ICsgKDM1IC8gNjApLCAgLy8gVHVlc2RheVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgMTUgKyAoMTUgLyA2MCksICAvLyBXZWRuZXNkYXlcclxuICAgICAgICAgICAgICAgICAgICAgICAgIDE1ICsgKDE1IC8gNjApLCAgLy8gVGh1cnNkYXlcclxuICAgICAgICAgICAgICAgICAgICAgICAgIDE1ICsgKDE1IC8gNjApLCAgLy8gRnJpZGF5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAyNCAgICAgICAgICAgICAgIC8vIFNhdHVyZGF5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF1bZGF0ZS5nZXREYXkoKV0sXHJcbiAgICB1czogKGRhdGU6IERhdGUpID0+IDE1ICogMzYwMCAqIDEwMDBcclxufVxyXG5jb25zdCBXRUVLRU5EX0NMQVNTTkFNRVMgPSBbJ2Zyb21XZWVrZW5kJywgJ292ZXJXZWVrZW5kJ11cclxuXHJcbmxldCBzY3JvbGwgPSAwIC8vIFRoZSBsb2NhdGlvbiB0byBzY3JvbGwgdG8gaW4gb3JkZXIgdG8gcmVhY2ggdG9kYXkgaW4gY2FsZW5kYXIgdmlld1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFNjcm9sbCgpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIHNjcm9sbFxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0VGltZUFmdGVyKGRhdGU6IERhdGUpOiBudW1iZXIge1xyXG4gICAgY29uc3QgaGlkZWFzc2lnbm1lbnRzID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2hpZGVBc3NpZ25tZW50cycpXHJcbiAgICBpZiAoaGlkZWFzc2lnbm1lbnRzID09PSAnZGF5JyB8fCBoaWRlYXNzaWdubWVudHMgPT09ICdtcycgfHwgaGlkZWFzc2lnbm1lbnRzID09PSAndXMnKSB7XHJcbiAgICAgICAgcmV0dXJuIFNDSEVEVUxFX0VORFNbaGlkZWFzc2lnbm1lbnRzXShkYXRlKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gU0NIRURVTEVfRU5EUy5kYXkoZGF0ZSlcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0U3RhcnRFbmREYXRlcyhkYXRhOiBJQXBwbGljYXRpb25EYXRhKToge3N0YXJ0OiBEYXRlLCBlbmQ6IERhdGUgfSB7XHJcbiAgICBpZiAoZGF0YS5tb250aFZpZXcpIHtcclxuICAgICAgICBjb25zdCBzdGFydE4gPSBNYXRoLm1pbiguLi5kYXRhLmFzc2lnbm1lbnRzLm1hcCgoYSkgPT4gYS5zdGFydCkpIC8vIFNtYWxsZXN0IGRhdGVcclxuICAgICAgICBjb25zdCBlbmROID0gTWF0aC5tYXgoLi4uZGF0YS5hc3NpZ25tZW50cy5tYXAoKGEpID0+IGEuc3RhcnQpKSAvLyBMYXJnZXN0IGRhdGVcclxuXHJcbiAgICAgICAgY29uc3QgeWVhciA9IChuZXcgRGF0ZSgpKS5nZXRGdWxsWWVhcigpIC8vIEZvciBmdXR1cmUgY2FsY3VsYXRpb25zXHJcblxyXG4gICAgICAgIC8vIENhbGN1bGF0ZSB3aGF0IG1vbnRoIHdlIHdpbGwgYmUgZGlzcGxheWluZyBieSBmaW5kaW5nIHRoZSBtb250aCBvZiB0b2RheVxyXG4gICAgICAgIGNvbnN0IG1vbnRoID0gKG5ldyBEYXRlKCkpLmdldE1vbnRoKClcclxuXHJcbiAgICAgICAgLy8gTWFrZSBzdXJlIHRoZSBzdGFydCBhbmQgZW5kIGRhdGVzIGxpZSB3aXRoaW4gdGhlIG1vbnRoXHJcbiAgICAgICAgY29uc3Qgc3RhcnQgPSBuZXcgRGF0ZShNYXRoLm1heChmcm9tRGF0ZU51bShzdGFydE4pLmdldFRpbWUoKSwgKG5ldyBEYXRlKHllYXIsIG1vbnRoKSkuZ2V0VGltZSgpKSlcclxuICAgICAgICAvLyBJZiB0aGUgZGF5IGFyZ3VtZW50IGZvciBEYXRlIGlzIDAsIHRoZW4gdGhlIHJlc3VsdGluZyBkYXRlIHdpbGwgYmUgb2YgdGhlIHByZXZpb3VzIG1vbnRoXHJcbiAgICAgICAgY29uc3QgZW5kID0gbmV3IERhdGUoTWF0aC5taW4oZnJvbURhdGVOdW0oZW5kTikuZ2V0VGltZSgpLCAobmV3IERhdGUoeWVhciwgbW9udGggKyAxLCAwKSkuZ2V0VGltZSgpKSlcclxuICAgICAgICByZXR1cm4geyBzdGFydCwgZW5kIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zdCB0b2RheVNFID0gbmV3IERhdGUoKVxyXG4gICAgICAgIGNvbnN0IHN0YXJ0ID0gbmV3IERhdGUodG9kYXlTRS5nZXRGdWxsWWVhcigpLCB0b2RheVNFLmdldE1vbnRoKCksIHRvZGF5U0UuZ2V0RGF0ZSgpKVxyXG4gICAgICAgIGNvbnN0IGVuZCA9IG5ldyBEYXRlKHRvZGF5U0UuZ2V0RnVsbFllYXIoKSwgdG9kYXlTRS5nZXRNb250aCgpLCB0b2RheVNFLmdldERhdGUoKSlcclxuICAgICAgICByZXR1cm4geyBzdGFydCwgZW5kIH1cclxuICAgICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRBc3NpZ25tZW50U3BsaXRzKGFzc2lnbm1lbnQ6IElBc3NpZ25tZW50LCBzdGFydDogRGF0ZSwgZW5kOiBEYXRlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlZmVyZW5jZT86IElDdXN0b21Bc3NpZ25tZW50KTogSVNwbGl0QXNzaWdubWVudFtdIHtcclxuICAgIGNvbnN0IHNwbGl0OiBJU3BsaXRBc3NpZ25tZW50W10gPSBbXVxyXG4gICAgaWYgKGxvY2FsU3RvcmFnZVJlYWQoJ2Fzc2lnbm1lbnRTcGFuJykgPT09ICdtdWx0aXBsZScpIHtcclxuICAgICAgICBjb25zdCBzID0gTWF0aC5tYXgoc3RhcnQuZ2V0VGltZSgpLCBmcm9tRGF0ZU51bShhc3NpZ25tZW50LnN0YXJ0KS5nZXRUaW1lKCkpXHJcbiAgICAgICAgY29uc3QgZSA9IGFzc2lnbm1lbnQuZW5kID09PSAnRm9yZXZlcicgPyBzIDogTWF0aC5taW4oZW5kLmdldFRpbWUoKSwgZnJvbURhdGVOdW0oYXNzaWdubWVudC5lbmQpLmdldFRpbWUoKSlcclxuICAgICAgICBjb25zdCBzcGFuID0gKChlIC0gcykgLyAxMDAwIC8gMzYwMCAvIDI0KSArIDEgLy8gTnVtYmVyIG9mIGRheXMgYXNzaWdubWVudCB0YWtlcyB1cFxyXG4gICAgICAgIGNvbnN0IHNwYW5SZWxhdGl2ZSA9IDYgLSAobmV3IERhdGUocykpLmdldERheSgpIC8vIE51bWJlciBvZiBkYXlzIHVudGlsIHRoZSBuZXh0IFNhdHVyZGF5XHJcblxyXG4gICAgICAgIGNvbnN0IG5zID0gbmV3IERhdGUocylcclxuICAgICAgICBucy5zZXREYXRlKG5zLmdldERhdGUoKSArIHNwYW5SZWxhdGl2ZSkgLy8gIFRoZSBkYXRlIG9mIHRoZSBuZXh0IFNhdHVyZGF5XHJcblxyXG4gICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZSBuby1sb29wc1xyXG4gICAgICAgIGZvciAobGV0IG4gPSAtNjsgbiA8IHNwYW4gLSBzcGFuUmVsYXRpdmU7IG4gKz0gNykge1xyXG4gICAgICAgICAgICBjb25zdCBsYXN0U3VuID0gbmV3IERhdGUobnMpXHJcbiAgICAgICAgICAgIGxhc3RTdW4uc2V0RGF0ZShsYXN0U3VuLmdldERhdGUoKSArIG4pXHJcblxyXG4gICAgICAgICAgICBjb25zdCBuZXh0U2F0ID0gbmV3IERhdGUobGFzdFN1bilcclxuICAgICAgICAgICAgbmV4dFNhdC5zZXREYXRlKG5leHRTYXQuZ2V0RGF0ZSgpICsgNilcclxuICAgICAgICAgICAgc3BsaXQucHVzaCh7XHJcbiAgICAgICAgICAgICAgICBhc3NpZ25tZW50LFxyXG4gICAgICAgICAgICAgICAgc3RhcnQ6IG5ldyBEYXRlKE1hdGgubWF4KHMsIGxhc3RTdW4uZ2V0VGltZSgpKSksXHJcbiAgICAgICAgICAgICAgICBlbmQ6IG5ldyBEYXRlKE1hdGgubWluKGUsIG5leHRTYXQuZ2V0VGltZSgpKSksXHJcbiAgICAgICAgICAgICAgICBjdXN0b206IEJvb2xlYW4ocmVmZXJlbmNlKSxcclxuICAgICAgICAgICAgICAgIHJlZmVyZW5jZVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICBuICs9IDdcclxuICAgICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKGxvY2FsU3RvcmFnZVJlYWQoJ2Fzc2lnbm1lbnRTcGFuJykgPT09ICdzdGFydCcpIHtcclxuICAgICAgICBjb25zdCBzID0gZnJvbURhdGVOdW0oYXNzaWdubWVudC5zdGFydClcclxuICAgICAgICBpZiAocy5nZXRUaW1lKCkgPj0gc3RhcnQuZ2V0VGltZSgpKSB7XHJcbiAgICAgICAgICAgIHNwbGl0LnB1c2goe1xyXG4gICAgICAgICAgICAgICAgYXNzaWdubWVudCxcclxuICAgICAgICAgICAgICAgIHN0YXJ0OiBzLFxyXG4gICAgICAgICAgICAgICAgZW5kOiBzLFxyXG4gICAgICAgICAgICAgICAgY3VzdG9tOiBCb29sZWFuKHJlZmVyZW5jZSksXHJcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKGxvY2FsU3RvcmFnZVJlYWQoJ2Fzc2lnbm1lbnRTcGFuJykgPT09ICdlbmQnKSB7XHJcbiAgICAgICAgY29uc3QgZSA9IGFzc2lnbm1lbnQuZW5kID09PSAnRm9yZXZlcicgPyBhc3NpZ25tZW50LmVuZCA6IGZyb21EYXRlTnVtKGFzc2lnbm1lbnQuZW5kKVxyXG4gICAgICAgIGNvbnN0IGRlID0gZSA9PT0gJ0ZvcmV2ZXInID8gZnJvbURhdGVOdW0oYXNzaWdubWVudC5zdGFydCkgOiBlXHJcbiAgICAgICAgaWYgKGRlLmdldFRpbWUoKSA8PSBlbmQuZ2V0VGltZSgpKSB7XHJcbiAgICAgICAgICAgIHNwbGl0LnB1c2goe1xyXG4gICAgICAgICAgICAgICAgYXNzaWdubWVudCxcclxuICAgICAgICAgICAgICAgIHN0YXJ0OiBkZSxcclxuICAgICAgICAgICAgICAgIGVuZDogZSxcclxuICAgICAgICAgICAgICAgIGN1c3RvbTogQm9vbGVhbihyZWZlcmVuY2UpLFxyXG4gICAgICAgICAgICAgICAgcmVmZXJlbmNlXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBzcGxpdFxyXG59XHJcblxyXG4vLyBUaGlzIGZ1bmN0aW9uIHdpbGwgY29udmVydCB0aGUgYXJyYXkgb2YgYXNzaWdubWVudHMgZ2VuZXJhdGVkIGJ5ICpwYXJzZSogaW50byByZWFkYWJsZSBIVE1MLlxyXG5leHBvcnQgZnVuY3Rpb24gZGlzcGxheShkb1Njcm9sbDogYm9vbGVhbiA9IHRydWUpOiB2b2lkIHtcclxuICAgIGNvbnNvbGUudGltZSgnRGlzcGxheWluZyBkYXRhJylcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgZGF0YSA9IGdldERhdGEoKVxyXG4gICAgICAgIGlmICghZGF0YSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0RhdGEgc2hvdWxkIGhhdmUgYmVlbiBmZXRjaGVkIGJlZm9yZSBkaXNwbGF5KCkgd2FzIGNhbGxlZCcpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkb2N1bWVudC5ib2R5LnNldEF0dHJpYnV0ZSgnZGF0YS1wY3J2aWV3JywgZGF0YS5tb250aFZpZXcgPyAnbW9udGgnIDogJ290aGVyJylcclxuICAgICAgICBjb25zdCBtYWluID0gXyQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbWFpbicpKVxyXG4gICAgICAgIGNvbnN0IHRha2VuOiB7IFtkYXRlOiBudW1iZXJdOiBudW1iZXJbXSB9ID0ge31cclxuXHJcbiAgICAgICAgY29uc3QgdGltZWFmdGVyID0gZ2V0VGltZUFmdGVyKG5ldyBEYXRlKCkpXHJcblxyXG4gICAgICAgIGNvbnN0IHtzdGFydCwgZW5kfSA9IGdldFN0YXJ0RW5kRGF0ZXMoZGF0YSlcclxuXHJcbiAgICAgICAgLy8gU2V0IHRoZSBzdGFydCBkYXRlIHRvIGJlIGEgU3VuZGF5IGFuZCB0aGUgZW5kIGRhdGUgdG8gYmUgYSBTYXR1cmRheVxyXG4gICAgICAgIHN0YXJ0LnNldERhdGUoc3RhcnQuZ2V0RGF0ZSgpIC0gc3RhcnQuZ2V0RGF5KCkpXHJcbiAgICAgICAgZW5kLnNldERhdGUoZW5kLmdldERhdGUoKSArICg2IC0gZW5kLmdldERheSgpKSlcclxuXHJcbiAgICAgICAgLy8gRmlyc3QgcG9wdWxhdGUgdGhlIGNhbGVuZGFyIHdpdGggYm94ZXMgZm9yIGVhY2ggZGF5XHJcbiAgICAgICAgY29uc3QgbGFzdERhdGEgPSBsb2NhbFN0b3JhZ2VSZWFkKCdkYXRhJykgYXMgSUFwcGxpY2F0aW9uRGF0YVxyXG4gICAgICAgIGxldCB3azogSFRNTEVsZW1lbnR8bnVsbCA9IG51bGxcclxuICAgICAgICBpdGVyRGF5cyhzdGFydCwgZW5kLCAoZCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZC5nZXREYXkoKSA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaWQgPSBgd2ske2QuZ2V0TW9udGgoKX0tJHtkLmdldERhdGUoKX1gIC8vIERvbid0IGNyZWF0ZSBhIG5ldyB3ZWVrIGVsZW1lbnQgaWYgb25lIGFscmVhZHkgZXhpc3RzXHJcbiAgICAgICAgICAgICAgICB3ayA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKVxyXG4gICAgICAgICAgICAgICAgaWYgKHdrID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICB3ayA9IGNyZWF0ZVdlZWsoaWQpXHJcbiAgICAgICAgICAgICAgICAgICAgbWFpbi5hcHBlbmRDaGlsZCh3aylcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCF3aykgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCB3ZWVrIGVsZW1lbnQgb24gZGF5ICR7ZH0gdG8gbm90IGJlIG51bGxgKVxyXG4gICAgICAgICAgICBpZiAod2suZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnZGF5JykubGVuZ3RoIDw9IGQuZ2V0RGF5KCkpIHtcclxuICAgICAgICAgICAgICAgIHdrLmFwcGVuZENoaWxkKGNyZWF0ZURheShkKSlcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGFrZW5bZC5nZXRUaW1lKCldID0gW11cclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICAvLyBTcGxpdCBhc3NpZ25tZW50cyB0YWtpbmcgbW9yZSB0aGFuIDEgd2Vla1xyXG4gICAgICAgIGNvbnN0IHNwbGl0OiBJU3BsaXRBc3NpZ25tZW50W10gPSBbXVxyXG4gICAgICAgIGRhdGEuYXNzaWdubWVudHMuZm9yRWFjaCgoYXNzaWdubWVudCwgbnVtKSA9PiB7XHJcbiAgICAgICAgICAgIHNwbGl0LnB1c2goLi4uZ2V0QXNzaWdubWVudFNwbGl0cyhhc3NpZ25tZW50LCBzdGFydCwgZW5kKSlcclxuXHJcbiAgICAgICAgICAgIC8vIEFjdGl2aXR5IHN0dWZmXHJcbiAgICAgICAgICAgIGlmIChsYXN0RGF0YSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBvbGRBc3NpZ25tZW50ID0gbGFzdERhdGEuYXNzaWdubWVudHMuZmluZCgoYSkgPT4gYS5pZCA9PT0gYXNzaWdubWVudC5pZClcclxuICAgICAgICAgICAgICAgIGlmIChvbGRBc3NpZ25tZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9sZEFzc2lnbm1lbnQuYm9keSAhPT0gYXNzaWdubWVudC5ib2R5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkZEFjdGl2aXR5KCdlZGl0Jywgb2xkQXNzaWdubWVudCwgbmV3IERhdGUoKSwgdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2xkQXNzaWdubWVudC5jbGFzcyAhPSBudWxsID8gbGFzdERhdGEuY2xhc3Nlc1tvbGRBc3NpZ25tZW50LmNsYXNzXSA6IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlRnJvbU1vZGlmaWVkKGFzc2lnbm1lbnQuaWQpIC8vIElmIHRoZSBhc3NpZ25tZW50IGlzIG1vZGlmaWVkLCByZXNldCBpdFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBsYXN0RGF0YS5hc3NpZ25tZW50cy5zcGxpY2UobGFzdERhdGEuYXNzaWdubWVudHMuaW5kZXhPZihvbGRBc3NpZ25tZW50KSwgMSlcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWRkQWN0aXZpdHkoJ2FkZCcsIGFzc2lnbm1lbnQsIG5ldyBEYXRlKCksIHRydWUpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICBpZiAobGFzdERhdGEgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAvLyBDaGVjayBpZiBhbnkgb2YgdGhlIGxhc3QgYXNzaWdubWVudHMgd2VyZW4ndCBkZWxldGVkIChzbyB0aGV5IGhhdmUgYmVlbiBkZWxldGVkIGluIFBDUilcclxuICAgICAgICAgICAgbGFzdERhdGEuYXNzaWdubWVudHMuZm9yRWFjaCgoYXNzaWdubWVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgYWRkQWN0aXZpdHkoJ2RlbGV0ZScsIGFzc2lnbm1lbnQsIG5ldyBEYXRlKCksIHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhc3NpZ25tZW50LmNsYXNzICE9IG51bGwgPyBsYXN0RGF0YS5jbGFzc2VzW2Fzc2lnbm1lbnQuY2xhc3NdIDogdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgcmVtb3ZlRnJvbURvbmUoYXNzaWdubWVudC5pZClcclxuICAgICAgICAgICAgICAgIHJlbW92ZUZyb21Nb2RpZmllZChhc3NpZ25tZW50LmlkKVxyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgLy8gVGhlbiBzYXZlIGEgbWF4aW11bSBvZiAxMjggYWN0aXZpdHkgaXRlbXNcclxuICAgICAgICAgICAgc2F2ZUFjdGl2aXR5KClcclxuXHJcbiAgICAgICAgICAgIC8vIEFuZCBjb21wbGV0ZWQgYXNzaWdubWVudHMgKyBtb2RpZmljYXRpb25zXHJcbiAgICAgICAgICAgIHNhdmVEb25lKClcclxuICAgICAgICAgICAgc2F2ZU1vZGlmaWVkKClcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEFkZCBjdXN0b20gYXNzaWdubWVudHMgdG8gdGhlIHNwbGl0IGFycmF5XHJcbiAgICAgICAgZ2V0RXh0cmEoKS5mb3JFYWNoKChjdXN0b20pID0+IHtcclxuICAgICAgICAgICAgc3BsaXQucHVzaCguLi5nZXRBc3NpZ25tZW50U3BsaXRzKGV4dHJhVG9UYXNrKGN1c3RvbSwgZGF0YSksIHN0YXJ0LCBlbmQsIGN1c3RvbSkpXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgLy8gQ2FsY3VsYXRlIHRoZSB0b2RheSdzIHdlZWsgaWRcclxuICAgICAgICBjb25zdCB0ZHN0ID0gbmV3IERhdGUoKVxyXG4gICAgICAgIHRkc3Quc2V0RGF0ZSh0ZHN0LmdldERhdGUoKSAtIHRkc3QuZ2V0RGF5KCkpXHJcbiAgICAgICAgY29uc3QgdG9kYXlXa0lkID0gYHdrJHt0ZHN0LmdldE1vbnRoKCl9LSR7dGRzdC5nZXREYXRlKCl9YFxyXG5cclxuICAgICAgICAvLyBUaGVuIGFkZCBhc3NpZ25tZW50c1xyXG4gICAgICAgIGNvbnN0IHdlZWtIZWlnaHRzOiB7IFt3ZWVrSWQ6IHN0cmluZ106IG51bWJlciB9ID0ge31cclxuICAgICAgICBjb25zdCBwcmV2aW91c0Fzc2lnbm1lbnRzOiB7IFtpZDogc3RyaW5nXTogSFRNTEVsZW1lbnQgfSA9IHt9XHJcbiAgICAgICAgQXJyYXkucHJvdG90eXBlLmZvckVhY2guY2FsbChkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdhc3NpZ25tZW50JyksIChhc3NpZ25tZW50OiBIVE1MRWxlbWVudCkgPT4ge1xyXG4gICAgICAgICAgICBwcmV2aW91c0Fzc2lnbm1lbnRzW2Fzc2lnbm1lbnQuaWRdID0gYXNzaWdubWVudFxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIGNvbnN0IHNlcGFyYXRlVGFza0NsYXNzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2Uuc2VwVGFza0NsYXNzKVxyXG4gICAgICAgIHNwbGl0LmZvckVhY2goKHMpID0+IHtcclxuICAgICAgICAgICAgY29uc3Qgd2Vla0lkID0gY29tcHV0ZVdlZWtJZChzKVxyXG4gICAgICAgICAgICB3ayA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHdlZWtJZClcclxuICAgICAgICAgICAgaWYgKHdrID09IG51bGwpIHJldHVyblxyXG5cclxuICAgICAgICAgICAgY29uc3QgZSA9IGNyZWF0ZUFzc2lnbm1lbnQocywgZGF0YSlcclxuXHJcbiAgICAgICAgICAgIC8vIENhbGN1bGF0ZSBob3cgbWFueSBhc3NpZ25tZW50cyBhcmUgcGxhY2VkIGJlZm9yZSB0aGUgY3VycmVudCBvbmVcclxuICAgICAgICAgICAgaWYgKCFzLmN1c3RvbSB8fCAhbG9jYWxTdG9yYWdlUmVhZCgnc2VwVGFza3MnKSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHBvcyA9IDBcclxuICAgICAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZSBuby1sb29wc1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZm91bmQgPSB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgaXRlckRheXMocy5zdGFydCwgcy5lbmQgPT09ICdGb3JldmVyJyA/IHMuc3RhcnQgOiBzLmVuZCwgKGQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRha2VuW2QuZ2V0VGltZSgpXS5pbmRleE9mKHBvcykgIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IGZhbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChmb3VuZCkgeyBicmVhayB9XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zKytcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBBcHBlbmQgdGhlIHBvc2l0aW9uIHRoZSBhc3NpZ25tZW50IGlzIGF0IHRvIHRoZSB0YWtlbiBhcnJheVxyXG4gICAgICAgICAgICAgICAgaXRlckRheXMocy5zdGFydCwgcy5lbmQgPT09ICdGb3JldmVyJyA/IHMuc3RhcnQgOiBzLmVuZCwgKGQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0YWtlbltkLmdldFRpbWUoKV0ucHVzaChwb3MpXHJcbiAgICAgICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIENhbGN1bGF0ZSBob3cgZmFyIGRvd24gdGhlIGFzc2lnbm1lbnQgbXVzdCBiZSBwbGFjZWQgYXMgdG8gbm90IGJsb2NrIHRoZSBvbmVzIGFib3ZlIGl0XHJcbiAgICAgICAgICAgICAgICBlLnN0eWxlLm1hcmdpblRvcCA9IChwb3MgKiAzMCkgKyAncHgnXHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCh3ZWVrSGVpZ2h0c1t3ZWVrSWRdID09IG51bGwpIHx8IChwb3MgPiB3ZWVrSGVpZ2h0c1t3ZWVrSWRdKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHdlZWtIZWlnaHRzW3dlZWtJZF0gPSBwb3NcclxuICAgICAgICAgICAgICAgICAgICB3ay5zdHlsZS5oZWlnaHQgPSA0NyArICgocG9zICsgMSkgKiAzMCkgKyAncHgnXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIElmIHRoZSBhc3NpZ25tZW50IGlzIGEgdGVzdCBhbmQgaXMgdXBjb21pbmcsIGFkZCBpdCB0byB0aGUgdXBjb21pbmcgdGVzdHMgcGFuZWwuXHJcbiAgICAgICAgICAgIGlmIChzLmFzc2lnbm1lbnQuZW5kID49IHRvZGF5KCkgJiYgKHMuYXNzaWdubWVudC5iYXNlVHlwZSA9PT0gJ3Rlc3QnIHx8XHJcbiAgICAgICAgICAgICAgICAobG9jYWxTdG9yYWdlUmVhZCgncHJvamVjdHNJblRlc3RQYW5lJykgJiYgcy5hc3NpZ25tZW50LmJhc2VUeXBlID09PSAnbG9uZ3Rlcm0nKSkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRlID0gZWxlbWVudCgnZGl2JywgWyd1cGNvbWluZ1Rlc3QnLCAnYXNzaWdubWVudEl0ZW0nLCBzLmFzc2lnbm1lbnQuYmFzZVR5cGVdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGA8aSBjbGFzcz0nbWF0ZXJpYWwtaWNvbnMnPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtzLmFzc2lnbm1lbnQuYmFzZVR5cGUgPT09ICdsb25ndGVybScgPyAnYXNzaWdubWVudCcgOiAnYXNzZXNzbWVudCd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvaT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9J3RpdGxlJz4ke3MuYXNzaWdubWVudC50aXRsZX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzbWFsbD4ke3NlcGFyYXRlZENsYXNzKHMuYXNzaWdubWVudCwgZGF0YSlbMl19PC9zbWFsbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz0ncmFuZ2UnPiR7ZGF0ZVN0cmluZyhlbmQsIHRydWUpfTwvZGl2PmAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYHRlc3Qke3MuYXNzaWdubWVudC5pZH1gKVxyXG4gICAgICAgICAgICAgICAgaWYgKHMuYXNzaWdubWVudC5jbGFzcykgdGUuc2V0QXR0cmlidXRlKCdkYXRhLWNsYXNzJywgZGF0YS5jbGFzc2VzW3MuYXNzaWdubWVudC5jbGFzc10pXHJcbiAgICAgICAgICAgICAgICB0ZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkb1Njcm9sbGluZyA9IGFzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgc21vb3RoU2Nyb2xsKChlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCArIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wKSAtIDExNilcclxuICAgICAgICAgICAgICAgICAgICAgICAgZS5jbGljaygpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkb2N1bWVudC5ib2R5LmdldEF0dHJpYnV0ZSgnZGF0YS12aWV3JykgPT09ICcwJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb1Njcm9sbGluZygpXHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXyQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI25hdlRhYnM+bGk6Zmlyc3QtY2hpbGQnKSBhcyBIVE1MRWxlbWVudCkuY2xpY2soKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGRvU2Nyb2xsaW5nLCA1MDApXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoYXNzaWdubWVudEluRG9uZShzLmFzc2lnbm1lbnQuaWQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGUuY2xhc3NMaXN0LmFkZCgnZG9uZScpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0ZXN0RWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGB0ZXN0JHtzLmFzc2lnbm1lbnQuaWR9YClcclxuICAgICAgICAgICAgICAgIGlmICh0ZXN0RWxlbSkge1xyXG4gICAgICAgICAgICAgICAgdGVzdEVsZW0uaW5uZXJIVE1MID0gdGUuaW5uZXJIVE1MXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1CeUlkKCdpbmZvVGVzdHMnKS5hcHBlbmRDaGlsZCh0ZSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgYWxyZWFkeSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHMuYXNzaWdubWVudC5pZCArIHdlZWtJZClcclxuICAgICAgICAgICAgaWYgKGFscmVhZHkgIT0gbnVsbCkgeyAvLyBBc3NpZ25tZW50IGFscmVhZHkgZXhpc3RzXHJcbiAgICAgICAgICAgICAgICBhbHJlYWR5LnN0eWxlLm1hcmdpblRvcCA9IGUuc3R5bGUubWFyZ2luVG9wXHJcbiAgICAgICAgICAgICAgICBhbHJlYWR5LnNldEF0dHJpYnV0ZSgnZGF0YS1jbGFzcycsXHJcbiAgICAgICAgICAgICAgICAgICAgcy5jdXN0b20gJiYgc2VwYXJhdGVUYXNrQ2xhc3MgPyAnVGFzaycgOiBjbGFzc0J5SWQocy5hc3NpZ25tZW50LmNsYXNzKSlcclxuICAgICAgICAgICAgICAgIGlmICghYXNzaWdubWVudEluTW9kaWZpZWQocy5hc3NpZ25tZW50LmlkKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFscmVhZHkuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYm9keScpWzBdLmlubmVySFRNTCA9IGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYm9keScpWzBdLmlubmVySFRNTFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXyQoYWxyZWFkeS5xdWVyeVNlbGVjdG9yKCcuZWRpdHMnKSkuY2xhc3NOYW1lID0gXyQoZS5xdWVyeVNlbGVjdG9yKCcuZWRpdHMnKSkuY2xhc3NOYW1lXHJcbiAgICAgICAgICAgICAgICBpZiAoYWxyZWFkeS5jbGFzc0xpc3QudG9nZ2xlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxyZWFkeS5jbGFzc0xpc3QudG9nZ2xlKCdsaXN0RGlzcCcsIGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdsaXN0RGlzcCcpKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZ2V0RVMoYWxyZWFkeSkuZm9yRWFjaCgoY2wpID0+IGFscmVhZHkuY2xhc3NMaXN0LnJlbW92ZShjbCkpXHJcbiAgICAgICAgICAgICAgICBnZXRFUyhlKS5mb3JFYWNoKChjbCkgPT4gYWxyZWFkeS5jbGFzc0xpc3QuYWRkKGNsKSlcclxuICAgICAgICAgICAgICAgIFdFRUtFTkRfQ0xBU1NOQU1FUy5mb3JFYWNoKChjbCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGFscmVhZHkuY2xhc3NMaXN0LnJlbW92ZShjbClcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZS5jbGFzc0xpc3QuY29udGFpbnMoY2wpKSBhbHJlYWR5LmNsYXNzTGlzdC5hZGQoY2wpXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKHMuY3VzdG9tICYmIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLnNlcFRhc2tzKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHN0ID0gTWF0aC5mbG9vcihzLnN0YXJ0LmdldFRpbWUoKSAvIDEwMDAgLyAzNjAwIC8gMjQpXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKChzLmFzc2lnbm1lbnQuc3RhcnQgPT09IHN0KSAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAocy5hc3NpZ25tZW50LmVuZCA9PT0gJ0ZvcmV2ZXInIHx8IHMuYXNzaWdubWVudC5lbmQgPj0gdG9kYXkoKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZS5jbGFzc0xpc3QucmVtb3ZlKCdhc3NpZ25tZW50JylcclxuICAgICAgICAgICAgICAgICAgICAgICAgZS5jbGFzc0xpc3QuYWRkKCd0YXNrUGFuZUl0ZW0nKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlLnN0eWxlLm9yZGVyID0gU3RyaW5nKHMuYXNzaWdubWVudC5lbmQgPT09ICdGb3JldmVyJyA/IE51bWJlci5NQVhfVkFMVUUgOiBzLmFzc2lnbm1lbnQuZW5kKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBsaW5rID0gZS5xdWVyeVNlbGVjdG9yKCcubGlua2VkJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxpbmspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUuaW5zZXJ0QmVmb3JlKGVsZW1lbnQoJ3NtYWxsJywgW10sIGxpbmsuaW5uZXJIVE1MKSwgbGluaylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmsucmVtb3ZlKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtQnlJZCgnaW5mb1Rhc2tzSW5uZXInKS5hcHBlbmRDaGlsZChlKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7IHdrLmFwcGVuZENoaWxkKGUpIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBkZWxldGUgcHJldmlvdXNBc3NpZ25tZW50c1tzLmFzc2lnbm1lbnQuaWQgKyB3ZWVrSWRdXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgLy8gRGVsZXRlIGFueSBhc3NpZ25tZW50cyB0aGF0IGhhdmUgYmVlbiBkZWxldGVkIHNpbmNlIHVwZGF0aW5nXHJcbiAgICAgICAgT2JqZWN0LmVudHJpZXMocHJldmlvdXNBc3NpZ25tZW50cykuZm9yRWFjaCgoW25hbWUsIGFzc2lnbm1lbnRdKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChhc3NpZ25tZW50LmNsYXNzTGlzdC5jb250YWlucygnZnVsbCcpKSB7XHJcbiAgICAgICAgICAgICAgICBlbGVtQnlJZCgnYmFja2dyb3VuZCcpLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYXNzaWdubWVudC5yZW1vdmUoKVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIC8vIFNjcm9sbCB0byB0aGUgY29ycmVjdCBwb3NpdGlvbiBpbiBjYWxlbmRhciB2aWV3XHJcbiAgICAgICAgaWYgKHdlZWtIZWlnaHRzW3RvZGF5V2tJZF0gIT0gbnVsbCkge1xyXG4gICAgICAgICAgICBsZXQgaCA9IDBcclxuICAgICAgICAgICAgY29uc3Qgc3cgPSAod2tpZDogc3RyaW5nKSA9PiB3a2lkLnN1YnN0cmluZygyKS5zcGxpdCgnLScpLm1hcCgoeCkgPT4gTnVtYmVyKHgpKVxyXG4gICAgICAgICAgICBjb25zdCB0b2RheVdrID0gc3codG9kYXlXa0lkKVxyXG4gICAgICAgICAgICBPYmplY3QuZW50cmllcyh3ZWVrSGVpZ2h0cykuZm9yRWFjaCgoW3drSWQsIHZhbF0pID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHdrU3BsaXQgPSBzdyh3a0lkKVxyXG4gICAgICAgICAgICAgICAgaWYgKCh3a1NwbGl0WzBdIDwgdG9kYXlXa1swXSkgfHwgKCh3a1NwbGl0WzBdID09PSB0b2RheVdrWzBdKSAmJiAod2tTcGxpdFsxXSA8IHRvZGF5V2tbMV0pKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGggKz0gdmFsXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIHNjcm9sbCA9IChoICogMzApICsgMTEyICsgMTRcclxuICAgICAgICAgICAgLy8gQWxzbyBzaG93IHRoZSBkYXkgaGVhZGVycyBpZiB0b2RheSdzIGRhdGUgaXMgZGlzcGxheWVkIGluIHRoZSBmaXJzdCByb3cgb2YgdGhlIGNhbGVuZGFyXHJcbiAgICAgICAgICAgIGlmIChzY3JvbGwgPCA1MCkgc2Nyb2xsID0gMFxyXG4gICAgICAgICAgICBpZiAoZG9TY3JvbGwgJiYgKGRvY3VtZW50LmJvZHkuZ2V0QXR0cmlidXRlKCdkYXRhLXZpZXcnKSA9PT0gJzAnKSAmJlxyXG4gICAgICAgICAgICAgICAgIWRvY3VtZW50LmJvZHkucXVlcnlTZWxlY3RvcignLmZ1bGwnKSkge1xyXG4gICAgICAgICAgICAgICAgLy8gaW4gY2FsZW5kYXIgdmlld1xyXG4gICAgICAgICAgICAgICAgd2luZG93LnNjcm9sbFRvKDAsIHNjcm9sbClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QudG9nZ2xlKCdub0xpc3QnLFxyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYXNzaWdubWVudC5saXN0RGlzcDpub3QoLmRvbmUpJykubGVuZ3RoID09PSAwKVxyXG4gICAgICAgIGlmIChkb2N1bWVudC5ib2R5LmdldEF0dHJpYnV0ZSgnZGF0YS12aWV3JykgPT09ICcxJykgeyAvLyBpbiBsaXN0IHZpZXdcclxuICAgICAgICAgICAgcmVzaXplKClcclxuICAgICAgICB9XHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICBkaXNwbGF5RXJyb3IoZXJyKVxyXG4gICAgfVxyXG4gICAgY29uc29sZS50aW1lRW5kKCdEaXNwbGF5aW5nIGRhdGEnKVxyXG59XHJcblxyXG4vLyBUaGUgZnVuY3Rpb24gYmVsb3cgY29udmVydHMgYW4gdXBkYXRlIHRpbWUgdG8gYSBodW1hbi1yZWFkYWJsZSBkYXRlLlxyXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0VXBkYXRlKGRhdGU6IG51bWJlcik6IHN0cmluZyB7XHJcbiAgY29uc3Qgbm93ID0gbmV3IERhdGUoKVxyXG4gIGNvbnN0IHVwZGF0ZSA9IG5ldyBEYXRlKCtkYXRlKVxyXG4gIGlmIChub3cuZ2V0RGF0ZSgpID09PSB1cGRhdGUuZ2V0RGF0ZSgpKSB7XHJcbiAgICBsZXQgYW1wbSA9ICdBTSdcclxuICAgIGxldCBociA9IHVwZGF0ZS5nZXRIb3VycygpXHJcbiAgICBpZiAoaHIgPiAxMikge1xyXG4gICAgICBhbXBtID0gJ1BNJ1xyXG4gICAgICBociAtPSAxMlxyXG4gICAgfVxyXG4gICAgY29uc3QgbWluID0gdXBkYXRlLmdldE1pbnV0ZXMoKVxyXG4gICAgcmV0dXJuIGBUb2RheSBhdCAke2hyfToke21pbiA8IDEwID8gYDAke21pbn1gIDogbWlufSAke2FtcG19YFxyXG4gIH0gZWxzZSB7XHJcbiAgICBjb25zdCBkYXlzUGFzdCA9IE1hdGguY2VpbCgobm93LmdldFRpbWUoKSAtIHVwZGF0ZS5nZXRUaW1lKCkpIC8gMTAwMCAvIDM2MDAgLyAyNClcclxuICAgIGlmIChkYXlzUGFzdCA9PT0gMSkgeyByZXR1cm4gJ1llc3RlcmRheScgfSBlbHNlIHsgcmV0dXJuIGRheXNQYXN0ICsgJyBkYXlzIGFnbycgfVxyXG4gIH1cclxufVxyXG4iLCJsZXQgbGlzdERhdGVPZmZzZXQgPSAwXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0TGlzdERhdGVPZmZzZXQoKTogbnVtYmVyIHtcclxuICAgIHJldHVybiBsaXN0RGF0ZU9mZnNldFxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gemVyb0xpc3REYXRlT2Zmc2V0KCk6IHZvaWQge1xyXG4gICAgbGlzdERhdGVPZmZzZXQgPSAwXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpbmNyZW1lbnRMaXN0RGF0ZU9mZnNldCgpOiB2b2lkIHtcclxuICAgIGxpc3REYXRlT2Zmc2V0ICs9IDFcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRlY3JlbWVudExpc3REYXRlT2Zmc2V0KCk6IHZvaWQge1xyXG4gICAgbGlzdERhdGVPZmZzZXQgLT0gMVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2V0TGlzdERhdGVPZmZzZXQob2Zmc2V0OiBudW1iZXIpOiB2b2lkIHtcclxuICAgIGxpc3REYXRlT2Zmc2V0ID0gb2Zmc2V0XHJcbn1cclxuIiwiLyoqXHJcbiAqIFRoaXMgbW9kdWxlIGNvbnRhaW5zIGNvZGUgdG8gYm90aCBmZXRjaCBhbmQgcGFyc2UgYXNzaWdubWVudHMgZnJvbSBQQ1IuXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgdXBkYXRlQXZhdGFyIH0gZnJvbSAnLi9jb21wb25lbnRzL2F2YXRhcidcclxuaW1wb3J0IHsgZGlzcGxheUVycm9yIH0gZnJvbSAnLi9jb21wb25lbnRzL2Vycm9yRGlzcGxheSdcclxuaW1wb3J0IHsgc25hY2tiYXIgfSBmcm9tICcuL2NvbXBvbmVudHMvc25hY2tiYXInXHJcbmltcG9ydCB7IGRlbGV0ZUNvb2tpZSwgZ2V0Q29va2llLCBzZXRDb29raWUgfSBmcm9tICcuL2Nvb2tpZXMnXHJcbmltcG9ydCB7IGRpc3BsYXksIGZvcm1hdFVwZGF0ZSB9IGZyb20gJy4vZGlzcGxheSdcclxuaW1wb3J0IHsgXyQsIGVsZW1CeUlkLCBzZW5kIH0gZnJvbSAnLi91dGlsJ1xyXG5pbXBvcnQgeyB0b0RhdGVOdW0gfSBmcm9tICcuL2RhdGVzJztcclxuXHJcbmNvbnN0IFBDUl9VUkwgPSAnaHR0cHM6Ly93ZWJhcHBzY2EucGNyc29mdC5jb20nXHJcbmNvbnN0IEFTU0lHTk1FTlRTX1VSTCA9IGAke1BDUl9VUkx9L0NsdWUvU0MtQXNzaWdubWVudHMtRW5kLURhdGUtUmFuZ2UvNzUzNmBcclxuY29uc3QgTE9HSU5fVVJMID0gYCR7UENSX1VSTH0vQ2x1ZS9TQy1TdHVkZW50LVBvcnRhbC1Mb2dpbi1MREFQLzg0NjQ/cmV0dXJuVXJsPSR7ZW5jb2RlVVJJQ29tcG9uZW50KEFTU0lHTk1FTlRTX1VSTCl9YFxyXG5jb25zdCBBVFRBQ0hNRU5UU19VUkwgPSBgJHtQQ1JfVVJMfS9DbHVlL0NvbW1vbi9BdHRhY2htZW50UmVuZGVyLmFzcHhgXHJcbmNvbnN0IEZPUk1fSEVBREVSX09OTFkgPSB7ICdDb250ZW50LXR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyB9XHJcbmNvbnN0IE9ORV9NSU5VVEVfTVMgPSA2MDAwMFxyXG5cclxuY29uc3QgcHJvZ3Jlc3NFbGVtZW50ID0gZWxlbUJ5SWQoJ3Byb2dyZXNzJylcclxuY29uc3QgbG9naW5EaWFsb2cgPSBlbGVtQnlJZCgnbG9naW4nKVxyXG5jb25zdCBsb2dpbkJhY2tncm91bmQgPSBlbGVtQnlJZCgnbG9naW5CYWNrZ3JvdW5kJylcclxuY29uc3QgbGFzdFVwZGF0ZUVsID0gZWxlbUJ5SWQoJ2xhc3RVcGRhdGUnKVxyXG5jb25zdCB1c2VybmFtZUVsID0gZWxlbUJ5SWQoJ3VzZXJuYW1lJykgYXMgSFRNTElucHV0RWxlbWVudFxyXG5jb25zdCBwYXNzd29yZEVsID0gZWxlbUJ5SWQoJ3Bhc3N3b3JkJykgYXMgSFRNTElucHV0RWxlbWVudFxyXG5jb25zdCByZW1lbWJlckNoZWNrID0gZWxlbUJ5SWQoJ3JlbWVtYmVyJykgYXMgSFRNTElucHV0RWxlbWVudFxyXG5jb25zdCBpbmNvcnJlY3RMb2dpbkVsID0gZWxlbUJ5SWQoJ2xvZ2luSW5jb3JyZWN0JylcclxuXHJcbi8vIFRPRE8ga2VlcGluZyB0aGVzZSBhcyBhIGdsb2JhbCB2YXJzIGlzIGJhZFxyXG5jb25zdCBsb2dpbkhlYWRlcnM6IHtbaGVhZGVyOiBzdHJpbmddOiBzdHJpbmd9ID0ge31cclxuY29uc3Qgdmlld0RhdGE6IHtbaGFkZXI6IHN0cmluZ106IHN0cmluZ30gPSB7fVxyXG5sZXQgbGFzdFVwZGF0ZSA9IDAgLy8gVGhlIGxhc3QgdGltZSBldmVyeXRoaW5nIHdhcyB1cGRhdGVkXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElBcHBsaWNhdGlvbkRhdGEge1xyXG4gICAgY2xhc3Nlczogc3RyaW5nW11cclxuICAgIGFzc2lnbm1lbnRzOiBJQXNzaWdubWVudFtdXHJcbiAgICBtb250aFZpZXc6IGJvb2xlYW5cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJQXNzaWdubWVudCB7XHJcbiAgICBzdGFydDogbnVtYmVyXHJcbiAgICBlbmQ6IG51bWJlcnwnRm9yZXZlcidcclxuICAgIGF0dGFjaG1lbnRzOiBBdHRhY2htZW50QXJyYXlbXVxyXG4gICAgYm9keTogc3RyaW5nXHJcbiAgICB0eXBlOiBzdHJpbmdcclxuICAgIGJhc2VUeXBlOiBzdHJpbmdcclxuICAgIGNsYXNzOiBudW1iZXJ8bnVsbCxcclxuICAgIHRpdGxlOiBzdHJpbmdcclxuICAgIGlkOiBzdHJpbmdcclxufVxyXG5cclxuZXhwb3J0IHR5cGUgQXR0YWNobWVudEFycmF5ID0gW3N0cmluZywgc3RyaW5nXVxyXG5cclxuLy8gVGhpcyBpcyB0aGUgZnVuY3Rpb24gdGhhdCByZXRyaWV2ZXMgeW91ciBhc3NpZ25tZW50cyBmcm9tIFBDUi5cclxuLy9cclxuLy8gRmlyc3QsIGEgcmVxdWVzdCBpcyBzZW50IHRvIFBDUiB0byBsb2FkIHRoZSBwYWdlIHlvdSB3b3VsZCBub3JtYWxseSBzZWUgd2hlbiBhY2Nlc3NpbmcgUENSLlxyXG4vL1xyXG4vLyBCZWNhdXNlIHRoaXMgaXMgcnVuIGFzIGEgY2hyb21lIGV4dGVuc2lvbiwgdGhpcyBwYWdlIGNhbiBiZSBhY2Nlc3NlZC4gT3RoZXJ3aXNlLCB0aGUgYnJvd3NlclxyXG4vLyB3b3VsZCB0aHJvdyBhbiBlcnJvciBmb3Igc2VjdXJpdHkgcmVhc29ucyAoeW91IGRvbid0IHdhbnQgYSByYW5kb20gd2Vic2l0ZSBiZWluZyBhYmxlIHRvIGFjY2Vzc1xyXG4vLyBjb25maWRlbnRpYWwgZGF0YSBmcm9tIGEgd2Vic2l0ZSB5b3UgaGF2ZSBsb2dnZWQgaW50bykuXHJcblxyXG4vKipcclxuICogRmV0Y2hlcyBkYXRhIGZyb20gUENSIGFuZCBpZiB0aGUgdXNlciBpcyBsb2dnZWQgaW4gcGFyc2VzIGFuZCBkaXNwbGF5cyBpdFxyXG4gKiBAcGFyYW0gb3ZlcnJpZGUgV2hldGhlciB0byBmb3JjZSBhbiB1cGRhdGUgZXZlbiB0aGVyZSB3YXMgb25lIHJlY2VudGx5XHJcbiAqIEBwYXJhbSBkYXRhICBPcHRpb25hbCBkYXRhIHRvIGJlIHBvc3RlZCB0byBQQ1JcclxuICovXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmZXRjaChvdmVycmlkZTogYm9vbGVhbiA9IGZhbHNlLCBkYXRhPzogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICBpZiAoIW92ZXJyaWRlICYmIERhdGUubm93KCkgLSBsYXN0VXBkYXRlIDwgT05FX01JTlVURV9NUykgcmV0dXJuXHJcbiAgICBsYXN0VXBkYXRlID0gRGF0ZS5ub3coKVxyXG5cclxuICAgIGNvbnN0IGhlYWRlcnMgPSBkYXRhID8gRk9STV9IRUFERVJfT05MWSA6IHVuZGVmaW5lZFxyXG4gICAgY29uc29sZS50aW1lKCdGZXRjaGluZyBhc3NpZ25tZW50cycpXHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHJlc3AgPSBhd2FpdCBzZW5kKEFTU0lHTk1FTlRTX1VSTCwgJ2RvY3VtZW50JywgaGVhZGVycywgZGF0YSwgcHJvZ3Jlc3NFbGVtZW50KVxyXG4gICAgICAgIGNvbnNvbGUudGltZUVuZCgnRmV0Y2hpbmcgYXNzaWdubWVudHMnKVxyXG4gICAgICAgIGlmIChyZXNwLnJlc3BvbnNlVVJMLmluZGV4T2YoJ0xvZ2luJykgIT09IC0xKSB7XHJcbiAgICAgICAgICAgIC8vIFdlIGhhdmUgdG8gbG9nIGluIG5vd1xyXG4gICAgICAgICAgICAocmVzcC5yZXNwb25zZSBhcyBIVE1MRG9jdW1lbnQpLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdpbnB1dCcpLmZvckVhY2goKGUpID0+IHtcclxuICAgICAgICAgICAgICAgIGxvZ2luSGVhZGVyc1tlLm5hbWVdID0gZS52YWx1ZSB8fCAnJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnTmVlZCB0byBsb2cgaW4nKVxyXG4gICAgICAgICAgICBjb25zdCB1cCA9IGdldENvb2tpZSgndXNlclBhc3MnKSAvLyBBdHRlbXB0cyB0byBnZXQgdGhlIGNvb2tpZSAqdXNlclBhc3MqLCB3aGljaCBpcyBzZXQgaWYgdGhlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFwiUmVtZW1iZXIgbWVcIiBjaGVja2JveCBpcyBjaGVja2VkIHdoZW4gbG9nZ2luZyBpbiB0aHJvdWdoIENoZWNrUENSXHJcbiAgICAgICAgICAgIGlmICh1cCA9PT0gJycpIHtcclxuICAgICAgICAgICAgICAgIGxvZ2luQmFja2dyb3VuZC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xyXG4gICAgICAgICAgICAgICAgbG9naW5EaWFsb2cuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIEJlY2F1c2Ugd2Ugd2VyZSByZW1lbWJlcmVkLCB3ZSBjYW4gbG9nIGluIGltbWVkaWF0ZWx5IHdpdGhvdXQgd2FpdGluZyBmb3IgdGhlXHJcbiAgICAgICAgICAgICAgICAvLyB1c2VyIHRvIGxvZyBpbiB0aHJvdWdoIHRoZSBsb2dpbiBmb3JtXHJcbiAgICAgICAgICAgICAgICBkb2xvZ2luKHdpbmRvdy5hdG9iKHVwKS5zcGxpdCgnOicpIGFzIFtzdHJpbmcsIHN0cmluZ10pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBMb2dnZWQgaW4gbm93XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdGZXRjaGluZyBhc3NpZ25tZW50cyBzdWNjZXNzZnVsJylcclxuICAgICAgICAgICAgY29uc3QgdCA9IERhdGUubm93KClcclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLmxhc3RVcGRhdGUgPSB0XHJcbiAgICAgICAgICAgIGxhc3RVcGRhdGVFbC5pbm5lckhUTUwgPSBmb3JtYXRVcGRhdGUodClcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIHBhcnNlKHJlc3AucmVzcG9uc2UpXHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcilcclxuICAgICAgICAgICAgICAgIGRpc3BsYXlFcnJvcihlcnJvcilcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ0NvdWxkIG5vdCBmZXRjaCBhc3NpZ25tZW50czsgWW91IGFyZSBwcm9iYWJseSBvZmZsaW5lLiBIZXJlXFwncyB0aGUgZXJyb3I6JywgZXJyb3IpXHJcbiAgICAgICAgc25hY2tiYXIoJ0NvdWxkIG5vdCBmZXRjaCB5b3VyIGFzc2lnbm1lbnRzJywgJ1JldHJ5JywgKCkgPT4gZmV0Y2godHJ1ZSkpXHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBMb2dzIHRoZSB1c2VyIGludG8gUENSXHJcbiAqIEBwYXJhbSB2YWwgICBBbiBvcHRpb25hbCBsZW5ndGgtMiBhcnJheSBvZiB0aGUgZm9ybSBbdXNlcm5hbWUsIHBhc3N3b3JkXSB0byB1c2UgdGhlIHVzZXIgaW4gd2l0aC5cclxuICogICAgICAgICAgICAgIElmIHRoaXMgYXJyYXkgaXMgbm90IGdpdmVuIHRoZSBsb2dpbiBkaWFsb2cgaW5wdXRzIHdpbGwgYmUgdXNlZC5cclxuICogQHBhcmFtIHN1Ym1pdEV2dCBXaGV0aGVyIHRvIG92ZXJyaWRlIHRoZSB1c2VybmFtZSBhbmQgcGFzc3dvcmQgc3VwcGxlaWQgaW4gdmFsIHdpdGggdGhlIHZhbHVlcyBvZiB0aGUgaW5wdXQgZWxlbWVudHNcclxuICovXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkb2xvZ2luKHZhbD86IFtzdHJpbmcsIHN0cmluZ118bnVsbCwgc3VibWl0RXZ0OiBib29sZWFuID0gZmFsc2UpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIGxvZ2luRGlhbG9nLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IGxvZ2luQmFja2dyb3VuZC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnLCAzNTApXHJcblxyXG4gICAgY29uc3QgcG9zdEFycmF5OiBzdHJpbmdbXSA9IFtdIC8vIEFycmF5IG9mIGRhdGEgdG8gcG9zdFxyXG4gICAgbG9jYWxTdG9yYWdlLnVzZXJuYW1lID0gdmFsICYmICFzdWJtaXRFdnQgPyB2YWxbMF0gOiB1c2VybmFtZUVsLnZhbHVlXHJcbiAgICB1cGRhdGVBdmF0YXIoKVxyXG4gICAgT2JqZWN0LmtleXMobG9naW5IZWFkZXJzKS5mb3JFYWNoKChoKSA9PiAge1xyXG4gICAgICAgIC8vIExvb3AgdGhyb3VnaCB0aGUgaW5wdXQgZWxlbWVudHMgY29udGFpbmVkIGluIHRoZSBsb2dpbiBwYWdlLiBBcyBtZW50aW9uZWQgYmVmb3JlLCB0aGV5XHJcbiAgICAgICAgLy8gd2lsbCBiZSBzZW50IHRvIFBDUiB0byBsb2cgaW4uXHJcbiAgICAgICAgaWYgKGgudG9Mb3dlckNhc2UoKS5pbmRleE9mKCd1c2VyJykgIT09IC0xKSB7XHJcbiAgICAgICAgICAgIGxvZ2luSGVhZGVyc1toXSA9IHZhbCAmJiAhc3VibWl0RXZ0ID8gdmFsWzBdIDogdXNlcm5hbWVFbC52YWx1ZVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaC50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ3Bhc3MnKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgbG9naW5IZWFkZXJzW2hdID0gdmFsICYmICFzdWJtaXRFdnQgPyB2YWxbMV0gOiBwYXNzd29yZEVsLnZhbHVlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBvc3RBcnJheS5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChoKSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudChsb2dpbkhlYWRlcnNbaF0pKVxyXG4gICAgfSlcclxuXHJcbiAgICAvLyBOb3cgc2VuZCB0aGUgbG9naW4gcmVxdWVzdCB0byBQQ1JcclxuICAgIGNvbnNvbGUudGltZSgnTG9nZ2luZyBpbicpXHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHJlc3AgPSBhd2FpdCBzZW5kKExPR0lOX1VSTCwgJ2RvY3VtZW50JywgRk9STV9IRUFERVJfT05MWSwgcG9zdEFycmF5LmpvaW4oJyYnKSwgcHJvZ3Jlc3NFbGVtZW50KVxyXG4gICAgICAgIGNvbnNvbGUudGltZUVuZCgnTG9nZ2luZyBpbicpXHJcbiAgICAgICAgaWYgKHJlc3AucmVzcG9uc2VVUkwuaW5kZXhPZignTG9naW4nKSAhPT0gLTEpIHtcclxuICAgICAgICAvLyBJZiBQQ1Igc3RpbGwgd2FudHMgdXMgdG8gbG9nIGluLCB0aGVuIHRoZSB1c2VybmFtZSBvciBwYXNzd29yZCBlbnRlcmVkIHdlcmUgaW5jb3JyZWN0LlxyXG4gICAgICAgICAgICBpbmNvcnJlY3RMb2dpbkVsLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXHJcbiAgICAgICAgICAgIHBhc3N3b3JkRWwudmFsdWUgPSAnJ1xyXG5cclxuICAgICAgICAgICAgbG9naW5EaWFsb2cuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuICAgICAgICAgICAgbG9naW5CYWNrZ3JvdW5kLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gT3RoZXJ3aXNlLCB3ZSBhcmUgbG9nZ2VkIGluXHJcbiAgICAgICAgICAgIGlmIChyZW1lbWJlckNoZWNrLmNoZWNrZWQpIHsgLy8gSXMgdGhlIFwicmVtZW1iZXIgbWVcIiBjaGVja2JveCBjaGVja2VkP1xyXG4gICAgICAgICAgICAgICAgLy8gU2V0IGEgY29va2llIHdpdGggdGhlIHVzZXJuYW1lIGFuZCBwYXNzd29yZCBzbyB3ZSBjYW4gbG9nIGluIGF1dG9tYXRpY2FsbHkgaW4gdGhlXHJcbiAgICAgICAgICAgICAgICAvLyBmdXR1cmUgd2l0aG91dCBoYXZpbmcgdG8gcHJvbXB0IGZvciBhIHVzZXJuYW1lIGFuZCBwYXNzd29yZCBhZ2FpblxyXG4gICAgICAgICAgICAgICAgc2V0Q29va2llKCd1c2VyUGFzcycsIHdpbmRvdy5idG9hKHVzZXJuYW1lRWwudmFsdWUgKyAnOicgKyBwYXNzd29yZEVsLnZhbHVlKSwgMTQpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gbG9hZGluZ0Jhci5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCJcclxuICAgICAgICAgICAgY29uc3QgdCA9IERhdGUubm93KClcclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLmxhc3RVcGRhdGUgPSB0XHJcbiAgICAgICAgICAgIGxhc3RVcGRhdGVFbC5pbm5lckhUTUwgPSBmb3JtYXRVcGRhdGUodClcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIHBhcnNlKHJlc3AucmVzcG9uc2UpIC8vIFBhcnNlIHRoZSBkYXRhIFBDUiBoYXMgcmVwbGllZCB3aXRoXHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpXHJcbiAgICAgICAgICAgICAgICBkaXNwbGF5RXJyb3IoZSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgIGNvbnNvbGUubG9nKCdDb3VsZCBub3QgbG9nIGluIHRvIFBDUi4gRWl0aGVyIHlvdXIgbmV0d29yayBjb25uZWN0aW9uIHdhcyBsb3N0IGR1cmluZyB5b3VyIHZpc2l0ICcgK1xyXG4gICAgICAgICAgICAgICAgICAgICAnb3IgUENSIGlzIGp1c3Qgbm90IHdvcmtpbmcuIEhlcmVcXCdzIHRoZSBlcnJvcjonLCBlcnJvcilcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldERhdGEoKTogSUFwcGxpY2F0aW9uRGF0YXx1bmRlZmluZWQge1xyXG4gICAgcmV0dXJuICh3aW5kb3cgYXMgYW55KS5kYXRhXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRDbGFzc2VzKCk6IHN0cmluZ1tdIHtcclxuICAgIGNvbnN0IGRhdGEgPSBnZXREYXRhKClcclxuICAgIGlmICghZGF0YSkgcmV0dXJuIFtdXHJcbiAgICByZXR1cm4gZGF0YS5jbGFzc2VzXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXREYXRhKGRhdGE6IElBcHBsaWNhdGlvbkRhdGEpOiB2b2lkIHtcclxuICAgICh3aW5kb3cgYXMgYW55KS5kYXRhID0gZGF0YVxyXG59XHJcblxyXG4vLyBJbiBQQ1IncyBpbnRlcmZhY2UsIHlvdSBjYW4gY2xpY2sgYSBkYXRlIGluIG1vbnRoIG9yIHdlZWsgdmlldyB0byBzZWUgaXQgaW4gZGF5IHZpZXcuXHJcbi8vIFRoZXJlZm9yZSwgdGhlIEhUTUwgZWxlbWVudCB0aGF0IHNob3dzIHRoZSBkYXRlIHRoYXQgeW91IGNhbiBjbGljayBvbiBoYXMgYSBoeXBlcmxpbmsgdGhhdCBsb29rcyBsaWtlIGAjMjAxNS0wNC0yNmAuXHJcbi8vIFRoZSBmdW5jdGlvbiBiZWxvdyB3aWxsIHBhcnNlIHRoYXQgU3RyaW5nIGFuZCByZXR1cm4gYSBEYXRlIHRpbWVzdGFtcFxyXG5mdW5jdGlvbiBwYXJzZURhdGVIYXNoKGVsZW1lbnQ6IEhUTUxBbmNob3JFbGVtZW50KTogbnVtYmVyIHtcclxuICAgIGNvbnN0IFt5ZWFyLCBtb250aCwgZGF5XSA9IGVsZW1lbnQuaGFzaC5zdWJzdHJpbmcoMSkuc3BsaXQoJy0nKS5tYXAoTnVtYmVyKVxyXG4gICAgcmV0dXJuIChuZXcgRGF0ZSh5ZWFyLCBtb250aCAtIDEsIGRheSkpLmdldFRpbWUoKVxyXG59XHJcblxyXG4vLyBUaGUgKmF0dGFjaG1lbnRpZnkqIGZ1bmN0aW9uIHBhcnNlcyB0aGUgYm9keSBvZiBhbiBhc3NpZ25tZW50ICgqdGV4dCopIGFuZCByZXR1cm5zIHRoZSBhc3NpZ25tZW50J3MgYXR0YWNobWVudHMuXHJcbmZ1bmN0aW9uIGF0dGFjaG1lbnRpZnkoZWxlbWVudDogSFRNTEVsZW1lbnQpOiBBdHRhY2htZW50QXJyYXlbXSB7XHJcbiAgICBjb25zdCBhdHRhY2htZW50czogQXR0YWNobWVudEFycmF5W10gPSBbXVxyXG5cclxuICAgIC8vIEdldCBhbGwgbGlua3NcclxuICAgIGNvbnN0IGFzID0gQXJyYXkuZnJvbShlbGVtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdhJykpXHJcbiAgICBhcy5mb3JFYWNoKChhKSA9PiB7XHJcbiAgICAgICAgaWYgKGEuaWQuaW5jbHVkZXMoJ0F0dGFjaG1lbnQnKSkge1xyXG4gICAgICAgICAgICBhdHRhY2htZW50cy5wdXNoKFtcclxuICAgICAgICAgICAgICAgIGEuaW5uZXJIVE1MLFxyXG4gICAgICAgICAgICAgICAgYS5zZWFyY2ggKyBhLmhhc2hcclxuICAgICAgICAgICAgXSlcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICAgcmV0dXJuIGF0dGFjaG1lbnRzXHJcbn1cclxuXHJcbi8vIFRoaXMgZnVuY3Rpb24gcmVwbGFjZXMgdGV4dCB0aGF0IHJlcHJlc2VudHMgYSBoeXBlcmxpbmsgd2l0aCBhIGZ1bmN0aW9uYWwgaHlwZXJsaW5rIGJ5IHVzaW5nXHJcbi8vIGphdmFzY3JpcHQncyByZXBsYWNlIGZ1bmN0aW9uIHdpdGggYSByZWd1bGFyIGV4cHJlc3Npb24gaWYgdGhlIHRleHQgYWxyZWFkeSBpc24ndCBwYXJ0IG9mIGFcclxuLy8gaHlwZXJsaW5rLlxyXG5mdW5jdGlvbiB1cmxpZnkodGV4dDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0ZXh0LnJlcGxhY2UobmV3IFJlZ0V4cChgKFxcXHJcbiAgICAgICAgaHR0cHM/OlxcXFwvXFxcXC9cXFxyXG4gICAgICAgIFstQS1aMC05KyZAI1xcXFwvJT89fl98ITosLjtdKlxcXHJcbiAgICAgICAgWy1BLVowLTkrJkAjXFxcXC8lPX5ffF0rXFxcclxuICAgICAgICApYCwgJ2lnJ1xyXG4gICAgKSwgKHN0ciwgc3RyMiwgb2Zmc2V0KSA9PiB7IC8vIEZ1bmN0aW9uIHRvIHJlcGxhY2UgbWF0Y2hlc1xyXG4gICAgICAgIGlmICgvaHJlZlxccyo9XFxzKi4vLnRlc3QodGV4dC5zdWJzdHJpbmcob2Zmc2V0IC0gMTAsIG9mZnNldCkpIHx8XHJcbiAgICAgICAgICAgIC9vcmlnaW5hbHBhdGhcXHMqPVxccyouLy50ZXN0KHRleHQuc3Vic3RyaW5nKG9mZnNldCAtIDIwLCBvZmZzZXQpKVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICByZXR1cm4gc3RyXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGA8YSBocmVmPVwiJHtzdHJ9XCI+JHtzdHJ9PC9hPmBcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59XHJcblxyXG4vLyBBbHNvLCBQQ1JcInMgaW50ZXJmYWNlIHVzZXMgYSBzeXN0ZW0gb2YgSURzIHRvIGlkZW50aWZ5IGRpZmZlcmVudCBlbGVtZW50cy4gRm9yIGV4YW1wbGUsIHRoZSBJRCBvZlxyXG4vLyBvbmUgb2YgdGhlIGJveGVzIHNob3dpbmcgdGhlIG5hbWUgb2YgYW4gYXNzaWdubWVudCBjb3VsZCBiZVxyXG4vLyBgY3RsMDBfY3RsMDBfYmFzZUNvbnRlbnRfYmFzZUNvbnRlbnRfZmxhc2hUb3BfY3RsMDBfUmFkU2NoZWR1bGVyMV85NV8wYC4gVGhlIGZ1bmN0aW9uIGJlbG93IHdpbGxcclxuLy8gcmV0dXJuIHRoZSBmaXJzdCBIVE1MIGVsZW1lbnQgd2hvc2UgSUQgY29udGFpbnMgYSBzcGVjaWZpZWQgU3RyaW5nICgqaWQqKSBhbmQgY29udGFpbmluZyBhXHJcbi8vIHNwZWNpZmllZCB0YWcgKCp0YWcqKS5cclxuZnVuY3Rpb24gZmluZElkKGVsZW1lbnQ6IEhUTUxFbGVtZW50fEhUTUxEb2N1bWVudCwgdGFnOiBzdHJpbmcsIGlkOiBzdHJpbmcpOiBIVE1MRWxlbWVudCB7XHJcbiAgICBjb25zdCBlbCA9IFsuLi5lbGVtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKHRhZyldLmZpbmQoKGUpID0+IGUuaWQuaW5jbHVkZXMoaWQpKVxyXG4gICAgaWYgKCFlbCkgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCBlbGVtZW50IHdpdGggdGFnICR7dGFnfSBhbmQgaWQgJHtpZH0gaW4gJHtlbGVtZW50fWApXHJcbiAgICByZXR1cm4gZWwgYXMgSFRNTEVsZW1lbnRcclxufVxyXG5cclxuZnVuY3Rpb24gcGFyc2VBc3NpZ25tZW50VHlwZSh0eXBlOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHR5cGUudG9Mb3dlckNhc2UoKS5yZXBsYWNlKCcmIHF1aXp6ZXMnLCAnJykucmVwbGFjZSgndGVzdHMnLCAndGVzdCcpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBhcnNlQXNzaWdubWVudEJhc2VUeXBlKHR5cGU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdHlwZS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoJyYgcXVpenplcycsICcnKS5yZXBsYWNlKC9cXHMvZywgJycpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBhcnNlQXNzaWdubWVudChjYTogSFRNTEVsZW1lbnQpOiBJQXNzaWdubWVudCB7XHJcbiAgICBjb25zdCBkYXRhID0gZ2V0RGF0YSgpXHJcbiAgICBpZiAoIWRhdGEpIHRocm93IG5ldyBFcnJvcignRGF0YSBkaWN0aW9uYXJ5IG5vdCBzZXQgdXAnKVxyXG5cclxuICAgIC8vIFRoZSBzdGFydGluZyBkYXRlIGFuZCBlbmRpbmcgZGF0ZSBvZiB0aGUgYXNzaWdubWVudCBhcmUgcGFyc2VkIGZpcnN0XHJcbiAgICBjb25zdCByYW5nZSA9IGZpbmRJZChjYSwgJ3NwYW4nLCAnU3RhcnRpbmdPbicpLmlubmVySFRNTC5zcGxpdCgnIC0gJylcclxuICAgIGNvbnN0IGFzc2lnbm1lbnRTdGFydCA9IHRvRGF0ZU51bShEYXRlLnBhcnNlKHJhbmdlWzBdKSlcclxuICAgIGNvbnN0IGFzc2lnbm1lbnRFbmQgPSAocmFuZ2VbMV0gIT0gbnVsbCkgPyB0b0RhdGVOdW0oRGF0ZS5wYXJzZShyYW5nZVsxXSkpIDogYXNzaWdubWVudFN0YXJ0XHJcblxyXG4gICAgLy8gVGhlbiwgdGhlIG5hbWUgb2YgdGhlIGFzc2lnbm1lbnQgaXMgcGFyc2VkXHJcbiAgICBjb25zdCB0ID0gZmluZElkKGNhLCAnc3BhbicsICdsYmxUaXRsZScpXHJcbiAgICBsZXQgdGl0bGUgPSB0LmlubmVySFRNTFxyXG5cclxuICAgIC8vIFRoZSBhY3R1YWwgYm9keSBvZiB0aGUgYXNzaWdubWVudCBhbmQgaXRzIGF0dGFjaG1lbnRzIGFyZSBwYXJzZWQgbmV4dFxyXG4gICAgY29uc3QgYiA9IF8kKF8kKHQucGFyZW50Tm9kZSkucGFyZW50Tm9kZSkgYXMgSFRNTEVsZW1lbnRcclxuICAgIGNvbnN0IGRpdnMgPSBbLi4uYi5nZXRFbGVtZW50c0J5VGFnTmFtZSgnZGl2JyldLnNwbGljZSgwLCAyKVxyXG5cclxuICAgIGNvbnN0IGFwID0gYXR0YWNobWVudGlmeShiKSAvLyBTZXBhcmF0ZXMgYXR0YWNobWVudHMgZnJvbSB0aGUgYm9keVxyXG5cclxuICAgIC8vIFRoZSBsYXN0IFJlcGxhY2UgcmVtb3ZlcyBsZWFkaW5nIGFuZCB0cmFpbGluZyBuZXdsaW5lc1xyXG4gICAgY29uc3QgYXNzaWdubWVudEJvZHkgPSB1cmxpZnkoYi5pbm5lckhUTUwpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXig/Olxccyo8YnJcXHMqXFwvPz4pKi8sICcnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLyg/Olxccyo8YnJcXHMqXFwvPz4pKlxccyokLywgJycpLnRyaW0oKVxyXG5cclxuICAgIC8vIEZpbmFsbHksIHdlIHNlcGFyYXRlIHRoZSBjbGFzcyBuYW1lIGFuZCB0eXBlIChob21ld29yaywgY2xhc3N3b3JrLCBvciBwcm9qZWN0cykgZnJvbSB0aGUgdGl0bGUgb2YgdGhlIGFzc2lnbm1lbnRcclxuICAgIGNvbnN0IG1hdGNoZWRUaXRsZSA9IHRpdGxlLm1hdGNoKC9cXCgoW14pXSpcXCkqKVxcKSQvKVxyXG4gICAgaWYgKChtYXRjaGVkVGl0bGUgPT0gbnVsbCkpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBwYXJzZSBhc3NpZ25tZW50IHRpdGxlIFxcXCIke3RpdGxlfVxcXCJgKVxyXG4gICAgfVxyXG4gICAgY29uc3QgYXNzaWdubWVudFR5cGUgPSBtYXRjaGVkVGl0bGVbMV1cclxuICAgIGNvbnN0IGFzc2lnbm1lbnRCYXNlVHlwZSA9IHBhcnNlQXNzaWdubWVudEJhc2VUeXBlKGNhLnRpdGxlLnN1YnN0cmluZygwLCBjYS50aXRsZS5pbmRleE9mKCdcXG4nKSkpXHJcbiAgICBsZXQgYXNzaWdubWVudENsYXNzSW5kZXggPSBudWxsXHJcbiAgICBkYXRhLmNsYXNzZXMuc29tZSgoYywgcG9zKSA9PiB7XHJcbiAgICAgICAgaWYgKHRpdGxlLmluZGV4T2YoYykgIT09IC0xKSB7XHJcbiAgICAgICAgICAgIGFzc2lnbm1lbnRDbGFzc0luZGV4ID0gcG9zXHJcbiAgICAgICAgICAgIHRpdGxlID0gdGl0bGUucmVwbGFjZShjLCAnJylcclxuICAgICAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICB9KVxyXG5cclxuICAgIGlmIChhc3NpZ25tZW50Q2xhc3NJbmRleCA9PT0gbnVsbCB8fCBhc3NpZ25tZW50Q2xhc3NJbmRleCA9PT0gLTEpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBmaW5kIGNsYXNzIGluIHRpdGxlICR7dGl0bGV9IChjbGFzc2VzIGFyZSAke2RhdGEuY2xhc3Nlc31gKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGFzc2lnbm1lbnRUaXRsZSA9IHRpdGxlLnN1YnN0cmluZyh0aXRsZS5pbmRleE9mKCc6ICcpICsgMikucmVwbGFjZSgvXFwoW15cXChcXCldKlxcKSQvLCAnJykudHJpbSgpXHJcblxyXG4gICAgLy8gVG8gbWFrZSBzdXJlIHRoZXJlIGFyZSBubyByZXBlYXRzLCB0aGUgdGl0bGUgb2YgdGhlIGFzc2lnbm1lbnQgKG9ubHkgbGV0dGVycykgYW5kIGl0cyBzdGFydCAmXHJcbiAgICAvLyBlbmQgZGF0ZSBhcmUgY29tYmluZWQgdG8gZ2l2ZSBpdCBhIHVuaXF1ZSBpZGVudGlmaWVyLlxyXG4gICAgY29uc3QgYXNzaWdubWVudElkID0gYXNzaWdubWVudFRpdGxlLnJlcGxhY2UoL1teXFx3XSovZywgJycpICsgKGFzc2lnbm1lbnRTdGFydCArIGFzc2lnbm1lbnRFbmQpXHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBzdGFydDogYXNzaWdubWVudFN0YXJ0LFxyXG4gICAgICAgIGVuZDogYXNzaWdubWVudEVuZCxcclxuICAgICAgICBhdHRhY2htZW50czogYXAsXHJcbiAgICAgICAgYm9keTogYXNzaWdubWVudEJvZHksXHJcbiAgICAgICAgdHlwZTogYXNzaWdubWVudFR5cGUsXHJcbiAgICAgICAgYmFzZVR5cGU6IGFzc2lnbm1lbnRCYXNlVHlwZSxcclxuICAgICAgICBjbGFzczogYXNzaWdubWVudENsYXNzSW5kZXgsXHJcbiAgICAgICAgdGl0bGU6IGFzc2lnbm1lbnRUaXRsZSxcclxuICAgICAgICBpZDogYXNzaWdubWVudElkXHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIFRoZSBmdW5jdGlvbiBiZWxvdyB3aWxsIHBhcnNlIHRoZSBkYXRhIGdpdmVuIGJ5IFBDUiBhbmQgY29udmVydCBpdCBpbnRvIGFuIG9iamVjdC4gSWYgeW91IG9wZW4gdXBcclxuLy8gdGhlIGRldmVsb3BlciBjb25zb2xlIG9uIENoZWNrUENSIGFuZCB0eXBlIGluIGBkYXRhYCwgeW91IGNhbiBzZWUgdGhlIGFycmF5IGNvbnRhaW5pbmcgYWxsIG9mXHJcbi8vIHlvdXIgYXNzaWdubWVudHMuXHJcbmZ1bmN0aW9uIHBhcnNlKGRvYzogSFRNTERvY3VtZW50KTogdm9pZCB7XHJcbiAgICBjb25zb2xlLnRpbWUoJ0hhbmRsaW5nIGRhdGEnKSAvLyBUbyB0aW1lIGhvdyBsb25nIGl0IHRha2VzIHRvIHBhcnNlIHRoZSBhc3NpZ25tZW50c1xyXG4gICAgY29uc3QgaGFuZGxlZERhdGFTaG9ydDogc3RyaW5nW10gPSBbXSAvLyBBcnJheSB1c2VkIHRvIG1ha2Ugc3VyZSB3ZSBkb25cInQgcGFyc2UgdGhlIHNhbWUgYXNzaWdubWVudCB0d2ljZS5cclxuICAgIGNvbnN0IGRhdGE6IElBcHBsaWNhdGlvbkRhdGEgPSB7XHJcbiAgICAgICAgY2xhc3NlczogW10sXHJcbiAgICAgICAgYXNzaWdubWVudHM6IFtdLFxyXG4gICAgICAgIG1vbnRoVmlldzogKF8kKGRvYy5xdWVyeVNlbGVjdG9yKCcucnNIZWFkZXJNb250aCcpKS5wYXJlbnROb2RlIGFzIEhUTUxFbGVtZW50KS5jbGFzc0xpc3QuY29udGFpbnMoJ3JzU2VsZWN0ZWQnKVxyXG4gICAgfSAvLyBSZXNldCB0aGUgYXJyYXkgaW4gd2hpY2ggYWxsIG9mIHlvdXIgYXNzaWdubWVudHMgYXJlIHN0b3JlZCBpbi5cclxuICAgIHNldERhdGEoZGF0YSlcclxuXHJcbiAgICBkb2MucXVlcnlTZWxlY3RvckFsbCgnaW5wdXQ6bm90KFt0eXBlPVwic3VibWl0XCJdKScpLmZvckVhY2goKGUpID0+IHtcclxuICAgICAgICB2aWV3RGF0YVsoZSBhcyBIVE1MSW5wdXRFbGVtZW50KS5uYW1lXSA9IChlIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlIHx8ICcnXHJcbiAgICB9KVxyXG5cclxuICAgIC8vIE5vdywgdGhlIGNsYXNzZXMgeW91IHRha2UgYXJlIHBhcnNlZCAodGhlc2UgYXJlIHRoZSBjaGVja2JveGVzIHlvdSBzZWUgdXAgdG9wIHdoZW4gbG9va2luZyBhdCBQQ1IpLlxyXG4gICAgY29uc3QgY2xhc3NlcyA9IGZpbmRJZChkb2MsICd0YWJsZScsICdjYkNsYXNzZXMnKS5nZXRFbGVtZW50c0J5VGFnTmFtZSgnbGFiZWwnKVxyXG4gICAgY2xhc3Nlcy5mb3JFYWNoKChjKSA9PiB7XHJcbiAgICAgICAgZGF0YS5jbGFzc2VzLnB1c2goYy5pbm5lckhUTUwpXHJcbiAgICB9KVxyXG5cclxuICAgIGNvbnN0IGFzc2lnbm1lbnRzID0gZG9jLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3JzQXB0IHJzQXB0U2ltcGxlJylcclxuICAgIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwoYXNzaWdubWVudHMsIChhc3NpZ25tZW50RWw6IEhUTUxFbGVtZW50KSA9PiB7XHJcbiAgICAgICAgY29uc3QgYXNzaWdubWVudCA9IHBhcnNlQXNzaWdubWVudChhc3NpZ25tZW50RWwpXHJcbiAgICAgICAgaWYgKGhhbmRsZWREYXRhU2hvcnQuaW5kZXhPZihhc3NpZ25tZW50LmlkKSA9PT0gLTEpIHsgLy8gTWFrZSBzdXJlIHdlIGhhdmVuJ3QgYWxyZWFkeSBwYXJzZWQgdGhlIGFzc2lnbm1lbnRcclxuICAgICAgICAgICAgaGFuZGxlZERhdGFTaG9ydC5wdXNoKGFzc2lnbm1lbnQuaWQpXHJcbiAgICAgICAgICAgIGRhdGEuYXNzaWdubWVudHMucHVzaChhc3NpZ25tZW50KVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcblxyXG4gICAgY29uc29sZS50aW1lRW5kKCdIYW5kbGluZyBkYXRhJylcclxuXHJcbiAgICAvLyBOb3cgYWxsb3cgdGhlIHZpZXcgdG8gYmUgc3dpdGNoZWRcclxuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnbG9hZGVkJylcclxuXHJcbiAgICBkaXNwbGF5KCkgLy8gRGlzcGxheSB0aGUgZGF0YVxyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2RhdGEnLCBKU09OLnN0cmluZ2lmeShnZXREYXRhKCkpKSAvLyBTdG9yZSBmb3Igb2ZmbGluZSB1c2VcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVybEZvckF0dGFjaG1lbnQoc2VhcmNoOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIEFUVEFDSE1FTlRTX1VSTCArIHNlYXJjaFxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0QXR0YWNobWVudE1pbWVUeXBlKHNlYXJjaDogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgY29uc3QgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KClcclxuICAgICAgICByZXEub3BlbignSEVBRCcsIHVybEZvckF0dGFjaG1lbnQoc2VhcmNoKSlcclxuICAgICAgICByZXEub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAocmVxLnN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0eXBlID0gcmVxLmdldFJlc3BvbnNlSGVhZGVyKCdDb250ZW50LVR5cGUnKVxyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHR5cGUpXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoJ0NvbnRlbnQgdHlwZSBpcyBudWxsJykpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmVxLnNlbmQoKVxyXG4gICAgfSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNsYXNzQnlJZChpZDogbnVtYmVyfG51bGx8dW5kZWZpbmVkKTogc3RyaW5nIHtcclxuICAgIHJldHVybiAoaWQgPyBnZXRDbGFzc2VzKClbaWRdIDogbnVsbCkgfHwgJ1Vua25vd24gY2xhc3MnXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzd2l0Y2hWaWV3cygpOiB2b2lkIHtcclxuICAgIGlmIChPYmplY3Qua2V5cyh2aWV3RGF0YSkubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGVsZW1CeUlkKCdzaWRlQmFja2dyb3VuZCcpLmNsaWNrKClcclxuICAgICAgICB2aWV3RGF0YS5fX0VWRU5UVEFSR0VUID0gJ2N0bDAwJGN0bDAwJGJhc2VDb250ZW50JGJhc2VDb250ZW50JGZsYXNoVG9wJGN0bDAwJFJhZFNjaGVkdWxlcjEnXHJcbiAgICAgICAgdmlld0RhdGEuX19FVkVOVEFSR1VNRU5UID0gSlNPTi5zdHJpbmdpZnkoe1xyXG4gICAgICAgICAgICBDb21tYW5kOiBgU3dpdGNoVG8ke2RvY3VtZW50LmJvZHkuZ2V0QXR0cmlidXRlKCdkYXRhLXBjcnZpZXcnKSA9PT0gJ21vbnRoJyA/ICdXZWVrJyA6ICdNb250aCd9Vmlld2BcclxuICAgICAgICB9KVxyXG4gICAgICAgIHZpZXdEYXRhLmN0bDAwX2N0bDAwX2Jhc2VDb250ZW50X2Jhc2VDb250ZW50X2ZsYXNoVG9wX2N0bDAwX1JhZFNjaGVkdWxlcjFfQ2xpZW50U3RhdGUgPVxyXG4gICAgICAgICAgICBKU09OLnN0cmluZ2lmeSh7c2Nyb2xsVG9wOiAwLCBzY3JvbGxMZWZ0OiAwLCBpc0RpcnR5OiBmYWxzZX0pXHJcbiAgICAgICAgdmlld0RhdGEuY3RsMDBfY3RsMDBfUmFkU2NyaXB0TWFuYWdlcjFfVFNNID0gJzs7U3lzdGVtLldlYi5FeHRlbnNpb25zLCBWZXJzaW9uPTQuMC4wLjAsIEN1bHR1cmU9bmV1dHJhbCwgJyArXHJcbiAgICAgICAgICAgICdQdWJsaWNLZXlUb2tlbj0zMWJmMzg1NmFkMzY0ZTM1OmVuLVVTOmQyODU2OGQzLWU1M2UtNDcwNi05MjhmLTM3NjU5MTJiNjZjYTplYTU5N2Q0YjpiMjUzNzhkMidcclxuICAgICAgICBjb25zdCBwb3N0QXJyYXk6IHN0cmluZ1tdID0gW10gLy8gQXJyYXkgb2YgZGF0YSB0byBwb3N0XHJcbiAgICAgICAgT2JqZWN0LmVudHJpZXModmlld0RhdGEpLmZvckVhY2goKFtoLCB2XSkgPT4ge1xyXG4gICAgICAgICAgICBwb3N0QXJyYXkucHVzaChlbmNvZGVVUklDb21wb25lbnQoaCkgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQodikpXHJcbiAgICAgICAgfSlcclxuICAgICAgICBmZXRjaCh0cnVlLCBwb3N0QXJyYXkuam9pbignJicpKVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbG9nb3V0KCk6IHZvaWQge1xyXG4gICAgaWYgKE9iamVjdC5rZXlzKHZpZXdEYXRhKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgZGVsZXRlQ29va2llKCd1c2VyUGFzcycpXHJcbiAgICAgICAgZWxlbUJ5SWQoJ3NpZGVCYWNrZ3JvdW5kJykuY2xpY2soKVxyXG4gICAgICAgIHZpZXdEYXRhLl9fRVZFTlRUQVJHRVQgPSAnY3RsMDAkY3RsMDAkYmFzZUNvbnRlbnQkTG9nb3V0Q29udHJvbDEkTG9naW5TdGF0dXMxJGN0bDAwJ1xyXG4gICAgICAgIHZpZXdEYXRhLl9fRVZFTlRBUkdVTUVOVCA9ICcnXHJcbiAgICAgICAgdmlld0RhdGEuY3RsMDBfY3RsMDBfYmFzZUNvbnRlbnRfYmFzZUNvbnRlbnRfZmxhc2hUb3BfY3RsMDBfUmFkU2NoZWR1bGVyMV9DbGllbnRTdGF0ZSA9XHJcbiAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHtzY3JvbGxUb3A6IDAsIHNjcm9sbExlZnQ6IDAsIGlzRGlydHk6IGZhbHNlfSlcclxuICAgICAgICBjb25zdCBwb3N0QXJyYXk6IHN0cmluZ1tdID0gW10gLy8gQXJyYXkgb2YgZGF0YSB0byBwb3N0XHJcbiAgICAgICAgT2JqZWN0LmVudHJpZXModmlld0RhdGEpLmZvckVhY2goKFtoLCB2XSkgPT4ge1xyXG4gICAgICAgICAgICBwb3N0QXJyYXkucHVzaChlbmNvZGVVUklDb21wb25lbnQoaCkgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQodikpXHJcbiAgICAgICAgfSlcclxuICAgICAgICBmZXRjaCh0cnVlLCBwb3N0QXJyYXkuam9pbignJicpKVxyXG4gICAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgYWRkQWN0aXZpdHlFbGVtZW50LCBjcmVhdGVBY3Rpdml0eSB9IGZyb20gJy4uL2NvbXBvbmVudHMvYWN0aXZpdHknXHJcbmltcG9ydCB7IElBc3NpZ25tZW50IH0gZnJvbSAnLi4vcGNyJ1xyXG5pbXBvcnQgeyBsb2NhbFN0b3JhZ2VSZWFkLCBsb2NhbFN0b3JhZ2VXcml0ZSB9IGZyb20gJy4uL3V0aWwnXHJcblxyXG5leHBvcnQgdHlwZSBBY3Rpdml0eVR5cGUgPSAnZGVsZXRlJyB8ICdlZGl0JyB8ICdhZGQnXHJcbmV4cG9ydCB0eXBlIEFjdGl2aXR5SXRlbSA9IFtBY3Rpdml0eVR5cGUsIElBc3NpZ25tZW50LCBudW1iZXIsIHN0cmluZyB8IHVuZGVmaW5lZF1cclxuXHJcbmNvbnN0IEFDVElWSVRZX1NUT1JBR0VfTkFNRSA9ICdhY3Rpdml0eSdcclxuXHJcbmxldCBhY3Rpdml0eTogQWN0aXZpdHlJdGVtW10gPSBsb2NhbFN0b3JhZ2VSZWFkKEFDVElWSVRZX1NUT1JBR0VfTkFNRSkgfHwgW11cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBhZGRBY3Rpdml0eSh0eXBlOiBBY3Rpdml0eVR5cGUsIGFzc2lnbm1lbnQ6IElBc3NpZ25tZW50LCBkYXRlOiBEYXRlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3QWN0aXZpdHk6IGJvb2xlYW4sIGNsYXNzTmFtZT86IHN0cmluZyApOiB2b2lkIHtcclxuICAgIGlmIChuZXdBY3Rpdml0eSkgYWN0aXZpdHkucHVzaChbdHlwZSwgYXNzaWdubWVudCwgRGF0ZS5ub3coKSwgY2xhc3NOYW1lXSlcclxuICAgIGNvbnN0IGVsID0gY3JlYXRlQWN0aXZpdHkodHlwZSwgYXNzaWdubWVudCwgZGF0ZSwgY2xhc3NOYW1lKVxyXG4gICAgYWRkQWN0aXZpdHlFbGVtZW50KGVsKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2F2ZUFjdGl2aXR5KCk6IHZvaWQge1xyXG4gICAgYWN0aXZpdHkgPSBhY3Rpdml0eS5zbGljZShhY3Rpdml0eS5sZW5ndGggLSAxMjgsIGFjdGl2aXR5Lmxlbmd0aClcclxuICAgIGxvY2FsU3RvcmFnZVdyaXRlKEFDVElWSVRZX1NUT1JBR0VfTkFNRSwgYWN0aXZpdHkpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZWNlbnRBY3Rpdml0eSgpOiBBY3Rpdml0eUl0ZW1bXSB7XHJcbiAgICByZXR1cm4gYWN0aXZpdHkuc2xpY2UoYWN0aXZpdHkubGVuZ3RoIC0gMzIsIGFjdGl2aXR5Lmxlbmd0aClcclxufVxyXG4iLCJpbXBvcnQgeyBlbGVtQnlJZCwgbG9jYWxTdG9yYWdlUmVhZCwgbG9jYWxTdG9yYWdlV3JpdGUgfSBmcm9tICcuLi91dGlsJ1xyXG5cclxuY29uc3QgQVRIRU5BX1NUT1JBR0VfTkFNRSA9ICdhdGhlbmFEYXRhJ1xyXG5cclxuaW50ZXJmYWNlIElSYXdBdGhlbmFEYXRhIHtcclxuICAgIHJlc3BvbnNlX2NvZGU6IDIwMFxyXG4gICAgYm9keToge1xyXG4gICAgICAgIGNvdXJzZXM6IHtcclxuICAgICAgICAgICAgY291cnNlczogSVJhd0NvdXJzZVtdXHJcbiAgICAgICAgICAgIHNlY3Rpb25zOiBJUmF3U2VjdGlvbltdXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcGVybWlzc2lvbnM6IGFueVxyXG59XHJcblxyXG5pbnRlcmZhY2UgSVJhd0NvdXJzZSB7XHJcbiAgICBuaWQ6IG51bWJlclxyXG4gICAgY291cnNlX3RpdGxlOiBzdHJpbmdcclxuICAgIC8vIFRoZXJlJ3MgYSBidW5jaCBtb3JlIHRoYXQgSSd2ZSBvbWl0dGVkXHJcbn1cclxuXHJcbmludGVyZmFjZSBJUmF3U2VjdGlvbiB7XHJcbiAgICBjb3Vyc2VfbmlkOiBudW1iZXJcclxuICAgIGxpbms6IHN0cmluZ1xyXG4gICAgbG9nbzogc3RyaW5nXHJcbiAgICBzZWN0aW9uX3RpdGxlOiBzdHJpbmdcclxuICAgIC8vIFRoZXJlJ3MgYSBidW5jaCBtb3JlIHRoYXQgSSd2ZSBvbWl0dGVkXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUF0aGVuYURhdGFJdGVtIHtcclxuICAgIGxpbms6IHN0cmluZ1xyXG4gICAgbG9nbzogc3RyaW5nXHJcbiAgICBwZXJpb2Q6IHN0cmluZ1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElBdGhlbmFEYXRhIHtcclxuICAgIFtjbHM6IHN0cmluZ106IElBdGhlbmFEYXRhSXRlbVxyXG59XHJcblxyXG5sZXQgYXRoZW5hRGF0YTogSUF0aGVuYURhdGF8bnVsbCA9IGxvY2FsU3RvcmFnZVJlYWQoQVRIRU5BX1NUT1JBR0VfTkFNRSlcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRBdGhlbmFEYXRhKCk6IElBdGhlbmFEYXRhfG51bGwge1xyXG4gICAgcmV0dXJuIGF0aGVuYURhdGFcclxufVxyXG5cclxuZnVuY3Rpb24gZm9ybWF0TG9nbyhsb2dvOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIGxvZ28uc3Vic3RyKDAsIGxvZ28uaW5kZXhPZignXCIgYWx0PVwiJykpXHJcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgnPGRpdiBjbGFzcz1cInByb2ZpbGUtcGljdHVyZVwiPjxpbWcgc3JjPVwiJywgJycpXHJcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgndGlueScsICdyZWcnKVxyXG59XHJcblxyXG4vLyBOb3csIHRoZXJlJ3MgdGhlIHNjaG9vbG9neS9hdGhlbmEgaW50ZWdyYXRpb24gc3R1ZmYuIEZpcnN0LCB3ZSBuZWVkIHRvIGNoZWNrIGlmIGl0J3MgYmVlbiBtb3JlXHJcbi8vIHRoYW4gYSBkYXkuIFRoZXJlJ3Mgbm8gcG9pbnQgY29uc3RhbnRseSByZXRyaWV2aW5nIGNsYXNzZXMgZnJvbSBBdGhlbmE7IHRoZXkgZG9udCd0IGNoYW5nZSB0aGF0XHJcbi8vIG11Y2guXHJcblxyXG4vLyBUaGVuLCBvbmNlIHRoZSB2YXJpYWJsZSBmb3IgdGhlIGxhc3QgZGF0ZSBpcyBpbml0aWFsaXplZCwgaXQncyB0aW1lIHRvIGdldCB0aGUgY2xhc3NlcyBmcm9tXHJcbi8vIGF0aGVuYS4gTHVja2lseSwgdGhlcmUncyB0aGlzIGZpbGUgYXQgL2lhcGkvY291cnNlL2FjdGl2ZSAtIGFuZCBpdCdzIGluIEpTT04hIExpZmUgY2FuJ3QgYmUgYW55XHJcbi8vIGJldHRlciEgU2VyaW91c2x5ISBJdCdzIGp1c3QgdG9vIGJhZCB0aGUgbG9naW4gcGFnZSBpc24ndCBpbiBKU09OLlxyXG5mdW5jdGlvbiBwYXJzZUF0aGVuYURhdGEoZGF0OiBzdHJpbmcpOiBJQXRoZW5hRGF0YXxudWxsIHtcclxuICAgIGlmIChkYXQgPT09ICcnKSByZXR1cm4gbnVsbFxyXG4gICAgY29uc3QgZCA9IEpTT04ucGFyc2UoZGF0KSBhcyBJUmF3QXRoZW5hRGF0YVxyXG4gICAgY29uc3QgYXRoZW5hRGF0YTI6IElBdGhlbmFEYXRhID0ge31cclxuICAgIGNvbnN0IGFsbENvdXJzZURldGFpbHM6IHsgW25pZDogbnVtYmVyXTogSVJhd1NlY3Rpb24gfSA9IHt9XHJcbiAgICBkLmJvZHkuY291cnNlcy5zZWN0aW9ucy5mb3JFYWNoKChzZWN0aW9uKSA9PiB7XHJcbiAgICAgICAgYWxsQ291cnNlRGV0YWlsc1tzZWN0aW9uLmNvdXJzZV9uaWRdID0gc2VjdGlvblxyXG4gICAgfSlcclxuICAgIGQuYm9keS5jb3Vyc2VzLmNvdXJzZXMucmV2ZXJzZSgpLmZvckVhY2goKGNvdXJzZSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGNvdXJzZURldGFpbHMgPSBhbGxDb3Vyc2VEZXRhaWxzW2NvdXJzZS5uaWRdXHJcbiAgICAgICAgYXRoZW5hRGF0YTJbY291cnNlLmNvdXJzZV90aXRsZV0gPSB7XHJcbiAgICAgICAgICAgIGxpbms6IGBodHRwczovL2F0aGVuYS5oYXJrZXIub3JnJHtjb3Vyc2VEZXRhaWxzLmxpbmt9YCxcclxuICAgICAgICAgICAgbG9nbzogZm9ybWF0TG9nbyhjb3Vyc2VEZXRhaWxzLmxvZ28pLFxyXG4gICAgICAgICAgICBwZXJpb2Q6IGNvdXJzZURldGFpbHMuc2VjdGlvbl90aXRsZVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbiAgICByZXR1cm4gYXRoZW5hRGF0YTJcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZUF0aGVuYURhdGEoZGF0YTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGF0aGVuYURhdGEgPSBwYXJzZUF0aGVuYURhdGEoZGF0YSlcclxuICAgICAgICBsb2NhbFN0b3JhZ2VXcml0ZShBVEhFTkFfU1RPUkFHRV9OQU1FLCBkYXRhKVxyXG4gICAgICAgIGVsZW1CeUlkKCdhdGhlbmFEYXRhRXJyb3InKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXHJcbiAgICAgICAgZWxlbUJ5SWQoJ2F0aGVuYURhdGFSZWZyZXNoJykuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICBlbGVtQnlJZCgnYXRoZW5hRGF0YUVycm9yJykuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcclxuICAgICAgICBlbGVtQnlJZCgnYXRoZW5hRGF0YVJlZnJlc2gnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXHJcbiAgICAgICAgZWxlbUJ5SWQoJ2F0aGVuYURhdGFFcnJvcicpLmlubmVySFRNTCA9IGUubWVzc2FnZVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IGdldERhdGEsIElBcHBsaWNhdGlvbkRhdGEsIElBc3NpZ25tZW50IH0gZnJvbSAnLi4vcGNyJ1xyXG5pbXBvcnQgeyBsb2NhbFN0b3JhZ2VSZWFkLCBsb2NhbFN0b3JhZ2VXcml0ZSB9IGZyb20gJy4uL3V0aWwnXHJcblxyXG5jb25zdCBDVVNUT01fU1RPUkFHRV9OQU1FID0gJ2V4dHJhJ1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJQ3VzdG9tQXNzaWdubWVudCB7XHJcbiAgICBib2R5OiBzdHJpbmdcclxuICAgIGRvbmU6IGJvb2xlYW5cclxuICAgIHN0YXJ0OiBudW1iZXJcclxuICAgIGNsYXNzOiBzdHJpbmd8bnVsbFxyXG4gICAgZW5kOiBudW1iZXJ8J0ZvcmV2ZXInXHJcbn1cclxuXHJcbmNvbnN0IGV4dHJhOiBJQ3VzdG9tQXNzaWdubWVudFtdID0gbG9jYWxTdG9yYWdlUmVhZChDVVNUT01fU1RPUkFHRV9OQU1FKSB8fCB7fVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldEV4dHJhKCk6IElDdXN0b21Bc3NpZ25tZW50W10ge1xyXG4gICAgcmV0dXJuIGV4dHJhXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlRXh0cmEoKTogdm9pZCB7XHJcbiAgICBsb2NhbFN0b3JhZ2VXcml0ZShDVVNUT01fU1RPUkFHRV9OQU1FLCBleHRyYSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFkZFRvRXh0cmEoY3VzdG9tOiBJQ3VzdG9tQXNzaWdubWVudCk6IHZvaWQge1xyXG4gICAgZXh0cmEucHVzaChjdXN0b20pXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVGcm9tRXh0cmEoY3VzdG9tOiBJQ3VzdG9tQXNzaWdubWVudCk6IHZvaWQge1xyXG4gICAgaWYgKCFleHRyYS5pbmNsdWRlcyhjdXN0b20pKSB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCByZW1vdmUgY3VzdG9tIGFzc2lnbm1lbnQgdGhhdCBkb2VzIG5vdCBleGlzdCcpXHJcbiAgICBleHRyYS5zcGxpY2UoZXh0cmEuaW5kZXhPZihjdXN0b20pLCAxKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZXh0cmFUb1Rhc2soY3VzdG9tOiBJQ3VzdG9tQXNzaWdubWVudCwgZGF0YTogSUFwcGxpY2F0aW9uRGF0YSk6IElBc3NpZ25tZW50IHtcclxuICAgIGxldCBjbHM6IG51bWJlcnxudWxsID0gbnVsbFxyXG4gICAgaWYgKGN1c3RvbS5jbGFzcyAhPSBudWxsKSB7XHJcbiAgICAgICAgY2xzID0gZGF0YS5jbGFzc2VzLm1hcCgoYykgPT4gYy50b0xvd2VyQ2FzZSgpKS5pbmRleE9mKGN1c3RvbS5jbGFzcylcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHRpdGxlOiAnVGFzaycsXHJcbiAgICAgICAgYmFzZVR5cGU6ICd0YXNrJyxcclxuICAgICAgICB0eXBlOiAndGFzaycsXHJcbiAgICAgICAgYXR0YWNobWVudHM6IFtdLFxyXG4gICAgICAgIHN0YXJ0OiBjdXN0b20uc3RhcnQsXHJcbiAgICAgICAgZW5kOiBjdXN0b20uZW5kIHx8ICdGb3JldmVyJyxcclxuICAgICAgICBib2R5OiBjdXN0b20uYm9keSxcclxuICAgICAgICBpZDogYHRhc2ske2N1c3RvbS5ib2R5LnJlcGxhY2UoL1teXFx3XSovZywgJycpfSR7Y3VzdG9tLnN0YXJ0fSR7Y3VzdG9tLmVuZH0ke2N1c3RvbS5jbGFzc31gLFxyXG4gICAgICAgIGNsYXNzOiBjbHMgPT09IC0xID8gbnVsbCA6IGNsc1xyXG4gICAgfVxyXG59XHJcblxyXG5pbnRlcmZhY2UgSVBhcnNlUmVzdWx0IHtcclxuICAgIGNscz86IHN0cmluZ1xyXG4gICAgZHVlPzogc3RyaW5nXHJcbiAgICBzdD86IHN0cmluZ1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VDdXN0b21UYXNrKHRleHQ6IHN0cmluZywgcmVzdWx0OiBJUGFyc2VSZXN1bHQgPSB7fSk6IElQYXJzZVJlc3VsdCB7XHJcbiAgICBjb25zdCBwYXJzZWQgPSB0ZXh0Lm1hdGNoKC8oLiopIChmb3J8Ynl8ZHVlfGFzc2lnbmVkfHN0YXJ0aW5nfGVuZGluZ3xiZWdpbm5pbmcpICguKikvKVxyXG4gICAgaWYgKHBhcnNlZCA9PSBudWxsKSByZXR1cm4gcmVzdWx0XHJcblxyXG4gICAgc3dpdGNoIChwYXJzZWRbMl0pIHtcclxuICAgICAgICBjYXNlICdmb3InOiByZXN1bHQuY2xzID0gcGFyc2VkWzNdOyBicmVha1xyXG4gICAgICAgIGNhc2UgJ2J5JzogY2FzZSAnZHVlJzogY2FzZSAnZW5kaW5nJzogcmVzdWx0LmR1ZSA9IHBhcnNlZFszXTsgYnJlYWtcclxuICAgICAgICBjYXNlICdhc3NpZ25lZCc6IGNhc2UgJ3N0YXJ0aW5nJzogY2FzZSAnYmVnaW5uaW5nJzogcmVzdWx0LnN0ID0gcGFyc2VkWzNdOyBicmVha1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBwYXJzZUN1c3RvbVRhc2socGFyc2VkWzFdLCByZXN1bHQpXHJcbn1cclxuIiwiaW1wb3J0IHsgbG9jYWxTdG9yYWdlUmVhZCwgbG9jYWxTdG9yYWdlV3JpdGUgfSBmcm9tICcuLi91dGlsJ1xyXG5cclxuY29uc3QgRE9ORV9TVE9SQUdFX05BTUUgPSAnZG9uZSdcclxuXHJcbmNvbnN0IGRvbmU6IHN0cmluZ1tdID0gbG9jYWxTdG9yYWdlUmVhZChET05FX1NUT1JBR0VfTkFNRSkgfHwgW11cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVGcm9tRG9uZShpZDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICBjb25zdCBpbmRleCA9IGRvbmUuaW5kZXhPZihpZClcclxuICAgIGlmIChpbmRleCA+PSAwKSBkb25lLnNwbGljZShpbmRleCwgMSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFkZFRvRG9uZShpZDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICBkb25lLnB1c2goaWQpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzYXZlRG9uZSgpOiB2b2lkIHtcclxuICAgIGxvY2FsU3RvcmFnZVdyaXRlKERPTkVfU1RPUkFHRV9OQU1FLCBkb25lKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYXNzaWdubWVudEluRG9uZShpZDogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gZG9uZS5pbmNsdWRlcyhpZClcclxufVxyXG4iLCJpbXBvcnQgeyBsb2NhbFN0b3JhZ2VSZWFkLCBsb2NhbFN0b3JhZ2VXcml0ZSB9IGZyb20gJy4uL3V0aWwnXHJcblxyXG5jb25zdCBNT0RJRklFRF9TVE9SQUdFX05BTUUgPSAnbW9kaWZpZWQnXHJcblxyXG5pbnRlcmZhY2UgSU1vZGlmaWVkQm9kaWVzIHtcclxuICAgIFtpZDogc3RyaW5nXTogc3RyaW5nXHJcbn1cclxuXHJcbmNvbnN0IG1vZGlmaWVkOiBJTW9kaWZpZWRCb2RpZXMgPSBsb2NhbFN0b3JhZ2VSZWFkKE1PRElGSUVEX1NUT1JBR0VfTkFNRSkgfHwge31cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVGcm9tTW9kaWZpZWQoaWQ6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgZGVsZXRlIG1vZGlmaWVkW2lkXVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2F2ZU1vZGlmaWVkKCk6IHZvaWQge1xyXG4gICAgbG9jYWxTdG9yYWdlV3JpdGUoTU9ESUZJRURfU1RPUkFHRV9OQU1FLCBtb2RpZmllZClcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFzc2lnbm1lbnRJbk1vZGlmaWVkKGlkOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgIHJldHVybiBtb2RpZmllZC5oYXNPd25Qcm9wZXJ0eShpZClcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG1vZGlmaWVkQm9keShpZDogc3RyaW5nKTogc3RyaW5nfHVuZGVmaW5lZCB7XHJcbiAgICByZXR1cm4gbW9kaWZpZWRbaWRdXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRNb2RpZmllZChpZDogc3RyaW5nLCBib2R5OiBzdHJpbmcpOiB2b2lkIHtcclxuICAgIG1vZGlmaWVkW2lkXSA9IGJvZHlcclxufVxyXG4iLCIvKipcclxuICogRm9yY2VzIGEgbGF5b3V0IG9uIGFuIGVsZW1lbnRcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBmb3JjZUxheW91dChlbDogSFRNTEVsZW1lbnQpOiB2b2lkIHtcclxuICAgIC8vIFRoaXMgaW52b2x2ZXMgYSBsaXR0bGUgdHJpY2tlcnkgaW4gdGhhdCBieSByZXF1ZXN0aW5nIHRoZSBjb21wdXRlZCBoZWlnaHQgb2YgdGhlIGVsZW1lbnQgdGhlXHJcbiAgICAvLyBicm93c2VyIGlzIGZvcmNlZCB0byBkbyBhIGZ1bGwgbGF5b3V0XHJcblxyXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC1leHByZXNzaW9uXHJcbiAgICBlbC5vZmZzZXRIZWlnaHRcclxufVxyXG5cclxuLyoqXHJcbiAqIFJldHVybiBhIHN0cmluZyB3aXRoIHRoZSBmaXJzdCBsZXR0ZXIgY2FwaXRhbGl6ZWRcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBjYXBpdGFsaXplU3RyaW5nKHN0cjogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIHJldHVybiBzdHIuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHIuc3Vic3RyKDEpXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZXR1cm5zIGFuIFhNTEh0dHBSZXF1ZXN0IHdpdGggdGhlIHNwZWNpZmllZCB1cmwsIHJlc3BvbnNlIHR5cGUsIGhlYWRlcnMsIGFuZCBkYXRhXHJcbiAqL1xyXG5mdW5jdGlvbiBjb25zdHJ1Y3RYTUxIdHRwUmVxdWVzdCh1cmw6IHN0cmluZywgcmVzcFR5cGU/OiBYTUxIdHRwUmVxdWVzdFJlc3BvbnNlVHlwZXxudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXJzPzoge1tuYW1lOiBzdHJpbmddOiBzdHJpbmd9fG51bGwsIGRhdGE/OiBzdHJpbmd8bnVsbCk6IFhNTEh0dHBSZXF1ZXN0IHtcclxuICAgIGNvbnN0IHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXHJcblxyXG4gICAgLy8gSWYgUE9TVCBkYXRhIGlzIHByb3ZpZGVkIHNlbmQgYSBQT1NUIHJlcXVlc3QsIG90aGVyd2lzZSBzZW5kIGEgR0VUIHJlcXVlc3RcclxuICAgIHJlcS5vcGVuKChkYXRhID8gJ1BPU1QnIDogJ0dFVCcpLCB1cmwsIHRydWUpXHJcblxyXG4gICAgaWYgKHJlc3BUeXBlKSByZXEucmVzcG9uc2VUeXBlID0gcmVzcFR5cGVcclxuXHJcbiAgICBpZiAoaGVhZGVycykge1xyXG4gICAgICAgIE9iamVjdC5rZXlzKGhlYWRlcnMpLmZvckVhY2goKGhlYWRlcikgPT4ge1xyXG4gICAgICAgICAgICByZXEuc2V0UmVxdWVzdEhlYWRlcihoZWFkZXIsIGhlYWRlcnNbaGVhZGVyXSlcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIC8vIElmIGRhdGEgaXMgdW5kZWZpbmVkIGRlZmF1bHQgdG8gdGhlIG5vcm1hbCByZXEuc2VuZCgpLCBvdGhlcndpc2UgcGFzcyB0aGUgZGF0YSBpblxyXG4gICAgcmVxLnNlbmQoZGF0YSlcclxuICAgIHJldHVybiByZXFcclxufVxyXG5cclxuLyoqIFNlbmRzIGEgcmVxdWVzdCB0byBhIHNlcnZlciBhbmQgcmV0dXJucyBhIFByb21pc2UuXHJcbiAqIEBwYXJhbSB1cmwgdGhlIHVybCB0byByZXRyaWV2ZVxyXG4gKiBAcGFyYW0gcmVzcFR5cGUgdGhlIHR5cGUgb2YgcmVzcG9uc2UgdGhhdCBzaG91bGQgYmUgcmVjZWl2ZWRcclxuICogQHBhcmFtIGhlYWRlcnMgdGhlIGhlYWRlcnMgdGhhdCB3aWxsIGJlIHNlbnQgdG8gdGhlIHNlcnZlclxyXG4gKiBAcGFyYW0gZGF0YSB0aGUgZGF0YSB0aGF0IHdpbGwgYmUgc2VudCB0byB0aGUgc2VydmVyIChvbmx5IGZvciBQT1NUIHJlcXVlc3RzKVxyXG4gKiBAcGFyYW0gcHJvZ3Jlc3NFbGVtZW50IGFuIG9wdGlvbmFsIGVsZW1lbnQgZm9yIHRoZSBwcm9ncmVzcyBiYXIgdXNlZCB0byBkaXNwbGF5IHRoZSBzdGF0dXMgb2YgdGhlIHJlcXVlc3RcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBzZW5kKHVybDogc3RyaW5nLCByZXNwVHlwZT86IFhNTEh0dHBSZXF1ZXN0UmVzcG9uc2VUeXBlfG51bGwsIGhlYWRlcnM/OiB7W25hbWU6IHN0cmluZ106IHN0cmluZ318bnVsbCxcclxuICAgICAgICAgICAgICAgICAgICAgZGF0YT86IHN0cmluZ3xudWxsLCBwcm9ncmVzcz86IEhUTUxFbGVtZW50fG51bGwpOiBQcm9taXNlPFhNTEh0dHBSZXF1ZXN0PiB7XHJcblxyXG4gICAgY29uc3QgcmVxID0gY29uc3RydWN0WE1MSHR0cFJlcXVlc3QodXJsLCByZXNwVHlwZSwgaGVhZGVycywgZGF0YSlcclxuXHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cclxuICAgICAgICBjb25zdCBwcm9ncmVzc0lubmVyID0gcHJvZ3Jlc3MgPyBwcm9ncmVzcy5xdWVyeVNlbGVjdG9yKCdkaXYnKSA6IG51bGxcclxuICAgICAgICBpZiAocHJvZ3Jlc3MgJiYgcHJvZ3Jlc3NJbm5lcikge1xyXG4gICAgICAgICAgICBmb3JjZUxheW91dChwcm9ncmVzc0lubmVyKSAvLyBXYWl0IGZvciBpdCB0byByZW5kZXJcclxuICAgICAgICAgICAgcHJvZ3Jlc3MuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJykgLy8gRGlzcGxheSB0aGUgcHJvZ3Jlc3MgYmFyXHJcbiAgICAgICAgICAgIGlmIChwcm9ncmVzc0lubmVyLmNsYXNzTGlzdC5jb250YWlucygnZGV0ZXJtaW5hdGUnKSkge1xyXG4gICAgICAgICAgICAgICAgcHJvZ3Jlc3NJbm5lci5jbGFzc0xpc3QucmVtb3ZlKCdkZXRlcm1pbmF0ZScpXHJcbiAgICAgICAgICAgICAgICBwcm9ncmVzc0lubmVyLmNsYXNzTGlzdC5hZGQoJ2luZGV0ZXJtaW5hdGUnKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBTb21ldGltZXMgdGhlIGJyb3dzZXIgd29uJ3QgZ2l2ZSB0aGUgdG90YWwgYnl0ZXMgaW4gdGhlIHJlc3BvbnNlLCBzbyB1c2UgcGFzdCByZXN1bHRzIG9yXHJcbiAgICAgICAgLy8gYSBkZWZhdWx0IG9mIDE3MCwwMDAgYnl0ZXMgaWYgdGhlIGJyb3dzZXIgZG9lc24ndCBwcm92aWRlIHRoZSBudW1iZXJcclxuICAgICAgICBjb25zdCBsb2FkID0gTnVtYmVyKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdsb2FkJykpIHx8IDE3MDAwMFxyXG4gICAgICAgIGxldCBjb21wdXRlZExvYWQgPSAwXHJcblxyXG4gICAgICAgIHJlcS5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKGV2dCkgPT4ge1xyXG4gICAgICAgICAgICAvLyBDYWNoZSB0aGUgbnVtYmVyIG9mIGJ5dGVzIGxvYWRlZCBzbyBpdCBjYW4gYmUgdXNlZCBmb3IgYmV0dGVyIGVzdGltYXRlcyBsYXRlciBvblxyXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnbG9hZCcsIFN0cmluZyhjb21wdXRlZExvYWQpKVxyXG4gICAgICAgICAgICBpZiAocHJvZ3Jlc3MpIHByb2dyZXNzLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgICAgICAgICAgIC8vIFJlc29sdmUgd2l0aCB0aGUgcmVxdWVzdFxyXG4gICAgICAgICAgICBpZiAocmVxLnN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKHJlcSlcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChFcnJvcihyZXEuc3RhdHVzVGV4dCkpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICByZXEuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChwcm9ncmVzcykgcHJvZ3Jlc3MuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcclxuICAgICAgICAgICAgcmVqZWN0KEVycm9yKCdOZXR3b3JrIEVycm9yJykpXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgaWYgKHByb2dyZXNzICYmIHByb2dyZXNzSW5uZXIpIHtcclxuICAgICAgICAgICAgcmVxLmFkZEV2ZW50TGlzdGVuZXIoJ3Byb2dyZXNzJywgKGV2dCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gVXBkYXRlIHRoZSBwcm9ncmVzcyBiYXJcclxuICAgICAgICAgICAgICAgIGlmIChwcm9ncmVzc0lubmVyLmNsYXNzTGlzdC5jb250YWlucygnaW5kZXRlcm1pbmF0ZScpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvZ3Jlc3NJbm5lci5jbGFzc0xpc3QucmVtb3ZlKCdpbmRldGVybWluYXRlJylcclxuICAgICAgICAgICAgICAgICAgICBwcm9ncmVzc0lubmVyLmNsYXNzTGlzdC5hZGQoJ2RldGVybWluYXRlJylcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvbXB1dGVkTG9hZCA9IGV2dC5sb2FkZWRcclxuICAgICAgICAgICAgICAgIHByb2dyZXNzSW5uZXIuc3R5bGUud2lkdGggPSAoKDEwMCAqIGV2dC5sb2FkZWQpIC8gKGV2dC5sZW5ndGhDb21wdXRhYmxlID8gZXZ0LnRvdGFsIDogbG9hZCkpICsgJyUnXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxufVxyXG5cclxuLyoqXHJcbiAqIFRoZSBlcXVpdmFsZW50IG9mIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkIGJ1dCB0aHJvd3MgYW4gZXJyb3IgaWYgdGhlIGVsZW1lbnQgaXMgbm90IGRlZmluZWRcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBlbGVtQnlJZChpZDogc3RyaW5nKTogSFRNTEVsZW1lbnQge1xyXG4gICAgY29uc3QgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZClcclxuICAgIGlmIChlbCA9PSBudWxsKSB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBmaW5kIGVsZW1lbnQgd2l0aCBpZCAke2lkfWApXHJcbiAgICByZXR1cm4gZWxcclxufVxyXG5cclxuLyoqXHJcbiAqIEEgbGl0dGxlIGhlbHBlciBmdW5jdGlvbiB0byBzaW1wbGlmeSB0aGUgY3JlYXRpb24gb2YgSFRNTCBlbGVtZW50c1xyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGVsZW1lbnQodGFnOiBzdHJpbmcsIGNsczogc3RyaW5nfHN0cmluZ1tdLCBodG1sPzogc3RyaW5nfG51bGwsIGlkPzogc3RyaW5nfG51bGwpOiBIVE1MRWxlbWVudCB7XHJcbiAgICBjb25zdCBlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWcpXHJcblxyXG4gICAgaWYgKHR5cGVvZiBjbHMgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgZS5jbGFzc0xpc3QuYWRkKGNscylcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY2xzLmZvckVhY2goKGMpID0+IGUuY2xhc3NMaXN0LmFkZChjKSlcclxuICAgIH1cclxuXHJcbiAgICBpZiAoaHRtbCkgZS5pbm5lckhUTUwgPSBodG1sXHJcbiAgICBpZiAoaWQpIGUuc2V0QXR0cmlidXRlKCdpZCcsIGlkKVxyXG5cclxuICAgIHJldHVybiBlXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBUaHJvd3MgYW4gZXJyb3IgaWYgdGhlIHN1cHBsaWVkIGFyZ3VtZW50IGlzIG51bGwsIG90aGVyd2lzZSByZXR1cm5zIHRoZSBhcmd1bWVudFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIF8kPFQ+KGFyZzogVHxudWxsKTogVCB7XHJcbiAgICBpZiAoYXJnID09IG51bGwpIHRocm93IG5ldyBFcnJvcignRXhwZWN0ZWQgYXJndW1lbnQgdG8gYmUgbm9uLW51bGwnKVxyXG4gICAgcmV0dXJuIGFyZ1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gXyRoKGFyZzogTm9kZXxFdmVudFRhcmdldHxudWxsKTogSFRNTEVsZW1lbnQge1xyXG4gICAgaWYgKGFyZyA9PSBudWxsKSB0aHJvdyBuZXcgRXJyb3IoJ0V4cGVjdGVkIG5vZGUgdG8gYmUgbm9uLW51bGwnKVxyXG4gICAgcmV0dXJuIGFyZyBhcyBIVE1MRWxlbWVudFxyXG59XHJcblxyXG4vLyBCZWNhdXNlIHNvbWUgbG9jYWxTdG9yYWdlIGVudHJpZXMgY2FuIGJlY29tZSBjb3JydXB0ZWQgZHVlIHRvIGVycm9yIHNpZGUgZWZmZWN0cywgdGhlIGJlbG93XHJcbi8vIG1ldGhvZCB0cmllcyB0byByZWFkIGEgdmFsdWUgZnJvbSBsb2NhbFN0b3JhZ2UgYW5kIGhhbmRsZXMgZXJyb3JzLlxyXG5leHBvcnQgZnVuY3Rpb24gbG9jYWxTdG9yYWdlUmVhZChuYW1lOiBzdHJpbmcpOiBhbnlcclxuZXhwb3J0IGZ1bmN0aW9uIGxvY2FsU3RvcmFnZVJlYWQ8Uj4obmFtZTogc3RyaW5nLCBkZWZhdWx0VmFsOiAoKSA9PiBSKTogUlxyXG5leHBvcnQgZnVuY3Rpb24gbG9jYWxTdG9yYWdlUmVhZDxUPihuYW1lOiBzdHJpbmcsIGRlZmF1bHRWYWw6IFQpOiBUXHJcbmV4cG9ydCBmdW5jdGlvbiBsb2NhbFN0b3JhZ2VSZWFkKG5hbWU6IHN0cmluZywgZGVmYXVsdFZhbD86IGFueSk6IGFueSB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZVtuYW1lXSlcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICByZXR1cm4gdHlwZW9mIGRlZmF1bHRWYWwgPT09ICdmdW5jdGlvbicgPyBkZWZhdWx0VmFsKCkgOiBkZWZhdWx0VmFsXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBsb2NhbFN0b3JhZ2VXcml0ZShuYW1lOiBzdHJpbmcsIGl0ZW06IGFueSk6IHZvaWQge1xyXG4gICAgbG9jYWxTdG9yYWdlW25hbWVdID0gSlNPTi5zdHJpbmdpZnkoaXRlbSlcclxufVxyXG5cclxuaW50ZXJmYWNlIElkbGVEZWFkbGluZSB7XHJcbiAgICBkaWRUaW1lb3V0OiBib29sZWFuXHJcbiAgICB0aW1lUmVtYWluaW5nOiAoKSA9PiBudW1iZXJcclxufVxyXG5cclxuLy8gQmVjYXVzZSB0aGUgcmVxdWVzdElkbGVDYWxsYmFjayBmdW5jdGlvbiBpcyB2ZXJ5IG5ldyAoYXMgb2Ygd3JpdGluZyBvbmx5IHdvcmtzIHdpdGggQ2hyb21lXHJcbi8vIHZlcnNpb24gNDcpLCB0aGUgYmVsb3cgZnVuY3Rpb24gcG9seWZpbGxzIHRoYXQgbWV0aG9kLlxyXG5leHBvcnQgZnVuY3Rpb24gcmVxdWVzdElkbGVDYWxsYmFjayhjYjogKGRlYWRsaW5lOiBJZGxlRGVhZGxpbmUpID0+IHZvaWQsIG9wdHM6IHsgdGltZW91dDogbnVtYmVyfSk6IG51bWJlciB7XHJcbiAgICBpZiAoJ3JlcXVlc3RJZGxlQ2FsbGJhY2snIGluIHdpbmRvdykge1xyXG4gICAgICAgIHJldHVybiAod2luZG93IGFzIGFueSkucmVxdWVzdElkbGVDYWxsYmFjayhjYiwgb3B0cylcclxuICAgIH1cclxuICAgIGNvbnN0IHN0YXJ0ID0gRGF0ZS5ub3coKVxyXG5cclxuICAgIHJldHVybiBzZXRUaW1lb3V0KCgpID0+IGNiKHtcclxuICAgICAgICBkaWRUaW1lb3V0OiBmYWxzZSxcclxuICAgICAgICB0aW1lUmVtYWluaW5nKCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIHJldHVybiBNYXRoLm1heCgwLCA1MCAtIChEYXRlLm5vdygpIC0gc3RhcnQpKVxyXG4gICAgICAgIH1cclxuICAgIH0pLCAxKVxyXG59XHJcblxyXG4vKipcclxuICogRGV0ZXJtaW5lIGlmIHRoZSB0d28gZGF0ZXMgaGF2ZSB0aGUgc2FtZSB5ZWFyLCBtb250aCwgYW5kIGRheVxyXG4gKi9cclxuZnVuY3Rpb24gZGF0ZXNFcXVhbChhOiBEYXRlLCBiOiBEYXRlKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gYS5nZXREYXRlKCkgPT09IGIuZ2V0RGF0ZSgpICYmIGEuZ2V0TW9udGgoKSA9PT0gYi5nZXRNb250aCgpICYmIGEuZ2V0RnVsbFllYXIoKSA9PT0gYi5nZXRGdWxsWWVhcigpXHJcbn1cclxuXHJcbmNvbnN0IERBVEVfUkVMQVRJVkVOQU1FUzoge1tuYW1lOiBzdHJpbmddOiBudW1iZXJ9ID0ge1xyXG4gICAgJ1RvbW9ycm93JzogMSxcclxuICAgICdUb2RheSc6IDAsXHJcbiAgICAnWWVzdGVyZGF5JzogLTEsXHJcbiAgICAnMiBkYXlzIGFnbyc6IC0yXHJcbn1cclxuY29uc3QgV0VFS0RBWVMgPSBbJ1N1bmRheScsICdNb25kYXknLCAnVHVlc2RheScsICdXZWRuZXNkYXknLCAnVGh1cnNkYXknLCAnRnJpZGF5JywgJ1NhdHVyZGF5J11cclxuY29uc3QgRlVMTE1PTlRIUyA9IFsnSmFudWFyeScsICdGZWJydWFyeScsICdNYXJjaCcsICdBcHJpbCcsICdNYXknLCAnSnVuZScsICdKdWx5JywgJ0F1Z3VzdCcsICdTZXB0ZW1iZXInLCAnT2N0b2JlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgJ05vdmVtYmVyJywgJ0RlY2VtYmVyJ11cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkYXRlU3RyaW5nKGRhdGU6IERhdGV8J0ZvcmV2ZXInLCBhZGRUaGlzOiBib29sZWFuID0gZmFsc2UpOiBzdHJpbmcge1xyXG4gICAgaWYgKGRhdGUgPT09ICdGb3JldmVyJykgcmV0dXJuIGRhdGVcclxuXHJcbiAgICBjb25zdCByZWxhdGl2ZU1hdGNoID0gT2JqZWN0LmtleXMoREFURV9SRUxBVElWRU5BTUVTKS5maW5kKChuYW1lKSA9PiB7XHJcbiAgICAgICAgY29uc3QgZGF5QXQgPSBuZXcgRGF0ZSgpXHJcbiAgICAgICAgZGF5QXQuc2V0RGF0ZShkYXlBdC5nZXREYXRlKCkgKyBEQVRFX1JFTEFUSVZFTkFNRVNbbmFtZV0pXHJcbiAgICAgICAgcmV0dXJuIGRhdGVzRXF1YWwoZGF5QXQsIGRhdGUpXHJcbiAgICB9KVxyXG5cclxuICAgIGNvbnN0IGRheXNBaGVhZCA9IChkYXRlLmdldFRpbWUoKSAtIERhdGUubm93KCkpIC8gMTAwMCAvIDM2MDAgLyAyNFxyXG5cclxuICAgIC8vIElmIHRoZSBkYXRlIGlzIHdpdGhpbiA2IGRheXMgb2YgdG9kYXksIG9ubHkgZGlzcGxheSB0aGUgZGF5IG9mIHRoZSB3ZWVrXHJcbiAgICBpZiAoMCA8IGRheXNBaGVhZCAmJiBkYXlzQWhlYWQgPD0gNikge1xyXG4gICAgICAgIHJldHVybiAoYWRkVGhpcyA/ICdUaGlzICcgOiAnJykgKyBXRUVLREFZU1tkYXRlLmdldERheSgpXVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGAke1dFRUtEQVlTW2RhdGUuZ2V0RGF5KCldfSwgJHtGVUxMTU9OVEhTW2RhdGUuZ2V0TW9udGgoKV19ICR7ZGF0ZS5nZXREYXRlKCl9YFxyXG59XHJcblxyXG4vLyBUaGUgb25lIGJlbG93IHNjcm9sbHMgc21vb3RobHkgdG8gYSB5IHBvc2l0aW9uLlxyXG5leHBvcnQgZnVuY3Rpb24gc21vb3RoU2Nyb2xsKHRvOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgbGV0IHN0YXJ0OiBudW1iZXJ8bnVsbCA9IG51bGxcclxuICAgICAgICBjb25zdCBmcm9tID0gZG9jdW1lbnQuYm9keS5zY3JvbGxUb3BcclxuICAgICAgICBjb25zdCBhbW91bnQgPSB0byAtIGZyb21cclxuICAgICAgICBjb25zdCBzdGVwID0gKHRpbWVzdGFtcDogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChzdGFydCA9PSBudWxsKSB7IHN0YXJ0ID0gdGltZXN0YW1wIH1cclxuICAgICAgICAgICAgY29uc3QgcHJvZ3Jlc3MgPSB0aW1lc3RhbXAgLSBzdGFydFxyXG4gICAgICAgICAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgZnJvbSArIChhbW91bnQgKiAocHJvZ3Jlc3MgLyAzNTApKSlcclxuICAgICAgICAgICAgaWYgKHByb2dyZXNzIDwgMzUwKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0ZXApXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBfJChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCduYXYnKSkuY2xhc3NMaXN0LnJlbW92ZSgnaGVhZHJvb20tLXVucGlubmVkJylcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShzdGVwKVxyXG4gICAgfSlcclxufVxyXG5cclxuLy8gQW5kIGEgZnVuY3Rpb24gdG8gYXBwbHkgYW4gaW5rIGVmZmVjdFxyXG5leHBvcnQgZnVuY3Rpb24gcmlwcGxlKGVsOiBIVE1MRWxlbWVudCk6IHZvaWQge1xyXG4gICAgZWwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgKGV2dCkgPT4ge1xyXG4gICAgICAgIGlmIChldnQud2hpY2ggIT09IDEpIHJldHVybiAvLyBOb3QgbGVmdCBidXR0b25cclxuICAgICAgICBjb25zdCB3YXZlID0gZWxlbWVudCgnc3BhbicsICd3YXZlJylcclxuICAgICAgICBjb25zdCBzaXplID0gTWF0aC5tYXgoTnVtYmVyKGVsLm9mZnNldFdpZHRoKSwgTnVtYmVyKGVsLm9mZnNldEhlaWdodCkpXHJcbiAgICAgICAgd2F2ZS5zdHlsZS53aWR0aCA9ICh3YXZlLnN0eWxlLmhlaWdodCA9IHNpemUgKyAncHgnKVxyXG5cclxuICAgICAgICBsZXQgeCA9IGV2dC5jbGllbnRYXHJcbiAgICAgICAgbGV0IHkgPSBldnQuY2xpZW50WVxyXG4gICAgICAgIGNvbnN0IHJlY3QgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxyXG4gICAgICAgIHggLT0gcmVjdC5sZWZ0XHJcbiAgICAgICAgeSAtPSByZWN0LnRvcFxyXG5cclxuICAgICAgICB3YXZlLnN0eWxlLnRvcCA9ICh5IC0gKHNpemUgLyAyKSkgKyAncHgnXHJcbiAgICAgICAgd2F2ZS5zdHlsZS5sZWZ0ID0gKHggLSAoc2l6ZSAvIDIpKSArICdweCdcclxuICAgICAgICBlbC5hcHBlbmRDaGlsZCh3YXZlKVxyXG4gICAgICAgIHdhdmUuc2V0QXR0cmlidXRlKCdkYXRhLWhvbGQnLCBTdHJpbmcoRGF0ZS5ub3coKSkpXHJcbiAgICAgICAgZm9yY2VMYXlvdXQod2F2ZSlcclxuICAgICAgICB3YXZlLnN0eWxlLnRyYW5zZm9ybSA9ICdzY2FsZSgyLjUpJ1xyXG4gICAgfSlcclxuICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCAoZXZ0KSA9PiB7XHJcbiAgICAgICAgaWYgKGV2dC53aGljaCAhPT0gMSkgcmV0dXJuIC8vIE9ubHkgZm9yIGxlZnQgYnV0dG9uXHJcbiAgICAgICAgY29uc3Qgd2F2ZXMgPSBlbC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd3YXZlJylcclxuICAgICAgICB3YXZlcy5mb3JFYWNoKCh3YXZlKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRpZmYgPSBEYXRlLm5vdygpIC0gTnVtYmVyKHdhdmUuZ2V0QXR0cmlidXRlKCdkYXRhLWhvbGQnKSlcclxuICAgICAgICAgICAgY29uc3QgZGVsYXkgPSBNYXRoLm1heCgzNTAgLSBkaWZmLCAwKVxyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICh3YXZlIGFzIEhUTUxFbGVtZW50KS5zdHlsZS5vcGFjaXR5ID0gJzAnXHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB3YXZlLnJlbW92ZSgpXHJcbiAgICAgICAgICAgICAgICB9LCA1NTApXHJcbiAgICAgICAgICAgIH0sIGRlbGF5KVxyXG4gICAgICAgIH0pXHJcbiAgICB9KVxyXG4gIH1cclxuIl0sInNvdXJjZVJvb3QiOiIifQ==