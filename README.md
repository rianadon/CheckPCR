Check PCR
========

A client for the homework system currently used by the Harker School, PCR.

********************************************************************************************************************************************************************
**<center>If you want to see the whole month in calendar view, leave PCR in month view. Otherwise, if you only want to see one week, put it on list view.</center>**
********************************************************************************************************************************************************************

If you are feeling bored and have nothing else to do or are suspicious of what the program does with your password, **feel free to take a look at the [main Literate CoffeeScript code](client.litcoffee) and [the code that runs on the welcome page](start.litcoffee)**.

The app also uses several other scripts created by other people which are:
- headroom.js, downloaded from [here](http://wicky.nillia.ms/headroom.js/), which toggles the navbar visibility
- hammer.js, downloaded from [here](http://hammerjs.github.io/dist/hammer.min.js), which enables touch interactions events such as panning and swiping
- Chrono, downloaded from[here](https://github.com/wanasit/chrono), which parses dates given in natural language
- Google's Diff, Match, and Patch library from [here](http://code.google.com/p/google-diff-match-patch/), which does diffing as the name states

Installing
----------
Because I chose not to publish Check PCR on the Chrome Webstore, you'll have to install it in developer mode by following the directions below.

1. Download the repository either through clicking the "Download zip" button and unzipping the zip file or, if you've installed git, running this in a terminal:

		git clone https://github.com/19RyanA/CheckPCR

2. Navigate to `chrome://extensions` in Google Chrome.

3. Make sure the "Developer mode" checkbox in the top is checked.
![Developer mode](images/developer.png?raw=true)

4. Click "Load unpacked extension..." and choose the folder that you downloaded or cloned into.

5. Go to `chrome://apps` and click the "Check PCR" icon (it should behave just like any other chrome app).

*You may also see a "disable developer mode extensions" dialog box every time you start Chrome. That is because by following the above steps, you have just installed CheckPCR in developer mode.*

If there are any problems with the program or completing the above steps, please create an issue on Github.

Compiling / Hacking
-------------------

First of all, if you want to change anything and have that change preserved when updating, you **must** use git to clone the repository.

Now, if you want to change anything in the extension, you have two choices.
You can either
1. Directly modify the JavaScript and CSS files
2. Modify the CoffeeScript and Sass files (better)

If you really must, you can go with the first option. However, I cannot stress just how much I recommend the second option, especially if you don't want to be plagued with merge conflicts.

To compile the CoffeeScript and Sass files, you again have two options.
1. The first is to download (if you haven't already) [Node.js](https://nodejs.org) from its website, [CoffeeScript](http://coffeescript.org/) by running `npm install -g coffee-script`, and [Sass](http://sass-lang.com/) by following the instructions [here](http://sass-lang.com/install).

	Once you've done that, you can use `coffee -b -c client.litcoffee` to compile the main JavaScript file and `sass style.sass style.css` to compile the main stylesheet.

2. The other is to use gulp. As in option 1, you'll need to have Node.js installed. Open a terminal and run `npm install -g gulp`, then navigate to the folder that you cloned into and run `npm install gulp gulp-coffee gulp-sass gulp-util`.

	You can also use `gulp-ruby-sass` instead of `gulp-sass`, which I use (making your version less different than mine), but it requires the Sass Ruby gem to be installed (see the link above on how to download the Sass gem).

If you have fixed any bugs or added any useful features, I would be ecstatic if you sent a pull request.

Features
--------
### Immediate and Offline Loading
Each time data is successfully fetched from PCR, it will be saved to localStorage (JavaScript's caching system).
Then, when you visit Check PCR again, whatever was saved last to localStorage will be loaded, regardless of internet connectivity.

### List View and a Simpler Calendar view
<img src="https://raw.githubusercontent.com/19RyanA/CheckPCR/master/images/calendar.png" width="50%"><img src="https://raw.githubusercontent.com/19RyanA/CheckPCR/master/images/list.png" width="50%">

With list view, you can easily see all of the assignments due and assigned for the day, like in HHMS.
Also, calendar view assignments are again shown as a solid bar across multiple days.

### Assignment completion tracking
You can mark when you have completed assignments. Completed assignments will then show up in a darker shade in calendar view and will disappear from list view.

### Automatic Login
If you click the "Remember me" checkbox when signing in, your password will be stored for 2 weeks, more than PCR will normally do. However, even though it is base64 encrypted then stored in a cookie, someone could easily open up the cookies for the site and use JavaScript to quickly decode it. Despite that, the probability of someone being able to do all of that on *your* computer is pretty unlikely.

### Automatic Link Detection
Check PCR will automatically make all links clickable in assignments.

### And much more
You'll just have to install the app to know.

To Do
-----

See the wiki at https://github.com/19RyanA/CheckPCR/wiki.
