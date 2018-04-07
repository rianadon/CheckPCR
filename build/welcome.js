"use strict";
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// Welcome to the welcome file.
// 
// This script runs on the welcome page, which welcomes new users, to make it more welcoming.
// If you haven't already, I welcome you to view the more important [main script](client.litcoffee).
// 
// Also, if you haven't noticed yet, I'm trying my best to use the word welcome as many times as I can just to welcome you.
// 
// First off, the buttons big, green, welcoming buttons on the bottom of the welcome page are assigned event listeners so that they can make the page show more welcoming information.
var advance;
for (var _i = 0, _a = document.getElementsByClassName("next"); _i < _a.length; _i++) {
    var nextButton = _a[_i];
    nextButton.addEventListener("click", (advance = function () {
        // The box holding the individual pages that ge scrolled
        // when pressing the "next" button is assigned to a varialbe.
        var npage;
        var container = document.body;
        // show the next page
        var view = +container.getAttribute("data-view");
        window.scrollTo(0, 0); // Scoll to top of the page
        history.pushState({ page: view + 1 }, "", "?page=" + view); // Make the broswer register a page shift
        (npage = document.querySelector("section:nth-child(" + (view + 2) + ")")).style.display = "inline-block";
        npage.style.transform = (npage.style.webkitTransform = (npage.style.MozTransform = "translateX(" + view * 100 + "%)"));
        // increase the data-view attribute by 1. The rest is handled by the css.
        container.setAttribute("data-view", view + 1);
        setTimeout(function () {
            //After animating is done, don't display the first page
            npage.style.transform = (npage.style.webkitTransform = (npage.style.MozTransform = "translateX(" + (view + 1) + "00%)"));
            return document.querySelector("section:nth-child(" + (view + 1) + ")").style.display = "none";
        }, 50);
    }));
}
// Additionally, the active class needs to be added when text fields are selected (for the login box) [copied from main script].
for (var _b = 0, _c = document.querySelectorAll("input[type=text], input[type=password], input[type=email], input[type=url], input[type=tel], input[type=number], input[type=search]"); _b < _c.length; _b++) {
    var input = _c[_b];
    input.addEventListener("change", function (evt) { return evt.target.parentNode.querySelector("label").classList.add("active"); });
    input.addEventListener("focus", function (evt) { return evt.target.parentNode.querySelector("label").classList.add("active"); });
    input.addEventListener("blur", function (evt) {
        if (evt.target.value.length === 0) {
            return evt.target.parentNode.querySelector("label").classList.remove("active");
        }
    });
}
// An event listener is attached to the window so that when the back button is pressed, a more welcoming page is displayed.
// Most of the code is the same from next button event listener, except that the page is switched the previous one, not the next one.
window.onpopstate = function (event) {
    var npage;
    var container = document.body;
    var view = (event.state != null) ? event.state.page : 0;
    window.scrollTo(0, 0); // Scoll to top of the page
    (npage = document.querySelector("section:nth-child(" + (view + 1) + ")")).style.display = "inline-block";
    npage.style.transform = (npage.style.webkitTransform = (npage.style.MozTransform = "translateX(" + view * 100 + "%)"));
    // increase the data-view attribute by 1. The rest is handled by the css.
    container.setAttribute("data-view", view);
    setTimeout(function () {
        //After animating is done, don't display the first page
        npage.style.transform = (npage.style.webkitTransform = (npage.style.MozTransform = "translateX(" + view + "00%)"));
        return document.querySelector("section:nth-child(" + (view + 2) + ")").style.display = "none";
    }, 50);
};
// When there is an error with parsing the data for Athena, a welcoming warning needs to be displayed (and the data needs to be saved too).
// 
// This code below is copied from the main script with two unwelcome lines commented out.
var parseAthenaData = function (dat) {
    var athenaData;
    if (dat === "") {
        athenaData = null;
        localStorage.removeItem("athenaData");
    }
    else {
        try {
            var d = JSON.parse(dat);
            var athenaData2 = {};
            var allCourseDetails = {};
            for (var _i = 0, _a = d.body.courses.sections; _i < _a.length; _i++) {
                var section = _a[_i];
                allCourseDetails[section.course_nid] = section;
            }
            for (var i_1 = d.body.courses.courses.length - 1; i_1 >= 0; i_1--) {
                var course = d.body.courses.courses[i_1];
                var courseDetails = allCourseDetails[course.nid];
                athenaData2[course.course_title] = {
                    link: "https://athena.harker.org" + courseDetails.link,
                    logo: courseDetails.logo.substr(0, courseDetails.logo.indexOf("\" alt=\"")).replace("<div class=\"profile-picture\"><img src=\"", "").replace("tiny", "reg"),
                    period: courseDetails.section_title
                };
            }
            athenaData = athenaData2;
            localStorage["athenaData"] = JSON.stringify(athenaData);
            document.getElementById("athenaDataError").style.display = "none";
            //document.getElementById("athenaDataRefresh").style.display = "block"
        }
        catch (e) {
            document.getElementById("athenaDataError").style.display = "block";
            //document.getElementById("athenaDataRefresh").style.display = "none"
            document.getElementById("athenaDataError").innerHTML = e.message;
        }
    }
};
// The text box also needs to execute this function when anything is typed / pasted.
document.getElementById("athenaData").addEventListener("input", function (evt) { return parseAthenaData(evt.target.value); });
// To avoid some unwelcoming errors, some constants are defined.
var loginURL = "";
var loginHeaders = {};
var viewData = {}; // The data to send when switching PCR views
// The following code is copied from the main script and slightly modified since there is no login dialog.
var send = function (url, respType, headers, data, progress) {
    if (progress === void 0) { progress = false; }
    return new Promise(function (resolve, reject) {
        var req = new XMLHttpRequest();
        req.open(((data != null) ? "POST" : "GET"), url, true);
        var progressElement = document.getElementById("progress");
        var progressInner = progressElement.querySelector("div");
        if (progress) {
            progressElement.offsetWidth; // Wait for it to render
            progressElement.classList.add("active");
            if (progressInner.classList.contains("determinate")) {
                progressInner.classList.remove("determinate");
                progressInner.classList.add("indeterminate");
            }
        }
        var load = localStorage["load"] || 170000;
        req.onload = function (evt) {
            localStorage["load"] = evt.loaded;
            if (progress) {
                progressElement.classList.remove("active");
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
                progressElement.classList.remove("active");
            }
            reject(Error("Network Error"));
        };
        if (progress) {
            req.onprogress = function (evt) {
                if (progressInner.classList.contains("indeterminate")) {
                    progressInner.classList.remove("indeterminate");
                    progressInner.classList.add("determinate");
                }
                return progressInner.style.width = ((100 * evt.loaded) / (evt.lengthComputable ? evt.total : load)) + "%";
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
var getCookie = function (cname) {
    var name = cname + "=";
    var ca = document.cookie.split(";");
    var i = 0;
    while (i < ca.length) {
        var c_1 = ca[i];
        while (c_1.charAt(0) === " ") {
            c_1 = c_1.substring(1);
        }
        if (c_1.indexOf(name) !== -1) {
            return c_1.substring(name.length, c_1.length);
        }
        i++;
    }
    return ""; // Blank if cookie not found
};
var setCookie = function (cname, cvalue, exdays) {
    var d = new Date;
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
};
var snackbar = function (message, action, f) {
    var snack = element("div", "snackbar");
    var snackInner = element("div", "snackInner", message);
    snack.appendChild(snackInner);
    if ((action != null) && (f != null)) {
        var actionE = element("a", [], action);
        actionE.addEventListener("click", function () {
            snack.classList.remove("active");
            return f();
        });
        snackInner.appendChild(actionE);
    }
    var add = function () {
        document.body.appendChild(snack);
        snack.offsetHeight;
        snack.classList.add("active");
        return setTimeout(function () {
            snack.classList.remove("active");
            return setTimeout(function () { return snack.remove(); }, 900);
        }, 5000);
    };
    var existing = document.querySelector(".snackbar");
    if (existing != null) {
        existing.classList.remove("active");
        setTimeout(add, 300);
    }
    else {
        add();
    }
};
var element = function (tag, cls, html, id) {
    var e = document.createElement(tag);
    if (typeof cls === "string") {
        e.classList.add(cls);
    }
    else {
        for (var _i = 0, cls_1 = cls; _i < cls_1.length; _i++) {
            var c_2 = cls_1[_i];
            e.classList.add(c_2);
        }
    }
    if (html != null) {
        e.innerHTML = html;
    }
    if (id != null) {
        e.setAttribute("id", id);
    }
    return e;
};
var dologin = function (val, submitEvt) {
    if (submitEvt === void 0) { submitEvt = false; }
    document.getElementById("login").classList.remove("active");
    // setTimeout ->
    //   document.getElementById("loginBackground").style.display = "none"
    // , 350
    var postArray = []; // Array of data to post
    localStorage["username"] = (val != null) && !submitEvt ? val[0] : document.getElementById("username").value;
    // updateAvatar()
    for (var h in loginHeaders) {
        if (h.toLowerCase().indexOf("user") !== -1) {
            loginHeaders[h] = (val != null) && !submitEvt ? val[0] : document.getElementById("username").value;
        }
        if (h.toLowerCase().indexOf("pass") !== -1) {
            loginHeaders[h] = (val != null) && !submitEvt ? val[1] : document.getElementById("password").value;
        }
        postArray.push(encodeURIComponent(h) + "=" + encodeURIComponent(loginHeaders[h]));
    }
    // Now send the login request to PCR
    if (location.protocol === "chrome-extension:") {
        console.time("Logging in");
        send(loginURL, "document", { "Content-type": "application/x-www-form-urlencoded" }, postArray.join("&"), true)
            .then(function (resp) {
            console.timeEnd("Logging in");
            if (resp.responseURL.indexOf("Login") !== -1) {
                // If PCR still wants us to log in, then the username or password enterred were incorrect.
                document.getElementById("loginIncorrect").style.display = "block";
                return document.getElementById("password").value = "";
                //document.getElementById("login").classList.add "active"
                //document.getElementById("loginBackground").style.display = "block"
            }
            else {
                // Otherwise, we are logged in
                if (document.getElementById("remember").checked) {
                    setCookie("userPass", window.btoa(document.getElementById("username").value + ":" + document.getElementById("password").value), 14); // Set a cookie with the username and password so we can log in automatically in the future without having to prompt for a username and password again
                }
                // loadingBar.style.display = "none"
                var t = Date.now();
                localStorage["lastUpdate"] = t;
                //document.getElementById("lastUpdate").innerHTML = formatUpdate t
                try {
                    parse(resp.response); // Parse the data PCR has replied with
                    display(); // Added
                }
                catch (e) {
                    console.log(e);
                    alert("Error parsing assignments. Is PCR on list or month view?");
                }
                return;
            }
        }, function (error) { return console.log("Could not log in to PCR. Either your network connection was lost during your visit or PCR is just not working. Here's the error:", error); });
    }
    else {
        console.log(postArray);
        send("/api/login?remember=" + document.getElementById("remember").checked, "json", { "Content-type": "application/x-www-form-urlencoded" }, postArray.join("&"), true)
            .then(function (resp) {
            console.debug("Logging in:", resp.response.time);
            if (resp.response.login) {
                // If PCR still wants us to log in, then the username or password enterred were incorrect.
                document.getElementById("loginIncorrect").style.display = "block";
                document.getElementById("password").value = "";
                // document.getElementById("login").classList.add "active"
                // document.getElementById("loginBackground").style.display = "block"
            }
            else {
                var t = Date.now();
                localStorage["lastUpdate"] = t;
                //document.getElementById("lastUpdate").innerHTML = formatUpdate t
                window.data = resp.response.data;
                display();
                localStorage["data"] = JSON.stringify(data);
            }
        }, function (error) { return console.log("Could not log in to PCR. Either your network connection was lost during your visit or PCR is just not working. Here's the error:", error); });
    }
};
var attachmentify = function (element) {
    var attachments = [];
    // Get all links
    var as = element.getElementsByTagName('a');
    var a = 0;
    while (a < as.length) {
        if (as[a].id.indexOf('Attachment') !== -1) {
            attachments.push([
                as[a].innerHTML,
                as[a].search + as[a].hash
            ]);
            as[a].remove();
            a--; // subtract because all elements have shifted down
        }
        a++;
    }
    return attachments;
};
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
var findId = function (element, tag, id) {
    for (var _i = 0, _a = element.getElementsByTagName(tag); _i < _a.length; _i++) {
        var e = _a[_i];
        if (e.id.indexOf(id) !== -1) {
            return e;
        }
    }
};
var parse = function (doc) {
    console.time("Handling data"); // To time how long it takes to parse the assignments
    var handledDataShort = []; // Array used to make sure we don"t parse the same assignment twice.
    window.data = { classes: [], assignments: [], monthView: doc.querySelector(".rsHeaderMonth").parentNode.classList.contains("rsSelected") }; // Reset the array in which all of your assignments are stored in.
    for (var _i = 0, _a = doc.getElementsByTagName("input"); _i < _a.length; _i++) {
        var e = _a[_i];
        viewData[e.name] = e.value || "";
    }
    // Now, the classes you take are parsed (these are the checkboxes you see up top when looking at PCR).
    var classes = findId(doc, "table", "cbClasses").getElementsByTagName("label");
    for (var _b = 0, classes_1 = classes; _b < classes_1.length; _b++) {
        var c = classes_1[_b];
        window.data.classes.push(c.innerHTML);
    }
    var assignments = doc.getElementsByClassName("rsApt rsAptSimple");
    // Now parse the assignments
    for (var _c = 0, assignments_1 = assignments; _c < assignments_1.length; _c++) {
        var ca = assignments_1[_c];
        var assignment = {};
        // The starting date and ending date of the assignment are parsed first
        var range = findId(ca, "span", "StartingOn").innerHTML.split(" - ");
        assignment.start = Math.floor((Date.parse(range[0])) / 1000 / 3600 / 24);
        assignment.end = (range[1] != null) ? Math.floor((Date.parse(range[1])) / 1000 / 3600 / 24) : assignment.start;
        // Then, the name of the assignment is parsed
        var t = findId(ca, "span", "lblTitle");
        var title = t.innerHTML;
        // The actual body of the assignment and its attachments are parsed next
        var b = t.parentNode.parentNode;
        var divs = b.getElementsByTagName("div");
        for (var d = 0; d < 2; d++) {
            divs[0].remove();
        }
        var ap = attachmentify(b); // Separates attachments from the body
        assignment.attachments = ap;
        assignment.body = urlify(b.innerHTML).replace(/^(?:\s*<br\s*\/?>)*/, "").replace(/(?:\s*<br\s*\/?>)*\s*$/, "").trim(); // The replaces remove leading and trailing newlines
        // Finally, we separate the class name and type (homework, classwork, or projects) from the title of the assignment
        assignment.type = title.match(/\(([^)]*\)*)\)$/)[1].toLowerCase().replace("& quizzes", "").replace("tests", "test");
        assignment.baseType = (ca.title.substring(0, ca.title.indexOf("\n"))).toLowerCase().replace("& quizzes", "").replace(/\s/g, "");
        for (var pos = 0; pos < window.data.classes.length; pos++) {
            c = window.data.classes[pos];
            if (title.indexOf(c) !== -1) {
                assignment.class = pos;
                title = title.replace(c, "");
                break;
            }
        }
        assignment.title = title.substring(title.indexOf(": ") + 2).replace(/\([^\(\)]*\)$/, "").trim();
        // To make sure there are no repeats, the title of the assignment (only letters) and its start & end date are combined to give it a unique identifier.
        assignment.id = assignment.title.replace(/[^\w]*/g, "") + (assignment.start + assignment.end);
        if (handledDataShort.indexOf(assignment.id) === -1) {
            handledDataShort.push(assignment.id);
            window.data.assignments.push(assignment);
        }
    }
    console.timeEnd("Handling data");
    // Now allow the view to be switched
    document.body.classList.add("loaded");
    //display() # Display the data
    localStorage["data"] = JSON.stringify(data); // Store for offline use
};
// A slightly modified fetch function is then called
(function () {
    if (location.protocol === "chrome-extension:") {
        console.time("Fetching assignments");
        send("https://webappsca.pcrsoft.com/Clue/SC-Assignments-End-Date-Range/7536", "document")
            .then(function (resp) {
            var e;
            console.timeEnd("Fetching assignments");
            if (resp.responseURL.indexOf("Login") !== -1) {
                // We have to log in now
                loginURL = resp.responseURL;
                for (var _i = 0, _a = resp.response.getElementsByTagName("input"); _i < _a.length; _i++) {
                    e = _a[_i];
                    loginHeaders[e.name] = e.value || "";
                }
                console.log("Need to log in");
                /* up = getCookie("userPass") # Attempts to get the cookie *userPass*, which is set if the "Remember me" checkbox is checked when logging in through CheckPCR
                if up is ""
                  document.getElementById("loginBackground").style.display = "block"
                  document.getElementById("login").classList.add "active"
                else
                  dologin window.atob(up).split(":") # Because we were remembered, we can log in immediately without waiting for the user to log in through the login form
                */
                // Add login button event listeners and enable the login button
                document.getElementById("login").classList.add("ready");
                document.getElementById("login").addEventListener("submit", function (evt) {
                    evt.preventDefault();
                    return dologin(null, true);
                });
            }
            else {
                // Logged in now
                console.log("Fetching assignments successful");
                var t = Date.now();
                localStorage["lastUpdate"] = t;
                // document.getElementById("lastUpdate").innerHTML = formatUpdate t
                try {
                    parse(resp.response);
                }
                catch (error) {
                    e = error;
                    console.log(e);
                    alert("Error parsing assignments. Is PCR on list or month view?");
                }
                document.getElementById("loginNext").style.display = "";
                document.getElementById("login").classList.add("done");
            }
        }, function (error) {
            console.log("Could not fetch assignments; You are probably offline. Here's the error:", error);
            snackbar("You must be online to set up Check PCR. Please refresh when the internet works.");
        });
    }
    else {
        send("/api/start", "json")
            .then(function (resp) {
            console.debug("Fetching assignments:", resp.response.time);
            if (resp.response.login) {
                (loginHeaders = resp.response.loginHeaders);
                // document.getElementById("loginBackground").style.display = "block"
                // document.getElementById("login").classList.add "active"
                // Add login button event listeners and enable the login button
                document.getElementById("login").classList.add("ready");
                document.getElementById("login").addEventListener("submit", function (evt) {
                    evt.preventDefault();
                    return dologin(null, true);
                });
            }
            else {
                console.log("Fetching assignments successful");
                var t = Date.now();
                localStorage["lastUpdate"] = t;
                // document.getElementById("lastUpdate").innerHTML = formatUpdate t
                window.data = resp.response.data;
                localStorage["data"] = JSON.stringify(data);
                document.getElementById("loginNext").style.display = "";
                document.getElementById("login").classList.add("done");
            }
        }, function (error) {
            console.log("Could not fetch assignments; You are probably offline. Here's the error:", error);
            return snackbar("Could not fetch your assignments", "Retry", fetch);
        });
    }
})();
// The display function is set to advance the setup proccess so there aren't any unwelcoming errors.
var display = advance;
