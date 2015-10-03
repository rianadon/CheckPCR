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

##### So, here is the annotated code:

<a name="defs"/>
Basic Definitions
-----------------

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

    fetch = ->
      console.time "Fetching assignments"
      send "https://webappsca.pcrsoft.com/Clue/Student-Assignments-End-Date-Range/7536", "document", null, null, true
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
              alert "Error parsing assignments. Is PCR on list or month view?"
          return
        , (error) ->
          console.log "Could not fetch assignments; You are probably offline. Here's the error:", error
          snackbar "Could not fetch your assignments", "Retry", fetch
          return
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
      console.time "Logging in"
      send loginURL, "document", { "Content-type": "application/x-www-form-urlencoded" }, postArray.join("&"), true
        .then (resp) ->
          console.timeEnd "Logging in"
          if resp.responseURL.indexOf("Login") isnt -1
            # If PCR still wants us to log in, then the username or password enterred were incorrect.
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
              alert "Error parsing assignments. Is PCR on list or month view?"
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
        assignment.type = title.match(/\(([^\(\)]*)\)$/)[1].toLowerCase().replace("& quizzes", "").replace("tests", "test")
        assignment.baseType = (ca.title.substring 0, ca.title.indexOf "\n").toLowerCase().replace("& quizzes", "")
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
        send "https://webappsca.pcrsoft.com/Clue/Student-Assignments-End-Date-Range/7536", "document", { "Content-type": "application/x-www-form-urlencoded" }, postArray.join("&"), true
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

    display = ->
      console.time "Displaying data"
      document.body.setAttribute "data-pcrview", if window.data.monthView then "month" else "other"
      main = document.querySelector "main"
      taken = {}

      today = Math.floor (Date.now()-tzoff)/1000/3600/24
      todayDiv = null

      if window.data.monthView
        start = Math.min (assignment.start for assignment in window.data.assignments)... # Smallest date
        end = Math.max (assignment.end for assignment in window.data.assignments)... # Largest date

        year = (new Date()).getFullYear() # For future calculations

        # Calculate what month we will be displaying by computing the average of the middle date of all assignments
        month = 0
        for assignment in window.data.assignments
          month += (new Date (assignment.start+assignment.end)*500*3600*24).getMonth()
        month = Math.round month/window.data.assignments.length

        # Make sure the start and end dates lie within the month
        start = new Date Math.max start*1000*3600*24+tzoff, (new Date year, month).getTime()
        end = new Date Math.min end*1000*3600*24+tzoff, (new Date year, month+1, 0).getTime() # If the day argument for Date is 0, then the resulting date will be of the previous month
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
          if Math.floor((d-tzoff)/1000/3600/24) is today
            day.classList.add "today"
            todayDiv = day

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
        s = Math.max start.getTime(), assignment.start*1000*3600*24+tzoff
        e = Math.min end.getTime(),assignment.end*1000*3600*24+tzoff
        span = (e-s)/1000/3600/24 # Number of days assignment takes up
        spanRelative = span-(6-(new Date s).getDay()) # Number of days before/past the next Saturday

        nextSat = e/1000/3600/24-spanRelative # The date of the next Saturday
        n = -6
        while n < spanRelative
          split.push
            assignment: num
            start: new Date Math.max s, (nextSat+n)*1000*3600*24
            end: new Date Math.min e, (nextSat+n+6)*1000*3600*24
          n+=7

        # Activity stuff
        if lastAssignments?
          found = false
          for oldAssignment, num in lastAssignments
            if oldAssignment.id is assignment.id
              found = true
              if oldAssignment.body isnt assignment.body
                addActivity "edit", assignment, true
              lastAssignments.splice(num, 1)
              break
          if not found
            addActivity "add", assignment, true

      # Check if any of the last assignments weren't deleted (so they have been deleted in PCR)
      for assignment in lastAssignments
        addActivity "delete", assignment, true

      # Then save activity
      localStorage["activity"] = JSON.stringify activity.slice activity.length-32, activity.length # save a maximum of 32 activity items

      # Then add assignments

      weekHeights = {}
      previousAssignments = {}
      for assignment in document.getElementsByClassName "assignment"
        previousAssignments[assignment.getAttribute("id")] = assignment
      for s in split
        assignment = window.data.assignments[s.assignment]

        # Separate the class description from the actual class
        separated = separate window.data.classes[assignment.class]

        startSun = new Date(s.start.getTime())
        startSun.setDate startSun.getDate()-startSun.getDay()
        weekId = "wk#{startSun.getMonth()}-#{startSun.getDate()}"

        smallTag = "small"
        link = null
        if athenaData? and athenaData[window.data.classes[assignment.class]]?
          link = athenaData[window.data.classes[assignment.class]].link
          smallTag = "a"

        e = element "div", ["assignment", assignment.baseType, "anim"], "<#{smallTag}#{if link? then " href='#{link}' class='linked'" else ""}><span class='extra'>#{separated[1]}</span>#{separated[2]}</#{smallTag}><span class='title'>#{assignment.title}</span><input type='hidden' class='due' value='#{assignment.end}' />", assignment.id+weekId
        if assignment.id in done
          e.classList.add "done"
        e.setAttribute "data-class", window.data.classes[assignment.class]
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
        do (id) ->
          complete.addEventListener "mouseup", (evt) ->
            if evt.which == 1 # Left button
              el = evt.target
              until el.classList.contains "assignment"
                el = el.parentNode
              added = true
              if el.classList.contains "done"
                done.splice done.indexOf(id), 1
              else
                added = false
                done.push id
              localStorage["done"] = JSON.stringify done
              if document.body.getAttribute("data-view") == "1"
                setTimeout ->
                  for elem in document.querySelectorAll ".assignment[id*=\"#{id}\"], .upcomingTest[id*=\"test#{id}\"], .activity[id*=\"activity#{id}\"]"
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
        start = new Date assignment.start*1000*3600*24+tzoff
        end = new Date assignment.end*1000*3600*24+tzoff
        times = element "div", "range", if assignment.start is assignment.end then dateString(start) else "#{dateString(start)} &ndash; #{dateString(end)}"
        e.appendChild times
        if assignment.attachments.length > 0
          attachments = element "div", "attachments"
          for attachment in assignment.attachments
            do (attachment) ->
              a = element "a", [], attachment[0]
              a.href = "https://webappsca.pcrsoft.com/Clue/Common/AttachmentRender.aspx#{attachment[1]}"
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

        e.appendChild element "div", "body", assignment.body

        if start < s.start
          e.classList.add "fromWeekend"
        if end > s.end
          e.classList.add "overWeekend"
        e.classList.add "s#{s.start.getDay()}"
        e.classList.add "e#{6-s.end.getDay()}"

        if Math.floor(s.start/1000/3600/24) <= today <= Math.floor(s.end/1000/3600/24)
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
          already.getElementsByClassName("body")[0].innerHTML = e.getElementsByClassName("body")[0].innerHTML
        else
          wk.appendChild e
        delete previousAssignments[assignment.id+weekId]

      # Delete any assignments that have been deleted since updating
      for name, assignment of previousAssignments
        if assignment.classList.contains "full"
          document.getElementById("background").classList.remove "active"
        assignment.remove()

      # Scroll to the correct position in calendar view
      if todayDiv?
        scroll = todayDiv.getBoundingClientRect().top+document.body.scrollTop-112
        scroll = 0 if scroll < 50 # Also show the day headers if today's date is displayed in the first row of the calendar
        window.scrollTo 0, scroll

      document.body.classList.add "noList" if document.querySelectorAll(".assignment.listDisp:not(.done)").length == 0
      if document.body.getAttribute("data-view") is "1" # in list view
        resize()
        setTimeout resize, 300
      console.timeEnd "Displaying data"

Below is a function to close the current assignment that is opened.

    closeOpened = (evt) ->
      evt.stopPropagation()
      el = document.querySelector(".full")
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
          x = evt.pageX
          y = evt.pageY
          while e
            x -= e.offsetLeft
            y -= e.offsetTop
            e = e.offsetParent

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

The view is set to what it was last.

    if localStorage["view"]?
      document.body.setAttribute "data-view", localStorage["view"]

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
      columns = null
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
      , 500
      return

Additionally, the active class needs to be added when inputs are selected (for the login box).

    for input in document.querySelectorAll "input[type=text], input[type=password], input[type=email], input[type=url], input[type=tel], input[type=number], input[type=search]"
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

For the navbar toggle buttons, a funtion to toggle the action is defined to eliminate code.

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

    lastAthena = if localStorage["lastAthena"] then parseInt(localStorage["lastAthena"]) else 0
    athenaData = if localStorage["athenaData"]? then JSON.parse(localStorage["athenaData"]) else null
    er = null

Then, once the variable for the last date is initialized, it's time to get the classes from athena.
Luckily, there's this file at /iapi/course/active - and it's in JSON! Life can't be any better! Seriously! It's just too bad the login page isn't in JSON.

    if Date.now()-lastAthena >= 1000*3600*24 and (navigator.onLine or not navigator.onLine?) and not localStorage["noSchoology"]?
      console.log "Updating classes from Athena"
      send "https://athena.harker.org/iapi/course/active", "json"
        .then (resp) ->
          if resp.responseURL.indexOf("login") isnt -1
            console.log "Couldn't fetch courses from Athena because you're not logged in."
          else
            athenaData = {}
            localStorage["lastAthena"] = Date.now()
            if resp.response.response_code is 200 # Just to make sure
              for course,n in resp.response.body.courses.courses
                courseDetails = resp.response.body.courses.sections[n]
                athenaData[course.course_title] =
                  link: "https://athena.harker.org"+courseDetails.link
                  logo: courseDetails.logo.substr(0, courseDetails.logo.indexOf("\" alt=\"")).replace("<div class=\"profile-picture\"><img src=\"", "").replace("tiny", "reg")
                  period: courseDetails.section_title
              localStorage["athenaData"] = JSON.stringify athenaData
        , (error) ->
          if not confirm "Please grant the extension permission to access Athena/Schoology.\nYou can do this by going to chrome://extensions then clicking the \"Reload\" button under Check PCR.\n\nIf you don't want Check PCR to access Schoology, click the cancel button. Otherwise, just click OK."
            localStorage["noSchoology"] = "true"

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
    localStorage["googleA"] ?= JSON.stringify true
    localStorage["colorType"] ?= "assignment"
    localStorage["assignmentColors"] ?= JSON.stringify {homework: "#2196f3", classwork: "#689f38", test: "#f44336", projects: "#f57c00"}
    if localStorage["data"]? and not localStorage["classColors"]?
      a = {}
      for c in JSON.parse(localStorage["data"]).classes
        a[c] = "#616161"
      localStorage["classColors"] = JSON.stringify a
    localStorage["assignmentColors"] ?= JSON.stringify {homework: "#2196f3", classwork: "#689f38", test: "#f44336", projects: "#f57c00"}
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
    rgb2hex = (rgb) ->
      return rgb if /^#[0-9A-F]{6}$/i.test rgb
      rgb = rgb.match /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/
      hex = (x) -> ("0" + parseInt(x).toString(16)).slice(-2);
      "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3])
    hex2rgb = (hex) ->
      result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec hex
      [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
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
        do (sp, color, list, listName) ->
          sp.addEventListener "click", (evt) ->
            if sp.classList.contains "choose"
              bg = rgb2hex evt.target.style.backgroundColor
              list[color.getAttribute("data-control")] = bg
              sp.style.backgroundColor = bg
              sp.querySelector(".selected").classList.remove "selected"
              evt.target.classList.add "selected"
              localStorage[listName] = JSON.stringify list
              updateColors()
            sp.classList.toggle "choose"

Then, a function that updates the color preferences is defined.

    updateColors = ->
      mix = (a,b,p) ->
        rgbA = hex2rgb a
        rgbB = hex2rgb b
        hex = (x) -> ("0" + parseInt(x).toString(16)).slice(-2);
        "#" + hex(rgbA[0]*p+rgbB[0]*(1-p)) + hex(rgbA[1]*p+rgbB[1]*(1-p)) + hex(rgbA[2]*p+rgbB[2]*(1-p))
      style = document.createElement "style"
      style.appendChild document.createTextNode("")
      document.head.appendChild style
      sheet = style.sheet

      if localStorage["colorType"] is "assignment"
        for name, color of JSON.parse localStorage["assignmentColors"]
          sheet.insertRule(".assignment.#{name} { background-color: #{color}; }", 0)
          sheet.insertRule(".assignment.#{name}.done { background-color: #{palette[color]}; }", 0)
          sheet.insertRule(".assignment.#{name}::before { background-color: #{mix color, "#1B5E20", 0.3}; }", 0)
          sheet.insertRule(".assignmentItem.#{name}>i { background-color: #{color}; }", 0)
          sheet.insertRule(".assignmentItem.#{name}.done>i { background-color: #{palette[color]}; }", 0)
      else
        for name, color of JSON.parse localStorage["classColors"]
          sheet.insertRule(".assignment[data-class=\"#{name}\"] { background-color: #{color}; }", 0)
          sheet.insertRule(".assignment[data-class=\"#{name}\"].done { background-color: #{palette[color]}; }", 0)
          sheet.insertRule(".assignment[data-class=\"#{name}\"]::before { background-color: #{mix color, "#1B5E20", 0.3}; }", 0)
          sheet.insertRule(".assignmentItem[data-class=\"#{name}\"]>i { background-color: #{color}; }", 0)
          sheet.insertRule(".assignmentItem[data-class=\"#{name}\"].done>i { background-color: #{palette[color]}; }", 0)
The function then needs to be called.

    updateColors()

The elements that control the settings also need event listeners

    for e in document.getElementsByClassName "settingsControl"
      if localStorage[e.name]?
        if e.checked?
          e.checked = JSON.parse localStorage[e.name]
        else
          e.value = JSON.parse localStorage[e.name]
      e.addEventListener "change", (evt) ->
        if evt.target.checked?
          localStorage[evt.target.name] = JSON.stringify evt.target.checked
        else
          localStorage[evt.target.name] = JSON.stringify evt.target.value
        if evt.target.name is "refreshRate"
          intervalRefresh()

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

<a name="starting"/>
Starting everything
-------------------

Finally! We are (almost) done!
This update dialog  needs to be closed when the butons are clicked.

    document.getElementById("updateDelay").addEventListener "click", ->
      document.getElementById("update").classList.remove "active"
      setTimeout ->
        document.getElementById("updateBackground").style.display = "none"
      , 350

The completed assignments are then loaded.

    done = []
    if localStorage["done"]?
      done = JSON.parse localStorage["done"]

The "last updated" text is set to the correct date.

    document.getElementById("lastUpdate").innerHTML = if localStorage["lastUpdate"]? then formatUpdate(localStorage["lastUpdate"]) else "Never"

Now, we load the saved assignments (if any) and fetch the current assignments from PCR.

    if localStorage["data"]?
      window.data = JSON.parse localStorage["data"]

      # Now check if there's activity
      if localStorage["activity"]?
        activity = JSON.parse localStorage["activity"]
        for act in activity
          addActivity act[0], act[1], act[2]

      display()

    fetch()

<a name="analytics"/>
Analytics
---------

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
    ga 'send', 'pageview',
      page: '/new.html'
      title: "Version #{localStorage["commit"] or "New"}"

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
      if e.deltaX < -100 or e.deltaX > 100 and e.target isnt dt
        if e.velocityX > 0.3
          el = document.querySelector("#navTabs>li:nth-child(#{document.body.getAttribute("data-view")+2})")
        else if e.velocityX < -0.3
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

    firstTime = not localStorage["commit"] # It's the user's first time if the commit hasn't been saved yet
    do ->
      send "https://api.github.com/repos/19RyanA/CheckPCR/git/refs/heads/master", "json"
        .then (resp) ->
          last = localStorage["commit"]
          c = resp.response.object.sha;
          console.debug(last, c);
          if not last?
            localStorage["commit"] = c
          else if last isnt c
            document.getElementById("updateIgnore").addEventListener "click", ->
              localStorage["commit"] = c
              document.getElementById("update").classList.remove "active"
              setTimeout ->
                document.getElementById("updateBackground").style.display = "none"
              , 350
            send resp.response.object.url, "json"
              .then (resp) ->
                document.getElementById("updateFeatures").innerHTML = resp.response.message.substr(resp.response.message.indexOf("\n\n")+2).replace(/\* (.*?)(?=$|\n)/g, (a,b) -> "<li>#{b}</li>").replace(/>\n</g, "><").replace(/\n/g, "<br>")
                document.getElementById("updateBackground").style.display = "block"
                document.getElementById("update").classList.add "active"
        , (err) ->
          console.log "Could not access Github. Here's the error:", err

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

        if last isnt nc and not firstTime
          window.getNews()
        if not last?
          localStorage["newsCommit"] = nc
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
