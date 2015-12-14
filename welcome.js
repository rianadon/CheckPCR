var advance, attachmentify, display, dologin, element, findId, getCookie, input, j, k, len, len1, loginHeaders, loginURL, nextButton, parse, parseAthenaData, ref, ref1, send, setCookie, snackbar, urlify, viewData;

ref = document.getElementsByClassName("next");
for (j = 0, len = ref.length; j < len; j++) {
  nextButton = ref[j];
  nextButton.addEventListener("click", advance = function() {
    var container, npage, view;
    container = document.body;
    view = +container.getAttribute("data-view");
    (npage = document.querySelector("section:nth-child(" + (view + 2) + ")")).style.display = "inline-block";
    npage.style.transform = npage.style.webkitTransform = npage.style.MozTransform = "translateX(" + (view * 100) + "%)";
    container.setAttribute("data-view", view + 1);
    window.scrollTo(0, 0);
    setTimeout(function() {
      npage.style.transform = npage.style.webkitTransform = npage.style.MozTransform = "translateX(" + (view + 1) + "00%)";
      return document.querySelector("section:nth-child(" + (view + 1) + ")").style.display = "none";
    }, 50);
  });
}

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

parseAthenaData = function(dat) {
  var athenaData, athenaData2, course, courseDetails, d, e, error1, l, len2, n, ref2;
  if (dat === "") {
    athenaData = null;
    localStorage.removeItem("athenaData");
  } else {
    try {
      d = JSON.parse(dat);
      athenaData2 = {};
      ref2 = d.body.courses.courses;
      for (n = l = 0, len2 = ref2.length; l < len2; n = ++l) {
        course = ref2[n];
        courseDetails = d.body.courses.sections[n];
        athenaData2[course.course_title] = {
          link: "https://athena.harker.org" + courseDetails.link,
          logo: courseDetails.logo.substr(0, courseDetails.logo.indexOf("\" alt=\"")).replace("<div class=\"profile-picture\"><img src=\"", "").replace("tiny", "reg"),
          period: courseDetails.section_title
        };
      }
      athenaData = athenaData2;
      localStorage["athenaData"] = JSON.stringify(athenaData);
      document.getElementById("athenaDataError").style.display = "none";
    } catch (error1) {
      e = error1;
      document.getElementById("athenaDataError").style.display = "block";
      document.getElementById("athenaDataError").innerHTML = e.message;
    }
  }
};

document.getElementById("athenaData").addEventListener("input", function(evt) {
  return parseAthenaData(evt.target.value);
});

loginURL = "";

loginHeaders = {};

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

snackbar = function(message, action, f) {
  var actionE, add, existing, snack, snackInner;
  snack = element("div", "snackbar");
  snackInner = element("div", "snackInner", message);
  snack.appendChild(snackInner);
  if ((action != null) && (f != null)) {
    actionE = element("a", [], action);
    actionE.addEventListener("click", function() {
      snack.classList.remove("active");
      return f();
    });
    snackInner.appendChild(actionE);
  }
  add = function() {
    document.body.appendChild(snack);
    snack.offsetHeight;
    snack.classList.add("active");
    return setTimeout(function() {
      snack.classList.remove("active");
      return setTimeout(function() {
        return snack.remove();
      }, 900);
    }, 5000);
  };
  existing = document.querySelector(".snackbar");
  if (existing != null) {
    existing.classList.remove("active");
    setTimeout(add, 300);
  } else {
    add();
  }
};

element = function(tag, cls, html, id) {
  var c, e, l, len2;
  e = document.createElement(tag);
  if (typeof cls === "string") {
    e.classList.add(cls);
  } else {
    for (l = 0, len2 = cls.length; l < len2; l++) {
      c = cls[l];
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

dologin = function(val, submitEvt) {
  var h, postArray;
  if (submitEvt == null) {
    submitEvt = false;
  }
  document.getElementById("login").classList.remove("active");
  postArray = [];
  localStorage["username"] = (val != null) && !submitEvt ? val[0] : document.getElementById("username").value;
  for (h in loginHeaders) {
    if (h.toLowerCase().indexOf("user") !== -1) {
      loginHeaders[h] = (val != null) && !submitEvt ? val[0] : document.getElementById("username").value;
    }
    if (h.toLowerCase().indexOf("pass") !== -1) {
      loginHeaders[h] = (val != null) && !submitEvt ? val[1] : document.getElementById("password").value;
    }
    postArray.push(encodeURIComponent(h) + "=" + encodeURIComponent(loginHeaders[h]));
  }
  if (location.protocol === "chrome-extension:") {
    console.time("Logging in");
    send(loginURL, "document", {
      "Content-type": "application/x-www-form-urlencoded"
    }, postArray.join("&"), true).then(function(resp) {
      var e, error1, t;
      console.timeEnd("Logging in");
      if (resp.responseURL.indexOf("Login") !== -1) {
        document.getElementById("loginIncorrect").style.display = "block";
        return document.getElementById("password").value = "";
      } else {
        if (document.getElementById("remember").checked) {
          setCookie("userPass", window.btoa(document.getElementById("username").value + ":" + document.getElementById("password").value), 14);
        }
        t = Date.now();
        localStorage["lastUpdate"] = t;
        try {
          parse(resp.response);
          display();
        } catch (error1) {
          e = error1;
          console.log(e);
          alert("Error parsing assignments. Is PCR on list or month view?");
        }
      }
    }, function(error) {
      return console.log("Could not log in to PCR. Either your network connection was lost during your visit or PCR is just not working. Here's the error:", error);
    });
  } else {
    console.log(postArray);
    send("/api/login?remember=" + (document.getElementById("remember").checked), "json", {
      "Content-type": "application/x-www-form-urlencoded"
    }, postArray.join("&"), true).then(function(resp) {
      var t;
      console.debug("Logging in:", resp.response.time);
      if (resp.response.login) {
        document.getElementById("loginIncorrect").style.display = "block";
        document.getElementById("password").value = "";
      } else {
        t = Date.now();
        localStorage["lastUpdate"] = t;
        window.data = resp.response.data;
        display();
        localStorage["data"] = JSON.stringify(data);
      }
    }, function(error) {
      return console.log("Could not log in to PCR. Either your network connection was lost during your visit or PCR is just not working. Here's the error:", error);
    });
  }
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
  var e, l, len2, ref2;
  ref2 = element.getElementsByTagName(tag);
  for (l = 0, len2 = ref2.length; l < len2; l++) {
    e = ref2[l];
    if (e.id.indexOf(id) !== -1) {
      return e;
    }
  }
};

parse = function(doc) {
  var ap, assignment, assignments, b, c, ca, classes, d, divs, e, handledDataShort, l, len2, len3, len4, len5, m, o, p, pos, q, range, ref2, ref3, t, title;
  console.time("Handling data");
  handledDataShort = [];
  window.data = {
    classes: [],
    assignments: [],
    monthView: doc.querySelector(".rsHeaderMonth").parentNode.classList.contains("rsSelected")
  };
  ref2 = doc.getElementsByTagName("input");
  for (l = 0, len2 = ref2.length; l < len2; l++) {
    e = ref2[l];
    viewData[e.name] = e.value || "";
  }
  classes = findId(doc, "table", "cbClasses").getElementsByTagName("label");
  for (m = 0, len3 = classes.length; m < len3; m++) {
    c = classes[m];
    window.data.classes.push(c.innerHTML);
  }
  assignments = doc.getElementsByClassName("rsApt rsAptSimple");
  for (o = 0, len4 = assignments.length; o < len4; o++) {
    ca = assignments[o];
    assignment = {};
    range = findId(ca, "span", "StartingOn").innerHTML.split(" - ");
    assignment.start = Math.floor((Date.parse(range[0])) / 1000 / 3600 / 24);
    assignment.end = range[1] != null ? Math.floor((Date.parse(range[1])) / 1000 / 3600 / 24) : assignment.start;
    t = findId(ca, "span", "lblTitle");
    title = t.innerHTML;
    b = t.parentNode.parentNode;
    divs = b.getElementsByTagName("div");
    for (d = p = 0; p < 2; d = ++p) {
      divs[0].remove();
    }
    ap = attachmentify(b);
    assignment.attachments = ap;
    assignment.body = urlify(b.innerHTML).replace(/^(?:\s*<br\s*\/?>)*/, "").replace(/(?:\s*<br\s*\/?>)*\s*$/, "").trim();
    assignment.type = title.match(/\(([^\(\)]*)\)$/)[1].toLowerCase().replace("& quizzes", "").replace("tests", "test");
    assignment.baseType = (ca.title.substring(0, ca.title.indexOf("\n"))).toLowerCase().replace("& quizzes", "");
    ref3 = window.data.classes;
    for (pos = q = 0, len5 = ref3.length; q < len5; pos = ++q) {
      c = ref3[pos];
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
  console.timeEnd("Handling data");
  document.body.classList.add("loaded");
  localStorage["data"] = JSON.stringify(data);
};

(function() {
  if (location.protocol === "chrome-extension:") {
    console.time("Fetching assignments");
    send("https://webappsca.pcrsoft.com/Clue/SC-Assignments-End-Date-Range/7536", "document").then(function(resp) {
      var e, error1, l, len2, ref2, t;
      console.timeEnd("Fetching assignments");
      if (resp.responseURL.indexOf("Login") !== -1) {
        loginURL = resp.responseURL;
        ref2 = resp.response.getElementsByTagName("input");
        for (l = 0, len2 = ref2.length; l < len2; l++) {
          e = ref2[l];
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
        document.getElementById("login").classList.add("ready");
        document.getElementById("login").addEventListener("submit", function(evt) {
          evt.preventDefault();
          return dologin(null, true);
        });
      } else {
        console.log("Fetching assignments successful");
        t = Date.now();
        localStorage["lastUpdate"] = t;
        try {
          parse(resp.response);
        } catch (error1) {
          e = error1;
          console.log(e);
          alert("Error parsing assignments. Is PCR on list or month view?");
        }
        document.getElementById("loginNext").style.display = "";
        document.getElementById("login").classList.add("done");
      }
    }, function(error) {
      console.log("Could not fetch assignments; You are probably offline. Here's the error:", error);
      snackbar("You must be online to set up Check PCR. Please refresh when the internet works.");
    });
  } else {
    send("/api/start", "json").then(function(resp) {
      var t;
      console.debug("Fetching assignments:", resp.response.time);
      if (resp.response.login) {
        loginHeaders = resp.response.loginHeaders;
        document.getElementById("login").classList.add("ready");
        document.getElementById("login").addEventListener("submit", function(evt) {
          evt.preventDefault();
          return dologin(null, true);
        });
      } else {
        console.log("Fetching assignments successful");
        t = Date.now();
        localStorage["lastUpdate"] = t;
        window.data = resp.response.data;
        localStorage["data"] = JSON.stringify(data);
        document.getElementById("loginNext").style.display = "";
        document.getElementById("login").classList.add("done");
      }
    }, function(error) {
      console.log("Could not fetch assignments; You are probably offline. Here's the error:", error);
      return snackbar("Could not fetch your assignments", "Retry", fetch);
    });
  }
})();

display = advance;
