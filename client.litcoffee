Welcome to the documentation of and the actual program of CheckPCR.

This is the main processing program containing that fetches your assignments from PCR, parses them, and displays them.
It is written in [Literate CoffeeScript](http://coffeescript.org/#literate), a version of CoffeeScript (a language that compiles into JavaScript, which is used to modify content on webpages and allow interactions with webpages) that is also compliant with Markdown syntax and can be displayed as a Markdown file (as you see here if you are viewing this file from Github).

#### Table of Contents
* [Basic Definitions](#defs)
* [Retrieving Data](#ret)
* [Parsing](#parsing")
* [Displaying the assignments](#displaying)
* [Side menu and Navbar](#side)
* [Settings](#settings)
* [Starting everything](#starting)

##### So, here is the annotated code:

<a name="defs"/>
Basic Definitions
-----------------

    loginURL = ""
    loginHeaders = {}
    displayFunction = undefined
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

<a name="ret"/>
Retrieving data
---------------

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
            try
              parse resp.response
            catch e
              console.log e
              alert "Error parsing assignments. Is PCR on list or month view?"
          return
        , (error) ->
          console.log "Could not fetch assignments; You are probably offline. Here's the error:", error
          if offline?
            offline.style.display = "block"
          return
      return

Now, we have the function that will log us into PCR.
*val* is an optional argument that is an array of the username and password to log in with

    dologin = (val) ->
      document.getElementById("login").classList.remove "active"
      setTimeout ->
        document.getElementById("loginBackground").style.display = "none"
      , 300
      if document.getElementById("remember").checked #Is the "remember me" checkbox checked?
        setCookie "userPass", window.btoa(document.getElementById("username").value + ":" + document.getElementById("password").value), 14 # Set a cookie with the username and password so we can log in automatically in the future without having to prompt for a username and password again
      postArray = [] # Array of data to post
      localStorage["username"] = if val? then val[0] else document.getElementById("username").value
      updateAvatar()
      for h of loginHeaders # Loop through the input elements contained in the login page. As mentioned before, they will be sent to PCR to log in.
        if h.toLowerCase().indexOf("user") isnt -1
          loginHeaders[h] = if val? then val[0] else document.getElementById("username").value
        if h.toLowerCase().indexOf("pass") isnt -1
          loginHeaders[h] = if val? then val[1] else document.getElementById("password").value
        postArray.push encodeURIComponent(h) + "=" + encodeURIComponent(loginHeaders[h])

      # Now send the login request to PCR
      console.time "Logging in"
      send loginURL, "document", { "Content-type": "application/x-www-form-urlencoded" }, postArray.join("&"), true
        .then (resp) ->
          console.timeEnd "Logging in"
          if resp.responseURL.indexOf("Login") isnt -1
            # If PCR still wants us to log in, then the username or password enterred were probably not correct.
            alert "Incorrect login"
            ###login.className = "visible" # Display the login form again
            loginErr.innerHTML = "The username and/or password you entered is incorrect"###
          else
            # Otherwise, we are logged in!
            # loadingBar.style.display = "none"
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
      dologin()

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
      window.data = {classes: [], assignments: []} # Reset the array in which all of your assignments are stored in.

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
        assignment.type = title.match(/\(([^\(\)]*)\)$/)[1].toLowerCase().replace("& quizzes", "")
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

      localStorage["data"] = JSON.stringify(data) # Store for offline use
      console.timeEnd "Handling data"
      display() # Display the data
      return

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

    dateString = (date) ->
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
        return weekdays[date.getDay()]
      "#{weekdays[date.getDay()]}, #{fullMonths[date.getMonth()]} #{date.getDate()}"


This function will convert the array of assignments generated by *parse* into readable HTML.

    display = ->
      console.time "Displaying data"
      main = document.querySelector "main"
      taken = {}

      today = Math.floor (Date.now()-tzoff)/1000/3600/24
      todayDiv = null

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

      # Set the start date to be a Sunday and the end date to be a Saturday
      start.setDate start.getDate()-start.getDay()
      end.setDate end.getDate()+(6-end.getDay())

      # First populate the calendar with boxes for each day
      d = new Date start
      wk = null
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
      # Then add assignments

      weekHeights = {}
      previousAssignments = {}
      for assignment in document.getElementsByClassName "assignment"
        previousAssignments[assignment.getAttribute("id")] = assignment
      for s in split
        assignment = window.data.assignments[s.assignment]

        # Separate the class description from the actual class
        separated = window.data.classes[assignment.class].match /// (
          (?:\d*\s+)?                           # digits and a space(s) if they exist [the grade level for the class]
          (?:(?:hon\w*|(?:adv\w*\s*)?core)\s+)? # matches the honors, advanced core, or core if that exists
        )
        (.*)                                    # the actual class name (English, Science, Math, etc.)
        ///i

        startSun = new Date(s.start.getTime())
        startSun.setDate startSun.getDate()-startSun.getDay()
        weekId = "wk#{startSun.getMonth()}-#{startSun.getDate()}"

        e = element "div", ["assignment", assignment.baseType], "<small><span class='extra'>#{separated[1]}</span>#{separated[2]}</small><span class='title'>#{assignment.title}</span><input type='hidden' class='due' value='#{assignment.end}' />", assignment.id+weekId
        if assignment.id in done
          e.classList.add "done"
        close = element "a", ["close", "material-icons"], "close"
        close.addEventListener "click", closeOpened
        e.appendChild close
        complete = element "a", ["complete", "material-icons", "waves"], "done"
        ripple complete
        id = assignment.id
        do (id) ->
          complete.addEventListener "mouseup", (evt) ->
            if evt.which == 1 # Left button
              el = evt.target
              until el.classList.contains "assignment"
                el = el.parentNode
              if el.classList.contains "done"
                done.splice done.indexOf(id), 1
              else
                done.push id
              localStorage["done"] = JSON.stringify done
              if document.body.getAttribute("data-view") == "1"
                setTimeout ->
                  el.classList.toggle "done"
                  resize()
                , 100
              else
                el.classList.toggle "done"
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
          if document.getElementsByClassName("full").length == 0 and (not el.classList.contains "anim") and document.body.getAttribute("data-view") == "0"
            el.classList.add "modify"
            el.style.top = el.getBoundingClientRect().top-document.body.scrollTop-parseInt(el.style.marginTop)+44+"px"
            el.setAttribute "data-top", el.style.top
            document.body.style.overflow = "hidden"
            back = document.getElementById("background")
            back.classList.add "active"
            back.style.display = "block"
            setTimeout ->
              el.classList.add "anim"
              el.classList.add "full"
              el.style.top = 75-parseInt(el.style.marginTop)+"px"
              setTimeout ->
                el.classList.remove "anim"
              , 300
            , 0
          return

        # Append the assignment to the correct week element and set its height to contain the assignments in it
        wk = document.getElementById weekId

        if not weekHeights[weekId]? or pos > weekHeights[weekId]
          weekHeights[weekId] = pos
          wk.style.height = 47+(pos+1)*30+"px"
        already = document.getElementById assignment.id+weekId
        if already? # Assignment already exists
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
        window.scrollTo 0, scroll

      document.body.classList.add "noList" if document.querySelectorAll(".assignment.listDisp:not(.done)").length == 0
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
      , 300

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

Now we assign it to clicking the background.

    document.getElementById("background").addEventListener "click", closeOpened

Then, the tabs are made interactive.

    for tab in document.querySelectorAll ".tabs>li"
      tab.addEventListener "click", (evt) ->
        document.body.setAttribute "data-view", (Array::slice.call document.querySelectorAll ".tabs>li").indexOf evt.target
        if document.body.getAttribute("data-view") == "1"
          window.addEventListener "resize", resize
          start = null
          step = (timestamp) ->
            start ?= timestamp
            resize()
            if timestamp-start < 300
              window.requestAnimationFrame step
          window.requestAnimationFrame step
        else
          window.scrollTo 0, scroll
          setTimeout ->
            document.querySelector("nav").classList.remove "headroom--unpinned"
            document.querySelector("nav").classList.add "headroom--pinned"
          , 1000
          window.removeEventListener "resize", resize
          for assignment in document.getElementsByClassName "assignment"
            assignment.style.top = "auto"
        return

For list view, the assignments can't be on top of each other.
Therefore, a listener is attached to the resizing of the browser window.

    resize = ->
      #To calculate the number of columns, the below algorithm is used becase as the screen size increases, the column width increases
      widths = [300,800,1500,2400,3500,4800]
      columns = null
      for w,index in widths
        columns = index+1 if window.innerWidth > w
      columnHeights = (0 for [0...columns])
      assignments = Array::slice.call document.querySelectorAll(".assignment.listDisp:not(.done)")
      assignments.sort (a,b) ->
        a.getElementsByClassName("due")[0].value-b.getElementsByClassName("due")[0].value
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
      , 300
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
      document.getElementById("sideNav").classList.add "active"
      document.getElementById("sideBackground").style.display = "block"

    document.getElementById("sideBackground").addEventListener "click", ->
      document.getElementById("sideNav").classList.remove "active"
      setTimeout ->
        document.getElementById("sideBackground").style.display = "none"
      , 300

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

<a name="settings"/>
Settings
--------

To bring up the settings windows, an event listener needs to be added to the button.

    document.getElementById("settingsB").addEventListener "click", ->
      document.body.classList.add "settingsShown"
      document.getElementById("brand").innerHTML = "Settings"
      setTimeout ->
        document.querySelector("main").style.display = "none"

The back button also needs to close the settings window.

    document.getElementById("backButton").addEventListener "click", ->
      document.querySelector("main").style.display = "block"
      document.body.classList.remove "settingsShown"
      document.getElementById("brand").innerHTML = "Check PCR"

The code below is what the settings actually control.

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

<a name="starting"/>
Starting everything
-------------------

Finally! We are (almost) done!
For updating, a request will be send to Github to get the current commit id and check that against what's stored

    do ->
      send "https://api.github.com/repos/19RyanA/CheckPCR/git/refs/heads/master", "json"
        .then (resp) ->
          last = localStorage["commit"]
          c = resp.response.object.sha;
          console.debug(last, c);
          if not last?
            localStorage["commit"] = c
          else if last isnt c
            res = prompt "Please update the application from https://github.com/19RyanA/CheckPCR.\n\n
              If you have already updated the application, type anything you want into the textfield below then click ok.
              Otherwise, click ok or cancel."
            if res? and res.length > 0
              localStorage["commit"] = c

The completed assignments are then loaded.

    done = []
    if localStorage["done"]?
      done = JSON.parse localStorage["done"]

Now, we load the saved assignments (if any) and fetch the current assignments from PCR.

    if localStorage["data"]?
      window.data = JSON.parse localStorage["data"]
      display()

    fetch()
