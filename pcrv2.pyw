#! /usr/bin/python
import urllib, json
try:
    from urllib2 import build_opener, install_opener, HTTPRedirectHandler, HTTPCookieProcessor, urlopen
    from cookielib import CookieJar
    from BaseHTTPServer import HTTPServer
    from SocketServer import ThreadingMixIn
    from SimpleHTTPServer import SimpleHTTPRequestHandler
    from thread import start_new_thread
    from HTMLParser import HTMLParser
except ImportError:
    from urllib.request import build_opener, install_opener, HTTPRedirectHandler, HTTPCookieProcessor, urlopen
    from http.cookiejar import CookieJar
    from http.server import HTTPServer, SimpleHTTPRequestHandler
    from socketserver import ThreadingMixIn
    from _thread import start_new_thread
    from html.parser import HTMLParser
import os, fnmatch, subprocess, threading, sys

os.chdir(os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__))))

toLoginData = dict()
toLoginDataOther = dict()
loginUrl = ""

cj = CookieJar()
opener = build_opener(HTTPRedirectHandler, HTTPCookieProcessor(cj))
install_opener(opener)

x = None

assignments = list()

class ThreadingServer(ThreadingMixIn, HTTPServer):
    pass

#Parse input tags
class InputParser(HTMLParser):
    def handle_starttag(self, tag, attrs):
        if tag == "input":
            name = ""
            value = ""
            for t in attrs:
                if t[0] == "name":
                    name = t[1]
                elif t[0] == "value":
                    value = t[1]
            if name != "":
                if "user" in name.lower() or "pass" in name.lower():
                    toLoginData[name] = value
                else:
                    toLoginDataOther[name] = value
#Parse assignments
class AssignmentParser(HTMLParser):
    def handle_starttag(self, tag, attrs):
        if tag == "input":
            name = ""
            value = ""
            for t in attrs:
                if t[0] == "name":
                    name = t[1]
                elif t[0] == "value":
                    value = t[1]
            if name != "":
                toLoginDataOther[name] = value
def q(tray=None):
    os._exit(1)
class RequestHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        global loginUrl, assignments
        if self.path == '/' or self.path == '/list':
            self.path = main
        elif self.path == '/commit':
            try:
                with open('commit.txt', 'r') as f:
                    r = f.read()
                    self.request.sendall("!" if len(r) == 0 else r)
            except IOError:
                self.request.sendall("!")
            return
        elif self.path == '/setcommit':
            with open('commit.txt', 'w') as f:
                f.write(self.headers.get("commit"))
            self.request.sendall(self.headers.get("commit"))
            return
        elif self.path == '/start':
            url = 'https://webappsca.pcrsoft.com/Clue/Student-Assignments-End-Date-Range/7536'
            try:
                r = urlopen(url)
                if 'Login' in r.url:
                    self.request.sendall("Login")
                    loginUrl = r.url
                    parser = InputParser()
                    parser.feed(r.read())
                else:
                    read = r.read()
                    ap = AssignmentParser()
                    ap.feed(read)
                    self.request.sendall(read)
            except:
                self.request.sendall("Load")
            return
        elif self.path == '/login':
            for x in toLoginData.iterkeys():
                if "user" in x.lower():
                    toLoginData[x]=self.headers.get("user")
                elif "pass" in x.lower():
                    toLoginData[x] = self.headers.get("pass")
            toLoginDataOther.update(toLoginData)
            r = urlopen(loginUrl, data=urllib.urlencode(toLoginDataOther))
            if r.url == loginUrl:
                self.request.sendall("Login")
            else:
                read = r.read()
                ap = AssignmentParser()
                ap.feed(read)
                self.request.sendall(read)
            return
        elif self.path == '/quit':
            self.request.sendall("Going to quit in 1 second");
            t = threading.Timer(1, q)
            t.start()
            return
        return SimpleHTTPRequestHandler.do_GET(self)

main = "index.html"

PORT = 9000
def createTaskbarIcon():
    def at():
        try:
            import applicationTray
            hover_text = "PCR viewer"
            def launchApp(sysTrayIcon): launchWindow()
            menu_options = (('Launch app', None, launchApp), ('Also lauch app', None, launchApp))
            applicationTray.SysTrayIcon("favicon.ico", hover_text, menu_options, on_quit=q)
        except ImportError:
            pass

    start_new_thread(at, ())


def launchWindow():
    if os.name == 'nt':
        subprocess.call('start chrome --chrome-frame --app="http://localhost:9000"', shell=True)
    else:
        subprocess.call('open -a "Google Chrome" --args --app="http://localhost:9000"', shell=True)

t = threading.Timer(0.5, launchWindow)
t.start()
try:
    httpd = ThreadingServer(("localhost", PORT), RequestHandler)
    createTaskbarIcon()
    httpd.serve_forever()
except:
    pass #already running
