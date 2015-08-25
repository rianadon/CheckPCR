var attachmentify, closeOpened, dateString, display, displayFunction, dologin, done, element, fetch, findId, fullMonths, getCookie, input, j, k, labrgb, len, len1, loginHeaders, loginURL, mimeTypes, months, parse, parseDateHash, ref, ref1, resize, ripple, send, setCookie, tab, tzoff, updateAvatar, urlify, weekdays,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

loginURL = "";

loginHeaders = {};

displayFunction = void 0;

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

send = function(url, respType, headers, data, progress) {
  if (progress == null) {
    progress = false;
  }
  return new Promise(function(resolve, reject) {
    var header, headername, load, progressElement, progressInner, req;
    req = new XMLHttpRequest();
    req.open((data != null ? "POST" : "GET"), url, true);
    progressElement = document.getElementById("progress");
    if (progress) {
      progressElement.offsetWidth;
      progressElement.classList.add("active");
    }
    progressInner = progressElement.querySelector("div");
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
    if (offline) {
      offline.style.display = "block";
    }
  });
};

dologin = function(val) {
  var h, postArray;
  document.getElementById("login").classList.remove("active");
  setTimeout(function() {
    return document.getElementById("loginBackground").style.display = "none";
  }, 300);
  if (document.getElementById("remember").checked) {
    setCookie("userPass", window.btoa(document.getElementById("username").value + ":" + document.getElementById("password").value), 14);
  }
  postArray = [];
  localStorage["username"] = val != null ? val[0] : document.getElementById("username").value;
  updateAvatar();
  for (h in loginHeaders) {
    if (h.toLowerCase().indexOf("user") !== -1) {
      loginHeaders[h] = val != null ? val[0] : document.getElementById("username").value;
    }
    if (h.toLowerCase().indexOf("pass") !== -1) {
      loginHeaders[h] = val != null ? val[1] : document.getElementById("password").value;
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
      alert("Incorrect login");

      /*login.className = "visible" # Display the login form again
      loginErr.innerHTML = "The username and/or password you entered is incorrect"
       */
    } else {
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
  return dologin();
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
  var ap, assignment, assignments, b, c, ca, classes, d, divs, handledDataShort, j, k, l, len, len1, len2, o, pos, range, ref, t, title;
  console.time("Handling data");
  handledDataShort = [];
  window.data = {
    classes: [],
    assignments: []
  };
  classes = findId(doc, "table", "cbClasses").getElementsByTagName("label");
  for (j = 0, len = classes.length; j < len; j++) {
    c = classes[j];
    window.data.classes.push(c.innerHTML);
  }
  assignments = doc.getElementsByClassName("rsApt rsAptSimple");
  for (k = 0, len1 = assignments.length; k < len1; k++) {
    ca = assignments[k];
    assignment = {};
    range = findId(ca, "span", "StartingOn").innerHTML.split(" - ");
    assignment.start = Math.floor((Date.parse(range[0])) / 1000 / 3600 / 24);
    assignment.end = range[1] != null ? Math.floor((Date.parse(range[1])) / 1000 / 3600 / 24) : assignment.start;
    t = findId(ca, "span", "lblTitle");
    title = t.innerHTML;
    b = t.parentNode.parentNode;
    divs = b.getElementsByTagName("div");
    for (d = l = 0; l < 2; d = ++l) {
      divs[0].remove();
    }
    ap = attachmentify(b);
    assignment.attachments = ap;
    assignment.body = urlify(b.innerHTML).replace(/^(?:\s*<br\s*\/?>)*/, "").replace(/(?:\s*<br\s*\/?>)*\s*$/, "").trim();
    assignment.type = title.match(/\(([^\(\)]*)\)$/)[1].toLowerCase().replace("& quizzes", "");
    assignment.baseType = (ca.title.substring(0, ca.title.indexOf("\n"))).toLowerCase().replace("& quizzes", "");
    ref = window.data.classes;
    for (pos = o = 0, len2 = ref.length; o < len2; pos = ++o) {
      c = ref[pos];
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
  display();
};

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

dateString = function(date, displayMonth) {
  var j, len, r, relative, today;
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
  return weekdays[date.getDay()] + ", " + fullMonths[date.getMonth()] + " " + (date.getDate());
};

display = function() {
  var already, assignment, attachment, attachments, close, complete, d, date, day, dayTable, e, end, fn, fn1, found, id, j, k, l, len, len1, len2, len3, len4, main, month, n, name, nextSat, num, o, p, pos, previousAssignments, q, ref, ref1, ref2, ref3, ref4, s, separated, span, spanRelative, split, start, startSun, taken, times, today, tr, weekHeights, weekId, wk, year;
  console.time("Displaying data");
  main = document.querySelector("main");
  taken = {};
  today = Math.floor((Date.now() - tzoff) / 1000 / 3600 / 24);
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
      }
      day.addEventListener("click", function(evt) {
        var e, found, l, len1, results;
        found = [];
        while (true) {
          e = document.elementFromPoint(evt.clientX, evt.clientY);
          if (e.classList.contains("assignment")) {
            e.click();
            break;
          } else {
            found.push({
              element: e,
              display: e.style.display
            });
            e.style.display = "none";
          }
        }
        results = [];
        for (l = 0, len1 = found.length; l < len1; l++) {
          e = found[l];
          results.push(e.element.style.display = e.display);
        }
        return results;
      });
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
      var el;
      if (evt.which === 1) {
        el = evt.target;
        while (!el.classList.contains("assignment")) {
          el = el.parentNode;
        }
        if (el.classList.contains("done")) {
          done.splice(done.indexOf(id), 1);
        } else {
          done.push(id);
        }
        localStorage["done"] = JSON.stringify(done);
        if (document.body.getAttribute("data-view") === "1") {
          setTimeout(function() {
            el.classList.toggle("done");
            return resize();
          }, 100);
        } else {
          el.classList.toggle("done");
        }
      }
    });
  };
  for (p = 0, len3 = split.length; p < len3; p++) {
    s = split[p];
    assignment = window.data.assignments[s.assignment];
    separated = window.data.classes[assignment["class"]].match(/((?:\d*\s+)?(?:(?:hon\w*|(?:adv\w*\s*)?core)\s+)?)(.*)/i);
    startSun = new Date(s.start.getTime());
    startSun.setDate(startSun.getDate() - startSun.getDay());
    weekId = "wk" + (startSun.getMonth()) + "-" + (startSun.getDate());
    e = element("div", ["assignment", assignment.baseType], "<small><span class='extra'>" + separated[1] + "</span>" + separated[2] + "</small><span class='title'>" + assignment.title + "</span>", assignment.id + weekId);
    if (ref3 = assignment.id, indexOf.call(done, ref3) >= 0) {
      e.classList.add("done");
    }
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
      for (q = 0, len4 = ref4.length; q < len4; q++) {
        attachment = ref4[q];
        fn1(attachment);
      }
      e.appendChild(attachments);
    }
    e.appendChild(element("div", "body", assignment.body));
    if (start < s.start) {
      e.classList.add("fromWeekend");
    }
    if (end > e.end) {
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
      if (document.getElementsByClassName("full").length === 0 && (!el.classList.contains("anim")) && document.body.getAttribute("data-view") === "0") {
        el.classList.add("modify");
        el.style.top = el.getBoundingClientRect().top - document.body.scrollTop - parseInt(el.style.marginTop) + 44 + "px";
        el.setAttribute("data-top", el.style.top);
        document.body.style.overflow = "hidden";
        back = document.getElementById("background");
        back.classList.add("active");
        back.style.display = "block";
        setTimeout(function() {
          el.classList.add("anim");
          el.classList.add("full");
          el.style.top = 75 - parseInt(el.style.marginTop) + "px";
          return setTimeout(function() {
            return el.classList.remove("anim");
          }, 300);
        }, 0);
      }
    });
    wk = document.getElementById(weekId);
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
  if (document.querySelectorAll(".assignment.listDisp:not(.done)").length === 0) {
    document.body.classList.add("noList");
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
    return el.style.top = "auto";
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

ref = document.querySelectorAll(".tabs>li");
for (j = 0, len = ref.length; j < len; j++) {
  tab = ref[j];
  tab.addEventListener("click", function(evt) {
    var assignment, k, len1, ref1, start, step;
    document.body.setAttribute("data-view", (Array.prototype.slice.call(document.querySelectorAll(".tabs>li"))).indexOf(evt.target));
    if (document.body.getAttribute("data-view") === "1") {
      window.addEventListener("resize", resize);
      start = null;
      step = function(timestamp) {
        if (start == null) {
          start = timestamp;
        }
        resize();
        if (timestamp - start < 300) {
          return window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    } else {
      window.removeEventListener("resize", resize);
      ref1 = document.getElementsByClassName("assignment");
      for (k = 0, len1 = ref1.length; k < len1; k++) {
        assignment = ref1[k];
        assignment.style.top = "auto";
      }
    }
  });
}

resize = function() {
  var assignment, assignments, col, columnHeights, columns, index, k, l, len1, len2, n, w, widths;
  widths = [300, 800, 1500, 2400, 3500, 4800];
  columns = null;
  for (index = k = 0, len1 = widths.length; k < len1; index = ++k) {
    w = widths[index];
    if (window.innerWidth > w) {
      columns = index + 1;
    }
  }
  columnHeights = (function() {
    var l, ref1, results;
    results = [];
    for (l = 0, ref1 = columns; 0 <= ref1 ? l < ref1 : l > ref1; 0 <= ref1 ? l++ : l--) {
      results.push(0);
    }
    return results;
  })();
  assignments = Array.prototype.slice.call(document.querySelectorAll(".assignment.listDisp:not(.done)"));
  assignments.sort(function(a, b) {
    return b.getElementsByClassName("body")[0].innerText.length - a.getElementsByClassName("body")[0].innerText.length;
  });
  for (n = l = 0, len2 = assignments.length; l < len2; n = ++l) {
    assignment = assignments[n];
    col = n % columns;
    assignment.style.top = columnHeights[col] + "px";
    assignment.style.left = 100 / columns * col + "%";
    assignment.style.right = 100 / columns * (columns - col - 1) + "%";
    columnHeights[col] += assignment.offsetHeight + 24;
  }
  setTimeout(function() {
    var len3, o;
    for (n = o = 0, len3 = assignments.length; o < len3; n = ++o) {
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

ref1 = document.querySelectorAll("input[type=text], input[type=password], input[type=email], input[type=url], input[type=tel], input[type=number], input[type=search]");
for (k = 0, len1 = ref1.length; k < len1; k++) {
  input = ref1[k];
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
    var i, l, ref2, ret;
    ret = 0;
    for (i = l = 0, ref2 = a.length - 1; 0 <= ref2 ? l <= ref2 : l >= ref2; i = 0 <= ref2 ? ++l : --l) {
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

(function() {
  return send("https://api.github.com/repos/19RyanA/CheckPCR/git/refs/heads/master", "json").then(function(resp) {
    var c, last, res;
    last = localStorage["commit"];
    c = resp.response.object.sha;
    console.debug(last, c);
    if (last == null) {
      return localStorage["commit"] = c;
    } else if (last !== c) {
      res = prompt("Please update the application from https://github.com/19RyanA/CheckPCR.\n\n If you have already updated the application, type anything you want into the textfield below then click ok. Otherwise, click ok or cancel.");
      if ((res != null) && res.length > 0) {
        return localStorage["commit"] = c;
      }
    }
  });
})();

done = [];

if (localStorage["done"] != null) {
  done = JSON.parse(localStorage["done"]);
}

if (localStorage["data"] != null) {
  window.data = JSON.parse(localStorage["data"]);
  display();
}

fetch();
