Check PCR
========

A client for the homework system currently used by the Harker School, PCR. It has been thoroughly tested on Windows with Python 2.7.5 and 3.3.0.

*************************************************************************************
**<center>Important: PCR must be left in month view. If it is not, Check PCR will not work!</center>**
*************************************************************************************

Usage
-----
1. Download the repository.
2. Create a shortcut to run `pcrv2.py`.
3. Run `pcrv2.py`.
3. In a browser, navigate to `http://localhost:9000` for month view or `http://localhost:9000/list` for list view. This is internal website created by the Python script that is only accessible by your computer.

If there are any problems with the program or completing the above steps, please create an issue on the repository.

Features
--------
### Immediate and Offline Loading
Each time data is successfully fetched from PCR, it will be saved to localStorage (Javascript's caching system).
Then, when you visit Check PCR again, whatever was saved last to localStorage will be loaded, regardless of internet connectivity.

### List View and a Simpler Month view
![Month View](images/month.png?raw=true)

With list view, you can easily see all of the assignments due and assigned for the day.
Also, month view assignments are again shown as a solid bar across multiple days (see image above).

### Assignment completion tracking
You can mark when you have completed assignments. Completed assignments will then show up in a darker shade in month view and will disappear from list view.

### Automatic Login
If you click the "Remember me" checkbox when signing in, your password will be stored for 2 weeks, more than PCR will normally do. However, even though it is base64 encrypted then stored in a cookie, someone could easily open up the cookies for the site and use JavaScript to quickly decode it. Despite that, the probability of someone being able to do all of that on *your* computer is pretty unlikely.

### Automatic Link Detection
When teachers don't bother to turn their URL into a link, Check PCR will automatically make it clickable.

### Automatic scrolling
Once month view loads, it will automatically scroll to the current week. Also, the current day is highlighted in a darker shade (see the month view example).
