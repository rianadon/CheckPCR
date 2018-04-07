"use strict";
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS202: Simplify dynamic range loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// Welcome to the documentation of and the actual program of CheckPCR.
//
// This is the main processing program containing that fetches your assignments from PCR, parses them, and displays them.
// It is written in [Literate CoffeeScript](http://coffeescript.org/#literate), a version of CoffeeScript (a language that compiles into JavaScript, which is used to modify content on webpages and allow interactions with webpages) that is also compliant with Markdown syntax and can be displayed as a Markdown file (as you see here if you are viewing this file from Github).
//
// #### Table of Contents
// * [Basic Definitions](#defs)
// * [Retrieving Data](#ret)
// * [Parsing](#parsing")
// * [Displaying the assignments](#displaying)
// * [Side menu and Navbar](#side)
// * [Athena (Schoology)](#athena)
// * [Settings](#settings)
// * [Starting everything](#starting)
// * [Analytics](#analytics)
// * [Events](#events)
// * [Updates and News](#updates)
// * [Adding new assignments](#new)
// * [Firebase](#fb)
// * [Other](#other)
//
// ##### So, here is the annotated code:
//
// <a name="defs"/>
// Basic Definitions
// -----------------
//
// First of all, if the online version is used, the http version is redirected to https.
var c, color, el, p;
var i;
if ((window.location.protocol === 'http:') && (location.hostname !== 'localhost')) {
    window.location.href = "https:" + window.location.href.substring(window.location.protocol.length);
}
// Additionally, if it's the user's first time, the page is set to the welcome page.
if ((localStorage.noWelcome == null)) {
    localStorage.noWelcome = 'true';
    window.location = 'welcome.html';
}
// Then we have most of the global variables.
var loginURL = 'https://webappsca.pcrsoft.com/Clue/SC-Student-Portal-Login-LDAP/8464?returnUrl=https%3a%2f%2fwebappsca.pcrsoft.com%2fClue%2fSC-Assignments-End-Date-Range%2f7536';
var loginHeaders = {};
var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var fullMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var tzoff = (new Date()).getTimezoneOffset() * 1000 * 60; // For future calculations
var mimeTypes = {
    'application/msword': ['Word Doc', 'document'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['Word Doc', 'document'],
    'application/vnd.ms-powerpoint': ['PPT Presentation', 'slides'],
    'application/pdf': ['PDF File', 'pdf'],
    'text/plain': ['Text Doc', 'plain'],
};
var scroll = 0; // The location to scroll to in order to reach today in calendar view
var viewData = {}; // The data to send when switching PCR views
var activity = [];
var dmp = new diff_match_patch(); // For diffing
var lastUpdate = 0; // The last time verything was updated
var listDateOffset = 0;
var version = '2.24.3';
// #### Send function
//
// This function sends a request to a server and returns a Promise.
// - *url* is the url we want to retrieve
// - *respType* is the type of response that should be recieved
// - *headers* is an object of headers that will be sent to the server
// - *data* is data that will be sent to the server (only for POST requests)
// - *progress* is a boolean that determines whether or not the progress bar should be used to display the status of the request
var send = function (url, respType, headers, data, progress) {
    if (progress === void 0) { progress = false; }
    return new Promise(function (resolve, reject) {
        var req = new XMLHttpRequest();
        req.open(((data != null) ? 'POST' : 'GET'), url, true);
        var progressElement = document.getElementById('progress');
        var progressInner = progressElement.querySelector('div');
        if (progress) {
            progressElement.offsetWidth; // Wait for it to render
            progressElement.classList.add('active');
            if (progressInner.classList.contains('determinate')) {
                progressInner.classList.remove('determinate');
                progressInner.classList.add('indeterminate');
            }
        }
        var load = localStorage.load || 170000;
        req.onload = function (evt) {
            localStorage.load = evt.loaded;
            if (progress) {
                progressElement.classList.remove('active');
            }
            if (req.status === 200) {
                resolve(req);
            }
            else {
                reject(Error(req.statusText));
            }
        };
        req.onerror = function () {
            if (progress) {
                progressElement.classList.remove('active');
            }
            reject(Error('Network Error'));
        };
        if (progress) {
            req.onprogress = function (evt) {
                if (progressInner.classList.contains('indeterminate')) {
                    progressInner.classList.remove('indeterminate');
                    progressInner.classList.add('determinate');
                }
                return progressInner.style.width = ((100 * evt.loaded) / (evt.lengthComputable ? evt.total : load)) + '%';
            };
        }
        if (respType != null) {
            req.responseType = respType;
        }
        if (headers != null) {
            for (var headername in headers) {
                var header = headers[headername];
                req.setRequestHeader(headername, header);
            }
        }
        if (data != null) {
            req.send(data);
        }
        else {
            req.send();
        }
    });
};
// #### Cookie functions
//
// Below is a function that will retrieve a cookie (a small text document that the browser can remember).
// - *cname* is the name of the cookie to retrieve
var getCookie = function (cname) {
    var name = cname + '=';
    var ca = document.cookie.split(';');
    i = 0;
    while (i < ca.length) {
        var c_1 = ca[i];
        while (c_1.charAt(0) === ' ') {
            c_1 = c_1.substring(1);
        }
        if (c_1.indexOf(name) !== -1) {
            return c_1.substring(name.length, c_1.length);
        }
        i++;
    }
    return ''; // Blank if cookie not found
};
// To set a cookie, this function is called.
// - *cname* is the name of the cookie to set
// - *cvalue* is the value to set the cookie to
// - *exdays* is the number of days that the cookie will expire in (and not be existent anymore)
var setCookie = function (cname, cvalue, exdays) {
    var d = new Date;
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + '=' + cvalue + '; ' + expires;
};
// The delete cookie function is like *setCookie*, but sets the expiry date to something in the past so the cookie is deleted.
var deleteCookie = function (cname) {
    document.cookie = cname + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};
// This function displays a snackbar to tell the user something
var snackbar = function (message, action, f) {
    var snack = element('div', 'snackbar');
    var snackInner = element('div', 'snackInner', message);
    snack.appendChild(snackInner);
    if ((action != null) && (f != null)) {
        var actionE = element('a', [], action);
        actionE.addEventListener('click', function () {
            snack.classList.remove('active');
            return f();
        });
        snackInner.appendChild(actionE);
    }
    var add = function () {
        document.body.appendChild(snack);
        snack.offsetHeight;
        snack.classList.add('active');
        return setTimeout(function () {
            snack.classList.remove('active');
            return setTimeout(function () { return snack.remove(); }, 900);
        }, 5000);
    };
    var existing = document.querySelector('.snackbar');
    if (existing != null) {
        existing.classList.remove('active');
        setTimeout(add, 300);
    }
    else {
        add();
    }
};
// *displayError* displays a dialog containing information about an error.
var displayError = function (e) {
    var errorHTML = "Messsage: " + e.message + "\nStack: " + (e.stack || e.lineNumber) + "\nBrowser: " + navigator.userAgent + "\nVersion: " + version;
    document.getElementById('errorContent').innerHTML = errorHTML.replace('\n', '<br>');
    document.getElementById('errorGoogle').href = "https://docs.google.com/a/students.harker.org/forms/d/1sa2gUtYFPdKT5YENXIEYauyRPucqsQCVaQAPeF3bZ4Q/viewform?entry.120036223=" + encodeURIComponent(errorHTML);
    document.getElementById('errorGitHub').href = "https://github.com/19RyanA/CheckPCR/issues/new?body=" + encodeURIComponent("I've encountered an bug.\n\n```\n" + errorHTML + "\n```");
    document.getElementById('errorBackground').style.display = 'block';
    return document.getElementById('error').classList.add('active');
};
// *FromDateNum* converts a number of days to a number of seconds
var fromDateNum = function (days) {
    var d = new Date((days * 1000 * 3600 * 24) + tzoff);
    if (d.getHours() === 1) {
        d.setHours(0);
    }
    if ((d.getHours() === 22) || (d.getHours() === 23)) {
        d.setHours(24);
        d.setMinutes(0);
        d.setSeconds(0);
    }
    return d.getTime();
};
// Because the requestIdleCallback function is very new (as of writing only works with Chrome version 47), the below function polyfills that method.
if (window.requestIdleCallback == null) {
    window.requestIdleCallback = function (cb) {
        var start = Date.now();
        return setTimeout(function () {
            return cb({
                didTimeout: false,
                timeRemaining: function () {
                    return Math.max(0, 50 - (Date.now() - start));
                },
            });
        }, 1);
    };
}
// Because some localStorage entries can become corrupted due to error side effects, the below method tries to read a value from localStorage and handles errors.
var localStorageRead = function (name) {
    try {
        return JSON.parse(localStorage[name]);
    }
    catch (e) {
        return undefined;
    }
};
// <a name="ret"/>
// Retrieving data
// ---------------
//
// The function below converts an update time to a human-readable date.
var formatUpdate = function (date) {
    var now = new Date();
    var update = new Date(+date);
    if (now.getDate() === update.getDate()) {
        var ampm = 'AM';
        var hr = update.getHours();
        if (hr > 12) {
            ampm = 'PM';
            hr -= 12;
        }
        var min = update.getMinutes();
        return "Today at " + hr + ":" + (min < 10 ? "0" + min : min) + " " + ampm;
    }
    else {
        var daysPast = Math.ceil((now.getTime() - update.getTime()) / 1000 / 3600 / 24);
        if (daysPast === 1) {
            return 'Yesterday';
        }
        else {
            return daysPast + ' days ago';
        }
    }
};
// This is the function that retrieves your assignments from PCR.
//
// First, a request is sent to PCR to load the page you would normally see when accessing PCR.
//
// Because this is run as a chrome extension, this page can be accessed. Otherwise, the browser would throw an error for security reasons (you don't want a random website being able to access confidential data from a website you have logged into).
var fetch = function (override, data) {
    if (override === void 0) { override = false; }
};
// Now, we have the function that will log us into PCR.
// *val* is an optional argument that is an array of the username and password to log in with
var dologin = function (val, submitEvt) {
    if (submitEvt === void 0) { submitEvt = false; }
    document.getElementById('login').classList.remove('active');
    setTimeout(function () { return document.getElementById('loginBackground').style.display = 'none'; }, 350);
    var postArray = []; // Array of data to post
    localStorage.username = (val != null) && !submitEvt ? val[0] : document.getElementById('username').value;
    updateAvatar();
    for (var h in loginHeaders) {
        if (h.toLowerCase().indexOf('user') !== -1) {
            loginHeaders[h] = (val != null) && !submitEvt ? val[0] : document.getElementById('username').value;
        }
        if (h.toLowerCase().indexOf('pass') !== -1) {
            loginHeaders[h] = (val != null) && !submitEvt ? val[1] : document.getElementById('password').value;
        }
        postArray.push(encodeURIComponent(h) + '=' + encodeURIComponent(loginHeaders[h]));
    }
    // Now send the login request to PCR
    if (location.protocol === 'chrome-extension:') {
        console.time('Logging in');
        send(loginURL, 'document', { 'Content-type': 'application/x-www-form-urlencoded' }, postArray.join('&'), true)
            .then(function (resp) {
            console.timeEnd('Logging in');
            if (resp.responseURL.indexOf('Login') !== -1) {
                // If PCR still wants us to log in, then the username or password entered were incorrect.
                document.getElementById('loginIncorrect').style.display = 'block';
                document.getElementById('password').value = '';
                document.getElementById('login').classList.add('active');
                return document.getElementById('loginBackground').style.display = 'block';
            }
            else {
                // Otherwise, we are logged in
                if (document.getElementById('remember').checked) {
                    setCookie('userPass', window.btoa(document.getElementById('username').value + ':' + document.getElementById('password').value), 14); // Set a cookie with the username and password so we can log in automatically in the future without having to prompt for a username and password again
                }
                // loadingBar.style.display = "none"
                var t = Date.now();
                localStorage.lastUpdate = t;
                document.getElementById('lastUpdate').innerHTML = formatUpdate(t);
                try {
                    parse(resp.response); // Parse the data PCR has replied with
                }
                catch (e) {
                    console.log(e);
                    displayError(e);
                }
                return;
            }
        }, function (error) { return console.log('Could not log in to PCR. Either your network connection was lost during your visit or PCR is just not working. Here\'s the error:', error); });
    }
    else {
        send("/api/login?remember=" + document.getElementById('remember').checked, 'json', { 'Content-type': 'application/x-www-form-urlencoded' }, postArray.join('&'), true)
            .then(function (resp) {
            console.debug('Logging in:', resp.response.time);
            if (resp.response.login) {
                // If PCR still wants us to log in, then the username or password entered were incorrect.
                document.getElementById('loginIncorrect').style.display = 'block';
                document.getElementById('password').value = '';
                document.getElementById('login').classList.add('active');
                document.getElementById('loginBackground').style.display = 'block';
            }
            else {
                var t = Date.now();
                localStorage.lastUpdate = t;
                document.getElementById('lastUpdate').innerHTML = formatUpdate(t);
                window.data = resp.response.data;
                display();
                localStorage.data = JSON.stringify(data);
            }
        }, function (error) { return console.log('Could not log in to PCR. Either your network connection was lost during your visit or PCR is just not working. Here\'s the error:', error); });
    }
};
document.getElementById('login').addEventListener('submit', function (evt) {
    evt.preventDefault();
    return dologin(null, true);
});
// <a name="parsing"/>
// Parsing
// -------
//
// Below are now functions used to parse your assignments.
//
// In PCR's interface, you can click a date in month or week view to see it in day view.
// Therefore, the HTML element that shows the date that you can click on has a hyperlink that looks like `#2015-04-26`.
// The function below will parse that String and return a **Date**.
var parseDateHash = function (element) {
    var dateSplit = element.hash.substring(1).split('-');
    return (new Date(+dateSplit[0], +dateSplit[1] - 1, +dateSplit[2])).getTime();
};
// The *attachmentify* function parses the body of an assignment (*text*) and returns the assignment's attachments.
var attachmentify = function (element) {
    var attachments = [];
    // Get all links
    var as = element.getElementsByTagName('a');
    var a = 0;
    while (a < as.length) {
        if (as[a].id.indexOf('Attachment') !== -1) {
            attachments.push([
                as[a].innerHTML,
                as[a].search + as[a].hash,
            ]);
            as[a].remove();
            a--; // subtract because all elements have shifted down
        }
        a++;
    }
    return attachments;
};
// This function replaces text that represents a hyperlink with a functional hyperlink by using javascript's replace function with a regular expression if the text already isn't part of a hyperlink.
var urlify = function (text) {
    return text.replace(new RegExp("(https?:\\/\\/[-A-Z0-9+&@#\\/%?=~_|!:,.;]*[-A-Z0-9+&@#\\/%=~_|]+)", 'ig'), function (str, str2, offset) {
        if (/href\s*=\s*./.test(text.substring(offset - 10, offset)) ||
            /originalpath\s*=\s*./.test(text.substring(offset - 20, offset))) {
            return str;
        }
        else {
            return "<a href=\"" + str + "\">" + str + "</a>";
        }
    });
};
// Also, PCR"s interface uses a system of IDs to identify different elements. For example, the ID of one of the boxes showing the name of an assignment could be `ctl00_ctl00_baseContent_baseContent_flashTop_ctl00_RadScheduler1_95_0`.
// The function below will return the first HTML element whose ID contains a specified String (*id*) and containing a specified tag (*tag*).
var findId = function (element, tag, id) {
    for (var _i = 0, _c = element.getElementsByTagName(tag); _i < _c.length; _i++) {
        var e = _c[_i];
        if (e.id.indexOf(id) !== -1) {
            return e;
        }
    }
};
// Now, we get to the code intensive functions.
// The function below will parse the data given by PCR and convert it into an object.
// If you open up the developer console on CheckPCR and type in `data`, you can see the array containing all of your assignments.
var parse = function (doc) {
    console.time('Handling data'); // To time how long it takes to parse the assignments
    var handledDataShort = []; // Array used to make sure we don"t parse the same assignment twice.
    window.data = { classes: [], assignments: [], monthView: doc.querySelector('.rsHeaderMonth').parentNode.classList.contains('rsSelected') }; // Reset the array in which all of your assignments are stored in.
    for (var _i = 0, _c = doc.querySelectorAll('input:not([type="submit"])'); _i < _c.length; _i++) {
        var e = _c[_i];
        viewData[e.name] = e.value || '';
    }
    // Now, the classes you take are parsed (these are the checkboxes you see up top when looking at PCR).
    var classes = findId(doc, 'table', 'cbClasses').getElementsByTagName('label');
    for (var _d = 0, classes_1 = classes; _d < classes_1.length; _d++) {
        var c_2 = classes_1[_d];
        window.data.classes.push(c_2.innerHTML);
    }
    var assignments = doc.getElementsByClassName('rsApt rsAptSimple');
    // Now parse the assignments
    for (var _e = 0, assignments_1 = assignments; _e < assignments_1.length; _e++) {
        var ca = assignments_1[_e];
        var assignment = {};
        // The starting date and ending date of the assignment are parsed first
        var range = findId(ca, 'span', 'StartingOn').innerHTML.split(' - ');
        assignment.start = Math.floor((Date.parse(range[0])) / 1000 / 3600 / 24);
        assignment.end = (range[1] != null) ? Math.floor((Date.parse(range[1])) / 1000 / 3600 / 24) : assignment.start;
        // Then, the name of the assignment is parsed
        var t = findId(ca, 'span', 'lblTitle');
        var title = t.innerHTML;
        // The actual body of the assignment and its attachments are parsed next
        var b = t.parentNode.parentNode;
        var divs = b.getElementsByTagName('div');
        for (var d = 0; d < 2; d++) {
            divs[0].remove();
        }
        var ap = attachmentify(b); // Separates attachments from the body
        assignment.attachments = ap;
        assignment.body = urlify(b.innerHTML).replace(/^(?:\s*<br\s*\/?>)*/, '').replace(/(?:\s*<br\s*\/?>)*\s*$/, '').trim(); // The replaces remove leading and trailing newlines
        // Finally, we separate the class name and type (homework, classwork, or projects) from the title of the assignment
        var matchedTitle = title.match(/\(([^)]*\)*)\)$/);
        if ((matchedTitle == null)) {
            throw new Error("Could not parse assignment title \"" + title + "\"");
        }
        assignment.type = matchedTitle[1].toLowerCase().replace('& quizzes', '').replace('tests', 'test');
        assignment.baseType = (ca.title.substring(0, ca.title.indexOf('\n'))).toLowerCase().replace('& quizzes', '').replace(/\s/g, '');
        for (var pos = 0; pos < window.data.classes.length; pos++) {
            c = window.data.classes[pos];
            if (title.indexOf(c) !== -1) {
                assignment.class = pos;
                title = title.replace(c, '');
                break;
            }
        }
        assignment.title = title.substring(title.indexOf(': ') + 2).replace(/\([^\(\)]*\)$/, '').trim();
        // To make sure there are no repeats, the title of the assignment (only letters) and its start & end date are combined to give it a unique identifier.
        assignment.id = assignment.title.replace(/[^\w]*/g, '') + (assignment.start + assignment.end);
        if (handledDataShort.indexOf(assignment.id) === -1) {
            handledDataShort.push(assignment.id);
            window.data.assignments.push(assignment);
        }
    }
    console.timeEnd('Handling data');
    // Now allow the view to be switched
    document.body.classList.add('loaded');
    display(); // Display the data
    localStorage.data = JSON.stringify(data); // Store for offline use
};
// The view switching button needs an event handler.
document.getElementById('switchViews').addEventListener('click', function () {
    if (Object.keys(viewData).length > 0) {
        document.getElementById('sideBackground').click();
        viewData.__EVENTTARGET = 'ctl00$ctl00$baseContent$baseContent$flashTop$ctl00$RadScheduler1';
        viewData.__EVENTARGUMENT = JSON.stringify({ Command: "SwitchTo" + (document.body.getAttribute('data-pcrview') === 'month' ? 'Week' : 'Month') + "View" });
        viewData.ctl00_ctl00_baseContent_baseContent_flashTop_ctl00_RadScheduler1_ClientState = JSON.stringify({ scrollTop: 0, scrollLeft: 0, isDirty: false });
        viewData.ctl00_ctl00_RadScriptManager1_TSM = ';;System.Web.Extensions, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35:en-US:d28568d3-e53e-4706-928f-3765912b66ca:ea597d4b:b25378d2';
        var postArray = []; // Array of data to post
        for (var h in viewData) {
            var v = viewData[h];
            postArray.push(encodeURIComponent(h) + '=' + encodeURIComponent(v));
        }
        return fetch(true, postArray.join('&'));
    }
});
// The same goes for the log out button.
document.getElementById('logout').addEventListener('click', function () {
    if (Object.keys(viewData).length > 0) {
        deleteCookie('userPass');
        document.getElementById('sideBackground').click();
        viewData.__EVENTTARGET = 'ctl00$ctl00$baseContent$LogoutControl1$LoginStatus1$ctl00';
        viewData.__EVENTARGUMENT = '';
        viewData.ctl00_ctl00_baseContent_baseContent_flashTop_ctl00_RadScheduler1_ClientState = JSON.stringify({ scrollTop: 0, scrollLeft: 0, isDirty: false });
        var postArray = []; // Array of data to post
        for (var h in viewData) {
            var v = viewData[h];
            postArray.push(encodeURIComponent(h) + '=' + encodeURIComponent(v));
        }
        return fetch(true, postArray.join('&'));
    }
});
// <a name="displaying"/>
// Displaying the assignments
// --------------------------
//
// This is a little helper function to simplify the creation of HTML elements
var element = function (tag, cls, html, id) {
    var e = document.createElement(tag);
    if (typeof cls === 'string') {
        e.classList.add(cls);
    }
    else {
        for (var _i = 0, cls_1 = cls; _i < cls_1.length; _i++) {
            var c_3 = cls_1[_i];
            e.classList.add(c_3);
        }
    }
    if (html != null) {
        e.innerHTML = html;
    }
    if (id != null) {
        e.setAttribute('id', id);
    }
    return e;
};
// Another function that will return a human-readable date string
var dateString = function (date, addThis) {
    if (addThis === void 0) { addThis = false; }
    var middle;
    if (date === 'Forever') {
        return date;
    }
    var relative = ['Tomorrow', 'Today', 'Yesterday', '2 days ago'];
    var today = new Date();
    today.setDate(today.getDate() + 1);
    for (var _i = 0, relative_1 = relative; _i < relative_1.length; _i++) {
        var r = relative_1[_i];
        if ((date.getDate() === today.getDate()) && (date.getMonth() === today.getMonth()) && (date.getFullYear() === today.getFullYear())) {
            return r;
        }
        today.setDate(today.getDate() - 1);
    }
    today = new Date();
    // If the date is within 6 days of today, only display the day of the week
    if (0 < (middle = (date.getTime() - today.getTime()) / 1000 / 3600 / 24) && middle <= 6) {
        return (addThis ? 'This ' : '') + weekdays[date.getDay()];
    }
    return weekdays[date.getDay()] + ", " + fullMonths[date.getMonth()] + " " + date.getDate();
};
// This function separates the parts of a class name.
var separate = function (cl) {
    return cl.match(new RegExp("((?:\\d*\\s+)?(?:(?:hon\\w*|(?:adv\\w*\\s*)?core)\\s+)?)(.*)", 'i'));
};
// The one below scrolls smoothly to a y position.
var smoothScroll = function (to) {
    return new Promise(function (resolve, reject) {
        var start = null;
        var from = document.body.scrollTop;
        var amount = to - from;
        var step = function (timestamp) {
            if (start == null) {
                start = timestamp;
            }
            var progress = timestamp - start;
            window.scrollTo(0, from + (amount * (progress / 350)));
            if (progress < 350) {
                return requestAnimationFrame(step);
            }
            else {
                setTimeout(function () { return document.querySelector('nav').classList.remove('headroom--unpinned'); }, 1);
                return setTimeout(function () { return resolve(); }, amount);
            }
        };
        return requestAnimationFrame(step);
    });
};
// In order to display an assignment in the correct X position, classes with names eX and eX are used, where X is the number of squares to from the assignment to the left/right side of the screen.
// The function below determines which eX and sX class the given element has.
var getES = function (element) {
    var e = 0;
    var s = 0;
    for (var x = 0; x < 7; x++) {
        if (element.classList.contains("e" + x)) {
            e = x;
        }
        if (element.classList.contains("s" + x)) {
            s = x;
        }
    }
    return ["e" + e, "s" + s];
};
// Now the functions that actually display something are defined. First up is one to add an activity line to the activity panel.
var addActivity = function (type, assignment, newActivity, className) {
    if (className === void 0) { className = window.data.classes[assignment.class]; }
    if (className == null) {
        className = 'Unknown class';
    }
    var insertTo = document.getElementById('infoActivity');
    var date = newActivity === true ? Date.now() : newActivity;
    if (newActivity === true) {
        activity.push([type, assignment, Date.now(), className]);
    }
    var te = element('div', ['activity', 'assignmentItem', assignment.baseType, type], "<i class='material-icons'>" + type + "</i><span class='title'>" + assignment.title + "</span><small>" + separate(className)[2] + "</small><div class='range'>" + dateString(new Date(date)) + "</div>", "activity" + assignment.id);
    te.setAttribute('data-class', className);
    var id = assignment.id;
    if (type !== 'delete') {
        (function (id) {
            return te.addEventListener('click', function () {
                var doScrolling = function () {
                    var el = document.querySelector(".assignment[id*=\"" + id + "\"]");
                    return smoothScroll((el.getBoundingClientRect().top + document.body.scrollTop) - 116)
                        .then(function () {
                        el.click();
                    });
                };
                if (document.body.getAttribute('data-view') === '0') {
                    return doScrolling();
                }
                else {
                    document.querySelector('#navTabs>li:first-child').click();
                    return setTimeout(doScrolling, 500);
                }
            });
        })(id);
    }
    if (done.array.includes(assignment.id)) {
        te.classList.add('done');
    }
    return insertTo.insertBefore(te, insertTo.querySelector('.activity'));
};
// This function will convert the array of assignments generated by *parse* into readable HTML.
var display = function (doScroll) {
    if (doScroll === void 0) { doScroll = true; }
    var body, e, end, found, id, lastSun, month, n, nextSat, ns, s, span, spanRelative, start;
    var assignment;
    console.time('Displaying data');
    document.body.setAttribute('data-pcrview', window.data.monthView ? 'month' : 'other');
    var main = document.querySelector('main');
    var taken = {};
    var timeafter = {
        day: 24 * 3600 * 1000,
        ms: [24, 15 + (35 / 60), 15 + (35 / 60), 15 + (15 / 60), 15 + (15 / 60), 15 + (15 / 60), 24][(new Date()).getDay()],
        us: 15 * 3600 * 1000,
    }[localStorage.hideassignments] || (24 * 3600 * 1000);
    var today = Math.floor((Date.now() - tzoff) / 1000 / 3600 / 24);
    if (window.data.monthView) {
        start = Math.min.apply(Math, Array.from(((function () {
            var result = [];
            for (var _i = 0, _c = window.data.assignments; _i < _c.length; _i++) {
                assignment = _c[_i];
                result.push(assignment.start);
            }
            return result;
        })()) || [])); // Smallest date
        end = Math.max.apply(Math, Array.from(((function () {
            var result1 = [];
            for (var _i = 0, _c = window.data.assignments; _i < _c.length; _i++) {
                assignment = _c[_i];
                result1.push(assignment.end);
            }
            return result1;
        })()) || [])); // Largest date
        var year = (new Date()).getFullYear(); // For future calculations
        // Calculate what month we will be displaying by finding the month of today
        month = (new Date()).getMonth();
        // Make sure the start and end dates lie within the month
        start = new Date(Math.max(fromDateNum(start), (new Date(year, month)).getTime()));
        end = new Date(Math.min(fromDateNum(end), (new Date(year, month + 1, 0)).getTime())); // If the day argument for Date is 0, then the resulting date will be of the previous month
    }
    else {
        var todaySE = new Date();
        start = new Date(todaySE.getFullYear(), todaySE.getMonth(), todaySE.getDate());
        end = new Date(todaySE.getFullYear(), todaySE.getMonth(), todaySE.getDate());
    }
    // Set the start date to be a Sunday and the end date to be a Saturday
    start.setDate(start.getDate() - start.getDay());
    end.setDate(end.getDate() + (6 - end.getDay()));
    // First populate the calendar with boxes for each day
    var d = new Date(start);
    var wk = null;
    var lastData = localStorageRead('data');
    while (d <= end) {
        var day = void 0;
        if (d.getDay() === 0) {
            id = "wk" + d.getMonth() + "-" + d.getDate(); // Don't create a new week element if one already exists
            if (((document.getElementById(id)) == null)) {
                wk = element('section', 'week', null, "wk" + d.getMonth() + "-" + d.getDate());
                var dayTable = element('table', 'dayTable');
                var tr = dayTable.insertRow();
                for (day = 0; day < 7; day++) {
                    tr.insertCell();
                }
                wk.appendChild(dayTable);
                main.appendChild(wk);
            }
            else {
                wk = document.getElementById(id);
            }
        }
        if (wk.getElementsByClassName('day').length <= d.getDay()) {
            day = element('div', 'day', null, 'day');
            day.setAttribute('data-date', d.getTime());
            if (Math.floor((d.getTime() - d.getTimezoneOffset()) / 1000 / 3600 / 24) === today) {
                day.classList.add('today');
            }
            month = element('span', 'month', months[d.getMonth()]);
            day.appendChild(month);
            var date = element('span', 'date', d.getDate());
            day.appendChild(date);
            wk.appendChild(day);
        }
        taken[d] = [];
        d.setDate(d.getDate() + 1);
    }
    // Split assignments taking more than 1 week
    var split = [];
    for (var j = 0, num = j; j < window.data.assignments.length; j++, num = j) {
        assignment = window.data.assignments[num];
        if (localStorageRead('assignmentSpan') === 'multiple') {
            s = Math.max(start.getTime(), fromDateNum(assignment.start));
            e = Math.min(end.getTime(), fromDateNum(assignment.end));
            span = ((e - s) / 1000 / 3600 / 24) + 1; // Number of days assignment takes up
            spanRelative = 6 - (new Date(s)).getDay(); // Number of days until the next Saturday
            ns = new Date(s);
            ns.setDate(ns.getDate() + spanRelative); //e/1000/3600/24-spanRelative # The date of the next Saturday
            n = -6;
            while (n < (span - spanRelative)) {
                lastSun = new Date(ns);
                lastSun.setDate(lastSun.getDate() + n);
                nextSat = new Date(lastSun);
                nextSat.setDate(nextSat.getDate() + 6);
                split.push({
                    assignment: num,
                    start: new Date(Math.max(s, lastSun.getTime())),
                    end: new Date(Math.min(e, nextSat.getTime())),
                });
                n += 7;
            }
        }
        else if (localStorageRead('assignmentSpan') === 'start') {
            s = fromDateNum(assignment.start);
            if (s >= start.getTime()) {
                split.push({
                    assignment: num,
                    start: new Date(s),
                    end: new Date(s),
                });
            }
        }
        else if (localStorageRead('assignmentSpan') === 'end') {
            e = fromDateNum(assignment.end);
            if (e <= end.getTime()) {
                split.push({
                    assignment: num,
                    start: new Date(e),
                    end: new Date(e),
                });
            }
        }
        // Activity stuff
        if (lastData != null) {
            found = false;
            for (num = 0; num < lastData.assignments.length; num++) {
                var oldAssignment = lastData.assignments[num];
                if (oldAssignment.id === assignment.id) {
                    found = true;
                    if (oldAssignment.body !== assignment.body) {
                        addActivity('edit', oldAssignment, true, lastData.classes[oldAssignment.class]);
                        delete modified[assignment.id]; //If the assignment is modified, reset it
                    }
                    lastData.assignments.splice(num, 1);
                    break;
                }
            }
            if (!found) {
                addActivity('add', assignment, true);
            }
        }
    }
    if (lastData != null) {
        // Check if any of the last assignments weren't deleted (so they have been deleted in PCR)
        for (var _i = 0, _c = lastData.assignments; _i < _c.length; _i++) {
            assignment = _c[_i];
            addActivity('delete', assignment, true, lastData.classes[assignment.class]);
            if (done.indexOf(assignment.id) >= 0) {
                done.splice(done.indexOf(assignment.id), 1);
            }
            delete modified[assignment.id];
        }
        // Then save activity
        localStorage.activity = JSON.stringify(activity.slice(activity.length - 128, activity.length)); // save a maximum of 128 activity items
        // And completed assignments + modifications
        done.save();
        localStorage.modified = JSON.stringify(modified);
    }
    // Add custom assignments to the split array
    for (var _d = 0, extra_1 = extra; _d < extra_1.length; _d++) {
        var custom = extra_1[_d];
        var cls = null;
        if (custom.class != null) {
            for (n = 0; n < data.classes.length; n++) {
                var c_4 = data.classes[n];
                if (c_4.toLowerCase().indexOf(custom.class) !== -1) {
                    cls = n;
                    break;
                }
            }
        }
        // Same logic as above
        var taskAssignment = {
            title: 'Task',
            baseType: 'task',
            attachments: [],
            start: custom.start,
            end: custom.end || 'Forever',
            body: custom.body,
            id: "task" + custom.body.replace(/[^\w]*/g, '') + custom.start + custom.end + custom.class,
            class: cls,
        };
        if (localStorageRead('assignmentSpan') === 'multiple') {
            s = Math.max(start.getTime(), fromDateNum(custom.start));
            e = Math.min(end.getTime(), fromDateNum((custom.end != null) ? custom.end : custom.start));
            span = ((e - s) / 1000 / 3600 / 24) + 1; // Number of days assignment takes up
            spanRelative = 6 - (new Date(s)).getDay(); // Number of days until the next Saturday
            ns = new Date(s);
            ns.setDate(ns.getDate() + spanRelative); //e/1000/3600/24-spanRelative # The date of the next Saturday
            n = -6;
            while (n < (span - spanRelative)) {
                lastSun = new Date(ns);
                lastSun.setDate(lastSun.getDate() + n);
                nextSat = new Date(lastSun);
                nextSat.setDate(nextSat.getDate() + 6);
                split.push({
                    start: new Date(Math.max(s, lastSun.getTime())),
                    end: new Date(Math.min(e, nextSat.getTime())),
                    custom: true,
                    assignment: taskAssignment,
                    reference: custom,
                });
                n += 7;
            }
        }
        else if (localStorageRead('assignmentSpan') === 'start') {
            s = fromDateNum(custom.start);
            if (s >= start.getTime()) {
                split.push({
                    start: new Date(s),
                    end: new Date(s),
                    custom: true,
                    assignment: taskAssignment,
                    reference: custom,
                });
            }
        }
        else if (localStorageRead('assignmentSpan') === 'end') {
            e = fromDateNum(custom.end);
            if (e <= end.getTime()) {
                split.push({
                    start: new Date(e),
                    end: new Date(e),
                    custom: true,
                    assignment: taskAssignment,
                    reference: custom,
                });
            }
        }
    }
    // Calculate the today's week id
    var tdst = new Date();
    tdst.setDate(tdst.getDate() - tdst.getDay());
    var todayWkId = "wk" + tdst.getMonth() + "-" + tdst.getDate();
    // Then add assignments
    var weekHeights = {};
    var previousAssignments = {};
    for (var _e = 0, _f = document.getElementsByClassName('assignment'); _e < _f.length; _e++) {
        assignment = _f[_e];
        previousAssignments[assignment.getAttribute('id')] = assignment;
    }
    var separateTaskClass = JSON.parse(localStorage.sepTaskClass);
    var _loop_1 = function () {
        var added = void 0, deleted = void 0, diff, m = void 0, pos = void 0, te;
        assignment = s.custom ? s.assignment : window.data.assignments[s.assignment];
        var reference = s.reference;
        // Separate the class description from the actual class
        var separated = separate((assignment.class != null) ? window.data.classes[assignment.class] : 'Task');
        var startSun = new Date(s.start.getTime());
        startSun.setDate(startSun.getDate() - startSun.getDay());
        var weekId = "wk" + startSun.getMonth() + "-" + startSun.getDate();
        var smallTag = 'small';
        var link = null;
        if ((athenaData != null) && (athenaData[window.data.classes[assignment.class]] != null)) {
            (link = athenaData[window.data.classes[assignment.class]].link);
            smallTag = 'a';
        }
        e = element('div', ['assignment', assignment.baseType, 'anim'], "<" + smallTag + ((link != null) ? " href='" + link + "' class='linked' target='_blank'" : '') + "><span class='extra'>" + separated[1] + "</span>" + separated[2] + "</" + smallTag + "><span class='title'>" + assignment.title + "</span><input type='hidden' class='due' value='" + (isNaN(assignment.end) ? 0 : assignment.end) + "' />", assignment.id + weekId);
        if (((reference != null) && reference.done) || done.array.includes(assignment.id)) {
            e.classList.add('done');
        }
        e.setAttribute('data-class', s.custom && separateTaskClass ? 'Task' : window.data.classes[assignment.class]);
        var close_1 = element('a', ['close', 'material-icons'], 'close');
        close_1.addEventListener('click', closeOpened);
        e.appendChild(close_1);
        if (link != null) {
            e.querySelector('a').addEventListener('click', function (evt) {
                var el = evt.target;
                while (!el.classList.contains('assignment')) {
                    el = el.parentNode;
                }
                if (!((document.body.getAttribute('data-view') !== '0') || el.classList.contains('full'))) {
                    return evt.preventDefault();
                }
            });
        }
        var complete = element('a', ['complete', 'material-icons', 'waves'], 'done');
        ripple(complete);
        (id = assignment.id);
        (function (id, reference) {
            return complete.addEventListener('mouseup', function (evt) {
                if (evt.which === 1) {
                    var el_1 = this.parentNode;
                    var added_1 = true;
                    if (reference != null) {
                        if (el_1.classList.contains('done')) {
                            reference.done = false;
                        }
                        else {
                            added_1 = false;
                            reference.done = true;
                        }
                        localStorage.extra = JSON.stringify(extra);
                    }
                    else {
                        if (el_1.classList.contains('done')) {
                            done.splice(done.indexOf(id), 1);
                        }
                        else {
                            added_1 = false;
                            done.push(id);
                        }
                        done.save();
                    }
                    if (document.body.getAttribute('data-view') === '1') {
                        setTimeout(function () {
                            for (var _i = 0, _c = document.querySelectorAll(".assignment[id^=\"" + id + "\"], #test" + id + ", #activity" + id + ", #ia" + id); _i < _c.length; _i++) {
                                var elem = _c[_i];
                                elem.classList.toggle('done');
                            }
                            if (added_1) {
                                if (document.querySelectorAll('.assignment.listDisp:not(.done)').length !== 0) {
                                    document.body.classList.remove('noList');
                                }
                            }
                            else {
                                if (document.querySelectorAll('.assignment.listDisp:not(.done)').length === 0) {
                                    document.body.classList.add('noList');
                                }
                            }
                            return resize();
                        }, 100);
                    }
                    else {
                        for (var _i = 0, _c = document.querySelectorAll(".assignment[id^=\"" + id + "\"], #test" + id + ", #activity" + id + ", #ia" + id); _i < _c.length; _i++) {
                            var elem = _c[_i];
                            elem.classList.toggle('done');
                        }
                        if (added_1) {
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
        })(id, reference);
        e.appendChild(complete);
        // If the assignment is a custom one, add a button to delete it
        if (s.custom) {
            var deleteA_1 = element('a', ['material-icons', 'deleteAssignment', 'waves'], 'delete');
            (function (reference, e) {
                ripple(deleteA_1);
                return deleteA_1.addEventListener('mouseup', function (evt) {
                    if (evt.which === 1) {
                        extra.splice(extra.indexOf(reference), 1);
                        localStorage.extra = JSON.stringify(extra);
                        if (document.querySelector('.full') != null) {
                            document.body.style.overflow = 'auto';
                            var back_1 = document.getElementById('background');
                            back_1.classList.remove('active');
                            setTimeout(function () { return back_1.style.display = 'none'; }, 350);
                        }
                        e.remove();
                        return display(false);
                    }
                });
            })(reference, e);
            e.appendChild(deleteA_1);
        }
        // Modification button
        var edit = element('a', ['editAssignment', 'material-icons', 'waves'], 'edit');
        (function (id) {
            return edit.addEventListener('mouseup', function (evt) {
                if (evt.which === 1) {
                    var el_2 = evt.target;
                    while (!el_2.classList.contains('editAssignment')) {
                        el_2 = el_2.parentNode;
                    }
                    var remove = el_2.classList.contains('active');
                    el_2.classList.toggle('active');
                    el_2.parentNode.querySelector('.body').setAttribute('contentEditable', remove ? 'false' : 'true');
                    if (!remove) {
                        el_2.parentNode.querySelector('.body').focus();
                    }
                    var dn = el_2.parentNode.querySelector('.complete');
                    dn.style.display = remove ? 'block' : 'none';
                }
            });
        })(id);
        ripple(edit);
        e.appendChild(edit);
        start = new Date(fromDateNum(assignment.start));
        end = isNaN(assignment.end) ? assignment.end : new Date(fromDateNum(assignment.end));
        var times = element('div', 'range', assignment.start === assignment.end ? dateString(start) : dateString(start) + " &ndash; " + dateString(end));
        e.appendChild(times);
        if (assignment.attachments.length > 0) {
            var attachments_1 = element('div', 'attachments');
            for (var _i = 0, _c = assignment.attachments; _i < _c.length; _i++) {
                var attachment = _c[_i];
                (function (attachment) {
                    var a = element('a', [], attachment[0]);
                    a.href = location.protocol === 'chrome-extension:' ? "https://webappsca.pcrsoft.com/Clue/Common/AttachmentRender.aspx" + attachment[1] : "/api/attachment" + attachment[1];
                    var req = new XMLHttpRequest();
                    req.open('HEAD', a.href);
                    req.onload = function () {
                        if (req.status === 200) {
                            var type = req.getResponseHeader('Content-Type');
                            if (mimeTypes[type] != null) {
                                a.classList.add(mimeTypes[type][1]);
                                span = element('span', [], mimeTypes[type][0]);
                            }
                            else {
                                span = element('span', [], 'Unknown file type');
                            }
                            a.appendChild(span);
                        }
                    };
                    req.send();
                    attachments_1.appendChild(a);
                })(attachment);
            }
            e.appendChild(attachments_1);
        }
        body = element('div', 'body', assignment.body.replace(/font-family:[^;]*?(?:Times New Roman|serif)[^;]*/g, ''));
        var edits = element('div', 'edits', '<span class=\'additions\'></span><span class=\'deletions\'></span>');
        if ((m = modified[assignment.id]) != null) {
            d = dmp.diff_main(assignment.body, m);
            dmp.diff_cleanupSemantic(d);
            if (d.length !== 0) {
                added = 0;
                deleted = 0;
                for (var _d = 0, d_1 = d; _d < d_1.length; _d++) {
                    diff = d_1[_d];
                    if (diff[0] === 1) {
                        added++;
                    }
                    if (diff[0] === -1) {
                        deleted++;
                    }
                }
                edits.querySelector('.additions').innerHTML = added !== 0 ? "+" + added : '';
                edits.querySelector('.deletions').innerHTML = deleted !== 0 ? "-" + deleted : '';
                edits.classList.add('notEmpty');
                body.innerHTML = m;
            }
        }
        (function (b, ad, di, ed, id, ref) {
            return body.addEventListener('input', function (evt) {
                if (ref != null) {
                    ref.body = evt.target.innerHTML;
                    localStorage.extra = JSON.stringify(extra);
                }
                else {
                    modified[id] = evt.target.innerHTML;
                    localStorage.modified = JSON.stringify(modified);
                    d = dmp.diff_main(b, evt.target.innerHTML);
                    dmp.diff_cleanupSemantic(d);
                    var additions = 0;
                    var deletions = 0;
                    for (var _i = 0, d_2 = d; _i < d_2.length; _i++) {
                        diff = d_2[_i];
                        if (diff[0] === 1) {
                            additions++;
                        }
                        if (diff[0] === -1) {
                            deletions++;
                        }
                    }
                    ad.innerHTML = additions !== 0 ? "+" + additions : '';
                    di.innerHTML = deletions !== 0 ? "-" + deletions : '';
                    if ((additions !== 0) || (deletions !== 0)) {
                        ed.classList.add('notEmpty');
                    }
                    else {
                        ed.classList.remove('notEmpty');
                    }
                }
                if (document.body.getAttribute('data-view') === '1') {
                    return resize();
                }
            });
        })(assignment.body, edits.querySelector('.additions'), edits.querySelector('.deletions'), edits, assignment.id, reference);
        e.appendChild(body);
        var restore = element('a', ['material-icons', 'restore'], 'settings_backup_restore');
        (function (b, bd, ed, id) {
            return restore.addEventListener('click', function () {
                delete modified[id];
                localStorage.modified = JSON.stringify(modified);
                bd.innerHTML = b;
                ed.classList.remove('notEmpty');
                if (document.body.getAttribute('data-view') === '1') {
                    return resize();
                }
            });
        })(assignment.body, body, edits, assignment.id);
        edits.appendChild(restore);
        e.appendChild(edits);
        var mods = element('div', ['mods']);
        for (var _e = 0, _f = activity.slice(activity.length - 32, activity.length); _e < _f.length; _e++) {
            var a = _f[_e];
            if ((a[0] === 'edit') && (a[1].id === assignment.id)) {
                d = dmp.diff_main(a[1].body, assignment.body);
                dmp.diff_cleanupSemantic(d);
                added = 0;
                deleted = 0;
                for (var _g = 0, d_3 = d; _g < d_3.length; _g++) {
                    diff = d_3[_g];
                    if (diff[0] === 1) {
                        added++;
                    }
                    if (diff[0] === -1) {
                        deleted++;
                    }
                }
                te = element('div', ['innerActivity', 'assignmentItem', assignment.baseType], "<i class='material-icons'>edit</i><span class='title'>" + dateString(new Date(a[2])) + "</span><span class='additions'>" + (added !== 0 ? "+" + added : '') + "</span><span class='deletions'>" + (deleted !== 0 ? "-" + deleted : '') + "</span>", "ia" + assignment.id);
                te.setAttribute('data-class', window.data.classes[assignment.class]);
                te.appendChild(element('div', 'iaDiff', dmp.diff_prettyHtml(d)));
                te.addEventListener('click', function () {
                    this.classList.toggle('active');
                    if (document.body.getAttribute('data-view') === '1') {
                        return resize();
                    }
                });
                mods.appendChild(te);
            }
        }
        e.appendChild(mods);
        if ((localStorageRead('assignmentSpan') === 'multiple') && (start < s.start)) {
            e.classList.add('fromWeekend');
        }
        if ((localStorageRead('assignmentSpan') === 'multiple') && (end > s.end)) {
            e.classList.add('overWeekend');
        }
        e.classList.add("s" + s.start.getDay());
        e.classList.add(isNaN(s.end) ? "e" + (6 - s.start.getDay()) : "e" + (6 - s.end.getDay()));
        var st = Math.floor(s.start / 1000 / 3600 / 24);
        if (s.assignment.end === 'Forever') {
            if (st <= (today + listDateOffset)) {
                e.classList.add('listDisp');
            }
        }
        else {
            var middle = void 0;
            var midDate = new Date();
            midDate.setDate(midDate.getDate() + listDateOffset);
            if (((st - ((assignment.baseType === 'test') && (assignment.start === st) ? JSON.parse(localStorage.earlyTest) : 0)) * 1000 * 3600 * 24) + tzoff <= (middle = midDate.getTime()) && middle <= s.end.getTime() + (listDateOffset === 0 ? timeafter : 24 * 3600 * 1000)) {
                e.classList.add('listDisp');
            }
        }
        // Calculate how many assignments are placed before the current one
        if (!s.custom || !JSON.parse(localStorage.sepTasks)) {
            pos = 0;
            while (true) {
                found = true;
                d = new Date(s.start);
                while (d <= s.end) {
                    if (taken[d].indexOf(pos) !== -1) {
                        found = false;
                    }
                    d.setDate(d.getDate() + 1);
                }
                if (found) {
                    break;
                }
                pos++;
            }
            // Append the position the assignment is at to the taken array
            d = new Date(s.start);
            while (d <= s.end) {
                taken[d].push(pos);
                d.setDate(d.getDate() + 1);
            }
            // Calculate how far down the assignment must be placed as to not block the ones above it
            e.style.marginTop = (pos * 30) + 'px';
        }
        // Add click interactivity
        if (!s.custom || !JSON.parse(localStorage.sepTasks)) {
            e.addEventListener('click', function (evt) {
                var el = evt.target;
                while (!el.classList.contains('assignment')) {
                    el = el.parentNode;
                }
                if ((document.getElementsByClassName('full').length === 0) && (document.body.getAttribute('data-view') === '0')) {
                    el.classList.remove('anim');
                    el.classList.add('modify');
                    el.style.top = (el.getBoundingClientRect().top - document.body.scrollTop - parseInt(el.style.marginTop)) + 44 + 'px';
                    el.setAttribute('data-top', el.style.top);
                    document.body.style.overflow = 'hidden';
                    var back = document.getElementById('background');
                    back.classList.add('active');
                    back.style.display = 'block';
                    el.classList.add('anim');
                    setTimeout(function () {
                        el.classList.add('full');
                        el.style.top = (75 - parseInt(el.style.marginTop)) + 'px';
                        return setTimeout(function () { return el.classList.remove('anim'); }, 350);
                    }, 0);
                }
            });
        }
        // Append the assignment to the correct week element and set its height to contain the assignments in it
        wk = document.getElementById(weekId);
        if ((wk == null)) {
            return "continue";
        } // Don't add the assignment if the week doesn't exist
        // If the assignment is a test and is upcoming, add it to the upcoming tests panel.
        if (((assignment.baseType === 'test') || (localStorageRead('projectsInTestPane') && (assignment.baseType === 'longterm'))) && (assignment.end >= today)) {
            te = element('div', ['upcomingTest', 'assignmentItem', assignment.baseType], "<i class='material-icons'>" + (assignment.baseType === 'longterm' ? 'assignment' : 'assessment') + "</i><span class='title'>" + assignment.title + "</span><small>" + separated[2] + "</small><div class='range'>" + dateString(end, true) + "</div>", "test" + assignment.id);
            te.setAttribute('data-class', window.data.classes[assignment.class]);
            (id = assignment.id);
            (function (id) {
                return te.addEventListener('click', function () {
                    var doScrolling = function () {
                        var el = document.querySelector(".assignment[id*=\"" + id + "\"]");
                        return smoothScroll((el.getBoundingClientRect().top + document.body.scrollTop) - 116)
                            .then(function () {
                            el.click();
                        });
                    };
                    if (document.body.getAttribute('data-view') === '0') {
                        return doScrolling();
                    }
                    else {
                        document.querySelector('#navTabs>li:first-child').click();
                        return setTimeout(doScrolling, 500);
                    }
                });
            })(id);
            if (done.array.includes(assignment.id)) {
                te.classList.add('done');
            }
            if (document.getElementById("test" + assignment.id) != null) {
                document.getElementById("test" + assignment.id).innerHTML = te.innerHTML;
            }
            else {
                document.getElementById('infoTests').appendChild(te);
            }
        }
        if ((weekHeights[weekId] == null) || (pos > weekHeights[weekId])) {
            weekHeights[weekId] = pos;
            wk.style.height = 47 + ((pos + 1) * 30) + 'px';
        }
        var already = document.getElementById(assignment.id + weekId);
        if (already != null) {
            already.style.marginTop = e.style.marginTop;
            already.setAttribute('data-class', s.custom && separateTaskClass ? 'Task' : window.data.classes[assignment.class]);
            if ((modified[assignment.id] == null)) {
                already.getElementsByClassName('body')[0].innerHTML = e.getElementsByClassName('body')[0].innerHTML;
            }
            already.querySelector('.edits').className = e.querySelector('.edits').className;
            if (already.classList.toggle != null) {
                already.classList.toggle('listDisp', e.classList.contains('listDisp'));
            }
            for (var _h = 0, _j = getES(already); _h < _j.length; _h++) {
                var cl = _j[_h];
                already.classList.remove(cl);
            }
            for (var _k = 0, _l = getES(e); _k < _l.length; _k++) {
                cl = _l[_k];
                already.classList.add(cl);
            }
            for (var _m = 0, _o = ['fromWeekend', 'overWeekend']; _m < _o.length; _m++) {
                cl = _o[_m];
                already.classList.remove(cl);
                if (e.classList.contains(cl)) {
                    already.classList.add(cl);
                }
            }
        }
        else {
            if (s.custom && JSON.parse(localStorage.sepTasks)) {
                if ((assignment.start === st) && (assignment.end >= today)) {
                    e.classList.remove('assignment');
                    e.classList.add('taskPaneItem');
                    e.style.order = assignment.end;
                    if ((link = e.querySelector('.linked')) != null) {
                        e.insertBefore(element('small', [], link.innerHTML), link);
                        link.remove();
                    }
                    document.getElementById('infoTasksInner').appendChild(e);
                }
            }
            else {
                wk.appendChild(e);
            }
        }
        delete previousAssignments[assignment.id + weekId];
    };
    for (var _g = 0, split_1 = split; _g < split_1.length; _g++) {
        s = split_1[_g];
        _loop_1();
    }
    // Delete any assignments that have been deleted since updating
    for (var name_1 in previousAssignments) {
        assignment = previousAssignments[name_1];
        if (assignment.classList.contains('full')) {
            document.getElementById('background').classList.remove('active');
        }
        assignment.remove();
    }
    // Scroll to the correct position in calendar view
    if (weekHeights[todayWkId] != null) {
        var h = 0;
        var sw = function (wkid) { return wkid.substring(2).split('-').map(function (x) { return parseInt(x); }); };
        var todayWk = sw(todayWkId);
        for (var wkId in weekHeights) {
            var val = weekHeights[wkId];
            wk = sw(wkId);
            if ((wk[0] < todayWk[0]) || ((wk[0] === todayWk[0]) && (wk[1] < todayWk[1]))) {
                h += val;
            }
        }
        scroll = (h * 30) + 112 + 14;
        if (scroll < 50) {
            scroll = 0;
        } // Also show the day headers if today's date is displayed in the first row of the calendar
        if (doScroll && (document.body.getAttribute('data-view') === '0') && !document.body.querySelector('.full')) {
            window.scrollTo(0, scroll);
        }
    }
    document.body.classList.toggle('noList', document.querySelectorAll('.assignment.listDisp:not(.done)').length === 0);
    if (document.body.getAttribute('data-view') === '1') {
        resize();
    }
    return console.timeEnd('Displaying data');
};
// Below is a function to close the current assignment that is opened.
var closeOpened = function (evt) {
    evt.stopPropagation();
    var el = document.querySelector('.full');
    if ((el == null)) {
        return;
    }
    el.style.top = el.getAttribute('data-top');
    el.classList.add('anim');
    el.classList.remove('full');
    el.scrollTop = 0;
    document.body.style.overflow = 'auto';
    var back = document.getElementById('background');
    back.classList.remove('active');
    return setTimeout(function () {
        back.style.display = 'none';
        el.classList.remove('anim');
        el.classList.remove('modify');
        el.style.top = 'auto';
        el.offsetHeight;
        return el.classList.add('anim');
    }, 1000);
};
// Now we assign it to clicking the background.
document.getElementById('background').addEventListener('click', closeOpened);
// And a function to apply an ink effect
var ripple = function (el) {
    el.addEventListener('mousedown', function (evt) {
        if (evt.which === 1) {
            var target = evt.target.classList.contains('wave') ? evt.target.parentNode : evt.target;
            var wave = element('span', 'wave');
            var size = Math.max(parseInt(target.offsetWidth), parseInt(target.offsetHeight));
            wave.style.width = (wave.style.height = size + 'px');
            var e = evt.target;
            var x = evt.clientX;
            var y = evt.clientY;
            var rect = e.getBoundingClientRect();
            x -= rect.left;
            y -= rect.top;
            wave.style.top = (y - (size / 2)) + 'px';
            wave.style.left = (x - (size / 2)) + 'px';
            target.appendChild(wave);
            wave.setAttribute('data-hold', Date.now());
            wave.offsetWidth;
            wave.style.transform = 'scale(2.5)';
        }
    });
    el.addEventListener('mouseup', function (evt) {
        if (evt.which === 1) {
            var target = evt.target.classList.contains('wave') ? evt.target.parentNode : evt.target;
            var waves = target.getElementsByClassName('wave');
            for (var _i = 0, waves_1 = waves; _i < waves_1.length; _i++) {
                var wave = waves_1[_i];
                (function (wave) {
                    var diff = Date.now() - Number(wave.getAttribute('data-hold'));
                    var delay = Math.max(350 - diff, 0);
                    return setTimeout(function () {
                        wave.style.opacity = '0';
                        return setTimeout(function () { return wave.remove(); }, 550);
                    }, delay);
                })(wave);
            }
        }
    });
};
// Then, the tabs are made interactive.
for (var _i = 0, _c = document.querySelectorAll('#navTabs>li'); _i < _c.length; _i++) {
    var tab = _c[_i];
    tab.addEventListener('click', function (evt) {
        if (typeof ga !== 'undefined' && ga !== null) {
            ga('send', 'event', 'navigation', evt.target.textContent, {
                page: '/new.html',
                title: "Version " + version,
            });
        }
        var trans = JSON.parse(localStorage.viewTrans);
        if (!trans) {
            document.body.classList.add('noTrans');
            document.body.offsetHeight;
        }
        document.body.setAttribute('data-view', (localStorage.view = (Array.prototype.slice.call(document.querySelectorAll('#navTabs>li'))).indexOf(evt.target)));
        if (document.body.getAttribute('data-view') === '1') {
            window.addEventListener('resize', resizeCaller);
            if (trans) {
                var start_1 = null;
                // The code below is the same code used in the resize() function. It basically just positions the assignments correctly as they animate
                var widths = document.body.classList.contains('showInfo') ? [650, 1100, 1800, 2700, 3800, 5100] : [350, 800, 1500, 2400, 3500, 4800];
                var columns_1 = null;
                for (var index = 0; index < widths.length; index++) {
                    var w = widths[index];
                    if (window.innerWidth > w) {
                        columns_1 = index + 1;
                    }
                }
                var assignments_2 = getResizeAssignments();
                var columnHeights_1 = (__range__(0, columns_1, false).map(function (j) { return 0; }));
                var step_1 = function (timestamp) {
                    if (start_1 == null) {
                        start_1 = timestamp;
                    }
                    for (var n = 0; n < assignments_2.length; n++) {
                        var assignment = assignments_2[n];
                        var col = n % columns_1;
                        if (n < columns_1) {
                            columnHeights_1[col] = 0;
                        }
                        assignment.style.top = columnHeights_1[col] + 'px';
                        assignment.style.left = ((100 / columns_1) * col) + '%';
                        assignment.style.right = ((100 / columns_1) * (columns_1 - col - 1)) + '%';
                        columnHeights_1[col] += assignment.offsetHeight + 24;
                    }
                    if ((timestamp - start_1) < 350) {
                        return window.requestAnimationFrame(step_1);
                    }
                };
                window.requestAnimationFrame(step_1);
                setTimeout(function () {
                    for (var n = 0; n < assignments_2.length; n++) {
                        var assignment = assignments_2[n];
                        var col = n % columns_1;
                        if (n < columns_1) {
                            columnHeights_1[col] = 0;
                        }
                        assignment.style.top = columnHeights_1[col] + 'px';
                        columnHeights_1[col] += assignment.offsetHeight + 24;
                    }
                }, 350);
            }
            else {
                resize();
            }
        }
        else {
            window.scrollTo(0, scroll);
            document.querySelector('nav').classList.add('headroom--locked');
            setTimeout(function () {
                document.querySelector('nav').classList.remove('headroom--unpinned');
                document.querySelector('nav').classList.remove('headroom--locked');
                document.querySelector('nav').classList.add('headroom--pinned');
                return requestIdleCallback(function () {
                    listDateOffset = 0;
                    updateListNav();
                    return display();
                }, { timeout: 2000 });
            }, 350);
            window.removeEventListener('resize', resizeCaller);
            for (var _i = 0, _c = document.getElementsByClassName('assignment'); _i < _c.length; _i++) {
                var assignment = _c[_i];
                assignment.style.top = 'auto';
            }
        }
        if (!trans) {
            document.body.offsetHeight;
            setTimeout(function () { return document.body.classList.remove('noTrans'); }, 350);
        }
    });
}
// And the info tabs (just a little less code)
for (var _d = 0, _e = document.querySelectorAll('#infoTabs>li'); _d < _e.length; _d++) {
    tab = _e[_d];
    tab.addEventListener('click', function (evt) { return document.getElementById('info').setAttribute('data-view', (Array.prototype.slice.call(document.querySelectorAll('#infoTabs>li'))).indexOf(evt.target)); });
}
// For list view, the assignments can't be on top of each other.
// Therefore, a listener is attached to the resizing of the browser window.
var ticking = false;
var timeoutId = null;
var getResizeAssignments = function () {
    var assignments = Array.prototype.slice.call(document.querySelectorAll(document.body.classList.contains('showDone') ? '.assignment.listDisp' : '.assignment.listDisp:not(.done)'));
    assignments.sort(function (a, b) {
        var ad = a.classList.contains('done');
        var bd = b.classList.contains('done');
        if (ad && !bd) {
            return 1;
        }
        if (bd && !ad) {
            return -1;
        }
        return a.getElementsByClassName('due')[0].value - b.getElementsByClassName('due')[0].value;
    });
    return assignments;
};
var resizeCaller = function () {
    if (!ticking) {
        requestAnimationFrame(resize);
        return ticking = true;
    }
};
var resize = function () {
    var k;
    var assignment, col, n;
    var i1;
    ticking = true;
    //To calculate the number of columns, the below algorithm is used becase as the screen size increases, the column width increases
    var widths = document.body.classList.contains('showInfo') ? [650, 1100, 1800, 2700, 3800, 5100] : [350, 800, 1500, 2400, 3500, 4800];
    var columns = 1;
    for (var index = 0; index < widths.length; index++) {
        var w = widths[index];
        if (window.innerWidth > w) {
            columns = index + 1;
        }
    }
    var columnHeights = (__range__(0, columns, false).map(function (j) { return 0; }));
    var cch = [];
    var assignments = getResizeAssignments();
    for (k = 0, n = k; k < assignments.length; k++, n = k) {
        assignment = assignments[n];
        col = n % columns;
        cch.push(columnHeights[col]);
        columnHeights[col] += assignment.offsetHeight + 24;
    }
    for (i1 = 0, n = i1; i1 < assignments.length; i1++, n = i1) {
        assignment = assignments[n];
        col = n % columns;
        assignment.style.top = cch[n] + 'px';
        assignment.style.left = ((100 / columns) * col) + '%';
        assignment.style.right = ((100 / columns) * (columns - col - 1)) + '%';
    }
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
        cch.length = 0;
        for (n = 0; n < assignments.length; n++) {
            assignment = assignments[n];
            col = n % columns;
            if (n < columns) {
                columnHeights[col] = 0;
            }
            cch.push(columnHeights[col]);
            columnHeights[col] += assignment.offsetHeight + 24;
        }
        for (n = 0; n < assignments.length; n++) {
            assignment = assignments[n];
            assignment.style.top = cch[n] + 'px';
        }
    }, 500);
    ticking = false;
};
// The view is set to what it was last.
if (localStorage.view != null) {
    document.body.setAttribute('data-view', localStorage.view);
    if (localStorage.view === '1') {
        window.addEventListener('resize', resizeCaller);
    }
}
// Additionally, the active class needs to be added when inputs are selected (for the login box).
for (var _f = 0, _g = document.querySelectorAll('input[type=text]:not(#newText):not([readonly]), input[type=password], input[type=email], input[type=url], input[type=tel], input[type=number]:not(.control), input[type=search]'); _f < _g.length; _f++) {
    var input = _g[_f];
    input.addEventListener('change', function (evt) { return evt.target.parentNode.querySelector('label').classList.add('active'); });
    input.addEventListener('focus', function (evt) { return evt.target.parentNode.querySelector('label').classList.add('active'); });
    input.addEventListener('blur', function (evt) {
        if (evt.target.value.length === 0) {
            return evt.target.parentNode.querySelector('label').classList.remove('active');
        }
    });
}
// When the escape key is pressed, the current assignment should be closed.
window.addEventListener('keydown', function (evt) {
    if (evt.which === 27) {
        if (document.getElementsByClassName('full').length !== 0) {
            return closeOpened(new Event('Generated Event'));
        }
    }
});
// If it's winter time, a class is added to the body element.
(function () {
    var today = new Date();
    if (new Date(today.getFullYear(), 10, 27) <= today && today <= new Date(today.getFullYear(), 11, 32)) {
        return document.body.classList.add('winter');
    }
})();
// For the navbar toggle buttons, a function to toggle the action is defined to eliminate code.
var navToggle = function (element, ls, f) {
    ripple(document.getElementById(element));
    document.getElementById(element).addEventListener('mouseup', function () {
        document.body.classList.toggle(ls);
        resize();
        localStorage[ls] = JSON.stringify(document.body.classList.contains(ls));
        if (f != null) {
            return f();
        }
    });
    if ((localStorage[ls] != null) && JSON.parse(localStorage[ls])) {
        return document.body.classList.add(ls);
    }
};
// The button to show/hide completed assignments in list view also needs event listeners.
navToggle('cvButton', 'showDone', function () { return setTimeout(resize, 1000); });
// The same goes for the button that shows upcoming tests.
if (localStorage.showInfo == null) {
    localStorage.showInfo = JSON.stringify(true);
}
navToggle('infoButton', 'showInfo');
// This also gets repeated for the theme toggling.
navToggle('lightButton', 'dark');
// For ease of animations, a function that returns a promise is defined.
var animateEl = function (el) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return new Promise(function (resolve, reject) {
        var player = el.animate.apply(el, Array.from(args || []));
        return player.onfinish = function (e) { return resolve(e); };
    });
};
// In order to make the previous date / next date buttons do something, they need event listeners.
document.getElementById('listnext').addEventListener('click', function () {
    var pd = document.getElementById('listprevdate');
    var td = document.getElementById('listnowdate');
    var nd = document.getElementById('listnextdate');
    listDateOffset += 1;
    display();
    nd.style.display = 'inline-block';
    return Promise.race([
        animateEl(td, [
            { transform: 'translateX(0%)', opacity: 1 },
            { opacity: 0 },
            { transform: 'translateX(-100%)', opacity: 0 },
        ], { duration: 300, easing: 'ease-out' }),
        animateEl(nd, [
            { transform: 'translateX(0%)', opacity: 0 },
            { opacity: 0 },
            { transform: 'translateX(-100%)', opacity: 1 },
        ], { duration: 300, easing: 'ease-out' }),
    ]).then(function () {
        pd.innerHTML = td.innerHTML;
        td.innerHTML = nd.innerHTML;
        var listDate2 = new Date();
        listDate2.setDate(listDate2.getDate() + 1 + listDateOffset);
        nd.innerHTML = dateString(listDate2).replace('Today', 'Now');
        return nd.style.display = 'none';
    });
});
// The event listener for the previous date button is mostly the same.
document.getElementById('listbefore').addEventListener('click', function () {
    var pd = document.getElementById('listprevdate');
    var td = document.getElementById('listnowdate');
    var nd = document.getElementById('listnextdate');
    listDateOffset -= 1;
    display();
    pd.style.display = 'inline-block';
    return Promise.race([
        animateEl(td, [
            { transform: 'translateX(-100%)', opacity: 1 },
            { opacity: 0 },
            { transform: 'translateX(0%)', opacity: 0 },
        ], { duration: 300, easing: 'ease-out' }),
        animateEl(pd, [
            { transform: 'translateX(-100%)', opacity: 0 },
            { opacity: 0 },
            { transform: 'translateX(0%)', opacity: 1 },
        ], { duration: 300, easing: 'ease-out' }),
    ]).then(function () {
        nd.innerHTML = td.innerHTML;
        td.innerHTML = pd.innerHTML;
        var listDate2 = new Date();
        listDate2.setDate((listDate2.getDate() + listDateOffset) - 1);
        pd.innerHTML = dateString(listDate2).replace('Today', 'Now');
        return pd.style.display = 'none';
    });
});
// Whenever a date is double clicked, long tapped, or force touched, list view for that day is displayed.
var updateListNav = function () {
    var d = new Date();
    d.setDate((d.getDate() + listDateOffset) - 1);
    var up = function (id) {
        document.getElementById(id).innerHTML = dateString(d).replace('Today', 'Now');
        return d.setDate(d.getDate() + 1);
    };
    up('listprevdate');
    up('listnowdate');
    return up('listnextdate');
};
var switchToList = function (evt) {
    if (evt.target.classList.contains('month') || evt.target.classList.contains('date')) {
        var today = Math.floor((Date.now() - tzoff) / 1000 / 3600 / 24);
        listDateOffset = ((evt.target.parentNode.getAttribute('data-date') - tzoff) / 1000 / 3600 / 24) - today;
        updateListNav();
        document.body.setAttribute('data-view', '1');
        return display();
    }
};
document.body.addEventListener('dblclick', switchToList);
document.body.addEventListener('webkitmouseforceup', switchToList);
(function () {
    var taptimer = null;
    document.body.addEventListener('touchstart', function (evt) { return taptimer = setTimeout((function () { return switchToList(evt); }), 1000); });
    return document.body.addEventListener('touchend', function (evt) { return taptimer = clearTimeout(taptimer); });
})();
// <a name="side"/>
// Side menu and Navbar
// --------------------
//
// The [Headroom library](https://github.com/WickyNilliams/headroom.js) is used to show the navbar when scrolling up
var headroom = new Headroom(document.querySelector('nav'), {
    tolerance: 10,
    offset: 66,
});
headroom.init();
// Also, the side menu needs event listeners.
document.getElementById('collapseButton').addEventListener('click', function () {
    document.body.style.overflow = 'hidden';
    document.getElementById('sideNav').classList.add('active');
    return document.getElementById('sideBackground').style.display = 'block';
});
document.getElementById('sideBackground').addEventListener('click', function () {
    document.getElementById('sideBackground').style.opacity = 0;
    document.getElementById('sideNav').classList.remove('active');
    document.getElementById('dragTarget').style.width = '';
    return setTimeout(function () {
        document.body.style.overflow = 'auto';
        return document.getElementById('sideBackground').style.display = 'none';
    }, 350);
});
// Then, the username in the sidebar needs to be set and we need to generate an "avatar" based on initals.
// To do that, some code to convert from LAB to RGB colors is borrowed from https://github.com/boronine/colorspaces.js
//
// LAB is a color naming scheme that uses two values (A and B) along with a lightness value in order to produce colors that are equally spaced between all of the colors that can be seen by the human eye.
// This works great because everyone has letters in his/her initials.
var labrgb = function (_L, _a, _b) {
    // The D65 standard illuminant
    var ref_X = 0.95047;
    var ref_Y = 1.00000;
    var ref_Z = 1.08883;
    // CIE L*a*b* constants
    var lab_e = 0.008856;
    var lab_k = 903.3;
    var f_inv = function (t) {
        if (Math.pow(t, 3) > lab_e) {
            return Math.pow(t, 3);
        }
        else {
            return ((116 * t) - 16) / lab_k;
        }
    };
    var dot_product = function (a, b) {
        var asc, end;
        var ret = 0;
        for (i = 0, end = a.length - 1, asc = 0 <= end; asc ? i <= end : i >= end; asc ? i++ : i--) {
            ret += a[i] * b[i];
        }
        return ret;
    };
    var var_y = (_L + 16) / 116;
    var var_z = var_y - (_b / 200);
    var var_x = (_a / 500) + var_y;
    var _X = ref_X * f_inv(var_x);
    var _Y = ref_Y * f_inv(var_y);
    var _Z = ref_Z * f_inv(var_z);
    var tuple = [_X, _Y, _Z];
    var m = [
        [3.2406, -1.5372, -0.4986],
        [-0.9689, 1.8758, 0.0415],
        [0.0557, -0.2040, 1.0570],
    ];
    var from_linear = function (c) {
        var a = 0.055;
        if (c <= 0.0031308) {
            return 12.92 * c;
        }
        else {
            return (1.055 * Math.pow(c, 1 / 2.4)) - 0.055;
        }
    };
    var _R = from_linear(dot_product(m[0], tuple));
    var _G = from_linear(dot_product(m[1], tuple));
    var _B = from_linear(dot_product(m[2], tuple));
    // Original from here
    var n = function (v) { return Math.round(Math.max(Math.min(v * 256, 255), 0)); };
    return "rgb(" + n(_R) + ", " + n(_G) + ", " + n(_B) + ")";
};
// The function below uses this algorithm to generate a background color for the initials displayed in the sidebar.
var updateAvatar = function () {
    if (localStorage.username != null) {
        document.getElementById('user').innerHTML = localStorage.username;
        var initials = localStorage.username.match(/\d*(.).*?(.$)/); // Separate year from first name and initial
        if (initials != null) {
            var bg = labrgb(50, (((initials[1].charCodeAt(0) - 65) / 26) * 256) - 128, (((initials[2].charCodeAt(0) - 65) / 26) * 256) - 128); // Compute the color
            document.getElementById('initials').style.backgroundColor = bg;
            return document.getElementById('initials').innerHTML = initials[1] + initials[2];
        }
    }
};
updateAvatar();
// <a name="athena"/>
// Athena (Schoology)
// ------------------
//
// Now, there's the schoology/athena integration stuff.
// First, we need to check if it's been more than a day. There's no point constantly retrieving classes from Athena; they dont't change that much.
var athenaData = (localStorage.athenaData != null) ? JSON.parse(localStorage.athenaData) : null;
// Then, once the variable for the last date is initialized, it's time to get the classes from athena.
// Luckily, there's this file at /iapi/course/active - and it's in JSON! Life can't be any better! Seriously! It's just too bad the login page isn't in JSON.
var parseAthenaData = function (dat) {
    if (dat === '') {
        athenaData = null;
        localStorage.removeItem('athenaData');
    }
    else {
        try {
            var d = JSON.parse(dat);
            var athenaData2 = {};
            var allCourseDetails = {};
            for (var _i = 0, _c = d.body.courses.sections; _i < _c.length; _i++) {
                var section = _c[_i];
                allCourseDetails[section.course_nid] = section;
            }
            for (var j = d.body.courses.courses.length - 1; j >= 0; j--) {
                var course = d.body.courses.courses[j];
                var courseDetails = allCourseDetails[course.nid];
                athenaData2[course.course_title] = {
                    link: "https://athena.harker.org" + courseDetails.link,
                    logo: courseDetails.logo.substr(0, courseDetails.logo.indexOf('" alt="')).replace('<div class="profile-picture"><img src="', '').replace('tiny', 'reg'),
                    period: courseDetails.section_title,
                };
            }
            athenaData = athenaData2;
            localStorage.athenaData = JSON.stringify(athenaData);
            document.getElementById('athenaDataError').style.display = 'none';
            document.getElementById('athenaDataRefresh').style.display = 'block';
        }
        catch (e) {
            document.getElementById('athenaDataError').style.display = 'block';
            document.getElementById('athenaDataRefresh').style.display = 'none';
            document.getElementById('athenaDataError').innerHTML = e.message;
        }
    }
};
// <a name="settings"/>
// Settings
// --------
//
// The code below updates the current version text in the settings. I should've put this under the Updates section, but it should go before the display() function forces a reflow.
document.getElementById('version').innerHTML = version;
// To bring up the settings windows, an event listener needs to be added to the button.
document.getElementById('settingsB').addEventListener('click', function () {
    document.getElementById('sideBackground').click();
    document.body.classList.add('settingsShown');
    document.getElementById('brand').innerHTML = 'Settings';
    return setTimeout(function () { return document.querySelector('main').style.display = 'none'; });
});
// The back button also needs to close the settings window.
document.getElementById('backButton').addEventListener('click', function () {
    document.querySelector('main').style.display = 'block';
    document.body.classList.remove('settingsShown');
    return document.getElementById('brand').innerHTML = 'Check PCR';
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
    document.getElementById('info').classList.add('isTasks');
    document.getElementById('new').style.display = 'none';
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
if (localStorage.assignmentColors == null) {
    localStorage.assignmentColors = JSON.stringify({ homework: '#2196f3', classwork: '#689f38', test: '#f44336', longterm: '#f57c00' });
}
if ((localStorageRead('data') != null) && (localStorage.classColors == null)) {
    var a = {};
    for (var _h = 0, _j = localStorageRead('data').classes; _h < _j.length; _h++) {
        c = _j[_h];
        a[c] = '#616161';
    }
    localStorage.classColors = JSON.stringify(a);
}
document.getElementById(localStorage.colorType + "Colors").style.display = 'block';
if (localStorage.refreshOnFocus == null) {
    localStorage.refreshOnFocus = JSON.stringify(true);
}
window.addEventListener('focus', function () {
    if (JSON.parse(localStorage.refreshOnFocus)) {
        return fetch();
    }
});
if (localStorage.refreshRate == null) {
    localStorage.refreshRate = JSON.stringify(-1);
}
var intervalRefresh = function () {
    var r = JSON.parse(localStorage.refreshRate);
    if (r > 0) {
        return setTimeout(function () {
            console.debug('Refreshing because of timer');
            fetch();
            return intervalRefresh();
        }, r * 60 * 1000);
    }
};
intervalRefresh();
// For choosing colors, the color choosing boxes need to be initialized.
var ac = JSON.parse(localStorage.assignmentColors);
var cc = (localStorage.classColors != null) ? JSON.parse(localStorage.classColors) : {};
var palette = {
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
    '#616161': '#212121',
};
if (localStorageRead('data') != null) {
    for (var _k = 0, _l = localStorageRead('data').classes; _k < _l.length; _k++) {
        c = _l[_k];
        var d = element('div', [], c);
        d.setAttribute('data-control', c);
        d.appendChild(element('span', []));
        document.getElementById('classColors').appendChild(d);
    }
}
for (var _m = 0, _o = document.getElementsByClassName('colors'); _m < _o.length; _m++) {
    var e = _o[_m];
    var _loop_2 = function () {
        var sp = color.querySelector('span');
        var listName = e.getAttribute('id') === 'classColors' ? 'classColors' : 'assignmentColors';
        var list = e.getAttribute('id') === 'classColors' ? cc : ac;
        sp.style.backgroundColor = list[color.getAttribute('data-control')];
        for (p in palette) {
            var pe = element('span', []);
            pe.style.backgroundColor = p;
            if (p === list[color.getAttribute('data-control')]) {
                pe.classList.add('selected');
            }
            sp.appendChild(pe);
        }
        var custom = element('span', ['customColor'], "<a>Custom</a> <input type='text' placeholder='Was " + list[color.getAttribute('data-control')] + "' /> <span class='customInfo'>Use any CSS valid color name, such as <code>#F44336</code> or <code>rgb(64, 43, 2)</code> or <code>cyan</code></span> <a class='customOk'>Set</a>");
        custom.addEventListener('click', function (evt) { return evt.stopPropagation(); });
        custom.querySelector('a').addEventListener('click', function (evt) {
            this.parentNode.parentNode.classList.toggle('onCustom');
            return evt.stopPropagation();
        });
        sp.appendChild(custom);
        (function (sp, color, list, listName) {
            sp.addEventListener('click', function (evt) {
                if (sp.classList.contains('choose')) {
                    var bg = tinycolor(evt.target.style.backgroundColor).toHexString();
                    list[color.getAttribute('data-control')] = bg;
                    sp.style.backgroundColor = bg;
                    if (sp.querySelector('.selected') != null) {
                        sp.querySelector('.selected').classList.remove('selected');
                    }
                    evt.target.classList.add('selected');
                    localStorage[listName] = JSON.stringify(list);
                    updateColors();
                }
                return sp.classList.toggle('choose');
            });
            return custom.querySelector('.customOk').addEventListener('click', function (evt) {
                this.parentNode.parentNode.classList.remove('onCustom');
                this.parentNode.parentNode.classList.toggle('choose');
                if (sp.querySelector('.selected') != null) {
                    sp.querySelector('.selected').classList.remove('selected');
                }
                sp.style.backgroundColor = (list[color.getAttribute('data-control')] =
                    this.parentNode.querySelector('input').value);
                localStorage[listName] = JSON.stringify(list);
                updateColors();
                return evt.stopPropagation();
            });
        })(sp, color, list, listName);
    };
    for (var _p = 0, _q = e.getElementsByTagName('div'); _p < _q.length; _p++) {
        color = _q[_p];
        _loop_2();
    }
}
// Then, a function that updates the color preferences is defined.
var updateColors = function () {
    var name;
    var style = document.createElement('style');
    style.appendChild(document.createTextNode(''));
    document.head.appendChild(style);
    var sheet = style.sheet;
    var addColorRule = function (selector, light, dark, extra) {
        if (extra === void 0) { extra = ''; }
        sheet.insertRule(extra + ".assignment" + selector + " { background-color: " + light + "; }", 0);
        sheet.insertRule(extra + ".assignment" + selector + ".done { background-color: " + dark + "; }", 0);
        sheet.insertRule(extra + ".assignment" + selector + "::before { background-color: " + tinycolor.mix(light, '#1B5E20', 70).toHexString() + "; }", 0);
        sheet.insertRule(extra + ".assignmentItem" + selector + ">i { background-color: " + light + "; }", 0);
        return sheet.insertRule(extra + ".assignmentItem" + selector + ".done>i { background-color: " + dark + "; }", 0);
    };
    var createPalette = function (color) { return tinycolor(color).darken(24).toHexString(); };
    if (localStorage.colorType === 'assignment') {
        var object = JSON.parse(localStorage.assignmentColors);
        for (name in object) {
            color = object[name];
            addColorRule("." + name, color, palette[color] || createPalette(color));
        }
    }
    else {
        var object1 = JSON.parse(localStorage.classColors);
        for (name in object1) {
            color = object1[name];
            addColorRule("[data-class=\"" + name + "\"]", color, palette[color] || createPalette(color));
        }
    }
    addColorRule('.task', '#F5F5F5', '#E0E0E0');
    addColorRule('.task', '#424242', '#212121', '.dark ');
};
// The function then needs to be called.
updateColors();
// The elements that control the settings also need event listeners
for (var _r = 0, _s = document.getElementsByClassName('settingsControl'); _r < _s.length; _r++) {
    e = _s[_r];
    if (localStorage[e.name] != null) {
        if (e.type === 'checkbox') {
            e.checked = JSON.parse(localStorage[e.name]);
        }
        else {
            e.value = JSON.parse(localStorage[e.name]);
        }
    }
    e.addEventListener('change', function (evt) {
        if (evt.target.type === 'checkbox') {
            localStorage[evt.target.name] = JSON.stringify(evt.target.checked);
        }
        else {
            localStorage[evt.target.name] = JSON.stringify(evt.target.value);
        }
        switch (evt.target.name) {
            case 'refreshRate': return intervalRefresh();
            case 'earlyTest': return display();
            case 'assignmentSpan': return display();
            case 'projectsInTestPane': return display();
            case 'hideassignments': return display();
            case 'holidayThemes': return document.body.classList.toggle('holidayThemes', evt.target.checked);
            case 'sepTaskClass':
                document.body.classList.toggle('sepTaskClass', evt.target.checked);
                return display();
            case 'sepTasks': return document.getElementById('sepTasksRefresh').style.display = 'block';
        }
    });
}
// This also needs to be done for radio buttons
document.querySelector("input[name=\"colorType\"][value=\"" + localStorage.colorType + "\"]").checked = true;
for (var _t = 0, _u = document.getElementsByName('colorType'); _t < _u.length; _t++) {
    c = _u[_t];
    c.addEventListener('change', function (evt) {
        var v = document.querySelector('input[name="colorType"]:checked').value;
        localStorage.colorType = v;
        if (v === 'class') {
            document.getElementById('assignmentColors').style.display = 'none';
            document.getElementById('classColors').style.display = 'block';
        }
        else {
            document.getElementById('assignmentColors').style.display = 'block';
            document.getElementById('classColors').style.display = 'none';
        }
        return updateColors();
    });
}
// The same goes for textareas.
for (var _v = 0, _w = document.getElementsByTagName('textarea'); _v < _w.length; _v++) {
    e = _w[_v];
    if ((e.name !== 'athenaDataRaw') && (localStorage[e.name] != null)) {
        e.value = localStorage[e.name];
    }
    e.addEventListener('input', function (evt) {
        localStorage[evt.target.name] = evt.target.value;
        if (evt.target.name === 'athenaDataRaw') {
            return parseAthenaData(evt.target.value);
        }
    });
}
// <a name="starting"/>
// Starting everything
// -------------------
//
// Finally! We are (almost) done!
//
// Before getting to anything, let's print out a welcoming message to the console!
console.log('%cCheck PCR', 'color: #004000; font-size: 3em');
console.log("%cVersion " + version + " (Check below for current version)", 'font-size: 1.1em');
console.log.apply(console, ["Welcome to the developer console for your browser! Besides looking at the source code, you can also play around with Check PCR by executing the lines below:\n%c\tfetch(true)               %c// Reloads all of your assignments (the true is for forcing a reload if one has already been triggered in the last minute)\n%c\tdata                      %c// Displays the object that contains the data parsed from PCR's interface\n%c\tactivity                  %c// The data for the assignments that show up in the activity pane\n%c\textra                     %c// All of the tasks you've created by clicking the + button\n%c\tathenaData                %c// The data fetched from Athena (if you've pasted the raw data into settings)\n%c\tsnackbar(\"Hello World!\")  %c// Creates a snackbar showing the message \"Hello World!\"\n%c\tdisplayError(new Error()) %c// Displays the stack trace for a random error (Just don't submit it!)\n%c\tcloseError()              %c// Closes that dialog"].concat(Array.from([].concat.apply([], Array.from(((function () {
    var j;
    var result = [];
    for (j = 0, i = j; j < 8; j++, i = j) {
        result.push(['color: initial', 'color: grey']);
    }
    return result;
})()) || [])))));
console.log('');
// *Note: Because the hosted Parse server is no longer going to be available, the below code is commented out*
//
// The *sendToParse* function puts / removes data on Parse since the completed and modified assignments are loaded and saved to / from Parse.
/*
sendToParse = (name, func, value, update=true) ->
  * onerror will be called if there is an error sending the info to Parse or there is no connection to it
  onerror = ->
    console.debug "Adding failed request to localStorage for later reattempts"
    parseFailed = if (pf = localStorage["parseFailed"])? then JSON.parse(pf) else []
    parseFailed.push [name, func, value]
    localStorage["parseFailed"] = JSON.stringify parseFailed
  if window.userData # Check if parse has been initialized yet
    console.log "executing #{func} with argument #{value} into #{name}"
    Parse.CoreManager.getInstallationController().currentInstallationId().then (iid) ->
      send("https://api.parse.com/1/classes/UserData/#{window.userData.id}", "json",
        null, # No special headers to send
        JSON.stringify
          _ApplicationId: Parse.CoreManager.get "APPLICATION_ID"
          _ClientVersion: Parse.CoreManager.get "VERSION"
          _InstallationId: iid
          _JavaScriptKey: Parse.CoreManager.get "JAVASCRIPT_KEY"
          _SessionToken: Parse.User.current().getSessionToken()
          _method: "PUT"
          "#{name}":
            __op: func
            objects: [sjcl.encrypt localStorage["cryptoPhrase"], value]
      ).then (resp) ->
        console.log "Successfully synced change to Parse", resp.response
        if update
          window[name][{Remove: "onremove", AddUnique: "onadd"}[func]](value)
      , onerror
  else
    onerror() # Parse not initialized yet
*/
// Then, a class similar to an array that interacts with Parse is defined.
var ParseArray = /** @class */ (function () {
    function ParseArray(name, windowname) {
        this.name = name;
        this.windowname = windowname;
        var local = localStorage[this.name];
        this.array = (local != null) ? JSON.parse(local) : [];
    }
    ParseArray.onadd = function () { };
    ParseArray.onremove = function () { };
    ParseArray.prototype.push = function (item) {
        // sendToParse @name, "AddUnique", item, false
        return this.array.push(item);
    };
    ParseArray.prototype.indexOf = function (item) {
        return this.array.indexOf(item);
    };
    ParseArray.prototype.splice = function (index, number) {
        // for n in [index...index+number]
        //   sendToParse @name, "Remove", @array[n], false
        return this.array.splice(index, number);
    };
    ParseArray.prototype.save = function () {
        return localStorage[this.name] = JSON.stringify(this.array);
    };
    ParseArray.prototype.update = function (updatedData) {
        var _this = this;
        var updated = updatedData.slice(0);
        var n = 0;
        while (n < this.array.length) {
            var item = this.array[n];
            // If the item was present in the old version but not in the new
            // then it was removed
            if (updated.indexOf(item) === -1) {
                this.onremove(item);
                this.array.splice(n, 1);
            }
            else {
                n++;
            }
            updated.splice(0, 1);
        } // Remove it since we've already handled it
        // Now everything left in updated wasn't present in the old version
        // has been added
        return (function () {
            var result1 = [];
            for (var _i = 0, updated_1 = updated; _i < updated_1.length; _i++) {
                var newitem = updated_1[_i];
                _this.onadd(newitem);
                result1.push(_this.array.push(newitem));
            }
            return result1;
        })();
    };
    return ParseArray;
}());
// The completed and modified assignments are loaded.
var done = new ParseArray('done');
done.onadd = function (id) {
    for (var _i = 0, _c = document.querySelectorAll(".assignment[id^=\"" + id + "\"], #test" + id + ", #activity" + id + ", #ia" + id); _i < _c.length; _i++) {
        var elem = _c[_i];
        elem.classList.add('done');
    }
    if (document.querySelectorAll('.assignment.listDisp:not(.done)').length !== 0) {
        document.body.classList.remove('noList');
    }
    if (document.body.getAttribute('data-view') === '1') {
        return resize();
    }
};
done.onremove = function (id) {
    for (var _i = 0, _c = document.querySelectorAll(".assignment[id^=\"" + id + "\"], #test" + id + ", #activity" + id + ", #ia" + id); _i < _c.length; _i++) {
        var elem = _c[_i];
        elem.classList.remove('done');
    }
    if (document.querySelectorAll('.assignment.listDisp:not(.done)').length === 0) {
        document.body.classList.add('noList');
    }
    if (document.body.getAttribute('data-view') === '1') {
        return resize();
    }
};
var modified = {};
if (localStorage.modified != null) {
    modified = JSON.parse(localStorage.modified);
}
var extra = [];
if (localStorage.extra != null) {
    extra = JSON.parse(localStorage.extra);
}
var schedules = (function () {
    var s;
    if (s = localStorage.schedules) {
        return JSON.parse(s);
    }
    else {
        return null;
    }
})();
// The "last updated" text is set to the correct date.
document.getElementById('lastUpdate').innerHTML = (localStorage.lastUpdate != null) ? formatUpdate(localStorage.lastUpdate) : 'Never';
// Now, we load the saved assignments (if any) and fetch the current assignments from PCR.
if (localStorageRead('data') != null) {
    window.data = localStorageRead('data');
    // Now check if there's activity
    if (localStorage.activity != null) {
        activity = JSON.parse(localStorage.activity);
        for (var _x = 0, _y = activity.slice(activity.length - 32, activity.length); _x < _y.length; _x++) {
            var act = _y[_x];
            addActivity.apply(void 0, Array.from(act || []));
        }
    }
    display();
}
fetch();
// If the page is being viewed from the website, a couple changes need to be made.
if (location.protocol !== 'chrome-extension:') {
    var lc = document.querySelector('#login .content');
    document.getElementById('login').classList.add('large');
    lc.appendChild(element('div', [], 'While this feature is very useful, it will store your credentials on the server\'s database. If you are uncomfortable with this, then unckeck the box to only have the servery proxy your credentials to PCR.', 'storeAbout'));
    lc.appendChild(element('span', [], "The online version of Check PCR will send your login credentials through the server hosting this website so that it can fetch your assignments from PCR.\nIf you do not trust me to avoid stealing your credentials, you can use\n<a href='https://github.com/19RyanA/CheckPCR'>the Check PCR unofficial chrome extension</a>, which will communicate directly with PCR and thus not send any data through this server.", 'loginExtra'));
    var up = document.getElementById('update');
    var upc = up.getElementsByClassName('content')[0];
    up.querySelector('h1').innerHTML = 'A new update has been applied.';
    for (var k = upc.childNodes.length - 1; k >= 0; k--) {
        el = upc.childNodes[k];
        if ((el.nodeType === 3) || (el.tagName === 'BR') || (el.tagName === 'CODE') || (el.tagName === 'A')) {
            el.remove();
        }
    }
    upc.insertBefore(document.createTextNode('Because you are using the online version, the update has already been download. Click GOT IT to reload the page and apply the changes.'), upc.querySelector('h2'));
    document.getElementById('updateDelay').style.display = 'none';
    document.getElementById('updateIgnore').innerHTML = 'GOT IT';
    document.getElementById('updateIgnore').style.right = '8px';
}
// <a name="analytics"/>
// Analytics
// ---------
//
// The page to be sent to Google Analytics is set to the correct one.
var gp = {
    page: '/new.html',
    title: location.protocol === 'chrome-extension:' ? "Version " + version : 'Online',
};
// This is the code for Google Analytics. There's not much more to explain.
if (!JSON.parse(localStorage.googleA)) {
    window['ga-disable-UA-66932824-1'] = true;
}
else {
    (function (i, s, o, g, r, a, m) {
        i.GoogleAnalyticsObject = r;
        i[r] = i[r] || function () {
            (i[r].q = i[r].q || []).push(arguments);
        }, i[r].l = 1 * new Date();
        a = s.createElement(o),
            m = s.getElementsByTagName(o)[0];
        a.async = 1;
        a.src = g;
        m.parentNode.insertBefore(a, m);
    })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
    ga('create', 'UA-66932824-1', 'auto');
    ga('set', 'checkProtocolTask', (function () { }));
    ga('require', 'displayfeatures');
    ga('send', 'pageview', gp);
}
// The user is also alerted that the page uses Google Analytics just to be nice.
if ((localStorage.askGoogleAnalytics == null)) {
    snackbar('This page uses Google Analytics. You can opt out vai Settings.', 'Settings', function () { return document.getElementById('settingsB').click(); });
    localStorage.askGoogleAnalytics = 'false';
}
// <a name="events"/>
// Events
// ------
//
// The document body needs to be enabled for hammer.js events.
delete Hammer.defaults.cssProps.userSelect;
var hammertime = new Hammer.Manager(document.body, {
    recognizers: [
        [Hammer.Pan, { direction: Hammer.DIRECTION_HORIZONTAL }],
    ],
});
// For touch displays, hammer.js is used to make the side menu appear/disappear. The code below is adapted from Materialize's implementation.
var menuOut = false;
var dragTarget = new Hammer(document.getElementById('dragTarget'));
dragTarget.on('pan', function (e) {
    if (e.pointerType === 'touch') {
        e.preventDefault();
        var direction = e.direction;
        var x = e.center.x;
        var y = e.center.y;
        var sbkg = document.getElementById('sideBackground');
        sbkg.style.display = 'block';
        sbkg.style.opacity = 0;
        document.getElementById('sideNav').classList.add('manual');
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
        document.getElementById('sideNav').style.transform = "translateX(" + (x - 240) + "px)";
        var overlayPerc = Math.min(x / 480, 0.5);
        return sbkg.style.opacity = overlayPerc;
    }
});
dragTarget.on('panend', function (e) {
    if (e.pointerType === 'touch') {
        var sideNav = void 0;
        var velocityX = e.velocityX;
        // If velocityX <= 0.3 then the user is flinging the menu closed so ignore menuOut
        if ((menuOut && (velocityX <= 0.3)) || (velocityX < -0.5)) {
            sideNav = document.getElementById('sideNav');
            sideNav.classList.remove('manual');
            sideNav.classList.add('active');
            sideNav.style.transform = '';
            return document.getElementById('dragTarget').style.width = '100%';
        }
        else if (!menuOut || (velocityX > 0.3)) {
            document.body.style.overflow = 'auto';
            sideNav = document.getElementById('sideNav');
            sideNav.classList.remove('manual');
            sideNav.classList.remove('active');
            sideNav.style.transform = '';
            document.getElementById('sideBackground').style.opacity = '';
            document.getElementById('dragTarget').style.width = '10px';
            return setTimeout(function () { return document.getElementById('sideBackground').style.display = 'none'; }, 350);
        }
    }
});
dragTarget.on('tap', function (e) {
    document.getElementById('sideBackground').click();
    return e.preventDefault();
});
var dt = document.getElementById('dragTarget');
/*hammertime.on "pan", (e) ->
  if e.pointerType is "touch" and e.deltaX < -100 or e.deltaX > 100 and e.target isnt dt and (-25 < e.deltaY < 25)
    if e.velocityX > 0.5
      el = document.querySelector("#navTabs>li:nth-child(#{document.body.getAttribute("data-view")+2})")
    else if e.velocityX < -0.5
      el = document.querySelector("#navTabs>li:nth-child(#{document.body.getAttribute("data-view")})")
    if el?
      el.click()
  return*/
// The activity filter button also needs an event listener.
ripple(document.getElementById('filterActivity'));
document.getElementById('filterActivity').addEventListener('click', function () { return document.getElementById('infoActivity').classList.toggle('filter'); });
// At the start, it needs to be correctly populated
var activityTypes = localStorage.shownActivity ? JSON.parse(localStorage.shownActivity) : {
    add: true,
    edit: true,
    delete: true,
};
var updateSelectNum = function () {
    c = function (bool) { if (bool) {
        return 1;
    }
    else {
        return 0;
    } };
    return document.getElementById('selectNum').innerHTML = c(activityTypes.add) + c(activityTypes.edit) + c(activityTypes.delete);
};
updateSelectNum();
for (var type in activityTypes) {
    var enabled = activityTypes[type];
    document.getElementById(type + 'Select').checked = enabled;
    if (enabled) {
        document.getElementById('infoActivity').classList.add(type);
    }
    (function (type) {
        return document.getElementById(type + 'Select').addEventListener('change', function (evt) {
            activityTypes[type] = evt.target.checked;
            document.getElementById('infoActivity').setAttribute('data-filtered', updateSelectNum());
            document.getElementById('infoActivity').classList.toggle(type);
            return localStorage.shownActivity = JSON.stringify(activityTypes);
        });
    })(type);
}
// The show completed tasks checkbox is set correctly and is assigned an event listener.
if (localStorage.showDoneTasks && JSON.parse(localStorage.showDoneTasks)) {
    document.getElementById('showDoneTasks').checked = true;
    document.getElementById('infoTasksInner').classList.add('showDoneTasks');
}
document.getElementById('showDoneTasks').addEventListener('change', function () {
    localStorage.showDoneTasks = JSON.stringify(this.checked);
    return document.getElementById('infoTasksInner').classList.toggle('showDoneTasks', this.checked);
});
// <a name="updates"/>
// Updates and News
// ----------------
//
// For updating, a request will be send to Github to get the current commit id and check that against what's stored
var checkCommit = function () {
    return send('https://raw.githubusercontent.com/19RyanA/CheckPCR/master/version.txt', 'text')
        .then(function (resp) {
        c = resp.responseText.trim();
        console.log("Current version: " + c + " " + (version === c ? '(no update available)' : '(update available)'));
        document.getElementById('newversion').innerHTML = c;
        if (version !== c) {
            document.getElementById('updateIgnore').addEventListener('click', function () {
                if (location.protocol === 'chrome-extension:') {
                    document.getElementById('update').classList.remove('active');
                    return setTimeout(function () { return document.getElementById('updateBackground').style.display = 'none'; }, 350);
                }
                else {
                    return window.location.reload();
                }
            });
            return send((location.protocol === 'chrome-extension:' ? 'https://api.github.com/repos/19RyanA/CheckPCR/git/refs/heads/master' : '/api/commit'), 'json')
                .then(function (resp) {
                var sha = resp.response.object.sha;
                return send((location.protocol === 'chrome-extension:' ? resp.response.object.url : "/api/commit/" + sha), 'json')
                    .then(function (resp) {
                    document.getElementById('pastUpdateVersion').innerHTML = version;
                    document.getElementById('newUpdateVersion').innerHTML = c;
                    document.getElementById('updateFeatures').innerHTML = resp.response.message.substr(resp.response.message.indexOf('\n\n') + 2).replace(/\* (.*?)(?=$|\n)/g, function (a, b) { return "<li>" + b + "</li>"; }).replace(/>\n</g, '><').replace(/\n/g, '<br>');
                    document.getElementById('updateBackground').style.display = 'block';
                    return document.getElementById('update').classList.add('active');
                });
            });
        }
    }, function (err) { return console.log('Could not access Github. Here\'s the error:', err); });
};
if (location.protocol === 'chrome-extension:') {
    checkCommit();
}
// This update dialog also needs to be closed when the butons are clicked.
document.getElementById('updateDelay').addEventListener('click', function () {
    document.getElementById('update').classList.remove('active');
    return setTimeout(function () { return document.getElementById('updateBackground').style.display = 'none'; }, 350);
});
// For news, the latest news is fetched from a GitHub gist.
send('https://api.github.com/gists/21bf11a429da257539a68520f513a38b', 'json')
    .then(function (resp) {
    var last = localStorage.newsCommit;
    var nc = resp.response.history[0].version;
    if ((last == null)) {
        localStorage.newsCommit = nc;
    }
    window.getNews = function (onfail) {
        return send(resp.response.files['updates.htm'].raw_url)
            .then(function (resp) {
            localStorage.newsCommit = nc;
            for (var _i = 0, _c = resp.responseText.split('<hr>'); _i < _c.length; _i++) {
                var news = _c[_i];
                document.getElementById('newsContent').appendChild(element('div', 'newsItem', news));
            }
            document.getElementById('newsBackground').style.display = 'block';
            return document.getElementById('news').classList.add('active');
        }, function (err) {
            if (onfail != null) {
                return onfail();
            }
        });
    };
    if (last !== nc) {
        return window.getNews();
    }
}, function (err) { return console.log('Could not access Github. Here\'s the error:', err); });
// The news dialog then needs to be closed when OK or the background is clicked.
var closeNews = function () {
    document.getElementById('news').classList.remove('active');
    return setTimeout(function () { return document.getElementById('newsBackground').style.display = 'none'; }, 350);
};
document.getElementById('newsOk').addEventListener('click', closeNews);
document.getElementById('newsBackground').addEventListener('click', closeNews);
// It also needs to be opened when the news button is clicked.
document.getElementById('newsB').addEventListener('click', function () {
    document.getElementById('sideBackground').click();
    var dispNews = function () {
        document.getElementById('newsBackground').style.display = 'block';
        return document.getElementById('news').classList.add('active');
    };
    if (document.getElementById('newsContent').childNodes.length === 0) {
        if (typeof getNews !== 'undefined' && getNews !== null) {
            return getNews(dispNews);
        }
        else {
            return dispNews();
        }
    }
    else {
        return dispNews();
    }
});
// The same goes for the error dialog.
var closeError = function () {
    document.getElementById('error').classList.remove('active');
    return setTimeout(function () { return document.getElementById('errorBackground').style.display = 'none'; }, 350);
};
document.getElementById('errorNo').addEventListener('click', closeError);
document.getElementById('errorBackground').addEventListener('click', closeError);
// <a name="new"/>
// Adding new assignments
// ----------------------
//
// The event listeners for the new buttons are added.
ripple(document.getElementById('new'));
ripple(document.getElementById('newTask'));
var onNewTask = function () {
    updateNewTips(document.getElementById('newText').value = '');
    document.body.style.overflow = 'hidden';
    document.getElementById('newBackground').style.display = 'block';
    document.getElementById('newDialog').classList.add('active');
    return document.getElementById('newText').focus();
};
document.getElementById('new').addEventListener('mouseup', onNewTask);
document.getElementById('newTask').addEventListener('mouseup', onNewTask);
// A function to close the dialog is then defined.
var closeNew = function () {
    document.body.style.overflow = 'auto';
    document.getElementById('newDialog').classList.remove('active');
    return setTimeout(function () { return document.getElementById('newBackground').style.display = 'none'; }, 350);
};
// This function is set to be called called when the ESC key is called inside of the dialog.
document.getElementById('newText').addEventListener('keydown', function (evt) {
    if (evt.which === 27) {
        return closeNew();
    }
});
// An event listener to call the function is also added to the X button
document.getElementById('newCancel').addEventListener('click', closeNew);
// When the enter key is pressed or the submit button is clicked, the new assignment is added.
document.getElementById('newDialog').addEventListener('submit', function (evt) {
    var cls, due, end, st;
    evt.preventDefault();
    var text = document.getElementById('newText').value;
    while (true) {
        var parsed = text.match(/(.*) (for|by|due|assigned|starting|ending|beginning) (.*)/);
        if (parsed != null) {
            switch (parsed[2]) {
                case 'for':
                    cls = parsed[3];
                    break;
                case 'by':
                case 'due':
                case 'ending':
                    due = parsed[3];
                    break;
                case 'assigned':
                case 'starting':
                case 'beginning':
                    st = parsed[3];
                    break;
            }
            text = parsed[1];
        }
        else {
            break;
        }
    }
    var start = (st != null) ? Math.floor((chrono.parseDate(st).getTime() - tzoff) / 1000 / 3600 / 24) : Math.floor((Date.now() - tzoff) / 1000 / 3600 / 24);
    if (due != null) {
        end = Math.floor((chrono.parseDate(due).getTime() - tzoff) / 1000 / 3600 / 24);
        if (end < start) {
            end += Math.ceil((start - end) / 7) * 7;
        }
    }
    extra.push({
        body: text.charAt(0).toUpperCase() + text.substr(1),
        done: false,
        start: start,
        class: (cls != null) ? cls.toLowerCase().trim() : null,
        end: end,
    });
    localStorage.extra = JSON.stringify(extra);
    closeNew();
    return display(false);
});
// When anything is typed, the search suggestions need to be updated.
var tipNames = {
    for: ['for'],
    by: ['by', 'due', 'ending'],
    starting: ['starting', 'beginning', 'assigned'],
};
var updateTip = function (name, typed, uppercase) {
    el = document.getElementById("tip" + name);
    el.classList.add('active');
    el.querySelector('.typed').innerHTML = (uppercase ? typed.charAt(0).toUpperCase() + typed.substr(1) : typed) + '...';
    var newNames = [];
    for (var _i = 0, _c = tipNames[name]; _i < _c.length; _i++) {
        var n = _c[_i];
        if (n !== typed) {
            newNames.push("<b>" + n + "</b>");
        }
    }
    return el.querySelector('.others').innerHTML = newNames.length > 0 ? "You can also use " + newNames.join(' or ') : '';
};
var tipComplete = function (evt) {
    var val = document.getElementById('newText').value;
    var lastSpace = val.lastIndexOf(' ');
    var lastWord = lastSpace === -1 ? 0 : lastSpace + 1;
    updateNewTips(document.getElementById('newText').value = val.substring(0, lastWord) + this.querySelector('.typed').innerHTML.replace('...', '') + ' ');
    return document.getElementById('newText').focus();
};
var updateNewTips = function (val, scroll) {
    if (scroll === void 0) { scroll = true; }
    var name, possible;
    if (scroll) {
        document.getElementById('newTips').scrollTop = 0;
    }
    if ((i = val.lastIndexOf(' ')) !== -1) {
        var beforeSpace = val.lastIndexOf(' ', i - 1);
        var before = val.substring((beforeSpace === -1 ? 0 : beforeSpace + 1), i);
        for (name in tipNames) {
            possible = tipNames[name];
            if (possible.indexOf(before) !== -1) {
                if (name === 'for') {
                    for (name in tipNames) {
                        document.getElementById("tip" + name).classList.remove('active');
                    }
                    for (var _i = 0, _c = data.classes; _i < _c.length; _i++) {
                        var cls = _c[_i];
                        var id = "tipclass" + cls.replace(/\W/, '');
                        if (i === (val.length - 1)) {
                            if ((e = document.getElementById(id)) != null) {
                                e.classList.add('active');
                            }
                            else {
                                var container = element('div', ['classTip', 'active', 'tip'], "<i class='material-icons'>class</i><span class='typed'>" + cls + "</span>", id);
                                container.addEventListener('click', tipComplete);
                                document.getElementById('newTips').appendChild(container);
                            }
                        }
                        else {
                            document.getElementById(id).classList.toggle('active', cls.toLowerCase().indexOf(val.toLowerCase().substr(i + 1)) !== -1);
                        }
                    }
                    return;
                }
            }
        }
    }
    for (var _d = 0, _e = document.getElementsByClassName('classTip'); _d < _e.length; _d++) {
        el = _e[_d];
        el.classList.remove('active');
    }
    if ((val === '') || (val.charAt(val.length - 1) === ' ')) {
        updateTip('for', 'for', false);
        updateTip('by', 'by', false);
        updateTip('starting', 'starting', false);
    }
    else {
        var lastSpace = val.lastIndexOf(' ');
        var lastWord = lastSpace === -1 ? val : val.substr(lastSpace + 1);
        var uppercase = lastWord.charAt(0) === lastWord.charAt(0).toUpperCase();
        lastWord = lastWord.toLowerCase();
        for (name in tipNames) {
            possible = tipNames[name];
            var found = false;
            for (var _f = 0, possible_1 = possible; _f < possible_1.length; _f++) {
                p = possible_1[_f];
                if (p.slice(0, lastWord.length) === lastWord) {
                    found = p;
                }
            }
            if (found) {
                updateTip(name, found, uppercase);
            }
            else {
                document.getElementById("tip" + name).classList.remove('active');
            }
        }
    }
};
updateNewTips('', false);
document.getElementById('newText').addEventListener('input', function () {
    return updateNewTips(this.value);
});
// The event listener is then added to the preexisting tips.
for (var _z = 0, _0 = document.getElementsByClassName('tip'); _z < _0.length; _z++) {
    var tip = _0[_z];
    tip.addEventListener('click', tipComplete);
}
// <a name="parse" />
// Parse
// -----
//
// First of all, to interact with Parse, the SDK must be initialized.
// Parse.initialize "y0LK2CGd1Th6yHtOmmgN7CjplpFiDslTEwmtz7q2", "WQxQSzup108DdG4Ey0dJJJ9yw0KNWK2Ss2JBQPkb"
// To be able to query for the data stored in parse, the *UserData* class is defined.
// UserData = Parse.Object.extend "UserData"
// The function *newParseData* creates an object in parse that will store the data.
/*
newParseData = ->
  userData = new UserData()
  passphrase = localStorage["cryptoPhrase"]
  userData.set "done", (sjcl.encrypt(passphrase, x) for x in done.array)
  userData.set "user", Parse.User.current()
  userData.setACL new Parse.ACL Parse.User.current() # Only
  userData.save().then (userData) ->
    window.userData = userData
    console.debug "Successfully saved userData", userData
  , (err) ->
    alert "Unable to save your current data to Parse because of this error: #{err.code} #{err.message}"
*/
// The function *onParseOnline* is called when a network connection to parse is made (again) and attempts to sync data that was created when offline
/*
onParseOnline = ->
  if (pf = localStorage["parseFailed"])?
    delete localStorage["parseFailed"] # CLear the failed requests
    for failed in JSON.parse pf
      sendToParse.apply sendToParse, failed
*/
// In order to call this function when the browswer regains a network connection, an event listener is attached to the window.
// window.addEventListener "online", onParseOnline
// *getParseData* retrieves the object from Parse.
/*
getParseData = ->
  query = new Parse.Query UserData
  query.equalTo("user", Parse.User.current())
  query.first()
    .then (result) ->
      console.log result
      window.userData = result
      passphrase = localStorage["cryptoPhrase"]
      try
        done.update (sjcl.decrypt(passphrase, x) for x in result.get "done")
        * Attempt to sync when internet connection is reestablished
        onParseOnline()
      catch e
        console.log e
        if confirm "Your data on Parse couldn't be decrypted (probably because the passphrase used to encode it and the passphrase on this device don't match). Do you want to overwrite the data on Parse with encrypted data using your passphrase?"
          console.log "Replacing data"
          result.destroy()
          newParseData()
    , (err) ->
      console.log "Could not get data from Parse because of error", err.code, err.message
*/
// If the user is logged into the Parse database, then the login buttons are removed.
/*
requestIdleCallback ->
  * Try to get the current user logged in
  currentUser = Parse.User.current()
  if currentUser
    console.log "Logged into parse with", currentUser
    * Logged in
    document.getElementById("parseenc").value = localStorage["cryptoPhrase"]
    document.getElementById("parsemanage").style.display = "block"
    getParseData()
      .then ->
        * Make it so that all data in the cloud can be replaced
        document.getElementById("parseover").addEventListener "click", ->
          window.userData.destroy().then newParseData

  else
    getParseUP = ->
      [document.getElementById("parseusername").value,
      document.getElementById("parsepassword").value,
      document.getElementById("parsekey").value]
    * Not logged in
    document.getElementById("parsenew").addEventListener "click", ->
      [username, pass, key] = getParseUP()
      document.getElementById("parseenc").value = localStorage["cryptoPhrase"] = key
      user = new Parse.User()
      user.set "username", username
      user.set "password", pass
      user.signUp().then ->
        user.setACL new Parse.ACL Parse.User.current() # User's information only visiible to the user
        newParseData()
        document.getElementById("parsebuttons").style.display = "none"
        document.getElementById("parsemanage").style.display = "block"
      , (err) ->
        alert "Error creating a new account: #{err.code} #{err.message}"

    document.getElementById("parselogin").addEventListener "click", ->
      [username, pass, key] = getParseUP()
      document.getElementById("parseenc").value = localStorage["cryptoPhrase"] = key
      Parse.User.logIn username, pass
        .then ->
          document.getElementById("parsebuttons").style.display = "none"
          document.getElementById("parsemanage").style.display = "block"
        , (err) ->
          alert "Error logging in: #{err.code} #{err.message}"

    document.getElementById("parsebuttons").style.display = "block"
, { timeout: 2000 }
*/
// <a name="other"/>
// Other
// -----
//
// In order to show assignments when school ends, the bell schedule needs to be loaded.
/* To be implemented later when the pilot ends
requestIdleCallback ->
  send "https://raw.githubusercontent.com/harkerdev/schedules/master/index.html", "text"
    .then (resp) ->
      requestIdleCallback ->
        schedules = {index: [], schedules: []}
        days = resp.response.replace(/<.?div.*?>/g, "").split("\n\n")
        for line in days.shift().split("\n") # Loop through the days
          [day, label] = line.split("\t")
          console.log line, day, label
          spday = day.split("|")
          if spday.length is 1
            schedules.index.push [Date.parse(spday[0]), label]
          else
            day = new Date spday[0]
            while day < new Date(spday[1])
              schedules.index.push [day.getTime(), label]
              day.setDate day.getDate()+1
      , {timeout: 2000}
, {timeout: 2000}
*/
// The code below registers a service worker that caches the page so it can be viewed offline.
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(function (registration) {
        // Registration was successful
        return console.log('ServiceWorker registration successful with scope', registration.scope);
    }).catch(function (err) {
        // registration failed :(
        return console.log('ServiceWorker registration failed: ', err);
    });
}
// If the serviceworker detects that the web app has been updated, the commit is fetched from GitHub.
navigator.serviceWorker.addEventListener('message', function (event) {
    console.log('Getting commit because of serviceworker');
    if (event.data.getCommit) {
        return checkCommit();
    }
});
function __range__(left, right, inclusive) {
    var range = [];
    var ascending = left < right;
    var end = !inclusive ? right : ascending ? right + 1 : right - 1;
    for (var i_1 = left; ascending ? i_1 < end : i_1 > end; ascending ? i_1++ : i_1--) {
        range.push(i_1);
    }
    return range;
}
