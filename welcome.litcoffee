Welcome to the welcome file.

This script runs on the welcome page, which welcomes new users, to make it more welcoming.
If you haven't already, I welcome you to view the more important [main script](client.litcoffee).

Also, if you haven't noticed yet, I'm trying my best to use the word welcome as many times as I can just to welcome you.

First off, the buttons big, green, welcoming buttons on the bottom of the welcome page are assigned event listeners so that they can make the page show more welcoming information.

    for nextButton in document.getElementsByClassName "next"
      nextButton.addEventListener "click", advance = ->
        # The box holding the individual pages that ge scrolled
        # when pressing the "next" button is assigned to a varialbe.
        container = document.body
        # show the next page
        view = +container.getAttribute("data-view")
        (npage = document.querySelector("section:nth-child(#{view+2})")).style.display = "inline-block"
        npage.style.transform = npage.style.webkitTransform = npage.style.MozTransform = "translateX(#{view*100}%)"
        # increase the data-view attribute by 1. The rest is handled by the css.
        container.setAttribute "data-view", view+1
        window.scrollTo(0,0) # Scoll to top of the page
        setTimeout ->
          #After animating is done, don't display the first page
          npage.style.transform = npage.style.webkitTransform = npage.style.MozTransform = "translateX(#{view+1}00%)"
          document.querySelector("section:nth-child(#{view+1})").style.display = "none"
        , 50
        return

Additionally, the active class needs to be added when text fields are selected (for the login box) [copied from main script].

    for input in document.querySelectorAll "input[type=text], input[type=password], input[type=email], input[type=url], input[type=tel], input[type=number], input[type=search]"
      input.addEventListener "change", (evt) ->
        evt.target.parentNode.querySelector("label").classList.add "active"
      input.addEventListener "focus", (evt) ->
        evt.target.parentNode.querySelector("label").classList.add "active"
      input.addEventListener "blur", (evt) ->
        if evt.target.value.length is 0
          evt.target.parentNode.querySelector("label").classList.remove "active"

When there is an error with parsing the data for Athena, a welcoming warning needs to be displayed (and the data needs to be saved too).

This code below is copied from the main script with two unwelcome lines commented out.

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
          #document.getElementById("athenaDataRefresh").style.display = "block"
          #display()
        catch e
          document.getElementById("athenaDataError").style.display = "block"
          #document.getElementById("athenaDataRefresh").style.display = "none"
          document.getElementById("athenaDataError").innerHTML = e.message
      return

The text box also needs to execute this function when anything is typed / pasted.

    document.getElementById("athenaData").addEventListener "input", (evt) ->
      parseAthenaData evt.target.value

To avoid some unwelcoming errors, some constants are defined.

    loginURL = ""
    loginHeaders = {}
    viewData = {} # The data to send when switching PCR views

The following code is copied from the main script and slightly modified since there is no login dialog.

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

    setCookie = (cname, cvalue, exdays) ->
      d = new Date
      d.setTime d.getTime() + exdays * 24 * 60 * 60 * 1000
      expires = "expires=" + d.toUTCString()
      document.cookie = cname + "=" + cvalue + "; " + expires
      return

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

    dologin = (val, submitEvt=false) ->
      document.getElementById("login").classList.remove "active"
      # setTimeout ->
      #   document.getElementById("loginBackground").style.display = "none"
      # , 350
      postArray = [] # Array of data to post
      localStorage["username"] = if val? and not submitEvt then val[0] else document.getElementById("username").value
      # updateAvatar()
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
              # If PCR still wants us to log in, then the username or password enterred were incorrect.
              document.getElementById("loginIncorrect").style.display = "block"
              document.getElementById("password").value = ""

              #document.getElementById("login").classList.add "active"
              #document.getElementById("loginBackground").style.display = "block"
            else
              # Otherwise, we are logged in
              if document.getElementById("remember").checked #Is the "remember me" checkbox checked?
                setCookie "userPass", window.btoa(document.getElementById("username").value + ":" + document.getElementById("password").value), 14 # Set a cookie with the username and password so we can log in automatically in the future without having to prompt for a username and password again
              # loadingBar.style.display = "none"
              t = Date.now()
              localStorage["lastUpdate"] = t
              #document.getElementById("lastUpdate").innerHTML = formatUpdate t
              try
                parse resp.response # Parse the data PCR has replied with
                display() # Added
              catch e
                console.log e
                alert "Error parsing assignments. Is PCR on list or month view?"
              return
          , (error) ->
            console.log "Could not log in to PCR. Either your network connection was lost during your visit or PCR is just not working. Here's the error:", error
      else
        console.log postArray
        send "/api/login?remember=#{document.getElementById("remember").checked}", "json", { "Content-type": "application/x-www-form-urlencoded" }, postArray.join("&"), true
          .then (resp) ->
            console.debug "Logging in:",resp.response.time
            if resp.response.login
              # If PCR still wants us to log in, then the username or password enterred were incorrect.
              document.getElementById("loginIncorrect").style.display = "block"
              document.getElementById("password").value = ""

              # document.getElementById("login").classList.add "active"
              # document.getElementById("loginBackground").style.display = "block"
            else
              t = Date.now()
              localStorage["lastUpdate"] = t
              #document.getElementById("lastUpdate").innerHTML = formatUpdate t

              window.data = resp.response.data
              display()
              localStorage["data"] = JSON.stringify(data)
            return
          , (error) ->
            console.log "Could not log in to PCR. Either your network connection was lost during your visit or PCR is just not working. Here's the error:", error
      return

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

    urlify = (text) ->
      text.replace /// (
        https?:\/\/                  # http:// or https://
        [-A-Z0-9+&@#\/%?=~_|!:,.;]*  # Any number of url-OK characters
        [-A-Z0-9+&@#\/%=~_|]+        # At least one url-OK character except ?, !, :, ,, ., and ;
      )///ig, (str, str2, offset) -> # Function to replace matches
        if /href\s*=\s*./.test(text.substring(offset - 10, offset)) then str else '<a href="' + str + '">' + str + '</a>'

    findId = (element, tag, id) ->
      for e in element.getElementsByTagName(tag)
        if e.id.indexOf(id) isnt -1
          return e
      return

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

      #display() # Display the data
      localStorage["data"] = JSON.stringify(data) # Store for offline use
      return

A slightly modified fetch function is then called

    do ->
      if location.protocol is "chrome-extension:"
        console.time "Fetching assignments"
        send "https://webappsca.pcrsoft.com/Clue/SC-Assignments-End-Date-Range/7536", "document"
          .then (resp) ->
            console.timeEnd "Fetching assignments"
            if resp.responseURL.indexOf("Login") isnt -1
              # We have to log in now
              loginURL = resp.responseURL
              for e in resp.response.getElementsByTagName("input")
                loginHeaders[e.name] = e.value or ""
              console.log "Need to log in"
              ### up = getCookie("userPass") # Attempts to get the cookie *userPass*, which is set if the "Remember me" checkbox is checked when logging in through CheckPCR
              if up is ""
                document.getElementById("loginBackground").style.display = "block"
                document.getElementById("login").classList.add "active"
              else
                dologin window.atob(up).split(":") # Because we were remembered, we can log in immediately without waiting for the user to log in through the login form
              ###
              # Add login button event listeners and enable the login button
              document.getElementById("login").classList.add "ready"
              document.getElementById("login").addEventListener "submit", (evt) ->
                evt.preventDefault()
                dologin(null, true)
            else
              # Logged in now
              console.log "Fetching assignments successful"
              t = Date.now()
              localStorage["lastUpdate"] = t
              # document.getElementById("lastUpdate").innerHTML = formatUpdate t
              try
                parse resp.response
              catch e
                console.log e
                alert "Error parsing assignments. Is PCR on list or month view?"
              document.getElementById("loginNext").style.display = ""
              document.getElementById("login").classList.add "done"
            return
          , (error) ->
            console.log "Could not fetch assignments; You are probably offline. Here's the error:", error
            snackbar "You must be online to set up Check PCR. Please refresh when the internet works."
            return
      else
        send "/api/start", "json"
          .then (resp) ->
            console.debug "Fetching assignments:",resp.response.time
            if resp.response.login
              loginHeaders = resp.response.loginHeaders
              # document.getElementById("loginBackground").style.display = "block"
              # document.getElementById("login").classList.add "active"
              # Add login button event listeners and enable the login button
              document.getElementById("login").classList.add "ready"
              document.getElementById("login").addEventListener "submit", (evt) ->
                evt.preventDefault()
                dologin(null, true)
            else
              console.log "Fetching assignments successful"
              t = Date.now()
              localStorage["lastUpdate"] = t
              # document.getElementById("lastUpdate").innerHTML = formatUpdate t

              window.data = resp.response.data
              localStorage["data"] = JSON.stringify(data)
              document.getElementById("loginNext").style.display = ""
              document.getElementById("login").classList.add "done"
            return
          , (error) ->
            console.log "Could not fetch assignments; You are probably offline. Here's the error:", error
            snackbar "Could not fetch your assignments", "Retry", fetch
      return

The display function is set to advance the setup proccess so there aren't any unwelcoming errors.

    display = advance
