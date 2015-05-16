Check PCR
========

A client for the homework system currently used by the Harker School, PCR. It has been thoroughly tested on Windows with Python 2.7.5 and 3.3.0.

********************************************************************************************************************************************************************
**<center>If you want to see the whole month in calendar view, leave PCR in month view. Otherwise, if you only want to see one week, put it on list view.</center>**
********************************************************************************************************************************************************************

Usage
-----
1. Download the repository.
2. Create a shortcut to run `pcrv2.py` if you want one.
3. If you are using Windows, optionally download the [pywin32](http://sourceforge.net/projects/pywin32/) libary so that the program can create an icon in the tray so you can stop the program. Support for this on Macs will come in a later commit.
4. Run `pcrv2.py`. You should be able to do this by navigating to the folder you downloaded in a terminal/command prompt and running `python pcrv2.py` or dragging it to PythonLauncher (see https://docs.python.org/2/using/mac.html#how-to-run-a-python-script). If it complains about there not being a python command, then you'll probably have to install python from https://www.python.org/downloads.
5. In a browser, navigate to `http://localhost:9000` for calendar view or `http://localhost:9000/list` for list view. This is internal website created by the Python script that is only accessible by your computer.
6. **To quit the application (since it keeps on running in the background so you can visit Check PCR at any time), use the "Logout & Close" button:**
![Logout & Close button](images/logoutClose.png?raw=true)

If there are any problems with the program or completing the above steps, please create an issue on the repository.

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
