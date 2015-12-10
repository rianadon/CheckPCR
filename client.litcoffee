Welcome to the documentation of and the actual program of CheckPCR.

This is the main processing program containing that fetches your assignments from PCR, parses them, and displays them.
It is written in [Literate CoffeeScript](http://coffeescript.org/#literate), a version of CoffeeScript (a language that compiles into JavaScript, which is used to modify content on webpages and allow interactions with webpages) that is also compliant with Markdown syntax and can be displayed as a Markdown file (as you see here if you are viewing this file from Github).

#### Table of Contents
* [Basic Definitions](#defs)
* [Retrieving Data](#ret)
* [Parsing](#parsing")
* [Displaying the assignments](#displaying)
* [Side menu and Navbar](#side)
* [Athena (Schoology)](#athena)
* [Settings](#settings)
* [Starting everything](#starting)
* [Analytics](#analytics)
* [Events](#events)
* [Updates and News](#updates)
* [Adding new assignments](#new)

##### So, here is the annotated code:

<a name="defs"/>
Basic Definitions
-----------------

First of all, if the online version is used, the http version is redirected to https.

    if window.location.protocol is "http:" and location.hostname isnt "localhost"
      window.location.href = "https:" + window.location.href.substring(window.location.protocol.length)

Additionally, if it's the user's first time, the page is set to the welcome page.

    if not localStorage["noWelcome"]? and not localStorage["commit"]?
      localStorage["noWelcome"] = "true"
      window.location = "welcome.html"

Then we have most of the global variables.

    loginURL = ""
    loginHeaders = {}
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    fullMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    tzoff = (new Date()).getTimezoneOffset()*1000*60 # For future calculations
    mimeTypes =
      "application/msword": ["Word Doc", "document"]
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ["Word Doc", "document"]
      "application/vnd.ms-powerpoint": ["PPT Presentation", "slides"]
      "application/pdf": ["PDF File", "pdf"]
      "text/plain": ["Text Doc", "plain"]
    scroll = 0 # The location to scroll to in order to reach today in calendar view
    viewData = {} # The data to send when switching PCR views
    activity = []
    dmp = new diff_match_patch() # For diffing
    lastUpdate = 0 # The last time verything was updated

#### Send function

This function sends a request to a server and returns a Promise.
- *url* is the url we want to retrieve
- *respType* is the type of response that should be recieved
- *headers* is an object of headers that will be sent to the server
- *data* is data that will be sent to the server (only for POST requests)
- *progress* is a boolean that determines whether or not the progress bar should be used to display the status of the request


    send = (url, respType, headers, data, progress=false) ->
      return new Promise (resolve, reject) ->
        req = new XMLHttpRequest()
        req.open (if data? then "POST" else "GET"), url, true

        progressElement = document.getElementById "progress"
        progressInner = progressElement.querySelector "div"
        if progress
          progressElement.offsetWidth # Wait for it to render
          progressElement.classList.add "active"
          if progressInner.classList.contains "determinate"
            progressInner.classList.remove "determinate"
            progressInner.classList.add "indeterminate"

        load = localStorage["load"] or 170000

        req.onload = (evt) ->
          localStorage["load"] = evt.loaded
          progressElement.classList.remove "active" if progress
          if req.status is 200
            resolve req
          else
            reject Error req.statusText
          return

        req.onerror = ->
          progressElement.classList.remove "active" if progress
          reject Error "Network Error"
          return
        if progress
          req.onprogress = (evt) ->
            if progressInner.classList.contains "indeterminate"
              progressInner.classList.remove "indeterminate"
              progressInner.classList.add "determinate"
            progressInner.style.width = 100 * evt.loaded / (if evt.lengthComputable then evt.total else load) + "%"

        if respType?
          req.responseType = respType;
        if headers?
          for headername, header of headers
            req.setRequestHeader headername, header
        if data?
          req.send data
        else
          req.send()
        return

#### Cookie functions

Below is a function that will retrieve a cookie (a small text document that the browser can remember).
- *cname* is the name of the cookie to retrieve


    getCookie = (cname) ->
      name = cname + "="
      ca = document.cookie.split(";")
      i = 0
      while i < ca.length
        c = ca[i]
        while c.charAt(0) is " "
          c = c.substring(1)
        if c.indexOf(name) isnt -1
          return c.substring(name.length, c.length)
        i++
      "" # Blank if cookie not found

To set a cookie, this function is called.
- *cname* is the name of the cookie to set
- *cvalue* is the value to set the cookie to
- *exdays* is the number of days that the cookie will expire in (and not be existent anymore)


    setCookie = (cname, cvalue, exdays) ->
      d = new Date
      d.setTime d.getTime() + exdays * 24 * 60 * 60 * 1000
      expires = "expires=" + d.toUTCString()
      document.cookie = cname + "=" + cvalue + "; " + expires
      return

This function displays a snackbar to tell the user something

    snackbar = (message, action, f) ->
      snack = element "div", "snackbar"
      snackInner = element "div", "snackInner", message
      snack.appendChild snackInner
      if action? and f?
        actionE = element "a", [], action
        actionE.addEventListener "click", ->
            snack.classList.remove "active"
            f()
        snackInner.appendChild actionE

      add = ->
        document.body.appendChild snack
        snack.offsetHeight
        snack.classList.add "active"
        setTimeout ->
          snack.classList.remove "active"
          setTimeout ->
            snack.remove()
          , 900
        , 5000

      existing = document.querySelector(".snackbar")
      if existing?
        existing.classList.remove "active"
        setTimeout add, 300
      else
        add()
      return

*displayError* displays a dialog containing information about an error.

    displayError = (e) ->
      errorHTML = "Messsage: #{e.message}\nStack: #{e.stack or e.lineNumber}\nBrowser: #{navigator.userAgent}\nVersion: #{localStorage["commit"] or "New"}"
      document.getElementById("errorContent").innerHTML = errorHTML.replace("\n", "<br>")
      document.getElementById("errorGoogle").href = "https://docs.google.com/a/students.harker.org/forms/d/1sa2gUtYFPdKT5YENXIEYauyRPucqsQCVaQAPeF3bZ4Q/viewform?entry.120036223=#{encodeURIComponent(errorHTML)}"
      document.getElementById("errorGitHub").href = "https://github.com/19RyanA/CheckPCR/issues/new?body=#{encodeURIComponent("I've encountered an bug.\n\n```\n#{errorHTML}\n```")}"
      document.getElementById("errorBackground").style.display = "block"
      document.getElementById("error").classList.add "active"

*FromDateNum* converts a number of days to a number of seconds

    fromDateNum = (days) ->
      d = new Date days*1000*3600*24+tzoff
      if d.getHours() is 1 then d.setHours 0
      if d.getHours() is 22
        d.setHours 24
        d.setMinutes 0
        d.setSeconds 0
      d.getTime()

<a name="ret"/>
Retrieving data
---------------

The function below converts an update time to a human-readable date.

    formatUpdate = (date) ->
      now = new Date()
      update = new Date(+date)
      if now.getDate() is update.getDate()
        ampm = "AM"
        hr = update.getHours()
        if hr > 12
          ampm = "PM"
          hr -= 12
        min = update.getMinutes()
        "Today at #{hr}:#{if min<10 then "0"+min else min} #{ampm}"
      else
        daysPast = Math.ceil (now.getTime()-update.getTime())/1000/3600/24
        if daysPast is 1 then "Yesterday" else daysPast+" days ago"

This is the function that retrieves your assignments from PCR.

First, a request is sent to PCR to load the page you would normally see when accessing PCR.

Because this is run as a chrome extension, this page can be accessed. Otherwise, the browser would throw an error for security reasons (you don't want a random website being able to access confidential data from a website you have logged into).

    fetch = (override=false) ->
      if not override and Date.now()-lastUpdate < 60000 # Less than a minute ago
        return
      lastUpdate = Date.now()
      if location.protocol is "chrome-extension:"
        console.time "Fetching assignments"
        send "https://webappsca.pcrsoft.com/Clue/SC-Assignments-End-Date-Range/7536", "document", null, null, true
          .then (resp) ->
            console.timeEnd "Fetching assignments"
            if resp.responseURL.indexOf("Login") isnt -1
              # We have to log in now
              loginURL = resp.responseURL
              for e in resp.response.getElementsByTagName("input")
                loginHeaders[e.name] = e.value or ""
              console.log "Need to log in"
              up = getCookie("userPass") # Attempts to get the cookie *userPass*, which is set if the "Remember me" checkbox is checked when logging in through CheckPCR
              if up is ""
                document.getElementById("loginBackground").style.display = "block"
                document.getElementById("login").classList.add "active"
              else
                dologin window.atob(up).split(":") # Because we were remembered, we can log in immediately without waiting for the user to log in through the login form
            else
              # Logged in now
              console.log "Fetching assignments successful"
              t = Date.now()
              localStorage["lastUpdate"] = t
              document.getElementById("lastUpdate").innerHTML = formatUpdate t
              try
                parse resp.response
              catch e
                console.log e
                displayError e
            return
          , (error) ->
            console.log "Could not fetch assignments; You are probably offline. Here's the error:", error
            snackbar "Could not fetch your assignments", "Retry", -> fetch(true)
            return
      else
        send "/api/start", "json", null, null, true
          .then (resp) ->
            console.debug "Fetching assignments:",resp.response.time
            if resp.response.login
              loginHeaders = resp.response.loginHeaders
              document.getElementById("loginBackground").style.display = "block"
              document.getElementById("login").classList.add "active"
            else
              console.log "Fetching assignments successful"
              t = Date.now()
              localStorage["lastUpdate"] = t
              document.getElementById("lastUpdate").innerHTML = formatUpdate t

              window.data = resp.response.data
              display()
              localStorage["data"] = JSON.stringify(data)
            return
          , (error) ->
            console.log "Could not fetch assignments; You are probably offline. Here's the error:", error
            snackbar "Could not fetch your assignments", "Retry", -> fetch(true)
      return

Now, we have the function that will log us into PCR.
*val* is an optional argument that is an array of the username and password to log in with

    dologin = (val, submitEvt=false) ->
      document.getElementById("login").classList.remove "active"
      setTimeout ->
        document.getElementById("loginBackground").style.display = "none"
      , 350
      postArray = [] # Array of data to post
      localStorage["username"] = if val? and not submitEvt then val[0] else document.getElementById("username").value
      updateAvatar()
      for h of loginHeaders # Loop through the input elements contained in the login page. As mentioned before, they will be sent to PCR to log in.
        if h.toLowerCase().indexOf("user") isnt -1
          loginHeaders[h] = if val? and not submitEvt then val[0] else document.getElementById("username").value
        if h.toLowerCase().indexOf("pass") isnt -1
          loginHeaders[h] = if val? and not submitEvt then val[1] else document.getElementById("password").value
        postArray.push encodeURIComponent(h) + "=" + encodeURIComponent(loginHeaders[h])

      # Now send the login request to PCR
      if location.protocol is "chrome-extension:"
        console.time "Logging in"
        send loginURL, "document", { "Content-type": "application/x-www-form-urlencoded" }, postArray.join("&"), true
          .then (resp) ->
            console.timeEnd "Logging in"
            if resp.responseURL.indexOf("Login") isnt -1
              # If PCR still wants us to log in, then the username or password entered were incorrect.
              document.getElementById("loginIncorrect").style.display = "block"
              document.getElementById("password").value = ""

              document.getElementById("login").classList.add "active"
              document.getElementById("loginBackground").style.display = "block"
            else
              # Otherwise, we are logged in
              if document.getElementById("remember").checked #Is the "remember me" checkbox checked?
                setCookie "userPass", window.btoa(document.getElementById("username").value + ":" + document.getElementById("password").value), 14 # Set a cookie with the username and password so we can log in automatically in the future without having to prompt for a username and password again
              # loadingBar.style.display = "none"
              t = Date.now()
              localStorage["lastUpdate"] = t
              document.getElementById("lastUpdate").innerHTML = formatUpdate t
              try
                parse resp.response # Parse the data PCR has replied with
              catch e
                console.log e
                displayError e
              return
          , (error) ->
            console.log "Could not log in to PCR. Either your network connection was lost during your visit or PCR is just not working. Here's the error:", error
      else
        console.log postArray
        send "/api/login?remember=#{document.getElementById("remember").checked}", "json", { "Content-type": "application/x-www-form-urlencoded" }, postArray.join("&"), true
          .then (resp) ->
            console.debug "Logging in:",resp.response.time
            if resp.response.login
              # If PCR still wants us to log in, then the username or password entered were incorrect.
              document.getElementById("loginIncorrect").style.display = "block"
              document.getElementById("password").value = ""

              document.getElementById("login").classList.add "active"
              document.getElementById("loginBackground").style.display = "block"
            else
              t = Date.now()
              localStorage["lastUpdate"] = t
              document.getElementById("lastUpdate").innerHTML = formatUpdate t

              window.data = resp.response.data
              display()
              localStorage["data"] = JSON.stringify(data)
            return
          , (error) ->
            console.log "Could not log in to PCR. Either your network connection was lost during your visit or PCR is just not working. Here's the error:", error
      return

    document.getElementById("login").addEventListener "submit", (evt) ->
      evt.preventDefault()
      dologin(null, true)

<a name="parsing"/>
Parsing
-------

Below are now functions used to parse your assignments.

In PCR"s interface, you can click a date in month or week view to see it in day view.
Therefore, the HTML element that shows the date that you can click on has a hyperlink that looks like `#2015-04-26`.
The function below will parse that String and return a **Date**.

    parseDateHash = (element) ->
      dateSplit = element.hash.substring(1).split("-")
      (new Date +dateSplit[0], +dateSplit[1] - 1, +dateSplit[2]).getTime()

The *attachmentify* function parses the body of an assignment (*text*) and returns the assignment's attachments.

    attachmentify = (element) ->
      attachments = []

      # Get all links
      as = element.getElementsByTagName('a')

      a = 0
      while a < as.length
        if as[a].id.indexOf('Attachment') isnt -1
          attachments.push [
            as[a].innerHTML
            as[a].search + as[a].hash
          ]
          as[a].remove()
          a-- # subtract because all elements have shifted down
        a++
      attachments

This function replaces text that represents a hyperlink with a functional hyperlink by using javascript's replace function with a regular expression if the text already isn't part of a hyperlink.

    urlify = (text) ->
      text.replace /// (
        https?:\/\/                  # http:// or https://
        [-A-Z0-9+&@#\/%?=~_|!:,.;]*  # Any number of url-OK characters
        [-A-Z0-9+&@#\/%=~_|]+        # At least one url-OK character except ?, !, :, ,, ., and ;
      )///ig, (str, str2, offset) -> # Function to replace matches
        if /href\s*=\s*./.test(text.substring(offset - 10, offset)) then str else '<a href="' + str + '">' + str + '</a>'

Also, PCR"s interface uses a system of IDs to identify different elements. For example, the ID of one of the boxes showing the name of an assignment could be `ctl00_ctl00_baseContent_baseContent_flashTop_ctl00_RadScheduler1_95_0`.
The function below will return the first HTML element whose ID contains a specified String (*id*) and containing a specified tag (*tag*).

    findId = (element, tag, id) ->
      for e in element.getElementsByTagName(tag)
        if e.id.indexOf(id) isnt -1
          return e
      return

Now, we get to the code intensive functions.
The function below will parse the data given by PCR and convert it into an object.
If you open up the developer console on CheckPCR and type in `data`, you can see the array containing all of your assignments.

    parse = (doc) ->
      console.time "Handling data" # To time how long it takes to parse the assignments
      handledDataShort = [] # Array used to make sure we don"t parse the same assignment twice.
      window.data = {classes: [], assignments: [], monthView: doc.querySelector(".rsHeaderMonth").parentNode.classList.contains("rsSelected")} # Reset the array in which all of your assignments are stored in.

      for e in doc.getElementsByTagName("input")
        viewData[e.name] = e.value or ""

      # Now, the classes you take are parsed (these are the checkboxes you see up top when looking at PCR).

      classes = findId(doc, "table", "cbClasses").getElementsByTagName("label")
      for c in classes
        window.data.classes.push c.innerHTML

      assignments = doc.getElementsByClassName("rsApt rsAptSimple")

      # Now parse the assignments

      for ca in assignments
        assignment = {}

        # The starting date and ending date of the assignment are parsed first
        range = findId(ca, "span", "StartingOn").innerHTML.split(" - ")
        assignment.start = Math.floor (Date.parse range[0])/1000/3600/24
        assignment.end = if range[1]? then Math.floor (Date.parse range[1])/1000/3600/24 else assignment.start

        # Then, the name of the assignment is parsed
        t = findId(ca, "span", "lblTitle")
        title = t.innerHTML

        # The actual body of the assignment and its attachments are parsed next
        b = t.parentNode.parentNode
        divs = b.getElementsByTagName("div")
        for d in [0...2]
          divs[0].remove()
        ap = attachmentify(b) # Separates attachments from the body
        assignment.attachments = ap
        assignment.body = urlify(b.innerHTML).replace(/^(?:\s*<br\s*\/?>)*/, "").replace(/(?:\s*<br\s*\/?>)*\s*$/, "").trim() # The replaces remove leading and trailing newlines

        # Finally, we separate the class name and type (homework, classwork, or projects) from the title of the assignment
        assignment.type = title.match(/\(([^)]*\)*)\)$/)[1].toLowerCase().replace("& quizzes", "").replace("tests", "test")
        assignment.baseType = (ca.title.substring 0, ca.title.indexOf "\n").toLowerCase().replace("& quizzes", "").replace(/\s/g, "")
        for c, pos in window.data.classes
          if title.indexOf(c) isnt -1
            assignment.class = pos
            title = title.replace(c,"")
            break
        assignment.title = title.substring(title.indexOf(": ") + 2).replace(/\([^\(\)]*\)$/,"").trim()

        # To make sure there are no repeats, the title of the assignment (only letters) and its start & end date are combined to give it a unique identifier.
        assignment.id = assignment.title.replace(/[^\w]*/g, "") + (assignment.start + assignment.end)
        if handledDataShort.indexOf(assignment.id) is -1 # Make sure we haven't already parsed the assignment
          handledDataShort.push assignment.id
          window.data.assignments.push assignment

      console.timeEnd "Handling data"

      # Now allow the view to be switched
      document.body.classList.add "loaded"

      display() # Display the data
      localStorage["data"] = JSON.stringify(data) # Store for offline use
      return

The view switching button needs an event handler.

    ###document.getElementById("switchViews").addEventListener "click", ->
      if Object.keys(viewData).length > 0
        viewData["__EVENTTARGET"] = "ctl00$ctl00$baseContent$baseContent$flashTop$ctl00$RadScheduler1"
        viewData["__EVENTARGUMENT"] = JSON.stringify {Command: "SwitchTo#{if document.body.getAttribute("data-pcrview") is "month" then "Week" else "Month"}View"}
        viewData["ctl00_ctl00_baseContent_baseContent_flashTop_ctl00_RadScheduler1_ClientState"] = JSON.stringify {scrollTop:0,scrollLeft:0,isDirty:false}
        viewData["ctl00_ctl00_RadScriptManager1_TSM"] = ";;AjaxControlToolkit, Version=4.1.40412.0, Culture=neutral, PublicKeyToken=28f01b0e84b6d53e:en-US:acfc7575-cdee-46af-964f-5d85d9cdcf92:ea597d4b:b25378d2"
        postArray = [] # Array of data to post
        for h,v of viewData
          postArray.push encodeURIComponent(h) + "=" + encodeURIComponent(v)
        send "https://webappsca.pcrsoft.com/Clue/SC-Assignments-End-Date-Range/7536", "document", { "Content-type": "application/x-www-form-urlencoded" }, postArray.join("&"), true
          .then (resp) ->
            try
              parse resp.response # Parse the data PCR has replied with
            catch e
              console.log e
              alert "Error parsing assignments. Is PCR on list or month view?"
            return
          , (error) ->
            console.log "Could not switch views. Either your network connection was lost during your visit or PCR is just not working. Here's the error:", error###

<a name="displaying"/>
Displaying the assignments
--------------------------

This is a little helper function to simplify the creation of HTML elements

    element = (tag, cls, html, id) ->
      e = document.createElement tag
      if typeof cls is "string"
        e.classList.add cls
      else
        for c in cls
          e.classList.add c
      if html?
        e.innerHTML = html
      if id?
        e.setAttribute "id", id
      e

Another function that will return a human-readable date string

    dateString = (date, addThis=false) ->
      return date if date is "Forever"
      relative = ["Tomorrow", "Today", "Yesterday", "2 days ago"]
      today = new Date()
      today.setDate(today.getDate()+1)
      for r in relative
        if date.getDate() is today.getDate() and date.getMonth() is today.getMonth() and date.getFullYear() is today.getFullYear()
          return r
        today.setDate(today.getDate()-1)
      today = new Date()
      # If the date is within 6 days of today, only display the day of the week
      if 0<(date.getTime()-today.getTime())/1000/3600/24<=6
        return (if addThis then "This " else "")+weekdays[date.getDay()]
      "#{weekdays[date.getDay()]}, #{fullMonths[date.getMonth()]} #{date.getDate()}"

This function separates the parts of a class name.

    separate = (cl) ->
      cl.match /// (
        (?:\d*\s+)?                           # digits and a space(s) if they exist [the grade level for the class]
        (?:(?:hon\w*|(?:adv\w*\s*)?core)\s+)? # matches the honors, advanced core, or core if that exists
      )
      (.*)                                    # the actual class name (English, Science, Math, etc.)
      ///i

The one below scrolls smoothly to a y position.

    smoothScroll = (to) ->
      return new Promise (resolve, reject) ->
        start = null
        from = document.body.scrollTop
        amount = to-from
        step = (timestamp) ->
          start ?= timestamp
          progress = timestamp-start
          window.scrollTo 0, from+amount*(progress/350)
          if progress < 350
            requestAnimationFrame step
          else
            setTimeout ->
              document.querySelector("nav").classList.remove "headroom--unpinned"
            , 1
            setTimeout ->
              resolve()
            , amount
        requestAnimationFrame step

Now the functions that actually display something are defined. First up is one to add an activity line to the activity panel.

    addActivity = (type, assignment, newActivity) ->
      date = if newActivity is true then Date.now() else newActivity
      if newActivity is true then activity.push [type, assignment, Date.now()]
      te = element "div", ["activity", "assignmentItem", assignment.baseType, type], "<i class='material-icons'>#{type}</i><span class='title'>#{assignment.title}</span><small>#{separate(window.data.classes[assignment.class])[2]}</small><div class='range'>#{dateString(new Date date)}</div>", "activity"+assignment.id
      te.setAttribute "data-class", window.data.classes[assignment.class]
      id = assignment.id
      if type isnt "delete"
        do(id) ->
          te.addEventListener "click", ->
            doScrolling = ->
              el = document.querySelector(".assignment[id*=\"#{id}\"]")
              smoothScroll el.getBoundingClientRect().top+document.body.scrollTop-116
                .then ->
                  el.click()
                  return
            if document.body.getAttribute("data-view") is "0"
              doScrolling()
            else
              document.querySelector("#navTabs>li:first-child").click()
              setTimeout doScrolling, 500

      if assignment.id in done
        te.classList.add "done"
      document.getElementById("infoActivity").insertBefore te, document.getElementById("infoActivity").querySelector(".activity")

This function will convert the array of assignments generated by *parse* into readable HTML.

    display = (doScroll=true) ->
      console.time "Displaying data"
      document.body.setAttribute "data-pcrview", if window.data.monthView then "month" else "other"
      main = document.querySelector "main"
      taken = {}

      today = Math.floor (Date.now()-tzoff)/1000/3600/24

      if window.data.monthView
        start = Math.min (assignment.start for assignment in window.data.assignments)... # Smallest date
        end = Math.max (assignment.end for assignment in window.data.assignments)... # Largest date

        year = (new Date()).getFullYear() # For future calculations

        # Calculate what month we will be displaying by finding the month of today
        month = (new Date()).getMonth()

        # Make sure the start and end dates lie within the month
        start = new Date Math.max fromDateNum(start), (new Date year, month).getTime()
        end = new Date Math.min fromDateNum(end), (new Date year, month+1, 0).getTime() # If the day argument for Date is 0, then the resulting date will be of the previous month
      else
        todaySE = new Date()
        start = new Date todaySE.getFullYear(), todaySE.getMonth(), todaySE.getDate()
        end = new Date todaySE.getFullYear(), todaySE.getMonth(), todaySE.getDate()

      # Set the start date to be a Sunday and the end date to be a Saturday
      start.setDate start.getDate()-start.getDay()
      end.setDate end.getDate()+(6-end.getDay())

      # First populate the calendar with boxes for each day
      d = new Date start
      wk = null
      lastAssignments = if localStorage["data"] then JSON.parse(localStorage["data"]).assignments else null
      while d <= end
        if d.getDay() is 0
          id = "wk#{d.getMonth()}-#{d.getDate()}" # Don't create a new week element if one already exists
          if not (document.getElementById id)?
            wk = element "section", "week", null, "wk#{d.getMonth()}-#{d.getDate()}"

            dayTable = element "table", "dayTable"
            tr = dayTable.insertRow()
            tr.insertCell() for day in [0...7]
            wk.appendChild dayTable

            main.appendChild wk

          else
            wk = document.getElementById id

        if wk.getElementsByClassName("day").length <= d.getDay()
          day = element "div", "day", null, "day"
          if Math.floor((d.getTime()-d.getTimezoneOffset())/1000/3600/24) is today
            day.classList.add "today"

          month = element "span", "month", months[d.getMonth()]
          day.appendChild month

          date = element "span", "date", d.getDate()
          day.appendChild date

          wk.appendChild day

        taken[d] = []
        d.setDate d.getDate()+1

      # Split assignments taking more than 1 week
      split = []
      for assignment, num in window.data.assignments
        s = Math.max start.getTime(), fromDateNum assignment.start
        e = Math.min end.getTime(), fromDateNum assignment.end
        span = (e-s)/1000/3600/24+1 # Number of days assignment takes up
        spanRelative = 6-(new Date s).getDay() # Number of days until the next Saturday

        ns = new Date s
        ns.setDate ns.getDate()+spanRelative #e/1000/3600/24-spanRelative # The date of the next Saturday

        n = -6
        while n <span-spanRelative
          lastSun = new Date ns
          lastSun.setDate lastSun.getDate()+n

          nextSat = new Date lastSun
          nextSat.setDate nextSat.getDate()+6
          split.push
            assignment: num
            start: new Date Math.max s, lastSun.getTime()
            end: new Date Math.min e, nextSat.getTime()
          n+=7

        # Activity stuff
        if lastAssignments?
          found = false
          for oldAssignment, num in lastAssignments
            if oldAssignment.id is assignment.id
              found = true
              if oldAssignment.body isnt assignment.body
                addActivity "edit", oldAssignment, true
                delete modified[assignment.id] #If the assignment is modified, reset it
              lastAssignments.splice(num, 1)
              break
          if not found
            addActivity "add", assignment, true
      if lastAssignments?
        # Check if any of the last assignments weren't deleted (so they have been deleted in PCR)
        for assignment in lastAssignments
          addActivity "delete", assignment, true
          if done.indexOf(assignment.id) >= 0
            done.splice done.indexOf(assignment.id), 1
          delete modified[assignment.id]

        # Then save activity
        localStorage["activity"] = JSON.stringify activity.slice activity.length-128, activity.length # save a maximum of 128 activity items

        # And completed assignments + modifications
        localStorage["done"] = JSON.stringify done
        localStorage["modified"] = JSON.stringify modified

      # Add custom assignments to the split array
      for custom in extra
        cls = null
        if custom.class?
          for c,n in data.classes
            if c.toLowerCase().indexOf(custom.class) isnt -1
              cls = n
              break

        # Same logic as above
        s = Math.max start.getTime(), fromDateNum custom.start
        e = Math.min end.getTime(), fromDateNum if custom.end? then custom.end else custom.start
        span = (e-s)/1000/3600/24+1 # Number of days assignment takes up
        spanRelative = 6-(new Date s).getDay() # Number of days until the next Saturday

        ns = new Date s
        ns.setDate ns.getDate()+spanRelative #e/1000/3600/24-spanRelative # The date of the next Saturday

        n = -6
        while n <span-spanRelative
          lastSun = new Date ns
          lastSun.setDate lastSun.getDate()+n

          nextSat = new Date lastSun
          nextSat.setDate nextSat.getDate()+6
          split.push
            start: new Date Math.max s, lastSun.getTime()
            end: new Date Math.min e, nextSat.getTime()
            custom: true
            assignment:
              title: "Todo item"
              baseType: "todo"
              attachments: []
              start: custom.start
              end: custom.end or "Forever"
              body: custom.body
              id: "todo#{custom.body.replace(/[^\w]*/g, "")}#{custom.start}"
              class: cls
            reference: custom
          n+=7

      # Calculate the today's week id
      tdst = new Date()
      tdst.setDate tdst.getDate() - tdst.getDay()
      todayWkId = "wk#{tdst.getMonth()}-#{tdst.getDate()}"

      # Then add assignmentsE
      weekHeights = {}
      previousAssignments = {}
      for assignment in document.getElementsByClassName "assignment"
        previousAssignments[assignment.getAttribute("id")] = assignment
      for s in split
        assignment = if s.custom then s.assignment else window.data.assignments[s.assignment]
        reference = s.reference

        # Separate the class description from the actual class
        separated = separate if assignment.class? then window.data.classes[assignment.class] else "Todo"

        startSun = new Date(s.start.getTime())
        startSun.setDate startSun.getDate()-startSun.getDay()
        weekId = "wk#{startSun.getMonth()}-#{startSun.getDate()}"

        smallTag = "small"
        link = null
        if athenaData? and athenaData[window.data.classes[assignment.class]]?
          link = athenaData[window.data.classes[assignment.class]].link
          smallTag = "a"

        e = element "div", ["assignment", assignment.baseType, "anim"], "<#{smallTag}#{if link? then " href='#{link}' class='linked' target='_blank'" else ""}><span class='extra'>#{separated[1]}</span>#{separated[2]}</#{smallTag}><span class='title'>#{assignment.title}</span><input type='hidden' class='due' value='#{if isNaN(assignment.end) then 0 else assignment.end}' />", assignment.id+weekId
        if (reference? and reference.done) or assignment.id in done
          e.classList.add "done"
        e.setAttribute "data-class", if s.custom then "Todo" else window.data.classes[assignment.class]
        close = element "a", ["close", "material-icons"], "close"
        close.addEventListener "click", closeOpened
        e.appendChild close

        if link?
          e.querySelector("a").addEventListener "click", (evt) ->
            el = evt.target
            until el.classList.contains "assignment"
              el = el.parentNode
            if not (document.body.getAttribute("data-view") isnt "0" or el.classList.contains "full")
              evt.preventDefault()

        complete = element "a", ["complete", "material-icons", "waves"], "done"
        ripple complete
        id = assignment.id
        do (id, reference) ->
          complete.addEventListener "mouseup", (evt) ->
            if evt.which == 1 # Left button
              el = evt.target
              until el.classList.contains "assignment"
                el = el.parentNode
              added = true
              if reference? # Todo item
                if el.classList.contains "done"
                  reference.done = false
                else
                  added = false
                  reference.done = true
                localStorage["extra"] = JSON.stringify extra
              else
                if el.classList.contains "done"
                  done.splice done.indexOf(id), 1
                else
                  added = false
                  done.push id
                localStorage["done"] = JSON.stringify done
              if document.body.getAttribute("data-view") == "1"
                setTimeout ->
                  for elem in document.querySelectorAll ".assignment[id^=\"#{id}\"], #test#{id}, #activity#{id}, #ia#{id}"
                    elem.classList.toggle "done"
                  if added
                    document.body.classList.remove "noList" if document.querySelectorAll(".assignment.listDisp:not(.done)").length != 0
                  else
                    document.body.classList.add "noList" if document.querySelectorAll(".assignment.listDisp:not(.done)").length == 0
                  resize()
                , 100
              else
                for elem in document.querySelectorAll ".assignment[id*=\"#{id}\"], .upcomingTest[id*=\"test#{id}\"], .activity[id*=\"activity#{id}\"]"
                  elem.classList.toggle "done"
                if added
                  document.body.classList.remove "noList" if document.querySelectorAll(".assignment.listDisp:not(.done)").length != 0
                else
                  document.body.classList.add "noList" if document.querySelectorAll(".assignment.listDisp:not(.done)").length == 0
            return
        e.appendChild complete

        # If the assignment is a custom one, add a button to delete it
        if s.custom
          deleteA = element "a", ["material-icons", "deleteAssignment", "waves"], "delete"
          do (reference, e) ->
            ripple deleteA
            deleteA.addEventListener "mouseup", (evt) ->
              if evt.which == 1
                extra.splice(extra.indexOf(reference), 1)
                localStorage["extra"] = JSON.stringify extra
                if document.querySelector(".full")?
                  document.body.style.overflow = "auto"
                  back = document.getElementById("background")
                  back.classList.remove "active"
                  setTimeout ->
                    back.style.display = "none"
                  , 350
                e.remove()
                display(false)
          e.appendChild deleteA

        # Modification button
        edit = element "a", ["editAssignment", "material-icons", "waves"], "edit"
        do (id) ->
          edit.addEventListener "mouseup", (evt) ->
            if evt.which == 1
              el = evt.target
              until el.classList.contains "editAssignment"
                el = el.parentNode
              remove = el.classList.contains "active"
              el.classList.toggle "active"
              el.parentNode.querySelector(".body").setAttribute "contentEditable", if remove then "false" else "true"
              if not remove
                el.parentNode.querySelector(".body").focus()
              dn = el.parentNode.querySelector ".complete"
              dn.style.display = if remove then "block" else "none"
            return
        ripple edit

        e.appendChild edit

        start = new Date fromDateNum assignment.start
        end = if isNaN assignment.end then assignment.end else new Date fromDateNum assignment.end
        times = element "div", "range", if assignment.start is assignment.end then dateString(start) else "#{dateString(start)} &ndash; #{dateString(end)}"
        e.appendChild times
        if assignment.attachments.length > 0
          attachments = element "div", "attachments"
          for attachment in assignment.attachments
            do (attachment) ->
              a = element "a", [], attachment[0]
              a.href = if location.protocol is "chrome-extension:" then "https://webappsca.pcrsoft.com/Clue/Common/AttachmentRender.aspx#{attachment[1]}" else "/api/attachment#{attachment[1]}"
              req = new XMLHttpRequest()
              req.open "HEAD", a.href
              req.onload = ->
                if req.status == 200
                  type = req.getResponseHeader "Content-Type"
                  if mimeTypes[type]?
                    a.classList.add mimeTypes[type][1]
                    span = element "span", [], mimeTypes[type][0]
                  else
                    span = element "span", [], "Unknown file type"
                  a.appendChild span
                return
              req.send()
              attachments.appendChild a
              return
          e.appendChild attachments

        body = element "div", "body", assignment.body
        edits = element "div", "edits", "<span class='additions'></span><span class='deletions'></span>"
        if (m=modified[assignment.id])?
          d = dmp.diff_main assignment.body, m
          dmp.diff_cleanupSemantic d
          if d.length isnt 0 # Has been edited
            added = 0
            deleted = 0
            for diff in d
              if diff[0] is 1 then added++
              if diff[0] is -1 then deleted++
            edits.querySelector(".additions").innerHTML = if added != 0 then "+#{added}" else ""
            edits.querySelector(".deletions").innerHTML = if deleted != 0 then "-#{deleted}" else ""
            edits.classList.add "notEmpty"
            body.innerHTML = m
        ((b, ad, di, ed, id, ref) ->
          body.addEventListener "input", (evt) ->
            if ref?
              ref.body = evt.target.innerHTML
              localStorage["extra"] = JSON.stringify extra
            else
              modified[id] = evt.target.innerHTML
              localStorage["modified"] = JSON.stringify modified
              d = dmp.diff_main b, evt.target.innerHTML
              dmp.diff_cleanupSemantic d
              additions = 0
              deletions = 0
              for diff in d
                if diff[0] is 1 then additions++
                if diff[0] is -1 then deletions++
              ad.innerHTML = if additions != 0 then "+#{additions}" else ""
              di.innerHTML = if deletions != 0 then "-#{deletions}" else ""
              if additions != 0 or deletions != 0
                ed.classList.add "notEmpty"
              else
                ed.classList.remove "notEmpty"
            if document.body.getAttribute("data-view") is "1" then resize()
        )(assignment.body, edits.querySelector(".additions"), edits.querySelector(".deletions"), edits, assignment.id, reference)
        e.appendChild body

        restore = element "a", ["material-icons", "restore"], "settings_backup_restore"
        ((b, bd, ed, id) ->
          restore.addEventListener "click", ->
            delete modified[id]
            localStorage["modified"] = JSON.stringify modified
            bd.innerHTML = b
            ed.classList.remove "notEmpty"
            if document.body.getAttribute("data-view") is "1" then resize()
        )(assignment.body, body, edits, assignment.id)
        edits.appendChild restore
        e.appendChild edits

        mods = element "div", ["mods"]
        for a in activity.slice activity.length-32, activity.length
          if a[0] is "edit" and a[1].id is assignment.id
            d = dmp.diff_main a[1].body, assignment.body
            dmp.diff_cleanupSemantic d
            added = 0
            deleted = 0
            for diff in d
              if diff[0] is 1 then added++
              if diff[0] is -1 then deleted++
            te = element "div", ["innerActivity", "assignmentItem", assignment.baseType], "<i class='material-icons'>edit</i><span class='title'>#{dateString(new Date a[2])}</span><span class='additions'>#{if added != 0 then "+"+added else ""}</span><span class='deletions'>#{if deleted != 0 then "-"+deleted else ""}</span>", "ia"+assignment.id
            te.setAttribute "data-class", window.data.classes[assignment.class]
            te.appendChild element "div", "iaDiff", dmp.diff_prettyHtml d
            te.addEventListener "click", -> this.classList.toggle "active"; resize()
            mods.appendChild te
        e.appendChild mods

        if start < s.start
          e.classList.add "fromWeekend"
        if end > s.end
          e.classList.add "overWeekend"
        e.classList.add "s#{s.start.getDay()}"
        e.classList.add if isNaN(s.end) then "e#{6-s.start.getDay()}" else "e#{6-s.end.getDay()}"

        st = Math.floor(s.start/1000/3600/24)
        if s.assignment.end is "Forever"
          if st <= today
            e.classList.add "listDisp"
        else
          if st-(if assignment.baseType is "test" and assignment.start is st then JSON.parse(localStorage["earlyTest"]) else 0) <= today <= Math.floor(s.end/1000/3600/24)
            e.classList.add "listDisp"

        # Calculate how many assignments are placed before the current one
        pos = 0
        loop
          found = true
          d = new Date s.start
          while d <= s.end
            if taken[d].indexOf(pos) isnt -1
              found = false
            d.setDate d.getDate()+1
          break if found
          pos++

        # Append the position the assignment is at to the taken array
        d = new Date s.start
        while d <= s.end
          taken[d].push pos
          d.setDate d.getDate()+1

        # Calculate how far down the assignment must be placed as to not block the ones above it
        e.style.marginTop = pos*30+"px"

        # Add click interactivity
        e.addEventListener "click", (evt) ->
          el = evt.target
          until el.classList.contains "assignment"
            el = el.parentNode
          if document.getElementsByClassName("full").length == 0 and document.body.getAttribute("data-view") == "0"
            el.classList.remove "anim"
            el.classList.add "modify"
            el.style.top = el.getBoundingClientRect().top-document.body.scrollTop-parseInt(el.style.marginTop)+44+"px"
            el.setAttribute "data-top", el.style.top
            document.body.style.overflow = "hidden"
            back = document.getElementById("background")
            back.classList.add "active"
            back.style.display = "block"
            el.classList.add "anim"
            setTimeout ->
              el.classList.add "full"
              el.style.top = 75-parseInt(el.style.marginTop)+"px"
              setTimeout ->
                el.classList.remove "anim"
              , 350
            , 0
          return

        # Append the assignment to the correct week element and set its height to contain the assignments in it
        wk = document.getElementById weekId
        if not wk? then continue # Don't add the assignment if the week doesn't exist

        # If the assignment is a test and is upcoming, add it to the upcoming tests panel.
        if assignment.baseType is "test" and assignment.start >= today
          te = element "div", ["upcomingTest", "assignmentItem", "test"], "<i class='material-icons'>assessment</i><span class='title'>#{assignment.title}</span><small>#{separated[2]}</small><div class='range'>#{dateString(end, true)}</div>", "test"+assignment.id
          te.setAttribute "data-class", window.data.classes[assignment.class]
          id = assignment.id
          do(id) ->
            te.addEventListener "click", ->
              doScrolling = ->
                el = document.querySelector(".assignment[id*=\"#{id}\"]")
                smoothScroll el.getBoundingClientRect().top+document.body.scrollTop-116
                  .then ->
                    el.click()
                    return
              if document.body.getAttribute("data-view") is "0"
                doScrolling()
              else
                document.querySelector("#navTabs>li:first-child").click()
                setTimeout doScrolling, 500

          if assignment.id in done
            te.classList.add "done"
          if document.getElementById("test"+assignment.id)?
            document.getElementById("test"+assignment.id).innerHTML = te.innerHTML
          else
            document.getElementById("infoTests").appendChild te

        if not weekHeights[weekId]? or pos > weekHeights[weekId]
          weekHeights[weekId] = pos
          wk.style.height = 47+(pos+1)*30+"px"
        already = document.getElementById assignment.id+weekId
        if already? # Assignment already exists
          already.style.marginTop = e.style.marginTop
          if not modified[assignment.id]?
            already.getElementsByClassName("body")[0].innerHTML = e.getElementsByClassName("body")[0].innerHTML
          already.querySelector(".edits").className = e.querySelector(".edits").className
          if already.classList.toggle? then already.classList.toggle "listDisp", e.classList.contains "listDisp"
        else
          wk.appendChild e
        delete previousAssignments[assignment.id+weekId]

      # Delete any assignments that have been deleted since updating
      for name, assignment of previousAssignments
        if assignment.classList.contains "full"
          document.getElementById("background").classList.remove "active"
        assignment.remove()

      # Scroll to the correct position in calendar view
      if weekHeights[todayWkId]?
        h = 0
        sw = (wkid) -> parseInt(x) for x in wkid.substring(2).split("-")
        todayWk = sw todayWkId
        for wkId, val of weekHeights
          wk = sw wkId
          if wk[0] < todayWk[0] or (wk[0] is todayWk[0] and wk[1] < todayWk[1])
            h += val
        scroll = h*30+112+14
        scroll = 0 if scroll < 50 # Also show the day headers if today's date is displayed in the first row of the calendar
        if doScroll and document.body.getAttribute("data-view") is "0" and not document.body.querySelector(".full") #in calendar view
          window.scrollTo 0, scroll

      document.body.classList.add "noList" if document.querySelectorAll(".assignment.listDisp:not(.done)").length == 0
      if document.body.getAttribute("data-view") is "1" # in list view
        resize()
        setTimeout resize, 1000
      console.timeEnd "Displaying data"

Below is a function to close the current assignment that is opened.

    closeOpened = (evt) ->
      evt.stopPropagation()
      el = document.querySelector(".full")
      if not el? then return

      el.style.top = el.getAttribute "data-top"
      el.classList.add "anim"
      el.classList.remove "full"
      el.scrollTop = 0
      document.body.style.overflow = "auto"
      back = document.getElementById("background")
      back.classList.remove "active"
      setTimeout ->
        back.style.display = "none"
        el.classList.remove "anim"
        el.classList.remove "modify"
        el.style.top = "auto"
        el.offsetHeight
        el.classList.add "anim"
      , 1000

Now we assign it to clicking the background.

    document.getElementById("background").addEventListener "click", closeOpened

And a function to apply an ink effect

    ripple = (el) ->
      el.addEventListener "mousedown", (evt) ->
        if evt.which == 1 # Left button
          target = if evt.target.classList.contains "wave" then evt.target.parentNode else evt.target
          wave = element "span", "wave"
          size = Math.max parseInt(target.offsetWidth), parseInt(target.offsetHeight)
          wave.style.width = wave.style.height = size+"px"

          e = evt.target
          x = evt.clientX
          y = evt.clientY
          rect = e.getBoundingClientRect()
          x -= rect.left
          y -= rect.top

          wave.style.top = y - size/2 + "px"
          wave.style.left = x - size/2 + "px"
          target.appendChild wave
          wave.setAttribute "data-hold", Date.now()
          wave.offsetWidth
          wave.style.transform = "scale(2.5)"
        return
      el.addEventListener "mouseup", (evt) ->
        if evt.which == 1 # Left button
          target = if evt.target.classList.contains "wave" then evt.target.parentNode else evt.target
          waves = target.getElementsByClassName "wave"
          for wave in waves
            do (wave) ->
              diff = Date.now() - Number wave.getAttribute "data-hold"
              delay = Math.max 350-diff, 0
              setTimeout ->
                wave.style.opacity = "0"
                setTimeout ->
                  wave.remove()
                , 550
              , delay
        return
      return

Then, the tabs are made interactive.

    for tab in document.querySelectorAll "#navTabs>li"
      tab.addEventListener "click", (evt) ->
        ga 'send', 'event', 'navigation', evt.target.textContent,
          page: '/new.html'
          title: "Version #{localStorage["commit"] or "New"}"
        trans = JSON.parse localStorage["viewTrans"]
        if not trans
          document.body.classList.add "noTrans"
          document.body.offsetHeight
        document.body.setAttribute "data-view", localStorage["view"] = (Array::slice.call document.querySelectorAll "#navTabs>li").indexOf evt.target
        if document.body.getAttribute("data-view") == "1"
          window.addEventListener "resize", resize
          if trans
            start = null
            # The code below is the same code used in the resize() function. It basically just positions the assignments correctly as they animate
            widths = if document.body.classList.contains "showInfo" then [650,1100,1800,2700,3800,5100] else [350,800,1500,2400,3500,4800]
            columns = null
            for w,index in widths
              columns = index+1 if window.innerWidth > w
            assignments = getResizeAssignments()
            columnHeights = (0 for [0...columns])
            step = (timestamp) ->
              start ?= timestamp
              for assignment, n in assignments
                col = n%columns
                if n < columns
                  columnHeights[col] = 0
                assignment.style.top = columnHeights[col]+"px"
                assignment.style.left = 100/columns*col+"%"
                assignment.style.right = 100/columns*(columns-col-1)+"%"
                columnHeights[col] += assignment.offsetHeight+24
              if timestamp-start < 350
                window.requestAnimationFrame step
            window.requestAnimationFrame step
            setTimeout ->
              for assignment, n in assignments
                col = n%columns
                if n < columns
                  columnHeights[col] = 0
                assignment.style.top = columnHeights[col]+"px"
                columnHeights[col] += assignment.offsetHeight+24
              return
            , 350
          else
            resize()
        else
          window.scrollTo 0, scroll
          document.querySelector("nav").classList.add "headroom--locked"
          setTimeout ->
            document.querySelector("nav").classList.remove "headroom--unpinned"
            document.querySelector("nav").classList.remove "headroom--locked"
            document.querySelector("nav").classList.add "headroom--pinned"
          , 350
          window.removeEventListener "resize", resize
          for assignment in document.getElementsByClassName "assignment"
            assignment.style.top = "auto"
        if not trans
          document.body.offsetHeight
          setTimeout ->
            document.body.classList.remove "noTrans"
          , 350
        return

And the info tabs (just a little less code)

    for tab in document.querySelectorAll "#infoTabs>li"
      tab.addEventListener "click", (evt) ->
        document.getElementById("info").setAttribute "data-view", (Array::slice.call document.querySelectorAll "#infoTabs>li").indexOf evt.target

For list view, the assignments can't be on top of each other.
Therefore, a listener is attached to the resizing of the browser window.

    getResizeAssignments = ->
      assignments = Array::slice.call document.querySelectorAll if document.body.classList.contains("showDone") then ".assignment.listDisp" else ".assignment.listDisp:not(.done)"
      assignments.sort (a,b) ->
        ad = a.classList.contains "done"
        bd = b.classList.contains "done"
        return 1 if ad and not bd
        return -1 if bd and not ad
        a.getElementsByClassName("due")[0].value-b.getElementsByClassName("due")[0].value
      assignments
    resize = ->
      #To calculate the number of columns, the below algorithm is used becase as the screen size increases, the column width increases
      widths = if document.body.classList.contains "showInfo" then [650,1100,1800,2700,3800,5100] else [350,800,1500,2400,3500,4800]
      columns = 1
      for w,index in widths
        columns = index+1 if window.innerWidth > w
      columnHeights = (0 for [0...columns])
      assignments = getResizeAssignments()
      for assignment, n in assignments
        col = n%columns
        assignment.style.top = columnHeights[col]+"px"
        assignment.style.left = 100/columns*col+"%"
        assignment.style.right = 100/columns*(columns-col-1)+"%"
        columnHeights[col] += assignment.offsetHeight+24
      setTimeout ->
        for assignment, n in assignments
          col = n%columns
          if n < columns
            columnHeights[col] = 0
          assignment.style.top = columnHeights[col]+"px"
          columnHeights[col] += assignment.offsetHeight+24
        return
      , 700
      return

The view is set to what it was last.

    if localStorage["view"]?
      document.body.setAttribute "data-view", localStorage["view"]
      if localStorage["view"] is "1"
        window.addEventListener "resize", resize

Additionally, the active class needs to be added when inputs are selected (for the login box).

    for input in document.querySelectorAll "input[type=text]:not(#newText), input[type=password], input[type=email], input[type=url], input[type=tel], input[type=number]:not(.control), input[type=search]"
      input.addEventListener "change", (evt) ->
        evt.target.parentNode.querySelector("label").classList.add "active"
      input.addEventListener "focus", (evt) ->
        evt.target.parentNode.querySelector("label").classList.add "active"
      input.addEventListener "blur", (evt) ->
        if evt.target.value.length is 0
          evt.target.parentNode.querySelector("label").classList.remove "active"

When the escape key is pressed, the current assignment should be closed.

    window.addEventListener "keydown", (evt) ->
      if evt.which is 27 # Escape key pressed
        closeOpened(new Event("Generated Event")) if document.getElementsByClassName("full").length isnt 0

If it's winter time, a class is added to the body element.

    do ->
      today = new Date()
      if new Date(today.getFullYear(), 10, 27) <= today <= new Date(today.getFullYear(), 11, 32)
        document.body.classList.add "winter"

For the navbar toggle buttons, a function to toggle the action is defined to eliminate code.

    navToggle = (element, ls, f) ->
        ripple document.getElementById element
        document.getElementById(element).addEventListener "mouseup", ->
          document.body.classList.toggle ls
          resize()
          localStorage[ls] = JSON.stringify document.body.classList.contains ls
          if f? then f()

        if localStorage[ls]? and JSON.parse localStorage[ls]
          document.body.classList.add ls

The button to show/hide completed assignments in list view also needs event listeners.

    navToggle "cvButton", "showDone", ->
        setTimeout resize, 1000

The same goes for the button that shows upcoming tests.

    localStorage["showInfo"] ?= JSON.stringify true
    navToggle "infoButton", "showInfo"

This also gets repeated for the theme toggling.

    navToggle "lightButton", "dark"

<a name="side"/>
Side menu and Navbar
--------------------

The [Headroom library](https://github.com/WickyNilliams/headroom.js) is used to show the navbar when scrolling up

    headroom = new Headroom document.querySelector("nav"),
      tolerance: 10
      offset: 66
    headroom.init()

Also, the side menu needs event listeners.

    document.getElementById("collapseButton").addEventListener "click", ->
      document.body.style.overflow = "hidden"
      document.getElementById("sideNav").classList.add "active"
      document.getElementById("sideBackground").style.display = "block"

    document.getElementById("sideBackground").addEventListener "click", ->
      document.getElementById("sideBackground").style.opacity = 0
      document.getElementById("sideNav").classList.remove "active"
      document.getElementById("dragTarget").style.width = ""
      setTimeout ->
        document.body.style.overflow = "auto"
        document.getElementById("sideBackground").style.display = "none"
      , 350

Then, the username in the sidebar needs to be set and we need to generate an "avatar" based on initals.
To do that, some code to convert from LAB to RGB colors is borrowed from https://github.com/boronine/colorspaces.js

LAB is a color naming scheme that uses two values (A and B) along with a lightness value in order to produce colors that are equally spaced between all of the colors that can be seen by the human eye.
This works great because everyone has letters in his/her initials.

    labrgb = (_L,_a,_b) ->
      # The D65 standard illuminant
      ref_X = 0.95047
      ref_Y = 1.00000
      ref_Z = 1.08883

      # CIE L*a*b* constants
      lab_e = 0.008856
      lab_k = 903.3

      f_inv = (t) ->
        if Math.pow(t, 3) > lab_e
          Math.pow(t, 3)
        else
          (116 * t - 16) / lab_k
      dot_product = (a, b) ->
        ret = 0
        for i in [0..a.length-1]
          ret += a[i] * b[i]
        return ret

      var_y = (_L + 16) / 116
      var_z = var_y - _b / 200
      var_x = _a / 500 + var_y
      _X = ref_X * f_inv(var_x)
      _Y = ref_Y * f_inv(var_y)
      _Z = ref_Z * f_inv(var_z)

      tuple = [_X, _Y, _Z]

      m = [
        [3.2406, -1.5372, -0.4986]
        [-0.9689, 1.8758,  0.0415]
        [0.0557, -0.2040,  1.0570]
      ]
      from_linear = (c) ->
        a = 0.055
        if c <= 0.0031308
          12.92 * c
        else
          1.055 * Math.pow(c, 1 / 2.4) - 0.055
      _R = from_linear dot_product m[0], tuple
      _G = from_linear dot_product m[1], tuple
      _B = from_linear dot_product m[2], tuple

      # Original from here
      n = (v) ->
        Math.round Math.max(Math.min(v*256,255), 0)
      "rgb(#{n _R}, #{n _G}, #{n _B})"

The function below uses this algorithm to generate a background color for the initials displayed in the sidebar.

    updateAvatar = ->
      if localStorage["username"]?
        document.getElementById("user").innerHTML = localStorage["username"]
        initials = localStorage["username"].match /\d*(.).*?(.$)/ # Separate year from first name and initial
        bg = labrgb 50, (initials[1].charCodeAt(0)-65)/26*256-128, (initials[2].charCodeAt(0)-65)/26*256-128 # Compute the color
        document.getElementById("initials").style.backgroundColor = bg
        document.getElementById("initials").innerHTML = initials[1]+initials[2]
    updateAvatar()

<a name="athena"/>
Athena (Schoology)
------------------

Now, there's the schoology/athena integration stuff.
First, we need to check if it's been more than a day. There's no point constantly retrieving classes from Athena; they dont't change that much.

    athenaData = if localStorage["athenaData"]? then JSON.parse(localStorage["athenaData"]) else null

Then, once the variable for the last date is initialized, it's time to get the classes from athena.
Luckily, there's this file at /iapi/course/active - and it's in JSON! Life can't be any better! Seriously! It's just too bad the login page isn't in JSON.

    parseAthenaData = (dat) ->
      if dat is ""
        athenaData = null
        localStorage.removeItem "athenaData"
      else
        try
          d = JSON.parse dat
          athenaData2 = {}
          for course,n in d.body.courses.courses
            courseDetails = d.body.courses.sections[n]
            athenaData2[course.course_title] =
              link: "https://athena.harker.org"+courseDetails.link
              logo: courseDetails.logo.substr(0, courseDetails.logo.indexOf("\" alt=\"")).replace("<div class=\"profile-picture\"><img src=\"", "").replace("tiny", "reg")
              period: courseDetails.section_title
          athenaData = athenaData2
          localStorage["athenaData"] = JSON.stringify athenaData
          document.getElementById("athenaDataError").style.display = "none"
          document.getElementById("athenaDataRefresh").style.display = "block"
        catch e
          document.getElementById("athenaDataError").style.display = "block"
          document.getElementById("athenaDataRefresh").style.display = "none"
          document.getElementById("athenaDataError").innerHTML = e.message
      return

<a name="settings"/>
Settings
--------

To bring up the settings windows, an event listener needs to be added to the button.

    document.getElementById("settingsB").addEventListener "click", ->
      document.getElementById("sideBackground").click()
      document.body.classList.add "settingsShown"
      document.getElementById("brand").innerHTML = "Settings"
      setTimeout ->
        document.querySelector("main").style.display = "none"

The back button also needs to close the settings window.

    document.getElementById("backButton").addEventListener "click", ->
      document.querySelector("main").style.display = "block"
      document.body.classList.remove "settingsShown"
      document.getElementById("brand").innerHTML = "Check PCR"

The code below is what the settings control.

    localStorage["viewTrans"] ?= JSON.stringify true
    localStorage["earlyTest"] ?= JSON.stringify 1
    localStorage["googleA"] ?= JSON.stringify true
    localStorage["holidayThemes"] ?= JSON.stringify false
    document.body.classList.add "holidayThemes" if JSON.parse localStorage["holidayThemes"]
    localStorage["colorType"] ?= "assignment"
    localStorage["assignmentColors"] ?= JSON.stringify {homework: "#2196f3", classwork: "#689f38", test: "#f44336", longterm: "#f57c00"}
    if localStorage["data"]? and not localStorage["classColors"]?
      a = {}
      for c in JSON.parse(localStorage["data"]).classes
        a[c] = "#616161"
      localStorage["classColors"] = JSON.stringify a
    document.getElementById("#{localStorage["colorType"]}Colors").style.display = "block"
    localStorage["refreshOnFocus"] ?= JSON.stringify true
    window.addEventListener "focus", ->
      if JSON.parse localStorage["refreshOnFocus"]
        fetch()
    localStorage["refreshRate"] ?= JSON.stringify -1
    intervalRefresh = ->
      r = JSON.parse localStorage["refreshRate"]
      if r > 0
        setTimeout ->
          console.debug "Refreshing because of timer"
          fetch()
          intervalRefresh()
        , r*60*1000
    intervalRefresh()

For choosing colors, the color choosing boxes need to be initialized.

    ac = JSON.parse localStorage["assignmentColors"]
    cc = if localStorage["classColors"]? then JSON.parse(localStorage["classColors"]) else {}
    palette =
      "#f44336": "#B71C1C"
      "#e91e63": "#880E4F"
      "#9c27b0": "#4A148C"
      "#673ab7": "#311B92"
      "#3f51b5": "#1A237E"
      "#2196f3": "#0D47A1"
      "#03a9f4": "#01579B"
      "#00bcd4": "#006064"
      "#009688": "#004D40"
      "#4caf50": "#1B5E20"
      "#689f38": "#33691E"
      "#afb42b": "#827717"
      "#fbc02d": "#F57F17"
      "#ffa000": "#FF6F00"
      "#f57c00": "#E65100"
      "#ff5722": "#BF360C"
      "#795548": "#3E2723"
      "#616161": "#212121"
    if localStorage["data"]?
      for c in JSON.parse(localStorage["data"]).classes
        d = element "div", [], c
        d.setAttribute "data-control", c
        d.appendChild element "span", []
        document.getElementById("classColors").appendChild d
    for e in document.getElementsByClassName "colors"
      for color in e.getElementsByTagName "div"
        sp = color.querySelector("span")
        listName = if e.getAttribute("id") is "classColors" then "classColors" else "assignmentColors"
        list = if e.getAttribute("id") is "classColors" then cc else ac
        sp.style.backgroundColor = list[color.getAttribute("data-control")]
        for p of palette
          pe = element "span", []
          pe.style.backgroundColor = p
          if p is list[color.getAttribute("data-control")]
            pe.classList.add "selected"
          sp.appendChild pe
        custom = element "span", ["customColor"], "<a>Custom</a>
          <input type='text' placeholder='Was #{list[color.getAttribute("data-control")]}' />
          <span class='customInfo'>Use any CSS valid color name, such as
          <code>#F44336</code> or <code>rgb(64, 43, 2)</code> or <code>cyan</code></span>
          <a class='customOk'>Set</a>"
        custom.addEventListener "click", (evt) -> evt.stopPropagation()
        custom.querySelector("a").addEventListener "click", (evt) ->
          this.parentNode.parentNode.classList.toggle "onCustom"
          evt.stopPropagation()
        sp.appendChild custom
        do (sp, color, list, listName) ->
          sp.addEventListener "click", (evt) ->
            if sp.classList.contains "choose"
              bg = tinycolor(evt.target.style.backgroundColor).toHexString()
              list[color.getAttribute("data-control")] = bg
              sp.style.backgroundColor = bg
              if sp.querySelector(".selected")?
                sp.querySelector(".selected").classList.remove "selected"
              evt.target.classList.add "selected"
              localStorage[listName] = JSON.stringify list
              updateColors()
            sp.classList.toggle "choose"
          custom.querySelector(".customOk").addEventListener "click", (evt) ->
            this.parentNode.parentNode.classList.remove "onCustom"
            this.parentNode.parentNode.classList.toggle "choose"
            if sp.querySelector(".selected")?
              sp.querySelector(".selected").classList.remove "selected"
            sp.style.backgroundColor = list[color.getAttribute("data-control")] =
              this.parentNode.querySelector("input").value
            localStorage[listName] = JSON.stringify list
            updateColors()
            evt.stopPropagation()

Then, a function that updates the color preferences is defined.

    updateColors = ->
      style = document.createElement "style"
      style.appendChild document.createTextNode("")
      document.head.appendChild style
      sheet = style.sheet

      addColorRule = (selector, light, dark, extra="") ->
        sheet.insertRule("#{extra}.assignment#{selector} { background-color: #{light}; }", 0)
        sheet.insertRule("#{extra}.assignment#{selector}.done { background-color: #{dark}; }", 0)
        sheet.insertRule("#{extra}.assignment#{selector}::before { background-color: #{tinycolor.mix(light, "#1B5E20", 70).toHexString()}; }", 0)
        sheet.insertRule("#{extra}.assignmentItem#{selector}>i { background-color: #{light}; }", 0)
        sheet.insertRule("#{extra}.assignmentItem#{selector}.done>i { background-color: #{dark}; }", 0)

      createPalette = (color) ->
        tinycolor(color).darken(24).toHexString()

      if localStorage["colorType"] is "assignment"
        for name, color of JSON.parse localStorage["assignmentColors"]
          addColorRule ".#{name}", color, palette[color] or createPalette(color)
      else
        for name, color of JSON.parse localStorage["classColors"]
          addColorRule "[data-class=\"#{name}\"]", color, palette[color] or createPalette(color)

      addColorRule ".todo", "#F5F5F5", "#E0E0E0"
      addColorRule ".todo", "#424242", "#212121", ".dark "
      return

The function then needs to be called.

    updateColors()

The elements that control the settings also need event listeners

    for e in document.getElementsByClassName "settingsControl"
      if localStorage[e.name]?
        if e.type is "checkbox"
          e.checked = JSON.parse localStorage[e.name]
        else
          e.value = JSON.parse localStorage[e.name]
      e.addEventListener "change", (evt) ->
        if evt.target.type is "checkbox"
          localStorage[evt.target.name] = JSON.stringify evt.target.checked
        else
          localStorage[evt.target.name] = JSON.stringify evt.target.value
        switch evt.target.name
          when "refreshRate" then intervalRefresh()
          when "earlyTest" then display()
          when "holidayThemes" then document.body.classList.toggle "holidayThemes", evt.target.checked

This also needs to be done for radio buttons

    document.querySelector("input[name=\"colorType\"][value=\"#{localStorage["colorType"]}\"]").checked = true
    for c in document.getElementsByName("colorType")
      c.addEventListener "change", (evt) ->
        v = document.querySelector('input[name="colorType"]:checked').value
        localStorage["colorType"] = v
        if v == "class"
          document.getElementById("assignmentColors").style.display = "none"
          document.getElementById("classColors").style.display = "block"
        else
          document.getElementById("assignmentColors").style.display = "block"
          document.getElementById("classColors").style.display = "none"
        updateColors()

The same goes for textareas.

    for e in document.getElementsByTagName("textarea")
      if localStorage[e.name]?
        e.value = localStorage[e.name]
      e.addEventListener "input", (evt) ->
        localStorage[evt.target.name] = evt.target.value
        if evt.target.name is "athenaDataRaw"
          parseAthenaData evt.target.value

<a name="starting"/>
Starting everything
-------------------

Finally! We are (almost) done!
The completed and modified assignments are loaded.

    done = []
    if localStorage["done"]?
      done = JSON.parse localStorage["done"]
    modified = {}
    if localStorage["modified"]?
      modified = JSON.parse localStorage["modified"]
    extra = []
    if localStorage["extra"]?
      extra = JSON.parse localStorage["extra"]

The "last updated" text is set to the correct date.

    document.getElementById("lastUpdate").innerHTML = if localStorage["lastUpdate"]? then formatUpdate(localStorage["lastUpdate"]) else "Never"

Now, we load the saved assignments (if any) and fetch the current assignments from PCR.

    if localStorage["data"]?
      window.data = JSON.parse localStorage["data"]

      # Now check if there's activity
      if localStorage["activity"]?
        activity = JSON.parse localStorage["activity"]
        for act in activity.slice activity.length-32, activity.length
          addActivity act[0], act[1], act[2]

      display()

    fetch()

If the page is being viewed from the website, a couple changes need to be made.

    if location.protocol isnt "chrome-extension:"
      lc = document.querySelector("#login .content")
      document.getElementById("login").classList.add "large"
      lc.appendChild element "div", [], "While this feature is very useful, it will store your credentials on the server's database. If you are uncomfortable with this, then unckeck the box to only have the servery proxy your credentials to PCR.", "storeAbout"
      lc.appendChild element "span", [],
        """The online version of Check PCR will send your login credentials through the server hosting this website so that it can fetch your assignments from PCR.
        If you do not trust me to avoid stealing your credentials, you can use
        <a href='https://github.com/19RyanA/CheckPCR'>the unofficial Check PCR chrome extension</a>, which will communicate directly with PCR and thus not send any data through this server.""", "loginExtra"
      up = document.getElementById("update")
      upc = up.getElementsByClassName("content")[0]
      up.querySelector("h1").innerHTML = "A new update has been applied."
      for el in upc.childNodes by -1
        el.remove() if el.nodeType is 3 or el.tagName is "BR" or el.tagName is "CODE" or el.tagName is "A"
      upc.insertBefore document.createTextNode("Because you are using the online version, the update has already been download. Click GOT IT to reload the page and apply the changes."), upc.querySelector("h2")
      document.getElementById("updateDelay").style.display = "none"
      document.getElementById("updateIgnore").innerHTML = "GOT IT"
      document.getElementById("updateIgnore").style.right = "8px"

<a name="analytics"/>
Analytics
---------

The page to be sent to Google Analytics is set to the correct one.

    gp =
      page: '/new.html'
      title: if location.protocol is "chrome-extension:" then "Version #{localStorage["commit"] or "New"}" else "Online"

This is the code for Google Analytics. There's not much more to explain.

    if not JSON.parse(localStorage["googleA"])
      window['ga-disable-UA-66932824-1'] = true

    `(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');`

    ga 'create', 'UA-66932824-1', 'auto'
    ga 'set', 'checkProtocolTask', (->)
    ga 'require', 'displayfeatures'
    ga 'send', 'pageview', gp

The user is also alerted that the page uses Google Analytics just to be nice.

    if not localStorage["askGoogleAnalytics"]?
      snackbar "This page uses Google Analytics. You can opt out vai Settings.", "Settings", ->
        document.getElementById("settingsB").click()
      localStorage["askGoogleAnalytics"] = "false"

<a name="events"/>
Events
------

The document body needs to be enabled for hammer.js events.

    delete Hammer.defaults.cssProps.userSelect
    hammertime = new Hammer.Manager document.body,
      recognizers: [
        [Hammer.Pan, {direction: Hammer.DIRECTION_HORIZONTAL}]
      ]

For touch displays, hammer.js is used to make the side menu appear/disappear. The code below is adapted from Materialize's implementation.

    menuOut = false
    dragTarget = new Hammer document.getElementById "dragTarget"
    dragTarget.on "pan", (e) ->
      if e.pointerType is "touch"
        e.preventDefault()
        direction = e.direction
        x = e.center.x
        y = e.center.y

        sbkg = document.getElementById("sideBackground")
        sbkg.style.display = "block"
        sbkg.style.opacity = 0
        document.getElementById("sideNav").classList.add "manual"

        # Keep within boundaries
        if x > 240
          x = 240
        else if x < 0
          x = 0

          # Left Direction
          if x < 120
            menuOut = false
          # Right Direction
          else if x >= 120
            menuOut = true

        document.getElementById("sideNav").style.transform = "translateX(#{x-240}px)"
        overlayPerc = Math.min(x / 480, 0.5)
        sbkg.style.opacity = overlayPerc

    dragTarget.on "panend", (e) ->
      if e.pointerType is "touch"
        velocityX = e.velocityX
        # If velocityX <= 0.3 then the user is flinging the menu closed so ignore menuOut
        if (menuOut and velocityX <= 0.3) or velocityX < -0.5
          sideNav = document.getElementById("sideNav")
          sideNav.classList.remove "manual"
          sideNav.classList.add "active"
          sideNav.style.transform = ""
          document.getElementById("dragTarget").style.width = "100%"

        else if !menuOut or velocityX > 0.3
          document.body.style.overflow = "auto"
          sideNav = document.getElementById("sideNav")
          sideNav.classList.remove "manual"
          sideNav.classList.remove "active"
          sideNav.style.transform = ""
          document.getElementById("sideBackground").style.opacity = ""
          document.getElementById("dragTarget").style.width = "10px"
          setTimeout ->
            document.getElementById("sideBackground").style.display = "none"
          , 350

    dragTarget.on "tap", (e) ->
      document.getElementById("sideBackground").click()
      e.preventDefault()

    dt = document.getElementById("dragTarget")
    hammertime.on "pan", (e) ->
      if e.pointerType is "touch" and e.deltaX < -100 or e.deltaX > 100 and e.target isnt dt and (-25 < e.deltaY < 25)
        if e.velocityX > 0.5
          el = document.querySelector("#navTabs>li:nth-child(#{document.body.getAttribute("data-view")+2})")
        else if e.velocityX < -0.5
          el = document.querySelector("#navTabs>li:nth-child(#{document.body.getAttribute("data-view")})")
        if el?
          el.click()
      return

The activity filter button also needs an event listener.

    ripple document.getElementById("filterActivity")
    document.getElementById("filterActivity").addEventListener "click", ->
      document.getElementById("infoActivity").classList.toggle("filter")

At the start, it needs to be correctly populated

    activityTypes = if localStorage["shownActivity"] then JSON.parse(localStorage["shownActivity"]) else
      add: true
      edit: true
      delete: true
    updateSelectNum = ->
      c = (bool) -> if bool then 1 else 0
      document.getElementById("selectNum").innerHTML = c(activityTypes.add)+c(activityTypes.edit)+c(activityTypes.delete)
    updateSelectNum()
    for type,enabled of activityTypes
      document.getElementById(type+"Select").checked = enabled
      if enabled then document.getElementById("infoActivity").classList.add type
      do (type) ->
        document.getElementById(type+"Select").addEventListener "change", (evt) ->
          activityTypes[type] = evt.target.checked
          document.getElementById("infoActivity").setAttribute "data-filtered", updateSelectNum()
          document.getElementById("infoActivity").classList.toggle type
          localStorage["shownActivity"] = JSON.stringify activityTypes

<a name="updates"/>
Updates and News
----------------

For updating, a request will be send to Github to get the current commit id and check that against what's stored

    checkCommit = ->
      send (if location.protocol is "chrome-extension:" then "https://api.github.com/repos/19RyanA/CheckPCR/git/refs/heads/master" else "/api/commit"), "json"
        .then (resp) ->
          last = localStorage["commit"]
          c = resp.response.object.sha;
          console.debug(last, c);
          if not last?
            localStorage["commit"] = c
          else if last isnt c
            document.getElementById("updateIgnore").addEventListener "click", ->
              localStorage["commit"] = c
              if location.protocol is "chrome-extension:"
                document.getElementById("update").classList.remove "active"
                setTimeout ->
                  document.getElementById("updateBackground").style.display = "none"
                , 350
              else
                window.location.reload()
            send (if location.protocol is "chrome-extension:" then resp.response.object.url else "/api/commit/#{c}"), "json"
              .then (resp) ->
                document.getElementById("updateFeatures").innerHTML = resp.response.message.substr(resp.response.message.indexOf("\n\n")+2).replace(/\* (.*?)(?=$|\n)/g, (a,b) -> "<li>#{b}</li>").replace(/>\n</g, "><").replace(/\n/g, "<br>")
                document.getElementById("updateBackground").style.display = "block"
                document.getElementById("update").classList.add "active"
        , (err) ->
          console.log "Could not access Github. Here's the error:", err

    firstTime = not localStorage["commit"] # It's the user's first time if the commit hasn't been saved yet
    if location.protocol is "chrome-extension:" or firstTime then checkCommit()

If the application cache is updated, this should trigger the checkCommit function.

    window.applicationCache.addEventListener "updateready", checkCommit

This update dialog also needs to be closed when the butons are clicked.

    document.getElementById("updateDelay").addEventListener "click", ->
      document.getElementById("update").classList.remove "active"
      setTimeout ->
        document.getElementById("updateBackground").style.display = "none"
      , 350

For news, the latest news is fetched from a GitHub gist.

    send "https://api.github.com/gists/b42a5a3c491be081e9c9", "json"
      .then (resp) ->
        last = localStorage["newsCommit"]
        nc = resp.response.history[0].version

        if not last?
          localStorage["newsCommit"] = nc

        window.getNews = (onfail) ->
          send resp.response.files["updates.htm"].raw_url
            .then (resp) ->
              localStorage["newsCommit"] = nc
              for news in resp.responseText.split("<hr>")
                document.getElementById("newsContent").appendChild element "div", "newsItem", news
              document.getElementById("newsBackground").style.display = "block"
              document.getElementById("news").classList.add "active"
            , (err) ->
              if onfail? then onfail()

        if last isnt nc
          window.getNews()
      , (err) ->
        console.log "Could not access Github. Here's the error:", err

The news dialog then needs to be closed when OK or the background is clicked.

    closeNews = ->
      document.getElementById("news").classList.remove "active"
      setTimeout ->
        document.getElementById("newsBackground").style.display = "none"
      , 350

    document.getElementById("newsOk").addEventListener "click", closeNews
    document.getElementById("newsBackground").addEventListener "click", closeNews

It also needs to be opened when the news button is clicked.

    document.getElementById("newsB").addEventListener "click", ->
      document.getElementById("sideBackground").click()
      dispNews = ->
        document.getElementById("newsBackground").style.display = "block"
        document.getElementById("news").classList.add "active"

      if document.getElementById("newsContent").childNodes.length == 0
        if getNews? then getNews dispNews else dispNews()
      else
        dispNews()

The same goes for the error dialog.

    closeError = ->
      document.getElementById("error").classList.remove "active"
      setTimeout ->
        document.getElementById("errorBackground").style.display = "none"
      , 350

    document.getElementById("errorNo").addEventListener "click", closeError
    document.getElementById("errorBackground").addEventListener "click", closeError

<a name="new"/>
Adding new assignments
----------------------

The event listener for the new button is added.

    ripple document.getElementById("new")
    document.getElementById("new").addEventListener "mouseup", ->
      updateNewTips document.getElementById("newText").value = ""
      document.body.style.overflow = "hidden"
      document.getElementById("newBackground").style.display = "block"
      document.getElementById("newDialog").classList.add "active"
      document.getElementById("newText").focus()

A function to close the dialog is then defined.

    closeNew = ->
      document.body.style.overflow = "auto"
      document.getElementById("newDialog").classList.remove "active"
      setTimeout ->
        document.getElementById("newBackground").style.display = "none"
      , 350

This function is set to be called called when the ESC key is called inside of the dialog.

    document.getElementById("newText").addEventListener "keydown", (evt) ->
      if evt.which is 27 # Escape key pressed
        closeNew()

An event listener to call the function is also added to the X button

    document.getElementById("newCancel").addEventListener "click", closeNew


When the enter key is pressed or the submit button is clicked, the new assignment is added.

    document.getElementById("newDialog").addEventListener "submit", (evt) ->
      evt.preventDefault()
      text = document.getElementById("newText").value

      while true
        parsed = text.match /(.*) (for|by|due|assigned|starting|ending|beginning) (.*)/
        if parsed?
          switch parsed[2]
            when "for" then cls = parsed[3]
            when "by","due","ending" then due = parsed[3]
            when "assigned","starting","beginning" then st = parsed[3]
          text = parsed[1]
        else
          break
      start = if st? then Math.floor (chrono.parseDate(st).getTime()-tzoff)/1000/3600/24 else Math.floor (Date.now()-tzoff)/1000/3600/24
      if due?
        end = Math.floor (chrono.parseDate(due).getTime()-tzoff)/1000/3600/24
        if end<start # Assignmend ends before it is assigned
          end += Math.ceil((start-end)/7)*7
      extra.push
        body: text.charAt(0).toUpperCase()+text.substr(1)
        done: false
        start: start
        class: if cls? then cls.toLowerCase().trim() else null
        end: end
      localStorage["extra"] = JSON.stringify extra
      closeNew()
      display(false)

When anything is typed, the search suggestions need to be updated.

    tipNames =
      for: ["for"]
      by: ["by", "due", "ending"]
      starting: ["starting", "beginning", "assigned"]

    updateTip = (name, typed, uppercase) ->
      el = document.getElementById "tip#{name}"
      el.classList.add "active"
      el.querySelector(".typed").innerHTML = (if uppercase then typed.charAt(0).toUpperCase()+typed.substr(1) else typed)+"..."
      newNames = []
      for n in tipNames[name]
        if n != typed then newNames.push "<b>#{n}</b>"
      el.querySelector(".others").innerHTML = if newNames.length>0 then "You can also use "+newNames.join(" or ") else ""

    tipComplete = (evt) ->
      val = document.getElementById("newText").value
      lastSpace = val.lastIndexOf " "
      lastWord = if lastSpace is -1 then 0 else lastSpace+1
      updateNewTips document.getElementById("newText").value = val.substring(0,lastWord)+this.querySelector(".typed").innerHTML.replace("...","")+" "
      document.getElementById("newText").focus()

    updateNewTips = (val) ->
      document.getElementById("newTips").scrollTop = 0
      if (i=val.lastIndexOf " ") isnt -1
        beforeSpace = val.lastIndexOf " ", i-1
        before = val.substring (if beforeSpace is -1 then 0 else beforeSpace+1), i
        for name, possible of tipNames
          if possible.indexOf(before) isnt -1
            if name is "for"
              for name of tipNames
                document.getElementById("tip"+name).classList.remove "active"
              for cls in data.classes
                id = "tipclass"+cls.replace /\W/, ""
                if i is val.length-1
                  if (e=document.getElementById(id))?
                    e.classList.add "active"
                  else
                    container = element "div", ["classTip","active","tip"], "<i class='material-icons'>class</i><span class='typed'>#{cls}</span>", id
                    container.addEventListener "click", tipComplete
                    document.getElementById("newTips").appendChild container
                else
                  document.getElementById(id).classList.toggle "active", cls.toLowerCase().indexOf(val.toLowerCase().substr i+1) isnt -1
              return

      for el in document.getElementsByClassName "classTip"
        el.classList.remove "active"
      if val is "" or val.charAt(val.length-1) is " "
        updateTip "for", "for", false
        updateTip "by", "by", false
        updateTip "starting", "starting", false
      else
        lastSpace = val.lastIndexOf " "
        lastWord = if lastSpace is -1 then val else val.substr lastSpace+1
        uppercase = lastWord.charAt(0) is lastWord.charAt(0).toUpperCase()
        lastWord = lastWord.toLowerCase()
        for name, possible of tipNames
          found = false
          for p in possible
            if p.slice(0,lastWord.length) is lastWord
              found = p
          if found
            updateTip name, found, uppercase
          else
            document.getElementById("tip"+name).classList.remove "active"
      return

    updateNewTips ""
    document.getElementById("newText").addEventListener "input", ->
      updateNewTips this.value

The event listener is then added to the preexisting tips.

    for tip in document.getElementsByClassName "tip"
      tip.addEventListener "click", tipComplete
