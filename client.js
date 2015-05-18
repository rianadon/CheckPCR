var loginURL = "";
var loginHeaders = {};
var doneBodies = JSON.parse(localStorage.getItem("done") || "[]");
var loadingBar = document.getElementById("loadingBar");
var login = document.getElementById("login");
var loginErr = document.getElementById("loginErr");
var at = document.getElementById("assignments");
var views = document.getElementsByClassName("view");
var ew = document.getElementById("eWrapper");
var list = document.getElementById("list");
var offline = document.getElementById("offline");
var remember = document.getElementById("remember");
try {
	document.getElementById("calendarV").addEventListener("click", updateCalendar);
	document.getElementById("listV").addEventListener("click", updateList);
	document.getElementById("dockedV").addEventListener("click", function() {
		window.open('docked.html', 'Docked', 'height=400, width=500, menubar=no, status=no, scrollbars=yes, location=no, toolbar=no, top='+(screen.height-430)+', left='+(screen.width-500));
	});
} catch(e) {
	//docked
}
login.getElementsByTagName("form")[0].onsubmit = dologin;
var oc;
var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

var data = [];
var classList = [];

auto(location.pathname=='/docked.html'?updateList:updateCalendar);

(function update() {
	send("GET", "https://api.github.com/repos/19RyanA/CheckPCR/git/refs/heads/master", "Connection to GitHub failed", function(current) {
		last = localStorage.getItem("commit");
		var c = JSON.parse(current.responseText).object.sha;
		console.log(last, c);
		if(!last) {
			localStorage.setItem("commit", c);
		} else if (last != c) {
			alert("Please update the application from https://github.com/19RyanA/CheckPCR.");
		}
	});
})();

function send(type, url, error, callback, ef, headers, data) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange=function() {
		if (xmlhttp.readyState==4 && xmlhttp.status==200) callback(xmlhttp);
	};
	xmlhttp.onerror = function() {
		console.log(error);
		if (typeof ef !== "undefined" && ef !== null) ef();
	};
	xmlhttp.open(type, url, true);
	if (typeof headers !== "undefined" && headers !== null) {
		for(var header in headers) {
			xmlhttp.setRequestHeader(header, headers[header]);
		}
	}
	if(typeof data !== "undefined" && data !== null) {
		xmlhttp.send(data);
	} else {
		xmlhttp.send();
	}
}
function auto(onComplete) {
	data = JSON.parse(localStorage.getItem("data"));
	if(data) {
		try {
			onComplete();
		} catch(e) {
			console.error("Error loading last assignments", e);
		}
	}
	document.body.className="finished";
	start(onComplete);
}
function start(onComplete){
	oc = onComplete;
	send("GET", "https://webappsca.pcrsoft.com/Clue/Student-Assignments-End-Date-Range/7536", "Offline", function(xmlhttp) {
		if(xmlhttp.responseURL.indexOf("Login") != -1) {
			loginURL = xmlhttp.responseURL;
			var el = document.createElement("div");
			el.innerHTML = xmlhttp.responseText;
			Array.prototype.map.call(el.getElementsByTagName("input"), function(e) {
				loginHeaders[e.name] = e.value || "";
			});
			console.log("Need to log in");
			login.className="visible";
			up = getCookie("userPass");
			if(up !== "") {
				dologin(window.atob(up).split(":"));
			}
		} else {
			console.log("Fetching assignments successful");
			try {
				handleData(xmlhttp.responseText);
			} catch(e) {
				console.error(e);
				alert("Error parsing assignments. Is PCR on list or month view?");
			}
		}
	}, function() {
		if(offline) offline.style.display="block";
	});
}
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length,c.length);
    }
    return "";
}
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}
function dologin(val) {
	login.className="";
	loadingBar.style.display = "block";
	if(remember.checked) {
		setCookie("userPass", window.btoa(document.getElementById("user").value+":"+document.getElementById("pass").value), 14);
	}
	var v = val && val.length>0;
	var postArray=[];
	for(var h in loginHeaders) {
		if(h.toLowerCase().indexOf("user") != -1) loginHeaders[h] = v ? val[0] : document.getElementById("user").value;
		if(h.toLowerCase().indexOf("pass") != -1) loginHeaders[h] = v ? val[1] : document.getElementById("pass").value;
		postArray.push(encodeURIComponent(h)+"="+encodeURIComponent(loginHeaders[h]));
	}
	send("POST", loginURL, "Cannot login to PCR", function(xmlhttp) {
		if(xmlhttp.responseURL.indexOf("Login") != -1) {
			login.className="visible";
			loginErr.innerHTML = "The username and/or password you entered is incorrect";
		} else {
			loadingBar.style.display = "none";
			try {
				handleData(xmlhttp.responseText);
			} catch(e) {
				console.error(e);
				alert("Error parsing assignments. Is PCR on list or month view?");
			}
		}
	}, function(){}, {"Content-type": "application/x-www-form-urlencoded"}, postArray.join("&"));
	return false;
}
function parseDateHash(element) {
	var dateSplit = element.hash.substring(1).split('-');
	return (new Date(+dateSplit[0], +dateSplit[1]-1, +dateSplit[2])).getTime();
}
function findId(element, tag, id) {
	var elements = element.getElementsByTagName(tag);
	for(var e=0; e<elements.length; e++) {
		if(elements[e].id.indexOf(id)!=-1) return elements[e];
	}
}
function handleData(tp) {
	console.time("Handling data");
	loadingBar.style.display = "none";
	var handledDataShort = [];
	data = [];
	var el = document.createElement('div'); //Dummy element to use to parse html
	el.innerHTML = tp.replace(/\.\.\/Images\/RedTriangle\.gif/g, "");
	var noprints = el.getElementsByClassName("noprint");
	var classes = noprints[noprints.length-3].getElementsByTagName("label");
	for(var c=0; c<classes.length; c++) {
		classList.push(classes[c].innerHTML);
	}
	var tds = el.getElementsByClassName("rsContentTable")[0].getElementsByTagName("td");
	var dates;
	if(tds.length == 14) { //week view
		var dateHeaders = el.getElementsByClassName("rsDateHeader");
		dates = [];
		for(var dh=0; dh<dateHeaders.length; dh++) {
			dates.push(parseDateHash(dateHeaders[dh]));
		}
		tds = [].splice.call(tds,0, 7);
	}
	for(var td=0; td<tds.length; td++) {
		//now parse each day
		var ctd = tds[td];
		var day = {};
		day.weekend = hasClass(ctd, "rsSatCol") || hasClass(ctd, "rsSunCol");
		day.otherMonth = hasClass(ctd, "rsOtherMonth");
		if(typeof dates !== "undefined" && dates !== null) {
			day.day = dates[td];
		} else {
			day.day = parseDateHash(ctd.getElementsByClassName("rsDateHeader")[0]);
		}
		day.assignments = [];
		var assignments = ctd.getElementsByClassName("rsApt rsAptSimple");
		for(var a=0; a<assignments.length; a++) {
			var assignment = {};
			var ca = assignments[a];
			assignment.range = findId(ca, "span", "StartingOn").innerHTML;
			var t = findId(ca, "span", "lblTitle");
			assignment.title = t.innerHTML;
			ed = assignment.range.split(" - ")[1];
			assignment.startDate = (new Date(assignment.range.substring(0, assignment.range.indexOf(" ")))).getTime();
			assignment.endDate = (new Date(ed ? ed.substring(0, ed.indexOf(" ")) : assignment.startDate)).getTime();
			var b = t.parentNode.parentNode.innerHTML;
			var bUnparsed = b.substring(b.indexOf("\n", b.indexOf("</div", b.indexOf("</div")+4)));
			var ap = attachmentify(bUnparsed);
			assignment.attachments = ap[0];
			assignment.body = urlify(ap[1]).replace(/^(?:\s*<br\s*\/?>)*/, "").replace(/(?:\s*<br\s*\/?>)*\s*$/, "").trim();
			assignment.type = ca.title.substring(0, ca.title.indexOf("\n")).toLowerCase().replace("& quizzes", "");
			var st = ca.title.substring(ca.title.indexOf("\n")+1);
			for(c=0; c<classList.length; c++) {
				if (st.indexOf(classList[c]) > -1) {
					assignment.class = classList[c];
				}
			}
			assignment.shortTitle = st.substring(st.indexOf("\n")+1);
			var append = true;
			var short = assignment.range+assignment.title;
			if(handledDataShort.indexOf(short) == -1) {
				handledDataShort.push(short);
				day.assignments.push(assignment);
			}
		}
		data.push(day);
	}
	localStorage.setItem("data", JSON.stringify(data));
	console.timeEnd("Handling data");
	oc();
}
function createAttachments(attachments) {
	if(attachments.length===0) return "";
	var box = '<div class="attachments">';
	for(var at=0; at<attachments.length; at++) {
		box += '<a href="/attachment'+attachments[at][1]+'">'+attachments[at][0]+'</a>';
	}
	return box+"</div>";
}
function updateCalendar() {
	var overWeekends = [];
	var today;
	ew.className = "chart";
	for(var v=0; v<views.length; v++) {
		if(hasClass(views[v], "selected")) {
			views[v].className = views[v].className.replace(" selected", "");
		}
		if(views[v].innerHTML == "Calendar") {
			views[v].className += " selected";
		}
	}
	at.innerHTML="";
	var lastTr;
	var extras = [];
	for(var y=0; y<data.length; y++) {
		extras[y] = [];
	}
	for(var p=0; p<data.length; p++) {
		if(p%7 === 0) {
			lastTr = document.createElement("tr");
			at.appendChild(lastTr);
		}
		var td = document.createElement("td");
		var day = new Date(data[p].day);
		var m = document.createElement("span");
		m.innerHTML = months[day.getMonth()];
		m.className = "month";
		td.appendChild(m);
		var ca = document.createElement("span");
		ca.innerHTML = "&#x2713;&#x2713";
		ca.className = "compAll";
		ca.addEventListener("click", completeAll);
		td.appendChild(ca);
		var daySpan = document.createElement("span");
		daySpan.innerHTML = day.getDate();
		daySpan.className = "day";
		td.appendChild(daySpan);
		if (data[p].weekend) td.className += " weekend";
		if (data[p].otherMonth) td.className += " otherMonth";
		if (dayMatch(data[p].day, new Date())) {
			td.className += " today";
			today = td;
		}
		var cp = 0;
		var margins = 0;
		var o2=overWeekends.slice(0); //clone it to preserve it before we start adding to it
		for(var a=0; a<data[p].assignments.length+(p%7===0 ? o2.length : 0); a++) {
			var a2;
			if(p%7===0 && a<o2.length) {
				a2= o2[a];
				overWeekends.splice(0,1); //always first index since we are removing (index decreases by 1 every time)
			} else {
				a2= data[p].assignments[a];
			}
			var a3 = document.createElement("div");
			a3.className = "assignment "+a2.type;
			var span = daysBetween(data[p].day, a2.endDate)+1;
			var e = cp;
			while(true) {
				if(extras[p].indexOf(e) == -1) break;
				e++;
			}
			cp=e;
			var span2 = 1;
			if(span > 1) {
				if(span <= 7-p%7) {
					span2=span;
				} else {
					span2 = 7-p%7;
					a3.className += " overWeekend";
					overWeekends.push(a2);
				}
			}
			//a3.style.width = "calc("+span2+"00% + "+(11*(span2-1))+"px)";
			a3.className += " span"+span2;
			for(var x = p+1; x < p+span2; x++) {
				extras[x].push(cp);
			}

			if(a2.startDate != data[p].day) a3.className += " fromWeekend";
			a3.style.marginTop = 3+(cp-(a+margins))*(38+3)+"px";
			margins += cp-(a+margins);
			a3.innerHTML += "<div><div><small>"+a2.class+"</small> "+a2.shortTitle+"</div></div>";
			var ab = document.createElement("article");
			ab.style.width = 100/span2+"%";
			var d = document.createElement("div");
			var close = document.createElement("div");
			close.innerHTML = "&times;";
			close.className = "close";
			close.addEventListener("click", closeThis);
			d.appendChild(close);
			var pin = document.createElement("div");
			pin.innerHTML = "p";
			pin.className = "pin";
			pin.addEventListener("click", pinThis);
			d.appendChild(pin);
			var done = document.createElement("div");
			done.innerHTML = "&#x2713;";
			done.className = "done";
			done.addEventListener("click", complete);
			d.appendChild(done);
			var range = document.createElement("span");
			range.innerHTML = a2.range;
			range.className = "range";
			d.appendChild(range);
			var section = document.createElement("section");
			section.innerHTML = "<h2>"+a2.title+"</h2>"+createAttachments(a2.attachments)+a2.body;
			d.appendChild(section);
			ab.appendChild(d);
			//ab.innerHTML = "<div><div class='close' onclick='closeThis(this)'></div><div class='pin' onclick='pinThis(this)'>p</div><div class='done' onclick='complete(this)'></div><span class='range'>"+a2.range+"</span><section><h2>"+a2.title+"</h2>"+createAttachments(a2.attachments)+a2.body+"</div></section></div>";
			a3.appendChild(ab);
			td.appendChild(a3);
			if(doneBodies.indexOf(describeA(a2)) > -1) complete({target: a3}, false);
			cp++;
		}
		lastTr.appendChild(td);
	}
	if(today) window.scrollTo(0,today.getBoundingClientRect().top+window.scrollY-50); //account for header
}
function updateList() {
	window.scrollTo(0,0);
	try {
		ew.className = "list";
		for(var v=0; v<views.length; v++) {
			if(hasClass(views[v], "selected")) {
				views[v].className = views[v].className.replace(" selected", "");
			}
			if(views[v].innerHTML == "List") {
				views[v].className += " selected";
			}
		}
	} catch(e) {
		//Docked version
	}
	list.innerHTML = "";
	for(var p=0; p<data.length; p++) {
		for(var a=0; a<data[p].assignments.length; a++) {
			var a2 = data[p].assignments[a];
			if(doneBodies.indexOf(describeA(a2)) == -1 && intersects(data[p].day, new Date(), a2.endDate)) {
				var a3 = document.createElement("div");
				a3.className = "assignment";
				var comp = document.createElement("span");
				comp.addEventListener("click", complete);
				a3.appendChild(comp);
				var d = document.createElement("div");
				d.innerHTML = "<center class='range'>"+a2.range+"</center><h2>"+a2.title+"</h2>"+createAttachments(a2.attachments)+a2.body;
				a3.appendChild(d);
				list.appendChild(a3);
			}
		}
	}
}
function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}
function parents(el, c) {
	var p = el;
	while(true) {
		if(hasClass(p, c) || !p) {
			break;
		}
		p = p.parentNode;
	}
	return p;
}
function closeThis(event) {
	var p = parents(event.target, "assignment");
	p.className += " noHover";
	setTimeout(function(){p.className = p.className.replace(" noHover", "");});
}
document.onkeydown = function(evt) {
	evt = evt || window.event;
	if (evt.keyCode == 27) {
		try{evt.preventDefault();}//Non-IE
        catch(x){evt.returnValue=false;}//IE
		var assignments = document.getElementsByClassName("assignment");
		for(var a=0; a<assignments.length; a++) { closeThis({target: assignments[a]}); }
	}
};
function daysBetween( d1, d2 ) {
  var oneDay=1000*60*60*24;

  var d1MS = (new Date(d1)).getTime();
  var d2MS = (new Date(d2)).getTime();

  var dif = d2MS - d1MS;
  return Math.max(Math.floor(dif/oneDay), 0);
}
function intersects(d1, d2, d3) {
	var d1D = new Date(d1);
	var d1T = d1D.setHours(0,0,0);

	var d3D = new Date(d3);
	var d3T = d3D.setHours(23,59,59);

	var d2T = (new Date(d2)).getTime();
	return d1T <= d2T && d2T <= d3T;
}
function describe(el) {
	return el.getElementsByClassName("range")[0].innerHTML+el.getElementsByTagName("h2")[0].innerHTML;
}
function describeA(a) {
	return a.range+a.title;
}
function complete(event,update) {
	var a;
	var el = event.target;
	update = typeof update === "undefined" ? true : update;
	var p = parents(el, "assignment");
	var ta = describe(el.parentNode);
	var as = document.getElementsByClassName("assignment");
	if(p.className.indexOf("completed") == -1) {
		if (update) {
			if(ew.className == "list") {
				console.log(p.clientHeight);
				p.style.maxHeight=p.clientHeight+2+"px"; //2px borders
				p.className += " completed";
				setTimeout(function(){p.style.maxHeight=0;},1);
				setTimeout(function(){p.remove();},200);
			} else {
				for(a=0;a<as.length;a++) {
					if(describe(as[a]) == ta) {
						as[a].className += " completed";
					}
				}
			}
			doneBodies.push(ta);
		} else {
			p.className += " completed";
		}
	} else {
		if(update) {
			for(a=0;a<as.length;a++) {
				if(describe(as[a]) == ta) {
					as[a].className = as[a].className.replace(" completed", "");
				}
			}
			var i = doneBodies.indexOf(ta);
			console.log(i);
			if(i > -1) doneBodies.splice(i, 1);
		} else {
			p.className = p.className.replace(" completed", "");
		}
	}
	if(update) {
		localStorage.setItem("done", JSON.stringify(doneBodies));
	}
	closeThis({target: el});
}
function completeAll(event) {
	var a = event.target.parentNode.getElementsByClassName("assignment");
	var completed = 0;
	for(var x=0; x<a.length; x++) {
		if(a[x].className.indexOf("completed") > -1) completed++;
	}
	var markComplete = completed/a.length < 1;
	for(x=0; x<a.length; x++) {
		var ic = a[x].className.indexOf("completed") > -1;
		var c = a[x].getElementsByClassName("done")[0];
		if(markComplete) {
			if(!ic) complete({target: c});
		} else {
			if(ic) complete({target: c});
		}
	}
}
function pinThis(event) {
	var p = parents(event.target, "assignment");
	if(p.className.indexOf("pinned") == -1) {
		p.className += " pinned";
	} else {
		p.className = p.className.replace(" pinned", "");
	}
}
function dayMatch(d1, d2) {
	var a = new Date(d1);
	var b = new Date(d2);
	if(a.getDate() != b.getDate()) return false;
	if(a.getMonth() != b.getMonth()) return false;
	if(a.getFullYear() != b.getFullYear()) return false;
	return true;
}
function attachmentify(text) {
	var attachments = [];
	var parsed = document.createElement('div');
	parsed.innerHTML = text.replace(/&amp;/g, "&");
	var as = parsed.getElementsByTagName("a");
	for(var a=0; a<as.length; a++) {
		if(as[a].id.indexOf("Attachment") != -1) {
			attachments.push([as[a].innerHTML, as[a].search+as[a].hash]);
			as[a].remove();
			a--;
		}
	}
	return [attachments, parsed.innerHTML];
}
function urlify(text) {
	return text.replace(/(https?:\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]+)/ig, function(str, str2, offset){return /href\s*=\s*./.test(text.substring(offset-10,offset)) ? str : '<a href="'+str+'">'+str+'</a>';});
}
