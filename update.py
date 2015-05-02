try:
    from urllib2 import urlopen
except ImportError:
    from urllib.request import urlopen
import json, codecs
reader = codecs.getreader("utf-8")
commit = json.load(reader(urlopen("https://api.github.com/repos/19RyanA/CheckPCR/git/refs/heads/master")))['object']['sha']
lastCommit = ""
try:
    with open('commit.txt', 'r') as f:
        lastCommit = f.read()
except IOError:
    pass #file does not exist yet
if lastCommit == "":
    with open('commit.txt', 'w') as f:
        f.write(commit)
else:
    if lastCommit != commit:
        try:
            from Tkinter import *
        except:
            from tkinter import *
        root = Tk()
        root.tk.call('wm', 'iconbitmap', root._w, '-default', 'favicon.ico')
        root.wm_title("Upgrade")
        l = Label(root, text="Please upgrade the application from https://github.com/19RyanA/CheckPCR.")
        l.pack(pady=5, padx=10)
        b = Button(root, text="OK", command=root.destroy)
        b.pack(pady=5)
        root.update()
        root.mainloop()
