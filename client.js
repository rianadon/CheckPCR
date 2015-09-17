var a, aa, ab, ac, attachmentify, c, cc, closeOpened, color, d, dateString, display, dologin, done, e, element, fetch, findId, fn, fullMonths, getCookie, getResizeAssignments, headroom, hex2rgb, input, intervalRefresh, j, k, l, labrgb, len, len1, len2, len3, len4, len5, len6, len7, len8, list, listName, loginHeaders, loginURL, mimeTypes, months, o, p, palette, parse, parseDateHash, pe, q, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8, resize, rgb2hex, ripple, scroll, send, setCookie, sp, tab, tzoff, u, updateAvatar, updateColors, urlify, viewData, weekdays, z,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

loginURL = "";

loginHeaders = {};

months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

fullMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

tzoff = (new Date()).getTimezoneOffset() * 1000 * 60;

mimeTypes = {
  "application/msword": ["Word Doc", "document"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ["Word Doc", "document"],
  "application/vnd.ms-powerpoint": ["PPT Presentation", "slides"],
  "application/pdf": ["PDF File", "pdf"],
  "text/plain": ["Text Doc", "plain"]
};

scroll = 0;

viewData = {};

send = function(url, respType, headers, data, progress) {
  if (progress == null) {
    progress = false;
  }
  return new Promise(function(resolve, reject) {
    var header, headername, load, progressElement, progressInner, req;
    req = new XMLHttpRequest();
    req.open((data != null ? "POST" : "GET"), url, true);
    progressElement = document.getElementById("progress");
    progressInner = progressElement.querySelector("div");
    if (progress) {
      progressElement.offsetWidth;
      progressElement.classList.add("active");
      if (progressInner.classList.contains("determinate")) {
        progressInner.classList.remove("determinate");
        progressInner.classList.add("indeterminate");
      }
    }
    load = localStorage["load"] || 170000;
    req.onload = function(evt) {
      localStorage["load"] = evt.loaded;
      if (progress) {
        progressElement.classList.remove("active");
      }
      if (req.status === 200) {
        resolve(req);
      } else {
        reject(Error(req.statusText));
      }
    };
    req.onerror = function() {
      if (progress) {
        progressElement.classList.remove("active");
      }
      reject(Error("Network Error"));
    };
    if (progress) {
      req.onprogress = function(evt) {
        if (progressInner.classList.contains("indeterminate")) {
          progressInner.classList.remove("indeterminate");
          progressInner.classList.add("determinate");
        }
        return progressInner.style.width = 100 * evt.loaded / (evt.lengthComputable ? evt.total : load) + "%";
      };
    }
    if (respType != null) {
      req.responseType = respType;
    }
    if (headers != null) {
      for (headername in headers) {
        header = headers[headername];
        req.setRequestHeader(headername, header);
      }
    }
    if (data != null) {
      req.send(data);
    } else {
      req.send();
    }
  });
};

getCookie = function(cname) {
  var c, ca, i, name;
  name = cname + "=";
  ca = document.cookie.split(";");
  i = 0;
  while (i < ca.length) {
    c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) !== -1) {
      return c.substring(name.length, c.length);
    }
    i++;
  }
  return "";
};

setCookie = function(cname, cvalue, exdays) {
  var d, expires;
  d = new Date;
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + "; " + expires;
};

fetch = function() {
  console.time("Fetching assignments");
  send("https://webappsca.pcrsoft.com/Clue/Student-Assignments-End-Date-Range/7536", "document", null, null, true).then(function(resp) {
    var e, j, len, ref, up;
    console.timeEnd("Fetching assignments");
    if (resp.responseURL.indexOf("Login") !== -1) {
      loginURL = resp.responseURL;
      ref = resp.response.getElementsByTagName("input");
      for (j = 0, len = ref.length; j < len; j++) {
        e = ref[j];
        loginHeaders[e.name] = e.value || "";
      }
      console.log("Need to log in");
      up = getCookie("userPass");
      if (up === "") {
        document.getElementById("loginBackground").style.display = "block";
        document.getElementById("login").classList.add("active");
      } else {
        dologin(window.atob(up).split(":"));
      }
    } else {
      console.log("Fetching assignments successful");
      try {
        parse(resp.response);
      } catch (_error) {
        e = _error;
        console.log(e);
        alert("Error parsing assignments. Is PCR on list or month view?");
      }
    }
  }, function(error) {
    console.log("Could not fetch assignments; You are probably offline. Here's the error:", error);
    if (typeof offline !== "undefined" && offline !== null) {
      offline.style.display = "block";
    }
  });
};

dologin = function(val, submitEvt) {
  var h, postArray;
  if (submitEvt == null) {
    submitEvt = false;
  }
  document.getElementById("login").classList.remove("active");
  setTimeout(function() {
    return document.getElementById("loginBackground").style.display = "none";
  }, 300);
  postArray = [];
  localStorage["username"] = (val != null) && !submitEvt ? val[0] : document.getElementById("username").value;
  updateAvatar();
  for (h in loginHeaders) {
    if (h.toLowerCase().indexOf("user") !== -1) {
      loginHeaders[h] = (val != null) && !submitEvt ? val[0] : document.getElementById("username").value;
    }
    if (h.toLowerCase().indexOf("pass") !== -1) {
      loginHeaders[h] = (val != null) && !submitEvt ? val[1] : document.getElementById("password").value;
    }
    postArray.push(encodeURIComponent(h) + "=" + encodeURIComponent(loginHeaders[h]));
  }
  console.time("Logging in");
  send(loginURL, "document", {
    "Content-type": "application/x-www-form-urlencoded"
  }, postArray.join("&"), true).then(function(resp) {
    var e;
    console.timeEnd("Logging in");
    if (resp.responseURL.indexOf("Login") !== -1) {
      document.getElementById("loginIncorrect").style.display = "block";
      document.getElementById("password").value = "";
      document.getElementById("login").classList.add("active");
      document.getElementById("loginBackground").style.display = "block";
    } else {
      if (document.getElementById("remember").checked) {
        setCookie("userPass", window.btoa(document.getElementById("username").value + ":" + document.getElementById("password").value), 14);
      }
      try {
        parse(resp.response);
      } catch (_error) {
        e = _error;
        console.log(e);
        alert("Error parsing assignments. Is PCR on list or month view?");
      }
    }
  }, function(error) {
    return console.log("Could not log in to PCR. Either your network connection was lost during your visit or PCR is just not working. Here's the error:", error);
  });
};

document.getElementById("login").addEventListener("submit", function(evt) {
  evt.preventDefault();
  return dologin(null, true);
});

parseDateHash = function(element) {
  var dateSplit;
  dateSplit = element.hash.substring(1).split("-");
  return (new Date(+dateSplit[0], +dateSplit[1] - 1, +dateSplit[2])).getTime();
};

attachmentify = function(element) {
  var a, as, attachments;
  attachments = [];
  as = element.getElementsByTagName('a');
  a = 0;
  while (a < as.length) {
    if (as[a].id.indexOf('Attachment') !== -1) {
      attachments.push([as[a].innerHTML, as[a].search + as[a].hash]);
      as[a].remove();
      a--;
    }
    a++;
  }
  return attachments;
};

urlify = function(text) {
  return text.replace(/(https?:\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]+)/ig, function(str, str2, offset) {
    if (/href\s*=\s*./.test(text.substring(offset - 10, offset))) {
      return str;
    } else {
      return '<a href="' + str + '">' + str + '</a>';
    }
  });
};

findId = function(element, tag, id) {
  var e, j, len, ref;
  ref = element.getElementsByTagName(tag);
  for (j = 0, len = ref.length; j < len; j++) {
    e = ref[j];
    if (e.id.indexOf(id) !== -1) {
      return e;
    }
  }
};

parse = function(doc) {
  var ap, assignment, assignments, b, c, ca, classes, d, divs, e, handledDataShort, j, k, l, len, len1, len2, len3, o, pos, q, range, ref, ref1, t, title;
  console.time("Handling data");
  handledDataShort = [];
  window.data = {
    classes: [],
    assignments: [],
    monthView: doc.querySelector(".rsHeaderMonth").parentNode.classList.contains("rsSelected")
  };
  ref = doc.getElementsByTagName("input");
  for (j = 0, len = ref.length; j < len; j++) {
    e = ref[j];
    viewData[e.name] = e.value || "";
  }
  classes = findId(doc, "table", "cbClasses").getElementsByTagName("label");
  for (k = 0, len1 = classes.length; k < len1; k++) {
    c = classes[k];
    window.data.classes.push(c.innerHTML);
  }
  assignments = doc.getElementsByClassName("rsApt rsAptSimple");
  for (l = 0, len2 = assignments.length; l < len2; l++) {
    ca = assignments[l];
    assignment = {};
    range = findId(ca, "span", "StartingOn").innerHTML.split(" - ");
    assignment.start = Math.floor((Date.parse(range[0])) / 1000 / 3600 / 24);
    assignment.end = range[1] != null ? Math.floor((Date.parse(range[1])) / 1000 / 3600 / 24) : assignment.start;
    t = findId(ca, "span", "lblTitle");
    title = t.innerHTML;
    b = t.parentNode.parentNode;
    divs = b.getElementsByTagName("div");
    for (d = o = 0; o < 2; d = ++o) {
      divs[0].remove();
    }
    ap = attachmentify(b);
    assignment.attachments = ap;
    assignment.body = urlify(b.innerHTML).replace(/^(?:\s*<br\s*\/?>)*/, "").replace(/(?:\s*<br\s*\/?>)*\s*$/, "").trim();
    assignment.type = title.match(/\(([^\(\)]*)\)$/)[1].toLowerCase().replace("& quizzes", "").replace("tests", "test");
    assignment.baseType = (ca.title.substring(0, ca.title.indexOf("\n"))).toLowerCase().replace("& quizzes", "");
    ref1 = window.data.classes;
    for (pos = q = 0, len3 = ref1.length; q < len3; pos = ++q) {
      c = ref1[pos];
      if (title.indexOf(c) !== -1) {
        assignment["class"] = pos;
        title = title.replace(c, "");
        break;
      }
    }
    assignment.title = title.substring(title.indexOf(": ") + 2).replace(/\([^\(\)]*\)$/, "").trim();
    assignment.id = assignment.title.replace(/[^\w]*/g, "") + (assignment.start + assignment.end);
    if (handledDataShort.indexOf(assignment.id) === -1) {
      handledDataShort.push(assignment.id);
      window.data.assignments.push(assignment);
    }
  }
  localStorage["data"] = JSON.stringify(data);
  console.timeEnd("Handling data");
  document.body.classList.add("loaded");
  display();
};


/*document.getElementById("switchViews").addEventListener "click", ->
  if Object.keys(viewData).length > 0
    viewData["__EVENTTARGET"] = "ctl00$ctl00$baseContent$baseContent$flashTop$ctl00$RadScheduler1"
    viewData["__EVENTARGUMENT"] = JSON.stringify {Command: "SwitchTo#{if document.body.getAttribute("data-pcrview") is "month" then "Week" else "Month"}View"}
    viewData["ctl00_ctl00_baseContent_baseContent_flashTop_ctl00_RadScheduler1_ClientState"] = JSON.stringify {scrollTop:0,scrollLeft:0,isDirty:false}
    viewData["ctl00_ctl00_RadScriptManager1_TSM"] = ";;AjaxControlToolkit, Version=4.1.40412.0, Culture=neutral, PublicKeyToken=28f01b0e84b6d53e:en-US:acfc7575-cdee-46af-964f-5d85d9cdcf92:ea597d4b:b25378d2"
    postArray = [] # Array of data to post
    for h,v of viewData
      postArray.push encodeURIComponent(h) + "=" + encodeURIComponent(v)
    send "https://webappsca.pcrsoft.com/Clue/Student-Assignments-End-Date-Range/7536", "document", { "Content-type": "application/x-www-form-urlencoded" }, postArray.join("&"), true
      .then (resp) ->
        try
          parse resp.response # Parse the data PCR has replied with
        catch e
          console.log e
          alert "Error parsing assignments. Is PCR on list or month view?"
        return
      , (error) ->
        console.log "Could not switch views. Either your network connection was lost during your visit or PCR is just not working. Here's the error:", error
 */

element = function(tag, cls, html, id) {
  var c, e, j, len;
  e = document.createElement(tag);
  if (typeof cls === "string") {
    e.classList.add(cls);
  } else {
    for (j = 0, len = cls.length; j < len; j++) {
      c = cls[j];
      e.classList.add(c);
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

dateString = function(date, addThis) {
  var j, len, r, ref, relative, today;
  if (addThis == null) {
    addThis = false;
  }
  relative = ["Tomorrow", "Today", "Yesterday", "2 days ago"];
  today = new Date();
  today.setDate(today.getDate() + 1);
  for (j = 0, len = relative.length; j < len; j++) {
    r = relative[j];
    if (date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()) {
      return r;
    }
    today.setDate(today.getDate() - 1);
  }
  today = new Date();
  if ((0 < (ref = (date.getTime() - today.getTime()) / 1000 / 3600 / 24) && ref <= 6)) {
    return (addThis ? "This " : "") + weekdays[date.getDay()];
  }
  return weekdays[date.getDay()] + ", " + fullMonths[date.getMonth()] + " " + (date.getDate());
};

display = function() {
  var already, assignment, attachment, attachments, close, complete, d, date, day, dayTable, e, end, fn, fn1, found, id, j, k, l, len, len1, len2, len3, len4, main, month, n, name, nextSat, num, o, pos, previousAssignments, q, ref, ref1, ref2, ref3, ref4, ref5, s, separated, span, spanRelative, split, start, startSun, taken, te, times, today, todayDiv, todaySE, tr, u, weekHeights, weekId, wk, year;
  console.time("Displaying data");
  document.body.setAttribute("data-pcrview", window.data.monthView ? "month" : "other");
  main = document.querySelector("main");
  taken = {};
  today = Math.floor((Date.now() - tzoff) / 1000 / 3600 / 24);
  todayDiv = null;
  if (window.data.monthView) {
    start = Math.min.apply(Math, (function() {
      var j, len, ref, results;
      ref = window.data.assignments;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        assignment = ref[j];
        results.push(assignment.start);
      }
      return results;
    })());
    end = Math.max.apply(Math, (function() {
      var j, len, ref, results;
      ref = window.data.assignments;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        assignment = ref[j];
        results.push(assignment.end);
      }
      return results;
    })());
    year = (new Date()).getFullYear();
    month = 0;
    ref = window.data.assignments;
    for (j = 0, len = ref.length; j < len; j++) {
      assignment = ref[j];
      month += (new Date((assignment.start + assignment.end) * 500 * 3600 * 24)).getMonth();
    }
    month = Math.round(month / window.data.assignments.length);
    start = new Date(Math.max(start * 1000 * 3600 * 24 + tzoff, (new Date(year, month)).getTime()));
    end = new Date(Math.min(end * 1000 * 3600 * 24 + tzoff, (new Date(year, month + 1, 0)).getTime()));
  } else {
    todaySE = new Date();
    start = new Date(todaySE.getFullYear(), todaySE.getMonth(), todaySE.getDate());
    end = new Date(todaySE.getFullYear(), todaySE.getMonth(), todaySE.getDate());
  }
  start.setDate(start.getDate() - start.getDay());
  end.setDate(end.getDate() + (6 - end.getDay()));
  d = new Date(start);
  wk = null;
  while (d <= end) {
    if (d.getDay() === 0) {
      id = "wk" + (d.getMonth()) + "-" + (d.getDate());
      if ((document.getElementById(id)) == null) {
        wk = element("section", "week", null, "wk" + (d.getMonth()) + "-" + (d.getDate()));
        dayTable = element("table", "dayTable");
        tr = dayTable.insertRow();
        for (day = k = 0; k < 7; day = ++k) {
          tr.insertCell();
        }
        wk.appendChild(dayTable);
        main.appendChild(wk);
      } else {
        wk = document.getElementById(id);
      }
    }
    if (wk.getElementsByClassName("day").length <= d.getDay()) {
      day = element("div", "day", null, "day");
      if (Math.floor((d - tzoff) / 1000 / 3600 / 24) === today) {
        day.classList.add("today");
        todayDiv = day;
      }
      month = element("span", "month", months[d.getMonth()]);
      day.appendChild(month);
      date = element("span", "date", d.getDate());
      day.appendChild(date);
      wk.appendChild(day);
    }
    taken[d] = [];
    d.setDate(d.getDate() + 1);
  }
  split = [];
  ref1 = window.data.assignments;
  for (num = l = 0, len1 = ref1.length; l < len1; num = ++l) {
    assignment = ref1[num];
    s = Math.max(start.getTime(), assignment.start * 1000 * 3600 * 24 + tzoff);
    e = Math.min(end.getTime(), assignment.end * 1000 * 3600 * 24 + tzoff);
    span = (e - s) / 1000 / 3600 / 24;
    spanRelative = span - (6 - (new Date(s)).getDay());
    nextSat = e / 1000 / 3600 / 24 - spanRelative;
    n = -6;
    while (n < spanRelative) {
      split.push({
        assignment: num,
        start: new Date(Math.max(s, (nextSat + n) * 1000 * 3600 * 24)),
        end: new Date(Math.min(e, (nextSat + n + 6) * 1000 * 3600 * 24))
      });
      n += 7;
    }
  }
  weekHeights = {};
  previousAssignments = {};
  ref2 = document.getElementsByClassName("assignment");
  for (o = 0, len2 = ref2.length; o < len2; o++) {
    assignment = ref2[o];
    previousAssignments[assignment.getAttribute("id")] = assignment;
  }
  fn = function(id) {
    return complete.addEventListener("mouseup", function(evt) {
      var added, el, elem, len4, ref3, u;
      if (evt.which === 1) {
        el = evt.target;
        while (!el.classList.contains("assignment")) {
          el = el.parentNode;
        }
        added = true;
        if (el.classList.contains("done")) {
          done.splice(done.indexOf(id), 1);
        } else {
          added = false;
          done.push(id);
        }
        localStorage["done"] = JSON.stringify(done);
        if (document.body.getAttribute("data-view") === "1") {
          setTimeout(function() {
            var elem, len4, ref3, u;
            ref3 = document.querySelectorAll(".assignment[id*=\"" + id + "\"], .upcomingTest[id*=\"test" + id + "\"]");
            for (u = 0, len4 = ref3.length; u < len4; u++) {
              elem = ref3[u];
              elem.classList.toggle("done");
            }
            if (added) {
              if (document.querySelectorAll(".assignment.listDisp:not(.done)").length !== 0) {
                document.body.classList.remove("noList");
              }
            } else {
              if (document.querySelectorAll(".assignment.listDisp:not(.done)").length === 0) {
                document.body.classList.add("noList");
              }
            }
            return resize();
          }, 100);
        } else {
          ref3 = document.querySelectorAll(".assignment[id*=\"" + id + "\"], .upcomingTest[id*=\"test" + id + "\"]");
          for (u = 0, len4 = ref3.length; u < len4; u++) {
            elem = ref3[u];
            elem.classList.toggle("done");
          }
          if (added) {
            if (document.querySelectorAll(".assignment.listDisp:not(.done)").length !== 0) {
              document.body.classList.remove("noList");
            }
          } else {
            if (document.querySelectorAll(".assignment.listDisp:not(.done)").length === 0) {
              document.body.classList.add("noList");
            }
          }
        }
      }
    });
  };
  for (q = 0, len3 = split.length; q < len3; q++) {
    s = split[q];
    assignment = window.data.assignments[s.assignment];
    separated = window.data.classes[assignment["class"]].match(/((?:\d*\s+)?(?:(?:hon\w*|(?:adv\w*\s*)?core)\s+)?)(.*)/i);
    startSun = new Date(s.start.getTime());
    startSun.setDate(startSun.getDate() - startSun.getDay());
    weekId = "wk" + (startSun.getMonth()) + "-" + (startSun.getDate());
    e = element("div", ["assignment", assignment.baseType, "anim"], "<small><span class='extra'>" + separated[1] + "</span>" + separated[2] + "</small><span class='title'>" + assignment.title + "</span><input type='hidden' class='due' value='" + assignment.end + "' />", assignment.id + weekId);
    if (ref3 = assignment.id, indexOf.call(done, ref3) >= 0) {
      e.classList.add("done");
    }
    e.setAttribute("data-class", window.data.classes[assignment["class"]]);
    close = element("a", ["close", "material-icons"], "close");
    close.addEventListener("click", closeOpened);
    e.appendChild(close);
    complete = element("a", ["complete", "material-icons", "waves"], "done");
    ripple(complete);
    id = assignment.id;
    fn(id);
    e.appendChild(complete);
    start = new Date(assignment.start * 1000 * 3600 * 24 + tzoff);
    end = new Date(assignment.end * 1000 * 3600 * 24 + tzoff);
    times = element("div", "range", assignment.start === assignment.end ? dateString(start) : (dateString(start)) + " &ndash; " + (dateString(end)));
    e.appendChild(times);
    if (assignment.attachments.length > 0) {
      attachments = element("div", "attachments");
      ref4 = assignment.attachments;
      fn1 = function(attachment) {
        var a, req;
        a = element("a", [], attachment[0]);
        a.href = "https://webappsca.pcrsoft.com/Clue/Common/AttachmentRender.aspx" + attachment[1];
        req = new XMLHttpRequest();
        req.open("HEAD", a.href);
        req.onload = function() {
          var type;
          if (req.status === 200) {
            type = req.getResponseHeader("Content-Type");
            if (mimeTypes[type] != null) {
              a.classList.add(mimeTypes[type][1]);
              span = element("span", [], mimeTypes[type][0]);
            } else {
              span = element("span", [], "Unknown file type");
            }
            a.appendChild(span);
          }
        };
        req.send();
        attachments.appendChild(a);
      };
      for (u = 0, len4 = ref4.length; u < len4; u++) {
        attachment = ref4[u];
        fn1(attachment);
      }
      e.appendChild(attachments);
    }
    e.appendChild(element("div", "body", assignment.body));
    if (start < s.start) {
      e.classList.add("fromWeekend");
    }
    if (end > s.end) {
      e.classList.add("overWeekend");
    }
    e.classList.add("s" + (s.start.getDay()));
    e.classList.add("e" + (6 - s.end.getDay()));
    if ((Math.floor(s.start / 1000 / 3600 / 24) <= today && today <= Math.floor(s.end / 1000 / 3600 / 24))) {
      e.classList.add("listDisp");
    }
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
    d = new Date(s.start);
    while (d <= s.end) {
      taken[d].push(pos);
      d.setDate(d.getDate() + 1);
    }
    e.style.marginTop = pos * 30 + "px";
    e.addEventListener("click", function(evt) {
      var back, el;
      el = evt.target;
      while (!el.classList.contains("assignment")) {
        el = el.parentNode;
      }
      if (document.getElementsByClassName("full").length === 0 && document.body.getAttribute("data-view") === "0") {
        el.classList.add("modify");
        el.style.top = el.getBoundingClientRect().top - document.body.scrollTop - parseInt(el.style.marginTop) + 44 + "px";
        el.setAttribute("data-top", el.style.top);
        document.body.style.overflow = "hidden";
        back = document.getElementById("background");
        back.classList.add("active");
        back.style.display = "block";
        setTimeout(function() {
          el.classList.add("full");
          el.style.top = 75 - parseInt(el.style.marginTop) + "px";
          return setTimeout(function() {
            return el.classList.remove("anim");
          }, 300);
        }, 0);
      }
    });
    wk = document.getElementById(weekId);
    if (assignment.baseType === "test" && start > Date.now()) {
      te = element("div", "upcomingTest", "<i class='material-icons'>assessment</i><span class='title'>" + assignment.title + "</span><small>" + separated[2] + "</small><div class='range'>" + (dateString(end, true)) + "</div>", "test" + assignment.id);
      te.setAttribute("data-class", window.data.classes[assignment["class"]]);
      id = assignment.id;
      (function(id) {
        return te.addEventListener("click", function() {
          var doScrolling, smoothScroll;
          smoothScroll = function(to) {
            return new Promise(function(resolve, reject) {
              var amount, from, step;
              start = null;
              from = document.body.scrollTop;
              amount = to - from;
              step = function(timestamp) {
                var progress;
                if (start == null) {
                  start = timestamp;
                }
                progress = timestamp - start;
                window.scrollTo(0, from + amount * (progress / 300));
                if (progress < 300) {
                  return requestAnimationFrame(step);
                } else {
                  setTimeout(function() {
                    return document.querySelector("nav").classList.remove("headroom--unpinned");
                  }, 1);
                  return setTimeout(function() {
                    return resolve();
                  }, amount);
                }
              };
              return requestAnimationFrame(step);
            });
          };
          doScrolling = function() {
            var el;
            el = document.querySelector(".assignment[id*=\"" + id + "\"]");
            return smoothScroll(el.getBoundingClientRect().top + document.body.scrollTop - 116).then(function() {
              el.click();
            });
          };
          if (document.body.getAttribute("data-view") === "0") {
            return doScrolling();
          } else {
            document.querySelector("#navTabs>li:first-child").click();
            return setTimeout(doScrolling, 500);
          }
        });
      })(id);
      if (ref5 = assignment.id, indexOf.call(done, ref5) >= 0) {
        te.classList.add("done");
      }
      if (document.getElementById("test" + assignment.id) != null) {
        document.getElementById("test" + assignment.id).innerHTML = te.innerHTML;
      } else {
        document.getElementById("infoTests").appendChild(te);
      }
    }
    if ((weekHeights[weekId] == null) || pos > weekHeights[weekId]) {
      weekHeights[weekId] = pos;
      wk.style.height = 47 + (pos + 1) * 30 + "px";
    }
    already = document.getElementById(assignment.id + weekId);
    if (already != null) {
      already.getElementsByClassName("body")[0].innerHTML = e.getElementsByClassName("body")[0].innerHTML;
    } else {
      wk.appendChild(e);
    }
    delete previousAssignments[assignment.id + weekId];
  }
  for (name in previousAssignments) {
    assignment = previousAssignments[name];
    if (assignment.classList.contains("full")) {
      document.getElementById("background").classList.remove("active");
    }
    assignment.remove();
  }
  if (todayDiv != null) {
    scroll = todayDiv.getBoundingClientRect().top + document.body.scrollTop - 112;
    if (scroll < 50) {
      scroll = 0;
    }
    window.scrollTo(0, scroll);
  }
  if (document.querySelectorAll(".assignment.listDisp:not(.done)").length === 0) {
    document.body.classList.add("noList");
  }
  if (document.body.getAttribute("data-view") === "1") {
    resize();
  }
  return console.timeEnd("Displaying data");
};

closeOpened = function(evt) {
  var back, el;
  evt.stopPropagation();
  el = document.querySelector(".full");
  el.style.top = el.getAttribute("data-top");
  el.classList.add("anim");
  el.classList.remove("full");
  el.scrollTop = 0;
  document.body.style.overflow = "auto";
  back = document.getElementById("background");
  back.classList.remove("active");
  return setTimeout(function() {
    back.style.display = "none";
    el.classList.remove("anim");
    el.classList.remove("modify");
    el.style.top = "auto";
    el.offsetHeight;
    return el.classList.add("anim");
  }, 300);
};

ripple = function(el) {
  el.addEventListener("mousedown", function(evt) {
    var e, size, target, wave, x, y;
    if (evt.which === 1) {
      target = evt.target.classList.contains("wave") ? evt.target.parentNode : evt.target;
      wave = element("span", "wave");
      size = Math.max(parseInt(target.offsetWidth), parseInt(target.offsetHeight));
      wave.style.width = wave.style.height = size + "px";
      e = evt.target;
      x = evt.pageX;
      y = evt.pageY;
      while (e) {
        x -= e.offsetLeft;
        y -= e.offsetTop;
        e = e.offsetParent;
      }
      wave.style.top = y - size / 2 + "px";
      wave.style.left = x - size / 2 + "px";
      target.appendChild(wave);
      wave.setAttribute("data-hold", Date.now());
      wave.offsetWidth;
      wave.style.transform = "scale(2.5)";
    }
  });
  el.addEventListener("mouseup", function(evt) {
    var fn, j, len, target, wave, waves;
    if (evt.which === 1) {
      target = evt.target.classList.contains("wave") ? evt.target.parentNode : evt.target;
      waves = target.getElementsByClassName("wave");
      fn = function(wave) {
        var delay, diff;
        diff = Date.now() - Number(wave.getAttribute("data-hold"));
        delay = Math.max(350 - diff, 0);
        return setTimeout(function() {
          wave.style.opacity = "0";
          return setTimeout(function() {
            return wave.remove();
          }, 550);
        }, delay);
      };
      for (j = 0, len = waves.length; j < len; j++) {
        wave = waves[j];
        fn(wave);
      }
    }
  });
};

document.getElementById("background").addEventListener("click", closeOpened);

ref = document.querySelectorAll("#navTabs>li");
for (j = 0, len = ref.length; j < len; j++) {
  tab = ref[j];
  tab.addEventListener("click", function(evt) {
    var assignment, assignments, columnHeights, columns, index, k, l, len1, len2, ref1, start, step, trans, w, widths;
    trans = JSON.parse(localStorage["viewTrans"]);
    if (!trans) {
      document.body.classList.add("noTrans");
      document.body.offsetHeight;
    }
    document.body.setAttribute("data-view", (Array.prototype.slice.call(document.querySelectorAll("#navTabs>li"))).indexOf(evt.target));
    if (document.body.getAttribute("data-view") === "1") {
      window.addEventListener("resize", resize);
      if (trans) {
        start = null;
        widths = [300, 800, 1500, 2400, 3500, 4800];
        columns = null;
        for (index = k = 0, len1 = widths.length; k < len1; index = ++k) {
          w = widths[index];
          if (window.innerWidth > w) {
            columns = index + 1;
          }
        }
        assignments = getResizeAssignments();
        columnHeights = (function() {
          var l, ref1, results;
          results = [];
          for (l = 0, ref1 = columns; 0 <= ref1 ? l < ref1 : l > ref1; 0 <= ref1 ? l++ : l--) {
            results.push(0);
          }
          return results;
        })();
        step = function(timestamp) {
          var assignment, col, l, len2, n;
          if (start == null) {
            start = timestamp;
          }
          for (n = l = 0, len2 = assignments.length; l < len2; n = ++l) {
            assignment = assignments[n];
            col = n % columns;
            if (n < columns) {
              columnHeights[col] = 0;
            }
            assignment.style.top = columnHeights[col] + "px";
            assignment.style.left = 100 / columns * col + "%";
            assignment.style.right = 100 / columns * (columns - col - 1) + "%";
            columnHeights[col] += assignment.offsetHeight + 24;
          }
          if (timestamp - start < 300) {
            return window.requestAnimationFrame(step);
          }
        };
        window.requestAnimationFrame(step);
        setTimeout(function() {
          var assignment, col, l, len2, n;
          for (n = l = 0, len2 = assignments.length; l < len2; n = ++l) {
            assignment = assignments[n];
            col = n % columns;
            if (n < columns) {
              columnHeights[col] = 0;
            }
            assignment.style.top = columnHeights[col] + "px";
            columnHeights[col] += assignment.offsetHeight + 24;
          }
        }, 300);
      } else {
        resize();
      }
    } else {
      window.scrollTo(0, scroll);
      setTimeout(function() {
        document.querySelector("nav").classList.remove("headroom--unpinned");
        return document.querySelector("nav").classList.add("headroom--pinned");
      }, 1000);
      window.removeEventListener("resize", resize);
      ref1 = document.getElementsByClassName("assignment");
      for (l = 0, len2 = ref1.length; l < len2; l++) {
        assignment = ref1[l];
        assignment.style.top = "auto";
      }
    }
    if (!trans) {
      document.body.offsetHeight;
      setTimeout(function() {
        return document.body.classList.remove("noTrans");
      }, 300);
    }
  });
}

ref1 = document.querySelectorAll("#infoTabs>li");
for (k = 0, len1 = ref1.length; k < len1; k++) {
  tab = ref1[k];
  tab.addEventListener("click", function(evt) {
    return document.getElementById("info").setAttribute("data-view", (Array.prototype.slice.call(document.querySelectorAll("#infoTabs>li"))).indexOf(evt.target));
  });
}

getResizeAssignments = function() {
  var assignments;
  assignments = Array.prototype.slice.call(document.querySelectorAll(document.body.classList.contains("showDone") ? ".assignment.listDisp" : ".assignment.listDisp:not(.done)"));
  assignments.sort(function(a, b) {
    var ad, bd;
    ad = a.classList.contains("done");
    bd = b.classList.contains("done");
    if (ad && !bd) {
      return 1;
    }
    if (bd && !ad) {
      return -1;
    }
    return a.getElementsByClassName("due")[0].value - b.getElementsByClassName("due")[0].value;
  });
  return assignments;
};

resize = function() {
  var assignment, assignments, col, columnHeights, columns, index, l, len2, len3, n, o, w, widths;
  widths = [300, 800, 1500, 2400, 3500, 4800];
  columns = null;
  for (index = l = 0, len2 = widths.length; l < len2; index = ++l) {
    w = widths[index];
    if (window.innerWidth > w) {
      columns = index + 1;
    }
  }
  columnHeights = (function() {
    var o, ref2, results;
    results = [];
    for (o = 0, ref2 = columns; 0 <= ref2 ? o < ref2 : o > ref2; 0 <= ref2 ? o++ : o--) {
      results.push(0);
    }
    return results;
  })();
  assignments = getResizeAssignments();
  for (n = o = 0, len3 = assignments.length; o < len3; n = ++o) {
    assignment = assignments[n];
    col = n % columns;
    assignment.style.top = columnHeights[col] + "px";
    assignment.style.left = 100 / columns * col + "%";
    assignment.style.right = 100 / columns * (columns - col - 1) + "%";
    columnHeights[col] += assignment.offsetHeight + 24;
  }
  setTimeout(function() {
    var len4, q;
    for (n = q = 0, len4 = assignments.length; q < len4; n = ++q) {
      assignment = assignments[n];
      col = n % columns;
      if (n < columns) {
        columnHeights[col] = 0;
      }
      assignment.style.top = columnHeights[col] + "px";
      columnHeights[col] += assignment.offsetHeight + 24;
    }
  }, 300);
};

ref2 = document.querySelectorAll("input[type=text], input[type=password], input[type=email], input[type=url], input[type=tel], input[type=number], input[type=search]");
for (l = 0, len2 = ref2.length; l < len2; l++) {
  input = ref2[l];
  input.addEventListener("change", function(evt) {
    return evt.target.parentNode.querySelector("label").classList.add("active");
  });
  input.addEventListener("focus", function(evt) {
    return evt.target.parentNode.querySelector("label").classList.add("active");
  });
  input.addEventListener("blur", function(evt) {
    if (evt.target.value.length === 0) {
      return evt.target.parentNode.querySelector("label").classList.remove("active");
    }
  });
}

window.addEventListener("keydown", function(evt) {
  if (evt.which === 27) {
    if (document.getElementsByClassName("full").length !== 0) {
      return closeOpened(new Event("Generated Event"));
    }
  }
});

ripple(document.getElementById("cvButton"));

document.getElementById("cvButton").addEventListener("mouseup", function() {
  document.body.classList.toggle("showDone");
  resize();
  localStorage["showDone"] = JSON.stringify(document.body.classList.contains("showDone"));
  return setTimeout(resize, 1000);
});

if ((localStorage["showDone"] != null) && JSON.parse(localStorage["showDone"])) {
  document.body.classList.add("showDone");
}

ripple(document.getElementById("infoButton"));

if (localStorage["showInfo"] == null) {
  localStorage["showInfo"] = JSON.stringify(true);
}

document.getElementById("infoButton").addEventListener("mouseup", function() {
  document.body.classList.toggle("showInfo");
  resize();
  localStorage["showInfo"] = JSON.stringify(document.body.classList.contains("showInfo"));
  return setTimeout(resize, 1000);
});

if ((localStorage["showInfo"] != null) && JSON.parse(localStorage["showInfo"])) {
  document.body.classList.add("showInfo");
}

headroom = new Headroom(document.querySelector("nav"), {
  tolerance: 10,
  offset: 66
});

headroom.init();

document.getElementById("collapseButton").addEventListener("click", function() {
  document.getElementById("sideNav").classList.add("active");
  return document.getElementById("sideBackground").style.display = "block";
});

document.getElementById("sideBackground").addEventListener("click", function() {
  document.getElementById("sideNav").classList.remove("active");
  return setTimeout(function() {
    return document.getElementById("sideBackground").style.display = "none";
  }, 300);
});

labrgb = function(_L, _a, _b) {
  var _B, _G, _R, _X, _Y, _Z, dot_product, f_inv, from_linear, lab_e, lab_k, m, n, ref_X, ref_Y, ref_Z, tuple, var_x, var_y, var_z;
  ref_X = 0.95047;
  ref_Y = 1.00000;
  ref_Z = 1.08883;
  lab_e = 0.008856;
  lab_k = 903.3;
  f_inv = function(t) {
    if (Math.pow(t, 3) > lab_e) {
      return Math.pow(t, 3);
    } else {
      return (116 * t - 16) / lab_k;
    }
  };
  dot_product = function(a, b) {
    var i, o, ref3, ret;
    ret = 0;
    for (i = o = 0, ref3 = a.length - 1; 0 <= ref3 ? o <= ref3 : o >= ref3; i = 0 <= ref3 ? ++o : --o) {
      ret += a[i] * b[i];
    }
    return ret;
  };
  var_y = (_L + 16) / 116;
  var_z = var_y - _b / 200;
  var_x = _a / 500 + var_y;
  _X = ref_X * f_inv(var_x);
  _Y = ref_Y * f_inv(var_y);
  _Z = ref_Z * f_inv(var_z);
  tuple = [_X, _Y, _Z];
  m = [[3.2406, -1.5372, -0.4986], [-0.9689, 1.8758, 0.0415], [0.0557, -0.2040, 1.0570]];
  from_linear = function(c) {
    var a;
    a = 0.055;
    if (c <= 0.0031308) {
      return 12.92 * c;
    } else {
      return 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
    }
  };
  _R = from_linear(dot_product(m[0], tuple));
  _G = from_linear(dot_product(m[1], tuple));
  _B = from_linear(dot_product(m[2], tuple));
  n = function(v) {
    return Math.round(Math.max(Math.min(v * 256, 255), 0));
  };
  return "rgb(" + (n(_R)) + ", " + (n(_G)) + ", " + (n(_B)) + ")";
};

updateAvatar = function() {
  var bg, initials;
  if (localStorage["username"] != null) {
    document.getElementById("user").innerHTML = localStorage["username"];
    initials = localStorage["username"].match(/\d*(.).*?(.$)/);
    bg = labrgb(50, (initials[1].charCodeAt(0) - 65) / 26 * 256 - 128, (initials[2].charCodeAt(0) - 65) / 26 * 256 - 128);
    document.getElementById("initials").style.backgroundColor = bg;
    return document.getElementById("initials").innerHTML = initials[1] + initials[2];
  }
};

updateAvatar();

document.getElementById("settingsB").addEventListener("click", function() {
  document.body.classList.add("settingsShown");
  document.getElementById("brand").innerHTML = "Settings";
  return setTimeout(function() {
    return document.querySelector("main").style.display = "none";
  });
});

document.getElementById("backButton").addEventListener("click", function() {
  document.querySelector("main").style.display = "block";
  document.body.classList.remove("settingsShown");
  return document.getElementById("brand").innerHTML = "Check PCR";
});

if (localStorage["viewTrans"] == null) {
  localStorage["viewTrans"] = JSON.stringify(true);
}

if (localStorage["colorType"] == null) {
  localStorage["colorType"] = "assignment";
}

if (localStorage["assignmentColors"] == null) {
  localStorage["assignmentColors"] = JSON.stringify({
    homework: "#2196f3",
    classwork: "#689f38",
    test: "#f44336",
    projects: "#f57c00"
  });
}

if ((localStorage["data"] != null) && (localStorage["classColors"] == null)) {
  a = {};
  ref3 = JSON.parse(localStorage["data"]).classes;
  for (o = 0, len3 = ref3.length; o < len3; o++) {
    c = ref3[o];
    a[c] = "#616161";
  }
  localStorage["classColors"] = JSON.stringify(a);
}

if (localStorage["assignmentColors"] == null) {
  localStorage["assignmentColors"] = JSON.stringify({
    homework: "#2196f3",
    classwork: "#689f38",
    test: "#f44336",
    projects: "#f57c00"
  });
}

document.getElementById(localStorage["colorType"] + "Colors").style.display = "block";

if (localStorage["refreshOnFocus"] == null) {
  localStorage["refreshOnFocus"] = JSON.stringify(true);
}

window.addEventListener("focus", function() {
  if (JSON.parse(localStorage["refreshOnFocus"])) {
    return fetch();
  }
});

if (localStorage["refreshRate"] == null) {
  localStorage["refreshRate"] = JSON.stringify(-1);
}

intervalRefresh = function() {
  var r;
  r = JSON.parse(localStorage["refreshRate"]);
  if (r > 0) {
    return setTimeout(function() {
      console.debug("Refreshing because of timer");
      fetch();
      return intervalRefresh();
    }, r * 60 * 1000);
  }
};

intervalRefresh();

ac = JSON.parse(localStorage["assignmentColors"]);

cc = localStorage["classColors"] != null ? JSON.parse(localStorage["classColors"]) : {};

rgb2hex = function(rgb) {
  var hex;
  if (/^#[0-9A-F]{6}$/i.test(rgb)) {
    return rgb;
  }
  rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  hex = function(x) {
    return ("0" + parseInt(x).toString(16)).slice(-2);
  };
  return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
};

hex2rgb = function(hex) {
  var result;
  result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)];
};

palette = {
  "#f44336": "#B71C1C",
  "#e91e63": "#880E4F",
  "#9c27b0": "#4A148C",
  "#673ab7": "#311B92",
  "#3f51b5": "#1A237E",
  "#2196f3": "#0D47A1",
  "#03a9f4": "#01579B",
  "#00bcd4": "#006064",
  "#009688": "#004D40",
  "#4caf50": "#1B5E20",
  "#689f38": "#33691E",
  "#afb42b": "#827717",
  "#fbc02d": "#F57F17",
  "#ffa000": "#FF6F00",
  "#f57c00": "#E65100",
  "#ff5722": "#BF360C",
  "#795548": "#3E2723",
  "#616161": "#212121"
};

if (localStorage["data"] != null) {
  ref4 = JSON.parse(localStorage["data"]).classes;
  for (q = 0, len4 = ref4.length; q < len4; q++) {
    c = ref4[q];
    d = element("div", [], c);
    d.setAttribute("data-control", c);
    d.appendChild(element("span", []));
    document.getElementById("classColors").appendChild(d);
  }
}

ref5 = document.getElementsByClassName("colors");
for (u = 0, len5 = ref5.length; u < len5; u++) {
  e = ref5[u];
  ref6 = e.getElementsByTagName("div");
  fn = function(sp, color, list, listName) {
    return sp.addEventListener("click", function(evt) {
      var bg;
      if (sp.classList.contains("choose")) {
        bg = rgb2hex(evt.target.style.backgroundColor);
        list[color.getAttribute("data-control")] = bg;
        sp.style.backgroundColor = bg;
        sp.querySelector(".selected").classList.remove("selected");
        evt.target.classList.add("selected");
        localStorage[listName] = JSON.stringify(list);
        updateColors();
      }
      return sp.classList.toggle("choose");
    });
  };
  for (z = 0, len6 = ref6.length; z < len6; z++) {
    color = ref6[z];
    sp = color.querySelector("span");
    listName = e.getAttribute("id") === "classColors" ? "classColors" : "assignmentColors";
    list = e.getAttribute("id") === "classColors" ? cc : ac;
    sp.style.backgroundColor = list[color.getAttribute("data-control")];
    for (p in palette) {
      pe = element("span", []);
      pe.style.backgroundColor = p;
      if (p === list[color.getAttribute("data-control")]) {
        pe.classList.add("selected");
      }
      sp.appendChild(pe);
    }
    fn(sp, color, list, listName);
  }
}

updateColors = function() {
  var mix, name, ref7, ref8, results, results1, sheet, style;
  mix = function(a, b, p) {
    var hex, rgbA, rgbB;
    rgbA = hex2rgb(a);
    rgbB = hex2rgb(b);
    hex = function(x) {
      return ("0" + parseInt(x).toString(16)).slice(-2);
    };
    return "#" + hex(rgbA[0] * p + rgbB[0] * (1 - p)) + hex(rgbA[1] * p + rgbB[1] * (1 - p)) + hex(rgbA[2] * p + rgbB[2] * (1 - p));
  };
  style = document.createElement("style");
  style.appendChild(document.createTextNode(""));
  document.head.appendChild(style);
  sheet = style.sheet;
  if (localStorage["colorType"] === "assignment") {
    sheet.insertRule(".upcomingTest[data-class]>i { background-color: " + (JSON.parse(localStorage["assignmentColors"]).test) + "; }", 0);
    sheet.insertRule(".upcomingTest[data-class].done>i { background-color: " + palette[JSON.parse(localStorage["assignmentColors"]).test] + "; }", 0);
    ref7 = JSON.parse(localStorage["assignmentColors"]);
    results = [];
    for (name in ref7) {
      color = ref7[name];
      sheet.insertRule(".assignment." + name + " { background-color: " + color + "; }", 0);
      sheet.insertRule(".assignment." + name + ".done { background-color: " + palette[color] + "; }", 0);
      results.push(sheet.insertRule(".assignment." + name + "::before { background-color: " + (mix(color, "#1B5E20", 0.3)) + "; }", 0));
    }
    return results;
  } else {
    ref8 = JSON.parse(localStorage["classColors"]);
    results1 = [];
    for (name in ref8) {
      color = ref8[name];
      sheet.insertRule(".assignment[data-class=\"" + name + "\"] { background-color: " + color + "; }", 0);
      sheet.insertRule(".assignment[data-class=\"" + name + "\"].done { background-color: " + palette[color] + "; }", 0);
      sheet.insertRule(".assignment[data-class=\"" + name + "\"]::before { background-color: " + (mix(color, "#1B5E20", 0.3)) + "; }", 0);
      sheet.insertRule(".upcomingTest[data-class=\"" + name + "\"]>i { background-color: " + color + "; }", 0);
      results1.push(sheet.insertRule(".upcomingTest[data-class=\"" + name + "\"].done>i { background-color: " + palette[color] + "; }", 0));
    }
    return results1;
  }
};

updateColors();

ref7 = document.getElementsByClassName("settingsControl");
for (aa = 0, len7 = ref7.length; aa < len7; aa++) {
  e = ref7[aa];
  if (localStorage[e.name] != null) {
    if (e.checked != null) {
      e.checked = JSON.parse(localStorage[e.name]);
    } else {
      e.value = JSON.parse(localStorage[e.name]);
    }
  }
  e.addEventListener("change", function(evt) {
    if (evt.target.checked != null) {
      localStorage[evt.target.name] = JSON.stringify(evt.target.checked);
    } else {
      localStorage[evt.target.name] = JSON.stringify(evt.target.value);
    }
    if (evt.target.name === "refreshRate") {
      return intervalRefresh();
    }
  });
}

document.querySelector("input[name=\"colorType\"][value=\"" + localStorage["colorType"] + "\"]").checked = true;

ref8 = document.getElementsByName("colorType");
for (ab = 0, len8 = ref8.length; ab < len8; ab++) {
  c = ref8[ab];
  c.addEventListener("change", function(evt) {
    var v;
    v = document.querySelector('input[name="colorType"]:checked').value;
    localStorage["colorType"] = v;
    if (v === "class") {
      document.getElementById("assignmentColors").style.display = "none";
      document.getElementById("classColors").style.display = "block";
    } else {
      document.getElementById("assignmentColors").style.display = "block";
      document.getElementById("classColors").style.display = "none";
    }
    return updateColors();
  });
}

(function() {
  return send("https://api.github.com/repos/19RyanA/CheckPCR/git/refs/heads/master", "json").then(function(resp) {
    var last;
    last = localStorage["commit"];
    c = resp.response.object.sha;
    console.debug(last, c);
    if (last == null) {
      return localStorage["commit"] = c;
    } else if (last !== c) {
      document.getElementById("updateIgnore").addEventListener("click", function() {
        localStorage["commit"] = c;
        document.getElementById("update").classList.remove("active");
        return setTimeout(function() {
          return document.getElementById("updateBackground").style.display = "none";
        }, 300);
      });
      return send(resp.response.object.url, "json").then(function(resp) {
        document.getElementById("updateFeatures").innerHTML = resp.response.message.substr(resp.response.message.indexOf("\n\n") + 2).replace(/\* (.*?)(?=$|\n)/g, function(a, b) {
          return "<li>" + b + "</li>";
        }).replace(/>\n</g, "><").replace(/\n/g, "<br>");
        document.getElementById("updateBackground").style.display = "block";
        return document.getElementById("update").classList.add("active");
      });
    }
  });
})();

document.getElementById("updateDelay").addEventListener("click", function() {
  document.getElementById("update").classList.remove("active");
  return setTimeout(function() {
    return document.getElementById("updateBackground").style.display = "none";
  }, 300);
});

done = [];

if (localStorage["done"] != null) {
  done = JSON.parse(localStorage["done"]);
}

if (localStorage["data"] != null) {
  window.data = JSON.parse(localStorage["data"]);
  display();
}

fetch();
