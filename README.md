Check PCR
========

A client for the homework system currently used by the Harker School, PCR.

********************************************************************************************************************************************************************
**<center>If you want to see the whole month in calendar view, leave PCR in month view. Otherwise, if you only want to see one week, put it on list view.</center>**
********************************************************************************************************************************************************************

Usage
-----
Because this is not an official chrome app (so you can't find it on the webstore), you'll have to manually install it by following the directions below.

1. Download the repository.
2. Navigate to `chrome://extensions` in Google Chrome.
3. Make sure the "Developer mode" checkbox in the top is checked.
4. Click "Load unpacked extension..." and choose the repository's folder.
5. Go to `chrome://apps` and click the "Check PCR" icon or use an alternate new tab page to access the app (It should behave just like any other chrome app).

If there are any problems with the program or completing the above steps, please create an issue on Github.

Features
--------
### Immediate and Offline Loading
Each time data is successfully fetched from PCR, it will be saved to localStorage (Javascript's caching system).
Then, when you visit Check PCR again, whatever was saved last to localStorage will be loaded, regardless of internet connectivity.

### List View and a Simpler Calendar view
![Calendar View](images/calendar.png?raw=true)

With list view, you can easily see all of the assignments due and assigned for the day.
Also, calendar view assignments are again shown as a solid bar across multiple days (see image above).

### Assignment completion tracking
You can mark when you have completed assignments. Completed assignments will then show up in a darker shade in calendar view and will disappear from list view.

### Automatic Login
If you click the "Remember me" checkbox when signing in, your password will be stored for 2 weeks, more than PCR will normally do. However, even though it is base64 encrypted then stored in a cookie, someone could easily open up the cookies for the site and use JavaScript to quickly decode it. Despite that, the probability of someone being able to do all of that on *your* computer is pretty unlikely.

### Automatic Link Detection
When teachers don't bother to turn their URL into a link, Check PCR will automatically make it clickable.

### Automatic scrolling
Once calendar view loads, it will automatically scroll to the current week. Also, the current day is highlighted in a darker shade (see the calendar view example).
